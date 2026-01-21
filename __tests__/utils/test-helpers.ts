// Test Helpers
// Utility functions for creating and managing test data

import { SupabaseClient } from '@supabase/supabase-js';
import {
  createTestAdminClient,
  TEST_CREDENTIALS,
  getPariscenterId,
  getProfessionalId,
} from './supabase-test-client';

// ============================================================================
// Test Data Types
// ============================================================================

// Bipolar pathology ID from the pathologies table
const BIPOLAR_PATHOLOGY_ID = '6971860c-9efb-4216-b0a8-2e7132c720a0';

// Bipolar visit template IDs from the visit_templates table
const BIPOLAR_SCREENING_TEMPLATE_ID = '189ab339-f6c8-4631-9aa7-48de8aee00dd';
const BIPOLAR_INITIAL_EVAL_TEMPLATE_ID = '3892be8a-dd46-415a-a3fc-206d77a983b0';

export interface TestPatientData {
  id: string;
  medical_record_number: string;
  first_name: string;
  last_name: string;
}

export interface TestVisitData {
  id: string;
  patient_id: string;
  visit_type: string;
  status: string;
}

export interface TestContext {
  adminClient: SupabaseClient;
  centerId: string;
  professionalId: string;
  patient: TestPatientData;
  visit: TestVisitData;
}

// ============================================================================
// Test Data Creation
// ============================================================================

/**
 * Creates a test patient for bipolar screening tests
 */
export async function createTestPatient(
  adminClient: SupabaseClient,
  centerId: string,
  professionalId: string
): Promise<TestPatientData> {
  const timestamp = Date.now();
  const mrn = `TEST-BP-${timestamp}`;

  const { data, error } = await adminClient
    .from('patients')
    .insert({
      center_id: centerId,
      medical_record_number: mrn,
      first_name: 'Test',
      last_name: `BipolarPatient_${timestamp}`,
      date_of_birth: '1985-01-15',
      gender: 'M',
      pathology_id: BIPOLAR_PATHOLOGY_ID,
      assigned_to: professionalId,
      created_by: professionalId,
      active: true,
    })
    .select('id, medical_record_number, first_name, last_name')
    .single();

  if (error || !data) {
    throw new Error(`Failed to create test patient: ${error?.message || 'No data'}`);
  }

  return data;
}

/**
 * Creates a screening visit for the test patient
 */
export async function createTestScreeningVisit(
  adminClient: SupabaseClient,
  patientId: string,
  professionalId: string
): Promise<TestVisitData> {
  const { data, error } = await adminClient
    .from('visits')
    .insert({
      patient_id: patientId,
      visit_type: 'screening',
      visit_template_id: BIPOLAR_SCREENING_TEMPLATE_ID,
      status: 'in_progress',
      scheduled_date: new Date().toISOString(),
      conducted_by: professionalId,
      created_by: professionalId,
    })
    .select('id, patient_id, visit_type, status')
    .single();

  if (error || !data) {
    throw new Error(`Failed to create test visit: ${error?.message || 'No data'}`);
  }

  return data;
}

/**
 * Sets up a complete test context with patient and visit
 */
export async function setupTestContext(): Promise<TestContext> {
  const adminClient = createTestAdminClient();
  const centerId = await getPariscenterId();
  const professionalId = await getProfessionalId();

  const patient = await createTestPatient(adminClient, centerId, professionalId);
  const visit = await createTestScreeningVisit(adminClient, patient.id, professionalId);

  return {
    adminClient,
    centerId,
    professionalId,
    patient,
    visit,
  };
}

// ============================================================================
// Test Data Cleanup
// ============================================================================

/**
 * Cleans up all test data created for a specific screening visit
 */
export async function cleanupTestVisitData(
  adminClient: SupabaseClient,
  visitId: string
): Promise<void> {
  // Delete questionnaire responses (they cascade from visit, but let's be explicit)
  const tables = [
    'bipolar_asrm',
    'bipolar_qids_sr16',
    'bipolar_mdq',
    'bipolar_diagnostic',
    'bipolar_orientation',
  ];

  for (const table of tables) {
    const { error } = await adminClient
      .from(table)
      .delete()
      .eq('visit_id', visitId);

    if (error) {
      console.warn(`Warning: Failed to delete from ${table}: ${error.message}`);
    }
  }
}

/**
 * Cleans up all nurse module data for a specific initial evaluation visit
 */
export async function cleanupNurseModuleData(
  adminClient: SupabaseClient,
  visitId: string
): Promise<void> {
  const nurseTables = [
    'bipolar_nurse_tobacco',
    'bipolar_nurse_fagerstrom',
    'bipolar_nurse_physical_params',
    'bipolar_nurse_blood_pressure',
    'bipolar_nurse_sleep_apnea',
    'bipolar_nurse_biological_assessment',
    'bipolar_nurse_ecg',
  ];

  for (const table of nurseTables) {
    const { error } = await adminClient
      .from(table)
      .delete()
      .eq('visit_id', visitId);

    if (error) {
      console.warn(`Warning: Failed to delete from ${table}: ${error.message}`);
    }
  }
}

/**
 * Cleans up a test patient and all associated data
 */
export async function cleanupTestPatient(
  adminClient: SupabaseClient,
  patientId: string
): Promise<void> {
  // First get all visits for this patient
  const { data: visits } = await adminClient
    .from('visits')
    .select('id')
    .eq('patient_id', patientId);

  // Clean up visit data
  if (visits) {
    for (const visit of visits) {
      await cleanupTestVisitData(adminClient, visit.id);
    }
  }

  // Delete visits
  await adminClient
    .from('visits')
    .delete()
    .eq('patient_id', patientId);

  // Delete patient
  const { error } = await adminClient
    .from('patients')
    .delete()
    .eq('id', patientId);

  if (error) {
    console.warn(`Warning: Failed to delete test patient: ${error.message}`);
  }
}

/**
 * Cleans up the entire test context
 */
export async function cleanupTestContext(context: TestContext): Promise<void> {
  await cleanupTestPatient(context.adminClient, context.patient.id);
}

// ============================================================================
// Mock Response Generators
// ============================================================================

/**
 * Generate valid ASRM responses (scores 0-4 for each of 5 questions)
 */
export function generateAsrmResponses(options?: {
  allZeros?: boolean;
  allMax?: boolean;
  specificScore?: number;
}): Record<string, number> {
  if (options?.allZeros) {
    return { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
  }
  if (options?.allMax) {
    return { q1: 4, q2: 4, q3: 4, q4: 4, q5: 4 };
  }
  if (options?.specificScore !== undefined) {
    // Distribute the score across questions
    const score = Math.min(options.specificScore, 20);
    const base = Math.floor(score / 5);
    const remainder = score % 5;
    return {
      q1: Math.min(base + (remainder > 0 ? 1 : 0), 4),
      q2: Math.min(base + (remainder > 1 ? 1 : 0), 4),
      q3: Math.min(base + (remainder > 2 ? 1 : 0), 4),
      q4: Math.min(base + (remainder > 3 ? 1 : 0), 4),
      q5: Math.min(base + (remainder > 4 ? 1 : 0), 4),
    };
  }
  // Default: moderate responses
  return { q1: 1, q2: 2, q3: 1, q4: 2, q5: 1 }; // Total = 7
}

/**
 * Generate valid QIDS-SR16 responses (scores 0-3 for each of 16 questions)
 */
export function generateQidsResponses(options?: {
  allZeros?: boolean;
  allMax?: boolean;
  severity?: 'none' | 'mild' | 'moderate' | 'severe' | 'very_severe';
}): Record<string, number> {
  if (options?.allZeros) {
    const responses: Record<string, number> = {};
    for (let i = 1; i <= 16; i++) {
      responses[`q${i}`] = 0;
    }
    return responses;
  }
  if (options?.allMax) {
    const responses: Record<string, number> = {};
    for (let i = 1; i <= 16; i++) {
      responses[`q${i}`] = 3;
    }
    return responses;
  }
  
  // Generate based on severity level
  // QIDS scoring uses domain MAX, so total score depends on:
  // sleep_max + q5 + appetite_weight_max + q10 + q11 + q12 + q13 + q14 + psychomotor_max
  let targetScore = 3; // Default: none
  if (options?.severity === 'mild') targetScore = 8;
  if (options?.severity === 'moderate') targetScore = 13;
  if (options?.severity === 'severe') targetScore = 18;
  if (options?.severity === 'very_severe') targetScore = 24;
  
  // Simplified distribution
  const value = Math.min(Math.floor(targetScore / 9), 3);
  const responses: Record<string, number> = {};
  for (let i = 1; i <= 16; i++) {
    responses[`q${i}`] = value;
  }
  return responses;
}

/**
 * Generate valid MDQ responses
 */
export function generateMdqResponses(options?: {
  positive?: boolean;
  q1Score?: number;
}): Record<string, number | null> {
  if (options?.positive) {
    // Positive screen: >=7 yes on q1, q2=yes, q3>=2
    return {
      q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
      q1_6: 1, q1_7: 1, q1_8: 0, q1_9: 0, q1_10: 0,
      q1_11: 0, q1_12: 0, q1_13: 0,
      q2: 1,  // Yes - symptoms occurred together
      q3: 2,  // Moderate problem
    };
  }
  
  // Default: negative screen
  const q1Score = options?.q1Score ?? 3;
  const responses: Record<string, number | null> = {
    q1_1: q1Score >= 1 ? 1 : 0,
    q1_2: q1Score >= 2 ? 1 : 0,
    q1_3: q1Score >= 3 ? 1 : 0,
    q1_4: 0, q1_5: 0, q1_6: 0, q1_7: 0,
    q1_8: 0, q1_9: 0, q1_10: 0, q1_11: 0, q1_12: 0, q1_13: 0,
    q2: 0,  // No
    q3: 1,  // Minor problem
  };
  return responses;
}

/**
 * Generate valid Diagnostic form responses
 */
export function generateDiagnosticResponses(options?: {
  diagEvoque?: 'oui' | 'non' | 'differe';
  bilanProgramme?: 'oui' | 'non';
}): Record<string, string | null> {
  const diagEvoque = options?.diagEvoque ?? 'oui';
  const bilanProgramme = options?.bilanProgramme ?? 'oui';

  const responses: Record<string, string | null> = {
    date_recueil: new Date().toISOString().split('T')[0],
    diag_prealable: 'non',
    diag_evoque: diagEvoque,
    lettre_information: 'oui',
  };

  if (diagEvoque === 'oui') {
    responses.bilan_programme = bilanProgramme;
    if (bilanProgramme === 'non') {
      responses.bilan_programme_precision = 'patient_non_disponible';
    }
  } else if (diagEvoque === 'non') {
    responses.diag_recuse_precision = 'edm_unipolaire';
  }

  return responses;
}

/**
 * Generate valid Orientation form responses
 */
export function generateOrientationResponses(options?: {
  allYes?: boolean;
  eligible?: boolean;
}): Record<string, string> {
  if (options?.allYes || options?.eligible) {
    return {
      trouble_bipolaire_ou_suspicion: 'oui',
      etat_thymique_compatible: 'oui',
      prise_en_charge_100_ou_accord: 'oui',
      accord_evaluation_centre_expert: 'oui',
      accord_transmission_cr: 'oui',
    };
  }

  // Default: not eligible (one criterion is 'non')
  return {
    trouble_bipolaire_ou_suspicion: 'oui',
    etat_thymique_compatible: 'oui',
    prise_en_charge_100_ou_accord: 'non', // Not covered
    accord_evaluation_centre_expert: 'oui',
    accord_transmission_cr: 'oui',
  };
}

// ============================================================================
// Nurse Module Mock Response Generators
// ============================================================================

export type SmokingStatusType = 'non_smoker' | 'current_smoker' | 'ex_smoker' | 'unknown';

/**
 * Generate valid Tobacco assessment responses
 * Note: has_substitution is boolean in DB, has_substitution_ex is varchar
 */
export function generateTobaccoResponses(options?: {
  status?: SmokingStatusType;
  packYears?: number;
  hasSubstitution?: boolean;
}): Record<string, string | number | boolean | string[] | null> {
  const status = options?.status ?? 'non_smoker';

  if (status === 'non_smoker' || status === 'unknown') {
    return {
      smoking_status: status,
    };
  }

  if (status === 'current_smoker') {
    const responses: Record<string, string | number | boolean | string[] | null> = {
      smoking_status: 'current_smoker',
      pack_years: options?.packYears ?? 10,
      smoking_start_age: '18',
      has_substitution: options?.hasSubstitution ?? false, // boolean in DB
    };
    if (options?.hasSubstitution) {
      responses.substitution_methods = ['e_cigarette', 'patch'];
    }
    return responses;
  }

  // ex_smoker
  const responses: Record<string, string | number | boolean | string[] | null> = {
    smoking_status: 'ex_smoker',
    pack_years_ex: options?.packYears ?? 15,
    smoking_start_age_ex: '16',
    smoking_end_age: '35',
    has_substitution_ex: options?.hasSubstitution ? 'yes' : 'no', // varchar in DB
  };
  if (options?.hasSubstitution) {
    responses.substitution_methods_ex = ['patch', 'nicorette'];
  }
  return responses;
}

export type DependenceLevelType = 'none' | 'low' | 'moderate' | 'high' | 'very_high';

/**
 * Generate valid Fagerstrom responses for given dependence level
 * Score ranges: none (0-2), low (3-4), moderate (5), high (6-7), very_high (8-10)
 */
export function generateFagerstromResponses(options?: {
  dependenceLevel?: DependenceLevelType;
  targetScore?: number;
}): Record<string, number> {
  // Target scores for each level
  const levelScores: Record<DependenceLevelType, number> = {
    none: 1,
    low: 4,
    moderate: 5,
    high: 7,
    very_high: 9,
  };

  const targetScore = options?.targetScore ?? levelScores[options?.dependenceLevel ?? 'moderate'];

  // Score distribution based on target
  // q1: 0-3, q2: 0-1, q3: 0-1, q4: 0-3, q5: 0-1, q6: 0-1
  // Max: 3+1+1+3+1+1 = 10
  if (targetScore <= 2) {
    return { q1: 0, q2: 0, q3: 0, q4: 0, q5: 1, q6: targetScore > 0 ? 1 : 0 };
  }
  if (targetScore <= 4) {
    return { q1: 1, q2: 1, q3: 0, q4: 1, q5: targetScore === 4 ? 1 : 0, q6: 0 };
  }
  if (targetScore === 5) {
    return { q1: 1, q2: 1, q3: 1, q4: 1, q5: 1, q6: 0 };
  }
  if (targetScore <= 7) {
    return { q1: 2, q2: 1, q3: 1, q4: 2, q5: targetScore === 7 ? 1 : 0, q6: 0 };
  }
  // targetScore 8-10
  return { q1: 3, q2: 1, q3: 1, q4: 3, q5: 1, q6: targetScore >= 10 ? 1 : 0 };
}

export type BMICategoryType = 'underweight' | 'normal' | 'overweight' | 'obese';

/**
 * Generate valid Physical Parameters responses
 */
export function generatePhysicalParamsResponses(options?: {
  bmiCategory?: BMICategoryType;
  heightCm?: number;
  weightKg?: number;
  pregnant?: boolean;
}): Record<string, number | string | null> {
  // Default values for normal BMI (height 175cm, weight 70kg -> BMI ~22.9)
  let heightCm = options?.heightCm ?? 175;
  let weightKg = options?.weightKg;

  if (!weightKg) {
    // Calculate weight based on desired BMI category
    const heightM = heightCm / 100;
    switch (options?.bmiCategory) {
      case 'underweight':
        weightKg = Math.round(17 * heightM * heightM); // BMI ~17
        break;
      case 'overweight':
        weightKg = Math.round(27 * heightM * heightM); // BMI ~27
        break;
      case 'obese':
        weightKg = Math.round(35 * heightM * heightM); // BMI ~35
        break;
      default:
        weightKg = Math.round(22.5 * heightM * heightM); // BMI ~22.5 (normal)
    }
  }

  const responses: Record<string, number | string | null> = {
    height_cm: heightCm,
    weight_kg: weightKg,
    abdominal_circumference_cm: options?.bmiCategory === 'obese' ? 110 : 85,
  };

  if (options?.pregnant !== undefined) {
    responses.pregnant = options.pregnant ? 'Oui' : 'Non';
  }

  return responses;
}

/**
 * Generate valid Blood Pressure responses
 */
export function generateBloodPressureResponses(options?: {
  hasOrthostaticHypotension?: boolean;
  hypertension?: boolean;
}): Record<string, number> {
  if (options?.hasOrthostaticHypotension) {
    // Orthostatic hypotension: drop >= 20 systolic or >= 10 diastolic
    return {
      bp_lying_systolic: 130,
      bp_lying_diastolic: 85,
      heart_rate_lying: 72,
      bp_standing_systolic: 105, // Drop of 25
      bp_standing_diastolic: 70, // Drop of 15
      heart_rate_standing: 88,
    };
  }

  if (options?.hypertension) {
    return {
      bp_lying_systolic: 160,
      bp_lying_diastolic: 100,
      heart_rate_lying: 78,
      bp_standing_systolic: 155,
      bp_standing_diastolic: 95,
      heart_rate_standing: 82,
    };
  }

  // Normal BP
  return {
    bp_lying_systolic: 120,
    bp_lying_diastolic: 78,
    heart_rate_lying: 68,
    bp_standing_systolic: 118,
    bp_standing_diastolic: 76,
    heart_rate_standing: 72,
  };
}

export type SleepApneaRiskType = 'low' | 'intermediate' | 'high';

/**
 * Generate valid Sleep Apnea responses
 * Note: Most STOP-Bang fields are boolean in DB, diagnosed_sleep_apnea is varchar
 */
export function generateSleepApneaResponses(options?: {
  diagnosed?: boolean;
  hasCpap?: boolean;
  riskLevel?: SleepApneaRiskType;
  gender?: 'M' | 'F';
}): Record<string, string | boolean> {
  if (options?.diagnosed) {
    return {
      diagnosed_sleep_apnea: 'yes',
      has_cpap_device: options.hasCpap ?? false, // boolean in DB
    };
  }

  // Not diagnosed - use STOP-Bang questionnaire
  // Score 0-2 = low, 3-4 = intermediate, 5-8 = high
  const riskLevel = options?.riskLevel ?? 'low';
  const isMale = options?.gender === 'M';

  if (riskLevel === 'low') {
    return {
      diagnosed_sleep_apnea: 'no',
      snoring: false,
      tiredness: false,
      observed_apnea: false,
      hypertension: false,
      bmi_over_35: false,
      age_over_50: false,
      large_neck: false,
      male_gender: isMale, // boolean in DB
    };
  }

  if (riskLevel === 'intermediate') {
    return {
      diagnosed_sleep_apnea: 'no',
      snoring: true,
      tiredness: true,
      observed_apnea: false,
      hypertension: true,
      bmi_over_35: false,
      age_over_50: false,
      large_neck: false,
      male_gender: isMale, // boolean in DB
    };
  }

  // High risk
  return {
    diagnosed_sleep_apnea: 'no',
    snoring: true,
    tiredness: true,
    observed_apnea: true,
    hypertension: true,
    bmi_over_35: true,
    age_over_50: true,
    large_neck: false,
    male_gender: isMale, // boolean in DB
  };
}

/**
 * Generate valid Biological Assessment responses
 */
export function generateBiologicalAssessmentResponses(options?: {
  hasDiabetesRisk?: boolean;
  hasLipidAbnormality?: boolean;
  includeCalculatedFields?: boolean;
}): Record<string, string | number | null> {
  const responses: Record<string, string | number | null> = {
    collection_date: new Date().toISOString().split('T')[0],
    collection_location: 'sur_site',
    treatment_taken_morning: 'no',
    // Basic biochemistry
    sodium: 140,
    potassium: 4.2,
    chlore: 102,
    creatinine: 85,
    // Lipid panel
    hdl: 1.5,
    hdl_unit: 'mmol_L',
    ldl: 3.2,
    ldl_unit: 'mmol_L',
    cholesterol_total: options?.hasLipidAbnormality ? 7.0 : 5.2,
    triglycerides: options?.hasLipidAbnormality ? 2.5 : 1.1,
    // Thyroid
    tsh: 2.5,
    tsh_unit: 'mUI_L',
    // NFS
    leucocytes: 7.5,
    hematies: 4.8,
    hemoglobine: 14.2,
    hemoglobine_unit: 'g_dL',
    plaquettes: 250,
    // Liver
    asat: 25,
    alat: 30,
    ggt: 40,
  };

  if (options?.hasDiabetesRisk) {
    responses.glycemie_a_jeun = 8.5;
    responses.glycemie_a_jeun_unit = 'mmol_L';
    responses.hemoglobine_glyquee = 7.2;
  } else {
    responses.glycemie_a_jeun = 5.2;
    responses.glycemie_a_jeun_unit = 'mmol_L';
  }

  if (options?.includeCalculatedFields) {
    // For testing calculated fields
    responses.calcemie = 2.35;
    responses.protidemie = 72;
  }

  return responses;
}

/**
 * Generate valid ECG responses
 */
export function generateEcgResponses(options?: {
  performed?: boolean;
  prolongedQTc?: boolean;
  gender?: 'M' | 'F';
}): Record<string, string | number | null> {
  if (options?.performed === false) {
    return {
      ecg_performed: 'no',
    };
  }

  // ECG performed
  const responses: Record<string, string | number | null> = {
    ecg_performed: 'yes',
    heart_rate: 72,
    ecg_sent_to_cardiologist: 'no',
    cardiologist_consultation_requested: 'no',
  };

  if (options?.prolongedQTc) {
    // QT and RR values that result in prolonged QTc
    // QTc = QT / sqrt(RR)
    // For prolonged: QTc > 0.43 (M) or > 0.48 (F)
    // With RR = 0.85 (sqrt = 0.922), QT = 0.45 -> QTc = 0.488
    responses.qt_measured = 0.45;
    responses.rr_measured = 0.85;
  } else {
    // Normal QTc
    // With RR = 0.85, QT = 0.38 -> QTc = 0.412 (normal)
    responses.qt_measured = 0.38;
    responses.rr_measured = 0.85;
  }

  return responses;
}
