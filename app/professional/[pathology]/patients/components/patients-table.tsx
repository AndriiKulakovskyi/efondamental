"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { PatientFull } from "@/lib/types/database.types";
import Link from "next/link";
import { calculateAge } from "@/lib/utils/date";

const createColumns = (pathology: string): ColumnDef<PatientFull>[] => [
  {
    accessorKey: "last_name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/professional/${pathology}/patients/${row.original.id}`}
        className="font-medium text-blue-600 hover:underline"
      >
        {row.original.first_name} {row.original.last_name}
      </Link>
    ),
  },
  {
    accessorKey: "fondacode",
    header: "FondaCode",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-semibold text-brand">{row.original.fondacode || 'N/A'}</span>
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

interface PatientsTableProps {
  patients: PatientFull[];
  pathology: string;
}

export function PatientsTable({ patients, pathology }: PatientsTableProps) {
  const columns = createColumns(pathology);
  
  return (
    <DataTable
      columns={columns}
      data={patients}
      searchable
      searchColumn="last_name"
      searchPlaceholder="Search patients..."
      paginated
      pageSize={20}
    />
  );
}

