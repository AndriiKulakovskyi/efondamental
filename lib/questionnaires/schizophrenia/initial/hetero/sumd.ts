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
  score_conscience1?: number | null;
  score_conscience2?: number | null;
  score_conscience3?: number | null;
  awareness_score?: number | null;
  attribution_score?: number | null;
  test_done?: boolean | null;
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
  { code: 0, label: '0- Non cotable', score: 0 },
  { code: 1, label: '1- Conscient', score: 1 },
  { code: 2, label: '2- En partie conscient/inconscient', score: 2 },
  { code: 3, label: '3- Inconscient', score: 3 }
];

const SUMD_ATTRIBUTION_OPTIONS = [
  { code: 0, label: '0- Non cotable', score: 0 },
  { code: 1, label: '1- Attribution correcte : le symptôme est dû à un trouble mental', score: 1 },
  { code: 2, label: '2- Attribution partielle : incertain, mais peut en accepter l’idée', score: 2 },
  { code: 3, label: '3- Attribution incorrecte : le symptôme n’est pas en lien avec un trouble mental', score: 3 }
];

// ============================================================================
// Questions
// ============================================================================

const SHOW_WHEN_TEST_DONE = { '==': [{ 'var': 'test_done' }, 'oui'] };

export const SUMD_QUESTIONS: Question[] = [
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
  // Domain 1: Conscience d'un trouble mental
  { id: 'section_domain1', text: '1. Conscience d’un trouble mental', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  { id: 'conscience1', text: 'D’une manière générale, le patient croit-il présenter un trouble mental ?\n\n**1. Conscience du trouble**', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: SUMD_CONSCIENCE_OPTIONS },
  
  // Domain 2: Conscience des consequences
  { id: 'section_domain2', text: '2. Conscience des conséquences de ce trouble', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  { id: 'conscience2', text: 'Quelles sont les croyances du sujet concernant les raisons pour lesquelles il se retrouve hospitalisé, renvoyé de son travail, blessé, endetté… etc. ?\n\n**2. Conscience du trouble**', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: SUMD_CONSCIENCE_OPTIONS },
  
  // Domain 3: Conscience des effets du traitement
  { id: 'section_domain3', text: '3. Conscience des effets du traitement', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  { id: 'conscience3', text: 'Le sujet croit-il que les traitements ont diminué la sévérité de ses symptômes ?\n\n**3. Conscience du trouble**', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: SUMD_CONSCIENCE_OPTIONS },
  
  // Domain 4: Conscience d'une experience hallucinatoire
  { id: 'section_domain4', text: '4. Conscience d’une expérience hallucinatoire', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  { id: 'conscience4', text: 'Le sujet reconnaît-il ses hallucinations en tant que telles ? Il s’agit de coter sa capacité à interpréter son expérience hallucinatoire comme primaire.\n\n**4. Conscience du trouble**', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: SUMD_CONSCIENCE_OPTIONS },
  { id: 'attribu4', text: '4. Attribution des symptômes', help: 'Si conscience = 0 ou 3, l\'attribution est automatiquement "Non cotable".', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: SUMD_ATTRIBUTION_OPTIONS },
  
  // Domain 5: Conscience du delire
  { id: 'section_domain5', text: '5. Conscience du délire', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  { id: 'conscience5', text: 'Le sujet reconnaît-il son délire en tant que production interne de croyances erronées ? Coter la conscience du caractère non plausible de ses croyances.\n\n**5. Conscience du trouble**', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: SUMD_CONSCIENCE_OPTIONS },
  { id: 'attribu5', text: '5. Attribution des symptômes', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: SUMD_ATTRIBUTION_OPTIONS },
  
  // Domain 6: Conscience d'un trouble de la pensee
  { id: 'section_domain6', text: '6. Conscience d’un trouble de la pensée', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  { id: 'conscience6', text: 'Le sujet croit-il que ses communications avec les autres sont perturbées ?\n\n**6. Conscience du trouble**', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: SUMD_CONSCIENCE_OPTIONS },
  { id: 'attribu6', text: '6. Attribution des symptômes', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: SUMD_ATTRIBUTION_OPTIONS },
  
  // Domain 7: Conscience d'un emoussement affectif
  { id: 'section_domain7', text: '7. Conscience d’un émoussement affectif', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  { id: 'conscience7', text: 'Le sujet a-t-il conscience de ses affects communiqués par le biais de ses expressions, sa voix, sa gesture… etc. ? Ne pas coter son évaluation de sa thymie.\n\n**7. Conscience du trouble**', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: SUMD_CONSCIENCE_OPTIONS },
  { id: 'attribu7', text: '7. Attribution des symptômes', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: SUMD_ATTRIBUTION_OPTIONS },
  
  // Domain 8: Conscience de l'anhedonie
  { id: 'section_domain8', text: '8. Conscience de l’anhédonie', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  { id: 'conscience8', text: 'Le sujet est-il conscient que son attitude renvoie une apparente diminution de son plaisir à participer à des activités suscitant normalement le plaisir ?\n\n**8. Conscience du trouble**', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: SUMD_CONSCIENCE_OPTIONS },
  { id: 'attribu8', text: '8. Attribution des symptômes', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: SUMD_ATTRIBUTION_OPTIONS },
  
  // Domain 9: Conscience de l'asociabilite
  { id: 'section_domain9', text: '9. Conscience de l’asociabilité', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  { id: 'conscience9', text: 'Le patient est-il conscient qu’il ne montre pas d’intérêt pour les relations sociales ?\n\n**9. Conscience du trouble**', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: SUMD_CONSCIENCE_OPTIONS },
  { id: 'attribu9', text: '9. Attribution des symptômes', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: SUMD_ATTRIBUTION_OPTIONS }
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
