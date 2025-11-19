// eFondaMental Platform - Questionnaire Service
// Typed service for handling specific questionnaire responses

import { createClient } from '@/lib/supabase/server';
import {
  AsrmResponse,
  AsrmResponseInsert,
  QidsResponse,
  QidsResponseInsert,
  MdqResponse,
  MdqResponseInsert,
  BipolarDiagnosticResponse,
  BipolarDiagnosticResponseInsert,
  OrientationResponse,
  OrientationResponseInsert
} from '@/lib/types/database.types';

// ============================================================================
// ASRM
// ============================================================================

export async function getAsrmResponse(
  visitId: string
): Promise<AsrmResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_asrm')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveAsrmResponse(
  response: AsrmResponseInsert
): Promise<AsrmResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('responses_asrm')
    .upsert(response, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// QIDS-SR16
// ============================================================================

export async function getQidsResponse(
  visitId: string
): Promise<QidsResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_qids_sr16')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveQidsResponse(
  response: QidsResponseInsert
): Promise<QidsResponse> {
  const supabase = await createClient();

  // Calculate QIDS score
  const sleepScore = Math.max(response.q1, response.q2, response.q3);
  const appetiteScore = Math.max(response.q6, response.q7);
  const weightScore = Math.max(response.q8, response.q9);
  const psychomotorScore = Math.max(response.q15, response.q16);
  
  const totalScore = sleepScore + response.q4 + response.q5 + appetiteScore + 
    weightScore + response.q10 + response.q11 + response.q12 + 
    response.q13 + response.q14 + psychomotorScore;

  let interpretation = '';
  if (totalScore <= 5) interpretation = 'Pas de dépression';
  else if (totalScore <= 10) interpretation = 'Dépression légère';
  else if (totalScore <= 15) interpretation = 'Dépression modérée';
  else if (totalScore <= 20) interpretation = 'Dépression sévère';
  else interpretation = 'Dépression très sévère';

  const { data, error } = await supabase
    .from('responses_qids_sr16')
    .upsert({
      ...response,
      total_score: totalScore,
      interpretation
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// MDQ
// ============================================================================

export async function getMdqResponse(
  visitId: string
): Promise<MdqResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_mdq')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveMdqResponse(
  response: MdqResponseInsert
): Promise<MdqResponse> {
  const supabase = await createClient();

  // Calculate MDQ score
  const q1Score = (response.q1_1 || 0) + (response.q1_2 || 0) + (response.q1_3 || 0) + 
    (response.q1_4 || 0) + (response.q1_5 || 0) + (response.q1_6 || 0) + 
    (response.q1_7 || 0) + (response.q1_8 || 0) + (response.q1_9 || 0) + 
    (response.q1_10 || 0) + (response.q1_11 || 0) + (response.q1_12 || 0) + 
    (response.q1_13 || 0);

  const isPositive = q1Score >= 7 && response.q2 === 1 && (response.q3 !== null && response.q3 >= 2);
  const interpretation = isPositive ? 
    'Dépistage positif pour trouble bipolaire' : 
    'Dépistage négatif pour trouble bipolaire';

  const { data, error } = await supabase
    .from('responses_mdq')
    .upsert({
      ...response,
      q1_score: q1Score,
      interpretation
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Bipolar Diagnostic (EBIP_SCR_DIAG) - Medical Diagnostic Form
// ============================================================================

export async function getDiagnosticResponse(
  visitId: string
): Promise<BipolarDiagnosticResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_medical_diagnostic')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveDiagnosticResponse(
  response: BipolarDiagnosticResponseInsert
): Promise<BipolarDiagnosticResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('responses_medical_diagnostic')
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
// Bipolar Orientation (EBIP_SCR_ORIENT) - Specific to Bipolar Disorder
// ============================================================================

export async function getOrientationResponse(
  visitId: string
): Promise<OrientationResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_bipolar_orientation')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveOrientationResponse(
  response: OrientationResponseInsert
): Promise<OrientationResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('responses_bipolar_orientation')
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
// Pending Questionnaires
// ============================================================================

export async function getPendingQuestionnaires(patientId: string) {
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
    getAsrmResponse(visit.id),
    getQidsResponse(visit.id),
    getMdqResponse(visit.id)
  ]);

  const pending = [];
  if (!asrm) pending.push({
    id: 'ASRM_FR',
    title: 'Auto-Questionnaire Altman (ASRM)',
    description: "Échelle d'Auto-Évaluation de la Manie",
    estimatedTime: 5
  });
  if (!qids) pending.push({
    id: 'QIDS_SR16_FR',
    title: 'QIDS-SR16',
    description: 'Auto-questionnaire sur les symptômes de la dépression',
    estimatedTime: 10
  });
  if (!mdq) pending.push({
    id: 'MDQ_FR',
    title: 'MDQ - Questionnaire des Troubles de l\'Humeur',
    description: 'Outil de dépistage du trouble bipolaire',
    estimatedTime: 5
  });

  return pending;
}