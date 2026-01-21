// eFondaMental Platform - Physical Parameters
// Bipolar Nurse Evaluation Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarNursePhysicalParamsResponse {
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

export type BipolarNursePhysicalParamsResponseInsert = {
  visit_id: string;
  patient_id: string;
  height_cm?: number | null;
  weight_kg?: number | null;
  abdominal_circumference_cm?: number | null;
  pregnant?: string | null;
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

export const PHYSICAL_PARAMS_DEFINITION = {
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

export function computeBMI(height_cm: number | null, weight_kg: number | null): number | null {
  if (!height_cm || !weight_kg || height_cm <= 0) return null;
  const height_m = height_cm / 100;
  return Math.round((weight_kg / (height_m * height_m)) * 10) / 10;
}

// ============================================================================
// BMI Interpretation
// ============================================================================

export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese_1' | 'obese_2' | 'obese_3' | null;

export function getBMICategory(bmi: number | null): BMICategory {
  if (bmi === null) return null;
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  if (bmi < 35) return 'obese_1';
  if (bmi < 40) return 'obese_2';
  return 'obese_3';
}

export function getBMICategoryLabel(category: BMICategory): string {
  switch (category) {
    case 'underweight':
      return 'Insuffisance ponderale';
    case 'normal':
      return 'Corpulence normale';
    case 'overweight':
      return 'Surpoids';
    case 'obese_1':
      return 'Obesite moderee (classe I)';
    case 'obese_2':
      return 'Obesite severe (classe II)';
    case 'obese_3':
      return 'Obesite morbide (classe III)';
    default:
      return 'Non determine';
  }
}

export function interpretPhysicalParams(responses: PhysicalParamsInput): string {
  const bmi = computeBMI(responses.height_cm, responses.weight_kg);
  if (bmi === null) {
    return 'IMC non calculable (donnees manquantes).';
  }
  
  const category = getBMICategory(bmi);
  const categoryLabel = getBMICategoryLabel(category);
  return `IMC: ${bmi} kg/m2. ${categoryLabel}.`;
}

// ============================================================================
// Combined Analysis Function
// ============================================================================

export interface PhysicalParamsAnalysisResult {
  bmi: number | null;
  bmi_category: BMICategory;
  bmi_category_label: string;
  interpretation: string;
}

export function analyzePhysicalParams(responses: PhysicalParamsInput): PhysicalParamsAnalysisResult {
  const bmi = computeBMI(responses.height_cm, responses.weight_kg);
  const category = getBMICategory(bmi);
  
  return {
    bmi,
    bmi_category: category,
    bmi_category_label: getBMICategoryLabel(category),
    interpretation: interpretPhysicalParams(responses)
  };
}
