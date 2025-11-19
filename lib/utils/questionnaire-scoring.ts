// eFondaMental Platform - Questionnaire Scoring Utilities
// Centralized scoring functions for all questionnaires

import { QuestionnaireAnswers, ScoreResult, ScreeningResult } from '@/lib/questionnaires/types';
import * as scoring from '@/lib/questionnaires/scoring';

export { calculateScore } from '@/lib/questionnaires/scoring';

export function interpretScore(
  code: string,
  score: number
): string {
  switch (code) {
    case 'ASRM_FR':
      if (score >= 12) return "Symptômes maniaques sévères";
      if (score >= 6) return "Symptômes maniaques/hypomaniaques";
      return "Pas de symptômes maniaques";

    case 'QIDS_SR16_FR':
      if (score >= 21) return "Dépression très sévère";
      if (score >= 16) return "Dépression sévère";
      if (score >= 11) return "Dépression modérée";
      if (score >= 6) return "Dépression légère";
      return "Pas de dépression";

    default:
      return "Score: " + score;
  }
}

export function hasClinicalAlerts(result: ScoreResult | ScreeningResult): boolean {
  return result.clinical_alerts && result.clinical_alerts.length > 0;
}

export function getClinicalAlertSeverity(
  result: ScoreResult | ScreeningResult
): 'info' | 'warning' | 'error' {
  if (!result.clinical_alerts || result.clinical_alerts.length === 0) {
    return 'info';
  }

  const alerts = result.clinical_alerts;
  
  // Check for urgent/critical alerts
  if (alerts.some(alert => 
    alert.includes('URGENT') || 
    alert.includes('ALERTE') ||
    alert.includes('suicidaire')
  )) {
    return 'error';
  }

  // Check for warnings
  if (alerts.some(alert => 
    alert.includes('évaluation') ||
    alert.includes('recommandée')
  )) {
    return 'warning';
  }

  return 'info';
}

