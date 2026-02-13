// eFondaMental Platform - Suicide History (Schizophrenia)
// Assessment of suicide history and attempts

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaSuicideHistoryResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1_first_attempt_date?: string | null;
  q2_attempt_count?: number | null;
  q3_attempt_count_12m?: number | null;
  q4_violent_attempts?: 'oui' | 'non' | 'ne_sais_pas' | null;
  q4_1_violent_count?: number | null;
  q5_serious_attempts?: 'oui' | 'non' | 'ne_sais_pas' | null;
  q5_1_serious_count?: number | null;
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaSuicideHistoryResponseInsert = Omit<
  SchizophreniaSuicideHistoryResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Questions
// ============================================================================

export const SUICIDE_HISTORY_SZ_QUESTIONS: Question[] = [
  {
    id: 'q1_first_attempt_date',
    text: 'Date de la première tentative de suicide',
    type: 'date',
    required: false
  },
  {
    id: 'q2_attempt_count',
    text: 'Combien de fois avez-vous tenté de vous suicider ?',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'q3_attempt_count_12m',
    text: 'Combien de fois avez-vous tenté de vous suicider au cours des 12 derniers mois ?',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'q4_violent_attempts',
    text: '1. Existe-t-il des TS violentes (arme a feu, immolation, noyade, saut, pendaison, autre) ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui', score: 1 },
      { code: 'non', label: 'Non', score: 0 },
      { code: 'ne_sais_pas', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q4_1_violent_count',
    text: 'Nombre de tentatives de suicide violentes',
    type: 'number',
    required: false,
    min: 0,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q4_violent_attempts' }, 'oui'] }
  },
  {
    id: 'q5_serious_attempts',
    text: '2. Existe-t-il des tentatives de suicide graves (passage en réanimation) non violentes (médicamenteuses, phlébotomie) ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui', score: 1 },
      { code: 'non', label: 'Non', score: 0 },
      { code: 'ne_sais_pas', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q5_1_serious_count',
    text: 'Nombre de tentatives de suicide graves',
    type: 'number',
    required: false,
    min: 0,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q5_serious_attempts' }, 'oui'] }
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

export const SUICIDE_HISTORY_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'suicide_history_sz',
  code: 'SUICIDE_HISTORY_SZ',
  title: 'Histoire des conduites suicidaires',
  description: 'Evaluation de l\'historique des tentatives de suicide: date de premiere tentative, nombre total, nombre dans les 12 derniers mois, et types de tentatives (violentes ou graves).',
  questions: SUICIDE_HISTORY_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional'
  }
};
