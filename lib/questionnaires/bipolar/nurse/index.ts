// eFondaMental Platform - Bipolar Nurse Module
// Exports all nurse questionnaires for Bipolar disorder evaluations

// ============================================================================
// Tobacco Assessment
// ============================================================================
export {
  TOBACCO_DEFINITION,
  TOBACCO_QUESTIONS,
  type BipolarNurseTobaccoResponse,
  type BipolarNurseTobaccoResponseInsert,
  type SmokingStatus,
  type TobaccoAnalysisInput,
  type TobaccoAnalysisResult,
  getSmokingStatus,
  getPackYears,
  interpretTobacco,
  analyzeTobacco
} from './tobacco';

// ============================================================================
// Fagerstrom (Nicotine Dependence Test)
// ============================================================================
export {
  FAGERSTROM_DEFINITION,
  FAGERSTROM_QUESTIONS,
  type BipolarNurseFagerstromResponse,
  type BipolarNurseFagerstromResponseInsert,
  type FagerstromScoreInput,
  type FagerstromScoringResult,
  type DependenceLevel,
  computeFagerstromScore,
  getFagerstromDependenceLevel,
  getDependenceLevelLabel,
  interpretFagerstromScore,
  scoreFagerstrom
} from './fagerstrom';

// ============================================================================
// Physical Parameters
// ============================================================================
export {
  PHYSICAL_PARAMS_DEFINITION,
  PHYSICAL_PARAMS_QUESTIONS,
  type BipolarNursePhysicalParamsResponse,
  type BipolarNursePhysicalParamsResponseInsert,
  type PhysicalParamsInput,
  type PhysicalParamsAnalysisResult,
  type BMICategory,
  computeBMI,
  getBMICategory,
  getBMICategoryLabel,
  interpretPhysicalParams,
  analyzePhysicalParams
} from './physical-params';

// ============================================================================
// Blood Pressure & Heart Rate
// ============================================================================
export {
  BLOOD_PRESSURE_DEFINITION,
  BLOOD_PRESSURE_QUESTIONS,
  type BipolarNurseBloodPressureResponse,
  type BipolarNurseBloodPressureResponseInsert,
  type BloodPressureInput,
  type BloodPressureAnalysisResult,
  type BPCategory,
  getBPCategory,
  getBPCategoryLabel,
  formatTension,
  hasOrthostaticHypotension,
  interpretBloodPressure,
  analyzeBloodPressure
} from './blood-pressure';

// ============================================================================
// Sleep Apnea (STOP-Bang)
// ============================================================================
export {
  SLEEP_APNEA_DEFINITION,
  SLEEP_APNEA_QUESTIONS,
  type BipolarNurseSleepApneaResponse,
  type BipolarNurseSleepApneaResponseInsert,
  type StopBangScoreInput,
  type SleepApneaScoringResult,
  type SleepApneaRiskLevel,
  computeStopBangScore,
  getSleepApneaRiskLevel,
  getRiskLevelLabel,
  interpretSleepApnea,
  scoreSleepApnea
} from './sleep-apnea';

// ============================================================================
// Biological Assessment
// ============================================================================
export {
  BIOLOGICAL_ASSESSMENT_DEFINITION,
  BIOLOGICAL_ASSESSMENT_QUESTIONS,
  type BipolarNurseBiologicalAssessmentResponse,
  type BipolarNurseBiologicalAssessmentResponseInsert,
  type BiologicalAssessmentFlags,
  type BiologicalAssessmentInput,
  analyzeBiologicalAssessment,
  interpretBiologicalAssessment
} from './biological-assessment';

// ============================================================================
// ECG (Electrocardiogram)
// ============================================================================
export {
  ECG_DEFINITION,
  ECG_QUESTIONS,
  type BipolarNurseEcgResponse,
  type BipolarNurseEcgResponseInsert,
  type QTcCategory,
  type QTcInterpretationInput,
  type EcgAnalysisInput,
  type EcgAnalysisResult,
  computeQTc,
  getQTcCategory,
  getQTcCategoryLabel,
  interpretQTc,
  analyzeEcg
} from './ecg';

// ============================================================================
// All Definitions (for convenience)
// ============================================================================
export const NURSE_DEFINITIONS = {
  TOBACCO_DEFINITION: 'TOBACCO',
  FAGERSTROM_DEFINITION: 'FAGERSTROM',
  PHYSICAL_PARAMS_DEFINITION: 'PHYSICAL_PARAMS',
  BLOOD_PRESSURE_DEFINITION: 'BLOOD_PRESSURE',
  SLEEP_APNEA_DEFINITION: 'SLEEP_APNEA',
  BIOLOGICAL_ASSESSMENT_DEFINITION: 'BIOLOGICAL_ASSESSMENT',
  ECG_DEFINITION: 'ECG'
} as const;
