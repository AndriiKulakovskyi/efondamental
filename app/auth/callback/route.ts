import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDefaultRedirectForRole } from "@/lib/rbac/roles";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Get user profile to determine redirect
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile) {
          const redirectPath = getDefaultRedirectForRole(profile.role);
          return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
        }
      }

      return NextResponse.redirect(new URL("/protected", requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL("/auth/error", requestUrl.origin));
}

