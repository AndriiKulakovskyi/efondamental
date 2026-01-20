// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation - Neuropsy Module
// Export all neuropsychological questionnaire components
// ============================================================================
//
// This module includes 22 neuropsychological assessments:
// - Memory Tests: CVLT, MEM3_SPATIAL
// - Processing Speed: TMT, STROOP, FLUENCES_VERBALES
// - Cognitive Assessment: COBRA, CPT3, SCIP, TEST_COMMISSIONS
// - WAIS-IV (6): Criteria, Learning, Matrices, Code, Digit Span, Similitudes
// - WAIS-III (7): Criteria, Learning, Vocabulaire, Matrices, Code/Symboles, 
//                 Digit Span, CPT2
//
// All questionnaires save to bipolar_* tables via the generic service layer.
// ============================================================================

// ============================================================================
// Memory Tests
// ============================================================================

// CVLT (California Verbal Learning Test)
export {
  CVLT_QUESTIONS,
  CVLT_DEFINITION,
  type BipolarCvltResponse,
  type BipolarCvltResponseInsert
} from './cvlt';

// MEM-III Spatial (Blocs de Corsi)
export {
  MEM3_SPATIAL_QUESTIONS,
  MEM3_SPATIAL_DEFINITION,
  type BipolarMem3SpatialResponse,
  type BipolarMem3SpatialResponseInsert
} from './mem3-spatial';

// ============================================================================
// Processing Speed
// ============================================================================

// TMT (Trail Making Test)
export {
  TMT_QUESTIONS,
  TMT_DEFINITION,
  computeTmtDerivedScores,
  type BipolarTmtResponse,
  type BipolarTmtResponseInsert
} from './tmt';

// Stroop Test
export {
  STROOP_QUESTIONS,
  STROOP_DEFINITION,
  computeStroopInterference,
  type BipolarStroopResponse,
  type BipolarStroopResponseInsert
} from './stroop';

// Verbal Fluencies
export {
  FLUENCES_VERBALES_QUESTIONS,
  FLUENCES_VERBALES_DEFINITION,
  computeFluencesTotals,
  type BipolarFluencesVerbalesResponse,
  type BipolarFluencesVerbalesResponseInsert
} from './fluences-verbales';

// ============================================================================
// Cognitive Assessment
// ============================================================================

// COBRA (Cognitive Complaints in Bipolar Disorder Rating Assessment)
export {
  COBRA_QUESTIONS,
  COBRA_DEFINITION,
  computeCobraScore,
  interpretCobraScore,
  type BipolarCobraResponse,
  type BipolarCobraResponseInsert
} from './cobra';

// CPT-3 (Continuous Performance Test)
export {
  CPT3_QUESTIONS,
  CPT3_DEFINITION,
  type BipolarCpt3Response,
  type BipolarCpt3ResponseInsert
} from './cpt3';

// SCIP (Screen for Cognitive Impairment in Psychiatry)
export {
  SCIP_QUESTIONS,
  SCIP_DEFINITION,
  computeScipScore,
  interpretScipScore,
  type BipolarScipResponse,
  type BipolarScipResponseInsert,
  type ScipScoreInput
} from './scip';

// Test des Commissions
export {
  TEST_COMMISSIONS_QUESTIONS,
  TEST_COMMISSIONS_DEFINITION,
  computeTestCommissionsScore,
  computeEfficiencyIndex,
  type BipolarTestCommissionsResponse,
  type BipolarTestCommissionsResponseInsert
} from './test-commissions';

// ============================================================================
// WAIS-IV Assessments
// ============================================================================

// WAIS-IV Criteria (Clinical criteria for evaluation)
export {
  WAIS4_CRITERIA_QUESTIONS,
  WAIS4_CRITERIA_DEFINITION,
  type BipolarWais4CriteriaResponse,
  type BipolarWais4CriteriaResponseInsert
} from './wais4-criteria';

// WAIS-IV Learning (Learning disorders checklist)
export {
  WAIS4_LEARNING_QUESTIONS,
  WAIS4_LEARNING_DEFINITION,
  type BipolarWais4LearningResponse,
  type BipolarWais4LearningResponseInsert
} from './wais4-learning';

// WAIS-IV Similitudes
export {
  WAIS4_SIMILITUDES_QUESTIONS,
  WAIS4_SIMILITUDES_DEFINITION,
  computeWais4SimilitudesRawScore,
  type BipolarWais4SimilitudesResponse,
  type BipolarWais4SimilitudesResponseInsert
} from './wais4-similitudes';

// WAIS-IV Matrices
export {
  WAIS4_MATRICES_QUESTIONS,
  WAIS4_MATRICES_DEFINITION,
  computeWais4MatricesRawScore,
  type BipolarWais4MatricesResponse,
  type BipolarWais4MatricesResponseInsert
} from './wais4-matrices';

// WAIS-IV Code
export {
  WAIS4_CODE_QUESTIONS,
  WAIS4_CODE_DEFINITION,
  computeWais4CodeRawScore,
  type BipolarWais4CodeResponse,
  type BipolarWais4CodeResponseInsert
} from './wais4-code';

// WAIS-IV Digit Span
export {
  WAIS4_DIGIT_SPAN_QUESTIONS,
  WAIS4_DIGIT_SPAN_DEFINITION,
  computeWais4DigitSpanRawScore,
  type BipolarWais4DigitSpanResponse,
  type BipolarWais4DigitSpanResponseInsert
} from './wais4-digit-span';

// ============================================================================
// WAIS-III Assessments
// ============================================================================

// WAIS-III Criteria (Clinical criteria for evaluation)
export {
  WAIS3_CRITERIA_QUESTIONS,
  WAIS3_CRITERIA_DEFINITION,
  type BipolarWais3CriteriaResponse,
  type BipolarWais3CriteriaResponseInsert
} from './wais3-criteria';

// WAIS-III Learning (Learning disorders checklist)
export {
  WAIS3_LEARNING_QUESTIONS,
  WAIS3_LEARNING_DEFINITION,
  type BipolarWais3LearningResponse,
  type BipolarWais3LearningResponseInsert
} from './wais3-learning';

// WAIS-III Vocabulaire
export {
  WAIS3_VOCABULAIRE_QUESTIONS,
  WAIS3_VOCABULAIRE_DEFINITION,
  computeWais3VocabulaireRawScore,
  type BipolarWais3VocabulaireResponse,
  type BipolarWais3VocabulaireResponseInsert
} from './wais3-vocabulaire';

// WAIS-III Matrices
export {
  WAIS3_MATRICES_QUESTIONS,
  WAIS3_MATRICES_DEFINITION,
  computeWais3MatricesRawScore,
  type BipolarWais3MatricesResponse,
  type BipolarWais3MatricesResponseInsert
} from './wais3-matrices';

// WAIS-III Code/Symboles
export {
  WAIS3_CODE_SYMBOLES_QUESTIONS,
  WAIS3_CODE_SYMBOLES_DEFINITION,
  computeWais3CodeSymbolesRawScore,
  type BipolarWais3CodeSymbolesResponse,
  type BipolarWais3CodeSymbolesResponseInsert
} from './wais3-code-symboles';

// WAIS-III Digit Span
export {
  WAIS3_DIGIT_SPAN_QUESTIONS,
  WAIS3_DIGIT_SPAN_DEFINITION,
  computeWais3DigitSpanRawScore,
  type BipolarWais3DigitSpanResponse,
  type BipolarWais3DigitSpanResponseInsert
} from './wais3-digit-span';

// WAIS-III CPT2 (Conners Continuous Performance Test II)
export {
  WAIS3_CPT2_QUESTIONS,
  WAIS3_CPT2_DEFINITION,
  type BipolarWais3Cpt2Response,
  type BipolarWais3Cpt2ResponseInsert
} from './wais3-cpt2';
