import { getUserContext } from "@/lib/rbac/middleware";
import { getCenterPathologies } from "@/lib/services/center.service";
import { PathologyBadge } from "@/components/ui/pathology-badge";
import { PATHOLOGY_NAMES } from "@/lib/types/enums";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfessionalLandingPage() {
  const context = await getUserContext();

  if (!context?.profile.center_id) {
    redirect("/auth/error?message=No center assigned");
  }

  const pathologies = await getCenterPathologies(context.profile.center_id);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">eFondaMental</h1>
          <p className="text-lg text-slate-600">
            Welcome, {context.profile.first_name}
          </p>
          <p className="text-sm text-slate-500">{context.centerName}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 text-center mb-2">
            Select a Pathology
          </h2>
          <p className="text-slate-600 text-center">
            Choose a pathology to access the clinical dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pathologies.map((pathology) => (
            <Link
              key={pathology.id}
              href={`/professional/${pathology.type}`}
              className="block"
            >
              <div
                className="bg-white rounded-lg border-2 border-slate-200 p-6 hover:border-slate-700 hover:shadow-lg transition-all cursor-pointer"
                style={{ borderColor: pathology.color || undefined }}
              >
                <div className="flex items-center justify-between mb-3">
                  <PathologyBadge pathology={pathology.type} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {PATHOLOGY_NAMES[pathology.type]}
                </h3>
                <p className="text-sm text-slate-600">{pathology.description}</p>
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
  );
}

