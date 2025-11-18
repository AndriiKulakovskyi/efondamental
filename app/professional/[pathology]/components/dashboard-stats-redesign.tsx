"use client";

import { Users, AlertTriangle, Calendar } from "lucide-react";
import { PatientDemographics } from "@/lib/services/patient.service";

interface DashboardStatsRedesignProps {
  totalPatients: number;
  alertsCount: number;
  visitsThisMonth: number;
  demographics: PatientDemographics;
}

export function DashboardStatsRedesign({
  totalPatients,
  alertsCount,
  visitsThisMonth,
  demographics,
}: DashboardStatsRedesignProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Total Patients */}
      <StatCard
        title="Patients du centre"
        value={totalPatients}
        icon={Users}
        accentColor="#3B82F6"
      />

      {/* Card 2: Active Alerts */}
      <StatCard
        title="Alertes actives"
        value={alertsCount}
        icon={AlertTriangle}
        accentColor="#F59E0B"
      />

      {/* Card 3: Visits This Month */}
      <StatCard
        title="Visites ce mois-ci"
        value={visitsThisMonth}
        icon={Calendar}
        accentColor="#10B981"
      />
    </div>
  );
}

// Simple stat card component
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  accentColor: string;
}

function StatCard({ title, value, icon: Icon, accentColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-slate-300">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-2">
              {title}
            </p>
            <p className="text-4xl font-bold text-slate-900">
              {value}
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Icon className="w-6 h-6" style={{ color: accentColor }} />
          </div>
        </div>
      </div>
      {/* Subtle bottom accent */}
      <div className="h-1" style={{ backgroundColor: accentColor }} />
    </div>
  );
}

