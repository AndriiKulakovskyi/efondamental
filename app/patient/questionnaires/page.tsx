import { requireUserContext } from "@/lib/rbac/middleware";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  getPatientVisitsWithQuestionnaires,
  PatientVisitWithQuestionnaires,
} from "@/lib/services/patient-visit.service";

// Format date for display
function formatVisitDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Map visit types to French labels
function getVisitTypeLabel(visitType: string): string {
  const labels: Record<string, string> = {
    screening: "Visite de Depistage",
    initial_evaluation: "Evaluation Initiale",
    followup: "Visite de Suivi",
    crisis: "Visite de Crise",
  };
  return labels[visitType] || visitType;
}

export default async function QuestionnairesPage() {
  const context = await requireUserContext();
  const supabase = await createClient();

  // Get patient record
  const { data: patient } = await supabase
    .from("patients")
    .select("id")
    .eq("user_id", context.user.id)
    .single();

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Questionnaires</h2>
          <p className="text-slate-500 mt-1">
            Completez vos autoquestionnaires
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <p className="text-amber-800">
            Aucun dossier patient trouve. Veuillez contacter votre equipe soignante.
          </p>
        </div>
      </div>
    );
  }

  const visitsWithQuestionnaires = await getPatientVisitsWithQuestionnaires(
    patient.id
  );

  // Calculate totals
  const totalPending = visitsWithQuestionnaires.reduce(
    (sum, v) => sum + (v.totalCount - v.completedCount),
    0
  );
  const totalCompleted = visitsWithQuestionnaires.reduce(
    (sum, v) => sum + v.completedCount,
    0
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Questionnaires</h2>
        <p className="text-slate-500 mt-1">
          Completez vos autoquestionnaires d'evaluation
        </p>
      </div>

      {/* Stats Banner */}
      {visitsWithQuestionnaires.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-brand/5 border border-brand/20 p-4 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-brand text-white flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalPending}</p>
              <p className="text-xs text-slate-500">En attente</p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalCompleted}</p>
              <p className="text-xs text-slate-500">Termines</p>
            </div>
          </div>
        </div>
      )}

      {/* Questionnaires by Visit */}
      {visitsWithQuestionnaires.length > 0 ? (
        <div className="space-y-6">
          {visitsWithQuestionnaires.map((visitData) => (
            <VisitQuestionnaireCard key={visitData.visit.id} visitData={visitData} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-slate-600 text-lg font-medium">
            Vous n'avez pas de questionnaires en attente
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Les nouveaux questionnaires apparaitront ici lorsqu'ils seront
            assignes par votre equipe soignante.
          </p>
        </div>
      )}
    </div>
  );
}

function VisitQuestionnaireCard({
  visitData,
}: {
  visitData: PatientVisitWithQuestionnaires;
}) {
  const hasPending = visitData.completedCount < visitData.totalCount;

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden transition ${
        hasPending
          ? "border-brand/20 shadow-lg shadow-brand/5"
          : "border-slate-200 shadow-sm"
      }`}
    >
      {/* Visit Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900">
            {visitData.visit.template_name || getVisitTypeLabel(visitData.visit.visit_type)}
          </h3>
          <p className="text-sm text-slate-500">
            {visitData.visit.scheduled_date
              ? formatVisitDate(visitData.visit.scheduled_date)
              : "Date non definie"}
            {visitData.conductedByName && ` - ${visitData.conductedByName}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Progress Circle */}
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="4"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke={hasPending ? "#FF4A3F" : "#10b981"} // brand color
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(visitData.completionPercentage / 100) * 125.6} 125.6`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
              {visitData.completionPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Questionnaires List */}
      <div className="p-5 space-y-3">
        {/* Group by category */}
        {["screening", "etat", "traits"].map((category) => {
          const categoryQuestionnaires = visitData.questionnaires.filter(
            (q) => q.category === category
          );
          if (categoryQuestionnaires.length === 0) return null;

          const categoryLabels: Record<string, string> = {
            screening: "Questionnaires de Depistage",
            etat: "Questionnaires ETAT (Etat Actuel)",
            traits: "Questionnaires TRAITS",
          };

          return (
            <div key={category}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                {categoryLabels[category]}
              </p>
              <div className="space-y-2">
                {categoryQuestionnaires.map((questionnaire) => (
                  <QuestionnaireItem
                    key={questionnaire.id}
                    questionnaire={questionnaire}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuestionnaireItem({
  questionnaire,
}: {
  questionnaire: {
    id: string;
    code: string;
    title: string;
    description: string;
    estimatedTime: number;
    isCompleted: boolean;
  };
}) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl transition ${
        questionnaire.isCompleted
          ? "bg-slate-50 opacity-75"
          : "bg-white border border-slate-200 hover:border-brand/50 hover:shadow-md group"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
            questionnaire.isCompleted
              ? "bg-emerald-100 text-emerald-600"
              : "bg-slate-100 text-slate-400 group-hover:bg-brand group-hover:text-white"
          }`}
        >
          {questionnaire.isCompleted ? (
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          )}
        </div>
        <div>
          <p className="font-medium text-slate-800 text-sm">{questionnaire.title}</p>
          <p className="text-xs text-slate-400">
            ~{questionnaire.estimatedTime} min
          </p>
        </div>
      </div>

      {questionnaire.isCompleted ? (
        <span className="px-3 py-1.5 text-emerald-700 text-xs font-bold">
          Termine
        </span>
      ) : (
        <Link
          href={`/patient/questionnaires/${questionnaire.id}`}
          className="px-4 py-2 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand-dark transition shadow-sm"
        >
          Commencer
        </Link>
      )}
    </div>
  );
}
