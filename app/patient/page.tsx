import { requireUserContext } from "@/lib/rbac/middleware";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  getPatientVisitsWithQuestionnaires,
  getPatientDashboardStats,
  PatientQuestionnaire,
} from "@/lib/services/patient-visit.service";

// Format date for display
function formatVisitDate(dateString: string): { month: string; day: string } {
  const date = new Date(dateString);
  const months = [
    "Jan", "Fev", "Mar", "Avr", "Mai", "Jun",
    "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"
  ];
  return {
    month: months[date.getMonth()],
    day: date.getDate().toString(),
  };
}

function formatFullDate(dateString: string): string {
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

// Get status info for questionnaire display
function getQuestionnaireStatusInfo(questionnaire: PatientQuestionnaire): {
  statusText: string;
  statusClass: string;
  iconBgClass: string;
  iconColorClass: string;
  buttonText: string;
  buttonClass: string;
  canStart: boolean;
} {
  if (questionnaire.isLockedByProfessional) {
    // Completed by professional - locked
    return {
      statusText: "Complete par l'equipe",
      statusClass: "text-blue-600",
      iconBgClass: "bg-blue-100",
      iconColorClass: "text-blue-600",
      buttonText: "Voir",
      buttonClass: "px-4 py-2 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-200 transition",
      canStart: false,
    };
  } else if (questionnaire.isCompleted) {
    // Completed by patient
    return {
      statusText: "Termine",
      statusClass: "text-emerald-600",
      iconBgClass: "bg-emerald-100",
      iconColorClass: "text-emerald-600",
      buttonText: "Voir",
      buttonClass: "px-4 py-2 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-200 transition",
      canStart: false,
    };
  } else {
    // Not started
    return {
      statusText: "Non commence",
      statusClass: "text-brand",
      iconBgClass: "bg-slate-100 group-hover:bg-brand",
      iconColorClass: "text-slate-400 group-hover:text-white",
      buttonText: "Commencer",
      buttonClass: "px-4 py-2 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand-dark transition shadow-sm",
      canStart: true,
    };
  }
}

export default async function PatientDashboard() {
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
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Bienvenue, {context.profile.first_name}
          </h2>
          <p className="text-slate-500 mt-1">
            Votre dossier patient n'a pas encore ete cree. Veuillez contacter votre equipe soignante.
          </p>
        </div>
      </div>
    );
  }

  // Fetch data in parallel
  const [visitsWithQuestionnaires, stats] = await Promise.all([
    getPatientVisitsWithQuestionnaires(patient.id),
    getPatientDashboardStats(patient.id),
  ]);

  // Separate visits into those requiring action and future ones
  const visitsRequiringAction = visitsWithQuestionnaires.filter(
    (v) => v.requiresAction
  );
  const futureVisits = visitsWithQuestionnaires.filter(
    (v) => !v.requiresAction
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* WELCOME SECTION */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          Bienvenue, {context.profile.first_name}
        </h2>
        <p className="text-slate-500 mt-1">
          Voici un apercu de votre suivi et de vos taches en attente.
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pending Tasks Card */}
        <div className="bg-brand/5 border border-brand/20 p-5 rounded-2xl flex items-center justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-20 h-20 bg-brand/10 rounded-full -mr-6 -mt-6" />
          <div>
            <p className="text-xs font-bold text-brand uppercase tracking-wide">
              A Faire
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {stats.pendingQuestionnaires}{" "}
              <span className="text-sm font-normal text-slate-500">
                en attente
              </span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-brand text-white flex items-center justify-center shadow-sm z-10">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
        </div>

        {/* Next Visit Card */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Prochaine Visite
            </p>
            {stats.nextVisit ? (
              <>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  {formatFullDate(stats.nextVisit.date)}
                </p>
                <p className="text-xs text-slate-400">
                  {stats.nextVisit.templateName}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-slate-900 mt-1">
                Aucune
              </p>
            )}
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Completed Visits Card */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Termine
            </p>
            <p className="text-lg font-bold text-slate-900 mt-1">
              {stats.completedVisits}{" "}
              <span className="text-sm font-normal text-slate-400">
                visite{stats.completedVisits !== 1 ? "s" : ""}
              </span>
            </p>
            <p className="text-xs text-slate-400">Continuez ainsi !</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* VISITS & TASKS SECTION */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-brand"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Mes Visites et Taches
        </h3>

        <div className="space-y-6">
          {/* Visits Requiring Action */}
          {visitsRequiringAction.map((visitData) => {
            const dateInfo = visitData.visit.scheduled_date
              ? formatVisitDate(visitData.visit.scheduled_date)
              : { month: "---", day: "--" };

            return (
              <div
                key={visitData.visit.id}
                className="bg-white rounded-2xl border-2 border-brand/10 shadow-lg shadow-brand/5 overflow-hidden"
              >
                {/* Visit Header */}
                <div className="p-6 bg-white border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-brand/5 text-brand rounded-xl border border-brand/10 shrink-0">
                      <span className="text-xs font-bold uppercase">
                        {dateInfo.month}
                      </span>
                      <span className="text-xl font-bold">{dateInfo.day}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">
                        {visitData.visit.template_name || getVisitTypeLabel(visitData.visit.visit_type)}
                      </h4>
                      {visitData.conductedByName && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Avec {visitData.conductedByName}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wide">
                      <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                      Action Requise
                    </span>
                  </div>
                </div>

                {/* Questionnaires List */}
                <div className="bg-slate-50/50 p-6 space-y-4">
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">
                    Questionnaires Assignes ({visitData.completedCount}/{visitData.totalCount})
                  </p>

                  {visitData.questionnaires.map((questionnaire) => {
                    const statusInfo = getQuestionnaireStatusInfo(questionnaire);
                    
                    return (
                      <div
                        key={questionnaire.id}
                        className={`flex items-center justify-between p-4 bg-white border rounded-xl transition ${
                          questionnaire.isCompleted || questionnaire.isLockedByProfessional
                            ? "border-slate-200"
                            : "border-slate-200 hover:border-brand/50 hover:shadow-md cursor-pointer group"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition ${statusInfo.iconBgClass} ${statusInfo.iconColorClass}`}
                          >
                            {questionnaire.isCompleted || questionnaire.isLockedByProfessional ? (
                              questionnaire.isLockedByProfessional ? (
                                // Lock icon for professional-completed
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
                              ) : (
                                // Checkmark for patient-completed
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
                              )
                            ) : (
                              // Pencil icon for not started
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
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">
                              {questionnaire.title}
                            </p>
                            <p className={`text-xs font-medium ${statusInfo.statusClass}`}>
                              {statusInfo.statusText}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/patient/questionnaires/${questionnaire.id}`}
                          className={statusInfo.buttonClass}
                        >
                          {statusInfo.buttonText}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Future Visits (Collapsed) */}
          {futureVisits.map((visitData) => {
            const dateInfo = visitData.visit.scheduled_date
              ? formatVisitDate(visitData.visit.scheduled_date)
              : { month: "---", day: "--" };

            return (
              <div
                key={visitData.visit.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-75 hover:opacity-100 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-50 text-slate-400 rounded-xl border border-slate-200 shrink-0">
                    <span className="text-xs font-bold uppercase">
                      {dateInfo.month}
                    </span>
                    <span className="text-xl font-bold">{dateInfo.day}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-700">
                      {visitData.visit.template_name || getVisitTypeLabel(visitData.visit.visit_type)}
                    </h4>
                    {visitData.conductedByName && (
                      <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Avec {visitData.conductedByName}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {visitData.totalCount === 0 ? (
                    <span className="text-xs text-slate-400 italic">
                      Pas de questionnaires
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-600 font-medium">
                      {visitData.completedCount}/{visitData.totalCount} completes
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wide">
                    Planifie
                  </span>
                </div>
              </div>
            );
          })}

          {/* No Visits Message */}
          {visitsWithQuestionnaires.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-slate-600 text-lg font-medium">
                Aucune visite planifiee
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Vos prochaines visites et questionnaires apparaitront ici.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
