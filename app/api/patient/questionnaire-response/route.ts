import { NextRequest, NextResponse } from "next/server";
import { requirePatient, getUserContext } from "@/lib/rbac/middleware";
import {
  createResponse,
  updateResponse,
  completeResponse,
} from "@/lib/services/questionnaire.service";

export async function POST(request: NextRequest) {
  try {
    await requirePatient();
    const context = await getUserContext();

    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { visitId, questionnaireId, responses, completed } = body;

    // Get patient ID (for patients, user ID = patient ID or linked)
    const supabase = await (await import("@/lib/supabase/server")).createClient();
    const { data: patient } = await supabase
      .from("patients")
      .select("id")
      .eq("id", context.user.id)
      .single();

    const patientId = patient?.id || context.user.id;

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
    await requirePatient();
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

