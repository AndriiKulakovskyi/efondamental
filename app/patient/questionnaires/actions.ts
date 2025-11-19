'use server';

import { 
  saveAsrmResponse, 
  saveQidsResponse, 
  saveMdqResponse 
} from '@/lib/services/questionnaire.service';
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
    
    revalidatePath('/patient/questionnaires');
    return { success: true };
  } catch (error) {
    console.error('Failed to submit questionnaire:', error);
    return { success: false, error: 'Failed to submit questionnaire' };
  }
}

