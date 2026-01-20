// eFondaMental Platform - ALDA (Lithium Response Scale)
// Bipolar Initial Evaluation - Thymic Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarAldaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q0: number;
  qa: number | null;
  qb1: number | null;
  qb2: number | null;
  qb3: number | null;
  qb4: number | null;
  qb5: number | null;
  score_a: number | null;
  score_b: number | null;
  total_score: number | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarAldaResponseInsert = Omit<
  BipolarAldaResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'score_a' | 'score_b' | 'total_score' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const ALDA_QUESTIONS: Question[] = [
  {
    id: 'section_consignes',
    text: 'CONSIGNES',
    help: "Le critere A est utilise pour determiner une association entre amelioration clinique et le traitement. La cotation devrait porter sur la periode pendant laquelle le traitement etait considere adequat quant a la duree et au dosage.",
    type: 'section',
    required: false
  },
  // Depistage Section
  {
    id: 'section_screening',
    text: 'Depistage',
    type: 'section',
    required: false
  },
  {
    id: 'q0',
    text: 'Le patient est-il actuellement traite par lithium ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },

  // Critere A Section
  {
    id: 'section_a',
    text: 'Critere A',
    type: 'section',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q0' }, 1] }
  },
  {
    id: 'qa',
    text: 'Veuillez coter le degre d\'amelioration clinique globale observee sous traitement.',
    help: 'Si le Score A est inferieur a 7, le Score Total sera automatiquement de 0.',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ 'var': 'answers.q0' }, 1] },
    options: [
      { code: 0, label: '0 - Aucun changement, ni pejoration', score: 0 },
      { code: 1, label: '1 - Amelioration minime. Reduction de l\'activite de maladie de 0-10%', score: 1 },
      { code: 2, label: '2 - Amelioration legere. Reduction de l\'activite de maladie de 10-20%', score: 2 },
      { code: 3, label: '3 - Amelioration legere. Reduction de l\'activite de maladie de 20-35%', score: 3 },
      { code: 4, label: '4 - Amelioration moderee. Reduction de l\'activite de maladie de 35-50%', score: 4 },
      { code: 5, label: '5 - Bonne moderee. Reduction de l\'activite de maladie de 50-65%', score: 5 },
      { code: 6, label: '6 - Bonne reponse. Reduction de l\'activite de maladie de 65-80%', score: 6 },
      { code: 7, label: '7 - Bonne reponse. Reduction de l\'activite de maladie de 80-90%', score: 7 },
      { code: 8, label: '8 - Tres bonne reponse. l\'activite de la maladie reduite de plus de 90%', score: 8 },
      { code: 9, label: '9 - Tres bonnes reponse, aucune recurrence mais le patient peut encore avoir des symptomes residuels minimes', score: 9 },
      { code: 10, label: '10 - Reponse complete, aucune recurrence et recuperation fonctionnelle totale', score: 10 }
    ]
  },

  // Critere B Section
  {
    id: 'section_b',
    text: 'Critere B',
    type: 'section',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q0' }, 1] }
  },
  {
    id: 'qb1',
    text: 'B1: nombre d\'episodes avant le traitement',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ 'var': 'answers.q0' }, 1] },
    options: [
      { code: 0, label: '4 episodes ou plus', score: 0 },
      { code: 1, label: '2 ou 3 episodes', score: 1 },
      { code: 2, label: '1 episode', score: 2 }
    ]
  },
  {
    id: 'qb2',
    text: 'B2: Frequence des episodes avant le traitement.',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ 'var': 'answers.q0' }, 1] },
    options: [
      { code: 0, label: 'Moyenne a elevee, incluant les cycles rapides', score: 0 },
      { code: 1, label: 'Faible, remissions spontanees de 3 ans ou plus en moyenne', score: 1 },
      { code: 2, label: '1 seul episode, risque de recurrence ne peut etre etabli', score: 2 }
    ]
  },
  {
    id: 'qb3',
    text: 'B3: Duree du traitement;',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ 'var': 'answers.q0' }, 1] },
    options: [
      { code: 0, label: '2 ans ou plus', score: 0 },
      { code: 1, label: '1-2 ans', score: 1 },
      { code: 2, label: 'moins d\'un an', score: 2 }
    ]
  },
  {
    id: 'qb4',
    text: 'B4: Compliance durant la/les periode(s) de stabilite',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ 'var': 'answers.q0' }, 1] },
    options: [
      { code: 0, label: 'Excellente, documentee par des taux dans les limites therapeutiques', score: 0 },
      { code: 1, label: 'Bonne, plus de 80% des taux dans les limites therapeutiques', score: 1 },
      { code: 2, label: 'Pauvre, repetitivement hors traitements, moins de 80% des taux dans les limites therapeutiques', score: 2 }
    ]
  },
  {
    id: 'qb5',
    text: 'B5 Usage de medication additionnelle durant la phase de stabilite',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ 'var': 'answers.q0' }, 1] },
    options: [
      { code: 0, label: 'Aucun hormis de rares somniferes (1 par semaine ou moins); pas d\'autres stabilisateurs pour controler les symptomes thymiques', score: 0 },
      { code: 1, label: 'Antidepresseurs ou antipsychotiques a faible dose comme une securite, ou recours prolonge a des somniferes', score: 1 },
      { code: 2, label: 'Usage prolonge ou systematique d\'un antidepresseur ou antipsychotique', score: 2 }
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

export const ALDA_DEFINITION: QuestionnaireDefinition = {
  id: 'alda',
  code: 'ALDA',
  title: 'Echelle d\'Alda (Alda Scale) - Modified',
  description: 'Echelle d\'evaluation retrospective de la reponse prophylactique au lithium.',
  instructions: `CONSIGNES
Le critere A est utilise pour determiner une association entre amelioration clinique et le traitement. La cotation devrait porter sur la periode pendant laquelle le traitement etait considere adequat quant a la duree et au dosage. L'activite de la maladie devrait etre jugee selon la frequence, la severite et la duree des episodes.`,
  questions: ALDA_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional',
    version: 'French Version',
    language: 'fr-FR'
  }
};

// ============================================================================
// Score Computation
// ============================================================================

export interface AldaScoreInput {
  q0: number;
  qa: number | null;
  qb1: number | null;
  qb2: number | null;
  qb3: number | null;
  qb4: number | null;
  qb5: number | null;
}

export function computeAldaScore(responses: AldaScoreInput): {
  score_a: number | null;
  score_b: number | null;
  total_score: number | null;
} {
  // If not on lithium, no score
  if (responses.q0 === 0) {
    return { score_a: null, score_b: null, total_score: null };
  }

  const scoreA = responses.qa ?? 0;
  
  // If score A < 7, total score is 0
  if (scoreA < 7) {
    return { score_a: scoreA, score_b: null, total_score: 0 };
  }

  // Calculate score B
  const scoreB = (responses.qb1 ?? 0) + (responses.qb2 ?? 0) + (responses.qb3 ?? 0) + 
                 (responses.qb4 ?? 0) + (responses.qb5 ?? 0);
  
  // Total score = A - B
  const totalScore = scoreA - scoreB;

  return { 
    score_a: scoreA, 
    score_b: scoreB, 
    total_score: Math.max(0, totalScore) 
  };
}

// ============================================================================
// Score Interpretation
// ============================================================================

export function interpretAldaScore(totalScore: number | null, q0: number): string {
  if (q0 === 0) {
    return 'Patient non traite par lithium - Echelle non applicable.';
  }

  if (totalScore === null) {
    return 'Score non calculable.';
  }

  if (totalScore === 0) {
    return 'Score Total: 0. Pas de reponse au lithium ou score A insuffisant (<7).';
  }

  if (totalScore >= 7) {
    return `Score Total: ${totalScore}. Excellente reponse au lithium.`;
  }

  if (totalScore >= 5) {
    return `Score Total: ${totalScore}. Bonne reponse au lithium.`;
  }

  if (totalScore >= 3) {
    return `Score Total: ${totalScore}. Reponse moderee au lithium.`;
  }

  return `Score Total: ${totalScore}. Reponse faible au lithium.`;
}

// ============================================================================
// Combined Scoring Function
// ============================================================================

export interface AldaScoringResult {
  score_a: number | null;
  score_b: number | null;
  total_score: number | null;
  interpretation: string;
}

export function scoreAlda(responses: AldaScoreInput): AldaScoringResult {
  const { score_a, score_b, total_score } = computeAldaScore(responses);
  const interpretation = interpretAldaScore(total_score, responses.q0);

  return {
    score_a,
    score_b,
    total_score,
    interpretation
  };
}
