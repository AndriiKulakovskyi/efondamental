import { getUserContext } from "@/lib/rbac/middleware";
import { getPathologyByType } from "@/lib/services/center.service";
import { getPatientsByCenterAndPathology, getPatientsRequiringFollowup, getRecentlyAccessedPatients } from "@/lib/services/patient.service";
import { getUpcomingVisitsByCenter } from "@/lib/services/visit.service";
import { PathologyType } from "@/lib/types/enums";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { NotificationsPanel } from "./components/notifications-panel";
import { DashboardStatCards } from "./components/dashboard-stat-cards";
import { RecentlyConsultedTable } from "./components/recently-consulted-table";
import { DashboardQuickSearch } from "./components/dashboard-quick-search";

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

  const [patients, upcomingVisits, patientsRequiringFollowup, recentPatients] = await Promise.all([
    getPatientsByCenterAndPathology(context.profile.center_id, pathologyType),
    getUpcomingVisitsByCenter(context.profile.center_id, 10),
    getPatientsRequiringFollowup(context.profile.center_id, pathologyType),
    getRecentlyAccessedPatients(context.user.id, 10),
  ]);

  // Generate notifications from patients requiring followup
  const notifications = patientsRequiringFollowup.slice(0, 5).map((patient) => ({
    id: patient.id,
    type: "high_risk" as const,
    title: "Patient Requires Follow-up",
    message: "This patient has been flagged for follow-up attention",
    patientId: patient.id,
    patientName: `${patient.first_name} ${patient.last_name}`,
    link: `/professional/${pathology}/patients/${patient.id}`,
    priority: "high" as const,
    timestamp: new Date().toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-600">Clinical overview</p>
        </div>
        <div className="flex items-center gap-3">
          <DashboardQuickSearch pathology={pathology} />
          <Link href={`/professional/${pathology}/patients/new`}>
            <Button>New Patient</Button>
          </Link>
        </div>
      </div>

      <DashboardStatCards
        patients={patients}
        upcomingVisits={upcomingVisits}
        patientsRequiringFollowup={patientsRequiringFollowup}
        pathology={pathology}
      />

      <RecentlyConsultedTable
        recentPatients={recentPatients}
        pathology={pathology}
      />

      {notifications.length > 0 && (
        <NotificationsPanel notifications={notifications} pathology={pathology} />
      )}
    </div>
  );
}

