// Test Supabase Client
// Creates Supabase clients for integration testing

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Test user credentials (matching seed data)
export const TEST_CREDENTIALS = {
  professional: {
    email: 'doctor.paris@fondamental.fr',
    password: 'Password123!',
    // ID will be looked up dynamically
  },
  manager: {
    email: 'manager.paris@fondamental.fr',
    password: 'Password123!',
    // ID will be looked up dynamically
  },
};

/**
 * Get the professional user ID from the database
 */
export async function getProfessionalId(): Promise<string> {
  const adminClient = createTestAdminClient();
  
  const { data, error } = await adminClient
    .from('user_profiles')
    .select('id')
    .eq('email', TEST_CREDENTIALS.professional.email)
    .single();

  if (error || !data) {
    throw new Error(`Failed to get professional ID: ${error?.message || 'No data'}`);
  }

  return data.id;
}

// Test IDs (will be set by seed script or tests)
export const TEST_IDS = {
  centerId: '', // Will be populated from database
  patientId: '', // Will be created by seed script
  visitId: '', // Will be created by seed script
};

/**
 * Creates an admin Supabase client (bypasses RLS)
 * Use for test setup and teardown
 */
export function createTestAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase environment variables for testing.\n' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local'
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Creates an authenticated Supabase client for a specific user
 * Use for testing as a specific user role
 */
export async function createAuthenticatedClient(
  email: string,
  password: string
): Promise<SupabaseClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables for testing.\n' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local'
    );
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Sign in as the user
  const { error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Failed to authenticate test user ${email}: ${error.message}`);
  }

  return client;
}

/**
 * Creates a test client authenticated as a healthcare professional
 */
export async function createProfessionalClient(): Promise<SupabaseClient> {
  return createAuthenticatedClient(
    TEST_CREDENTIALS.professional.email,
    TEST_CREDENTIALS.professional.password
  );
}

/**
 * Creates a test client authenticated as a manager
 */
export async function createManagerClient(): Promise<SupabaseClient> {
  return createAuthenticatedClient(
    TEST_CREDENTIALS.manager.email,
    TEST_CREDENTIALS.manager.password
  );
}

/**
 * Get the Paris center ID from the database
 */
export async function getPariscenterId(): Promise<string> {
  const adminClient = createTestAdminClient();
  
  const { data, error } = await adminClient
    .from('centers')
    .select('id')
    .eq('code', 'CEF-PARIS')
    .single();

  if (error || !data) {
    throw new Error(`Failed to get Paris center ID: ${error?.message || 'No data'}`);
  }

  return data.id;
}
