"use client";

import { useState } from "react";
import { PatientFull } from "@/lib/types/database.types";
import { PatientVisitCompletion } from "@/lib/services/visit.service";
import { Search, UserPlus, Calendar, ChevronRight, User } from "lucide-react";
import { AvatarWithInitials } from "@/components/ui/avatar-with-initials";
import { formatShortDate } from "@/lib/utils/date";
import Link from "next/link";
import { VISIT_TYPE_NAMES } from "@/lib/types/enums";

interface DashboardPatientsTableProps {
  myPatients: PatientFull[];
  centerPatients: PatientFull[];
  visitCompletions: Map<string, PatientVisitCompletion>;
  pathology: string;
}

type TabType = 'my-patients' | 'center-patients';

export function DashboardPatientsTable({
  myPatients,
  centerPatients,
  visitCompletions,
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header with Tab Switcher and Actions */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-6 w-full md:w-auto">
          <h3 className="text-lg font-bold text-slate-900">Liste des patients</h3>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('my-patients')}
              className={`px-3 py-1.5 text-xs font-bold rounded transition-all ${
            activeTab === 'my-patients'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          Mes patients
        </button>
        <button
          onClick={() => setActiveTab('center-patients')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
            activeTab === 'center-patients'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          Patients du centre
        </button>
          </div>
      </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un patient..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition"
              />
            </div>

          {/* Create Patient Button */}
            <Link href={`/professional/${pathology}/patients/new`}>
              <button 
              className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-bold rounded-lg transition shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                Créer un patient
              </button>
            </Link>
          </div>
        </div>

      {/* Table */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
            <th className="px-6 py-4 font-semibold">Patient</th>
            <th className="px-6 py-4 font-semibold">Prochaine Visite</th>
            <th className="px-6 py-4 font-semibold">Médecin Assigné</th>
            <th className="px-6 py-4 font-semibold">Progression</th>
            <th className="px-6 py-4 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => {
              const completion = visitCompletions.get(patient.id);
              
              // Use assigned doctor from patient record
              const doctorName = patient.assigned_to_first_name && patient.assigned_to_last_name
                ? `Dr. ${patient.assigned_to_first_name} ${patient.assigned_to_last_name}`
                : 'Non assigné';
              
              const doctorInitials = patient.assigned_to_first_name && patient.assigned_to_last_name
                ? `${patient.assigned_to_first_name[0]}${patient.assigned_to_last_name[0]}`
                : '?';

              return (
                <tr key={patient.id} className="hover:bg-slate-50 transition group">
                  <td className="px-6 py-4">
                    <Link href={`/professional/${pathology}/patients/${patient.id}`} className="flex items-center gap-4">
                      <AvatarWithInitials
                        firstName={patient.first_name}
                        lastName={patient.last_name}
                        size="md"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {patient.first_name} {patient.last_name}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">
                          {patient.medical_record_number}
                        </p>
                      </div>
                    </Link>
                  </td>

                  <td className="px-6 py-4">
                    <Link href={`/professional/${pathology}/patients/${patient.id}`} className="block">
                      {completion?.scheduledDate ? (
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                            <Calendar className="w-4 h-4 text-slate-400" />
                              {formatShortDate(completion.scheduledDate)}
                          </div>
                          {completion.visitType && (
                            <span className="text-xs text-slate-500 ml-6">
                              {VISIT_TYPE_NAMES[completion.visitType as keyof typeof VISIT_TYPE_NAMES] || completion.visitType}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Aucune visite</span>
                      )}
                    </Link>
                  </td>
                  
                  <td className="px-6 py-4">
                    <Link href={`/professional/${pathology}/patients/${patient.id}`} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-[10px] font-bold">
                        {doctorInitials}
                    </div>
                      <span className="text-sm text-slate-600">{doctorName}</span>
                    </Link>
                  </td>
                  
                  <td className="px-6 py-4 w-1/4">
                    <Link href={`/professional/${pathology}/patients/${patient.id}`} className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand rounded-full" 
                          style={{ width: `${completion?.completionPercentage || 0}%` }}
                      />
                    </div>
                      <span className="text-xs font-bold text-slate-700">
                        {completion?.completionPercentage || 0}%
                      </span>
                    </Link>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <Link href={`/professional/${pathology}/patients/${patient.id}`}>
                      <button className="text-slate-400 hover:text-brand transition">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                </Link>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
                <User className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-600 mb-1">
                Aucun patient trouvé
              </p>
              <p className="text-xs text-slate-400">
                {searchTerm 
                  ? "Essayez de modifier votre recherche"
                  : "Aucun patient dans cette catégorie"}
              </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Footer */}
      <div className="p-4 border-t border-slate-100 flex justify-center">
        <span className="text-xs text-slate-400">
          Showing {filteredPatients.length} of {currentPatients.length} patients
        </span>
      </div>
    </div>
  );
}

