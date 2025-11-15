import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      `Missing Supabase environment variables!\n\n` +
      `Please ensure your .env.local file contains:\n` +
      `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl ? '✓' : '✗ MISSING'}\n` +
      `NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseKey ? '✓' : '✗ MISSING'}\n\n` +
      `Get these values from: https://supabase.com/dashboard/project/_/settings/api\n` +
      `(Look for "Project URL" and "anon public" key)\n\n` +
      `After adding them, restart your dev server: npm run dev`
    );
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
