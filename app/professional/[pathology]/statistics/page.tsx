import { getUserContext } from "@/lib/rbac/middleware";
import { 
  getProfessionalStatistics, 
  getCenterStatistics,
  getVisitTypeStatistics 
} from "@/lib/services/statistics.service";
import { PathologyType, PATHOLOGY_NAMES, VISIT_TYPE_NAMES } from "@/lib/types/enums";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CheckCircle, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { redirect } from "next/navigation";

export default async function StatisticsPage({
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

  const [professionalStats, visitTypeStats, centerStats] = await Promise.all([
    getProfessionalStatistics(context.user.id, context.profile.center_id, pathologyType),
    getVisitTypeStatistics(context.profile.center_id, context.user.id),
    // Only fetch center stats if user has permission (we'll implement permission check later)
    getCenterStatistics(context.profile.center_id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Statistics</h2>
        <p className="text-slate-600">{PATHOLOGY_NAMES[pathologyType]}</p>
      </div>

      {/* Personal Statistics */}
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Your Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Patients"
            value={professionalStats.totalPatients}
            icon={Users}
            description="Under your care"
          />
          <StatCard
            title="Active This Month"
            value={professionalStats.activePatientsThisMonth}
            icon={TrendingUp}
            description="Patients seen"
          />
          <StatCard
            title="Visits This Month"
            value={professionalStats.visitsThisMonth}
            icon={Calendar}
            description={`${professionalStats.completedVisitsThisMonth} completed`}
          />
          <StatCard
            title="Completion Rate"
            value={`${professionalStats.visitCompletionRate}%`}
            icon={CheckCircle}
            description="Visit completion"
          />
        </div>
      </div>

      {/* Visit Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Visit Type Breakdown (This Month)</CardTitle>
        </CardHeader>
        <CardContent>
          {visitTypeStats.length > 0 ? (
            <div className="space-y-4">
              {visitTypeStats.map((stat) => (
                <div key={stat.visitType} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">
                      {VISIT_TYPE_NAMES[stat.visitType as keyof typeof VISIT_TYPE_NAMES] || stat.visitType}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {stat.completedCount} of {stat.count} completed
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">{stat.count}</div>
                      <div className="text-xs text-slate-500">Total</div>
                    </div>
                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${stat.count > 0 ? (stat.completedCount / stat.count) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              No visits this month
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Work */}
      {professionalStats.pendingQuestionnaires > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              Pending Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700">
              You have <span className="font-semibold">{professionalStats.pendingQuestionnaires}</span>{" "}
              questionnaire{professionalStats.pendingQuestionnaires !== 1 ? 's' : ''} awaiting completion.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Center-Level Statistics (if has permission) */}
      <div>
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Center Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Patients"
            value={centerStats.totalPatients}
            icon={Users}
            description={`${centerStats.activePatients} active`}
          />
          <StatCard
            title="Professionals"
            value={centerStats.totalProfessionals}
            icon={Users}
            description={`${centerStats.activeProfessionals} active`}
          />
          <StatCard
            title="Visits This Month"
            value={centerStats.visitsThisMonth}
            icon={Calendar}
            description={`${centerStats.completedVisitsThisMonth} completed`}
          />
          <StatCard
            title="Center Completion Rate"
            value={`${centerStats.visitCompletionRate}%`}
            icon={CheckCircle}
            description="Overall performance"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pathology Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {centerStats.pathologyBreakdown.length > 0 ? (
              <div className="space-y-4">
                {centerStats.pathologyBreakdown.map((breakdown) => (
                  <div key={breakdown.pathology} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">
                        {PATHOLOGY_NAMES[breakdown.pathology]}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {breakdown.visitCount} visits this month
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">{breakdown.patientCount}</div>
                      <div className="text-xs text-slate-500">Patients</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                No pathology data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

