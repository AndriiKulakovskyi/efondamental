// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation
// BIS-10 Questionnaire (Barratt Impulsiveness Scale - Short Form)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching bipolar_bis10 table schema
// ============================================================================

export interface BipolarBis10Response {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Questions 1-12
  q1?: number | null; q2?: number | null; q3?: number | null; q4?: number | null;
  q5?: number | null; q6?: number | null; q7?: number | null; q8?: number | null;
  q9?: number | null; q10?: number | null; q11?: number | null; q12?: number | null;
  
  // Scores
  cognitive_impulsivity_score?: number | null;
  motor_impulsivity_score?: number | null;
  total_score?: number | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarBis10ResponseInsert = Omit<BipolarBis10Response, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Questions Dictionary
// ============================================================================

const BIS_OPTIONS = [
  { code: 1, label: 'Rarement ou jamais', score: 1 },
  { code: 2, label: 'Occasionnellement', score: 2 },
  { code: 3, label: 'Souvent', score: 3 },
  { code: 4, label: 'Toujours ou presque toujours', score: 4 }
];

export const BIS10_QUESTIONS: Question[] = [
  { id: 'q1', text: "1. Je prépare soigneusement les tâches à accomplir", type: 'single_choice', required: true, options: BIS_OPTIONS },
  { id: 'q2', text: "6. J'ai des idées qui fusent", type: 'single_choice', required: true, options: BIS_OPTIONS },
  { id: 'q3', text: "8. Je suis maître de moi", type: 'single_choice', required: true, options: BIS_OPTIONS },
  { id: 'q4', text: "9. Je me concentre facilement", type: 'single_choice', required: true, options: BIS_OPTIONS },
  { id: 'q5', text: "12. Je réfléchis soigneusement", type: 'single_choice', required: true, options: BIS_OPTIONS },
  { id: 'q6', text: "14. Je dis les choses sans y penser", type: 'single_choice', required: true, options: BIS_OPTIONS },
  { id: 'q7', text: "17. J'agis sur un coup de tête", type: 'single_choice', required: true, options: BIS_OPTIONS },
  { id: 'q8', text: "20. J'agis selon l'inspiration du moment", type: 'single_choice', required: true, options: BIS_OPTIONS },
  { id: 'q9', text: "21. Je suis quelqu'un de réfléchi", type: 'single_choice', required: true, options: BIS_OPTIONS },
  { id: 'q10', text: "23. J'achète les choses sur un coup de tête", type: 'single_choice', required: true, options: BIS_OPTIONS },
  { id: 'q11', text: "25. Je change de passe-temps", type: 'single_choice', required: true, options: BIS_OPTIONS },
  { id: 'q12', text: "28. Je dépense ou paye à crédit plus que je ne gagne", type: 'single_choice', required: true, options: BIS_OPTIONS }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const BIS10_DEFINITION: QuestionnaireDefinition = {
  id: 'bis10',
  code: 'BIS10_FR',
  title: 'BIS-10 - Barratt Impulsiveness Scale (Short Form)',
  description: "Échelle d'impulsivité de Barratt - Version courte (12 items)",
  questions: BIS10_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    instructions: "Les gens agissent et réfléchissent différemment devant des situations variées. Ce questionnaire a pour but d'évaluer certaines de vos façons d'agir et de réfléchir. Lisez chaque énoncé et remplissez la case appropriée située sur la droite de la page. Ne passez pas trop de temps sur chaque énoncé. Répondez vite et honnêtement.",
    reverse_items: [1, 3, 4, 5, 9],
    subscales: {
      cognitive_impulsivity: [1, 3, 4, 5, 9],
      motor_impulsivity: [2, 6, 7, 8, 10, 11, 12]
    }
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

// Items to reverse (5 - score)
const REVERSE_ITEMS = [1, 3, 4, 5, 9];

// Subscale mappings
const COGNITIVE_ITEMS = [1, 3, 4, 5, 9];
const MOTOR_ITEMS = [2, 6, 7, 8, 10, 11, 12];

export function computeBis10Scores(responses: Partial<BipolarBis10Response>): {
  cognitive_impulsivity_score: number;
  motor_impulsivity_score: number;
  total_score: number;
} {
  const getAdjustedValue = (itemNum: number): number => {
    const key = `q${itemNum}` as keyof BipolarBis10Response;
    const value = responses[key] as number | null | undefined;
    if (value === null || value === undefined) return 0;
    return REVERSE_ITEMS.includes(itemNum) ? (5 - value) : value;
  };
  
  const cognitiveScore = COGNITIVE_ITEMS.reduce((sum, item) => sum + getAdjustedValue(item), 0);
  const motorScore = MOTOR_ITEMS.reduce((sum, item) => sum + getAdjustedValue(item), 0);
  
  return {
    cognitive_impulsivity_score: cognitiveScore,
    motor_impulsivity_score: motorScore,
    total_score: cognitiveScore + motorScore
  };
}

export function interpretBis10Score(totalScore: number): string {
  // BIS-10 total score ranges from 12-48
  // Higher scores indicate greater impulsivity
  if (totalScore <= 20) return 'Faible impulsivité';
  if (totalScore <= 28) return 'Impulsivité normale';
  if (totalScore <= 36) return 'Impulsivité modérée';
  return 'Haute impulsivité';
}
