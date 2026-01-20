// eFondaMental Platform - Stroop Test
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarStroopResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Reading condition (Color words in black)
  reading_correct: number | null;
  reading_errors: number | null;
  reading_time_seconds: number | null;
  // Naming condition (Color patches)
  naming_correct: number | null;
  naming_errors: number | null;
  naming_time_seconds: number | null;
  // Interference condition (Color words in incongruent ink)
  interference_correct: number | null;
  interference_errors: number | null;
  interference_time_seconds: number | null;
  // Derived scores
  interference_score: number | null;
  interference_ratio: number | null;
  // Standardized scores
  reading_z_score: number | null;
  naming_z_score: number | null;
  interference_z_score: number | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarStroopResponseInsert = Omit<
  BipolarStroopResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'interference_score' | 'interference_ratio' | 'reading_z_score' | 'naming_z_score' | 'interference_z_score'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const STROOP_QUESTIONS: Question[] = [
  // Reading Condition
  {
    id: 'section_reading',
    text: 'Condition Lecture (Mots)',
    help: 'Lecture de mots de couleurs imprimes en noir (ROUGE, BLEU, VERT).',
    type: 'section',
    required: false
  },
  {
    id: 'reading_correct',
    text: 'Lecture - Nombre de reponses correctes',
    type: 'number',
    required: true,
    min: 0,
    max: 100
  },
  {
    id: 'reading_errors',
    text: 'Lecture - Nombre d\'erreurs',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'reading_time_seconds',
    text: 'Lecture - Temps (en secondes)',
    type: 'number',
    required: false,
    min: 0,
    max: 180
  },

  // Naming Condition
  {
    id: 'section_naming',
    text: 'Condition Denomination (Couleurs)',
    help: 'Denomination de la couleur de rectangles colores.',
    type: 'section',
    required: false
  },
  {
    id: 'naming_correct',
    text: 'Denomination - Nombre de reponses correctes',
    type: 'number',
    required: true,
    min: 0,
    max: 100
  },
  {
    id: 'naming_errors',
    text: 'Denomination - Nombre d\'erreurs',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'naming_time_seconds',
    text: 'Denomination - Temps (en secondes)',
    type: 'number',
    required: false,
    min: 0,
    max: 180
  },

  // Interference Condition
  {
    id: 'section_interference',
    text: 'Condition Interference',
    help: 'Denomination de la couleur de l\'encre de mots de couleurs (ex: "ROUGE" ecrit en bleu).',
    type: 'section',
    required: false
  },
  {
    id: 'interference_correct',
    text: 'Interference - Nombre de reponses correctes',
    type: 'number',
    required: true,
    min: 0,
    max: 100
  },
  {
    id: 'interference_errors',
    text: 'Interference - Nombre d\'erreurs',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'interference_time_seconds',
    text: 'Interference - Temps (en secondes)',
    type: 'number',
    required: false,
    min: 0,
    max: 180
  }
];

// ============================================================================
// Scoring
// ============================================================================

export function computeStroopInterference(
  reading: number, 
  naming: number, 
  interference: number
): { interferenceScore: number; interferenceRatio: number } {
  // Golden interference score formula
  const predicted = (reading * naming) / (reading + naming);
  const interferenceScore = interference - predicted;
  const interferenceRatio = naming > 0 ? interference / naming : 0;
  
  return { interferenceScore, interferenceRatio };
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

export const STROOP_DEFINITION: QuestionnaireDefinition = {
  id: 'stroop',
  code: 'STROOP',
  title: 'Test de Stroop',
  description: 'Test de Stroop - Evaluation de l\'attention selective et de l\'inhibition cognitive.',
  questions: STROOP_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
