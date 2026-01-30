// eFondaMental Platform - Treatment API Routes
// API endpoints for managing patient treatments

import { NextRequest, NextResponse } from 'next/server';
import { getUserContext } from '@/lib/rbac/middleware';
import {
  getAllTreatmentData,
  getPatientMedications,
  addPatientMedication,
  updatePatientMedication,
  deletePatientMedication,
  savePsychotropesLifetimeResponse,
  addSomaticContraceptiveEntry,
  deleteSomaticContraceptiveEntry,
  saveNonPharmacologicResponse,
} from '@/lib/services/treatment.service';

/**
 * GET /api/professional/patients/[id]/treatments
 * Get all treatment data for a patient
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await getUserContext();
    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: patientId } = await params;
    const data = await getAllTreatmentData(patientId);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching treatment data:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch treatment data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/professional/patients/[id]/treatments
 * Add or update treatment data
 * Body: { action: string, data: any }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await getUserContext();
    if (!context) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: patientId } = await params;
    const body = await request.json();
    const { action, data } = body;

    let result;

    switch (action) {
      case 'add_medication':
        result = await addPatientMedication({
          patient_id: patientId,
          medication_name: data.medication_name,
          start_date: data.start_date,
          is_ongoing: data.is_ongoing,
          end_date: data.end_date || null,
          // Dosage fields
          dosage_type: data.dosage_type || null,
          daily_units: data.daily_units || null,
          ampoule_count: data.ampoule_count || null,
          weeks_interval: data.weeks_interval || null,
        });
        break;

      case 'update_medication':
        result = await updatePatientMedication(data.id, {
          medication_name: data.medication_name,
          start_date: data.start_date,
          is_ongoing: data.is_ongoing,
          end_date: data.end_date || null,
        });
        break;

      case 'delete_medication':
        await deletePatientMedication(data.id);
        result = { success: true };
        break;

      case 'save_psychotropes_lifetime':
        result = await savePsychotropesLifetimeResponse({
          patient_id: patientId,
          ...data,
        });
        break;

      case 'add_somatic_contraceptive':
        result = await addSomaticContraceptiveEntry({
          patient_id: patientId,
          medication_name: data.medication_name,
          start_date: data.start_date || null,
          months_exposure: data.months_exposure || null,
        });
        break;

      case 'delete_somatic_contraceptive':
        await deleteSomaticContraceptiveEntry(data.id);
        result = { success: true };
        break;

      case 'save_non_pharmacologic':
        result = await saveNonPharmacologicResponse({
          patient_id: patientId,
          ...data,
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing treatment action:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process treatment action' },
      { status: 500 }
    );
  }
}

