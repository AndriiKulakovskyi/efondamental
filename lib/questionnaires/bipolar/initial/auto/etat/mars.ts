// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation
// MARS Questionnaire (Medication Adherence Rating Scale)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching bipolar_mars table schema
// ============================================================================

export interface BipolarMarsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Filter question
  taking_medication?: string | null;
  
  // Questions 1-10 (each scored 0 or 1)
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
  
  // Scores
  total_score?: number | null;
  adherence_subscore?: number | null;
  attitude_subscore?: number | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarMarsResponseInsert = Omit<BipolarMarsResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Questions Dictionary
// ============================================================================

export const MARS_QUESTIONS: Question[] = [
  {
    id: 'instructions',
    text: 'Consignes',
    type: 'section',
    required: false,
    help: "Ce questionnaire consiste à mieux comprendre les difficultés liées à la prise de médicament. Votre aide nous sera précieuse pour mieux vous aider et améliorer, nous l'espérons, les résultats thérapeutiques. Veuillez s'il vous plaît répondre à l'ensemble des questions en cochant la réponse qui correspond le mieux à votre comportement ou attitude vis à vis du traitement que vous prenez sur la semaine qui vient de s'écouler."
  },
  {
    id: 'taking_medication',
    text: 'Prenez-vous actuellement un traitement médicamenteux ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  { 
    id: 'q1', 
    text: "Vous est-il parfois arrivé d'oublier de prendre vos médicaments ?", 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q2', 
    text: "Négligez-vous parfois l'heure de prise d'un de vos médicaments ?", 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q3', 
    text: 'Lorsque vous vous sentez mieux, interrompez-vous parfois votre traitement ?', 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q4', 
    text: "Vous est-il arrivé d'arrêter le traitement parce que vous vous sentiez moins bien en le prenant ?", 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q5', 
    text: 'Je ne prends les médicaments que lorsque je me sens malade.', 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q6', 
    text: "Ce n'est pas naturel pour mon corps et mon esprit d'être équilibré par des médicaments.", 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q7', 
    text: 'Mes idées sont plus claires avec les médicaments.', 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q8', 
    text: 'En continuant à prendre les médicaments, je peux éviter de tomber à nouveau malade.', 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q9', 
    text: 'Avec les médicaments, je me sens bizarre, comme un « zombie ».', 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q10', 
    text: 'Les médicaments me rendent lourd(e) et fatigué(e).', 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const MARS_DEFINITION: QuestionnaireDefinition = {
  id: 'mars',
  code: 'MARS',
  title: 'MARS',
  description: 'Medication Adherence Rating Scale',
  questions: MARS_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    positive_items: [7, 8],
    negative_items: [1, 2, 3, 4, 5, 6, 9, 10],
    instructions: "Ce questionnaire consiste à mieux comprendre les difficultés liées à la prise de médicament. Votre aide nous sera précieuse pour mieux vous aider et améliorer, nous l'espérons, les résultats thérapeutiques. Veuillez s'il vous plaît répondre à l'ensemble des questions en cochant la réponse qui correspond le mieux à votre comportement ou attitude vis à vis du traitement que vous prenez sur la semaine qui vient de s'écouler."
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

// Items where "Yes" indicates positive attitude toward medication (7, 8)
const POSITIVE_ITEMS = [7, 8];
// Items where "No" indicates good adherence (1-6, 9, 10)
const NEGATIVE_ITEMS = [1, 2, 3, 4, 5, 6, 9, 10];

export function computeMarsScores(responses: Partial<BipolarMarsResponse>): {
  total_score: number;
  adherence_subscore: number;
  attitude_subscore: number;
} {
  let totalScore = 0;
  let adherenceSubscore = 0; // Items 1-4: behavioral adherence
  let attitudeSubscore = 0;  // Items 5-10: attitudes toward medication
  
  for (let i = 1; i <= 10; i++) {
    const qKey = `q${i}` as keyof BipolarMarsResponse;
    const value = responses[qKey] as number | null | undefined;
    
    if (value !== null && value !== undefined) {
      let itemScore: number;
      
      if (POSITIVE_ITEMS.includes(i)) {
        // For positive items, Yes (1) = good adherence = 1 point
        itemScore = value;
      } else {
        // For negative items, No (0) = good adherence = 1 point
        itemScore = value === 0 ? 1 : 0;
      }
      
      totalScore += itemScore;
      
      if (i <= 4) {
        adherenceSubscore += itemScore;
      } else {
        attitudeSubscore += itemScore;
      }
    }
  }
  
  return {
    total_score: totalScore,
    adherence_subscore: adherenceSubscore,
    attitude_subscore: attitudeSubscore
  };
}

export function interpretMarsScore(totalScore: number): string {
  // MARS total score ranges from 0-10
  // Higher scores indicate better adherence
  if (totalScore >= 8) return 'Bonne observance';
  if (totalScore >= 6) return 'Observance modérée';
  if (totalScore >= 4) return 'Observance faible';
  return 'Très faible observance';
}
