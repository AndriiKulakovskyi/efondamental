import { getUserContext } from "@/lib/rbac/middleware";
import { getCenterStats } from "@/lib/services/center.service";
import { getProfessionalsByCenter } from "@/lib/services/user.service";
import { getRecentActivity } from "@/lib/services/audit.service";
import { StatCard } from "@/components/ui/stat-card";
import { Users, UserCheck, Calendar, CheckCircle } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils/date";
import { TimeAgo } from "@/components/ui/time-ago";
import { redirect } from "next/navigation";

export default async function ManagerDashboard() {
  const context = await getUserContext();

  if (!context?.profile.center_id) {
    redirect("/auth/error?message=No center assigned");
  }

  const [stats, professionals, recentActivity] = await Promise.all([
    getCenterStats(context.profile.center_id),
    getProfessionalsByCenter(context.profile.center_id),
    getRecentActivity(context.profile.center_id, 10),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-600">Center overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Patients"
          value={stats.patientCount}
          icon={Users}
        />
        <StatCard
          title="Staff Members"
          value={stats.userCount}
          icon={UserCheck}
        />
        <StatCard
          title="Completed Visits"
          value={stats.completedVisits}
          description={`${stats.totalVisits} total`}
          icon={CheckCircle}
        />
        <StatCard
          title="Scheduled"
          value={stats.scheduledVisits}
          icon={Calendar}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Healthcare Professionals
          </h3>
          {professionals.length > 0 ? (
            <div className="space-y-2">
              {professionals.slice(0, 5).map((professional) => (
                <div
                  key={professional.id}
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {professional.first_name} {professional.last_name}
                    </p>
                    <p className="text-sm text-slate-500">{professional.email}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      professional.active
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {professional.active ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No professionals in this center</p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Recent Activity
          </h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="text-sm">
                  <p className="text-slate-900 font-medium capitalize">
                    {activity.action.replace(/_/g, ' ')}
                  </p>
                  <TimeAgo
                    date={activity.created_at}
                    className="text-xs text-slate-400 mt-1 block"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}

