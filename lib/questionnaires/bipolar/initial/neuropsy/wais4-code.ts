// eFondaMental Platform - WAIS-IV Code (Digit Symbol Coding)
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarWais4CodeResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Raw performance
  symbols_correct: number | null;
  symbols_incorrect: number | null;
  // Time limit (120 seconds standard)
  time_seconds: number | null;
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

export type BipolarWais4CodeResponseInsert = Omit<
  BipolarWais4CodeResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'raw_score' | 'scaled_score' | 'percentile'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const WAIS4_CODE_QUESTIONS: Question[] = [
  {
    id: 'section_instructions',
    text: 'WAIS-IV Code (Symboles)',
    help: 'Le sujet doit copier les symboles correspondant aux chiffres selon une cle de correspondance, en 120 secondes.',
    type: 'section',
    required: false
  },
  {
    id: 'symbols_correct',
    text: 'Nombre de symboles correctement codes',
    type: 'number',
    required: true,
    min: 0,
    max: 135
  },
  {
    id: 'symbols_incorrect',
    text: 'Nombre de symboles incorrects',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'time_seconds',
    text: 'Temps utilise (en secondes)',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    help: 'Standard: 120 secondes'
  }
];

// ============================================================================
// Scoring
// ============================================================================

export function computeWais4CodeRawScore(symbolsCorrect: number, symbolsIncorrect: number = 0): number {
  return Math.max(0, symbolsCorrect - symbolsIncorrect);
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

export const WAIS4_CODE_DEFINITION: QuestionnaireDefinition = {
  id: 'wais4_code',
  code: 'WAIS4_CODE',
  title: 'WAIS-IV Code',
  description: 'Sous-test Code de la WAIS-IV - Evaluation de la vitesse de traitement et de la memoire de travail.',
  questions: WAIS4_CODE_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
