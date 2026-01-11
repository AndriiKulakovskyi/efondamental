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
