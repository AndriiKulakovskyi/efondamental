/**
 * WAIS-III Code, Symboles & IVT Scoring Logic
 * 
 * This file implements the scoring algorithm for the WAIS-III Code and Symboles
 * subtests, plus the derived Processing Speed Index (IVT).
 * 
 * Uses WAIS-III norm tables which differ from WAIS-IV norms.
 */

// ============================================================================
// Code Subtest Norm Table
// ============================================================================
// Each array contains max raw scores for standard scores 1-19
const WAIS3_CODE_NORMS: Record<string, number[]> = {
  '16-17': [44, 48, 51, 53, 57, 64, 69, 74, 78, 82, 86, 91, 95, 99, 102, 105, 108, 111, 133],
  '18-19': [44, 48, 51, 53, 57, 64, 69, 74, 79, 84, 90, 95, 100, 104, 109, 114, 119, 124, 133],
  '20-24': [41, 45, 48, 50, 54, 61, 66, 72, 78, 83, 89, 94, 99, 103, 108, 113, 118, 123, 133],
  '25-29': [41, 45, 48, 50, 54, 61, 66, 72, 78, 83, 89, 94, 99, 103, 108, 113, 118, 123, 133],
  '30-34': [34, 39, 44, 49, 55, 59, 64, 69, 75, 82, 88, 91, 96, 100, 105, 108, 110, 114, 133],
  '35-44': [29, 34, 40, 45, 50, 55, 61, 66, 73, 79, 84, 88, 92, 97, 100, 103, 107, 111, 133],
  '45-54': [25, 30, 34, 39, 43, 49, 55, 61, 68, 74, 79, 85, 91, 93, 95, 98, 103, 108, 133],
  '55-64': [22, 25, 28, 31, 34, 41, 47, 52, 56, 62, 69, 74, 81, 86, 93, 96, 99, 103, 133],
  '65-69': [17, 21, 26, 29, 32, 38, 43, 50, 55, 59, 64, 69, 74, 81, 86, 92, 96, 101, 133],
  '70-74': [10, 14, 20, 25, 30, 33, 36, 40, 45, 51, 57, 63, 69, 74, 80, 83, 86, 90, 133],
  '75-79': [6, 9, 13, 20, 23, 26, 31, 36, 42, 47, 52, 56, 61, 66, 71, 77, 82, 87, 133],
  '80+': [1, 3, 5, 7, 12, 16, 20, 25, 32, 39, 46, 53, 58, 63, 66, 73, 80, 84, 133]
};

// ============================================================================
// Symboles Subtest Norm Table
// ============================================================================
const WAIS3_SYMBOLES_NORMS: Record<string, number[]> = {
  '16-17': [18, 20, 23, 26, 28, 30, 31, 32, 34, 36, 39, 42, 45, 48, 50, 52, 54, 56, 60],
  '18-19': [20, 22, 24, 25, 27, 29, 31, 34, 36, 38, 41, 44, 46, 48, 50, 52, 55, 57, 60],
  '20-24': [19, 21, 23, 25, 27, 29, 31, 33, 35, 38, 41, 44, 46, 48, 50, 52, 55, 57, 60],
  '25-29': [14, 16, 18, 20, 23, 25, 27, 30, 34, 38, 41, 44, 46, 48, 50, 52, 55, 57, 60],
  '30-34': [13, 15, 17, 19, 21, 24, 26, 29, 31, 34, 38, 41, 43, 45, 48, 51, 54, 56, 60],
  '35-44': [10, 12, 14, 17, 20, 23, 26, 28, 31, 34, 37, 39, 41, 43, 46, 48, 51, 54, 60],
  '45-54': [10, 12, 14, 16, 18, 21, 23, 25, 28, 30, 32, 34, 38, 41, 44, 46, 48, 50, 60],
  '55-64': [7, 8, 10, 12, 14, 17, 20, 23, 25, 27, 29, 30, 32, 33, 35, 37, 39, 41, 60],
  '65-69': [6, 7, 9, 11, 13, 15, 17, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 60],
  '70-74': [1, 3, 4, 6, 8, 11, 14, 16, 18, 20, 23, 26, 29, 32, 34, 36, 38, 40, 60],
  '75-79': [1, 3, 4, 5, 7, 9, 11, 13, 15, 17, 19, 22, 25, 27, 30, 33, 35, 37, 60],
  '80+': [0, 1, 2, 3, 4, 5, 6, 8, 11, 14, 16, 19, 23, 27, 29, 31, 33, 34, 60]
};

// ============================================================================
// IVT Conversion Table
// ============================================================================
// Maps sum of standard scores (2-38) to [IVT Index, Percentile Rank, 95% CI]
const IVT_CONVERSION: Record<number, [number, string, string]> = {
  2: [50, '<0.1', '47-66'],
  3: [50, '<0.1', '47-66'],
  4: [54, '0.1', '51-70'],
  5: [58, '0.3', '54-73'],
  6: [61, '0.5', '57-76'],
  7: [64, '1', '60-78'],
  8: [67, '1', '62-81'],
  9: [70, '2', '65-84'],
  10: [73, '4', '67-86'],
  11: [75, '5', '69-88'],
  12: [78, '7', '72-90'],
  13: [81, '10', '74-93'],
  14: [84, '14', '77-96'],
  15: [86, '18', '79-97'],
  16: [89, '23', '81-100'],
  17: [91, '27', '83-102'],
  18: [94, '34', '85-104'],
  19: [97, '42', '88-107'],
  20: [100, '50', '91-109'],
  21: [102, '55', '92-111'],
  22: [105, '63', '95-114'],
  23: [108, '70', '98-116'],
  24: [111, '77', '100-119'],
  25: [114, '82', '103-121'],
  26: [116, '86', '104-123'],
  27: [119, '90', '107-126'],
  28: [122, '93', '110-128'],
  29: [124, '95', '111-130'],
  30: [127, '96', '114-133'],
  31: [130, '98', '116-135'],
  32: [133, '99', '119-138'],
  33: [136, '99', '122-140'],
  34: [140, '99.6', '125-144'],
  35: [143, '99.8', '128-146'],
  36: [145, '99.9', '129-148'],
  37: [148, '99.9', '132-151'],
  38: [150, '>99.9', '134-153']
};

/**
 * Determines the age group key based on patient age
 */
function getAgeGroup(age: number): string {
  if (age >= 16 && age <= 17) return '16-17';
  if (age >= 18 && age <= 19) return '18-19';
  if (age >= 20 && age <= 24) return '20-24';
  if (age >= 25 && age <= 29) return '25-29';
  if (age >= 30 && age <= 34) return '30-34';
  if (age >= 35 && age <= 44) return '35-44';
  if (age >= 45 && age <= 54) return '45-54';
  if (age >= 55 && age <= 64) return '55-64';
  if (age >= 65 && age <= 69) return '65-69';
  if (age >= 70 && age <= 74) return '70-74';
  if (age >= 75 && age <= 79) return '75-79';
  return '80+';
}

/**
 * Finds the standard score based on raw score and age-based norms
 */
function findStandardScore(rawScore: number, norms: number[]): number {
  for (let i = 0; i < norms.length; i++) {
    if (rawScore <= norms[i]) {
      return i + 1; // Standard scores are 1-indexed
    }
  }
  return 19; // Maximum standard score
}

/**
 * Gets IVT values from conversion table
 */
function getIVTValues(sumStd: number): { ivt: number; rang: string; ci95: string } {
  // Clamp to valid range
  const clampedSum = Math.max(2, Math.min(38, sumStd));
  const conversion = IVT_CONVERSION[clampedSum];
  
  if (conversion) {
    return {
      ivt: conversion[0],
      rang: conversion[1],
      ci95: conversion[2]
    };
  }
  
  // Fallback for edge cases
  return { ivt: 100, rang: '50', ci95: '91-109' };
}

/**
 * Main scoring function for WAIS-III Code, Symboles & IVT
 */
export function calculateWais3CodeSymbolesScores(data: {
  patient_age: number;
  wais_cod_tot: number;
  wais_cod_err: number;
  wais_symb_tot: number;
  wais_symb_err: number;
}): {
  wais_cod_brut: number;
  wais_cod_std: number;
  wais_cod_cr: number;
  wais_symb_brut: number;
  wais_symb_std: number;
  wais_symb_cr: number;
  wais_somme_ivt: number;
  wais_ivt: number;
  wais_ivt_rang: string;
  wais_ivt_95: string;
} {
  const ageGroup = getAgeGroup(data.patient_age);
  
  // Code subtest scoring
  // Note: Per the spec, raw score = total correct (errors ignored in this implementation)
  const wais_cod_brut = data.wais_cod_tot;
  const wais_cod_std = findStandardScore(wais_cod_brut, WAIS3_CODE_NORMS[ageGroup]);
  const wais_cod_cr = Number(((wais_cod_std - 10) / 3).toFixed(2));
  
  // Symboles subtest scoring
  // Raw score = total - errors
  const wais_symb_brut = data.wais_symb_tot - data.wais_symb_err;
  const wais_symb_std = findStandardScore(wais_symb_brut, WAIS3_SYMBOLES_NORMS[ageGroup]);
  const wais_symb_cr = Number(((wais_symb_std - 10) / 3).toFixed(2));
  
  // IVT calculation
  const wais_somme_ivt = wais_cod_std + wais_symb_std;
  const ivtValues = getIVTValues(wais_somme_ivt);
  
  return {
    wais_cod_brut,
    wais_cod_std,
    wais_cod_cr,
    wais_symb_brut,
    wais_symb_std,
    wais_symb_cr,
    wais_somme_ivt,
    wais_ivt: ivtValues.ivt,
    wais_ivt_rang: ivtValues.rang,
    wais_ivt_95: ivtValues.ci95
  };
}

// Export norm tables for client-side use
export { WAIS3_CODE_NORMS, WAIS3_SYMBOLES_NORMS, IVT_CONVERSION, getAgeGroup, findStandardScore, getIVTValues };

