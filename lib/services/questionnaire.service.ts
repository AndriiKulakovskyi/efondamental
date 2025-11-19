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

// ============================================================================
// Initial Evaluation Questionnaires - ETAT Section
// ============================================================================

// EQ-5D-5L
export async function getEq5d5lResponse(
  visitId: string
): Promise<Eq5d5lResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_eq5d5l')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveEq5d5lResponse(
  response: Eq5d5lResponseInsert
): Promise<Eq5d5lResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate index value (simplified - in production would use crosswalk table)
  const dimensions = [
    response.mobility,
    response.self_care,
    response.usual_activities,
    response.pain_discomfort,
    response.anxiety_depression
  ];
  
  // Simple calculation: 1 - ((sum of levels - 5) / 20)
  const sumLevels = dimensions.reduce((sum, level) => sum + level, 0);
  const indexValue = Math.max(0, 1 - ((sumLevels - 5) / 20));

  const { data, error } = await supabase
    .from('responses_eq5d5l')
    .upsert({
      ...response,
      index_value: Number(indexValue.toFixed(3)),
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// PRISE-M
export async function getPriseMResponse(
  visitId: string
): Promise<PriseMResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_prise_m')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function savePriseMResponse(
  response: PriseMResponseInsert
): Promise<PriseMResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate section scores
  const gastroScore = (response.q1 ?? 0) + (response.q2 ?? 0) + (response.q3 ?? 0) + (response.q4 ?? 0);
  const cardiacScore = (response.q5 ?? 0) + (response.q6 ?? 0) + (response.q7 ?? 0);
  const skinScore = (response.q8 ?? 0) + (response.q9 ?? 0) + (response.q10 ?? 0);
  const neuroScore = (response.q11 ?? 0) + (response.q12 ?? 0) + (response.q13 ?? 0) + (response.q14 ?? 0);
  const visionHearingScore = (response.q15 ?? 0) + (response.q16 ?? 0);
  const sleepScore = (response.q21 ?? 0) + (response.q22 ?? 0);
  const otherScore = (response.q26 ?? 0) + (response.q27 ?? 0) + (response.q28 ?? 0) + 
                     (response.q29 ?? 0) + (response.q30 ?? 0) + (response.q31 ?? 0) + (response.q32 ?? 0);

  // Gender-specific scoring
  let urogenitalScore = (response.q17 ?? 0) + (response.q18 ?? 0) + (response.q19 ?? 0);
  let sexualScore = (response.q23 ?? 0) + (response.q24 ?? 0);
  let itemsScored = 31; // Default excluding one gender-specific item

  if (response.gender === 'F') {
    urogenitalScore += (response.q20 ?? 0);
    itemsScored = response.q20 !== null && response.q20 !== undefined ? 32 : 31;
  } else if (response.gender === 'M') {
    sexualScore += (response.q25 ?? 0);
    itemsScored = response.q25 !== null && response.q25 !== undefined ? 32 : 31;
  }

  const totalScore = gastroScore + cardiacScore + skinScore + neuroScore + 
                     visionHearingScore + urogenitalScore + sleepScore + 
                     sexualScore + otherScore;

  const { data, error } = await supabase
    .from('responses_prise_m')
    .upsert({
      ...response,
      gastro_score: gastroScore,
      cardiac_score: cardiacScore,
      skin_score: skinScore,
      neuro_score: neuroScore,
      vision_hearing_score: visionHearingScore,
      urogenital_score: urogenitalScore,
      sleep_score: sleepScore,
      sexual_score: sexualScore,
      other_score: otherScore,
      total_score: totalScore,
      items_scored: itemsScored,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// STAI-YA
export async function getStaiYaResponse(
  visitId: string
): Promise<StaiYaResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_stai_ya')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveStaiYaResponse(
  response: StaiYaResponseInsert
): Promise<StaiYaResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Reverse score items: 1, 2, 5, 8, 10, 11, 15, 16, 19, 20
  const reverseItems = [1, 2, 5, 8, 10, 11, 15, 16, 19, 20];
  let totalScore = 0;

  for (let i = 1; i <= 20; i++) {
    const value = response[`q${i}` as keyof StaiYaResponseInsert] as number;
    if (reverseItems.includes(i)) {
      totalScore += (5 - value);
    } else {
      totalScore += value;
    }
  }

  let anxietyLevel = '';
  let interpretation = '';
  if (totalScore <= 35) {
    anxietyLevel = 'low';
    interpretation = 'Anxiété faible';
  } else if (totalScore <= 45) {
    anxietyLevel = 'moderate';
    interpretation = 'Anxiété modérée';
  } else if (totalScore <= 55) {
    anxietyLevel = 'high';
    interpretation = 'Anxiété élevée';
  } else {
    anxietyLevel = 'very_high';
    interpretation = 'Anxiété très élevée';
  }

  const { data, error } = await supabase
    .from('responses_stai_ya')
    .upsert({
      ...response,
      total_score: totalScore,
      anxiety_level: anxietyLevel,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// MARS
export async function getMarsResponse(
  visitId: string
): Promise<MarsResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_mars')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveMarsResponse(
  response: MarsResponseInsert
): Promise<MarsResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // MARS scoring: items 7,8 are positive (YES=1), others are negative (NO=1)
  const positiveItems = [7, 8];
  let totalScore = 0;

  for (let i = 1; i <= 10; i++) {
    const value = response[`q${i}` as keyof MarsResponseInsert] as number;
    if (positiveItems.includes(i)) {
      totalScore += value; // YES=1, NO=0
    } else {
      totalScore += (1 - value); // NO=1, YES=0
    }
  }

  const interpretation = totalScore >= 7 ? 'Bonne adhérence' : 'Adhérence insuffisante';

  const { data, error } = await supabase
    .from('responses_mars')
    .upsert({
      ...response,
      total_score: totalScore,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// MAThyS
export async function getMathysResponse(
  visitId: string
): Promise<MathysResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_mathys')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveMathysResponse(
  response: MathysResponseInsert
): Promise<MathysResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Reverse score items: 5, 6, 7, 8, 9, 10, 17, 18
  const reverseItems = [5, 6, 7, 8, 9, 10, 17, 18];
  
  // Calculate subscales
  let emotionalHyperreactivity = 0;
  let emotionalHyporeactivity = 0;
  let cognitiveSpeed = 0;
  let motorActivity = 0;
  let motivation = 0;
  
  // Apply reverse scoring and calculate subscales
  const processedScores: Record<number, number> = {};
  for (let i = 1; i <= 20; i++) {
    let value = response[`q${i}` as keyof MathysResponseInsert] as number;
    if (reverseItems.includes(i)) {
      value = 10 - value;
    }
    processedScores[i] = value;
  }
  
  // Subscale mappings (from Python implementation)
  emotionalHyperreactivity = (processedScores[1] + processedScores[3] + 
                              processedScores[11] + processedScores[13] + processedScores[16]) / 5;
  emotionalHyporeactivity = (processedScores[2] + processedScores[4] + 
                             processedScores[12] + processedScores[14] + processedScores[19]) / 5;
  cognitiveSpeed = (processedScores[5] + processedScores[8] + processedScores[15]) / 3;
  motorActivity = (processedScores[6] + processedScores[7] + processedScores[18]) / 3;
  motivation = (processedScores[9] + processedScores[10] + processedScores[17] + processedScores[20]) / 4;
  
  const totalScore = (emotionalHyperreactivity + emotionalHyporeactivity + 
                      cognitiveSpeed + motorActivity + motivation) / 5;
  
  let interpretation = `Score total: ${totalScore.toFixed(2)}/10. `;
  if (totalScore >= 7) {
    interpretation += 'État thymique très élevé.';
  } else if (totalScore >= 5) {
    interpretation += 'État thymique modérément élevé.';
  } else if (totalScore >= 3) {
    interpretation += 'État thymique normal.';
  } else {
    interpretation += 'État thymique bas.';
  }

  const { data, error } = await supabase
    .from('responses_mathys')
    .upsert({
      ...response,
      emotional_hyperreactivity: Number(emotionalHyperreactivity.toFixed(2)),
      emotional_hyporeactivity: Number(emotionalHyporeactivity.toFixed(2)),
      cognitive_speed: Number(cognitiveSpeed.toFixed(2)),
      motor_activity: Number(motorActivity.toFixed(2)),
      motivation: Number(motivation.toFixed(2)),
      total_score: Number(totalScore.toFixed(2)),
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Export functions from other service files
// ============================================================================

// Export remaining ETAT questionnaires
export {
  getPsqiResponse,
  savePsqiResponse,
  getEpworthResponse,
  saveEpworthResponse
} from './questionnaire-etat.service';

// Export TRAITS questionnaires  
export {
  getAsrsResponse,
  saveAsrsResponse,
  getCtqResponse,
  saveCtqResponse,
  getBis10Response,
  saveBis10Response,
  getAls18Response,
  saveAls18Response,
  getAimResponse,
  saveAimResponse,
  getWurs25Response,
  saveWurs25Response,
  getAq12Response,
  saveAq12Response,
  getCsmResponse,
  saveCsmResponse,
  getCtiResponse,
  saveCtiResponse
} from './questionnaire-traits.service';