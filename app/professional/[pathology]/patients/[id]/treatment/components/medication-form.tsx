"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";

interface MedicationFormProps {
  patientId: string;
  onMedicationAdded: () => void;
}

export function MedicationForm({ patientId, onMedicationAdded }: MedicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    medication_name: "",
    start_date: "",
    is_ongoing: true,
    end_date: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/professional/patients/${patientId}/treatments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_medication",
          data: formData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add medication");
      }

      // Reset form
      setFormData({
        medication_name: "",
        start_date: "",
        is_ongoing: true,
        end_date: "",
      });
      onMedicationAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="medication_name" className="block text-sm font-semibold text-slate-700 mb-2">
            Nom du medicament <span className="text-orange-600">*</span>
          </Label>
          <Input
            id="medication_name"
            value={formData.medication_name}
            onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
            required
            className="bg-slate-50 border-slate-200 rounded-xl"
            placeholder="Entrez le nom du medicament"
          />
        </div>

        <div>
          <Label htmlFor="start_date" className="block text-sm font-semibold text-slate-700 mb-2">
            Date de debut du traitement <span className="text-orange-600">*</span>
          </Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            required
            className="bg-slate-50 border-slate-200 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="block text-sm font-semibold text-slate-700">
          Traitement en cours
        </Label>
        <div className="flex gap-6">
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

      {!formData.is_ongoing && (
        <div>
          <Label htmlFor="end_date" className="block text-sm font-semibold text-slate-700 mb-2">
            Date de fin du traitement <span className="text-orange-600">*</span>
          </Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
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

