import { NextRequest, NextResponse } from "next/server";
import { requireProfessional, getUserContext } from "@/lib/rbac/middleware";
import {
  createResponse,
  updateResponse,
  completeResponse,
  getResponseByVisitAndQuestionnaire,
} from "@/lib/services/questionnaire.service";
import { logAuditEvent } from "@/lib/services/audit.service";
import { AuditAction } from "@/lib/types/enums";

export async function GET(request: NextRequest) {
  try {
    await requireProfessional();
    
    const searchParams = request.nextUrl.searchParams;
    const visitId = searchParams.get("visitId");
    const questionnaireId = searchParams.get("questionnaireId");

    if (!visitId || !questionnaireId) {
      return NextResponse.json(
        { error: "visitId and questionnaireId are required" },
        { status: 400 }
      );
    }

    const response = await getResponseByVisitAndQuestionnaire(visitId, questionnaireId);

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch questionnaire response:", error);
    return NextResponse.json(
      { error: "Failed to fetch questionnaire response" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireProfessional();
    const context = await getUserContext();

    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { visitId, questionnaireId, patientId, responses, completed } = body;

    if (!visitId || !questionnaireId || !patientId) {
      return NextResponse.json(
        { error: "visitId, questionnaireId, and patientId are required" },
        { status: 400 }
      );
    }

    // Check if response already exists
    const existingResponse = await getResponseByVisitAndQuestionnaire(
      visitId,
      questionnaireId
    );

    if (existingResponse) {
      return NextResponse.json(
        { error: "Response already exists. Use PUT to update." },
        { status: 409 }
      );
    }

    // Create new response
    const response = await createResponse({
      visit_id: visitId,
      questionnaire_id: questionnaireId,
      patient_id: patientId,
      responses: responses || {},
      completed_by: completed ? context.user.id : null,
      started_at: new Date().toISOString(),
      completed_at: completed ? new Date().toISOString() : null,
      status: completed ? "completed" : "in_progress",
      metadata: {},
    });

    // Log audit event
    if (context.profile.center_id) {
      await logAuditEvent(
        context.user.id,
        AuditAction.CREATE,
        "questionnaire_response",
        response.id,
        context.profile.center_id,
        { 
          visitId, 
          questionnaireId, 
          patientId,
          completed 
        }
      );
    }

    return NextResponse.json({ response }, { status: 201 });
  } catch (error) {
    console.error("Failed to create questionnaire response:", error);
    return NextResponse.json(
      { error: "Failed to create questionnaire response" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireProfessional();
    const context = await getUserContext();

    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { responseId, visitId, questionnaireId, patientId, responses, completed } = body;

    // If responseId is provided, update existing response
    if (responseId) {
      const updates: any = {
        responses: responses || {},
      };

      if (completed) {
        updates.status = "completed";
        updates.completed_at = new Date().toISOString();
        updates.completed_by = context.user.id;
      }

      const response = await updateResponse(responseId, updates);

      // Log audit event
      if (context.profile.center_id) {
        await logAuditEvent(
          context.user.id,
          AuditAction.UPDATE,
          "questionnaire_response",
          responseId,
          context.profile.center_id,
          { completed }
        );
      }

      return NextResponse.json({ response }, { status: 200 });
    }

    // Otherwise, find response by visit and questionnaire, then update
    if (!visitId || !questionnaireId) {
      return NextResponse.json(
        { error: "Either responseId or both visitId and questionnaireId are required" },
        { status: 400 }
      );
    }

    const existingResponse = await getResponseByVisitAndQuestionnaire(
      visitId,
      questionnaireId
    );

    if (!existingResponse) {
      // Create new response instead
      const response = await createResponse({
        visit_id: visitId,
        questionnaire_id: questionnaireId,
        patient_id: patientId,
        responses: responses || {},
        completed_by: completed ? context.user.id : null,
        started_at: new Date().toISOString(),
        completed_at: completed ? new Date().toISOString() : null,
        status: completed ? "completed" : "in_progress",
        metadata: {},
      });

      if (context.profile.center_id) {
        await logAuditEvent(
          context.user.id,
          AuditAction.CREATE,
          "questionnaire_response",
          response.id,
          context.profile.center_id,
          { visitId, questionnaireId, patientId, completed }
        );
      }

      return NextResponse.json({ response }, { status: 201 });
    }

    // Update existing response
    const updates: any = {
      responses: responses || {},
    };

    if (completed && existingResponse.status !== "completed") {
      updates.status = "completed";
      updates.completed_at = new Date().toISOString();
      updates.completed_by = context.user.id;
    }

    const response = await updateResponse(existingResponse.id, updates);

    if (context.profile.center_id) {
      await logAuditEvent(
        context.user.id,
        AuditAction.UPDATE,
        "questionnaire_response",
        existingResponse.id,
        context.profile.center_id,
        { completed }
      );
    }

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error("Failed to update questionnaire response:", error);
    return NextResponse.json(
      { error: "Failed to update questionnaire response" },
      { status: 500 }
    );
  }
}

