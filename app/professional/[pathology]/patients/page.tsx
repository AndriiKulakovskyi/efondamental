import { getUserContext } from "@/lib/rbac/middleware";
import { getPathologyByType } from "@/lib/services/center.service";
import { getPatientsByCenterAndPathology } from "@/lib/services/patient.service";
import { PathologyType } from "@/lib/types/enums";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { PatientsTableWithSearch } from "./components/patients-table-with-search";
import { Users, UserPlus } from "lucide-react";

export default async function PatientsListPage({
  params,
}: {
  params: Promise<{ pathology: string }>;
}) {
  const { pathology } = await params;
  const context = await getUserContext();

  if (!context?.profile.center_id) {
    redirect("/auth/error?message=No center assigned");
  }

  const pathologyType = pathology as PathologyType;
  const pathologyData = await getPathologyByType(pathologyType);
  const patients = await getPatientsByCenterAndPathology(
    context.profile.center_id,
    pathologyType
  );

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Patients</h2>
              <p className="text-slate-500 mt-1">
                {pathologyData?.name} - Gestion et suivi des patients
              </p>
            </div>
          </div>
          <Link href={`/professional/${pathology}/patients/new`}>
            <Button className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Nouveau patient
            </Button>
          </Link>
        </div>

        <PatientsTableWithSearch 
          patients={patients} 
          pathology={pathology} 
        />
      </div>
    </main>
  );
}

