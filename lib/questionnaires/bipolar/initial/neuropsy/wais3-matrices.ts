// eFondaMental Platform - WAIS-III Matrices
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarWais3MatricesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Items 1-26 (each scored 0 or 1)
  item1: number | null;
  item2: number | null;
  item3: number | null;
  item4: number | null;
  item5: number | null;
  item6: number | null;
  item7: number | null;
  item8: number | null;
  item9: number | null;
  item10: number | null;
  item11: number | null;
  item12: number | null;
  item13: number | null;
  item14: number | null;
  item15: number | null;
  item16: number | null;
  item17: number | null;
  item18: number | null;
  item19: number | null;
  item20: number | null;
  item21: number | null;
  item22: number | null;
  item23: number | null;
  item24: number | null;
  item25: number | null;
  item26: number | null;
  // Scores
  raw_score: number | null;
  scaled_score: number | null;
  percentile: number | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarWais3MatricesResponseInsert = Omit<
  BipolarWais3MatricesResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'raw_score' | 'scaled_score' | 'percentile'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

const ITEM_OPTIONS = [
  { code: 0, label: '0 - Incorrect', score: 0 },
  { code: 1, label: '1 - Correct', score: 1 }
];

function createMatrixItem(num: number): Question {
  return {
    id: `item${num}`,
    text: `Item ${num}`,
    type: 'single_choice',
    required: num <= 4 ? true : false,
    options: ITEM_OPTIONS
  };
}

export const WAIS3_MATRICES_QUESTIONS: Question[] = [
  {
    id: 'section_instructions',
    text: 'WAIS-III Matrices',
    help: 'Presenter chaque matrice et demander au sujet de choisir la reponse qui complete la matrice.',
    type: 'section',
    required: false
  },
  ...Array.from({ length: 26 }, (_, i) => createMatrixItem(i + 1))
];

// ============================================================================
// Scoring
// ============================================================================

export function computeWais3MatricesRawScore(responses: Record<string, number>): number {
  let total = 0;
  for (let i = 1; i <= 26; i++) {
    total += responses[`item${i}`] || 0;
  }
  return total;
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

export const WAIS3_MATRICES_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_matrices',
  code: 'WAIS3_MATRICES',
  title: 'WAIS-III Matrices',
  description: 'Sous-test Matrices de la WAIS-III - Evaluation du raisonnement perceptif et de l\'intelligence fluide.',
  questions: WAIS3_MATRICES_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
