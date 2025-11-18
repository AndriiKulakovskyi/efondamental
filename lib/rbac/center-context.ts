// eFondaMental Platform - Center Isolation and Context

import { createClient } from '../supabase/server';
import { UserRole, PathologyType } from '../types/enums';
import { Center, Pathology } from '../types/database.types';

// ============================================================================
// CENTER CONTEXT
// ============================================================================

export interface CenterContext {
  centerId: string;
  centerName: string;
  centerCode: string;
  pathologies: PathologyType[];
}

export async function getCenterContext(
  centerId: string
): Promise<CenterContext | null> {
  const supabase = await createClient();

  const { data: center } = await supabase
    .from('centers')
    .select('id, name, code')
    .eq('id', centerId)
    .single();

  if (!center) {
    return null;
  }

  // Get pathologies for this center
  const { data: centerPathologies } = await supabase
    .from('center_pathologies')
    .select('pathology:pathologies(type)')
    .eq('center_id', centerId);

  const pathologies =
    centerPathologies
      ?.map((cp: any) => cp.pathology?.type)
      .filter(Boolean) || [];

  return {
    centerId: center.id,
    centerName: center.name,
    centerCode: center.code,
    pathologies,
  };
}

// ============================================================================
// CENTER VALIDATION
// ============================================================================

export async function validateCenterAccess(
  userId: string,
  centerId: string
): Promise<boolean> {
  const supabase = await createClient();

  // Get user's profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, center_id')
    .eq('id', userId)
    .single();

  if (!profile) {
    return false;
  }

  // Administrators can access any center
  if (profile.role === UserRole.ADMINISTRATOR) {
    return true;
  }

  // Others must belong to the center
  return profile.center_id === centerId;
}

export async function validatePatientAccess(
  userId: string,
  patientId: string
): Promise<boolean> {
  const supabase = await createClient();

  // Get patient's center
  const { data: patient } = await supabase
    .from('patients')
    .select('center_id')
    .eq('id', patientId)
    .single();

  if (!patient) {
    return false;
  }

  // Check if user has access to patient's center
  return validateCenterAccess(userId, patient.center_id);
}

// ============================================================================
// PATHOLOGY FILTERING
// ============================================================================

export async function getCenterPathologies(
  centerId: string
): Promise<Pathology[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('center_pathologies')
    .select('pathology:pathologies(*)')
    .eq('center_id', centerId);

  return data?.map((cp: any) => cp.pathology).filter(Boolean) || [];
}

export async function isCenterPathologyValid(
  centerId: string,
  pathologyType: PathologyType
): Promise<boolean> {
  const supabase = await createClient();

  const { data: pathology } = await supabase
    .from('pathologies')
    .select('id')
    .eq('type', pathologyType)
    .single();

  if (!pathology) {
    return false;
  }

  const { data } = await supabase
    .from('center_pathologies')
    .select('id')
    .eq('center_id', centerId)
    .eq('pathology_id', pathology.id)
    .single();

  return !!data;
}

// ============================================================================
// USER CENTER CONTEXT
// ============================================================================

export async function getUserCenterContext(
  userId: string
): Promise<CenterContext | null> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('center_id')
    .eq('id', userId)
    .single();

  if (!profile?.center_id) {
    return null;
  }

  return getCenterContext(profile.center_id);
}

// ============================================================================
// CENTER STATISTICS HELPERS
// ============================================================================

export async function getCenterPatientCount(centerId: string): Promise<number> {
  const supabase = await createClient();

  const { count } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })
    .eq('center_id', centerId)
    .eq('active', true);

  return count || 0;
}

export async function getCenterUserCount(
  centerId: string,
  role?: UserRole
): Promise<number> {
  const supabase = await createClient();

  let query = supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('center_id', centerId)
    .eq('active', true);

  if (role) {
    query = query.eq('role', role);
  }

  const { count } = await query;
  return count || 0;
}

export async function getCenterVisitCount(
  centerId: string,
  status?: string
): Promise<number> {
  const supabase = await createClient();

  let query = supabase
    .from('visits')
    .select('*, patient:patients!inner(center_id)', {
      count: 'exact',
      head: true,
    })
    .eq('patient.center_id', centerId);

  if (status) {
    query = query.eq('status', status);
  }

  const { count } = await query;
  return count || 0;
}

// ============================================================================
// MULTI-CENTER OPERATIONS (ADMIN ONLY)
// ============================================================================

export async function getAllCenters(): Promise<Center[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('centers')
    .select('*')
    .eq('active', true)
    .order('name');

  return data || [];
}

export async function getCenterWithPathologies(centerId: string): Promise<{
  center: Center;
  pathologies: Pathology[];
} | null> {
  const supabase = await createClient();

  const { data: center } = await supabase
    .from('centers')
    .select('*')
    .eq('id', centerId)
    .single();

  if (!center) {
    return null;
  }

  const pathologies = await getCenterPathologies(centerId);

  return {
    center,
    pathologies,
  };
}

// ============================================================================
// DATA ISOLATION HELPERS
// ============================================================================

export function buildCenterIsolationQuery(
  supabase: Awaited<ReturnType<typeof createClient>>,
  tableName: string,
  userId: string,
  userRole: UserRole,
  userCenterId: string | null
) {
  // Administrators can see all data
  if (userRole === UserRole.ADMINISTRATOR) {
    return supabase.from(tableName).select('*');
  }

  // Others see only their center's data
  if (!userCenterId) {
    // If user has no center, return empty query
    return supabase.from(tableName).select('*').eq('id', 'null');
  }

  return supabase
    .from(tableName)
    .select('*')
    .eq('center_id', userCenterId);
}

// ============================================================================
// CENTER SWITCHING (FOR ADMINS)
// ============================================================================

export interface CenterSwitchContext {
  originalCenterId: string | null;
  currentCenterId: string;
  canSwitch: boolean;
}

export async function canSwitchCenter(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .single();

  return profile?.role === UserRole.ADMINISTRATOR;
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export function ensureCenterIsolation<T extends { center_id: string }>(
  data: T[],
  allowedCenterId: string
): T[] {
  return data.filter((item) => item.center_id === allowedCenterId);
}

export function validateCenterOwnership(
  entityCenterId: string,
  userCenterId: string | null,
  userRole: UserRole
): boolean {
  // Admins can access all centers
  if (userRole === UserRole.ADMINISTRATOR) {
    return true;
  }

  // Others must match center
  return entityCenterId === userCenterId;
}

