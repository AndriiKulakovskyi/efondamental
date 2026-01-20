// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation - Medical Module
// Export all medical questionnaire components
// ============================================================================
//
// This module includes 19 questionnaires for the medical evaluation:
// - DSM-5 Assessments (3): dsm5_humeur, dsm5_psychotic, dsm5_comorbid
// - DIVA Assessment (1): diva
// - Family History (1): family_history
// - Suicide Assessment (4): cssrs, isa, sis, suicide_history
// - Perinatal History (1): perinatalite
// - Medical History (9): patho_neuro, patho_cardio, patho_endoc, patho_dermato,
//   patho_urinaire, antecedents_gyneco, patho_hepato_gastro, patho_allergique, autres_patho
//
// All questionnaires save to bipolar_* tables via the generic service layer.
// ============================================================================

// DSM-5 Mood Disorders
export {
  DSM5_HUMEUR_QUESTIONS,
  DSM5_HUMEUR_DEFINITION
} from '@/lib/constants/questionnaires-dsm5';

// DSM-5 Psychotic Features
export {
  DSM5_PSYCHOTIC_QUESTIONS,
  DSM5_PSYCHOTIC_DEFINITION
} from '@/lib/constants/questionnaires-dsm5';

// DSM-5 Comorbidities
export {
  DSM5_COMORBID_QUESTIONS,
  DSM5_COMORBID_DEFINITION
} from '@/lib/constants/questionnaires-dsm5';

// DIVA (Diagnostic Interview for ADHD in Adults)
export {
  DIVA_QUESTIONS,
  DIVA_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// Family History
export {
  FAMILY_HISTORY_QUESTIONS,
  FAMILY_HISTORY_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// C-SSRS (Columbia Suicide Severity Rating Scale)
export {
  CSSRS_QUESTIONS,
  CSSRS_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// ISA (Ideation Scale for Adults)
export {
  ISA_QUESTIONS,
  ISA_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// SIS (Suicide Intent Scale)
export {
  SIS_QUESTIONS,
  SIS_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// Suicide History
export {
  SUICIDE_HISTORY_QUESTIONS,
  SUICIDE_HISTORY_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// Perinatal History
export {
  PERINATALITE_QUESTIONS,
  PERINATALITE_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// Neurological Pathology
export {
  PATHO_NEURO_QUESTIONS,
  PATHO_NEURO_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// Cardiovascular Pathology
export {
  PATHO_CARDIO_QUESTIONS,
  PATHO_CARDIO_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// Endocrine Pathology
export {
  PATHO_ENDOC_QUESTIONS,
  PATHO_ENDOC_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// Dermatological Pathology
export {
  PATHO_DERMATO_QUESTIONS,
  PATHO_DERMATO_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// Urinary Pathology
export {
  PATHO_URINAIRE_QUESTIONS,
  PATHO_URINAIRE_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// Gynecological History
export {
  ANTECEDENTS_GYNECO_QUESTIONS,
  ANTECEDENTS_GYNECO_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// Hepato-Gastrointestinal Pathology
export {
  PATHO_HEPATO_GASTRO_QUESTIONS,
  PATHO_HEPATO_GASTRO_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// Allergic Pathology
export {
  PATHO_ALLERGIQUE_QUESTIONS,
  PATHO_ALLERGIQUE_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// Other Pathologies
export {
  AUTRES_PATHO_QUESTIONS,
  AUTRES_PATHO_DEFINITION
} from '@/lib/constants/questionnaires-hetero';

// ============================================================================
// TypeScript Types for Medical Module
// These types match the bipolar_* table schemas
// ============================================================================

export interface BipolarDsm5HumeurResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarDsm5PsychoticResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarDsm5ComorbidResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarDivaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarFamilyHistoryResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarCssrsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarIsaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarSisResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarSuicideHistoryResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarPerinataliteResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  completed_at: string;
  created_at: string;
  updated_at: string;
}
