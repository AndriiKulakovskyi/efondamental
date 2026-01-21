// eFondaMental Platform - QIDS-SR16 (Quick Inventory of Depressive Symptomatology)
// Bipolar Screening - Auto-questionnaire

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarQidsResponse {
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
  total_score: number | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarQidsResponseInsert = Omit<
  BipolarQidsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const QIDS_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Endormissement',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Je ne mets jamais plus de 30 minutes a m'endormir.", score: 0 },
      { code: 1, label: "Moins d'une fois sur deux, je mets au moins 30 minutes a m'endormir.", score: 1 },
      { code: 2, label: "Plus d'une fois sur deux, je mets au moins 30 minutes a m'endormir.", score: 2 },
      { code: 3, label: "Plus d'une fois sur deux, je mets plus d'une heure a m'endormir.", score: 3 }
    ]
  },
  {
    id: 'q2',
    text: 'Sommeil pendant la nuit',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Je ne me reveille pas la nuit.", score: 0 },
      { code: 1, label: "J'ai un sommeil agite, leger et quelques reveils brefs chaque nuit.", score: 1 },
      { code: 2, label: "Je me reveille au moins une fois par nuit, mais je me rendors facilement.", score: 2 },
      { code: 3, label: "Plus d'une fois sur deux, je me reveille plus d'une fois par nuit et reste eveille(e) 20 minutes ou plus.", score: 3 }
    ]
  },
  {
    id: 'q3',
    text: "Reveil avant l'heure prevue",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "La plupart du temps, je me reveille 30 minutes ou moins avant le moment ou je dois me lever.", score: 0 },
      { code: 1, label: "Plus d'une fois sur deux, je me reveille plus de 30 minutes avant le moment ou je dois me lever.", score: 1 },
      { code: 2, label: "Je me reveille presque toujours une heure ou plus avant le moment ou je dois me lever, mais je finis par me rendormir.", score: 2 },
      { code: 3, label: "Je me reveille au moins une heure avant le moment ou je dois me lever et je n'arrive pas a me rendormir.", score: 3 }
    ]
  },
  {
    id: 'q4',
    text: 'Sommeil excessif',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Je ne dors pas plus de 7 a 8 heures par nuit, et je ne fais pas de sieste dans la journee.", score: 0 },
      { code: 1, label: "Je ne dors pas plus de 10 heures sur un jour entier de 24 heures, siestes comprises.", score: 1 },
      { code: 2, label: "Je ne dors pas plus de 12 heures sur un jour entier de 24 heures, siestes comprises.", score: 2 },
      { code: 3, label: "Je dors plus de 12 heures sur un jour entier de 24 heures, siestes comprises.", score: 3 }
    ]
  },
  {
    id: 'q5',
    text: 'Tristesse',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Je ne me sens pas triste.", score: 0 },
      { code: 1, label: "Je me sens triste moins de la moitie du temps.", score: 1 },
      { code: 2, label: "Je me sens triste plus de la moitie du temps.", score: 2 },
      { code: 3, label: "Je me sens triste presque tout le temps.", score: 3 }
    ]
  },
  {
    id: 'q6',
    text: "Diminution de l'appetit",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "J'ai le meme appetit que d'habitude.", score: 0 },
      { code: 1, label: "Je mange un peu moins souvent ou en plus petite quantite que d'habitude.", score: 1 },
      { code: 2, label: "Je mange beaucoup moins que d'habitude et seulement en me forcant.", score: 2 },
      { code: 3, label: "Je mange rarement sur un jour entier de 24 heures et seulement en me forcant enormement ou quand on me persuade de manger.", score: 3 }
    ]
  },
  {
    id: 'q7',
    text: "Augmentation de l'appetit",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "J'ai le meme appetit que d'habitude.", score: 0 },
      { code: 1, label: "J'eprouve le besoin de manger plus souvent que d'habitude.", score: 1 },
      { code: 2, label: "Je mange regulierement plus souvent et/ou en plus grosse quantite que d'habitude.", score: 2 },
      { code: 3, label: "J'eprouve un grand besoin de manger plus que d'habitude pendant et entre les repas.", score: 3 }
    ]
  },
  {
    id: 'q8',
    text: 'Perte de poids (au cours des 15 derniers jours)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Mon poids n'a pas change.", score: 0 },
      { code: 1, label: "J'ai l'impression d'avoir perdu un peu de poids.", score: 1 },
      { code: 2, label: "J'ai perdu 1 kg ou plus.", score: 2 },
      { code: 3, label: "J'ai perdu plus de 2 kg.", score: 3 }
    ]
  },
  {
    id: 'q9',
    text: 'Prise de poids (au cours des 15 derniers jours)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Mon poids n'a pas change.", score: 0 },
      { code: 1, label: "J'ai l'impression d'avoir pris un peu de poids.", score: 1 },
      { code: 2, label: "J'ai pris 1 kg ou plus.", score: 2 },
      { code: 3, label: "J'ai pris plus de 2 kg.", score: 3 }
    ]
  },
  {
    id: 'q10',
    text: 'Concentration/Prise de decisions',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Il n'y a aucun changement dans ma capacite habituelle a me concentrer ou a prendre des decisions.", score: 0 },
      { code: 1, label: "Je me sens parfois indecis(e) ou je trouve parfois que ma concentration est limitee.", score: 1 },
      { code: 2, label: "La plupart du temps, j'ai du mal a me concentrer ou a prendre des decisions.", score: 2 },
      { code: 3, label: "Je n'arrive pas me concentrer assez pour lire ou je n'arrive pas a prendre des decisions meme si elles sont insignifiantes.", score: 3 }
    ]
  },
  {
    id: 'q11',
    text: 'Opinion de moi-meme',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Je considere que j'ai autant de valeur que les autres et que je suis aussi meritant(e) que les autres.", score: 0 },
      { code: 1, label: "Je me critique plus que d'habitude.", score: 1 },
      { code: 2, label: "Je crois fortement que je cause des problemes aux autres.", score: 2 },
      { code: 3, label: "Je pense presque tout le temps a mes petits et mes gros defauts.", score: 3 }
    ]
  },
  {
    id: 'q12',
    text: 'Idees de mort ou de suicide',
    type: 'single_choice',
    required: true,
    help: "En cas d'ideation suicidaire, alerter immediatement le clinicien.",
    options: [
      { code: 0, label: "Je ne pense pas au suicide ni a la mort.", score: 0 },
      { code: 1, label: "Je pense que la vie est sans interet ou je me demande si elle vaut la peine d'etre vecue.", score: 1 },
      { code: 2, label: "Je pense au suicide ou a la mort plusieurs fois par semaine pendant plusieurs minutes.", score: 2 },
      { code: 3, label: "Je pense au suicide ou a la mort plusieurs fois par jours en detail, j'ai envisage le suicide de maniere precise ou j'ai reellement tente de mettre fin a mes jours.", score: 3 }
    ]
  },
  {
    id: 'q13',
    text: 'Enthousiasme general',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Il n'y pas de changement par rapport a d'habitude dans la maniere dont je m'interesse aux gens ou a mes activites.", score: 0 },
      { code: 1, label: "Je me rends compte que je m'interesse moins aux gens et a mes activites.", score: 1 },
      { code: 2, label: "Je me rends compte que je n'ai d'interet que pour une ou deux des activites que j'avais auparavant.", score: 2 },
      { code: 3, label: "Je n'ai pratiquement plus d'interet pour les activites que j'avais auparavant.", score: 3 }
    ]
  },
  {
    id: 'q14',
    text: 'Energie',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "J'ai autant d'energie que d'habitude.", score: 0 },
      { code: 1, label: "Je me fatigue plus facilement que d'habitude.", score: 1 },
      { code: 2, label: "Je dois faire un gros effort pour commencer ou terminer mes activites quotidiennes (par exemple, faire les courses, les devoirs, la cuisine ou aller au travail).", score: 2 },
      { code: 3, label: "Je ne peux vraiment pas faire mes activites quotidiennes parce que je n'ai simplement plus d'energie.", score: 3 }
    ]
  },
  {
    id: 'q15',
    text: 'Impression de ralentissement',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Je pense, je parle et je bouge aussi vite que d'habitude.", score: 0 },
      { code: 1, label: "Je trouve que je reflechis plus lentement ou que ma voix est etouffee ou monocorde.", score: 1 },
      { code: 2, label: "Il me faut plusieurs secondes pour repondre a la plupart des questions et je suis sur(e) que je reflechis plus lentement.", score: 2 },
      { code: 3, label: "Je suis souvent incapable de repondre aux questions si je ne fais pas de gros efforts.", score: 3 }
    ]
  },
  {
    id: 'q16',
    text: "Impression d'agitation",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Je ne me sens pas agite(e).", score: 0 },
      { code: 1, label: "Je suis souvent agite(e), je me tords les mains ou j'ai besoin de changer de position quand je suis assis(e).", score: 1 },
      { code: 2, label: "J'eprouve le besoin soudain de bouger et je suis plutot agite(e).", score: 2 },
      { code: 3, label: "Par moments, je suis incapable de rester assis(e) et j'ai besoin de faire les cent pas.", score: 3 }
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

export const QIDS_DEFINITION: QuestionnaireDefinition = {
  id: 'qids_sr16',
  code: 'QIDS_SR16',
  title: 'QIDS-SR16',
  description: 'Auto-questionnaire court sur les symptomes de la depression - Periode de reference: 7 derniers jours',
  questions: QIDS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'patient'
  }
};

// ============================================================================
// Score Computation
// ============================================================================

export interface QidsScoreInput {
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
}

/**
 * Compute QIDS-SR16 total score
 * 
 * QIDS scoring uses domain-specific max scoring:
 * - Sleep domain (q1-q4): takes MAX of items
 * - Appetite/Weight domain (q6-q9): takes MAX of items
 * - Psychomotor domain (q15-q16): takes MAX of items
 * - Other items (q5, q10-q14): scored directly
 * 
 * Total = sleep_max + q5 + appetite_weight_max + q10 + q11 + q12 + q13 + q14 + psychomotor_max
 * Range: 0-27
 */
export function computeQidsScore(responses: QidsScoreInput): number {
  // Sleep domain: max of q1, q2, q3, q4
  const sleepScore = Math.max(responses.q1, responses.q2, responses.q3, responses.q4);
  
  // Appetite/Weight domain: max of q6, q7, q8, q9
  const appetiteWeightScore = Math.max(responses.q6, responses.q7, responses.q8, responses.q9);
  
  // Psychomotor domain: max of q15, q16
  const psychomotorScore = Math.max(responses.q15, responses.q16);
  
  // Total score
  const totalScore = 
    sleepScore + 
    responses.q5 + 
    appetiteWeightScore + 
    responses.q10 + 
    responses.q11 + 
    responses.q12 + 
    responses.q13 + 
    responses.q14 + 
    psychomotorScore;

  return totalScore;
}

// ============================================================================
// Score Interpretation
// ============================================================================

export type QidsDepressionSeverity = 
  | 'none'
  | 'mild'
  | 'moderate'
  | 'severe'
  | 'very_severe';

export interface QidsInterpretationResult {
  severity: QidsDepressionSeverity;
  label: string;
}

/**
 * Interpret QIDS score according to established cutoffs:
 * - 0-5: No depression
 * - 6-10: Mild depression
 * - 11-15: Moderate depression
 * - 16-20: Severe depression
 * - 21-27: Very severe depression
 */
export function interpretQidsScore(score: number): string {
  if (score <= 5) return 'Pas de depression';
  if (score <= 10) return 'Depression legere';
  if (score <= 15) return 'Depression moderee';
  if (score <= 20) return 'Depression severe';
  return 'Depression tres severe';
}

export function getQidsSeverity(score: number): QidsInterpretationResult {
  if (score <= 5) return { severity: 'none', label: 'Pas de depression' };
  if (score <= 10) return { severity: 'mild', label: 'Depression legere' };
  if (score <= 15) return { severity: 'moderate', label: 'Depression moderee' };
  if (score <= 20) return { severity: 'severe', label: 'Depression severe' };
  return { severity: 'very_severe', label: 'Depression tres severe' };
}

// ============================================================================
// Combined Scoring Function
// ============================================================================

export interface QidsScoringResult {
  total_score: number;
  interpretation: string;
  severity: QidsDepressionSeverity;
  domain_scores: {
    sleep: number;
    appetite_weight: number;
    psychomotor: number;
  };
}

export function scoreQids(responses: QidsScoreInput): QidsScoringResult {
  const sleepScore = Math.max(responses.q1, responses.q2, responses.q3, responses.q4);
  const appetiteWeightScore = Math.max(responses.q6, responses.q7, responses.q8, responses.q9);
  const psychomotorScore = Math.max(responses.q15, responses.q16);
  
  const total_score = computeQidsScore(responses);
  const interpretation = interpretQidsScore(total_score);
  const { severity } = getQidsSeverity(total_score);

  return {
    total_score,
    interpretation,
    severity,
    domain_scores: {
      sleep: sleepScore,
      appetite_weight: appetiteWeightScore,
      psychomotor: psychomotorScore
    }
  };
}
