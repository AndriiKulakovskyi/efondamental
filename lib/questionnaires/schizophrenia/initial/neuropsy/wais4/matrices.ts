// ============================================================================
// eFondaMental Platform - WAIS-IV Matrices Subtest
// Schizophrenia Initial Evaluation - Neuropsy Module - WAIS-IV Subgroup
// Perceptual reasoning subtest assessing fluid intelligence through
// visual pattern completion
// ============================================================================

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaWais4MatricesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Demographics for scoring (silently injected from patient profile)
  patient_age?: number | null;
  
  // Test status
  test_done: boolean;
  
  // 26 item scores (0-1 each)
  rad_wais_mat1: number | null;
  rad_wais_mat2: number | null;
  rad_wais_mat3: number | null;
  rad_wais_mat4: number | null;
  rad_wais_mat5: number | null;
  rad_wais_mat6: number | null;
  rad_wais_mat7: number | null;
  rad_wais_mat8: number | null;
  rad_wais_mat9: number | null;
  rad_wais_mat10: number | null;
  rad_wais_mat11: number | null;
  rad_wais_mat12: number | null;
  rad_wais_mat13: number | null;
  rad_wais_mat14: number | null;
  rad_wais_mat15: number | null;
  rad_wais_mat16: number | null;
  rad_wais_mat17: number | null;
  rad_wais_mat18: number | null;
  rad_wais_mat19: number | null;
  rad_wais_mat20: number | null;
  rad_wais_mat21: number | null;
  rad_wais_mat22: number | null;
  rad_wais_mat23: number | null;
  rad_wais_mat24: number | null;
  rad_wais_mat25: number | null;
  rad_wais_mat26: number | null;
  
  // Computed scores
  wais_mat_tot: number | null;      // Sum of all items (0-26)
  wais_mat_std: number | null;      // Age-adjusted standard score (1-19)
  wais_mat_cr: number | null;       // Z-score: (standard_score - 10) / 3
  
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaWais4MatricesResponseInsert = Omit<
  SchizophreniaWais4MatricesResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  'wais_mat_tot' | 'wais_mat_std' | 'wais_mat_cr'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Conditions
// ============================================================================

// Show item questions only when test is done
const SHOW_WHEN_TEST_DONE = { '==': [{ 'var': 'test_done' }, 'oui'] };

// ============================================================================
// Response Options (0-1 scoring)
// ============================================================================

const MATRICES_OPTIONS = [
  { code: 0, label: '0 - Incorrect ou pas de réponse', score: 0 },
  { code: 1, label: '1 - Correct', score: 1 },
];

// ============================================================================
// Item Definitions with Correct Answers (for reference)
// ============================================================================

const MATRICES_ITEMS = [
  { id: 'rad_wais_mat1', item_number: 1, correct_answer: 3 },
  { id: 'rad_wais_mat2', item_number: 2, correct_answer: 2 },
  { id: 'rad_wais_mat3', item_number: 3, correct_answer: 1 },
  { id: 'rad_wais_mat4', item_number: 4, correct_answer: 5 },
  { id: 'rad_wais_mat5', item_number: 5, correct_answer: 3 },
  { id: 'rad_wais_mat6', item_number: 6, correct_answer: 4 },
  { id: 'rad_wais_mat7', item_number: 7, correct_answer: 4 },
  { id: 'rad_wais_mat8', item_number: 8, correct_answer: 1 },
  { id: 'rad_wais_mat9', item_number: 9, correct_answer: 5 },
  { id: 'rad_wais_mat10', item_number: 10, correct_answer: 2 },
  { id: 'rad_wais_mat11', item_number: 11, correct_answer: 1 },
  { id: 'rad_wais_mat12', item_number: 12, correct_answer: 5 },
  { id: 'rad_wais_mat13', item_number: 13, correct_answer: 1 },
  { id: 'rad_wais_mat14', item_number: 14, correct_answer: 3 },
  { id: 'rad_wais_mat15', item_number: 15, correct_answer: 5 },
  { id: 'rad_wais_mat16', item_number: 16, correct_answer: 2 },
  { id: 'rad_wais_mat17', item_number: 17, correct_answer: 3 },
  { id: 'rad_wais_mat18', item_number: 18, correct_answer: 1 },
  { id: 'rad_wais_mat19', item_number: 19, correct_answer: 4 },
  { id: 'rad_wais_mat20', item_number: 20, correct_answer: 2 },
  { id: 'rad_wais_mat21', item_number: 21, correct_answer: 1 },
  { id: 'rad_wais_mat22', item_number: 22, correct_answer: 5 },
  { id: 'rad_wais_mat23', item_number: 23, correct_answer: 4 },
  { id: 'rad_wais_mat24', item_number: 24, correct_answer: 2 },
  { id: 'rad_wais_mat25', item_number: 25, correct_answer: 3 },
  { id: 'rad_wais_mat26', item_number: 26, correct_answer: 4 },
];

// ============================================================================
// Questions Dictionary
// ============================================================================

export const WAIS4_MATRICES_SZ_QUESTIONS: Question[] = [
  // Note: patient_age is silently injected from patient profile
  // and used for age-based normative scoring. It is not displayed in the form.
  
  // Test done toggle
  {
    id: 'test_done',
    text: 'Test fait',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui', score: 0 },
      { code: 'non', label: 'Non', score: 0 },
    ],
  },
  
  // Instructions
  {
    id: 'instructions_header',
    section: 'Instructions',
    text: 'Le patient doit identifier l\'élément manquant dans une matrice incomplète parmi 5 options de réponse. Chaque item présente un motif visuel incomplet que le patient doit compléter par raisonnement logique. Cotation : 0 = réponse incorrecte ou pas de réponse, 1 = réponse correcte.',
    type: 'instruction',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
  },
  
  // Discontinuation rule notice
  {
    id: 'discontinuation_notice',
    section: 'Instructions',
    text: 'Règle d\'arrêt : Le test est interrompu si le patient obtient 0 à 4 items consécutifs, ou 0 à 4 items sur 5 items consécutifs. Dans ce cas, la note standard est nulle.',
    type: 'instruction',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
  },
  
  // Generate all 26 item questions
  ...MATRICES_ITEMS.map((item) => ({
    id: item.id,
    section: 'Items',
    text: `Item ${item.item_number}`,
    type: 'single_choice' as const,
    required: true,
    options: MATRICES_OPTIONS,
    display_if: SHOW_WHEN_TEST_DONE,
    help: `Réponse correcte : option ${item.correct_answer}`,
  })),
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export interface QuestionnaireDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  instructions?: string;
  questions: Question[];
  metadata?: {
    singleColumn?: boolean;
    pathologies?: string[];
    target_role?: 'patient' | 'healthcare_professional';
    reference?: string;
    [key: string]: unknown;
  };
}

export const WAIS4_MATRICES_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'wais4_matrices_sz',
  code: 'WAIS4_MATRICES_SZ',
  title: 'WAIS-IV Subtest Matrices',
  description: 'Subtest de raisonnement perceptif évaluant l\'intelligence fluide par la complétion de motifs visuels. Le patient identifie l\'élément manquant dans des matrices incomplètes en utilisant le raisonnement logique.',
  instructions: 'Pour chaque item, présentez la matrice incomplète au patient et demandez-lui de choisir parmi les 5 options celle qui complète le motif. Cotez 1 pour une réponse correcte, 0 pour une réponse incorrecte ou absente. Arrêtez le test si le patient obtient 0 à 4 items consécutifs ou 0 à 4 items sur 5 items consécutifs.',
  questions: WAIS4_MATRICES_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    reference: 'WAIS-IV (Wechsler, 2008)',
    scoringNote: 'Score brut total (0-26) → Note standard (1-19) via table normative selon l\'âge → Valeur standardisée (z-score) = (Note standard - 10) / 3. Note standard nulle si règle d\'arrêt atteinte.',
    contributes_to: ['IRP', 'QI'],
    interpretation: {
      standard_score_ranges: {
        very_superior: '≥16',
        superior: '14-15',
        high_average: '12-13',
        average: '8-11',
        low_average: '6-7',
        borderline: '4-5',
        extremely_low: '1-3',
      },
      clinical_significance: 'Les scores bas peuvent indiquer des difficultés de raisonnement non-verbal, de traitement visuo-spatial ou d\'intelligence fluide. Souvent affectés dans la schizophrénie et troubles apparentés.',
    },
  },
};
