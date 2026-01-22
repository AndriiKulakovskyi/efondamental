"use client";

import { AlertCircle, AlertTriangle, Info, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ScoreDisplayProps {
  code: string;
  data: any; // DB Row
}

// Helper function to get severity label for CTQ (handles both old and new formats)
function getSeverityLabel(severity: string | null | undefined): string {
  if (!severity) return '-';
  // Handle new format
  if (severity === 'no_trauma') return 'Absent';
  if (severity === 'low') return 'Faible';
  if (severity === 'moderate') return 'Modéré';
  if (severity === 'severe') return 'Sévère';
  // Handle old format (severe_extreme, low_moderate, etc.)
  if (severity.includes('severe') || severity.includes('extreme')) return 'Sévère';
  if (severity.includes('moderate')) return 'Modéré';
  if (severity.includes('low')) return 'Faible';
  if (severity.includes('none') || severity.includes('absent') || severity.includes('minimal')) return 'Absent';
  return severity;
}

export function ScoreDisplay({ code, data }: ScoreDisplayProps) {
  // Don't display score card for questionnaires without scores
  const noScoreQuestionnaires = ['WAIS4_CRITERIA', 'WAIS4_LEARNING'];
  
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
    if (code === 'ASRM') {
      // ASRM: Total >= 6 -> mania/hypomania
      if (data.total_score >= 12) return 'error';
      if (data.total_score >= 6) return 'warning';
      return 'info';
    }
    
    if (code === 'QIDS_SR16') {
      // QIDS: 0-5, 6-10, 11-15, 16-20, 21+
      if (data.total_score >= 21) return 'error';
      if (data.total_score >= 16) return 'error';
      if (data.total_score >= 11) return 'warning';
      if (data.total_score >= 6) return 'info';
      return 'success';
    }
    
    if (code === 'MDQ') {
      // Check if interpretation contains "Positif" or use q1_score logic
      const isPositive = data.interpretation?.includes('Positif') || 
                        (data.q1_score >= 7 && data.q2 === 1 && data.q3 >= 2);
      return isPositive ? 'warning' : 'info';
    }
    
    if (code === 'ASRS') {
      // ASRS: Screening positive if >= 4 items meet threshold in Part A
      const isPositive = data.screening_positive || data.part_a_positive_items >= 4;
      return isPositive ? 'warning' : 'info';
    }
    
    if (code === 'CTQ') {
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
    
    if (code === 'BIS10') {
      // BIS-10: High impulsivity >= 3.0, moderate >= 2.5
      const score = data.overall_impulsivity || 0;
      if (score >= 3.0) return 'error';
      if (score >= 2.5) return 'warning';
      return 'info';
    }
    
    if (code === 'ALS18') {
      // ALS-18: Apathy scale, total 0-54
      // 0-13: no apathy, 14-25: mild-moderate, >=26: severe
      const score = data.total_score;
      if (score === null || score === undefined) return 'info';
      if (score >= 26) return 'error';    // Marked/severe apathy
      if (score >= 14) return 'warning';  // Mild to moderate apathy
      return 'success';                   // No clinically significant apathy
    }
    
    if (code === 'AIM') {
      // AIM-20: Affect Intensity Measure, total 20-120
      // 20-50: low, 51-80: normal, 81-120: high
      const score = data.total_score;
      if (score === null || score === undefined) return 'info';
      if (score >= 81) return 'warning';  // High emotional intensity
      if (score >= 51) return 'success';  // Normal
      return 'info';                      // Low emotional intensity
    }
    
    if (code === 'AQ12') {
      // AQ-12 (BPAQ-12): Aggression Questionnaire, total 12-72
      // 12-30: low, 31-45: moderate, >45: high
      const score = data.total_score;
      if (score === null || score === undefined) return 'info';
      if (score > 45) return 'error';     // High aggression
      if (score >= 31) return 'warning';  // Moderate aggression
      return 'success';                   // Low aggression
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
    
    if (code === 'MADRS') {
      // MADRS: Total score range 0-60
      // 0-6: healthy, 7-19: mild, 20-34: moderate, >34: severe
      const total = data.total_score;
      if (total === null || total === undefined) return 'info';
      if (total <= 6) return 'success';  // Healthy
      if (total <= 19) return 'info';    // Mild depression
      if (total <= 34) return 'warning'; // Moderate depression
      return 'error';                    // Severe depression
    }
    
    if (code === 'YMRS') {
      // YMRS: Total score range 0-60
      // 0-12: minimal, 13-19: mild hypomania, 20-25: moderate mania, ≥26: severe mania
      const total = data.total_score;
      if (total === null || total === undefined) return 'info';
      if (total <= 12) return 'success';  // Minimal or no symptoms
      if (total <= 19) return 'info';     // Mild hypomania
      if (total <= 25) return 'warning';  // Moderate mania (clinically significant)
      return 'error';                     // Severe mania (clinically significant)
    }
    
    if (code === 'WAIS4_MATRICES') {
      // WAIS-IV Matrices: Standardized score 8-12 is average, <8 is below, >12 is above
      if (data.standardized_score >= 13) return 'success';
      if (data.standardized_score >= 8) return 'info';
      return 'warning';
    }
    
    if (code === 'CVLT') {
      // CVLT: Use Total 1-5 standard score for severity
      const score = data.total_1_5_std;
      if (score === null || score === undefined) return 'info';
      if (score >= 0) return 'success';
      if (score >= -1) return 'info';
      return 'warning';
    }
    
    if (code === 'WAIS4_CODE' || code === 'WAIS_IV_CODE_SYMBOLES_IVT') {
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

    if (code === 'FAST') {
      // FAST: Total Score interpretation
      const score = data.total_score;
      if (score === null || score === undefined) return 'info';
      if (score > 40) return 'error'; // Severe
      if (score > 20) return 'warning'; // Moderate
      if (score > 11) return 'warning'; // Mild
      return 'success'; // No deficit
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

    if (code === 'SAS') {
      // SAS: Mean score 0.0-4.0, higher = more severe EPS
      const score = data.mean_score;
      if (score === null || score === undefined) return 'info';
      if (score > 2.0) return 'error';    // Severe symptoms
      if (score > 1.0) return 'warning';  // Moderate symptoms
      if (score > 0.3) return 'info';     // Mild/clinically significant
      if (score > 0) return 'info';       // Minimal symptoms
      return 'success';                   // No symptoms
    }

    if (code === 'PSP') {
      // PSP: Score 1-100, higher = better functioning
      const score = data.final_score;
      if (score === null || score === undefined) return 'info';
      if (score >= 71) return 'success';  // Good to excellent functioning
      if (score >= 51) return 'info';     // Moderate difficulties
      if (score >= 31) return 'warning';  // Marked to severe difficulties
      return 'error';                     // Very severe / no autonomy
    }
    
    if (code === 'EQ5D5L') {
      // EQ-5D-5L: Health state profile and VAS
      const vas = data.vas_score;
      if (vas === null || vas === undefined) return 'info';
      if (vas >= 80) return 'success';    // Good health perception
      if (vas >= 50) return 'info';       // Moderate health perception
      return 'warning';                   // Poor health perception
    }
    
    if (code === 'PRISE_M') {
      // PRISE-M: Side effects score
      const score = data.total_score;
      if (score === null || score === undefined) return 'info';
      if (score === 0) return 'success';  // No side effects
      if (score <= 10) return 'info';     // Mild
      if (score <= 20) return 'warning';  // Moderate
      return 'error';                     // Significant/severe
    }
    
    if (code === 'STAI_YA') {
      // STAI-YA: State anxiety
      const score = data.total_score;
      if (score === null || score === undefined) return 'info';
      if (score <= 35) return 'success';   // Low anxiety
      if (score <= 45) return 'info';      // Moderate
      if (score <= 55) return 'warning';   // Moderate-high
      return 'error';                      // High/very high
    }
    
    if (code === 'MARS') {
      // MARS: Medication adherence
      const score = data.total_score;
      if (score === null || score === undefined) return 'info';
      if (score >= 8) return 'success';    // Good adherence
      if (score >= 6) return 'info';       // Moderate
      if (score >= 4) return 'warning';    // Low
      return 'error';                      // Very low
    }
    
    if (code === 'MATHYS') {
      // MAThyS: Thymic state (0-200, ~100 = euthymic)
      const score = data.total_score;
      if (score === null || score === undefined) return 'info';
      if (score < 60) return 'error';       // Marked depression
      if (score < 80) return 'warning';     // Depressive tendency
      if (score <= 120) return 'success';   // Euthymic
      if (score <= 140) return 'warning';   // Hypomanic tendency
      return 'error';                       // Hypomania/mania
    }
    
    if (code === 'QIDS_SR16') {
      // QIDS-SR16: Depression severity (0-27)
      const score = data.total_score;
      if (score === null || score === undefined) return 'info';
      if (score <= 5) return 'success';    // No depression
      if (score <= 10) return 'info';      // Mild
      if (score <= 15) return 'warning';   // Moderate
      return 'error';                      // Severe/Very severe
    }
    
    if (code === 'PSQI') {
      // PSQI: Sleep quality (0-21, >5 = poor sleep)
      const score = data.total_score;
      if (score === null || score === undefined) return 'info';
      if (score <= 5) return 'success';    // Good sleep quality
      if (score <= 10) return 'info';      // Altered sleep quality
      if (score <= 15) return 'warning';   // Poor sleep quality
      return 'error';                      // Very poor sleep quality
    }
    
    return 'info';
  };

  const severity = getSeverity();
  
  // Generate interpretation for WAIS-IV Matrices if not present
  let interpretation = data.interpretation;
  
  if (code === 'WAIS4_MATRICES' && !interpretation && data.standardized_score !== undefined) {
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
  if (code === 'ASRS' && !interpretation) {
    if (data.screening_positive) {
      interpretation = `Dépistage POSITIF (${data.part_a_positive_items || 0}/6 items Partie A ≥ seuil). Les réponses suggèrent des symptômes cohérents avec un TDAH chez l'adulte. Une évaluation clinique complète est recommandée.`;
    } else {
      interpretation = `Dépistage négatif (${data.part_a_positive_items || 0}/6 items Partie A ≥ seuil). Les réponses ne suggèrent pas de symptômes de TDAH basés sur les critères de dépistage de la Partie A.`;
    }
  }
  
  if (!interpretation) {
    // Use interpretation field if available, otherwise fallback to calculation
    interpretation = code === 'MDQ' ? (data.interpretation || '') : '';
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
    if (code !== 'MDQ') return null;
    
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
              {code === 'ASRM' && 'Score ASRM'}
              {code === 'QIDS_SR16' && 'Score QIDS-SR16'}
              {code === 'MDQ' && 'Résultat MDQ'}
              {code === 'ASRS' && 'Résultat ASRS'}
              {code === 'CTQ' && 'Résultats CTQ'}
              {code === 'BIS10' && 'Résultats BIS-10'}
              {code === 'WURS25' && 'Résultats WURS-25'}
              {code === 'CSM' && 'Résultats CSM - Chronotype'}
              {code === 'CTI' && 'Résultats CTI - Type Circadien'}
              {code === 'ALS18' && 'Résultats ALS-18 - Apathie'}
              {code === 'AIM' && 'Résultats AIM-20 - Intensité Affective'}
              {code === 'AQ12' && 'Résultats AQ-12 - Agressivité'}
              {code === 'ALDA' && 'Score Alda'}
              {code === 'CGI' && 'Résultats CGI'}
              {code === 'MADRS' && 'Résultats MADRS - Échelle de Dépression'}
              {code === 'YMRS' && 'Résultats YMRS - Échelle de Manie'}
              {code === 'WAIS4_MATRICES' && 'Résultats WAIS-IV Matrices'}
              {code === 'CVLT' && 'Résultats CVLT'}
              {code === 'WAIS4_CODE' && 'Résultats WAIS-IV Code'}
              {code === 'WAIS_IV_CODE_SYMBOLES_IVT' && 'Résultats WAIS-IV Code, Symboles & IVT'}
              {code === 'PANSS' && 'Résultats PANSS'}
              {code === 'CDSS' && 'Résultats CDSS - Échelle de Calgary'}
              {code === 'BARS' && 'Résultats BARS - Échelle d\'observance'}
              {code === 'SUMD' && 'Résultats SUMD - Conscience de la maladie'}
              {code === 'AIMS' && 'Résultats AIMS - Mouvements involontaires'}
              {code === 'BARNES' && 'Résultats BARNES - Akathisie'}
              {code === 'SAS' && 'Résultats SAS - Effets extrapyramidaux'}
              {code === 'PSP' && 'Résultats PSP - Fonctionnement personnel et social'}
              {code === 'EQ5D5L' && 'Résultats EQ-5D-5L - Qualité de vie'}
              {code === 'PRISE_M' && 'Résultats PRISE-M - Effets secondaires'}
              {code === 'STAI_YA' && 'Résultats STAI-YA - Anxiété état'}
              {code === 'MARS' && 'Résultats MARS - Observance thérapeutique'}
              {code === 'MATHYS' && 'Résultats MAThyS - États thymiques'}
              {code === 'PSQI' && 'Résultats PSQI - Qualité du Sommeil'}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xl font-bold">
              {code === 'MDQ' 
                ? (data.interpretation?.includes('Positif') ? 'POSITIF' : 'NÉGATIF')
                : code === 'ASRS'
                ? (data.screening_positive ? 'POSITIF' : 'NÉGATIF')
                : code === 'CTQ'
                ? (data.total_score !== undefined ? data.total_score : '-')
                : code === 'BIS10'
                ? (data.overall_impulsivity !== undefined && data.overall_impulsivity !== null ? parseFloat(data.overall_impulsivity).toFixed(2) : '-')
                : code === 'WURS25'
                ? (data.adhd_likely ? 'POSITIF' : 'NÉGATIF')
                : code === 'CSM'
                ? (data.total_score !== undefined ? data.total_score : '-')
                : code === 'CTI'
                ? (data.total_score !== undefined ? data.total_score : '-')
                : code === 'ALS18'
                ? (data.total_score !== undefined ? data.total_score : '-')
                : code === 'AIM'
                ? (data.total_score !== undefined ? data.total_score : '-')
                : code === 'AQ12'
                ? (data.total_score !== undefined ? data.total_score : '-')
                : code === 'ALDA'
                ? (data.alda_score !== undefined ? data.alda_score : '-')
                : code === 'CGI'
                ? (data.cgi_s !== undefined ? data.cgi_s : '-')
                : code === 'MADRS'
                ? (data.total_score !== undefined ? data.total_score : '-')
                : code === 'YMRS'
                ? (data.total_score !== undefined ? data.total_score : '-')
                : code === 'WAIS4_MATRICES'
                ? (data.standardized_score !== undefined ? data.standardized_score : '-')
                : code === 'CVLT'
                ? (data.total_1_5 !== undefined ? data.total_1_5 : '-')
                : code === 'WAIS4_CODE'
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
                : code === 'SAS'
                ? (data.mean_score !== undefined && data.mean_score !== null ? data.mean_score.toFixed(2) : '-')
                : code === 'PSP'
                ? (data.final_score !== undefined && data.final_score !== null ? data.final_score : '-')
                : code === 'EQ5D5L'
                ? (data.profile_string || data.health_state || '-')
                : code === 'PRISE_M'
                ? (data.total_score !== undefined ? data.total_score : '-')
                : code === 'STAI_YA'
                ? (data.total_score !== undefined ? data.total_score : '-')
                : code === 'MARS'
                ? (data.total_score !== undefined ? `${data.total_score}/10` : '-')
                : code === 'MATHYS'
                ? (data.total_score !== undefined ? `${parseFloat(data.total_score).toFixed(1)}/200` : '-')
                : code === 'QIDS_SR16'
                ? (data.total_score !== undefined ? data.total_score : '-')
                : code === 'PSQI'
                ? (data.total_score !== undefined ? data.total_score : '-')
                : (data.total_score !== undefined ? data.total_score : '-')}
              {code === 'ASRM' && '/20'}
              {code === 'QIDS_SR16' && '/27'}
              {code === 'PSQI' && '/21'}
              {code === 'CTQ' && '/125'}
              {code === 'BIS10' && '/4.0'}
              {code === 'CSM' && '/55'}
              {code === 'CTI' && '/55'}
              {code === 'ALS18' && '/54'}
              {code === 'AIM' && '/120'}
              {code === 'AQ12' && '/72'}
              {code === 'ALDA' && '/10'}
              {code === 'CGI' && '/7'}
              {code === 'MADRS' && '/60'}
              {code === 'YMRS' && '/60'}
              {code === 'WAIS4_MATRICES' && '/19'}
              {code === 'CVLT' && '/80'}
              {code === 'WAIS4_CODE' && '/19'}
              {code === 'WAIS_IV_CODE_SYMBOLES_IVT' && (data.wais_ivt !== undefined && data.wais_ivt !== null ? '/150' : '/19')}
              {code === 'PANSS' && '/210'}
              {code === 'CDSS' && '/27'}
              {code === 'BARS' && '%'}
              {code === 'SUMD' && ''}
              {code === 'AIMS' && '/28'}
              {code === 'BARNES' && '/5'}
              {code === 'SAS' && '/4.0'}
              {code === 'PSP' && '/100'}
            </span>
          </div>
        </div>

        {/* ALDA Details */}
        {code === 'ALDA' && data.q0 === 1 && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Clinical Description */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-blue-900 text-xs leading-relaxed">
                L'échelle d'Alda est un outil rétrospectif conçu pour estimer dans quelle mesure l'amélioration clinique peut être attribuée spécifiquement au lithium, en tenant compte des facteurs de confusion (observance, traitements concomitants, évolution naturelle).
              </p>
            </div>

            {/* Score Interpretation */}
            <div className={`p-3 rounded-lg ${
              data.alda_score !== null && data.alda_score >= 7
                ? 'bg-green-50 border border-green-200'
                : data.alda_score !== null && data.alda_score >= 4
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-amber-50 border border-amber-200'
            }`}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-base">
                    {data.alda_score !== null && data.alda_score >= 7 && 'Bon répondeur au lithium'}
                    {data.alda_score !== null && data.alda_score >= 4 && data.alda_score <= 6 && 'Réponse partielle / intermédiaire'}
                    {data.alda_score !== null && data.alda_score >= 0 && data.alda_score <= 3 && 'Mauvais ou non-répondeur'}
                  </span>
                  <span className="text-xs text-gray-600 font-medium">Score Total: {data.alda_score ?? '-'}/10</span>
                </div>
                
                {/* Clinical Guidance */}
                <div className="pt-2 border-t">
                  <p className="text-xs leading-relaxed text-gray-700">
                    {data.alda_score !== null && data.alda_score >= 7 && (
                      <>Réponse <strong className="text-green-700">robuste et spécifique</strong> avec peu de facteurs confondants. Profil typique de "lithium responder". Le lithium doit être maintenu comme traitement de référence.</>
                    )}
                    {data.alda_score !== null && data.alda_score >= 4 && data.alda_score <= 6 && (
                      <>Bénéfice clinique <strong className="text-blue-700">probable mais attribution partielle</strong> au lithium. Peut justifier une poursuite ou une optimisation du traitement (dosage, observance). Évaluer si le lithium reste pertinent en association.</>
                    )}
                    {data.alda_score !== null && data.alda_score >= 0 && data.alda_score <= 3 && (
                      <><strong className="text-amber-700">Absence de bénéfice clair</strong> ou amélioration non attribuable au lithium. Intérêt limité du lithium en monothérapie. Considérer des alternatives thérapeutiques ou une réévaluation diagnostique.</>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Score A and Score B Details */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Composition du score</h5>
              <div className="space-y-3">
                {/* Score A */}
                <div className="p-2 bg-gray-50 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700 font-medium">Score A - Réponse clinique au lithium:</span>
                    <span className="font-bold text-lg">{data.qa ?? data.score_a ?? '-'}/10</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Jugement clinique synthétique basé sur la réduction de la fréquence et sévérité des épisodes, l'amélioration du fonctionnement, et la stabilité sous lithium.
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    <p>0 = aucune réponse | 1-3 = minime | 4-6 = modérée | 7-9 = marquée | 10 = excellente</p>
                  </div>
                </div>

                {/* Score B */}
                <div className="p-2 bg-gray-50 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700 font-medium">Score B - Facteurs confondants:</span>
                    <span className="font-bold text-lg">{data.b_total_score ?? data.score_b ?? '-'}/10</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Plus le score B est élevé, moins l'amélioration peut être attribuée au lithium seul.
                  </p>
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">B1 - Observance insuffisante:</span>
                      <span className="font-medium">{data.qb1 ?? '-'}/2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">B2 - Traitements concomitants actifs:</span>
                      <span className="font-medium">{data.qb2 ?? '-'}/2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">B3 - Durée insuffisante de traitement:</span>
                      <span className="font-medium">{data.qb3 ?? '-'}/2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">B4 - Évolution naturelle fluctuante:</span>
                      <span className="font-medium">{data.qb4 ?? '-'}/2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">B5 - Données cliniques insuffisantes:</span>
                      <span className="font-medium">{data.qb5 ?? '-'}/2</span>
                    </div>
                  </div>
                </div>

                {/* Final Calculation */}
                <div className="p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Score Total d'Alda = A - B:</span>
                    <span className="font-bold text-xl text-blue-700">{data.alda_score ?? '-'}/10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interpretation Guide */}
            <div className="text-xs text-gray-500 pt-2 border-t space-y-1">
              <p><strong>Interprétation clinique :</strong></p>
              <p>• <strong>7-10 :</strong> Bon répondeur - Réponse robuste, maintenir le lithium</p>
              <p>• <strong>4-6 :</strong> Réponse partielle - Optimisation ou association possible</p>
              <p>• <strong>0-3 :</strong> Non-répondeur - Alternatives thérapeutiques à considérer</p>
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
        {code === 'MDQ' && mdqDetails && (
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
        {code === 'ASRS' && (
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
        {code === 'CTQ' && (
          <div className="text-sm space-y-3 mt-2 pt-2 border-t">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Abus émotionnel:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{data.emotional_abuse_score ?? '-'}/25</span>
                  <Badge variant={data.emotional_abuse_severity?.includes('severe') ? 'destructive' : 'secondary'} className={`text-xs ${data.emotional_abuse_severity?.includes('moderate') ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}`}>
                    {getSeverityLabel(data.emotional_abuse_severity)}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Abus physique:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{data.physical_abuse_score ?? '-'}/25</span>
                  <Badge variant={data.physical_abuse_severity?.includes('severe') ? 'destructive' : 'secondary'} className={`text-xs ${data.physical_abuse_severity?.includes('moderate') ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}`}>
                    {getSeverityLabel(data.physical_abuse_severity)}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Abus sexuel:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{data.sexual_abuse_score ?? '-'}/25</span>
                  <Badge variant={data.sexual_abuse_severity?.includes('severe') ? 'destructive' : 'secondary'} className={`text-xs ${data.sexual_abuse_severity?.includes('moderate') ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}`}>
                    {getSeverityLabel(data.sexual_abuse_severity)}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Négligence émotionnelle:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{data.emotional_neglect_score ?? '-'}/25</span>
                  <Badge variant={data.emotional_neglect_severity?.includes('severe') ? 'destructive' : 'secondary'} className={`text-xs ${data.emotional_neglect_severity?.includes('moderate') ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}`}>
                    {getSeverityLabel(data.emotional_neglect_severity)}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Négligence physique:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{data.physical_neglect_score ?? '-'}/25</span>
                  <Badge variant={data.physical_neglect_severity?.includes('severe') ? 'destructive' : 'secondary'} className={`text-xs ${data.physical_neglect_severity?.includes('moderate') ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}`}>
                    {getSeverityLabel(data.physical_neglect_severity)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600 font-medium">Déni/Minimisation:</span>
              <span className={`font-bold ${data.denial_score >= 6 ? 'text-orange-700' : 'text-green-700'}`}>
                {data.denial_score ?? '-'}/15
              </span>
            </div>
            {data.denial_score >= 6 && (
              <p className="text-xs text-orange-700 mt-1 pt-2 border-t">
                Score de minimisation significatif (≥6) : suspicion de sous-déclaration des traumatismes. Les résultats doivent être interprétés avec prudence.
              </p>
            )}
          </div>
        )}

        {/* BIS-10 Details */}
        {code === 'BIS10' && (
          <div className="text-sm space-y-2 mt-2 pt-2 border-t">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Impulsivité cognitive:</span>
                <span className="font-semibold">{data.cognitive_impulsivity_mean !== undefined && data.cognitive_impulsivity_mean !== null ? parseFloat(data.cognitive_impulsivity_mean).toFixed(2) : '-'}/4.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Impulsivité motrice:</span>
                <span className="font-semibold">{data.behavioral_impulsivity_mean !== undefined && data.behavioral_impulsivity_mean !== null ? parseFloat(data.behavioral_impulsivity_mean).toFixed(2) : '-'}/4.0</span>
              </div>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600 font-medium">Impulsivité générale:</span>
              <span className="font-bold text-lg">{data.overall_impulsivity !== undefined && data.overall_impulsivity !== null ? parseFloat(data.overall_impulsivity).toFixed(2) : '-'}/4.0</span>
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

        {/* ALS-18 Apathy Details */}
        {code === 'ALS18' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Score Interpretation */}
            <div className={`p-3 rounded-lg ${
              data.total_score !== null && data.total_score >= 26
                ? 'bg-red-50 border border-red-200'
                : data.total_score !== null && data.total_score >= 14
                ? 'bg-amber-50 border border-amber-200'
                : 'bg-green-50 border border-green-200'
            }`}>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {data.total_score !== null && data.total_score >= 26 && 'Apathie marquée / sévère'}
                    {data.total_score !== null && data.total_score >= 14 && data.total_score < 26 && 'Apathie légère à modérée'}
                    {(data.total_score === null || data.total_score < 14) && 'Absence d\'apathie cliniquement significative'}
                  </span>
                  <span className="text-xs text-gray-600">Score: {data.total_score ?? '-'}/54</span>
                </div>
                <p className="text-xs leading-relaxed mt-2">
                  {data.total_score !== null && data.total_score >= 26 && 
                    'Désengagement important, passivité, émoussement motivationnel net. Retentissement fonctionnel clair (autonomie, relations, activités). Profil compatible avec une apathie cliniquement centrale, souvent indépendante de la symptomatologie thymique aiguë.'}
                  {data.total_score !== null && data.total_score >= 14 && data.total_score < 26 && 
                    'Baisse d\'initiative, réduction de l\'engagement dans les activités quotidiennes, effort moindre pour démarrer ou maintenir une action. Retentissement fonctionnel possible mais partiel.'}
                  {(data.total_score === null || data.total_score < 14) && 
                    'Motivation globalement préservée. Les variations observées peuvent relever de la fatigue, du contexte ou de facteurs situationnels.'}
                </p>
              </div>
            </div>

            {/* Subscale Scores */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Scores par sous-échelle</h5>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Anxiété-Dépression (5 items):</span>
                  <span className="font-medium">{data.anxiety_depression_score ?? '-'}/15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dépression-Élation (8 items):</span>
                  <span className="font-medium">{data.depression_elation_score ?? '-'}/24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Colère (5 items):</span>
                  <span className="font-medium">{data.anger_score ?? '-'}/15</span>
                </div>
              </div>
            </div>

            {/* Scale Reference */}
            <div className="text-xs text-gray-600 mt-2 pt-2 border-t space-y-1">
              <p><strong>Cotation:</strong> 18 items, 0-3 par item (0=Absolument pas caractéristique, 3=Très caractéristique)</p>
              <p><strong>Seuils:</strong> 0-13 (absence d'apathie) | 14-25 (légère-modérée) | &ge;26 (marquée/sévère)</p>
            </div>
          </div>
        )}

        {/* AIM-20 Affect Intensity Details */}
        {code === 'AIM' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Score Interpretation */}
            <div className={`p-3 rounded-lg ${
              data.total_score !== null && data.total_score >= 81
                ? 'bg-amber-50 border border-amber-200'
                : data.total_score !== null && data.total_score >= 51
                ? 'bg-green-50 border border-green-200'
                : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {data.total_score !== null && data.total_score >= 81 && 'Intensité affective élevée'}
                    {data.total_score !== null && data.total_score >= 51 && data.total_score < 81 && 'Intensité affective normale'}
                    {(data.total_score === null || data.total_score < 51) && 'Intensité affective faible'}
                  </span>
                  <span className="text-xs text-gray-600">Score: {data.total_score ?? '-'}/120</span>
                </div>
                <p className="text-xs leading-relaxed mt-2">
                  {data.total_score !== null && data.total_score >= 81 && 
                    'Forte intensité émotionnelle, émotions vécues comme envahissantes. Réactions émotionnelles rapides et puissantes, positives comme négatives. Vulnérabilité accrue à la dysrégulation émotionnelle. Ces scores sont souvent observés dans les troubles de l\'humeur, troubles anxieux, trouble borderline, et profils à haute sensibilité émotionnelle.'}
                  {data.total_score !== null && data.total_score >= 51 && data.total_score < 81 && 
                    'Intensité émotionnelle moyenne. Réactivité émotionnelle dans la norme. Capacité à ressentir fortement certaines émotions sans débordement systématique. Correspond au profil le plus fréquent en population générale.'}
                  {(data.total_score === null || data.total_score < 51) && 
                    'Réactivité émotionnelle faible. Émotions vécues comme modérées, peu envahissantes. Profil parfois associé à un style émotionnel contrôlé, distant ou peu expressif.'}
                </p>
              </div>
            </div>

            {/* Mean Score */}
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-600">Score moyen par item:</span>
              <span className="font-semibold">{data.total_mean !== null && data.total_mean !== undefined ? parseFloat(data.total_mean).toFixed(2) : '-'}/6.0</span>
            </div>

            {/* Scale Reference */}
            <div className="text-xs text-gray-600 mt-2 pt-2 border-t space-y-1">
              <p><strong>Cotation:</strong> 20 items, 1-6 par item (1=Jamais, 6=Toujours). 6 items inversés.</p>
              <p><strong>Seuils:</strong> 20-50 (faible) | 51-80 (normale) | 81-120 (élevée)</p>
            </div>
          </div>
        )}

        {/* AQ-12 Aggression Details */}
        {code === 'AQ12' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Score Interpretation */}
            <div className={`p-3 rounded-lg ${
              data.total_score !== null && data.total_score > 45
                ? 'bg-red-50 border border-red-200'
                : data.total_score !== null && data.total_score >= 31
                ? 'bg-amber-50 border border-amber-200'
                : 'bg-green-50 border border-green-200'
            }`}>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {data.total_score !== null && data.total_score > 45 && 'Agressivité élevée'}
                    {data.total_score !== null && data.total_score >= 31 && data.total_score <= 45 && 'Agressivité modérée'}
                    {(data.total_score === null || data.total_score < 31) && 'Faible agressivité'}
                  </span>
                  <span className="text-xs text-gray-600">Score: {data.total_score ?? '-'}/72</span>
                </div>
                <p className="text-xs leading-relaxed mt-2">
                  {data.total_score !== null && data.total_score > 45 && 
                    'Impulsivité marquée, colère difficile à contrôler, risque accru de comportements agressifs verbaux ou physiques.'}
                  {data.total_score !== null && data.total_score >= 31 && data.total_score <= 45 && 
                    'Irritabilité, colère réactive, conflits interpersonnels possibles, retentissement situationnel.'}
                  {(data.total_score === null || data.total_score < 31) && 
                    'Bonne régulation émotionnelle, conflits rares ou maîtrisés.'}
                </p>
              </div>
            </div>

            {/* Subscale Scores */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Scores par sous-échelle (3 items chacune)</h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Agressivité physique:</span>
                  <span className="font-medium">{data.physical_aggression_score ?? '-'}/18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Agressivité verbale:</span>
                  <span className="font-medium">{data.verbal_aggression_score ?? '-'}/18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Colère:</span>
                  <span className="font-medium">{data.anger_score ?? '-'}/18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hostilité:</span>
                  <span className="font-medium">{data.hostility_score ?? '-'}/18</span>
                </div>
              </div>
            </div>

            {/* Scale Reference */}
            <div className="text-xs text-gray-600 mt-2 pt-2 border-t space-y-1">
              <p><strong>Cotation:</strong> 12 items (BPAQ-12), 1-6 par item (1=Pas du tout moi, 6=Tout à fait moi)</p>
              <p><strong>Seuils:</strong> 12-30 (faible) | 31-45 (modérée) | &gt;45 (élevée)</p>
              <p className="text-gray-500 italic mt-1">En clinique, on s'intéresse à la comparaison interindividuelle, à l'évolution dans le temps, et au lien avec l'impulsivité, les troubles de l'humeur, et le stress.</p>
            </div>
          </div>
        )}

        {/* MADRS Details */}
        {code === 'MADRS' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Clinical Description */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-blue-900 text-xs leading-relaxed">
                Cette questionnaire évalue la gravité des symptômes dans des domaines très variés tels que l'humeur, le sommeil et l'appétit, la fatigue physique et psychique et les idées de suicide. L'échelle MADRS constitue un bon complément à l'échelle de dépression de Hamilton.
              </p>
            </div>

            {/* Score Interpretation */}
            <div className={`p-3 rounded-lg ${
              data.total_score !== null && data.total_score > 34
                ? 'bg-red-50 border border-red-200'
                : data.total_score !== null && data.total_score > 19
                ? 'bg-amber-50 border border-amber-200'
                : data.total_score !== null && data.total_score > 6
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-green-50 border border-green-200'
            }`}>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {data.total_score !== null && data.total_score > 34 && 'Dépression sévère'}
                    {data.total_score !== null && data.total_score >= 20 && data.total_score <= 34 && 'Dépression moyenne'}
                    {data.total_score !== null && data.total_score >= 7 && data.total_score <= 19 && 'Dépression légère'}
                    {data.total_score !== null && data.total_score >= 0 && data.total_score <= 6 && 'Patient considéré comme sain'}
                  </span>
                  <span className="text-xs text-gray-600">Score: {data.total_score ?? '-'}/60</span>
                </div>
              </div>
            </div>

            {/* Item Scores */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Scores par item (0-6)</h5>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">1. Tristesse apparente:</span>
                  <span className="font-medium">{data.q1 ?? '-'}/6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">2. Tristesse exprimée:</span>
                  <span className="font-medium">{data.q2 ?? '-'}/6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">3. Tension intérieure:</span>
                  <span className="font-medium">{data.q3 ?? '-'}/6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">4. Réduction du sommeil:</span>
                  <span className="font-medium">{data.q4 ?? '-'}/6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">5. Réduction de l'appétit:</span>
                  <span className="font-medium">{data.q5 ?? '-'}/6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">6. Difficultés de concentration:</span>
                  <span className="font-medium">{data.q6 ?? '-'}/6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">7. Lassitude:</span>
                  <span className="font-medium">{data.q7 ?? '-'}/6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">8. Incapacité à ressentir:</span>
                  <span className="font-medium">{data.q8 ?? '-'}/6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">9. Pensées pessimistes:</span>
                  <span className="font-medium">{data.q9 ?? '-'}/6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">10. Idées de suicide:</span>
                  <span className="font-medium">{data.q10 ?? '-'}/6</span>
                </div>
              </div>
            </div>

            {/* Scoring Guide */}
            <div className="text-xs text-gray-500 pt-2 border-t space-y-1">
              <p><strong>Interprétation:</strong></p>
              <p>• 0-6 points: Patient considéré comme sain</p>
              <p>• 7-19 points: Dépression légère</p>
              <p>• 20-34 points: Dépression moyenne</p>
              <p>• {'>'} 34 points: Dépression sévère</p>
            </div>
          </div>
        )}

        {/* YMRS Details */}
        {code === 'YMRS' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Clinical Description */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-blue-900 text-xs leading-relaxed">
                C'est une échelle clinique utilisée pour quantifier la sévérité des symptômes maniaques. Le score total reflète l'intensité globale de la manie. En pratique clinique, un score ≥ 20 est généralement considéré comme cliniquement significatif et justifie une prise en charge thérapeutique adaptée.
              </p>
            </div>

            {/* Score Interpretation with detailed clinical info */}
            <div className={`p-3 rounded-lg ${
              data.total_score !== null && data.total_score >= 26
                ? 'bg-red-50 border border-red-200'
                : data.total_score !== null && data.total_score >= 20
                ? 'bg-amber-50 border border-amber-200'
                : data.total_score !== null && data.total_score >= 13
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-green-50 border border-green-200'
            }`}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-base">
                    {data.total_score !== null && data.total_score >= 26 && 'Manie sévère'}
                    {data.total_score !== null && data.total_score >= 20 && data.total_score <= 25 && 'Manie modérée'}
                    {data.total_score !== null && data.total_score >= 13 && data.total_score <= 19 && 'Hypomanie légère'}
                    {data.total_score !== null && data.total_score >= 0 && data.total_score <= 12 && 'Absence de manie / symptômes minimes'}
                  </span>
                  <span className="text-xs text-gray-600 font-medium">Score: {data.total_score ?? '-'}/60</span>
                </div>
                
                {/* Detailed Clinical Interpretation */}
                <div className="pt-2 border-t">
                  <p className="text-xs leading-relaxed text-gray-700">
                    {data.total_score !== null && data.total_score <= 12 && (
                      <>État euthymique ou traits résiduels non cliniquement significatifs. Fonctionnement global préservé, pas de retentissement fonctionnel notable. Score utilisé comme seuil de rémission.</>
                    )}
                    {data.total_score !== null && data.total_score >= 13 && data.total_score <= 19 && (
                      <><strong>Zone grise clinique.</strong> Symptômes présents mais partiellement contrôlés (énergie accrue, réduction du sommeil, discours rapide). Pas ou peu de rupture fonctionnelle, jugement conservé. <strong className="text-blue-700">Signal d'alerte :</strong> risque d'escalade vers une manie franche. Ajustement thérapeutique précoce recommandé.</>
                    )}
                    {data.total_score !== null && data.total_score >= 20 && data.total_score <= 25 && (
                      <>Symptômes clairement pathologiques : agitation motrice marquée, irritabilité persistante, accélération idéique, début d'altération du jugement. <strong className="text-amber-700">Retentissement fonctionnel net.</strong> Risque accru de comportements impulsifs. Prise en charge active nécessaire avec évaluation de la sécurité.</>
                    )}
                    {data.total_score !== null && data.total_score >= 26 && (
                      <>Manie franche, souvent désorganisée : agitation intense, logorrhée, idées de grandeur, possible symptomatologie psychotique. <strong className="text-red-700">Altération majeure du fonctionnement, risque élevé.</strong> Indication fréquente d'hospitalisation. Épisode aigu non stabilisé.</>
                    )}
                  </p>
                </div>
                
                {/* Clinical Significance Alert */}
                {data.total_score !== null && data.total_score >= 20 && (
                  <div className="pt-2 border-t">
                    <p className={`text-xs font-medium ${data.total_score >= 26 ? 'text-red-700' : 'text-amber-700'}`}>
                      Cliniquement significatif - Prise en charge thérapeutique adaptée {data.total_score >= 26 ? 'urgente' : 'active'} recommandée
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Item Scores */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Scores par item</h5>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">1. Élévation de l'humeur:</span>
                  <span className="font-medium">{data.q1 ?? '-'}/4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">2. Augmentation de l'activité motrice:</span>
                  <span className="font-medium">{data.q2 ?? '-'}/4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">3. Intérêt sexuel:</span>
                  <span className="font-medium">{data.q3 ?? '-'}/4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">4. Sommeil:</span>
                  <span className="font-medium">{data.q4 ?? '-'}/4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">5. Irritabilité (pondéré x2):</span>
                  <span className="font-medium">{data.q5 ?? '-'}/8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">6. Débit verbal (pondéré x2):</span>
                  <span className="font-medium">{data.q6 ?? '-'}/8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">7. Troubles du cours de la pensée:</span>
                  <span className="font-medium">{data.q7 ?? '-'}/4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">8. Contenu de la pensée (pondéré x2):</span>
                  <span className="font-medium">{data.q8 ?? '-'}/8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">9. Comportement agressif (pondéré x2):</span>
                  <span className="font-medium">{data.q9 ?? '-'}/8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">10. Apparence:</span>
                  <span className="font-medium">{data.q10 ?? '-'}/4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">11. Insight:</span>
                  <span className="font-medium">{data.q11 ?? '-'}/4</span>
                </div>
              </div>
            </div>

            {/* Scoring Guide with Clinical Context */}
            <div className="text-xs text-gray-500 pt-2 border-t space-y-2">
              <p><strong>Interprétation des seuils :</strong></p>
              <div className="space-y-1 pl-2">
                <p>• <strong>0-12 points :</strong> Absence de manie / symptômes minimes - Seuil de rémission</p>
                <p>• <strong>13-19 points :</strong> Hypomanie légère - Zone d'alerte, ajustement thérapeutique précoce</p>
                <p>• <strong>20-25 points :</strong> Manie modérée - Prise en charge active, évaluation sécurité</p>
                <p>• <strong>≥ 26 points :</strong> Manie sévère - Indication hospitalisation fréquente</p>
              </div>
              <p className="mt-2 pt-2 border-t"><em>Note: Items 5, 6, 8, 9 sont pondérés x2 (cotés 0-8 au lieu de 0-4)</em></p>
            </div>
          </div>
        )}

        {/* WAIS-IV Matrices Details */}
        {code === 'WAIS4_MATRICES' && (
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
        {code === 'CVLT' && (
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
        {code === 'WAIS4_CODE' && (
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

        {/* SAS Details */}
        {code === 'SAS' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Interpretation */}
            {data.interpretation && (
              <div className={`p-3 rounded-lg text-center font-medium ${
                data.mean_score !== null && data.mean_score > 2.0
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : data.mean_score !== null && data.mean_score > 1.0
                  ? 'bg-amber-50 border border-amber-200 text-amber-800'
                  : data.mean_score !== null && data.mean_score > 0.3
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : data.mean_score !== null && data.mean_score > 0
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : 'bg-green-50 border border-green-200 text-green-800'
              }`}>
                {data.interpretation}
              </div>
            )}

            {/* Item scores */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Items individuels</h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">1. Demarche:</span>
                  <span className={`font-medium ${data.q1 >= 2 ? 'text-amber-600' : data.q1 === 0 ? 'text-green-600' : ''}`}>
                    {data.q1 ?? '-'}/4
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">2. Chute des bras:</span>
                  <span className={`font-medium ${data.q2 >= 2 ? 'text-amber-600' : data.q2 === 0 ? 'text-green-600' : ''}`}>
                    {data.q2 ?? '-'}/4
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">3. Epaule:</span>
                  <span className={`font-medium ${data.q3 >= 2 ? 'text-amber-600' : data.q3 === 0 ? 'text-green-600' : ''}`}>
                    {data.q3 ?? '-'}/4
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">4. Coude:</span>
                  <span className={`font-medium ${data.q4 >= 2 ? 'text-amber-600' : data.q4 === 0 ? 'text-green-600' : ''}`}>
                    {data.q4 ?? '-'}/4
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">5. Poignet:</span>
                  <span className={`font-medium ${data.q5 >= 2 ? 'text-amber-600' : data.q5 === 0 ? 'text-green-600' : ''}`}>
                    {data.q5 ?? '-'}/4
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">6. Jambe:</span>
                  <span className={`font-medium ${data.q6 >= 2 ? 'text-amber-600' : data.q6 === 0 ? 'text-green-600' : ''}`}>
                    {data.q6 ?? '-'}/4
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">7. Tete:</span>
                  <span className={`font-medium ${data.q7 >= 2 ? 'text-amber-600' : data.q7 === 0 ? 'text-green-600' : ''}`}>
                    {data.q7 ?? '-'}/4
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">8. Glabelle:</span>
                  <span className={`font-medium ${data.q8 >= 2 ? 'text-amber-600' : data.q8 === 0 ? 'text-green-600' : ''}`}>
                    {data.q8 ?? '-'}/4
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">9. Tremblement:</span>
                  <span className={`font-medium ${data.q9 >= 2 ? 'text-amber-600' : data.q9 === 0 ? 'text-green-600' : ''}`}>
                    {data.q9 ?? '-'}/4
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">10. Salivation:</span>
                  <span className={`font-medium ${data.q10 >= 2 ? 'text-amber-600' : data.q10 === 0 ? 'text-green-600' : ''}`}>
                    {data.q10 ?? '-'}/4
                  </span>
                </div>
              </div>
            </div>

            {/* Mean score */}
            <div className="pt-2 border-t flex justify-between items-center">
              <span className="text-gray-600 font-medium">Score moyen (somme / 10):</span>
              <span className={`font-bold text-lg ${
                data.mean_score > 2.0 ? 'text-red-600' : 
                data.mean_score > 1.0 ? 'text-amber-600' : 
                data.mean_score > 0.3 ? 'text-blue-600' : 
                data.mean_score > 0 ? 'text-blue-600' : 'text-green-600'
              }`}>
                {data.mean_score !== undefined && data.mean_score !== null ? data.mean_score.toFixed(2) : '-'}/4.0
              </span>
            </div>

            {/* Legend */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p>Score: 0 = Normal, 1 = Leger, 2 = Modere, 3 = Important, 4 = Severe</p>
              <p className="mt-1">Seuil clinique: Score moyen &gt; 0.3 = EPS significatifs</p>
            </div>
          </div>
        )}

        {/* PSP Details */}
        {code === 'PSP' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Interpretation */}
            {data.interpretation && (
              <div className={`p-3 rounded-lg text-center font-medium ${
                data.final_score !== null && data.final_score >= 71
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : data.final_score !== null && data.final_score >= 51
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : data.final_score !== null && data.final_score >= 31
                  ? 'bg-amber-50 border border-amber-200 text-amber-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {data.interpretation}
              </div>
            )}

            {/* Domain ratings */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Evaluation des 4 domaines</h5>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">(a) Activites socialement utiles:</span>
                  <span className={`font-medium ${
                    data.domain_a === 'Severe' || data.domain_a === 'Tres_severe' ? 'text-red-600' :
                    data.domain_a === 'Marque' ? 'text-amber-600' :
                    data.domain_a === 'Absent' ? 'text-green-600' : ''
                  }`}>
                    {data.domain_a?.replace('_', ' ') || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">(b) Relations personnelles et sociales:</span>
                  <span className={`font-medium ${
                    data.domain_b === 'Severe' || data.domain_b === 'Tres_severe' ? 'text-red-600' :
                    data.domain_b === 'Marque' ? 'text-amber-600' :
                    data.domain_b === 'Absent' ? 'text-green-600' : ''
                  }`}>
                    {data.domain_b?.replace('_', ' ') || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">(c) Souci de soi:</span>
                  <span className={`font-medium ${
                    data.domain_c === 'Severe' || data.domain_c === 'Tres_severe' ? 'text-red-600' :
                    data.domain_c === 'Marque' ? 'text-amber-600' :
                    data.domain_c === 'Absent' ? 'text-green-600' : ''
                  }`}>
                    {data.domain_c?.replace('_', ' ') || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">(d) Comportements perturbateurs:</span>
                  <span className={`font-medium ${
                    data.domain_d === 'Severe' || data.domain_d === 'Tres_severe' ? 'text-red-600' :
                    data.domain_d === 'Marque' ? 'text-amber-600' :
                    data.domain_d === 'Absent' ? 'text-green-600' : ''
                  }`}>
                    {data.domain_d?.replace('_', ' ') || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Interval and final score */}
            <div className="pt-2 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Intervalle selectionne:</span>
                  <span className="font-medium">
                    {data.interval_selection ? 
                      data.interval_selection === 1 ? '91-100' :
                      data.interval_selection === 2 ? '81-90' :
                      data.interval_selection === 3 ? '71-80' :
                      data.interval_selection === 4 ? '61-70' :
                      data.interval_selection === 5 ? '51-60' :
                      data.interval_selection === 6 ? '41-50' :
                      data.interval_selection === 7 ? '31-40' :
                      data.interval_selection === 8 ? '21-30' :
                      data.interval_selection === 9 ? '11-20' :
                      '1-10' : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Score final:</span>
                  <span className={`font-bold text-lg ${
                    data.final_score >= 71 ? 'text-green-600' :
                    data.final_score >= 51 ? 'text-blue-600' :
                    data.final_score >= 31 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {data.final_score ?? '-'}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p>Score: 91-100 = Tres bon, 71-90 = Bon, 51-70 = Modere, 31-50 = Altere, 1-30 = Severement altere</p>
              <p className="mt-1">Periode d'evaluation: Le mois dernier (30 derniers jours)</p>
            </div>
          </div>
        )}

        {/* EQ-5D-5L Details */}
        {code === 'EQ5D5L' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Health State Profile */}
            <div className={`p-3 rounded-lg ${
              data.vas_score !== null && data.vas_score >= 80
                ? 'bg-green-50 border border-green-200'
                : data.vas_score !== null && data.vas_score >= 50
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-amber-50 border border-amber-200'
            }`}>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Profil de santé:</span>
                  <span className="text-lg font-mono font-bold">{data.profile_string || data.health_state || '-'}</span>
                </div>
                {data.interpretation && (
                  <p className="text-xs leading-relaxed mt-2">{data.interpretation}</p>
                )}
              </div>
            </div>

            {/* 5 Dimensions */}
            <div>
              <h5 className="font-semibold text-gray-700 mb-2">Évaluation des 5 dimensions</h5>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mobilité:</span>
                  <span className={`font-medium ${
                    data.mobility === 1 ? 'text-green-600' :
                    data.mobility === 2 ? 'text-blue-600' :
                    data.mobility === 3 ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {data.mobility === 1 ? 'Aucun problème' :
                     data.mobility === 2 ? 'Problèmes légers' :
                     data.mobility === 3 ? 'Problèmes modérés' :
                     data.mobility === 4 ? 'Problèmes sévères' :
                     data.mobility === 5 ? 'Incapacité' : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Autonomie:</span>
                  <span className={`font-medium ${
                    data.self_care === 1 ? 'text-green-600' :
                    data.self_care === 2 ? 'text-blue-600' :
                    data.self_care === 3 ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {data.self_care === 1 ? 'Aucun problème' :
                     data.self_care === 2 ? 'Problèmes légers' :
                     data.self_care === 3 ? 'Problèmes modérés' :
                     data.self_care === 4 ? 'Problèmes sévères' :
                     data.self_care === 5 ? 'Incapacité' : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Activités courantes:</span>
                  <span className={`font-medium ${
                    data.usual_activities === 1 ? 'text-green-600' :
                    data.usual_activities === 2 ? 'text-blue-600' :
                    data.usual_activities === 3 ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {data.usual_activities === 1 ? 'Aucun problème' :
                     data.usual_activities === 2 ? 'Problèmes légers' :
                     data.usual_activities === 3 ? 'Problèmes modérés' :
                     data.usual_activities === 4 ? 'Problèmes sévères' :
                     data.usual_activities === 5 ? 'Incapacité' : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Douleur/Gêne:</span>
                  <span className={`font-medium ${
                    data.pain_discomfort === 1 ? 'text-green-600' :
                    data.pain_discomfort === 2 ? 'text-blue-600' :
                    data.pain_discomfort === 3 ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {data.pain_discomfort === 1 ? 'Aucune' :
                     data.pain_discomfort === 2 ? 'Légère' :
                     data.pain_discomfort === 3 ? 'Modérée' :
                     data.pain_discomfort === 4 ? 'Sévère' :
                     data.pain_discomfort === 5 ? 'Extrême' : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Anxiété/Dépression:</span>
                  <span className={`font-medium ${
                    data.anxiety_depression === 1 ? 'text-green-600' :
                    data.anxiety_depression === 2 ? 'text-blue-600' :
                    data.anxiety_depression === 3 ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {data.anxiety_depression === 1 ? 'Aucune' :
                     data.anxiety_depression === 2 ? 'Légère' :
                     data.anxiety_depression === 3 ? 'Modérée' :
                     data.anxiety_depression === 4 ? 'Sévère' :
                     data.anxiety_depression === 5 ? 'Extrême' : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* VAS and Index Value */}
            <div className="pt-2 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Score VAS:</span>
                  <span className={`font-bold text-lg ${
                    data.vas_score >= 80 ? 'text-green-600' :
                    data.vas_score >= 50 ? 'text-blue-600' :
                    'text-amber-600'
                  }`}>
                    {data.vas_score ?? '-'}/100
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Index d'utilité:</span>
                  <span className="font-bold text-lg text-blue-700">
                    {data.index_value ?? '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p><strong>Profil:</strong> Codage 5 dimensions (1=aucun problème, 5=pire état)</p>
              <p className="mt-1"><strong>VAS:</strong> Échelle visuelle analogique de l'état de santé (0=pire, 100=meilleur)</p>
              <p className="mt-1"><strong>Index:</strong> Valeur d'utilité de qualité de vie (1.0=santé parfaite, &lt;0=pire que la mort)</p>
            </div>
          </div>
        )}

        {/* PRISE-M Details */}
        {code === 'PRISE_M' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Interpretation */}
            {data.interpretation && (
              <div className={`p-3 rounded-lg ${
                data.total_score === 0
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : data.total_score <= 10
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : data.total_score <= 20
                  ? 'bg-amber-50 border border-amber-200 text-amber-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="font-medium">{data.interpretation}</p>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{data.total_score ?? '-'}</div>
                <div className="text-xs text-gray-600 mt-1">Score total</div>
                <div className="text-xs text-gray-500">/62</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{data.tolerable_count ?? '-'}</div>
                <div className="text-xs text-gray-600 mt-1">Effets tolérables</div>
                <div className="text-xs text-gray-500">(Score 1)</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-700">{data.painful_count ?? '-'}</div>
                <div className="text-xs text-gray-600 mt-1">Effets pénibles</div>
                <div className="text-xs text-gray-500">(Score 2)</div>
              </div>
            </div>

            {/* Medication Status */}
            {data.taking_medication && (
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Prend actuellement un traitement:</span>
                  <span className={`font-medium ${
                    data.taking_medication === 'oui' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {data.taking_medication === 'oui' ? 'Oui' : 
                     data.taking_medication === 'non' ? 'Non' : data.taking_medication}
                  </span>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p><strong>Cotation:</strong> 31 items, 0-2 par item (0=Absent, 1=Tolérable, 2=Pénible)</p>
              <p className="mt-1"><strong>Score total:</strong> Somme des 31 items (0-62)</p>
              <p className="mt-1"><strong>Seuils:</strong> 0 (aucun) | 1-10 (léger) | 11-20 (modéré) | 21-40 (important) | &gt;40 (sévère)</p>
              <p className="mt-1 text-gray-600"><strong>Note:</strong> Un score élevé ou de nombreux effets pénibles peuvent justifier un ajustement thérapeutique.</p>
            </div>
          </div>
        )}

        {/* STAI-YA Details */}
        {code === 'STAI_YA' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Interpretation */}
            {data.interpretation && (
              <div className={`p-3 rounded-lg ${
                data.total_score <= 35
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : data.total_score <= 45
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : data.total_score <= 55
                  ? 'bg-amber-50 border border-amber-200 text-amber-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="font-medium">{data.interpretation}</p>
              </div>
            )}

            {/* Score Details */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{data.total_score ?? '-'}</div>
                <div className="text-xs text-gray-600 mt-1">Score brut</div>
                <div className="text-xs text-gray-500">/80</div>
              </div>
              {data.note_t && (
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{parseFloat(data.note_t).toFixed(0)}</div>
                  <div className="text-xs text-gray-600 mt-1">Note T</div>
                  <div className="text-xs text-gray-500">(Score normalisé)</div>
                </div>
              )}
            </div>

            {/* Anxiety Level Badge */}
            {data.anxiety_level && (
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Niveau d'anxiété:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    data.anxiety_level === 'low' || data.anxiety_level === 'légère'
                      ? 'bg-green-100 text-green-800'
                      : data.anxiety_level === 'moderate' || data.anxiety_level === 'modérée'
                      ? 'bg-blue-100 text-blue-800'
                      : data.anxiety_level === 'moderate-high' || data.anxiety_level === 'moyenne-haute'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {data.anxiety_level === 'low' ? 'Légère' :
                     data.anxiety_level === 'moderate' ? 'Modérée' :
                     data.anxiety_level === 'moderate-high' ? 'Moyenne-haute' :
                     data.anxiety_level === 'high' ? 'Élevée' :
                     data.anxiety_level === 'very-high' ? 'Très élevée' :
                     data.anxiety_level}
                  </span>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p><strong>STAI-YA (Form Y-A):</strong> Inventaire d'Anxiété État - Mesure l'anxiété ressentie au moment présent</p>
              <p className="mt-1"><strong>Cotation:</strong> 20 items, 1-4 par item. Items inversés: 1, 2, 5, 8, 10, 11, 15, 16, 19, 20</p>
              <p className="mt-1"><strong>Score total:</strong> 20-80 (plus élevé = plus d'anxiété)</p>
              <p className="mt-1"><strong>Seuils:</strong> ≤35 (légère) | 36-45 (modérée) | 46-55 (moyenne-haute) | 56-65 (élevée) | &gt;65 (très élevée)</p>
              <p className="mt-1 text-gray-600"><strong>Note:</strong> Le STAI-YA évalue l'anxiété état (situationnelle), à distinguer de l'anxiété trait (dispositionelle, STAI-YB).</p>
            </div>
          </div>
        )}

        {/* MARS Details */}
        {code === 'MARS' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Interpretation */}
            {data.interpretation && (
              <div className={`p-3 rounded-lg ${
                data.total_score >= 8
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : data.total_score >= 6
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : data.total_score >= 4
                  ? 'bg-amber-50 border border-amber-200 text-amber-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="font-medium">{data.interpretation}</p>
              </div>
            )}

            {/* Score Details */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{data.total_score ?? '-'}</div>
                <div className="text-xs text-gray-600 mt-1">Score total</div>
                <div className="text-xs text-gray-500">/10</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{data.adherence_subscore ?? '-'}</div>
                <div className="text-xs text-gray-600 mt-1">Comportements</div>
                <div className="text-xs text-gray-500">/4 (Items 1-4)</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">{data.attitude_subscore ?? '-'}</div>
                <div className="text-xs text-gray-600 mt-1">Attitudes</div>
                <div className="text-xs text-gray-500">/6 (Items 5-10)</div>
              </div>
            </div>

            {/* Adherence Percentage */}
            {data.adherence_percentage !== null && data.adherence_percentage !== undefined && (
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Taux d'observance:</span>
                  <span className="font-medium text-lg">{parseFloat(data.adherence_percentage).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      data.adherence_percentage >= 80 ? 'bg-green-500' :
                      data.adherence_percentage >= 60 ? 'bg-blue-500' :
                      data.adherence_percentage >= 40 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, data.adherence_percentage)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Medication Status */}
            {data.taking_medication && (
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Prend actuellement un traitement:</span>
                  <span className={`font-medium ${
                    data.taking_medication === 'oui' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {data.taking_medication === 'oui' ? 'Oui' : 
                     data.taking_medication === 'non' ? 'Non' : data.taking_medication}
                  </span>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p><strong>MARS:</strong> Medication Adherence Rating Scale - Évalue l'observance et les attitudes face au traitement</p>
              <p className="mt-1"><strong>Cotation:</strong> 10 items, 0-1 par item. Items positifs (7, 8): Oui=1pt. Items négatifs (1-6, 9, 10): Non=1pt</p>
              <p className="mt-1"><strong>Score total:</strong> 0-10 (plus élevé = meilleure observance)</p>
              <p className="mt-1"><strong>Seuils:</strong> ≥8 (bonne) | 6-7 (modérée) | 4-5 (faible) | &lt;4 (très faible)</p>
              <p className="mt-1 text-gray-600"><strong>Note:</strong> Une faible observance est un facteur de risque majeur de rechute. L'identification des obstacles est essentielle.</p>
            </div>
          </div>
        )}

        {/* MAThyS Details */}
        {code === 'MATHYS' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Interpretation */}
            {data.interpretation && (
              <div className={`p-3 rounded-lg ${
                data.total_score < 60 || data.total_score > 140
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : data.total_score < 80 || data.total_score > 120
                  ? 'bg-amber-50 border border-amber-200 text-amber-800'
                  : 'bg-green-50 border border-green-200 text-green-800'
              }`}>
                <p className="font-medium">{data.interpretation}</p>
              </div>
            )}

            {/* Main Subscores */}
            <div className="pt-2">
              <h5 className="font-semibold text-gray-700 mb-3">Sous-scores dimensionnels</h5>
              <div className="grid grid-cols-5 gap-3">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-700">{data.subscore_emotion !== null && data.subscore_emotion !== undefined ? parseFloat(data.subscore_emotion).toFixed(1) : '-'}</div>
                  <div className="text-xs text-gray-600 mt-1">Émotion</div>
                  <div className="text-xs text-gray-500">/30</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-700">{data.subscore_motivation !== null && data.subscore_motivation !== undefined ? parseFloat(data.subscore_motivation).toFixed(1) : '-'}</div>
                  <div className="text-xs text-gray-600 mt-1">Motivation</div>
                  <div className="text-xs text-gray-500">/30</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-700">{data.subscore_perception !== null && data.subscore_perception !== undefined ? parseFloat(data.subscore_perception).toFixed(1) : '-'}</div>
                  <div className="text-xs text-gray-600 mt-1">Perception</div>
                  <div className="text-xs text-gray-500">/50</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-xl font-bold text-amber-700">{data.subscore_interaction !== null && data.subscore_interaction !== undefined ? parseFloat(data.subscore_interaction).toFixed(1) : '-'}</div>
                  <div className="text-xs text-gray-600 mt-1">Interaction</div>
                  <div className="text-xs text-gray-500">/20</div>
                </div>
                <div className="text-center p-3 bg-indigo-50 rounded-lg">
                  <div className="text-xl font-bold text-indigo-700">{data.subscore_cognition !== null && data.subscore_cognition !== undefined ? parseFloat(data.subscore_cognition).toFixed(1) : '-'}</div>
                  <div className="text-xs text-gray-600 mt-1">Cognition</div>
                  <div className="text-xs text-gray-500">/50</div>
                </div>
              </div>
            </div>

            {/* Dimension Scores */}
            <div className="pt-2 border-t">
              <h5 className="font-semibold text-gray-700 mb-3">Dimensions cliniques (moyennes)</h5>
              <div className="grid grid-cols-5 gap-3">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-gray-900">{data.cognitive_speed !== null && data.cognitive_speed !== undefined ? parseFloat(data.cognitive_speed).toFixed(2) : '-'}</div>
                  <div className="text-xs text-gray-600 mt-1">Vitesse cognitive</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-gray-900">{data.emotional_hyperreactivity !== null && data.emotional_hyperreactivity !== undefined ? parseFloat(data.emotional_hyperreactivity).toFixed(2) : '-'}</div>
                  <div className="text-xs text-gray-600 mt-1">Hyperréactivité émotionnelle</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-gray-900">{data.emotional_hyporeactivity !== null && data.emotional_hyporeactivity !== undefined ? parseFloat(data.emotional_hyporeactivity).toFixed(2) : '-'}</div>
                  <div className="text-xs text-gray-600 mt-1">Hyporéactivité émotionnelle</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-gray-900">{data.motivation !== null && data.motivation !== undefined ? parseFloat(data.motivation).toFixed(2) : '-'}</div>
                  <div className="text-xs text-gray-600 mt-1">Motivation</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-gray-900">{data.motor_activity !== null && data.motor_activity !== undefined ? parseFloat(data.motor_activity).toFixed(2) : '-'}</div>
                  <div className="text-xs text-gray-600 mt-1">Activité motrice</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p><strong>MAThyS:</strong> Multidimensional Assessment of Thymic States - Évaluation multidimensionnelle des états thymiques</p>
              <p className="mt-1"><strong>Cotation:</strong> 20 items, 0-10 par item avec demi-points. Items inversés: 5, 6, 7, 8, 9, 10, 17, 18</p>
              <p className="mt-1"><strong>Score total:</strong> 0-200 (~100 = état euthymique)</p>
              <p className="mt-1"><strong>Seuils:</strong> &lt;60 (dépression marquée) | 60-79 (tendance dépressive) | 80-120 (euthymie) | 121-140 (tendance hypomaniaque) | &gt;140 (hypomanie/manie)</p>
              <p className="mt-1 text-gray-600"><strong>Note:</strong> Outil sensible pour détecter les variations thymiques subtiles. Utile en suivi longitudinal.</p>
            </div>
          </div>
        )}

        {/* QIDS-SR16 Details */}
        {code === 'QIDS_SR16' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Interpretation */}
            {data.interpretation && (
              <div className={`p-3 rounded-lg ${
                data.total_score <= 5
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : data.total_score <= 10
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : data.total_score <= 15
                  ? 'bg-amber-50 border border-amber-200 text-amber-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="font-medium">{data.interpretation}</p>
              </div>
            )}

            {/* Severity Level */}
            <div className="pt-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Niveau de sévérité:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  data.total_score <= 5
                    ? 'bg-green-100 text-green-800'
                    : data.total_score <= 10
                    ? 'bg-blue-100 text-blue-800'
                    : data.total_score <= 15
                    ? 'bg-amber-100 text-amber-800'
                    : data.total_score <= 20
                    ? 'bg-red-100 text-red-800'
                    : 'bg-red-200 text-red-900'
                }`}>
                  {data.total_score <= 5 ? 'Absence' :
                   data.total_score <= 10 ? 'Légère' :
                   data.total_score <= 15 ? 'Modérée' :
                   data.total_score <= 20 ? 'Sévère' :
                   'Très sévère'}
                </span>
              </div>
            </div>

            {/* Suicidal Ideation Alert */}
            {data.q12 && data.q12 >= 2 && (
              <div className="p-3 bg-red-50 border-2 border-red-300 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-red-700 font-bold">⚠️</span>
                  <div>
                    <p className="font-bold text-red-900">Alerte: Idéation suicidaire présente</p>
                    <p className="text-sm text-red-800 mt-1">
                      Le patient rapporte des pensées de mort ou de suicide (Item 12: score {data.q12}).
                      Évaluation clinique urgente du risque suicidaire recommandée.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p><strong>QIDS-SR16:</strong> Quick Inventory of Depressive Symptomatology - Auto-questionnaire</p>
              <p className="mt-1"><strong>Cotation:</strong> 16 items avec scoring par domaines (max par domaine). Score total: 0-27</p>
              <p className="mt-1"><strong>Domaines:</strong> Sommeil (items 1-4, max), Appétit/Poids (6-9, max), Psychomoteur (15-16, max), autres items scorés directement</p>
              <p className="mt-1"><strong>Seuils:</strong> 0-5 (absence) | 6-10 (légère) | 11-15 (modérée) | 16-20 (sévère) | 21-27 (très sévère)</p>
              <p className="mt-1 text-gray-600"><strong>Note:</strong> Outil validé pour le dépistage et le suivi de la dépression. Sensible au changement thérapeutique.</p>
            </div>
          </div>
        )}

        {/* PSQI Details */}
        {code === 'PSQI' && (
          <div className="text-sm space-y-4 mt-2 pt-2 border-t">
            {/* Interpretation */}
            {data.interpretation && (
              <div className={`p-3 rounded-lg ${
                data.total_score <= 5
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : data.total_score <= 10
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : data.total_score <= 15
                  ? 'bg-amber-50 border border-amber-200 text-amber-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="font-medium">{data.interpretation}</p>
              </div>
            )}

            {/* Component Scores */}
            <div className="pt-2">
              <h5 className="font-semibold text-gray-700 mb-3">Scores par composante (0-3 chacun)</h5>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">C1. Qualité subjective:</span>
                  <span className="font-semibold">{data.c1_subjective_quality ?? '-'}/3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">C2. Latence d'endormissement:</span>
                  <span className="font-semibold">{data.c2_latency ?? '-'}/3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">C3. Durée du sommeil:</span>
                  <span className="font-semibold">{data.c3_duration ?? '-'}/3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">C4. Efficience du sommeil:</span>
                  <span className="font-semibold">{data.c4_efficiency ?? '-'}/3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">C5. Perturbations:</span>
                  <span className="font-semibold">{data.c5_disturbances ?? '-'}/3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">C6. Médication:</span>
                  <span className="font-semibold">{data.c6_medication ?? '-'}/3</span>
                </div>
                <div className="flex justify-between items-center col-span-2">
                  <span className="text-gray-600">C7. Dysfonctionnement diurne:</span>
                  <span className="font-semibold">{data.c7_daytime_dysfunction ?? '-'}/3</span>
                </div>
              </div>
            </div>

            {/* Sleep Efficiency Details */}
            {(data.sleep_efficiency_pct !== null && data.sleep_efficiency_pct !== undefined) && (
              <div className="pt-2 border-t">
                <h5 className="font-semibold text-gray-700 mb-2">Efficience du sommeil</h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          data.sleep_efficiency_pct >= 85 ? 'bg-green-500' :
                          data.sleep_efficiency_pct >= 75 ? 'bg-blue-500' :
                          data.sleep_efficiency_pct >= 65 ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(data.sleep_efficiency_pct, 100)}%` }}
                      />
                    </div>
                    <span className="font-semibold text-sm w-12 text-right">
                      {data.sleep_efficiency_pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {data.time_in_bed_hours !== null && data.time_in_bed_hours !== undefined && (
                      <span>Temps au lit: {data.time_in_bed_hours.toFixed(1)}h</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Sleep Quality Level */}
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Qualité du sommeil:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  data.total_score <= 5
                    ? 'bg-green-100 text-green-800'
                    : data.total_score <= 10
                    ? 'bg-blue-100 text-blue-800'
                    : data.total_score <= 15
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {data.total_score <= 5 ? 'Bonne' :
                   data.total_score <= 10 ? 'Altérée' :
                   data.total_score <= 15 ? 'Mauvaise' :
                   'Très mauvaise'}
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p><strong>PSQI:</strong> Pittsburgh Sleep Quality Index - Indice de Qualité du Sommeil</p>
              <p className="mt-1"><strong>Cotation:</strong> 7 composantes (0-3 chacune). Score total: 0-21</p>
              <p className="mt-1"><strong>Composantes:</strong> Qualité subjective, Latence, Durée, Efficience, Perturbations, Médication, Dysfonctionnement diurne</p>
              <p className="mt-1"><strong>Seuils:</strong> 0-5 (bonne) | 6-10 (altérée) | 11-15 (mauvaise) | 16-21 (très mauvaise)</p>
              <p className="mt-1 text-gray-600"><strong>Note:</strong> Score &gt; 5 indique une mauvaise qualité de sommeil cliniquement significative (Buysse et al., 1989)</p>
            </div>
          </div>
        )}

        {/* FAST Details */}
        {code === 'FAST' && (
          <div className="text-sm space-y-3 mt-2 pt-2 border-t">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Autonomie:</span>
                <span className={`font-semibold ${data.autonomy_score === null ? 'text-orange-600' : ''}`}>
                  {data.autonomy_score !== null && data.autonomy_score !== undefined ? `${data.autonomy_score}/12` : 'Questionnaire incomplet'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Activité pro.:</span>
                <span className={`font-semibold ${data.occupational_score === null ? 'text-orange-600' : ''}`}>
                  {data.occupational_score !== null && data.occupational_score !== undefined ? `${data.occupational_score}/15` : 'Questionnaire incomplet'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cognitif:</span>
                <span className={`font-semibold ${data.cognitive_score === null ? 'text-orange-600' : ''}`}>
                  {data.cognitive_score !== null && data.cognitive_score !== undefined ? `${data.cognitive_score}/15` : 'Questionnaire incomplet'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Finances:</span>
                <span className={`font-semibold ${data.financial_score === null ? 'text-orange-600' : ''}`}>
                  {data.financial_score !== null && data.financial_score !== undefined ? `${data.financial_score}/6` : 'Questionnaire incomplet'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Relations:</span>
                <span className={`font-semibold ${data.interpersonal_score === null ? 'text-orange-600' : ''}`}>
                  {data.interpersonal_score !== null && data.interpersonal_score !== undefined ? `${data.interpersonal_score}/18` : 'Questionnaire incomplet'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Loisirs:</span>
                <span className={`font-semibold ${data.leisure_score === null ? 'text-orange-600' : ''}`}>
                  {data.leisure_score !== null && data.leisure_score !== undefined ? `${data.leisure_score}/6` : 'Questionnaire incomplet'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-600 font-medium">Score Total:</span>
              <span className={`font-bold text-lg`}>
                {data.total_score !== null && data.total_score !== undefined ? `${data.total_score}/72` : 'Questionnaire incomplet'}
              </span>
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
