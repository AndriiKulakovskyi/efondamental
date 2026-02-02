// eFondaMental Platform - Test des Commissions
// Schizophrenia Initial Evaluation - Neuropsy Module - Bloc 2
// Evaluates planning and executive functions through a simulated errand-planning task

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaCommissionsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Demographics for scoring
  patient_age?: number | null;
  nsc?: number | null;  // Education level: 0 = lower, 1 = higher (Bac+)
  // Raw inputs
  com01: number | null;  // Completion time in minutes
  com02: number | null;  // Unnecessary detours
  com03: number | null;  // Schedule/time violations
  com04: number | null;  // Logic errors
  com05: string | null;  // Sequence of errands (free text)
  // Time scores
  com01s1: string | null;   // Time percentile
  com01s2: number | null;   // Time Z-score
  // Detours scores
  com02s1: string | null;   // Detours percentile
  com02s2: number | null;   // Detours Z-score
  // Schedule violations scores
  com03s1: string | null;   // Schedule violations percentile
  com03s2: number | null;   // Schedule violations Z-score
  // Logic errors scores
  com04s1: string | null;   // Logic errors percentile
  com04s2: number | null;   // Logic errors Z-score
  // Total errors
  com04s3: number | null;   // Total errors (com02 + com03 + com04)
  com04s4: string | null;   // Total errors percentile
  com04s5: number | null;   // Total errors Z-score
  // Test status
  test_done: boolean;
  questionnaire_version?: string | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaCommissionsResponseInsert = Omit<
  SchizophreniaCommissionsResponse,
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

export const COMMISSIONS_SZ_QUESTIONS: Question[] = [
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

  // Demographics Section
  // Note: patient_age is silently injected from patient profile
  {
    id: 'section_demographics',
    text: 'Niveau d\'étude',
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'nsc',
    text: 'Niveau d\'étude (NSC)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Niveau inférieur (< Baccalauréat)', score: 0 },
      { code: 1, label: 'Niveau supérieur (≥ Baccalauréat)', score: 1 }
    ],
    help: 'Le niveau d\'étude est nécessaire pour calculer les scores normalisés',
    display_if: SHOW_WHEN_TEST_DONE
  },

  // Raw Inputs Section
  {
    id: 'section_raw_inputs',
    text: 'Résultats du test',
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'com01',
    text: 'Temps de réalisation (en minutes)',
    type: 'number',
    required: true,
    min: 0,
    help: 'Temps pour compléter la tâche de planification des commissions',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'com02',
    text: 'Nombre de détours inutiles',
    type: 'number',
    required: true,
    min: 0,
    help: 'Nombre de détours non nécessaires dans le trajet planifié',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'com03',
    text: 'Nombre de trajets avec non respect des horaires',
    type: 'number',
    required: true,
    min: 0,
    help: 'Nombre de trajets qui ne respectent pas les contraintes horaires données',
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'com04',
    text: 'Nombre d\'erreurs logiques',
    type: 'number',
    required: true,
    min: 0,
    help: 'Nombre d\'erreurs logiques dans le trajet planifié',
    display_if: SHOW_WHEN_TEST_DONE
  },

  // Sequence Section
  {
    id: 'section_sequence',
    text: 'Séquence des commissions',
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'com05',
    text: 'Séquence des commissions réalisées par le patient',
    type: 'text',
    required: false,
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

export const COMMISSIONS_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'commissions_sz',
  code: 'COMMISSIONS_SZ',
  title: 'Test des Commissions',
  description: 'Évaluation des fonctions exécutives et de planification à travers une tâche simulée de planification de courses. Le patient doit planifier un trajet optimal pour effectuer des commissions en respectant des contraintes horaires.',
  instructions: 'Le clinicien présente au patient une carte avec différents commerces et des horaires d\'ouverture. Le patient doit planifier le trajet le plus efficace pour effectuer toutes les commissions en respectant les contraintes de temps.',
  questions: COMMISSIONS_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    reference: 'Test des Commissions - Évaluation neuropsychologique',
    ageRange: { min: 20, max: 60 },
    ageWarning: 'L\'âge doit être entre 20 et 60 ans pour un scoring normatif valide'
  }
};
