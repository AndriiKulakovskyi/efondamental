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
      // Check if interpretation contains "Positif" or use q1_score logic
      const isPositive = data.interpretation?.includes('Positif') || 
                        (data.q1_score >= 7 && data.q2 === 1 && data.q3 >= 2);
      return isPositive ? 'warning' : 'info';
    }
    
    if (code === 'ASRS_FR') {
      // ASRS: Screening positive if >= 4 items meet threshold in Part A
      const isPositive = data.screening_positive || data.part_a_positive_items >= 4;
      return isPositive ? 'warning' : 'info';
    }
    
    if (code === 'CTQ_FR') {
      // CTQ: Check if any subscale is severe
      const hasSevere = ['emotional_abuse_severity', 'physical_abuse_severity', 'sexual_abuse_severity', 
                        'emotional_neglect_severity', 'physical_neglect_severity']
        .some(key => data[key] === 'severe');
      const hasModerate = ['emotional_abuse_severity', 'physical_abuse_severity', 'sexual_abuse_severity',
                          'emotional_neglect_severity', 'physical_neglect_severity']
        .some(key => data[key] === 'moderate');
      
      if (hasSevere) return 'error';
      if (hasModerate) return 'warning';
      return 'info';
    }
    
    if (code === 'BIS10_FR') {
      // BIS-10: High impulsivity >= 3.0, moderate >= 2.5
      const score = data.overall_impulsivity || 0;
      if (score >= 3.0) return 'error';
      if (score >= 2.5) return 'warning';
      return 'info';
    }
    
    if (code === 'WURS25') {
      // WURS-25: Clinical cutoff >= 36 suggests childhood ADHD
      if (data.adhd_likely || data.total_score >= 36) return 'warning';
      return 'info';
    }
    
    if (code === 'CSM') {
      // CSM: Chronotype classification (13-55)
      // Morning types (48-55) and evening types (13-21) are notable
      if (data.chronotype === 'definitely_morning' || data.chronotype === 'definitely_evening') return 'info';
      if (data.chronotype === 'moderately_morning' || data.chronotype === 'moderately_evening') return 'info';
      return 'info'; // All chronotypes are informational, not pathological
    }
    
    if (code === 'CTI') {
      // CTI: Circadian Type Inventory (11-55)
      // All circadian types are informational
      return 'info';
    }
    
    if (code === 'ALDA') {
      // ALDA: Total score 7-10 = good responder, 4-6 = partial, 0-3 = non-responder
      if (data.alda_score >= 7) return 'success';
      if (data.alda_score >= 4) return 'warning';
      return 'info';
    }
    
    if (code === 'CGI') {
      // CGI: Severity 1-2 = good, 3-4 = moderate, 5-7 = severe
      const severity = data.cgi_s;
      if (severity === 0) return 'info'; // Not assessed
      if (severity <= 2) return 'success';
      if (severity <= 4) return 'warning';
      return 'error';
    }
    
    if (code === 'WAIS4_MATRICES_FR') {
      // WAIS-IV Matrices: Standardized score 8-12 is average, <8 is below, >12 is above
      if (data.standardized_score >= 13) return 'success';
      if (data.standardized_score >= 8) return 'info';
      return 'warning';
    }
    
    if (code === 'CVLT_FR') {
      // CVLT: Use Total 1-5 standard score for severity
      const score = data.total_1_5_std;
      if (score === null || score === undefined) return 'info';
      if (score >= 0) return 'success';
      if (score >= -1) return 'info';
      return 'warning';
    }
    
    if (code === 'WAIS4_CODE_FR' || code === 'WAIS_IV_CODE_SYMBOLES_IVT') {
      // WAIS-IV Code/Symboles/IVT: Use IVT composite if available, else Code standard score
      if (data.wais_ivt !== null && data.wais_ivt !== undefined) {
        // IVT composite scoring: 50-150 scale, mean=100, SD=15
        if (data.wais_ivt >= 110) return 'success';  // High Average to Superior
        if (data.wais_ivt >= 90) return 'info';      // Average
        if (data.wais_ivt >= 80) return 'warning';   // Low Average
        return 'error';                              // Below 80 = Borderline or lower
      }
      // Fallback to Code standard score: 1-19 scale, mean=10, SD=3
      if (data.wais_cod_std >= 13) return 'success';
      if (data.wais_cod_std >= 8) return 'info';
      return 'warning';
    }
    
    if (code === 'PANSS') {
      // PANSS: Total score range 30-210
      // Severity based on total score thresholds
      const total = data.total_score;
      if (total === null || total === undefined) return 'info';
      if (total >= 96) return 'error';    // Severe
      if (total >= 76) return 'warning';  // Marked
      if (total >= 59) return 'warning';  // Moderate
      return 'info';                      // Mild (30-58)
    }

    if (code === 'CDSS') {
      // CDSS: Total score range 0-27
      // Clinical cutoff: >6 indicates depressive syndrome
      const total = data.total_score;
      if (total === null || total === undefined) return 'info';
      if (total > 6) return 'warning';    // Depressive syndrome present
      return 'success';                   // No significant depressive syndrome
    }

    if (code === 'BARS') {
      // BARS: Adherence percentage 0-100%
      const score = data.adherence_score;
      if (score === null || score === undefined) return 'info';
      if (score >= 91) return 'success';  // Bonne observance
      if (score >= 76) return 'info';     // Observance acceptable
      if (score >= 51) return 'warning';  // Observance partielle
      return 'error';                     // Observance tres faible
    }

    if (code === 'SUMD') {
      // SUMD: Insight scale - lower is better (1=conscient, 3=inconscient)
      // Check global awareness items (1-3)
      const c1 = data.conscience1;
      const c2 = data.conscience2;
      const c3 = data.conscience3;
      if (c1 === null && c2 === null && c3 === null) return 'info';
      // If any global awareness item shows lack of insight (3), warn
      if (c1 === 3 || c2 === 3 || c3 === 3) return 'warning';
      return 'info';
    }

    if (code === 'AIMS') {
      // AIMS: Movement score 0-28, higher = more severe dyskinesia
      const score = data.movement_score;
      if (score === null || score === undefined) return 'info';
      if (score >= 14) return 'error';   // Severe dyskinesia
      if (score >= 7) return 'warning';  // Moderate dyskinesia
      if (score > 0) return 'info';      // Minimal movements
      return 'success';                  // No abnormal movements
    }

    if (code === 'BARNES') {
      // Barnes: Global score 0-5, higher = more severe akathisia
      const score = data.global_score;
      if (score === null || score === undefined) return 'info';
      if (score >= 4) return 'error';    // Marked/Severe akathisia
      if (score >= 3) return 'warning';  // Moderate akathisia
      if (score >= 1) return 'info';     // Questionable/Mild
      return 'success';                  // No akathisia
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
  
  // Generate interpretation for ASRS if not present
  if (code === 'ASRS_FR' && !interpretation) {
    if (data.screening_positive) {
      interpretation = `Dépistage POSITIF (${data.part_a_positive_items || 0}/6 items Partie A ≥ seuil). Les réponses suggèrent des symptômes cohérents avec un TDAH chez l'adulte. Une évaluation clinique complète est recommandée.`;
    } else {
      interpretation = `Dépistage négatif (${data.part_a_positive_items || 0}/6 items Partie A ≥ seuil). Les réponses ne suggèrent pas de symptômes de TDAH basés sur les critères de dépistage de la Partie A.`;
    }
  }
  
  if (!interpretation) {
    // Use interpretation field if available, otherwise fallback to calculation
    interpretation = code === 'MDQ_FR' ? (data.interpretation || '') : '';
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
    
    // Use q1_score if available, otherwise sum Q1 items
    const q1Total = data.q1_score !== undefined ? data.q1_score : 
      ['q1_1', 'q1_2', 'q1_3', 'q1_4', 'q1_5', 'q1_6', 'q1_7', 
       'q1_8', 'q1_9', 'q1_10', 'q1_11', 'q1_12', 'q1_13']
      .reduce((acc, key) => acc + (data[key] || 0), 0);
    
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
              {code === 'ASRS_FR' && 'Résultat ASRS'}
              {code === 'CTQ_FR' && 'Résultats CTQ'}
              {code === 'BIS10_FR' && 'Résultats BIS-10'}
              {code === 'WURS25' && 'Résultats WURS-25'}
              {code === 'CSM' && 'Résultats CSM - Chronotype'}
              {code === 'CTI' && 'Résultats CTI - Type Circadien'}
              {code === 'ALDA' && 'Score Alda'}
              {code === 'CGI' && 'Résultats CGI'}
              {code === 'WAIS4_MATRICES_FR' && 'Résultats WAIS-IV Matrices'}
              {code === 'CVLT_FR' && 'Résultats CVLT'}
              {code === 'WAIS4_CODE_FR' && 'Résultats WAIS-IV Code'}
              {code === 'WAIS_IV_CODE_SYMBOLES_IVT' && 'Résultats WAIS-IV Code, Symboles & IVT'}
              {code === 'PANSS' && 'Résultats PANSS'}
              {code === 'CDSS' && 'Résultats CDSS - Échelle de Calgary'}
              {code === 'BARS' && 'Résultats BARS - Échelle d\'observance'}
              {code === 'SUMD' && 'Résultats SUMD - Conscience de la maladie'}
              {code === 'AIMS' && 'Résultats AIMS - Mouvements involontaires'}
              {code === 'BARNES' && 'Résultats BARNES - Akathisie'}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xl font-bold">
              {code === 'MDQ_FR' 
                ? (data.interpretation?.includes('Positif') ? 'POSITIF' : 'NÉGATIF')
                : code === 'ASRS_FR'
                ? (data.screening_positive ? 'POSITIF' : 'NÉGATIF')
                : code === 'CTQ_FR'
                ? (data.total_score !== undefined ? data.total_score : '-')
                : code === 'BIS10_FR'
                ? (data.overall_impulsivity !== undefined ? data.overall_impulsivity.toFixed(2) : '-')
                : code === 'WURS25'
                ? (data.adhd_likely ? 'POSITIF' : 'NÉGATIF')
                : code === 'CSM'
                ? (data.total_score !== undefined ? data.total_score : '-')
                : code === 'CTI'
                ? (data.total_score !== undefined ? data.total_score : '-')
                : code === 'ALDA'
                ? (data.alda_score !== undefined ? data.alda_score : '-')
                : code === 'CGI'
                ? (data.cgi_s !== undefined ? data.cgi_s : '-')
                : code === 'WAIS4_MATRICES_FR'
                ? (data.standardized_score !== undefined ? data.standardized_score : '-')
                : code === 'CVLT_FR'
                ? (data.total_1_5 !== undefined ? data.total_1_5 : '-')
                : code === 'WAIS4_CODE_FR'
                ? (data.wais_cod_std !== undefined ? data.wais_cod_std : '-')
                : code === 'WAIS_IV_CODE_SYMBOLES_IVT'
                ? (data.wais_ivt !== undefined && data.wais_ivt !== null ? data.wais_ivt : (data.wais_cod_std !== undefined ? data.wais_cod_std : '-'))
                : code === 'PANSS'
                ? (data.total_score !== undefined ? data.total_score : '-')
                : code === 'CDSS'
                ? (data.total_score !== undefined ? data.total_score : '-')
                : code === 'BARS'
                ? (data.adherence_score !== undefined ? data.adherence_score : '-')
                : code === 'SUMD'
                ? 'Voir details'
                : code === 'AIMS'
                ? (data.movement_score !== undefined ? data.movement_score : '-')
                : code === 'BARNES'
                ? (data.global_score !== undefined ? data.global_score : '-')
                : (data.total_score !== undefined ? data.total_score : '-')}
              {code === 'ASRM_FR' && '/20'}
              {code === 'QIDS_SR16_FR' && '/27'}
              {code === 'CTQ_FR' && '/125'}
              {code === 'BIS10_FR' && '/4.0'}
              {code === 'CSM' && '/55'}
              {code === 'CTI' && '/55'}
              {code === 'ALDA' && '/10'}
              {code === 'CGI' && '/7'}
              {code === 'WAIS4_MATRICES_FR' && '/19'}
              {code === 'CVLT_FR' && '/80'}
              {code === 'WAIS4_CODE_FR' && '/19'}
              {code === 'WAIS_IV_CODE_SYMBOLES_IVT' && (data.wais_ivt !== undefined && data.wais_ivt !== null ? '/150' : '/19')}
              {code === 'PANSS' && '/210'}
              {code === 'CDSS' && '/27'}
              {code === 'BARS' && '%'}
              {code === 'SUMD' && ''}
              {code === 'AIMS' && '/28'}
              {code === 'BARNES' && '/5'}
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

        {/* CGI Details */}
        {code === 'CGI' && (
          <div className="text-sm space-y-3 mt-2 pt-2 border-t">
            {/* CGI-S: Severity */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-1">CGI - 1ère partie : Gravité</h5>
              <div className="flex justify-between">
                <span className="text-gray-600">Gravité de la maladie:</span>
                <span className="font-semibold">
                  {data.cgi_s === 0 && 'Non évalué'}
                  {data.cgi_s === 1 && 'Normal, pas du tout malade'}
                  {data.cgi_s === 2 && 'A la limite'}
                  {data.cgi_s === 3 && 'Légèrement malade'}
                  {data.cgi_s === 4 && 'Modérément malade'}
                  {data.cgi_s === 5 && 'Manifestement malade'}
                  {data.cgi_s === 6 && 'Gravement malade'}
                  {data.cgi_s === 7 && 'Parmi les patients les plus malades'}
                  {data.cgi_s === undefined && '-'}
                </span>
              </div>
            </div>

            {/* CGI-I: Improvement (only show if filled) */}
            {data.cgi_i !== undefined && data.cgi_i !== null && (
              <div className="pt-2 border-t">
                <h5 className="font-semibold text-gray-700 mb-1">CGI - 2ème partie : Amélioration</h5>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amélioration globale:</span>
                  <span className="font-semibold">
                    {data.cgi_i === 0 && 'Non évalué'}
                    {data.cgi_i === 1 && 'Très fortement amélioré'}
                    {data.cgi_i === 2 && 'Fortement amélioré'}
                    {data.cgi_i === 3 && 'Légèrement amélioré'}
                    {data.cgi_i === 4 && 'Pas de changement'}
                    {data.cgi_i === 5 && 'Légèrement aggravé'}
                    {data.cgi_i === 6 && 'Fortement aggravé'}
                    {data.cgi_i === 7 && 'Très fortement aggravé'}
                  </span>
                </div>
              </div>
            )}

            {/* CGI - 3ème partie: Therapeutic Index (only show if calculated) */}
            {data.therapeutic_index !== undefined && data.therapeutic_index !== null && (
              <div className="pt-2 border-t">
                <h5 className="font-semibold text-gray-700 mb-1">CGI - 3ème partie : Index thérapeutique</h5>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Effet thérapeutique:</span>
                    <span className="font-semibold">
                      {data.therapeutic_effect === 0 && 'Non évalué'}
                      {data.therapeutic_effect === 1 && 'Important'}
                      {data.therapeutic_effect === 2 && 'Modéré'}
                      {data.therapeutic_effect === 3 && 'Minime'}
                      {data.therapeutic_effect === 4 && 'Nul ou aggravation'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Effets secondaires:</span>
                    <span className="font-semibold">
                      {data.side_effects === 0 && 'Aucun'}
                      {data.side_effects === 1 && "N'interfèrent pas"}
                      {data.side_effects === 2 && 'Interfèrent'}
                      {data.side_effects === 3 && 'Dépassent'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between pt-2 mt-2 border-t">
                  <span className="text-gray-600 font-medium">Score Index:</span>
                  <span className="font-bold text-lg">{data.therapeutic_index}/16</span>
                </div>
                {data.therapeutic_index_label && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interprétation:</span>
                    <span className="font-semibold">{data.therapeutic_index_label}</span>
                  </div>
                )}
              </div>
            )}
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
              <span className="font-semibold">{data.q2 === 1 ? 'Oui' : 'Non'}</span>
            </div>
            <div className="flex justify-between">
              <span>Impact (Q3):</span>
              <span className="font-semibold">{mdqDetails.impactLabel}</span>
            </div>
          </div>
        )}

        {/* ASRS Details */}
        {code === 'ASRS_FR' && (
          <div className="text-sm space-y-2 mt-2 pt-2 border-t">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Items Partie A ≥ seuil:</span>
                <span className="font-semibold">{data.part_a_positive_items ?? '-'}/6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Score Total (18 items):</span>
                <span className="font-semibold">{data.total_score ?? '-'}/72</span>
              </div>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600 font-medium">Dépistage:</span>
              <span className={`font-bold text-lg ${data.screening_positive ? 'text-orange-700' : 'text-blue-700'}`}>
                {data.screening_positive ? 'POSITIF' : 'Négatif'}
              </span>
            </div>
            {data.screening_positive && (
              <p className="text-xs text-gray-600 mt-1 pt-2 border-t">
                Un résultat positif suggère des symptômes cohérents avec un TDAH chez l'adulte. Une évaluation clinique complète est recommandée.
              </p>
            )}
          </div>
        )}

        {/* CTQ Details */}
        {code === 'CTQ_FR' && (
          <div className="text-sm space-y-3 mt-2 pt-2 border-t">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Abus émotionnel:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{data.emotional_abuse_score ?? '-'}/25</span>
                  <Badge variant={data.emotional_abuse_severity === 'severe' ? 'destructive' : 'secondary'} className={`text-xs ${data.emotional_abuse_severity === 'moderate' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}`}>
                    {data.emotional_abuse_severity === 'no_trauma' ? 'Absent' : data.emotional_abuse_severity === 'low' ? 'Faible' : data.emotional_abuse_severity === 'moderate' ? 'Modéré' : data.emotional_abuse_severity === 'severe' ? 'Sévère' : '-'}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Abus physique:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{data.physical_abuse_score ?? '-'}/25</span>
                  <Badge variant={data.physical_abuse_severity === 'severe' ? 'destructive' : 'secondary'} className={`text-xs ${data.physical_abuse_severity === 'moderate' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}`}>
                    {data.physical_abuse_severity === 'no_trauma' ? 'Absent' : data.physical_abuse_severity === 'low' ? 'Faible' : data.physical_abuse_severity === 'moderate' ? 'Modéré' : data.physical_abuse_severity === 'severe' ? 'Sévère' : '-'}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Abus sexuel:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{data.sexual_abuse_score ?? '-'}/25</span>
                  <Badge variant={data.sexual_abuse_severity === 'severe' ? 'destructive' : 'secondary'} className={`text-xs ${data.sexual_abuse_severity === 'moderate' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}`}>
                    {data.sexual_abuse_severity === 'no_trauma' ? 'Absent' : data.sexual_abuse_severity === 'low' ? 'Faible' : data.sexual_abuse_severity === 'moderate' ? 'Modéré' : data.sexual_abuse_severity === 'severe' ? 'Sévère' : '-'}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Négligence émotionnelle:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{data.emotional_neglect_score ?? '-'}/25</span>
                  <Badge variant={data.emotional_neglect_severity === 'severe' ? 'destructive' : 'secondary'} className={`text-xs ${data.emotional_neglect_severity === 'moderate' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}`}>
                    {data.emotional_neglect_severity === 'no_trauma' ? 'Absent' : data.emotional_neglect_severity === 'low' ? 'Faible' : data.emotional_neglect_severity === 'moderate' ? 'Modéré' : data.emotional_neglect_severity === 'severe' ? 'Sévère' : '-'}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Négligence physique:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{data.physical_neglect_score ?? '-'}/25</span>
                  <Badge variant={data.physical_neglect_severity === 'severe' ? 'destructive' : 'secondary'} className={`text-xs ${data.physical_neglect_severity === 'moderate' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}`}>
                    {data.physical_neglect_severity === 'no_trauma' ? 'Absent' : data.physical_neglect_severity === 'low' ? 'Faible' : data.physical_neglect_severity === 'moderate' ? 'Modéré' : data.physical_neglect_severity === 'severe' ? 'Sévère' : '-'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600 font-medium">Déni/Minimisation:</span>
              <span className={`font-bold ${data.denial_score > 0 ? 'text-orange-700' : 'text-green-700'}`}>
                {data.denial_score ?? '-'}/3
              </span>
            </div>
            {data.denial_score > 0 && (
              <p className="text-xs text-orange-700 mt-1 pt-2 border-t">
                Présence de déni ou minimisation détectée. Les résultats doivent être interprétés avec prudence.
              </p>
            )}
          </div>
        )}

        {/* BIS-10 Details */}
        {code === 'BIS10_FR' && (
          <div className="text-sm space-y-2 mt-2 pt-2 border-t">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Impulsivité cognitive:</span>
                <span className="font-semibold">{data.cognitive_impulsivity_mean !== undefined ? data.cognitive_impulsivity_mean.toFixed(2) : '-'}/4.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Impulsivité motrice:</span>
                <span className="font-semibold">{data.behavioral_impulsivity_mean !== undefined ? data.behavioral_impulsivity_mean.toFixed(2) : '-'}/4.0</span>
              </div>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600 font-medium">Impulsivité générale:</span>
              <span className="font-bold text-lg">{data.overall_impulsivity !== undefined ? data.overall_impulsivity.toFixed(2) : '-'}/4.0</span>
            </div>
            {data.overall_impulsivity >= 3.0 && (
              <p className="text-xs text-red-700 mt-1 pt-2 border-t">
                Niveau d'impulsivité élevé. Une évaluation clinique plus approfondie peut être recommandée.
              </p>
            )}
            {data.overall_impulsivity >= 2.5 && data.overall_impulsivity < 3.0 && (
              <p className="text-xs text-orange-700 mt-1 pt-2 border-t">
                Niveau d'impulsivité modéré à élevé.
              </p>
            )}
          </div>
        )}

        {/* WURS-25 Details */}
        {code === 'WURS25' && (
          <div className="text-sm space-y-2 mt-2 pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Score total:</span>
              <span className="font-semibold">{data.total_score ?? '-'}/100</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Seuil clinique:</span>
              <span className="font-semibold">36</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600 font-medium">TDAH dans l'enfance:</span>
              <span className={`font-bold text-lg ${data.adhd_likely ? 'text-orange-700' : 'text-blue-700'}`}>
                {data.adhd_likely ? 'Probable' : 'Peu probable'}
              </span>
            </div>
            {data.adhd_likely && (
              <p className="text-xs text-orange-700 mt-1 pt-2 border-t">
                Le score suggère la présence de symptômes de TDAH dans l'enfance (avant 12 ans). Une évaluation clinique complète est recommandée pour le diagnostic de TDAH chez l'adulte.
              </p>
            )}
            {!data.adhd_likely && (
              <p className="text-xs text-blue-700 mt-1 pt-2 border-t">
                Le score ne suggère pas de symptômes significatifs de TDAH dans l'enfance.
              </p>
            )}
          </div>
        )}

        {/* CSM Details */}
        {code === 'CSM' && (
          <div className="text-sm space-y-2 mt-2 pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Score total:</span>
              <span className="font-semibold">{data.total_score ?? '-'}/55</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600 font-medium">Chronotype:</span>
              <span className="font-bold text-lg text-blue-700">
                {data.chronotype === 'definitely_morning' && 'Nettement matinal'}
                {data.chronotype === 'moderately_morning' && 'Modérément matinal'}
                {data.chronotype === 'intermediate' && 'Intermédiaire'}
                {data.chronotype === 'moderately_evening' && 'Modérément vespéral'}
                {data.chronotype === 'definitely_evening' && 'Nettement vespéral'}
                {!data.chronotype && '-'}
              </span>
            </div>
            <div className="text-xs text-gray-600 mt-2 pt-2 border-t space-y-1">
              <p><strong>Echelle:</strong> 13-21 (vespéral), 22-28 (mod. vespéral), 29-41 (intermédiaire), 42-47 (mod. matinal), 48-55 (matinal)</p>
              <p>Le chronotype peut être perturbé dans le trouble bipolaire. Les types vespéraux sont souvent associés aux épisodes dépressifs.</p>
            </div>
          </div>
        )}

        {/* CTI Details */}
        {code === 'CTI' && (
          <div className="text-sm space-y-2 mt-2 pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Score total:</span>
              <span className="font-semibold">{data.total_score ?? '-'}/55</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Flexibilité:</span>
                <span className="font-semibold">{data.flexibility_score ?? '-'}/25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Languide:</span>
                <span className="font-semibold">{data.languid_score ?? '-'}/30</span>
              </div>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600 font-medium">Type circadien:</span>
              <span className="font-bold text-lg text-blue-700">
                {data.circadian_type === 'morning' && 'Type matinal'}
                {data.circadian_type === 'intermediate' && 'Type intermédiaire'}
                {data.circadian_type === 'evening' && 'Type vespéral'}
                {!data.circadian_type && '-'}
              </span>
            </div>
            <div className="text-xs text-gray-600 mt-2 pt-2 border-t space-y-1">
              <p><strong>Echelle:</strong> Score &lt;28 (matinal), 28-37 (intermédiaire), &ge;38 (vespéral)</p>
              <p><strong>Flexibilité:</strong> Capacité d'adaptation aux changements d'horaires. <strong>Languide:</strong> Tendance à la fatigue et au besoin de sommeil.</p>
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

        {/* CVLT Details */}
        {code === 'CVLT_FR' && (
          <div className="text-sm space-y-3 mt-2 pt-2 border-t">
            {/* Demographics */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Age:</span>
                <span className="font-medium">{data.patient_age ?? '-'} ans</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Education:</span>
                <span className="font-medium">{data.years_of_education ?? '-'} ans</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sexe:</span>
                <span className="font-medium">{data.patient_sex === 'F' ? 'Femme' : 'Homme'}</span>
              </div>
            </div>

            {/* Learning Scores */}
            <div className="pt-2 border-t">
              <h5 className="font-semibold text-gray-700 mb-2">Apprentissage</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Essai 1 (brut/std):</span>
                  <span className="font-medium">{data.trial_1 ?? '-'} / {data.trial_1_std ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Essai 5 (brut/std):</span>
                  <span className="font-medium">{data.trial_5 ?? '-'} / {data.trial_5_std ?? '-'}</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-gray-500">Total 1-5 (brut/std):</span>
                  <span className="font-semibold">{data.total_1_5 ?? '-'} / {data.total_1_5_std ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Liste B (brut/std):</span>
                  <span className="font-medium">{data.list_b ?? '-'} / {data.list_b_std ?? '-'}</span>
                </div>
              </div>
            </div>

            {/* Recall Scores */}
            <div className="pt-2 border-t">
              <h5 className="font-semibold text-gray-700 mb-2">Rappel</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">SDFR (brut/std):</span>
                  <span className="font-medium">{data.sdfr ?? '-'} / {data.sdfr_std ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">SDCR (brut/std):</span>
                  <span className="font-medium">{data.sdcr ?? '-'} / {data.sdcr_std ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">LDFR (brut/std):</span>
                  <span className="font-medium">{data.ldfr ?? '-'} / {data.ldfr_std ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">LDCR (brut/std):</span>
                  <span className="font-medium">{data.ldcr ?? '-'} / {data.ldcr_std ?? '-'}</span>
                </div>
              </div>
            </div>

            {/* Strategy & Errors (only show if present) */}
            {(data.semantic_std || data.serial_std || data.persev_std || data.intru_std) && (
              <div className="pt-2 border-t">
                <h5 className="font-semibold text-gray-700 mb-2">Strategie et Erreurs</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {data.semantic_std && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Semantique (std):</span>
                      <span className="font-medium">{data.semantic_std}</span>
                    </div>
                  )}
                  {data.serial_std && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Seriel (std):</span>
                      <span className="font-medium">{data.serial_std}</span>
                    </div>
                  )}
                  {data.persev_std && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Perseverations (std):</span>
                      <span className="font-medium">{data.persev_std}</span>
                    </div>
                  )}
                  {data.intru_std && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Intrusions (std):</span>
                      <span className="font-medium">{data.intru_std}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* WAIS-IV Code Details */}
        {code === 'WAIS4_CODE_FR' && (
          <div className="text-sm space-y-2 mt-2 pt-2 border-t">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Reponses correctes:</span>
                <span className="font-semibold">{data.wais_cod_tot ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Erreurs:</span>
                <span className="font-semibold">{data.wais_cod_err ?? '-'}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Note Brute:</span>
                <span className="font-semibold">{data.wais_cod_brut ?? '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Note Standard:</span>
                <span className="font-semibold">{data.wais_cod_std ?? '-'}/19</span>
              </div>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600">Age du patient:</span>
              <span className="font-semibold">{data.patient_age ?? '-'} ans</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Z-Score (Valeur CR):</span>
              <span className="font-bold text-lg">{data.wais_cod_cr !== null && data.wais_cod_cr !== undefined ? data.wais_cod_cr : '-'}</span>
            </div>
          </div>
        )}

        {/* WAIS-IV Code, Symboles & IVT Details */}
        {code === 'WAIS_IV_CODE_SYMBOLES_IVT' && (
          <div className="text-sm space-y-3 mt-2 pt-2 border-t">
            {/* Code Subtest */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Subtest Code</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Reponses correctes:</span>
                  <span className="font-medium">{data.wais_cod_tot ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Erreurs:</span>
                  <span className="font-medium">{data.wais_cod_err ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Note Brute:</span>
                  <span className="font-medium">{data.wais_cod_brut ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Note Standard:</span>
                  <span className="font-semibold">{data.wais_cod_std ?? '-'}/19</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-gray-500">Z-Score:</span>
                  <span className="font-medium">{data.wais_cod_cr !== null && data.wais_cod_cr !== undefined ? data.wais_cod_cr : '-'}</span>
                </div>
              </div>
            </div>

            {/* Symboles Subtest (only show if data available) */}
            {(data.wais_symb_tot !== null && data.wais_symb_tot !== undefined) && (
              <div className="pt-2 border-t">
                <h5 className="font-semibold text-gray-700 mb-2">Subtest Symboles</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reponses correctes:</span>
                    <span className="font-medium">{data.wais_symb_tot ?? '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Erreurs:</span>
                    <span className="font-medium">{data.wais_symb_err ?? '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Note Brute:</span>
                    <span className="font-medium">{data.wais_symb_brut ?? '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Note Standard:</span>
                    <span className="font-semibold">{data.wais_symb_std ?? '-'}/19</span>
                  </div>
                  <div className="flex justify-between col-span-2">
                    <span className="text-gray-500">Z-Score:</span>
                    <span className="font-medium">{data.wais_symb_cr !== null && data.wais_symb_cr !== undefined ? data.wais_symb_cr : '-'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* IVT Composite (only show if both subtests completed) */}
            {(data.wais_ivt !== null && data.wais_ivt !== undefined) && (
              <div className="pt-2 border-t">
                <h5 className="font-semibold text-gray-700 mb-2">Indice de Vitesse de Traitement (IVT)</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Somme Notes Std:</span>
                    <span className="font-medium">{data.wais_somme_ivt ?? '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Score IVT:</span>
                    <span className="font-semibold">{data.wais_ivt ?? '-'}/150</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rang Percentile:</span>
                    <span className="font-medium">{data.wais_ivt_rang ?? '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">IC 95%:</span>
                    <span className="font-medium">{data.wais_ivt_95 ?? '-'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Demographics */}
            <div className="pt-2 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Age du patient:</span>
                <span className="font-semibold">{data.patient_age ?? '-'} ans</span>
              </div>
            </div>
          </div>
        )}

        {/* PANSS Details */}
        {code === 'PANSS' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Core PANSS Scores */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Scores canoniques PANSS</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Symptomes positifs (P1-P7):</span>
                  <span className="font-semibold">{data.positive_score ?? '-'}/49</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Symptomes negatifs (N1-N7):</span>
                  <span className="font-semibold">{data.negative_score ?? '-'}/49</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Psychopathologie generale (G1-G16):</span>
                  <span className="font-semibold">{data.general_score ?? '-'}/112</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-gray-600 font-medium">Score Total PANSS:</span>
                  <span className="font-bold text-lg">{data.total_score ?? '-'}/210</span>
                </div>
              </div>
            </div>

            {/* Wallwork 2012 Five-Factor Model */}
            <div className="pt-2 border-t">
              <h5 className="font-semibold text-gray-700 mb-2">Modele a 5 facteurs - Wallwork 2012</h5>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Positif:</span>
                  <span className="font-medium">{data.wallwork_positive ?? '-'}/28</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Negatif:</span>
                  <span className="font-medium">{data.wallwork_negative ?? '-'}/42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Desorganise:</span>
                  <span className="font-medium">{data.wallwork_disorganized ?? '-'}/21</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Excite:</span>
                  <span className="font-medium">{data.wallwork_excited ?? '-'}/28</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Depressif:</span>
                  <span className="font-medium">{data.wallwork_depressed ?? '-'}/21</span>
                </div>
              </div>
            </div>

            {/* Lancon 1998 Five-Factor Model */}
            <div className="pt-2 border-t">
              <h5 className="font-semibold text-gray-700 mb-2">Modele a 5 facteurs - Lancon 1998</h5>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Positif:</span>
                  <span className="font-medium">{data.lancon_positive ?? '-'}/35</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Negatif:</span>
                  <span className="font-medium">{data.lancon_negative ?? '-'}/49</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Desorganise:</span>
                  <span className="font-medium">{data.lancon_disorganized ?? '-'}/21</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Excite:</span>
                  <span className="font-medium">{data.lancon_excited ?? '-'}/35</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Depressif:</span>
                  <span className="font-medium">{data.lancon_depressed ?? '-'}/28</span>
                </div>
              </div>
            </div>

            {/* Van der Gaag 2006 Five-Factor Model */}
            <div className="pt-2 border-t">
              <h5 className="font-semibold text-gray-700 mb-2">Modele a 5 facteurs - Van der Gaag 2006</h5>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Positif:</span>
                  <span className="font-medium">{data.vandergaag_positive ?? '-'}/35</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Negatif:</span>
                  <span className="font-medium">{data.vandergaag_negative ?? '-'}/56</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Desorganise:</span>
                  <span className="font-medium">{data.vandergaag_disorganized ?? '-'}/56</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Excite:</span>
                  <span className="font-medium">{data.vandergaag_excited ?? '-'}/28</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Depressif:</span>
                  <span className="font-medium">{data.vandergaag_depressed ?? '-'}/28</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CDSS Details */}
        {code === 'CDSS' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Clinical Interpretation */}
            <div className={`p-3 rounded-lg ${
              data.has_depressive_syndrome 
                ? 'bg-amber-50 border border-amber-200' 
                : 'bg-green-50 border border-green-200'
            }`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {data.has_depressive_syndrome 
                    ? 'Syndrome depressif present' 
                    : 'Pas de syndrome depressif significatif'}
                </span>
                <span className="text-xs text-gray-500">(Seuil clinique: {'>'}6)</span>
              </div>
            </div>

            {/* Item Scores */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Scores par item</h5>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">1. Depression:</span>
                  <span className="font-medium">{data.q1 ?? '-'}/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">2. Desespoir:</span>
                  <span className="font-medium">{data.q2 ?? '-'}/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">3. Auto-depreciation:</span>
                  <span className="font-medium">{data.q3 ?? '-'}/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">4. Idees de reference:</span>
                  <span className="font-medium">{data.q4 ?? '-'}/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">5. Culpabilite pathologique:</span>
                  <span className="font-medium">{data.q5 ?? '-'}/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">6. Depression matinale:</span>
                  <span className="font-medium">{data.q6 ?? '-'}/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">7. Eveil precoce:</span>
                  <span className="font-medium">{data.q7 ?? '-'}/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">8. Suicide:</span>
                  <span className="font-medium">{data.q8 ?? '-'}/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">9. Depression observee:</span>
                  <span className="font-medium">{data.q9 ?? '-'}/3</span>
                </div>
              </div>
            </div>

            {/* Total Score */}
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600 font-medium">Score Total:</span>
              <span className="font-bold text-lg">{data.total_score ?? '-'}/27</span>
            </div>
          </div>
        )}

        {/* BARS Details */}
        {code === 'BARS' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Clinical Interpretation */}
            <div className={`p-3 rounded-lg ${
              data.adherence_score !== undefined && data.adherence_score !== null
                ? data.adherence_score >= 91
                  ? 'bg-green-50 border border-green-200'
                  : data.adherence_score >= 76
                  ? 'bg-blue-50 border border-blue-200'
                  : data.adherence_score >= 51
                  ? 'bg-amber-50 border border-amber-200'
                  : 'bg-red-50 border border-red-200'
                : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="text-center">
                <span className="font-medium">
                  {data.interpretation ?? 'Questionnaire incomplet'}
                </span>
              </div>
            </div>

            {/* Item Details */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Details des reponses</h5>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Doses prescrites par jour:</span>
                  <span className="font-medium">{data.q1 ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jours sans traitement (30 derniers jours):</span>
                  <span className="font-medium">{data.q2 ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jours avec dose reduite (30 derniers jours):</span>
                  <span className="font-medium">{data.q3 ?? '-'}</span>
                </div>
              </div>
            </div>

            {/* Adherence Score */}
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600 font-medium">Estimation de l'observance:</span>
              <span className="font-bold text-lg">{data.adherence_score ?? '-'}%</span>
            </div>
          </div>
        )}

        {/* SUMD Details */}
        {code === 'SUMD' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Global Awareness (Items 1-3) */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Conscience globale (Items 1-3)</h5>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">1. Trouble mental:</span>
                  <span className={`font-medium ${data.conscience1 === 3 ? 'text-amber-600' : data.conscience1 === 1 ? 'text-green-600' : ''}`}>
                    {data.conscience1 === 0 ? 'Non cotable' : data.conscience1 === 1 ? 'Conscient' : data.conscience1 === 2 ? 'Partiel' : data.conscience1 === 3 ? 'Inconscient' : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">2. Consequences du trouble:</span>
                  <span className={`font-medium ${data.conscience2 === 3 ? 'text-amber-600' : data.conscience2 === 1 ? 'text-green-600' : ''}`}>
                    {data.conscience2 === 0 ? 'Non cotable' : data.conscience2 === 1 ? 'Conscient' : data.conscience2 === 2 ? 'Partiel' : data.conscience2 === 3 ? 'Inconscient' : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">3. Effets du traitement:</span>
                  <span className={`font-medium ${data.conscience3 === 3 ? 'text-amber-600' : data.conscience3 === 1 ? 'text-green-600' : ''}`}>
                    {data.conscience3 === 0 ? 'Non cotable' : data.conscience3 === 1 ? 'Conscient' : data.conscience3 === 2 ? 'Partiel' : data.conscience3 === 3 ? 'Inconscient' : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Symptom-specific Awareness (Items 4-9) */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Conscience des symptomes (Items 4-9)</h5>
              <div className="space-y-3">
                {/* Item 4: Hallucinations */}
                <div className="border-l-2 border-gray-200 pl-3">
                  <div className="font-medium text-gray-700 mb-1">4. Experience hallucinatoire</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Conscience:</span>
                      <span className={data.conscience4 === 3 ? 'text-amber-600' : data.conscience4 === 1 ? 'text-green-600' : ''}>
                        {data.conscience4 === 0 ? 'NC' : data.conscience4 === 1 ? 'Oui' : data.conscience4 === 2 ? 'Partiel' : data.conscience4 === 3 ? 'Non' : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Attribution:</span>
                      <span className={data.attribu4 === 3 ? 'text-amber-600' : data.attribu4 === 1 ? 'text-green-600' : ''}>
                        {data.attribu4 === 0 ? 'NC' : data.attribu4 === 1 ? 'Correcte' : data.attribu4 === 2 ? 'Partielle' : data.attribu4 === 3 ? 'Incorrecte' : '-'}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Item 5: Delire */}
                <div className="border-l-2 border-gray-200 pl-3">
                  <div className="font-medium text-gray-700 mb-1">5. Delire</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Conscience:</span>
                      <span className={data.conscience5 === 3 ? 'text-amber-600' : data.conscience5 === 1 ? 'text-green-600' : ''}>
                        {data.conscience5 === 0 ? 'NC' : data.conscience5 === 1 ? 'Oui' : data.conscience5 === 2 ? 'Partiel' : data.conscience5 === 3 ? 'Non' : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Attribution:</span>
                      <span className={data.attribu5 === 3 ? 'text-amber-600' : data.attribu5 === 1 ? 'text-green-600' : ''}>
                        {data.attribu5 === 0 ? 'NC' : data.attribu5 === 1 ? 'Correcte' : data.attribu5 === 2 ? 'Partielle' : data.attribu5 === 3 ? 'Incorrecte' : '-'}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Item 6: Trouble de la pensee */}
                <div className="border-l-2 border-gray-200 pl-3">
                  <div className="font-medium text-gray-700 mb-1">6. Trouble de la pensee</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Conscience:</span>
                      <span className={data.conscience6 === 3 ? 'text-amber-600' : data.conscience6 === 1 ? 'text-green-600' : ''}>
                        {data.conscience6 === 0 ? 'NC' : data.conscience6 === 1 ? 'Oui' : data.conscience6 === 2 ? 'Partiel' : data.conscience6 === 3 ? 'Non' : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Attribution:</span>
                      <span className={data.attribu6 === 3 ? 'text-amber-600' : data.attribu6 === 1 ? 'text-green-600' : ''}>
                        {data.attribu6 === 0 ? 'NC' : data.attribu6 === 1 ? 'Correcte' : data.attribu6 === 2 ? 'Partielle' : data.attribu6 === 3 ? 'Incorrecte' : '-'}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Item 7: Emoussement affectif */}
                <div className="border-l-2 border-gray-200 pl-3">
                  <div className="font-medium text-gray-700 mb-1">7. Emoussement affectif</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Conscience:</span>
                      <span className={data.conscience7 === 3 ? 'text-amber-600' : data.conscience7 === 1 ? 'text-green-600' : ''}>
                        {data.conscience7 === 0 ? 'NC' : data.conscience7 === 1 ? 'Oui' : data.conscience7 === 2 ? 'Partiel' : data.conscience7 === 3 ? 'Non' : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Attribution:</span>
                      <span className={data.attribu7 === 3 ? 'text-amber-600' : data.attribu7 === 1 ? 'text-green-600' : ''}>
                        {data.attribu7 === 0 ? 'NC' : data.attribu7 === 1 ? 'Correcte' : data.attribu7 === 2 ? 'Partielle' : data.attribu7 === 3 ? 'Incorrecte' : '-'}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Item 8: Anhedonie */}
                <div className="border-l-2 border-gray-200 pl-3">
                  <div className="font-medium text-gray-700 mb-1">8. Anhedonie</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Conscience:</span>
                      <span className={data.conscience8 === 3 ? 'text-amber-600' : data.conscience8 === 1 ? 'text-green-600' : ''}>
                        {data.conscience8 === 0 ? 'NC' : data.conscience8 === 1 ? 'Oui' : data.conscience8 === 2 ? 'Partiel' : data.conscience8 === 3 ? 'Non' : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Attribution:</span>
                      <span className={data.attribu8 === 3 ? 'text-amber-600' : data.attribu8 === 1 ? 'text-green-600' : ''}>
                        {data.attribu8 === 0 ? 'NC' : data.attribu8 === 1 ? 'Correcte' : data.attribu8 === 2 ? 'Partielle' : data.attribu8 === 3 ? 'Incorrecte' : '-'}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Item 9: Asociabilite */}
                <div className="border-l-2 border-gray-200 pl-3">
                  <div className="font-medium text-gray-700 mb-1">9. Asociabilite</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Conscience:</span>
                      <span className={data.conscience9 === 3 ? 'text-amber-600' : data.conscience9 === 1 ? 'text-green-600' : ''}>
                        {data.conscience9 === 0 ? 'NC' : data.conscience9 === 1 ? 'Oui' : data.conscience9 === 2 ? 'Partiel' : data.conscience9 === 3 ? 'Non' : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Attribution:</span>
                      <span className={data.attribu9 === 3 ? 'text-amber-600' : data.attribu9 === 1 ? 'text-green-600' : ''}>
                        {data.attribu9 === 0 ? 'NC' : data.attribu9 === 1 ? 'Correcte' : data.attribu9 === 2 ? 'Partielle' : data.attribu9 === 3 ? 'Incorrecte' : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p>NC = Non cotable | Conscience: 1=Conscient, 2=Partiel, 3=Inconscient</p>
              <p>Attribution: 1=Correcte, 2=Partielle, 3=Incorrecte</p>
            </div>
          </div>
        )}

        {/* AIMS Details */}
        {code === 'AIMS' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Interpretation */}
            {data.interpretation && (
              <div className={`p-3 rounded-lg text-center font-medium ${
                data.movement_score !== null && data.movement_score >= 14
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : data.movement_score !== null && data.movement_score >= 7
                  ? 'bg-amber-50 border border-amber-200 text-amber-800'
                  : data.movement_score !== null && data.movement_score > 0
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : 'bg-green-50 border border-green-200 text-green-800'
              }`}>
                {data.interpretation}
              </div>
            )}

            {/* Orofacial Movements */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Mouvements orofaciaux</h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">1. Muscles faciaux:</span>
                  <span className={`font-medium ${data.q1 !== null && data.q1 >= 3 ? 'text-amber-600' : data.q1 === 0 ? 'text-green-600' : ''}`}>
                    {data.q1 ?? '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">2. Levres:</span>
                  <span className={`font-medium ${data.q2 !== null && data.q2 >= 3 ? 'text-amber-600' : data.q2 === 0 ? 'text-green-600' : ''}`}>
                    {data.q2 ?? '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">3. Machoires:</span>
                  <span className={`font-medium ${data.q3 !== null && data.q3 >= 3 ? 'text-amber-600' : data.q3 === 0 ? 'text-green-600' : ''}`}>
                    {data.q3 ?? '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">4. Langue:</span>
                  <span className={`font-medium ${data.q4 !== null && data.q4 >= 3 ? 'text-amber-600' : data.q4 === 0 ? 'text-green-600' : ''}`}>
                    {data.q4 ?? '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Extremity and Trunk Movements */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Extremites et tronc</h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">5. Membres sup:</span>
                  <span className={`font-medium ${data.q5 !== null && data.q5 >= 3 ? 'text-amber-600' : data.q5 === 0 ? 'text-green-600' : ''}`}>
                    {data.q5 ?? '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">6. Membres inf:</span>
                  <span className={`font-medium ${data.q6 !== null && data.q6 >= 3 ? 'text-amber-600' : data.q6 === 0 ? 'text-green-600' : ''}`}>
                    {data.q6 ?? '-'}
                  </span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="text-gray-600">7. Cou/epaules/hanches:</span>
                  <span className={`font-medium ${data.q7 !== null && data.q7 >= 3 ? 'text-amber-600' : data.q7 === 0 ? 'text-green-600' : ''}`}>
                    {data.q7 ?? '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Global Judgments */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Jugements globaux</h5>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">8. Gravite globale:</span>
                  <span className={`font-medium ${data.q8 !== null && data.q8 >= 3 ? 'text-amber-600' : data.q8 === 0 ? 'text-green-600' : ''}`}>
                    {data.q8 === 0 ? 'Aucun' : data.q8 === 1 ? 'Minime' : data.q8 === 2 ? 'Leger' : data.q8 === 3 ? 'Moyen' : data.q8 === 4 ? 'Grave' : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">9. Incapacite:</span>
                  <span className={`font-medium ${data.q9 !== null && data.q9 >= 3 ? 'text-amber-600' : data.q9 === 0 ? 'text-green-600' : ''}`}>
                    {data.q9 === 0 ? 'Aucune' : data.q9 === 1 ? 'Minime' : data.q9 === 2 ? 'Legere' : data.q9 === 3 ? 'Moderee' : data.q9 === 4 ? 'Grave' : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">10. Conscience du patient:</span>
                  <span className="font-medium">
                    {data.q10 === 0 ? 'Aucune' : data.q10 === 1 ? 'Pas de gene' : data.q10 === 2 ? 'Gene legere' : data.q10 === 3 ? 'Gene moderee' : data.q10 === 4 ? 'Detresse grave' : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dental Status */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Etat dentaire</h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">11. Problemes dentaires:</span>
                  <span className="font-medium">{data.q11 === 0 ? 'Oui' : data.q11 === 1 ? 'Non' : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">12. Porte prothese:</span>
                  <span className="font-medium">{data.q12 === 0 ? 'Oui' : data.q12 === 1 ? 'Non' : '-'}</span>
                </div>
              </div>
            </div>

            {/* Movement Score */}
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600 font-medium">Score de mouvement (items 1-7):</span>
              <span className="font-bold text-lg">{data.movement_score ?? '-'}/28</span>
            </div>

            {/* Legend */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p>Echelle de severite: 0=Aucun, 1=Minime, 2=Leger, 3=Moyen, 4=Grave</p>
            </div>
          </div>
        )}

        {/* BARNES Details */}
        {code === 'BARNES' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Interpretation */}
            {data.interpretation && (
              <div className={`p-3 rounded-lg text-center font-medium ${
                data.global_score !== null && data.global_score >= 4
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : data.global_score !== null && data.global_score >= 3
                  ? 'bg-amber-50 border border-amber-200 text-amber-800'
                  : data.global_score !== null && data.global_score >= 1
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : 'bg-green-50 border border-green-200 text-green-800'
              }`}>
                {data.interpretation}
              </div>
            )}

            {/* Objective Rating */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Cotation objective</h5>
              <div className="flex justify-between">
                <span className="text-gray-600">Manifestations motrices:</span>
                <span className={`font-medium ${
                  data.q1 !== null && data.q1 >= 2 ? 'text-amber-600' : data.q1 === 0 ? 'text-green-600' : ''
                }`}>
                  {data.q1 === 0 ? 'Normal' : data.q1 === 1 ? 'Leger' : data.q1 === 2 ? 'Modere' : data.q1 === 3 ? 'Severe' : '-'}
                </span>
              </div>
            </div>

            {/* Subjective Rating */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Cotation subjective</h5>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Conscience de l'agitation:</span>
                  <span className={`font-medium ${
                    data.q2 !== null && data.q2 >= 2 ? 'text-amber-600' : data.q2 === 0 ? 'text-green-600' : ''
                  }`}>
                    {data.q2 === 0 ? 'Absence' : data.q2 === 1 ? 'Leger' : data.q2 === 2 ? 'Modere' : data.q2 === 3 ? 'Severe' : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Detresse:</span>
                  <span className={`font-medium ${
                    data.q3 !== null && data.q3 >= 2 ? 'text-amber-600' : data.q3 === 0 ? 'text-green-600' : ''
                  }`}>
                    {data.q3 === 0 ? 'Pas de detresse' : data.q3 === 1 ? 'Legere' : data.q3 === 2 ? 'Moyenne' : data.q3 === 3 ? 'Grave' : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Scores */}
            <div className="pt-2 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Score obj+subj (items 1-3):</span>
                  <span className="font-bold">{data.objective_subjective_score ?? '-'}/9</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Score global (item 4):</span>
                  <span className="font-bold text-lg">{data.global_score ?? '-'}/5</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p>Score global: 0=Absence, 1=Douteux, 2=Legere, 3=Moyenne, 4=Marquee, 5=Severe</p>
              <p className="mt-1">Note: Mouvements sans agitation subjective = pseudo-akathisie (score 0)</p>
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
