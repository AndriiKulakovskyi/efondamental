#!/usr/bin/env npx tsx
// Seed Test Data Script
// Creates test data in Supabase for integration testing

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Load environment variables - try multiple locations
const envPaths = [
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), '.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`Loaded environment from: ${envPath}`);
    break;
  }
}

// ============================================================================
// Configuration
// ============================================================================

const TEST_PATIENT = {
  first_name: 'IntegrationTest',
  last_name: 'BipolarPatient',
  date_of_birth: '1985-06-15',
  gender: 'M',
};

// Bipolar pathology ID from the pathologies table
const BIPOLAR_PATHOLOGY_ID = '6971860c-9efb-4216-b0a8-2e7132c720a0';

// Bipolar visit template IDs from the visit_templates table
const BIPOLAR_SCREENING_TEMPLATE_ID = '189ab339-f6c8-4631-9aa7-48de8aee00dd';
const BIPOLAR_INITIAL_EVAL_TEMPLATE_ID = '3892be8a-dd46-415a-a3fc-206d77a983b0';

// Use existing seed user
const TEST_PROFESSIONAL_EMAIL = 'doctor.paris@fondamental.fr';

// ============================================================================
// Supabase Admin Client
// ============================================================================

function createAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables!');
    console.error('Ensure .env.local contains:');
    console.error('  NEXT_PUBLIC_SUPABASE_URL');
    console.error('  SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ============================================================================
// Data Creation Functions
// ============================================================================

async function getCenterId(client: SupabaseClient): Promise<string> {
  const { data, error } = await client
    .from('centers')
    .select('id')
    .eq('code', 'CEF-PARIS')
    .single();

  if (error || !data) {
    throw new Error(`Failed to get Paris center: ${error?.message || 'No data'}`);
  }

  return data.id;
}

async function getProfessionalId(client: SupabaseClient): Promise<string> {
  const { data, error } = await client
    .from('user_profiles')
    .select('id')
    .eq('email', TEST_PROFESSIONAL_EMAIL)
    .single();

  if (error || !data) {
    throw new Error(`Failed to get professional user: ${error?.message || 'No data'}`);
  }

  return data.id;
}

async function findExistingTestPatient(
  client: SupabaseClient,
  centerId: string
): Promise<{ id: string; medical_record_number: string } | null> {
  const { data, error } = await client
    .from('patients')
    .select('id, medical_record_number')
    .eq('center_id', centerId)
    .eq('first_name', TEST_PATIENT.first_name)
    .eq('last_name', TEST_PATIENT.last_name)
    .eq('active', true)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.warn('Warning checking for existing patient:', error.message);
  }

  return data;
}

async function createTestPatient(
  client: SupabaseClient,
  centerId: string,
  professionalId: string
): Promise<{ id: string; medical_record_number: string }> {
  // Check for existing test patient first
  const existing = await findExistingTestPatient(client, centerId);
  if (existing) {
    console.log(`Found existing test patient: ${existing.medical_record_number}`);
    return existing;
  }

  const mrn = `TEST-BIPOLAR-${Date.now()}`;

  const { data, error } = await client
    .from('patients')
    .insert({
      center_id: centerId,
      medical_record_number: mrn,
      first_name: TEST_PATIENT.first_name,
      last_name: TEST_PATIENT.last_name,
      date_of_birth: TEST_PATIENT.date_of_birth,
      gender: TEST_PATIENT.gender,
      pathology_id: BIPOLAR_PATHOLOGY_ID,
      assigned_to: professionalId,
      created_by: professionalId,
      active: true,
    })
    .select('id, medical_record_number')
    .single();

  if (error || !data) {
    throw new Error(`Failed to create test patient: ${error?.message || 'No data'}`);
  }

  console.log(`Created test patient: ${data.medical_record_number}`);
  return data;
}

async function findExistingScreeningVisit(
  client: SupabaseClient,
  patientId: string
): Promise<{ id: string } | null> {
  const { data, error } = await client
    .from('visits')
    .select('id')
    .eq('patient_id', patientId)
    .eq('visit_type', 'screening')
    .neq('status', 'cancelled')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.warn('Warning checking for existing visit:', error.message);
  }

  return data;
}

async function createScreeningVisit(
  client: SupabaseClient,
  patientId: string,
  professionalId: string
): Promise<{ id: string }> {
  // Check for existing screening visit
  const existing = await findExistingScreeningVisit(client, patientId);
  if (existing) {
    console.log(`Found existing screening visit: ${existing.id}`);
    
    // Reset the visit for fresh testing
    await resetScreeningVisitData(client, existing.id);
    
    return existing;
  }

  const { data, error } = await client
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
    .select('id')
    .single();

  if (error || !data) {
    throw new Error(`Failed to create screening visit: ${error?.message || 'No data'}`);
  }

  console.log(`Created screening visit: ${data.id}`);
  return data;
}

async function resetScreeningVisitData(client: SupabaseClient, visitId: string): Promise<void> {
  console.log('Resetting screening visit data for fresh testing...');

  // Delete all questionnaire responses for this visit
  const tables = [
    'bipolar_asrm',
    'bipolar_qids_sr16',
    'bipolar_mdq',
    'bipolar_diagnostic',
    'bipolar_orientation',
  ];

  for (const table of tables) {
    const { error } = await client
      .from(table)
      .delete()
      .eq('visit_id', visitId);

    if (error) {
      console.warn(`  Warning deleting from ${table}: ${error.message}`);
    }
  }

  // Reset visit status
  await client
    .from('visits')
    .update({
      status: 'in_progress',
      completion_percentage: 0,
      completed_questionnaires: 0,
      total_questionnaires: 5,
    })
    .eq('id', visitId);

  console.log('Screening visit data reset complete.');
}

async function findExistingInitialEvalVisit(
  client: SupabaseClient,
  patientId: string
): Promise<{ id: string } | null> {
  const { data, error } = await client
    .from('visits')
    .select('id')
    .eq('patient_id', patientId)
    .eq('visit_type', 'initial_evaluation')
    .neq('status', 'cancelled')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.warn('Warning checking for existing initial eval visit:', error.message);
  }

  return data;
}

async function createInitialEvalVisit(
  client: SupabaseClient,
  patientId: string,
  professionalId: string
): Promise<{ id: string }> {
  // Check for existing initial evaluation visit
  const existing = await findExistingInitialEvalVisit(client, patientId);
  if (existing) {
    console.log(`Found existing initial evaluation visit: ${existing.id}`);
    
    // Reset the visit for fresh testing
    await resetInitialEvalVisitData(client, existing.id);
    
    return existing;
  }

  const { data, error } = await client
    .from('visits')
    .insert({
      patient_id: patientId,
      visit_type: 'initial_evaluation',
      visit_template_id: BIPOLAR_INITIAL_EVAL_TEMPLATE_ID,
      status: 'in_progress',
      scheduled_date: new Date().toISOString(),
      conducted_by: professionalId,
      created_by: professionalId,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error(`Failed to create initial evaluation visit: ${error?.message || 'No data'}`);
  }

  console.log(`Created initial evaluation visit: ${data.id}`);
  return data;
}

async function resetInitialEvalVisitData(client: SupabaseClient, visitId: string): Promise<void> {
  console.log('Resetting initial evaluation visit data for fresh testing...');

  // Delete all nurse module questionnaire responses for this visit
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
    const { error } = await client
      .from(table)
      .delete()
      .eq('visit_id', visitId);

    if (error) {
      console.warn(`  Warning deleting from ${table}: ${error.message}`);
    }
  }

  // Reset visit status (initial eval has many more questionnaires)
  await client
    .from('visits')
    .update({
      status: 'in_progress',
      completion_percentage: 0,
      completed_questionnaires: 0,
      total_questionnaires: 55, // Approximate for bipolar initial eval
    })
    .eq('id', visitId);

  console.log('Initial evaluation visit data reset complete.');
}

// ============================================================================
// Main Script
// ============================================================================

async function main() {
  console.log('='.repeat(60));
  console.log('eFondaMental - Seed Test Data Script');
  console.log('='.repeat(60));
  console.log('');

  const client = createAdminClient();

  try {
    // Get Paris center
    console.log('Getting Paris center ID...');
    const centerId = await getCenterId(client);
    console.log(`  Center ID: ${centerId}`);

    // Get professional user ID
    console.log('');
    console.log('Getting professional user ID...');
    const professionalId = await getProfessionalId(client);
    console.log(`  Professional ID: ${professionalId}`);

    // Create or get test patient
    console.log('');
    console.log('Setting up test patient...');
    const patient = await createTestPatient(client, centerId, professionalId);
    console.log(`  Patient ID: ${patient.id}`);
    console.log(`  MRN: ${patient.medical_record_number}`);

    // Create or get screening visit
    console.log('');
    console.log('Setting up screening visit...');
    const screeningVisit = await createScreeningVisit(client, patient.id, professionalId);
    console.log(`  Screening Visit ID: ${screeningVisit.id}`);

    // Create or get initial evaluation visit
    console.log('');
    console.log('Setting up initial evaluation visit...');
    const initialEvalVisit = await createInitialEvalVisit(client, patient.id, professionalId);
    console.log(`  Initial Evaluation Visit ID: ${initialEvalVisit.id}`);

    // Output summary
    console.log('');
    console.log('='.repeat(60));
    console.log('Test Data Summary');
    console.log('='.repeat(60));
    console.log('');
    console.log('Use these IDs in your tests:');
    console.log('');
    console.log(`  CENTER_ID=${centerId}`);
    console.log(`  PATIENT_ID=${patient.id}`);
    console.log(`  SCREENING_VISIT_ID=${screeningVisit.id}`);
    console.log(`  INITIAL_EVAL_VISIT_ID=${initialEvalVisit.id}`);
    console.log(`  PROFESSIONAL_ID=${professionalId}`);
    console.log('');
    console.log('Test user credentials:');
    console.log(`  Email: ${TEST_PROFESSIONAL_EMAIL}`);
    console.log(`  Password: Password123!`);
    console.log('');
    console.log('='.repeat(60));
    console.log('Seed completed successfully!');
    console.log('='.repeat(60));

    // Write to a JSON file for tests to consume
    const testConfig = {
      centerId,
      patientId: patient.id,
      patientMrn: patient.medical_record_number,
      patientGender: TEST_PATIENT.gender,
      // Legacy field for backwards compatibility with screening tests
      visitId: screeningVisit.id,
      // New fields for specific visit types
      screeningVisitId: screeningVisit.id,
      initialEvalVisitId: initialEvalVisit.id,
      professionalId: professionalId,
      professionalEmail: TEST_PROFESSIONAL_EMAIL,
    };

    const fs = await import('fs');
    fs.writeFileSync(
      '__tests__/test-config.json',
      JSON.stringify(testConfig, null, 2)
    );
    console.log('');
    console.log('Test configuration written to __tests__/test-config.json');

  } catch (error) {
    console.error('');
    console.error('Error seeding test data:', error);
    process.exit(1);
  }
}

main();
