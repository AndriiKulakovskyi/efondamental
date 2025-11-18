"use client";

import { useState } from "react";
import { PatientFull } from "@/lib/types/database.types";
import { PatientVisitCompletion } from "@/lib/services/visit.service";
import { Search, UserPlus, Calendar, FileText } from "lucide-react";
import { AvatarWithInitials } from "@/components/ui/avatar-with-initials";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatShortDate } from "@/lib/utils/date";
import Link from "next/link";
import { VISIT_TYPE_NAMES } from "@/lib/types/enums";

interface DashboardPatientsTableProps {
  myPatients: PatientFull[];
  centerPatients: PatientFull[];
  visitCompletions: Map<string, PatientVisitCompletion>;
  conductedByNames: Map<string, string>;
  pathology: string;
}

type TabType = 'my-patients' | 'center-patients';

export function DashboardPatientsTable({
  myPatients,
  centerPatients,
  visitCompletions,
  conductedByNames,
  pathology,
}: DashboardPatientsTableProps) {
  const [activeTab, setActiveTab] = useState<TabType>('my-patients');
  const [searchTerm, setSearchTerm] = useState('');

  const currentPatients = activeTab === 'my-patients' ? myPatients : centerPatients;

  // Filter patients by search term
  const filteredPatients = currentPatients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.first_name.toLowerCase().includes(searchLower) ||
      patient.last_name.toLowerCase().includes(searchLower) ||
      patient.medical_record_number.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Liste des patients</h2>

      {/* Tab Switcher - refined */}
      <div className="inline-flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
        <button
          onClick={() => setActiveTab('my-patients')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'my-patients'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Mes patients
        </button>
        <button
          onClick={() => setActiveTab('center-patients')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'center-patients'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Patients du centre
        </button>
      </div>

      {/* Table Container - harmonized styling */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search Bar & Actions */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un patient (nom, ID, visite...)"
                className="w-full h-11 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
            </div>

            {/* Create Patient Button - more subtle */}
            <Link href={`/professional/${pathology}/patients/new`}>
              <button 
                className="h-11 px-5 bg-slate-900 hover:bg-slate-800 rounded-lg text-sm font-medium text-white shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Créer un patient
              </button>
            </Link>
          </div>
        </div>

        {/* Table Header */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-12 gap-4 px-6 py-4">
            <div className="col-span-3">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Patient</span>
            </div>
            <div className="col-span-3">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Prochaine visite</span>
            </div>
            <div className="col-span-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Suivi</span>
            </div>
            <div className="col-span-4">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Progression</span>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-100">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => {
              const completion = visitCompletions.get(patient.id);
              const doctorName = completion?.conductedBy 
                ? conductedByNames.get(completion.conductedBy) || 'Non assigné'
                : 'Non assigné';

              return (
                <Link
                  key={patient.id}
                  href={`/professional/${pathology}/patients/${patient.id}`}
                  className="block hover:bg-slate-50 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                    {/* Patient Column */}
                    <div className="col-span-3 flex items-center gap-3">
                      <AvatarWithInitials
                        firstName={patient.first_name}
                        lastName={patient.last_name}
                        size="md"
                        gradientColors={['#3B82F6', '#1E40AF']}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {patient.first_name} {patient.last_name}
                        </p>
                        <p className="text-xs text-slate-500 font-mono">
                          {patient.medical_record_number}
                        </p>
                      </div>
                    </div>

                    {/* Next Visit Column */}
                    <div className="col-span-3">
                      {completion?.scheduledDate ? (
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {formatShortDate(completion.scheduledDate)}
                            </p>
                            {completion.visitType && (
                              <p className="text-xs text-slate-500">
                                {VISIT_TYPE_NAMES[completion.visitType as keyof typeof VISIT_TYPE_NAMES] || completion.visitType}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">Aucune visite</p>
                      )}
                    </div>

                    {/* Doctor Column */}
                    <div className="col-span-2">
                      <p className="text-sm text-slate-700">{doctorName}</p>
                    </div>

                    {/* Progress Column */}
                    <div className="col-span-4">
                      <ProgressBar 
                        percentage={completion?.completionPercentage || 0}
                        size="md"
                      />
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="px-6 py-12 text-center">
              <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-600 mb-1">
                Aucun patient trouvé
              </p>
              <p className="text-xs text-slate-400">
                {searchTerm 
                  ? "Essayez de modifier votre recherche"
                  : "Aucun patient dans cette catégorie"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

