// eFondaMental Platform - PSP (Personal and Social Performance Scale)
// Clinician-rated scale assessing personal and social functioning
// Original authors: Morosini PL, Magliano L, Brambilla L, Ugolini S, Pioli R (2000)

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaPspResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  domain_a?: string | null;
  domain_b?: string | null;
  domain_c?: string | null;
  domain_d?: string | null;
  interval_selection?: number | null;
  final_score?: number | null;
  test_done?: boolean;
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaPspResponseInsert = Omit<
  SchizophreniaPspResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Response Options
// ============================================================================

const PSP_SEVERITY_OPTIONS = [
  { code: 'Absent', label: 'Absent - Pas de difficulte', score: 0 },
  { code: 'Leger', label: 'Leger - Difficultes connues seulement d\'une personne familiere', score: 1 },
  { code: 'Manifeste', label: 'Manifeste - Difficultes remarquees mais n\'interferant pas substantiellement', score: 2 },
  { code: 'Marque', label: 'Marque - Difficultes interferant lourdement', score: 3 },
  { code: 'Severe', label: 'Severe - Incapable sans aide professionnelle', score: 4 },
  { code: 'Tres_severe', label: 'Tres severe - Difficultes mettant en danger la survie', score: 5 }
];

// ============================================================================
// Questions
// ============================================================================

const SHOW_WHEN_TEST_DONE = { '==': [{ 'var': 'test_done' }, 'oui'] };

export const PSP_QUESTIONS: Question[] = [
  {
    id: 'test_done',
    text: 'Passation du questionnaire fait',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui', score: 0 },
      { code: 'non', label: 'Non', score: 1 }
    ]
  },
  { id: 'psp_instructions', text: 'Instructions', help: 'Evaluez le fonctionnement du patient au cours du mois dernier selon un processus en 3 etapes.', type: 'instruction', required: false, display_if: SHOW_WHEN_TEST_DONE },
  
  { id: 'step1_header', text: 'Etape 1: Evaluer le niveau de fonctionnement dans les 4 domaines', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  { id: 'domain_a', text: '(a) Activites socialement utiles', help: 'Incluant le travail, les etudes, le maintien du domicile, le travail volontaire, les passe-temps utiles.', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: PSP_SEVERITY_OPTIONS },
  { id: 'domain_b', text: '(b) Relations personnelles et sociales', help: 'Relations avec un partenaire, des proches, ainsi que les relations sociales.', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: PSP_SEVERITY_OPTIONS },
  { id: 'domain_c', text: '(c) Souci de soi', help: 'Hygiene personnelle, apparence, habillement.', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: PSP_SEVERITY_OPTIONS },
  { id: 'domain_d', text: '(d) Comportements perturbateurs et agressifs', help: 'Frequent = comportement survenu plus d\'une fois ou pouvant probablement survenir dans les 6 mois.', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: PSP_SEVERITY_OPTIONS },
  
  { id: 'step2_header', text: 'Etape 2: Choisir un intervalle de 10 points', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  {
    id: 'interval_selection', text: 'Intervalle de 10 points',
    help: 'Selectionnez l\'intervalle correspondant au profil de severite du patient.',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 1, label: '91-100: Tres bon fonctionnement dans les 4 domaines', score: 1 },
      { code: 2, label: '81-90: Bon fonctionnement, difficultes courantes seulement', score: 2 },
      { code: 3, label: '71-80: Difficultes legeres dans au moins un domaine (a)-(c)', score: 3 },
      { code: 4, label: '61-70: Difficultes manifestes dans (a)-(c) ou legeres dans (d)', score: 4 },
      { code: 5, label: '51-60: Difficultes marquees dans 1 domaine (a)-(c) ou manifestes dans (d)', score: 5 },
      { code: 6, label: '41-50: Marquees dans 2+ domaines (a)-(c) ou severes dans 1 domaine', score: 6 },
      { code: 7, label: '31-40: Severes dans 1 domaine + marquees dans 1+ autres ou marquees dans (d)', score: 7 },
      { code: 8, label: '21-30: Severes dans 2 domaines (a)-(c) ou severes dans (d)', score: 8 },
      { code: 9, label: '11-20: Severes dans tous domaines ou tres severes dans (d)', score: 9 },
      { code: 10, label: '1-10: Absence d\'autonomie, comportements extremes', score: 10 }
    ]
  },
  
  { id: 'step3_header', text: 'Etape 3: Ajuster le score final', help: 'Ajustez le score en tenant compte d\'autres domaines: sante, logement, activites menageres, relations intimes, soins aux enfants, reseau social, regles sociales, interets, gestion financiere, transports, capacite a affronter les crises.', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  { id: 'final_score', text: 'Score PSP final (1-100)', help: 'Entrez le score final entre 1 et 100.', type: 'number', required: false, display_if: SHOW_WHEN_TEST_DONE }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export interface QuestionnaireDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  instructions?: string;
  questions: Question[];
  metadata?: {
    singleColumn?: boolean;
    pathologies?: string[];
    target_role?: 'patient' | 'healthcare_professional';
    [key: string]: any;
  };
}

export const PSP_DEFINITION: QuestionnaireDefinition = {
  id: 'psp',
  code: 'PSP',
  title: 'PSP - Echelle de fonctionnement personnel et social',
  description: 'Echelle evaluant le fonctionnement personnel et social dans 4 domaines principaux. Fournit un score global de 1-100. Auteurs: Morosini PL et al. (2000).',
  questions: PSP_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'Original (Morosini et al., 2000)',
    language: 'fr-FR'
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

export function interpretPspScore(score: number): string {
  if (score >= 71) return 'Mild difficulties';
  if (score >= 51) return 'Manifest difficulties';
  if (score >= 31) return 'Marked difficulties';
  if (score >= 11) return 'Severe difficulties';
  return 'Extremely severe difficulties';
}

export function getPspFunctioningLevel(score: number): string {
  if (score >= 91) return 'Excellent functioning';
  if (score >= 81) return 'Good functioning';
  if (score >= 71) return 'Mild difficulties only';
  if (score >= 61) return 'Manifest difficulties';
  if (score >= 51) return 'Marked difficulties';
  if (score >= 41) return 'Severe difficulties in multiple areas';
  if (score >= 31) return 'Severe difficulties in most areas';
  if (score >= 21) return 'Very severe difficulties';
  if (score >= 11) return 'Extreme difficulties';
  return 'Lack of autonomy';
}
