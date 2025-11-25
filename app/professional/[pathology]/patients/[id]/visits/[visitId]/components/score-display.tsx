"use client";

import { AlertCircle, AlertTriangle, Info, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ScoreDisplayProps {
  code: string;
  data: any; // DB Row
}

export function ScoreDisplay({ code, data }: ScoreDisplayProps) {
  // Don't display score card for questionnaires without scores
  const noScoreQuestionnaires = ['WAIS4_CRITERIA_FR', 'WAIS4_LEARNING_FR'];
  
  if (noScoreQuestionnaires.includes(code)) {
    return (
      <Card className="p-4 border-2 text-blue-700 bg-blue-50 border-blue-200">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          <div>
            <h4 className="font-semibold">Données enregistrées</h4>
            <p className="text-sm mt-1">Ce questionnaire est un recueil d'informations et ne comporte pas de calcul de score.</p>
          </div>
        </div>
      </Card>
    );
  }
  
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
    
    if (code === 'ALDA') {
      // ALDA: Total score 7-10 = good responder, 4-6 = partial, 0-3 = non-responder
      if (data.alda_score >= 7) return 'success';
      if (data.alda_score >= 4) return 'warning';
      return 'info';
    }
    
    if (code === 'WAIS4_MATRICES_FR') {
      // WAIS-IV Matrices: Standardized score 8-12 is average, <8 is below, >12 is above
      if (data.standardized_score >= 13) return 'success';
      if (data.standardized_score >= 8) return 'info';
      return 'warning';
    }
    
    return 'info';
  };

  const severity = getSeverity();
  
  // Generate interpretation for WAIS-IV Matrices if not present
  let interpretation = data.interpretation;
  
  if (code === 'WAIS4_MATRICES_FR' && !interpretation && data.standardized_score !== undefined) {
    if (data.standardized_score >= 13) {
      interpretation = 'Performance supérieure à la moyenne';
    } else if (data.standardized_score >= 8) {
      interpretation = 'Performance dans la moyenne';
    } else if (data.standardized_score >= 4) {
      interpretation = 'Performance inférieure à la moyenne';
    } else {
      interpretation = 'Performance significativement inférieure à la moyenne';
    }
  }
  
  if (!interpretation) {
    interpretation = code === 'MDQ_FR' ? (data.positive_screen ? 'Dépistage Positif' : 'Dépistage Négatif') : '';
  }

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
              {code === 'ALDA' && 'Score Alda'}
              {code === 'WAIS4_MATRICES_FR' && 'Résultats WAIS-IV Matrices'}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xl font-bold">
              {code === 'MDQ_FR' 
                ? (data.positive_screen ? 'POSITIF' : 'NÉGATIF') 
                : code === 'ALDA'
                ? (data.alda_score !== undefined ? data.alda_score : '-')
                : code === 'WAIS4_MATRICES_FR'
                ? (data.standardized_score !== undefined ? data.standardized_score : '-')
                : (data.total_score !== undefined ? data.total_score : '-')}
              {code === 'ASRM_FR' && '/20'}
              {code === 'QIDS_SR16_FR' && '/27'}
              {code === 'ALDA' && '/10'}
              {code === 'WAIS4_MATRICES_FR' && '/19'}
            </span>
          </div>
        </div>

        {/* ALDA Details */}
        {code === 'ALDA' && data.q0 === 1 && (
          <div className="text-sm space-y-2 mt-2 pt-2 border-t">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Score A (Amélioration):</span>
                <span className="font-semibold">{data.qa ?? '-'}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Score B (Confusions):</span>
                <span className="font-semibold">{data.b_total_score ?? '-'}/10</span>
              </div>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600 font-medium">Score Total (A - B):</span>
              <span className="font-bold text-lg">{data.alda_score ?? '-'}/10</span>
            </div>
          </div>
        )}

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

        {/* WAIS-IV Matrices Details */}
        {code === 'WAIS4_MATRICES_FR' && (
          <div className="text-sm space-y-2 mt-2 pt-2 border-t">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Note Brute:</span>
                <span className="font-semibold">{data.raw_score ?? '-'}/26</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Note Standard:</span>
                <span className="font-semibold">{data.standardized_score ?? '-'}/19</span>
              </div>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600">Age du patient:</span>
              <span className="font-semibold">{data.patient_age ?? '-'} ans</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Rang Percentile:</span>
              <span className="font-bold text-lg">{data.percentile_rank !== null && data.percentile_rank !== undefined ? data.percentile_rank : '-'}</span>
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
