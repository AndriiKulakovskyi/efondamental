"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, TrendingUp, Activity, Pill } from "lucide-react";
import { formatDateTime } from "@/lib/utils/date";
import { VISIT_TYPE_NAMES, VisitType } from "@/lib/types/enums";
import { cn } from "@/lib/utils";

interface EvaluationsDisplayProps {
  evaluations: any[];
}

export function EvaluationsDisplay({ evaluations }: EvaluationsDisplayProps) {
  const [expandedEvalId, setExpandedEvalId] = useState<string | null>(null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Évaluations Cliniques</h3>
        <div className="text-sm text-slate-600">
          {evaluations.length} évaluation{evaluations.length !== 1 ? 's' : ''} enregistrée{evaluations.length !== 1 ? 's' : ''}
        </div>
      </div>

      {evaluations.length > 0 ? (
        <div className="space-y-4">
          {evaluations.map((evaluation) => {
            const isExpanded = expandedEvalId === evaluation.id;
            const hasRiskAssessment = evaluation.risk_assessment && 
              (evaluation.risk_assessment.suicide_risk !== 'none' || 
               evaluation.risk_assessment.relapse_risk !== 'none');

            return (
              <Card 
                key={evaluation.id} 
                className={cn(
                  "transition-all duration-300 hover:shadow-lg cursor-pointer",
                  isExpanded && "shadow-lg border-slate-700"
                )}
                onClick={() => setExpandedEvalId(isExpanded ? null : evaluation.id)}
              >
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="font-semibold text-lg text-slate-900">
                          {evaluation.visit_type && VISIT_TYPE_NAMES[evaluation.visit_type as VisitType]}
                          {!evaluation.visit_type && "Évaluation Clinique"}
                        </h4>
                        {hasRiskAssessment && (
                          <div className="flex gap-2">
                            {evaluation.risk_assessment.suicide_risk && evaluation.risk_assessment.suicide_risk !== 'none' && (
                              <span className={cn(
                                "text-xs px-2.5 py-1 rounded-full border font-medium",
                                getRiskColor(evaluation.risk_assessment.suicide_risk)
                              )}>
                                Suicide: {evaluation.risk_assessment.suicide_risk}
                              </span>
                            )}
                            {evaluation.risk_assessment.relapse_risk && evaluation.risk_assessment.relapse_risk !== 'none' && (
                              <span className={cn(
                                "text-xs px-2.5 py-1 rounded-full border font-medium",
                                getRiskColor(evaluation.risk_assessment.relapse_risk)
                              )}>
                                Rechute: {evaluation.risk_assessment.relapse_risk}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-slate-600 mb-4">
                        Évalué par {evaluation.evaluator_name} le{" "}
                        {formatDateTime(evaluation.evaluation_date)}
                      </p>

                      {/* Quick metrics summary */}
                      <div className="flex items-center gap-6">
                        {evaluation.mood_score !== null && (
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-slate-500" />
                            <div>
                              <span className="text-xs text-slate-500">Humeur</span>
                              <p className="text-base font-bold text-slate-900">{evaluation.mood_score}/10</p>
                            </div>
                          </div>
                        )}
                        {evaluation.medication_adherence !== null && (
                          <div className="flex items-center gap-2">
                            <Pill className="h-4 w-4 text-slate-500" />
                            <div>
                              <span className="text-xs text-slate-500">Adhésion</span>
                              <p className="text-base font-bold text-slate-900">{evaluation.medication_adherence}%</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <ChevronDown 
                      className={cn(
                        "h-5 w-5 text-slate-500 transition-transform duration-300 flex-shrink-0 ml-4",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </div>

                  {/* Expanded content */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      isExpanded ? "max-h-96 mt-4 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="border-t border-slate-200 pt-4 space-y-4">
                      {evaluation.notes && (
                        <div className="bg-slate-50 rounded-lg p-4">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                            Notes Cliniques
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed">{evaluation.notes}</p>
                        </div>
                      )}

                      {evaluation.risk_assessment && (
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                            Évaluation Complète des Risques
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-slate-700">Risque de Suicide</p>
                              <p className={cn(
                                "text-sm font-semibold capitalize mt-1",
                                evaluation.risk_assessment.suicide_risk === 'high' ? 'text-red-600' :
                                evaluation.risk_assessment.suicide_risk === 'moderate' ? 'text-amber-600' :
                                'text-slate-600'
                              )}>
                                {evaluation.risk_assessment.suicide_risk || 'Aucun'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700">Risque de Rechute</p>
                              <p className={cn(
                                "text-sm font-semibold capitalize mt-1",
                                evaluation.risk_assessment.relapse_risk === 'high' ? 'text-red-600' :
                                evaluation.risk_assessment.relapse_risk === 'moderate' ? 'text-amber-600' :
                                'text-slate-600'
                              )}>
                                {evaluation.risk_assessment.relapse_risk || 'Aucun'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <TrendingUp className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600">Aucune évaluation clinique enregistrée pour le moment</p>
          <p className="text-sm text-slate-500 mt-2">
            Les évaluations apparaîtront ici une fois les visites terminées
          </p>
        </div>
      )}
    </div>
  );
}

