import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();
  
  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Profile doesn't exist - show error
    redirect("/auth/error?message=User profile not found. Please contact support.");
  }

  // Redirect based on role
  const roleRedirects: Record<string, string> = {
    administrator: "/admin",
    manager: "/manager",
    healthcare_professional: "/professional",
    patient: "/patient",
  };

  const redirectPath = roleRedirects[profile.role] || "/auth/login";
  redirect(redirectPath);
}
