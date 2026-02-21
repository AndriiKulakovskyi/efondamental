"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Loader2, ClipboardList, Edit3, Calendar as CalendarIcon, Plus, ChevronRight } from "lucide-react";
import { VISIT_TYPE_NAMES, VisitType } from "@/lib/types/enums";
import Link from "next/link";

export default function NewVisitPage() {
  const router = useRouter();
  const params = useParams();
  const pathology = params.pathology as string;
  const patientId = params.id as string;

  const [patientName, setPatientName] = useState<string>("");
  const [visitTemplates, setVisitTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    visitTemplateId: "",
    visitType: "",
    scheduledDate: "",
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Load patient name
        const patientResponse = await fetch(`/api/professional/patients/${patientId}`);
        if (patientResponse.ok) {
          const patientData = await patientResponse.json();
          setPatientName(`${patientData.patient.first_name} ${patientData.patient.last_name}`);
        }

        // Load templates
        const response = await fetch(`/api/visit-templates?pathology=${pathology}`);
        if (response.ok) {
          const data = await response.json();
          // Sort templates to put screening first
          const sortedTemplates = [...(data.templates || [])].sort((a, b) => {
            if (a.visit_type === 'screening') return -1;
            if (b.visit_type === 'screening') return 1;
            return 0;
          });
          setVisitTemplates(sortedTemplates);
        }
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [pathology, patientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/professional/visits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          visitTemplateId: formData.visitTemplateId,
          visitType: formData.visitType,
          scheduledDate: formData.scheduledDate,
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Échec de la création de la visite");
      }

      const { visit } = await response.json();
      router.push(`/professional/${pathology}/patients/${patientId}/visits/${visit.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s'est produite");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-6">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-400 font-medium mb-3">
          <Link href={`/professional/${pathology}`} className="hover:text-brand transition">
            Patients
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/professional/${pathology}/patients/${patientId}`} className="hover:text-brand transition">
            {patientName || "Patient"}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-800">Planification</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Planifier une visite</h2>
        <p className="text-slate-500 mt-1">Planifier une nouvelle visite de suivi ou d'évaluation pour ce patient.</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-8">
            {/* Details Section */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-brand" />
                Détails de la visite
              </h3>

              <div className="space-y-6">
                {/* Visit Type */}
                <div>
                  <Label htmlFor="visitType" className="block text-sm font-semibold text-slate-700 mb-2">
                    Type de visite <span className="text-brand">*</span>
                  </Label>
                  <Select
                    value={formData.visitType}
                    onValueChange={(value) => {
                      const template = visitTemplates.find((t) => t.visit_type === value);
                      setFormData({
                        ...formData,
                        visitType: value,
                        visitTemplateId: template?.id || "",
                      });
                    }}
                    required
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl px-4 py-3 transition hover:bg-white hover:border-slate-300 focus:ring-2 focus:ring-brand/20 focus:border-brand shadow-sm">
                      <SelectValue placeholder="Sélectionner le type de visite" />
                    </SelectTrigger>
                    <SelectContent>
                      {visitTemplates.map((template) => (
                        <SelectItem key={template.visit_type} value={template.visit_type}>
                          {VISIT_TYPE_NAMES[template.visit_type as VisitType] || template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Scheduled Date */}
                <div>
                  <Label htmlFor="scheduledDate" className="block text-sm font-semibold text-slate-700 mb-2">
                    Date planifiée <span className="text-brand">*</span>
                  </Label>
                  <DateTimePicker
                    id="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={(val) =>
                      setFormData({ ...formData, scheduledDate: val })
                    }
                    required
                    className="bg-slate-50 border-slate-200 rounded-xl h-auto px-4 py-3 transition hover:bg-white hover:border-slate-300 shadow-sm"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Notes Section */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-brand" />
                Notes
              </h3>
              <div>
                <Label htmlFor="notes" className="block text-sm font-semibold text-slate-700 mb-2">
                  Notes additionnelles
                </Label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition shadow-sm hover:bg-white resize-none"
                  placeholder="Notes ou instructions supplémentaires pour cette visite..."
                />
                <p className="text-xs text-slate-400 mt-2 text-right">
                  Visible uniquement par l'équipe médicale
                </p>
              </div>
            </div>

            {error && (
              <div className="pt-4">
                <AlertBanner type="error" message={error} />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition shadow-sm"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl transition shadow-lg shadow-brand/20 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Planification...
                </>
              ) : (
                <>
                  Planifier
                  <Plus className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

