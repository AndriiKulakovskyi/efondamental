"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { MedicationForm } from "./components/medication-form";
import { MedicationList } from "./components/medication-list";
import { MedicationsPerVisitTable } from "./components/medications-per-visit-table";
import { PsychotropesLifetimeForm } from "./components/psychotropes-lifetime-form";
import { SomaticContraceptiveForm } from "./components/somatic-contraceptive-form";
import { NonPharmacologicForm } from "./components/non-pharmacologic-form";
import {
  PatientMedication,
  PsychotropesLifetimeResponse,
  SomaticContraceptiveEntry,
  NonPharmacologicResponse,
} from "@/lib/types/database.types";

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

interface TreatmentData {
  medications: PatientMedication[];
  medicationsPerVisit: {
    medications: MedicationVisitMatrix[];
    visits: VisitInfo[];
  };
  psychotropesLifetime: PsychotropesLifetimeResponse | null;
  somaticContraceptive: SomaticContraceptiveEntry[];
  nonPharmacologic: NonPharmacologicResponse | null;
}

export default function TreatmentPage() {
  const params = useParams();
  const router = useRouter();
  const pathology = params.pathology as string;
  const patientId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TreatmentData | null>(null);
  const [patientName, setPatientName] = useState<string>("");

  // Section collapse state
  const [expandedSections, setExpandedSections] = useState({
    addMedication: true,
    medicationsPerVisit: true,
    psychotropesLifetime: false,
    somaticContraceptive: false,
    nonPharmacologic: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [treatmentResponse, patientResponse] = await Promise.all([
        fetch(`/api/professional/patients/${patientId}/treatments`),
        fetch(`/api/professional/patients/${patientId}`),
      ]);

      if (!treatmentResponse.ok) {
        throw new Error("Failed to fetch treatment data");
      }

      const treatmentData = await treatmentResponse.json();
      setData(treatmentData);

      if (patientResponse.ok) {
        const patientData = await patientResponse.json();
        setPatientName(`${patientData.patient.first_name} ${patientData.patient.last_name}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDataRefresh = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBFA] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFBFA] px-12 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">{error}</p>
          <Button onClick={() => router.back()} className="mt-4">
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBFA] pb-12">
      <div className="px-12 py-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 font-medium">
          <Link href={`/professional/${pathology}`} className="hover:text-slate-600 transition">
            Tableau de bord
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={`/professional/${pathology}/patients`}
            className="hover:text-slate-600 transition"
          >
            Patients
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={`/professional/${pathology}/patients/${patientId}`}
            className="hover:text-slate-600 transition"
          >
            {patientName || "Patient"}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900">Traitement</span>
        </nav>

        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Traitement</h1>
            <p className="text-slate-500 mt-1">
              Gestion des traitements psychotropes et non pharmacologiques
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-slate-300 text-slate-700"
          >
            Retour au profil
          </Button>
        </div>

        {/* Section 1: Ajouter un traitement psychotrope */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection("addMedication")}
            className="w-full px-6 py-4 flex items-center justify-between bg-orange-50 border-b border-orange-100 hover:bg-orange-100 transition"
          >
            <h2 className="text-lg font-bold text-slate-900">
              1. Ajouter un traitement psychotrope
            </h2>
            {expandedSections.addMedication ? (
              <ChevronUp className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            )}
          </button>
          {expandedSections.addMedication && (
            <div className="p-6 space-y-6">
              <MedicationForm patientId={patientId} onMedicationAdded={handleDataRefresh} />
              <hr className="border-slate-200" />
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-4">
                  Medicaments enregistres
                </h3>
                <MedicationList
                  medications={data?.medications || []}
                  patientId={patientId}
                  onMedicationDeleted={handleDataRefresh}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Psychotropes presents aux visites */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection("medicationsPerVisit")}
            className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 border-b border-slate-100 hover:bg-slate-100 transition"
          >
            <h2 className="text-lg font-bold text-slate-900">
              2. Psychotropes presents aux visites
            </h2>
            {expandedSections.medicationsPerVisit ? (
              <ChevronUp className="w-5 h-5 text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-500" />
            )}
          </button>
          {expandedSections.medicationsPerVisit && (
            <div className="p-6">
              <MedicationsPerVisitTable
                medications={data?.medicationsPerVisit.medications || []}
                visits={data?.medicationsPerVisit.visits || []}
              />
            </div>
          )}
        </div>

        {/* Section 3: Traitements psychotropes lifetime */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              3. Traitements psychotropes lifetime
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {/* 3.1 Psychotropes Lifetime Questionnaire */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection("psychotropesLifetime")}
                className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition"
              >
                <h3 className="text-sm font-semibold text-slate-800">
                  3.1 Traitements psychotropes lifetime
                </h3>
                {expandedSections.psychotropesLifetime ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>
              {expandedSections.psychotropesLifetime && (
                <div className="p-4">
                  <PsychotropesLifetimeForm
                    patientId={patientId}
                    initialData={data?.psychotropesLifetime || null}
                    onSaved={handleDataRefresh}
                  />
                </div>
              )}
            </div>

            {/* 3.2 Somatique et Contraceptif */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection("somaticContraceptive")}
                className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition"
              >
                <h3 className="text-sm font-semibold text-slate-800">
                  3.2 Somatique et Contraceptif
                </h3>
                {expandedSections.somaticContraceptive ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>
              {expandedSections.somaticContraceptive && (
                <div className="p-4">
                  <SomaticContraceptiveForm
                    patientId={patientId}
                    entries={data?.somaticContraceptive || []}
                    onEntryAdded={handleDataRefresh}
                    onEntryDeleted={handleDataRefresh}
                  />
                </div>
              )}
            </div>

            {/* 3.3 Traitement non pharmacologique */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleSection("nonPharmacologic")}
                className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition"
              >
                <h3 className="text-sm font-semibold text-slate-800">
                  3.3 Traitement non pharmacologique
                </h3>
                {expandedSections.nonPharmacologic ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>
              {expandedSections.nonPharmacologic && (
                <div className="p-4">
                  <NonPharmacologicForm
                    patientId={patientId}
                    initialData={data?.nonPharmacologic || null}
                    onSaved={handleDataRefresh}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

