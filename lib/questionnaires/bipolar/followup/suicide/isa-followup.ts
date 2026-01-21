// eFondaMental Platform - ISA Followup (Intentionnalite Suicidaire Actuelle - Suivi)
// Bipolar Followup Evaluation - Suicide Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarFollowupIsaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1_life_worth: number | null;
  q1_time: string | null;
  q2_wish_death: number | null;
  q2_time: string | null;
  q3_thoughts: number | null;
  q3_time: string | null;
  q4_plan: number | null;
  q4_time: string | null;
  q5_attempt: number | null;
  q5_time: string | null;
  total_score: number | null;
  risk_level: string | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarFollowupIsaResponseInsert = Omit<
  BipolarFollowupIsaResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'risk_level' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const ISA_FOLLOWUP_QUESTIONS: Question[] = [
  {
    id: 'q1_life_worth',
    text: '1. Avez-vous deja eu l\'impression que la vie ne vaut pas la peine d\'etre vecue ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q1_time',
    text: 'Quand cela est-il arrive pour la derniere fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q1_life_worth' }, 1]
    },
    options: [
      { code: 'last_week', label: 'La semaine derniere', score: 0 },
      { code: 'since_last_visit', label: 'Il y a entre une semaine et la derniere visite', score: 0 }
    ]
  },
  {
    id: 'q2_wish_death',
    text: '2. Avez-vous deja souhaite mourir, par exemple, de vous coucher et de ne pas vous reveiller ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q2_time',
    text: 'Quand cela est-il arrive pour la derniere fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q2_wish_death' }, 1]
    },
    options: [
      { code: 'last_week', label: 'La semaine derniere', score: 0 },
      { code: 'since_last_visit', label: 'Il y a entre une semaine et la derniere visite', score: 0 }
    ]
  },
  {
    id: 'q3_thoughts',
    text: '3. Avez-vous deja pense a vous donner la mort, meme si vous ne le feriez jamais ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q3_time',
    text: 'Quand cela est-il arrive pour la derniere fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q3_thoughts' }, 1]
    },
    options: [
      { code: 'last_week', label: 'La semaine derniere', score: 0 },
      { code: 'since_last_visit', label: 'Il y a entre une semaine et la derniere visite', score: 0 }
    ]
  },
  {
    id: 'q4_plan',
    text: '4. Avez-vous deja serieusement envisage de vous donner la mort ou planifie la facon de vous y prendre ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q4_time',
    text: 'Quand cela est-il arrive pour la derniere fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q4_plan' }, 1]
    },
    options: [
      { code: 'last_week', label: 'La semaine derniere', score: 0 },
      { code: 'since_last_visit', label: 'Il y a entre une semaine et la derniere visite', score: 0 }
    ]
  },
  {
    id: 'q5_attempt',
    text: '5. Avez-vous deja essaye de vous donner la mort ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q5_time',
    text: 'Quand cela est-il arrive pour la derniere fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q5_attempt' }, 1]
    },
    options: [
      { code: 'last_week', label: 'La semaine derniere', score: 0 },
      { code: 'since_last_visit', label: 'Il y a entre une semaine et la derniere visite', score: 0 }
    ]
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const ISA_FOLLOWUP_DEFINITION = {
  id: 'isa_followup',
  code: 'ISA_FOLLOWUP',
  title: 'Intentionnalite Suicidaire Actuelle (suivi)',
  description: 'Echelle evaluant les pensees, desirs et tentatives de suicide depuis la derniere visite.',
  questions: ISA_FOLLOWUP_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Score Computation
// ============================================================================

export interface IsaFollowupScoreInput {
  q1_life_worth: number | null;
  q2_wish_death: number | null;
  q3_thoughts: number | null;
  q4_plan: number | null;
  q5_attempt: number | null;
}

export function computeIsaFollowupScore(responses: IsaFollowupScoreInput): number {
  const q1 = responses.q1_life_worth ?? 0;
  const q2 = responses.q2_wish_death ?? 0;
  const q3 = responses.q3_thoughts ?? 0;
  const q4 = responses.q4_plan ?? 0;
  const q5 = responses.q5_attempt ?? 0;
  return q1 + q2 + q3 + q4 + q5;
}

// ============================================================================
// Risk Level Interpretation
// ============================================================================

export type IsaRiskLevel = 'minimal' | 'low' | 'moderate' | 'high' | 'very_high';

export function getIsaFollowupRiskLevel(score: number): IsaRiskLevel {
  if (score === 0) return 'minimal';
  if (score === 1) return 'low';
  if (score === 2) return 'moderate';
  if (score <= 4) return 'high';
  return 'very_high';
}

export function getRiskLevelLabel(riskLevel: IsaRiskLevel): string {
  switch (riskLevel) {
    case 'minimal':
      return 'Risque minimal';
    case 'low':
      return 'Risque faible';
    case 'moderate':
      return 'Risque modere';
    case 'high':
      return 'Risque eleve';
    case 'very_high':
      return 'Risque tres eleve';
  }
}

export function interpretIsaFollowupScore(score: number): string {
  const riskLevel = getIsaFollowupRiskLevel(score);
  const riskLabel = getRiskLevelLabel(riskLevel);
  return `Score ISA Suivi: ${score}/5. ${riskLabel}.`;
}

// ============================================================================
// Recent Ideation Analysis
// ============================================================================

export interface IsaFollowupTimingInput {
  q1_time: string | null;
  q2_time: string | null;
  q3_time: string | null;
  q4_time: string | null;
  q5_time: string | null;
}

export function hasRecentIdeation(timing: IsaFollowupTimingInput): boolean {
  return timing.q1_time === 'last_week' ||
         timing.q2_time === 'last_week' ||
         timing.q3_time === 'last_week' ||
         timing.q4_time === 'last_week' ||
         timing.q5_time === 'last_week';
}

// ============================================================================
// Combined Scoring Function
// ============================================================================

export interface IsaFollowupScoringResult {
  total_score: number;
  risk_level: IsaRiskLevel;
  risk_level_label: string;
  has_recent_ideation: boolean;
  interpretation: string;
}

export function scoreIsaFollowup(
  responses: IsaFollowupScoreInput & IsaFollowupTimingInput
): IsaFollowupScoringResult {
  const total_score = computeIsaFollowupScore(responses);
  const risk_level = getIsaFollowupRiskLevel(total_score);
  const has_recent_ideation = hasRecentIdeation(responses);
  
  let interpretation = interpretIsaFollowupScore(total_score);
  if (has_recent_ideation) {
    interpretation += ' Ideation suicidaire recente (semaine derniere).';
  }

  return {
    total_score,
    risk_level,
    risk_level_label: getRiskLevelLabel(risk_level),
    has_recent_ideation,
    interpretation
  };
}
