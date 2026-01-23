import { getUserContext } from "@/lib/rbac/middleware";
import { notFound, redirect } from "next/navigation";
import { 
  ASRM_DEFINITION, 
  QIDS_DEFINITION, 
  MDQ_DEFINITION,
  DIAGNOSTIC_DEFINITION,
  ORIENTATION_DEFINITION,
  // Initial Evaluation - TRAITS (to be migrated)
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
// Auto ETAT definitions (refactored)
import {
  EQ5D5L_DEFINITION,
  PRISE_M_DEFINITION,
  STAI_YA_DEFINITION,
  MARS_DEFINITION,
  MATHYS_DEFINITION,
  PSQI_DEFINITION,
  EPWORTH_DEFINITION
} from "@/lib/questionnaires/bipolar/initial/auto/etat";
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
  ISA_DEFINITION,
  ISA_FOLLOWUP_DEFINITION,
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
  WAIS3_MATRICES_DEFINITION,
  WAIS3_CODE_SYMBOLES_DEFINITION,
  WAIS3_DIGIT_SPAN_DEFINITION,
  WAIS3_CPT2_DEFINITION,
  WAIS3_MEM3_SPATIAL_DEFINITION
} from "@/lib/constants/questionnaires-hetero";
// WAIS-III Vocabulaire from new location
import { WAIS3_VOCABULAIRE_DEFINITION } from "@/lib/questionnaires/bipolar/initial/neuropsy/wais3-vocabulaire";
// C-SSRS from medical module
import { CSSRS_DEFINITION } from "@/lib/questionnaires/bipolar/initial/medical";
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
  ANTECEDENTS_FAMILIAUX_PSY_SZ_DEFINITION,
  SZ_PERINATALITE_DEFINITION,
  TEA_COFFEE_SZ_DEFINITION,
  EVAL_ADDICTOLOGIQUE_SZ_DEFINITION,
  TROUBLES_COMORBIDES_SZ_DEFINITION
} from "@/lib/questionnaires/schizophrenia";
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
  getIsaSuiviResponse,
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
  getBipolarInitialResponse,
  BIPOLAR_INITIAL_TABLES
} from "@/lib/services/bipolar-initial.service";
import {
  getTobaccoResponse,
  getFagerstromResponse,
  getPhysicalParamsResponse,
  getBloodPressureResponse,
  getSleepApneaResponse,
  getBiologicalAssessmentResponse,
  getEcgResponse
} from "@/lib/services/bipolar-nurse.service";
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
  getAntecedentsFamiliauxPsySzResponse,
  getPerinataliteSzResponse,
  getTeaCoffeeSzResponse,
  getEvalAddictologiqueSzResponse
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
import { normalizeResponseForQuestionnaireForm } from "@/lib/utils/questionnaire-prefill";

// Map questionnaire codes to BIPOLAR_INITIAL_TABLES keys
// Used to route data fetching to bipolar_* tables for bipolar initial evaluations
function questionnaireCodeToBipolarKey(code: string): string | null {
  const mapping: Record<string, string> = {
    // Nurse module
    'TOBACCO': 'TOBACCO',
    'FAGERSTROM': 'FAGERSTROM',
    'PHYSICAL_PARAMS': 'PHYSICAL_PARAMS',
    'BLOOD_PRESSURE': 'BLOOD_PRESSURE',
    'ECG': 'ECG',
    'SLEEP_APNEA': 'SLEEP_APNEA',
    'BIOLOGICAL_ASSESSMENT': 'BIOLOGICAL_ASSESSMENT',
    // Thymic module
    'MADRS': 'MADRS',
    'YMRS': 'YMRS',
    'CGI': 'CGI',
    'EGF': 'EGF',
    'ALDA': 'ALDA',
    'ETAT_PATIENT': 'ETAT_PATIENT',
    'FAST': 'FAST',
    // Auto ETAT module
    'EQ5D5L': 'EQ5D5L',
    'PRISE_M': 'PRISE_M',
    'STAI_YA': 'STAI_YA',
    'MARS': 'MARS',
    'MATHYS': 'MATHYS',
    'PSQI': 'PSQI',
    'EPWORTH': 'EPWORTH',
    // Auto TRAITS module
    'ASRS_FR': 'ASRS',
    'CTQ_FR': 'CTQ',
    'BIS10_FR': 'BIS10',
    'ALS18': 'ALS18',
    'AIM': 'AIM',
    'WURS25': 'WURS25',
    'AQ12': 'AQ12',
    'CSM': 'CSM',
    'CTI': 'CTI',
    // Social module
    'SOCIAL': 'SOCIAL',
    // Medical module - legacy codes with _FR suffix
    'DSM5_HUMEUR_FR': 'DSM5_HUMEUR',
    'DSM5_PSYCHOTIC_FR': 'DSM5_PSYCHOTIC',
    'DSM5_COMORBID_FR': 'DSM5_COMORBID',
    'DIVA_2': 'DIVA',
    'DIVA_2_FR': 'DIVA',
    'FAMILY_HISTORY_FR': 'FAMILY_HISTORY',
    'CSSRS_FR': 'CSSRS',
    'ISA_FR': 'ISA',
    'SIS_FR': 'SIS',
    'SUICIDE_HISTORY_FR': 'SUICIDE_HISTORY',
    'PERINATALITE_FR': 'PERINATALITE',
    'PATHO_NEURO_FR': 'PATHO_NEURO',
    'PATHO_CARDIO_FR': 'PATHO_CARDIO',
    'PATHO_ENDOC_FR': 'PATHO_ENDOC',
    'PATHO_DERMATO_FR': 'PATHO_DERMATO',
    'PATHO_URINAIRE_FR': 'PATHO_URINAIRE',
    'ANTECEDENTS_GYNECO_FR': 'ANTECEDENTS_GYNECO',
    'PATHO_HEPATO_GASTRO_FR': 'PATHO_HEPATO_GASTRO',
    'PATHO_ALLERGIQUE_FR': 'PATHO_ALLERGIQUE',
    'AUTRES_PATHO_FR': 'AUTRES_PATHO',
    // Medical module - new codes without _FR suffix
    'DSM5_HUMEUR': 'DSM5_HUMEUR',
    'DSM5_PSYCHOTIC': 'DSM5_PSYCHOTIC',
    'DSM5_COMORBID': 'DSM5_COMORBID',
    'DIVA': 'DIVA',
    'FAMILY_HISTORY': 'FAMILY_HISTORY',
    'CSSRS': 'CSSRS',
    'ISA': 'ISA',
    'SIS': 'SIS',
    'SUICIDE_HISTORY': 'SUICIDE_HISTORY',
    'PERINATALITE': 'PERINATALITE',
    'PATHO_NEURO': 'PATHO_NEURO',
    'PATHO_CARDIO': 'PATHO_CARDIO',
    'PATHO_ENDOC': 'PATHO_ENDOC',
    'PATHO_DERMATO': 'PATHO_DERMATO',
    'PATHO_URINAIRE': 'PATHO_URINAIRE',
    'ANTECEDENTS_GYNECO': 'ANTECEDENTS_GYNECO',
    'PATHO_HEPATO_GASTRO': 'PATHO_HEPATO_GASTRO',
    'PATHO_ALLERGIQUE': 'PATHO_ALLERGIQUE',
    'AUTRES_PATHO': 'AUTRES_PATHO',
    // Neuropsy module - legacy codes with _FR suffix
    'CVLT_FR': 'CVLT',
    'TMT_FR': 'TMT',
    'STROOP_FR': 'STROOP',
    'FLUENCES_VERBALES_FR': 'FLUENCES_VERBALES',
    'MEM3_SPATIAL_FR': 'MEM3_SPATIAL',
    'WAIS4_CRITERIA_FR': 'WAIS4_CRITERIA',
    'WAIS4_LEARNING_FR': 'WAIS4_LEARNING',
    'WAIS4_MATRICES_FR': 'WAIS4_MATRICES',
    'WAIS4_CODE_FR': 'WAIS4_CODE',
    'WAIS4_DIGIT_SPAN_FR': 'WAIS4_DIGIT_SPAN',
    'WAIS4_SIMILITUDES_FR': 'WAIS4_SIMILITUDES',
    'WAIS3_CRITERIA_FR': 'WAIS3_CRITERIA',
    'WAIS3_LEARNING_FR': 'WAIS3_LEARNING',
    'WAIS3_VOCABULAIRE_FR': 'WAIS3_VOCABULAIRE',
    'WAIS3_MATRICES_FR': 'WAIS3_MATRICES',
    'WAIS3_CODE_SYMBOLES_FR': 'WAIS3_CODE_SYMBOLES',
    'WAIS3_DIGIT_SPAN_FR': 'WAIS3_DIGIT_SPAN',
    'WAIS3_CPT2_FR': 'WAIS3_CPT2',
    'COBRA_FR': 'COBRA',
    'CPT3_FR': 'CPT3',
    'SCIP_FR': 'SCIP',
    'TEST_COMMISSIONS_FR': 'TEST_COMMISSIONS',
    // Neuropsy module - new codes without _FR suffix
    'CVLT': 'CVLT',
    'TMT': 'TMT',
    'STROOP': 'STROOP',
    'FLUENCES_VERBALES': 'FLUENCES_VERBALES',
    'MEM3_SPATIAL': 'MEM3_SPATIAL',
    'WAIS4_CRITERIA': 'WAIS4_CRITERIA',
    'WAIS4_LEARNING': 'WAIS4_LEARNING',
    'WAIS4_MATRICES': 'WAIS4_MATRICES',
    'WAIS4_CODE': 'WAIS4_CODE',
    'WAIS4_DIGIT_SPAN': 'WAIS4_DIGIT_SPAN',
    'WAIS4_SIMILITUDES': 'WAIS4_SIMILITUDES',
    'WAIS3_CRITERIA': 'WAIS3_CRITERIA',
    'WAIS3_LEARNING': 'WAIS3_LEARNING',
    'WAIS3_VOCABULAIRE': 'WAIS3_VOCABULAIRE',
    'WAIS3_MATRICES': 'WAIS3_MATRICES',
    'WAIS3_CODE_SYMBOLES': 'WAIS3_CODE_SYMBOLES',
    'WAIS3_DIGIT_SPAN': 'WAIS3_DIGIT_SPAN',
    'WAIS3_CPT2': 'WAIS3_CPT2',
    'COBRA': 'COBRA',
    'CPT3': 'CPT3',
    'SCIP': 'SCIP',
    'TEST_COMMISSIONS': 'TEST_COMMISSIONS',
  };
  return mapping[code] || null;
}

// Check if a questionnaire should fetch data from bipolar_* tables
function shouldUseBipolarTables(pathology: string, visitType: string | undefined, code: string): boolean {
  // Keep fetch/prefill routing aligned with save routing (see submitProfessionalQuestionnaireAction).
  // Bipolar evaluation visits use bipolar_* tables (initial, annual, and biannual follow-up).
  if (
    pathology !== 'bipolar' ||
    !visitType ||
    !['initial_evaluation', 'annual_evaluation', 'biannual_followup'].includes(visitType)
  ) {
    return false;
  }
  
  // Check if the questionnaire code maps to a bipolar table
  const bipolarKey = questionnaireCodeToBipolarKey(code);
  return bipolarKey !== null && BIPOLAR_INITIAL_TABLES[bipolarKey] !== undefined;
}

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
  else if (code === 'DIVA_2') questionnaire = DIVA_DEFINITION;
  else if (code === FAMILY_HISTORY_DEFINITION.code) questionnaire = FAMILY_HISTORY_DEFINITION;
  else if (code === CSSRS_DEFINITION.code) questionnaire = CSSRS_DEFINITION;
  else if (code === ISA_DEFINITION.code) questionnaire = ISA_DEFINITION;
  else if (code === ISA_FOLLOWUP_DEFINITION.code) questionnaire = ISA_FOLLOWUP_DEFINITION;
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
  else if (code === SZ_PERINATALITE_DEFINITION.code) questionnaire = SZ_PERINATALITE_DEFINITION;
  else if (code === TEA_COFFEE_SZ_DEFINITION.code) questionnaire = TEA_COFFEE_SZ_DEFINITION;
  else if (code === EVAL_ADDICTOLOGIQUE_SZ_DEFINITION.code) questionnaire = EVAL_ADDICTOLOGIQUE_SZ_DEFINITION;

  if (!questionnaire) {
    notFound();
  }

  // Fetch visit to determine visit type for data source routing
  const visit = await getVisitById(visitId);
  const useBipolarTables = shouldUseBipolarTables(pathology, visit?.visit_type, code);

  // Fetch existing response
  let existingResponse: any = null;
  
  // For bipolar initial evaluations, use bipolar_* tables
  if (useBipolarTables) {
    const bipolarKey = questionnaireCodeToBipolarKey(code);
    if (bipolarKey) {
      existingResponse = await getBipolarInitialResponse(bipolarKey, visitId);
    }
  }
  // Screening questionnaires (always use legacy tables - these are separate from initial eval)
  else if (code === ASRM_DEFINITION.code) existingResponse = await getAsrmResponse(visitId);
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
  else if (code === 'DIVA_2') existingResponse = await getDivaResponse(visitId);
  else if (code === FAMILY_HISTORY_DEFINITION.code) existingResponse = await getFamilyHistoryResponse(visitId);
  else if (code === CSSRS_DEFINITION.code) existingResponse = await getCssrsResponse(visitId);
  else if (code === ISA_DEFINITION.code) existingResponse = await getIsaResponse(visitId);
  else if (code === ISA_FOLLOWUP_DEFINITION.code) existingResponse = await getIsaSuiviResponse(visitId);
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
  else if (code === SZ_PERINATALITE_DEFINITION.code) existingResponse = await getPerinataliteSzResponse(visitId);
  else if (code === TEA_COFFEE_SZ_DEFINITION.code) existingResponse = await getTeaCoffeeSzResponse(visitId);
  else if (code === EVAL_ADDICTOLOGIQUE_SZ_DEFINITION.code) existingResponse = await getEvalAddictologiqueSzResponse(visitId);

  // Map DB response to initialResponses (key-value map)
  // For ASRM/QIDS/MDQ, keys match columns (q1, q2...).
  // For Diagnostic/Orientation, keys match columns.
  // So we can just pass the object, filtering out metadata.
  
  let initialResponses: Record<string, any> = {};
  if (existingResponse) {
    // Destructure to remove metadata if needed, but passing everything is usually fine as extra keys are ignored by Renderer if not in questions list.
    initialResponses = { ...existingResponse };
    initialResponses = normalizeResponseForQuestionnaireForm(questionnaire, initialResponses) as Record<string, any>;
  }
  
  // Convert boolean fields to 'yes'/'no' strings for SLEEP_APNEA questionnaire
  // Database stores booleans but questionnaire options expect string codes
  if (code === 'SLEEP_APNEA' && existingResponse) {
    const boolToYesNo = (val: any) => {
      if (val === true) return 'yes';
      if (val === false) return 'no';
      return val;
    };
    initialResponses.has_cpap_device = boolToYesNo(initialResponses.has_cpap_device);
    initialResponses.snoring = boolToYesNo(initialResponses.snoring);
    initialResponses.tiredness = boolToYesNo(initialResponses.tiredness);
    initialResponses.observed_apnea = boolToYesNo(initialResponses.observed_apnea);
    initialResponses.hypertension = boolToYesNo(initialResponses.hypertension);
    initialResponses.bmi_over_35 = boolToYesNo(initialResponses.bmi_over_35);
    initialResponses.age_over_50 = boolToYesNo(initialResponses.age_over_50);
    initialResponses.large_neck = boolToYesNo(initialResponses.large_neck);
  }

  // Convert boolean fields to 0/1 numbers for C-SSRS questionnaire
  // Database stores booleans but questionnaire options use numeric codes (0/1)
  if (code === 'CSSRS' && existingResponse) {
    const boolToNum = (val: any): number | null => {
      if (val === true) return 1;
      if (val === false) return 0;
      return val;
    };
    initialResponses.q1_wish_dead = boolToNum(initialResponses.q1_wish_dead);
    initialResponses.q2_non_specific = boolToNum(initialResponses.q2_non_specific);
    initialResponses.q3_method_no_intent = boolToNum(initialResponses.q3_method_no_intent);
    initialResponses.q4_intent_no_plan = boolToNum(initialResponses.q4_intent_no_plan);
    initialResponses.q5_plan_intent = boolToNum(initialResponses.q5_plan_intent);
  }

  // Convert boolean to number for WAIS Criteria acceptance field
  if ((code === 'WAIS3_CRITERIA' || code === 'WAIS4_CRITERIA') && existingResponse) {
    const boolToNum = (val: any): number | null => {
      if (val === true) return 1;
      if (val === false) return 0;
      return val;
    };
    initialResponses.accepted_for_neuropsy_evaluation = boolToNum(initialResponses.accepted_for_neuropsy_evaluation);
    console.log('[WAIS Debug] Converted accepted_for_neuropsy_evaluation from boolean to:', initialResponses.accepted_for_neuropsy_evaluation);
  }

  // Remove calculated score fields from WAIS4_SIMILITUDES initial responses
  // These are calculated automatically on save and should only be displayed on score page
  if (code === 'WAIS4_SIMILITUDES' && existingResponse) {
    delete initialResponses.total_raw_score;
    delete initialResponses.standard_score;
    delete initialResponses.standardized_value;
    delete initialResponses.raw_score; // Old column
    delete initialResponses.standardized_score; // Old column
    delete initialResponses.percentile_rank; // Old column
    console.log('[WAIS4 Similitudes Debug] Removed calculated score fields from form');
  }

  // Remove calculated score fields from WAIS4_MATRICES initial responses
  // These are calculated automatically on save and should only be displayed on score page
  if (code === 'WAIS4_MATRICES' && existingResponse) {
    delete initialResponses.raw_score;
    delete initialResponses.standardized_score;
    delete initialResponses.percentile_rank;
    console.log('[WAIS4 Matrices Debug] Removed calculated score fields from form');
  }

  // Remove calculated score fields from WAIS4_DIGIT_SPAN initial responses
  // These are calculated automatically on save and should only be displayed on score page
  if (code === 'WAIS4_DIGIT_SPAN' && existingResponse) {
    // Individual item scores (24 items: 8 per section)
    for (let i = 1; i <= 8; i++) {
      delete initialResponses[`wais_mcod_${i}`];
      delete initialResponses[`wais_mcoi_${i}`];
      delete initialResponses[`wais_mcoc_${i}`];
    }
    // Section totals
    delete initialResponses.wais_mcod_tot;
    delete initialResponses.wais_mcoi_tot;
    delete initialResponses.wais_mcoc_tot;
    delete initialResponses.mcod_total;
    delete initialResponses.mcoi_total;
    delete initialResponses.mcoc_total;
    // Empan values
    delete initialResponses.wais_mc_end;
    delete initialResponses.wais_mc_env;
    delete initialResponses.wais_mc_cro;
    delete initialResponses.empan_direct;
    delete initialResponses.empan_inverse;
    delete initialResponses.empan_croissant;
    // Empan Z-scores
    delete initialResponses.wais_mc_end_std;
    delete initialResponses.wais_mc_env_std;
    delete initialResponses.wais_mc_cro_std;
    // Empan difference
    delete initialResponses.wais_mc_emp;
    // Global scores
    delete initialResponses.wais_mc_tot;
    delete initialResponses.wais_mc_std;
    delete initialResponses.wais_mc_cr;
    delete initialResponses.raw_score;
    delete initialResponses.standardized_score;
    console.log('[WAIS4 Digit Span Debug] Removed calculated score fields from form');
  }

  // Remove calculated score fields from CVLT initial responses
  // These are calculated automatically on save and should only be displayed on score page
  if (code === 'CVLT' && existingResponse) {
    delete initialResponses.trials_1_5_total;
    delete initialResponses.total_1_5;
    delete initialResponses.trial_1_std;
    delete initialResponses.trial_5_std;
    delete initialResponses.total_1_5_std;
    delete initialResponses.list_b_std;
    delete initialResponses.sdfr_std;
    delete initialResponses.sdcr_std;
    delete initialResponses.ldfr_std;
    delete initialResponses.ldcr_std;
    delete initialResponses.semantic_std;
    delete initialResponses.serial_std;
    delete initialResponses.persev_std;
    delete initialResponses.intru_std;
    delete initialResponses.recog_std;
    delete initialResponses.false_recog_std;
    delete initialResponses.discrim_std;
    delete initialResponses.primacy_std;
    delete initialResponses.recency_std;
    delete initialResponses.bias_std;
    console.log('[CVLT Debug] Removed calculated score fields from form');
  }

  // Remove calculated score fields from Fluences Verbales initial responses
  // These are calculated automatically on save and should only be displayed on score page
  if (code === 'FLUENCES_VERBALES' && existingResponse) {
    delete initialResponses.fv_p_tot_rupregle;
    delete initialResponses.fv_p_tot_correct_z;
    delete initialResponses.fv_p_tot_correct_pc;
    delete initialResponses.fv_anim_tot_rupregle;
    delete initialResponses.fv_anim_tot_correct_z;
    delete initialResponses.fv_anim_tot_correct_pc;
    console.log('[Fluences Verbales Debug] Removed calculated score fields from form');
  }

  // Inject patient demographics (age at visit date, gender) for questionnaires that require them
  const requiresDemographics = questionnaireRequiresDemographics(code);
  console.log('[Demographics Debug] Code:', code, '| Requires demographics:', requiresDemographics);
  
  if (requiresDemographics) {
    // Fetch patient data (visit already fetched above for data source routing)
    const patient = await getPatientById(patientId);

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
        if (code === 'WAIS3_DIGIT_SPAN') {
          // Convert years to category: 0: <2, 1: 2-11, 2: 12, 3: 13-14, 4: >=15
          let educationLevel = 0;
          if (patient.years_of_education >= 15) educationLevel = 4;
          else if (patient.years_of_education >= 13) educationLevel = 3;
          else if (patient.years_of_education === 12) educationLevel = 2;
          else if (patient.years_of_education >= 2) educationLevel = 1;
          
          initialResponses = { ...initialResponses, education_level: educationLevel };
          console.log('[Demographics Debug] Converted to education_level category:', educationLevel);
        }
      } else {
        // For WAIS Criteria, always inject years_of_education field (null if not set)
        if (code === 'WAIS3_CRITERIA' || code === 'WAIS4_CRITERIA') {
          initialResponses = { ...initialResponses, years_of_education: null };
          console.log('[Demographics Debug] Years of education not set in patient profile (will show as empty)');
        }
      }
    }
    
    console.log('[Demographics Debug] Final initialResponses keys:', Object.keys(initialResponses));
  }

  // For WAIS Criteria questionnaires, set default collection_date to today
  if (code === 'WAIS3_CRITERIA' || code === 'WAIS4_CRITERIA') {
    if (!initialResponses.collection_date) {
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      initialResponses = { ...initialResponses, collection_date: today };
      console.log('[Demographics Debug] Set default collection_date to today:', today);
    }
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

  // Filter out score sections from WAIS4_DIGIT_SPAN questionnaire
  // These sections should only appear on the score page, not in the input form
  let filteredQuestionnaire = questionnaire;
  if (code === 'WAIS4_DIGIT_SPAN') {
    const scoreSections = ['Totaux par section', 'Empans', 'Scores globaux'];
    filteredQuestionnaire = {
      ...questionnaire,
      questions: questionnaire.questions.filter(q => {
        // Keep questions that don't have a section or have a section not in the score sections list
        return !q.section || !scoreSections.includes(q.section);
      })
    };
    console.log('[WAIS4 Digit Span Debug] Filtered out score sections. Original questions:', questionnaire.questions.length, 'Filtered:', filteredQuestionnaire.questions.length);
  }

  // Filter out score fields from CVLT questionnaire
  // Score fields (readonly with indentLevel: 1) should only appear on the score page, not in the input form
  if (code === 'CVLT') {
    filteredQuestionnaire = {
      ...questionnaire,
      questions: questionnaire.questions.filter(q => {
        // Remove readonly fields with indentLevel (these are calculated scores)
        if (q.readonly && q.indentLevel === 1) {
          return false;
        }
        // Keep all other questions
        return true;
      })
    };
    console.log('[CVLT Debug] Filtered out score fields. Original questions:', questionnaire.questions.length, 'Filtered:', filteredQuestionnaire.questions.length);
  }

  // Filter out score fields from Fluences Verbales questionnaire
  // Readonly score fields should only appear on the score page, not in the input form
  if (code === 'FLUENCES_VERBALES') {
    const scoreFieldIds = [
      'fv_p_tot_rupregle',
      'fv_p_tot_correct_z',
      'fv_p_tot_correct_pc',
      'fv_anim_tot_rupregle',
      'fv_anim_tot_correct_z',
      'fv_anim_tot_correct_pc'
    ];
    filteredQuestionnaire = {
      ...questionnaire,
      questions: questionnaire.questions.filter(q => {
        // Remove readonly score fields
        if (q.readonly && scoreFieldIds.includes(q.id)) {
          return false;
        }
        // Keep all other questions
        return true;
      })
    };
    console.log('[Fluences Verbales Debug] Filtered out score fields. Original questions:', questionnaire.questions.length, 'Filtered:', filteredQuestionnaire.questions.length);
  }

  return (
    <QuestionnairePageClient
      questionnaire={filteredQuestionnaire}
      visitId={visitId}
      patientId={patientId}
      pathology={pathology}
      initialResponses={initialResponses}
      existingData={existingResponse}
    />
  );
}
