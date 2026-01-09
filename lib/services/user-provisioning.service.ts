// eFondaMental Platform - User Provisioning Service
// Top-down user creation: Admin -> Manager -> Professional -> Patient

import { createClient } from '../supabase/server';
import { createAdminClient } from '../supabase/admin';
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
      patient_id: null,
      first_name: request.firstName,
      last_name: request.lastName,
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
  // Use admin client throughout since this is called before user is authenticated
  const adminClient = createAdminClient();
  const supabase = await createClient();

  try {
    console.log('[ACCEPT INVITATION SERVICE] Validating invitation...');
    
    // Validate invitation (using admin client to bypass RLS)
    const { data: invitation } = await adminClient
      .from('user_invitations')
      .select('*')
      .eq('token', request.token)
      .eq('status', InvitationStatus.PENDING)
      .single();

    console.log('[ACCEPT INVITATION SERVICE] Invitation found:', invitation ? 'YES' : 'NO');

    if (!invitation) {
      return {
        success: false,
        error: 'Invalid or expired invitation',
      };
    }

    // Check expiration
    if (new Date(invitation.expires_at) < new Date()) {
      await adminClient
        .from('user_invitations')
        .update({ status: InvitationStatus.EXPIRED })
        .eq('id', invitation.id);

      return {
        success: false,
        error: 'Invitation has expired',
      };
    }

    // Create auth user (using admin client with service role key)
    console.log('[ACCEPT INVITATION SERVICE] Creating auth user...');
    
    console.log('[ACCEPT INVITATION SERVICE] Creating auth user for:', invitation.email);
    const { data: authUser, error: authError } =
      await adminClient.auth.admin.createUser({
        email: invitation.email,
        password: request.password,
        email_confirm: true,
      });

    if (authError || !authUser.user) {
      console.error('[ACCEPT INVITATION SERVICE] Failed to create auth user:', authError);
      return {
        success: false,
        error: authError?.message || 'Failed to create user account',
      };
    }

    console.log('[ACCEPT INVITATION SERVICE] Auth user created successfully. ID:', authUser.user.id);

    // Get patient data if this is a patient invitation
    let patientData = null;
    if (invitation.role === UserRole.PATIENT && invitation.patient_id) {
      const { data } = await supabase
        .from('patients')
        .select('first_name, last_name')
        .eq('id', invitation.patient_id)
        .single();
      
      patientData = data;
    }

    // Create user profile
    const profile: UserProfileInsert = {
      id: authUser.user.id,
      role: invitation.role,
      center_id: invitation.center_id,
      email: invitation.email,
      phone: null,
      username: request.username || null,
      first_name: patientData?.first_name || null,
      last_name: patientData?.last_name || null,
      active: true,
      metadata: invitation.patient_id ? { patient_id: invitation.patient_id } : {},
      created_by: invitation.invited_by,
    };

    console.log('[ACCEPT INVITATION SERVICE] Inserting user profile:', {
      id: profile.id,
      role: profile.role,
      email: profile.email,
      center_id: profile.center_id,
    });

    // Use admin client to bypass RLS policies during user creation
    const { data: insertedProfile, error: profileError } = await adminClient
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();

    if (profileError) {
      console.error('[ACCEPT INVITATION SERVICE] ❌ Failed to insert user profile:', profileError);
      console.error('[ACCEPT INVITATION SERVICE] Error code:', profileError.code);
      console.error('[ACCEPT INVITATION SERVICE] Error message:', profileError.message);
      console.error('[ACCEPT INVITATION SERVICE] Error details:', profileError.details);
      
      // Rollback: delete auth user
      console.log('[ACCEPT INVITATION SERVICE] Rolling back - deleting auth user...');
      await adminClient.auth.admin.deleteUser(authUser.user.id);

      return {
        success: false,
        error: `Failed to create user profile: ${profileError.message}`,
      };
    }

    console.log('[ACCEPT INVITATION SERVICE] ✅ User profile created successfully');

    // Grant default permissions for role
    await grantDefaultPermissions(authUser.user.id, invitation.role);

    // If this is a patient invitation, link the patient record to the user account
    if (invitation.role === UserRole.PATIENT && invitation.patient_id) {
      console.log('[ACCEPT INVITATION SERVICE] Linking patient to user account...');
      
      const { error: linkError } = await adminClient
        .from('patients')
        .update({ user_id: authUser.user.id })
        .eq('id', invitation.patient_id);

      if (linkError) {
        console.error('[ACCEPT INVITATION SERVICE] Failed to link patient to user account:', linkError);
        // Don't fail the entire process, just log the error
      } else {
        console.log('[ACCEPT INVITATION SERVICE] ✅ Patient linked to user account');
      }
    }

    // Update invitation status
    console.log('[ACCEPT INVITATION SERVICE] Updating invitation status to accepted...');
    
    await adminClient
      .from('user_invitations')
      .update({
        status: InvitationStatus.ACCEPTED,
        accepted_by: authUser.user.id,
      })
      .eq('id', invitation.id);
    
    console.log('[ACCEPT INVITATION SERVICE] ✅ Invitation marked as accepted');

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
// PATIENT INVITATION
// ============================================================================

export interface InvitePatientRequest {
  patientId: string;
  email: string;
  firstName: string;
  lastName: string;
  centerId: string;
  invitedBy: string;
}

export async function invitePatient(
  request: InvitePatientRequest
): Promise<InvitationResult> {
  const supabase = await createClient();

  try {
    // Check if email already has an active user account
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', request.email)
      .single();

    if (existingProfile) {
      return {
        success: false,
        error: 'A user account with this email already exists',
      };
    }

    // Check for pending invitation for this email
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
      role: UserRole.PATIENT,
      center_id: request.centerId,
      patient_id: request.patientId,
      first_name: request.firstName,
      last_name: request.lastName,
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

    // Send invitation email via Supabase
    await sendPatientInvitationEmail({
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      token,
    });

    return {
      success: true,
      invitationId: data.id,
      token,
    };
  } catch (error) {
    console.error('Failed to invite patient:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while sending invitation',
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

    // Create auth user (using admin client with service role key)
    const adminClient = createAdminClient();
    const { data: authUser, error: authError } =
      await adminClient.auth.admin.createUser({
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
      phone: null,
      username: null,
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
      await adminClient.auth.admin.deleteUser(authUser.user.id);

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
  const invitationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/invite/${data.token}`;
  
  // For staff invitations, we could use a different email template
  // For now, just log that email should be sent
  console.log(`
    Staff invitation created (email sending TBD):
    To: ${data.email}
    Name: ${data.firstName} ${data.lastName}
    Role: ${data.role}
    Invitation URL: ${invitationUrl}
  `);
  
  // TODO: Implement staff invitation email template if needed
}

interface PatientInvitationEmailData {
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

async function sendPatientInvitationEmail(
  data: PatientInvitationEmailData
): Promise<void> {
  const invitationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/invite/${data.token}`;
  
  try {
    // Import email service
    const { sendPatientInvitation } = await import('./email.service');
    
    // Send email using NotificationAPI
    const sent = await sendPatientInvitation({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      invitationUrl,
    });

    if (!sent) {
      console.warn(`
        Email not sent - NotificationAPI not configured
        
        To enable email sending:
        1. Get your credentials from NotificationAPI dashboard
        2. Add to .env.local:
           NOTIFICATIONAPI_CLIENT_ID=your_client_id
           NOTIFICATIONAPI_CLIENT_SECRET=your_client_secret
           NEXT_PUBLIC_SITE_URL=http://localhost:3000
        3. Restart dev server: npm run dev
        
        For now, patient can access this invitation URL:
        ${invitationUrl}
      `);
    } else {
      console.log(`
        ✅ Patient invitation email sent successfully!
        To: ${data.email}
        Name: ${data.firstName} ${data.lastName}
        Invitation URL: ${invitationUrl}
      `);
    }
  } catch (error) {
    console.error('Error sending patient invitation email:', error);
    // Don't throw - allow invitation to be created even if email fails
  }
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
  // Use admin client to bypass RLS since this is called before user is authenticated
  const adminClient = createAdminClient();

  const { data } = await adminClient
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

  // Resend email based on role
  if (invitation.role === UserRole.PATIENT) {
    // For patients, use the Resend-based email function
    await sendPatientInvitationEmail({
      email: invitation.email,
      firstName: invitation.first_name || '',
      lastName: invitation.last_name || '',
      token,
    });
  } else {
    // For staff, use the standard invitation email
    await sendInvitationEmail({
      email: invitation.email,
      firstName: invitation.first_name || '',
      lastName: invitation.last_name || '',
      token,
      role: invitation.role,
    });
  }

  return {
    success: true,
    invitationId,
    token,
  };
}

