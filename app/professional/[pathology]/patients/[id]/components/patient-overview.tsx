"use client";

import { useState } from "react";
import { User, Calendar, Mail, Phone, MapPin, Users, Heart, Pencil, GraduationCap } from "lucide-react";
import { formatShortDate, calculateAge } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { EditPatientModal } from "./edit-patient-modal";

interface PatientOverviewProps {
  patient: any;
}

export function PatientOverview({ patient }: PatientOverviewProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Patient Information Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-slate-700" />
            <h3 className="text-lg font-semibold text-slate-900">Informations patient</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="text-slate-500 hover:text-brand"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Modifier
          </Button>
        </div>
        <dl className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Nom complet</dt>
              <dd className="text-sm text-slate-900 font-medium mt-0.5">
                {patient.first_name} {patient.last_name}
                {patient.gender === 'F' && patient.maiden_name && ` (${patient.maiden_name})`}
              </dd>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Date de naissance</dt>
              <dd className="text-sm text-slate-900 font-medium mt-0.5">
                {formatShortDate(patient.date_of_birth)}
                <span className="text-slate-500 ml-2">({calculateAge(patient.date_of_birth)} ans)</span>
              </dd>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Users className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Genre</dt>
              <dd className="text-sm text-slate-900 font-medium mt-0.5 capitalize">
                {patient.gender || "Non spécifié"}
              </dd>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <GraduationCap className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Années d&apos;études</dt>
              <dd className="text-sm text-slate-900 font-medium mt-0.5">
                {patient.years_of_education !== null && patient.years_of_education !== undefined 
                  ? `${patient.years_of_education} ans` 
                  : "Non spécifié"}
              </dd>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Heart className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Pathologie</dt>
              <dd className="text-sm text-slate-900 font-medium mt-0.5">
                {patient.pathology_name}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      {/* Contact Information Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="h-5 w-5 text-slate-700" />
          <h3 className="text-lg font-semibold text-slate-900">Coordonnées</h3>
        </div>
        <dl className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email</dt>
              <dd className="text-sm text-slate-900 font-medium mt-0.5 break-all">
                {patient.email || "Non fourni"}
              </dd>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Téléphone</dt>
              <dd className="text-sm text-slate-900 font-medium mt-0.5">
                {patient.phone || "Non fourni"}
              </dd>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Adresse</dt>
              <dd className="text-sm text-slate-900 font-medium mt-0.5">
                {patient.address || "Non fournie"}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      {/* Emergency Contact Card */}
      {patient.emergency_contact && (
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6">
          <div className="flex items-center gap-2 mb-6">
            <Phone className="h-5 w-5 text-slate-700" />
            <h3 className="text-lg font-semibold text-slate-900">Contact d'urgence</h3>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <dt className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Nom</dt>
                <dd className="text-sm text-slate-900 font-medium mt-0.5">
                  {patient.emergency_contact.name}
                </dd>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <dt className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Telephone</dt>
                <dd className="text-sm text-slate-900 font-medium mt-0.5">
                  {patient.emergency_contact.phone}
                </dd>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="h-4 w-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <dt className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Lien</dt>
                <dd className="text-sm text-slate-900 font-medium mt-0.5 capitalize">
                  {patient.emergency_contact.relationship}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      )}
    </div>

    {/* Edit Patient Modal */}
    <EditPatientModal
      patient={patient}
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
    />
    </>
  );
}
