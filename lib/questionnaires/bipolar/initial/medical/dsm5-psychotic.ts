// eFondaMental Platform - DSM5 Psychotic Disorders (DSM5_PSYCHOTIC)
// Bipolar Initial Evaluation - Medical Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarDsm5PsychoticResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  has_psychotic_disorder: string | null;
  psychotic_disorder_date: string | null;
  disorder_type: string | null;
  symptoms_past_month: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarDsm5PsychoticResponseInsert = Omit<
  BipolarDsm5PsychoticResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const DSM5_PSYCHOTIC_QUESTIONS: Question[] = [
  {
    id: 'has_psychotic_disorder',
    text: 'Le patient a-t-il un trouble psychotique?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'psychotic_disorder_date',
    text: 'Date de survenue du trouble psychotique',
    type: 'date',
    required: false,
    display_if: { '==': [{ var: 'has_psychotic_disorder' }, 'oui'] }
  },
  {
    id: 'disorder_type',
    text: 'Type de trouble',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_psychotic_disorder' }, 'oui'] },
    options: [
      { code: 'schizophrenie', label: 'Schizophrenie' },
      { code: 'trouble_schizophreniforme', label: 'Trouble schizophreniforme' },
      { code: 'trouble_schizo_affectif', label: 'Trouble schizo-affectif' },
      { code: 'troubles_delirants', label: 'Troubles delirants' },
      { code: 'trouble_psychotique_bref', label: 'Trouble psychotique bref' },
      { code: 'trouble_psychotique_partage', label: 'Trouble psychotique partage' },
      { code: 'trouble_psychotique_affection_medicale', label: 'Trouble psychotique induit par une affection medicale generale' },
      { code: 'trouble_psychotique_substance', label: 'Trouble psychotique induit par une substance' },
      { code: 'trouble_psychotique_non_specifie', label: 'Trouble psychotique non specifie' }
    ]
  },
  {
    id: 'symptoms_past_month',
    text: 'Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_psychotic_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
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
    [key: string]: any;
  };
}

export const DSM5_PSYCHOTIC_DEFINITION: QuestionnaireDefinition = {
  id: 'dsm5_psychotic',
  code: 'DSM5_PSYCHOTIC',
  title: 'DSM5 - Trouble Psychotique',
  description: 'Diagnostic DSM5 des troubles psychotiques pour l\'evaluation initiale du trouble bipolaire',
  questions: DSM5_PSYCHOTIC_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
