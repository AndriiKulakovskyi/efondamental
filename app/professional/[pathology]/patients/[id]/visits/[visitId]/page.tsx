import { getVisitDetailData } from "@/lib/services/visit-detail.service";
import { getVisitModules, VirtualModule, updateVisitCompletionStatus } from "@/lib/services/visit.service";
import { enrichModulesWithStatus } from "@/lib/services/visit-modules.service";
import { getTobaccoResponse } from "@/lib/services/bipolar-nurse.service";
import { getDsm5ComorbidResponse } from "@/lib/services/questionnaire-dsm5.service";
import { getWais4CriteriaResponse, getWais3CriteriaResponse } from "@/lib/services/questionnaire-hetero.service";
import { getUserContext } from "@/lib/rbac/middleware";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils/date";
import { notFound, redirect } from "next/navigation";
import { Calendar } from "lucide-react";
import VisitActions from "./components/visit-actions";
import { ExpandableModuleCard } from "./components/expandable-module-card";
import { VisitQuickStats } from "./components/visit-quick-stats";
import { CircularProgress } from "./components/circular-progress";
import { cn } from "@/lib/utils";
import { VISIT_TYPE_NAMES, VisitType } from "@/lib/types/enums";

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function VisitDetailPage({
  params,
}: {
  params: Promise<{ pathology: string; id: string; visitId: string }>;
}) {
  const { pathology, id: patientId, visitId } = await params;
  const context = await getUserContext();

  if (!context) {
    redirect("/auth/login");
  }

  // Fetch all visit data with questionnaire statuses in a single RPC call
  const { visit, questionnaireStatuses, completionStatus: rawCompletionStatus } = await getVisitDetailData(visitId);

  if (!visit) {
    notFound();
  }

  // Fetch conditional dependency responses (used by enrichModulesWithStatus)
  const [tobaccoResponse, dsm5ComorbidResponse, wais4CriteriaResponse, wais3CriteriaResponse] =
    await Promise.all([
      getTobaccoResponse(visitId),
      getDsm5ComorbidResponse(visitId),
      getWais4CriteriaResponse(visitId),
      getWais3CriteriaResponse(visitId),
    ]);


  // Build bare modules from the single source of truth
  const bareModules = getVisitModules(visit.visit_type, pathology);

  // Build conditional responses map for enrichment
  const conditionalResponses: Record<string, any> = {};
  if (tobaccoResponse) conditionalResponses['TOBACCO'] = tobaccoResponse;
  if (dsm5ComorbidResponse) conditionalResponses['DSM5_COMORBID'] = dsm5ComorbidResponse;
  if (wais3CriteriaResponse) conditionalResponses['WAIS3_CRITERIA'] = wais3CriteriaResponse;
  if (wais4CriteriaResponse) conditionalResponses['WAIS4_CRITERIA'] = wais4CriteriaResponse;

  // Enrich with completion statuses and conditional logic
  const modulesWithQuestionnaires = enrichModulesWithStatus(
    bareModules,
    questionnaireStatuses,
    conditionalResponses
  );

  // Calculate accurate completion status from constructed modules
  // This ensures consistency with individual module progress displays
  // Uses same filtering logic: exclude conditional questionnaires where conditionMet is false
  // Includes both root-level questionnaires AND questionnaires inside sections
  const completionStatus = (() => {
    let totalQuestionnaires = 0;
    let completedQuestionnaires = 0;

    // Helper function to count a questionnaire
    const countQuestionnaire = (q: any) => {
      if (!q) return;

      // Skip conditional questionnaires where condition is not met
      // These are not required/visible, so don't count them
      if (q.isConditional && q.conditionMet !== true) {
        return;
      }

      totalQuestionnaires++;
      if (q.completed) {
        completedQuestionnaires++;
      }
    };

    for (const module of modulesWithQuestionnaires) {
      // Count root-level questionnaires
      const questionnaires = module.questionnaires || [];
      for (const q of questionnaires) {
        countQuestionnaire(q);
      }

      // Count questionnaires inside sections (e.g., mod_medical_eval, mod_neuropsy)
      const sections = (module as any).sections || [];
      for (const section of sections) {
        const sectionQuestionnaires = section?.questionnaires || [];
        for (const q of sectionQuestionnaires) {
          countQuestionnaire(q);
        }
      }
    }

    const completionPercentage = totalQuestionnaires > 0
      ? Math.round((completedQuestionnaires / totalQuestionnaires) * 100)
      : 0;

    return {
      totalQuestionnaires,
      completedQuestionnaires,
      completionPercentage
    };
  })();

  // Store the calculated completion status in the database
  // This ensures the patient profile page shows the same accurate progress
  // Await the update to ensure it completes before the page renders
  console.log('[VisitPage] Saving completion status for visit:', visitId, completionStatus);
  await updateVisitCompletionStatus(visitId, completionStatus);
  console.log('[VisitPage] Completion status saved');

  return (
    <div className="max-w-7xl mx-auto px-8 space-y-8">
      {/* Enhanced Header with Sticky Navigation */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-8 sticky top-0 z-50 mb-2">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-6 flex-1">
            {/* Circular Progress */}
            <CircularProgress percentage={completionStatus.completionPercentage} />

            {/* Visit Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {visit.template_name}
              </h2>
              <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                <span className="font-medium text-slate-700">
                  {VISIT_TYPE_NAMES[visit.visit_type as VisitType] || visit.visit_type}
                </span>
                <span className="text-slate-400">•</span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {visit.scheduled_date && formatDateTime(visit.scheduled_date)}
                </span>
              </div>

              {/* Progress Summary */}
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Progression globale</span>
                    <span>{completionStatus.completedQuestionnaires}/{completionStatus.totalQuestionnaires} formulaires</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div
                      className={cn(
                        "h-2.5 rounded-full transition-all duration-500",
                        completionStatus.completionPercentage === 100 ? "bg-emerald-600" : "bg-brand"
                      )}
                      style={{ width: `${completionStatus.completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <VisitActions
            visitId={visitId}
            patientId={patientId}
            pathology={pathology}
            status={visit.status}
            completionStatus={completionStatus}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <VisitQuickStats
        totalModules={modulesWithQuestionnaires.length}
        totalQuestionnaires={completionStatus.totalQuestionnaires}
        completedQuestionnaires={completionStatus.completedQuestionnaires}
        completionPercentage={completionStatus.completionPercentage}
      />

      {/* Clinical Modules */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
          Parcours de Soin
          <span className="h-px flex-1 bg-slate-200 ml-4"></span>
        </h3>

        <div className="relative space-y-6 pl-2">
          {(Array.isArray(modulesWithQuestionnaires) ? modulesWithQuestionnaires : [])
            .filter((m): m is NonNullable<typeof m> => m != null && typeof m === 'object' && 'id' in m)
            .map((module, index) => (
              <ExpandableModuleCard
                key={module.id}
                module={module}
                index={index}
                pathology={pathology}
                patientId={patientId}
                visitId={visitId}
                totalModules={(Array.isArray(modulesWithQuestionnaires) ? modulesWithQuestionnaires : []).length}
              />
            ))}
        </div>
      </div>

      {/* Visit Notes */}
      {visit.notes && (
        <Card className="hover:shadow-md transition-shadow duration-200 rounded-2xl">
          <CardHeader>
            <CardTitle>Notes de visite</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{visit.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
