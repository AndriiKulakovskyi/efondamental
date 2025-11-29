/**
 * WAIS-III Matrices Scoring Logic
 * 
 * This file implements the scoring algorithm for the WAIS-III Matrices subtest.
 * It uses WAIS-III norm tables which differ from WAIS-IV norms.
 * 
 * The norm table contains maximum raw scores for each standard score (1-19)
 * based on age groups. A value of 0 means that standard score is not achievable
 * at that position for that age group.
 */

// WAIS-III Matrices norm table
// Each array contains max raw scores for standard scores 1-19
// A value of 0 means that standard score is skipped for that age group
const WAIS3_MATRICES_NORMS: Record<string, number[]> = {
  '16-17': [7, 9, 10, 11, 13, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 0, 26, 0, 0],
  '18-19': [7, 9, 11, 13, 15, 17, 18, 19, 20, 21, 22, 23, 24, 0, 25, 0, 26, 0, 0],
  '20-24': [7, 8, 10, 12, 14, 16, 18, 20, 21, 22, 23, 0, 24, 0, 25, 0, 26, 0, 0],
  '25-29': [7, 9, 10, 12, 13, 15, 17, 19, 20, 21, 22, 23, 24, 0, 25, 0, 26, 0, 0],
  '30-34': [7, 9, 10, 12, 13, 14, 16, 18, 19, 20, 21, 22, 23, 24, 25, 0, 26, 0, 0],
  '35-44': [5, 6, 7, 9, 12, 14, 16, 18, 19, 20, 21, 22, 23, 24, 0, 25, 26, 0, 0],
  '45-54': [2, 4, 5, 6, 7, 9, 13, 15, 17, 19, 20, 21, 23, 24, 25, 0, 26, 0, 0],
  '55-64': [2, 3, 4, 5, 6, 8, 11, 14, 16, 17, 19, 21, 22, 0, 23, 24, 25, 26, 0],
  '65-69': [1, 2, 3, 4, 5, 6, 7, 11, 13, 16, 19, 20, 21, 22, 23, 24, 25, 26, 0],
  '70-74': [1, 2, 3, 4, 5, 6, 7, 9, 11, 13, 15, 17, 18, 19, 20, 21, 23, 24, 26],
  '75-79': [1, 2, 3, 4, 0, 5, 6, 7, 8, 10, 12, 14, 16, 17, 19, 20, 21, 22, 26],
  '80+': [0, 1, 2, 0, 3, 4, 0, 5, 6, 8, 10, 12, 14, 16, 19, 20, 21, 22, 26]
};

// Standard scores corresponding to the norm table indices
const STANDARD_SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

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
 * Finds the standard score based on raw score and age group
 * Returns the standard score that corresponds to the raw score
 */
function findStandardScore(rawScore: number, ageGroup: string): number {
  const norms = WAIS3_MATRICES_NORMS[ageGroup];
  if (!norms) return 10; // Default to average if age group not found
  
  // Build a valid lookup map (excluding 0 values which mean "skip")
  // We need to find the highest standard score where rawScore <= maxRaw
  let standardScore = 1; // Minimum
  
  for (let i = 0; i < norms.length; i++) {
    const maxRaw = norms[i];
    const ss = STANDARD_SCORES[i];
    
    // Skip entries with 0 (not applicable for this age group)
    if (maxRaw === 0) continue;
    
    // If raw score is <= this max, this could be our standard score
    // But we want the highest standard score that applies
    if (rawScore <= maxRaw) {
      return ss;
    }
    
    // Keep track of the last valid standard score we passed
    standardScore = ss;
  }
  
  // If we exceeded all thresholds, return the maximum standard score
  return 19;
}

/**
 * Calculates standardized value (z-score equivalent) from standard score
 * Standard scores have mean = 10, SD = 3
 */
function calculateStandardizedValue(standardScore: number): number {
  return (standardScore - 10) / 3;
}

/**
 * Main scoring function for WAIS-III Matrices
 */
export function calculateWais3MatricesScores(data: {
  patient_age: number;
  item_01: number;
  item_02: number;
  item_03: number;
  item_04: number;
  item_05: number;
  item_06: number;
  item_07: number;
  item_08: number;
  item_09: number;
  item_10: number;
  item_11: number;
  item_12: number;
  item_13: number;
  item_14: number;
  item_15: number;
  item_16: number;
  item_17: number;
  item_18: number;
  item_19: number;
  item_20: number;
  item_21: number;
  item_22: number;
  item_23: number;
  item_24: number;
  item_25: number;
  item_26: number;
}): {
  total_raw_score: number;
  standard_score: number;
  standardized_value: number;
} {
  // Calculate total raw score
  const total_raw_score = 
    data.item_01 + data.item_02 + data.item_03 + data.item_04 + data.item_05 +
    data.item_06 + data.item_07 + data.item_08 + data.item_09 + data.item_10 +
    data.item_11 + data.item_12 + data.item_13 + data.item_14 + data.item_15 +
    data.item_16 + data.item_17 + data.item_18 + data.item_19 + data.item_20 +
    data.item_21 + data.item_22 + data.item_23 + data.item_24 + data.item_25 +
    data.item_26;
  
  // Get age group
  const ageGroup = getAgeGroup(data.patient_age);
  
  // Find standard score
  const standard_score = findStandardScore(total_raw_score, ageGroup);
  
  // Calculate standardized value
  const standardized_value = calculateStandardizedValue(standard_score);
  
  return {
    total_raw_score,
    standard_score,
    standardized_value: Math.round(standardized_value * 100) / 100
  };
}

/**
 * Client-side scoring function for real-time calculation
 * This matches the structure expected by questionnaire-renderer.tsx
 */
export function calculateWais3MatricesScoresClient(responses: Record<string, any>): Record<string, number | null> {
  const result: Record<string, number | null> = {
    total_raw_score: null,
    standard_score: null,
    standardized_value: null
  };
  
  // Check if age is provided
  const age = Number(responses.patient_age);
  if (isNaN(age) || age < 16 || age > 90) {
    return result;
  }
  
  // Check if all items are provided
  const itemIds = [
    'item_01', 'item_02', 'item_03', 'item_04', 'item_05',
    'item_06', 'item_07', 'item_08', 'item_09', 'item_10',
    'item_11', 'item_12', 'item_13', 'item_14', 'item_15',
    'item_16', 'item_17', 'item_18', 'item_19', 'item_20',
    'item_21', 'item_22', 'item_23', 'item_24', 'item_25',
    'item_26'
  ];
  
  let total = 0;
  let allValid = true;
  
  for (const id of itemIds) {
    const val = Number(responses[id]);
    if (isNaN(val) || val < 0 || val > 1) {
      allValid = false;
      break;
    }
    total += val;
  }
  
  if (!allValid) {
    return result;
  }
  
  // Calculate scores
  const ageGroup = getAgeGroup(age);
  const standardScore = findStandardScore(total, ageGroup);
  const standardizedValue = calculateStandardizedValue(standardScore);
  
  return {
    total_raw_score: total,
    standard_score: standardScore,
    standardized_value: Math.round(standardizedValue * 100) / 100
  };
}

