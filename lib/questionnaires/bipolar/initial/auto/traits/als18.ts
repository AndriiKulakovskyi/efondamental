// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation
// ALS-18 Questionnaire (Affective Lability Scale - Short Form)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching bipolar_als18 table schema
// ============================================================================

export interface BipolarAls18Response {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Questions 1-18
  q1?: number | null; q2?: number | null; q3?: number | null; q4?: number | null;
  q5?: number | null; q6?: number | null; q7?: number | null; q8?: number | null;
  q9?: number | null; q10?: number | null; q11?: number | null; q12?: number | null;
  q13?: number | null; q14?: number | null; q15?: number | null; q16?: number | null;
  q17?: number | null; q18?: number | null;
  
  // Subscale scores
  anxiety_depression_score?: number | null;
  depression_elation_score?: number | null;
  anger_score?: number | null;
  total_score?: number | null;
  interpretation?: string | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarAls18ResponseInsert = Omit<BipolarAls18Response, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Questions Dictionary
// ============================================================================

const ALS_OPTIONS = [
  { code: 0, label: 'D – Absolument pas caractéristique de moi', score: 0 },
  { code: 1, label: 'C – Assez peu caractéristique de moi', score: 1 },
  { code: 2, label: 'B – Assez caractéristique de moi', score: 2 },
  { code: 3, label: 'A – Très caractéristique de moi', score: 3 }
];

export const ALS18_QUESTIONS: Question[] = [
  { id: 'q1', text: "1. À certains moments, je me sens aussi détendu(e) que n'importe qui, et en quelques minutes, je deviens si nerveux(se) que j'ai l'impression d'avoir la tête vide et d'avoir un vertige.", type: 'single_choice', required: true, options: ALS_OPTIONS },
  { id: 'q2', text: "2. Il y a des moments où j'ai très peu d'énergie, et peu de temps après, j'ai autant d'énergie que la plupart des gens.", type: 'single_choice', required: true, options: ALS_OPTIONS },
  { id: 'q3', text: "3. Durant une minute, je peux penser me sentir très bien, et la minute suivante, je suis tendu(e), je réagis à la moindre chose et je suis nerveux(se).", type: 'single_choice', required: true, options: ALS_OPTIONS },
  { id: 'q4', text: "4. J'oscille souvent entre des moments où je contrôle très bien mon humeur à des moments où je ne la contrôle plus du tout.", type: 'single_choice', required: true, options: ALS_OPTIONS },
  { id: 'q5', text: "5. Très souvent, je me sens très nerveux(se) et tendu(e), et ensuite soudainement, je me sens très triste et abattu(e).", type: 'single_choice', required: true, options: ALS_OPTIONS },
  { id: 'q6', text: "6. Quelque fois je passe de sentiments très anxieux au sujet de quelque chose à des sentiments très tristes à leur propos.", type: 'single_choice', required: true, options: ALS_OPTIONS },
  { id: 'q7', text: "7. J'oscille entre des moments où je me sens parfaitement calme à des moments où je me sens très tendu(e) et nerveux(se).", type: 'single_choice', required: true, options: ALS_OPTIONS },
  { id: 'q8', text: "8. Il y a des moments où je me sens parfaitement calme durant une minute, et la minute suivante, la moindre chose me rend furieux(se).", type: 'single_choice', required: true, options: ALS_OPTIONS },
  { id: 'q9', text: "9. Fréquemment, je me sens OK, mais ensuite tout d'un coup, je deviens si fou que je pourrais frapper quelque chose.", type: 'single_choice', required: true, options: ALS_OPTIONS },
  { id: 'q10', text: "10. Souvent, je peux penser clairement et bien me concentrer pendant une minute, et la minute suivante, j'ai beaucoup de difficultés à me concentrer et à penser clairement.", type: 'single_choice', required: true, options: ALS_OPTIONS },
  { id: 'q11', text: "11. Il y a des moments où je me sens si furieux(se) que je ne peux pas m'arrêter de hurler après les autres, et peu de temps après, je ne pense plus du tout à crier après eux.", type: 'single_choice', required: true, options: ALS_OPTIONS },
  { id: 'q12', text: "12. J'oscille entre des périodes où je me sens plein d'énergie et d'autres où j'ai si peu d'énergie que c'est un énorme effort juste d'aller là où je dois aller.", type: 'single_choice', required: true, options: ALS_OPTIONS },
  { id: 'q13', text: "13. Il y a des moments où je me sens absolument admirable et d'autres juste après où je me sens exactement comme n'importe qui d'autre.", type: 'single_choice', required: true, options: ALS_OPTIONS },
  { id: 'q14', text: "14. Il y a des moments où je me sens tellement furieux(se) que mon cœur bat très fort et/ou je tremble, et des autres peu après, où je me sens détendu(e).", type: 'single_choice', required: true, options: ALS_OPTIONS },
  { id: 'q15', text: "15. J'oscille entre n'être pas productif(ve) à des périodes où je suis aussi productif(ve) que tout le monde.", type: 'single_choice', required: true, options: ALS_OPTIONS },
  { id: 'q16', text: "16. Quelque fois, j'ai beaucoup d'énergie une minute, et la minute suivante, j'ai tellement peu d'énergie que je ne peux presque rien faire.", type: 'single_choice', required: true, options: ALS_OPTIONS },
  { id: 'q17', text: "17. Il y a des moments où j'ai plus d'énergie que d'habitude et plus que la plupart des gens, et rapidement après, j'ai à peu près le même niveau d'énergie que n'importe qui d'autre.", type: 'single_choice', required: true, options: ALS_OPTIONS },
  { id: 'q18', text: "18. À certains moments, j'ai l'impression de tout faire très lentement, et très rapidement après, j'ai l'impression de ne pas être plus lent que quelqu'un d'autre.", type: 'single_choice', required: true, options: ALS_OPTIONS }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const ALS18_DEFINITION: QuestionnaireDefinition = {
  id: 'als18',
  code: 'ALS18',
  title: 'ALS-18',
  description: 'Affective Lability Scale - Version courte',
  questions: ALS18_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    instructions: "Pour remplir ce questionnaire, basez-vous sur votre mode de fonctionnement habituel, c'est à dire en dehors des périodes où votre humeur est anormalement dépressive ou euphorique/exaltée.",
    subscales: {
      anxiety_depression: [1, 3, 5, 6, 7],
      depression_elation: [2, 10, 12, 13, 15, 16, 17, 18],
      anger: [4, 8, 9, 11, 14]
    }
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

const SUBSCALES = {
  anxiety_depression: [1, 3, 5, 6, 7],
  depression_elation: [2, 10, 12, 13, 15, 16, 17, 18],
  anger: [4, 8, 9, 11, 14]
};

export interface Als18ScoreResult {
  anxiety_depression_score: number;
  depression_elation_score: number;
  anger_score: number;
  total_score: number;
  interpretation: string;
}

export function computeAls18Scores(responses: Partial<BipolarAls18Response>): Als18ScoreResult {
  const getValue = (itemNum: number): number => {
    const key = `q${itemNum}` as keyof BipolarAls18Response;
    const value = responses[key] as number | null | undefined;
    return value ?? 0;
  };
  
  const anxietyDepressionScore = SUBSCALES.anxiety_depression.reduce((sum, item) => sum + getValue(item), 0);
  const depressionElationScore = SUBSCALES.depression_elation.reduce((sum, item) => sum + getValue(item), 0);
  const angerScore = SUBSCALES.anger.reduce((sum, item) => sum + getValue(item), 0);
  const totalScore = anxietyDepressionScore + depressionElationScore + angerScore;
  
  return {
    anxiety_depression_score: anxietyDepressionScore,
    depression_elation_score: depressionElationScore,
    anger_score: angerScore,
    total_score: totalScore,
    interpretation: interpretAls18Score(totalScore)
  };
}

export function interpretAls18Score(totalScore: number): string {
  // ALS-18 total score ranges from 0-54
  // Higher scores indicate greater apathy
  if (totalScore <= 13) return 'Absence d\'apathie';
  if (totalScore <= 25) return 'Apathie légère à modérée';
  return 'Apathie marquée/sévère';
}

export function getAls18ClinicalGuidance(totalScore: number): string {
  if (totalScore <= 13) {
    return 'Motivation globalement préservée. Les variations observées peuvent relever de la fatigue, du contexte ou de facteurs situationnels.';
  }
  if (totalScore <= 25) {
    return 'Baisse d\'initiative, réduction de l\'engagement dans les activités quotidiennes, effort moindre pour démarrer ou maintenir une action. Retentissement fonctionnel possible mais partiel.';
  }
  return 'Désengagement important, passivité, émoussement motivationnel net. Retentissement fonctionnel clair (autonomie, relations, activités). Profil compatible avec une apathie cliniquement centrale, souvent indépendante de la symptomatologie thymique aiguë.';
}
