import { getVisitById, getVisitModules, getVisitCompletionStatus } from "@/lib/services/visit.service";
import { getUserContext } from "@/lib/rbac/middleware";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils/date";
import { notFound, redirect } from "next/navigation";
import { Calendar, User } from "lucide-react";
import VisitActions from "./components/visit-actions";
import { ExpandableModuleCard } from "./components/expandable-module-card";
import { VisitQuickStats } from "./components/visit-quick-stats";
import { CircularProgress } from "./components/circular-progress";
import { cn } from "@/lib/utils";

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

  const visit = await getVisitById(visitId);

  if (!visit) {
    notFound();
  }

  const [modules, completionStatus] = await Promise.all([
    getVisitModules(visitId),
    getVisitCompletionStatus(visitId),
  ]);

  // Get questionnaires for each module
  const modulesWithQuestionnaires = await Promise.all(
    modules.map(async (module) => {
      const supabase = await (await import("@/lib/supabase/server")).createClient();
      
      const { data: questionnaires } = await supabase
        .from("questionnaires")
        .select("*")
        .eq("module_id", module.id)
        .eq("active", true);

      // Check completion status for each questionnaire
      const questionnairesWithStatus = await Promise.all(
        (questionnaires || []).map(async (q) => {
          const { data: response } = await supabase
            .from("questionnaire_responses")
            .select("id, status, completed_at, completed_by")
            .eq("visit_id", visitId)
            .eq("questionnaire_id", q.id)
            .single();

          return {
            ...q,
            responseId: response?.id || null,
            completed: response?.status === "completed",
            completedAt: response?.completed_at || null,
            completedBy: response?.completed_by || null,
          };
        })
      );

      return {
        ...module,
        questionnaires: questionnairesWithStatus,
      };
    })
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Progress Visualization */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
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
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {visit.patient_first_name} {visit.patient_last_name}
                </span>
                <span className="text-slate-400">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {visit.scheduled_date && formatDateTime(visit.scheduled_date)}
                </span>
              </div>
              
              {/* Status Badge */}
              <div>
                <span
                  className={cn(
                    "inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border",
                    visit.status === 'completed'
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : visit.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : visit.status === 'scheduled'
                      ? 'bg-slate-100 text-slate-800 border-slate-200'
                      : 'bg-red-100 text-red-800 border-red-200'
                  )}
                >
                  {visit.status === 'in_progress' ? 'In Progress' : visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                </span>
              </div>

              {/* Progress Summary */}
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Overall Progress</span>
                    <span>{completionStatus.completedQuestionnaires}/{completionStatus.totalQuestionnaires} forms</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div
                      className={cn(
                        "h-2.5 rounded-full transition-all duration-500",
                        completionStatus.completionPercentage === 100 ? "bg-green-600" : "bg-blue-600"
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
        totalModules={modules.length}
        totalQuestionnaires={completionStatus.totalQuestionnaires}
        completedQuestionnaires={completionStatus.completedQuestionnaires}
        completionPercentage={completionStatus.completionPercentage}
      />

      {/* Clinical Modules */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-900">Clinical Modules</h3>

        {modulesWithQuestionnaires.map((module, index) => (
          <ExpandableModuleCard
            key={module.id}
            module={module}
            index={index}
            pathology={pathology}
            patientId={patientId}
            visitId={visitId}
          />
        ))}
      </div>

      {/* Visit Notes */}
      {visit.notes && (
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Visit Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{visit.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

