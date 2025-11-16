import { NextRequest, NextResponse } from "next/server";
import { requireManager, getUserContext } from "@/lib/rbac/middleware";
import { createUserInvitation } from "@/lib/services/user-provisioning.service";
import { UserRole } from "@/lib/types/enums";

export async function POST(request: NextRequest) {
  try {
    await requireManager();
    const context = await getUserContext();

    if (!context?.profile.center_id) {
      return NextResponse.json(
        { error: "No center assigned" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { email, firstName, lastName, phone } = body;

    const result = await createUserInvitation({
      email,
      role: UserRole.HEALTHCARE_PROFESSIONAL,
      centerId: context.profile.center_id,
      firstName,
      lastName,
      phone,
      invitedBy: context.user.id,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to create invitation" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        invitation: {
          id: result.invitationId,
          email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create invitation:", error);
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 }
    );
  }
}

