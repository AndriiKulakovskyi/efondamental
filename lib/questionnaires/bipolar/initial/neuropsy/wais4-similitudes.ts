// eFondaMental Platform - WAIS-IV Similitudes (Similarities)
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarWais4SimilitudesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Items 1-18 (each scored 0, 1, or 2)
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

export type BipolarWais4SimilitudesResponseInsert = Omit<
  BipolarWais4SimilitudesResponse,
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

export const WAIS4_SIMILITUDES_QUESTIONS: Question[] = [
  {
    id: 'section_instructions',
    text: 'WAIS-IV Similitudes',
    help: 'Pour chaque paire de mots, demander: "En quoi [mot1] et [mot2] sont-ils semblables?"',
    type: 'section',
    required: false
  },
  {
    id: 'item1',
    text: 'Item 1: Orange - Banane',
    type: 'single_choice',
    required: true,
    options: ITEM_OPTIONS
  },
  {
    id: 'item2',
    text: 'Item 2: Chien - Lion',
    type: 'single_choice',
    required: true,
    options: ITEM_OPTIONS
  },
  {
    id: 'item3',
    text: 'Item 3: Chemise - Chaussure',
    type: 'single_choice',
    required: false,
    options: ITEM_OPTIONS
  },
  {
    id: 'item4',
    text: 'Item 4: Table - Chaise',
    type: 'single_choice',
    required: false,
    options: ITEM_OPTIONS
  },
  {
    id: 'item5',
    text: 'Item 5: Train - Avion',
    type: 'single_choice',
    required: false,
    options: ITEM_OPTIONS
  },
  {
    id: 'item6',
    text: 'Item 6: Poeme - Statue',
    type: 'single_choice',
    required: false,
    options: ITEM_OPTIONS
  },
  {
    id: 'item7',
    text: 'Item 7: Colere - Joie',
    type: 'single_choice',
    required: false,
    options: ITEM_OPTIONS
  },
  {
    id: 'item8',
    text: 'Item 8: Recompense - Punition',
    type: 'single_choice',
    required: false,
    options: ITEM_OPTIONS
  },
  {
    id: 'item9',
    text: 'Item 9: Hiver - Ete',
    type: 'single_choice',
    required: false,
    options: ITEM_OPTIONS
  },
  {
    id: 'item10',
    text: 'Item 10: Travail - Jeu',
    type: 'single_choice',
    required: false,
    options: ITEM_OPTIONS
  },
  {
    id: 'item11',
    text: 'Item 11: Ennemi - Ami',
    type: 'single_choice',
    required: false,
    options: ITEM_OPTIONS
  },
  {
    id: 'item12',
    text: 'Item 12: Premier - Dernier',
    type: 'single_choice',
    required: false,
    options: ITEM_OPTIONS
  },
  {
    id: 'item13',
    text: 'Item 13: Confiance - Peur',
    type: 'single_choice',
    required: false,
    options: ITEM_OPTIONS
  },
  {
    id: 'item14',
    text: 'Item 14: Evolution - Revolution',
    type: 'single_choice',
    required: false,
    options: ITEM_OPTIONS
  },
  {
    id: 'item15',
    text: 'Item 15: Hibernation - Migration',
    type: 'single_choice',
    required: false,
    options: ITEM_OPTIONS
  },
  {
    id: 'item16',
    text: 'Item 16: Taxe - Impot',
    type: 'single_choice',
    required: false,
    options: ITEM_OPTIONS
  },
  {
    id: 'item17',
    text: 'Item 17: Pardon - Vengeance',
    type: 'single_choice',
    required: false,
    options: ITEM_OPTIONS
  },
  {
    id: 'item18',
    text: 'Item 18: Concret - Abstrait',
    type: 'single_choice',
    required: false,
    options: ITEM_OPTIONS
  }
];

// ============================================================================
// Scoring
// ============================================================================

export function computeWais4SimilitudesRawScore(responses: Record<string, number>): number {
  let total = 0;
  for (let i = 1; i <= 18; i++) {
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

export const WAIS4_SIMILITUDES_DEFINITION: QuestionnaireDefinition = {
  id: 'wais4_similitudes',
  code: 'WAIS4_SIMILITUDES',
  title: 'WAIS-IV Similitudes',
  description: 'Sous-test Similitudes de la WAIS-IV - Evaluation du raisonnement verbal et de la formation de concepts.',
  questions: WAIS4_SIMILITUDES_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
