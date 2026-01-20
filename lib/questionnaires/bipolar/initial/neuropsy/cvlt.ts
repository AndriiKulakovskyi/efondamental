// eFondaMental Platform - CVLT (California Verbal Learning Test)
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarCvltResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  patient_age?: number | null;
  years_of_education?: number | null;
  patient_sex?: string | null;
  // Trial scores (DB column names)
  trial_1: number | null;
  trial_2: number | null;
  trial_3: number | null;
  trial_4: number | null;
  trial_5: number | null;
  total_1_5: number | null;
  // List B
  list_b: number | null;
  // Short delay (sdfr = Short Delay Free Recall, sdcr = Short Delay Cued Recall)
  sdfr: number | null;
  sdcr: number | null;
  // Long delay (ldfr = Long Delay Free Recall, ldcr = Long Delay Cued Recall)
  ldfr: number | null;
  ldcr: number | null;
  // Recognition
  recognition_hits: number | null;
  false_positives: number | null;
  discriminability: number | null;
  // Additional metrics
  semantic_clustering: number | null;
  serial_clustering: number | null;
  primacy: number | null;
  recency: number | null;
  response_bias: number | null;
  intrusions: number | null;
  perseverations: number | null;
  // Standardized scores
  trial_1_std: number | null;
  trial_5_std: number | null;
  total_1_5_std: number | null;
  list_b_std: number | null;
  sdfr_std: number | null;
  sdcr_std: number | null;
  ldfr_std: number | null;
  ldcr_std: number | null;
  semantic_std: number | null;
  serial_std: number | null;
  persev_std: number | null;
  intru_std: number | null;
  recog_std: number | null;
  false_recog_std: number | null;
  discrim_std: number | null;
  primacy_std: number | null;
  recency_std: number | null;
  bias_std: number | null;
  // Version
  cvlt_delai?: number | null;
  questionnaire_version?: string | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarCvltResponseInsert = Omit<
  BipolarCvltResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'z_score_trials_1_5' | 'z_score_long_delay_free' | 'z_score_recognition'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const CVLT_QUESTIONS: Question[] = [
  // Learning Trials
  {
    id: 'section_learning',
    text: 'Essais d\'Apprentissage (Liste A)',
    type: 'section',
    required: false
  },
  {
    id: 'trial_1',
    text: 'Essai 1 - Nombre de mots rappeles',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'trial_2',
    text: 'Essai 2 - Nombre de mots rappeles',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'trial_3',
    text: 'Essai 3 - Nombre de mots rappeles',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'trial_4',
    text: 'Essai 4 - Nombre de mots rappeles',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'trial_5',
    text: 'Essai 5 - Nombre de mots rappeles',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'total_1_5',
    text: 'Total Essais 1-5',
    type: 'number',
    required: false,
    min: 0,
    max: 80,
    help: 'Somme des essais 1 a 5'
  },

  // List B
  {
    id: 'section_list_b',
    text: 'Liste B (Interference)',
    type: 'section',
    required: false
  },
  {
    id: 'list_b',
    text: 'Liste B - Nombre de mots rappeles',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },

  // Short Delay
  {
    id: 'section_short_delay',
    text: 'Rappel Differe Court (apres Liste B)',
    type: 'section',
    required: false
  },
  {
    id: 'sdfr',
    text: 'Rappel Libre Court Differe (SDFR)',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'sdcr',
    text: 'Rappel Indice Court Differe (SDCR)',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },

  // Long Delay
  {
    id: 'section_long_delay',
    text: 'Rappel Differe Long (20 min)',
    type: 'section',
    required: false
  },
  {
    id: 'ldfr',
    text: 'Rappel Libre Long Differe (LDFR)',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'ldcr',
    text: 'Rappel Indice Long Differe (LDCR)',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },

  // Recognition
  {
    id: 'section_recognition',
    text: 'Reconnaissance',
    type: 'section',
    required: false
  },
  {
    id: 'recognition_hits',
    text: 'Reconnaissance - Nombre de bonnes reponses (Hits)',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'false_positives',
    text: 'Reconnaissance - Nombre de faux positifs',
    type: 'number',
    required: true,
    min: 0,
    max: 28
  },
  {
    id: 'discriminability',
    text: 'Discriminabilite (d\')',
    type: 'number',
    required: false,
    help: 'Indice de discriminabilite'
  },

  // Additional Metrics
  {
    id: 'section_additional',
    text: 'Mesures Additionnelles',
    type: 'section',
    required: false
  },
  {
    id: 'semantic_clustering',
    text: 'Clustering Semantique',
    type: 'number',
    required: false
  },
  {
    id: 'serial_clustering',
    text: 'Clustering Serial',
    type: 'number',
    required: false
  },
  {
    id: 'primacy',
    text: 'Region de Primaute',
    type: 'number',
    required: false
  },
  {
    id: 'recency',
    text: 'Region de Recence',
    type: 'number',
    required: false
  },
  {
    id: 'response_bias',
    text: 'Biais de Reponse',
    type: 'number',
    required: false
  },
  {
    id: 'intrusions',
    text: 'Total des Intrusions',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'perseverations',
    text: 'Total des Perseverations',
    type: 'number',
    required: false,
    min: 0
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export interface QuestionnaireDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  instructions?: string;
  questions: Question[];
  metadata?: {
    singleColumn?: boolean;
    pathologies?: string[];
    target_role?: 'patient' | 'healthcare_professional';
    [key: string]: any;
  };
}

export const CVLT_DEFINITION: QuestionnaireDefinition = {
  id: 'cvlt',
  code: 'CVLT',
  title: 'CVLT (California Verbal Learning Test)',
  description: 'Test d\'apprentissage verbal de Californie - Evaluation de la memoire verbale episodique.',
  questions: CVLT_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
