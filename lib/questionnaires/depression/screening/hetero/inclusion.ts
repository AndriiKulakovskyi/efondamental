// eFondaMental Platform - Critères d'inclusion et de non-inclusion
// Depression Screening - Hetero-questionnaire (Inclusion module)

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface DepressionInclusionResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  madrs_score: number;
  epi_depress_caract: number;
  niv_2_thase_rush: number;
  trou_bipol: number;
  trou_compul: number;
  trou_alim: number;
  pat_eligible: number | null;
  total_score: number | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type DepressionInclusionResponseInsert = Omit<
  DepressionInclusionResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'interpretation' | 'pat_eligible'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

const OUI_NON = [
  { code: 1, label: 'Oui', score: 1 },
  { code: 0, label: 'Non', score: 0 }
];

export const DEPRESSION_INCLUSION_QUESTIONS: Question[] = [
  { id: 'section_inclusion', text: "Critères d'inclusion", type: 'section', required: false },

  {
    id: 'madrs_score',
    text: 'Score MADRS > 20',
    type: 'single_choice',
    required: true,
    options: OUI_NON,
    help: "Auto-rempli depuis le questionnaire MADRS de cette visite. Modifiable par le clinicien."
  },
  {
    id: 'epi_depress_caract',
    text: 'Épisode dépressif caractérisé',
    type: 'single_choice',
    required: true,
    options: OUI_NON,
    help: "Auto-rempli depuis le MINI Section A (MINIA5BIS). Modifiable par le clinicien."
  },
  {
    id: 'niv_2_thase_rush',
    text: 'Niveau 2 ou plus de résistance aux traitements selon les critères de Thase et Rush',
    type: 'single_choice',
    required: true,
    options: OUI_NON,
    help: "Auto-rempli depuis le questionnaire Thase et Rush. Modifiable par le clinicien."
  },

  { id: 'section_non_inclusion', text: 'Critères de non-inclusion', type: 'section', required: false },

  {
    id: 'trou_bipol',
    text: 'Trouble bipolaire',
    type: 'single_choice',
    required: true,
    options: OUI_NON,
    help: "Auto-rempli depuis le MINI Section C (épisode maniaque/hypomaniaque). Modifiable par le clinicien."
  },
  {
    id: 'trou_compul',
    text: 'Trouble obsessionnel compulsif',
    type: 'single_choice',
    required: true,
    options: OUI_NON,
    help: "Auto-rempli depuis le MINI Section G (TOC actuel). Modifiable par le clinicien."
  },
  {
    id: 'trou_alim',
    text: 'Trouble des conduites alimentaires',
    type: 'single_choice',
    required: true,
    options: OUI_NON,
    help: "Auto-rempli depuis le MINI Sections L/M (anorexie/boulimie). Modifiable par le clinicien."
  },

  { id: 'section_eligibility', text: 'Éligibilité', type: 'section', required: false },

  {
    id: 'pat_eligible',
    text: 'Patient éligible ?',
    type: 'single_choice',
    required: false,
    options: OUI_NON,
    help: "Calculé automatiquement : Oui si les 3 critères d'inclusion sont Oui ET les 3 critères de non-inclusion sont Non."
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

export const DEPRESSION_INCLUSION_DEFINITION: QuestionnaireDefinition = {
  id: 'depression_inclusion',
  code: 'INCLUSION',
  title: "Critères d'inclusion et de non-inclusion",
  description: "Détermination de l'éligibilité du patient pour la cohorte E-CEDR : 3 critères d'inclusion et 3 critères de non-inclusion.",
  questions: DEPRESSION_INCLUSION_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['depression'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Score Computation
// ============================================================================

export interface DepressionInclusionScoreInput {
  madrs_score: number;
  epi_depress_caract: number;
  niv_2_thase_rush: number;
  trou_bipol: number;
  trou_compul: number;
  trou_alim: number;
}

export function computeEligibility(responses: DepressionInclusionScoreInput): number {
  const inclusionMet =
    responses.madrs_score === 1 &&
    responses.epi_depress_caract === 1 &&
    responses.niv_2_thase_rush === 1;

  const noExclusion =
    responses.trou_bipol === 0 &&
    responses.trou_compul === 0 &&
    responses.trou_alim === 0;

  return (inclusionMet && noExclusion) ? 1 : 0;
}

export function interpretEligibility(eligible: number): string {
  if (eligible === 1) {
    return "Patient éligible. Tous les critères d'inclusion sont remplis et aucun critère de non-inclusion n'est présent.";
  }
  return "Patient non éligible. Un ou plusieurs critères d'inclusion ne sont pas remplis, ou un critère de non-inclusion est présent.";
}

export interface DepressionInclusionScoringResult {
  total_score: number;
  interpretation: string;
  pat_eligible: number;
}

export function scoreDepressionInclusion(responses: DepressionInclusionScoreInput): DepressionInclusionScoringResult {
  const pat_eligible = computeEligibility(responses);
  const interpretation = interpretEligibility(pat_eligible);

  return {
    total_score: pat_eligible,
    interpretation,
    pat_eligible
  };
}
