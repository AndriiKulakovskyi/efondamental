'use server';

import { 
  saveAsrmResponse, 
  saveQidsResponse, 
  saveMdqResponse 
} from '@/lib/services/questionnaire.service';
import { 
  getVisitCompletionStatus,
  completeVisit
} from '@/lib/services/visit.service';
import { 
  AsrmResponseInsert, 
  QidsResponseInsert, 
  MdqResponseInsert 
} from '@/lib/types/database.types';
import { revalidatePath } from 'next/cache';

export async function submitQuestionnaireAction(
  questionnaireCode: string,
  visitId: string,
  patientId: string,
  responses: Record<string, any>
) {
  try {
    switch (questionnaireCode) {
      case 'ASRM_FR':
        await saveAsrmResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any // We assume validation happened on client
        } as AsrmResponseInsert);
        break;
        
      case 'QIDS_SR16_FR':
        await saveQidsResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as QidsResponseInsert);
        break;
        
      case 'MDQ_FR':
        await saveMdqResponse({
          visit_id: visitId,
          patient_id: patientId,
          ...responses as any
        } as MdqResponseInsert);
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
    return { success: true };
  } catch (error) {
    console.error('Failed to submit questionnaire:', error);
    return { success: false, error: 'Failed to submit questionnaire' };
  }
}

