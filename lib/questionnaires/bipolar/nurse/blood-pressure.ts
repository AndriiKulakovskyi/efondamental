// eFondaMental Platform - Blood Pressure & Heart Rate
// Bipolar Nurse Evaluation Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarNurseBloodPressureResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Lying
  bp_lying_systolic: number | null;
  bp_lying_diastolic: number | null;
  heart_rate_lying: number | null;
  // Standing
  bp_standing_systolic: number | null;
  bp_standing_diastolic: number | null;
  heart_rate_standing: number | null;
  // Computed
  tension_lying: string | null;
  tension_standing: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarNurseBloodPressureResponseInsert = {
  visit_id: string;
  patient_id: string;
  bp_lying_systolic?: number | null;
  bp_lying_diastolic?: number | null;
  heart_rate_lying?: number | null;
  bp_standing_systolic?: number | null;
  bp_standing_diastolic?: number | null;
  heart_rate_standing?: number | null;
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const BLOOD_PRESSURE_QUESTIONS: Question[] = [
  // Lying Down Section
  {
    id: 'section_bp_lying',
    text: 'Pression arterielle couche (en mm de Mercure)',
    type: 'section',
    required: false
  },
  {
    id: 'bp_lying_systolic',
    text: 'Pression Systolique (mmHg)',
    type: 'number',
    required: false,
    min: 80,
    max: 220
  },
  {
    id: 'bp_lying_diastolic',
    text: 'Pression Diastolique (mmHg)',
    type: 'number',
    required: false,
    min: 40,
    max: 140
  },
  {
    id: 'tension_lying',
    text: 'Tension couche',
    help: 'Format: Systolique/Diastolique (calcule automatiquement)',
    type: 'text',
    required: false,
    readonly: true
  },
  {
    id: 'heart_rate_lying',
    text: 'Frequence cardiaque couche (battements par minute)',
    type: 'number',
    required: false,
    min: 40,
    max: 220
  },
  
  // Standing Section
  {
    id: 'section_bp_standing',
    text: 'Pression arterielle debout (en mm de Mercure)',
    type: 'section',
    required: false
  },
  {
    id: 'bp_standing_systolic',
    text: 'Pression Systolique (mmHg)',
    type: 'number',
    required: false,
    min: 80,
    max: 220
  },
  {
    id: 'bp_standing_diastolic',
    text: 'Pression Diastolique (mmHg)',
    type: 'number',
    required: false,
    min: 40,
    max: 140
  },
  {
    id: 'tension_standing',
    text: 'Tension debout',
    help: 'Format: Systolique/Diastolique (calcule automatiquement)',
    type: 'text',
    required: false,
    readonly: true
  },
  {
    id: 'heart_rate_standing',
    text: 'Frequence cardiaque debout (battements par minute)',
    type: 'number',
    required: false,
    min: 40,
    max: 220
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const BLOOD_PRESSURE_DEFINITION = {
  id: 'blood_pressure',
  code: 'BLOOD_PRESSURE',
  title: 'Pression arterielle & Frequence cardiaque',
  description: 'Mesures de la pression arterielle et de la frequence cardiaque (couche et debout)',
  questions: BLOOD_PRESSURE_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Blood Pressure Analysis
// ============================================================================

export interface BloodPressureInput {
  bp_lying_systolic: number | null;
  bp_lying_diastolic: number | null;
  bp_standing_systolic: number | null;
  bp_standing_diastolic: number | null;
}

export type BPCategory = 'normal' | 'elevated' | 'hypertension_1' | 'hypertension_2' | 'crisis' | null;

export function getBPCategory(systolic: number | null, diastolic: number | null): BPCategory {
  if (systolic === null || diastolic === null) return null;
  
  if (systolic >= 180 || diastolic >= 120) return 'crisis';
  if (systolic >= 140 || diastolic >= 90) return 'hypertension_2';
  if (systolic >= 130 || diastolic >= 80) return 'hypertension_1';
  if (systolic >= 120) return 'elevated';
  return 'normal';
}

export function getBPCategoryLabel(category: BPCategory): string {
  switch (category) {
    case 'normal':
      return 'Normale';
    case 'elevated':
      return 'Elevee';
    case 'hypertension_1':
      return 'Hypertension stade 1';
    case 'hypertension_2':
      return 'Hypertension stade 2';
    case 'crisis':
      return 'Crise hypertensive';
    default:
      return 'Non determinee';
  }
}

export function formatTension(systolic: number | null, diastolic: number | null): string | null {
  if (systolic === null || diastolic === null) return null;
  return `${systolic}/${diastolic}`;
}

// ============================================================================
// Orthostatic Hypotension Detection
// ============================================================================

export function hasOrthostaticHypotension(input: BloodPressureInput): boolean | null {
  if (
    input.bp_lying_systolic === null ||
    input.bp_standing_systolic === null ||
    input.bp_lying_diastolic === null ||
    input.bp_standing_diastolic === null
  ) {
    return null;
  }
  
  const systolicDrop = input.bp_lying_systolic - input.bp_standing_systolic;
  const diastolicDrop = input.bp_lying_diastolic - input.bp_standing_diastolic;
  
  // Orthostatic hypotension: drop of >= 20 mmHg systolic or >= 10 mmHg diastolic
  return systolicDrop >= 20 || diastolicDrop >= 10;
}

// ============================================================================
// Interpretation
// ============================================================================

export function interpretBloodPressure(input: BloodPressureInput): string {
  const parts: string[] = [];
  
  const lyingCategory = getBPCategory(input.bp_lying_systolic, input.bp_lying_diastolic);
  if (lyingCategory) {
    const tension = formatTension(input.bp_lying_systolic, input.bp_lying_diastolic);
    parts.push(`TA couche: ${tension} mmHg (${getBPCategoryLabel(lyingCategory)})`);
  }
  
  const standingCategory = getBPCategory(input.bp_standing_systolic, input.bp_standing_diastolic);
  if (standingCategory) {
    const tension = formatTension(input.bp_standing_systolic, input.bp_standing_diastolic);
    parts.push(`TA debout: ${tension} mmHg (${getBPCategoryLabel(standingCategory)})`);
  }
  
  const orthoHypo = hasOrthostaticHypotension(input);
  if (orthoHypo === true) {
    parts.push('Hypotension orthostatique detectee');
  }
  
  return parts.length > 0 ? parts.join('. ') + '.' : 'Mesures non disponibles.';
}

// ============================================================================
// Combined Analysis Function
// ============================================================================

export interface BloodPressureAnalysisResult {
  lying_bp_category: BPCategory;
  standing_bp_category: BPCategory;
  has_orthostatic_hypotension: boolean | null;
  tension_lying: string | null;
  tension_standing: string | null;
  interpretation: string;
}

export function analyzeBloodPressure(input: BloodPressureInput): BloodPressureAnalysisResult {
  return {
    lying_bp_category: getBPCategory(input.bp_lying_systolic, input.bp_lying_diastolic),
    standing_bp_category: getBPCategory(input.bp_standing_systolic, input.bp_standing_diastolic),
    has_orthostatic_hypotension: hasOrthostaticHypotension(input),
    tension_lying: formatTension(input.bp_lying_systolic, input.bp_lying_diastolic),
    tension_standing: formatTension(input.bp_standing_systolic, input.bp_standing_diastolic),
    interpretation: interpretBloodPressure(input)
  };
}
