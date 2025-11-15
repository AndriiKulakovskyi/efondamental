import { requireManager, getUserContext } from "@/lib/rbac/middleware";
import { Users, UserCheck, Calendar, Settings } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await getUserContext();

  if (!context || context.profile.role === 'patient') {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">eFondaMental</h1>
              <p className="text-sm text-slate-600">
                Manager Dashboard • {context.centerName || 'No Center'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {context.profile.first_name} {context.profile.last_name}
                </p>
                <p className="text-xs text-slate-500 capitalize">{context.profile.role.replace('_', ' ')}</p>
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
                href="/manager"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Calendar className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/manager/professionals"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <UserCheck className="h-5 w-5" />
                Professionals
              </Link>
              <Link
                href="/manager/patients"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Users className="h-5 w-5" />
                All Patients
              </Link>
              <Link
                href="/manager/settings"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Settings className="h-5 w-5" />
                Center Settings
              </Link>
            </nav>
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

