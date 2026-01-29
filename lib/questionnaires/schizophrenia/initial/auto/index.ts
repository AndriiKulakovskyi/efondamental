// ============================================================================
// eFondaMental Platform - Schizophrenia Initial Evaluation
// Autoquestionnaires Module Index
// ============================================================================

export {
  SQOL_SZ_QUESTIONS,
  SQOL_SZ_DEFINITION,
  SQOL_SUBSCALES,
  calculateSqolSubscaleScore,
  calculateAllSqolSubscales,
  calculateSqolGlobalScore,
  interpretSqolScore,
  type SchizophreniaSqolResponse,
  type SchizophreniaSqolResponseInsert,
} from './sqol';

export {
  CTQ_QUESTIONS,
  CTQ_SZ_DEFINITION,
  CTQ_SUBSCALES,
  CTQ_REVERSE_ITEMS,
  CTQ_SEVERITY_THRESHOLDS,
  computeCtqScores,
  interpretCtqSubscale,
  getSeverityLabel,
  type SchizophreniaCtqResponse,
  type SchizophreniaCtqResponseInsert,
  type CtqScoreResult,
} from './ctq';

export {
  MARS_SZ_QUESTIONS,
  MARS_SZ_DEFINITION,
  computeMarsSzScores,
  interpretMarsSzScore,
  type SchizophreniaMarsResponse,
  type SchizophreniaMarsResponseInsert,
  type MarsSzScoreResult,
} from './mars';

export {
  BIS_SZ_QUESTIONS,
  BIS_SZ_DEFINITION,
  computeBisScores,
  interpretBisScore,
  type SchizophreniaBisResponse,
  type SchizophreniaBisResponseInsert,
  type BisSzScoreResult,
} from './bis';

export {
  EQ5D5L_SZ_QUESTIONS,
  EQ5D5L_SZ_DEFINITION,
  computeHealthStateSz,
  interpretEq5d5lSz,
  type SchizophreniaEq5d5lResponse,
  type SchizophreniaEq5d5lResponseInsert,
  type Eq5d5lSzScoreResult,
} from './eq5d5l';

export {
  IPAQ_SZ_QUESTIONS,
  IPAQ_SZ_DEFINITION,
  IPAQ_MET_VALUES,
  getWalkingMET,
  calculateMinutesPerDay,
  computeIpaqMETMinutes,
  classifyActivityLevel,
  interpretIpaqScore,
  type SchizophreniaIpaqResponse,
  type SchizophreniaIpaqResponseInsert,
  type IpaqSzScoreResult,
} from './ipaq';
