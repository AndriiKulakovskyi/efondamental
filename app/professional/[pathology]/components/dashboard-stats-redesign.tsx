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
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
        hoverBorderColor="hover:border-blue-300"
      />

      {/* Card 2: Active Alerts */}
      <StatCard
        title="Alertes actives"
        value={alertsCount}
        icon={AlertTriangle}
        iconBgColor="bg-red-50"
        iconColor="text-red-600"
        hoverBorderColor="hover:border-red-400"
        valueColor="text-red-600"
      />

      {/* Card 3: Visits This Month */}
      <StatCard
        title="Visites ce mois-ci"
        value={visitsThisMonth}
        icon={Calendar}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-600"
        hoverBorderColor="hover:border-emerald-300"
      />
    </div>
  );
}

// Enhanced stat card component matching HTML mockup
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
  hoverBorderColor: string;
  valueColor?: string;
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  iconBgColor,
  iconColor,
  hoverBorderColor,
  valueColor = "text-slate-900"
}: StatCardProps) {
  return (
    <div className={`group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md ${hoverBorderColor} transition-all cursor-pointer`}>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide group-hover:${iconColor} transition">
          {title}
        </p>
        <p className={`text-4xl font-bold mt-2 ${valueColor}`}>
          {value}
        </p>
      </div>
      <div className={`w-12 h-12 rounded-xl ${iconBgColor} ${iconColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}

