/**
 * MEM-III Spatial Span (Mémoire Spatiale) Scoring Service
 * 
 * This module implements the scoring logic for the MEM-III (Wechsler Memory 
 * Scale - 3rd Edition) Spatial Span subtest, including Forward (Ordre Direct) 
 * and Backward (Ordre Inverse) components.
 */

export interface Mem3SpatialInput {
  patient_age: number;
  // Forward items
  odirect_1a: number; odirect_1b: number;
  odirect_2a: number; odirect_2b: number;
  odirect_3a: number; odirect_3b: number;
  odirect_4a: number; odirect_4b: number;
  odirect_5a: number; odirect_5b: number;
  odirect_6a: number; odirect_6b: number;
  odirect_7a: number; odirect_7b: number;
  odirect_8a: number; odirect_8b: number;
  // Backward items
  inverse_1a: number; inverse_1b: number;
  inverse_2a: number; inverse_2b: number;
  inverse_3a: number; inverse_3b: number;
  inverse_4a: number; inverse_4b: number;
  inverse_5a: number; inverse_5b: number;
  inverse_6a: number; inverse_6b: number;
  inverse_7a: number; inverse_7b: number;
  inverse_8a: number; inverse_8b: number;
}

export interface Mem3SpatialScores {
  mspatiale_odirect_tot: number;
  mspatiale_odirect_std: number;
  mspatiale_odirect_cr: number;
  mspatiale_inverse_tot: number;
  mspatiale_inverse_std: number;
  mspatiale_inverse_cr: number;
  mspatiale_total_brut: number;
  mspatiale_total_std: number;
  mspatiale_total_cr: number;
}

// Forward (Ordre Direct) standard score norm tables
const ODIRECT_NORMS: Record<string, number[]> = {
  '16-17': [3, 4, 5, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 12, 13, 14, 15, 16],
  '18-19': [2, 3, 4, 5, 6, 0, 7, 8, 0, 9, 0, 10, 11, 0, 12, 13, 14, 15, 16],
  '20-24': [1, 2, 3, 4, 5, 6, 7, 8, 0, 9, 0, 10, 11, 0, 12, 13, 14, 15, 16],
  '25-29': [1, 2, 3, 4, 5, 6, 7, 8, 0, 9, 10, 11, 0, 12, 13, 14, 15, 0, 16],
  '30-34': [1, 2, 3, 4, 5, 6, 7, 0, 8, 9, 0, 10, 11, 12, 13, 14, 0, 15, 16],
  '35-44': [1, 2, 3, 4, 5, 6, 7, 0, 8, 9, 0, 10, 11, 12, 13, 14, 0, 15, 16],
  '45-54': [1, 2, 3, 4, 0, 5, 6, 0, 7, 8, 9, 0, 10, 11, 12, 13, 14, 15, 16],
  '55-64': [1, 2, 3, 4, 0, 5, 6, 0, 7, 8, 9, 0, 10, 0, 11, 12, 13, 14, 16],
  '65-69': [1, 2, 3, 0, 4, 5, 0, 6, 0, 7, 0, 8, 9, 0, 10, 11, 12, 13, 16],
  '70-74': [1, 2, 3, 0, 4, 5, 0, 6, 0, 7, 0, 8, 9, 0, 10, 11, 12, 13, 16],
  '75-79': [0, 1, 2, 3, 0, 4, 5, 0, 6, 7, 0, 8, 0, 9, 10, 0, 11, 12, 16],
  '80+': [0, 1, 2, 3, 0, 4, 5, 0, 6, 7, 0, 8, 0, 9, 10, 0, 11, 12, 16]
};

// Backward (Ordre Inverse) standard score norm tables
const INVERSE_NORMS: Record<string, number[]> = {
  '16-17': [1, 2, 3, 4, 5, 6, 0, 7, 0, 8, 0, 9, 0, 10, 11, 12, 14, 15, 16],
  '18-19': [1, 2, 3, 4, 5, 6, 0, 7, 0, 8, 9, 0, 10, 0, 11, 12, 14, 15, 16],
  '20-24': [1, 2, 3, 0, 4, 5, 6, 7, 0, 8, 9, 0, 10, 11, 0, 12, 13, 14, 16],
  '25-29': [1, 2, 3, 0, 4, 5, 6, 7, 0, 8, 9, 10, 0, 11, 0, 12, 13, 14, 16],
  '30-34': [1, 2, 3, 0, 4, 5, 6, 7, 0, 8, 9, 10, 0, 11, 0, 12, 13, 14, 16],
  '35-44': [1, 2, 3, 0, 4, 5, 6, 7, 0, 8, 9, 10, 0, 11, 12, 13, 14, 15, 16],
  '45-54': [0, 1, 2, 3, 0, 4, 5, 6, 7, 0, 8, 9, 0, 10, 11, 12, 13, 14, 16],
  '55-64': [0, 1, 2, 3, 0, 4, 5, 0, 6, 0, 7, 8, 9, 0, 10, 12, 13, 14, 16],
  '65-69': [0, 0, 1, 2, 0, 3, 4, 5, 0, 6, 7, 8, 0, 9, 10, 11, 12, 13, 16],
  '70-74': [0, 0, 0, 1, 2, 3, 4, 5, 0, 6, 7, 8, 0, 9, 10, 11, 12, 13, 16],
  '75-79': [0, 0, 0, 0, 1, 2, 3, 0, 4, 5, 6, 7, 8, 0, 9, 10, 11, 12, 16],
  '80+': [0, 0, 0, 0, 1, 2, 3, 0, 4, 5, 6, 7, 0, 8, 0, 9, 10, 11, 16]
};

// Total standard score norm tables
const TOTAL_NORMS: Record<string, number[]> = {
  '16-17': [9, 10, 11, 12, 0, 13, 14, 15, 16, 17, 18, 19, 0, 20, 22, 23, 24, 26, 32],
  '18-19': [8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 0, 20, 21, 23, 24, 25, 26, 32],
  '20-24': [7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 19, 0, 20, 22, 24, 25, 26, 27, 32],
  '25-29': [7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 19, 20, 21, 23, 25, 26, 27, 28, 32],
  '30-34': [6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 23, 25, 26, 27, 28, 32],
  '35-44': [6, 7, 8, 10, 11, 12, 13, 15, 16, 17, 18, 20, 21, 23, 25, 26, 28, 0, 32],
  '45-54': [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 21, 23, 24, 26, 27, 32],
  '55-64': [6, 7, 8, 9, 10, 11, 12, 0, 13, 14, 15, 17, 18, 20, 21, 23, 24, 25, 32],
  '65-69': [4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 22, 23, 24, 32],
  '70-74': [2, 3, 4, 6, 7, 9, 10, 11, 12, 13, 14, 16, 17, 19, 20, 21, 22, 24, 32],
  '75-79': [2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 15, 16, 18, 19, 20, 21, 23, 32],
  '80+': [2, 3, 4, 5, 6, 0, 8, 9, 10, 12, 13, 15, 16, 17, 18, 20, 21, 22, 32]
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

/**
 * Find standard score from raw score using norm table
 * The norm table contains max raw scores for each standard score (1-19)
 * A 0 in the table means that standard score is not achievable
 */
function findStandardScore(rawScore: number, norms: number[]): number {
  for (let i = 0; i < norms.length; i++) {
    const maxRaw = norms[i];
    // Skip if this standard score is not achievable (marked as 0)
    if (maxRaw === 0) continue;
    if (rawScore <= maxRaw) return i + 1;
  }
  return 19; // Maximum standard score
}

export function calculateMem3SpatialScores(input: Mem3SpatialInput): Mem3SpatialScores {
  // Calculate forward raw score
  const mspatiale_odirect_tot = (
    input.odirect_1a + input.odirect_1b +
    input.odirect_2a + input.odirect_2b +
    input.odirect_3a + input.odirect_3b +
    input.odirect_4a + input.odirect_4b +
    input.odirect_5a + input.odirect_5b +
    input.odirect_6a + input.odirect_6b +
    input.odirect_7a + input.odirect_7b +
    input.odirect_8a + input.odirect_8b
  );
  
  // Calculate backward raw score
  const mspatiale_inverse_tot = (
    input.inverse_1a + input.inverse_1b +
    input.inverse_2a + input.inverse_2b +
    input.inverse_3a + input.inverse_3b +
    input.inverse_4a + input.inverse_4b +
    input.inverse_5a + input.inverse_5b +
    input.inverse_6a + input.inverse_6b +
    input.inverse_7a + input.inverse_7b +
    input.inverse_8a + input.inverse_8b
  );
  
  // Total raw score
  const mspatiale_total_brut = mspatiale_odirect_tot + mspatiale_inverse_tot;
  
  // Get age group
  const ageGroup = getAgeGroup(input.patient_age);
  
  // Calculate standard scores
  const mspatiale_odirect_std = findStandardScore(mspatiale_odirect_tot, ODIRECT_NORMS[ageGroup]);
  const mspatiale_inverse_std = findStandardScore(mspatiale_inverse_tot, INVERSE_NORMS[ageGroup]);
  const mspatiale_total_std = findStandardScore(mspatiale_total_brut, TOTAL_NORMS[ageGroup]);
  
  // Calculate standardized values (CR) = (std - 10) / 3
  const mspatiale_odirect_cr = Number(((mspatiale_odirect_std - 10) / 3).toFixed(2));
  const mspatiale_inverse_cr = Number(((mspatiale_inverse_std - 10) / 3).toFixed(2));
  const mspatiale_total_cr = Number(((mspatiale_total_std - 10) / 3).toFixed(2));
  
  return {
    mspatiale_odirect_tot,
    mspatiale_odirect_std,
    mspatiale_odirect_cr,
    mspatiale_inverse_tot,
    mspatiale_inverse_std,
    mspatiale_inverse_cr,
    mspatiale_total_brut,
    mspatiale_total_std,
    mspatiale_total_cr
  };
}

