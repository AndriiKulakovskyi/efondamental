// eFondaMental Platform - Questionnaire Scoring Utilities

import { QuestionnaireAnswers, ScoringRules, ScoreResult, ScreeningResult } from './types';

export function calculateScore(
  code: string,
  answers: QuestionnaireAnswers,
  scoringRules: ScoringRules
): ScoreResult | ScreeningResult {
  switch (code) {
    case 'ASRM_FR':
      return calculateASRMScore(answers, scoringRules);
    case 'QIDS_SR16_FR':
      return calculateQIDSScore(answers, scoringRules);
    case 'MDQ_FR':
      return calculateMDQScreening(answers);
    default:
      throw new Error(`Unknown questionnaire code: ${code}`);
  }
}

export function calculateASRMScore(
  answers: QuestionnaireAnswers,
  scoringRules: ScoringRules
): ScoreResult {
  // Simple sum of all 5 items (q1 through q5)
  const total = [1, 2, 3, 4, 5].reduce((sum, i) => {
    return sum + (answers[`q${i}`] || 0);
  }, 0);

  const cutoff = 6;
  const probability = total >= cutoff
    ? "Probabilité élevée d'épisode maniaque/hypomaniaque"
    : "Probabilité faible d'épisode maniaque/hypomaniaque";

  let interpretation = `Score total: ${total}/20. ${probability}. `;

  // Add severity context
  const clinical_alerts: string[] = [];
  if (total >= 12) {
    interpretation += "Score très élevé suggérant des symptômes maniaques marqués. ";
    clinical_alerts.push("Score très élevé - symptômes maniaques marqués");
  } else if (total >= 6) {
    interpretation += "Score élevé suggérant des symptômes maniaques/hypomaniaques. ";
    clinical_alerts.push("Score élevé - évaluation clinique recommandée");
  } else {
    interpretation += "Score sous le seuil, pas d'indication actuelle de manie/hypomanie. ";
  }

  // Check for multiple maximum scores
  const maxScores = [1, 2, 3, 4, 5].filter(i => answers[`q${i}`] === 4).length;
  if (maxScores >= 3) {
    const warning = "Trois items ou plus au maximum (score 4) - suggère des symptômes maniaques sévères. Évaluation clinique urgente recommandée.";
    interpretation += warning + " ";
    clinical_alerts.push("URGENT: 3+ items au score maximum");
  }

  if (total >= cutoff) {
    interpretation += "Une évaluation clinique approfondie est recommandée.";
  }

  return {
    total_score: total,
    probability,
    interpretation: interpretation.trim(),
    range: [0, 20],
    clinical_alerts
  };
}

export function calculateQIDSScore(
  answers: QuestionnaireAnswers,
  scoringRules: ScoringRules
): ScoreResult {
  // Calculate domain scores using max aggregation for grouped domains
  const sleepDomain = Math.max(
    answers['q1'] || 0,
    answers['q2'] || 0,
    answers['q3'] || 0,
    answers['q4'] || 0
  );

  const appetiteWeightDomain = Math.max(
    answers['q6'] || 0,
    answers['q7'] || 0,
    answers['q8'] || 0,
    answers['q9'] || 0
  );

  const psychomotorDomain = Math.max(
    answers['q15'] || 0,
    answers['q16'] || 0
  );

  // Direct items
  const sadness = answers['q5'] || 0;
  const concentration = answers['q10'] || 0;
  const selfView = answers['q11'] || 0;
  const suicidalIdeation = answers['q12'] || 0;
  const interest = answers['q13'] || 0;
  const energy = answers['q14'] || 0;

  // Total score (sum of 9 domains)
  const total = sleepDomain + sadness + appetiteWeightDomain + 
                concentration + selfView + suicidalIdeation + 
                interest + energy + psychomotorDomain;

  // Determine severity
  const cutoffs = [
    [0, 5, "Pas de dépression"],
    [6, 10, "Dépression légère"],
    [11, 15, "Dépression modérée"],
    [16, 20, "Dépression sévère"],
    [21, 27, "Dépression très sévère"],
  ] as const;

  let severity = "Inconnu";
  for (const [lo, hi, label] of cutoffs) {
    if (total >= lo && total <= hi) {
      severity = label;
      break;
    }
  }

  let interpretation = `Score total: ${total}/27 - ${severity}. `;
  const clinical_alerts: string[] = [];

  // Critical alert for suicidal ideation
  if (suicidalIdeation >= 2) {
    const alert = "ALERTE: Idéation suicidaire présente - évaluation clinique urgente requise.";
    interpretation += alert + " ";
    clinical_alerts.push(alert);
  }

  return {
    total_score: total,
    severity,
    domain_scores: {
      sleep: sleepDomain,
      sadness,
      appetite_weight: appetiteWeightDomain,
      concentration,
      self_view: selfView,
      suicidal_ideation: suicidalIdeation,
      interest,
      energy,
      psychomotor: psychomotorDomain
    },
    interpretation: interpretation.trim(),
    range: [0, 27],
    clinical_alerts
  };
}

export function calculateMDQScreening(answers: QuestionnaireAnswers): ScreeningResult {
  // Calculate Q1 total (sum of 13 yes/no items)
  const q1Items = Array.from({ length: 13 }, (_, i) => `q1_${i + 1}`);
  const q1Total = q1Items.reduce((sum, id) => sum + (answers[id] || 0), 0);

  // Get Q2 and Q3 values (only if Q1 >= 2)
  const q2Concurrent = q1Total >= 2 ? (answers['q2'] === 1) : false;
  const q3Impact = q1Total >= 2 ? (answers['q3'] || 0) : 0;

  const impactLabels: Record<number, string> = {
    0: "Pas de problème",
    1: "Problème mineur",
    2: "Problème moyen",
    3: "Problème sérieux"
  };
  const q3ImpactLabel = impactLabels[q3Impact] || "Non évalué";

  // Screening criteria: Q1 >= 7 AND Q2 = yes AND Q3 >= 2
  const isPositive = q1Total >= 7 && q2Concurrent && q3Impact >= 2;
  const screeningResult = isPositive ? "POSITIF" : "NEGATIF";

  let interpretation = `MDQ ${screeningResult}. `;
  interpretation += `Symptômes Q1: ${q1Total}/13. `;
  interpretation += `Simultanéité (Q2): ${q2Concurrent ? 'Oui' : 'Non'}. `;
  interpretation += `Impact fonctionnel (Q3): ${q3ImpactLabel}. `;

  const clinical_alerts: string[] = [];

  if (isPositive) {
    interpretation += 
      "Ce résultat suggère la présence possible d'un trouble du spectre bipolaire. " +
      "Une évaluation clinique approfondie est recommandée.";
    clinical_alerts.push("Dépistage MDQ positif - évaluation approfondie recommandée");
  } else {
    interpretation += 
      "Ce résultat ne suggère pas de trouble du spectre bipolaire au moment du dépistage. ";
    
    // Add specific feedback for negative results
    if (q1Total >= 7 && !q2Concurrent) {
      interpretation += "Note: Symptômes présents mais non simultanés. ";
    } else if (q1Total >= 7 && q3Impact < 2) {
      interpretation += "Note: Symptômes présents mais impact fonctionnel limité. ";
    }
  }

  return {
    q1_total: q1Total,
    q2_concurrent: q2Concurrent,
    q3_impact_level: q3Impact,
    q3_impact_label: q3ImpactLabel,
    screening_result: screeningResult,
    interpretation: interpretation.trim(),
    clinical_alerts
  };
}

