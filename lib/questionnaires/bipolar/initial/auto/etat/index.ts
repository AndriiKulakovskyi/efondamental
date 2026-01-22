// eFondaMental Platform - Bipolar Initial Evaluation - Auto ETAT Module
// Export all auto/etat questionnaire components

// EQ5D5L (EuroQol 5D-5L)
export {
  EQ5D5L_QUESTIONS,
  EQ5D5L_DEFINITION,
  computeHealthState,
  interpretEq5d5l,
  type BipolarEq5d5lResponse,
  type BipolarEq5d5lResponseInsert,
  type Eq5d5lScoreInput
} from './eq5d5l';

// PRISE-M (Medication Side Effects Profile)
export {
  PRISE_M_QUESTIONS,
  PRISE_M_DEFINITION,
  computePriseMScores,
  interpretPriseMScore,
  type BipolarPriseMResponse,
  type BipolarPriseMResponseInsert
} from './prise-m';

// STAI-YA (State Anxiety Inventory)
export {
  STAI_YA_QUESTIONS,
  STAI_YA_DEFINITION,
  computeStaiYaScores,
  interpretStaiYaScore,
  rawToTScore,
  type BipolarStaiYaResponse,
  type BipolarStaiYaResponseInsert
} from './stai-ya';

// MARS (Medication Adherence Rating Scale)
export {
  MARS_QUESTIONS,
  MARS_DEFINITION,
  computeMarsScores,
  interpretMarsScore,
  type BipolarMarsResponse,
  type BipolarMarsResponseInsert
} from './mars';

// MAThyS (Multidimensional Assessment of Thymic States)
export {
  MATHYS_QUESTIONS,
  MATHYS_DEFINITION,
  computeMathysScores,
  interpretMathysScore,
  type BipolarMathysResponse,
  type BipolarMathysResponseInsert
} from './mathys';

// PSQI (Pittsburgh Sleep Quality Index)
export {
  PSQI_QUESTIONS,
  PSQI_DEFINITION,
  computePsqiScores,
  interpretPsqiScore,
  type BipolarPsqiResponse,
  type BipolarPsqiResponseInsert
} from './psqi';

// Epworth (Epworth Sleepiness Scale)
export {
  EPWORTH_QUESTIONS,
  EPWORTH_DEFINITION,
  computeEpworthScore,
  computeEpworthScores,
  interpretEpworthScore,
  interpretEpworthScoreSimple,
  type BipolarEpworthResponse,
  type BipolarEpworthResponseInsert
} from './epworth';
