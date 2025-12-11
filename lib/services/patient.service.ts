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

// ============================================================================
// DUPLICATE PATIENT DETECTION
// ============================================================================

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingMrn?: string;
  existingPatientId?: string;
}

/**
 * Check if a patient with the same identifying information already exists.
 * Checks for matching first name, last name, date of birth, and place of birth
 * within the same center.
 * 
 * @param centerId - The center to check within
 * @param firstName - Patient's first name
 * @param lastName - Patient's last name
 * @param dateOfBirth - Patient's date of birth
 * @param placeOfBirth - Patient's place of birth (optional)
 * @param excludePatientId - Patient ID to exclude from check (for updates)
 * @returns DuplicateCheckResult indicating if duplicate exists
 */
export async function checkDuplicatePatient(
  centerId: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  placeOfBirth: string | null,
  excludePatientId?: string
): Promise<DuplicateCheckResult> {
  const supabase = await createClient();

  // Build query to find matching patients
  let query = supabase
    .from('patients')
    .select('id, medical_record_number')
    .eq('center_id', centerId)
    .eq('active', true)
    .is('deleted_at', null)
    .ilike('first_name', firstName.trim())
    .ilike('last_name', lastName.trim())
    .eq('date_of_birth', dateOfBirth);

  // Handle place of birth matching (null or same value)
  if (placeOfBirth) {
    query = query.ilike('place_of_birth', placeOfBirth.trim());
  } else {
    query = query.is('place_of_birth', null);
  }

  // Exclude specific patient if updating
  if (excludePatientId) {
    query = query.neq('id', excludePatientId);
  }

  const { data, error } = await query.limit(1);

  if (error) {
    console.error('Error checking for duplicate patient:', error);
    // Don't block patient creation on check failure
    return { isDuplicate: false };
  }

  if (data && data.length > 0) {
    return {
      isDuplicate: true,
      existingMrn: data[0].medical_record_number,
      existingPatientId: data[0].id,
    };
  }

  return { isDuplicate: false };
}

export async function deactivatePatient(patientId: string): Promise<void> {
  await updatePatient(patientId, { active: false });
}

export async function activatePatient(patientId: string): Promise<void> {
  await updatePatient(patientId, { active: true });
}

export async function deletePatient(
  patientId: string,
  deletedBy: string
): Promise<void> {
  const supabase = await createClient();

  // Get patient info before deletion
  const patient = await getPatientById(patientId);
  if (!patient) {
    throw new Error('Patient not found');
  }

  // 1. Cancel any pending invitations
  await supabase
    .from('user_invitations')
    .update({ status: 'expired' })
    .eq('patient_id', patientId)
    .eq('status', 'pending');

  // 2. Deactivate linked user account if exists
  if (patient.user_id) {
    await supabase
      .from('user_profiles')
      .update({ active: false })
      .eq('id', patient.user_id);
  }

  // 3. Soft delete the patient with metadata
  await supabase
    .from('patients')
    .update({
      active: false,
      deleted_at: new Date().toISOString(),
      deleted_by: deletedBy,
    })
    .eq('id', patientId);
}

export async function restorePatient(
  patientId: string
): Promise<void> {
  const supabase = await createClient();

  // Get patient info
  const { data: patient } = await supabase
    .from('patients')
    .select('user_id')
    .eq('id', patientId)
    .single();

  if (!patient) {
    throw new Error('Patient not found');
  }

  // 1. Reactivate the patient
  await supabase
    .from('patients')
    .update({
      active: true,
      deleted_at: null,
      deleted_by: null,
    })
    .eq('id', patientId);

  // 2. Reactivate linked user account if exists
  if (patient.user_id) {
    await supabase
      .from('user_profiles')
      .update({ active: true })
      .eq('id', patient.user_id);
  }
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
    .select('accessed_at, patient_id')
    .eq('user_id', userId)
    .order('accessed_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch recent patients: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Fetch full patient details for each accessed patient
  const patientIds = data.map((ra) => ra.patient_id);
  const { data: patients, error: patientsError } = await supabase
    .from('v_patients_full')
    .select('*')
    .in('id', patientIds);

  if (patientsError) {
    throw new Error(`Failed to fetch patient details: ${patientsError.message}`);
  }

  // Map patients with their accessed_at timestamps
  const patientsWithAccess = patients?.map((patient) => {
    const access = data.find((ra) => ra.patient_id === patient.id);
    return {
      ...patient,
      accessed_at: access?.accessed_at,
    };
  }) || [];

  // Sort by accessed_at to maintain order
  return patientsWithAccess.sort((a, b) => {
    if (!a.accessed_at || !b.accessed_at) return 0;
    return new Date(b.accessed_at).getTime() - new Date(a.accessed_at).getTime();
  });
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

// ============================================================================
// PATIENT INVITATION STATUS
// ============================================================================

export interface PatientInvitationStatus {
  hasUserAccount: boolean;
  userId: string | null;
  pendingInvitation: {
    id: string;
    sentAt: string;
    expiresAt: string;
    email: string;
  } | null;
}

export async function getPatientInvitationStatus(
  patientId: string
): Promise<PatientInvitationStatus> {
  const supabase = await createClient();

  // Check if patient has a linked user account
  const { data: patient } = await supabase
    .from('patients')
    .select('user_id')
    .eq('id', patientId)
    .single();

  const hasUserAccount = !!(patient?.user_id);
  const userId = patient?.user_id || null;

  // Check for pending invitation
  const { data: invitation } = await supabase
    .from('user_invitations')
    .select('id, created_at, expires_at, email')
    .eq('patient_id', patientId)
    .eq('status', 'pending')
    .single();

  return {
    hasUserAccount,
    userId,
    pendingInvitation: invitation ? {
      id: invitation.id,
      sentAt: invitation.created_at,
      expiresAt: invitation.expires_at,
      email: invitation.email,
    } : null,
  };
}

// ============================================================================
// PATIENT ASSIGNMENT BY PROFESSIONAL
// ============================================================================

export async function getPatientsByProfessional(
  professionalId: string,
  pathology?: PathologyType
): Promise<PatientFull[]> {
  const supabase = await createClient();

  // Fetch patients assigned to this professional
  let patientsQuery = supabase
    .from('v_patients_full')
    .select('*')
    .eq('assigned_to', professionalId)
    .eq('active', true);

  if (pathology) {
    patientsQuery = patientsQuery.eq('pathology_type', pathology);
  }

  const { data: patients, error } = await patientsQuery
    .order('last_name, first_name');

  if (error) {
    throw new Error(`Failed to fetch assigned patients: ${error.message}`);
  }

  return patients || [];
}

// ============================================================================
// PATIENT REASSIGNMENT
// ============================================================================

export async function reassignPatient(
  patientId: string,
  newAssignedTo: string,
  reassignedBy: string
): Promise<Patient> {
  const supabase = await createClient();

  // Verify the patient exists and reassignedBy is the creator
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('created_by, center_id')
    .eq('id', patientId)
    .single();

  if (patientError || !patient) {
    throw new Error('Patient not found');
  }

  if (patient.created_by !== reassignedBy) {
    throw new Error('Only the creator can reassign this patient');
  }

  // Verify new assignee is from same center
  const { data: assignee, error: assigneeError } = await supabase
    .from('user_profiles')
    .select('center_id')
    .eq('id', newAssignedTo)
    .single();

  if (assigneeError || !assignee || assignee.center_id !== patient.center_id) {
    throw new Error('New assignee must be from the same center');
  }

  // Update patient assignment
  const { data, error } = await supabase
    .from('patients')
    .update({ assigned_to: newAssignedTo })
    .eq('id', patientId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to reassign patient: ${error.message}`);
  }

  return data;
}

// ============================================================================
// PATIENT DEMOGRAPHICS
// ============================================================================

export interface GenderDistribution {
  male: number;
  female: number;
  other: number;
  unspecified: number;
}

export interface AgeDistribution {
  '0-18': number;
  '19-30': number;
  '31-50': number;
  '51-70': number;
  '70+': number;
}

export interface PatientDemographics {
  gender: GenderDistribution;
  age: AgeDistribution;
  total: number;
}

export async function getPatientDemographics(
  centerId: string,
  pathology?: PathologyType
): Promise<PatientDemographics> {
  const supabase = await createClient();

  let query = supabase
    .from('v_patients_full')
    .select('gender, date_of_birth')
    .eq('center_id', centerId)
    .eq('active', true);

  if (pathology) {
    query = query.eq('pathology_type', pathology);
  }

  const { data: patients, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch patient demographics: ${error.message}`);
  }

  if (!patients) {
    return {
      gender: { male: 0, female: 0, other: 0, unspecified: 0 },
      age: { '0-18': 0, '19-30': 0, '31-50': 0, '51-70': 0, '70+': 0 },
      total: 0,
    };
  }

  // Calculate gender distribution
  const genderDist: GenderDistribution = {
    male: 0,
    female: 0,
    other: 0,
    unspecified: 0,
  };

  patients.forEach(p => {
    const gender = p.gender?.toLowerCase();
    if (gender === 'male' || gender === 'm' || gender === 'homme') {
      genderDist.male++;
    } else if (gender === 'female' || gender === 'f' || gender === 'femme') {
      genderDist.female++;
    } else if (gender) {
      genderDist.other++;
    } else {
      genderDist.unspecified++;
    }
  });

  // Calculate age distribution
  const ageDist: AgeDistribution = {
    '0-18': 0,
    '19-30': 0,
    '31-50': 0,
    '51-70': 0,
    '70+': 0,
  };

  const currentYear = new Date().getFullYear();
  patients.forEach(p => {
    if (p.date_of_birth) {
      const birthYear = new Date(p.date_of_birth).getFullYear();
      const age = currentYear - birthYear;
      
      if (age <= 18) ageDist['0-18']++;
      else if (age <= 30) ageDist['19-30']++;
      else if (age <= 50) ageDist['31-50']++;
      else if (age <= 70) ageDist['51-70']++;
      else ageDist['70+']++;
    }
  });

  return {
    gender: genderDist,
    age: ageDist,
    total: patients.length,
  };
}
