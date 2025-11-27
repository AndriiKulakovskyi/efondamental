// ============================================================================
// Stroop Test (Golden 1978) - Scoring Functions
// ============================================================================
// This module contains scoring logic for Stroop Test with age-based corrections.
// ============================================================================

interface StroopScores {
  // Age-corrected scores
  stroop_w_tot_c: number;
  stroop_c_tot_c: number;
  stroop_cw_tot_c: number;
  // Interference score
  stroop_interf: number;
  // T-scores
  stroop_w_note_t: number;
  stroop_c_note_t: number;
  stroop_cw_note_t: number;
  stroop_interf_note_t: number;
  // Z-scores
  stroop_w_note_t_corrigee: number;
  stroop_c_note_t_corrigee: number;
  stroop_cw_note_t_corrigee: number;
  stroop_interf_note_tz: number;
}

interface StroopInput {
  patient_age: number;
  stroop_w_tot: number; // Words read in 45s
  stroop_c_tot: number; // Colors named in 45s
  stroop_cw_tot: number; // Color-words named in 45s
}

// T-score lookup table
// Index corresponds to T-score values from 20 to 80 (step 2)
const NOTET_TAB = {
  scoret: [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80],
  mots: [48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 148, 152, 156, 160, 164, 168],
  couleur: [35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 65, 68, 71, 74, 77, 80, 83, 86, 89, 92, 95, 98, 101, 104, 107, 110, 113, 116, 119, 122, 125],
  couleurmot: [15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75],
  interference: [-30, -28, -26, -24, -22, -20, -18, -16, -14, -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
};

/**
 * Get age correction factor for Words score
 */
function getWordCorrection(age: number): number {
  if (age < 45) return 0;
  if (age < 65) return 8;
  return 14;
}

/**
 * Get age correction factor for Color score
 */
function getColorCorrection(age: number): number {
  if (age < 45) return 0;
  if (age < 65) return 4;
  return 11;
}

/**
 * Get age correction factor for Color-Word score
 */
function getColorWordCorrection(age: number): number {
  if (age < 45) return 0;
  if (age < 65) return 5;
  return 15;
}

/**
 * Calculate interference score
 * Formula: CW_corrected - ((C_corrected * W_corrected) / (C_corrected + W_corrected))
 */
function calculateInterference(wCorrected: number, cCorrected: number, cwCorrected: number): number {
  const predicted = (cCorrected * wCorrected) / (cCorrected + wCorrected);
  return Number((cwCorrected - predicted).toFixed(2));
}

/**
 * Look up T-score from raw score using the lookup table
 * Uses linear interpolation for values between table entries
 */
function lookupTScore(rawScore: number, column: 'mots' | 'couleur' | 'couleurmot' | 'interference'): number {
  const values = NOTET_TAB[column];
  const tScores = NOTET_TAB.scoret;
  
  // Find the position in the lookup table
  // For 'mots', 'couleur', 'couleurmot' - higher raw scores = higher T-scores
  // For 'interference' - direct mapping
  
  // Handle values below minimum
  if (rawScore <= values[0]) {
    return tScores[0];
  }
  
  // Handle values above maximum
  if (rawScore >= values[values.length - 1]) {
    return tScores[tScores.length - 1];
  }
  
  // Find the bracket and interpolate
  for (let i = 0; i < values.length - 1; i++) {
    if (rawScore >= values[i] && rawScore <= values[i + 1]) {
      // Linear interpolation
      const ratio = (rawScore - values[i]) / (values[i + 1] - values[i]);
      const tScore = tScores[i] + ratio * (tScores[i + 1] - tScores[i]);
      return Math.round(tScore);
    }
  }
  
  // Fallback (should not reach here)
  return 50;
}

/**
 * Convert T-score to Z-score
 * Formula: (T - 50) / 10
 */
function tScoreToZScore(tScore: number): number {
  return Number(((tScore - 50) / 10).toFixed(2));
}

/**
 * Calculate all Stroop scores based on input values
 */
export function calculateStroopScores(input: StroopInput): StroopScores {
  // Step 1: Apply age corrections
  const stroop_w_tot_c = input.stroop_w_tot + getWordCorrection(input.patient_age);
  const stroop_c_tot_c = input.stroop_c_tot + getColorCorrection(input.patient_age);
  const stroop_cw_tot_c = input.stroop_cw_tot + getColorWordCorrection(input.patient_age);
  
  // Step 2: Calculate interference score
  const stroop_interf = calculateInterference(stroop_w_tot_c, stroop_c_tot_c, stroop_cw_tot_c);
  
  // Step 3: Look up T-scores
  const stroop_w_note_t = lookupTScore(stroop_w_tot_c, 'mots');
  const stroop_c_note_t = lookupTScore(stroop_c_tot_c, 'couleur');
  const stroop_cw_note_t = lookupTScore(stroop_cw_tot_c, 'couleurmot');
  const stroop_interf_note_t = lookupTScore(stroop_interf, 'interference');
  
  // Step 4: Convert T-scores to Z-scores
  const stroop_w_note_t_corrigee = tScoreToZScore(stroop_w_note_t);
  const stroop_c_note_t_corrigee = tScoreToZScore(stroop_c_note_t);
  const stroop_cw_note_t_corrigee = tScoreToZScore(stroop_cw_note_t);
  const stroop_interf_note_tz = tScoreToZScore(stroop_interf_note_t);
  
  return {
    stroop_w_tot_c,
    stroop_c_tot_c,
    stroop_cw_tot_c,
    stroop_interf,
    stroop_w_note_t,
    stroop_c_note_t,
    stroop_cw_note_t,
    stroop_interf_note_t,
    stroop_w_note_t_corrigee,
    stroop_c_note_t_corrigee,
    stroop_cw_note_t_corrigee,
    stroop_interf_note_tz
  };
}

