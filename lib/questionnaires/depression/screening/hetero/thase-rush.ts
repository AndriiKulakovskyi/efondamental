// eFondaMental Platform - Critères de Résistance de Thase et Rush
// Depression Screening - Hetero-questionnaire

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface DepressionThaseRushResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  niveau_resistance: number;
  total_score: number | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type DepressionThaseRushResponseInsert = Omit<
  DepressionThaseRushResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const DEPRESSION_THASE_RUSH_QUESTIONS: Question[] = [
  {
    id: 'niveau_resistance',
    text: 'Quel est le niveau de résistance du patient selon les critères de Thase et Rush ?',
    section: 'Évaluation de la Résistance',
    type: 'single_choice',
    required: true,
    options: [
      {
        code: 1,
        label: "Niveau 1 : Résistance à un premier antidépresseur utilisé à doses suffisantes et pendant une durée adéquate.",
        score: 1
      },
      {
        code: 2,
        label: "Niveau 2 : Niveau 1 + échec à un autre antidépresseur d'une autre classe.",
        score: 2
      },
      {
        code: 3,
        label: "Niveau 3 : Niveau 2 + échec à un antidépresseur tricyclique.",
        score: 3
      },
      {
        code: 4,
        label: "Niveau 4 : Niveau 3 + échec à un inhibiteur de la monoamine oxydase (IMAO).",
        score: 4
      },
      {
        code: 5,
        label: "Niveau 5 : Niveau 4 + échec de l'électroconvulsivothérapie (ECT) bilatérale.",
        score: 5
      }
    ]
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

export const DEPRESSION_THASE_RUSH_DEFINITION: QuestionnaireDefinition = {
  id: 'depression_thase_rush',
  code: 'THASE_RUSH',
  title: 'Critères de Résistance de Thase et Rush',
  description: "Échelle permettant d'évaluer le niveau de résistance aux traitements antidépresseurs chez les patients souffrant de dépression.",
  questions: DEPRESSION_THASE_RUSH_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['depression'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Score Computation
// ============================================================================

export interface DepressionThaseRushScoreInput {
  niveau_resistance: number;
}

export function computeDepressionThaseRushScore(responses: DepressionThaseRushScoreInput): number {
  return responses.niveau_resistance;
}

// ============================================================================
// Score Interpretation
// ============================================================================

export type DepressionThaseRushInterpretation =
  | 'Hors critères de cohorte'
  | 'Dépression résistante confirmée';

export function getDepressionThaseRushInterpretation(score: number): DepressionThaseRushInterpretation {
  if (score < 2) return 'Hors critères de cohorte';
  return 'Dépression résistante confirmée';
}

export function interpretDepressionThaseRushScore(score: number): string {
  if (score < 2) {
    return "Niveau " + score + "/5. Le patient ne répond pas aux critères d'inclusion de la cohorte (niveau < 2).";
  }
  return "Niveau " + score + "/5. Le patient présente une dépression résistante confirmée et peut rester dans la cohorte.";
}

// ============================================================================
// Combined Scoring Function
// ============================================================================

export interface DepressionThaseRushScoringResult {
  total_score: number;
  interpretation: string;
}

export function scoreDepressionThaseRush(responses: DepressionThaseRushScoreInput): DepressionThaseRushScoringResult {
  const total_score = computeDepressionThaseRushScore(responses);
  const interpretation = interpretDepressionThaseRushScore(total_score);

  return {
    total_score,
    interpretation
  };
}
