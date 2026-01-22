// eFondaMental Platform - C-SSRS (Columbia Suicide Severity Rating Scale)
// Bipolar Initial Evaluation - Medical Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// QuestionnaireDefinition type (local definition for module isolation)
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

// ============================================================================
// Types
// ============================================================================

export interface BipolarCssrsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Suicidal Ideation (Questions 1-5) - stored as boolean in DB
  q1_wish_dead: boolean | null;
  q2_non_specific: boolean | null;
  q3_method_no_intent: boolean | null;
  q4_intent_no_plan: boolean | null;
  q5_plan_intent: boolean | null;
  // Intensity ratings
  int_most_severe: number | null;
  int_frequency: number | null;
  int_duration: number | null;
  int_control: number | null;
  int_deterrents: number | null;
  int_causes: number | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarCssrsResponseInsert = Omit<
  BipolarCssrsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const CSSRS_QUESTIONS: Question[] = [
  {
    id: 'section_ideation',
    text: 'Idéation Suicidaire',
    type: 'section',
    required: false
  },
  {
    id: 'cssrs_instructions',
    text: `Posez les questions 1 et 2. Si les deux réponses sont négatives, passez à la section « Comportement suicidaire ».
Si la réponse à la question 2 est « oui », posez les questions 3, 4 et 5. Si la réponse à la question 1 et/ou 2 est « oui », complétez la section « Intensité de l'idéation » ci-dessous.

Depuis la semaine dernière pour une évaluation initiale ou depuis la dernière visite lors d'un suivi : moment où il/elle s'est senti(e) le plus suicidaire :`,
    type: 'text',
    metadata: { displayOnly: true },
    required: false
  },
  {
    id: 'q1_wish_dead',
    text: `1. Désir d'être mort(e)
Le sujet souscrit à des pensées concernant le désir de mourir ou de ne plus être en vie, ou le désir de s'endormir et de ne pas se réveiller


**Avez-vous souhaité être mort(e) ou de vous endormir et de ne jamais vous réveiller ?**`,
    help: 'Si la réponse aux questions 1 et 2 est "non", passez à la fin du questionnaire.',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q2_non_specific',
    text: `2. Pensées suicidaires actives non spécifiques
Pensées d'ordre général non spécifiques autour de la volonté de mettre fin à ses jours/ se suicider (par ex « j'ai pensé à me suicider »), non associées à des pensées sur les manières permettant de se suicider/méthodes associées, ni à une intention ou à un scénario, au cours de la période d'évaluation.


**Avez-vous réellement pensé à vous suicider ?** `,
    help: 'Si la réponse est "oui", posez les questions 3, 4 et 5.',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q3_method_no_intent',
    text: `3. Idéation suicidaire active avec la définition des méthodes (sans scénario), sans intention de passage à l'acte :
Le sujet pense au suicide et a envisagé au moins une méthode pour y parvenir au cours de la période d'évaluation. Il ne s'agit pas ici de l'élaboration d'un scénario spécifique comprenant le moment, le lieu ou la méthode (par ex. le sujet a pensé à une méthode pour se suicider mais ne dispose pas d'un scénario précis) Il s'agit par exemple d'une personne déclarant « J'ai pensé à avaler des médicaments, mais je n'ai pas de scénario précis sur le moment, le lieu ou la manière dont je le ferais…et je n'irai jamais jusque là ».


**Avez-vous pensé à la manière dont vous vous y prendriez ?**`,
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'q2_non_specific' }, 1] },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q4_intent_no_plan',
    text: `4. Idéation suicidaire active avec intention de passage à l'acte, sans scénario précis
Pensées suicidaires actives, le sujet exprime une intention plus ou moins forte de passer à l'acte et ne se contente pas de déclarer « J'ai des pensées suicidaires, mais je ne ferai jamais rien pour les mettre en œuvre ».


**Avez-vous eu des pensées de ce genre et l'intention de passer à l'acte ?**`,
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'q2_non_specific' }, 1] },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q5_plan_intent',
    text: `5. Idéation suicidaire active avec scénario précis et intention de passser à l'acte
Pensées suicidaires associées à l'élaboration complète ou partielle d'un scénario détaillé ; le sujet exprime une intention plus ou moins forte de mettre ce scénario à exécution


**Avez-vous commencé ou fini d'élaborer un scénario détaillé sur la manière dont vous voulez vous suicider ? Avez-vous l'intention de mettre ce scénario à exécution ?**`,
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'q2_non_specific' }, 1] },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  
  // Intensity of Ideation
  {
    id: 'section_intensity',
    text: 'Intensité de l\'idéation',
    type: 'section',
    required: false,
    display_if: {
      or: [
        { '==': [{ var: 'q1_wish_dead' }, 1] },
        { '==': [{ var: 'q2_non_specific' }, 1] }
      ]
    }
  },
  {
    id: 'int_most_severe',
    text: 'Idéation la plus grave (1 à 5) : Indiquez le numéro du type d\'idéation le plus grave',
    help: 'Ne compléter que si Q1 et/ou Q2 est "oui".',
    type: 'single_choice',
    required: false,
    display_if: {
      or: [
        { '==': [{ var: 'q1_wish_dead' }, 1] },
        { '==': [{ var: 'q2_non_specific' }, 1] }
      ]
    },
    options: [
      { code: 1, label: 'Type 1 (Désir d\'être mort)', score: 1 },
      { code: 2, label: 'Type 2 (Pensées non spécifiques)', score: 2 },
      { code: 3, label: 'Type 3 (Méthodes sans intention)', score: 3 },
      { code: 4, label: 'Type 4 (Intention sans scénario)', score: 4 },
      { code: 5, label: 'Type 5 (Scénario et intention)', score: 5 }
    ]
  },
  {
    id: 'int_frequency',
    text: 'Fréquence : Combien de fois avez-vous eu ces pensées ?',
    type: 'single_choice',
    required: false,
    display_if: {
      or: [
        { '==': [{ var: 'q1_wish_dead' }, 1] },
        { '==': [{ var: 'q2_non_specific' }, 1] }
      ]
    },
    options: [
      { code: 1, label: '1 - Moins d\'une fois par semaine', score: 1 },
      { code: 2, label: '2 - Une fois par semaine', score: 2 },
      { code: 3, label: '3 - 2 à 5 fois par semaine', score: 3 },
      { code: 4, label: '4 - Tous les jours ou presque', score: 4 },
      { code: 5, label: '5 - Plusieurs fois par jour', score: 5 }
    ]
  },
  {
    id: 'int_duration',
    text: 'Durée : Lorsque vous avez ces pensées, combien de temps durent-elles ?',
    type: 'single_choice',
    required: false,
    display_if: {
      or: [
        { '==': [{ var: 'q1_wish_dead' }, 1] },
        { '==': [{ var: 'q2_non_specific' }, 1] }
      ]
    },
    options: [
      { code: 1, label: '1 - Quelques instants (quelques secondes ou quelques minutes)', score: 1 },
      { code: 2, label: '2 - Moins d\'une heure/un certain temps', score: 2 },
      { code: 3, label: '3 - 1 à 4h/longtemps', score: 3 },
      { code: 4, label: '4 - 4 à 8h/une grande partie de la journée', score: 4 },
      { code: 5, label: '5 - Plus de 8h/en permanence ou tout le temps', score: 5 }
    ]
  },
  {
    id: 'int_control',
    text: 'Maîtrise des pensées suicidaires : Pourriez-vous/pouvez-vous arrêter de penser au suicide ou à votre envie de mourir si vous le voul(i)ez ?',
    type: 'single_choice',
    required: false,
    display_if: {
      or: [
        { '==': [{ var: 'q1_wish_dead' }, 1] },
        { '==': [{ var: 'q2_non_specific' }, 1] }
      ]
    },
    options: [
      { code: 1, label: '1 - Maîtrise facilement ses pensées', score: 1 },
      { code: 2, label: '2 - Capable de maîtriser ses pensées avec de légères difficultés', score: 2 },
      { code: 3, label: '3 - Capable de maîtriser ses pensées avec quelques difficultés', score: 3 },
      { code: 4, label: '4 - Capable de maîtriser ses pensées avec de grandes difficultés', score: 4 },
      { code: 5, label: '5 - Incapable de maîtriser ses pensées', score: 5 },
      { code: 0, label: '0 - N\'essaie pas de maîtriser ses pensées', score: 0 }
    ]
  },
  {
    id: 'int_deterrents',
    text: 'Éléments dissuasifs : Y a-t-il quelque chose ou quelqu\'un qui vous a dissuadé de vouloir mourir ou de mettre à exécution vos pensées suicidaires ?',
    type: 'single_choice',
    required: false,
    display_if: {
      or: [
        { '==': [{ var: 'q1_wish_dead' }, 1] },
        { '==': [{ var: 'q2_non_specific' }, 1] }
      ]
    },
    options: [
      { code: 1, label: '1 - Des éléments dissuasifs vous ont véritablement empêché(e) de tenter de vous suicider', score: 1 },
      { code: 2, label: '2 - Des éléments dissuasifs vous ont probablement arrêté(e)', score: 2 },
      { code: 3, label: '3 - Vous ne savez pas si des éléments dissuasifs vous ont arrêté(e)', score: 3 },
      { code: 4, label: '4 - Vous n\'avez très probablement été arrêté(e) par aucun élément dissuasif', score: 4 },
      { code: 5, label: '5 - Les éléments dissuasifs ne vous ont pas du tout arrêté(e)', score: 5 }
    ]
  },
  {
    id: 'int_causes',
    text: 'Causes de l\'idéation : Quelles sont les raisons pour lesquelles vous avez souhaité mourir ou vous suicider ?',
    type: 'single_choice',
    required: false,
    display_if: {
      or: [
        { '==': [{ var: 'q1_wish_dead' }, 1] },
        { '==': [{ var: 'q2_non_specific' }, 1] }
      ]
    },
    options: [
      { code: 0, label: '0 - Sans objet', score: 0 },
      { code: 1, label: '1 - Uniquement pour attirer l\'attention, vous venger ou faire réagir les autres', score: 1 },
      { code: 2, label: '2 - Principalement pour attirer l\'attention, vous venger ou faire réagir les autres', score: 2 },
      { code: 3, label: '3 - Autant pour attirer l\'attention... que pour faire cesser la douleur', score: 3 },
      { code: 4, label: '4 - Principalement pour faire cesser la douleur', score: 4 },
      { code: 5, label: '5 - Uniquement pour faire cesser la douleur', score: 5 }
    ]
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const CSSRS_DEFINITION: QuestionnaireDefinition = {
  id: 'cssrs',
  code: 'CSSRS',
  title: 'C-SSRS - Échelle d\'évaluation de Colombia sur la gravité du risque suicidaire',
  description: 'Évaluation standardisée de l\'idéation et du comportement suicidaire (depuis la semaine dernière).',
  questions: CSSRS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
