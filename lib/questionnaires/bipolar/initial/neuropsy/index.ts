// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation - Neuropsy Module
// Export all neuropsychological questionnaire components
// ============================================================================
//
// This module includes 22 neuropsychological assessments:
// - Memory Tests: CVLT, MEM3_SPATIAL
// - Processing Speed: TMT, STROOP, FLUENCES_VERBALES
// - WAIS-IV: WAIS4_CRITERIA, WAIS4_LEARNING, WAIS4_MATRICES, WAIS4_CODE,
//            WAIS4_DIGIT_SPAN, WAIS4_SIMILITUDES
// - WAIS-III: WAIS3_CRITERIA, WAIS3_LEARNING, WAIS3_VOCABULAIRE, WAIS3_MATRICES,
//             WAIS3_CODE_SYMBOLES, WAIS3_DIGIT_SPAN, WAIS3_CPT2
// - Cognitive Assessment: COBRA, CPT3, SCIP, TEST_COMMISSIONS
//
// All questionnaires save to bipolar_* tables via the generic service layer.
// ============================================================================

// CVLT (California Verbal Learning Test)
export {
  CVLT_QUESTIONS,
  CVLT_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// TMT (Trail Making Test)
export {
  TMT_QUESTIONS,
  TMT_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// Stroop Test
export {
  STROOP_QUESTIONS,
  STROOP_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// Verbal Fluencies
export {
  FLUENCES_VERBALES_QUESTIONS,
  FLUENCES_VERBALES_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// MEM-III Spatial
export {
  MEM3_SPATIAL_QUESTIONS,
  MEM3_SPATIAL_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// WAIS-IV Assessments
export {
  WAIS4_CRITERIA_QUESTIONS,
  WAIS4_CRITERIA_DEFINITION,
  WAIS4_LEARNING_QUESTIONS,
  WAIS4_LEARNING_DEFINITION,
  WAIS4_MATRICES_QUESTIONS,
  WAIS4_MATRICES_DEFINITION,
  WAIS4_CODE_SYMBOLES_IVT_QUESTIONS,
  WAIS4_CODE_SYMBOLES_IVT_DEFINITION,
  WAIS4_DIGIT_SPAN_QUESTIONS,
  WAIS4_DIGIT_SPAN_DEFINITION,
  WAIS4_SIMILITUDES_QUESTIONS,
  WAIS4_SIMILITUDES_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// WAIS-III Assessments
export {
  WAIS3_CRITERIA_QUESTIONS,
  WAIS3_CRITERIA_DEFINITION,
  WAIS3_LEARNING_QUESTIONS,
  WAIS3_LEARNING_DEFINITION,
  WAIS3_VOCABULAIRE_QUESTIONS,
  WAIS3_VOCABULAIRE_DEFINITION,
  WAIS3_MATRICES_QUESTIONS,
  WAIS3_MATRICES_DEFINITION,
  WAIS3_CODE_SYMBOLES_QUESTIONS,
  WAIS3_CODE_SYMBOLES_DEFINITION,
  WAIS3_DIGIT_SPAN_QUESTIONS,
  WAIS3_DIGIT_SPAN_DEFINITION,
  WAIS3_CPT2_QUESTIONS,
  WAIS3_CPT2_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// COBRA (Cognitive Complaints in Bipolar Disorder Rating Assessment)
export {
  COBRA_QUESTIONS,
  COBRA_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// CPT-3 (Continuous Performance Test)
export {
  CPT3_QUESTIONS,
  CPT3_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// SCIP (Screen for Cognitive Impairment in Psychiatry)
export {
  SCIP_QUESTIONS,
  SCIP_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// Test des Commissions
export {
  TEST_COMMISSIONS_QUESTIONS,
  TEST_COMMISSIONS_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// ============================================================================
// TypeScript Types for Neuropsy Module
// These types match the bipolar_* table schemas
// ============================================================================

export interface BipolarCvltResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarTmtResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarStroopResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarFluencesVerbalesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarMem3SpatialResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarCobraResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarCpt3Response {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarScipResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarTestCommissionsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}
