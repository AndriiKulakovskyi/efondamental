import { NextRequest, NextResponse } from "next/server";
import { requireProfessional, getUserContext } from "@/lib/rbac/middleware";
import {
  createResponse,
  updateResponse,
  completeResponse,
  getResponseByVisitAndQuestionnaire,
  getQuestionnaireById,
} from "@/lib/services/questionnaire.service";
import { logAuditEvent } from "@/lib/services/audit.service";
import { AuditAction, QuestionnaireResponseStatus } from "@/lib/types/enums";
import { calculateScore } from "@/lib/utils/questionnaire-scoring";
import { ASRM } from "@/lib/questionnaires/auto/asrm";
import { QIDS_SR16 } from "@/lib/questionnaires/auto/qids-sr16";
import { MDQ } from "@/lib/questionnaires/auto/mdq";

// Calculate score if questionnaire has scoring
async function calculateQuestionnaireScore(questionnaireId: string, responses: Record<string, any>) {
  const questionnaire = await getQuestionnaireById(questionnaireId);
  
  if (!questionnaire || !questionnaire.code) {
    return null;
  }

  // Only calculate for auto-questionnaires with scoring
  const scorableQuestionnaires = ['ASRM_FR', 'QIDS_SR16_FR', 'MDQ_FR'];
  if (!scorableQuestionnaires.includes(questionnaire.code)) {
    return null;
  }

  try {
    let scoringRules;
    switch (questionnaire.code) {
      case 'ASRM_FR':
        scoringRules = ASRM.scoring_rules;
        break;
      case 'QIDS_SR16_FR':
        scoringRules = QIDS_SR16.scoring_rules;
        break;
      case 'MDQ_FR':
        scoringRules = MDQ.scoring_rules;
        break;
      default:
        return null;
    }

    if (!scoringRules) return null;

    const result = calculateScore(questionnaire.code, responses, scoringRules);
    
    return {
      ...result,
      calculated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error calculating score:', error);
    return null;
  }
}

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
    let metadata: any = {};
    
    // Calculate score if completing
    if (completed) {
      const scoreResult = await calculateQuestionnaireScore(questionnaireId, responses || {});
      if (scoreResult) {
        metadata = scoreResult;
      }
    }

    const response = await createResponse({
      visit_id: visitId,
      questionnaire_id: questionnaireId,
      patient_id: patientId,
      responses: responses || {},
      completed_by: completed ? context.user.id : null,
      started_at: new Date().toISOString(),
      completed_at: completed ? new Date().toISOString() : null,
      status: completed ? QuestionnaireResponseStatus.COMPLETED : QuestionnaireResponseStatus.IN_PROGRESS,
      metadata,
    });

    // Log audit event
    if (context.profile.center_id) {
      await logAuditEvent({
        userId: context.user.id,
        action: AuditAction.CREATE,
        entityType: "questionnaire_response",
        entityId: response.id,
        centerId: context.profile.center_id,
        changes: { 
          visitId, 
          questionnaireId, 
          patientId,
          completed 
        }
      });
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
        
        // Calculate score if completing
        const scoreResult = await calculateQuestionnaireScore(questionnaireId, responses || {});
        if (scoreResult) {
          updates.metadata = scoreResult;
        }
      }

      const response = await updateResponse(responseId, updates);

      // Log audit event
      if (context.profile.center_id) {
        await logAuditEvent({
          userId: context.user.id,
          action: AuditAction.UPDATE,
          entityType: "questionnaire_response",
          entityId: responseId,
          centerId: context.profile.center_id,
          changes: { completed }
        });
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
      let metadata: any = {};
      
      // Calculate score if completing
      if (completed) {
        const scoreResult = await calculateQuestionnaireScore(questionnaireId, responses || {});
        if (scoreResult) {
          metadata = scoreResult;
        }
      }

      const response = await createResponse({
        visit_id: visitId,
        questionnaire_id: questionnaireId,
        patient_id: patientId,
        responses: responses || {},
        completed_by: completed ? context.user.id : null,
        started_at: new Date().toISOString(),
        completed_at: completed ? new Date().toISOString() : null,
        status: completed ? QuestionnaireResponseStatus.COMPLETED : QuestionnaireResponseStatus.IN_PROGRESS,
        metadata,
      });

      if (context.profile.center_id) {
        await logAuditEvent({
          userId: context.user.id,
          action: AuditAction.CREATE,
          entityType: "questionnaire_response",
          entityId: response.id,
          centerId: context.profile.center_id,
          changes: { visitId, questionnaireId, patientId, completed }
        });
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
      
      // Calculate score if completing
      const scoreResult = await calculateQuestionnaireScore(questionnaireId, responses || {});
      if (scoreResult) {
        updates.metadata = scoreResult;
      }
    }

    const response = await updateResponse(existingResponse.id, updates);

    if (context.profile.center_id) {
      await logAuditEvent({
        userId: context.user.id,
        action: AuditAction.UPDATE,
        entityType: "questionnaire_response",
        entityId: existingResponse.id,
        centerId: context.profile.center_id,
        changes: { completed }
      });
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

