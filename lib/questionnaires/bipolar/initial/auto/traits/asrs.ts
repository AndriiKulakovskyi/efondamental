// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation
// ASRS Questionnaire (Adult ADHD Self-Report Scale)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching bipolar_asrs table schema
// ============================================================================

export interface BipolarAsrsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Part A questions (a1-a6)
  a1?: number | null;
  a2?: number | null;
  a3?: number | null;
  a4?: number | null;
  a5?: number | null;
  a6?: number | null;
  
  // Part B questions (b7-b18)
  b7?: number | null;
  b8?: number | null;
  b9?: number | null;
  b10?: number | null;
  b11?: number | null;
  b12?: number | null;
  b13?: number | null;
  b14?: number | null;
  b15?: number | null;
  b16?: number | null;
  b17?: number | null;
  b18?: number | null;
  
  // Scores
  part_a_score?: number | null;
  part_b_score?: number | null;
  total_score?: number | null;
  screening_positive?: boolean | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarAsrsResponseInsert = Omit<BipolarAsrsResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Questions Dictionary
// ============================================================================

const ASRS_OPTIONS = [
  { code: 0, label: 'Jamais', score: 0 },
  { code: 1, label: 'Rarement', score: 1 },
  { code: 2, label: 'Quelquefois', score: 2 },
  { code: 3, label: 'Souvent', score: 3 },
  { code: 4, label: 'Très souvent', score: 4 }
];

export const ASRS_QUESTIONS: Question[] = [
  { id: 'section_part_a', text: 'PARTIE A', type: 'section', required: false },
  { id: 'a1', section: 'PARTIE A', text: "1. A quelle fréquence vous arrive-t-il d'avoir des difficultés à finaliser les derniers détails d'un projet une fois que les parties les plus stimulantes ont été faites ?", type: 'single_choice', required: true, options: ASRS_OPTIONS },
  { id: 'a2', section: 'PARTIE A', text: "2. A quelle fréquence vous arrive-t-il d'avoir des difficultés à mettre les choses en ordre lorsque vous devez faire quelque chose qui demande de l'organisation ?", type: 'single_choice', required: true, options: ASRS_OPTIONS },
  { id: 'a3', section: 'PARTIE A', text: "3. A quelle fréquence vous arrive-t-il d'avoir des difficultés à vous rappeler vos rendez-vous ou vos obligations ?", type: 'single_choice', required: true, options: ASRS_OPTIONS },
  { id: 'a4', section: 'PARTIE A', text: "4. Quand vous devez faire quelque chose qui demande beaucoup de réflexion, à quelle fréquence vous arrive-t-il d'éviter de le faire ou de le remettre à plus tard ?", type: 'single_choice', required: true, options: ASRS_OPTIONS },
  { id: 'a5', section: 'PARTIE A', text: "5. A quelle fréquence vous arrive-t-il de remuer ou de tortiller les mains ou les pieds lorsque vous devez rester assis pendant une période prolongée ?", type: 'single_choice', required: true, options: ASRS_OPTIONS },
  { id: 'a6', section: 'PARTIE A', text: "6. A quelle fréquence vous arrive-t-il de vous sentir excessivement actif et contraint de faire quelque chose, comme si vous étiez entraîné malgré vous par un moteur ?", type: 'single_choice', required: true, options: ASRS_OPTIONS },
  
  { id: 'section_part_b', text: 'PARTIE B', type: 'section', required: false },
  { id: 'b7', section: 'PARTIE B', text: "7. Avec quelle fréquence faites-vous des erreurs d'étourderie lorsque vous travaillez sur un projet ennuyeux ou difficile?", type: 'single_choice', required: true, options: ASRS_OPTIONS },
  { id: 'b8', section: 'PARTIE B', text: "8. Avec quelle fréquence avez-vous des difficultés à rester attentif lorsque vous faites un travail ennuyeux ou répétitif?", type: 'single_choice', required: true, options: ASRS_OPTIONS },
  { id: 'b9', section: 'PARTIE B', text: "9. A quelle fréquence vous arrive-t-il d'avoir des difficultés à vous concentrer sur les propos de votre interlocuteur, même s'il s'adresse directement à vous?", type: 'single_choice', required: true, options: ASRS_OPTIONS },
  { id: 'b10', section: 'PARTIE B', text: "10. A la maison ou au travail, à quelle fréquence vous arrive-t-il d'égarer des choses ou d'avoir des difficultés à les retrouver?", type: 'single_choice', required: true, options: ASRS_OPTIONS },
  { id: 'b11', section: 'PARTIE B', text: "11. Avec quelle fréquence êtes-vous distrait par de l'activité ou du bruit autour de vous?", type: 'single_choice', required: true, options: ASRS_OPTIONS },
  { id: 'b12', section: 'PARTIE B', text: "12. A quelle fréquence vous arrive-t-il de quitter votre siège pendant des réunions ou d'autres situations ou vous devriez rester assis?", type: 'single_choice', required: true, options: ASRS_OPTIONS },
  { id: 'b13', section: 'PARTIE B', text: "13. A quelle fréquence vous arrive-t-il d'avoir des difficultés à vous tenir tranquille?", type: 'single_choice', required: true, options: ASRS_OPTIONS },
  { id: 'b14', section: 'PARTIE B', text: "14. Avec quelle fréquence avez-vous des difficultés à vous détendre et à vous reposer pendant votre temps libre?", type: 'single_choice', required: true, options: ASRS_OPTIONS },
  { id: 'b15', section: 'PARTIE B', text: "15. A quelle fréquence vous arrive-t-il de parler de façon excessive à l'occasion de rencontres sociales?", type: 'single_choice', required: true, options: ASRS_OPTIONS },
  { id: 'b16', section: 'PARTIE B', text: "16. Pendant une conversation, à quelle fréquence vous arrive-t-il de terminer les phrases de vos interlocuteurs avant que ces derniers aient le temps de les finir?", type: 'single_choice', required: true, options: ASRS_OPTIONS },
  { id: 'b17', section: 'PARTIE B', text: "17. A quelle fréquence vous arrive-t-il d'avoir des difficultés à attendre votre tour lorsque vous devriez le faire?", type: 'single_choice', required: true, options: ASRS_OPTIONS },
  { id: 'b18', section: 'PARTIE B', text: "18. A quelle fréquence vous arrive-t-il d'interrompre les gens lorsqu'ils sont occupés?", type: 'single_choice', required: true, options: ASRS_OPTIONS }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const ASRS_DEFINITION: QuestionnaireDefinition = {
  id: 'asrs',
  code: 'ASRS',
  title: 'ASRS - Adult ADHD Self-Report Scale',
  description: "Échelle d'auto-évaluation du trouble déficitaire de l'attention avec/sans hyperactivité chez l'adulte",
  questions: ASRS_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    part_a_thresholds: { a1: 2, a2: 2, a3: 2, a4: 3, a5: 3, a6: 3 },
    instructions: "Cochez la case qui décrit le mieux ce que vous avez ressenti et comment vous vous êtes comporté au cours des 6 derniers mois. Veuillez remettre le questionnaire rempli à votre médecin ou un autre professionnel lors de votre prochain rendez-vous afin d'en discuter les résultats."
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

// Part A scoring thresholds (items that count toward screening)
const PART_A_THRESHOLDS: Record<string, number> = {
  a1: 2, // Quelquefois or higher
  a2: 2, // Quelquefois or higher
  a3: 2, // Quelquefois or higher
  a4: 3, // Souvent or higher
  a5: 3, // Souvent or higher
  a6: 3  // Souvent or higher
};

export function computeAsrsScores(responses: Partial<BipolarAsrsResponse>): {
  part_a_score: number;
  part_b_score: number;
  total_score: number;
  screening_positive: boolean;
} {
  let partAScore = 0;
  let partBScore = 0;
  let screeningCount = 0;
  
  // Part A (a1-a6)
  for (let i = 1; i <= 6; i++) {
    const key = `a${i}` as keyof BipolarAsrsResponse;
    const value = responses[key] as number | null | undefined;
    if (value !== null && value !== undefined) {
      partAScore += value;
      // Check if this item meets the screening threshold
      if (value >= PART_A_THRESHOLDS[key]) {
        screeningCount++;
      }
    }
  }
  
  // Part B (b7-b18)
  for (let i = 7; i <= 18; i++) {
    const key = `b${i}` as keyof BipolarAsrsResponse;
    const value = responses[key] as number | null | undefined;
    if (value !== null && value !== undefined) {
      partBScore += value;
    }
  }
  
  return {
    part_a_score: partAScore,
    part_b_score: partBScore,
    total_score: partAScore + partBScore,
    screening_positive: screeningCount >= 4 // 4 or more items above threshold
  };
}

export function interpretAsrsScore(screeningPositive: boolean, totalScore: number): string {
  if (screeningPositive) {
    return 'Dépistage positif pour TDAH - évaluation clinique recommandée';
  }
  if (totalScore >= 36) {
    return 'Symptômes TDAH significatifs';
  }
  if (totalScore >= 24) {
    return 'Symptômes TDAH modérés';
  }
  return 'Pas de symptômes TDAH significatifs';
}
