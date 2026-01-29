// ============================================================================
// eFondaMental Platform - Schizophrenia Initial Evaluation
// MARS Questionnaire (Medication Adherence Rating Scale)
// Thompson K, Kulkarni J, Sergejew AA. (2000)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching schizophrenia_mars table schema
// ============================================================================

export interface SchizophreniaMarsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Administration status
  questionnaire_done?: string | null; // 'Fait' | 'Non fait'
  
  // Questions 1-10 (binary: 0 or 1 after scoring transformation)
  // Raw values stored: 'Oui' or 'Non'
  q1?: string | null;
  q2?: string | null;
  q3?: string | null;
  q4?: string | null;
  q5?: string | null;
  q6?: string | null;
  q7?: string | null;
  q8?: string | null;
  q9?: string | null;
  q10?: string | null;
  
  // Computed scores
  total_score?: number | null;           // 0-10 (sum of all scored items)
  adherence_subscore?: number | null;    // 0-4 (Q1-Q4: medication adherence behavior)
  attitude_subscore?: number | null;     // 0-2 (Q5-Q6: attitude toward medication)
  positive_effects_subscore?: number | null;  // 0-2 (Q7-Q8: perceived positive effects)
  negative_effects_subscore?: number | null;  // 0-2 (Q9-Q10: perceived negative effects)
  interpretation?: string | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaMarsResponseInsert = Omit<
  SchizophreniaMarsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  'total_score' | 'adherence_subscore' | 'attitude_subscore' |
  'positive_effects_subscore' | 'negative_effects_subscore' | 'interpretation'
>;

// ============================================================================
// Scoring Configuration
// ============================================================================

// Q7 and Q8 are reverse-scored (positive items): Oui=1, Non=0
const POSITIVE_ITEMS = [7, 8];
// All other items are standard: Non=1, Oui=0
const NEGATIVE_ITEMS = [1, 2, 3, 4, 5, 6, 9, 10];

// Domain mappings
const DOMAIN_ITEMS = {
  adherence_behavior: [1, 2, 3, 4],      // Q1-Q4: Comportement d'adhésion
  attitude: [5, 6],                       // Q5-Q6: Attitude face aux médicaments
  positive_effects: [7, 8],               // Q7-Q8: Effets positifs perçus (reverse)
  negative_effects: [9, 10]               // Q9-Q10: Effets négatifs perçus
};

// ============================================================================
// Scoring Functions
// ============================================================================

export interface MarsSzScoreResult {
  total_score: number;
  adherence_subscore: number;
  attitude_subscore: number;
  positive_effects_subscore: number;
  negative_effects_subscore: number;
  interpretation: string;
}

/**
 * Get the scored value for an item
 * - For positive items (Q7, Q8): Oui=1, Non=0
 * - For negative items (all others): Non=1, Oui=0
 */
function getItemScore(itemNum: number, value: string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  
  if (POSITIVE_ITEMS.includes(itemNum)) {
    // Positive items: Oui = 1 point (perceives benefit)
    return value === 'Oui' ? 1 : 0;
  } else {
    // Negative items: Non = 1 point (good adherence/no negative effect)
    return value === 'Non' ? 1 : 0;
  }
}

/**
 * Compute all MARS scores from responses
 */
export function computeMarsSzScores(responses: Record<string, any>): MarsSzScoreResult {
  let totalScore = 0;
  let adherenceSubscore = 0;
  let attitudeSubscore = 0;
  let positiveEffectsSubscore = 0;
  let negativeEffectsSubscore = 0;
  
  for (let i = 1; i <= 10; i++) {
    const qKey = `q${i}`;
    const value = responses[qKey] as string | null | undefined;
    const itemScore = getItemScore(i, value);
    
    totalScore += itemScore;
    
    // Assign to appropriate subscale
    if (DOMAIN_ITEMS.adherence_behavior.includes(i)) {
      adherenceSubscore += itemScore;
    } else if (DOMAIN_ITEMS.attitude.includes(i)) {
      attitudeSubscore += itemScore;
    } else if (DOMAIN_ITEMS.positive_effects.includes(i)) {
      positiveEffectsSubscore += itemScore;
    } else if (DOMAIN_ITEMS.negative_effects.includes(i)) {
      negativeEffectsSubscore += itemScore;
    }
  }
  
  return {
    total_score: totalScore,
    adherence_subscore: adherenceSubscore,
    attitude_subscore: attitudeSubscore,
    positive_effects_subscore: positiveEffectsSubscore,
    negative_effects_subscore: negativeEffectsSubscore,
    interpretation: interpretMarsSzScore(totalScore)
  };
}

/**
 * Interpret MARS total score
 */
export function interpretMarsSzScore(totalScore: number): string {
  if (totalScore >= 8) {
    return 'Bonne observance thérapeutique. Comportements et attitudes favorables à la prise régulière du traitement.';
  }
  if (totalScore >= 6) {
    return 'Observance modérée. Quelques difficultés d\'adhésion identifiées. Exploration des obstacles recommandée.';
  }
  if (totalScore >= 4) {
    return 'Observance faible. Difficultés importantes d\'adhésion au traitement. Intervention ciblée nécessaire.';
  }
  return 'Très faible observance. Non-adhésion majeure au traitement. Risque élevé de rechute. Intervention urgente recommandée.';
}

// ============================================================================
// Question Options
// ============================================================================

const QUESTIONNAIRE_DONE_OPTIONS = [
  { code: 'Fait', label: 'Fait' },
  { code: 'Non fait', label: 'Non fait' },
];

const BINARY_OPTIONS = [
  { code: 'Oui', label: 'Oui' },
  { code: 'Non', label: 'Non' },
];

// ============================================================================
// Questions Array
// ============================================================================

export const MARS_SZ_QUESTIONS: Question[] = [
  // Administration status
  {
    id: 'questionnaire_done',
    text: 'Passation du questionnaire',
    type: 'single_choice',
    required: true,
    options: QUESTIONNAIRE_DONE_OPTIONS,
  },
  // Instructions
  {
    id: 'instruction_consigne',
    text: "Ce questionnaire consiste à mieux comprendre les difficultés liées à la prise de médicament. Votre aide nous sera précieuse pour mieux vous aider et améliorer, nous l'espérons, les résultats thérapeutiques. Veuillez s'il vous plaît répondre à l'ensemble des questions en cochant la réponse qui correspond le mieux à votre comportement ou attitude vis à vis du traitement que vous prenez sur la semaine qui vient de s'écouler.",
    type: 'instruction',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Domain 1: Medication Adherence Behavior (Q1-Q4)
  {
    id: 'q1',
    text: "1. Vous est-il parfois arrivé d'oublier de prendre vos médicaments",
    type: 'single_choice',
    required: false,
    options: BINARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Non = bonne adhésion (1 point)',
  },
  {
    id: 'q2',
    text: "2. Négligez vous parfois l'heure de prise d'un de vos médicaments",
    type: 'single_choice',
    required: false,
    options: BINARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Non = bonne adhésion (1 point)',
  },
  {
    id: 'q3',
    text: "3. Lorsque vous vous sentez mieux, interrompez vous parfois votre traitement",
    type: 'single_choice',
    required: false,
    options: BINARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Non = bonne adhésion (1 point)',
  },
  {
    id: 'q4',
    text: "4. Vous est il arrivé d'arrêter le traitement parce que vous vous sentiez moins bien en le prenant",
    type: 'single_choice',
    required: false,
    options: BINARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Non = bonne adhésion (1 point)',
  },
  
  // Domain 2: Medication Attitude (Q5-Q6)
  {
    id: 'q5',
    text: "5. Je ne prends les médicaments que lorsque je me sens malade",
    type: 'single_choice',
    required: false,
    options: BINARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Non = bonne attitude (1 point)',
  },
  {
    id: 'q6',
    text: "6. Ce n'est pas naturel pour mon corps et mon esprit d'être équilibré par des médicaments",
    type: 'single_choice',
    required: false,
    options: BINARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Non = bonne attitude (1 point)',
  },
  
  // Domain 3: Perceived Positive Effects (Q7-Q8) - REVERSE SCORED
  {
    id: 'q7',
    text: "7. Mes idées sont plus claires avec les médicaments",
    type: 'single_choice',
    required: false,
    options: BINARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'SCORE INVERSÉ - Oui = perçoit un bénéfice (1 point)',
  },
  {
    id: 'q8',
    text: "8. En continuant à prendre les médicaments, je peux éviter de tomber à nouveau malade",
    type: 'single_choice',
    required: false,
    options: BINARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'SCORE INVERSÉ - Oui = perçoit un bénéfice (1 point)',
  },
  
  // Domain 4: Perceived Negative Effects (Q9-Q10)
  {
    id: 'q9',
    text: "9. Avec les médicaments, je me sens bizarre, comme un « zombie »",
    type: 'single_choice',
    required: false,
    options: BINARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Non = pas d\'effet négatif (1 point)',
  },
  {
    id: 'q10',
    text: "10. Les médicaments me rendent lourd (e) et fatigué (e)",
    type: 'single_choice',
    required: false,
    options: BINARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Non = pas d\'effet négatif (1 point)',
  },
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const MARS_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'mars_sz',
  code: 'MARS_SZ',
  title: 'MARS - Observance thérapeutique',
  description: "Le MARS (Medication Adherence Rating Scale) est un questionnaire d'auto-évaluation de 10 items mesurant l'adhésion au traitement médicamenteux. Il évalue le comportement d'observance (items 1-4), l'attitude face à la prise de médicaments (items 5-6), et les effets positifs et négatifs perçus (items 7-10).",
  questions: MARS_SZ_QUESTIONS,
  metadata: {
    pathologies: ['schizophrenia'],
    target_role: 'patient',
    instructions: "Ce questionnaire consiste à mieux comprendre les difficultés liées à la prise de médicament.",
    positive_items: POSITIVE_ITEMS,
    negative_items: NEGATIVE_ITEMS,
    domains: DOMAIN_ITEMS
  }
};
