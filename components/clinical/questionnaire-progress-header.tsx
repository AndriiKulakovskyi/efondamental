"use client";

import { ArrowLeft } from "lucide-react";

interface QuestionnaireProgressHeaderProps {
  title: string;
  subtitle?: string;
  progress: number;
  onBack: () => void;
}

export function QuestionnaireProgressHeader({
  title,
  subtitle,
  progress,
  onBack,
}: QuestionnaireProgressHeaderProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold uppercase text-slate-400 tracking-wide">
          Form Progress
        </span>
        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-bold text-brand">{progress}%</span>
      </div>
    </div>
  );
}

