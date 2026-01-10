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
  [PathologyType.BIPOLAR]: 'Troubles Bipolaires',
  [PathologyType.SCHIZOPHRENIA]: 'Schizophrénie',
  [PathologyType.ASD_ASPERGER]: 'Trouble du Spectre de l\'Autisme - Asperger',
  [PathologyType.DEPRESSION]: 'Dépression',
};

// Role display names
export const ROLE_NAMES: Record<UserRole, string> = {
  [UserRole.ADMINISTRATOR]: 'Administrateur',
  [UserRole.MANAGER]: 'Manager',
  [UserRole.HEALTHCARE_PROFESSIONAL]: 'Professionnel de Santé',
  [UserRole.PATIENT]: 'Patient',
};

// Visit type display names
export const VISIT_TYPE_NAMES: Record<VisitType, string> = {
  [VisitType.SCREENING]: 'Visite de Dépistage',
  [VisitType.INITIAL_EVALUATION]: 'Évaluation Initiale',
  [VisitType.BIANNUAL_FOLLOWUP]: 'Suivi Semestriel',
  [VisitType.ANNUAL_EVALUATION]: 'Évaluation Annuelle',
  [VisitType.OFF_SCHEDULE]: 'Visite Hors Programme',
};

// Pathology-specific visit types configuration
// This documents which visit types are available for each pathology
// The actual enforcement is done via visit_templates table (active flag)
export const PATHOLOGY_VISIT_TYPES: Record<PathologyType, VisitType[]> = {
  [PathologyType.BIPOLAR]: [
    VisitType.SCREENING,
    VisitType.INITIAL_EVALUATION,
    VisitType.BIANNUAL_FOLLOWUP,
    VisitType.ANNUAL_EVALUATION,
    VisitType.OFF_SCHEDULE,
  ],
  [PathologyType.SCHIZOPHRENIA]: [
    VisitType.SCREENING,
    VisitType.INITIAL_EVALUATION,
    VisitType.ANNUAL_EVALUATION,
  ],
  [PathologyType.ASD_ASPERGER]: [
    VisitType.SCREENING,
    VisitType.INITIAL_EVALUATION,
    VisitType.BIANNUAL_FOLLOWUP,
    VisitType.ANNUAL_EVALUATION,
    VisitType.OFF_SCHEDULE,
  ],
  [PathologyType.DEPRESSION]: [
    VisitType.SCREENING,
    VisitType.INITIAL_EVALUATION,
    VisitType.BIANNUAL_FOLLOWUP,
    VisitType.ANNUAL_EVALUATION,
    VisitType.OFF_SCHEDULE,
  ],
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

