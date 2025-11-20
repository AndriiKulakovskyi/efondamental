// eFondaMental Platform - DSM5 Questionnaire Service
// Service for handling DSM5 Mood Disorders, Psychotic Disorders, and Comorbid Disorders questionnaire responses

import { createClient } from '@/lib/supabase/server';
import {
  Dsm5HumeurResponse,
  Dsm5HumeurResponseInsert,
  Dsm5PsychoticResponse,
  Dsm5PsychoticResponseInsert,
  Dsm5ComorbidResponse,
  Dsm5ComorbidResponseInsert
} from '@/lib/types/database.types';

// ============================================================================
// DSM5 Mood Disorders (Troubles de l'humeur)
// ============================================================================

export async function getDsm5HumeurResponse(
  visitId: string
): Promise<Dsm5HumeurResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_dsm5_humeur')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveDsm5HumeurResponse(
  response: Dsm5HumeurResponseInsert
): Promise<Dsm5HumeurResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('responses_dsm5_humeur')
    .upsert(response, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// DSM5 Psychotic Disorders (Trouble Psychotique)
// ============================================================================

export async function getDsm5PsychoticResponse(
  visitId: string
): Promise<Dsm5PsychoticResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_dsm5_psychotic')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveDsm5PsychoticResponse(
  response: Dsm5PsychoticResponseInsert
): Promise<Dsm5PsychoticResponse> {
  const supabase = await createClient();

  const { data, error} = await supabase
    .from('responses_dsm5_psychotic')
    .upsert(response, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// DSM5 Comorbid Disorders (Troubles comorbides)
// ============================================================================

export async function getDsm5ComorbidResponse(
  visitId: string
): Promise<Dsm5ComorbidResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_dsm5_comorbid')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveDsm5ComorbidResponse(
  response: Dsm5ComorbidResponseInsert
): Promise<Dsm5ComorbidResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('responses_dsm5_comorbid')
    .upsert(response, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

