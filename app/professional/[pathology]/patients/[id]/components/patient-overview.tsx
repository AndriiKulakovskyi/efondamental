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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
      {/* Patient Information Card - Identité */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-slate-700" />
            <h3 className="text-lg font-semibold text-slate-900">Identité</h3>
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
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nom complet</dt>
              <dd className="text-sm text-slate-900 font-semibold mt-0.5">
                {patient.first_name} {patient.last_name}
                {patient.marital_name && <span className="block text-xs text-slate-500">Nom marital: {patient.marital_name}</span>}
                {patient.gender === 'F' && patient.maiden_name && <span className="block text-xs text-slate-500">Née {patient.maiden_name}</span>}
              </dd>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date de naissance</dt>
              <dd className="text-sm text-slate-900 font-semibold mt-0.5">
                {formatShortDate(patient.date_of_birth)}
                <span className="text-slate-500 ml-2">({calculateAge(patient.date_of_birth)} ans)</span>
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lieu de naissance</dt>
              <dd className="text-sm text-slate-900 font-semibold mt-0.5">
                {[patient.birth_city, patient.birth_department, patient.birth_country].filter(Boolean).join(', ') || "Non spécifié"}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Genre (Sexe)</dt>
              <dd className="text-sm text-slate-900 font-semibold mt-0.5 capitalize">
                {patient.gender === 'M' ? 'Homme' : patient.gender === 'F' ? 'Femme' : (patient.gender || "Non spécifié")}
              </dd>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Heart className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Numéros d'ID</dt>
              <dd className="text-sm text-slate-900 font-semibold mt-0.5">
                {patient.hospital_id && <span className="block">Hospitalier: {patient.hospital_id}</span>}
                {patient.social_security_number && <span className="block">Sécurité Sociale: {patient.social_security_number}</span>}
                {!patient.hospital_id && !patient.social_security_number && "Aucun identifiant fourni"}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <GraduationCap className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Années d&apos;études</dt>
              <dd className="text-sm text-slate-900 font-semibold mt-0.5">
                {patient.years_of_education !== null && patient.years_of_education !== undefined 
                  ? `${patient.years_of_education} ans (Niveau d'études)` 
                  : "Non spécifié"}
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
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
          <div className="flex items-start gap-3 col-span-full">
            <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Adresse</dt>
              <dd className="text-sm text-slate-900 font-semibold mt-0.5">
                {patient.street_number_and_name || patient.address || "Non fournie"}
                {patient.building_details && <span className="block text-xs font-normal text-slate-500">{patient.building_details}</span>}
                {(patient.postal_code || patient.city) && (
                  <span className="block">{[patient.postal_code, patient.city].filter(Boolean).join(' ')}</span>
                )}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email</dt>
              <dd className="text-sm text-slate-900 font-semibold mt-0.5 break-all">
                {patient.email || "Non fourni"}
              </dd>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Téléphone Portable</dt>
              <dd className="text-sm text-slate-900 font-semibold mt-0.5">
                {patient.phone_mobile || patient.phone || "Non fourni"}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Téléphone Privé</dt>
              <dd className="text-sm text-slate-900 font-semibold mt-0.5">
                {patient.phone_private || "Non fourni"}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Téléphone Pro.</dt>
              <dd className="text-sm text-slate-900 font-semibold mt-0.5">
                {patient.phone_professional || "Non fourni"}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      {/* Provenance and Referral Card */}
      <div className="md:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="h-5 w-5 text-slate-700" />
          <h3 className="text-lg font-semibold text-slate-900">Provenance et Suivi</h3>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Secteur du patient</dt>
              <dd className="text-sm text-slate-900 font-semibold mt-0.5 capitalize">
                {patient.patient_sector?.replace('-', ' ') || "Non spécifié"}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Adressé par</dt>
              <dd className="text-sm text-slate-900 font-semibold mt-0.5 capitalize">
                {patient.referred_by?.replace('-', ' ') || "Non spécifié"}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Objet de la visite</dt>
              <dd className="text-sm text-slate-900 font-semibold mt-0.5 capitalize">
                {patient.visit_purpose?.replace('-', ' ') || "Non spécifié"}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Connaissance centre</dt>
              <dd className="text-sm text-slate-900 font-semibold mt-0.5 capitalize">
                {patient.center_awareness_source?.replace('-', ' ') || "Non spécifiée"}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Accord Bilan (Généraliste)</dt>
              <dd className="text-sm text-slate-900 font-semibold mt-0.5 capitalize">
                {patient.gp_report_consent?.replace('-', ' ') || "Non spécifié"}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Accord Bilan (Psychiatre)</dt>
              <dd className="text-sm text-slate-900 font-semibold mt-0.5 capitalize">
                {patient.psychiatrist_report_consent?.replace('-', ' ') || "Non spécifié"}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      {/* Emergency Contact Card */}
      <div className="md:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6">
        <div className="flex items-center gap-2 mb-6">
          <Phone className="h-5 w-5 text-slate-700" />
          <h3 className="text-lg font-semibold text-slate-900">Contact d'urgence</h3>
        </div>
        {patient.emergency_contact ? (
          <dl className="grid grid-cols-1 gap-4">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nom & Lien</dt>
                <dd className="text-sm text-slate-900 font-semibold mt-0.5">
                  {patient.emergency_contact.name} 
                  <span className="ml-2 font-normal text-slate-500 italic block sm:inline">({patient.emergency_contact.relationship})</span>
                </dd>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Téléphone contact</dt>
                <dd className="text-sm text-slate-900 font-semibold mt-0.5">
                  {patient.emergency_contact.phone}
                </dd>
              </div>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-slate-500 italic">Aucun contact d'urgence renseigné</p>
        )}
      </div>
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
