// eFondaMental Platform - MADRS (Montgomery-Asberg Depression Rating Scale)
// Bipolar Initial Evaluation - Thymic Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarMadrsResponse {
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
  total_score: number | null;
  severity: string | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarMadrsResponseInsert = Omit<
  BipolarMadrsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'severity' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const MADRS_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: '1 - Tristesse apparente',
    help: "Correspond au decouragement, a la depression et au desespoir (plus qu'un simple cafard passager) refletes par la parole, la mimique et la posture.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Pas de tristesse', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Semble decourage mais peut se derider sans difficulte', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Parait triste et malheureux la plupart du temps', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Semble malheureux tout le temps. Extremement decourage', score: 6 }
    ]
  },
  {
    id: 'q2',
    text: '2 - Tristesse exprimee',
    help: "Correspond a l'expression d'une humeur depressive, que celle-ci soit apparente ou non.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Tristesse occasionnelle en rapport avec les circonstances', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Triste ou cafardeux, mais se deride sans difficulte', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: "4 - Sentiment envahissant de tristesse ou de depression", score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Tristesse, desespoir ou decouragement permanents ou sans fluctuations', score: 6 }
    ]
  },
  {
    id: 'q3',
    text: '3 - Tension interieure',
    help: "Correspond aux sentiments de malaise mal defini, d'irritabilite, d'agitation interieure, de tension nerveuse.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Calme. Tension interieure seulement passagere', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: "2 - Sentiments occasionnels d'irritabilite et de malaise mal defini", score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: "4 - Sentiments continuels de tension interieure ou panique intermittente", score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Effroi ou angoisse sans relache. Panique envahissante', score: 6 }
    ]
  },
  {
    id: 'q4',
    text: '4 - Reduction du sommeil',
    help: "Correspond a une reduction de la duree ou de la profondeur du sommeil par comparaison avec le sommeil du patient lorsqu'il n'est pas malade.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "0 - Dort comme d'habitude", score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: "2 - Legere difficulte a s'endormir ou sommeil legerement reduit", score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Sommeil reduit ou interrompu au moins deux heures', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Moins de deux ou trois heures de sommeil', score: 6 }
    ]
  },
  {
    id: 'q5',
    text: "5 - Reduction de l'appetit",
    help: "Correspond au sentiment d'une perte de l'appetit compare a l'appetit habituel.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Appetit normal ou augmente', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Appetit legerement reduit', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: "4 - Pas d'appetit. Nourriture sans gout", score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Ne mange que si on le persuade', score: 6 }
    ]
  },
  {
    id: 'q6',
    text: '6 - Difficultes de concentration',
    help: "Correspond aux difficultes a rassembler ses pensees allant jusqu'a l'incapacite a se concentrer.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Pas de difficultes de concentration', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Difficultes occasionnelles a rassembler ses pensees', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Difficultes a se concentrer et a maintenir son attention', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Incapable de lire ou de converser sans grande difficulte', score: 6 }
    ]
  },
  {
    id: 'q7',
    text: '7 - Lassitude',
    help: 'Correspond a une difficulte a se mettre en train ou une lenteur a commencer et a accomplir les activites quotidiennes.',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Guere de difficultes a se mettre en route. Pas de lenteur', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Difficultes a commencer des activites', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Difficultes a commencer des activites routinieres qui sont poursuivies avec effort', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Grande lassitude. Incapable de faire quoi que ce soit sans aide', score: 6 }
    ]
  },
  {
    id: 'q8',
    text: '8 - Incapacite a ressentir',
    help: "Correspond a l'experience subjective d'une reduction d'interet pour le monde environnant.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Interet normal pour le monde environnant et pour les gens', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Capacite reduite a prendre du plaisir a ses interets habituels', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: "4 - Perte d'interet pour le monde environnant", score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: "6 - Sentiment d'etre paralyse emotionnellement", score: 6 }
    ]
  },
  {
    id: 'q9',
    text: '9 - Pensees pessimistes',
    help: "Correspond aux idees de culpabilite, d'inferiorite, d'auto-accusation.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Pas de pensee pessimiste', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: "2 - Idees intermittentes d'echec, d'auto-accusation", score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Auto-accusations persistantes ou idees de culpabilite', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Idees delirantes de ruine, de remords ou peche inexpiable', score: 6 }
    ]
  },
  {
    id: 'q10',
    text: '10 - Idees de suicide',
    help: "Correspond au sentiment que la vie ne vaut pas la peine d'etre vecue.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Jouit de la vie ou la prend comme elle vient', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Fatigue de la vie, idees de suicide seulement passageres', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: "4 - Il vaudrait mieux etre mort. Les idees de suicide sont courantes", score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: "6 - Projets explicites de suicide si l'occasion se presente", score: 6 }
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

export const MADRS_DEFINITION: QuestionnaireDefinition = {
  id: 'madrs',
  code: 'MADRS',
  title: 'Echelle de Depression de Montgomery-Asberg (MADRS)',
  description: 'Echelle clinique pour evaluer la severite des symptomes depressifs. 10 items cotes 0-6.',
  instructions: "La cotation doit se fonder sur l'entretien clinique allant de questions generales sur les symptomes a des questions plus precises.",
  questions: MADRS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Score Computation
// ============================================================================

export interface MadrsScoreInput {
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
}

export function computeMadrsScore(responses: MadrsScoreInput): number {
  return responses.q1 + responses.q2 + responses.q3 + responses.q4 + responses.q5 +
         responses.q6 + responses.q7 + responses.q8 + responses.q9 + responses.q10;
}

// ============================================================================
// Score Interpretation
// ============================================================================

export type MadrsSeverity = 
  | 'Absence de depression'
  | 'Depression legere'
  | 'Depression moderee'
  | 'Depression severe';

export function getMadrsSeverity(score: number): MadrsSeverity {
  if (score <= 6) return 'Absence de depression';
  if (score <= 19) return 'Depression legere';
  if (score <= 34) return 'Depression moderee';
  return 'Depression severe';
}

export function interpretMadrsScore(score: number): string {
  const severity = getMadrsSeverity(score);
  return `Score MADRS: ${score}/60. ${severity}.`;
}

// ============================================================================
// Combined Scoring Function
// ============================================================================

export interface MadrsScoringResult {
  total_score: number;
  severity: MadrsSeverity;
  interpretation: string;
}

export function scoreMadrs(responses: MadrsScoreInput): MadrsScoringResult {
  const total_score = computeMadrsScore(responses);
  const severity = getMadrsSeverity(total_score);
  const interpretation = interpretMadrsScore(total_score);

  return {
    total_score,
    severity,
    interpretation
  };
}
