// ============================================================================
// eFondaMental Platform - Schizophrenia Initial Evaluation Questionnaires
// Export all initial evaluation questionnaire modules
// ============================================================================
//
// Total: 20 questionnaires across 4 modules
// All questionnaires save to schizophrenia_* tables via schizophrenia-initial.service.ts
//
// ============================================================================

// Nurse module (2 questionnaires)
// Physical parameters, blood pressure, ECG, and biological assessment
export * as nurse from './nurse';

// Hetero module (8 questionnaires)
// Clinical rating scales for hetero-evaluation (clinician-administered)
// PANSS, CDSS, BARS, SUMD, AIMS, Barnes, SAS, PSP
export * as hetero from './hetero';

// Medical module (6 questionnaires)
// Medical history and diagnostic assessments
// Troubles psychotiques, Troubles comorbides, Suicide history, Antecedents familiaux, Perinatalite, ECV
export * as medical from './medical';

// Addictologie module (2 questionnaires)
// Addiction and substance use assessments
// Tea/Coffee consumption, Evaluation addictologique
export * as addictologie from './addictologie';
