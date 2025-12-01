import { NextRequest, NextResponse } from "next/server";
import { requireProfessional, getUserContext } from "@/lib/rbac/middleware";
import { createVisit, DuplicateVisitError } from "@/lib/services/visit.service";
import { VisitType, VisitStatus } from "@/lib/types/enums";
import { logVisitCreation } from "@/lib/services/audit.service";

export async function POST(request: NextRequest) {
  try {
    await requireProfessional();
    const context = await getUserContext();

    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { patientId, visitTemplateId, visitType, scheduledDate, notes } = body;

    // Create visit
    const visit = await createVisit({
      patient_id: patientId,
      visit_template_id: visitTemplateId,
      visit_type: visitType as VisitType,
      scheduled_date: scheduledDate,
      completed_date: null,
      status: VisitStatus.SCHEDULED,
      notes: notes || null,
      conducted_by: null,
      metadata: {},
      created_by: context.user.id,
    });

    // Log audit event
    if (context.profile.center_id) {
      await logVisitCreation(
        context.user.id,
        visit.id,
        context.profile.center_id,
        { patientId, visitType, scheduledDate }
      );
    }

    return NextResponse.json({ visit }, { status: 201 });
  } catch (error) {
    console.error("Failed to create visit:", error);
    
    // Handle duplicate visit error with 409 Conflict
    if (error instanceof DuplicateVisitError) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create visit" },
      { status: 500 }
    );
  }
}

