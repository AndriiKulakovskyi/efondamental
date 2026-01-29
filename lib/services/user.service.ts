// eFondaMental Platform - User Service

import { createClient } from '../supabase/server';
import {
  UserProfile,
  UserProfileInsert,
  UserProfileUpdate,
} from '../types/database.types';
import { UserRole } from '../types/enums';

// ============================================================================
// USER CRUD
// ============================================================================

export async function getUserById(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select(`
      *,
      user_pathologies (
        pathology_id,
        pathologies (
          id,
          name,
          type
        )
      )
    `)
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  return data;
}

export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  return data;
}

export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  return data;
}

export async function updateUser(
  userId: string,
  updates: UserProfileUpdate
): Promise<UserProfile> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }

  return data;
}

export async function deactivateUser(userId: string): Promise<void> {
  await updateUser(userId, { active: false });
}

export async function activateUser(userId: string): Promise<void> {
  await updateUser(userId, { active: true });
}

// ============================================================================
// CENTER-SPECIFIC USER QUERIES
// ============================================================================

export async function getUsersByCenter(centerId: string): Promise<UserProfile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('center_id', centerId)
    .eq('active', true)
    .order('last_name, first_name');

  if (error) {
    throw new Error(`Failed to fetch users by center: ${error.message}`);
  }

  return data || [];
}

export async function getUsersByCenterAndRole(
  centerId: string,
  role: UserRole
): Promise<UserProfile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('center_id', centerId)
    .eq('role', role)
    .eq('active', true)
    .order('last_name, first_name');

  if (error) {
    throw new Error(`Failed to fetch users by center and role: ${error.message}`);
  }

  return data || [];
}

export async function getProfessionalsByCenter(centerId: string): Promise<UserProfile[]> {
  return getUsersByCenterAndRole(centerId, UserRole.HEALTHCARE_PROFESSIONAL);
}

export async function getManagersByCenter(centerId: string): Promise<UserProfile[]> {
  return getUsersByCenterAndRole(centerId, UserRole.MANAGER);
}

// ============================================================================
// PERMISSION MANAGEMENT
// ============================================================================

export async function getUserPermissions(userId: string): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_permissions')
    .select('permission:permissions(code)')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to fetch user permissions: ${error.message}`);
  }

  return data?.map((up: any) => up.permission?.code).filter(Boolean) || [];
}

export async function grantPermission(
  userId: string,
  permissionId: string,
  grantedBy: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('user_permissions').insert({
    user_id: userId,
    permission_id: permissionId,
    granted_by: grantedBy,
  });

  if (error) {
    if (error.code === '23505') {
      // Permission already granted
      return;
    }
    throw new Error(`Failed to grant permission: ${error.message}`);
  }
}

export async function revokePermission(
  userId: string,
  permissionId: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('user_permissions')
    .delete()
    .eq('user_id', userId)
    .eq('permission_id', permissionId);

  if (error) {
    throw new Error(`Failed to revoke permission: ${error.message}`);
  }
}

export async function setUserPermissions(
  userId: string,
  permissionIds: string[],
  grantedBy: string
): Promise<void> {
  const supabase = await createClient();

  // Remove all existing permissions
  await supabase.from('user_permissions').delete().eq('user_id', userId);

  // Add new permissions
  if (permissionIds.length > 0) {
    const { error } = await supabase.from('user_permissions').insert(
      permissionIds.map((permissionId) => ({
        user_id: userId,
        permission_id: permissionId,
        granted_by: grantedBy,
      }))
    );

    if (error) {
      throw new Error(`Failed to set user permissions: ${error.message}`);
    }
  }
}

/**
 * Sets the pathologies assigned to a user (many-to-many relationship)
 * This function replaces all existing assignments with the new ones.
 */
export async function setUserPathologies(
  userId: string,
  pathologyIds: string[]
): Promise<void> {
  const supabase = await createClient();

  // First, delete all existing pathology assignments
  await supabase
    .from('user_pathologies')
    .delete()
    .eq('user_id', userId);

  // Then, add new pathology assignments
  if (pathologyIds.length > 0) {
    const { error } = await supabase
      .from('user_pathologies')
      .insert(
        pathologyIds.map((pathologyId) => ({
          user_id: userId,
          pathology_id: pathologyId,
        }))
      );

    if (error) {
      throw new Error(`Failed to set user pathologies: ${error.message}`);
    }
  }
}

// ============================================================================
// ROLE MANAGEMENT
// ============================================================================

export async function promoteUser(
  userId: string,
  newRole: UserRole,
  promotedBy: string
): Promise<UserProfile> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .update({ role: newRole })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to promote user: ${error.message}`);
  }

  // Log the promotion
  await supabase.from('audit_logs').insert({
    user_id: promotedBy,
    action: 'promote_user',
    entity_type: 'user_profiles',
    entity_id: userId,
    metadata: {
      new_role: newRole,
      promoted_by: promotedBy,
    },
  });

  return data;
}

// ============================================================================
// USER SEARCH
// ============================================================================

export async function searchUsers(
  searchTerm: string,
  centerId?: string,
  role?: UserRole
): Promise<UserProfile[]> {
  const supabase = await createClient();

  let query = supabase
    .from('user_profiles')
    .select('*')
    .eq('active', true);

  if (centerId) {
    query = query.eq('center_id', centerId);
  }

  if (role) {
    query = query.eq('role', role);
  }

  // Search in first_name, last_name, email, username
  if (searchTerm) {
    query = query.or(
      `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`
    );
  }

  const { data, error } = await query.order('last_name, first_name').limit(50);

  if (error) {
    throw new Error(`Failed to search users: ${error.message}`);
  }

  return data || [];
}

// ============================================================================
// USER STATISTICS
// ============================================================================

export async function getUserActivityStats(userId: string) {
  const supabase = await createClient();

  // Patients created
  const { count: patientsCreated } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })
    .eq('created_by', userId);

  // Visits conducted
  const { count: visitsConducted } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .eq('conducted_by', userId)
    .eq('status', 'completed');

  // Evaluations completed
  const { count: evaluationsCompleted } = await supabase
    .from('evaluations')
    .select('*', { count: 'exact', head: true })
    .eq('evaluator_id', userId);

  // Last activity
  const { data: lastActivity } = await supabase
    .from('audit_logs')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return {
    patientsCreated: patientsCreated || 0,
    visitsConducted: visitsConducted || 0,
    evaluationsCompleted: evaluationsCompleted || 0,
    lastActivity: lastActivity?.created_at || null,
  };
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch all users: ${error.message}`);
  }

  return data || [];
}

