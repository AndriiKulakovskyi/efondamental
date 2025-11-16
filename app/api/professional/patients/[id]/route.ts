import { NextRequest, NextResponse } from "next/server";
import { requireProfessional, getUserContext } from "@/lib/rbac/middleware";
import { getPatientById, deletePatient } from "@/lib/services/patient.service";
import { logAuditEvent } from "@/lib/services/audit.service";
import { AuditAction } from "@/lib/types/enums";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireProfessional();
    const context = await getUserContext();

    if (!context?.profile.center_id) {
      return NextResponse.json(
        { error: "No center assigned" },
        { status: 400 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { confirmationLastName } = body;

    // Get patient to verify last name and center access
    const patient = await getPatientById(id);

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    // Verify patient belongs to the professional's center
    if (patient.center_id !== context.profile.center_id) {
      return NextResponse.json(
        { error: "Unauthorized: Patient does not belong to your center" },
        { status: 403 }
      );
    }

    // Verify last name matches (case-insensitive)
    if (patient.last_name.toLowerCase() !== confirmationLastName.toLowerCase()) {
      return NextResponse.json(
        { error: "Last name does not match. Deletion cancelled." },
        { status: 400 }
      );
    }

    // Log audit event before deletion
    await logAuditEvent(
      context.user.id,
      AuditAction.DELETE,
      "patient",
      id,
      context.profile.center_id,
      { 
        patientName: `${patient.first_name} ${patient.last_name}`,
        medicalRecordNumber: patient.medical_record_number
      }
    );

    // Delete the patient (soft delete by setting active = false)
    await deletePatient(id);

    return NextResponse.json(
      { 
        success: true,
        message: "Patient deleted successfully" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete patient:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete patient" },
      { status: 500 }
    );
  }
}

