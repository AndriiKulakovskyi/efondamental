// eFondaMental Platform - DSM5 Comorbid Disorders (DSM5_COMORBID)
// Bipolar Initial Evaluation - Medical Module
// This is a large questionnaire covering anxiety, substance use, eating disorders, etc.

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarDsm5ComorbidResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Section 1: Anxiety Disorders
  has_anxiety_disorder: string | null;
  panic_disorder_present: string | null;
  panic_disorder_type: string | null;
  panic_disorder_age_debut: number | null;
  panic_disorder_symptoms_past_month: string | null;
  agoraphobia_no_panic_present: string | null;
  agoraphobia_no_panic_age_debut: number | null;
  agoraphobia_no_panic_symptoms_past_month: string | null;
  social_phobia_present: string | null;
  social_phobia_age_debut: number | null;
  social_phobia_symptoms_past_month: string | null;
  specific_phobia_present: string | null;
  specific_phobia_age_debut: number | null;
  specific_phobia_symptoms_past_month: string | null;
  ocd_present: string | null;
  ocd_age_debut: number | null;
  ocd_symptoms_past_month: string | null;
  ptsd_present: string | null;
  ptsd_age_debut: number | null;
  ptsd_symptoms_past_month: string | null;
  gad_present: string | null;
  gad_age_debut: number | null;
  gad_symptoms_past_month: string | null;
  anxiety_medical_condition_present: string | null;
  anxiety_medical_condition_affection: string | null;
  anxiety_medical_condition_age_debut: number | null;
  anxiety_medical_condition_symptoms_past_month: string | null;
  anxiety_substance_induced_present: string | null;
  anxiety_substance_induced_substance: string | null;
  anxiety_substance_induced_age_debut: number | null;
  anxiety_substance_induced_symptoms_past_month: string | null;
  anxiety_unspecified_present: string | null;
  anxiety_unspecified_age_debut: number | null;
  anxiety_unspecified_symptoms_past_month: string | null;
  // Section 2: Substance Disorders
  has_substance_disorder: string | null;
  alcohol_present: string | null;
  alcohol_type: string | null;
  alcohol_age_debut: number | null;
  alcohol_symptoms_past_month: string | null;
  alcohol_duration_months: number | null;
  sedatives_present: string | null;
  sedatives_type: string | null;
  sedatives_age_debut: number | null;
  sedatives_symptoms_past_month: string | null;
  sedatives_duration_months: number | null;
  cannabis_present: string | null;
  cannabis_type: string | null;
  cannabis_age_debut: number | null;
  cannabis_symptoms_past_month: string | null;
  cannabis_duration_months: number | null;
  stimulants_present: string | null;
  stimulants_type: string | null;
  stimulants_age_debut: number | null;
  stimulants_symptoms_past_month: string | null;
  stimulants_duration_months: number | null;
  opiates_present: string | null;
  opiates_type: string | null;
  opiates_age_debut: number | null;
  opiates_symptoms_past_month: string | null;
  opiates_duration_months: number | null;
  cocaine_present: string | null;
  cocaine_type: string | null;
  cocaine_age_debut: number | null;
  cocaine_symptoms_past_month: string | null;
  cocaine_duration_months: number | null;
  hallucinogens_present: string | null;
  hallucinogens_type: string | null;
  hallucinogens_age_debut: number | null;
  hallucinogens_symptoms_past_month: string | null;
  hallucinogens_duration_months: number | null;
  other_substance_present: string | null;
  other_substance_name: string | null;
  other_substance_type: string | null;
  other_substance_age_debut: number | null;
  other_substance_symptoms_past_month: string | null;
  other_substance_duration_months: number | null;
  induced_disorder_present: string | null;
  induced_substances: string[] | null;
  induced_disorder_type: string | null;
  induced_symptoms_past_month: string | null;
  // Section 3: Eating Disorders
  has_eating_disorder: string | null;
  eating_disorder_type: string | null;
  anorexia_restrictive_amenorrhea: string | null;
  anorexia_restrictive_age_debut: number | null;
  anorexia_restrictive_age_fin: number | null;
  anorexia_restrictive_symptoms_past_month: string | null;
  anorexia_restrictive_current: string | null;
  anorexia_bulimic_amenorrhea: string | null;
  anorexia_bulimic_age_debut: number | null;
  anorexia_bulimic_age_fin: number | null;
  anorexia_bulimic_symptoms_past_month: string | null;
  anorexia_bulimic_current: string | null;
  bulimia_age_debut: number | null;
  bulimia_age_fin: number | null;
  bulimia_symptoms_past_month: string | null;
  bulimia_current: string | null;
  binge_eating_age_debut: number | null;
  binge_eating_age_fin: number | null;
  binge_eating_symptoms_past_month: string | null;
  binge_eating_current: string | null;
  eating_unspecified_age_debut: number | null;
  eating_unspecified_age_fin: number | null;
  eating_unspecified_symptoms_past_month: string | null;
  eating_unspecified_current: string | null;
  night_eating_age_debut: number | null;
  night_eating_age_fin: number | null;
  night_eating_symptoms_past_month: string | null;
  night_eating_current: string | null;
  // Section 4: Somatoform Disorders
  has_somatoform_disorder: string | null;
  somatoform_type: string | null;
  somatoform_age_debut: number | null;
  somatoform_symptoms_past_month: string | null;
  // Section 5: ADHD
  diva_evaluated: string | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarDsm5ComorbidResponseInsert = Omit<
  BipolarDsm5ComorbidResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Section 1: Anxiety Disorders
// ============================================================================

const DSM5_COMORBID_SECTION1_QUESTIONS: Question[] = [
  {
    id: 'section_anxiety',
    text: 'Section 1 - Troubles Anxieux',
    type: 'section',
    required: false
  },
  {
    id: 'has_anxiety_disorder',
    text: 'Le patient a-t-il un trouble anxieux?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'panic_disorder_present',
    text: '1. Trouble panique',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'panic_disorder_type',
    text: '1.1. Type du trouble panique',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'panic_disorder_present' }, 'oui'] },
    options: [
      { code: 'sans_agoraphobie', label: 'Sans agoraphobie' },
      { code: 'avec_agoraphobie', label: 'Avec agoraphobie' }
    ]
  },
  {
    id: 'panic_disorder_age_debut',
    text: '1.2. Age de debut',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'panic_disorder_present' }, 'oui'] }
  },
  {
    id: 'panic_disorder_symptoms_past_month',
    text: '1.3. Presence de symptomes dans le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'panic_disorder_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'agoraphobia_no_panic_present',
    text: '2. Agoraphobie sans trouble panique',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'agoraphobia_no_panic_age_debut',
    text: '2.1. Age de debut',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'agoraphobia_no_panic_present' }, 'oui'] }
  },
  {
    id: 'agoraphobia_no_panic_symptoms_past_month',
    text: '2.2. Presence de symptomes dans le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'agoraphobia_no_panic_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'social_phobia_present',
    text: '3. Phobie sociale',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'social_phobia_age_debut',
    text: '3.1. Age de debut',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'social_phobia_present' }, 'oui'] }
  },
  {
    id: 'social_phobia_symptoms_past_month',
    text: '3.2. Presence de symptomes dans le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'social_phobia_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'specific_phobia_present',
    text: '4. Phobie specifique',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'specific_phobia_age_debut',
    text: '4.1. Age de debut',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'specific_phobia_present' }, 'oui'] }
  },
  {
    id: 'specific_phobia_symptoms_past_month',
    text: '4.2. Presence de symptomes dans le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'specific_phobia_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'ocd_present',
    text: '5. Trouble obsessionnel compulsif',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'ocd_age_debut',
    text: '5.1. Age de debut',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'ocd_present' }, 'oui'] }
  },
  {
    id: 'ocd_symptoms_past_month',
    text: '5.2. Presence de symptomes dans le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'ocd_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'ptsd_present',
    text: '6. Stress post-traumatique',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'ptsd_age_debut',
    text: '6.1. Age de debut',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'ptsd_present' }, 'oui'] }
  },
  {
    id: 'ptsd_symptoms_past_month',
    text: '6.2. Presence de symptomes dans le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'ptsd_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'gad_present',
    text: '7. Anxiete generalisee (episode actuel seulement)',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'gad_age_debut',
    text: '7.1. Age de debut',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'gad_present' }, 'oui'] }
  },
  {
    id: 'gad_symptoms_past_month',
    text: '7.2. Presence de symptomes dans le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'gad_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'anxiety_medical_condition_present',
    text: '8. Trouble anxieux du a une affection medicale generale',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'anxiety_medical_condition_affection',
    text: '8.1. Specifier l\'affection',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'anxiety_medical_condition_present' }, 'oui'] }
  },
  {
    id: 'anxiety_medical_condition_age_debut',
    text: '8.2. Age de debut',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'anxiety_medical_condition_present' }, 'oui'] }
  },
  {
    id: 'anxiety_medical_condition_symptoms_past_month',
    text: '8.3. Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'anxiety_medical_condition_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'anxiety_substance_induced_present',
    text: '9. Trouble anxieux induit par une substance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'anxiety_substance_induced_substance',
    text: '9.1. Specifier la substance',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'anxiety_substance_induced_present' }, 'oui'] }
  },
  {
    id: 'anxiety_substance_induced_age_debut',
    text: '9.2. Age de debut',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'anxiety_substance_induced_present' }, 'oui'] }
  },
  {
    id: 'anxiety_substance_induced_symptoms_past_month',
    text: '9.3. Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'anxiety_substance_induced_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'anxiety_unspecified_present',
    text: '10. Trouble anxieux non specifie',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'anxiety_unspecified_age_debut',
    text: '10.1. Age de debut',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'anxiety_unspecified_present' }, 'oui'] }
  },
  {
    id: 'anxiety_unspecified_symptoms_past_month',
    text: '10.2. Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'anxiety_unspecified_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  }
];

// ============================================================================
// Section 2: Substance-Related Disorders
// ============================================================================

const DSM5_COMORBID_SECTION2_QUESTIONS: Question[] = [
  {
    id: 'section_substance',
    text: 'Section 2 - Troubles lies a une substance (vie entiere)',
    type: 'section',
    required: false
  },
  {
    id: 'has_substance_disorder',
    text: 'Le patient a-t-il ou a-t-il eu un trouble lie a l\'utilisation d\'une substance (abus ou dependance)?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'alcohol_present',
    text: '1. Alcool',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'alcohol_type',
    text: 'Type de trouble - Alcool',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'alcohol_present' }, 'oui'] },
    options: [
      { code: 'abus', label: 'Abus' },
      { code: 'dependance', label: 'Dependance' }
    ]
  },
  {
    id: 'alcohol_age_debut',
    text: 'Age de debut - Alcool',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'alcohol_present' }, 'oui'] }
  },
  {
    id: 'alcohol_symptoms_past_month',
    text: 'Presence de symptomes le mois ecoule - Alcool',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'alcohol_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'alcohol_duration_months',
    text: 'Duree cumulee du trouble (mois) - Alcool',
    type: 'number',
    required: false,
    min: 0,
    max: 2000,
    display_if: { '==': [{ var: 'alcohol_present' }, 'oui'] }
  },
  {
    id: 'sedatives_present',
    text: '2. Sedatifs / Hypnotiques / Anxiolytiques',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sedatives_type',
    text: 'Type de trouble - Sedatifs',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'sedatives_present' }, 'oui'] },
    options: [
      { code: 'abus', label: 'Abus' },
      { code: 'dependance', label: 'Dependance' }
    ]
  },
  {
    id: 'sedatives_age_debut',
    text: 'Age de debut - Sedatifs',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'sedatives_present' }, 'oui'] }
  },
  {
    id: 'sedatives_symptoms_past_month',
    text: 'Presence de symptomes le mois ecoule - Sedatifs',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'sedatives_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sedatives_duration_months',
    text: 'Duree cumulee du trouble (mois) - Sedatifs',
    type: 'number',
    required: false,
    min: 0,
    max: 2000,
    display_if: { '==': [{ var: 'sedatives_present' }, 'oui'] }
  },
  {
    id: 'cannabis_present',
    text: '3. Cannabis',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'cannabis_type',
    text: 'Type de trouble - Cannabis',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'cannabis_present' }, 'oui'] },
    options: [
      { code: 'abus', label: 'Abus' },
      { code: 'dependance', label: 'Dependance' }
    ]
  },
  {
    id: 'cannabis_age_debut',
    text: 'Age de debut - Cannabis',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'cannabis_present' }, 'oui'] }
  },
  {
    id: 'cannabis_symptoms_past_month',
    text: 'Presence de symptomes le mois ecoule - Cannabis',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'cannabis_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'cannabis_duration_months',
    text: 'Duree cumulee du trouble (mois) - Cannabis',
    type: 'number',
    required: false,
    min: 0,
    max: 2000,
    display_if: { '==': [{ var: 'cannabis_present' }, 'oui'] }
  },
  {
    id: 'stimulants_present',
    text: '4. Stimulants',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'stimulants_type',
    text: 'Type de trouble - Stimulants',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'stimulants_present' }, 'oui'] },
    options: [
      { code: 'abus', label: 'Abus' },
      { code: 'dependance', label: 'Dependance' }
    ]
  },
  {
    id: 'stimulants_age_debut',
    text: 'Age de debut - Stimulants',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'stimulants_present' }, 'oui'] }
  },
  {
    id: 'stimulants_symptoms_past_month',
    text: 'Presence de symptomes le mois ecoule - Stimulants',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'stimulants_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'stimulants_duration_months',
    text: 'Duree cumulee du trouble (mois) - Stimulants',
    type: 'number',
    required: false,
    min: 0,
    max: 2000,
    display_if: { '==': [{ var: 'stimulants_present' }, 'oui'] }
  },
  {
    id: 'opiates_present',
    text: '5. Opiaces',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'opiates_type',
    text: 'Type de trouble - Opiaces',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'opiates_present' }, 'oui'] },
    options: [
      { code: 'abus', label: 'Abus' },
      { code: 'dependance', label: 'Dependance' }
    ]
  },
  {
    id: 'opiates_age_debut',
    text: 'Age de debut - Opiaces',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'opiates_present' }, 'oui'] }
  },
  {
    id: 'opiates_symptoms_past_month',
    text: 'Presence de symptomes le mois ecoule - Opiaces',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'opiates_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'opiates_duration_months',
    text: 'Duree cumulee du trouble (mois) - Opiaces',
    type: 'number',
    required: false,
    min: 0,
    max: 2000,
    display_if: { '==': [{ var: 'opiates_present' }, 'oui'] }
  },
  {
    id: 'cocaine_present',
    text: '6. Cocaine',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'cocaine_type',
    text: 'Type de trouble - Cocaine',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'cocaine_present' }, 'oui'] },
    options: [
      { code: 'abus', label: 'Abus' },
      { code: 'dependance', label: 'Dependance' }
    ]
  },
  {
    id: 'cocaine_age_debut',
    text: 'Age de debut - Cocaine',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'cocaine_present' }, 'oui'] }
  },
  {
    id: 'cocaine_symptoms_past_month',
    text: 'Presence de symptomes le mois ecoule - Cocaine',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'cocaine_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'cocaine_duration_months',
    text: 'Duree cumulee du trouble (mois) - Cocaine',
    type: 'number',
    required: false,
    min: 0,
    max: 2000,
    display_if: { '==': [{ var: 'cocaine_present' }, 'oui'] }
  },
  {
    id: 'hallucinogens_present',
    text: '7. Hallucinogenes / PCP',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'hallucinogens_type',
    text: 'Type de trouble - Hallucinogenes',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'hallucinogens_present' }, 'oui'] },
    options: [
      { code: 'abus', label: 'Abus' },
      { code: 'dependance', label: 'Dependance' }
    ]
  },
  {
    id: 'hallucinogens_age_debut',
    text: 'Age de debut - Hallucinogenes',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'hallucinogens_present' }, 'oui'] }
  },
  {
    id: 'hallucinogens_symptoms_past_month',
    text: 'Presence de symptomes le mois ecoule - Hallucinogenes',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'hallucinogens_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'hallucinogens_duration_months',
    text: 'Duree cumulee du trouble (mois) - Hallucinogenes',
    type: 'number',
    required: false,
    min: 0,
    max: 2000,
    display_if: { '==': [{ var: 'hallucinogens_present' }, 'oui'] }
  },
  {
    id: 'other_substance_present',
    text: '8. Autre substance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'other_substance_name',
    text: 'Nom de la substance',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'other_substance_present' }, 'oui'] }
  },
  {
    id: 'other_substance_type',
    text: 'Type de trouble - Autre substance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'other_substance_present' }, 'oui'] },
    options: [
      { code: 'abus', label: 'Abus' },
      { code: 'dependance', label: 'Dependance' }
    ]
  },
  {
    id: 'other_substance_age_debut',
    text: 'Age de debut - Autre substance',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'other_substance_present' }, 'oui'] }
  },
  {
    id: 'other_substance_symptoms_past_month',
    text: 'Presence de symptomes le mois ecoule - Autre substance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'other_substance_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'other_substance_duration_months',
    text: 'Duree cumulee du trouble (mois) - Autre substance',
    type: 'number',
    required: false,
    min: 0,
    max: 2000,
    display_if: { '==': [{ var: 'other_substance_present' }, 'oui'] }
  },
  {
    id: 'induced_disorder_present',
    text: '9. En absence d\'abus ou dependance : existe-t-il un trouble induit par une substance?',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'induced_substances',
    text: 'Type de substance responsable (selection multiple possible)',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'induced_disorder_present' }, 'oui'] },
    options: [
      'Alcool',
      'Sedatifs Hypnotiques-Anxiolytiques',
      'Cannabis',
      'Stimulants',
      'Opiaces',
      'Cocaine',
      'Hallucinogenes / PCP',
      'Autre substance'
    ]
  },
  {
    id: 'induced_disorder_type',
    text: 'Type de trouble induit',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'induced_disorder_present' }, 'oui'] },
    options: [
      { code: 'delirium', label: 'Delirium' },
      { code: 'demence_persistante', label: 'Demence persistante' },
      { code: 'trouble_amnesique', label: 'Trouble amnesique' },
      { code: 'trouble_psychotique', label: 'Trouble psychotique' },
      { code: 'trouble_humeur', label: 'Trouble de l\'humeur' },
      { code: 'trouble_anxieux', label: 'Trouble anxieux' },
      { code: 'trouble_sommeil', label: 'Trouble du sommeil' },
      { code: 'trouble_perceptions_hallucinogenes', label: 'Trouble persistant des perceptions liees aux hallucinogenes' }
    ]
  },
  {
    id: 'induced_symptoms_past_month',
    text: 'Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'induced_disorder_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  }
];

// ============================================================================
// Section 3: Eating Disorders
// ============================================================================

const DSM5_COMORBID_SECTION3_QUESTIONS: Question[] = [
  {
    id: 'section_eating',
    text: 'Section 3 - Troubles du comportement alimentaire (actuel)',
    type: 'section',
    required: false
  },
  {
    id: 'has_eating_disorder',
    text: 'Le patient a-t-il un trouble du comportement alimentaire?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'eating_disorder_type',
    text: 'Type du trouble du comportement alimentaire',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] },
    options: [
      { code: 'anorexia_restrictive', label: 'Anorexie type restrictive' },
      { code: 'anorexia_bulimic', label: 'Anorexie type boulimie' },
      { code: 'bulimia', label: 'Boulimie seule' },
      { code: 'binge_eating', label: 'Hyperphagie boulimique' },
      { code: 'eating_unspecified', label: 'Trouble des conduites alimentaires non specifie' },
      { code: 'night_eating', label: 'Night eating syndrome' }
    ]
  },
  {
    id: 'anorexia_restrictive_amenorrhea',
    text: 'Amenorrhee',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'anorexia_restrictive'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'anorexia_restrictive_age_debut',
    text: 'Age de debut',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'anorexia_restrictive'] }
  },
  {
    id: 'anorexia_restrictive_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'anorexia_restrictive'] }
  },
  {
    id: 'anorexia_restrictive_symptoms_past_month',
    text: 'Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'anorexia_restrictive'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'anorexia_restrictive_current',
    text: 'Trouble actuel',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'anorexia_restrictive'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'anorexia_bulimic_amenorrhea',
    text: 'Amenorrhee',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'anorexia_bulimic'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'anorexia_bulimic_age_debut',
    text: 'Age de debut',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'anorexia_bulimic'] }
  },
  {
    id: 'anorexia_bulimic_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'anorexia_bulimic'] }
  },
  {
    id: 'anorexia_bulimic_symptoms_past_month',
    text: 'Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'anorexia_bulimic'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'anorexia_bulimic_current',
    text: 'Trouble actuel',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'anorexia_bulimic'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'bulimia_age_debut',
    text: 'Age de debut',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'bulimia'] }
  },
  {
    id: 'bulimia_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'bulimia'] }
  },
  {
    id: 'bulimia_symptoms_past_month',
    text: 'Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'bulimia'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'bulimia_current',
    text: 'Trouble actuel',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'bulimia'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'binge_eating_age_debut',
    text: 'Age de debut',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'binge_eating'] }
  },
  {
    id: 'binge_eating_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'binge_eating'] }
  },
  {
    id: 'binge_eating_symptoms_past_month',
    text: 'Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'binge_eating'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'binge_eating_current',
    text: 'Trouble actuel',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'binge_eating'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'eating_unspecified_age_debut',
    text: 'Age de debut',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'eating_unspecified'] }
  },
  {
    id: 'eating_unspecified_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'eating_unspecified'] }
  },
  {
    id: 'eating_unspecified_symptoms_past_month',
    text: 'Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'eating_unspecified'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'eating_unspecified_current',
    text: 'Trouble actuel',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'eating_unspecified'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'night_eating_age_debut',
    text: 'Age de debut',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'night_eating'] }
  },
  {
    id: 'night_eating_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'night_eating'] }
  },
  {
    id: 'night_eating_symptoms_past_month',
    text: 'Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'night_eating'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'night_eating_current',
    text: 'Trouble actuel',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'night_eating'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  }
];

// ============================================================================
// Section 4: Somatoform Disorders
// ============================================================================

const DSM5_COMORBID_SECTION4_QUESTIONS: Question[] = [
  {
    id: 'section_somatoform',
    text: 'Section 4 - Trouble somatoforme',
    type: 'section',
    required: false
  },
  {
    id: 'has_somatoform_disorder',
    text: 'Le patient a-t-il un trouble somatoforme actuel?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'somatoform_type',
    text: '1. Type de trouble',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_somatoform_disorder' }, 'oui'] },
    options: [
      { code: 'trouble_somatisation', label: 'Trouble de somatisation' },
      { code: 'trouble_douloureux', label: 'Trouble douloureux' },
      { code: 'trouble_indifferencie', label: 'Trouble indifferencie' },
      { code: 'hypocondrie', label: 'Hypocondrie' },
      { code: 'peur_dysmorphie_corporelle', label: 'Peur d\'une dysmorphie corporelle' }
    ]
  },
  {
    id: 'somatoform_age_debut',
    text: 'Age de debut',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'has_somatoform_disorder' }, 'oui'] }
  },
  {
    id: 'somatoform_symptoms_past_month',
    text: 'Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_somatoform_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  }
];

// ============================================================================
// Section 5: ADHD
// ============================================================================

const DSM5_COMORBID_SECTION5_QUESTIONS: Question[] = [
  {
    id: 'section_adhd',
    text: 'Section 5 - TDAH (Trouble Deficitaire de l\'Attention avec Hyperactivite)',
    type: 'section',
    required: false
  },
  {
    id: 'diva_evaluated',
    text: 'Le patient a-t-il ete evalue avec la DIVA pour le TDAH?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  }
];

// ============================================================================
// Combined Questions
// ============================================================================

export const DSM5_COMORBID_QUESTIONS: Question[] = [
  ...DSM5_COMORBID_SECTION1_QUESTIONS,
  ...DSM5_COMORBID_SECTION2_QUESTIONS,
  ...DSM5_COMORBID_SECTION3_QUESTIONS,
  ...DSM5_COMORBID_SECTION4_QUESTIONS,
  ...DSM5_COMORBID_SECTION5_QUESTIONS
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

export const DSM5_COMORBID_DEFINITION: QuestionnaireDefinition = {
  id: 'dsm5_comorbid',
  code: 'DSM5_COMORBID',
  title: 'DSM5 - Troubles comorbides',
  description: 'Diagnostic DSM5 des troubles comorbides pour l\'evaluation initiale du trouble bipolaire',
  questions: DSM5_COMORBID_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
