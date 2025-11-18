// eFondaMental Platform - Questionnaire Service

import { createClient } from '../supabase/server';
import {
  Questionnaire,
  QuestionnaireResponse,
  QuestionnaireResponseInsert,
  QuestionnaireResponseUpdate,
} from '../types/database.types';
import { UserRole, QuestionnaireResponseStatus } from '../types/enums';

// ============================================================================
// QUESTIONNAIRE CRUD
// ============================================================================

export async function getQuestionnaireById(
  questionnaireId: string
): Promise<Questionnaire | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('questionnaires')
    .select('*')
    .eq('id', questionnaireId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch questionnaire: ${error.message}`);
  }

  return data;
}

export async function getQuestionnaireByCode(
  code: string
): Promise<Questionnaire | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('questionnaires')
    .select('*')
    .eq('code', code)
    .eq('active', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch questionnaire: ${error.message}`);
  }

  return data;
}

export async function getQuestionnairesByRole(
  role: UserRole
): Promise<Questionnaire[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('questionnaires')
    .select('*')
    .eq('target_role', role)
    .eq('active', true)
    .order('created_at');

  if (error) {
    throw new Error(`Failed to fetch questionnaires by role: ${error.message}`);
  }

  return data || [];
}

// ============================================================================
// QUESTIONNAIRE RESPONSE CRUD
// ============================================================================

export async function getResponseById(
  responseId: string
): Promise<QuestionnaireResponse | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('questionnaire_responses')
    .select('*')
    .eq('id', responseId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch response: ${error.message}`);
  }

  return data;
}

export async function createResponse(
  response: QuestionnaireResponseInsert
): Promise<QuestionnaireResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('questionnaire_responses')
    .insert(response)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create response: ${error.message}`);
  }

  return data;
}

export async function updateResponse(
  responseId: string,
  updates: QuestionnaireResponseUpdate
): Promise<QuestionnaireResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('questionnaire_responses')
    .update(updates)
    .eq('id', responseId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update response: ${error.message}`);
  }

  return data;
}

export async function saveResponse(
  responseId: string,
  responses: Record<string, any>
): Promise<QuestionnaireResponse> {
  return updateResponse(responseId, {
    responses,
  });
}

export async function completeResponse(
  responseId: string,
  completedBy: string
): Promise<QuestionnaireResponse> {
  return updateResponse(responseId, {
    status: QuestionnaireResponseStatus.COMPLETED,
    completed_at: new Date().toISOString(),
    completed_by: completedBy,
  });
}

// ============================================================================
// RESPONSE QUERIES
// ============================================================================

export async function getResponseByVisitAndQuestionnaire(
  visitId: string,
  questionnaireId: string
): Promise<QuestionnaireResponse | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('questionnaire_responses')
    .select('*')
    .eq('visit_id', visitId)
    .eq('questionnaire_id', questionnaireId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch response: ${error.message}`);
  }

  return data;
}

export async function getResponsesByVisit(
  visitId: string
): Promise<QuestionnaireResponse[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('questionnaire_responses')
    .select('*')
    .eq('visit_id', visitId)
    .order('created_at');

  if (error) {
    throw new Error(`Failed to fetch responses by visit: ${error.message}`);
  }

  return data || [];
}

export async function getResponsesByPatient(
  patientId: string
): Promise<QuestionnaireResponse[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('questionnaire_responses')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch responses by patient: ${error.message}`);
  }

  return data || [];
}

export async function getPendingQuestionnaires(
  patientId: string
): Promise<Questionnaire[]> {
  const supabase = await createClient();

  // Get all scheduled or in-progress visits for this patient
  const { data: visits } = await supabase
    .from('visits')
    .select('id, visit_template_id')
    .eq('patient_id', patientId)
    .in('status', ['scheduled', 'in_progress']);

  if (!visits || visits.length === 0) {
    return [];
  }

  const pendingQuestionnaires: Questionnaire[] = [];

  for (const visit of visits) {
    // Get modules for this visit template
    const { data: modules } = await supabase
      .from('modules')
      .select('id')
      .eq('visit_template_id', visit.visit_template_id)
      .eq('active', true);

    if (!modules) continue;

    for (const module of modules) {
      // Get questionnaires for patient role
      const { data: questionnaires } = await supabase
        .from('questionnaires')
        .select('*')
        .eq('module_id', module.id)
        .eq('target_role', UserRole.PATIENT)
        .eq('active', true);

      if (!questionnaires) continue;

      for (const questionnaire of questionnaires) {
        // Check if already completed
        const { data: response } = await supabase
          .from('questionnaire_responses')
          .select('id')
          .eq('visit_id', visit.id)
          .eq('questionnaire_id', questionnaire.id)
          .eq('status', 'completed')
          .single();

        if (!response) {
          pendingQuestionnaires.push(questionnaire);
        }
      }
    }
  }

  return pendingQuestionnaires;
}

// Note: Conditional logic and validation functions have been moved to
// @/lib/utils/questionnaire-logic.ts for client-side compatibility

