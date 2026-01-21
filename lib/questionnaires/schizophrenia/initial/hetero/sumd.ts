// eFondaMental Platform - SUMD (Scale to Assess Unawareness of Mental Disorder)
// Semi-structured interview assessing awareness (insight) of mental illness
// Original authors: Amador XF, Strauss DH, Yale SA, et al. (1993)

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaSumdResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  conscience1?: number | null;
  conscience2?: number | null;
  conscience3?: number | null;
  conscience4?: number | null;
  attribu4?: number | null;
  conscience5?: number | null;
  attribu5?: number | null;
  conscience6?: number | null;
  attribu6?: number | null;
  conscience7?: number | null;
  attribu7?: number | null;
  conscience8?: number | null;
  attribu8?: number | null;
  conscience9?: number | null;
  attribu9?: number | null;
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaSumdResponseInsert = Omit<
  SchizophreniaSumdResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Response Options
// ============================================================================

const SUMD_CONSCIENCE_OPTIONS = [
  { code: 0, label: 'Non cotable', score: 0 },
  { code: 1, label: 'Conscient', score: 1 },
  { code: 2, label: 'En partie conscient/inconscient', score: 2 },
  { code: 3, label: 'Inconscient', score: 3 }
];

const SUMD_ATTRIBUTION_OPTIONS = [
  { code: 0, label: 'Non cotable', score: 0 },
  { code: 1, label: 'Attribution correcte - Le symptome est du a un trouble mental', score: 1 },
  { code: 2, label: 'Attribution partielle - Incertain, mais peut en accepter l\'idee', score: 2 },
  { code: 3, label: 'Attribution incorrecte - Le symptome n\'est pas en lien avec un trouble mental', score: 3 }
];

// ============================================================================
// Questions
// ============================================================================

export const SUMD_QUESTIONS: Question[] = [
  // Domain 1: Conscience d'un trouble mental
  { id: 'section_domain1', text: 'Conscience d\'un trouble mental', help: 'D\'une maniere generale, le patient croit-il presenter un trouble mental ?', type: 'section', required: false },
  { id: 'conscience1', text: '1. Conscience du trouble', help: 'D\'une maniere generale, le patient croit-il presenter un trouble mental ?', type: 'single_choice', required: false, options: SUMD_CONSCIENCE_OPTIONS },
  
  // Domain 2: Conscience des consequences
  { id: 'section_domain2', text: 'Conscience des consequences de ce trouble', type: 'section', required: false },
  { id: 'conscience2', text: '2. Conscience du trouble', help: 'Quelles sont les croyances du sujet concernant les raisons pour lesquelles il se retrouve hospitalise, renvoye de son travail, blesse, endette... etc... ?', type: 'single_choice', required: false, options: SUMD_CONSCIENCE_OPTIONS },
  
  // Domain 3: Conscience des effets du traitement
  { id: 'section_domain3', text: 'Conscience des effets du traitement', type: 'section', required: false },
  { id: 'conscience3', text: '3. Conscience du trouble', help: 'Le sujet croit-il que les traitements ont diminue la severite de ses symptomes ?', type: 'single_choice', required: false, options: SUMD_CONSCIENCE_OPTIONS },
  
  // Domain 4: Conscience d'une experience hallucinatoire
  { id: 'section_domain4', text: 'Conscience d\'une experience hallucinatoire', type: 'section', required: false },
  { id: 'conscience4', text: '4.1. Conscience du trouble', help: 'Le sujet reconnait-il ses hallucinations en tant que telles ?', type: 'single_choice', required: false, options: SUMD_CONSCIENCE_OPTIONS },
  { id: 'attribu4', text: '4.2. Attribution des symptomes', help: 'Si conscience = 0 ou 3, l\'attribution est automatiquement "Non cotable".', type: 'single_choice', required: false, options: SUMD_ATTRIBUTION_OPTIONS },
  
  // Domain 5: Conscience du delire
  { id: 'section_domain5', text: 'Conscience du delire', type: 'section', required: false },
  { id: 'conscience5', text: '5.1. Conscience du trouble', help: 'Le sujet reconnait-il son delire en tant que production interne de croyances erronees ?', type: 'single_choice', required: false, options: SUMD_CONSCIENCE_OPTIONS },
  { id: 'attribu5', text: '5.2. Attribution des symptomes', type: 'single_choice', required: false, options: SUMD_ATTRIBUTION_OPTIONS },
  
  // Domain 6: Conscience d'un trouble de la pensee
  { id: 'section_domain6', text: 'Conscience d\'un trouble de la pensee', type: 'section', required: false },
  { id: 'conscience6', text: '6.1. Conscience du trouble', help: 'Le sujet croit-il que ses communications avec les autres sont perturbees ?', type: 'single_choice', required: false, options: SUMD_CONSCIENCE_OPTIONS },
  { id: 'attribu6', text: '6.2. Attribution des symptomes', type: 'single_choice', required: false, options: SUMD_ATTRIBUTION_OPTIONS },
  
  // Domain 7: Conscience d'un emoussement affectif
  { id: 'section_domain7', text: 'Conscience d\'un emoussement affectif', type: 'section', required: false },
  { id: 'conscience7', text: '7.1. Conscience du trouble', help: 'Le sujet a-t-il conscience de ses affects communiques par le biais de ses expressions, sa voix, sa gesticulation ?', type: 'single_choice', required: false, options: SUMD_CONSCIENCE_OPTIONS },
  { id: 'attribu7', text: '7.2. Attribution des symptomes', type: 'single_choice', required: false, options: SUMD_ATTRIBUTION_OPTIONS },
  
  // Domain 8: Conscience de l'anhedonie
  { id: 'section_domain8', text: 'Conscience de l\'anhedonie', type: 'section', required: false },
  { id: 'conscience8', text: '8.1. Conscience du trouble', help: 'Le sujet est-il conscient de la diminution de son plaisir a participer a des activites suscitant normalement le plaisir ?', type: 'single_choice', required: false, options: SUMD_CONSCIENCE_OPTIONS },
  { id: 'attribu8', text: '8.2. Attribution des symptomes', type: 'single_choice', required: false, options: SUMD_ATTRIBUTION_OPTIONS },
  
  // Domain 9: Conscience de l'asociabilite
  { id: 'section_domain9', text: 'Conscience de l\'asociabilite', type: 'section', required: false },
  { id: 'conscience9', text: '9.1. Conscience du trouble', help: 'Le patient est-il conscient qu\'il ne montre pas d\'interet pour les relations sociales ?', type: 'single_choice', required: false, options: SUMD_CONSCIENCE_OPTIONS },
  { id: 'attribu9', text: '9.2. Attribution des symptomes', type: 'single_choice', required: false, options: SUMD_ATTRIBUTION_OPTIONS }
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

export const SUMD_DEFINITION: QuestionnaireDefinition = {
  id: 'sumd',
  code: 'SUMD',
  title: 'SUMD - Echelle d\'evaluation de la conscience de la maladie',
  description: 'Entretien semi-structure evaluant la conscience (insight) de la maladie mentale a travers 9 domaines. Auteurs originaux: Amador XF, Strauss DH, Yale SA, et al. (1993).',
  questions: SUMD_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'Original (Amador et al., 1993)',
    language: 'fr-FR'
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

export function computeSumdAwarenessScore(response: Partial<SchizophreniaSumdResponse>): number {
  const conscienceItems = [
    response.conscience1, response.conscience2, response.conscience3,
    response.conscience4, response.conscience5, response.conscience6,
    response.conscience7, response.conscience8, response.conscience9
  ].filter((v): v is number => v !== null && v !== undefined && v > 0);
  
  if (conscienceItems.length === 0) return 0;
  return conscienceItems.reduce((sum, v) => sum + v, 0) / conscienceItems.length;
}

export function computeSumdAttributionScore(response: Partial<SchizophreniaSumdResponse>): number {
  const attributionItems = [
    response.attribu4, response.attribu5, response.attribu6,
    response.attribu7, response.attribu8, response.attribu9
  ].filter((v): v is number => v !== null && v !== undefined && v > 0);
  
  if (attributionItems.length === 0) return 0;
  return attributionItems.reduce((sum, v) => sum + v, 0) / attributionItems.length;
}
