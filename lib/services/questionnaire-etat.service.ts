// eFondaMental Platform - Questionnaire Service (ETAT Section Continued)
// PSQI and Epworth functions

import { createClient } from '@/lib/supabase/server';
import {
  PsqiResponse,
  PsqiResponseInsert,
  EpworthResponse,
  EpworthResponseInsert
} from '@/lib/types/database.types';

// PSQI
export async function getPsqiResponse(
  visitId: string
): Promise<PsqiResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_psqi')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

// Helper to convert HH:MM to decimal hours
function parseHHMMToHours(timeStr: string | null | undefined): number {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return 0;
  return hours + (minutes / 60);
}

export async function savePsqiResponse(
  response: PsqiResponseInsert
): Promise<PsqiResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Parse hours sleep from HH:MM
  const decimalHoursSleep = parseHHMMToHours(response.q4_hours_sleep);

  // Calculate 7 component scores
  // Component 1: Subjective sleep quality
  const c1SubjectiveQuality = response.q6 ?? 0;

  // Component 2: Sleep latency
  let c2Latency = 0;
  if (response.q2_minutes_to_sleep !== undefined && response.q2_minutes_to_sleep !== null) {
    if (response.q2_minutes_to_sleep <= 15) c2Latency = 0;
    else if (response.q2_minutes_to_sleep <= 30) c2Latency = 1;
    else if (response.q2_minutes_to_sleep <= 60) c2Latency = 2;
    else c2Latency = 3;
  }
  c2Latency += (response.q5a ?? 0);
  c2Latency = Math.min(3, Math.floor(c2Latency / 2));

  // Component 3: Sleep duration
  let c3Duration = 0;
  if (decimalHoursSleep > 7) c3Duration = 0;
  else if (decimalHoursSleep >= 6) c3Duration = 1;
  else if (decimalHoursSleep >= 5) c3Duration = 2;
  else c3Duration = 3;

  // Component 4: Sleep efficiency
  let timeInBedHours = 0;
  let sleepEfficiencyPct = 0;
  let c4Efficiency = 0;
  
  if (response.q1_bedtime && response.q3_waketime && response.q4_hours_sleep) {
    // Calculate time in bed (simplified - assumes same day or next day)
    const bedtime = new Date(`2000-01-01 ${response.q1_bedtime}`);
    const waketime = new Date(`2000-01-01 ${response.q3_waketime}`);
    if (waketime < bedtime) {
      waketime.setDate(waketime.getDate() + 1);
    }
    timeInBedHours = (waketime.getTime() - bedtime.getTime()) / (1000 * 60 * 60);
    
    if (timeInBedHours > 0) {
      sleepEfficiencyPct = (decimalHoursSleep / timeInBedHours) * 100;
      if (sleepEfficiencyPct >= 85) c4Efficiency = 0;
      else if (sleepEfficiencyPct >= 75) c4Efficiency = 1;
      else if (sleepEfficiencyPct >= 65) c4Efficiency = 2;
      else c4Efficiency = 3;
    }
  }

  // Component 5: Sleep disturbances
  const disturbanceSum = (response.q5b ?? 0) + (response.q5c ?? 0) + (response.q5d ?? 0) +
                        (response.q5e ?? 0) + (response.q5f ?? 0) + (response.q5g ?? 0) +
                        (response.q5h ?? 0) + (response.q5i ?? 0) + (response.q5j ?? 0);
  let c5Disturbances = 0;
  if (disturbanceSum === 0) c5Disturbances = 0;
  else if (disturbanceSum <= 9) c5Disturbances = 1;
  else if (disturbanceSum <= 18) c5Disturbances = 2;
  else c5Disturbances = 3;

  // Component 6: Use of sleep medication
  const c6Medication = response.q7 ?? 0;

  // Component 7: Daytime dysfunction
  const c7DaytimeDysfunction = Math.min(3, Math.floor(((response.q8 ?? 0) + (response.q9 ?? 0)) / 2));

  // Total PSQI score
  const totalScore = c1SubjectiveQuality + c2Latency + c3Duration + c4Efficiency +
                     c5Disturbances + c6Medication + c7DaytimeDysfunction;

  let interpretation = '';
  if (totalScore <= 5) {
    interpretation = 'Bon dormeur';
  } else {
    interpretation = 'Mauvais dormeur';
  }

  // Filter out any metadata/extra fields that don't belong in the DB
  const { 
    psqi_scores_section, 
    emotions_section, 
    subscore_emotion, 
    subscore_motivation, 
    subscore_perception, 
    subscore_interaction, 
    subscore_cognition,
    ...dbResponse 
  } = response as any;

  const { data, error } = await supabase
    .from('responses_psqi')
    .upsert({
      ...dbResponse,
      c1_subjective_quality: c1SubjectiveQuality,
      c2_latency: c2Latency,
      c3_duration: c3Duration,
      c4_efficiency: c4Efficiency,
      c5_disturbances: c5Disturbances,
      c6_medication: c6Medication,
      c7_daytime_dysfunction: c7DaytimeDysfunction,
      time_in_bed_hours: Number(timeInBedHours.toFixed(1)),
      sleep_efficiency_pct: Number(sleepEfficiencyPct.toFixed(2)),
      total_score: totalScore,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Epworth
export async function getEpworthResponse(
  visitId: string
): Promise<EpworthResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_epworth')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveEpworthResponse(
  response: EpworthResponseInsert
): Promise<EpworthResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Remove total_score if present (it's a generated column)
  const { total_score, ...responseWithoutGeneratedFields } = response as any;

  // Total score is computed by database (generated column)
  // But we calculate severity here
  const totalScore = responseWithoutGeneratedFields.q1 + responseWithoutGeneratedFields.q2 + responseWithoutGeneratedFields.q3 + responseWithoutGeneratedFields.q4 +
                     responseWithoutGeneratedFields.q5 + responseWithoutGeneratedFields.q6 + responseWithoutGeneratedFields.q7 + responseWithoutGeneratedFields.q8;

  let severity = '';
  let interpretation = '';
  if (totalScore < 8) {
    severity = 'normal';
    interpretation = 'Somnolence normale';
  } else if (totalScore <= 10) {
    severity = 'mild';
    interpretation = 'Somnolence diurne excessive légère';
  } else if (totalScore <= 15) {
    severity = 'moderate';
    interpretation = 'Somnolence diurne excessive modérée';
  } else {
    severity = 'severe';
    interpretation = 'Somnolence diurne excessive sévère';
  }

  let clinicalContext = '';
  if (responseWithoutGeneratedFields.q9 !== undefined && responseWithoutGeneratedFields.q9 !== null) {
    const contexts = [
      'seulement après les repas',
      'à certaines heures du jour, toujours les mêmes',
      'la nuit',
      "n'importe quelle heure du jour"
    ];
    clinicalContext = contexts[responseWithoutGeneratedFields.q9] || '';
  }

  const { data, error } = await supabase
    .from('responses_epworth')
    .upsert({
      ...responseWithoutGeneratedFields,
      severity,
      clinical_context: clinicalContext,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}
