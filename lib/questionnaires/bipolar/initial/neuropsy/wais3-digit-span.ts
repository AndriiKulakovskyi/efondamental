// eFondaMental Platform - WAIS-III Digit Span (Memoire des Chiffres)
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarWais3DigitSpanResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Forward (Ordre direct)
  forward_trial1_1: number | null;
  forward_trial1_2: number | null;
  forward_trial2_1: number | null;
  forward_trial2_2: number | null;
  forward_trial3_1: number | null;
  forward_trial3_2: number | null;
  forward_trial4_1: number | null;
  forward_trial4_2: number | null;
  forward_trial5_1: number | null;
  forward_trial5_2: number | null;
  forward_trial6_1: number | null;
  forward_trial6_2: number | null;
  forward_trial7_1: number | null;
  forward_trial7_2: number | null;
  forward_trial8_1: number | null;
  forward_trial8_2: number | null;
  forward_raw_score: number | null;
  forward_span: number | null;
  // Backward (Ordre inverse)
  backward_trial1_1: number | null;
  backward_trial1_2: number | null;
  backward_trial2_1: number | null;
  backward_trial2_2: number | null;
  backward_trial3_1: number | null;
  backward_trial3_2: number | null;
  backward_trial4_1: number | null;
  backward_trial4_2: number | null;
  backward_trial5_1: number | null;
  backward_trial5_2: number | null;
  backward_trial6_1: number | null;
  backward_trial6_2: number | null;
  backward_trial7_1: number | null;
  backward_trial7_2: number | null;
  backward_raw_score: number | null;
  backward_span: number | null;
  // Total scores
  total_raw_score: number | null;
  scaled_score: number | null;
  percentile: number | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarWais3DigitSpanResponseInsert = Omit<
  BipolarWais3DigitSpanResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_raw_score' | 'scaled_score' | 'percentile'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

const TRIAL_OPTIONS = [
  { code: 0, label: '0 - Echec', score: 0 },
  { code: 1, label: '1 - Reussi', score: 1 }
];

function createDigitSpanTrials(prefix: string, sectionTitle: string, maxLevel: number): Question[] {
  const questions: Question[] = [
    {
      id: `section_${prefix}`,
      text: sectionTitle,
      type: 'section',
      required: false
    }
  ];

  for (let level = 1; level <= maxLevel; level++) {
    const digits = level + 1; // Level 1 = 2 digits, etc.
    questions.push({
      id: `${prefix}_trial${level}_1`,
      text: `Niveau ${level} - Essai 1 (${digits} chiffres)`,
      type: 'single_choice',
      required: level <= 2 ? true : false,
      options: TRIAL_OPTIONS
    });
    questions.push({
      id: `${prefix}_trial${level}_2`,
      text: `Niveau ${level} - Essai 2 (${digits} chiffres)`,
      type: 'single_choice',
      required: level <= 2 ? true : false,
      options: TRIAL_OPTIONS
    });
  }

  questions.push({
    id: `${prefix}_raw_score`,
    text: `Score Brut ${sectionTitle}`,
    type: 'number',
    required: false,
    min: 0,
    max: maxLevel * 2
  });

  questions.push({
    id: `${prefix}_span`,
    text: `Empan ${sectionTitle}`,
    type: 'number',
    required: false,
    min: 0,
    max: maxLevel + 1
  });

  return questions;
}

export const WAIS3_DIGIT_SPAN_QUESTIONS: Question[] = [
  {
    id: 'section_instructions',
    text: 'WAIS-III Memoire des Chiffres',
    help: 'Deux conditions: Ordre Direct et Ordre Inverse.',
    type: 'section',
    required: false
  },
  ...createDigitSpanTrials('forward', 'Ordre Direct', 8),
  ...createDigitSpanTrials('backward', 'Ordre Inverse', 7)
];

// ============================================================================
// Scoring
// ============================================================================

export function computeWais3DigitSpanRawScore(forwardRaw: number, backwardRaw: number): number {
  return forwardRaw + backwardRaw;
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

export const WAIS3_DIGIT_SPAN_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_digit_span',
  code: 'WAIS3_DIGIT_SPAN',
  title: 'WAIS-III Memoire des Chiffres',
  description: 'Sous-test Memoire des Chiffres de la WAIS-III - Evaluation de la memoire de travail auditive.',
  questions: WAIS3_DIGIT_SPAN_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
