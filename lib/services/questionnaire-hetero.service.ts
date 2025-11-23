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
  IsaResponseInsert,
  CssrsHistoryResponse,
  CssrsHistoryResponseInsert,
  SisResponse,
  SisResponseInsert
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

  // Calculate total score
  // All 11 items are summed directly
  const items = [
    response.q1, response.q2, response.q3, response.q4, response.q5,
    response.q6, response.q7, response.q8, response.q9, response.q10, response.q11
  ];
  
  const totalScore = items.reduce((sum: number, item) => sum + (item ?? 0), 0);

  // Determine interpretation based on cutoffs
  // Range: 0-60
  let interpretation = '';
  if (totalScore <= 11) {
    interpretation = 'Pas d\'hypomanie';
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
    
    if (score >= 91) return 'Niveau supérieur de fonctionnement. Absence de symptômes.';
    if (score >= 81) return 'Symptômes absents ou minimes, fonctionnement satisfaisant.';
    if (score >= 71) return 'Symptômes transitoires, handicap léger.';
    if (score >= 61) return 'Symptômes légers, fonctionne assez bien.';
    if (score >= 51) return 'Symptômes d\'intensité moyenne.';
    if (score >= 41) return 'Symptômes importants ou handicap important.';
    if (score >= 31) return 'Altération du sens de la réalité ou handicap majeur.';
    if (score >= 21) return 'Comportement influencé par délires ou incapacité majeure.';
    if (score >= 11) return 'Danger d\'agression ou incapacité hygiène.';
    return 'Danger persistant ou incapacité durable.';
  };

  const { data, error } = await supabase
    .from('responses_egf')
    .upsert({
      ...response,
      interpretation: getInterpretation(response.egf_score),
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
// État du patient (Patient State - DSM-IV Symptoms)
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

  // Count depressive symptoms (Q1-Q9) where value is 1 (Oui)
  const depressiveQuestions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9'];
  const depressionCount = depressiveQuestions.reduce((count, key) => {
    const value = response[key as keyof EtatPatientResponseInsert];
    return count + (value === 1 ? 1 : 0);
  }, 0);

  // Count manic symptoms (Q10-Q18) where value is 1 (Oui)
  const manicQuestions = ['q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18'];
  const maniaCount = manicQuestions.reduce((count, key) => {
    const value = response[key as keyof EtatPatientResponseInsert];
    return count + (value === 1 ? 1 : 0);
  }, 0);

  // Create interpretation
  let interpretation = '';
  if (depressionCount > 0 && maniaCount > 0) {
    interpretation = `Symptômes mixtes : ${depressionCount} symptôme(s) dépressif(s), ${maniaCount} symptôme(s) maniaque(s)`;
  } else if (depressionCount > 0) {
    interpretation = `${depressionCount} symptôme(s) dépressif(s) présent(s)`;
  } else if (maniaCount > 0) {
    interpretation = `${maniaCount} symptôme(s) maniaque(s) présent(s)`;
  } else {
    interpretation = 'Aucun symptôme dépressif ou maniaque significatif';
  }

  // Alert if suicidal ideation is present
  if (response.q9 === 1) {
    interpretation += ' - ALERTE: Idéation suicidaire présente';
  }

  const { data, error } = await supabase
    .from('responses_etat_patient')
    .upsert({
      ...response,
      depression_count: depressionCount,
      mania_count: maniaCount,
      interpretation,
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

// ============================================================================
// C-SSRS History (Histoire des Conduites Suicidaires)
// ============================================================================

export async function getCssrsHistoryResponse(
  visitId: string
): Promise<CssrsHistoryResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_cssrs_history')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveCssrsHistoryResponse(
  response: CssrsHistoryResponseInsert
): Promise<CssrsHistoryResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('responses_cssrs_history')
    .upsert({
      ...response
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// SIS (Suicide Intent Scale)
// ============================================================================

export async function getSisResponse(
  visitId: string
): Promise<SisResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_sis')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveSisResponse(
  response: SisResponseInsert
): Promise<SisResponse> {
  const supabase = await createClient();

  // Remove generated columns if present (total_score, circumstances_subscore, conception_subscore)
  const { total_score, circumstances_subscore, conception_subscore, ...responseWithoutGeneratedFields } = response as any;

  const { data, error } = await supabase
    .from('responses_sis')
    .upsert({
      ...responseWithoutGeneratedFields
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}
