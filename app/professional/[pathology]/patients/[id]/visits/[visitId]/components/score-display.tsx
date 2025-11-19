"use client";

import { AlertCircle, AlertTriangle, Info, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ScoreDisplayProps {
  code: string;
  score: any;
  interpretation: string;
  clinicalAlerts?: string[];
}

export function ScoreDisplay({ code, score, interpretation, clinicalAlerts }: ScoreDisplayProps) {
  const getScoreSeverity = () => {
    if (code === 'ASRM_FR') {
      if (score.total_score >= 12) return 'error';
      if (score.total_score >= 6) return 'warning';
      return 'info';
    }
    
    if (code === 'QIDS_SR16_FR') {
      if (score.total_score >= 16) return 'error';
      if (score.total_score >= 11) return 'warning';
      if (score.total_score >= 6) return 'info';
      return 'success';
    }
    
    if (code === 'MDQ_FR') {
      return score.screening_result === 'POSITIF' ? 'warning' : 'info';
    }
    
    return 'info';
  };

  const severity = getScoreSeverity();
  
  const getAlertIcon = () => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getScoreColor = () => {
    switch (severity) {
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'warning':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200';
      default:
        return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  return (
    <Card className={`p-4 border-2 ${getScoreColor()}`}>
      <div className="space-y-3">
        {/* Score Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getAlertIcon()}
            <h4 className="font-semibold">
              {code === 'ASRM_FR' && 'Score ASRM'}
              {code === 'QIDS_SR16_FR' && 'Score QIDS-SR16'}
              {code === 'MDQ_FR' && 'Résultat MDQ'}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xl font-bold">
              {code === 'MDQ_FR' ? score.screening_result : `${score.total_score}${score.range ? `/${score.range[1]}` : ''}`}
            </span>
          </div>
        </div>

        {/* Severity/Probability Badge */}
        {score.severity && (
          <Badge variant={severity === 'error' ? 'destructive' : severity === 'warning' ? 'default' : 'secondary'}>
            {score.severity}
          </Badge>
        )}
        
        {score.probability && (
          <Badge variant={severity === 'error' || severity === 'warning' ? 'destructive' : 'secondary'}>
            {score.probability}
          </Badge>
        )}

        {/* Domain Scores (QIDS) */}
        {score.domain_scores && (
          <div className="grid grid-cols-3 gap-2 text-xs">
            {Object.entries(score.domain_scores).map(([domain, value]) => (
              <div key={domain} className="flex justify-between">
                <span className="capitalize">{domain.replace('_', ' ')}:</span>
                <span className="font-semibold">{String(value)}</span>
              </div>
            ))}
          </div>
        )}

        {/* MDQ Details */}
        {code === 'MDQ_FR' && (
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Symptômes Q1:</span>
              <span className="font-semibold">{score.q1_total}/13</span>
            </div>
            <div className="flex justify-between">
              <span>Simultanéité (Q2):</span>
              <span className="font-semibold">{score.q2_concurrent ? 'Oui' : 'Non'}</span>
            </div>
            <div className="flex justify-between">
              <span>Impact (Q3):</span>
              <span className="font-semibold">{score.q3_impact_label}</span>
            </div>
          </div>
        )}

        {/* Interpretation */}
        <p className="text-sm leading-relaxed">
          {interpretation}
        </p>

        {/* Clinical Alerts */}
        {clinicalAlerts && clinicalAlerts.length > 0 && (
          <div className={`rounded-md p-3 ${severity === 'error' ? 'bg-red-100' : 'bg-orange-100'}`}>
            <div className="flex items-start gap-2">
              <AlertCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${severity === 'error' ? 'text-red-700' : 'text-orange-700'}`} />
              <div className="space-y-1 text-xs">
                {clinicalAlerts.map((alert, idx) => (
                  <p key={idx} className={severity === 'error' ? 'text-red-800 font-medium' : 'text-orange-800'}>
                    {alert}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

