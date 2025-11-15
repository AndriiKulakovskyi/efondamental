// eFondaMental Platform - Role Hierarchy and Capabilities

import { UserRole } from '../types/enums';

// ============================================================================
// ROLE HIERARCHY
// ============================================================================

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.ADMINISTRATOR]: 4,
  [UserRole.MANAGER]: 3,
  [UserRole.HEALTHCARE_PROFESSIONAL]: 2,
  [UserRole.PATIENT]: 1,
};

// ============================================================================
// ROLE CAPABILITIES
// ============================================================================

export interface RoleCapabilities {
  canCreateUsers: UserRole[];
  canManageCenter: boolean;
  canViewAllCenters: boolean;
  canAccessGlobalStats: boolean;
  canManagePermissions: boolean;
  requiresCenter: boolean;
  canPromoteToRoles: UserRole[];
  defaultRedirect: string;
}

export const ROLE_CAPABILITIES: Record<UserRole, RoleCapabilities> = {
  [UserRole.ADMINISTRATOR]: {
    canCreateUsers: [UserRole.MANAGER, UserRole.ADMINISTRATOR],
    canManageCenter: true,
    canViewAllCenters: true,
    canAccessGlobalStats: true,
    canManagePermissions: true,
    requiresCenter: false,
    canPromoteToRoles: [UserRole.MANAGER, UserRole.ADMINISTRATOR],
    defaultRedirect: '/admin',
  },

  [UserRole.MANAGER]: {
    canCreateUsers: [
      UserRole.HEALTHCARE_PROFESSIONAL,
      UserRole.PATIENT,
      UserRole.MANAGER,
    ],
    canManageCenter: false,
    canViewAllCenters: false,
    canAccessGlobalStats: false,
    canManagePermissions: true,
    requiresCenter: true,
    canPromoteToRoles: [UserRole.MANAGER],
    defaultRedirect: '/manager',
  },

  [UserRole.HEALTHCARE_PROFESSIONAL]: {
    canCreateUsers: [UserRole.PATIENT],
    canManageCenter: false,
    canViewAllCenters: false,
    canAccessGlobalStats: false,
    canManagePermissions: false,
    requiresCenter: true,
    canPromoteToRoles: [],
    defaultRedirect: '/professional',
  },

  [UserRole.PATIENT]: {
    canCreateUsers: [],
    canManageCenter: false,
    canViewAllCenters: false,
    canAccessGlobalStats: false,
    canManagePermissions: false,
    requiresCenter: true,
    canPromoteToRoles: [],
    defaultRedirect: '/patient',
  },
};

// ============================================================================
// ROLE UTILITIES
// ============================================================================

export function getRoleLevel(role: UserRole): number {
  return ROLE_HIERARCHY[role] || 0;
}

export function isRoleHigherThan(role1: UserRole, role2: UserRole): boolean {
  return getRoleLevel(role1) > getRoleLevel(role2);
}

export function isRoleEqualOrHigherThan(
  role1: UserRole,
  role2: UserRole
): boolean {
  return getRoleLevel(role1) >= getRoleLevel(role2);
}

export function canUserCreateRole(
  userRole: UserRole,
  targetRole: UserRole
): boolean {
  const capabilities = ROLE_CAPABILITIES[userRole];
  return capabilities.canCreateUsers.includes(targetRole);
}

export function canUserPromoteToRole(
  userRole: UserRole,
  targetRole: UserRole
): boolean {
  const capabilities = ROLE_CAPABILITIES[userRole];
  return capabilities.canPromoteToRoles.includes(targetRole);
}

export function getDefaultRedirectForRole(role: UserRole): string {
  return ROLE_CAPABILITIES[role]?.defaultRedirect || '/';
}

export function doesRoleRequireCenter(role: UserRole): boolean {
  return ROLE_CAPABILITIES[role]?.requiresCenter || false;
}

export function canRoleManageCenter(role: UserRole): boolean {
  return ROLE_CAPABILITIES[role]?.canManageCenter || false;
}

export function canRoleViewAllCenters(role: UserRole): boolean {
  return ROLE_CAPABILITIES[role]?.canViewAllCenters || false;
}

export function canRoleAccessGlobalStats(role: UserRole): boolean {
  return ROLE_CAPABILITIES[role]?.canAccessGlobalStats || false;
}

export function canRoleManagePermissions(role: UserRole): boolean {
  return ROLE_CAPABILITIES[role]?.canManagePermissions || false;
}

// ============================================================================
// ROLE VALIDATION
// ============================================================================

export function isValidRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole);
}

export function validateRoleTransition(
  currentRole: UserRole,
  newRole: UserRole,
  actorRole: UserRole
): { valid: boolean; reason?: string } {
  // Cannot demote to a lower role
  if (getRoleLevel(newRole) < getRoleLevel(currentRole)) {
    return {
      valid: false,
      reason: 'Cannot demote users to lower roles',
    };
  }

  // Actor must be able to promote to target role
  if (!canUserPromoteToRole(actorRole, newRole)) {
    return {
      valid: false,
      reason: `Your role does not have permission to promote to ${newRole}`,
    };
  }

  // Actor must be higher level than target
  if (!isRoleHigherThan(actorRole, currentRole)) {
    return {
      valid: false,
      reason: 'You cannot modify users of equal or higher role',
    };
  }

  return { valid: true };
}

// ============================================================================
// ROUTE ACCESS CONTROL
// ============================================================================

export const PROTECTED_ROUTES: Record<
  string,
  { allowedRoles: UserRole[]; requiresPermissions?: string[] }
> = {
  '/admin': {
    allowedRoles: [UserRole.ADMINISTRATOR],
  },
  '/admin/centers': {
    allowedRoles: [UserRole.ADMINISTRATOR],
  },
  '/admin/settings': {
    allowedRoles: [UserRole.ADMINISTRATOR],
  },
  '/admin/gdpr': {
    allowedRoles: [UserRole.ADMINISTRATOR],
  },
  '/manager': {
    allowedRoles: [UserRole.MANAGER, UserRole.ADMINISTRATOR],
  },
  '/manager/professionals': {
    allowedRoles: [UserRole.MANAGER, UserRole.ADMINISTRATOR],
  },
  '/manager/patients': {
    allowedRoles: [UserRole.MANAGER, UserRole.ADMINISTRATOR],
  },
  '/professional': {
    allowedRoles: [
      UserRole.HEALTHCARE_PROFESSIONAL,
      UserRole.MANAGER,
      UserRole.ADMINISTRATOR,
    ],
  },
  '/patient': {
    allowedRoles: [UserRole.PATIENT],
  },
};

export function canAccessRoute(
  route: string,
  userRole: UserRole
): boolean {
  // Find matching route (check exact match first, then prefix match)
  let routeConfig = PROTECTED_ROUTES[route];

  if (!routeConfig) {
    // Check for prefix match
    const matchingRoute = Object.keys(PROTECTED_ROUTES).find((key) =>
      route.startsWith(key)
    );
    if (matchingRoute) {
      routeConfig = PROTECTED_ROUTES[matchingRoute];
    }
  }

  if (!routeConfig) {
    // Route not protected, allow access
    return true;
  }

  return routeConfig.allowedRoles.includes(userRole);
}

export function getAccessibleRoutes(userRole: UserRole): string[] {
  return Object.entries(PROTECTED_ROUTES)
    .filter(([_, config]) => config.allowedRoles.includes(userRole))
    .map(([route]) => route);
}

