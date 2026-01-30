// ============================================================================
// eFondaMental Platform - Schizophrenia Initial Evaluation
// SOGS - South Oaks Gambling Screen (35 items)
// Lesieur HR, Blume SB. Am J Psychiatry. 1987 / French adaptation: Lejoyeux 1999
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching schizophrenia_sogs table schema
// ============================================================================

export interface SchizophreniaSogsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Administration status
  questionnaire_done?: string | null; // 'Fait' | 'Non fait'
  
  // Q1a-g: Types of gambling (not scored)
  rad_sogs1a?: string | null;
  rad_sogs1b?: string | null;
  rad_sogs1c?: string | null;
  rad_sogs1d?: string | null;
  rad_sogs1e?: string | null;
  rad_sogs1f?: string | null;
  rad_sogs1g?: string | null;
  
  // Q2: Maximum amount (text, not scored)
  sogs2?: string | null;
  
  // Q3: Family history (not scored)
  rad_sogs3?: string | null;
  chk_sogs3a?: string | null; // Multiple choice stored as comma-separated
  
  // Q4-Q15: Main scoring items
  rad_sogs4?: string | null;
  rad_sogs5?: string | null;
  rad_sogs6?: string | null;
  rad_sogs7?: string | null;
  rad_sogs8?: string | null;
  rad_sogs9?: string | null;
  rad_sogs10?: string | null;
  rad_sogs11?: string | null;
  rad_sogs12?: string | null; // Filter question, not scored
  rad_sogs13?: string | null;
  rad_sogs14?: string | null;
  rad_sogs15?: string | null;
  
  // Q16: Main gate question + sub-items
  rad_sogs16?: string | null;
  rad_sogs16a?: string | null;
  rad_sogs16b?: string | null;
  rad_sogs16c?: string | null;
  rad_sogs16d?: string | null;
  rad_sogs16e?: string | null;
  rad_sogs16f?: string | null;
  rad_sogs16g?: string | null;
  rad_sogs16h?: string | null;
  rad_sogs16i?: string | null;
  rad_sogs16j?: string | null; // Not scored
  rad_sogs16k?: string | null; // Not scored
  
  // Computed scores
  total_score?: number | null;        // 0-20
  gambling_severity?: string | null;  // no_problem, at_risk, pathological
  interpretation?: string | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaSogsResponseInsert = Omit<
  SchizophreniaSogsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  'total_score' | 'gambling_severity' | 'interpretation'
>;

// ============================================================================
// Scoring Configuration
// ============================================================================

// Clinical thresholds
const THRESHOLDS = {
  NO_PROBLEM: { min: 0, max: 2, label: 'Pas de problème de jeu', severity: 'no_problem' },
  AT_RISK: { min: 3, max: 4, label: 'Joueur à risque', severity: 'at_risk' },
  PATHOLOGICAL: { min: 5, max: 20, label: 'Joueur pathologique probable', severity: 'pathological' },
};

// ============================================================================
// Scoring Functions
// ============================================================================

export interface SogsSzScoreResult {
  total_score: number;
  gambling_severity: string;
  interpretation: string;
}

/**
 * Score Q4 (chasing): Any response except "Jamais" = 1 point
 */
function scoreQ4(value: string | null | undefined): number {
  if (!value || value === 'Jamais') return 0;
  return 1;
}

/**
 * Score Q5, Q6: First option = 0, others = 1
 */
function scoreQ5Q6(value: string | null | undefined, firstOption: string): number {
  if (!value) return 0;
  return value === firstOption ? 0 : 1;
}

/**
 * Score Yes/No questions (Q7-15, Q16a-i): Oui = 1, Non = 0
 */
function scoreYesNo(value: string | null | undefined): number {
  return value === 'Oui' ? 1 : 0;
}

/**
 * Compute SOGS total score from responses
 */
export function computeSogsSzScores(responses: Record<string, any>): SogsSzScoreResult {
  let total = 0;
  
  // Q4: Any non-"Jamais" response = 1
  total += scoreQ4(responses.rad_sogs4);
  
  // Q5: First option "Jamais (ou je n'ai jamais joué)" = 0, others = 1
  total += scoreQ5Q6(responses.rad_sogs5, "Jamais (ou je n'ai jamais joué)");
  
  // Q6: First option "Non" = 0, others = 1
  total += scoreQ5Q6(responses.rad_sogs6, 'Non');
  
  // Q7-Q11: Yes/No scoring
  total += scoreYesNo(responses.rad_sogs7);
  total += scoreYesNo(responses.rad_sogs8);
  total += scoreYesNo(responses.rad_sogs9);
  total += scoreYesNo(responses.rad_sogs10);
  total += scoreYesNo(responses.rad_sogs11);
  
  // Q12 is NOT scored (filter question)
  
  // Q13-Q15: Yes/No scoring
  total += scoreYesNo(responses.rad_sogs13);
  total += scoreYesNo(responses.rad_sogs14);
  total += scoreYesNo(responses.rad_sogs15);
  
  // Q16 sub-items: Only scored if Q16 = "Oui"
  if (responses.rad_sogs16 === 'Oui') {
    total += scoreYesNo(responses.rad_sogs16a);
    total += scoreYesNo(responses.rad_sogs16b);
    total += scoreYesNo(responses.rad_sogs16c);
    total += scoreYesNo(responses.rad_sogs16d);
    total += scoreYesNo(responses.rad_sogs16e);
    total += scoreYesNo(responses.rad_sogs16f);
    total += scoreYesNo(responses.rad_sogs16g);
    total += scoreYesNo(responses.rad_sogs16h);
    total += scoreYesNo(responses.rad_sogs16i);
    // Q16j and Q16k are NOT scored
  }
  
  // Determine severity
  let gambling_severity: string;
  let severityLabel: string;
  
  if (total <= THRESHOLDS.NO_PROBLEM.max) {
    gambling_severity = THRESHOLDS.NO_PROBLEM.severity;
    severityLabel = THRESHOLDS.NO_PROBLEM.label;
  } else if (total <= THRESHOLDS.AT_RISK.max) {
    gambling_severity = THRESHOLDS.AT_RISK.severity;
    severityLabel = THRESHOLDS.AT_RISK.label;
  } else {
    gambling_severity = THRESHOLDS.PATHOLOGICAL.severity;
    severityLabel = THRESHOLDS.PATHOLOGICAL.label;
  }
  
  return {
    total_score: total,
    gambling_severity,
    interpretation: interpretSogsSzScore(total, severityLabel),
  };
}

/**
 * Generate interpretation text based on score
 */
export function interpretSogsSzScore(totalScore: number, severityLabel: string): string {
  let interpretation = `Score SOGS : ${totalScore}/20\n`;
  interpretation += `Classification : ${severityLabel}\n\n`;
  
  if (totalScore <= 2) {
    interpretation += 'Le score ne suggère pas de problème de jeu significatif. ';
    interpretation += 'Cependant, une vigilance peut être maintenue si des facteurs de risque sont présents.';
  } else if (totalScore <= 4) {
    interpretation += 'Le score suggère un comportement de jeu à risque. ';
    interpretation += 'Une évaluation plus approfondie est recommandée pour déterminer si une intervention préventive est nécessaire.';
  } else {
    interpretation += 'Le score suggère un jeu pathologique probable (≥5 points). ';
    interpretation += 'Une évaluation clinique complète et une prise en charge spécialisée en addictologie sont recommandées. ';
    interpretation += 'Le SOGS est un outil de dépistage ; un diagnostic formel nécessite un entretien clinique.';
  }
  
  return interpretation;
}

// ============================================================================
// Question Options
// ============================================================================

const QUESTIONNAIRE_DONE_OPTIONS = [
  { code: 'Fait', label: 'Fait' },
  { code: 'Non fait', label: 'Non fait' },
];

const GAMBLING_FREQUENCY_OPTIONS = [
  { code: 'Jamais', label: 'Jamais' },
  { code: "Moins d'une fois par semaine", label: "Moins d'une fois par semaine" },
  { code: 'Au moins une fois par semaine', label: 'Au moins une fois par semaine' },
];

const YES_NO_OPTIONS = [
  { code: 'Oui', label: 'Oui' },
  { code: 'Non', label: 'Non' },
];

const Q4_OPTIONS = [
  { code: 'Jamais', label: 'Jamais', score: 0 },
  { code: "Quelquefois (moins de la moitié des fois où j'ai perdu)", label: "Quelquefois (moins de la moitié des fois où j'ai perdu)", score: 1 },
  { code: 'La plupart des fois où je perds', label: 'La plupart des fois où je perds', score: 1 },
  { code: 'A chaque fois que je perds', label: 'A chaque fois que je perds', score: 1 },
];

const Q5_OPTIONS = [
  { code: "Jamais (ou je n'ai jamais joué)", label: "Jamais (ou je n'ai jamais joué)", score: 0 },
  { code: "Oui, moins de la moitié des fois où j'ai perdu", label: "Oui, moins de la moitié des fois où j'ai perdu", score: 1 },
  { code: 'Oui, la plupart du temps', label: 'Oui, la plupart du temps', score: 1 },
];

const Q6_OPTIONS = [
  { code: 'Non', label: 'Non', score: 0 },
  { code: "Oui, il y a quelques mois mais pas actuellement", label: "Oui, il y a quelques mois mais pas actuellement", score: 1 },
  { code: 'Oui', label: 'Oui', score: 1 },
];

const FAMILY_MEMBERS_OPTIONS = [
  { code: 'Père', label: 'Père' },
  { code: 'Mère', label: 'Mère' },
  { code: 'Frères ou soeurs', label: 'Frères ou sœurs' },
  { code: 'Enfants', label: 'Enfants' },
  { code: 'Grands-parents', label: 'Grands-parents' },
  { code: 'Epoux ou concubin', label: 'Époux ou concubin' },
  { code: 'Ami ou autre personne importante de votre vie', label: 'Ami ou autre personne importante de votre vie' },
  { code: 'Autres personnes de votre famille', label: 'Autres personnes de votre famille' },
];

// ============================================================================
// Questions Array
// ============================================================================

export const SOGS_SZ_QUESTIONS: Question[] = [
  // Administration status
  {
    id: 'questionnaire_done',
    text: 'Passation du questionnaire',
    type: 'single_choice',
    required: true,
    options: QUESTIONNAIRE_DONE_OPTIONS,
  },
  
  // ========== SECTION 1: TYPES OF GAMBLING ==========
  {
    id: 'section_types_jeux',
    text: '1. Veuillez indiquer à quels types de jeux vous avez déjà joué dans votre vie, via internet ou non. Pour chacun, répondez « jamais », « moins d\'une fois par semaine » ou « au moins une fois par semaine » selon le cas.',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'rad_sogs1a',
    text: 'A. Paris sur des chevaux, ou d\'autres animaux (en ligne ou à l\'hippodrome)',
    type: 'single_choice',
    required: false,
    options: GAMBLING_FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'types_jeux',
  },
  {
    id: 'rad_sogs1b',
    text: 'B. Paris sportifs (sur des résultats d\'évènements : type loto sport)',
    type: 'single_choice',
    required: false,
    options: GAMBLING_FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'types_jeux',
  },
  {
    id: 'rad_sogs1c',
    text: 'C. Jeux de casino (légal ou non)',
    type: 'single_choice',
    required: false,
    options: GAMBLING_FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'types_jeux',
  },
  {
    id: 'rad_sogs1d',
    text: 'D. Loto ou loterie',
    type: 'single_choice',
    required: false,
    options: GAMBLING_FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'types_jeux',
  },
  {
    id: 'rad_sogs1e',
    text: 'E. Bingo pour de l\'argent',
    type: 'single_choice',
    required: false,
    options: GAMBLING_FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'types_jeux',
  },
  {
    id: 'rad_sogs1f',
    text: 'F. Jeux sur machines (machines à sous, vidéo poker, etc.)',
    type: 'single_choice',
    required: false,
    options: GAMBLING_FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'types_jeux',
  },
  {
    id: 'rad_sogs1g',
    text: 'G. Autres jeux (ex : jeux à gratter)',
    type: 'single_choice',
    required: false,
    options: GAMBLING_FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'types_jeux',
  },
  
  // ========== SECTION 2: MAXIMUM AMOUNT ==========
  {
    id: 'section_montant',
    text: 'Montant maximal',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'sogs2',
    text: '2. Quel est le plus gros montant d\'argent que vous avez joué ou parié en une seule journée ?',
    type: 'text',
    required: false,
    placeholder: 'Ex: 50€, 100€...',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'montant',
  },
  
  // ========== SECTION 3: FAMILY HISTORY ==========
  {
    id: 'section_antecedents',
    text: 'Antécédents familiaux',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'rad_sogs3',
    text: '3. Certains membres de votre famille ont-ils déjà eu des problèmes de jeu ?',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'antecedents',
  },
  {
    id: 'chk_sogs3a',
    text: 'Précisez',
    type: 'multiple_choice',
    required: false,
    options: FAMILY_MEMBERS_OPTIONS,
    display_if: { '==': [{ var: 'rad_sogs3' }, 'Oui'] },
    section: 'antecedents',
  },
  
  // ========== SECTION 4: SCORED ITEMS ==========
  {
    id: 'section_items_scores',
    text: 'Questions sur vos habitudes de jeu au cours des 12 derniers mois',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'rad_sogs4',
    text: '4. Lorsque vous avez joué au cours des 12 derniers mois, combien de fois êtes-vous retourné au jeu un autre jour pour vous refaire, c\'est-à-dire pour regagner l\'argent perdu auparavant ?',
    type: 'single_choice',
    required: false,
    options: Q4_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'items_scores',
    help: 'Scored: Any response except "Jamais" = 1 point',
  },
  {
    id: 'rad_sogs5',
    text: '5. Avez-vous prétendu, au cours des 12 derniers mois, avoir gagné de l\'argent alors qu\'en réalité vous en aviez perdu ?',
    type: 'single_choice',
    required: false,
    options: Q5_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'items_scores',
    help: 'Scored: First option = 0, others = 1',
  },
  {
    id: 'rad_sogs6',
    text: '6. Pensez-vous avoir eu un problème de jeu au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: Q6_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'items_scores',
    help: 'Scored: First option = 0, others = 1',
  },
  {
    id: 'rad_sogs7',
    text: '7. Au cours des 12 derniers mois, avez-vous déjà joué ou parié plus que vous n\'en aviez l\'intention ?',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'items_scores',
    help: 'Scored: Oui = 1, Non = 0',
  },
  {
    id: 'rad_sogs8',
    text: '8. Est-ce que des personnes ont déjà critiqué vos habitudes de jeu au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'items_scores',
    help: 'Scored: Oui = 1, Non = 0',
  },
  {
    id: 'rad_sogs9',
    text: '9. Au cours des 12 derniers mois, vous êtes-vous déjà senti coupable à cause de la façon dont vous jouez ou à cause de ce qui se produit lorsque vous jouez ?',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'items_scores',
    help: 'Scored: Oui = 1, Non = 0',
  },
  {
    id: 'rad_sogs10',
    text: '10. Au cours des 12 derniers mois, avez-vous envisagé d\'arrêter de jouer tout en pensant que vous en étiez incapable ?',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'items_scores',
    help: 'Scored: Oui = 1, Non = 0',
  },
  {
    id: 'rad_sogs11',
    text: '11. Au cours des 12 derniers mois, avez-vous caché des billets de loterie, de l\'argent de jeu ou d\'autres signes de jeu à votre conjoint, à vos enfants ou à d\'autres personnes importantes dans votre vie ?',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'items_scores',
    help: 'Scored: Oui = 1, Non = 0',
  },
  {
    id: 'rad_sogs12',
    text: '12. Au cours des 12 derniers mois, vous êtes-vous disputé avec des personnes vivant avec vous à propos de la manière dont vous gérez votre argent ?',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'items_scores',
    help: 'NOT scored - filter question for Q13',
  },
  {
    id: 'rad_sogs13',
    text: '13. (Si vous avez répondu oui à la question 12) : Est-ce que ces disputes concernaient vos habitudes de jeu ?',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'rad_sogs12' }, 'Oui'] },
    section: 'items_scores',
    help: 'Scored: Oui = 1, Non = 0',
  },
  {
    id: 'rad_sogs14',
    text: '14. Au cours des 12 derniers mois, avez-vous emprunté de l\'argent que vous n\'avez pas remboursé à cause du jeu ?',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'items_scores',
    help: 'Scored: Oui = 1, Non = 0',
  },
  {
    id: 'rad_sogs15',
    text: '15. Au cours des 12 derniers mois, vous êtes-vous absenté de votre travail (ou de l\'école) en raison du jeu ?',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'items_scores',
    help: 'Scored: Oui = 1, Non = 0',
  },
  
  // ========== SECTION 5: BORROWING SOURCES ==========
  {
    id: 'section_emprunts',
    text: 'Sources d\'emprunt',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'rad_sogs16',
    text: '16. Avez-vous emprunté de l\'argent au cours des 12 derniers mois pour jouer ou payer des dettes de jeu ?',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'emprunts',
    help: 'Gate question - if "Oui", sub-items are shown and scored',
  },
  {
    id: 'instruction_q16_sources',
    text: 'Si oui, d\'où provenait cet argent ?',
    type: 'instruction',
    required: false,
    display_if: { '==': [{ var: 'rad_sogs16' }, 'Oui'] },
  },
  {
    id: 'rad_sogs16a',
    text: 'A) De votre budget familial',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'rad_sogs16' }, 'Oui'] },
    section: 'emprunts_sources',
    help: 'Scored: Oui = 1, Non = 0',
  },
  {
    id: 'rad_sogs16b',
    text: 'B) De votre conjoint, ami',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'rad_sogs16' }, 'Oui'] },
    section: 'emprunts_sources',
    help: 'Scored: Oui = 1, Non = 0',
  },
  {
    id: 'rad_sogs16c',
    text: 'C) Des membres de votre famille ou de votre belle-famille',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'rad_sogs16' }, 'Oui'] },
    section: 'emprunts_sources',
    help: 'Scored: Oui = 1, Non = 0',
  },
  {
    id: 'rad_sogs16d',
    text: 'D) De banques, de sociétés de crédit ou d\'institutions de prêts',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'rad_sogs16' }, 'Oui'] },
    section: 'emprunts_sources',
    help: 'Scored: Oui = 1, Non = 0',
  },
  {
    id: 'rad_sogs16e',
    text: 'E) De cartes de crédit',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'rad_sogs16' }, 'Oui'] },
    section: 'emprunts_sources',
    help: 'Scored: Oui = 1, Non = 0',
  },
  {
    id: 'rad_sogs16f',
    text: 'F) De prêteurs sur gages, de prêts usuraires (shylocks)',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'rad_sogs16' }, 'Oui'] },
    section: 'emprunts_sources',
    help: 'Scored: Oui = 1, Non = 0',
  },
  {
    id: 'rad_sogs16g',
    text: 'G) De vente d\'actions, de bons d\'épargne ou d\'autres titres',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'rad_sogs16' }, 'Oui'] },
    section: 'emprunts_sources',
    help: 'Scored: Oui = 1, Non = 0',
  },
  {
    id: 'rad_sogs16h',
    text: 'H) De la vente de propriétés personnelles ou familiales',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'rad_sogs16' }, 'Oui'] },
    section: 'emprunts_sources',
    help: 'Scored: Oui = 1, Non = 0',
  },
  {
    id: 'rad_sogs16i',
    text: 'I) En faisant des chèques sans provision',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'rad_sogs16' }, 'Oui'] },
    section: 'emprunts_sources',
    help: 'Scored: Oui = 1, Non = 0',
  },
  {
    id: 'rad_sogs16j',
    text: 'J) Vous avez (ou avez eu) un crédit à la consommation (crédit revolving)',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'rad_sogs16' }, 'Oui'] },
    section: 'emprunts_sources',
    help: 'NOT scored',
  },
  {
    id: 'rad_sogs16k',
    text: 'K) Vous avez (ou avez eu) un crédit dans une salle de jeu ou un casino',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { '==': [{ var: 'rad_sogs16' }, 'Oui'] },
    section: 'emprunts_sources',
    help: 'NOT scored',
  },
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const SOGS_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'sogs_sz',
  code: 'SOGS_SZ',
  title: 'SOGS - Jeu Pathologique',
  description: "Le SOGS (South Oaks Gambling Screen) est un outil de dépistage du jeu pathologique. Il évalue les comportements de jeu, le chasing (poursuite des pertes), les mensonges sur le jeu, et les conséquences financières et relationnelles du jeu.",
  questions: SOGS_SZ_QUESTIONS,
  metadata: {
    pathologies: ['schizophrenia'],
    target_role: 'patient',
    instructions: 'Ce questionnaire porte sur vos habitudes de jeu au cours des 12 derniers mois. Répondez honnêtement à chaque question.',
    reference: 'Lesieur HR, Blume SB. The South Oaks Gambling Screen (SOGS): a new instrument for the identification of pathological gamblers. Am J Psychiatry. 1987;144(9):1184-1188. French adaptation: Lejoyeux M. 1999.',
    total_items: 35,
    scored_items: 20,
    score_range: { min: 0, max: 20 },
    thresholds: THRESHOLDS,
    scoring_functions: {
      Q4: 'Any non-"Jamais" response = 1 point',
      Q5_Q6: 'First option = 0, others = 1',
      Q7_to_Q15_and_Q16a_i: 'Oui = 1, Non = 0',
    },
    non_scored_items: ['Q1a-g', 'Q2', 'Q3', 'Q3a', 'Q12', 'Q16j', 'Q16k'],
    conditional_scoring: 'Q16a-i only scored if Q16 = "Oui"',
  }
};
