// eFondaMental Platform - Bipolar Initial Evaluation Service
// Handles all questionnaire data operations for bipolar initial visits

import { createClient } from '@/lib/supabase/server';
import { transformQuestionnaireResponse } from '@/lib/utils/questionnaire-transforms';
import { getQuestionnaireFieldTypes } from '@/lib/utils/questionnaire-field-definitions';
import { 
  saveMadrsResponse, 
  saveYmrsResponse,
  saveAldaResponse,
  saveEtatPatientResponse,
  saveFastResponse,
  saveDivaResponse,
  type MadrsResponseInsert,
  type YmrsResponseInsert,
  type AldaResponseInsert,
  type EtatPatientResponseInsert,
  type FastResponseInsert,
  type DivaResponseInsert
} from '@/lib/services/questionnaire-hetero.service';
import {
  saveDsm5ComorbidResponse
} from '@/lib/services/questionnaire-dsm5.service';
import type { Dsm5ComorbidResponseInsert } from '@/lib/types/database.types';
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
import { computeMathysScores, type BipolarMathysResponse } from '@/lib/questionnaires/bipolar/initial/auto/etat/mathys';
import { computePsqiScores, type BipolarPsqiResponse } from '@/lib/questionnaires/bipolar/initial/auto/etat/psqi';
import { computeEpworthScores, type BipolarEpworthResponse } from '@/lib/questionnaires/bipolar/initial/auto/etat/epworth';
import { scoreQids, type BipolarQidsResponse } from '@/lib/questionnaires/bipolar/screening/auto/qids';

// Nurse module calculation imports
import { analyzePhysicalParams } from '@/lib/questionnaires/bipolar/nurse/physical-params';
import { analyzeBloodPressure } from '@/lib/questionnaires/bipolar/nurse/blood-pressure';
import { scoreSleepApnea } from '@/lib/questionnaires/bipolar/nurse/sleep-apnea';

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
  'QIDS_SR16': 'bipolar_qids_sr16',
  
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

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error(`Error fetching ${tableName}:`, error);
      throw error;
    }
  }

  // Defensive normalization for DSM5_COMORBID:
  // Some environments have a subset of eating-disorder fields stored as BOOLEAN.
  // The questionnaire renderer expects 'oui'/'non' string codes, so map booleans to strings.
  if (data && questionnaireCode === 'DSM5_COMORBID') {
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

    return normalized as T;
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

  // ALDA needs to calculate score_a, score_b and alda_score (A - B)
  if (questionnaireCode === 'ALDA') {
    return await saveAldaResponse(response as any as AldaResponseInsert) as any as T;
  }

  // ETAT_PATIENT (DSM-IV Symptoms) needs to calculate derived fields and must not
  // attempt to persist client-only fields like total_score.
  if (questionnaireCode === 'ETAT_PATIENT') {
    return await saveEtatPatientResponse(response as any as EtatPatientResponseInsert) as any as T;
  }

  // FAST needs to compute and persist domain subscores, total_score, and interpretation.
  // This ensures that when "Validate questionnaire" is clicked, scoring is computed
  // server-side and stored in Supabase (consistent across initial/annual visits).
  if (questionnaireCode === 'FAST') {
    return await saveFastResponse(response as any as FastResponseInsert) as any as T;
  }

  // DSM5_COMORBID needs special handling because some environments had BOOLEAN columns
  // for a subset of fields while the application submits 'oui'/'non' strings.
  // Route through the DSM5 service which includes a safe retry strategy.
  if (questionnaireCode === 'DSM5_COMORBID') {
    return await saveDsm5ComorbidResponse(response as any as Dsm5ComorbidResponseInsert) as any as T;
  }

  // DIVA needs special handling because the database has BOOLEAN columns for symptom
  // and criteria fields, while the application submits 'oui'/'non' strings.
  // Route through saveDivaResponse which handles the string-to-boolean conversion.
  if (questionnaireCode === 'DIVA') {
    return await saveDivaResponse(response as any as DivaResponseInsert) as any as T;
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

  // WAIS4_SIMILITUDES needs to calculate scores based on age and items
  if (questionnaireCode === 'WAIS4_SIMILITUDES') {
    const { calculateWais4SimilitudesScores } = await import('./wais4-similitudes-scoring');
    const scores = calculateWais4SimilitudesScores({
      patient_age: (response as any).patient_age || 35,
      item1: (response as any).item1 || 0,
      item2: (response as any).item2 || 0,
      item3: (response as any).item3 || 0,
      item4: (response as any).item4 || 0,
      item5: (response as any).item5 || 0,
      item6: (response as any).item6 || 0,
      item7: (response as any).item7 || 0,
      item8: (response as any).item8 || 0,
      item9: (response as any).item9 || 0,
      item10: (response as any).item10 || 0,
      item11: (response as any).item11 || 0,
      item12: (response as any).item12 || 0,
      item13: (response as any).item13 || 0,
      item14: (response as any).item14 || 0,
      item15: (response as any).item15 || 0,
      item16: (response as any).item16 || 0,
      item17: (response as any).item17 || 0,
      item18: (response as any).item18 || 0
    });
    
    const similitudesResponse = {
      ...response,
      ...scores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(similitudesResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving WAIS4_SIMILITUDES response:', error);
      throw error;
    }

    return data as T;
  }

  // WAIS4_MATRICES needs to calculate scores based on age and items
  if (questionnaireCode === 'WAIS4_MATRICES') {
    const { calculateStandardizedScore, calculatePercentileRank, calculateDeviationFromMean } = await import('./wais4-matrices-scoring');
    
    // Calculate raw score (sum of items 1-26)
    // Note: Items are stored as item_01, item_02, etc. (with underscore and zero-padding)
    let rawScore = 0;
    for (let i = 1; i <= 26; i++) {
      const itemKey = `item_${String(i).padStart(2, '0')}`;
      rawScore += (response as any)[itemKey] || 0;
    }
    
    const patientAge = (response as any).patient_age || 35;
    const standardizedScore = calculateStandardizedScore(rawScore, patientAge);
    const percentileRank = calculatePercentileRank(standardizedScore);
    
    const matricesResponse = {
      ...response,
      raw_score: rawScore,
      standardized_score: standardizedScore,
      percentile_rank: percentileRank
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(matricesResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving WAIS4_MATRICES response:', error);
      throw error;
    }

    return data as T;
  }

  // WAIS3_VOCABULAIRE needs to calculate scores based on age and items
  if (questionnaireCode === 'WAIS3_VOCABULAIRE') {
    const { calculateWais3VocabulaireScores } = await import('./wais3-vocabulaire-scoring');
    
    // Calculate raw score (sum of all 33 items)
    let rawScore = 0;
    for (let i = 1; i <= 33; i++) {
      rawScore += (response as any)[`item${i}`] || 0;
    }
    
    const patientAge = (response as any).patient_age || 35; // Default to 35 if not provided
    const scores = calculateWais3VocabulaireScores({
      patient_age: patientAge,
      total_raw_score: rawScore
    });
    
    const vocabulaireResponse = {
      ...response,
      total_raw_score: rawScore,
      standard_score: scores.standard_score,
      standardized_value: scores.standardized_value
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(vocabulaireResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving WAIS3_VOCABULAIRE response:', error);
      throw error;
    }

    return data as T;
  }

  // WAIS3_MATRICES needs to calculate scores based on age and items
  if (questionnaireCode === 'WAIS3_MATRICES') {
    const { calculateWais3MatricesScores } = await import('./wais3-matrices-scoring');
    
    // Items use underscore and zero-padding (item_01...item_26)
    const itemData: any = { patient_age: (response as any).patient_age || 35 };
    for (let i = 1; i <= 26; i++) {
      const itemKey = `item_${String(i).padStart(2, '0')}`;
      itemData[itemKey] = (response as any)[itemKey] || 0;
    }
    
    const scores = calculateWais3MatricesScores(itemData);
    
    const matricesResponse = {
      ...response,
      total_raw_score: scores.total_raw_score,
      standard_score: scores.standard_score,
      standardized_value: scores.standardized_value
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(matricesResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving WAIS3_MATRICES response:', error);
      throw error;
    }

    return data as T;
  }

  // WAIS3_DIGIT_SPAN needs to calculate all scores including totals, spans, and z-scores
  if (questionnaireCode === 'WAIS3_DIGIT_SPAN') {
    const { calculateWais3DigitSpanScores } = await import('./wais3-digit-span-scoring');
    
    const scores = calculateWais3DigitSpanScores({
      patient_age: (response as any).patient_age || 35,
      education_level: (response as any).education_level,
      // Forward (Ordre Direct) - 8 items x 2 trials
      mcod_1a: (response as any).mcod_1a,
      mcod_1b: (response as any).mcod_1b,
      mcod_2a: (response as any).mcod_2a,
      mcod_2b: (response as any).mcod_2b,
      mcod_3a: (response as any).mcod_3a,
      mcod_3b: (response as any).mcod_3b,
      mcod_4a: (response as any).mcod_4a,
      mcod_4b: (response as any).mcod_4b,
      mcod_5a: (response as any).mcod_5a,
      mcod_5b: (response as any).mcod_5b,
      mcod_6a: (response as any).mcod_6a,
      mcod_6b: (response as any).mcod_6b,
      mcod_7a: (response as any).mcod_7a,
      mcod_7b: (response as any).mcod_7b,
      mcod_8a: (response as any).mcod_8a,
      mcod_8b: (response as any).mcod_8b,
      // Backward (Ordre Inverse) - 7 items x 2 trials
      mcoi_1a: (response as any).mcoi_1a,
      mcoi_1b: (response as any).mcoi_1b,
      mcoi_2a: (response as any).mcoi_2a,
      mcoi_2b: (response as any).mcoi_2b,
      mcoi_3a: (response as any).mcoi_3a,
      mcoi_3b: (response as any).mcoi_3b,
      mcoi_4a: (response as any).mcoi_4a,
      mcoi_4b: (response as any).mcoi_4b,
      mcoi_5a: (response as any).mcoi_5a,
      mcoi_5b: (response as any).mcoi_5b,
      mcoi_6a: (response as any).mcoi_6a,
      mcoi_6b: (response as any).mcoi_6b,
      mcoi_7a: (response as any).mcoi_7a,
      mcoi_7b: (response as any).mcoi_7b
    });
    
    const digitSpanResponse = {
      ...response,
      ...scores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(digitSpanResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving WAIS3_DIGIT_SPAN response:', error);
      throw error;
    }

    return data as T;
  }

  // WAIS4_DIGIT_SPAN needs to calculate all scores including item scores, section totals, empan, and standardized scores
  if (questionnaireCode === 'WAIS4_DIGIT_SPAN') {
    const { calculateDigitSpanScores } = await import('./wais4-digit-span-scoring');
    
    const scores = calculateDigitSpanScores({
      patient_age: (response as any).patient_age || 35,
      // Direct order (Ordre direct) - 8 items x 2 trials
      wais4_mcod_1a: (response as any).wais4_mcod_1a,
      wais4_mcod_1b: (response as any).wais4_mcod_1b,
      wais4_mcod_2a: (response as any).wais4_mcod_2a,
      wais4_mcod_2b: (response as any).wais4_mcod_2b,
      wais4_mcod_3a: (response as any).wais4_mcod_3a,
      wais4_mcod_3b: (response as any).wais4_mcod_3b,
      wais4_mcod_4a: (response as any).wais4_mcod_4a,
      wais4_mcod_4b: (response as any).wais4_mcod_4b,
      wais4_mcod_5a: (response as any).wais4_mcod_5a,
      wais4_mcod_5b: (response as any).wais4_mcod_5b,
      wais4_mcod_6a: (response as any).wais4_mcod_6a,
      wais4_mcod_6b: (response as any).wais4_mcod_6b,
      wais4_mcod_7a: (response as any).wais4_mcod_7a,
      wais4_mcod_7b: (response as any).wais4_mcod_7b,
      wais4_mcod_8a: (response as any).wais4_mcod_8a,
      wais4_mcod_8b: (response as any).wais4_mcod_8b,
      // Inverse order (Ordre inverse) - 8 items x 2 trials
      wais4_mcoi_1a: (response as any).wais4_mcoi_1a,
      wais4_mcoi_1b: (response as any).wais4_mcoi_1b,
      wais4_mcoi_2a: (response as any).wais4_mcoi_2a,
      wais4_mcoi_2b: (response as any).wais4_mcoi_2b,
      wais4_mcoi_3a: (response as any).wais4_mcoi_3a,
      wais4_mcoi_3b: (response as any).wais4_mcoi_3b,
      wais4_mcoi_4a: (response as any).wais4_mcoi_4a,
      wais4_mcoi_4b: (response as any).wais4_mcoi_4b,
      wais4_mcoi_5a: (response as any).wais4_mcoi_5a,
      wais4_mcoi_5b: (response as any).wais4_mcoi_5b,
      wais4_mcoi_6a: (response as any).wais4_mcoi_6a,
      wais4_mcoi_6b: (response as any).wais4_mcoi_6b,
      wais4_mcoi_7a: (response as any).wais4_mcoi_7a,
      wais4_mcoi_7b: (response as any).wais4_mcoi_7b,
      wais4_mcoi_8a: (response as any).wais4_mcoi_8a,
      wais4_mcoi_8b: (response as any).wais4_mcoi_8b,
      // Sequencing order (Ordre croissant) - 8 items x 2 trials
      wais4_mcoc_1a: (response as any).wais4_mcoc_1a,
      wais4_mcoc_1b: (response as any).wais4_mcoc_1b,
      wais4_mcoc_2a: (response as any).wais4_mcoc_2a,
      wais4_mcoc_2b: (response as any).wais4_mcoc_2b,
      wais4_mcoc_3a: (response as any).wais4_mcoc_3a,
      wais4_mcoc_3b: (response as any).wais4_mcoc_3b,
      wais4_mcoc_4a: (response as any).wais4_mcoc_4a,
      wais4_mcoc_4b: (response as any).wais4_mcoc_4b,
      wais4_mcoc_5a: (response as any).wais4_mcoc_5a,
      wais4_mcoc_5b: (response as any).wais4_mcoc_5b,
      wais4_mcoc_6a: (response as any).wais4_mcoc_6a,
      wais4_mcoc_6b: (response as any).wais4_mcoc_6b,
      wais4_mcoc_7a: (response as any).wais4_mcoc_7a,
      wais4_mcoc_7b: (response as any).wais4_mcoc_7b,
      wais4_mcoc_8a: (response as any).wais4_mcoc_8a,
      wais4_mcoc_8b: (response as any).wais4_mcoc_8b
    });
    
    const digitSpanResponse = {
      ...response,
      ...scores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(digitSpanResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving WAIS4_DIGIT_SPAN response:', error);
      throw error;
    }

    return data as T;
  }

  // FLUENCES_VERBALES needs to calculate Z-scores and percentiles for phonemic and semantic fluency
  if (questionnaireCode === 'FLUENCES_VERBALES') {
    const { calculateFluencesVerbalesScores } = await import('./fluences-verbales-scoring');
    
    console.log('[Fluences Verbales Debug] Input to scoring function:', {
      patient_age: (response as any).patient_age,
      years_of_education: (response as any).years_of_education,
      fv_p_tot_correct: (response as any).fv_p_tot_correct,
      fv_anim_tot_correct: (response as any).fv_anim_tot_correct
    });
    
    const scores = calculateFluencesVerbalesScores({
      patient_age: (response as any).patient_age,
      years_of_education: (response as any).years_of_education,
      fv_p_tot_correct: (response as any).fv_p_tot_correct,
      fv_p_deriv: (response as any).fv_p_deriv,
      fv_p_intrus: (response as any).fv_p_intrus,
      fv_p_propres: (response as any).fv_p_propres,
      fv_anim_tot_correct: (response as any).fv_anim_tot_correct,
      fv_anim_deriv: (response as any).fv_anim_deriv,
      fv_anim_intrus: (response as any).fv_anim_intrus,
      fv_anim_propres: (response as any).fv_anim_propres
    });
    
    console.log('[Fluences Verbales Debug] Calculated scores:', scores);
    
    const fluencesResponse = {
      ...response,
      ...scores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(fluencesResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving FLUENCES_VERBALES response:', error);
      throw error;
    }
    
    console.log('[Fluences Verbales Debug] Saved data:', {
      fv_p_tot_rupregle: data.fv_p_tot_rupregle,
      fv_p_tot_correct_z: data.fv_p_tot_correct_z,
      fv_p_tot_correct_pc: data.fv_p_tot_correct_pc,
      fv_anim_tot_rupregle: data.fv_anim_tot_rupregle,
      fv_anim_tot_correct_z: data.fv_anim_tot_correct_z,
      fv_anim_tot_correct_pc: data.fv_anim_tot_correct_pc
    });

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

  // MATHYS needs to calculate multidimensional scores
  if (questionnaireCode === 'MATHYS') {
    const mathysScores = computeMathysScores(response as Partial<BipolarMathysResponse>);
    const mathysResponse = {
      ...response,
      ...mathysScores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(mathysResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving MATHYS response:', error);
      throw error;
    }

    return data as T;
  }

  // QIDS_SR16 needs to calculate depression scores
  if (questionnaireCode === 'QIDS_SR16') {
    const qidsScores = scoreQids(response as any);
    const qidsResponse = {
      ...response,
      total_score: qidsScores.total_score,
      interpretation: qidsScores.interpretation
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(qidsResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving QIDS_SR16 response:', error);
      throw error;
    }

    return data as T;
  }

  // PSQI needs to calculate sleep quality component scores
  if (questionnaireCode === 'PSQI') {
    const psqiScores = computePsqiScores(response as Partial<BipolarPsqiResponse>);
    const psqiResponse = {
      ...response,
      ...psqiScores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(psqiResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving PSQI response:', error);
      throw error;
    }

    return data as T;
  }

  // EPWORTH needs to calculate sleepiness score and interpretation
  if (questionnaireCode === 'EPWORTH') {
    const epworthScores = computeEpworthScores(response as Partial<BipolarEpworthResponse>);
    const epworthResponse = {
      ...response,
      ...epworthScores
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(epworthResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving EPWORTH response:', error);
      throw error;
    }

    return data as T;
  }

  // ============================================================================
  // Nurse Module Questionnaires with Calculations
  // ============================================================================

  // PHYSICAL_PARAMS needs BMI calculation
  if (questionnaireCode === 'PHYSICAL_PARAMS') {
    const analysis = analyzePhysicalParams({
      height_cm: response.height_cm ?? null,
      weight_kg: response.weight_kg ?? null
    });
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert({
        ...response,
        bmi: analysis.bmi,
        updated_at: new Date().toISOString()
      }, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving PHYSICAL_PARAMS response:', error);
      throw error;
    }

    return data as T;
  }

  // BLOOD_PRESSURE needs tension string formatting
  if (questionnaireCode === 'BLOOD_PRESSURE') {
    const analysis = analyzeBloodPressure({
      bp_lying_systolic: response.bp_lying_systolic ?? null,
      bp_lying_diastolic: response.bp_lying_diastolic ?? null,
      bp_standing_systolic: response.bp_standing_systolic ?? null,
      bp_standing_diastolic: response.bp_standing_diastolic ?? null
    });
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert({
        ...response,
        tension_lying: analysis.tension_lying,
        tension_standing: analysis.tension_standing,
        updated_at: new Date().toISOString()
      }, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving BLOOD_PRESSURE response:', error);
      throw error;
    }

    return data as T;
  }

  // SLEEP_APNEA needs STOP-Bang scoring + value normalization
  // After migration 285, all boolean fields are VARCHAR ('oui'/'non')
  if (questionnaireCode === 'SLEEP_APNEA') {
    // Get field type definitions for normalization
    const fieldTypes = getQuestionnaireFieldTypes('SLEEP_APNEA');
    const normalizedResponse = fieldTypes 
      ? transformQuestionnaireResponse(response, fieldTypes) as any
      : response;
    
    // Calculate STOP-Bang score using normalized values
    const scoring = scoreSleepApnea({
      diagnosed_sleep_apnea: normalizedResponse.diagnosed_sleep_apnea ?? null,
      has_cpap_device: normalizedResponse.has_cpap_device ?? null,
      snoring: normalizedResponse.snoring ?? null,
      tiredness: normalizedResponse.tiredness ?? null,
      observed_apnea: normalizedResponse.observed_apnea ?? null,
      hypertension: normalizedResponse.hypertension ?? null,
      bmi_over_35: normalizedResponse.bmi_over_35 ?? null,
      age_over_50: normalizedResponse.age_over_50 ?? null,
      large_neck: normalizedResponse.large_neck ?? null,
      male_gender: normalizedResponse.male_gender ?? null
    });
    
    const dataToSave = {
      ...normalizedResponse,
      stop_bang_score: scoring.stop_bang_score,
      risk_level: scoring.risk_level,
      interpretation: scoring.interpretation,
      updated_at: new Date().toISOString()
    };
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(dataToSave, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving SLEEP_APNEA response:', error);
      throw error;
    }

    return data as T;
  }

  // FAMILY_HISTORY uses centralized transformation
  // After migration 285, all boolean fields are VARCHAR ('oui'/'non'/'ne_sais_pas')
  if (questionnaireCode === 'FAMILY_HISTORY') {
    // Get field type definitions for normalization
    const fieldTypes = getQuestionnaireFieldTypes('FAMILY_HISTORY');
    const normalizedResponse = fieldTypes 
      ? transformQuestionnaireResponse(response, fieldTypes) as any
      : response;
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert(normalizedResponse, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving bipolar_family_history:', error);
      console.error('Response keys:', Object.keys(normalizedResponse));
      throw error;
    }

    return data as T;
  }

  // BIOLOGICAL_ASSESSMENT needs HDL ratio and corrected calcium calculations
  if (questionnaireCode === 'BIOLOGICAL_ASSESSMENT') {
    // Compute rapport Total/HDL if both values exist
    let rapport_total_hdl = null;
    if (response.cholesterol_total && response.hdl && response.hdl > 0) {
      rapport_total_hdl = Math.round((response.cholesterol_total / response.hdl) * 100) / 100;
    }
    
    // Compute calcemie_corrigee if both values exist
    let calcemie_corrigee = null;
    if (response.calcemie && response.protidemie) {
      calcemie_corrigee = Math.round((response.calcemie / 0.55 + response.protidemie / 160) * 100) / 100;
    }
    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(tableName)
      .upsert({
        ...response,
        rapport_total_hdl,
        calcemie_corrigee,
        updated_at: new Date().toISOString()
      }, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving BIOLOGICAL_ASSESSMENT response:', error);
      throw error;
    }

    return data as T;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(tableName)
    .upsert(response, { onConflict: 'visit_id' })
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
