import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getUserContext } from "@/lib/rbac/middleware";
import { createUserInvitation } from "@/lib/services/user-provisioning.service";
import { UserRole } from "@/lib/types/enums";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const context = await getUserContext();

    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, firstName, lastName, phone, centerId } = body;

    const result = await createUserInvitation({
      email,
      role: UserRole.MANAGER,
      centerId,
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

