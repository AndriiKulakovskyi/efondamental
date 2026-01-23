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
  // Demographics
  patient_age: number;
  // Items 1-26 (each scored 0 or 1, with zero-padded IDs)
  item_01: number | null;
  item_02: number | null;
  item_03: number | null;
  item_04: number | null;
  item_05: number | null;
  item_06: number | null;
  item_07: number | null;
  item_08: number | null;
  item_09: number | null;
  item_10: number | null;
  item_11: number | null;
  item_12: number | null;
  item_13: number | null;
  item_14: number | null;
  item_15: number | null;
  item_16: number | null;
  item_17: number | null;
  item_18: number | null;
  item_19: number | null;
  item_20: number | null;
  item_21: number | null;
  item_22: number | null;
  item_23: number | null;
  item_24: number | null;
  item_25: number | null;
  item_26: number | null;
  // Scores (match database schema)
  total_raw_score: number | null;
  standard_score: number | null;
  standardized_value: number | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarWais3MatricesResponseInsert = Omit<
  BipolarWais3MatricesResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_raw_score' | 'standard_score' | 'standardized_value'
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
    id: `item_${String(num).padStart(2, '0')}`,
    text: `Item ${num}`,
    type: 'single_choice',
    required: num <= 4 ? true : false,
    options: ITEM_OPTIONS
  };
}

export const WAIS3_MATRICES_QUESTIONS: Question[] = [
  // Patient demographics section
  {
    id: 'patient_age',
    text: 'Âge du patient (calculé automatiquement)',
    type: 'number',
    required: true,
    readonly: true,
    section: 'Données démographiques',
    min: 16,
    max: 90,
    help: 'Calculé automatiquement à partir de la date de naissance et de la date de visite'
  },
  // Items section
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
    total += responses[`item_${String(i).padStart(2, '0')}`] || 0;
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
