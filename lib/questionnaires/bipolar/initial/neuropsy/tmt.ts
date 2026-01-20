// eFondaMental Platform - TMT (Trail Making Test)
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarTmtResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Part A
  part_a_time_seconds: number | null;
  part_a_errors: number | null;
  part_a_completed: string | null;
  // Part B
  part_b_time_seconds: number | null;
  part_b_errors: number | null;
  part_b_completed: string | null;
  // Derived scores
  b_minus_a: number | null;
  b_divided_by_a: number | null;
  // Standardized scores
  part_a_z_score: number | null;
  part_a_percentile: number | null;
  part_b_z_score: number | null;
  part_b_percentile: number | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarTmtResponseInsert = Omit<
  BipolarTmtResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'part_a_z_score' | 'part_a_percentile' | 'part_b_z_score' | 'part_b_percentile' | 'b_minus_a' | 'b_divided_by_a'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const TMT_QUESTIONS: Question[] = [
  // Part A
  {
    id: 'section_part_a',
    text: 'Partie A (Chiffres)',
    help: 'Le sujet doit relier les chiffres de 1 a 25 dans l\'ordre croissant.',
    type: 'section',
    required: false
  },
  {
    id: 'part_a_completed',
    text: 'La partie A a-t-elle ete completee?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non (abandon ou depassement du temps limite)' }
    ]
  },
  {
    id: 'part_a_time_seconds',
    text: 'Partie A - Temps de completion (en secondes)',
    type: 'number',
    required: true,
    min: 0,
    max: 300,
    display_if: { '==': [{ var: 'part_a_completed' }, 'oui'] }
  },
  {
    id: 'part_a_errors',
    text: 'Partie A - Nombre d\'erreurs',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'part_a_completed' }, 'oui'] }
  },

  // Part B
  {
    id: 'section_part_b',
    text: 'Partie B (Chiffres et Lettres)',
    help: 'Le sujet doit alterner entre chiffres et lettres (1-A-2-B-3-C...).',
    type: 'section',
    required: false
  },
  {
    id: 'part_b_completed',
    text: 'La partie B a-t-elle ete completee?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non (abandon ou depassement du temps limite)' }
    ]
  },
  {
    id: 'part_b_time_seconds',
    text: 'Partie B - Temps de completion (en secondes)',
    type: 'number',
    required: true,
    min: 0,
    max: 600,
    display_if: { '==': [{ var: 'part_b_completed' }, 'oui'] }
  },
  {
    id: 'part_b_errors',
    text: 'Partie B - Nombre d\'erreurs',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'part_b_completed' }, 'oui'] }
  }
];

// ============================================================================
// Scoring
// ============================================================================

export function computeTmtDerivedScores(partA: number, partB: number): { bMinusA: number; bDividedByA: number } {
  return {
    bMinusA: partB - partA,
    bDividedByA: partA > 0 ? partB / partA : 0
  };
}

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

export const TMT_DEFINITION: QuestionnaireDefinition = {
  id: 'tmt',
  code: 'TMT',
  title: 'TMT (Trail Making Test)',
  description: 'Test de tracage de piste - Evaluation de la vitesse de traitement et de la flexibilite cognitive.',
  questions: TMT_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
