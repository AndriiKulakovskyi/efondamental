"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionnaireRenderer } from "@/components/clinical/questionnaire-renderer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { QuestionnaireDefinition } from "@/lib/constants/questionnaires";
import { submitProfessionalQuestionnaireAction } from "@/app/professional/questionnaires/actions";
import { AlertBanner } from "@/components/ui/alert-banner";
import { ScoreDisplay } from "../../components/score-display";

interface QuestionnairePageClientProps {
  questionnaire: QuestionnaireDefinition;
  visitId: string;
  patientId: string;
  pathology: string;
  initialResponses?: Record<string, any>;
  existingData?: any;
}

export function QuestionnairePageClient({
  questionnaire,
  visitId,
  patientId,
  pathology,
  initialResponses = {},
  existingData
}: QuestionnairePageClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<any>(existingData);
  
  // If existingData exists and has scoring info, we might want to show score?
  // Or if it's completed, show score.
  // For now, if we enter this page, we assume we want to edit/fill unless we explicitly show a read-only view.
  // But if we just submitted, we show the score.
  
  const [justSubmitted, setJustSubmitted] = useState(false);

  const handleSubmit = async (responses: Record<string, any>) => {
    setError(null);
    try {
      const result = await submitProfessionalQuestionnaireAction(
        questionnaire.code,
        visitId,
        patientId,
        responses
      );

      if (!result.success) {
        throw new Error(result.error || "Failed to submit");
      }

      setSubmittedData(result.data);
      setJustSubmitted(true);
      
      // If no scoring (Diagnostic/Orientation), redirect?
      const hasScoring = [
        'ASRM_FR', 'QIDS_SR16_FR', 'MDQ_FR',
        // Initial Evaluation questionnaires all have scoring
        'EQ5D5L', 'PRISE_M', 'STAI_YA', 'MARS', 'MATHYS', 'PSQI', 'EPWORTH',
        'ASRS', 'CTQ', 'BIS10', 'ALS18', 'AIM', 'WURS25', 'AQ12', 'CSM', 'CTI',
        // Hetero questionnaires all have scoring
        'MADRS', 'YMRS', 'CGI', 'EGF', 'ALDA', 'ETAT_PATIENT', 'FAST',
        // Social questionnaire has no scoring but we track completion
        'SOCIAL',
        // Infirmier questionnaires - Fagerstrom has scoring, Tobacco doesn't
        'TOBACCO', 'FAGERSTROM'
      ].includes(questionnaire.code);
      if (!hasScoring) {
         router.back();
         router.refresh();
      }

    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi du questionnaire.");
    }
  };

  const handleReturn = () => {
    router.push(`/professional/${pathology}/patients/${patientId}/visits/${visitId}`);
    router.refresh();
  };

  if (justSubmitted && submittedData) {
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
            <ScoreDisplay 
              code={questionnaire.code} 
              data={submittedData} 
            />
            
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={handleReturn}>
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
        onClick={handleReturn}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la visite
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{questionnaire.title}</CardTitle>
          {questionnaire.description && (
            <CardDescription>
              {questionnaire.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6">
              <AlertBanner type="error" message={error} />
            </div>
          )}
          
          <QuestionnaireRenderer
            questionnaire={questionnaire}
            initialResponses={initialResponses}
            onSubmit={handleSubmit}
            // We could implement onSave for draft saving if we have 'status' column (we don't have explicit draft status in new tables except null completed_at, but strict constraints might prevent partial save if columns are NOT NULL)
            // Most columns are NOT NULL in my migration. So partial save is not supported unless we relax constraints or use default values.
            // So no onSave for now.
          />
        </CardContent>
      </Card>
    </div>
  );
}

