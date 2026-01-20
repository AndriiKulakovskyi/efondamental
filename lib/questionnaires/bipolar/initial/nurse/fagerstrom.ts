// eFondaMental Platform - FAGERSTROM (Fagerstrom Test for Nicotine Dependence)
// Bipolar Initial Evaluation - Nurse Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarFagerstromResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  total_score: number | null;
  dependence_level: string | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarFagerstromResponseInsert = Omit<
  BipolarFagerstromResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'dependence_level' | 'interpretation'
> & {
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
    conditional_on?: {
      questionnaire_code: string;
      field: string;
      values: string[];
    };
    [key: string]: any;
  };
}

export const FAGERSTROM_DEFINITION: QuestionnaireDefinition = {
  id: 'fagerstrom',
  code: 'FAGERSTROM',
  title: 'Echelle de dependance tabagique de Fagerstrom (FTND)',
  description: 'Test de dependance a la nicotine. 6 items, score total 0-10.',
  questions: FAGERSTROM_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional',
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
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
}

export function computeFagerstromScore(responses: FagerstromScoreInput): number {
  return responses.q1 + responses.q2 + responses.q3 + responses.q4 + responses.q5 + responses.q6;
}

// ============================================================================
// Score Interpretation
// ============================================================================

export type FagerstromDependenceLevel = 
  | 'Pas de dependance ou dependance tres faible'
  | 'Dependance faible'
  | 'Dependance moyenne'
  | 'Dependance forte';

export function getDependenceLevel(score: number): FagerstromDependenceLevel {
  if (score <= 2) return 'Pas de dependance ou dependance tres faible';
  if (score <= 4) return 'Dependance faible';
  if (score === 5) return 'Dependance moyenne';
  return 'Dependance forte';
}

export function interpretFagerstromScore(score: number, responses: FagerstromScoreInput): string {
  const dependenceLevel = getDependenceLevel(score);
  
  let interpretation = '';
  
  if (score <= 2) {
    interpretation = `Score FTND: ${score}/10. ${dependenceLevel}. Le sevrage peut etre envisage sans substitution nicotinique systematique.`;
  } else if (score <= 4) {
    interpretation = `Score FTND: ${score}/10. ${dependenceLevel}. Substitution nicotinique a faible dose peut faciliter le sevrage.`;
  } else if (score === 5) {
    interpretation = `Score FTND: ${score}/10. ${dependenceLevel}. Substitution nicotinique recommandee pour le sevrage.`;
  } else {
    interpretation = `Score FTND: ${score}/10. ${dependenceLevel}. Substitution nicotinique fortement recommandee, eventuellement associee a un accompagnement therapeutique.`;
  }

  // Add specific item interpretations
  if (responses.q1 >= 2) {
    interpretation += ' Cigarette matinale precoce (dependance physique).';
  }
  
  if (responses.q4 >= 2) {
    interpretation += ' Consommation importante (>20 cigarettes/jour).';
  }
  
  if (responses.q3 === 1) {
    interpretation += ' Premiere cigarette difficilement remplacable.';
  }

  // Clinical warnings for high scores
  if (score >= 8) {
    interpretation += ' Score tres eleve (>=8). Dependance nicotinique forte. Envisager un accompagnement au sevrage tabagique.';
  }

  if (responses.q1 === 3) {
    interpretation += ' Cigarette dans les 5 minutes apres reveil: indicateur fort de dependance physique.';
  }

  if (responses.q4 === 3) {
    interpretation += ' Consommation >=31 cigarettes/jour: risque sanitaire majeur.';
  }

  return interpretation.trim();
}

// ============================================================================
// Combined Scoring Function
// ============================================================================

export interface FagerstromScoringResult {
  total_score: number;
  dependence_level: FagerstromDependenceLevel;
  interpretation: string;
}

export function scoreFagerstrom(responses: FagerstromScoreInput): FagerstromScoringResult {
  const total_score = computeFagerstromScore(responses);
  const dependence_level = getDependenceLevel(total_score);
  const interpretation = interpretFagerstromScore(total_score, responses);

  return {
    total_score,
    dependence_level,
    interpretation
  };
}
