// ============================================================================
// WAIS-IV Code, Symboles & IVT - Scoring Functions
// ============================================================================
// This module contains comprehensive scoring logic for WAIS-IV Processing Speed
// subtests (Code & Symbol Search) and composite IVT (Processing Speed Index).
// WAIS-IV (Wechsler, 2008) uses different norms than WAIS-III (1997)
// ============================================================================

/**
 * WAIS-IV Code Normative Tables
 * Each age group has 19 threshold values for standard scores 1-19
 * Algorithm: Find k where raw_score > threshold[k], then standard_score = k + 1
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
 * WAIS-IV Symbol Search (Symboles) Normative Tables
 * Each age group has 19 threshold values for standard scores 1-19
 * Same algorithm as Code subtest
 */
const WAIS4_SYMBOLES_NORMS: Record<string, number[]> = {
  age_16: [12, 14, 16, 18, 21, 24, 27, 29, 31, 33, 35, 38, 40, 42, 44, 47, 49, 51, 60],
  age_18: [14, 16, 19, 21, 23, 25, 29, 31, 33, 35, 38, 40, 42, 44, 46, 49, 51, 53, 60],
  age_20: [14, 16, 19, 21, 23, 25, 28, 31, 34, 37, 39, 41, 44, 47, 49, 51, 53, 55, 60],
  age_25: [11, 13, 16, 19, 22, 25, 27, 30, 33, 36, 38, 41, 44, 47, 49, 51, 53, 55, 60],
  age_30: [9, 11, 13, 16, 20, 24, 27, 30, 33, 36, 38, 40, 42, 44, 46, 49, 52, 54, 60],
  age_35: [8, 10, 13, 16, 19, 23, 25, 28, 32, 35, 37, 40, 42, 44, 46, 48, 51, 53, 60],
  age_45: [1, 3, 6, 10, 15, 18, 22, 25, 28, 31, 34, 38, 41, 44, 46, 48, 51, 53, 60],
  age_55: [0, 2, 5, 8, 11, 15, 19, 22, 25, 28, 30, 33, 36, 39, 43, 46, 49, 51, 60],
  age_65: [-1, 1, 4, 7, 11, 15, 19, 22, 24, 27, 29, 32, 35, 38, 42, 45, 48, 50, 60],
  age_70: [-1, 0, 3, 7, 10, 13, 15, 17, 19, 22, 24, 27, 29, 32, 36, 40, 43, 46, 60],
  age_75: [-1, -1, 1, 4, 7, 11, 14, 16, 18, 20, 22, 24, 26, 27, 29, 32, 35, 38, 60]
};

/**
 * WAIS-IV IVT (Processing Speed Index) Conversion Table
 * Maps sum of Code + Symboles standard scores (2-38) to IVT composite score,
 * percentile rank, and 95% confidence interval
 */
const WAIS4_IVT_CONVERSION: Record<number, { ivt: number; percentile: string; ci95: string }> = {
  2: { ivt: 50, percentile: '<0.1', ci95: '47-65' },
  3: { ivt: 52, percentile: '0.1', ci95: '49-67' },
  4: { ivt: 55, percentile: '0.1', ci95: '51-70' },
  5: { ivt: 58, percentile: '0.3', ci95: '54-72' },
  6: { ivt: 61, percentile: '0.5', ci95: '57-75' },
  7: { ivt: 64, percentile: '1', ci95: '59-77' },
  8: { ivt: 66, percentile: '1', ci95: '61-79' },
  9: { ivt: 69, percentile: '2', ci95: '64-82' },
  10: { ivt: 72, percentile: '3', ci95: '66-84' },
  11: { ivt: 75, percentile: '5', ci95: '69-87' },
  12: { ivt: 78, percentile: '7', ci95: '72-90' },
  13: { ivt: 81, percentile: '10', ci95: '74-92' },
  14: { ivt: 84, percentile: '14', ci95: '77-95' },
  15: { ivt: 86, percentile: '18', ci95: '79-97' },
  16: { ivt: 89, percentile: '23', ci95: '81-99' },
  17: { ivt: 92, percentile: '30', ci95: '84-102' },
  18: { ivt: 94, percentile: '34', ci95: '86-104' },
  19: { ivt: 97, percentile: '42', ci95: '88-106' },
  20: { ivt: 100, percentile: '50', ci95: '91-109' },
  21: { ivt: 102, percentile: '55', ci95: '93-111' },
  22: { ivt: 105, percentile: '63', ci95: '95-113' },
  23: { ivt: 108, percentile: '70', ci95: '98-116' },
  24: { ivt: 111, percentile: '77', ci95: '101-119' },
  25: { ivt: 114, percentile: '82', ci95: '103-121' },
  26: { ivt: 117, percentile: '87', ci95: '106-124' },
  27: { ivt: 120, percentile: '91', ci95: '109-127' },
  28: { ivt: 123, percentile: '94', ci95: '111-129' },
  29: { ivt: 126, percentile: '96', ci95: '114-132' },
  30: { ivt: 129, percentile: '97', ci95: '116-134' },
  31: { ivt: 131, percentile: '98', ci95: '118-136' },
  32: { ivt: 134, percentile: '99', ci95: '121-139' },
  33: { ivt: 137, percentile: '99', ci95: '123-141' },
  34: { ivt: 140, percentile: '99.6', ci95: '126-144' },
  35: { ivt: 143, percentile: '99.8', ci95: '129-147' },
  36: { ivt: 145, percentile: '99.9', ci95: '130-149' },
  37: { ivt: 148, percentile: '99.9', ci95: '133-151' },
  38: { ivt: 150, percentile: '>99.9', ci95: '135-153' }
};

/**
 * Determine age bracket for norm lookup
 * Maps patient age to appropriate normative group
 * @param age Patient's age (16-120)
 * @returns Age group key for normative tables
 */
function getAgeGroup(age: number): string {
  if (age < 18) return 'age_16';      // 16-17
  if (age < 20) return 'age_18';      // 18-19
  if (age < 25) return 'age_20';      // 20-24
  if (age < 30) return 'age_25';      // 25-29
  if (age < 35) return 'age_30';      // 30-34
  if (age < 45) return 'age_35';      // 35-44
  if (age < 55) return 'age_45';      // 45-54
  if (age < 65) return 'age_55';      // 55-64
  if (age < 70) return 'age_65';      // 65-69
  if (age < 75) return 'age_70';      // 70-74
  return 'age_75';                    // 75+
}

/**
 * Find standard score using threshold lookup algorithm
 * @param rawScore Raw test score
 * @param thresholds Array of 19 threshold values
 * @returns Standard score (1-19)
 */
function findStandardScore(rawScore: number, thresholds: number[]): number {
  let k = 0;
  while (k < 18 && rawScore > thresholds[k]) {
    k++;
  }
  return k + 1;
}

/**
 * Calculate z-score (standardized value)
 * @param standardScore Standard score (1-19)
 * @returns Z-score with mean=10, SD=3, rounded to 2 decimals
 */
function calculateZScore(standardScore: number): number {
  return Number(((standardScore - 10) / 3).toFixed(2));
}

// ============================================================================
// Input/Output Interfaces
// ============================================================================

/**
 * Input data for WAIS-IV Code, Symboles & IVT scoring
 */
export interface Wais4CodeSymbolesInput {
  patient_age: number;           // Age (16-120)
  wais_cod_tot: number;          // Code: Total correctly filled boxes (0-135)
  wais_cod_err?: number;         // Code: Incorrect boxes (collected but not used in scoring)
  wais_symb_tot?: number;        // Symboles: Total correctly filled boxes (0-60)
  wais_symb_err?: number;        // Symboles: Incorrect boxes (0-60, subtracted from total)
}

/**
 * Computed scores for WAIS-IV Code, Symboles & IVT
 */
export interface Wais4CodeSymbolesScores {
  // Code subtest scores
  wais_cod_brut: number;         // Code raw score
  wais_cod_std: number;          // Code standard score (1-19)
  wais_cod_cr: number;           // Code z-score
  
  // Symboles subtest scores (optional - only if input provided)
  wais_symb_brut?: number;       // Symboles raw score
  wais_symb_std?: number;        // Symboles standard score (1-19)
  wais_symb_cr?: number;         // Symboles z-score
  
  // IVT composite scores (optional - only if both subtests completed)
  wais_somme_ivt?: number;       // Sum of standard scores (2-38)
  wais_ivt?: number;             // IVT composite score (50-150)
  wais_ivt_rang?: string;        // Percentile rank
  wais_ivt_95?: string;          // 95% confidence interval
}

// ============================================================================
// Main Scoring Function
// ============================================================================

/**
 * Calculate all WAIS-IV Code, Symboles & IVT scores
 * Handles backward compatibility - works with Code-only or full data
 * @param input Patient data and raw scores
 * @returns Computed scores for all completed subtests and composite
 */
export function calculateWais4CodeSymbolesScores(
  input: Wais4CodeSymbolesInput
): Wais4CodeSymbolesScores {
  const ageGroup = getAgeGroup(input.patient_age);
  
  // ========================================
  // Code Subtest Scoring (Always Required)
  // ========================================
  // Raw score = total correct (errors are NOT subtracted in WAIS-IV Code)
  const wais_cod_brut = input.wais_cod_tot;
  const wais_cod_std = findStandardScore(wais_cod_brut, WAIS4_CODE_NORMS[ageGroup]);
  const wais_cod_cr = calculateZScore(wais_cod_std);
  
  const result: Wais4CodeSymbolesScores = {
    wais_cod_brut,
    wais_cod_std,
    wais_cod_cr
  };
  
  // ========================================
  // Symboles Subtest Scoring (Optional)
  // ========================================
  if (input.wais_symb_tot !== undefined && input.wais_symb_tot !== null) {
    // Raw score = total correct - errors (different from Code!)
    const wais_symb_brut = input.wais_symb_tot - (input.wais_symb_err || 0);
    const wais_symb_std = findStandardScore(wais_symb_brut, WAIS4_SYMBOLES_NORMS[ageGroup]);
    const wais_symb_cr = calculateZScore(wais_symb_std);
    
    result.wais_symb_brut = wais_symb_brut;
    result.wais_symb_std = wais_symb_std;
    result.wais_symb_cr = wais_symb_cr;
    
    // ========================================
    // IVT Composite Scoring (Requires Both Subtests)
    // ========================================
    const wais_somme_ivt = wais_cod_std + wais_symb_std;
    
    // Clamp sum to valid range (2-38) for lookup
    const clampedSum = Math.max(2, Math.min(38, wais_somme_ivt));
    const ivtData = WAIS4_IVT_CONVERSION[clampedSum];
    
    if (ivtData) {
      result.wais_somme_ivt = wais_somme_ivt;
      result.wais_ivt = ivtData.ivt;
      result.wais_ivt_rang = ivtData.percentile;
      result.wais_ivt_95 = ivtData.ci95;
    }
  }
  
  return result;
}

// ============================================================================
// Backward Compatibility - Legacy Code-only function
// ============================================================================

/**
 * Legacy input interface for backward compatibility
 * @deprecated Use Wais4CodeSymbolesInput instead
 */
export interface Wais4CodeInput {
  patient_age: number;
  wais_cod_tot: number;
  wais_cod_err?: number;
}

/**
 * Legacy output interface for backward compatibility
 * @deprecated Use Wais4CodeSymbolesScores instead
 */
export interface Wais4CodeScores {
  wais_cod_brut: number;
  wais_cod_std: number;
  wais_cod_cr: number;
}

/**
 * Legacy scoring function for Code subtest only
 * Maintained for backward compatibility with existing code
 * @deprecated Use calculateWais4CodeSymbolesScores instead
 */
export function calculateWais4CodeScores(input: Wais4CodeInput): Wais4CodeScores {
  const result = calculateWais4CodeSymbolesScores(input);
  return {
    wais_cod_brut: result.wais_cod_brut,
    wais_cod_std: result.wais_cod_std,
    wais_cod_cr: result.wais_cod_cr
  };
}

// Export normative tables and utilities for potential client-side use
export { 
  WAIS4_CODE_NORMS, 
  WAIS4_SYMBOLES_NORMS, 
  WAIS4_IVT_CONVERSION,
  getAgeGroup,
  findStandardScore,
  calculateZScore
};
