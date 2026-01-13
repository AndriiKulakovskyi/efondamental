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
    return values.reduce((sum, v) => sum + (v as number), 0);
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
