import { getPatientById, getPatientStats, getPatientRiskLevel, getPatientInvitationStatus } from "@/lib/services/patient.service";
import { getVisitsByPatient, getBulkVisitCompletionStatus } from "@/lib/services/visit.service";
import { 
  getEvaluationsByPatient, 
  getMoodTrend, 
  getRiskHistory, 
  getMedicationAdherenceTrend 
} from "@/lib/services/evaluation.service";
import { getUserContext } from "@/lib/rbac/middleware";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, MoreVertical, Filter, Calendar } from "lucide-react";
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

  // Get completion percentage for all visits at once using bulk function
  const visitCompletions = await getBulkVisitCompletionStatus(visits.map(v => v.id));
  
  const visitsWithCompletion = visits.map(visit => ({
    ...visit,
    completionPercentage: visitCompletions.get(visit.id)?.completionPercentage || 0,
  }));

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
          <span className="text-slate-900">{patient.first_name} {patient.last_name}</span>
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
              </h2>
              <div className="flex items-center gap-3 mt-1 text-slate-500 text-sm">
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium border border-slate-200">
                  DMI: {patient.medical_record_number}
                </span>
                <span>&bull;</span>
                <span>{patient.pathology_name}</span>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition shadow-sm flex items-center gap-2">
            <MoreVertical className="w-4 h-4" />
            Actions rapides
          </button>
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
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm">
                <Filter className="w-4 h-4" />
                Filtrer
              </button>
              <Link href={`/professional/${pathology}/patients/${id}/visits/new`}>
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition shadow-md">
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
  );
}
