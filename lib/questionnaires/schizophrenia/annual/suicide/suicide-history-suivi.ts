// eFondaMental Platform - Suicide History Suivi (Histoire des conduites suicidaires - Suivi) - Schizophrenia Annual
// Assessment of suicide attempt history since last visit

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaSuicideHistorySuiviResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1_attempt_count?: number | null;
  q2_violent_attempts?: 'oui' | 'non' | 'ne_sais_pas' | null;
  q2_1_violent_count?: number | null;
  q3_serious_attempts?: 'oui' | 'non' | 'ne_sais_pas' | null;
  q3_1_serious_count?: number | null;
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaSuicideHistorySuiviResponseInsert = Omit<
  SchizophreniaSuicideHistorySuiviResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Questions
// ============================================================================

export const SUICIDE_HISTORY_SUIVI_SZ_QUESTIONS: Question[] = [
  {
    id: 'q1_attempt_count',
    text: 'Combien de fois avez-vous tenté de vous suicider depuis la dernière visite ?',
    type: 'number',
    required: false,
    min: 0,
  },
  {
    id: 'q2_violent_attempts',
    text: '1. Existe-t-il des TS violentes (arme à feu, immolation, noyade, saut, pendaison, autre) ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui', score: 1 },
      { code: 'non', label: 'Non', score: 0 },
      { code: 'ne_sais_pas', label: 'Ne sais pas', score: 0 },
    ],
  },
  {
    id: 'q2_1_violent_count',
    text: 'Nombre de tentatives de suicide violentes depuis la dernière visite',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'q2_violent_attempts' }, 'oui'] },
  },
  {
    id: 'q3_serious_attempts',
    text: '2. Existe-t-il des tentatives de suicide graves (passage en réanimation) non violentes (médicamenteuses, phlébotomie) ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui', score: 1 },
      { code: 'non', label: 'Non', score: 0 },
      { code: 'ne_sais_pas', label: 'Ne sais pas', score: 0 },
    ],
  },
  {
    id: 'q3_1_serious_count',
    text: 'Nombre de tentatives de suicide graves depuis la dernière visite',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ var: 'q3_serious_attempts' }, 'oui'] },
  },
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

export const SUICIDE_HISTORY_SUIVI_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'suicide_history_suivi_sz',
  code: 'SUICIDE_HISTORY_SUIVI_SZ',
  title: 'Histoire des conduites suicidaires (suivi)',
  description: 'Évaluation des tentatives de suicide survenues depuis la dernière visite: nombre total, tentatives violentes et tentatives graves.',
  questions: SUICIDE_HISTORY_SUIVI_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
  },
};
