// eFondaMental Platform - TMT French Normative Data
// Source: Trail Making Test (TMT) - WAIS-III French Norms
// Stratification: Age (3 groups) × Education (3 levels) = 9 cells per measure

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface TmtNormCell {
  age_group: 0 | 1 | 2;
  education_level: 0 | 1 | 2;
  percentile_thresholds: number[];
  percentiles: number[];
  mean: number;
  sd: number;
}

export interface TmtMeasureNorms {
  label: string;
  output_fields: {
    percentile?: string;
    z_score?: string;
  };
  direction: 'lower_is_better';
  tables: TmtNormCell[];
  note?: string;
}

// ============================================================================
// Stratification Definitions
// ============================================================================

export const TMT_AGE_GROUPS = {
  0: { range: '< 40 years', min: 0, max: 39 },
  1: { range: '40-59 years', min: 40, max: 59 },
  2: { range: '≥ 60 years', min: 60, max: 150 }
} as const;

export const TMT_EDUCATION_LEVELS = {
  0: { range: '< 6 years', label: 'Low education', min: 0, max: 5 },
  1: { range: '6-11 years', label: 'Medium education', min: 6, max: 11 },
  2: { range: '≥ 12 years', label: 'High education', min: 12, max: 30 }
} as const;

export const TMT_PERCENTILE_VALUES = [95, 90, 75, 50, 25, 10, 5] as const;

// ============================================================================
// Normative Data
// ============================================================================

export const TMT_NORMS: Record<string, TmtMeasureNorms> = {
  tmta_temps: {
    label: 'TMT Part A - Temps (secondes)',
    output_fields: {
      percentile: 'tmta_tps_pc',
      z_score: 'tmta_tps_z'
    },
    direction: 'lower_is_better',
    tables: [
      { age_group: 0, education_level: 0, percentile_thresholds: [18, 18, 22, 31, 41, 53, 69], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 34, sd: 14 },
      { age_group: 0, education_level: 1, percentile_thresholds: [17, 19, 23, 28, 38, 46, 55], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 31, sd: 12 },
      { age_group: 0, education_level: 2, percentile_thresholds: [17, 19, 22, 26, 33, 44, 56], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 29, sd: 12 },
      { age_group: 1, education_level: 0, percentile_thresholds: [20, 20, 23, 34, 54, 62, 98], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 41, sd: 22 },
      { age_group: 1, education_level: 1, percentile_thresholds: [23, 25, 30, 42, 52, 59, 65], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 42, sd: 14 },
      { age_group: 1, education_level: 2, percentile_thresholds: [20, 23, 27, 31, 43, 53, 66], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 36, sd: 14 },
      { age_group: 2, education_level: 0, percentile_thresholds: [25, 34, 42, 55, 66, 85, 100], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 56, sd: 20 },
      { age_group: 2, education_level: 1, percentile_thresholds: [28, 33, 40, 50, 71, 100, 129], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 64, sd: 55 },
      { age_group: 2, education_level: 2, percentile_thresholds: [28, 31, 37, 44, 59, 77, 84], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 49, sd: 18 }
    ]
  },
  tmta_erreurs_totales: {
    label: 'TMT Part A - Erreurs totales',
    output_fields: {
      percentile: 'tmta_errtot_pc',
      z_score: 'tmta_errtot_z'
    },
    direction: 'lower_is_better',
    tables: [
      { age_group: 0, education_level: 0, percentile_thresholds: [0, 0, 0, 0, 0, 0, 1], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.06, sd: 0.25 },
      { age_group: 0, education_level: 1, percentile_thresholds: [0, 0, 0, 0, 0, 0.3, 1], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.12, sd: 0.45 },
      { age_group: 0, education_level: 2, percentile_thresholds: [0, 0, 0, 0, 0, 0, 0], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.03, sd: 0.21 },
      { age_group: 1, education_level: 0, percentile_thresholds: [0, 0, 0, 0, 0, 0, 0], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.02, sd: 0.16 },
      { age_group: 1, education_level: 1, percentile_thresholds: [0, 0, 0, 0, 0, 0, 0], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.02, sd: 0.16 },
      { age_group: 1, education_level: 2, percentile_thresholds: [0, 0, 0, 0, 0, 0, 0.55], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.10, sd: 0.55 },
      { age_group: 2, education_level: 0, percentile_thresholds: [0, 0, 0, 0, 0, 0, 0.8], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.06, sd: 0.29 },
      { age_group: 2, education_level: 1, percentile_thresholds: [0, 0, 0, 0, 0, 0.5, 1], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.13, sd: 0.42 },
      { age_group: 2, education_level: 2, percentile_thresholds: [0, 0, 0, 0, 0, 0, 0], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.05, sd: 0.37 }
    ]
  },
  tmtb_temps: {
    label: 'TMT Part B - Temps (secondes)',
    output_fields: {
      percentile: 'tmtb_tps_pc',
      z_score: 'tmtb_tps_z'
    },
    direction: 'lower_is_better',
    tables: [
      { age_group: 0, education_level: 0, percentile_thresholds: [36, 41, 49, 71, 84, 138, 177], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 76, sd: 39 },
      { age_group: 0, education_level: 1, percentile_thresholds: [38, 44, 52, 62, 71, 101, 125], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 66, sd: 24 },
      { age_group: 0, education_level: 2, percentile_thresholds: [37, 40, 47, 57, 67, 81, 94], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 60, sd: 22 },
      { age_group: 1, education_level: 0, percentile_thresholds: [42, 51, 73, 93, 117, 154, 186], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 99, sd: 42 },
      { age_group: 1, education_level: 1, percentile_thresholds: [51, 55, 67, 81, 104, 138, 159], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 89, sd: 35 },
      { age_group: 1, education_level: 2, percentile_thresholds: [43, 47, 55, 69, 84, 110, 125], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 73, sd: 24 },
      { age_group: 2, education_level: 0, percentile_thresholds: [64, 76, 112, 143, 185, 250, 282], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 153, sd: 62 },
      { age_group: 2, education_level: 1, percentile_thresholds: [59, 65, 91, 117, 174, 250, 319], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 142, sd: 87 },
      { age_group: 2, education_level: 2, percentile_thresholds: [61, 69, 84, 105, 134, 185, 226], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 118, sd: 51 }
    ]
  },
  tmtb_erreurs_totales: {
    label: 'TMT Part B - Erreurs totales',
    output_fields: {
      percentile: 'tmtb_errtot_pc',
      z_score: 'tmtb_errtot_z'
    },
    direction: 'lower_is_better',
    tables: [
      { age_group: 0, education_level: 0, percentile_thresholds: [0, 0, 0, 0, 0, 1.7, 2], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.28, sd: 0.63 },
      { age_group: 0, education_level: 1, percentile_thresholds: [0, 0, 0, 0, 0, 1, 1], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.14, sd: 0.46 },
      { age_group: 0, education_level: 2, percentile_thresholds: [0, 0, 0, 0, 0, 0, 1], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.08, sd: 0.27 },
      { age_group: 1, education_level: 0, percentile_thresholds: [0, 0, 0, 0, 0, 2, 2], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.34, sd: 0.76 },
      { age_group: 1, education_level: 1, percentile_thresholds: [0, 0, 0, 0, 0, 1, 1], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.20, sd: 0.53 },
      { age_group: 1, education_level: 2, percentile_thresholds: [0, 0, 0, 0, 0, 1, 1], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.15, sd: 0.50 },
      { age_group: 2, education_level: 0, percentile_thresholds: [0, 0, 0, 0, 1, 3, 4.8], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.72, sd: 1.60 },
      { age_group: 2, education_level: 1, percentile_thresholds: [0, 0, 0, 0, 0, 2, 3], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.45, sd: 0.91 },
      { age_group: 2, education_level: 2, percentile_thresholds: [0, 0, 0, 0, 0, 1, 1], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.26, sd: 0.79 }
    ]
  },
  tmtb_erreurs_perseveratives: {
    label: 'TMT Part B - Erreurs perseveratives',
    output_fields: {
      percentile: 'tmtb_err_persev_pc',
      z_score: 'tmtb_err_persev_z'
    },
    direction: 'lower_is_better',
    tables: [
      { age_group: 0, education_level: 0, percentile_thresholds: [0, 0, 0, 0, 0, 0.7, 1.35], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.13, sd: 0.42 },
      { age_group: 0, education_level: 1, percentile_thresholds: [0, 0, 0, 0, 0, 0, 0.65], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.06, sd: 0.30 },
      { age_group: 0, education_level: 2, percentile_thresholds: [0, 0, 0, 0, 0, 0, 0.15], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.05, sd: 0.21 },
      { age_group: 1, education_level: 0, percentile_thresholds: [0, 0, 0, 0, 0, 1, 2], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.20, sd: 0.56 },
      { age_group: 1, education_level: 1, percentile_thresholds: [0, 0, 0, 0, 0, 0, 1], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.10, sd: 0.34 },
      { age_group: 1, education_level: 2, percentile_thresholds: [0, 0, 0, 0, 0, 0, 1], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.09, sd: 0.33 },
      { age_group: 2, education_level: 0, percentile_thresholds: [0, 0, 0, 0, 0, 1, 2], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.30, sd: 0.89 },
      { age_group: 2, education_level: 1, percentile_thresholds: [0, 0, 0, 0, 0, 1, 2], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.21, sd: 0.57 },
      { age_group: 2, education_level: 2, percentile_thresholds: [0, 0, 0, 0, 0, 1, 1], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.19, sd: 0.57 }
    ]
  },
  tmt_b_a_temps: {
    label: 'TMT B-A - Difference de temps',
    output_fields: {
      percentile: 'tmt_b_a_tps_pc',
      z_score: 'tmt_b_a_tps_z'
    },
    direction: 'lower_is_better',
    tables: [
      { age_group: 0, education_level: 0, percentile_thresholds: [7, 19, 23, 33, 51, 80, 134], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 43, sd: 33 },
      { age_group: 0, education_level: 1, percentile_thresholds: [12, 17, 23, 30, 40, 56, 87], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 35, sd: 20 },
      { age_group: 0, education_level: 2, percentile_thresholds: [9, 14, 21, 28, 37, 51, 64], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 31, sd: 19 },
      { age_group: 1, education_level: 0, percentile_thresholds: [19, 24, 37, 47, 76, 101, 135], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 58, sd: 30 },
      { age_group: 1, education_level: 1, percentile_thresholds: [12, 15, 26, 40, 56, 88, 120], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 47, sd: 34 },
      { age_group: 1, education_level: 2, percentile_thresholds: [12, 15, 22, 30, 49, 66, 81], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 37, sd: 21 },
      { age_group: 2, education_level: 0, percentile_thresholds: [28, 39, 57, 90, 125, 163, 202], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 97, sd: 52 },
      { age_group: 2, education_level: 1, percentile_thresholds: [17, 25, 40, 62, 89, 175, 225], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 76, sd: 64 },
      { age_group: 2, education_level: 2, percentile_thresholds: [25, 30, 42, 59, 81, 120, 161], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 69, sd: 40 }
    ]
  },
  tmt_b_a_erreurs: {
    label: 'TMT B-A - Difference d\'erreurs',
    output_fields: {
      percentile: 'tmt_b_a_err_pc',
      z_score: 'tmt_b_a_err_z'
    },
    direction: 'lower_is_better',
    tables: [
      { age_group: 0, education_level: 0, percentile_thresholds: [0, 0, 0, 0, 0, 1, 2], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.25, sd: 0.57 },
      { age_group: 0, education_level: 1, percentile_thresholds: [0, 0, 0, 0, 0, 0.3, 1], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.12, sd: 0.45 },
      { age_group: 0, education_level: 2, percentile_thresholds: [0, 0, 0, 0, 0, 0, 1], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.07, sd: 0.26 },
      { age_group: 1, education_level: 0, percentile_thresholds: [0, 0, 0, 0, 0, 2, 2], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.32, sd: 0.76 },
      { age_group: 1, education_level: 1, percentile_thresholds: [0, 0, 0, 0, 0, 1, 1], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.20, sd: 0.53 },
      { age_group: 1, education_level: 2, percentile_thresholds: [0, 0, 0, 0, 0, 1, 1], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.15, sd: 0.50 },
      { age_group: 2, education_level: 0, percentile_thresholds: [0, 0, 0, 0, 1, 3, 3.8], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.68, sd: 1.51 },
      { age_group: 2, education_level: 1, percentile_thresholds: [0, 0, 0, 0, 0, 2, 3], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.37, sd: 0.84 },
      { age_group: 2, education_level: 2, percentile_thresholds: [0, 0, 0, 0, 0, 1, 1], percentiles: [95, 90, 75, 50, 25, 10, 5], mean: 0.22, sd: 0.53 }
    ]
  }
};

