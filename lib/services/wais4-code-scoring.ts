// ============================================================================
// WAIS-IV Subtest Code - Scoring Functions
// ============================================================================
// This module contains scoring logic for WAIS-IV Subtest Code
// with age-stratified normative tables.
// WAIS-IV (Wechsler, 2008) uses different norms than WAIS-III (1997)
// ============================================================================

/**
 * WAIS-IV Code Normative Tables
 * Each age group has 19 cutoff values for standard scores 1-19
 * Lower raw scores map to lower standard scores
 */
const WAIS4_CODE_NORMS: Record<string, number[]> = {
  age_16: [32, 36, 40, 45, 51, 55, 58, 61, 64, 68, 72, 76, 81, 86, 92, 98, 101, 104, 135],
  age_18: [36, 40, 44, 48, 52, 56, 61, 66, 69, 72, 76, 81, 85, 90, 95, 98, 101, 104, 135],
  age_20: [38, 42, 46, 50, 54, 58, 64, 70, 74, 78, 81, 87, 92, 95, 98, 101, 104, 107, 135],
  age_25: [32, 36, 41, 46, 52, 56, 62, 68, 74, 78, 84, 88, 92, 98, 102, 106, 110, 114, 135],
  age_30: [31, 35, 40, 46, 52, 55, 59, 68, 73, 78, 83, 89, 94, 98, 102, 106, 110, 113, 135],
  age_35: [28, 32, 36, 42, 47, 52, 56, 61, 66, 72, 78, 82, 86, 90, 97, 103, 107, 110, 135],
  age_45: [22, 26, 30, 35, 43, 46, 50, 60, 66, 70, 73, 77, 81, 87, 93, 98, 104, 108, 135],
  age_55: [15, 20, 25, 29, 36, 41, 45, 50, 55, 62, 66, 71, 77, 82, 90, 96, 102, 106, 135],
  age_65: [14, 19, 23, 27, 32, 37, 42, 46, 49, 57, 63, 69, 73, 78, 88, 93, 97, 101, 135],
  age_70: [13, 17, 20, 23, 25, 28, 31, 37, 43, 47, 53, 58, 62, 67, 71, 74, 79, 85, 135],
  age_75: [10, 13, 16, 19, 22, 26, 30, 33, 37, 43, 48, 53, 57, 60, 67, 72, 77, 82, 135]
};

/**
 * Determine age bracket for norm lookup
 * @param age Patient's age (16-90)
 * @returns Age group key for normative table
 */
function getAgeGroup(age: number): string {
  if (age >= 75) return 'age_75';
  if (age > 70) return 'age_70';
  if (age > 65) return 'age_65';
  if (age > 55) return 'age_55';
  if (age > 45) return 'age_45';
  if (age > 35) return 'age_35';
  if (age > 30) return 'age_30';
  if (age > 25) return 'age_25';
  if (age >= 20) return 'age_20';
  if (age >= 18) return 'age_18';
  return 'age_16'; // Default for ages 16-17
}

/**
 * Input data for WAIS-IV Code scoring
 */
export interface Wais4CodeInput {
  patient_age: number;     // Age (16-90)
  wais_cod_tot: number;    // Total correctly filled boxes
  wais_cod_err?: number;   // Incorrect boxes (not used in WAIS-IV scoring)
}

/**
 * Computed scores for WAIS-IV Code
 */
export interface Wais4CodeScores {
  wais_cod_brut: number;   // Raw total score
  wais_cod_std: number;    // Standard score (1-19)
  wais_cod_cr: number;     // Standardized value (z-score)
}

/**
 * Calculate all WAIS-IV Code scores
 * @param input Patient data and raw scores
 * @returns Computed scores
 */
export function calculateWais4CodeScores(input: Wais4CodeInput): Wais4CodeScores {
  // Raw score = total correct (errors are NOT subtracted in WAIS-IV)
  const wais_cod_brut = input.wais_cod_tot;
  
  // Get age-appropriate normative table
  const ageGroup = getAgeGroup(input.patient_age);
  const norms = WAIS4_CODE_NORMS[ageGroup];
  
  // Find standard score by comparing raw score to cutoffs
  // Standard score = index + 1 where raw score <= cutoff
  let k = 0;
  while (k < 18 && wais_cod_brut > norms[k]) {
    k++;
  }
  const wais_cod_std = k + 1;
  
  // Calculate standardized value (z-score)
  // Mean = 10, SD = 3
  // Formula: (standard_score - 10) / 3
  const wais_cod_cr = Number(((wais_cod_std - 10) / 3).toFixed(2));
  
  return {
    wais_cod_brut,
    wais_cod_std,
    wais_cod_cr
  };
}

// Export norms for potential client-side use
export { WAIS4_CODE_NORMS, getAgeGroup };
