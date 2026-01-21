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
