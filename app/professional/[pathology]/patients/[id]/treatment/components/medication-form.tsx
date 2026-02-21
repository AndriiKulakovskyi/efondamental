"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Info } from "lucide-react";
import { MedicationAutocomplete } from "@/components/ui/medication-autocomplete";
import type { Medicament, Presentation } from "@/lib/services/medication-api.service";

interface MedicationFormProps {
  patientId: string;
  onMedicationAdded: () => void;
}

// Dosage options for regular medications (from legacy PHP)
const DAILY_UNIT_OPTIONS = [
  { value: "Si besoin", label: "Si besoin" },
  { value: "0.25", label: "0,25" },
  { value: "0.5", label: "0,5" },
  { value: "0.75", label: "0,75" },
  { value: "1", label: "1" },
  { value: "1.5", label: "1,5" },
  { value: "2", label: "2" },
  { value: "2.5", label: "2,5" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
  { value: "15", label: "15" },
  { value: "20", label: "20" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "75", label: "75" },
  { value: "100", label: "100" },
  { value: ">100", label: ">100" },
];

/**
 * Detects if a medication is injectable/perfusion based on its name/presentation
 * Uses same logic as legacy PHP: checks for 'inject' or 'solution pour perfusion'
 */
function isInjectableMedication(medicationName: string, presentationName?: string): boolean {
  const searchText = `${medicationName} ${presentationName || ""}`.toLowerCase();
  return searchText.includes("inject") || searchText.includes("solution pour perfusion");
}

export function MedicationForm({ patientId, onMedicationAdded }: MedicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInjectable, setIsInjectable] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<{med: Medicament, pres?: Presentation} | null>(null);
  
  const [formData, setFormData] = useState({
    medication_name: "",
    // Dosage for regular medications
    daily_units: "",
    // Dosage for injectable medications
    ampoule_count: "",
    weeks_interval: "",
    // Dates
    start_date: "",
    is_ongoing: true,
    end_date: "",
  });

  // Update injectable status when medication changes
  useEffect(() => {
    if (selectedMedication) {
      const injectable = isInjectableMedication(
        selectedMedication.med.elementPharmaceutique,
        selectedMedication.pres?.libelle
      );
      setIsInjectable(injectable);
      
      // Reset dosage fields when type changes
      if (injectable) {
        setFormData(prev => ({ ...prev, daily_units: "" }));
      } else {
        setFormData(prev => ({ ...prev, ampoule_count: "", weeks_interval: "" }));
      }
    } else {
      setIsInjectable(false);
    }
  }, [selectedMedication]);

  const handleMedicationSelect = (med: Medicament, pres?: Presentation) => {
    setSelectedMedication({ med, pres });
    
    // Build the medication name
    let name = med.elementPharmaceutique;
    const dosage = med.composition?.[0]?.dosage;
    if (dosage) {
      name = `${name} ${dosage}`;
    }
    
    setFormData(prev => ({ ...prev, medication_name: name }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Prepare dosage data based on medication type
      const dosageData = isInjectable
        ? {
            dosage_type: "injectable",
            ampoule_count: formData.ampoule_count,
            weeks_interval: formData.weeks_interval,
          }
        : {
            dosage_type: "regular",
            daily_units: formData.daily_units,
          };

      const response = await fetch(`/api/professional/patients/${patientId}/treatments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_medication",
          data: {
            medication_name: formData.medication_name,
            start_date: formData.start_date,
            is_ongoing: formData.is_ongoing,
            end_date: formData.end_date,
            ...dosageData,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add medication");
      }

      // Reset form
      setFormData({
        medication_name: "",
        daily_units: "",
        ampoule_count: "",
        weeks_interval: "",
        start_date: "",
        is_ongoing: true,
        end_date: "",
      });
      setSelectedMedication(null);
      setIsInjectable(false);
      onMedicationAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Medication Name */}
      <div>
        <Label htmlFor="medication_name" className="block text-sm font-semibold text-slate-700 mb-2">
          Nom du médicament <span className="text-orange-600">*</span>
        </Label>
        <MedicationAutocomplete
          value={formData.medication_name}
          onChange={(value) => setFormData({ ...formData, medication_name: value })}
          onSelect={handleMedicationSelect}
          required
          className="w-full"
          placeholder="Rechercher un médicament (ex: Doliprane)"
        />
      </div>

      {/* Dosage Section - Conditional based on medication type */}
      {formData.medication_name && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          {isInjectable ? (
            // Injectable medication dosage
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                <Info className="h-4 w-4" />
                <span>Traitement injectable / perfusion détecté</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <Label htmlFor="ampoule_count" className="block text-sm font-medium text-slate-700 mb-1">
                    Nombre d'ampoules
                  </Label>
                  <Input
                    id="ampoule_count"
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.ampoule_count}
                    onChange={(e) => setFormData({ ...formData, ampoule_count: e.target.value })}
                    className="w-24 bg-white border-slate-200 rounded-lg"
                    placeholder="Ex: 2"
                  />
                </div>
                <span className="text-slate-500 pt-6">toutes les</span>
                <div>
                  <Label htmlFor="weeks_interval" className="block text-sm font-medium text-slate-700 mb-1">
                    Nombre de semaines
                  </Label>
                  <Input
                    id="weeks_interval"
                    type="number"
                    step="1"
                    min="1"
                    value={formData.weeks_interval}
                    onChange={(e) => setFormData({ ...formData, weeks_interval: e.target.value })}
                    className="w-24 bg-white border-slate-200 rounded-lg"
                    placeholder="Ex: 4"
                  />
                </div>
                <span className="text-slate-500 pt-6">semaines</span>
              </div>
            </div>
          ) : (
            // Regular medication dosage
            <div>
              <Label htmlFor="daily_units" className="block text-sm font-medium text-slate-700 mb-1">
                Nombre d'unité journalière
              </Label>
              <div className="flex items-center gap-2">
                <Select
                  value={formData.daily_units}
                  onValueChange={(value) => setFormData({ ...formData, daily_units: value })}
                >
                  <SelectTrigger className="w-48 bg-white border-slate-200 rounded-lg">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAILY_UNIT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-xs text-slate-500">
                  (comprimé, gélule, goutte, etc. par jour)
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date" className="block text-sm font-semibold text-slate-700 mb-2">
            Date de début du traitement <span className="text-orange-600">*</span>
          </Label>
          <DatePicker
            id="start_date"
            value={formData.start_date}
            onChange={(val) => setFormData({ ...formData, start_date: val })}
            required
            className="bg-slate-50 border-slate-200 rounded-xl"
          />
        </div>

        {/* Ongoing Status */}
        <div>
          <Label className="block text-sm font-semibold text-slate-700 mb-2">
            Traitement en cours
          </Label>
          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="is_ongoing"
                checked={formData.is_ongoing === true}
                onChange={() => setFormData({ ...formData, is_ongoing: true, end_date: "" })}
                className="w-4 h-4 text-orange-600 border-slate-300 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">Oui</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="is_ongoing"
                checked={formData.is_ongoing === false}
                onChange={() => setFormData({ ...formData, is_ongoing: false })}
                className="w-4 h-4 text-orange-600 border-slate-300 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">Non</span>
            </label>
          </div>
        </div>
      </div>

      {/* End Date (conditional) */}
      {!formData.is_ongoing && (
        <div>
          <Label htmlFor="end_date" className="block text-sm font-semibold text-slate-700 mb-2">
            Date de fin du traitement <span className="text-orange-600">*</span>
          </Label>
          <DatePicker
            id="end_date"
            value={formData.end_date}
            onChange={(val) => setFormData({ ...formData, end_date: val })}
            required={!formData.is_ongoing}
            className="bg-slate-50 border-slate-200 rounded-xl"
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Ajout...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Ajouter
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
