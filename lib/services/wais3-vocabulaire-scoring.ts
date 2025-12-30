// ============================================================================
// WAIS-III Vocabulaire Scoring Service
// ============================================================================
// Implements age-stratified scoring for WAIS-III Vocabulary subtest
// ============================================================================

import { WAIS3_VOCABULAIRE_NORMS } from '@/lib/constants/wais3-vocabulaire-norms';

export interface VocabulaireInput {
  patient_age: number;
  total_raw_score: number;
}

export interface VocabulaireScores {
  standard_score: number; // Age-adjusted scaled score (1-19)
  standardized_value: number; // Normalized score: (standard_score - 10) / 3
}

/**
 * Determine age group category based on patient age
 * Returns the key for the normative table
 */
export function determineAgeGroup(age: number): string {
  if (age < 18) return '16_17';
  if (age < 20) return '18_19';
  if (age < 25) return '20_24';
  if (age < 30) return '25_29';
  if (age < 35) return '30_34';
  if (age < 45) return '35_44';
  if (age < 55) return '45_54';
  if (age < 65) return '55_64';
  if (age < 70) return '65_69';
  if (age < 75) return '70_74';
  if (age < 80) return '75_79';
  return '80_plus';
}

/**
 * Calculate standard score from raw score using age-stratified norms
 * Standard scores range from 1 to 19
 */
export function calculateStandardScore(rawScore: number, ageGroup: string): number {
  const norms = WAIS3_VOCABULAIRE_NORMS.age_groups[ageGroup as keyof typeof WAIS3_VOCABULAIRE_NORMS.age_groups];
  
  if (!norms) {
    throw new Error(`Invalid age group: ${ageGroup}`);
  }

  // Iterate through standard scores from 1 to 19
  for (let standardScore = 1; standardScore <= 19; standardScore++) {
    const threshold = norms.standard_scores[standardScore.toString()];
    
    if (!threshold) continue;

    // For standard score 19 (highest), check if raw score meets minimum
    if (standardScore === 19 && threshold.raw_score_min !== undefined) {
      if (rawScore >= threshold.raw_score_min) {
        return 19;
      }
    }
    
    // For standard scores 1-18, check if raw score is within maximum
    if (threshold.raw_score_max !== undefined) {
      if (rawScore <= threshold.raw_score_max) {
        return standardScore;
      }
    }
  }

  // If raw score exceeds all thresholds (shouldn't happen with correct data)
  return 19;
}

/**
 * Calculate standardized value (z-score transformation)
 * Formula: (standard_score - 10) / 3
 * This provides a normalized scale with mean=10 and SD=3
 */
export function calculateStandardizedValue(standardScore: number): number {
  const standardizedValue = (standardScore - 10) / 3;
  // Round to 2 decimal places
  return Math.round(standardizedValue * 100) / 100;
}

/**
 * Main scoring function
 * Calculates all WAIS-III Vocabulaire scores
 */
export function calculateWais3VocabulaireScores(input: VocabulaireInput): VocabulaireScores {
  const { patient_age, total_raw_score } = input;

  // Validate inputs
  if (patient_age < 16 || patient_age > 120) {
    throw new Error(`Invalid patient age: ${patient_age}. Age must be between 16 and 120.`);
  }

  if (total_raw_score < 0 || total_raw_score > 66) {
    throw new Error(`Invalid total raw score: ${total_raw_score}. Score must be between 0 and 66.`);
  }

  // Determine age group
  const ageGroup = determineAgeGroup(patient_age);

  // Calculate standard score using age-stratified norms
  const standard_score = calculateStandardScore(total_raw_score, ageGroup);

  // Calculate standardized value (z-score)
  const standardized_value = calculateStandardizedValue(standard_score);

  return {
    standard_score,
    standardized_value
  };
}

