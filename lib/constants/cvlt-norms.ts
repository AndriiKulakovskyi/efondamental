// eFondaMental Platform - CVLT French Normative Data
// Source: Deweer et al., 2008 - California Verbal Learning Test French Adaptation

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface RegressionCoefficients {
  age_group: 0 | 1 | 2;
  beta_0: number;
  beta_education: number;
  beta_age: number;
  beta_sex: number;
  sd: number;
}

export interface RegressionNorm {
  label: string;
  method: 'regression';
  applies_to: string;
  formula: string;
  coefficients: RegressionCoefficients[];
}

export interface PercentileTable {
  age_group: 0 | 1 | 2;
  thresholds: number[];
  percentiles: number[];
}

export interface PercentileNorm {
  label: string;
  method: 'percentile_lookup';
  applies_to: string;
  direction: 'higher_is_better' | 'lower_is_better';
  special_rule?: string;
  note?: string;
  tables: PercentileTable[];
}

export interface AgeGroupDefinition {
  range: string;
  description: string;
}

// ============================================================================
// Metadata
// ============================================================================

export const CVLT_NORMS_METADATA = {
  title: 'CVLT French Normative Data',
  description: 'Complete normative data for California Verbal Learning Test - French version',
  source: 'Deweer et al., 2008 - French adaptation normative study',
  age_groups: {
    0: {
      range: '≤ 39 years',
      description: 'Young adults'
    } as AgeGroupDefinition,
    1: {
      range: '40-69 years',
      description: 'Middle-aged adults'
    } as AgeGroupDefinition,
    2: {
      range: '≥ 70 years',
      description: 'Older adults'
    } as AgeGroupDefinition
  },
  sex_coding: {
    1: 'Female',
    2: 'Male'
  }
} as const;

// ============================================================================
// Regression Norms (Z-Score Calculations)
// ============================================================================

export const CVLT_REGRESSION_NORMS: Record<string, RegressionNorm> = {
  cvlt_luna1std: {
    label: 'Rappel 1 (Liste A Essai 1)',
    method: 'regression',
    applies_to: 'all_ages',
    formula: 'Z = (Raw - (β₀ + β₁×Education - β₂×Age)) / SD',
    coefficients: [
      {
        age_group: 0,
        beta_0: 6.87,
        beta_education: 0.09,
        beta_age: 0,
        beta_sex: 0,
        sd: 1.83
      },
      {
        age_group: 1,
        beta_0: 8.37,
        beta_education: 0.19,
        beta_age: 0.07,
        beta_sex: 0,
        sd: 1.88
      },
      {
        age_group: 2,
        beta_0: 12.85,
        beta_education: 0.08,
        beta_age: 0.11,
        beta_sex: 0,
        sd: 1.85
      }
    ]
  },
  cvlt_luna5std: {
    label: 'Rappel 5 (Liste A Essai 5)',
    method: 'regression',
    applies_to: 'age_group_2_only',
    formula: 'Z = (Raw - (22.18 + 0.25×Education - 0.16×Age - 0.85×Sex)) / 2.11',
    coefficients: [
      {
        age_group: 2,
        beta_0: 22.18,
        beta_education: 0.25,
        beta_age: 0.16,
        beta_sex: 0.85,
        sd: 2.11
      }
    ]
  },
  cvlt_luna15tot_std: {
    label: 'Lundi Total (Rappels 1-5)',
    method: 'regression',
    applies_to: 'all_ages',
    formula: 'Z = (Raw - (β₀ + β₁×Education - β₂×Sex - β₃×Age)) / SD',
    coefficients: [
      {
        age_group: 0,
        beta_0: 58.45,
        beta_education: 0.62,
        beta_sex: 1.75,
        beta_age: 0.13,
        sd: 6.83
      },
      {
        age_group: 1,
        beta_0: 53.39,
        beta_education: 1.34,
        beta_sex: 1.91,
        beta_age: 0.24,
        sd: 8.58
      },
      {
        age_group: 2,
        beta_0: 101.86,
        beta_education: 0.88,
        beta_sex: 2.19,
        beta_age: 0.82,
        sd: 8.61
      }
    ]
  },
  cvlt_lunbstd: {
    label: 'Liste B (Mardi)',
    method: 'regression',
    applies_to: 'all_ages',
    formula: 'Z = (Raw - (β₀ + β₁×Education - β₂×Age - β₃×Sex)) / SD',
    coefficients: [
      {
        age_group: 0,
        beta_0: 6.89,
        beta_education: 0.08,
        beta_age: 0,
        beta_sex: 0,
        sd: 2.45
      },
      {
        age_group: 1,
        beta_0: 5.11,
        beta_education: 0.10,
        beta_age: 0,
        beta_sex: 0,
        sd: 2.05
      },
      {
        age_group: 2,
        beta_0: 17.20,
        beta_education: 0.16,
        beta_age: 0.16,
        beta_sex: 0.76,
        sd: 1.96
      }
    ]
  },
  cvlt_rlctstd: {
    label: 'Rappel Libre Court Terme',
    method: 'regression',
    applies_to: 'age_groups_1_2',
    formula: 'Z = (Raw - (β₀ + β₁×Education - β₂×Age - β₃×Sex)) / SD',
    coefficients: [
      {
        age_group: 1,
        beta_0: 11.63,
        beta_education: 0.36,
        beta_age: 0.08,
        beta_sex: 0.48,
        sd: 2.58
      },
      {
        age_group: 2,
        beta_0: 20.56,
        beta_education: 0.25,
        beta_age: 0.19,
        beta_sex: 0,
        sd: 3.13
      }
    ]
  },
  cvlt_rictstd: {
    label: 'Rappel Indicé Court Terme',
    method: 'regression',
    applies_to: 'age_groups_1_2',
    formula: 'Z = (Raw - (β₀ + β₁×Education - β₂×Age - β₃×Sex)) / SD',
    coefficients: [
      {
        age_group: 1,
        beta_0: 10.82,
        beta_education: 0.28,
        beta_age: 0.04,
        beta_sex: 0,
        sd: 2.16
      },
      {
        age_group: 2,
        beta_0: 19.81,
        beta_education: 0.21,
        beta_age: 0.16,
        beta_sex: 0,
        sd: 2.62
      }
    ]
  },
  cvlt_rllt_std: {
    label: 'Rappel Libre Long Terme',
    method: 'regression',
    applies_to: 'age_groups_1_2',
    formula: 'Z = (Raw - (β₀ + β₁×Education - β₂×Age - β₃×Sex)) / SD',
    coefficients: [
      {
        age_group: 1,
        beta_0: 11.80,
        beta_education: 0.37,
        beta_age: 0.07,
        beta_sex: 0.44,
        sd: 2.43
      },
      {
        age_group: 2,
        beta_0: 20.47,
        beta_education: 0.13,
        beta_age: 0.17,
        beta_sex: 0,
        sd: 3.23
      }
    ]
  },
  cvlt_rilt_std: {
    label: 'Rappel Indicé Long Terme',
    method: 'regression',
    applies_to: 'age_groups_1_2',
    formula: 'Z = (Raw - (β₀ + β₁×Education - β₂×Age - β₃×Sex)) / SD',
    coefficients: [
      {
        age_group: 1,
        beta_0: 11.21,
        beta_education: 0.33,
        beta_age: 0.04,
        beta_sex: 0.44,
        sd: 2.15
      },
      {
        age_group: 2,
        beta_0: 20.17,
        beta_education: 0.16,
        beta_age: 0.15,
        beta_sex: 0,
        sd: 2.63
      }
    ]
  },
  cvlt_sem_std: {
    label: 'Indice de Regroupement Sémantique',
    method: 'regression',
    applies_to: 'age_groups_0_2',
    formula: 'Z = (Raw - (β₀ + β₁×Education - β₂×Age - β₃×Sex)) / SD',
    coefficients: [
      {
        age_group: 0,
        beta_0: 1.78,
        beta_education: 0,
        beta_age: -0.02,
        beta_sex: 0,
        sd: 0.83
      },
      {
        age_group: 2,
        beta_0: 4.21,
        beta_education: 0.08,
        beta_age: 0.04,
        beta_sex: 0,
        sd: 0.73
      }
    ]
  },
  cvlt_prim_std: {
    label: 'Primauté',
    method: 'regression',
    applies_to: 'all_ages',
    formula: 'Z = (Raw - (β₀ + β₁×Education - β₂×Age - β₃×Sex)) / SD',
    coefficients: [
      {
        age_group: 0,
        beta_0: 29.94,
        beta_education: -0.14,
        beta_age: -0.08,
        beta_sex: 1.96,
        sd: 3.37
      },
      {
        age_group: 1,
        beta_0: 27.95,
        beta_education: -0.23,
        beta_age: -0.05,
        beta_sex: 0,
        sd: 4.26
      },
      {
        age_group: 2,
        beta_0: 6.19,
        beta_education: 0,
        beta_age: -0.29,
        beta_sex: 0,
        sd: 6.57
      }
    ]
  },
  cvlt_rec_std: {
    label: 'Récence',
    method: 'regression',
    applies_to: 'all_ages',
    formula: 'Z = (Raw - (β₀ + β₁×Education - β₂×Age - β₃×Sex)) / SD',
    coefficients: [
      {
        age_group: 0,
        beta_0: 25.48,
        beta_education: -0.21,
        beta_age: 0,
        beta_sex: -1.71,
        sd: 3.88
      },
      {
        age_group: 1,
        beta_0: 29.45,
        beta_education: 0,
        beta_age: 0,
        beta_sex: 0,
        sd: 5.10
      },
      {
        age_group: 2,
        beta_0: 39.31,
        beta_education: 0,
        beta_age: -0.17,
        beta_sex: 0,
        sd: 7.17
      }
    ]
  },
  cvlt_biais_std: {
    label: 'Biais',
    method: 'regression',
    applies_to: 'all_ages',
    formula: 'Z = (Raw - (β₀ + β₁×Education - β₂×Age - β₃×Sex)) / SD',
    coefficients: [
      {
        age_group: 0,
        beta_0: -0.03,
        beta_education: 0,
        beta_age: 0,
        beta_sex: 0,
        sd: 0.17
      },
      {
        age_group: 1,
        beta_0: -0.50,
        beta_education: 0.01,
        beta_age: -0.01,
        beta_sex: 0,
        sd: 0.30
      },
      {
        age_group: 2,
        beta_0: -0.15,
        beta_education: 0,
        beta_age: 0,
        beta_sex: 0.10,
        sd: 0.41
      }
    ]
  }
};

// ============================================================================
// Percentile Norms (Lookup Tables)
// ============================================================================

export const CVLT_PERCENTILE_NORMS: Record<string, PercentileNorm> = {
  cvlt_luna5std: {
    label: 'Rappel 5 (Liste A Essai 5)',
    method: 'percentile_lookup',
    applies_to: 'age_groups_0_1',
    direction: 'higher_is_better',
    tables: [
      {
        age_group: 0,
        thresholds: [16, 16, 16, 14.5, 13, 10, 8],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      },
      {
        age_group: 1,
        thresholds: [16, 16, 14, 12.5, 11, 8, 6],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      }
    ]
  },
  cvlt_rlctstd: {
    label: 'Rappel Libre Court Terme',
    method: 'percentile_lookup',
    applies_to: 'age_group_0',
    direction: 'higher_is_better',
    tables: [
      {
        age_group: 0,
        thresholds: [16, 16, 15, 13, 11, 8, 6],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      }
    ]
  },
  cvlt_rictstd: {
    label: 'Rappel Indicé Court Terme',
    method: 'percentile_lookup',
    applies_to: 'age_group_0',
    direction: 'higher_is_better',
    tables: [
      {
        age_group: 0,
        thresholds: [16, 16, 15, 14, 12, 9, 7],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      }
    ]
  },
  cvlt_rllt_std: {
    label: 'Rappel Libre Long Terme',
    method: 'percentile_lookup',
    applies_to: 'age_group_0',
    direction: 'higher_is_better',
    tables: [
      {
        age_group: 0,
        thresholds: [16, 16, 15, 13.5, 11, 9, 7],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      }
    ]
  },
  cvlt_rilt_std: {
    label: 'Rappel Indicé Long Terme',
    method: 'percentile_lookup',
    applies_to: 'age_group_0',
    direction: 'higher_is_better',
    tables: [
      {
        age_group: 0,
        thresholds: [16, 16, 15, 14, 12, 10, 8],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      }
    ]
  },
  cvlt_sem_std: {
    label: 'Indice de Regroupement Sémantique',
    method: 'percentile_lookup',
    applies_to: 'age_group_1',
    direction: 'higher_is_better',
    tables: [
      {
        age_group: 1,
        thresholds: [4.0, 3.7, 3.0, 2.3, 1.6, 0.9, 0.4],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      }
    ]
  },
  cvlt_ser_std: {
    label: 'Indice de Regroupement Sériel',
    method: 'percentile_lookup',
    applies_to: 'all_ages',
    direction: 'lower_is_better',
    note: 'Higher raw scores indicate worse performance',
    tables: [
      {
        age_group: 0,
        thresholds: [0, 0, 1, 2, 3, 8, 12],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      },
      {
        age_group: 1,
        thresholds: [0, 0, 0, 1.2, 2.1, 4.4, 5.3],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      },
      {
        age_group: 2,
        thresholds: [0, 0, 1, 2, 3, 5, 6],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      }
    ]
  },
  cvlt_persev_std: {
    label: 'Total Persévérations',
    method: 'percentile_lookup',
    applies_to: 'all_ages',
    direction: 'lower_is_better',
    note: 'Higher raw scores indicate worse performance',
    tables: [
      {
        age_group: 0,
        thresholds: [0, 0, 1, 3, 5, 10, 15],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      },
      {
        age_group: 1,
        thresholds: [0, 0, 1, 3, 6, 11, 14],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      },
      {
        age_group: 2,
        thresholds: [0, 0, 1, 2.5, 6, 11, 15],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      }
    ]
  },
  cvlt_intru_std: {
    label: 'Total Intrusions',
    method: 'percentile_lookup',
    applies_to: 'all_ages',
    direction: 'lower_is_better',
    note: 'Higher raw scores indicate worse performance',
    tables: [
      {
        age_group: 0,
        thresholds: [0, 0, 0, 2, 5, 11, 14],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      },
      {
        age_group: 1,
        thresholds: [0, 0, 1, 2, 6, 13, 15],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      },
      {
        age_group: 2,
        thresholds: [0, 0, 2, 4.5, 9, 16, 21],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      }
    ]
  },
  cvlt_reconn_std: {
    label: 'Reconnaissances Correctes',
    method: 'percentile_lookup',
    applies_to: 'all_ages',
    direction: 'higher_is_better',
    tables: [
      {
        age_group: 0,
        thresholds: [16, 16, 16, 15.5, 15, 13, 12],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      },
      {
        age_group: 1,
        thresholds: [16, 16, 16, 15, 14, 11, 9],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      },
      {
        age_group: 2,
        thresholds: [16, 16, 15, 14, 13, 9, 7],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      }
    ]
  },
  cvlt_fauss_reconn_std: {
    label: 'Fausses Reconnaissances',
    method: 'percentile_lookup',
    applies_to: 'all_ages',
    direction: 'lower_is_better',
    note: 'Higher raw scores indicate worse performance',
    tables: [
      {
        age_group: 0,
        thresholds: [0, 0, 0, 0, 0, 2, 3],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      },
      {
        age_group: 1,
        thresholds: [0, 0, 0, 0, 1, 4, 6],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      },
      {
        age_group: 2,
        thresholds: [0, 0, 0, 1.5, 3, 7, 14],
        percentiles: [99, 95, 75, 50, 25, 5, 1]
      }
    ]
  },
  cvlt_discrim_std: {
    label: 'Discriminabilité',
    method: 'percentile_lookup',
    applies_to: 'all_ages',
    direction: 'higher_is_better',
    special_rule: 'If raw score = 100, percentile = 99',
    tables: [
      {
        age_group: 0,
        thresholds: [90, 92, 96, 99, 100, 100, 100],
        percentiles: [1, 5, 25, 50, 75, 95, 99]
      },
      {
        age_group: 1,
        thresholds: [79, 84, 91, 95, 99, 100, 100],
        percentiles: [1, 5, 25, 50, 75, 95, 99]
      },
      {
        age_group: 2,
        thresholds: [65, 75, 85, 92, 96, 99, 100],
        percentiles: [1, 5, 25, 50, 75, 95, 99]
      }
    ]
  }
};

