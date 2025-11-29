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
  FAST_DEFINITION,
  DIVA_DEFINITION,
  FAMILY_HISTORY_DEFINITION,
  CSSRS_DEFINITION,
  ISA_DEFINITION,
  CSSRS_HISTORY_DEFINITION,
  SIS_DEFINITION,
  WAIS4_CRITERIA_DEFINITION,
  WAIS4_LEARNING_DEFINITION,
  WAIS4_MATRICES_DEFINITION,
  CVLT_DEFINITION,
  WAIS4_CODE_DEFINITION,
  WAIS4_DIGIT_SPAN_DEFINITION,
  TMT_DEFINITION,
  STROOP_DEFINITION,
  FLUENCES_VERBALES_DEFINITION,
  COBRA_DEFINITION,
  CPT3_DEFINITION,
  WAIS4_SIMILITUDES_DEFINITION,
  TEST_COMMISSIONS_DEFINITION,
  SCIP_DEFINITION,
  // WAIS-III definitions
  WAIS3_CVLT_DEFINITION,
  WAIS3_TMT_DEFINITION,
  WAIS3_STROOP_DEFINITION,
  WAIS3_FLUENCES_VERBALES_DEFINITION,
  WAIS3_CRITERIA_DEFINITION,
  WAIS3_LEARNING_DEFINITION,
  WAIS3_VOCABULAIRE_DEFINITION,
  WAIS3_MATRICES_DEFINITION,
  WAIS3_CODE_SYMBOLES_DEFINITION,
  WAIS3_DIGIT_SPAN_DEFINITION,
  WAIS3_CPT2_DEFINITION
} from "@/lib/constants/questionnaires-hetero";
import {
  SOCIAL_DEFINITION
} from "@/lib/constants/questionnaires-social";
import {
  TOBACCO_DEFINITION,
  FAGERSTROM_DEFINITION,
  PHYSICAL_PARAMS_DEFINITION,
  BLOOD_PRESSURE_DEFINITION,
  SLEEP_APNEA_DEFINITION,
  BIOLOGICAL_ASSESSMENT_DEFINITION,
  ECG_DEFINITION
} from "@/lib/constants/questionnaires-infirmier";
import {
  DSM5_HUMEUR_DEFINITION,
  DSM5_PSYCHOTIC_DEFINITION,
  DSM5_COMORBID_DEFINITION
} from "@/lib/constants/questionnaires-dsm5";
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
  getFastResponse,
  getDivaResponse,
  getFamilyHistoryResponse,
  getCssrsResponse,
  getIsaResponse,
  getCssrsHistoryResponse,
  getSisResponse,
  getWais4CriteriaResponse,
  getWais4LearningResponse,
  getWais4MatricesResponse,
  getCvltResponse,
  getWais4CodeResponse,
  getWais4DigitSpanResponse,
  getTmtResponse,
  getStroopResponse,
  getFluencesVerbalesResponse,
  getCobraResponse,
  getCpt3Response,
  getWais4SimilitudesResponse,
  getTestCommissionsResponse,
  getScipResponse,
  // WAIS-III service functions
  getWais3CvltResponse,
  getWais3TmtResponse,
  getWais3StroopResponse,
  getWais3FluencesVerbalesResponse,
  getWais3CriteriaResponse,
  getWais3LearningResponse,
  getWais3VocabulaireResponse,
  getWais3MatricesResponse,
  getWais3CodeSymbolesResponse,
  getWais3DigitSpanResponse,
  getWais3Cpt2Response
} from "@/lib/services/questionnaire-hetero.service";
import {
  getSocialResponse
} from "@/lib/services/questionnaire-social.service";
import {
  getTobaccoResponse,
  getFagerstromResponse,
  getPhysicalParamsResponse,
  getBloodPressureResponse,
  getSleepApneaResponse,
  getBiologicalAssessmentResponse,
  getEcgResponse
} from "@/lib/services/questionnaire-infirmier.service";
import {
  getDsm5HumeurResponse,
  getDsm5PsychoticResponse,
  getDsm5ComorbidResponse
} from "@/lib/services/questionnaire-dsm5.service";
import { getPatientById } from "@/lib/services/patient.service";
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
  else if (code === DIVA_DEFINITION.code) questionnaire = DIVA_DEFINITION;
  else if (code === FAMILY_HISTORY_DEFINITION.code) questionnaire = FAMILY_HISTORY_DEFINITION;
  else if (code === CSSRS_DEFINITION.code) questionnaire = CSSRS_DEFINITION;
  else if (code === ISA_DEFINITION.code) questionnaire = ISA_DEFINITION;
  else if (code === CSSRS_HISTORY_DEFINITION.code) questionnaire = CSSRS_HISTORY_DEFINITION;
  else if (code === SIS_DEFINITION.code) questionnaire = SIS_DEFINITION;
  else if (code === WAIS4_CRITERIA_DEFINITION.code) questionnaire = WAIS4_CRITERIA_DEFINITION;
  else if (code === WAIS4_LEARNING_DEFINITION.code) questionnaire = WAIS4_LEARNING_DEFINITION;
  else if (code === WAIS4_MATRICES_DEFINITION.code) questionnaire = WAIS4_MATRICES_DEFINITION;
  else if (code === CVLT_DEFINITION.code) questionnaire = CVLT_DEFINITION;
  else if (code === WAIS4_CODE_DEFINITION.code) questionnaire = WAIS4_CODE_DEFINITION;
  else if (code === WAIS4_DIGIT_SPAN_DEFINITION.code) questionnaire = WAIS4_DIGIT_SPAN_DEFINITION;
  else if (code === TMT_DEFINITION.code) questionnaire = TMT_DEFINITION;
  else if (code === STROOP_DEFINITION.code) questionnaire = STROOP_DEFINITION;
  else if (code === FLUENCES_VERBALES_DEFINITION.code) questionnaire = FLUENCES_VERBALES_DEFINITION;
  else if (code === COBRA_DEFINITION.code) questionnaire = COBRA_DEFINITION;
  else if (code === CPT3_DEFINITION.code) questionnaire = CPT3_DEFINITION;
  else if (code === WAIS4_SIMILITUDES_DEFINITION.code) questionnaire = WAIS4_SIMILITUDES_DEFINITION;
  else if (code === TEST_COMMISSIONS_DEFINITION.code) questionnaire = TEST_COMMISSIONS_DEFINITION;
  else if (code === SCIP_DEFINITION.code) questionnaire = SCIP_DEFINITION;
  // WAIS-III questionnaires
  else if (code === WAIS3_CVLT_DEFINITION.code) questionnaire = WAIS3_CVLT_DEFINITION;
  else if (code === WAIS3_TMT_DEFINITION.code) questionnaire = WAIS3_TMT_DEFINITION;
  else if (code === WAIS3_STROOP_DEFINITION.code) questionnaire = WAIS3_STROOP_DEFINITION;
  else if (code === WAIS3_FLUENCES_VERBALES_DEFINITION.code) questionnaire = WAIS3_FLUENCES_VERBALES_DEFINITION;
  else if (code === WAIS3_CRITERIA_DEFINITION.code) questionnaire = WAIS3_CRITERIA_DEFINITION;
  else if (code === WAIS3_LEARNING_DEFINITION.code) questionnaire = WAIS3_LEARNING_DEFINITION;
  else if (code === WAIS3_VOCABULAIRE_DEFINITION.code) questionnaire = WAIS3_VOCABULAIRE_DEFINITION;
  else if (code === WAIS3_MATRICES_DEFINITION.code) questionnaire = WAIS3_MATRICES_DEFINITION;
  else if (code === WAIS3_CODE_SYMBOLES_DEFINITION.code) questionnaire = WAIS3_CODE_SYMBOLES_DEFINITION;
  else if (code === WAIS3_DIGIT_SPAN_DEFINITION.code) questionnaire = WAIS3_DIGIT_SPAN_DEFINITION;
  else if (code === WAIS3_CPT2_DEFINITION.code) questionnaire = WAIS3_CPT2_DEFINITION;
  // Social questionnaire
  else if (code === SOCIAL_DEFINITION.code) questionnaire = SOCIAL_DEFINITION;
  // Infirmier questionnaires
  else if (code === TOBACCO_DEFINITION.code) questionnaire = TOBACCO_DEFINITION;
  else if (code === FAGERSTROM_DEFINITION.code) questionnaire = FAGERSTROM_DEFINITION;
  else if (code === PHYSICAL_PARAMS_DEFINITION.code) questionnaire = PHYSICAL_PARAMS_DEFINITION;
  else if (code === BLOOD_PRESSURE_DEFINITION.code) questionnaire = BLOOD_PRESSURE_DEFINITION;
  else if (code === SLEEP_APNEA_DEFINITION.code) questionnaire = SLEEP_APNEA_DEFINITION;
  else if (code === BIOLOGICAL_ASSESSMENT_DEFINITION.code) questionnaire = BIOLOGICAL_ASSESSMENT_DEFINITION;
  else if (code === ECG_DEFINITION.code) questionnaire = ECG_DEFINITION;
  // DSM5 questionnaires
  else if (code === DSM5_HUMEUR_DEFINITION.code) questionnaire = DSM5_HUMEUR_DEFINITION;
  else if (code === DSM5_PSYCHOTIC_DEFINITION.code) questionnaire = DSM5_PSYCHOTIC_DEFINITION;
  else if (code === DSM5_COMORBID_DEFINITION.code) questionnaire = DSM5_COMORBID_DEFINITION;

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
  else if (code === DIVA_DEFINITION.code) existingResponse = await getDivaResponse(visitId);
  else if (code === FAMILY_HISTORY_DEFINITION.code) existingResponse = await getFamilyHistoryResponse(visitId);
  else if (code === CSSRS_DEFINITION.code) existingResponse = await getCssrsResponse(visitId);
  else if (code === ISA_DEFINITION.code) existingResponse = await getIsaResponse(visitId);
  else if (code === CSSRS_HISTORY_DEFINITION.code) existingResponse = await getCssrsHistoryResponse(visitId);
  else if (code === SIS_DEFINITION.code) existingResponse = await getSisResponse(visitId);
  else if (code === WAIS4_CRITERIA_DEFINITION.code) existingResponse = await getWais4CriteriaResponse(visitId);
  else if (code === WAIS4_LEARNING_DEFINITION.code) existingResponse = await getWais4LearningResponse(visitId);
  else if (code === WAIS4_MATRICES_DEFINITION.code) existingResponse = await getWais4MatricesResponse(visitId);
  else if (code === CVLT_DEFINITION.code) existingResponse = await getCvltResponse(visitId);
  else if (code === WAIS4_CODE_DEFINITION.code) existingResponse = await getWais4CodeResponse(visitId);
  else if (code === WAIS4_DIGIT_SPAN_DEFINITION.code) existingResponse = await getWais4DigitSpanResponse(visitId);
  else if (code === TMT_DEFINITION.code) existingResponse = await getTmtResponse(visitId);
  else if (code === STROOP_DEFINITION.code) existingResponse = await getStroopResponse(visitId);
  else if (code === FLUENCES_VERBALES_DEFINITION.code) existingResponse = await getFluencesVerbalesResponse(visitId);
  else if (code === COBRA_DEFINITION.code) existingResponse = await getCobraResponse(visitId);
  else if (code === CPT3_DEFINITION.code) existingResponse = await getCpt3Response(visitId);
  else if (code === WAIS4_SIMILITUDES_DEFINITION.code) existingResponse = await getWais4SimilitudesResponse(visitId);
  else if (code === TEST_COMMISSIONS_DEFINITION.code) existingResponse = await getTestCommissionsResponse(visitId);
  else if (code === SCIP_DEFINITION.code) existingResponse = await getScipResponse(visitId);
  // WAIS-III questionnaires
  else if (code === WAIS3_CVLT_DEFINITION.code) existingResponse = await getWais3CvltResponse(visitId);
  else if (code === WAIS3_TMT_DEFINITION.code) existingResponse = await getWais3TmtResponse(visitId);
  else if (code === WAIS3_STROOP_DEFINITION.code) existingResponse = await getWais3StroopResponse(visitId);
  else if (code === WAIS3_FLUENCES_VERBALES_DEFINITION.code) existingResponse = await getWais3FluencesVerbalesResponse(visitId);
  else if (code === WAIS3_CRITERIA_DEFINITION.code) existingResponse = await getWais3CriteriaResponse(visitId);
  else if (code === WAIS3_LEARNING_DEFINITION.code) existingResponse = await getWais3LearningResponse(visitId);
  else if (code === WAIS3_VOCABULAIRE_DEFINITION.code) existingResponse = await getWais3VocabulaireResponse(visitId);
  else if (code === WAIS3_MATRICES_DEFINITION.code) existingResponse = await getWais3MatricesResponse(visitId);
  else if (code === WAIS3_CODE_SYMBOLES_DEFINITION.code) existingResponse = await getWais3CodeSymbolesResponse(visitId);
  else if (code === WAIS3_DIGIT_SPAN_DEFINITION.code) existingResponse = await getWais3DigitSpanResponse(visitId);
  else if (code === WAIS3_CPT2_DEFINITION.code) existingResponse = await getWais3Cpt2Response(visitId);
  // Social questionnaire
  else if (code === SOCIAL_DEFINITION.code) existingResponse = await getSocialResponse(visitId);
  // Infirmier questionnaires
  else if (code === TOBACCO_DEFINITION.code) existingResponse = await getTobaccoResponse(visitId);
  else if (code === FAGERSTROM_DEFINITION.code) existingResponse = await getFagerstromResponse(visitId);
  else if (code === PHYSICAL_PARAMS_DEFINITION.code) existingResponse = await getPhysicalParamsResponse(visitId);
  else if (code === BLOOD_PRESSURE_DEFINITION.code) existingResponse = await getBloodPressureResponse(visitId);
  else if (code === SLEEP_APNEA_DEFINITION.code) existingResponse = await getSleepApneaResponse(visitId);
  else if (code === BIOLOGICAL_ASSESSMENT_DEFINITION.code) existingResponse = await getBiologicalAssessmentResponse(visitId);
  else if (code === ECG_DEFINITION.code) existingResponse = await getEcgResponse(visitId);
  // DSM5 questionnaires
  else if (code === DSM5_HUMEUR_DEFINITION.code) existingResponse = await getDsm5HumeurResponse(visitId);
  else if (code === DSM5_PSYCHOTIC_DEFINITION.code) existingResponse = await getDsm5PsychoticResponse(visitId);
  else if (code === DSM5_COMORBID_DEFINITION.code) existingResponse = await getDsm5ComorbidResponse(visitId);

  // Map DB response to initialResponses (key-value map)
  // For ASRM/QIDS/MDQ, keys match columns (q1, q2...).
  // For Diagnostic/Orientation, keys match columns.
  // So we can just pass the object, filtering out metadata.
  
  let initialResponses = {};
  if (existingResponse) {
    // Destructure to remove metadata if needed, but passing everything is usually fine as extra keys are ignored by Renderer if not in questions list.
    initialResponses = { ...existingResponse };
  }

  // For biological assessment, fetch patient data and physical params for creatinine clearance computation
  if (code === BIOLOGICAL_ASSESSMENT_DEFINITION.code) {
    const [patient, physicalParams] = await Promise.all([
      getPatientById(patientId),
      getPhysicalParamsResponse(visitId)
    ]);

    if (patient) {
      // Calculate age from date_of_birth
      if (patient.date_of_birth) {
        const birthDate = new Date(patient.date_of_birth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const adjustedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
        initialResponses = { ...initialResponses, patient_age: adjustedAge };
      }
      
      if (patient.gender) {
        initialResponses = { ...initialResponses, patient_gender: patient.gender };
      }
    }

    if (physicalParams?.weight_kg) {
      initialResponses = { ...initialResponses, weight_kg: physicalParams.weight_kg };
    }
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
