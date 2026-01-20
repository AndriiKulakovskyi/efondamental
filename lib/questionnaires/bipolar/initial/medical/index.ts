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
// - Perinatal History (1): perinatal_history
// - Medical History (9): patho_neuro, patho_cardio, patho_endoc, patho_dermato,
//   patho_urinaire, antecedents_gyneco, patho_hepato_gastro, patho_allergique, autres_patho
//
// All questionnaires save to bipolar_* tables via the generic service layer.
// ============================================================================

// DSM-5 Mood Disorders
export {
  DSM5_HUMEUR_QUESTIONS,
  DSM5_HUMEUR_DEFINITION,
  type BipolarDsm5HumeurResponse,
  type BipolarDsm5HumeurResponseInsert
} from './dsm5-humeur';

// DSM-5 Psychotic Features
export {
  DSM5_PSYCHOTIC_QUESTIONS,
  DSM5_PSYCHOTIC_DEFINITION,
  type BipolarDsm5PsychoticResponse,
  type BipolarDsm5PsychoticResponseInsert
} from './dsm5-psychotic';

// DSM-5 Comorbidities
export {
  DSM5_COMORBID_QUESTIONS,
  DSM5_COMORBID_DEFINITION,
  type BipolarDsm5ComorbidResponse,
  type BipolarDsm5ComorbidResponseInsert
} from './dsm5-comorbid';

// DIVA (Diagnostic Interview for ADHD in Adults)
export {
  DIVA_QUESTIONS,
  DIVA_DEFINITION,
  type BipolarDivaResponse,
  type BipolarDivaResponseInsert
} from './diva';

// Family History
export {
  FAMILY_HISTORY_QUESTIONS,
  FAMILY_HISTORY_DEFINITION,
  type BipolarFamilyHistoryResponse,
  type BipolarFamilyHistoryResponseInsert
} from './family-history';

// C-SSRS (Columbia Suicide Severity Rating Scale)
export {
  CSSRS_QUESTIONS,
  CSSRS_DEFINITION,
  type BipolarCssrsResponse,
  type BipolarCssrsResponseInsert
} from './cssrs';

// ISA (Ideation Scale for Adults)
export {
  ISA_QUESTIONS,
  ISA_DEFINITION,
  computeIsaScore,
  interpretIsaScore,
  type BipolarIsaResponse,
  type BipolarIsaResponseInsert
} from './isa';

// SIS (Suicide Intent Scale)
export {
  SIS_QUESTIONS,
  SIS_DEFINITION,
  computeSisScores,
  interpretSisScore,
  type BipolarSisResponse,
  type BipolarSisResponseInsert
} from './sis';

// Suicide History
export {
  SUICIDE_HISTORY_QUESTIONS,
  SUICIDE_HISTORY_DEFINITION,
  type BipolarSuicideHistoryResponse,
  type BipolarSuicideHistoryResponseInsert
} from './suicide-history';

// Perinatal History
export {
  PERINATAL_HISTORY_QUESTIONS,
  PERINATAL_HISTORY_DEFINITION,
  type BipolarPerinatalHistoryResponse,
  type BipolarPerinatalHistoryResponseInsert
} from './perinatal-history';

// Pathologies (Medical History)
export {
  // Neurological
  PATHO_NEURO_QUESTIONS,
  PATHO_NEURO_DEFINITION,
  type BipolarPathoNeuroResponse,
  type BipolarPathoNeuroResponseInsert,
  // Cardiovascular
  PATHO_CARDIO_QUESTIONS,
  PATHO_CARDIO_DEFINITION,
  type BipolarPathoCardioResponse,
  type BipolarPathoCardioResponseInsert,
  // Endocrine
  PATHO_ENDOC_QUESTIONS,
  PATHO_ENDOC_DEFINITION,
  type BipolarPathoEndocResponse,
  type BipolarPathoEndocResponseInsert,
  // Dermatological
  PATHO_DERMATO_QUESTIONS,
  PATHO_DERMATO_DEFINITION,
  type BipolarPathoDermatoResponse,
  type BipolarPathoDermatoResponseInsert,
  // Urinary
  PATHO_URINAIRE_QUESTIONS,
  PATHO_URINAIRE_DEFINITION,
  type BipolarPathoUrinaireResponse,
  type BipolarPathoUrinaireResponseInsert,
  // Gynecological
  ANTECEDENTS_GYNECO_QUESTIONS,
  ANTECEDENTS_GYNECO_DEFINITION,
  type BipolarAntecedentsGynecoResponse,
  type BipolarAntecedentsGynecoResponseInsert,
  // Hepato-Gastrointestinal
  PATHO_HEPATO_GASTRO_QUESTIONS,
  PATHO_HEPATO_GASTRO_DEFINITION,
  type BipolarPathoHepatoGastroResponse,
  type BipolarPathoHepatoGastroResponseInsert,
  // Allergic
  PATHO_ALLERGIQUE_QUESTIONS,
  PATHO_ALLERGIQUE_DEFINITION,
  type BipolarPathoAllergiqueResponse,
  type BipolarPathoAllergiqueResponseInsert,
  // Other
  AUTRES_PATHO_QUESTIONS,
  AUTRES_PATHO_DEFINITION,
  type BipolarAutresPathoResponse,
  type BipolarAutresPathoResponseInsert
} from './pathologies';
