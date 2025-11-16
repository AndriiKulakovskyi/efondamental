import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./components/profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/auth/error?message=Profile not found");
  }

  // Determine the dashboard URL based on role
  const getDashboardUrl = () => {
    switch (profile.role) {
      case "administrator":
        return "/admin";
      case "manager":
        return "/manager";
      case "healthcare_professional":
        return "/professional";
      case "patient":
        return "/patient";
      default:
        return "/";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-600">Manage your account settings and preferences</p>
      </div>

      <ProfileForm
        initialProfile={{
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          phone: profile.phone || "",
          username: profile.username || "",
        }}
        initialEmail={user.email || ""}
        dashboardUrl={getDashboardUrl()}
      />
    </div>
  );
}

