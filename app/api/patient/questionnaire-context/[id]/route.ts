import { NextRequest, NextResponse } from "next/server";
import { requirePatient, getUserContext } from "@/lib/rbac/middleware";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePatient();
    const context = await getUserContext();
    const { id: questionnaireId } = await params;

    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    // Get patient record
    const { data: patient } = await supabase
      .from("patients")
      .select("id")
      .eq("id", context.user.id)
      .single();

    const patientId = patient?.id || context.user.id;

    // Find active visit for this patient that includes this questionnaire
    const { data: visits } = await supabase
      .from("visits")
      .select("id, visit_template_id")
      .eq("patient_id", patientId)
      .in("status", ["scheduled", "in_progress"])
      .order("scheduled_date", { ascending: true });

    if (!visits || visits.length === 0) {
      return NextResponse.json(
        { error: "No active visit found for this questionnaire" },
        { status: 404 }
      );
    }

    // Check which visit contains this questionnaire
    let visitId = null;
    for (const visit of visits) {
      const { data: modules } = await supabase
        .from("modules")
        .select("id")
        .eq("visit_template_id", visit.visit_template_id);

      if (!modules) continue;

      for (const module of modules) {
        const { data: questionnaire } = await supabase
          .from("questionnaires")
          .select("id")
          .eq("id", questionnaireId)
          .eq("module_id", module.id)
          .single();

        if (questionnaire) {
          visitId = visit.id;
          break;
        }
      }

      if (visitId) break;
    }

    if (!visitId) {
      return NextResponse.json(
        { error: "This questionnaire is not part of your current visits" },
        { status: 404 }
      );
    }

    // Check for existing response
    const { data: existingResponse } = await supabase
      .from("questionnaire_responses")
      .select("*")
      .eq("visit_id", visitId)
      .eq("questionnaire_id", questionnaireId)
      .eq("patient_id", patientId)
      .single();

    return NextResponse.json({
      visitId,
      patientId,
      existingResponse,
    });
  } catch (error) {
    console.error("Failed to get questionnaire context:", error);
    return NextResponse.json(
      { error: "Failed to load questionnaire context" },
      { status: 500 }
    );
  }
}

