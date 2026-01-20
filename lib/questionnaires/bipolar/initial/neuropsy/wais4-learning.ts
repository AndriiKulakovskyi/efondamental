// eFondaMental Platform - WAIS-IV Learning Disorders
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarWais4LearningResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Learning Disorders
  dyslexia: number | null;
  dysorthographia: number | null;
  dyscalculia: number | null;
  dysphasia: number | null;
  dyspraxia: number | null;
  speech_delay: number | null;
  stuttering: number | null;
  walking_delay: number | null;
  febrile_seizures: number | null;
  precocity: number | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarWais4LearningResponseInsert = Omit<
  BipolarWais4LearningResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

const YES_NO_DK_OPTIONS = [
  { code: 1, label: 'Oui', score: 0 },
  { code: 0, label: 'Non', score: 0 },
  { code: 9, label: 'Ne sait pas', score: 0 }
];

export const WAIS4_LEARNING_QUESTIONS: Question[] = [
  {
    id: 'dyslexia',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Dyslexie',
    type: 'single_choice',
    required: true,
    options: YES_NO_DK_OPTIONS
  },
  {
    id: 'dysorthographia',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Dysorthographie',
    type: 'single_choice',
    required: true,
    options: YES_NO_DK_OPTIONS
  },
  {
    id: 'dyscalculia',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Dyscalculie',
    type: 'single_choice',
    required: true,
    options: YES_NO_DK_OPTIONS
  },
  {
    id: 'dysphasia',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Dysphasie',
    type: 'single_choice',
    required: true,
    options: YES_NO_DK_OPTIONS
  },
  {
    id: 'dyspraxia',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Dyspraxie',
    type: 'single_choice',
    required: true,
    options: YES_NO_DK_OPTIONS
  },
  {
    id: 'speech_delay',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Retard a l\'acquisition de la parole',
    type: 'single_choice',
    required: true,
    options: YES_NO_DK_OPTIONS
  },
  {
    id: 'stuttering',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Begaiement',
    type: 'single_choice',
    required: true,
    options: YES_NO_DK_OPTIONS
  },
  {
    id: 'walking_delay',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Retard a l\'acquisition de la marche',
    type: 'single_choice',
    required: true,
    options: YES_NO_DK_OPTIONS
  },
  {
    id: 'febrile_seizures',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Convulsions febriles dans la petite enfance',
    type: 'single_choice',
    required: true,
    options: YES_NO_DK_OPTIONS
  },
  {
    id: 'precocity',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Precocite',
    type: 'single_choice',
    required: true,
    options: YES_NO_DK_OPTIONS
  }
];

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

export const WAIS4_LEARNING_DEFINITION: QuestionnaireDefinition = {
  id: 'wais4_learning',
  code: 'WAIS4_LEARNING',
  title: 'WAIS-IV Troubles des acquisitions et des apprentissages',
  description: 'Liste de controle des antecedents de troubles des acquisitions et des apprentissages.',
  questions: WAIS4_LEARNING_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
