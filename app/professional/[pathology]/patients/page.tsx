import { getUserContext } from "@/lib/rbac/middleware";
import { getPathologyByType } from "@/lib/services/center.service";
import { getPatientsByCenterAndPathology } from "@/lib/services/patient.service";
import { PathologyType } from "@/lib/types/enums";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { PatientFull } from "@/lib/types/database.types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { calculateAge } from "@/lib/utils/date";
import { redirect } from "next/navigation";

const columns: ColumnDef<PatientFull>[] = [
  {
    accessorKey: "last_name",
    header: "Name",
    cell: ({ row }) => {
      const pathology = (row.original as any).pathology_type;
      return (
        <Link
          href={`/professional/${pathology}/patients/${row.original.id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          {row.original.first_name} {row.original.last_name}
        </Link>
      );
    },
  },
  {
    accessorKey: "medical_record_number",
    header: "MRN",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.medical_record_number}</span>
    ),
  },
  {
    accessorKey: "date_of_birth",
    header: "Age",
    cell: ({ row }) => `${calculateAge(row.original.date_of_birth)} years`,
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => row.original.gender || "Not specified",
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

export default async function PatientsListPage({
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
  const pathologyData = await getPathologyByType(pathologyType);
  const patients = await getPatientsByCenterAndPathology(
    context.profile.center_id,
    pathologyType
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Patients</h2>
          <p className="text-slate-600">{pathologyData?.name}</p>
        </div>
        <Link href={`/professional/${pathology}/patients/new`}>
          <Button>New Patient</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <DataTable
          columns={columns}
          data={patients}
          searchable
          searchColumn="last_name"
          searchPlaceholder="Search patients..."
          paginated
          pageSize={20}
        />
      </div>
    </div>
  );
}

