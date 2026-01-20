// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation
// STAI-YA Questionnaire (State Anxiety Inventory - Form Y-A)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching bipolar_stai_ya table schema
// ============================================================================

export interface BipolarStaiYaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Questions 1-20 (each scored 1-4)
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
  q5?: number | null;
  q6?: number | null;
  q7?: number | null;
  q8?: number | null;
  q9?: number | null;
  q10?: number | null;
  q11?: number | null;
  q12?: number | null;
  q13?: number | null;
  q14?: number | null;
  q15?: number | null;
  q16?: number | null;
  q17?: number | null;
  q18?: number | null;
  q19?: number | null;
  q20?: number | null;
  
  // Scores
  total_score?: number | null;
  note_t?: number | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarStaiYaResponseInsert = Omit<BipolarStaiYaResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Questions Dictionary
// ============================================================================

const STAI_OPTIONS = [
  { code: 1, label: 'non', score: 1 },
  { code: 2, label: 'plutôt non', score: 2 },
  { code: 3, label: 'plutôt oui', score: 3 },
  { code: 4, label: 'oui', score: 4 }
];

export const STAI_YA_QUESTIONS: Question[] = [
  {
    id: 'instructions',
    text: 'Consignes',
    type: 'section',
    required: false,
    help: "Un certain nombre de phrases que l'on utilise pour se décrire sont données ci-dessous. Lisez chaque phrase, puis cochez, parmi les quatre points à droite, celui qui correspond le mieux à ce que vous ressentez A L'INSTANT, JUSTE EN CE MOMENT. Il n'y a pas de bonnes ni de mauvaises réponses. Ne passez pas trop de temps sur l'une ou l'autre de ces propositions, et indiquez la réponse qui décrit le mieux vos sentiments actuels."
  },
  { id: 'q1', text: '1. Je me sens calme.', type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q2', text: '2. Je me sens en sécurité, sans inquiétude, en sûreté.', type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q3', text: '3. Je suis tendu(e), crispé(e).', type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q4', text: '4. Je me sens surmené(e).', type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q5', text: '5. Je me sens tranquille, bien dans ma peau.', type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q6', text: '6. Je me sens ému(e), bouleversé(e), contrarié(e).', type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q7', text: "7. L'idée de malheurs éventuels me tracasse en ce moment.", type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q8', text: '8. Je me sens content(e).', type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q9', text: '9. Je me sens effrayé(e).', type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q10', text: '10. Je me sens à mon aise.', type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q11', text: "11. Je sens que j'ai confiance en moi.", type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q12', text: '12. Je me sens nerveux (nerveuse), irritable.', type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q13', text: "13. J'ai la frousse, la trouille (j'ai peur).", type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q14', text: '14. Je me sens indécis(e).', type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q15', text: '15. Je suis décontracté(e), détendu(e).', type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q16', text: '16. Je suis satisfait(e).', type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q17', text: '17. Je suis inquiet, soucieux (inquiète, soucieuse).', type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q18', text: "18. Je ne sais plus où j'en suis, je me sens déconcerté(e), dérouté(e).", type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q19', text: '19. Je me sens solide, posé(e), pondéré(e), réfléchi(e).', type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'q20', text: '20. Je me sens de bonne humeur, aimable.', type: 'single_choice', required: true, options: STAI_OPTIONS },
  { id: 'note_t', text: 'Note T', type: 'number', required: false, help: 'Saisissez la Note T calculée.' }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const STAI_YA_DEFINITION: QuestionnaireDefinition = {
  id: 'stai_ya',
  code: 'STAI_YA',
  title: 'STAI-YA',
  description: "Inventaire d'Anxiété État (Forme Y-A)",
  questions: STAI_YA_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    reverse_items: [1, 2, 5, 8, 10, 11, 15, 16, 19, 20],
    instructions: "Un certain nombre de phrases que l'on utilise pour se décrire sont données ci-dessous. Lisez chaque phrase, puis cochez, parmi les quatre points à droite, celui qui correspond le mieux à ce que vous ressentez A L'INSTANT, JUSTE EN CE MOMENT. Il n'y a pas de bonnes ni de mauvaises réponses. Ne passez pas trop de temps sur l'une ou l'autre de ces propositions, et indiquez la réponse qui décrit le mieux vos sentiments actuels."
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

// Reverse items: 1, 2, 5, 8, 10, 11, 15, 16, 19, 20
const REVERSE_ITEMS = [1, 2, 5, 8, 10, 11, 15, 16, 19, 20];

export function computeStaiYaScore(responses: Partial<BipolarStaiYaResponse>): number {
  let totalScore = 0;
  
  for (let i = 1; i <= 20; i++) {
    const qKey = `q${i}` as keyof BipolarStaiYaResponse;
    const value = responses[qKey] as number | null | undefined;
    
    if (value !== null && value !== undefined) {
      // Reverse score for specific items (5 - value)
      if (REVERSE_ITEMS.includes(i)) {
        totalScore += (5 - value);
      } else {
        totalScore += value;
      }
    }
  }
  
  return totalScore;
}

export function interpretStaiYaScore(totalScore: number): string {
  // STAI-YA scores range from 20-80
  // Higher scores indicate greater anxiety
  if (totalScore <= 35) return 'Anxiété légère';
  if (totalScore <= 45) return 'Anxiété modérée';
  if (totalScore <= 55) return 'Anxiété moyenne-haute';
  if (totalScore <= 65) return 'Anxiété élevée';
  return 'Anxiété très élevée';
}

// Convert raw score to T-score (using standard STAI norms)
export function rawToTScore(rawScore: number, sex: 'M' | 'F' = 'M'): number {
  // Simplified T-score conversion
  // T = 50 + 10 * (raw - mean) / SD
  // Using approximate norms: Men mean=36.5, SD=10.0; Women mean=38.8, SD=11.9
  const mean = sex === 'M' ? 36.5 : 38.8;
  const sd = sex === 'M' ? 10.0 : 11.9;
  const tScore = Math.round(50 + 10 * (rawScore - mean) / sd);
  return Math.max(20, Math.min(80, tScore)); // Clamp between 20 and 80
}
