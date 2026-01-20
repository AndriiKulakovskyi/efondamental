// eFondaMental Platform - Bipolar Screening Auto-questionnaires
// Export all auto-questionnaire modules

// ASRM (Altman Self-Rating Mania Scale)
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
} from './asrm';

// QIDS-SR16 (Quick Inventory of Depressive Symptomatology)
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
} from './qids';

// MDQ (Mood Disorder Questionnaire)
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
} from './mdq';
