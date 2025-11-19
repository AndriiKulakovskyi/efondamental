"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionnaireRenderer } from "@/components/clinical/questionnaire-renderer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { QuestionnaireDefinition } from "@/lib/constants/questionnaires";
import { submitQuestionnaireAction } from "../actions";
import { AlertBanner } from "@/components/ui/alert-banner";

interface QuestionnairePageClientProps {
  questionnaire: QuestionnaireDefinition;
  visitId: string;
  patientId: string;
}

export function QuestionnairePageClient({
  questionnaire,
  visitId,
  patientId
}: QuestionnairePageClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (responses: Record<string, any>) => {
    setError(null);
    try {
      const result = await submitQuestionnaireAction(
        questionnaire.code,
        visitId,
        patientId,
        responses
      );

      if (!result.success) {
        throw new Error(result.error || "Failed to submit");
      }

      router.push("/patient/questionnaires");
      router.refresh();
    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi du questionnaire. Veuillez réessayer.");
    }
  };

  return (
    <div className="max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => router.push("/patient/questionnaires")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux questionnaires
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{questionnaire.title}</CardTitle>
          <CardDescription>
            {questionnaire.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6">
              <AlertBanner type="error" message={error} />
            </div>
          )}
          
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Vos réponses seront partagées avec votre équipe soignante pour aider à suivre vos progrès et ajuster votre traitement.
            </p>
          </div>

          <QuestionnaireRenderer
            questionnaire={questionnaire}
            onSubmit={handleSubmit}
            // We don't support intermediate saves for now, just submit
          />
        </CardContent>
      </Card>
    </div>
  );
}
