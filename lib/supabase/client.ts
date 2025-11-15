import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      `Missing Supabase environment variables!\n\n` +
      `Please ensure your .env.local file contains:\n` +
      `NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY\n\n` +
      `Get these values from: https://supabase.com/dashboard/project/_/settings/api\n` +
      `(Look for "Project URL" and "anon public" key)\n\n` +
      `After adding them, restart your dev server.`
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
