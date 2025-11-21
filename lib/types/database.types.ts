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
  gender: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  emergency_contact: Record<string, any> | null;
  metadata: Record<string, any> | null;
  active: boolean;
  assigned_to: string | null;
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

export type VisitInsert = Omit<Visit, 'id' | 'created_at' | 'updated_at'>;
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
  type: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'scale' | 'boolean' | 'date' | 'section';
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
  q5?: number | null; // Irritabilité (0-8, double weighted)
  q6?: number | null; // Débit verbal (0-8, double weighted)
  q7?: number | null; // Troubles du cours de la pensée (0-4)
  q8?: number | null; // Contenu de la pensée (0-8, double weighted)
  q9?: number | null; // Comportement agressif (0-8, double weighted)
  q10?: number | null; // Apparence (0-4)
  q11?: number | null; // Insight (0-4)
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
  current_functioning?: number | null; // 1-100
  worst_past_year?: number | null; // 1-100
  best_past_year?: number | null; // 1-100
  current_interpretation?: string | null;
  worst_interpretation?: string | null;
  best_interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}
export type EgfResponseInsert = Omit<EgfResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'current_interpretation' | 'worst_interpretation' | 'best_interpretation'>;

// ALDA (Lithium Response Scale)
export interface AldaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  a_score?: number | null; // 0-10
  b1?: number | null; // 0-2
  b2?: number | null; // 0-2
  b3?: number | null; // 0-2
  b4?: number | null; // 0-2
  b5?: number | null; // 0-2
  b_total_score?: number | null;
  alda_score?: number | null; // A - B
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}
export type AldaResponseInsert = Omit<AldaResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'b_total_score' | 'alda_score' | 'interpretation'>;

// Etat du patient (Patient State)
export interface EtatPatientResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  euthymia_severity?: number | null; // 0-3
  euthymia_duration?: number | null;
  mania_severity?: number | null; // 0-3
  mania_duration?: number | null;
  depression_severity?: number | null; // 0-3
  depression_duration?: number | null;
  mixed_severity?: number | null; // 0-3
  mixed_duration?: number | null;
  current_state?: string | null;
  state_details?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}
export type EtatPatientResponseInsert = Omit<EtatPatientResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at' | 'current_state' | 'state_details'>;

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
  has_substitution?: boolean | null;
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
  
  // Bilan Lipidique
  hdl?: number | null;
  hdl_unit?: 'mmol_L' | 'g_L' | null;
  ldl?: number | null;
  ldl_unit?: 'mmol_L' | 'g_L' | null;
  cholesterol_total?: number | null;
  triglycerides?: number | null;
  
  // Bilan Hépatique
  pal?: number | null;
  asat?: number | null;
  alat?: number | null;
  bilirubine_totale?: number | null;
  bilirubine_unit?: 'umol_L' | 'mmol_L' | 'mg_L' | null;
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
  
  // HCG & Prolactine
  beta_hcg?: number | null;
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
    'trouble_depressif_majeur_isole' | 'trouble_depressif_majeur_recurrent' | 
    'trouble_dysthymique' | 'trouble_cyclothymique' | 'trouble_depressif_non_specifie' |
    'trouble_humeur_affection_medicale' | 'trouble_humeur_induit_substance' | null;
  
  // Medical condition
  medical_condition_affection_type?: 'endocrinienne' | 'neurologique' | 'cardio_vasculaire' | 'autre' | null;
  medical_condition_affection_autre?: string | null;
  
  // Substance-induced
  substance_types?: string[] | null; // Array of substance types
  substance_autre?: string | null;
  
  // Section 2: First Episode Characteristics
  first_episode_type?: 'edm_sans_psychotiques' | 'edm_avec_psychotiques' | 'hypomanie' | 
    'manie_sans_psychotiques' | 'manie_avec_psychotiques' | 'ne_sais_pas' | null;
  postpartum_first?: boolean | null;
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
  age_first_hypomanic?: number | null;
  
  // 3.3 Manic episodes
  num_manic?: number | null;
  age_first_manic?: number | null;
  manic_with_psychotic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  num_manic_psychotic?: number | null;
  manic_with_mixed?: 'oui' | 'non' | 'ne_sais_pas' | null;
  num_manic_mixed?: number | null;
  induced_episodes?: 'oui' | 'non' | 'ne_sais_pas' | null;
  num_induced_episodes?: number | null;
  rapid_cycling?: 'oui' | 'non' | 'ne_sais_pas' | null;
  complete_remission?: 'oui' | 'non' | 'ne_sais_pas' | null;
  seasonal_pattern?: 'oui' | 'non' | 'ne_sais_pas' | null;
  seasonal_types?: string[] | null; // Array of seasonal patterns
  
  age_first_psychotrope?: number | null;
  age_first_hospitalization?: number | null;
  
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
  
  // Work leave subsection
  past_year_work_leave?: 'oui' | 'non' | 'non_applicable' | null;
  
  // Section 4: Most Recent Episode
  recent_episode_start_date?: string | null;
  recent_episode_end_date?: string | null;
  recent_episode_type?: 'edm' | 'hypomanie' | 'manie' | 'non_specifie' | 'ne_sais_pas' | null;
  
  // EDM specific
  recent_edm_subtypes?: string[] | null; // Array of subtypes
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
  current_episode_type?: 'edm' | 'hypomanie' | 'manie' | 'non_specifie' | 'ne_sais_pas' | null;
  
  // EDM specific
  current_edm_subtypes?: string[] | null; // Array of subtypes
  current_edm_severity?: 'leger' | 'modere' | 'severe_sans_psychotiques' | 
    'severe_psychotiques_non_congruentes' | 'severe_psychotiques_congruentes' | null;
  current_edm_chronic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  current_edm_postpartum?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  // Hypomanie specific
  current_hypomanie_postpartum?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  // Manie specific
  current_manie_catatonic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  current_manie_mixed?: 'oui' | 'non' | 'ne_sais_pas' | null;
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
  panic_no_agoraphobia_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  panic_no_agoraphobia_age_debut?: number | null;
  panic_no_agoraphobia_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  panic_with_agoraphobia_present?: 'oui' | 'non' | 'ne_sais_pas' | null;
  panic_with_agoraphobia_age_debut?: number | null;
  panic_with_agoraphobia_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
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
  anorexia_restrictive_amenorrhea?: 'oui' | 'non' | null;
  anorexia_restrictive_age_debut?: number | null;
  anorexia_restrictive_age_fin?: number | null;
  anorexia_restrictive_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  anorexia_restrictive_current?: boolean | null;
  anorexia_bulimic_amenorrhea?: 'oui' | 'non' | null;
  anorexia_bulimic_age_debut?: number | null;
  anorexia_bulimic_age_fin?: number | null;
  anorexia_bulimic_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  anorexia_bulimic_current?: boolean | null;
  bulimia_age_debut?: number | null;
  bulimia_age_fin?: number | null;
  bulimia_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  bulimia_current?: boolean | null;
  binge_eating_age_debut?: number | null;
  binge_eating_age_fin?: number | null;
  binge_eating_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  binge_eating_current?: boolean | null;
  eating_unspecified_age_debut?: number | null;
  eating_unspecified_age_fin?: number | null;
  eating_unspecified_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  eating_unspecified_current?: boolean | null;
  night_eating_age_debut?: number | null;
  night_eating_age_fin?: number | null;
  night_eating_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  night_eating_current?: boolean | null;
  
  // Section 4: Somatoform Disorder
  has_somatoform_disorder?: 'oui' | 'non' | 'ne_sais_pas' | null;
  somatoform_type?: 'trouble_somatisation' | 'trouble_douloureux' | 'trouble_indifferencie' | 
    'hypocondrie' | 'peur_dysmorphie_corporelle' | null;
  somatoform_age_debut?: number | null;
  somatoform_symptoms_past_month?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  // Section 5: ADHD DIVA Assessment
  diva_evaluated?: 'oui' | 'non' | 'ne_sais_pas' | null;
  diva_a1a_adult?: boolean | null;
  diva_a1a_childhood?: boolean | null;
  diva_a1b_adult?: boolean | null;
  diva_a1b_childhood?: boolean | null;
  diva_a1c_adult?: boolean | null;
  diva_a1c_childhood?: boolean | null;
  diva_a1d_adult?: boolean | null;
  diva_a1d_childhood?: boolean | null;
  diva_a1e_adult?: boolean | null;
  diva_a1e_childhood?: boolean | null;
  diva_a1f_adult?: boolean | null;
  diva_a1f_childhood?: boolean | null;
  diva_a1g_adult?: boolean | null;
  diva_a1g_childhood?: boolean | null;
  diva_a1h_adult?: boolean | null;
  diva_a1h_childhood?: boolean | null;
  diva_a1i_adult?: boolean | null;
  diva_a1i_childhood?: boolean | null;
  diva_a2a_adult?: boolean | null;
  diva_a2a_childhood?: boolean | null;
  diva_a2b_adult?: boolean | null;
  diva_a2b_childhood?: boolean | null;
  diva_a2c_adult?: boolean | null;
  diva_a2c_childhood?: boolean | null;
  diva_a2d_adult?: boolean | null;
  diva_a2d_childhood?: boolean | null;
  diva_a2e_adult?: boolean | null;
  diva_a2e_childhood?: boolean | null;
  diva_a2f_adult?: boolean | null;
  diva_a2f_childhood?: boolean | null;
  diva_a2g_adult?: boolean | null;
  diva_a2g_childhood?: boolean | null;
  diva_a2h_adult?: boolean | null;
  diva_a2h_childhood?: boolean | null;
  diva_a2i_adult?: boolean | null;
  diva_a2i_childhood?: boolean | null;
  diva_total_inattention_adult?: number | null;
  diva_total_inattention_childhood?: number | null;
  diva_total_hyperactivity_adult?: number | null;
  diva_total_hyperactivity_childhood?: number | null;
  diva_criteria_a_inattention_gte6?: boolean | null;
  diva_criteria_a_hyperactivity_gte6?: boolean | null;
  diva_criteria_b_lifetime_persistence?: boolean | null;
  diva_criteria_cd_impairment_childhood?: boolean | null;
  diva_criteria_cd_impairment_adult?: boolean | null;
  diva_criteria_e_better_explained?: boolean | null;
  diva_criteria_e_explanation?: string | null;
  diva_collateral_parents?: number | null;
  diva_collateral_partner?: number | null;
  diva_collateral_school_reports?: number | null;
  diva_collateral_details?: string | null;
  diva_diagnosis?: 'non' | '314_01_combined' | '314_00_inattentive' | '314_01_hyperactive_impulsive' | null;
  
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
  
  // Introduction
  evaluated?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  // Criterion A - Inattention (A1a to A1i)
  a1a_adult?: boolean | null;
  a1a_childhood?: boolean | null;
  a1b_adult?: boolean | null;
  a1b_childhood?: boolean | null;
  a1c_adult?: boolean | null;
  a1c_childhood?: boolean | null;
  a1d_adult?: boolean | null;
  a1d_childhood?: boolean | null;
  a1e_adult?: boolean | null;
  a1e_childhood?: boolean | null;
  a1f_adult?: boolean | null;
  a1f_childhood?: boolean | null;
  a1g_adult?: boolean | null;
  a1g_childhood?: boolean | null;
  a1h_adult?: boolean | null;
  a1h_childhood?: boolean | null;
  a1i_adult?: boolean | null;
  a1i_childhood?: boolean | null;
  
  // Total inattention scores
  total_inattention_adult?: number | null;
  total_inattention_childhood?: number | null;
  
  // Criterion A - Hyperactivity/Impulsivity (A2a to A2i)
  a2a_adult?: boolean | null;
  a2a_childhood?: boolean | null;
  a2b_adult?: boolean | null;
  a2b_childhood?: boolean | null;
  a2c_adult?: boolean | null;
  a2c_childhood?: boolean | null;
  a2d_adult?: boolean | null;
  a2d_childhood?: boolean | null;
  a2e_adult?: boolean | null;
  a2e_childhood?: boolean | null;
  a2f_adult?: boolean | null;
  a2f_childhood?: boolean | null;
  a2g_adult?: boolean | null;
  a2g_childhood?: boolean | null;
  a2h_adult?: boolean | null;
  a2h_childhood?: boolean | null;
  a2i_adult?: boolean | null;
  a2i_childhood?: boolean | null;
  
  // Total hyperactivity/impulsivity scores
  total_hyperactivity_adult?: number | null;
  total_hyperactivity_childhood?: number | null;
  
  // Scoring - Childhood
  criteria_a_inattention_child_gte6?: boolean | null;
  criteria_hi_hyperactivity_child_gte6?: boolean | null;
  
  // Scoring - Adult
  criteria_a_inattention_adult_gte6?: boolean | null;
  criteria_hi_hyperactivity_adult_gte6?: boolean | null;
  
  // General Criteria
  criteria_b_lifetime_persistence?: boolean | null;
  criteria_cd_impairment_childhood?: boolean | null;
  criteria_cd_impairment_adult?: boolean | null;
  criteria_e_better_explained?: boolean | null;
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
// ============================================================================

export interface FamilyHistoryResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Mother
  mother_deceased?: 'oui' | 'non' | 'ne_sais_pas' | null;
  mother_death_cause?: string | null;
  mother_psy_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  mother_psy_thymic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  mother_psy_thymic_type?: 'unipolaire' | 'bipolaire' | 'nsp' | null;
  mother_psy_schizo?: 'oui' | 'non' | 'ne_sais_pas' | null;
  mother_psy_suicide?: number | null;
  mother_psy_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  mother_psy_substance?: 'oui' | 'non' | 'ne_sais_pas' | null;
  mother_psy_substance_types?: string[] | null;
  mother_psy_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  mother_cardio_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  mother_cardio_types?: string[] | null;
  mother_diabetes_type?: number | null;
  
  // Father
  father_deceased?: 'oui' | 'non' | 'ne_sais_pas' | null;
  father_death_cause?: string | null;
  father_psy_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  father_psy_thymic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  father_psy_thymic_type?: 'unipolaire' | 'bipolaire' | 'nsp' | null;
  father_psy_schizo?: 'oui' | 'non' | 'ne_sais_pas' | null;
  father_psy_suicide?: number | null;
  father_psy_dementia?: 'oui' | 'non' | 'ne_sais_pas' | null;
  father_psy_substance?: 'oui' | 'non' | 'ne_sais_pas' | null;
  father_psy_substance_types?: string[] | null;
  father_psy_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  father_cardio_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  father_cardio_types?: string[] | null;
  father_diabetes_type?: number | null;
  
  // Grandparents
  gp_maternal_grandmother_notes?: string | null;
  gp_maternal_grandfather_notes?: string | null;
  gp_paternal_grandmother_notes?: string | null;
  gp_paternal_grandfather_notes?: string | null;
  
  // Children
  has_children?: 'oui' | 'non' | null;
  children_psy_count?: number | null;
  children_cardio_count?: number | null;
  
  child1_gender?: 'M' | 'F' | null;
  child1_dob?: string | null;
  child1_psy_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  child1_psy_details?: string[] | null;
  child1_cardio?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  child2_gender?: 'M' | 'F' | null;
  child2_dob?: string | null;
  child2_psy_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  child2_psy_details?: string[] | null;
  child2_cardio?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  child3_gender?: 'M' | 'F' | null;
  child3_dob?: string | null;
  child3_psy_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  child3_psy_details?: string[] | null;
  child3_cardio?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  child4_gender?: 'M' | 'F' | null;
  child4_dob?: string | null;
  child4_psy_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  child4_psy_details?: string[] | null;
  child4_cardio?: 'oui' | 'non' | 'ne_sais_pas' | null;
  
  // Siblings
  has_siblings?: 'oui' | 'non' | null;
  
  sibling1_gender?: 'M' | 'F' | null;
  sibling1_deceased?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling1_death_cause?: string | null;
  sibling1_psy_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling1_psy_thymic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling1_psy_thymic_type?: 'unipolaire' | 'bipolaire' | 'nsp' | null;
  sibling1_psy_schizo?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling1_psy_suicide?: number | null;
  sibling1_psy_substance?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling1_psy_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling1_cardio_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling1_cardio_types?: string[] | null;
  
  sibling2_gender?: 'M' | 'F' | null;
  sibling2_deceased?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling2_death_cause?: string | null;
  sibling2_psy_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling2_psy_thymic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling2_psy_thymic_type?: 'unipolaire' | 'bipolaire' | 'nsp' | null;
  sibling2_psy_schizo?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling2_psy_suicide?: number | null;
  sibling2_psy_substance?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling2_psy_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling2_cardio_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling2_cardio_types?: string[] | null;
  
  sibling3_gender?: 'M' | 'F' | null;
  sibling3_deceased?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling3_death_cause?: string | null;
  sibling3_psy_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling3_psy_thymic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling3_psy_thymic_type?: 'unipolaire' | 'bipolaire' | 'nsp' | null;
  sibling3_psy_schizo?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling3_psy_suicide?: number | null;
  sibling3_psy_substance?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling3_psy_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling3_cardio_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling3_cardio_types?: string[] | null;
  
  sibling4_gender?: 'M' | 'F' | null;
  sibling4_deceased?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling4_death_cause?: string | null;
  sibling4_psy_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling4_psy_thymic?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling4_psy_thymic_type?: 'unipolaire' | 'bipolaire' | 'nsp' | null;
  sibling4_psy_schizo?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling4_psy_suicide?: number | null;
  sibling4_psy_substance?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling4_psy_anxiety?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling4_cardio_history?: 'oui' | 'non' | 'ne_sais_pas' | null;
  sibling4_cardio_types?: string[] | null;
  
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
  
  // Suicidal Ideation Questions
  q1_wish_dead?: boolean | null;
  q2_non_specific?: boolean | null;
  q3_method_no_intent?: boolean | null;
  q4_intent_no_plan?: boolean | null;
  q5_plan_intent?: boolean | null;
  
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

// ===== C-SSRS History (Histoire des Conduites Suicidaires) Response =====
export interface CssrsHistoryResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Historical Overview
  ts_first_date?: string | null; // Date of first suicide attempt
  ts_total_count?: number | null; // Total number of attempts
  
  // Violent Attempts
  ts_violent_presence?: number | null; // 0=No, 1=Yes, 99=Don't know
  ts_violent_count?: number | null;
  
  // Serious Non-Violent Attempts
  ts_serious_presence?: number | null; // 0=No, 1=Yes, 99=Don't know
  ts_serious_count?: number | null;
  
  // Interrupted Attempts
  ts_interrupted_presence?: number | null; // 0=No, 1=Yes
  ts_interrupted_count?: number | null;
  
  // Aborted Attempts
  ts_aborted_presence?: number | null; // 0=No, 1=Yes
  ts_aborted_count?: number | null;
  
  // Preparations
  ts_preparations?: number | null; // 0=No, 1=Yes
  
  // Lethality - Most Recent
  lethality_recent?: number | null; // 0-5 scale
  date_recent?: string | null;
  
  // Lethality - Most Lethal
  lethality_most_lethal?: number | null; // 0-5 scale
  date_most_lethal?: string | null;
  
  // Lethality - First
  lethality_first?: number | null; // 0-5 scale
  date_first_confirm?: string | null;
  
  // Potential Lethality
  potential_lethality?: string | null;
  
  // Metadata
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type CssrsHistoryResponseInsert = Omit<CssrsHistoryResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

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

