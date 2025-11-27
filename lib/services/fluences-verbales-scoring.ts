// ============================================================================
// Fluences Verbales (Cardebat et al., 1990) - Scoring Functions
// ============================================================================
// This module contains scoring logic for Fluences Verbales with age and 
// education-based norms.
// ============================================================================

interface FluencesVerbalesScores {
  // Lettre P scores
  fv_p_tot_rupregle: number;
  fv_p_tot_correct_z: number;
  fv_p_tot_correct_pc: number;
  // Animaux scores
  fv_anim_tot_rupregle: number;
  fv_anim_tot_correct_z: number;
  fv_anim_tot_correct_pc: number;
}

interface FluencesVerbalesInput {
  patient_age: number;
  years_of_education: number;
  // Lettre P
  fv_p_tot_correct: number;
  fv_p_deriv?: number | null;
  fv_p_intrus?: number | null;
  fv_p_propres?: number | null;
  // Animaux
  fv_anim_tot_correct: number;
  fv_anim_deriv?: number | null;
  fv_anim_intrus?: number | null;
  fv_anim_propres?: number | null;
}

// Lookup tables structure: [p5, p10, p25, p50, p75, p90, p95, mean, std_dev]
type NormTable = {
  age_0: { edu_0: number[]; edu_1: number[]; edu_2: number[] };
  age_1: { edu_0: number[]; edu_1: number[]; edu_2: number[] };
  age_2: { edu_0: number[]; edu_1: number[]; edu_2: number[] };
};

// Lettre P norms
const TAB_FLUENCE_P: NormTable = {
  age_0: {
    edu_0: [5.9, 9, 14, 16.5, 22.75, 25.7, 28.35, 17.3, 6.4],
    edu_1: [10.8, 12, 14, 19, 24, 27.2, 31.2, 19.5, 6.3],
    edu_2: [13, 14, 19, 25, 28.75, 32.3, 34, 24, 6.6]
  },
  age_1: {
    edu_0: [8.2, 11, 15.5, 20, 25, 27.8, 31.8, 19.9, 6.9],
    edu_1: [10.1, 13.2, 16, 21, 25, 28.8, 30, 20.9, 5.9],
    edu_2: [15.5, 18, 22, 25, 30, 34, 37.5, 25.7, 6.3]
  },
  age_2: {
    edu_0: [6.5, 8, 12, 16, 20, 22, 25, 15.7, 5.6],
    edu_1: [9.75, 12, 14.75, 19, 24, 30, 32.25, 19.7, 6.7],
    edu_2: [12.25, 15.5, 19, 22, 26, 30, 31.25, 22.4, 5.5]
  }
};

// Animaux norms
const TAB_FLUENCE_ANIM: NormTable = {
  age_0: {
    edu_0: [19, 21, 24.25, 31, 34, 38, 38.7, 29.5, 6],
    edu_1: [18.4, 19.8, 24, 29, 36, 40, 44.2, 29.9, 7.9],
    edu_2: [21, 24, 28, 34, 40, 45, 48.2, 34.2, 8.2]
  },
  age_1: {
    edu_0: [16, 20.4, 23, 26, 32, 42.6, 45.9, 28.2, 7.9],
    edu_1: [18.2, 21.4, 27, 32, 35, 40, 42.9, 31.3, 6.8],
    edu_2: [24.5, 27, 31.5, 36, 40, 47, 52.5, 36.8, 8.7]
  },
  age_2: {
    edu_0: [16, 17, 20, 24, 29.75, 33, 37, 24.7, 6.3],
    edu_1: [14.75, 17, 22, 26, 32, 37, 41, 26.8, 7.4],
    edu_2: [15.25, 21, 23.75, 30, 35.5, 39.5, 43.25, 29.7, 8.8]
  }
};

/**
 * Get the age category based on patient age
 * 0: age < 40
 * 1: 40 <= age < 60
 * 2: age >= 60
 */
function getAgeCategory(age: number): 'age_0' | 'age_1' | 'age_2' {
  if (age < 40) return 'age_0';
  if (age < 60) return 'age_1';
  return 'age_2';
}

/**
 * Get the education level category
 * 0: education < 6 years
 * 1: 6 <= education < 12 years
 * 2: education >= 12 years
 */
function getEducationLevel(years: number): 'edu_0' | 'edu_1' | 'edu_2' {
  if (years < 6) return 'edu_0';
  if (years < 12) return 'edu_1';
  return 'edu_2';
}

/**
 * Get norms from lookup table based on age and education
 */
function getNorms(table: NormTable, ageCategory: 'age_0' | 'age_1' | 'age_2', eduLevel: 'edu_0' | 'edu_1' | 'edu_2'): number[] {
  return table[ageCategory][eduLevel];
}

/**
 * Calculate Z-score using formula: (value - mean) / std_dev
 */
function calculateZScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return Number(((value - mean) / stdDev).toFixed(2));
}

/**
 * Determine percentile based on value and percentile thresholds
 * Percentile order in norms: [p5, p10, p25, p50, p75, p90, p95]
 */
function calculatePercentile(value: number, norms: number[]): number {
  const [p5, p10, p25, p50, p75, p90, p95] = norms;
  
  // Higher is better for fluency measures
  if (value >= p95) return 95;
  if (value >= p90) return 90;
  if (value >= p75) return 75;
  if (value >= p50) return 50;
  if (value >= p25) return 25;
  if (value >= p10) return 10;
  if (value >= p5) return 5;
  return 1; // Below 5th percentile
}

/**
 * Calculate all Fluences Verbales scores based on input values
 */
export function calculateFluencesVerbalesScores(input: FluencesVerbalesInput): FluencesVerbalesScores {
  const ageCategory = getAgeCategory(input.patient_age);
  const eduLevel = getEducationLevel(input.years_of_education);
  
  // Get norms for this demographic
  const normsPLettre = getNorms(TAB_FLUENCE_P, ageCategory, eduLevel);
  const normsAnim = getNorms(TAB_FLUENCE_ANIM, ageCategory, eduLevel);
  
  // Calculate total rule violations
  const fv_p_tot_rupregle = (input.fv_p_deriv || 0) + (input.fv_p_intrus || 0) + (input.fv_p_propres || 0);
  const fv_anim_tot_rupregle = (input.fv_anim_deriv || 0) + (input.fv_anim_intrus || 0) + (input.fv_anim_propres || 0);
  
  // Calculate Z-scores (index 7 = mean, index 8 = std_dev)
  const fv_p_tot_correct_z = calculateZScore(input.fv_p_tot_correct, normsPLettre[7], normsPLettre[8]);
  const fv_anim_tot_correct_z = calculateZScore(input.fv_anim_tot_correct, normsAnim[7], normsAnim[8]);
  
  // Calculate percentiles
  const fv_p_tot_correct_pc = calculatePercentile(input.fv_p_tot_correct, normsPLettre);
  const fv_anim_tot_correct_pc = calculatePercentile(input.fv_anim_tot_correct, normsAnim);
  
  return {
    fv_p_tot_rupregle,
    fv_p_tot_correct_z,
    fv_p_tot_correct_pc,
    fv_anim_tot_rupregle,
    fv_anim_tot_correct_z,
    fv_anim_tot_correct_pc
  };
}

// Export helper functions for client-side scoring
export { getAgeCategory, getEducationLevel, getNorms, calculateZScore, calculatePercentile, TAB_FLUENCE_P, TAB_FLUENCE_ANIM };

