import { getUserContext } from "@/lib/rbac/middleware";
import { getPathologyByType } from "@/lib/services/center.service";
import { 
  getPatientsByCenterAndPathology, 
  getPatientsRequiringFollowup, 
  getPatientsByProfessional,
  getPatientDemographics
} from "@/lib/services/patient.service";
import { getMultiplePatientVisitCompletions } from "@/lib/services/visit.service";
import { PathologyType, PATHOLOGY_NAMES } from "@/lib/types/enums";
import { redirect } from "next/navigation";
import { DashboardStatsRedesign } from "./components/dashboard-stats-redesign";
import { DashboardPatientsTable } from "./components/dashboard-patients-table";
import { LayoutGrid } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

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

  // Fetch all required data
  const [
    centerPatients, 
    myPatients, 
    patientsRequiringFollowup,
    demographics
  ] = await Promise.all([
    getPatientsByCenterAndPathology(context.profile.center_id, pathologyType),
    getPatientsByProfessional(context.user.id, pathologyType),
    getPatientsRequiringFollowup(context.profile.center_id, pathologyType),
    getPatientDemographics(context.profile.center_id, pathologyType),
  ]);

  // Get visit completions for all patients
  const allPatientIds = [...new Set([...centerPatients.map(p => p.id), ...myPatients.map(p => p.id)])];
  const visitCompletions = await getMultiplePatientVisitCompletions(allPatientIds);

  // Count visits this month
  const supabase = await createClient();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  // Get visits this month for this center
  const visitsQuery = supabase
    .from('visits')
    .select('id, patient:patients!inner(center_id)', { count: 'exact', head: true })
    .eq('patient.center_id', context.profile.center_id)
    .gte('scheduled_date', firstDayOfMonth.toISOString())
    .lte('scheduled_date', lastDayOfMonth.toISOString());
  
  const { count: visitsThisMonth } = await visitsQuery;

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <LayoutGrid className="w-6 h-6" />
              </div>
              <div>
            <h2 className="text-3xl font-bold text-slate-900">
                  {PATHOLOGY_NAMES[pathologyType]}
            </h2>
            <p className="text-slate-500 mt-1">
              {pathologyData?.description || 'Mood disorder characterized by episodes of mania and depression'}
                </p>
            </div>
          </div>

          {/* Stats Cards */}
          <DashboardStatsRedesign
            totalPatients={centerPatients.length}
            alertsCount={patientsRequiringFollowup.length}
            visitsThisMonth={visitsThisMonth || 0}
            demographics={demographics}
          />

          {/* Patients Table */}
          <DashboardPatientsTable
            myPatients={myPatients}
            centerPatients={centerPatients}
            visitCompletions={visitCompletions}
            pathology={pathology}
          />
        </div>
    </main>
  );
}

