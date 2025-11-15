import { StatCard } from "@/components/ui/stat-card";
import { getGlobalStatistics } from "@/lib/services/analytics.service";
import { getAllCenters } from "@/lib/services/center.service";
import { Building2, Users, UserCheck, Calendar } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Center } from "@/lib/types/database.types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const centerColumns: ColumnDef<Center>[] = [
  {
    accessorKey: "name",
    header: "Center Name",
    cell: ({ row }) => (
      <Link
        href={`/admin/centers/${row.original.id}`}
        className="font-medium text-blue-600 hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.original.active
            ? "bg-green-100 text-green-800"
            : "bg-slate-100 text-slate-800"
        }`}
      >
        {row.original.active ? "Active" : "Inactive"}
      </span>
    ),
  },
];

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
        <DataTable columns={centerColumns} data={centers} />
      </div>
    </div>
  );
}

