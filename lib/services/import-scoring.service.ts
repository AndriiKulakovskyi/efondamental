// eFondaMental Platform - Import Scoring Service
// Centralized scoring function registry for legacy data imports
// This service maps questionnaire codes to their scoring functions to ensure
// imported data is scored using the same logic as the application.

import { scoreAsrm } from '@/lib/questionnaires/bipolar/screening/auto/asrm';
import { scoreMdq } from '@/lib/questionnaires/bipolar/screening/auto/mdq';
import { scoreQids } from '@/lib/questionnaires/bipolar/screening/auto/qids';
import { scoreMadrs } from '@/lib/questionnaires/bipolar/initial/thymic/madrs';
import { scoreYmrs } from '@/lib/questionnaires/bipolar/initial/thymic/ymrs';
import { scoreFast } from '@/lib/questionnaires/bipolar/initial/thymic/fast';
import { scoreAlda } from '@/lib/questionnaires/bipolar/initial/thymic/alda';
import { scoreEgf } from '@/lib/questionnaires/bipolar/initial/thymic/egf';
import { scoreEtatPatient } from '@/lib/questionnaires/bipolar/initial/thymic/etat-patient';
import { interpretCgi } from '@/lib/questionnaires/bipolar/initial/thymic/cgi';
import { computeEq5d5lScores } from '@/lib/questionnaires/bipolar/initial/auto/etat/eq5d5l';
import { scoreFagerstrom } from '@/lib/questionnaires/bipolar/initial/nurse/fagerstrom';
import { scoreStopBang } from '@/lib/questionnaires/bipolar/initial/nurse/sleep-apnea';
import { scoreIsaFollowup } from '@/lib/questionnaires/bipolar/followup/suicide/isa-followup';
import { scoreSuicideBehaviorFollowup } from '@/lib/questionnaires/bipolar/followup/suicide/suicide-behavior-followup';

// ============================================================================
// TYPES
// ============================================================================

export interface ScoringResult {
  [key: string]: any;
}

export type ScoringFunction = (responses: Record<string, any>) => ScoringResult;

// ============================================================================
// SCORING FUNCTION REGISTRY
// ============================================================================

/**
 * Registry mapping questionnaire codes to their scoring functions.
 * Each function takes raw responses and returns computed scores.
 */
export const SCORING_FUNCTION_REGISTRY: Record<string, ScoringFunction> = {
  // Screening Auto
  'ASRM': (responses) => scoreAsrm(responses as any),
  'MDQ': (responses) => scoreMdq(responses as any),
  'QIDS_SR16': (responses) => scoreQids(responses as any),
  
  // Auto ETAT Module
  'EQ5D5L': (responses) => {
    // EQ5D5L - EuroQol 5 Dimensions health state computation
    const result = computeEq5d5lScores(responses as any);
    return {
      health_state: result.profile_string,
      profile_string: result.profile_string,
      index_value: result.index_value,
      interpretation: result.interpretation
    };
  },
  
  // Thymic Module
  'MADRS': (responses) => scoreMadrs(responses as any),
  'YMRS': (responses) => scoreYmrs(responses as any),
  'FAST': (responses) => scoreFast(responses as any),
  'ALDA': (responses) => scoreAlda(responses as any),
  'EGF': (responses) => {
    // EGF takes a single score value, not an object
    const score = responses.egf_score ?? responses.score ?? 0;
    return scoreEgf(score);
  },
  'ETAT_PATIENT': (responses) => scoreEtatPatient(responses as any),
  'CGI': (responses) => {
    // CGI - Clinical Global Impression interpretation
    const result = interpretCgi(responses.cgi_s, responses.cgi_i);
    return {
      interpretation: result.interpretation
    };
  },
  
  // Nurse Module
  'FAGERSTROM': (responses) => scoreFagerstrom(responses as any),
  'SLEEP_APNEA': (responses) => scoreStopBang(responses as any),
  
  // Follow-up Suicide Module
  'ISA_SUIVI': (responses) => scoreIsaFollowup(responses as any),
  'SUICIDE_BEHAVIOR_FOLLOWUP': (responses) => scoreSuicideBehaviorFollowup(responses as any),
};

// ============================================================================
// COMPUTED FIELDS MAPPING
// ============================================================================

/**
 * Maps questionnaire codes to the computed field names that should be excluded
 * from raw data insertion and populated via scoring functions.
 */
export const COMPUTED_FIELDS_BY_QUESTIONNAIRE: Record<string, string[]> = {
  // Only include fields that actually exist in the database tables
  'ASRM': ['total_score', 'interpretation'],
  'MDQ': ['q1_score', 'interpretation'],
  'QIDS_SR16': ['total_score', 'interpretation'],
  'MADRS': ['total_score', 'interpretation'],
  'YMRS': ['total_score', 'interpretation'],
  'FAST': ['total_score', 'autonomy_score', 'work_score', 'cognitive_score', 'finances_score', 'relationships_score', 'leisure_score', 'interpretation'],
  'ALDA': ['score_a', 'b_total_score', 'total_score', 'alda_score', 'interpretation'],
  'EGF': ['interpretation'],
  'ETAT_PATIENT': ['depression_count', 'mania_count', 'interpretation'],
  'FAGERSTROM': ['total_score', 'interpretation'],
  'SLEEP_APNEA': ['stop_bang_score', 'risk_level', 'interpretation'],
  'ISA_SUIVI': ['total_score', 'interpretation'],
  'SUICIDE_BEHAVIOR_FOLLOWUP': ['interpretation'],
  'CGI': ['interpretation'],
  'EQ5D5L': ['health_state', 'profile_string', 'index_value', 'interpretation'],
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Normalize questionnaire code by removing _FR suffix.
 * This allows import data to use either 'ASRM' or 'ASRM_FR' format.
 */
export function normalizeQuestionnaireCode(code: string): string {
  return code.replace(/_FR$/, '');
}

/**
 * Check if a questionnaire has a scoring function.
 */
export function hasScoringFunction(code: string): boolean {
  const normalizedCode = normalizeQuestionnaireCode(code);
  return normalizedCode in SCORING_FUNCTION_REGISTRY;
}

/**
 * Get the scoring function for a questionnaire code.
 * Returns undefined if no scoring function exists.
 */
export function getScoringFunction(code: string): ScoringFunction | undefined {
  const normalizedCode = normalizeQuestionnaireCode(code);
  return SCORING_FUNCTION_REGISTRY[normalizedCode];
}

/**
 * Get the list of computed fields for a questionnaire.
 * These fields should be excluded from raw data and computed via scoring functions.
 */
export function getComputedFields(code: string): string[] {
  const normalizedCode = normalizeQuestionnaireCode(code);
  return COMPUTED_FIELDS_BY_QUESTIONNAIRE[normalizedCode] || [];
}

/**
 * Extract raw response data by removing computed fields.
 * This ensures only raw question responses are inserted initially.
 */
export function extractRawResponses(
  code: string,
  responses: Record<string, any>
): Record<string, any> {
  const computedFields = getComputedFields(code);
  const rawResponses: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(responses)) {
    if (!computedFields.includes(key)) {
      rawResponses[key] = value;
    }
  }
  
  return rawResponses;
}

/**
 * Compute scores for a questionnaire response.
 * Returns the computed score fields to be merged with the database record.
 */
export function computeScores(
  code: string,
  responses: Record<string, any>
): Record<string, any> | null {
  const scoringFn = getScoringFunction(code);
  
  if (!scoringFn) {
    return null;
  }
  
  try {
    const result = scoringFn(responses);
    return result;
  } catch (error) {
    console.error(`Error computing scores for ${code}:`, error);
    return null;
  }
}

/**
 * Fields that scoring functions return but don't exist in database tables.
 * These will be filtered out before updating.
 */
const NON_DB_FIELDS = [
  'is_positive',      // ASRM, MDQ return this but it's not a DB column
  'severity',         // QIDS, MADRS, YMRS return this but it's not a DB column
  'level',            // EGF returns this but it's not a DB column
  'domain_scores',    // QIDS returns this nested object
  'risk_level_label', // Some suicide questionnaires return this
  'has_recent_ideation', // Suicide questionnaires
  'has_self_harm',    // Suicide questionnaires
  'has_interrupted_attempt', // Suicide questionnaires
  'has_aborted_attempt',     // Suicide questionnaires
  'has_preparations',        // Suicide questionnaires
  'total_attempt_count',     // Suicide questionnaires
  'risk_score',              // Mapped to total_score instead
  'dependence_level',        // Fagerstrom
  'q2_concurrent',    // MDQ returns this but it's not a DB column
  'q3_impact_level',  // MDQ returns this but it's not a DB column
];

/**
 * Map scoring result fields to database column names.
 * Some scoring functions return fields with different names than the database columns.
 */
export function mapScoringResultToDbColumns(
  code: string,
  scoringResult: Record<string, any>
): Record<string, any> {
  const normalizedCode = normalizeQuestionnaireCode(code);
  const mapped: Record<string, any> = { ...scoringResult };
  
  // Remove fields that don't exist in the database
  for (const field of NON_DB_FIELDS) {
    delete mapped[field];
  }
  
  // Handle specific field mappings per questionnaire
  switch (normalizedCode) {
    case 'SLEEP_APNEA':
      // Map stop_bang_score to total_score for DB
      if ('stop_bang_score' in mapped) {
        mapped.stop_bang_score = mapped.stop_bang_score;
      }
      break;
    case 'ISA_SUIVI':
    case 'SUICIDE_BEHAVIOR_FOLLOWUP':
      // These questionnaires map risk_score to total_score
      // Already removed risk_score above
      break;
    case 'FAST':
      // FAST has all fields correctly mapped
      break;
  }
  
  return mapped;
}
