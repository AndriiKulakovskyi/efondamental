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
      { code: 'bipolaire_type_1', label: 'Bipolaire de type 1' },
      { code: 'bipolaire_type_2', label: 'Bipolaire de type 2' },
      { code: 'bipolaire_non_specifie', label: 'Bipolaire non spécifié' },
      { code: 'trouble_depressif_majeur', label: 'Trouble Dépressif Majeur' },
      { code: 'trouble_dysthymique', label: 'Trouble dysthymique' },
      { code: 'trouble_humeur_affection_medicale', label: 'Trouble de l\'humeur dû à une affection médicale générale' },
      { code: 'trouble_humeur_induit_substance', label: 'Trouble de l\'humeur induit par l\'utilisation d\'une substance' },
      { code: 'trouble_depressif_non_specifie', label: 'Trouble dépressif non spécifié' },
      { code: 'trouble_cyclothymique', label: 'Trouble Cyclothymique' },
      { code: 'autre', label: 'Autre' }
    ],
    help: 'ATTENTION: Si Dysthymie, Cyclothymie ou Dépressif non spécifié est sélectionné, le patient sort de la cohorte (critère d\'exclusion)'
  },
  {
    id: 'disorder_type_autre',
    text: 'Préciser',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'disorder_type' }, 'autre'] }
  },
  
  // Major Depressive Disorder subtype
  {
    id: 'major_depression_type',
    text: 'Type du trouble Dépressif Majeur',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'disorder_type' }, 'trouble_depressif_majeur'] },
    options: [
      { code: 'isole', label: 'Isolé' },
      { code: 'recurrent', label: 'Récurrent' }
    ]
  },
  
  // Dysthymic disorder subtype
  {
    id: 'dysthymic_type',
    text: 'Type du trouble dysthymique',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'disorder_type' }, 'trouble_dysthymique'] },
    options: [
      { code: 'precoce', label: 'Précoce' },
      { code: 'tardif', label: 'Tardif' }
    ]
  },
  
  // Medical condition subsection
  {
    id: 'medical_condition_affection_type',
    text: 'Préciser le type d\'affection',
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
    text: 'Spécifier l\'affection',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'medical_condition_affection_type' }, 'autre'] }
  },
  {
    id: 'medical_condition_trouble_type',
    text: 'Préciser le type de trouble',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'disorder_type' }, 'trouble_humeur_affection_medicale'] },
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
    text: 'Préciser le type de substance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'disorder_type' }, 'trouble_humeur_induit_substance'] },
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
      { code: 'autre', label: 'Autre' }
    ]
  },
  {
    id: 'substance_autre',
    text: 'Spécifier la substance',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'substance_type' }, 'autre'] }
  },
  {
    id: 'substance_trouble_type',
    text: 'Préciser le type de trouble induit par la substance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'disorder_type' }, 'trouble_humeur_induit_substance'] },
    options: [
      { code: 'episode_allure_depression_majeure', label: 'Episode d\'allure de dépression majeure' },
      { code: 'episode_caracteristiques_depressives', label: 'Episode avec caractéristiques dépressives' },
      { code: 'episode_caracteristiques_maniaques', label: 'Episode avec caractéristiques maniaques' },
      { code: 'episode_caracteristiques_mixtes', label: 'Episode avec caractéristiques mixtes' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Unspecified depressive disorder subsection
  {
    id: 'unspecified_depression_type',
    text: 'Trouble dépressif non spécifié',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'disorder_type' }, 'trouble_depressif_non_specifie'] },
    options: [
      { code: 'post_psychotique_schizophrenie', label: 'Trouble dépressif post psychotique à une schizophrénie' },
      { code: 'majeur_surajout_psychotique', label: 'Trouble dépressif majeur surajouté à un trouble psychotique' },
      { code: 'dysphorique_premenstruel', label: 'Trouble dysphorique pré-menstruel' },
      { code: 'mineur', label: 'Trouble dépressif mineur' },
      { code: 'bref_recurrent', label: 'Trouble dépressif bref récurrent' },
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
    text: 'Le patient a t\'il présenté une période initiale cyclothymique (période >2ans)',
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
    text: 'Age du premier EDM :',
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
    text: 'Indiquer le nombre',
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
    text: 'Indiquer le nombre',
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
    type: 'text',
    required: false,
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
    type: 'text',
    required: false,
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
    text: 'Indiquer le nombre',
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
    text: 'Indiquer le nombre',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'manic_with_mixed' }, 'oui'] }
  },
  {
    id: 'induced_episodes',
    text: 'Présence d\'au moins un épisode induit (virage sous Antideprésseurs ou ECT)',
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
    id: 'seasonal_depression_season',
    text: 'Saisons',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'seasonal_depression' }, 'oui'] },
    options: [
      { code: 'printemps', label: 'Printemps' },
      { code: 'ete', label: 'Été' },
      { code: 'automne', label: 'Automne' },
      { code: 'hiver', label: 'Hiver' }
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
    id: 'seasonal_hypomania_season',
    text: 'Saisons',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'seasonal_hypomania' }, 'oui'] },
    options: [
      { code: 'printemps', label: 'Printemps' },
      { code: 'ete', label: 'Été' },
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
    text: 'Age de la première hospitalisation',
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
    text: 'Durée totale des hospitalisations (en mois)',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  
  // 3.4 12-month characteristics
  {
    id: 'section_3_4',
    text: 'CARACTERISTIQUE DU TROUBLE AU COURS DES 12 DERNIERS MOIS',
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
    display_if: { '==': [{ var: 'past_year_episode' }, 'oui'] },
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
    display_if: { '==': [{ var: 'past_year_episode' }, 'oui'] },
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
    text: 'Nombre d\'épisodes hypomaniaques au cours de l\'année:',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'past_year_episode' }, 'oui'] }
  },
  {
    id: 'past_year_num_manic',
    text: 'Nombre d\'épisodes maniaques au cours de l\'année:',
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
    text: 'Nombre d\'épisode maniaque avec caractéristiques psychotiques',
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
    text: 'Nombre d\'épisode maniaque avec caractéristiques mixtes',
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
    text: 'Durée totale des hospitalisations (en semaine) au cours de l\'année écoulée',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  
  // Work leave subsection
  {
    id: 'past_year_work_leave',
    text: '9. Arrêt de travail au cours de l\'année passée',
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
    text: 'Nombre d\'arrêts de travail sur l\'année écoulée',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'past_year_work_leave_weeks',
    text: 'Durée totale des arrêts de travail sur l\'année écoulée (en semaines)',
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
    text: 'Date de début de l\'épisode le plus récent',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'recent_episode_end_date',
    text: 'Date de fin de l\'épisode le plus récent',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_mood_disorder' }, 'oui'] }
  },
  {
    id: 'recent_episode_type',
    text: 'Type d\'épisode le plus récent',
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
  
  // Catatonic type - for Manie or Episode non spécifié
  {
    id: 'recent_episode_catatonic',
    text: 'Type d\'épisode Catatonique',
    type: 'single_choice',
    required: false,
    display_if: { 'in': [{ var: 'recent_episode_type' }, ['manie', 'non_specifie']] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Mixed type - for Manie only
  {
    id: 'recent_manie_mixed',
    text: 'Type d\'épisode mixte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'recent_episode_type' }, 'manie'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // EDM recent episode specific fields
  {
    id: 'recent_edm_subtype',
    text: 'Spécifier EDM',
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
  
  // Severity - for EDM, Manie, or Episode non spécifié
  {
    id: 'recent_episode_severity',
    text: 'Sévérité de l\'épisode le plus récent',
    type: 'single_choice',
    required: false,
    display_if: { 'in': [{ var: 'recent_episode_type' }, ['edm', 'manie', 'non_specifie']] },
    options: [
      { code: 'leger', label: 'Léger' },
      { code: 'modere', label: 'Modéré' },
      { code: 'severe_sans_psychotiques', label: 'Sévère sans caractéristiques psychotiques' },
      { code: 'severe_psychotiques_non_congruentes', label: 'Sévère avec caractéristiques psychotiques non congruentes' },
      { code: 'severe_psychotiques_congruentes', label: 'Sévère avec caractéristiques psychotiques congruentes' }
    ]
  },
  
  // Chronicity - for EDM only
  {
    id: 'recent_edm_chronic',
    text: 'Chronicité de l\'épisode le plus récent',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'recent_episode_type' }, 'edm'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Postpartum - for EDM, Hypomanie, Manie, or Episode non spécifié
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
    text: 'Présence d\'un épisode actuel',
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
      { code: 'hypomanie', label: 'Hypomaniaque' },
      { code: 'manie', label: 'Maniaque' },
      { code: 'non_specifie', label: 'Episode Non spécifié' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // EDM current episode specific fields
  {
    id: 'current_edm_subtype',
    text: 'Type d\'épisode EDM actuel',
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
  
  // Catatonic type - for Manie or Episode Non spécifié
  {
    id: 'current_episode_catatonic',
    text: 'Type d\'épisode Catatonique',
    type: 'single_choice',
    required: false,
    display_if: { 'in': [{ var: 'current_episode_type' }, ['manie', 'non_specifie']] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Mixed type - for Manie only (text field in JSON)
  {
    id: 'current_manie_mixed',
    text: 'Type d\'épisode Mixte:',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'current_episode_type' }, 'manie'] }
  },
  
  // Severity - for EDM, Manie, or Episode Non spécifié
  {
    id: 'current_episode_severity',
    text: 'Sévérité de l\'épisode actuel',
    type: 'single_choice',
    required: false,
    display_if: { 'in': [{ var: 'current_episode_type' }, ['edm', 'manie', 'non_specifie']] },
    options: [
      { code: 'leger', label: 'Léger' },
      { code: 'modere', label: 'Modéré' },
      { code: 'severe_sans_psychotique', label: 'Sévère sans caractéristique psychotique' },
      { code: 'severe_psychotiques_non_congruentes', label: 'Sévère avec caractéristiques psychotiques non congruentes' },
      { code: 'severe_psychotiques_congruentes', label: 'Sévère avec caractéristiques psychotiques congruentes' }
    ]
  },
  
  // Chronicity - for EDM only
  {
    id: 'current_edm_chronic',
    text: 'Chronicité de l\'épisode actuel',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'current_episode_type' }, 'edm'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Postpartum - for EDM, Hypomanie, Manie, or Episode Non spécifié
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

export const DSM5_HUMEUR_DEFINITION: QuestionnaireDefinition = {
  id: 'dsm5_humeur',
  code: 'DSM5_HUMEUR_FR',
  title: 'DSM5 - Troubles de l\'humeur',
  description: 'Diagnostic DSM5 des troubles de l\'humeur pour l\'évaluation initiale du trouble bipolaire',
  questions: DSM5_HUMEUR_QUESTIONS,
  metadata: {
    singleColumn: true
  }
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
  questions: DSM5_PSYCHOTIC_QUESTIONS,
  metadata: { singleColumn: true }
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
  
  // 1.1 Panic disorder (parent question)
  {
    id: 'panic_disorder_present',
    text: '1. Trouble panique',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    indentLevel: 1,
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
    indentLevel: 2,
    options: [
      { code: 'sans_agoraphobie', label: 'Sans agoraphobie' },
      { code: 'avec_agoraphobie', label: 'Avec agoraphobie' }
    ]
  },
  {
    id: 'panic_disorder_age_debut',
    text: '1.2. Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { 
      'and': [
        { '==': [{ var: 'panic_disorder_present' }, 'oui'] },
        { 'or': [
          { '==': [{ var: 'panic_disorder_type' }, 'sans_agoraphobie'] },
          { '==': [{ var: 'panic_disorder_type' }, 'avec_agoraphobie'] }
        ]}
      ]
    },
    indentLevel: 2
  },
  {
    id: 'panic_disorder_symptoms_past_month',
    text: '1.3. Présence de symptômes dans le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { 
      'and': [
        { '==': [{ var: 'panic_disorder_present' }, 'oui'] },
        { 'or': [
          { '==': [{ var: 'panic_disorder_type' }, 'sans_agoraphobie'] },
          { '==': [{ var: 'panic_disorder_type' }, 'avec_agoraphobie'] }
        ]}
      ]
    },
    indentLevel: 2,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // 1.2 Agoraphobia without panic
  {
    id: 'agoraphobia_no_panic_present',
    text: '2. Agoraphobie sans trouble panique',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'agoraphobia_no_panic_age_debut',
    text: '2.1. Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'agoraphobia_no_panic_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'agoraphobia_no_panic_symptoms_past_month',
    text: '2.2. Présence de symptômes dans le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'agoraphobia_no_panic_present' }, 'oui'] },
    indentLevel: 2,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.3 Social phobia
  {
    id: 'social_phobia_present',
    text: '3. Phobie sociale',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'social_phobia_age_debut',
    text: '3.1. Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'social_phobia_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'social_phobia_symptoms_past_month',
    text: '3.2. Présence de symptômes dans le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'social_phobia_present' }, 'oui'] },
    indentLevel: 2,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.4 Specific phobia
  {
    id: 'specific_phobia_present',
    text: '4. Phobie spécifique',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'specific_phobia_age_debut',
    text: '4.1. Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'specific_phobia_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'specific_phobia_symptoms_past_month',
    text: '4.2. Présence de symptômes dans le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'specific_phobia_present' }, 'oui'] },
    indentLevel: 2,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.5 OCD
  {
    id: 'ocd_present',
    text: '5. Trouble obsessionnel compulsif',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'ocd_age_debut',
    text: '5.1. Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'ocd_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'ocd_symptoms_past_month',
    text: '5.2. Présence de symptômes dans le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'ocd_present' }, 'oui'] },
    indentLevel: 2,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.6 PTSD
  {
    id: 'ptsd_present',
    text: '6. Stress post-traumatique',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'ptsd_age_debut',
    text: '6.1. Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'ptsd_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'ptsd_symptoms_past_month',
    text: '6.2. Présence de symptômes dans le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'ptsd_present' }, 'oui'] },
    indentLevel: 2,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.7 Generalized anxiety (current episode only)
  {
    id: 'gad_present',
    text: '7. Anxiété généralisée (épisode actuel seulement)',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'gad_age_debut',
    text: '7.1. Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'gad_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'gad_symptoms_past_month',
    text: '7.2. Présence de symptômes dans le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'gad_present' }, 'oui'] },
    indentLevel: 2,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.8 Anxiety due to medical condition
  {
    id: 'anxiety_medical_condition_present',
    text: '8. Trouble anxieux dû à une affection médicale générale',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'anxiety_medical_condition_affection',
    text: '8.1. Spécifier l\'affection',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'anxiety_medical_condition_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'anxiety_medical_condition_age_debut',
    text: '8.2. Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'anxiety_medical_condition_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'anxiety_medical_condition_symptoms_past_month',
    text: '8.3. Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'anxiety_medical_condition_present' }, 'oui'] },
    indentLevel: 2,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.9 Substance-induced anxiety
  {
    id: 'anxiety_substance_induced_present',
    text: '9. Trouble anxieux induit par une substance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'anxiety_substance_induced_substance',
    text: '9.1. Spécifier la substance',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'anxiety_substance_induced_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'anxiety_substance_induced_age_debut',
    text: '9.2. Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'anxiety_substance_induced_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'anxiety_substance_induced_symptoms_past_month',
    text: '9.3. Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'anxiety_substance_induced_present' }, 'oui'] },
    indentLevel: 2,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // 1.10 Unspecified anxiety
  {
    id: 'anxiety_unspecified_present',
    text: '10. Trouble anxieux non spécifié',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_anxiety_disorder' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'anxiety_unspecified_age_debut',
    text: '10.1. Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'anxiety_unspecified_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'anxiety_unspecified_symptoms_past_month',
    text: '10.2. Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'anxiety_unspecified_present' }, 'oui'] },
    indentLevel: 2,
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
    text: '1. Alcool',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    indentLevel: 1,
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
    indentLevel: 2,
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
    display_if: { '==': [{ var: 'alcohol_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'alcohol_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé - Alcool',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'alcohol_present' }, 'oui'] },
    indentLevel: 2,
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
    display_if: { '==': [{ var: 'alcohol_present' }, 'oui'] },
    indentLevel: 2
  },
  
  // Sedatives/Hypnotics/Anxiolytics
  {
    id: 'sedatives_present',
    text: '2. Sédatifs / Hypnotiques / Anxiolytiques',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    indentLevel: 1,
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
    indentLevel: 2,
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
    display_if: { '==': [{ var: 'sedatives_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'sedatives_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé - Sédatifs',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'sedatives_present' }, 'oui'] },
    indentLevel: 2,
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
    display_if: { '==': [{ var: 'sedatives_present' }, 'oui'] },
    indentLevel: 2
  },
  
  // Cannabis
  {
    id: 'cannabis_present',
    text: '3. Cannabis',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    indentLevel: 1,
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
    indentLevel: 2,
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
    display_if: { '==': [{ var: 'cannabis_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'cannabis_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé - Cannabis',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'cannabis_present' }, 'oui'] },
    indentLevel: 2,
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
    display_if: { '==': [{ var: 'cannabis_present' }, 'oui'] },
    indentLevel: 2
  },
  
  // Stimulants
  {
    id: 'stimulants_present',
    text: '4. Stimulants',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    indentLevel: 1,
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
    indentLevel: 2,
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
    display_if: { '==': [{ var: 'stimulants_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'stimulants_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé - Stimulants',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'stimulants_present' }, 'oui'] },
    indentLevel: 2,
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
    display_if: { '==': [{ var: 'stimulants_present' }, 'oui'] },
    indentLevel: 2
  },
  
  // Opiates
  {
    id: 'opiates_present',
    text: '5. Opiacés',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    indentLevel: 1,
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
    indentLevel: 2,
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
    display_if: { '==': [{ var: 'opiates_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'opiates_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé - Opiacés',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'opiates_present' }, 'oui'] },
    indentLevel: 2,
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
    display_if: { '==': [{ var: 'opiates_present' }, 'oui'] },
    indentLevel: 2
  },
  
  // Cocaine
  {
    id: 'cocaine_present',
    text: '6. Cocaïne',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    indentLevel: 1,
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
    indentLevel: 2,
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
    display_if: { '==': [{ var: 'cocaine_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'cocaine_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé - Cocaïne',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'cocaine_present' }, 'oui'] },
    indentLevel: 2,
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
    display_if: { '==': [{ var: 'cocaine_present' }, 'oui'] },
    indentLevel: 2
  },
  
  // Hallucinogens/PCP
  {
    id: 'hallucinogens_present',
    text: '7. Hallucinogènes / PCP',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    indentLevel: 1,
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
    indentLevel: 2,
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
    display_if: { '==': [{ var: 'hallucinogens_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'hallucinogens_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé - Hallucinogènes',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'hallucinogens_present' }, 'oui'] },
    indentLevel: 2,
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
    display_if: { '==': [{ var: 'hallucinogens_present' }, 'oui'] },
    indentLevel: 2
  },
  
  // Other substance
  {
    id: 'other_substance_present',
    text: '8. Autre substance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    indentLevel: 1,
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
    display_if: { '==': [{ var: 'other_substance_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'other_substance_type',
    text: 'Type de trouble - Autre substance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'other_substance_present' }, 'oui'] },
    indentLevel: 2,
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
    display_if: { '==': [{ var: 'other_substance_present' }, 'oui'] },
    indentLevel: 2
  },
  {
    id: 'other_substance_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé - Autre substance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'other_substance_present' }, 'oui'] },
    indentLevel: 2,
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
    display_if: { '==': [{ var: 'other_substance_present' }, 'oui'] },
    indentLevel: 2
  },
  
  // 2.3 Induced disorder without abuse/dependence
  {
    id: 'induced_disorder_present',
    text: '9. En absence d\'abus ou dépendance : existe-t-il un trouble induit par une substance?',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_substance_disorder' }, 'oui'] },
    indentLevel: 1,
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
    indentLevel: 2,
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
    indentLevel: 2,
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
    indentLevel: 2,
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
  {
    id: 'eating_disorder_type',
    text: 'Type du trouble du comportement alimentaire',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_eating_disorder' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'anorexia_restrictive', label: 'Anorexie type restrictive' },
      { code: 'anorexia_bulimic', label: 'Anorexie type boulimie' },
      { code: 'bulimia', label: 'Boulimie seule' },
      { code: 'binge_eating', label: 'Hyperphagie boulimique' },
      { code: 'eating_unspecified', label: 'Trouble des conduites alimentaires non spécifié' },
      { code: 'night_eating', label: 'Night eating syndrome' }
    ]
  },
  
  // 3.2.1 Anorexia restrictive
  {
    id: 'anorexia_restrictive_amenorrhea',
    text: 'Aménorrhée',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'anorexia_restrictive'] },
    indentLevel: 2,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'anorexia_restrictive_age_debut',
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { 
      'and': [
        { '==': [{ var: 'eating_disorder_type' }, 'anorexia_restrictive'] },
        { '==': [{ var: 'anorexia_restrictive_amenorrhea' }, 'oui'] }
      ]
    },
    indentLevel: 3
  },
  {
    id: 'anorexia_restrictive_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { 
      'and': [
        { '==': [{ var: 'eating_disorder_type' }, 'anorexia_restrictive'] },
        { '==': [{ var: 'anorexia_restrictive_amenorrhea' }, 'oui'] }
      ]
    },
    indentLevel: 3
  },
  {
    id: 'anorexia_restrictive_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { 
      'and': [
        { '==': [{ var: 'eating_disorder_type' }, 'anorexia_restrictive'] },
        { '==': [{ var: 'anorexia_restrictive_amenorrhea' }, 'oui'] }
      ]
    },
    indentLevel: 3,
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
    display_if: { 
      'and': [
        { '==': [{ var: 'eating_disorder_type' }, 'anorexia_restrictive'] },
        { '==': [{ var: 'anorexia_restrictive_amenorrhea' }, 'oui'] }
      ]
    },
    indentLevel: 3,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // 3.2.2 Anorexia bulimic
  {
    id: 'anorexia_bulimic_amenorrhea',
    text: 'Aménorrhée',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'anorexia_bulimic'] },
    indentLevel: 2,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'anorexia_bulimic_age_debut',
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { 
      'and': [
        { '==': [{ var: 'eating_disorder_type' }, 'anorexia_bulimic'] },
        { '==': [{ var: 'anorexia_bulimic_amenorrhea' }, 'oui'] }
      ]
    },
    indentLevel: 3
  },
  {
    id: 'anorexia_bulimic_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { 
      'and': [
        { '==': [{ var: 'eating_disorder_type' }, 'anorexia_bulimic'] },
        { '==': [{ var: 'anorexia_bulimic_amenorrhea' }, 'oui'] }
      ]
    },
    indentLevel: 3
  },
  {
    id: 'anorexia_bulimic_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { 
      'and': [
        { '==': [{ var: 'eating_disorder_type' }, 'anorexia_bulimic'] },
        { '==': [{ var: 'anorexia_bulimic_amenorrhea' }, 'oui'] }
      ]
    },
    indentLevel: 3,
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
    display_if: { 
      'and': [
        { '==': [{ var: 'eating_disorder_type' }, 'anorexia_bulimic'] },
        { '==': [{ var: 'anorexia_bulimic_amenorrhea' }, 'oui'] }
      ]
    },
    indentLevel: 3,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // 3.2.3 Bulimia
  {
    id: 'bulimia_age_debut',
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'bulimia'] },
    indentLevel: 2
  },
  {
    id: 'bulimia_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'bulimia'] },
    indentLevel: 2
  },
  {
    id: 'bulimia_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'bulimia'] },
    indentLevel: 2,
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
    indentLevel: 2,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // 3.2.4 Binge eating
  {
    id: 'binge_eating_age_debut',
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'binge_eating'] },
    indentLevel: 2
  },
  {
    id: 'binge_eating_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'binge_eating'] },
    indentLevel: 2
  },
  {
    id: 'binge_eating_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'binge_eating'] },
    indentLevel: 2,
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
    indentLevel: 2,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // 3.2.5 Unspecified eating disorder
  {
    id: 'eating_unspecified_age_debut',
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'eating_unspecified'] },
    indentLevel: 2
  },
  {
    id: 'eating_unspecified_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'eating_unspecified'] },
    indentLevel: 2
  },
  {
    id: 'eating_unspecified_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'eating_unspecified'] },
    indentLevel: 2,
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
    indentLevel: 2,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // 3.2.6 Night eating syndrome
  {
    id: 'night_eating_age_debut',
    text: 'Age de début',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'night_eating'] },
    indentLevel: 2
  },
  {
    id: 'night_eating_age_fin',
    text: 'Age de fin',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'night_eating'] },
    indentLevel: 2
  },
  {
    id: 'night_eating_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'eating_disorder_type' }, 'night_eating'] },
    indentLevel: 2,
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
    indentLevel: 2,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
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
    text: '1. Type de trouble',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_somatoform_disorder' }, 'oui'] },
    indentLevel: 1,
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
    display_if: { 
      'and': [
        { '==': [{ var: 'has_somatoform_disorder' }, 'oui'] },
        { 'in': [{ var: 'somatoform_type' }, ['trouble_somatisation', 'trouble_douloureux', 'trouble_indifferencie', 'hypocondrie', 'peur_dysmorphie_corporelle']] }
      ]
    },
    indentLevel: 2
  },
  {
    id: 'somatoform_symptoms_past_month',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    display_if: { 
      'and': [
        { '==': [{ var: 'has_somatoform_disorder' }, 'oui'] },
        { 'in': [{ var: 'somatoform_type' }, ['trouble_somatisation', 'trouble_douloureux', 'trouble_indifferencie', 'hypocondrie', 'peur_dysmorphie_corporelle']] }
      ]
    },
    indentLevel: 2,
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
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1
  },
  {
    id: 'diva_a1a_adult',
    text: 'A1a – Souvent, ne parvient pas à prêter attention aux détails ou fait des fautes d\'étourderie - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a1a_childhood',
    text: 'A1a - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a1b_adult',
    text: 'A1b – A souvent du mal à soutenir son attention au travail ou dans les jeux - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a1b_childhood',
    text: 'A1b - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a1c_adult',
    text: 'A1c – Semble souvent ne pas écouter quand on lui parle personnellement - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a1c_childhood',
    text: 'A1c - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a1d_adult',
    text: 'A1d – Souvent, ne se conforme pas aux consignes et ne parvient pas à mener à terme ses devoirs - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a1d_childhood',
    text: 'A1d - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a1e_adult',
    text: 'A1e – A souvent du mal à organiser ses travaux ou ses activités - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a1e_childhood',
    text: 'A1e - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a1f_adult',
    text: 'A1f – Souvent, évite, a en aversion ou fait à contre-cœur les tâches nécessitant un effort mental soutenu - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a1f_childhood',
    text: 'A1f - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a1g_adult',
    text: 'A1g – Perd souvent les objets nécessaires à son travail ou à ses activités - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a1g_childhood',
    text: 'A1g - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a1h_adult',
    text: 'A1h – Se laisse facilement distraire par des stimuli externes - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a1h_childhood',
    text: 'A1h - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a1i_adult',
    text: 'A1i – A des oublis fréquents dans la vie quotidienne - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a1i_childhood',
    text: 'A1i - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // 5.2.2 Hyperactivity/Impulsivity symptoms (A2a-A2i)
  {
    id: 'section_diva_hyperactivity',
    text: '5.2.2 Critères Hyperactivité-Impulsivité',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1
  },
  {
    id: 'diva_a2a_adult',
    text: 'A2a – Remue souvent les mains ou les pieds, ou se tortille sur son siège - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a2a_childhood',
    text: 'A2a - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a2b_adult',
    text: 'A2b – Se lève souvent en classe ou dans d\'autres situations où il est supposé rester assis - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a2b_childhood',
    text: 'A2b - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a2c_adult',
    text: 'A2c – Court ou grimpe souvent partout dans des situations inappropriées (chez l\'adulte: sentiment d\'impatience motrice) - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a2c_childhood',
    text: 'A2c - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a2d_adult',
    text: 'A2d – A souvent du mal à se tenir tranquille dans les jeux ou activités de loisir - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a2d_childhood',
    text: 'A2d - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a2e_adult',
    text: 'A2e – Est souvent « sur la brèche » ou agit comme s\'il était « monté sur ressorts » - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a2e_childhood',
    text: 'A2e - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a2f_adult',
    text: 'A2f – Parle souvent trop - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a2f_childhood',
    text: 'A2f - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a2g_adult',
    text: 'A2g – Laisse souvent échapper la réponse à une question avant qu\'elle ne soit entièrement posée - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a2g_childhood',
    text: 'A2g - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a2h_adult',
    text: 'A2h – A souvent du mal à attendre son tour - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a2h_childhood',
    text: 'A2h - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a2i_adult',
    text: 'A2i – Interrompt souvent les autres ou impose sa présence - Présent à l\'âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_a2i_childhood',
    text: 'A2i - Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // 5.3 Totals
  {
    id: 'section_diva_totals',
    text: '5.3 Totaux des critères',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1
  },
  {
    id: 'diva_total_inattention_adult',
    text: 'Total Inattention âge adulte',
    type: 'number',
    required: false,
    min: 0,
    max: 9,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
  },
  {
    id: 'diva_total_inattention_childhood',
    text: 'Total Inattention enfance',
    type: 'number',
    required: false,
    min: 0,
    max: 9,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
  },
  {
    id: 'diva_total_hyperactivity_adult',
    text: 'Total Hyperactivité/Impulsivité âge adulte',
    type: 'number',
    required: false,
    min: 0,
    max: 9,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
  },
  {
    id: 'diva_total_hyperactivity_childhood',
    text: 'Total Hyperactivité/Impulsivité enfance',
    type: 'number',
    required: false,
    min: 0,
    max: 9,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
  },
  
  // 5.4 DSM-IV Criteria
  {
    id: 'section_diva_criteria',
    text: '5.4 Critères diagnostiques',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1
  },
  {
    id: 'diva_criteria_a_inattention_gte6',
    text: 'DSM-IV Critère A - Nombre de symptômes A ≥ 6?',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_criteria_a_hyperactivity_gte6',
    text: 'DSM-IV Critère A - Nombre de symptômes H/I ≥ 6?',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_criteria_b_lifetime_persistence',
    text: 'DSM-IV Critère B - Persistance sur la vie entière?',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_criteria_cd_impairment_childhood',
    text: 'DSM-IV Critères C et D - Altération dans ≥ 2 environnements: Enfance',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_criteria_cd_impairment_adult',
    text: 'DSM-IV Critères C et D - Altération dans ≥ 2 environnements: Âge adulte',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'diva_criteria_e_better_explained',
    text: 'DSM-IV Critère E - Symptômes mieux expliqués par un autre trouble?',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
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
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1
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
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
  },
  
  // 5.6 ADHD Diagnosis
  {
    id: 'section_diva_diagnosis',
    text: '5.6 Diagnostic TDAH',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'diva_evaluated' }, 'oui'] },
    indentLevel: 1
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
  questions: DSM5_COMORBID_ALL_QUESTIONS,
  metadata: {
    singleColumn: true
  }
};

