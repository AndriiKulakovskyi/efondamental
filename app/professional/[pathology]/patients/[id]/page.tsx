import { getPatientById, getPatientStats, getPatientRiskLevel, getPatientInvitationStatus } from "@/lib/services/patient.service";
import { getVisitsByPatient, getVisitCompletionStatus } from "@/lib/services/visit.service";
import { 
  getEvaluationsByPatient, 
  getMoodTrend, 
  getRiskHistory, 
  getMedicationAdherenceTrend 
} from "@/lib/services/evaluation.service";
import { getUserContext } from "@/lib/rbac/middleware";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, User as UserIcon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { notFound, redirect } from "next/navigation";
import { formatRiskLevel } from "@/lib/utils/formatting";
import { recordPatientAccess } from "@/lib/services/patient.service";
import { AnalyticsCharts } from "./components/analytics-charts";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { InvitationStatus } from "./components/invitation-status";
import { PatientStatCards } from "./components/patient-stat-cards";
import { PatientOverview } from "./components/patient-overview";
import { VisitCards } from "./components/visit-cards";
import { EvaluationsDisplay } from "./components/evaluations-display";
import { AnalyticsSummary } from "./components/analytics-summary";
import { QuickActionsMenu } from "./components/quick-actions-menu";
import { createClient } from "@/lib/supabase/server";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ pathology: string; id: string }>;
}) {
  const { pathology, id } = await params;
  const context = await getUserContext();

  if (!context) {
    redirect("/auth/login");
  }

  const patient = await getPatientById(id);

  if (!patient) {
    notFound();
  }

  // Record access for "recently viewed" feature
  await recordPatientAccess(context.user.id, id);

  // Fetch all doctors from the same center for reassignment
  const supabase = await createClient();
  const { data: doctors } = await supabase
    .from('user_profiles')
    .select('id, first_name, last_name')
    .eq('center_id', context.profile.center_id)
    .eq('role', 'healthcare_professional')
    .order('last_name, first_name');

  // Calculate date for last 12 months
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  const fromDate = twelveMonthsAgo.toISOString();

  const [stats, visits, riskLevel, evaluations, moodTrend, riskHistory, adherenceTrend, invitationStatus] = await Promise.all([
    getPatientStats(id),
    getVisitsByPatient(id),
    getPatientRiskLevel(id),
    getEvaluationsByPatient(id),
    getMoodTrend(id, fromDate),
    getRiskHistory(id, fromDate),
    getMedicationAdherenceTrend(id, fromDate),
    getPatientInvitationStatus(id),
  ]);

  // Get completion percentage for each visit
  const visitsWithCompletion = await Promise.all(
    visits.map(async (visit) => {
      const completion = await getVisitCompletionStatus(visit.id);
      return {
        ...visit,
        completionPercentage: completion.completionPercentage,
      };
    })
  );

  const risk = formatRiskLevel(riskLevel);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="px-12 py-8 space-y-6">
        <Breadcrumb
          items={[
            { label: "Tableau de bord", href: `/professional/${pathology}` },
            { label: "Patients", href: `/professional/${pathology}/patients` },
            { label: `${patient.first_name} ${patient.last_name}` },
          ]}
        />

        {/* Patient Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar 
                firstName={patient.first_name} 
                lastName={patient.last_name}
                className="h-16 w-16 text-lg"
              />
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-1">
                  {patient.first_name} {patient.last_name}
                </h2>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <UserIcon className="h-4 w-4" />
                    DMI: <span className="font-mono font-medium">{patient.medical_record_number}</span>
                  </span>
                  <span className="text-slate-400">•</span>
                  <span>{patient.pathology_name}</span>
                </div>
              </div>
            </div>
            <QuickActionsMenu
              patientId={id}
              patientFirstName={patient.first_name}
              patientLastName={patient.last_name}
              currentEmail={patient.email}
              currentAssignedTo={patient.assigned_to}
              createdBy={patient.created_by}
              currentUserId={context.user.id}
              doctors={doctors || []}
              pathology={pathology}
            />
          </div>

          {/* Risk Alert */}
          {riskLevel !== 'none' && (
            <div className={`mt-4 border-l-4 rounded-lg p-4 ${
              riskLevel === 'high' ? 'bg-red-50 border-red-500' :
              riskLevel === 'moderate' ? 'bg-amber-50 border-amber-500' :
              'bg-blue-50 border-blue-500'
            }`}>
              <div className="flex items-center gap-3">
                <AlertTriangle className={`h-5 w-5 ${risk.color}`} />
                <div>
                  <span className={`font-bold ${risk.color}`}>
                    Niveau de risque {risk.label.toLowerCase()}
                  </span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Nécessite attention clinique et suivi
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stat Cards */}
        <PatientStatCards 
          stats={stats}
          visits={visitsWithCompletion}
          pathology={pathology}
        />

        {/* Tabs */}
        <div className="space-y-6">
          <Tabs defaultValue="visits" className="w-full">
            <div className="inline-flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
              <TabsList className="bg-transparent border-0 p-0">
                <TabsTrigger 
                  value="visits"
                  className="data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-slate-600 px-6 py-2 rounded-md"
                >
                  Visites
                </TabsTrigger>
                <TabsTrigger 
                  value="overview"
                  className="data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-slate-600 px-6 py-2 rounded-md"
                >
                  Vue d'ensemble
                </TabsTrigger>
                <TabsTrigger 
                  value="evaluations"
                  className="data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-slate-600 px-6 py-2 rounded-md"
                >
                  Évaluations
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics"
                  className="data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-slate-600 px-6 py-2 rounded-md"
                >
                  Analyses
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="visits" className="mt-6">
              <VisitCards 
                visits={visitsWithCompletion}
                pathology={pathology}
                patientId={id}
              />
            </TabsContent>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <InvitationStatus
                patientId={id}
                patientEmail={patient.email}
                hasUserAccount={invitationStatus.hasUserAccount}
                pendingInvitation={invitationStatus.pendingInvitation}
              />

              <PatientOverview patient={patient} />
            </TabsContent>

            <TabsContent value="evaluations" className="mt-6">
              <EvaluationsDisplay evaluations={evaluations} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6 mt-6">
              <AnalyticsSummary 
                moodTrend={moodTrend}
                riskHistory={riskHistory}
                adherenceTrend={adherenceTrend}
                currentRiskLevel={riskLevel}
              />
              
              <AnalyticsCharts
                moodTrend={moodTrend}
                riskHistory={riskHistory}
                adherenceTrend={adherenceTrend}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
