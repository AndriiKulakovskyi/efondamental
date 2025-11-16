import { createClient } from "@/lib/supabase/server";
import { Building2, Settings, Users, BarChart3, Shield } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";

export default async function AdminLayout({
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
    redirect("/auth/error?message=User profile not found");
  }

  if (profile.role !== "administrator") {
    redirect("/auth/error?message=Access denied - Admin only");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">eFondaMental</h1>
              <p className="text-sm text-slate-600">Administrator Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <UserProfileDropdown
                firstName={profile.first_name || ""}
                lastName={profile.last_name || ""}
                email={profile.email}
                role={profile.role}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <BarChart3 className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/admin/centers"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Building2 className="h-5 w-5" />
                Centers
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Users className="h-5 w-5" />
                Users
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
              <Link
                href="/admin/gdpr"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Shield className="h-5 w-5" />
                GDPR & Security
              </Link>
            </nav>
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

