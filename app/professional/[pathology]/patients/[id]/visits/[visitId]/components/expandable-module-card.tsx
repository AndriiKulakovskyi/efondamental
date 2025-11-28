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

// Helper function to get all questionnaires from a module (flat or sectioned)
function getAllQuestionnaires(module: any): any[] {
  try {
    if (!module) return [];
    
    if (module.sections && Array.isArray(module.sections)) {
      const result: any[] = [];
      for (const section of module.sections) {
        if (section && Array.isArray(section.questionnaires)) {
          result.push(...section.questionnaires);
        }
      }
      return result;
    }
    
    if (Array.isArray(module.questionnaires)) {
      return module.questionnaires;
    }
    
    return [];
  } catch (e) {
    console.error('Error in getAllQuestionnaires:', e);
    return [];
  }
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
  
  const allQuestionnaires = getAllQuestionnaires(module);
  const completedCount = Array.isArray(allQuestionnaires) ? allQuestionnaires.filter((q: any) => q?.completed).length : 0;
  const totalCount = Array.isArray(allQuestionnaires) ? allQuestionnaires.length : 0;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  const isCompleted = completionPercentage === 100;
  const isInProgress = completionPercentage > 0 && completionPercentage < 100;
  const isPending = completionPercentage === 0;

  return (
    <div className="flex gap-8 group">
      {/* Timeline indicator */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center z-10 relative",
          isCompleted && "bg-teal-500 border-4 border-white shadow-lg",
          isInProgress && "bg-brand border-4 border-white shadow-lg",
          isPending && "bg-slate-400 border-4 border-white shadow-md hover:bg-slate-500 transition-colors"
    )}>
          {isCompleted ? (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          ) : (
            <span className={cn(
              "text-sm font-bold",
              isInProgress ? "text-white" : "text-white"
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
        "flex-1 bg-white rounded-2xl border p-7 shadow-sm transition-all overflow-hidden hover:shadow-md cursor-pointer",
        isCompleted && "border-teal-200 bg-teal-50/30",
        isInProgress && "border-2 border-brand/30 shadow-lg shadow-brand/10 relative hover:border-brand",
        isPending && "border-slate-200 hover:border-slate-300"
      )}>
        {/* Left accent bar for in-progress */}
        {isInProgress && (
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand"></div>
        )}

        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h4 className={cn(
                "text-base font-bold",
                isCompleted && "text-teal-900 group-hover:text-teal-600 transition",
                isInProgress && "text-brand text-xl",
                isPending && "text-slate-900"
              )}>
                  {module.name}
              </h4>
              {isCompleted && (
                <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 text-[10px] font-bold uppercase tracking-wide border border-teal-100">
                  Terminé
                </span>
              )}
              {isInProgress && (
                <span className="px-2.5 py-0.5 rounded bg-red-50 text-brand text-[10px] font-bold uppercase tracking-wide border border-red-100 animate-pulse">
                  En cours
                </span>
              )}
              {isPending && (
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wide border border-slate-200">
                  À faire
                </span>
                )}
            </div>
            <p className={cn(
              "text-sm mb-5",
              isInProgress ? "text-slate-600 max-w-md" : "text-slate-500"
            )}>
              {module.description}
            </p>

            {/* Action button for in-progress module */}
            {isInProgress && (
              <div className="mt-5">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-lg transition font-bold shadow-sm"
                >
                  {isExpanded ? 'Masquer les détails' : 'Continuer l\'évaluation'}
                </button>
              </div>
            )}

            {/* Action button for pending module */}
            {isPending && (
              <div className="mt-5">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm bg-slate-700 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg transition font-bold shadow-sm"
                >
                  {isExpanded ? 'Masquer les détails' : 'Commencer l\'évaluation'}
                </button>
              </div>
            )}

            {/* Expand button for completed state */}
            {isCompleted && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2"
              >
                {isExpanded ? 'Masquer' : 'Afficher'} les détails
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
              isInProgress ? "text-xl" : "text-base",
              isInProgress && "text-slate-900"
            )}>
              {completedCount}
              <span className="text-slate-400 text-base font-medium">/{totalCount}</span>
            </p>
            <p className="text-xs font-medium text-slate-400 uppercase">formulaires</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className={cn("mt-6 h-2.5 w-full bg-slate-100 rounded-full overflow-hidden", isInProgress && "h-2.5")}>
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
            <div className="space-y-3 mt-5">
              {/* Render sections if present */}
              {module.sections ? (
                module.sections.map((section: any) => (
                  <CollapsibleSection
                    key={section.id}
                    section={section}
                    pathology={pathology}
                    patientId={patientId}
                    visitId={visitId}
                  />
                ))
              ) : (
                /* Render flat questionnaires list */
                module.questionnaires?.map((questionnaire: any) => (
                  <QuestionnaireItem 
                    key={questionnaire.id}
                    questionnaire={questionnaire}
                    pathology={pathology}
                    patientId={patientId}
                    visitId={visitId}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Collapsible section component for nested sections (WAIS-III, WAIS-IV)
function CollapsibleSection({
  section,
  pathology,
  patientId,
  visitId
}: {
  section: any;
  pathology: string;
  patientId: string;
  visitId: string;
}) {
  const [isSectionExpanded, setIsSectionExpanded] = useState(true);
  
  const questionnaires = Array.isArray(section?.questionnaires) ? section.questionnaires : [];
  const completedCount = questionnaires.filter((q: any) => q?.completed).length;
  const totalCount = questionnaires.length;
  const hasQuestionnaires = totalCount > 0;
  
  return (
    <div className="space-y-3 pt-4 first:pt-0">
      {/* Section header - clickable */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsSectionExpanded(!isSectionExpanded);
        }}
        className="flex items-center gap-3 w-full text-left group hover:bg-slate-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
      >
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform duration-200",
            !isSectionExpanded && "-rotate-90"
          )}
        />
        <h5 className="text-sm font-bold text-slate-700 uppercase tracking-wide group-hover:text-slate-900 transition-colors">
          {section.name}
        </h5>
        <div className="h-px flex-1 bg-slate-200"></div>
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full",
          completedCount === totalCount && totalCount > 0 
            ? "bg-teal-100 text-teal-700" 
            : "bg-slate-100 text-slate-500"
        )}>
          {completedCount}/{totalCount}
        </span>
      </button>
      
      {/* Collapsible content */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: isSectionExpanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 200ms ease-out'
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div className="space-y-3 pl-7">
            {hasQuestionnaires ? (
              questionnaires.map((questionnaire: any) => (
                <QuestionnaireItem 
                  key={questionnaire.id}
                  questionnaire={questionnaire}
                  pathology={pathology}
                  patientId={patientId}
                  visitId={visitId}
                />
              ))
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <p className="text-sm text-slate-500 italic">Aucun questionnaire dans cette section</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Extracted QuestionnaireItem component for reuse
function QuestionnaireItem({ 
  questionnaire, 
  pathology, 
  patientId, 
  visitId 
}: { 
  questionnaire: any; 
  pathology: string; 
  patientId: string; 
  visitId: string; 
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-5 border border-slate-200 rounded-xl transition-all duration-200",
        questionnaire.completed 
          ? "bg-teal-50 border-teal-200" 
          : "bg-white hover:shadow-md hover:border-slate-300"
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        {questionnaire.completed ? (
          <CheckCircle className="h-6 w-6 text-teal-600 flex-shrink-0" />
        ) : (
          <Circle className="h-6 w-6 text-slate-300 flex-shrink-0" />
        )}
        <div className="flex-1">
          <p className={cn(
            "font-medium text-base",
            questionnaire.completed ? "text-teal-900" : "text-slate-900"
          )}>
            {questionnaire.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-slate-500 capitalize">
              Pour: {questionnaire.target_role?.replace(/_/g, " ")}
            </p>
            {questionnaire.completed && questionnaire.completedAt && (
              <>
                <span className="text-xs text-slate-400">-</span>
                <p className="text-xs text-slate-500">
                  Complété le {formatShortDate(questionnaire.completedAt)}
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
            <FileText className="h-4 w-4" />
            {questionnaire.completed ? 'Voir' : 'Remplir'}
          </Button>
        </Link>
      </div>
    </div>
  );
}

