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
              {code === 'ALDA' && 'Score Alda'}
              {code === 'CGI' && 'Résultats CGI'}
              {code === 'WAIS4_MATRICES_FR' && 'Résultats WAIS-IV Matrices'}
              {code === 'CVLT_FR' && 'Résultats CVLT'}
              {code === 'WAIS4_CODE_FR' && 'Résultats WAIS-IV Code'}
              {code === 'WAIS_IV_CODE_SYMBOLES_IVT' && 'Résultats WAIS-IV Code, Symboles & IVT'}
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
                : (data.total_score !== undefined ? data.total_score : '-')}
              {code === 'ASRM_FR' && '/20'}
              {code === 'QIDS_SR16_FR' && '/27'}
              {code === 'CTQ_FR' && '/125'}
              {code === 'BIS10_FR' && '/4.0'}
              {code === 'ALDA' && '/10'}
              {code === 'CGI' && '/7'}
              {code === 'WAIS4_MATRICES_FR' && '/19'}
              {code === 'CVLT_FR' && '/80'}
              {code === 'WAIS4_CODE_FR' && '/19'}
              {code === 'WAIS_IV_CODE_SYMBOLES_IVT' && (data.wais_ivt !== undefined && data.wais_ivt !== null ? '/150' : '/19')}
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
