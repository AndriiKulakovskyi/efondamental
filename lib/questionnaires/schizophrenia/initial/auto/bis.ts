// ============================================================================
// eFondaMental Platform - Schizophrenia Initial Evaluation
// BIS Questionnaire (Birchwood Insight Scale)
// Birchwood M, Smith J, Drury V, Healy J, Macmillan F, Slade M. (1994)
// Translation: Sabrina Linder et Jérôme Favrod - 2006
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching schizophrenia_bis table schema
// ============================================================================

export interface SchizophreniaBisResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Administration status
  questionnaire_done?: string | null; // 'Fait' | 'Non fait'
  
  // Questions 1-8 (ternary: 'D\'accord' | 'Pas d\'accord' | 'Incertain')
  q1?: string | null;
  q2?: string | null;
  q3?: string | null;
  q4?: string | null;
  q5?: string | null;
  q6?: string | null;
  q7?: string | null;
  q8?: string | null;
  
  // Computed scores
  conscience_symptome_score?: number | null;  // 0-4 (Q1 + Q8)
  conscience_maladie_score?: number | null;   // 0-4 (Q2 + Q7)
  besoin_traitement_score?: number | null;    // 0-4 ((Q3 + Q4 + Q5 + Q6) / 2)
  total_score?: number | null;                // 0-12 (sum of subscales)
  interpretation?: string | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaBisResponseInsert = Omit<
  SchizophreniaBisResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  'conscience_symptome_score' | 'conscience_maladie_score' | 
  'besoin_traitement_score' | 'total_score' | 'interpretation'
>;

// ============================================================================
// Scoring Configuration
// ============================================================================

// Positive items: D'accord = 2 (indicates insight)
const BIS_POSITIVE_ITEMS = [1, 4, 5, 7, 8];
// Negative items: D'accord = 0 (indicates lack of insight)
const BIS_NEGATIVE_ITEMS = [2, 3, 6];

// Subscale mappings
const BIS_SUBSCALES = {
  conscience_symptome: [1, 8],      // Q1, Q8: Conscience des symptômes
  conscience_maladie: [2, 7],       // Q2, Q7: Conscience de la maladie
  besoin_traitement: [3, 4, 5, 6]   // Q3-Q6: Besoin de traitement (divided by 2)
};

// ============================================================================
// Scoring Functions
// ============================================================================

export interface BisSzScoreResult {
  conscience_symptome_score: number;
  conscience_maladie_score: number;
  besoin_traitement_score: number;
  total_score: number;
  interpretation: string;
}

/**
 * Get the scored value for a BIS item
 * - For positive items (Q1, Q4, Q5, Q7, Q8): D'accord=2, Pas d'accord=0, Incertain=1
 * - For negative items (Q2, Q3, Q6): D'accord=0, Pas d'accord=2, Incertain=1
 */
function getBisItemScore(itemNum: number, value: string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  
  if (BIS_POSITIVE_ITEMS.includes(itemNum)) {
    // Positive items: D'accord = good insight (2 points)
    if (value === "D'accord") return 2;
    if (value === 'Pas d\'accord') return 0;
    if (value === 'Incertain') return 1;
  } else {
    // Negative items: Pas d'accord = good insight (2 points)
    if (value === "D'accord") return 0;
    if (value === 'Pas d\'accord') return 2;
    if (value === 'Incertain') return 1;
  }
  return 0;
}

/**
 * Compute all BIS scores from responses
 */
export function computeBisScores(responses: Record<string, any>): BisSzScoreResult {
  // Calculate conscience_symptome (Q1 + Q8)
  const conscience_symptome_score = 
    getBisItemScore(1, responses.q1) + 
    getBisItemScore(8, responses.q8);
  
  // Calculate conscience_maladie (Q2 + Q7)
  const conscience_maladie_score = 
    getBisItemScore(2, responses.q2) + 
    getBisItemScore(7, responses.q7);
  
  // Calculate besoin_traitement ((Q3 + Q4 + Q5 + Q6) / 2)
  const besoin_traitement_raw = 
    getBisItemScore(3, responses.q3) + 
    getBisItemScore(4, responses.q4) + 
    getBisItemScore(5, responses.q5) + 
    getBisItemScore(6, responses.q6);
  const besoin_traitement_score = besoin_traitement_raw / 2;
  
  // Total score is sum of subscales
  const total_score = conscience_symptome_score + conscience_maladie_score + besoin_traitement_score;
  
  return {
    conscience_symptome_score,
    conscience_maladie_score,
    besoin_traitement_score,
    total_score,
    interpretation: interpretBisScore(total_score)
  };
}

/**
 * Interpret BIS total score
 */
export function interpretBisScore(totalScore: number): string {
  if (totalScore >= 10) {
    return 'Très bon insight. Le patient reconnaît ses symptômes, sa maladie et son besoin de traitement.';
  }
  if (totalScore >= 7) {
    return 'Bon insight. Le patient a une conscience satisfaisante de sa situation clinique.';
  }
  if (totalScore >= 4) {
    return 'Insight modéré. Certaines dimensions de la conscience de la maladie sont partiellement reconnues.';
  }
  return 'Pauvre insight. Difficultés importantes à reconnaître la maladie, les symptômes ou le besoin de traitement.';
}

// ============================================================================
// Question Options
// ============================================================================

const QUESTIONNAIRE_DONE_OPTIONS = [
  { code: 'Fait', label: 'Fait' },
  { code: 'Non fait', label: 'Non fait' },
];

const TERNARY_OPTIONS = [
  { code: "D'accord", label: "D'accord" },
  { code: 'Pas d\'accord', label: 'Pas d\'accord' },
  { code: 'Incertain', label: 'Incertain' },
];

// ============================================================================
// Questions Array
// ============================================================================

export const BIS_SZ_QUESTIONS: Question[] = [
  // Administration status
  {
    id: 'questionnaire_done',
    text: 'Passation du questionnaire',
    type: 'single_choice',
    required: true,
    options: QUESTIONNAIRE_DONE_OPTIONS,
  },
  // Header
  {
    id: 'instruction_version',
    text: "Birchwood : échelle d'insight actuel\nInstrument originel : Birchwood et al. 1994, Insight Scale for Psychosis\nTraduction : Sabrina Linder et Jérôme Favrod – 2006",
    type: 'instruction',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  // Instructions
  {
    id: 'instruction_consigne',
    text: "Lisez les propositions suivantes puis cochez la case qui s'applique le mieux à votre situation.",
    type: 'instruction',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q1 - Conscience des symptômes (positive item)
  {
    id: 'q1',
    text: "1. Certains de mes symptômes sont ou étaient produits par mon esprit.",
    type: 'single_choice',
    required: false,
    options: TERNARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help: "Item positif - D'accord = bon insight (2 points)",
  },
  
  // Q2 - Conscience de la maladie (negative item)
  {
    id: 'q2',
    text: "2. J'ai toujours été en bonne santé mentale",
    type: 'single_choice',
    required: false,
    options: TERNARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help: "Item négatif - Pas d'accord = bon insight (2 points)",
  },
  
  // Q3 - Besoin de traitement (negative item)
  {
    id: 'q3',
    text: "3. Je n'ai pas besoin de médicaments.",
    type: 'single_choice',
    required: false,
    options: TERNARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help: "Item négatif - Pas d'accord = bon insight (2 points)",
  },
  
  // Q4 - Besoin de traitement (positive item)
  {
    id: 'q4',
    text: "4. Mon séjour à l'hôpital était nécessaire.",
    type: 'single_choice',
    required: false,
    options: TERNARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help: "Item positif - D'accord = bon insight (2 points)",
  },
  
  // Q5 - Besoin de traitement (positive item)
  {
    id: 'q5',
    text: "5. Le médecin a raison en me prescrivant un traitement.",
    type: 'single_choice',
    required: false,
    options: TERNARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help: "Item positif - D'accord = bon insight (2 points)",
  },
  
  // Q6 - Besoin de traitement (negative item)
  {
    id: 'q6',
    text: "6. Je n'ai pas besoin d'être vu(e) par un médecin ou un psychiatre.",
    type: 'single_choice',
    required: false,
    options: TERNARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help: "Item négatif - Pas d'accord = bon insight (2 points)",
  },
  
  // Q7 - Conscience de la maladie (positive item)
  {
    id: 'q7',
    text: "7. Si quelqu'un disait que j'ai une maladie des nerfs ou une maladie mentale, il aurait raison.",
    type: 'single_choice',
    required: false,
    options: TERNARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help: "Item positif - D'accord = bon insight (2 points)",
  },
  
  // Q8 - Conscience des symptômes (positive item)
  {
    id: 'q8',
    text: "8. Pensez-vous que les périodes de crise que vous avez vécues, peuvent être dues à une maladie?",
    type: 'single_choice',
    required: false,
    options: TERNARY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help: "Item positif - D'accord = bon insight (2 points)",
  },
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const BIS_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'bis_sz',
  code: 'BIS_SZ',
  title: "BIS - Échelle d'Insight de Birchwood",
  description: "L'échelle d'insight de Birchwood est un auto-questionnaire de 8 items évaluant l'insight (conscience de la maladie) chez les patients psychotiques. Elle mesure trois dimensions : la conscience des symptômes, la conscience de la maladie, et le besoin perçu de traitement. Un score plus élevé indique un meilleur insight.",
  questions: BIS_SZ_QUESTIONS,
  metadata: {
    pathologies: ['schizophrenia'],
    target_role: 'patient',
    instructions: "Lisez les propositions suivantes puis cochez la case qui s'applique le mieux à votre situation.",
    positive_items: BIS_POSITIVE_ITEMS,
    negative_items: BIS_NEGATIVE_ITEMS,
    subscales: BIS_SUBSCALES,
    reference: 'Birchwood M, Smith J, Drury V, Healy J, Macmillan F, Slade M. A self-report Insight Scale for psychosis: reliability, validity and sensitivity to change. Acta Psychiatr Scand. 1994;89(1):62-67.',
    translation: 'Sabrina Linder et Jérôme Favrod - 2006'
  }
};
