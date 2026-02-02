// eFondaMental Platform - Test des Commissions Normative Data
// Used for both Bipolar and Schizophrenia verticals
// Reference: French normative study

// ============================================================================
// Types
// ============================================================================

export interface CommissionsPercentileTable {
  thresholds: number[];  // Raw score thresholds (lower = better)
  percentiles: number[]; // Corresponding percentiles [95, 90, 80, 75, 50, 25, 20, 10, 5]
}

export interface CommissionsNscNorms {
  description: string;
  time_minutes: CommissionsPercentileTable;
  detours: CommissionsPercentileTable;
  schedule_violations: CommissionsPercentileTable;
  logic_errors: CommissionsPercentileTable;
  total_errors: CommissionsPercentileTable;
}

export interface CommissionsZScoreParams {
  means: number[];    // [time, detours, schedule, logic, total_errors]
  std_devs: number[]; // [time, detours, schedule, logic, total_errors]
}

export interface CommissionsAgeGroupNorms {
  nsc_0: CommissionsZScoreParams;
  nsc_1: CommissionsZScoreParams;
}

// ============================================================================
// Percentile Norms (stratified by NSC only)
// ============================================================================

// Percentile thresholds: [95, 90, 80, 75, 50, 25, 20, 10, 5]
// Lower raw scores = better performance = higher percentile
const PERCENTILES = [95, 90, 80, 75, 50, 25, 20, 10, 5];

export const COMMISSIONS_PERCENTILE_NORMS: Record<number, CommissionsNscNorms> = {
  // NSC 0 - Lower education level
  0: {
    description: 'Lower education level (NSC 0)',
    time_minutes: {
      thresholds: [3, 3, 4, 5, 7, 9, 9, 10, 12],
      percentiles: PERCENTILES
    },
    detours: {
      thresholds: [0, 0, 0, 1, 1, 2, 2, 2, 3],
      percentiles: PERCENTILES
    },
    schedule_violations: {
      thresholds: [0, 0, 0, 0, 1, 1, 1, 1, 2],
      percentiles: PERCENTILES
    },
    logic_errors: {
      thresholds: [0, 0, 0, 0, 1, 1, 1, 2, 2],
      percentiles: PERCENTILES
    },
    total_errors: {
      thresholds: [0, 1, 1, 1, 3, 3, 4, 5, 5],
      percentiles: PERCENTILES
    }
  },
  // NSC 1 - Higher education level (Baccalauréat+)
  1: {
    description: 'Higher education level (NSC 1)',
    time_minutes: {
      thresholds: [1, 2, 3, 4, 6, 8, 8, 9, 10],
      percentiles: PERCENTILES
    },
    detours: {
      thresholds: [0, 0, 0, 0, 1, 1, 1, 2, 2],
      percentiles: PERCENTILES
    },
    schedule_violations: {
      thresholds: [0, 0, 0, 0, 1, 1, 1, 1, 2],
      percentiles: PERCENTILES
    },
    logic_errors: {
      thresholds: [0, 0, 0, 0, 0, 1, 1, 1, 1],
      percentiles: PERCENTILES
    },
    total_errors: {
      thresholds: [0, 0, 0, 1, 2, 3, 3, 4, 4],
      percentiles: PERCENTILES
    }
  }
};

// ============================================================================
// Z-Score Parameters (stratified by Age Group × NSC)
// ============================================================================

// Measure indices for Z-score arrays:
// 0: time_minutes
// 1: detours
// 2: schedule_violations
// 3: logic_errors
// 4: total_errors

export const COMMISSIONS_ZSCORE_NORMS: Record<number, CommissionsAgeGroupNorms> = {
  // Age group 0: 20-40 years
  0: {
    nsc_0: {
      means: [6.37, 1.12, 0.62, 0.87, 2.02],
      std_devs: [3.02, 0.83, 0.74, 0.64, 1.51]
    },
    nsc_1: {
      means: [5.05, 0.86, 0.52, 0.62, 2.00],
      std_devs: [2.04, 0.96, 0.60, 0.67, 1.13]
    }
  },
  // Age group 1: 41-60 years
  1: {
    nsc_0: {
      means: [6.89, 1.21, 0.58, 0.79, 2.58],
      std_devs: [2.90, 0.79, 0.69, 0.63, 1.61]
    },
    nsc_1: {
      means: [7.00, 0.33, 0.50, 0.08, 0.92],
      std_devs: [3.38, 0.65, 0.79, 0.29, 1.08]
    }
  }
};

// ============================================================================
// Metadata
// ============================================================================

export const COMMISSIONS_NORMS_METADATA = {
  validAgeRange: { min: 20, max: 60 },
  ageGroups: [
    { code: 0, label: '20-40 years', min: 20, max: 40 },
    { code: 1, label: '41-60 years', min: 41, max: 60 }
  ],
  educationLevels: [
    { code: 0, label: 'NSC 0 - Lower education (< Baccalauréat)' },
    { code: 1, label: 'NSC 1 - Higher education (≥ Baccalauréat)' }
  ],
  measures: [
    { index: 0, id: 'time_minutes', label: 'Temps de réalisation', unit: 'minutes' },
    { index: 1, id: 'detours', label: 'Détours inutiles', unit: 'count' },
    { index: 2, id: 'schedule_violations', label: 'Non respect des horaires', unit: 'count' },
    { index: 3, id: 'logic_errors', label: 'Erreurs logiques', unit: 'count' },
    { index: 4, id: 'total_errors', label: 'Erreurs totales', unit: 'count' }
  ],
  scoringDirection: 'lower_is_better',
  zScoreFormula: 'Z = (mean - raw) / std_dev (positive Z = better performance)'
};
