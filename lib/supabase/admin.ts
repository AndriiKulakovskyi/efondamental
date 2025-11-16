// eFondaMental Platform - Supabase Admin Client
// Use this client for admin operations like creating users

import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      `Missing Supabase admin environment variables!\n\n` +
      `Please ensure your .env.local file contains:\n` +
      `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl ? '✓' : '✗ MISSING'}\n` +
      `SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey ? '✓' : '✗ MISSING'}\n\n` +
      `Get the service role key from: https://supabase.com/dashboard/project/_/settings/api\n` +
      `(Look for "service_role" secret key - DO NOT expose this publicly!)\n\n` +
      `After adding it, restart your dev server: npm run dev`
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

