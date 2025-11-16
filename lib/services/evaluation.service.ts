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
  diagnosis: string | null;
  clinical_notes: string | null;
  risk_assessment: {
    suicide_risk?: 'none' | 'low' | 'moderate' | 'high';
    relapse_risk?: 'none' | 'low' | 'moderate' | 'high';
  } | null;
  treatment_plan: string | null;
  mood_score: number | null;
  medication_adherence: number | null;
  notes: string | null;
}

export async function getEvaluationsByPatient(
  patientId: string
): Promise<EvaluationSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('patient_id', patientId)
    .order('evaluation_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch evaluations: ${error.message}`);
  }

  // Fetch evaluator and visit info separately for each evaluation
  const evaluationsWithDetails = await Promise.all(
    (data || []).map(async (evaluation: any) => {
      // Get evaluator info
      let evaluatorName = 'Unknown';
      if (evaluation.evaluator_id) {
        const { data: evaluator } = await supabase
          .from('user_profiles')
          .select('first_name, last_name')
          .eq('id', evaluation.evaluator_id)
          .single();
        
        if (evaluator) {
          evaluatorName = `${evaluator.first_name} ${evaluator.last_name}`;
        }
      }

      // Get visit type
      let visitType = null;
      if (evaluation.visit_id) {
        const { data: visit } = await supabase
          .from('visits')
          .select('visit_type')
          .eq('id', evaluation.visit_id)
          .single();
        
        if (visit) {
          visitType = visit.visit_type;
        }
      }

      // Extract mood_score and medication_adherence from metadata
      const moodScore = evaluation.metadata && typeof evaluation.metadata === 'object' && 'mood_score' in evaluation.metadata
        ? (evaluation.metadata as any).mood_score
        : null;
      
      const medicationAdherence = evaluation.metadata && typeof evaluation.metadata === 'object' && 'medication_adherence' in evaluation.metadata
        ? (evaluation.metadata as any).medication_adherence
        : null;

      return {
        id: evaluation.id,
        patient_id: evaluation.patient_id,
        visit_id: evaluation.visit_id,
        evaluation_date: evaluation.evaluation_date,
        evaluator_id: evaluation.evaluator_id,
        evaluator_name: evaluatorName,
        visit_type: visitType,
        diagnosis: evaluation.diagnosis,
        clinical_notes: evaluation.clinical_notes,
        risk_assessment: evaluation.risk_assessment,
        treatment_plan: evaluation.treatment_plan,
        mood_score: moodScore,
        medication_adherence: medicationAdherence,
        notes: evaluation.clinical_notes, // Use clinical_notes as notes
      };
    })
  );

  return evaluationsWithDetails;
}

export async function getEvaluationById(evaluationId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('id', evaluationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch evaluation: ${error.message}`);
  }

  if (!data) return null;

  // Fetch related data separately
  let evaluatorName = 'Unknown';
  if (data.evaluator_id) {
    const { data: evaluator } = await supabase
      .from('user_profiles')
      .select('first_name, last_name')
      .eq('id', data.evaluator_id)
      .single();
    
    if (evaluator) {
      evaluatorName = `${evaluator.first_name} ${evaluator.last_name}`;
    }
  }

  let visitType = null;
  let templateName = null;
  if (data.visit_id) {
    const { data: visit } = await supabase
      .from('visits')
      .select('visit_type, visit_template:visit_templates(name)')
      .eq('id', data.visit_id)
      .single();
    
    if (visit) {
      visitType = visit.visit_type;
      templateName = (visit.visit_template as any)?.name;
    }
  }

  return {
    ...data,
    evaluator_name: evaluatorName,
    visit_type: visitType,
    template_name: templateName,
  };
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
    .select('evaluation_date, metadata')
    .eq('patient_id', patientId)
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

  // Extract mood_score from metadata if available
  return (data || [])
    .filter((item) => item.metadata && typeof item.metadata === 'object' && 'mood_score' in item.metadata)
    .map((item) => ({
      date: item.evaluation_date,
      mood_score: (item.metadata as any).mood_score,
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
    .select('evaluation_date, metadata')
    .eq('patient_id', patientId)
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

  // Extract medication_adherence from metadata if available
  return (data || [])
    .filter((item) => item.metadata && typeof item.metadata === 'object' && 'medication_adherence' in item.metadata)
    .map((item) => ({
      date: item.evaluation_date,
      adherence: (item.metadata as any).medication_adherence,
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
    .select('metadata, risk_assessment')
    .eq('patient_id', patientId)
    .order('evaluation_date', { ascending: false })
    .limit(1)
    .single();

  // Get all evaluations with metadata
  const { data: allEvals } = await supabase
    .from('evaluations')
    .select('metadata')
    .eq('patient_id', patientId);

  // Extract mood scores from metadata
  const moodScores = (allEvals || [])
    .filter((item) => item.metadata && typeof item.metadata === 'object' && 'mood_score' in item.metadata)
    .map((item) => (item.metadata as any).mood_score);

  const averageMoodScore =
    moodScores.length > 0
      ? moodScores.reduce((sum: number, score: number) => sum + score, 0) / moodScores.length
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

  // Extract adherence from metadata
  const adherenceScores = (allEvals || [])
    .filter((item) => item.metadata && typeof item.metadata === 'object' && 'medication_adherence' in item.metadata)
    .map((item) => (item.metadata as any).medication_adherence);

  const adherenceRate =
    adherenceScores.length > 0
      ? adherenceScores.reduce((sum: number, score: number) => sum + score, 0) / adherenceScores.length
      : null;

  const latestMoodScore = 
    latestEval?.metadata && typeof latestEval.metadata === 'object' && 'mood_score' in latestEval.metadata
      ? (latestEval.metadata as any).mood_score
      : null;

  return {
    totalEvaluations: totalEvaluations || 0,
    latestMoodScore,
    averageMoodScore,
    currentRiskLevel,
    adherenceRate,
  };
}

