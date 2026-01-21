// eFondaMental Platform - Somatique et Contraceptif
// Bipolar Followup Evaluation - Soin Suivi Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarFollowupSomatiqueContraceptifResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  fckedit_somatique_contraceptif: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarFollowupSomatiqueContraceptifResponseInsert = Omit<
  BipolarFollowupSomatiqueContraceptifResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const SOMATIQUE_CONTRACEPTIF_QUESTIONS: Question[] = [
  {
    id: 'fckedit_somatique_contraceptif',
    text: 'Lister le nom des traitements somatiques au cours de la vie entiere et les contraceptifs ainsi que la date de debut et nombre cumule de mois d\'exposition',
    type: 'text',
    required: false,
    help: 'Entrez les informations de maniere structuree: nom du traitement, date de debut, duree d\'exposition en mois'
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const SOMATIQUE_CONTRACEPTIF_DEFINITION = {
  id: 'somatique_contraceptif',
  code: 'SOMATIQUE_ET_CONTRACEPTIF',
  title: 'Somatique et contraceptif',
  description: 'Documentation des traitements somatiques et contraceptifs',
  questions: SOMATIQUE_CONTRACEPTIF_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Analysis Functions
// ============================================================================

export interface SomatiqueContraceptifInput {
  fckedit_somatique_contraceptif: string | null;
}

export function hasDocumentation(responses: SomatiqueContraceptifInput): boolean {
  return !!responses.fckedit_somatique_contraceptif && 
         responses.fckedit_somatique_contraceptif.trim().length > 0;
}

export function interpretSomatiqueContraceptif(responses: SomatiqueContraceptifInput): string {
  if (!hasDocumentation(responses)) {
    return 'Aucune documentation des traitements somatiques/contraceptifs.';
  }
  
  return 'Traitements somatiques et contraceptifs documentes.';
}

// ============================================================================
// Combined Analysis Function
// ============================================================================

export interface SomatiqueContraceptifAnalysisResult {
  has_documentation: boolean;
  documentation_text: string | null;
  interpretation: string;
}

export function analyzeSomatiqueContraceptif(
  responses: SomatiqueContraceptifInput
): SomatiqueContraceptifAnalysisResult {
  return {
    has_documentation: hasDocumentation(responses),
    documentation_text: responses.fckedit_somatique_contraceptif,
    interpretation: interpretSomatiqueContraceptif(responses)
  };
}
