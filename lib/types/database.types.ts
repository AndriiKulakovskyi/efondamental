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
  created_by: string;
  created_at: string;
  updated_at: string;
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

export interface Module {
  id: string;
  visit_template_id: string;
  name: string;
  description: string | null;
  order_index: number;
  metadata: Record<string, any>;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  metadata?: Record<string, any>;
}

export interface ConditionalLogic {
  rules: ConditionalRule[];
}

export interface ConditionalRule {
  condition: {
    questionId: string;
    operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
    value: any;
  };
  action: {
    type: 'show_question' | 'hide_question' | 'show_subquestionnaire' | 'required';
    questionId?: string;
    questionnaire?: string;
  };
}

export interface Questionnaire {
  id: string;
  module_id: string | null;
  code: string;
  title: string;
  description: string | null;
  target_role: UserRole | null;
  questions: Question[];
  conditional_logic: ConditionalLogic | null;
  metadata: Record<string, any>;
  version: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

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

export interface QuestionnaireResponse {
  id: string;
  visit_id: string;
  questionnaire_id: string;
  patient_id: string;
  responses: Record<string, any>;
  completed_by: string | null;
  started_at: string;
  completed_at: string | null;
  status: QuestionnaireResponseStatus;
  metadata: Record<string, any>;
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

export type PatientInsert = Omit<Patient, 'id' | 'created_at' | 'updated_at'>;
export type PatientUpdate = Partial<Omit<PatientInsert, 'center_id' | 'created_by'>>;

export type VisitInsert = Omit<Visit, 'id' | 'created_at' | 'updated_at'>;
export type VisitUpdate = Partial<Omit<VisitInsert, 'patient_id' | 'created_by'>>;

export type QuestionnaireResponseInsert = Omit<QuestionnaireResponse, 'id' | 'created_at' | 'updated_at'>;
export type QuestionnaireResponseUpdate = Partial<Omit<QuestionnaireResponseInsert, 'visit_id' | 'questionnaire_id' | 'patient_id'>>;

export type UserInvitationInsert = Omit<UserInvitation, 'id' | 'created_at' | 'updated_at'>;
export type UserProfileInsert = Omit<UserProfile, 'created_at' | 'updated_at'>;
export type UserProfileUpdate = Partial<Omit<UserProfileInsert, 'id' | 'created_by'>>;

