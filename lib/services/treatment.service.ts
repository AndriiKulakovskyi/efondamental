// eFondaMental Platform - Treatment Service
// Service for managing patient medications and treatment questionnaires

import { createClient } from '@/lib/supabase/server';
import {
  PatientMedication,
  PatientMedicationInsert,
  PatientMedicationUpdate,
  PsychotropesLifetimeResponse,
  PsychotropesLifetimeResponseInsert,
  SomaticContraceptiveEntry,
  SomaticContraceptiveEntryInsert,
  NonPharmacologicResponse,
  NonPharmacologicResponseInsert,
} from '@/lib/types/database.types';

// ============================================================================
// PATIENT MEDICATIONS (Psychotropic treatments)
// ============================================================================

/**
 * Get all medications for a patient
 */
export async function getPatientMedications(
  patientId: string
): Promise<PatientMedication[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('patient_medications')
    .select('*')
    .eq('patient_id', patientId)
    .order('start_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch patient medications: ${error.message}`);
  }

  return data || [];
}

/**
 * Add a new medication for a patient
 */
export async function addPatientMedication(
  medication: PatientMedicationInsert
): Promise<PatientMedication> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('patient_medications')
    .insert({
      ...medication,
      created_by: user.data.user?.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add medication: ${error.message}`);
  }

  return data;
}

/**
 * Update an existing medication
 */
export async function updatePatientMedication(
  id: string,
  updates: PatientMedicationUpdate
): Promise<PatientMedication> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('patient_medications')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update medication: ${error.message}`);
  }

  return data;
}

/**
 * Delete a medication
 */
export async function deletePatientMedication(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('patient_medications')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete medication: ${error.message}`);
  }
}

// ============================================================================
// MEDICATIONS PER VISIT MATRIX
// ============================================================================

interface VisitInfo {
  id: string;
  visit_type: string;
  scheduled_date: string | null;
  status: string;
}

interface MedicationVisitMatrix {
  medication: PatientMedication;
  visitPresence: Record<string, boolean>; // visitId -> was medication active during this visit
}

/**
 * Get medications per visit matrix for a patient
 * Returns each medication with presence/absence for each visit
 */
export async function getMedicationsPerVisit(
  patientId: string
): Promise<{ medications: MedicationVisitMatrix[]; visits: VisitInfo[] }> {
  const supabase = await createClient();

  // Fetch medications
  const { data: medications, error: medsError } = await supabase
    .from('patient_medications')
    .select('*')
    .eq('patient_id', patientId)
    .order('start_date', { ascending: true });

  if (medsError) {
    throw new Error(`Failed to fetch medications: ${medsError.message}`);
  }

  // Fetch visits
  const { data: visits, error: visitsError } = await supabase
    .from('visits')
    .select('id, visit_type, scheduled_date, status')
    .eq('patient_id', patientId)
    .neq('status', 'cancelled')
    .order('scheduled_date', { ascending: true });

  if (visitsError) {
    throw new Error(`Failed to fetch visits: ${visitsError.message}`);
  }

  // Build matrix: for each medication, determine if it was active during each visit
  const matrix: MedicationVisitMatrix[] = (medications || []).map((med) => {
    const visitPresence: Record<string, boolean> = {};

    for (const visit of visits || []) {
      if (!visit.scheduled_date) {
        visitPresence[visit.id] = false;
        continue;
      }

      const visitDate = new Date(visit.scheduled_date);
      const medStart = new Date(med.start_date);
      const medEnd = med.end_date ? new Date(med.end_date) : null;

      // Medication is present if:
      // - Visit date is >= start date
      // - AND either medication is ongoing OR visit date <= end date
      const isActive =
        visitDate >= medStart && (med.is_ongoing || (medEnd && visitDate <= medEnd));

      visitPresence[visit.id] = isActive;
    }

    return {
      medication: med,
      visitPresence,
    };
  });

  return {
    medications: matrix,
    visits: (visits || []) as VisitInfo[],
  };
}

// ============================================================================
// PSYCHOTROPES LIFETIME QUESTIONNAIRE
// ============================================================================

/**
 * Get psychotropes lifetime response for a patient
 */
export async function getPsychotropesLifetimeResponse(
  patientId: string
): Promise<PsychotropesLifetimeResponse | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('responses_psychotropes_lifetime')
    .select('*')
    .eq('patient_id', patientId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch psychotropes lifetime: ${error.message}`);
  }

  return data;
}

/**
 * Save (upsert) psychotropes lifetime response
 */
export async function savePsychotropesLifetimeResponse(
  response: PsychotropesLifetimeResponseInsert
): Promise<PsychotropesLifetimeResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('responses_psychotropes_lifetime')
    .upsert(
      {
        ...response,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'patient_id' }
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save psychotropes lifetime: ${error.message}`);
  }

  return data;
}

// ============================================================================
// SOMATIC AND CONTRACEPTIVE TREATMENTS
// ============================================================================

/**
 * Get all somatic/contraceptive entries for a patient
 */
export async function getSomaticContraceptiveEntries(
  patientId: string
): Promise<SomaticContraceptiveEntry[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('treatment_somatic_contraceptive')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch somatic contraceptive entries: ${error.message}`);
  }

  return data || [];
}

/**
 * Add a new somatic/contraceptive entry
 */
export async function addSomaticContraceptiveEntry(
  entry: SomaticContraceptiveEntryInsert
): Promise<SomaticContraceptiveEntry> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('treatment_somatic_contraceptive')
    .insert({
      ...entry,
      created_by: user.data.user?.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add somatic contraceptive entry: ${error.message}`);
  }

  return data;
}

/**
 * Delete a somatic/contraceptive entry
 */
export async function deleteSomaticContraceptiveEntry(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('treatment_somatic_contraceptive')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete somatic contraceptive entry: ${error.message}`);
  }
}

// ============================================================================
// NON-PHARMACOLOGIC TREATMENTS
// ============================================================================

/**
 * Get non-pharmacologic response for a patient
 */
export async function getNonPharmacologicResponse(
  patientId: string
): Promise<NonPharmacologicResponse | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('responses_non_pharmacologic')
    .select('*')
    .eq('patient_id', patientId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch non pharmacologic response: ${error.message}`);
  }

  return data;
}

/**
 * Save (upsert) non-pharmacologic response
 */
export async function saveNonPharmacologicResponse(
  response: NonPharmacologicResponseInsert
): Promise<NonPharmacologicResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('responses_non_pharmacologic')
    .upsert(
      {
        ...response,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'patient_id' }
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save non pharmacologic response: ${error.message}`);
  }

  return data;
}

// ============================================================================
// AGGREGATED TREATMENT DATA
// ============================================================================

/**
 * Get all treatment data for a patient (for the treatment page)
 */
export async function getAllTreatmentData(patientId: string): Promise<{
  medications: PatientMedication[];
  medicationsPerVisit: { medications: MedicationVisitMatrix[]; visits: VisitInfo[] };
  psychotropesLifetime: PsychotropesLifetimeResponse | null;
  somaticContraceptive: SomaticContraceptiveEntry[];
  nonPharmacologic: NonPharmacologicResponse | null;
}> {
  const [
    medications,
    medicationsPerVisit,
    psychotropesLifetime,
    somaticContraceptive,
    nonPharmacologic,
  ] = await Promise.all([
    getPatientMedications(patientId),
    getMedicationsPerVisit(patientId),
    getPsychotropesLifetimeResponse(patientId),
    getSomaticContraceptiveEntries(patientId),
    getNonPharmacologicResponse(patientId),
  ]);

  return {
    medications,
    medicationsPerVisit,
    psychotropesLifetime,
    somaticContraceptive,
    nonPharmacologic,
  };
}

