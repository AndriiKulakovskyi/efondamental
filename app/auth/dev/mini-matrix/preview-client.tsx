"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { QuestionnaireRenderer } from "@/components/clinical/questionnaire-renderer";
import { Button } from "@/components/ui/button";
import { DEPRESSION_MINI_DEFINITION } from "@/lib/questionnaires/depression/screening/hetero/mini";

const STORAGE_KEY = "efm:mini:matrix-preview";

type PreviewScenario = "both" | "past_only";

function safeJsonParse(value: string | null): Record<string, any> | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object") return parsed;
    return null;
  } catch {
    return null;
  }
}

function getScenarioDefaults(scenario: PreviewScenario): Record<string, any> {
  // Keep this minimal: only gate questions needed to reveal paired sections.
  // Everything else can be answered ad-hoc in the UI.
  if (scenario === "past_only") {
    return {
      // Section A: lifetime yes, current no → only "Passé" column active
      minia1a: 1,
      minia1b: 0,
      minia2a: 0,
      minia2b: 0,

      // Section C: lifetime yes, current no → only "Passé" column active
      minic1a: 1,
      minic1b: 0,
      minic2a: 0,
      minic2b: 0,
    };
  }

  return {
    // Section A: lifetime yes, current yes → both columns active
    minia1a: 1,
    minia1b: 1,
    minia2a: 0,
    minia2b: 0,

    // Section C: lifetime yes, current yes → both columns active
    minic1a: 1,
    minic1b: 1,
    minic2a: 0,
    minic2b: 0,
  };
}

export function MiniMatrixPreviewClient() {
  const [scenario, setScenario] = useState<PreviewScenario>("both");
  const [initialResponses, setInitialResponses] = useState<Record<string, any>>({});
  const [liveResponses, setLiveResponses] = useState<Record<string, any>>({});
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  // Load saved responses (if any) on mount
  useEffect(() => {
    const saved = safeJsonParse(window.localStorage.getItem(STORAGE_KEY));
    if (saved) {
      setInitialResponses(saved);
    } else {
      setInitialResponses(getScenarioDefaults("both"));
    }
  }, []);

  const applyScenario = useCallback((next: PreviewScenario) => {
    setScenario(next);
    setInitialResponses(getScenarioDefaults(next));
  }, []);

  const handleSaveLocal = useCallback(async (responses: Record<string, any>) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
    setLastSavedAt(Date.now());
  }, []);

  const handleReloadSaved = useCallback(() => {
    const saved = safeJsonParse(window.localStorage.getItem(STORAGE_KEY));
    if (saved) {
      setInitialResponses(saved);
      return;
    }
    setInitialResponses(getScenarioDefaults(scenario));
  }, [scenario]);

  const handleClearSaved = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setLastSavedAt(null);
  }, []);

  const status = useMemo(() => {
    if (!lastSavedAt) return "Aucune sauvegarde locale";
    return `Sauvegardé localement à ${new Date(lastSavedAt).toLocaleTimeString()}`;
  }, [lastSavedAt]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
              Dev preview (public via /auth)
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              MINI — affichage Actuel / Passé en matrice
            </h1>
            <p className="text-sm text-slate-600">
              Cette page sert uniquement à valider visuellement le rendu (sans authentification).
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={scenario === "both" ? "default" : "outline"}
              onClick={() => applyScenario("both")}
            >
              Scénario: Actuel + Passé
            </Button>
            <Button
              type="button"
              variant={scenario === "past_only" ? "default" : "outline"}
              onClick={() => applyScenario("past_only")}
            >
              Scénario: Passé seulement
            </Button>
            <Button type="button" variant="outline" onClick={handleReloadSaved}>
              Recharger la sauvegarde
            </Button>
            <Button type="button" variant="outline" onClick={handleClearSaved}>
              Effacer la sauvegarde
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-700">
            <span className="font-semibold">Statut:</span> {status}
          </div>
          <div className="text-sm text-slate-600">
            <Link className="underline hover:text-slate-900" href="/auth/login">
              Retour à la page de connexion
            </Link>
          </div>
        </div>

        <QuestionnaireRenderer
          questionnaire={DEPRESSION_MINI_DEFINITION}
          initialResponses={initialResponses}
          onResponseChange={setLiveResponses}
          onSave={handleSaveLocal}
          onSubmit={async () => {
            // Not used in the preview; validation is expected to fail unless fully completed.
          }}
        />

        <details className="rounded-2xl border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-800">
            Voir l’objet réponses (debug)
          </summary>
          <pre className="mt-3 max-h-96 overflow-auto text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3">
            {JSON.stringify(liveResponses, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

