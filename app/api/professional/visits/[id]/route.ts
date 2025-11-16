import { NextRequest, NextResponse } from "next/server";
import { requireProfessional, getUserContext } from "@/lib/rbac/middleware";
import { 
  getVisitById,
  updateVisit, 
  startVisit, 
  completeVisit, 
  cancelVisit,
  rescheduleVisit,
  getVisitCompletionStatus
} from "@/lib/services/visit.service";
import { logAuditEvent } from "@/lib/services/audit.service";
import { AuditAction } from "@/lib/types/enums";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireProfessional();
    const { id } = await params;

    const visit = await getVisitById(id);

    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 });
    }

    return NextResponse.json({ visit }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch visit:", error);
    return NextResponse.json(
      { error: "Failed to fetch visit" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireProfessional();
    const context = await getUserContext();

    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, scheduledDate, notes } = body;

    let visit;

    switch (action) {
      case "start":
        // Check if visit is in scheduled status
        const currentVisit = await getVisitById(id);
        if (!currentVisit) {
          return NextResponse.json({ error: "Visit not found" }, { status: 404 });
        }

        if (currentVisit.status !== "scheduled") {
          return NextResponse.json(
            { error: "Only scheduled visits can be started" },
            { status: 400 }
          );
        }

        visit = await startVisit(id, context.user.id);

        if (context.profile.center_id) {
          await logAuditEvent(
            context.user.id,
            AuditAction.UPDATE,
            "visit",
            id,
            context.profile.center_id,
            { action: "start_visit" }
          );
        }
        break;

      case "complete":
        // Validate that all required questionnaires are completed
        const completionStatus = await getVisitCompletionStatus(id);
        
        if (completionStatus.completedQuestionnaires < completionStatus.totalQuestionnaires) {
          return NextResponse.json(
            { 
              error: `Cannot complete visit. ${completionStatus.totalQuestionnaires - completionStatus.completedQuestionnaires} questionnaires remaining.`,
              completionStatus 
            },
            { status: 400 }
          );
        }

        visit = await completeVisit(id);

        if (context.profile.center_id) {
          await logAuditEvent(
            context.user.id,
            AuditAction.UPDATE,
            "visit",
            id,
            context.profile.center_id,
            { action: "complete_visit", completionPercentage: 100 }
          );
        }
        break;

      case "cancel":
        visit = await cancelVisit(id);

        if (context.profile.center_id) {
          await logAuditEvent(
            context.user.id,
            AuditAction.UPDATE,
            "visit",
            id,
            context.profile.center_id,
            { action: "cancel_visit" }
          );
        }
        break;

      case "reschedule":
        if (!scheduledDate) {
          return NextResponse.json(
            { error: "Scheduled date is required for rescheduling" },
            { status: 400 }
          );
        }

        visit = await rescheduleVisit(id, scheduledDate);

        if (context.profile.center_id) {
          await logAuditEvent(
            context.user.id,
            AuditAction.UPDATE,
            "visit",
            id,
            context.profile.center_id,
            { action: "reschedule_visit", newDate: scheduledDate }
          );
        }
        break;

      case "update_notes":
        visit = await updateVisit(id, { notes: notes || null });

        if (context.profile.center_id) {
          await logAuditEvent(
            context.user.id,
            AuditAction.UPDATE,
            "visit",
            id,
            context.profile.center_id,
            { action: "update_notes" }
          );
        }
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({ visit }, { status: 200 });
  } catch (error) {
    console.error("Failed to update visit:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update visit" },
      { status: 500 }
    );
  }
}

