// eFondaMental Platform - CVLT Scoring Service
// Implements French normative scoring for California Verbal Learning Test

import {
  CVLT_REGRESSION_NORMS,
  CVLT_PERCENTILE_NORMS,
  RegressionCoefficients,
  PercentileTable
} from '@/lib/constants/cvlt-norms';

// ============================================================================
// Types
// ============================================================================

export interface CvltRawData {
  patient_age: number;
  years_of_education: number;
  patient_sex: 'F' | 'M';
  trial_1: number;
  trial_2: number;
  trial_3: number;
  trial_4: number;
  trial_5: number;
  total_1_5?: number;
  list_b: number;
  sdfr: number;
  sdcr: number;
  ldfr: number;
  ldcr: number;
  semantic_clustering?: number | null;
  serial_clustering?: number | null;
  perseverations?: number | null;
  intrusions?: number | null;
  recognition_hits?: number | null;
  false_positives?: number | null;
  discriminability?: number | null;
  primacy?: number | null;
  recency?: number | null;
  response_bias?: number | null;
}

export interface CvltComputedScores {
  trial_1_std?: number | null;
  trial_5_std?: string | null;
  total_1_5_std?: number | null;
  list_b_std?: number | null;
  sdfr_std?: string | null;
  sdcr_std?: string | null;
  ldfr_std?: string | null;
  ldcr_std?: string | null;
  semantic_std?: string | null;
  serial_std?: string | null;
  persev_std?: string | null;
  intru_std?: string | null;
  recog_std?: string | null;
  false_recog_std?: string | null;
  discrim_std?: string | null;
  primacy_std?: number | null;
  recency_std?: number | null;
  bias_std?: number | null;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Determines age group based on age
 * Group 0: ≤ 39 years
 * Group 1: 40-69 years
 * Group 2: ≥ 70 years
 */
export function determineAgeGroup(age: number): 0 | 1 | 2 {
  if (age <= 39) return 0;
  if (age >= 70) return 2;
  return 1;
}

/**
 * Converts sex to numeric code for regression formulas
 * Female = 1, Male = 2
 */
export function convertSexToNumeric(sex: 'F' | 'M'): 1 | 2 {
  return sex === 'F' ? 1 : 2;
}

/**
 * Rounds a number to specified decimal places
 */
function roundTo(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// ============================================================================
// Regression Scoring Functions
// ============================================================================

/**
 * Generic regression z-score calculator
 * Formula: Z = (Raw - (β₀ + β₁×Education - β₂×Age - β₃×Sex)) / SD
 */
function calculateRegressionZScore(
  rawScore: number,
  coefficients: RegressionCoefficients,
  education: number,
  age: number,
  sexNumeric: number
): number {
  const predicted =
    coefficients.beta_0 +
    coefficients.beta_education * education -
    coefficients.beta_age * age -
    coefficients.beta_sex * sexNumeric;

  const zScore = (rawScore - predicted) / coefficients.sd;
  return roundTo(zScore, 2);
}

/**
 * Calculate Trial 1 standard score (all ages use regression)
 */
export function calculateTrial1Std(
  rawScore: number,
  ageGroup: 0 | 1 | 2,
  education: number,
  age: number,
  sexNumeric: number
): number | null {
  const norm = CVLT_REGRESSION_NORMS.cvlt_luna1std;
  const coeffs = norm.coefficients.find((c) => c.age_group === ageGroup);
  if (!coeffs) return null;

  return calculateRegressionZScore(rawScore, coeffs, education, age, sexNumeric);
}

/**
 * Calculate Trial 5 standard score (regression for age ≥70 only)
 */
export function calculateTrial5StdRegression(
  rawScore: number,
  education: number,
  age: number,
  sexNumeric: number
): number | null {
  const norm = CVLT_REGRESSION_NORMS.cvlt_luna5std;
  const coeffs = norm.coefficients.find((c) => c.age_group === 2);
  if (!coeffs) return null;

  return calculateRegressionZScore(rawScore, coeffs, education, age, sexNumeric);
}

/**
 * Calculate Trials 1-5 Total standard score (all ages use regression)
 */
export function calculateTrials15TotalStd(
  rawScore: number,
  ageGroup: 0 | 1 | 2,
  education: number,
  age: number,
  sexNumeric: number
): number | null {
  const norm = CVLT_REGRESSION_NORMS.cvlt_luna15tot_std;
  const coeffs = norm.coefficients.find((c) => c.age_group === ageGroup);
  if (!coeffs) return null;

  return calculateRegressionZScore(rawScore, coeffs, education, age, sexNumeric);
}

/**
 * Calculate List B standard score (all ages use regression)
 */
export function calculateListBStd(
  rawScore: number,
  ageGroup: 0 | 1 | 2,
  education: number,
  age: number,
  sexNumeric: number
): number | null {
  const norm = CVLT_REGRESSION_NORMS.cvlt_lunbstd;
  const coeffs = norm.coefficients.find((c) => c.age_group === ageGroup);
  if (!coeffs) return null;

  return calculateRegressionZScore(rawScore, coeffs, education, age, sexNumeric);
}

/**
 * Calculate SDFR standard score (regression for ages 40+)
 */
export function calculateSDFRStdRegression(
  rawScore: number,
  ageGroup: 1 | 2,
  education: number,
  age: number,
  sexNumeric: number
): number | null {
  const norm = CVLT_REGRESSION_NORMS.cvlt_rlctstd;
  const coeffs = norm.coefficients.find((c) => c.age_group === ageGroup);
  if (!coeffs) return null;

  return calculateRegressionZScore(rawScore, coeffs, education, age, sexNumeric);
}

/**
 * Calculate SDCR standard score (regression for ages 40+)
 */
export function calculateSDCRStdRegression(
  rawScore: number,
  ageGroup: 1 | 2,
  education: number,
  age: number,
  sexNumeric: number
): number | null {
  const norm = CVLT_REGRESSION_NORMS.cvlt_rictstd;
  const coeffs = norm.coefficients.find((c) => c.age_group === ageGroup);
  if (!coeffs) return null;

  return calculateRegressionZScore(rawScore, coeffs, education, age, sexNumeric);
}

/**
 * Calculate LDFR standard score (regression for ages 40+)
 */
export function calculateLDFRStdRegression(
  rawScore: number,
  ageGroup: 1 | 2,
  education: number,
  age: number,
  sexNumeric: number
): number | null {
  const norm = CVLT_REGRESSION_NORMS.cvlt_rllt_std;
  const coeffs = norm.coefficients.find((c) => c.age_group === ageGroup);
  if (!coeffs) return null;

  return calculateRegressionZScore(rawScore, coeffs, education, age, sexNumeric);
}

/**
 * Calculate LDCR standard score (regression for ages 40+)
 */
export function calculateLDCRStdRegression(
  rawScore: number,
  ageGroup: 1 | 2,
  education: number,
  age: number,
  sexNumeric: number
): number | null {
  const norm = CVLT_REGRESSION_NORMS.cvlt_rilt_std;
  const coeffs = norm.coefficients.find((c) => c.age_group === ageGroup);
  if (!coeffs) return null;

  return calculateRegressionZScore(rawScore, coeffs, education, age, sexNumeric);
}

/**
 * Calculate Semantic Clustering standard score (regression for ages ≤39 and ≥70)
 */
export function calculateSemanticStdRegression(
  rawScore: number,
  ageGroup: 0 | 2,
  education: number,
  age: number,
  sexNumeric: number
): number | null {
  const norm = CVLT_REGRESSION_NORMS.cvlt_sem_std;
  const coeffs = norm.coefficients.find((c) => c.age_group === ageGroup);
  if (!coeffs) return null;

  return calculateRegressionZScore(rawScore, coeffs, education, age, sexNumeric);
}

/**
 * Calculate Primacy standard score (all ages use regression)
 */
export function calculatePrimacyStd(
  rawScore: number,
  ageGroup: 0 | 1 | 2,
  education: number,
  age: number,
  sexNumeric: number
): number | null {
  const norm = CVLT_REGRESSION_NORMS.cvlt_prim_std;
  const coeffs = norm.coefficients.find((c) => c.age_group === ageGroup);
  if (!coeffs) return null;

  return calculateRegressionZScore(rawScore, coeffs, education, age, sexNumeric);
}

/**
 * Calculate Recency standard score (all ages use regression)
 */
export function calculateRecencyStd(
  rawScore: number,
  ageGroup: 0 | 1 | 2,
  education: number,
  age: number,
  sexNumeric: number
): number | null {
  const norm = CVLT_REGRESSION_NORMS.cvlt_rec_std;
  const coeffs = norm.coefficients.find((c) => c.age_group === ageGroup);
  if (!coeffs) return null;

  return calculateRegressionZScore(rawScore, coeffs, education, age, sexNumeric);
}

/**
 * Calculate Response Bias standard score (all ages use regression)
 */
export function calculateBiasStd(
  rawScore: number,
  ageGroup: 0 | 1 | 2,
  education: number,
  age: number,
  sexNumeric: number
): number | null {
  const norm = CVLT_REGRESSION_NORMS.cvlt_biais_std;
  const coeffs = norm.coefficients.find((c) => c.age_group === ageGroup);
  if (!coeffs) return null;

  return calculateRegressionZScore(rawScore, coeffs, education, age, sexNumeric);
}

// ============================================================================
// Percentile Scoring Functions
// ============================================================================

/**
 * Generic percentile lookup function
 * Returns exact percentile or range string (e.g., "25 - 50", "<1", ">99")
 */
function lookupPercentile(
  rawScore: number,
  table: PercentileTable,
  direction: 'higher_is_better' | 'lower_is_better'
): string {
  const { thresholds, percentiles } = table;
  const isAscending = thresholds[0] < thresholds[thresholds.length - 1];

  if (direction === 'higher_is_better') {
    // Determine min/max thresholds
    const minThreshold = isAscending ? thresholds[0] : thresholds[thresholds.length - 1];
    const maxThreshold = isAscending ? thresholds[thresholds.length - 1] : thresholds[0];
    const minPercentile = isAscending ? percentiles[0] : percentiles[percentiles.length - 1];
    const maxPercentile = isAscending ? percentiles[percentiles.length - 1] : percentiles[0];

    // Check boundaries
    if (rawScore < minThreshold) return `< ${minPercentile}`;
    if (rawScore > maxThreshold) return `> ${maxPercentile}`;

    // Find interval (iterate from best to worst to find the first threshold met)
    if (isAscending) {
      for (let i = thresholds.length - 1; i >= 0; i--) {
        if (rawScore >= thresholds[i]) {
          if (rawScore === thresholds[i]) return percentiles[i].toString();
          // Between thresholds[i] and thresholds[i+1]
          if (i < thresholds.length - 1) {
            return `${percentiles[i]} - ${percentiles[i + 1]}`;
          }
          return `> ${percentiles[i]}`;
        }
      }
    } else {
      // Descending
      for (let i = 0; i < thresholds.length; i++) {
        if (rawScore >= thresholds[i]) {
          if (rawScore === thresholds[i]) return percentiles[i].toString();
          if (i > 0) return `${percentiles[i]} - ${percentiles[i - 1]}`;
          return `> ${percentiles[0]}`;
        }
      }
    }
  } else {
    // lower_is_better (e.g., Errors)
    const minThreshold = isAscending ? thresholds[0] : thresholds[thresholds.length - 1];
    const maxThreshold = isAscending ? thresholds[thresholds.length - 1] : thresholds[0];
    const bestPercentile = isAscending ? percentiles[0] : percentiles[percentiles.length - 1];
    const worstPercentile = isAscending ? percentiles[percentiles.length - 1] : percentiles[0];

    if (rawScore <= minThreshold) {
      return rawScore === minThreshold ? bestPercentile.toString() : `> ${bestPercentile}`;
    }
    if (rawScore >= maxThreshold) {
      return rawScore === maxThreshold ? worstPercentile.toString() : `< ${worstPercentile}`;
    }

    if (isAscending) {
      for (let i = 0; i < thresholds.length; i++) {
        if (rawScore <= thresholds[i]) {
          if (rawScore === thresholds[i]) return percentiles[i].toString();
          if (i > 0) return `${percentiles[i]} - ${percentiles[i - 1]}`;
          return `> ${percentiles[0]}`;
        }
      }
    } else {
      // Descending
      for (let i = thresholds.length - 1; i >= 0; i--) {
        if (rawScore <= thresholds[i]) {
          if (rawScore === thresholds[i]) return percentiles[i].toString();
          if (i < thresholds.length - 1) return `${percentiles[i]} - ${percentiles[i + 1]}`;
          return `> ${percentiles[i]}`;
        }
      }
    }
  }

  return '-';
}

/**
 * Calculate Trial 5 percentile (for ages <70)
 */
export function calculateTrial5Percentile(
  rawScore: number,
  ageGroup: 0 | 1
): string | null {
  const norm = CVLT_PERCENTILE_NORMS.cvlt_luna5std;
  const table = norm.tables.find((t) => t.age_group === ageGroup);
  if (!table) return null;

  return lookupPercentile(rawScore, table, norm.direction);
}

/**
 * Calculate SDFR percentile (for age <40)
 */
export function calculateSDFRPercentile(rawScore: number): string | null {
  const norm = CVLT_PERCENTILE_NORMS.cvlt_rlctstd;
  const table = norm.tables.find((t) => t.age_group === 0);
  if (!table) return null;

  return lookupPercentile(rawScore, table, norm.direction);
}

/**
 * Calculate SDCR percentile (for age <40)
 */
export function calculateSDCRPercentile(rawScore: number): string | null {
  const norm = CVLT_PERCENTILE_NORMS.cvlt_rictstd;
  const table = norm.tables.find((t) => t.age_group === 0);
  if (!table) return null;

  return lookupPercentile(rawScore, table, norm.direction);
}

/**
 * Calculate LDFR percentile (for age <40)
 */
export function calculateLDFRPercentile(rawScore: number): string | null {
  const norm = CVLT_PERCENTILE_NORMS.cvlt_rllt_std;
  const table = norm.tables.find((t) => t.age_group === 0);
  if (!table) return null;

  return lookupPercentile(rawScore, table, norm.direction);
}

/**
 * Calculate LDCR percentile (for age <40)
 */
export function calculateLDCRPercentile(rawScore: number): string | null {
  const norm = CVLT_PERCENTILE_NORMS.cvlt_rilt_std;
  const table = norm.tables.find((t) => t.age_group === 0);
  if (!table) return null;

  return lookupPercentile(rawScore, table, norm.direction);
}

/**
 * Calculate Semantic Clustering percentile (for age 40-69)
 */
export function calculateSemanticPercentile(rawScore: number): string | null {
  const norm = CVLT_PERCENTILE_NORMS.cvlt_sem_std;
  const table = norm.tables.find((t) => t.age_group === 1);
  if (!table) return null;

  return lookupPercentile(rawScore, table, norm.direction);
}

/**
 * Calculate Serial Clustering percentile (all ages)
 */
export function calculateSerialStd(
  rawScore: number,
  ageGroup: 0 | 1 | 2
): string | null {
  const norm = CVLT_PERCENTILE_NORMS.cvlt_ser_std;
  const table = norm.tables.find((t) => t.age_group === ageGroup);
  if (!table) return null;

  return lookupPercentile(rawScore, table, norm.direction);
}

/**
 * Calculate Perseverations percentile (all ages)
 */
export function calculatePerseverationsStd(
  rawScore: number,
  ageGroup: 0 | 1 | 2
): string | null {
  const norm = CVLT_PERCENTILE_NORMS.cvlt_persev_std;
  const table = norm.tables.find((t) => t.age_group === ageGroup);
  if (!table) return null;

  return lookupPercentile(rawScore, table, norm.direction);
}

/**
 * Calculate Intrusions percentile (all ages)
 */
export function calculateIntrusionsStd(
  rawScore: number,
  ageGroup: 0 | 1 | 2
): string | null {
  const norm = CVLT_PERCENTILE_NORMS.cvlt_intru_std;
  const table = norm.tables.find((t) => t.age_group === ageGroup);
  if (!table) return null;

  return lookupPercentile(rawScore, table, norm.direction);
}

/**
 * Calculate Recognition Hits percentile (all ages)
 */
export function calculateRecognitionStd(
  rawScore: number,
  ageGroup: 0 | 1 | 2
): string | null {
  const norm = CVLT_PERCENTILE_NORMS.cvlt_reconn_std;
  const table = norm.tables.find((t) => t.age_group === ageGroup);
  if (!table) return null;

  return lookupPercentile(rawScore, table, norm.direction);
}

/**
 * Calculate False Positives percentile (all ages)
 */
export function calculateFalsePositivesStd(
  rawScore: number,
  ageGroup: 0 | 1 | 2
): string | null {
  const norm = CVLT_PERCENTILE_NORMS.cvlt_fauss_reconn_std;
  const table = norm.tables.find((t) => t.age_group === ageGroup);
  if (!table) return null;

  return lookupPercentile(rawScore, table, norm.direction);
}

/**
 * Calculate Discriminability percentile (all ages)
 * Special rule: If raw score = 100, return "99"
 */
export function calculateDiscriminabilityStd(
  rawScore: number,
  ageGroup: 0 | 1 | 2
): string | null {
  // Special rule: 100% discriminability = 99th percentile
  if (rawScore === 100) {
    return '99';
  }

  const norm = CVLT_PERCENTILE_NORMS.cvlt_discrim_std;
  const table = norm.tables.find((t) => t.age_group === ageGroup);
  if (!table) return null;

  return lookupPercentile(rawScore, table, norm.direction);
}

// ============================================================================
// Main Scoring Function
// ============================================================================

/**
 * Calculate all CVLT standard scores based on raw data
 * Applies appropriate regression or percentile methods based on age group
 */
export function calculateCvltScores(rawData: CvltRawData): CvltComputedScores {
  const ageGroup = determineAgeGroup(rawData.patient_age);
  const sexNumeric = convertSexToNumeric(rawData.patient_sex);
  const scores: CvltComputedScores = {};

  // Trial 1 (always regression)
  scores.trial_1_std = calculateTrial1Std(
    rawData.trial_1,
    ageGroup,
    rawData.years_of_education,
    rawData.patient_age,
    sexNumeric
  );

  // Trial 5 (regression for ≥70, percentile for <70)
  if (ageGroup === 2) {
    const zScore = calculateTrial5StdRegression(
      rawData.trial_5,
      rawData.years_of_education,
      rawData.patient_age,
      sexNumeric
    );
    scores.trial_5_std = zScore !== null ? zScore.toString() : null;
  } else {
    scores.trial_5_std = calculateTrial5Percentile(rawData.trial_5, ageGroup as 0 | 1);
  }

  // Trials 1-5 Total (always regression)
  const total15 = rawData.total_1_5 ?? 
    rawData.trial_1 + rawData.trial_2 + rawData.trial_3 + rawData.trial_4 + rawData.trial_5;
  scores.total_1_5_std = calculateTrials15TotalStd(
    total15,
    ageGroup,
    rawData.years_of_education,
    rawData.patient_age,
    sexNumeric
  );

  // List B (always regression)
  scores.list_b_std = calculateListBStd(
    rawData.list_b,
    ageGroup,
    rawData.years_of_education,
    rawData.patient_age,
    sexNumeric
  );

  // SDFR (regression for ≥40, percentile for <40)
  if (ageGroup === 0) {
    scores.sdfr_std = calculateSDFRPercentile(rawData.sdfr);
  } else {
    const zScore = calculateSDFRStdRegression(
      rawData.sdfr,
      ageGroup as 1 | 2,
      rawData.years_of_education,
      rawData.patient_age,
      sexNumeric
    );
    scores.sdfr_std = zScore !== null ? zScore.toString() : null;
  }

  // SDCR (regression for ≥40, percentile for <40)
  if (ageGroup === 0) {
    scores.sdcr_std = calculateSDCRPercentile(rawData.sdcr);
  } else {
    const zScore = calculateSDCRStdRegression(
      rawData.sdcr,
      ageGroup as 1 | 2,
      rawData.years_of_education,
      rawData.patient_age,
      sexNumeric
    );
    scores.sdcr_std = zScore !== null ? zScore.toString() : null;
  }

  // LDFR (regression for ≥40, percentile for <40)
  if (ageGroup === 0) {
    scores.ldfr_std = calculateLDFRPercentile(rawData.ldfr);
  } else {
    const zScore = calculateLDFRStdRegression(
      rawData.ldfr,
      ageGroup as 1 | 2,
      rawData.years_of_education,
      rawData.patient_age,
      sexNumeric
    );
    scores.ldfr_std = zScore !== null ? zScore.toString() : null;
  }

  // LDCR (regression for ≥40, percentile for <40)
  if (ageGroup === 0) {
    scores.ldcr_std = calculateLDCRPercentile(rawData.ldcr);
  } else {
    const zScore = calculateLDCRStdRegression(
      rawData.ldcr,
      ageGroup as 1 | 2,
      rawData.years_of_education,
      rawData.patient_age,
      sexNumeric
    );
    scores.ldcr_std = zScore !== null ? zScore.toString() : null;
  }

  // Semantic Clustering (regression for ≤39 and ≥70, percentile for 40-69)
  if (rawData.semantic_clustering !== null && rawData.semantic_clustering !== undefined) {
    if (ageGroup === 1) {
      scores.semantic_std = calculateSemanticPercentile(rawData.semantic_clustering);
    } else {
      const zScore = calculateSemanticStdRegression(
        rawData.semantic_clustering,
        ageGroup as 0 | 2,
        rawData.years_of_education,
        rawData.patient_age,
        sexNumeric
      );
      scores.semantic_std = zScore !== null ? zScore.toString() : null;
    }
  }

  // Serial Clustering (always percentile)
  if (rawData.serial_clustering !== null && rawData.serial_clustering !== undefined) {
    scores.serial_std = calculateSerialStd(rawData.serial_clustering, ageGroup);
  }

  // Perseverations (always percentile)
  if (rawData.perseverations !== null && rawData.perseverations !== undefined) {
    scores.persev_std = calculatePerseverationsStd(rawData.perseverations, ageGroup);
  }

  // Intrusions (always percentile)
  if (rawData.intrusions !== null && rawData.intrusions !== undefined) {
    scores.intru_std = calculateIntrusionsStd(rawData.intrusions, ageGroup);
  }

  // Recognition Hits (always percentile)
  if (rawData.recognition_hits !== null && rawData.recognition_hits !== undefined) {
    scores.recog_std = calculateRecognitionStd(rawData.recognition_hits, ageGroup);
  }

  // False Positives (always percentile)
  if (rawData.false_positives !== null && rawData.false_positives !== undefined) {
    scores.false_recog_std = calculateFalsePositivesStd(rawData.false_positives, ageGroup);
  }

  // Discriminability (always percentile, with special rule for 100)
  if (rawData.discriminability !== null && rawData.discriminability !== undefined) {
    scores.discrim_std = calculateDiscriminabilityStd(rawData.discriminability, ageGroup);
  }

  // Primacy (always regression)
  if (rawData.primacy !== null && rawData.primacy !== undefined) {
    scores.primacy_std = calculatePrimacyStd(
      rawData.primacy,
      ageGroup,
      rawData.years_of_education,
      rawData.patient_age,
      sexNumeric
    );
  }

  // Recency (always regression)
  if (rawData.recency !== null && rawData.recency !== undefined) {
    scores.recency_std = calculateRecencyStd(
      rawData.recency,
      ageGroup,
      rawData.years_of_education,
      rawData.patient_age,
      sexNumeric
    );
  }

  // Response Bias (always regression)
  if (rawData.response_bias !== null && rawData.response_bias !== undefined) {
    scores.bias_std = calculateBiasStd(
      rawData.response_bias,
      ageGroup,
      rawData.years_of_education,
      rawData.patient_age,
      sexNumeric
    );
  }

  return scores;
}
