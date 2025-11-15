import { getUserContext } from "@/lib/rbac/middleware";
import { PATHOLOGY_NAMES, PathologyType } from "@/lib/types/enums";
import { Users, Calendar, BarChart3, Home } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PathologyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ pathology: string }>;
}) {
  const { pathology } = await params;
  const context = await getUserContext();

  if (!context) {
    redirect("/auth/login");
  }

  const pathologyName = PATHOLOGY_NAMES[pathology as PathologyType] || pathology;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">eFondaMental</h1>
              <p className="text-sm text-slate-600">{pathologyName}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/professional"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                <Home className="h-5 w-5" />
              </Link>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {context.profile.first_name} {context.profile.last_name}
                </p>
                <p className="text-xs text-slate-500">{context.centerName}</p>
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
                href={`/professional/${pathology}`}
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Calendar className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href={`/professional/${pathology}/patients`}
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Users className="h-5 w-5" />
                Patients
              </Link>
              <Link
                href={`/professional/${pathology}/statistics`}
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <BarChart3 className="h-5 w-5" />
                Statistics
              </Link>
            </nav>
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

