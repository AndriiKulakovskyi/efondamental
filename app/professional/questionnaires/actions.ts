'use server';

import { 
  saveAsrmResponse, 
  saveQidsResponse, 
  saveMdqResponse,
  saveDiagnosticResponse,
  saveOrientationResponse
} from '@/lib/services/questionnaire.service';
import { 
  AsrmResponseInsert, 
  QidsResponseInsert, 
  MdqResponseInsert,
  BipolarDiagnosticResponseInsert,
  OrientationResponseInsert
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
        
      default:
        throw new Error(`Unknown questionnaire code: ${questionnaireCode}`);
    }
    
    revalidatePath('/professional'); // Broad revalidation or specific if we knew the path
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to submit questionnaire:', error);
    return { success: false, error: 'Failed to submit questionnaire' };
  }
}
