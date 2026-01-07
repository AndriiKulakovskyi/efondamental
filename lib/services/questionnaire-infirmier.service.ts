/**
 * Infirmier Section Questionnaire Services
 * Handles tobacco assessment, Fagerstrom test, physical parameters, blood pressure, sleep apnea, biological assessment, and ECG responses
 */

import { createClient } from '@/lib/supabase/server';
import { TobaccoResponse, TobaccoResponseInsert, FagerstromResponse, FagerstromResponseInsert, PhysicalParamsResponse, PhysicalParamsResponseInsert, BloodPressureResponse, BloodPressureResponseInsert, SleepApneaResponse, SleepApneaResponseInsert, BiologicalAssessmentResponse, BiologicalAssessmentResponseInsert, EcgResponse, EcgResponseInsert } from '@/lib/types/database.types';
import { getPatientById } from '@/lib/services/patient.service';
import { getVisitById } from '@/lib/services/visit.service';
import { calculateAgeAtDate, normalizeGender } from '@/lib/utils/patient-demographics';

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

  if (!data) return null;

  // Denormalize the data back to field names expected by the questionnaire UI
  // The database stores normalized fields (pack_years, smoking_start_age, etc.)
  // but the questionnaire has separate fields for current_smoker vs ex_smoker
  const transformed: any = { ...data };
  
  // Transform boolean values to 'yes'/'no' strings for UI compatibility
  const boolToYesNo = (value: boolean | null): string | null => {
    if (value === true) return 'yes';
    if (value === false) return 'no';
    return null;
  };

  if (data.smoking_status === 'ex_smoker') {
    // For ex_smoker: map normalized fields back to _ex suffix fields
    transformed.pack_years_ex = data.pack_years;
    transformed.smoking_start_age_ex = data.smoking_start_age;
    transformed.smoking_end_age = data.smoking_end_age; // This field is same for both
    transformed.has_substitution_ex = boolToYesNo(data.has_substitution);
    transformed.substitution_methods_ex = data.substitution_methods;
    // Clear the non-_ex fields to avoid confusion
    delete transformed.pack_years;
    delete transformed.smoking_start_age;
    delete transformed.has_substitution;
    delete transformed.substitution_methods;
  } else if (data.smoking_status === 'current_smoker') {
    // For current_smoker: keep normalized fields but transform has_substitution
    transformed.has_substitution = boolToYesNo(data.has_substitution);
  } else {
    // For non_smoker or unknown: transform has_substitution if present
    transformed.has_substitution = boolToYesNo(data.has_substitution);
  }

  return transformed;
}

export async function saveTobaccoResponse(
  response: TobaccoResponseInsert
): Promise<TobaccoResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Transform 'yes'/'no' strings to boolean for database compatibility
  // This ensures the app works whether migration has been applied or not
  const transformToBoolean = (value: any): boolean | null => {
    if (value === 'yes' || value === true) return true;
    if (value === 'no' || value === false) return false;
    return null;
  };

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
    normalizedResponse.has_substitution = transformToBoolean((response as any).has_substitution);
    
    // Handle substitution_methods array
    const substitutionMethods = (response as any).substitution_methods;
    normalizedResponse.substitution_methods = Array.isArray(substitutionMethods) ? substitutionMethods : [];
  } else if (response.smoking_status === 'ex_smoker') {
    // Map _ex fields to regular fields
    normalizedResponse.pack_years = (response as any).pack_years_ex;
    normalizedResponse.smoking_start_age = (response as any).smoking_start_age_ex;
    normalizedResponse.smoking_end_age = (response as any).smoking_end_age;
    normalizedResponse.has_substitution = transformToBoolean((response as any).has_substitution_ex);
    
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

  // Transform boolean back to 'yes'/'no' for UI consistency
  if (data) {
    const transformed: any = { ...data };
    if (transformed.has_substitution === true) {
      transformed.has_substitution = 'yes';
    } else if (transformed.has_substitution === false) {
      transformed.has_substitution = 'no';
    }
    return transformed;
  }

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

  // Remove total_score if present (it's a generated column)
  const { total_score, ...responseWithoutGeneratedFields } = response as any;

  // Calculate total score (0-10)
  const totalScore = responseWithoutGeneratedFields.q1 + responseWithoutGeneratedFields.q2 + responseWithoutGeneratedFields.q3 + responseWithoutGeneratedFields.q4 + responseWithoutGeneratedFields.q5 + responseWithoutGeneratedFields.q6;

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
  if (responseWithoutGeneratedFields.q1 >= 2) {
    interpretation += ' Cigarette matinale précoce (dépendance physique).';
  }
  
  if (responseWithoutGeneratedFields.q4 >= 2) {
    interpretation += ' Consommation importante (>20 cigarettes/jour).';
  }
  
  if (responseWithoutGeneratedFields.q3 === 1) {
    interpretation += ' Première cigarette difficilement remplaçable.';
  }

  // Clinical warnings for high scores
  if (totalScore >= 8) {
    interpretation += ' Score très élevé (≥8). Dépendance nicotinique forte. Envisager un accompagnement au sevrage tabagique.';
  }

  if (responseWithoutGeneratedFields.q1 === 3) {
    interpretation += ' Cigarette dans les 5 minutes après réveil: indicateur fort de dépendance physique.';
  }

  if (responseWithoutGeneratedFields.q4 === 3) {
    interpretation += ' Consommation ≥31 cigarettes/jour: risque sanitaire majeur.';
  }

  const { data, error } = await supabase
    .from('responses_fagerstrom')
    .upsert({
      ...responseWithoutGeneratedFields,
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

// ===== SLEEP APNEA (STOP-BANG) =====

export async function getSleepApneaResponse(
  visitId: string
): Promise<SleepApneaResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_sleep_apnea')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      // Table doesn't exist yet - migration not applied
      console.warn(`Table responses_sleep_apnea not found. Please run migrations.`);
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveSleepApneaResponse(
  response: SleepApneaResponseInsert
): Promise<SleepApneaResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const normalizedResponse: any = {
    visit_id: response.visit_id,
    patient_id: response.patient_id,
    diagnosed_sleep_apnea: response.diagnosed_sleep_apnea,
    completed_by: user.data.user?.id
  };

  if (response.diagnosed_sleep_apnea === 'yes') {
    // Convert string 'yes'/'no' to boolean
    const hasCpap = (response as any).has_cpap_device;
    normalizedResponse.has_cpap_device = hasCpap === true || hasCpap === 'true' || hasCpap === 'yes';
  } else if (response.diagnosed_sleep_apnea === 'no' || response.diagnosed_sleep_apnea === 'unknown') {
    // STOP-Bang questions - convert string 'yes'/'no' to boolean
    const snoring = (response as any).snoring;
    const tiredness = (response as any).tiredness;
    const observedApnea = (response as any).observed_apnea;
    const hypertension = (response as any).hypertension;
    const bmiOver35 = (response as any).bmi_over_35;
    const ageOver50 = (response as any).age_over_50;
    const largeNeck = (response as any).large_neck;
    const maleGender = (response as any).male_gender;

    normalizedResponse.snoring = snoring === true || snoring === 'true' || snoring === 'yes';
    normalizedResponse.tiredness = tiredness === true || tiredness === 'true' || tiredness === 'yes';
    normalizedResponse.observed_apnea = observedApnea === true || observedApnea === 'true' || observedApnea === 'yes';
    normalizedResponse.hypertension = hypertension === true || hypertension === 'true' || hypertension === 'yes';
    normalizedResponse.bmi_over_35 = bmiOver35 === true || bmiOver35 === 'true' || bmiOver35 === 'yes';
    normalizedResponse.age_over_50 = ageOver50 === true || ageOver50 === 'true' || ageOver50 === 'yes';
    normalizedResponse.large_neck = largeNeck === true || largeNeck === 'true' || largeNeck === 'yes';
    normalizedResponse.male_gender = maleGender === true || maleGender === 'true' || maleGender === 'yes';

    // Calculate STOP-Bang score (each "Yes" = 1 point)
    const score = [
      normalizedResponse.snoring,
      normalizedResponse.tiredness,
      normalizedResponse.observed_apnea,
      normalizedResponse.hypertension,
      normalizedResponse.bmi_over_35,
      normalizedResponse.age_over_50,
      normalizedResponse.large_neck,
      normalizedResponse.male_gender
    ].filter(Boolean).length;

    normalizedResponse.stop_bang_score = score;

    // Determine risk level
    let riskLevel = '';
    let interpretation = '';

    if (score <= 2) {
      riskLevel = 'low_risk';
      interpretation = `Score STOP-Bang: ${score}/8. Faible risque d'apnées obstructives du sommeil.`;
    } else if (score >= 3 && score <= 4) {
      riskLevel = 'intermediate_risk';
      interpretation = `Score STOP-Bang: ${score}/8. Risque intermédiaire d'apnées obstructives du sommeil. Considérer une évaluation plus approfondie.`;
    } else {
      riskLevel = 'high_risk';
      interpretation = `Score STOP-Bang: ${score}/8. Haut risque d'apnées obstructives du sommeil. Recommandation forte pour une polysomnographie.`;
    }

    // High risk conditions (score ≥3 + major risk factors)
    if (score >= 3 && (normalizedResponse.bmi_over_35 || normalizedResponse.hypertension || normalizedResponse.large_neck)) {
      riskLevel = 'high_risk';
      interpretation += ' Facteurs de risque majeurs présents (IMC > 35, HTA, ou tour de cou important).';
    }

    normalizedResponse.risk_level = riskLevel;
    normalizedResponse.interpretation = interpretation;
  }

  const { data, error } = await supabase
    .from('responses_sleep_apnea')
    .upsert(normalizedResponse, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ===== BIOLOGICAL ASSESSMENT =====

export async function getBiologicalAssessmentResponse(
  visitId: string
): Promise<BiologicalAssessmentResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_biological_assessment')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      // Table doesn't exist yet - migration not applied
      console.warn(`Table responses_biological_assessment not found. Please run migrations.`);
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveBiologicalAssessmentResponse(
  response: BiologicalAssessmentResponseInsert
): Promise<BiologicalAssessmentResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Fetch patient profile for age and gender, visit for scheduled date
  const [patient, visit] = await Promise.all([
    getPatientById(response.patient_id),
    getVisitById(response.visit_id)
  ]);
  
  if (!patient) {
    throw new Error('Patient not found');
  }

  // Fetch physical params for weight
  const physicalParams = await getPhysicalParamsResponse(response.visit_id);

  // Normalize response - convert 'yes'/'no' strings to booleans for control questions
  const normalizedResponse: any = {
    visit_id: response.visit_id,
    patient_id: response.patient_id,
    collection_date: (response as any).collection_date || null,
    collection_location: (response as any).collection_location || null,
    completed_by: user.data.user?.id
  };

  // Convert control questions from 'yes'/'no' to boolean
  const onNeuroleptics = (response as any).on_neuroleptics;
  normalizedResponse.on_neuroleptics = onNeuroleptics === true || onNeuroleptics === 'yes' || onNeuroleptics === 'true' ? true : (onNeuroleptics === false || onNeuroleptics === 'no' || onNeuroleptics === 'false' ? false : null);

  const womanChildbearingAge = (response as any).woman_childbearing_age;
  normalizedResponse.woman_childbearing_age = womanChildbearingAge === true || womanChildbearingAge === 'yes' || womanChildbearingAge === 'true' ? true : (womanChildbearingAge === false || womanChildbearingAge === 'no' || womanChildbearingAge === 'false' ? false : null);

  // Convert treatment_taken_morning from 'yes'/'no' to boolean
  const treatmentTakenMorning = (response as any).treatment_taken_morning;
  normalizedResponse.treatment_taken_morning = treatmentTakenMorning === true || treatmentTakenMorning === 'yes' || treatmentTakenMorning === 'true' ? true : (treatmentTakenMorning === false || treatmentTakenMorning === 'no' || treatmentTakenMorning === 'false' ? false : null);

  // Convert vitamin_d_supplementation from 'yes'/'no' to boolean
  const vitaminDSupplementation = (response as any).vitamin_d_supplementation;
  normalizedResponse.vitamin_d_supplementation = vitaminDSupplementation === true || vitaminDSupplementation === 'yes' || vitaminDSupplementation === 'true' ? true : (vitaminDSupplementation === false || vitaminDSupplementation === 'no' || vitaminDSupplementation === 'false' ? false : null);

  // Convert toxoplasmosis boolean fields
  const toxoSerologyDone = (response as any).toxo_serology_done;
  normalizedResponse.toxo_serology_done = toxoSerologyDone === true || toxoSerologyDone === 'yes' || toxoSerologyDone === 'true' ? true : (toxoSerologyDone === false || toxoSerologyDone === 'no' || toxoSerologyDone === 'false' ? false : null);

  const toxoIgmPositive = (response as any).toxo_igm_positive;
  normalizedResponse.toxo_igm_positive = toxoIgmPositive === true || toxoIgmPositive === 'yes' || toxoIgmPositive === 'true' ? true : (toxoIgmPositive === false || toxoIgmPositive === 'no' || toxoIgmPositive === 'false' ? false : null);

  const toxoIggPositive = (response as any).toxo_igg_positive;
  normalizedResponse.toxo_igg_positive = toxoIggPositive === true || toxoIggPositive === 'yes' || toxoIggPositive === 'true' ? true : (toxoIggPositive === false || toxoIggPositive === 'no' || toxoIggPositive === 'false' ? false : null);

  const toxoPcrDone = (response as any).toxo_pcr_done;
  normalizedResponse.toxo_pcr_done = toxoPcrDone === true || toxoPcrDone === 'yes' || toxoPcrDone === 'true' ? true : (toxoPcrDone === false || toxoPcrDone === 'no' || toxoPcrDone === 'false' ? false : null);

  const toxoPcrPositive = (response as any).toxo_pcr_positive;
  normalizedResponse.toxo_pcr_positive = toxoPcrPositive === true || toxoPcrPositive === 'yes' || toxoPcrPositive === 'true' ? true : (toxoPcrPositive === false || toxoPcrPositive === 'no' || toxoPcrPositive === 'false' ? false : null);

  // Copy all other fields
  const fieldsToCopy = [
    'sodium', 'potassium', 'chlore', 'bicarbonates', 'protidemie', 'albumine', 'uree', 'acide_urique', 'creatinine',
    'phosphore', 'fer', 'ferritine', 'calcemie', 'crp', 'glycemie_a_jeun', 'glycemie_a_jeun_unit', 'hemoglobine_glyquee',
    'hdl', 'hdl_unit', 'ldl', 'ldl_unit', 'cholesterol_total', 'triglycerides', 'rapport_total_hdl',
    'pal', 'asat', 'alat', 'ggt', 'bilirubine_totale', 'bilirubine_totale_unit',
    'tsh', 'tsh_unit', 't3_libre', 't4_libre',
    'leucocytes', 'hematies', 'hemoglobine', 'hemoglobine_unit', 'hematocrite', 'hematocrite_unit',
    'neutrophiles', 'basophiles', 'eosinophiles', 'lymphocytes', 'monocytes', 'vgm',
    'tcmh', 'tcmh_unit', 'ccmh', 'ccmh_unit', 'plaquettes',
    'beta_hcg', 'dosage_bhcg', 'prolactine', 'prolactine_unit',
    'clozapine', 'teralithe_type', 'lithium_plasma', 'lithium_erythrocyte',
    'valproic_acid', 'carbamazepine', 'oxcarbazepine', 'lamotrigine',
    'vitamin_d_level', 'outdoor_time', 'skin_phototype',
    'vitamin_d_product_name', 'vitamin_d_supplementation_date', 'vitamin_d_supplementation_mode', 'vitamin_d_supplementation_dose',
    'toxo_igg_value'
  ];

  fieldsToCopy.forEach(field => {
    if ((response as any)[field] !== undefined && (response as any)[field] !== null) {
      normalizedResponse[field] = (response as any)[field];
    }
  });

  // Calculate creatinine clearance if we have all required data
  if (normalizedResponse.creatinine && physicalParams?.weight_kg && patient.date_of_birth) {
    const creatinine = parseFloat(normalizedResponse.creatinine);
    const weight = parseFloat(physicalParams.weight_kg.toString());
    
    // Calculate age at visit date (use scheduled_date, fallback to current date)
    const referenceDate = visit?.scheduled_date || new Date().toISOString();
    const adjustedAge = calculateAgeAtDate(patient.date_of_birth, referenceDate);

    if (creatinine > 0 && weight > 0 && adjustedAge > 0) {
      // Determine gender using normalized helper
      const normalizedGender = normalizeGender(patient.gender);
      const isMale = normalizedGender === 'M';

      // Calculate clearance: Male: 1.23 × weight × (140 - age) / creatinine, Female: 1.04 × weight × (140 - age) / creatinine
      const multiplier = isMale ? 1.23 : 1.04;
      const clearance = (multiplier * weight * (140 - adjustedAge)) / creatinine;
      
      // Round to 2 decimal places and ensure it's within valid range
      const roundedClearance = Math.round(clearance * 100) / 100;
      if (roundedClearance >= 10 && roundedClearance <= 200) {
        normalizedResponse.clairance_creatinine = roundedClearance;
      }
    }
  }

  const { data, error } = await supabase
    .from('responses_biological_assessment')
    .upsert(normalizedResponse, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ===== ECG (ELECTROCARDIOGRAMME) =====

export async function getEcgResponse(
  visitId: string
): Promise<EcgResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_ecg')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      // Table doesn't exist yet - migration not applied
      console.warn(`Table responses_ecg not found. Please run migrations.`);
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveEcgResponse(
  response: EcgResponseInsert
): Promise<EcgResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  let interpretation = '';
  let alertMessage = '';

  if (response.ecg_performed === 'yes' && response.qt_measured && response.rr_measured) {
    // Calculate QTc using Bazett's formula: QTc = QT / √RR
    const qtc = response.qt_measured / Math.sqrt(response.rr_measured);

    // Generate interpretation based on QTc value
    if (qtc < 0.35) {
      alertMessage = 'ATTENTION : QTc court. Rechercher une hypercalcémie ou une imprégnation digitalique.';
      interpretation = `QTc = ${qtc.toFixed(3)}s. ${alertMessage}`;
    } else if (qtc >= 0.35 && qtc <= 0.43) {
      interpretation = `QTc = ${qtc.toFixed(3)}s. QTc normal (homme).`;
    } else if (qtc > 0.43 && qtc <= 0.468) {
      interpretation = `QTc = ${qtc.toFixed(3)}s. QTc légèrement allongé (homme) ou normal (femme ≤0.48).`;
    } else if (qtc > 0.468 && qtc <= 0.48) {
      alertMessage = 'ATTENTION : QTc allongé chez l\'homme. Envisager une consultation cardiologique.';
      interpretation = `QTc = ${qtc.toFixed(3)}s. ${alertMessage}`;
    } else if (qtc > 0.48 && qtc <= 0.528) {
      alertMessage = 'ATTENTION : QTc allongé. Envisager une consultation cardiologique.';
      interpretation = `QTc = ${qtc.toFixed(3)}s. ${alertMessage}`;
    } else {
      alertMessage = 'ALERTE : QTc très allongé (>0.528). Risque élevé de torsade de pointes. Consultation cardiologique urgente recommandée.';
      interpretation = `QTc = ${qtc.toFixed(3)}s. ${alertMessage}`;
    }

    // Additional interpretation based on heart rate
    if (response.heart_rate) {
      if (response.heart_rate < 50) {
        interpretation += ' Bradycardie.';
      } else if (response.heart_rate > 100) {
        interpretation += ' Tachycardie.';
      }
    }
  } else if (response.ecg_performed === 'yes') {
    interpretation = 'ECG effectué. Mesures incomplètes pour le calcul du QTc.';
  } else {
    interpretation = 'ECG non effectué.';
  }

  const { data, error } = await supabase
    .from('responses_ecg')
    .upsert({
      ...response,
      interpretation,
      alert_message: alertMessage || null,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

