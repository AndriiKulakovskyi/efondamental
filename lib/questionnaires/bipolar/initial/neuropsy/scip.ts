// eFondaMental Platform - SCIP (Screen for Cognitive Impairment in Psychiatry)
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarScipResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // VLT-I (Verbal Learning Test - Immediate)
  vlt_i_trial1: number | null;
  vlt_i_trial2: number | null;
  vlt_i_trial3: number | null;
  vlt_i_total: number | null;
  // WM (Working Memory)
  wm_score: number | null;
  // VF (Verbal Fluency)
  vf_score: number | null;
  // VLT-D (Verbal Learning Test - Delayed)
  vlt_d_score: number | null;
  // PS (Processing Speed)
  ps_score: number | null;
  // Total and derived scores
  total_raw_score: number | null;
  total_t_score: number | null;
  global_cognitive_index: number | null;
  // Metadata
  form_version: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarScipResponseInsert = Omit<
  BipolarScipResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_raw_score' | 'total_t_score' | 'global_cognitive_index'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const SCIP_QUESTIONS: Question[] = [
  // Form Version
  {
    id: 'form_version',
    text: 'Version du formulaire',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'A', label: 'Version A' },
      { code: 'B', label: 'Version B' },
      { code: 'C', label: 'Version C' }
    ]
  },

  // VLT-I (Verbal Learning Test - Immediate)
  {
    id: 'section_vlt_i',
    text: 'VLT-I (Test d\'Apprentissage Verbal - Immediat)',
    help: 'Rappel immediat d\'une liste de 10 mots sur 3 essais.',
    type: 'section',
    required: false
  },
  {
    id: 'vlt_i_trial1',
    text: 'Essai 1 - Nombre de mots rappeles',
    type: 'number',
    required: true,
    min: 0,
    max: 10
  },
  {
    id: 'vlt_i_trial2',
    text: 'Essai 2 - Nombre de mots rappeles',
    type: 'number',
    required: true,
    min: 0,
    max: 10
  },
  {
    id: 'vlt_i_trial3',
    text: 'Essai 3 - Nombre de mots rappeles',
    type: 'number',
    required: true,
    min: 0,
    max: 10
  },
  {
    id: 'vlt_i_total',
    text: 'Total VLT-I (automatique)',
    type: 'number',
    required: false,
    min: 0,
    max: 30,
    help: 'Somme des 3 essais'
  },

  // WM (Working Memory)
  {
    id: 'section_wm',
    text: 'WM (Memoire de Travail)',
    help: 'Repetition de sequences de chiffres et lettres dans l\'ordre correct.',
    type: 'section',
    required: false
  },
  {
    id: 'wm_score',
    text: 'Score WM',
    type: 'number',
    required: true,
    min: 0,
    max: 24
  },

  // VF (Verbal Fluency)
  {
    id: 'section_vf',
    text: 'VF (Fluence Verbale)',
    help: 'Nommer le plus de mots possibles commencant par une lettre donnee en 30 secondes.',
    type: 'section',
    required: false
  },
  {
    id: 'vf_score',
    text: 'Score VF - Nombre de mots corrects',
    type: 'number',
    required: true,
    min: 0
  },

  // VLT-D (Verbal Learning Test - Delayed)
  {
    id: 'section_vlt_d',
    text: 'VLT-D (Test d\'Apprentissage Verbal - Differe)',
    help: 'Rappel differe de la liste de mots apprise precedemment.',
    type: 'section',
    required: false
  },
  {
    id: 'vlt_d_score',
    text: 'Score VLT-D - Nombre de mots rappeles',
    type: 'number',
    required: true,
    min: 0,
    max: 10
  },

  // PS (Processing Speed)
  {
    id: 'section_ps',
    text: 'PS (Vitesse de Traitement)',
    help: 'Test de codage - Nombre de symboles correctement codes en 30 secondes.',
    type: 'section',
    required: false
  },
  {
    id: 'ps_score',
    text: 'Score PS - Nombre de symboles corrects',
    type: 'number',
    required: true,
    min: 0
  }
];

// ============================================================================
// Scoring
// ============================================================================

export interface ScipScoreInput {
  vlt_i_trial1: number;
  vlt_i_trial2: number;
  vlt_i_trial3: number;
  wm_score: number;
  vf_score: number;
  vlt_d_score: number;
  ps_score: number;
}

export function computeScipScore(input: ScipScoreInput): { vltITotal: number; totalRawScore: number } {
  const vltITotal = input.vlt_i_trial1 + input.vlt_i_trial2 + input.vlt_i_trial3;
  const totalRawScore = vltITotal + input.wm_score + input.vf_score + input.vlt_d_score + input.ps_score;
  return { vltITotal, totalRawScore };
}

export function interpretScipScore(totalScore: number): string {
  if (totalScore >= 85) return 'Fonctionnement cognitif normal';
  if (totalScore >= 70) return 'Deficit cognitif leger';
  if (totalScore >= 55) return 'Deficit cognitif modere';
  return 'Deficit cognitif severe';
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

export const SCIP_DEFINITION: QuestionnaireDefinition = {
  id: 'scip',
  code: 'SCIP',
  title: 'SCIP (Screen for Cognitive Impairment in Psychiatry)',
  description: 'Depistage des troubles cognitifs en psychiatrie - Batterie de tests cognitifs brefs.',
  questions: SCIP_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
