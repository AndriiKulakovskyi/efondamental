import type { SupabaseClient } from '@supabase/supabase-js';

import {
  analyzeBloodPressure,
  analyzeEcg,
  analyzePhysicalParams,
  scoreFagerstrom,
  scoreSleepApnea,
} from '@/lib/questionnaires/bipolar/nurse';

type AnyRecord = Record<string, any>;

export async function saveTobaccoForTest(client: SupabaseClient, payload: AnyRecord) {
  const { data, error } = await client
    .from('bipolar_nurse_tobacco')
    .upsert(
      {
        ...payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'visit_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveFagerstromForTest(client: SupabaseClient, payload: AnyRecord) {
  const scoring = scoreFagerstrom({
    q1: payload.q1 ?? null,
    q2: payload.q2 ?? null,
    q3: payload.q3 ?? null,
    q4: payload.q4 ?? null,
    q5: payload.q5 ?? null,
    q6: payload.q6 ?? null,
  });

  const { data, error } = await client
    .from('bipolar_nurse_fagerstrom')
    .upsert(
      {
        ...payload,
        total_score: scoring.total_score,
        dependence_level: scoring.dependence_level,
        interpretation: scoring.interpretation,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'visit_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function savePhysicalParamsForTest(client: SupabaseClient, payload: AnyRecord) {
  const analysis = analyzePhysicalParams({
    height_cm: payload.height_cm ?? null,
    weight_kg: payload.weight_kg ?? null,
  });

  const { data, error } = await client
    .from('bipolar_nurse_physical_params')
    .upsert(
      {
        ...payload,
        bmi: analysis.bmi,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'visit_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveBloodPressureForTest(client: SupabaseClient, payload: AnyRecord) {
  const analysis = analyzeBloodPressure({
    bp_lying_systolic: payload.bp_lying_systolic ?? null,
    bp_lying_diastolic: payload.bp_lying_diastolic ?? null,
    bp_standing_systolic: payload.bp_standing_systolic ?? null,
    bp_standing_diastolic: payload.bp_standing_diastolic ?? null,
  });

  const { data, error } = await client
    .from('bipolar_nurse_blood_pressure')
    .upsert(
      {
        ...payload,
        tension_lying: analysis.tension_lying,
        tension_standing: analysis.tension_standing,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'visit_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveSleepApneaForTest(client: SupabaseClient, payload: AnyRecord) {
  const scoring = scoreSleepApnea({
    diagnosed_sleep_apnea: payload.diagnosed_sleep_apnea ?? null,
    has_cpap_device: payload.has_cpap_device ?? null,
    snoring: payload.snoring ?? null,
    tiredness: payload.tiredness ?? null,
    observed_apnea: payload.observed_apnea ?? null,
    hypertension: payload.hypertension ?? null,
    bmi_over_35: payload.bmi_over_35 ?? null,
    age_over_50: payload.age_over_50 ?? null,
    large_neck: payload.large_neck ?? null,
    male_gender: payload.male_gender ?? null,
  });

  const yesNoToBoolean = (v: any): boolean | null => {
    if (v === null || v === undefined) return null;
    if (typeof v === 'boolean') return v;
    if (v === 'yes') return true;
    if (v === 'no') return false;
    return null;
  };

  const dataToSave = {
    visit_id: payload.visit_id,
    patient_id: payload.patient_id,
    diagnosed_sleep_apnea: payload.diagnosed_sleep_apnea,
    has_cpap_device: yesNoToBoolean(payload.has_cpap_device),
    snoring: yesNoToBoolean(payload.snoring),
    tiredness: yesNoToBoolean(payload.tiredness),
    observed_apnea: yesNoToBoolean(payload.observed_apnea),
    hypertension: yesNoToBoolean(payload.hypertension),
    bmi_over_35: yesNoToBoolean(payload.bmi_over_35),
    age_over_50: yesNoToBoolean(payload.age_over_50),
    large_neck: yesNoToBoolean(payload.large_neck),
    male_gender: yesNoToBoolean(payload.male_gender),
    stop_bang_score: scoring.stop_bang_score,
    risk_level: scoring.risk_level,
    interpretation: scoring.interpretation,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await client
    .from('bipolar_nurse_sleep_apnea')
    .upsert(dataToSave, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveBiologicalAssessmentForTest(client: SupabaseClient, payload: AnyRecord) {
  let rapport_total_hdl = null;
  if (payload.cholesterol_total && payload.hdl && payload.hdl > 0) {
    rapport_total_hdl = Math.round((payload.cholesterol_total / payload.hdl) * 100) / 100;
  }

  let calcemie_corrigee = null;
  if (payload.calcemie && payload.protidemie) {
    calcemie_corrigee = Math.round((payload.calcemie / 0.55 + payload.protidemie / 160) * 100) / 100;
  }

  const { data, error } = await client
    .from('bipolar_nurse_biological_assessment')
    .upsert(
      {
        ...payload,
        rapport_total_hdl,
        calcemie_corrigee,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'visit_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveEcgForTest(client: SupabaseClient, payload: AnyRecord, patientGender?: 'M' | 'F') {
  const analysis = analyzeEcg({
    ecg_performed: payload.ecg_performed ?? null,
    qt_measured: payload.qt_measured ?? null,
    rr_measured: payload.rr_measured ?? null,
    heart_rate: payload.heart_rate ?? null,
    gender: patientGender ?? null,
  });

  const { data, error } = await client
    .from('bipolar_nurse_ecg')
    .upsert(
      {
        ...payload,
        qtc_calculated: analysis.qtc,
        interpretation: analysis.interpretation,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'visit_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

