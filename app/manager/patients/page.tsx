import { getUserContext } from "@/lib/rbac/middleware";
import { getPatientsByCenter } from "@/lib/services/patient.service";
import { getCenterPathologies } from "@/lib/services/center.service";
import { redirect } from "next/navigation";
import { PatientsTable } from "./components/patients-table";
import { StatCard } from "@/components/ui/stat-card";
import { Users, Heart, AlertCircle } from "lucide-react";

export default async function ManagerPatientsPage() {
  const context = await getUserContext();

  if (!context?.profile.center_id) {
    redirect("/auth/error?message=No center assigned");
  }

  const [patients, pathologies] = await Promise.all([
    getPatientsByCenter(context.profile.center_id),
    getCenterPathologies(context.profile.center_id),
  ]);

  // Calculate stats
  const totalPatients = patients.length;
  const patientsByPathology = pathologies.map((pathology) => ({
    type: pathology.type,
    name: pathology.name,
    count: patients.filter((p) => p.pathology_type === pathology.type).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">All Patients</h2>
        <p className="text-slate-600">View and manage all patients in your center</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Patients"
          value={totalPatients}
          icon={Users}
        />
        {patientsByPathology.slice(0, 2).map((pathology) => (
          <StatCard
            key={pathology.type}
            title={pathology.name}
            value={pathology.count}
            description={`${((pathology.count / totalPatients) * 100 || 0).toFixed(0)}% of total`}
            icon={Heart}
          />
        ))}
      </div>

      <PatientsTable patients={patients} pathologies={pathologies} />
    </div>
  );
}

