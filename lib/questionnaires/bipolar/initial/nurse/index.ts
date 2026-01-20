// eFondaMental Platform - Bipolar Initial Evaluation - Nurse Module
// Export all nurse questionnaire components

// Tobacco Assessment
export {
  TOBACCO_QUESTIONS,
  TOBACCO_DEFINITION,
  type BipolarTobaccoResponse,
  type BipolarTobaccoResponseInsert
} from './tobacco';

// Fagerstrom Test for Nicotine Dependence
export {
  FAGERSTROM_QUESTIONS,
  FAGERSTROM_DEFINITION,
  computeFagerstromScore,
  getDependenceLevel,
  interpretFagerstromScore,
  scoreFagerstrom,
  type BipolarFagerstromResponse,
  type BipolarFagerstromResponseInsert,
  type FagerstromScoreInput,
  type FagerstromDependenceLevel,
  type FagerstromScoringResult
} from './fagerstrom';

// Physical Parameters
export {
  PHYSICAL_PARAMS_QUESTIONS,
  PHYSICAL_PARAMS_DEFINITION,
  computeBMI,
  getBMICategory,
  interpretBMI,
  computePhysicalParams,
  type BipolarPhysicalParamsResponse,
  type BipolarPhysicalParamsResponseInsert,
  type PhysicalParamsInput,
  type BMICategory,
  type PhysicalParamsResult
} from './physical-params';

// Blood Pressure
export {
  BLOOD_PRESSURE_QUESTIONS,
  BLOOD_PRESSURE_DEFINITION,
  computeTensionStrings,
  detectOrthostaticHypotension,
  type BipolarBloodPressureResponse,
  type BipolarBloodPressureResponseInsert,
  type BloodPressureInput,
  type OrthostaticHypotensionResult
} from './blood-pressure';

// Sleep Apnea (STOP-Bang)
export {
  SLEEP_APNEA_QUESTIONS,
  SLEEP_APNEA_DEFINITION,
  computeStopBangScore,
  getRiskLevel,
  interpretStopBangScore,
  scoreStopBang,
  type BipolarSleepApneaResponse,
  type BipolarSleepApneaResponseInsert,
  type StopBangInput,
  type StopBangRiskLevel,
  type StopBangScoringResult
} from './sleep-apnea';

// Biological Assessment
export {
  BIOLOGICAL_ASSESSMENT_QUESTIONS,
  BIOLOGICAL_ASSESSMENT_DEFINITION,
  computeCreatinineClearance,
  computeCorrectedCalcemia,
  computeCholesterolRatio,
  type BipolarBiologicalAssessmentResponse,
  type BipolarBiologicalAssessmentResponseInsert,
  type CreatinineClearanceInput
} from './biological-assessment';
