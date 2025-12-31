// eFondaMental Platform - WAIS-IV Digit Span Scoring
// Scoring functions for the Memoire des chiffres subtest
// Based on WAIS-IV French adaptation norms

// ============================================================================
// NORMATIVE DATA FOR EMPAN Z-SCORES
// ============================================================================

/**
 * Empan endroit (forward span) normative means by age group
 * Age groups: 16-17, 18-19, 20-24, 25-29, 30-34, 35-44, 45-54, 55-64, 65-69, 70-74, 75+
 */
const EMPAN_ENDROIT_MEANS: number[] = [6.5, 6.5, 6.5, 6.5, 6.3, 6.2, 6.2, 5.8, 5.7, 5.3, 5.6];

/**
 * Empan endroit (forward span) normative standard deviations by age group
 */
const EMPAN_ENDROIT_SDS: number[] = [1.1, 1.2, 1.3, 1.3, 1.4, 1.3, 1.3, 1.5, 1.2, 1.3, 1.2];

/**
 * Empan envers (backward span) normative means by age group
 */
const EMPAN_ENVERS_MEANS: number[] = [4.7, 4.9, 4.8, 4.9, 5.1, 4.8, 4.6, 4.3, 4.0, 3.9, 3.8];

/**
 * Empan envers (backward span) normative standard deviations by age group
 */
const EMPAN_ENVERS_SDS: number[] = [1.3, 1.3, 1.3, 1.1, 1.4, 1.4, 1.3, 1.5, 1.3, 1.0, 1.2];

/**
 * Empan croissant (sequencing span) normative means by age group
 */
const EMPAN_CROISSANT_MEANS: number[] = [5.6, 6.0, 6.0, 5.9, 5.8, 6.0, 5.6, 5.2, 5.0, 4.8, 5.1];

/**
 * Empan croissant (sequencing span) normative standard deviations by age group
 */
const EMPAN_CROISSANT_SDS: number[] = [1.2, 1.3, 1.3, 1.1, 1.2, 1.2, 1.4, 1.4, 1.2, 1.2, 1.2];

// ============================================================================
// AGE-STRATIFIED STANDARD SCORE NORMS
// ============================================================================

/**
 * Age group lookup table for standardized scores
 * Each array maps raw scores (0-48) to standardized scores (1-19)
 * Format: wais_tab[ageGroupIndex][rawScore] = standardizedScore
 * Age groups: 16-17, 18-19, 20-24, 25-29, 30-34, 35-44, 45-54, 55-64, 65-69, 70-74, 75-79, 80-84, 85-90
 */
const DIGIT_SPAN_NORMS: number[][] = [
  // Age 16-17
  [1, 1, 1, 1, 1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
  // Age 18-19
  [1, 1, 1, 1, 1, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
  // Age 20-24
  [1, 1, 1, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
  // Age 25-29
  [1, 1, 1, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
  // Age 30-34
  [1, 1, 1, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 16, 16, 17, 17, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
  // Age 35-44
  [1, 1, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
  // Age 45-54
  [1, 1, 1, 1, 2, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
  // Age 55-64
  [1, 1, 1, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
  // Age 65-69
  [1, 1, 1, 2, 3, 4, 4, 5, 5, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
  // Age 70-74
  [1, 1, 2, 3, 3, 4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
  // Age 75-79
  [1, 1, 2, 3, 4, 4, 5, 6, 6, 7, 7, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
  // Age 80-84
  [1, 1, 2, 3, 4, 5, 5, 6, 7, 7, 8, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
  // Age 85-90
  [1, 2, 3, 4, 5, 5, 6, 7, 7, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19]
];

/**
 * Get the age group index for standard score norm lookup (13 groups)
 */
function getAgeGroupIndex(age: number): number {
  if (age >= 16 && age <= 17) return 0;
  if (age >= 18 && age <= 19) return 1;
  if (age >= 20 && age <= 24) return 2;
  if (age >= 25 && age <= 29) return 3;
  if (age >= 30 && age <= 34) return 4;
  if (age >= 35 && age <= 44) return 5;
  if (age >= 45 && age <= 54) return 6;
  if (age >= 55 && age <= 64) return 7;
  if (age >= 65 && age <= 69) return 8;
  if (age >= 70 && age <= 74) return 9;
  if (age >= 75 && age <= 79) return 10;
  if (age >= 80 && age <= 84) return 11;
  return 12; // 85-90
}

/**
 * Get the age group index for empan Z-score calculations (11 groups)
 */
function getEmpanAgeGroupIndex(age: number): number {
  if (age >= 16 && age <= 17) return 0;
  if (age >= 18 && age <= 19) return 1;
  if (age >= 20 && age <= 24) return 2;
  if (age >= 25 && age <= 29) return 3;
  if (age >= 30 && age <= 34) return 4;
  if (age >= 35 && age <= 44) return 5;
  if (age >= 45 && age <= 54) return 6;
  if (age >= 55 && age <= 64) return 7;
  if (age >= 65 && age <= 69) return 8;
  if (age >= 70 && age <= 74) return 9;
  return 10; // 75+
}

/**
 * Calculate Z-score for empan values
 * Z = (value - mean) / SD
 */
function calculateEmpanZScore(
  empanValue: number,
  age: number,
  means: number[],
  sds: number[]
): number {
  const ageGroupIndex = getEmpanAgeGroupIndex(age);
  const mean = means[ageGroupIndex];
  const sd = sds[ageGroupIndex];
  
  if (sd === 0) return 0; // Avoid division by zero
  
  const zScore = (empanValue - mean) / sd;
  return Number(zScore.toFixed(2));
}

/**
 * Calculate standardized score based on age and raw score
 */
export function calculateStandardizedScore(rawScore: number, age: number): number {
  const ageGroupIndex = getAgeGroupIndex(age);
  const normalizedRawScore = Math.min(Math.max(rawScore, 0), 48);
  return DIGIT_SPAN_NORMS[ageGroupIndex][normalizedRawScore];
}

/**
 * Interface for digit span responses input
 */
interface DigitSpanInput {
  patient_age: number;
  
  // Direct order
  wais4_mcod_1a: number;
  wais4_mcod_1b: number;
  wais4_mcod_2a?: number | null;
  wais4_mcod_2b?: number | null;
  wais4_mcod_3a?: number | null;
  wais4_mcod_3b?: number | null;
  wais4_mcod_4a?: number | null;
  wais4_mcod_4b?: number | null;
  wais4_mcod_5a?: number | null;
  wais4_mcod_5b?: number | null;
  wais4_mcod_6a?: number | null;
  wais4_mcod_6b?: number | null;
  wais4_mcod_7a?: number | null;
  wais4_mcod_7b?: number | null;
  wais4_mcod_8a?: number | null;
  wais4_mcod_8b?: number | null;
  
  // Inverse order
  wais4_mcoi_1a: number;
  wais4_mcoi_1b: number;
  wais4_mcoi_2a?: number | null;
  wais4_mcoi_2b?: number | null;
  wais4_mcoi_3a?: number | null;
  wais4_mcoi_3b?: number | null;
  wais4_mcoi_4a?: number | null;
  wais4_mcoi_4b?: number | null;
  wais4_mcoi_5a?: number | null;
  wais4_mcoi_5b?: number | null;
  wais4_mcoi_6a?: number | null;
  wais4_mcoi_6b?: number | null;
  wais4_mcoi_7a?: number | null;
  wais4_mcoi_7b?: number | null;
  wais4_mcoi_8a?: number | null;
  wais4_mcoi_8b?: number | null;
  
  // Sequencing order
  wais4_mcoc_1a: number;
  wais4_mcoc_1b: number;
  wais4_mcoc_2a?: number | null;
  wais4_mcoc_2b?: number | null;
  wais4_mcoc_3a?: number | null;
  wais4_mcoc_3b?: number | null;
  wais4_mcoc_4a?: number | null;
  wais4_mcoc_4b?: number | null;
  wais4_mcoc_5a?: number | null;
  wais4_mcoc_5b?: number | null;
  wais4_mcoc_6a?: number | null;
  wais4_mcoc_6b?: number | null;
  wais4_mcoc_7a?: number | null;
  wais4_mcoc_7b?: number | null;
  wais4_mcoc_8a?: number | null;
  wais4_mcoc_8b?: number | null;
}

/**
 * Interface for computed scores output
 */
interface DigitSpanScores {
  // Individual item scores
  wais_mcod_1: number;
  wais_mcod_2: number;
  wais_mcod_3: number;
  wais_mcod_4: number;
  wais_mcod_5: number;
  wais_mcod_6: number;
  wais_mcod_7: number;
  wais_mcod_8: number;
  
  wais_mcoi_1: number;
  wais_mcoi_2: number;
  wais_mcoi_3: number;
  wais_mcoi_4: number;
  wais_mcoi_5: number;
  wais_mcoi_6: number;
  wais_mcoi_7: number;
  wais_mcoi_8: number;
  
  wais_mcoc_1: number;
  wais_mcoc_2: number;
  wais_mcoc_3: number;
  wais_mcoc_4: number;
  wais_mcoc_5: number;
  wais_mcoc_6: number;
  wais_mcoc_7: number;
  wais_mcoc_8: number;
  
  // Section totals with naming convention
  wais_mcod_tot: number;
  wais_mcoi_tot: number;
  wais_mcoc_tot: number;
  
  // Legacy field names (backward compatibility)
  mcod_total: number;
  mcoi_total: number;
  mcoc_total: number;
  raw_score: number;
  standardized_score: number;
  empan_direct: number;
  empan_inverse: number;
  empan_croissant: number;
  
  // Empan with naming convention
  wais_mc_end: number;
  wais_mc_env: number;
  wais_mc_cro: number;
  
  // Empan Z-scores
  wais_mc_end_std: number;
  wais_mc_env_std: number;
  wais_mc_cro_std: number;
  
  // Empan difference
  wais_mc_emp: number;
  
  // Total and standard scores with naming convention
  wais_mc_tot: number;
  wais_mc_std: number;
  wais_mc_cr: number;
}

/**
 * Calculate the empan (longest span) for direct order
 * Empan endroit = item_number_at_first_zero + 1
 */
function calculateEmpanDirect(itemScores: (number | null | undefined)[][]): number {
  let lastPassedItem = 0;
  
  for (let i = 0; i < itemScores.length; i++) {
    const [trialA, trialB] = itemScores[i];
    const itemSum = (trialA ?? 0) + (trialB ?? 0);
    
    // If item sum is 0, this is the first zero
    if (itemSum === 0) {
      return lastPassedItem + 1;
    }
    
    // Item passed (at least one trial correct)
    lastPassedItem = i + 1;
  }
  
  // All items passed
  return lastPassedItem + 1;
}

/**
 * Calculate the empan for inverse order
 * Special rule: if item 1 fails, start from item 2
 * Empan envers = item_number_at_first_zero (no +1)
 */
function calculateEmpanInverse(itemScores: (number | null | undefined)[][]): number {
  // Check if item 1 failed
  const [item1A, item1B] = itemScores[0];
  const item1Sum = (item1A ?? 0) + (item1B ?? 0);
  
  let startIndex = 0;
  if (item1Sum === 0) {
    // Item 1 failed, start from item 2
    startIndex = 1;
  }
  
  let lastPassedItem = startIndex;
  
  for (let i = startIndex; i < itemScores.length; i++) {
    const [trialA, trialB] = itemScores[i];
    const itemSum = (trialA ?? 0) + (trialB ?? 0);
    
    // If item sum is 0, return last passed item number
    if (itemSum === 0) {
      return lastPassedItem;
    }
    
    // Item passed
    lastPassedItem = i + 1;
  }
  
  // All items passed
  return lastPassedItem;
}

/**
 * Calculate the empan for croissant (sequencing) order
 * Empan croissant = item_number_at_first_zero + 1
 */
function calculateEmpanCroissant(itemScores: (number | null | undefined)[][]): number {
  let lastPassedItem = 0;
  
  for (let i = 0; i < itemScores.length; i++) {
    const [trialA, trialB] = itemScores[i];
    const itemSum = (trialA ?? 0) + (trialB ?? 0);
    
    // If item sum is 0, this is the first zero
    if (itemSum === 0) {
      return lastPassedItem + 1;
    }
    
    // Item passed (at least one trial correct)
    lastPassedItem = i + 1;
  }
  
  // All items passed
  return lastPassedItem + 1;
}

/**
 * Calculate section total for direct order
 * Sum items until first score of 0
 */
function calculateSectionTotalDirect(itemScores: (number | null | undefined)[][]): number {
  let total = 0;
  
  for (let i = 0; i < itemScores.length; i++) {
    const [trialA, trialB] = itemScores[i];
    const itemSum = (trialA ?? 0) + (trialB ?? 0);
    
    // If item sum is 0, stop (discontinue rule)
    if (itemSum === 0) {
      break;
    }
    
    total += itemSum;
  }
  
  return total;
}

/**
 * Calculate section total for inverse order
 * Special handling: if item 1 = 0, start from item 2
 * Then sum until first score of 0
 */
function calculateSectionTotalInverse(itemScores: (number | null | undefined)[][]): number {
  let total = 0;
  
  // Check if item 1 failed
  const [item1A, item1B] = itemScores[0];
  const item1Sum = (item1A ?? 0) + (item1B ?? 0);
  
  let startIndex = 0;
  if (item1Sum === 0) {
    // Item 1 failed, start from item 2
    startIndex = 1;
  } else {
    // Item 1 passed, include it
    total += item1Sum;
    startIndex = 1;
  }
  
  // Continue from startIndex
  for (let i = startIndex; i < itemScores.length; i++) {
    const [trialA, trialB] = itemScores[i];
    const itemSum = (trialA ?? 0) + (trialB ?? 0);
    
    // If item sum is 0, stop
    if (itemSum === 0) {
      break;
    }
    
    total += itemSum;
  }
  
  return total;
}

/**
 * Calculate section total for croissant order
 * Sum items until first score of 0
 */
function calculateSectionTotalCroissant(itemScores: (number | null | undefined)[][]): number {
  let total = 0;
  
  for (let i = 0; i < itemScores.length; i++) {
    const [trialA, trialB] = itemScores[i];
    const itemSum = (trialA ?? 0) + (trialB ?? 0);
    
    // If item sum is 0, stop (discontinue rule)
    if (itemSum === 0) {
      break;
    }
    
    total += itemSum;
  }
  
  return total;
}

/**
 * Calculate all digit span scores
 */
export function calculateDigitSpanScores(input: DigitSpanInput): DigitSpanScores {
  // Organize direct order items
  const directItems: (number | null | undefined)[][] = [
    [input.wais4_mcod_1a, input.wais4_mcod_1b],
    [input.wais4_mcod_2a, input.wais4_mcod_2b],
    [input.wais4_mcod_3a, input.wais4_mcod_3b],
    [input.wais4_mcod_4a, input.wais4_mcod_4b],
    [input.wais4_mcod_5a, input.wais4_mcod_5b],
    [input.wais4_mcod_6a, input.wais4_mcod_6b],
    [input.wais4_mcod_7a, input.wais4_mcod_7b],
    [input.wais4_mcod_8a, input.wais4_mcod_8b]
  ];
  
  // Organize inverse order items
  const inverseItems: (number | null | undefined)[][] = [
    [input.wais4_mcoi_1a, input.wais4_mcoi_1b],
    [input.wais4_mcoi_2a, input.wais4_mcoi_2b],
    [input.wais4_mcoi_3a, input.wais4_mcoi_3b],
    [input.wais4_mcoi_4a, input.wais4_mcoi_4b],
    [input.wais4_mcoi_5a, input.wais4_mcoi_5b],
    [input.wais4_mcoi_6a, input.wais4_mcoi_6b],
    [input.wais4_mcoi_7a, input.wais4_mcoi_7b],
    [input.wais4_mcoi_8a, input.wais4_mcoi_8b]
  ];
  
  // Organize sequencing order items
  const sequencingItems: (number | null | undefined)[][] = [
    [input.wais4_mcoc_1a, input.wais4_mcoc_1b],
    [input.wais4_mcoc_2a, input.wais4_mcoc_2b],
    [input.wais4_mcoc_3a, input.wais4_mcoc_3b],
    [input.wais4_mcoc_4a, input.wais4_mcoc_4b],
    [input.wais4_mcoc_5a, input.wais4_mcoc_5b],
    [input.wais4_mcoc_6a, input.wais4_mcoc_6b],
    [input.wais4_mcoc_7a, input.wais4_mcoc_7b],
    [input.wais4_mcoc_8a, input.wais4_mcoc_8b]
  ];
  
  // Calculate individual item scores (sum of trial 1 + trial 2)
  const wais_mcod_1 = (input.wais4_mcod_1a ?? 0) + (input.wais4_mcod_1b ?? 0);
  const wais_mcod_2 = (input.wais4_mcod_2a ?? 0) + (input.wais4_mcod_2b ?? 0);
  const wais_mcod_3 = (input.wais4_mcod_3a ?? 0) + (input.wais4_mcod_3b ?? 0);
  const wais_mcod_4 = (input.wais4_mcod_4a ?? 0) + (input.wais4_mcod_4b ?? 0);
  const wais_mcod_5 = (input.wais4_mcod_5a ?? 0) + (input.wais4_mcod_5b ?? 0);
  const wais_mcod_6 = (input.wais4_mcod_6a ?? 0) + (input.wais4_mcod_6b ?? 0);
  const wais_mcod_7 = (input.wais4_mcod_7a ?? 0) + (input.wais4_mcod_7b ?? 0);
  const wais_mcod_8 = (input.wais4_mcod_8a ?? 0) + (input.wais4_mcod_8b ?? 0);
  
  const wais_mcoi_1 = (input.wais4_mcoi_1a ?? 0) + (input.wais4_mcoi_1b ?? 0);
  const wais_mcoi_2 = (input.wais4_mcoi_2a ?? 0) + (input.wais4_mcoi_2b ?? 0);
  const wais_mcoi_3 = (input.wais4_mcoi_3a ?? 0) + (input.wais4_mcoi_3b ?? 0);
  const wais_mcoi_4 = (input.wais4_mcoi_4a ?? 0) + (input.wais4_mcoi_4b ?? 0);
  const wais_mcoi_5 = (input.wais4_mcoi_5a ?? 0) + (input.wais4_mcoi_5b ?? 0);
  const wais_mcoi_6 = (input.wais4_mcoi_6a ?? 0) + (input.wais4_mcoi_6b ?? 0);
  const wais_mcoi_7 = (input.wais4_mcoi_7a ?? 0) + (input.wais4_mcoi_7b ?? 0);
  const wais_mcoi_8 = (input.wais4_mcoi_8a ?? 0) + (input.wais4_mcoi_8b ?? 0);
  
  const wais_mcoc_1 = (input.wais4_mcoc_1a ?? 0) + (input.wais4_mcoc_1b ?? 0);
  const wais_mcoc_2 = (input.wais4_mcoc_2a ?? 0) + (input.wais4_mcoc_2b ?? 0);
  const wais_mcoc_3 = (input.wais4_mcoc_3a ?? 0) + (input.wais4_mcoc_3b ?? 0);
  const wais_mcoc_4 = (input.wais4_mcoc_4a ?? 0) + (input.wais4_mcoc_4b ?? 0);
  const wais_mcoc_5 = (input.wais4_mcoc_5a ?? 0) + (input.wais4_mcoc_5b ?? 0);
  const wais_mcoc_6 = (input.wais4_mcoc_6a ?? 0) + (input.wais4_mcoc_6b ?? 0);
  const wais_mcoc_7 = (input.wais4_mcoc_7a ?? 0) + (input.wais4_mcoc_7b ?? 0);
  const wais_mcoc_8 = (input.wais4_mcoc_8a ?? 0) + (input.wais4_mcoc_8b ?? 0);
  
  // Calculate section totals using specialized functions
  const wais_mcod_tot = calculateSectionTotalDirect(directItems);
  const wais_mcoi_tot = calculateSectionTotalInverse(inverseItems);
  const wais_mcoc_tot = calculateSectionTotalCroissant(sequencingItems);
  
  // Calculate total raw score
  const wais_mc_tot = wais_mcod_tot + wais_mcoi_tot + wais_mcoc_tot;
  
  // Calculate empan for each section using specialized functions
  const wais_mc_end = calculateEmpanDirect(directItems);
  const wais_mc_env = calculateEmpanInverse(inverseItems);
  const wais_mc_cro = calculateEmpanCroissant(sequencingItems);
  
  // Calculate empan Z-scores
  const wais_mc_end_std = calculateEmpanZScore(
    wais_mc_end,
    input.patient_age,
    EMPAN_ENDROIT_MEANS,
    EMPAN_ENDROIT_SDS
  );
  
  const wais_mc_env_std = calculateEmpanZScore(
    wais_mc_env,
    input.patient_age,
    EMPAN_ENVERS_MEANS,
    EMPAN_ENVERS_SDS
  );
  
  const wais_mc_cro_std = calculateEmpanZScore(
    wais_mc_cro,
    input.patient_age,
    EMPAN_CROISSANT_MEANS,
    EMPAN_CROISSANT_SDS
  );
  
  // Calculate empan difference (endroit - envers)
  const wais_mc_emp = wais_mc_end - wais_mc_env;
  
  // Calculate standardized score based on age and raw score
  const wais_mc_std = calculateStandardizedScore(wais_mc_tot, input.patient_age);
  
  // Calculate standardized value: (standard_score - 10) / 3
  const wais_mc_cr = Number(((wais_mc_std - 10) / 3).toFixed(2));
  
  return {
    // Individual item scores
    wais_mcod_1,
    wais_mcod_2,
    wais_mcod_3,
    wais_mcod_4,
    wais_mcod_5,
    wais_mcod_6,
    wais_mcod_7,
    wais_mcod_8,
    
    wais_mcoi_1,
    wais_mcoi_2,
    wais_mcoi_3,
    wais_mcoi_4,
    wais_mcoi_5,
    wais_mcoi_6,
    wais_mcoi_7,
    wais_mcoi_8,
    
    wais_mcoc_1,
    wais_mcoc_2,
    wais_mcoc_3,
    wais_mcoc_4,
    wais_mcoc_5,
    wais_mcoc_6,
    wais_mcoc_7,
    wais_mcoc_8,
    
    // Section totals with naming convention
    wais_mcod_tot,
    wais_mcoi_tot,
    wais_mcoc_tot,
    
    // Legacy field names (backward compatibility)
    mcod_total: wais_mcod_tot,
    mcoi_total: wais_mcoi_tot,
    mcoc_total: wais_mcoc_tot,
    raw_score: wais_mc_tot,
    standardized_score: wais_mc_std,
    empan_direct: wais_mc_end,
    empan_inverse: wais_mc_env,
    empan_croissant: wais_mc_cro,
    
    // Empan with naming convention
    wais_mc_end,
    wais_mc_env,
    wais_mc_cro,
    
    // Empan Z-scores
    wais_mc_end_std,
    wais_mc_env_std,
    wais_mc_cro_std,
    
    // Empan difference
    wais_mc_emp,
    
    // Total and standard scores with naming convention
    wais_mc_tot,
    wais_mc_std,
    wais_mc_cr
  };
}

