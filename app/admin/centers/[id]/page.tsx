import { getCenterById, getCenterPathologies, getCenterStats } from "@/lib/services/center.service";
import { getManagersByCenter } from "@/lib/services/user.service";
import { StatCard } from "@/components/ui/stat-card";
import { PathologyBadge } from "@/components/ui/pathology-badge";
import { Users, UserCheck, Calendar, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CenterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const center = await getCenterById(id);
  
  if (!center) {
    notFound();
  }

  const [pathologies, stats, managers] = await Promise.all([
    getCenterPathologies(id),
    getCenterStats(id),
    getManagersByCenter(id),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{center.name}</h2>
          <p className="text-slate-600">
            <span className="font-mono">{center.code}</span> • {center.city}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/centers/${id}/managers`}>
            <Button variant="outline">Manage Managers</Button>
          </Link>
          <Link href={`/admin/centers/${id}/edit`}>
            <Button>Edit Center</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <StatCard
          title="Scheduled"
          value={stats.scheduledVisits}
          icon={Building2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Center Information
          </h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-slate-500">Address</dt>
              <dd className="text-sm text-slate-900">{center.address || "Not specified"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Phone</dt>
              <dd className="text-sm text-slate-900">{center.phone || "Not specified"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Email</dt>
              <dd className="text-sm text-slate-900">{center.email || "Not specified"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Status</dt>
              <dd>
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
          </dl>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Pathologies
          </h3>
          <div className="flex flex-wrap gap-2">
            {pathologies.map((pathology) => (
              <PathologyBadge key={pathology.id} pathology={pathology.type} />
            ))}
          </div>
          {pathologies.length === 0 && (
            <p className="text-sm text-slate-500">No pathologies assigned</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Managers</h3>
          <Link href={`/admin/centers/${id}/managers/new`}>
            <Button size="sm">Add Manager</Button>
          </Link>
        </div>
        {managers.length > 0 ? (
          <div className="space-y-2">
            {managers.map((manager) => (
              <div
                key={manager.id}
                className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {manager.first_name} {manager.last_name}
                  </p>
                  <p className="text-sm text-slate-500">{manager.email}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    manager.active
                      ? "bg-green-100 text-green-800"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {manager.active ? "Active" : "Inactive"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No managers assigned to this center</p>
        )}
      </div>
    </div>
  );
}

