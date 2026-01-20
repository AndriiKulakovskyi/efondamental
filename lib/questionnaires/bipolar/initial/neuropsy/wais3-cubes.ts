// eFondaMental Platform - WAIS-III Cubes (Block Design)
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarWais3CubesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Items 1-14
  item1_score: number | null;
  item1_time: number | null;
  item2_score: number | null;
  item2_time: number | null;
  item3_score: number | null;
  item3_time: number | null;
  item4_score: number | null;
  item4_time: number | null;
  item5_score: number | null;
  item5_time: number | null;
  item6_score: number | null;
  item6_time: number | null;
  item7_score: number | null;
  item7_time: number | null;
  item8_score: number | null;
  item8_time: number | null;
  item9_score: number | null;
  item9_time: number | null;
  item10_score: number | null;
  item10_time: number | null;
  item11_score: number | null;
  item11_time: number | null;
  item12_score: number | null;
  item12_time: number | null;
  item13_score: number | null;
  item13_time: number | null;
  item14_score: number | null;
  item14_time: number | null;
  // Scores
  raw_score: number | null;
  raw_score_no_time_bonus: number | null;
  scaled_score: number | null;
  percentile: number | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarWais3CubesResponseInsert = Omit<
  BipolarWais3CubesResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'raw_score' | 'raw_score_no_time_bonus' | 'scaled_score' | 'percentile'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

function createBlockDesignItem(num: number, maxTime: number): Question[] {
  return [
    {
      id: `item${num}_score`,
      text: `Item ${num} - Score`,
      type: 'single_choice',
      required: num <= 5 ? true : false,
      options: num <= 5 
        ? [
            { code: 0, label: '0 - Echec (2 essais)', score: 0 },
            { code: 1, label: '1 - Reussi (2eme essai)', score: 1 },
            { code: 2, label: '2 - Reussi (1er essai)', score: 2 }
          ]
        : [
            { code: 0, label: '0 - Echec', score: 0 },
            { code: 4, label: '4 - Reussi', score: 4 },
            { code: 5, label: '5 - Reussi + bonus temps', score: 5 },
            { code: 6, label: '6 - Reussi + bonus temps max', score: 6 },
            { code: 7, label: '7 - Reussi + bonus temps max', score: 7 }
          ]
    },
    {
      id: `item${num}_time`,
      text: `Item ${num} - Temps (secondes)`,
      type: 'number',
      required: false,
      min: 0,
      max: maxTime
    }
  ];
}

export const WAIS3_CUBES_QUESTIONS: Question[] = [
  {
    id: 'section_instructions',
    text: 'WAIS-III Cubes',
    help: 'Le sujet doit reproduire des figures geometriques avec des cubes colores.',
    type: 'section',
    required: false
  },
  ...createBlockDesignItem(1, 60),
  ...createBlockDesignItem(2, 60),
  ...createBlockDesignItem(3, 60),
  ...createBlockDesignItem(4, 60),
  ...createBlockDesignItem(5, 60),
  ...createBlockDesignItem(6, 60),
  ...createBlockDesignItem(7, 60),
  ...createBlockDesignItem(8, 60),
  ...createBlockDesignItem(9, 120),
  ...createBlockDesignItem(10, 120),
  ...createBlockDesignItem(11, 120),
  ...createBlockDesignItem(12, 120),
  ...createBlockDesignItem(13, 120),
  ...createBlockDesignItem(14, 120)
];

// ============================================================================
// Scoring
// ============================================================================

export function computeWais3CubesRawScore(responses: Record<string, number>): number {
  let total = 0;
  for (let i = 1; i <= 14; i++) {
    total += responses[`item${i}_score`] || 0;
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

export const WAIS3_CUBES_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_cubes',
  code: 'WAIS3_CUBES',
  title: 'WAIS-III Cubes',
  description: 'Sous-test Cubes de la WAIS-III - Evaluation des capacites visuo-constructives et du raisonnement perceptif.',
  questions: WAIS3_CUBES_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
