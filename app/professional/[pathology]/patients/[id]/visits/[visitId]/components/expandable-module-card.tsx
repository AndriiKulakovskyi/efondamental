"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, CheckCircle, Circle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatShortDate } from "@/lib/utils/date";
import Link from "next/link";

interface ExpandableModuleCardProps {
  module: any;
  index: number;
  pathology: string;
  patientId: string;
  visitId: string;
  totalModules: number;
}

export function ExpandableModuleCard({ 
  module, 
  index, 
  pathology, 
  patientId, 
  visitId,
  totalModules
}: ExpandableModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const completedCount = module.questionnaires.filter((q: any) => q.completed).length;
  const totalCount = module.questionnaires.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  const isCompleted = completionPercentage === 100;
  const isInProgress = completionPercentage > 0 && completionPercentage < 100;
  const isPending = completionPercentage === 0;

  return (
    <div className="flex gap-6 group">
      {/* Timeline indicator */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center z-10",
          isCompleted && "bg-teal-500 border-4 border-white shadow-sm",
          isInProgress && "bg-white border-[3px] border-brand shadow-sm",
          isPending && "bg-slate-50 border-2 border-slate-300"
        )}>
          {isCompleted ? (
            <CheckCircle className="w-4 h-4 text-white" strokeWidth={3} />
          ) : (
            <span className={cn(
              "text-xs font-bold",
              isInProgress ? "text-brand" : "text-slate-400"
            )}>
              {index + 1}
            </span>
          )}
        </div>
        {/* Timeline connector line - only show if not last module */}
        {index < totalModules - 1 && (
          <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
        )}
      </div>

      {/* Module Card */}
      <div className={cn(
        "flex-1 bg-white rounded-2xl border p-6 shadow-sm transition-all overflow-hidden",
        isCompleted && "hover:shadow-md cursor-pointer",
        isInProgress && "border-2 border-brand/30 shadow-lg shadow-brand/10 relative hover:border-brand",
        isPending && "border-dashed opacity-60 grayscale hover:grayscale-0 transition-all duration-300"
      )}>
        {/* Left accent bar for in-progress */}
        {isInProgress && (
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand"></div>
        )}

        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className={cn(
                "text-base font-bold",
                isCompleted && "text-slate-900 group-hover:text-teal-600 transition",
                isInProgress && "text-brand text-lg",
                isPending && "text-slate-700"
              )}>
                {module.name}
              </h4>
              {isCompleted && (
                <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 text-[10px] font-bold uppercase tracking-wide border border-teal-100">
                  Completed
                </span>
              )}
              {isInProgress && (
                <span className="px-2.5 py-0.5 rounded bg-red-50 text-brand text-[10px] font-bold uppercase tracking-wide border border-red-100 animate-pulse">
                  In Progress
                </span>
              )}
            </div>
            <p className={cn(
              "text-sm mb-4",
              isInProgress ? "text-slate-600 max-w-md" : "text-slate-500"
            )}>
              {module.description}
            </p>

            {/* Action buttons for in-progress module */}
            {isInProgress && (
              <div className="mt-5 flex gap-3">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg transition font-medium shadow-sm"
                >
                  {isExpanded ? 'Hide Details' : 'Continue Assessment'}
                </button>
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-lg transition border border-slate-200"
                >
                  View Details
                </button>
              </div>
            )}

            {/* Expand button for other states */}
            {!isInProgress && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2"
              >
                {isExpanded ? 'Hide' : 'Show'} Details
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform",
                  isExpanded && "rotate-180"
                )} />
              </button>
            )}
          </div>
          
          <div className="text-right">
            <p className={cn(
              "font-bold",
              isInProgress ? "text-lg" : "text-sm",
              isInProgress && "text-slate-900"
            )}>
              {completedCount}
              <span className="text-slate-400 text-sm font-medium">/{totalCount}</span>
            </p>
            <p className="text-xs font-medium text-slate-400 uppercase">forms</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className={cn("mt-5 h-2 w-full bg-slate-100 rounded-full overflow-hidden", isInProgress && "h-2")}>
          <div 
            className={cn(
              "h-full transition-all duration-500",
              isCompleted ? "bg-teal-500" : isInProgress ? "bg-brand relative" : "bg-slate-200"
            )}
            style={{ width: `${completionPercentage}%` }}
          >
            {isInProgress && (
              <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-r from-transparent to-white/30"></div>
            )}
          </div>
        </div>

        {/* Expandable questionnaires list */}
        <div
          style={{
            display: 'grid',
            gridTemplateRows: isExpanded ? '1fr' : '0fr',
            transition: 'grid-template-rows 300ms'
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            <div className="space-y-2 mt-4">
              {module.questionnaires.map((questionnaire: any) => (
                <div
                  key={questionnaire.id}
                  className={cn(
                    "flex items-center justify-between p-4 border border-slate-200 rounded-lg transition-all duration-200",
                    questionnaire.completed 
                      ? "bg-teal-50 border-teal-200" 
                      : "bg-white hover:shadow-md hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {questionnaire.completed ? (
                      <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={cn(
                        "font-medium text-sm",
                        questionnaire.completed ? "text-teal-900" : "text-slate-900"
                      )}>
                        {questionnaire.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-slate-500 capitalize">
                          For: {questionnaire.target_role?.replace(/_/g, " ")}
                        </p>
                        {questionnaire.completed && questionnaire.completedAt && (
                          <>
                            <span className="text-xs text-slate-400">•</span>
                            <p className="text-xs text-slate-500">
                              Completed {formatShortDate(questionnaire.completedAt)}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <Link
                      href={`/professional/${pathology}/patients/${patientId}/visits/${visitId}/questionnaire/${questionnaire.id}`}
                    >
                      <Button 
                        size="sm" 
                        variant={questionnaire.completed ? "outline" : "default"}
                        className="gap-2"
                      >
                        <FileText className="h-3 w-3" />
                        {questionnaire.completed ? 'View' : 'Fill'}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

