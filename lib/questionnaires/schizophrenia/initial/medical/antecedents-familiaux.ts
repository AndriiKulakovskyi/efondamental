// eFondaMental Platform - Antecedents Familiaux Psychiatriques (Schizophrenia)
// Family psychiatric history assessment

import { Question, QuestionOption } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaAntecedentsFamiliauxPsyResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any; // Dynamic fields from questionnaire
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaAntecedentsFamiliauxPsyResponseInsert = Omit<
  SchizophreniaAntecedentsFamiliauxPsyResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Response Options
// ============================================================================

const COUNT_OPTIONS_FEMALE: QuestionOption[] = [
  { code: '0', label: 'Aucune' }, { code: '1', label: '1' }, { code: '2', label: '2' },
  { code: '3', label: '3' }, { code: '4', label: '4' }, { code: '5', label: '5' }, { code: '>5', label: '>5' }
];

const COUNT_OPTIONS_MALE: QuestionOption[] = [
  { code: '0', label: 'Aucun' }, { code: '1', label: '1' }, { code: '2', label: '2' },
  { code: '3', label: '3' }, { code: '4', label: '4' }, { code: '5', label: '5' }, { code: '>5', label: '>5' }
];

const YES_NO_MAYBE_OPTIONS: QuestionOption[] = [
  { code: 'oui', label: 'Oui' },
  { code: 'non', label: 'Non' },
  { code: 'ne_sais_pas', label: 'Ne sais pas' }
];

const YES_NO_OPTIONS: QuestionOption[] = [
  { code: 'oui', label: 'Oui' },
  { code: 'non', label: 'Non' }
];

const TROUBLE_PSY_OPTIONS: QuestionOption[] = [
  { code: 'aucun', label: 'Aucun' },
  { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
  { code: 'bipolaire', label: 'Bipolaire' },
  { code: 'schizophrene', label: 'Schizophrene' },
  { code: 'ne_sais_pas', label: 'Ne sais pas' }
];

const SUICIDE_OPTIONS: QuestionOption[] = [
  { code: 'aucun', label: 'Aucun' },
  { code: 'tentative', label: 'Tentative de suicide' },
  { code: 'abouti', label: 'Suicide abouti' },
  { code: 'ne_sais_pas', label: 'Ne sais pas' }
];

// Helper function for conditional display
const hasAtLeastOne = (fieldId: string) => ({
  'in': [{ 'var': `answers.${fieldId}` }, [1, 2, 3, 4, 5, '>5']]
});

// ============================================================================
// Questions
// ============================================================================

export const ANTECEDENTS_FAMILIAUX_PSY_SZ_QUESTIONS: Question[] = [
  // Children section
  { id: 'titre_structure_enfant', text: 'Enfants', type: 'section', required: false, is_label: true },
  { id: 'rad_structure_fille', text: 'Nombre de filles', type: 'single_choice', required: false, options: COUNT_OPTIONS_FEMALE },
  {
    id: 'rad_structure_fille_atteint',
    text: 'Parmi elles, veuillez indiquer combien presentent un trouble psychiatrique, un abus ou une dependance a une substance, un antecedent de tentative de suicide ou un facteur de risque cardio-vasculaire',
    type: 'single_choice',
    required: false,
    options: COUNT_OPTIONS_FEMALE,
    indentLevel: 1,
    display_if: hasAtLeastOne('rad_structure_fille')
  },
  { id: 'rad_structure_fils', text: 'Nombre de fils', type: 'single_choice', required: false, options: COUNT_OPTIONS_MALE },
  {
    id: 'rad_structure_fils_atteint',
    text: 'Parmi eux, veuillez indiquer combien presentent un trouble psychiatrique, un abus ou une dependance a une substance, un antecedent de tentative de suicide ou un facteur de risque cardio-vasculaire',
    type: 'single_choice',
    required: false,
    options: COUNT_OPTIONS_MALE,
    indentLevel: 1,
    display_if: hasAtLeastOne('rad_structure_fils')
  },

  // Siblings section
  { id: 'titre_structure_fratrie', text: 'Fratrie', type: 'section', required: false, is_label: true },
  { id: 'rad_structure_soeur', text: 'Nombre de soeurs', type: 'single_choice', required: false, options: COUNT_OPTIONS_FEMALE },
  {
    id: 'rad_structure_soeur_atteint',
    text: 'Parmi elles, combien presentent un trouble psychiatrique ou autre facteur de risque',
    type: 'single_choice',
    required: false,
    options: COUNT_OPTIONS_FEMALE,
    indentLevel: 1,
    display_if: hasAtLeastOne('rad_structure_soeur')
  },
  { id: 'rad_structure_frere', text: 'Nombre de freres', type: 'single_choice', required: false, options: COUNT_OPTIONS_MALE },
  {
    id: 'rad_structure_frere_atteint',
    text: 'Parmi eux, combien presentent un trouble psychiatrique ou autre facteur de risque',
    type: 'single_choice',
    required: false,
    options: COUNT_OPTIONS_MALE,
    indentLevel: 1,
    display_if: hasAtLeastOne('rad_structure_frere')
  },

  // Parents section
  { id: 'titre_parents', text: 'Parents', type: 'section', required: false, is_label: true },
  {
    id: 'titre_consigne',
    text: 'Pour chaque membre de votre famille ci-dessous, veuillez indiquer s\'il presente un trouble psychiatrique, un abus ou une dependance a une substance, un antecedent de tentative de suicide ou un facteur de risque cardio-vasculaire.',
    type: 'instruction',
    required: false
  },
  { id: 'rad_structure_mere', text: 'Mere', type: 'single_choice', required: false, options: YES_NO_MAYBE_OPTIONS },
  { id: 'rad_atcdfampsy_mere_deces', text: 'Deces', type: 'single_choice', required: false, options: YES_NO_OPTIONS, indentLevel: 1 },
  { id: 'rad_structure_pere', text: 'Pere', type: 'single_choice', required: false, options: YES_NO_MAYBE_OPTIONS },
  { id: 'rad_atcdfampsy_pere_deces', text: 'Deces', type: 'single_choice', required: false, options: YES_NO_OPTIONS, indentLevel: 1 },

  // Mother details (conditional)
  {
    id: 'titre_mere',
    text: 'Antecedents maternels',
    type: 'section',
    required: false,
    is_label: true,
    display_if: { '==': [{ 'var': 'answers.rad_structure_mere' }, 'oui'] }
  },
  {
    id: 'rad_mere_trouble',
    text: 'Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: TROUBLE_PSY_OPTIONS,
    indentLevel: 1,
    display_if: { '==': [{ 'var': 'answers.rad_structure_mere' }, 'oui'] }
  },
  {
    id: 'rad_mere_suicide',
    text: 'Suicide',
    type: 'single_choice',
    required: false,
    options: SUICIDE_OPTIONS,
    indentLevel: 1,
    display_if: { '==': [{ 'var': 'answers.rad_structure_mere' }, 'oui'] }
  },

  // Father details (conditional)
  {
    id: 'titre_pere',
    text: 'Antecedents paternels',
    type: 'section',
    required: false,
    is_label: true,
    display_if: { '==': [{ 'var': 'answers.rad_structure_pere' }, 'oui'] }
  },
  {
    id: 'rad_pere_trouble',
    text: 'Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: TROUBLE_PSY_OPTIONS,
    indentLevel: 1,
    display_if: { '==': [{ 'var': 'answers.rad_structure_pere' }, 'oui'] }
  },
  {
    id: 'rad_pere_suicide',
    text: 'Suicide',
    type: 'single_choice',
    required: false,
    options: SUICIDE_OPTIONS,
    indentLevel: 1,
    display_if: { '==': [{ 'var': 'answers.rad_structure_pere' }, 'oui'] }
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

export const ANTECEDENTS_FAMILIAUX_PSY_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'antecedents_familiaux_psy_sz',
  code: 'ANTECEDENTS_FAMILIAUX_PSY_SZ',
  title: 'Antecedents familiaux psychiatriques',
  description: 'Ce questionnaire recueille les antecedents psychiatriques familiaux du patient, incluant les troubles psychiatriques et les tentatives de suicide pour les parents, la fratrie et les enfants.',
  instructions: 'Remplir les informations sur la structure familiale puis detailler les antecedents pour les membres concernes.',
  questions: ANTECEDENTS_FAMILIAUX_PSY_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: '1.0',
    language: 'fr-FR'
  }
};
