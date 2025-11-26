// eFondaMental Platform - CVLT Scoring Algorithms
// Based on French normative data (Deweer et al., 2008)
// Translated from psy_neuropsychologie_california_bp.js

/**
 * Age groups for CVLT scoring:
 * - 0: age < 40
 * - 1: 40 <= age < 70
 * - 2: age >= 70
 */
function getAgeGroup(age: number): number {
  if (age < 40) return 0;
  if (age < 70) return 1;
  return 2;
}

/**
 * Sex code for regression formulas
 * F = 1, M = 2
 */
function getSexCode(sex: 'F' | 'M'): number {
  return sex === 'F' ? 1 : 2;
}

// ============================================================================
// Regression Tables
// ============================================================================

// Trial 1 (Luna1) - Z-score calculation
// Format: [intercept, education_coef, age_coef, sex_coef, sd]
const TAB_TRIAL_1 = [
  [6.87, 0.09, 0, 0, 1.83],      // age < 40
  [8.37, 0.19, 0.07, 0, 1.88],   // 40-69
  [12.85, 0.08, 0.11, 0, 1.85]   // >= 70
];

// List B - Z-score calculation
const TAB_LIST_B = [
  [6.89, 0.08, 0, 0, 2.45],      // age < 40
  [5.11, 0.10, 0, 0, 2.05],      // 40-69
  [17.20, 0.16, 0.16, 0.76, 1.96] // >= 70
];

// Total 1-5 - Z-score calculation
const TAB_TOTAL_1_5 = [
  [58.45, 0.62, 0.13, 1.75, 6.83],  // age < 40
  [53.39, 1.34, 0.24, 1.91, 8.58],  // 40-69
  [101.86, 0.88, 2.19, 0.82, 8.61]  // >= 70 (Note: coeffs order differs in original)
];

// SDFR (Short Delay Free Recall) - for ages 40+
// Format for age 40+: [intercept, education_coef, age_coef, sex_coef, sd]
const TAB_SDFR = [
  [11.63, 0.36, 0.08, 0.48, 2.58], // 40-69
  [20.56, 0.25, 0.19, 0, 3.13]     // >= 70
];

// SDCR (Short Delay Cued Recall) - for ages 40+
const TAB_SDCR = [
  [10.82, 0.28, 0.04, 0, 2.16],    // 40-69
  [19.81, 0.21, 0.16, 0, 2.62]     // >= 70
];

// LDFR (Long Delay Free Recall) - for ages 40+
const TAB_LDFR = [
  [11.80, 0.37, 0.07, 0.44, 2.43], // 40-69
  [20.47, 0.13, 0.17, 0, 3.23]     // >= 70
];

// LDCR (Long Delay Cued Recall) - for ages 40+
const TAB_LDCR = [
  [11.21, 0.33, 0.04, 0.44, 2.15], // 40-69
  [20.17, 0.16, 0.15, 0, 2.63]     // >= 70
];

// Semantic Clustering - Z-score (for ages < 40 and >= 70)
const TAB_SEMANTIC = [
  [1.78, 0, -0.02, 0, 0.83],       // age < 40
  [0, 0, 0, 0, 0],                  // 40-69 (uses centiles instead)
  [4.21, 0.08, 0.04, 0, 0.73]      // >= 70
];

// Primacy - Z-score
const TAB_PRIMACY = [
  [29.94, -0.14, -0.08, 1.96, 3.37], // age < 40
  [27.95, -0.23, -0.05, 0, 4.26],    // 40-69
  [6.19, 0, -0.29, 0, 6.57]          // >= 70
];

// Recency - Z-score
const TAB_RECENCY = [
  [25.48, -0.21, 0, -1.71, 3.88],    // age < 40
  [29.45, 0, 0, 0, 5.10],            // 40-69 (simplified)
  [39.31, 0, -0.17, 0, 7.17]         // >= 70
];

// Response Bias - Z-score
const TAB_BIAS = [
  [-0.03, 0, 0, 0, 0.17],           // age < 40
  [-0.50, 0.01, -0.01, 0, 0.30],    // 40-69
  [-0.15, 0, 0, 0.10, 0.41]         // >= 70
];

// ============================================================================
// Centile Tables
// ============================================================================

// Trial 5 - Centile lookup (for ages < 70)
// Format: [score thresholds for centiles 99, 95, 75, 50, 25, 5, 1]
const TAB_TRIAL_5_CENTILE = [
  [16, 16, 16, 14.5, 13, 10, 8],    // age < 40
  [16, 16, 14, 12.5, 11, 8, 6]      // 40-69
];
const CENTILES = [99, 95, 75, 50, 25, 5, 1];

// SDFR - Centile lookup (for age < 40)
const TAB_SDFR_CENTILE = [16, 16, 15, 13, 11, 8, 6];

// SDCR - Centile lookup (for age < 40)
const TAB_SDCR_CENTILE = [16, 16, 15, 14, 12, 9, 7];

// LDFR - Centile lookup (for age < 40)
const TAB_LDFR_CENTILE = [16, 16, 15, 13.5, 11, 9, 7];

// LDCR - Centile lookup (for age < 40)
const TAB_LDCR_CENTILE = [16, 16, 15, 14, 12, 10, 8];

// Semantic Clustering - Centile lookup (for 40-69)
const TAB_SEMANTIC_CENTILE = [4, 3.7, 3, 2.3, 1.6, 0.9, 0.4];

// Serial Clustering - Centile lookup (higher score = worse)
const TAB_SERIAL = [
  [0, 0, 1, 2, 3, 8, 12],          // age < 40
  [0, 0, 0, 1.2, 2.1, 4.4, 5.3],   // 40-69
  [0, 0, 1, 2, 3, 5, 6]            // >= 70
];

// Perseverations - Centile lookup (higher score = worse)
const TAB_PERSEVERATIONS = [
  [0, 0, 1, 3, 5, 10, 15],         // age < 40
  [0, 0, 1, 3, 6, 11, 14],         // 40-69
  [0, 0, 1, 2.5, 6, 11, 15]        // >= 70
];

// Intrusions - Centile lookup (higher score = worse)
const TAB_INTRUSIONS = [
  [0, 0, 0, 2, 5, 11, 14],         // age < 40
  [0, 0, 1, 2, 6, 13, 15],         // 40-69
  [0, 0, 2, 4.5, 9, 16, 21]        // >= 70
];

// Recognition Hits - Centile lookup (higher score = better)
const TAB_RECOGNITION = [
  [16, 16, 16, 15.5, 15, 13, 12],  // age < 40
  [16, 16, 16, 15, 14, 11, 9],     // 40-69
  [16, 16, 15, 14, 13, 9, 7]       // >= 70
];

// False Recognition - Centile lookup (higher score = worse)
const TAB_FALSE_RECOG = [
  [0, 0, 0, 0, 0, 2, 3],           // age < 40
  [0, 0, 0, 0, 1, 4, 6],           // 40-69
  [0, 0, 0, 1.5, 3, 7, 14]         // >= 70
];

// Discriminability - Centile lookup (higher score = better)
const TAB_DISCRIMINABILITY = [
  [90, 92, 96, 99, 100, 100, 100], // age < 40
  [79, 84, 91, 95, 99, 100, 100],  // 40-69
  [65, 75, 85, 92, 96, 99, 100]    // >= 70
];

// ============================================================================
// Calculation Functions
// ============================================================================

/**
 * Calculate Z-score using regression formula
 * Formula: (rawScore - (intercept + edu*eduCoef - age*ageCoef - sex*sexCoef)) / sd
 */
function calculateZScore(
  rawScore: number,
  table: number[],
  age: number,
  education: number,
  sexCode: number
): number {
  const [intercept, eduCoef, ageCoef, sexCoef, sd] = table;
  const expected = intercept + (eduCoef * education) - (ageCoef * age) - (sexCoef * sexCode);
  const zScore = (rawScore - expected) / sd;
  return Math.round(zScore * 100) / 100;
}

/**
 * Calculate centile from lookup table (higher score = better)
 * Returns centile value or range string
 */
function calculateCentileHigherBetter(rawScore: number, table: number[]): string {
  let k = 0;
  while (k < table.length - 1 && rawScore < table[k]) {
    k++;
  }
  
  if (rawScore === table[k] || k === 0) {
    return String(CENTILES[k]);
  } else if (rawScore < table[k]) {
    return `<${CENTILES[k]}`;
  } else {
    return `${CENTILES[k]} - ${CENTILES[k - 1]}`;
  }
}

/**
 * Calculate centile from lookup table (higher score = worse)
 * Returns centile value or range string
 */
function calculateCentileHigherWorse(rawScore: number, table: number[]): string {
  let k = 0;
  while (k < table.length - 1 && rawScore > table[k]) {
    k++;
  }
  
  if (rawScore === table[k] || k === 0) {
    return String(CENTILES[k]);
  } else if (rawScore > table[k - 1] && k >= table.length - 1) {
    return `<${CENTILES[k - 1]}`;
  } else {
    return `${CENTILES[k]} - ${CENTILES[k - 1]}`;
  }
}

// ============================================================================
// Public Scoring Functions
// ============================================================================

export interface CvltScores {
  trial_1_std: number | null;
  trial_5_std: string | null;
  total_1_5_std: number | null;
  list_b_std: number | null;
  sdfr_std: string | null;
  sdcr_std: string | null;
  ldfr_std: string | null;
  ldcr_std: string | null;
  semantic_std: string | null;
  serial_std: string | null;
  persev_std: string | null;
  intru_std: string | null;
  recog_std: string | null;
  false_recog_std: string | null;
  discrim_std: string | null;
  primacy_std: number | null;
  recency_std: number | null;
  bias_std: number | null;
}

export interface CvltInput {
  patient_age: number;
  years_of_education: number;
  patient_sex: 'F' | 'M';
  trial_1: number;
  trial_2: number;
  trial_3: number;
  trial_4: number;
  trial_5: number;
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

/**
 * Calculate all CVLT scores
 */
export function calculateCvltScores(input: CvltInput): CvltScores {
  const age = input.patient_age;
  const education = input.years_of_education;
  const sexCode = getSexCode(input.patient_sex);
  const ageGroup = getAgeGroup(age);
  
  const scores: CvltScores = {
    trial_1_std: null,
    trial_5_std: null,
    total_1_5_std: null,
    list_b_std: null,
    sdfr_std: null,
    sdcr_std: null,
    ldfr_std: null,
    ldcr_std: null,
    semantic_std: null,
    serial_std: null,
    persev_std: null,
    intru_std: null,
    recog_std: null,
    false_recog_std: null,
    discrim_std: null,
    primacy_std: null,
    recency_std: null,
    bias_std: null
  };
  
  // Trial 1 - Z-score
  scores.trial_1_std = calculateZScore(input.trial_1, TAB_TRIAL_1[ageGroup], age, education, sexCode);
  
  // Trial 5 - Centile (< 70) or Z-score (>= 70)
  if (ageGroup === 2) {
    // Age >= 70: Use regression formula
    // Formula from JS: ((score) - ((22.18+(0.25*education)-(0.16*age)-(0.85*sexCode))))/2.11
    const expected = 22.18 + (0.25 * education) - (0.16 * age) - (0.85 * sexCode);
    const zScore = (input.trial_5 - expected) / 2.11;
    scores.trial_5_std = String(Math.round(zScore * 100) / 100);
  } else {
    scores.trial_5_std = calculateCentileHigherBetter(input.trial_5, TAB_TRIAL_5_CENTILE[ageGroup]);
  }
  
  // Total 1-5 - Z-score
  const total15 = input.trial_1 + input.trial_2 + input.trial_3 + input.trial_4 + input.trial_5;
  scores.total_1_5_std = calculateZScore(total15, TAB_TOTAL_1_5[ageGroup], age, education, sexCode);
  
  // List B - Z-score
  scores.list_b_std = calculateZScore(input.list_b, TAB_LIST_B[ageGroup], age, education, sexCode);
  
  // SDFR - Centile (< 40) or Z-score (>= 40)
  if (ageGroup === 0) {
    scores.sdfr_std = calculateCentileHigherBetter(input.sdfr, TAB_SDFR_CENTILE);
  } else {
    scores.sdfr_std = String(calculateZScore(input.sdfr, TAB_SDFR[ageGroup - 1], age, education, sexCode));
  }
  
  // SDCR - Centile (< 40) or Z-score (>= 40)
  if (ageGroup === 0) {
    scores.sdcr_std = calculateCentileHigherBetter(input.sdcr, TAB_SDCR_CENTILE);
  } else {
    scores.sdcr_std = String(calculateZScore(input.sdcr, TAB_SDCR[ageGroup - 1], age, education, sexCode));
  }
  
  // LDFR - Centile (< 40) or Z-score (>= 40)
  if (ageGroup === 0) {
    scores.ldfr_std = calculateCentileHigherBetter(input.ldfr, TAB_LDFR_CENTILE);
  } else {
    scores.ldfr_std = String(calculateZScore(input.ldfr, TAB_LDFR[ageGroup - 1], age, education, sexCode));
  }
  
  // LDCR - Centile (< 40) or Z-score (>= 40)
  if (ageGroup === 0) {
    scores.ldcr_std = calculateCentileHigherBetter(input.ldcr, TAB_LDCR_CENTILE);
  } else {
    scores.ldcr_std = String(calculateZScore(input.ldcr, TAB_LDCR[ageGroup - 1], age, education, sexCode));
  }
  
  // Semantic Clustering (optional)
  if (input.semantic_clustering !== undefined && input.semantic_clustering !== null) {
    if (ageGroup === 1) {
      // 40-69: Centile
      scores.semantic_std = calculateCentileHigherBetter(input.semantic_clustering, TAB_SEMANTIC_CENTILE);
    } else {
      // < 40 or >= 70: Z-score
      scores.semantic_std = String(calculateZScore(input.semantic_clustering, TAB_SEMANTIC[ageGroup], age, education, sexCode));
    }
  }
  
  // Serial Clustering (optional) - Centile only
  if (input.serial_clustering !== undefined && input.serial_clustering !== null) {
    scores.serial_std = calculateCentileHigherWorse(input.serial_clustering, TAB_SERIAL[ageGroup]);
  }
  
  // Perseverations (optional) - Centile only
  if (input.perseverations !== undefined && input.perseverations !== null) {
    scores.persev_std = calculateCentileHigherWorse(input.perseverations, TAB_PERSEVERATIONS[ageGroup]);
  }
  
  // Intrusions (optional) - Centile only
  if (input.intrusions !== undefined && input.intrusions !== null) {
    scores.intru_std = calculateCentileHigherWorse(input.intrusions, TAB_INTRUSIONS[ageGroup]);
  }
  
  // Recognition Hits (optional) - Centile only
  if (input.recognition_hits !== undefined && input.recognition_hits !== null) {
    scores.recog_std = calculateCentileHigherBetter(input.recognition_hits, TAB_RECOGNITION[ageGroup]);
  }
  
  // False Positives (optional) - Centile only
  if (input.false_positives !== undefined && input.false_positives !== null) {
    scores.false_recog_std = calculateCentileHigherWorse(input.false_positives, TAB_FALSE_RECOG[ageGroup]);
  }
  
  // Discriminability (optional) - Centile only
  if (input.discriminability !== undefined && input.discriminability !== null) {
    let discrim = input.discriminability;
    // Special case: 100% = centile 99
    if (discrim === 100) {
      scores.discrim_std = "99";
    } else {
      // Discriminability uses "higher is better" but the lookup is structured differently
      let k = 0;
      while (k < TAB_DISCRIMINABILITY[ageGroup].length - 1 && discrim > TAB_DISCRIMINABILITY[ageGroup][k]) {
        k++;
      }
      if (discrim === TAB_DISCRIMINABILITY[ageGroup][k]) {
        scores.discrim_std = String(CENTILES[k]);
      } else if (discrim < TAB_DISCRIMINABILITY[ageGroup][k] && k === 0) {
        scores.discrim_std = `<${CENTILES[k]}`;
      } else {
        scores.discrim_std = `${CENTILES[k - 1]} - ${CENTILES[k]}`;
      }
    }
  }
  
  // Primacy (optional) - Z-score
  if (input.primacy !== undefined && input.primacy !== null) {
    scores.primacy_std = calculateZScore(input.primacy, TAB_PRIMACY[ageGroup], age, education, sexCode);
  }
  
  // Recency (optional) - Z-score
  if (input.recency !== undefined && input.recency !== null) {
    if (ageGroup === 1) {
      // 40-69: Simplified formula
      scores.recency_std = Math.round(((input.recency - 29.45) / 5.10) * 100) / 100;
    } else {
      scores.recency_std = calculateZScore(input.recency, TAB_RECENCY[ageGroup], age, education, sexCode);
    }
  }
  
  // Response Bias (optional) - Z-score
  if (input.response_bias !== undefined && input.response_bias !== null) {
    scores.bias_std = calculateZScore(input.response_bias, TAB_BIAS[ageGroup], age, education, sexCode);
  }
  
  return scores;
}

