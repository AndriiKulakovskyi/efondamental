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
  { code: 'Absent', label: 'Absent', score: 0 },
  { code: 'Leger', label: 'Léger', score: 1 },
  { code: 'Manifeste', label: 'Manifeste', score: 2 },
  { code: 'Marque', label: 'Marqué', score: 3 },
  { code: 'Severe', label: 'Sévère', score: 4 },
  { code: 'Tres_severe', label: 'Très sévère', score: 5 }
];

// ============================================================================
// Questions
// ============================================================================

const SHOW_WHEN_TEST_DONE = { '==': [{ 'var': 'test_done' }, 'oui'] };

export const PSP_QUESTIONS: Question[] = [
  {
    id: 'test_done',
    text: 'Passation du questionnaire',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Fait', score: 0 },
      { code: 'non', label: 'Non fait', score: 1 }
    ]
  },
  { 
    id: 'psp_step1_header', 
    text: '**Etape 1 : Evaluer le niveau de fonctionnement du patient au cours du dernier mois.**\n\nQuatre domaines principaux de fonctionnement sont considérés dans cette échelle.\nPour chaque domaine, évaluer le moins bon fonctionnement du sous-domaine le plus pertinent.',
    type: 'instruction', 
    required: false, 
    display_if: SHOW_WHEN_TEST_DONE 
  },
  
  // Domain (a)
  { 
    id: 'domain_a_title', 
    text: '**Domaine (a) : Activités socialement utiles**',
    type: 'instruction', 
    required: false, 
    display_if: SHOW_WHEN_TEST_DONE 
  },
  {
    id: 'domain_a_severity',
    text: '**Détail des degrés de sévérité pour le domaine (a)**\n\nLéger :\ndifficultés seulement connues d\'une personne très familière du sujet\nManifeste :\ndifficultés clairement remarquées par n\'importe qui, mais n\'interférant pas substantiellement avec la capacité du sujet dans ce sous-domaine, sachant le contexte socioculturel du sujet, son âge, son sexe et son niveau éducatif\nMarqué :\ndifficultés interférent lourdement avec la capacité du sujet dans ce sous-domaine cependant, le sujet est capable de faire quelque chose sans aide extérieure, bien que cela soit inadéquat et/ou occasionnel s\'il est aidé, il atteint le niveau précédent de fonctionnement\nSévère :\ndifficultés rendant la personne incapable de réaliser quoique ce soit dans le sous-domaine en l\'absence d\'aide professionnelle, ou amenant le sujet à un résultat délétère la survie n\'est pas mise en jeu\nTrès sévère :\ndifficultés et incapacités mettant en danger la survie de la personne',
    type: 'instruction',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  { 
    id: 'domain_a', 
    text: '(a) Activités socialement utiles, incluant le travail et les études. (Les activités socialement utiles incluent la coopération pour le maintien du domicile, le travail volontaire, les passe-temps « utiles » comme le jardinage.)',
    type: 'single_choice', 
    required: false, 
    display_if: SHOW_WHEN_TEST_DONE, 
    options: [
      { code: 'Leger', label: 'Léger', score: 1 },
      { code: 'Manifeste', label: 'Manifeste', score: 2 },
      { code: 'Marque', label: 'Marqué', score: 3 },
      { code: 'Severe', label: 'Sévère', score: 4 },
      { code: 'Tres_severe', label: 'Très sévère', score: 5 }
    ]
  },

  // Domain (b)
  { 
    id: 'domain_b_title', 
    text: '**Domaine (b) : Relations personnelles et sociales**',
    type: 'instruction', 
    required: false, 
    display_if: SHOW_WHEN_TEST_DONE 
  },
  {
    id: 'domain_b_severity',
    text: '**Détail des degrés de sévérité pour le domaine (b)**\n\nAbsentLéger :\ndifficultés seulement connues d\'une personne très familière du sujet\nManifeste :\ndifficultés clairement remarquées par n\'importe qui, mais n\'interférant pas substantiellement avec la capacité du sujet dans ce sous-domaine, sachant le contexte socioculturel du sujet, son âge, son sexe et son niveau éducatif\nMarqué :\ndifficultés interférent lourdement avec la capacité du sujet dans ce sous-domaine, cependant, le sujet est capable de faire quelque chose sans aide extérieure, bien que cela soit inadéquat et/ou occasionnel, s\'il est aidé, il atteint le niveau précédent de fonctionnement\nSévère :\ndifficultés rendant la personne incapable de réaliser quoique ce soit dans le sous-domaine en l\'absence d\'aide professionnelle, ou amenant le sujet à un résultat délétère, la survie n\'est pas mise en jeu\nTrès sévère :\ndifficultés et incapacités mettant en danger la survie de la personne',
    type: 'instruction',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  { 
    id: 'domain_b', 
    text: '(b) Relations personnelles et sociales. (Les relations incluent les relations avec un partenaire (pour les personnes ayant un partenaire) ou avec des proches, ainsi que les relations sociales)',
    type: 'single_choice', 
    required: false, 
    display_if: SHOW_WHEN_TEST_DONE, 
    options: [
      { code: 'Absent', label: 'AbsentLéger', score: 0 },
      { code: 'Manifeste', label: 'Manifeste', score: 2 },
      { code: 'Marque', label: 'Marqué', score: 3 },
      { code: 'Severe', label: 'Sévère', score: 4 },
      { code: 'Tres_severe', label: 'Très sévère', score: 5 }
    ]
  },

  // Domain (c)
  { 
    id: 'domain_c_title', 
    text: '**Domaine (c) : souci de soi**',
    type: 'instruction', 
    required: false, 
    display_if: SHOW_WHEN_TEST_DONE 
  },
  {
    id: 'domain_c_severity',
    text: '**Détail des degrés de sévérité pour le domaine (c)**\n\nAbsentLéger :\ndifficultés seulement connues d\'une personne très familière du sujet\nManifeste :\ndifficultés clairement remarquées par n\'importe qui, mais n\'interférant pas substantiellement avec la capacité du sujet dans ce sous-domaine, sachant le contexte socioculturel du sujet, son âge, son sexe et son niveau éducatif\nMarqué :\ndifficultés interférent lourdement avec la capacité du sujet dans ce sous-domaine, cependant, le sujet est capable de faire quelque chose sans aide extérieure, bien que cela soit inadéquat et/ou occasionnel, s\'il est aidé, il atteint le niveau précédent de fonctionnement\nSévère :\ndifficultés rendant la personne incapable de réaliser quoique ce soit dans le sous-domaine en l\'absence d\'aide professionnelle, ou amenant le sujet à un résultat délétère, la survie n\'est pas mise en jeu\nTrès sévère :\ndifficultés et incapacités mettant en danger la survie de la personne',
    type: 'instruction',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  { 
    id: 'domain_c', 
    text: '(c) Souci de soi (Le souci de soi inclut l\'hygiène personnelle, l\'apparence, l\'habillement.)',
    type: 'single_choice', 
    required: false, 
    display_if: SHOW_WHEN_TEST_DONE, 
    options: [
      { code: 'Absent', label: 'AbsentLéger', score: 0 },
      { code: 'Manifeste', label: 'Manifeste', score: 2 },
      { code: 'Marque', label: 'Marqué', score: 3 },
      { code: 'Severe', label: 'Sévère', score: 4 },
      { code: 'Tres_severe', label: 'Très sévère', score: 5 }
    ]
  },

  // Domain (d)
  { 
    id: 'domain_d_title', 
    text: '**Domaine (d) : comportements perturbateurs et agressifs**',
    type: 'instruction', 
    required: false, 
    display_if: SHOW_WHEN_TEST_DONE 
  },
  {
    id: 'domain_d_severity',
    text: '**Détail des degrés de sévérité pour le domaine (d)**\n\nAbsentLéger :\ndifficultés seulement connues d\'une personne très familière du sujet\nManifeste :\ndifficultés clairement remarquées par n\'importe qui, mais n\'interférant pas substantiellement avec la capacité du sujet dans ce sous-domaine, sachant le contexte socioculturel du sujet, son âge, son sexe et son niveau éducatif\nMarqué :\ndifficultés interférent lourdement avec la capacité du sujet dans ce sous-domaine, cependant, le sujet est capable de faire quelque chose sans aide extérieure, bien que cela soit inadéquat et/ou occasionnel, s\'il est aidé, il atteint le niveau précédent de fonctionnement\nSévère :\ndifficultés rendant la personne incapable de réaliser quoique ce soit dans le sous-domaine en l\'absence d\'aide professionnelle, ou amenant le sujet à un résultat délétère, la survie n\'est pas mise en jeu\nTrès sévère :\ndifficultés et incapacités mettant en danger la survie de la personne',
    type: 'instruction',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'domain_d_definitions',
    text: '**Définitions à prendre en compte pour évaluer le domaine (d) :**\n\nDans ce contexte, « fréquent » qualifie un comportement survenu plus d\'une fois dans la période de référence ou qui est jugé comme pouvant probablement survenir à nouveau dans les six mois suivants. Si le comportement perturbateur/agressif n\'est pas fréquent, le degré de sévérité peut être diminué d\'un niveau, par exemple de sévère (v) à marqué (iv).\nUne blessure est qualifiée de grave si elle nécessite un passage aux urgences.',
    type: 'instruction',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  { 
    id: 'domain_d', 
    text: '(d) Comportements perturbateurs et agressifs',
    type: 'single_choice', 
    required: false, 
    display_if: SHOW_WHEN_TEST_DONE, 
    options: [
      { code: 'Absent', label: 'AbsentLéger', score: 0 },
      { code: 'Manifeste', label: 'Manifeste', score: 2 },
      { code: 'Marque', label: 'Marqué', score: 3 },
      { code: 'Severe', label: 'Sévère', score: 4 },
      { code: 'Tres_severe', label: 'Très sévère', score: 5 }
    ]
  },
  
  { 
    id: 'psp_step2_header', 
    text: '**Etape 2 : Choisir un intervalle de 10 points.**\n\nLes critères de chaque intervalle de 10 points sont spécifiés ci-dessous et sont basés sur différentes combinaisons des sévérités des quatre domaines principaux.',
    type: 'instruction', 
    required: false, 
    display_if: SHOW_WHEN_TEST_DONE 
  },
  {
    id: 'interval_selection', 
    text: 'Intervalle de 10 points',
    type: 'single_choice', 
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 1, label: '100-91 : Très bon fonctionnement dans les quatre domaines principaux. Le sujet est tenu en haute considérations pour ses qualités et affronte les problèmes de la vie de manière adéquate. Il est impliqué dans un large ensemble d\'intérêts et activités.', score: 1 },
      { code: 2, label: '90-81 : Bon fonctionnement dans les quatre domaines principaux. Présence seulement de difficultés ou problèmes courants.', score: 2 },
      { code: 3, label: '80-71 : Difficultés légères dans au moins un domaine (a)-(c).', score: 3 },
      { code: 4, label: '70-61 : Difficultés manifestes, mais pas marquées, dans au moins un domaine (a)-(c) ou bien difficultés légères dans le domaine (d).', score: 4 },
      { code: 5, label: '60-51 : Difficultés marquées dans un domaine (a)-(c) ou bien difficultés manifestes dans le domaine (d).', score: 5 },
      { code: 6, label: '50-41 : Difficultés marquées dans deux ou plus domaines (a)-(c) ou bien difficultés sévères dans un domaine (a)-(c) avec ou sans difficultés manifestes dans le domaine (d).', score: 6 },
      { code: 7, label: '40-31 : Difficultés sévères dans un domaine (a)-(c) et difficultés marquées dans un ou plus domaines (a)-(c) ou bien difficultés marquées dans le domaine (d).', score: 7 },
      { code: 8, label: '30-21 : Difficultés sévères dans deux domaines (a)-(c) ou bien difficultés sévères dans le domaine (d) avec ou sans difficultés dans les domaines (a)-(c).', score: 8 },
      { code: 9, label: '20-11 : Difficultés sévères dans tous les domaines (a)-(d) ou bien difficultés très sévères dans le domaine (d) avec ou sans difficultés dans les domaines (a)-(c). Si la personne réagit aux incitations extérieures, le score suggéré est entre 16 et 20 , dans le cas contraire, le score suggéré est entre 11 et 15.', score: 9 },
      { code: 10, label: '10-1 : Absence d\'autonomie dans les fonctions de base avec des comportements extrêmes sans risque vital (cotations entre 6 et 10) ou avec un risque vital comme par exemple, le risque de décès par dénutrition, déshydratation, infection, ou incapacité à reconnaître les situations manifestement dangereuses (cotations entre 1 et 5).', score: 10 }
    ]
  },
  
  { 
    id: 'psp_step3_header', 
    text: '**Etape 3: Ajuster le score à l\'intérieur de l\'intervalle de 10 points en fonction du jugement clinique.**\n\nAjuster le score dans l\'intervalle de 10 points (ex : 56, 64, 78), en prenant en compte l\'importance des difficultés dans d\'autres domaines de fonctionnement social, tels que :\n\nSoins accordés à la santé somatique ou psychologique\nSoins accordés au logement, l\'espace et l\'environnement de vie\nContribution aux activités ménagères, participation à la vie de la famille, du foyer ou du centre de jour\nRelations intimes ou sexuelles\nSoins accordés aux enfants\nRéseau de relations sociales, amicales ou d\'aide\nRespect des règles sociales\nIntérêts généraux\nGestion financière\nUtilisation des transports, des moyens de communication\nCapacité à affronter les crises\n\nNB : Les comportement et risques suicidaires ne sont pas pris en compte dans cette échelle.',
    type: 'instruction', 
    required: false, 
    display_if: SHOW_WHEN_TEST_DONE 
  },
  { 
    id: 'final_score', 
    text: 'Indiquez ici la cotation finale (/100)',
    type: 'number', 
    required: false, 
    display_if: SHOW_WHEN_TEST_DONE 
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
