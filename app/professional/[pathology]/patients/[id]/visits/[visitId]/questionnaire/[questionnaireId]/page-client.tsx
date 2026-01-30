"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QuestionnaireRenderer } from "@/components/clinical/questionnaire-renderer";
import { QuestionnaireProgressHeader } from "@/components/clinical/questionnaire-progress-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { QuestionnaireDefinition } from "@/lib/constants/questionnaires";
import { AlertBanner } from "@/components/ui/alert-banner";
import { ScoreDisplay } from "../../components/score-display";
import { calculateStandardizedScore, calculatePercentileRank } from "@/lib/services/wais4-matrices-scoring";
import { evaluateConditionalLogic, calculateQuestionnaireProgress } from "@/lib/utils/questionnaire-logic";

type SubmitProfessionalQuestionnaireAction = (
  questionnaireCode: string,
  visitId: string,
  patientId: string,
  responses: Record<string, unknown>
) => Promise<{ success: boolean; data?: unknown; error?: string }>;

interface QuestionnairePageClientProps {
  questionnaire: QuestionnaireDefinition;
  visitId: string;
  patientId: string;
  pathology: string;
  patientName?: string;
  visitType?: string;
  initialResponses?: Record<string, any>;
  existingData?: any;
  submitAction: SubmitProfessionalQuestionnaireAction;
}

export function QuestionnairePageClient({
  questionnaire,
  visitId,
  patientId,
  pathology,
  patientName,
  visitType,
  initialResponses = {},
  existingData,
  submitAction
}: QuestionnairePageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check if we should show the score page based on URL param (persists across revalidation)
  const showScoreFromUrl = searchParams.get('submitted') === 'true';
  
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<any>(existingData);
  const [justSubmitted, setJustSubmitted] = useState(showScoreFromUrl);
  
  // Sync submittedData with existingData when URL has ?submitted=true
  // This handles the case where the page reloads after submission and existingData
  // now contains the saved response from the server
  useEffect(() => {
    if (showScoreFromUrl && existingData && !submittedData) {
      setSubmittedData(existingData);
    }
  }, [showScoreFromUrl, existingData, submittedData]);
  
  // Stabilize initialResponses to prevent unnecessary re-initialization of the renderer
  const stableInitialResponses = useMemo(() => initialResponses, [initialResponses]);
  
  // Track current responses for live score calculation
  // This is updated via callback from QuestionnaireRenderer
  const [currentResponses, setCurrentResponses] = useState<Record<string, any>>(stableInitialResponses);

  // Calculate progress based on visible questionnaire questions only
  // Uses conditional logic to only count questions that are currently visible
  const progress = useMemo(() => {
    const { visibleQuestions } = evaluateConditionalLogic(questionnaire, currentResponses);
    return calculateQuestionnaireProgress(
      questionnaire.questions,
      currentResponses,
      visibleQuestions
    );
  }, [currentResponses, questionnaire]);

  // Live score calculation for WAIS-IV Matrices
  const liveScores = useMemo(() => {
    if (questionnaire.code !== 'WAIS4_MATRICES') return null;
    
    // Calculate raw score from item responses
    let rawScore = 0;
    let itemCount = 0;
    for (let i = 1; i <= 26; i++) {
      const key = `item_${String(i).padStart(2, '0')}`;
      const value = currentResponses[key];
      if (typeof value === 'number') {
        rawScore += value;
        itemCount++;
      }
    }
    
    const patientAge = currentResponses.patient_age;
    
    // Calculate standardized score if we have age
    let standardizedScore: number | null = null;
    let percentileRank: number | null = null;
    
    if (patientAge && typeof patientAge === 'number' && patientAge >= 16) {
      standardizedScore = calculateStandardizedScore(rawScore, patientAge);
      percentileRank = calculatePercentileRank(standardizedScore);
    }
    
    return {
      rawScore,
      itemCount,
      standardizedScore,
      percentileRank,
      hasAge: !!patientAge && typeof patientAge === 'number'
    };
  }, [currentResponses, questionnaire.code]);

  // Memoized callback to prevent unnecessary re-renders
  const handleResponsesChange = useCallback((newResponses: Record<string, any>) => {
    setCurrentResponses(newResponses);
  }, []);

  const handleSubmit = async (responses: Record<string, any>) => {
    setError(null);
    try {
      const result = await submitAction(
        questionnaire.code,
        visitId,
        patientId,
        responses
      );

      if (!result.success) {
        throw new Error(result.error || "Failed to submit");
      }

      // If no scoring (Diagnostic/Orientation), redirect immediately without showing score page
      const hasScoring = [
        'ASRM', 'QIDS_SR16', 'MDQ',
        'EQ5D5L', 'PRISE_M', 'STAI_YA', 'MARS', 'MATHYS', 'PSQI', 'EPWORTH',
        'ASRS', 'CTQ', 'BIS10', 'ALS18', 'AIM', 'WURS25', 'AQ12', 'CSM', 'CTI',
        'MADRS', 'YMRS', 'CGI', 'EGF', 'ALDA', 'ETAT_PATIENT', 'FAST',
        'WAIS4_MATRICES', 'WAIS4_SIMILITUDES', 'WAIS4_CRITERIA', 'WAIS4_LEARNING', 'CVLT', 'WAIS4_CODE', 'WAIS_IV_CODE_SYMBOLES_IVT', 'WAIS4_DIGIT_SPAN', 'FLUENCES_VERBALES',
        'WAIS3_VOCABULAIRE', 'WAIS3_VOCABULAIRE_FR',
        'WAIS3_MATRICES', 'WAIS3_MATRICES_FR',
        'SOCIAL',
        'TOBACCO', 'FAGERSTROM', 'PHYSICAL_PARAMS', 'BLOOD_PRESSURE', 'SLEEP_APNEA',
        'PANSS', 'CDSS', 'BARS', 'SUMD', 'AIMS', 'BARNES', 'SAS', 'PSP',
        'ISA_FOLLOWUP',
        'SQOL_SZ', 'CTQ_SZ', 'MARS_SZ', 'BIS_SZ', 'EQ5D5L_SZ', 'IPAQ_SZ', 'YBOCS_SZ', 'WURS25_SZ', 'STORI_SZ'
      ].includes(questionnaire.code);

      console.log('[QuestionnairePageClient] Submit success:', {
        code: questionnaire.code,
        hasScoring,
        willRedirect: !hasScoring
      });

      if (!hasScoring) {
        // No score page for this questionnaire - redirect back to visit
        router.push(`/professional/${pathology}/patients/${patientId}/visits/${visitId}`);
        return; // Exit early to prevent state updates that would be lost
      }

      // For questionnaires with scoring, show the score page
      // Use URL param to persist state across Next.js revalidation
      setSubmittedData(result.data);
      setJustSubmitted(true);
      
      // Navigate to same page with ?submitted=true to persist state across revalidation
      const currentPath = window.location.pathname;
      router.replace(`${currentPath}?submitted=true`);

    } catch (err) {
      setError("Une erreur est survenue lors de l'envoi du questionnaire.");
    }
  };

  const handleReturn = () => {
    router.push(`/professional/${pathology}/patients/${patientId}/visits/${visitId}`);
    router.refresh();
  };

  // Show score page if we just submitted or if URL indicates submission (persists across revalidation)
  // The showScoreFromUrl check ensures score page persists even after Next.js revalidates
  // Use existingData as fallback when showScoreFromUrl is true (handles page reload after submission)
  const scoreData = submittedData || (showScoreFromUrl ? existingData : null);
  if ((justSubmitted || showScoreFromUrl) && scoreData) {
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
                  <CardTitle className="text-green-900">Questionnaire complete</CardTitle>
                  <p className="text-sm text-green-700 mt-1">
                    Le questionnaire a ete soumis avec succes
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <ScoreDisplay 
                code={questionnaire.code} 
                data={scoreData} 
              />
              
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={handleReturn}>
                  Retour a la visite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Get interpretation text for standardized score
  const getScoreInterpretation = (score: number | null) => {
    if (score === null) return null;
    if (score >= 13) return { text: "Performance superieure a la moyenne", color: "text-green-700", bg: "bg-green-50" };
    if (score >= 8) return { text: "Performance moyenne", color: "text-blue-700", bg: "bg-blue-50" };
    if (score >= 5) return { text: "Performance inferieure a la moyenne", color: "text-amber-700", bg: "bg-amber-50" };
    return { text: "Performance significativement inferieure", color: "text-red-700", bg: "bg-red-50" };
  };

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

        {questionnaire.metadata?.instructions && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="font-semibold text-amber-900 mb-2">Consignes</p>
            <p className="text-sm text-amber-800 whitespace-pre-line">
              {questionnaire.metadata.instructions.replace('Consignes : ', '')}
            </p>
          </div>
        )}
        
        {error && (
          <div className="mb-6">
            <AlertBanner type="error" message={error} />
          </div>
        )}
        
        <QuestionnaireRenderer
          questionnaire={questionnaire}
          initialResponses={stableInitialResponses}
          onSubmit={handleSubmit}
          onResponseChange={handleResponsesChange}
        />
      </div>
      
      {/* Live Score Display for WAIS-IV Matrices */}
      {liveScores && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
          <div className="max-w-4xl mx-auto px-8 py-4">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* Raw Score */}
                <div className="text-center">
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Note Brute</div>
                  <div className="text-2xl font-bold text-slate-900">
                    {liveScores.rawScore}
                    <span className="text-sm font-normal text-slate-400">/26</span>
                  </div>
                  <div className="text-xs text-slate-400">{liveScores.itemCount}/26 items</div>
                </div>
                
                {/* Separator */}
                <div className="h-12 w-px bg-slate-200"></div>
                
                {/* Standardized Score */}
                <div className="text-center">
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Note Standard</div>
                  {liveScores.hasAge ? (
                    <div className="text-2xl font-bold text-brand">
                      {liveScores.standardizedScore}
                      <span className="text-sm font-normal text-slate-400">/19</span>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400">Entrez l'age</div>
                  )}
                </div>
                
                {/* Separator */}
                <div className="h-12 w-px bg-slate-200"></div>
                
                {/* Percentile */}
                <div className="text-center">
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Rang Percentile</div>
                  {liveScores.percentileRank !== null ? (
                    <div className="text-2xl font-bold text-slate-700">
                      {liveScores.percentileRank > 0 ? '+' : ''}{liveScores.percentileRank}%
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400">-</div>
                  )}
                </div>
              </div>
              
              {/* Interpretation */}
              {liveScores.standardizedScore !== null && (
                <div className={`px-4 py-2 rounded-lg ${getScoreInterpretation(liveScores.standardizedScore)?.bg}`}>
                  <span className={`text-sm font-medium ${getScoreInterpretation(liveScores.standardizedScore)?.color}`}>
                    {getScoreInterpretation(liveScores.standardizedScore)?.text}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
