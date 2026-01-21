// eFondaMental Platform - Schizophrenia Screening Orientation (SCREENING_ORIENTATION_SZ)
// Eligibility verification for Centre Expert evaluation

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaScreeningOrientationResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Q1: Patient souffrant d'un trouble evocateur d'une schizophrenie
  rad_screening_orientation_sz?: 'oui' | 'non' | null;
  
  // Q2: Etat psychique compatible avec l'evaluation
  rad_screening_orientation_psychique?: 'oui' | 'non' | null;
  
  // Q3: Prise en charge a 100% ou accord du patient pour assumer les frais
  rad_screening_orientation_priseencharge?: 'oui' | 'non' | null;
  
  // Q4: Accord du patient pour une evaluation dans le cadre du centre expert
  rad_screening_orientation_accord_patient?: 'oui' | 'non' | null;
  
  // Computed eligibility result (all must be 'oui')
  eligibility_result?: boolean | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaScreeningOrientationResponseInsert = Omit<
  SchizophreniaScreeningOrientationResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'eligibility_result'
>;

// ============================================================================
// Questions
// ============================================================================

export const SZ_ORIENTATION_QUESTIONS: Question[] = [
  // Q1: Patient souffrant d'un trouble evocateur d'une schizophrenie
  {
    id: 'rad_screening_orientation_sz',
    text: "Patient souffrant d'un trouble evocateur d'une schizophrenie",
    type: 'single_choice',
    required: true,
    section: 'orientation',
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // Q2: Etat psychique compatible avec l'evaluation
  {
    id: 'rad_screening_orientation_psychique',
    text: "Etat psychique compatible avec l'evaluation",
    type: 'single_choice',
    required: true,
    section: 'orientation',
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // Q3: Prise en charge a 100% ou accord du patient pour assumer les frais
  {
    id: 'rad_screening_orientation_priseencharge',
    text: 'Prise en charge a 100% ou accord du patient pour assumer les frais',
    type: 'single_choice',
    required: true,
    section: 'orientation',
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // Q4: Accord du patient pour une evaluation dans le cadre du centre expert
  {
    id: 'rad_screening_orientation_accord_patient',
    text: 'Accord du patient pour une evaluation dans le cadre du centre expert',
    type: 'single_choice',
    required: true,
    section: 'orientation',
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

export const SZ_ORIENTATION_DEFINITION: QuestionnaireDefinition = {
  id: 'sz_orientation',
  code: 'SCREENING_ORIENTATION_SZ',
  title: 'Orientation Centre Expert',
  description: "Questionnaire de verification des criteres d'eligibilite pour l'evaluation en Centre Expert - verifie que le patient remplit les conditions necessaires",
  questions: SZ_ORIENTATION_QUESTIONS,
  metadata: {
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Eligibility Calculation
// ============================================================================

/**
 * Calculate eligibility for Centre Expert evaluation.
 * Patient is eligible if all 4 criteria are 'oui'.
 */
export function calculateEligibility(
  response: Partial<SchizophreniaScreeningOrientationResponse>
): boolean {
  return (
    response.rad_screening_orientation_sz === 'oui' &&
    response.rad_screening_orientation_psychique === 'oui' &&
    response.rad_screening_orientation_priseencharge === 'oui' &&
    response.rad_screening_orientation_accord_patient === 'oui'
  );
}
