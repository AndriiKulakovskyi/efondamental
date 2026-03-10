// eFondaMental Platform - Central Questionnaire Index
// New unified architecture for all questionnaires

// Re-export types
export type {
  Question,
  QuestionOption,
  QuestionnaireDefinition,
  QuestionnaireMetadata,
  Section,
  ScoringDomain,
  ScoringRules,
  ScoreResult,
  ScreeningResult,
  ValidationResult,
  QuestionnaireAnswers
} from './types';

// Re-export screening questionnaires
export {
  ASRM_QUESTIONS,
  ASRM_DEFINITION,
  ASRM_CUTOFF,
  computeAsrmScore,
  interpretAsrmScore,
  scoreAsrm,
  type BipolarAsrmResponse,
  type BipolarAsrmResponseInsert,
  type AsrmScoreInput,
  type AsrmScoringResult
} from './bipolar/screening/auto/asrm';

export {
  QIDS_QUESTIONS,
  QIDS_DEFINITION,
  computeQidsScore,
  interpretQidsScore,
  getQidsSeverity,
  scoreQids,
  type BipolarQidsResponse,
  type BipolarQidsResponseInsert,
  type QidsScoreInput,
  type QidsScoringResult,
  type QidsDepressionSeverity,
  type QidsInterpretationResult
} from './bipolar/screening/auto/qids';

export {
  MDQ_QUESTIONS,
  MDQ_DEFINITION,
  computeMdqQ1Score,
  isMdqPositive,
  interpretMdqScore,
  scoreMdq,
  type BipolarMdqResponse,
  type BipolarMdqResponseInsert,
  type MdqScoreInput,
  type MdqScoringResult
} from './bipolar/screening/auto/mdq';

// Re-export medical screening questionnaires
export {
  DIAGNOSTIC_QUESTIONS,
  DIAGNOSTIC_DEFINITION,
  type BipolarDiagnosticResponse,
  type BipolarDiagnosticResponseInsert
} from './bipolar/screening/medical/diagnostic';

export {
  BIPOLAR_ORIENTATION_QUESTIONS,
  BIPOLAR_ORIENTATION_DEFINITION,
  checkOrientationEligibility,
  isEligibleForExpertCenter,
  type BipolarOrientationResponse,
  type BipolarOrientationResponseInsert
} from './bipolar/screening/medical/orientation';

// TODO: Add exports for all other questionnaire modules as they are migrated
