// eFondaMental Platform - Fluences Verbales (Verbal Fluency)
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarFluencesVerbalesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Phonemic fluency (letter P)
  phonemic_p_total: number | null;
  phonemic_p_cluster_count: number | null;
  phonemic_p_switches: number | null;
  phonemic_p_repetitions: number | null;
  phonemic_p_intrusions: number | null;
  // Phonemic fluency (letter R)
  phonemic_r_total: number | null;
  phonemic_r_cluster_count: number | null;
  phonemic_r_switches: number | null;
  phonemic_r_repetitions: number | null;
  phonemic_r_intrusions: number | null;
  // Semantic fluency (Animals)
  semantic_animals_total: number | null;
  semantic_animals_cluster_count: number | null;
  semantic_animals_switches: number | null;
  semantic_animals_repetitions: number | null;
  semantic_animals_intrusions: number | null;
  // Semantic fluency (Fruits)
  semantic_fruits_total: number | null;
  semantic_fruits_cluster_count: number | null;
  semantic_fruits_switches: number | null;
  semantic_fruits_repetitions: number | null;
  semantic_fruits_intrusions: number | null;
  // Totals
  phonemic_total: number | null;
  semantic_total: number | null;
  // Standardized scores
  phonemic_z_score: number | null;
  phonemic_percentile: number | null;
  semantic_z_score: number | null;
  semantic_percentile: number | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarFluencesVerbalesResponseInsert = Omit<
  BipolarFluencesVerbalesResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'phonemic_total' | 'semantic_total' | 'phonemic_z_score' | 'phonemic_percentile' | 'semantic_z_score' | 'semantic_percentile'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const FLUENCES_VERBALES_QUESTIONS: Question[] = [
  // Phonemic Fluency - P
  {
    id: 'section_phonemic_p',
    text: 'Fluence Phonemique - Lettre P',
    help: 'Nommer le plus de mots possibles commencant par la lettre P en 2 minutes.',
    type: 'section',
    required: false
  },
  {
    id: 'phonemic_p_total',
    text: 'Lettre P - Nombre total de mots corrects',
    type: 'number',
    required: true,
    min: 0
  },
  {
    id: 'phonemic_p_repetitions',
    text: 'Lettre P - Nombre de repetitions',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'phonemic_p_intrusions',
    text: 'Lettre P - Nombre d\'intrusions',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'phonemic_p_cluster_count',
    text: 'Lettre P - Nombre de clusters',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'phonemic_p_switches',
    text: 'Lettre P - Nombre de switches',
    type: 'number',
    required: false,
    min: 0
  },

  // Phonemic Fluency - R
  {
    id: 'section_phonemic_r',
    text: 'Fluence Phonemique - Lettre R',
    help: 'Nommer le plus de mots possibles commencant par la lettre R en 2 minutes.',
    type: 'section',
    required: false
  },
  {
    id: 'phonemic_r_total',
    text: 'Lettre R - Nombre total de mots corrects',
    type: 'number',
    required: true,
    min: 0
  },
  {
    id: 'phonemic_r_repetitions',
    text: 'Lettre R - Nombre de repetitions',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'phonemic_r_intrusions',
    text: 'Lettre R - Nombre d\'intrusions',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'phonemic_r_cluster_count',
    text: 'Lettre R - Nombre de clusters',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'phonemic_r_switches',
    text: 'Lettre R - Nombre de switches',
    type: 'number',
    required: false,
    min: 0
  },

  // Semantic Fluency - Animals
  {
    id: 'section_semantic_animals',
    text: 'Fluence Semantique - Animaux',
    help: 'Nommer le plus d\'animaux possibles en 2 minutes.',
    type: 'section',
    required: false
  },
  {
    id: 'semantic_animals_total',
    text: 'Animaux - Nombre total de mots corrects',
    type: 'number',
    required: true,
    min: 0
  },
  {
    id: 'semantic_animals_repetitions',
    text: 'Animaux - Nombre de repetitions',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'semantic_animals_intrusions',
    text: 'Animaux - Nombre d\'intrusions',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'semantic_animals_cluster_count',
    text: 'Animaux - Nombre de clusters',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'semantic_animals_switches',
    text: 'Animaux - Nombre de switches',
    type: 'number',
    required: false,
    min: 0
  },

  // Semantic Fluency - Fruits
  {
    id: 'section_semantic_fruits',
    text: 'Fluence Semantique - Fruits',
    help: 'Nommer le plus de fruits possibles en 2 minutes.',
    type: 'section',
    required: false
  },
  {
    id: 'semantic_fruits_total',
    text: 'Fruits - Nombre total de mots corrects',
    type: 'number',
    required: true,
    min: 0
  },
  {
    id: 'semantic_fruits_repetitions',
    text: 'Fruits - Nombre de repetitions',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'semantic_fruits_intrusions',
    text: 'Fruits - Nombre d\'intrusions',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'semantic_fruits_cluster_count',
    text: 'Fruits - Nombre de clusters',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'semantic_fruits_switches',
    text: 'Fruits - Nombre de switches',
    type: 'number',
    required: false,
    min: 0
  }
];

// ============================================================================
// Scoring
// ============================================================================

export function computeFluencesTotals(
  phonemicP: number,
  phonemicR: number,
  semanticAnimals: number,
  semanticFruits: number
): { phonemicTotal: number; semanticTotal: number } {
  return {
    phonemicTotal: phonemicP + phonemicR,
    semanticTotal: semanticAnimals + semanticFruits
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

export const FLUENCES_VERBALES_DEFINITION: QuestionnaireDefinition = {
  id: 'fluences_verbales',
  code: 'FLUENCES_VERBALES',
  title: 'Fluences Verbales',
  description: 'Test de fluence verbale - Evaluation des fonctions executives et de la memoire semantique.',
  questions: FLUENCES_VERBALES_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
