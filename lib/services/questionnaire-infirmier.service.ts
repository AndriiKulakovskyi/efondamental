/**
 * Infirmier Section Questionnaire Services
 * Handles tobacco assessment, Fagerstrom test, physical parameters, and blood pressure responses
 */

import { createClient } from '@/lib/supabase/server';
import { TobaccoResponse, TobaccoResponseInsert, FagerstromResponse, FagerstromResponseInsert, PhysicalParamsResponse, PhysicalParamsResponseInsert, BloodPressureResponse, BloodPressureResponseInsert } from '@/lib/types/database.types';

// ===== TOBACCO ASSESSMENT =====

export async function getTobaccoResponse(
  visitId: string
): Promise<TobaccoResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_tobacco')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      // Table doesn't exist yet - migration not applied
      console.warn(`Table responses_tobacco not found. Please run migrations.`);
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveTobaccoResponse(
  response: TobaccoResponseInsert
): Promise<TobaccoResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Normalize responses based on smoking_status
  // For current_smoker: use pack_years, smoking_start_age, has_substitution, etc.
  // For ex_smoker: use pack_years_ex -> pack_years, smoking_start_age_ex -> smoking_start_age, etc.
  const normalizedResponse: any = {
    visit_id: response.visit_id,
    patient_id: response.patient_id,
    smoking_status: response.smoking_status,
    completed_by: user.data.user?.id
  };

  if (response.smoking_status === 'current_smoker') {
    normalizedResponse.pack_years = (response as any).pack_years;
    normalizedResponse.smoking_start_age = (response as any).smoking_start_age;
    normalizedResponse.has_substitution = (response as any).has_substitution === 'yes';
    
    // Handle substitution_methods array
    const substitutionMethods = (response as any).substitution_methods;
    normalizedResponse.substitution_methods = Array.isArray(substitutionMethods) ? substitutionMethods : [];
  } else if (response.smoking_status === 'ex_smoker') {
    // Map _ex fields to regular fields
    normalizedResponse.pack_years = (response as any).pack_years_ex;
    normalizedResponse.smoking_start_age = (response as any).smoking_start_age_ex;
    normalizedResponse.smoking_end_age = (response as any).smoking_end_age;
    normalizedResponse.has_substitution = (response as any).has_substitution_ex === 'yes';
    
    // Handle substitution_methods_ex array
    const substitutionMethodsEx = (response as any).substitution_methods_ex;
    normalizedResponse.substitution_methods = Array.isArray(substitutionMethodsEx) ? substitutionMethodsEx : [];
  }

  const { data, error } = await supabase
    .from('responses_tobacco')
    .upsert(normalizedResponse, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ===== FAGERSTROM TEST FOR NICOTINE DEPENDENCE =====

export async function getFagerstromResponse(
  visitId: string
): Promise<FagerstromResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_fagerstrom')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      // Table doesn't exist yet - migration not applied
      console.warn(`Table responses_fagerstrom not found. Please run migrations.`);
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveFagerstromResponse(
  response: FagerstromResponseInsert
): Promise<FagerstromResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate total score (0-10)
  const totalScore = response.q1 + response.q2 + response.q3 + response.q4 + response.q5 + response.q6;

  // Determine dependence level
  let dependenceLevel = '';
  let interpretation = '';

  if (totalScore <= 2) {
    dependenceLevel = 'Pas de dépendance ou dépendance très faible';
    interpretation = `Score FTND: ${totalScore}/10. ${dependenceLevel}. Le sevrage peut être envisagé sans substitution nicotinique systématique.`;
  } else if (totalScore >= 3 && totalScore <= 4) {
    dependenceLevel = 'Dépendance faible';
    interpretation = `Score FTND: ${totalScore}/10. ${dependenceLevel}. Substitution nicotinique à faible dose peut faciliter le sevrage.`;
  } else if (totalScore === 5) {
    dependenceLevel = 'Dépendance moyenne';
    interpretation = `Score FTND: ${totalScore}/10. ${dependenceLevel}. Substitution nicotinique recommandée pour le sevrage.`;
  } else {
    dependenceLevel = 'Dépendance forte';
    interpretation = `Score FTND: ${totalScore}/10. ${dependenceLevel}. Substitution nicotinique fortement recommandée, éventuellement associée à un accompagnement thérapeutique.`;
  }

  // Add specific item interpretations
  if (response.q1 >= 2) {
    interpretation += ' Cigarette matinale précoce (dépendance physique).';
  }
  
  if (response.q4 >= 2) {
    interpretation += ' Consommation importante (>20 cigarettes/jour).';
  }
  
  if (response.q3 === 1) {
    interpretation += ' Première cigarette difficilement remplaçable.';
  }

  // Clinical warnings for high scores
  if (totalScore >= 8) {
    interpretation += ' Score très élevé (≥8). Dépendance nicotinique forte. Envisager un accompagnement au sevrage tabagique.';
  }

  if (response.q1 === 3) {
    interpretation += ' Cigarette dans les 5 minutes après réveil: indicateur fort de dépendance physique.';
  }

  if (response.q4 === 3) {
    interpretation += ' Consommation ≥31 cigarettes/jour: risque sanitaire majeur.';
  }

  const { data, error } = await supabase
    .from('responses_fagerstrom')
    .upsert({
      ...response,
      dependence_level: dependenceLevel,
      interpretation: interpretation.trim(),
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ===== PHYSICAL PARAMETERS =====

export async function getPhysicalParamsResponse(
  visitId: string
): Promise<PhysicalParamsResponse | null> {
  const supabase = await createClient();
  const { data, error} = await supabase
    .from('responses_physical_params')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      // Table doesn't exist yet - migration not applied
      console.warn(`Table responses_physical_params not found. Please run migrations.`);
      return null;
    }
    throw error;
  }
  return data;
}

export async function savePhysicalParamsResponse(
  response: PhysicalParamsResponseInsert
): Promise<PhysicalParamsResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // BMI is calculated automatically by the database, remove it from the request if present
  const { bmi, ...responseWithoutBmi } = response as any;

  const { data, error } = await supabase
    .from('responses_physical_params')
    .upsert({
      ...responseWithoutBmi,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ===== BLOOD PRESSURE & HEART RATE =====

export async function getBloodPressureResponse(
  visitId: string
): Promise<BloodPressureResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_blood_pressure')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      // Table doesn't exist yet - migration not applied
      console.warn(`Table responses_blood_pressure not found. Please run migrations.`);
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveBloodPressureResponse(
  response: BloodPressureResponseInsert
): Promise<BloodPressureResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Remove tension fields if they were sent (they should be calculated, not received)
  const { tension_lying: _, tension_standing: __, ...responseData } = response as any;

  // Calculate tension_lying and tension_standing as "systolic/diastolic" format
  let tensionLying = null;
  if (responseData.bp_lying_systolic && responseData.bp_lying_diastolic) {
    tensionLying = `${responseData.bp_lying_systolic}/${responseData.bp_lying_diastolic}`;
  }

  let tensionStanding = null;
  if (responseData.bp_standing_systolic && responseData.bp_standing_diastolic) {
    tensionStanding = `${responseData.bp_standing_systolic}/${responseData.bp_standing_diastolic}`;
  }

  const { data, error } = await supabase
    .from('responses_blood_pressure')
    .upsert({
      ...responseData,
      tension_lying: tensionLying,
      tension_standing: tensionStanding,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

