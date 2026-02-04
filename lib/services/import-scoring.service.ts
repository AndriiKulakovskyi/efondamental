// eFondaMental Platform - Import Scoring Service
// Centralized scoring function registry for legacy data imports
// This service maps questionnaire codes to their scoring functions to ensure
// imported data is scored using the same logic as the application.

import { scoreAsrm } from '@/lib/questionnaires/bipolar/screening/auto/asrm';
import { scoreMdq } from '@/lib/questionnaires/bipolar/screening/auto/mdq';
import { scoreQids } from '@/lib/questionnaires/bipolar/screening/auto/qids';
import { scoreMadrs } from '@/lib/questionnaires/bipolar/initial/thymic/madrs';
import { scoreYmrs } from '@/lib/questionnaires/bipolar/initial/thymic/ymrs';
import { scoreFast } from '@/lib/questionnaires/bipolar/initial/thymic/fast';
import { scoreAlda } from '@/lib/questionnaires/bipolar/initial/thymic/alda';
import { scoreEgf } from '@/lib/questionnaires/bipolar/initial/thymic/egf';
import { scoreEtatPatient } from '@/lib/questionnaires/bipolar/initial/thymic/etat-patient';
import { interpretCgi } from '@/lib/questionnaires/bipolar/initial/thymic/cgi';
import { computeEq5d5lScores } from '@/lib/questionnaires/bipolar/initial/auto/etat/eq5d5l';
import { computePriseMScores } from '@/lib/questionnaires/bipolar/initial/auto/etat/prise-m';
import { computeStaiYaScores } from '@/lib/questionnaires/bipolar/initial/auto/etat/stai-ya';
import { computeMarsScores } from '@/lib/questionnaires/bipolar/initial/auto/etat/mars';
import { computeMathysScores } from '@/lib/questionnaires/bipolar/initial/auto/etat/mathys';
import { computePsqiScores } from '@/lib/questionnaires/bipolar/initial/auto/etat/psqi';
import { computeEpworthScores } from '@/lib/questionnaires/bipolar/initial/auto/etat/epworth';

import { computeAsrsScores, interpretAsrsScore } from '@/lib/questionnaires/bipolar/initial/auto/traits/asrs';
import { computeCtqScores } from '@/lib/questionnaires/bipolar/initial/auto/traits/ctq';
import { computeBis10Scores } from '@/lib/questionnaires/bipolar/initial/auto/traits/bis10';
import { computeAls18Scores } from '@/lib/questionnaires/bipolar/initial/auto/traits/als18';
import { computeAimScores } from '@/lib/questionnaires/bipolar/initial/auto/traits/aim';
import { computeWurs25Scores, interpretWurs25Score } from '@/lib/questionnaires/bipolar/initial/auto/traits/wurs25';
import { computeAq12Scores } from '@/lib/questionnaires/bipolar/initial/auto/traits/aq12';
import { computeCsmScores } from '@/lib/questionnaires/bipolar/initial/auto/traits/csm';
import { computeCtiScores } from '@/lib/questionnaires/bipolar/initial/auto/traits/cti';

import { computeCobraScore } from '@/lib/questionnaires/bipolar/initial/neuropsy/cobra';
import { computeSisScores } from '@/lib/questionnaires/bipolar/initial/medical/sis';

import { scoreFagerstrom } from '@/lib/questionnaires/bipolar/initial/nurse/fagerstrom';
import { scoreStopBang } from '@/lib/questionnaires/bipolar/initial/nurse/sleep-apnea';

import { analyzePhysicalParams } from '@/lib/questionnaires/bipolar/nurse/physical-params';
import { analyzeBloodPressure } from '@/lib/questionnaires/bipolar/nurse/blood-pressure';
// Note: bipolar nurse tables mostly do not persist interpretation strings; only store computed numeric fields.

import { scoreIsaFollowup } from '@/lib/questionnaires/bipolar/followup/suicide/isa-followup';
import { scoreSuicideBehaviorFollowup } from '@/lib/questionnaires/bipolar/followup/suicide/suicide-behavior-followup';

import { calculateTmtScores } from '@/lib/services/tmt-scoring';
import { calculateStroopScores } from '@/lib/services/stroop-scoring';
import { calculateFluencesVerbalesScores } from '@/lib/services/fluences-verbales-scoring';
import { calculateCvltScores } from '@/lib/services/cvlt-scoring';
import { calculateScipScores } from '@/lib/services/scip-scoring';
import { calculateCommissionsScores } from '@/lib/services/commissions-scoring';
import { calculateWais3CodeSymbolesScores } from '@/lib/services/wais3-code-symboles-scoring';
import { calculateWais3VocabulaireScores } from '@/lib/services/wais3-vocabulaire-scoring';
import { calculateWais3MatricesScores } from '@/lib/services/wais3-matrices-scoring';
import { calculateWais3DigitSpanScores } from '@/lib/services/wais3-digit-span-scoring';
import { calculateWais4CodeSymbolesScores } from '@/lib/services/wais4-code-scoring';
import { calculateDigitSpanScores } from '@/lib/services/wais4-digit-span-scoring';
import { calculateStandardizedScore, calculatePercentileRank } from '@/lib/services/wais4-matrices-bp-scoring';
import { calculateWais4SimilitudesScores } from '@/lib/services/wais4-similitudes-scoring';
import { calculateMem3SpatialScores } from '@/lib/services/mem3-spatial-scoring';

// ============================================================================
// TYPES
// ============================================================================

export interface ScoringResult {
  [key: string]: any;
}

export type ScoringFunction = (responses: Record<string, any>) => ScoringResult;

// ============================================================================
// SCORING FUNCTION REGISTRY
// ============================================================================

/**
 * Registry mapping questionnaire codes to their scoring functions.
 * Each function takes raw responses and returns computed scores.
 */
export const SCORING_FUNCTION_REGISTRY: Record<string, ScoringFunction> = {
  // Screening Auto
  'ASRM': (responses) => scoreAsrm(responses as any),
  'MDQ': (responses) => scoreMdq(responses as any),
  'QIDS_SR16': (responses) => scoreQids(responses as any),
  
  // Auto ETAT Module
  'EQ5D5L': (responses) => {
    // EQ5D5L - EuroQol 5 Dimensions health state computation
    const result = computeEq5d5lScores(responses as any);
    return {
      health_state: result.profile_string,
      profile_string: result.profile_string,
      index_value: result.index_value,
      interpretation: result.interpretation
    };
  },

  // Auto ETAT Module (other)
  'PRISE_M': (responses) => computePriseMScores(responses as any),
  'STAI_YA': (responses) => computeStaiYaScores(responses as any),
  'MARS': (responses) => computeMarsScores(responses as any),
  'MATHYS': (responses) => computeMathysScores(responses as any),
  'PSQI': (responses) => computePsqiScores(responses as any),
  'EPWORTH': (responses) => computeEpworthScores(responses as any),
  
  // Thymic Module
  'MADRS': (responses) => scoreMadrs(responses as any),
  'YMRS': (responses) => scoreYmrs(responses as any),
  'FAST': (responses) => scoreFast(responses as any),
  'ALDA': (responses) => scoreAlda(responses as any),
  'EGF': (responses) => {
    // EGF takes a single score value, not an object
    const score = responses.egf_score ?? responses.score ?? 0;
    return scoreEgf(score);
  },
  'ETAT_PATIENT': (responses) => scoreEtatPatient(responses as any),
  'CGI': (responses) => {
    // CGI - Clinical Global Impression interpretation
    const result = interpretCgi(responses.cgi_s, responses.cgi_i);
    return {
      interpretation: result.interpretation
    };
  },
  
  // Nurse Module
  'FAGERSTROM': (responses) => scoreFagerstrom(responses as any),
  'SLEEP_APNEA': (responses) => scoreStopBang(responses as any),
  'PHYSICAL_PARAMS': (responses) => {
    const analysis = analyzePhysicalParams({
      height_cm: responses.height_cm ?? null,
      weight_kg: responses.weight_kg ?? null
    });
    return {
      // DB column: bipolar_nurse_physical_params.bmi
      bmi: analysis.bmi
    };
  },
  'BLOOD_PRESSURE': (responses) => {
    const analysis = analyzeBloodPressure({
      bp_lying_systolic: responses.bp_lying_systolic ?? null,
      bp_lying_diastolic: responses.bp_lying_diastolic ?? null,
      bp_standing_systolic: responses.bp_standing_systolic ?? null,
      bp_standing_diastolic: responses.bp_standing_diastolic ?? null
    });
    return {
      tension_lying: analysis.tension_lying,
      tension_standing: analysis.tension_standing
    };
  },
  'BIOLOGICAL_ASSESSMENT': (responses) => {
    // Mirror bipolar-initial.service.ts derived fields
    let rapport_total_hdl: number | null = null;
    if (responses.cholesterol_total && responses.hdl && responses.hdl > 0) {
      rapport_total_hdl = Math.round((responses.cholesterol_total / responses.hdl) * 100) / 100;
    }
    let calcemie_corrigee: number | null = null;
    if (responses.calcemie && responses.protidemie) {
      calcemie_corrigee = Math.round((responses.calcemie / 0.55 + responses.protidemie / 160) * 100) / 100;
    }
    return { rapport_total_hdl, calcemie_corrigee };
  },
  
  // Follow-up Suicide Module
  'ISA_FOLLOWUP': (responses) => {
    const r = scoreIsaFollowup(responses as any);
    return {
      total_score: r.total_score,
      // Mirror service layer: store human label in DB
      risk_level: r.risk_level_label,
      interpretation: r.interpretation
    };
  },
  // Legacy alias (older code paths used ISA_SUIVI)
  'ISA_SUIVI': (responses) => {
    const r = scoreIsaFollowup(responses as any);
    return {
      total_score: r.total_score,
      risk_level: r.risk_level_label,
      interpretation: r.interpretation
    };
  },
  'SUICIDE_BEHAVIOR_FOLLOWUP': (responses) => {
    const r = scoreSuicideBehaviorFollowup(responses as any);
    return {
      // risk_score is a GENERATED ALWAYS AS column in DB; never write it
      risk_level: r.risk_level_label,
      interpretation: r.interpretation
    };
  },

  // Auto TRAITS Module
  'ASRS': (responses) => {
    const r = computeAsrsScores(responses as any);
    return {
      part_a_score: r.part_a_score,
      part_b_score: r.part_b_score,
      total_score: r.total_score,
      screening_positive: r.screening_positive,
      part_a_positive_items: (responses?.a1 != null || responses?.a2 != null || responses?.a3 != null || responses?.a4 != null || responses?.a5 != null || responses?.a6 != null)
        ? (() => {
            // Recompute the Part A screening item count (same thresholds as computeAsrsScores)
            const thresholds: Record<string, number> = { a1: 2, a2: 2, a3: 2, a4: 3, a5: 3, a6: 3 };
            let count = 0;
            for (let i = 1; i <= 6; i++) {
              const k = `a${i}`;
              const v = responses[k];
              if (typeof v === 'number' && v >= thresholds[k]) count++;
            }
            return count;
          })()
        : 0,
      interpretation: interpretAsrsScore(r.screening_positive, r.total_score),
    };
  },
  'CTQ': (responses) => computeCtqScores(responses as any),
  'BIS10': (responses) => computeBis10Scores(responses as any),
  'ALS18': (responses) => computeAls18Scores(responses as any),
  'AIM': (responses) => computeAimScores(responses as any),
  'WURS25': (responses) => {
    const r = computeWurs25Scores(responses as any);
    return {
      total_score: r.total_score,
      adhd_likely: r.screening_positive,
      interpretation: interpretWurs25Score(r.total_score),
    };
  },
  'AQ12': (responses) => computeAq12Scores(responses as any),
  'CSM': (responses) => computeCsmScores(responses as any),
  'CTI': (responses) => computeCtiScores(responses as any),

  // Medical (computed)
  'SIS': (responses) => {
    // DB uses sis_01..sis_15; scorer uses q1..q15.
    const asQ: Record<string, number> = {};
    for (let i = 1; i <= 15; i++) {
      const key = `sis_${String(i).padStart(2, '0')}`;
      const val = responses[key];
      if (typeof val === 'number') {
        asQ[`q${i}`] = val;
      }
    }
    const r = computeSisScores(asQ);
    return {
      total_score: r.total,
      circumstances_subscore: r.objective,
      conception_subscore: r.subjective,
    };
  },

  // Neuropsy (computed)
  'COBRA': (responses) => {
    const q: Record<string, number> = {};
    for (let i = 1; i <= 16; i++) {
      const v = responses[`q${i}`];
      if (typeof v === 'number') q[`q${i}`] = v;
    }
    return { total_score: computeCobraScore(q as any) };
  },
  'CVLT': (responses) => {
    const required = [
      'patient_age','years_of_education','patient_sex',
      'trial_1','trial_2','trial_3','trial_4','trial_5',
      'list_b','sdfr','sdcr','ldfr','ldcr'
    ];
    for (const k of required) {
      if (responses[k] === null || responses[k] === undefined) return {};
    }
    const total_1_5 =
      (responses.total_1_5 ?? null) ??
      (responses.trial_1 + responses.trial_2 + responses.trial_3 + responses.trial_4 + responses.trial_5);
    return {
      ...(Number.isFinite(total_1_5) ? { total_1_5 } : {}),
      ...calculateCvltScores({
        patient_age: responses.patient_age,
        years_of_education: responses.years_of_education,
        patient_sex: responses.patient_sex,
        trial_1: responses.trial_1,
        trial_2: responses.trial_2,
        trial_3: responses.trial_3,
        trial_4: responses.trial_4,
        trial_5: responses.trial_5,
        total_1_5,
        list_b: responses.list_b,
        sdfr: responses.sdfr,
        sdcr: responses.sdcr,
        ldfr: responses.ldfr,
        ldcr: responses.ldcr,
        semantic_clustering: responses.semantic_clustering ?? null,
        serial_clustering: responses.serial_clustering ?? null,
        perseverations: responses.perseverations ?? null,
        intrusions: responses.intrusions ?? null,
        recognition_hits: responses.recognition_hits ?? null,
        false_positives: responses.false_positives ?? null,
        discriminability: responses.discriminability ?? null,
        primacy: responses.primacy ?? null,
        recency: responses.recency ?? null,
        response_bias: responses.response_bias ?? null,
      } as any),
    };
  },
  'TMT': (responses) => {
    const required = ['patient_age','years_of_education','tmta_tps','tmta_err','tmtb_tps','tmtb_err','tmtb_err_persev'];
    for (const k of required) {
      if (responses[k] === null || responses[k] === undefined) return {};
    }
    return calculateTmtScores({
      patient_age: responses.patient_age,
      years_of_education: responses.years_of_education,
      tmta_tps: responses.tmta_tps,
      tmta_err: responses.tmta_err,
      tmta_cor: responses.tmta_cor ?? null,
      tmtb_tps: responses.tmtb_tps,
      tmtb_err: responses.tmtb_err,
      tmtb_cor: responses.tmtb_cor ?? null,
      tmtb_err_persev: responses.tmtb_err_persev,
    } as any);
  },
  'STROOP': (responses) => {
    const required = ['patient_age','stroop_w_tot','stroop_c_tot','stroop_cw_tot'];
    for (const k of required) {
      if (responses[k] === null || responses[k] === undefined) return {};
    }
    return calculateStroopScores({
      patient_age: responses.patient_age,
      stroop_w_tot: responses.stroop_w_tot,
      stroop_c_tot: responses.stroop_c_tot,
      stroop_cw_tot: responses.stroop_cw_tot,
    } as any);
  },
  'FLUENCES_VERBALES': (responses) => {
    const required = ['patient_age','years_of_education','fv_p_tot_correct','fv_anim_tot_correct'];
    for (const k of required) {
      if (responses[k] === null || responses[k] === undefined) return {};
    }
    return calculateFluencesVerbalesScores({
      patient_age: responses.patient_age,
      years_of_education: responses.years_of_education,
      fv_p_tot_correct: responses.fv_p_tot_correct,
      fv_p_deriv: responses.fv_p_deriv ?? null,
      fv_p_intrus: responses.fv_p_intrus ?? null,
      fv_p_propres: responses.fv_p_propres ?? null,
      fv_anim_tot_correct: responses.fv_anim_tot_correct,
      fv_anim_deriv: responses.fv_anim_deriv ?? null,
      fv_anim_intrus: responses.fv_anim_intrus ?? null,
      fv_anim_propres: responses.fv_anim_propres ?? null,
    } as any);
  },
  'SCIP': (responses) => {
    const required = ['scipv01a','scipv02a','scipv03a','scipv04a','scipv05a'];
    for (const k of required) {
      if (responses[k] === null || responses[k] === undefined) return {};
    }
    return calculateScipScores({
      scipv01a: Number(responses.scipv01a),
      scipv02a: Number(responses.scipv02a),
      scipv03a: Number(responses.scipv03a),
      scipv04a: Number(responses.scipv04a),
      scipv05a: Number(responses.scipv05a),
    } as any);
  },
  'TEST_COMMISSIONS': (responses) => {
    const required = ['patient_age','nsc','com01','com02','com03','com04'];
    for (const k of required) {
      if (responses[k] === null || responses[k] === undefined) return {};
    }
    return calculateCommissionsScores({
      patient_age: responses.patient_age,
      nsc: responses.nsc,
      com01: responses.com01,
      com02: responses.com02,
      com03: responses.com03,
      com04: responses.com04,
    } as any);
  },
  'WAIS3_CODE_SYMBOLES': (responses) => {
    const patient_age = responses.patient_age;
    // Accept either wais_* inputs or legacy total_* fields
    const wais_cod_tot = responses.wais_cod_tot ?? responses.total_correct;
    const wais_cod_err = responses.wais_cod_err ?? responses.total_errors ?? 0;
    const wais_symb_tot = responses.wais_symb_tot ?? responses.ivt_total_correct ?? 0;
    const wais_symb_err = responses.wais_symb_err ?? responses.ivt_total_errors ?? 0;
    if (patient_age == null || wais_cod_tot == null) return {};
    return calculateWais3CodeSymbolesScores({
      patient_age,
      wais_cod_tot,
      wais_cod_err,
      wais_symb_tot,
      wais_symb_err,
    } as any);
  },
  'WAIS4_CODE': (responses) => {
    const patient_age = responses.patient_age;
    const wais_cod_tot = responses.wais_cod_tot ?? responses.total_correct;
    const wais_cod_err = responses.wais_cod_err ?? responses.total_errors ?? 0;
    const wais_symb_tot = responses.wais_symb_tot ?? responses.ivt_total_correct ?? undefined;
    const wais_symb_err = responses.wais_symb_err ?? responses.ivt_total_errors ?? 0;
    if (patient_age == null || wais_cod_tot == null) return {};
    return calculateWais4CodeSymbolesScores({
      patient_age,
      wais_cod_tot,
      wais_cod_err,
      wais_symb_tot,
      wais_symb_err,
    } as any);
  },
  'WAIS3_VOCABULAIRE': (responses) => {
    if (responses.patient_age == null) return {};
    // Prefer item1..item33 if present, else item_01..item_33
    let totalRaw = 0;
    let any = false;
    for (let i = 1; i <= 33; i++) {
      const k1 = `item${i}`;
      const k2 = `item_${String(i).padStart(2, '0')}`;
      const v = responses[k1] ?? responses[k2];
      if (typeof v === 'number') {
        totalRaw += v;
        any = true;
      }
    }
    if (!any) return {};
    const scores = calculateWais3VocabulaireScores({
      patient_age: responses.patient_age,
      total_raw_score: totalRaw,
    });
    return {
      total_raw_score: totalRaw,
      standard_score: scores.standard_score,
      standardized_value: scores.standardized_value,
    };
  },
  'WAIS3_MATRICES': (responses) => {
    if (responses.patient_age == null) return {};
    // This scorer expects item_01..item_26
    const input: any = { patient_age: responses.patient_age };
    for (let i = 1; i <= 26; i++) {
      const k = `item_${String(i).padStart(2, '0')}`;
      input[k] = responses[k];
    }
    return calculateWais3MatricesScores(input);
  },
  'WAIS4_MATRICES': (responses) => {
    if (responses.patient_age == null) return {};
    let raw_score = 0;
    let any = false;
    for (let i = 1; i <= 26; i++) {
      const k = `item_${String(i).padStart(2, '0')}`;
      const v = responses[k];
      if (typeof v === 'number') {
        raw_score += v;
        any = true;
      }
    }
    if (!any) return {};
    const standardized_score = calculateStandardizedScore(raw_score, responses.patient_age);
    const percentile_rank = calculatePercentileRank(standardized_score);
    return { raw_score, standardized_score, percentile_rank };
  },
  'WAIS4_SIMILITUDES': (responses) => {
    if (responses.patient_age == null) return {};
    const input: any = { patient_age: responses.patient_age };
    let any = false;
    for (let i = 1; i <= 18; i++) {
      const k1 = `item${i}`;
      const k2 = `item_${String(i).padStart(2, '0')}`;
      const v = responses[k1] ?? responses[k2];
      input[`item${i}`] = typeof v === 'number' ? v : 0;
      if (typeof v === 'number') any = true;
    }
    if (!any) return {};
    const scores = calculateWais4SimilitudesScores(input);
    return {
      total_raw_score: scores.total_raw_score,
      standard_score: scores.standard_score,
      standardized_value: scores.standardized_value,
      // DB also has raw_score + standardized_score fields (legacy duplicates)
      raw_score: scores.total_raw_score,
      standardized_score: scores.standard_score,
    };
  },
  'WAIS3_LEARNING': (responses) => {
    let raw_score = 0;
    let any = false;
    for (let i = 1; i <= 16; i++) {
      const k = `item_${String(i).padStart(2, '0')}`;
      const v = responses[k];
      if (typeof v === 'number') {
        raw_score += v;
        any = true;
      }
    }
    if (!any) return {};
    return {
      raw_score,
      standardized_score: raw_score,
    };
  },
  'WAIS4_LEARNING': (responses) => {
    let raw_score = 0;
    let any = false;
    for (let i = 1; i <= 16; i++) {
      const k = `item_${String(i).padStart(2, '0')}`;
      const v = responses[k];
      if (typeof v === 'number') {
        raw_score += v;
        any = true;
      }
    }
    if (!any) return {};
    return {
      raw_score,
      standardized_score: raw_score,
    };
  },
  'WAIS3_DIGIT_SPAN': (responses) => {
    if (responses.patient_age == null) return {};
    // Require at least the first trials to avoid throwing
    if (responses.mcod_1a == null || responses.mcod_1b == null || responses.mcoi_1a == null || responses.mcoi_1b == null) return {};
    try {
      return calculateWais3DigitSpanScores(responses as any);
    } catch {
      return {};
    }
  },
  'WAIS4_DIGIT_SPAN': (responses) => {
    if (responses.patient_age == null) return {};
    if (
      responses.wais4_mcod_1a == null || responses.wais4_mcod_1b == null ||
      responses.wais4_mcoi_1a == null || responses.wais4_mcoi_1b == null ||
      responses.wais4_mcoc_1a == null || responses.wais4_mcoc_1b == null
    ) return {};
    try {
      return calculateDigitSpanScores(responses as any);
    } catch {
      return {};
    }
  },
  'MEM3_SPATIAL': (responses) => {
    if (responses.patient_age == null) return {};
    // Require at least the first trials to avoid throwing
    if (responses.odirect_1a == null || responses.odirect_1b == null || responses.inverse_1a == null || responses.inverse_1b == null) return {};
    try {
      return calculateMem3SpatialScores(responses as any);
    } catch {
      return {};
    }
  },
};

// ============================================================================
// COMPUTED FIELDS MAPPING
// ============================================================================

/**
 * Maps questionnaire codes to the computed field names that should be excluded
 * from raw data insertion and populated via scoring functions.
 */
export const COMPUTED_FIELDS_BY_QUESTIONNAIRE: Record<string, string[]> = {
  // Only include fields that actually exist in the database tables
  'ASRM': ['total_score', 'interpretation'],
  'MDQ': ['q1_score', 'interpretation'],
  'QIDS_SR16': ['total_score', 'interpretation'],
  'MADRS': ['total_score', 'interpretation'],
  'YMRS': ['total_score', 'interpretation'],
  'FAST': ['total_score', 'autonomy_score', 'work_score', 'cognitive_score', 'finances_score', 'relationships_score', 'leisure_score', 'interpretation'],
  'ALDA': ['score_a', 'b_total_score', 'total_score', 'alda_score', 'interpretation'],
  'EGF': ['interpretation'],
  'ETAT_PATIENT': ['depression_count', 'mania_count', 'interpretation'],
  'FAGERSTROM': ['total_score', 'interpretation'],
  'SLEEP_APNEA': ['stop_bang_score', 'risk_level', 'interpretation'],
  'ISA_FOLLOWUP': ['total_score', 'risk_level', 'interpretation'],
  'ISA_SUIVI': ['total_score', 'risk_level', 'interpretation'],
  // risk_score is generated ALWAYS AS in DB; exclude from raw import
  'SUICIDE_BEHAVIOR_FOLLOWUP': ['risk_score', 'risk_level', 'interpretation'],
  'CGI': ['interpretation'],
  'EQ5D5L': ['health_state', 'profile_string', 'index_value', 'interpretation'],

  // Nurse derived fields (only those that exist as DB columns)
  'PHYSICAL_PARAMS': ['bmi'],
  'BLOOD_PRESSURE': ['tension_lying', 'tension_standing'],
  'BIOLOGICAL_ASSESSMENT': ['rapport_total_hdl', 'calcemie_corrigee'],

  // Auto ETAT computed fields
  'PRISE_M': [
    'total_score',
    'interpretation',
    'cardiac_score',
    'gastro_score',
    'items_scored',
    'neuro_score',
    'other_score',
    'sexual_score',
    'skin_score',
    'sleep_score',
    'urogenital_score',
    'vision_hearing_score',
    'tolerable_count',
    'painful_count'
  ],
  'STAI_YA': ['note_t', 'total_score', 'interpretation', 'anxiety_level'],
  'MARS': ['total_score', 'interpretation', 'adherence_percentage', 'adherence_subscore', 'attitude_subscore'],
  'MATHYS': [
    'subscore_emotion',
    'subscore_motivation',
    'subscore_perception',
    'subscore_interaction',
    'subscore_cognition',
    'tristesse',
    'joie',
    'irritabilite',
    'panique',
    'anxiete',
    'colere',
    'exaltation',
    'total_score',
    'interpretation',
    'cognitive_speed',
    'emotional_hyperreactivity',
    'emotional_hyporeactivity',
    'motivation',
    'motor_activity'
  ],
  'PSQI': [
    'c1_subjective_quality',
    'c2_latency',
    'c3_duration',
    'c4_efficiency',
    'c5_disturbances',
    'c6_medication',
    'c7_daytime_dysfunction',
    'total_score',
    'interpretation',
    'sleep_efficiency_pct',
    'time_in_bed_hours'
  ],
  'EPWORTH': ['total_score', 'interpretation'],

  // Traits computed fields
  'ASRS': ['part_a_score', 'part_b_score', 'total_score', 'screening_positive', 'interpretation', 'part_a_positive_items'],
  'CTQ': [
    'emotional_abuse_score',
    'physical_abuse_score',
    'sexual_abuse_score',
    'emotional_neglect_score',
    'physical_neglect_score',
    'minimization_denial_score',
    'total_score',
    'interpretation',
    'emotional_abuse_severity',
    'physical_abuse_severity',
    'sexual_abuse_severity',
    'emotional_neglect_severity',
    'physical_neglect_severity'
  ],
  'BIS10': ['attention_score', 'motor_score', 'non_planning_score', 'total_score', 'mean_score', 'interpretation'],
  'ALS18': ['anxiety_score', 'depression_score', 'anger_score', 'total_score', 'interpretation'],
  'AIM': ['total_score', 'mean_score', 'interpretation'],
  'WURS25': ['total_score', 'interpretation', 'adhd_likely', 'screening_positive'],
  'AQ12': ['social_skill_score', 'attention_switching_score', 'attention_to_detail_score', 'communication_score', 'imagination_score', 'total_score', 'interpretation'],
  'CSM': ['total_score', 'chronotype', 'interpretation'],
  'CTI': ['languidity_score', 'flexibility_score', 'total_score', 'interpretation', 'circadian_type'],

  // Medical computed fields
  'SIS': ['total_score', 'circumstances_subscore', 'conception_subscore'],

  // Neuropsy computed fields
  'COBRA': ['total_score'],
  'CVLT': [
    'trial_1_std',
    'trial_5_std',
    'total_1_5_std',
    'list_b_std',
    'sdfr_std',
    'sdcr_std',
    'ldfr_std',
    'ldcr_std',
    'semantic_std',
    'serial_std',
    'persev_std',
    'intru_std',
    'recog_std',
    'false_recog_std',
    'discrim_std',
    'primacy_std',
    'recency_std',
    'bias_std'
  ],
  'TMT': [
    'tmta_errtot',
    'tmtb_errtot',
    'tmt_b_a_tps',
    'tmt_b_a_err',
    'tmta_tps_z',
    'tmta_tps_pc',
    'tmta_errtot_z',
    'tmta_errtot_pc',
    'tmtb_tps_z',
    'tmtb_tps_pc',
    'tmtb_errtot_z',
    'tmtb_errtot_pc',
    'tmtb_err_persev_z',
    'tmtb_err_persev_pc',
    'tmt_b_a_tps_z',
    'tmt_b_a_tps_pc',
    'tmt_b_a_err_z',
    'tmt_b_a_err_pc'
  ],
  'STROOP': [
    'stroop_w_tot_c',
    'stroop_c_tot_c',
    'stroop_cw_tot_c',
    'stroop_interf',
    'stroop_w_note_t',
    'stroop_c_note_t',
    'stroop_cw_note_t',
    'stroop_interf_note_t',
    'stroop_w_note_t_corrigee',
    'stroop_c_note_t_corrigee',
    'stroop_cw_note_t_corrigee',
    'stroop_interf_note_tz'
  ],
  'FLUENCES_VERBALES': [
    'fv_p_tot_rupregle',
    'fv_p_tot_correct_z',
    'fv_p_tot_correct_pc',
    'fv_anim_tot_rupregle',
    'fv_anim_tot_correct_z',
    'fv_anim_tot_correct_pc'
  ],
  'SCIP': ['scipv01b', 'scipv02b', 'scipv03b', 'scipv04b', 'scipv05b'],
  'TEST_COMMISSIONS': [
    'com01s1','com01s2','com02s1','com02s2','com03s1','com03s2','com04s1','com04s2','com04s3','com04s4','com04s5'
  ],
  'WAIS3_CODE_SYMBOLES': [
    'wais_cod_brut',
    'wais_cod_std',
    'wais_cod_cr',
    'wais_symb_brut',
    'wais_symb_std',
    'wais_symb_cr',
    'wais_somme_ivt',
    'wais_ivt',
    'wais_ivt_rang',
    'wais_ivt_95'
  ],
  'WAIS4_CODE': [
    'wais_cod_brut',
    'wais_cod_std',
    'wais_cod_cr',
    'wais_symb_brut',
    'wais_symb_std',
    'wais_symb_cr',
    'wais_somme_ivt',
    'wais_ivt',
    'wais_ivt_rang',
    'wais_ivt_95'
  ],
  'WAIS3_VOCABULAIRE': ['total_raw_score', 'standard_score', 'standardized_value'],
  'WAIS3_MATRICES': ['total_raw_score', 'standard_score', 'standardized_value'],
  'WAIS4_MATRICES': ['raw_score', 'standardized_score', 'percentile_rank'],
  'WAIS4_SIMILITUDES': ['total_raw_score', 'standard_score', 'standardized_value', 'raw_score', 'standardized_score'],
  'WAIS3_LEARNING': ['raw_score', 'standardized_score', 'percentile_rank'],
  'WAIS4_LEARNING': ['raw_score', 'standardized_score', 'percentile_rank'],
  'WAIS3_DIGIT_SPAN': ['wais_mcod_tot', 'wais_mcoi_tot', 'wais_mc_tot', 'wais_mc_end', 'wais_mc_env', 'wais_mc_emp', 'wais_mc_std', 'wais_mc_cr', 'wais_mc_end_z', 'wais_mc_env_z'],
  'WAIS4_DIGIT_SPAN': [
    'wais_mcod_1','wais_mcod_2','wais_mcod_3','wais_mcod_4','wais_mcod_5','wais_mcod_6','wais_mcod_7','wais_mcod_8',
    'wais_mcoi_1','wais_mcoi_2','wais_mcoi_3','wais_mcoi_4','wais_mcoi_5','wais_mcoi_6','wais_mcoi_7','wais_mcoi_8',
    'wais_mcoc_1','wais_mcoc_2','wais_mcoc_3','wais_mcoc_4','wais_mcoc_5','wais_mcoc_6','wais_mcoc_7','wais_mcoc_8',
    'wais_mcod_tot','wais_mcoi_tot','wais_mcoc_tot','mcod_total','mcoi_total','mcoc_total','raw_score','standardized_score',
    'empan_direct','empan_inverse','empan_croissant','wais_mc_end','wais_mc_env','wais_mc_cro','wais_mc_end_std','wais_mc_env_std','wais_mc_cro_std',
    'wais_mc_emp','wais_mc_tot','wais_mc_std','wais_mc_cr'
  ],
  'MEM3_SPATIAL': [
    'mspatiale_odirect_tot',
    'mspatiale_odirect_std',
    'mspatiale_odirect_cr',
    'mspatiale_inverse_tot',
    'mspatiale_inverse_std',
    'mspatiale_inverse_cr',
    'mspatiale_total_brut',
    'mspatiale_total_std',
    'mspatiale_total_cr',
    'odirect_1_note',
    'odirect_2_note',
    'odirect_3_note',
    'odirect_4_note',
    'odirect_5_note',
    'odirect_6_note',
    'odirect_7_note',
    'odirect_8_note',
    'inverse_1_note',
    'inverse_2_note',
    'inverse_3_note',
    'inverse_4_note',
    'inverse_5_note',
    'inverse_6_note',
    'inverse_7_note',
    'inverse_8_note',
    'item_notes'
  ],
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Normalize questionnaire code by removing _FR suffix.
 * This allows import data to use either 'ASRM' or 'ASRM_FR' format.
 */
export function normalizeQuestionnaireCode(code: string): string {
  return code.replace(/_FR$/, '');
}

/**
 * Check if a questionnaire has a scoring function.
 */
export function hasScoringFunction(code: string): boolean {
  const normalizedCode = normalizeQuestionnaireCode(code);
  return normalizedCode in SCORING_FUNCTION_REGISTRY;
}

/**
 * Get the scoring function for a questionnaire code.
 * Returns undefined if no scoring function exists.
 */
export function getScoringFunction(code: string): ScoringFunction | undefined {
  const normalizedCode = normalizeQuestionnaireCode(code);
  return SCORING_FUNCTION_REGISTRY[normalizedCode];
}

/**
 * Get the list of computed fields for a questionnaire.
 * These fields should be excluded from raw data and computed via scoring functions.
 */
export function getComputedFields(code: string): string[] {
  const normalizedCode = normalizeQuestionnaireCode(code);
  return COMPUTED_FIELDS_BY_QUESTIONNAIRE[normalizedCode] || [];
}

/**
 * Extract raw response data by removing computed fields.
 * This ensures only raw question responses are inserted initially.
 */
export function extractRawResponses(
  code: string,
  responses: Record<string, any>
): Record<string, any> {
  const computedFields = getComputedFields(code);
  const rawResponses: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(responses)) {
    if (!computedFields.includes(key)) {
      rawResponses[key] = value;
    }
  }
  
  return rawResponses;
}

/**
 * Compute scores for a questionnaire response.
 * Returns the computed score fields to be merged with the database record.
 */
export function computeScores(
  code: string,
  responses: Record<string, any>
): Record<string, any> | null {
  const scoringFn = getScoringFunction(code);
  
  if (!scoringFn) {
    return null;
  }
  
  try {
    const result = scoringFn(responses);
    return result;
  } catch (error) {
    console.error(`Error computing scores for ${code}:`, error);
    return null;
  }
}

/**
 * Fields that scoring functions return but don't exist in database tables.
 * These will be filtered out before updating.
 */
const NON_DB_FIELDS = [
  'is_positive',      // ASRM, MDQ return this but it's not a DB column
  'severity',         // QIDS, MADRS, YMRS return this but it's not a DB column
  'level',            // EGF returns this but it's not a DB column
  'domain_scores',    // QIDS returns this nested object
  'risk_level_label', // Some suicide questionnaires return this
  'has_recent_ideation', // Suicide questionnaires
  'has_self_harm',    // Suicide questionnaires
  'has_interrupted_attempt', // Suicide questionnaires
  'has_aborted_attempt',     // Suicide questionnaires
  'has_preparations',        // Suicide questionnaires
  'total_attempt_count',     // Suicide questionnaires
  'risk_score',              // Mapped to total_score instead
  'dependence_level',        // Fagerstrom
  'q2_concurrent',    // MDQ returns this but it's not a DB column
  'q3_impact_level',  // MDQ returns this but it's not a DB column
];

/**
 * Map scoring result fields to database column names.
 * Some scoring functions return fields with different names than the database columns.
 */
export function mapScoringResultToDbColumns(
  code: string,
  scoringResult: Record<string, any>
): Record<string, any> {
  const normalizedCode = normalizeQuestionnaireCode(code);
  const mapped: Record<string, any> = { ...scoringResult };
  
  // Remove fields that don't exist in the database
  for (const field of NON_DB_FIELDS) {
    delete mapped[field];
  }
  
  // Handle specific field mappings per questionnaire
  switch (normalizedCode) {
    case 'SLEEP_APNEA':
      // Map stop_bang_score to total_score for DB
      if ('stop_bang_score' in mapped) {
        mapped.stop_bang_score = mapped.stop_bang_score;
      }
      break;
    case 'ISA_FOLLOWUP':
    case 'ISA_SUIVI':
    case 'SUICIDE_BEHAVIOR_FOLLOWUP':
      // Suicide follow-up: ensure generated/derived fields are not injected.
      // `risk_score` (if present in scoring output) is removed via NON_DB_FIELDS.
      break;
    case 'FAST':
      // FAST has all fields correctly mapped
      break;
  }
  
  return mapped;
}
