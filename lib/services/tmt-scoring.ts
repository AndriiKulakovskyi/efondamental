// ============================================================================
// Trail Making Test (TMT) - Reitan 1955 - Scoring Functions
// ============================================================================
// This module contains scoring logic for TMT with age and education-based norms.
// ============================================================================

interface TmtScores {
  // Part A
  tmta_errtot: number;
  tmta_tps_z: number;
  tmta_tps_pc: number;
  tmta_errtot_z: number;
  // Part B
  tmtb_errtot: number;
  tmtb_tps_z: number;
  tmtb_tps_pc: number;
  tmtb_errtot_z: number;
  tmtb_err_persev_z: number;
  // B - A difference
  tmt_b_a_tps: number;
  tmt_b_a_tps_z: number;
}

interface TmtInput {
  patient_age: number;
  years_of_education: number;
  tmta_tps: number;
  tmta_err: number;
  tmta_cor?: number | null;
  tmtb_tps: number;
  tmtb_err: number;
  tmtb_cor?: number | null;
  tmtb_err_persev: number;
}

// Lookup tables structure: [p95, p90, p75, p50, p25, p10, p5, mean, std_dev]
// Index positions: 0=p95, 1=p90, 2=p75, 3=p50, 4=p25, 5=p10, 6=p5, 7=mean, 8=std_dev

type NormTable = {
  age_0: { edu_0: number[]; edu_1: number[]; edu_2: number[] };
  age_1: { edu_0: number[]; edu_1: number[]; edu_2: number[] };
  age_2: { edu_0: number[]; edu_1: number[]; edu_2: number[] };
};

// Part A Time norms
const TAB_A_TEMPS: NormTable = {
  age_0: {
    edu_0: [18, 18, 22, 31, 41, 53, 69, 34, 14],
    edu_1: [17, 19, 23, 28, 38, 46, 55, 31, 12],
    edu_2: [17, 19, 22, 26, 33, 44, 56, 29, 12]
  },
  age_1: {
    edu_0: [20, 20, 23, 34, 54, 62, 98, 41, 22],
    edu_1: [23, 25, 30, 42, 52, 59, 65, 42, 14],
    edu_2: [20, 23, 27, 31, 43, 53, 66, 36, 14]
  },
  age_2: {
    edu_0: [25, 34, 42, 55, 66, 85, 100, 56, 20],
    edu_1: [28, 33, 40, 50, 71, 100, 129, 64, 55],
    edu_2: [28, 31, 37, 44, 59, 77, 84, 49, 18]
  }
};

// Part A Errors norms
const TAB_A_ERREURS: NormTable = {
  age_0: {
    edu_0: [0, 0, 0, 0, 0, 0, 1, 0.06, 0.25],
    edu_1: [0, 0, 0, 0, 0, 0.3, 1, 0.12, 0.45],
    edu_2: [0, 0, 0, 0, 0, 0, 0, 0.03, 0.21]
  },
  age_1: {
    edu_0: [0, 0, 0, 0, 0, 0, 0, 0.02, 0.16],
    edu_1: [0, 0, 0, 0, 0, 0, 0, 0.02, 0.16],
    edu_2: [0, 0, 0, 0, 0, 0, 0.55, 0.10, 0.55]
  },
  age_2: {
    edu_0: [0, 0, 0, 0, 0, 0, 0.8, 0.06, 0.29],
    edu_1: [0, 0, 0, 0, 0, 0.5, 1, 0.13, 0.42],
    edu_2: [0, 0, 0, 0, 0, 0, 0, 0.05, 0.37]
  }
};

// Part B Time norms
const TAB_B_TEMPS: NormTable = {
  age_0: {
    edu_0: [36, 41, 49, 71, 84, 138, 177, 76, 39],
    edu_1: [38, 44, 52, 62, 71, 101, 125, 66, 24],
    edu_2: [37, 40, 47, 57, 67, 81, 94, 60, 22]
  },
  age_1: {
    edu_0: [42, 51, 73, 93, 117, 154, 186, 99, 42],
    edu_1: [51, 55, 67, 81, 104, 138, 159, 89, 35],
    edu_2: [43, 47, 55, 69, 84, 110, 125, 73, 24]
  },
  age_2: {
    edu_0: [64, 76, 112, 143, 185, 250, 282, 153, 62],
    edu_1: [59, 65, 91, 117, 174, 250, 319, 142, 87],
    edu_2: [61, 69, 84, 105, 134, 185, 226, 118, 51]
  }
};

// Part B Errors norms
const TAB_B_ERREURS: NormTable = {
  age_0: {
    edu_0: [0, 0, 0, 0, 0, 1.7, 2, 0.28, 0.63],
    edu_1: [0, 0, 0, 0, 0, 1, 1, 0.14, 0.46],
    edu_2: [0, 0, 0, 0, 0, 0, 1, 0.08, 0.27]
  },
  age_1: {
    edu_0: [0, 0, 0, 0, 0, 2, 2, 0.34, 0.76],
    edu_1: [0, 0, 0, 0, 0, 1, 1, 0.20, 0.53],
    edu_2: [0, 0, 0, 0, 0, 1, 1, 0.15, 0.50]
  },
  age_2: {
    edu_0: [0, 0, 0, 0, 1, 3, 4.8, 0.72, 1.60],
    edu_1: [0, 0, 0, 0, 0, 2, 3, 0.45, 0.91],
    edu_2: [0, 0, 0, 0, 0, 1, 1, 0.26, 0.79]
  }
};

// Perseverative Errors norms
const TAB_PERSEVERATIVE: NormTable = {
  age_0: {
    edu_0: [0, 0, 0, 0, 0, 0.7, 1.35, 0.13, 0.42],
    edu_1: [0, 0, 0, 0, 0, 0, 0.65, 0.06, 0.3],
    edu_2: [0, 0, 0, 0, 0, 0, 0.15, 0.05, 0.21]
  },
  age_1: {
    edu_0: [0, 0, 0, 0, 0, 1, 2, 0.2, 0.56],
    edu_1: [0, 0, 0, 0, 0, 0, 1, 0.1, 0.34],
    edu_2: [0, 0, 0, 0, 0, 0, 1, 0.09, 0.33]
  },
  age_2: {
    edu_0: [0, 0, 0, 0, 0, 1, 2, 0.30, 0.89],
    edu_1: [0, 0, 0, 0, 0, 1, 2, 0.21, 0.57],
    edu_2: [0, 0, 0, 0, 0, 1, 1, 0.19, 0.57]
  }
};

// B - A Time difference norms
const TAB_BA_TEMPS: NormTable = {
  age_0: {
    edu_0: [7, 19, 23, 33, 51, 80, 134, 43, 33],
    edu_1: [12, 17, 23, 30, 40, 56, 87, 35, 20],
    edu_2: [9, 14, 21, 28, 37, 51, 64, 31, 19]
  },
  age_1: {
    edu_0: [19, 24, 37, 47, 76, 101, 135, 58, 30],
    edu_1: [12, 15, 26, 40, 56, 88, 120, 47, 34],
    edu_2: [12, 15, 22, 30, 49, 66, 81, 37, 21]
  },
  age_2: {
    edu_0: [28, 39, 57, 90, 125, 163, 202, 97, 52],
    edu_1: [17, 25, 40, 62, 89, 175, 225, 76, 64],
    edu_2: [25, 30, 42, 59, 81, 120, 161, 69, 40]
  }
};

/**
 * Get the age category based on patient age
 * 0: age < 40
 * 1: 40 <= age < 60
 * 2: age >= 60
 */
function getAgeCategory(age: number): 'age_0' | 'age_1' | 'age_2' {
  if (age < 40) return 'age_0';
  if (age < 60) return 'age_1';
  return 'age_2';
}

/**
 * Get the education level category
 * 0: education < 6 years
 * 1: 6 <= education < 12 years
 * 2: education >= 12 years
 */
function getEducationLevel(years: number): 'edu_0' | 'edu_1' | 'edu_2' {
  if (years < 6) return 'edu_0';
  if (years < 12) return 'edu_1';
  return 'edu_2';
}

/**
 * Get norms from lookup table based on age and education
 */
function getNorms(table: NormTable, ageCategory: 'age_0' | 'age_1' | 'age_2', eduLevel: 'edu_0' | 'edu_1' | 'edu_2'): number[] {
  return table[ageCategory][eduLevel];
}

/**
 * Calculate Z-score using formula: (mean - value) / std_dev
 * Note: The formula is (mean - value) because higher times indicate worse performance
 */
function calculateZScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return Number(((mean - value) / stdDev).toFixed(2));
}

/**
 * Determine percentile based on value and percentile thresholds
 * Percentile order: [p95, p90, p75, p50, p25, p10, p5]
 */
function calculatePercentile(value: number, norms: number[]): number {
  const [p95, p90, p75, p50, p25, p10, p5] = norms;
  
  // Lower is better for time-based measures
  if (value <= p95) return 95;
  if (value <= p90) return 90;
  if (value <= p75) return 75;
  if (value <= p50) return 50;
  if (value <= p25) return 25;
  if (value <= p10) return 10;
  if (value <= p5) return 5;
  return 1; // Below 5th percentile
}

/**
 * Calculate all TMT scores based on input values and demographic data
 */
export function calculateTmtScores(input: TmtInput): TmtScores {
  const ageCategory = getAgeCategory(input.patient_age);
  const eduLevel = getEducationLevel(input.years_of_education);
  
  // Get norms for this demographic
  const normsATemps = getNorms(TAB_A_TEMPS, ageCategory, eduLevel);
  const normsAErreurs = getNorms(TAB_A_ERREURS, ageCategory, eduLevel);
  const normsBTemps = getNorms(TAB_B_TEMPS, ageCategory, eduLevel);
  const normsBErreurs = getNorms(TAB_B_ERREURS, ageCategory, eduLevel);
  const normsPersev = getNorms(TAB_PERSEVERATIVE, ageCategory, eduLevel);
  const normsBATemps = getNorms(TAB_BA_TEMPS, ageCategory, eduLevel);
  
  // Calculate total errors
  const tmta_errtot = input.tmta_err + (input.tmta_cor || 0);
  const tmtb_errtot = input.tmtb_err + (input.tmtb_cor || 0);
  
  // Calculate time difference B - A
  const tmt_b_a_tps = input.tmtb_tps - input.tmta_tps;
  
  // Calculate Z-scores (index 7 = mean, index 8 = std_dev)
  const tmta_tps_z = calculateZScore(input.tmta_tps, normsATemps[7], normsATemps[8]);
  const tmta_errtot_z = calculateZScore(tmta_errtot, normsAErreurs[7], normsAErreurs[8]);
  const tmtb_tps_z = calculateZScore(input.tmtb_tps, normsBTemps[7], normsBTemps[8]);
  const tmtb_errtot_z = calculateZScore(tmtb_errtot, normsBErreurs[7], normsBErreurs[8]);
  const tmtb_err_persev_z = calculateZScore(input.tmtb_err_persev, normsPersev[7], normsPersev[8]);
  const tmt_b_a_tps_z = calculateZScore(tmt_b_a_tps, normsBATemps[7], normsBATemps[8]);
  
  // Calculate percentiles for time measures
  const tmta_tps_pc = calculatePercentile(input.tmta_tps, normsATemps);
  const tmtb_tps_pc = calculatePercentile(input.tmtb_tps, normsBTemps);
  
  return {
    tmta_errtot,
    tmta_tps_z,
    tmta_tps_pc,
    tmta_errtot_z,
    tmtb_errtot,
    tmtb_tps_z,
    tmtb_tps_pc,
    tmtb_errtot_z,
    tmtb_err_persev_z,
    tmt_b_a_tps,
    tmt_b_a_tps_z
  };
}

