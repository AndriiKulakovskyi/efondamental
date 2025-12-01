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
    const { 
      first_name,
      last_name,
      date_of_birth,
      gender,
      email, 
      phone,
      address,
      emergency_contact,
      sendInvitation 
    } = body;

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

    // Build update object with only provided fields
    const updates: Record<string, any> = {};
    const changes: Record<string, any> = {};

    if (first_name !== undefined) {
      updates.first_name = first_name;
      if (patient.first_name !== first_name) {
        changes.first_name = { old: patient.first_name, new: first_name };
      }
    }
    if (last_name !== undefined) {
      updates.last_name = last_name;
      if (patient.last_name !== last_name) {
        changes.last_name = { old: patient.last_name, new: last_name };
      }
    }
    if (date_of_birth !== undefined) {
      updates.date_of_birth = date_of_birth;
      if (patient.date_of_birth !== date_of_birth) {
        changes.date_of_birth = { old: patient.date_of_birth, new: date_of_birth };
      }
    }
    if (gender !== undefined) {
      updates.gender = gender;
      if (patient.gender !== gender) {
        changes.gender = { old: patient.gender, new: gender };
      }
    }
    if (email !== undefined) {
      updates.email = email;
      if (patient.email !== email) {
        changes.email = { old: patient.email, new: email };
      }
    }
    if (phone !== undefined) {
      updates.phone = phone;
      if (patient.phone !== phone) {
        changes.phone = { old: patient.phone, new: phone };
      }
    }
    if (address !== undefined) {
      updates.address = address;
      if (patient.address !== address) {
        changes.address = { old: patient.address, new: address };
      }
    }
    if (emergency_contact !== undefined) {
      updates.emergency_contact = emergency_contact;
      changes.emergency_contact = { old: patient.emergency_contact, new: emergency_contact };
    }

    // Update patient with all provided fields
    const updatedPatient = await updatePatient(id, updates);

    // Log audit event only if there are changes
    if (Object.keys(changes).length > 0) {
      await logAuditEvent({
        userId: context.user.id,
        action: AuditAction.UPDATE,
        entityType: "patient",
        entityId: id,
        centerId: context.profile.center_id,
        changes
      });
    }

    // Send invitation if requested and email was updated
    let invitationResult = null;
    if (sendInvitation && email) {
      try {
        invitationResult = await invitePatient({
          patientId: id,
          email,
          firstName: updatedPatient.first_name,
          lastName: updatedPatient.last_name,
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

