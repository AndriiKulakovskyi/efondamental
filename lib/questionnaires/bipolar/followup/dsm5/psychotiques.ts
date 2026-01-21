// eFondaMental Platform - DSM5 Semestrial: Psychotic Disorders (Troubles psychotiques)
// Bipolar Followup Evaluation - DSM5 Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarFollowupPsychotiquesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  rad_tb_psychos: string | null;
  date_tb_psychos_date: string | null;
  rad_tb_psychos_type: string | null;
  rad_tb_psychos_lastmonth: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarFollowupPsychotiquesResponseInsert = Omit<
  BipolarFollowupPsychotiquesResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const PSYCHOTIQUES_QUESTIONS: Question[] = [
  {
    id: 'rad_tb_psychos',
    text: 'Le patient a-t-il un trouble psychotique',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'date_tb_psychos_date',
    text: 'Date de survenue du trouble psychotique',
    type: 'date',
    required: false,
    display_if: { '==': [{ var: 'rad_tb_psychos' }, 'Oui'] },
    metadata: { default: 'today' }
  },
  {
    id: 'rad_tb_psychos_type',
    text: 'Type de trouble',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_tb_psychos' }, 'Oui'] },
    options: [
      { code: 'Schizophrenie', label: 'Schizophrenie' },
      { code: 'Trouble schizophreniforme', label: 'Trouble schizophreniforme' },
      { code: 'Trouble schizo-affectif', label: 'Trouble schizo-affectif' },
      { code: 'Troubles delirants', label: 'Troubles delirants' },
      { code: 'Trouble psychotique bref', label: 'Trouble psychotique bref' },
      { code: 'Trouble psychotique partage', label: 'Trouble psychotique partage' },
      { code: 'Trouble psychotique induit par une affection medicale generale', label: 'Trouble psychotique induit par une affection medicale generale' },
      { code: 'Trouble psychotique induit par une substance', label: 'Trouble psychotique induit par une substance' },
      { code: 'Trouble psychotique non specifie', label: 'Trouble psychotique non specifie' }
    ]
  },
  {
    id: 'rad_tb_psychos_lastmonth',
    text: 'Presence de symptomes le mois ecoule',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_tb_psychos' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const PSYCHOTIQUES_DEFINITION = {
  id: 'psychotiques',
  code: 'PSYCHOTIQUES',
  title: 'Troubles psychotiques',
  description: 'Evaluation des troubles psychotiques pour le suivi semestriel du trouble bipolaire',
  questions: PSYCHOTIQUES_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Interpretation Functions
// ============================================================================

export interface PsychotiquesInterpretationInput {
  rad_tb_psychos: string | null;
  rad_tb_psychos_type: string | null;
  rad_tb_psychos_lastmonth: string | null;
}

export type PsychoticStatus = 'no_disorder' | 'has_disorder' | 'unknown';
export type RecentSymptoms = 'present' | 'absent' | 'unknown' | null;

export function getPsychoticStatus(responses: PsychotiquesInterpretationInput): PsychoticStatus {
  if (responses.rad_tb_psychos === 'Non') return 'no_disorder';
  if (responses.rad_tb_psychos === 'Oui') return 'has_disorder';
  return 'unknown';
}

export function getRecentSymptoms(responses: PsychotiquesInterpretationInput): RecentSymptoms {
  if (responses.rad_tb_psychos !== 'Oui') return null;
  if (responses.rad_tb_psychos_lastmonth === 'Oui') return 'present';
  if (responses.rad_tb_psychos_lastmonth === 'Non') return 'absent';
  return 'unknown';
}

export function interpretPsychotiques(responses: PsychotiquesInterpretationInput): string {
  const status = getPsychoticStatus(responses);
  
  if (status === 'no_disorder') {
    return 'Pas de trouble psychotique identifie.';
  }
  
  if (status === 'unknown') {
    return 'Presence de trouble psychotique non determinee.';
  }
  
  let interpretation = 'Trouble psychotique present';
  
  if (responses.rad_tb_psychos_type) {
    interpretation += `: ${responses.rad_tb_psychos_type}`;
  }
  
  const recentSymptoms = getRecentSymptoms(responses);
  if (recentSymptoms === 'present') {
    interpretation += '. Symptomes actifs le mois dernier.';
  } else if (recentSymptoms === 'absent') {
    interpretation += '. Pas de symptomes le mois dernier.';
  } else {
    interpretation += '.';
  }
  
  return interpretation;
}

// ============================================================================
// Combined Analysis Function
// ============================================================================

export interface PsychotiquesAnalysisResult {
  psychotic_status: PsychoticStatus;
  disorder_type: string | null;
  recent_symptoms: RecentSymptoms;
  interpretation: string;
}

export function analyzePsychotiques(responses: PsychotiquesInterpretationInput): PsychotiquesAnalysisResult {
  return {
    psychotic_status: getPsychoticStatus(responses),
    disorder_type: responses.rad_tb_psychos_type,
    recent_symptoms: getRecentSymptoms(responses),
    interpretation: interpretPsychotiques(responses)
  };
}
