// eFondaMental Platform - ISA (Intentionnalité Suicidaire Actuelle) - Schizophrenia
// Assessment of current suicidal ideation

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaIsaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
  q5?: number | null;
  q6?: number | null;
  q7?: number | null;
  q8?: number | null;
  q9?: number | null;
  q10?: number | null;
  total_score?: number | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaIsaResponseInsert = Omit<
  SchizophreniaIsaResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Questions
// ============================================================================

export const ISA_SZ_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: '1. Avez-vous déjà eu l\'impression que la vie ne vaut pas la peine d\'être vécue ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q2',
    text: 'Quand cela est-il arrivé pour la dernière fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q1' }, 1]
    },
    options: [
      { code: 1, label: 'La semaine dernière', score: 1 },
      { code: 2, label: 'Il y a entre deux semaines et douze mois', score: 2 },
      { code: 3, label: 'Il y a plus d\'un an', score: 3 }
    ]
  },
  {
    id: 'q3',
    text: '2. Avez-vous déjà souhaité mourir, par exemple, de vous coucher et de ne pas vous réveiller ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q4',
    text: 'Quand cela est-il arrivé pour la dernière fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q3' }, 1]
    },
    options: [
      { code: 1, label: 'La semaine dernière', score: 1 },
      { code: 2, label: 'Il y a entre deux semaines et douze mois', score: 2 },
      { code: 3, label: 'Il y a plus d\'un an', score: 3 }
    ]
  },
  {
    id: 'q5',
    text: '3. Avez-vous déjà pensé à vous donner la mort, même si vous ne le feriez jamais ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q6',
    text: 'Quand cela est-il arrivé pour la dernière fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q5' }, 1]
    },
    options: [
      { code: 1, label: 'La semaine dernière', score: 1 },
      { code: 2, label: 'Il y a entre deux semaines et douze mois', score: 2 },
      { code: 3, label: 'Il y a plus d\'un an', score: 3 }
    ]
  },
  {
    id: 'q7',
    text: '4. Avez-vous déjà sérieusement envisagé de vous donner la mort ou planifié la façon de vous y prendre ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q8',
    text: 'Quand cela est-il arrivé pour la dernière fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q7' }, 1]
    },
    options: [
      { code: 1, label: 'La semaine dernière', score: 1 },
      { code: 2, label: 'Il y a entre deux semaines et douze mois', score: 2 },
      { code: 3, label: 'Il y a plus d\'un an', score: 3 }
    ]
  },
  {
    id: 'q9',
    text: '5. Avez-vous déjà essayé de vous donner la mort ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q10',
    text: 'Quand cela est-il arrivé pour la dernière fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q9' }, 1]
    },
    options: [
      { code: 1, label: 'La semaine dernière', score: 1 },
      { code: 2, label: 'Il y a entre deux semaines et douze mois', score: 2 },
      { code: 3, label: 'Il y a plus d\'un an', score: 3 }
    ]
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

export const ISA_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'isa_sz',
  code: 'ISA_SZ',
  title: 'Intentionnalité Suicidaire Actuelle',
  description: 'Cette échelle doit toujours être administrée, même en cas d\'absence de tentative de suicide avérée.\n\nÉchelle évaluant les pensées, désirs et tentatives de suicide, ainsi que leur temporalité récente ou passée.',
  questions: ISA_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional'
  }
};
