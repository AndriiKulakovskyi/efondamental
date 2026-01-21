// eFondaMental Platform - Tea and Coffee Consumption (Schizophrenia)
// Assessment of tea and coffee consumption patterns

import { Question, QuestionOption } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaTeaCoffeeResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  tea_5a?: number | null;
  tea_5b?: '1_to_7' | 'less_than_once' | null;
  tea_5b1?: number | null;
  tea_6a?: number | null;
  tea_6b?: '1_to_7' | 'less_than_once' | null;
  tea_6b1?: number | null;
  coffee_5a?: number | null;
  coffee_5b?: '1_to_7' | 'less_than_once' | null;
  coffee_5b1?: number | null;
  coffee_6a?: number | null;
  coffee_6b?: '1_to_7' | 'less_than_once' | null;
  coffee_6b1?: number | null;
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaTeaCoffeeResponseInsert = Omit<
  SchizophreniaTeaCoffeeResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Response Options
// ============================================================================

const TEA_COFFEE_SZ_FREQUENCY_OPTIONS: QuestionOption[] = [
  { code: '1_to_7', label: '1 a 7 fois par semaine' },
  { code: 'less_than_once', label: 'Moins d\'une fois par semaine' }
];

const TEA_COFFEE_SZ_FREQUENCY_DETAIL_OPTIONS: QuestionOption[] = [
  { code: 1, label: '1 fois' },
  { code: 2, label: '2 fois' },
  { code: 3, label: '3 fois' },
  { code: 4, label: '4 fois' },
  { code: 5, label: '5 fois' },
  { code: 6, label: '6 fois' },
  { code: 7, label: '7 fois' }
];

// ============================================================================
// Questions
// ============================================================================

export const TEA_COFFEE_SZ_QUESTIONS: Question[] = [
  // TEA SECTION
  { id: 'section_tea', text: 'The', type: 'section', required: false },
  {
    id: 'tea_5a',
    text: 'Quantite consommees (en tasses/jour) par jour de consommation de the en moyenne, DURANT LES PERIODES DE CONSOMMATION MAXIMALE AU COURS DE LA VIE',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },
  {
    id: 'tea_5b',
    text: 'Frequence des consommations DURANT LES PERIODES DE CONSOMMATION MAXIMALES AU COURS DE LA VIE',
    type: 'single_choice',
    required: false,
    options: TEA_COFFEE_SZ_FREQUENCY_OPTIONS
  },
  {
    id: 'tea_5b1',
    text: 'Precisez le nombre de fois',
    type: 'single_choice',
    required: false,
    options: TEA_COFFEE_SZ_FREQUENCY_DETAIL_OPTIONS,
    display_if: { '==': [{ 'var': 'tea_5b' }, '1_to_7'] },
    indentLevel: 1
  },
  {
    id: 'tea_6a',
    text: 'Quantite de the (en tasses) consommees par jour de consommation en moyenne AU COURS DES 12 DERNIERS MOIS',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },
  {
    id: 'tea_6b',
    text: 'Frequence des consommations hebdomadaire AU COURS DES 12 DERNIERS MOIS',
    type: 'single_choice',
    required: false,
    options: TEA_COFFEE_SZ_FREQUENCY_OPTIONS
  },
  {
    id: 'tea_6b1',
    text: 'Precisez le nombre de fois',
    type: 'single_choice',
    required: false,
    options: TEA_COFFEE_SZ_FREQUENCY_DETAIL_OPTIONS,
    display_if: { '==': [{ 'var': 'tea_6b' }, '1_to_7'] },
    indentLevel: 1
  },

  // COFFEE SECTION
  { id: 'section_coffee', text: 'Cafe', type: 'section', required: false },
  {
    id: 'coffee_5a',
    text: 'Quantite consommees (en tasses) par jour de consommation de cafe en moyenne, DURANT LES PERIODES DE CONSOMMATION MAXIMALE AU COURS DE LA VIE',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },
  {
    id: 'coffee_5b',
    text: 'Frequence des consommations DURANT LES PERIODES DE CONSOMMATION MAXIMALES AU COURS DE LA VIE',
    type: 'single_choice',
    required: false,
    options: TEA_COFFEE_SZ_FREQUENCY_OPTIONS
  },
  {
    id: 'coffee_5b1',
    text: 'Precisez le nombre de fois',
    type: 'single_choice',
    required: false,
    options: TEA_COFFEE_SZ_FREQUENCY_DETAIL_OPTIONS,
    display_if: { '==': [{ 'var': 'coffee_5b' }, '1_to_7'] },
    indentLevel: 1
  },
  {
    id: 'coffee_6a',
    text: 'Quantite de cafe (en tasses) consommees par jour de consommation en moyenne AU COURS DES 12 DERNIERS MOIS',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },
  {
    id: 'coffee_6b',
    text: 'Frequence des consommations AU COURS DES 12 DERNIERS MOIS',
    type: 'single_choice',
    required: false,
    options: TEA_COFFEE_SZ_FREQUENCY_OPTIONS
  },
  {
    id: 'coffee_6b1',
    text: 'Precisez le nombre de fois',
    type: 'single_choice',
    required: false,
    options: TEA_COFFEE_SZ_FREQUENCY_DETAIL_OPTIONS,
    display_if: { '==': [{ 'var': 'coffee_6b' }, '1_to_7'] },
    indentLevel: 1
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

export const TEA_COFFEE_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'tea_coffee_sz',
  code: 'TEA_COFFEE_SZ',
  title: 'Consommation de The et Cafe',
  description: 'Evaluation de la consommation de the et cafe du patient, incluant les periodes de consommation maximale au cours de la vie et les 12 derniers mois.',
  questions: TEA_COFFEE_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: '1.0',
    language: 'fr-FR'
  }
};
