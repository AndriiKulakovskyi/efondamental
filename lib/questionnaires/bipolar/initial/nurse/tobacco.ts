// eFondaMental Platform - TOBACCO (Tobacco Assessment)
// Bipolar Initial Evaluation - Nurse Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarTobaccoResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  smoking_status: string;
  pack_years: number | null;
  smoking_start_age: string | null;
  smoking_end_age: string | null;
  has_substitution: boolean | null;
  substitution_methods: string[] | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarTobaccoResponseInsert = Omit<
  BipolarTobaccoResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
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

export const TOBACCO_DEFINITION: QuestionnaireDefinition = {
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
// Note: Tobacco assessment does not have scoring logic
// Data is collected for clinical evaluation purposes
// ============================================================================
