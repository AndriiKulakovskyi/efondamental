// eFondaMental Platform - Bipolar Initial Evaluation Service
// Handles all questionnaire data operations for bipolar initial visits

import { createClient } from '@/lib/supabase/server';
import { 
  saveMadrsResponse, 
  saveYmrsResponse,
  type MadrsResponseInsert,
  type YmrsResponseInsert 
} from '@/lib/services/questionnaire-hetero.service';
import { computeCtqScores, type BipolarCtqResponse } from '@/lib/questionnaires/bipolar/initial/auto/traits/ctq';
import { computeBis10Scores, type BipolarBis10Response } from '@/lib/questionnaires/bipolar/initial/auto/traits/bis10';
import { computeAls18Scores, type BipolarAls18Response } from '@/lib/questionnaires/bipolar/initial/auto/traits/als18';
import { computeAimScores, type BipolarAimResponse } from '@/lib/questionnaires/bipolar/initial/auto/traits/aim';
import { computeAq12Scores, type BipolarAq12Response } from '@/lib/questionnaires/bipolar/initial/auto/traits/aq12';
import { computeCsmScores, type BipolarCsmResponse } from '@/lib/questionnaires/bipolar/initial/auto/traits/csm';
import { computeCtiScores, type BipolarCtiResponse } from '@/lib/questionnaires/bipolar/initial/auto/traits/cti';
import { computeEq5d5lScores, type BipolarEq5d5lResponse } from '@/lib/questionnaires/bipolar/initial/auto/etat/eq5d5l';
import { computePriseMScores, type BipolarPriseMResponse } from '@/lib/questionnaires/bipolar/initial/auto/etat/prise-m';
import { computeStaiYaScores, type BipolarStaiYaResponse } from '@/lib/questionnaires/bipolar/initial/auto/etat/stai-ya';
import { computeMarsScores, type BipolarMarsResponse } from '@/lib/questionnaires/bipolar/initial/auto/etat/mars';

// ============================================================================
// Generic Types for Bipolar Initial Questionnaires
// ============================================================================

interface BipolarQuestionnaireResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

type BipolarQuestionnaireInsert<T> = Omit<T, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Table name mapping for bipolar initial questionnaires
// ============================================================================

const BIPOLAR_INITIAL_TABLES: Record<string, string> = {
  // Nurse module (tables prefixed with bipolar_nurse_)
  'TOBACCO': 'bipolar_nurse_tobacco',
  'FAGERSTROM': 'bipolar_nurse_fagerstrom',
  'PHYSICAL_PARAMS': 'bipolar_nurse_physical_params',
  'BLOOD_PRESSURE': 'bipolar_nurse_blood_pressure',
  'ECG': 'bipolar_nurse_ecg',
  'SLEEP_APNEA': 'bipolar_nurse_sleep_apnea',
  'BIOLOGICAL_ASSESSMENT': 'bipolar_nurse_biological_assessment',
  
  // Thymic module
  'MADRS': 'bipolar_madrs',
  'YMRS': 'bipolar_ymrs',
  'CGI': 'bipolar_cgi',
  'EGF': 'bipolar_egf',
  'ALDA': 'bipolar_alda',
  'ETAT_PATIENT': 'bipolar_etat_patient',
  'FAST': 'bipolar_fast',
  
  // Auto ETAT module
  'EQ5D5L': 'bipolar_eq5d5l',
  'PRISE_M': 'bipolar_prise_m',
  'STAI_YA': 'bipolar_stai_ya',
  'MARS': 'bipolar_mars',
  'MATHYS': 'bipolar_mathys',
  'PSQI': 'bipolar_psqi',
  'EPWORTH': 'bipolar_epworth',
  
  // Auto TRAITS module
  'ASRS': 'bipolar_asrs',
  'CTQ': 'bipolar_ctq',
  'BIS10': 'bipolar_bis10',
  'ALS18': 'bipolar_als18',
  'AIM': 'bipolar_aim',
  'WURS25': 'bipolar_wurs25',
  'AQ12': 'bipolar_aq12',
  'CSM': 'bipolar_csm',
  'CTI': 'bipolar_cti',
  
  // Social module
  'SOCIAL': 'bipolar_social',
  
  // Medical module
  'DSM5_HUMEUR': 'bipolar_dsm5_humeur',
  'DSM5_PSYCHOTIC': 'bipolar_dsm5_psychotic',
  'DSM5_COMORBID': 'bipolar_dsm5_comorbid',
  'DIVA': 'bipolar_diva',
  'FAMILY_HISTORY': 'bipolar_family_history',
  'CSSRS': 'bipolar_cssrs',
  'ISA': 'bipolar_isa',
  'SIS': 'bipolar_sis',
  'SUICIDE_HISTORY': 'bipolar_suicide_history',
  'PERINATALITE': 'bipolar_perinatalite',
  'PATHO_NEURO': 'bipolar_patho_neuro',
  'PATHO_CARDIO': 'bipolar_patho_cardio',
  'PATHO_ENDOC': 'bipolar_patho_endoc',
  'PATHO_DERMATO': 'bipolar_patho_dermato',
  'PATHO_URINAIRE': 'bipolar_patho_urinaire',
  'ANTECEDENTS_GYNECO': 'bipolar_antecedents_gyneco',
  'PATHO_HEPATO_GASTRO': 'bipolar_patho_hepato_gastro',
  'PATHO_ALLERGIQUE': 'bipolar_patho_allergique',
  'AUTRES_PATHO': 'bipolar_autres_patho',
  
  // Neuropsy module
  'CVLT': 'bipolar_cvlt',
  'TMT': 'bipolar_tmt',
  'STROOP': 'bipolar_stroop',
  'FLUENCES_VERBALES': 'bipolar_fluences_verbales',
  'MEM3_SPATIAL': 'bipolar_mem3_spatial',
  'WAIS4_CRITERIA': 'bipolar_wais4_criteria',
  'WAIS4_LEARNING': 'bipolar_wais4_learning',
  'WAIS4_MATRICES': 'bipolar_wais4_matrices',
  'WAIS4_CODE': 'bipolar_wais4_code',
  'WAIS4_DIGIT_SPAN': 'bipolar_wais4_digit_span',
  'WAIS4_SIMILITUDES': 'bipolar_wais4_similitudes',
  'WAIS3_CRITERIA': 'bipolar_wais3_criteria',
  'WAIS3_LEARNING': 'bipolar_wais3_learning',
  'WAIS3_VOCABULAIRE': 'bipolar_wais3_vocabulaire',
  'WAIS3_MATRICES': 'bipolar_wais3_matrices',
  'WAIS3_CODE_SYMBOLES': 'bipolar_wais3_code_symboles',
  'WAIS3_DIGIT_SPAN': 'bipolar_wais3_digit_span',
  'WAIS3_CPT2': 'bipolar_wais3_cpt2',
  'COBRA': 'bipolar_cobra',
  'CPT3': 'bipolar_cpt3',
  'SCIP': 'bipolar_scip',
  'TEST_COMMISSIONS': 'bipolar_test_commissions',
};

// ============================================================================
// Generic Get/Save Functions
// ============================================================================

/**
 * Get a bipolar initial questionnaire response by visit ID
 */
export async function getBipolarInitialResponse<T extends BipolarQuestionnaireResponse>(
  questionnaireCode: string,
  visitId: string
): Promise<T | null> {
  const tableName = BIPOLAR_INITIAL_TABLES[questionnaireCode];
  if (!tableName) {
    throw new Error(`Unknown bipolar initial questionnaire code: ${questionnaireCode}`);
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
 * Save a bipolar initial questionnaire response (upsert)
 */
export async function saveBipolarInitialResponse<T extends BipolarQuestionnaireResponse>(
  questionnaireCode: string,
  response: BipolarQuestionnaireInsert<T>
): Promise<T> {
  const tableName = BIPOLAR_INITIAL_TABLES[questionnaireCode];
  if (!tableName) {
    throw new Error(`Unknown bipolar initial questionnaire code: ${questionnaireCode}`);
  }

  // Special handling for questionnaires that need score calculation
  // MADRS and YMRS need to calculate total_score and interpretation
  if (questionnaireCode === 'MADRS') {
    return await saveMadrsResponse(response as any as MadrsResponseInsert) as any as T;
  }
  
  if (questionnaireCode === 'YMRS') {
    return await saveYmrsResponse(response as any as YmrsResponseInsert) as any as T;
  }

  // CTQ needs to calculate subscale scores and severity interpretations
  if (questionnaireCode === 'CTQ') {
    const ctqScores = computeCtqScores(response as Partial<BipolarCtqResponse>);
    const ctqResponse = {
      ...response,
      ...ctqScores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(ctqResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving CTQ response:', error);
      throw error;
    }

    return data as T;
  }

  // BIS10 needs to calculate impulsivity scores and means
  if (questionnaireCode === 'BIS10') {
    const bis10Scores = computeBis10Scores(response as Partial<BipolarBis10Response>);
    const bis10Response = {
      ...response,
      ...bis10Scores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(bis10Response, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving BIS10 response:', error);
      throw error;
    }

    return data as T;
  }

  // ALS18 needs to calculate subscale scores and interpretation
  if (questionnaireCode === 'ALS18') {
    const als18Scores = computeAls18Scores(response as Partial<BipolarAls18Response>);
    const als18Response = {
      ...response,
      ...als18Scores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(als18Response, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving ALS18 response:', error);
      throw error;
    }

    return data as T;
  }

  // AIM needs to calculate total score, mean, and interpretation
  if (questionnaireCode === 'AIM') {
    const aimScores = computeAimScores(response as Partial<BipolarAimResponse>);
    const aimResponse = {
      ...response,
      ...aimScores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(aimResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving AIM response:', error);
      throw error;
    }

    return data as T;
  }

  // AQ12 needs to calculate subscale scores and interpretation
  if (questionnaireCode === 'AQ12') {
    const aq12Scores = computeAq12Scores(response as Partial<BipolarAq12Response>);
    const aq12Response = {
      ...response,
      ...aq12Scores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(aq12Response, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving AQ12 response:', error);
      throw error;
    }

    return data as T;
  }

  // CSM needs to calculate total score and chronotype
  if (questionnaireCode === 'CSM') {
    const csmScores = computeCsmScores(response as Partial<BipolarCsmResponse>);
    const csmResponse = {
      ...response,
      ...csmScores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(csmResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving CSM response:', error);
      throw error;
    }

    return data as T;
  }

  // CTI needs to calculate subscale scores and circadian type
  if (questionnaireCode === 'CTI') {
    const ctiScores = computeCtiScores(response as Partial<BipolarCtiResponse>);
    const ctiResponse = {
      ...response,
      ...ctiScores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(ctiResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving CTI response:', error);
      throw error;
    }

    return data as T;
  }

  // EQ5D5L needs to calculate health state and interpretation
  if (questionnaireCode === 'EQ5D5L') {
    const eq5d5lScores = computeEq5d5lScores(response as any);
    const eq5d5lResponse = {
      ...response,
      ...eq5d5lScores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(eq5d5lResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving EQ5D5L response:', error);
      throw error;
    }

    return data as T;
  }

  // PRISE_M needs to calculate side effects scores
  if (questionnaireCode === 'PRISE_M') {
    const priseMScores = computePriseMScores(response as Partial<BipolarPriseMResponse>);
    const priseMResponse = {
      ...response,
      ...priseMScores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(priseMResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving PRISE_M response:', error);
      throw error;
    }

    return data as T;
  }

  // STAI_YA needs to calculate anxiety scores
  if (questionnaireCode === 'STAI_YA') {
    const staiScores = computeStaiYaScores(response as Partial<BipolarStaiYaResponse>);
    const staiResponse = {
      ...response,
      ...staiScores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(staiResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving STAI_YA response:', error);
      throw error;
    }

    return data as T;
  }

  // MARS needs to calculate adherence scores
  if (questionnaireCode === 'MARS') {
    const marsScores = computeMarsScores(response as Partial<BipolarMarsResponse>);
    const marsResponse = {
      ...response,
      ...marsScores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(marsResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving MARS response:', error);
      throw error;
    }

    return data as T;
  }

  // Convert "oui"/"non" string values to boolean for database boolean columns
  // This is needed because questionnaires use French string options but DB uses boolean
  const convertedResponse = { ...response } as Record<string, unknown>;
  for (const key of Object.keys(convertedResponse)) {
    const value = convertedResponse[key];
    if (value === 'oui') {
      convertedResponse[key] = true;
    } else if (value === 'non') {
      convertedResponse[key] = false;
    }
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(tableName)
    .upsert(convertedResponse, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) {
    console.error(`Error saving ${tableName}:`, error);
    throw error;
  }

  return data as T;
}

// ============================================================================
// Specific Get Functions (for convenience and type safety)
// ============================================================================

// Nurse module
export async function getTobaccoResponse(visitId: string) {
  return getBipolarInitialResponse('TOBACCO', visitId);
}

export async function getFagerstromResponse(visitId: string) {
  return getBipolarInitialResponse('FAGERSTROM', visitId);
}

export async function getPhysicalParamsResponse(visitId: string) {
  return getBipolarInitialResponse('PHYSICAL_PARAMS', visitId);
}

export async function getBloodPressureResponse(visitId: string) {
  return getBipolarInitialResponse('BLOOD_PRESSURE', visitId);
}

export async function getSleepApneaResponse(visitId: string) {
  return getBipolarInitialResponse('SLEEP_APNEA', visitId);
}

export async function getBiologicalAssessmentResponse(visitId: string) {
  return getBipolarInitialResponse('BIOLOGICAL_ASSESSMENT', visitId);
}

// Thymic module
export async function getMadrsResponse(visitId: string) {
  return getBipolarInitialResponse('MADRS', visitId);
}

export async function getYmrsResponse(visitId: string) {
  return getBipolarInitialResponse('YMRS', visitId);
}

export async function getCgiResponse(visitId: string) {
  return getBipolarInitialResponse('CGI', visitId);
}

export async function getEgfResponse(visitId: string) {
  return getBipolarInitialResponse('EGF', visitId);
}

export async function getAldaResponse(visitId: string) {
  return getBipolarInitialResponse('ALDA', visitId);
}

export async function getEtatPatientResponse(visitId: string) {
  return getBipolarInitialResponse('ETAT_PATIENT', visitId);
}

export async function getFastResponse(visitId: string) {
  return getBipolarInitialResponse('FAST', visitId);
}

// Auto ETAT module
export async function getEq5d5lResponse(visitId: string) {
  return getBipolarInitialResponse('EQ5D5L', visitId);
}

export async function getPriseMResponse(visitId: string) {
  return getBipolarInitialResponse('PRISE_M', visitId);
}

export async function getStaiYaResponse(visitId: string) {
  return getBipolarInitialResponse('STAI_YA', visitId);
}

export async function getMarsResponse(visitId: string) {
  return getBipolarInitialResponse('MARS', visitId);
}

export async function getMathysResponse(visitId: string) {
  return getBipolarInitialResponse('MATHYS', visitId);
}

export async function getPsqiResponse(visitId: string) {
  return getBipolarInitialResponse('PSQI', visitId);
}

export async function getEpworthResponse(visitId: string) {
  return getBipolarInitialResponse('EPWORTH', visitId);
}

// Auto TRAITS module
export async function getAsrsResponse(visitId: string) {
  return getBipolarInitialResponse('ASRS', visitId);
}

export async function getCtqResponse(visitId: string) {
  return getBipolarInitialResponse('CTQ', visitId);
}

export async function getBis10Response(visitId: string) {
  return getBipolarInitialResponse('BIS10', visitId);
}

export async function getAls18Response(visitId: string) {
  return getBipolarInitialResponse('ALS18', visitId);
}

export async function getAimResponse(visitId: string) {
  return getBipolarInitialResponse('AIM', visitId);
}

export async function getWurs25Response(visitId: string) {
  return getBipolarInitialResponse('WURS25', visitId);
}

export async function getAq12Response(visitId: string) {
  return getBipolarInitialResponse('AQ12', visitId);
}

export async function getCsmResponse(visitId: string) {
  return getBipolarInitialResponse('CSM', visitId);
}

export async function getCtiResponse(visitId: string) {
  return getBipolarInitialResponse('CTI', visitId);
}

// Social module
export async function getSocialResponse(visitId: string) {
  return getBipolarInitialResponse('SOCIAL', visitId);
}

// ============================================================================
// Batch Operations
// ============================================================================

/**
 * Get completion status for all bipolar initial questionnaires in a visit
 */
export async function getBipolarInitialCompletionStatus(visitId: string): Promise<Record<string, boolean>> {
  const supabase = await createClient();
  const status: Record<string, boolean> = {};

  // Check each table for responses
  for (const [code, tableName] of Object.entries(BIPOLAR_INITIAL_TABLES)) {
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
 * Get all completed questionnaires for a bipolar initial visit
 */
export async function getAllBipolarInitialResponses(visitId: string): Promise<Record<string, any>> {
  const responses: Record<string, any> = {};
  
  for (const code of Object.keys(BIPOLAR_INITIAL_TABLES)) {
    try {
      const response = await getBipolarInitialResponse(code, visitId);
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
// Export table mapping for use in other services
// ============================================================================

export { BIPOLAR_INITIAL_TABLES };
