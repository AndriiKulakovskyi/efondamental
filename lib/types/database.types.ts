// eFondaMental Platform - Questionnaire Response Types

// ============================================================================
// Question Types (Simplified for Constants)
// ============================================================================

export interface QuestionOption {
  code: number | string;
  label: string;
  score?: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'scale' | 'boolean' | 'date';
  required: boolean;
  options?: (QuestionOption | string)[];
  help?: string;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  display_if?: any; // JSONLogic condition
  required_if?: any; // JSONLogic condition
  metadata?: Record<string, any>;
}

// ============================================================================
// ASRM (Altman Self-Rating Mania Scale)
// ============================================================================

export interface AsrmResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  total_score?: number;
  interpretation?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type AsrmResponseInsert = Omit<AsrmResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'interpretation'>;

// ============================================================================
// QIDS-SR16 (Quick Inventory of Depressive Symptomatology)
// ============================================================================

export interface QidsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
  q11: number;
  q12: number;
  q13: number;
  q14: number;
  q15: number;
  q16: number;
  total_score?: number;
  interpretation?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type QidsResponseInsert = Omit<QidsResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'interpretation'>;

// ============================================================================
// MDQ (Mood Disorder Questionnaire)
// ============================================================================

export interface MdqResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1_1: number;
  q1_2: number;
  q1_3: number;
  q1_4: number;
  q1_5: number;
  q1_6: number;
  q1_7: number;
  q1_8: number;
  q1_9: number;
  q1_10: number;
  q1_11: number;
  q1_12: number;
  q1_13: number;
  q1_score?: number;
  q2: number | null;
  q3: number | null;
  interpretation?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type MdqResponseInsert = Omit<MdqResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'q1_score' | 'interpretation'>;

// ============================================================================
// Bipolar Diagnostic (EBIP_SCR_DIAG) - New Medical Diagnostic Form
// ============================================================================

export interface BipolarDiagnosticResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  date_recueil?: string | null;
  diag_prealable: 'oui' | 'non' | 'je_ne_sais_pas';
  diag_evoque: 'oui' | 'non' | 'differe';
  bilan_programme?: 'oui' | 'non' | null;
  bilan_programme_precision?: 'diagnostic_refuse' | 'etat_clinique_incompatible' | 'consultation_suffisante' | 'patient_non_disponible' | 'refus_patient' | 'autre' | null;
  diag_recuse_precision?: 'edm_unipolaire' | 'schizo_affectif' | 'schizophrene' | 'borderline' | 'autres_troubles_personnalite' | 'addiction' | 'autres' | 'ne_sais_pas' | null;
  diag_recuse_autre_text?: string | null;
  lettre_information: 'oui' | 'non';
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarDiagnosticResponseInsert = Omit<BipolarDiagnosticResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Bipolar Orientation (EBIP_SCR_ORIENT) - Specific to Bipolar Disorder
// ============================================================================

export interface BipolarOrientationResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  trouble_bipolaire_ou_suspicion: 'oui' | 'non';
  etat_thymique_compatible: 'oui' | 'non';
  prise_en_charge_100_ou_accord: 'oui' | 'non';
  accord_evaluation_centre_expert: 'oui' | 'non';
  accord_transmission_cr: 'oui' | 'non';
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarOrientationResponseInsert = Omit<BipolarOrientationResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// Legacy type aliases for backwards compatibility
export type OrientationResponse = BipolarOrientationResponse;
export type OrientationResponseInsert = BipolarOrientationResponseInsert;
