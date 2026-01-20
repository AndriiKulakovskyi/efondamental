// eFondaMental Platform - DSM5 Mood Disorders (DSM5_HUMEUR)
// Bipolar Initial Evaluation - Medical Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarDsm5HumeurResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Section 1: Mood Disorder Presence
  has_mood_disorder: string | null;
  disorder_type: string | null;
  disorder_type_autre: string | null;
  major_depression_type: string | null;
  dysthymic_type: string | null;
  medical_condition_affection_type: string | null;
  medical_condition_affection_autre: string | null;
  medical_condition_trouble_type: string | null;
  substance_type: string | null;
  substance_autre: string | null;
  substance_trouble_type: string | null;
  unspecified_depression_type: string | null;
  // Section 2: First Episode
  first_episode_type: string | null;
  postpartum_first: string | null;
  initial_cyclothymic_period: string | null;
  // Section 3: Lifetime Characteristics
  num_edm: number | null;
  age_first_edm: number | null;
  edm_with_psychotic: string | null;
  num_edm_psychotic: number | null;
  edm_with_mixed: string | null;
  num_edm_mixed: number | null;
  num_hypomanic: number | null;
  age_first_hypomanic: string | null;
  num_manic: number | null;
  age_first_manic: string | null;
  manic_with_psychotic: string | null;
  num_manic_psychotic: number | null;
  manic_with_mixed: string | null;
  num_manic_mixed: number | null;
  induced_episodes: string | null;
  num_induced_episodes: number | null;
  rapid_cycling: string | null;
  complete_remission: string | null;
  seasonal_pattern: string | null;
  seasonal_depression: string | null;
  seasonal_depression_season: string | null;
  seasonal_hypomania: string | null;
  seasonal_hypomania_season: string | null;
  age_first_psychotrope: number | null;
  age_first_thymoregulator: number | null;
  age_first_hospitalization: number | null;
  number_of_hospitalizations: number | null;
  total_hospitalization_duration_months: string | null;
  // Section 3.4: 12-month characteristics
  past_year_episode: string | null;
  past_year_num_edm: number | null;
  past_year_edm_psychotic: string | null;
  past_year_num_edm_psychotic: number | null;
  past_year_edm_mixed: string | null;
  past_year_num_edm_mixed: number | null;
  past_year_num_hypomanic: number | null;
  past_year_num_manic: number | null;
  past_year_manic_psychotic: string | null;
  past_year_num_manic_psychotic: number | null;
  past_year_manic_mixed: string | null;
  past_year_num_manic_mixed: number | null;
  past_year_num_hospitalizations: number | null;
  past_year_hospitalization_weeks: string | null;
  past_year_work_leave: string | null;
  past_year_num_work_leaves: number | null;
  past_year_work_leave_weeks: string | null;
  // Section 4: Most Recent Episode
  recent_episode_start_date: string | null;
  recent_episode_end_date: string | null;
  recent_episode_type: string | null;
  recent_episode_catatonic: string | null;
  recent_manie_mixed: string | null;
  recent_edm_subtype: string | null;
  recent_episode_severity: string | null;
  recent_edm_chronic: string | null;
  recent_episode_postpartum: string | null;
  // Section 5: Current Episode
  current_episode_present: string | null;
  current_episode_type: string | null;
  current_edm_subtype: string | null;
  current_episode_catatonic: string | null;
  current_manie_mixed: string | null;
  current_episode_severity: string | null;
  current_edm_chronic: string | null;
  current_episode_postpartum: string | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarDsm5HumeurResponseInsert = Omit<
  BipolarDsm5HumeurResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const DSM5_HUMEUR_QUESTIONS: Question[] = [
  // ========================================================================
  // SECTION 1: Mood Disorder Presence and Type
  // ========================================================================
  {
    id: 'section_1',
    text: '1. Troubles de l\'humeur',
    type: 'section',
    required: false
  },
  {
    id: 'has_mood_disorder',
    text: 'Le patient a-t-il un trouble de l\'humeur?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'disorder_type',
    text: 'Type de trouble',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] },
    options: [
      { code: 'bipolaire_type_1', label: 'Bipolaire de type 1' },
      { code: 'bipolaire_type_2', label: 'Bipolaire de type 2' },
      { code: 'bipolaire_non_specifie', label: 'Bipolaire non specifie' },
      { code: 'trouble_depressif_majeur', label: 'Trouble Depressif Majeur' },
      { code: 'trouble_dysthymique', label: 'Trouble dysthymique' },
      { code: 'trouble_humeur_affection_medicale', label: 'Trouble de l\'humeur du a une affection medicale generale' },
      { code: 'trouble_humeur_induit_substance', label: 'Trouble de l\'humeur induit par l\'utilisation d\'une substance' },
      { code: 'trouble_depressif_non_specifie', label: 'Trouble depressif non specifie' },
      { code: 'trouble_cyclothymique', label: 'Trouble Cyclothymique' },
      { code: 'autre', label: 'Autre' }
    ],
    help: 'ATTENTION: Si Dysthymie, Cyclothymie ou Depressif non specifie est selectionne, le patient sort de la cohorte (critere d\'exclusion)'
  },
  {
    id: 'disorder_type_autre',
    text: 'Preciser',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'disorder_type' }, 'autre'] }
  },
  {
    id: 'major_depression_type',
    text: 'Type du trouble Depressif Majeur',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'disorder_type' }, 'trouble_depressif_majeur'] },
    options: [
      { code: 'isole', label: 'Isole' },
      { code: 'recurrent', label: 'Recurrent' }
    ]
  },
  {
    id: 'dysthymic_type',
    text: 'Type du trouble dysthymique',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'disorder_type' }, 'trouble_dysthymique'] },
    options: [
      { code: 'precoce', label: 'Precoce' },
      { code: 'tardif', label: 'Tardif' }
    ]
  },
  {
    id: 'medical_condition_affection_type',
    text: 'Preciser le type d\'affection',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'disorder_type' }, 'trouble_humeur_affection_medicale'] },
    options: [
      { code: 'endocrinienne', label: 'Endocrinienne' },
      { code: 'neurologique', label: 'Neurologique' },
      { code: 'cardio_vasculaire', label: 'Cardio-vasculaire' },
      { code: 'autre', label: 'Autre' }
    ]
  },
  {
    id: 'medical_condition_affection_autre',
    text: 'Specifier l\'affection',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'medical_condition_affection_type' }, 'autre'] }
  },
  {
    id: 'medical_condition_trouble_type',
    text: 'Preciser le type de trouble',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'disorder_type' }, 'trouble_humeur_affection_medicale'] },
    options: [
      { code: 'episode_allure_depression_majeure', label: 'Episode d\'allure de depression majeure' },
      { code: 'episode_caracteristiques_depressives', label: 'Episode avec caracteristiques depressives' },
      { code: 'episode_caracteristiques_maniaques', label: 'Episode avec caracteristiques maniaques' },
      { code: 'episode_caracteristiques_mixtes', label: 'Episode avec caracteristiques mixtes' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'substance_type',
    text: 'Preciser le type de substance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'disorder_type' }, 'trouble_humeur_induit_substance'] },
    options: [
      { code: 'alcool', label: 'Alcool' },
      { code: 'cannabis', label: 'Cannabis' },
      { code: 'opiaces', label: 'Opiaces' },
      { code: 'cocaine', label: 'Cocaine' },
      { code: 'hallucinogene', label: 'Hallucinogene' },
      { code: 'drogues_multiples', label: 'Drogues multiples' },
      { code: 'sedatif_hypnotique', label: 'Sedatif ou Hypnotique' },
      { code: 'stimulants', label: 'Stimulants' },
      { code: 'anxiolytique', label: 'Anxiolytique' },
      { code: 'antidepresseurs', label: 'Antidepresseurs' },
      { code: 'corticoides', label: 'Corticoides' },
      { code: 'interferon', label: 'Interferon' },
      { code: 'antipaludeen', label: 'Antipaludeen' },
      { code: 'autre', label: 'Autre' }
    ]
  },
  {
    id: 'substance_autre',
    text: 'Specifier la substance',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'substance_type' }, 'autre'] }
  },
  {
    id: 'substance_trouble_type',
    text: 'Preciser le type de trouble induit par la substance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'disorder_type' }, 'trouble_humeur_induit_substance'] },
    options: [
      { code: 'episode_allure_depression_majeure', label: 'Episode d\'allure de depression majeure' },
      { code: 'episode_caracteristiques_depressives', label: 'Episode avec caracteristiques depressives' },
      { code: 'episode_caracteristiques_maniaques', label: 'Episode avec caracteristiques maniaques' },
      { code: 'episode_caracteristiques_mixtes', label: 'Episode avec caracteristiques mixtes' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'unspecified_depression_type',
    text: 'Trouble depressif non specifie',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'disorder_type' }, 'trouble_depressif_non_specifie'] },
    options: [
      { code: 'post_psychotique_schizophrenie', label: 'Trouble depressif post psychotique a une schizophrenie' },
      { code: 'majeur_surajout_psychotique', label: 'Trouble depressif majeur surajoute a un trouble psychotique' },
      { code: 'dysphorique_premenstruel', label: 'Trouble dysphorique pre-menstruel' },
      { code: 'mineur', label: 'Trouble depressif mineur' },
      { code: 'bref_recurrent', label: 'Trouble depressif bref recurrent' },
      { code: 'autre', label: 'Autre' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },

  // ========================================================================
  // SECTION 2: First Episode Characteristics
  // ========================================================================
  {
    id: 'section_2',
    text: 'CARACTERISTIQUES DU PREMIER EPISODE',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'first_episode_type',
    text: 'Type du premier episode',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] },
    options: [
      { code: 'edm_sans_psychotiques', label: 'Episode Depressif Majeur sans caracteristiques psychotiques' },
      { code: 'edm_avec_psychotiques', label: 'Episode Depressif Majeur avec caracteristiques psychotiques' },
      { code: 'hypomanie', label: 'Hypomanie' },
      { code: 'manie_sans_psychotiques', label: 'Manie sans caracteristiques psychotiques' },
      { code: 'manie_avec_psychotiques', label: 'Manie avec caracteristiques psychotiques' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'postpartum_first',
    text: 'Survenue en post-partum (dans les 6 premiers mois)',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'initial_cyclothymic_period',
    text: 'Le patient a t\'il presente une periode initiale cyclothymique (periode >2ans)',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },

  // ========================================================================
  // SECTION 3: Lifetime Characteristics
  // ========================================================================
  {
    id: 'section_3',
    text: 'CARACTERISTIQUES DU TROUBLE VIE ENTIERE',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'num_edm',
    text: 'Nombre d\'episodes depressifs majeurs',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'age_first_edm',
    text: 'Age du premier EDM :',
    type: 'number',
    required: false,
    min: 1,
    display_if: { '>': [{ var: 'num_edm' }, 0] }
  },
  {
    id: 'edm_with_psychotic',
    text: 'Au moins un EDM avec caracteristiques psychotiques',
    type: 'single_choice',
    required: false,
    display_if: { '>': [{ var: 'num_edm' }, 0] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'num_edm_psychotic',
    text: 'Indiquer le nombre',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'edm_with_psychotic' }, 'oui'] }
  },
  {
    id: 'edm_with_mixed',
    text: 'Au moins un EDM avec caracteristiques mixtes',
    type: 'single_choice',
    required: false,
    display_if: { '>': [{ var: 'num_edm' }, 0] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'num_edm_mixed',
    text: 'Indiquer le nombre',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'edm_with_mixed' }, 'oui'] }
  },
  {
    id: 'num_hypomanic',
    text: 'Nombre d\'episodes hypomaniaques',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'age_first_hypomanic',
    text: 'Age au premier episode hypomaniaque',
    type: 'text',
    required: false,
    display_if: { '>': [{ var: 'num_hypomanic' }, 0] }
  },
  {
    id: 'num_manic',
    text: 'Nombre d\'episodes maniaques',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'age_first_manic',
    text: 'Age au premier episode maniaque',
    type: 'text',
    required: false,
    display_if: { '>': [{ var: 'num_manic' }, 0] }
  },
  {
    id: 'manic_with_psychotic',
    text: 'Au moins une manie avec caracteristiques psychotiques',
    type: 'single_choice',
    required: false,
    display_if: { '>': [{ var: 'num_manic' }, 0] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'num_manic_psychotic',
    text: 'Indiquer le nombre',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'manic_with_psychotic' }, 'oui'] }
  },
  {
    id: 'manic_with_mixed',
    text: 'Au moins une manie avec caracteristiques mixtes',
    type: 'single_choice',
    required: false,
    display_if: { '>': [{ var: 'num_manic' }, 0] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'num_manic_mixed',
    text: 'Indiquer le nombre',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'manic_with_mixed' }, 'oui'] }
  },
  {
    id: 'induced_episodes',
    text: 'Presence d\'au moins un episode induit (virage sous Antidepresseurs ou ECT)',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'num_induced_episodes',
    text: 'Indiquer le nombre',
    type: 'number',
    required: false,
    min: 1,
    display_if: { '==': [{ var: 'induced_episodes' }, 'oui'] }
  },
  {
    id: 'rapid_cycling',
    text: 'Presence de cycles rapides actuels ou passes',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'complete_remission',
    text: 'Remission complete entre les episodes',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'seasonal_pattern',
    text: 'Caractere saisonnier',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'seasonal_depression',
    text: 'Depression saisonniere',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'seasonal_pattern' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'seasonal_depression_season',
    text: 'Saisons',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'seasonal_depression' }, 'oui'] },
    options: [
      { code: 'printemps', label: 'Printemps' },
      { code: 'ete', label: 'Ete' },
      { code: 'automne', label: 'Automne' },
      { code: 'hiver', label: 'Hiver' }
    ]
  },
  {
    id: 'seasonal_hypomania',
    text: '(hypo)manie saisonniere',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'seasonal_pattern' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'seasonal_hypomania_season',
    text: 'Saisons',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'seasonal_hypomania' }, 'oui'] },
    options: [
      { code: 'printemps', label: 'Printemps' },
      { code: 'ete', label: 'Ete' },
      { code: 'automne', label: 'Automne' },
      { code: 'hiver', label: 'Hiver' }
    ]
  },
  {
    id: 'age_first_psychotrope',
    text: 'Age du premier traitement psychotrope',
    type: 'number',
    required: false,
    min: 1,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'age_first_thymoregulator',
    text: 'Age du premier traitement thymoregulateur',
    type: 'number',
    required: false,
    min: 1,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'age_first_hospitalization',
    text: 'Age de la premiere hospitalisation',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'number_of_hospitalizations',
    text: 'Nombre d\'hospitalisations',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'total_hospitalization_duration_months',
    text: 'Duree totale des hospitalisations (en mois)',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },

  // Section 3.4: 12-month characteristics
  {
    id: 'section_3_4',
    text: 'CARACTERISTIQUE DU TROUBLE AU COURS DES 12 DERNIERS MOIS',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'past_year_episode',
    text: 'Presence d\'au moins un episode thymique au cours de l\'annee ecoulee',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'past_year_num_edm',
    text: 'Nombre d\'episodes depressifs majeurs au cours de l\'annee',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'past_year_episode' }, 'oui'] }
  },
  {
    id: 'past_year_edm_psychotic',
    text: 'Au moins un EDM avec caracteristiques psychotiques',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'past_year_episode' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'past_year_num_edm_psychotic',
    text: 'Nombre d\'EDM avec caracteristiques psychotiques',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'past_year_edm_psychotic' }, 'oui'] }
  },
  {
    id: 'past_year_edm_mixed',
    text: 'Au moins un EDM avec caracteristiques mixtes',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'past_year_episode' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'past_year_num_edm_mixed',
    text: 'Nombre d\'EDM avec caracteristiques mixtes',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'past_year_edm_mixed' }, 'oui'] }
  },
  {
    id: 'past_year_num_hypomanic',
    text: 'Nombre d\'episodes hypomaniaques au cours de l\'annee:',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'past_year_episode' }, 'oui'] }
  },
  {
    id: 'past_year_num_manic',
    text: 'Nombre d\'episodes maniaques au cours de l\'annee:',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'past_year_episode' }, 'oui'] }
  },
  {
    id: 'past_year_manic_psychotic',
    text: 'Au moins un episode maniaque avec caracteristiques psychotiques',
    type: 'single_choice',
    required: false,
    display_if: { '>': [{ var: 'past_year_num_manic' }, 0] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'past_year_num_manic_psychotic',
    text: 'Nombre d\'episode maniaque avec caracteristiques psychotiques',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'past_year_manic_psychotic' }, 'oui'] }
  },
  {
    id: 'past_year_manic_mixed',
    text: 'Au moins un episode maniaque avec caracteristiques mixtes',
    type: 'single_choice',
    required: false,
    display_if: { '>': [{ var: 'past_year_num_manic' }, 0] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'past_year_num_manic_mixed',
    text: 'Nombre d\'episode maniaque avec caracteristiques mixtes',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'past_year_manic_mixed' }, 'oui'] }
  },
  {
    id: 'past_year_num_hospitalizations',
    text: 'Nombre d\'hospitalisations',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'past_year_hospitalization_weeks',
    text: 'Duree totale des hospitalisations (en semaine) au cours de l\'annee ecoulee',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'past_year_work_leave',
    text: '9. Arret de travail au cours de l\'annee passee',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'non_applicable', label: 'Non applicable' }
    ]
  },
  {
    id: 'past_year_num_work_leaves',
    text: 'Nombre d\'arrets de travail sur l\'annee ecoulee',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'past_year_work_leave_weeks',
    text: 'Duree totale des arrets de travail sur l\'annee ecoulee (en semaines)',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },

  // ========================================================================
  // SECTION 4: Most Recent Episode
  // ========================================================================
  {
    id: 'section_4',
    text: 'CARACTERISTIQUES DE L\'EPISODE LE PLUS RECENT',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'recent_episode_start_date',
    text: 'Date de debut de l\'episode le plus recent',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'recent_episode_end_date',
    text: 'Date de fin de l\'episode le plus recent',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'recent_episode_type',
    text: 'Type d\'episode le plus recent',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] },
    options: [
      { code: 'edm', label: 'Episode Depressif Majeur' },
      { code: 'hypomanie', label: 'Hypomanie' },
      { code: 'manie', label: 'Manie' },
      { code: 'non_specifie', label: 'Episode non specifie' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'recent_episode_catatonic',
    text: 'Type d\'episode Catatonique',
    type: 'single_choice',
    required: false,
    display_if: { 'in': [{ var: 'recent_episode_type' }, ['manie', 'non_specifie']] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'recent_manie_mixed',
    text: 'Type d\'episode mixte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'recent_episode_type' }, 'manie'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'recent_edm_subtype',
    text: 'Specifier EDM',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'recent_episode_type' }, 'edm'] },
    options: [
      { code: 'sans_caracteristique', label: 'Sans caracteristique melancolique atypique catatonique ou mixte' },
      { code: 'melancolique', label: 'Melancolique' },
      { code: 'atypique', label: 'Atypique' },
      { code: 'catatonique', label: 'Catatonique' },
      { code: 'mixte', label: 'Mixte' }
    ]
  },
  {
    id: 'recent_episode_severity',
    text: 'Severite de l\'episode le plus recent',
    type: 'single_choice',
    required: false,
    display_if: { 'in': [{ var: 'recent_episode_type' }, ['edm', 'manie', 'non_specifie']] },
    options: [
      { code: 'leger', label: 'Leger' },
      { code: 'modere', label: 'Modere' },
      { code: 'severe_sans_psychotiques', label: 'Severe sans caracteristiques psychotiques' },
      { code: 'severe_psychotiques_non_congruentes', label: 'Severe avec caracteristiques psychotiques non congruentes' },
      { code: 'severe_psychotiques_congruentes', label: 'Severe avec caracteristiques psychotiques congruentes' }
    ]
  },
  {
    id: 'recent_edm_chronic',
    text: 'Chronicite de l\'episode le plus recent',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'recent_episode_type' }, 'edm'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'recent_episode_postpartum',
    text: 'Survenue en post-partum',
    type: 'single_choice',
    required: false,
    display_if: { 'in': [{ var: 'recent_episode_type' }, ['edm', 'hypomanie', 'manie', 'non_specifie']] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },

  // ========================================================================
  // SECTION 5: Current Episode
  // ========================================================================
  {
    id: 'section_5',
    text: 'CARACTERISTIQUES DU TROUBLE DE L\'HUMEUR ACTUEL',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'current_episode_present',
    text: 'Presence d\'un episode actuel',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'current_episode_type',
    text: 'Type d\'episode actuel',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'current_episode_present' }, 'oui'] },
    options: [
      { code: 'edm', label: 'Episode Depressif Majeur' },
      { code: 'hypomanie', label: 'Hypomaniaque' },
      { code: 'manie', label: 'Maniaque' },
      { code: 'non_specifie', label: 'Episode Non specifie' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'current_edm_subtype',
    text: 'Type d\'episode EDM actuel',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'current_episode_type' }, 'edm'] },
    options: [
      { code: 'sans_caracteristique', label: 'Sans caracteristique melancolique atypique catatonique ou mixte' },
      { code: 'melancolique', label: 'Melancolique' },
      { code: 'atypique', label: 'Atypique' },
      { code: 'catatonique', label: 'Catatonique' },
      { code: 'mixte', label: 'Mixte' }
    ]
  },
  {
    id: 'current_episode_catatonic',
    text: 'Type d\'episode Catatonique',
    type: 'single_choice',
    required: false,
    display_if: { 'in': [{ var: 'current_episode_type' }, ['manie', 'non_specifie']] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'current_manie_mixed',
    text: 'Type d\'episode Mixte:',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'current_episode_type' }, 'manie'] }
  },
  {
    id: 'current_episode_severity',
    text: 'Severite de l\'episode actuel',
    type: 'single_choice',
    required: false,
    display_if: { 'in': [{ var: 'current_episode_type' }, ['edm', 'manie', 'non_specifie']] },
    options: [
      { code: 'leger', label: 'Leger' },
      { code: 'modere', label: 'Modere' },
      { code: 'severe_sans_psychotique', label: 'Severe sans caracteristique psychotique' },
      { code: 'severe_psychotiques_non_congruentes', label: 'Severe avec caracteristiques psychotiques non congruentes' },
      { code: 'severe_psychotiques_congruentes', label: 'Severe avec caracteristiques psychotiques congruentes' }
    ]
  },
  {
    id: 'current_edm_chronic',
    text: 'Chronicite de l\'episode actuel',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'current_episode_type' }, 'edm'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'current_episode_postpartum',
    text: 'Survenue en post-partum',
    type: 'single_choice',
    required: false,
    display_if: { 'in': [{ var: 'current_episode_type' }, ['edm', 'hypomanie', 'manie', 'non_specifie']] },
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

export const DSM5_HUMEUR_DEFINITION: QuestionnaireDefinition = {
  id: 'dsm5_humeur',
  code: 'DSM5_HUMEUR',
  title: 'DSM5 - Troubles de l\'humeur',
  description: 'Diagnostic DSM5 des troubles de l\'humeur pour l\'evaluation initiale du trouble bipolaire',
  questions: DSM5_HUMEUR_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
