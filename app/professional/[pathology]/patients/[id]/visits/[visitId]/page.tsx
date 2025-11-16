import { getVisitById, getVisitModules, getVisitCompletionStatus } from "@/lib/services/visit.service";
import { getQuestionnaireById } from "@/lib/services/questionnaire.service";
import { getUserContext } from "@/lib/rbac/middleware";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils/date";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Circle, FileText } from "lucide-react";

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            {visit.template_name}
          </h2>
          <p className="text-slate-600">
            {visit.patient_first_name} {visit.patient_last_name} •{" "}
            {visit.scheduled_date && formatDateTime(visit.scheduled_date)}
          </p>
        </div>
        <div className="flex gap-2">
          {visit.status === "scheduled" && (
            <Button>Start Visit</Button>
          )}
          {visit.status === "in_progress" && (
            <Button>Complete Visit</Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Progress</h3>
          <span className="text-sm text-slate-600">
            {completionStatus.completedQuestionnaires}/{completionStatus.totalQuestionnaires} questionnaires completed
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{ width: `${completionStatus.completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Clinical Modules</h3>

        {modulesWithQuestionnaires.map((module, index) => (
          <Card key={module.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    {index + 1}. {module.name}
                  </CardTitle>
                  {module.description && (
                    <p className="text-sm text-slate-500 mt-1">{module.description}</p>
                  )}
                </div>
                <div className="text-sm text-slate-600">
                  {module.questionnaires.filter((q: any) => q.completed).length}/{module.questionnaires.length} completed
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {module.questionnaires.map((questionnaire: any) => (
                  <div
                    key={questionnaire.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {questionnaire.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-300" />
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{questionnaire.title}</p>
                        <p className="text-xs text-slate-500 capitalize">
                          For: {questionnaire.target_role?.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {questionnaire.completed ? (
                        <span className="text-xs text-green-600">Completed</span>
                      ) : (
                        <Link
                          href={`/professional/${pathology}/patients/${patientId}/visits/${visitId}/questionnaire/${questionnaire.id}`}
                        >
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4 mr-1" />
                            Fill
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {visit.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{visit.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

