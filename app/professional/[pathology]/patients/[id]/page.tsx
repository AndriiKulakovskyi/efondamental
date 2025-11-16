import { getPatientById, getPatientStats, getPatientRiskLevel } from "@/lib/services/patient.service";
import { getVisitsByPatient } from "@/lib/services/visit.service";
import { 
  getEvaluationsByPatient, 
  getMoodTrend, 
  getRiskHistory, 
  getMedicationAdherenceTrend 
} from "@/lib/services/evaluation.service";
import { getUserContext } from "@/lib/rbac/middleware";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { calculateAge, formatShortDate, formatDateTime } from "@/lib/utils/date";
import { formatRiskLevel } from "@/lib/utils/formatting";
import { recordPatientAccess } from "@/lib/services/patient.service";
import { VISIT_TYPE_NAMES, PATHOLOGY_NAMES, PathologyType } from "@/lib/types/enums";
import { AnalyticsCharts } from "./components/analytics-charts";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { DeletePatientDialog } from "./components/delete-patient-dialog";

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

  const [stats, visits, riskLevel, evaluations, moodTrend, riskHistory, adherenceTrend] = await Promise.all([
    getPatientStats(id),
    getVisitsByPatient(id),
    getPatientRiskLevel(id),
    getEvaluationsByPatient(id),
    getMoodTrend(id, fromDate),
    getRiskHistory(id, fromDate),
    getMedicationAdherenceTrend(id, fromDate),
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

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            {patient.first_name} {patient.last_name}
          </h2>
          <p className="text-slate-600">
            MRN: <span className="font-mono">{patient.medical_record_number}</span>
          </p>
        </div>
        <div className="flex gap-2">
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

      {riskLevel !== 'none' && (
        <div className={`border rounded-lg p-4 ${
          riskLevel === 'high' ? 'bg-red-50 border-red-200' :
          riskLevel === 'moderate' ? 'bg-amber-50 border-amber-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className={`h-5 w-5 ${risk.color}`} />
            <span className={`font-semibold ${risk.color}`}>
              {risk.label} Risk Level
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Visits"
          value={stats.totalVisits}
          icon={Calendar}
        />
        <StatCard
          title="Completed"
          value={stats.completedVisits}
          icon={FileText}
        />
        <StatCard
          title="Upcoming"
          value={stats.upcomingVisits}
          icon={Calendar}
        />
        <StatCard
          title="Risk Level"
          value={risk.label}
          icon={AlertTriangle}
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visits">Visits</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Full Name</dt>
                    <dd className="text-sm text-slate-900">
                      {patient.first_name} {patient.last_name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Date of Birth</dt>
                    <dd className="text-sm text-slate-900">
                      {formatShortDate(patient.date_of_birth)} ({calculateAge(patient.date_of_birth)} years old)
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Gender</dt>
                    <dd className="text-sm text-slate-900">{patient.gender || "Not specified"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Pathology</dt>
                    <dd className="text-sm text-slate-900">{patient.pathology_name}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Email</dt>
                    <dd className="text-sm text-slate-900">{patient.email || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Phone</dt>
                    <dd className="text-sm text-slate-900">{patient.phone || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Address</dt>
                    <dd className="text-sm text-slate-900">{patient.address || "Not provided"}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>

          {patient.emergency_contact && (
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-3 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Name</dt>
                    <dd className="text-sm text-slate-900">{patient.emergency_contact.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Phone</dt>
                    <dd className="text-sm text-slate-900">{patient.emergency_contact.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Relationship</dt>
                    <dd className="text-sm text-slate-900">{patient.emergency_contact.relationship}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="visits" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Visit History</h3>
            <Link href={`/professional/${pathology}/patients/${id}/visits/new`}>
              <Button size="sm">Schedule New Visit</Button>
            </Link>
          </div>

          {visits.length > 0 ? (
            <div className="space-y-3">
              {visits.map((visit) => (
                <Link
                  key={visit.id}
                  href={`/professional/${pathology}/patients/${id}/visits/${visit.id}`}
                  className="block"
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-slate-900">{visit.template_name}</h4>
                          <p className="text-sm text-slate-600 capitalize">{visit.visit_type.replace(/_/g, ' ')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-900">
                            {visit.scheduled_date && formatShortDate(visit.scheduled_date)}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              visit.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : visit.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {visit.status}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <p className="text-slate-600">No visits recorded yet</p>
              <Link href={`/professional/${pathology}/patients/${id}/visits/new`}>
                <Button className="mt-4" size="sm">
                  Schedule First Visit
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="evaluations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Clinical Evaluations</h3>
            <div className="text-sm text-slate-600">
              {evaluations.length} evaluation{evaluations.length !== 1 ? 's' : ''} recorded
            </div>
          </div>

          {evaluations.length > 0 ? (
            <div className="space-y-3">
              {evaluations.map((evaluation) => (
                <Card key={evaluation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-slate-900">
                            {evaluation.visit_type && VISIT_TYPE_NAMES[evaluation.visit_type]}
                            {!evaluation.visit_type && "Clinical Evaluation"}
                          </h4>
                          {evaluation.risk_assessment && (
                            <div className="flex gap-2">
                              {evaluation.risk_assessment.suicide_risk && evaluation.risk_assessment.suicide_risk !== 'none' && (
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  evaluation.risk_assessment.suicide_risk === 'high'
                                    ? 'bg-red-100 text-red-800'
                                    : evaluation.risk_assessment.suicide_risk === 'moderate'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  Suicide Risk: {evaluation.risk_assessment.suicide_risk}
                                </span>
                              )}
                              {evaluation.risk_assessment.relapse_risk && evaluation.risk_assessment.relapse_risk !== 'none' && (
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  evaluation.risk_assessment.relapse_risk === 'high'
                                    ? 'bg-red-100 text-red-800'
                                    : evaluation.risk_assessment.relapse_risk === 'moderate'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  Relapse Risk: {evaluation.risk_assessment.relapse_risk}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">
                          Evaluated by {evaluation.evaluator_name} on{" "}
                          {formatDateTime(evaluation.evaluation_date)}
                        </p>
                        <div className="grid grid-cols-3 gap-4 mt-3">
                          {evaluation.mood_score !== null && (
                            <div>
                              <dt className="text-xs font-medium text-slate-500">Mood Score</dt>
                              <dd className="text-sm font-semibold text-slate-900">
                                {evaluation.mood_score}/10
                              </dd>
                            </div>
                          )}
                          {evaluation.medication_adherence !== null && (
                            <div>
                              <dt className="text-xs font-medium text-slate-500">Adherence</dt>
                              <dd className="text-sm font-semibold text-slate-900">
                                {evaluation.medication_adherence}%
                              </dd>
                            </div>
                          )}
                        </div>
                        {evaluation.notes && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                            <p className="text-sm text-slate-700">{evaluation.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <TrendingUp className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No clinical evaluations recorded yet</p>
              <p className="text-sm text-slate-500 mt-2">
                Evaluations will appear here after visits are completed
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
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

