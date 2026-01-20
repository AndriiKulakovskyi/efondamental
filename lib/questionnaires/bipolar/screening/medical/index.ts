// eFondaMental Platform - Bipolar Screening Medical questionnaires
// Export all medical questionnaire modules

// Diagnostic (EBIP_SCR_DIAG)
export {
  DIAGNOSTIC_QUESTIONS,
  DIAGNOSTIC_DEFINITION,
  type BipolarDiagnosticResponse,
  type BipolarDiagnosticResponseInsert
} from './diagnostic';

// Orientation Centre Expert (EBIP_SCR_ORIENT)
export {
  ORIENTATION_QUESTIONS,
  ORIENTATION_DEFINITION,
  BIPOLAR_ORIENTATION_DEFINITION,
  BIPOLAR_ORIENTATION_QUESTIONS,
  isEligibleForExpertCenter,
  checkOrientationEligibility,
  type BipolarOrientationResponse,
  type BipolarOrientationResponseInsert,
  type OrientationEligibilityInput,
  type OrientationEligibilityResult
} from './orientation';
