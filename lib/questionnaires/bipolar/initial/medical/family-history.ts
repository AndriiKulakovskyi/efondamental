// eFondaMental Platform - Family History (FAMILY_HISTORY)
// Bipolar Initial Evaluation - Medical Module
// This is a comprehensive family history questionnaire with sections for children, siblings, parents, etc.

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarFamilyHistoryResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Children section
  num_daughters: string | null;
  num_daughters_with_issues: number | null;
  num_sons: string | null;
  num_sons_with_issues: number | null;
  // Siblings section
  num_sisters: string | null;
  num_sisters_with_issues: number | null;
  num_brothers: string | null;
  num_brothers_with_issues: number | null;
  // Parents section
  mother_psychiatric: string | null;
  mother_suicide: string | null;
  mother_substance: string[] | null;
  mother_anxiety: string | null;
  mother_dementia: string | null;
  mother_cardio: string[] | null;
  father_psychiatric: string | null;
  father_suicide: string | null;
  father_substance: string[] | null;
  father_anxiety: string | null;
  father_dementia: string | null;
  father_cardio: string[] | null;
  // Other family members
  maternal_grandmother_psychiatric: string | null;
  maternal_grandfather_psychiatric: string | null;
  paternal_grandmother_psychiatric: string | null;
  paternal_grandfather_psychiatric: string | null;
  // Aunts/Uncles counts
  num_maternal_aunts: string | null;
  num_maternal_uncles: string | null;
  num_paternal_aunts: string | null;
  num_paternal_uncles: string | null;
  // Dynamic family member data stored as JSONB
  family_members_data: Record<string, any> | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarFamilyHistoryResponseInsert = Omit<
  BipolarFamilyHistoryResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary (Abbreviated - full version in legacy constants)
// ============================================================================

export const FAMILY_HISTORY_QUESTIONS: Question[] = [
  // ========================================================================
  // SECTION 1 - CHILDREN
  // ========================================================================
  {
    id: 'section_children',
    text: 'Section 1 - Enfants',
    type: 'section',
    required: false
  },
  {
    id: 'num_daughters',
    text: 'Q1. Nombre de filles',
    type: 'single_choice',
    required: true,
    options: [
      { code: '0', label: 'Aucune' },
      { code: '1', label: '1' },
      { code: '2', label: '2' },
      { code: '3', label: '3' },
      { code: '4', label: '4' },
      { code: '5', label: '5' },
      { code: '>5', label: '>5' }
    ]
  },
  {
    id: 'num_daughters_with_issues',
    text: 'Q1.1. Parmi elles, combien presentent un trouble psychiatrique, un abus de substance, ou un facteur de risque cardio-vasculaire',
    type: 'single_choice',
    required: false,
    display_if: {
      and: [
        { '!=': [{ var: 'num_daughters' }, null] },
        { '!=': [{ var: 'num_daughters' }, '0'] }
      ]
    },
    options: [
      { code: 0, label: 'Aucune', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4', score: 4 },
      { code: 5, label: '5', score: 5 }
    ]
  },
  {
    id: 'num_sons',
    text: 'Q2. Nombre de fils',
    type: 'single_choice',
    required: true,
    options: [
      { code: '0', label: 'Aucun' },
      { code: '1', label: '1' },
      { code: '2', label: '2' },
      { code: '3', label: '3' },
      { code: '4', label: '4' },
      { code: '5', label: '5' },
      { code: '>5', label: '>5' }
    ]
  },
  {
    id: 'num_sons_with_issues',
    text: 'Q2.1. Parmi eux, combien presentent un trouble psychiatrique, un abus de substance, ou un facteur de risque cardio-vasculaire',
    type: 'single_choice',
    required: false,
    display_if: {
      and: [
        { '!=': [{ var: 'num_sons' }, null] },
        { '!=': [{ var: 'num_sons' }, '0'] }
      ]
    },
    options: [
      { code: 0, label: 'Aucun', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4', score: 4 },
      { code: 5, label: '5', score: 5 }
    ]
  },

  // ========================================================================
  // SECTION 2 - SIBLINGS
  // ========================================================================
  {
    id: 'section_siblings',
    text: 'Section 2 - Freres et Soeurs',
    type: 'section',
    required: false
  },
  {
    id: 'num_sisters',
    text: 'Q3. Nombre de soeurs',
    type: 'single_choice',
    required: true,
    options: [
      { code: '0', label: 'Aucune' },
      { code: '1', label: '1' },
      { code: '2', label: '2' },
      { code: '3', label: '3' },
      { code: '4', label: '4' },
      { code: '5', label: '5' },
      { code: '>5', label: '>5' }
    ]
  },
  {
    id: 'num_sisters_with_issues',
    text: 'Q3.1. Parmi elles, combien presentent un trouble psychiatrique',
    type: 'single_choice',
    required: false,
    display_if: {
      and: [
        { '!=': [{ var: 'num_sisters' }, null] },
        { '!=': [{ var: 'num_sisters' }, '0'] }
      ]
    },
    options: [
      { code: 0, label: 'Aucune', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4', score: 4 },
      { code: 5, label: '5', score: 5 }
    ]
  },
  {
    id: 'num_brothers',
    text: 'Q4. Nombre de freres',
    type: 'single_choice',
    required: true,
    options: [
      { code: '0', label: 'Aucun' },
      { code: '1', label: '1' },
      { code: '2', label: '2' },
      { code: '3', label: '3' },
      { code: '4', label: '4' },
      { code: '5', label: '5' },
      { code: '>5', label: '>5' }
    ]
  },
  {
    id: 'num_brothers_with_issues',
    text: 'Q4.1. Parmi eux, combien presentent un trouble psychiatrique',
    type: 'single_choice',
    required: false,
    display_if: {
      and: [
        { '!=': [{ var: 'num_brothers' }, null] },
        { '!=': [{ var: 'num_brothers' }, '0'] }
      ]
    },
    options: [
      { code: 0, label: 'Aucun', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4', score: 4 },
      { code: 5, label: '5', score: 5 }
    ]
  },

  // ========================================================================
  // SECTION 3 - PARENTS
  // ========================================================================
  {
    id: 'section_parents',
    text: 'Section 3 - Parents',
    type: 'section',
    required: false
  },
  {
    id: 'mother_psychiatric',
    text: 'Mere - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrene' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'mother_suicide',
    text: 'Mere - Suicide',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'mother_substance',
    text: 'Mere - Dependance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'mother_anxiety',
    text: 'Mere - Troubles anxieux',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'mother_dementia',
    text: 'Mere - Demence',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'mother_cardio',
    text: 'Mere - Facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    options: ['Aucun', 'Diabete', 'Obesite', 'Hyperlipidemie', 'Hypertension', 'Ne sais pas']
  },
  {
    id: 'father_psychiatric',
    text: 'Pere - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrene' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'father_suicide',
    text: 'Pere - Suicide',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'father_substance',
    text: 'Pere - Dependance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'father_anxiety',
    text: 'Pere - Troubles anxieux',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'father_dementia',
    text: 'Pere - Demence',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'father_cardio',
    text: 'Pere - Facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    options: ['Aucun', 'Diabete', 'Obesite', 'Hyperlipidemie', 'Hypertension', 'Ne sais pas']
  },

  // ========================================================================
  // SECTION 4 - GRANDPARENTS
  // ========================================================================
  {
    id: 'section_grandparents',
    text: 'Section 4 - Grands-Parents',
    type: 'section',
    required: false
  },
  {
    id: 'maternal_grandmother_psychiatric',
    text: 'Grand-mere maternelle - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrene' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'maternal_grandfather_psychiatric',
    text: 'Grand-pere maternel - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrene' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'paternal_grandmother_psychiatric',
    text: 'Grand-mere paternelle - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrene' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'paternal_grandfather_psychiatric',
    text: 'Grand-pere paternel - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrene' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },

  // ========================================================================
  // SECTION 5 - AUNTS/UNCLES
  // ========================================================================
  {
    id: 'section_aunts_uncles',
    text: 'Section 5 - Tantes et Oncles',
    type: 'section',
    required: false
  },
  {
    id: 'num_maternal_aunts',
    text: 'Nombre de tantes maternelles',
    type: 'single_choice',
    required: false,
    options: [
      { code: '0', label: '0' },
      { code: '1', label: '1' },
      { code: '2', label: '2' },
      { code: '3', label: '3' },
      { code: '4', label: '4' },
      { code: '5', label: '5' },
      { code: '>5', label: '>5' }
    ]
  },
  {
    id: 'num_maternal_uncles',
    text: 'Nombre d\'oncles maternels',
    type: 'single_choice',
    required: false,
    options: [
      { code: '0', label: '0' },
      { code: '1', label: '1' },
      { code: '2', label: '2' },
      { code: '3', label: '3' },
      { code: '4', label: '4' },
      { code: '5', label: '5' },
      { code: '>5', label: '>5' }
    ]
  },
  {
    id: 'num_paternal_aunts',
    text: 'Nombre de tantes paternelles',
    type: 'single_choice',
    required: false,
    options: [
      { code: '0', label: '0' },
      { code: '1', label: '1' },
      { code: '2', label: '2' },
      { code: '3', label: '3' },
      { code: '4', label: '4' },
      { code: '5', label: '5' },
      { code: '>5', label: '>5' }
    ]
  },
  {
    id: 'num_paternal_uncles',
    text: 'Nombre d\'oncles paternels',
    type: 'single_choice',
    required: false,
    options: [
      { code: '0', label: '0' },
      { code: '1', label: '1' },
      { code: '2', label: '2' },
      { code: '3', label: '3' },
      { code: '4', label: '4' },
      { code: '5', label: '5' },
      { code: '>5', label: '>5' }
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

export const FAMILY_HISTORY_DEFINITION: QuestionnaireDefinition = {
  id: 'family_history',
  code: 'FAMILY_HISTORY',
  title: 'Antecedents Familiaux',
  description: 'Recueil des antecedents familiaux psychiatriques, d\'abus de substances, et de facteurs de risque cardio-vasculaires.',
  questions: FAMILY_HISTORY_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
