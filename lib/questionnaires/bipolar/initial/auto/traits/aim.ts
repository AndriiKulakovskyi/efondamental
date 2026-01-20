// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation
// AIM Questionnaire (Affect Intensity Measure)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching bipolar_aim table schema
// ============================================================================

export interface BipolarAimResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Questions 1-20
  q1?: number | null; q2?: number | null; q3?: number | null; q4?: number | null;
  q5?: number | null; q6?: number | null; q7?: number | null; q8?: number | null;
  q9?: number | null; q10?: number | null; q11?: number | null; q12?: number | null;
  q13?: number | null; q14?: number | null; q15?: number | null; q16?: number | null;
  q17?: number | null; q18?: number | null; q19?: number | null; q20?: number | null;
  
  // Scores
  total_score?: number | null;
  mean_score?: number | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarAimResponseInsert = Omit<BipolarAimResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Questions Dictionary
// ============================================================================

const AIM_OPTIONS = [
  { code: 1, label: '1 – Jamais', score: 1 },
  { code: 2, label: '2 – Presque jamais', score: 2 },
  { code: 3, label: '3 – Occasionnellement', score: 3 },
  { code: 4, label: '4 – Habituellement', score: 4 },
  { code: 5, label: '5 – Presque toujours', score: 5 },
  { code: 6, label: '6 – Toujours', score: 6 }
];

export const AIM_QUESTIONS: Question[] = [
  { id: 'q1', text: "1. Quand je suis heureux(se), c'est avec une forte exubérance.", type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q2', text: "2. Mes périodes d'humeur joyeuse sont si fortes que j'ai l'impression d'être au paradis.", type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q3', text: "3. Si je termine une tâche que je jugeais impossible à faire, je me sens en extase.", type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q4', text: '4. Les films tristes me touchent profondément.', type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q5', text: "5. Quand je suis heureux(se), c'est un sentiment d'être sans inquiétude et content(e) plutôt qu'excité et plein d'enthousiasme.", type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q6', text: "6. Quand je parle devant un groupe pour la première fois, ma voix devient tremblante et mon cœur bat vite.", type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q7', text: "7. Quand je me sens bien, c'est facile pour moi d'osciller entre des périodes de bonne humeur et des moments où je suis très joyeux(se).", type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q8', text: "8. Quand je suis heureux(se), je me sens comme si j'éclatais de joie.", type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q9', text: "9. Quand je suis heureux(se), je me sens plein d'énergie.", type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q10', text: "10. Quand je réussis quelque chose, ma réaction est une satisfaction calme.", type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q11', text: "11. Quand je fais quelque chose de mal, j'ai un sentiment très fort de culpabilité et de honte.", type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q12', text: '12. Quand les choses vont bien, je me sens comme si j\'étais "au sommet du monde".', type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q13', text: "13. Quand je sais que j'ai fait quelque chose très bien, je me sens détendu(e) et content(e) plutôt qu'excité(e) et exalté(e).", type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q14', text: "14. Quand je suis anxieux(se), c'est habituellement très fort.", type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q15', text: "15. Quand je me sens heureux(se), c'est un sentiment de bonheur calme.", type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q16', text: "16. Quand je suis heureux(se), je déborde d'énergie.", type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q17', text: "17. Quand je me sens coupable, cette émotion est forte.", type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q18', text: "18. Je décrirai mes émotions heureuses comme étant plus proches de la satisfaction que de la joie.", type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q19', text: "19. Quand je suis heureux(se), je tremble.", type: 'single_choice', required: true, options: AIM_OPTIONS },
  { id: 'q20', text: "20. Quand je suis heureux(se), mes sentiments sont plus proches de la satisfaction et du calme interne que de l'excitation et de la joie de vivre.", type: 'single_choice', required: true, options: AIM_OPTIONS }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const AIM_DEFINITION: QuestionnaireDefinition = {
  id: 'aim',
  code: 'AIM',
  title: 'AIM-20',
  description: 'Affect Intensity Measure - Version courte',
  questions: AIM_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    reverse_items: [5, 10, 13, 15, 18, 20],
    instructions: "Pour remplir ce questionnaire, basez-vous sur votre mode de fonctionnement habituel. Merci d'indiquer comment vous réagissez à ces événements en inscrivant un nombre entre 1 et 6."
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

// Items to reverse (7 - score)
const REVERSE_ITEMS = [5, 10, 13, 15, 18, 20];

export function computeAimScores(responses: Partial<BipolarAimResponse>): {
  total_score: number;
  mean_score: number;
} {
  let total = 0;
  let count = 0;
  
  for (let i = 1; i <= 20; i++) {
    const key = `q${i}` as keyof BipolarAimResponse;
    const value = responses[key] as number | null | undefined;
    
    if (value !== null && value !== undefined) {
      const adjustedValue = REVERSE_ITEMS.includes(i) ? (7 - value) : value;
      total += adjustedValue;
      count++;
    }
  }
  
  return {
    total_score: total,
    mean_score: count > 0 ? Math.round((total / count) * 100) / 100 : 0
  };
}

export function interpretAimScore(meanScore: number): string {
  // AIM mean score ranges from 1-6
  // Higher scores indicate greater affect intensity
  if (meanScore <= 2.5) return 'Intensité affective faible';
  if (meanScore <= 3.5) return 'Intensité affective normale';
  if (meanScore <= 4.5) return 'Intensité affective élevée';
  return 'Intensité affective très élevée';
}
