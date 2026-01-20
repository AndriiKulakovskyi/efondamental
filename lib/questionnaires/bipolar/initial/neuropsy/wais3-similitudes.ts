// eFondaMental Platform - WAIS-III Similitudes (Similarities)
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarWais3SimilitudesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Items 1-19 (each scored 0, 1, or 2)
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

export type BipolarWais3SimilitudesResponseInsert = Omit<
  BipolarWais3SimilitudesResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'raw_score' | 'scaled_score' | 'percentile'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

const ITEM_OPTIONS = [
  { code: 0, label: '0 - Reponse incorrecte ou concrete', score: 0 },
  { code: 1, label: '1 - Reponse partiellement correcte', score: 1 },
  { code: 2, label: '2 - Reponse abstraite correcte', score: 2 }
];

function createSimilitudesItem(num: number): Question {
  return {
    id: `item${num}`,
    text: `Item ${num}`,
    type: 'single_choice',
    required: num <= 4 ? true : false,
    options: ITEM_OPTIONS
  };
}

export const WAIS3_SIMILITUDES_QUESTIONS: Question[] = [
  {
    id: 'section_instructions',
    text: 'WAIS-III Similitudes',
    help: 'Pour chaque paire de mots, demander: "En quoi [mot1] et [mot2] sont-ils semblables?"',
    type: 'section',
    required: false
  },
  ...Array.from({ length: 19 }, (_, i) => createSimilitudesItem(i + 1))
];

// ============================================================================
// Scoring
// ============================================================================

export function computeWais3SimilitudesRawScore(responses: Record<string, number>): number {
  let total = 0;
  for (let i = 1; i <= 19; i++) {
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

export const WAIS3_SIMILITUDES_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_similitudes',
  code: 'WAIS3_SIMILITUDES',
  title: 'WAIS-III Similitudes',
  description: 'Sous-test Similitudes de la WAIS-III - Evaluation du raisonnement verbal et de la formation de concepts.',
  questions: WAIS3_SIMILITUDES_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
