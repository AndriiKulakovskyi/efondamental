// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation
// AQ-12 Questionnaire (Aggression Questionnaire - Short Form)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching bipolar_aq12 table schema
// ============================================================================

export interface BipolarAq12Response {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Questions 1-12
  q1?: number | null; q2?: number | null; q3?: number | null; q4?: number | null;
  q5?: number | null; q6?: number | null; q7?: number | null; q8?: number | null;
  q9?: number | null; q10?: number | null; q11?: number | null; q12?: number | null;
  
  // Subscale scores
  physical_aggression_score?: number | null;
  verbal_aggression_score?: number | null;
  anger_score?: number | null;
  hostility_score?: number | null;
  total_score?: number | null;
  interpretation?: string | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarAq12ResponseInsert = Omit<BipolarAq12Response, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Questions Dictionary
// ============================================================================

const AQ_OPTIONS = [
  { code: 1, label: '1 – Pas du tout moi', score: 1 },
  { code: 2, label: '2', score: 2 },
  { code: 3, label: '3', score: 3 },
  { code: 4, label: '4', score: 4 },
  { code: 5, label: '5', score: 5 },
  { code: 6, label: '6 – Tout à fait moi', score: 6 }
];

export const AQ12_QUESTIONS: Question[] = [
  { id: 'q1', text: '1. Si on me provoque, je peux cogner.', type: 'single_choice', required: true, options: AQ_OPTIONS },
  { id: 'q2', text: "2. J'exprime souvent mon désaccord avec les autres.", type: 'single_choice', required: true, options: AQ_OPTIONS },
  { id: 'q3', text: "3. Je m'emporte rapidement.", type: 'single_choice', required: true, options: AQ_OPTIONS },
  { id: 'q4', text: "4. Parfois, j'ai l'impression que je n'ai pas été gâté par la vie comme les autres.", type: 'single_choice', required: true, options: AQ_OPTIONS },
  { id: 'q5', text: "5. Il y a des personnes qui me gonflent tellement qu'on peut en arriver aux mains.", type: 'single_choice', required: true, options: AQ_OPTIONS },
  { id: 'q6', text: "6. Je ne peux pas m'empêcher d'entrer en conflit quand les autres ne sont pas d'accord avec moi.", type: 'single_choice', required: true, options: AQ_OPTIONS },
  { id: 'q7', text: '7. Parfois, je pète un câble sans raison.', type: 'single_choice', required: true, options: AQ_OPTIONS },
  { id: 'q8', text: "8. Je me demande parfois pourquoi je ressens tant d'amertume.", type: 'single_choice', required: true, options: AQ_OPTIONS },
  { id: 'q9', text: "9. J'ai déjà menacé quelqu'un.", type: 'single_choice', required: true, options: AQ_OPTIONS },
  { id: 'q10', text: "10. Mes amis disent que j'ai l'esprit de contradiction.", type: 'single_choice', required: true, options: AQ_OPTIONS },
  { id: 'q11', text: "11. J'ai du mal à contrôler mon humeur.", type: 'single_choice', required: true, options: AQ_OPTIONS },
  { id: 'q12', text: '12. Les autres semblent toujours avoir plus de chances que moi.', type: 'single_choice', required: true, options: AQ_OPTIONS }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const AQ12_DEFINITION: QuestionnaireDefinition = {
  id: 'aq12',
  code: 'AQ12',
  title: 'AQ-12',
  description: "Questionnaire d'Agression - 12 items",
  questions: AQ12_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    instructions: "Cochez la case qui décrit le mieux ce que vous avez ressenti et comment vous vous êtes comporté(e) au cours des 6 derniers mois.",
    subscales: {
      physical_aggression: [1, 5, 9],
      verbal_aggression: [2, 6, 10],
      anger: [3, 7, 11],
      hostility: [4, 8, 12]
    }
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

const SUBSCALES = {
  physical_aggression: [1, 5, 9],
  verbal_aggression: [2, 6, 10],
  anger: [3, 7, 11],
  hostility: [4, 8, 12]
};

export interface Aq12ScoreResult {
  physical_aggression_score: number;
  verbal_aggression_score: number;
  anger_score: number;
  hostility_score: number;
  total_score: number;
  interpretation: string;
}

export function computeAq12Scores(responses: Partial<BipolarAq12Response>): Aq12ScoreResult {
  const getValue = (itemNum: number): number => {
    const key = `q${itemNum}` as keyof BipolarAq12Response;
    const value = responses[key] as number | null | undefined;
    return value ?? 0;
  };
  
  const physicalAggression = SUBSCALES.physical_aggression.reduce((sum, item) => sum + getValue(item), 0);
  const verbalAggression = SUBSCALES.verbal_aggression.reduce((sum, item) => sum + getValue(item), 0);
  const anger = SUBSCALES.anger.reduce((sum, item) => sum + getValue(item), 0);
  const hostility = SUBSCALES.hostility.reduce((sum, item) => sum + getValue(item), 0);
  const totalScore = physicalAggression + verbalAggression + anger + hostility;
  
  return {
    physical_aggression_score: physicalAggression,
    verbal_aggression_score: verbalAggression,
    anger_score: anger,
    hostility_score: hostility,
    total_score: totalScore,
    interpretation: interpretAq12Score(totalScore)
  };
}

export function interpretAq12Score(totalScore: number): string {
  // AQ-12 (BPAQ-12) total score ranges from 12-72
  // Higher scores indicate greater aggression
  if (totalScore <= 30) return 'Faible agressivité';
  if (totalScore <= 45) return 'Agressivité modérée';
  return 'Agressivité élevée';
}

export function getAq12ClinicalGuidance(totalScore: number): string {
  if (totalScore <= 30) {
    return 'Bonne régulation émotionnelle, conflits rares ou maîtrisés.';
  }
  if (totalScore <= 45) {
    return 'Irritabilité, colère réactive, conflits interpersonnels possibles, retentissement situationnel.';
  }
  return 'Impulsivité marquée, colère difficile à contrôler, risque accru de comportements agressifs verbaux ou physiques.';
}
