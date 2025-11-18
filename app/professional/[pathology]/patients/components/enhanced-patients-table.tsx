"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { PatientFull } from "@/lib/types/database.types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { calculateAge } from "@/lib/utils/date";
import { Calendar, Eye, Download } from "lucide-react";

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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link href={`/professional/${pathology}/patients/${row.original.id}`}>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Link href={`/professional/${pathology}/patients/${row.original.id}/visits/new`}>
          <Button variant="ghost" size="sm">
            <Calendar className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];

interface EnhancedPatientsTableProps {
  patients: PatientFull[];
  pathology: string;
}

export function EnhancedPatientsTable({ patients, pathology }: EnhancedPatientsTableProps) {
  const columns = useMemo(() => createColumns(pathology), [pathology]);

  const exportToCSV = () => {
    const headers = ["Name", "MRN", "Age", "Gender", "Status"];
    const rows = patients.map(p => [
      `${p.first_name} ${p.last_name}`,
      p.medical_record_number,
      calculateAge(p.date_of_birth),
      p.gender || "",
      p.active ? "Active" : "Inactive",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `patients_${pathology}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-slate-600">
          {patients.length} patient{patients.length !== 1 ? 's' : ''}
        </div>
        <Button variant="outline" size="sm" onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export to CSV
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={patients}
        searchable
        searchColumn="last_name"
        searchPlaceholder="Filter by name..."
        paginated
        pageSize={20}
      />
    </div>
  );
}

