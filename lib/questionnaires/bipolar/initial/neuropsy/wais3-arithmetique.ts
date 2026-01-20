// eFondaMental Platform - WAIS-III Arithmetique (Arithmetic)
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarWais3ArithmetiqueResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Items 1-20 (each scored 0 or 1, some with time bonus)
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
  // Time for items with bonus
  item15_time: number | null;
  item16_time: number | null;
  item17_time: number | null;
  item18_time: number | null;
  item19_time: number | null;
  item20_time: number | null;
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

export type BipolarWais3ArithmetiqueResponseInsert = Omit<
  BipolarWais3ArithmetiqueResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'raw_score' | 'scaled_score' | 'percentile'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

function createArithmeticItem(num: number, hasTimeBonus: boolean): Question[] {
  const questions: Question[] = [
    {
      id: `item${num}`,
      text: `Item ${num}`,
      type: 'single_choice',
      required: num <= 5 ? true : false,
      options: hasTimeBonus 
        ? [
            { code: 0, label: '0 - Incorrect', score: 0 },
            { code: 1, label: '1 - Correct', score: 1 },
            { code: 2, label: '2 - Correct + bonus temps', score: 2 }
          ]
        : [
            { code: 0, label: '0 - Incorrect', score: 0 },
            { code: 1, label: '1 - Correct', score: 1 }
          ]
    }
  ];
  
  if (hasTimeBonus) {
    questions.push({
      id: `item${num}_time`,
      text: `Item ${num} - Temps (secondes)`,
      type: 'number',
      required: false,
      min: 0,
      max: 120
    });
  }
  
  return questions;
}

export const WAIS3_ARITHMETIQUE_QUESTIONS: Question[] = [
  {
    id: 'section_instructions',
    text: 'WAIS-III Arithmetique',
    help: 'Le sujet doit resoudre des problemes arithmetiques mentalement.',
    type: 'section',
    required: false
  },
  // Items 1-14: no time bonus
  ...createArithmeticItem(1, false),
  ...createArithmeticItem(2, false),
  ...createArithmeticItem(3, false),
  ...createArithmeticItem(4, false),
  ...createArithmeticItem(5, false),
  ...createArithmeticItem(6, false),
  ...createArithmeticItem(7, false),
  ...createArithmeticItem(8, false),
  ...createArithmeticItem(9, false),
  ...createArithmeticItem(10, false),
  ...createArithmeticItem(11, false),
  ...createArithmeticItem(12, false),
  ...createArithmeticItem(13, false),
  ...createArithmeticItem(14, false),
  // Items 15-20: with time bonus
  ...createArithmeticItem(15, true),
  ...createArithmeticItem(16, true),
  ...createArithmeticItem(17, true),
  ...createArithmeticItem(18, true),
  ...createArithmeticItem(19, true),
  ...createArithmeticItem(20, true)
];

// ============================================================================
// Scoring
// ============================================================================

export function computeWais3ArithmetiqueRawScore(responses: Record<string, number>): number {
  let total = 0;
  for (let i = 1; i <= 20; i++) {
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

export const WAIS3_ARITHMETIQUE_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_arithmetique',
  code: 'WAIS3_ARITHMETIQUE',
  title: 'WAIS-III Arithmetique',
  description: 'Sous-test Arithmetique de la WAIS-III - Evaluation de la memoire de travail et du raisonnement numerique.',
  questions: WAIS3_ARITHMETIQUE_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
