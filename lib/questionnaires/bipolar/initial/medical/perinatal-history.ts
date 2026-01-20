// eFondaMental Platform - Perinatal History (PERINATAL_HISTORY)
// Bipolar Initial Evaluation - Medical Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarPerinataliteResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Pregnancy information
  num_pregnancies: number | null;
  num_live_births: number | null;
  num_miscarriages: number | null;
  num_abortions: number | null;
  num_stillbirths: number | null;
  // Perinatal complications
  pregnancy_complications: string[] | null;
  pregnancy_complications_details: string | null;
  delivery_complications: string[] | null;
  delivery_complications_details: string | null;
  postpartum_complications: string[] | null;
  postpartum_complications_details: string | null;
  // Postpartum psychiatric history
  postpartum_depression: string | null;
  postpartum_depression_num_episodes: number | null;
  postpartum_psychosis: string | null;
  postpartum_psychosis_num_episodes: number | null;
  postpartum_mania: string | null;
  postpartum_mania_num_episodes: number | null;
  // Breastfeeding
  breastfed: string | null;
  breastfeeding_duration_months: number | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarPerinataliteResponseInsert = Omit<
  BipolarPerinataliteResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const PERINATALITE_QUESTIONS: Question[] = [
  // Pregnancy Section
  {
    id: 'section_pregnancy',
    text: 'Historique de Grossesse',
    type: 'section',
    required: false
  },
  {
    id: 'num_pregnancies',
    text: 'Nombre total de grossesses',
    type: 'number',
    required: true,
    min: 0
  },
  {
    id: 'num_live_births',
    text: 'Nombre de naissances vivantes',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '>': [{ var: 'num_pregnancies' }, 0] }
  },
  {
    id: 'num_miscarriages',
    text: 'Nombre de fausses couches',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '>': [{ var: 'num_pregnancies' }, 0] }
  },
  {
    id: 'num_abortions',
    text: 'Nombre d\'interruptions volontaires de grossesse',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '>': [{ var: 'num_pregnancies' }, 0] }
  },
  {
    id: 'num_stillbirths',
    text: 'Nombre de mort-nes',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '>': [{ var: 'num_pregnancies' }, 0] }
  },

  // Pregnancy Complications
  {
    id: 'section_complications',
    text: 'Complications',
    type: 'section',
    required: false,
    display_if: { '>': [{ var: 'num_pregnancies' }, 0] }
  },
  {
    id: 'pregnancy_complications',
    text: 'Complications pendant la grossesse (selection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '>': [{ var: 'num_pregnancies' }, 0] },
    options: [
      'Aucune',
      'Pre-eclampsie',
      'Diabete gestationnel',
      'Menace d\'accouchement premature',
      'Retard de croissance intra-uterin',
      'Infection',
      'Hemorragie',
      'Autre'
    ]
  },
  {
    id: 'pregnancy_complications_details',
    text: 'Details des complications de grossesse',
    type: 'text',
    required: false,
    display_if: { '>': [{ var: 'num_pregnancies' }, 0] }
  },
  {
    id: 'delivery_complications',
    text: 'Complications lors de l\'accouchement (selection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '>': [{ var: 'num_live_births' }, 0] },
    options: [
      'Aucune',
      'Accouchement premature',
      'Cesarienne en urgence',
      'Hemorragie de la delivrance',
      'Dystocie',
      'Souffrance foetale',
      'Autre'
    ]
  },
  {
    id: 'delivery_complications_details',
    text: 'Details des complications d\'accouchement',
    type: 'text',
    required: false,
    display_if: { '>': [{ var: 'num_live_births' }, 0] }
  },
  {
    id: 'postpartum_complications',
    text: 'Complications post-partum medicales (selection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '>': [{ var: 'num_live_births' }, 0] },
    options: [
      'Aucune',
      'Hemorragie',
      'Infection',
      'Thrombose veineuse',
      'Autre'
    ]
  },
  {
    id: 'postpartum_complications_details',
    text: 'Details des complications post-partum',
    type: 'text',
    required: false,
    display_if: { '>': [{ var: 'num_live_births' }, 0] }
  },

  // Postpartum Psychiatric History
  {
    id: 'section_postpartum_psych',
    text: 'Antecedents Psychiatriques Post-Partum',
    type: 'section',
    required: false,
    display_if: { '>': [{ var: 'num_live_births' }, 0] }
  },
  {
    id: 'postpartum_depression',
    text: 'Antecedent de depression post-partum',
    type: 'single_choice',
    required: false,
    display_if: { '>': [{ var: 'num_live_births' }, 0] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'postpartum_depression_num_episodes',
    text: 'Nombre d\'episodes de depression post-partum',
    type: 'number',
    required: false,
    min: 1,
    display_if: { '==': [{ var: 'postpartum_depression' }, 'oui'] }
  },
  {
    id: 'postpartum_psychosis',
    text: 'Antecedent de psychose post-partum',
    type: 'single_choice',
    required: false,
    display_if: { '>': [{ var: 'num_live_births' }, 0] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'postpartum_psychosis_num_episodes',
    text: 'Nombre d\'episodes de psychose post-partum',
    type: 'number',
    required: false,
    min: 1,
    display_if: { '==': [{ var: 'postpartum_psychosis' }, 'oui'] }
  },
  {
    id: 'postpartum_mania',
    text: 'Antecedent de manie/hypomanie post-partum',
    type: 'single_choice',
    required: false,
    display_if: { '>': [{ var: 'num_live_births' }, 0] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'postpartum_mania_num_episodes',
    text: 'Nombre d\'episodes de manie/hypomanie post-partum',
    type: 'number',
    required: false,
    min: 1,
    display_if: { '==': [{ var: 'postpartum_mania' }, 'oui'] }
  },

  // Breastfeeding
  {
    id: 'section_breastfeeding',
    text: 'Allaitement',
    type: 'section',
    required: false,
    display_if: { '>': [{ var: 'num_live_births' }, 0] }
  },
  {
    id: 'breastfed',
    text: 'Avez-vous allaite?',
    type: 'single_choice',
    required: false,
    display_if: { '>': [{ var: 'num_live_births' }, 0] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'breastfeeding_duration_months',
    text: 'Duree totale de l\'allaitement (en mois)',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'breastfed' }, 'oui'] }
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

export const PERINATALITE_DEFINITION: QuestionnaireDefinition = {
  id: 'perinatalite',
  code: 'PERINATALITE',
  title: 'Antecedents Perinataux',
  description: 'Recueil des antecedents obstetricaux et psychiatriques perinataux.',
  questions: PERINATALITE_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
