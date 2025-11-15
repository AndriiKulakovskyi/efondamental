import { getUserContext } from "@/lib/rbac/middleware";
import { getPathologyByType } from "@/lib/services/center.service";
import { getPatientsByCenterAndPathology, getPatientsRequiringFollowup } from "@/lib/services/patient.service";
import { getUpcomingVisitsByCenter } from "@/lib/services/visit.service";
import { PathologyType } from "@/lib/types/enums";
import { StatCard } from "@/components/ui/stat-card";
import { Users, Calendar, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatShortDate } from "@/lib/utils/date";
import { redirect } from "next/navigation";

export default async function PathologyDashboard({
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

  const [patients, upcomingVisits, patientsRequiringFollowup] = await Promise.all([
    getPatientsByCenterAndPathology(context.profile.center_id, pathologyType),
    getUpcomingVisitsByCenter(context.profile.center_id, 5),
    getPatientsRequiringFollowup(context.profile.center_id, pathologyType),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-600">Clinical overview</p>
        </div>
        <Link href={`/professional/${pathology}/patients/new`}>
          <Button>New Patient</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Patients"
          value={patients.length}
          icon={Users}
        />
        <StatCard
          title="Upcoming Visits"
          value={upcomingVisits.length}
          icon={Calendar}
        />
        <StatCard
          title="Requiring Follow-up"
          value={patientsRequiringFollowup.length}
          icon={AlertTriangle}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Upcoming Visits
          </h3>
          {upcomingVisits.length > 0 ? (
            <div className="space-y-3">
              {upcomingVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="p-3 border border-slate-200 rounded-lg"
                >
                  <p className="font-medium text-slate-900">
                    {visit.patient_first_name} {visit.patient_last_name}
                  </p>
                  <p className="text-sm text-slate-600">
                    {visit.template_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {visit.scheduled_date && formatShortDate(visit.scheduled_date)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No upcoming visits</p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Patients Requiring Follow-up
          </h3>
          {patientsRequiringFollowup.length > 0 ? (
            <div className="space-y-3">
              {patientsRequiringFollowup.slice(0, 5).map((patient) => (
                <Link
                  key={patient.id}
                  href={`/professional/${pathology}/patients/${patient.id}`}
                  className="block p-3 border border-amber-200 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <p className="font-medium text-slate-900">
                    {patient.first_name} {patient.last_name}
                  </p>
                  <p className="text-sm text-slate-600">MRN: {patient.medical_record_number}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No patients requiring immediate follow-up</p>
          )}
        </div>
      </div>
    </div>
  );
}

