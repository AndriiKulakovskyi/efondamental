// eFondaMental Platform - Bipolar Initial Evaluation Questionnaires
// Export all initial evaluation questionnaire modules

// Nurse module (6 questionnaires)
export * as nurse from './nurse';

// Thymic module (7 questionnaires)
export * as thymic from './thymic';

// Auto module (ETAT + TRAITS submodules)
export * as auto from './auto';

// Note: The following questionnaire definitions are reused from lib/constants/questionnaires.ts
// and lib/constants/questionnaires-hetero.ts, but data is stored in new bipolar_* tables:
// - Medical module: dsm5_*, diva, family_history, cssrs, isa, sis, suicide_history, perinatalite, patho_*
// - Neuropsy module: cvlt, tmt, stroop, fluences_verbales, mem3_spatial, wais3_*, wais4_*, cobra, cpt3, scip
// - Social module: social questionnaire
