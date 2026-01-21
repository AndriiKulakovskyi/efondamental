// eFondaMental Platform - Troubles Psychotiques Assessment
// Comprehensive psychotic disorders evaluation including disorder classification,
// symptoms inventory, episode history, hospitalizations, and treatment

import { Question, QuestionOption } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaTroublesPsychotiquesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any; // Dynamic fields from questionnaire
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaTroublesPsychotiquesResponseInsert = Omit<
  SchizophreniaTroublesPsychotiquesResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Response Options
// ============================================================================

const YES_NO_OPTIONS: QuestionOption[] = [
  { code: 'Oui', label: 'Oui' },
  { code: 'Non', label: 'Non' }
];

const YES_NO_UNKNOWN_OPTIONS: QuestionOption[] = [
  { code: 'Oui', label: 'Oui' },
  { code: 'Non', label: 'Non' },
  { code: 'Ne sais pas', label: 'Ne sais pas' }
];

const DISORDER_TYPE_OPTIONS: QuestionOption[] = [
  { code: '1', label: 'Schizophrenie (incluant psychose hallucinatoire chronique et paraphrenie tardive)' },
  { code: '2', label: 'Trouble schizo-affectif' },
  { code: '3', label: 'Personnalite schizoide (selon le DSM-IV)' },
  { code: '4', label: 'Personnalite schizotypique (selon le DSM-IV)' },
  { code: '5', label: 'Trouble psychotique bref (/aigu et transitoire)' },
  { code: '6', label: 'Trouble schizophreniforme (entre 1 et 6 mois)' },
  { code: '7', label: 'Trouble psychotique induit par une substance (pharmacopsychose)' },
  { code: '8', label: 'Trouble delirant persistant non schizophrenique' },
  { code: '9', label: 'Trouble psychotique du a une affection medicale generale' },
  { code: '10', label: 'Autre' }
];

const EVOLUTIONARY_MODE_OPTIONS: QuestionOption[] = [
  { code: 'Episodique avec symptomes residuels entre les episodes et avec presence de symptomes negatifs', label: 'Episodique avec symptomes residuels + symptomes negatifs' },
  { code: 'Episodique avec symptomes residuels entre les episodes et sans symptomes negatifs', label: 'Episodique avec symptomes residuels sans symptomes negatifs' },
  { code: 'Episodique sans symptomes residuels entre les episodes', label: 'Episodique sans symptomes residuels' },
  { code: 'Continu avec symptomes negatifs prononces', label: 'Continu avec symptomes negatifs prononces' },
  { code: 'Continu', label: 'Continu' },
  { code: 'Episode isole avec symptomes negatifs prononces', label: 'Episode isole avec symptomes negatifs prononces' },
  { code: 'Episode isole en remission partielle', label: 'Episode isole en remission partielle' },
  { code: 'Episode isole en remission complete', label: 'Episode isole en remission complete' },
  { code: 'Autre cours evolutif', label: 'Autre cours evolutif' }
];

// ============================================================================
// Questions
// ============================================================================

export const TROUBLES_PSYCHOTIQUES_QUESTIONS: Question[] = [
  // Classification section
  { id: 'section_classification', text: 'Classification du trouble', type: 'section', required: false },
  {
    id: 'rad_tbpsycho_spectre',
    text: 'Le patient presente-t-il un trouble du spectre schizophrenique (DSM5 - F20 a F29) ?',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS
  },
  {
    id: 'rad_tbpsycho_type',
    text: 'Si oui, quel est le type de trouble ?',
    type: 'single_choice',
    required: false,
    options: DISORDER_TYPE_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tbpsycho_spectre' }, 'Oui'] },
    indentLevel: 1
  },

  // Lifetime characteristics
  { id: 'section_vie_entiere', text: 'Caracteristiques vie entiere', type: 'section', required: false },
  {
    id: 'tbpsychovie_debutsympt',
    text: 'Age de debut des symptomes psychotiques',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },
  {
    id: 'tbpsychovie_debutsoins',
    text: 'Age de debut des soins',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },
  {
    id: 'rad_tbpsychovie_prodrome',
    text: 'Presence de prodromes',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'tbpsychovie_duree_prodrome',
    text: 'Duree des prodromes (en mois)',
    type: 'number',
    required: false,
    display_if: { '==': [{ 'var': 'rad_tbpsychovie_prodrome' }, 'Oui'] },
    indentLevel: 1
  },

  // Positive symptoms
  { id: 'section_symptomes_positifs', text: 'Symptomes positifs (vie entiere)', type: 'section', required: false },
  {
    id: 'rad_tbpsychovie_hallucinations',
    text: 'Hallucinations',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tbpsychovie_delire',
    text: 'Delire',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tbpsychovie_desorganisation',
    text: 'Desorganisation de la pensee',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },

  // Negative symptoms
  { id: 'section_symptomes_negatifs', text: 'Symptomes negatifs (vie entiere)', type: 'section', required: false },
  {
    id: 'rad_tbpsychovie_emoussement',
    text: 'Emoussement affectif',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tbpsychovie_alogie',
    text: 'Alogie',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tbpsychovie_avolition',
    text: 'Avolition',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tbpsychovie_anhedonie',
    text: 'Anhedonie',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },

  // Evolutionary mode
  { id: 'section_mode_evolutif', text: 'Mode evolutif', type: 'section', required: false },
  {
    id: 'rad_tbpsychovie_mode_evolutif',
    text: 'Mode evolutif',
    type: 'single_choice',
    required: false,
    options: EVOLUTIONARY_MODE_OPTIONS
  },

  // Episode count
  { id: 'section_episodes', text: 'Historique des episodes', type: 'section', required: false },
  {
    id: 'tbpsychovie_nb_episodes',
    text: 'Nombre total d\'episodes psychotiques',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },

  // Hospitalizations
  { id: 'section_hospitalisations', text: 'Hospitalisations', type: 'section', required: false },
  {
    id: 'tbpsychovie_nb_hospitalisations',
    text: 'Nombre total d\'hospitalisations',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },
  {
    id: 'tbpsychovie_age_premiere_hosp',
    text: 'Age de la premiere hospitalisation',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },

  // Annual follow-up
  { id: 'section_suivi_annuel', text: 'Suivi annuel (12 derniers mois)', type: 'section', required: false },
  {
    id: 'rad_tbpsychoan_episode',
    text: 'Episode psychotique au cours de l\'annee ecoulee',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS
  },
  {
    id: 'rad_tbpsychoan_hospitalisation',
    text: 'Hospitalisation au cours de l\'annee ecoulee',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS
  },
  {
    id: 'rad_tbpsychoan_ts',
    text: 'Tentative de suicide au cours de l\'annee ecoulee',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS
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

export const TROUBLES_PSYCHOTIQUES_DEFINITION: QuestionnaireDefinition = {
  id: 'troubles_psychotiques',
  code: 'TROUBLES_PSYCHOTIQUES',
  title: 'Troubles psychotiques',
  description: 'Evaluation complete des troubles psychotiques incluant la classification des troubles, les caracteristiques vie entiere, l\'inventaire des symptomes (positifs et negatifs), l\'historique des episodes, les hospitalisations, le mode evolutif et le suivi annuel.',
  instructions: 'Ce questionnaire doit etre administre par un clinicien forme. Evaluer systematiquement chaque section. Periode de reference: Vie entiere et 12 derniers mois.',
  questions: TROUBLES_PSYCHOTIQUES_QUESTIONS,
  metadata: {
    singleColumn: false,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: '1.0',
    language: 'fr-FR'
  }
};
