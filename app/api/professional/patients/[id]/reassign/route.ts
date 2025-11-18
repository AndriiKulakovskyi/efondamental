import { NextRequest, NextResponse } from "next/server";
import { requireProfessional, getUserContext } from "@/lib/rbac/middleware";
import { reassignPatient } from "@/lib/services/patient.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireProfessional();
    const context = await getUserContext();

    if (!context) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: patientId } = await params;
    const body = await request.json();
    const { assignedTo } = body;

    if (!assignedTo) {
      return NextResponse.json(
        { error: "assignedTo is required" },
        { status: 400 }
      );
    }

    const patient = await reassignPatient(
      patientId,
      assignedTo,
      context.user.id
    );

    return NextResponse.json({ patient }, { status: 200 });
  } catch (error) {
    console.error("Failed to reassign patient:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Failed to reassign patient";
    
    // Handle specific error cases
    if (errorMessage.includes("Only the creator can reassign")) {
      return NextResponse.json(
        { error: "Only the creator of the patient record can reassign" },
        { status: 403 }
      );
    }
    
    if (errorMessage.includes("Patient not found")) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    if (errorMessage.includes("same center")) {
      return NextResponse.json(
        { error: "New assignee must be from the same center" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

