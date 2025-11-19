import { getUserContext } from "@/lib/rbac/middleware";
import { notFound, redirect } from "next/navigation";
import { 
  ASRM_DEFINITION, 
  QIDS_DEFINITION, 
  MDQ_DEFINITION,
  DIAGNOSTIC_DEFINITION,
  ORIENTATION_DEFINITION,
  QuestionnaireDefinition 
} from "@/lib/constants/questionnaires";
import { 
  getAsrmResponse, 
  getQidsResponse, 
  getMdqResponse,
  getDiagnosticResponse,
  getOrientationResponse
} from "@/lib/services/questionnaire.service";
import { QuestionnairePageClient } from "./page-client";

export default async function ProfessionalQuestionnairePage({
  params,
}: {
  params: { pathology: string; id: string; visitId: string; questionnaireId: string };
}) {
  const { pathology, id: patientId, visitId, questionnaireId: code } = await params;
  const context = await getUserContext();

  if (!context) {
    redirect("/auth/login");
  }

  // Find definition
  let questionnaire: QuestionnaireDefinition | undefined;
  if (code === ASRM_DEFINITION.code) questionnaire = ASRM_DEFINITION;
  else if (code === QIDS_DEFINITION.code) questionnaire = QIDS_DEFINITION;
  else if (code === MDQ_DEFINITION.code) questionnaire = MDQ_DEFINITION;
  else if (code === DIAGNOSTIC_DEFINITION.code) questionnaire = DIAGNOSTIC_DEFINITION;
  else if (code === ORIENTATION_DEFINITION.code) questionnaire = ORIENTATION_DEFINITION;

  if (!questionnaire) {
    notFound();
  }

  // Fetch existing response
  let existingResponse: any = null;
  
  if (code === ASRM_DEFINITION.code) existingResponse = await getAsrmResponse(visitId);
  else if (code === QIDS_DEFINITION.code) existingResponse = await getQidsResponse(visitId);
  else if (code === MDQ_DEFINITION.code) existingResponse = await getMdqResponse(visitId);
  else if (code === DIAGNOSTIC_DEFINITION.code) existingResponse = await getDiagnosticResponse(visitId);
  else if (code === ORIENTATION_DEFINITION.code) existingResponse = await getOrientationResponse(visitId);

  // Map DB response to initialResponses (key-value map)
  // For ASRM/QIDS/MDQ, keys match columns (q1, q2...).
  // For Diagnostic/Orientation, keys match columns.
  // So we can just pass the object, filtering out metadata.
  
  let initialResponses = {};
  if (existingResponse) {
    // Destructure to remove metadata if needed, but passing everything is usually fine as extra keys are ignored by Renderer if not in questions list.
    initialResponses = { ...existingResponse };
  }

  return (
    <QuestionnairePageClient
      questionnaire={questionnaire}
      visitId={visitId}
      patientId={patientId}
      pathology={pathology}
      initialResponses={initialResponses}
      existingData={existingResponse}
    />
  );
}
