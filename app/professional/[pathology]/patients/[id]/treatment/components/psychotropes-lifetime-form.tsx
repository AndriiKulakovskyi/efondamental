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
import { Loader2, Save } from "lucide-react";
import { PsychotropesLifetimeResponse } from "@/lib/types/database.types";

interface PsychotropesLifetimeFormProps {
  patientId: string;
  initialData: PsychotropesLifetimeResponse | null;
  onSaved: () => void;
}

const TREATMENT_CATEGORIES = [
  { id: "antidepresseur", label: "Antidepresseur" },
  { id: "neuroleptique", label: "Neuroleptique classique" },
  { id: "antipsychotique", label: "Antipsychotique atypique" },
  { id: "benzodiazepine", label: "Benzodiazepine / Hypnotique / Anxiolytique" },
  { id: "lithium", label: "Lithium" },
  { id: "thymoregulateur", label: "Thymoregulateur AC" },
];

const MONTHS_OPTIONS = Array.from({ length: 121 }, (_, i) => i); // 0 to 120 months

type StatusValue = "yes" | "no" | "unknown" | null;

interface CategoryState {
  status: StatusValue;
  start_date: string;
  months: string;
}

export function PsychotropesLifetimeForm({
  patientId,
  initialData,
  onSaved,
}: PsychotropesLifetimeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collectionDate, setCollectionDate] = useState<string>(
    initialData?.collection_date || ""
  );

  const [categories, setCategories] = useState<Record<string, CategoryState>>(() => {
    const initial: Record<string, CategoryState> = {};
    TREATMENT_CATEGORIES.forEach((cat) => {
      initial[cat.id] = {
        status: (initialData as any)?.[`${cat.id}_status`] || null,
        start_date: (initialData as any)?.[`${cat.id}_start_date`] || "",
        months: (initialData as any)?.[`${cat.id}_months`]?.toString() || "",
      };
    });
    return initial;
  });

  const updateCategory = (catId: string, field: keyof CategoryState, value: any) => {
    setCategories((prev) => ({
      ...prev,
      [catId]: {
        ...prev[catId],
        [field]: value,
        // Reset conditional fields when status changes to non-"yes"
        ...(field === "status" && value !== "yes"
          ? { start_date: "", months: "" }
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
        collection_date: collectionDate || null,
      };

      TREATMENT_CATEGORIES.forEach((cat) => {
        const catState = categories[cat.id];
        data[`${cat.id}_status`] = catState.status;
        data[`${cat.id}_start_date`] = catState.status === "yes" && catState.start_date 
          ? catState.start_date 
          : null;
        data[`${cat.id}_months`] = catState.status === "yes" && catState.months 
          ? parseInt(catState.months) 
          : null;
      });

      const response = await fetch(`/api/professional/patients/${patientId}/treatments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_psychotropes_lifetime",
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
      {/* Collection Date */}
      <div className="max-w-xs">
        <Label className="block text-sm font-semibold text-slate-700 mb-2">
          Date de recueil des informations
        </Label>
        <DatePicker
          value={collectionDate}
          onChange={setCollectionDate}
          className="bg-slate-50 border-slate-200 rounded-xl"
        />
      </div>

      {/* Context Header */}
      <div className="bg-slate-100 rounded-xl p-4">
        <p className="text-sm text-slate-600 italic">
          En tenant compte des traitements pris lors des visites de screening et initiale
        </p>
        <p className="text-sm font-semibold text-slate-800 mt-2">
          Le patient a-t-il eu au moins une fois les traitements suivants
        </p>
      </div>

      {/* Treatment Categories */}
      <div className="space-y-6">
        {TREATMENT_CATEGORIES.map((cat) => {
          const catState = categories[cat.id];
          return (
            <div key={cat.id} className="border border-slate-200 rounded-xl p-4 space-y-4">
              <div className="flex flex-wrap items-center gap-6">
                <Label className="text-sm font-semibold text-slate-900 min-w-[250px]">
                  {cat.label}
                </Label>
                <div className="flex gap-4">
                  {(["yes", "no", "unknown"] as const).map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`${cat.id}_status`}
                        checked={catState.status === option}
                        onChange={() => updateCategory(cat.id, "status", option)}
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
              {catState.status === "yes" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-orange-300 ml-2">
                  <div>
                    <Label className="block text-sm text-slate-600 mb-1">
                      Date de debut
                    </Label>
                    <DatePicker
                      value={catState.start_date}
                      onChange={(val) => updateCategory(cat.id, "start_date", val)}
                      className="bg-slate-50 border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm text-slate-600 mb-1">
                      Nombre cumule de mois d'exposition
                    </Label>
                    <Select
                      value={catState.months}
                      onValueChange={(value) => updateCategory(cat.id, "months", value)}
                    >
                      <SelectTrigger className="bg-slate-50 border-slate-200 rounded-lg text-sm">
                        <SelectValue placeholder="Selectionnez..." />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS_OPTIONS.map((m) => (
                          <SelectItem key={m} value={m.toString()}>
                            {m} mois
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

