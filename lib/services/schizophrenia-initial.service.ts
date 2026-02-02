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
  'CTQ': 'schizophrenia_ctq',
  'MARS_SZ': 'schizophrenia_mars',
  'BIS_SZ': 'schizophrenia_bis',
  'EQ5D5L_SZ': 'schizophrenia_eq5d5l',
  'IPAQ_SZ': 'schizophrenia_ipaq',
  'YBOCS_SZ': 'schizophrenia_ybocs',
  'WURS25_SZ': 'schizophrenia_wurs25',
  'STORI_SZ': 'schizophrenia_stori',
  'SOGS_SZ': 'schizophrenia_sogs',
  'PSQI_SZ': 'schizophrenia_psqi',
  'PRESENTEISME_SZ': 'schizophrenia_presenteisme',
  'FAGERSTROM_SZ': 'schizophrenia_fagerstrom',
  
  // Entourage module (caregiver-administered)
  'EPHP_SZ': 'schizophrenia_ephp',
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

  // Specialized routing for questionnaires with scoring/custom logic
  switch (questionnaireCode) {
    case 'DOSSIER_INFIRMIER_SZ':
      return await saveDossierInfirmierSzResponse(response) as any as T;
    case 'BILAN_BIOLOGIQUE_SZ':
      return await saveBilanBiologiqueSzResponse(response) as any as T;
    case 'PANSS':
      return await savePanssResponse(response) as any as T;
    case 'CDSS':
      return await saveCdssResponse(response) as any as T;
    case 'BARS':
      return await saveBarsResponse(response) as any as T;
    case 'SUMD':
      return await saveSumdResponse(response) as any as T;
    case 'AIMS':
      return await saveAimsResponse(response) as any as T;
    case 'BARNES':
      return await saveBarnesResponse(response) as any as T;
    case 'SAS':
      return await saveSasResponse(response) as any as T;
    case 'PSP':
      return await savePspResponse(response) as any as T;
    case 'BILAN_SOCIAL_SZ':
      return await saveBilanSocialSzResponse(response) as any as T;
    case 'SQOL_SZ':
      return await saveSqolResponse(response) as any as T;
    case 'CTQ':
      return await saveCtqResponse(response) as any as T;
    case 'MARS_SZ':
      return await saveMarsResponse(response) as any as T;
    case 'BIS_SZ':
      return await saveBisResponse(response) as any as T;
    case 'EQ5D5L_SZ':
      return await saveEq5d5lSzResponse(response) as any as T;
    case 'IPAQ_SZ':
      return await saveIpaqSzResponse(response) as any as T;
    case 'YBOCS_SZ':
      return await saveYbocsResponse(response) as any as T;
    case 'WURS25_SZ':
      return await saveWurs25SzResponse(response) as any as T;
    case 'STORI_SZ':
      return await saveStoriSzResponse(response) as any as T;
    case 'SOGS_SZ':
      return await saveSogsSzResponse(response) as any as T;
    case 'PSQI_SZ':
      return await savePsqiSzResponse(response) as any as T;
    case 'PRESENTEISME_SZ':
      return await savePresenteismeSzResponse(response) as any as T;
    case 'FAGERSTROM_SZ':
      return await saveFagerstromSzResponse(response) as any as T;
    case 'EPHP_SZ':
      return await saveEphpSzResponse(response) as any as T;
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

/**
 * Save Bilan Social SZ response
 */
export async function saveBilanSocialSzResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  const dataToSave = { ...response };
  
  // Convert number to boolean for justice_safeguard if it's 1 (migration from actions.ts)
  if (dataToSave.justice_safeguard === 1) {
    dataToSave.justice_safeguard = true;
  }

  const { data, error } = await supabase
    .from('schizophrenia_bilan_social')
    .upsert({
      ...dataToSave,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving schizophrenia_bilan_social:', error);
    throw error;
  }
  return data;
}

// Auto module (patient self-administered)
export async function getSqolResponse(visitId: string) {
  return getSchizophreniaInitialResponse('SQOL_SZ', visitId);
}

export async function getCtqResponse(visitId: string) {
  return getSchizophreniaInitialResponse('CTQ', visitId);
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

// ============================================================================
// CTQ (Childhood Trauma Questionnaire) Scoring
// ============================================================================

// Items that need to be reversed during scoring (6 - value)
const CTQ_REVERSE_ITEMS = [2, 5, 7, 13, 19, 26, 28];

// Subscale item mappings
const CTQ_SUBSCALE_ITEMS = {
  emotional_abuse: [3, 8, 14, 18, 25],
  physical_abuse: [9, 11, 12, 15, 17],
  sexual_abuse: [20, 21, 23, 24, 27],
  emotional_neglect: [5, 7, 13, 19, 28],
  physical_neglect: [1, 2, 4, 6, 26],
  denial: [10, 16, 22]
};

// Severity thresholds for each subscale (based on CTQ clinical guidelines)
const CTQ_SEVERITY_THRESHOLDS_SERVICE = {
  emotional_abuse: { none: 8, low: 12, moderate: 15, severe: 16 },
  physical_abuse: { none: 7, low: 9, moderate: 12, severe: 13 },
  sexual_abuse: { none: 5, low: 7, moderate: 12, severe: 13 },
  emotional_neglect: { none: 9, low: 14, moderate: 17, severe: 18 },
  physical_neglect: { none: 7, low: 9, moderate: 12, severe: 13 }
};

/**
 * Get the adjusted value for an item (reverse scoring applied if needed)
 */
function getCtqAdjustedValue(responses: Record<string, any>, itemNum: number): number {
  const key = `q${itemNum}`;
  const value = responses[key] as number | null | undefined;
  if (value === null || value === undefined) return 0;
  return CTQ_REVERSE_ITEMS.includes(itemNum) ? (6 - value) : value;
}

/**
 * Get raw value for an item (no reverse scoring)
 */
function getCtqRawValue(responses: Record<string, any>, itemNum: number): number {
  const key = `q${itemNum}`;
  const value = responses[key] as number | null | undefined;
  return value ?? 0;
}

/**
 * Calculate CTQ subscale score with reverse scoring
 */
function calculateCtqSubscaleScore(responses: Record<string, any>, items: number[]): number {
  return items.reduce((sum, item) => sum + getCtqAdjustedValue(responses, item), 0);
}

/**
 * Determine severity level for a CTQ subscale
 */
function interpretCtqSeverity(subscale: keyof typeof CTQ_SEVERITY_THRESHOLDS_SERVICE, score: number): string {
  const thresholds = CTQ_SEVERITY_THRESHOLDS_SERVICE[subscale];
  if (score <= thresholds.none) return 'no_trauma';
  if (score <= thresholds.low) return 'low';
  if (score <= thresholds.moderate) return 'moderate';
  return 'severe';
}

/**
 * Get severity label in French
 */
function getCtqSeverityLabelFr(severity: string): string {
  switch (severity) {
    case 'no_trauma': return 'Absent/Minimal';
    case 'low': return 'Faible à modéré';
    case 'moderate': return 'Modéré à sévère';
    case 'severe': return 'Sévère à extrême';
    default: return severity;
  }
}

/**
 * Save CTQ response with subscale scoring, severity levels, and denial calculation
 */
export async function saveCtqResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  
  // If questionnaire not done, just save the status
  if (response.questionnaire_done === 'Non fait') {
    const { data, error } = await supabase
      .from('schizophrenia_ctq')
      .upsert({
        visit_id: response.visit_id,
        patient_id: response.patient_id,
        questionnaire_done: response.questionnaire_done,
        completed_by: user.data.user?.id
      }, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving schizophrenia_ctq:', error);
      throw error;
    }
    return data;
  }
  
  // Calculate subscale scores (with reverse scoring applied)
  const emotional_abuse_score = calculateCtqSubscaleScore(response, CTQ_SUBSCALE_ITEMS.emotional_abuse);
  const physical_abuse_score = calculateCtqSubscaleScore(response, CTQ_SUBSCALE_ITEMS.physical_abuse);
  const sexual_abuse_score = calculateCtqSubscaleScore(response, CTQ_SUBSCALE_ITEMS.sexual_abuse);
  const emotional_neglect_score = calculateCtqSubscaleScore(response, CTQ_SUBSCALE_ITEMS.emotional_neglect);
  const physical_neglect_score = calculateCtqSubscaleScore(response, CTQ_SUBSCALE_ITEMS.physical_neglect);
  
  // Calculate severity levels
  const emotional_abuse_severity = interpretCtqSeverity('emotional_abuse', emotional_abuse_score);
  const physical_abuse_severity = interpretCtqSeverity('physical_abuse', physical_abuse_score);
  const sexual_abuse_severity = interpretCtqSeverity('sexual_abuse', sexual_abuse_score);
  const emotional_neglect_severity = interpretCtqSeverity('emotional_neglect', emotional_neglect_score);
  const physical_neglect_severity = interpretCtqSeverity('physical_neglect', physical_neglect_score);
  
  // Denial/minimization score (items 10, 16, 22 - NOT reversed, raw sum)
  const denial_score = CTQ_SUBSCALE_ITEMS.denial.reduce((sum, item) => sum + getCtqRawValue(response, item), 0);
  const minimization_score = denial_score;
  
  // Total score (sum of all 5 clinical subscales, excluding denial)
  const total_score = emotional_abuse_score + physical_abuse_score + sexual_abuse_score + 
                      emotional_neglect_score + physical_neglect_score;
  
  // Build interpretation string
  const interpretationParts: string[] = [];
  
  if (emotional_abuse_severity !== 'no_trauma') {
    interpretationParts.push(`Abus émotionnel: ${getCtqSeverityLabelFr(emotional_abuse_severity)}`);
  }
  if (physical_abuse_severity !== 'no_trauma') {
    interpretationParts.push(`Abus physique: ${getCtqSeverityLabelFr(physical_abuse_severity)}`);
  }
  if (sexual_abuse_severity !== 'no_trauma') {
    interpretationParts.push(`Abus sexuel: ${getCtqSeverityLabelFr(sexual_abuse_severity)}`);
  }
  if (emotional_neglect_severity !== 'no_trauma') {
    interpretationParts.push(`Négligence émotionnelle: ${getCtqSeverityLabelFr(emotional_neglect_severity)}`);
  }
  if (physical_neglect_severity !== 'no_trauma') {
    interpretationParts.push(`Négligence physique: ${getCtqSeverityLabelFr(physical_neglect_severity)}`);
  }
  
  // Check for minimization (denial score >= 6 suggests underreporting)
  if (denial_score >= 6) {
    interpretationParts.push('Attention: Score de minimisation élevé - possible sous-déclaration des traumatismes');
  }
  
  const interpretation = interpretationParts.length > 0 
    ? interpretationParts.join('. ') 
    : 'Aucun traumatisme significatif rapporté';
  
  // Remove instruction fields before saving
  const { 
    instruction_consigne, 
    instruction_titre,
    ...responseData 
  } = response;
  
  const { data, error } = await supabase
    .from('schizophrenia_ctq')
    .upsert({
      ...responseData,
      emotional_abuse_score,
      physical_abuse_score,
      sexual_abuse_score,
      emotional_neglect_score,
      physical_neglect_score,
      emotional_abuse_severity,
      physical_abuse_severity,
      sexual_abuse_severity,
      emotional_neglect_severity,
      physical_neglect_severity,
      denial_score,
      minimization_score,
      total_score,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving schizophrenia_ctq:', error);
    throw error;
  }
  return data;
}

// ============================================================================
// MARS (Medication Adherence Rating Scale) Scoring
// ============================================================================

// Q7 and Q8 are reverse-scored (positive items): Oui=1, Non=0
const MARS_POSITIVE_ITEMS = [7, 8];

// Domain mappings
const MARS_DOMAIN_ITEMS = {
  adherence_behavior: [1, 2, 3, 4],      // Q1-Q4: Comportement d'adhésion
  attitude: [5, 6],                       // Q5-Q6: Attitude face aux médicaments
  positive_effects: [7, 8],               // Q7-Q8: Effets positifs perçus (reverse)
  negative_effects: [9, 10]               // Q9-Q10: Effets négatifs perçus
};

/**
 * Get the scored value for a MARS item
 */
function getMarsItemScore(itemNum: number, value: string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  
  if (MARS_POSITIVE_ITEMS.includes(itemNum)) {
    // Positive items: Oui = 1 point (perceives benefit)
    return value === 'Oui' ? 1 : 0;
  } else {
    // Negative items: Non = 1 point (good adherence/no negative effect)
    return value === 'Non' ? 1 : 0;
  }
}

/**
 * Interpret MARS total score
 */
function interpretMarsScore(totalScore: number): string {
  if (totalScore >= 8) {
    return 'Bonne observance thérapeutique. Comportements et attitudes favorables à la prise régulière du traitement.';
  }
  if (totalScore >= 6) {
    return 'Observance modérée. Quelques difficultés d\'adhésion identifiées. Exploration des obstacles recommandée.';
  }
  if (totalScore >= 4) {
    return 'Observance faible. Difficultés importantes d\'adhésion au traitement. Intervention ciblée nécessaire.';
  }
  return 'Très faible observance. Non-adhésion majeure au traitement. Risque élevé de rechute. Intervention urgente recommandée.';
}

/**
 * Get MARS response
 */
export async function getMarsResponse(visitId: string) {
  return getSchizophreniaInitialResponse('MARS_SZ', visitId);
}

/**
 * Save MARS response with scoring
 */
export async function saveMarsResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  
  // If questionnaire not done, just save the status
  if (response.questionnaire_done === 'Non fait') {
    const { data, error } = await supabase
      .from('schizophrenia_mars')
      .upsert({
        visit_id: response.visit_id,
        patient_id: response.patient_id,
        questionnaire_done: response.questionnaire_done,
        completed_by: user.data.user?.id
      }, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving schizophrenia_mars:', error);
      throw error;
    }
    return data;
  }
  
  // Calculate scores
  let total_score = 0;
  let adherence_subscore = 0;
  let attitude_subscore = 0;
  let positive_effects_subscore = 0;
  let negative_effects_subscore = 0;
  
  for (let i = 1; i <= 10; i++) {
    const qKey = `q${i}`;
    const value = response[qKey] as string | null | undefined;
    const itemScore = getMarsItemScore(i, value);
    
    total_score += itemScore;
    
    // Assign to appropriate subscale
    if (MARS_DOMAIN_ITEMS.adherence_behavior.includes(i)) {
      adherence_subscore += itemScore;
    } else if (MARS_DOMAIN_ITEMS.attitude.includes(i)) {
      attitude_subscore += itemScore;
    } else if (MARS_DOMAIN_ITEMS.positive_effects.includes(i)) {
      positive_effects_subscore += itemScore;
    } else if (MARS_DOMAIN_ITEMS.negative_effects.includes(i)) {
      negative_effects_subscore += itemScore;
    }
  }
  
  const interpretation = interpretMarsScore(total_score);
  
  // Remove instruction fields before saving
  const { 
    instruction_consigne,
    ...responseData 
  } = response;
  
  const { data, error } = await supabase
    .from('schizophrenia_mars')
    .upsert({
      ...responseData,
      total_score,
      adherence_subscore,
      attitude_subscore,
      positive_effects_subscore,
      negative_effects_subscore,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving schizophrenia_mars:', error);
    throw error;
  }
  return data;
}

// ============================================================================
// BIS (Birchwood Insight Scale) Scoring
// ============================================================================

// Positive items: D'accord = 2 (indicates insight)
const BIS_POSITIVE_ITEMS = [1, 4, 5, 7, 8];
// Negative items: D'accord = 0 (indicates lack of insight)
const BIS_NEGATIVE_ITEMS = [2, 3, 6];

/**
 * Get the scored value for a BIS item
 */
function getBisItemScore(itemNum: number, value: string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  
  if (BIS_POSITIVE_ITEMS.includes(itemNum)) {
    // Positive items: D'accord = good insight (2 points)
    if (value === "D'accord") return 2;
    if (value === 'Pas d\'accord') return 0;
    if (value === 'Incertain') return 1;
  } else {
    // Negative items: Pas d'accord = good insight (2 points)
    if (value === "D'accord") return 0;
    if (value === 'Pas d\'accord') return 2;
    if (value === 'Incertain') return 1;
  }
  return 0;
}

/**
 * Interpret BIS total score
 */
function interpretBisScore(totalScore: number): string {
  if (totalScore >= 10) {
    return 'Très bon insight. Le patient reconnaît ses symptômes, sa maladie et son besoin de traitement.';
  }
  if (totalScore >= 7) {
    return 'Bon insight. Le patient a une conscience satisfaisante de sa situation clinique.';
  }
  if (totalScore >= 4) {
    return 'Insight modéré. Certaines dimensions de la conscience de la maladie sont partiellement reconnues.';
  }
  return 'Pauvre insight. Difficultés importantes à reconnaître la maladie, les symptômes ou le besoin de traitement.';
}

/**
 * Get BIS response
 */
export async function getBisResponse(visitId: string) {
  return getSchizophreniaInitialResponse('BIS_SZ', visitId);
}

/**
 * Save BIS response with scoring
 */
export async function saveBisResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  
  // If questionnaire not done, just save the status
  if (response.questionnaire_done === 'Non fait') {
    const { data, error } = await supabase
      .from('schizophrenia_bis')
      .upsert({
        visit_id: response.visit_id,
        patient_id: response.patient_id,
        questionnaire_done: response.questionnaire_done,
        completed_by: user.data.user?.id
      }, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving schizophrenia_bis:', error);
      throw error;
    }
    return data;
  }
  
  // Calculate conscience_symptome (Q1 + Q8)
  const conscience_symptome_score = 
    getBisItemScore(1, response.q1) + 
    getBisItemScore(8, response.q8);
  
  // Calculate conscience_maladie (Q2 + Q7)
  const conscience_maladie_score = 
    getBisItemScore(2, response.q2) + 
    getBisItemScore(7, response.q7);
  
  // Calculate besoin_traitement ((Q3 + Q4 + Q5 + Q6) / 2)
  const besoin_traitement_raw = 
    getBisItemScore(3, response.q3) + 
    getBisItemScore(4, response.q4) + 
    getBisItemScore(5, response.q5) + 
    getBisItemScore(6, response.q6);
  const besoin_traitement_score = besoin_traitement_raw / 2;
  
  // Total score is sum of subscales
  const total_score = conscience_symptome_score + conscience_maladie_score + besoin_traitement_score;
  
  const interpretation = interpretBisScore(total_score);
  
  // Remove instruction fields before saving
  const { 
    instruction_version,
    instruction_consigne,
    ...responseData 
  } = response;
  
  const { data, error } = await supabase
    .from('schizophrenia_bis')
    .upsert({
      ...responseData,
      conscience_symptome_score,
      conscience_maladie_score,
      besoin_traitement_score,
      total_score,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving schizophrenia_bis:', error);
    throw error;
  }
  return data;
}

// ============================================================================
// EQ-5D-5L (Schizophrenia)
// ============================================================================

/**
 * Get EQ-5D-5L response
 */
export async function getEq5d5lSzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('EQ5D5L_SZ', visitId);
}

/**
 * Save EQ-5D-5L response with scoring using French value set
 */
export async function saveEq5d5lSzResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  
  // If questionnaire not done, just save the status
  if (response.questionnaire_done === 'Non fait') {
    const { data, error } = await supabase
      .from('schizophrenia_eq5d5l')
      .upsert({
        visit_id: response.visit_id,
        patient_id: response.patient_id,
        questionnaire_done: response.questionnaire_done,
        completed_by: user.data.user?.id
      }, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving schizophrenia_eq5d5l (not done):', error);
      throw error;
    }
    return data;
  }

  // Import the scoring function
  const { calculateEq5d5lScore } = await import('./questionnaire.service');

  // Remove section fields that shouldn't be saved to DB
  const {
    instruction_consigne,
    section_vas,
    ...responseData
  } = response;
  
  // Calculate scores using French value set
  const { profile, indexValue, interpretation } = calculateEq5d5lScore(
    responseData.mobility,
    responseData.self_care,
    responseData.usual_activities,
    responseData.pain_discomfort,
    responseData.anxiety_depression,
    responseData.vas_score
  );

  const { data, error } = await supabase
    .from('schizophrenia_eq5d5l')
    .upsert({
      ...responseData,
      health_state: profile,
      index_value: indexValue,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving schizophrenia_eq5d5l:', error);
    throw error;
  }
  return data;
}

// ============================================================================
// IPAQ (International Physical Activity Questionnaire)
// ============================================================================

/**
 * Get IPAQ response
 */
export async function getIpaqSzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('IPAQ_SZ', visitId);
}

/**
 * MET values for IPAQ scoring
 */
const IPAQ_MET_VALUES = {
  vigorous: 8.0,
  moderate: 4.0,
  walking: {
    vigorous: 5.0,  // Brisk walking
    moderate: 3.3,  // Default
    slow: 2.5
  }
};

/**
 * Get walking MET value based on pace
 */
function getWalkingMET(pace: string | null | undefined): number {
  if (!pace) return IPAQ_MET_VALUES.walking.moderate;
  
  if (pace === 'vigorous' || pace.includes('vive allure')) {
    return IPAQ_MET_VALUES.walking.vigorous;
  }
  if (pace === 'slow' || pace.includes('lente')) {
    return IPAQ_MET_VALUES.walking.slow;
  }
  return IPAQ_MET_VALUES.walking.moderate;
}

/**
 * Calculate minutes per day from hours and minutes
 */
function calculateMinutesPerDay(hours: number | null | undefined, minutes: number | null | undefined): number {
  return ((hours || 0) * 60) + (minutes || 0);
}

/**
 * Classify activity level according to IPAQ guidelines
 */
function classifyActivityLevel(
  vigorousDays: number,
  moderateDays: number,
  walkingDays: number,
  vigorousMinutesPerDay: number,
  moderateMinutesPerDay: number,
  walkingMinutesPerDay: number,
  vigorousMET: number,
  totalMET: number
): 'low' | 'moderate' | 'high' {
  // Calculate total days (unique days with any activity)
  const totalDays = Math.min(7, vigorousDays + moderateDays + walkingDays);
  
  // HIGH criteria
  // Criterion 1: ≥3 days vigorous activity AND ≥1500 MET-min/week from vigorous
  const highCriterion1 = vigorousDays >= 3 && vigorousMET >= 1500;
  // Criterion 2: ≥7 days of any combination AND ≥3000 total MET-min/week
  const highCriterion2 = totalDays >= 7 && totalMET >= 3000;
  
  if (highCriterion1 || highCriterion2) {
    return 'high';
  }
  
  // MODERATE criteria
  // Criterion 1: ≥3 days vigorous activity, ≥20 min/day
  const moderateCriterion1 = vigorousDays >= 3 && vigorousMinutesPerDay >= 20;
  // Criterion 2: ≥5 days moderate or walking, ≥30 min/day
  const moderateCriterion2 = (moderateDays + walkingDays) >= 5 && 
    ((moderateMinutesPerDay >= 30) || (walkingMinutesPerDay >= 30));
  // Criterion 3: ≥5 days any combination AND ≥600 MET-min/week
  const moderateCriterion3 = totalDays >= 5 && totalMET >= 600;
  
  if (moderateCriterion1 || moderateCriterion2 || moderateCriterion3) {
    return 'moderate';
  }
  
  return 'low';
}

/**
 * Generate interpretation text for IPAQ scores
 */
function interpretIpaqScore(
  totalMET: number,
  activityLevel: 'low' | 'moderate' | 'high',
  vigorousMET: number,
  moderateMET: number,
  walkingMET: number,
  sittingWeekday: number,
  sittingWeekend: number
): string {
  let interpretation = `Score total: ${Math.round(totalMET)} MET-minutes/semaine. `;
  
  // Activity level interpretation
  if (activityLevel === 'high') {
    interpretation += 'Niveau d\'activité ÉLEVÉ - Atteint les recommandations de santé publique avec marge. ';
  } else if (activityLevel === 'moderate') {
    interpretation += 'Niveau d\'activité MODÉRÉ - Atteint les recommandations minimales d\'activité physique. ';
  } else {
    interpretation += 'Niveau d\'activité FAIBLE - N\'atteint pas les recommandations minimales d\'activité physique. ';
  }
  
  // WHO guidelines comparison
  if (totalMET >= 600) {
    interpretation += 'Conforme aux recommandations OMS (≥600 MET-min/semaine). ';
  } else {
    interpretation += 'En dessous des recommandations OMS (≥600 MET-min/semaine). ';
  }
  
  // Domain breakdown
  interpretation += `Détail: Intense ${Math.round(vigorousMET)}, Modéré ${Math.round(moderateMET)}, Marche ${Math.round(walkingMET)} MET-min. `;
  
  // Sitting time
  interpretation += `Temps assis: ${Math.round(sittingWeekday)} min/jour (semaine), ${Math.round(sittingWeekend)} min/jour (week-end).`;
  
  return interpretation;
}

/**
 * Save IPAQ response with MET scoring and activity level classification
 */
export async function saveIpaqSzResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  
  // If questionnaire not done, just save the status
  if (response.questionnaire_done === 'Non fait') {
    const { data, error } = await supabase
      .from('schizophrenia_ipaq')
      .upsert({
        visit_id: response.visit_id,
        patient_id: response.patient_id,
        questionnaire_done: response.questionnaire_done,
        completed_by: user.data.user?.id
      }, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving schizophrenia_ipaq (not done):', error);
      throw error;
    }
    return data;
  }

  // Remove section and instruction fields that shouldn't be saved to DB
  const {
    instruction_consigne,
    section_vigorous,
    section_moderate,
    section_walking,
    section_sitting,
    instruction_sitting,
    ...responseData
  } = response;
  
  // Calculate MET-minutes for each domain
  const vigorousDays = responseData.vigorous_days || 0;
  const vigorousMinutesPerDay = calculateMinutesPerDay(responseData.vigorous_hours, responseData.vigorous_minutes);
  const vigorous_met_minutes = IPAQ_MET_VALUES.vigorous * vigorousDays * vigorousMinutesPerDay;
  
  const moderateDays = responseData.moderate_days || 0;
  const moderateMinutesPerDay = calculateMinutesPerDay(responseData.moderate_hours, responseData.moderate_minutes);
  const moderate_met_minutes = IPAQ_MET_VALUES.moderate * moderateDays * moderateMinutesPerDay;
  
  const walkingDays = responseData.walking_days || 0;
  const walkingMinutesPerDay = calculateMinutesPerDay(responseData.walking_hours, responseData.walking_minutes);
  const walkingMETValue = getWalkingMET(responseData.walking_pace);
  const walking_met_minutes = walkingMETValue * walkingDays * walkingMinutesPerDay;
  
  const total_met_minutes = vigorous_met_minutes + moderate_met_minutes + walking_met_minutes;
  
  // Classify activity level
  const activity_level = classifyActivityLevel(
    vigorousDays,
    moderateDays,
    walkingDays,
    vigorousMinutesPerDay,
    moderateMinutesPerDay,
    walkingMinutesPerDay,
    vigorous_met_minutes,
    total_met_minutes
  );
  
  // Calculate sitting time totals
  const sitting_weekday_total = calculateMinutesPerDay(
    responseData.sitting_weekday_hours, 
    responseData.sitting_weekday_minutes
  );
  const sitting_weekend_total = calculateMinutesPerDay(
    responseData.sitting_weekend_hours, 
    responseData.sitting_weekend_minutes
  );
  
  // Generate interpretation
  const interpretation = interpretIpaqScore(
    total_met_minutes,
    activity_level,
    vigorous_met_minutes,
    moderate_met_minutes,
    walking_met_minutes,
    sitting_weekday_total,
    sitting_weekend_total
  );

  const { data, error } = await supabase
    .from('schizophrenia_ipaq')
    .upsert({
      ...responseData,
      vigorous_met_minutes,
      moderate_met_minutes,
      walking_met_minutes,
      total_met_minutes,
      activity_level,
      sitting_weekday_total,
      sitting_weekend_total,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving schizophrenia_ipaq:', error);
    throw error;
  }
  return data;
}

// ============================================================================
// Y-BOCS (Yale-Brown Obsessive-Compulsive Scale) Scoring
// ============================================================================

/**
 * Interpret Y-BOCS total score
 */
function interpretYbocsScore(totalScore: number): string {
  if (totalScore <= 7) {
    return 'Symptômes sous-cliniques. Les obsessions et/ou compulsions sont minimes ou absentes. Aucune interférence significative avec le fonctionnement quotidien.';
  }
  if (totalScore <= 15) {
    return 'TOC léger. Présence de symptômes obsessionnels-compulsifs occasionnant une gêne légère. Le fonctionnement quotidien reste globalement préservé.';
  }
  if (totalScore <= 23) {
    return 'TOC modéré. Symptômes obsessionnels-compulsifs significatifs avec impact notable sur le fonctionnement social et/ou professionnel. Un traitement est généralement indiqué.';
  }
  if (totalScore <= 31) {
    return 'TOC sévère. Symptômes envahissants causant une altération importante du fonctionnement. Détresse marquée. Prise en charge spécialisée fortement recommandée.';
  }
  return 'TOC extrême. Symptômes très sévères et invalidants. Altération majeure du fonctionnement dans tous les domaines. Prise en charge intensive urgente requise.';
}

/**
 * Get Y-BOCS response
 */
export async function getYbocsResponse(visitId: string) {
  return getSchizophreniaInitialResponse('YBOCS_SZ', visitId);
}

/**
 * Save Y-BOCS response with scoring
 * - Obsessions subscale: Q1-Q5 (0-20)
 * - Compulsions subscale: Q6-Q10 (0-20)
 * - Total score: 0-40
 */
export async function saveYbocsResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  
  // If questionnaire not done, just save the status
  if (response.questionnaire_done === 'Non fait') {
    const { data, error } = await supabase
      .from('schizophrenia_ybocs')
      .upsert({
        visit_id: response.visit_id,
        patient_id: response.patient_id,
        questionnaire_done: response.questionnaire_done,
        completed_by: user.data.user?.id
      }, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving schizophrenia_ybocs (not done):', error);
      throw error;
    }
    return data;
  }
  
  // Calculate subscale scores
  let obsessions_score = 0;
  let compulsions_score = 0;
  
  // Obsessions subscale: Q1-Q5
  for (let i = 1; i <= 5; i++) {
    const qKey = `q${i}`;
    const value = response[qKey];
    if (typeof value === 'number' && !isNaN(value)) {
      obsessions_score += value;
    }
  }
  
  // Compulsions subscale: Q6-Q10
  for (let i = 6; i <= 10; i++) {
    const qKey = `q${i}`;
    const value = response[qKey];
    if (typeof value === 'number' && !isNaN(value)) {
      compulsions_score += value;
    }
  }
  
  const total_score = obsessions_score + compulsions_score;
  const interpretation = interpretYbocsScore(total_score);
  
  // Remove section and instruction fields before saving
  const { 
    instruction_consigne,
    section_obsessions,
    section_compulsions,
    section_score_auto,
    ...responseData 
  } = response;
  
  const { data, error } = await supabase
    .from('schizophrenia_ybocs')
    .upsert({
      ...responseData,
      obsessions_score,
      compulsions_score,
      total_score,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving schizophrenia_ybocs:', error);
    throw error;
  }
  return data;
}

// ============================================================================
// WURS-25 (Wender Utah Rating Scale) Functions
// ============================================================================

const WURS25_CLINICAL_CUTOFF = 46;

/**
 * Interpret WURS-25 score (schizophrenia version with cutoff 46)
 */
function interpretWurs25SzScore(totalScore: number): string {
  if (totalScore >= WURS25_CLINICAL_CUTOFF) {
    return `Score ≥${WURS25_CLINICAL_CUTOFF} : Ce résultat suggère fortement la présence de symptômes de TDAH durant l'enfance. ` +
      'Le seuil de 46 possède une sensibilité et une spécificité de 96% pour le diagnostic rétrospectif du TDAH de l\'enfance. ' +
      'Une évaluation complémentaire est recommandée (ASRS pour symptômes actuels, entretien clinique).';
  }
  return `Score <${WURS25_CLINICAL_CUTOFF} : Ce résultat ne suggère pas la présence de symptômes significatifs de TDAH durant l'enfance. ` +
    'Cependant, ce questionnaire est un outil de dépistage rétrospectif et ne constitue pas un diagnostic définitif.';
}

/**
 * Get WURS-25 response
 */
export async function getWurs25SzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('WURS25_SZ', visitId);
}

/**
 * Save WURS-25 response with scoring
 * - Total score: sum of q1-q25 (0-100)
 * - ADHD likely: total_score >= 46
 */
export async function saveWurs25SzResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  
  // If questionnaire not done, just save the status
  if (response.questionnaire_done === 'Non fait') {
    const { data, error } = await supabase
      .from('schizophrenia_wurs25')
      .upsert({
        visit_id: response.visit_id,
        patient_id: response.patient_id,
        questionnaire_done: response.questionnaire_done,
        completed_by: user.data.user?.id
      }, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving schizophrenia_wurs25 (not done):', error);
      throw error;
    }
    return data;
  }
  
  // Calculate total score (sum of q1-q25)
  let total_score = 0;
  for (let i = 1; i <= 25; i++) {
    const qKey = `q${i}`;
    const value = response[qKey];
    if (typeof value === 'number' && !isNaN(value)) {
      total_score += value;
    }
  }
  
  const adhd_likely = total_score >= WURS25_CLINICAL_CUTOFF;
  const interpretation = interpretWurs25SzScore(total_score);
  
  // Remove instruction field before saving
  const { 
    instruction_consigne,
    ...responseData 
  } = response;
  
  const { data, error } = await supabase
    .from('schizophrenia_wurs25')
    .upsert({
      ...responseData,
      total_score,
      adhd_likely,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving schizophrenia_wurs25:', error);
    throw error;
  }
  return data;
}

// ============================================================================
// STORI (Stages of Recovery Instrument) Functions
// ============================================================================

// Stage definitions for STORI
const STORI_STAGES_INFO = {
  1: { label: 'Moratoire', description: 'Période de repli caractérisée par un sentiment de perte, de confusion et d\'impuissance.' },
  2: { label: 'Conscience', description: 'Première lueur d\'espoir que le rétablissement est possible.' },
  3: { label: 'Préparation', description: 'La personne commence à travailler sur ses compétences de rétablissement.' },
  4: { label: 'Reconstruction', description: 'Travail actif vers un style de vie positif.' },
  5: { label: 'Croissance', description: 'Vie pleinement satisfaisante avec un sens de soi positif.' },
} as const;

/**
 * Get STORI response
 */
export async function getStoriSzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('STORI_SZ', visitId);
}

/**
 * Calculate stage score (sum of 10 items for a given stage)
 * Pattern: Item n maps to Stage (n % 5), where n%5=0 maps to Stage 5
 */
function calculateStoriStageScore(responses: Record<string, any>, stage: number): number {
  let score = 0;
  for (let i = 1; i <= 50; i++) {
    const itemStage = i % 5 === 0 ? 5 : i % 5;
    if (itemStage === stage) {
      const value = responses[`q${i}`];
      if (typeof value === 'number' && !isNaN(value)) {
        score += value;
      }
    }
  }
  return score;
}

/**
 * Save STORI response with 5-stage scoring
 * - 5 stage scores (0-50 each)
 * - Dominant stage (highest score)
 */
export async function saveStoriSzResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  
  // If questionnaire not done, just save the status
  if (response.questionnaire_done === 'Non fait') {
    const { data, error } = await supabase
      .from('schizophrenia_stori')
      .upsert({
        visit_id: response.visit_id,
        patient_id: response.patient_id,
        questionnaire_done: response.questionnaire_done,
        completed_by: user.data.user?.id
      }, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving schizophrenia_stori (not done):', error);
      throw error;
    }
    return data;
  }
  
  // Calculate 5 stage scores
  const stori_etap1 = calculateStoriStageScore(response, 1); // Moratoire
  const stori_etap2 = calculateStoriStageScore(response, 2); // Conscience
  const stori_etap3 = calculateStoriStageScore(response, 3); // Préparation
  const stori_etap4 = calculateStoriStageScore(response, 4); // Reconstruction
  const stori_etap5 = calculateStoriStageScore(response, 5); // Croissance
  
  // Determine dominant stage (highest score)
  // Note: When scores are equal, select the MORE ADVANCED stage (higher stage number)
  // as per Andresen et al. STORI scoring guidelines
  const stageScores = [
    { stage: 1, score: stori_etap1 },
    { stage: 2, score: stori_etap2 },
    { stage: 3, score: stori_etap3 },
    { stage: 4, score: stori_etap4 },
    { stage: 5, score: stori_etap5 },
  ];
  
  let maxScore = -1;
  let dominant_stage = 1;
  for (const { stage, score } of stageScores) {
    // Use >= to select the more advanced stage when scores are equal
    if (score > maxScore || (score === maxScore && stage > dominant_stage)) {
      maxScore = score;
      dominant_stage = stage;
    }
  }
  
  // Generate interpretation
  const stageInfo = STORI_STAGES_INFO[dominant_stage as keyof typeof STORI_STAGES_INFO];
  let interpretation = `Stade dominant : ${stageInfo.label} (Étape ${dominant_stage}/5)\n\n`;
  interpretation += `${stageInfo.description}\n\n`;
  
  // Check for ties and note them (dominant_stage is already the most advanced)
  const sortedScores = [...stageScores].sort((a, b) => b.score - a.score);
  const topScore = sortedScores[0].score;
  const tiedStages = sortedScores.filter(s => s.score === topScore);
  
  if (tiedStages.length > 1 && topScore > 0) {
    const tiedLabels = tiedStages.map(s => 
      STORI_STAGES_INFO[s.stage as keyof typeof STORI_STAGES_INFO].label
    ).join(', ');
    interpretation += `Note : Scores égaux entre les stades ${tiedLabels}. Le stade le plus avancé (${stageInfo.label}) a été sélectionné selon les directives de cotation STORI.`;
  }
  
  // Remove UI-only fields and computed fields before saving
  // (total_score may be passed by the form but STORI uses 5 stage scores instead)
  const { 
    instruction_consigne,
    section_group1, section_group2, section_group3, section_group4, section_group5,
    section_group6, section_group7, section_group8, section_group9, section_group10,
    total_score, // Exclude - STORI uses 5 stage scores, not a single total
    ...responseData 
  } = response;
  
  const { data, error } = await supabase
    .from('schizophrenia_stori')
    .upsert({
      ...responseData,
      stori_etap1,
      stori_etap2,
      stori_etap3,
      stori_etap4,
      stori_etap5,
      dominant_stage,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving schizophrenia_stori:', error);
    throw error;
  }
  return data;
}

// ============================================================================
// SOGS (South Oaks Gambling Screen) Functions
// ============================================================================

// Clinical thresholds
const SOGS_THRESHOLDS = {
  NO_PROBLEM: { min: 0, max: 2, label: 'Pas de problème de jeu', severity: 'no_problem' },
  AT_RISK: { min: 3, max: 4, label: 'Joueur à risque', severity: 'at_risk' },
  PATHOLOGICAL: { min: 5, max: 20, label: 'Joueur pathologique probable', severity: 'pathological' },
};

/**
 * Score Q4: Any response except "Jamais" = 1 point
 */
function scoreSogsQ4(value: string | null | undefined): number {
  if (!value || value === 'Jamais') return 0;
  return 1;
}

/**
 * Score Q5, Q6: First option = 0, others = 1
 */
function scoreSogsQ5Q6(value: string | null | undefined, firstOption: string): number {
  if (!value) return 0;
  return value === firstOption ? 0 : 1;
}

/**
 * Score Yes/No questions: Oui = 1, Non = 0
 */
function scoreSogsYesNo(value: string | null | undefined): number {
  return value === 'Oui' ? 1 : 0;
}

/**
 * Get SOGS response
 */
export async function getSogsSzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('SOGS_SZ', visitId);
}

/**
 * Save SOGS response with complex scoring (3 functions)
 * - Total score: 0-20 (11 base + 9 conditional)
 * - Interpretation based on thresholds
 */
export async function saveSogsSzResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  
  // If questionnaire not done, just save the status
  if (response.questionnaire_done === 'Non fait') {
    const { data, error } = await supabase
      .from('schizophrenia_sogs')
      .upsert({
        visit_id: response.visit_id,
        patient_id: response.patient_id,
        questionnaire_done: response.questionnaire_done,
        completed_by: user.data.user?.id
      }, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving schizophrenia_sogs (not done):', error);
      throw error;
    }
    return data;
  }
  
  // Calculate total score using 3 different scoring functions
  let total_score = 0;
  
  // Q4: Any non-"Jamais" response = 1
  total_score += scoreSogsQ4(response.rad_sogs4);
  
  // Q5: First option "Jamais (ou je n'ai jamais joué)" = 0, others = 1
  total_score += scoreSogsQ5Q6(response.rad_sogs5, "Jamais (ou je n'ai jamais joué)");
  
  // Q6: First option "Non" = 0, others = 1
  total_score += scoreSogsQ5Q6(response.rad_sogs6, 'Non');
  
  // Q7-Q11: Yes/No scoring
  total_score += scoreSogsYesNo(response.rad_sogs7);
  total_score += scoreSogsYesNo(response.rad_sogs8);
  total_score += scoreSogsYesNo(response.rad_sogs9);
  total_score += scoreSogsYesNo(response.rad_sogs10);
  total_score += scoreSogsYesNo(response.rad_sogs11);
  
  // Q12 is NOT scored (filter question)
  
  // Q13-Q15: Yes/No scoring
  total_score += scoreSogsYesNo(response.rad_sogs13);
  total_score += scoreSogsYesNo(response.rad_sogs14);
  total_score += scoreSogsYesNo(response.rad_sogs15);
  
  // Q16 sub-items: Only scored if Q16 = "Oui"
  if (response.rad_sogs16 === 'Oui') {
    total_score += scoreSogsYesNo(response.rad_sogs16a);
    total_score += scoreSogsYesNo(response.rad_sogs16b);
    total_score += scoreSogsYesNo(response.rad_sogs16c);
    total_score += scoreSogsYesNo(response.rad_sogs16d);
    total_score += scoreSogsYesNo(response.rad_sogs16e);
    total_score += scoreSogsYesNo(response.rad_sogs16f);
    total_score += scoreSogsYesNo(response.rad_sogs16g);
    total_score += scoreSogsYesNo(response.rad_sogs16h);
    total_score += scoreSogsYesNo(response.rad_sogs16i);
    // Q16j and Q16k are NOT scored
  }
  
  // Determine severity
  let gambling_severity: string;
  let severityLabel: string;
  
  if (total_score <= SOGS_THRESHOLDS.NO_PROBLEM.max) {
    gambling_severity = SOGS_THRESHOLDS.NO_PROBLEM.severity;
    severityLabel = SOGS_THRESHOLDS.NO_PROBLEM.label;
  } else if (total_score <= SOGS_THRESHOLDS.AT_RISK.max) {
    gambling_severity = SOGS_THRESHOLDS.AT_RISK.severity;
    severityLabel = SOGS_THRESHOLDS.AT_RISK.label;
  } else {
    gambling_severity = SOGS_THRESHOLDS.PATHOLOGICAL.severity;
    severityLabel = SOGS_THRESHOLDS.PATHOLOGICAL.label;
  }
  
  // Generate interpretation
  let interpretation = `Score SOGS : ${total_score}/20\n`;
  interpretation += `Classification : ${severityLabel}\n\n`;
  
  if (total_score <= 2) {
    interpretation += 'Le score ne suggère pas de problème de jeu significatif. ';
    interpretation += 'Cependant, une vigilance peut être maintenue si des facteurs de risque sont présents.';
  } else if (total_score <= 4) {
    interpretation += 'Le score suggère un comportement de jeu à risque. ';
    interpretation += 'Une évaluation plus approfondie est recommandée pour déterminer si une intervention préventive est nécessaire.';
  } else {
    interpretation += 'Le score suggère un jeu pathologique probable (≥5 points). ';
    interpretation += 'Une évaluation clinique complète et une prise en charge spécialisée en addictologie sont recommandées. ';
    interpretation += 'Le SOGS est un outil de dépistage ; un diagnostic formel nécessite un entretien clinique.';
  }
  
  // Remove section and instruction fields before saving
  const { 
    section_types_jeux,
    section_montant,
    section_antecedents,
    section_items_scores,
    section_emprunts,
    instruction_q16_sources,
    ...responseData 
  } = response;
  
  const { data, error } = await supabase
    .from('schizophrenia_sogs')
    .upsert({
      ...responseData,
      total_score,
      gambling_severity,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving schizophrenia_sogs:', error);
    throw error;
  }
  return data;
}

// ============================================================================
// PSQI (Pittsburgh Sleep Quality Index)
// ============================================================================

/**
 * Get PSQI response
 */
export async function getPsqiSzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('PSQI_SZ', visitId);
}

/**
 * Parse HH:MM time string to decimal hours
 */
function parseHoursMinutes(timeStr: string | null | undefined): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) + (minutes || 0) / 60;
}

/**
 * Calculate time difference between two HH:MM times (accounting for overnight)
 */
function calculateTimeDifferencePsqi(start: string, end: string): number {
  const startHours = parseHoursMinutes(start);
  const endHours = parseHoursMinutes(end);
  
  let diff = endHours - startHours;
  if (diff < 0) diff += 24; // Overnight adjustment
  
  return diff;
}

/**
 * Generate clinical interpretation based on PSQI total score
 * Score >5 indicates poor sleep quality (~90% sensitivity/specificity)
 */
function interpretPsqiScore(totalScore: number): string {
  if (totalScore <= 5) {
    return `Score PSQI : ${totalScore}/21 - Bonne qualité de sommeil\n\n` +
      'Interprétation : Sommeil de qualité satisfaisante sans plainte cliniquement significative. ' +
      'Les habitudes de sommeil sont adaptées et le retentissement diurne est absent ou minime.\n\n' +
      'Seuil clinique : Un score ≤5 indique une bonne qualité de sommeil (sensibilité ~90%, spécificité ~86%).';
  }
  
  if (totalScore <= 10) {
    return `Score PSQI : ${totalScore}/21 - Qualité de sommeil altérée\n\n` +
      'Interprétation : Difficultés de sommeil modérées. Présence de plaintes subjectives avec ' +
      'retentissement possible sur le fonctionnement quotidien.\n\n' +
      'Recommandations : Évaluation des facteurs contributifs recommandée (anxiété, hygiène du sommeil, ' +
      'traitements médicamenteux, consommation de substances).\n\n' +
      'Seuil clinique : Score >5 suggère une mauvaise qualité de sommeil.';
  }
  
  if (totalScore <= 15) {
    return `Score PSQI : ${totalScore}/21 - Mauvaise qualité de sommeil\n\n` +
      'Interprétation : Troubles du sommeil marqués avec impact significatif sur la qualité de vie. ' +
      'Plusieurs composantes du sommeil sont perturbées.\n\n' +
      'Recommandations : Intervention thérapeutique recommandée :\n' +
      '• TCC-I (thérapie cognitivo-comportementale de l\'insomnie)\n' +
      '• Révision des traitements psychotropes\n' +
      '• Bilan des comorbidités somatiques et psychiatriques\n' +
      '• Évaluation des facteurs de maintien (hygiène du sommeil, anxiété anticipatoire)';
  }
  
  return `Score PSQI : ${totalScore}/21 - Très mauvaise qualité de sommeil\n\n` +
    'Interprétation : Insomnie sévère avec retentissement majeur. Dysfonctionnement important ' +
    'sur le plan diurne (somnolence, difficultés de concentration, troubles de l\'humeur).\n\n' +
    'Recommandations :\n' +
    '• Prise en charge multidisciplinaire nécessaire\n' +
    '• Rechercher un trouble du sommeil primaire (apnée du sommeil, syndrome des jambes sans repos)\n' +
    '• Évaluer l\'impact des symptômes psychiatriques sur le sommeil\n' +
    '• Orientation vers une consultation spécialisée du sommeil si besoin\n' +
    '• Envisager une polysomnographie si suspicion de trouble respiratoire du sommeil';
}

/**
 * Save PSQI response with all 7 component scores and global scoring
 * 
 * Component scoring (0-3 each):
 * - C1: Subjective quality (Q6 direct)
 * - C2: Latency (Q2 minutes + Q5a mapped)
 * - C3: Duration (Q4 hours mapped: ≥7h=0, 6-7h=1, 5-6h=2, <5h=3)
 * - C4: Efficiency ((Sleep hours / Time in bed) × 100: ≥85%=0, 75-84%=1, 65-74%=2, <65%=3)
 * - C5: Disturbances (Sum Q5b-Q5j: 0=0, 1-9=1, 10-18=2, 19-27=3)
 * - C6: Medication (Q7 direct)
 * - C7: Daytime dysfunction (Sum Q8+Q9: 0=0, 1-2=1, 3-4=2, 5-6=3)
 * 
 * Global score: 0-21 (sum of components)
 * Clinical cutoff: >5 indicates poor sleep quality (~90% sensitivity)
 */
export async function savePsqiSzResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  
  // If questionnaire not done, just save the status
  if (response.questionnaire_done === 'Non fait') {
    const { data, error } = await supabase
      .from('schizophrenia_psqi')
      .upsert({
        visit_id: response.visit_id,
        patient_id: response.patient_id,
        questionnaire_done: response.questionnaire_done,
        completed_by: user.data.user?.id
      }, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving schizophrenia_psqi (not done):', error);
      throw error;
    }
    return data;
  }
  
  // Component 1: Subjective sleep quality (Q6)
  const c1 = response.q6 ?? 0;
  
  // Component 2: Sleep latency (Q2 + Q5a)
  const q2Minutes = response.q2_minutes_to_sleep ?? 0;
  let q2Score = 0;
  if (q2Minutes <= 15) q2Score = 0;
  else if (q2Minutes <= 30) q2Score = 1;
  else if (q2Minutes <= 60) q2Score = 2;
  else q2Score = 3;
  
  const q5a = response.q5a ?? 0;
  const latencySum = q2Score + q5a;
  let c2 = 0;
  if (latencySum === 0) c2 = 0;
  else if (latencySum <= 2) c2 = 1;
  else if (latencySum <= 4) c2 = 2;
  else c2 = 3;
  
  // Component 3: Sleep duration (Q4)
  const sleepHours = parseHoursMinutes(response.q4_hours_sleep);
  let c3 = 0;
  if (sleepHours >= 7) c3 = 0;
  else if (sleepHours >= 6) c3 = 1;
  else if (sleepHours >= 5) c3 = 2;
  else c3 = 3;
  
  // Component 4: Habitual sleep efficiency
  const bedtime = response.q1_bedtime;
  const waketime = response.q3_waketime;
  const timeInBed = bedtime && waketime ? calculateTimeDifferencePsqi(bedtime, waketime) : 8;
  const efficiency = timeInBed > 0 ? (sleepHours / timeInBed) * 100 : 0;
  
  let c4 = 0;
  if (efficiency >= 85) c4 = 0;
  else if (efficiency >= 75) c4 = 1;
  else if (efficiency >= 65) c4 = 2;
  else c4 = 3;
  
  // Component 5: Sleep disturbances (Q5b-Q5j sum)
  const disturbanceSum = 
    (response.q5b ?? 0) + (response.q5c ?? 0) + (response.q5d ?? 0) +
    (response.q5e ?? 0) + (response.q5f ?? 0) + (response.q5g ?? 0) +
    (response.q5h ?? 0) + (response.q5i ?? 0) + (response.q5j ?? 0);
  
  let c5 = 0;
  if (disturbanceSum === 0) c5 = 0;
  else if (disturbanceSum <= 9) c5 = 1;
  else if (disturbanceSum <= 18) c5 = 2;
  else c5 = 3;
  
  // Component 6: Use of sleep medication (Q7)
  const c6 = response.q7 ?? 0;
  
  // Component 7: Daytime dysfunction (Q8 + Q9)
  const daySum = (response.q8 ?? 0) + (response.q9 ?? 0);
  let c7 = 0;
  if (daySum === 0) c7 = 0;
  else if (daySum <= 2) c7 = 1;
  else if (daySum <= 4) c7 = 2;
  else c7 = 3;
  
  // Total score (0-21)
  const total_score = c1 + c2 + c3 + c4 + c5 + c6 + c7;
  const interpretation = interpretPsqiScore(total_score);
  
  // Remove section and instruction fields before saving
  const { 
    instructions,
    section_q5,
    section_quality,
    section_bed_partner,
    instruction_q10_details,
    ...responseData 
  } = response;
  
  const { data, error } = await supabase
    .from('schizophrenia_psqi')
    .upsert({
      ...responseData,
      c1_subjective_quality: c1,
      c2_latency: c2,
      c3_duration: c3,
      c4_efficiency: c4,
      c5_disturbances: c5,
      c6_medication: c6,
      c7_daytime_dysfunction: c7,
      time_in_bed_hours: parseFloat(timeInBed.toFixed(2)),
      sleep_efficiency_pct: parseFloat(efficiency.toFixed(2)),
      total_score,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving schizophrenia_psqi:', error);
    throw error;
  }
  return data;
}

// ============================================================================
// WHO-HPQ Présentéisme Functions
// ============================================================================

/**
 * Get Présentéisme response
 */
export async function getPresenteismeSzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('PRESENTEISME_SZ', visitId);
}

/**
 * Interpret WHO-HPQ scores for absenteeism and presenteeism
 */
function interpretPresenteismeScore(
  absenteismeAbsolu: number,
  absenteismeRelatif: number,
  performanceRelative: number,
  pertePerformance: number,
  productivitePct: number
): string {
  const sections: string[] = [];
  
  // Absenteeism interpretation
  sections.push('=== ABSENTÉISME ===');
  if (absenteismeAbsolu === 0) {
    sections.push(`Absentéisme absolu: ${absenteismeAbsolu} jour(s) - Aucune absence pour raison de santé.`);
  } else if (absenteismeAbsolu <= 2) {
    sections.push(`Absentéisme absolu: ${absenteismeAbsolu} jour(s) - Absentéisme faible.`);
  } else if (absenteismeAbsolu <= 5) {
    sections.push(`Absentéisme absolu: ${absenteismeAbsolu} jour(s) - Absentéisme modéré.`);
  } else {
    sections.push(`Absentéisme absolu: ${absenteismeAbsolu} jour(s) - Absentéisme élevé.`);
  }
  
  if (absenteismeRelatif <= 0) {
    sections.push(`Absentéisme relatif: ${absenteismeRelatif.toFixed(1)}% - Heures conformes ou supérieures aux attentes.`);
  } else if (absenteismeRelatif <= 10) {
    sections.push(`Absentéisme relatif: ${absenteismeRelatif.toFixed(1)}% - Légère réduction des heures.`);
  } else if (absenteismeRelatif <= 25) {
    sections.push(`Absentéisme relatif: ${absenteismeRelatif.toFixed(1)}% - Réduction modérée des heures.`);
  } else {
    sections.push(`Absentéisme relatif: ${absenteismeRelatif.toFixed(1)}% - Réduction importante des heures.`);
  }
  
  // Performance interpretation
  sections.push('\n=== PRÉSENTÉISME ===');
  
  if (performanceRelative > 0) {
    sections.push(`Performance relative: +${performanceRelative} vs collègues - Supérieure aux collègues.`);
  } else if (performanceRelative === 0) {
    sections.push(`Performance relative: ${performanceRelative} vs collègues - Similaire aux collègues.`);
  } else {
    sections.push(`Performance relative: ${performanceRelative} vs collègues - Inférieure aux collègues.`);
  }
  
  if (pertePerformance > 0) {
    sections.push(`Perte de performance: ${pertePerformance} point(s) - Déclin récent (présentéisme).`);
  } else if (pertePerformance === 0) {
    sections.push(`Perte de performance: ${pertePerformance} point(s) - Performance stable.`);
  } else {
    sections.push(`Perte de performance: ${pertePerformance} point(s) - Amélioration récente.`);
  }
  
  // Productivity
  sections.push(`\nProductivité globale: ${productivitePct.toFixed(0)}%`);
  if (productivitePct >= 80) {
    sections.push('Niveau satisfaisant.');
  } else if (productivitePct >= 60) {
    sections.push('Niveau modérément réduit.');
  } else if (productivitePct >= 40) {
    sections.push('Niveau significativement réduit.');
  } else {
    sections.push('Niveau très réduit. Intervention recommandée.');
  }
  
  // Summary
  sections.push('\n=== SYNTHÈSE ===');
  const hasAbsenteeism = absenteismeAbsolu > 2 || absenteismeRelatif > 10;
  const hasPresenteeism = pertePerformance > 1 || productivitePct < 60;
  
  if (!hasAbsenteeism && !hasPresenteeism) {
    sections.push('Fonctionnement professionnel préservé.');
  } else if (hasAbsenteeism && hasPresenteeism) {
    sections.push('Impact significatif : absentéisme ET présentéisme présents.');
  } else if (hasAbsenteeism) {
    sections.push('Absentéisme notable sans présentéisme majeur.');
  } else {
    sections.push('Présentéisme notable : performance réduite malgré présence au travail.');
  }
  
  return sections.join('\n');
}

/**
 * Save WHO-HPQ Présentéisme response with computed scores
 * 
 * Computed measures:
 * - Absentéisme absolu: B5a + B5c (days missed for health)
 * - Absentéisme relatif: ((B4 × 4) - B6) / (B4 × 4) × 100
 * - Performance relative: B11 - B9 (vs colleagues)
 * - Perte de performance: B10 - B11 (presenteeism indicator)
 * - Productivité %: (B11/10) × 100
 */
export async function savePresenteismeSzResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  
  // If questionnaire not done, just save the status
  if (response.questionnaire_done === 'Non fait') {
    const { data, error } = await supabase
      .from('schizophrenia_presenteisme')
      .upsert({
        visit_id: response.visit_id,
        patient_id: response.patient_id,
        questionnaire_done: response.questionnaire_done,
        completed_by: user.data.user?.id
      }, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving schizophrenia_presenteisme (not done):', error);
      throw error;
    }
    return data;
  }
  
  // Calculate derived measures
  
  // Absentéisme absolu: B5a + B5c (total days missed for health)
  const b5a = response.abs_b5a ?? 0;
  const b5c = response.abs_b5c ?? 0;
  const absenteisme_absolu = b5a + b5c;
  
  // Absentéisme relatif: ((B4 × 4) - B6) / (B4 × 4) × 100
  const b4 = response.abs_b4 ?? 0;
  const b6 = response.abs_b6 ?? 0;
  const expectedHours = b4 * 4; // Expected hours over 4 weeks
  let absenteisme_relatif_pct = 0;
  if (expectedHours > 0) {
    absenteisme_relatif_pct = ((expectedHours - b6) / expectedHours) * 100;
    // Clamp to reasonable range
    absenteisme_relatif_pct = Math.max(-100, Math.min(100, absenteisme_relatif_pct));
    absenteisme_relatif_pct = Math.round(absenteisme_relatif_pct * 100) / 100;
  }
  
  // Performance scores
  const b9 = response.rad_abs_b9 ?? 0;   // Colleague reference
  const b10 = response.rad_abs_b10 ?? 0; // Historical self
  const b11 = response.rad_abs_b11 ?? 0; // Recent self
  
  // Performance relative: B11 - B9 (vs colleagues)
  const performance_relative = b11 - b9;
  
  // Perte de performance: B10 - B11 (presenteeism indicator)
  const perte_performance = b10 - b11;
  
  // Productivité %: (B11/10) × 100
  const productivite_pct = (b11 / 10) * 100;
  
  // Generate interpretation
  const interpretation = interpretPresenteismeScore(
    absenteisme_absolu,
    absenteisme_relatif_pct,
    performance_relative,
    perte_performance,
    productivite_pct
  );
  
  // Remove section and instruction fields before saving
  const { 
    titre_abs,
    section_heures,
    titre_b5,
    section_performance,
    ...responseData 
  } = response;
  
  const { data, error } = await supabase
    .from('schizophrenia_presenteisme')
    .upsert({
      ...responseData,
      absenteisme_absolu,
      absenteisme_relatif_pct,
      performance_relative,
      perte_performance,
      productivite_pct,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving schizophrenia_presenteisme:', error);
    throw error;
  }
  return data;
}

// ============================================================================
// FAGERSTROM_SZ - Fagerström Test for Nicotine Dependence
// ============================================================================

/**
 * Get Fagerstrom response for a visit
 */
export async function getFagerstromSzResponse(visitId: string): Promise<any | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('schizophrenia_fagerstrom')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching schizophrenia_fagerstrom:', error);
    throw error;
  }

  return data || null;
}

/**
 * Save Fagerstrom response with computed scores
 * - Total score: Q1 + Q2 + Q3 + Q4 + Q5 + Q6 (0-10)
 * - HSI score: Q1 + Q4 (Heaviness of Smoking Index, 0-6)
 * - Dependence level: Based on total score thresholds
 * - Treatment guidance: Specific recommendations per level
 */
export async function saveFagerstromSzResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  
  // If questionnaire not done, just save the status
  if (response.questionnaire_done === 'Non fait') {
    const { data, error } = await supabase
      .from('schizophrenia_fagerstrom')
      .upsert({
        visit_id: response.visit_id,
        patient_id: response.patient_id,
        questionnaire_done: response.questionnaire_done,
        completed_by: user.data.user?.id
      }, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving schizophrenia_fagerstrom (not done):', error);
      throw error;
    }
    return data;
  }
  
  // Calculate scores
  const q1 = typeof response.q1 === 'number' ? response.q1 : 0;
  const q2 = typeof response.q2 === 'number' ? response.q2 : 0;
  const q3 = typeof response.q3 === 'number' ? response.q3 : 0;
  const q4 = typeof response.q4 === 'number' ? response.q4 : 0;
  const q5 = typeof response.q5 === 'number' ? response.q5 : 0;
  const q6 = typeof response.q6 === 'number' ? response.q6 : 0;

  // Total score (0-10)
  const total_score = q1 + q2 + q3 + q4 + q5 + q6;

  // HSI - Heaviness of Smoking Index (0-6)
  // Most predictive items: Q1 (time to first cigarette) + Q4 (cigarettes per day)
  const hsi_score = q1 + q4;

  // Get dependence level and treatment based on score
  let dependence_level: string;
  let treatment_guidance: string;
  
  if (total_score <= 2) {
    dependence_level = 'aucune_tres_faible';
    treatment_guidance = 'Thérapie comportementale';
  } else if (total_score <= 4) {
    dependence_level = 'faible';
    treatment_guidance = 'Substituts nicotiniques standard';
  } else if (total_score === 5) {
    dependence_level = 'moyenne';
    treatment_guidance = 'Substituts forte dose/combinés';
  } else {
    dependence_level = 'forte';
    treatment_guidance = 'Thérapie combinée (substituts + médicaments)';
  }

  // Generate interpretation
  const interpretation = generateFagerstromInterpretation(
    total_score,
    hsi_score,
    dependence_level,
    treatment_guidance,
    { q1, q2, q3, q4, q5, q6 }
  );
  
  const { data, error } = await supabase
    .from('schizophrenia_fagerstrom')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      questionnaire_done: response.questionnaire_done,
      q1: response.q1,
      q2: response.q2,
      q3: response.q3,
      q4: response.q4,
      q5: response.q5,
      q6: response.q6,
      total_score,
      hsi_score,
      dependence_level,
      treatment_guidance,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving schizophrenia_fagerstrom:', error);
    throw error;
  }
  return data;
}

/**
 * Generate interpretation text for Fagerstrom
 */
function generateFagerstromInterpretation(
  totalScore: number,
  hsiScore: number,
  dependenceLevel: string,
  treatmentGuidance: string,
  responses: { q1: number; q2: number; q3: number; q4: number; q5: number; q6: number }
): string {
  // Get level label
  const levelLabels: Record<string, string> = {
    'aucune_tres_faible': 'Pas de dépendance ou dépendance très faible',
    'faible': 'Dépendance faible',
    'moyenne': 'Dépendance moyenne',
    'forte': 'Dépendance forte'
  };
  const levelLabel = levelLabels[dependenceLevel] || dependenceLevel;

  let interpretation = `Score FTND: ${totalScore}/10. ${levelLabel}.`;
  interpretation += ` Score HSI (indice de sévérité): ${hsiScore}/6.`;
  interpretation += ` Traitement suggéré: ${treatmentGuidance}.`;

  // Add specific item interpretations
  const details: string[] = [];

  // Q1 - Time to first cigarette (most predictive)
  if (responses.q1 >= 2) {
    details.push('cigarette matinale précoce (indicateur de forte dépendance physique)');
  }

  // Q3 - First cigarette hardest to give up
  if (responses.q3 === 1) {
    details.push('première cigarette difficilement remplaçable');
  }

  // Q4 - Heavy smoking (most predictive)
  if (responses.q4 >= 2) {
    details.push(`consommation importante (${responses.q4 === 2 ? '21-30' : '>30'} cigarettes/jour)`);
  }

  // Q5 - Morning heavier smoking
  if (responses.q5 === 1) {
    details.push('rythme plus soutenu le matin');
  }

  if (details.length > 0) {
    interpretation += ` Éléments notables: ${details.join(', ')}.`;
  }

  // Add HSI interpretation
  if (hsiScore >= 4) {
    interpretation += ' Le score HSI élevé indique une dépendance physique importante nécessitant une substitution nicotinique adaptée.';
  }

  return interpretation;
}

// ============================================================================
// EPHP (Entourage module - Handicap Psychique)
// ============================================================================

/**
 * Get EPHP response for a visit
 */
export async function getEphpSzResponse(visitId: string) {
  return getSchizophreniaInitialResponse('EPHP_SZ', visitId);
}

/**
 * Helper function to sum EPHP items, excluding value 7 (non évaluable)
 */
function sumEphpItemsExcludingNonEvaluable(
  responses: Record<string, any>,
  items: string[]
): number {
  let sum = 0;
  for (const item of items) {
    const value = responses[item];
    if (typeof value === 'number' && value >= 0 && value <= 6) {
      sum += value;
    }
  }
  return sum;
}

/**
 * Generate EPHP interpretation text
 */
function generateEphpInterpretation(
  totalScore: number,
  scoreCognitiv: number,
  scoreMotiv: number,
  scoreComm: number,
  scoreEval: number,
  excludedCount: number
): string {
  const percentage = Math.round((totalScore / 78) * 100);
  
  let interpretation = `Score global EPHP: ${totalScore}/78 (${percentage}%).`;
  
  // Overall functioning level (higher = better)
  if (percentage >= 75) {
    interpretation += ' Bon niveau de fonctionnement global.';
  } else if (percentage >= 50) {
    interpretation += ' Niveau de fonctionnement modéré avec des difficultés dans certains domaines.';
  } else if (percentage >= 25) {
    interpretation += ' Niveau de fonctionnement altéré avec des difficultés significatives.';
  } else {
    interpretation += ' Niveau de fonctionnement très altéré, handicap psychique important.';
  }
  
  // Domain-specific insights
  const domainAnalysis: string[] = [];
  
  // Cognitif (max 24)
  const cognitivPct = Math.round((scoreCognitiv / 24) * 100);
  if (cognitivPct < 50) {
    domainAnalysis.push('capacités cognitives altérées');
  }
  
  // Motivation (max 24)
  const motivPct = Math.round((scoreMotiv / 24) * 100);
  if (motivPct < 50) {
    domainAnalysis.push('déficit motivationnel');
  }
  
  // Communication (max 18)
  const commPct = Math.round((scoreComm / 18) * 100);
  if (commPct < 50) {
    domainAnalysis.push('difficultés de communication');
  }
  
  // Auto-évaluation (max 12)
  const evalPct = Math.round((scoreEval / 12) * 100);
  if (evalPct < 50) {
    domainAnalysis.push('insight et demande d\'aide limités');
  }
  
  if (domainAnalysis.length > 0) {
    interpretation += ` Points d'attention: ${domainAnalysis.join(', ')}.`;
  }
  
  // Note excluded items
  if (excludedCount > 0) {
    interpretation += ` Note: ${excludedCount} item(s) non évaluable(s) exclu(s) du calcul.`;
  }
  
  return interpretation;
}

/**
 * Save EPHP response with domain and global scores
 */
export async function saveEphpSzResponse(response: any): Promise<any> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  
  // Domain definitions
  const COGNITIV_ITEMS = ['a1', 'a2', 'a3', 'a4'];
  const MOTIV_ITEMS = ['b5', 'b6', 'b7', 'b8'];
  const COMM_ITEMS = ['c9', 'c10', 'c11'];
  const EVAL_ITEMS = ['d12', 'd13'];
  
  // Handle case where questionnaire is not completed
  if (response.questionnaire_done === 'Non fait') {
    const { data, error } = await supabase
      .from('schizophrenia_ephp')
      .upsert({
        visit_id: response.visit_id,
        patient_id: response.patient_id,
        questionnaire_done: response.questionnaire_done,
        completed_by: user.data.user?.id
      }, { onConflict: 'visit_id' })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving schizophrenia_ephp:', error);
      throw error;
    }
    return data;
  }
  
  // Count excluded items (value 7)
  let excludedCount = 0;
  const allItems = [...COGNITIV_ITEMS, ...MOTIV_ITEMS, ...COMM_ITEMS, ...EVAL_ITEMS];
  for (const item of allItems) {
    if (response[item] === 7) {
      excludedCount++;
    }
  }
  
  // Calculate domain subscores (excluding value 7)
  const score_cognitiv = sumEphpItemsExcludingNonEvaluable(response, COGNITIV_ITEMS);
  const score_motiv = sumEphpItemsExcludingNonEvaluable(response, MOTIV_ITEMS);
  const score_comm = sumEphpItemsExcludingNonEvaluable(response, COMM_ITEMS);
  const score_eval = sumEphpItemsExcludingNonEvaluable(response, EVAL_ITEMS);
  
  // Calculate global score
  const total_score = score_cognitiv + score_motiv + score_comm + score_eval;
  
  // Generate interpretation
  const interpretation = generateEphpInterpretation(
    total_score,
    score_cognitiv,
    score_motiv,
    score_comm,
    score_eval,
    excludedCount
  );
  
  const { data, error } = await supabase
    .from('schizophrenia_ephp')
    .upsert({
      visit_id: response.visit_id,
      patient_id: response.patient_id,
      questionnaire_done: response.questionnaire_done,
      a1: response.a1,
      a2: response.a2,
      a3: response.a3,
      a4: response.a4,
      b5: response.b5,
      b6: response.b6,
      b7: response.b7,
      b8: response.b8,
      c9: response.c9,
      c10: response.c10,
      c11: response.c11,
      d12: response.d12,
      d13: response.d13,
      score_cognitiv,
      score_motiv,
      score_comm,
      score_eval,
      total_score,
      interpretation,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();
  
  if (error) {
    console.error('Error saving schizophrenia_ephp:', error);
    throw error;
  }
  return data;
}
