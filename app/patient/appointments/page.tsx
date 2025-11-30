import { requireUserContext } from "@/lib/rbac/middleware";
import { createClient } from "@/lib/supabase/server";
import { getPatientAllVisits } from "@/lib/services/patient-visit.service";
import { VisitFull } from "@/lib/types/database.types";

// Format date for display
function formatVisitDate(dateString: string): { month: string; day: string; year: string } {
  const date = new Date(dateString);
  const months = [
    "Jan", "Fev", "Mar", "Avr", "Mai", "Jun",
    "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"
  ];
  return {
    month: months[date.getMonth()],
    day: date.getDate().toString(),
    year: date.getFullYear().toString(),
  };
}

function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
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

// Map status to French labels
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    scheduled: "Planifie",
    in_progress: "En cours",
    completed: "Termine",
    cancelled: "Annule",
  };
  return labels[status] || status;
}

function getStatusStyles(status: string): string {
  switch (status) {
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-amber-100 text-amber-800";
    case "completed":
      return "bg-emerald-100 text-emerald-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export default async function AppointmentsPage() {
  const context = await requireUserContext();
  const supabase = await createClient();

  // Get patient record
  const { data: patient } = await supabase
    .from("patients")
    .select("id, center:centers(name, address)")
    .eq("user_id", context.user.id)
    .single();

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Mes Rendez-vous</h2>
          <p className="text-slate-500 mt-1">
            Consultez vos rendez-vous planifies et passes
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

  const { upcoming, past } = await getPatientAllVisits(patient.id);
  const centerInfo = (patient as any)?.center;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Mes Rendez-vous</h2>
        <p className="text-slate-500 mt-1">
          Consultez vos rendez-vous planifies et passes
        </p>
      </div>

      {/* Center Info */}
                          {centerInfo && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
                            </div>
          <div>
            <p className="font-semibold text-blue-900">{centerInfo.name}</p>
            {centerInfo.address && (
              <p className="text-sm text-blue-700">{centerInfo.address}</p>
                        )}
                      </div>
                    </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Prochains Rendez-vous
          </h3>

          {upcoming.length > 0 ? (
            <div className="space-y-4">
              {upcoming.map((visit) => (
                <VisitCard key={visit.id} visit={visit} isUpcoming />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-slate-400"
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
              <p className="text-slate-600">Aucun rendez-vous a venir</p>
            </div>
          )}
        </div>

        {/* Past Appointments */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-slate-400"
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
            Historique
          </h3>

          {past.length > 0 ? (
            <div className="space-y-4">
              {past.slice(0, 5).map((visit) => (
                <VisitCard key={visit.id} visit={visit} isUpcoming={false} />
              ))}
              {past.length > 5 && (
                <p className="text-center text-sm text-slate-500">
                  Et {past.length - 5} autre{past.length - 5 > 1 ? "s" : ""} rendez-vous
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-slate-400"
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
              <p className="text-slate-600">Aucun rendez-vous passe</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VisitCard({ visit, isUpcoming }: { visit: VisitFull; isUpcoming: boolean }) {
  const dateInfo = visit.scheduled_date
    ? formatVisitDate(visit.scheduled_date)
    : { month: "---", day: "--", year: "----" };

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden transition ${
        isUpcoming
          ? "border-brand/20 shadow-lg shadow-brand/5 hover:shadow-xl"
          : "border-slate-200 shadow-sm opacity-80"
      }`}
    >
      <div className="p-5 flex items-start gap-4">
        {/* Date Badge */}
        <div
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl shrink-0 ${
            isUpcoming
              ? "bg-brand/5 text-brand border border-brand/10"
              : "bg-slate-50 text-slate-400 border border-slate-200"
          }`}
        >
          <span className="text-xs font-bold uppercase">{dateInfo.month}</span>
          <span className="text-xl font-bold">{dateInfo.day}</span>
        </div>

        {/* Visit Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 truncate">
            {visit.template_name || getVisitTypeLabel(visit.visit_type)}
          </h4>
          <p className="text-sm text-slate-500 mt-1">
            {visit.scheduled_date ? formatFullDate(visit.scheduled_date) : "Date non definie"}
          </p>

          {/* Status Badge */}
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
                visit.status
              )}`}
            >
              {getStatusLabel(visit.status)}
            </span>
          </div>

          {visit.notes && (
            <p className="text-sm text-slate-400 mt-2 line-clamp-2">
              {visit.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
