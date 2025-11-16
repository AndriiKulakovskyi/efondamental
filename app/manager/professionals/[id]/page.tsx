import { getUserById, getUserActivityStats } from "@/lib/services/user.service";
import { getUserContext } from "@/lib/rbac/middleware";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Users, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { formatTimeAgo } from "@/lib/utils/date";

export default async function ProfessionalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await getUserContext();

  const professional = await getUserById(id);

  if (!professional) {
    notFound();
  }

  const stats = await getUserActivityStats(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            {professional.first_name} {professional.last_name}
          </h2>
          <p className="text-slate-600">{professional.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit Profile</Button>
          <Button>Manage Permissions</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Patients Created"
          value={stats.patientsCreated}
          icon={Users}
        />
        <StatCard
          title="Visits Conducted"
          value={stats.visitsConducted}
          icon={Calendar}
        />
        <StatCard
          title="Evaluations"
          value={stats.evaluationsCompleted}
          icon={FileText}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-slate-500">Full Name</dt>
                <dd className="text-sm text-slate-900">
                  {professional.first_name} {professional.last_name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Email</dt>
                <dd className="text-sm text-slate-900">{professional.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Phone</dt>
                <dd className="text-sm text-slate-900">
                  {professional.phone || "Not provided"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Username</dt>
                <dd className="text-sm text-slate-900 font-mono">
                  {professional.username || "Not set"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Status</dt>
                <dd>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      professional.active
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {professional.active ? "Active" : "Inactive"}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Last Active</dt>
                <dd className="text-sm text-slate-900">
                  {stats.lastActivity
                    ? formatTimeAgo(stats.lastActivity)
                    : "Never"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Manage granular permissions for this professional
            </p>
            <Button variant="outline" className="w-full">
              Configure Permissions
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.patientsCreated}</p>
              <p className="text-sm text-slate-600">Patients Created</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.visitsConducted}</p>
              <p className="text-sm text-slate-600">Visits Conducted</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.evaluationsCompleted}</p>
              <p className="text-sm text-slate-600">Evaluations Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

