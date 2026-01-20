// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation - Neuropsy Module
// Export all neuropsychological questionnaire components
// ============================================================================
//
// This module includes 22 neuropsychological assessments:
// - Memory Tests: CVLT, MEM3_SPATIAL
// - Processing Speed: TMT, STROOP, FLUENCES_VERBALES
// - Cognitive Assessment: COBRA, CPT3, SCIP, TEST_COMMISSIONS
// - WAIS-IV (6): Similitudes, Matrices, Code, Digit Span, Vocabulaire, Cubes
// - WAIS-III (7): Vocabulaire, Matrices, Code/Symboles, Digit Span, 
//                 Similitudes, Cubes, Arithmetique
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

// WAIS-IV Vocabulaire
export {
  WAIS4_VOCABULAIRE_QUESTIONS,
  WAIS4_VOCABULAIRE_DEFINITION,
  computeWais4VocabulaireRawScore,
  type BipolarWais4VocabulaireResponse,
  type BipolarWais4VocabulaireResponseInsert
} from './wais4-vocabulaire';

// WAIS-IV Cubes
export {
  WAIS4_CUBES_QUESTIONS,
  WAIS4_CUBES_DEFINITION,
  computeWais4CubesRawScore,
  type BipolarWais4CubesResponse,
  type BipolarWais4CubesResponseInsert
} from './wais4-cubes';

// ============================================================================
// WAIS-III Assessments
// ============================================================================

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

// WAIS-III Similitudes
export {
  WAIS3_SIMILITUDES_QUESTIONS,
  WAIS3_SIMILITUDES_DEFINITION,
  computeWais3SimilitudesRawScore,
  type BipolarWais3SimilitudesResponse,
  type BipolarWais3SimilitudesResponseInsert
} from './wais3-similitudes';

// WAIS-III Cubes
export {
  WAIS3_CUBES_QUESTIONS,
  WAIS3_CUBES_DEFINITION,
  computeWais3CubesRawScore,
  type BipolarWais3CubesResponse,
  type BipolarWais3CubesResponseInsert
} from './wais3-cubes';

// WAIS-III Arithmetique
export {
  WAIS3_ARITHMETIQUE_QUESTIONS,
  WAIS3_ARITHMETIQUE_DEFINITION,
  computeWais3ArithmetiqueRawScore,
  type BipolarWais3ArithmetiqueResponse,
  type BipolarWais3ArithmetiqueResponseInsert
} from './wais3-arithmetique';
