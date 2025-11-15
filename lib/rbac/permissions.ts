// eFondaMental Platform - Permission Constants and Checks

import { UserRole, PermissionCategory } from '../types/enums';

// ============================================================================
// PERMISSION CODES
// ============================================================================

export const PERMISSIONS = {
  // Patient Management
  PATIENT_CREATE: 'patient.create',
  PATIENT_VIEW: 'patient.view',
  PATIENT_EDIT: 'patient.edit',
  PATIENT_DELETE: 'patient.delete',
  PATIENT_EXPORT: 'patient.export',

  // Clinical Operations
  VISIT_CREATE: 'visit.create',
  VISIT_VIEW: 'visit.view',
  VISIT_EDIT: 'visit.edit',
  VISIT_COMPLETE: 'visit.complete',
  VISIT_DELETE: 'visit.delete',

  // Questionnaires
  QUESTIONNAIRE_FILL: 'questionnaire.fill',
  QUESTIONNAIRE_VIEW_RESPONSES: 'questionnaire.view_responses',
  QUESTIONNAIRE_MANAGE: 'questionnaire.manage',

  // Evaluations
  EVALUATION_CREATE: 'evaluation.create',
  EVALUATION_VIEW: 'evaluation.view',
  EVALUATION_EDIT: 'evaluation.edit',

  // Statistics
  STATISTICS_CENTER: 'statistics.center',
  STATISTICS_PERSONAL: 'statistics.personal',
  STATISTICS_EXPORT: 'statistics.export',

  // User Management
  USER_CREATE: 'user.create',
  USER_VIEW: 'user.view',
  USER_EDIT: 'user.edit',
  USER_DELETE: 'user.delete',
  USER_MANAGE_PERMISSIONS: 'user.manage_permissions',
  USER_PROMOTE_MANAGER: 'user.promote_manager',

  // Center Management
  CENTER_CREATE: 'center.create',
  CENTER_VIEW_ALL: 'center.view_all',
  CENTER_EDIT: 'center.edit',
  CENTER_DELETE: 'center.delete',
  CENTER_MANAGE_PATHOLOGIES: 'center.manage_pathologies',

  // Audit & Security
  AUDIT_VIEW: 'audit.view',
  AUDIT_VIEW_CENTER: 'audit.view_center',
  SECURITY_DATA_RETENTION: 'security.data_retention',
  SECURITY_GDPR: 'security.gdpr',

  // Communication
  MESSAGE_SEND: 'message.send',
  MESSAGE_VIEW: 'message.view',
} as const;

// ============================================================================
// DEFAULT ROLE PERMISSIONS
// ============================================================================

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.ADMINISTRATOR]: [
    // Full access to everything
    PERMISSIONS.PATIENT_CREATE,
    PERMISSIONS.PATIENT_VIEW,
    PERMISSIONS.PATIENT_EDIT,
    PERMISSIONS.PATIENT_DELETE,
    PERMISSIONS.PATIENT_EXPORT,
    PERMISSIONS.VISIT_CREATE,
    PERMISSIONS.VISIT_VIEW,
    PERMISSIONS.VISIT_EDIT,
    PERMISSIONS.VISIT_COMPLETE,
    PERMISSIONS.VISIT_DELETE,
    PERMISSIONS.QUESTIONNAIRE_FILL,
    PERMISSIONS.QUESTIONNAIRE_VIEW_RESPONSES,
    PERMISSIONS.QUESTIONNAIRE_MANAGE,
    PERMISSIONS.EVALUATION_CREATE,
    PERMISSIONS.EVALUATION_VIEW,
    PERMISSIONS.EVALUATION_EDIT,
    PERMISSIONS.STATISTICS_CENTER,
    PERMISSIONS.STATISTICS_PERSONAL,
    PERMISSIONS.STATISTICS_EXPORT,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_MANAGE_PERMISSIONS,
    PERMISSIONS.USER_PROMOTE_MANAGER,
    PERMISSIONS.CENTER_CREATE,
    PERMISSIONS.CENTER_VIEW_ALL,
    PERMISSIONS.CENTER_EDIT,
    PERMISSIONS.CENTER_DELETE,
    PERMISSIONS.CENTER_MANAGE_PATHOLOGIES,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.AUDIT_VIEW_CENTER,
    PERMISSIONS.SECURITY_DATA_RETENTION,
    PERMISSIONS.SECURITY_GDPR,
    PERMISSIONS.MESSAGE_SEND,
    PERMISSIONS.MESSAGE_VIEW,
  ],

  [UserRole.MANAGER]: [
    // Full access within their center
    PERMISSIONS.PATIENT_CREATE,
    PERMISSIONS.PATIENT_VIEW,
    PERMISSIONS.PATIENT_EDIT,
    PERMISSIONS.PATIENT_EXPORT,
    PERMISSIONS.VISIT_CREATE,
    PERMISSIONS.VISIT_VIEW,
    PERMISSIONS.VISIT_EDIT,
    PERMISSIONS.VISIT_COMPLETE,
    PERMISSIONS.QUESTIONNAIRE_FILL,
    PERMISSIONS.QUESTIONNAIRE_VIEW_RESPONSES,
    PERMISSIONS.EVALUATION_CREATE,
    PERMISSIONS.EVALUATION_VIEW,
    PERMISSIONS.EVALUATION_EDIT,
    PERMISSIONS.STATISTICS_CENTER,
    PERMISSIONS.STATISTICS_PERSONAL,
    PERMISSIONS.STATISTICS_EXPORT,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.USER_MANAGE_PERMISSIONS,
    PERMISSIONS.USER_PROMOTE_MANAGER,
    PERMISSIONS.AUDIT_VIEW_CENTER,
    PERMISSIONS.MESSAGE_SEND,
    PERMISSIONS.MESSAGE_VIEW,
  ],

  [UserRole.HEALTHCARE_PROFESSIONAL]: [
    // Clinical operations and their own patients
    PERMISSIONS.PATIENT_CREATE,
    PERMISSIONS.PATIENT_VIEW,
    PERMISSIONS.PATIENT_EDIT,
    PERMISSIONS.VISIT_CREATE,
    PERMISSIONS.VISIT_VIEW,
    PERMISSIONS.VISIT_EDIT,
    PERMISSIONS.VISIT_COMPLETE,
    PERMISSIONS.QUESTIONNAIRE_FILL,
    PERMISSIONS.QUESTIONNAIRE_VIEW_RESPONSES,
    PERMISSIONS.EVALUATION_CREATE,
    PERMISSIONS.EVALUATION_VIEW,
    PERMISSIONS.EVALUATION_EDIT,
    PERMISSIONS.STATISTICS_PERSONAL,
    PERMISSIONS.MESSAGE_SEND,
    PERMISSIONS.MESSAGE_VIEW,
    // Note: STATISTICS_CENTER is granted by manager on case-by-case basis
  ],

  [UserRole.PATIENT]: [
    // Limited to self-service
    PERMISSIONS.QUESTIONNAIRE_FILL,
    PERMISSIONS.MESSAGE_SEND,
    PERMISSIONS.MESSAGE_VIEW,
  ],
};

// ============================================================================
// PERMISSION CHECKING UTILITIES
// ============================================================================

export function hasPermission(
  userPermissions: string[],
  requiredPermission: string
): boolean {
  return userPermissions.includes(requiredPermission);
}

export function hasAnyPermission(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
}

export function hasAllPermissions(
  userPermissions: string[],
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );
}

export function getDefaultPermissionsForRole(role: UserRole): string[] {
  return DEFAULT_ROLE_PERMISSIONS[role] || [];
}

// ============================================================================
// PERMISSION GROUPING
// ============================================================================

export const PERMISSION_GROUPS: Record<
  PermissionCategory,
  { name: string; permissions: string[] }
> = {
  [PermissionCategory.PATIENT_MANAGEMENT]: {
    name: 'Patient Management',
    permissions: [
      PERMISSIONS.PATIENT_CREATE,
      PERMISSIONS.PATIENT_VIEW,
      PERMISSIONS.PATIENT_EDIT,
      PERMISSIONS.PATIENT_DELETE,
      PERMISSIONS.PATIENT_EXPORT,
    ],
  },
  [PermissionCategory.CLINICAL]: {
    name: 'Clinical Operations',
    permissions: [
      PERMISSIONS.VISIT_CREATE,
      PERMISSIONS.VISIT_VIEW,
      PERMISSIONS.VISIT_EDIT,
      PERMISSIONS.VISIT_COMPLETE,
      PERMISSIONS.VISIT_DELETE,
      PERMISSIONS.QUESTIONNAIRE_FILL,
      PERMISSIONS.QUESTIONNAIRE_VIEW_RESPONSES,
      PERMISSIONS.QUESTIONNAIRE_MANAGE,
      PERMISSIONS.EVALUATION_CREATE,
      PERMISSIONS.EVALUATION_VIEW,
      PERMISSIONS.EVALUATION_EDIT,
    ],
  },
  [PermissionCategory.STATISTICS]: {
    name: 'Statistics & Analytics',
    permissions: [
      PERMISSIONS.STATISTICS_CENTER,
      PERMISSIONS.STATISTICS_PERSONAL,
      PERMISSIONS.STATISTICS_EXPORT,
    ],
  },
  [PermissionCategory.USER_MANAGEMENT]: {
    name: 'User Management',
    permissions: [
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_VIEW,
      PERMISSIONS.USER_EDIT,
      PERMISSIONS.USER_DELETE,
      PERMISSIONS.USER_MANAGE_PERMISSIONS,
      PERMISSIONS.USER_PROMOTE_MANAGER,
    ],
  },
  [PermissionCategory.CENTER_MANAGEMENT]: {
    name: 'Center Management',
    permissions: [
      PERMISSIONS.CENTER_CREATE,
      PERMISSIONS.CENTER_VIEW_ALL,
      PERMISSIONS.CENTER_EDIT,
      PERMISSIONS.CENTER_DELETE,
      PERMISSIONS.CENTER_MANAGE_PATHOLOGIES,
    ],
  },
  [PermissionCategory.AUDIT_SECURITY]: {
    name: 'Audit & Security',
    permissions: [
      PERMISSIONS.AUDIT_VIEW,
      PERMISSIONS.AUDIT_VIEW_CENTER,
      PERMISSIONS.SECURITY_DATA_RETENTION,
      PERMISSIONS.SECURITY_GDPR,
    ],
  },
  [PermissionCategory.COMMUNICATION]: {
    name: 'Communication',
    permissions: [PERMISSIONS.MESSAGE_SEND, PERMISSIONS.MESSAGE_VIEW],
  },
};

// ============================================================================
// PERMISSION VALIDATION
// ============================================================================

export function validatePermission(permission: string): boolean {
  return Object.values(PERMISSIONS).includes(permission as any);
}

export function filterValidPermissions(permissions: string[]): string[] {
  return permissions.filter(validatePermission);
}

