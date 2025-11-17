import { getUserContext } from "@/lib/rbac/middleware";
import { getCenterPathologies } from "@/lib/services/center.service";
import { PathologyBadge } from "@/components/ui/pathology-badge";
import { PATHOLOGY_NAMES } from "@/lib/types/enums";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";

export default async function ProfessionalLandingPage() {
  const context = await getUserContext();

  if (!context?.profile.center_id) {
    redirect("/auth/error?message=No center assigned");
  }

  const pathologies = await getCenterPathologies(context.profile.center_id);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">eFondaMental</h1>
              <p className="text-sm text-slate-600">{context.centerName}</p>
            </div>
            <div className="flex items-center gap-4">
              <UserProfileDropdown
                firstName={context.profile.first_name || ""}
                lastName={context.profile.last_name || ""}
                email={context.profile.email}
                role={context.profile.role}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <p className="text-lg text-slate-600">
              Welcome, {context.profile.first_name}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 text-center mb-2">
              Select a Pathology
            </h2>
            <p className="text-slate-600 text-center">
              Choose a pathology to access the clinical dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pathologies.map((pathology) => (
              <Link
                key={pathology.id}
                href={`/professional/${pathology.type}`}
                className="block group"
              >
                <div
                  className="bg-white rounded-xl border-2 border-slate-200 shadow-sm h-48 flex flex-col p-6 hover:border-slate-700 hover:shadow-xl transition-all duration-300 cursor-pointer group-hover:-translate-y-1"
                  style={{ 
                    borderLeftWidth: '6px',
                    borderLeftColor: pathology.color || '#64748b'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <PathologyBadge pathology={pathology.type} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
                    {PATHOLOGY_NAMES[pathology.type]}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 flex-grow">
                    {pathology.description}
                  </p>
                  <div className="mt-4 flex items-center text-slate-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Access dashboard</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {pathologies.length === 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
              <p className="text-slate-600">
                No pathologies are assigned to your center.
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Please contact your manager or administrator.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

