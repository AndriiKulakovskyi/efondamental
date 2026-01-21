// eFondaMental Platform - Evaluation Addictologique (Schizophrenia)
// Comprehensive addiction assessment including alcohol, tobacco, cannabis, and other substances

import { Question, QuestionOption } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaEvalAddictologiqueResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any; // Dynamic fields based on substance assessed
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaEvalAddictologiqueResponseInsert = Omit<
  SchizophreniaEvalAddictologiqueResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Response Options
// ============================================================================

const DSM5_CRITERIA_OPTIONS: QuestionOption[] = [
  { code: 'Oui', label: 'Oui' },
  { code: 'Non', label: 'Non' },
  { code: 'Ne sais pas', label: 'Ne sais pas' }
];

const FREQUENCY_OPTIONS: QuestionOption[] = [
  { code: '1_to_7', label: '1 a 7 fois par semaine' },
  { code: 'less_than_once', label: 'Moins d\'une fois par semaine' }
];

const FREQUENCY_DETAIL_OPTIONS: QuestionOption[] = [
  { code: 1, label: '1' }, { code: 2, label: '2' }, { code: 3, label: '3' },
  { code: 4, label: '4' }, { code: 5, label: '5' }, { code: 6, label: '6' }, { code: 7, label: '7' }
];

// ============================================================================
// Questions - Alcohol Section (Core)
// ============================================================================

export const EVAL_ADDICTOLOGIQUE_SZ_QUESTIONS: Question[] = [
  // ALCOHOL SECTION
  { id: 'section_alcool', text: '1. Alcool', type: 'section', required: false },
  {
    id: 'rad_add_alc1',
    text: '1. Avez-vous deja consomme de l\'alcool, quel que soit le type d\'alcool, plus de dix fois dans votre vie ?',
    type: 'single_choice',
    required: false,
    options: [{ code: 'Oui', label: 'Oui' }, { code: 'Non', label: 'Non' }]
  },
  {
    id: 'rad_add_alc1a',
    text: 'Abstinent primaire ? (aucune consommation d\'alcool vie entiere ?)',
    type: 'single_choice',
    required: false,
    options: [{ code: 'Oui', label: 'Oui' }, { code: 'Non', label: 'Non' }],
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Non'] },
    indentLevel: 1
  },
  {
    id: 'add_alc5a',
    text: '1a. Quantite en verres (unite standard = 10g) par jour de consommation, en moyenne durant les periodes de consommation maximales au cours de la vie',
    type: 'text',
    required: false,
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  {
    id: 'rad_add_alc5b',
    text: '1b. Frequence des consommations durant les periodes de consommation maximale au cours de la vie',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },

  // TOBACCO SECTION
  { id: 'section_tabac', text: '2. Tabac', type: 'section', required: false },
  {
    id: 'rad_add_tab1',
    text: '1. Avez-vous deja fume du tabac plus de dix fois dans votre vie ?',
    type: 'single_choice',
    required: false,
    options: [{ code: 'Oui', label: 'Oui' }, { code: 'Non', label: 'Non' }]
  },
  {
    id: 'rad_add_tab1a',
    text: 'Abstinent primaire ? (aucune consommation de tabac vie entiere ?)',
    type: 'single_choice',
    required: false,
    options: [{ code: 'Oui', label: 'Oui' }, { code: 'Non', label: 'Non' }],
    display_if: { '==': [{ 'var': 'rad_add_tab1' }, 'Non'] },
    indentLevel: 1
  },

  // CANNABIS SECTION
  { id: 'section_cannabis', text: '3. Cannabis', type: 'section', required: false },
  {
    id: 'rad_add_can1',
    text: '1. Avez-vous deja consomme du cannabis plus de dix fois dans votre vie ?',
    type: 'single_choice',
    required: false,
    options: [{ code: 'Oui', label: 'Oui' }, { code: 'Non', label: 'Non' }]
  },
  {
    id: 'rad_add_can1a',
    text: 'Abstinent primaire ? (aucune consommation de cannabis vie entiere ?)',
    type: 'single_choice',
    required: false,
    options: [{ code: 'Oui', label: 'Oui' }, { code: 'Non', label: 'Non' }],
    display_if: { '==': [{ 'var': 'rad_add_can1' }, 'Non'] },
    indentLevel: 1
  },

  // OTHER DRUGS SECTION
  { id: 'section_autres', text: '4. Autres drogues', type: 'section', required: false },
  {
    id: 'rad_add_aut1',
    text: '1. Avez-vous deja consomme d\'autres drogues plus de dix fois dans votre vie ?',
    type: 'single_choice',
    required: false,
    options: [{ code: 'Oui', label: 'Oui' }, { code: 'Non', label: 'Non' }]
  },
  {
    id: 'chk_add_aut1a',
    text: 'Lesquelles ?',
    type: 'multiple_choice',
    required: false,
    options: [
      { code: 'Opiaces', label: 'Opiaces' },
      { code: 'Cocaine', label: 'Cocaine' },
      { code: 'Amphetamines', label: 'Amphetamines' },
      { code: 'Hallucinogenes', label: 'Hallucinogenes' },
      { code: 'Sedatifs', label: 'Sedatifs/Hypnotiques' },
      { code: 'Autres', label: 'Autres' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_aut1' }, 'Oui'] },
    indentLevel: 1
  },

  // GAMBLING SECTION
  { id: 'section_jeu', text: '5. Jeu pathologique', type: 'section', required: false },
  {
    id: 'rad_add_jeu1',
    text: '1. Avez-vous deja joue a des jeux d\'argent de maniere reguliere ?',
    type: 'single_choice',
    required: false,
    options: [{ code: 'Oui', label: 'Oui' }, { code: 'Non', label: 'Non' }]
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

export const EVAL_ADDICTOLOGIQUE_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'eval_addictologique_sz',
  code: 'EVAL_ADDICTOLOGIQUE_SZ',
  title: 'Evaluation addictologique',
  description: 'Evaluation complete des addictions incluant l\'alcool, le tabac, le cannabis, les autres drogues et le jeu pathologique. Inclut les criteres DSM5 et l\'evaluation de la severite.',
  questions: EVAL_ADDICTOLOGIQUE_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: '1.0',
    language: 'fr-FR'
  }
};
