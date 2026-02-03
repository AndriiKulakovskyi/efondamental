// ============================================================================
// eFondaMental Platform - Schizophrenia Initial Evaluation - Neuropsy Module
// Neuropsychological assessments organized into blocs
// ============================================================================

// Bloc 2: California Verbal Learning Test, Trail Making Test, Test des Commissions, LIS, and related assessments
export * as bloc2 from './bloc2';

// WAIS-IV: WAIS-IV neuropsychological assessments
export * as wais4 from './wais4';

// Re-export commonly used definitions for convenience
// Bloc 2
export { SZ_CVLT_DEFINITION, SZ_CVLT_QUESTIONS } from './bloc2';
export type { SchizophreniaCvltResponse, SchizophreniaCvltResponseInsert } from './bloc2';
export { TMT_SZ_DEFINITION, TMT_SZ_QUESTIONS } from './bloc2';
export type { SchizophreniaTmtResponse, SchizophreniaTmtResponseInsert } from './bloc2';
export { COMMISSIONS_SZ_DEFINITION, COMMISSIONS_SZ_QUESTIONS } from './bloc2';
export type { SchizophreniaCommissionsResponse, SchizophreniaCommissionsResponseInsert } from './bloc2';
export { LIS_SZ_DEFINITION, LIS_SZ_QUESTIONS } from './bloc2';
export type { SchizophreniaLisResponse, SchizophreniaLisResponseInsert } from './bloc2';

// WAIS-IV
export { WAIS4_CRITERIA_SZ_DEFINITION, WAIS4_CRITERIA_SZ_QUESTIONS } from './wais4';
export type { SchizophreniaWais4CriteriaResponse, SchizophreniaWais4CriteriaResponseInsert } from './wais4';
export { WAIS4_EFFICIENCE_SZ_DEFINITION, WAIS4_EFFICIENCE_SZ_QUESTIONS } from './wais4';
export type { SchizophreniaWais4EfficienceResponse, SchizophreniaWais4EfficienceResponseInsert } from './wais4';
export { WAIS4_SIMILITUDES_SZ_DEFINITION, WAIS4_SIMILITUDES_SZ_QUESTIONS } from './wais4';
export type { SchizophreniaWais4SimilitudesResponse, SchizophreniaWais4SimilitudesResponseInsert } from './wais4';
export { WAIS4_MEMOIRE_CHIFFRES_SZ_DEFINITION, WAIS4_MEMOIRE_CHIFFRES_SZ_QUESTIONS } from './wais4';
export type { SchizophreniaWais4MemoireChiffresResponse, SchizophreniaWais4MemoireChiffresResponseInsert } from './wais4';
export { WAIS4_MATRICES_SZ_DEFINITION, WAIS4_MATRICES_SZ_QUESTIONS } from './wais4';
export type { SchizophreniaWais4MatricesResponse, SchizophreniaWais4MatricesResponseInsert } from './wais4';
export { SSTICS_SZ_DEFINITION, SSTICS_SZ_QUESTIONS, computeSsticsScores, interpretSsticsZScore, SSTICS_DOMAINS, SSTICS_NORMS } from './wais4';
export type { SchizophreniaSsticsResponse, SchizophreniaSsticsResponseInsert, SsticsScoreResult } from './wais4';

// CBQ - Cognitive Bias Questionnaire (root level)
export { CBQ_SZ_DEFINITION, CBQ_SZ_QUESTIONS, computeCbqScores, interpretCbqZScore, CBQ_SUBSCALES, CBQ_NORMS, CBQ_CLINICAL_THRESHOLD, isSubscaleClinicallySignificant } from './cbq';
export type { SchizophreniaCbqResponse, SchizophreniaCbqResponseInsert, CbqScoreResult } from './cbq';

// DACOBS - Davos Assessment of Cognitive Biases Scale (root level)
export { DACOBS_SZ_DEFINITION, DACOBS_SZ_QUESTIONS, computeDacobsScores, interpretDacobsScore, DACOBS_SUBSCALES, DACOBS_SECTIONS, DACOBS_LIKERT_OPTIONS } from './dacobs';
export type { SchizophreniaDacobsResponse, SchizophreniaDacobsResponseInsert, DacobsScoreResult } from './dacobs';
