import { getVisitById, getVisitCompletionStatus } from "@/lib/services/visit.service";
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
import { 
  getAsrmResponse, 
  getQidsResponse, 
  getMdqResponse, 
  getDiagnosticResponse, 
  getOrientationResponse 
} from "@/lib/services/questionnaire.service";
import { 
  ASRM_DEFINITION, 
  QIDS_DEFINITION, 
  MDQ_DEFINITION, 
  DIAGNOSTIC_DEFINITION, 
  ORIENTATION_DEFINITION 
} from "@/lib/constants/questionnaires";

export default async function VisitDetailPage({
  params,
}: {
  params: { pathology: string; id: string; visitId: string };
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

  // Construct modules and check status based on visit type
  let modulesWithQuestionnaires = [];
  let completionStatus = {
    completedQuestionnaires: 0,
    totalQuestionnaires: 0,
    completionPercentage: 0
  };

  if (visit.visit_type === 'screening') {
    // Module 1: Autoquestionnaires
    const asrmResponse = await getAsrmResponse(visitId);
    const qidsResponse = await getQidsResponse(visitId);
    const mdqResponse = await getMdqResponse(visitId);

    const autoModule = {
      id: 'mod_auto',
      name: 'Autoquestionnaires',
      description: 'Questionnaires à remplir par le patient',
      questionnaires: [
        {
          ...ASRM_DEFINITION,
          id: ASRM_DEFINITION.code, // Use code as ID for routing
          target_role: 'patient',
          completed: !!asrmResponse,
          completedAt: asrmResponse?.completed_at,
        },
        {
          ...QIDS_DEFINITION,
          id: QIDS_DEFINITION.code,
          target_role: 'patient',
          completed: !!qidsResponse,
          completedAt: qidsResponse?.completed_at,
        },
        {
          ...MDQ_DEFINITION,
          id: MDQ_DEFINITION.code,
          target_role: 'patient',
          completed: !!mdqResponse,
          completedAt: mdqResponse?.completed_at,
        }
      ]
    };

    // Module 2: Partie Médicale
    const diagResponse = await getDiagnosticResponse(visitId);
    const orientResponse = await getOrientationResponse(visitId);

    const medicalModule = {
      id: 'mod_medical',
      name: 'Partie médicale',
      description: 'Évaluation clinique par le professionnel de santé',
      questionnaires: [
        {
          ...DIAGNOSTIC_DEFINITION,
          id: DIAGNOSTIC_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!diagResponse,
          completedAt: diagResponse?.completed_at,
          completedBy: diagResponse?.completed_by
        },
        {
          ...ORIENTATION_DEFINITION,
          id: ORIENTATION_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!orientResponse,
          completedAt: orientResponse?.completed_at,
          completedBy: orientResponse?.completed_by
        }
      ]
    };

    modulesWithQuestionnaires = [autoModule, medicalModule];

    // Calculate stats
    const total = autoModule.questionnaires.length + medicalModule.questionnaires.length;
    const completed = 
      autoModule.questionnaires.filter(q => q.completed).length + 
      medicalModule.questionnaires.filter(q => q.completed).length;
    
    completionStatus = {
      totalQuestionnaires: total,
      completedQuestionnaires: completed,
      completionPercentage: total > 0 ? (completed / total) * 100 : 0
    };
  }

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
                  {visit.status === 'completed' ? 'Terminée' : 
                   visit.status === 'in_progress' ? 'En cours' : 
                   visit.status === 'scheduled' ? 'Planifiée' :
                   visit.status === 'cancelled' ? 'Annulée' : visit.status}
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
        totalModules={modulesWithQuestionnaires.length}
        totalQuestionnaires={completionStatus.totalQuestionnaires}
        completedQuestionnaires={completionStatus.completedQuestionnaires}
        completionPercentage={completionStatus.completionPercentage}
      />

      {/* Clinical Modules */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-900">Modules cliniques</h3>

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
