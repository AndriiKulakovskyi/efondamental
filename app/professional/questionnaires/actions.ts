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
  saveCssrsHistoryResponse,
  saveSisResponse,
  saveWais4CriteriaResponse,
  saveWais4LearningResponse,
  saveWais4MatricesResponse,
  saveCvltResponse,
  saveWais4CodeResponse,
  saveWais4DigitSpanResponse,
  saveTmtResponse,
  saveStroopResponse,
  saveFluencesVerbalesResponse,
  saveCobraResponse
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
  CssrsHistoryResponseInsert,
  SisResponseInsert,
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
  CobraResponseInsert
} from '@/lib/types/database.types';
import { revalidatePath } from 'next/cache';

export async function submitProfessionalQuestionnaireAction(
  questionnaireCode: string,
  visitId: string,
  patientId: string,
  responses: Record<string, any>
) {
  try {
    let result;
    switch (questionnaireCode) {
      case 'ASRM_FR':
        result = await saveAsrmResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as AsrmResponseInsert);
        break;
        
      case 'QIDS_SR16_FR':
        result = await saveQidsResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as QidsResponseInsert);
        break;
        
      case 'MDQ_FR':
        result = await saveMdqResponse({
          visit_id: visitId,
          patient_id: patientId,
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

      case 'CSSRS_HISTORY_FR':
        result = await saveCssrsHistoryResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as CssrsHistoryResponseInsert);
        break;

      case 'SIS_FR':
        result = await saveSisResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as SisResponseInsert);
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
