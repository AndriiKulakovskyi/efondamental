"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Calendar, FileText, Bell } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  type: "high_risk" | "overdue_visit" | "pending_questionnaire" | "upcoming_visit";
  title: string;
  message: string;
  patientId?: string;
  patientName?: string;
  visitId?: string;
  link?: string;
  priority: "high" | "medium" | "low";
  timestamp: string;
}

interface NotificationsPanelProps {
  notifications: Notification[];
  pathology: string;
}

export function NotificationsPanel({ notifications, pathology }: NotificationsPanelProps) {
  if (notifications.length === 0) {
    return null;
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "high_risk":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "overdue_visit":
        return <Calendar className="h-5 w-5 text-amber-500" />;
      case "pending_questionnaire":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "upcoming_visit":
        return <Calendar className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-slate-500" />;
    }
  };

  const getPriorityBadge = (priority: Notification["priority"]) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-amber-100 text-amber-800 border-amber-200",
      low: "bg-blue-100 text-blue-800 border-blue-200",
    };

    return (
      <Badge className={`${colors[priority]} border`} variant="outline">
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const highPriorityNotifications = notifications.filter(n => n.priority === "high");

  return (
    <Card className={highPriorityNotifications.length > 0 ? "border-red-200 bg-red-50" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
          {notifications.length > 0 && (
            <Badge variant="default">{notifications.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.slice(0, 10).map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border ${
                notification.priority === "high"
                  ? "border-red-200 bg-white"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-slate-900">
                      {notification.title}
                    </h4>
                    {getPriorityBadge(notification.priority)}
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    {notification.message}
                  </p>
                  {notification.patientName && (
                    <p className="text-xs text-slate-500 mb-2">
                      Patient: {notification.patientName}
                    </p>
                  )}
                  {notification.link && (
                    <Link
                      href={notification.link}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View Details →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
          {notifications.length > 10 && (
            <p className="text-sm text-slate-500 text-center py-2">
              {notifications.length - 10} more notification{notifications.length - 10 !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

