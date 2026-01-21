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

// Bipolar screening visit template ID from the visit_templates table
const BIPOLAR_SCREENING_TEMPLATE_ID = '189ab339-f6c8-4631-9aa7-48de8aee00dd';

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
 * Cleans up all test data created for a specific visit
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
