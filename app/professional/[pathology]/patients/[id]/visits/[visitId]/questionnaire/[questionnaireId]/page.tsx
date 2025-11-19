"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { QuestionnaireRenderer } from "@/components/clinical/questionnaire-renderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { ScoreDisplay } from "../../components/score-display";

export default function QuestionnaireCompletionPage() {
  const router = useRouter();
  const params = useParams();
  const { pathology, id: patientId, visitId, questionnaireId } = params;

  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [existingResponse, setExistingResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scoreResult, setScoreResult] = useState<any>(null);
  const [showingScore, setShowingScore] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Load questionnaire
        const qResponse = await fetch(`/api/questionnaires/${questionnaireId}`);
        if (!qResponse.ok) throw new Error("Failed to load questionnaire");
        const qData = await qResponse.json();
        setQuestionnaire(qData.questionnaire);

        // Check for existing response
        const rResponse = await fetch(
          `/api/professional/questionnaire-responses?visitId=${visitId}&questionnaireId=${questionnaireId}`
        );
        if (rResponse.ok) {
          const rData = await rResponse.json();
          if (rData.response) {
            setExistingResponse(rData.response);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load questionnaire");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [questionnaireId, visitId]);

  const handleSave = async (responses: Record<string, any>) => {
    try {
      const response = await fetch("/api/professional/questionnaire-responses", {
        method: existingResponse ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responseId: existingResponse?.id,
          visitId,
          questionnaireId,
          patientId,
          responses,
          completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save responses");
      }

      const data = await response.json();
      setExistingResponse(data.response);
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async (responses: Record<string, any>) => {
    try {
      const response = await fetch("/api/professional/questionnaire-responses", {
        method: existingResponse ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responseId: existingResponse?.id,
          visitId,
          questionnaireId,
          patientId,
          responses,
          completed: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit questionnaire");
      }

      const data = await response.json();
      
      // Check if questionnaire has scoring (ASRM, QIDS, MDQ)
      const hasScoring = ['ASRM_FR', 'QIDS_SR16_FR', 'MDQ_FR'].includes(questionnaire.code);
      
      if (hasScoring && data.response?.metadata) {
        // Show score before redirecting
        setScoreResult(data.response.metadata);
        setShowingScore(true);
      } else {
        // No scoring, redirect immediately
        router.push(`/professional/${pathology}/patients/${patientId}/visits/${visitId}`);
        router.refresh();
      }
    } catch (err) {
      throw err;
    }
  };

  const handleContinueAfterScore = () => {
    router.push(`/professional/${pathology}/patients/${patientId}/visits/${visitId}`);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner label="Loading questionnaire..." />
      </div>
    );
  }

  if (error || !questionnaire) {
    return (
      <div className="space-y-4">
        <AlertBanner type="error" message={error || "Questionnaire not found"} />
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  // Show score result if available
  if (showingScore && scoreResult) {
    return (
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader className="bg-green-50">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <CardTitle className="text-green-900">Questionnaire complété</CardTitle>
                <p className="text-sm text-green-700 mt-1">
                  Le questionnaire a été soumis avec succès
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Résultat du score</h3>
              <ScoreDisplay
                code={questionnaire.code}
                score={scoreResult}
                interpretation={scoreResult.interpretation}
                clinicalAlerts={scoreResult.clinical_alerts}
              />
            </div>
            
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleContinueAfterScore}>
                Retour à la visite
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la visite
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{questionnaire.title}</CardTitle>
          {questionnaire.description && (
            <p className="text-sm text-slate-600">{questionnaire.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <QuestionnaireRenderer
            questionnaire={questionnaire}
            initialResponses={existingResponse?.responses || {}}
            onSubmit={handleSubmit}
            onSave={handleSave}
          />
        </CardContent>
      </Card>
    </div>
  );
}

