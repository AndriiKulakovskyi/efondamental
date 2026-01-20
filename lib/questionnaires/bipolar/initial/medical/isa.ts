// eFondaMental Platform - ISA (Ideation Scale for Adults)
// Bipolar Initial Evaluation - Medical Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarIsaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  q5: number | null;
  q6: number | null;
  q7: number | null;
  q8: number | null;
  q9: number | null;
  q10: number | null;
  total_score: number | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarIsaResponseInsert = Omit<
  BipolarIsaResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const ISA_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: '1. Desir de vivre',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Modere a fort', score: 0 },
      { code: 1, label: '1 - Faible', score: 1 },
      { code: 2, label: '2 - Aucun', score: 2 }
    ]
  },
  {
    id: 'q2',
    text: '2. Desir de mourir',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Aucun', score: 0 },
      { code: 1, label: '1 - Faible', score: 1 },
      { code: 2, label: '2 - Modere a fort', score: 2 }
    ]
  },
  {
    id: 'q3',
    text: '3. Raisons de vivre/mourir',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Les raisons de vivre l\'emportent sur les raisons de mourir', score: 0 },
      { code: 1, label: '1 - Equilibrees', score: 1 },
      { code: 2, label: '2 - Les raisons de mourir l\'emportent sur les raisons de vivre', score: 2 }
    ]
  },
  {
    id: 'q4',
    text: '4. Desir de faire une tentative de suicide active',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Aucun', score: 0 },
      { code: 1, label: '1 - Faible', score: 1 },
      { code: 2, label: '2 - Modere a fort', score: 2 }
    ]
  },
  {
    id: 'q5',
    text: '5. Tentative de suicide passive',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Prendrait des precautions pour sauver sa vie', score: 0 },
      { code: 1, label: '1 - Laisserait la vie/mort au hasard', score: 1 },
      { code: 2, label: '2 - Eviterait les mesures necessaires pour sauver sa vie ou la conserver', score: 2 }
    ]
  },
  {
    id: 'q6',
    text: '6. Dimension temporelle (duree)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Breve, periodes passageres', score: 0 },
      { code: 1, label: '1 - Periodes plus longues', score: 1 },
      { code: 2, label: '2 - Continue (chronique) ou presque continue', score: 2 }
    ]
  },
  {
    id: 'q7',
    text: '7. Dimension temporelle (frequence)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Rare, occasionnelle', score: 0 },
      { code: 1, label: '1 - Intermittente', score: 1 },
      { code: 2, label: '2 - Persistante ou continue', score: 2 }
    ]
  },
  {
    id: 'q8',
    text: '8. Attitude envers l\'ideation/le desir',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Rejet', score: 0 },
      { code: 1, label: '1 - Ambivalent, indifferent', score: 1 },
      { code: 2, label: '2 - Acceptation', score: 2 }
    ]
  },
  {
    id: 'q9',
    text: '9. Controle sur l\'action suicidaire/le passage a l\'acte',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - A le sens de la maitrise', score: 0 },
      { code: 1, label: '1 - N\'est pas sur de la maitrise', score: 1 },
      { code: 2, label: '2 - N\'a pas le sens de la maitrise', score: 2 }
    ]
  },
  {
    id: 'q10',
    text: '10. Elements dissuasifs au passage a l\'acte',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Des elements dissuasifs empecheraient une TS', score: 0 },
      { code: 1, label: '1 - Certaines preoccupations vis-a-vis de ces elements dissuasifs', score: 1 },
      { code: 2, label: '2 - Les elements dissuasifs n\'empecheraient pas une TS', score: 2 }
    ]
  }
];

// ============================================================================
// Scoring
// ============================================================================

export function computeIsaScore(responses: Record<string, number>): number {
  let total = 0;
  for (let i = 1; i <= 10; i++) {
    const value = responses[`q${i}`];
    if (typeof value === 'number') {
      total += value;
    }
  }
  return total;
}

export function interpretIsaScore(score: number): string {
  if (score <= 5) return 'Risque faible';
  if (score <= 10) return 'Risque modere';
  return 'Risque eleve';
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

export const ISA_DEFINITION: QuestionnaireDefinition = {
  id: 'isa',
  code: 'ISA',
  title: 'ISA (Ideation Scale for Adults)',
  description: 'Echelle d\'evaluation de l\'ideation suicidaire chez l\'adulte.',
  questions: ISA_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
