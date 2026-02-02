// eFondaMental Platform - CVLT (California Verbal Learning Test)
// Schizophrenia Initial Evaluation - Neuropsy Module - Bloc 2
// French adaptation: Deweer et al. (2008)

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaCvltResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Demographics for scoring
  patient_age?: number | null;
  years_of_education?: number | null;
  patient_sex?: string | null;
  // Trial scores (List A - "Lundi")
  trial_1: number | null;
  trial_2: number | null;
  trial_3: number | null;
  trial_4: number | null;
  trial_5: number | null;
  total_1_5: number | null;
  // List B ("Mardi" - interference)
  list_b: number | null;
  // Short delay (sdfr = Short Delay Free Recall, sdcr = Short Delay Cued Recall)
  sdfr: number | null;
  sdcr: number | null;
  // Long delay (ldfr = Long Delay Free Recall, ldcr = Long Delay Cued Recall)
  ldfr: number | null;
  ldcr: number | null;
  // Clustering indices
  semantic_clustering: number | null;
  serial_clustering: number | null;
  // Errors
  perseverations: number | null;
  intrusions: number | null;
  // Recognition
  recognition_hits: number | null;
  false_positives: number | null;
  discriminability: number | null;
  // Position effects and bias
  primacy: number | null;
  recency: number | null;
  response_bias: number | null;
  // Delay time
  cvlt_delai: number | null;
  // Standardized scores (Z-scores or percentiles)
  trial_1_std: number | null;
  trial_5_std: string | null;
  total_1_5_std: number | null;
  list_b_std: number | null;
  sdfr_std: string | null;
  sdcr_std: string | null;
  ldfr_std: string | null;
  ldcr_std: string | null;
  semantic_std: string | null;
  serial_std: string | null;
  persev_std: string | null;
  intru_std: string | null;
  recog_std: string | null;
  false_recog_std: string | null;
  discrim_std: string | null;
  primacy_std: number | null;
  recency_std: string | null;
  bias_std: number | null;
  // Test status
  test_done: boolean;
  questionnaire_version?: string | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaCvltResponseInsert = Omit<
  SchizophreniaCvltResponse,
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

export const SZ_CVLT_QUESTIONS: Question[] = [
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

  // Learning Trials Section (List A - "Lundi")
  // Note: Demographics (patient_age, years_of_education, patient_sex) are silently
  // injected from patient profile - not shown in the form but used for scoring
  {
    id: 'section_learning',
    text: 'Rappel Liste A (Lundi)',
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'trial_1',
    text: 'Rappel 1 - Nombre de mots rappelés',
    type: 'number',
    required: true,
    min: 0,
    max: 16,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'trial_2',
    text: 'Rappel 2 - Nombre de mots rappelés',
    type: 'number',
    required: true,
    min: 0,
    max: 16,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'trial_3',
    text: 'Rappel 3 - Nombre de mots rappelés',
    type: 'number',
    required: true,
    min: 0,
    max: 16,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'trial_4',
    text: 'Rappel 4 - Nombre de mots rappelés',
    type: 'number',
    required: true,
    min: 0,
    max: 16,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'trial_5',
    text: 'Rappel 5 - Nombre de mots rappelés',
    type: 'number',
    required: true,
    min: 0,
    max: 16,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'total_1_5',
    text: 'Lundi total (somme des essais 1-5)',
    type: 'number',
    required: false,
    min: 0,
    max: 80,
    help: 'Somme des essais 1 a 5',
    display_if: SHOW_WHEN_TEST_DONE
  },

  // List B Section ("Mardi" - interference)
  {
    id: 'section_list_b',
    text: 'Liste B (Mardi - Interférence)',
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'list_b',
    text: 'Mardi - Nombre de mots rappelés',
    type: 'number',
    required: true,
    min: 0,
    max: 16,
    display_if: SHOW_WHEN_TEST_DONE
  },

  // Short Delay Section
  {
    id: 'section_short_delay',
    text: 'Rappels Court Terme (après Liste B)',
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'sdfr',
    text: 'Rappel libre à court terme',
    type: 'number',
    required: true,
    min: 0,
    max: 16,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'sdcr',
    text: 'Rappel indicé à court terme',
    type: 'number',
    required: true,
    min: 0,
    max: 16,
    display_if: SHOW_WHEN_TEST_DONE
  },

  // Long Delay Section
  {
    id: 'section_long_delay',
    text: 'Rappels Long Terme (après délai de 20 min)',
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'ldfr',
    text: 'Rappel libre à long terme',
    type: 'number',
    required: true,
    min: 0,
    max: 16,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'ldcr',
    text: 'Rappel indicé à long terme',
    type: 'number',
    required: true,
    min: 0,
    max: 16,
    display_if: SHOW_WHEN_TEST_DONE
  },

  // Clustering Indices Section
  {
    id: 'section_clustering',
    text: 'Indices de Regroupement',
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'semantic_clustering',
    text: 'Indice de regroupement sémantique',
    type: 'number',
    required: false,
    help: 'Valeur décimale (ex: 2.3)',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'serial_clustering',
    text: 'Indice de regroupement sériel',
    type: 'number',
    required: false,
    help: 'Valeur décimale (ex: 1.5)',
    display_if: SHOW_WHEN_TEST_DONE
  },

  // Errors Section
  {
    id: 'section_errors',
    text: 'Erreurs',
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'perseverations',
    text: 'Total persévérations',
    type: 'number',
    required: false,
    min: 0,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'intrusions',
    text: 'Total intrusions',
    type: 'number',
    required: false,
    min: 0,
    display_if: SHOW_WHEN_TEST_DONE
  },

  // Recognition Section
  {
    id: 'section_recognition',
    text: 'Reconnaissance',
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'recognition_hits',
    text: 'Reconnaissances correctes',
    type: 'number',
    required: true,
    min: 0,
    max: 16,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'false_positives',
    text: 'Fausses reconnaissances',
    type: 'number',
    required: true,
    min: 0,
    max: 28,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'discriminability',
    text: 'Discriminabilité (ex: 95.5)',
    type: 'number',
    required: false,
    min: 0,
    max: 100,
    help: 'Pourcentage de discriminabilité',
    display_if: SHOW_WHEN_TEST_DONE
  },

  // Position Effects and Bias Section
  {
    id: 'section_position_effects',
    text: 'Effets de Position & Biais',
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'primacy',
    text: 'Primauté (ex: pour 30%, saisir 30)',
    type: 'number',
    required: false,
    min: 0,
    max: 100,
    help: 'Pourcentage de mots de la région de primauté rappelés',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'recency',
    text: 'Récence (ex: pour 30%, saisir 30)',
    type: 'number',
    required: false,
    min: 0,
    max: 100,
    help: 'Pourcentage de mots de la région de récence rappelés',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'response_bias',
    text: 'Biais de réponse',
    type: 'number',
    required: false,
    help: 'Valeur décimale',
    display_if: SHOW_WHEN_TEST_DONE
  },

  // Other Section
  {
    id: 'section_other',
    text: 'Autres',
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'cvlt_delai',
    text: 'Délai entre 1ers rappels et rappels différés (pour 20 min, saisir 20)',
    type: 'number',
    required: false,
    min: 0,
    help: 'Délai en minutes',
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

export const SZ_CVLT_DEFINITION: QuestionnaireDefinition = {
  id: 'cvlt_sz',
  code: 'CVLT_SZ',
  title: 'CVLT (California Verbal Learning Test)',
  description: 'Test d\'apprentissage verbal de Californie - Évaluation de la mémoire verbale épisodique. Adaptation française : Deweer et al. (2008).',
  instructions: 'Le clinicien lit une liste de 16 mots (liste du Lundi) sur 5 essais d\'apprentissage, suivie d\'une liste d\'interférence (liste du Mardi), puis des rappels à court terme et à long terme.',
  questions: SZ_CVLT_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    reference: 'Deweer et al. (2008) - French adaptation'
  }
};
