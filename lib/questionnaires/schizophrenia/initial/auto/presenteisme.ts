// ============================================================================
// eFondaMental Platform - Schizophrenia Initial Evaluation
// WHO-HPQ (Présentéisme) Questionnaire
// Health and Work Performance Questionnaire
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching schizophrenia_presenteisme table schema
// ============================================================================

export interface SchizophreniaPresenteismeResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Administration
  questionnaire_done?: string | null;  // 'Fait' | 'Non fait'
  
  // Work hours
  abs_b3?: number | null;      // Hours worked (7 days)
  abs_b4?: number | null;      // Expected weekly hours
  abs_b6?: number | null;      // Total hours (28 days)
  
  // Absenteeism
  abs_b5a?: number | null;     // Full days missed (health)
  abs_b5b?: number | null;     // Full days missed (other)
  abs_b5c?: number | null;     // Partial days missed (health)
  abs_b5d?: number | null;     // Partial days missed (other)
  abs_b5e?: number | null;     // Extra work days
  
  // Performance ratings (0-10)
  rad_abs_b9?: number | null;  // Colleague performance
  rad_abs_b10?: number | null; // Historical performance
  rad_abs_b11?: number | null; // Recent performance
  
  // Computed scores
  absenteisme_absolu?: number | null;
  absenteisme_relatif_pct?: number | null;
  performance_relative?: number | null;
  perte_performance?: number | null;
  productivite_pct?: number | null;
  interpretation?: string | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaPresenteismeResponseInsert = Omit<
  SchizophreniaPresenteismeResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 
  'absenteisme_absolu' | 'absenteisme_relatif_pct' | 'performance_relative' |
  'perte_performance' | 'productivite_pct' | 'interpretation'
>;

// ============================================================================
// Score Result Type
// ============================================================================

export interface PresenteismeSzScoreResult {
  absenteisme_absolu: number;
  absenteisme_relatif_pct: number;
  performance_relative: number;
  perte_performance: number;
  productivite_pct: number;
  interpretation: string;
}

// ============================================================================
// Options Constants
// ============================================================================

const PERFORMANCE_OPTIONS = [
  { code: 0, label: '0 - Performance la plus mauvaise', score: 0 },
  { code: 1, label: '1', score: 1 },
  { code: 2, label: '2', score: 2 },
  { code: 3, label: '3', score: 3 },
  { code: 4, label: '4', score: 4 },
  { code: 5, label: '5', score: 5 },
  { code: 6, label: '6', score: 6 },
  { code: 7, label: '7', score: 7 },
  { code: 8, label: '8', score: 8 },
  { code: 9, label: '9', score: 9 },
  { code: 10, label: '10 - Meilleure performance', score: 10 }
];

// ============================================================================
// Questions Dictionary
// ============================================================================

export const PRESENTEISME_SZ_QUESTIONS: Question[] = [
  // Administration
  {
    id: 'questionnaire_done',
    text: 'Passation du questionnaire',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'Fait', label: 'Fait' },
      { code: 'Non fait', label: 'Non fait' }
    ]
  },

  // Section header
  {
    id: 'titre_abs',
    text: 'Questions sur l\'absentéisme et le présentéisme',
    type: 'section',
    required: false,
    help: 'Ce questionnaire évalue l\'impact des problèmes de santé sur le travail au cours des 4 dernières semaines.',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },

  // Work hours section
  {
    id: 'section_heures',
    text: 'Heures de travail',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'abs_b3',
    text: 'B3. Combien d\'heures au total avez-vous travaillé au cours des 7 derniers jours?',
    type: 'number',
    required: false,
    min: 0,
    max: 97,
    help: 'Si plus de 97 heures, indiquer 97',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'abs_b4',
    text: 'B4. Combien d\'heures de travail votre employeur attend-il de vous au cours d\'une semaine typique de 7 jours?',
    type: 'number',
    required: false,
    min: 0,
    max: 97,
    help: 'Si ce nombre varie, estimer la moyenne. Si plus de 97 heures, indiquer 97',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },

  // Absenteeism section
  {
    id: 'titre_b5',
    text: 'Absentéisme (4 dernières semaines)',
    type: 'section',
    required: false,
    help: 'Merci de réfléchir à votre travail au cours des 4 dernières semaines (28 jours). Remplissez les cadres ci-dessous avec le nombre de jours passés dans chacune des situations de travail mentionnées.',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'abs_b5a',
    text: 'B5a. Durant les 4 dernières semaines (28 jours), combien de jours avez-vous manqué une journée entière de travail à cause d\'un problème de santé physique ou mentale?',
    type: 'number',
    required: false,
    min: 0,
    max: 28,
    help: 'Indiquer seulement les jours d\'absence dus à votre santé personnelle et non à cause de problèmes de santé de quelqu\'un d\'autre',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'abs_b5b',
    text: 'B5b. Durant les 4 dernières semaines (28 jours), combien de jours avez-vous manqué une journée entière de travail pour toute autre raison?',
    type: 'number',
    required: false,
    min: 0,
    max: 28,
    help: 'Y compris pour des vacances',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'abs_b5c',
    text: 'B5c. Durant les 4 dernières semaines (28 jours), combien de jours avez-vous manqué en partie une journée de travail à cause d\'un problème de santé physique ou mentale?',
    type: 'number',
    required: false,
    min: 0,
    max: 28,
    help: 'Indiquer seulement les jours d\'absence dus à votre santé personnelle et non à cause de problèmes de santé de quelqu\'un d\'autre',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'abs_b5d',
    text: 'B5d. Durant les 4 dernières semaines (28 jours), combien de jours avez-vous manqué en partie une journée de travail pour toute autre raison?',
    type: 'number',
    required: false,
    min: 0,
    max: 28,
    help: 'Y compris pour des vacances',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'abs_b5e',
    text: 'B5e. Durant les 4 dernières semaines (28 jours), combien de jours avez-vous eu à venir plus tôt, partir plus tard ou travailler pendant vos jours de repos?',
    type: 'number',
    required: false,
    min: 0,
    max: 28,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },

  // Total hours (28 days)
  {
    id: 'abs_b6',
    text: 'B6. Combien d\'heures au total avez-vous travaillé au cours des 4 dernières semaines (28 jours)?',
    type: 'number',
    required: false,
    min: 0,
    help: 'Exemples: 40h/sem × 4 = 160h ; 35h/sem × 4 = 140h ; 40h/sem × 4 - 2 jours (16h) = 144h',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },

  // Performance section
  {
    id: 'section_performance',
    text: 'Présentéisme - Évaluation de la performance',
    type: 'section',
    required: false,
    help: 'Sur une échelle de 0 à 10 où 0 est la plus mauvaise performance au travail possible à votre poste et 10 la meilleure performance possible.',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'rad_abs_b9',
    text: 'B9. Comment noteriez-vous la performance habituelle de la plupart des travailleurs à un poste similaire au vôtre?',
    type: 'single_choice',
    required: false,
    options: PERFORMANCE_OPTIONS,
    help: 'Performance de référence des collègues',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'rad_abs_b10',
    text: 'B10. Comment noteriez-vous votre performance habituelle pendant la ou les deux dernières années?',
    type: 'single_choice',
    required: false,
    options: PERFORMANCE_OPTIONS,
    help: 'Votre performance historique',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'rad_abs_b11',
    text: 'B11. Comment noteriez-vous votre performance globale pendant les jours où vous avez travaillé au cours de ces 4 dernières semaines (28 jours)?',
    type: 'single_choice',
    required: false,
    options: PERFORMANCE_OPTIONS,
    help: 'Votre performance récente',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const PRESENTEISME_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'presenteisme_sz',
  code: 'PRESENTEISME_SZ',
  title: 'WHO-HPQ - Présentéisme',
  description: 'Questionnaire sur l\'absentéisme et le présentéisme (WHO Health and Work Performance Questionnaire)',
  questions: PRESENTEISME_SZ_QUESTIONS,
  metadata: {
    pathologies: ['schizophrenia'],
    target_role: 'patient',
    version: 'WHO-HPQ',
    language: 'fr-FR',
    reference: 'Kessler RC, Barber C, Beck A, et al. The World Health Organization Health and Work Performance Questionnaire (HPQ). J Occup Environ Med. 2003;45(2):156-174.'
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Compute WHO-HPQ derived measures for absenteeism and presenteeism
 * 
 * Formulas:
 * - Absentéisme absolu: B5a + B5c (days missed for health reasons)
 * - Absentéisme relatif: ((B4 × 4) - B6) / (B4 × 4) × 100 (% hours lost)
 * - Performance relative: B11 - B9 (vs colleagues)
 * - Perte de performance: B10 - B11 (presenteeism indicator)
 * - Productivité %: (B11/10) × 100
 */
export function computePresenteismeSzScores(responses: Record<string, any>): PresenteismeSzScoreResult {
  // Absentéisme absolu: B5a + B5c (total days missed for health)
  const b5a = responses.abs_b5a ?? 0;
  const b5c = responses.abs_b5c ?? 0;
  const absenteismeAbsolu = b5a + b5c;
  
  // Absentéisme relatif: ((B4 × 4) - B6) / (B4 × 4) × 100
  const b4 = responses.abs_b4 ?? 0;
  const b6 = responses.abs_b6 ?? 0;
  const expectedHours = b4 * 4; // Expected hours over 4 weeks
  let absenteismeRelatif = 0;
  if (expectedHours > 0) {
    absenteismeRelatif = ((expectedHours - b6) / expectedHours) * 100;
    // Clamp to reasonable range
    absenteismeRelatif = Math.max(-100, Math.min(100, absenteismeRelatif));
  }
  
  // Performance scores
  const b9 = responses.rad_abs_b9 ?? 0;   // Colleague reference
  const b10 = responses.rad_abs_b10 ?? 0; // Historical self
  const b11 = responses.rad_abs_b11 ?? 0; // Recent self
  
  // Performance relative: B11 - B9 (vs colleagues)
  // Positive = better than colleagues, negative = worse than colleagues
  const performanceRelative = b11 - b9;
  
  // Perte de performance: B10 - B11 (presenteeism indicator)
  // Positive = recent decline, negative = recent improvement
  const pertePerformance = b10 - b11;
  
  // Productivité %: (B11/10) × 100
  const productivitePct = (b11 / 10) * 100;
  
  return {
    absenteisme_absolu: absenteismeAbsolu,
    absenteisme_relatif_pct: Math.round(absenteismeRelatif * 100) / 100,
    performance_relative: performanceRelative,
    perte_performance: pertePerformance,
    productivite_pct: productivitePct,
    interpretation: interpretPresenteismeSzScore(
      absenteismeAbsolu,
      absenteismeRelatif,
      performanceRelative,
      pertePerformance,
      productivitePct
    )
  };
}

/**
 * Generate clinical interpretation for WHO-HPQ scores
 */
export function interpretPresenteismeSzScore(
  absenteismeAbsolu: number,
  absenteismeRelatif: number,
  performanceRelative: number,
  pertePerformance: number,
  productivitePct: number
): string {
  const sections: string[] = [];
  
  // Absenteeism interpretation
  sections.push('=== ABSENTÉISME ===');
  if (absenteismeAbsolu === 0) {
    sections.push(`Absentéisme absolu: ${absenteismeAbsolu} jour(s) d'absence pour raison de santé - Aucune absence pour raison de santé.`);
  } else if (absenteismeAbsolu <= 2) {
    sections.push(`Absentéisme absolu: ${absenteismeAbsolu} jour(s) d'absence pour raison de santé - Absentéisme faible.`);
  } else if (absenteismeAbsolu <= 5) {
    sections.push(`Absentéisme absolu: ${absenteismeAbsolu} jour(s) d'absence pour raison de santé - Absentéisme modéré.`);
  } else {
    sections.push(`Absentéisme absolu: ${absenteismeAbsolu} jour(s) d'absence pour raison de santé - Absentéisme élevé, nécessite une attention clinique.`);
  }
  
  if (absenteismeRelatif <= 0) {
    sections.push(`Absentéisme relatif: ${absenteismeRelatif.toFixed(1)}% - Heures travaillées conformes ou supérieures aux attentes.`);
  } else if (absenteismeRelatif <= 10) {
    sections.push(`Absentéisme relatif: ${absenteismeRelatif.toFixed(1)}% - Légère réduction des heures travaillées.`);
  } else if (absenteismeRelatif <= 25) {
    sections.push(`Absentéisme relatif: ${absenteismeRelatif.toFixed(1)}% - Réduction modérée des heures travaillées.`);
  } else {
    sections.push(`Absentéisme relatif: ${absenteismeRelatif.toFixed(1)}% - Réduction importante des heures travaillées.`);
  }
  
  // Performance interpretation
  sections.push('\n=== PRÉSENTÉISME ===');
  
  // Performance vs colleagues
  if (performanceRelative > 0) {
    sections.push(`Performance relative: ${performanceRelative > 0 ? '+' : ''}${performanceRelative} (vs collègues) - Performance auto-évaluée supérieure à celle des collègues.`);
  } else if (performanceRelative === 0) {
    sections.push(`Performance relative: ${performanceRelative} (vs collègues) - Performance similaire à celle des collègues.`);
  } else {
    sections.push(`Performance relative: ${performanceRelative} (vs collègues) - Performance auto-évaluée inférieure à celle des collègues.`);
  }
  
  // Recent performance decline (presenteeism)
  if (pertePerformance > 0) {
    sections.push(`Perte de performance récente: ${pertePerformance} point(s) - Indicateur de présentéisme : performance récente inférieure à l'historique.`);
  } else if (pertePerformance === 0) {
    sections.push(`Perte de performance récente: ${pertePerformance} point(s) - Performance stable par rapport à l'historique.`);
  } else {
    sections.push(`Perte de performance récente: ${pertePerformance} point(s) - Amélioration récente de la performance.`);
  }
  
  // Productivity
  sections.push(`\nProductivité globale: ${productivitePct.toFixed(0)}%`);
  if (productivitePct >= 80) {
    sections.push('Niveau de productivité satisfaisant.');
  } else if (productivitePct >= 60) {
    sections.push('Niveau de productivité modérément réduit.');
  } else if (productivitePct >= 40) {
    sections.push('Niveau de productivité significativement réduit. Impact fonctionnel probable.');
  } else {
    sections.push('Niveau de productivité très réduit. Intervention recommandée.');
  }
  
  // Overall summary
  sections.push('\n=== SYNTHÈSE ===');
  const hasAbsenteeism = absenteismeAbsolu > 2 || absenteismeRelatif > 10;
  const hasPresenteeism = pertePerformance > 1 || productivitePct < 60;
  
  if (!hasAbsenteeism && !hasPresenteeism) {
    sections.push('Fonctionnement professionnel préservé. Pas de préoccupation majeure concernant l\'impact sur le travail.');
  } else if (hasAbsenteeism && hasPresenteeism) {
    sections.push('Impact significatif sur le fonctionnement professionnel : présence d\'absentéisme ET de présentéisme. Évaluation approfondie recommandée.');
  } else if (hasAbsenteeism) {
    sections.push('Absentéisme notable sans présentéisme majeur. Évaluer les facteurs contribuant aux absences.');
  } else {
    sections.push('Présentéisme notable : le patient travaille mais avec une performance réduite. Évaluer l\'adaptation du poste ou la charge de travail.');
  }
  
  return sections.join('\n');
}
