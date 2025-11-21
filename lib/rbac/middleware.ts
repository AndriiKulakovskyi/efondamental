// eFondaMental Platform - RBAC Middleware

import { redirect } from 'next/navigation';
import { cache } from 'react';
import { createClient } from '../supabase/server';
import { UserRole } from '../types/enums';
import { UserProfile } from '../types/database.types';
import { canAccessRoute, getDefaultRedirectForRole } from './roles';
import { hasPermission, getDefaultPermissionsForRole } from './permissions';

// ============================================================================
// AUTHENTICATION CHECK
// ============================================================================

export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login');
  }

  return user;
}

// ============================================================================
// USER PROFILE RETRIEVAL
// ============================================================================

export const getCurrentUserProfile = cache(async (userId?: string): Promise<UserProfile | null> => {
  const supabase = await createClient();
  
  let targetUserId = userId;
  
  if (!targetUserId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }
    targetUserId = user.id;
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', targetUserId)
    .single();

  return profile;
});

export async function requireUserProfile(): Promise<UserProfile> {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect('/auth/login');
  }

  if (!profile.active) {
    redirect('/auth/error?message=Account is inactive');
  }

  return profile;
}

// ============================================================================
// ROLE-BASED ACCESS CONTROL
// ============================================================================

export async function requireRole(allowedRoles: UserRole[]) {
  const profile = await requireUserProfile();

  if (!allowedRoles.includes(profile.role as UserRole)) {
    const defaultRedirect = getDefaultRedirectForRole(profile.role as UserRole);
    redirect(defaultRedirect);
  }

  return profile;
}

export async function requireAdmin() {
  return requireRole([UserRole.ADMINISTRATOR]);
}

export async function requireManager() {
  return requireRole([UserRole.MANAGER, UserRole.ADMINISTRATOR]);
}

export async function requireProfessional() {
  return requireRole([
    UserRole.HEALTHCARE_PROFESSIONAL,
    UserRole.MANAGER,
    UserRole.ADMINISTRATOR,
  ]);
}

export async function requirePatient() {
  return requireRole([UserRole.PATIENT]);
}

// ============================================================================
// PERMISSION-BASED ACCESS CONTROL
// ============================================================================

export const getUserPermissions = cache(async (userId: string, profile?: UserProfile): Promise<string[]> => {
  const supabase = await createClient();

  // Get user's role if not provided
  let userRole = profile?.role;

  if (!userRole) {
    const { data: fetchedProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!fetchedProfile) {
      return [];
    }
    userRole = fetchedProfile.role;
  }

  // Get default permissions for role
  const defaultPermissions = getDefaultPermissionsForRole(userRole);

  // Get additional permissions granted to user
  const { data: userPermissions } = await supabase
    .from('user_permissions')
    .select('permission:permissions(code)')
    .eq('user_id', userId);

  const additionalPermissions =
    userPermissions
      ?.map((up: any) => up.permission?.code)
      .filter(Boolean) || [];

  // Combine and deduplicate
  return Array.from(
    new Set([...defaultPermissions, ...additionalPermissions])
  );
});

export async function requirePermission(requiredPermission: string) {
  const user = await requireAuth();
  const permissions = await getUserPermissions(user.id);

  if (!hasPermission(permissions, requiredPermission)) {
    redirect('/auth/error?message=Insufficient permissions');
  }

  return permissions;
}

export async function checkPermission(
  requiredPermission: string
): Promise<boolean> {
  try {
    const user = await requireAuth();
    const permissions = await getUserPermissions(user.id);
    return hasPermission(permissions, requiredPermission);
  } catch {
    return false;
  }
}

// ============================================================================
// ROUTE PROTECTION
// ============================================================================

export async function protectRoute(pathname: string) {
  const profile = await requireUserProfile();

  if (!canAccessRoute(pathname, profile.role as UserRole)) {
    const defaultRedirect = getDefaultRedirectForRole(profile.role as UserRole);
    redirect(defaultRedirect);
  }

  return profile;
}

// ============================================================================
// CENTER ACCESS CONTROL
// ============================================================================

export async function requireCenterAccess(centerId: string) {
  const profile = await requireUserProfile();

  // Admins can access all centers
  if (profile.role === UserRole.ADMINISTRATOR) {
    return profile;
  }

  // Others must belong to the center
  if (profile.center_id !== centerId) {
    redirect('/auth/error?message=Access denied to this center');
  }

  return profile;
}

export async function getUserCenter(): Promise<string | null> {
  const profile = await getCurrentUserProfile();
  return profile?.center_id || null;
}

// ============================================================================
// PATIENT ACCESS CONTROL
// ============================================================================

export async function requirePatientAccess(patientId: string) {
  const supabase = await createClient();
  const profile = await requireUserProfile();

  // Get patient's center
  const { data: patient } = await supabase
    .from('patients')
    .select('center_id')
    .eq('id', patientId)
    .single();

  if (!patient) {
    redirect('/auth/error?message=Patient not found');
  }

  // Check center access
  await requireCenterAccess(patient.center_id);

  return profile;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  return profile?.role === UserRole.ADMINISTRATOR;
}

export async function isManager(): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  return (
    profile?.role === UserRole.MANAGER ||
    profile?.role === UserRole.ADMINISTRATOR
  );
}

export async function isProfessional(): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  return (
    profile?.role === UserRole.HEALTHCARE_PROFESSIONAL ||
    profile?.role === UserRole.MANAGER ||
    profile?.role === UserRole.ADMINISTRATOR
  );
}

export async function isPatient(): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  return profile?.role === UserRole.PATIENT;
}

// ============================================================================
// ENRICHED USER CONTEXT
// ============================================================================

export interface UserContext {
  user: {
    id: string;
    email: string;
  };
  profile: UserProfile;
  permissions: string[];
  centerName?: string;
  pathologies?: string[];
}

export const getUserContext = cache(async (): Promise<UserContext | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch profile and permissions in parallel for performance
  const [profileResult, permissionsResult] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('user_permissions')
      .select('permission:permissions(code)')
      .eq('user_id', user.id)
  ]);

  const profile = profileResult.data;
  if (!profile) {
    return null;
  }

  // Calculate permissions
  const defaultPermissions = getDefaultPermissionsForRole(profile.role);
  const additionalPermissions = permissionsResult.data
    ?.map((up: any) => up.permission?.code)
    .filter(Boolean) || [];
  
  const permissions = Array.from(
    new Set([...defaultPermissions, ...additionalPermissions])
  );

  // Get center and pathology information
  let centerName: string | undefined;
  let pathologies: string[] | undefined;

  if (profile.center_id) {
    const { data: centerData } = await supabase
      .from('v_users_full')
      .select('center_name, center_pathologies')
      .eq('id', user.id)
      .single();

    centerName = centerData?.center_name || undefined;
    pathologies = centerData?.center_pathologies || undefined;
  }

  return {
    user: {
      id: user.id,
      email: user.email || '',
    },
    profile,
    permissions,
    centerName,
    pathologies,
  };
});

export async function requireUserContext(): Promise<UserContext> {
  const context = await getUserContext();

  if (!context) {
    redirect('/auth/login');
  }

  return context;
}

