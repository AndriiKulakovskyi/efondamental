/**
 * WAIS-III Digit Span (Mémoire des chiffres) Scoring Service
 * 
 * This module implements the scoring logic for the WAIS-III Digit Span subtest,
 * including Forward (Ordre Direct) and Backward (Ordre Inverse) components.
 * Uses WAIS-III norms (different from WAIS-IV).
 */

export interface Wais3DigitSpanInput {
  patient_age: number;
  education_level?: number;
  // Forward items
  mcod_1a: number; mcod_1b: number;
  mcod_2a: number; mcod_2b: number;
  mcod_3a: number; mcod_3b: number;
  mcod_4a: number; mcod_4b: number;
  mcod_5a: number; mcod_5b: number;
  mcod_6a: number; mcod_6b: number;
  mcod_7a: number; mcod_7b: number;
  mcod_8a: number; mcod_8b: number;
  // Backward items
  mcoi_1a: number; mcoi_1b: number;
  mcoi_2a: number; mcoi_2b: number;
  mcoi_3a: number; mcoi_3b: number;
  mcoi_4a: number; mcoi_4b: number;
  mcoi_5a: number; mcoi_5b: number;
  mcoi_6a: number; mcoi_6b: number;
  mcoi_7a: number; mcoi_7b: number;
}

export interface Wais3DigitSpanScores {
  wais_mcod_tot: number;   // Forward raw score
  wais_mcoi_tot: number;   // Backward raw score
  wais_mc_tot: number;     // Total raw score
  wais_mc_end: number;     // Forward span
  wais_mc_env: number;     // Backward span
  wais_mc_emp: number;     // Span difference
  wais_mc_std: number;     // Standard score
  wais_mc_cr: number;      // Standardized value
  wais_mc_end_z: number | null;  // Forward span z-score
  wais_mc_env_z: number | null;  // Backward span z-score
}

// WAIS-III Standard score norm table (different from WAIS-IV)
const WAIS3_DIGIT_SPAN_NORMS: Record<string, number[]> = {
  '16-17': [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 22, 24, 25, 26, 27, 30],
  '18-19': [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 21, 22, 23, 24, 25, 27, 28, 30],
  '20-24': [9, 10, 11, 11, 12, 13, 14, 15, 17, 19, 20, 21, 22, 24, 25, 26, 28, 29, 30],
  '25-29': [7, 8, 9, 10, 11, 12, 14, 15, 16, 18, 19, 20, 22, 24, 25, 26, 28, 29, 30],
  '30-34': [7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 20, 22, 24, 25, 26, 28, 29, 30],
  '35-44': [7, 8, 9, 9, 10, 11, 13, 14, 15, 16, 18, 20, 22, 23, 24, 25, 26, 28, 30],
  '45-54': [7, 8, 9, 9, 10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 25, 26, 27, 28, 30],
  '55-64': [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 25, 26, 27, 30],
  '65-69': [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 21, 22, 24, 26, 27, 30],
  '70-74': [5, 6, 7, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 22, 24, 26, 30],
  '75-79': [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 30],
  '80+': [4, 5, 6, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 19, 20, 21, 22, 30]
};

// Span standardization tables by age and education level
// Education levels: 0=<2y, 1=2-11y, 2=12y, 3=13-14y, 4=>=15y
const SPAN_ENDROIT_MEAN: Record<string, (number | null)[]> = {
  '16-17': [null, 6.55, null, null, null],
  '18-19': [null, 6.24, 6.53, 6.77, null],
  '20-24': [null, 5.98, 6.41, 6.25, 6.78],
  '25-29': [5.5, 5.8, 6.5, 6.67, 6.48],
  '30-34': [5.5, 5.8, 6.5, 6.67, 6.48], // Use 25-29 for 30-34
  '35-44': [5.43, 5.76, 6.33, 6.25, 6.68],
  '45-54': [5.65, 5.79, 7, 6.4, 6.3],
  '55-64': [5.55, 6.03, 5.92, 6, 6.5],
  '65-69': [5, 5.48, 6.56, 6.44, 6.27],
  '70-74': [5.07, 5.67, 5.56, 6.33, 5.64],
  '75-79': [4.65, 5.43, 5.5, 5, 6],
  '80+': [4.65, 5.43, 5.5, 5, 6] // Use 75-79 for 80+
};

const SPAN_ENDROIT_SD: Record<string, (number | null)[]> = {
  '16-17': [null, 1.17, null, null, null],
  '18-19': [null, 1.15, 1.3, 1.3, null],
  '20-24': [null, 1.03, 0.94, 0.99, 1.11],
  '25-29': [1.51, 1.08, 1.02, 1.2, 0.81],
  '30-34': [1.51, 1.08, 1.02, 1.2, 0.81], // Use 25-29 for 30-34
  '35-44': [1.12, 1.21, 0.89, 1.14, 1.38],
  '45-54': [1.1, 1.12, 1.33, 0.89, 0.95],
  '55-64': [1.22, 1.16, 1, 1.26, 1.27],
  '65-69': [1.22, 1.15, 1.24, 0.88, 1.19],
  '70-74': [1.04, 1.11, 0.88, 1.15, 1.01],
  '75-79': [0.84, 1.08, 0.53, 0.71, 1.1],
  '80+': [0.84, 1.08, 0.53, 0.71, 1.1] // Use 75-79 for 80+
};

const SPAN_ENVERS_MEAN: Record<string, (number | null)[]> = {
  '16-17': [null, 5.02, null, null, null],
  '18-19': [null, 4.61, 5.07, 5, null],
  '20-24': [null, 4.78, 4.88, 4.92, 5.5],
  '25-29': [4.39, 4.31, 5.21, 4.81, 5.05],
  '30-34': [4.39, 4.31, 5.21, 4.81, 5.05], // Use 25-29 for 30-34
  '35-44': [4.14, 4.34, 5.17, 4.42, 5.2],
  '45-54': [4.13, 4.26, 5.5, 4.8, 4.6],
  '55-64': [4.05, 4.47, 4.5, 5, 4.9],
  '65-69': [3.51, 4.48, 5.22, 5, 4.18],
  '70-74': [3.41, 4.07, 4.22, 4, 4.14],
  '75-79': [3.03, 3.9, 4.13, 4.4, 4.33],
  '80+': [3.03, 3.9, 4.13, 4.4, 4.33] // Use 75-79 for 80+
};

const SPAN_ENVERS_SD: Record<string, (number | null)[]> = {
  '16-17': [null, 1.27, null, null, null],
  '18-19': [null, 1.15, 1.22, 1.29, null],
  '20-24': [null, 1.21, 1.32, 1.35, 1.29],
  '25-29': [0.52, 1.35, 0.97, 1.25, 1.5],
  '30-34': [0.52, 1.35, 0.97, 1.25, 1.5], // Use 25-29 for 30-34
  '35-44': [1.24, 1.11, 1.34, 1.44, 1.58],
  '45-54': [0.88, 1.05, 1.65, 0.84, 0.84],
  '55-64': [0.87, 1.04, 0.67, 0.89, 1.97],
  '65-69': [0.96, 1, 1.39, 1.41, 1.17],
  '70-74': [0.96, 1.11, 1.48, 1, 0.86],
  '75-79': [0.85, 0.83, 1.13, 0.55, 0.82],
  '80+': [0.85, 0.83, 1.13, 0.55, 0.82] // Use 75-79 for 80+
};

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

function findStandardScore(rawScore: number, norms: number[]): number {
  for (let i = 0; i < norms.length; i++) {
    if (rawScore <= norms[i]) return i + 1;
  }
  return 19;
}

function calculateForwardSpan(input: Wais3DigitSpanInput): number {
  // Forward span: number of digits at the highest level passed
  // Item 1 = 2 digits, Item 2 = 3 digits, ..., Item 8 = 9 digits
  let span = 0;
  
  if (input.mcod_1a === 1 || input.mcod_1b === 1) span = 2; // Item 1 = 2 digits
  if (input.mcod_2a === 1 || input.mcod_2b === 1) span = 3; // Item 2 = 3 digits
  if (input.mcod_3a === 1 || input.mcod_3b === 1) span = 4; // Item 3 = 4 digits
  if (input.mcod_4a === 1 || input.mcod_4b === 1) span = 5; // Item 4 = 5 digits
  if (input.mcod_5a === 1 || input.mcod_5b === 1) span = 6; // Item 5 = 6 digits
  if (input.mcod_6a === 1 || input.mcod_6b === 1) span = 7; // Item 6 = 7 digits
  if (input.mcod_7a === 1 || input.mcod_7b === 1) span = 8; // Item 7 = 8 digits
  if (input.mcod_8a === 1 || input.mcod_8b === 1) span = 9; // Item 8 = 9 digits
  
  return span;
}

function calculateBackwardSpan(input: Wais3DigitSpanInput): number {
  // Backward span: number of digits at the highest level passed
  // Item 1 = 2 digits, Item 2 = 3 digits, ..., Item 7 = 8 digits
  let span = 0;
  
  if (input.mcoi_1a === 1 || input.mcoi_1b === 1) span = 2; // Item 1 = 2 digits
  if (input.mcoi_2a === 1 || input.mcoi_2b === 1) span = 3; // Item 2 = 3 digits
  if (input.mcoi_3a === 1 || input.mcoi_3b === 1) span = 4; // Item 3 = 4 digits
  if (input.mcoi_4a === 1 || input.mcoi_4b === 1) span = 5; // Item 4 = 5 digits
  if (input.mcoi_5a === 1 || input.mcoi_5b === 1) span = 6; // Item 5 = 6 digits
  if (input.mcoi_6a === 1 || input.mcoi_6b === 1) span = 7; // Item 6 = 7 digits
  if (input.mcoi_7a === 1 || input.mcoi_7b === 1) span = 8; // Item 7 = 8 digits
  
  return span;
}

function calculateSpanZScore(
  span: number,
  age: number,
  educationLevel: number | undefined,
  meanTable: Record<string, (number | null)[]>,
  sdTable: Record<string, (number | null)[]>
): number | null {
  if (educationLevel === undefined || educationLevel < 0 || educationLevel > 4) {
    return null;
  }
  
  const ageGroup = getAgeGroup(age);
  const mean = meanTable[ageGroup]?.[educationLevel];
  const sd = sdTable[ageGroup]?.[educationLevel];
  
  if (mean === null || mean === undefined || sd === null || sd === undefined || sd === 0) {
    return null;
  }
  
  return Number(((span - mean) / sd).toFixed(2));
}

export function calculateWais3DigitSpanScores(input: Wais3DigitSpanInput): Wais3DigitSpanScores {
  // Calculate forward raw score
  const wais_mcod_tot = (
    input.mcod_1a + input.mcod_1b +
    input.mcod_2a + input.mcod_2b +
    input.mcod_3a + input.mcod_3b +
    input.mcod_4a + input.mcod_4b +
    input.mcod_5a + input.mcod_5b +
    input.mcod_6a + input.mcod_6b +
    input.mcod_7a + input.mcod_7b +
    input.mcod_8a + input.mcod_8b
  );
  
  // Calculate backward raw score
  const wais_mcoi_tot = (
    input.mcoi_1a + input.mcoi_1b +
    input.mcoi_2a + input.mcoi_2b +
    input.mcoi_3a + input.mcoi_3b +
    input.mcoi_4a + input.mcoi_4b +
    input.mcoi_5a + input.mcoi_5b +
    input.mcoi_6a + input.mcoi_6b +
    input.mcoi_7a + input.mcoi_7b
  );
  
  // Total raw score
  const wais_mc_tot = wais_mcod_tot + wais_mcoi_tot;
  
  // Calculate spans
  const wais_mc_end = calculateForwardSpan(input);
  const wais_mc_env = calculateBackwardSpan(input);
  const wais_mc_emp = wais_mc_end - wais_mc_env;
  
  // Standard score lookup
  const ageGroup = getAgeGroup(input.patient_age);
  const wais_mc_std = findStandardScore(wais_mc_tot, WAIS3_DIGIT_SPAN_NORMS[ageGroup]);
  
  // Standardized value (mean=10, SD=3)
  const wais_mc_cr = Number(((wais_mc_std - 10) / 3).toFixed(2));
  
  // Calculate span z-scores based on education level
  const wais_mc_end_z = calculateSpanZScore(
    wais_mc_end, 
    input.patient_age, 
    input.education_level,
    SPAN_ENDROIT_MEAN,
    SPAN_ENDROIT_SD
  );
  
  const wais_mc_env_z = calculateSpanZScore(
    wais_mc_env, 
    input.patient_age, 
    input.education_level,
    SPAN_ENVERS_MEAN,
    SPAN_ENVERS_SD
  );
  
  return {
    wais_mcod_tot,
    wais_mcoi_tot,
    wais_mc_tot,
    wais_mc_end,
    wais_mc_env,
    wais_mc_emp,
    wais_mc_std,
    wais_mc_cr,
    wais_mc_end_z,
    wais_mc_env_z
  };
}

