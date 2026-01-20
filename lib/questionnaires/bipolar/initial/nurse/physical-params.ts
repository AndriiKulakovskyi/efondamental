// eFondaMental Platform - PHYSICAL_PARAMS (Physical Parameters)
// Bipolar Initial Evaluation - Nurse Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarPhysicalParamsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  height_cm: number | null;
  weight_kg: number | null;
  bmi: number | null;
  abdominal_circumference_cm: number | null;
  pregnant: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarPhysicalParamsResponseInsert = Omit<
  BipolarPhysicalParamsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'bmi'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const PHYSICAL_PARAMS_QUESTIONS: Question[] = [
  {
    id: 'height_cm',
    text: 'Taille (en cm)',
    type: 'number',
    required: false,
    min: 110,
    max: 210
  },
  {
    id: 'weight_kg',
    text: 'Poids (en kg)',
    type: 'number',
    required: false,
    min: 30,
    max: 200
  },
  {
    id: 'bmi',
    text: 'IMC (Indice de Masse Corporelle)',
    help: 'Calcule automatiquement a partir de la taille et du poids: Poids(kg) / (Taille(m))^2',
    type: 'text',
    required: false,
    readonly: true
  },
  {
    id: 'abdominal_circumference_cm',
    text: 'Perimetre abdominal (en cm)',
    type: 'number',
    required: false,
    min: 40,
    max: 160
  },
  {
    id: 'pregnant',
    text: 'Femme enceinte',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      '!=': [{ var: 'patient_gender' }, 'M']
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

export const PHYSICAL_PARAMS_DEFINITION: QuestionnaireDefinition = {
  id: 'physical_params',
  code: 'PHYSICAL_PARAMS',
  title: 'Parametres Physiques',
  description: 'Mesures physiques: taille, poids, perimetre abdominal. IMC calcule automatiquement.',
  questions: PHYSICAL_PARAMS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// BMI Computation
// ============================================================================

export interface PhysicalParamsInput {
  height_cm: number | null;
  weight_kg: number | null;
}

export function computeBMI(params: PhysicalParamsInput): number | null {
  if (!params.height_cm || !params.weight_kg) return null;
  if (params.height_cm <= 0 || params.weight_kg <= 0) return null;
  
  const heightM = params.height_cm / 100;
  const bmi = params.weight_kg / (heightM * heightM);
  
  return Math.round(bmi * 100) / 100; // Round to 2 decimal places
}

// ============================================================================
// BMI Interpretation
// ============================================================================

export type BMICategory = 
  | 'Insuffisance ponderale'
  | 'Corpulence normale'
  | 'Surpoids'
  | 'Obesite moderee'
  | 'Obesite severe'
  | 'Obesite morbide';

export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'Insuffisance ponderale';
  if (bmi < 25) return 'Corpulence normale';
  if (bmi < 30) return 'Surpoids';
  if (bmi < 35) return 'Obesite moderee';
  if (bmi < 40) return 'Obesite severe';
  return 'Obesite morbide';
}

export function interpretBMI(bmi: number): string {
  const category = getBMICategory(bmi);
  return `IMC: ${bmi.toFixed(1)} kg/m^2 - ${category}`;
}

// ============================================================================
// Combined Computation Function
// ============================================================================

export interface PhysicalParamsResult {
  bmi: number | null;
  bmi_category: BMICategory | null;
  interpretation: string | null;
}

export function computePhysicalParams(params: PhysicalParamsInput): PhysicalParamsResult {
  const bmi = computeBMI(params);
  
  if (bmi === null) {
    return {
      bmi: null,
      bmi_category: null,
      interpretation: null
    };
  }

  return {
    bmi,
    bmi_category: getBMICategory(bmi),
    interpretation: interpretBMI(bmi)
  };
}
