'use server';

import { 
  saveAsrmResponse, 
  saveQidsResponse, 
  saveMdqResponse,
  saveDiagnosticResponse,
  saveOrientationResponse,
  // Initial Evaluation - ETAT
  saveEq5d5lResponse,
  savePriseMResponse,
  saveStaiYaResponse,
  saveMarsResponse,
  saveMathysResponse,
  savePsqiResponse,
  saveEpworthResponse,
  // Initial Evaluation - TRAITS
  saveAsrsResponse,
  saveCtqResponse,
  saveBis10Response,
  saveAls18Response,
  saveAimResponse,
  saveWurs25Response,
  saveAq12Response,
  saveCsmResponse,
  saveCtiResponse
} from '@/lib/services/questionnaire.service';
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
  saveSisResponse,
  saveSuicideHistoryResponse,
  savePerinataliteResponse,
  savePathoNeuroResponse,
  savePathoCardioResponse,
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
  // WAIS-III questionnaires
  saveWais3CvltResponse,
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
  saveWais3Mem3SpatialResponse
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
} from '@/lib/services/questionnaire-infirmier.service';
import {
  saveDsm5HumeurResponse,
  saveDsm5PsychoticResponse,
  saveDsm5ComorbidResponse
} from '@/lib/services/questionnaire-dsm5.service';
import { 
  getVisitCompletionStatus,
  completeVisit
} from '@/lib/services/visit.service';
import { 
  AsrmResponseInsert, 
  QidsResponseInsert, 
  MdqResponseInsert,
  BipolarDiagnosticResponseInsert,
  OrientationResponseInsert,
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
  SisResponseInsert,
  SuicideHistoryResponseInsert,
  PerinataliteResponseInsert,
  PathoNeuroResponseInsert,
  PathoCardioResponseInsert,
  SocialResponseInsert,
  TobaccoResponseInsert,
  FagerstromResponseInsert,
  PhysicalParamsResponseInsert,
  BloodPressureResponseInsert,
  SleepApneaResponseInsert,
  BiologicalAssessmentResponseInsert,
  EcgResponseInsert,
  Dsm5HumeurResponseInsert,
  Dsm5PsychoticResponseInsert,
  Dsm5ComorbidResponseInsert,
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
  // WAIS-III types
  Wais3CvltResponseInsert,
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
  Wais3Mem3SpatialResponseInsert
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
    
    let result;
    switch (questionnaireCode) {
      case 'ASRM_FR':
        result = await saveAsrmResponse({
          visit_id: visitId,
          patient_id: patientId,
          completed_by: completedBy,
          ...responses as any
        } as AsrmResponseInsert);
        break;
        
      case 'QIDS_SR16_FR':
        result = await saveQidsResponse({
          visit_id: visitId,
          patient_id: patientId,
          completed_by: completedBy,
          ...responses as any
        } as QidsResponseInsert);
        break;
        
      case 'MDQ_FR':
        result = await saveMdqResponse({
          visit_id: visitId,
          patient_id: patientId,
          completed_by: completedBy,
          ...responses as any
        } as MdqResponseInsert);
        break;

      case 'EBIP_SCR_DIAG':
        result = await saveDiagnosticResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BipolarDiagnosticResponseInsert);
        break;

      case 'EBIP_SCR_ORIENT':
        result = await saveOrientationResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as OrientationResponseInsert);
        break;

      // Initial Evaluation - ETAT
      case 'EQ5D5L':
        result = await saveEq5d5lResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Eq5d5lResponseInsert);
        break;

      case 'PRISE_M':
        result = await savePriseMResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as PriseMResponseInsert);
        break;

      case 'STAI_YA':
        result = await saveStaiYaResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as StaiYaResponseInsert);
        break;

      case 'MARS':
        result = await saveMarsResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as MarsResponseInsert);
        break;

      case 'MATHYS':
        result = await saveMathysResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as MathysResponseInsert);
        break;

      case 'PSQI':
        result = await savePsqiResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as PsqiResponseInsert);
        break;

      case 'EPWORTH':
        result = await saveEpworthResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as EpworthResponseInsert);
        break;

      // Initial Evaluation - TRAITS
      case 'ASRS':
        result = await saveAsrsResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as AsrsResponseInsert);
        break;

      case 'CTQ':
        result = await saveCtqResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as CtqResponseInsert);
        break;

      case 'BIS10':
        result = await saveBis10Response({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Bis10ResponseInsert);
        break;

      case 'ALS18':
        result = await saveAls18Response({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Als18ResponseInsert);
        break;

      case 'AIM':
        result = await saveAimResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as AimResponseInsert);
        break;

      case 'WURS25':
        result = await saveWurs25Response({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Wurs25ResponseInsert);
        break;

      case 'AQ12':
        result = await saveAq12Response({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Aq12ResponseInsert);
        break;

      case 'CSM':
        result = await saveCsmResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as CsmResponseInsert);
        break;

      case 'CTI':
        result = await saveCtiResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as CtiResponseInsert);
        break;

      // Hetero questionnaires
      case 'MADRS':
        result = await saveMadrsResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as MadrsResponseInsert);
        break;

      case 'YMRS':
        result = await saveYmrsResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as YmrsResponseInsert);
        break;

      case 'CGI':
        result = await saveCgiResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as CgiResponseInsert);
        break;

      case 'EGF':
        result = await saveEgfResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as EgfResponseInsert);
        break;

      case 'ALDA':
        result = await saveAldaResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as AldaResponseInsert);
        break;

      case 'ETAT_PATIENT':
        result = await saveEtatPatientResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as EtatPatientResponseInsert);
        break;

      case 'FAST':
        result = await saveFastResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as FastResponseInsert);
        break;

      case 'DIVA_2_FR':
        result = await saveDivaResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as DivaResponseInsert);
        break;

      case 'FAMILY_HISTORY_FR':
        result = await saveFamilyHistoryResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as FamilyHistoryResponseInsert);
        break;

      case 'CSSRS_FR':
        result = await saveCssrsResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as CssrsResponseInsert);
        break;

      case 'ISA_FR':
        result = await saveIsaResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as IsaResponseInsert);
        break;

      case 'SIS_FR':
        result = await saveSisResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as SisResponseInsert);
        break;

      case 'SUICIDE_HISTORY_FR':
        result = await saveSuicideHistoryResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as SuicideHistoryResponseInsert);
        break;

      case 'PERINATALITE_FR':
        result = await savePerinataliteResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as PerinataliteResponseInsert);
        break;

      case 'PATHO_NEURO_FR':
        result = await savePathoNeuroResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as PathoNeuroResponseInsert);
        break;

      case 'PATHO_CARDIO_FR':
        result = await savePathoCardioResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as PathoCardioResponseInsert);
        break;

      case 'SOCIAL':
        result = await saveSocialResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as SocialResponseInsert);
        break;

      case 'TOBACCO':
        result = await saveTobaccoResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as TobaccoResponseInsert);
        break;

      case 'FAGERSTROM':
        result = await saveFagerstromResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as FagerstromResponseInsert);
        break;

      case 'PHYSICAL_PARAMS':
        result = await savePhysicalParamsResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as PhysicalParamsResponseInsert);
        break;

      case 'BLOOD_PRESSURE':
        result = await saveBloodPressureResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BloodPressureResponseInsert);
        break;

      case 'SLEEP_APNEA':
        result = await saveSleepApneaResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as SleepApneaResponseInsert);
        break;
        
      case 'BIOLOGICAL_ASSESSMENT':
        result = await saveBiologicalAssessmentResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as BiologicalAssessmentResponseInsert);
        break;

      case 'ECG':
        result = await saveEcgResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as EcgResponseInsert);
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

      case 'WAIS4_CRITERIA_FR':
        result = await saveWais4CriteriaResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Wais4CriteriaResponseInsert);
        break;

      case 'WAIS4_LEARNING_FR':
        result = await saveWais4LearningResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Wais4LearningResponseInsert);
        break;

      case 'WAIS4_MATRICES_FR':
        result = await saveWais4MatricesResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Wais4MatricesResponseInsert);
        break;

      case 'CVLT_FR':
        result = await saveCvltResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as CvltResponseInsert);
        break;

      case 'WAIS4_CODE_FR':
        result = await saveWais4CodeResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Wais4CodeResponseInsert);
        break;

      case 'WAIS4_DIGIT_SPAN_FR':
        result = await saveWais4DigitSpanResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Wais4DigitSpanResponseInsert);
        break;

      case 'TMT_FR':
        result = await saveTmtResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as TmtResponseInsert);
        break;

      case 'STROOP_FR':
        result = await saveStroopResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as StroopResponseInsert);
        break;

      case 'FLUENCES_VERBALES_FR':
        result = await saveFluencesVerbalesResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as FluencesVerbalesResponseInsert);
        break;

      case 'COBRA_FR':
        result = await saveCobraResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as CobraResponseInsert);
        break;

      case 'CPT3_FR':
        result = await saveCpt3Response({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Cpt3ResponseInsert);
        break;

      case 'WAIS4_SIMILITUDES_FR':
        result = await saveWais4SimilitudesResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Wais4SimilitudesResponseInsert);
        break;

      case 'TEST_COMMISSIONS_FR':
        result = await saveTestCommissionsResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as TestCommissionsResponseInsert);
        break;

      case 'SCIP_FR':
        result = await saveScipResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as ScipResponseInsert);
        break;

      // WAIS-III Questionnaires
      case 'WAIS3_CVLT_FR':
        result = await saveWais3CvltResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Wais3CvltResponseInsert);
        break;

      case 'WAIS3_TMT_FR':
        result = await saveWais3TmtResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Wais3TmtResponseInsert);
        break;

      case 'WAIS3_STROOP_FR':
        result = await saveWais3StroopResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Wais3StroopResponseInsert);
        break;

      case 'WAIS3_FLUENCES_VERBALES_FR':
        result = await saveWais3FluencesVerbalesResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Wais3FluencesVerbalesResponseInsert);
        break;

      case 'WAIS3_CRITERIA_FR':
        result = await saveWais3CriteriaResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Wais3CriteriaResponseInsert);
        break;

      case 'WAIS3_LEARNING_FR':
        result = await saveWais3LearningResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Wais3LearningResponseInsert);
        break;

      case 'WAIS3_VOCABULAIRE_FR':
        result = await saveWais3VocabulaireResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as Wais3VocabulaireResponseInsert);
        break;

      case 'WAIS3_MATRICES_FR':
        result = await saveWais3MatricesResponse({
          visit_id: visitId,
          patient_id: patientId,
          patient_age: responses.patient_age,
          item_01: responses.item_01,
          item_02: responses.item_02,
          item_03: responses.item_03,
          item_04: responses.item_04,
          item_05: responses.item_05,
          item_06: responses.item_06,
          item_07: responses.item_07,
          item_08: responses.item_08,
          item_09: responses.item_09,
          item_10: responses.item_10,
          item_11: responses.item_11,
          item_12: responses.item_12,
          item_13: responses.item_13,
          item_14: responses.item_14,
          item_15: responses.item_15,
          item_16: responses.item_16,
          item_17: responses.item_17,
          item_18: responses.item_18,
          item_19: responses.item_19,
          item_20: responses.item_20,
          item_21: responses.item_21,
          item_22: responses.item_22,
          item_23: responses.item_23,
          item_24: responses.item_24,
          item_25: responses.item_25,
          item_26: responses.item_26
        } as Wais3MatricesResponseInsert);
        break;

      case 'WAIS3_CODE_SYMBOLES_FR':
        result = await saveWais3CodeSymbolesResponse({
          visit_id: visitId,
          patient_id: patientId,
          patient_age: responses.patient_age,
          wais_cod_tot: responses.wais_cod_tot,
          wais_cod_err: responses.wais_cod_err,
          wais_symb_tot: responses.wais_symb_tot,
          wais_symb_err: responses.wais_symb_err
        } as Wais3CodeSymbolesResponseInsert);
        break;

      case 'WAIS3_DIGIT_SPAN_FR':
        result = await saveWais3DigitSpanResponse({
          visit_id: visitId,
          patient_id: patientId,
          patient_age: responses.patient_age,
          education_level: responses.education_level,
          mcod_1a: responses.mcod_1a, mcod_1b: responses.mcod_1b,
          mcod_2a: responses.mcod_2a, mcod_2b: responses.mcod_2b,
          mcod_3a: responses.mcod_3a, mcod_3b: responses.mcod_3b,
          mcod_4a: responses.mcod_4a, mcod_4b: responses.mcod_4b,
          mcod_5a: responses.mcod_5a, mcod_5b: responses.mcod_5b,
          mcod_6a: responses.mcod_6a, mcod_6b: responses.mcod_6b,
          mcod_7a: responses.mcod_7a, mcod_7b: responses.mcod_7b,
          mcod_8a: responses.mcod_8a, mcod_8b: responses.mcod_8b,
          mcoi_1a: responses.mcoi_1a, mcoi_1b: responses.mcoi_1b,
          mcoi_2a: responses.mcoi_2a, mcoi_2b: responses.mcoi_2b,
          mcoi_3a: responses.mcoi_3a, mcoi_3b: responses.mcoi_3b,
          mcoi_4a: responses.mcoi_4a, mcoi_4b: responses.mcoi_4b,
          mcoi_5a: responses.mcoi_5a, mcoi_5b: responses.mcoi_5b,
          mcoi_6a: responses.mcoi_6a, mcoi_6b: responses.mcoi_6b,
          mcoi_7a: responses.mcoi_7a, mcoi_7b: responses.mcoi_7b
        } as Wais3DigitSpanResponseInsert);
        break;

      case 'WAIS3_CPT2_FR':
        result = await saveWais3Cpt2Response({
          visit_id: visitId,
          patient_id: patientId,
          ...responses
        } as Wais3Cpt2ResponseInsert);
        break;
      
      case 'WAIS3_MEM3_SPATIAL_FR':
        result = await saveWais3Mem3SpatialResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses
        } as Wais3Mem3SpatialResponseInsert);
        break;
        
      default:
        throw new Error(`Unknown questionnaire code: ${questionnaireCode}`);
    }
    
    // Check if visit is now 100% complete and auto-complete it
    try {
      const completionStatus = await getVisitCompletionStatus(visitId);
      if (completionStatus.completionPercentage === 100) {
        await completeVisit(visitId);
        console.log(`Visit ${visitId} automatically completed (100% questionnaires filled)`);
      }
    } catch (error) {
      // Log but don't fail the questionnaire submission if auto-complete fails
      console.error('Failed to auto-complete visit:', error);
    }
    
    revalidatePath('/professional'); // Broad revalidation or specific if we knew the path
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to submit questionnaire:', error);
    return { success: false, error: 'Failed to submit questionnaire' };
  }
}
