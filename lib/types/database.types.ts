// eFondaMental Platform - Database Types

// ============================================================================
// Center Types
// ============================================================================

export interface Center {
  id: string;
  name: string;
  code: string;
  city: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type CenterInsert = Omit<Center, 'id' | 'created_at' | 'updated_at'>;
export type CenterUpdate = Partial<Omit<Center, 'id' | 'created_at' | 'updated_at'>>;

export interface Pathology {
  id: string;
  type: string;
  name: string;
  description: string | null;
  color: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  role: string;
  center_id: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  username: string | null;
  active: boolean;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export type UserProfileInsert = Omit<UserProfile, 'created_at' | 'updated_at'>;
export type UserProfileUpdate = Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>;

export interface UserInvitation {
  id: string;
  email: string;
  role: string;
  center_id: string | null;
  patient_id: string | null;
  token: string;
  status: string;
  invited_by: string;
  accepted_by: string | null;
  expires_at: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
}

export type UserInvitationInsert = Omit<UserInvitation, 'id' | 'created_at' | 'updated_at' | 'accepted_by'>;

export interface Patient {
  id: string;
  center_id: string;
  pathology_id: string;
  medical_record_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'M' | 'F' | null;
  place_of_birth: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  emergency_contact: Record<string, any> | null;
  metadata: Record<string, any> | null;
  active: boolean;
  assigned_to: string | null;
  years_of_education: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
}

export interface PatientFull extends Patient {
  center_name: string | null;
  center_code: string | null;
  pathology_name: string | null;
  pathology_type: string | null;
  pathology_color: string | null;
  created_by_first_name: string | null;
  created_by_last_name: string | null;
  assigned_to_first_name: string | null;
  assigned_to_last_name: string | null;
}

export type PatientInsert = Omit<Patient, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'deleted_at' | 'deleted_by'>;
export type PatientUpdate = Partial<Omit<Patient, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'deleted_at' | 'deleted_by'>>;

export interface Visit {
  id: string;
  patient_id: string;
  visit_template_id: string;
  visit_type: string;
  scheduled_date: string | null;
  completed_date: string | null;
  status: string;
  notes: string | null;
  conducted_by: string | null;
  metadata: Record<string, any> | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  completion_percentage: number | null;
  completed_questionnaires: number | null;
  total_questionnaires: number | null;
  completion_updated_at: string | null;
}

export interface VisitFull extends Visit {
  patient_first_name: string | null;
  patient_last_name: string | null;
  medical_record_number: string | null;
  template_name: string | null;
  pathology_id: string | null;
  pathology_name: string | null;
  conducted_by_first_name: string | null;
  conducted_by_last_name: string | null;
}

export type VisitInsert = Omit<Visit, 'id' | 'created_at' | 'updated_at' | 'completion_percentage' | 'completed_questionnaires' | 'total_questionnaires' | 'completion_updated_at'>;
export type VisitUpdate = Partial<Omit<Visit, 'id' | 'created_at' | 'updated_at'>>;

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  center_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  changes: Record<string, any> | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

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
  type: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'scale' | 'boolean' | 'date' | 'section' | 'instruction';
  required: boolean;
  readonly?: boolean;
  section?: string;
  options?: (QuestionOption | string)[];
  help?: string;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  display_if?: any; // JSONLogic condition
  required_if?: any; // JSONLogic condition
  visibleWhen?: { // Simple condition for field visibility
    field: string;
    condition: 'isNotEmpty';
  } | {
    operator: 'and' | 'or';
    conditions: Array<{ field: string; condition: 'isNotEmpty' }>;
  };
  metadata?: Record<string, any>;
  indentLevel?: number; // For visual indentation of branching questions
  is_label?: boolean; // Custom property to indicate if it's a label rather than an input
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
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type AsrmResponseInsert = Omit<AsrmResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'interpretation'> & {
  completed_by?: string | null;
};

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
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type QidsResponseInsert = Omit<QidsResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'interpretation'> & {
  completed_by?: string | null;
};

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
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type MdqResponseInsert = Omit<MdqResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'q1_score' | 'interpretation'> & {
  completed_by?: string | null;
};

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
  interpretation?: string | null;
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
  taking_medication?: 'oui' | 'non' | null;
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
  note_t?: number | null;
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
  taking_medication?: 'oui' | 'non' | null;
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
  tristesse?: number | null;
  joie?: number | null;
  irritabilite?: number | null;
  panique?: number | null;
  anxiete?: number | null;
  colere?: number | null;
  exaltation?: number | null;
  emotional_hyperreactivity?: number | null; // Legacy
  emotional_hyporeactivity?: number | null;  // Legacy
  cognitive_speed?: number | null;           // Legacy
  motor_activity?: number | null;            // Legacy
  motivation?: number | null;                // Legacy
  subscore_emotion?: number | null;
  subscore_motivation?: number | null;
  subscore_perception?: number | null;
  subscore_interaction?: number | null;
  subscore_cognition?: number | null;
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
  q4_hours_sleep?: string | null;
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
  q13: number;
  total_score?: number | null;
  chronotype?: string | null;
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
  flexibility_score?: number | null;
  languid_score?: number | null;
  total_score?: number | null;
  circadian_type?: string | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type CtiResponseInsert = Omit<CtiResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Hetero Questionnaires (Clinician-Rated)
// ============================================================================

// MADRS (Montgomery-Åsberg Depression Rating Scale)
export interface MadrsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1?: number | null; // Tristesse apparente (0-6)
  q2?: number | null; // Tristesse exprimée (0-6)
  q3?: number | null; // Tension intérieure (0-6)
  q4?: number | null; // Réduction du sommeil (0-6)
  q5?: number | null; // Réduction de l'appétit (0-6)
  q6?: number | null; // Difficultés de concentration (0-6)
  q7?: number | null; // Lassitude (0-6)
  q8?: number | null; // Incapacité à ressentir (0-6)
  q9?: number | null; // Pensées pessimistes (0-6)
  q10?: number | null; // Idées de suicide (0-6)
  total_score?: number | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}
export type MadrsResponseInsert = Omit<MadrsResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'interpretation'>;

// YMRS (Young Mania Rating Scale)
export interface YmrsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1?: number | null; // Élévation de l'humeur (0-4)
  q2?: number | null; // Augmentation de l'activité motrice (0-4)
  q3?: number | null; // Intérêt sexuel (0-4)
  q4?: number | null; // Sommeil (0-4)
  q5?: number | null; // Irritabilité (0, 2, 4, 6, 8)
  q6?: number | null; // Discours (0, 2, 4, 6, 8)
  q7?: number | null; // Langage - troubles de la pensée (0-4)
  q8?: number | null; // Contenu (0, 2, 4, 6, 8)
  q9?: number | null; // Comportement agressif et perturbateur (0, 2, 4, 6, 8)
  q10?: number | null; // Apparence (0-4)
  q11?: number | null; // Introspection (0-4)
  total_score?: number | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}
export type YmrsResponseInsert = Omit<YmrsResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'interpretation'>;

// CGI (Clinical Global Impressions)
export interface CgiResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  visit_type?: 'baseline' | 'followup' | null;
  cgi_s?: number | null; // Severity (0-7, 0=not assessed)
  cgi_i?: number | null; // Improvement (0-7, 0=not assessed, only for followup)
  therapeutic_effect?: number | null; // 0-4, 0=not assessed
  side_effects?: number | null; // 0-4, 0=not assessed
  therapeutic_index?: number | null;
  therapeutic_index_label?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}
export type CgiResponseInsert = Omit<CgiResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'therapeutic_index' | 'therapeutic_index_label'>;

// EGF (Échelle de Fonctionnement Global)
export interface EgfResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  egf_score?: number | null; // 1-100
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}
export type EgfResponseInsert = Omit<EgfResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'interpretation'>;

// ALDA (Lithium Response Scale)
export interface AldaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q0?: number | null; // Screening: 0=No, 1=Yes
  qa?: number | null; // Criterion A: 0-10
  qb1?: number | null; // Criterion B1: 0-2
  qb2?: number | null; // Criterion B2: 0-2
  qb3?: number | null; // Criterion B3: 0-2
  qb4?: number | null; // Criterion B4: 0-2
  qb5?: number | null; // Criterion B5: 0-2
  b_total_score?: number | null; // Sum of B1-B5
  alda_score?: number | null; // Total Score = A - B (with rules)
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}
export type AldaResponseInsert = Omit<AldaResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'b_total_score' | 'alda_score' | 'interpretation'>;

// Etat du patient (Patient State - DSM-IV Symptoms)
export interface EtatPatientResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Depressive symptoms (Q1-Q9)
  q1?: number | null; // Humeur dépressive
  q1a?: number | null; // Hyper-réactivité émotionnelle
  q1b?: number | null; // Hypo-réactivité
  q2?: number | null; // Diminution d'intérêt
  q3?: number | null; // Perte/gain de poids
  q3a?: number | null; // Perte de poids
  q3b?: number | null; // Gain de poids
  q4?: number | null; // Insomnie/hypersomnie
  q4a?: number | null; // Insomnie
  q4b?: number | null; // Hypersomnie
  q5?: number | null; // Agitation/ralentissement
  q5a?: number | null; // Agitation
  q5b?: number | null; // Ralentissement
  q6?: number | null; // Fatigue
  q7?: number | null; // Dévalorisation
  q8?: number | null; // Diminution aptitude à penser
  q8a?: number | null; // Accélération idéïque
  q8b?: number | null; // Ralentissement idéïque
  q9?: number | null; // Pensées de mort/suicide
  // Manic symptoms (Q10-Q18)
  q10?: number | null; // Humeur élevée
  q11?: number | null; // Humeur irritable
  q12?: number | null; // Augmentation estime de soi
  q13?: number | null; // Réduction besoin sommeil
  q14?: number | null; // Plus grande communicabilité
  q15?: number | null; // Fuite des idées
  q16?: number | null; // Distractibilité
  q17?: number | null; // Activité dirigée vers un but
  q18?: number | null; // Engagement excessif
  // Scoring
  depression_count?: number | null; // Count of depressive symptoms endorsed
  mania_count?: number | null; // Count of manic symptoms endorsed
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}
export type EtatPatientResponseInsert = Omit<EtatPatientResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'depression_count' | 'mania_count' | 'interpretation'>;

// FAST (Functioning Assessment Short Test)
export interface FastResponse {
  id: string;
  visit_id: string;
  patient_id: string;
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
  q20?: number | null;
  q21?: number | null;
  q22?: number | null;
  q23?: number | null;
  q24?: number | null;
  autonomy_score?: number | null;
  occupational_score?: number | null;
  cognitive_score?: number | null;
  financial_score?: number | null;
  interpersonal_score?: number | null;
  leisure_score?: number | null;
  total_score?: number | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}
export type FastResponseInsert = Omit<FastResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'autonomy_score' | 'occupational_score' | 'cognitive_score' | 'financial_score' | 'interpersonal_score' | 'leisure_score' | 'total_score' | 'interpretation'>;

// ============================================================================
// Social Questionnaire
// ============================================================================

export interface SocialResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  marital_status?: string | null;
  education?: string | null;
  professional_status?: string | null;
  first_job_age?: string | null;
  longest_work_period?: number | null;
  total_work_duration?: number | null;
  housing_type?: string | null;
  living_mode?: string | null;
  household_size?: number | null;
  main_companion?: string | null;
  protection_measures?: string | null;
  current_work_leave?: string | null;
  past_year_work_leave?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SocialResponseInsert = Omit<SocialResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ===== Tobacco Assessment Response =====
export interface TobaccoResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  smoking_status: 'non_smoker' | 'current_smoker' | 'ex_smoker' | 'unknown';
  pack_years?: number | null;
  smoking_start_age?: string | null;
  smoking_end_age?: string | null;
  has_substitution?: 'yes' | 'no' | null; // Changed from boolean to string to match UI
  substitution_methods?: string[] | null; // Array of substitution method codes
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type TobaccoResponseInsert = Omit<TobaccoResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ===== Fagerstrom Test for Nicotine Dependence =====
export interface FagerstromResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1: number; // Time to first cigarette (0-3)
  q2: number; // Difficult to refrain (0-1)
  q3: number; // Which cigarette hardest to give up (0-1)
  q4: number; // Cigarettes per day (0-3)
  q5: number; // Smoke more in morning (0-1)
  q6: number; // Smoke when ill (0-1)
  total_score?: number;
  dependence_level?: string | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type FagerstromResponseInsert = Omit<FagerstromResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score'>;

// ===== Physical Parameters Response =====
export interface PhysicalParamsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  height_cm?: number | null;
  weight_kg?: number | null;
  bmi?: number | null; // Auto-calculated
  abdominal_circumference_cm?: number | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type PhysicalParamsResponseInsert = Omit<PhysicalParamsResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'bmi'>;

// ===== Blood Pressure & Heart Rate Response =====
export interface BloodPressureResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  bp_lying_systolic?: number | null;
  bp_lying_diastolic?: number | null;
  tension_lying?: string | null; // Format: "systolic/diastolic"
  heart_rate_lying?: number | null;
  bp_standing_systolic?: number | null;
  bp_standing_diastolic?: number | null;
  tension_standing?: string | null; // Format: "systolic/diastolic"
  heart_rate_standing?: number | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BloodPressureResponseInsert = Omit<BloodPressureResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ===== Sleep Apnea (STOP-Bang) Response =====
export interface SleepApneaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  diagnosed_sleep_apnea: 'yes' | 'no' | 'unknown';
  has_cpap_device?: boolean | null;
  snoring?: boolean | null;
  tiredness?: boolean | null;
  observed_apnea?: boolean | null;
  hypertension?: boolean | null;
  bmi_over_35?: boolean | null;
  age_over_50?: boolean | null;
  large_neck?: boolean | null;
  male_gender?: boolean | null;
  stop_bang_score?: number | null;
  risk_level?: string | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

// ===== Sleep Apnea Response =====
export interface SleepApneaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  diagnosed_sleep_apnea: 'yes' | 'no' | 'unknown';
  has_cpap_device?: boolean | null;
  snoring?: boolean | null;
  tiredness?: boolean | null;
  observed_apnea?: boolean | null;
  high_blood_pressure?: boolean | null;
  bmi_over_35?: boolean | null;
  age_over_50?: boolean | null;
  large_neck_circumference?: boolean | null;
  male_gender?: boolean | null;
  stopbang_score?: number | null;
  risk_level?: string | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SleepApneaResponseInsert = Omit<SleepApneaResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'stopbang_score' | 'risk_level' | 'interpretation'>;

// ===== Biological Assessment (Bilan biologique) Response =====
export interface BiologicalAssessmentResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Date and Location
  collection_date?: string | null;
  collection_location?: 'sur_site' | 'hors_site' | null;
  
  // Control Questions
  on_neuroleptics?: boolean | null;
  woman_childbearing_age?: boolean | null;
  
  // Biochimie
  sodium?: number | null;
  potassium?: number | null;
  chlore?: number | null;
  bicarbonates?: number | null;
  protidemie?: number | null;
  albumine?: number | null;
  uree?: number | null;
  acide_urique?: number | null;
  creatinine?: number | null;
  clairance_creatinine?: number | null; // Computed
  phosphore?: number | null;
  fer?: number | null;
  ferritine?: number | null;
  calcemie?: number | null;
  crp?: number | null; // mg/L (0-50)
  glycemie_a_jeun?: number | null; // 0-50
  glycemie_a_jeun_unit?: 'mmol_L' | 'g_L' | null;
  hemoglobine_glyquee?: number | null; // % (0-50)
  
  // Bilan Lipidique
  hdl?: number | null;
  hdl_unit?: 'mmol_L' | 'g_L' | null;
  ldl?: number | null;
  ldl_unit?: 'mmol_L' | 'g_L' | null;
  cholesterol_total?: number | null;
  triglycerides?: number | null;
  rapport_total_hdl?: number | null; // Computed: cholesterol_total / hdl
  
  // Bilan Hépatique
  pal?: number | null;
  asat?: number | null;
  alat?: number | null;
  bilirubine_totale?: number | null;
  bilirubine_totale_unit?: 'umol_L' | 'mmol_L' | 'mg_L' | null;
  ggt?: number | null;
  
  // Bilan Thyroïdien
  tsh?: number | null;
  tsh_unit?: 'pmol_L' | 'uUI_mL' | 'mUI_L' | null;
  t3_libre?: number | null;
  t4_libre?: number | null;
  
  // NFS
  leucocytes?: number | null;
  hematies?: number | null;
  hemoglobine?: number | null;
  hemoglobine_unit?: 'g_dL' | 'mmol_L' | null;
  hematocrite?: number | null;
  hematocrite_unit?: 'percent' | 'L_L' | null;
  neutrophiles?: number | null;
  basophiles?: number | null;
  eosinophiles?: number | null;
  lymphocytes?: number | null;
  monocytes?: number | null;
  vgm?: number | null;
  tcmh?: number | null;
  tcmh_unit?: 'pg' | 'percent' | null;
  ccmh?: number | null;
  ccmh_unit?: 'percent' | 'g_dL' | 'g_L' | null;
  plaquettes?: number | null;
  
  // bHCG & Prolactine
  beta_hcg?: number | null;
  dosage_bhcg?: number | null;
  prolactine?: number | null;
  prolactine_unit?: 'mg_L' | 'uIU_mL' | 'ng_mL' | 'ug_L' | null;
  
  // Dosage Psychotropes
  treatment_taken_morning?: boolean | null;
  clozapine?: number | null;
  teralithe_type?: '250' | 'LP400' | null;
  lithium_plasma?: number | null;
  lithium_erythrocyte?: number | null;
  valproic_acid?: number | null;
  carbamazepine?: number | null;
  oxcarbazepine?: number | null;
  lamotrigine?: number | null;
  
  // Vitamine D
  vitamin_d_level?: number | null;
  outdoor_time?: 'less_than_1h_per_week' | 'less_than_1h_per_day_several_hours_per_week' | 'at_least_1h_per_day' | 'more_than_4h_per_day' | null;
  skin_phototype?: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | null;
  vitamin_d_supplementation?: boolean | null;
  vitamin_d_product_name?: 'sterogyl' | 'dedrogyl' | 'uvedose' | 'zymaduo' | 'uvesterol' | 'zymad' | 'autre' | null;
  vitamin_d_supplementation_date?: string | null;
  vitamin_d_supplementation_mode?: 'ampoule' | 'gouttes' | null;
  vitamin_d_supplementation_dose?: string | null;
  
  // Sérologie Toxoplasmose
  toxo_serology_done?: boolean | null;
  toxo_igm_positive?: boolean | null;
  toxo_igg_positive?: boolean | null;
  toxo_igg_value?: number | null;
  toxo_pcr_done?: boolean | null;
  toxo_pcr_positive?: boolean | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BiologicalAssessmentResponseInsert = Omit<BiologicalAssessmentResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'clairance_creatinine'>;

// ===== ECG (Electrocardiogramme) Response =====
export interface EcgResponse {
  id: string;
  visit_id: string;
  patient_id: string;

  // ECG performed
  ecg_performed: 'yes' | 'no';

  // Measurements
  heart_rate?: number | null; // bpm
  qt_measured?: number | null; // in seconds
  rr_measured?: number | null; // in seconds
  qtc_calculated?: number | null; // calculated QTc

  // Follow-up
  ecg_sent_to_cardiologist?: 'yes' | 'no' | null;
  cardiologist_consultation_requested?: 'yes' | 'no' | null;

  // Cardiologist details
  cardiologist_name?: string | null;
  cardiologist_city?: string | null;

  // Interpretation and alerts
  interpretation?: string | null;
  alert_message?: string | null;

  // Metadata
  completed_by?: string | null;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export type EcgResponseInsert = Omit<EcgResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// DSM5 - Mood Disorders (Troubles de l'humeur)
// ============================================================================

export interface Dsm5HumeurResponse {
  id: string;
  visit_id: string;
  patient_id: string;

  // Section 1: Mood Disorder Presence and Type
  has_mood_disorder?: 'oui' | 'non' | 'ne_sais_pas' | null;
  disorder_type?: 'bipolaire_type_1' | 'bipolaire_type_2' | 'bipolaire_non_specifie' |
    'trouble_depressif_majeur' | 'trouble_depressif_majeur_isole' | 'trouble_depressif_majeur_recurrent' |
    'trouble_dysthymique' | 'trouble_cyclothymique' | 'trouble_depressif_non_specifie' |
    'trouble_humeur_affection_medicale' | 'trouble_humeur_induit_substance' | 'autre' | null;
  disorder_type_autre?: string | null;
  
  // Major Depression subtype
  major_depression_type?: 'isole' | 'recurrent' | null;
  
  // Dysthymic subtype
  dysthymic_type?: 'precoce' | 'tardif' | null;

  // Medical condition
  medical_condition_affection_type?: 'endocrinienne' | 'neurologique' | 'cardio_vasculaire' | 'autre' | null;
  medical_condition_affection_autre?: string | null;
  medical_condition_trouble_type?: 'episode_allure_depression_majeure' | 'episode_caracteristiques_depressives' |
    'episode_caracteristiques_maniaques' | 'episode_caracteristiques_mixtes' | 'ne_sais_pas' | null;

  // Substance-induced
  substance_types?: string[] | null; // Array of substance types (legacy)
  substance_type?: string | null; // Single substance type
  substance_autre?: string | null;
  substance_trouble_type?: 'episode_allure_depression_majeure' | 'episode_caracteristiques_depressives' |
    'episode_caracteristiques_maniaques' | 'episode_caracteristiques_mixtes' | 'ne_sais_pas' | null;
    
  // Unspecified depression subtype
  unspecified_depression_type?: 'post_psychotique_schizophrenie' | 'majeur_surajout_psychotique' |
    'dysphorique_premenstruel' | 'mineur' | 'bref_recurrent' | 'autre' | 'ne_sais_pas' | null;

  // Section 2: First Episode Characteristics
  first_episode_type?: 'edm_sans_psychotiques' | 'edm_avec_psychotiques' | 'hypomanie' |
    'manie_sans_psychotiques' | 'manie_avec_psychotiques' | 'ne_sais_pas' | null;
  postpartum_first?: 'oui' | 'non' | 'ne_sais_pas' | null;
  initial_cyclothymic_period?: 'oui' | 'non' | 'ne_sais_pas' | null;

  // Section 3: Lifetime Characteristics
  // 3.1 Major depressive episodes
  num_edm?: number | null;
  age_first_edm?: number | null;
  edm_with_psychotic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  num_edm_psychotic?: number | null;
  edm_with_mixed?: 'oui' | 'non' | 'ne_sais_pas' | null;
  num_edm_mixed?: number | null;

  // 3.2 Hypomanic episodes
  num_hypomanic?: number | null;
  age_first_hypomanic?: number | string | null;
  age_first_hypomanic_text?: string | null;

  // 3.3 Manic episodes
  num_manic?: number | null;
  age_first_manic?: number | string | null;
  age_first_manic_text?: string | null;
  manic_with_psychotic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  num_manic_psychotic?: number | null;
  manic_with_mixed?: 'oui' | 'non' | 'ne_sais_pas' | null;
  num_manic_mixed?: number | null;
  induced_episodes?: 'oui' | 'non' | 'ne_sais_pas' | null;
  num_induced_episodes?: number | null;
  rapid_cycling?: 'oui' | 'non' | 'ne_sais_pas' | null;
  complete_remission?: 'oui' | 'non' | 'ne_sais_pas' | null;
  seasonal_pattern?: 'oui' | 'non' | 'ne_sais_pas' | null;
  seasonal_types?: string[] | null; // Array of seasonal patterns (legacy)
  seasonal_depression?: 'oui' | 'non' | 'ne_sais_pas' | null;
  seasonal_depression_season?: 'printemps' | 'ete' | 'automne' | 'hiver' | null;
  seasonal_hypomania?: 'oui' | 'non' | 'ne_sais_pas' | null;
  seasonal_hypomania_season?: 'printemps' | 'ete' | 'automne' | 'hiver' | null;

  age_first_psychotrope?: number | null;
  age_first_thymoregulator?: number | null;
  age_first_hospitalization?: number | null;
  number_of_hospitalizations?: number | null;
  total_hospitalization_duration_months?: number | null;
  total_hospitalization_duration_text?: string | null;

  // 3.4 12-month characteristics
  past_year_episode?: 'oui' | 'non' | 'ne_sais_pas' | null;
  past_year_num_edm?: number | null;
  past_year_edm_psychotic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  past_year_num_edm_psychotic?: number | null;
  past_year_edm_mixed?: 'oui' | 'non' | 'ne_sais_pas' | null;
  past_year_num_edm_mixed?: number | null;
  past_year_num_hypomanic?: number | null;
  past_year_num_manic?: number | null;
  past_year_manic_psychotic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  past_year_num_manic_psychotic?: number | null;
  past_year_manic_mixed?: 'oui' | 'non' | 'ne_sais_pas' | null;
  past_year_num_manic_mixed?: number | null;
  past_year_num_hospitalizations?: number | null;
  past_year_hospitalization_weeks?: number | null;
  past_year_hospitalization_weeks_text?: string | null;

  // Work leave subsection
  past_year_work_leave?: 'oui' | 'non' | 'non_applicable' | null;
  past_year_num_work_leaves?: number | null;
  past_year_work_leave_weeks?: number | null;
  past_year_work_leave_weeks_text?: string | null;

  // Section 4: Most Recent Episode
  recent_episode_start_date?: string | null;
  recent_episode_start_date_text?: string | null;
  recent_episode_end_date?: string | null;
  recent_episode_end_date_text?: string | null;
  recent_episode_type?: 'edm' | 'hypomanie' | 'manie' | 'non_specifie' | 'ne_sais_pas' | null;

  // Unified recent episode fields
  recent_episode_catatonic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  recent_episode_severity?: 'leger' | 'modere' | 'severe_sans_psychotiques' |
    'severe_psychotiques_non_congruentes' | 'severe_psychotiques_congruentes' | null;
  recent_episode_postpartum?: 'oui' | 'non' | 'ne_sais_pas' | null;

  // EDM specific
  recent_edm_subtypes?: string[] | null; // Array of subtypes (legacy)
  recent_edm_subtype?: 'sans_caracteristique' | 'melancolique' | 'atypique' | 'catatonique' | 'mixte' | null;
  recent_edm_severity?: 'leger' | 'modere' | 'severe_sans_psychotiques' |
    'severe_psychotiques_non_congruentes' | 'severe_psychotiques_congruentes' | null;
  recent_edm_chronic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  recent_edm_postpartum?: 'oui' | 'non' | 'ne_sais_pas' | null;

  // Hypomanie specific
  recent_hypomanie_postpartum?: 'oui' | 'non' | 'ne_sais_pas' | null;

  // Manie specific
  recent_manie_catatonic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  recent_manie_mixed?: 'oui' | 'non' | 'ne_sais_pas' | null;
  recent_manie_severity?: 'leger' | 'modere' | 'severe_sans_psychotiques' | 
    'severe_psychotiques_non_congruentes' | 'severe_psychotiques_congruentes' | null;
  recent_manie_postpartum?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  // Non-specified episode
  recent_non_specifie_catatonic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  recent_non_specifie_severity?: 'leger' | 'modere' | 'severe_sans_psychotiques' | 
    'severe_psychotiques_non_congruentes' | 'severe_psychotiques_congruentes' | null;
  recent_non_specifie_postpartum?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  // Section 5: Current Episode
  current_episode_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  current_episode_type?: 'edm' | 'hypomanie' | 'manie' | 'hypomaniaque' | 'maniaque' | 'non_specifie' | 'ne_sais_pas' | null;
  
  // Unified current episode fields
  current_episode_catatonic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  current_episode_severity?: 'leger' | 'modere' | 'severe_sans_psychotique' | 'severe_sans_psychotiques' |
    'severe_psychotiques_non_congruentes' | 'severe_psychotiques_congruentes' | null;
  current_episode_postpartum?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  // EDM specific
  current_edm_subtypes?: string[] | null; // Array of subtypes (legacy)
  current_edm_subtype?: 'sans_caracteristique' | 'melancolique' | 'atypique' | 'catatonique' | 'mixte' | null;
  current_edm_severity?: 'leger' | 'modere' | 'severe_sans_psychotiques' | 
    'severe_psychotiques_non_congruentes' | 'severe_psychotiques_congruentes' | null;
  current_edm_chronic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  current_edm_postpartum?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  // Hypomanie specific
  current_hypomanie_postpartum?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  // Manie specific
  current_manie_catatonic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  current_manie_mixed?: 'oui' | 'non' | 'ne_sais_pas' | null;
  current_manie_mixed_text?: string | null;
  current_manie_severity?: 'leger' | 'modere' | 'severe_sans_psychotiques' | 
    'severe_psychotiques_non_congruentes' | 'severe_psychotiques_congruentes' | null;
  current_manie_postpartum?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  // Non-specified episode
  current_non_specifie_catatonic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  current_non_specifie_severity?: 'leger' | 'modere' | 'severe_sans_psychotiques' | 
    'severe_psychotiques_non_congruentes' | 'severe_psychotiques_congruentes' | null;
  current_non_specifie_postpartum?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Dsm5HumeurResponseInsert = Omit<Dsm5HumeurResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// DSM5 - Psychotic Disorders (Trouble Psychotique)
// ============================================================================

export interface Dsm5PsychoticResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  has_psychotic_disorder?: 'oui' | 'non' | 'ne_sais_pas' | null;
  psychotic_disorder_date?: string | null;
  disorder_type?: 'schizophrenie' | 'trouble_schizophreniforme' | 'trouble_schizo_affectif' | 
    'troubles_delirants' | 'trouble_psychotique_bref' | 'trouble_psychotique_partage' | 
    'trouble_psychotique_affection_medicale' | 'trouble_psychotique_substance' | 
    'trouble_psychotique_non_specifie' | null;
  symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Dsm5PsychoticResponseInsert = Omit<Dsm5PsychoticResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// DSM5 - Comorbid Disorders (Troubles comorbides)
// ============================================================================

export interface Dsm5ComorbidResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Section 1: Anxiety Disorders
  has_anxiety_disorder?: 'oui' | 'non' | 'ne_sais_pas' | null;
  panic_disorder_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  panic_disorder_type?: 'sans_agoraphobie' | 'avec_agoraphobie' | null;
  panic_disorder_age_debut?: number | null;
  panic_disorder_symptoms_past_month?: 'oui' | 'non' | null;
  agoraphobia_no_panic_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  agoraphobia_no_panic_age_debut?: number | null;
  agoraphobia_no_panic_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  social_phobia_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  social_phobia_age_debut?: number | null;
  social_phobia_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  specific_phobia_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  specific_phobia_age_debut?: number | null;
  specific_phobia_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  ocd_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  ocd_age_debut?: number | null;
  ocd_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  ptsd_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  ptsd_age_debut?: number | null;
  ptsd_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  gad_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  gad_age_debut?: number | null;
  gad_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  anxiety_medical_condition_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  anxiety_medical_condition_affection?: string | null;
  anxiety_medical_condition_age_debut?: number | null;
  anxiety_medical_condition_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  anxiety_substance_induced_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  anxiety_substance_induced_substance?: string | null;
  anxiety_substance_induced_age_debut?: number | null;
  anxiety_substance_induced_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  anxiety_unspecified_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  anxiety_unspecified_age_debut?: number | null;
  anxiety_unspecified_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  // Section 2: Substance-Related Disorders
  has_substance_disorder?: 'oui' | 'non' | 'ne_sais_pas' | null;
  alcohol_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  alcohol_type?: 'abus' | 'dependance' | null;
  alcohol_age_debut?: number | null;
  alcohol_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  alcohol_duration_months?: number | null;
  sedatives_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sedatives_type?: 'abus' | 'dependance' | null;
  sedatives_age_debut?: number | null;
  sedatives_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sedatives_duration_months?: number | null;
  cannabis_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  cannabis_type?: 'abus' | 'dependance' | null;
  cannabis_age_debut?: number | null;
  cannabis_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  cannabis_duration_months?: number | null;
  stimulants_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  stimulants_type?: 'abus' | 'dependance' | null;
  stimulants_age_debut?: number | null;
  stimulants_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  stimulants_duration_months?: number | null;
  opiates_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  opiates_type?: 'abus' | 'dependance' | null;
  opiates_age_debut?: number | null;
  opiates_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  opiates_duration_months?: number | null;
  cocaine_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  cocaine_type?: 'abus' | 'dependance' | null;
  cocaine_age_debut?: number | null;
  cocaine_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  cocaine_duration_months?: number | null;
  hallucinogens_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  hallucinogens_type?: 'abus' | 'dependance' | null;
  hallucinogens_age_debut?: number | null;
  hallucinogens_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  hallucinogens_duration_months?: number | null;
  other_substance_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  other_substance_name?: string | null;
  other_substance_type?: 'abus' | 'dependance' | null;
  other_substance_age_debut?: number | null;
  other_substance_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  other_substance_duration_months?: number | null;
  induced_disorder_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  induced_substances?: string[] | null;
  induced_disorder_type?: 'delirium' | 'demence_persistante' | 'trouble_amnesique' | 
    'trouble_psychotique' | 'trouble_humeur' | 'trouble_anxieux' | 'trouble_sommeil' | 
    'trouble_perceptions_hallucinogenes' | null;
  induced_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  // Section 3: Eating Disorders
  has_eating_disorder?: 'oui' | 'non' | 'ne_sais_pas' | null;
  eating_disorder_type?: 'anorexia_restrictive' | 'anorexia_bulimic' | 'bulimia' | 'binge_eating' | 'eating_unspecified' | 'night_eating' | null;
  anorexia_restrictive_amenorrhea?: 'oui' | 'non' | null;
  anorexia_restrictive_age_debut?: number | null;
  anorexia_restrictive_age_fin?: number | null;
  anorexia_restrictive_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  anorexia_restrictive_current?: 'oui' | 'non' | null;
  anorexia_bulimic_amenorrhea?: 'oui' | 'non' | null;
  anorexia_bulimic_age_debut?: number | null;
  anorexia_bulimic_age_fin?: number | null;
  anorexia_bulimic_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  anorexia_bulimic_current?: 'oui' | 'non' | null;
  bulimia_age_debut?: number | null;
  bulimia_age_fin?: number | null;
  bulimia_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  bulimia_current?: 'oui' | 'non' | null;
  binge_eating_age_debut?: number | null;
  binge_eating_age_fin?: number | null;
  binge_eating_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  binge_eating_current?: 'oui' | 'non' | null;
  eating_unspecified_age_debut?: number | null;
  eating_unspecified_age_fin?: number | null;
  eating_unspecified_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  eating_unspecified_current?: 'oui' | 'non' | null;
  night_eating_age_debut?: number | null;
  night_eating_age_fin?: number | null;
  night_eating_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  night_eating_current?: 'oui' | 'non' | null;
  
  // Section 4: Somatoform Disorder
  has_somatoform_disorder?: 'oui' | 'non' | 'ne_sais_pas' | null;
  somatoform_type?: 'trouble_somatisation' | 'trouble_douloureux' | 'trouble_indifferencie' | 
    'hypocondrie' | 'peur_dysmorphie_corporelle' | null;
  somatoform_age_debut?: number | null;
  somatoform_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  // Section 5: ADHD Evaluation (DIVA assessment moved to Medical Evaluation section)
  diva_evaluated?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Dsm5ComorbidResponseInsert = Omit<Dsm5ComorbidResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// DIVA 2.0 - Diagnostic Interview for ADHD in Adults
// ============================================================================

export interface DivaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Criterion A - Inattention (A1a to A1i)
  a1a_adult?: 'oui' | 'non' | null;
  a1a_childhood?: 'oui' | 'non' | null;
  a1b_adult?: 'oui' | 'non' | null;
  a1b_childhood?: 'oui' | 'non' | null;
  a1c_adult?: 'oui' | 'non' | null;
  a1c_childhood?: 'oui' | 'non' | null;
  a1d_adult?: 'oui' | 'non' | null;
  a1d_childhood?: 'oui' | 'non' | null;
  a1e_adult?: 'oui' | 'non' | null;
  a1e_childhood?: 'oui' | 'non' | null;
  a1f_adult?: 'oui' | 'non' | null;
  a1f_childhood?: 'oui' | 'non' | null;
  a1g_adult?: 'oui' | 'non' | null;
  a1g_childhood?: 'oui' | 'non' | null;
  a1h_adult?: 'oui' | 'non' | null;
  a1h_childhood?: 'oui' | 'non' | null;
  a1i_adult?: 'oui' | 'non' | null;
  a1i_childhood?: 'oui' | 'non' | null;
  
  // Total inattention scores
  total_inattention_adult?: number | null;
  total_inattention_childhood?: number | null;
  
  // Criterion A - Hyperactivity/Impulsivity (A2a to A2i)
  a2a_adult?: 'oui' | 'non' | null;
  a2a_childhood?: 'oui' | 'non' | null;
  a2b_adult?: 'oui' | 'non' | null;
  a2b_childhood?: 'oui' | 'non' | null;
  a2c_adult?: 'oui' | 'non' | null;
  a2c_childhood?: 'oui' | 'non' | null;
  a2d_adult?: 'oui' | 'non' | null;
  a2d_childhood?: 'oui' | 'non' | null;
  a2e_adult?: 'oui' | 'non' | null;
  a2e_childhood?: 'oui' | 'non' | null;
  a2f_adult?: 'oui' | 'non' | null;
  a2f_childhood?: 'oui' | 'non' | null;
  a2g_adult?: 'oui' | 'non' | null;
  a2g_childhood?: 'oui' | 'non' | null;
  a2h_adult?: 'oui' | 'non' | null;
  a2h_childhood?: 'oui' | 'non' | null;
  a2i_adult?: 'oui' | 'non' | null;
  a2i_childhood?: 'oui' | 'non' | null;
  
  // Total hyperactivity/impulsivity scores
  total_hyperactivity_adult?: number | null;
  total_hyperactivity_childhood?: number | null;
  
  // Scoring - Childhood
  criteria_a_inattention_child_gte6?: 'oui' | 'non' | null;
  criteria_hi_hyperactivity_child_gte6?: 'oui' | 'non' | null;
  
  // Scoring - Adult
  criteria_a_inattention_adult_gte6?: 'oui' | 'non' | null;
  criteria_hi_hyperactivity_adult_gte6?: 'oui' | 'non' | null;
  
  // General Criteria
  criteria_b_lifetime_persistence?: 'oui' | 'non' | null;
  criteria_cd_impairment_childhood?: 'oui' | 'non' | null;
  criteria_cd_impairment_adult?: 'oui' | 'non' | null;
  criteria_e_better_explained?: 'oui' | 'non' | null;
  criteria_e_explanation?: string | null;
  
  // Collateral Information
  collateral_parents?: number | null;
  collateral_partner?: number | null;
  collateral_school_reports?: number | null;
  
  // Final Diagnosis
  final_diagnosis?: 'non' | 'combine' | 'inattentif' | 'hyperactif' | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type DivaResponseInsert = Omit<DivaResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// FAMILY HISTORY (Antécédents Familiaux)
// Section 1 - Enfants (Children Only)
// ============================================================================

export interface FamilyHistoryResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Daughters (Filles)
  num_daughters?: string | null; // '0', '1', '2', '3', '4', '5', '>5'
  num_daughters_with_issues?: number | null; // 0-5
  
  daughter1_dob?: string | null;
  daughter1_has_issues?: boolean | null;
  daughter1_deceased?: 'oui' | 'non' | null;
  daughter1_death_date?: string | null;
  daughter1_death_cause?: string | null;
  daughter1_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  daughter1_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  daughter1_substance?: string[] | null;
  daughter1_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  daughter1_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  daughter1_cardio?: string[] | null;
  
  daughter2_dob?: string | null;
  daughter2_has_issues?: boolean | null;
  daughter2_deceased?: 'oui' | 'non' | null;
  daughter2_death_date?: string | null;
  daughter2_death_cause?: string | null;
  daughter2_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  daughter2_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  daughter2_substance?: string[] | null;
  daughter2_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  daughter2_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  daughter2_cardio?: string[] | null;
  
  daughter3_dob?: string | null;
  daughter3_has_issues?: boolean | null;
  daughter3_deceased?: 'oui' | 'non' | null;
  daughter3_death_date?: string | null;
  daughter3_death_cause?: string | null;
  daughter3_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  daughter3_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  daughter3_substance?: string[] | null;
  daughter3_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  daughter3_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  daughter3_cardio?: string[] | null;
  
  daughter4_dob?: string | null;
  daughter4_has_issues?: boolean | null;
  daughter4_deceased?: 'oui' | 'non' | null;
  daughter4_death_date?: string | null;
  daughter4_death_cause?: string | null;
  daughter4_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  daughter4_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  daughter4_substance?: string[] | null;
  daughter4_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  daughter4_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  daughter4_cardio?: string[] | null;
  
  daughter5_dob?: string | null;
  daughter5_has_issues?: boolean | null;
  daughter5_deceased?: 'oui' | 'non' | null;
  daughter5_death_date?: string | null;
  daughter5_death_cause?: string | null;
  daughter5_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  daughter5_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  daughter5_substance?: string[] | null;
  daughter5_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  daughter5_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  daughter5_cardio?: string[] | null;
  
  // Sons (Fils)
  num_sons?: string | null; // '0', '1', '2', '3', '4', '5', '>5'
  num_sons_with_issues?: number | null; // 0-5
  
  son1_dob?: string | null;
  son1_has_issues?: boolean | null;
  son1_deceased?: 'oui' | 'non' | null;
  son1_death_date?: string | null;
  son1_death_cause?: string | null;
  son1_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  son1_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  son1_substance?: string[] | null;
  son1_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  son1_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  son1_cardio?: string[] | null;
  
  son2_dob?: string | null;
  son2_has_issues?: boolean | null;
  son2_deceased?: 'oui' | 'non' | null;
  son2_death_date?: string | null;
  son2_death_cause?: string | null;
  son2_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  son2_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  son2_substance?: string[] | null;
  son2_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  son2_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  son2_cardio?: string[] | null;
  
  son3_dob?: string | null;
  son3_has_issues?: boolean | null;
  son3_deceased?: 'oui' | 'non' | null;
  son3_death_date?: string | null;
  son3_death_cause?: string | null;
  son3_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  son3_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  son3_substance?: string[] | null;
  son3_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  son3_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  son3_cardio?: string[] | null;
  
  son4_dob?: string | null;
  son4_has_issues?: boolean | null;
  son4_deceased?: 'oui' | 'non' | null;
  son4_death_date?: string | null;
  son4_death_cause?: string | null;
  son4_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  son4_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  son4_substance?: string[] | null;
  son4_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  son4_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  son4_cardio?: string[] | null;
  
  son5_dob?: string | null;
  son5_has_issues?: boolean | null;
  son5_deceased?: 'oui' | 'non' | null;
  son5_death_date?: string | null;
  son5_death_cause?: string | null;
  son5_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  son5_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  son5_substance?: string[] | null;
  son5_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  son5_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  son5_cardio?: string[] | null;
  
  // Sisters (Soeurs)
  num_sisters?: string | null; // '0', '1', '2', '3', '4', '5', '>5'
  num_sisters_with_issues?: number | null; // 0-5
  
  sister1_dob?: string | null;
  sister1_has_issues?: boolean | null;
  sister1_deceased?: 'oui' | 'non' | null;
  sister1_death_date?: string | null;
  sister1_death_cause?: string | null;
  sister1_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  sister1_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  sister1_substance?: string[] | null;
  sister1_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sister1_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sister1_cardio?: string[] | null;
  
  sister2_dob?: string | null;
  sister2_has_issues?: boolean | null;
  sister2_deceased?: 'oui' | 'non' | null;
  sister2_death_date?: string | null;
  sister2_death_cause?: string | null;
  sister2_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  sister2_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  sister2_substance?: string[] | null;
  sister2_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sister2_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sister2_cardio?: string[] | null;
  
  sister3_dob?: string | null;
  sister3_has_issues?: boolean | null;
  sister3_deceased?: 'oui' | 'non' | null;
  sister3_death_date?: string | null;
  sister3_death_cause?: string | null;
  sister3_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  sister3_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  sister3_substance?: string[] | null;
  sister3_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sister3_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sister3_cardio?: string[] | null;
  
  sister4_dob?: string | null;
  sister4_has_issues?: boolean | null;
  sister4_deceased?: 'oui' | 'non' | null;
  sister4_death_date?: string | null;
  sister4_death_cause?: string | null;
  sister4_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  sister4_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  sister4_substance?: string[] | null;
  sister4_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sister4_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sister4_cardio?: string[] | null;
  
  sister5_dob?: string | null;
  sister5_has_issues?: boolean | null;
  sister5_deceased?: 'oui' | 'non' | null;
  sister5_death_date?: string | null;
  sister5_death_cause?: string | null;
  sister5_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  sister5_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  sister5_substance?: string[] | null;
  sister5_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sister5_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sister5_cardio?: string[] | null;
  
  // Brothers (Frères)
  num_brothers?: string | null; // '0', '1', '2', '3', '4', '5', '>5'
  num_brothers_with_issues?: number | null; // 0-5
  
  brother1_dob?: string | null;
  brother1_has_issues?: boolean | null;
  brother1_deceased?: 'oui' | 'non' | null;
  brother1_death_date?: string | null;
  brother1_death_cause?: string | null;
  brother1_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  brother1_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  brother1_substance?: string[] | null;
  brother1_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  brother1_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  brother1_cardio?: string[] | null;
  
  brother2_dob?: string | null;
  brother2_has_issues?: boolean | null;
  brother2_deceased?: 'oui' | 'non' | null;
  brother2_death_date?: string | null;
  brother2_death_cause?: string | null;
  brother2_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  brother2_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  brother2_substance?: string[] | null;
  brother2_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  brother2_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  brother2_cardio?: string[] | null;
  
  brother3_dob?: string | null;
  brother3_has_issues?: boolean | null;
  brother3_deceased?: 'oui' | 'non' | null;
  brother3_death_date?: string | null;
  brother3_death_cause?: string | null;
  brother3_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  brother3_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  brother3_substance?: string[] | null;
  brother3_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  brother3_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  brother3_cardio?: string[] | null;
  
  brother4_dob?: string | null;
  brother4_has_issues?: boolean | null;
  brother4_deceased?: 'oui' | 'non' | null;
  brother4_death_date?: string | null;
  brother4_death_cause?: string | null;
  brother4_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  brother4_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  brother4_substance?: string[] | null;
  brother4_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  brother4_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  brother4_cardio?: string[] | null;
  
  brother5_dob?: string | null;
  brother5_has_issues?: boolean | null;
  brother5_deceased?: 'oui' | 'non' | null;
  brother5_death_date?: string | null;
  brother5_death_cause?: string | null;
  brother5_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  brother5_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  brother5_substance?: string[] | null;
  brother5_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  brother5_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  brother5_cardio?: string[] | null;
  
  // Parents (Mère et Père)
  mother_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  mother_deceased?: 'oui' | 'non' | null;
  mother_death_cause?: string | null;
  mother_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  mother_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  mother_substance?: string[] | null;
  mother_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  mother_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  mother_cardio?: string[] | null;
  
  father_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  father_deceased?: 'oui' | 'non' | null;
  father_death_cause?: string | null;
  father_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  father_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  father_substance?: string[] | null;
  father_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  father_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  father_cardio?: string[] | null;
  
  // Grandparents (Grands-Parents)
  grandmother_maternal_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  grandmother_maternal_deceased?: 'oui' | 'non' | null;
  grandmother_maternal_death_cause?: string | null;
  grandmother_maternal_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  grandmother_maternal_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  grandmother_maternal_substance?: string[] | null;
  grandmother_maternal_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  grandmother_maternal_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  grandmother_maternal_cardio?: string[] | null;
  
  grandfather_maternal_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  grandfather_maternal_deceased?: 'oui' | 'non' | null;
  grandfather_maternal_death_cause?: string | null;
  grandfather_maternal_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  grandfather_maternal_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  grandfather_maternal_substance?: string[] | null;
  grandfather_maternal_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  grandfather_maternal_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  grandfather_maternal_cardio?: string[] | null;
  
  grandmother_paternal_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  grandmother_paternal_deceased?: 'oui' | 'non' | null;
  grandmother_paternal_death_cause?: string | null;
  grandmother_paternal_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  grandmother_paternal_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  grandmother_paternal_substance?: string[] | null;
  grandmother_paternal_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  grandmother_paternal_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  grandmother_paternal_cardio?: string[] | null;
  
  grandfather_paternal_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  grandfather_paternal_deceased?: 'oui' | 'non' | null;
  grandfather_paternal_death_cause?: string | null;
  grandfather_paternal_psychiatric?: 'aucun' | 'edm_unipolaire' | 'bipolaire' | 'schizophrene' | 'ne_sais_pas' | null;
  grandfather_paternal_suicide?: 'aucun' | 'tentative' | 'abouti' | 'ne_sais_pas' | null;
  grandfather_paternal_substance?: string[] | null;
  grandfather_paternal_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  grandfather_paternal_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  grandfather_paternal_cardio?: string[] | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type FamilyHistoryResponseInsert = Omit<FamilyHistoryResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// C-SSRS (Columbia-Suicide Severity Rating Scale)
// ============================================================================

export interface CssrsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Suicidal Ideation Questions (0=No, 1=Yes)
  q1_wish_dead?: number | null;
  q2_non_specific?: number | null;
  q3_method_no_intent?: number | null;
  q4_intent_no_plan?: number | null;
  q5_plan_intent?: number | null;
  
  // Intensity of Ideation
  int_most_severe?: number | null; // 1-5
  int_frequency?: number | null; // 1-5
  int_duration?: number | null; // 1-5
  int_control?: number | null; // 0-5
  int_deterrents?: number | null; // 1-5
  int_causes?: number | null; // 0-5
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type CssrsResponseInsert = Omit<CssrsResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ===== ISA (Intentionnalité Suicidaire Actuelle) Response =====
export interface IsaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Question 1: Life not worth living
  q1_life_worth?: number | null; // 0 or 1
  q1_time?: 'last_week' | '2w_12m' | 'more_1y' | null;
  
  // Question 2: Wish to die
  q2_wish_death?: number | null; // 0 or 1
  q2_time?: 'last_week' | '2w_12m' | 'more_1y' | null;
  
  // Question 3: Thoughts of suicide
  q3_thoughts?: number | null; // 0 or 1
  q3_time?: 'last_week' | '2w_12m' | 'more_1y' | null;
  
  // Question 4: Plan/serious consideration
  q4_plan?: number | null; // 0 or 1
  q4_time?: 'last_week' | '2w_12m' | 'more_1y' | null;
  
  // Question 5: Attempt
  q5_attempt?: number | null; // 0 or 1
  q5_time?: 'last_week' | '2w_12m' | 'more_1y' | null;
  
  // Metadata
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type IsaResponseInsert = Omit<IsaResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ===== SIS (Suicide Intent Scale) Response =====
export interface SisResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Section 1: Circumstances of the Act (items 1-8)
  sis_01?: number | null; // Isolation (0-2)
  sis_02?: number | null; // Timing (0-2)
  sis_03?: number | null; // Precautions against discovery (0-2)
  sis_04?: number | null; // Seeking help (0-2)
  sis_05?: number | null; // Final acts (0-2)
  sis_06?: number | null; // Active preparation (0-2)
  sis_07?: number | null; // Notes/letters (0-2)
  sis_08?: number | null; // Communication of intent (0-2)
  
  // Section 2: Subject's Conception (items 9-15)
  sis_09?: number | null; // Alleged purpose (0-2)
  sis_10?: number | null; // Opinion on outcome (0-2)
  sis_11?: number | null; // Conception of lethality (0-2)
  sis_12?: number | null; // Seriousness (0-2)
  sis_13?: number | null; // Attitude toward living/dying (0-2)
  sis_14?: number | null; // Opinion on efficacy of care (0-2)
  sis_15?: number | null; // Degree of premeditation (0-2)
  
  // Scores (computed)
  total_score?: number | null; // 0-30
  circumstances_subscore?: number | null; // 0-16 (items 1-8)
  conception_subscore?: number | null; // 0-14 (items 9-15)
  
  // Metadata
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SisResponseInsert = Omit<SisResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'circumstances_subscore' | 'conception_subscore'>;

// ===== Suicide History (Histoire des conduites suicidaires) Response =====
export interface SuicideHistoryResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Q1: Date of first suicide attempt
  q1_first_attempt_date?: string | null;
  
  // Q2: Number of suicide attempts
  q2_attempt_count?: number | null;
  
  // Q3: Violent suicide attempts (yes/no/unknown)
  q3_violent_attempts?: 'yes' | 'no' | 'unknown' | null;
  
  // Q3.1: Number of violent attempts (conditional on Q3=yes)
  q3_1_violent_count?: number | null;
  
  // Q4: Serious non-violent attempts (yes/no/unknown)
  q4_serious_attempts?: 'yes' | 'no' | 'unknown' | null;
  
  // Q4.1: Number of serious non-violent attempts (conditional on Q4=yes)
  q4_1_serious_count?: number | null;
  
  // Q5: Non-suicidal self-harm behavior (0=No, 1=Yes)
  q5_self_harm?: number | null;
  
  // Q6: Interrupted attempt (0=No, 1=Yes)
  q6_interrupted?: number | null;
  
  // Q6.1: Number of interrupted attempts (conditional on Q6=1)
  q6_1_interrupted_count?: number | null;
  
  // Q7: Aborted attempt (0=No, 1=Yes)
  q7_aborted?: number | null;
  
  // Q7.1: Number of aborted attempts (conditional on Q7=1)
  q7_1_aborted_count?: number | null;
  
  // Q8: Preparations for suicide (0=No, 1=Yes)
  q8_preparations?: number | null;
  
  // Q9: Most recent attempt severity (0-5 scale)
  q9_recent_severity?: number | null;
  
  // Q10: Date of most recent attempt
  q10_recent_date?: string | null;
  
  // Q11: Most lethal attempt severity (0-5 scale)
  q11_lethal_severity?: number | null;
  
  // Q12: Date of most lethal attempt
  q12_lethal_date?: string | null;
  
  // Q13: First attempt severity (0-5 scale)
  q13_first_severity?: number | null;
  
  // Q13.1: First attempt lethality (0-2 scale, conditional on Q13=0)
  q13_1_first_lethality?: number | null;
  
  // Metadata
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SuicideHistoryResponseInsert = Omit<SuicideHistoryResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ===== Suicide Behavior Follow-up (Histoire des conduites suicidaires - Suivi semestriel) Response =====
export interface SuicideBehaviorFollowupResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Q1: Self-harm behavior (0=No, 1=Yes)
  q1_self_harm?: number | null;
  
  // Q2: Interrupted attempt (0=No, 1=Yes)
  q2_interrupted?: number | null;
  q2_1_interrupted_count?: number | null;
  
  // Q3: Aborted attempt (0=No, 1=Yes)
  q3_aborted?: number | null;
  q3_1_aborted_count?: number | null;
  
  // Q4: Preparations (0=No, 1=Yes)
  q4_preparations?: number | null;
  
  // Metadata
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SuicideBehaviorFollowupResponseInsert = Omit<SuicideBehaviorFollowupResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ===== Périnatalité (Perinatal History) Response =====
export interface PerinataliteResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Q1: Mother's age at birth (years)
  q1_mother_age?: number | null;
  
  // Q2: Father's age at birth (years)
  q2_father_age?: number | null;
  
  // Q3: Birth conditions
  q3_birth_condition?: 'premature' | 'term' | 'post_mature' | 'unknown' | null;
  
  // Q4: Gestational age (weeks)
  q4_gestational_age?: number | null;
  
  // Q5: Type of birth
  q5_birth_type?: 'vaginal' | 'cesarean' | 'unknown' | null;
  
  // Q6: Birth weight (grams)
  q6_birth_weight?: number | null;
  
  // Q7: Birth length (cm)
  q7_birth_length?: number | null;
  
  // Q8: Head circumference (cm)
  q8_head_circumference?: number | null;
  
  // Q9: Apgar score at 1 minute
  q9_apgar_1min?: number | null;
  
  // Q10: Apgar score at 5 minutes
  q10_apgar_5min?: number | null;
  
  // Q11: Neonatal hospitalization
  q11_neonatal_hospitalization?: 'yes' | 'no' | 'unknown' | null;
  
  // Metadata
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type PerinataliteResponseInsert = Omit<PerinataliteResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ===== Pathologies Neurologiques (Neurological Conditions) Response =====
export interface PathoNeuroResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // 1. Migraine
  q1_migraine?: 'yes' | 'no' | 'unknown' | null;
  q1_1_migraine_date?: string | null;
  q1_2_migraine_treated?: 'yes' | 'no' | null;
  q1_3_migraine_balanced?: 'yes' | 'no' | null;
  
  // 2. Sclérose en plaques
  q2_sclerose?: 'yes' | 'no' | 'unknown' | null;
  q2_1_sclerose_date?: string | null;
  q2_2_sclerose_treated?: 'yes' | 'no' | null;
  q2_3_sclerose_balanced?: 'yes' | 'no' | null;
  
  // 3. Épilepsie
  q3_epilepsie?: 'yes' | 'no' | 'unknown' | null;
  q3_1_epilepsie_date?: string | null;
  q3_2_epilepsie_treated?: 'yes' | 'no' | null;
  q3_3_epilepsie_balanced?: 'yes' | 'no' | null;
  
  // 4. Méningite
  q4_meningite?: 'yes' | 'no' | 'unknown' | null;
  q4_1_meningite_date?: string | null;
  
  // 5. Traumatisme crânien
  q5_trauma_cranien?: 'yes' | 'no' | 'unknown' | null;
  q5_1_trauma_cranien_date?: string | null;
  
  // 6. AVC
  q6_avc?: 'yes' | 'no' | 'unknown' | null;
  q6_1_avc_date?: string | null;
  
  // 7. Autre maladie neurologique
  q7_autre?: 'yes' | 'no' | 'unknown' | null;
  q7_1_autre_date?: string | null;
  q7_2_autre_specify?: string | null;
  
  // Metadata
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type PathoNeuroResponseInsert = Omit<PathoNeuroResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ===== Pathologies Cardio-vasculaires (Cardiovascular Conditions) Response =====
export interface PathoCardioResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // 1. Hypertension artérielle
  q1_hypertension?: 'yes' | 'no' | 'unknown' | null;
  q1_1_hypertension_date?: string | null;
  q1_2_hypertension_treated?: 'yes' | 'no' | null;
  q1_3_hypertension_balanced?: 'yes' | 'no' | null;
  
  // 2. Maladie coronarienne
  q2_coronary?: 'yes' | 'no' | 'unknown' | null;
  q2_1_coronary_date?: string | null;
  q2_2_coronary_treated?: 'yes' | 'no' | null;
  q2_3_coronary_balanced?: 'yes' | 'no' | null;
  
  // 3. Infarctus du myocarde
  q3_infarctus?: 'yes' | 'no' | 'unknown' | null;
  q3_1_infarctus_date?: string | null;
  
  // 4. Trouble du rythme cardiaque
  q4_rythme?: 'yes' | 'no' | 'unknown' | null;
  q4_1_rythme_date?: string | null;
  q4_2_rythme_treated?: 'yes' | 'no' | null;
  q4_3_rythme_balanced?: 'yes' | 'no' | null;
  
  // 5. Autre maladie cardio-vasculaire
  q5_autre?: 'yes' | 'no' | 'unknown' | null;
  q5_1_autre_specify?: string | null;
  q5_2_autre_date?: string | null;
  
  // Metadata
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type PathoCardioResponseInsert = Omit<PathoCardioResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ===== Pathologies Endocriniennes et Métaboliques (Endocrine and Metabolic Conditions) Response =====
export interface PathoEndocResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // 1. Diabète
  q1_diabete?: 'yes' | 'no' | 'unknown' | null;
  q1_1_diabete_date?: string | null;
  q1_2_diabete_treated?: 'yes' | 'no' | null;
  q1_3_diabete_balanced?: 'yes' | 'no' | null;
  q1_4_diabete_type?: 'type1' | 'type2' | 'unknown' | null;
  
  // 2. Dysthyroïdie
  q2_dysthyroidie?: 'yes' | 'no' | 'unknown' | null;
  q2_1_dysthyroidie_type?: 'hypo' | 'hyper' | 'unknown' | null;
  q2_2_dysthyroidie_origin?: 'lithium' | 'other_treatment' | null;
  q2_3_dysthyroidie_treated?: 'yes' | 'no' | null;
  q2_4_dysthyroidie_balanced?: 'yes' | 'no' | null;
  
  // 3. Dyslipidémie
  q3_dyslipidemie?: 'yes' | 'no' | 'unknown' | null;
  q3_1_dyslipidemie_date?: string | null;
  q3_2_dyslipidemie_treated?: 'yes' | 'no' | null;
  q3_3_dyslipidemie_balanced?: 'yes' | 'no' | null;
  q3_4_dyslipidemie_type?: 'hypercholesterolemia' | 'hypertriglyceridemia' | 'both' | 'unknown' | null;
  
  // 4. Autres endocrinopathies
  q4_autres?: 'yes' | 'no' | 'unknown' | null;
  q4_1_autres_date?: string | null;
  q4_2_autres_specify?: string | null;
  
  // Metadata
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type PathoEndocResponseInsert = Omit<PathoEndocResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ===== Pathologies Dermatologiques (Dermatological Conditions) Response =====
export interface PathoDermatoResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // 1. Psoriasis
  q1_psoriasis?: 'yes' | 'no' | 'unknown' | null;
  q1_1_psoriasis_date?: string | null;
  q1_2_psoriasis_treated?: 'yes' | 'no' | null;
  q1_3_psoriasis_balanced?: 'yes' | 'no' | null;
  q1_4_psoriasis_lithium_effect?: 'yes' | 'no' | 'unknown' | null;
  q1_5_psoriasis_triggered_lithium?: 'yes' | 'no' | null;
  q1_6_psoriasis_aggravated_lithium?: 'yes' | 'no' | null;
  
  // 2. Acné
  q2_acne?: 'yes' | 'no' | 'unknown' | null;
  q2_1_acne_date?: string | null;
  q2_2_acne_treated?: 'yes' | 'no' | null;
  q2_3_acne_balanced?: 'yes' | 'no' | null;
  q2_4_acne_lithium_effect?: 'yes' | 'no' | 'unknown' | null;
  q2_5_acne_triggered_lithium?: 'yes' | 'no' | null;
  q2_6_acne_aggravated_lithium?: 'yes' | 'no' | null;
  
  // 3. Eczéma
  q3_eczema?: 'yes' | 'no' | 'unknown' | null;
  q3_1_eczema_date?: string | null;
  q3_2_eczema_treated?: 'yes' | 'no' | null;
  q3_3_eczema_balanced?: 'yes' | 'no' | null;
  
  // 4. Toxidermie médicamenteuse
  q4_toxidermie?: 'yes' | 'no' | 'unknown' | null;
  q4_1_toxidermie_date?: string | null;
  q4_2_toxidermie_type?: 'simple_eruption' | 'lyell' | 'stevens_johnson' | null;
  q4_3_toxidermie_medication?: string[] | null;
  
  // 5. Perte importante de cheveux
  q5_hair_loss?: 'yes' | 'no' | 'unknown' | null;
  q5_1_hair_loss_date?: string | null;
  q5_2_hair_loss_treated?: 'yes' | 'no' | null;
  q5_3_hair_loss_balanced?: 'yes' | 'no' | null;
  q5_4_hair_loss_depakine?: 'yes' | 'no' | 'unknown' | null;
  q5_5_hair_loss_triggered_valproate?: 'yes' | 'no' | null;
  q5_6_hair_loss_aggravated_valproate?: 'yes' | 'no' | null;
  
  // Metadata
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type PathoDermatoResponseInsert = Omit<PathoDermatoResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ===== Pathologies des voies urinaires (Urinary Tract Conditions) Response =====
export interface PathoUrinaireResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // 1. Néphropathie
  q1_nephropathy?: 'yes' | 'no' | 'unknown' | null;
  q1_1_nephropathy_date?: string | null;
  q1_2_nephropathy_treated?: 'yes' | 'no' | null;
  q1_3_nephropathy_balanced?: 'yes' | 'no' | null;
  q1_4_nephropathy_lithium_link?: 'yes' | 'no' | 'unknown' | null;
  
  // 2. Adénome prostatique
  q2_prostatic_adenoma?: 'yes' | 'no' | 'unknown' | null;
  q2_1_prostatic_adenoma_date?: string | null;
  q2_2_prostatic_adenoma_treated?: 'yes' | 'no' | null;
  q2_3_prostatic_adenoma_balanced?: 'yes' | 'no' | null;
  
  // 3. Rétention aiguë d'urine
  q3_urinary_retention?: 'yes' | 'no' | 'unknown' | null;
  q3_1_urinary_retention_date?: string | null;
  q3_2_urinary_retention_treatment_triggered?: 'yes' | 'no' | null;
  q3_3_urinary_retention_treatment_type?: string[] | null;
  
  // Metadata
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type PathoUrinaireResponseInsert = Omit<PathoUrinaireResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ===== Antécédents gynécologiques (Gynecological History) Response =====
export interface AntecedentsGynecoResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // 1-5. Pregnancy-related counts
  q1_pregnancy_count?: number | null;
  q2_live_birth_count?: number | null;
  q3_miscarriage_count?: number | null;
  q4_ivg_count?: number | null;
  q5_itg_count?: number | null;
  
  // 6. Ménopause
  q6_menopause?: 'yes' | 'no' | 'unknown' | null;
  q6_1_menopause_date?: string | null;
  q6_2_hormonal_treatment?: 'yes' | 'no' | 'unknown' | null;
  q6_3_hormonal_treatment_start_date?: string | null;
  
  // 7. Pathologie gynécologique
  q7_gyneco_pathology?: 'yes' | 'no' | 'unknown' | null;
  q7_1_gyneco_pathology_specify?: string | null;
  
  // Metadata
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type AntecedentsGynecoResponseInsert = Omit<AntecedentsGynecoResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ===== Pathologies hépato-gastro-entérologiques Response =====
export interface PathoHepatoGastroResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // 1. Maladies inflammatoires chroniques de l'intestin (MICI)
  q1_1_mici_presence?: 'yes' | 'no' | 'unknown' | null;
  q1_2_mici_start_date?: string | null;
  q1_3_mici_treated?: 'yes' | 'no' | null;
  q1_4_mici_balanced?: 'yes' | 'no' | null;
  q1_5_mici_type?: 'crohn' | 'rch' | 'unknown' | null;
  
  // 2. Cirrhose
  q2_1_cirrhosis_presence?: 'yes' | 'no' | 'unknown' | null;
  q2_2_cirrhosis_start_date?: string | null;
  q2_3_cirrhosis_treated?: 'yes' | 'no' | null;
  q2_4_cirrhosis_balanced?: 'yes' | 'no' | null;
  
  // 3. Ulcère gastro-duodénal
  q3_1_ulcer_presence?: 'yes' | 'no' | 'unknown' | null;
  q3_2_ulcer_start_date?: string | null;
  q3_3_ulcer_treated?: 'yes' | 'no' | null;
  q3_4_ulcer_balanced?: 'yes' | 'no' | null;
  
  // 4. Hépatites médicamenteuses
  q4_1_hepatitis_presence?: 'yes' | 'no' | 'unknown' | null;
  q4_2_hepatitis_start_date?: string | null;
  q4_3_hepatitis_treatment_type?: 'neuroleptiques' | 'antidepresseurs' | 'anticonvulsivants' | 'autres' | null;
  
  // Metadata
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type PathoHepatoGastroResponseInsert = Omit<PathoHepatoGastroResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ===== Pathologies allergiques et inflammatoires Response =====
export interface PathoAllergiqueResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // 0. Presence question
  q0_presence?: 'yes' | 'no' | 'unknown' | null;
  
  // 1. Selection of pathologies (multi-select)
  q1_pathologies_selection?: string[] | null;
  
  // 2. Asthme
  q2_1_asthme_treated?: 'yes' | 'no' | null;
  q2_2_asthme_balanced?: 'yes' | 'no' | null;
  q2_3_asthme_start_date?: string | null;
  
  // 3. Allergies hors asthme
  q3_1_allergie_treated?: 'yes' | 'no' | null;
  q3_2_allergie_balanced?: 'yes' | 'no' | null;
  q3_3_allergie_start_date?: string | null;
  
  // 4. Lupus
  q4_1_lupus_treated?: 'yes' | 'no' | null;
  q4_2_lupus_balanced?: 'yes' | 'no' | null;
  q4_3_lupus_start_date?: string | null;
  
  // 5. Polyarthrite rhumatoïde
  q5_1_polyarthrite_treated?: 'yes' | 'no' | null;
  q5_2_polyarthrite_balanced?: 'yes' | 'no' | null;
  q5_3_polyarthrite_start_date?: string | null;
  
  // 6. Autres maladies auto-immunes
  q6_1_autoimmune_start_date?: string | null;
  q6_2_autoimmune_type?: string | null;
  
  // Metadata
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type PathoAllergiqueResponseInsert = Omit<PathoAllergiqueResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// AUTRES PATHOLOGIES (Other Pathologies - Histoire Somatique)
// ============================================================================

export interface AutresPathoResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // 0. Global response
  q0_global_response?: 'non_pour_tous' | 'ne_sais_pas_pour_tous' | 'detailed' | null;
  
  // I. Pathologies cancéreuses
  q1_1_neoplasique_presence?: 'yes' | 'no' | 'unknown' | null;
  q1_2_neoplasique_date?: string | null;
  q1_3_cancer_types?: string[] | null;
  q1_4_cancer_specify?: string | null;
  
  // II. Pathologies infectieuses
  // VIH
  q2_1_vih_presence?: 'yes' | 'no' | 'unknown' | null;
  q2_2_vih_date?: string | null;
  q2_3_vih_treated?: 'yes' | 'no' | null;
  q2_4_vih_balanced?: 'yes' | 'no' | null;
  
  // Hépatite virale chronique
  q3_1_hepatite_presence?: 'yes' | 'no' | 'unknown' | null;
  q3_2_hepatite_date?: string | null;
  q3_3_hepatite_type?: 'hepatite_b' | 'hepatite_c' | 'hepatite_d' | 'non_classee' | 'unknown' | null;
  q3_4_hepatite_treated?: 'yes' | 'no' | null;
  q3_5_hepatite_balanced?: 'yes' | 'no' | null;
  
  // III. Antécédents chirurgicaux graves
  q4_1_chirurgicaux_presence?: 'yes' | 'no' | 'unknown' | null;
  q4_2_chirurgicaux_specify?: string | null;
  
  // IV. Maladie génétique
  q5_1_genetique_presence?: 'yes' | 'no' | 'unknown' | null;
  q5_2_genetique_specify?: string | null;
  
  // V. Pathologies ophtalmologiques
  q6_0_ophtalmo_presence?: 'yes' | 'no' | 'unknown' | null;
  
  // Glaucome par fermeture de l'angle
  q6_1_1_glaucome_fermeture_presence?: 'yes' | 'no' | 'unknown' | null;
  q6_1_2_glaucome_fermeture_date?: string | null;
  q6_1_3_glaucome_fermeture_treatment_triggered?: 'yes' | 'no' | null;
  q6_1_4_glaucome_fermeture_treatment_type?: 'neuroleptiques' | 'antidepresseurs' | 'autres' | null;
  
  // Glaucome chronique à angle ouvert
  q6_2_1_glaucome_ouvert_presence?: 'yes' | 'no' | 'unknown' | null;
  q6_2_2_glaucome_ouvert_date?: string | null;
  q6_2_3_glaucome_ouvert_treated?: 'yes' | 'no' | null;
  q6_2_4_glaucome_ouvert_balanced?: 'yes' | 'no' | null;
  
  // Cataracte
  q6_3_1_cataracte_presence?: 'yes' | 'no' | 'unknown' | null;
  q6_3_2_cataracte_date?: string | null;
  q6_3_3_cataracte_treated?: 'yes' | 'no' | null;
  q6_3_4_cataracte_balanced?: 'yes' | 'no' | null;
  
  // VI. Autre pathologie somatique
  q7_1_autre_presence?: 'yes' | 'no' | 'unknown' | null;
  q7_2_autre_specify?: string | null;
  
  // Metadata
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export type AutresPathoResponseInsert = Omit<AutresPathoResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// WAIS-IV Clinical Criteria (Neuropsychological Evaluation)
// ============================================================================

export interface Wais4CriteriaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // General Information
  collection_date: string; // Date field
  assessment_time?: string | null; // Time of assessment (09h-18h)
  age: number; // 16-90
  laterality: 'gaucher' | 'droitier' | 'ambidextre';
  native_french_speaker: number; // 0 or 1
  
  // Clinical State
  time_since_last_eval: 'moins_semaine' | 'plus_semaine';
  patient_euthymic: number; // 0 or 1
  no_episode_3months: number; // 0 or 1
  
  // Socio-demographic Data
  socio_prof_data_present: number; // 0 or 1
  years_of_education: number; // >= 0
  
  // Exclusion Criteria / Health
  no_visual_impairment: number; // 0 or 1
  no_hearing_impairment: number; // 0 or 1
  no_ect_past_year: number; // 0 or 1
  
  // Acceptance for Neuropsychological Evaluation
  accepted_for_neuropsy_evaluation?: number | null; // 0 or 1
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Wais4CriteriaResponseInsert = Omit<Wais4CriteriaResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// WAIS-IV Learning Disorders (Troubles des acquisitions et des apprentissages)
// ============================================================================

export interface Wais4LearningResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Learning and Acquisition Disorders (0 = Non, 1 = Oui, 9 = Ne sait pas)
  dyslexia: number; // Dyslexie
  dysorthographia: number; // Dysorthographie
  dyscalculia: number; // Dyscalculie
  dysphasia: number; // Dysphasie
  dyspraxia: number; // Dyspraxie
  speech_delay: number; // Retard à l'acquisition de la parole
  stuttering: number; // Bégaiement
  walking_delay: number; // Retard à l'acquisition de la marche
  febrile_seizures: number; // Convulsions fébriles dans la petite enfance
  precocity: number; // Précocité
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Wais4LearningResponseInsert = Omit<Wais4LearningResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// WAIS-IV Matrices (Raisonnement fluide)
// ============================================================================

export interface Wais4MatricesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Demographic data
  patient_age: number; // 16-90
  
  // Items 1-26 (0 or 1 each)
  item_01: number;
  item_02: number;
  item_03: number;
  item_04: number;
  item_05: number;
  item_06: number;
  item_07: number;
  item_08: number;
  item_09: number;
  item_10: number;
  item_11: number;
  item_12: number;
  item_13: number;
  item_14: number;
  item_15: number;
  item_16: number;
  item_17: number;
  item_18: number;
  item_19: number;
  item_20: number;
  item_21: number;
  item_22: number;
  item_23: number;
  item_24: number;
  item_25: number;
  item_26: number;
  
  // Computed scores
  raw_score?: number; // Sum of items 1-26 (generated column)
  standardized_score?: number | null; // 1-19 based on age
  percentile_rank?: number | null; // Percentile
  deviation_from_mean?: number | null; // (standardized_score - 10) / 3
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Wais4MatricesResponseInsert = Omit<Wais4MatricesResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'raw_score'>;

// ============================================================================
// CVLT (California Verbal Learning Test) - French Adaptation
// ============================================================================

export interface CvltResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Demographic data (required for scoring)
  patient_age: number; // 16-100
  years_of_education: number; // 0-30
  patient_sex: 'F' | 'M';
  
  // Liste A (Lundi) - Apprentissage (Trials 1-5)
  trial_1: number; // 0-16
  trial_2: number; // 0-16
  trial_3: number; // 0-16
  trial_4: number; // 0-16
  trial_5: number; // 0-16
  
  // Total Trials 1-5 (computed)
  total_1_5?: number;
  
  // Liste B (Mardi) - Interference
  list_b: number; // 0-16
  
  // Rappel a Court Terme (Short-term recall)
  sdfr: number; // Short Delay Free Recall (0-16)
  sdcr: number; // Short Delay Cued Recall (0-16)
  
  // Rappel a Long Terme (Long-term recall, 20 min)
  ldfr: number; // Long Delay Free Recall (0-16)
  ldcr: number; // Long Delay Cued Recall (0-16)
  
  // Indices de Strategie (optional)
  semantic_clustering?: number | null;
  serial_clustering?: number | null;
  
  // Erreurs (optional)
  perseverations?: number | null;
  intrusions?: number | null;
  
  // Recognition (optional)
  recognition_hits?: number | null;
  false_positives?: number | null;
  discriminability?: number | null;
  
  // Region Effects (optional)
  primacy?: number | null;
  recency?: number | null;
  
  // Response Bias (optional)
  response_bias?: number | null;
  
  // Delai (optional)
  cvlt_delai?: number | null;
  
  // Computed Standard Scores
  trial_1_std?: number | null;
  trial_5_std?: string | null; // Can be numeric or centile range
  total_1_5_std?: number | null;
  list_b_std?: number | null;
  sdfr_std?: string | null;
  sdcr_std?: string | null;
  ldfr_std?: string | null;
  ldcr_std?: string | null;
  semantic_std?: string | null;
  serial_std?: string | null;
  persev_std?: string | null;
  intru_std?: string | null;
  recog_std?: string | null;
  false_recog_std?: string | null;
  discrim_std?: string | null;
  primacy_std?: number | null;
  recency_std?: number | null;
  bias_std?: number | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type CvltResponseInsert = Omit<CvltResponse, 
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_1_5' | 
  'trial_1_std' | 'trial_5_std' | 'total_1_5_std' | 'list_b_std' | 
  'sdfr_std' | 'sdcr_std' | 'ldfr_std' | 'ldcr_std' | 
  'semantic_std' | 'serial_std' | 'persev_std' | 'intru_std' | 
  'recog_std' | 'false_recog_std' | 'discrim_std' | 
  'primacy_std' | 'recency_std' | 'bias_std'
>;

// ============================================================================
// WAIS-IV Code, Symboles & IVT (Processing Speed Index)
// ============================================================================

export interface Wais4CodeResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Demographic data
  patient_age: number; // 16-120
  
  // Code Subtest inputs
  wais_cod_tot: number; // Total correctly filled boxes (0-135)
  wais_cod_err: number; // Incorrectly filled boxes (0-135, collected but not used in scoring)
  
  // Code Subtest computed scores
  wais_cod_brut?: number | null; // Raw total score (Note brute totale)
  wais_cod_std?: number | null; // Standard score (Note standard - Code) 1-19
  wais_cod_cr?: number | null; // Standardized value (z-score)
  
  // Symboles (Symbol Search) Subtest inputs
  wais_symb_tot?: number | null; // Total correctly filled boxes (0-60)
  wais_symb_err?: number | null; // Incorrectly filled boxes (0-60, subtracted from total)
  
  // Symboles Subtest computed scores
  wais_symb_brut?: number | null; // Raw score (total - errors)
  wais_symb_std?: number | null; // Standard score (Note standard - Symboles) 1-19
  wais_symb_cr?: number | null; // Standardized value (z-score)
  
  // IVT (Processing Speed Index) composite scores
  wais_somme_ivt?: number | null; // Sum of Code + Symboles standard scores (2-38)
  wais_ivt?: number | null; // Processing Speed Index (50-150, mean=100, SD=15)
  wais_ivt_rang?: string | null; // Percentile rank
  wais_ivt_95?: string | null; // 95% confidence interval
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Wais4CodeResponseInsert = Omit<Wais4CodeResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// WAIS-IV Digit Span (Memoire des chiffres)
// ============================================================================

export interface Wais4DigitSpanResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Demographic data
  patient_age: number; // 16-90
  
  // Ordre Direct (Forward) - 8 items x 2 trials
  wais4_mcod_1a: number;
  wais4_mcod_1b: number;
  wais4_mcod_2a?: number | null;
  wais4_mcod_2b?: number | null;
  wais4_mcod_3a?: number | null;
  wais4_mcod_3b?: number | null;
  wais4_mcod_4a?: number | null;
  wais4_mcod_4b?: number | null;
  wais4_mcod_5a?: number | null;
  wais4_mcod_5b?: number | null;
  wais4_mcod_6a?: number | null;
  wais4_mcod_6b?: number | null;
  wais4_mcod_7a?: number | null;
  wais4_mcod_7b?: number | null;
  wais4_mcod_8a?: number | null;
  wais4_mcod_8b?: number | null;
  
  // Ordre Inverse (Backward) - 8 items x 2 trials
  wais4_mcoi_1a: number;
  wais4_mcoi_1b: number;
  wais4_mcoi_2a?: number | null;
  wais4_mcoi_2b?: number | null;
  wais4_mcoi_3a?: number | null;
  wais4_mcoi_3b?: number | null;
  wais4_mcoi_4a?: number | null;
  wais4_mcoi_4b?: number | null;
  wais4_mcoi_5a?: number | null;
  wais4_mcoi_5b?: number | null;
  wais4_mcoi_6a?: number | null;
  wais4_mcoi_6b?: number | null;
  wais4_mcoi_7a?: number | null;
  wais4_mcoi_7b?: number | null;
  wais4_mcoi_8a?: number | null;
  wais4_mcoi_8b?: number | null;
  
  // Ordre Croissant (Sequencing) - 8 items x 2 trials
  wais4_mcoc_1a: number;
  wais4_mcoc_1b: number;
  wais4_mcoc_2a?: number | null;
  wais4_mcoc_2b?: number | null;
  wais4_mcoc_3a?: number | null;
  wais4_mcoc_3b?: number | null;
  wais4_mcoc_4a?: number | null;
  wais4_mcoc_4b?: number | null;
  wais4_mcoc_5a?: number | null;
  wais4_mcoc_5b?: number | null;
  wais4_mcoc_6a?: number | null;
  wais4_mcoc_6b?: number | null;
  wais4_mcoc_7a?: number | null;
  wais4_mcoc_7b?: number | null;
  wais4_mcoc_8a?: number | null;
  wais4_mcoc_8b?: number | null;
  
  // Individual item scores (sum of trial 1 + trial 2)
  wais_mcod_1?: number | null; // Item score Direct 1
  wais_mcod_2?: number | null; // Item score Direct 2
  wais_mcod_3?: number | null; // Item score Direct 3
  wais_mcod_4?: number | null; // Item score Direct 4
  wais_mcod_5?: number | null; // Item score Direct 5
  wais_mcod_6?: number | null; // Item score Direct 6
  wais_mcod_7?: number | null; // Item score Direct 7
  wais_mcod_8?: number | null; // Item score Direct 8
  
  wais_mcoi_1?: number | null; // Item score Inverse 1
  wais_mcoi_2?: number | null; // Item score Inverse 2
  wais_mcoi_3?: number | null; // Item score Inverse 3
  wais_mcoi_4?: number | null; // Item score Inverse 4
  wais_mcoi_5?: number | null; // Item score Inverse 5
  wais_mcoi_6?: number | null; // Item score Inverse 6
  wais_mcoi_7?: number | null; // Item score Inverse 7
  wais_mcoi_8?: number | null; // Item score Inverse 8
  
  wais_mcoc_1?: number | null; // Item score Croissant 1
  wais_mcoc_2?: number | null; // Item score Croissant 2
  wais_mcoc_3?: number | null; // Item score Croissant 3
  wais_mcoc_4?: number | null; // Item score Croissant 4
  wais_mcoc_5?: number | null; // Item score Croissant 5
  wais_mcoc_6?: number | null; // Item score Croissant 6
  wais_mcoc_7?: number | null; // Item score Croissant 7
  wais_mcoc_8?: number | null; // Item score Croissant 8
  
  // Section totals with naming convention
  wais_mcod_tot?: number | null; // Total Ordre Direct (0-16)
  wais_mcoi_tot?: number | null; // Total Ordre Inverse (0-16)
  wais_mcoc_tot?: number | null; // Total Ordre Croissant (0-16)
  
  // Legacy field names (kept for backward compatibility)
  mcod_total?: number | null; // Score total Ordre Direct (0-16)
  mcoi_total?: number | null; // Score total Ordre Inverse (0-16)
  mcoc_total?: number | null; // Score total Ordre Croissant (0-16)
  raw_score?: number | null; // Note Brute Totale (0-48)
  standardized_score?: number | null; // Note Standard (1-19)
  
  // Process scores (empan) with naming convention
  wais_mc_end?: number | null; // Empan endroit (forward span)
  wais_mc_env?: number | null; // Empan envers (backward span)
  wais_mc_cro?: number | null; // Empan croissant (sequencing span)
  
  // Legacy empan field names (kept for backward compatibility)
  empan_direct?: number | null; // Max span Direct
  empan_inverse?: number | null; // Max span Inverse
  empan_croissant?: number | null; // Max span Croissant
  
  // Empan Z-scores (age-stratified normative data)
  wais_mc_end_std?: number | null; // Z-score empan endroit
  wais_mc_env_std?: number | null; // Z-score empan envers
  wais_mc_cro_std?: number | null; // Z-score empan croissant
  
  // Empan difference score
  wais_mc_emp?: number | null; // Empan difference (endroit - envers)
  
  // Total and standard scores with naming convention
  wais_mc_tot?: number | null; // Total raw score (0-48)
  wais_mc_std?: number | null; // Standard score (1-19)
  wais_mc_cr?: number | null; // Standardized value (std_score - 10) / 3
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Wais4DigitSpanResponseInsert = Omit<Wais4DigitSpanResponse, 
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 
  'mcod_total' | 'mcoi_total' | 'mcoc_total' | 'raw_score' | 'standardized_score' | 
  'empan_direct' | 'empan_inverse' | 'empan_croissant' |
  'wais_mcod_1' | 'wais_mcod_2' | 'wais_mcod_3' | 'wais_mcod_4' | 'wais_mcod_5' | 'wais_mcod_6' | 'wais_mcod_7' | 'wais_mcod_8' |
  'wais_mcoi_1' | 'wais_mcoi_2' | 'wais_mcoi_3' | 'wais_mcoi_4' | 'wais_mcoi_5' | 'wais_mcoi_6' | 'wais_mcoi_7' | 'wais_mcoi_8' |
  'wais_mcoc_1' | 'wais_mcoc_2' | 'wais_mcoc_3' | 'wais_mcoc_4' | 'wais_mcoc_5' | 'wais_mcoc_6' | 'wais_mcoc_7' | 'wais_mcoc_8' |
  'wais_mcod_tot' | 'wais_mcoi_tot' | 'wais_mcoc_tot' |
  'wais_mc_end' | 'wais_mc_env' | 'wais_mc_cro' |
  'wais_mc_end_std' | 'wais_mc_env_std' | 'wais_mc_cro_std' |
  'wais_mc_emp' | 'wais_mc_tot' | 'wais_mc_std' | 'wais_mc_cr'
>;

// ============================================================================
// Trail Making Test (TMT) - Reitan 1955
// ============================================================================

export interface TmtResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Demographic data
  patient_age: number; // 16-100
  years_of_education: number;
  
  // Partie A
  tmta_tps: number; // Time in seconds
  tmta_err: number; // Uncorrected errors
  tmta_cor?: number | null; // Corrected errors
  
  // Partie B
  tmtb_tps: number; // Time in seconds
  tmtb_err: number; // Uncorrected errors
  tmtb_cor?: number | null; // Corrected errors
  tmtb_err_persev: number; // Perseverative errors
  
  // Computed scores - Part A
  tmta_errtot?: number | null; // Total errors
  tmta_tps_z?: number | null; // Z-score for time
  tmta_tps_pc?: string | null; // Percentile for time (can be range like "25 - 50")
  tmta_errtot_z?: number | null; // Z-score for errors
  tmta_errtot_pc?: string | null; // Percentile for errors
  
  // Computed scores - Part B
  tmtb_errtot?: number | null; // Total errors
  tmtb_tps_z?: number | null; // Z-score for time
  tmtb_tps_pc?: string | null; // Percentile for time (can be range like "25 - 50")
  tmtb_errtot_z?: number | null; // Z-score for errors
  tmtb_errtot_pc?: string | null; // Percentile for errors
  tmtb_err_persev_z?: number | null; // Z-score for perseverative errors
  tmtb_err_persev_pc?: string | null; // Percentile for perseverative errors
  
  // Computed scores - Difference (B - A)
  tmt_b_a_tps?: number | null; // Time difference B - A
  tmt_b_a_tps_z?: number | null; // Z-score for time difference
  tmt_b_a_tps_pc?: string | null; // Percentile for time difference
  tmt_b_a_err?: number | null; // Error difference B - A
  tmt_b_a_err_z?: number | null; // Z-score for error difference
  tmt_b_a_err_pc?: string | null; // Percentile for error difference
  
  // Protocol version tracking
  questionnaire_version?: 'WAIS-III' | 'WAIS-IV' | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type TmtResponseInsert = Omit<TmtResponse, 
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 
  'tmta_errtot' | 'tmta_tps_z' | 'tmta_tps_pc' | 'tmta_errtot_z' | 'tmta_errtot_pc' |
  'tmtb_errtot' | 'tmtb_tps_z' | 'tmtb_tps_pc' | 'tmtb_errtot_z' | 'tmtb_errtot_pc' | 
  'tmtb_err_persev_z' | 'tmtb_err_persev_pc' |
  'tmt_b_a_tps' | 'tmt_b_a_tps_z' | 'tmt_b_a_tps_pc' | 'tmt_b_a_err' | 'tmt_b_a_err_z' | 'tmt_b_a_err_pc'
>;

// ============================================================================
// Stroop Test (Golden 1978)
// ============================================================================

export interface StroopResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Demographic data
  patient_age: number;
  
  // Planche A - Mots (Words)
  stroop_w_tot: number; // Words read in 45s
  stroop_w_cor?: number | null; // Corrected errors
  stroop_w_err?: number | null; // Uncorrected errors
  stroop_w_tot_c?: number | null; // Age-corrected score
  stroop_w_note_t?: number | null; // T-score
  stroop_w_note_t_corrigee?: number | null; // Z-score
  
  // Planche B - Couleurs (Colors)
  stroop_c_tot: number; // Colors named in 45s
  stroop_c_cor?: number | null; // Corrected errors
  stroop_c_err?: number | null; // Uncorrected errors
  stroop_c_tot_c?: number | null; // Age-corrected score
  stroop_c_note_t?: number | null; // T-score
  stroop_c_note_t_corrigee?: number | null; // Z-score
  
  // Planche C - Mots/Couleurs (Color-Words)
  stroop_cw_tot: number; // Color-words named in 45s
  stroop_cw_cor?: number | null; // Corrected errors
  stroop_cw_err?: number | null; // Uncorrected errors
  stroop_cw_tot_c?: number | null; // Age-corrected score
  stroop_cw_note_t?: number | null; // T-score
  stroop_cw_note_t_corrigee?: number | null; // Z-score
  
  // Interference
  stroop_interf?: number | null; // Interference score
  stroop_interf_note_t?: number | null; // T-score
  stroop_interf_note_tz?: number | null; // Z-score
  
  // Protocol version tracking
  questionnaire_version?: 'WAIS-III' | 'WAIS-IV' | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type StroopResponseInsert = Omit<StroopResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'stroop_w_tot_c' | 'stroop_c_tot_c' | 'stroop_cw_tot_c' | 'stroop_interf' | 'stroop_w_note_t' | 'stroop_c_note_t' | 'stroop_cw_note_t' | 'stroop_interf_note_t' | 'stroop_w_note_t_corrigee' | 'stroop_c_note_t_corrigee' | 'stroop_cw_note_t_corrigee' | 'stroop_interf_note_tz'>;

// ============================================================================
// Fluences Verbales (Cardebat et al., 1990)
// ============================================================================

export interface FluencesVerbalesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Demographic data
  patient_age: number;
  years_of_education: number;
  
  // Lettre P (Phonemic)
  fv_p_tot_correct: number;
  fv_p_persev?: number | null; // Perseverations
  fv_p_deriv?: number | null;
  fv_p_intrus?: number | null;
  fv_p_propres?: number | null;
  fv_p_cluster_tot?: number | null; // Number of clusters
  fv_p_cluster_taille?: number | null; // Average cluster size (decimal)
  fv_p_switch_tot?: number | null; // Number of switches
  fv_p_tot_rupregle?: number | null; // Total rule violations
  fv_p_tot_correct_z?: number | null; // Z-score
  fv_p_tot_correct_pc?: string | null; // Percentile (can be range like "25 - 50")
  
  // Categorie Animaux (Semantic)
  fv_anim_tot_correct: number;
  fv_anim_persev?: number | null; // Perseverations
  fv_anim_deriv?: number | null;
  fv_anim_intrus?: number | null;
  fv_anim_propres?: number | null;
  fv_anim_cluster_tot?: number | null; // Number of clusters
  fv_anim_cluster_taille?: number | null; // Average cluster size (decimal)
  fv_anim_switch_tot?: number | null; // Number of switches
  fv_anim_tot_rupregle?: number | null; // Total rule violations
  fv_anim_tot_correct_z?: number | null; // Z-score
  fv_anim_tot_correct_pc?: string | null; // Percentile (can be range like "25 - 50")
  
  // Protocol version tracking
  questionnaire_version?: 'WAIS-III' | 'WAIS-IV' | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type FluencesVerbalesResponseInsert = Omit<FluencesVerbalesResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'fv_p_tot_rupregle' | 'fv_p_tot_correct_z' | 'fv_p_tot_correct_pc' | 'fv_anim_tot_rupregle' | 'fv_anim_tot_correct_z' | 'fv_anim_tot_correct_pc'>;

// ============================================================================
// COBRA - Cognitive Complaints in Bipolar Disorder Rating Assessment
// ============================================================================

export interface CobraResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Questions 1-16 (each 0-3)
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
  
  // Computed score
  total_score?: number | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type CobraResponseInsert = Omit<CobraResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score'>;

// ============================================================================
// CPT-III - Conners' Continuous Performance Test III
// ============================================================================

export interface Cpt3Response {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Detectability
  d_prime?: number | null;
  d_prime_interp?: string | null;
  
  // Errors
  omissions?: number | null;
  omissions_interp?: string | null;
  commissions?: number | null;
  commissions_interp?: string | null;
  perseverations?: number | null;
  perseverations_interp?: string | null;
  
  // Reaction Time Statistics
  hrt?: number | null;
  hrt_interp?: string | null;
  hrt_sd?: number | null;
  hrt_sd_interp?: string | null;
  variability?: number | null;
  variability_interp?: string | null;
  hrt_block_change?: number | null;
  hrt_block_change_interp?: string | null;
  hrt_isi_change?: number | null;
  hrt_isi_change_interp?: string | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Cpt3ResponseInsert = Omit<Cpt3Response, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// WAIS-IV Similitudes
// ============================================================================

export interface Wais4SimilitudesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Patient age for scoring
  patient_age: number;
  
  // Items 1-18 (each 0-2)
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  item7: number;
  item8: number;
  item9: number;
  item10: number;
  item11: number;
  item12: number;
  item13: number;
  item14: number;
  item15: number;
  item16: number;
  item17: number;
  item18: number;
  
  // Computed scores
  total_raw_score?: number | null;
  standard_score?: number | null;
  standardized_value?: number | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Wais4SimilitudesResponseInsert = Omit<Wais4SimilitudesResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_raw_score' | 'standard_score' | 'standardized_value'>;

// ============================================================================
// Test des Commissions
// ============================================================================

export interface TestCommissionsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Patient age for scoring
  patient_age: number;
  
  // NSC - Niveau etude (0: < baccalaureat, 1: >= baccalaureat)
  nsc: number;
  
  // Raw scores (manual entry - all optional)
  com01?: number | null; // Time in minutes
  com02?: number | null; // Number of unnecessary detours
  com03?: number | null; // Number of schedule violations
  com04?: number | null; // Number of logical errors
  com05?: string | null; // Sequence of commissions
  
  // Manually entered scores (all optional)
  com01s1?: number | null; // Percentile for time
  com01s2?: number | null; // Z-score for time
  com02s1?: number | null; // Percentile for detours
  com02s2?: number | null; // Z-score for detours
  com03s1?: number | null; // Percentile for schedule violations
  com03s2?: number | null; // Z-score for schedule violations
  com04s1?: number | null; // Percentile for logical errors
  com04s2?: number | null; // Z-score for logical errors
  com04s3?: number | null; // Total errors
  com04s4?: number | null; // Percentile for total errors
  com04s5?: number | null; // Z-score for total errors
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type TestCommissionsResponseInsert = Omit<TestCommissionsResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// SCIP - Screening Assessment for Cognitive Impairment in Psychiatry
// ============================================================================

export interface ScipResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Version selection
  version: number; // 1, 2, or 3
  
  // Raw scores (inputs)
  scipv01a: number; // Apprentissage Verbal Immediat
  scipv02a: number; // Memoire de Travail
  scipv03a: number; // Fluence Verbale
  scipv04a: number; // Rappel Verbal Differe
  scipv05a: number; // Capacites Visuomotrices
  
  // Computed Z-scores
  scipv01b?: number | null;
  scipv02b?: number | null;
  scipv03b?: number | null;
  scipv04b?: number | null;
  scipv05b?: number | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type ScipResponseInsert = Omit<ScipResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'scipv01b' | 'scipv02b' | 'scipv03b' | 'scipv04b' | 'scipv05b'>;

// ============================================================================
// WAIS-III Questionnaires
// ============================================================================
// Note: WAIS-III and WAIS-IV CVLT are identical - they use the unified CvltResponse type

// ============================================================================
// Independent Neuropsychological Tests - Backward Compatibility Aliases
// ============================================================================
// WAIS-III and WAIS-IV use identical tests for CVLT, TMT, Stroop, and Fluences.
// These aliases ensure backward compatibility with existing code.

// WAIS-III CVLT - Alias to unified CVLT types
export type Wais3CvltResponse = CvltResponse;
export type Wais3CvltResponseInsert = CvltResponseInsert;

// WAIS-III TMT - Alias to unified TMT types
export type Wais3TmtResponse = TmtResponse;
export type Wais3TmtResponseInsert = TmtResponseInsert;

// WAIS-III Stroop - Alias to unified Stroop types
export type Wais3StroopResponse = StroopResponse;
export type Wais3StroopResponseInsert = StroopResponseInsert;

// WAIS-III Fluences Verbales - Alias to unified Fluences types
export type Wais3FluencesVerbalesResponse = FluencesVerbalesResponse;
export type Wais3FluencesVerbalesResponseInsert = FluencesVerbalesResponseInsert;

// ============================================================================
// WAIS-III Clinical Criteria (Critères cliniques)
// ============================================================================

export interface Wais3CriteriaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // General Information
  collection_date: string; // Date field
  assessment_time?: string | null; // Time of assessment (09h-18h)
  age: number; // 16-90
  laterality: 'gaucher' | 'droitier' | 'ambidextre';
  native_french_speaker: number; // 0 or 1
  
  // Clinical State
  time_since_last_eval: 'moins_semaine' | 'plus_semaine';
  patient_euthymic: number; // 0 or 1
  no_episode_3months: number; // 0 or 1
  
  // Socio-demographic Data
  socio_prof_data_present: number; // 0 or 1
  years_of_education: number; // >= 0
  
  // Exclusion Criteria / Health
  no_visual_impairment: number; // 0 or 1
  no_hearing_impairment: number; // 0 or 1
  no_ect_past_year: number; // 0 or 1
  
  // Acceptance for Neuropsychological Evaluation
  accepted_for_neuropsy_evaluation?: number | null; // 0 or 1
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Wais3CriteriaResponseInsert = Omit<Wais3CriteriaResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// WAIS-III Learning Disorders (Troubles des acquisitions et des apprentissages)
// ============================================================================

export interface Wais3LearningResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Learning and Acquisition Disorders (0 = Non, 1 = Oui, 9 = Ne sait pas)
  dyslexia: number; // Dyslexie
  dysorthographia: number; // Dysorthographie
  dyscalculia: number; // Dyscalculie
  dysphasia: number; // Dysphasie
  dyspraxia: number; // Dyspraxie
  speech_delay: number; // Retard à l'acquisition de la parole
  stuttering: number; // Bégaiement
  walking_delay: number; // Retard à l'acquisition de la marche
  febrile_seizures: number; // Convulsions fébriles dans la petite enfance
  precocity: number; // Précocité
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Wais3LearningResponseInsert = Omit<Wais3LearningResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// WAIS-III Vocabulaire (Wechsler, 1997)
// ============================================================================

export interface Wais3VocabulaireResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Patient demographics (required for scoring)
  patient_age: number;
  
  // Item scores (0-2 for each item)
  item1: number;  // Bateau
  item2: number;  // Fauteuil
  item3: number;  // Bol
  item4: number;  // Instruire
  item5: number;  // Hier
  item6: number;  // Arracher
  item7: number;  // Sanction
  item8: number;  // Refuge
  item9: number;  // Calendrier
  item10: number; // Baleine
  item11: number; // Mime
  item12: number; // Persévérer
  item13: number; // Sauvage
  item14: number; // Héréditaire
  item15: number; // Connivence
  item16: number; // Grandiose
  item17: number; // Confier
  item18: number; // Vigoureux
  item19: number; // Contracter
  item20: number; // Initiative
  item21: number; // Esquisse
  item22: number; // Irritable
  item23: number; // Invectiver
  item24: number; // Hétérogène
  item25: number; // Assimiler
  item26: number; // Concertation
  item27: number; // Emulation
  item28: number; // Pittoresque
  item29: number; // Evasif
  item30: number; // Elaborer
  item31: number; // Prosaïque
  item32: number; // Apologie
  item33: number; // Conjecture
  
  // Computed scores
  total_raw_score?: number | null; // Sum of all items (0-66), DB-computed
  standard_score?: number | null; // Age-adjusted scaled score (1-19)
  standardized_value?: number | null; // Normalized: (standard_score - 10) / 3
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type Wais3VocabulaireResponseInsert = Omit<Wais3VocabulaireResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_raw_score' | 'standard_score' | 'standardized_value'>;

// WAIS-III Matrices
export interface Wais3MatricesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Patient age for norm lookup
  patient_age: number;
  
  // Item scores (0 or 1 for each item)
  item_01: number;
  item_02: number;
  item_03: number;
  item_04: number;
  item_05: number;
  item_06: number;
  item_07: number;
  item_08: number;
  item_09: number;
  item_10: number;
  item_11: number;
  item_12: number;
  item_13: number;
  item_14: number;
  item_15: number;
  item_16: number;
  item_17: number;
  item_18: number;
  item_19: number;
  item_20: number;
  item_21: number;
  item_22: number;
  item_23: number;
  item_24: number;
  item_25: number;
  item_26: number;
  
  // Computed scores
  total_raw_score?: number | null;
  standard_score?: number | null;
  standardized_value?: number | null;
  
  // Metadata
  completed_by?: string;
  completed_at: string;
  created_at?: string;
  updated_at?: string;
}

export type Wais3MatricesResponseInsert = Omit<Wais3MatricesResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_raw_score' | 'standard_score' | 'standardized_value'>;

// WAIS-III Code, Symboles & IVT
export interface Wais3CodeSymbolesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Patient age for norm lookup
  patient_age: number;
  
  // Code subtest inputs
  wais_cod_tot: number;  // Total correct boxes
  wais_cod_err: number;  // Incorrect boxes
  
  // Symboles subtest inputs
  wais_symb_tot: number;  // Total correct
  wais_symb_err: number;  // Incorrect
  
  // Code calculated scores
  wais_cod_brut?: number;   // Raw score
  wais_cod_std?: number;    // Standard score
  wais_cod_cr?: number;     // Standardized value
  
  // Symboles calculated scores
  wais_symb_brut?: number;  // Raw score
  wais_symb_std?: number;   // Standard score
  wais_symb_cr?: number;    // Standardized value
  
  // IVT calculated scores
  wais_somme_ivt?: number;  // Sum of standard scores
  wais_ivt?: number;        // IVT Index
  wais_ivt_rang?: string;   // Percentile rank
  wais_ivt_95?: string;     // 95% confidence interval
  
  // Metadata
  completed_by?: string;
  completed_at: string;
  created_at?: string;
  updated_at?: string;
}

export type Wais3CodeSymbolesResponseInsert = Omit<Wais3CodeSymbolesResponse, 
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 
  'wais_cod_brut' | 'wais_cod_std' | 'wais_cod_cr' |
  'wais_symb_brut' | 'wais_symb_std' | 'wais_symb_cr' |
  'wais_somme_ivt' | 'wais_ivt' | 'wais_ivt_rang' | 'wais_ivt_95'
>;

// ============================================================================
// WAIS-III Digit Span (Mémoire des chiffres) Response
// ============================================================================

export interface Wais3DigitSpanResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Demographic data
  patient_age: number;
  education_level?: number;
  
  // Forward (Ordre Direct) items
  mcod_1a: number; mcod_1b: number;
  mcod_2a: number; mcod_2b: number;
  mcod_3a: number; mcod_3b: number;
  mcod_4a: number; mcod_4b: number;
  mcod_5a: number; mcod_5b: number;
  mcod_6a: number; mcod_6b: number;
  mcod_7a: number; mcod_7b: number;
  mcod_8a: number; mcod_8b: number;
  
  // Backward (Ordre Inverse) items
  mcoi_1a: number; mcoi_1b: number;
  mcoi_2a: number; mcoi_2b: number;
  mcoi_3a: number; mcoi_3b: number;
  mcoi_4a: number; mcoi_4b: number;
  mcoi_5a: number; mcoi_5b: number;
  mcoi_6a: number; mcoi_6b: number;
  mcoi_7a: number; mcoi_7b: number;
  
  // Individual item scores (Ordre Direct)
  wais3_mcod_1?: number;
  wais3_mcod_2?: number;
  wais3_mcod_3?: number;
  wais3_mcod_4?: number;
  wais3_mcod_5?: number;
  wais3_mcod_6?: number;
  wais3_mcod_7?: number;
  wais3_mcod_8?: number;
  
  // Individual item scores (Ordre Inverse)
  wais3_mcoi_1?: number;
  wais3_mcoi_2?: number;
  wais3_mcoi_3?: number;
  wais3_mcoi_4?: number;
  wais3_mcoi_5?: number;
  wais3_mcoi_6?: number;
  wais3_mcoi_7?: number;
  
  // Computed scores
  wais_mcod_tot?: number;
  wais_mcoi_tot?: number;
  wais_mc_tot?: number;
  wais_mc_end?: number;
  wais_mc_env?: number;
  wais_mc_emp?: number;
  wais_mc_std?: number;
  wais_mc_cr?: number;
  wais_mc_end_z?: number;
  wais_mc_env_z?: number;
  
  // Metadata
  completed_by?: string;
  completed_at: string;
  created_at?: string;
  updated_at?: string;
}

export type Wais3DigitSpanResponseInsert = Omit<Wais3DigitSpanResponse, 
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 
  'wais_mcod_tot' | 'wais_mcoi_tot' | 'wais_mc_tot' | 
  'wais_mc_end' | 'wais_mc_env' | 'wais_mc_emp' | 
  'wais_mc_std' | 'wais_mc_cr' | 'wais_mc_end_z' | 'wais_mc_env_z'
>;

// ============================================================================
// WAIS-III CPT II V.5 (Conners' Continuous Performance Test II) Response
// ============================================================================

export interface Wais3Cpt2Response {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Omissions
  cpt2_omissions_value?: number;
  cpt2_omissions_pourcentage?: number;
  cpt2_omissions_tscore?: number;
  cpt2_omissions_percentile?: number;
  cpt2_omissions_guideline?: number;
  
  // Commissions
  cpt2_comissions_value?: number;
  cpt2_comissions_pourcentage?: number;
  cpt2_comissions_tscore?: number;
  cpt2_comissions_percentile?: number;
  cpt2_comissions_guideline?: number;
  
  // Hit RT
  cpt2_hitrt_value?: number;
  cpt2_hitrt_tscore?: number;
  cpt2_hitrt_percentile?: number;
  cpt2_hitrt_guideline?: number;
  
  // Hit RT Std. Error
  cpt2_hitrtstder_value?: number;
  cpt2_hitrtstder_tscore?: number;
  cpt2_hitrtstder_percentile?: number;
  cpt2_hitrtstder_guideline?: number;
  
  // Variability
  cpt2_variability_value?: number;
  cpt2_variability_tscore?: number;
  cpt2_variability_percentile?: number;
  cpt2_variability_guideline?: number;
  
  // Detectability (d')
  cpt2_detectability_value?: number;
  cpt2_detectability_tscore?: number;
  cpt2_detectability_percentile?: number;
  cpt2_detectability_guideline?: number;
  
  // Response Style (Beta)
  cpt2_responsestyle_value?: number;
  cpt2_responsestyle_tscore?: number;
  cpt2_responsestyle_percentile?: number;
  cpt2_responsestyle_guideline?: number;
  
  // Perseverations
  cpt2_perseverations_value?: number;
  cpt2_perseverations_pourcentage?: number;
  cpt2_perseverations_tscore?: number;
  cpt2_perseverations_percentile?: number;
  cpt2_perseverations_guideline?: number;
  
  // Hit RT Block Change
  cpt2_hitrtblockchange_value?: number;
  cpt2_hitrtblockchange_tscore?: number;
  cpt2_hitrtblockchange_percentile?: number;
  cpt2_hitrtblockchange_guideline?: number;
  
  // Hit SE Block Change
  cpt2_hitseblockchange_value?: number;
  cpt2_hitseblockchange_tscore?: number;
  cpt2_hitseblockchange_percentile?: number;
  cpt2_hitseblockchange_guideline?: number;
  
  // Hit RT ISI Change
  cpt2_hitrtisichange_value?: number;
  cpt2_hitrtisichange_tscore?: number;
  cpt2_hitrtisichange_percentile?: number;
  cpt2_hitrtisichange_guideline?: number;
  
  // Hit SE ISI Change
  cpt2_hitseisichange_value?: number;
  cpt2_hitseisichange_tscore?: number;
  cpt2_hitseisichange_percentile?: number;
  cpt2_hitseisichange_guideline?: number;
  
  // Metadata
  completed_by?: string;
  completed_at: string;
  created_at?: string;
  updated_at?: string;
}

export type Wais3Cpt2ResponseInsert = Omit<Wais3Cpt2Response, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// MEM-III Spatial Span Response (Independent Neuropsychological Test)
// ============================================================================

export interface Mem3SpatialResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  patient_age: number;
  
  // Forward (Ordre Direct) items
  odirect_1a: number; odirect_1b: number;
  odirect_2a: number; odirect_2b: number;
  odirect_3a: number; odirect_3b: number;
  odirect_4a: number; odirect_4b: number;
  odirect_5a: number; odirect_5b: number;
  odirect_6a: number; odirect_6b: number;
  odirect_7a: number; odirect_7b: number;
  odirect_8a: number; odirect_8b: number;
  
  // Backward (Ordre Inverse) items
  inverse_1a: number; inverse_1b: number;
  inverse_2a: number; inverse_2b: number;
  inverse_3a: number; inverse_3b: number;
  inverse_4a: number; inverse_4b: number;
  inverse_5a: number; inverse_5b: number;
  inverse_6a: number; inverse_6b: number;
  inverse_7a: number; inverse_7b: number;
  inverse_8a: number; inverse_8b: number;
  
  // Computed scores
  mspatiale_odirect_tot?: number;
  mspatiale_odirect_std?: number;
  mspatiale_odirect_cr?: number;
  mspatiale_inverse_tot?: number;
  mspatiale_inverse_std?: number;
  mspatiale_inverse_cr?: number;
  mspatiale_total_brut?: number;
  mspatiale_total_std?: number;
  mspatiale_total_cr?: number;
  
  // Metadata
  completed_by?: string;
  completed_at: string;
  created_at?: string;
  updated_at?: string;
}

export type Mem3SpatialResponseInsert = Omit<Mem3SpatialResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'mspatiale_odirect_tot' | 'mspatiale_odirect_std' | 'mspatiale_odirect_cr' | 'mspatiale_inverse_tot' | 'mspatiale_inverse_std' | 'mspatiale_inverse_cr' | 'mspatiale_total_brut' | 'mspatiale_total_std' | 'mspatiale_total_cr'>;

// Backward compatibility aliases
export type Wais3Mem3SpatialResponse = Mem3SpatialResponse;
export type Wais3Mem3SpatialResponseInsert = Mem3SpatialResponseInsert;

// ============================================================================
// TREATMENT MANAGEMENT TYPES
// ============================================================================

// Patient Medications (psychotropic treatments per patient)
export interface PatientMedication {
  id: string;
  patient_id: string;
  medication_name: string;
  start_date: string;
  is_ongoing: boolean;
  end_date: string | null;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export type PatientMedicationInsert = Omit<PatientMedication, 'id' | 'created_at' | 'updated_at'>;
export type PatientMedicationUpdate = Partial<Omit<PatientMedication, 'id' | 'patient_id' | 'created_at'>>;

// Psychotropes Lifetime Response (psychiatric medication history questionnaire)
export interface PsychotropesLifetimeResponse {
  id: string;
  patient_id: string;
  collection_date: string | null;
  
  // Antidepresseur
  antidepresseur_status: 'yes' | 'no' | 'unknown' | null;
  antidepresseur_start_date: string | null;
  antidepresseur_months: number | null;
  
  // Neuroleptique classique
  neuroleptique_status: 'yes' | 'no' | 'unknown' | null;
  neuroleptique_start_date: string | null;
  neuroleptique_months: number | null;
  
  // Antipsychotique atypique
  antipsychotique_status: 'yes' | 'no' | 'unknown' | null;
  antipsychotique_start_date: string | null;
  antipsychotique_months: number | null;
  
  // Benzodiazepine / Hypnotique / Anxiolytique
  benzodiazepine_status: 'yes' | 'no' | 'unknown' | null;
  benzodiazepine_start_date: string | null;
  benzodiazepine_months: number | null;
  
  // Lithium
  lithium_status: 'yes' | 'no' | 'unknown' | null;
  lithium_start_date: string | null;
  lithium_months: number | null;
  
  // Thymoregulateur AC
  thymoregulateur_status: 'yes' | 'no' | 'unknown' | null;
  thymoregulateur_start_date: string | null;
  thymoregulateur_months: number | null;
  
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export type PsychotropesLifetimeResponseInsert = Omit<PsychotropesLifetimeResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// Somatic and Contraceptive Treatment Entry
export interface SomaticContraceptiveEntry {
  id: string;
  patient_id: string;
  medication_name: string;
  start_date: string | null;
  months_exposure: number | null;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export type SomaticContraceptiveEntryInsert = Omit<SomaticContraceptiveEntry, 'id' | 'created_at' | 'updated_at'>;

// Non-Pharmacologic Response (non-drug therapy questionnaire)
export interface NonPharmacologicResponse {
  id: string;
  patient_id: string;
  global_screening: 'yes' | 'no' | 'unknown' | null;
  
  // Sismotherapie (ECT)
  sismotherapie_status: 'yes' | 'no' | 'unknown' | null;
  sismotherapie_sessions: number | null;
  sismotherapie_start_date: string | null;
  sismotherapie_end_date: string | null;
  
  // TMS
  tms_status: 'yes' | 'no' | 'unknown' | null;
  tms_sessions: number | null;
  tms_start_date: string | null;
  tms_end_date: string | null;
  
  // TCC (CBT)
  tcc_status: 'yes' | 'no' | 'unknown' | null;
  tcc_sessions: number | null;
  tcc_start_date: string | null;
  tcc_end_date: string | null;
  
  // Psychoeducation groups
  psychoeducation_status: 'yes' | 'no' | 'unknown' | null;
  psychoeducation_sessions: number | null;
  psychoeducation_start_date: string | null;
  psychoeducation_end_date: string | null;
  
  // IPSRT
  ipsrt_status: 'yes' | 'no' | 'unknown' | null;
  ipsrt_sessions: number | null;
  ipsrt_start_date: string | null;
  ipsrt_end_date: string | null;
  ipsrt_group: boolean;
  ipsrt_individual: boolean;
  ipsrt_unknown_format: boolean;
  
  // Autre (Other)
  autre_status: 'yes' | 'no' | 'unknown' | null;
  autre_specify: string | null;
  autre_sessions: number | null;
  autre_start_date: string | null;
  autre_end_date: string | null;
  
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export type NonPharmacologicResponseInsert = Omit<NonPharmacologicResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ===== Semi-Annual DSM5 Current Mood Disorders (Troubles de l'humeur actuels) Response =====
export interface DiagPsySemHumeurActuelsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Q1: Presence of a current episode
  rad_epactuel?: 'Oui' | 'Non' | null;
  
  // Q2: Start date of current episode
  date_trouble_actuel_debut?: string | null;
  
  // Q3: Episode type
  rad_epactuel_type?: 'Episode Dépressif Majeur' | 'Hypomaniaque' | 'Maniaque' | 'Episode Non spécifié' | 'Ne sais pas' | null;
  
  // Q4: Current MDE episode type (only for Episode Dépressif Majeur)
  rad_epactuel_edmtype?: 'Sans caractéristique mélancolique atypique catatonique ou mixte' | 'Mélancolique' | 'Atypique' | 'Catatonique' | 'Mixte' | null;
  
  // Q5: Catatonic episode? (for Maniaque or Episode Non spécifié)
  rad_epactuel_mixttyp?: 'Oui' | 'Non' | 'Ne sais pas' | null;
  
  // Q6: Mixed episode? (for Maniaque or Episode Non spécifié)
  rad_epactuel_mixttyp2?: 'Oui' | 'Non' | 'Ne sais pas' | null;
  
  // Q7: Episode severity (for EDM, Maniaque, or Episode Non spécifié)
  rad_epactuel_sever?: 'Léger' | 'Modéré' | 'Sévère sans caractéristique psychotique' | 'Sévère avec caractéristiques psychotiques non congruentes' | 'Sévère avec caractéristiques psychotiques congruentes' | null;
  
  // Q8: Episode chronicity (only for Episode Dépressif Majeur)
  rad_epactuel_chron?: 'Oui' | 'Non' | 'Ne sais pas' | null;
  
  // Q9: Postpartum onset (for all episode types except empty and 'Ne sais pas')
  rad_postpartum_actuel?: 'Oui' | 'Non' | 'Ne sais pas' | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type DiagPsySemHumeurActuelsResponseInsert = Omit<DiagPsySemHumeurActuelsResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Semi-Annual DSM5: Episodes Since Last Visit (Troubles de l'humeur depuis la dernière visite)
// ============================================================================

export interface DiagPsySemHumeurDepuisVisiteResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Screening Section
  // Primary screening: Presence of at least one thymic episode since last visit
  rad_tb_hum_epthyman?: 'Oui' | 'Non' | 'Ne sais pas' | null;
  
  // Total number of episodes (computed)
  rad_tb_hum_epthyman_nb?: string | null;
  
  // EDM (Major Depressive Episode) Section
  rad_tb_hum_nbepdep?: string | null;
  date_prem_edm?: string | null;
  rad_tb_hum_nbepdeppsy?: string | null;
  rad_tb_hum_nbepdepmixt?: string | null;
  
  // Manie (Manic Episodes) Section
  rad_tb_hum_nbepmanan?: string | null;
  date_prem_man?: string | null;
  rad_tb_hum_nbepmanpsy?: string | null;
  rad_tb_hum_nbepmanmixt?: string | null;
  
  // Hypomanie (Hypomanic Episodes) Section
  rad_tb_hum_nbephypoman?: string | null;
  date_prem_hypo?: string | null;
  
  // Enchaînement (Episode Sequence) Section
  rad_tb_hum_type_plus_recent?: 'Episode Dépressif Majeur' | 'Hypomaniaque' | 'Maniaque' | 'Episode Non spécifié' | 'Ne sais pas' | null;
  enchainement?: string | null;
  
  // Hospitalisations Section (always visible)
  rad_tb_hum_nb_hospi?: string | null;
  rad_tb_hum_duree_hospi?: string | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type DiagPsySemHumeurDepuisVisiteResponseInsert = Omit<DiagPsySemHumeurDepuisVisiteResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Semi-Annual DSM5: Psychotic Disorders (Troubles psychotiques)
// ============================================================================

export interface DiagPsySemPsychotiquesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Primary screening: Does the patient have a psychotic disorder
  rad_tb_psychos?: 'Oui' | 'Non' | 'Ne sais pas' | null;
  
  // Date of psychotic disorder onset
  date_tb_psychos_date?: string | null;
  
  // Type of psychotic disorder
  rad_tb_psychos_type?: 
    | 'Schizophrénie'
    | 'Trouble schizophréniforme'
    | 'Trouble schizo-affectif'
    | 'Troubles délirants'
    | 'Trouble psychotique bref'
    | 'Trouble psychotique partagé'
    | 'Trouble psychotique induit par une affection médicale générale'
    | 'Trouble psychotique induit par une substance'
    | 'Trouble psychotique non spécifié'
    | null;
  
  // Presence of symptoms in the past month
  rad_tb_psychos_lastmonth?: 'Oui' | 'Non' | 'Ne sais pas' | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type DiagPsySemPsychotiquesResponseInsert = Omit<DiagPsySemPsychotiquesResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Psy Traitement Semestriel (Follow-up Care Module)
// Module: Soin, suivi et arret de travail
// ============================================================================

export interface PsyTraitementSemestrielResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // ========================================================================
  // SUIVI DES RECOMMANDATIONS
  // ========================================================================
  
  rad_suivi_recom_medicamenteux?: 'Complètement suivi' | 'Partiellement suivi' | 'Non suivi' | null;
  rad_suivi_recom_medicamenteux_non?: 'Refus du patient' | 'Désaccord du médecin pratiquant le suivi' | 'Problème de tolérance' | 'Problème de rechute' | 'Autres' | null;
  rad_suivi_recom_non_medicamenteux?: 'Complètement suivi' | 'Partiellement suivi' | 'Non suivi' | null;
  rad_suivi_recom_non_medicamenteux_non?: 'Refus du patient' | 'Désaccord avec le médecin pratiquant le suivi' | 'Impossible à mettre en place' | 'Autres' | null;
  
  // ========================================================================
  // RECOURS AUX SOINS - Suivi habituel
  // ========================================================================
  
  rad_recours_soin_psy?: 'Oui' | 'Non' | null;
  
  rad_recours_soin_psy_generaliste?: 'Oui' | 'Non' | null;
  recours_soin_psy_generaliste_nb?: number | null;
  
  rad_recours_soin_psy_psychiatre?: 'Oui' | 'Non' | null;
  recours_soin_psy_psychiatre_nb?: number | null;
  
  rad_recours_soin_psy_psychologue?: 'Oui' | 'Non' | null;
  recours_soin_psy_psychologue_nb?: number | null;
  
  rad_recours_soin_psy_plusieurs?: 'Oui' | 'Non' | null;
  recours_soin_psy_plusieurs_nb?: number | null;
  
  rad_recours_soin_psy_autres?: 'Oui' | 'Non' | null;
  recours_soin_psy_autres_nb?: number | null;
  
  // ========================================================================
  // RECOURS AUX SOINS - Urgence
  // ========================================================================
  
  rad_recours_soin_urgence?: 'Oui' | 'Non' | null;
  
  rad_recours_soin_urgence_sans_hosp?: 'Oui' | 'Non' | null;
  recours_soin_urgence_sans_hosp_nb?: number | null;
  
  rad_recours_soin_urgence_generaliste?: 'Oui' | 'Non' | null;
  recours_soin_urgence_generaliste_nb?: number | null;
  
  rad_recours_soin_urgence_psychiatre?: 'Oui' | 'Non' | null;
  recours_soin_urgence_psychiatre_nb?: number | null;
  
  rad_recours_soin_urgence_psychologue?: 'Oui' | 'Non' | null;
  recours_soin_urgence_psychologue_nb?: number | null;
  
  rad_recours_soin_urgence_plusieurs?: 'Oui' | 'Non' | null;
  recours_soin_urgence_plusieurs_nb?: number | null;
  
  rad_recours_soin_urgence_autres?: 'Oui' | 'Non' | null;
  recours_soin_urgence_autres_nb?: number | null;
  
  // ========================================================================
  // TRAITEMENT NON-PHARMACOLOGIQUE
  // ========================================================================
  
  rad_non_pharmacologique?: 'Oui' | 'Non' | 'Ne sais pas' | null;
  
  // Sismotherapie
  rad_non_pharmacologique_sismo?: 'Oui' | 'Non' | 'Ne sais pas' | null;
  non_pharmacologique_sismo_nb?: number | null;
  date_non_pharmacologique_sismo_debut?: string | null;
  date_non_pharmacologique_sismo_fin?: string | null;
  
  // TMS
  rad_non_pharmacologique_tms?: 'Oui' | 'Non' | 'Ne sais pas' | null;
  non_pharmacologique_tms_nb?: number | null;
  date_non_pharmacologique_tms_debut?: string | null;
  date_non_pharmacologique_tms_fin?: string | null;
  
  // TCC
  rad_non_pharmacologique_tcc?: 'Oui' | 'Non' | 'Ne sais pas' | null;
  non_pharmacologique_tcc_nb?: number | null;
  date_non_pharmacologique_tcc_debut?: string | null;
  date_non_pharmacologique_tcc_fin?: string | null;
  
  // Psychoeducation
  rad_non_pharmacologique_psychoed?: 'Oui' | 'Non' | 'Ne sais pas' | null;
  non_pharmacologique_psychoed_nb?: number | null;
  date_non_pharmacologique_psychoed_debut?: string | null;
  date_non_pharmacologique_psychoed_fin?: string | null;
  
  // IPSRT
  rad_non_pharmacologique_ipsrt?: 'Oui' | 'Non' | 'Ne sais pas' | null;
  non_pharmacologique_ipsrt_nb?: number | null;
  chk_non_pharmacologique_ipsrt_precisez?: string[] | null;
  date_non_pharmacologique_ipsrt_debut?: string | null;
  date_non_pharmacologique_ipsrt_fin?: string | null;
  
  // Autre
  rad_non_pharmacologique_autre?: 'Oui' | 'Non' | 'Ne sais pas' | null;
  non_pharmacologique_autre_precisez?: string | null;
  non_pharmacologique_autre_nb?: number | null;
  date_non_pharmacologique_autre_debut?: string | null;
  date_non_pharmacologique_autre_fin?: string | null;
  
  // ========================================================================
  // ARRETS DE TRAVAIL
  // ========================================================================
  
  rad_arret_travail?: 'Oui' | 'Non' | 'Non applicable' | null;
  arret_travail_nb?: number | null;
  arret_travail_duree?: number | null;
  
  // ========================================================================
  // SOMATIQUE ET CONTRACEPTIF
  // ========================================================================
  
  fckedit_somatique_contraceptif?: string | null;
  
  // ========================================================================
  // STATUT PROFESSIONNEL
  // ========================================================================
  
  rad_changement_statut?: 'Oui' | 'Non' | 'Ne sais pas' | null;
  rad_statut_actuel?: 'Sans emploi' | 'Actif' | 'Retraité' | 'Etudiant' | 'Pension' | 'Au foyer' | 'Autres' | null;
  statut_actuel_autre?: string | null;
  rad_social_stprof_class?: string | null;
  
  // ========================================================================
  // Metadata
  // ========================================================================
  
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type PsyTraitementSemestrielResponseInsert = Omit<PsyTraitementSemestrielResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;
