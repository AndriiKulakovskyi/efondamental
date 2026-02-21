// eFondaMental Platform - Schizophrenia Initial Evaluation - Hetero Module
// Clinical rating scales for hetero-evaluation (clinician-administered)

// PANSS (Positive and Negative Syndrome Scale)
export {
  PANSS_QUESTIONS,
  PANSS_DEFINITION,
  computePanssScores,
  interpretPanssTotal,
  type SchizophreniaPanssResponse,
  type SchizophreniaPanssResponseInsert,
  type QuestionnaireDefinition
} from './panss';

// CDSS (Calgary Depression Scale for Schizophrenia)
export {
  CDSS_QUESTIONS,
  CDSS_DEFINITION,
  computeCdssScore,
  interpretCdssScore,
  type SchizophreniaCdssResponse,
  type SchizophreniaCdssResponseInsert
} from './cdss';

// BARS (Brief Adherence Rating Scale)
export {
  BARS_QUESTIONS,
  BARS_DEFINITION,
  computeBarsAdherence,
  interpretBarsAdherence,
  type SchizophreniaBarsResponse,
  type SchizophreniaBarsResponseInsert
} from './bars';

// SUMD (Scale to Assess Unawareness of Mental Disorder)
export {
  SUMD_QUESTIONS,
  SUMD_DEFINITION,
  computeSumdAwarenessScore,
  computeSumdAttributionScore,
  type SchizophreniaSumdResponse,
  type SchizophreniaSumdResponseInsert
} from './sumd';

// SAPS (Scale for the Assessment of Positive Symptoms)
export {
  SAPS_QUESTIONS,
  SAPS_DEFINITION,
  computeSapsScores,
  type SchizophreniaSapsResponse,
  type SchizophreniaSapsResponseInsert
} from './saps';

// SANS (Scale for the Assessment of Negative Symptoms)
export {
  SANS_QUESTIONS,
  SANS_DEFINITION,
  computeSansScores,
  type SchizophreniaSansResponse,
  type SchizophreniaSansResponseInsert
} from './sans';

// UKU (Udvalg for Kliniske Undersøgelser Side Effect Rating Scale)
export {
  UKU_QUESTIONS,
  UKU_DEFINITION,
  computeUkuScores,
  type SchizophreniaUkuResponse,
  type SchizophreniaUkuResponseInsert
} from './uku';

// AIMS (Abnormal Involuntary Movement Scale)
export {
  AIMS_QUESTIONS,
  AIMS_DEFINITION,
  computeAimsScores,
  hasAimsPositiveFindings,
  type SchizophreniaAimsResponse,
  type SchizophreniaAimsResponseInsert
} from './aims';

// Barnes Akathisia Rating Scale
export {
  BARNES_QUESTIONS,
  BARNES_DEFINITION,
  interpretBarnesGlobal,
  hasBarnesAkathisia,
  type SchizophreniaBarnesResponse,
  type SchizophreniaBarnesResponseInsert
} from './barnes';

// SAS (Simpson-Angus Scale)
export {
  SAS_QUESTIONS,
  SAS_DEFINITION,
  computeSasScores,
  interpretSasMean,
  hasSasPositiveFindings,
  type SchizophreniaSasResponse,
  type SchizophreniaSasResponseInsert
} from './sas';

// PSP (Personal and Social Performance Scale)
export {
  PSP_QUESTIONS,
  PSP_DEFINITION,
  interpretPspScore,
  getPspFunctioningLevel,
  type SchizophreniaPspResponse,
  type SchizophreniaPspResponseInsert
} from './psp';

// BRIEF-A (Behavior Rating Inventory of Executive Function - Adult)
export {
  BRIEF_A_SZ_QUESTIONS,
  BRIEF_A_SZ_DEFINITION,
  computeBriefAScores,
  interpretBriefAScore,
  isValidityElevated,
  BRIEF_A_SCALES,
  BRIEF_A_INDICES,
  BRIEF_A_VALIDITY_SCALES,
  BRIEF_A_LIKERT_OPTIONS,
  type SchizophreniaBriefAResponse,
  type SchizophreniaBriefAResponseInsert,
  type BriefAScoreResult
} from './brief-a';

// YMRS (Young Mania Rating Scale)
export {
  YMRS_SZ_QUESTIONS,
  YMRS_SZ_DEFINITION,
  computeYmrsScore,
  getYmrsSeverity,
  interpretYmrsScore,
  scoreYmrs,
  type SchizophreniaYmrsResponse,
  type SchizophreniaYmrsResponseInsert,
  type YmrsScoreInput,
  type YmrsSeverity,
  type YmrsScoringResult
} from './ymrs';

// CGI (Clinical Global Impressions)
export {
  CGI_SZ_QUESTIONS,
  CGI_SZ_DEFINITION,
  interpretCgiSeverity,
  interpretCgiImprovement,
  interpretCgi,
  type SchizophreniaCgiResponse,
  type SchizophreniaCgiResponseInsert,
  type CgiInterpretationResult
} from './cgi';

// EGF (Echelle Globale de Fonctionnement - Global Functioning Scale)
export {
  EGF_SZ_QUESTIONS,
  EGF_SZ_DEFINITION,
  getEgfLevel,
  interpretEgfScore,
  scoreEgf,
  type SchizophreniaEgfResponse,
  type SchizophreniaEgfResponseInsert,
  type EgfLevel,
  type EgfScoringResult
} from './egf';
