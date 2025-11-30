"use client";

import { useMemo } from "react";
import { Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { AlertsDialog } from "./alerts-dialog";
import { VisitWithCompletion } from "@/lib/services/patient-profile.service";

interface PatientStatsProps {
  stats: {
    totalVisits: number;
    completedVisits: number;
    upcomingVisits: number;
  };
  visits: VisitWithCompletion[];
  pathology: string;
  patientId: string;
}

interface VisitAlert {
  id: string;
  visit_type: string;
  template_name: string | null;
  scheduled_date: string | null;
  completionPercentage: number;
  alertType: "overdue" | "incomplete";
}

export function PatientStatCards({ stats, visits, pathology, patientId }: PatientStatsProps) {
  // Calculate alerts from visits data
  const alerts = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Compare dates only, not time
    
    const alertsList: VisitAlert[] = [];
    const seenVisitIds = new Set<string>();

    visits.forEach((visit) => {
      // Skip completed, cancelled, or 100% complete visits
      // A visit with 100% completion is effectively complete even if status hasn't been updated
      if (
        visit.status === "completed" ||
        visit.status === "cancelled" ||
        visit.completionPercentage === 100
      ) {
        return;
      }

      const scheduledDate = visit.scheduled_date
        ? new Date(visit.scheduled_date)
        : null;
      
      if (scheduledDate) {
        scheduledDate.setHours(0, 0, 0, 0);
      }

      // Check for overdue visits (scheduled date in past, not completed)
      const isOverdue =
        scheduledDate &&
        scheduledDate < now &&
        (visit.status === "scheduled" || visit.status === "in_progress");

      // Check for incomplete questionnaires (started but not finished, and less than 100%)
      const isIncomplete =
        visit.completionPercentage > 0 && visit.completionPercentage < 100;

      if (isOverdue && !seenVisitIds.has(visit.id)) {
        alertsList.push({
          id: visit.id,
          visit_type: visit.visit_type,
          template_name: visit.template_name,
          scheduled_date: visit.scheduled_date,
          completionPercentage: visit.completionPercentage,
          alertType: "overdue",
        });
        seenVisitIds.add(visit.id);
      } else if (isIncomplete && !seenVisitIds.has(visit.id)) {
        alertsList.push({
          id: visit.id,
          visit_type: visit.visit_type,
          template_name: visit.template_name,
          scheduled_date: visit.scheduled_date,
          completionPercentage: visit.completionPercentage,
          alertType: "incomplete",
        });
        seenVisitIds.add(visit.id);
      }
    });

    return alertsList;
  }, [visits]);

  const alertsCount = alerts.length;

  const cards = [
    {
      title: "Total visites",
      value: stats.totalVisits,
      icon: Calendar,
      iconBgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      hoverBorderColor: "hover:border-blue-300",
    },
    {
      title: "Complétées",
      value: stats.completedVisits,
      icon: CheckCircle,
      iconBgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      hoverBorderColor: "hover:border-emerald-300",
    },
    {
      title: "À venir",
      value: stats.upcomingVisits,
      icon: Clock,
      iconBgColor: "bg-brand/10",
      iconColor: "text-brand",
      hoverBorderColor: "hover:border-brand",
    },
  ];

  const alertCard = {
    title: "Alertes",
    value: alertsCount,
    icon: AlertTriangle,
    iconBgColor: alertsCount > 0 ? "bg-red-50" : "bg-slate-50",
    iconColor: alertsCount > 0 ? "text-red-600" : "text-slate-400",
    valueColor: alertsCount > 0 ? "text-red-600" : "text-slate-400",
    hoverBorderColor: alertsCount > 0 ? "hover:border-red-400" : "hover:border-slate-300",
    hasLeftAccent: alertsCount > 0,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between ${card.hoverBorderColor} transition-all relative overflow-hidden`}
        >
          <div>
            <p className={`text-xs font-medium text-slate-500 uppercase tracking-wide group-hover:${card.iconColor} transition`}>
              {card.title}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3xl font-bold text-slate-900">{card.value}</p>
            </div>
          </div>
          <div
            className={`w-12 h-12 rounded-xl ${card.iconBgColor} ${card.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
          >
            <card.icon className="w-6 h-6" />
          </div>
        </div>
      ))}

      {/* Alerts Card with Dialog */}
      <AlertsDialog alerts={alerts} pathology={pathology} patientId={patientId}>
        <div
          className={`group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between ${alertCard.hoverBorderColor} transition-all cursor-pointer relative overflow-hidden`}
        >
          {alertCard.hasLeftAccent && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          )}

          <div>
            <p
              className={`text-xs font-medium text-slate-500 uppercase tracking-wide group-hover:${alertCard.iconColor} transition`}
            >
              {alertCard.title}
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className={`text-3xl font-bold ${alertCard.valueColor}`}>
                {alertCard.value}
              </p>
              {alertsCount > 0 && (
                <span className="text-xs text-red-400 font-medium">
                  à traiter
                </span>
              )}
            </div>
          </div>
          <div
            className={`w-12 h-12 rounded-xl ${alertCard.iconBgColor} ${alertCard.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
          >
            <alertCard.icon className="w-6 h-6" />
          </div>
        </div>
      </AlertsDialog>
    </div>
  );
}
