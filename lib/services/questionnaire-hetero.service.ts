// eFondaMental Platform - Hetero Questionnaire Service
// Service functions for clinician-rated questionnaires

import { createClient } from '@/lib/supabase/server';
import {
  MadrsResponse,
  MadrsResponseInsert,
  YmrsResponse,
  YmrsResponseInsert,
  CgiResponse,
  CgiResponseInsert,
  EgfResponse,
  EgfResponseInsert,
  AldaResponse,
  AldaResponseInsert,
  EtatPatientResponse,
  EtatPatientResponseInsert,
  FastResponse,
  FastResponseInsert,
  DivaResponse,
  DivaResponseInsert,
  FamilyHistoryResponse,
  FamilyHistoryResponseInsert,
  CssrsResponse,
  CssrsResponseInsert,
  IsaResponse,
  IsaResponseInsert
} from '@/lib/types/database.types';

// ============================================================================
// MADRS (Montgomery-Åsberg Depression Rating Scale)
// ============================================================================

export async function getMadrsResponse(
  visitId: string
): Promise<MadrsResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_madrs')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      // Table doesn't exist yet - migration not applied
      console.warn(`Table responses_madrs not found. Please run migrations.`);
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveMadrsResponse(
  response: MadrsResponseInsert
): Promise<MadrsResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate total score (sum of 10 items)
  const items = [
    response.q1, response.q2, response.q3, response.q4, response.q5,
    response.q6, response.q7, response.q8, response.q9, response.q10
  ];
  
  const totalScore = items.reduce((sum: number, item) => sum + (item ?? 0), 0);

  // Determine interpretation based on cutoffs
  let interpretation = '';
  if (totalScore <= 6) {
    interpretation = 'Euthymie';
  } else if (totalScore <= 19) {
    interpretation = 'Dépression légère';
  } else if (totalScore <= 34) {
    interpretation = 'Dépression modérée';
  } else {
    interpretation = 'Dépression sévère';
  }

  const { data, error } = await supabase
    .from('responses_madrs')
    .upsert({
      ...response,
      total_score: totalScore,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// YMRS (Young Mania Rating Scale)
// ============================================================================

export async function getYmrsResponse(
  visitId: string
): Promise<YmrsResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_ymrs')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      // Table doesn't exist yet - migration not applied
      console.warn(`Table responses_ymrs not found. Please run migrations.`);
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveYmrsResponse(
  response: YmrsResponseInsert
): Promise<YmrsResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate total score with heterogeneous scoring
  // Items 1,2,3,4,7,10,11 are scored 0-4
  // Items 5,6,8,9 are scored 0-8 (double weighted)
  const regularItems = [
    response.q1, response.q2, response.q3, response.q4,
    response.q7, response.q10, response.q11
  ];
  const doubleWeightedItems = [
    response.q5, response.q6, response.q8, response.q9
  ];

  const regularScore = regularItems.reduce((sum: number, item) => sum + (item ?? 0), 0);
  const doubleScore = doubleWeightedItems.reduce((sum: number, item) => sum + (item ?? 0), 0);
  const totalScore = regularScore + doubleScore;

  // Determine interpretation
  let interpretation = '';
  if (totalScore <= 11) {
    interpretation = 'Pas de symptômes maniaques significatifs';
  } else if (totalScore <= 20) {
    interpretation = 'Hypomanie';
  } else {
    interpretation = 'Manie';
  }

  const { data, error } = await supabase
    .from('responses_ymrs')
    .upsert({
      ...response,
      total_score: totalScore,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// CGI (Clinical Global Impressions)
// ============================================================================

export async function getCgiResponse(
  visitId: string
): Promise<CgiResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_cgi')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      // Table doesn't exist yet - migration not applied
      console.warn(`Table responses_cgi not found. Please run migrations.`);
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveCgiResponse(
  response: CgiResponseInsert
): Promise<CgiResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate therapeutic index if applicable
  let therapeuticIndex: number | null = null;
  let therapeuticIndexLabel: string | null = null;

  if (response.visit_type === 'followup' && 
      response.therapeutic_effect && response.therapeutic_effect > 0 &&
      response.side_effects && response.side_effects > 0) {
    
    // Therapeutic index matrix (effect × side effects)
    const matrix = [
      [1, 2, 3, 4],    // Effect = 1 (Important)
      [5, 6, 7, 8],    // Effect = 2 (Modéré)
      [9, 10, 11, 12], // Effect = 3 (Minime)
      [13, 14, 15, 16] // Effect = 4 (Nul)
    ];

    const effectIndex = response.therapeutic_effect - 1;
    const sideEffectIndex = response.side_effects - 1;
    
    if (effectIndex >= 0 && effectIndex < 4 && sideEffectIndex >= 0 && sideEffectIndex < 4) {
      therapeuticIndex = matrix[effectIndex][sideEffectIndex];
      
      // Determine label based on index value
      if (therapeuticIndex <= 4) {
        therapeuticIndexLabel = 'Très bon rapport bénéfice/risque';
      } else if (therapeuticIndex <= 8) {
        therapeuticIndexLabel = 'Bon rapport bénéfice/risque';
      } else if (therapeuticIndex <= 12) {
        therapeuticIndexLabel = 'Rapport bénéfice/risque modéré';
      } else {
        therapeuticIndexLabel = 'Mauvais rapport bénéfice/risque';
      }
    }
  }

  const { data, error } = await supabase
    .from('responses_cgi')
    .upsert({
      ...response,
      therapeutic_index: therapeuticIndex,
      therapeutic_index_label: therapeuticIndexLabel,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// EGF (Échelle de Fonctionnement Global)
// ============================================================================

export async function getEgfResponse(
  visitId: string
): Promise<EgfResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_egf')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      // Table doesn't exist yet - migration not applied
      console.warn(`Table responses_egf not found. Please run migrations.`);
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveEgfResponse(
  response: EgfResponseInsert
): Promise<EgfResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Helper function to get interpretation based on score
  const getInterpretation = (score: number | null | undefined): string | null => {
    if (!score) return null;
    
    if (score >= 91) return 'Fonctionnement supérieur';
    if (score >= 81) return 'Symptômes absents ou minimes';
    if (score >= 71) return 'Symptômes transitoires';
    if (score >= 61) return 'Symptômes légers';
    if (score >= 51) return 'Symptômes modérés';
    if (score >= 41) return 'Symptômes graves';
    if (score >= 31) return 'Altération du fonctionnement';
    if (score >= 21) return 'Altération marquée du fonctionnement';
    if (score >= 11) return 'Besoin de supervision';
    return 'Danger persistant';
  };

  const { data, error } = await supabase
    .from('responses_egf')
    .upsert({
      ...response,
      current_interpretation: getInterpretation(response.current_functioning),
      worst_interpretation: getInterpretation(response.worst_past_year),
      best_interpretation: getInterpretation(response.best_past_year),
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// ALDA (Lithium Response Scale)
// ============================================================================

export async function getAldaResponse(
  visitId: string
): Promise<AldaResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_alda')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      // Table doesn't exist yet - migration not applied
      console.warn(`Table responses_alda not found. Please run migrations.`);
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveAldaResponse(
  response: AldaResponseInsert
): Promise<AldaResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate B total score
  const bItems = [response.b1, response.b2, response.b3, response.b4, response.b5];
  const bTotalScore = bItems.reduce((sum: number, item) => sum + (item ?? 0), 0);

  // Calculate ALDA score (A - B)
  const aScore = response.a_score ?? 0;
  const aldaScore = aScore - bTotalScore;

  // Determine interpretation
  let interpretation = '';
  if (aldaScore >= 7) {
    interpretation = 'Bonne réponse au lithium';
  } else if (aldaScore >= 2) {
    interpretation = 'Réponse partielle au lithium';
  } else {
    interpretation = 'Réponse insuffisante au lithium';
  }

  const { data, error } = await supabase
    .from('responses_alda')
    .upsert({
      ...response,
      b_total_score: bTotalScore,
      alda_score: aldaScore,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// État du patient (Patient State)
// ============================================================================

export async function getEtatPatientResponse(
  visitId: string
): Promise<EtatPatientResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_etat_patient')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      // Table doesn't exist yet - migration not applied
      console.warn(`Table responses_etat_patient not found. Please run migrations.`);
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveEtatPatientResponse(
  response: EtatPatientResponseInsert
): Promise<EtatPatientResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Determine current state based on highest severity
  const states = [
    { name: 'Euthymie', severity: response.euthymia_severity ?? 0, duration: response.euthymia_duration },
    { name: 'Manie', severity: response.mania_severity ?? 0, duration: response.mania_duration },
    { name: 'Dépression', severity: response.depression_severity ?? 0, duration: response.depression_duration },
    { name: 'État mixte', severity: response.mixed_severity ?? 0, duration: response.mixed_duration }
  ];

  // Find the state with highest severity
  const maxSeverity = Math.max(...states.map(s => s.severity));
  const dominantStates = states.filter(s => s.severity === maxSeverity && s.severity > 0);

  let currentState = '';
  let stateDetails = '';

  if (dominantStates.length === 0) {
    currentState = 'Aucun état pathologique';
    stateDetails = 'Tous les états sont cotés à 0 (absent)';
  } else if (dominantStates.length === 1) {
    currentState = dominantStates[0].name;
    stateDetails = `Sévérité: ${dominantStates[0].severity}/3`;
    if (dominantStates[0].duration) {
      stateDetails += `, Durée: ${dominantStates[0].duration} jours`;
    }
  } else {
    // Multiple states with same severity
    currentState = 'États multiples';
    stateDetails = dominantStates.map(s => {
      let detail = `${s.name} (sévérité: ${s.severity}/3`;
      if (s.duration) detail += `, durée: ${s.duration} jours`;
      detail += ')';
      return detail;
    }).join('; ');
  }

  const { data, error } = await supabase
    .from('responses_etat_patient')
    .upsert({
      ...response,
      current_state: currentState,
      state_details: stateDetails,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// FAST (Functioning Assessment Short Test)
// ============================================================================

export async function getFastResponse(
  visitId: string
): Promise<FastResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_fast')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      // Table doesn't exist yet - migration not applied
      console.warn(`Table responses_fast not found. Please run migrations.`);
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveFastResponse(
  response: FastResponseInsert
): Promise<FastResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate domain scores
  const autonomyScore = (response.q1 ?? 0) + (response.q2 ?? 0) + 
                       (response.q3 ?? 0) + (response.q4 ?? 0);
  
  const occupationalScore = (response.q5 ?? 0) + (response.q6 ?? 0) + 
                           (response.q7 ?? 0) + (response.q8 ?? 0) + 
                           (response.q9 ?? 0);
  
  const cognitiveScore = (response.q10 ?? 0) + (response.q11 ?? 0) + 
                        (response.q12 ?? 0) + (response.q13 ?? 0) + 
                        (response.q14 ?? 0);
  
  const financialScore = (response.q15 ?? 0) + (response.q16 ?? 0);
  
  const interpersonalScore = (response.q17 ?? 0) + (response.q18 ?? 0) + 
                            (response.q19 ?? 0) + (response.q20 ?? 0) + 
                            (response.q21 ?? 0) + (response.q22 ?? 0);
  
  const leisureScore = (response.q23 ?? 0) + (response.q24 ?? 0);

  // Calculate total score
  const totalScore = autonomyScore + occupationalScore + cognitiveScore + 
                    financialScore + interpersonalScore + leisureScore;

  // Determine interpretation
  let interpretation = '';
  if (totalScore <= 11) {
    interpretation = 'Pas de déficit fonctionnel';
  } else if (totalScore <= 20) {
    interpretation = 'Déficit fonctionnel léger';
  } else if (totalScore <= 40) {
    interpretation = 'Déficit fonctionnel modéré';
  } else {
    interpretation = 'Déficit fonctionnel sévère';
  }

  // Add domain-specific interpretations
  const domainInterpretations = [];
  if (autonomyScore > 6) domainInterpretations.push('Autonomie altérée');
  if (occupationalScore > 7) domainInterpretations.push('Fonctionnement professionnel altéré');
  if (cognitiveScore > 7) domainInterpretations.push('Fonctionnement cognitif altéré');
  if (financialScore > 3) domainInterpretations.push('Gestion financière altérée');
  if (interpersonalScore > 9) domainInterpretations.push('Relations interpersonnelles altérées');
  if (leisureScore > 3) domainInterpretations.push('Loisirs altérés');

  if (domainInterpretations.length > 0) {
    interpretation += '. Domaines affectés: ' + domainInterpretations.join(', ');
  }

  const { data, error } = await supabase
    .from('responses_fast')
    .upsert({
      ...response,
      autonomy_score: autonomyScore,
      occupational_score: occupationalScore,
      cognitive_score: cognitiveScore,
      financial_score: financialScore,
      interpersonal_score: interpersonalScore,
      leisure_score: leisureScore,
      total_score: totalScore,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// DIVA 2.0 (Diagnostic Interview for ADHD in Adults)
// ============================================================================

export async function getDivaResponse(
  visitId: string
): Promise<DivaResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_diva')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveDivaResponse(
  response: DivaResponseInsert
): Promise<DivaResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Helper to count adult/childhood symptoms from multiple_choice responses
  const countSymptoms = (responses: Record<string, any>, period: 'adult' | 'childhood', prefix: string, count: number) => {
    let total = 0;
    for (let i = 1; i <= count; i++) {
      const key = `${prefix}${String.fromCharCode(96 + i)}_${period}`; // a1a_adult, a1b_adult, etc.
      if (responses[key] === true) {
        total++;
      }
    }
    return total;
  };

  // Calculate totals
  const totalInattentionAdult = response.total_inattention_adult ?? countSymptoms(response, 'adult', 'a1', 9);
  const totalInattentionChildhood = response.total_inattention_childhood ?? countSymptoms(response, 'childhood', 'a1', 9);
  const totalHyperactivityAdult = response.total_hyperactivity_adult ?? countSymptoms(response, 'adult', 'a2', 9);
  const totalHyperactivityChildhood = response.total_hyperactivity_childhood ?? countSymptoms(response, 'childhood', 'a2', 9);

  const { data, error } = await supabase
    .from('responses_diva')
    .upsert({
      ...response,
      total_inattention_adult: totalInattentionAdult,
      total_inattention_childhood: totalInattentionChildhood,
      total_hyperactivity_adult: totalHyperactivityAdult,
      total_hyperactivity_childhood: totalHyperactivityChildhood,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// FAMILY HISTORY (Antécédents Familiaux)
// ============================================================================

export async function getFamilyHistoryResponse(
  visitId: string
): Promise<FamilyHistoryResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_family_history')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveFamilyHistoryResponse(
  response: FamilyHistoryResponseInsert
): Promise<FamilyHistoryResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('responses_family_history')
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
// C-SSRS (Columbia-Suicide Severity Rating Scale)
// ============================================================================

export async function getCssrsResponse(
  visitId: string
): Promise<CssrsResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_cssrs')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveCssrsResponse(
  response: CssrsResponseInsert
): Promise<CssrsResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('responses_cssrs')
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
// ISA (Intentionnalité Suicidaire Actuelle)
// ============================================================================

export async function getIsaResponse(
  visitId: string
): Promise<IsaResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_isa')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveIsaResponse(
  response: IsaResponseInsert
): Promise<IsaResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('responses_isa')
    .upsert({
      ...response
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}
