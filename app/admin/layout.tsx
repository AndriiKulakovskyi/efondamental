import { requireAdmin } from "@/lib/rbac/middleware";
import { Building2, Settings, Users, BarChart3, Shield } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAdmin();

  if (!profile) {
    redirect("/auth/login");
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
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {profile.first_name} {profile.last_name}
                </p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
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

