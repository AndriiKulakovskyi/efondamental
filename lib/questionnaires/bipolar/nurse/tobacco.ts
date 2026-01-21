// eFondaMental Platform - Tobacco Assessment
// Bipolar Nurse Evaluation Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarNurseTobaccoResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  smoking_status: string | null;
  pack_years: number | null;
  smoking_start_age: string | null;
  has_substitution: string | null;
  substitution_methods: string[] | null;
  pack_years_ex: number | null;
  smoking_start_age_ex: string | null;
  smoking_end_age: string | null;
  has_substitution_ex: string | null;
  substitution_methods_ex: string[] | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarNurseTobaccoResponseInsert = {
  visit_id: string;
  patient_id: string;
  smoking_status?: string | null;
  pack_years?: number | null;
  smoking_start_age?: string | null;
  has_substitution?: string | null;
  substitution_methods?: string[] | null;
  pack_years_ex?: number | null;
  smoking_start_age_ex?: string | null;
  smoking_end_age?: string | null;
  has_substitution_ex?: string | null;
  substitution_methods_ex?: string[] | null;
  completed_by?: string | null;
};

// ============================================================================
// Helper Functions
// ============================================================================

const generateAgeOptions = () => {
  const options = [{ code: 'unknown', label: 'Ne sais pas' }, { code: '<5', label: '<5' }];
  for (let i = 5; i <= 89; i++) {
    options.push({ code: i.toString(), label: i.toString() });
  }
  options.push({ code: '>89', label: '>89' });
  return options;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const TOBACCO_QUESTIONS: Question[] = [
  {
    id: 'smoking_status',
    text: 'Tabac',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'non_smoker', label: 'Non fumeur' },
      { code: 'current_smoker', label: 'Fumeur actuel' },
      { code: 'ex_smoker', label: 'Ex-fumeur' },
      { code: 'unknown', label: 'Statut inconnu' }
    ]
  },
  
  // Fields for current_smoker
  {
    id: 'pack_years',
    text: 'Nombre de paquet annee',
    type: 'number',
    required: true,
    display_if: {
      '==': [{ var: 'smoking_status' }, 'current_smoker']
    }
  },
  {
    id: 'smoking_start_age',
    text: 'Age de debut du tabagisme',
    type: 'single_choice',
    required: true,
    options: generateAgeOptions(),
    display_if: {
      '==': [{ var: 'smoking_status' }, 'current_smoker']
    }
  },
  {
    id: 'has_substitution',
    text: 'Substitution',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      '==': [{ var: 'smoking_status' }, 'current_smoker']
    }
  },
  {
    id: 'substitution_methods',
    text: 'Methodes de substitution utilisees',
    help: 'Selectionnez toutes les methodes de substitution que le patient utilise',
    type: 'multiple_choice',
    required: false,
    options: [
      { code: 'e_cigarette', label: 'Cigarette electronique' },
      { code: 'champix', label: 'Champix' },
      { code: 'patch', label: 'Patch' },
      { code: 'nicorette', label: 'Nicorette' }
    ],
    display_if: {
      'and': [
        { '==': [{ var: 'smoking_status' }, 'current_smoker'] },
        { '==': [{ var: 'has_substitution' }, 'yes'] }
      ]
    }
  },
  
  // Fields for ex_smoker
  {
    id: 'pack_years_ex',
    text: 'Nombre de paquet annee',
    type: 'number',
    required: true,
    display_if: {
      '==': [{ var: 'smoking_status' }, 'ex_smoker']
    }
  },
  {
    id: 'smoking_start_age_ex',
    text: 'Age de debut du tabagisme',
    type: 'single_choice',
    required: true,
    options: generateAgeOptions(),
    display_if: {
      '==': [{ var: 'smoking_status' }, 'ex_smoker']
    }
  },
  {
    id: 'smoking_end_age',
    text: 'Age de fin du tabac',
    type: 'single_choice',
    required: true,
    options: generateAgeOptions(),
    display_if: {
      '==': [{ var: 'smoking_status' }, 'ex_smoker']
    }
  },
  {
    id: 'has_substitution_ex',
    text: 'Substitution',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      '==': [{ var: 'smoking_status' }, 'ex_smoker']
    }
  },
  {
    id: 'substitution_methods_ex',
    text: 'Methodes de substitution utilisees',
    help: 'Selectionnez toutes les methodes de substitution que le patient utilisait',
    type: 'multiple_choice',
    required: false,
    options: [
      { code: 'e_cigarette', label: 'Cigarette electronique' },
      { code: 'champix', label: 'Champix' },
      { code: 'patch', label: 'Patch' },
      { code: 'nicorette', label: 'Nicorette' }
    ],
    display_if: {
      'and': [
        { '==': [{ var: 'smoking_status' }, 'ex_smoker'] },
        { '==': [{ var: 'has_substitution_ex' }, 'yes'] }
      ]
    }
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const TOBACCO_DEFINITION = {
  id: 'tobacco',
  code: 'TOBACCO',
  title: 'Evaluation du Tabagisme',
  description: 'Evaluation du statut tabagique et de la consommation',
  questions: TOBACCO_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Analysis Functions
// ============================================================================

export type SmokingStatus = 'non_smoker' | 'current_smoker' | 'ex_smoker' | 'unknown';

export interface TobaccoAnalysisInput {
  smoking_status: string | null;
  pack_years: number | null;
  pack_years_ex: number | null;
}

export function getSmokingStatus(responses: TobaccoAnalysisInput): SmokingStatus {
  switch (responses.smoking_status) {
    case 'non_smoker':
      return 'non_smoker';
    case 'current_smoker':
      return 'current_smoker';
    case 'ex_smoker':
      return 'ex_smoker';
    default:
      return 'unknown';
  }
}

export function getPackYears(responses: TobaccoAnalysisInput): number | null {
  if (responses.smoking_status === 'current_smoker') {
    return responses.pack_years;
  }
  if (responses.smoking_status === 'ex_smoker') {
    return responses.pack_years_ex;
  }
  return null;
}

export function interpretTobacco(responses: TobaccoAnalysisInput): string {
  const status = getSmokingStatus(responses);
  
  switch (status) {
    case 'non_smoker':
      return 'Non fumeur.';
    case 'current_smoker':
      return `Fumeur actuel. ${responses.pack_years ?? 0} paquets-annees.`;
    case 'ex_smoker':
      return `Ex-fumeur. ${responses.pack_years_ex ?? 0} paquets-annees.`;
    default:
      return 'Statut tabagique inconnu.';
  }
}

// ============================================================================
// Combined Analysis Function
// ============================================================================

export interface TobaccoAnalysisResult {
  smoking_status: SmokingStatus;
  pack_years: number | null;
  interpretation: string;
}

export function analyzeTobacco(responses: TobaccoAnalysisInput): TobaccoAnalysisResult {
  return {
    smoking_status: getSmokingStatus(responses),
    pack_years: getPackYears(responses),
    interpretation: interpretTobacco(responses)
  };
}
