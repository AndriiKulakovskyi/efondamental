import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">eFondaMental</h1>
              <p className="text-sm text-slate-600">My Profile</p>
            </div>
            <UserProfileDropdown
              firstName={profile.first_name || ""}
              lastName={profile.last_name || ""}
              email={profile.email}
              role={profile.role}
            />
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}

