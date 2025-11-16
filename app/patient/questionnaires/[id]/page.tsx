"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { QuestionnaireRenderer } from "@/components/clinical/questionnaire-renderer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PatientQuestionnairePage() {
  const router = useRouter();
  const params = useParams();
  const questionnaireId = params.id as string;

  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [visitContext, setVisitContext] = useState<any>(null);
  const [existingResponse, setExistingResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Load questionnaire
        const qResponse = await fetch(`/api/questionnaires/${questionnaireId}`);
        if (!qResponse.ok) throw new Error("Failed to load questionnaire");
        const qData = await qResponse.json();
        setQuestionnaire(qData.questionnaire);

        // Load visit context and check for existing response
        const vResponse = await fetch(`/api/patient/questionnaire-context/${questionnaireId}`);
        if (vResponse.ok) {
          const vData = await vResponse.json();
          setVisitContext(vData);
          if (vData.existingResponse) {
            setExistingResponse(vData.existingResponse);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load questionnaire");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [questionnaireId]);

  const handleSave = async (responses: Record<string, any>) => {
    if (!visitContext) return;

    try {
      const response = await fetch("/api/patient/questionnaire-response", {
        method: existingResponse ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responseId: existingResponse?.id,
          visitId: visitContext.visitId,
          questionnaireId,
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
    if (!visitContext) return;

    try {
      const response = await fetch("/api/patient/questionnaire-response", {
        method: existingResponse ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responseId: existingResponse?.id,
          visitId: visitContext.visitId,
          questionnaireId,
          responses,
          completed: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit questionnaire");
      }

      router.push("/patient/questionnaires");
      router.refresh();
    } catch (err) {
      throw err;
    }
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
        <Button variant="outline" onClick={() => router.push("/patient/questionnaires")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Questionnaires
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => router.push("/patient/questionnaires")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Questionnaires
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{questionnaire.title}</CardTitle>
          <CardDescription>
            {questionnaire.description || "Please complete this self-assessment questionnaire"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Your responses will be shared with your care team to help monitor your progress and adjust your treatment plan.
            </p>
          </div>

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

