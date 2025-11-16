"use client";

import { useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Users, Calendar, AlertTriangle } from "lucide-react";
import { PatientFull } from "@/lib/types/database.types";
import { VisitFull } from "@/lib/types/database.types";
import Link from "next/link";
import { formatShortDate } from "@/lib/utils/date";
import { Badge } from "@/components/ui/badge";

interface DashboardStatCardsProps {
  patients: PatientFull[];
  upcomingVisits: VisitFull[];
  patientsRequiringFollowup: PatientFull[];
  pathology: string;
}

type ExpandedCard = "patients" | "visits" | "followup" | null;

export function DashboardStatCards({
  patients,
  upcomingVisits,
  patientsRequiringFollowup,
  pathology,
}: DashboardStatCardsProps) {
  const [expandedCard, setExpandedCard] = useState<ExpandedCard>(null);

  const toggleCard = (card: ExpandedCard) => {
    setExpandedCard(expandedCard === card ? null : card);
  };

  const patientsContent = (
    <div className="max-h-80 overflow-y-auto space-y-2">
      <h4 className="font-semibold text-slate-900 mb-3">All Patients ({patients.length})</h4>
      {patients.length > 0 ? (
        <div className="space-y-2">
          {patients.map((patient) => (
            <Link
              key={patient.id}
              href={`/professional/${pathology}/patients/${patient.id}`}
              className="block p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-slate-900">
                    {patient.first_name} {patient.last_name}
                  </p>
                  <p className="text-sm text-slate-600">
                    MRN: <span className="font-mono">{patient.medical_record_number}</span>
                  </p>
                </div>
                <div className="text-right text-sm text-slate-500">
                  {patient.date_of_birth && (
                    <p>{new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()} years</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No patients found</p>
      )}
    </div>
  );

  const visitsContent = (
    <div className="max-h-80 overflow-y-auto space-y-2">
      <h4 className="font-semibold text-slate-900 mb-3">Upcoming Visits ({upcomingVisits.length})</h4>
      {upcomingVisits.length > 0 ? (
        <div className="space-y-2">
          {upcomingVisits.map((visit) => (
            <Link
              key={visit.id}
              href={`/professional/${pathology}/patients/${visit.patient_id}/visits/${visit.id}`}
              className="block p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-slate-900">
                    {visit.patient_first_name} {visit.patient_last_name}
                  </p>
                  <p className="text-sm text-slate-600">{visit.template_name}</p>
                  {visit.visit_type && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {visit.visit_type}
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700">
                    {visit.scheduled_date && formatShortDate(visit.scheduled_date)}
                  </p>
                  {visit.scheduled_date && (
                    <p className="text-xs text-slate-500">
                      {new Date(visit.scheduled_date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No upcoming visits scheduled</p>
      )}
    </div>
  );

  const followupContent = (
    <div className="max-h-80 overflow-y-auto space-y-2">
      <h4 className="font-semibold text-slate-900 mb-3">
        Patients Requiring Follow-up ({patientsRequiringFollowup.length})
      </h4>
      {patientsRequiringFollowup.length > 0 ? (
        <div className="space-y-2">
          {patientsRequiringFollowup.map((patient) => (
            <Link
              key={patient.id}
              href={`/professional/${pathology}/patients/${patient.id}`}
              className="block p-3 border border-amber-200 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-slate-900">
                    {patient.first_name} {patient.last_name}
                  </p>
                  <p className="text-sm text-slate-600">
                    MRN: <span className="font-mono">{patient.medical_record_number}</span>
                  </p>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No patients requiring immediate follow-up</p>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total Patients"
        value={patients.length}
        icon={Users}
        onClick={() => toggleCard("patients")}
        isExpanded={expandedCard === "patients"}
        expandedContent={patientsContent}
      />
      <StatCard
        title="Upcoming Visits"
        value={upcomingVisits.length}
        icon={Calendar}
        onClick={() => toggleCard("visits")}
        isExpanded={expandedCard === "visits"}
        expandedContent={visitsContent}
      />
      <StatCard
        title="Requiring Follow-up"
        value={patientsRequiringFollowup.length}
        icon={AlertTriangle}
        onClick={() => toggleCard("followup")}
        isExpanded={expandedCard === "followup"}
        expandedContent={followupContent}
      />
    </div>
  );
}

