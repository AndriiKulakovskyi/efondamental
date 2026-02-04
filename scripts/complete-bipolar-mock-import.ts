#!/usr/bin/env npx tsx
/**
 * Completes `mock-import-data-bipolar.json` by ensuring that bipolar Screening and
 * Initial Evaluation visits contain every expected questionnaire entry.
 *
 * IMPORTANT: This script writes ONLY raw answers (DB-native types) and never
 * imports computed score fields.
 *
 * It is intended to be idempotent: running it multiple times should not create
 * duplicate questionnaire entries.
 */

import * as fs from 'fs';
import * as path from 'path';

type ImportQuestionnaireResponse = {
  code: string;
  responses: Record<string, any>;
};

type ImportVisit = {
  visit_type: string;
  visit_number?: number;
  scheduled_date: string;
  completed_date?: string;
  status: string;
  notes?: string;
  questionnaires?: ImportQuestionnaireResponse[];
};

type ImportPatient = {
  medical_record_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  place_of_birth?: string;
  years_of_education?: number;
  visits?: ImportVisit[];
};

const WORKSPACE_ROOT = process.cwd();
const MOCK_PATH = path.resolve(WORKSPACE_ROOT, 'mock-import-data-bipolar.json');
const SCHEMA_PATH = path.resolve(WORKSPACE_ROOT, 'supabase', 'schema.sql');

const SCREENING_CODES = [
  'ASRM',
  'QIDS_SR16',
  'MDQ',
  'BIPOLAR_DIAGNOSTIC',
  'BIPOLAR_ORIENTATION',
] as const;

// Initial evaluation codes: taken from `lib/services/bipolar-initial.service.ts` table map
// + `ASRM` (reused from screening in initial evaluation, per RPC + UI module list).
const INITIAL_EVAL_CODES = [
  // Nurse
  'TOBACCO',
  'FAGERSTROM',
  'PHYSICAL_PARAMS',
  'BLOOD_PRESSURE',
  'ECG',
  'SLEEP_APNEA',
  'BIOLOGICAL_ASSESSMENT',
  // Thymic
  'MADRS',
  'YMRS',
  'CGI',
  'EGF',
  'ALDA',
  'ETAT_PATIENT',
  'FAST',
  // Auto ETAT
  'EQ5D5L',
  'PRISE_M',
  'STAI_YA',
  'MARS',
  'MATHYS',
  'PSQI',
  'EPWORTH',
  'QIDS_SR16',
  // Auto TRAITS
  'ASRS',
  'CTQ',
  'BIS10',
  'ALS18',
  'AIM',
  'WURS25',
  'AQ12',
  'CSM',
  'CTI',
  // Social
  'SOCIAL',
  // Medical
  'DSM5_HUMEUR',
  'DSM5_PSYCHOTIC',
  'DSM5_COMORBID',
  'DIVA',
  'FAMILY_HISTORY',
  'CSSRS',
  'ISA',
  'SIS',
  'SUICIDE_HISTORY',
  'PERINATALITE',
  'PATHO_NEURO',
  'PATHO_CARDIO',
  'PATHO_ENDOC',
  'PATHO_DERMATO',
  'PATHO_URINAIRE',
  'ANTECEDENTS_GYNECO',
  'PATHO_HEPATO_GASTRO',
  'PATHO_ALLERGIQUE',
  'AUTRES_PATHO',
  // Neuropsy
  'CVLT',
  'TMT',
  'STROOP',
  'FLUENCES_VERBALES',
  'MEM3_SPATIAL',
  'WAIS4_CRITERIA',
  'WAIS4_LEARNING',
  'WAIS4_MATRICES',
  'WAIS4_CODE',
  'WAIS4_DIGIT_SPAN',
  'WAIS4_SIMILITUDES',
  'WAIS3_CRITERIA',
  'WAIS3_LEARNING',
  'WAIS3_VOCABULAIRE',
  'WAIS3_MATRICES',
  'WAIS3_CODE_SYMBOLES',
  'WAIS3_DIGIT_SPAN',
  'WAIS3_CPT2',
  'COBRA',
  'CPT3',
  'SCIP',
  'TEST_COMMISSIONS',
  // Reused from screening
  'ASRM',
] as const;

// Semestrial / 6-month follow-up codes: taken from `lib/services/visit.service.ts`
// `visit_type: biannual_followup`
const BIANNUAL_FOLLOWUP_CODES = [
  // Nurse module (no ECG in biannual)
  'TOBACCO',
  'FAGERSTROM',
  'PHYSICAL_PARAMS',
  'BLOOD_PRESSURE',
  'SLEEP_APNEA',
  'BIOLOGICAL_ASSESSMENT',
  // Thymic evaluation
  'MADRS',
  'YMRS',
  'CGI',
  'EGF',
  'ALDA',
  'ETAT_PATIENT',
  'FAST',
  // Medical evaluation - DSM5
  'HUMEUR_ACTUELS',
  'HUMEUR_DEPUIS_VISITE',
  'PSYCHOTIQUES',
  // Suicide
  'ISA_FOLLOWUP',
  'SUICIDE_BEHAVIOR_FOLLOWUP',
  'CSSRS',
  // Soin / suivi / arrêt de travail
  'SUIVI_RECOMMANDATIONS',
  'RECOURS_AUX_SOINS',
  'TRAITEMENT_NON_PHARMACOLOGIQUE',
  'ARRETS_DE_TRAVAIL',
  'SOMATIQUE_CONTRACEPTIF',
  'STATUT_PROFESSIONNEL',
] as const;

// Annual evaluation codes: taken from `lib/services/visit.service.ts` (bipolar annual evaluation modules)
const ANNUAL_EVAL_CODES = [
  // Nurse (7)
  'TOBACCO',
  'FAGERSTROM',
  'PHYSICAL_PARAMS',
  'BLOOD_PRESSURE',
  'ECG',
  'SLEEP_APNEA',
  'BIOLOGICAL_ASSESSMENT',
  // Thymic evaluation (7)
  'MADRS',
  'ALDA',
  'YMRS',
  'FAST',
  'CGI',
  'EGF',
  'ETAT_PATIENT',
  // Medical - DSM5 (4)
  'DSM5_HUMEUR',
  'DSM5_PSYCHOTIC',
  'DSM5_COMORBID',
  'DIVA',
  // Medical - antecedents (1)
  'FAMILY_HISTORY',
  // Medical - suicide (4)
  'CSSRS',
  'ISA_FOLLOWUP',
  'SIS',
  'SUICIDE_HISTORY',
  // Medical - somatic history (10)
  'PERINATALITE',
  'PATHO_NEURO',
  'PATHO_CARDIO',
  'PATHO_ENDOC',
  'PATHO_DERMATO',
  'PATHO_URINAIRE',
  'ANTECEDENTS_GYNECO',
  'PATHO_HEPATO_GASTRO',
  'PATHO_ALLERGIQUE',
  'AUTRES_PATHO',
  // Medical - soin/suivi (6)
  'SUIVI_RECOMMANDATIONS',
  'RECOURS_AUX_SOINS',
  'TRAITEMENT_NON_PHARMACOLOGIQUE',
  'ARRETS_DE_TRAVAIL',
  'SOMATIQUE_CONTRACEPTIF',
  'STATUT_PROFESSIONNEL',
  // Neuropsych shared tests (5)
  'CVLT',
  'TMT',
  'STROOP',
  'FLUENCES_VERBALES',
  'MEM3_SPATIAL',
  // Neuropsych WAIS-III (7)
  'WAIS3_CRITERIA',
  'WAIS3_LEARNING',
  'WAIS3_VOCABULAIRE',
  'WAIS3_MATRICES',
  'WAIS3_CODE_SYMBOLES',
  'WAIS3_DIGIT_SPAN',
  'WAIS3_CPT2',
  // Neuropsych WAIS-IV (10)
  'WAIS4_CRITERIA',
  'WAIS4_LEARNING',
  'WAIS4_MATRICES',
  'WAIS4_CODE',
  'WAIS4_DIGIT_SPAN',
  'WAIS4_SIMILITUDES',
  'COBRA',
  'CPT3',
  'TEST_COMMISSIONS',
  'SCIP',
  // Auto ETAT (9)
  'EQ5D5L',
  'PRISE_M',
  'STAI_YA',
  'MARS',
  'MATHYS',
  'ASRM',
  'QIDS_SR16',
  'PSQI',
  'EPWORTH',
] as const;

const META_COLUMNS = new Set([
  'id',
  'visit_id',
  'patient_id',
  'completed_by',
  'completed_at',
  'created_at',
  'updated_at',
]);

/**
 * A conservative list of computed columns by questionnaire code that must NOT be imported.
 * This is intentionally broader than the current `import-scoring.service.ts` coverage,
 * because the application is responsible for computing these fields.
 */
const COMPUTED_COLUMNS_BY_CODE: Record<string, string[]> = {
  // Screening auto
  ASRM: ['total_score', 'interpretation'],
  QIDS_SR16: ['total_score', 'interpretation'],
  MDQ: ['q1_score', 'interpretation'],

  // Thymic
  MADRS: ['total_score', 'interpretation'],
  YMRS: ['total_score', 'interpretation'],
  CGI: ['interpretation'],
  EGF: ['interpretation'],
  FAST: [
    'total_score',
    'autonomy_score',
    'work_score',
    'cognitive_score',
    'finances_score',
    'relationships_score',
    'leisure_score',
    'interpretation',
  ],
  ALDA: ['score_a', 'b_total_score', 'total_score', 'alda_score', 'interpretation'],
  ETAT_PATIENT: ['depression_count', 'mania_count', 'interpretation'],

  // Nurse derived fields
  TOBACCO: ['interpretation', 'pack_years'],
  PHYSICAL_PARAMS: ['bmi', 'bmi_category', 'interpretation'],
  BLOOD_PRESSURE: ['tension_lying', 'tension_standing', 'interpretation'],
  SLEEP_APNEA: ['stop_bang_score', 'risk_level', 'interpretation'],
  BIOLOGICAL_ASSESSMENT: ['rapport_total_hdl', 'calcemie_corrigee', 'interpretation'],
  FAGERSTROM: ['total_score', 'interpretation'],

  // Auto ETAT
  EQ5D5L: ['health_state', 'profile_string', 'index_value', 'interpretation'],
  STAI_YA: ['note_t', 'total_score', 'interpretation', 'anxiety_level'],
  MARS: ['total_score', 'interpretation', 'adherence_percentage', 'adherence_subscore', 'attitude_subscore'],
  MATHYS: [
    'subscore_emotion',
    'subscore_motivation',
    'subscore_perception',
    'subscore_interaction',
    'subscore_cognition',
    'tristesse',
    'joie',
    'irritabilite',
    'panique',
    'anxiete',
    'colere',
    'exaltation',
    'total_score',
    'interpretation',
    'cognitive_speed',
    'emotional_hyperreactivity',
    'emotional_hyporeactivity',
    'motivation',
    'motor_activity',
  ],
  PRISE_M: [
    'total_score',
    'interpretation',
    'cardiac_score',
    'gastro_score',
    'items_scored',
    'neuro_score',
    'other_score',
    'sexual_score',
    'skin_score',
    'sleep_score',
    'urogenital_score',
    'vision_hearing_score',
    'tolerable_count',
    'painful_count',
  ],
  PSQI: [
    'c1_subjective_quality',
    'c2_latency',
    'c3_duration',
    'c4_efficiency',
    'c5_disturbances',
    'c6_medication',
    'c7_daytime_dysfunction',
    'total_score',
    'interpretation',
    'sleep_efficiency_pct',
    'time_in_bed_hours',
  ],
  EPWORTH: ['total_score', 'interpretation'],

  // Traits (scores computed)
  CTQ: [
    'emotional_abuse_score',
    'physical_abuse_score',
    'sexual_abuse_score',
    'emotional_neglect_score',
    'physical_neglect_score',
    'minimization_denial_score',
    'total_score',
    'emotional_abuse_severity',
    'physical_abuse_severity',
    'sexual_abuse_severity',
    'emotional_neglect_severity',
    'physical_neglect_severity',
    'interpretation',
  ],
  BIS10: ['attention_score', 'motor_score', 'non_planning_score', 'total_score', 'interpretation', 'mean_score'],
  ALS18: ['anxiety_score', 'depression_score', 'anger_score', 'total_score', 'interpretation'],
  AIM: ['total_score', 'mean_score', 'interpretation'],
  AQ12: ['social_skill_score', 'attention_switching_score', 'attention_to_detail_score', 'communication_score', 'imagination_score', 'total_score', 'interpretation'],
  CSM: ['total_score', 'chronotype', 'interpretation'],
  CTI: ['languidity_score', 'flexibility_score', 'total_score', 'interpretation', 'circadian_type'],

  // Neuropsy tests (computed standardized scores etc.)
  WAIS3_CODE_SYMBOLES: ['raw_score', 'scaled_score', 'percentile'],
  WAIS3_VOCABULAIRE: ['total_raw_score', 'standard_score', 'standardized_value'],
  WAIS3_MATRICES: ['total_raw_score', 'standard_score', 'standardized_value'],
  WAIS3_DIGIT_SPAN: [
    'mcod_total',
    'mcoi_total',
    'total_score',
    'empan_endroit',
    'empan_envers',
    'note_standard',
    'note_t',
    'z_score',
    'percentile',
    'interpretation',
  ],
  WAIS4_DIGIT_SPAN: [
    'mcod_total',
    'mcoi_total',
    'mcoc_total',
    'total_score',
    'empan_endroit',
    'empan_envers',
    'empan_croissant',
    'note_standard',
    'note_t',
    'z_score',
    'percentile',
    'interpretation',
  ],
  WAIS4_SIMILITUDES: ['raw_score', 'standard_score', 'percentile_rank', 'deviation_from_mean'],
  WAIS4_MATRICES: ['raw_score', 'standardized_score', 'percentile_rank'],
  WAIS4_CODE: ['raw_score', 'standard_score', 'percentile_rank', 'scaled_score'],
  STROOP: [
    'stroop_w_tot_c',
    'stroop_c_tot_c',
    'stroop_cw_tot_c',
    'stroop_interf',
    'stroop_w_note_t',
    'stroop_c_note_t',
    'stroop_cw_note_t',
    'stroop_interf_note_t',
    'stroop_w_note_t_corrigee',
    'stroop_c_note_t_corrigee',
    'stroop_cw_note_t_corrigee',
    'stroop_interf_note_tz',
    'stroop_c_cor',
    'stroop_cw_cor',
    'stroop_w_cor',
  ],
  TMT: ['tmt_a_z', 'tmt_b_z', 'tmt_a_pc', 'tmt_b_pc', 'tmt_b_a_ratio', 'interpretation'],
  FLUENCES_VERBALES: [
    'fv_p_tot_rupregle',
    'fv_p_tot_correct_z',
    'fv_p_tot_correct_pc',
    'fv_anim_tot_rupregle',
    'fv_anim_tot_correct_z',
    'fv_anim_tot_correct_pc',
  ],
  CVLT: [
    'total_1_5',
    'total_1_5_zscore',
    'total_1_5_percentile',
    'short_delay_free',
    'short_delay_free_zscore',
    'short_delay_free_percentile',
    'long_delay_free',
    'long_delay_free_zscore',
    'long_delay_free_percentile',
  ],
  SCIP: ['total_score', 'interpretation'],
  TEST_COMMISSIONS: ['total_score', 'interpretation'],

  // Follow-up computed fields
  ISA_FOLLOWUP: ['total_score', 'risk_level', 'interpretation'],
  SUICIDE_BEHAVIOR_FOLLOWUP: ['risk_score', 'risk_level', 'interpretation'],
};

type SqlColumn = {
  name: string;
  rawType: string;
  notNull: boolean;
};

function getRequiredCodesForVisitType(visitType: string): string[] {
  if (visitType === 'screening') return [...SCREENING_CODES];
  if (visitType === 'initial_evaluation') return [...INITIAL_EVAL_CODES];
  if (visitType === 'biannual_followup') return [...BIANNUAL_FOLLOWUP_CODES];
  if (visitType === 'annual_evaluation') return [...ANNUAL_EVAL_CODES];
  return [];
}

function codeToTableName(code: string): string | null {
  const normalized = code.replace(/_FR$/, '');

  if (normalized === 'BIPOLAR_DIAGNOSTIC' || normalized === 'MEDICAL_DIAGNOSTIC') return 'bipolar_diagnostic';
  if (normalized === 'BIPOLAR_ORIENTATION') return 'bipolar_orientation';

  const nurseCodes = new Set([
    'TOBACCO',
    'FAGERSTROM',
    'PHYSICAL_PARAMS',
    'BLOOD_PRESSURE',
    'ECG',
    'SLEEP_APNEA',
    'BIOLOGICAL_ASSESSMENT',
  ]);
  if (nurseCodes.has(normalized)) return `bipolar_nurse_${normalized.toLowerCase()}`;

  // Follow-up (biannual) tables
  const followupTableMap: Record<string, string> = {
    HUMEUR_ACTUELS: 'bipolar_followup_humeur_actuels',
    HUMEUR_DEPUIS_VISITE: 'bipolar_followup_humeur_depuis_visite',
    PSYCHOTIQUES: 'bipolar_followup_psychotiques',
    ISA_FOLLOWUP: 'bipolar_followup_isa',
    SUICIDE_BEHAVIOR_FOLLOWUP: 'bipolar_followup_suicide_behavior',
    SUIVI_RECOMMANDATIONS: 'bipolar_followup_suivi_recommandations',
    RECOURS_AUX_SOINS: 'bipolar_followup_recours_aux_soins',
    TRAITEMENT_NON_PHARMACOLOGIQUE: 'bipolar_followup_traitement_non_pharma',
    ARRETS_DE_TRAVAIL: 'bipolar_followup_arrets_travail',
    SOMATIQUE_CONTRACEPTIF: 'bipolar_followup_somatique_contraceptif',
    STATUT_PROFESSIONNEL: 'bipolar_followup_statut_professionnel',
  };
  if (normalized in followupTableMap) return followupTableMap[normalized];

  // Screening auto + initial shared
  if (normalized === 'QIDS_SR16') return 'bipolar_qids_sr16';

  // Most bipolar tables follow `bipolar_${code.toLowerCase()}`
  return `bipolar_${normalized.toLowerCase()}`;
}

function loadSchemaSql(): string {
  return fs.readFileSync(SCHEMA_PATH, 'utf8');
}

function extractTableColumns(schemaSql: string, tableName: string): SqlColumn[] {
  const createHeader = `CREATE TABLE IF NOT EXISTS "public"."${tableName}" (`;
  const startIdx = schemaSql.indexOf(createHeader);
  if (startIdx === -1) return [];

  const afterHeader = schemaSql.slice(startIdx + createHeader.length);
  const endIdx = afterHeader.indexOf('\n);');
  if (endIdx === -1) return [];

  const body = afterHeader.slice(0, endIdx);
  const lines = body.split('\n');
  const cols: SqlColumn[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('CONSTRAINT')) continue;
    if (trimmed.startsWith('--')) continue;
    if (!trimmed.startsWith('"')) continue;

    // Example: "q1" integer,
    // Example: "id" "uuid" DEFAULT gen_random_uuid() NOT NULL,
    const m = trimmed.match(/^"([^"]+)"\s+(.+?)(?:,)?$/);
    if (!m) continue;

    const name = m[1];
    const rest = m[2];

    // Type is the first token or quoted token before DEFAULT/NOT NULL/CONSTRAINT
    // We keep a rawType string for heuristic defaults.
    const typePart = rest
      .split(/\s+(DEFAULT|NOT|null|CONSTRAINT|CHECK|REFERENCES)\b/i)[0]
      .trim();

    const notNull = /\bNOT NULL\b/i.test(rest);
    cols.push({ name, rawType: typePart, notNull });
  }

  return cols;
}

function defaultValueForType(rawType: string, notNull: boolean): any {
  const t = rawType.replace(/"/g, '').toLowerCase();

  // Supabase enum commonly used in this schema
  if (t.includes('yes_no_fr')) return notNull ? 'non' : null;
  if (t.includes('yes_no_en')) return notNull ? 'no' : null;

  const isArray = t.endsWith('[]');
  if (isArray) return notNull ? [] : null;
  if (t === 'jsonb' || t === 'json') return notNull ? {} : null;
  if (t === 'boolean' || t === 'bool') return notNull ? false : null;

  if (t.includes('int') || t.includes('numeric') || t.includes('decimal') || t.includes('real') || t.includes('double')) {
    return notNull ? 0 : null;
  }

  // Enums & text-like
  return notNull ? '' : null;
}

function buildRawResponsesForCode(schemaSql: string, code: string): Record<string, any> {
  const tableName = codeToTableName(code);
  if (!tableName) return {};

  const columns = extractTableColumns(schemaSql, tableName);
  if (columns.length === 0) {
    // If schema parsing fails, fall back to empty raw response object.
    return {};
  }

  const computed = new Set(COMPUTED_COLUMNS_BY_CODE[code] || []);
  const out: Record<string, any> = {};

  for (const col of columns) {
    if (META_COLUMNS.has(col.name)) continue;
    if (computed.has(col.name)) continue;
    let value = defaultValueForType(col.rawType, col.notNull);

    // Safe defaults for known NOT NULL columns with CHECK constraints
    // (Type-based default '' would violate CHECK constraints.)
    if (col.notNull && col.name === 'smoking_status') value = 'unknown';
    if (col.notNull && col.name === 'diagnosed_sleep_apnea') value = 'unknown';
    if (col.notNull && col.name === 'ecg_performed') value = 'no';

    out[col.name] = value;
  }

  // Keep responses minimal: strip keys whose defaults are null.
  // This still yields DB-native raw answers (absence => NULL).
  for (const [k, v] of Object.entries(out)) {
    if (v === null) delete out[k];
  }

  return out;
}

function ensureQuestionnaires(
  schemaSql: string,
  visit: ImportVisit
): ImportVisit {
  const required = getRequiredCodesForVisitType(visit.visit_type);
  if (required.length === 0) return visit;

  const existing = new Map<string, ImportQuestionnaireResponse>();
  for (const q of visit.questionnaires || []) {
    existing.set(q.code, q);
  }

  const questionnaires: ImportQuestionnaireResponse[] = [...(visit.questionnaires || [])];
  for (const code of required) {
    if (existing.has(code)) continue;
    questionnaires.push({
      code,
      responses: buildRawResponsesForCode(schemaSql, code),
    });
  }

  return { ...visit, questionnaires };
}

function addMonthsUtc(d: Date, months: number): Date {
  const copy = new Date(d.getTime());
  const utcYear = copy.getUTCFullYear();
  const utcMonth = copy.getUTCMonth();
  const utcDate = copy.getUTCDate();

  copy.setUTCFullYear(utcYear, utcMonth + months, utcDate);
  return copy;
}

function ensureAtLeastOneBiannualVisit(schemaSql: string, patient: ImportPatient): ImportPatient {
  const visits = [...(patient.visits || [])];
  const hasBiannual = visits.some(v => v.visit_type === 'biannual_followup');
  if (hasBiannual) {
    return { ...patient, visits };
  }

  // Use latest completed_date or scheduled_date as baseline
  const dates: Date[] = [];
  for (const v of visits) {
    const candidate = v.completed_date || v.scheduled_date;
    const dt = new Date(candidate);
    if (!Number.isNaN(dt.getTime())) dates.push(dt);
  }

  const base = dates.length ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date();
  const scheduled = addMonthsUtc(base, 6);
  scheduled.setUTCHours(9, 0, 0, 0);

  const completed = new Date(scheduled.getTime());
  completed.setUTCHours(14, 0, 0, 0);

  const newVisit: ImportVisit = ensureQuestionnaires(schemaSql, {
    visit_type: 'biannual_followup',
    scheduled_date: scheduled.toISOString(),
    completed_date: completed.toISOString(),
    status: 'completed',
    questionnaires: [],
  });

  visits.push(newVisit);
  return { ...patient, visits };
}

function ensureAtLeastOneAnnualVisit(schemaSql: string, patient: ImportPatient): ImportPatient {
  const visits = [...(patient.visits || [])];
  const hasAnnual = visits.some(v => v.visit_type === 'annual_evaluation');
  if (hasAnnual) {
    return { ...patient, visits };
  }

  const initial = visits.find(v => v.visit_type === 'initial_evaluation');
  const baselineStr = initial?.completed_date || initial?.scheduled_date;

  // Fallback to latest date we can find
  const dates: Date[] = [];
  if (baselineStr) {
    const d = new Date(baselineStr);
    if (!Number.isNaN(d.getTime())) dates.push(d);
  }
  for (const v of visits) {
    const candidate = v.completed_date || v.scheduled_date;
    const dt = new Date(candidate);
    if (!Number.isNaN(dt.getTime())) dates.push(dt);
  }

  const base = dates.length ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date();
  const scheduled = addMonthsUtc(base, 12);
  scheduled.setUTCHours(9, 0, 0, 0);

  const completed = new Date(scheduled.getTime());
  completed.setUTCHours(18, 0, 0, 0);

  const newVisit: ImportVisit = ensureQuestionnaires(schemaSql, {
    visit_type: 'annual_evaluation',
    scheduled_date: scheduled.toISOString(),
    completed_date: completed.toISOString(),
    status: 'completed',
    questionnaires: [],
  });

  visits.push(newVisit);
  return { ...patient, visits };
}

function main() {
  const schemaSql = loadSchemaSql();
  const raw = fs.readFileSync(MOCK_PATH, 'utf8');
  const patients = JSON.parse(raw) as ImportPatient[];

  const updated = patients.map((p) => {
    const withBiannual = ensureAtLeastOneBiannualVisit(schemaSql, p);
    const withAnnual = ensureAtLeastOneAnnualVisit(schemaSql, withBiannual);
    const visits = (withAnnual.visits || []).map((v) => ensureQuestionnaires(schemaSql, v));
    return { ...withAnnual, visits };
  });

  fs.writeFileSync(MOCK_PATH, JSON.stringify(updated, null, 2) + '\n', 'utf8');
  // eslint-disable-next-line no-console
  console.log(`Updated ${path.relative(WORKSPACE_ROOT, MOCK_PATH)}`);
}

main();

