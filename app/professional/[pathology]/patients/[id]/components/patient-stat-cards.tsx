"use client";

import { Calendar, FileText, AlertTriangle, Clock } from "lucide-react";
import { ExpandableStatCard } from "./expandable-stat-card";
import { formatShortDate } from "@/lib/utils/date";

interface PatientStatsProps {
  stats: {
    totalVisits: number;
    completedVisits: number;
    upcomingVisits: number;
  };
  riskLevel: string;
  riskColor: string;
  visits: any[];
  pathology: string;
}

export function PatientStatCards({ stats, riskLevel, riskColor, visits, pathology }: PatientStatsProps) {
  const upcomingVisits = visits.filter(v => v.status === 'scheduled' || v.status === 'in_progress');
  const completedVisits = visits.filter(v => v.status === 'completed').slice(0, 3);
  
  const visitsByType = visits.reduce((acc: any, visit) => {
    const type = visit.visit_type || 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <ExpandableStatCard
        title="Total Visits"
        value={stats.totalVisits}
        icon={Calendar}
        expandedContent={
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700 mb-3">Visit Breakdown</p>
            {Object.keys(visitsByType).length > 0 ? (
              Object.entries(visitsByType).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center py-1">
                  <span className="text-sm text-slate-600 capitalize">{type.replace(/_/g, ' ')}</span>
                  <span className="text-sm font-semibold text-slate-900">{count as number}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No visits recorded</p>
            )}
          </div>
        }
      />
      
      <ExpandableStatCard
        title="Completed"
        value={stats.completedVisits}
        icon={FileText}
        expandedContent={
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700 mb-3">Recent Completed Visits</p>
            {completedVisits.length > 0 ? (
              completedVisits.map((visit) => (
                <div key={visit.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{visit.template_name}</p>
                    <p className="text-xs text-slate-500">{formatShortDate(visit.scheduled_date)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No completed visits</p>
            )}
          </div>
        }
      />
      
      <ExpandableStatCard
        title="Upcoming"
        value={stats.upcomingVisits}
        icon={Clock}
        expandedContent={
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700 mb-3">Scheduled Appointments</p>
            {upcomingVisits.length > 0 ? (
              upcomingVisits.slice(0, 3).map((visit) => (
                <div key={visit.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{visit.template_name}</p>
                    <p className="text-xs text-slate-500">{formatShortDate(visit.scheduled_date)}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {visit.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No upcoming visits</p>
            )}
          </div>
        }
      />
      
      <ExpandableStatCard
        title="Risk Level"
        value={riskLevel}
        icon={AlertTriangle}
        valueColor={riskColor}
        expandedContent={
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700 mb-3">Risk Factors</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${riskColor === 'text-red-600' ? 'bg-red-500' : riskColor === 'text-amber-600' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                <span className="text-sm text-slate-600">Current Risk: {riskLevel}</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Risk assessment based on recent clinical evaluations
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
}

