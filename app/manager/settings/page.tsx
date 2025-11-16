import { getUserContext } from "@/lib/rbac/middleware";
import { getCenterById, getCenterPathologies, getCenterStats } from "@/lib/services/center.service";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";
import { Card } from "@/components/ui/card";
import { PathologyBadge } from "@/components/ui/pathology-badge";
import { StatCard } from "@/components/ui/stat-card";
import { Users, UserCheck, Calendar } from "lucide-react";

export default async function ManagerSettingsPage() {
  const context = await getUserContext();

  if (!context?.profile.center_id) {
    redirect("/auth/error?message=No center assigned");
  }

  const [center, pathologies, stats] = await Promise.all([
    getCenterById(context.profile.center_id),
    getCenterPathologies(context.profile.center_id),
    getCenterStats(context.profile.center_id),
  ]);

  if (!center) {
    redirect("/auth/error?message=Center not found");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Center Settings</h2>
        <p className="text-slate-600">Manage your center configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          title="Total Visits"
          value={stats.totalVisits}
          icon={Calendar}
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Center Information
        </h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Center information is managed by administrators. Contact an administrator to update center details.
          </p>
        </div>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-slate-500">Center Name</dt>
            <dd className="text-sm text-slate-900 mt-1">{center.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Center Code</dt>
            <dd className="text-sm text-slate-900 mt-1 font-mono">{center.code}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">City</dt>
            <dd className="text-sm text-slate-900 mt-1">{center.city || "Not specified"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Status</dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  center.active
                    ? "bg-green-100 text-green-800"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {center.active ? "Active" : "Inactive"}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Phone</dt>
            <dd className="text-sm text-slate-900 mt-1">{center.phone || "Not specified"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Email</dt>
            <dd className="text-sm text-slate-900 mt-1">{center.email || "Not specified"}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-sm font-medium text-slate-500">Address</dt>
            <dd className="text-sm text-slate-900 mt-1">{center.address || "Not specified"}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-sm font-medium text-slate-500">Assigned Pathologies</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {pathologies.map((pathology) => (
                <PathologyBadge key={pathology.id} pathology={pathology.type} />
              ))}
              {pathologies.length === 0 && (
                <span className="text-sm text-slate-400">No pathologies assigned</span>
              )}
            </dd>
          </div>
        </dl>
      </Card>

      <SettingsForm centerId={context.profile.center_id} />
    </div>
  );
}

