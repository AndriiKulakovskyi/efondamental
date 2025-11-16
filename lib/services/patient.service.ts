// eFondaMental Platform - Patient Service

import { createClient } from '../supabase/server';
import {
  Patient,
  PatientInsert,
  PatientUpdate,
  PatientFull,
} from '../types/database.types';
import { PathologyType } from '../types/enums';

// ============================================================================
// PATIENT CRUD
// ============================================================================

export async function getPatientById(patientId: string): Promise<PatientFull | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('v_patients_full')
    .select('*')
    .eq('id', patientId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch patient: ${error.message}`);
  }

  return data;
}

export async function createPatient(patient: PatientInsert): Promise<Patient> {
  const supabase = await createClient();

  const { data, error} = await supabase
    .from('patients')
    .insert(patient)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create patient: ${error.message}`);
  }

  return data;
}

export async function updatePatient(
  patientId: string,
  updates: PatientUpdate
): Promise<Patient> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('patients')
    .update(updates)
    .eq('id', patientId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update patient: ${error.message}`);
  }

  return data;
}

export async function deactivatePatient(patientId: string): Promise<void> {
  await updatePatient(patientId, { active: false });
}

export async function activatePatient(patientId: string): Promise<void> {
  await updatePatient(patientId, { active: true });
}

export async function deletePatient(patientId: string): Promise<void> {
  // Soft delete by deactivating the patient
  await deactivatePatient(patientId);
}

// ============================================================================
// PATIENT QUERIES
// ============================================================================

export async function getPatientsByCenter(centerId: string): Promise<PatientFull[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('v_patients_full')
    .select('*')
    .eq('center_id', centerId)
    .eq('active', true)
    .order('last_name, first_name');

  if (error) {
    throw new Error(`Failed to fetch patients by center: ${error.message}`);
  }

  return data || [];
}

export async function getPatientsByCenterAndPathology(
  centerId: string,
  pathology: PathologyType
): Promise<PatientFull[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('v_patients_full')
    .select('*')
    .eq('center_id', centerId)
    .eq('pathology_type', pathology)
    .eq('active', true)
    .order('last_name, first_name');

  if (error) {
    throw new Error(`Failed to fetch patients: ${error.message}`);
  }

  return data || [];
}

export async function getRecentlyAccessedPatients(
  userId: string,
  limit: number = 10
): Promise<PatientFull[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('recent_accesses')
    .select('patient:patients(*, v_patients_full(*))')
    .eq('user_id', userId)
    .order('accessed_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch recent patients: ${error.message}`);
  }

  return data?.map((ra: any) => ra.patient).filter(Boolean) || [];
}

export async function recordPatientAccess(
  userId: string,
  patientId: string
): Promise<void> {
  const supabase = await createClient();

  await supabase
    .from('recent_accesses')
    .upsert({
      user_id: userId,
      patient_id: patientId,
      accessed_at: new Date().toISOString(),
    });
}

// ============================================================================
// PATIENT SEARCH
// ============================================================================

export async function searchPatients(
  searchTerm: string,
  centerId: string,
  pathology?: PathologyType
): Promise<PatientFull[]> {
  const supabase = await createClient();

  let query = supabase
    .from('v_patients_full')
    .select('*')
    .eq('center_id', centerId)
    .eq('active', true);

  if (pathology) {
    query = query.eq('pathology_type', pathology);
  }

  // Search in MRN, first_name, last_name
  if (searchTerm) {
    query = query.or(
      `medical_record_number.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`
    );
  }

  const { data, error } = await query
    .order('last_name, first_name')
    .limit(50);

  if (error) {
    throw new Error(`Failed to search patients: ${error.message}`);
  }

  return data || [];
}

export async function getPatientByMRN(mrn: string): Promise<PatientFull | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('v_patients_full')
    .select('*')
    .eq('medical_record_number', mrn)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch patient by MRN: ${error.message}`);
  }

  return data;
}

// ============================================================================
// PATIENT STATISTICS
// ============================================================================

export async function getPatientStats(patientId: string) {
  const supabase = await createClient();

  // Total visits
  const { count: totalVisits } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .eq('patient_id', patientId);

  // Completed visits
  const { count: completedVisits } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .eq('patient_id', patientId)
    .eq('status', 'completed');

  // Upcoming visits
  const { count: upcomingVisits } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .eq('patient_id', patientId)
    .eq('status', 'scheduled')
    .gte('scheduled_date', new Date().toISOString());

  // Last visit
  const { data: lastVisit } = await supabase
    .from('visits')
    .select('scheduled_date, visit_type')
    .eq('patient_id', patientId)
    .eq('status', 'completed')
    .order('scheduled_date', { ascending: false })
    .limit(1)
    .single();

  // Next visit
  const { data: nextVisit } = await supabase
    .from('visits')
    .select('scheduled_date, visit_type')
    .eq('patient_id', patientId)
    .eq('status', 'scheduled')
    .gte('scheduled_date', new Date().toISOString())
    .order('scheduled_date', { ascending: true })
    .limit(1)
    .single();

  return {
    totalVisits: totalVisits || 0,
    completedVisits: completedVisits || 0,
    upcomingVisits: upcomingVisits || 0,
    lastVisitDate: lastVisit?.scheduled_date || null,
    nextVisitDate: nextVisit?.scheduled_date || null,
  };
}

// ============================================================================
// PATIENT RISK ASSESSMENT
// ============================================================================

export async function getPatientRiskLevel(
  patientId: string
): Promise<'none' | 'low' | 'moderate' | 'high'> {
  const supabase = await createClient();

  // Get most recent evaluation
  const { data: evaluation } = await supabase
    .from('evaluations')
    .select('risk_assessment')
    .eq('patient_id', patientId)
    .order('evaluation_date', { ascending: false })
    .limit(1)
    .single();

  if (!evaluation?.risk_assessment) {
    return 'none';
  }

  const { suicide_risk, relapse_risk } = evaluation.risk_assessment;

  // Return highest risk level
  const risks = [suicide_risk, relapse_risk].filter(Boolean);
  if (risks.includes('high')) return 'high';
  if (risks.includes('moderate')) return 'moderate';
  if (risks.includes('low')) return 'low';
  
  return 'none';
}

export async function getPatientsRequiringFollowup(
  centerId: string,
  pathology?: PathologyType
): Promise<PatientFull[]> {
  const supabase = await createClient();

  let query = supabase
    .from('v_patients_full')
    .select('*')
    .eq('center_id', centerId)
    .eq('active', true);

  if (pathology) {
    query = query.eq('pathology_type', pathology);
  }

  const { data: patients, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch patients: ${error.message}`);
  }

  if (!patients) return [];

  // Filter patients with high/moderate risk or overdue visits
  const patientsRequiringFollowup: PatientFull[] = [];

  for (const patient of patients) {
    const riskLevel = await getPatientRiskLevel(patient.id);
    
    if (riskLevel === 'high' || riskLevel === 'moderate') {
      patientsRequiringFollowup.push(patient);
      continue;
    }

    // Check for overdue visits
    const { data: overdueVisits } = await supabase
      .from('visits')
      .select('id')
      .eq('patient_id', patient.id)
      .eq('status', 'scheduled')
      .lt('scheduled_date', new Date().toISOString())
      .limit(1);

    if (overdueVisits && overdueVisits.length > 0) {
      patientsRequiringFollowup.push(patient);
    }
  }

  return patientsRequiringFollowup;
}

