// eFondaMental Platform - Type Enums
// Enums matching database types

export enum UserRole {
  ADMINISTRATOR = 'administrator',
  MANAGER = 'manager',
  HEALTHCARE_PROFESSIONAL = 'healthcare_professional',
  PATIENT = 'patient',
}

export enum PathologyType {
  BIPOLAR = 'bipolar',
  SCHIZOPHRENIA = 'schizophrenia',
  ASD_ASPERGER = 'asd_asperger',
  DEPRESSION = 'depression',
}

export enum VisitType {
  SCREENING = 'screening',
  INITIAL_EVALUATION = 'initial_evaluation',
  BIANNUAL_FOLLOWUP = 'biannual_followup',
  ANNUAL_EVALUATION = 'annual_evaluation',
  OFF_SCHEDULE = 'off_schedule',
}

export enum QuestionType {
  TEXT = 'text',
  NUMBER = 'number',
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  SCALE = 'scale',
  DATE = 'date',
  BOOLEAN = 'boolean',
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired',
}

export enum VisitStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum QuestionnaireResponseStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
  LOGIN = 'login',
  LOGOUT = 'logout',
  EXPORT = 'export',
}

// Pathology display names
export const PATHOLOGY_NAMES: Record<PathologyType, string> = {
  [PathologyType.BIPOLAR]: 'Bipolar Disorder',
  [PathologyType.SCHIZOPHRENIA]: 'Schizophrenia',
  [PathologyType.ASD_ASPERGER]: 'Autism Spectrum Disorder - Asperger',
  [PathologyType.DEPRESSION]: 'Depression',
};

// Role display names
export const ROLE_NAMES: Record<UserRole, string> = {
  [UserRole.ADMINISTRATOR]: 'Administrator',
  [UserRole.MANAGER]: 'Manager',
  [UserRole.HEALTHCARE_PROFESSIONAL]: 'Healthcare Professional',
  [UserRole.PATIENT]: 'Patient',
};

// Visit type display names
export const VISIT_TYPE_NAMES: Record<VisitType, string> = {
  [VisitType.SCREENING]: 'Screening Visit',
  [VisitType.INITIAL_EVALUATION]: 'Initial Evaluation',
  [VisitType.BIANNUAL_FOLLOWUP]: 'Biannual Follow-up',
  [VisitType.ANNUAL_EVALUATION]: 'Annual Evaluation',
  [VisitType.OFF_SCHEDULE]: 'Off-Schedule Visit',
};

// Permission categories
export enum PermissionCategory {
  PATIENT_MANAGEMENT = 'patient_management',
  CLINICAL = 'clinical',
  STATISTICS = 'statistics',
  USER_MANAGEMENT = 'user_management',
  CENTER_MANAGEMENT = 'center_management',
  AUDIT_SECURITY = 'audit_security',
  COMMUNICATION = 'communication',
}

