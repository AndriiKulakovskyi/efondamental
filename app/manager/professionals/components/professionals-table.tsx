"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { UserProfile } from "@/lib/types/database.types";
import Link from "next/link";

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

interface ProfessionalsTableProps {
  professionals: UserProfile[];
}

export function ProfessionalsTable({ professionals }: ProfessionalsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={professionals}
      searchable
      searchColumn="last_name"
      searchPlaceholder="Search professionals..."
    />
  );
}

