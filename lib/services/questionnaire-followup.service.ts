// eFondaMental Platform - Follow-up Questionnaire Service
// Module: Soin, suivi et arret de travail
// Service functions for follow-up care questionnaires

import { createClient } from '@/lib/supabase/server';
import {
  PsyTraitementSemestrielResponse,
  PsyTraitementSemestrielResponseInsert
} from '@/lib/types/database.types';

// ============================================================================
// Shared getter for all questionnaires in this module
// ============================================================================

export async function getPsyTraitementSemestrielResponse(
  visitId: string
): Promise<PsyTraitementSemestrielResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_psy_traitement_semestriel')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      console.warn(`Table responses_psy_traitement_semestriel not found. Please run migrations.`);
      return null;
    }
    throw error;
  }
  return data;
}

// ============================================================================
// SUIVI DES RECOMMANDATIONS
// ============================================================================

export async function getSuiviRecommandationsResponse(
  visitId: string
): Promise<PsyTraitementSemestrielResponse | null> {
  return getPsyTraitementSemestrielResponse(visitId);
}

export async function saveSuiviRecommandationsResponse(
  response: PsyTraitementSemestrielResponseInsert
): Promise<PsyTraitementSemestrielResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('responses_psy_traitement_semestriel')
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
// RECOURS AUX SOINS
// ============================================================================

export async function getRecoursAuxSoinsResponse(
  visitId: string
): Promise<PsyTraitementSemestrielResponse | null> {
  return getPsyTraitementSemestrielResponse(visitId);
}

export async function saveRecoursAuxSoinsResponse(
  response: PsyTraitementSemestrielResponseInsert
): Promise<PsyTraitementSemestrielResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('responses_psy_traitement_semestriel')
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
// TRAITEMENT NON-PHARMACOLOGIQUE
// ============================================================================

export async function getTraitementNonPharmacologiqueResponse(
  visitId: string
): Promise<PsyTraitementSemestrielResponse | null> {
  return getPsyTraitementSemestrielResponse(visitId);
}

export async function saveTraitementNonPharmacologiqueResponse(
  response: PsyTraitementSemestrielResponseInsert
): Promise<PsyTraitementSemestrielResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('responses_psy_traitement_semestriel')
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
// ARRETS DE TRAVAIL
// ============================================================================

export async function getArretsTravailResponse(
  visitId: string
): Promise<PsyTraitementSemestrielResponse | null> {
  return getPsyTraitementSemestrielResponse(visitId);
}

export async function saveArretsTravailResponse(
  response: PsyTraitementSemestrielResponseInsert
): Promise<PsyTraitementSemestrielResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('responses_psy_traitement_semestriel')
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
// SOMATIQUE ET CONTRACEPTIF
// ============================================================================

export async function getSomatiqueContraceptifResponse(
  visitId: string
): Promise<PsyTraitementSemestrielResponse | null> {
  return getPsyTraitementSemestrielResponse(visitId);
}

export async function saveSomatiqueContraceptifResponse(
  response: PsyTraitementSemestrielResponseInsert
): Promise<PsyTraitementSemestrielResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('responses_psy_traitement_semestriel')
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
// STATUT PROFESSIONNEL
// ============================================================================

export async function getStatutProfessionnelResponse(
  visitId: string
): Promise<PsyTraitementSemestrielResponse | null> {
  return getPsyTraitementSemestrielResponse(visitId);
}

export async function saveStatutProfessionnelResponse(
  response: PsyTraitementSemestrielResponseInsert
): Promise<PsyTraitementSemestrielResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('responses_psy_traitement_semestriel')
    .upsert({
      ...response,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}
