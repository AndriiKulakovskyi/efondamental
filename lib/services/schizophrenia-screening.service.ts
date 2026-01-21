// eFondaMental Platform - Schizophrenia Screening Service
// Service layer for schizophrenia screening questionnaires (public.schizophrenia_* tables)

import { createClient } from '@/lib/supabase/server';

// ============================================================================
// Type Definitions
// ============================================================================

export interface SchizophreniaScreeningDiagnosticResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  date_screening: string;
  screening_diag_nommed?: string | null;
  rad_screening_diag_sz_prealable?: string | null;
  rad_screening_diag_sz_prealable_preciser?: string | null;
  rad_screening_diag_sz_evoque?: string | null;
  rad_screening_diag_nonsz?: string | null;
  screening_diag_nonsz_preciser?: string | null;
  screening_diag_differe_preciser?: string | null;
  rad_screening_diag_bilan_programme?: string | null;
  rad_screening_diag_bilan_programme_non?: string | null;
  date_screening_diag_bilan_programme?: string | null;
  rad_screening_diag_lettre_info?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaScreeningDiagnosticInsert = Omit<
  SchizophreniaScreeningDiagnosticResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

export interface SchizophreniaScreeningOrientationResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  rad_screening_orientation_sz?: string | null;
  rad_screening_orientation_psychique?: string | null;
  rad_screening_orientation_priseencharge?: string | null;
  rad_screening_orientation_accord_patient?: string | null;
  eligibility_result?: boolean | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaScreeningOrientationInsert = Omit<
  SchizophreniaScreeningOrientationResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// DIAGNOSTIC
// ============================================================================

export async function getSchizophreniaScreeningDiagnosticResponse(
  visitId: string
): Promise<SchizophreniaScreeningDiagnosticResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('schizophrenia_screening_diagnostic')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveSchizophreniaScreeningDiagnosticResponse(
  response: SchizophreniaScreeningDiagnosticInsert
): Promise<SchizophreniaScreeningDiagnosticResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('schizophrenia_screening_diagnostic')
    .upsert({
      ...response,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// ORIENTATION
// ============================================================================

export async function getSchizophreniaScreeningOrientationResponse(
  visitId: string
): Promise<SchizophreniaScreeningOrientationResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('schizophrenia_screening_orientation')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveSchizophreniaScreeningOrientationResponse(
  response: SchizophreniaScreeningOrientationInsert
): Promise<SchizophreniaScreeningOrientationResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate eligibility based on criteria
  const eligibility = calculateSchizophreniaEligibility(response);

  const { data, error } = await supabase
    .from('schizophrenia_screening_orientation')
    .upsert({
      ...response,
      eligibility_result: eligibility,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Eligibility Calculation
// ============================================================================

function calculateSchizophreniaEligibility(
  response: SchizophreniaScreeningOrientationInsert
): boolean {
  // Eligibility criteria for schizophrenia center expert evaluation:
  // 1. Diagnosis of schizophrenic disorder must be "oui"
  // 2. Patient must be in psychiatric care ("oui")
  // 3. Patient must agree ("oui")
  return (
    response.rad_screening_orientation_sz === 'oui' &&
    response.rad_screening_orientation_psychique === 'oui' &&
    response.rad_screening_orientation_accord_patient === 'oui'
  );
}

// ============================================================================
// Pending Questionnaires for Schizophrenia Screening
// ============================================================================

export async function getSchizophreniaScreeningPendingQuestionnaires(patientId: string) {
  const supabase = await createClient();

  // Get latest screening visit for the patient
  const { data: visit } = await supabase
    .from('visits')
    .select('id, visit_type')
    .eq('patient_id', patientId)
    .eq('visit_type', 'screening')
    .in('status', ['scheduled', 'in_progress'])
    .order('scheduled_date', { ascending: false })
    .limit(1)
    .single();

  if (!visit) return [];

  // Check which questionnaires are completed
  const [diagnostic, orientation] = await Promise.all([
    getSchizophreniaScreeningDiagnosticResponse(visit.id),
    getSchizophreniaScreeningOrientationResponse(visit.id)
  ]);

  const pending = [];
  if (!diagnostic) pending.push({
    id: 'SZ_DIAGNOSTIC',
    title: 'Diagnostic Schizophrenie',
    description: 'Evaluation diagnostique pour le screening schizophrenie',
    estimatedTime: 10
  });
  if (!orientation) pending.push({
    id: 'SZ_ORIENTATION',
    title: 'Orientation Centre Expert',
    description: 'Criteres d\'eligibilite pour le Centre Expert Schizophrenie',
    estimatedTime: 5
  });

  return pending;
}
