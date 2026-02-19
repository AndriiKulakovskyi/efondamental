// eFondaMental Platform - Stroop Test (Golden 1978)
// Schizophrenia Initial Evaluation - Neuropsy Module - Bloc 2
// Reference: Golden, C. J. (1978). Stroop Color and Word Test.

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaStroopResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Demographics for scoring
  patient_age?: number | null;
  years_of_education?: number | null;
  patient_gender?: string | null;
  // Planche A - Mots (Words read in 45s)
  stroop_w_tot: number | null;
  stroop_w_cor?: number | null;
  stroop_w_err?: number | null;
  stroop_w_tot_c?: number | null;
  stroop_w_note_t?: number | null;
  stroop_w_note_t_corrigee?: number | null;
  // Planche B - Couleurs (Colors named in 45s)
  stroop_c_tot: number | null;
  stroop_c_cor?: number | null;
  stroop_c_err?: number | null;
  stroop_c_tot_c?: number | null;
  stroop_c_note_t?: number | null;
  stroop_c_note_t_corrigee?: number | null;
  // Planche C - Mots/Couleurs (Color-words named in 45s)
  stroop_cw_tot: number | null;
  stroop_cw_cor?: number | null;
  stroop_cw_err?: number | null;
  stroop_cw_tot_c?: number | null;
  stroop_cw_note_t?: number | null;
  stroop_cw_note_t_corrigee?: number | null;
  // Interference
  stroop_interf?: number | null;
  stroop_interf_note_t?: number | null;
  stroop_interf_note_tz?: number | null;
  // Test status
  test_done: boolean;
  questionnaire_version?: string | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaStroopResponseInsert = Omit<
  SchizophreniaStroopResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  'stroop_w_tot_c' | 'stroop_c_tot_c' | 'stroop_cw_tot_c' |
  'stroop_interf' |
  'stroop_w_note_t' | 'stroop_c_note_t' | 'stroop_cw_note_t' | 'stroop_interf_note_t' |
  'stroop_w_note_t_corrigee' | 'stroop_c_note_t_corrigee' | 'stroop_cw_note_t_corrigee' | 'stroop_interf_note_tz'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

const SHOW_WHEN_TEST_DONE = { '==': [{ 'var': 'test_done' }, 'oui'] };

export const STROOP_SZ_QUESTIONS: Question[] = [
  {
    id: 'test_done',
    text: 'Test fait',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui', score: 0 },
      { code: 'non', label: 'Non', score: 1 }
    ]
  },

  // Planche A - Mots (Words)
  {
    id: 'section_mots',
    text: 'Planche A - Mots (Lecture)',
    type: 'section',
    required: false,
    help: 'Lecture de mots de couleurs imprimés en noir (ROUGE, BLEU, VERT). Le patient lit le maximum de mots en 45 secondes.',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'stroop_w_tot',
    text: 'Nombre total de mots lus en 45 secondes',
    type: 'number',
    required: true,
    min: 0,
    help: 'Nombre de mots correctement lus en 45 secondes',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'stroop_w_cor',
    text: 'Nombre d\'erreurs corrigées',
    type: 'number',
    required: false,
    min: 0,
    help: 'Erreurs que le patient a corrigées lui-même',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'stroop_w_err',
    text: 'Nombre d\'erreurs non corrigées',
    type: 'number',
    required: false,
    min: 0,
    help: 'Erreurs non corrigées par le patient',
    display_if: SHOW_WHEN_TEST_DONE
  },

  // Planche B - Couleurs (Colors)
  {
    id: 'section_couleurs',
    text: 'Planche B - Couleurs (Dénomination)',
    type: 'section',
    required: false,
    help: 'Dénomination de la couleur de rectangles colorés. Le patient nomme le maximum de couleurs en 45 secondes.',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'stroop_c_tot',
    text: 'Nombre total de couleurs nommées en 45 secondes',
    type: 'number',
    required: true,
    min: 0,
    help: 'Nombre de couleurs correctement nommées en 45 secondes',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'stroop_c_cor',
    text: 'Nombre d\'erreurs corrigées',
    type: 'number',
    required: false,
    min: 0,
    help: 'Erreurs que le patient a corrigées lui-même',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'stroop_c_err',
    text: 'Nombre d\'erreurs non corrigées',
    type: 'number',
    required: false,
    min: 0,
    help: 'Erreurs non corrigées par le patient',
    display_if: SHOW_WHEN_TEST_DONE
  },

  // Planche C - Mots/Couleurs (Interference)
  {
    id: 'section_interference',
    text: 'Planche C - Interférence (Mots/Couleurs)',
    type: 'section',
    required: false,
    help: 'Dénomination de la couleur de l\'encre de mots de couleurs (ex: "ROUGE" écrit en bleu → réponse "bleu"). Le patient nomme le maximum en 45 secondes.',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'stroop_cw_tot',
    text: 'Nombre total de réponses correctes en 45 secondes',
    type: 'number',
    required: true,
    min: 0,
    help: 'Nombre de couleurs d\'encre correctement nommées en 45 secondes',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'stroop_cw_cor',
    text: 'Nombre d\'erreurs corrigées',
    type: 'number',
    required: false,
    min: 0,
    help: 'Erreurs que le patient a corrigées lui-même',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'stroop_cw_err',
    text: 'Nombre d\'erreurs non corrigées',
    type: 'number',
    required: false,
    min: 0,
    help: 'Erreurs non corrigées par le patient',
    display_if: SHOW_WHEN_TEST_DONE
  }
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
    [key: string]: any;
  };
}

export const STROOP_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'stroop_sz',
  code: 'STROOP_SZ',
  title: 'Test de Stroop',
  description: 'Test de Stroop (Golden 1978) - Évaluation de l\'attention sélective et de l\'inhibition cognitive.',
  instructions: 'Le clinicien administre trois planches : Planche A (lecture de mots de couleurs en noir), Planche B (dénomination de couleurs de rectangles), Planche C (dénomination de la couleur de l\'encre de mots incongruents). Chaque planche dure 45 secondes.',
  questions: STROOP_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    reference: 'Golden, C. J. (1978). Stroop Color and Word Test: A Manual for Clinical and Experimental Uses.'
  }
};
