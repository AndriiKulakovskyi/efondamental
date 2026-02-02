// eFondaMental Platform - Test des Commissions Scoring Service
// Implements percentile lookup and Z-score calculation for the Commissions test

import {
  COMMISSIONS_PERCENTILE_NORMS,
  COMMISSIONS_ZSCORE_NORMS,
  COMMISSIONS_NORMS_METADATA,
  CommissionsPercentileTable
} from '@/lib/constants/commissions-norms';

// ============================================================================
// Types
// ============================================================================

export interface CommissionsRawData {
  patient_age: number;
  nsc: number;  // 0 = lower education, 1 = higher education
  com01: number;  // Time in minutes
  com02: number;  // Unnecessary detours
  com03: number;  // Schedule violations
  com04: number;  // Logic errors
}

export interface CommissionsComputedScores {
  // Time scores
  com01s1?: string | null;  // Time percentile
  com01s2?: number | null;  // Time Z-score
  // Detours scores
  com02s1?: string | null;  // Detours percentile
  com02s2?: number | null;  // Detours Z-score
  // Schedule violations scores
  com03s1?: string | null;  // Schedule percentile
  com03s2?: number | null;  // Schedule Z-score
  // Logic errors scores
  com04s1?: string | null;  // Logic errors percentile
  com04s2?: number | null;  // Logic errors Z-score
  // Total errors
  com04s3?: number | null;  // Total errors (com02 + com03 + com04)
  com04s4?: string | null;  // Total errors percentile
  com04s5?: number | null;  // Total errors Z-score
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Determine age group based on patient age
 * Returns null if age is outside valid range (20-60)
 */
export function determineAgeGroup(age: number): 0 | 1 | null {
  if (age >= 20 && age <= 40) return 0;
  if (age >= 41 && age <= 60) return 1;
  return null;  // Age outside valid range
}

/**
 * Round a number to specified decimal places
 */
function roundTo(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// ============================================================================
// Percentile Lookup
// ============================================================================

/**
 * Look up percentile for a raw score using threshold matching
 * Returns exact percentile, range [lower-upper], >95, or <5
 * 
 * For "lower is better" measures:
 * - If raw score < min threshold (best performance): return "> 95"
 * - If raw score > max threshold (worst performance): return "< 5"
 * - If raw score matches threshold exactly: return that percentile
 * - If raw score falls between thresholds: return range [lower-upper]
 */
export function lookupCommissionsPercentile(
  rawScore: number,
  table: CommissionsPercentileTable
): string {
  const { thresholds, percentiles } = table;
  
  // Check if below minimum threshold (best performance)
  if (rawScore < thresholds[0]) {
    return `> ${percentiles[0]}`;
  }
  
  // Check if above maximum threshold (worst performance)
  if (rawScore > thresholds[thresholds.length - 1]) {
    return `< ${percentiles[percentiles.length - 1]}`;
  }
  
  // Find all matching indices for exact scores (handling plateaus)
  const matches: number[] = [];
  for (let i = 0; i < thresholds.length; i++) {
    if (rawScore === thresholds[i]) {
      matches.push(i);
    }
  }

  if (matches.length > 0) {
    if (matches.length === 1) {
      return percentiles[matches[0]].toString();
    }
    // Return range for plateaus (e.g., same threshold at multiple percentiles)
    const highestP = percentiles[matches[0]];
    const lowestP = percentiles[matches[matches.length - 1]];
    if (highestP === lowestP) {
      return highestP.toString();
    }
    return `${lowestP} - ${highestP}`;
  }
  
  // Find range for values between thresholds
  for (let i = 0; i < thresholds.length; i++) {
    if (rawScore < thresholds[i]) {
      if (i > 0) {
        // Raw is between threshold[i-1] and threshold[i]
        // Return percentile range
        return `${percentiles[i]} - ${percentiles[i - 1]}`;
      }
      return `> ${percentiles[0]}`;
    }
  }
  
  return `< ${percentiles[percentiles.length - 1]}`;
}

// ============================================================================
// Z-Score Calculation
// ============================================================================

/**
 * Calculate Z-score using inverted formula (lower raw = better = positive Z)
 * Formula: Z = (Mean - RawScore) / SD
 */
export function calculateCommissionsZScore(
  rawScore: number,
  mean: number,
  sd: number
): number {
  if (sd === 0) return 0;
  const zScore = (mean - rawScore) / sd;
  return roundTo(zScore, 2);
}

// ============================================================================
// Main Scoring Function
// ============================================================================

/**
 * Calculate all computed scores for the Commissions test
 * Returns null scores if demographics are invalid
 */
export function calculateCommissionsScores(rawData: CommissionsRawData): CommissionsComputedScores {
  const scores: CommissionsComputedScores = {};
  
  const { patient_age, nsc, com01, com02, com03, com04 } = rawData;
  
  // Validate NSC
  if (nsc !== 0 && nsc !== 1) {
    console.warn('Invalid NSC value for Commissions scoring:', nsc);
    return scores;
  }
  
  // Get percentile norms for this NSC
  const percentileNorms = COMMISSIONS_PERCENTILE_NORMS[nsc];
  if (!percentileNorms) {
    console.warn('No percentile norms found for NSC:', nsc);
    return scores;
  }
  
  // Calculate total errors
  scores.com04s3 = (com02 ?? 0) + (com03 ?? 0) + (com04 ?? 0);
  
  // Calculate percentiles (only need NSC)
  if (com01 != null) {
    scores.com01s1 = lookupCommissionsPercentile(com01, percentileNorms.time_minutes);
  }
  if (com02 != null) {
    scores.com02s1 = lookupCommissionsPercentile(com02, percentileNorms.detours);
  }
  if (com03 != null) {
    scores.com03s1 = lookupCommissionsPercentile(com03, percentileNorms.schedule_violations);
  }
  if (com04 != null) {
    scores.com04s1 = lookupCommissionsPercentile(com04, percentileNorms.logic_errors);
  }
  if (scores.com04s3 != null) {
    scores.com04s4 = lookupCommissionsPercentile(scores.com04s3, percentileNorms.total_errors);
  }
  
  // Calculate Z-scores (need age group + NSC)
  const ageGroup = determineAgeGroup(patient_age);
  
  if (ageGroup !== null) {
    const zScoreNorms = COMMISSIONS_ZSCORE_NORMS[ageGroup];
    if (zScoreNorms) {
      const nscNorms = nsc === 0 ? zScoreNorms.nsc_0 : zScoreNorms.nsc_1;
      
      // Time Z-score (index 0)
      if (com01 != null) {
        scores.com01s2 = calculateCommissionsZScore(com01, nscNorms.means[0], nscNorms.std_devs[0]);
      }
      
      // Detours Z-score (index 1)
      if (com02 != null) {
        scores.com02s2 = calculateCommissionsZScore(com02, nscNorms.means[1], nscNorms.std_devs[1]);
      }
      
      // Schedule violations Z-score (index 2)
      if (com03 != null) {
        scores.com03s2 = calculateCommissionsZScore(com03, nscNorms.means[2], nscNorms.std_devs[2]);
      }
      
      // Logic errors Z-score (index 3)
      if (com04 != null) {
        scores.com04s2 = calculateCommissionsZScore(com04, nscNorms.means[3], nscNorms.std_devs[3]);
      }
      
      // Total errors Z-score (index 4)
      if (scores.com04s3 != null) {
        scores.com04s5 = calculateCommissionsZScore(scores.com04s3, nscNorms.means[4], nscNorms.std_devs[4]);
      }
    }
  } else {
    console.warn(
      `Age ${patient_age} outside valid range (${COMMISSIONS_NORMS_METADATA.validAgeRange.min}-${COMMISSIONS_NORMS_METADATA.validAgeRange.max}) for Commissions Z-score calculation`
    );
  }
  
  return scores;
}
