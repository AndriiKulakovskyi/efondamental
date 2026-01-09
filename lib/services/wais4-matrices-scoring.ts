// eFondaMental Platform - WAIS-IV Matrices Scoring Utilities
// Age-based lookup tables for converting raw scores to standardized scores

/**
 * Age-based lookup tables from WAIS-IV normative data
 * Each array represents raw score thresholds for standardized scores 1-19
 * Index in array + 1 = standardized score
 * Value in array = minimum raw score needed for that standardized score
 */
const AGE_LOOKUP_TABLES = {
  age_16: [3, 5, 7, 9, 11, 13, 16, 18, 19, 20, 21, 22, 23, 24, 0, 25, 0, 26, 0],
  age_18: [4, 6, 8, 10, 12, 14, 16, 18, 19, 21, 22, 0, 23, 24, 0, 25, 0, 26, 0],
  age_20: [5, 7, 9, 11, 14, 16, 18, 19, 20, 21, 22, 23, 0, 24, 0, 25, 26, 0, 0],
  age_25: [5, 7, 9, 11, 13, 15, 17, 19, 20, 22, 23, 0, 24, 0, 25, 0, 26, 0, 0],
  age_30: [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 22, 23, 0, 24, 25, 0, 26, 0, 0],
  age_35: [1, 3, 5, 7, 9, 11, 14, 16, 18, 20, 21, 22, 23, 24, 25, 0, 26, 0, 0],
  age_45: [0, 1, 3, 5, 7, 10, 12, 15, 17, 19, 20, 22, 23, 24, 25, 0, 26, 0, 0],
  age_55: [0, 0, 1, 3, 5, 6, 9, 13, 16, 18, 19, 20, 21, 22, 24, 25, 0, 26, 0],
  age_65: [0, 0, 1, 3, 5, 6, 8, 11, 13, 15, 17, 19, 21, 22, 23, 24, 25, 0, 26],
  age_70: [0, 0, 1, 3, 5, 6, 7, 9, 11, 13, 15, 17, 19, 21, 22, 23, 24, 25, 26],
  age_75: [0, 0, 1, 3, 5, 6, 7, 9, 11, 13, 15, 17, 19, 21, 22, 23, 24, 25, 26]
};

/**
 * Calculate standardized score based on raw score and age
 * Based on the JavaScript algorithm: while(rawScore > lookupTable[k]) k++; score = k+1
 * @param rawScore - Sum of items 1-26 (0-26)
 * @param age - Patient age (16-90)
 * @returns Standardized score (1-19)
 */
export function calculateStandardizedScore(rawScore: number, age: number): number {
  // Determine which age table to use
  let lookupTable: number[];
  
  if (age < 18) lookupTable = AGE_LOOKUP_TABLES.age_16;
  else if (age < 20) lookupTable = AGE_LOOKUP_TABLES.age_18;
  else if (age < 25) lookupTable = AGE_LOOKUP_TABLES.age_20;
  else if (age < 30) lookupTable = AGE_LOOKUP_TABLES.age_25;
  else if (age < 35) lookupTable = AGE_LOOKUP_TABLES.age_30;
  else if (age < 45) lookupTable = AGE_LOOKUP_TABLES.age_35;
  else if (age < 55) lookupTable = AGE_LOOKUP_TABLES.age_45;
  else if (age < 65) lookupTable = AGE_LOOKUP_TABLES.age_55;
  else if (age < 70) lookupTable = AGE_LOOKUP_TABLES.age_65;
  else if (age < 75) lookupTable = AGE_LOOKUP_TABLES.age_70;
  else lookupTable = AGE_LOOKUP_TABLES.age_75;
  
  // Handle edge case: if raw score is 0, standardized score should be 1
  if (rawScore === 0) return 1;
  
  // Find the standardized score by iterating through the lookup table
  // The table contains minimum raw scores needed for each standardized score (1-19)
  // Index i corresponds to standardized score i+1
  // A value of 0 means that standardized score is not achievable for this age group
  
  for (let i = lookupTable.length - 1; i >= 0; i--) {
    const threshold = lookupTable[i];
    
    // Skip entries marked as 0 (not achievable)
    if (threshold === 0) continue;
    
    // If raw score meets or exceeds this threshold, return the corresponding standardized score
    if (rawScore >= threshold) {
      return Math.min(i + 1, 19);
    }
  }
  
  // If we get here, raw score is below all thresholds, return 1
  return 1;
}


/**
 * Calculate percentile rank from standardized score
 * Based on JavaScript: ((k - 9) / 3) * 100, where k = standardizedScore - 1
 * @param standardizedScore - Standardized score (1-19)
 * @returns Percentile rank (decimal value)
 */
export function calculatePercentileRank(standardizedScore: number): number {
  // JavaScript formula: ((k - 9) / 3) * 100, where k = standardizedScore - 1
  const k = standardizedScore - 1;
  const percentileRank = ((k - 9) / 3) * 100;
  
  // Round to 2 decimal places
  return Math.round(percentileRank * 100) / 100;
}

/**
 * Calculate deviation from mean (z-score)
 * Formula: (standardized_score - 10) / 3
 * This represents how many standard deviations the score is from the population mean
 * @param standardizedScore - Standardized score (1-19)
 * @returns Deviation from mean (z-score)
 */
export function calculateDeviationFromMean(standardizedScore: number): number {
  const deviation = (standardizedScore - 10) / 3;
  
  // Round to 2 decimal places
  return Math.round(deviation * 100) / 100;
}

