// eFondaMental Platform - User Provisioning Service
// Top-down user creation: Admin -> Manager -> Professional -> Patient

import { createClient } from '../supabase/server';
import { UserRole, InvitationStatus } from '../types/enums';
import {
  UserInvitationInsert,
  UserProfileInsert,
} from '../types/database.types';
import { canUserCreateRole } from '../rbac/roles';
import crypto from 'crypto';

// ============================================================================
// USER INVITATION
// ============================================================================

export interface CreateInvitationRequest {
  email: string;
  role: UserRole;
  centerId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  invitedBy: string;
}

export interface InvitationResult {
  success: boolean;
  invitationId?: string;
  token?: string;
  error?: string;
}

export async function createUserInvitation(
  request: CreateInvitationRequest
): Promise<InvitationResult> {
  const supabase = await createClient();

  try {
    // Validate inviter has permission to create this role
    const { data: inviterProfile } = await supabase
      .from('user_profiles')
      .select('role, center_id')
      .eq('id', request.invitedBy)
      .single();

    if (!inviterProfile) {
      return {
        success: false,
        error: 'Inviter not found',
      };
    }

    // Check if inviter can create this role
    if (!canUserCreateRole(inviterProfile.role, request.role)) {
      return {
        success: false,
        error: `You do not have permission to create ${request.role} accounts`,
      };
    }

    // For non-admin roles, ensure center matches
    if (
      inviterProfile.role !== UserRole.ADMINISTRATOR &&
      inviterProfile.center_id !== request.centerId
    ) {
      return {
        success: false,
        error: 'You can only create users for your own center',
      };
    }

    // Check if email already exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', request.email)
      .single();

    if (existingProfile) {
      return {
        success: false,
        error: 'A user with this email already exists',
      };
    }

    // Check for pending invitation
    const { data: pendingInvitation } = await supabase
      .from('user_invitations')
      .select('id')
      .eq('email', request.email)
      .eq('status', InvitationStatus.PENDING)
      .single();

    if (pendingInvitation) {
      return {
        success: false,
        error: 'A pending invitation already exists for this email',
      };
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create invitation
    const invitation: UserInvitationInsert = {
      email: request.email,
      role: request.role,
      center_id: request.centerId,
      token,
      status: InvitationStatus.PENDING,
      invited_by: request.invitedBy,
      expires_at: expiresAt.toISOString(),
    };

    const { data, error } = await supabase
      .from('user_invitations')
      .insert(invitation)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // TODO: Send invitation email
    await sendInvitationEmail({
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      token,
      role: request.role,
    });

    return {
      success: true,
      invitationId: data.id,
      token,
    };
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

// ============================================================================
// INVITATION ACCEPTANCE
// ============================================================================

export interface AcceptInvitationRequest {
  token: string;
  password: string;
  username?: string;
}

export interface AcceptInvitationResult {
  success: boolean;
  userId?: string;
  error?: string;
}

export async function acceptInvitation(
  request: AcceptInvitationRequest
): Promise<AcceptInvitationResult> {
  const supabase = await createClient();

  try {
    // Validate invitation
    const { data: invitation } = await supabase
      .from('user_invitations')
      .select('*')
      .eq('token', request.token)
      .eq('status', InvitationStatus.PENDING)
      .single();

    if (!invitation) {
      return {
        success: false,
        error: 'Invalid or expired invitation',
      };
    }

    // Check expiration
    if (new Date(invitation.expires_at) < new Date()) {
      await supabase
        .from('user_invitations')
        .update({ status: InvitationStatus.EXPIRED })
        .eq('id', invitation.id);

      return {
        success: false,
        error: 'Invitation has expired',
      };
    }

    // Create auth user (using admin client)
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email: invitation.email,
        password: request.password,
        email_confirm: true,
      });

    if (authError || !authUser.user) {
      return {
        success: false,
        error: authError?.message || 'Failed to create user account',
      };
    }

    // Create user profile
    const profile: UserProfileInsert = {
      id: authUser.user.id,
      role: invitation.role,
      center_id: invitation.center_id,
      email: invitation.email,
      username: request.username || null,
      first_name: null,
      last_name: null,
      active: true,
      metadata: {},
      created_by: invitation.invited_by,
    };

    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert(profile);

    if (profileError) {
      // Rollback: delete auth user
      await supabase.auth.admin.deleteUser(authUser.user.id);

      return {
        success: false,
        error: 'Failed to create user profile',
      };
    }

    // Grant default permissions for role
    await grantDefaultPermissions(authUser.user.id, invitation.role);

    // Update invitation status
    await supabase
      .from('user_invitations')
      .update({
        status: InvitationStatus.ACCEPTED,
        accepted_by: authUser.user.id,
      })
      .eq('id', invitation.id);

    return {
      success: true,
      userId: authUser.user.id,
    };
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

// ============================================================================
// DIRECT USER CREATION (FOR PATIENTS)
// ============================================================================

export interface CreatePatientUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  centerId: string;
  createdBy: string;
  temporaryPassword?: string;
}

export interface CreateUserResult {
  success: boolean;
  userId?: string;
  temporaryPassword?: string;
  error?: string;
}

export async function createPatientUser(
  request: CreatePatientUserRequest
): Promise<CreateUserResult> {
  const supabase = await createClient();

  try {
    // Validate creator has permission
    const { data: creatorProfile } = await supabase
      .from('user_profiles')
      .select('role, center_id')
      .eq('id', request.createdBy)
      .single();

    if (!creatorProfile) {
      return {
        success: false,
        error: 'Creator not found',
      };
    }

    if (!canUserCreateRole(creatorProfile.role, UserRole.PATIENT)) {
      return {
        success: false,
        error: 'You do not have permission to create patient accounts',
      };
    }

    // Check center match for non-admins
    if (
      creatorProfile.role !== UserRole.ADMINISTRATOR &&
      creatorProfile.center_id !== request.centerId
    ) {
      return {
        success: false,
        error: 'You can only create patients for your own center',
      };
    }

    // Check if email already exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', request.email)
      .single();

    if (existingProfile) {
      return {
        success: false,
        error: 'A user with this email already exists',
      };
    }

    // Generate temporary password if not provided
    const temporaryPassword =
      request.temporaryPassword || generateTemporaryPassword();

    // Create auth user
    const { data: authUser, error: authError } =
      await supabase.auth.admin.createUser({
        email: request.email,
        password: temporaryPassword,
        email_confirm: true,
      });

    if (authError || !authUser.user) {
      return {
        success: false,
        error: authError?.message || 'Failed to create user account',
      };
    }

    // Create user profile
    const profile: UserProfileInsert = {
      id: authUser.user.id,
      role: UserRole.PATIENT,
      center_id: request.centerId,
      email: request.email,
      first_name: request.firstName,
      last_name: request.lastName,
      active: true,
      metadata: {},
      created_by: request.createdBy,
    };

    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert(profile);

    if (profileError) {
      // Rollback: delete auth user
      await supabase.auth.admin.deleteUser(authUser.user.id);

      return {
        success: false,
        error: 'Failed to create user profile',
      };
    }

    // Grant default permissions
    await grantDefaultPermissions(authUser.user.id, UserRole.PATIENT);

    // Send welcome email with temporary password
    await sendWelcomeEmail({
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      temporaryPassword,
    });

    return {
      success: true,
      userId: authUser.user.id,
      temporaryPassword,
    };
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

// ============================================================================
// PERMISSION MANAGEMENT
// ============================================================================

async function grantDefaultPermissions(
  userId: string,
  role: UserRole
): Promise<void> {
  const supabase = await createClient();
  const { getDefaultPermissionsForRole } = await import('../rbac/permissions');

  const defaultPermissions = getDefaultPermissionsForRole(role);

  // Get permission IDs
  const { data: permissions } = await supabase
    .from('permissions')
    .select('id, code')
    .in('code', defaultPermissions);

  if (!permissions || permissions.length === 0) {
    return;
  }

  // Insert user permissions
  const userPermissions = permissions.map((perm) => ({
    user_id: userId,
    permission_id: perm.id,
    granted_by: null, // System-granted
  }));

  await supabase.from('user_permissions').insert(userPermissions);
}

// ============================================================================
// EMAIL NOTIFICATIONS (Placeholder)
// ============================================================================

interface InvitationEmailData {
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  role: UserRole;
}

async function sendInvitationEmail(
  data: InvitationEmailData
): Promise<void> {
  // TODO: Implement email sending
  // For now, just log the invitation URL
  const invitationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/invite/${data.token}`;
  console.log(`
    Invitation email would be sent to: ${data.email}
    Name: ${data.firstName} ${data.lastName}
    Role: ${data.role}
    Invitation URL: ${invitationUrl}
  `);
}

interface WelcomeEmailData {
  email: string;
  firstName: string;
  lastName: string;
  temporaryPassword: string;
}

async function sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
  // TODO: Implement email sending
  console.log(`
    Welcome email would be sent to: ${data.email}
    Name: ${data.firstName} ${data.lastName}
    Temporary Password: ${data.temporaryPassword}
  `);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateTemporaryPassword(): string {
  const length = 12;
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

// ============================================================================
// INVITATION MANAGEMENT
// ============================================================================

export async function getInvitation(token: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('user_invitations')
    .select('*')
    .eq('token', token)
    .single();

  return data;
}

export async function getPendingInvitations(centerId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('user_invitations')
    .select('*')
    .eq('center_id', centerId)
    .eq('status', InvitationStatus.PENDING)
    .order('created_at', { ascending: false });

  return data || [];
}

export async function cancelInvitation(
  invitationId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('user_invitations')
    .update({ status: InvitationStatus.EXPIRED })
    .eq('id', invitationId);

  return !error;
}

export async function resendInvitation(
  invitationId: string
): Promise<InvitationResult> {
  const supabase = await createClient();

  // Get invitation
  const { data: invitation } = await supabase
    .from('user_invitations')
    .select('*')
    .eq('id', invitationId)
    .single();

  if (!invitation) {
    return {
      success: false,
      error: 'Invitation not found',
    };
  }

  // Generate new token and extend expiration
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { error } = await supabase
    .from('user_invitations')
    .update({
      token,
      expires_at: expiresAt.toISOString(),
      status: InvitationStatus.PENDING,
    })
    .eq('id', invitationId);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  // Resend email
  await sendInvitationEmail({
    email: invitation.email,
    firstName: '',
    lastName: '',
    token,
    role: invitation.role,
  });

  return {
    success: true,
    invitationId,
    token,
  };
}

