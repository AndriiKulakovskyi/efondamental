// eFondaMental Platform - Orientation Centre Expert (EBIP_SCR_ORIENT)
// Bipolar Screening - Medical questionnaire

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarOrientationResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  trouble_bipolaire_ou_suspicion: 'oui' | 'non';
  etat_thymique_compatible: 'oui' | 'non';
  prise_en_charge_100_ou_accord: 'oui' | 'non';
  accord_evaluation_centre_expert: 'oui' | 'non';
  accord_transmission_cr: 'oui' | 'non';
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarOrientationResponseInsert = Omit<
  BipolarOrientationResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const ORIENTATION_QUESTIONS: Question[] = [
  {
    id: 'trouble_bipolaire_ou_suspicion',
    text: "Patient souffrant d'un trouble bipolaire ou suspicion de trouble bipolaire",
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'etat_thymique_compatible',
    text: "Etat thymique compatible avec l'evaluation",
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'prise_en_charge_100_ou_accord',
    text: "Prise en charge a 100% ou accord du patient pour assumer les frais",
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'accord_evaluation_centre_expert',
    text: "Accord du patient pour une evaluation dans le cadre du centre expert",
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'accord_transmission_cr',
    text: "Accord du patient pour une transmission du CR a son psychiatre referent",
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
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

export const ORIENTATION_DEFINITION: QuestionnaireDefinition = {
  id: 'bipolar_orientation',
  code: 'EBIP_SCR_ORIENT',
  title: 'Orientation Centre Expert',
  description: "Criteres d'orientation vers un centre expert pour trouble bipolaire",
  questions: ORIENTATION_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// Legacy alias for backwards compatibility
export const BIPOLAR_ORIENTATION_DEFINITION = ORIENTATION_DEFINITION;
export const BIPOLAR_ORIENTATION_QUESTIONS = ORIENTATION_QUESTIONS;

// ============================================================================
// Eligibility Check
// ============================================================================

export interface OrientationEligibilityInput {
  trouble_bipolaire_ou_suspicion: 'oui' | 'non';
  etat_thymique_compatible: 'oui' | 'non';
  prise_en_charge_100_ou_accord: 'oui' | 'non';
  accord_evaluation_centre_expert: 'oui' | 'non';
  accord_transmission_cr: 'oui' | 'non';
}

/**
 * Check if patient is eligible for expert center evaluation
 * All criteria must be "oui" for eligibility
 */
export function isEligibleForExpertCenter(responses: OrientationEligibilityInput): boolean {
  return (
    responses.trouble_bipolaire_ou_suspicion === 'oui' &&
    responses.etat_thymique_compatible === 'oui' &&
    responses.prise_en_charge_100_ou_accord === 'oui' &&
    responses.accord_evaluation_centre_expert === 'oui' &&
    responses.accord_transmission_cr === 'oui'
  );
}

export interface OrientationEligibilityResult {
  is_eligible: boolean;
  missing_criteria: string[];
}

export function checkOrientationEligibility(responses: OrientationEligibilityInput): OrientationEligibilityResult {
  const missing_criteria: string[] = [];

  if (responses.trouble_bipolaire_ou_suspicion !== 'oui') {
    missing_criteria.push('Trouble bipolaire ou suspicion');
  }
  if (responses.etat_thymique_compatible !== 'oui') {
    missing_criteria.push('Etat thymique compatible');
  }
  if (responses.prise_en_charge_100_ou_accord !== 'oui') {
    missing_criteria.push('Prise en charge 100% ou accord');
  }
  if (responses.accord_evaluation_centre_expert !== 'oui') {
    missing_criteria.push('Accord evaluation centre expert');
  }
  if (responses.accord_transmission_cr !== 'oui') {
    missing_criteria.push('Accord transmission CR');
  }

  return {
    is_eligible: missing_criteria.length === 0,
    missing_criteria
  };
}
