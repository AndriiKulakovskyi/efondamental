"use client";

import { AlertCircle, AlertTriangle, Info, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ScoreDisplayProps {
  code: string;
  data: any; // DB Row
}

export function ScoreDisplay({ code, data }: ScoreDisplayProps) {
  const getSeverity = () => {
    if (code === 'ASRM_FR') {
      // ASRM: Total >= 6 -> mania/hypomania
      if (data.total_score >= 12) return 'error';
      if (data.total_score >= 6) return 'warning';
      return 'info';
    }
    
    if (code === 'QIDS_SR16_FR') {
      // QIDS: 0-5, 6-10, 11-15, 16-20, 21+
      if (data.total_score >= 21) return 'error';
      if (data.total_score >= 16) return 'error';
      if (data.total_score >= 11) return 'warning';
      if (data.total_score >= 6) return 'info';
      return 'success';
    }
    
    if (code === 'MDQ_FR') {
      return data.positive_screen ? 'warning' : 'info';
    }
    
    return 'info';
  };

  const severity = getSeverity();
  const interpretation = data.interpretation || 
    (code === 'MDQ_FR' ? (data.positive_screen ? 'Dépistage Positif' : 'Dépistage Négatif') : '');

  const getAlertIcon = () => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'success':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
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

  // Calculations for MDQ details
  const getMdqDetails = () => {
    if (code !== 'MDQ_FR') return null;
    
    // Sum Q1
    const q1Keys = [
      'q1_1', 'q1_2', 'q1_3', 'q1_4', 'q1_5', 'q1_6', 'q1_7', 
      'q1_8', 'q1_9', 'q1_10', 'q1_11', 'q1_12', 'q1_13'
    ];
    const q1Total = q1Keys.reduce((acc, key) => acc + (data[key] ? 1 : 0), 0);
    
    const impactLabels = [
      "Pas de problème", 
      "Problème mineur", 
      "Problème moyen", 
      "Problème sérieux"
    ];
    const impactLabel = impactLabels[data.q3] || "N/A";

    return { q1Total, impactLabel };
  };

  const mdqDetails = getMdqDetails();

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
              {code === 'MDQ_FR' 
                ? (data.positive_screen ? 'POSITIF' : 'NÉGATIF') 
                : (data.total_score !== undefined ? data.total_score : '-')}
              {code === 'ASRM_FR' && '/20'}
              {code === 'QIDS_SR16_FR' && '/27'}
            </span>
          </div>
        </div>

        {/* MDQ Details */}
        {code === 'MDQ_FR' && mdqDetails && (
          <div className="text-xs space-y-1 mt-2">
            <div className="flex justify-between">
              <span>Symptômes Q1:</span>
              <span className="font-semibold">{mdqDetails.q1Total}/13</span>
            </div>
            <div className="flex justify-between">
              <span>Simultanéité (Q2):</span>
              <span className="font-semibold">{data.q2 ? 'Oui' : 'Non'}</span>
            </div>
            <div className="flex justify-between">
              <span>Impact (Q3):</span>
              <span className="font-semibold">{mdqDetails.impactLabel}</span>
            </div>
          </div>
        )}

        {/* Interpretation */}
        {interpretation && (
          <p className="text-sm leading-relaxed font-medium">
            {interpretation}
          </p>
        )}
      </div>
    </Card>
  );
}
