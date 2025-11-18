import { getPatientById, getPatientStats, getPatientRiskLevel, getPatientInvitationStatus } from "@/lib/services/patient.service";
import { getVisitsByPatient } from "@/lib/services/visit.service";
import { 
  getEvaluationsByPatient, 
  getMoodTrend, 
  getRiskHistory, 
  getMedicationAdherenceTrend 
} from "@/lib/services/evaluation.service";
import { getUserContext } from "@/lib/rbac/middleware";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { formatRiskLevel } from "@/lib/utils/formatting";
import { recordPatientAccess } from "@/lib/services/patient.service";
import { AnalyticsCharts } from "./components/analytics-charts";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { DeletePatientDialog } from "./components/delete-patient-dialog";
import { InvitationStatus } from "./components/invitation-status";
import { EditPatientEmail } from "./components/edit-patient-email";
import { PatientStatCards } from "./components/patient-stat-cards";
import { PatientOverview } from "./components/patient-overview";
import { VisitTimeline } from "./components/visit-timeline";
import { EvaluationsDisplay } from "./components/evaluations-display";
import { AnalyticsSummary } from "./components/analytics-summary";

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

  const risk = formatRiskLevel(riskLevel);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: `/professional/${pathology}` },
          { label: "Patients", href: `/professional/${pathology}/patients` },
          { label: `${patient.first_name} ${patient.last_name}` },
        ]}
      />

      {/* Enhanced Header with Avatar */}
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
                  MRN: <span className="font-mono font-medium">{patient.medical_record_number}</span>
                </span>
                <span className="text-slate-400">•</span>
                <span>{patient.pathology_name}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <EditPatientEmail
              patientId={id}
              currentEmail={patient.email}
              patientFirstName={patient.first_name}
              patientLastName={patient.last_name}
            />
            <Link href={`/professional/${pathology}/patients/${id}/visits/new`}>
              <Button>Schedule Visit</Button>
            </Link>
            <DeletePatientDialog
              patientId={id}
              patientFirstName={patient.first_name}
              patientLastName={patient.last_name}
              pathology={pathology}
            />
          </div>
        </div>

        {/* Enhanced Risk Alert */}
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
                  {risk.label} Risk Level
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Requires clinical attention and monitoring
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Stat Cards */}
      <PatientStatCards 
        stats={stats}
        riskLevel={risk.label}
        riskColor={risk.color}
        visits={visits}
        pathology={pathology}
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visits">Visits</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <InvitationStatus
            patientId={id}
            patientEmail={patient.email}
            hasUserAccount={invitationStatus.hasUserAccount}
            pendingInvitation={invitationStatus.pendingInvitation}
          />

          <PatientOverview patient={patient} />
        </TabsContent>

        <TabsContent value="visits">
          <VisitTimeline 
            visits={visits}
            pathology={pathology}
            patientId={id}
          />
        </TabsContent>

        <TabsContent value="evaluations">
          <EvaluationsDisplay evaluations={evaluations} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsSummary 
            moodTrend={moodTrend}
            riskHistory={riskHistory}
            adherenceTrend={adherenceTrend}
            currentRiskLevel={risk.label}
          />
          
          <AnalyticsCharts
            moodTrend={moodTrend}
            riskHistory={riskHistory}
            adherenceTrend={adherenceTrend}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

