"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Center } from "@/lib/types/database.types";
import Link from "next/link";

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

interface CentersTableProps {
  centers: Center[];
}

export function CentersTable({ centers }: CentersTableProps) {
  return <DataTable columns={centerColumns} data={centers} />;
}

