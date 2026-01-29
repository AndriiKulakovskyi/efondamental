'use server';

// Legacy imports removed - all bipolar questionnaires now use bipolar-*.service.ts
// The following functions have been migrated to new bipolar_* tables:
// - saveAsrmResponse -> saveBipolarAsrmResponse
// - saveQidsResponse -> saveBipolarQidsResponse
// - saveMdqResponse -> saveBipolarMdqResponse
// - saveDiagnosticResponse -> saveBipolarDiagnosticResponse
// - saveOrientationResponse -> saveBipolarOrientationResponse
// - TRAITS module (saveAsrsResponse, etc.) -> saveBipolarInitialResponse
import {
  // Bipolar screening - new service (public.bipolar_* tables)
  saveBipolarAsrmResponse,
  saveBipolarQidsResponse,
  saveBipolarMdqResponse,
  saveBipolarDiagnosticResponse,
  saveBipolarOrientationResponse
} from '@/lib/services/bipolar-screening.service';
import {
  // Bipolar initial evaluation - new service (public.bipolar_* tables)
  saveBipolarInitialResponse,
  BIPOLAR_INITIAL_TABLES
} from '@/lib/services/bipolar-initial.service';
import {
  type BipolarAsrmResponseInsert,
  type BipolarQidsResponseInsert,
  type BipolarMdqResponseInsert,
  type BipolarDiagnosticResponseInsert,
  type BipolarOrientationResponseInsert
} from '@/lib/questionnaires/bipolar/screening';
import {
  // Hetero questionnaires
  saveMadrsResponse,
  saveYmrsResponse,
  saveCgiResponse,
  saveEgfResponse,
  saveAldaResponse,
  saveEtatPatientResponse,
  saveFastResponse,
  saveDivaResponse,
  saveFamilyHistoryResponse,
  saveCssrsResponse,
  saveIsaResponse,
  saveIsaSuiviResponse,
  saveSisResponse,
  saveSuicideHistoryResponse,
  saveSuicideBehaviorFollowupResponse,
  savePerinataliteResponse,
  savePathoNeuroResponse,
  savePathoCardioResponse,
  savePathoEndocResponse,
  savePathoDermatoResponse,
  savePathoUrinaireResponse,
  saveAntecedentsGynecoResponse,
  savePathoHepatoGastroResponse,
  savePathoAllergiqueResponse,
  saveAutresPathoResponse,
  saveWais4CriteriaResponse,
  saveWais4LearningResponse,
  saveWais4MatricesResponse,
  saveCvltResponse,
  saveWais4CodeResponse,
  saveWais4DigitSpanResponse,
  saveTmtResponse,
  saveStroopResponse,
  saveFluencesVerbalesResponse,
  saveCobraResponse,
  saveCpt3Response,
  saveWais4SimilitudesResponse,
  saveTestCommissionsResponse,
  saveScipResponse,
  // WAIS-III questionnaires (note: CVLT, TMT, Stroop, Fluences use unified handlers)
  saveWais3TmtResponse,
  saveWais3StroopResponse,
  saveWais3FluencesVerbalesResponse,
  saveWais3CriteriaResponse,
  saveWais3LearningResponse,
  saveWais3VocabulaireResponse,
  saveWais3MatricesResponse,
  saveWais3CodeSymbolesResponse,
  saveWais3DigitSpanResponse,
  saveWais3Cpt2Response,
  // MEM-III Spatial (independent test)
  saveMem3SpatialResponse
} from '@/lib/services/questionnaire-hetero.service';
import {
  saveSocialResponse
} from '@/lib/services/questionnaire-social.service';
import {
  saveTobaccoResponse,
  saveFagerstromResponse,
  savePhysicalParamsResponse,
  saveBloodPressureResponse,
  saveSleepApneaResponse,
  saveBiologicalAssessmentResponse,
  saveEcgResponse
} from '@/lib/services/bipolar-nurse.service';
import {
  saveDsm5HumeurResponse,
  saveDsm5PsychoticResponse,
  saveDsm5ComorbidResponse,
  saveDiagPsySemHumeurActuelsResponse,
  saveDiagPsySemHumeurDepuisVisiteResponse,
  saveDiagPsySemPsychotiquesResponse
} from '@/lib/services/questionnaire-dsm5.service';
import {
  saveHumeurActuelsResponse,
  saveHumeurDepuisVisiteResponse,
  savePsychotiquesResponse,
  saveIsaFollowupResponse,
  saveSuicideBehaviorFollowupResponse as saveSuicideBehaviorFollowupResponseNew,
  saveSuiviRecommandationsResponse as saveSuiviRecommandationsResponseNew,
  saveRecoursAuxSoinsResponse as saveRecoursAuxSoinsResponseNew,
  saveTraitementNonPharmaResponse,
  saveArretsTravailResponse as saveArretsTravailResponseNew,
  saveSomatiqueContraceptifResponse as saveSomatiqueContraceptifResponseNew,
  saveStatutProfessionnelResponse as saveStatutProfessionnelResponseNew
} from '@/lib/services/bipolar-followup.service';
import {
  type BipolarFollowupHumeurActuelsResponseInsert,
  type BipolarFollowupHumeurDepuisVisiteResponseInsert,
  type BipolarFollowupPsychotiquesResponseInsert,
  type BipolarFollowupIsaResponseInsert,
  type BipolarFollowupSuicideBehaviorResponseInsert,
  type BipolarFollowupSuiviRecommandationsResponseInsert,
  type BipolarFollowupRecoursAuxSoinsResponseInsert,
  type BipolarFollowupTraitementNonPharmaResponseInsert,
  type BipolarFollowupArretsTravailResponseInsert,
  type BipolarFollowupSomatiqueContraceptifResponseInsert,
  type BipolarFollowupStatutProfessionnelResponseInsert
} from '@/lib/questionnaires/bipolar/followup';
import {
  type BipolarNurseTobaccoResponseInsert,
  type BipolarNurseFagerstromResponseInsert,
  type BipolarNursePhysicalParamsResponseInsert,
  type BipolarNurseBloodPressureResponseInsert,
  type BipolarNurseSleepApneaResponseInsert,
  type BipolarNurseBiologicalAssessmentResponseInsert,
  type BipolarNurseEcgResponseInsert
} from '@/lib/questionnaires/bipolar/nurse';
// Schizophrenia screening - new service (public.schizophrenia_* tables)
import {
  saveSchizophreniaScreeningDiagnosticResponse,
  saveSchizophreniaScreeningOrientationResponse
} from '@/lib/services/schizophrenia-screening.service';
// Schizophrenia initial evaluation - new service (public.schizophrenia_* tables)
import {
  saveSchizophreniaInitialResponse,
  SCHIZOPHRENIA_INITIAL_TABLES,
  // Specialized save functions with scoring logic
  savePanssResponse as saveSchizophreniaPanssResponse,
  saveCdssResponse as saveSchizophreniaCdssResponse,
  saveBarsResponse as saveSchizophreniaBarsResponse,
  saveSumdResponse as saveSchizophreniaSumdResponse,
  saveAimsResponse as saveSchizophreniaAimsResponse,
  saveBarnesResponse as saveSchizophreniaBarnesResponse,
  saveSasResponse as saveSchizophreniaSasResponse,
  savePspResponse as saveSchizophreniaPspResponse,
  saveDossierInfirmierSzResponse as saveSchizophreniaDossierInfirmierResponse,
  saveBilanBiologiqueSzResponse as saveSchizophreniaBilanBiologiqueResponse,
  saveEvalAddictologiqueSzResponse as saveSchizophreniaEvalAddictologiqueResponse,
  saveSqolResponse as saveSchizophreniaSqolResponse,
  saveCtqResponse as saveSchizophreniaCtqResponse,
  saveMarsResponse as saveSchizophreniaMarsResponse
} from '@/lib/services/schizophrenia-initial.service';
import { 
  getVisitCompletionStatus,
  completeVisit,
  getVisitById
} from '@/lib/services/visit.service';
import { getPatientById } from '@/lib/services/patient.service';

// Helper to check if a questionnaire should use bipolar_* tables
async function shouldUseBipolarTables(visitId: string, questionnaireCode: string): Promise<boolean> {
  // Check if the questionnaire code maps to a bipolar_* table
  const bipolarTableCode = questionnaireCodeToBipolarKey(questionnaireCode);
  if (!bipolarTableCode || !BIPOLAR_INITIAL_TABLES[bipolarTableCode]) {
    return false;
  }
  
  // Check if the visit is a bipolar evaluation that uses these tables
  // This includes initial_evaluation, annual_evaluation, and biannual_followup
  const visit = await getVisitById(visitId);
  if (!visit || !['initial_evaluation', 'annual_evaluation', 'biannual_followup'].includes(visit.visit_type)) {
    return false;
  }
  
  const patient = await getPatientById(visit.patient_id);
  return patient?.pathology_type === 'bipolar';
}

// Helper to check if a questionnaire should use schizophrenia_* tables
async function shouldUseSchizophreniaTables(visitId: string, questionnaireCode: string): Promise<boolean> {
  // Check if the questionnaire code maps to a schizophrenia_* table
  const schizophreniaTableCode = questionnaireCodeToSchizophreniaKey(questionnaireCode);
  if (!schizophreniaTableCode || !SCHIZOPHRENIA_INITIAL_TABLES[schizophreniaTableCode]) {
    return false;
  }
  
  // Check if the visit is a schizophrenia initial evaluation
  const visit = await getVisitById(visitId);
  if (!visit || visit.visit_type !== 'initial_evaluation') {
    return false;
  }
  
  const patient = await getPatientById(visit.patient_id);
  return patient?.pathology_type === 'schizophrenia';
}

// Map questionnaire codes to SCHIZOPHRENIA_INITIAL_TABLES keys
function questionnaireCodeToSchizophreniaKey(code: string): string | null {
  const mapping: Record<string, string> = {
    // Nurse module
    'INF_DOSSIER_INFIRMIER': 'DOSSIER_INFIRMIER_SZ',
    'INF_BILAN_BIOLOGIQUE_SZ': 'BILAN_BIOLOGIQUE_SZ',
    // Hetero-questionnaires
    'PANSS': 'PANSS',
    'CDSS': 'CDSS',
    'BARS': 'BARS',
    'SUMD': 'SUMD',
    'AIMS': 'AIMS',
    'BARNES': 'BARNES',
    'SAS': 'SAS',
    'PSP': 'PSP',
    // Medical evaluation
    'TROUBLES_PSYCHOTIQUES': 'TROUBLES_PSYCHOTIQUES',
    'TROUBLES_COMORBIDES_SZ': 'TROUBLES_COMORBIDES_SZ',
    'ISA_SZ': 'ISA_SZ',
    'SUICIDE_HISTORY_SZ': 'SUICIDE_HISTORY_SZ',
    'ANTECEDENTS_FAMILIAUX_PSY_SZ': 'ANTECEDENTS_FAMILIAUX_PSY_SZ',
    'PERINATALITE_SZ': 'PERINATALITE_SZ',
    'TEA_COFFEE_SZ': 'TEA_COFFEE_SZ',
    'EVAL_ADDICTOLOGIQUE_SZ': 'EVAL_ADDICTOLOGIQUE_SZ',
    'ECV': 'ECV',
  };
  return mapping[code] || null;
}

// Map questionnaire codes to BIPOLAR_INITIAL_TABLES keys
// All bipolar initial evaluation questionnaires now have individual column schemas
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
    'QIDS_SR16': 'QIDS_SR16',
    // Auto TRAITS module
    'ASRS': 'ASRS',
    'ASRS_FR': 'ASRS',
    'CTQ': 'CTQ',
    'CTQ_FR': 'CTQ',
    'BIS10': 'BIS10',
    'BIS10_FR': 'BIS10',
    'ALS18': 'ALS18',
    'AIM': 'AIM',
    'WURS25': 'WURS25',
    'AQ12': 'AQ12',
    'CSM': 'CSM',
    'CTI': 'CTI',
    // Social module
    'SOCIAL': 'SOCIAL',
    // Medical module
    'DSM5_HUMEUR': 'DSM5_HUMEUR',
    'DSM5_PSYCHOTIC': 'DSM5_PSYCHOTIC',
    'DSM5_COMORBID': 'DSM5_COMORBID',
    'DIVA': 'DIVA',
    // Legacy alias still used by some routes/definitions
    'DIVA_2': 'DIVA',
    'DIVA_2_FR': 'DIVA',
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
    // Neuropsy module - WAIS4
    'CVLT': 'CVLT',
    'TMT': 'TMT',
    'STROOP': 'STROOP',
    'FLUENCES_VERBALES': 'FLUENCES_VERBALES',
    'MEM3_SPATIAL': 'MEM3_SPATIAL',
    'MEM3_SPATIAL_FR': 'MEM3_SPATIAL',
    'WAIS4_CRITERIA': 'WAIS4_CRITERIA',
    'WAIS4_CRITERIA_FR': 'WAIS4_CRITERIA',
    'WAIS4_LEARNING': 'WAIS4_LEARNING',
    'WAIS4_LEARNING_FR': 'WAIS4_LEARNING',
    'WAIS4_MATRICES': 'WAIS4_MATRICES',
    'WAIS4_MATRICES_FR': 'WAIS4_MATRICES',
    'WAIS4_CODE': 'WAIS4_CODE',
    'WAIS4_CODE_FR': 'WAIS4_CODE',
    'WAIS_IV_CODE_SYMBOLES_IVT': 'WAIS4_CODE',
    'WAIS4_DIGIT_SPAN': 'WAIS4_DIGIT_SPAN',
    'WAIS4_DIGIT_SPAN_FR': 'WAIS4_DIGIT_SPAN',
    'WAIS4_SIMILITUDES': 'WAIS4_SIMILITUDES',
    'WAIS4_SIMILITUDES_FR': 'WAIS4_SIMILITUDES',
    'COBRA': 'COBRA',
    'CPT3': 'CPT3',
    'CPT3_FR': 'CPT3',
    'SCIP': 'SCIP',
    'TEST_COMMISSIONS': 'TEST_COMMISSIONS',
    // Neuropsy module - WAIS3
    'WAIS3_CRITERIA': 'WAIS3_CRITERIA',
    'WAIS3_CRITERIA_FR': 'WAIS3_CRITERIA',
    'WAIS3_LEARNING': 'WAIS3_LEARNING',
    'WAIS3_LEARNING_FR': 'WAIS3_LEARNING',
    'WAIS3_VOCABULAIRE': 'WAIS3_VOCABULAIRE',
    'WAIS3_VOCABULAIRE_FR': 'WAIS3_VOCABULAIRE',
    'WAIS3_MATRICES': 'WAIS3_MATRICES',
    'WAIS3_MATRICES_FR': 'WAIS3_MATRICES',
    'WAIS3_CODE_SYMBOLES': 'WAIS3_CODE_SYMBOLES',
    'WAIS3_CODE_SYMBOLES_FR': 'WAIS3_CODE_SYMBOLES',
    'WAIS3_DIGIT_SPAN': 'WAIS3_DIGIT_SPAN',
    'WAIS3_DIGIT_SPAN_FR': 'WAIS3_DIGIT_SPAN',
    'WAIS3_CPT2': 'WAIS3_CPT2',
    'WAIS3_CPT2_FR': 'WAIS3_CPT2',
    'WAIS3_CVLT_FR': 'CVLT',
    'WAIS3_TMT_FR': 'TMT',
    'WAIS3_STROOP_FR': 'STROOP',
    'WAIS3_FLUENCES_VERBALES_FR': 'FLUENCES_VERBALES',
    'WAIS3_MEM3_SPATIAL_FR': 'MEM3_SPATIAL',
  };
  return mapping[code] || null;
}
import { 
  // Legacy bipolar screening types (not used in actions anymore - using new module types)
  // AsrmResponseInsert, QidsResponseInsert, MdqResponseInsert, OrientationResponseInsert
  // Initial Evaluation - ETAT
  Eq5d5lResponseInsert,
  PriseMResponseInsert,
  StaiYaResponseInsert,
  MarsResponseInsert,
  MathysResponseInsert,
  PsqiResponseInsert,
  EpworthResponseInsert,
  // Initial Evaluation - TRAITS
  AsrsResponseInsert,
  CtqResponseInsert,
  Bis10ResponseInsert,
  Als18ResponseInsert,
  AimResponseInsert,
  Wurs25ResponseInsert,
  Aq12ResponseInsert,
  CsmResponseInsert,
  CtiResponseInsert,
  // Hetero questionnaires
  MadrsResponseInsert,
  YmrsResponseInsert,
  CgiResponseInsert,
  EgfResponseInsert,
  AldaResponseInsert,
  EtatPatientResponseInsert,
  FastResponseInsert,
  DivaResponseInsert,
  FamilyHistoryResponseInsert,
  CssrsResponseInsert,
  IsaResponseInsert,
  IsaSuiviResponseInsert,
  SisResponseInsert,
  SuicideHistoryResponseInsert,
  SuicideBehaviorFollowupResponseInsert,
  PerinataliteResponseInsert,
  PathoNeuroResponseInsert,
  PathoCardioResponseInsert,
  PathoEndocResponseInsert,
  PathoDermatoResponseInsert,
  PathoUrinaireResponseInsert,
  AntecedentsGynecoResponseInsert,
  PathoHepatoGastroResponseInsert,
  PathoAllergiqueResponseInsert,
  AutresPathoResponseInsert,
  SocialResponseInsert,
  Dsm5HumeurResponseInsert,
  Dsm5PsychoticResponseInsert,
  Dsm5ComorbidResponseInsert,
  DiagPsySemHumeurActuelsResponseInsert,
  DiagPsySemHumeurDepuisVisiteResponseInsert,
  DiagPsySemPsychotiquesResponseInsert,
  Wais4CriteriaResponseInsert,
  Wais4LearningResponseInsert,
  Wais4MatricesResponseInsert,
  CvltResponseInsert,
  Wais4CodeResponseInsert,
  Wais4DigitSpanResponseInsert,
  TmtResponseInsert,
  StroopResponseInsert,
  FluencesVerbalesResponseInsert,
  CobraResponseInsert,
  Cpt3ResponseInsert,
  Wais4SimilitudesResponseInsert,
  TestCommissionsResponseInsert,
  ScipResponseInsert,
  // WAIS-III types (note: CVLT, TMT, Stroop, Fluences use unified types)
  Wais3TmtResponseInsert,
  Wais3StroopResponseInsert,
  Wais3FluencesVerbalesResponseInsert,
  Wais3CriteriaResponseInsert,
  Wais3LearningResponseInsert,
  Wais3VocabulaireResponseInsert,
  Wais3MatricesResponseInsert,
  Wais3CodeSymbolesResponseInsert,
  Wais3DigitSpanResponseInsert,
  Wais3Cpt2ResponseInsert,
  // MEM-III Spatial (independent test)
  Mem3SpatialResponseInsert,
  // Schizophrenia types - now using new schizophrenia_* tables with inline types
  // Legacy types kept for reference but not used in new service functions
} from '@/lib/types/database.types';
import { revalidatePath } from 'next/cache';
import { requireUserContext } from '@/lib/rbac/middleware';

export async function submitProfessionalQuestionnaireAction(
  questionnaireCode: string,
  visitId: string,
  patientId: string,
  responses: Record<string, any>
) {
  try {
    // Get the current user to track who completed the questionnaire
    const context = await requireUserContext();
    const completedBy = context.user.id;
    
    // Check if this questionnaire should be routed to bipolar_* tables
    // (for bipolar initial evaluation visits)
    const useBipolarTables = await shouldUseBipolarTables(visitId, questionnaireCode);
    
    if (useBipolarTables) {
      const bipolarKey = questionnaireCodeToBipolarKey(questionnaireCode);
      if (bipolarKey) {
        // Filter out fields that are injected for form computation but may not be DB columns
        // - patient_gender: used for computing male_gender, clairance_creatinine (never a DB column)
        // - male_gender: only for SLEEP_APNEA
        // - patient_age: only for neuropsy scoring tables, not criteria tables (which use 'age')
        // - weight_kg: injected for creatinine clearance calculation, not a DB column
        // - years_of_education: only for specific neuropsy tables (re-added below for applicable questionnaires)
        const { patient_gender, male_gender, patient_age, weight_kg, years_of_education, ...filteredResponses } = responses;
        
        // Re-add male_gender only for SLEEP_APNEA questionnaire (convert to boolean)
        if (bipolarKey === 'SLEEP_APNEA' && male_gender !== undefined) {
          // Convert "Oui"/"Non" string to boolean for DB
          const isMale = male_gender === 'Oui' || male_gender === true || male_gender === 'true';
          (filteredResponses as any).male_gender = isMale;
        }
        
        // Neuropsy tables that have patient_age and years_of_education columns
        // Note: COBRA, SCIP, CPT3 do NOT have years_of_education in their tables
        // Note: WAIS3_CPT2 is a data entry form for externally computed results, no patient_age column
        const neuropsyTables = [
          'CVLT', 'FLUENCES_VERBALES', 'MEM3_SPATIAL', 'STROOP', 'TMT',
          'WAIS3_CODE_SYMBOLES', 'WAIS3_DIGIT_SPAN', 'WAIS3_LEARNING', 'WAIS3_MATRICES', 'WAIS3_VOCABULAIRE',
          'WAIS4_CODE', 'WAIS4_DIGIT_SPAN', 'WAIS4_LEARNING', 'WAIS4_MATRICES', 'WAIS4_SIMILITUDES'
        ];
        
        // WAIS Criteria tables have age and years_of_education columns
        const criteriaTables = ['WAIS3_CRITERIA', 'WAIS4_CRITERIA'];
        
        if (neuropsyTables.includes(bipolarKey)) {
          if (patient_age !== undefined) {
            (filteredResponses as any).patient_age = patient_age;
          }
          if (responses.years_of_education !== undefined) {
            (filteredResponses as any).years_of_education = responses.years_of_education;
          }
        }
        
        // For WAIS Criteria, keep age and years_of_education (not patient_age)
        if (criteriaTables.includes(bipolarKey)) {
          if (responses.years_of_education !== undefined) {
            (filteredResponses as any).years_of_education = responses.years_of_education;
          }
          // age is already in filteredResponses, no need to re-add
        }
        
        // Special handling for CVLT: remove calculated field that's not in DB
        if (bipolarKey === 'CVLT') {
          delete (filteredResponses as any).trials_1_5_total;
        }
        
        const result = await saveBipolarInitialResponse(bipolarKey, {
          visit_id: visitId,
          patient_id: patientId,
          completed_by: completedBy,
          ...filteredResponses
        });
        
        // Check if visit is now 100% complete and auto-complete it
        try {
          const visit = await getVisitById(visitId);
          const storedCompletion = visit?.completion_percentage ?? 0;
          const completionStatus = await getVisitCompletionStatus(visitId);
          
          if (storedCompletion === 100 || completionStatus.completionPercentage === 100) {
            if (visit?.status !== 'completed') {
              await completeVisit(visitId);
              console.log(`Visit ${visitId} automatically completed (100% questionnaires filled)`);
            }
          }
        } catch (error) {
          console.error('Failed to auto-complete visit:', error);
        }
        
        revalidatePath('/professional');
        return { success: true, data: result };
      }
    }
    
    let result;
    switch (questionnaireCode) {
      // Bipolar Screening Questionnaires - use new public.bipolar_* tables
      case 'ASRM':
        result = await saveBipolarAsrmResponse({
          visit_id: visitId,
          patient_id: patientId,
          completed_by: completedBy,
          ...responses as any
        } as BipolarAsrmResponseInsert);
        break;
        
      case 'QIDS_SR16':
      case 'QIDS_SR16_FR':
        result = await saveBipolarQidsResponse({
          visit_id: visitId,
          patient_id: patientId,
          completed_by: completedBy,
          ...responses as any
        } as BipolarQidsResponseInsert);
        break;
        
      case 'MDQ':
        result = await saveBipolarMdqResponse({
          visit_id: visitId,
          patient_id: patientId,
          completed_by: completedBy,
          ...responses as any
        } as BipolarMdqResponseInsert);
        break;

      case 'EBIP_SCR_DIAG':
        result = await saveBipolarDiagnosticResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarDiagnosticResponseInsert);
        break;

      case 'EBIP_SCR_ORIENT':
        result = await saveBipolarOrientationResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarOrientationResponseInsert);
        break;

      // Schizophrenia Screening Questionnaires - use new public.schizophrenia_* tables
      case 'SCREENING_DIAGNOSTIC_SZ':
        result = await saveSchizophreniaScreeningDiagnosticResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'SCREENING_ORIENTATION_SZ':
        result = await saveSchizophreniaScreeningOrientationResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      // Schizophrenia Initial Evaluation - Dossier Infirmier (use new schizophrenia_* tables)
      case 'INF_DOSSIER_INFIRMIER':
        result = await saveSchizophreniaDossierInfirmierResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      // Schizophrenia Initial Evaluation - Bilan Biologique (use new schizophrenia_* tables)
      case 'INF_BILAN_BIOLOGIQUE_SZ':
        result = await saveSchizophreniaBilanBiologiqueResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      // Schizophrenia Hetero-questionnaires (use new schizophrenia_* tables)
      case 'PANSS':
        result = await saveSchizophreniaPanssResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'CDSS':
        result = await saveSchizophreniaCdssResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'BARS':
        result = await saveSchizophreniaBarsResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'SUMD':
        result = await saveSchizophreniaSumdResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'AIMS':
        result = await saveSchizophreniaAimsResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'BARNES':
        result = await saveSchizophreniaBarnesResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'SAS':
        result = await saveSchizophreniaSasResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'PSP':
        result = await saveSchizophreniaPspResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'ECV':
        result = await saveSchizophreniaInitialResponse('ECV', {
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'TROUBLES_PSYCHOTIQUES':
        result = await saveSchizophreniaInitialResponse('TROUBLES_PSYCHOTIQUES', {
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'TROUBLES_COMORBIDES_SZ':
        result = await saveSchizophreniaInitialResponse('TROUBLES_COMORBIDES_SZ', {
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'SUICIDE_HISTORY_SZ':
        result = await saveSchizophreniaInitialResponse('SUICIDE_HISTORY_SZ', {
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'ANTECEDENTS_FAMILIAUX_PSY_SZ':
        result = await saveSchizophreniaInitialResponse('ANTECEDENTS_FAMILIAUX_PSY_SZ', {
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'PERINATALITE_SZ':
        result = await saveSchizophreniaInitialResponse('PERINATALITE_SZ', {
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'TEA_COFFEE_SZ':
        result = await saveSchizophreniaInitialResponse('TEA_COFFEE_SZ', {
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'EVAL_ADDICTOLOGIQUE_SZ':
        result = await saveSchizophreniaEvalAddictologiqueResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'BILAN_SOCIAL_SZ':
        // Convert numeric codes to boolean for justice_safeguard field
        const bilanSocialData = { ...responses as any };
        if (bilanSocialData.justice_safeguard !== undefined && bilanSocialData.justice_safeguard !== null) {
          bilanSocialData.justice_safeguard = bilanSocialData.justice_safeguard === 1;
        }
        result = await saveSchizophreniaInitialResponse('BILAN_SOCIAL_SZ', {
          visit_id: visitId,
          patient_id: patientId,
          ...bilanSocialData
        });
        break;

      // Schizophrenia Auto module (patient self-administered)
      case 'SQOL_SZ':
        result = await saveSchizophreniaSqolResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'CTQ':
        result = await saveSchizophreniaCtqResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'MARS_SZ':
        result = await saveSchizophreniaMarsResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      // Initial Evaluation - ETAT (using bipolar-initial.service.ts)
      case 'EQ5D5L':
        result = await saveBipolarInitialResponse('EQ5D5L', {
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'PRISE_M':
        result = await saveBipolarInitialResponse('PRISE_M', {
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'STAI_YA':
        result = await saveBipolarInitialResponse('STAI_YA', {
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'MARS':
        result = await saveBipolarInitialResponse('MARS', {
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'MATHYS':
        result = await saveBipolarInitialResponse('MATHYS', {
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'PSQI':
        result = await saveBipolarInitialResponse('PSQI', {
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      case 'EPWORTH':
        result = await saveBipolarInitialResponse('EPWORTH', {
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        });
        break;

      // Initial Evaluation - TRAITS: These questionnaires are now handled by 
      // shouldUseBipolarTables routing for bipolar patients. The old responses_* 
      // tables have been dropped and data migrated to bipolar_* tables.
      // If these codes reach here, it means the routing failed - throw an error.
      // Note: 'CTQ' is handled above for schizophrenia patients (case 'CTQ' -> schizophrenia_ctq)
      case 'ASRS':
      case 'BIS10_FR':
      case 'ALS18':
      case 'AIM':
      case 'WURS25':
      case 'AQ12':
      case 'CSM':
      case 'CTI':
        throw new Error(`Questionnaire ${questionnaireCode} should be routed through shouldUseBipolarTables. Tables have been migrated to bipolar_* schema.`);

      // Hetero questionnaires - BIPOLAR: These are now handled by shouldUseBipolarTables 
      // routing for bipolar patients. The old responses_* tables have been dropped.
      case 'MADRS':
      case 'YMRS':
      case 'CGI':
      case 'EGF':
      case 'ALDA':
      case 'ETAT_PATIENT':
      case 'FAST':
      case 'DIVA_2_FR':
      case 'FAMILY_HISTORY':
      case 'CSSRS':
      case 'ISA':
        throw new Error(`Questionnaire ${questionnaireCode} should be routed through shouldUseBipolarTables. Tables have been migrated to bipolar_* schema.`);
        
      case 'ISA_FOLLOWUP':
      case 'ISA_FOLLOWUP_FR':
        result = await saveIsaFollowupResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarFollowupIsaResponseInsert);
        break;

      case 'SIS':
      case 'SUICIDE_HISTORY':
        throw new Error(`Questionnaire ${questionnaireCode} should be routed through shouldUseBipolarTables. Tables have been migrated to bipolar_* schema.`);

      case 'SUICIDE_BEHAVIOR_FOLLOWUP':
      case 'SUICIDE_BEHAVIOR_FOLLOWUP_FR':
        result = await saveSuicideBehaviorFollowupResponseNew({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarFollowupSuicideBehaviorResponseInsert);
        break;

      case 'PERINATALITE':
      case 'PATHO_NEURO':
      case 'PATHO_CARDIO':
      case 'PATHO_ENDOC':
      case 'PATHO_DERMATO':
      case 'PATHO_URINAIRE':
      case 'ANTECEDENTS_GYNECO':
      case 'PATHO_HEPATO_GASTRO':
      case 'PATHO_ALLERGIQUE':
        throw new Error(`Questionnaire ${questionnaireCode} should be routed through shouldUseBipolarTables. Tables have been migrated to bipolar_* schema.`);

      case 'AUTRES_PATHO':
      case 'SOCIAL':
        throw new Error(`Questionnaire ${questionnaireCode} should be routed through shouldUseBipolarTables. Tables have been migrated to bipolar_* schema.`);

      case 'TOBACCO':
        console.log('[submitProfessionalQuestionnaireAction] TOBACCO - responses:', JSON.stringify(responses, null, 2));
        console.log('[submitProfessionalQuestionnaireAction] TOBACCO - visitId:', visitId, 'patientId:', patientId, 'completedBy:', completedBy);
        // Don't pass completed_by if it might be invalid - let it default to NULL
        result = await saveTobaccoResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarNurseTobaccoResponseInsert);
        console.log('[submitProfessionalQuestionnaireAction] TOBACCO - result:', result);
        break;

      case 'FAGERSTROM':
        result = await saveFagerstromResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarNurseFagerstromResponseInsert);
        break;

      case 'PHYSICAL_PARAMS':
        result = await savePhysicalParamsResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarNursePhysicalParamsResponseInsert);
        break;

      case 'BLOOD_PRESSURE':
        result = await saveBloodPressureResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarNurseBloodPressureResponseInsert);
        break;

      case 'SLEEP_APNEA':
        result = await saveSleepApneaResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarNurseSleepApneaResponseInsert);
        break;
        
      case 'BIOLOGICAL_ASSESSMENT':
        result = await saveBiologicalAssessmentResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarNurseBiologicalAssessmentResponseInsert);
        break;

      case 'ECG':
        result = await saveEcgResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarNurseEcgResponseInsert);
        break;

      case 'DSM5_HUMEUR_FR':
        result = await saveDsm5HumeurResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Dsm5HumeurResponseInsert);
        break;

      case 'DSM5_PSYCHOTIC_FR':
        result = await saveDsm5PsychoticResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Dsm5PsychoticResponseInsert);
        break;

      case 'DSM5_COMORBID_FR':
        result = await saveDsm5ComorbidResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Dsm5ComorbidResponseInsert);
        break;

      case 'HUMEUR_ACTUELS':
      case 'DIAG_PSY_SEM_HUMEUR_ACTUELS':
        result = await saveHumeurActuelsResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarFollowupHumeurActuelsResponseInsert);
        break;

      case 'HUMEUR_DEPUIS_VISITE':
      case 'DIAG_PSY_SEM_HUMEUR_DEPUIS_VISITE':
        result = await saveHumeurDepuisVisiteResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarFollowupHumeurDepuisVisiteResponseInsert);
        break;

      case 'PSYCHOTIQUES':
      case 'DIAG_PSY_SEM_PSYCHOTIQUES':
        result = await savePsychotiquesResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarFollowupPsychotiquesResponseInsert);
        break;

      // NEUROPSY QUESTIONNAIRES - WAIS4, CVLT, TMT, etc. 
      // These are now handled by shouldUseBipolarTables routing for bipolar patients.
      // The old responses_* tables have been dropped and data migrated to bipolar_* tables.
      case 'WAIS4_CRITERIA_FR':
      case 'WAIS4_LEARNING_FR':
      case 'WAIS4_MATRICES_FR':
      case 'CVLT':
      case 'WAIS4_CODE_FR':
      case 'WAIS_IV_CODE_SYMBOLES_IVT':
      case 'WAIS4_DIGIT_SPAN_FR':
      case 'TMT':
      case 'STROOP':
      case 'FLUENCES_VERBALES':
      case 'COBRA':
      case 'CPT3_FR':
      case 'WAIS4_SIMILITUDES_FR':
      case 'TEST_COMMISSIONS':
      case 'SCIP':
        throw new Error(`Questionnaire ${questionnaireCode} should be routed through shouldUseBipolarTables. Tables have been migrated to bipolar_* schema.`);

      // WAIS-III and MEM3 Questionnaires
      // These are now handled by shouldUseBipolarTables routing for bipolar patients.
      // The old responses_* tables have been dropped and data migrated to bipolar_* tables.
      case 'WAIS3_CVLT_FR':
      case 'WAIS3_TMT_FR':
      case 'WAIS3_STROOP_FR':
      case 'WAIS3_FLUENCES_VERBALES_FR':
      case 'WAIS3_CRITERIA_FR':
      case 'WAIS3_LEARNING_FR':
      case 'WAIS3_VOCABULAIRE_FR':
      case 'WAIS3_MATRICES_FR':
      case 'WAIS3_CODE_SYMBOLES_FR':
      case 'WAIS3_DIGIT_SPAN_FR':
      case 'WAIS3_CPT2_FR':
      case 'WAIS3_MEM3_SPATIAL_FR':
      case 'MEM3_SPATIAL_FR':
        throw new Error(`Questionnaire ${questionnaireCode} should be routed through shouldUseBipolarTables. Tables have been migrated to bipolar_* schema.`);

      // Follow-up care module questionnaires (now separate tables)
      case 'SUIVI_RECOMMANDATIONS':
        result = await saveSuiviRecommandationsResponseNew({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarFollowupSuiviRecommandationsResponseInsert);
        break;

      case 'RECOURS_AUX_SOINS':
        result = await saveRecoursAuxSoinsResponseNew({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarFollowupRecoursAuxSoinsResponseInsert);
        break;

      case 'TRAITEMENT_NON_PHARMACOLOGIQUE':
        result = await saveTraitementNonPharmaResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarFollowupTraitementNonPharmaResponseInsert);
        break;

      case 'ARRETS_DE_TRAVAIL':
        result = await saveArretsTravailResponseNew({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarFollowupArretsTravailResponseInsert);
        break;

      case 'SOMATIQUE_ET_CONTRACEPTIF':
        result = await saveSomatiqueContraceptifResponseNew({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarFollowupSomatiqueContraceptifResponseInsert);
        break;

      case 'STATUT_PROFESSIONNEL':
        result = await saveStatutProfessionnelResponseNew({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarFollowupStatutProfessionnelResponseInsert);
        break;
        
      default:
        throw new Error(`Unknown questionnaire code: ${questionnaireCode}`);
    }
    
    // Check if visit is now 100% complete and auto-complete it
    // Use the stored completion_percentage from the database (calculated accurately by the visit detail page)
    // as a fallback, also check with getVisitCompletionStatus
    try {
      // First check the stored completion percentage (most accurate, set by visit detail page)
      const visit = await getVisitById(visitId);
      const storedCompletion = visit?.completion_percentage ?? 0;
      
      // Also check with the service function
      const completionStatus = await getVisitCompletionStatus(visitId);
      
      // Auto-complete if either the stored value or calculated value is 100%
      if (storedCompletion === 100 || completionStatus.completionPercentage === 100) {
        if (visit?.status !== 'completed') {
          await completeVisit(visitId);
          console.log(`Visit ${visitId} automatically completed (100% questionnaires filled)`);
        }
      }
    } catch (error) {
      // Log but don't fail the questionnaire submission if auto-complete fails
      console.error('Failed to auto-complete visit:', error);
    }
    
    // Revalidate to ensure the visit detail page shows updated completion status
    // Revalidate all pages under /professional to catch any dynamic routes
    revalidatePath('/professional', 'layout');
    return { success: true, data: result };
  } catch (error) {
    console.error('[submitProfessionalQuestionnaireAction] ERROR:', error);
    console.error('[submitProfessionalQuestionnaireAction] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('[submitProfessionalQuestionnaireAction] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return { success: false, error: 'Failed to submit questionnaire' };
  }
}
