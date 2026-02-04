"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertBanner } from "@/components/ui/alert-banner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";

type Pathology = {
  id: string;
  name: string;
  type: string;
};

type Preview = {
  pathology_id: string;
  patients: number;
  visits: number;
};

type WipeResponse = {
  success: boolean;
  wipe: {
    pathology_id: string;
    patients_deleted: number;
    visits_deleted: number;
    patient_user_ids: string[];
  };
  auth: {
    deleted: number;
    skipped: { id: string; reason: string }[];
  };
};

export default function WipePathologyPage() {
  const [pathologies, setPathologies] = useState<Pathology[]>([]);
  const [selectedPathologyId, setSelectedPathologyId] = useState<string>("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WipeResponse | null>(null);

  const canWipe = useMemo(() => {
    return Boolean(selectedPathologyId) && confirmText === "WIPE" && !isWiping;
  }, [selectedPathologyId, confirmText, isWiping]);

  useEffect(() => {
    async function loadPathologies() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/pathologies");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load pathologies");
        setPathologies(data.pathologies || []);
      } catch (e: any) {
        setError(e?.message || "Failed to load pathologies");
      } finally {
        setIsLoading(false);
      }
    }
    loadPathologies();
  }, []);

  useEffect(() => {
    async function loadPreview() {
      if (!selectedPathologyId) {
        setPreview(null);
        return;
      }

      setError(null);
      setResult(null);
      setPreview(null);

      try {
        const res = await fetch(
          `/api/admin/wipe-pathology/preview?pathologyId=${encodeURIComponent(selectedPathologyId)}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load preview");
        setPreview(data.preview || null);
      } catch (e: any) {
        setError(e?.message || "Failed to load preview");
      }
    }

    loadPreview();
  }, [selectedPathologyId]);

  const handleWipe = async () => {
    if (!canWipe) return;
    setIsWiping(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/admin/wipe-pathology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathologyId: selectedPathologyId,
          confirmText,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(data?.error || "Wipe failed");
      }
      setResult(data as WipeResponse);

      // Refresh preview after wipe
      const previewRes = await fetch(
        `/api/admin/wipe-pathology/preview?pathologyId=${encodeURIComponent(selectedPathologyId)}`
      );
      const previewData = await previewRes.json();
      if (previewRes.ok) setPreview(previewData.preview || null);
    } catch (e: any) {
      setError(e?.message || "Wipe failed");
    } finally {
      setIsWiping(false);
      setConfirmText("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Wipe pathology data</h2>
        <p className="text-slate-600">
          Hard delete all patients, visits, and questionnaire responses for a pathology across all centers.
        </p>
      </div>

      <AlertBanner
        type="warning"
        message="Danger zone: this action is irreversible. It also deletes patient portal accounts (auth users) linked to the wiped patients, but never deletes doctors/professionals."
      />

      {error && <AlertBanner type="error" message={error} />}

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Select a pathology to see what will be deleted.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-slate-700">Pathology</div>
                <Select value={selectedPathologyId} onValueChange={setSelectedPathologyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pathology" />
                  </SelectTrigger>
                  <SelectContent>
                    {pathologies.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-slate-700">Estimated deletions</div>
                {preview ? (
                  <div className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700 space-y-1">
                    <div>
                      <span className="font-medium">Patients</span>: {preview.patients}
                    </div>
                    <div>
                      <span className="font-medium">Visits</span>: {preview.visits}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">Select a pathology to load preview.</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger zone
          </CardTitle>
          <CardDescription>
            To confirm, type <span className="font-mono">WIPE</span> and then click the wipe button.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-sm space-y-2">
            <div className="text-sm font-medium text-slate-700">Confirmation</div>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type WIPE"
              autoComplete="off"
            />
          </div>

          <Button
            variant="destructive"
            onClick={handleWipe}
            disabled={!canWipe}
            className="gap-2"
          >
            {isWiping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Wipe pathology
          </Button>

          {result?.success && (
            <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-900">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Wipe completed
              </div>
              <div className="mt-2 space-y-1">
                <div>Patients deleted: {result.wipe.patients_deleted}</div>
                <div>Visits deleted: {result.wipe.visits_deleted}</div>
                <div>Patient auth users deleted: {result.auth.deleted}</div>
                {result.auth.skipped.length > 0 && (
                  <div className="text-green-900/80">
                    Auth users skipped: {result.auth.skipped.length}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

