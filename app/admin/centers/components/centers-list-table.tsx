"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { PathologyBadge } from "@/components/ui/pathology-badge";
import { PathologyType } from "@/lib/types/enums";

type CenterWithPathologies = {
  id: string;
  name: string;
  code: string;
  city: string | null;
  active: boolean;
  pathologies: PathologyType[];
};

const columns: ColumnDef<CenterWithPathologies>[] = [
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
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.code}</span>
    ),
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "pathologies",
    header: "Pathologies",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.pathologies.map((pathology) => (
          <PathologyBadge key={pathology} pathology={pathology} variant="outline" />
        ))}
      </div>
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

interface CentersListTableProps {
  data: CenterWithPathologies[];
}

export function CentersListTable({ data }: CentersListTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchable
      searchColumn="name"
      searchPlaceholder="Search centers..."
    />
  );
}

