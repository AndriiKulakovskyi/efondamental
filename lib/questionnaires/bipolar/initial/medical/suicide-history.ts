// eFondaMental Platform - Suicide History (SUICIDE_HISTORY)
// Bipolar Initial Evaluation - Medical Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarSuicideHistoryResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  has_suicide_attempt: string | null;
  num_attempts: number | null;
  age_first_attempt: number | null;
  age_most_recent_attempt: number | null;
  methods_used: string[] | null;
  most_severe_method: string | null;
  most_severe_medical_consequences: string | null;
  hospitalizations_after_attempt: string | null;
  num_hospitalizations_after_attempt: number | null;
  family_history_suicide: string | null;
  family_member_suicide: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarSuicideHistoryResponseInsert = Omit<
  BipolarSuicideHistoryResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const SUICIDE_HISTORY_QUESTIONS: Question[] = [
  {
    id: 'has_suicide_attempt',
    text: 'Le patient a-t-il deja fait une tentative de suicide?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'num_attempts',
    text: 'Nombre total de tentatives de suicide',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'has_suicide_attempt' }, 'oui'] }
  },
  {
    id: 'age_first_attempt',
    text: 'Age lors de la premiere tentative',
    type: 'number',
    required: false,
    min: 1,
    max: 120,
    display_if: { '==': [{ var: 'has_suicide_attempt' }, 'oui'] }
  },
  {
    id: 'age_most_recent_attempt',
    text: 'Age lors de la tentative la plus recente',
    type: 'number',
    required: false,
    min: 1,
    max: 120,
    display_if: { '==': [{ var: 'has_suicide_attempt' }, 'oui'] }
  },
  {
    id: 'methods_used',
    text: 'Methodes utilisees (selection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'has_suicide_attempt' }, 'oui'] },
    options: [
      'Intoxication medicamenteuse',
      'Intoxication autre substance',
      'Phlébotomie (coupures)',
      'Pendaison/Strangulation',
      'Arme a feu',
      'Saut dans le vide',
      'Noyade',
      'Collision vehicule',
      'Autre'
    ]
  },
  {
    id: 'most_severe_method',
    text: 'Methode la plus severe utilisee',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_suicide_attempt' }, 'oui'] },
    options: [
      { code: 'intox_med', label: 'Intoxication medicamenteuse' },
      { code: 'intox_autre', label: 'Intoxication autre substance' },
      { code: 'phlebotomie', label: 'Phlébotomie (coupures)' },
      { code: 'pendaison', label: 'Pendaison/Strangulation' },
      { code: 'arme_feu', label: 'Arme a feu' },
      { code: 'saut', label: 'Saut dans le vide' },
      { code: 'noyade', label: 'Noyade' },
      { code: 'collision', label: 'Collision vehicule' },
      { code: 'autre', label: 'Autre' }
    ]
  },
  {
    id: 'most_severe_medical_consequences',
    text: 'Consequences medicales les plus severes',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_suicide_attempt' }, 'oui'] },
    options: [
      { code: 'aucune', label: 'Aucune consequence medicale' },
      { code: 'legere', label: 'Consequences legeres (pas de soins medicaux)' },
      { code: 'moderee', label: 'Consequences moderees (soins aux urgences)' },
      { code: 'grave', label: 'Consequences graves (hospitalisation)' },
      { code: 'tres_grave', label: 'Consequences tres graves (soins intensifs)' }
    ]
  },
  {
    id: 'hospitalizations_after_attempt',
    text: 'Y a-t-il eu des hospitalisations suite a une tentative?',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_suicide_attempt' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'num_hospitalizations_after_attempt',
    text: 'Nombre d\'hospitalisations suite a une tentative',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'hospitalizations_after_attempt' }, 'oui'] }
  },
  {
    id: 'section_family',
    text: 'Antecedents familiaux',
    type: 'section',
    required: false
  },
  {
    id: 'family_history_suicide',
    text: 'Y a-t-il des antecedents familiaux de suicide ou tentative de suicide?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'family_member_suicide',
    text: 'Preciser le lien de parente',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'family_history_suicide' }, 'oui'] }
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

export const SUICIDE_HISTORY_DEFINITION: QuestionnaireDefinition = {
  id: 'suicide_history',
  code: 'SUICIDE_HISTORY',
  title: 'Antecedents Suicidaires',
  description: 'Recueil des antecedents de tentatives de suicide et des antecedents familiaux de suicide.',
  questions: SUICIDE_HISTORY_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
