// eFondaMental Platform - Troubles Comorbides Assessment (Schizophrenia)
// Psychiatric comorbidities evaluation including mood disorders, anxiety, and ADHD

import { Question, QuestionOption } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaTroublesComorbidsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any; // Dynamic fields from questionnaire
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaTroublesComorbidsResponseInsert = Omit<
  SchizophreniaTroublesComorbidsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Response Options
// ============================================================================

const YES_NO_UNKNOWN_OPTIONS: QuestionOption[] = [
  { code: 'Oui', label: 'Oui' },
  { code: 'Non', label: 'Non' },
  { code: 'Ne sais pas', label: 'Ne sais pas' }
];

const YES_NO_OPTIONS: QuestionOption[] = [
  { code: 'Oui', label: 'Oui' },
  { code: 'Non', label: 'Non' }
];

// ============================================================================
// Questions
// ============================================================================

export const TROUBLES_COMORBIDES_SZ_QUESTIONS: Question[] = [
  // Mood Disorders Section
  { id: 'section_tb_thymiques', text: 'Troubles thymiques (en dehors des episodes psychotiques)', type: 'section', required: false },
  {
    id: 'rad_tb_thy_episode_dep_maj',
    text: 'Episodes depressifs majeurs (en dehors des episodes psychotiques)',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tb_thy_age_debut',
    text: 'Age de debut du premier episode depressif',
    type: 'number',
    required: false,
    min: 0,
    max: 100,
    display_if: { '==': [{ 'var': 'rad_tb_thy_episode_dep_maj' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_tb_thy_nb_episode',
    text: 'Nombre d\'episodes depressifs',
    type: 'number',
    required: false,
    min: 0,
    max: 100,
    display_if: { '==': [{ 'var': 'rad_tb_thy_episode_dep_maj' }, 'Oui'] },
    indentLevel: 1
  },

  // Anxiety Disorders Section
  { id: 'section_tb_anxieux', text: 'Troubles anxieux', type: 'section', required: false },
  {
    id: 'rad_tb_anx_tag',
    text: 'Trouble anxieux generalise',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tb_anx_panique',
    text: 'Trouble panique',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tb_anx_phobie_sociale',
    text: 'Phobie sociale',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tb_anx_agoraphobie',
    text: 'Agoraphobie',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tb_anx_phobie_specifique',
    text: 'Phobie specifique',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tb_anx_toc',
    text: 'Trouble obsessionnel compulsif (TOC)',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tb_anx_espt',
    text: 'Etat de stress post-traumatique (ESPT)',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },

  // ADHD Section
  { id: 'section_tdah', text: 'Trouble deficit de l\'attention avec/sans hyperactivite (TDAH)', type: 'section', required: false },
  {
    id: 'rad_tb_tdah',
    text: 'TDAH suspecte ou diagnostique',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tb_tdah_enfance',
    text: 'Symptomes de TDAH dans l\'enfance',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tb_tdah' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_tb_tdah_actuel',
    text: 'Symptomes de TDAH actuels',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tb_tdah' }, 'Oui'] },
    indentLevel: 1
  },

  // Eating Disorders Section
  { id: 'section_tca', text: 'Troubles des conduites alimentaires (TCA)', type: 'section', required: false },
  {
    id: 'rad_tb_tca_anorexie',
    text: 'Anorexie mentale',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tb_tca_boulimie',
    text: 'Boulimie',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tb_tca_hyperphagie',
    text: 'Hyperphagie boulimique',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },

  // Personality Disorders Section
  { id: 'section_personnalite', text: 'Troubles de la personnalite', type: 'section', required: false },
  {
    id: 'rad_tb_perso_borderline',
    text: 'Personnalite borderline',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tb_perso_antisociale',
    text: 'Personnalite antisociale',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tb_perso_autre',
    text: 'Autre trouble de la personnalite',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
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

export const TROUBLES_COMORBIDES_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'troubles_comorbides_sz',
  code: 'TROUBLES_COMORBIDES_SZ',
  title: 'Troubles comorbides',
  description: 'Evaluation des comorbidites psychiatriques incluant les troubles thymiques, anxieux, le TDAH, les troubles des conduites alimentaires et les troubles de la personnalite.',
  questions: TROUBLES_COMORBIDES_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: '1.0',
    language: 'fr-FR'
  }
};
