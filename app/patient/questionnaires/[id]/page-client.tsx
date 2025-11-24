"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { QuestionnaireRenderer } from "@/components/clinical/questionnaire-renderer";
import { QuestionnaireProgressHeader } from "@/components/clinical/questionnaire-progress-header";
import { AlertBanner } from "@/components/ui/alert-banner";
import { QuestionnaireDefinition } from "@/lib/constants/questionnaires";
import { submitQuestionnaireAction } from "../actions";

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
  const [responses, setResponses] = useState<Record<string, any>>({});

  // Calculate progress based on responses
  const progress = useMemo(() => {
    const totalQuestions = questionnaire.questions.filter(q => q.type !== 'section').length;
    if (totalQuestions === 0) return 0;
    
    const filledQuestions = Object.keys(responses).filter(key => {
      const value = responses[key];
      return value !== undefined && value !== null && value !== '';
    }).length;
    
    return Math.round((filledQuestions / totalQuestions) * 100);
  }, [responses, questionnaire.questions]);

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

  const handleBack = () => {
    router.push("/patient/questionnaires");
  };

  return (
    <div className="min-h-screen bg-[#FDFBFA]">
      <QuestionnaireProgressHeader
        title={questionnaire.title}
        progress={progress}
        onBack={handleBack}
      />

      <div className="max-w-4xl mx-auto px-8 py-10 pb-32">
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            Vos réponses seront partagées avec votre équipe soignante pour aider à suivre vos progrès et ajuster votre traitement.
          </p>
        </div>

        {questionnaire.description && (
          <p className="text-slate-500 mb-8 max-w-2xl">
            {questionnaire.description}
          </p>
        )}

        {error && (
          <div className="mb-6">
            <AlertBanner type="error" message={error} />
          </div>
        )}
        
        <QuestionnaireRenderer
          questionnaire={questionnaire}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
