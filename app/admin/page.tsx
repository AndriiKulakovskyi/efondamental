import { StatCard } from "@/components/ui/stat-card";
import { getGlobalStatistics } from "@/lib/services/analytics.service";
import { getAllCenters } from "@/lib/services/center.service";
import { Building2, Users, UserCheck, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CentersTable } from "./components/centers-table";

export default async function AdminDashboard() {
  const stats = await getGlobalStatistics();
  const centers = await getAllCenters();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-600">Platform-wide overview and statistics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Centers"
          value={stats.activeCenters}
          description={`${stats.totalCenters} total`}
          icon={Building2}
        />
        <StatCard
          title="Active Patients"
          value={stats.activePatients}
          description={`${stats.totalPatients} total`}
          icon={Users}
        />
        <StatCard
          title="Professionals"
          value={stats.activeProfessionals}
          description={`${stats.totalProfessionals} total`}
          icon={UserCheck}
        />
        <StatCard
          title="Visits This Month"
          value={stats.completedVisitsThisMonth}
          description={`${stats.visitsThisMonth} scheduled`}
          icon={Calendar}
        />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Centers</h3>
          <Link href="/admin/centers/new">
            <Button>Create Center</Button>
          </Link>
        </div>
        <CentersTable centers={centers} />
      </div>
    </div>
  );
}

