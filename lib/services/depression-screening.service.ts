// eFondaMental Platform - Depression Screening Service
// Service layer for depression screening questionnaires (public.depression_* tables)

import { createClient } from '@/lib/supabase/server';
import {
  scoreDepressionQids,
  type DepressionQidsResponse,
  type DepressionQidsResponseInsert,
} from '@/lib/questionnaires/depression/screening/auto';
import {
  scoreDepressionMadrs,
  type DepressionMadrsResponse,
  type DepressionMadrsResponseInsert,
  scoreDepressionThaseRush,
  type DepressionThaseRushResponse,
  type DepressionThaseRushResponseInsert,
  scoreDepressionMini,
  expandMultiChoiceToColumns,
  type DepressionMiniResponse,
  type DepressionMiniResponseInsert,
} from '@/lib/questionnaires/depression/screening/hetero';

// ============================================================================
// QIDS-SR16
// ============================================================================

export async function getDepressionQidsResponse(
  visitId: string
): Promise<DepressionQidsResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('depression_qids_sr16')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveDepressionQidsResponse(
  response: DepressionQidsResponseInsert
): Promise<DepressionQidsResponse> {
  const supabase = await createClient();

  const scoring = scoreDepressionQids({
    q1: response.q1,
    q2: response.q2,
    q3: response.q3,
    q4: response.q4,
    q5: response.q5,
    q6: response.q6,
    q7: response.q7,
    q8: response.q8,
    q9: response.q9,
    q10: response.q10,
    q11: response.q11,
    q12: response.q12,
    q13: response.q13,
    q14: response.q14,
    q15: response.q15,
    q16: response.q16
  });

  const { data, error } = await supabase
    .from('depression_qids_sr16')
    .upsert({
      ...response,
      total_score: scoring.total_score,
      interpretation: scoring.interpretation
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// MADRS
// ============================================================================

export async function getDepressionMadrsResponse(
  visitId: string
): Promise<DepressionMadrsResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('depression_madrs')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveDepressionMadrsResponse(
  response: DepressionMadrsResponseInsert
): Promise<DepressionMadrsResponse> {
  const supabase = await createClient();

  const scoring = scoreDepressionMadrs({
    q1: response.q1,
    q2: response.q2,
    q3: response.q3,
    q4: response.q4,
    q5: response.q5,
    q6: response.q6,
    q7: response.q7,
    q8: response.q8,
    q9: response.q9,
    q10: response.q10
  });

  const { data, error } = await supabase
    .from('depression_madrs')
    .upsert({
      ...response,
      total_score: scoring.total_score,
      severity: scoring.severity,
      interpretation: scoring.interpretation
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Thase et Rush
// ============================================================================

export async function getDepressionThaseRushResponse(
  visitId: string
): Promise<DepressionThaseRushResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('depression_thase_rush')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveDepressionThaseRushResponse(
  response: DepressionThaseRushResponseInsert
): Promise<DepressionThaseRushResponse> {
  const supabase = await createClient();

  const scoring = scoreDepressionThaseRush({
    niveau_resistance: response.niveau_resistance
  });

  const { data, error } = await supabase
    .from('depression_thase_rush')
    .upsert({
      ...response,
      total_score: scoring.total_score,
      interpretation: scoring.interpretation
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// MINI
// ============================================================================

export async function getDepressionMiniResponse(
  visitId: string
): Promise<DepressionMiniResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('depression_mini')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveDepressionMiniResponse(
  response: DepressionMiniResponseInsert
): Promise<DepressionMiniResponse> {
  const supabase = await createClient();

  const scoring = scoreDepressionMini(response);
  const expanded = expandMultiChoiceToColumns(response);

  const { data, error } = await supabase
    .from('depression_mini')
    .upsert({
      ...expanded,
      total_score: scoring.total_score,
      interpretation: scoring.interpretation,
      minib_score: scoring.minib_score,
      minib_risque: scoring.minib_risque,
      minib_risque_cot: scoring.minib_risque_cot
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}
