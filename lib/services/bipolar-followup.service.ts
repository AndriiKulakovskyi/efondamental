// eFondaMental Platform - Bipolar Followup Questionnaire Service
// Service functions for semestrial and annual visit questionnaires

import { createClient } from '@/lib/supabase/server';
import {
  BipolarFollowupHumeurActuelsResponse,
  BipolarFollowupHumeurActuelsResponseInsert,
  BipolarFollowupHumeurDepuisVisiteResponse,
  BipolarFollowupHumeurDepuisVisiteResponseInsert,
  BipolarFollowupPsychotiquesResponse,
  BipolarFollowupPsychotiquesResponseInsert,
  BipolarFollowupIsaResponse,
  BipolarFollowupIsaResponseInsert,
  BipolarFollowupSuicideBehaviorResponse,
  BipolarFollowupSuicideBehaviorResponseInsert,
  BipolarFollowupSuiviRecommandationsResponse,
  BipolarFollowupSuiviRecommandationsResponseInsert,
  BipolarFollowupRecoursAuxSoinsResponse,
  BipolarFollowupRecoursAuxSoinsResponseInsert,
  BipolarFollowupTraitementNonPharmaResponse,
  BipolarFollowupTraitementNonPharmaResponseInsert,
  BipolarFollowupArretsTravailResponse,
  BipolarFollowupArretsTravailResponseInsert,
  BipolarFollowupSomatiqueContraceptifResponse,
  BipolarFollowupSomatiqueContraceptifResponseInsert,
  BipolarFollowupStatutProfessionnelResponse,
  BipolarFollowupStatutProfessionnelResponseInsert
} from '@/lib/questionnaires/bipolar/followup';

import { scoreIsaFollowup } from '@/lib/questionnaires/bipolar/followup/suicide/isa-followup';
import { scoreSuicideBehaviorFollowup } from '@/lib/questionnaires/bipolar/followup/suicide/suicide-behavior-followup';

// ============================================================================
// DSM5 - Humeur Actuels (Current Mood Disorders)
// ============================================================================

export async function getHumeurActuelsResponse(
  visitId: string
): Promise<BipolarFollowupHumeurActuelsResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_followup_humeur_actuels')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveHumeurActuelsResponse(
  response: BipolarFollowupHumeurActuelsResponseInsert
): Promise<BipolarFollowupHumeurActuelsResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('bipolar_followup_humeur_actuels')
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
// DSM5 - Humeur Depuis Visite (Episodes Since Last Visit)
// ============================================================================

export async function getHumeurDepuisVisiteResponse(
  visitId: string
): Promise<BipolarFollowupHumeurDepuisVisiteResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_followup_humeur_depuis_visite')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveHumeurDepuisVisiteResponse(
  response: BipolarFollowupHumeurDepuisVisiteResponseInsert
): Promise<BipolarFollowupHumeurDepuisVisiteResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('bipolar_followup_humeur_depuis_visite')
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
// DSM5 - Psychotiques (Psychotic Disorders)
// ============================================================================

export async function getPsychotiquesResponse(
  visitId: string
): Promise<BipolarFollowupPsychotiquesResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_followup_psychotiques')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function savePsychotiquesResponse(
  response: BipolarFollowupPsychotiquesResponseInsert
): Promise<BipolarFollowupPsychotiquesResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('bipolar_followup_psychotiques')
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
// Suicide - ISA Followup
// ============================================================================

export async function getIsaFollowupResponse(
  visitId: string
): Promise<BipolarFollowupIsaResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_followup_isa')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveIsaFollowupResponse(
  response: BipolarFollowupIsaResponseInsert
): Promise<BipolarFollowupIsaResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Compute scoring
  const scoring = scoreIsaFollowup({
    q1_life_worth: response.q1_life_worth,
    q2_wish_death: response.q2_wish_death,
    q3_thoughts: response.q3_thoughts,
    q4_plan: response.q4_plan,
    q5_attempt: response.q5_attempt,
    q1_time: response.q1_time,
    q2_time: response.q2_time,
    q3_time: response.q3_time,
    q4_time: response.q4_time,
    q5_time: response.q5_time
  });

  const { data, error } = await supabase
    .from('bipolar_followup_isa')
    .upsert({
      ...response,
      risk_level: scoring.risk_level_label,
      interpretation: scoring.interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Suicide - Suicide Behavior Followup
// ============================================================================

export async function getSuicideBehaviorFollowupResponse(
  visitId: string
): Promise<BipolarFollowupSuicideBehaviorResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_followup_suicide_behavior')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveSuicideBehaviorFollowupResponse(
  response: BipolarFollowupSuicideBehaviorResponseInsert
): Promise<BipolarFollowupSuicideBehaviorResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Compute scoring
  const scoring = scoreSuicideBehaviorFollowup({
    q1_self_harm: response.q1_self_harm,
    q2_interrupted: response.q2_interrupted,
    q3_aborted: response.q3_aborted,
    q4_preparations: response.q4_preparations,
    q2_1_interrupted_count: response.q2_1_interrupted_count,
    q3_1_aborted_count: response.q3_1_aborted_count
  });

  const { data, error } = await supabase
    .from('bipolar_followup_suicide_behavior')
    .upsert({
      ...response,
      risk_level: scoring.risk_level_label,
      interpretation: scoring.interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Soin Suivi - Suivi Recommandations
// ============================================================================

export async function getSuiviRecommandationsResponse(
  visitId: string
): Promise<BipolarFollowupSuiviRecommandationsResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_followup_suivi_recommandations')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveSuiviRecommandationsResponse(
  response: BipolarFollowupSuiviRecommandationsResponseInsert
): Promise<BipolarFollowupSuiviRecommandationsResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('bipolar_followup_suivi_recommandations')
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
// Soin Suivi - Recours aux Soins
// ============================================================================

export async function getRecoursAuxSoinsResponse(
  visitId: string
): Promise<BipolarFollowupRecoursAuxSoinsResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_followup_recours_aux_soins')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveRecoursAuxSoinsResponse(
  response: BipolarFollowupRecoursAuxSoinsResponseInsert
): Promise<BipolarFollowupRecoursAuxSoinsResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('bipolar_followup_recours_aux_soins')
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
// Soin Suivi - Traitement Non-Pharmacologique
// ============================================================================

export async function getTraitementNonPharmaResponse(
  visitId: string
): Promise<BipolarFollowupTraitementNonPharmaResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_followup_traitement_non_pharma')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveTraitementNonPharmaResponse(
  response: BipolarFollowupTraitementNonPharmaResponseInsert
): Promise<BipolarFollowupTraitementNonPharmaResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('bipolar_followup_traitement_non_pharma')
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
// Soin Suivi - Arrets de Travail
// ============================================================================

export async function getArretsTravailResponse(
  visitId: string
): Promise<BipolarFollowupArretsTravailResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_followup_arrets_travail')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveArretsTravailResponse(
  response: BipolarFollowupArretsTravailResponseInsert
): Promise<BipolarFollowupArretsTravailResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('bipolar_followup_arrets_travail')
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
// Soin Suivi - Somatique et Contraceptif
// ============================================================================

export async function getSomatiqueContraceptifResponse(
  visitId: string
): Promise<BipolarFollowupSomatiqueContraceptifResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_followup_somatique_contraceptif')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveSomatiqueContraceptifResponse(
  response: BipolarFollowupSomatiqueContraceptifResponseInsert
): Promise<BipolarFollowupSomatiqueContraceptifResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('bipolar_followup_somatique_contraceptif')
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
// Soin Suivi - Statut Professionnel
// ============================================================================

export async function getStatutProfessionnelResponse(
  visitId: string
): Promise<BipolarFollowupStatutProfessionnelResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_followup_statut_professionnel')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveStatutProfessionnelResponse(
  response: BipolarFollowupStatutProfessionnelResponseInsert
): Promise<BipolarFollowupStatutProfessionnelResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('bipolar_followup_statut_professionnel')
    .upsert({
      ...response,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}
