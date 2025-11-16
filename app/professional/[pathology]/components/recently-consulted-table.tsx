"use client";

import { PatientFull } from "@/lib/types/database.types";
import Link from "next/link";
import { formatShortDate } from "@/lib/utils/date";
import { ExternalLink, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentlyConsultedTableProps {
  recentPatients: Array<PatientFull & { accessed_at?: string }>;
  pathology: string;
}

export function RecentlyConsultedTable({
  recentPatients,
  pathology,
}: RecentlyConsultedTableProps) {
  if (recentPatients.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8">
        <div className="text-center">
          <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            No Recently Consulted Patients
          </h3>
          <p className="text-sm text-slate-500">
            Patients you view will appear here for quick access
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">
          Recently Consulted Patients
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Your last {recentPatients.length} patient consultations
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                MRN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                Last Accessed
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {recentPatients.map((patient) => (
              <tr
                key={patient.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {patient.first_name} {patient.last_name}
                      </div>
                      <div className="text-sm text-slate-500 capitalize">
                        {patient.gender || "N/A"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-slate-700">
                    {patient.medical_record_number}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-700">
                    {patient.date_of_birth
                      ? `${new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()} years`
                      : "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-700">
                    {patient.accessed_at
                      ? formatShortDate(patient.accessed_at)
                      : "Recently"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/professional/${pathology}/patients/${patient.id}`}>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

