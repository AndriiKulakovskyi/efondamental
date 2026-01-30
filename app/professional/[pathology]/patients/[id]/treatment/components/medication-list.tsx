"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Pill, Syringe } from "lucide-react";
import { PatientMedication } from "@/lib/types/database.types";

interface MedicationListProps {
  medications: PatientMedication[];
  patientId: string;
  onMedicationDeleted: () => void;
}

export function MedicationList({ medications, patientId, onMedicationDeleted }: MedicationListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Etes-vous sur de vouloir supprimer ce medicament ?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/professional/patients/${patientId}/treatments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_medication",
          data: { id },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete medication");
      }

      onMedicationDeleted();
    } catch (err) {
      console.error("Error deleting medication:", err);
      alert("Erreur lors de la suppression du medicament");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  /**
   * Format dosage display based on medication type
   */
  const formatDosage = (med: PatientMedication): string | null => {
    if (med.dosage_type === 'injectable') {
      if (med.ampoule_count && med.weeks_interval) {
        return `${med.ampoule_count} ampoule(s) / ${med.weeks_interval} semaine(s)`;
      } else if (med.ampoule_count) {
        return `${med.ampoule_count} ampoule(s)`;
      }
      return null;
    } else if (med.dosage_type === 'regular' || med.daily_units) {
      if (med.daily_units) {
        return `${med.daily_units} unité(s)/jour`;
      }
      return null;
    }
    return null;
  };

  if (medications.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        Aucun medicament enregistre pour ce patient.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {medications.map((med) => {
        const dosage = formatDosage(med);
        const isInjectable = med.dosage_type === 'injectable';
        
        return (
          <div
            key={med.id}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {isInjectable ? (
                  <Syringe className="h-4 w-4 text-blue-500 flex-shrink-0" />
                ) : (
                  <Pill className="h-4 w-4 text-orange-500 flex-shrink-0" />
                )}
                <h4 className="font-semibold text-slate-900">{med.medication_name}</h4>
              </div>
              
              {/* Dosage display */}
              {dosage && (
                <div className="text-sm text-slate-600 mt-1 ml-6 font-medium">
                  {dosage}
                </div>
              )}
              
              {/* Date info */}
              <div className="text-sm text-slate-500 mt-1 ml-6">
                <span>Debut: {formatDate(med.start_date)}</span>
                {med.is_ongoing ? (
                  <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    En cours
                  </span>
                ) : (
                  <span className="ml-3">Fin: {med.end_date && formatDate(med.end_date)}</span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(med.id)}
              disabled={deletingId === med.id}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {deletingId === med.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
