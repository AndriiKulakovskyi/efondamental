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
import { Activity } from "lucide-react";
import { AppFooter } from "@/components/ui/app-footer";
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

  // Get doctor names for conducted_by
  const supabase = await createClient();
  const conductedByIds = Array.from(visitCompletions.values())
    .map(v => v.conductedBy)
    .filter(Boolean) as string[];
  
  const { data: professionals } = await supabase
    .from('user_profiles')
    .select('id, first_name, last_name')
    .in('id', [...new Set(conductedByIds)]);

  const conductedByNames = new Map<string, string>();
  professionals?.forEach(prof => {
    conductedByNames.set(prof.id, `Dr. ${prof.first_name} ${prof.last_name}`);
  });

  // Count visits this month
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background gradient circle - more subtle */}
        <div className="absolute top-1/4 right-[10%] -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-red-50 to-orange-50 rounded-full blur-3xl opacity-40 pointer-events-none" />
        
        <div className="relative z-10 px-12 py-8 space-y-8">
          {/* Header - simplified */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Pathology Icon - smaller, more subtle */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E7000B] to-[#F54900] flex items-center justify-center shadow-sm">
                <Activity className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {PATHOLOGY_NAMES[pathologyType]}
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  {pathologyData?.description || 'Suivi de la dépression résistante'}
                </p>
              </div>
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
            conductedByNames={conductedByNames}
            pathology={pathology}
          />
        </div>
      </div>

      {/* Footer */}
      <AppFooter />
    </div>
  );
}

