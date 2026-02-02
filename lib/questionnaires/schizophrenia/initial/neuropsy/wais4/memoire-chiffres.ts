// ============================================================================
// eFondaMental Platform - WAIS-IV Mémoire des Chiffres (Digit Span)
// Schizophrenia Initial Evaluation - Neuropsy Module - WAIS-IV Subgroup
// Working memory subtest with 3 conditions: Direct, Inverse, Croissant
// ============================================================================

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaWais4MemoireChiffresResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Demographics for scoring (silently injected from patient profile)
  patient_age?: number | null;
  
  // Test status
  test_done: boolean;
  
  // ==========================================
  // Ordre Direct (Forward) - 8 items, 2 trials each
  // ==========================================
  rad_wais_mcod_1a: number | null;
  rad_wais_mcod_1b: number | null;
  rad_wais_mcod_2a: number | null;
  rad_wais_mcod_2b: number | null;
  rad_wais_mcod_3a: number | null;
  rad_wais_mcod_3b: number | null;
  rad_wais_mcod_4a: number | null;
  rad_wais_mcod_4b: number | null;
  rad_wais_mcod_5a: number | null;
  rad_wais_mcod_5b: number | null;
  rad_wais_mcod_6a: number | null;
  rad_wais_mcod_6b: number | null;
  rad_wais_mcod_7a: number | null;
  rad_wais_mcod_7b: number | null;
  rad_wais_mcod_8a: number | null;
  rad_wais_mcod_8b: number | null;
  
  // ==========================================
  // Ordre Inverse (Backward) - 8 items, 2 trials each
  // ==========================================
  rad_wais_mcoi_1a: number | null;
  rad_wais_mcoi_1b: number | null;
  rad_wais_mcoi_2a: number | null;
  rad_wais_mcoi_2b: number | null;
  rad_wais_mcoi_3a: number | null;
  rad_wais_mcoi_3b: number | null;
  rad_wais_mcoi_4a: number | null;
  rad_wais_mcoi_4b: number | null;
  rad_wais_mcoi_5a: number | null;
  rad_wais_mcoi_5b: number | null;
  rad_wais_mcoi_6a: number | null;
  rad_wais_mcoi_6b: number | null;
  rad_wais_mcoi_7a: number | null;
  rad_wais_mcoi_7b: number | null;
  rad_wais_mcoi_8a: number | null;
  rad_wais_mcoi_8b: number | null;
  
  // ==========================================
  // Ordre Croissant (Ascending) - 8 items, 2 trials each
  // ==========================================
  rad_wais_mcoc_1a: number | null;
  rad_wais_mcoc_1b: number | null;
  rad_wais_mcoc_2a: number | null;
  rad_wais_mcoc_2b: number | null;
  rad_wais_mcoc_3a: number | null;
  rad_wais_mcoc_3b: number | null;
  rad_wais_mcoc_4a: number | null;
  rad_wais_mcoc_4b: number | null;
  rad_wais_mcoc_5a: number | null;
  rad_wais_mcoc_5b: number | null;
  rad_wais_mcoc_6a: number | null;
  rad_wais_mcoc_6b: number | null;
  rad_wais_mcoc_7a: number | null;
  rad_wais_mcoc_7b: number | null;
  rad_wais_mcoc_8a: number | null;
  rad_wais_mcoc_8b: number | null;
  
  // ==========================================
  // Computed Item Scores (trial_a + trial_b, 0-2)
  // ==========================================
  wais_mcod_1: number | null;
  wais_mcod_2: number | null;
  wais_mcod_3: number | null;
  wais_mcod_4: number | null;
  wais_mcod_5: number | null;
  wais_mcod_6: number | null;
  wais_mcod_7: number | null;
  wais_mcod_8: number | null;
  
  wais_mcoi_1: number | null;
  wais_mcoi_2: number | null;
  wais_mcoi_3: number | null;
  wais_mcoi_4: number | null;
  wais_mcoi_5: number | null;
  wais_mcoi_6: number | null;
  wais_mcoi_7: number | null;
  wais_mcoi_8: number | null;
  
  wais_mcoc_1: number | null;
  wais_mcoc_2: number | null;
  wais_mcoc_3: number | null;
  wais_mcoc_4: number | null;
  wais_mcoc_5: number | null;
  wais_mcoc_6: number | null;
  wais_mcoc_7: number | null;
  wais_mcoc_8: number | null;
  
  // ==========================================
  // Computed Section Totals
  // ==========================================
  wais_mcod_tot: number | null;  // Total Ordre Direct (0-16)
  wais_mcoi_tot: number | null;  // Total Ordre Inverse (0-16)
  wais_mcoc_tot: number | null;  // Total Ordre Croissant (0-16)
  
  // ==========================================
  // Computed Spans
  // ==========================================
  wais_mc_end: number | null;    // Empan endroit (forward span)
  wais_mc_env: number | null;    // Empan envers (backward span)
  wais_mc_cro: number | null;    // Empan croissant (ascending span)
  wais_mc_emp: number | null;    // Empan difference (end - env)
  
  // ==========================================
  // Computed Span Z-Scores
  // ==========================================
  wais_mc_end_std: number | null;  // Forward span Z-score
  wais_mc_env_std: number | null;  // Backward span Z-score
  wais_mc_cro_std: number | null;  // Ascending span Z-score
  
  // ==========================================
  // Computed Total Scores
  // ==========================================
  wais_mc_tot: number | null;    // Total raw score (0-48)
  wais_mc_std: number | null;    // Age-adjusted standard score (1-19)
  wais_mc_cr: number | null;     // Standardized value: (std - 10) / 3
  
  // ==========================================
  // Metadata
  // ==========================================
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaWais4MemoireChiffresResponseInsert = Omit<
  SchizophreniaWais4MemoireChiffresResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  // Computed item scores
  'wais_mcod_1' | 'wais_mcod_2' | 'wais_mcod_3' | 'wais_mcod_4' |
  'wais_mcod_5' | 'wais_mcod_6' | 'wais_mcod_7' | 'wais_mcod_8' |
  'wais_mcoi_1' | 'wais_mcoi_2' | 'wais_mcoi_3' | 'wais_mcoi_4' |
  'wais_mcoi_5' | 'wais_mcoi_6' | 'wais_mcoi_7' | 'wais_mcoi_8' |
  'wais_mcoc_1' | 'wais_mcoc_2' | 'wais_mcoc_3' | 'wais_mcoc_4' |
  'wais_mcoc_5' | 'wais_mcoc_6' | 'wais_mcoc_7' | 'wais_mcoc_8' |
  // Computed section totals
  'wais_mcod_tot' | 'wais_mcoi_tot' | 'wais_mcoc_tot' |
  // Computed spans
  'wais_mc_end' | 'wais_mc_env' | 'wais_mc_cro' | 'wais_mc_emp' |
  // Computed span Z-scores
  'wais_mc_end_std' | 'wais_mc_env_std' | 'wais_mc_cro_std' |
  // Computed total scores
  'wais_mc_tot' | 'wais_mc_std' | 'wais_mc_cr'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Conditions
// ============================================================================

// Show item questions only when test is done
const SHOW_WHEN_TEST_DONE = { '==': [{ 'var': 'test_done' }, 'oui'] };

// ============================================================================
// Response Options
// ============================================================================

const TRIAL_OPTIONS = [
  { code: 0, label: '0 - Échec', score: 0 },
  { code: 1, label: '1 - Réussite', score: 1 },
];

// ============================================================================
// Item Sequences (as specified in the questionnaire description)
// ============================================================================

const DIRECT_ITEMS = [
  { item: 1, span: 2, seq_a: '9-7', seq_b: '6-3' },
  { item: 2, span: 3, seq_a: '5-8-2', seq_b: '6-9-4' },
  { item: 3, span: 4, seq_a: '7-2-8-6', seq_b: '6-4-3-9' },
  { item: 4, span: 5, seq_a: '4-2-7-3-1', seq_b: '7-5-8-3-6' },
  { item: 5, span: 6, seq_a: '3-9-2-4-8-7', seq_b: '6-1-9-4-7-3' },
  { item: 6, span: 7, seq_a: '4-1-7-9-3-8-6', seq_b: '6-9-1-7-4-2-8' },
  { item: 7, span: 8, seq_a: '3-8-2-9-6-1-7-4', seq_b: '5-8-1-3-2-6-4-7' },
  { item: 8, span: 9, seq_a: '2-7-5-8-6-3-1-9-4', seq_b: '7-1-3-9-4-2-5-6-8' },
];

const INVERSE_ITEMS = [
  { item: 1, span: 2, seq_a: '3-1', seq_b: '2-4' },
  { item: 2, span: 2, seq_a: '4-6', seq_b: '5-7' },
  { item: 3, span: 3, seq_a: '6-2-9', seq_b: '4-7-5' },
  { item: 4, span: 4, seq_a: '8-2-7-9', seq_b: '4-9-6-8' },
  { item: 5, span: 5, seq_a: '6-5-8-4-3', seq_b: '1-5-4-8-6' },
  { item: 6, span: 6, seq_a: '5-3-7-4-1-8', seq_b: '7-2-4-8-5-6' },
  { item: 7, span: 7, seq_a: '8-1-4-9-3-6-2', seq_b: '4-7-3-9-6-2-8' },
  { item: 8, span: 8, seq_a: '9-4-3-7-6-2-1-8', seq_b: '7-2-8-1-5-6-4-3' },
];

const CROISSANT_ITEMS = [
  { item: 1, span: 2, seq_a: '1-2', exp_a: '1-2', seq_b: '4-2', exp_b: '2-4' },
  { item: 2, span: 3, seq_a: '3-1-6', exp_a: '1-3-6', seq_b: '0-9-4', exp_b: '0-4-9' },
  { item: 3, span: 4, seq_a: '8-7-9-2', exp_a: '2-7-8-9', seq_b: '4-8-7-1', exp_b: '1-4-7-8' },
  { item: 4, span: 5, seq_a: '2-6-9-1-7', exp_a: '1-2-6-7-9', seq_b: '3-8-3-5-8', exp_b: '3-3-5-8-8' },
  { item: 5, span: 6, seq_a: '2-1-7-4-3-6', exp_a: '1-2-3-4-6-7', seq_b: '6-2-5-2-3-4', exp_b: '2-2-3-4-5-6' },
  { item: 6, span: 7, seq_a: '7-5-7-6-8-6-2', exp_a: '2-5-6-6-7-7-8', seq_b: '4-8-2-5-4-3-5', exp_b: '2-3-4-4-5-5-8' },
  { item: 7, span: 8, seq_a: '5-8-7-2-7-5-4-5', exp_a: '2-4-5-5-5-7-7-8', seq_b: '9-4-9-7-3-0-8-4', exp_b: '0-3-4-4-7-8-9-9' },
  { item: 8, span: 9, seq_a: '5-0-1-1-3-2-1-0-5', exp_a: '0-0-1-1-1-2-3-5-5', seq_b: '2-7-1-4-8-4-2-9-6', exp_b: '1-2-2-4-4-6-7-8-9' },
];

// ============================================================================
// Question Generator Functions
// ============================================================================

function createDirectQuestions(): Question[] {
  const questions: Question[] = [];
  
  for (const item of DIRECT_ITEMS) {
    // Trial A
    questions.push({
      id: `rad_wais_mcod_${item.item}a`,
      section: 'Empan de chiffres en ordre direct',
      text: `Item ${item.item} - Essai A: ${item.seq_a} (${item.span} chiffres)`,
      type: 'single_choice',
      required: item.item <= 2,
      options: TRIAL_OPTIONS,
      display_if: SHOW_WHEN_TEST_DONE,
      help: 'Le patient répète la séquence telle qu\'elle est présentée',
    });
    
    // Trial B
    questions.push({
      id: `rad_wais_mcod_${item.item}b`,
      section: 'Empan de chiffres en ordre direct',
      text: `Item ${item.item} - Essai B: ${item.seq_b} (${item.span} chiffres)`,
      type: 'single_choice',
      required: item.item <= 2,
      options: TRIAL_OPTIONS,
      display_if: SHOW_WHEN_TEST_DONE,
    });
  }
  
  return questions;
}

function createInverseQuestions(): Question[] {
  const questions: Question[] = [];
  
  for (const item of INVERSE_ITEMS) {
    // Trial A
    questions.push({
      id: `rad_wais_mcoi_${item.item}a`,
      section: 'Empan de chiffres en ordre inverse',
      text: `Item ${item.item} - Essai A: ${item.seq_a} (${item.span} chiffres)`,
      type: 'single_choice',
      required: item.item <= 2,
      options: TRIAL_OPTIONS,
      display_if: SHOW_WHEN_TEST_DONE,
      help: 'Le patient répète la séquence dans l\'ordre inverse',
    });
    
    // Trial B
    questions.push({
      id: `rad_wais_mcoi_${item.item}b`,
      section: 'Empan de chiffres en ordre inverse',
      text: `Item ${item.item} - Essai B: ${item.seq_b} (${item.span} chiffres)`,
      type: 'single_choice',
      required: item.item <= 2,
      options: TRIAL_OPTIONS,
      display_if: SHOW_WHEN_TEST_DONE,
    });
  }
  
  return questions;
}

function createCroissantQuestions(): Question[] {
  const questions: Question[] = [];
  
  for (const item of CROISSANT_ITEMS) {
    // Trial A
    questions.push({
      id: `rad_wais_mcoc_${item.item}a`,
      section: 'Empan de chiffres en ordre croissant',
      text: `Item ${item.item} - Essai A: ${item.seq_a} → ${item.exp_a} (${item.span} chiffres)`,
      type: 'single_choice',
      required: item.item <= 2,
      options: TRIAL_OPTIONS,
      display_if: SHOW_WHEN_TEST_DONE,
      help: 'Le patient réordonne les chiffres dans l\'ordre croissant',
    });
    
    // Trial B
    questions.push({
      id: `rad_wais_mcoc_${item.item}b`,
      section: 'Empan de chiffres en ordre croissant',
      text: `Item ${item.item} - Essai B: ${item.seq_b} → ${item.exp_b} (${item.span} chiffres)`,
      type: 'single_choice',
      required: item.item <= 2,
      options: TRIAL_OPTIONS,
      display_if: SHOW_WHEN_TEST_DONE,
    });
  }
  
  return questions;
}

// ============================================================================
// Questions Dictionary
// ============================================================================

export const WAIS4_MEMOIRE_CHIFFRES_SZ_QUESTIONS: Question[] = [
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
    text: 'Évaluation de la mémoire de travail à travers trois conditions : Ordre direct (répéter tel quel), Ordre inverse (répéter à l\'envers), et Ordre croissant (réordonner du plus petit au plus grand). Administrer toutes les épreuves sauf en cas d\'échec aux deux essais d\'un item.',
    type: 'instruction',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
  },
  
  // Section: Ordre Direct
  {
    id: 'section_direct',
    section: 'Empan de chiffres en ordre direct',
    text: 'Le patient répète les chiffres dans l\'ordre présenté. Attente auditive et mémoire immédiate.',
    type: 'instruction',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
  },
  ...createDirectQuestions(),
  
  // Section: Ordre Inverse
  {
    id: 'section_inverse',
    section: 'Empan de chiffres en ordre inverse',
    text: 'Le patient répète les chiffres dans l\'ordre inverse. Manipulation en mémoire de travail.',
    type: 'instruction',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
  },
  ...createInverseQuestions(),
  
  // Section: Ordre Croissant
  {
    id: 'section_croissant',
    section: 'Empan de chiffres en ordre croissant',
    text: 'Le patient réordonne les chiffres dans l\'ordre croissant. Manipulation mentale et séquençage (spécifique WAIS-IV).',
    type: 'instruction',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
  },
  ...createCroissantQuestions(),
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

export const WAIS4_MEMOIRE_CHIFFRES_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'wais4_memoire_chiffres_sz',
  code: 'WAIS4_MEMOIRE_CHIFFRES_SZ',
  title: 'WAIS-IV Subtest Mémoire des chiffres',
  description: 'Sous-test de mémoire de travail évaluant l\'attention, la concentration et la manipulation mentale à travers le rappel de chiffres dans trois conditions : ordre direct, inverse et croissant.',
  instructions: 'Administrer les trois conditions dans l\'ordre. Pour chaque condition, présenter les séquences à un rythme d\'un chiffre par seconde. Arrêter une condition si le patient échoue aux deux essais d\'un même item. Coter 0 (échec) ou 1 (réussite) pour chaque essai.',
  questions: WAIS4_MEMOIRE_CHIFFRES_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    reference: 'WAIS-IV (Wechsler, 2008)',
    scoringNote: 'Score brut total (0-48) → Note standard (1-19) via table normative selon l\'âge → Valeur standardisée (z-score) = (Note standard - 10) / 3. Z-scores calculés pour chaque empan.',
    contributes_to: ['IMT', 'QI'],
    subtests: {
      direct: { label: 'Ordre Direct', items: 8, trials: 16, cognitive_process: 'Attention auditive' },
      inverse: { label: 'Ordre Inverse', items: 8, trials: 16, cognitive_process: 'Mémoire de travail' },
      croissant: { label: 'Ordre Croissant', items: 8, trials: 16, cognitive_process: 'Manipulation mentale + séquençage' },
    },
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
      clinical_significance: 'Les déficits de mémoire de travail sont fréquemment observés dans la schizophrénie et sont associés à des difficultés fonctionnelles. La différence entre l\'empan endroit et l\'empan envers informe sur la manipulation vs le simple stockage.',
    },
  },
};
