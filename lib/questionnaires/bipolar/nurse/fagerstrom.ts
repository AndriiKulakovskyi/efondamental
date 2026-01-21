// eFondaMental Platform - Fagerstrom Test for Nicotine Dependence (FTND)
// Bipolar Nurse Evaluation Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarNurseFagerstromResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  q5: number | null;
  q6: number | null;
  total_score: number | null;
  dependence_level: string | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarNurseFagerstromResponseInsert = {
  visit_id: string;
  patient_id: string;
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
  q5?: number | null;
  q6?: number | null;
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const FAGERSTROM_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: '1. Combien de temps apres votre reveil fumez-vous votre premiere cigarette ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 3, label: 'Dans les 5 minutes', score: 3 },
      { code: 2, label: 'De 6 a 30 minutes', score: 2 },
      { code: 1, label: 'De 31 a 60 minutes', score: 1 },
      { code: 0, label: 'Apres 60 minutes', score: 0 }
    ]
  },
  {
    id: 'q2',
    text: '2. Trouvez-vous difficile de vous abstenir de fumer dans les endroits ou c\'est interdit ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q3',
    text: '3. A quelle cigarette de la journee vous serait-il le plus difficile de renoncer ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'La premiere', score: 1 },
      { code: 0, label: 'N\'importe quelle autre', score: 0 }
    ]
  },
  {
    id: 'q4',
    text: '4. Combien de cigarettes fumez-vous par jour ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '10 ou moins', score: 0 },
      { code: 1, label: '11-20', score: 1 },
      { code: 2, label: '21-30', score: 2 },
      { code: 3, label: '31 ou plus', score: 3 }
    ]
  },
  {
    id: 'q5',
    text: '5. Fumez-vous a un rythme plus soutenu le matin que l\'apres-midi ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q6',
    text: '6. Fumez-vous lorsque vous etes si malade que vous devez rester au lit presque toute la journee ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const FAGERSTROM_DEFINITION = {
  id: 'fagerstrom',
  code: 'FAGERSTROM',
  title: 'Echelle de dependance tabagique de Fagerstrom (FTND)',
  description: 'Test de dependance a la nicotine. 6 items, score total 0-10.',
  questions: FAGERSTROM_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional',
    // Only show Fagerstrom if patient is current smoker
    conditional_on: {
      questionnaire_code: 'TOBACCO',
      field: 'smoking_status',
      values: ['current_smoker']
    }
  }
};

// ============================================================================
// Score Computation
// ============================================================================

export interface FagerstromScoreInput {
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  q5: number | null;
  q6: number | null;
}

export function computeFagerstromScore(responses: FagerstromScoreInput): number {
  const q1 = responses.q1 ?? 0;
  const q2 = responses.q2 ?? 0;
  const q3 = responses.q3 ?? 0;
  const q4 = responses.q4 ?? 0;
  const q5 = responses.q5 ?? 0;
  const q6 = responses.q6 ?? 0;
  return q1 + q2 + q3 + q4 + q5 + q6;
}

// ============================================================================
// Dependence Level Interpretation
// ============================================================================

export type DependenceLevel = 'none' | 'low' | 'moderate' | 'high' | 'very_high';

export function getFagerstromDependenceLevel(score: number): DependenceLevel {
  if (score <= 2) return 'none';
  if (score <= 4) return 'low';
  if (score <= 5) return 'moderate';
  if (score <= 7) return 'high';
  return 'very_high';
}

export function getDependenceLevelLabel(level: DependenceLevel): string {
  switch (level) {
    case 'none':
      return 'Pas de dependance';
    case 'low':
      return 'Dependance faible';
    case 'moderate':
      return 'Dependance moyenne';
    case 'high':
      return 'Dependance forte';
    case 'very_high':
      return 'Dependance tres forte';
  }
}

export function interpretFagerstromScore(score: number): string {
  const level = getFagerstromDependenceLevel(score);
  const levelLabel = getDependenceLevelLabel(level);
  return `Score FTND: ${score}/10. ${levelLabel}.`;
}

// ============================================================================
// Combined Scoring Function
// ============================================================================

export interface FagerstromScoringResult {
  total_score: number;
  dependence_level: DependenceLevel;
  dependence_level_label: string;
  interpretation: string;
}

export function scoreFagerstrom(responses: FagerstromScoreInput): FagerstromScoringResult {
  const total_score = computeFagerstromScore(responses);
  const dependence_level = getFagerstromDependenceLevel(total_score);

  return {
    total_score,
    dependence_level,
    dependence_level_label: getDependenceLevelLabel(dependence_level),
    interpretation: interpretFagerstromScore(total_score)
  };
}
