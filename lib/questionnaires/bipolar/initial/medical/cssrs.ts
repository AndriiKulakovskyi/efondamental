// eFondaMental Platform - C-SSRS (Columbia Suicide Severity Rating Scale)
// Bipolar Initial Evaluation - Medical Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarCssrsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Suicidal Ideation
  wish_to_be_dead: string | null;
  active_suicidal_thoughts: string | null;
  suicidal_thoughts_with_method: string | null;
  suicidal_intent_without_plan: string | null;
  suicidal_intent_with_plan: string | null;
  // Suicidal Behavior
  preparatory_acts: string | null;
  aborted_attempt: string | null;
  interrupted_attempt: string | null;
  actual_attempt: string | null;
  completed_suicide: string | null;
  // Additional details
  ideation_intensity: number | null;
  behavior_lethality: number | null;
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
  // Section: Suicidal Ideation
  {
    id: 'section_ideation',
    text: 'Ideation Suicidaire',
    type: 'section',
    required: false
  },
  {
    id: 'wish_to_be_dead',
    text: '1. Souhait d\'etre mort(e): Avez-vous souhaite etre mort(e) ou pouvoir vous endormir et ne jamais vous reveiller?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'active_suicidal_thoughts',
    text: '2. Pensees suicidaires actives non specifiques: Avez-vous eu des pensees de vous suicider?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'suicidal_thoughts_with_method',
    text: '3. Ideation suicidaire active avec methode (sans plan specifique): Avez-vous pense a comment vous pourriez vous suicider?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'suicidal_intent_without_plan',
    text: '4. Ideation suicidaire active avec intention, sans plan specifique: Avez-vous eu l\'intention de passer a l\'acte?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'suicidal_intent_with_plan',
    text: '5. Ideation suicidaire active avec plan et intention specifiques: Avez-vous commence a preparer ou avez-vous etabli un plan specifique pour vous suicider et avez-vous l\'intention de le realiser?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'ideation_intensity',
    text: 'Intensite de l\'ideation suicidaire (0-5)',
    type: 'number',
    required: false,
    min: 0,
    max: 5,
    help: '0 = Aucune ideation, 5 = Ideation tres intense'
  },

  // Section: Suicidal Behavior
  {
    id: 'section_behavior',
    text: 'Comportement Suicidaire',
    type: 'section',
    required: false
  },
  {
    id: 'preparatory_acts',
    text: 'Actes preparatoires: Le sujet a-t-il pris des mesures pour preparer une tentative de suicide?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'aborted_attempt',
    text: 'Tentative avortee: Le sujet a-t-il commence a faire quelque chose pour mettre fin a ses jours mais s\'est arrete avant d\'avoir accompli un geste auto-agressif?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'interrupted_attempt',
    text: 'Tentative interrompue: Le sujet a-t-il ete interrompu par une circonstance exterieure avant d\'avoir accompli un geste auto-agressif?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'actual_attempt',
    text: 'Tentative reelle: Le sujet a-t-il fait quelque chose pour essayer de mettre fin a ses jours?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'behavior_lethality',
    text: 'Letalite du comportement (0-5)',
    type: 'number',
    required: false,
    min: 0,
    max: 5,
    help: '0 = Pas de blessure physique, 5 = Mort'
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

export const CSSRS_DEFINITION: QuestionnaireDefinition = {
  id: 'cssrs',
  code: 'CSSRS',
  title: 'C-SSRS (Columbia Suicide Severity Rating Scale)',
  description: 'Echelle d\'evaluation de la severite du risque suicidaire de Columbia.',
  questions: CSSRS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
