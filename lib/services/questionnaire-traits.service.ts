// eFondaMental Platform - Questionnaire Service (TRAITS Section)
// Service functions for TRAITS questionnaires

import { createClient } from '@/lib/supabase/server';
import {
  // Initial Evaluation - TRAITS
  AsrsResponse,
  AsrsResponseInsert,
  CtqResponse,
  CtqResponseInsert,
  Bis10Response,
  Bis10ResponseInsert,
  Als18Response,
  Als18ResponseInsert,
  AimResponse,
  AimResponseInsert,
  Wurs25Response,
  Wurs25ResponseInsert,
  Aq12Response,
  Aq12ResponseInsert,
  CsmResponse,
  CsmResponseInsert,
  CtiResponse,
  CtiResponseInsert
} from '@/lib/types/database.types';

// ============================================================================
// Initial Evaluation Questionnaires - TRAITS Section
// ============================================================================

// ASRS
export async function getAsrsResponse(
  visitId: string
): Promise<AsrsResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_asrs')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveAsrsResponse(
  response: AsrsResponseInsert
): Promise<AsrsResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Part A thresholds: items 1-3: >=2, items 4-6: >=3
  const partAThresholds = { a1: 2, a2: 2, a3: 2, a4: 3, a5: 3, a6: 3 };
  let partAPositiveItems = 0;

  // Check Part A items against thresholds
  for (let i = 1; i <= 6; i++) {
    const key = `a${i}` as keyof AsrsResponseInsert;
    const value = response[key] as number;
    const threshold = partAThresholds[key as keyof typeof partAThresholds];
    if (value >= threshold) {
      partAPositiveItems++;
    }
  }

  const screeningPositive = partAPositiveItems >= 4;

  // Calculate total score (all 18 items)
  let totalScore = 0;
  for (let i = 1; i <= 6; i++) {
    totalScore += response[`a${i}` as keyof AsrsResponseInsert] as number;
  }
  for (let i = 7; i <= 18; i++) {
    totalScore += response[`b${i}` as keyof AsrsResponseInsert] as number;
  }

  const interpretation = screeningPositive
    ? `Dépistage POSITIF (${partAPositiveItems}/6 items Part A ≥ seuil). Score total: ${totalScore}/72.`
    : `Dépistage négatif. Score total: ${totalScore}/72.`;

  const { data, error } = await supabase
    .from('responses_asrs')
    .upsert({
      ...response,
      part_a_positive_items: partAPositiveItems,
      screening_positive: screeningPositive,
      total_score: totalScore,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// CTQ
export async function getCtqResponse(
  visitId: string
): Promise<CtqResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_ctq')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveCtqResponse(
  response: CtqResponseInsert
): Promise<CtqResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Reverse score items: 2, 5, 7, 13, 19, 26, 28
  const reverseItems = [2, 5, 7, 13, 19, 26, 28];
  const scores: Record<number, number> = {};

  // Process all items with reverse scoring
  for (let i = 1; i <= 28; i++) {
    const value = response[`q${i}` as keyof CtqResponseInsert] as number;
    scores[i] = reverseItems.includes(i) ? (6 - value) : value;
  }

  // Calculate subscale scores
  const emotionalAbuseScore = scores[3] + scores[8] + scores[14] + scores[18] + scores[25];
  const physicalAbuseScore = scores[9] + scores[11] + scores[12] + scores[15] + scores[17];
  const sexualAbuseScore = scores[20] + scores[21] + scores[23] + scores[24] + scores[27];
  const emotionalNeglectScore = scores[5] + scores[7] + scores[13] + scores[19] + scores[28];
  const physicalNeglectScore = scores[1] + scores[2] + scores[4] + scores[6] + scores[26];
  
  // Calculate denial score - count items with value 5 (Très souvent)
  const rawQ10 = response.q10 as number;
  const rawQ16 = response.q16 as number;
  const rawQ22 = response.q22 as number;
  const denialScore = (rawQ10 === 5 ? 1 : 0) + (rawQ16 === 5 ? 1 : 0) + (rawQ22 === 5 ? 1 : 0);

  // Determine severity levels with corrected thresholds
  const getSeverity = (score: number, type: string): string => {
    const thresholds: Record<string, number[]> = {
      emotional_abuse: [9, 13, 16],      // <9=none, 9-12=low, 13-15=moderate, >15=severe
      physical_abuse: [8, 10, 13],       // <8=none, 8-9=low, 10-12=moderate, >12=severe
      sexual_abuse: [6, 8, 13],          // <6=none, 6-7=low, 8-12=moderate, >12=severe
      emotional_neglect: [10, 15, 18],   // <10=none, 10-14=low, 15-17=moderate, >17=severe
      physical_neglect: [8, 10, 13]      // <8=none, 8-9=low, 10-12=moderate, >12=severe
    };
    
    const t = thresholds[type];
    if (!t) return 'unknown';
    
    if (score < t[0]) return 'no_trauma';
    if (score < t[1]) return 'low';
    if (score < t[2]) return 'moderate';
    return 'severe';
  };

  const totalScore = emotionalAbuseScore + physicalAbuseScore + sexualAbuseScore +
                     emotionalNeglectScore + physicalNeglectScore;

  // Build detailed interpretation
  const severities = {
    ea: getSeverity(emotionalAbuseScore, 'emotional_abuse'),
    pa: getSeverity(physicalAbuseScore, 'physical_abuse'),
    sa: getSeverity(sexualAbuseScore, 'sexual_abuse'),
    en: getSeverity(emotionalNeglectScore, 'emotional_neglect'),
    pn: getSeverity(physicalNeglectScore, 'physical_neglect')
  };

  const interpretation = `Score total: ${totalScore}/125. ` +
    `Abus émotionnel: ${emotionalAbuseScore}/25 (${severities.ea}), ` +
    `Abus physique: ${physicalAbuseScore}/25 (${severities.pa}), ` +
    `Abus sexuel: ${sexualAbuseScore}/25 (${severities.sa}), ` +
    `Négligence émotionnelle: ${emotionalNeglectScore}/25 (${severities.en}), ` +
    `Négligence physique: ${physicalNeglectScore}/25 (${severities.pn}). ` +
    `Déni/Minimisation: ${denialScore}/3${denialScore > 0 ? ' (présent - interpréter avec prudence)' : ''}.`;

  const { data, error } = await supabase
    .from('responses_ctq')
    .upsert({
      ...response,
      emotional_abuse_score: emotionalAbuseScore,
      emotional_abuse_severity: getSeverity(emotionalAbuseScore, 'emotional_abuse'),
      physical_abuse_score: physicalAbuseScore,
      physical_abuse_severity: getSeverity(physicalAbuseScore, 'physical_abuse'),
      sexual_abuse_score: sexualAbuseScore,
      sexual_abuse_severity: getSeverity(sexualAbuseScore, 'sexual_abuse'),
      emotional_neglect_score: emotionalNeglectScore,
      emotional_neglect_severity: getSeverity(emotionalNeglectScore, 'emotional_neglect'),
      physical_neglect_score: physicalNeglectScore,
      physical_neglect_severity: getSeverity(physicalNeglectScore, 'physical_neglect'),
      denial_score: denialScore,
      total_score: totalScore,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// BIS-10
export async function getBis10Response(
  visitId: string
): Promise<Bis10Response | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_bis10')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveBis10Response(
  response: Bis10ResponseInsert
): Promise<Bis10Response> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // BIS-10 uses items from BIS-11: 1, 6, 8, 9, 12, 14, 17, 20, 21, 23, 25, 28
  // Reverse score items: BIS-11 items 1, 8, 9, 12, 21 (which map to q1, q3, q4, q5, q9)
  const reverseItems = [1, 3, 4, 5, 9];
  const scores: Record<number, number> = {};

  // Process all items with reverse scoring
  // Reverse formula: 5 - value (converts 1→4, 2→3, 3→2, 4→1)
  for (let i = 1; i <= 12; i++) {
    const value = response[`q${i}` as keyof Bis10ResponseInsert] as number;
    scores[i] = reverseItems.includes(i) ? (5 - value) : value;
  }

  // Calculate subscale means
  // Cognitive Impulsivity (CI): BIS-11 items 1, 8, 9, 12, 21 → q1, q3, q4, q5, q9 (all reversed)
  const cognitiveImpulsivity = (scores[1] + scores[3] + scores[4] + scores[5] + scores[9]) / 5;

  // Motor Impulsivity (MI): BIS-11 items 6, 14, 17, 20, 23, 25, 28 → q2, q6, q7, q8, q10, q11, q12 (standard)
  const motorImpulsivity = (scores[2] + scores[6] + scores[7] + scores[8] + scores[10] + scores[11] + scores[12]) / 7;

  // General Impulsivity (GI): mean of the two subscale means
  const generalImpulsivity = (cognitiveImpulsivity + motorImpulsivity) / 2;

  // Build interpretation
  let interpretation = `Impulsivité générale: ${generalImpulsivity.toFixed(2)}/4.0. `;
  interpretation += `Impulsivité cognitive: ${cognitiveImpulsivity.toFixed(2)}/4.0. `;
  interpretation += `Impulsivité motrice: ${motorImpulsivity.toFixed(2)}/4.0. `;
  
  if (generalImpulsivity >= 3.0) {
    interpretation += 'Niveau d\'impulsivité élevé.';
  } else if (generalImpulsivity >= 2.5) {
    interpretation += 'Niveau d\'impulsivité modéré à élevé.';
  } else if (generalImpulsivity >= 2.0) {
    interpretation += 'Niveau d\'impulsivité modéré.';
  } else {
    interpretation += 'Niveau d\'impulsivité faible.';
  }

  const { data, error } = await supabase
    .from('responses_bis10')
    .upsert({
      ...response,
      cognitive_impulsivity_mean: Number(cognitiveImpulsivity.toFixed(2)),
      behavioral_impulsivity_mean: Number(motorImpulsivity.toFixed(2)), // Using behavioral field for motor impulsivity
      overall_impulsivity: Number(generalImpulsivity.toFixed(2)),
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ALS-18
export async function getAls18Response(
  visitId: string
): Promise<Als18Response | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_als18')
    .select('id, visit_id, patient_id, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, anxiety_depression_mean, depression_elation_mean, anger_mean, total_mean, interpretation, completed_by, completed_at, created_at, updated_at')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveAls18Response(
  response: Als18ResponseInsert
): Promise<Als18Response> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate subscale means
  // Anxiety-Depression: items 1, 3, 5, 6, 7
  const anxietyDepressionSum = response.q1 + response.q3 + response.q5 + response.q6 + response.q7;
  const anxietyDepressionMean = anxietyDepressionSum / 5;

  // Depression-Elation: items 2, 10, 12, 13, 15, 16, 17, 18
  const depressionElationSum = response.q2 + response.q10 + response.q12 + response.q13 +
                               response.q15 + response.q16 + response.q17 + response.q18;
  const depressionElationMean = depressionElationSum / 8;

  // Anger: items 4, 8, 9, 11, 14
  const angerSum = response.q4 + response.q8 + response.q9 + response.q11 + response.q14;
  const angerMean = angerSum / 5;

  // Total mean (all 18 items)
  const totalSum = anxietyDepressionSum + depressionElationSum + angerSum;
  const totalMean = totalSum / 18;

  const interpretation = `Labilité affective totale: ${totalMean.toFixed(2)}/3. ` +
    `Anxiété-Dépression: ${anxietyDepressionMean.toFixed(2)}, ` +
    `Dépression-Élation: ${depressionElationMean.toFixed(2)}, ` +
    `Colère: ${angerMean.toFixed(2)}.`;

  // Only insert the fields that actually exist in the database
  const { data, error } = await supabase
    .from('responses_als18')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
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
      q16: response.q16,
      q17: response.q17,
      q18: response.q18,
      anxiety_depression_mean: Number(anxietyDepressionMean.toFixed(2)),
      depression_elation_mean: Number(depressionElationMean.toFixed(2)),
      anger_mean: Number(angerMean.toFixed(2)),
      total_mean: Number(totalMean.toFixed(2)),
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select('id, visit_id, patient_id, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, anxiety_depression_mean, depression_elation_mean, anger_mean, total_mean, interpretation, completed_by, completed_at, created_at, updated_at')
    .single();

  if (error) throw error;
  return data;
}

// AIM
const AIM_SELECT_FIELDS = 'id, visit_id, patient_id, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, positive_affectivity_mean, negative_intensity_mean, reactivity_mean, total_mean, interpretation, completed_by, completed_at, created_at, updated_at';

export async function getAimResponse(
  visitId: string
): Promise<AimResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_aim')
    .select(AIM_SELECT_FIELDS)
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveAimResponse(
  response: AimResponseInsert
): Promise<AimResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Reverse score items: 5, 10, 13, 15, 18, 20
  const reverseItems = [5, 10, 13, 15, 18, 20];
  const scores: Record<number, number> = {};

  // Process all items with reverse scoring
  for (let i = 1; i <= 20; i++) {
    const value = response[`q${i}` as keyof AimResponseInsert] as number;
    scores[i] = reverseItems.includes(i) ? (7 - value) : value;
  }

  // Calculate subscale means (from Python implementation - placeholder mapping)
  // These would need to be defined based on the actual AIM subscale structure
  const positiveAffectivitySum = scores[1] + scores[2] + scores[3] + scores[7] + 
                                  scores[8] + scores[9] + scores[12] + scores[16];
  const positiveAffectivityMean = positiveAffectivitySum / 8;

  const negativeIntensitySum = scores[4] + scores[6] + scores[11] + scores[14] + 
                                scores[17] + scores[19];
  const negativeIntensityMean = negativeIntensitySum / 6;

  const reactivitySum = scores[5] + scores[10] + scores[13] + scores[15] + 
                        scores[18] + scores[20];
  const reactivityMean = reactivitySum / 6;

  // Total mean (all 20 items after reverse scoring)
  const totalSum = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const totalMean = totalSum / 20;

  const interpretation = `Intensité affective totale: ${totalMean.toFixed(2)}/6. ` +
    `Affectivité positive: ${positiveAffectivityMean.toFixed(2)}, ` +
    `Intensité négative: ${negativeIntensityMean.toFixed(2)}, ` +
    `Réactivité: ${reactivityMean.toFixed(2)}.`;

  // Only insert the fields that actually exist in the database
  const { data, error } = await supabase
    .from('responses_aim')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
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
      q16: response.q16,
      q17: response.q17,
      q18: response.q18,
      q19: response.q19,
      q20: response.q20,
      positive_affectivity_mean: Number(positiveAffectivityMean.toFixed(2)),
      negative_intensity_mean: Number(negativeIntensityMean.toFixed(2)),
      reactivity_mean: Number(reactivityMean.toFixed(2)),
      total_mean: Number(totalMean.toFixed(2)),
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select(AIM_SELECT_FIELDS)
    .single();

  if (error) throw error;
  return data;
}

// WURS-25
const WURS25_SELECT_FIELDS = 'id, visit_id, patient_id, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, q19, q20, q21, q22, q23, q24, q25, total_score, adhd_likely, interpretation, completed_by, completed_at, created_at, updated_at';

export async function getWurs25Response(
  visitId: string
): Promise<Wurs25Response | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_wurs25')
    .select(WURS25_SELECT_FIELDS)
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveWurs25Response(
  response: Wurs25ResponseInsert
): Promise<Wurs25Response> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate total score for interpretation (DB also computes it as generated column)
  const totalScore = response.q1 + response.q2 + response.q3 + response.q4 + response.q5 +
                     response.q6 + response.q7 + response.q8 + response.q9 + response.q10 +
                     response.q11 + response.q12 + response.q13 + response.q14 + response.q15 +
                     response.q16 + response.q17 + response.q18 + response.q19 + response.q20 +
                     response.q21 + response.q22 + response.q23 + response.q24 + response.q25;

  // Clinical cutoff: Score >= 36 suggests childhood ADHD (86% sensitivity, 99% specificity)
  const adhdLikely = totalScore >= 36;
  const interpretation = adhdLikely
    ? `Score total: ${totalScore}/100. TDAH dans l'enfance probable (score >= 36).`
    : `Score total: ${totalScore}/100. TDAH dans l'enfance peu probable (score < 36).`;

  // Only insert the fields that actually exist in the database
  const { data, error } = await supabase
    .from('responses_wurs25')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
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
      q16: response.q16,
      q17: response.q17,
      q18: response.q18,
      q19: response.q19,
      q20: response.q20,
      q21: response.q21,
      q22: response.q22,
      q23: response.q23,
      q24: response.q24,
      q25: response.q25,
      adhd_likely: adhdLikely,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select(WURS25_SELECT_FIELDS)
    .single();

  if (error) throw error;
  return data;
}

// AQ-12
const AQ12_SELECT_FIELDS = 'id, visit_id, patient_id, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, total_score, interpretation, completed_by, completed_at, created_at, updated_at';

export async function getAq12Response(
  visitId: string
): Promise<Aq12Response | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_aq12')
    .select(AQ12_SELECT_FIELDS)
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveAq12Response(
  response: Aq12ResponseInsert
): Promise<Aq12Response> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate subscale scores
  // Physical Aggression: items 1, 5, 9
  const physicalAggressionScore = response.q1 + response.q5 + response.q9;
  
  // Verbal Aggression: items 2, 6, 10
  const verbalAggressionScore = response.q2 + response.q6 + response.q10;
  
  // Anger: items 3, 7, 11
  const angerScore = response.q3 + response.q7 + response.q11;
  
  // Hostility: items 4, 8, 12
  const hostilityScore = response.q4 + response.q8 + response.q12;

  const totalScore = physicalAggressionScore + verbalAggressionScore + 
                     angerScore + hostilityScore;

  const interpretation = `Score total: ${totalScore}/72. ` +
    `Agression physique: ${physicalAggressionScore}/18, ` +
    `Agression verbale: ${verbalAggressionScore}/18, ` +
    `Colère: ${angerScore}/18, ` +
    `Hostilité: ${hostilityScore}/18.`;

  // Only insert the fields that actually exist in the database
  const { data, error } = await supabase
    .from('responses_aq12')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
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
      total_score: totalScore,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select(AQ12_SELECT_FIELDS)
    .single();

  if (error) throw error;
  return data;
}

// CSM
export async function getCsmResponse(
  visitId: string
): Promise<CsmResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_csm')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveCsmResponse(
  response: CsmResponseInsert
): Promise<CsmResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Remove total_score if present (it's a generated column)
  const { total_score, ...responseWithoutGeneratedFields } = response as any;

  // Total score is computed by database (generated column)
  // Calculate total for interpretation
  const totalScore = responseWithoutGeneratedFields.q1 + responseWithoutGeneratedFields.q2 + responseWithoutGeneratedFields.q3 + responseWithoutGeneratedFields.q4 +
                     responseWithoutGeneratedFields.q5 + responseWithoutGeneratedFields.q6 + responseWithoutGeneratedFields.q7 + responseWithoutGeneratedFields.q8 +
                     responseWithoutGeneratedFields.q9 + responseWithoutGeneratedFields.q10 + responseWithoutGeneratedFields.q11 + responseWithoutGeneratedFields.q12;

  let interpretation = `Score total: ${totalScore}/55. `;
  if (totalScore >= 44) {
    interpretation += 'Type matinal prononcé.';
  } else if (totalScore >= 32) {
    interpretation += 'Type intermédiaire.';
  } else {
    interpretation += 'Type vespéral prononcé.';
  }

  const { data, error } = await supabase
    .from('responses_csm')
    .upsert({
      ...responseWithoutGeneratedFields,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// CTI
export async function getCtiResponse(
  visitId: string
): Promise<CtiResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_cti')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveCtiResponse(
  response: CtiResponseInsert
): Promise<CtiResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate subscale scores
  // Flexibility/Rigidity: items 2, 4, 6, 8, 10
  const flexibilityScore = response.q2 + response.q4 + response.q6 + response.q8 + response.q10;
  
  // Languid/Vigorous: items 1, 3, 5, 7, 9, 11
  const languidScore = response.q1 + response.q3 + response.q5 + response.q7 + 
                       response.q9 + response.q11;

  const totalScore = flexibilityScore + languidScore;

  let circadianType = '';
  if (totalScore >= 38) {
    circadianType = 'evening';
  } else if (totalScore >= 28) {
    circadianType = 'intermediate';
  } else {
    circadianType = 'morning';
  }

  const interpretation = `Score total: ${totalScore}/55. ` +
    `Flexibilité: ${flexibilityScore}/25, ` +
    `Languide: ${languidScore}/30. ` +
    `Type circadien: ${circadianType}.`;

  const { data, error } = await supabase
    .from('responses_cti')
    .upsert({
      ...response,
      total_score: totalScore,
      circadian_type: circadianType,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}
