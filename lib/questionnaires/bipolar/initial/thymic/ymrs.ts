// eFondaMental Platform - YMRS (Young Mania Rating Scale)
// Bipolar Initial Evaluation - Thymic Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarYmrsResponse {
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
  total_score: number | null;
  severity: string | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarYmrsResponseInsert = Omit<
  BipolarYmrsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'severity' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const YMRS_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: "1. Elevation de l'humeur",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Absente', score: 0 },
      { code: 1, label: "Legerement ou possiblement elevee lorsqu'on l'interroge", score: 1 },
      { code: 2, label: "Elevation subjective nette; optimiste, plein d'assurance", score: 2 },
      { code: 3, label: "Elevee, au contenu approprie, plaisantin", score: 3 },
      { code: 4, label: 'Euphorique; rires inappropries; chante', score: 4 }
    ]
  },
  {
    id: 'q2',
    text: "2. Activite motrice et energie augmentees",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Absentes', score: 0 },
      { code: 1, label: 'Subjectivement elevees', score: 1 },
      { code: 2, label: 'Anime; expression gestuelle plus elevee', score: 2 },
      { code: 3, label: 'Energie excessive; parfois hyperactif; agite (peut etre calme)', score: 3 },
      { code: 4, label: 'Excitation motrice; hyperactivite continuelle (ne peut etre calme)', score: 4 }
    ]
  },
  {
    id: 'q3',
    text: '3. Interet sexuel',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Normal, non augmente', score: 0 },
      { code: 1, label: 'Augmentation legere ou possible', score: 1 },
      { code: 2, label: "Clairement augmente lorsqu'on l'interroge", score: 2 },
      { code: 3, label: "Parle spontanement de la sexualite; se decrit comme etant hyper sexuel", score: 3 },
      { code: 4, label: "Agissements sexuels manifestes", score: 4 }
    ]
  },
  {
    id: 'q4',
    text: '4. Sommeil',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Ne rapporte pas de diminution de sommeil', score: 0 },
      { code: 1, label: "Dort jusqu'a une heure de moins que d'habitude", score: 1 },
      { code: 2, label: "Sommeil reduit de plus d'une heure par rapport a d'habitude", score: 2 },
      { code: 3, label: 'Rapporte un moins grand besoin de sommeil', score: 3 },
      { code: 4, label: 'Nie le besoin de sommeil', score: 4 }
    ]
  },
  {
    id: 'q5',
    text: '5. Irritabilite',
    help: 'Cet item est cote sur une echelle de 0 a 8.',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Absente', score: 0 },
      { code: 2, label: 'Subjectivement augmentee', score: 2 },
      { code: 4, label: "Irritable par moment durant l'entretien", score: 4 },
      { code: 6, label: "Frequemment irritable durant l'entretien; brusque; abrupt", score: 6 },
      { code: 8, label: 'Hostile, non cooperatif; evaluation impossible', score: 8 }
    ]
  },
  {
    id: 'q6',
    text: '6. Discours (debit et quantite)',
    help: 'Cet item est cote sur une echelle de 0 a 8.',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Pas augmente', score: 0 },
      { code: 2, label: 'Se sent bavard', score: 2 },
      { code: 4, label: 'Augmentation du debit et de la quantite par moment', score: 4 },
      { code: 6, label: 'Soutenu; augmentation consistante du debit; difficile a interrompre', score: 6 },
      { code: 8, label: 'Sous pression; impossible a interrompre; discours continu', score: 8 }
    ]
  },
  {
    id: 'q7',
    text: '7. Langage - troubles de la pensee',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Absent', score: 0 },
      { code: 1, label: 'Circonstanciel; legere distractivite; pensees rapides', score: 1 },
      { code: 2, label: 'Distractivite; perd le fil de ses idees; change frequemment de sujet', score: 2 },
      { code: 3, label: "Fuite des idees; reponses hors sujet; difficile a suivre", score: 3 },
      { code: 4, label: 'Incoherent; communication impossible', score: 4 }
    ]
  },
  {
    id: 'q8',
    text: '8. Contenu',
    help: 'Cet item est cote sur une echelle de 0 a 8.',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Normal', score: 0 },
      { code: 2, label: 'Projets discutables; interets nouveaux', score: 2 },
      { code: 4, label: 'Projet(s) particulier(s); hyper religieux', score: 4 },
      { code: 6, label: 'Idees de grandeur ou de persecution; idees de reference', score: 6 },
      { code: 8, label: 'Delires; hallucinations', score: 8 }
    ]
  },
  {
    id: 'q9',
    text: '9. Comportement agressif et perturbateur',
    help: 'Cet item est cote sur une echelle de 0 a 8.',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Absent, cooperatif', score: 0 },
      { code: 2, label: 'Sarcastique; parle fort par moment, sur la defensive', score: 2 },
      { code: 4, label: 'Exigeant; fait des menaces dans le service', score: 4 },
      { code: 6, label: "Menace l'evaluateur; crie; evaluation difficile", score: 6 },
      { code: 8, label: 'Agressif physiquement; destructeur; evaluation impossible', score: 8 }
    ]
  },
  {
    id: 'q10',
    text: '10. Apparence',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Soignee et habillement adequat', score: 0 },
      { code: 1, label: 'Legerement neglige', score: 1 },
      { code: 2, label: 'Peu soigne; moderement debraille; trop habille', score: 2 },
      { code: 3, label: 'Debraille; a moitie nu; maquillage criard', score: 3 },
      { code: 4, label: 'Completement neglige; orne; accoutrement bizarre', score: 4 }
    ]
  },
  {
    id: 'q11',
    text: '11. Introspection',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Presente; admet etre malade; reconnait le besoin de traitement', score: 0 },
      { code: 1, label: 'Eventuellement malade', score: 1 },
      { code: 2, label: 'Admet des changements de comportement, mais nie la maladie', score: 2 },
      { code: 3, label: 'Admet de possibles changements de comportement, mais nie la maladie', score: 3 },
      { code: 4, label: 'Nie tout changement de comportement', score: 4 }
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

export const YMRS_DEFINITION: QuestionnaireDefinition = {
  id: 'ymrs',
  code: 'YMRS',
  title: 'Young Mania Rating Scale (YMRS)',
  description: 'Echelle d\'evaluation de la manie hetero-administree comportant 11 items.',
  instructions: "Guide pour attribuer des points aux items: le but de chaque item est d'estimer la severite de cette anomalie chez le patient.",
  questions: YMRS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional',
    version: 'French Version (Favre, Aubry, McQuillan, Bertschy, 2003)',
    language: 'fr-FR'
  }
};

// ============================================================================
// Score Computation
// ============================================================================

export interface YmrsScoreInput {
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
}

export function computeYmrsScore(responses: YmrsScoreInput): number {
  return responses.q1 + responses.q2 + responses.q3 + responses.q4 + responses.q5 +
         responses.q6 + responses.q7 + responses.q8 + responses.q9 + responses.q10 + responses.q11;
}

// ============================================================================
// Score Interpretation
// ============================================================================

export type YmrsSeverity = 
  | 'Euthymie ou symptomes minimes'
  | 'Symptomes maniaques legers'
  | 'Symptomes maniaques moderes'
  | 'Symptomes maniaques severes';

export function getYmrsSeverity(score: number): YmrsSeverity {
  if (score <= 12) return 'Euthymie ou symptomes minimes';
  if (score <= 19) return 'Symptomes maniaques legers';
  if (score <= 25) return 'Symptomes maniaques moderes';
  return 'Symptomes maniaques severes';
}

export function interpretYmrsScore(score: number): string {
  const severity = getYmrsSeverity(score);
  return `Score YMRS: ${score}/60. ${severity}.`;
}

// ============================================================================
// Combined Scoring Function
// ============================================================================

export interface YmrsScoringResult {
  total_score: number;
  severity: YmrsSeverity;
  interpretation: string;
}

export function scoreYmrs(responses: YmrsScoreInput): YmrsScoringResult {
  const total_score = computeYmrsScore(responses);
  const severity = getYmrsSeverity(total_score);
  const interpretation = interpretYmrsScore(total_score);

  return {
    total_score,
    severity,
    interpretation
  };
}
