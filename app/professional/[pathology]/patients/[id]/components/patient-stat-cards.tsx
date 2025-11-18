"use client";

import { Calendar, FileText, Clock } from "lucide-react";

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
  const cards = [
    {
      title: "Total visites",
      value: stats.totalVisits,
      icon: Calendar,
      color: "#3B82F6",
    },
    {
      title: "Complétées",
      value: stats.completedVisits,
      icon: FileText,
      color: "#10B981",
    },
    {
      title: "À venir",
      value: stats.upcomingVisits,
      icon: Clock,
      color: "#F59E0B",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 mb-2">
                  {card.title}
                </p>
                <p className="text-4xl font-bold text-slate-900">
                  {card.value}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
            </div>
          </div>
          <div className="h-1" style={{ backgroundColor: card.color }} />
        </div>
      ))}
    </div>
  );
}
