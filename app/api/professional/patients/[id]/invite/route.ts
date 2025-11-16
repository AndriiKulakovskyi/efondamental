import { NextRequest, NextResponse } from "next/server";
import { requireProfessional, getUserContext } from "@/lib/rbac/middleware";
import { getPatientById } from "@/lib/services/patient.service";
import { invitePatient, resendInvitation } from "@/lib/services/user-provisioning.service";
import { createClient } from "@/lib/supabase/server";

export async function POST(
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
    const { resend } = body;

    // Get patient details
    const patient = await getPatientById(id);

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    // Verify patient belongs to professional's center
    if (patient.center_id !== context.profile.center_id) {
      return NextResponse.json(
        { error: "Unauthorized: Patient does not belong to your center" },
        { status: 403 }
      );
    }

    // Check if patient has email
    if (!patient.email) {
      return NextResponse.json(
        { error: "Patient does not have an email address" },
        { status: 400 }
      );
    }

    // If resending, find the existing invitation
    if (resend) {
      const supabase = await createClient();
      const { data: existingInvitation } = await supabase
        .from('user_invitations')
        .select('id')
        .eq('patient_id', id)
        .eq('status', 'pending')
        .single();

      if (existingInvitation) {
        const result = await resendInvitation(existingInvitation.id);
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error || "Failed to resend invitation" },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          message: "Invitation resent successfully",
          invitationId: result.invitationId,
        }, { status: 200 });
      }
    }

    // Send new invitation
    console.log(`[INVITE API] Sending invitation for patient ${id} to ${patient.email}`);
    
    const result = await invitePatient({
      patientId: id,
      email: patient.email,
      firstName: patient.first_name,
      lastName: patient.last_name,
      centerId: context.profile.center_id,
      invitedBy: context.user.id,
    });

    console.log('[INVITE API] Invitation result:', result);

    if (!result.success) {
      console.error('[INVITE API] Failed to send invitation:', result.error);
      return NextResponse.json(
        { error: result.error || "Failed to send invitation" },
        { status: 400 }
      );
    }

    console.log('[INVITE API] Invitation sent successfully. ID:', result.invitationId);

    return NextResponse.json({
      success: true,
      message: "Invitation sent successfully",
      invitationId: result.invitationId,
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to send invitation:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send invitation" },
      { status: 500 }
    );
  }
}

