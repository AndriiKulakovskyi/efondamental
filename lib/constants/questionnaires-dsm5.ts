import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from './questionnaires';

// ============================================================================
// DSM5 - Troubles de l'humeur (Mood Disorders)
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
      { code: 'bipolaire_type_1', label: 'Bipolaire de Type I' },
      { code: 'bipolaire_type_2', label: 'Bipolaire de Type II' },
      { code: 'bipolaire_non_specifie', label: 'Bipolaire non spécifié' },
      { code: 'trouble_depressif_majeur_isole', label: 'Trouble Dépressif Majeur - Isolé' },
      { code: 'trouble_depressif_majeur_recurrent', label: 'Trouble Dépressif Majeur - Récurrent' },
      { code: 'trouble_dysthymique_precoce', label: 'Trouble dysthymique - Précoce' },
      { code: 'trouble_dysthymique_tardif', label: 'Trouble dysthymique - Tardif' }
    ]
  },
  
  // Medical condition subsection
  {
    id: 'medical_condition_affection_type',
    text: 'Trouble de l\'humeur dû à une affection médicale générale - Préciser le type d\'affection',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] },
    options: [
      { code: 'endocrinienne', label: 'Endocrinienne' },
      { code: 'neurologique', label: 'Neurologique' },
      { code: 'cardio_vasculaire', label: 'Cardio-vasculaire' },
      { code: 'autre', label: 'Autre (spécifier)' }
    ]
  },
  {
    id: 'medical_condition_affection_autre',
    text: 'Autre affection (spécifier)',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'medical_condition_affection_type' }, 'autre'] }
  },
  {
    id: 'medical_condition_trouble_type',
    text: 'Préciser le type de trouble',
    type: 'single_choice',
    required: false,
    display_if: { '!=': [{ var: 'medical_condition_affection_type' }, null] },
    options: [
      { code: 'episode_allure_depression_majeure', label: 'Episode d\'allure de dépression majeure' },
      { code: 'episode_caracteristiques_depressives', label: 'Episode avec caractéristiques dépressives' },
      { code: 'episode_caracteristiques_maniaques', label: 'Episode avec caractéristiques maniaques' },
      { code: 'episode_caracteristiques_mixtes', label: 'Episode avec caractéristiques mixtes' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Substance-induced subsection
  {
    id: 'substance_type',
    text: 'Trouble de l\'humeur induit par l\'utilisation d\'une substance - Préciser le type de substance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] },
    options: [
      { code: 'alcool', label: 'Alcool' },
      { code: 'cannabis', label: 'Cannabis' },
      { code: 'opiaces', label: 'Opiacés' },
      { code: 'cocaine', label: 'Cocaïne' },
      { code: 'hallucinogene', label: 'Hallucinogène' },
      { code: 'drogues_multiples', label: 'Drogues multiples' },
      { code: 'sedatif_hypnotique', label: 'Sédatif ou Hypnotique' },
      { code: 'stimulants', label: 'Stimulants' },
      { code: 'anxiolytique', label: 'Anxiolytique' },
      { code: 'antidepresseurs', label: 'Antidépresseurs' },
      { code: 'corticoides', label: 'Corticoïdes' },
      { code: 'interferon', label: 'Interféron' },
      { code: 'antipaludeen', label: 'Antipaludéen' },
      { code: 'autre', label: 'Autre (spécifier)' }
    ]
  },
  {
    id: 'substance_autre',
    text: 'Autre substance (spécifier)',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'substance_type' }, 'autre'] }
  },
  {
    id: 'substance_trouble_type',
    text: 'Préciser le type de trouble induit par la substance',
    type: 'single_choice',
    required: false,
    display_if: { '!=': [{ var: 'substance_type' }, null] },
    options: [
      { code: 'episode_allure_depression_majeure', label: 'Episode d\'allure de dépression majeure' },
      { code: 'episode_caracteristiques_depressives', label: 'Episode avec caractéristiques dépressives' },
      { code: 'episode_caracteristiques_maniaques', label: 'Episode avec caractéristiques maniaques' },
      { code: 'episode_caracteristiques_mixtes', label: 'Episode avec caractéristiques mixtes' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Unspecified depression subsection
  {
    id: 'unspecified_depression_post_schizophrenie',
    text: 'Trouble dépressif non spécifié - Trouble dépressif post psychotique à une schizophrénie',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'unspecified_depression_majeur_surajout',
    text: 'Trouble dépressif non spécifié - Trouble dépressif majeur surajouté à un trouble psychotique',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'unspecified_depression_dysphorique_premenstruel',
    text: 'Trouble dépressif non spécifié - Trouble dysphorique prémenstruel',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'unspecified_depression_mineur',
    text: 'Trouble dépressif non spécifié - Trouble dépressif mineur',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'unspecified_depression_bref_recurrent',
    text: 'Trouble dépressif non spécifié - Trouble dépressif bref récurrent',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'unspecified_depression_autre',
    text: 'Trouble dépressif non spécifié - Autre',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'unspecified_depression_ne_sais_pas',
    text: 'Trouble dépressif non spécifié - Ne sais pas',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  
  // Cyclothymic and Other
  {
    id: 'cyclothymic',
    text: 'Trouble Cyclothymique',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'other_specify',
    text: 'Autre (préciser)',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  
  // ========================================================================
  // SECTION 2: First Episode Characteristics
  // ========================================================================
  {
    id: 'section_2',
    text: '2. Caractéristiques du premier épisode',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'first_episode_type',
    text: 'Type du premier épisode',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] },
    options: [
      { code: 'edm_sans_psychotiques', label: 'Episode Dépressif Majeur sans caractéristiques psychotiques' },
      { code: 'edm_avec_psychotiques', label: 'Episode Dépressif Majeur avec caractéristiques psychotiques' },
      { code: 'hypomanie', label: 'Hypomanie' },
      { code: 'manie_sans_psychotiques', label: 'Manie sans caractéristiques psychotiques' },
      { code: 'manie_avec_psychotiques', label: 'Manie avec caractéristiques psychotiques' },
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
    text: 'Le patient a-t-il présenté une période initiale cyclothymique (période >2ans)',
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
    text: '3. Caractéristiques du Trouble Vie Entière',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  
  // 3.1 Major Depressive Episodes
  {
    id: 'num_edm',
    text: 'Nombre d\'épisodes dépressifs majeurs',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'age_first_edm',
    text: 'Age du premier EDM',
    type: 'number',
    required: false,
    min: 1,
    display_if: { '>': [{ var: 'num_edm' }, 0] }
  },
  {
    id: 'edm_with_psychotic',
    text: 'Au moins un EDM avec caractéristiques psychotiques',
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
    text: 'Nombre d\'EDM avec caractéristiques psychotiques',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'edm_with_psychotic' }, 'oui'] }
  },
  {
    id: 'edm_with_mixed',
    text: 'Au moins un EDM avec caractéristiques mixtes',
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
    text: 'Nombre d\'EDM avec caractéristiques mixtes',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'edm_with_mixed' }, 'oui'] }
  },
  
  // 3.2 Hypomanic Episodes
  {
    id: 'num_hypomanic',
    text: 'Nombre d\'épisodes hypomaniaques',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'age_first_hypomanic',
    text: 'Age au premier épisode hypomaniaque',
    type: 'number',
    required: false,
    min: 1,
    display_if: { '>': [{ var: 'num_hypomanic' }, 0] }
  },
  
  // 3.3 Manic Episodes
  {
    id: 'num_manic',
    text: 'Nombre d\'épisodes maniaques',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'age_first_manic',
    text: 'Age au premier épisode maniaque',
    type: 'number',
    required: false,
    min: 1,
    display_if: { '>': [{ var: 'num_manic' }, 0] }
  },
  {
    id: 'manic_with_psychotic',
    text: 'Au moins une manie avec caractéristiques psychotiques',
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
    text: 'Nombre de manies avec caractéristiques psychotiques',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'manic_with_psychotic' }, 'oui'] }
  },
  {
    id: 'manic_with_mixed',
    text: 'Au moins une manie avec caractéristiques mixtes',
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
    text: 'Nombre de manies avec caractéristiques mixtes',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'manic_with_mixed' }, 'oui'] }
  },
  {
    id: 'induced_episodes',
    text: 'Présence d\'au moins un épisode induit (virage sous Antidépresseurs ou ECT)?',
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
    id: 'num_induced_episodes',
    text: 'Nombre d\'épisodes induits',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'induced_episodes' }, 'oui'] }
  },
  {
    id: 'rapid_cycling',
    text: 'Présence de cycles rapides actuels ou passés',
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
    text: 'Rémission complète entre les épisodes',
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
    text: 'Caractère saisonnier',
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
    text: 'Dépression saisonnière',
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
    id: 'seasonal_hypomania',
    text: '(hypo)manie saisonnière',
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
    id: 'seasonal_seasons',
    text: 'Saisons (préciser)',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'seasonal_pattern' }, 'oui'] },
    help: 'Exemple: Printemps, Été, Automne, Hiver'
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
    text: 'Age du premier traitement psychotrope thymorégulateur',
    type: 'number',
    required: false,
    min: 1,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'age_first_hospitalization',
    text: 'Age de la première hospitalisation',
    type: 'number',
    required: false,
    min: 1,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'num_hospitalizations',
    text: 'Nombre d\'hospitalisations',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'total_hospitalization_months',
    text: 'Durée totale des hospitalisations (en mois)',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  
  // 3.4 12-month characteristics
  {
    id: 'section_3_4',
    text: '3.4 Caractéristique du trouble au cours des 12 derniers mois',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'past_year_episode',
    text: 'Présence d\'au moins un épisode thymique au cours de l\'année écoulée',
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
    text: 'Nombre d\'épisodes dépressifs majeurs au cours de l\'année',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'past_year_episode' }, 'oui'] }
  },
  {
    id: 'past_year_edm_psychotic',
    text: 'Au moins un EDM avec caractéristiques psychotiques',
    type: 'single_choice',
    required: false,
    display_if: { '>': [{ var: 'past_year_num_edm' }, 0] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'past_year_num_edm_psychotic',
    text: 'Nombre d\'EDM avec caractéristiques psychotiques',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'past_year_edm_psychotic' }, 'oui'] }
  },
  {
    id: 'past_year_edm_mixed',
    text: 'Au moins un EDM avec caractéristiques mixtes',
    type: 'single_choice',
    required: false,
    display_if: { '>': [{ var: 'past_year_num_edm' }, 0] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'past_year_num_edm_mixed',
    text: 'Nombre d\'EDM avec caractéristiques mixtes',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'past_year_edm_mixed' }, 'oui'] }
  },
  {
    id: 'past_year_num_hypomanic',
    text: 'Nombre d\'épisodes hypomaniaques au cours de l\'année',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'past_year_episode' }, 'oui'] }
  },
  {
    id: 'past_year_num_manic',
    text: 'Nombre d\'épisodes maniaques au cours de l\'année',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'past_year_episode' }, 'oui'] }
  },
  {
    id: 'past_year_manic_psychotic',
    text: 'Au moins un épisode maniaque avec caractéristiques psychotiques',
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
    text: 'Nombre d\'épisodes maniaques avec caractéristiques psychotiques',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'past_year_manic_psychotic' }, 'oui'] }
  },
  {
    id: 'past_year_manic_mixed',
    text: 'Au moins un épisode maniaque avec caractéristiques mixtes',
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
    text: 'Nombre d\'épisodes maniaques avec caractéristiques mixtes',
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
    display_if: { '==': [{ var: 'past_year_episode' }, 'oui'] }
  },
  {
    id: 'past_year_hospitalization_weeks',
    text: 'Durée totale des hospitalisations sur l\'année écoulée (en semaines)',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '>': [{ var: 'past_year_num_hospitalizations' }, 0] }
  },
  
  // Work leave subsection
  {
    id: 'past_year_work_leave',
    text: 'Arrêt de travail au cours de l\'année passée',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'past_year_episode' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'non_applicable', label: 'Non applicable' }
    ]
  },
  {
    id: 'past_year_num_work_leaves',
    text: 'Nombre d\'arrêts de travail sur l\'année écoulée',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'past_year_work_leave' }, 'oui'] },
    help: 'Indiquer un nombre ou "ne sais pas"'
  },
  {
    id: 'past_year_work_leave_weeks',
    text: 'Durée totale des arrêts de travail sur l\'année écoulée (en semaines)',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'past_year_work_leave' }, 'oui'] }
  },
  
  // ========================================================================
  // SECTION 4: Most Recent Episode
  // ========================================================================
  {
    id: 'section_4',
    text: '4. Caractéristiques de l\'épisode le plus récent',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'recent_episode_start_date',
    text: 'Date de début de l\'épisode le plus récent',
    type: 'date',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'recent_episode_end_date',
    text: 'Date de fin de l\'épisode le plus récent',
    type: 'date',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'recent_episode_type',
    text: 'Type de l\'épisode le plus récent',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] },
    options: [
      { code: 'edm', label: 'Episode Dépressif Majeur' },
      { code: 'hypomanie', label: 'Hypomanie' },
      { code: 'manie', label: 'Manie' },
      { code: 'non_specifie', label: 'Episode non spécifié' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // EDM recent episode specific fields
  {
    id: 'recent_edm_subtype',
    text: 'Si l\'épisode le plus récent est un Episode Dépressif Majeur - Préciser le type',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'recent_episode_type' }, 'edm'] },
    options: [
      { code: 'sans_caracteristique', label: 'Sans caractéristique mélancolique atypique catatonique ou mixte' },
      { code: 'melancolique', label: 'Mélancolique' },
      { code: 'atypique', label: 'Atypique' },
      { code: 'catatonique', label: 'Catatonique' },
      { code: 'mixte', label: 'Mixte' }
    ]
  },
  {
    id: 'recent_edm_severity',
    text: 'Sévérité de l\'épisode le plus récent (EDM)',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'recent_episode_type' }, 'edm'] },
    options: [
      { code: 'leger', label: 'Léger' },
      { code: 'modere', label: 'Modéré' },
      { code: 'severe_sans_psychotiques', label: 'Sévère sans caractéristiques psychotiques' },
      { code: 'severe_psychotiques_non_congruentes', label: 'Sévère avec caractéristiques psychotiques non congruentes' },
      { code: 'severe_psychotiques_congruentes', label: 'Sévère avec caractéristiques psychotiques congruentes' }
    ]
  },
  {
    id: 'recent_edm_chronic',
    text: 'Chronicité de l\'épisode le plus récent (EDM)',
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
    id: 'recent_edm_postpartum',
    text: 'Survenue en post-partum (6 derniers mois) - EDM',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'recent_episode_type' }, 'edm'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Hypomanie recent episode specific fields
  {
    id: 'recent_hypomanie_postpartum',
    text: 'Survenue en post-partum (6 derniers mois) - Hypomanie',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'recent_episode_type' }, 'hypomanie'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Manie recent episode specific fields
  {
    id: 'recent_manie_catatonic',
    text: 'Type d\'épisode Catatonique (Manie)',
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
    id: 'recent_manie_mixed',
    text: 'Type d\'épisode mixte (Manie)',
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
    id: 'recent_manie_severity',
    text: 'Sévérité de l\'épisode le plus récent (Manie)',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'recent_episode_type' }, 'manie'] },
    options: [
      { code: 'leger', label: 'Léger' },
      { code: 'modere', label: 'Modéré' },
      { code: 'severe_sans_psychotiques', label: 'Sévère sans caractéristiques psychotiques' },
      { code: 'severe_psychotiques_non_congruentes', label: 'Sévère avec caractéristiques psychotiques non congruentes' },
      { code: 'severe_psychotiques_congruentes', label: 'Sévère avec caractéristiques psychotiques congruentes' }
    ]
  },
  {
    id: 'recent_manie_postpartum',
    text: 'Survenue en post-partum (6 derniers mois) - Manie',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'recent_episode_type' }, 'manie'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Non-specified recent episode fields
  {
    id: 'recent_non_specifie_catatonic',
    text: 'Type d\'épisode Catatonique (Episode non spécifié)',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'recent_episode_type' }, 'non_specifie'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'recent_non_specifie_severity',
    text: 'Sévérité de l\'épisode le plus récent (Episode non spécifié)',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'recent_episode_type' }, 'non_specifie'] },
    options: [
      { code: 'leger', label: 'Léger' },
      { code: 'modere', label: 'Modéré' },
      { code: 'severe_sans_psychotiques', label: 'Sévère sans caractéristiques psychotiques' },
      { code: 'severe_psychotiques_non_congruentes', label: 'Sévère avec caractéristiques psychotiques non congruentes' },
      { code: 'severe_psychotiques_congruentes', label: 'Sévère avec caractéristiques psychotiques congruentes' }
    ]
  },
  {
    id: 'recent_non_specifie_postpartum',
    text: 'Survenue en post-partum (6 derniers mois) - Episode non spécifié',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'recent_episode_type' }, 'non_specifie'] },
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
    text: '5. Trouble de l\'humeur actuel',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'current_episode_present',
    text: 'Présence d\'un épisode actuel?',
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
    text: 'Type d\'épisode actuel',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'current_episode_present' }, 'oui'] },
    options: [
      { code: 'edm', label: 'Episode Dépressif Majeur' },
      { code: 'hypomanie', label: 'Hypomanie' },
      { code: 'manie', label: 'Manie' },
      { code: 'non_specifie', label: 'Episode non spécifié' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // EDM current episode specific fields
  {
    id: 'current_edm_subtype',
    text: 'Si l\'épisode actuel est un Episode Dépressif Majeur - Préciser le type',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'current_episode_type' }, 'edm'] },
    options: [
      { code: 'sans_caracteristique', label: 'Sans caractéristique mélancolique atypique catatonique ou mixte' },
      { code: 'melancolique', label: 'Mélancolique' },
      { code: 'atypique', label: 'Atypique' },
      { code: 'catatonique', label: 'Catatonique' },
      { code: 'mixte', label: 'Mixte' }
    ]
  },
  {
    id: 'current_edm_severity',
    text: 'Sévérité de l\'épisode actuel (EDM)',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'current_episode_type' }, 'edm'] },
    options: [
      { code: 'leger', label: 'Léger' },
      { code: 'modere', label: 'Modéré' },
      { code: 'severe_sans_psychotiques', label: 'Sévère sans caractéristiques psychotiques' },
      { code: 'severe_psychotiques_non_congruentes', label: 'Sévère avec caractéristiques psychotiques non congruentes' },
      { code: 'severe_psychotiques_congruentes', label: 'Sévère avec caractéristiques psychotiques congruentes' }
    ]
  },
  {
    id: 'current_edm_chronic',
    text: 'Chronicité de l\'épisode actuel (EDM)',
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
    id: 'current_edm_postpartum',
    text: 'Survenue en post-partum (6 derniers mois) - EDM',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'current_episode_type' }, 'edm'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Hypomanie current episode specific fields
  {
    id: 'current_hypomanie_postpartum',
    text: 'Survenue en post-partum (6 derniers mois) - Hypomanie',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'current_episode_type' }, 'hypomanie'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Manie current episode specific fields
  {
    id: 'current_manie_catatonic',
    text: 'Type d\'épisode Catatonique (Manie)',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'current_episode_type' }, 'manie'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'current_manie_mixed',
    text: 'Type d\'épisode mixte (Manie)',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'current_episode_type' }, 'manie'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'current_manie_severity',
    text: 'Sévérité de l\'épisode actuel (Manie)',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'current_episode_type' }, 'manie'] },
    options: [
      { code: 'leger', label: 'Léger' },
      { code: 'modere', label: 'Modéré' },
      { code: 'severe_sans_psychotiques', label: 'Sévère sans caractéristiques psychotiques' },
      { code: 'severe_psychotiques_non_congruentes', label: 'Sévère avec caractéristiques psychotiques non congruentes' },
      { code: 'severe_psychotiques_congruentes', label: 'Sévère avec caractéristiques psychotiques congruentes' }
    ]
  },
  {
    id: 'current_manie_postpartum',
    text: 'Survenue en post-partum (6 derniers mois) - Manie',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'current_episode_type' }, 'manie'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Non-specified current episode fields
  {
    id: 'current_non_specifie_catatonic',
    text: 'Type d\'épisode Catatonique (Episode non spécifié)',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'current_episode_type' }, 'non_specifie'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'current_non_specifie_severity',
    text: 'Sévérité de l\'épisode actuel (Episode non spécifié)',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'current_episode_type' }, 'non_specifie'] },
    options: [
      { code: 'leger', label: 'Léger' },
      { code: 'modere', label: 'Modéré' },
      { code: 'severe_sans_psychotiques', label: 'Sévère sans caractéristiques psychotiques' },
      { code: 'severe_psychotiques_non_congruentes', label: 'Sévère avec caractéristiques psychotiques non congruentes' },
      { code: 'severe_psychotiques_congruentes', label: 'Sévère avec caractéristiques psychotiques congruentes' }
    ]
  },
  {
    id: 'current_non_specifie_postpartum',
    text: 'Survenue en post-partum (6 derniers mois) - Episode non spécifié',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'current_episode_type' }, 'non_specifie'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  }
];

export const DSM5_HUMEUR_DEFINITION: QuestionnaireDefinition = {
  id: 'dsm5_humeur',
  code: 'DSM5_HUMEUR_FR',
  title: 'DSM5 - Troubles de l\'humeur',
  description: 'Diagnostic DSM5 des troubles de l\'humeur pour l\'évaluation initiale du trouble bipolaire',
  questions: DSM5_HUMEUR_QUESTIONS
};

// ============================================================================
// DSM5 - Troubles Psychotiques (Psychotic Disorders)
// ============================================================================

export const DSM5_PSYCHOTIC_QUESTIONS: Question[] = [
  {
    id: 'has_psychotic_disorder',
    text: 'Le patient a-t-il un trouble psychotique?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'psychotic_disorder_date',
    text: 'Date de survenue du trouble psychotique',
    type: 'date',
    required: false,
    display_if: { '==': [{ var: 'has_psychotic_disorder' }, 'oui'] }
  },
  {
    id: 'disorder_type',
    text: 'Type de trouble',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_psychotic_disorder' }, 'oui'] },
    options: [
      { code: 'schizophrenie', label: 'Schizophrénie' },
      { code: 'trouble_schizophreniforme', label: 'Trouble schizophréniforme' },
      { code: 'trouble_schizo_affectif', label: 'Trouble schizo-affectif' },
      { code: 'troubles_delirants', label: 'Troubles délirants' },
      { code: 'trouble_psychotique_bref', label: 'Trouble psychotique bref' },
      { code: 'trouble_psychotique_partage', label: 'Trouble psychotique partagé' },
      { code: 'trouble_psychotique_affection_medicale', label: 'Trouble psychotique induit par une affection médicale générale' },
      { code: 'trouble_psychotique_substance', label: 'Trouble psychotique induit par une substance' },
      { code: 'trouble_psychotique_non_specifie', label: 'Trouble psychotique non spécifié' }
    ]
  },
  {
    id: 'symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_psychotic_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  }
];

export const DSM5_PSYCHOTIC_DEFINITION: QuestionnaireDefinition = {
  id: 'dsm5_psychotic',
  code: 'DSM5_PSYCHOTIC_FR',
  title: 'DSM5 - Trouble Psychotique',
  description: 'Diagnostic DSM5 des troubles psychotiques pour l\'évaluation initiale du trouble bipolaire',
  questions: DSM5_PSYCHOTIC_QUESTIONS
};

// ============================================================================
// DSM5 - Troubles Comorbides (Comorbid Disorders)
// SECTION 1: ANXIETY DISORDERS
// ============================================================================

export const DSM5_COMORBID_SECTION1_QUESTIONS: Question[] = [
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
  
  // 1.2.1 Panic disorder without agoraphobia
  {
    id: 'panic_no_agoraphobia_present',
    text: 'Trouble panique sans agoraphobie?',
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
    id: 'panic_no_agoraphobia_age_debut',
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'panic_no_agoraphobia_present' }, 'oui'] }
  },
  {
    id: 'panic_no_agoraphobia_symptoms_past_month',
    text: 'Présence de symptômes dans le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'panic_no_agoraphobia_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.2.2 Panic disorder with agoraphobia
  {
    id: 'panic_with_agoraphobia_present',
    text: 'Trouble panique avec agoraphobie?',
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
    id: 'panic_with_agoraphobia_age_debut',
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'panic_with_agoraphobia_present' }, 'oui'] }
  },
  {
    id: 'panic_with_agoraphobia_symptoms_past_month',
    text: 'Présence de symptômes dans le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'panic_with_agoraphobia_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.2.3 Agoraphobia without panic
  {
    id: 'agoraphobia_no_panic_present',
    text: 'Agoraphobie sans trouble panique?',
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
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'agoraphobia_no_panic_present' }, 'oui'] }
  },
  {
    id: 'agoraphobia_no_panic_symptoms_past_month',
    text: 'Présence de symptômes dans le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'agoraphobia_no_panic_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.2.4 Social phobia
  {
    id: 'social_phobia_present',
    text: 'Phobie sociale?',
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
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'social_phobia_present' }, 'oui'] }
  },
  {
    id: 'social_phobia_symptoms_past_month',
    text: 'Présence de symptômes dans le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'social_phobia_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.2.5 Specific phobia
  {
    id: 'specific_phobia_present',
    text: 'Phobie spécifique?',
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
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'specific_phobia_present' }, 'oui'] }
  },
  {
    id: 'specific_phobia_symptoms_past_month',
    text: 'Présence de symptômes dans le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'specific_phobia_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.2.6 OCD
  {
    id: 'ocd_present',
    text: 'Trouble obsessionnel compulsif?',
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
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'ocd_present' }, 'oui'] }
  },
  {
    id: 'ocd_symptoms_past_month',
    text: 'Présence de symptômes dans le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'ocd_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.2.7 PTSD
  {
    id: 'ptsd_present',
    text: 'Stress post-traumatique?',
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
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'ptsd_present' }, 'oui'] }
  },
  {
    id: 'ptsd_symptoms_past_month',
    text: 'Présence de symptômes dans le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'ptsd_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.2.8 Generalized anxiety (current episode only)
  {
    id: 'gad_present',
    text: 'Anxiété généralisée (épisode actuel seulement)?',
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
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'gad_present' }, 'oui'] }
  },
  {
    id: 'gad_symptoms_past_month',
    text: 'Présence de symptômes dans le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'gad_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.3 Anxiety due to medical condition
  {
    id: 'anxiety_medical_condition_present',
    text: 'Trouble anxieux dû à une affection médicale générale?',
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
    text: 'Spécifier l\'affection',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'anxiety_medical_condition_present' }, 'oui'] }
  },
  {
    id: 'anxiety_medical_condition_age_debut',
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'anxiety_medical_condition_present' }, 'oui'] }
  },
  {
    id: 'anxiety_medical_condition_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'anxiety_medical_condition_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.4 Substance-induced anxiety
  {
    id: 'anxiety_substance_induced_present',
    text: 'Trouble anxieux induit par une substance?',
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
    text: 'Spécifier la substance',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'anxiety_substance_induced_present' }, 'oui'] }
  },
  {
    id: 'anxiety_substance_induced_age_debut',
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'anxiety_substance_induced_present' }, 'oui'] }
  },
  {
    id: 'anxiety_substance_induced_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'anxiety_substance_induced_present' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.5 Unspecified anxiety
  {
    id: 'anxiety_unspecified_present',
    text: 'Trouble anxieux non spécifié?',
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
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'anxiety_unspecified_present' }, 'oui'] }
  },
  {
    id: 'anxiety_unspecified_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
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
// SECTION 2: SUBSTANCE-RELATED DISORDERS (LIFETIME)
// ============================================================================

const DSM5_COMORBID_SECTION2_QUESTIONS: Question[] = [
  {
    id: 'section_substance',
    text: 'Section 2 - Troubles liés à une substance (vie entière)',
    type: 'section',
    required: false
  },
  {
    id: 'has_substance_disorder',
    text: 'Le patient a-t-il ou a-t-il eu un trouble lié à l\'utilisation d\'une substance (abus ou dépendance)?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Alcohol
  {
    id: 'alcohol_present',
    text: 'Alcool',
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
      { code: 'dependance', label: 'Dépendance' }
    ]
  },
  {
    id: 'alcohol_age_debut',
    text: 'Age de début - Alcool',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'alcohol_present' }, 'oui'] }
  },
  {
    id: 'alcohol_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé - Alcool',
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
    text: 'Durée cumulée du trouble (mois) - Alcool',
    type: 'number',
    required: false,
    min: 0,
    max: 2000,
    display_if: { '==': [{ var: 'alcohol_present' }, 'oui'] }
  },
  
  // Sedatives/Hypnotics/Anxiolytics
  {
    id: 'sedatives_present',
    text: 'Sédatifs / Hypnotiques / Anxiolytiques',
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
    text: 'Type de trouble - Sédatifs',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'sedatives_present' }, 'oui'] },
    options: [
      { code: 'abus', label: 'Abus' },
      { code: 'dependance', label: 'Dépendance' }
    ]
  },
  {
    id: 'sedatives_age_debut',
    text: 'Age de début - Sédatifs',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'sedatives_present' }, 'oui'] }
  },
  {
    id: 'sedatives_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé - Sédatifs',
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
    text: 'Durée cumulée du trouble (mois) - Sédatifs',
    type: 'number',
    required: false,
    min: 0,
    max: 2000,
    display_if: { '==': [{ var: 'sedatives_present' }, 'oui'] }
  },
  
  // Cannabis
  {
    id: 'cannabis_present',
    text: 'Cannabis',
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
      { code: 'dependance', label: 'Dépendance' }
    ]
  },
  {
    id: 'cannabis_age_debut',
    text: 'Age de début - Cannabis',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'cannabis_present' }, 'oui'] }
  },
  {
    id: 'cannabis_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé - Cannabis',
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
    text: 'Durée cumulée du trouble (mois) - Cannabis',
    type: 'number',
    required: false,
    min: 0,
    max: 2000,
    display_if: { '==': [{ var: 'cannabis_present' }, 'oui'] }
  },
  
  // Stimulants
  {
    id: 'stimulants_present',
    text: 'Stimulants',
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
      { code: 'dependance', label: 'Dépendance' }
    ]
  },
  {
    id: 'stimulants_age_debut',
    text: 'Age de début - Stimulants',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'stimulants_present' }, 'oui'] }
  },
  {
    id: 'stimulants_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé - Stimulants',
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
    text: 'Durée cumulée du trouble (mois) - Stimulants',
    type: 'number',
    required: false,
    min: 0,
    max: 2000,
    display_if: { '==': [{ var: 'stimulants_present' }, 'oui'] }
  },
  
  // Opiates
  {
    id: 'opiates_present',
    text: 'Opiacés',
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
    text: 'Type de trouble - Opiacés',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'opiates_present' }, 'oui'] },
    options: [
      { code: 'abus', label: 'Abus' },
      { code: 'dependance', label: 'Dépendance' }
    ]
  },
  {
    id: 'opiates_age_debut',
    text: 'Age de début - Opiacés',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'opiates_present' }, 'oui'] }
  },
  {
    id: 'opiates_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé - Opiacés',
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
    text: 'Durée cumulée du trouble (mois) - Opiacés',
    type: 'number',
    required: false,
    min: 0,
    max: 2000,
    display_if: { '==': [{ var: 'opiates_present' }, 'oui'] }
  },
  
  // Cocaine
  {
    id: 'cocaine_present',
    text: 'Cocaïne',
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
    text: 'Type de trouble - Cocaïne',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'cocaine_present' }, 'oui'] },
    options: [
      { code: 'abus', label: 'Abus' },
      { code: 'dependance', label: 'Dépendance' }
    ]
  },
  {
    id: 'cocaine_age_debut',
    text: 'Age de début - Cocaïne',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'cocaine_present' }, 'oui'] }
  },
  {
    id: 'cocaine_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé - Cocaïne',
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
    text: 'Durée cumulée du trouble (mois) - Cocaïne',
    type: 'number',
    required: false,
    min: 0,
    max: 2000,
    display_if: { '==': [{ var: 'cocaine_present' }, 'oui'] }
  },
  
  // Hallucinogens/PCP
  {
    id: 'hallucinogens_present',
    text: 'Hallucinogènes / PCP',
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
    text: 'Type de trouble - Hallucinogènes',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'hallucinogens_present' }, 'oui'] },
    options: [
      { code: 'abus', label: 'Abus' },
      { code: 'dependance', label: 'Dépendance' }
    ]
  },
  {
    id: 'hallucinogens_age_debut',
    text: 'Age de début - Hallucinogènes',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'hallucinogens_present' }, 'oui'] }
  },
  {
    id: 'hallucinogens_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé - Hallucinogènes',
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
    text: 'Durée cumulée du trouble (mois) - Hallucinogènes',
    type: 'number',
    required: false,
    min: 0,
    max: 2000,
    display_if: { '==': [{ var: 'hallucinogens_present' }, 'oui'] }
  },
  
  // Other substance
  {
    id: 'other_substance_present',
    text: 'Autre substance',
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
      { code: 'dependance', label: 'Dépendance' }
    ]
  },
  {
    id: 'other_substance_age_debut',
    text: 'Age de début - Autre substance',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'other_substance_present' }, 'oui'] }
  },
  {
    id: 'other_substance_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé - Autre substance',
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
    text: 'Durée cumulée du trouble (mois) - Autre substance',
    type: 'number',
    required: false,
    min: 0,
    max: 2000,
    display_if: { '==': [{ var: 'other_substance_present' }, 'oui'] }
  },
  
  // 2.3 Induced disorder without abuse/dependence
  {
    id: 'induced_disorder_present',
    text: 'En absence d\'abus ou dépendance : existe-t-il un trouble induit par une substance?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'induced_substances',
    text: 'Type de substance responsable (sélection multiple possible)',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'induced_disorder_present' }, 'oui'] },
    options: [
      'Alcool',
      'Sédatifs Hypnotiques-Anxiolytiques',
      'Cannabis',
      'Stimulants',
      'Opiacés',
      'Cocaïne',
      'Hallucinogènes / PCP',
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
      { code: 'delirium', label: 'Délirium' },
      { code: 'demence_persistante', label: 'Démence persistante' },
      { code: 'trouble_amnesique', label: 'Trouble amnésique' },
      { code: 'trouble_psychotique', label: 'Trouble psychotique' },
      { code: 'trouble_humeur', label: 'Trouble de l\'humeur' },
      { code: 'trouble_anxieux', label: 'Trouble anxieux' },
      { code: 'trouble_sommeil', label: 'Trouble du sommeil' },
      { code: 'trouble_perceptions_hallucinogenes', label: 'Trouble persistant des perceptions liées aux hallucinogènes' }
    ]
  },
  {
    id: 'induced_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
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
// SECTION 3: EATING DISORDERS (CURRENT)
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
  
  // 3.2.1 Anorexia restrictive
  {
    id: 'anorexia_restrictive_amenorrhea',
    text: 'Anorexie type restrictive - Aménorrhée',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  {
    id: 'anorexia_restrictive_age_debut',
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  {
    id: 'anorexia_restrictive_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  {
    id: 'anorexia_restrictive_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'anorexia_restrictive_current',
    text: 'Trouble actuel',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  
  // 3.2.2 Anorexia bulimic
  {
    id: 'anorexia_bulimic_amenorrhea',
    text: 'Anorexie type boulimie - Aménorrhée',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  {
    id: 'anorexia_bulimic_age_debut',
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  {
    id: 'anorexia_bulimic_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  {
    id: 'anorexia_bulimic_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'anorexia_bulimic_current',
    text: 'Trouble actuel',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  
  // 3.2.3 Bulimia
  {
    id: 'bulimia_age_debut',
    text: 'Boulimie seule - Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  {
    id: 'bulimia_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  {
    id: 'bulimia_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'bulimia_current',
    text: 'Trouble actuel',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  
  // 3.2.4 Binge eating
  {
    id: 'binge_eating_age_debut',
    text: 'Hyperphagie boulimique - Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  {
    id: 'binge_eating_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  {
    id: 'binge_eating_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'binge_eating_current',
    text: 'Trouble actuel',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  
  // 3.2.5 Unspecified eating disorder
  {
    id: 'eating_unspecified_age_debut',
    text: 'Trouble des conduites alimentaires non spécifié - Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  {
    id: 'eating_unspecified_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  {
    id: 'eating_unspecified_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'eating_unspecified_current',
    text: 'Trouble actuel',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  
  // 3.2.6 Night eating syndrome
  {
    id: 'night_eating_age_debut',
    text: 'Night eating syndrome - Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  {
    id: 'night_eating_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  },
  {
    id: 'night_eating_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'night_eating_current',
    text: 'Trouble actuel',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] }
  }
];

// ============================================================================
// SECTION 4: SOMATOFORM DISORDER
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
    text: 'Type de trouble',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_somatoform_disorder' }, 'oui'] },
    options: [
      { code: 'trouble_somatisation', label: 'Trouble de somatisation' },
      { code: 'trouble_douloureux', label: 'Trouble douloureux' },
      { code: 'trouble_indifferencie', label: 'Trouble indifférencié' },
      { code: 'hypocondrie', label: 'Hypocondrie' },
      { code: 'peur_dysmorphie_corporelle', label: 'Peur d\'une dysmorphie corporelle' }
    ]
  },
  {
    id: 'somatoform_age_debut',
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'has_somatoform_disorder' }, 'oui'] }
  },
  {
    id: 'somatoform_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
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
// SECTION 5: ADHD DIVA ASSESSMENT
// ============================================================================

const DSM5_COMORBID_SECTION5_QUESTIONS: Question[] = [
  {
    id: 'section_diva',
    text: 'Section 5 - Évaluation DIVA pour TDAH',
    type: 'section',
    required: false
  },
  {
    id: 'diva_evaluated',
    text: 'Le patient a-t-il été évalué avec la DIVA pour le TDAH?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 5.2.1 Inattention symptoms (A1a-A1i)
  {
    id: 'section_diva_inattention',
    text: '5.2.1 Critères d\'Inattention',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1a_adult',
    text: 'A1a – Souvent, ne parvient pas à prêter attention aux détails ou fait des fautes d\'étourderie - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1a_childhood',
    text: 'A1a - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1b_adult',
    text: 'A1b – A souvent du mal à soutenir son attention au travail ou dans les jeux - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1b_childhood',
    text: 'A1b - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1c_adult',
    text: 'A1c – Semble souvent ne pas écouter quand on lui parle personnellement - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1c_childhood',
    text: 'A1c - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1d_adult',
    text: 'A1d – Souvent, ne se conforme pas aux consignes et ne parvient pas à mener à terme ses devoirs - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1d_childhood',
    text: 'A1d - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1e_adult',
    text: 'A1e – A souvent du mal à organiser ses travaux ou ses activités - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1e_childhood',
    text: 'A1e - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1f_adult',
    text: 'A1f – Souvent, évite, a en aversion ou fait à contre-cœur les tâches nécessitant un effort mental soutenu - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1f_childhood',
    text: 'A1f - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1g_adult',
    text: 'A1g – Perd souvent les objets nécessaires à son travail ou à ses activités - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1g_childhood',
    text: 'A1g - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1h_adult',
    text: 'A1h – Se laisse facilement distraire par des stimuli externes - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1h_childhood',
    text: 'A1h - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1i_adult',
    text: 'A1i – A des oublis fréquents dans la vie quotidienne - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a1i_childhood',
    text: 'A1i - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  
  // 5.2.2 Hyperactivity/Impulsivity symptoms (A2a-A2i)
  {
    id: 'section_diva_hyperactivity',
    text: '5.2.2 Critères Hyperactivité-Impulsivité',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2a_adult',
    text: 'A2a – Remue souvent les mains ou les pieds, ou se tortille sur son siège - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2a_childhood',
    text: 'A2a - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2b_adult',
    text: 'A2b – Se lève souvent en classe ou dans d\'autres situations où il est supposé rester assis - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2b_childhood',
    text: 'A2b - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2c_adult',
    text: 'A2c – Court ou grimpe souvent partout dans des situations inappropriées (chez l\'adulte: sentiment d\'impatience motrice) - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2c_childhood',
    text: 'A2c - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2d_adult',
    text: 'A2d – A souvent du mal à se tenir tranquille dans les jeux ou activités de loisir - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2d_childhood',
    text: 'A2d - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2e_adult',
    text: 'A2e – Est souvent « sur la brèche » ou agit comme s\'il était « monté sur ressorts » - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2e_childhood',
    text: 'A2e - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2f_adult',
    text: 'A2f – Parle souvent trop - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2f_childhood',
    text: 'A2f - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2g_adult',
    text: 'A2g – Laisse souvent échapper la réponse à une question avant qu\'elle ne soit entièrement posée - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2g_childhood',
    text: 'A2g - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2h_adult',
    text: 'A2h – A souvent du mal à attendre son tour - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2h_childhood',
    text: 'A2h - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2i_adult',
    text: 'A2i – Interrompt souvent les autres ou impose sa présence - Présent à l\'âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_a2i_childhood',
    text: 'A2i - Présent dans l\'enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  
  // 5.3 Totals
  {
    id: 'section_diva_totals',
    text: '5.3 Totaux des critères',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_total_inattention_adult',
    text: 'Total Inattention âge adulte',
    type: 'number',
    required: false,
    min: 0,
    max: 9,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_total_inattention_childhood',
    text: 'Total Inattention enfance',
    type: 'number',
    required: false,
    min: 0,
    max: 9,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_total_hyperactivity_adult',
    text: 'Total Hyperactivité/Impulsivité âge adulte',
    type: 'number',
    required: false,
    min: 0,
    max: 9,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_total_hyperactivity_childhood',
    text: 'Total Hyperactivité/Impulsivité enfance',
    type: 'number',
    required: false,
    min: 0,
    max: 9,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  
  // 5.4 DSM-IV Criteria
  {
    id: 'section_diva_criteria',
    text: '5.4 Critères diagnostiques',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_criteria_a_inattention_gte6',
    text: 'DSM-IV Critère A - Nombre de symptômes A ≥ 6?',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_criteria_a_hyperactivity_gte6',
    text: 'DSM-IV Critère A - Nombre de symptômes H/I ≥ 6?',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_criteria_b_lifetime_persistence',
    text: 'DSM-IV Critère B - Persistance sur la vie entière?',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_criteria_cd_impairment_childhood',
    text: 'DSM-IV Critères C et D - Altération dans ≥ 2 environnements: Enfance',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_criteria_cd_impairment_adult',
    text: 'DSM-IV Critères C et D - Altération dans ≥ 2 environnements: Âge adulte',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_criteria_e_better_explained',
    text: 'DSM-IV Critère E - Symptômes mieux expliqués par un autre trouble?',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_criteria_e_explanation',
    text: 'Si oui, par quel trouble?',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'diva_criteria_e_better_explained' }, true] }
  },
  
  // 5.5 Collateral information
  {
    id: 'section_diva_collateral',
    text: '5.5 Informations collatérales',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_collateral_parents',
    text: 'Parent(s) / frère / sœur / autre',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    options: [
      { code: 0, label: 'N/A' },
      { code: 0, label: '0 (aucun)' },
      { code: 1, label: '1 (quelque)' },
      { code: 2, label: '2 (support net)' }
    ]
  },
  {
    id: 'diva_collateral_partner',
    text: 'Partenaire / ami proche / autre',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    options: [
      { code: 0, label: 'N/A' },
      { code: 0, label: '0 (aucun)' },
      { code: 1, label: '1 (quelque)' },
      { code: 2, label: '2 (support net)' }
    ]
  },
  {
    id: 'diva_collateral_school_reports',
    text: 'Livrets scolaires',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    options: [
      { code: 0, label: 'N/A' },
      { code: 0, label: '0 (aucun)' },
      { code: 1, label: '1 (quelque)' },
      { code: 2, label: '2 (support net)' }
    ]
  },
  {
    id: 'diva_collateral_details',
    text: 'Détails',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  
  // 5.6 ADHD Diagnosis
  {
    id: 'section_diva_diagnosis',
    text: '5.6 Diagnostic TDAH',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] }
  },
  {
    id: 'diva_diagnosis',
    text: 'Diagnostic TDAH',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    options: [
      { code: 'non', label: 'Non' },
      { code: '314_01_combined', label: 'Oui - 314.01 Type combiné' },
      { code: '314_00_inattentive', label: 'Oui - 314.00 Type inattentif prédominant' },
      { code: '314_01_hyperactive_impulsive', label: 'Oui - 314.01 Type hyperactif/impulsif prédominant' }
    ]
  }
];

// Combine all sections
const DSM5_COMORBID_ALL_QUESTIONS = [
  ...DSM5_COMORBID_SECTION1_QUESTIONS,
  ...DSM5_COMORBID_SECTION2_QUESTIONS,
  ...DSM5_COMORBID_SECTION3_QUESTIONS,
  ...DSM5_COMORBID_SECTION4_QUESTIONS,
  ...DSM5_COMORBID_SECTION5_QUESTIONS
];

export const DSM5_COMORBID_DEFINITION: QuestionnaireDefinition = {
  id: 'dsm5_comorbid',
  code: 'DSM5_COMORBID_FR',
  title: 'DSM5 - Troubles comorbides',
  description: 'Diagnostic DSM5 des troubles comorbides pour l\'évaluation initiale du trouble bipolaire',
  questions: DSM5_COMORBID_ALL_QUESTIONS
};

