"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { QuestionnaireRenderer } from "@/components/clinical/questionnaire-renderer";
import { QuestionnaireProgressHeader } from "@/components/clinical/questionnaire-progress-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { QuestionnaireDefinition } from "@/lib/constants/questionnaires";
import { submitProfessionalQuestionnaireAction } from "@/app/professional/questionnaires/actions";
import { AlertBanner } from "@/components/ui/alert-banner";
import { ScoreDisplay } from "../../components/score-display";

interface QuestionnairePageClientProps {
  questionnaire: QuestionnaireDefinition;
  visitId: string;
  patientId: string;
  pathology: string;
  patientName?: string;
  visitType?: string;
  initialResponses?: Record<string, any>;
  existingData?: any;
}

export function QuestionnairePageClient({
  questionnaire,
  visitId,
  patientId,
  pathology,
  patientName,
  visitType,
  initialResponses = {},
  existingData
}: QuestionnairePageClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<any>(existingData);
  const [responses, setResponses] = useState<Record<string, any>>(initialResponses);
  
  const [justSubmitted, setJustSubmitted] = useState(false);

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

  const handleResponsesChange = (newResponses: Record<string, any>) => {
    setResponses(newResponses);
  };

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
        'TOBACCO', 'FAGERSTROM', 'PHYSICAL_PARAMS', 'BLOOD_PRESSURE', 'SLEEP_APNEA'
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
      <div className="min-h-screen bg-[#FDFBFA]">
        <QuestionnaireProgressHeader
          title={questionnaire.title}
          subtitle={patientName && visitType ? `${patientName} • ${visitType}` : undefined}
          progress={100}
          onBack={handleReturn}
        />
        <div className="max-w-4xl mx-auto px-8 py-10">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBFA]">
      <QuestionnaireProgressHeader
        title={questionnaire.title}
        subtitle={patientName && visitType ? `${patientName} • ${visitType}` : undefined}
        progress={progress}
        onBack={handleReturn}
      />
      
      <div className="max-w-4xl mx-auto px-8 py-10 pb-32">
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
          initialResponses={initialResponses}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

