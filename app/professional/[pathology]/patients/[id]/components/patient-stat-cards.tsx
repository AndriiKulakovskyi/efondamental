"use client";

import { Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface PatientStatsProps {
  stats: {
    totalVisits: number;
    completedVisits: number;
    upcomingVisits: number;
  };
  visits: any[];
  pathology: string;
}

export function PatientStatCards({ stats }: PatientStatsProps) {
  // Count alerts/missed visits
  const alertsCount = stats.totalVisits > 0 ? 1 : 0; // Placeholder logic
  
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
    {
      title: "Alertes",
      value: alertsCount,
      badge: "missed",
      icon: AlertTriangle,
      iconBgColor: "bg-red-50",
      iconColor: "text-red-600",
      valueColor: "text-red-600",
      hoverBorderColor: "hover:border-red-400",
      hasLeftAccent: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between ${card.hoverBorderColor} transition-all cursor-pointer relative overflow-hidden`}
        >
          {card.hasLeftAccent && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          )}
          
          <div>
            <p className={`text-xs font-medium text-slate-500 uppercase tracking-wide group-hover:${card.iconColor} transition`}>
                  {card.title}
                </p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className={`text-3xl font-bold ${card.valueColor || 'text-slate-900'}`}>
                  {card.value}
                </p>
              {card.badge && (
                <span className="text-xs text-red-400 font-medium">{card.badge}</span>
              )}
            </div>
          </div>
          <div className={`w-12 h-12 rounded-xl ${card.iconBgColor} ${card.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <card.icon className="w-6 h-6" />
          </div>
        </div>
      ))}
    </div>
  );
}
