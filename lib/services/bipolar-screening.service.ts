// eFondaMental Platform - Bipolar Screening Service
// Service layer for bipolar screening questionnaires (public.bipolar_* tables)

import { createClient } from '@/lib/supabase/server';
import {
  scoreAsrm,
  scoreQids,
  scoreMdq,
  type BipolarAsrmResponse,
  type BipolarAsrmResponseInsert,
  type BipolarQidsResponse,
  type BipolarQidsResponseInsert,
  type BipolarMdqResponse,
  type BipolarMdqResponseInsert
} from '@/lib/questionnaires/bipolar/screening/auto';
import {
  type BipolarDiagnosticResponse,
  type BipolarDiagnosticResponseInsert,
  type BipolarOrientationResponse,
  type BipolarOrientationResponseInsert
} from '@/lib/questionnaires/bipolar/screening/medical';

// ============================================================================
// ASRM
// ============================================================================

export async function getBipolarAsrmResponse(
  visitId: string
): Promise<BipolarAsrmResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_asrm')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveBipolarAsrmResponse(
  response: BipolarAsrmResponseInsert
): Promise<BipolarAsrmResponse> {
  const supabase = await createClient();

  // Compute score and interpretation
  const scoring = scoreAsrm({
    q1: response.q1,
    q2: response.q2,
    q3: response.q3,
    q4: response.q4,
    q5: response.q5
  });

  const { data, error } = await supabase
    .from('bipolar_asrm')
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
// QIDS-SR16
// ============================================================================

export async function getBipolarQidsResponse(
  visitId: string
): Promise<BipolarQidsResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_qids_sr16')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveBipolarQidsResponse(
  response: BipolarQidsResponseInsert
): Promise<BipolarQidsResponse> {
  const supabase = await createClient();

  // Compute score and interpretation
  const scoring = scoreQids({
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
    .from('bipolar_qids_sr16')
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
// MDQ
// ============================================================================

export async function getBipolarMdqResponse(
  visitId: string
): Promise<BipolarMdqResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_mdq')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveBipolarMdqResponse(
  response: BipolarMdqResponseInsert
): Promise<BipolarMdqResponse> {
  const supabase = await createClient();

  // Compute score and interpretation
  const scoring = scoreMdq({
    q1_1: response.q1_1,
    q1_2: response.q1_2,
    q1_3: response.q1_3,
    q1_4: response.q1_4,
    q1_5: response.q1_5,
    q1_6: response.q1_6,
    q1_7: response.q1_7,
    q1_8: response.q1_8,
    q1_9: response.q1_9,
    q1_10: response.q1_10,
    q1_11: response.q1_11,
    q1_12: response.q1_12,
    q1_13: response.q1_13,
    q2: response.q2,
    q3: response.q3
  });

  const { data, error } = await supabase
    .from('bipolar_mdq')
    .upsert({
      ...response,
      q1_score: scoring.q1_score,
      interpretation: scoring.interpretation
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Diagnostic
// ============================================================================

export async function getBipolarDiagnosticResponse(
  visitId: string
): Promise<BipolarDiagnosticResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_diagnostic')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveBipolarDiagnosticResponse(
  response: BipolarDiagnosticResponseInsert
): Promise<BipolarDiagnosticResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('bipolar_diagnostic')
    .upsert({
      ...response,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Orientation
// ============================================================================

export async function getBipolarOrientationResponse(
  visitId: string
): Promise<BipolarOrientationResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_orientation')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveBipolarOrientationResponse(
  response: BipolarOrientationResponseInsert
): Promise<BipolarOrientationResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('bipolar_orientation')
    .upsert({
      ...response,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Pending Questionnaires for Bipolar Screening
// ============================================================================

export async function getBipolarScreeningPendingQuestionnaires(patientId: string) {
  const supabase = await createClient();

  // Get latest screening visit for the patient
  const { data: visit } = await supabase
    .from('visits')
    .select('id, visit_type')
    .eq('patient_id', patientId)
    .eq('visit_type', 'screening')
    .in('status', ['scheduled', 'in_progress'])
    .order('scheduled_date', { ascending: false })
    .limit(1)
    .single();

  if (!visit) return [];

  // Check which questionnaires are completed
  const [asrm, qids, mdq] = await Promise.all([
    getBipolarAsrmResponse(visit.id),
    getBipolarQidsResponse(visit.id),
    getBipolarMdqResponse(visit.id)
  ]);

  const pending = [];
  if (!asrm) pending.push({
    id: 'ASRM_FR',
    title: 'Auto-Questionnaire Altman (ASRM)',
    description: "Echelle d'Auto-Evaluation de la Manie",
    estimatedTime: 5
  });
  if (!qids) pending.push({
    id: 'QIDS_SR16_FR',
    title: 'QIDS-SR16',
    description: 'Auto-questionnaire sur les symptomes de la depression',
    estimatedTime: 10
  });
  if (!mdq) pending.push({
    id: 'MDQ_FR',
    title: "MDQ - Questionnaire des Troubles de l'Humeur",
    description: 'Outil de depistage du trouble bipolaire',
    estimatedTime: 5
  });

  return pending;
}
