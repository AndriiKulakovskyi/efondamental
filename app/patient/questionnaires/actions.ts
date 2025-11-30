'use server';

import { 
  saveAsrmResponse, 
  saveQidsResponse, 
  saveMdqResponse,
  saveEq5d5lResponse,
  savePriseMResponse,
  saveStaiYaResponse,
  saveMarsResponse,
  saveMathysResponse,
  savePsqiResponse,
  saveEpworthResponse,
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
  getVisitCompletionStatus,
  completeVisit
} from '@/lib/services/visit.service';
import { isQuestionnaireLockedByProfessional } from '@/lib/services/patient-visit.service';
import { createClient } from '@/lib/supabase/server';
import { requireUserContext } from '@/lib/rbac/middleware';
import { revalidatePath } from 'next/cache';

export async function submitQuestionnaireAction(
  questionnaireCode: string,
  visitId: string,
  patientId: string,
  responses: Record<string, any>
) {
  try {
    // Get user context to verify and check locks
    const context = await requireUserContext();
    
    // Get the patient's user_id
    const supabase = await createClient();
    const { data: patient } = await supabase
      .from('patients')
      .select('user_id')
      .eq('id', patientId)
      .single();
    
    if (!patient) {
      return { success: false, error: 'Patient not found' };
    }
    
    // Verify the user is the patient
    if (patient.user_id !== context.user.id) {
      return { success: false, error: 'Unauthorized' };
    }
    
    // Check if questionnaire is locked by a professional
    const isLocked = await isQuestionnaireLockedByProfessional(
      visitId,
      questionnaireCode,
      patient.user_id
    );
    
    if (isLocked) {
      return { 
        success: false, 
        error: 'Ce questionnaire a ete complete par votre equipe soignante et ne peut pas etre modifie.' 
      };
    }
    
    // Prepare the response data with completed_by
    const responseData = {
      visit_id: visitId,
      patient_id: patientId,
      completed_by: context.user.id, // Track who completed it
      ...responses
    };
    
    // Save based on questionnaire code
    switch (questionnaireCode) {
      case 'ASRM_FR':
        await saveAsrmResponse(responseData as any);
        break;
        
      case 'QIDS_SR16_FR':
        await saveQidsResponse(responseData as any);
        break;
        
      case 'MDQ_FR':
        await saveMdqResponse(responseData as any);
        break;
        
      case 'EQ5D5L_FR':
        await saveEq5d5lResponse(responseData as any);
        break;
        
      case 'PRISE_M_FR':
        await savePriseMResponse(responseData as any);
        break;
        
      case 'STAI_YA_FR':
        await saveStaiYaResponse(responseData as any);
        break;
        
      case 'MARS_FR':
        await saveMarsResponse(responseData as any);
        break;
        
      case 'MATHYS_FR':
        await saveMathysResponse(responseData as any);
        break;
        
      case 'PSQI_FR':
        await savePsqiResponse(responseData as any);
        break;
        
      case 'EPWORTH_FR':
        await saveEpworthResponse(responseData as any);
        break;
        
      case 'ASRS_FR':
        await saveAsrsResponse(responseData as any);
        break;
        
      case 'CTQ_FR':
        await saveCtqResponse(responseData as any);
        break;
        
      case 'BIS10_FR':
        await saveBis10Response(responseData as any);
        break;
        
      case 'ALS18_FR':
        await saveAls18Response(responseData as any);
        break;
        
      case 'AIM_FR':
        await saveAimResponse(responseData as any);
        break;
        
      case 'WURS25_FR':
        await saveWurs25Response(responseData as any);
        break;
        
      case 'AQ12_FR':
        await saveAq12Response(responseData as any);
        break;
        
      case 'CSM_FR':
        await saveCsmResponse(responseData as any);
        break;
        
      case 'CTI_FR':
        await saveCtiResponse(responseData as any);
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
    
    revalidatePath('/patient/questionnaires');
    revalidatePath('/patient');
    return { success: true };
  } catch (error) {
    console.error('Failed to submit questionnaire:', error);
    return { success: false, error: 'Failed to submit questionnaire' };
  }
}
