// ============================================================================
// WAIS-III Vocabulaire (Wechsler, 1997) - Normative Data
// ============================================================================
// Complete normative data for WAIS-III Vocabulary subtest
// Source: Wechsler Adult Intelligence Scale III (1997)
// Age-stratified standard score conversion tables
// ============================================================================

export interface VocabulaireStandardScoreThreshold {
  raw_score_max?: number; // Upper bound for this standard score (for scores 1-18)
  raw_score_min?: number; // Lower bound for this standard score (for score 19)
}

export interface VocabulaireAgeGroupNorms {
  description: string;
  standard_scores: {
    [standardScore: string]: VocabulaireStandardScoreThreshold;
  };
}

export const WAIS3_VOCABULAIRE_NORMS = {
  metadata: {
    title: "WAIS-III (Wechsler, 1997) - Subtest Vocabulaire",
    code: "WAIS3_VOCABULAIRE",
    reference: "Wechsler, 1997",
    description: "Vocabulary subtest from the Wechsler Adult Intelligence Scale III, assessing word knowledge and verbal concept formation",
    raw_score_range: {
      min: 0,
      max: 66,
      description: "33 items scored 0-2 each"
    },
    standard_score_range: {
      min: 1,
      max: 19,
      description: "Age-adjusted scaled scores"
    },
    age_groups: {
      "16_17": { range: "16-17 years", condition: "age < 18" },
      "18_19": { range: "18-19 years", condition: "18 <= age < 20" },
      "20_24": { range: "20-24 years", condition: "20 <= age < 25" },
      "25_29": { range: "25-29 years", condition: "25 <= age < 30" },
      "30_34": { range: "30-34 years", condition: "30 <= age < 35" },
      "35_44": { range: "35-44 years", condition: "35 <= age < 45" },
      "45_54": { range: "45-54 years", condition: "45 <= age < 55" },
      "55_64": { range: "55-64 years", condition: "55 <= age < 65" },
      "65_69": { range: "65-69 years", condition: "65 <= age < 70" },
      "70_74": { range: "70-74 years", condition: "70 <= age < 75" },
      "75_79": { range: "75-79 years", condition: "75 <= age < 80" },
      "80_plus": { range: "80+ years", condition: "age >= 80" }
    }
  },

  age_groups: {
    "16_17": {
      description: "Normative values for ages 16-17",
      standard_scores: {
        "1": { raw_score_max: 3 },
        "2": { raw_score_max: 8 },
        "3": { raw_score_max: 11 },
        "4": { raw_score_max: 15 },
        "5": { raw_score_max: 18 },
        "6": { raw_score_max: 20 },
        "7": { raw_score_max: 24 },
        "8": { raw_score_max: 27 },
        "9": { raw_score_max: 30 },
        "10": { raw_score_max: 33 },
        "11": { raw_score_max: 35 },
        "12": { raw_score_max: 37 },
        "13": { raw_score_max: 40 },
        "14": { raw_score_max: 44 },
        "15": { raw_score_max: 47 },
        "16": { raw_score_max: 49 },
        "17": { raw_score_max: 51 },
        "18": { raw_score_max: 53 },
        "19": { raw_score_min: 54 }
      }
    } as VocabulaireAgeGroupNorms,

    "18_19": {
      description: "Normative values for ages 18-19",
      standard_scores: {
        "1": { raw_score_max: 5 },
        "2": { raw_score_max: 11 },
        "3": { raw_score_max: 14 },
        "4": { raw_score_max: 18 },
        "5": { raw_score_max: 20 },
        "6": { raw_score_max: 23 },
        "7": { raw_score_max: 26 },
        "8": { raw_score_max: 30 },
        "9": { raw_score_max: 32 },
        "10": { raw_score_max: 35 },
        "11": { raw_score_max: 38 },
        "12": { raw_score_max: 41 },
        "13": { raw_score_max: 43 },
        "14": { raw_score_max: 46 },
        "15": { raw_score_max: 48 },
        "16": { raw_score_max: 51 },
        "17": { raw_score_max: 53 },
        "18": { raw_score_max: 55 },
        "19": { raw_score_min: 56 }
      }
    } as VocabulaireAgeGroupNorms,

    "20_24": {
      description: "Normative values for ages 20-24",
      standard_scores: {
        "1": { raw_score_max: 6 },
        "2": { raw_score_max: 12 },
        "3": { raw_score_max: 15 },
        "4": { raw_score_max: 19 },
        "5": { raw_score_max: 21 },
        "6": { raw_score_max: 24 },
        "7": { raw_score_max: 28 },
        "8": { raw_score_max: 32 },
        "9": { raw_score_max: 34 },
        "10": { raw_score_max: 38 },
        "11": { raw_score_max: 42 },
        "12": { raw_score_max: 44 },
        "13": { raw_score_max: 48 },
        "14": { raw_score_max: 51 },
        "15": { raw_score_max: 53 },
        "16": { raw_score_max: 55 },
        "17": { raw_score_max: 57 },
        "18": { raw_score_max: 59 },
        "19": { raw_score_min: 60 }
      }
    } as VocabulaireAgeGroupNorms,

    "25_29": {
      description: "Normative values for ages 25-29",
      standard_scores: {
        "1": { raw_score_max: 7 },
        "2": { raw_score_max: 13 },
        "3": { raw_score_max: 16 },
        "4": { raw_score_max: 20 },
        "5": { raw_score_max: 22 },
        "6": { raw_score_max: 25 },
        "7": { raw_score_max: 28 },
        "8": { raw_score_max: 32 },
        "9": { raw_score_max: 35 },
        "10": { raw_score_max: 39 },
        "11": { raw_score_max: 43 },
        "12": { raw_score_max: 45 },
        "13": { raw_score_max: 49 },
        "14": { raw_score_max: 52 },
        "15": { raw_score_max: 54 },
        "16": { raw_score_max: 56 },
        "17": { raw_score_max: 58 },
        "18": { raw_score_max: 60 },
        "19": { raw_score_min: 61 }
      }
    } as VocabulaireAgeGroupNorms,

    "30_34": {
      description: "Normative values for ages 30-34 (same as 25-29)",
      standard_scores: {
        "1": { raw_score_max: 7 },
        "2": { raw_score_max: 13 },
        "3": { raw_score_max: 16 },
        "4": { raw_score_max: 20 },
        "5": { raw_score_max: 22 },
        "6": { raw_score_max: 25 },
        "7": { raw_score_max: 28 },
        "8": { raw_score_max: 32 },
        "9": { raw_score_max: 35 },
        "10": { raw_score_max: 39 },
        "11": { raw_score_max: 43 },
        "12": { raw_score_max: 45 },
        "13": { raw_score_max: 49 },
        "14": { raw_score_max: 52 },
        "15": { raw_score_max: 54 },
        "16": { raw_score_max: 56 },
        "17": { raw_score_max: 58 },
        "18": { raw_score_max: 60 },
        "19": { raw_score_min: 61 }
      }
    } as VocabulaireAgeGroupNorms,

    "35_44": {
      description: "Normative values for ages 35-44",
      standard_scores: {
        "1": { raw_score_max: 8 },
        "2": { raw_score_max: 13 },
        "3": { raw_score_max: 16 },
        "4": { raw_score_max: 19 },
        "5": { raw_score_max: 23 },
        "6": { raw_score_max: 25 },
        "7": { raw_score_max: 29 },
        "8": { raw_score_max: 33 },
        "9": { raw_score_max: 37 },
        "10": { raw_score_max: 42 },
        "11": { raw_score_max: 45 },
        "12": { raw_score_max: 47 },
        "13": { raw_score_max: 49 },
        "14": { raw_score_max: 52 },
        "15": { raw_score_max: 54 },
        "16": { raw_score_max: 57 },
        "17": { raw_score_max: 60 },
        "18": { raw_score_max: 62 },
        "19": { raw_score_min: 63 }
      }
    } as VocabulaireAgeGroupNorms,

    "45_54": {
      description: "Normative values for ages 45-54 (same as 35-44 with slight variation)",
      standard_scores: {
        "1": { raw_score_max: 8 },
        "2": { raw_score_max: 13 },
        "3": { raw_score_max: 16 },
        "4": { raw_score_max: 19 },
        "5": { raw_score_max: 23 },
        "6": { raw_score_max: 25 },
        "7": { raw_score_max: 29 },
        "8": { raw_score_max: 33 },
        "9": { raw_score_max: 37 },
        "10": { raw_score_max: 42 },
        "11": { raw_score_max: 46 },
        "12": { raw_score_max: 49 },
        "13": { raw_score_max: 52 },
        "14": { raw_score_max: 55 },
        "15": { raw_score_max: 58 },
        "16": { raw_score_max: 60 },
        "17": { raw_score_max: 62 },
        "18": { raw_score_max: 64 },
        "19": { raw_score_min: 65 }
      }
    } as VocabulaireAgeGroupNorms,

    "55_64": {
      description: "Normative values for ages 55-64",
      standard_scores: {
        "1": { raw_score_max: 8 },
        "2": { raw_score_max: 13 },
        "3": { raw_score_max: 16 },
        "4": { raw_score_max: 19 },
        "5": { raw_score_max: 23 },
        "6": { raw_score_max: 25 },
        "7": { raw_score_max: 29 },
        "8": { raw_score_max: 33 },
        "9": { raw_score_max: 37 },
        "10": { raw_score_max: 42 },
        "11": { raw_score_max: 46 },
        "12": { raw_score_max: 50 },
        "13": { raw_score_max: 53 },
        "14": { raw_score_max: 56 },
        "15": { raw_score_max: 59 },
        "16": { raw_score_max: 61 },
        "17": { raw_score_max: 63 },
        "18": { raw_score_max: 65 },
        "19": { raw_score_min: 66 }
      }
    } as VocabulaireAgeGroupNorms,

    "65_69": {
      description: "Normative values for ages 65-69 (same as 55-64)",
      standard_scores: {
        "1": { raw_score_max: 8 },
        "2": { raw_score_max: 13 },
        "3": { raw_score_max: 16 },
        "4": { raw_score_max: 19 },
        "5": { raw_score_max: 23 },
        "6": { raw_score_max: 25 },
        "7": { raw_score_max: 29 },
        "8": { raw_score_max: 33 },
        "9": { raw_score_max: 37 },
        "10": { raw_score_max: 42 },
        "11": { raw_score_max: 46 },
        "12": { raw_score_max: 50 },
        "13": { raw_score_max: 53 },
        "14": { raw_score_max: 56 },
        "15": { raw_score_max: 59 },
        "16": { raw_score_max: 61 },
        "17": { raw_score_max: 63 },
        "18": { raw_score_max: 65 },
        "19": { raw_score_min: 66 }
      }
    } as VocabulaireAgeGroupNorms,

    "70_74": {
      description: "Normative values for ages 70-74",
      standard_scores: {
        "1": { raw_score_max: 6 },
        "2": { raw_score_max: 8 },
        "3": { raw_score_max: 10 },
        "4": { raw_score_max: 12 },
        "5": { raw_score_max: 15 },
        "6": { raw_score_max: 18 },
        "7": { raw_score_max: 21 },
        "8": { raw_score_max: 25 },
        "9": { raw_score_max: 29 },
        "10": { raw_score_max: 33 },
        "11": { raw_score_max: 39 },
        "12": { raw_score_max: 43 },
        "13": { raw_score_max: 47 },
        "14": { raw_score_max: 51 },
        "15": { raw_score_max: 55 },
        "16": { raw_score_max: 58 },
        "17": { raw_score_max: 60 },
        "18": { raw_score_max: 62 },
        "19": { raw_score_min: 63 }
      }
    } as VocabulaireAgeGroupNorms,

    "75_79": {
      description: "Normative values for ages 75-79 (same as 70-74)",
      standard_scores: {
        "1": { raw_score_max: 6 },
        "2": { raw_score_max: 8 },
        "3": { raw_score_max: 10 },
        "4": { raw_score_max: 12 },
        "5": { raw_score_max: 15 },
        "6": { raw_score_max: 18 },
        "7": { raw_score_max: 21 },
        "8": { raw_score_max: 25 },
        "9": { raw_score_max: 29 },
        "10": { raw_score_max: 33 },
        "11": { raw_score_max: 39 },
        "12": { raw_score_max: 43 },
        "13": { raw_score_max: 47 },
        "14": { raw_score_max: 51 },
        "15": { raw_score_max: 55 },
        "16": { raw_score_max: 58 },
        "17": { raw_score_max: 60 },
        "18": { raw_score_max: 62 },
        "19": { raw_score_min: 63 }
      }
    } as VocabulaireAgeGroupNorms,

    "80_plus": {
      description: "Normative values for ages 80+",
      standard_scores: {
        "1": { raw_score_max: 5 },
        "2": { raw_score_max: 7 },
        "3": { raw_score_max: 9 },
        "4": { raw_score_max: 11 },
        "5": { raw_score_max: 14 },
        "6": { raw_score_max: 17 },
        "7": { raw_score_max: 21 },
        "8": { raw_score_max: 25 },
        "9": { raw_score_max: 29 },
        "10": { raw_score_max: 33 },
        "11": { raw_score_max: 39 },
        "12": { raw_score_max: 43 },
        "13": { raw_score_max: 47 },
        "14": { raw_score_max: 51 },
        "15": { raw_score_max: 55 },
        "16": { raw_score_max: 58 },
        "17": { raw_score_max: 60 },
        "18": { raw_score_max: 62 },
        "19": { raw_score_min: 63 }
      }
    } as VocabulaireAgeGroupNorms
  },

  scoring_notes: {
    general: [
      "All items are scored 0, 1, or 2 points based on quality of response",
      "Maximum possible raw score is 66 (33 items × 2 points)",
      "Standard scores range from 1 to 19 (scaled scores)",
      "Standard score of 10 represents average performance for age"
    ],
    administration: [
      "For individuals aged 16+ years, begin with item 4",
      "Discontinue after 6 consecutive scores of 0",
      "If items 4-7 are not perfect, administer items 1-3 in reverse order",
      "All earlier items not administered are scored 2 points each"
    ],
    standardization: [
      "Standard scores are age-adjusted using 12 age bands",
      "Age bands: 16-17, 18-19, 20-24, 25-29, 30-34, 35-44, 45-54, 55-64, 65-69, 70-74, 75-79, 80+",
      "The standardized value uses a scale with mean=10 and SD=3"
    ],
    interpretation: [
      "Standard score of 10 = Average performance for age",
      "Standard score of 7-13 = Within 1 SD of mean (average range)",
      "Standard score < 7 = Below average",
      "Standard score > 13 = Above average"
    ]
  }
};

