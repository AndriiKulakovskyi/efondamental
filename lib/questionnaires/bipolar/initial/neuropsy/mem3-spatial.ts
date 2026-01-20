// eFondaMental Platform - MEM3 Spatial (WMS-III Spatial Span)
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarMem3SpatialResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Forward span
  forward_trial1_1: number | null;
  forward_trial1_2: number | null;
  forward_trial2_1: number | null;
  forward_trial2_2: number | null;
  forward_trial3_1: number | null;
  forward_trial3_2: number | null;
  forward_trial4_1: number | null;
  forward_trial4_2: number | null;
  forward_trial5_1: number | null;
  forward_trial5_2: number | null;
  forward_trial6_1: number | null;
  forward_trial6_2: number | null;
  forward_trial7_1: number | null;
  forward_trial7_2: number | null;
  forward_trial8_1: number | null;
  forward_trial8_2: number | null;
  forward_raw_score: number | null;
  forward_span: number | null;
  // Backward span
  backward_trial1_1: number | null;
  backward_trial1_2: number | null;
  backward_trial2_1: number | null;
  backward_trial2_2: number | null;
  backward_trial3_1: number | null;
  backward_trial3_2: number | null;
  backward_trial4_1: number | null;
  backward_trial4_2: number | null;
  backward_trial5_1: number | null;
  backward_trial5_2: number | null;
  backward_trial6_1: number | null;
  backward_trial6_2: number | null;
  backward_trial7_1: number | null;
  backward_trial7_2: number | null;
  backward_raw_score: number | null;
  backward_span: number | null;
  // Total scores
  total_raw_score: number | null;
  scaled_score: number | null;
  percentile: number | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarMem3SpatialResponseInsert = Omit<
  BipolarMem3SpatialResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'scaled_score' | 'percentile'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const MEM3_SPATIAL_QUESTIONS: Question[] = [
  // Forward Span
  {
    id: 'section_forward',
    text: 'Empan Spatial Endroit',
    type: 'section',
    required: false
  },
  {
    id: 'forward_trial1_1',
    text: 'Niveau 1 - Essai 1 (2 blocs)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'forward_trial1_2',
    text: 'Niveau 1 - Essai 2 (2 blocs)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'forward_trial2_1',
    text: 'Niveau 2 - Essai 1 (3 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'forward_trial2_2',
    text: 'Niveau 2 - Essai 2 (3 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'forward_trial3_1',
    text: 'Niveau 3 - Essai 1 (4 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'forward_trial3_2',
    text: 'Niveau 3 - Essai 2 (4 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'forward_trial4_1',
    text: 'Niveau 4 - Essai 1 (5 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'forward_trial4_2',
    text: 'Niveau 4 - Essai 2 (5 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'forward_trial5_1',
    text: 'Niveau 5 - Essai 1 (6 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'forward_trial5_2',
    text: 'Niveau 5 - Essai 2 (6 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'forward_trial6_1',
    text: 'Niveau 6 - Essai 1 (7 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'forward_trial6_2',
    text: 'Niveau 6 - Essai 2 (7 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'forward_trial7_1',
    text: 'Niveau 7 - Essai 1 (8 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'forward_trial7_2',
    text: 'Niveau 7 - Essai 2 (8 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'forward_trial8_1',
    text: 'Niveau 8 - Essai 1 (9 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'forward_trial8_2',
    text: 'Niveau 8 - Essai 2 (9 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'forward_raw_score',
    text: 'Score Brut Endroit',
    type: 'number',
    required: false,
    min: 0,
    max: 16
  },
  {
    id: 'forward_span',
    text: 'Empan Endroit',
    type: 'number',
    required: false,
    min: 0,
    max: 9
  },

  // Backward Span
  {
    id: 'section_backward',
    text: 'Empan Spatial Envers',
    type: 'section',
    required: false
  },
  {
    id: 'backward_trial1_1',
    text: 'Niveau 1 - Essai 1 (2 blocs)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'backward_trial1_2',
    text: 'Niveau 1 - Essai 2 (2 blocs)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'backward_trial2_1',
    text: 'Niveau 2 - Essai 1 (3 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'backward_trial2_2',
    text: 'Niveau 2 - Essai 2 (3 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'backward_trial3_1',
    text: 'Niveau 3 - Essai 1 (4 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'backward_trial3_2',
    text: 'Niveau 3 - Essai 2 (4 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'backward_trial4_1',
    text: 'Niveau 4 - Essai 1 (5 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'backward_trial4_2',
    text: 'Niveau 4 - Essai 2 (5 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'backward_trial5_1',
    text: 'Niveau 5 - Essai 1 (6 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'backward_trial5_2',
    text: 'Niveau 5 - Essai 2 (6 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'backward_trial6_1',
    text: 'Niveau 6 - Essai 1 (7 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'backward_trial6_2',
    text: 'Niveau 6 - Essai 2 (7 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'backward_trial7_1',
    text: 'Niveau 7 - Essai 1 (8 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'backward_trial7_2',
    text: 'Niveau 7 - Essai 2 (8 blocs)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Echec', score: 0 },
      { code: 1, label: '1 - Reussi', score: 1 }
    ]
  },
  {
    id: 'backward_raw_score',
    text: 'Score Brut Envers',
    type: 'number',
    required: false,
    min: 0,
    max: 14
  },
  {
    id: 'backward_span',
    text: 'Empan Envers',
    type: 'number',
    required: false,
    min: 0,
    max: 8
  },

  // Total Scores
  {
    id: 'section_total',
    text: 'Scores Totaux',
    type: 'section',
    required: false
  },
  {
    id: 'total_raw_score',
    text: 'Score Brut Total',
    type: 'number',
    required: false,
    min: 0,
    max: 30
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

export const MEM3_SPATIAL_DEFINITION: QuestionnaireDefinition = {
  id: 'mem3_spatial',
  code: 'MEM3_SPATIAL',
  title: 'MEM-III Empan Spatial (Blocs de Corsi)',
  description: 'Evaluation de la memoire de travail visuo-spatiale a l\'aide du test des blocs de Corsi.',
  questions: MEM3_SPATIAL_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
