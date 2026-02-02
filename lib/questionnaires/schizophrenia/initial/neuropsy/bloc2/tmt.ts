// eFondaMental Platform - TMT (Trail Making Test)
// Schizophrenia Initial Evaluation - Neuropsy Module - Bloc 2
// Reference: Reitan, R. M. (1955)

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaTmtResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Demographics for scoring
  patient_age?: number | null;
  years_of_education?: number | null;
  // Part A raw inputs
  tmta_tps: number | null;       // Time in seconds
  tmta_err: number | null;       // Uncorrected errors
  tmta_cor: number | null;       // Corrected errors
  // Part B raw inputs
  tmtb_tps: number | null;       // Time in seconds
  tmtb_err: number | null;       // Uncorrected errors
  tmtb_cor: number | null;       // Corrected errors
  tmtb_err_persev: number | null; // Perseverative errors
  // Computed totals
  tmta_errtot: number | null;    // Part A total errors
  tmtb_errtot: number | null;    // Part B total errors
  tmt_b_a_tps: number | null;    // B-A time difference
  tmt_b_a_err: number | null;    // B-A error difference
  // Part A standardized scores
  tmta_tps_z: number | null;     // Z-score for time
  tmta_tps_pc: string | null;    // Percentile for time
  tmta_errtot_z: number | null;  // Z-score for total errors
  tmta_errtot_pc: string | null; // Percentile for total errors
  // Part B standardized scores
  tmtb_tps_z: number | null;     // Z-score for time
  tmtb_tps_pc: string | null;    // Percentile for time
  tmtb_errtot_z: number | null;  // Z-score for total errors
  tmtb_errtot_pc: string | null; // Percentile for total errors
  tmtb_err_persev_z: number | null;  // Z-score for perseverative errors
  tmtb_err_persev_pc: string | null; // Percentile for perseverative errors
  // B-A standardized scores
  tmt_b_a_tps_z: number | null;  // Z-score for time difference
  tmt_b_a_tps_pc: string | null; // Percentile for time difference
  tmt_b_a_err_z: number | null;  // Z-score for error difference
  tmt_b_a_err_pc: string | null; // Percentile for error difference
  // Test status
  test_done: boolean;
  questionnaire_version?: string | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaTmtResponseInsert = Omit<
  SchizophreniaTmtResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

// Condition to show questions only when test is done (test_done === 'oui')
// Uses JSONLogic format: { '==': [{ 'var': 'field_name' }, 'value'] }
const SHOW_WHEN_TEST_DONE = { '==': [{ 'var': 'test_done' }, 'oui'] };

export const TMT_SZ_QUESTIONS: Question[] = [
  // Test done option - Select Oui/Non
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

  // Part A Section
  // Note: Demographics (patient_age, years_of_education) are silently
  // injected from patient profile - not shown in the form but used for scoring
  {
    id: 'section_part_a',
    text: 'TMT Partie A',
    type: 'section',
    required: false,
    help: 'Connecter les nombres de 1 à 25 dans l\'ordre séquentiel aussi rapidement que possible. Mesure la vitesse de traitement et le balayage visuel.',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'tmta_tps',
    text: 'Temps de réalisation (en secondes)',
    type: 'number',
    required: true,
    min: 0,
    help: 'Temps en secondes pour compléter la Partie A',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'tmta_cor',
    text: 'Nombre d\'erreurs corrigées',
    type: 'number',
    required: true,
    min: 0,
    help: 'Erreurs que le patient a corrigées lui-même',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'tmta_err',
    text: 'Nombre d\'erreurs non corrigées',
    type: 'number',
    required: true,
    min: 0,
    help: 'Erreurs non corrigées par le patient',
    display_if: SHOW_WHEN_TEST_DONE
  },

  // Part B Section
  {
    id: 'section_part_b',
    text: 'TMT Partie B',
    type: 'section',
    required: false,
    help: 'Alterner entre chiffres et lettres (1-A-2-B-3-C...) aussi rapidement que possible. Mesure la flexibilité cognitive et le contrôle exécutif.',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'tmtb_tps',
    text: 'Temps de réalisation (en secondes)',
    type: 'number',
    required: true,
    min: 0,
    help: 'Temps en secondes pour compléter la Partie B',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'tmtb_cor',
    text: 'Nombre d\'erreurs corrigées',
    type: 'number',
    required: true,
    min: 0,
    help: 'Erreurs que le patient a corrigées lui-même',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'tmtb_err',
    text: 'Nombre d\'erreurs non corrigées',
    type: 'number',
    required: true,
    min: 0,
    help: 'Erreurs non corrigées par le patient',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'tmtb_err_persev',
    text: 'Nombre d\'erreurs persévératives',
    type: 'number',
    required: true,
    min: 0,
    help: 'Erreurs où le patient continue dans la même catégorie au lieu d\'alterner',
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

export const TMT_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'tmt_sz',
  code: 'TMT_SZ',
  title: 'TMT (Trail Making Test)',
  description: 'Trail Making Test - Évaluation de l\'attention visuelle, la vitesse de traitement et les fonctions exécutives. Référence : Reitan (1955).',
  instructions: 'Le clinicien administre deux parties : Partie A (connecter les nombres 1-25 dans l\'ordre) et Partie B (alterner entre chiffres et lettres 1-A-2-B-3-C...). Chronométrer le temps et compter les erreurs.',
  questions: TMT_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    reference: 'Reitan, R. M. (1955). The relation of the Trail Making Test to organic brain damage.'
  }
};
