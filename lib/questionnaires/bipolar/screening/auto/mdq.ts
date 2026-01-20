// eFondaMental Platform - MDQ (Mood Disorder Questionnaire)
// Bipolar Screening - Auto-questionnaire

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarMdqResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1_1: number;
  q1_2: number;
  q1_3: number;
  q1_4: number;
  q1_5: number;
  q1_6: number;
  q1_7: number;
  q1_8: number;
  q1_9: number;
  q1_10: number;
  q1_11: number;
  q1_12: number;
  q1_13: number;
  q1_score: number | null;
  q2: number | null;
  q3: number | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarMdqResponseInsert = Omit<
  BipolarMdqResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'q1_score' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const MDQ_QUESTIONS: Question[] = [
  {
    id: 'q1_1',
    text: "1.1 ... vous vous sentiez si bien et si remonte que d'autres pensaient que vous n'etiez pas comme d'habitude ou que vous alliez vous attirer des ennuis",
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q1_2',
    text: "1.2 ... vous etiez si irritable que vous criiez apres les gens ou provoquiez des bagarres ou des disputes",
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q1_3',
    text: "1.3 ... vous vous sentiez beaucoup plus sur(e) de vous que d'habitude",
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q1_4',
    text: "1.4 ... vous dormiez beaucoup moins que d'habitude et cela ne vous manquait pas vraiment",
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q1_5',
    text: "1.5 ... vous etiez beaucoup plus bavard(e) et parliez beaucoup plus vite que d'habitude",
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q1_6',
    text: "1.6 ... des pensees traversaient rapidement votre tete et vous ne pouviez pas les ralentir",
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q1_7',
    text: "1.7 ... vous etiez si facilement distrait(e) que vous aviez des difficultes a vous concentrer ou a poursuivre la meme idee",
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q1_8',
    text: "1.8 ... vous aviez beaucoup plus d'energie que d'habitude",
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q1_9',
    text: "1.9 ... vous etiez beaucoup plus actif(ve) ou faisiez beaucoup plus de choses que d'habitude",
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q1_10',
    text: "1.10 ... vous etiez beaucoup plus sociable ou extraverti(e), par ex. vous telephoniez a vos amis la nuit",
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q1_11',
    text: "1.11 ... vous etiez beaucoup plus interesse(e) par le sexe que d'habitude",
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q1_12',
    text: "1.12 ... vous faisiez des choses inhabituelles ou jugees excessives, imprudentes ou risquees",
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q1_13',
    text: "1.13 ... vous depensiez de l'argent d'une maniere si inadaptee que cela vous attirait des ennuis pour vous ou votre famille",
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q2',
    text: "2. Si >=2 reponses ''oui'' a la Q1, ces reponses sont-elles apparues durant la meme periode ?",
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Oui' },
      { code: 0, label: 'Non' }
    ]
  },
  {
    id: 'q3',
    text: "3. A quel point ces problemes ont-ils eu un impact sur votre fonctionnement ?",
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Pas de probleme', score: 0 },
      { code: 1, label: 'Probleme mineur', score: 1 },
      { code: 2, label: 'Probleme moyen', score: 2 },
      { code: 3, label: 'Probleme serieux', score: 3 }
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

export const MDQ_DEFINITION: QuestionnaireDefinition = {
  id: 'mdq',
  code: 'MDQ_FR',
  title: "MDQ - Questionnaire des Troubles de l'Humeur",
  description: 'Outil de depistage du trouble bipolaire - Periode de reference: au cours de votre vie',
  questions: MDQ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'patient'
  }
};

// ============================================================================
// Score Computation
// ============================================================================

export interface MdqScoreInput {
  q1_1: number;
  q1_2: number;
  q1_3: number;
  q1_4: number;
  q1_5: number;
  q1_6: number;
  q1_7: number;
  q1_8: number;
  q1_9: number;
  q1_10: number;
  q1_11: number;
  q1_12: number;
  q1_13: number;
  q2: number | null;
  q3: number | null;
}

/**
 * Compute MDQ Q1 score (sum of 13 symptom items)
 * Each item is 0 (No) or 1 (Yes)
 * Range: 0-13
 */
export function computeMdqQ1Score(responses: MdqScoreInput): number {
  return (
    responses.q1_1 +
    responses.q1_2 +
    responses.q1_3 +
    responses.q1_4 +
    responses.q1_5 +
    responses.q1_6 +
    responses.q1_7 +
    responses.q1_8 +
    responses.q1_9 +
    responses.q1_10 +
    responses.q1_11 +
    responses.q1_12 +
    responses.q1_13
  );
}

// ============================================================================
// Score Interpretation
// ============================================================================

/**
 * MDQ Positive Screen criteria:
 * 1. Q1 score >= 7 (at least 7 "yes" responses to symptom items)
 * 2. Q2 = 1 (Yes - symptoms occurred during same period)
 * 3. Q3 >= 2 ("Probleme moyen" or "Probleme serieux")
 */
export function isMdqPositive(responses: MdqScoreInput): boolean {
  const q1Score = computeMdqQ1Score(responses);
  
  return (
    q1Score >= 7 &&
    responses.q2 === 1 &&
    responses.q3 !== null &&
    responses.q3 >= 2
  );
}

export function interpretMdqScore(responses: MdqScoreInput): string {
  const isPositive = isMdqPositive(responses);
  
  if (isPositive) {
    return 'MDQ Positif - Depistage positif pour trouble bipolaire';
  }
  return 'MDQ Negatif - Depistage negatif pour trouble bipolaire';
}

// ============================================================================
// Combined Scoring Function
// ============================================================================

export interface MdqScoringResult {
  q1_score: number;
  q2_concurrent: boolean | null;
  q3_impact_level: number | null;
  is_positive: boolean;
  interpretation: string;
}

export function scoreMdq(responses: MdqScoreInput): MdqScoringResult {
  const q1_score = computeMdqQ1Score(responses);
  const is_positive = isMdqPositive(responses);
  const interpretation = interpretMdqScore(responses);

  return {
    q1_score,
    q2_concurrent: responses.q2 === 1 ? true : responses.q2 === 0 ? false : null,
    q3_impact_level: responses.q3,
    is_positive,
    interpretation
  };
}
