"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QuestionnaireRenderer } from "@/components/clinical/questionnaire-renderer";
import { AlertBanner } from "@/components/ui/alert-banner";
import { QuestionnaireDefinition } from "@/lib/constants/questionnaires";
import { Question, QuestionOption } from "@/lib/types/database.types";
import { submitQuestionnaireAction } from "../actions";

interface QuestionnairePageClientProps {
  questionnaire: QuestionnaireDefinition;
  visitId: string;
  patientId: string;
  isLockedByProfessional?: boolean;
  existingResponse?: Record<string, any> | null;
}

export function QuestionnairePageClient({
  questionnaire,
  visitId,
  patientId,
  isLockedByProfessional = false,
  existingResponse = null
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
      setError("Une erreur est survenue lors de l'envoi du questionnaire. Veuillez reessayer.");
    }
  };

  const handleBack = () => {
    router.push("/patient/questionnaires");
  };

  // If locked by professional, show read-only view
  if (isLockedByProfessional && existingResponse) {
    return (
      <div className="min-h-screen bg-[#FDFBFA]">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  {questionnaire.title}
                </h1>
                <p className="text-sm text-slate-500">Mode consultation</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Completé par mon médecin
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 py-10">
          {/* Info Banner */}
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-medium text-blue-900">
                Cette evaluation a ete completee par votre equipe soignante
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Vous pouvez consulter les reponses ci-dessous mais vous ne pouvez pas les modifier.
              </p>
            </div>
          </div>

          {questionnaire.description && (
            <p className="text-slate-500 mb-8 max-w-2xl">
              {questionnaire.description}
            </p>
          )}

          {/* Read-only responses */}
          <div className="space-y-6">
            {questionnaire.questions.map((question, index) => (
              <ReadOnlyQuestionDisplay
                key={question.id}
                question={question}
                questionNumber={index + 1}
                response={existingResponse[question.id]}
              />
            ))}
          </div>

          {/* Back button */}
          <div className="mt-10 pt-6 border-t border-slate-200">
            <Link
              href="/patient/questionnaires"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Retour aux questionnaires
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Normal editable form - simplified header without progress tracking
  return (
    <div className="min-h-screen bg-[#FDFBFA]">
      {/* Simple header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-slate-900">
            {questionnaire.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-10 pb-32">
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            Vos reponses seront partagees avec votre equipe soignante pour aider a suivre vos progres et ajuster votre traitement.
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

// Component to display a single question with its answer in read-only mode
function ReadOnlyQuestionDisplay({
  question,
  questionNumber,
  response
}: {
  question: Question;
  questionNumber: number;
  response: any;
}) {
  // Skip section headers
  if (question.type === 'section') {
    return (
      <div className="pt-6 pb-2 border-t border-slate-200 first:border-t-0 first:pt-0">
        <h3 className="text-lg font-bold text-slate-900">{question.text}</h3>
      </div>
    );
  }

  // Format the response value for display
  const getDisplayValue = () => {
    if (response === undefined || response === null || response === '') {
      return <span className="text-slate-400 italic">Non repondu</span>;
    }

    // For single choice questions, find the label
    if (question.type === 'single_choice' && question.options) {
      const selectedOption = question.options.find((opt: string | QuestionOption) => {
        if (typeof opt === 'string') {
          return opt === response;
        }
        return opt.code === response || opt.score === response;
      });
      
      if (selectedOption) {
        const isStringOption = typeof selectedOption === 'string';
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium">
            {isStringOption ? selectedOption : selectedOption.label}
            {!isStringOption && selectedOption.score !== undefined && (
              <span className="text-blue-500">({selectedOption.score})</span>
            )}
          </span>
        );
      }
    }

    // For multiple choice, show all selected
    if (question.type === 'multiple_choice' && Array.isArray(response)) {
      return (
        <div className="flex flex-wrap gap-2">
          {response.map((val, i) => {
            const option = question.options?.find((opt: string | QuestionOption) => {
              if (typeof opt === 'string') {
                return opt === val;
              }
              return opt.code === val || opt.score === val;
            });
            const label = option 
              ? (typeof option === 'string' ? option : option.label)
              : val;
            return (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium"
              >
                {label}
              </span>
            );
          })}
        </div>
      );
    }

    // For text/number responses
    return (
      <span className="text-slate-900 font-medium">{String(response)}</span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start gap-3 mb-3">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-sm font-bold shrink-0">
          {questionNumber}
        </span>
        <p className="text-slate-800 font-medium">{question.text}</p>
      </div>
      <div className="ml-10">
        {getDisplayValue()}
      </div>
    </div>
  );
}
