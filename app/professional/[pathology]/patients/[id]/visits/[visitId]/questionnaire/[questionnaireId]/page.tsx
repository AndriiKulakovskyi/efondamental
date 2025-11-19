import { getUserContext } from "@/lib/rbac/middleware";
import { notFound, redirect } from "next/navigation";
import { 
  ASRM_DEFINITION, 
  QIDS_DEFINITION, 
  MDQ_DEFINITION,
  DIAGNOSTIC_DEFINITION,
  ORIENTATION_DEFINITION,
  // Initial Evaluation - ETAT
  EQ5D5L_DEFINITION,
  PRISE_M_DEFINITION,
  STAI_YA_DEFINITION,
  MARS_DEFINITION,
  MATHYS_DEFINITION,
  PSQI_DEFINITION,
  EPWORTH_DEFINITION,
  // Initial Evaluation - TRAITS
  ASRS_DEFINITION,
  CTQ_DEFINITION,
  BIS10_DEFINITION,
  ALS18_DEFINITION,
  AIM_DEFINITION,
  WURS25_DEFINITION,
  AQ12_DEFINITION,
  CSM_DEFINITION,
  CTI_DEFINITION,
  QuestionnaireDefinition 
} from "@/lib/constants/questionnaires";
import {
  // Hetero questionnaires
  MADRS_DEFINITION,
  YMRS_DEFINITION,
  CGI_DEFINITION,
  EGF_DEFINITION,
  ALDA_DEFINITION,
  ETAT_PATIENT_DEFINITION,
  FAST_DEFINITION
} from "@/lib/constants/questionnaires-hetero";
import { 
  getAsrmResponse, 
  getQidsResponse, 
  getMdqResponse,
  getDiagnosticResponse,
  getOrientationResponse,
  // Initial Evaluation - ETAT
  getEq5d5lResponse,
  getPriseMResponse,
  getStaiYaResponse,
  getMarsResponse,
  getMathysResponse,
  getPsqiResponse,
  getEpworthResponse,
  // Initial Evaluation - TRAITS
  getAsrsResponse,
  getCtqResponse,
  getBis10Response,
  getAls18Response,
  getAimResponse,
  getWurs25Response,
  getAq12Response,
  getCsmResponse,
  getCtiResponse
} from "@/lib/services/questionnaire.service";
import {
  // Hetero questionnaires
  getMadrsResponse,
  getYmrsResponse,
  getCgiResponse,
  getEgfResponse,
  getAldaResponse,
  getEtatPatientResponse,
  getFastResponse
} from "@/lib/services/questionnaire-hetero.service";
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
  // Screening questionnaires
  if (code === ASRM_DEFINITION.code) questionnaire = ASRM_DEFINITION;
  else if (code === QIDS_DEFINITION.code) questionnaire = QIDS_DEFINITION;
  else if (code === MDQ_DEFINITION.code) questionnaire = MDQ_DEFINITION;
  else if (code === DIAGNOSTIC_DEFINITION.code) questionnaire = DIAGNOSTIC_DEFINITION;
  else if (code === ORIENTATION_DEFINITION.code) questionnaire = ORIENTATION_DEFINITION;
  // Initial Evaluation - ETAT questionnaires
  else if (code === EQ5D5L_DEFINITION.code) questionnaire = EQ5D5L_DEFINITION;
  else if (code === PRISE_M_DEFINITION.code) questionnaire = PRISE_M_DEFINITION;
  else if (code === STAI_YA_DEFINITION.code) questionnaire = STAI_YA_DEFINITION;
  else if (code === MARS_DEFINITION.code) questionnaire = MARS_DEFINITION;
  else if (code === MATHYS_DEFINITION.code) questionnaire = MATHYS_DEFINITION;
  else if (code === PSQI_DEFINITION.code) questionnaire = PSQI_DEFINITION;
  else if (code === EPWORTH_DEFINITION.code) questionnaire = EPWORTH_DEFINITION;
  // Initial Evaluation - TRAITS questionnaires
  else if (code === ASRS_DEFINITION.code) questionnaire = ASRS_DEFINITION;
  else if (code === CTQ_DEFINITION.code) questionnaire = CTQ_DEFINITION;
  else if (code === BIS10_DEFINITION.code) questionnaire = BIS10_DEFINITION;
  else if (code === ALS18_DEFINITION.code) questionnaire = ALS18_DEFINITION;
  else if (code === AIM_DEFINITION.code) questionnaire = AIM_DEFINITION;
  else if (code === WURS25_DEFINITION.code) questionnaire = WURS25_DEFINITION;
  else if (code === AQ12_DEFINITION.code) questionnaire = AQ12_DEFINITION;
  else if (code === CSM_DEFINITION.code) questionnaire = CSM_DEFINITION;
  else if (code === CTI_DEFINITION.code) questionnaire = CTI_DEFINITION;
  // Hetero questionnaires
  else if (code === MADRS_DEFINITION.code) questionnaire = MADRS_DEFINITION;
  else if (code === YMRS_DEFINITION.code) questionnaire = YMRS_DEFINITION;
  else if (code === CGI_DEFINITION.code) questionnaire = CGI_DEFINITION;
  else if (code === EGF_DEFINITION.code) questionnaire = EGF_DEFINITION;
  else if (code === ALDA_DEFINITION.code) questionnaire = ALDA_DEFINITION;
  else if (code === ETAT_PATIENT_DEFINITION.code) questionnaire = ETAT_PATIENT_DEFINITION;
  else if (code === FAST_DEFINITION.code) questionnaire = FAST_DEFINITION;

  if (!questionnaire) {
    notFound();
  }

  // Fetch existing response
  let existingResponse: any = null;
  
  // Screening questionnaires
  if (code === ASRM_DEFINITION.code) existingResponse = await getAsrmResponse(visitId);
  else if (code === QIDS_DEFINITION.code) existingResponse = await getQidsResponse(visitId);
  else if (code === MDQ_DEFINITION.code) existingResponse = await getMdqResponse(visitId);
  else if (code === DIAGNOSTIC_DEFINITION.code) existingResponse = await getDiagnosticResponse(visitId);
  else if (code === ORIENTATION_DEFINITION.code) existingResponse = await getOrientationResponse(visitId);
  // Initial Evaluation - ETAT questionnaires
  else if (code === EQ5D5L_DEFINITION.code) existingResponse = await getEq5d5lResponse(visitId);
  else if (code === PRISE_M_DEFINITION.code) existingResponse = await getPriseMResponse(visitId);
  else if (code === STAI_YA_DEFINITION.code) existingResponse = await getStaiYaResponse(visitId);
  else if (code === MARS_DEFINITION.code) existingResponse = await getMarsResponse(visitId);
  else if (code === MATHYS_DEFINITION.code) existingResponse = await getMathysResponse(visitId);
  else if (code === PSQI_DEFINITION.code) existingResponse = await getPsqiResponse(visitId);
  else if (code === EPWORTH_DEFINITION.code) existingResponse = await getEpworthResponse(visitId);
  // Initial Evaluation - TRAITS questionnaires
  else if (code === ASRS_DEFINITION.code) existingResponse = await getAsrsResponse(visitId);
  else if (code === CTQ_DEFINITION.code) existingResponse = await getCtqResponse(visitId);
  else if (code === BIS10_DEFINITION.code) existingResponse = await getBis10Response(visitId);
  else if (code === ALS18_DEFINITION.code) existingResponse = await getAls18Response(visitId);
  else if (code === AIM_DEFINITION.code) existingResponse = await getAimResponse(visitId);
  else if (code === WURS25_DEFINITION.code) existingResponse = await getWurs25Response(visitId);
  else if (code === AQ12_DEFINITION.code) existingResponse = await getAq12Response(visitId);
  else if (code === CSM_DEFINITION.code) existingResponse = await getCsmResponse(visitId);
  else if (code === CTI_DEFINITION.code) existingResponse = await getCtiResponse(visitId);
  // Hetero questionnaires
  else if (code === MADRS_DEFINITION.code) existingResponse = await getMadrsResponse(visitId);
  else if (code === YMRS_DEFINITION.code) existingResponse = await getYmrsResponse(visitId);
  else if (code === CGI_DEFINITION.code) existingResponse = await getCgiResponse(visitId);
  else if (code === EGF_DEFINITION.code) existingResponse = await getEgfResponse(visitId);
  else if (code === ALDA_DEFINITION.code) existingResponse = await getAldaResponse(visitId);
  else if (code === ETAT_PATIENT_DEFINITION.code) existingResponse = await getEtatPatientResponse(visitId);
  else if (code === FAST_DEFINITION.code) existingResponse = await getFastResponse(visitId);

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
