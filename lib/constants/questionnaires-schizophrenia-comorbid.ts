// eFondaMental Platform - Schizophrenia Comorbid Disorders Questionnaire
// Assessment of psychiatric comorbidities in schizophrenia patients
// Includes mood disorders, anxiety disorders, and ADHD screening

import { Question, QuestionOption } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from './questionnaires';

// ============================================================================
// COMMON OPTIONS
// ============================================================================

export const TROUBLES_COMORBIDES_YES_NO_UNKNOWN_OPTIONS: QuestionOption[] = [
  { code: 'Oui', label: 'Oui' },
  { code: 'Non', label: 'Non' },
  { code: 'Ne sais pas', label: 'Ne sais pas' }
];

export const TROUBLES_COMORBIDES_YES_NO_OPTIONS: QuestionOption[] = [
  { code: 'Oui', label: 'Oui' },
  { code: 'Non', label: 'Non' }
];

export const PANIC_DISORDER_TYPE_OPTIONS: QuestionOption[] = [
  { code: 'Sans agoraphobie', label: 'Sans agoraphobie' },
  { code: 'Avec agoraphobie', label: 'Avec agoraphobie' }
];

export const EATING_DISORDER_TYPE_OPTIONS: QuestionOption[] = [
  { code: 'Anorexie type restrictive', label: 'Anorexie type restrictive' },
  { code: 'Anorexie type boulimie', label: 'Anorexie type boulimie' },
  { code: 'Hyperphagie boulimique', label: 'Hyperphagie boulimique' },
  { code: 'Boulimie seule', label: 'Boulimie seule' },
  { code: 'Trouble des conduites alimentaires non specifie', label: 'Trouble des conduites alimentaires non specifie' }
];

// ============================================================================
// HELPER FUNCTIONS FOR OPTION GENERATION
// ============================================================================

function generateAgeOptions(): QuestionOption[] {
  const options: QuestionOption[] = [
    { code: 'Ne sais pas', label: 'Ne sais pas' },
    { code: '<5', label: '<5' }
  ];
  
  for (let i = 5; i <= 89; i++) {
    options.push({ code: i.toString(), label: `${i} ans` });
  }
  
  options.push({ code: '>89', label: '>89' });
  
  return options;
}

function generateCountOptions(max: number): QuestionOption[] {
  const options: QuestionOption[] = [
    { code: 'Ne sais pas', label: 'Ne sais pas' }
  ];
  
  for (let i = 0; i <= max; i++) {
    options.push({ code: i.toString(), label: i.toString() });
  }
  
  options.push({ code: `>${max}`, label: `>${max}` });
  
  return options;
}

// ============================================================================
// TROUBLES COMORBIDES QUESTIONNAIRE
// ============================================================================

export const TROUBLES_COMORBIDES_SZ_QUESTIONS: Question[] = [
  // ==================== SECTION 1: MOOD DISORDERS ====================
  {
    id: 'section_mood_disorders',
    text: 'Trouble thymique (survenant en dehors des episodes psychotiques)',
    type: 'section',
    required: false
  },
  {
    id: 'rad_tb_thy_episode_dep_maj',
    text: 'Le patient a-t-il eu des episodes depressifs majeurs (y compris depression post-psychotique)',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tb_thy_age_debut',
    text: 'Age de debut du premier episode',
    type: 'single_choice',
    required: false,
    options: generateAgeOptions(),
    display_if: { '==': [{ 'var': 'rad_tb_thy_episode_dep_maj' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_tb_thy_nb_episode',
    text: 'Nombre d\'episodes sur la vie entiere',
    type: 'single_choice',
    required: false,
    options: generateCountOptions(20),
    display_if: { '==': [{ 'var': 'rad_tb_thy_episode_dep_maj' }, 'Oui'] },
    indentLevel: 1
  },

  // ==================== SECTION 2: ANXIETY DISORDERS ====================
  {
    id: 'section_anxiety_disorders',
    text: 'Troubles anxieux',
    type: 'section',
    required: false
  },
  {
    id: 'rad_tb_anx',
    text: 'Le patient a-t-il un trouble anxieux',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_UNKNOWN_OPTIONS
  },

  // ---------- Q1.1: PANIC ATTACKS ----------
  {
    id: 'rad_attaq_paniq',
    text: '1. Avez vous deja eu une attaque de panique pendant laquelle vous etes brusquement senti effraye ou anxieux ou pendant laquelle vous avez presente soudainement de nombreux symptomes physiques d\'anxiete?',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tb_anx' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_trouble_panique',
    text: 'Le patient presente-t-il un trouble panique?',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_attaq_paniq' }, 'Oui'] },
    indentLevel: 2
  },
  {
    id: 'chk_anxieux_trouble_panique_type',
    text: 'Trouble panique. Type du trouble panique',
    type: 'multiple_choice',
    required: false,
    options: PANIC_DISORDER_TYPE_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_trouble_panique' }, 'Oui'] },
    indentLevel: 3
  },
  {
    id: 'rad_anxieux_trouble_panique_sansagora_mois',
    text: 'Agoraphobie sans trouble panique. Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { 'in': ['Sans agoraphobie', { 'var': 'chk_anxieux_trouble_panique_type' }] },
    indentLevel: 4
  },
  {
    id: 'rad_anxieux_trouble_panique_agora_mois',
    text: 'Agoraphobie avec trouble panique. Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { 'in': ['Avec agoraphobie', { 'var': 'chk_anxieux_trouble_panique_type' }] },
    indentLevel: 4
  },

  // ---------- Q1.2: AGORAPHOBIA ----------
  {
    id: 'rad_peur_agoraphobie',
    text: '2. Avez vous deja eu peur de sortir seul de la maison, d\'etre dans une foule, d\'attendre dans une file d\'attente ou de voyager en bus/train/metro?',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tb_anx' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_agoraphobie',
    text: 'Le patient presente-t-il une agoraphobie?',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_peur_agoraphobie' }, 'Oui'] },
    indentLevel: 2
  },
  {
    id: 'rad_anxieux_agoraphobie_symptome_mois_ecoule',
    text: 'Agoraphobie sans trouble panique. Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_agoraphobie' }, 'Oui'] },
    indentLevel: 3
  },

  // ---------- Q1.3: SOCIAL PHOBIA ----------
  {
    id: 'rad_peur_sociale',
    text: '3. Y-a-t-il des choses que vous avez peur de faire devant d\'autres personnes ou qui vous mettent mal a l\'aise comme parler, manger ou ecrire?',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tb_anx' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_phobie_sociale',
    text: 'Le patient presente-t-il une phobie sociale?',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_peur_sociale' }, 'Oui'] },
    indentLevel: 2
  },
  {
    id: 'rad_anxieux_phobie_sociale_symptome_mois_ecoule',
    text: 'Phobie sociale. Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_phobie_sociale' }, 'Oui'] },
    indentLevel: 3
  },

  // ---------- Q1.4: SPECIFIC PHOBIA ----------
  {
    id: 'rad_peur_specifique',
    text: '4. Existe-t-il des choses qui vous font particulierement peur comme les voyages en avion, la vue du sang, les hauteurs, les endroits clos ou certains types d\'animaux ou d\'insectes?',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tb_anx' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_phobie_specifique',
    text: 'Le patient presente-t-il une phobie specifique?',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_peur_specifique' }, 'Oui'] },
    indentLevel: 2
  },
  {
    id: 'rad_anxieux_phobie_specfique_symptome_mois_ecoule',
    text: 'Phobie specifique. Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_phobie_specifique' }, 'Oui'] },
    indentLevel: 3
  },

  // ---------- Q1.5: OBSESSIONAL DISORDER ----------
  {
    id: 'rad_peur_obsessionnel',
    text: '5. Avez-vous deja ete gene par des pensees qui n\'avaient aucun sens et qui revenaient sans cesse alors que vous tentiez de ne pas penser? Par exemple: blesser quelqu\'un que vous ne vouliez vraiment pas blesser ou etre contamine par des germes ou de la salete?',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tb_anx' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_trouble_obsessionnel',
    text: 'Le patient presente-t-il un trouble obsessionnel?',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_peur_obsessionnel' }, 'Oui'] },
    indentLevel: 2
  },

  // ---------- Q1.6: OCD ----------
  {
    id: 'rad_peur_compulsif',
    text: '6. Existe-t-il des choses que vous devez faire encore et toujours, auxquelles vous ne pouvez pas resister comme vous laver les mains, compter jusqu\'a un certain nombre ou verifier plusieurs fois quelque chose pour etre sur que vous l\'avez bien fait?',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tb_anx' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_trouble_compulsif',
    text: 'Le patient presente-t-il un trouble obsessionnel et compulsif?',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_peur_compulsif' }, 'Oui'] },
    indentLevel: 2
  },

  // ---------- Q1.7: GENERALIZED ANXIETY ----------
  {
    id: 'rad_anxieux',
    text: '7. Dans les dix derniers mois, avez-vous ete particulierement nerveux ou anxieux?',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tb_anx' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_anxieux_generalise_titre',
    text: 'Anxiete generalisee',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_anxieux' }, 'Oui'] },
    indentLevel: 2
  },
  {
    id: 'rad_anxieux_generalise_symptome_mois_ecoule',
    text: 'Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_anxieux_generalise_titre' }, 'Oui'] },
    indentLevel: 3
  },
  {
    id: 'anxieux_affection_medicale',
    text: 'Trouble anxieux du a une affection medicale generale. Specifier l\'affection medicale generale',
    type: 'text',
    required: false,
    display_if: { '==': [{ 'var': 'rad_anxieux_generalise_titre' }, 'Oui'] },
    indentLevel: 3
  },
  {
    id: 'rad_anxieux_affection_medicale_symptome_mois_ecoule',
    text: 'Trouble anxieux du a une affection medicale generale. Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_anxieux_generalise_titre' }, 'Oui'] },
    indentLevel: 3
  },

  // ---------- Q1.8: PTSD ----------
  {
    id: 'rad_anxieux_post_trauma_titre',
    text: '8. Stress post-traumatique',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tb_anx' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_anxieux_post_trauma_symptome_mois_ecoule',
    text: 'Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_anxieux_post_trauma_titre' }, 'Oui'] },
    indentLevel: 2
  },

  // ---------- Q1.9: UNSPECIFIED ANXIETY DISORDER ----------
  {
    id: 'rad_anxieux_non_specifie_titre',
    text: '9. Trouble anxieux non specifie',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tb_anx' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_anxieux_non_specifie_symptome_mois_ecoule',
    text: 'Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_anxieux_non_specifie_titre' }, 'Oui'] },
    indentLevel: 2
  },

  // ==================== Q2: ADHD ====================
  {
    id: 'rad_diag_tdah',
    text: 'Presence de sympomes d\'un trouble deficit de l\'attention/hyperactivite (TDAH) dans l\'enfance (avant l\'age de 12 ans)',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_OPTIONS
  },

  // ==================== SECTION 3: EATING DISORDERS ====================
  {
    id: 'section_eating_disorders',
    text: 'Troubles du comportement alimentaires',
    type: 'section',
    required: false
  },
  {
    id: 'rad_tb_alim',
    text: 'Le patient a-t-il un trouble du comportement alimentaire?',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_conduites_alimentaires_symptomes_mois_ecoule',
    text: 'Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    options: TROUBLES_COMORBIDES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tb_alim' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_conduites_alimentaires_type',
    text: 'Type du trouble du comportement alimentaire',
    type: 'single_choice',
    required: false,
    options: EATING_DISORDER_TYPE_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tb_alim' }, 'Oui'] },
    indentLevel: 1
  }
];

// ============================================================================
// QUESTIONNAIRE DEFINITION
// ============================================================================

export const TROUBLES_COMORBIDES_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'troubles_comorbides_sz',
  code: 'TROUBLES_COMORBIDES_SZ',
  title: 'Troubles comorbides',
  description: 'Assessment of psychiatric comorbidities in schizophrenia patients, including mood disorders, anxiety disorders, ADHD screening, and eating disorders.',
  questions: TROUBLES_COMORBIDES_SZ_QUESTIONS
};
