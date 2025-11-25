// eFondaMental Platform - Visit Detail Service

import { createClient } from '../supabase/server';
import { VisitFull } from '../types/database.types';

// ============================================================================
// TYPES
// ============================================================================

export interface QuestionnaireStatus {
  completed: boolean;
  completed_at?: string | null;
}

export interface VisitCompletionStatus {
  total_questionnaires: number;
  completed_questionnaires: number;
  completion_percentage: number;
}

export interface VisitDetailData {
  visit: VisitFull;
  questionnaireStatuses: Record<string, QuestionnaireStatus>;
  completionStatus: VisitCompletionStatus;
}

// ============================================================================
// RPC CALL
// ============================================================================

/**
 * Fetches all visit detail data with questionnaire statuses in a single RPC call
 * 
 * This function replaces 41 sequential queries (for initial evaluation visits)
 * with one optimized database call, dramatically improving visit page load performance.
 * 
 * Performance: Reduces up to 41 queries to just 1 query
 * 
 * @param visitId - ID of the visit
 * @returns Complete visit detail data with all questionnaire completion statuses
 */
export async function getVisitDetailData(
  visitId: string
): Promise<VisitDetailData> {
  const supabase = await createClient();

  try {
    // Call the RPC function
    const { data, error } = await supabase.rpc('get_visit_detail_data', {
      p_visit_id: visitId
    });

    if (error) {
      console.error('Error fetching visit detail data:', error);
      throw new Error(`Failed to fetch visit detail data: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from visit detail RPC');
    }

    // Transform the response
    const visit = data.visit as VisitFull;
    const questionnaireStatuses = (data.questionnaire_statuses || {}) as Record<string, QuestionnaireStatus>;
    const completionStatus = data.completion_status as VisitCompletionStatus;

    return {
      visit,
      questionnaireStatuses,
      completionStatus
    };
  } catch (error) {
    console.error('Error in getVisitDetailData:', error);
    throw error;
  }
}

