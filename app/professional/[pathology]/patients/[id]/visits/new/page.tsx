"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Loader2 } from "lucide-react";
import { VISIT_TYPE_NAMES, VisitType } from "@/lib/types/enums";

export default function NewVisitPage() {
  const router = useRouter();
  const params = useParams();
  const pathology = params.pathology as string;
  const patientId = params.id as string;

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
    async function loadTemplates() {
      try {
        const response = await fetch(`/api/visit-templates?pathology=${pathology}`);
        if (response.ok) {
          const data = await response.json();
          setVisitTemplates(data.templates);
        }
      } catch (err) {
        console.error("Failed to load visit templates", err);
      } finally {
        setLoading(false);
      }
    }
    loadTemplates();
  }, [pathology]);

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
        throw new Error(data.error || "Failed to create visit");
      }

      const { visit } = await response.json();
      router.push(`/professional/${pathology}/patients/${patientId}/visits/${visit.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900">Schedule Visit</h2>
        <p className="text-slate-600">Schedule a new visit for this patient</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="visitType">Visit Type *</Label>
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
                <SelectTrigger>
                  <SelectValue placeholder="Select visit type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(VISIT_TYPE_NAMES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date *</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledDate: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-950"
                placeholder="Additional notes or instructions for this visit..."
              />
            </div>

            {error && <AlertBanner type="error" message={error} />}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  "Schedule Visit"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

