"use client";

import { VisitType, VISIT_TYPE_NAMES } from "@/lib/types/enums";

interface VisitTypeStat {
  visitType: string;
  visitTypeName: string;
  count: number;
  completedCount: number;
}

interface VisitTypeDonutsProps {
  visitTypeStats: VisitTypeStat[];
}

const COLORS = [
  { bg: 'bg-blue-500', stroke: '#3b82f6' },
  { bg: 'bg-brand', stroke: '#ec5a0e' },
  { bg: 'bg-emerald-500', stroke: '#10b981' },
  { bg: 'bg-purple-500', stroke: '#a855f7' },
  { bg: 'bg-amber-500', stroke: '#f59e0b' },
];

function DonutChart({ 
  completed, 
  total, 
  color, 
  visitTypeName 
}: { 
  completed: number; 
  total: number; 
  color: { bg: string; stroke: string }; 
  visitTypeName: string;
}) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90" width="128" height="128">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-slate-900">{total}</div>
          <div className="text-xs text-slate-500">Total</div>
        </div>
      </div>
      
      <div className="text-center space-y-1">
        <h4 className="text-sm font-bold text-slate-900">{visitTypeName}</h4>
        <div className="flex items-center justify-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${color.bg}`}></div>
          <p className="text-xs text-slate-600">
            <span className="font-bold">{completed}</span> completed
          </p>
        </div>
        {total > 0 && (
          <p className="text-xs font-medium text-slate-500">
            {percentage.toFixed(0)}% completion
          </p>
        )}
      </div>
    </div>
  );
}

export function VisitTypeDonuts({ visitTypeStats }: VisitTypeDonutsProps) {
  // Ensure all 5 visit types are always present
  const allVisitTypes = [
    VisitType.SCREENING,
    VisitType.INITIAL_EVALUATION,
    VisitType.BIANNUAL_FOLLOWUP,
    VisitType.ANNUAL_EVALUATION,
    VisitType.OFF_SCHEDULE,
  ];

  const allStats = allVisitTypes.map((visitType, index) => {
    const existingStat = visitTypeStats.find(stat => stat.visitType === visitType);
    return {
      visitType,
      visitTypeName: VISIT_TYPE_NAMES[visitType],
      count: existingStat?.count || 0,
      completedCount: existingStat?.completedCount || 0,
      color: COLORS[index],
    };
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-6">
      {allStats.map((stat) => (
        <DonutChart
          key={stat.visitType}
          completed={stat.completedCount}
          total={stat.count}
          color={stat.color}
          visitTypeName={stat.visitTypeName}
        />
      ))}
    </div>
  );
}

