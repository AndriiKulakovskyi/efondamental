// eFondaMental Platform - Bipolar Initial Evaluation - Thymic Module
// Export all thymic questionnaire components

// MADRS (Montgomery-Asberg Depression Rating Scale)
export {
  MADRS_QUESTIONS,
  MADRS_DEFINITION,
  computeMadrsScore,
  getMadrsSeverity,
  interpretMadrsScore,
  scoreMadrs,
  type BipolarMadrsResponse,
  type BipolarMadrsResponseInsert,
  type MadrsScoreInput,
  type MadrsSeverity,
  type MadrsScoringResult
} from './madrs';

// YMRS (Young Mania Rating Scale)
export {
  YMRS_QUESTIONS,
  YMRS_DEFINITION,
  computeYmrsScore,
  getYmrsSeverity,
  interpretYmrsScore,
  scoreYmrs,
  type BipolarYmrsResponse,
  type BipolarYmrsResponseInsert,
  type YmrsScoreInput,
  type YmrsSeverity,
  type YmrsScoringResult
} from './ymrs';

// CGI (Clinical Global Impressions)
export {
  CGI_QUESTIONS,
  CGI_DEFINITION,
  interpretCgiSeverity,
  interpretCgiImprovement,
  interpretCgi,
  type BipolarCgiResponse,
  type BipolarCgiResponseInsert,
  type CgiInterpretationResult
} from './cgi';

// EGF (Echelle Globale de Fonctionnement)
export {
  EGF_QUESTIONS,
  EGF_DEFINITION,
  getEgfLevel,
  interpretEgfScore,
  scoreEgf,
  type BipolarEgfResponse,
  type BipolarEgfResponseInsert,
  type EgfLevel,
  type EgfScoringResult
} from './egf';

// ALDA (Lithium Response Scale)
export {
  ALDA_QUESTIONS,
  ALDA_DEFINITION,
  computeAldaScore,
  interpretAldaScore,
  scoreAlda,
  type BipolarAldaResponse,
  type BipolarAldaResponseInsert,
  type AldaScoreInput,
  type AldaScoringResult
} from './alda';

// ETAT_PATIENT (DSM-IV Symptoms)
export {
  ETAT_PATIENT_QUESTIONS,
  ETAT_PATIENT_DEFINITION,
  computeEtatPatientCounts,
  interpretEtatPatient,
  scoreEtatPatient,
  type BipolarEtatPatientResponse,
  type BipolarEtatPatientResponseInsert,
  type EtatPatientScoreInput,
  type EtatPatientScoringResult
} from './etat-patient';

// FAST (Functioning Assessment Short Test)
export {
  FAST_QUESTIONS,
  FAST_DEFINITION,
  computeFastScores,
  getFastSeverity,
  interpretFastScore,
  scoreFast,
  type BipolarFastResponse,
  type BipolarFastResponseInsert,
  type FastScoreInput,
  type FastDomainScores,
  type FastSeverity,
  type FastScoringResult
} from './fast';
