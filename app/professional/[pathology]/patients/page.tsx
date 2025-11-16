import { getUserContext } from "@/lib/rbac/middleware";
import { getPathologyByType } from "@/lib/services/center.service";
import { getPatientsByCenterAndPathology } from "@/lib/services/patient.service";
import { PathologyType } from "@/lib/types/enums";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { PatientsTable } from "./components/patients-table";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Patients</h2>
          <p className="text-slate-600">{pathologyData?.name}</p>
        </div>
        <Link href={`/professional/${pathology}/patients/new`}>
          <Button>New Patient</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <PatientsTable patients={patients} pathology={pathology} />
      </div>
    </div>
  );
}

