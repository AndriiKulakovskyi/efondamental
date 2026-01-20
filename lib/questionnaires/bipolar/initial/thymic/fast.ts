// eFondaMental Platform - FAST (Functioning Assessment Short Test)
// Bipolar Initial Evaluation - Thymic Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarFastResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
  q11: number;
  q12: number;
  q13: number;
  q14: number;
  q15: number;
  q16: number;
  q17: number;
  q18: number;
  q19: number;
  q20: number;
  q21: number;
  q22: number;
  q23: number;
  q24: number;
  total_score: number | null;
  autonomy_score: number | null;
  work_score: number | null;
  cognitive_score: number | null;
  finances_score: number | null;
  relationships_score: number | null;
  leisure_score: number | null;
  severity: string | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarFastResponseInsert = Omit<
  BipolarFastResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'autonomy_score' | 'work_score' | 'cognitive_score' | 'finances_score' | 'relationships_score' | 'leisure_score' | 'severity' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

const DIFFICULTY_OPTIONS = [
  { code: 0, label: 'Aucune difficulte', score: 0 },
  { code: 1, label: 'Difficulte legere', score: 1 },
  { code: 2, label: 'Difficulte moderee', score: 2 },
  { code: 3, label: 'Difficulte severe', score: 3 }
];

export const FAST_QUESTIONS: Question[] = [
  // AUTONOMIE Section
  {
    id: 'section_autonomie',
    text: 'AUTONOMIE',
    type: 'section',
    required: false
  },
  {
    id: 'q1',
    text: 'Prendre des responsabilites au sein de la maison',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q2',
    text: 'Vivre seul(e)',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q3',
    text: 'Faire les courses',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q4',
    text: 'Prendre soin de soi (aspect physique, hygiene...)',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },

  // ACTIVITE PROFESSIONNELLE Section
  {
    id: 'section_travail',
    text: 'ACTIVITE PROFESSIONNELLE',
    type: 'section',
    required: false
  },
  {
    id: 'q5',
    text: 'Avoir un emploi remunere',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q6',
    text: 'Terminer les taches le plus rapidement possible',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q7',
    text: 'Travailler dans le champ correspondant a votre formation',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q8',
    text: 'Recevoir le salaire que vous meritez',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q9',
    text: 'Gerer correctement la somme de travail',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },

  // FONCTIONNEMENT COGNITIF Section
  {
    id: 'section_cognitif',
    text: 'FONCTIONNEMENT COGNITIF',
    type: 'section',
    required: false
  },
  {
    id: 'q10',
    text: 'Capacite a se concentrer devant un film, un livre..',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q11',
    text: 'Capacite au calcul mental',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q12',
    text: 'Capacite a resoudre des problemes correctement',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q13',
    text: 'Capacite a se souvenir des noms recemment appris',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q14',
    text: 'Capacite a apprendre de nouvelles informations',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },

  // FINANCES Section
  {
    id: 'section_finances',
    text: 'FINANCES',
    type: 'section',
    required: false
  },
  {
    id: 'q15',
    text: 'Gerer votre propre argent',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q16',
    text: 'Depenser facon equilibree',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },

  // RELATIONS INTERPERSONNELLES Section
  {
    id: 'section_relations',
    text: 'RELATIONS INTERPERSONNELLES',
    type: 'section',
    required: false
  },
  {
    id: 'q17',
    text: 'Conserver des amities',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q18',
    text: 'Participer a des activites sociales',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q19',
    text: 'Avoir de bonnes relations avec vos proches',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q20',
    text: 'Habiter avec votre famille',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q21',
    text: 'Avoir des relations sexuelles satisfaisantes',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q22',
    text: 'Etre capable de defendre vos interets',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },

  // LOISIRS Section
  {
    id: 'section_loisirs',
    text: 'LOISIRS',
    type: 'section',
    required: false
  },
  {
    id: 'q23',
    text: 'Faire de l\'exercice ou pratiquer un sport',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
  },
  {
    id: 'q24',
    text: 'Avoir des loisirs',
    type: 'single_choice',
    required: true,
    options: DIFFICULTY_OPTIONS
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

export const FAST_DEFINITION: QuestionnaireDefinition = {
  id: 'fast',
  code: 'FAST',
  title: 'Echelle Breve d\'evaluation du Fonctionnement du Patient (FAST)',
  description: 'Questionnaire evaluant le degre de difficulte rencontre par le patient dans differents aspects de son fonctionnement (Autonomie, Travail, Cognition, Finances, Relations, Loisirs).',
  questions: FAST_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional',
    version: 'French',
    language: 'fr-FR'
  }
};

// ============================================================================
// Score Computation
// ============================================================================

export interface FastScoreInput {
  q1: number; q2: number; q3: number; q4: number;
  q5: number; q6: number; q7: number; q8: number; q9: number;
  q10: number; q11: number; q12: number; q13: number; q14: number;
  q15: number; q16: number;
  q17: number; q18: number; q19: number; q20: number; q21: number; q22: number;
  q23: number; q24: number;
}

export interface FastDomainScores {
  autonomy_score: number;
  work_score: number;
  cognitive_score: number;
  finances_score: number;
  relationships_score: number;
  leisure_score: number;
  total_score: number;
}

export function computeFastScores(responses: FastScoreInput): FastDomainScores {
  const autonomy = responses.q1 + responses.q2 + responses.q3 + responses.q4;
  const work = responses.q5 + responses.q6 + responses.q7 + responses.q8 + responses.q9;
  const cognitive = responses.q10 + responses.q11 + responses.q12 + responses.q13 + responses.q14;
  const finances = responses.q15 + responses.q16;
  const relationships = responses.q17 + responses.q18 + responses.q19 + responses.q20 + responses.q21 + responses.q22;
  const leisure = responses.q23 + responses.q24;

  const total = autonomy + work + cognitive + finances + relationships + leisure;

  return {
    autonomy_score: autonomy,
    work_score: work,
    cognitive_score: cognitive,
    finances_score: finances,
    relationships_score: relationships,
    leisure_score: leisure,
    total_score: total
  };
}

// ============================================================================
// Score Interpretation
// ============================================================================

export type FastSeverity = 
  | 'Fonctionnement normal ou quasi-normal'
  | 'Difficultes legeres'
  | 'Difficultes moderees'
  | 'Difficultes severes';

export function getFastSeverity(score: number): FastSeverity {
  if (score <= 11) return 'Fonctionnement normal ou quasi-normal';
  if (score <= 20) return 'Difficultes legeres';
  if (score <= 40) return 'Difficultes moderees';
  return 'Difficultes severes';
}

export function interpretFastScore(scores: FastDomainScores): string {
  const severity = getFastSeverity(scores.total_score);
  
  let interpretation = `Score FAST total: ${scores.total_score}/72. ${severity}.`;
  
  // Add domain-specific comments for high scores
  const domainMax: Record<string, number> = {
    autonomy: 12, work: 15, cognitive: 15, finances: 6, relationships: 18, leisure: 6
  };

  if (scores.autonomy_score > domainMax.autonomy * 0.5) {
    interpretation += ' Difficultes importantes en autonomie.';
  }
  if (scores.work_score > domainMax.work * 0.5) {
    interpretation += ' Difficultes importantes au travail.';
  }
  if (scores.cognitive_score > domainMax.cognitive * 0.5) {
    interpretation += ' Difficultes cognitives.';
  }
  if (scores.finances_score > domainMax.finances * 0.5) {
    interpretation += ' Difficultes financieres.';
  }
  if (scores.relationships_score > domainMax.relationships * 0.5) {
    interpretation += ' Difficultes relationnelles.';
  }
  if (scores.leisure_score > domainMax.leisure * 0.5) {
    interpretation += ' Difficultes dans les loisirs.';
  }

  return interpretation;
}

// ============================================================================
// Combined Scoring Function
// ============================================================================

export interface FastScoringResult extends FastDomainScores {
  severity: FastSeverity;
  interpretation: string;
}

export function scoreFast(responses: FastScoreInput): FastScoringResult {
  const scores = computeFastScores(responses);
  const severity = getFastSeverity(scores.total_score);
  const interpretation = interpretFastScore(scores);

  return {
    ...scores,
    severity,
    interpretation
  };
}
