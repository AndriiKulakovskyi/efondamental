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
  SIS_DEFINITION,
  SUICIDE_HISTORY_DEFINITION,
  SUICIDE_BEHAVIOR_FOLLOWUP_DEFINITION,
  PERINATALITE_DEFINITION,
  PATHO_NEURO_DEFINITION,
  PATHO_CARDIO_DEFINITION,
  PATHO_ENDOC_DEFINITION,
  PATHO_DERMATO_DEFINITION,
  PATHO_URINAIRE_DEFINITION,
  ANTECEDENTS_GYNECO_DEFINITION,
  PATHO_HEPATO_GASTRO_DEFINITION,
  PATHO_ALLERGIQUE_DEFINITION,
  AUTRES_PATHO_DEFINITION,
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
  WAIS3_CPT2_DEFINITION,
  WAIS3_MEM3_SPATIAL_DEFINITION
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
  DSM5_COMORBID_DEFINITION,
  DIAG_PSY_SEM_HUMEUR_ACTUELS_DEFINITION,
  DIAG_PSY_SEM_HUMEUR_DEPUIS_VISITE_DEFINITION,
  DIAG_PSY_SEM_PSYCHOTIQUES_DEFINITION
} from "@/lib/constants/questionnaires-dsm5";
import {
  SUIVI_RECOMMANDATIONS_DEFINITION,
  RECOURS_AUX_SOINS_DEFINITION,
  TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION,
  ARRETS_DE_TRAVAIL_DEFINITION,
  SOMATIQUE_CONTRACEPTIF_DEFINITION,
  STATUT_PROFESSIONNEL_DEFINITION
} from "@/lib/constants/questionnaires-followup";
import {
  SZ_DIAGNOSTIC_DEFINITION,
  SZ_ORIENTATION_DEFINITION,
  SZ_DOSSIER_INFIRMIER_DEFINITION,
  SZ_BILAN_BIOLOGIQUE_DEFINITION,
  PANSS_DEFINITION,
  CDSS_DEFINITION,
  BARS_DEFINITION,
  SUMD_DEFINITION,
  AIMS_DEFINITION,
  BARNES_DEFINITION,
  SAS_DEFINITION,
  PSP_DEFINITION,
  ECV_DEFINITION,
  TROUBLES_PSYCHOTIQUES_DEFINITION,
  SUICIDE_HISTORY_SZ_DEFINITION,
  ANTECEDENTS_FAMILIAUX_PSY_SZ_DEFINITION
} from "@/lib/constants/questionnaires-schizophrenia";
import { TROUBLES_COMORBIDES_SZ_DEFINITION } from "@/lib/constants/questionnaires-schizophrenia-comorbid";
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
  getSisResponse,
  getSuicideHistoryResponse,
  getSuicideBehaviorFollowupResponse,
  getPerinataliteResponse,
  getPathoNeuroResponse,
  getPathoCardioResponse,
  getPathoEndocResponse,
  getPathoDermatoResponse,
  getPathoUrinaireResponse,
  getAntecedentsGynecoResponse,
  getPathoHepatoGastroResponse,
  getPathoAllergiqueResponse,
  getAutresPathoResponse,
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
  getWais3Cpt2Response,
  getWais3Mem3SpatialResponse
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
  getDsm5ComorbidResponse,
  getDiagPsySemHumeurActuelsResponse,
  getDiagPsySemHumeurDepuisVisiteResponse,
  getDiagPsySemPsychotiquesResponse
} from "@/lib/services/questionnaire-dsm5.service";
import {
  getPsyTraitementSemestrielResponse
} from "@/lib/services/questionnaire-followup.service";
import {
  getScreeningSzDiagnosticResponse,
  getScreeningSzOrientationResponse,
  getDossierInfirmierSzResponse,
  getBilanBiologiqueSzResponse,
  getPanssResponse,
  getCdssResponse,
  getBarsResponse,
  getSumdResponse,
  getAimsResponse,
  getBarnesResponse,
  getSasResponse,
  getPspResponse,
  getEcvResponse,
  getTroublesPsychotiquesResponse,
  getTroublesComorbidesSzResponse,
  getSuicideHistorySzResponse,
  getAntecedentsFamiliauxPsySzResponse
} from "@/lib/services/questionnaire-schizophrenia.service";
import { getPatientById } from "@/lib/services/patient.service";
import { getVisitById } from "@/lib/services/visit.service";
import { QuestionnairePageClient } from "./page-client";
import {
  calculateAgeAtDate,
  normalizeGender,
  questionnaireRequiresDemographics,
  questionnaireUsesPatientSex,
  questionnaireUsesAgeField
} from "@/lib/utils/patient-demographics";

export default async function ProfessionalQuestionnairePage({
  params,
}: {
  params: Promise<{ pathology: string; id: string; visitId: string; questionnaireId: string }>;
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
  else if (code === SIS_DEFINITION.code) questionnaire = SIS_DEFINITION;
  else if (code === SUICIDE_HISTORY_DEFINITION.code) questionnaire = SUICIDE_HISTORY_DEFINITION;
  else if (code === SUICIDE_BEHAVIOR_FOLLOWUP_DEFINITION.code) questionnaire = SUICIDE_BEHAVIOR_FOLLOWUP_DEFINITION;
  else if (code === PERINATALITE_DEFINITION.code) questionnaire = PERINATALITE_DEFINITION;
  else if (code === PATHO_NEURO_DEFINITION.code) questionnaire = PATHO_NEURO_DEFINITION;
  else if (code === PATHO_CARDIO_DEFINITION.code) questionnaire = PATHO_CARDIO_DEFINITION;
  else if (code === PATHO_ENDOC_DEFINITION.code) questionnaire = PATHO_ENDOC_DEFINITION;
  else if (code === PATHO_DERMATO_DEFINITION.code) questionnaire = PATHO_DERMATO_DEFINITION;
  else if (code === PATHO_URINAIRE_DEFINITION.code) questionnaire = PATHO_URINAIRE_DEFINITION;
  else if (code === ANTECEDENTS_GYNECO_DEFINITION.code) questionnaire = ANTECEDENTS_GYNECO_DEFINITION;
  else if (code === PATHO_HEPATO_GASTRO_DEFINITION.code) questionnaire = PATHO_HEPATO_GASTRO_DEFINITION;
  else if (code === PATHO_ALLERGIQUE_DEFINITION.code) questionnaire = PATHO_ALLERGIQUE_DEFINITION;
  else if (code === AUTRES_PATHO_DEFINITION.code) questionnaire = AUTRES_PATHO_DEFINITION;
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
  else if (code === WAIS3_MEM3_SPATIAL_DEFINITION.code) questionnaire = WAIS3_MEM3_SPATIAL_DEFINITION;
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
  // Semi-annual follow-up DSM5 questionnaires
  else if (code === DIAG_PSY_SEM_HUMEUR_ACTUELS_DEFINITION.code) questionnaire = DIAG_PSY_SEM_HUMEUR_ACTUELS_DEFINITION;
  else if (code === DIAG_PSY_SEM_HUMEUR_DEPUIS_VISITE_DEFINITION.code) questionnaire = DIAG_PSY_SEM_HUMEUR_DEPUIS_VISITE_DEFINITION;
  else if (code === DIAG_PSY_SEM_PSYCHOTIQUES_DEFINITION.code) questionnaire = DIAG_PSY_SEM_PSYCHOTIQUES_DEFINITION;
  // Soin, suivi et arrêt de travail questionnaires
  else if (code === SUIVI_RECOMMANDATIONS_DEFINITION.code) questionnaire = SUIVI_RECOMMANDATIONS_DEFINITION;
  else if (code === RECOURS_AUX_SOINS_DEFINITION.code) questionnaire = RECOURS_AUX_SOINS_DEFINITION;
  else if (code === TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION.code) questionnaire = TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION;
  else if (code === ARRETS_DE_TRAVAIL_DEFINITION.code) questionnaire = ARRETS_DE_TRAVAIL_DEFINITION;
  else if (code === SOMATIQUE_CONTRACEPTIF_DEFINITION.code) questionnaire = SOMATIQUE_CONTRACEPTIF_DEFINITION;
  else if (code === STATUT_PROFESSIONNEL_DEFINITION.code) questionnaire = STATUT_PROFESSIONNEL_DEFINITION;
  // Schizophrenia screening questionnaires
  else if (code === SZ_DIAGNOSTIC_DEFINITION.code) questionnaire = SZ_DIAGNOSTIC_DEFINITION;
  else if (code === SZ_ORIENTATION_DEFINITION.code) questionnaire = SZ_ORIENTATION_DEFINITION;
  // Schizophrenia initial evaluation questionnaires
  else if (code === SZ_DOSSIER_INFIRMIER_DEFINITION.code) questionnaire = SZ_DOSSIER_INFIRMIER_DEFINITION;
  else if (code === SZ_BILAN_BIOLOGIQUE_DEFINITION.code) questionnaire = SZ_BILAN_BIOLOGIQUE_DEFINITION;
  // Schizophrenia hetero-questionnaires
  else if (code === PANSS_DEFINITION.code) questionnaire = PANSS_DEFINITION;
  else if (code === CDSS_DEFINITION.code) questionnaire = CDSS_DEFINITION;
  else if (code === BARS_DEFINITION.code) questionnaire = BARS_DEFINITION;
  else if (code === SUMD_DEFINITION.code) questionnaire = SUMD_DEFINITION;
  else if (code === AIMS_DEFINITION.code) questionnaire = AIMS_DEFINITION;
  else if (code === BARNES_DEFINITION.code) questionnaire = BARNES_DEFINITION;
  else if (code === SAS_DEFINITION.code) questionnaire = SAS_DEFINITION;
  else if (code === PSP_DEFINITION.code) questionnaire = PSP_DEFINITION;
  // Schizophrenia medical evaluation
  else if (code === ECV_DEFINITION.code) questionnaire = ECV_DEFINITION;
  else if (code === TROUBLES_PSYCHOTIQUES_DEFINITION.code) questionnaire = TROUBLES_PSYCHOTIQUES_DEFINITION;
  else if (code === TROUBLES_COMORBIDES_SZ_DEFINITION.code) questionnaire = TROUBLES_COMORBIDES_SZ_DEFINITION;
  else if (code === SUICIDE_HISTORY_SZ_DEFINITION.code) questionnaire = SUICIDE_HISTORY_SZ_DEFINITION;
  else if (code === ANTECEDENTS_FAMILIAUX_PSY_SZ_DEFINITION.code) questionnaire = ANTECEDENTS_FAMILIAUX_PSY_SZ_DEFINITION;

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
  else if (code === SIS_DEFINITION.code) existingResponse = await getSisResponse(visitId);
  else if (code === SUICIDE_HISTORY_DEFINITION.code) existingResponse = await getSuicideHistoryResponse(visitId);
  else if (code === SUICIDE_BEHAVIOR_FOLLOWUP_DEFINITION.code) existingResponse = await getSuicideBehaviorFollowupResponse(visitId);
  else if (code === PERINATALITE_DEFINITION.code) existingResponse = await getPerinataliteResponse(visitId);
  else if (code === PATHO_NEURO_DEFINITION.code) existingResponse = await getPathoNeuroResponse(visitId);
  else if (code === PATHO_CARDIO_DEFINITION.code) existingResponse = await getPathoCardioResponse(visitId);
  else if (code === PATHO_ENDOC_DEFINITION.code) existingResponse = await getPathoEndocResponse(visitId);
  else if (code === PATHO_DERMATO_DEFINITION.code) existingResponse = await getPathoDermatoResponse(visitId);
  else if (code === PATHO_URINAIRE_DEFINITION.code) existingResponse = await getPathoUrinaireResponse(visitId);
  else if (code === ANTECEDENTS_GYNECO_DEFINITION.code) existingResponse = await getAntecedentsGynecoResponse(visitId);
  else if (code === PATHO_HEPATO_GASTRO_DEFINITION.code) existingResponse = await getPathoHepatoGastroResponse(visitId);
  else if (code === PATHO_ALLERGIQUE_DEFINITION.code) existingResponse = await getPathoAllergiqueResponse(visitId);
  else if (code === AUTRES_PATHO_DEFINITION.code) existingResponse = await getAutresPathoResponse(visitId);
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
  else if (code === WAIS3_MEM3_SPATIAL_DEFINITION.code) existingResponse = await getWais3Mem3SpatialResponse(visitId);
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
  // Semi-annual follow-up DSM5 questionnaires
  else if (code === DIAG_PSY_SEM_HUMEUR_ACTUELS_DEFINITION.code) existingResponse = await getDiagPsySemHumeurActuelsResponse(visitId);
  else if (code === DIAG_PSY_SEM_HUMEUR_DEPUIS_VISITE_DEFINITION.code) existingResponse = await getDiagPsySemHumeurDepuisVisiteResponse(visitId);
  else if (code === DIAG_PSY_SEM_PSYCHOTIQUES_DEFINITION.code) existingResponse = await getDiagPsySemPsychotiquesResponse(visitId);
  // Soin, suivi et arrêt de travail questionnaires (all share the same response table)
  else if (code === SUIVI_RECOMMANDATIONS_DEFINITION.code) existingResponse = await getPsyTraitementSemestrielResponse(visitId);
  else if (code === RECOURS_AUX_SOINS_DEFINITION.code) existingResponse = await getPsyTraitementSemestrielResponse(visitId);
  else if (code === TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION.code) existingResponse = await getPsyTraitementSemestrielResponse(visitId);
  else if (code === ARRETS_DE_TRAVAIL_DEFINITION.code) existingResponse = await getPsyTraitementSemestrielResponse(visitId);
  else if (code === SOMATIQUE_CONTRACEPTIF_DEFINITION.code) existingResponse = await getPsyTraitementSemestrielResponse(visitId);
  else if (code === STATUT_PROFESSIONNEL_DEFINITION.code) existingResponse = await getPsyTraitementSemestrielResponse(visitId);
  // Schizophrenia screening questionnaires
  else if (code === SZ_DIAGNOSTIC_DEFINITION.code) existingResponse = await getScreeningSzDiagnosticResponse(visitId);
  else if (code === SZ_ORIENTATION_DEFINITION.code) existingResponse = await getScreeningSzOrientationResponse(visitId);
  // Schizophrenia initial evaluation questionnaires
  else if (code === SZ_DOSSIER_INFIRMIER_DEFINITION.code) existingResponse = await getDossierInfirmierSzResponse(visitId);
  else if (code === SZ_BILAN_BIOLOGIQUE_DEFINITION.code) existingResponse = await getBilanBiologiqueSzResponse(visitId);
  // Schizophrenia hetero-questionnaires
  else if (code === PANSS_DEFINITION.code) existingResponse = await getPanssResponse(visitId);
  else if (code === CDSS_DEFINITION.code) existingResponse = await getCdssResponse(visitId);
  else if (code === BARS_DEFINITION.code) existingResponse = await getBarsResponse(visitId);
  else if (code === SUMD_DEFINITION.code) existingResponse = await getSumdResponse(visitId);
  else if (code === AIMS_DEFINITION.code) existingResponse = await getAimsResponse(visitId);
  else if (code === BARNES_DEFINITION.code) existingResponse = await getBarnesResponse(visitId);
  else if (code === SAS_DEFINITION.code) existingResponse = await getSasResponse(visitId);
  else if (code === PSP_DEFINITION.code) existingResponse = await getPspResponse(visitId);
  // Schizophrenia medical evaluation
  else if (code === ECV_DEFINITION.code) existingResponse = await getEcvResponse(visitId);
  else if (code === TROUBLES_PSYCHOTIQUES_DEFINITION.code) existingResponse = await getTroublesPsychotiquesResponse(visitId);
  else if (code === TROUBLES_COMORBIDES_SZ_DEFINITION.code) existingResponse = await getTroublesComorbidesSzResponse(visitId);
  else if (code === SUICIDE_HISTORY_SZ_DEFINITION.code) existingResponse = await getSuicideHistorySzResponse(visitId);
  else if (code === ANTECEDENTS_FAMILIAUX_PSY_SZ_DEFINITION.code) existingResponse = await getAntecedentsFamiliauxPsySzResponse(visitId);

  // Map DB response to initialResponses (key-value map)
  // For ASRM/QIDS/MDQ, keys match columns (q1, q2...).
  // For Diagnostic/Orientation, keys match columns.
  // So we can just pass the object, filtering out metadata.
  
  let initialResponses: Record<string, any> = {};
  if (existingResponse) {
    // Destructure to remove metadata if needed, but passing everything is usually fine as extra keys are ignored by Renderer if not in questions list.
    initialResponses = { ...existingResponse };
  }

  // Inject patient demographics (age at visit date, gender) for questionnaires that require them
  const requiresDemographics = questionnaireRequiresDemographics(code);
  console.log('[Demographics Debug] Code:', code, '| Requires demographics:', requiresDemographics);
  
  if (requiresDemographics) {
    // Fetch patient and visit data to calculate age at visit date
    const [patient, visit] = await Promise.all([
      getPatientById(patientId),
      getVisitById(visitId)
    ]);

    console.log('[Demographics Debug] Patient:', patient ? { id: patient.id, dob: patient.date_of_birth, gender: patient.gender } : 'NOT FOUND');
    console.log('[Demographics Debug] Visit:', visit ? { id: visit.id, scheduled_date: visit.scheduled_date } : 'NOT FOUND');

    if (patient) {
      // Calculate age at visit date (use scheduled_date, fallback to current date)
      if (patient.date_of_birth) {
        const referenceDate = visit?.scheduled_date || new Date().toISOString();
        const calculatedAge = calculateAgeAtDate(patient.date_of_birth, referenceDate);
        console.log('[Demographics Debug] Calculated age:', calculatedAge, 'from DOB:', patient.date_of_birth, 'ref date:', referenceDate);
        
        // Most questionnaires use patient_age
        initialResponses = { ...initialResponses, patient_age: calculatedAge };
        
        // Some questionnaires (WAIS Criteria) use 'age' field instead
        if (questionnaireUsesAgeField(code)) {
          initialResponses = { ...initialResponses, age: calculatedAge };
          console.log('[Demographics Debug] Also injecting into "age" field for criteria questionnaire');
        }
      } else {
        console.log('[Demographics Debug] Patient has no date_of_birth!');
      }
      
      // Normalize and inject gender
      if (patient.gender) {
        const normalizedGender = normalizeGender(patient.gender);
        console.log('[Demographics Debug] Gender:', patient.gender, '-> normalized:', normalizedGender);
        initialResponses = { ...initialResponses, patient_gender: normalizedGender || patient.gender };
        
        // For questionnaires using patient_sex field (e.g., CVLT)
        if (questionnaireUsesPatientSex(code)) {
          initialResponses = { ...initialResponses, patient_sex: normalizedGender };
        }
      } else {
        console.log('[Demographics Debug] Patient has no gender!');
      }
      
      // Inject years_of_education if available
      if (patient.years_of_education !== null && patient.years_of_education !== undefined) {
        console.log('[Demographics Debug] Years of education:', patient.years_of_education);
        
        // Most questionnaires use years_of_education
        initialResponses = { ...initialResponses, years_of_education: patient.years_of_education };
        
        // WAIS3 Digit Span uses 'education_level' field (categorized)
        if (code === 'WAIS3_DIGIT_SPAN_FR') {
          // Convert years to category: 0: <2, 1: 2-11, 2: 12, 3: 13-14, 4: >=15
          let educationLevel = 0;
          if (patient.years_of_education >= 15) educationLevel = 4;
          else if (patient.years_of_education >= 13) educationLevel = 3;
          else if (patient.years_of_education === 12) educationLevel = 2;
          else if (patient.years_of_education >= 2) educationLevel = 1;
          
          initialResponses = { ...initialResponses, education_level: educationLevel };
          console.log('[Demographics Debug] Converted to education_level category:', educationLevel);
        }
      }
    }
    
    console.log('[Demographics Debug] Final initialResponses keys:', Object.keys(initialResponses));
  }

  // For biological assessment, also fetch physical params for creatinine clearance computation
  if (code === BIOLOGICAL_ASSESSMENT_DEFINITION.code) {
    const physicalParams = await getPhysicalParamsResponse(visitId);
    console.log('[Creatinine Debug] Physical params:', physicalParams);
    console.log('[Creatinine Debug] Weight:', physicalParams?.weight_kg);
    if (physicalParams?.weight_kg) {
      initialResponses = { ...initialResponses, weight_kg: physicalParams.weight_kg };
      console.log('[Creatinine Debug] Added weight_kg to initialResponses:', initialResponses.weight_kg);
    }
    console.log('[Creatinine Debug] Final initialResponses for bio assessment:', {
      patient_age: initialResponses.patient_age,
      patient_gender: initialResponses.patient_gender,
      weight_kg: initialResponses.weight_kg
    });
  }

  // For schizophrenia diagnostic questionnaire, pre-populate the physician name
  if (code === SZ_DIAGNOSTIC_DEFINITION.code && !initialResponses.screening_diag_nommed) {
    const patient = await getPatientById(patientId);
    if (patient && patient.assigned_to_first_name && patient.assigned_to_last_name) {
      initialResponses = { 
        ...initialResponses, 
        screening_diag_nommed: `Dr. ${patient.assigned_to_first_name} ${patient.assigned_to_last_name}` 
      };
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
