"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { UserProfile } from "@/lib/types/database.types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type UserWithCenter = UserProfile & {
  centers?: {
    id: string;
    name: string;
    code: string;
  } | null;
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "administrator":
      return "bg-purple-100 text-purple-800";
    case "manager":
      return "bg-blue-100 text-blue-800";
    case "healthcare_professional":
      return "bg-green-100 text-green-800";
    case "patient":
      return "bg-slate-100 text-slate-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

const formatRole = (role: string) => {
  return role.split("_").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");
};

const columns: ColumnDef<UserWithCenter>[] = [
  {
    accessorKey: "last_name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/admin/users/${row.original.id}`}
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
          row.original.role
        )}`}
      >
        {formatRole(row.original.role)}
      </span>
    ),
  },
  {
    accessorKey: "centers",
    header: "Center",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.centers?.name || (
          <span className="text-slate-400">No center</span>
        )}
      </span>
    ),
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <span className="font-mono text-sm">
        {row.original.username || (
          <span className="text-slate-400">-</span>
        )}
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
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.original.active ? "Active" : "Inactive"}
      </span>
    ),
  },
];

interface UsersTableProps {
  users: UserWithCenter[];
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <DataTable
        columns={columns}
        data={users}
        searchable
        searchColumn="last_name"
        searchPlaceholder="Search users..."
        paginated
        pageSize={20}
      />
    </div>
  );
}

