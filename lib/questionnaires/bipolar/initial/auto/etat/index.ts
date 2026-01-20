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

// Note: Additional questionnaires (prise_m, stai_ya, mars, mathys, psqi, epworth)
// are defined in the original lib/constants/questionnaires.ts and reused
// for the initial evaluation visit. New bipolar_* tables will store the data.
