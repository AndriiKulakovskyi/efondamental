"use client";

import { FileText, Zap, BarChart } from "lucide-react";

interface VisitQuickStatsProps {
  totalModules: number;
  totalQuestionnaires: number;
  completedQuestionnaires: number;
  completionPercentage: number;
}

export function VisitQuickStats({ 
  totalModules,
  totalQuestionnaires,
  completedQuestionnaires,
  completionPercentage
}: VisitQuickStatsProps) {
  const pendingQuestionnaires = totalQuestionnaires - completedQuestionnaires;

  return (
    <div className="grid grid-cols-4 gap-6 mb-10">
      {/* Global Progress Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Progression Globale</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{completionPercentage.toFixed(0)}%</p>
        </div>
        <div className="w-14 h-14 rounded-full border-[4px] border-orange-100 border-t-orange-500 flex items-center justify-center bg-orange-50">
          <Zap className="w-7 h-7 text-orange-500" />
        </div>
      </div>

      {/* Modules Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Modules</p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-3xl font-bold text-slate-900">{totalModules}</p>
          <span className="text-sm font-medium text-slate-400">actifs</span>
        </div>
      </div>

      {/* Forms Done Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Formulaires Complétés</p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-3xl font-bold text-teal-600">{completedQuestionnaires}</p>
          <span className="text-sm font-medium text-slate-400">/ {totalQuestionnaires} total</span>
        </div>
      </div>

      {/* Pending Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">En Attente</p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-3xl font-bold text-brand">{pendingQuestionnaires}</p>
          <span className="text-sm font-medium text-slate-400">formulaires</span>
        </div>
      </div>
    </div>
  );
}

