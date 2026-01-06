"use client";

import { PatientMedication } from "@/lib/types/database.types";
import { VISIT_TYPE_NAMES } from "@/lib/types/enums";

interface VisitInfo {
  id: string;
  visit_type: string;
  scheduled_date: string | null;
  status: string;
}

interface MedicationVisitMatrix {
  medication: PatientMedication;
  visitPresence: Record<string, boolean>;
}

interface MedicationsPerVisitTableProps {
  medications: MedicationVisitMatrix[];
  visits: VisitInfo[];
}

export function MedicationsPerVisitTable({ medications, visits }: MedicationsPerVisitTableProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatVisitHeader = (visit: VisitInfo) => {
    const typeName = VISIT_TYPE_NAMES[visit.visit_type as keyof typeof VISIT_TYPE_NAMES] || visit.visit_type;
    const date = visit.scheduled_date 
      ? new Date(visit.scheduled_date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })
      : "";
    return { typeName, date };
  };

  if (medications.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        Aucun medicament enregistre.
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        Aucune visite enregistree pour ce patient.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100">
            <th className="text-left p-3 border border-slate-200 font-semibold text-slate-700 min-w-[200px]">
              Medicament
            </th>
            <th className="text-left p-3 border border-slate-200 font-semibold text-slate-700 min-w-[120px]">
              Debut / Fin
            </th>
            {visits.map((visit) => {
              const { typeName, date } = formatVisitHeader(visit);
              return (
                <th
                  key={visit.id}
                  className="text-center p-3 border border-slate-200 font-semibold text-slate-700 min-w-[100px]"
                >
                  <div className="text-xs">{typeName}</div>
                  <div className="text-xs text-slate-500">{date}</div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {medications.map(({ medication, visitPresence }) => (
            <tr key={medication.id} className="hover:bg-slate-50">
              <td className="p-3 border border-slate-200 font-medium text-slate-900">
                {medication.medication_name}
              </td>
              <td className="p-3 border border-slate-200 text-sm text-slate-600">
                <div>{formatDate(medication.start_date)}</div>
                <div className="text-slate-400">
                  {medication.is_ongoing ? "En cours" : formatDate(medication.end_date)}
                </div>
              </td>
              {visits.map((visit) => (
                <td
                  key={visit.id}
                  className="p-3 border border-slate-200 text-center"
                >
                  {visitPresence[visit.id] ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                      +
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                      -
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

