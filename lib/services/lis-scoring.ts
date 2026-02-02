// eFondaMental Platform - LIS (Lecture d'Intentions Sociales) Scoring Service
// Implements deviation-based scoring for the LIS social cognition test

import {
  LIS_NORMATIVE_VALUES,
  LIS_ITEM_IDS,
  LIS_FILMS,
  LisItemId
} from '@/lib/constants/lis-norms';

// ============================================================================
// Types
// ============================================================================

export interface LisRawResponses {
  lis_a1?: number | null;
  lis_a2?: number | null;
  lis_a3?: number | null;
  lis_a4?: number | null;
  lis_a5?: number | null;
  lis_b1?: number | null;
  lis_b2?: number | null;
  lis_b3?: number | null;
  lis_b4?: number | null;
  lis_b5?: number | null;
  lis_c1?: number | null;
  lis_c2?: number | null;
  lis_c3?: number | null;
  lis_c4?: number | null;
  lis_c5?: number | null;
  lis_d1?: number | null;
  lis_d2?: number | null;
  lis_d3?: number | null;
  lis_d4?: number | null;
  lis_d5?: number | null;
  lis_e1?: number | null;
  lis_e2?: number | null;
  lis_e3?: number | null;
  lis_e4?: number | null;
  lis_e5?: number | null;
  lis_f1?: number | null;
  lis_f2?: number | null;
  lis_f3?: number | null;
  lis_f4?: number | null;
  lis_f5?: number | null;
}

export interface LisFilmScore {
  filmId: string;
  title: string;
  deviation: number;
  itemCount: number;
}

export interface LisComputedScores {
  lis_score: number | null;  // Total deviation score
  film_scores?: LisFilmScore[];  // Optional breakdown by film
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Round a number to specified decimal places
 */
function roundTo(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Calculate deviation for a single item
 * Returns absolute difference between response and normative value
 */
export function calculateItemDeviation(
  response: number,
  normativeValue: number
): number {
  return Math.abs(response - normativeValue);
}

// ============================================================================
// Main Scoring Function
// ============================================================================

/**
 * Calculate the LIS total deviation score
 * 
 * The score is the sum of absolute deviations from normative values
 * for all 30 items. Lower scores indicate better social cognition.
 * 
 * @param responses - Object containing responses for all 30 items (lis_a1 to lis_f5)
 * @returns Total deviation score, or null if any item is unanswered
 */
export function calculateLisScore(responses: LisRawResponses): number | null {
  let totalDeviation = 0;
  let answeredCount = 0;
  
  for (const itemId of LIS_ITEM_IDS) {
    const response = responses[itemId as keyof LisRawResponses];
    const normativeValue = LIS_NORMATIVE_VALUES[itemId];
    
    if (response == null || normativeValue == null) {
      // If any item is unanswered, return null (incomplete questionnaire)
      continue;
    }
    
    const deviation = calculateItemDeviation(response, normativeValue);
    totalDeviation += deviation;
    answeredCount++;
  }
  
  // Return null if not all items are answered
  if (answeredCount < LIS_ITEM_IDS.length) {
    return null;
  }
  
  return roundTo(totalDeviation, 2);
}

/**
 * Calculate LIS scores with film-by-film breakdown
 * 
 * @param responses - Object containing responses for all 30 items
 * @returns Object with total score and breakdown by film
 */
export function calculateLisScoresDetailed(responses: LisRawResponses): LisComputedScores {
  const filmScores: LisFilmScore[] = [];
  let totalDeviation = 0;
  let totalAnswered = 0;
  
  for (const film of LIS_FILMS) {
    let filmDeviation = 0;
    let filmAnswered = 0;
    
    for (const item of film.items) {
      const response = responses[item.id as keyof LisRawResponses];
      
      if (response != null) {
        const deviation = calculateItemDeviation(response, item.normativeValue);
        filmDeviation += deviation;
        filmAnswered++;
        totalDeviation += deviation;
        totalAnswered++;
      }
    }
    
    filmScores.push({
      filmId: film.filmId,
      title: film.title,
      deviation: roundTo(filmDeviation, 2),
      itemCount: filmAnswered
    });
  }
  
  // Total score is null if not all items are answered
  const lis_score = totalAnswered === LIS_ITEM_IDS.length 
    ? roundTo(totalDeviation, 2) 
    : null;
  
  return {
    lis_score,
    film_scores: filmScores
  };
}

/**
 * Get interpretation of the LIS score
 * 
 * @param score - Total deviation score
 * @returns Interpretation string
 */
export function interpretLisScore(score: number | null): string {
  if (score === null) {
    return 'Questionnaire incomplet';
  }
  
  if (score === 0) {
    return 'Parfait - Correspondance exacte avec les réponses normatives';
  }
  
  if (score <= 10) {
    return 'Excellente cognition sociale';
  }
  
  if (score <= 20) {
    return 'Bonne cognition sociale';
  }
  
  if (score <= 30) {
    return 'Cognition sociale modérée';
  }
  
  if (score <= 45) {
    return 'Difficultés de cognition sociale';
  }
  
  return 'Difficultés importantes de cognition sociale';
}
