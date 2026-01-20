// eFondaMental Platform - CGI (Clinical Global Impressions)
// Bipolar Initial Evaluation - Thymic Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarCgiResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  cgi_s: number | null;
  cgi_i: number | null;
  therapeutic_effect: number | null;
  side_effects: number | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarCgiResponseInsert = Omit<
  BipolarCgiResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const CGI_QUESTIONS: Question[] = [
  // CGI - 1ere partie
  {
    id: 'section_cgi_1',
    text: 'CGI - 1ere partie',
    help: 'Completer l\'item (gravite de la maladie) lors de l\'evaluation initiale et des evaluations suivantes.',
    type: 'section',
    required: false
  },
  {
    id: 'cgi_s',
    text: 'Gravite de la maladie',
    help: 'En fonction de votre experience clinique totale avec ce type de patient, quel est le niveau de gravite des troubles mentaux actuels du patient',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Non evalue', score: 0 },
      { code: 1, label: 'Normal, pas du tout malade', score: 1 },
      { code: 2, label: 'A la limite', score: 2 },
      { code: 3, label: 'Legerement malade', score: 3 },
      { code: 4, label: 'Moderement malade', score: 4 },
      { code: 5, label: 'Manifestement malade', score: 5 },
      { code: 6, label: 'Gravement malade', score: 6 },
      { code: 7, label: 'Parmi les patients les plus malades', score: 7 }
    ]
  },
  
  // CGI - 2eme partie
  {
    id: 'section_cgi_2',
    text: 'CGI - 2eme partie',
    help: 'Partie a ne completer que dans les visites de suivi',
    type: 'section',
    required: false
  },
  {
    id: 'cgi_i',
    text: 'Amelioration globale',
    help: 'Evaluer l\'amelioration totale qu\'elle soit ou non, selon votre opinion, due entierement au traitement medicamenteux. Compare a son etat au debut du traitement, de quelle facon le patient a-t-il change',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Non evalue', score: 0 },
      { code: 1, label: 'Tres fortement ameliore', score: 1 },
      { code: 2, label: 'Fortement ameliore', score: 2 },
      { code: 3, label: 'Legerement ameliore', score: 3 },
      { code: 4, label: 'Pas de changement', score: 4 },
      { code: 5, label: 'Legerement aggrave', score: 5 },
      { code: 6, label: 'Fortement aggrave', score: 6 },
      { code: 7, label: 'Tres fortement aggrave', score: 7 }
    ]
  },
  
  // CGI - 3eme partie (Index therapeutique)
  {
    id: 'section_cgi_3',
    text: 'CGI - 3eme partie : Index therapeutique',
    help: 'Evaluer cet item uniquement en fonction de l\'effet du medicament.',
    type: 'section',
    required: false
  },
  {
    id: 'therapeutic_effect',
    text: 'Index therapeutique :',
    help: 'Evaluer cet item uniquement en fonction de l\'effet du medicament.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Non evalue', score: 0 },
      { code: 1, label: 'Important', score: 1 },
      { code: 2, label: 'Modere', score: 2 },
      { code: 3, label: 'Minime', score: 3 },
      { code: 4, label: 'Nul ou aggravation', score: 4 }
    ]
  },
  {
    id: 'side_effects',
    text: 'Effets secondaires',
    type: 'single_choice',
    required: false,
    display_if: { 'in': [{ 'var': 'therapeutic_effect' }, [1, 2, 3, 4]] },
    options: [
      { code: 0, label: 'Aucun', score: 0 },
      { code: 1, label: 'N\'interferent pas significativement avec le fonctionnement du patient', score: 1 },
      { code: 2, label: 'Interferent significativement avec le fonctionnement du patient', score: 2 },
      { code: 3, label: 'Depassent l\'effet therapeutique', score: 3 }
    ]
  }
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

export const CGI_DEFINITION: QuestionnaireDefinition = {
  id: 'cgi',
  code: 'CGI',
  title: 'Clinical Global Impression (CGI)',
  description: 'Echelle d\'evaluation de la gravite de la maladie et de l\'amelioration globale.',
  questions: CGI_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Score Interpretation
// ============================================================================

export function interpretCgiSeverity(score: number): string {
  const labels: Record<number, string> = {
    0: 'Non evalue',
    1: 'Normal, pas du tout malade',
    2: 'A la limite',
    3: 'Legerement malade',
    4: 'Moderement malade',
    5: 'Manifestement malade',
    6: 'Gravement malade',
    7: 'Parmi les patients les plus malades'
  };
  return labels[score] || 'Non evalue';
}

export function interpretCgiImprovement(score: number): string {
  const labels: Record<number, string> = {
    0: 'Non evalue',
    1: 'Tres fortement ameliore',
    2: 'Fortement ameliore',
    3: 'Legerement ameliore',
    4: 'Pas de changement',
    5: 'Legerement aggrave',
    6: 'Fortement aggrave',
    7: 'Tres fortement aggrave'
  };
  return labels[score] || 'Non evalue';
}

export interface CgiInterpretationResult {
  cgi_s_interpretation: string | null;
  cgi_i_interpretation: string | null;
  interpretation: string;
}

export function interpretCgi(cgiS: number | null, cgiI: number | null): CgiInterpretationResult {
  const cgiSInterpretation = cgiS !== null && cgiS !== 0 ? interpretCgiSeverity(cgiS) : null;
  const cgiIInterpretation = cgiI !== null && cgiI !== 0 ? interpretCgiImprovement(cgiI) : null;

  let interpretation = '';
  if (cgiSInterpretation) {
    interpretation += `Gravite: ${cgiSInterpretation}`;
  }
  if (cgiIInterpretation) {
    if (interpretation) interpretation += '. ';
    interpretation += `Amelioration: ${cgiIInterpretation}`;
  }

  return {
    cgi_s_interpretation: cgiSInterpretation,
    cgi_i_interpretation: cgiIInterpretation,
    interpretation: interpretation || 'Non evalue'
  };
}
