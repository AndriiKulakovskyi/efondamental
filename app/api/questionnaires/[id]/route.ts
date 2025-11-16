import { NextRequest, NextResponse } from "next/server";
import { getQuestionnaireById } from "@/lib/services/questionnaire.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const questionnaire = await getQuestionnaireById(id);

    if (!questionnaire) {
      return NextResponse.json(
        { error: "Questionnaire not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ questionnaire });
  } catch (error) {
    console.error("Failed to fetch questionnaire:", error);
    return NextResponse.json(
      { error: "Failed to fetch questionnaire" },
      { status: 500 }
    );
  }
}

