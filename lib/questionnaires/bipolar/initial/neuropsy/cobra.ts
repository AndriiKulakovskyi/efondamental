// eFondaMental Platform - COBRA (Cognitive Complaints in Bipolar Disorder Rating Assessment)
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarCobraResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Questions
  q1: number | null;  // Difficulty concentrating
  q2: number | null;  // Losing train of thought
  q3: number | null;  // Difficulty finding words
  q4: number | null;  // Difficulty remembering names
  q5: number | null;  // Difficulty remembering what was read
  q6: number | null;  // Difficulty remembering what was told
  q7: number | null;  // Difficulty following conversation
  q8: number | null;  // Difficulty with planning
  q9: number | null;  // Difficulty doing two things at once
  q10: number | null; // Difficulty remembering appointments
  q11: number | null; // Difficulty remembering to take medication
  q12: number | null; // Difficulty doing mental arithmetic
  q13: number | null; // Feeling mentally slow
  q14: number | null; // Difficulty starting tasks
  q15: number | null; // Difficulty finishing tasks
  q16: number | null; // Problems with short-term memory
  // Total score
  total_score: number | null;
  // Metadata
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarCobraResponseInsert = Omit<
  BipolarCobraResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score'
>;

// ============================================================================
// Questions Dictionary
// ============================================================================

const COBRA_OPTIONS = [
  { code: 0, label: '0 - Jamais', score: 0 },
  { code: 1, label: '1 - Parfois', score: 1 },
  { code: 2, label: '2 - Souvent', score: 2 },
  { code: 3, label: '3 - Toujours', score: 3 }
];

export const COBRA_QUESTIONS: Question[] = [
  {
    id: 'cobra_instructions',
    text: 'Au cours des deux dernieres semaines, avez-vous eu des difficultes dans les domaines suivants?',
    type: 'section',
    required: false
  },
  {
    id: 'q1',
    text: '1. Vous concentrer sur ce que vous faites',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q2',
    text: '2. Perdre le fil de vos pensees',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q3',
    text: '3. Trouver le mot exact que vous vouliez utiliser',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q4',
    text: '4. Vous rappeler le nom de personnes',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q5',
    text: '5. Vous souvenir de ce que vous avez lu',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q6',
    text: '6. Vous souvenir de ce qu\'on vous a dit',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q7',
    text: '7. Suivre une conversation',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q8',
    text: '8. Planifier et organiser vos activites',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q9',
    text: '9. Faire deux choses en meme temps',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q10',
    text: '10. Vous souvenir de vos rendez-vous',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q11',
    text: '11. Vous rappeler de prendre vos medicaments',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q12',
    text: '12. Faire des calculs mentaux',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q13',
    text: '13. Vous sentir mentalement lent',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q14',
    text: '14. Demarrer une tache',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q15',
    text: '15. Terminer une tache',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q16',
    text: '16. Problemes de memoire a court terme',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  }
];

// ============================================================================
// Scoring
// ============================================================================

export function computeCobraScore(responses: Record<string, number>): number {
  let total = 0;
  for (let i = 1; i <= 16; i++) {
    total += responses[`q${i}`] || 0;
  }
  return total;
}

export function interpretCobraScore(score: number): string {
  if (score <= 10) return 'Plaintes cognitives minimales';
  if (score <= 20) return 'Plaintes cognitives legeres';
  if (score <= 30) return 'Plaintes cognitives moderees';
  return 'Plaintes cognitives severes';
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

export const COBRA_DEFINITION: QuestionnaireDefinition = {
  id: 'cobra',
  code: 'COBRA',
  title: 'COBRA (Cognitive Complaints in Bipolar Disorder Rating Assessment)',
  description: 'Echelle d\'auto-evaluation des plaintes cognitives dans le trouble bipolaire.',
  questions: COBRA_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'patient'
  }
};
