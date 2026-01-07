// eFondaMental Platform - TMT Scoring Service
// Implements French normative scoring for Trail Making Test

import {
  TMT_NORMS,
  TMT_AGE_GROUPS,
  TMT_EDUCATION_LEVELS,
  TmtNormCell
} from '@/lib/constants/tmt-norms';

// ============================================================================
// Types
// ============================================================================

export interface TmtRawData {
  patient_age: number;
  years_of_education: number;
  tmta_tps: number;
  tmta_err: number;
  tmta_cor?: number | null;
  tmtb_tps: number;
  tmtb_err: number;
  tmtb_cor?: number | null;
  tmtb_err_persev: number;
}

export interface TmtComputedScores {
  // Computed fields
  tmta_errtot?: number | null;
  tmtb_errtot?: number | null;
  tmt_b_a_tps?: number | null;
  tmt_b_a_err?: number | null;
  
  // Part A z-scores and percentiles
  tmta_tps_z?: number | null;
  tmta_tps_pc?: string | null;
  tmta_errtot_z?: number | null;
  tmta_errtot_pc?: string | null;
  
  // Part B z-scores and percentiles
  tmtb_tps_z?: number | null;
  tmtb_tps_pc?: string | null;
  tmtb_errtot_z?: number | null;
  tmtb_errtot_pc?: string | null;
  tmtb_err_persev_z?: number | null;
  tmtb_err_persev_pc?: string | null;
  
  // B-A difference z-scores and percentiles
  tmt_b_a_tps_z?: number | null;
  tmt_b_a_tps_pc?: string | null;
  tmt_b_a_err_z?: number | null;
  tmt_b_a_err_pc?: string | null;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Determine age group based on patient age
 * 0: < 40 years
 * 1: 40-59 years
 * 2: ≥ 60 years
 */
export function determineAgeGroup(age: number): 0 | 1 | 2 {
  if (age < 40) return 0;
  if (age < 60) return 1;
  return 2;
}

/**
 * Determine education level based on years of education
 * 0: < 6 years
 * 1: 6-11 years
 * 2: ≥ 12 years
 */
export function determineEducationLevel(years: number): 0 | 1 | 2 {
  if (years < 6) return 0;
  if (years < 12) return 1;
  return 2;
}

/**
 * Round a number to specified decimal places
 */
function roundTo(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Find the normative cell for given age group and education level
 */
function findNormCell(
  tables: TmtNormCell[],
  ageGroup: 0 | 1 | 2,
  educationLevel: 0 | 1 | 2
): TmtNormCell | null {
  return tables.find(
    (cell) => cell.age_group === ageGroup && cell.education_level === educationLevel
  ) || null;
}

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Calculate z-score using TMT inverted formula
 * Formula: Z = (Mean - RawScore) / SD
 * Note: LOWER raw scores (faster times, fewer errors) result in HIGHER z-scores (better performance)
 */
export function calculateTmtZScore(
  rawScore: number,
  mean: number,
  sd: number
): number {
  if (sd === 0) return 0;
  const zScore = (mean - rawScore) / sd;
  return roundTo(zScore, 2);
}

/**
 * Look up percentile for a raw score using threshold matching
 * Returns exact percentile, range [lower-upper], >95, or <5
 * 
 * For "lower is better" measures:
 * - If raw score < min threshold (best performance): return ">95"
 * - If raw score > max threshold (worst performance): return "<5"
 * - If raw score matches threshold exactly: return that percentile
 * - If raw score falls between thresholds: return range [lower-upper]
 */
export function lookupTmtPercentile(
  rawScore: number,
  thresholds: number[],
  percentiles: number[]
): string {
  // Check if below minimum threshold (best performance)
  if (rawScore < thresholds[0]) {
    return `> ${percentiles[0]}`;
  }
  
  // Check if above maximum threshold (worst performance)
  if (rawScore > thresholds[thresholds.length - 1]) {
    return `< ${percentiles[percentiles.length - 1]}`;
  }
  
  // Find all matching indices for exact scores (handling plateaus)
  const matches: number[] = [];
  for (let i = 0; i < thresholds.length; i++) {
    if (rawScore === thresholds[i]) {
      matches.push(i);
    }
  }

  if (matches.length > 0) {
    if (matches.length === 1) {
      return percentiles[matches[0]].toString();
    }
    // Return "> [lowest percentile]" for plateaus (e.g. "> 10")
    const lowestP = percentiles[matches[matches.length - 1]];
    return `> ${lowestP}`;
  }
  
  // Find range for values between thresholds
  for (let i = 0; i < thresholds.length; i++) {
    if (rawScore < thresholds[i]) {
      if (i > 0) {
        return `${percentiles[i]} - ${percentiles[i - 1]}`;
      }
      return `> ${percentiles[0]}`;
    }
  }
  
  return `< ${percentiles[percentiles.length - 1]}`;
}

/**
 * Calculate scores for a specific TMT measure
 */
function calculateMeasureScores(
  measureKey: string,
  rawScore: number,
  ageGroup: 0 | 1 | 2,
  educationLevel: 0 | 1 | 2,
  calculateZScore: boolean = true
): { z_score?: number | null; percentile?: string | null } {
  const norms = TMT_NORMS[measureKey];
  if (!norms) return {};
  
  const cell = findNormCell(norms.tables, ageGroup, educationLevel);
  if (!cell) return {};
  
  const result: { z_score?: number | null; percentile?: string | null } = {};
  
  // Calculate z-score if requested
  if (calculateZScore && norms.output_fields.z_score) {
    result.z_score = calculateTmtZScore(rawScore, cell.mean, cell.sd);
  }
  
  // Calculate percentile
  if (norms.output_fields.percentile) {
    result.percentile = lookupTmtPercentile(
      rawScore,
      cell.percentile_thresholds,
      cell.percentiles
    );
  }
  
  return result;
}

// ============================================================================
// Main Scoring Function
// ============================================================================

/**
 * Calculate all TMT scores based on raw data
 * Applies stratified norms based on age group and education level
 */
export function calculateTmtScores(rawData: TmtRawData): TmtComputedScores {
  const ageGroup = determineAgeGroup(rawData.patient_age);
  const educationLevel = determineEducationLevel(rawData.years_of_education);
  
  const scores: TmtComputedScores = {};
  
  // Calculate total errors
  const tmta_cor = rawData.tmta_cor ?? 0;
  const tmtb_cor = rawData.tmtb_cor ?? 0;
  
  scores.tmta_errtot = rawData.tmta_err + tmta_cor;
  scores.tmtb_errtot = rawData.tmtb_err + tmtb_cor;
  
  // Calculate B-A differences
  scores.tmt_b_a_tps = rawData.tmtb_tps - rawData.tmta_tps;
  scores.tmt_b_a_err = scores.tmtb_errtot - scores.tmta_errtot;
  
  // Part A - Time
  const tmta_temps_scores = calculateMeasureScores(
    'tmta_temps',
    rawData.tmta_tps,
    ageGroup,
    educationLevel
  );
  scores.tmta_tps_z = tmta_temps_scores.z_score;
  scores.tmta_tps_pc = tmta_temps_scores.percentile;
  
  // Part A - Total Errors
  const tmta_err_scores = calculateMeasureScores(
    'tmta_erreurs_totales',
    scores.tmta_errtot,
    ageGroup,
    educationLevel
  );
  scores.tmta_errtot_z = tmta_err_scores.z_score;
  scores.tmta_errtot_pc = tmta_err_scores.percentile;
  
  // Part B - Time
  const tmtb_temps_scores = calculateMeasureScores(
    'tmtb_temps',
    rawData.tmtb_tps,
    ageGroup,
    educationLevel
  );
  scores.tmtb_tps_z = tmtb_temps_scores.z_score;
  scores.tmtb_tps_pc = tmtb_temps_scores.percentile;
  
  // Part B - Total Errors
  const tmtb_err_scores = calculateMeasureScores(
    'tmtb_erreurs_totales',
    scores.tmtb_errtot,
    ageGroup,
    educationLevel
  );
  scores.tmtb_errtot_z = tmtb_err_scores.z_score;
  scores.tmtb_errtot_pc = tmtb_err_scores.percentile;
  
  // Part B - Perseverative Errors (both z-score and percentile)
  const tmtb_persev_scores = calculateMeasureScores(
    'tmtb_erreurs_perseveratives',
    rawData.tmtb_err_persev,
    ageGroup,
    educationLevel,
    true // Calculate z-score for perseverative errors
  );
  scores.tmtb_err_persev_z = tmtb_persev_scores.z_score;
  scores.tmtb_err_persev_pc = tmtb_persev_scores.percentile;
  
  // B-A - Time Difference
  const b_a_temps_scores = calculateMeasureScores(
    'tmt_b_a_temps',
    scores.tmt_b_a_tps,
    ageGroup,
    educationLevel
  );
  scores.tmt_b_a_tps_z = b_a_temps_scores.z_score;
  scores.tmt_b_a_tps_pc = b_a_temps_scores.percentile;
  
  // B-A - Error Difference
  const b_a_err_scores = calculateMeasureScores(
    'tmt_b_a_erreurs',
    scores.tmt_b_a_err,
    ageGroup,
    educationLevel
  );
  scores.tmt_b_a_err_z = b_a_err_scores.z_score;
  scores.tmt_b_a_err_pc = b_a_err_scores.percentile;
  
  return scores;
}
