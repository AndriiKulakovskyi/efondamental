// eFondaMental Platform - BLOOD_PRESSURE (Blood Pressure & Heart Rate)
// Bipolar Initial Evaluation - Nurse Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarBloodPressureResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  bp_lying_systolic: number | null;
  bp_lying_diastolic: number | null;
  tension_lying: string | null;
  heart_rate_lying: number | null;
  bp_standing_systolic: number | null;
  bp_standing_diastolic: number | null;
  tension_standing: string | null;
  heart_rate_standing: number | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarBloodPressureResponseInsert = Omit<
  BipolarBloodPressureResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'tension_lying' | 'tension_standing'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const BLOOD_PRESSURE_QUESTIONS: Question[] = [
  // Blood Pressure & Heart Rate - Lying Down Section
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
  
  // Blood Pressure & Heart Rate - Standing Section
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

export const BLOOD_PRESSURE_DEFINITION: QuestionnaireDefinition = {
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
// Computation Functions
// ============================================================================

export interface BloodPressureInput {
  bp_lying_systolic: number | null;
  bp_lying_diastolic: number | null;
  bp_standing_systolic: number | null;
  bp_standing_diastolic: number | null;
}

export function computeTensionStrings(input: BloodPressureInput): {
  tension_lying: string | null;
  tension_standing: string | null;
} {
  let tensionLying = null;
  if (input.bp_lying_systolic && input.bp_lying_diastolic) {
    tensionLying = `${input.bp_lying_systolic}/${input.bp_lying_diastolic}`;
  }

  let tensionStanding = null;
  if (input.bp_standing_systolic && input.bp_standing_diastolic) {
    tensionStanding = `${input.bp_standing_systolic}/${input.bp_standing_diastolic}`;
  }

  return { tension_lying: tensionLying, tension_standing: tensionStanding };
}

// ============================================================================
// Orthostatic Hypotension Detection
// ============================================================================

export interface OrthostaticHypotensionResult {
  has_orthostatic_hypotension: boolean;
  systolic_drop: number | null;
  diastolic_drop: number | null;
  interpretation: string | null;
}

export function detectOrthostaticHypotension(input: BloodPressureInput): OrthostaticHypotensionResult {
  if (!input.bp_lying_systolic || !input.bp_standing_systolic || 
      !input.bp_lying_diastolic || !input.bp_standing_diastolic) {
    return {
      has_orthostatic_hypotension: false,
      systolic_drop: null,
      diastolic_drop: null,
      interpretation: null
    };
  }

  const systolicDrop = input.bp_lying_systolic - input.bp_standing_systolic;
  const diastolicDrop = input.bp_lying_diastolic - input.bp_standing_diastolic;

  // Orthostatic hypotension: drop of >=20 mmHg systolic or >=10 mmHg diastolic
  const hasOrthostaticHypotension = systolicDrop >= 20 || diastolicDrop >= 10;

  let interpretation = null;
  if (hasOrthostaticHypotension) {
    interpretation = `Hypotension orthostatique detectee: chute de ${systolicDrop} mmHg systolique et ${diastolicDrop} mmHg diastolique au passage en position debout.`;
  }

  return {
    has_orthostatic_hypotension: hasOrthostaticHypotension,
    systolic_drop: systolicDrop,
    diastolic_drop: diastolicDrop,
    interpretation
  };
}
