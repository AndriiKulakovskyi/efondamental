// ============================================================================
// Test des Commissions - Scoring Functions
// ============================================================================
// This module contains scoring logic for Test des Commissions
// with age and NSC-based norm tables for percentiles and Z-scores.
// NSC = Niveau etude (0: < baccalaureat, 1: >= baccalaureat)
// ============================================================================

interface TestCommissionsScores {
  com01s1: string; // Percentile for time
  com01s2: number; // Z-score for time
  com02s1: string; // Percentile for detours
  com02s2: number; // Z-score for detours
  com03s1: string; // Percentile for schedule violations
  com03s2: number; // Z-score for schedule violations
  com04s1: string; // Percentile for logical errors
  com04s2: number; // Z-score for logical errors
  com04s3: number; // Total errors
  com04s4: string; // Percentile for total errors
  com04s5: number; // Z-score for total errors
}

interface TestCommissionsInput {
  patient_age: number;
  nsc: number; // 0: < baccalaureat, 1: >= baccalaureat
  com01: number; // Time in minutes
  com02: number; // Number of unnecessary detours
  com03: number; // Number of schedule violations
  com04: number; // Number of logical errors
}

// Percentile values corresponding to cutoffs
const TAB_PERCENTILE_NSC = [95, 90, 80, 75, 50, 25, 20, 10, 5];

// tabcalcul[nsc][metric_index][score_cutoffs]
// metric_index: 0=time, 1=detours, 2=schedule_violations, 3=logical_errors, 4=total_errors
// For time (metric 0): lower is better, so <= cutoff means you meet that percentile
// For errors (metrics 1-4): lower is better, so <= cutoff means you meet that percentile
const TABCALCUL: Record<number, number[][]> = {
  0: [
    [3, 3, 4, 5, 7, 9, 9, 10, 12], // Time cutoffs
    [0, 0, 0, 1, 1, 2, 2, 2, 3],   // Detours cutoffs
    [0, 0, 0, 0, 1, 1, 1, 1, 2],   // Schedule violations cutoffs
    [0, 0, 0, 0, 1, 1, 1, 2, 2],   // Logical errors cutoffs
    [0, 1, 1, 1, 3, 3, 4, 5, 5]    // Total errors cutoffs
  ],
  1: [
    [1, 2, 3, 4, 6, 8, 8, 9, 10],  // Time cutoffs
    [0, 0, 0, 0, 1, 1, 1, 2, 2],   // Detours cutoffs
    [0, 0, 0, 0, 1, 1, 1, 1, 2],   // Schedule violations cutoffs
    [0, 0, 0, 0, 0, 1, 1, 1, 1],   // Logical errors cutoffs
    [0, 0, 0, 1, 2, 3, 3, 4, 4]    // Total errors cutoffs
  ]
};

// finalmoy[age_cat][nsc][metric_index]
// age_cat: 0 = 20-40, 1 = 41-60
// metric_index: 0=time, 1=detours, 2=schedule_violations, 3=logical_errors, 4=total_errors
const FINALMOY: Record<number, number[][]> = {
  0: [
    [6.37, 1.12, 0.62, 0.87, 2.02], // NSC 0
    [5.05, 0.86, 0.52, 0.62, 2.00]  // NSC 1
  ],
  1: [
    [6.89, 1.21, 0.58, 0.79, 2.58], // NSC 0
    [7.00, 0.33, 0.50, 0.08, 0.92]  // NSC 1
  ]
};

// finaletyp[age_cat][nsc][metric_index] - standard deviations
const FINALETYP: Record<number, number[][]> = {
  0: [
    [3.02, 0.83, 0.74, 0.64, 1.51], // NSC 0
    [2.04, 0.96, 0.60, 0.67, 1.13]  // NSC 1
  ],
  1: [
    [2.90, 0.79, 0.69, 0.63, 1.61], // NSC 0
    [3.38, 0.65, 0.79, 0.29, 1.08]  // NSC 1
  ]
};

/**
 * Get age category: 0 for 20-40, 1 for 41-60
 */
function getAgeCategory(age: number): number {
  if (age >= 20 && age < 41) return 0;
  if (age >= 41 && age <= 60) return 1;
  // Default to 0 if out of range
  return 0;
}

/**
 * Look up percentile for time (lower is better)
 * Returns the highest percentile where score <= cutoff
 */
function lookupPercentileTime(score: number, nsc: number): string {
  const cutoffs = TABCALCUL[nsc][0];
  // For time, lower is better
  // Find the lowest cutoff where score <= cutoff (best performance)
  for (let i = 0; i < cutoffs.length; i++) {
    if (score <= cutoffs[i]) {
      return `>= ${TAB_PERCENTILE_NSC[i]}`;
    }
  }
  return `< ${TAB_PERCENTILE_NSC[TAB_PERCENTILE_NSC.length - 1]}`;
}

/**
 * Look up percentile for errors (lower is better)
 * Returns the highest percentile where score <= cutoff
 */
function lookupPercentileErrors(score: number, nsc: number, metricIndex: number): string {
  const cutoffs = TABCALCUL[nsc][metricIndex];
  // For errors, lower is better
  // Find the lowest cutoff where score <= cutoff (best performance)
  for (let i = 0; i < cutoffs.length; i++) {
    if (score <= cutoffs[i]) {
      return `>= ${TAB_PERCENTILE_NSC[i]}`;
    }
  }
  return `< ${TAB_PERCENTILE_NSC[TAB_PERCENTILE_NSC.length - 1]}`;
}

/**
 * Calculate Z-score for time (lower time = better performance)
 * Z = (mean - score) / std
 * Lower time than mean = positive Z = better performance
 */
function calculateZScoreTime(score: number, ageCat: number, nsc: number): number {
  const mean = FINALMOY[ageCat][nsc][0];
  const std = FINALETYP[ageCat][nsc][0];
  if (std === 0) return 0;
  // Formula: (finalmoy - COM01) / finaletyp
  // If time < mean, Z is positive (better than average)
  return Number(((mean - score) / std).toFixed(2));
}

/**
 * Calculate Z-score for errors
 * Z = (mean - score) / std
 * Lower errors = negative Z = better performance
 */
function calculateZScoreErrors(score: number, ageCat: number, nsc: number, metricIndex: number): number {
  const mean = FINALMOY[ageCat][nsc][metricIndex];
  const std = FINALETYP[ageCat][nsc][metricIndex];
  if (std === 0) return 0;
  return Number(((mean - score) / std).toFixed(2));
}

/**
 * Calculate all Test des Commissions scores
 */
export function calculateTestCommissionsScores(input: TestCommissionsInput): TestCommissionsScores {
  const ageCat = getAgeCategory(input.patient_age);
  const nsc = input.nsc;
  
  // Total errors (detours + schedule violations + logical errors)
  const com04s3 = input.com02 + input.com03 + input.com04;
  
  // Percentiles
  const com01s1 = lookupPercentileTime(input.com01, nsc);
  const com02s1 = lookupPercentileErrors(input.com02, nsc, 1);
  const com03s1 = lookupPercentileErrors(input.com03, nsc, 2);
  const com04s1 = lookupPercentileErrors(input.com04, nsc, 3);
  const com04s4 = lookupPercentileErrors(com04s3, nsc, 4);
  
  // Z-scores
  const com01s2 = calculateZScoreTime(input.com01, ageCat, nsc);
  const com02s2 = calculateZScoreErrors(input.com02, ageCat, nsc, 1);
  const com03s2 = calculateZScoreErrors(input.com03, ageCat, nsc, 2);
  const com04s2 = calculateZScoreErrors(input.com04, ageCat, nsc, 3);
  const com04s5 = calculateZScoreErrors(com04s3, ageCat, nsc, 4);
  
  return {
    com01s1,
    com01s2,
    com02s1,
    com02s2,
    com03s1,
    com03s2,
    com04s1,
    com04s2,
    com04s3,
    com04s4,
    com04s5
  };
}

// Export constants for client-side scoring
export { TAB_PERCENTILE_NSC, TABCALCUL, FINALMOY, FINALETYP, getAgeCategory };

