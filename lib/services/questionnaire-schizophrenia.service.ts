// eFondaMental Platform - Schizophrenia Questionnaire Service
// Service functions for schizophrenia screening and initial evaluation questionnaires

import { createClient } from '../supabase/server';
import {
  ScreeningSzDiagnosticResponse,
  ScreeningSzDiagnosticResponseInsert,
  ScreeningSzOrientationResponse,
  ScreeningSzOrientationResponseInsert,
  DossierInfirmierSzResponse,
  DossierInfirmierSzResponseInsert,
  BilanBiologiqueSzResponse,
  BilanBiologiqueSzResponseInsert,
  PanssResponse,
  PanssResponseInsert,
  CdssResponse,
  CdssResponseInsert,
  BarsResponse,
  BarsResponseInsert,
  SumdResponse,
  SumdResponseInsert,
  AimsResponse,
  AimsResponseInsert,
  BarnesResponse,
  BarnesResponseInsert,
  SasResponse,
  SasResponseInsert,
  PspResponse,
  PspResponseInsert,
} from '../types/database.types';

// ============================================================================
// SCHIZOPHRENIA SCREENING DIAGNOSTIC
// ============================================================================

export async function getScreeningSzDiagnosticResponse(
  visitId: string
): Promise<ScreeningSzDiagnosticResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_screening_sz_diagnostic')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }
  return data;
}

export async function saveScreeningSzDiagnosticResponse(
  response: ScreeningSzDiagnosticResponseInsert
): Promise<ScreeningSzDiagnosticResponse> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_screening_sz_diagnostic')
    .upsert(response, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// SCHIZOPHRENIA SCREENING ORIENTATION CENTRE EXPERT
// ============================================================================

export async function getScreeningSzOrientationResponse(
  visitId: string
): Promise<ScreeningSzOrientationResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_screening_sz_orientation')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }
  return data;
}

export async function saveScreeningSzOrientationResponse(
  response: ScreeningSzOrientationResponseInsert
): Promise<ScreeningSzOrientationResponse> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_screening_sz_orientation')
    .upsert(response, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// SCHIZOPHRENIA DOSSIER INFIRMIER (INITIAL EVALUATION)
// ============================================================================

export async function getDossierInfirmierSzResponse(
  visitId: string
): Promise<DossierInfirmierSzResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_dossier_infirmier_sz')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }
  return data;
}

export async function saveDossierInfirmierSzResponse(
  response: DossierInfirmierSzResponseInsert
): Promise<DossierInfirmierSzResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Remove computed fields and section fields that shouldn't be saved to DB
  const {
    bmi,
    elec_qtc,
    section_physical_params,
    section_bp_lying,
    section_ecg,
    titre_cardio,
    ...responseData
  } = response as any;

  const { data, error } = await supabase
    .from('responses_dossier_infirmier_sz')
    .upsert({
      ...responseData,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// SCHIZOPHRENIA BILAN BIOLOGIQUE (INITIAL EVALUATION - NURSE ASSESSMENT)
// ============================================================================

export async function getBilanBiologiqueSzResponse(
  visitId: string
): Promise<BilanBiologiqueSzResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_bilan_biologique_sz')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }
  return data;
}

export async function saveBilanBiologiqueSzResponse(
  response: BilanBiologiqueSzResponseInsert
): Promise<BilanBiologiqueSzResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Remove section and instruction fields that shouldn't be saved to DB
  const {
    section_date,
    section_biochimie,
    section_lipidique,
    section_nfs,
    section_hormonaux,
    section_psychotropes,
    section_vitamine_d,
    section_toxo,
    // Instruction/info fields from Biochimie section
    titre_avertissement,
    html_crp_info,
    titre_hemo_glyc_diabete,
    html_vitd,
    // Instruction fields from Dosages Hormonaux section
    titre_prolactine,
    // Instruction fields from Dosage des Psychotropes section
    titre_prisetraitement,
    // Instruction fields from Vitamine D section
    html_spec_cutane,
    // Instruction fields from Serologie Toxoplasmose section
    html_toxo,
    html_interpretation,
    ...responseData
  } = response as any;

  // Calculate chol_rapport_hdltot if both values are available
  let chol_rapport_hdltot = null;
  if (responseData.chol_total && responseData.chol_hdl && responseData.chol_hdl > 0) {
    // Both values need to be in the same unit for calculation
    chol_rapport_hdltot = responseData.chol_total / responseData.chol_hdl;
  }

  const { data, error } = await supabase
    .from('responses_bilan_biologique_sz')
    .upsert({
      ...responseData,
      chol_rapport_hdltot,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// PANSS (Positive and Negative Syndrome Scale) - SCHIZOPHRENIA HETERO-QUESTIONNAIRE
// ============================================================================
// 30-item clinician-rated scale for measuring symptom severity of schizophrenia
// Scoring:
//   - Positive subscale (P1-P7): range 7-49
//   - Negative subscale (N1-N7): range 7-49
//   - General psychopathology (G1-G16): range 16-112
//   - Total score: range 30-210
// Plus three 5-factor models: Wallwork 2012, Lancon 1998, Van der Gaag 2006

export async function getPanssResponse(
  visitId: string
): Promise<PanssResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_panss')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    if (error.code === 'PGRST205') {
      console.warn('Table responses_panss not found. Please run migrations.');
      return null;
    }
    throw error;
  }
  return data;
}

export async function savePanssResponse(
  response: PanssResponseInsert
): Promise<PanssResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Remove section fields that shouldn't be saved to DB
  const {
    section_positive,
    section_negative,
    section_general,
    ...responseData
  } = response as any;

  // Extract item values (convert undefined to null for consistent handling)
  const p1 = responseData.p1 ?? null;
  const p2 = responseData.p2 ?? null;
  const p3 = responseData.p3 ?? null;
  const p4 = responseData.p4 ?? null;
  const p5 = responseData.p5 ?? null;
  const p6 = responseData.p6 ?? null;
  const p7 = responseData.p7 ?? null;
  const n1 = responseData.n1 ?? null;
  const n2 = responseData.n2 ?? null;
  const n3 = responseData.n3 ?? null;
  const n4 = responseData.n4 ?? null;
  const n5 = responseData.n5 ?? null;
  const n6 = responseData.n6 ?? null;
  const n7 = responseData.n7 ?? null;
  const g1 = responseData.g1 ?? null;
  const g2 = responseData.g2 ?? null;
  const g3 = responseData.g3 ?? null;
  const g4 = responseData.g4 ?? null;
  const g5 = responseData.g5 ?? null;
  const g6 = responseData.g6 ?? null;
  const g7 = responseData.g7 ?? null;
  const g8 = responseData.g8 ?? null;
  const g9 = responseData.g9 ?? null;
  const g10 = responseData.g10 ?? null;
  const g11 = responseData.g11 ?? null;
  const g12 = responseData.g12 ?? null;
  const g13 = responseData.g13 ?? null;
  const g14 = responseData.g14 ?? null;
  const g15 = responseData.g15 ?? null;
  const g16 = responseData.g16 ?? null;

  // Helper function to sum values, returns null if any value is null
  const sumIfComplete = (values: (number | null)[]): number | null => {
    if (values.some(v => v === null)) return null;
    return values.reduce<number>((sum, v) => sum + (v as number), 0);
  };

  // Calculate Traditional Subscale Scores
  const positive_score = sumIfComplete([p1, p2, p3, p4, p5, p6, p7]);
  const negative_score = sumIfComplete([n1, n2, n3, n4, n5, n6, n7]);
  const general_score = sumIfComplete([g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12, g13, g14, g15, g16]);
  
  // Total score requires all subscales
  const total_score = (positive_score !== null && negative_score !== null && general_score !== null)
    ? positive_score + negative_score + general_score
    : null;

  // ========================================================================
  // Wallwork 2012 Five-Factor Model
  // Reference: Wallwork RS et al. (2012). Schizophr Res. 137(1-3):246-50
  // ========================================================================
  const wallwork_positive = sumIfComplete([p1, p3, p5, g9]); // P1+P3+P5+G9
  const wallwork_negative = sumIfComplete([n1, n2, n3, n4, n6, g7]); // N1+N2+N3+N4+N6+G7
  const wallwork_disorganized = sumIfComplete([p2, n5, g11]); // P2+N5+G11
  const wallwork_excited = sumIfComplete([p4, p7, g8, g14]); // P4+P7+G8+G14
  const wallwork_depressed = sumIfComplete([g2, g3, g6]); // G2+G3+G6

  // ========================================================================
  // Lancon 1998 Five-Factor Model
  // Reference: Lancon C et al. (1998). Schizophr Res. 42(3):231-9
  // ========================================================================
  const lancon_positive = sumIfComplete([p1, p3, g9, p5, p6]); // P1+P3+G9+P5+P6
  const lancon_negative = sumIfComplete([n1, n2, n3, n4, n6, g7, g16]); // N1+N2+N3+N4+N6+G7+G16
  const lancon_disorganized = sumIfComplete([g10, n5, p2]); // G10+N5+P2
  const lancon_excited = sumIfComplete([g4, p4, g14, p7, g8]); // G4+P4+G14+P7+G8
  const lancon_depressed = sumIfComplete([g1, g3, g6, g2]); // G1+G3+G6+G2

  // ========================================================================
  // Van der Gaag 2006 Five-Factor Model
  // Reference: Van der Gaag M et al. (2006). Schizophr Res. 85(1-3):280-7
  // ========================================================================
  const vandergaag_positive = sumIfComplete([p1, p3, g9, p6, p5]); // P1+P3+G9+P6+P5
  const vandergaag_negative = sumIfComplete([n6, n1, n2, n4, g7, n3, g16, g8]); // N6+N1+N2+N4+G7+N3+G16+G8
  const vandergaag_disorganized = sumIfComplete([n7, g11, g10, p2, n5, g5, g12, g13]); // N7+G11+G10+P2+N5+G5+G12+G13
  const vandergaag_excited = sumIfComplete([g14, p4, p7, g8]); // G14+P4+P7+G8
  const vandergaag_depressed = sumIfComplete([g2, g6, g3, g4]); // G2+G6+G3+G4

  const { data, error } = await supabase
    .from('responses_panss')
    .upsert({
      ...responseData,
      // Traditional subscale scores
      positive_score,
      negative_score,
      general_score,
      total_score,
      // Wallwork 2012 five-factor scores
      wallwork_positive,
      wallwork_negative,
      wallwork_disorganized,
      wallwork_excited,
      wallwork_depressed,
      // Lancon 1998 five-factor scores
      lancon_positive,
      lancon_negative,
      lancon_disorganized,
      lancon_excited,
      lancon_depressed,
      // Van der Gaag 2006 five-factor scores
      vandergaag_positive,
      vandergaag_negative,
      vandergaag_disorganized,
      vandergaag_excited,
      vandergaag_depressed,
      // Metadata
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// CDSS (Calgary Depression Scale for Schizophrenia) - SCHIZOPHRENIA HETERO-QUESTIONNAIRE
// ============================================================================
// 9-item clinician-rated scale for assessing depression in schizophrenia patients
// Scoring: Total score range 0-27, Clinical cutoff >6 indicates depressive syndrome

export async function getCdssResponse(
  visitId: string
): Promise<CdssResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_cdss')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    if (error.code === 'PGRST205') {
      console.warn('Table responses_cdss not found. Please run migrations.');
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveCdssResponse(
  response: CdssResponseInsert
): Promise<CdssResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Remove section fields that shouldn't be saved to DB
  const {
    cdss_instructions,
    ...responseData
  } = response as any;

  // Extract item values
  const q1 = responseData.q1 ?? null;
  const q2 = responseData.q2 ?? null;
  const q3 = responseData.q3 ?? null;
  const q4 = responseData.q4 ?? null;
  const q5 = responseData.q5 ?? null;
  const q6 = responseData.q6 ?? null;
  const q7 = responseData.q7 ?? null;
  const q8 = responseData.q8 ?? null;
  const q9 = responseData.q9 ?? null;

  // Calculate total score (sum of all items, 0-27)
  const items = [q1, q2, q3, q4, q5, q6, q7, q8, q9];
  const allAnswered = items.every(item => item !== null);
  
  let total_score: number | null = null;
  let has_depressive_syndrome: boolean | null = null;
  let interpretation: string | null = null;

  if (allAnswered) {
    const score = items.reduce<number>((sum, item) => sum + (item as number), 0);
    total_score = score;
    // Clinical cutoff: >6 indicates depressive syndrome
    has_depressive_syndrome = score > 6;
    interpretation = has_depressive_syndrome 
      ? 'Presence d\'un syndrome depressif (score > 6)'
      : 'Absence de syndrome depressif significatif (score <= 6)';
  }

  const { data, error } = await supabase
    .from('responses_cdss')
    .upsert({
      ...responseData,
      total_score,
      has_depressive_syndrome,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// BARS (Brief Adherence Rating Scale) - SCHIZOPHRENIA HETERO-QUESTIONNAIRE
// ============================================================================
// 3-item clinician-administered scale for assessing medication adherence
// Scoring: ((30 - days_missed - days_reduced) / 30) x 100 = adherence percentage

export async function getBarsResponse(
  visitId: string
): Promise<BarsResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_bars')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    if (error.code === 'PGRST205') {
      console.warn('Table responses_bars not found. Please run migrations.');
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveBarsResponse(
  response: BarsResponseInsert
): Promise<BarsResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Remove section fields that shouldn't be saved to DB
  const {
    bars_instructions,
    ...responseData
  } = response as any;

  // Extract item values
  const q1 = responseData.q1 ?? null;
  const q2 = responseData.q2 ?? null;
  const q3 = responseData.q3 ?? null;

  // Calculate adherence score
  // Formula: ((30 - days_missed - days_reduced) / 30) x 100
  // Clamp to 0 if q2 + q3 > 30
  let adherence_score: number | null = null;
  let interpretation: string | null = null;

  if (q2 !== null && q3 !== null) {
    const missedDays = q2 + q3;
    adherence_score = Math.max(0, Math.round(((30 - missedDays) / 30) * 100));
    
    // Clinical interpretation based on score
    if (adherence_score >= 91) {
      interpretation = 'Bonne observance (91-100%)';
    } else if (adherence_score >= 76) {
      interpretation = 'Observance acceptable (76-90%)';
    } else if (adherence_score >= 51) {
      interpretation = 'Observance partielle (51-75%)';
    } else {
      interpretation = 'Observance tres faible (0-50%)';
    }
  }

  const { data, error } = await supabase
    .from('responses_bars')
    .upsert({
      ...responseData,
      adherence_score,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// SUMD (Scale to Assess Unawareness of Mental Disorder) - SCHIZOPHRENIA HETERO-QUESTIONNAIRE
// ============================================================================
// 9-domain scale assessing awareness (insight) of mental illness
// Key rule: If conscience = 0 or 3, attribution must be 0

export async function getSumdResponse(
  visitId: string
): Promise<SumdResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_sumd')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    if (error.code === 'PGRST205') {
      console.warn('Table responses_sumd not found. Please run migrations.');
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveSumdResponse(
  response: SumdResponseInsert
): Promise<SumdResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Remove section fields that shouldn't be saved to DB
  const {
    sumd_instructions,
    section_domain1,
    section_domain2,
    section_domain3,
    section_domain4,
    section_domain5,
    section_domain6,
    section_domain7,
    section_domain8,
    section_domain9,
    ...responseData
  } = response as any;

  // Extract conscience values
  const conscience4 = responseData.conscience4 ?? null;
  const conscience5 = responseData.conscience5 ?? null;
  const conscience6 = responseData.conscience6 ?? null;
  const conscience7 = responseData.conscience7 ?? null;
  const conscience8 = responseData.conscience8 ?? null;
  const conscience9 = responseData.conscience9 ?? null;

  // Apply attribution dependency rule:
  // If conscience = 0 (Non cotable) or 3 (Inconscient), attribution must be 0 (Non cotable)
  const applyAttributionRule = (conscienceValue: number | null, attributionValue: number | null): number | null => {
    if (conscienceValue === 0 || conscienceValue === 3) {
      return 0; // Force attribution to Non cotable
    }
    return attributionValue;
  };

  // Apply rules to all attribution items
  const attribu4 = applyAttributionRule(conscience4, responseData.attribu4 ?? null);
  const attribu5 = applyAttributionRule(conscience5, responseData.attribu5 ?? null);
  const attribu6 = applyAttributionRule(conscience6, responseData.attribu6 ?? null);
  const attribu7 = applyAttributionRule(conscience7, responseData.attribu7 ?? null);
  const attribu8 = applyAttributionRule(conscience8, responseData.attribu8 ?? null);
  const attribu9 = applyAttributionRule(conscience9, responseData.attribu9 ?? null);

  const { data, error } = await supabase
    .from('responses_sumd')
    .upsert({
      ...responseData,
      attribu4,
      attribu5,
      attribu6,
      attribu7,
      attribu8,
      attribu9,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// AIMS (Abnormal Involuntary Movement Scale) - SCHIZOPHRENIA HETERO-QUESTIONNAIRE
// ============================================================================
// 12-item scale for assessing tardive dyskinesia and movement disorders
// Movement score = sum of items 1-7 (0-28)

export async function getAimsResponse(
  visitId: string
): Promise<AimsResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_aims')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    if (error.code === 'PGRST205') {
      console.warn('Table responses_aims not found. Please run migrations.');
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveAimsResponse(
  response: AimsResponseInsert
): Promise<AimsResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Remove section fields that shouldn't be saved to DB
  const {
    aims_instructions,
    section_orofacial,
    section_extremities,
    section_trunk,
    section_global,
    section_dental,
    ...responseData
  } = response as any;

  // Calculate movement score (sum of items 1-7)
  const q1 = responseData.q1 ?? null;
  const q2 = responseData.q2 ?? null;
  const q3 = responseData.q3 ?? null;
  const q4 = responseData.q4 ?? null;
  const q5 = responseData.q5 ?? null;
  const q6 = responseData.q6 ?? null;
  const q7 = responseData.q7 ?? null;

  let movement_score: number | null = null;
  let interpretation: string | null = null;

  // Calculate if at least one movement item is answered
  const movementItems = [q1, q2, q3, q4, q5, q6, q7];
  const answeredItems = movementItems.filter(item => item !== null);

  if (answeredItems.length > 0) {
    const score = movementItems.reduce<number>((sum, item) => sum + (item ?? 0), 0);
    movement_score = score;

    // Clinical interpretation based on movement score and individual items
    // Probable TD: score >= 2 on at least 2 body regions, OR score >= 3 on 1 region
    const hasModerateOrSevere = movementItems.some(item => item !== null && item >= 3);
    const lightOrMoreCount = movementItems.filter(item => item !== null && item >= 2).length;

    if (hasModerateOrSevere || lightOrMoreCount >= 2) {
      if (score >= 14) {
        interpretation = 'Dyskinesie severe - Surveillance etroite recommandee';
      } else if (score >= 7) {
        interpretation = 'Dyskinesie moderee - Evaluation du traitement conseillee';
      } else {
        interpretation = 'Dyskinesie probable - A surveiller';
      }
    } else if (score > 0) {
      interpretation = 'Mouvements minimes - Surveillance de routine';
    } else {
      interpretation = 'Pas de mouvement anormal detecte';
    }
  }

  const { data, error } = await supabase
    .from('responses_aims')
    .upsert({
      ...responseData,
      movement_score,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// BARNES AKATHISIA RATING SCALE - SCHIZOPHRENIA HETERO-QUESTIONNAIRE
// ============================================================================
// 4-item scale for assessing drug-induced akathisia
// - Objective/Subjective score = sum of items 1-3 (0-9)
// - Global score = item 4 (0-5)

export async function getBarnesResponse(
  visitId: string
): Promise<BarnesResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_barnes')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    if (error.code === 'PGRST205') {
      console.warn('Table responses_barnes not found. Please run migrations.');
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveBarnesResponse(
  response: BarnesResponseInsert
): Promise<BarnesResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Remove section fields that shouldn't be saved to DB
  const {
    barnes_instructions,
    section_objective,
    section_subjective,
    section_global,
    ...responseData
  } = response as any;

  const q1 = responseData.q1 ?? null; // Objective
  const q2 = responseData.q2 ?? null; // Agitation awareness
  const q3 = responseData.q3 ?? null; // Distress
  const q4 = responseData.q4 ?? null; // Global evaluation

  let objective_subjective_score: number | null = null;
  let global_score: number | null = null;
  let interpretation: string | null = null;

  // Calculate objective/subjective score (sum of items 1-3)
  if (q1 !== null || q2 !== null || q3 !== null) {
    objective_subjective_score = (q1 ?? 0) + (q2 ?? 0) + (q3 ?? 0);
  }

  // Global score is direct copy of item 4
  if (q4 !== null) {
    global_score = q4;

    // Clinical interpretation based on global score
    switch (q4) {
      case 0:
        interpretation = 'Absence - Pas d\'akathisie';
        break;
      case 1:
        interpretation = 'Douteux - Akathisie questionnable';
        break;
      case 2:
        interpretation = 'Legere - Akathisie legere, peu de gene';
        break;
      case 3:
        interpretation = 'Moyenne - Akathisie moderee, genante';
        break;
      case 4:
        interpretation = 'Marquee - Akathisie significative, eprouvante';
        break;
      case 5:
        interpretation = 'Severe - Akathisie severe avec detresse intense';
        break;
      default:
        interpretation = 'Score invalide';
    }
  }

  const { data, error } = await supabase
    .from('responses_barnes')
    .upsert({
      ...responseData,
      objective_subjective_score,
      global_score,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// SIMPSON-ANGUS SCALE (SAS) - EXTRAPYRAMIDAL SIDE EFFECTS
// ============================================================================
// 10-item scale for assessing drug-induced parkinsonism and EPS
// Score: Mean of all 10 items (0.0 - 4.0)

export async function getSasResponse(
  visitId: string
): Promise<SasResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_sas')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    if (error.code === 'PGRST205') {
      console.warn('Table responses_sas not found. Please run migrations.');
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveSasResponse(
  response: SasResponseInsert
): Promise<SasResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Remove section fields that shouldn't be saved to DB
  const {
    sas_instructions,
    ...responseData
  } = response as any;

  const items = [
    responseData.q1,
    responseData.q2,
    responseData.q3,
    responseData.q4,
    responseData.q5,
    responseData.q6,
    responseData.q7,
    responseData.q8,
    responseData.q9,
    responseData.q10
  ];

  let mean_score: number | null = null;
  let interpretation: string | null = null;

  // Calculate mean score only if all items are answered
  const allAnswered = items.every(item => item !== null && item !== undefined);

  if (allAnswered) {
    const sum = items.reduce<number>((acc, item) => acc + (item as number), 0);
    const score = sum / 10;
    mean_score = Math.round(score * 100) / 100; // Round to 2 decimal places

    // Clinical interpretation based on score
    if (score === 0) {
      interpretation = 'Absence de symptomes extrapyramidaux';
    } else if (score <= 0.3) {
      interpretation = 'Symptomes extrapyramidaux minimaux';
    } else if (score <= 1.0) {
      interpretation = 'Symptomes extrapyramidaux legers - Cliniquement significatifs';
    } else if (score <= 2.0) {
      interpretation = 'Symptomes extrapyramidaux moderes - Ajustement du traitement conseille';
    } else {
      interpretation = 'Symptomes extrapyramidaux severes - Intervention requise';
    }
  }

  const { data, error } = await supabase
    .from('responses_sas')
    .upsert({
      ...responseData,
      mean_score,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// PERSONAL AND SOCIAL PERFORMANCE SCALE (PSP)
// ============================================================================
// Clinician-rated scale assessing personal and social functioning
// Score: 1-100 (clinician-determined via 3-step process)

export async function getPspResponse(
  visitId: string
): Promise<PspResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_psp')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    if (error.code === 'PGRST205') {
      console.warn('Table responses_psp not found. Please run migrations.');
      return null;
    }
    throw error;
  }
  return data;
}

export async function savePspResponse(
  response: PspResponseInsert
): Promise<PspResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Remove section fields that shouldn't be saved to DB
  const {
    psp_instructions,
    step1_header,
    step2_header,
    step3_header,
    ...responseData
  } = response as any;

  const finalScore = responseData.final_score;
  let interpretation: string | null = null;

  // Generate interpretation based on final score
  if (finalScore !== null && finalScore !== undefined) {
    if (finalScore >= 91) {
      interpretation = 'Tres bon fonctionnement - Excellent dans tous les domaines';
    } else if (finalScore >= 81) {
      interpretation = 'Bon fonctionnement - Difficultes courantes seulement';
    } else if (finalScore >= 71) {
      interpretation = 'Difficultes legeres - Dans au moins un domaine';
    } else if (finalScore >= 61) {
      interpretation = 'Difficultes manifestes - Notables mais pas invalidantes';
    } else if (finalScore >= 51) {
      interpretation = 'Difficultes marquees - Significatives dans un domaine';
    } else if (finalScore >= 41) {
      interpretation = 'Difficultes marquees multiples ou severes - Fonctionnement substantiellement altere';
    } else if (finalScore >= 31) {
      interpretation = 'Difficultes severes combinees - Alteration severe du fonctionnement';
    } else if (finalScore >= 21) {
      interpretation = 'Difficultes severes majeures - Aide professionnelle necessaire';
    } else if (finalScore >= 11) {
      interpretation = 'Difficultes severes generalisees - Incapacite majeure';
    } else {
      interpretation = 'Absence d\'autonomie - Risque vital possible';
    }
  }

  const { data, error } = await supabase
    .from('responses_psp')
    .upsert({
      ...responseData,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}
