// eFondaMental Platform - Simpson-Angus Scale (SAS)
// 10-item clinician-rated scale for assessing drug-induced parkinsonism
// Original authors: Simpson GM, Angus JWS (1970)

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaSasResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
  q5?: number | null;
  q6?: number | null;
  q7?: number | null;
  q8?: number | null;
  q9?: number | null;
  q10?: number | null;
  total_score?: number | null;
  mean_score?: number | null;
  test_done?: boolean;
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaSasResponseInsert = Omit<
  SchizophreniaSasResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'mean_score'
>;

// ============================================================================
// Questions
// ============================================================================

const SHOW_WHEN_TEST_DONE = { '==': [{ 'var': 'test_done' }, 'oui'] };

export const SAS_QUESTIONS: Question[] = [
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
  { id: 'sas_instructions', text: 'Instructions', help: 'L\'examinateur effectue une serie de tests physiques et d\'observations pour evaluer les signes extrapyramidaux. Le score total est la moyenne des 10 items (somme / 10).', type: 'instruction', required: false, display_if: SHOW_WHEN_TEST_DONE },
  
  {
    id: 'q1', text: '**1. Démarche**\n\nLe patient est examiné pendant qu\'il marche dans la salle d\'examen. Sa démarche, le ballant de ses bras, sa posture générale permettent de coter cet item :',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0. Normal', score: 0 },
      { code: 1, label: '1. Diminution du ballant des bras à la marche', score: 1 },
      { code: 2, label: '2. Diminution importante du ballant des bras avec une évidente rigidité des bras', score: 2 },
      { code: 3, label: '3. Démarche raide, les bras maintenus de manière rigide devant l\'abdomen', score: 3 },
      { code: 4, label: '4. Démarche voûtée, traîne les pieds. Progresse par propulsion et rétropulsion', score: 4 }
    ]
  },
  {
    id: 'q2', text: '**2. Chute des bras.**\n\nLe patient et l\'examinateur lèvent tous les deux les bras jusqu\'à la hauteur des épaules et les laissent tomber sur les cotés. Chez le sujet normal un claquement net est entendu quand les bras frappent les côtes. Chez les patients présentant un syndrome parkinsonien très sévère les bras retombent doucement.',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0. Normal. Chute libre avec fort claquement et rebond', score: 0 },
      { code: 1, label: '1. Chute légèrement ralentie avec contact moins audible et petit rebond', score: 1 },
      { code: 2, label: '2. Chute ralentie. Pas de rebond', score: 2 },
      { code: 3, label: '3. Chute très ralentie. Pas de claquement du tout', score: 3 },
      { code: 4, label: '4. Les bras tombent comme une résistance. Comme à travers de la colle', score: 4 }
    ]
  },
  {
    id: 'q3', text: '**3. Mouvements passifs de l\'épaule**\n\nLes coudes sont maintenus fléchis à angle droit et les bras sont pris l\'un après l\'autre par l\'examinateur. Ce dernier attrape une main du patient et serre avec son autre main le coude du patient. Le bras du sujet est poussé et tiré pendant que l\'humérus subit un mouvement de rotation externe. Le degré de rigidité, du normal à l\'extrême rigidité, est quantifié comme suit :',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0. Normal', score: 0 },
      { code: 1, label: '1. Rigidité et résistance légères', score: 1 },
      { code: 2, label: '2. Résistance et rigidité moyennes', score: 2 },
      { code: 3, label: '3. Rigidité importante. Mouvements passifs difficiles', score: 3 },
      { code: 4, label: '4. Résistance et rigidité extrêmes avec une épaule presque gelée', score: 4 }
    ]
  },
  {
    id: 'q4', text: '**4. Rigidité**\n\nLes deux articulations du coude sont maintenues l\'une après l\'autre à angle droit puis étendues fléchies d\'une manière passive; Le biceps du patient est alors observé et palpé en même temps. La résistance à cette manœuvre est cotée (la présence d\'une roue dentée est notée indépendamment).',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0. Normal', score: 0 },
      { code: 1, label: '1. Rigidité et résistance légères', score: 1 },
      { code: 2, label: '2. Résistance et rigidité moyennes', score: 2 },
      { code: 3, label: '3. Rigidité importante. Mouvements passifs difficiles', score: 3 },
      { code: 4, label: '4. Résistance et rigidité extrêmes', score: 4 }
    ]
  },
  {
    id: 'q5', text: '**5. Maintien des attitudes ou rigidité du poignet**\n\nLe poignet est tenu d\'une main et les doigts sont tenus par l\'autre main de l\'examinateur; Le poignet est mobilisé en flexion, en extension, en déplacement radial et cubital. La résistance à ces mouvements est cotée comme suit:',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0. Normal', score: 0 },
      { code: 1, label: '1. Rigidité et résistance légères', score: 1 },
      { code: 2, label: '2. Résistance et rigidité moyennes', score: 2 },
      { code: 3, label: '3. Rigidité importante. Mouvements passifs difficiles', score: 3 },
      { code: 4, label: '4. Résistance et rigidité extrêmes', score: 4 }
    ]
  },
  {
    id: 'q6', text: '**6. Mouvement pendulaire de la jambe**\n\nLe patient s\'assoit sur une table avec les jambes pendantes et bougeant librement. La cheville est attrapée par l\'examinateur et élevée jusqu\'à ce que le genou soit partiellement étendu. On laisse ensuite la jambe tomber. La résistance à la chute et l\'absence de ballant sont à la base de la cotation de cet item :',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0. La jambe balance librement', score: 0 },
      { code: 1, label: '1. Légère diminution du ballant des jambes', score: 1 },
      { code: 2, label: '2. Résistance au ballant moyenne', score: 2 },
      { code: 3, label: '3. Résistance et limitation du ballant importantes', score: 3 },
      { code: 4, label: '4. Absence complète de ballant', score: 4 }
    ]
  },
  {
    id: 'q7', text: '**7. Chute de la tête**\n\nLe patient s\'allonge sur une table d\'examen bien rembourrée et l\'examinateur soulève la tête du patient avec sa main. La main est ensuite relâchée et on laisse la tête retomber. Chez le sujet normal la tête tombera sur la table. Le syndrome est retardé en cas de syndrome extrapyramidal et il est absent en cas de parkinsonisme extrême : les muscles du cou sont rigides et la tête n\'atteint pas la table d\'examen. Coter comme suit :',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0. La tête tombe complètement avec un bruit distinct quand elle touche la table', score: 0 },
      { code: 1, label: '1. Léger ralentissement dans la chute de la tête, surtout observé par l\'absence de claquement quand la tête touche la table', score: 1 },
      { code: 2, label: '2. ralentissement modéré de la chute, presque visible à l\'œil nu', score: 2 },
      { code: 3, label: '3. La tête tombe avec résistance et lentement', score: 3 },
      { code: 4, label: '4. La tête n\'atteint pas la table d\'examen', score: 4 }
    ]
  },
  {
    id: 'q8', text: '**8. Percussion de la glabelle (réflexe naso-palpébral)**\n\nOn demande au sujet d\'ouvrir grand les yeux et de ne pas cligner des yeux; La glabelle est tapée doucement à une vitesse rapide et régulière. Le nombre de fois de suite où le patient cligne des yeux est noté :',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0. 0-5 clignements', score: 0 },
      { code: 1, label: '1. 6-10 clignements', score: 1 },
      { code: 2, label: '2. 11-15 clignements', score: 2 },
      { code: 3, label: '3. 16-20  clignements', score: 3 },
      { code: 4, label: '4. 21 clignements et plus', score: 4 }
    ]
  },
  {
    id: 'q9', text: '**9. Tremblement**\n\nLe patient est observé lors qu\'il entre dans la salle d\'examen puis il est réexaminé pour cet item :',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0. Normal', score: 0 },
      { code: 1, label: '1. Léger tremblement des doigts, évident à la vue et au toucher', score: 1 },
      { code: 2, label: '2. Tremblement de la main ou du bras apparaissant de façon intermittente', score: 2 },
      { code: 3, label: '3. Tremblements persistant d\'un ou de plusieurs membres.', score: 3 },
      { code: 4, label: '4. Tremblements de tout le corps', score: 4 }
    ]
  },
  {
    id: 'q10', text: '**10. Salivation**\n\nLe patient est observé quand il parle on lui demande d\'ouvrir la bouche et de soulever la langue; Les cotations suivantes sont données:',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0. Normal', score: 0 },
      { code: 1, label: '1. Salivation excessive au point qu\'une flaque apparaît si la bouche est ouverte et la langue levée', score: 1 },
      { code: 2, label: '2. L\'excès de salivation est présent et peut parfois gêner la parole', score: 2 },
      { code: 3, label: '3. Parole difficile en raison d\'un excès de salivation', score: 3 },
      { code: 4, label: '4. Franc bavage', score: 4 }
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

export const SAS_DEFINITION: QuestionnaireDefinition = {
  id: 'sas',
  code: 'SAS',
  title: 'SAS - Echelle des effets secondaires extrapyramidaux',
  description: 'Echelle a 10 items pour evaluer le parkinsonisme medicamenteux et les effets secondaires extrapyramidaux (EPS). Auteurs: Simpson GM, Angus JWS (1970).',
  questions: SAS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'Original (Simpson & Angus, 1970)',
    language: 'fr-FR'
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

export function computeSasScores(response: Partial<SchizophreniaSasResponse>): {
  total: number;
  mean: number;
} {
  const items = [response.q1, response.q2, response.q3, response.q4, response.q5, response.q6, response.q7, response.q8, response.q9, response.q10];
  const validItems = items.filter((v): v is number => v !== null && v !== undefined);
  const total = validItems.reduce((sum, v) => sum + v, 0);
  const mean = validItems.length > 0 ? total / validItems.length : 0;
  return { total, mean: Math.round(mean * 100) / 100 };
}

export function interpretSasMean(mean: number): string {
  if (mean < 0.3) return 'No parkinsonism';
  if (mean < 1.0) return 'Mild parkinsonism';
  if (mean < 2.0) return 'Moderate parkinsonism';
  return 'Severe parkinsonism';
}

export function hasSasPositiveFindings(mean: number): boolean {
  return mean >= 0.3;
}
