"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { PatientFull } from "@/lib/types/database.types";
import { PathologyBadge } from "@/components/ui/pathology-badge";
import { calculateAge } from "@/lib/utils/date";
import Link from "next/link";

const columns: ColumnDef<PatientFull>[] = [
  {
    accessorKey: "medical_record_number",
    header: "MRN",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.medical_record_number}</span>
    ),
  },
  {
    accessorKey: "last_name",
    header: "Patient Name",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-slate-900">
          {row.original.first_name} {row.original.last_name}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "date_of_birth",
    header: "Age",
    cell: ({ row }) => (
      <span className="text-sm">
        {calculateAge(row.original.date_of_birth)} years
      </span>
    ),
  },
  {
    accessorKey: "pathology_type",
    header: "Pathology",
    cell: ({ row }) => (
      <PathologyBadge pathology={row.original.pathology_type as any} />
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => (
      <span className="text-sm capitalize">
        {row.original.gender || "Not specified"}
      </span>
    ),
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
  pathologies: { type: string; name: string }[];
}

export function PatientsTable({ patients }: PatientsTableProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <DataTable
        columns={columns}
        data={patients}
        searchable
        searchColumn="last_name"
        searchPlaceholder="Search patients by name..."
        paginated
        pageSize={20}
      />
    </div>
  );
}

