// eFondaMental Platform - Database Types
// Generated types matching Supabase schema

import {
  UserRole,
  PathologyType,
  VisitType,
  QuestionType,
  InvitationStatus,
  VisitStatus,
  QuestionnaireResponseStatus,
} from './enums';

// ============================================================================
// DATABASE TABLE TYPES
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

export interface Pathology {
  id: string;
  type: PathologyType;
  name: string;
  description: string | null;
  color: string | null;
  created_at: string;
}

export interface CenterPathology {
  id: string;
  center_id: string;
  pathology_id: string;
  created_at: string;
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  description: string | null;
  category: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  center_id: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  username: string | null;
  active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface UserPermission {
  id: string;
  user_id: string;
  permission_id: string;
  granted_by: string | null;
  granted_at: string;
}

export interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  center_id: string | null;
  patient_id: string | null;
  first_name: string | null;
  last_name: string | null;
  token: string;
  status: InvitationStatus;
  invited_by: string;
  accepted_by: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

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
  emergency_contact: EmergencyContact | null;
  metadata: Record<string, any>;
  active: boolean;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface VisitTemplate {
  id: string;
  pathology_id: string;
  visit_type: VisitType;
  name: string;
  description: string | null;
  order_index: number;
  metadata: Record<string, any>;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Removed Module interface as table is dropped

// UI/Logic Types (Not DB Tables anymore, but used in code)
export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  required: boolean;
  options?: (string | { code: string | number; label: string; score?: number })[];
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  help?: string;
  metadata?: Record<string, any>;
  display_if?: any; // For simple condition logic if needed in UI
}

// Removed ConditionalLogic, ConditionalRule, Questionnaire interfaces

export interface Visit {
  id: string;
  patient_id: string;
  visit_template_id: string;
  visit_type: VisitType;
  scheduled_date: string | null;
  completed_date: string | null;
  status: VisitStatus;
  notes: string | null;
  conducted_by: string | null;
  metadata: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// New Specific Response Tables

export interface AsrmResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  total_score?: number; // Generated
  interpretation?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

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
  total_score?: number | null;
  interpretation?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface MdqResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1_1: boolean;
  q1_2: boolean;
  q1_3: boolean;
  q1_4: boolean;
  q1_5: boolean;
  q1_6: boolean;
  q1_7: boolean;
  q1_8: boolean;
  q1_9: boolean;
  q1_10: boolean;
  q1_11: boolean;
  q1_12: boolean;
  q1_13: boolean;
  q2?: boolean | null;
  q3?: number | null;
  positive_screen?: boolean | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface BipolarDiagnosticResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  diagnostic_principal: 'bipolar_1' | 'bipolar_2' | 'cyclothymia' | 'other_bipolar' | 'no_bipolar';
  episode_actuel?: 'manic' | 'hypomanic' | 'depressive' | 'mixed' | 'euthymic' | null;
  comorbidites?: string[] | null;
  antecedents_psychiatriques?: string | null;
  notes_cliniques?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface OrientationResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  eligible_centre_expert: boolean;
  criteres_eligibilite?: string[] | null;
  urgence_orientation?: 'immediate' | 'rapid' | 'standard' | null;
  centre_expert_propose?: string | null;
  commentaires?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface Evaluation {
  id: string;
  patient_id: string;
  visit_id: string | null;
  evaluator_id: string;
  evaluation_date: string;
  diagnosis: string | null;
  clinical_notes: string | null;
  risk_assessment: RiskAssessment | null;
  treatment_plan: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface RiskAssessment {
  suicide_risk?: 'none' | 'low' | 'moderate' | 'high';
  relapse_risk?: 'none' | 'low' | 'moderate' | 'high';
  notes?: string;
}

export interface RecentAccess {
  id: string;
  user_id: string;
  patient_id: string;
  accessed_at: string;
}

export interface Message {
  id: string;
  patient_id: string;
  sender_id: string;
  recipient_id: string | null;
  subject: string | null;
  content: string;
  read: boolean;
  parent_message_id: string | null;
  created_at: string;
}

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
  metadata: Record<string, any>;
  created_at: string;
}

export interface LoginHistory {
  id: string;
  user_id: string | null;
  success: boolean;
  ip_address: string | null;
  user_agent: string | null;
  method: string | null;
  failure_reason: string | null;
  created_at: string;
}

// ============================================================================
// DATABASE VIEW TYPES
// ============================================================================

export interface UserFull extends UserProfile {
  center_name: string | null;
  center_code: string | null;
  center_pathologies: PathologyType[] | null;
}

export interface PatientFull extends Patient {
  center_name: string;
  center_code: string;
  pathology_name: string;
  pathology_type: PathologyType;
  pathology_color: string | null;
  created_by_first_name: string | null;
  created_by_last_name: string | null;
  assigned_to_first_name: string | null;
  assigned_to_last_name: string | null;
}

export interface VisitFull extends Visit {
  patient_first_name: string;
  patient_last_name: string;
  medical_record_number: string;
  template_name: string;
  pathology_id: string;
  pathology_name: string;
  conducted_by_first_name: string | null;
  conducted_by_last_name: string | null;
}

// ============================================================================
// INSERT/UPDATE TYPES
// ============================================================================

export type CenterInsert = Omit<Center, 'id' | 'created_at' | 'updated_at'>;
export type CenterUpdate = Partial<CenterInsert>;

export type PatientInsert = Omit<Patient, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'deleted_at' | 'deleted_by'>;
export type PatientUpdate = Partial<Omit<PatientInsert, 'center_id' | 'created_by'>>;

export type VisitInsert = Omit<Visit, 'id' | 'created_at' | 'updated_at'>;
export type VisitUpdate = Partial<Omit<VisitInsert, 'patient_id' | 'created_by'>>;

export type AsrmResponseInsert = Omit<AsrmResponse, 'id' | 'created_at' | 'updated_at' | 'total_score' | 'interpretation' | 'completed_at'>;
export type QidsResponseInsert = Omit<QidsResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;
export type MdqResponseInsert = Omit<MdqResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;
export type BipolarDiagnosticResponseInsert = Omit<BipolarDiagnosticResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;
export type OrientationResponseInsert = Omit<OrientationResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

export type UserInvitationInsert = Omit<UserInvitation, 'id' | 'created_at' | 'updated_at' | 'accepted_by'>;
export type UserProfileInsert = Omit<UserProfile, 'created_at' | 'updated_at'>;
export type UserProfileUpdate = Partial<Omit<UserProfileInsert, 'id' | 'created_by'>>;
