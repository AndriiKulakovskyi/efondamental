// eFondaMental Platform - Schizophrenia Questionnaire Service
// Service functions for schizophrenia screening questionnaires

import { createClient } from '../supabase/server';
import {
  ScreeningSzDiagnosticResponse,
  ScreeningSzDiagnosticResponseInsert,
  ScreeningSzOrientationResponse,
  ScreeningSzOrientationResponseInsert,
} from '../types/database.types';

// ============================================================================
// SCHIZOPHRENIA SCREENING DIAGNOSTIC
// ============================================================================

export async function getScreeningSzDiagnosticResponse(
  visitId: string
): Promise<ScreeningSzDiagnosticResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_screening_sz_diagnostic')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }
  return data;
}

export async function saveScreeningSzDiagnosticResponse(
  response: ScreeningSzDiagnosticResponseInsert
): Promise<ScreeningSzDiagnosticResponse> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_screening_sz_diagnostic')
    .upsert(response, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// SCHIZOPHRENIA SCREENING ORIENTATION CENTRE EXPERT
// ============================================================================

export async function getScreeningSzOrientationResponse(
  visitId: string
): Promise<ScreeningSzOrientationResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_screening_sz_orientation')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }
  return data;
}

export async function saveScreeningSzOrientationResponse(
  response: ScreeningSzOrientationResponseInsert
): Promise<ScreeningSzOrientationResponse> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_screening_sz_orientation')
    .upsert(response, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}
