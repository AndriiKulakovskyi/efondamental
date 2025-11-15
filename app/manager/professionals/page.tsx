import { getUserContext } from "@/lib/rbac/middleware";
import { getProfessionalsByCenter } from "@/lib/services/user.service";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { UserProfile } from "@/lib/types/database.types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const columns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: "last_name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/manager/professionals/${row.original.id}`}
        className="font-medium text-blue-600 hover:underline"
      >
        {row.original.first_name} {row.original.last_name}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone || "Not specified",
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

export default async function ProfessionalsPage() {
  const context = await getUserContext();

  if (!context?.profile.center_id) {
    redirect("/auth/error?message=No center assigned");
  }

  const professionals = await getProfessionalsByCenter(context.profile.center_id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Healthcare Professionals</h2>
          <p className="text-slate-600">Manage professionals in your center</p>
        </div>
        <Link href="/manager/professionals/new">
          <Button>Invite Professional</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <DataTable
          columns={columns}
          data={professionals}
          searchable
          searchColumn="last_name"
          searchPlaceholder="Search professionals..."
        />
      </div>
    </div>
  );
}

