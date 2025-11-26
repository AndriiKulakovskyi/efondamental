// eFondaMental Platform - WAIS-IV Digit Span Scoring
// Scoring functions for the Memoire des chiffres subtest
// Based on WAIS-IV French adaptation norms

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
 * Get the age group index for norm lookup
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
  mcod_1a: number;
  mcod_1b: number;
  mcod_2a?: number | null;
  mcod_2b?: number | null;
  mcod_3a?: number | null;
  mcod_3b?: number | null;
  mcod_4a?: number | null;
  mcod_4b?: number | null;
  mcod_5a?: number | null;
  mcod_5b?: number | null;
  mcod_6a?: number | null;
  mcod_6b?: number | null;
  mcod_7a?: number | null;
  mcod_7b?: number | null;
  mcod_8a?: number | null;
  mcod_8b?: number | null;
  
  // Inverse order
  mcoi_1a: number;
  mcoi_1b: number;
  mcoi_2a?: number | null;
  mcoi_2b?: number | null;
  mcoi_3a?: number | null;
  mcoi_3b?: number | null;
  mcoi_4a?: number | null;
  mcoi_4b?: number | null;
  mcoi_5a?: number | null;
  mcoi_5b?: number | null;
  mcoi_6a?: number | null;
  mcoi_6b?: number | null;
  mcoi_7a?: number | null;
  mcoi_7b?: number | null;
  mcoi_8a?: number | null;
  mcoi_8b?: number | null;
  
  // Sequencing order
  mcoc_1a: number;
  mcoc_1b: number;
  mcoc_2a?: number | null;
  mcoc_2b?: number | null;
  mcoc_3a?: number | null;
  mcoc_3b?: number | null;
  mcoc_4a?: number | null;
  mcoc_4b?: number | null;
  mcoc_5a?: number | null;
  mcoc_5b?: number | null;
  mcoc_6a?: number | null;
  mcoc_6b?: number | null;
  mcoc_7a?: number | null;
  mcoc_7b?: number | null;
  mcoc_8a?: number | null;
  mcoc_8b?: number | null;
}

/**
 * Interface for computed scores output
 */
interface DigitSpanScores {
  mcod_total: number;
  mcoi_total: number;
  mcoc_total: number;
  raw_score: number;
  standardized_score: number;
  empan_direct: number;
  empan_inverse: number;
  empan_croissant: number;
}

/**
 * Calculate the empan (longest span) for a section
 * The empan is the index of the last item where at least one trial was correct
 * Items are numbered 1-8, so empan = 0 means no items passed
 */
function calculateEmpan(itemScores: (number | null | undefined)[][]): number {
  let empan = 0;
  
  for (let i = 0; i < itemScores.length; i++) {
    const [trialA, trialB] = itemScores[i];
    const itemSum = (trialA ?? 0) + (trialB ?? 0);
    
    // If item sum is 0, stop counting (discontinue rule applies)
    if (itemSum === 0) {
      break;
    }
    
    // Item passed (at least one trial correct), update empan
    empan = i + 1;
  }
  
  return empan;
}

/**
 * Calculate section total with discontinue rule
 * Sum scores until two consecutive zeros in item sums
 */
function calculateSectionTotal(itemScores: (number | null | undefined)[][]): number {
  let total = 0;
  
  for (let i = 0; i < itemScores.length; i++) {
    const [trialA, trialB] = itemScores[i];
    const itemSum = (trialA ?? 0) + (trialB ?? 0);
    
    // If item sum is 0, check if discontinue rule applies
    if (itemSum === 0) {
      // Check next item too (if exists)
      if (i + 1 < itemScores.length) {
        const [nextA, nextB] = itemScores[i + 1];
        const nextSum = (nextA ?? 0) + (nextB ?? 0);
        if (nextSum === 0) {
          // Two consecutive zeros, stop
          break;
        }
      } else {
        // Last item failed
        break;
      }
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
    [input.mcod_1a, input.mcod_1b],
    [input.mcod_2a, input.mcod_2b],
    [input.mcod_3a, input.mcod_3b],
    [input.mcod_4a, input.mcod_4b],
    [input.mcod_5a, input.mcod_5b],
    [input.mcod_6a, input.mcod_6b],
    [input.mcod_7a, input.mcod_7b],
    [input.mcod_8a, input.mcod_8b]
  ];
  
  // Organize inverse order items
  const inverseItems: (number | null | undefined)[][] = [
    [input.mcoi_1a, input.mcoi_1b],
    [input.mcoi_2a, input.mcoi_2b],
    [input.mcoi_3a, input.mcoi_3b],
    [input.mcoi_4a, input.mcoi_4b],
    [input.mcoi_5a, input.mcoi_5b],
    [input.mcoi_6a, input.mcoi_6b],
    [input.mcoi_7a, input.mcoi_7b],
    [input.mcoi_8a, input.mcoi_8b]
  ];
  
  // Organize sequencing order items
  const sequencingItems: (number | null | undefined)[][] = [
    [input.mcoc_1a, input.mcoc_1b],
    [input.mcoc_2a, input.mcoc_2b],
    [input.mcoc_3a, input.mcoc_3b],
    [input.mcoc_4a, input.mcoc_4b],
    [input.mcoc_5a, input.mcoc_5b],
    [input.mcoc_6a, input.mcoc_6b],
    [input.mcoc_7a, input.mcoc_7b],
    [input.mcoc_8a, input.mcoc_8b]
  ];
  
  // Calculate section totals
  const mcod_total = calculateSectionTotal(directItems);
  const mcoi_total = calculateSectionTotal(inverseItems);
  const mcoc_total = calculateSectionTotal(sequencingItems);
  
  // Calculate total raw score
  const raw_score = mcod_total + mcoi_total + mcoc_total;
  
  // Calculate empan for each section
  const empan_direct = calculateEmpan(directItems);
  const empan_inverse = calculateEmpan(inverseItems);
  const empan_croissant = calculateEmpan(sequencingItems);
  
  // Calculate standardized score based on age and raw score
  const standardized_score = calculateStandardizedScore(raw_score, input.patient_age);
  
  return {
    mcod_total,
    mcoi_total,
    mcoc_total,
    raw_score,
    standardized_score,
    empan_direct,
    empan_inverse,
    empan_croissant
  };
}

