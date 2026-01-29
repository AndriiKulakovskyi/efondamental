import { getPatientProfileData } from "@/lib/services/patient-profile.service";
import { recordPatientAccess } from "@/lib/services/patient.service";
import { getUserContext } from "@/lib/rbac/middleware";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { notFound, redirect } from "next/navigation";
import { formatRiskLevel } from "@/lib/utils/formatting";
import { AnalyticsCharts } from "./components/analytics-charts";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { InvitationStatus } from "./components/invitation-status";
import { PatientStatCards } from "./components/patient-stat-cards";
import { PatientOverview } from "./components/patient-overview";
import { VisitCards } from "./components/visit-cards";
import { EvaluationsDisplay } from "./components/evaluations-display";
import { AnalyticsSummary } from "./components/analytics-summary";
import { QuickActionsMenu } from "./components/quick-actions-menu";
import Link from "next/link";

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

  if (!context.profile.center_id) {
    redirect("/auth/error?message=No center assigned");
  }

  // Record access for "recently viewed" feature
  await recordPatientAccess(context.user.id, id);

  // Calculate date for last 12 months
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  const fromDate = twelveMonthsAgo.toISOString();

  // Fetch all patient profile data in a single optimized RPC call
  const {
    patient,
    stats: rawStats,
    visits,
    riskLevel,
    evaluations,
    moodTrend,
    riskHistory,
    adherenceTrend,
    invitationStatus,
    availableDoctors: doctors
  } = await getPatientProfileData(id, context.profile.center_id, fromDate);

  if (!patient) {
    notFound();
  }

  // Transform stats to match component expectations (snake_case -> camelCase)
  const stats = {
    totalVisits: rawStats.total_visits,
    completedVisits: rawStats.completed_visits,
    upcomingVisits: rawStats.upcoming_visits,
  };

  // Transform invitation status to match component expectations
  const transformedInvitationStatus = {
    hasUserAccount: invitationStatus.hasUserAccount,
    userId: invitationStatus.userId,
    pendingInvitation: invitationStatus.pendingInvitation ? {
      id: invitationStatus.pendingInvitation.id,
      sentAt: invitationStatus.pendingInvitation.sent_at,
      expiresAt: invitationStatus.pendingInvitation.expires_at,
      email: invitationStatus.pendingInvitation.email,
    } : null
  };

  // Map visits to include completion percentage for display
  const visitsWithCompletion = visits;

  const risk = formatRiskLevel(riskLevel);

  return (
    <div className="min-h-screen bg-[#FDFBFA] pb-12">
      <div className="px-12 py-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-slate-400 font-medium">
          <a href={`/professional/${pathology}`} className="hover:text-slate-600 transition">
            Tableau de bord
          </a>
          <span className="mx-2">/</span>
          <a href={`/professional/${pathology}/patients`} className="hover:text-slate-600 transition">
            Patients
          </a>
          <span className="mx-2">/</span>
          <span className="text-slate-900">
            {patient.first_name} {patient.last_name}
            {patient.gender === 'F' && patient.maiden_name && ` (${patient.maiden_name})`}
          </span>
        </nav>

        {/* Patient Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center text-2xl font-bold tracking-wider">
              {patient.first_name[0]}{patient.last_name[0]}
            </div>
              <div>
              <h2 className="text-2xl font-bold text-slate-900">
                  {patient.first_name} {patient.last_name}
                  {patient.gender === 'F' && patient.maiden_name && (
                    <span className="text-slate-400 font-bold ml-2">({patient.maiden_name})</span>
                  )}
                </h2>
              <div className="flex items-center gap-3 mt-1 text-slate-500 text-sm">
                <span className="bg-brand/10 text-brand-dark px-2 py-0.5 rounded text-xs font-bold border border-brand/20">
                  FondaCode: {patient.fondacode || 'N/A'}
                  </span>
                <span>&bull;</span>
                  <span>{patient.pathology_name}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 items-end">
            <QuickActionsMenu
              patientId={id}
              patientFirstName={patient.first_name}
              patientLastName={patient.last_name}
              currentEmail={patient.email}
              currentAssignedTo={patient.assigned_to}
              createdBy={patient.created_by}
              currentUserId={context.user.id}
              doctors={doctors}
              pathology={pathology}
            />
            <Link href={`/professional/${pathology}/patients/${id}/treatment`} className="w-full">
              <Button variant="outline" size="sm" className="w-full gap-2 bg-brand hover:bg-brand-dark text-white border-brand">
                Traitement
              </Button>
            </Link>
          </div>
          </div>

          {/* Risk Alert */}
          {riskLevel !== 'none' && (
          <div className={`border-l-4 rounded-lg p-4 ${
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

        {/* Stat Cards */}
        <PatientStatCards 
          stats={stats}
          visits={visitsWithCompletion}
          pathology={pathology}
          patientId={id}
        />

        {/* Tabs with Actions */}
          <Tabs defaultValue="visits" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-200 pb-1">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <TabsList className="bg-transparent border-0 p-0">
                <TabsTrigger 
                  value="visits"
                  className="px-4 py-2 bg-white text-slate-900 text-sm font-semibold rounded-lg shadow-sm data-[state=inactive]:bg-transparent data-[state=inactive]:shadow-none data-[state=inactive]:text-slate-500"
                >
                  Visites
                </TabsTrigger>
                <TabsTrigger 
                  value="overview"
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200/50 transition data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  Vue d'ensemble
                </TabsTrigger>
                <TabsTrigger 
                  value="evaluations"
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200/50 transition data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  Évaluations
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics"
                  className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200/50 transition data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  Analyses
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex items-center gap-3">
              <Link href={`/professional/${pathology}/patients/${id}/visits/new`}>
                <button className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-bold rounded-lg transition shadow-sm">
                  <Calendar className="w-4 h-4" />
                  Planifier une visite
                </button>
              </Link>
            </div>
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
                hasUserAccount={transformedInvitationStatus.hasUserAccount}
                pendingInvitation={transformedInvitationStatus.pendingInvitation}
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
  );
}
