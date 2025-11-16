import { requireUserContext } from "@/lib/rbac/middleware";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatShortDate, formatTimeAgo } from "@/lib/utils/date";
import { Calendar, Clock, MapPin } from "lucide-react";

export default async function AppointmentsPage() {
  const context = await requireUserContext();
  const supabase = await createClient();

  // Get patient record
  const { data: patient } = await supabase
    .from("patients")
    .select("id, center:centers(name, address)")
    .eq("id", context.user.id)
    .single();

  const patientId = patient?.id || context.user.id;
  const centerInfo = (patient as any)?.center;

  // Get all visits
  const { data: allVisits } = await supabase
    .from("v_visits_full")
    .select("*")
    .eq("patient_id", patientId)
    .order("scheduled_date", { ascending: true });

  // Separate upcoming and past
  const now = new Date().toISOString();
  const upcomingVisits = allVisits?.filter(
    (v) => v.scheduled_date && v.scheduled_date >= now && v.status !== "cancelled"
  );
  const pastVisits = allVisits?.filter(
    (v) => v.scheduled_date && v.scheduled_date < now || v.status === "completed"
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">My Appointments</h2>
        <p className="text-slate-600">View your scheduled and past appointments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Upcoming Appointments
          </h3>

          {upcomingVisits && upcomingVisits.length > 0 ? (
            <div className="space-y-3">
              {upcomingVisits.map((visit) => (
                <Card key={visit.id} className="border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-2 mt-1">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">
                          {visit.template_name}
                        </h4>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="h-4 w-4" />
                            {visit.scheduled_date && formatShortDate(visit.scheduled_date)}
                          </div>
                          {centerInfo && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <MapPin className="h-4 w-4" />
                              {centerInfo.name}
                            </div>
                          )}
                        </div>
                        {visit.notes && (
                          <p className="text-sm text-slate-500 mt-2">
                            {visit.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-slate-600">No upcoming appointments</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Past Appointments
          </h3>

          {pastVisits && pastVisits.length > 0 ? (
            <div className="space-y-3">
              {pastVisits.slice(0, 5).map((visit) => (
                <Card key={visit.id}>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-slate-900">
                      {visit.template_name}
                    </h4>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-slate-600">
                        {visit.scheduled_date && formatShortDate(visit.scheduled_date)}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          visit.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {visit.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-slate-600">No past appointments</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

