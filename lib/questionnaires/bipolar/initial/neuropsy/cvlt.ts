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
  // Trial scores
  trial1: number | null;
  trial2: number | null;
  trial3: number | null;
  trial4: number | null;
  trial5: number | null;
  trials_1_5_total: number | null;
  // List B
  list_b_total: number | null;
  // Short delay
  short_delay_free: number | null;
  short_delay_cued: number | null;
  // Long delay
  long_delay_free: number | null;
  long_delay_cued: number | null;
  // Recognition
  recognition_hits: number | null;
  recognition_false_positives: number | null;
  recognition_discriminability: number | null;
  // Additional metrics
  semantic_clustering: number | null;
  serial_clustering: number | null;
  learning_slope: number | null;
  intrusions_total: number | null;
  perseverations_total: number | null;
  // Calculated scores
  z_score_trials_1_5: number | null;
  z_score_long_delay_free: number | null;
  z_score_recognition: number | null;
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
    id: 'trial1',
    text: 'Essai 1 - Nombre de mots rappeles',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'trial2',
    text: 'Essai 2 - Nombre de mots rappeles',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'trial3',
    text: 'Essai 3 - Nombre de mots rappeles',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'trial4',
    text: 'Essai 4 - Nombre de mots rappeles',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'trial5',
    text: 'Essai 5 - Nombre de mots rappeles',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'trials_1_5_total',
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
    id: 'list_b_total',
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
    id: 'short_delay_free',
    text: 'Rappel Libre Court Differe',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'short_delay_cued',
    text: 'Rappel Indice Court Differe',
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
    id: 'long_delay_free',
    text: 'Rappel Libre Long Differe',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'long_delay_cued',
    text: 'Rappel Indice Long Differe',
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
    id: 'recognition_false_positives',
    text: 'Reconnaissance - Nombre de faux positifs',
    type: 'number',
    required: true,
    min: 0,
    max: 28
  },
  {
    id: 'recognition_discriminability',
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
    id: 'learning_slope',
    text: 'Pente d\'Apprentissage',
    type: 'number',
    required: false
  },
  {
    id: 'intrusions_total',
    text: 'Total des Intrusions',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'perseverations_total',
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
