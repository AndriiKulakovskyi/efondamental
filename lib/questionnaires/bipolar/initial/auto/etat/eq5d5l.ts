// eFondaMental Platform - EQ5D5L (EuroQol 5D-5L)
// Bipolar Initial Evaluation - Auto ETAT Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarEq5d5lResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  mobility: number;
  self_care: number;
  usual_activities: number;
  pain_discomfort: number;
  anxiety_depression: number;
  vas_score: number;
  health_state: string | null;
  index_value: string | null;
  profile_string: string | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarEq5d5lResponseInsert = Omit<
  BipolarEq5d5lResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'health_state' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const EQ5D5L_QUESTIONS: Question[] = [
  {
    id: 'section_descriptive',
    text: 'Systeme descriptif',
    type: 'section',
    required: false
  },
  {
    id: 'mobility',
    text: 'Mobilite',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: "Je n'ai aucun probleme pour me deplacer a pied", score: 1 },
      { code: 2, label: "J'ai des problemes legers pour me deplacer a pied", score: 2 },
      { code: 3, label: "J'ai des problemes moderes pour me deplacer a pied", score: 3 },
      { code: 4, label: "J'ai des problemes severes pour me deplacer a pied", score: 4 },
      { code: 5, label: "Je suis incapable de me deplacer a pied", score: 5 }
    ]
  },
  {
    id: 'self_care',
    text: 'Autonomie de la personne',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: "Je n'ai aucun probleme pour me laver ou m'habiller tout seul", score: 1 },
      { code: 2, label: "J'ai des problemes legers pour me laver ou m'habiller tout seul", score: 2 },
      { code: 3, label: "J'ai des problemes moderes pour me laver ou m'habiller tout seul", score: 3 },
      { code: 4, label: "J'ai des problemes severes pour me laver ou m'habiller tout seul", score: 4 },
      { code: 5, label: "Je suis incapable de me laver ou de m'habiller tout(e) seul(e)", score: 5 }
    ]
  },
  {
    id: 'usual_activities',
    text: 'Activites courantes (exemples : travail, etudes, travaux domestiques, activites familiales ou loisirs)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: "Je n'ai aucun probleme pour accomplir mes activites courantes", score: 1 },
      { code: 2, label: "J'ai des problemes legers pour accomplir mes activites courantes", score: 2 },
      { code: 3, label: "J'ai des problemes moderes pour accomplir mes activites courantes", score: 3 },
      { code: 4, label: "J'ai des problemes severes pour accomplir mes activites courantes", score: 4 },
      { code: 5, label: "Je suis incapable d'accomplir mes activites courantes", score: 5 }
    ]
  },
  {
    id: 'pain_discomfort',
    text: 'Douleurs, gene',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: "Je n'ai ni douleur, ni gene", score: 1 },
      { code: 2, label: "J'ai des douleurs ou une gene legere(s)", score: 2 },
      { code: 3, label: "J'ai des douleurs ou une gene moderee(s)", score: 3 },
      { code: 4, label: "J'ai des douleurs ou une gene severe(s)", score: 4 },
      { code: 5, label: "J'ai des douleurs ou une gene extreme(s)", score: 5 }
    ]
  },
  {
    id: 'anxiety_depression',
    text: 'Anxiete, depression',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: "Je ne suis ni anxieux(se), ni deprime(e)", score: 1 },
      { code: 2, label: "Je suis legerement anxieux(se) ou deprime(e)", score: 2 },
      { code: 3, label: "Je suis moderement anxieux(se) ou deprime(e)", score: 3 },
      { code: 4, label: "Je suis severement anxieux(se) ou deprime(e)", score: 4 },
      { code: 5, label: "Je suis extremement anxieux(se) ou deprime(e)", score: 5 }
    ]
  },
  {
    id: 'section_vas',
    text: 'Echelle Visuelle Analogique (EVA)',
    type: 'section',
    required: false
  },
  {
    id: 'vas_score',
    text: 'Nous aimerions savoir dans quelle mesure votre sante est bonne ou mauvaise AUJOURD\'HUI. Votre etat de sante aujourd\'hui [valeur entre 0 et 100] ?',
    type: 'number',
    required: true,
    min: 0,
    max: 100,
    help: 'Cette echelle est numerotee de 0 a 100. 100 correspond a la meilleure sante que vous puissiez imaginer. 0 correspond a la pire sante que vous puissiez imaginer.'
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

export const EQ5D5L_DEFINITION: QuestionnaireDefinition = {
  id: 'eq5d5l',
  code: 'EQ5D5L',
  title: 'EQ-5D-5L',
  description: 'Instrument standardise de mesure de l\'etat de sante comprenant 5 dimensions et une echelle visuelle analogique (EVA).',
  questions: EQ5D5L_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    version: '5L',
    language: 'fr-FR',
    singleColumn: true
  }
};

// ============================================================================
// Score Computation
// ============================================================================

export interface Eq5d5lScoreInput {
  mobility: number;
  self_care: number;
  usual_activities: number;
  pain_discomfort: number;
  anxiety_depression: number;
  vas_score: number;
}

export interface Eq5d5lScoreResult {
  health_state: string;
  profile_string: string;
  index_value: string;
  interpretation: string;
}

export function computeHealthState(responses: Eq5d5lScoreInput): string {
  return `${responses.mobility}${responses.self_care}${responses.usual_activities}${responses.pain_discomfort}${responses.anxiety_depression}`;
}

export function computeEq5d5lScores(responses: Eq5d5lScoreInput): Eq5d5lScoreResult {
  const profileString = computeHealthState(responses);
  const sumDimensions = responses.mobility + responses.self_care + responses.usual_activities + 
                        responses.pain_discomfort + responses.anxiety_depression;
  
  // Simple index approximation (real calculation requires country-specific value sets)
  // This is a simplified formula for demonstration
  const indexValue = (1 - ((sumDimensions - 5) * 0.1)).toFixed(3);
  
  // Count dimensions with problems
  const problemDimensions = [
    responses.mobility,
    responses.self_care,
    responses.usual_activities,
    responses.pain_discomfort,
    responses.anxiety_depression
  ].filter(v => v > 1).length;
  
  let interpretation = `Profil de santé: ${profileString}. Score VAS: ${responses.vas_score}/100.`;
  
  if (profileString === '11111') {
    interpretation += ' Aucun problème de santé rapporté sur les 5 dimensions.';
  } else {
    interpretation += ` ${problemDimensions} dimension(s) avec problèmes.`;
  }
  
  // VAS interpretation
  if (responses.vas_score >= 80) {
    interpretation += ' VAS élevé - bonne perception de l\'état de santé.';
  } else if (responses.vas_score >= 50) {
    interpretation += ' VAS moyen - perception modérée de l\'état de santé.';
  } else {
    interpretation += ' VAS bas - perception défavorable de l\'état de santé.';
  }
  
  // Index value interpretation
  const indexNum = parseFloat(indexValue);
  if (indexNum >= 0.8) {
    interpretation += ' Index d\'utilité élevé - bonne qualité de vie.';
  } else if (indexNum >= 0.5) {
    interpretation += ' Index d\'utilité moyen - qualité de vie modérée.';
  } else {
    interpretation += ' Index d\'utilité bas - qualité de vie altérée.';
  }
  
  return {
    health_state: profileString,
    profile_string: profileString,
    index_value: indexValue,
    interpretation
  };
}

export function interpretEq5d5l(responses: Eq5d5lScoreInput): string {
  const result = computeEq5d5lScores(responses);
  return result.interpretation;
}
