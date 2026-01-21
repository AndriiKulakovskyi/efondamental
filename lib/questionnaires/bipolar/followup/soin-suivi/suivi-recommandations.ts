// eFondaMental Platform - Suivi des Recommandations
// Bipolar Followup Evaluation - Soin Suivi Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarFollowupSuiviRecommandationsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  rad_suivi_recom_medicamenteux: string | null;
  rad_suivi_recom_medicamenteux_non: string | null;
  rad_suivi_recom_non_medicamenteux: string | null;
  rad_suivi_recom_non_medicamenteux_non: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarFollowupSuiviRecommandationsResponseInsert = Omit<
  BipolarFollowupSuiviRecommandationsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const SUIVI_RECOMMANDATIONS_QUESTIONS: Question[] = [
  {
    id: 'rad_suivi_recom_medicamenteux',
    text: 'Suivi des recommandations faites au cours de la premiere evaluation pour le traitement medicamenteux',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Completement suivi', label: 'Completement suivi' },
      { code: 'Partiellement suivi', label: 'Partiellement suivi' },
      { code: 'Non suivi', label: 'Non suivi' }
    ]
  },
  {
    id: 'rad_suivi_recom_medicamenteux_non',
    text: 'Precisez pourquoi les recommandations n\'ont pas ete suivies',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: {
      'in': [{ var: 'rad_suivi_recom_medicamenteux' }, ['Partiellement suivi', 'Non suivi']]
    },
    options: [
      { code: 'Refus du patient', label: 'Refus du patient' },
      { code: 'Desaccord du medecin pratiquant le suivi', label: 'Desaccord du medecin pratiquant le suivi' },
      { code: 'Probleme de tolerance', label: 'Probleme de tolerance' },
      { code: 'Probleme de rechute', label: 'Probleme de rechute' },
      { code: 'Autres', label: 'Autres' }
    ]
  },
  {
    id: 'rad_suivi_recom_non_medicamenteux',
    text: 'Suivi des recommandations faites au cours de la premiere evaluation pour les traitements non medicamenteux',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Completement suivi', label: 'Completement suivi' },
      { code: 'Partiellement suivi', label: 'Partiellement suivi' },
      { code: 'Non suivi', label: 'Non suivi' }
    ]
  },
  {
    id: 'rad_suivi_recom_non_medicamenteux_non',
    text: 'Precisez pourquoi les recommandations n\'ont pas ete suivies',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: {
      'in': [{ var: 'rad_suivi_recom_non_medicamenteux' }, ['Partiellement suivi', 'Non suivi']]
    },
    options: [
      { code: 'Refus du patient', label: 'Refus du patient' },
      { code: 'Desaccord avec le medecin pratiquant le suivi', label: 'Desaccord avec le medecin pratiquant le suivi' },
      { code: 'Impossible a mettre en place', label: 'Impossible a mettre en place' },
      { code: 'Autres', label: 'Autres' }
    ]
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const SUIVI_RECOMMANDATIONS_DEFINITION = {
  id: 'suivi_recommandations',
  code: 'SUIVI_RECOMMANDATIONS',
  title: 'Suivi des recommandations',
  description: 'Evaluation du suivi des recommandations medicamenteuses et non-medicamenteuses faites lors de l\'evaluation initiale',
  questions: SUIVI_RECOMMANDATIONS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Adherence Analysis
// ============================================================================

export interface SuiviRecommandationsInput {
  rad_suivi_recom_medicamenteux: string | null;
  rad_suivi_recom_non_medicamenteux: string | null;
}

export type AdherenceLevel = 'full' | 'partial' | 'none' | 'unknown';

export function getPharmacologicalAdherence(responses: SuiviRecommandationsInput): AdherenceLevel {
  switch (responses.rad_suivi_recom_medicamenteux) {
    case 'Completement suivi':
      return 'full';
    case 'Partiellement suivi':
      return 'partial';
    case 'Non suivi':
      return 'none';
    default:
      return 'unknown';
  }
}

export function getNonPharmacologicalAdherence(responses: SuiviRecommandationsInput): AdherenceLevel {
  switch (responses.rad_suivi_recom_non_medicamenteux) {
    case 'Completement suivi':
      return 'full';
    case 'Partiellement suivi':
      return 'partial';
    case 'Non suivi':
      return 'none';
    default:
      return 'unknown';
  }
}

export function interpretSuiviRecommandations(responses: SuiviRecommandationsInput): string {
  const pharma = getPharmacologicalAdherence(responses);
  const nonPharma = getNonPharmacologicalAdherence(responses);
  
  const parts: string[] = [];
  
  if (pharma === 'full') {
    parts.push('Traitement medicamenteux: completement suivi');
  } else if (pharma === 'partial') {
    parts.push('Traitement medicamenteux: partiellement suivi');
  } else if (pharma === 'none') {
    parts.push('Traitement medicamenteux: non suivi');
  }
  
  if (nonPharma === 'full') {
    parts.push('Traitement non-medicamenteux: completement suivi');
  } else if (nonPharma === 'partial') {
    parts.push('Traitement non-medicamenteux: partiellement suivi');
  } else if (nonPharma === 'none') {
    parts.push('Traitement non-medicamenteux: non suivi');
  }
  
  return parts.length > 0 ? parts.join('. ') + '.' : 'Suivi des recommandations non renseigne.';
}

// ============================================================================
// Combined Analysis Function
// ============================================================================

export interface SuiviRecommandationsAnalysisResult {
  pharmacological_adherence: AdherenceLevel;
  non_pharmacological_adherence: AdherenceLevel;
  interpretation: string;
}

export function analyzeSuiviRecommandations(
  responses: SuiviRecommandationsInput
): SuiviRecommandationsAnalysisResult {
  return {
    pharmacological_adherence: getPharmacologicalAdherence(responses),
    non_pharmacological_adherence: getNonPharmacologicalAdherence(responses),
    interpretation: interpretSuiviRecommandations(responses)
  };
}
