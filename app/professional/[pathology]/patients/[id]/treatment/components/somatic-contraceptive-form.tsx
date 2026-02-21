"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { SomaticContraceptiveEntry } from "@/lib/types/database.types";

interface SomaticContraceptiveFormProps {
  patientId: string;
  entries: SomaticContraceptiveEntry[];
  onEntryAdded: () => void;
  onEntryDeleted: () => void;
}

export function SomaticContraceptiveForm({
  patientId,
  entries,
  onEntryAdded,
  onEntryDeleted,
}: SomaticContraceptiveFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    medication_name: "",
    start_date: "",
    months_exposure: "",
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
          action: "add_somatic_contraceptive",
          data: {
            medication_name: formData.medication_name,
            start_date: formData.start_date || null,
            months_exposure: formData.months_exposure ? parseInt(formData.months_exposure) : null,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add entry");
      }

      setFormData({
        medication_name: "",
        start_date: "",
        months_exposure: "",
      });
      onEntryAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Etes-vous sur de vouloir supprimer cette entree ?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/professional/patients/${patientId}/treatments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_somatic_contraceptive",
          data: { id },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }

      onEntryDeleted();
    } catch (err) {
      console.error("Error deleting entry:", err);
      alert("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="bg-slate-100 rounded-xl p-4">
        <p className="text-sm text-slate-600">
          Lister le nom des traitements somatiques au cours de la vie entiere et les contraceptifs
          ainsi que la date de debut et nombre cumule de mois d'exposition
        </p>
      </div>

      {/* Add Entry Form */}
      <form onSubmit={handleSubmit} className="border border-slate-200 rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="block text-sm font-semibold text-slate-700 mb-2">
              Nom du traitement <span className="text-orange-600">*</span>
            </Label>
            <Input
              value={formData.medication_name}
              onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
              required
              className="bg-slate-50 border-slate-200 rounded-xl"
              placeholder="Nom du medicament"
            />
          </div>
          <div>
            <Label className="block text-sm font-semibold text-slate-700 mb-2">
              Date de debut
            </Label>
            <DatePicker
              value={formData.start_date}
              onChange={(val) => setFormData({ ...formData, start_date: val })}
              className="bg-slate-50 border-slate-200 rounded-xl"
            />
          </div>
          <div>
            <Label className="block text-sm font-semibold text-slate-700 mb-2">
              Mois d'exposition
            </Label>
            <Input
              type="number"
              min="0"
              value={formData.months_exposure}
              onChange={(e) => setFormData({ ...formData, months_exposure: e.target.value })}
              className="bg-slate-50 border-slate-200 rounded-xl"
              placeholder="Nombre de mois"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

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

      {/* Entries List */}
      {entries.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-700">Traitements enregistres</h4>
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200"
            >
              <div className="flex-1">
                <h5 className="font-semibold text-slate-900">{entry.medication_name}</h5>
                <div className="text-sm text-slate-500 mt-1">
                  {entry.start_date && <span>Debut: {formatDate(entry.start_date)}</span>}
                  {entry.months_exposure !== null && (
                    <span className="ml-3">Exposition: {entry.months_exposure} mois</span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(entry.id)}
                disabled={deletingId === entry.id}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {deletingId === entry.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-slate-500 text-sm">
          Aucun traitement somatique ou contraceptif enregistre.
        </div>
      )}
    </div>
  );
}

