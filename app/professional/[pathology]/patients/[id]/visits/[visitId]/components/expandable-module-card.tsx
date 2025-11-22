"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, CheckCircle, Circle, FileText, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatShortDate } from "@/lib/utils/date";
import Link from "next/link";

interface ExpandableModuleCardProps {
  module: any;
  index: number;
  pathology: string;
  patientId: string;
  visitId: string;
}

export function ExpandableModuleCard({ 
  module, 
  index, 
  pathology, 
  patientId, 
  visitId 
}: ExpandableModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const completedCount = module.questionnaires.filter((q: any) => q.completed).length;
  const totalCount = module.questionnaires.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card className={cn(
      "transition-all duration-300",
      isExpanded && "shadow-lg border-slate-700"
    )}>
      <CardHeader 
        className="cursor-pointer hover:bg-slate-50 transition-colors rounded-t-xl"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm",
                completionPercentage === 100 
                  ? "bg-green-100 text-green-700" 
                  : completionPercentage > 0 
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-700"
              )}>
                {index + 1}
              </div>
              <div className="flex-1">
                <CardTitle className="text-base font-semibold">
                  {module.name}
                </CardTitle>
                {module.description && (
                  <p className="text-sm text-slate-500 mt-1">{module.description}</p>
                )}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3 ml-11">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                <span>{completedCount}/{totalCount} completed</span>
                <span>{completionPercentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all duration-500",
                    completionPercentage === 100 ? "bg-green-600" : "bg-blue-600"
                  )}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
          
          <ChevronDown 
            className={cn(
              "h-5 w-5 text-slate-500 transition-transform duration-300 flex-shrink-0 ml-4",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </CardHeader>

      <div
        style={{
          display: 'grid',
          gridTemplateRows: isExpanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 300ms'
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {module.questionnaires.map((questionnaire: any) => (
            <div
              key={questionnaire.id}
              className={cn(
                "flex items-center justify-between p-4 border border-slate-200 rounded-lg transition-all duration-200",
                questionnaire.completed 
                  ? "bg-green-50 border-green-200" 
                  : "bg-white hover:shadow-md hover:border-slate-300"
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                {questionnaire.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-300 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={cn(
                    "font-medium",
                    questionnaire.completed ? "text-green-900" : "text-slate-900"
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
                {questionnaire.completed ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                      Complété
                    </span>
                    <Link
                      href={`/professional/${pathology}/patients/${patientId}/visits/${visitId}/questionnaire/${questionnaire.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="outline" size="sm" className="gap-2">
                        <RotateCcw className="h-3 w-3" />
                        Reprendre
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={`/professional/${pathology}/patients/${patientId}/visits/${visitId}/questionnaire/${questionnaire.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Remplir
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            ))}
          </div>
        </CardContent>
        </div>
      </div>
    </Card>
  );
}

