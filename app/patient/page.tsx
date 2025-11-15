import { requireUserContext } from "@/lib/rbac/middleware";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/ui/stat-card";
import { Calendar, FileText, Clock } from "lucide-react";
import { formatShortDate } from "@/lib/utils/date";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PatientDashboard() {
  const context = await requireUserContext();
  const supabase = await createClient();

  // Get patient record
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('id', context.user.id)
    .single();

  // Get upcoming visits
  const { data: upcomingVisits } = await supabase
    .from('v_visits_full')
    .select('*')
    .eq('patient_id', patient?.id || context.user.id)
    .eq('status', 'scheduled')
    .gte('scheduled_date', new Date().toISOString())
    .order('scheduled_date', { ascending: true })
    .limit(5);

  // Get pending questionnaires count
  const { count: pendingQuestionnaires } = await supabase
    .from('questionnaire_responses')
    .select('*', { count: 'exact', head: true })
    .eq('patient_id', patient?.id || context.user.id)
    .eq('status', 'in_progress');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          Welcome, {context.profile.first_name}
        </h2>
        <p className="text-slate-600">Your health dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Upcoming Appointments"
          value={upcomingVisits?.length || 0}
          icon={Calendar}
        />
        <StatCard
          title="Pending Questionnaires"
          value={pendingQuestionnaires || 0}
          icon={FileText}
        />
        <StatCard
          title="Last Visit"
          value="N/A"
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Upcoming Appointments
            </h3>
            <Link href="/patient/appointments">
              <Button size="sm" variant="outline">View All</Button>
            </Link>
          </div>
          {upcomingVisits && upcomingVisits.length > 0 ? (
            <div className="space-y-3">
              {upcomingVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="p-3 border border-slate-200 rounded-lg"
                >
                  <p className="font-medium text-slate-900">{visit.template_name}</p>
                  <p className="text-sm text-slate-600">
                    {visit.scheduled_date && formatShortDate(visit.scheduled_date)}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">{visit.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No upcoming appointments</p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Pending Tasks
            </h3>
            <Link href="/patient/questionnaires">
              <Button size="sm" variant="outline">View All</Button>
            </Link>
          </div>
          {pendingQuestionnaires && pendingQuestionnaires > 0 ? (
            <div className="p-3 border border-amber-200 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-900">
                You have {pendingQuestionnaires} questionnaire{pendingQuestionnaires !== 1 ? 's' : ''} to complete
              </p>
              <Link href="/patient/questionnaires">
                <Button size="sm" className="mt-2">Complete Now</Button>
              </Link>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No pending tasks</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Need Help?
        </h3>
        <p className="text-sm text-blue-800 mb-4">
          If you have any questions or need to contact your care team, use the messaging system.
        </p>
        <Link href="/patient/messages">
          <Button variant="outline">Send Message</Button>
        </Link>
      </div>
    </div>
  );
}

