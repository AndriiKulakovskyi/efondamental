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
  SisResponse,
  SisResponseInsert,
  Wais4CriteriaResponse,
  Wais4CriteriaResponseInsert,
  Wais4LearningResponse,
  Wais4LearningResponseInsert,
  Wais4MatricesResponse,
  Wais4MatricesResponseInsert,
  Wais4DigitSpanResponse,
  Wais4DigitSpanResponseInsert,
  TmtResponse,
  TmtResponseInsert,
  StroopResponse,
  StroopResponseInsert,
  FluencesVerbalesResponse,
  FluencesVerbalesResponseInsert,
  CobraResponse,
  CobraResponseInsert,
  Cpt3Response,
  Cpt3ResponseInsert,
  Wais4SimilitudesResponse,
  Wais4SimilitudesResponseInsert,
  TestCommissionsResponse,
  TestCommissionsResponseInsert,
  ScipResponse,
  ScipResponseInsert,
  // WAIS-III types
  Wais3CvltResponse,
  Wais3CvltResponseInsert,
  Wais3TmtResponse,
  Wais3TmtResponseInsert,
  Wais3StroopResponse,
  Wais3StroopResponseInsert,
  Wais3FluencesVerbalesResponse,
  Wais3FluencesVerbalesResponseInsert
} from '@/lib/types/database.types';
import { calculateStandardizedScore, calculatePercentileRank } from './wais4-matrices-scoring';
import { calculateTmtScores } from './tmt-scoring';
import { calculateStroopScores } from './stroop-scoring';
import { calculateFluencesVerbalesScores } from './fluences-verbales-scoring';
import { calculateWais4SimilitudesScores } from './wais4-similitudes-scoring';
import { calculateTestCommissionsScores } from './test-commissions-scoring';
import { calculateScipScores } from './scip-scoring';
import { calculateWais3MatricesScores } from './wais3-matrices-scoring';
import { calculateWais3CodeSymbolesScores } from './wais3-code-symboles-scoring';

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

  // Calculate therapeutic index based on the CGI specification
  // Formula: IF(therapeutic_effect == 0, 0, (4 * therapeutic_weight) + side_effect_weight)
  // therapeutic_weight: 1→0, 2→1, 3→2, 4→3
  // side_effect_weight: 0→1, 1→2, 2→3, 3→4
  let therapeuticIndex: number | null = null;
  let therapeuticIndexLabel: string | null = null;

  const therapeuticEffect = response.therapeutic_effect;
  const sideEffects = response.side_effects;

  // If therapeutic_effect is 0 (Non évalué), score is 0
  if (therapeuticEffect === 0) {
    therapeuticIndex = 0;
    therapeuticIndexLabel = 'Non évalué';
  }
  // Calculate if therapeutic_effect is 1-4 and side_effects is provided (0-3)
  else if (therapeuticEffect !== undefined && therapeuticEffect !== null && 
           therapeuticEffect >= 1 && therapeuticEffect <= 4 &&
           sideEffects !== undefined && sideEffects !== null &&
           sideEffects >= 0 && sideEffects <= 3) {
    
    // Calculate using weights:
    // therapeutic_weight = therapeutic_effect - 1 (so 0, 1, 2, 3 for values 1, 2, 3, 4)
    // side_effect_weight = side_effects + 1 (so 1, 2, 3, 4 for values 0, 1, 2, 3)
    const therapeuticWeight = therapeuticEffect - 1;
    const sideEffectWeight = sideEffects + 1;
    
    therapeuticIndex = (4 * therapeuticWeight) + sideEffectWeight;
    
    // Determine label based on index value (1-16)
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

  // If patient is not on lithium (q0 = 0), set all scores to null/0
  if (response.q0 === 0 || response.q0 === null) {
    const { data, error } = await supabase
      .from('responses_alda')
      .upsert({
        ...response,
        qa: null,
        qb1: null,
        qb2: null,
        qb3: null,
        qb4: null,
        qb5: null,
        b_total_score: null,
        alda_score: null,
        interpretation: 'Patient non traité par lithium - questionnaire non applicable',
        completed_by: user.data.user?.id
      }, { onConflict: 'visit_id' })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Calculate B total score (sum of B1-B5)
  const bItems = [response.qb1, response.qb2, response.qb3, response.qb4, response.qb5];
  const bTotalScore = bItems.reduce((sum: number, item) => sum + (item ?? 0), 0);

  // Get Score A
  const scoreA = response.qa ?? 0;

  // Calculate Total Score with special rules:
  // 1) If Score A < 7, Total Score = 0
  // 2) Total Score = MAX(0, A - B)
  let aldaScore = 0;
  if (scoreA >= 7) {
    aldaScore = Math.max(0, scoreA - bTotalScore);
  }

  // Determine interpretation based on Total Score
  let interpretation = '';
  if (aldaScore >= 7 && aldaScore <= 10) {
    interpretation = 'Bon répondeur (Réponse certaine)';
  } else if (aldaScore >= 4 && aldaScore <= 6) {
    interpretation = 'Répondeur partiel / Réponse possible';
  } else {
    interpretation = 'Non-répondeur / Réponse improbable';
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

  // Transform boolean values to 'oui'/'non' strings for UI compatibility
  // This ensures the app works whether migration 118 has been applied or not
  if (data) {
    const transformedData: any = { ...data };
    
    const booleanFields = [
      // Symptom fields (adult and childhood)
      'a1a_adult', 'a1a_childhood', 'a1b_adult', 'a1b_childhood',
      'a1c_adult', 'a1c_childhood', 'a1d_adult', 'a1d_childhood',
      'a1e_adult', 'a1e_childhood', 'a1f_adult', 'a1f_childhood',
      'a1g_adult', 'a1g_childhood', 'a1h_adult', 'a1h_childhood',
      'a1i_adult', 'a1i_childhood',
      'a2a_adult', 'a2a_childhood', 'a2b_adult', 'a2b_childhood',
      'a2c_adult', 'a2c_childhood', 'a2d_adult', 'a2d_childhood',
      'a2e_adult', 'a2e_childhood', 'a2f_adult', 'a2f_childhood',
      'a2g_adult', 'a2g_childhood', 'a2h_adult', 'a2h_childhood',
      'a2i_adult', 'a2i_childhood',
      // Criteria fields
      'criteria_a_inattention_gte6', 'criteria_a_hyperactivity_gte6',
      'criteria_b_lifetime_persistence', 'criteria_cd_impairment_childhood',
      'criteria_cd_impairment_adult', 'criteria_e_better_explained'
    ];

    for (const field of booleanFields) {
      if (transformedData[field] === true) {
        transformedData[field] = 'oui';
      } else if (transformedData[field] === false) {
        transformedData[field] = 'non';
      }
      // If already string or null, leave as is
    }

    return transformedData;
  }

  return data;
}

export async function saveDivaResponse(
  response: DivaResponseInsert
): Promise<DivaResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Helper to count adult/childhood symptoms from 'oui'/'non' single-choice responses
  const countSymptoms = (responses: Record<string, any>, period: 'adult' | 'childhood', prefix: string, count: number) => {
    let total = 0;
    for (let i = 1; i <= count; i++) {
      const key = `${prefix}${String.fromCharCode(96 + i)}_${period}`; // a1a_adult, a1b_adult, etc.
      // Support both new format ('oui') and old format (true) for backward compatibility
      if (responses[key] === 'oui' || responses[key] === true) {
        total++;
      }
    }
    return total;
  };

  // Transform 'oui'/'non' strings to boolean for database compatibility
  // This ensures the app works whether migration 118 has been applied or not
  const transformedResponse: any = { ...response };
  
  const booleanFields = [
    // Symptom fields (adult and childhood)
    'a1a_adult', 'a1a_childhood', 'a1b_adult', 'a1b_childhood',
    'a1c_adult', 'a1c_childhood', 'a1d_adult', 'a1d_childhood',
    'a1e_adult', 'a1e_childhood', 'a1f_adult', 'a1f_childhood',
    'a1g_adult', 'a1g_childhood', 'a1h_adult', 'a1h_childhood',
    'a1i_adult', 'a1i_childhood',
    'a2a_adult', 'a2a_childhood', 'a2b_adult', 'a2b_childhood',
    'a2c_adult', 'a2c_childhood', 'a2d_adult', 'a2d_childhood',
    'a2e_adult', 'a2e_childhood', 'a2f_adult', 'a2f_childhood',
    'a2g_adult', 'a2g_childhood', 'a2h_adult', 'a2h_childhood',
    'a2i_adult', 'a2i_childhood',
    // Criteria fields
    'criteria_a_inattention_gte6', 'criteria_a_hyperactivity_gte6',
    'criteria_b_lifetime_persistence', 'criteria_cd_impairment_childhood',
    'criteria_cd_impairment_adult', 'criteria_e_better_explained'
  ];

  for (const field of booleanFields) {
    if (transformedResponse[field] === 'oui') {
      transformedResponse[field] = true;
    } else if (transformedResponse[field] === 'non') {
      transformedResponse[field] = false;
    }
    // If already boolean or null, leave as is
  }

  // Calculate totals
  const totalInattentionAdult = transformedResponse.total_inattention_adult ?? countSymptoms(response, 'adult', 'a1', 9);
  const totalInattentionChildhood = transformedResponse.total_inattention_childhood ?? countSymptoms(response, 'childhood', 'a1', 9);
  const totalHyperactivityAdult = transformedResponse.total_hyperactivity_adult ?? countSymptoms(response, 'adult', 'a2', 9);
  const totalHyperactivityChildhood = transformedResponse.total_hyperactivity_childhood ?? countSymptoms(response, 'childhood', 'a2', 9);

  const { data, error } = await supabase
    .from('responses_diva')
    .upsert({
      ...transformedResponse,
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

// ============================================================================
// WAIS-IV Clinical Criteria (Neuropsychological Evaluation)
// ============================================================================

export async function getWais4CriteriaResponse(
  visitId: string
): Promise<Wais4CriteriaResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_wais4_criteria')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveWais4CriteriaResponse(
  response: Wais4CriteriaResponseInsert
): Promise<Wais4CriteriaResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('responses_wais4_criteria')
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
// WAIS-IV Learning Disorders (Troubles des acquisitions et des apprentissages)
// ============================================================================

export async function getWais4LearningResponse(
  visitId: string
): Promise<Wais4LearningResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_wais4_learning')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveWais4LearningResponse(
  response: Wais4LearningResponseInsert
): Promise<Wais4LearningResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('responses_wais4_learning')
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
// WAIS-IV Matrices (Raisonnement fluide)
// ============================================================================

export async function getWais4MatricesResponse(
  visitId: string
): Promise<Wais4MatricesResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_wais4_matrices')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveWais4MatricesResponse(
  response: Wais4MatricesResponseInsert
): Promise<Wais4MatricesResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate raw score (sum of all items) - but don't insert it, it's generated by DB
  const rawScore = 
    response.item_01 + response.item_02 + response.item_03 + response.item_04 + response.item_05 +
    response.item_06 + response.item_07 + response.item_08 + response.item_09 + response.item_10 +
    response.item_11 + response.item_12 + response.item_13 + response.item_14 + response.item_15 +
    response.item_16 + response.item_17 + response.item_18 + response.item_19 + response.item_20 +
    response.item_21 + response.item_22 + response.item_23 + response.item_24 + response.item_25 +
    response.item_26;

  // Calculate standardized score based on age and raw score
  const standardizedScore = calculateStandardizedScore(rawScore, response.patient_age);
  
  // Calculate percentile rank
  const percentileRank = calculatePercentileRank(standardizedScore);

  // Remove raw_score if present (it's a generated column, cannot be inserted)
  const { raw_score, ...responseWithoutRawScore } = response as any;

  const { data, error } = await supabase
    .from('responses_wais4_matrices')
    .upsert({
      ...responseWithoutRawScore,
      standardized_score: standardizedScore,
      percentile_rank: percentileRank,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// CVLT (California Verbal Learning Test)
// ============================================================================

import { CvltResponse, CvltResponseInsert } from '@/lib/types/database.types';
import { calculateCvltScores } from './cvlt-scoring';

export async function getCvltResponse(visitId: string): Promise<CvltResponse | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('responses_cvlt')
    .select('*')
    .eq('visit_id', visitId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // No rows
    throw error;
  }
  return data;
}

export async function saveCvltResponse(
  response: CvltResponseInsert
): Promise<CvltResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate all standard scores
  const scores = calculateCvltScores({
    patient_age: response.patient_age,
    years_of_education: response.years_of_education,
    patient_sex: response.patient_sex,
    trial_1: response.trial_1,
    trial_2: response.trial_2,
    trial_3: response.trial_3,
    trial_4: response.trial_4,
    trial_5: response.trial_5,
    list_b: response.list_b,
    sdfr: response.sdfr,
    sdcr: response.sdcr,
    ldfr: response.ldfr,
    ldcr: response.ldcr,
    semantic_clustering: response.semantic_clustering,
    serial_clustering: response.serial_clustering,
    perseverations: response.perseverations,
    intrusions: response.intrusions,
    recognition_hits: response.recognition_hits,
    false_positives: response.false_positives,
    discriminability: response.discriminability,
    primacy: response.primacy,
    recency: response.recency,
    response_bias: response.response_bias
  });

  // Remove total_1_5 if present (it's a generated column)
  const { total_1_5, ...responseWithoutGenerated } = response as any;

  const { data, error } = await supabase
    .from('responses_cvlt')
    .upsert({
      ...responseWithoutGenerated,
      ...scores,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// WAIS-IV Subtest Code (Processing Speed)
// ============================================================================

import { Wais4CodeResponse, Wais4CodeResponseInsert } from '@/lib/types/database.types';
import { 
  calculateStandardizedScore as calculateCodeStandardizedScore, 
  calculateZScore as calculateCodeZScore 
} from './wais4-code-scoring';

export async function getWais4CodeResponse(visitId: string): Promise<Wais4CodeResponse | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('responses_wais4_code')
    .select('*')
    .eq('visit_id', visitId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // No rows
    throw error;
  }
  return data;
}

export async function saveWais4CodeResponse(
  response: Wais4CodeResponseInsert
): Promise<Wais4CodeResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate standardized score based on raw score and age
  const rawScore = response.total_correct;
  const standardizedScore = calculateCodeStandardizedScore(rawScore, response.patient_age);
  
  // Calculate Z-score from standardized score
  const zScore = calculateCodeZScore(standardizedScore);

  // Remove raw_score if present (it's a generated column)
  const { raw_score, ...responseWithoutRawScore } = response as any;

  const { data, error } = await supabase
    .from('responses_wais4_code')
    .upsert({
      ...responseWithoutRawScore,
      standardized_score: standardizedScore,
      z_score: zScore,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// WAIS-IV Digit Span (Memoire des chiffres)
// ============================================================================

import { calculateDigitSpanScores } from './wais4-digit-span-scoring';

export async function getWais4DigitSpanResponse(visitId: string): Promise<Wais4DigitSpanResponse | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('responses_wais4_digit_span')
    .select('*')
    .eq('visit_id', visitId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // No rows
    throw error;
  }
  return data;
}

export async function saveWais4DigitSpanResponse(
  response: Wais4DigitSpanResponseInsert
): Promise<Wais4DigitSpanResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate all scores using the scoring function
  const scores = calculateDigitSpanScores({
    patient_age: response.patient_age,
    // Direct order
    mcod_1a: response.mcod_1a,
    mcod_1b: response.mcod_1b,
    mcod_2a: response.mcod_2a,
    mcod_2b: response.mcod_2b,
    mcod_3a: response.mcod_3a,
    mcod_3b: response.mcod_3b,
    mcod_4a: response.mcod_4a,
    mcod_4b: response.mcod_4b,
    mcod_5a: response.mcod_5a,
    mcod_5b: response.mcod_5b,
    mcod_6a: response.mcod_6a,
    mcod_6b: response.mcod_6b,
    mcod_7a: response.mcod_7a,
    mcod_7b: response.mcod_7b,
    mcod_8a: response.mcod_8a,
    mcod_8b: response.mcod_8b,
    // Inverse order
    mcoi_1a: response.mcoi_1a,
    mcoi_1b: response.mcoi_1b,
    mcoi_2a: response.mcoi_2a,
    mcoi_2b: response.mcoi_2b,
    mcoi_3a: response.mcoi_3a,
    mcoi_3b: response.mcoi_3b,
    mcoi_4a: response.mcoi_4a,
    mcoi_4b: response.mcoi_4b,
    mcoi_5a: response.mcoi_5a,
    mcoi_5b: response.mcoi_5b,
    mcoi_6a: response.mcoi_6a,
    mcoi_6b: response.mcoi_6b,
    mcoi_7a: response.mcoi_7a,
    mcoi_7b: response.mcoi_7b,
    mcoi_8a: response.mcoi_8a,
    mcoi_8b: response.mcoi_8b,
    // Sequencing order
    mcoc_1a: response.mcoc_1a,
    mcoc_1b: response.mcoc_1b,
    mcoc_2a: response.mcoc_2a,
    mcoc_2b: response.mcoc_2b,
    mcoc_3a: response.mcoc_3a,
    mcoc_3b: response.mcoc_3b,
    mcoc_4a: response.mcoc_4a,
    mcoc_4b: response.mcoc_4b,
    mcoc_5a: response.mcoc_5a,
    mcoc_5b: response.mcoc_5b,
    mcoc_6a: response.mcoc_6a,
    mcoc_6b: response.mcoc_6b,
    mcoc_7a: response.mcoc_7a,
    mcoc_7b: response.mcoc_7b,
    mcoc_8a: response.mcoc_8a,
    mcoc_8b: response.mcoc_8b
  });

  const { data, error } = await supabase
    .from('responses_wais4_digit_span')
    .upsert({
      ...response,
      mcod_total: scores.mcod_total,
      mcoi_total: scores.mcoi_total,
      mcoc_total: scores.mcoc_total,
      raw_score: scores.raw_score,
      standardized_score: scores.standardized_score,
      empan_direct: scores.empan_direct,
      empan_inverse: scores.empan_inverse,
      empan_croissant: scores.empan_croissant,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Trail Making Test (TMT) - Reitan 1955
// ============================================================================

export async function getTmtResponse(
  visitId: string
): Promise<TmtResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_tmt')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      console.log(`No TMT found for visit: ${visitId}`);
      return null;
    }
    console.error('Error fetching TMT response:', error);
    return null;
  }

  return data;
}

export async function saveTmtResponse(
  response: TmtResponseInsert
): Promise<TmtResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate all scores using the scoring function
  const scores = calculateTmtScores({
    patient_age: response.patient_age,
    years_of_education: response.years_of_education,
    tmta_tps: response.tmta_tps,
    tmta_err: response.tmta_err,
    tmta_cor: response.tmta_cor,
    tmtb_tps: response.tmtb_tps,
    tmtb_err: response.tmtb_err,
    tmtb_cor: response.tmtb_cor,
    tmtb_err_persev: response.tmtb_err_persev
  });

  const { data, error } = await supabase
    .from('responses_tmt')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      patient_age: response.patient_age,
      years_of_education: response.years_of_education,
      tmta_tps: response.tmta_tps,
      tmta_err: response.tmta_err,
      tmta_cor: response.tmta_cor,
      tmtb_tps: response.tmtb_tps,
      tmtb_err: response.tmtb_err,
      tmtb_cor: response.tmtb_cor,
      tmtb_err_persev: response.tmtb_err_persev,
      // Computed scores
      tmta_errtot: scores.tmta_errtot,
      tmta_tps_z: scores.tmta_tps_z,
      tmta_tps_pc: scores.tmta_tps_pc,
      tmta_errtot_z: scores.tmta_errtot_z,
      tmtb_errtot: scores.tmtb_errtot,
      tmtb_tps_z: scores.tmtb_tps_z,
      tmtb_tps_pc: scores.tmtb_tps_pc,
      tmtb_errtot_z: scores.tmtb_errtot_z,
      tmtb_err_persev_z: scores.tmtb_err_persev_z,
      tmt_b_a_tps: scores.tmt_b_a_tps,
      tmt_b_a_tps_z: scores.tmt_b_a_tps_z,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Stroop Test (Golden 1978)
// ============================================================================

export async function getStroopResponse(
  visitId: string
): Promise<StroopResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_stroop')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      console.log(`No Stroop found for visit: ${visitId}`);
      return null;
    }
    console.error('Error fetching Stroop response:', error);
    return null;
  }

  return data;
}

export async function saveStroopResponse(
  response: StroopResponseInsert
): Promise<StroopResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate all scores using the scoring function
  const scores = calculateStroopScores({
    patient_age: response.patient_age,
    stroop_w_tot: response.stroop_w_tot,
    stroop_c_tot: response.stroop_c_tot,
    stroop_cw_tot: response.stroop_cw_tot
  });

  const { data, error } = await supabase
    .from('responses_stroop')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      patient_age: response.patient_age,
      // Planche A - Mots
      stroop_w_tot: response.stroop_w_tot,
      stroop_w_cor: response.stroop_w_cor,
      stroop_w_err: response.stroop_w_err,
      // Planche B - Couleurs
      stroop_c_tot: response.stroop_c_tot,
      stroop_c_cor: response.stroop_c_cor,
      stroop_c_err: response.stroop_c_err,
      // Planche C - Mots/Couleurs
      stroop_cw_tot: response.stroop_cw_tot,
      stroop_cw_cor: response.stroop_cw_cor,
      stroop_cw_err: response.stroop_cw_err,
      // Computed scores
      stroop_w_tot_c: scores.stroop_w_tot_c,
      stroop_c_tot_c: scores.stroop_c_tot_c,
      stroop_cw_tot_c: scores.stroop_cw_tot_c,
      stroop_interf: scores.stroop_interf,
      stroop_w_note_t: scores.stroop_w_note_t,
      stroop_c_note_t: scores.stroop_c_note_t,
      stroop_cw_note_t: scores.stroop_cw_note_t,
      stroop_interf_note_t: scores.stroop_interf_note_t,
      stroop_w_note_t_corrigee: scores.stroop_w_note_t_corrigee,
      stroop_c_note_t_corrigee: scores.stroop_c_note_t_corrigee,
      stroop_cw_note_t_corrigee: scores.stroop_cw_note_t_corrigee,
      stroop_interf_note_tz: scores.stroop_interf_note_tz,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Fluences Verbales (Cardebat et al., 1990)
// ============================================================================

export async function getFluencesVerbalesResponse(
  visitId: string
): Promise<FluencesVerbalesResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_fluences_verbales')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      console.log(`No Fluences Verbales found for visit: ${visitId}`);
      return null;
    }
    console.error('Error fetching Fluences Verbales response:', error);
    return null;
  }

  return data;
}

export async function saveFluencesVerbalesResponse(
  response: FluencesVerbalesResponseInsert
): Promise<FluencesVerbalesResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate all scores using the scoring function
  const scores = calculateFluencesVerbalesScores({
    patient_age: response.patient_age,
    years_of_education: response.years_of_education,
    fv_p_tot_correct: response.fv_p_tot_correct,
    fv_p_deriv: response.fv_p_deriv,
    fv_p_intrus: response.fv_p_intrus,
    fv_p_propres: response.fv_p_propres,
    fv_anim_tot_correct: response.fv_anim_tot_correct,
    fv_anim_deriv: response.fv_anim_deriv,
    fv_anim_intrus: response.fv_anim_intrus,
    fv_anim_propres: response.fv_anim_propres
  });

  const { data, error } = await supabase
    .from('responses_fluences_verbales')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      patient_age: response.patient_age,
      years_of_education: response.years_of_education,
      // Lettre P
      fv_p_tot_correct: response.fv_p_tot_correct,
      fv_p_deriv: response.fv_p_deriv,
      fv_p_intrus: response.fv_p_intrus,
      fv_p_propres: response.fv_p_propres,
      fv_p_tot_rupregle: scores.fv_p_tot_rupregle,
      fv_p_tot_correct_z: scores.fv_p_tot_correct_z,
      fv_p_tot_correct_pc: scores.fv_p_tot_correct_pc,
      // Animaux
      fv_anim_tot_correct: response.fv_anim_tot_correct,
      fv_anim_deriv: response.fv_anim_deriv,
      fv_anim_intrus: response.fv_anim_intrus,
      fv_anim_propres: response.fv_anim_propres,
      fv_anim_tot_rupregle: scores.fv_anim_tot_rupregle,
      fv_anim_tot_correct_z: scores.fv_anim_tot_correct_z,
      fv_anim_tot_correct_pc: scores.fv_anim_tot_correct_pc,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// COBRA - Cognitive Complaints in Bipolar Disorder Rating Assessment
// ============================================================================

export async function getCobraResponse(
  visitId: string
): Promise<CobraResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_cobra')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      console.log(`No COBRA found for visit: ${visitId}`);
      return null;
    }
    console.error('Error fetching COBRA response:', error);
    return null;
  }

  return data;
}

export async function saveCobraResponse(
  response: CobraResponseInsert
): Promise<CobraResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Total score is computed by the database (GENERATED ALWAYS AS)
  const { data, error } = await supabase
    .from('responses_cobra')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      q1: response.q1,
      q2: response.q2,
      q3: response.q3,
      q4: response.q4,
      q5: response.q5,
      q6: response.q6,
      q7: response.q7,
      q8: response.q8,
      q9: response.q9,
      q10: response.q10,
      q11: response.q11,
      q12: response.q12,
      q13: response.q13,
      q14: response.q14,
      q15: response.q15,
      q16: response.q16,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// CPT-III - Conners' Continuous Performance Test III
// ============================================================================

export async function getCpt3Response(
  visitId: string
): Promise<Cpt3Response | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_cpt3')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      console.log(`No CPT-III found for visit: ${visitId}`);
      return null;
    }
    console.error('Error fetching CPT-III response:', error);
    return null;
  }

  return data;
}

export async function saveCpt3Response(
  response: Cpt3ResponseInsert
): Promise<Cpt3Response> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('responses_cpt3')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      // Detectability
      d_prime: response.d_prime,
      d_prime_interp: response.d_prime_interp,
      // Errors
      omissions: response.omissions,
      omissions_interp: response.omissions_interp,
      commissions: response.commissions,
      commissions_interp: response.commissions_interp,
      perseverations: response.perseverations,
      perseverations_interp: response.perseverations_interp,
      // Reaction Time Statistics
      hrt: response.hrt,
      hrt_interp: response.hrt_interp,
      hrt_sd: response.hrt_sd,
      hrt_sd_interp: response.hrt_sd_interp,
      variability: response.variability,
      variability_interp: response.variability_interp,
      hrt_block_change: response.hrt_block_change,
      hrt_block_change_interp: response.hrt_block_change_interp,
      hrt_isi_change: response.hrt_isi_change,
      hrt_isi_change_interp: response.hrt_isi_change_interp,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// WAIS-IV Similitudes
// ============================================================================

export async function getWais4SimilitudesResponse(
  visitId: string
): Promise<Wais4SimilitudesResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_wais4_similitudes')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      console.log(`No WAIS-IV Similitudes found for visit: ${visitId}`);
      return null;
    }
    console.error('Error fetching WAIS-IV Similitudes response:', error);
    return null;
  }

  return data;
}

export async function saveWais4SimilitudesResponse(
  response: Wais4SimilitudesResponseInsert
): Promise<Wais4SimilitudesResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate scores using the scoring function
  const scores = calculateWais4SimilitudesScores({
    patient_age: response.patient_age,
    item1: response.item1,
    item2: response.item2,
    item3: response.item3,
    item4: response.item4,
    item5: response.item5,
    item6: response.item6,
    item7: response.item7,
    item8: response.item8,
    item9: response.item9,
    item10: response.item10,
    item11: response.item11,
    item12: response.item12,
    item13: response.item13,
    item14: response.item14,
    item15: response.item15,
    item16: response.item16,
    item17: response.item17,
    item18: response.item18
  });

  const { data, error } = await supabase
    .from('responses_wais4_similitudes')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      patient_age: response.patient_age,
      item1: response.item1,
      item2: response.item2,
      item3: response.item3,
      item4: response.item4,
      item5: response.item5,
      item6: response.item6,
      item7: response.item7,
      item8: response.item8,
      item9: response.item9,
      item10: response.item10,
      item11: response.item11,
      item12: response.item12,
      item13: response.item13,
      item14: response.item14,
      item15: response.item15,
      item16: response.item16,
      item17: response.item17,
      item18: response.item18,
      total_raw_score: scores.total_raw_score,
      standard_score: scores.standard_score,
      standardized_value: scores.standardized_value,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Test des Commissions
// ============================================================================

export async function getTestCommissionsResponse(
  visitId: string
): Promise<TestCommissionsResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_test_commissions')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      console.log(`No Test des Commissions found for visit: ${visitId}`);
      return null;
    }
    console.error('Error fetching Test des Commissions response:', error);
    return null;
  }

  return data;
}

export async function saveTestCommissionsResponse(
  response: TestCommissionsResponseInsert
): Promise<TestCommissionsResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate scores using the scoring function
  const scores = calculateTestCommissionsScores({
    patient_age: response.patient_age,
    nsc: response.nsc,
    com01: response.com01,
    com02: response.com02,
    com03: response.com03,
    com04: response.com04
  });

  const { data, error } = await supabase
    .from('responses_test_commissions')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      patient_age: response.patient_age,
      nsc: response.nsc,
      com01: response.com01,
      com02: response.com02,
      com03: response.com03,
      com04: response.com04,
      com05: response.com05,
      com01s1: scores.com01s1,
      com01s2: scores.com01s2,
      com02s1: scores.com02s1,
      com02s2: scores.com02s2,
      com03s1: scores.com03s1,
      com03s2: scores.com03s2,
      com04s1: scores.com04s1,
      com04s2: scores.com04s2,
      com04s3: scores.com04s3,
      com04s4: scores.com04s4,
      com04s5: scores.com04s5,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// SCIP - Screening Assessment for Cognitive Impairment in Psychiatry
// ============================================================================

export async function getScipResponse(
  visitId: string
): Promise<ScipResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_scip')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      console.log(`No SCIP found for visit: ${visitId}`);
      return null;
    }
    console.error('Error fetching SCIP response:', error);
    return null;
  }

  return data;
}

export async function saveScipResponse(
  response: ScipResponseInsert
): Promise<ScipResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate Z-scores using the scoring function
  const scores = calculateScipScores({
    scipv01a: response.scipv01a,
    scipv02a: response.scipv02a,
    scipv03a: response.scipv03a,
    scipv04a: response.scipv04a,
    scipv05a: response.scipv05a
  });

  const { data, error } = await supabase
    .from('responses_scip')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      scipv01a: response.scipv01a,
      scipv02a: response.scipv02a,
      scipv03a: response.scipv03a,
      scipv04a: response.scipv04a,
      scipv05a: response.scipv05a,
      scipv01b: scores.scipv01b,
      scipv02b: scores.scipv02b,
      scipv03b: scores.scipv03b,
      scipv04b: scores.scipv04b,
      scipv05b: scores.scipv05b,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// WAIS-III CVLT (California Verbal Learning Test)
// ============================================================================

export async function getWais3CvltResponse(
  visitId: string
): Promise<Wais3CvltResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_wais3_cvlt')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    if (error.code === 'PGRST205') {
      console.warn('Table responses_wais3_cvlt not found. Please run migrations.');
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveWais3CvltResponse(
  response: Wais3CvltResponseInsert
): Promise<Wais3CvltResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate all standard scores (same as WAIS-IV CVLT)
  const scores = calculateCvltScores({
    patient_age: response.patient_age,
    years_of_education: response.years_of_education,
    patient_sex: response.patient_sex,
    trial_1: response.trial_1,
    trial_2: response.trial_2,
    trial_3: response.trial_3,
    trial_4: response.trial_4,
    trial_5: response.trial_5,
    list_b: response.list_b,
    sdfr: response.sdfr,
    sdcr: response.sdcr,
    ldfr: response.ldfr,
    ldcr: response.ldcr,
    semantic_clustering: response.semantic_clustering,
    serial_clustering: response.serial_clustering,
    perseverations: response.perseverations,
    intrusions: response.intrusions,
    recognition_hits: response.recognition_hits,
    false_positives: response.false_positives,
    discriminability: response.discriminability,
    primacy: response.primacy,
    recency: response.recency,
    response_bias: response.response_bias
  });

  const { data, error } = await supabase
    .from('responses_wais3_cvlt')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      patient_age: response.patient_age,
      years_of_education: response.years_of_education,
      patient_sex: response.patient_sex,
      trial_1: response.trial_1,
      trial_2: response.trial_2,
      trial_3: response.trial_3,
      trial_4: response.trial_4,
      trial_5: response.trial_5,
      list_b: response.list_b,
      sdfr: response.sdfr,
      sdcr: response.sdcr,
      ldfr: response.ldfr,
      ldcr: response.ldcr,
      semantic_clustering: response.semantic_clustering,
      serial_clustering: response.serial_clustering,
      perseverations: response.perseverations,
      intrusions: response.intrusions,
      recognition_hits: response.recognition_hits,
      false_positives: response.false_positives,
      discriminability: response.discriminability,
      primacy: response.primacy,
      recency: response.recency,
      response_bias: response.response_bias,
      ...scores,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// WAIS-III TMT (Trail Making Test)
// ============================================================================

export async function getWais3TmtResponse(
  visitId: string
): Promise<Wais3TmtResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_wais3_tmt')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    if (error.code === 'PGRST205') {
      console.warn('Table responses_wais3_tmt not found. Please run migrations.');
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveWais3TmtResponse(
  response: Wais3TmtResponseInsert
): Promise<Wais3TmtResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Reuse existing TMT scoring logic
  const scores = calculateTmtScores({
    patient_age: response.patient_age,
    years_of_education: response.years_of_education,
    tmta_tps: response.tmta_tps,
    tmta_err: response.tmta_err,
    tmta_cor: response.tmta_cor || 0,
    tmtb_tps: response.tmtb_tps,
    tmtb_err: response.tmtb_err,
    tmtb_cor: response.tmtb_cor || 0,
    tmtb_err_persev: response.tmtb_err_persev
  });

  const { data, error } = await supabase
    .from('responses_wais3_tmt')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      patient_age: response.patient_age,
      years_of_education: response.years_of_education,
      tmta_tps: response.tmta_tps,
      tmta_err: response.tmta_err,
      tmta_cor: response.tmta_cor,
      tmtb_tps: response.tmtb_tps,
      tmtb_err: response.tmtb_err,
      tmtb_cor: response.tmtb_cor,
      tmtb_err_persev: response.tmtb_err_persev,
      ...scores,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// WAIS-III Stroop Test
// ============================================================================

export async function getWais3StroopResponse(
  visitId: string
): Promise<Wais3StroopResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_wais3_stroop')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    if (error.code === 'PGRST205') {
      console.warn('Table responses_wais3_stroop not found. Please run migrations.');
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveWais3StroopResponse(
  response: Wais3StroopResponseInsert
): Promise<Wais3StroopResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Reuse existing Stroop scoring logic
  const scores = calculateStroopScores({
    patient_age: response.patient_age,
    stroop_w_tot: response.stroop_w_tot,
    stroop_c_tot: response.stroop_c_tot,
    stroop_cw_tot: response.stroop_cw_tot
  });

  const { data, error } = await supabase
    .from('responses_wais3_stroop')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      patient_age: response.patient_age,
      stroop_w_tot: response.stroop_w_tot,
      stroop_c_tot: response.stroop_c_tot,
      stroop_cw_tot: response.stroop_cw_tot,
      ...scores,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// WAIS-III Fluences Verbales
// ============================================================================

export async function getWais3FluencesVerbalesResponse(
  visitId: string
): Promise<Wais3FluencesVerbalesResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_wais3_fluences_verbales')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    if (error.code === 'PGRST205') {
      console.warn('Table responses_wais3_fluences_verbales not found. Please run migrations.');
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveWais3FluencesVerbalesResponse(
  response: Wais3FluencesVerbalesResponseInsert
): Promise<Wais3FluencesVerbalesResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Reuse existing Fluences Verbales scoring logic
  const scores = calculateFluencesVerbalesScores({
    patient_age: response.patient_age,
    years_of_education: response.years_of_education,
    fv_p_tot_correct: response.fv_p_tot_correct,
    fv_p_deriv: response.fv_p_deriv || 0,
    fv_p_intrus: response.fv_p_intrus || 0,
    fv_p_propres: response.fv_p_propres || 0,
    fv_anim_tot_correct: response.fv_anim_tot_correct,
    fv_anim_deriv: response.fv_anim_deriv || 0,
    fv_anim_intrus: response.fv_anim_intrus || 0,
    fv_anim_propres: response.fv_anim_propres || 0
  });

  const { data, error } = await supabase
    .from('responses_wais3_fluences_verbales')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      patient_age: response.patient_age,
      years_of_education: response.years_of_education,
      fv_p_tot_correct: response.fv_p_tot_correct,
      fv_p_deriv: response.fv_p_deriv,
      fv_p_intrus: response.fv_p_intrus,
      fv_p_propres: response.fv_p_propres,
      fv_anim_tot_correct: response.fv_anim_tot_correct,
      fv_anim_deriv: response.fv_anim_deriv,
      fv_anim_intrus: response.fv_anim_intrus,
      fv_anim_propres: response.fv_anim_propres,
      ...scores,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// WAIS-III Clinical Criteria (Critères cliniques)
// ============================================================================

import { Wais3CriteriaResponse, Wais3CriteriaResponseInsert } from '@/lib/types/database.types';

export async function getWais3CriteriaResponse(
  visitId: string
): Promise<Wais3CriteriaResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_wais3_criteria')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    if (error.code === 'PGRST205') {
      console.warn('Table responses_wais3_criteria not found. Please run migrations.');
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveWais3CriteriaResponse(
  response: Wais3CriteriaResponseInsert
): Promise<Wais3CriteriaResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('responses_wais3_criteria')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      collection_date: response.collection_date,
      age: response.age,
      laterality: response.laterality,
      native_french_speaker: response.native_french_speaker,
      time_since_last_eval: response.time_since_last_eval,
      patient_euthymic: response.patient_euthymic,
      no_episode_3months: response.no_episode_3months,
      socio_prof_data_present: response.socio_prof_data_present,
      years_of_education: response.years_of_education,
      no_visual_impairment: response.no_visual_impairment,
      no_hearing_impairment: response.no_hearing_impairment,
      no_ect_past_year: response.no_ect_past_year,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// WAIS-III Learning Disorders (Troubles des acquisitions et des apprentissages)
// ============================================================================

import { Wais3LearningResponse, Wais3LearningResponseInsert } from '@/lib/types/database.types';

export async function getWais3LearningResponse(
  visitId: string
): Promise<Wais3LearningResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_wais3_learning')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    if (error.code === 'PGRST205') {
      console.warn('Table responses_wais3_learning not found. Please run migrations.');
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveWais3LearningResponse(
  response: Wais3LearningResponseInsert
): Promise<Wais3LearningResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('responses_wais3_learning')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      dyslexia: response.dyslexia,
      dysorthographia: response.dysorthographia,
      dyscalculia: response.dyscalculia,
      dysphasia: response.dysphasia,
      dyspraxia: response.dyspraxia,
      speech_delay: response.speech_delay,
      stuttering: response.stuttering,
      walking_delay: response.walking_delay,
      febrile_seizures: response.febrile_seizures,
      precocity: response.precocity,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// WAIS-III Vocabulaire (Wechsler, 1997)
// ============================================================================

import { Wais3VocabulaireResponse, Wais3VocabulaireResponseInsert } from '@/lib/types/database.types';

export async function getWais3VocabulaireResponse(
  visitId: string
): Promise<Wais3VocabulaireResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_wais3_vocabulaire')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    if (error.code === 'PGRST205') {
      console.warn('Table responses_wais3_vocabulaire not found. Please run migrations.');
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveWais3VocabulaireResponse(
  response: Wais3VocabulaireResponseInsert
): Promise<Wais3VocabulaireResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Total raw score is computed by the database (GENERATED ALWAYS AS)
  const { data, error } = await supabase
    .from('responses_wais3_vocabulaire')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      item1: response.item1,
      item2: response.item2,
      item3: response.item3,
      item4: response.item4,
      item5: response.item5,
      item6: response.item6,
      item7: response.item7,
      item8: response.item8,
      item9: response.item9,
      item10: response.item10,
      item11: response.item11,
      item12: response.item12,
      item13: response.item13,
      item14: response.item14,
      item15: response.item15,
      item16: response.item16,
      item17: response.item17,
      item18: response.item18,
      item19: response.item19,
      item20: response.item20,
      item21: response.item21,
      item22: response.item22,
      item23: response.item23,
      item24: response.item24,
      item25: response.item25,
      item26: response.item26,
      item27: response.item27,
      item28: response.item28,
      item29: response.item29,
      item30: response.item30,
      item31: response.item31,
      item32: response.item32,
      item33: response.item33,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// WAIS-III Matrices
// ============================================================================

import { Wais3MatricesResponse, Wais3MatricesResponseInsert } from '@/lib/types/database.types';

export async function getWais3MatricesResponse(
  visitId: string
): Promise<Wais3MatricesResponse | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('responses_wais3_matrices')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveWais3MatricesResponse(
  response: Wais3MatricesResponseInsert
): Promise<Wais3MatricesResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate scores using WAIS-III norms
  const scores = calculateWais3MatricesScores({
    patient_age: response.patient_age,
    item_01: response.item_01,
    item_02: response.item_02,
    item_03: response.item_03,
    item_04: response.item_04,
    item_05: response.item_05,
    item_06: response.item_06,
    item_07: response.item_07,
    item_08: response.item_08,
    item_09: response.item_09,
    item_10: response.item_10,
    item_11: response.item_11,
    item_12: response.item_12,
    item_13: response.item_13,
    item_14: response.item_14,
    item_15: response.item_15,
    item_16: response.item_16,
    item_17: response.item_17,
    item_18: response.item_18,
    item_19: response.item_19,
    item_20: response.item_20,
    item_21: response.item_21,
    item_22: response.item_22,
    item_23: response.item_23,
    item_24: response.item_24,
    item_25: response.item_25,
    item_26: response.item_26
  });

  const { data, error } = await supabase
    .from('responses_wais3_matrices')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      patient_age: response.patient_age,
      item_01: response.item_01,
      item_02: response.item_02,
      item_03: response.item_03,
      item_04: response.item_04,
      item_05: response.item_05,
      item_06: response.item_06,
      item_07: response.item_07,
      item_08: response.item_08,
      item_09: response.item_09,
      item_10: response.item_10,
      item_11: response.item_11,
      item_12: response.item_12,
      item_13: response.item_13,
      item_14: response.item_14,
      item_15: response.item_15,
      item_16: response.item_16,
      item_17: response.item_17,
      item_18: response.item_18,
      item_19: response.item_19,
      item_20: response.item_20,
      item_21: response.item_21,
      item_22: response.item_22,
      item_23: response.item_23,
      item_24: response.item_24,
      item_25: response.item_25,
      item_26: response.item_26,
      standard_score: scores.standard_score,
      standardized_value: scores.standardized_value,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// WAIS-III Code, Symboles & IVT
// ============================================================================

import { Wais3CodeSymbolesResponse, Wais3CodeSymbolesResponseInsert } from '@/lib/types/database.types';

export async function getWais3CodeSymbolesResponse(
  visitId: string
): Promise<Wais3CodeSymbolesResponse | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('responses_wais3_code_symboles')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function saveWais3CodeSymbolesResponse(
  response: Wais3CodeSymbolesResponseInsert
): Promise<Wais3CodeSymbolesResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate scores using WAIS-III norms
  const scores = calculateWais3CodeSymbolesScores({
    patient_age: response.patient_age,
    wais_cod_tot: response.wais_cod_tot,
    wais_cod_err: response.wais_cod_err,
    wais_symb_tot: response.wais_symb_tot,
    wais_symb_err: response.wais_symb_err
  });

  const { data, error } = await supabase
    .from('responses_wais3_code_symboles')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      patient_age: response.patient_age,
      wais_cod_tot: response.wais_cod_tot,
      wais_cod_err: response.wais_cod_err,
      wais_symb_tot: response.wais_symb_tot,
      wais_symb_err: response.wais_symb_err,
      wais_cod_brut: scores.wais_cod_brut,
      wais_cod_std: scores.wais_cod_std,
      wais_cod_cr: scores.wais_cod_cr,
      wais_symb_brut: scores.wais_symb_brut,
      wais_symb_std: scores.wais_symb_std,
      wais_symb_cr: scores.wais_symb_cr,
      wais_somme_ivt: scores.wais_somme_ivt,
      wais_ivt: scores.wais_ivt,
      wais_ivt_rang: scores.wais_ivt_rang,
      wais_ivt_95: scores.wais_ivt_95,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// WAIS-III Digit Span (Mémoire des chiffres)
// ============================================================================

import { Wais3DigitSpanResponse, Wais3DigitSpanResponseInsert } from '@/lib/types/database.types';
import { calculateWais3DigitSpanScores } from './wais3-digit-span-scoring';

export async function getWais3DigitSpanResponse(
  visitId: string
): Promise<Wais3DigitSpanResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_wais3_digit_span')
    .select('*')
    .eq('visit_id', visitId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function saveWais3DigitSpanResponse(
  response: Wais3DigitSpanResponseInsert
): Promise<Wais3DigitSpanResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate scores using WAIS-III norms
  const scores = calculateWais3DigitSpanScores({
    patient_age: response.patient_age,
    education_level: response.education_level,
    mcod_1a: response.mcod_1a, mcod_1b: response.mcod_1b,
    mcod_2a: response.mcod_2a, mcod_2b: response.mcod_2b,
    mcod_3a: response.mcod_3a, mcod_3b: response.mcod_3b,
    mcod_4a: response.mcod_4a, mcod_4b: response.mcod_4b,
    mcod_5a: response.mcod_5a, mcod_5b: response.mcod_5b,
    mcod_6a: response.mcod_6a, mcod_6b: response.mcod_6b,
    mcod_7a: response.mcod_7a, mcod_7b: response.mcod_7b,
    mcod_8a: response.mcod_8a, mcod_8b: response.mcod_8b,
    mcoi_1a: response.mcoi_1a, mcoi_1b: response.mcoi_1b,
    mcoi_2a: response.mcoi_2a, mcoi_2b: response.mcoi_2b,
    mcoi_3a: response.mcoi_3a, mcoi_3b: response.mcoi_3b,
    mcoi_4a: response.mcoi_4a, mcoi_4b: response.mcoi_4b,
    mcoi_5a: response.mcoi_5a, mcoi_5b: response.mcoi_5b,
    mcoi_6a: response.mcoi_6a, mcoi_6b: response.mcoi_6b,
    mcoi_7a: response.mcoi_7a, mcoi_7b: response.mcoi_7b
  });

  const { data, error } = await supabase
    .from('responses_wais3_digit_span')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      patient_age: response.patient_age,
      education_level: response.education_level,
      mcod_1a: response.mcod_1a, mcod_1b: response.mcod_1b,
      mcod_2a: response.mcod_2a, mcod_2b: response.mcod_2b,
      mcod_3a: response.mcod_3a, mcod_3b: response.mcod_3b,
      mcod_4a: response.mcod_4a, mcod_4b: response.mcod_4b,
      mcod_5a: response.mcod_5a, mcod_5b: response.mcod_5b,
      mcod_6a: response.mcod_6a, mcod_6b: response.mcod_6b,
      mcod_7a: response.mcod_7a, mcod_7b: response.mcod_7b,
      mcod_8a: response.mcod_8a, mcod_8b: response.mcod_8b,
      mcoi_1a: response.mcoi_1a, mcoi_1b: response.mcoi_1b,
      mcoi_2a: response.mcoi_2a, mcoi_2b: response.mcoi_2b,
      mcoi_3a: response.mcoi_3a, mcoi_3b: response.mcoi_3b,
      mcoi_4a: response.mcoi_4a, mcoi_4b: response.mcoi_4b,
      mcoi_5a: response.mcoi_5a, mcoi_5b: response.mcoi_5b,
      mcoi_6a: response.mcoi_6a, mcoi_6b: response.mcoi_6b,
      mcoi_7a: response.mcoi_7a, mcoi_7b: response.mcoi_7b,
      wais_mcod_tot: scores.wais_mcod_tot,
      wais_mcoi_tot: scores.wais_mcoi_tot,
      wais_mc_tot: scores.wais_mc_tot,
      wais_mc_end: scores.wais_mc_end,
      wais_mc_env: scores.wais_mc_env,
      wais_mc_emp: scores.wais_mc_emp,
      wais_mc_std: scores.wais_mc_std,
      wais_mc_cr: scores.wais_mc_cr,
      wais_mc_end_z: scores.wais_mc_end_z,
      wais_mc_env_z: scores.wais_mc_env_z,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// WAIS-III CPT II V.5 (Conners' Continuous Performance Test II)
// ============================================================================

import { Wais3Cpt2Response, Wais3Cpt2ResponseInsert } from '@/lib/types/database.types';

export async function getWais3Cpt2Response(
  visitId: string
): Promise<Wais3Cpt2Response | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_wais3_cpt2')
    .select('*')
    .eq('visit_id', visitId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function saveWais3Cpt2Response(
  response: Wais3Cpt2ResponseInsert
): Promise<Wais3Cpt2Response> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // No internal scoring - values come from external CPT II software
  const { data, error } = await supabase
    .from('responses_wais3_cpt2')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      // Omissions
      cpt2_omissions_value: response.cpt2_omissions_value,
      cpt2_omissions_pourcentage: response.cpt2_omissions_pourcentage,
      cpt2_omissions_tscore: response.cpt2_omissions_tscore,
      cpt2_omissions_percentile: response.cpt2_omissions_percentile,
      cpt2_omissions_guideline: response.cpt2_omissions_guideline,
      // Commissions
      cpt2_comissions_value: response.cpt2_comissions_value,
      cpt2_comissions_pourcentage: response.cpt2_comissions_pourcentage,
      cpt2_comissions_tscore: response.cpt2_comissions_tscore,
      cpt2_comissions_percentile: response.cpt2_comissions_percentile,
      cpt2_comissions_guideline: response.cpt2_comissions_guideline,
      // Hit RT
      cpt2_hitrt_value: response.cpt2_hitrt_value,
      cpt2_hitrt_tscore: response.cpt2_hitrt_tscore,
      cpt2_hitrt_percentile: response.cpt2_hitrt_percentile,
      cpt2_hitrt_guideline: response.cpt2_hitrt_guideline,
      // Hit RT Std. Error
      cpt2_hitrtstder_value: response.cpt2_hitrtstder_value,
      cpt2_hitrtstder_tscore: response.cpt2_hitrtstder_tscore,
      cpt2_hitrtstder_percentile: response.cpt2_hitrtstder_percentile,
      cpt2_hitrtstder_guideline: response.cpt2_hitrtstder_guideline,
      // Variability
      cpt2_variability_value: response.cpt2_variability_value,
      cpt2_variability_tscore: response.cpt2_variability_tscore,
      cpt2_variability_percentile: response.cpt2_variability_percentile,
      cpt2_variability_guideline: response.cpt2_variability_guideline,
      // Detectability
      cpt2_detectability_value: response.cpt2_detectability_value,
      cpt2_detectability_tscore: response.cpt2_detectability_tscore,
      cpt2_detectability_percentile: response.cpt2_detectability_percentile,
      cpt2_detectability_guideline: response.cpt2_detectability_guideline,
      // Response Style
      cpt2_responsestyle_value: response.cpt2_responsestyle_value,
      cpt2_responsestyle_tscore: response.cpt2_responsestyle_tscore,
      cpt2_responsestyle_percentile: response.cpt2_responsestyle_percentile,
      cpt2_responsestyle_guideline: response.cpt2_responsestyle_guideline,
      // Perseverations
      cpt2_perseverations_value: response.cpt2_perseverations_value,
      cpt2_perseverations_pourcentage: response.cpt2_perseverations_pourcentage,
      cpt2_perseverations_tscore: response.cpt2_perseverations_tscore,
      cpt2_perseverations_percentile: response.cpt2_perseverations_percentile,
      cpt2_perseverations_guideline: response.cpt2_perseverations_guideline,
      // Hit RT Block Change
      cpt2_hitrtblockchange_value: response.cpt2_hitrtblockchange_value,
      cpt2_hitrtblockchange_tscore: response.cpt2_hitrtblockchange_tscore,
      cpt2_hitrtblockchange_percentile: response.cpt2_hitrtblockchange_percentile,
      cpt2_hitrtblockchange_guideline: response.cpt2_hitrtblockchange_guideline,
      // Hit SE Block Change
      cpt2_hitseblockchange_value: response.cpt2_hitseblockchange_value,
      cpt2_hitseblockchange_tscore: response.cpt2_hitseblockchange_tscore,
      cpt2_hitseblockchange_percentile: response.cpt2_hitseblockchange_percentile,
      cpt2_hitseblockchange_guideline: response.cpt2_hitseblockchange_guideline,
      // Hit RT ISI Change
      cpt2_hitrtisichange_value: response.cpt2_hitrtisichange_value,
      cpt2_hitrtisichange_tscore: response.cpt2_hitrtisichange_tscore,
      cpt2_hitrtisichange_percentile: response.cpt2_hitrtisichange_percentile,
      cpt2_hitrtisichange_guideline: response.cpt2_hitrtisichange_guideline,
      // Hit SE ISI Change
      cpt2_hitseisichange_value: response.cpt2_hitseisichange_value,
      cpt2_hitseisichange_tscore: response.cpt2_hitseisichange_tscore,
      cpt2_hitseisichange_percentile: response.cpt2_hitseisichange_percentile,
      cpt2_hitseisichange_guideline: response.cpt2_hitseisichange_guideline,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// MEM-III Spatial Span (Memoire Spatiale)
// ============================================================================

import { calculateMem3SpatialScores, Mem3SpatialInput } from './mem3-spatial-scoring';
import type { Wais3Mem3SpatialResponse, Wais3Mem3SpatialResponseInsert } from '@/lib/types/database.types';

export async function getWais3Mem3SpatialResponse(visitId: string): Promise<Wais3Mem3SpatialResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('responses_wais3_mem3_spatial')
    .select('*')
    .eq('visit_id', visitId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function saveWais3Mem3SpatialResponse(
  response: Wais3Mem3SpatialResponseInsert
): Promise<Wais3Mem3SpatialResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Calculate scores using the scoring module
  const input: Mem3SpatialInput = {
    patient_age: response.patient_age,
    odirect_1a: response.odirect_1a,
    odirect_1b: response.odirect_1b,
    odirect_2a: response.odirect_2a,
    odirect_2b: response.odirect_2b,
    odirect_3a: response.odirect_3a,
    odirect_3b: response.odirect_3b,
    odirect_4a: response.odirect_4a,
    odirect_4b: response.odirect_4b,
    odirect_5a: response.odirect_5a,
    odirect_5b: response.odirect_5b,
    odirect_6a: response.odirect_6a,
    odirect_6b: response.odirect_6b,
    odirect_7a: response.odirect_7a,
    odirect_7b: response.odirect_7b,
    odirect_8a: response.odirect_8a,
    odirect_8b: response.odirect_8b,
    inverse_1a: response.inverse_1a,
    inverse_1b: response.inverse_1b,
    inverse_2a: response.inverse_2a,
    inverse_2b: response.inverse_2b,
    inverse_3a: response.inverse_3a,
    inverse_3b: response.inverse_3b,
    inverse_4a: response.inverse_4a,
    inverse_4b: response.inverse_4b,
    inverse_5a: response.inverse_5a,
    inverse_5b: response.inverse_5b,
    inverse_6a: response.inverse_6a,
    inverse_6b: response.inverse_6b,
    inverse_7a: response.inverse_7a,
    inverse_7b: response.inverse_7b,
    inverse_8a: response.inverse_8a,
    inverse_8b: response.inverse_8b
  };

  const scores = calculateMem3SpatialScores(input);

  const { data, error } = await supabase
    .from('responses_wais3_mem3_spatial')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      patient_age: response.patient_age,
      odirect_1a: response.odirect_1a,
      odirect_1b: response.odirect_1b,
      odirect_2a: response.odirect_2a,
      odirect_2b: response.odirect_2b,
      odirect_3a: response.odirect_3a,
      odirect_3b: response.odirect_3b,
      odirect_4a: response.odirect_4a,
      odirect_4b: response.odirect_4b,
      odirect_5a: response.odirect_5a,
      odirect_5b: response.odirect_5b,
      odirect_6a: response.odirect_6a,
      odirect_6b: response.odirect_6b,
      odirect_7a: response.odirect_7a,
      odirect_7b: response.odirect_7b,
      odirect_8a: response.odirect_8a,
      odirect_8b: response.odirect_8b,
      inverse_1a: response.inverse_1a,
      inverse_1b: response.inverse_1b,
      inverse_2a: response.inverse_2a,
      inverse_2b: response.inverse_2b,
      inverse_3a: response.inverse_3a,
      inverse_3b: response.inverse_3b,
      inverse_4a: response.inverse_4a,
      inverse_4b: response.inverse_4b,
      inverse_5a: response.inverse_5a,
      inverse_5b: response.inverse_5b,
      inverse_6a: response.inverse_6a,
      inverse_6b: response.inverse_6b,
      inverse_7a: response.inverse_7a,
      inverse_7b: response.inverse_7b,
      inverse_8a: response.inverse_8a,
      inverse_8b: response.inverse_8b,
      ...scores,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}
