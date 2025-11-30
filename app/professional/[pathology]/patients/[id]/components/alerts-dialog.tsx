"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle, Clock, Calendar, ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatShortDate } from "@/lib/utils/date";
import { VISIT_TYPE_NAMES } from "@/lib/types/enums";

interface VisitAlert {
  id: string;
  visit_type: string;
  template_name: string | null;
  scheduled_date: string | null;
  completionPercentage: number;
  alertType: "overdue" | "incomplete";
}

interface AlertsDialogProps {
  alerts: VisitAlert[];
  pathology: string;
  patientId: string;
  children: React.ReactNode;
}

export function AlertsDialog({
  alerts,
  pathology,
  patientId,
  children,
}: AlertsDialogProps) {
  const [open, setOpen] = useState(false);

  const overdueAlerts = alerts.filter((a) => a.alertType === "overdue");
  const incompleteAlerts = alerts.filter((a) => a.alertType === "incomplete");

  const hasAlerts = alerts.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Alertes Patient
          </DialogTitle>
          <DialogDescription>
            {hasAlerts
              ? `${alerts.length} alerte${alerts.length > 1 ? "s" : ""} nécessitant votre attention`
              : "Aucune alerte pour ce patient"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          {hasAlerts ? (
            <div className="space-y-6">
              {/* Overdue Visits Section */}
              {overdueAlerts.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-red-600 uppercase tracking-wide">
                    <Clock className="h-4 w-4" />
                    Visites en retard ({overdueAlerts.length})
                  </div>
                  <div className="space-y-3">
                    {overdueAlerts.map((alert) => (
                      <AlertItem
                        key={alert.id}
                        alert={alert}
                        pathology={pathology}
                        patientId={patientId}
                        onNavigate={() => setOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Incomplete Questionnaires Section */}
              {incompleteAlerts.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 uppercase tracking-wide">
                    <AlertTriangle className="h-4 w-4" />
                    Questionnaires incomplets ({incompleteAlerts.length})
                  </div>
                  <div className="space-y-3">
                    {incompleteAlerts.map((alert) => (
                      <AlertItem
                        key={alert.id}
                        alert={alert}
                        pathology={pathology}
                        patientId={patientId}
                        onNavigate={() => setOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <p className="text-slate-600 font-medium">Tout est en ordre</p>
              <p className="text-sm text-slate-400 mt-1">
                Aucune visite en retard ou questionnaire incomplet
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface AlertItemProps {
  alert: VisitAlert;
  pathology: string;
  patientId: string;
  onNavigate: () => void;
}

function AlertItem({ alert, pathology, patientId, onNavigate }: AlertItemProps) {
  const visitName =
    VISIT_TYPE_NAMES[alert.visit_type as keyof typeof VISIT_TYPE_NAMES] ||
    alert.template_name ||
    "Visite";

  const isOverdue = alert.alertType === "overdue";

  return (
    <Link
      href={`/professional/${pathology}/patients/${patientId}/visits/${alert.id}`}
      onClick={onNavigate}
    >
      <div
        className={cn(
          "group p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer",
          isOverdue
            ? "bg-red-50/50 border-red-200 hover:border-red-300 hover:bg-red-50"
            : "bg-amber-50/50 border-amber-200 hover:border-amber-300 hover:bg-amber-50"
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 truncate">{visitName}</p>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
              {alert.scheduled_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatShortDate(alert.scheduled_date)}
                </span>
              )}
              <span
                className={cn(
                  "font-medium",
                  alert.completionPercentage === 0
                    ? "text-slate-400"
                    : alert.completionPercentage < 50
                      ? "text-red-500"
                      : "text-amber-500"
                )}
              >
                {alert.completionPercentage}% complété
              </span>
            </div>
          </div>
          <div
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1",
              isOverdue ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
            )}
          >
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

