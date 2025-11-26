// eFondaMental Platform - WAIS-IV Code Scoring Utilities
// Age-based lookup tables for converting raw scores to standardized scores
// Based on WAIS-IV normative data

/**
 * Age-based lookup tables for WAIS-IV Code subtest
 * Each array represents raw score thresholds for standardized scores 1-19
 * Index in array corresponds to standardized score (index 0 = score 1, index 18 = score 19)
 * Value in array = minimum raw score needed for that standardized score
 * 0 means that standardized score is not achievable in that age range
 */
const AGE_LOOKUP_TABLES: Record<string, number[]> = {
  // Age 16-17
  age_16: [0, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120, 126],
  // Age 18-19
  age_18: [0, 22, 28, 34, 40, 46, 52, 58, 64, 70, 76, 82, 88, 94, 100, 106, 112, 118, 124],
  // Age 20-24
  age_20: [0, 20, 26, 32, 38, 44, 50, 56, 62, 68, 74, 80, 86, 92, 98, 104, 110, 116, 122],
  // Age 25-29
  age_25: [0, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120],
  // Age 30-34
  age_30: [0, 16, 22, 28, 34, 40, 46, 52, 58, 64, 70, 76, 82, 88, 94, 100, 106, 112, 118],
  // Age 35-44
  age_35: [0, 14, 20, 26, 32, 38, 44, 50, 56, 62, 68, 74, 80, 86, 92, 98, 104, 110, 116],
  // Age 45-54
  age_45: [0, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114],
  // Age 55-64
  age_55: [0, 10, 16, 22, 28, 34, 40, 46, 52, 58, 64, 70, 76, 82, 88, 94, 100, 106, 112],
  // Age 65-69
  age_65: [0, 8, 14, 20, 26, 32, 38, 44, 50, 56, 62, 68, 74, 80, 86, 92, 98, 104, 110],
  // Age 70-74
  age_70: [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108],
  // Age 75-79
  age_75: [0, 4, 10, 16, 22, 28, 34, 40, 46, 52, 58, 64, 70, 76, 82, 88, 94, 100, 106],
  // Age 80-84
  age_80: [0, 2, 8, 14, 20, 26, 32, 38, 44, 50, 56, 62, 68, 74, 80, 86, 92, 98, 104],
  // Age 85-90
  age_85: [0, 0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102]
};

/**
 * Get the appropriate lookup table based on patient age
 */
function getLookupTable(age: number): number[] {
  if (age < 18) return AGE_LOOKUP_TABLES.age_16;
  if (age < 20) return AGE_LOOKUP_TABLES.age_18;
  if (age < 25) return AGE_LOOKUP_TABLES.age_20;
  if (age < 30) return AGE_LOOKUP_TABLES.age_25;
  if (age < 35) return AGE_LOOKUP_TABLES.age_30;
  if (age < 45) return AGE_LOOKUP_TABLES.age_35;
  if (age < 55) return AGE_LOOKUP_TABLES.age_45;
  if (age < 65) return AGE_LOOKUP_TABLES.age_55;
  if (age < 70) return AGE_LOOKUP_TABLES.age_65;
  if (age < 75) return AGE_LOOKUP_TABLES.age_70;
  if (age < 80) return AGE_LOOKUP_TABLES.age_75;
  if (age < 85) return AGE_LOOKUP_TABLES.age_80;
  return AGE_LOOKUP_TABLES.age_85;
}

/**
 * Calculate standardized score based on raw score and age
 * Uses lookup table to find the highest standardized score where
 * the raw score meets or exceeds the threshold
 * 
 * @param rawScore - Number of correct answers (0-135)
 * @param age - Patient age (16-90)
 * @returns Standardized score (1-19)
 */
export function calculateStandardizedScore(rawScore: number, age: number): number {
  const lookupTable = getLookupTable(age);
  
  // Find the highest standardized score where rawScore >= threshold
  let standardizedScore = 1;
  
  for (let i = 0; i < lookupTable.length; i++) {
    const threshold = lookupTable[i];
    // Skip if threshold is 0 (score not achievable)
    if (threshold > 0 && rawScore >= threshold) {
      standardizedScore = i + 1;
    }
  }
  
  // Edge case: if raw score is 0, return 1
  if (rawScore === 0) return 1;
  
  return Math.min(standardizedScore, 19);
}

/**
 * Calculate Z-score (centered reduced value) from standardized score
 * Formula: (standardized_score - 10) / 3
 * 
 * @param standardizedScore - Standardized score (1-19)
 * @returns Z-score (approximately -3 to +3)
 */
export function calculateZScore(standardizedScore: number): number {
  const zScore = (standardizedScore - 10) / 3;
  // Round to 2 decimal places
  return Math.round(zScore * 100) / 100;
}

