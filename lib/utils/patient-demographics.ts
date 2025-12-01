/**
 * Patient Demographics Utilities
 * 
 * Centralized functions for calculating patient age and managing demographic data
 * used in questionnaire scoring.
 */

/**
 * Calculate the precise age in years at a specific date.
 * 
 * @param dateOfBirth - Patient's date of birth (ISO string or Date)
 * @param targetDate - The date at which to calculate age (e.g., visit date)
 * @returns Age in complete years
 */
export function calculateAgeAtDate(
  dateOfBirth: string | Date,
  targetDate: string | Date
): number {
  const birthDate = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const refDate = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  
  let age = refDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = refDate.getMonth() - birthDate.getMonth();
  
  // Adjust age if birthday hasn't occurred yet in the target year
  if (monthDiff < 0 || (monthDiff === 0 && refDate.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Normalize gender value to a consistent format.
 * Handles various input formats (M/F, male/female, homme/femme).
 * 
 * @param gender - Raw gender value from patient record
 * @returns Normalized gender code ('M' | 'F') or null if not recognized
 */
export function normalizeGender(gender: string | null | undefined): 'M' | 'F' | null {
  if (!gender) return null;
  
  const normalized = gender.toLowerCase().trim();
  
  if (normalized === 'male' || normalized === 'm' || normalized === 'homme') {
    return 'M';
  }
  
  if (normalized === 'female' || normalized === 'f' || normalized === 'femme') {
    return 'F';
  }
  
  return null;
}

/**
 * Interface for patient demographics data used in questionnaire scoring.
 */
export interface PatientDemographicsForVisit {
  /** Patient's age in years at the time of the visit */
  patient_age: number;
  /** Normalized gender code ('M' or 'F') */
  patient_gender: 'M' | 'F' | null;
  /** Gender code specifically for questionnaires using patient_sex field */
  patient_sex: 'M' | 'F' | null;
}

/**
 * List of questionnaire codes that require patient demographics (age/gender) for scoring.
 * This list is used to determine which questionnaires need demographic injection.
 */
export const QUESTIONNAIRES_REQUIRING_DEMOGRAPHICS: string[] = [
  // WAIS-IV questionnaires
  'WAIS4_CRITERIA_FR',
  'WAIS4_MATRICES_FR',
  'WAIS4_CODE_FR',
  'WAIS4_DIGIT_SPAN_FR',
  'WAIS4_SIMILITUDES_FR',
  
  // Cognitive assessments
  'CVLT_FR',
  'TMT_FR',
  'STROOP_FR',
  'FLUENCES_VERBALES_FR',
  'TEST_COMMISSIONS_FR',
  'SCIP_FR',
  'COBRA_FR',
  
  // WAIS-III questionnaires
  'WAIS3_CRITERIA_FR',
  'WAIS3_CVLT_FR',
  'WAIS3_TMT_FR',
  'WAIS3_STROOP_FR',
  'WAIS3_FLUENCES_VERBALES_FR',
  'WAIS3_MATRICES_FR',
  'WAIS3_CODE_SYMBOLES_FR',
  'WAIS3_DIGIT_SPAN_FR',
  'WAIS3_MEM3_SPATIAL_FR',
  
  // Infirmier questionnaires
  'BIOLOGICAL_ASSESSMENT',
];

/**
 * Questionnaires that use 'age' field instead of 'patient_age'.
 * These need special handling to inject the age into the 'age' field.
 */
export const QUESTIONNAIRES_USING_AGE_FIELD: string[] = [
  'WAIS4_CRITERIA_FR',
  'WAIS3_CRITERIA_FR',
];

/**
 * Questionnaires that use patient_sex field (vs patient_gender).
 * CVLT specifically uses patient_sex with 'F'/'M' codes.
 */
export const QUESTIONNAIRES_USING_PATIENT_SEX: string[] = [
  'CVLT_FR',
  'WAIS3_CVLT_FR',
];

/**
 * Check if a questionnaire requires patient demographics.
 * 
 * @param questionnaireCode - The questionnaire code to check
 * @returns True if the questionnaire requires demographics
 */
export function questionnaireRequiresDemographics(questionnaireCode: string): boolean {
  return QUESTIONNAIRES_REQUIRING_DEMOGRAPHICS.includes(questionnaireCode);
}

/**
 * Check if a questionnaire uses patient_sex field (vs patient_gender).
 * 
 * @param questionnaireCode - The questionnaire code to check
 * @returns True if the questionnaire uses patient_sex
 */
export function questionnaireUsesPatientSex(questionnaireCode: string): boolean {
  return QUESTIONNAIRES_USING_PATIENT_SEX.includes(questionnaireCode);
}

/**
 * Check if a questionnaire uses 'age' field instead of 'patient_age'.
 * 
 * @param questionnaireCode - The questionnaire code to check
 * @returns True if the questionnaire uses the 'age' field
 */
export function questionnaireUsesAgeField(questionnaireCode: string): boolean {
  return QUESTIONNAIRES_USING_AGE_FIELD.includes(questionnaireCode);
}

