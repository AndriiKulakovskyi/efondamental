// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation
// CTI Questionnaire (Circadian Type Inventory)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching bipolar_cti table schema
// ============================================================================

export interface BipolarCtiResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Questions 1-30 (CTI has 30 questions)
  q1?: number | null; q2?: number | null; q3?: number | null; q4?: number | null;
  q5?: number | null; q6?: number | null; q7?: number | null; q8?: number | null;
  q9?: number | null; q10?: number | null; q11?: number | null; q12?: number | null;
  q13?: number | null; q14?: number | null; q15?: number | null; q16?: number | null;
  q17?: number | null; q18?: number | null; q19?: number | null; q20?: number | null;
  q21?: number | null; q22?: number | null; q23?: number | null; q24?: number | null;
  q25?: number | null; q26?: number | null; q27?: number | null; q28?: number | null;
  q29?: number | null; q30?: number | null;
  
  // Subscale scores
  flexibility_score?: number | null;
  languid_score?: number | null;
  total_score?: number | null;
  circadian_type?: string | null;
  interpretation?: string | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarCtiResponseInsert = Omit<BipolarCtiResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Questions Dictionary
// ============================================================================

const CTI_OPTIONS = [
  { code: 1, label: '1 – Presque jamais', score: 1 },
  { code: 2, label: '2 – Rarement', score: 2 },
  { code: 3, label: '3 – Parfois', score: 3 },
  { code: 4, label: '4 – En général', score: 4 },
  { code: 5, label: '5 – Presque toujours', score: 5 }
];

export const CTI_QUESTIONS: Question[] = [
  { id: 'q1', text: '1. Avez-vous tendance à avoir besoin de plus de sommeil que les autres personnes ?', type: 'single_choice', required: true, options: CTI_OPTIONS },
  { id: 'q2', text: "2. Si vous aviez à faire un certain travail au milieu de la nuit, pensez-vous que vous pourriez le faire presque aussi facilement qu'à une heure plus normale de la journée ?", type: 'single_choice', required: true, options: CTI_OPTIONS },
  { id: 'q3', text: "3. Est-ce que vous trouvez qu'il est difficile de vous réveiller correctement si vous êtes réveillé à une heure inhabituelle ?", type: 'single_choice', required: true, options: CTI_OPTIONS },
  { id: 'q4', text: '4. Aimez-vous travailler à des heures inhabituelles du jour ou de la nuit ?', type: 'single_choice', required: true, options: CTI_OPTIONS },
  { id: 'q5', text: '5. Si vous allez au lit très tard, avez-vous besoin de dormir plus tard le lendemain matin ?', type: 'single_choice', required: true, options: CTI_OPTIONS },
  { id: 'q6', text: "6. Si vous avez beaucoup à faire, pouvez-vous travailler tard le soir pour terminer sans être trop fatigué ?", type: 'single_choice', required: true, options: CTI_OPTIONS },
  { id: 'q7', text: '7. Vous sentez-vous endormi pendant un certain temps après le réveil le matin ?', type: 'single_choice', required: true, options: CTI_OPTIONS },
  { id: 'q8', text: '8. Trouvez-vous aussi facile de travailler tard la nuit que tôt le matin ?', type: 'single_choice', required: true, options: CTI_OPTIONS },
  { id: 'q9', text: '9. Si vous devez vous lever très tôt un matin, avez-vous tendance à vous sentir fatigué toute la journée ?', type: 'single_choice', required: true, options: CTI_OPTIONS },
  { id: 'q10', text: '10. Seriez-vous aussi content de faire quelque chose au milieu de la nuit que pendant la journée ?', type: 'single_choice', required: true, options: CTI_OPTIONS },
  { id: 'q11', text: "11. Devez-vous compter sur un réveil, ou sur quelqu'un d'autre, pour vous réveiller le matin ?", type: 'single_choice', required: true, options: CTI_OPTIONS }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const CTI_DEFINITION: QuestionnaireDefinition = {
  id: 'cti',
  code: 'CTI',
  title: 'CTI',
  description: 'Inventaire du Type Circadien',
  questions: CTI_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    instructions: "Les questions suivantes concernent vos habitudes quotidiennes et vos préférences. Merci d'indiquer ce que vous préférez faire ou pouvez faire mais pas ce que vous êtes forcés de faire en raison d'engagements professionnels.",
    subscales: {
      flexibility: [2, 4, 6, 8, 10],
      languid: [1, 3, 5, 7, 9, 11]
    }
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

// Subscale item mappings (for 11-item version)
const FLEXIBILITY_ITEMS = [2, 4, 6, 8, 10];
const LANGUID_ITEMS = [1, 3, 5, 7, 9, 11];

export interface CtiScoreResult {
  flexibility_score: number;
  languid_score: number;
  total_score: number;
  circadian_type: string;
  interpretation: string;
}

export function computeCtiScores(responses: Partial<BipolarCtiResponse>): CtiScoreResult {
  const getValue = (itemNum: number): number => {
    const key = `q${itemNum}` as keyof BipolarCtiResponse;
    const value = responses[key] as number | null | undefined;
    return value ?? 0;
  };
  
  const flexibilityScore = FLEXIBILITY_ITEMS.reduce((sum, item) => sum + getValue(item), 0);
  const languidScore = LANGUID_ITEMS.reduce((sum, item) => sum + getValue(item), 0);
  const totalScore = flexibilityScore + languidScore;
  
  return {
    flexibility_score: flexibilityScore,
    languid_score: languidScore,
    total_score: totalScore,
    circadian_type: getCircadianType(totalScore),
    interpretation: interpretCtiScores(flexibilityScore, languidScore)
  };
}

export function getCircadianType(totalScore: number): string {
  // CTI total score for 11-item version: 11-55
  // Scores < 28: evening type, 28-37: intermediate, >= 38: morning type
  if (totalScore < 28) return 'evening';
  if (totalScore <= 37) return 'intermediate';
  return 'morning';
}

export function interpretCtiFlexibility(score: number): string {
  // Flexibility score ranges from 5-25
  // Higher scores indicate greater circadian flexibility
  if (score <= 10) return 'Flexibilité circadienne faible (rythme rigide)';
  if (score <= 15) return 'Flexibilité circadienne modérée';
  if (score <= 20) return 'Flexibilité circadienne bonne';
  return 'Flexibilité circadienne élevée';
}

export function interpretCtiLanguid(score: number): string {
  // Languid score ranges from 6-30
  // Higher scores indicate greater languidness/sleep need
  if (score <= 12) return 'Besoin de sommeil faible (vigoureux)';
  if (score <= 18) return 'Besoin de sommeil normal';
  if (score <= 24) return 'Besoin de sommeil modéré';
  return 'Besoin de sommeil élevé (langoureux)';
}

export function interpretCtiScores(flexibilityScore: number, languidScore: number): string {
  const flexibility = interpretCtiFlexibility(flexibilityScore);
  const languid = interpretCtiLanguid(languidScore);
  return `${flexibility}. ${languid}`;
}
