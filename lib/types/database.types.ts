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

// ============================================================================
// Initial Evaluation Questionnaires - ETAT Section
// ============================================================================

// EQ-5D-5L (Health status questionnaire)
export interface Eq5d5lResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  mobility: number;
  self_care: number;
  usual_activities: number;
  pain_discomfort: number;
  anxiety_depression: number;
  vas_score: number;
  profile_string?: string;
  index_value?: number | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Eq5d5lResponseInsert = Omit<Eq5d5lResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'profile_string'>;

// PRISE-M (Medication side effects)
export interface PriseMResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  gender?: 'M' | 'F' | null;
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
  q5?: number | null;
  q6?: number | null;
  q7?: number | null;
  q8?: number | null;
  q9?: number | null;
  q10?: number | null;
  q11?: number | null;
  q12?: number | null;
  q13?: number | null;
  q14?: number | null;
  q15?: number | null;
  q16?: number | null;
  q17?: number | null;
  q18?: number | null;
  q19?: number | null;
  q20?: number | null; // Female only
  q21?: number | null;
  q22?: number | null;
  q23?: number | null;
  q24?: number | null;
  q25?: number | null; // Male only
  q26?: number | null;
  q27?: number | null;
  q28?: number | null;
  q29?: number | null;
  q30?: number | null;
  q31?: number | null;
  q32?: number | null;
  gastro_score?: number | null;
  cardiac_score?: number | null;
  skin_score?: number | null;
  neuro_score?: number | null;
  vision_hearing_score?: number | null;
  urogenital_score?: number | null;
  sleep_score?: number | null;
  sexual_score?: number | null;
  other_score?: number | null;
  total_score?: number | null;
  items_scored?: number | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type PriseMResponseInsert = Omit<PriseMResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// STAI-YA (State anxiety)
export interface StaiYaResponse {
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
  q17: number;
  q18: number;
  q19: number;
  q20: number;
  total_score?: number | null;
  anxiety_level?: string | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type StaiYaResponseInsert = Omit<StaiYaResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// MARS (Medication adherence)
export interface MarsResponse {
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
  total_score?: number | null;
  adherence_percentage?: number | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type MarsResponseInsert = Omit<MarsResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'adherence_percentage'>;

// MAThyS (Multidimensional thymic states)
export interface MathysResponse {
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
  q17: number;
  q18: number;
  q19: number;
  q20: number;
  emotional_hyperreactivity?: number | null;
  emotional_hyporeactivity?: number | null;
  cognitive_speed?: number | null;
  motor_activity?: number | null;
  motivation?: number | null;
  total_score?: number | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type MathysResponseInsert = Omit<MathysResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// PSQI (Pittsburgh Sleep Quality Index)
export interface PsqiResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1_bedtime?: string | null;
  q2_minutes_to_sleep?: number | null;
  q3_waketime?: string | null;
  q4_hours_sleep?: number | null;
  q5a?: number | null;
  q5b?: number | null;
  q5c?: number | null;
  q5d?: number | null;
  q5e?: number | null;
  q5f?: number | null;
  q5g?: number | null;
  q5h?: number | null;
  q5i?: number | null;
  q5j?: number | null;
  q5j_text?: string | null;
  q6?: number | null;
  q7?: number | null;
  q8?: number | null;
  q9?: number | null;
  c1_subjective_quality?: number | null;
  c2_latency?: number | null;
  c3_duration?: number | null;
  c4_efficiency?: number | null;
  c5_disturbances?: number | null;
  c6_medication?: number | null;
  c7_daytime_dysfunction?: number | null;
  time_in_bed_hours?: number | null;
  sleep_efficiency_pct?: number | null;
  total_score?: number | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type PsqiResponseInsert = Omit<PsqiResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// Epworth (Sleepiness Scale)
export interface EpworthResponse {
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
  q9?: number | null;
  total_score?: number | null;
  severity?: string | null;
  clinical_context?: string | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type EpworthResponseInsert = Omit<EpworthResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score'>;

// ============================================================================
// Initial Evaluation Questionnaires - TRAITS Section
// ============================================================================

// ASRS (Adult ADHD Self-Report Scale)
export interface AsrsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  a1: number;
  a2: number;
  a3: number;
  a4: number;
  a5: number;
  a6: number;
  b7: number;
  b8: number;
  b9: number;
  b10: number;
  b11: number;
  b12: number;
  b13: number;
  b14: number;
  b15: number;
  b16: number;
  b17: number;
  b18: number;
  part_a_positive_items?: number | null;
  screening_positive?: boolean | null;
  total_score?: number | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type AsrsResponseInsert = Omit<AsrsResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// CTQ (Childhood Trauma Questionnaire)
export interface CtqResponse {
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
  q17: number;
  q18: number;
  q19: number;
  q20: number;
  q21: number;
  q22: number;
  q23: number;
  q24: number;
  q25: number;
  q26: number;
  q27: number;
  q28: number;
  emotional_abuse_score?: number | null;
  emotional_abuse_severity?: string | null;
  physical_abuse_score?: number | null;
  physical_abuse_severity?: string | null;
  sexual_abuse_score?: number | null;
  sexual_abuse_severity?: string | null;
  emotional_neglect_score?: number | null;
  emotional_neglect_severity?: string | null;
  physical_neglect_score?: number | null;
  physical_neglect_severity?: string | null;
  denial_score?: number | null;
  total_score?: number | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type CtqResponseInsert = Omit<CtqResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// BIS-10 (Barratt Impulsiveness Scale)
export interface Bis10Response {
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
  cognitive_impulsivity_mean?: number | null;
  behavioral_impulsivity_mean?: number | null;
  overall_impulsivity?: number | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Bis10ResponseInsert = Omit<Bis10Response, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ALS-18 (Affective Lability Scale)
export interface Als18Response {
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
  q17: number;
  q18: number;
  anxiety_depression_mean?: number | null;
  depression_elation_mean?: number | null;
  anger_mean?: number | null;
  total_mean?: number | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Als18ResponseInsert = Omit<Als18Response, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// AIM (Affect Intensity Measure)
export interface AimResponse {
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
  q17: number;
  q18: number;
  q19: number;
  q20: number;
  positive_affectivity_mean?: number | null;
  negative_intensity_mean?: number | null;
  reactivity_mean?: number | null;
  total_mean?: number | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type AimResponseInsert = Omit<AimResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// WURS-25 (Wender Utah Rating Scale)
export interface Wurs25Response {
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
  q17: number;
  q18: number;
  q19: number;
  q20: number;
  q21: number;
  q22: number;
  q23: number;
  q24: number;
  q25: number;
  total_score?: number | null;
  adhd_likely?: boolean | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Wurs25ResponseInsert = Omit<Wurs25Response, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score'>;

// AQ-12 (Autism Quotient)
export interface Aq12Response {
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
  total_score?: number | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Aq12ResponseInsert = Omit<Aq12Response, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// CSM (Cognitive Style in Mania)
export interface CsmResponse {
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
  total_score?: number | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type CsmResponseInsert = Omit<CsmResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score'>;

// CTI (Circadian Type Inventory)
export interface CtiResponse {
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
  total_score?: number | null;
  circadian_type?: string | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type CtiResponseInsert = Omit<CtiResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;
