// ============================================================================
// WAIS-IV Similitudes - Scoring Functions
// ============================================================================
// This module contains scoring logic for WAIS-IV Similitudes subtest
// with age-based norm tables for converting raw scores to standard scores.
// ============================================================================

interface Wais4SimilitudesScores {
  total_raw_score: number;
  standard_score: number;
  standardized_value: number;
}

interface Wais4SimilitudesInput {
  patient_age: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  item7: number;
  item8: number;
  item9: number;
  item10: number;
  item11: number;
  item12: number;
  item13: number;
  item14: number;
  item15: number;
  item16: number;
  item17: number;
  item18: number;
}

// Age-based norm tables
// Structure: Array of score ranges for standard scores 1-19
// Each entry is a string like "0-4" or "5" representing raw score ranges
type NormTable = string[];

const SIMI_TAB: Record<string, NormTable> = {
  age_16: ["0-4", "5-6", "7-8", "9-10", "11-12", "13-14", "15-16", "17", "18-19", "20-21", "22", "23", "24-25", "26", "27", "28-29", "30-31", "32-33", "34-36"],
  age_18: ["0-4", "5-6", "7-8", "9-10", "11-12", "13-14", "15-16", "17", "18-19", "20-21", "22", "23", "24-25", "26", "27", "28-29", "30-31", "32-33", "34-36"],
  age_20: ["0-9", "10-11", "12", "13", "14", "15-16", "17", "18-19", "20-21", "22", "23", "24-25", "26", "27-28", "29-30", "31-32", "33", "34-35", "36"],
  age_25: ["0-8", "9", "10", "11", "12", "13-15", "16-17", "18", "19-20", "21-22", "23", "24-25", "26", "27-28", "29-30", "31-32", "33", "34-35", "36"],
  age_30: ["0-8", "9", "10", "11", "12", "13-15", "16-17", "18", "19-20", "21-22", "23", "24-25", "26", "27", "28", "29-30", "31-32", "33", "34-36"],
  age_35: ["0-8", "9", "10", "11", "12", "13-15", "16-17", "18", "19-20", "21-22", "23", "24-25", "26", "27", "28", "29-30", "31-32", "33", "34-36"],
  age_45: ["0-1", "2-3", "4-6", "7-9", "10-11", "12-13", "14-15", "16-17", "18-19", "20", "21-22", "23-24", "25", "26", "27", "28", "29-30", "31-32", "33-36"],
  age_55: ["0-1", "2-3", "4-6", "7-9", "10-11", "12-13", "14-15", "16-17", "18-19", "20", "21-22", "23-24", "25", "26", "27", "28", "29-30", "31-32", "33-36"],
  age_65: ["0-1", "2-3", "4-6", "7-9", "10", "11-12", "13-14", "15", "16-17", "18-19", "20-21", "22", "23-24", "25-26", "27", "28", "29-30", "31", "32-36"],
  age_70: ["0-1", "2-3", "4-6", "7-9", "10", "11-12", "13-14", "15", "16-17", "18-19", "20-21", "22", "23", "24", "25", "26-27", "28", "29", "30-36"],
  age_75: ["0", "1", "2", "3", "4-6", "7-9", "10-12", "13-15", "16-17", "18-19", "20", "21", "22", "23-24", "25", "26-27", "28", "29", "30-36"]
};

/**
 * Get the age category key for lookup tables
 */
function getAgeCategory(age: number): string {
  if (age >= 16 && age <= 17) return 'age_16';
  if (age >= 18 && age <= 19) return 'age_18';
  if (age >= 20 && age <= 24) return 'age_20';
  if (age >= 25 && age <= 29) return 'age_25';
  if (age >= 30 && age <= 34) return 'age_30';
  if (age >= 35 && age <= 44) return 'age_35';
  if (age >= 45 && age <= 54) return 'age_45';
  if (age >= 55 && age <= 64) return 'age_55';
  if (age >= 65 && age <= 69) return 'age_65';
  if (age >= 70 && age <= 74) return 'age_70';
  if (age >= 75 && age <= 90) return 'age_75';
  // Default to age_35 if out of range
  return 'age_35';
}

/**
 * Parse a range string like "0-4" or "5" and check if rawScore falls within
 */
function isInRange(rawScore: number, rangeStr: string): boolean {
  if (rangeStr.includes('-')) {
    const [min, max] = rangeStr.split('-').map(Number);
    return rawScore >= min && rawScore <= max;
  } else {
    return rawScore === Number(rangeStr);
  }
}

/**
 * Look up the standard score based on raw score and age
 * Returns standard score from 1 to 19
 */
function lookupStandardScore(rawScore: number, age: number): number {
  const ageCategory = getAgeCategory(age);
  const normTable = SIMI_TAB[ageCategory];
  
  if (!normTable) {
    console.error(`No norm table found for age category: ${ageCategory}`);
    return 10; // Return average if no table found
  }
  
  // Standard scores go from 1 to 19
  // Index 0 = standard score 1, index 18 = standard score 19
  for (let i = 0; i < normTable.length; i++) {
    if (isInRange(rawScore, normTable[i])) {
      return i + 1; // Standard score (1-19)
    }
  }
  
  // If raw score is higher than all ranges, return max (19)
  // If lower than all ranges, return min (1)
  return rawScore > 36 ? 19 : 1;
}

/**
 * Calculate all WAIS-IV Similitudes scores based on input values
 */
export function calculateWais4SimilitudesScores(input: Wais4SimilitudesInput): Wais4SimilitudesScores {
  // Calculate total raw score (sum of all 18 items)
  const total_raw_score = 
    input.item1 + input.item2 + input.item3 + input.item4 + input.item5 +
    input.item6 + input.item7 + input.item8 + input.item9 + input.item10 +
    input.item11 + input.item12 + input.item13 + input.item14 + input.item15 +
    input.item16 + input.item17 + input.item18;
  
  // Look up standard score based on raw score and age
  const standard_score = lookupStandardScore(total_raw_score, input.patient_age);
  
  // Calculate standardized value: (standard_score - 10) / 3
  const standardized_value = Number(((standard_score - 10) / 3).toFixed(2));
  
  return {
    total_raw_score,
    standard_score,
    standardized_value
  };
}

// Export helper functions for client-side scoring
export { getAgeCategory, lookupStandardScore, isInRange, SIMI_TAB };

