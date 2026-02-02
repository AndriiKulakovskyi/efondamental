// ============================================================================
// WAIS-IV Matrices - Scoring Functions (Schizophrenia)
// ============================================================================
// This module contains scoring logic for WAIS-IV Matrices subtest
// SPECIFICALLY for the schizophrenia pathology.
// Includes age-based norm tables and discontinuation rule.
// 
// NOTE: This file is COMPLETELY SEPARATE from the bipolar version
// (wais4-matrices-bp-scoring.ts). No cross-talk between pathologies.
// ============================================================================

interface Wais4MatricesSzScores {
  wais_mat_tot: number;
  wais_mat_std: number | null;  // null if discontinuation rule triggered
  wais_mat_cr: number | null;   // null if discontinuation rule triggered
}

interface Wais4MatricesSzInput {
  patient_age: number;
  items: (number | null | undefined)[];  // Array of 26 item scores (0 or 1)
}

// ============================================================================
// Normative Tables
// ============================================================================
// Maximum raw score for each standard score (1-19) by age group.
// Value of 0 means this standard score is not attainable for that age group.
// Lookup method: Find the first standard score index where raw_score <= cutoff value (non-zero).

const MATRICES_SZ_NORMS: Record<string, number[]> = {
  // Standard scores 1-19 (index 0 = std 1, index 18 = std 19)
  age_16_17: [3, 5, 7, 9, 11, 13, 16, 18, 19, 20, 21, 22, 23, 24, 0, 25, 0, 26, 0],
  age_18_19: [4, 6, 8, 10, 12, 14, 16, 18, 19, 21, 22, 0, 23, 24, 0, 25, 0, 26, 0],
  age_20_24: [5, 7, 9, 11, 14, 16, 18, 19, 20, 21, 22, 23, 0, 24, 0, 25, 26, 0, 0],
  age_25_29: [5, 7, 9, 11, 13, 15, 17, 19, 20, 22, 23, 0, 24, 0, 25, 0, 26, 0, 0],
  age_30_34: [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 22, 23, 0, 24, 25, 0, 26, 0, 0],
  age_35_44: [1, 3, 5, 7, 9, 11, 14, 16, 18, 20, 21, 22, 23, 24, 25, 0, 26, 0, 0],
  age_45_54: [0, 1, 3, 5, 7, 10, 12, 15, 17, 19, 20, 22, 23, 24, 25, 0, 26, 0, 0],
  age_55_64: [0, 0, 1, 3, 5, 6, 9, 13, 16, 18, 19, 20, 21, 22, 24, 25, 0, 26, 0],
  age_65_69: [0, 0, 1, 3, 5, 6, 8, 11, 13, 15, 17, 19, 21, 22, 23, 24, 25, 0, 26],
  age_70_74: [0, 0, 1, 3, 5, 6, 7, 9, 11, 13, 15, 17, 19, 21, 22, 23, 24, 25, 26],
  age_75_plus: [0, 0, 1, 3, 5, 6, 7, 9, 11, 13, 15, 17, 19, 21, 22, 23, 24, 25, 26],
};

/**
 * Get the age category key for lookup tables
 */
function getAgeCategorySz(age: number): string {
  if (age >= 16 && age <= 17) return 'age_16_17';
  if (age >= 18 && age <= 19) return 'age_18_19';
  if (age >= 20 && age <= 24) return 'age_20_24';
  if (age >= 25 && age <= 29) return 'age_25_29';
  if (age >= 30 && age <= 34) return 'age_30_34';
  if (age >= 35 && age <= 44) return 'age_35_44';
  if (age >= 45 && age <= 54) return 'age_45_54';
  if (age >= 55 && age <= 64) return 'age_55_64';
  if (age >= 65 && age <= 69) return 'age_65_69';
  if (age >= 70 && age <= 74) return 'age_70_74';
  if (age >= 75) return 'age_75_plus';
  // Default to middle age group if out of range
  return 'age_35_44';
}

/**
 * Check if discontinuation rule is triggered
 * Returns true if:
 * - 4 consecutive items scored 0, OR
 * - 4 out of 5 consecutive items scored 0
 */
function checkDiscontinuationRuleSz(items: (number | null | undefined)[]): boolean {
  // Convert items to numbers (treat null/undefined as 0 for discontinuation check)
  const scores = items.map(item => (item === 1 ? 1 : 0));
  
  // Check for 4 consecutive zeros
  let consecutiveZeros = 0;
  for (const score of scores) {
    if (score === 0) {
      consecutiveZeros++;
      if (consecutiveZeros >= 4) {
        return true;
      }
    } else {
      consecutiveZeros = 0;
    }
  }
  
  // Check for 4 out of 5 consecutive zeros
  for (let i = 0; i <= scores.length - 5; i++) {
    const window = scores.slice(i, i + 5);
    const zeroCount = window.filter(s => s === 0).length;
    if (zeroCount >= 4) {
      return true;
    }
  }
  
  return false;
}

/**
 * Look up the standard score based on raw score and age
 * Returns standard score from 1 to 19, or the closest attainable score
 */
function lookupStandardScoreSz(rawScore: number, age: number): number {
  const ageCategory = getAgeCategorySz(age);
  const normTable = MATRICES_SZ_NORMS[ageCategory];
  
  if (!normTable) {
    console.error(`[WAIS4_MATRICES_SZ] No norm table found for age category: ${ageCategory}`);
    return 10; // Return average if no table found
  }
  
  // Find the first standard score where raw_score <= cutoff (non-zero)
  // Standard scores go from 1 to 19 (index 0 = std 1, index 18 = std 19)
  for (let i = 0; i < normTable.length; i++) {
    const cutoff = normTable[i];
    // Skip non-attainable scores (cutoff = 0)
    if (cutoff === 0) continue;
    
    if (rawScore <= cutoff) {
      return i + 1; // Standard score (1-19)
    }
  }
  
  // If raw score is higher than all cutoffs, find the highest attainable standard score
  for (let i = normTable.length - 1; i >= 0; i--) {
    if (normTable[i] !== 0) {
      return i + 1;
    }
  }
  
  // Fallback: return 1 if all else fails
  return 1;
}

/**
 * Calculate all WAIS-IV Matrices scores for schizophrenia
 * Includes discontinuation rule specific to schizophrenia protocol
 */
export function calculateWais4MatricesSzScores(input: Wais4MatricesSzInput): Wais4MatricesSzScores {
  // Calculate total raw score (sum of all 26 items)
  const wais_mat_tot = input.items.reduce((sum, item) => {
    return sum + (item === 1 ? 1 : 0);
  }, 0);
  
  // Check discontinuation rule
  const discontinued = checkDiscontinuationRuleSz(input.items);
  
  if (discontinued) {
    // Standard score is null if discontinuation rule is triggered
    return {
      wais_mat_tot,
      wais_mat_std: null,
      wais_mat_cr: null
    };
  }
  
  // Look up standard score based on raw score and age
  const wais_mat_std = lookupStandardScoreSz(wais_mat_tot, input.patient_age);
  
  // Calculate Z-score: (standard_score - 10) / 3
  const wais_mat_cr = Number(((wais_mat_std - 10) / 3).toFixed(2));
  
  return {
    wais_mat_tot,
    wais_mat_std,
    wais_mat_cr
  };
}

// Export helper functions for testing (SZ-specific)
export { getAgeCategorySz, lookupStandardScoreSz, checkDiscontinuationRuleSz, MATRICES_SZ_NORMS };
