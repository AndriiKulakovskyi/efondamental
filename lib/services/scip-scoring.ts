// ============================================================================
// SCIP - Screening Assessment for Cognitive Impairment in Psychiatry
// Scoring Functions
// ============================================================================
// Brief screening tool for cognitive impairment in psychiatry.
// Z-scores are calculated using fixed normative data.
// ============================================================================

interface ScipScores {
  scipv01b: number; // Z-score for Apprentissage Verbal Immediat
  scipv02b: number; // Z-score for Memoire de Travail
  scipv03b: number; // Z-score for Fluence Verbale
  scipv04b: number; // Z-score for Rappel Verbal Differe
  scipv05b: number; // Z-score for Capacites Visuomotrices
}

interface ScipInput {
  scipv01a: number; // Apprentissage Verbal Immediat raw score
  scipv02a: number; // Memoire de Travail raw score
  scipv03a: number; // Fluence Verbale raw score
  scipv04a: number; // Rappel Verbal Differe raw score
  scipv05a: number; // Capacites Visuomotrices raw score
}

// Normative data: mean and standard deviation for each subscale
const NORMS = {
  scipv01: { mean: 23.59, std: 2.87 }, // Apprentissage Verbal Immediat
  scipv02: { mean: 20.66, std: 2.45 }, // Memoire de Travail
  scipv03: { mean: 17.44, std: 4.74 }, // Fluence Verbale
  scipv04: { mean: 7.65, std: 1.90 },  // Rappel Verbal Differe
  scipv05: { mean: 14.26, std: 2.25 }  // Capacites Visuomotrices
};

/**
 * Calculate Z-score: (raw_score - mean) / std
 */
function calculateZScore(rawScore: number, mean: number, std: number): number {
  if (std === 0) return 0;
  return Number(((rawScore - mean) / std).toFixed(2));
}

/**
 * Calculate all SCIP Z-scores
 */
export function calculateScipScores(input: ScipInput): ScipScores {
  return {
    scipv01b: calculateZScore(input.scipv01a, NORMS.scipv01.mean, NORMS.scipv01.std),
    scipv02b: calculateZScore(input.scipv02a, NORMS.scipv02.mean, NORMS.scipv02.std),
    scipv03b: calculateZScore(input.scipv03a, NORMS.scipv03.mean, NORMS.scipv03.std),
    scipv04b: calculateZScore(input.scipv04a, NORMS.scipv04.mean, NORMS.scipv04.std),
    scipv05b: calculateZScore(input.scipv05a, NORMS.scipv05.mean, NORMS.scipv05.std)
  };
}

// Export norms for client-side scoring
export { NORMS };

