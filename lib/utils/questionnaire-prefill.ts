// Utilities for normalizing DB responses into questionnaire form values.
// Keep this file focused on prefill/data-shape normalization (not scoring).

import type { QuestionnaireDefinition } from '@/lib/constants/questionnaires';
import type { Question, QuestionOption } from '@/lib/types/database.types';

type UnknownRecord = Record<string, unknown>;

function normalizeIsoDateToYyyyMmDd(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  // Accept both YYYY-MM-DD and full ISO datetime strings.
  const m = value.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : value;
}

function parsePostgresTextArray(value: string): string[] | null {
  // Very small parser for Postgres array text output like: {"A","B"} or {A,B}
  // Not intended for nested arrays.
  const trimmed = value.trim();
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) return null;
  const inner = trimmed.slice(1, -1);
  if (inner === '') return [];

  const out: string[] = [];
  let current = '';
  let inQuotes = false;
  let escape = false;
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if (escape) {
      current += ch;
      escape = false;
      continue;
    }
    if (ch === '\\') {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      out.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  out.push(current);
  return out.map((s) => s.trim()).filter((s) => s.length > 0);
}

function optionsAsObjects(q: Question): QuestionOption[] {
  if (!q.options) return [];
  return q.options.map((opt) => {
    if (typeof opt === 'string') return { code: opt, label: opt };
    return opt;
  });
}

function normalizeBooleanish(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (value === 1) return true;
    if (value === 0) return false;
    return null;
  }
  if (typeof value !== 'string') return null;
  const v = value.trim().toLowerCase();
  if (['true', 't', '1', 'yes', 'y', 'oui', 'o'].includes(v)) return true;
  if (['false', 'f', '0', 'no', 'n', 'non'].includes(v)) return false;
  return null;
}

function findMatchingOptionCode(q: Question, rawValue: unknown): unknown {
  const opts = optionsAsObjects(q);
  if (opts.length === 0) return rawValue;

  // Fast path: exact match on code (including number codes).
  for (const opt of opts) {
    if (rawValue === opt.code) return opt.code;
    if (typeof opt.code === 'number' && typeof rawValue === 'string') {
      const asNumber = Number(rawValue);
      if (!Number.isNaN(asNumber) && asNumber === opt.code) return opt.code;
    }
  }

  // Boolean-ish normalization to common option codes.
  const b = normalizeBooleanish(rawValue);
  if (b !== null) {
    const preferred = b ? ['oui', 'yes', 'true', 't', '1'] : ['non', 'no', 'false', 'f', '0'];
    for (const candidate of preferred) {
      const found = opts.find((o) => String(o.code).toLowerCase() === candidate);
      if (found) return found.code;
    }
  }

  // Case-insensitive match against code or label.
  if (typeof rawValue === 'string' || typeof rawValue === 'number') {
    const needle = String(rawValue).trim().toLowerCase();
    for (const opt of opts) {
      if (String(opt.code).trim().toLowerCase() === needle) return opt.code;
      if (String(opt.label).trim().toLowerCase() === needle) return opt.code;
    }
  }

  return rawValue;
}

function coerceNumber(value: unknown): unknown {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (trimmed === '') return value;
  const n = Number(trimmed);
  return Number.isNaN(n) ? value : n;
}

function applyKnownLegacyMappings(questionnaireCode: string, record: UnknownRecord): UnknownRecord {
  if (questionnaireCode !== 'DSM5_COMORBID') return record;

  // In production data, older columns `panic_no_agoraphobia_*` / `panic_with_agoraphobia_*`
  // can contain the answer while the newer consolidated `panic_disorder_*` columns are null.
  //
  // Map legacy -> current IDs used by the questionnaire renderer.
  const currentPresent = record.panic_disorder_present;
  const currentType = record.panic_disorder_type;

  const legacyNoPresent = record.panic_no_agoraphobia_present;
  const legacyWithPresent = record.panic_with_agoraphobia_present;

  const hasLegacy =
    legacyNoPresent !== undefined ||
    legacyWithPresent !== undefined ||
    record.panic_no_agoraphobia_age_debut !== undefined ||
    record.panic_with_agoraphobia_age_debut !== undefined ||
    record.panic_no_agoraphobia_symptoms_past_month !== undefined ||
    record.panic_with_agoraphobia_symptoms_past_month !== undefined;

  // Only backfill if current fields are empty-ish.
  if (hasLegacy && (currentPresent === null || currentPresent === undefined || currentPresent === '')) {
    const noYes = normalizeBooleanish(legacyNoPresent) === true || legacyNoPresent === 'oui' || legacyNoPresent === 'Oui';
    const withYes = normalizeBooleanish(legacyWithPresent) === true || legacyWithPresent === 'oui' || legacyWithPresent === 'Oui';

    if (withYes) {
      record.panic_disorder_present = 'oui';
      record.panic_disorder_type = 'avec_agoraphobie';
      if (record.panic_disorder_age_debut == null) {
        record.panic_disorder_age_debut = record.panic_with_agoraphobia_age_debut;
      }
      if (record.panic_disorder_symptoms_past_month == null) {
        record.panic_disorder_symptoms_past_month = record.panic_with_agoraphobia_symptoms_past_month;
      }
    } else if (noYes) {
      record.panic_disorder_present = 'oui';
      record.panic_disorder_type = 'sans_agoraphobie';
      if (record.panic_disorder_age_debut == null) {
        record.panic_disorder_age_debut = record.panic_no_agoraphobia_age_debut;
      }
      if (record.panic_disorder_symptoms_past_month == null) {
        record.panic_disorder_symptoms_past_month = record.panic_no_agoraphobia_symptoms_past_month;
      }
    } else if (legacyNoPresent !== undefined || legacyWithPresent !== undefined) {
      // If legacy explicitly says no, fill a conservative "non".
      const noNo = normalizeBooleanish(legacyNoPresent) === false || legacyNoPresent === 'non' || legacyNoPresent === 'Non';
      const withNo = normalizeBooleanish(legacyWithPresent) === false || legacyWithPresent === 'non' || legacyWithPresent === 'Non';
      if (noNo && withNo) {
        record.panic_disorder_present = 'non';
      }
    }
  }

  // Some older exports stored arrays as Postgres array strings; normalize to arrays.
  for (const [k, v] of Object.entries(record)) {
    if (typeof v === 'string') {
      const parsed = parsePostgresTextArray(v);
      if (parsed) record[k] = parsed;
    }
  }

  // Prevent unused variable linting for currentType in case we expand logic later.
  void currentType;
  return record;
}

export function normalizeResponseForQuestionnaireForm(
  questionnaire: QuestionnaireDefinition,
  response: UnknownRecord
): UnknownRecord {
  const normalized: UnknownRecord = applyKnownLegacyMappings(questionnaire.code, { ...response });

  for (const q of questionnaire.questions) {
    const value = normalized[q.id];
    if (value === undefined || value === null) continue;

    if (q.type === 'single_choice') {
      normalized[q.id] = findMatchingOptionCode(q, value);
      continue;
    }

    if (q.type === 'multiple_choice') {
      const opts = optionsAsObjects(q);
      const normalizeOne = (v: unknown) => {
        // Reuse the single-choice matcher but keep it stringly.
        const asSingle = findMatchingOptionCode({ ...q, type: 'single_choice', options: opts } as Question, v);
        return asSingle;
      };

      if (Array.isArray(value)) {
        normalized[q.id] = value.map(normalizeOne);
        continue;
      }

      if (typeof value === 'string') {
        // Try JSON array first.
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            normalized[q.id] = parsed.map(normalizeOne);
            continue;
          }
        } catch {
          // ignore
        }

        const pg = parsePostgresTextArray(value);
        if (pg) {
          normalized[q.id] = pg.map(normalizeOne);
          continue;
        }

        // Last resort: comma-separated list.
        if (value.includes(',')) {
          normalized[q.id] = value.split(',').map((s) => normalizeOne(s.trim()));
          continue;
        }
      }

      continue;
    }

    if (q.type === 'number' || q.type === 'scale') {
      normalized[q.id] = coerceNumber(value);
      continue;
    }

    if (q.type === 'date') {
      normalized[q.id] = normalizeIsoDateToYyyyMmDd(value);
      continue;
    }
  }

  return normalized;
}

/**
 * Some legacy data paths stored boolean values (or 'true'/'false' strings) for fields
 * that are modeled as 'oui'/'non' single_choice in the questionnaire renderer.
 *
 * This helper normalizes those values for the DSM5 comorbid questionnaire form.
 */
export function normalizeDsm5ComorbidResponseForForm(
  response: Record<string, unknown>
): Record<string, unknown> {
  const normalized: Record<string, unknown> = { ...response };

  for (const [key, value] of Object.entries(normalized)) {
    // Normalize common variants into the renderer's expected codes.
    if (value === true || value === 1 || value === '1' || value === 'true' || value === 't') {
      normalized[key] = 'oui';
      continue;
    }
    if (value === false || value === 0 || value === '0' || value === 'false' || value === 'f') {
      normalized[key] = 'non';
      continue;
    }

    // Normalize capitalization variants sometimes seen in migrated rows.
    if (value === 'Oui') {
      normalized[key] = 'oui';
      continue;
    }
    if (value === 'Non') {
      normalized[key] = 'non';
      continue;
    }
  }

  return normalized;
}

