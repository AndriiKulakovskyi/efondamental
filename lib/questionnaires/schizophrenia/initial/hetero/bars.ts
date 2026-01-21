// eFondaMental Platform - BARS (Brief Adherence Rating Scale)
// 3-item clinician-administered scale for assessing medication adherence
// Original authors: Byerly MJ, Nakonezny PA, Rush AJ (2008)

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaBarsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1?: number | null; // Prescribed doses per day
  q2?: number | null; // Days without treatment
  q3?: number | null; // Days with reduced dose
  adherence_percentage?: number | null;
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaBarsResponseInsert = Omit<
  SchizophreniaBarsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'adherence_percentage'
>;

// ============================================================================
// Questions
// ============================================================================

export const BARS_QUESTIONS: Question[] = [
  {
    id: 'bars_instructions',
    text: 'Instructions',
    help: 'Administrer les trois questions au patient concernant sa prise de traitement au cours du mois dernier (30 derniers jours).',
    type: 'instruction',
    required: false
  },
  {
    id: 'q1',
    text: '1. Nombre de doses prescrites par jour',
    help: 'Quel est le nombre de doses prescrites par jour (connaissance qu\'en a le patient)',
    type: 'number',
    required: false
  },
  {
    id: 'q2',
    text: '2. Jours sans traitement',
    help: 'Nombre de jours le mois dernier pendant lesquels il n\'a pas pris le traitement prescrit',
    type: 'number',
    required: false
  },
  {
    id: 'q3',
    text: '3. Jours avec dose reduite',
    help: 'Nombre de jours le mois dernier pendant lesquels le patient a pris moins que la dose de traitement prescrite',
    type: 'number',
    required: false
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

export const BARS_DEFINITION: QuestionnaireDefinition = {
  id: 'bars',
  code: 'BARS',
  title: 'BARS - Echelle breve d\'evaluation de l\'observance',
  description: 'Echelle a 3 items administree par le clinicien pour evaluer l\'observance medicamenteuse. Elle estime le pourcentage de doses prescrites prises au cours du mois dernier. Auteurs originaux: Byerly MJ, Nakonezny PA, Rush AJ (2008).',
  questions: BARS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'Original (Byerly et al., 2008)',
    language: 'fr-FR'
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Calculate adherence percentage from BARS responses
 * Formula: ((30 - days_missed - days_reduced) / 30) x 100
 */
export function computeBarsAdherence(
  daysMissed: number | null | undefined,
  daysReduced: number | null | undefined
): number | null {
  if (daysMissed === null || daysMissed === undefined) return null;
  const missed = daysMissed || 0;
  const reduced = daysReduced || 0;
  return Math.round(((30 - missed - reduced) / 30) * 100);
}

export function interpretBarsAdherence(percentage: number): string {
  if (percentage >= 80) return 'Good adherence';
  if (percentage >= 50) return 'Partial adherence';
  return 'Poor adherence';
}
