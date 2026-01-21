// eFondaMental Platform - Bipolar Nurse Service
// Service functions for nurse module questionnaire responses

import { createClient } from '@/lib/supabase/server';
import {
  BipolarNurseTobaccoResponse,
  BipolarNurseTobaccoResponseInsert,
  BipolarNurseFagerstromResponse,
  BipolarNurseFagerstromResponseInsert,
  BipolarNursePhysicalParamsResponse,
  BipolarNursePhysicalParamsResponseInsert,
  BipolarNurseBloodPressureResponse,
  BipolarNurseBloodPressureResponseInsert,
  BipolarNurseSleepApneaResponse,
  BipolarNurseSleepApneaResponseInsert,
  BipolarNurseBiologicalAssessmentResponse,
  BipolarNurseBiologicalAssessmentResponseInsert,
  BipolarNurseEcgResponse,
  BipolarNurseEcgResponseInsert,
  analyzeTobacco,
  scoreFagerstrom,
  analyzePhysicalParams,
  analyzeBloodPressure,
  scoreSleepApnea,
  analyzeBiologicalAssessment,
  interpretBiologicalAssessment,
  analyzeEcg
} from '@/lib/questionnaires/bipolar/nurse';

// ============================================================================
// Tobacco
// ============================================================================

export async function getTobaccoResponse(visitId: string): Promise<BipolarNurseTobaccoResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_nurse_tobacco')
    .select('*')
    .eq('visit_id', visitId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function saveTobaccoResponse(
  response: BipolarNurseTobaccoResponseInsert
): Promise<BipolarNurseTobaccoResponse> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('bipolar_nurse_tobacco')
    .upsert({
      ...response,
      updated_at: new Date().toISOString()
    }, { onConflict: 'visit_id' })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============================================================================
// Fagerstrom
// ============================================================================

export async function getFagerstromResponse(visitId: string): Promise<BipolarNurseFagerstromResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_nurse_fagerstrom')
    .select('*')
    .eq('visit_id', visitId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function saveFagerstromResponse(
  response: BipolarNurseFagerstromResponseInsert
): Promise<BipolarNurseFagerstromResponse> {
  const supabase = await createClient();
  
  // Compute score and interpretation
  const scoring = scoreFagerstrom({
    q1: response.q1,
    q2: response.q2,
    q3: response.q3,
    q4: response.q4,
    q5: response.q5,
    q6: response.q6
  });
  
  const { data, error } = await supabase
    .from('bipolar_nurse_fagerstrom')
    .upsert({
      ...response,
      total_score: scoring.total_score,
      dependence_level: scoring.dependence_level,
      interpretation: scoring.interpretation,
      updated_at: new Date().toISOString()
    }, { onConflict: 'visit_id' })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============================================================================
// Physical Params
// ============================================================================

export async function getPhysicalParamsResponse(visitId: string): Promise<BipolarNursePhysicalParamsResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_nurse_physical_params')
    .select('*')
    .eq('visit_id', visitId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function savePhysicalParamsResponse(
  response: BipolarNursePhysicalParamsResponseInsert
): Promise<BipolarNursePhysicalParamsResponse> {
  const supabase = await createClient();
  
  // Compute BMI
  const analysis = analyzePhysicalParams({
    height_cm: response.height_cm,
    weight_kg: response.weight_kg
  });
  
  const { data, error } = await supabase
    .from('bipolar_nurse_physical_params')
    .upsert({
      ...response,
      bmi: analysis.bmi,
      updated_at: new Date().toISOString()
    }, { onConflict: 'visit_id' })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============================================================================
// Blood Pressure
// ============================================================================

export async function getBloodPressureResponse(visitId: string): Promise<BipolarNurseBloodPressureResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_nurse_blood_pressure')
    .select('*')
    .eq('visit_id', visitId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function saveBloodPressureResponse(
  response: BipolarNurseBloodPressureResponseInsert
): Promise<BipolarNurseBloodPressureResponse> {
  const supabase = await createClient();
  
  // Compute tension strings
  const analysis = analyzeBloodPressure({
    bp_lying_systolic: response.bp_lying_systolic,
    bp_lying_diastolic: response.bp_lying_diastolic,
    bp_standing_systolic: response.bp_standing_systolic,
    bp_standing_diastolic: response.bp_standing_diastolic
  });
  
  const { data, error } = await supabase
    .from('bipolar_nurse_blood_pressure')
    .upsert({
      ...response,
      tension_lying: analysis.tension_lying,
      tension_standing: analysis.tension_standing,
      updated_at: new Date().toISOString()
    }, { onConflict: 'visit_id' })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============================================================================
// Sleep Apnea
// ============================================================================

export async function getSleepApneaResponse(visitId: string): Promise<BipolarNurseSleepApneaResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_nurse_sleep_apnea')
    .select('*')
    .eq('visit_id', visitId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function saveSleepApneaResponse(
  response: BipolarNurseSleepApneaResponseInsert
): Promise<BipolarNurseSleepApneaResponse> {
  const supabase = await createClient();
  
  // Compute STOP-Bang score if not already diagnosed
  const scoring = scoreSleepApnea({
    diagnosed_sleep_apnea: response.diagnosed_sleep_apnea,
    has_cpap_device: response.has_cpap_device,
    snoring: response.snoring,
    tiredness: response.tiredness,
    observed_apnea: response.observed_apnea,
    hypertension: response.hypertension,
    bmi_over_35: response.bmi_over_35,
    age_over_50: response.age_over_50,
    large_neck: response.large_neck,
    male_gender: response.male_gender
  });
  
  const { data, error } = await supabase
    .from('bipolar_nurse_sleep_apnea')
    .upsert({
      ...response,
      stop_bang_score: scoring.stop_bang_score,
      risk_level: scoring.risk_level,
      interpretation: scoring.interpretation,
      updated_at: new Date().toISOString()
    }, { onConflict: 'visit_id' })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============================================================================
// Biological Assessment
// ============================================================================

export async function getBiologicalAssessmentResponse(visitId: string): Promise<BipolarNurseBiologicalAssessmentResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_nurse_biological_assessment')
    .select('*')
    .eq('visit_id', visitId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function saveBiologicalAssessmentResponse(
  response: BipolarNurseBiologicalAssessmentResponseInsert
): Promise<BipolarNurseBiologicalAssessmentResponse> {
  const supabase = await createClient();
  
  // Compute rapport Total/HDL if both values exist
  let rapport_total_hdl = null;
  if (response.cholesterol_total && response.hdl && response.hdl > 0) {
    rapport_total_hdl = Math.round((response.cholesterol_total / response.hdl) * 100) / 100;
  }
  
  // Compute calcemie_corrigee if both values exist
  let calcemie_corrigee = null;
  if (response.calcemie && response.protidemie) {
    calcemie_corrigee = Math.round((response.calcemie / 0.55 + response.protidemie / 160) * 100) / 100;
  }
  
  const { data, error } = await supabase
    .from('bipolar_nurse_biological_assessment')
    .upsert({
      ...response,
      rapport_total_hdl,
      calcemie_corrigee,
      updated_at: new Date().toISOString()
    }, { onConflict: 'visit_id' })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============================================================================
// ECG
// ============================================================================

export async function getEcgResponse(visitId: string): Promise<BipolarNurseEcgResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_nurse_ecg')
    .select('*')
    .eq('visit_id', visitId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function saveEcgResponse(
  response: BipolarNurseEcgResponseInsert,
  patientGender?: 'M' | 'F' | null
): Promise<BipolarNurseEcgResponse> {
  const supabase = await createClient();
  
  // Compute QTc and interpretation
  const analysis = analyzeEcg({
    ecg_performed: response.ecg_performed,
    qt_measured: response.qt_measured,
    rr_measured: response.rr_measured,
    heart_rate: response.heart_rate,
    gender: patientGender ?? null
  });
  
  const { data, error } = await supabase
    .from('bipolar_nurse_ecg')
    .upsert({
      ...response,
      qtc_calculated: analysis.qtc,
      interpretation: analysis.interpretation,
      updated_at: new Date().toISOString()
    }, { onConflict: 'visit_id' })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
