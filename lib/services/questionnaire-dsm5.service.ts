// eFondaMental Platform - DSM5 Questionnaire Service
// Service for handling DSM5 Mood Disorders, Psychotic Disorders, and Comorbid Disorders questionnaire responses

import { createClient } from '@/lib/supabase/server';
import {
  Dsm5HumeurResponse,
  Dsm5HumeurResponseInsert,
  Dsm5PsychoticResponse,
  Dsm5PsychoticResponseInsert,
  Dsm5ComorbidResponse,
  Dsm5ComorbidResponseInsert,
  DiagPsySemHumeurActuelsResponse,
  DiagPsySemHumeurActuelsResponseInsert,
  DiagPsySemHumeurDepuisVisiteResponse,
  DiagPsySemHumeurDepuisVisiteResponseInsert,
  DiagPsySemPsychotiquesResponse,
  DiagPsySemPsychotiquesResponseInsert
} from '@/lib/types/database.types';

// ============================================================================
// DSM5 Mood Disorders (Troubles de l'humeur)
// ============================================================================

export async function getDsm5HumeurResponse(
  visitId: string
): Promise<Dsm5HumeurResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_dsm5_humeur')
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
    .from('bipolar_dsm5_humeur')
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
    .from('bipolar_dsm5_psychotic')
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
    .from('bipolar_dsm5_psychotic')
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
    .from('bipolar_dsm5_comorbid')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  // Defensive normalization:
  // Some environments had a subset of DSM5_COMORBID eating-disorder fields stored as BOOLEAN.
  // The app expects 'oui'/'non' string codes, so map booleans back to strings for UI compatibility.
  if (data) {
    const normalized: any = { ...data };
    const booleanToOuiNon = (val: any) => {
      if (val === true) return 'oui';
      if (val === false) return 'non';
      return val;
    };

    const maybeBooleanYesNoFields = [
      'anorexia_bulimic_amenorrhea',
      'anorexia_bulimic_current',
      'anorexia_restrictive_amenorrhea',
      'anorexia_restrictive_current',
      'binge_eating_current',
      'bulimia_current'
    ];

    for (const field of maybeBooleanYesNoFields) {
      normalized[field] = booleanToOuiNon(normalized[field]);
    }

    return normalized;
  }

  return data;
}

export async function saveDsm5ComorbidResponse(
  response: Dsm5ComorbidResponseInsert
): Promise<Dsm5ComorbidResponse> {
  const supabase = await createClient();

  // Filter out all DIVA-related fields except diva_evaluated
  // These fields were moved to the separate DIVA questionnaire
  const divaFieldsToRemove = [
    // Inattention symptoms
    'diva_a1a_adult', 'diva_a1a_childhood',
    'diva_a1b_adult', 'diva_a1b_childhood',
    'diva_a1c_adult', 'diva_a1c_childhood',
    'diva_a1d_adult', 'diva_a1d_childhood',
    'diva_a1e_adult', 'diva_a1e_childhood',
    'diva_a1f_adult', 'diva_a1f_childhood',
    'diva_a1g_adult', 'diva_a1g_childhood',
    'diva_a1h_adult', 'diva_a1h_childhood',
    'diva_a1i_adult', 'diva_a1i_childhood',
    // Hyperactivity symptoms
    'diva_a2a_adult', 'diva_a2a_childhood',
    'diva_a2b_adult', 'diva_a2b_childhood',
    'diva_a2c_adult', 'diva_a2c_childhood',
    'diva_a2d_adult', 'diva_a2d_childhood',
    'diva_a2e_adult', 'diva_a2e_childhood',
    'diva_a2f_adult', 'diva_a2f_childhood',
    'diva_a2g_adult', 'diva_a2g_childhood',
    'diva_a2h_adult', 'diva_a2h_childhood',
    'diva_a2i_adult', 'diva_a2i_childhood',
    // Totals
    'diva_total_inattention_adult', 'diva_total_inattention_childhood',
    'diva_total_hyperactivity_adult', 'diva_total_hyperactivity_childhood',
    // Criteria
    'diva_criteria_a_inattention_gte6', 'diva_criteria_a_hyperactivity_gte6',
    'diva_criteria_b_lifetime_persistence',
    'diva_criteria_cd_impairment_childhood', 'diva_criteria_cd_impairment_adult',
    'diva_criteria_e_better_explained', 'diva_criteria_e_explanation',
    // Collateral
    'diva_collateral_parents', 'diva_collateral_partner',
    'diva_collateral_school_reports', 'diva_collateral_details',
    // Diagnosis
    'diva_diagnosis'
  ];

  // Create a clean response object without DIVA fields
  const cleanResponse = { ...response };
  divaFieldsToRemove.forEach(field => {
    delete (cleanResponse as any)[field];
  });

  const tryUpsert = async (payload: any) => {
    return await supabase
      .from('bipolar_dsm5_comorbid')
      .upsert(payload, { onConflict: 'visit_id' })
      .select()
      .single();
  };

  // First attempt: write as the app models it (string codes 'oui'/'non'/'ne_sais_pas')
  let { data, error } = await tryUpsert(cleanResponse);

  // Fallback: if the DB still has boolean columns for some fields,
  // retry by converting 'oui'/'non' to true/false.
  if (
    error &&
    error.code === '22P02' &&
    typeof error.message === 'string' &&
    error.message.includes('type boolean')
  ) {
    const toBool = (val: any) => {
      if (val === 'oui') return true;
      if (val === 'non') return false;
      if (val === 'ne_sais_pas') return null;
      return val;
    };

    // Retry 1: conservative conversion for known boolean offenders (eating-disorder yes/no flags)
    {
      const retryPayload: any = { ...cleanResponse };
      const maybeBooleanYesNoFields = [
        'anorexia_bulimic_amenorrhea',
        'anorexia_bulimic_current',
        'anorexia_restrictive_amenorrhea',
        'anorexia_restrictive_current',
        'binge_eating_current',
        'bulimia_current'
      ];

      for (const field of maybeBooleanYesNoFields) {
        retryPayload[field] = toBool(retryPayload[field]);
      }

      const retry = await tryUpsert(retryPayload);
      data = retry.data;
      error = retry.error;
    }

    // Retry 2: broad conversion (some environments have additional DSM5_COMORBID columns as BOOLEAN).
    // Convert all exact 'oui'/'non'/'ne_sais_pas' string values to boolean/null and retry once more.
    if (
      error &&
      error.code === '22P02' &&
      typeof error.message === 'string' &&
      error.message.includes('type boolean')
    ) {
      const broadPayload: any = { ...cleanResponse };
      for (const [key, value] of Object.entries(broadPayload)) {
        // Only convert exact tri-state strings; keep all other codes as-is.
        if (value === 'oui' || value === 'non' || value === 'ne_sais_pas') {
          broadPayload[key] = toBool(value);
        }
      }

      const retry = await tryUpsert(broadPayload);
      data = retry.data;
      error = retry.error;
    }
  }

  if (error) throw error;
  return data;
}

// ============================================================================
// Semi-Annual DSM5 Current Mood Disorders (Troubles de l'humeur actuels)
// ============================================================================

export async function getDiagPsySemHumeurActuelsResponse(
  visitId: string
): Promise<DiagPsySemHumeurActuelsResponse | null> {
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

export async function saveDiagPsySemHumeurActuelsResponse(
  response: DiagPsySemHumeurActuelsResponseInsert
): Promise<DiagPsySemHumeurActuelsResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bipolar_followup_humeur_actuels')
    .upsert(response, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Semi-Annual DSM5 Episodes Since Last Visit (Troubles de l'humeur depuis la dernière visite)
// ============================================================================

export async function getDiagPsySemHumeurDepuisVisiteResponse(
  visitId: string
): Promise<DiagPsySemHumeurDepuisVisiteResponse | null> {
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

export async function saveDiagPsySemHumeurDepuisVisiteResponse(
  response: DiagPsySemHumeurDepuisVisiteResponseInsert
): Promise<DiagPsySemHumeurDepuisVisiteResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bipolar_followup_humeur_depuis_visite')
    .upsert(response, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Semi-Annual DSM5 Psychotic Disorders (Troubles psychotiques)
// ============================================================================

export async function getDiagPsySemPsychotiquesResponse(
  visitId: string
): Promise<DiagPsySemPsychotiquesResponse | null> {
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

export async function saveDiagPsySemPsychotiquesResponse(
  response: DiagPsySemPsychotiquesResponseInsert
): Promise<DiagPsySemPsychotiquesResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bipolar_followup_psychotiques')
    .upsert(response, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}
