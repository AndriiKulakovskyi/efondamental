"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { NonPharmacologicResponse } from "@/lib/types/database.types";

interface NonPharmacologicFormProps {
  patientId: string;
  initialData: NonPharmacologicResponse | null;
  onSaved: () => void;
}

const TREATMENT_TYPES = [
  { id: "sismotherapie", label: "Sismotherapie", hasCheckboxes: false },
  { id: "tms", label: "TMS", hasCheckboxes: false },
  { id: "tcc", label: "TCC", hasCheckboxes: false },
  { id: "psychoeducation", label: "Groupes de psychoeducation", hasCheckboxes: false },
  { id: "ipsrt", label: "IPSRT", hasCheckboxes: true },
  { id: "autre", label: "Autre", hasCheckboxes: false, hasSpecify: true },
];

type StatusValue = "yes" | "no" | "unknown" | null;

interface TreatmentState {
  status: StatusValue;
  sessions: string;
  start_date: string;
  end_date: string;
  // IPSRT specific
  group?: boolean;
  individual?: boolean;
  unknown_format?: boolean;
  // Autre specific
  specify?: string;
}

export function NonPharmacologicForm({
  patientId,
  initialData,
  onSaved,
}: NonPharmacologicFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [globalScreening, setGlobalScreening] = useState<StatusValue>(
    initialData?.global_screening || null
  );

  const [treatments, setTreatments] = useState<Record<string, TreatmentState>>(() => {
    const initial: Record<string, TreatmentState> = {};
    TREATMENT_TYPES.forEach((t) => {
      initial[t.id] = {
        status: (initialData as any)?.[`${t.id}_status`] || null,
        sessions: (initialData as any)?.[`${t.id}_sessions`]?.toString() || "",
        start_date: (initialData as any)?.[`${t.id}_start_date`] || "",
        end_date: (initialData as any)?.[`${t.id}_end_date`] || "",
        ...(t.id === "ipsrt"
          ? {
              group: initialData?.ipsrt_group || false,
              individual: initialData?.ipsrt_individual || false,
              unknown_format: initialData?.ipsrt_unknown_format || false,
            }
          : {}),
        ...(t.id === "autre" ? { specify: initialData?.autre_specify || "" } : {}),
      };
    });
    return initial;
  });

  const updateTreatment = (treatmentId: string, field: keyof TreatmentState, value: any) => {
    setTreatments((prev) => ({
      ...prev,
      [treatmentId]: {
        ...prev[treatmentId],
        [field]: value,
        // Reset conditional fields when status changes to non-"yes"
        ...(field === "status" && value !== "yes"
          ? {
              sessions: "",
              start_date: "",
              end_date: "",
              ...(treatmentId === "ipsrt"
                ? { group: false, individual: false, unknown_format: false }
                : {}),
              ...(treatmentId === "autre" ? { specify: "" } : {}),
            }
          : {}),
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const data: Record<string, any> = {
        global_screening: globalScreening,
      };

      TREATMENT_TYPES.forEach((t) => {
        const tState = treatments[t.id];
        data[`${t.id}_status`] = tState.status;
        data[`${t.id}_sessions`] =
          tState.status === "yes" && tState.sessions ? parseInt(tState.sessions) : null;
        data[`${t.id}_start_date`] =
          tState.status === "yes" && tState.start_date ? tState.start_date : null;
        data[`${t.id}_end_date`] =
          tState.status === "yes" && tState.end_date ? tState.end_date : null;
      });

      // IPSRT specific
      data.ipsrt_group = treatments.ipsrt.group || false;
      data.ipsrt_individual = treatments.ipsrt.individual || false;
      data.ipsrt_unknown_format = treatments.ipsrt.unknown_format || false;

      // Autre specific
      data.autre_specify = treatments.autre.specify || null;

      const response = await fetch(`/api/professional/patients/${patientId}/treatments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_non_pharmacologic",
          data,
        }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || "Failed to save");
      }

      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Global Screening Question */}
      <div className="bg-slate-100 rounded-xl p-4 space-y-3">
        <Label className="block text-sm font-semibold text-slate-800">
          Avez-vous beneficie d'un traitement non pharmacologique depuis la derniere visite
        </Label>
        <div className="flex gap-6">
          {(["yes", "no", "unknown"] as const).map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="global_screening"
                checked={globalScreening === option}
                onChange={() => setGlobalScreening(option)}
                className="w-4 h-4 text-orange-600 border-slate-300 focus:ring-orange-500"
              />
              <span className="text-sm text-slate-700">
                {option === "yes" ? "Oui" : option === "no" ? "Non" : "Ne sais pas"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Treatment Types */}
      <div className="space-y-6">
        {TREATMENT_TYPES.map((t) => {
          const tState = treatments[t.id];
          return (
            <div key={t.id} className="border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex flex-wrap items-center gap-6">
                <Label className="text-sm font-semibold text-slate-900 min-w-[200px]">
                  {t.label}
                </Label>
                <div className="flex gap-4">
                  {(["yes", "no", "unknown"] as const).map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`${t.id}_status`}
                        checked={tState.status === option}
                        onChange={() => updateTreatment(t.id, "status", option)}
                        className="w-4 h-4 text-orange-600 border-slate-300 focus:ring-orange-500"
                      />
                      <span className="text-sm text-slate-700">
                        {option === "yes" ? "Oui" : option === "no" ? "Non" : "Ne sais pas"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conditional Fields */}
              {tState.status === "yes" && (
                <div className="pl-4 border-l-2 border-orange-300 ml-2 space-y-4">
                  {/* Specify field for "Autre" */}
                  {t.hasSpecify && (
                    <div>
                      <Label className="block text-sm text-slate-600 mb-1">
                        Precisez
                      </Label>
                      <Input
                        value={tState.specify || ""}
                        onChange={(e) => updateTreatment(t.id, "specify", e.target.value)}
                        className="bg-slate-50 border-slate-200 rounded-lg text-sm max-w-md"
                        placeholder="Nom du traitement"
                      />
                    </div>
                  )}

                  {/* IPSRT checkboxes */}
                  {t.hasCheckboxes && (
                    <div>
                      <Label className="block text-sm text-slate-600 mb-2">
                        Precisez
                      </Label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tState.group || false}
                            onChange={(e) => updateTreatment(t.id, "group", e.target.checked)}
                            className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-slate-700">En groupe</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tState.individual || false}
                            onChange={(e) => updateTreatment(t.id, "individual", e.target.checked)}
                            className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-slate-700">En individuel</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tState.unknown_format || false}
                            onChange={(e) =>
                              updateTreatment(t.id, "unknown_format", e.target.checked)
                            }
                            className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-slate-700">Ne sais pas</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Sessions and dates */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="block text-sm text-slate-600 mb-1">
                        Nombre de seances
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        value={tState.sessions}
                        onChange={(e) => updateTreatment(t.id, "sessions", e.target.value)}
                        className="bg-slate-50 border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm text-slate-600 mb-1">
                        Date de debut
                      </Label>
                      <Input
                        type="date"
                        value={tState.start_date}
                        onChange={(e) => updateTreatment(t.id, "start_date", e.target.value)}
                        className="bg-slate-50 border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm text-slate-600 mb-1">
                        Date de fin
                      </Label>
                      <Input
                        type="date"
                        value={tState.end_date}
                        onChange={(e) => updateTreatment(t.id, "end_date", e.target.value)}
                        className="bg-slate-50 border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Enregistrer
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

