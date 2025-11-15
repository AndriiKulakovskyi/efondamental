// eFondaMental Platform - Authentication Service

import { createClient as createBrowserClient } from '../supabase/client';
import { UserRole } from '../types/enums';

// ============================================================================
// LOGIN & AUTHENTICATION
// ============================================================================

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  error?: string;
  requiresVerification?: boolean;
}

export async function loginWithPassword(
  credentials: LoginCredentials
): Promise<LoginResult> {
  const supabase = createBrowserClient();

  try {
    let email = credentials.email;

    // If username provided, find email
    if (!email && credentials.username) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('username', credentials.username)
        .eq('active', true)
        .single();

      if (!profile) {
        return {
          success: false,
          error: 'Invalid username or password',
        };
      }

      email = profile.email;
    }

    if (!email) {
      return {
        success: false,
        error: 'Email or username is required',
      };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: credentials.password,
    });

    if (error) {
      // Log failed login attempt
      await logLoginAttempt(email, false, 'password', error.message);

      return {
        success: false,
        error: error.message,
      };
    }

    // Log successful login
    await logLoginAttempt(email, true, 'password');

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

export async function loginWithMagicLink(
  email: string
): Promise<LoginResult> {
  const supabase = createBrowserClient();

  try {
    // Check if user exists and is active
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('email, active')
      .eq('email', email)
      .single();

    if (!profile || !profile.active) {
      return {
        success: false,
        error: 'Account not found or inactive',
      };
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      await logLoginAttempt(email, false, 'magic_link', error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      requiresVerification: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

// ============================================================================
// LOGOUT
// ============================================================================

export async function logout(): Promise<void> {
  const supabase = createBrowserClient();
  await supabase.auth.signOut();
}

// ============================================================================
// PASSWORD RESET
// ============================================================================

export interface PasswordResetResult {
  success: boolean;
  error?: string;
}

export async function requestPasswordReset(
  email: string
): Promise<PasswordResetResult> {
  const supabase = createBrowserClient();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

export async function updatePassword(
  newPassword: string
): Promise<PasswordResetResult> {
  const supabase = createBrowserClient();

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

// ============================================================================
// LOGIN HISTORY LOGGING
// ============================================================================

async function logLoginAttempt(
  email: string,
  success: boolean,
  method: string,
  failureReason?: string
): Promise<void> {
  try {
    const supabase = createBrowserClient();

    // Get user ID if successful
    let userId: string | null = null;
    if (success) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', email)
        .single();
      userId = profile?.id || null;
    }

    // Note: In a real implementation, we'd get IP address and user agent from request headers
    // For browser client, we can get user agent from navigator
    const userAgent =
      typeof navigator !== 'undefined' ? navigator.userAgent : null;

    await supabase.from('login_history').insert({
      user_id: userId,
      success,
      method,
      user_agent: userAgent,
      failure_reason: failureReason || null,
    });
  } catch (error) {
    // Silent fail - don't interrupt login flow
    console.error('Failed to log login attempt:', error);
  }
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

export async function getCurrentSession() {
  const supabase = createBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function refreshSession() {
  const supabase = createBrowserClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.refreshSession();

  if (error) {
    throw error;
  }

  return session;
}

// ============================================================================
// USER VERIFICATION
// ============================================================================

export async function verifyUserActive(userId: string): Promise<boolean> {
  const supabase = createBrowserClient();

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('active')
    .eq('id', userId)
    .single();

  return profile?.active || false;
}

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const supabase = createBrowserClient();

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .single();

  return profile?.role || null;
}

// ============================================================================
// AUTHENTICATION STATE
// ============================================================================

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
  } | null;
  role: UserRole | null;
  isActive: boolean;
}

export async function getAuthState(): Promise<AuthState> {
  try {
    const supabase = createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        isAuthenticated: false,
        user: null,
        role: null,
        isActive: false,
      };
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role, active')
      .eq('id', user.id)
      .single();

    return {
      isAuthenticated: true,
      user: {
        id: user.id,
        email: user.email || '',
      },
      role: profile?.role || null,
      isActive: profile?.active || false,
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
      role: null,
      isActive: false,
    };
  }
}

