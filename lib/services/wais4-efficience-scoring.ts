// ============================================================================
// WAIS-IV Efficience Intellectuelle - Scoring Functions
// ============================================================================
// Denney 2015 QI Estimation and Barona Index (Gregory, 1987) calculations
// For schizophrenia neuropsychological evaluation
// ============================================================================

import {
  QI_CONVERSION,
  ICV_CONVERSION,
  IRP_CONVERSION,
  IMT_CONVERSION,
  IVT_CONVERSION,
  IndexConversion,
  BARONA_CONSTANTS,
  BARONA_SEX_COEFFICIENTS,
  getBaronaAgeCoefficient,
  getIndexInterpretation,
} from '@/lib/constants/wais4-efficience-norms';

// ============================================================================
// Input/Output Interfaces
// ============================================================================

/**
 * Input data for Denney QI Estimation
 */
export interface DenneyInputs {
  info_std: number;        // Information standard score (1-19)
  wais_simi_std: number;   // Similitudes standard score (1-19)
  wais_mat_std: number;    // Matrices standard score (1-19)
  compl_im_std: number;    // Complètement d'images standard score (1-19)
  wais_mc_std: number;     // Mémoire des chiffres standard score (1-19)
  wais_arith_std: number;  // Arithmétique standard score (1-19)
  wais_cod_std: number;    // Code standard score (1-19)
}

/**
 * Individual index result
 */
export interface IndexResult {
  sum_std: number;         // Sum of standard scores (formula result)
  indice: number;          // Index value from lookup
  rang: string;            // Percentile rank
  ci95: string;            // 95% confidence interval
  interpretation: string;  // Qualitative interpretation
}

/**
 * Complete Denney indices results
 */
export interface DenneyResults {
  qi: IndexResult;   // Full Scale IQ
  icv: IndexResult;  // Verbal Comprehension Index
  irp: IndexResult;  // Perceptual Reasoning Index
  imt: IndexResult;  // Working Memory Index
  ivt: IndexResult;  // Processing Speed Index
}

/**
 * Input data for Barona expected IQ calculation
 */
export interface BaronaInputs {
  sexe: string;                    // Patient sex (M/F or male/female)
  age: number;                     // Patient age
  rad_barona_etude: number;        // Education level coefficient (1-7)
  rad_barona_profession: number;   // Profession coefficient (1-7)
}

/**
 * Barona calculation results
 */
export interface BaronaResults {
  qit_attendu: number;       // Expected IQ (Barona formula result)
  sex_coefficient: number;   // Sex coefficient used
  age_coefficient: number;   // Age coefficient used
  education_coefficient: number;  // Education coefficient
  profession_coefficient: number; // Profession coefficient
}

/**
 * Complete efficience intellectuelle results
 */
export interface EfficienceIntellectuelleResults {
  denney: DenneyResults;
  barona?: BaronaResults;
  qit_difference?: number;   // Expected - Observed IQ
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Round to specified decimal places
 */
function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Lookup index conversion with bounds handling
 */
function lookupIndex(
  sumStd: number,
  conversionTable: Record<number, IndexConversion>,
  minSum: number,
  maxSum: number
): IndexConversion {
  // Clamp to valid range
  const clampedSum = Math.max(minSum, Math.min(maxSum, Math.round(sumStd)));
  
  const conversion = conversionTable[clampedSum];
  if (conversion) {
    return conversion;
  }
  
  // Fallback for edge cases
  if (clampedSum < minSum) {
    return conversionTable[minSum];
  }
  return conversionTable[maxSum];
}

// ============================================================================
// Denney Index Calculations
// ============================================================================

/**
 * Calculate QI (Full Scale IQ) from Denney 2015
 * Formula: QI = ((Σ7 subtests) × 10) / 7
 * Note: We store the raw sum for lookup, not the formula result
 */
function calculateQI(inputs: DenneyInputs): IndexResult {
  const sum = inputs.info_std + 
              inputs.wais_simi_std + 
              inputs.wais_mat_std + 
              inputs.compl_im_std + 
              inputs.wais_mc_std + 
              inputs.wais_arith_std + 
              inputs.wais_cod_std;
  
  const conversion = lookupIndex(sum, QI_CONVERSION, 7, 133);
  
  return {
    sum_std: sum,
    indice: conversion.index,
    rang: conversion.percentile,
    ci95: conversion.ci95,
    interpretation: getIndexInterpretation(conversion.index),
  };
}

/**
 * Calculate ICV (Verbal Comprehension Index) from Denney 2015
 * Formula: ICV = (Info + Simil) × 3/2
 */
function calculateICV(inputs: DenneyInputs): IndexResult {
  const rawSum = inputs.info_std + inputs.wais_simi_std;
  const sum = Math.round((rawSum * 3) / 2);
  
  const conversion = lookupIndex(sum, ICV_CONVERSION, 3, 57);
  
  return {
    sum_std: sum,
    indice: conversion.index,
    rang: conversion.percentile,
    ci95: conversion.ci95,
    interpretation: getIndexInterpretation(conversion.index),
  };
}

/**
 * Calculate IRP (Perceptual Reasoning Index) from Denney 2015
 * Formula: IRP = (Matrices + ComplImages) × 3/2
 */
function calculateIRP(inputs: DenneyInputs): IndexResult {
  const rawSum = inputs.wais_mat_std + inputs.compl_im_std;
  const sum = Math.round((rawSum * 3) / 2);
  
  const conversion = lookupIndex(sum, IRP_CONVERSION, 3, 57);
  
  return {
    sum_std: sum,
    indice: conversion.index,
    rang: conversion.percentile,
    ci95: conversion.ci95,
    interpretation: getIndexInterpretation(conversion.index),
  };
}

/**
 * Calculate IMT (Working Memory Index) from Denney 2015
 * Formula: IMT = MemChiffres + Arithmetique
 */
function calculateIMT(inputs: DenneyInputs): IndexResult {
  const sum = inputs.wais_mc_std + inputs.wais_arith_std;
  
  const conversion = lookupIndex(sum, IMT_CONVERSION, 2, 38);
  
  return {
    sum_std: sum,
    indice: conversion.index,
    rang: conversion.percentile,
    ci95: conversion.ci95,
    interpretation: getIndexInterpretation(conversion.index),
  };
}

/**
 * Calculate IVT (Processing Speed Index) from Denney 2015
 * Formula: IVT = Code × 2
 */
function calculateIVT(inputs: DenneyInputs): IndexResult {
  const sum = inputs.wais_cod_std * 2;
  
  const conversion = lookupIndex(sum, IVT_CONVERSION, 2, 38);
  
  return {
    sum_std: sum,
    indice: conversion.index,
    rang: conversion.percentile,
    ci95: conversion.ci95,
    interpretation: getIndexInterpretation(conversion.index),
  };
}

/**
 * Calculate all Denney indices
 */
export function calculateDenneyIndices(inputs: DenneyInputs): DenneyResults {
  return {
    qi: calculateQI(inputs),
    icv: calculateICV(inputs),
    irp: calculateIRP(inputs),
    imt: calculateIMT(inputs),
    ivt: calculateIVT(inputs),
  };
}

// ============================================================================
// Barona Index Calculation
// ============================================================================

/**
 * Calculate Barona expected IQ (Gregory, 1987)
 * Formula: QIT_attendu = 0.16×Sexe + 4.27×Etude + 0.81×Profession + 0.18×Age + 78.26
 */
export function calculateBaronaExpectedIQ(inputs: BaronaInputs): BaronaResults {
  // Get sex coefficient
  const sexCoef = BARONA_SEX_COEFFICIENTS[inputs.sexe] ?? 1;
  
  // Get age coefficient
  const ageCoef = getBaronaAgeCoefficient(inputs.age);
  
  // Education and profession are already coefficients (1-7)
  const eduCoef = inputs.rad_barona_etude;
  const profCoef = inputs.rad_barona_profession;
  
  // Apply Barona formula
  const qitAttendu = 
    BARONA_CONSTANTS.sexCoefficient * sexCoef +
    BARONA_CONSTANTS.educationCoefficient * eduCoef +
    BARONA_CONSTANTS.professionCoefficient * profCoef +
    BARONA_CONSTANTS.ageCoefficient * ageCoef +
    BARONA_CONSTANTS.intercept;
  
  return {
    qit_attendu: roundTo(qitAttendu, 2),
    sex_coefficient: sexCoef,
    age_coefficient: ageCoef,
    education_coefficient: eduCoef,
    profession_coefficient: profCoef,
  };
}

// ============================================================================
// Complete Scoring Function
// ============================================================================

/**
 * Calculate all efficience intellectuelle scores
 * @param denneyInputs Subtest standard scores for Denney indices
 * @param baronaInputs Demographics for Barona expected IQ (optional)
 */
export function calculateEfficienceIntellectuelle(
  denneyInputs: DenneyInputs,
  baronaInputs?: BaronaInputs
): EfficienceIntellectuelleResults {
  // Calculate Denney indices
  const denney = calculateDenneyIndices(denneyInputs);
  
  // Calculate Barona if inputs provided
  let barona: BaronaResults | undefined;
  let qitDifference: number | undefined;
  
  if (baronaInputs && 
      baronaInputs.rad_barona_etude && 
      baronaInputs.rad_barona_profession) {
    barona = calculateBaronaExpectedIQ(baronaInputs);
    
    // Calculate difference (Expected - Observed)
    // Positive = potential deterioration
    qitDifference = roundTo(barona.qit_attendu - denney.qi.indice, 2);
  }
  
  return {
    denney,
    barona,
    qit_difference: qitDifference,
  };
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate standard score is in valid range (1-19)
 */
export function isValidStandardScore(score: number | null | undefined): boolean {
  if (score === null || score === undefined) return false;
  return Number.isInteger(score) && score >= 1 && score <= 19;
}

/**
 * Check if all Denney inputs are valid
 */
export function areAllDenneyInputsValid(inputs: Partial<DenneyInputs>): boolean {
  const fields: (keyof DenneyInputs)[] = [
    'info_std',
    'wais_simi_std',
    'wais_mat_std',
    'compl_im_std',
    'wais_mc_std',
    'wais_arith_std',
    'wais_cod_std',
  ];
  
  return fields.every(field => isValidStandardScore(inputs[field]));
}

/**
 * Check if Barona inputs are valid
 */
export function areBaronaInputsValid(inputs: Partial<BaronaInputs>): boolean {
  if (!inputs.sexe) return false;
  if (!inputs.age || inputs.age < 16) return false;
  if (!inputs.rad_barona_etude || inputs.rad_barona_etude < 1 || inputs.rad_barona_etude > 7) return false;
  if (!inputs.rad_barona_profession || inputs.rad_barona_profession < 1 || inputs.rad_barona_profession > 7) return false;
  return true;
}

// ============================================================================
// Exports
// ============================================================================

export {
  QI_CONVERSION,
  ICV_CONVERSION,
  IRP_CONVERSION,
  IMT_CONVERSION,
  IVT_CONVERSION,
  getIndexInterpretation,
};
