import { NextRequest, NextResponse } from "next/server";
import { getUserContext } from "@/lib/rbac/middleware";
import {
  createResponse,
  updateResponse,
  completeResponse,
  getResponseByVisitAndQuestionnaire,
} from "@/lib/services/questionnaire.service";

export async function GET(request: NextRequest) {
  try {
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

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Failed to fetch response:", error);
    return NextResponse.json(
      { error: "Failed to fetch response" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await getUserContext();
    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { visitId, questionnaireId, patientId, responses, completed } = body;

    // Create new response
    const response = await createResponse({
      visit_id: visitId,
      questionnaire_id: questionnaireId,
      patient_id: patientId,
      responses,
      completed_by: completed ? context.user.id : null,
      started_at: new Date().toISOString(),
      completed_at: completed ? new Date().toISOString() : null,
      status: completed ? "completed" : "in_progress",
      metadata: {},
    });

    return NextResponse.json({ response }, { status: 201 });
  } catch (error) {
    console.error("Failed to create response:", error);
    return NextResponse.json(
      { error: "Failed to create response" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const context = await getUserContext();
    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { responseId, responses, completed } = body;

    let response;
    if (completed) {
      response = await completeResponse(responseId, context.user.id);
      // Also update responses
      response = await updateResponse(responseId, { responses });
    } else {
      response = await updateResponse(responseId, { responses });
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Failed to update response:", error);
    return NextResponse.json(
      { error: "Failed to update response" },
      { status: 500 }
    );
  }
}

