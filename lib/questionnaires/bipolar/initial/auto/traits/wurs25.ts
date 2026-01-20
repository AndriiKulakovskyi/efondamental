// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation
// WURS-25 Questionnaire (Wender Utah Rating Scale - Short Form)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching bipolar_wurs25 table schema
// ============================================================================

export interface BipolarWurs25Response {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Questions 1-25
  q1?: number | null; q2?: number | null; q3?: number | null; q4?: number | null;
  q5?: number | null; q6?: number | null; q7?: number | null; q8?: number | null;
  q9?: number | null; q10?: number | null; q11?: number | null; q12?: number | null;
  q13?: number | null; q14?: number | null; q15?: number | null; q16?: number | null;
  q17?: number | null; q18?: number | null; q19?: number | null; q20?: number | null;
  q21?: number | null; q22?: number | null; q23?: number | null; q24?: number | null;
  q25?: number | null;
  
  // Scores
  total_score?: number | null;
  screening_positive?: boolean | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarWurs25ResponseInsert = Omit<BipolarWurs25Response, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Questions Dictionary
// ============================================================================

const WURS_OPTIONS = [
  { code: 0, label: 'Pas du tout, ou très légèrement', score: 0 },
  { code: 1, label: 'Légèrement', score: 1 },
  { code: 2, label: 'Modérément', score: 2 },
  { code: 3, label: 'Assez', score: 3 },
  { code: 4, label: 'Beaucoup', score: 4 }
];

export const WURS25_QUESTIONS: Question[] = [
  { id: 'q1', text: "3. Des problèmes de concentration, facilement distrait (e)", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q2', text: "4. Anxieux (se), se faisant du souci", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q3', text: "5. Nerveux (se), ne tenant pas en place", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q4', text: "6. Inattentif (ve), rêveur (se)", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q5', text: "7. Facilement en colère, « soupe au lait »", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q6', text: "9. Des éclats d'humeur, des accès de colère", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q7', text: "10. Des difficultés à me tenir aux choses, à mener mes projets jusqu'à la fin", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q8', text: "11. Têtu (e), obstiné (e)", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q9', text: "12. Triste ou cafardeux (se), déprimé (e), malheureux (se)", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q10', text: "15. Désobéissant (e) à mes parents, rebelle, effronté (e)", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q11', text: "16. Une mauvaise opinion de moi-même", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q12', text: "17. Irritable", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q13', text: "20. D'humeur changeante, avec des hauts et des bas", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q14', text: "21. En colère", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q15', text: "24. Impulsif (ve), agissant sans réfléchir", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q16', text: "25. Tendance à être immature", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q17', text: "26. Culpabilisé (e), plein (e) de regrets", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q18', text: "27. Une perte du contrôle de moi-même", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q19', text: "28. Tendance à être ou à agir de façon irrationnelle", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q20', text: "29. Impopulaire auprès des autres enfants, ne gardant pas longtemps mes amis", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q21', text: "40. Du mal à voir les choses du point de vue de quelqu'un d'autre", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q22', text: "41. Des ennuis avec les autorités, l'école, convoqué (e) au bureau du proviseur", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q23', text: "51. Dans l'ensemble un (e) mauvais (e) élève, apprenant lentement", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q24', text: "56. Des difficultés en mathématiques ou avec les chiffres", type: 'single_choice', required: true, options: WURS_OPTIONS },
  { id: 'q25', text: "59. En dessous de son potentiel", type: 'single_choice', required: true, options: WURS_OPTIONS }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const WURS25_DEFINITION: QuestionnaireDefinition = {
  id: 'wurs25',
  code: 'WURS25',
  title: 'WURS-25',
  description: "Echelle de Wender Utah - Version courte (25 items)",
  questions: WURS25_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    instructions: "Ce questionnaire porte sur votre enfance et adolescence. Pour chaque item, indiquez dans quelle mesure chaque description s'appliquait à vous avant l'âge de 12 ans.\n\nComme enfant j'étais (ou j'avais) :",
    timeframe: "Avant l'âge de 12 ans",
    cutoff_score: 36
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

const CUTOFF_SCORE = 36;

export function computeWurs25Scores(responses: Partial<BipolarWurs25Response>): {
  total_score: number;
  screening_positive: boolean;
} {
  let total = 0;
  
  for (let i = 1; i <= 25; i++) {
    const key = `q${i}` as keyof BipolarWurs25Response;
    const value = responses[key] as number | null | undefined;
    if (value !== null && value !== undefined) {
      total += value;
    }
  }
  
  return {
    total_score: total,
    screening_positive: total >= CUTOFF_SCORE
  };
}

export function interpretWurs25Score(totalScore: number): string {
  // WURS-25 total score ranges from 0-100
  // Cutoff score of 36 suggests childhood ADHD
  if (totalScore < 36) return 'Pas de TDAH dans l\'enfance suggéré';
  if (totalScore < 50) return 'TDAH dans l\'enfance probable';
  if (totalScore < 70) return 'TDAH dans l\'enfance très probable';
  return 'TDAH dans l\'enfance hautement probable';
}
