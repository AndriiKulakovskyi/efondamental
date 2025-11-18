import { NextRequest, NextResponse } from "next/server";
import { requireProfessional, getUserContext } from "@/lib/rbac/middleware";
import { getPatientById, deletePatient, updatePatient } from "@/lib/services/patient.service";
import { invitePatient } from "@/lib/services/user-provisioning.service";
import { logAuditEvent } from "@/lib/services/audit.service";
import { AuditAction } from "@/lib/types/enums";

export async function PATCH(
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
    const { email, sendInvitation } = body;

    // Get patient to verify center access
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

    // Update patient email
    const updatedPatient = await updatePatient(id, { email });

    // Log audit event
    await logAuditEvent({
      userId: context.user.id,
      action: AuditAction.UPDATE,
      entityType: "patient",
      entityId: id,
      centerId: context.profile.center_id,
      changes: { oldEmail: patient.email, newEmail: email }
    });

    // Send invitation if requested
    let invitationResult = null;
    if (sendInvitation && email) {
      try {
        invitationResult = await invitePatient({
          patientId: id,
          email,
          firstName: patient.first_name,
          lastName: patient.last_name,
          centerId: context.profile.center_id,
          invitedBy: context.user.id,
        });

        if (!invitationResult.success) {
          console.warn('Failed to send patient invitation:', invitationResult.error);
        }
      } catch (inviteError) {
        console.error('Error sending patient invitation:', inviteError);
      }
    }

    return NextResponse.json({
      patient: updatedPatient,
      invitation: invitationResult?.success ? {
        sent: true,
        invitationId: invitationResult.invitationId,
      } : null,
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to update patient:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update patient" },
      { status: 500 }
    );
  }
}

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
    await logAuditEvent({
      userId: context.user.id,
      action: AuditAction.DELETE,
      entityType: "patient",
      entityId: id,
      centerId: context.profile.center_id,
      changes: { 
        patientName: `${patient.first_name} ${patient.last_name}`,
        medicalRecordNumber: patient.medical_record_number
      }
    });

    // Delete the patient (soft delete with cleanup)
    await deletePatient(id, context.user.id);

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

