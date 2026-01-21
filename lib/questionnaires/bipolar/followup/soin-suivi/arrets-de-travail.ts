// eFondaMental Platform - Arrets de Travail
// Bipolar Followup Evaluation - Soin Suivi Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarFollowupArretsTravailResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  rad_arret_travail: string | null;
  arret_travail_nb: number | null;
  arret_travail_duree: number | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarFollowupArretsTravailResponseInsert = Omit<
  BipolarFollowupArretsTravailResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const ARRETS_DE_TRAVAIL_QUESTIONS: Question[] = [
  {
    id: 'rad_arret_travail',
    text: 'Etes-vous ou avez-vous ete en arret de travail depuis la derniere visite en lien avec un trouble psychiatrique ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Non applicable', label: 'Non applicable' }
    ]
  },
  {
    id: 'arret_travail_nb',
    text: 'Nombre d\'arrets de travail',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_arret_travail' }, 'Oui'] }
  },
  {
    id: 'arret_travail_duree',
    text: 'Duree totale des arrets de travail (en semaines)',
    type: 'number',
    required: false,
    min: 0,
    max: 52,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_arret_travail' }, 'Oui'] }
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const ARRETS_DE_TRAVAIL_DEFINITION = {
  id: 'arrets_de_travail',
  code: 'ARRETS_DE_TRAVAIL',
  title: 'Arrets de travail',
  description: 'Documentation des arrets de travail lies aux troubles psychiatriques depuis la derniere visite',
  questions: ARRETS_DE_TRAVAIL_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Analysis Functions
// ============================================================================

export interface ArretsTravailInput {
  rad_arret_travail: string | null;
  arret_travail_nb: number | null;
  arret_travail_duree: number | null;
}

export type WorkStopStatus = 'yes' | 'no' | 'not_applicable' | 'unknown';

export function getWorkStopStatus(responses: ArretsTravailInput): WorkStopStatus {
  switch (responses.rad_arret_travail) {
    case 'Oui':
      return 'yes';
    case 'Non':
      return 'no';
    case 'Non applicable':
      return 'not_applicable';
    default:
      return 'unknown';
  }
}

export function interpretArretsTravail(responses: ArretsTravailInput): string {
  const status = getWorkStopStatus(responses);
  
  if (status === 'no') {
    return 'Pas d\'arret de travail depuis la derniere visite.';
  }
  
  if (status === 'not_applicable') {
    return 'Non applicable (patient sans activite professionnelle).';
  }
  
  if (status === 'unknown') {
    return 'Arrets de travail non renseignes.';
  }
  
  const count = responses.arret_travail_nb ?? 0;
  const duration = responses.arret_travail_duree ?? 0;
  
  return `${count} arret(s) de travail, duree totale: ${duration} semaine(s).`;
}

// ============================================================================
// Combined Analysis Function
// ============================================================================

export interface ArretsTravailAnalysisResult {
  work_stop_status: WorkStopStatus;
  stop_count: number;
  total_duration_weeks: number;
  interpretation: string;
}

export function analyzeArretsTravail(responses: ArretsTravailInput): ArretsTravailAnalysisResult {
  return {
    work_stop_status: getWorkStopStatus(responses),
    stop_count: responses.arret_travail_nb ?? 0,
    total_duration_weeks: responses.arret_travail_duree ?? 0,
    interpretation: interpretArretsTravail(responses)
  };
}
