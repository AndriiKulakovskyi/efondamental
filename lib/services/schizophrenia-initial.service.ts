// eFondaMental Platform - Schizophrenia Initial Evaluation Service
// Handles all questionnaire data operations for schizophrenia initial visits

import { createClient } from '@/lib/supabase/server';

// ============================================================================
// Generic Types for Schizophrenia Initial Questionnaires
// ============================================================================

interface SchizophreniaQuestionnaireResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

type SchizophreniaQuestionnaireInsert<T> = Omit<T, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Table name mapping for schizophrenia initial questionnaires
// ============================================================================

export const SCHIZOPHRENIA_INITIAL_TABLES: Record<string, string> = {
  // Nurse module
  'DOSSIER_INFIRMIER_SZ': 'schizophrenia_dossier_infirmier',
  'BILAN_BIOLOGIQUE_SZ': 'schizophrenia_bilan_biologique',
  
  // Hetero-questionnaires module
  'PANSS': 'schizophrenia_panss',
  'CDSS': 'schizophrenia_cdss',
  'BARS': 'schizophrenia_bars',
  'SUMD': 'schizophrenia_sumd',
  'AIMS': 'schizophrenia_aims',
  'BARNES': 'schizophrenia_barnes',
  'SAS': 'schizophrenia_sas',
  'PSP': 'schizophrenia_psp',
  
  // Medical evaluation module
  'TROUBLES_PSYCHOTIQUES': 'schizophrenia_troubles_psychotiques',
  'TROUBLES_COMORBIDES_SZ': 'schizophrenia_troubles_comorbides',
  'ISA_SZ': 'schizophrenia_isa',
  'SUICIDE_HISTORY_SZ': 'schizophrenia_suicide_history',
  'ANTECEDENTS_FAMILIAUX_PSY_SZ': 'schizophrenia_antecedents_familiaux_psy',
  'PERINATALITE_SZ': 'schizophrenia_perinatalite',
  'TEA_COFFEE_SZ': 'schizophrenia_tea_coffee',
  'EVAL_ADDICTOLOGIQUE_SZ': 'schizophrenia_eval_addictologique',
  'ECV': 'schizophrenia_ecv',
  
  // Social module
  'BILAN_SOCIAL_SZ': 'schizophrenia_bilan_social',
  
  // Auto module (patient self-administered)
  'SQOL_SZ': 'schizophrenia_sqol',
};

// ============================================================================
// Generic Get/Save Functions
// ============================================================================

/**
 * Get a schizophrenia initial questionnaire response by visit ID
 */
export async function getSchizophreniaInitialResponse<T extends SchizophreniaQuestionnaireResponse>(
  questionnaireCode: string,
  visitId: string
): Promise<T | null> {
  const tableName = SCHIZOPHRENIA_INITIAL_TABLES[questionnaireCode];
  if (!tableName) {
    throw new Error(`Unknown schizophrenia initial questionnaire code: ${questionnaireCode}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error(`Error fetching ${tableName}:`, error);
    throw error;
  }

  return data as T | null;
}

/**
 * Save a schizophrenia initial questionnaire response (upsert)
 */
export async function saveSchizophreniaInitialResponse<T extends SchizophreniaQuestionnaireResponse>(
  questionnaireCode: string,
  response: SchizophreniaQuestionnaireInsert<T>
): Promise<T> {
  const tableName = SCHIZOPHRENIA_INITIAL_TABLES[questionnaireCode];
  if (!tableName) {
    throw new Error(`Unknown schizophrenia initial questionnaire code: ${questionnaireCode}`);
  }

  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Add completed_by if applicable
  const responseWithMeta = {
    ...response,
    completed_by: user.data.user?.id
  };

  const { data, error } = await supabase
    .from(tableName)
    .upsert(responseWithMeta, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) {
    console.error(`Error saving ${tableName}:`, error);
    throw error;
  }

  return data as T;
}

// ============================================================================
// Completion Status Functions
// ============================================================================

/**
 * Get completion status for all schizophrenia initial questionnaires in a visit
 */
export async function getSchizophreniaInitialCompletionStatus(visitId: string): Promise<Record<string, boolean>> {
  const supabase = await createClient();
  const status: Record<string, boolean> = {};

  // Check each table for responses
  for (const [code, tableName] of Object.entries(SCHIZOPHRENIA_INITIAL_TABLES)) {
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .eq('visit_id', visitId)
      .single();
    
    status[code] = !error && !!data;
  }

  return status;
}

/**
 * Get all completed questionnaires for a schizophrenia initial visit
 */
export async function getAllSchizophreniaInitialResponses(visitId: string): Promise<Record<string, any>> {
  const responses: Record<string, any> = {};
  
  for (const code of Object.keys(SCHIZOPHRENIA_INITIAL_TABLES)) {
    try {
      const response = await getSchizophreniaInitialResponse(code, visitId);
      if (response) {
        responses[code] = response;
      }
    } catch (error) {
      // Skip errors for individual questionnaires
      console.warn(`Could not fetch ${code} response:`, error);
    }
  }

  return responses;
}

// ============================================================================
// Specific Get Functions (for convenience and type safety)
// ============================================================================

// Nurse module
export async function getDossierInfirmierSzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('DOSSIER_INFIRMIER_SZ', visitId);
}

export async function getBilanBiologiqueSzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('BILAN_BIOLOGIQUE_SZ', visitId);
}

// Hetero-questionnaires module
export async function getPanssResponse(visitId: string) {
  return getSchizophreniaInitialResponse('PANSS', visitId);
}

export async function getCdssResponse(visitId: string) {
  return getSchizophreniaInitialResponse('CDSS', visitId);
}

export async function getBarsResponse(visitId: string) {
  return getSchizophreniaInitialResponse('BARS', visitId);
}

export async function getSumdResponse(visitId: string) {
  return getSchizophreniaInitialResponse('SUMD', visitId);
}

export async function getAimsResponse(visitId: string) {
  return getSchizophreniaInitialResponse('AIMS', visitId);
}

export async function getBarnesResponse(visitId: string) {
  return getSchizophreniaInitialResponse('BARNES', visitId);
}

export async function getSasResponse(visitId: string) {
  return getSchizophreniaInitialResponse('SAS', visitId);
}

export async function getPspResponse(visitId: string) {
  return getSchizophreniaInitialResponse('PSP', visitId);
}

// Medical evaluation module
export async function getTroublesPsychotiquesResponse(visitId: string) {
  return getSchizophreniaInitialResponse('TROUBLES_PSYCHOTIQUES', visitId);
}

export async function getTroublesComorbidesSzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('TROUBLES_COMORBIDES_SZ', visitId);
}

export async function getIsaSzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('ISA_SZ', visitId);
}

export async function getSuicideHistorySzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('SUICIDE_HISTORY_SZ', visitId);
}

export async function getAntecedentsFamiliauxPsySzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('ANTECEDENTS_FAMILIAUX_PSY_SZ', visitId);
}

export async function getPerinataliteSzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('PERINATALITE_SZ', visitId);
}

export async function getTeaCoffeeSzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('TEA_COFFEE_SZ', visitId);
}

export async function getEvalAddictologiqueSzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('EVAL_ADDICTOLOGIQUE_SZ', visitId);
}

export async function getEcvResponse(visitId: string) {
  return getSchizophreniaInitialResponse('ECV', visitId);
}

// Social module
export async function getBilanSocialSzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('BILAN_SOCIAL_SZ', visitId);
}

// Auto module (patient self-administered)
export async function getSqolResponse(visitId: string) {
  return getSchizophreniaInitialResponse('SQOL_SZ', visitId);
}

// ============================================================================
// Specialized Save Functions with Scoring Logic
// ============================================================================

/**
 * Save PANSS response with scoring calculation
 */
export async function savePanssResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // Remove section fields that shouldn't be saved to DB
  const {
    section_positive,
    section_negative,
    section_general,
    ...responseData
  } = response;

  // Extract item values
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
    return values.reduce<number>((sum, v) => sum + (v as number), 0);
  };

  // Calculate Traditional Subscale Scores
  const positive_score = sumIfComplete([p1, p2, p3, p4, p5, p6, p7]);
  const negative_score = sumIfComplete([n1, n2, n3, n4, n5, n6, n7]);
  const general_score = sumIfComplete([g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11, g12, g13, g14, g15, g16]);
  
  const total_score = (positive_score !== null && negative_score !== null && general_score !== null)
    ? positive_score + negative_score + general_score
    : null;

  // Wallwork 2012 Five-Factor Model
  const wallwork_positive = sumIfComplete([p1, p3, p5, g9]);
  const wallwork_negative = sumIfComplete([n1, n2, n3, n4, n6, g7]);
  const wallwork_disorganized = sumIfComplete([p2, n5, g11]);
  const wallwork_excited = sumIfComplete([p4, p7, g8, g14]);
  const wallwork_depressed = sumIfComplete([g2, g3, g6]);

  // Lancon 1998 Five-Factor Model
  const lancon_positive = sumIfComplete([p1, p3, g9, p5, p6]);
  const lancon_negative = sumIfComplete([n1, n2, n3, n4, n6, g7, g16]);
  const lancon_disorganized = sumIfComplete([g10, n5, p2]);
  const lancon_excited = sumIfComplete([g4, p4, g14, p7, g8]);
  const lancon_depressed = sumIfComplete([g1, g3, g6, g2]);

  // Van der Gaag 2006 Five-Factor Model
  const vandergaag_positive = sumIfComplete([p1, p3, g9, p6, p5]);
  const vandergaag_negative = sumIfComplete([n6, n1, n2, n4, g7, n3, g16, g8]);
  const vandergaag_disorganized = sumIfComplete([n7, g11, g10, p2, n5, g5, g12, g13]);
  const vandergaag_excited = sumIfComplete([g14, p4, p7, g8]);
  const vandergaag_depressed = sumIfComplete([g2, g6, g3, g4]);

  const { data, error } = await supabase
    .from('schizophrenia_panss')
    .upsert({
      ...responseData,
      positive_score,
      negative_score,
      general_score,
      total_score,
      wallwork_positive,
      wallwork_negative,
      wallwork_disorganized,
      wallwork_excited,
      wallwork_depressed,
      lancon_positive,
      lancon_negative,
      lancon_disorganized,
      lancon_excited,
      lancon_depressed,
      vandergaag_positive,
      vandergaag_negative,
      vandergaag_disorganized,
      vandergaag_excited,
      vandergaag_depressed,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Save CDSS response with scoring calculation
 */
export async function saveCdssResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const {
    cdss_instructions,
    ...responseData
  } = response;

  const items = [
    responseData.q1, responseData.q2, responseData.q3, responseData.q4, responseData.q5,
    responseData.q6, responseData.q7, responseData.q8, responseData.q9
  ];
  const allAnswered = items.every(item => item !== null && item !== undefined);

  let total_score: number | null = null;
  let has_depressive_syndrome: boolean | null = null;
  let interpretation: string | null = null;

  if (allAnswered) {
    const computedScore = items.reduce((sum, item) => sum + (item ?? 0), 0);
    total_score = computedScore;
    has_depressive_syndrome = computedScore > 6;
    interpretation = has_depressive_syndrome
      ? 'Presence d\'un syndrome depressif (score > 6)'
      : 'Absence de syndrome depressif significatif (score <= 6)';
  }

  const { data, error } = await supabase
    .from('schizophrenia_cdss')
    .upsert({
      ...responseData,
      total_score,
      has_depressive_syndrome,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Save BARS response with adherence calculation
 */
export async function saveBarsResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const {
    bars_instructions,
    ...responseData
  } = response;

  const q2 = responseData.q2 ?? null;
  const q3 = responseData.q3 ?? null;

  let adherence_score: number | null = null;
  let interpretation: string | null = null;

  if (q2 !== null && q3 !== null) {
    const missedDays = q2 + q3;
    adherence_score = Math.max(0, Math.round(((30 - missedDays) / 30) * 100));
    
    if (adherence_score >= 91) {
      interpretation = 'Bonne observance (91-100%)';
    } else if (adherence_score >= 76) {
      interpretation = 'Observance acceptable (76-90%)';
    } else if (adherence_score >= 51) {
      interpretation = 'Observance partielle (51-75%)';
    } else {
      interpretation = 'Observance tres faible (0-50%)';
    }
  }

  const { data, error } = await supabase
    .from('schizophrenia_bars')
    .upsert({
      ...responseData,
      adherence_score,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Save SUMD response with attribution rule enforcement
 */
export async function saveSumdResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const {
    sumd_instructions,
    section_domain1,
    section_domain2,
    section_domain3,
    section_domain4,
    section_domain5,
    section_domain6,
    section_domain7,
    section_domain8,
    section_domain9,
    ...responseData
  } = response;

  // Apply attribution dependency rule
  const applyAttributionRule = (conscienceValue: number | null, attributionValue: number | null): number | null => {
    if (conscienceValue === 0 || conscienceValue === 3) {
      return 0;
    }
    return attributionValue;
  };

  const attribu4 = applyAttributionRule(responseData.conscience4 ?? null, responseData.attribu4 ?? null);
  const attribu5 = applyAttributionRule(responseData.conscience5 ?? null, responseData.attribu5 ?? null);
  const attribu6 = applyAttributionRule(responseData.conscience6 ?? null, responseData.attribu6 ?? null);
  const attribu7 = applyAttributionRule(responseData.conscience7 ?? null, responseData.attribu7 ?? null);
  const attribu8 = applyAttributionRule(responseData.conscience8 ?? null, responseData.attribu8 ?? null);
  const attribu9 = applyAttributionRule(responseData.conscience9 ?? null, responseData.attribu9 ?? null);

  const { data, error } = await supabase
    .from('schizophrenia_sumd')
    .upsert({
      ...responseData,
      attribu4,
      attribu5,
      attribu6,
      attribu7,
      attribu8,
      attribu9,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Save AIMS response with movement score calculation
 */
export async function saveAimsResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const {
    aims_instructions,
    section_orofacial,
    section_extremities,
    section_trunk,
    section_global,
    section_dental,
    ...responseData
  } = response;

  const movementItems = [
    responseData.q1, responseData.q2, responseData.q3, responseData.q4,
    responseData.q5, responseData.q6, responseData.q7
  ];
  const answeredItems = movementItems.filter(item => item !== null && item !== undefined);

  let movement_score: number | null = null;
  let interpretation: string | null = null;

  if (answeredItems.length > 0) {
    const computedScore = movementItems.reduce((sum, item) => sum + (item ?? 0), 0);
    movement_score = computedScore;

    const hasModerateOrSevere = movementItems.some(item => item !== null && item >= 3);
    const lightOrMoreCount = movementItems.filter(item => item !== null && item >= 2).length;

    if (hasModerateOrSevere || lightOrMoreCount >= 2) {
      if (computedScore >= 14) {
        interpretation = 'Dyskinesie severe - Surveillance etroite recommandee';
      } else if (computedScore >= 7) {
        interpretation = 'Dyskinesie moderee - Evaluation du traitement conseillee';
      } else {
        interpretation = 'Dyskinesie probable - A surveiller';
      }
    } else if (computedScore > 0) {
      interpretation = 'Mouvements minimes - Surveillance de routine';
    } else {
      interpretation = 'Pas de mouvement anormal detecte';
    }
  }

  const { data, error } = await supabase
    .from('schizophrenia_aims')
    .upsert({
      ...responseData,
      movement_score,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Save Barnes response with akathisia scoring
 */
export async function saveBarnesResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const {
    barnes_instructions,
    section_objective,
    section_subjective,
    section_global,
    ...responseData
  } = response;

  const q1 = responseData.q1 ?? null;
  const q2 = responseData.q2 ?? null;
  const q3 = responseData.q3 ?? null;
  const q4 = responseData.q4 ?? null;

  let objective_subjective_score: number | null = null;
  let global_score: number | null = null;
  let interpretation: string | null = null;

  if (q1 !== null || q2 !== null || q3 !== null) {
    objective_subjective_score = (q1 ?? 0) + (q2 ?? 0) + (q3 ?? 0);
  }

  if (q4 !== null) {
    global_score = q4;

    switch (q4) {
      case 0: interpretation = 'Absence - Pas d\'akathisie'; break;
      case 1: interpretation = 'Douteux - Akathisie questionnable'; break;
      case 2: interpretation = 'Legere - Akathisie legere, peu de gene'; break;
      case 3: interpretation = 'Moyenne - Akathisie moderee, genante'; break;
      case 4: interpretation = 'Marquee - Akathisie significative, eprouvante'; break;
      case 5: interpretation = 'Severe - Akathisie severe avec detresse intense'; break;
      default: interpretation = 'Score invalide';
    }
  }

  const { data, error } = await supabase
    .from('schizophrenia_barnes')
    .upsert({
      ...responseData,
      objective_subjective_score,
      global_score,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Save SAS response with mean score calculation
 */
export async function saveSasResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const {
    sas_instructions,
    ...responseData
  } = response;

  const items = [
    responseData.q1, responseData.q2, responseData.q3, responseData.q4, responseData.q5,
    responseData.q6, responseData.q7, responseData.q8, responseData.q9, responseData.q10
  ];

  let mean_score: number | null = null;
  let interpretation: string | null = null;

  const allAnswered = items.every(item => item !== null && item !== undefined);

  if (allAnswered) {
    const sum = items.reduce((acc, item) => acc + item, 0);
    const score = sum / 10;
    mean_score = Math.round(score * 100) / 100;

    if (score === 0) {
      interpretation = 'Absence de symptomes extrapyramidaux';
    } else if (score <= 0.3) {
      interpretation = 'Symptomes extrapyramidaux minimaux';
    } else if (score <= 1.0) {
      interpretation = 'Symptomes extrapyramidaux legers - Cliniquement significatifs';
    } else if (score <= 2.0) {
      interpretation = 'Symptomes extrapyramidaux moderes - Ajustement du traitement conseille';
    } else {
      interpretation = 'Symptomes extrapyramidaux severes - Intervention requise';
    }
  }

  const { data, error } = await supabase
    .from('schizophrenia_sas')
    .upsert({
      ...responseData,
      mean_score,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Save PSP response with interpretation
 */
export async function savePspResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const {
    psp_instructions,
    step1_header,
    step2_header,
    step3_header,
    ...responseData
  } = response;

  const finalScore = responseData.final_score;
  let interpretation: string | null = null;

  if (finalScore !== null && finalScore !== undefined) {
    if (finalScore >= 91) {
      interpretation = 'Tres bon fonctionnement - Excellent dans tous les domaines';
    } else if (finalScore >= 81) {
      interpretation = 'Bon fonctionnement - Difficultes courantes seulement';
    } else if (finalScore >= 71) {
      interpretation = 'Difficultes legeres - Dans au moins un domaine';
    } else if (finalScore >= 61) {
      interpretation = 'Difficultes manifestes - Notables mais pas invalidantes';
    } else if (finalScore >= 51) {
      interpretation = 'Difficultes marquees - Significatives dans un domaine';
    } else if (finalScore >= 41) {
      interpretation = 'Difficultes marquees multiples ou severes - Fonctionnement substantiellement altere';
    } else if (finalScore >= 31) {
      interpretation = 'Difficultes severes combinees - Alteration severe du fonctionnement';
    } else if (finalScore >= 21) {
      interpretation = 'Difficultes severes majeures - Aide professionnelle necessaire';
    } else if (finalScore >= 11) {
      interpretation = 'Difficultes severes generalisees - Incapacite majeure';
    } else {
      interpretation = 'Absence d\'autonomie - Risque vital possible';
    }
  }

  const { data, error } = await supabase
    .from('schizophrenia_psp')
    .upsert({
      ...responseData,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Save Dossier Infirmier SZ response
 */
export async function saveDossierInfirmierSzResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const {
    bmi,
    elec_qtc,
    section_physical_params,
    section_bp_lying,
    section_ecg,
    titre_cardio,
    ...responseData
  } = response;

  const { data, error } = await supabase
    .from('schizophrenia_dossier_infirmier')
    .upsert({
      ...responseData,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Save Bilan Biologique SZ response with calculated fields
 */
export async function saveBilanBiologiqueSzResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const {
    section_date,
    section_biochimie,
    section_lipidique,
    section_nfs,
    section_hormonaux,
    section_psychotropes,
    section_vitamine_d,
    section_toxo,
    titre_avertissement,
    html_crp_info,
    titre_hemo_glyc_diabete,
    html_vitd,
    titre_prolactine,
    titre_prisetraitement,
    html_spec_cutane,
    html_toxo,
    html_interpretation,
    ...responseData
  } = response;

  // Calculate chol_rapport_hdltot if both values are available
  let chol_rapport_hdltot = null;
  if (responseData.chol_total && responseData.chol_hdl && responseData.chol_hdl > 0) {
    chol_rapport_hdltot = responseData.chol_total / responseData.chol_hdl;
  }

  const { data, error } = await supabase
    .from('schizophrenia_bilan_biologique')
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

/**
 * Save Eval Addictologique SZ response with DSM5 severity scoring
 */
export async function saveEvalAddictologiqueSzResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const {
    section_alcool,
    section_tabac_main,
    section_cannabis_main,
    section_autres_drogues,
    section_autres_drogues_details,
    section_jeux,
    section_tabac,
    section_cannabis,
    section_alcohol_consumption,
    section_dsm5_criteria,
    ...responseData
  } = response;

  // Alcohol DSM5 severity scoring
  const alcoholLifetimeCriteriaFields = [
    'rad_add_alc8a1', 'rad_add_alc8b1', 'rad_add_alc8c1', 'rad_add_alc8d1',
    'rad_add_alc8e1', 'rad_add_alc8f1', 'rad_add_alc8g1', 'rad_add_alc8h1',
    'rad_add_alc8i1', 'rad_add_alc8j1', 'rad_add_alc8k1', 'rad_add_alc8l1'
  ];

  const alcoholMonthCriteriaFields = [
    'rad_add_alc8a2', 'rad_add_alc8b2', 'rad_add_alc8c2', 'rad_add_alc8d2',
    'rad_add_alc8e2', 'rad_add_alc8f2', 'rad_add_alc8g2', 'rad_add_alc8h2',
    'rad_add_alc8i2', 'rad_add_alc8j2', 'rad_add_alc8k2', 'rad_add_alc8l2'
  ];

  let dsm5_lifetime_count: number | null = null;
  let dsm5_lifetime_severity: string | null = null;
  let dsm5_12month_count: number | null = null;
  let dsm5_12month_severity: string | null = null;

  const getSeverity = (count: number): string => {
    if (count <= 1) return 'none';
    if (count <= 3) return 'mild';
    if (count <= 5) return 'moderate';
    return 'severe';
  };

  if (responseData.rad_add_alc1 === 'Oui') {
    dsm5_lifetime_count = alcoholLifetimeCriteriaFields.filter(
      field => responseData[field] === 'Oui'
    ).length;
    dsm5_lifetime_severity = getSeverity(dsm5_lifetime_count);

    dsm5_12month_count = alcoholMonthCriteriaFields.filter(
      field => responseData[field] === 'Oui'
    ).length;
    dsm5_12month_severity = getSeverity(dsm5_12month_count);
  }

  // Cannabis DSM5 severity scoring
  const cannabisLifetimeCriteriaFields = [
    'rad_add_can_dsm5_a', 'rad_add_can_dsm5_b', 'rad_add_can_dsm5_c', 'rad_add_can_dsm5_d',
    'rad_add_can_dsm5_e', 'rad_add_can_dsm5_f', 'rad_add_can_dsm5_g', 'rad_add_can_dsm5_h',
    'rad_add_can_dsm5_i', 'rad_add_can_dsm5_j', 'rad_add_can_dsm5_k', 'rad_add_can_dsm5_l'
  ];

  const cannabisMonthCriteriaFields = [
    'rad_add_can_dsm5_a_12m', 'rad_add_can_dsm5_b_12m', 'rad_add_can_dsm5_c_12m', 'rad_add_can_dsm5_d_12m',
    'rad_add_can_dsm5_e_12m', 'rad_add_can_dsm5_f_12m', 'rad_add_can_dsm5_g_12m', 'rad_add_can_dsm5_h_12m',
    'rad_add_can_dsm5_i_12m', 'rad_add_can_dsm5_j_12m', 'rad_add_can_dsm5_k_12m', 'rad_add_can_dsm5_l_12m'
  ];

  let dsm5_cannabis_lifetime_count: number | null = null;
  let dsm5_cannabis_lifetime_severity: string | null = null;
  let dsm5_cannabis_12month_count: number | null = null;
  let dsm5_cannabis_12month_severity: string | null = null;

  if (responseData.rad_add_cannabis === 'Oui') {
    dsm5_cannabis_lifetime_count = cannabisLifetimeCriteriaFields.filter(
      field => responseData[field] === 'Oui'
    ).length;
    dsm5_cannabis_lifetime_severity = getSeverity(dsm5_cannabis_lifetime_count);

    dsm5_cannabis_12month_count = cannabisMonthCriteriaFields.filter(
      field => responseData[field] === 'Oui'
    ).length;
    dsm5_cannabis_12month_severity = getSeverity(dsm5_cannabis_12month_count);
  }

  // Other substances DSM5 severity scoring
  const autresLifetimeCriteriaFields = [
    'rad_add_autres_dsm5_a', 'rad_add_autres_dsm5_b', 'rad_add_autres_dsm5_c', 'rad_add_autres_dsm5_d',
    'rad_add_autres_dsm5_e', 'rad_add_autres_dsm5_f', 'rad_add_autres_dsm5_g', 'rad_add_autres_dsm5_h',
    'rad_add_autres_dsm5_i', 'rad_add_autres_dsm5_j', 'rad_add_autres_dsm5_k', 'rad_add_autres_dsm5_l'
  ];

  const autresMonthCriteriaFields = [
    'rad_add_autres_dsm5_a_12m', 'rad_add_autres_dsm5_b_12m', 'rad_add_autres_dsm5_c_12m', 'rad_add_autres_dsm5_d_12m',
    'rad_add_autres_dsm5_e_12m', 'rad_add_autres_dsm5_f_12m', 'rad_add_autres_dsm5_g_12m', 'rad_add_autres_dsm5_h_12m',
    'rad_add_autres_dsm5_i_12m', 'rad_add_autres_dsm5_j_12m', 'rad_add_autres_dsm5_k_12m', 'rad_add_autres_dsm5_l_12m'
  ];

  let dsm5_autres_lifetime_count: number | null = null;
  let dsm5_autres_lifetime_severity: string | null = null;
  let dsm5_autres_12month_count: number | null = null;
  let dsm5_autres_12month_severity: string | null = null;

  if (responseData.rad_add_autres_substances_abus === 'Oui') {
    dsm5_autres_lifetime_count = autresLifetimeCriteriaFields.filter(
      field => responseData[field] === 'Oui'
    ).length;
    dsm5_autres_lifetime_severity = getSeverity(dsm5_autres_lifetime_count);

    dsm5_autres_12month_count = autresMonthCriteriaFields.filter(
      field => responseData[field] === 'Oui'
    ).length;
    dsm5_autres_12month_severity = getSeverity(dsm5_autres_12month_count);
  }

  const { data, error } = await supabase
    .from('schizophrenia_eval_addictologique')
    .upsert({
      ...responseData,
      dsm5_lifetime_count,
      dsm5_lifetime_severity,
      dsm5_12month_count,
      dsm5_12month_severity,
      dsm5_cannabis_lifetime_count,
      dsm5_cannabis_lifetime_severity,
      dsm5_cannabis_12month_count,
      dsm5_cannabis_12month_severity,
      dsm5_autres_lifetime_count,
      dsm5_autres_lifetime_severity,
      dsm5_autres_12month_count,
      dsm5_autres_12month_severity,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// S-QoL (Quality of Life) Scoring
// ============================================================================

/**
 * S-QoL subscale definitions
 */
const SQOL_SUBSCALES = {
  vie_sentimentale: ['q14', 'q15'],
  estime_de_soi: ['q1', 'q4'],
  relation_famille: ['q10', 'q11'],
  relation_amis: ['q12', 'q13'],
  autonomie: ['q5', 'q6'],
  bien_etre_psychologique: ['q16', 'q17', 'q18'],
  bien_etre_physique: ['q8', 'q9'],
  resilience: ['q2', 'q3', 'q7'],
};

/**
 * Calculate a single S-QoL subscale score as percentage (0-100%)
 * Excludes items marked as "Pas concerné(e)"
 */
function calculateSqolSubscale(
  responses: Record<string, any>,
  questionIds: string[]
): number | null {
  let sum = 0;
  let validCount = 0;
  
  for (const qId of questionIds) {
    const notConcerned = responses[`${qId}_not_concerned`];
    if (notConcerned === true) continue; // Skip excluded items
    
    const value = responses[qId];
    if (value !== null && value !== undefined && typeof value === 'number') {
      sum += value;
      validCount++;
    }
  }
  
  if (validCount === 0) return null; // All "Pas concerné"
  
  // Score = (sum / max_possible) * 100
  const percentage = (sum / (validCount * 4)) * 100;
  return Math.round(percentage * 100) / 100;
}

/**
 * Calculate S-QoL global score as mean of valid subscale scores
 */
function calculateSqolGlobal(subscaleScores: Record<string, number | null>): number | null {
  const validScores = Object.values(subscaleScores).filter(
    (s): s is number => s !== null
  );
  
  if (validScores.length === 0) return null;
  
  const mean = validScores.reduce((a, b) => a + b, 0) / validScores.length;
  return Math.round(mean * 100) / 100;
}

/**
 * Save S-QoL response with subscale and global scoring
 */
export async function saveSqolResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  
  // If questionnaire not done, just save the status
  if (response.questionnaire_done === 'Non fait') {
    const { data, error } = await supabase
      .from('schizophrenia_sqol')
      .upsert({
        visit_id: response.visit_id,
        patient_id: response.patient_id,
        questionnaire_done: response.questionnaire_done,
        completed_by: user.data.user?.id
      }, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving schizophrenia_sqol:', error);
      throw error;
    }
    return data;
  }
  
  // Calculate all subscale scores
  const subscaleScores = {
    score_vie_sentimentale: calculateSqolSubscale(response, SQOL_SUBSCALES.vie_sentimentale),
    score_estime_de_soi: calculateSqolSubscale(response, SQOL_SUBSCALES.estime_de_soi),
    score_relation_famille: calculateSqolSubscale(response, SQOL_SUBSCALES.relation_famille),
    score_relation_amis: calculateSqolSubscale(response, SQOL_SUBSCALES.relation_amis),
    score_autonomie: calculateSqolSubscale(response, SQOL_SUBSCALES.autonomie),
    score_bien_etre_psychologique: calculateSqolSubscale(response, SQOL_SUBSCALES.bien_etre_psychologique),
    score_bien_etre_physique: calculateSqolSubscale(response, SQOL_SUBSCALES.bien_etre_physique),
    score_resilience: calculateSqolSubscale(response, SQOL_SUBSCALES.resilience),
  };
  
  // Calculate global score
  const total_score = calculateSqolGlobal(subscaleScores);
  
  // Generate interpretation
  const interpretation = total_score !== null
    ? `Score global de qualité de vie: ${total_score}% (plus le score est élevé, meilleure est la qualité de vie)`
    : 'Score non calculable (questionnaire incomplet ou toutes les questions marquées "Pas concerné(e)")';
  
  // Remove instruction fields before saving
  const { 
    instruction_title, 
    instruction_consigne, 
    instruction_actuellement, 
    instruction_actuellement2,
    ...responseData 
  } = response;
  
  const { data, error } = await supabase
    .from('schizophrenia_sqol')
    .upsert({
      ...responseData,
      ...subscaleScores,
      total_score,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving schizophrenia_sqol:', error);
    throw error;
  }
  return data;
}
