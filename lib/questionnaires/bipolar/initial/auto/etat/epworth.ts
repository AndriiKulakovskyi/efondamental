// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation
// Epworth Questionnaire (Epworth Sleepiness Scale)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching bipolar_epworth table schema
// ============================================================================

export interface BipolarEpworthResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Questions 1-8 (each scored 0-3)
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
  q5?: number | null;
  q6?: number | null;
  q7?: number | null;
  q8?: number | null;
  
  // Optional question 9
  q9?: number | null;
  
  // Total score
  total_score?: number | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarEpworthResponseInsert = Omit<BipolarEpworthResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Questions Dictionary
// ============================================================================

const SLEEPINESS_OPTIONS = [
  { code: 0, label: '0 – ne somnolerait jamais', score: 0 },
  { code: 1, label: "1 – faible chance de s'endormir", score: 1 },
  { code: 2, label: "2 – chance moyenne de s'endormir", score: 2 },
  { code: 3, label: "3 – forte chance de s'endormir", score: 3 }
];

export const EPWORTH_QUESTIONS: Question[] = [
  {
    id: 'instructions',
    text: 'Échelle de Somnolence d\'Epworth',
    type: 'section',
    required: false,
    help: "Vous arrive-t-il de somnoler ou de vous endormir - et pas seulement de vous sentir fatigué - dans les situations suivantes ? Cette question s'adresse à votre vie dans les mois derniers.\nMême si vous ne vous êtes pas trouvé récemment dans l'une des situations suivantes, essayez de vous représenter comme elles auraient pu vous affecter.\nChoisissez dans l'échelle suivante le nombre le plus approprié à chaque situation :"
  },
  { id: 'q1', text: '1. Assis en train de lire', type: 'single_choice', required: true, options: SLEEPINESS_OPTIONS },
  { id: 'q2', text: '2. En train de regarder la télévision', type: 'single_choice', required: true, options: SLEEPINESS_OPTIONS },
  { id: 'q3', text: '3. Assis, inactif, dans un endroit public (au théâtre, en réunion)', type: 'single_choice', required: true, options: SLEEPINESS_OPTIONS },
  { id: 'q4', text: '4. Comme passager dans une voiture roulant sans arrêt pendant une heure', type: 'single_choice', required: true, options: SLEEPINESS_OPTIONS },
  { id: 'q5', text: "5. Allongé l'après-midi pour se reposer quand les circonstances le permettent", type: 'single_choice', required: true, options: SLEEPINESS_OPTIONS },
  { id: 'q6', text: "6. Assis en train de parler à quelqu'un", type: 'single_choice', required: true, options: SLEEPINESS_OPTIONS },
  { id: 'q7', text: '7. Assis calmement après un repas sans alcool', type: 'single_choice', required: true, options: SLEEPINESS_OPTIONS },
  { id: 'q8', text: '8. Dans une auto immobilisée quelques minutes dans un encombrement', type: 'single_choice', required: true, options: SLEEPINESS_OPTIONS },
  { id: 'q9', text: '9. Ces envies de dormir surviennent-elles ?', type: 'single_choice', required: false, options: [
    { code: 0, label: 'seulement après les repas', score: 0 },
    { code: 1, label: 'à certaines heures du jour, toujours les mêmes', score: 1 },
    { code: 2, label: 'la nuit', score: 2 },
    { code: 3, label: "n'importe quelle heure du jour", score: 3 }
  ]}
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const EPWORTH_DEFINITION: QuestionnaireDefinition = {
  id: 'epworth',
  code: 'EPWORTH',
  title: 'Epworth',
  description: 'Échelle de Somnolence d\'Epworth',
  instructions: "Vous arrive-t-il de somnoler ou de vous endormir - et pas seulement de vous sentir fatigué - dans les situations suivantes ? Cette question s'adresse à votre vie dans les mois derniers.\nMême si vous ne vous êtes pas trouvé récemment dans l'une des situations suivantes, essayez de vous représenter comme elles auraient pu vous affecter.\nChoisissez dans l'échelle suivante le nombre le plus approprié à chaque situation :",
  questions: EPWORTH_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient'
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

export function computeEpworthScore(responses: Partial<BipolarEpworthResponse>): number {
  // Sum of questions 1-8 (q9 is not included in the total score)
  let totalScore = 0;
  
  for (let i = 1; i <= 8; i++) {
    const qKey = `q${i}` as keyof BipolarEpworthResponse;
    const value = responses[qKey] as number | null | undefined;
    if (value !== null && value !== undefined) {
      totalScore += value;
    }
  }
  
  return totalScore;
}

export function interpretEpworthScore(totalScore: number): {
  level: string;
  description: string;
} {
  // Epworth total score ranges from 0-24
  // 0-5: Lower Normal Daytime Sleepiness
  // 6-10: Higher Normal Daytime Sleepiness
  // 11-12: Mild Excessive Daytime Sleepiness
  // 13-15: Moderate Excessive Daytime Sleepiness
  // 16-24: Severe Excessive Daytime Sleepiness
  
  if (totalScore <= 5) {
    return {
      level: 'normal_low',
      description: 'Somnolence diurne normale basse'
    };
  }
  if (totalScore <= 10) {
    return {
      level: 'normal_high',
      description: 'Somnolence diurne normale haute'
    };
  }
  if (totalScore <= 12) {
    return {
      level: 'mild',
      description: 'Somnolence diurne excessive légère'
    };
  }
  if (totalScore <= 15) {
    return {
      level: 'moderate',
      description: 'Somnolence diurne excessive modérée'
    };
  }
  return {
    level: 'severe',
    description: 'Somnolence diurne excessive sévère'
  };
}

export function interpretEpworthScoreSimple(totalScore: number): string {
  const result = interpretEpworthScore(totalScore);
  return result.description;
}
