// eFondaMental Platform - Evaluation Service

import { createClient } from '../supabase/server';

// ============================================================================
// EVALUATION QUERIES
// ============================================================================

export interface EvaluationSummary {
  id: string;
  patient_id: string;
  visit_id: string | null;
  evaluation_date: string;
  evaluator_id: string;
  evaluator_name: string;
  visit_type: string | null;
  mood_score: number | null;
  risk_assessment: {
    suicide_risk?: 'none' | 'low' | 'moderate' | 'high';
    relapse_risk?: 'none' | 'low' | 'moderate' | 'high';
  } | null;
  medication_adherence: number | null;
  notes: string | null;
}

export async function getEvaluationsByPatient(
  patientId: string
): Promise<EvaluationSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('evaluations')
    .select(`
      *,
      evaluator:user_profiles!evaluations_evaluator_id_fkey(first_name, last_name),
      visit:visits(visit_type)
    `)
    .eq('patient_id', patientId)
    .order('evaluation_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch evaluations: ${error.message}`);
  }

  return (data || []).map((eval: any) => ({
    id: eval.id,
    patient_id: eval.patient_id,
    visit_id: eval.visit_id,
    evaluation_date: eval.evaluation_date,
    evaluator_id: eval.evaluator_id,
    evaluator_name: eval.evaluator
      ? `${eval.evaluator.first_name} ${eval.evaluator.last_name}`
      : 'Unknown',
    visit_type: eval.visit?.visit_type || null,
    mood_score: eval.mood_score,
    risk_assessment: eval.risk_assessment,
    medication_adherence: eval.medication_adherence,
    notes: eval.notes,
  }));
}

export async function getEvaluationById(evaluationId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('evaluations')
    .select(`
      *,
      evaluator:user_profiles!evaluations_evaluator_id_fkey(first_name, last_name),
      visit:visits(visit_type, template_name:visit_templates(name))
    `)
    .eq('id', evaluationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch evaluation: ${error.message}`);
  }

  return data;
}

// ============================================================================
// EVALUATION ANALYTICS
// ============================================================================

export interface MoodTrendData {
  date: string;
  mood_score: number;
  source: 'clinical' | 'self_reported';
}

export async function getMoodTrend(
  patientId: string,
  fromDate?: string,
  toDate?: string
): Promise<MoodTrendData[]> {
  const supabase = await createClient();

  let query = supabase
    .from('evaluations')
    .select('evaluation_date, mood_score, evaluator_id')
    .eq('patient_id', patientId)
    .not('mood_score', 'is', null)
    .order('evaluation_date', { ascending: true });

  if (fromDate) {
    query = query.gte('evaluation_date', fromDate);
  }

  if (toDate) {
    query = query.lte('evaluation_date', toDate);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch mood trend: ${error.message}`);
  }

  return (data || []).map((item) => ({
    date: item.evaluation_date,
    mood_score: item.mood_score!,
    source: 'clinical' as const,
  }));
}

export interface RiskHistoryData {
  date: string;
  suicide_risk: 'none' | 'low' | 'moderate' | 'high';
  relapse_risk: 'none' | 'low' | 'moderate' | 'high';
}

export async function getRiskHistory(
  patientId: string,
  fromDate?: string,
  toDate?: string
): Promise<RiskHistoryData[]> {
  const supabase = await createClient();

  let query = supabase
    .from('evaluations')
    .select('evaluation_date, risk_assessment')
    .eq('patient_id', patientId)
    .not('risk_assessment', 'is', null)
    .order('evaluation_date', { ascending: true });

  if (fromDate) {
    query = query.gte('evaluation_date', fromDate);
  }

  if (toDate) {
    query = query.lte('evaluation_date', toDate);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch risk history: ${error.message}`);
  }

  return (data || [])
    .filter((item) => item.risk_assessment)
    .map((item) => ({
      date: item.evaluation_date,
      suicide_risk: item.risk_assessment.suicide_risk || 'none',
      relapse_risk: item.risk_assessment.relapse_risk || 'none',
    }));
}

export interface AdherenceTrendData {
  date: string;
  adherence: number;
}

export async function getMedicationAdherenceTrend(
  patientId: string,
  fromDate?: string,
  toDate?: string
): Promise<AdherenceTrendData[]> {
  const supabase = await createClient();

  let query = supabase
    .from('evaluations')
    .select('evaluation_date, medication_adherence')
    .eq('patient_id', patientId)
    .not('medication_adherence', 'is', null)
    .order('evaluation_date', { ascending: true });

  if (fromDate) {
    query = query.gte('evaluation_date', fromDate);
  }

  if (toDate) {
    query = query.lte('evaluation_date', toDate);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch adherence trend: ${error.message}`);
  }

  return (data || []).map((item) => ({
    date: item.evaluation_date,
    adherence: item.medication_adherence!,
  }));
}

// ============================================================================
// EVALUATION STATISTICS
// ============================================================================

export interface EvaluationStats {
  totalEvaluations: number;
  latestMoodScore: number | null;
  averageMoodScore: number | null;
  currentRiskLevel: 'none' | 'low' | 'moderate' | 'high';
  adherenceRate: number | null;
}

export async function getPatientEvaluationStats(
  patientId: string
): Promise<EvaluationStats> {
  const supabase = await createClient();

  // Get total evaluations
  const { count: totalEvaluations } = await supabase
    .from('evaluations')
    .select('*', { count: 'exact', head: true })
    .eq('patient_id', patientId);

  // Get latest evaluation
  const { data: latestEval } = await supabase
    .from('evaluations')
    .select('mood_score, risk_assessment, medication_adherence')
    .eq('patient_id', patientId)
    .order('evaluation_date', { ascending: false })
    .limit(1)
    .single();

  // Get average mood score
  const { data: moodData } = await supabase
    .from('evaluations')
    .select('mood_score')
    .eq('patient_id', patientId)
    .not('mood_score', 'is', null);

  const averageMoodScore =
    moodData && moodData.length > 0
      ? moodData.reduce((sum, item) => sum + (item.mood_score || 0), 0) / moodData.length
      : null;

  // Determine current risk level
  let currentRiskLevel: 'none' | 'low' | 'moderate' | 'high' = 'none';
  if (latestEval?.risk_assessment) {
    const { suicide_risk, relapse_risk } = latestEval.risk_assessment;
    const risks = [suicide_risk, relapse_risk].filter(Boolean);
    if (risks.includes('high')) currentRiskLevel = 'high';
    else if (risks.includes('moderate')) currentRiskLevel = 'moderate';
    else if (risks.includes('low')) currentRiskLevel = 'low';
  }

  // Get adherence rate (average)
  const { data: adherenceData } = await supabase
    .from('evaluations')
    .select('medication_adherence')
    .eq('patient_id', patientId)
    .not('medication_adherence', 'is', null);

  const adherenceRate =
    adherenceData && adherenceData.length > 0
      ? adherenceData.reduce((sum, item) => sum + (item.medication_adherence || 0), 0) / adherenceData.length
      : null;

  return {
    totalEvaluations: totalEvaluations || 0,
    latestMoodScore: latestEval?.mood_score || null,
    averageMoodScore,
    currentRiskLevel,
    adherenceRate,
  };
}

