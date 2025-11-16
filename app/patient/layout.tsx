import { requirePatient, getUserContext } from "@/lib/rbac/middleware";
import { Calendar, FileText, MessageSquare, Home } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requirePatient();

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
              <p className="text-sm text-slate-600">Patient Portal</p>
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

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              <Link
                href="/patient"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/patient/appointments"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Calendar className="h-5 w-5" />
                Appointments
              </Link>
              <Link
                href="/patient/questionnaires"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <FileText className="h-5 w-5" />
                Questionnaires
              </Link>
              <Link
                href="/patient/messages"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
                Messages
              </Link>
            </nav>
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

