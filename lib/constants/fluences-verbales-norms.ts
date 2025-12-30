// ============================================================================
// Fluences Verbales (Cardebat et al., 1990) - GREFEX Normative Data
// ============================================================================
// Complete normative data for verbal fluency assessment
// Source: GREFEX (Groupe de Réflexion sur l'Évaluation des Fonctions EXécutives)
// Stratified by age groups and education levels
// ============================================================================

export interface FluencesVerbalesNormCell {
  percentiles: {
    5: number;
    10: number;
    25: number;
    50: number;
    75: number;
    90: number;
    95: number;
  };
  mean: number;
  sd: number;
}

export interface FluencesVerbalesNormTable {
  age_0_lt_40: {
    education_0_lt_6: FluencesVerbalesNormCell;
    education_1_6_to_12: FluencesVerbalesNormCell;
    education_2_gte_12: FluencesVerbalesNormCell;
  };
  age_1_40_to_60: {
    education_0_lt_6: FluencesVerbalesNormCell;
    education_1_6_to_12: FluencesVerbalesNormCell;
    education_2_gte_12: FluencesVerbalesNormCell;
  };
  age_2_gt_60: {
    education_0_lt_6: FluencesVerbalesNormCell;
    education_1_6_to_12: FluencesVerbalesNormCell;
    education_2_gte_12: FluencesVerbalesNormCell;
  };
}

export const FLUENCES_VERBALES_NORMS = {
  metadata: {
    title: "Fluences verbales (Cardebat et al., 1990)",
    code: "FLUENCES_VERBALES_CARDEBAT",
    reference: "Cardebat et al., 1990",
    source: "GREFEX norms",
    description: "Verbal fluency test assessing phonemic (letter P) and semantic (animals) fluency",
    age_groups: {
      0: { range: "< 40 years", label: "< 40 years" },
      1: { range: "40-60 years", label: "40-60 years" },
      2: { range: "> 60 years", label: "> 60 years" }
    },
    education_levels: {
      0: { range: "< 6 years", label: "< 6 years" },
      1: { range: "6-12 years", label: "6-12 years" },
      2: { range: ">= 12 years", label: ">= 12 years" }
    }
  },

  letter_p: {
    age_0_lt_40: {
      education_0_lt_6: {
        percentiles: {
          5: 5.9,
          10: 9,
          25: 14,
          50: 16.5,
          75: 22.75,
          90: 25.7,
          95: 28.35
        },
        mean: 17.3,
        sd: 6.4
      },
      education_1_6_to_12: {
        percentiles: {
          5: 10.8,
          10: 12,
          25: 14,
          50: 19,
          75: 24,
          90: 27.2,
          95: 31.2
        },
        mean: 19.5,
        sd: 6.3
      },
      education_2_gte_12: {
        percentiles: {
          5: 13,
          10: 14,
          25: 19,
          50: 25,
          75: 28.75,
          90: 32.3,
          95: 34
        },
        mean: 24,
        sd: 6.6
      }
    },
    age_1_40_to_60: {
      education_0_lt_6: {
        percentiles: {
          5: 8.2,
          10: 11,
          25: 15.5,
          50: 20,
          75: 25,
          90: 27.8,
          95: 31.8
        },
        mean: 19.9,
        sd: 6.9
      },
      education_1_6_to_12: {
        percentiles: {
          5: 10.1,
          10: 13.2,
          25: 16,
          50: 21,
          75: 25,
          90: 28.8,
          95: 30
        },
        mean: 20.9,
        sd: 5.9
      },
      education_2_gte_12: {
        percentiles: {
          5: 15.5,
          10: 18,
          25: 22,
          50: 25,
          75: 30,
          90: 34,
          95: 37.5
        },
        mean: 25.7,
        sd: 6.3
      }
    },
    age_2_gt_60: {
      education_0_lt_6: {
        percentiles: {
          5: 6.5,
          10: 8,
          25: 12,
          50: 16,
          75: 20,
          90: 22,
          95: 25
        },
        mean: 15.7,
        sd: 5.6
      },
      education_1_6_to_12: {
        percentiles: {
          5: 9.75,
          10: 12,
          25: 14.75,
          50: 19,
          75: 24,
          90: 30,
          95: 32.25
        },
        mean: 19.7,
        sd: 6.7
      },
      education_2_gte_12: {
        percentiles: {
          5: 12.25,
          10: 15.5,
          25: 19,
          50: 22,
          75: 26,
          90: 30,
          95: 31.25
        },
        mean: 22.4,
        sd: 5.5
      }
    }
  } as FluencesVerbalesNormTable,

  animals: {
    age_0_lt_40: {
      education_0_lt_6: {
        percentiles: {
          5: 19,
          10: 21,
          25: 24.25,
          50: 31,
          75: 34,
          90: 38,
          95: 38.7
        },
        mean: 29.5,
        sd: 6.0
      },
      education_1_6_to_12: {
        percentiles: {
          5: 18.4,
          10: 19.8,
          25: 24,
          50: 29,
          75: 36,
          90: 40,
          95: 44.2
        },
        mean: 29.9,
        sd: 7.9
      },
      education_2_gte_12: {
        percentiles: {
          5: 21,
          10: 24,
          25: 28,
          50: 34,
          75: 40,
          90: 45,
          95: 48.2
        },
        mean: 34.2,
        sd: 8.2
      }
    },
    age_1_40_to_60: {
      education_0_lt_6: {
        percentiles: {
          5: 16,
          10: 20.4,
          25: 23,
          50: 26,
          75: 32,
          90: 42.6,
          95: 45.9
        },
        mean: 28.2,
        sd: 7.9
      },
      education_1_6_to_12: {
        percentiles: {
          5: 18.2,
          10: 21.4,
          25: 27,
          50: 32,
          75: 35,
          90: 40,
          95: 42.9
        },
        mean: 31.3,
        sd: 6.8
      },
      education_2_gte_12: {
        percentiles: {
          5: 24.5,
          10: 27,
          25: 31.5,
          50: 36,
          75: 40,
          90: 47,
          95: 52.5
        },
        mean: 36.8,
        sd: 8.7
      }
    },
    age_2_gt_60: {
      education_0_lt_6: {
        percentiles: {
          5: 16,
          10: 17,
          25: 20,
          50: 24,
          75: 29.75,
          90: 33,
          95: 37
        },
        mean: 24.7,
        sd: 6.3
      },
      education_1_6_to_12: {
        percentiles: {
          5: 14.75,
          10: 17,
          25: 22,
          50: 26,
          75: 32,
          90: 37,
          95: 41
        },
        mean: 26.8,
        sd: 7.4
      },
      education_2_gte_12: {
        percentiles: {
          5: 15.25,
          10: 21,
          25: 23.75,
          50: 30,
          75: 35.5,
          90: 39.5,
          95: 43.25
        },
        mean: 29.7,
        sd: 8.8
      }
    }
  } as FluencesVerbalesNormTable,

  scoring_notes: {
    general: [
      "All computed scores are automatically calculated and read-only",
      "Z-scores are rounded to 2 decimal places",
      "Percentiles can be exact values, ranges, or boundary indicators (< 5, > 95)",
      "All normative data is from GREFEX (Groupe de Réflexion sur l'Évaluation des Fonctions EXécutives)"
    ],
    stratification_logic: [
      "Age categories: < 40, 40-60, > 60 years",
      "Education levels: < 6, 6-12, >= 12 years",
      "Each combination has unique mean, SD, and percentile values"
    ],
    rule_violations: [
      "MD (Mots dérivés): Words derived from the same root (e.g., 'paint', 'painter', 'painting')",
      "I (Intrusions): Words that don't match the category criteria",
      "NP (Noms propres): Proper names which are typically not allowed"
    ],
    clustering_and_switching: [
      "Clusters: Groups of semantically or phonemically related words produced consecutively",
      "Switches: Transitions between different clusters",
      "These metrics assess strategic search processes and cognitive flexibility"
    ]
  }
};

