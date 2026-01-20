// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation - Auto TRAITS Module
// Export all auto/traits questionnaire components
// ============================================================================

// ASRS (Adult ADHD Self-Report Scale)
export {
  ASRS_QUESTIONS,
  ASRS_DEFINITION,
  computeAsrsScores,
  interpretAsrsScore,
  type BipolarAsrsResponse,
  type BipolarAsrsResponseInsert
} from './asrs';

// CTQ (Childhood Trauma Questionnaire)
export {
  CTQ_QUESTIONS,
  CTQ_DEFINITION,
  computeCtqScores,
  interpretCtqSubscale,
  type BipolarCtqResponse,
  type BipolarCtqResponseInsert
} from './ctq';

// BIS-10 (Barratt Impulsiveness Scale)
export {
  BIS10_QUESTIONS,
  BIS10_DEFINITION,
  computeBis10Scores,
  interpretBis10Score,
  type BipolarBis10Response,
  type BipolarBis10ResponseInsert
} from './bis10';

// ALS-18 (Affective Lability Scale)
export {
  ALS18_QUESTIONS,
  ALS18_DEFINITION,
  computeAls18Scores,
  interpretAls18Score,
  type BipolarAls18Response,
  type BipolarAls18ResponseInsert
} from './als18';

// AIM (Affect Intensity Measure)
export {
  AIM_QUESTIONS,
  AIM_DEFINITION,
  computeAimScores,
  interpretAimScore,
  type BipolarAimResponse,
  type BipolarAimResponseInsert
} from './aim';

// WURS-25 (Wender Utah Rating Scale)
export {
  WURS25_QUESTIONS,
  WURS25_DEFINITION,
  computeWurs25Scores,
  interpretWurs25Score,
  type BipolarWurs25Response,
  type BipolarWurs25ResponseInsert
} from './wurs25';

// AQ-12 (Aggression Questionnaire)
export {
  AQ12_QUESTIONS,
  AQ12_DEFINITION,
  computeAq12Scores,
  interpretAq12Score,
  type BipolarAq12Response,
  type BipolarAq12ResponseInsert
} from './aq12';

// CSM (Composite Scale of Morningness)
export {
  CSM_QUESTIONS,
  CSM_DEFINITION,
  computeCsmScores,
  getChronotype,
  interpretCsmScore,
  type BipolarCsmResponse,
  type BipolarCsmResponseInsert
} from './csm';

// CTI (Circadian Type Inventory)
export {
  CTI_QUESTIONS,
  CTI_DEFINITION,
  computeCtiScores,
  interpretCtiFlexibility,
  interpretCtiLanguid,
  interpretCtiScores,
  type BipolarCtiResponse,
  type BipolarCtiResponseInsert
} from './cti';
