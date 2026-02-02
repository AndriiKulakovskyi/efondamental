// ============================================================================
// eFondaMental Platform - Schizophrenia Neuropsy Module - WAIS-IV Subgroup
// WAIS-IV neuropsychological assessments for schizophrenia patients
// ============================================================================

export {
  WAIS4_CRITERIA_SZ_QUESTIONS,
  WAIS4_CRITERIA_SZ_DEFINITION,
  type SchizophreniaWais4CriteriaResponse,
  type SchizophreniaWais4CriteriaResponseInsert
} from './criteres-cliniques';

export {
  WAIS4_EFFICIENCE_SZ_QUESTIONS,
  WAIS4_EFFICIENCE_SZ_DEFINITION,
  type SchizophreniaWais4EfficienceResponse,
  type SchizophreniaWais4EfficienceResponseInsert
} from './efficience-intellectuelle';

export {
  WAIS4_SIMILITUDES_SZ_QUESTIONS,
  WAIS4_SIMILITUDES_SZ_DEFINITION,
  type SchizophreniaWais4SimilitudesResponse,
  type SchizophreniaWais4SimilitudesResponseInsert
} from './similitudes';

export {
  WAIS4_MEMOIRE_CHIFFRES_SZ_QUESTIONS,
  WAIS4_MEMOIRE_CHIFFRES_SZ_DEFINITION,
  type SchizophreniaWais4MemoireChiffresResponse,
  type SchizophreniaWais4MemoireChiffresResponseInsert
} from './memoire-chiffres';

export {
  WAIS4_MATRICES_SZ_QUESTIONS,
  WAIS4_MATRICES_SZ_DEFINITION,
  type SchizophreniaWais4MatricesResponse,
  type SchizophreniaWais4MatricesResponseInsert
} from './matrices';

export {
  SSTICS_SZ_QUESTIONS,
  SSTICS_SZ_DEFINITION,
  computeSsticsScores,
  interpretSsticsZScore,
  SSTICS_DOMAINS,
  SSTICS_NORMS,
  type SchizophreniaSsticsResponse,
  type SchizophreniaSsticsResponseInsert,
  type SsticsScoreResult
} from './sstics';
