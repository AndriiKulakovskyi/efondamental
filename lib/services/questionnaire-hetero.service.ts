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
