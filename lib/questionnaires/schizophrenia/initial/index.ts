// ============================================================================
// eFondaMental Platform - Schizophrenia Initial Evaluation Questionnaires
// Export all initial evaluation questionnaire modules
// ============================================================================
//
// Total: 23 questionnaires across 8 modules
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

// Social module (1 questionnaire)
// Social situation assessment
// Bilan social
export * as social from './social';

// Auto module (patient self-administered questionnaires)
// Self-administered questionnaires
// S-QoL, CTQ, MARS, BIS, EQ5D5L, IPAQ, YBOCS, WURS25, STORI, SOGS, PSQI, Présentéisme, Fagerstrom
export * as auto from './auto';

// Entourage module (caregiver-administered questionnaires)
// Questionnaires completed by caregiver/entourage
// EPHP (Handicap Psychique)
export * as entourage from './entourage';

// Neuropsy module (Neuropsychological assessments)
// Bloc 2: CVLT (California Verbal Learning Test)
export * as neuropsy from './neuropsy';
