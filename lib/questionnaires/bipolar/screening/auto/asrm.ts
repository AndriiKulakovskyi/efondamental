// eFondaMental Platform - ASRM (Altman Self-Rating Mania Scale)
// Bipolar Screening - Auto-questionnaire

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarAsrmResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  total_score: number | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarAsrmResponseInsert = Omit<
  BipolarAsrmResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const ASRM_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Question 1: Humeur (Bonheur/Joie)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Je ne me sens pas plus heureux(se) ou plus joyeux(se) que d'habitude.", score: 0 },
      { code: 1, label: "Je me sens parfois plus heureux(se) ou plus joyeux(se) que d'habitude.", score: 1 },
      { code: 2, label: "Je me sens souvent plus heureux(se) ou plus joyeux(se) que d'habitude.", score: 2 },
      { code: 3, label: "Je me sens plus heureux(se) ou plus joyeux(se) que d'habitude la plupart du temps.", score: 3 },
      { code: 4, label: "Je me sens plus heureux(se) ou plus joyeux(se) que d'habitude tout le temps.", score: 4 }
    ]
  },
  {
    id: 'q2',
    text: 'Question 2: Confiance en soi',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Je ne me sens pas plus sur(e) de moi que d'habitude.", score: 0 },
      { code: 1, label: "Je me sens parfois plus sur(e) de moi que d'habitude.", score: 1 },
      { code: 2, label: "Je me sens souvent plus sur(e) de moi que d'habitude.", score: 2 },
      { code: 3, label: "Je me sens plus sur(e) de moi que d'habitude la plupart du temps.", score: 3 },
      { code: 4, label: "Je me sens extremement sur(e) de moi tout le temps.", score: 4 }
    ]
  },
  {
    id: 'q3',
    text: 'Question 3: Besoin de sommeil',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Je n'ai pas besoin de moins de sommeil que d'habitude.", score: 0 },
      { code: 1, label: "J'ai parfois besoin de moins de sommeil que d'habitude.", score: 1 },
      { code: 2, label: "J'ai souvent besoin de moins de sommeil que d'habitude.", score: 2 },
      { code: 3, label: "J'ai frequemment besoin de moins de sommeil que d'habitude.", score: 3 },
      { code: 4, label: "Je peux passer toute la journee et toute la nuit sans dormir et ne pas etre fatigue(e).", score: 4 }
    ]
  },
  {
    id: 'q4',
    text: 'Question 4: Discours (Loquacite)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Je ne parle pas plus que d'habitude.", score: 0 },
      { code: 1, label: "Je parle parfois plus que d'habitude.", score: 1 },
      { code: 2, label: "Je parle souvent plus que d'habitude.", score: 2 },
      { code: 3, label: "Je parle frequemment plus que d'habitude.", score: 3 },
      { code: 4, label: "Je parle sans arret et je ne peux etre interrompu(e).", score: 4 }
    ]
  },
  {
    id: 'q5',
    text: "Question 5: Niveau d'activite",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Je n'ai pas ete plus actif(ve) que d'habitude (socialement, sexuellement, au travail, a la maison ou a l'ecole).", score: 0 },
      { code: 1, label: "J'ai parfois ete plus actif(ve) que d'habitude.", score: 1 },
      { code: 2, label: "J'ai souvent ete plus actif(ve) que d'habitude.", score: 2 },
      { code: 3, label: "J'ai frequemment ete plus actif(ve) que d'habitude.", score: 3 },
      { code: 4, label: "Je suis constamment actif(ve), ou en mouvement tout le temps.", score: 4 }
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

export const ASRM_DEFINITION: QuestionnaireDefinition = {
  id: 'asrm',
  code: 'ASRM_FR',
  title: 'Auto-Questionnaire Altman (ASRM)',
  description: "Echelle d'Auto-Evaluation de la Manie - Periode de reference: 7 derniers jours",
  questions: ASRM_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'patient',
    instructions: "Consignes : Choisir la proposition dans chaque groupe qui correspond le mieux a la maniere dont vous vous etes senti(e) la semaine derniere.\n\nVeuillez noter : « parfois » utilise ici signifie une ou deux fois, « souvent » signifie plusieurs, « frequemment » signifie la plupart du temps."
  }
};

// ============================================================================
// Score Computation
// ============================================================================

export interface AsrmScoreInput {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
}

export function computeAsrmScore(responses: AsrmScoreInput): number {
  return responses.q1 + responses.q2 + responses.q3 + responses.q4 + responses.q5;
}

// ============================================================================
// Score Interpretation
// ============================================================================

export const ASRM_CUTOFF = 6;

export function interpretAsrmScore(score: number): string {
  if (score >= ASRM_CUTOFF) {
    return "Score suggestif d'un etat maniaque/hypomaniaque (score >= 6)";
  }
  return "Score non suggestif d'un etat maniaque (score < 6)";
}

// ============================================================================
// Combined Scoring Function
// ============================================================================

export interface AsrmScoringResult {
  total_score: number;
  interpretation: string;
  is_positive: boolean;
}

export function scoreAsrm(responses: AsrmScoreInput): AsrmScoringResult {
  const total_score = computeAsrmScore(responses);
  const interpretation = interpretAsrmScore(total_score);
  const is_positive = total_score >= ASRM_CUTOFF;

  return {
    total_score,
    interpretation,
    is_positive
  };
}
