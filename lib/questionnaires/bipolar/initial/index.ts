// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation Questionnaires
// Export all initial evaluation questionnaire modules
// ============================================================================
//
// Total: 57 questionnaires across 7 modules
// All questionnaires save to bipolar_* tables via bipolar-initial.service.ts
//
// ============================================================================

// Nurse module (6 questionnaires)
// Isolated files with types, definitions, scoring functions
export * as nurse from './nurse';

// Thymic module (7 questionnaires)
// Isolated files with types, definitions, scoring functions
export * as thymic from './thymic';

// Auto module (ETAT + TRAITS submodules, 16 questionnaires)
// Isolated files with types, definitions, scoring functions
export * as auto from './auto';

// Social module (1 questionnaire)
// Isolated file with types, definitions, interpretation functions
export * as social from './social';

// Medical module (19 questionnaires)
// Re-exports from legacy constants with bipolar_* table schemas
export * as medical from './medical';

// Neuropsy module (22 questionnaires)
// Re-exports from legacy constants with bipolar_* table schemas
export * as neuropsy from './neuropsy';
