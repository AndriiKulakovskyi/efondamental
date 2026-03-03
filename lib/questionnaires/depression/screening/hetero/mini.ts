// eFondaMental Platform - MINI (Mini International Neuropsychiatric Interview)
// Depression Screening - Hetero-questionnaire (clinician-administered)
// MINI 5.0.0 / DSM-IV - French version

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface DepressionMiniResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any;
  total_score: number | null;
  interpretation: string | null;
  minib_score: number | null;
  minib_risque: number | null;
  minib_risque_cot: number | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type DepressionMiniResponseInsert = Omit<
  DepressionMiniResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'interpretation' | 'minib_score' | 'minib_risque' | 'minib_risque_cot'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Helpers
// ============================================================================

const OUI_NON = [
  { code: 1, label: 'Oui', score: 1 },
  { code: 0, label: 'Non', score: 0 }
];

const OUI_NON_BIZARRE = [
  { code: 0, label: 'Non', score: 0 },
  { code: 1, label: 'Oui', score: 1 },
  { code: 2, label: 'Oui bizarre', score: 2 }
];

const OUI_NON_INCERTAIN = [
  { code: 1, label: 'Oui', score: 1 },
  { code: 0, label: 'Non', score: 0 },
  { code: 2, label: 'Incertain', score: 2 }
];

function boolQ(id: string, text: string, opts?: Partial<Question>): Question {
  return {
    id: id.toLowerCase(),
    text,
    type: 'single_choice',
    required: false,
    options: OUI_NON,
    ...opts
  };
}

// ============================================================================
// Section A: Episode Depressif Majeur
// ============================================================================

const SECTION_A: Question[] = [
  { id: 'section_a', text: 'A. ÉPISODE DÉPRESSIF MAJEUR', type: 'section', required: false },

  boolQ('minia1a', "A1 a) Vous est-il déjà arrivé de vous sentir particulièrement triste ou déprimé(e), la plupart du temps au cours de la journée, et ce, presque tous les jours, pendant une période de 2 semaines ?", { required: true }),

  boolQ('minia1b', "A1 b) Au cours des deux dernières semaines, vous êtes-vous senti(e) particulièrement triste, cafardeux(se), déprimé(e), la plupart du temps au cours de la journée et ce, presque tous les jours ?", {
    display_if: { '==': [{ var: 'minia1a' }, 1] }
  }),

  boolQ('minia2a', "A2 a) Vous êtes-vous déjà senti(e), pendant une période de deux semaines, nettement moins intéressé(e) par la plupart des choses, ou nettement moins capable de prendre plaisir aux choses auxquelles vous preniez plaisir habituellement ?", { required: true }),

  boolQ('minia2b', "A2 b) Au cours des deux dernières semaines, aviez-vous presque tout le temps le sentiment de n'avoir plus goût à rien, d'avoir perdu l'intérêt ou le plaisir pour les choses qui vous plaisent habituellement ?", {
    display_if: { '==': [{ var: 'minia2a' }, 1] }
  }),

  // A3 items: shown if A1a or A2a is Oui
  boolQ('minia3ads', "A3 a) Votre appétit a-t-il notablement changé ? Avez-vous pris ou perdu du poids sans en avoir l'intention ? (2 dernières semaines)", {
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia3aep', "A3 a) (Episode passé)", {
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia3bds', "A3 b) Aviez-vous des problèmes de sommeil presque toutes les nuits ? (2 dernières semaines)", {
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia3bep', "A3 b) (Episode passé)", {
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia3cds', "A3 c) Parliez-vous ou vous déplaciez-vous plus lentement que d'habitude ou, au contraire, vous sentiez-vous agité(e) ? (2 dernières semaines)", {
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia3cep', "A3 c) (Episode passé)", {
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia3dsd', "A3 d) Vous sentiez-vous fatigué(e), sans énergie, et ce presque tous les jours ? (2 dernières semaines)", {
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia3dep', "A3 d) (Episode passé)", {
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia3esd', "A3 e) Vous sentiez-vous sans valeur ou coupable, et ce presque tous les jours ? (2 dernières semaines)", {
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia3eep', "A3 e) (Episode passé)", {
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia3fsd', "A3 f) Aviez-vous du mal à vous concentrer ou à prendre des décisions ? (2 dernières semaines)", {
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia3fep', "A3 f) (Episode passé)", {
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia3gsd', "A3 g) Avez-vous pensé au suicide, à vous faire du mal ou tenté/planifié un suicide ? (2 dernières semaines)", {
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia3gep', "A3 g) (Episode passé)", {
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia3eeac', "Les exemples concordent avec une idée délirante (Episode actuel)", {
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] },
    help: "DEMANDEZ DES EXEMPLES."
  }),
  boolQ('minia3eepbis', "Les exemples concordent avec une idée délirante (Episode passé)", {
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia4sd', "A4) Les problèmes ont-ils entraîné des difficultés significatives ? (2 dernières semaines)", {
    required: true,
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia4ep', "A4) (Episode passé)", {
    required: true,
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia5ep', "A5) Entre 2 épisodes, vous êtes-vous senti(e) bien pendant au moins deux mois ?", {
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  boolQ('minia5bis', "Y A-T-IL AU MOINS 5 OUI ENTRE A1 ET A3 ET A4 EST-ELLE COTÉE OUI ?", {
    required: true,
    display_if: { 'or': [{ '==': [{ var: 'minia1a' }, 1] }, { '==': [{ var: 'minia2a' }, 1] }] }
  }),
  {
    id: 'miniedm',
    text: 'EPISODE DEPRESSIF MAJEUR',
    type: 'multiple_choice',
    required: false,
    options: [
      { code: 1, label: 'ACTUEL', score: 1 },
      { code: 2, label: 'PASSÉ', score: 2 },
      { code: 3, label: 'RÉCURRENT', score: 3 }
    ],
    display_if: { '==': [{ var: 'minia5bis' }, 1] }
  },
  {
    id: 'minia6a',
    text: "A6) a Combien d'épisodes de dépression avez-vous eus dans votre vie ?",
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    display_if: { '==': [{ var: 'minia5bis' }, 1] }
  }
];

// ============================================================================
// Section B: Risque Suicidaire
// ============================================================================

const SECTION_B: Question[] = [
  { id: 'section_b', text: 'B. RISQUE SUICIDAIRE', type: 'section', required: false },

  boolQ('minib1', "B1 Avez-vous eu un accident ? (Au cours du mois écoulé)", { required: true }),
  boolQ('minib1a', "B1 a) Avez-vous prévu ou eu l'intention de vous faire du mal dans cet accident ?", {
    display_if: { '==': [{ var: 'minib1' }, 1] }
  }),
  boolQ('minib1b', "B1 b) Avez-vous eu l'intention de mourir dans cet accident ?", {
    display_if: { '==': [{ var: 'minib1' }, 1] }
  }),

  boolQ('minib2', "B2 Vous est-il arrivé de vous sentir désespéré ?", { required: true }),
  boolQ('minib3', "B3 Avez-vous pensé qu'il vaudrait mieux que vous soyez mort(e), ou souhaité être mort(e) ?", { required: true }),
  boolQ('minib4', "B4 Avez-vous eu envie de vous faire du mal ou de vous blesser ?", { required: true }),
  boolQ('minib5', "B5 Avez-vous pensé à vous suicider ?", { required: true }),

  {
    id: 'minib5bis1',
    text: 'Fréquence',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Occasionnellement', score: 1 },
      { code: 2, label: 'Souvent', score: 2 },
      { code: 3, label: 'Très souvent', score: 3 }
    ],
    display_if: { '==': [{ var: 'minib5' }, 1] }
  },
  {
    id: 'minib5bis2',
    text: 'Intensité',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Légère', score: 1 },
      { code: 2, label: 'Modérée', score: 2 },
      { code: 3, label: 'Sévère', score: 3 }
    ],
    display_if: { '==': [{ var: 'minib5' }, 1] }
  },
  boolQ('minib5bis3', "Pouvez-vous dire que vous n'allez pas passer à l'acte durant ce programme thérapeutique ?", {
    display_if: { '==': [{ var: 'minib5' }, 1] }
  }),

  boolQ('minib6', "B6 Vous êtes-vous senti(e) incapable de contrôler ces impulsions ?", {
    required: true,
    display_if: { '==': [{ var: 'minib5' }, 1] }
  }),
  boolQ('minib7', "B7 Avez-vous planifié un suicide ?", { required: true }),
  boolQ('minib8', "B8 Avez-vous commencé à agir pour vous préparer à une tentative de suicide ?", { required: true }),
  boolQ('minib9', "B9 Vous êtes-vous délibérément blessé(e) sans avoir l'intention de mourir ?", { required: true }),
  boolQ('minib10', "B10 Avez-vous tenté de vous suicider ?", { required: true }),

  {
    id: 'minib10bis',
    text: 'Précision B10',
    type: 'multiple_choice',
    required: false,
    options: [
      { code: 1, label: 'Espériez-vous être secouru(e)/survivre ?', score: 1 },
      { code: 2, label: 'Avez-vous cru/eu l\'intention de mourir ?', score: 2 }
    ],
    display_if: { '==': [{ var: 'minib10' }, 1] }
  },

  boolQ('minib11', "B11 Avez-vous déjà fait une tentative de suicide ? (Au cours de votre vie)", { required: true }),

  boolQ('minib_risque', "Risque suicidaire actuel", {
    help: "Auto-calculé : Oui si au moins un item B2-B11 est Oui"
  }),
  {
    id: 'minib_score',
    text: 'SCORE RISQUE SUICIDAIRE ACTUEL',
    type: 'number',
    required: false,
    min: 0, max: 52,
    help: "Score calculé automatiquement"
  },
  {
    id: 'minib_risque_cot',
    text: 'RISQUE SUICIDAIRE ACTUEL',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Faible', score: 1 },
      { code: 2, label: 'Modéré', score: 2 },
      { code: 3, label: 'Élevé', score: 3 }
    ],
    display_if: { '==': [{ var: 'minib_risque' }, 1] }
  },
  {
    id: 'minib_com',
    text: 'COMMENTAIRE SUPPLEMENTAIRE sur le risque suicidaire',
    type: 'text',
    required: false
  }
];

// ============================================================================
// Section C: Episode (Hypo-)Maniaque
// ============================================================================

const SECTION_C: Question[] = [
  { id: 'section_c', text: 'C. ÉPISODE (HYPO-)MANIAQUE', type: 'section', required: false },

  boolQ('minic0', "Avez-vous dans votre famille des antécédents de maladie maniaco-dépressive ou de trouble bipolaire ?", {
    help: "CETTE QUESTION N'EST PAS UN CRITÈRE mais accroît la vigilance du clinicien."
  }),
  { id: 'minic0prec', text: 'VEUILLEZ PRECISER QUI', type: 'text', required: false, display_if: { '==': [{ var: 'minic0' }, 1] } },

  boolQ('minic1a', "C1 a Avez-vous déjà eu une période où vous vous sentiez tellement exalté(e) ou plein(e) d'énergie que cela vous a posé des problèmes ?", { required: true }),
  boolQ('minic1b', "C1 b Vous sentez-vous, en ce moment, exalté(e) ou plein(e) d'énergie ?", {
    display_if: { '==': [{ var: 'minic1a' }, 1] }
  }),

  boolQ('minic2a', "C2 a Avez-vous déjà eu une période de plusieurs jours où vous étiez tellement irritable que vous en arriviez à insulter les gens, à hurler, voire à vous battre ?", { required: true }),
  boolQ('minic2b', "C2 b Vous sentez-vous excessivement irritable en ce moment ?", {
    display_if: { '==': [{ var: 'minic2a' }, 1] }
  }),

  // C3 items: shown if C1a or C2a is Oui
  ...[
    ['minic3aea', 'minic3aep', "C3 a) Sentiment de pouvoir faire des choses dont les autres seraient incapables ou d'être quelqu'un de particulièrement important ?"],
    ['minic3bea', 'minic3bep', "C3 b) Moins besoin de sommeil que d'habitude ?"],
    ['minic3cea', 'minic3cep', "C3 c) Parliez-vous sans arrêt ou si vite que les gens avaient du mal à vous comprendre ?"],
    ['minic3dea', 'minic3dep', "C3 d) Vos pensées défilaient-elles si vite que vous ne pouviez pas bien les suivre ?"],
    ['minic3eea', 'minic3eep', "C3 e) Étiez-vous facilement distrait(e) ?"],
    ['minic3fea', 'minic3fep', "C3 f) Étiez-vous nettement plus actif(ve) et entreprenant(e) ?"],
    ['minic3gea', 'minic3gep', "C3 g) Aviez-vous tellement envie de faire des choses agréables que vous aviez tendance à en oublier les risques ?"],
  ].flatMap(([ea, ep, text]) => [
    boolQ(ea, `${text} (Episode actuel)`, {
      display_if: { 'or': [{ '==': [{ var: 'minic1a' }, 1] }, { '==': [{ var: 'minic2a' }, 1] }] }
    }),
    boolQ(ep, `${text} (Episode passé)`, {
      display_if: { 'or': [{ '==': [{ var: 'minic1a' }, 1] }, { '==': [{ var: 'minic2a' }, 1] }] }
    }),
  ]),

  boolQ('minic3aeac', "Idée délirante concordante ? (Episode actuel)", {
    display_if: { 'or': [{ '==': [{ var: 'minic1a' }, 1] }, { '==': [{ var: 'minic2a' }, 1] }] }
  }),
  boolQ('minic3aepbis', "Idée délirante concordante ? (Episode passé)", {
    display_if: { 'or': [{ '==': [{ var: 'minic1a' }, 1] }, { '==': [{ var: 'minic2a' }, 1] }] }
  }),

  boolQ('minic3recapea', "RECAPITULATIF C3 : Au moins 3 réponses OUI en C3 (ou 4 si C1a Non) ? (Episode actuel)", {
    display_if: { 'or': [{ '==': [{ var: 'minic1a' }, 1] }, { '==': [{ var: 'minic2a' }, 1] }] }
  }),
  boolQ('minic3recupep', "RECAPITULATIF C3 (Episode passé)", {
    display_if: { 'or': [{ '==': [{ var: 'minic1a' }, 1] }, { '==': [{ var: 'minic2a' }, 1] }] }
  }),

  ...[
    ['minic4ea', 'minic4ep', "C4 Durée maximale pendant laquelle ces symptômes ont persisté ?"],
  ].flatMap(([ea, ep, text]) => [
    { id: ea, text: `${text} (Episode actuel)`, type: 'single_choice' as const, required: false, options: [{ code: 1, label: 'a) 3 jours au moins', score: 1 }, { code: 2, label: 'b) 4 à 6 jours', score: 2 }, { code: 3, label: 'c) 7 jours ou plus', score: 3 }], display_if: { 'or': [{ '==': [{ var: 'minic1a' }, 1] }, { '==': [{ var: 'minic2a' }, 1] }] } },
    { id: ep, text: `${text} (Episode passé)`, type: 'single_choice' as const, required: false, options: [{ code: 1, label: 'a) 3 jours au moins', score: 1 }, { code: 2, label: 'b) 4 à 6 jours', score: 2 }, { code: 3, label: 'c) 7 jours ou plus', score: 3 }], display_if: { 'or': [{ '==': [{ var: 'minic1a' }, 1] }, { '==': [{ var: 'minic2a' }, 1] }] } },
  ]),

  boolQ('minic5ea', "C5 Avez-vous été hospitalisé(e) à cause de ces problèmes ? (Episode actuel)", {
    display_if: { 'or': [{ '==': [{ var: 'minic1a' }, 1] }, { '==': [{ var: 'minic2a' }, 1] }] }
  }),
  boolQ('minic5ep', "C5 (Episode passé)", {
    display_if: { 'or': [{ '==': [{ var: 'minic1a' }, 1] }, { '==': [{ var: 'minic2a' }, 1] }] }
  }),
  boolQ('minic6ea', "C6 Les problèmes ont-ils entraîné des difficultés significatives ? (Episode actuel)", {
    display_if: { 'or': [{ '==': [{ var: 'minic1a' }, 1] }, { '==': [{ var: 'minic2a' }, 1] }] }
  }),
  boolQ('minic6ep', "C6 (Episode passé)", {
    display_if: { 'or': [{ '==': [{ var: 'minic1a' }, 1] }, { '==': [{ var: 'minic2a' }, 1] }] }
  }),

  boolQ('minicepmania', "ÉPISODE MANIAQUE"),
  { id: 'minictypepmania', text: 'ÉPISODE MANIAQUE - Type', type: 'multiple_choice', required: false, options: [{ code: 1, label: 'ACTUEL', score: 1 }, { code: 2, label: 'PASSÉ', score: 2 }] },
  boolQ('minicephmania', "ÉPISODE HYPOMANIAQUE"),
  { id: 'minictypephmania', text: 'ÉPISODE HYPOMANIAQUE - Type', type: 'multiple_choice', required: false, options: [{ code: 1, label: 'ACTUEL', score: 1 }, { code: 2, label: 'PASSÉ', score: 2 }] },
  boolQ('minicsymania', "SYMPTOMES HYPOMANIAQUES"),
  { id: 'minictypsymania', text: 'SYMPTOMES HYPOMANIAQUES - Type', type: 'multiple_choice', required: false, options: [{ code: 1, label: 'ACTUEL', score: 1 }, { code: 2, label: 'PASSÉ', score: 2 }] },

  boolQ('minic7a', "C7 a) Au moins 2 épisodes maniaques durant votre vie ?"),
  boolQ('minic7b', "C7 b) Au moins 2 épisodes hypomaniaques durant votre vie ?"),
  boolQ('minic7c', "C7 c) Au moins 2 SYMPTÔMES hypomaniaques durant votre vie ?"),
];

// ============================================================================
// Section D: Trouble Panique
// ============================================================================

const SECTION_D: Question[] = [
  { id: 'section_d', text: 'D. TROUBLE PANIQUE', type: 'section', required: false },

  boolQ('minid1a', "D1 a) Avez-vous, à plus d'une occasion, eu des crises durant lesquelles vous vous êtes senti(e) subitement très anxieux(se) ?", { required: true }),
  boolQ('minid1b', "D1 b) Ces crises atteignaient-elles leur intensité maximale en moins de 10 minutes ?", {
    required: true,
    display_if: { '==': [{ var: 'minid1a' }, 1] }
  }),
  boolQ('minid2', "D2 Certaines de ces crises ont-elles été imprévisibles ?", {
    required: true,
    display_if: { 'and': [{ '==': [{ var: 'minid1a' }, 1] }, { '==': [{ var: 'minid1b' }, 1] }] }
  }),
  boolQ('minid3', "D3 Avez-vous eu une période d'au moins un mois durant laquelle vous redoutiez d'avoir d'autres crises ?", {
    required: true,
    display_if: { 'and': [{ '==': [{ var: 'minid1a' }, 1] }, { '==': [{ var: 'minid1b' }, 1] }, { '==': [{ var: 'minid2' }, 1] }] }
  }),

  ...[
    ['minid4a', 'Palpitations ?'],
    ['minid4b', 'Transpiration/mains moites ?'],
    ['minid4c', 'Tremblements ?'],
    ['minid4d', 'Mal à respirer/étouffer ?'],
    ['minid4e', 'Impression de suffoquer ?'],
    ['minid4f', 'Douleur thoracique ?'],
    ['minid4g', 'Nausée/gêne estomac ?'],
    ['minid4h', 'Vertige/évanouir ?'],
    ['minid4i', 'Choses étranges/irréelles ?'],
    ['minid4j', 'Peur de perdre le contrôle ?'],
    ['minid4k', 'Peur de mourir ?'],
    ['minid4l', 'Engourdissements/picotements ?'],
    ['minid4m', 'Bouffées de chaleur/frissons ?'],
  ].map(([id, text]) => boolQ(id, `D4 ${text}`, {
    display_if: { 'and': [{ '==': [{ var: 'minid1a' }, 1] }, { '==': [{ var: 'minid1b' }, 1] }, { '==': [{ var: 'minid2' }, 1] }] }
  })),

  boolQ('minid5', "D5 TROUBLE PANIQUE VIE ENTIÈRE", {
    display_if: { '==': [{ var: 'minid1a' }, 1] },
    help: "Oui si D3 Oui ET ≥4 symptômes D4 Oui"
  }),
  boolQ('minid6', "D6 SYMPTÔMES ANXIEUX PAROXYSTIQUES LIMITÉS VIE ENTIÈRE", {
    display_if: { '==': [{ var: 'minid1a' }, 1] },
    help: "Oui si D4 count > 0 mais < 4"
  }),
  boolQ('minid7', "D7 Au cours du mois écoulé, avez-vous eu de telles crises à plusieurs reprises avec peur constante ?", {
    display_if: { '==': [{ var: 'minid1a' }, 1] }
  }),
  boolQ('minid4tropanact', "TROUBLE PANIQUE ACTUEL", {
    display_if: { '==': [{ var: 'minid1a' }, 1] },
    help: "Oui si D7 Oui"
  }),
];

// ============================================================================
// Section E: Agoraphobie
// ============================================================================

const SECTION_E: Question[] = [
  { id: 'section_e', text: 'E. AGORAPHOBIE', type: 'section', required: false },
  boolQ('minie1', "E1 Êtes-vous anxieux(se) dans les endroits ou situations dont il est difficile de s'échapper ?", { required: true }),
  boolQ('minie2', "E2 Redoutez-vous tellement ces situations que vous les évitez ?", {
    required: true,
    display_if: { '==': [{ var: 'minie1' }, 1] }
  }),
  boolQ('minietrpanagroa', "TROUBLE PANIQUE avec Agoraphobie ACTUEL", { help: "Auto-calculé" }),
  boolQ('minietrpansaga', "TROUBLE PANIQUE sans Agoraphobie ACTUEL", { help: "Auto-calculé" }),
  boolQ('minieagasatp', "AGORAPHOBIE ACTUELLE sans antécédents de Trouble panique", { help: "Auto-calculé" }),
];

// ============================================================================
// Section F: Phobie Sociale
// ============================================================================

const SECTION_F: Question[] = [
  { id: 'section_f', text: 'F. PHOBIE SOCIALE', type: 'section', required: false },
  boolQ('minif1', "F1 Avez-vous redouté d'être le centre de l'attention ou d'être humilié(e) dans des situations sociales ? (Au cours du mois écoulé)", { required: true }),
  boolQ('minif2', "F2 Cette peur est-elle excessive ou déraisonnable ?", {
    required: true,
    display_if: { '==': [{ var: 'minif1' }, 1] }
  }),
  boolQ('minif3', "F3 Redoutez-vous tellement ces situations que vous les évitez ?", {
    required: true,
    display_if: { 'and': [{ '==': [{ var: 'minif1' }, 1] }, { '==': [{ var: 'minif2' }, 1] }] }
  }),
  boolQ('minif4', "F4 Cette peur entraîne-t-elle une souffrance significative ?", {
    required: true,
    display_if: { 'and': [{ '==': [{ var: 'minif1' }, 1] }, { '==': [{ var: 'minif2' }, 1] }, { '==': [{ var: 'minif3' }, 1] }] }
  }),
  boolQ('minifphosoc', "PHOBIE SOCIALE (Trouble anxiété sociale) ACTUELLE", {
    display_if: { 'and': [{ '==': [{ var: 'minif1' }, 1] }, { '==': [{ var: 'minif2' }, 1] }, { '==': [{ var: 'minif3' }, 1] }] }
  }),
  boolQ('minief5', "Craignez-vous ou évitez-vous 4 situations sociales ou plus ?", {
    display_if: { '==': [{ var: 'minifphosoc' }, 1] }
  }),
  { id: 'minifphosocgen', text: 'PHOBIE SOCIALE ACTUELLE', type: 'single_choice', required: false, options: [{ code: 1, label: 'GÉNÉRALISÉE', score: 1 }, { code: 0, label: 'NON GÉNÉRALISÉE', score: 0 }], display_if: { '==': [{ var: 'minifphosoc' }, 1] } },
];

// ============================================================================
// Section G: TOC
// ============================================================================

const SECTION_G: Question[] = [
  { id: 'section_g', text: 'G. TROUBLE OBSESSIONNEL COMPULSIF', type: 'section', required: false },
  boolQ('minig1', "G1 Pensées/pulsions/images déplaisantes récurrentes ? (Au cours du mois écoulé)", { required: true }),
  boolQ('minig2', "G2 Avez-vous essayé de résister à ces idées sans succès ?", {
    required: true,
    display_if: { '==': [{ var: 'minig1' }, 1] }
  }),
  boolQ('minig3', "G3 Pensez-vous que ces idées sont le produit de votre propre pensée ?", {
    required: true,
    display_if: { 'and': [{ '==': [{ var: 'minig1' }, 1] }, { '==': [{ var: 'minig2' }, 1] }] }
  }),
  boolQ('minig4', "G4 Besoin de faire certaines choses sans cesse (laver, compter, vérifier) ? (Au cours du mois écoulé)", { required: true }),
  boolQ('minig5', "G5 Avez-vous réalisé que ces comportements étaient irrationnels ?", { required: true }),
  boolQ('minig6', "G6 Ces pensées/comportements vous ont-ils gêné(e) ou pris plus d'1h/jour ?", {
    required: true,
    display_if: { 'or': [
      { 'and': [{ '==': [{ var: 'minig1' }, 1] }, { '==': [{ var: 'minig2' }, 1] }, { '==': [{ var: 'minig3' }, 1] }] },
      { '==': [{ var: 'minig4' }, 1] }
    ] }
  }),
  boolQ('minigtruobscomact', "TROUBLE OBSESSIONNEL COMPULSIF ACTUEL"),
];

// ============================================================================
// Section H: ESPT
// ============================================================================

const SECTION_H: Question[] = [
  { id: 'section_h', text: 'H. ÉTAT DE STRESS POST-TRAUMATIQUE', type: 'section', required: false },
  boolQ('minih1', "H1 Avez-vous déjà vécu ou été témoin d'un événement extrêmement traumatique ?", { required: true }),
  boolQ('minih2', "H2 Avez-vous réagi avec peur intense, impuissance ou horreur ?", {
    required: true,
    display_if: { '==': [{ var: 'minih1' }, 1] }
  }),
  boolQ('minih3', "H3 Pensées pénibles récurrentes, flashbacks ? (Au cours du mois écoulé)", {
    required: true,
    display_if: { 'and': [{ '==': [{ var: 'minih1' }, 1] }, { '==': [{ var: 'minih2' }, 1] }] }
  }),

  ...[
    ['minih4a', "H4 a) Essayé de ne plus penser à l'événement ?"],
    ['minih4b', "H4 b) Évité les lieux/gens/activités rappelant l'événement ?"],
    ['minih4c', "H4 c) Mal à vous souvenir exactement ?"],
    ['minih4d', "H4 d) Perdu l'intérêt pour vos hobbies ?"],
    ['minih4e', "H4 e) Vous senti(e) détaché(e) ?"],
    ['minih4f', "H4 f) Difficultés à ressentir les choses ?"],
    ['minih4g', "H4 g) Impression que votre vie allait se terminer ?"],
  ].map(([id, text]) => boolQ(id, text, {
    display_if: { 'and': [{ '==': [{ var: 'minih1' }, 1] }, { '==': [{ var: 'minih2' }, 1] }, { '==': [{ var: 'minih3' }, 1] }] }
  })),

  ...[
    ['minih5a', "H5 a) Difficultés à dormir ?"],
    ['minih5b', "H5 b) Particulièrement irritable ?"],
    ['minih5c', "H5 c) Difficultés à vous concentrer ?"],
    ['minih5d', "H5 d) Nerveux(se)/sur vos gardes ?"],
    ['minih5e', "H5 e) Un rien vous faisait sursauter ?"],
  ].map(([id, text]) => boolQ(id, text, {
    display_if: { 'and': [{ '==': [{ var: 'minih1' }, 1] }, { '==': [{ var: 'minih2' }, 1] }, { '==': [{ var: 'minih3' }, 1] }] }
  })),

  boolQ('minih6', "H6 Ces problèmes vous ont-ils causé une souffrance ou gêné dans vos activités ?", {
    display_if: { 'and': [{ '==': [{ var: 'minih1' }, 1] }, { '==': [{ var: 'minih2' }, 1] }, { '==': [{ var: 'minih3' }, 1] }] }
  }),
  boolQ('minihstress', "ÉTAT DE STRESS POST-TRAUMATIQUE ACTUEL"),
];

// ============================================================================
// Section I: Dependance/Abus Alcool
// ============================================================================

const SECTION_I: Question[] = [
  { id: 'section_i', text: 'I. DÉPENDANCE / ABUS D\'ALCOOL', type: 'section', required: false },
  boolQ('minii1', "I1 Au cours des 12 derniers mois, avez-vous bu à au moins 3 reprises plus de 3 verres en moins de 3 heures ?", { required: true }),

  ...[
    ['minii2a', "I2 a) Besoin de plus grandes quantités ?"],
    ['minii2b', "I2 b) Tremblements/transpiration quand vous buviez moins ?"],
    ['minii2c', "I2 c) Buviez-vous souvent plus que prévu ?"],
    ['minii2d', "I2 d) Essayé sans succès de réduire ?"],
    ['minii2e', "I2 e) Beaucoup de temps à vous procurer/boire/récupérer ?"],
    ['minii2f', "I2 f) Réduit vos activités quotidiennes ?"],
    ['minii2g', "I2 g) Continué malgré problèmes de santé ?"],
  ].map(([id, text]) => boolQ(id, text, {
    display_if: { '==': [{ var: 'minii1' }, 1] }
  })),

  boolQ('miniidepalcact', "DÉPENDANCE ALCOOLIQUE ACTUELLE", {
    help: "Oui si ≥3 items I2 Oui"
  }),

  ...[
    ['minii3a', "I3 a) Grisé alors que vous aviez des choses à faire ? Problèmes ?"],
    ['minii3b', "I3 b) Sous l'effet de l'alcool en situation risquée ?"],
    ['minii3c', "I3 c) Problèmes légaux ?"],
    ['minii3d', "I3 d) Continué malgré problèmes familiaux ?"],
  ].map(([id, text]) => boolQ(id, text, {
    display_if: { '==': [{ var: 'minii1' }, 1] }
  })),

  boolQ('miniiabalcac', "ABUS D'ALCOOL ACTUEL", {
    help: "Oui si ≥1 item I3 Oui"
  }),
];

// ============================================================================
// Section J: Dependance/Abus Substance
// ============================================================================

const SUBSTANCE_OPTIONS = [
  'amphétamines', 'speed', 'Ritaline', 'pilules coupe-faim',
  'cocaïne', 'coke', 'crack', 'speedball',
  'héroïne', 'morphine', 'opium', 'méthadone', 'codéine', 'mépéridine', 'fentanyl',
  'LSD', 'acide', 'mescaline', 'champignons', 'ecstasy', 'PCP/kétamine',
  'colle', 'éther',
  'haschisch', 'hasch', 'THC', 'cannabis', 'herbe', 'shit',
  'Valium', 'Xanax', 'Témesta', 'Halcion', 'Lexomil',
  'secobarbital', 'barbis',
  'anabolisants', 'stéroïdes', 'popers'
];

const SECTION_J: Question[] = [
  { id: 'section_j', text: 'J. DÉPENDANCE / ABUS DE SUBSTANCE(S)', type: 'section', required: false },

  boolQ('minij1a', "J1 a Au cours des 12 derniers mois, avez-vous pris un de ces produits pour planer/changer votre humeur ?", { required: true }),

  {
    id: 'minijprodcons',
    text: 'COCHER CHAQUE PRODUIT CONSOMMÉ',
    type: 'multiple_choice',
    required: false,
    options: SUBSTANCE_OPTIONS.map((label, i) => ({ code: i + 1, label, score: i + 1 })),
    display_if: { '==': [{ var: 'minij1a' }, 1] }
  },

  boolQ('minijmedoc', "Prenez-vous des médicaments contre la toux ou d'autres substances ?", {
    display_if: { '==': [{ var: 'minij1a' }, 1] }
  }),
  { id: 'minijsubcons', text: 'Spécifier la/les substances les plus consommées', type: 'text', required: false, display_if: { '==': [{ var: 'minij1a' }, 1] } },
  { id: 'minijsubconprob', text: 'Quelle(s) substance(s) a(ont) occasionné le plus de problèmes ?', type: 'text', required: false, display_if: { '==': [{ var: 'minij1a' }, 1] } },

  ...[
    ['minij2a', "J2 a) Augmenté les quantités pour même effet ?"],
    ['minij2b', "J2 b) Symptômes de sevrage ?"],
    ['minij2c', "J2 c) En preniez plus que prévu ?"],
    ['minij2d', "J2 d) Essayé sans succès de réduire ?"],
    ['minij2e', "J2 e) Beaucoup de temps à procurer/consommer/récupérer ?"],
    ['minij2f', "J2 f) Réduit vos activités ?"],
    ['minij2g', "J2 g) Continué malgré problèmes de santé ?"],
  ].map(([id, text]) => boolQ(id, text, {
    display_if: { '==': [{ var: 'minij1a' }, 1] }
  })),

  { id: 'minijspecsub', text: 'Spécifier la(les) substance(s)', type: 'text', required: false, display_if: { '==': [{ var: 'minij1a' }, 1] } },
  boolQ('minijdepsubact', "DÉPENDANCE à une (des) substance(s) ACTUELLE", { help: "Oui si ≥3 items J2 Oui" }),

  ...[
    ['minij3a', "J3 a) Intoxiqué(e) avec obligations ? Problèmes ?"],
    ['minij3b', "J3 b) Sous l'effet en situation risquée ?"],
    ['minij3c', "J3 c) Problèmes légaux ?"],
    ['minij3d', "J3 d) Continué malgré problèmes familiaux ?"],
  ].map(([id, text]) => boolQ(id, text, {
    display_if: { '==': [{ var: 'minij1a' }, 1] }
  })),

  boolQ('minijabusubact', "ABUS DE SUBSTANCE(S) ACTUEL", { help: "Oui si ≥1 item J3 Oui" }),
  { id: 'minijspecsub1', text: 'Spécifier la(les) substance(s)', type: 'text', required: false, display_if: { '==': [{ var: 'minij1a' }, 1] } },
];

// ============================================================================
// Section K: Troubles Psychotiques
// ============================================================================

const SECTION_K: Question[] = [
  { id: 'section_k', text: 'K. TROUBLES PSYCHOTIQUES', type: 'section', required: false },

  ...[
    ['minik1a', 'minik1b', "K1 Impression que quelqu'un vous espionne ou complote contre vous ?"],
    ['minik2a', 'minik2b', "K2 Impression qu'on pouvait lire vos pensées ou que vous pouviez lire celles des autres ?"],
    ['minik3a', 'minik3b', "K3 Cru que quelque chose d'extérieur introduisait des pensées étranges ?"],
    ['minik4a', 'minik4b', "K4 Impression qu'on s'adressait à vous à travers la télévision/radio ?"],
    ['minik5a', 'minik5b', "K5 Vos proches ont-ils jugé certaines de vos idées comme étranges ?"],
  ].flatMap(([a, b, text]) => [
    { id: a, text: `${text} (Vie entière)`, type: 'single_choice' as const, required: false, options: OUI_NON_BIZARRE },
    { id: b, text: `${text} (Actuel)`, type: 'single_choice' as const, required: false, options: OUI_NON_BIZARRE },
  ]),

  { id: 'minik6a', text: "K6 a) Avez-vous entendu des choses que d'autres ne pouvaient pas entendre, comme des voix ? (Vie entière)", type: 'single_choice', required: false, options: OUI_NON_BIZARRE },
  { id: 'minik6a1', text: "Voix commentant vos pensées/actes ou plusieurs voix parlant entre elles ?", type: 'single_choice', required: false, options: OUI_NON_BIZARRE },
  { id: 'minik6b', text: "K6 b) (Au cours du mois écoulé)", type: 'single_choice', required: false, options: OUI_NON_BIZARRE },
  { id: 'minik6b1', text: "Voix commentant vos pensées/actes (actuel) ?", type: 'single_choice', required: false, options: OUI_NON_BIZARRE },

  { id: 'minik7a', text: "K7 a) Visions ou choses que d'autres ne pouvaient pas voir ? (Vie entière)", type: 'single_choice', required: false, options: OUI_NON_BIZARRE },
  { id: 'minik7b', text: "K7 b) Au cours du mois écoulé ?", type: 'single_choice', required: false, options: OUI_NON_BIZARRE },

  boolQ('minik8b', "K8 b) Discours incohérent ou désorganisé ? (OBSERVATION DU CLINICIEN)"),
  boolQ('minik9b', "K9 b) Comportement désorganisé ou catatonique ? (OBSERVATION DU CLINICIEN)"),
  boolQ('minik10b', "K10 b) Symptômes négatifs schizophréniques au premier plan ? (OBSERVATION DU CLINICIEN)"),

  boolQ('minik11a', "K11 b) Les symptômes psychotiques sont-ils survenus uniquement pendant les périodes de dépression/exaltation/irritabilité ?"),
  boolQ('minik11b', "TROUBLE DE L'HUMEUR AVEC CARACTÉRISTIQUES PSYCHOTIQUES VIE ENTIÈRE"),
  boolQ('minik12a', "K12 a) TROUBLE DE L'HUMEUR AVEC CARACTÉRISTIQUES PSYCHOTIQUES ACTUEL"),

  boolQ('minik13b', "K13 ≥1 'b' question Oui bizarre OU ≥2 'b' questions Oui pendant même mois ?"),
  boolQ('minik13', "SYNDROME PSYCHOTIQUE ACTUEL"),
  boolQ('minik14b', "K14 K13 Oui OU ≥1 'a' question Oui bizarre OU ≥2 'a' questions Oui ?"),
  boolQ('minik14', "SYNDROME PSYCHOTIQUE VIE ENTIÈRE"),
];

// ============================================================================
// Section L: Anorexie Mentale
// ============================================================================

const SECTION_L: Question[] = [
  { id: 'section_l', text: 'L. ANOREXIE MENTALE', type: 'section', required: false },
  { id: 'minil1a', text: 'Combien mesurez-vous ?', type: 'number', required: false, min: 50, max: 250 },
  { id: 'minil1b', text: 'Au cours des 3 derniers mois, quel a été votre poids le plus faible ?', type: 'number', required: false, min: 20, max: 300 },
  boolQ('minil1c', "Le poids du patient est-il inférieur au seuil critique pour sa taille ?"),
  boolQ('minil2', "L2 Avez-vous essayé de ne pas prendre de poids malgré un poids faible ?"),
  boolQ('minil3', "L3 Aviez-vous peur de prendre du poids ?"),
  boolQ('minil4a', "L4 a) Vous trouviez-vous encore trop gros(se) ?"),
  boolQ('minil4b', "L4 b) L'estime de vous-même était-elle influencée par votre poids ?"),
  boolQ('minil4c', "L4 c) Pensiez-vous que ce poids était normal, voire excessif ?"),
  boolQ('minil6', "L6 (Femmes) Arrêt des règles ces 3 derniers mois ?"),
  boolQ('minilanomenact', "ANOREXIE MENTALE ACTUELLE"),
];

// ============================================================================
// Section M: Boulimie
// ============================================================================

const SECTION_M: Question[] = [
  { id: 'section_m', text: 'M. BOULIMIE', type: 'section', required: false },
  boolQ('minim1', "M1 Crises de boulimie (grandes quantités en <2h) ?"),
  boolQ('minim2', "M2 Au moins 2 fois par semaine ces 3 derniers mois ?"),
  boolQ('minim3', "M3 Impression de ne pas pouvoir vous arrêter ?"),
  boolQ('minim4', "M4 Comportements compensatoires (vomissements, laxatifs, exercice) ?"),
  boolQ('minim5', "M5 L'estime de vous-même influencée par votre poids ?"),
  boolQ('minim6', "M6 Le patient présente-t-il une anorexie mentale ?"),
  boolQ('minim7', "M7 Ces crises surviennent-elles toujours sous un certain poids ?"),
  boolQ('minim8', "M8 BOULIMIE ACTUELLE"),
  boolQ('minim8bis', "ANOREXIE MENTALE type boulimie/vomissements ACTUELLE"),
];

// ============================================================================
// Section N: Anxiete Generalisee
// ============================================================================

const SECTION_N: Question[] = [
  { id: 'section_n', text: 'N. ANXIÉTÉ GÉNÉRALISÉE', type: 'section', required: false },
  boolQ('minin1a', "N1 a) Excessivement préoccupé(e)/inquiet(e)/anxieux(se) ces 6 derniers mois ?"),
  boolQ('minin1b', "N1 b) Préoccupations presque tous les jours ?", {
    display_if: { '==': [{ var: 'minin1a' }, 1] }
  }),
  boolQ('minin1c', "L'anxiété est-elle uniquement liée aux troubles explorés précédemment ?", {
    display_if: { 'and': [{ '==': [{ var: 'minin1a' }, 1] }, { '==': [{ var: 'minin1b' }, 1] }] }
  }),
  boolQ('minin2', "N2 Difficile de contrôler ces préoccupations ?", {
    display_if: { 'and': [{ '==': [{ var: 'minin1a' }, 1] }, { '==': [{ var: 'minin1b' }, 1] }] }
  }),
  ...[
    ['minin3a', "N3 a) Agité(e), tendu(e) ?"],
    ['minin3b', "N3 b) Muscles tendus ?"],
    ['minin3c', "N3 c) Fatigué(e), faible ?"],
    ['minin3d', "N3 d) Difficultés de concentration ?"],
    ['minin3e', "N3 e) Particulièrement irritable ?"],
    ['minin3f', "N3 f) Problèmes de sommeil ?"],
  ].map(([id, text]) => boolQ(id, text, {
    display_if: { 'and': [{ '==': [{ var: 'minin1a' }, 1] }, { '==': [{ var: 'minin1b' }, 1] }] }
  })),
  boolQ('minin4', "N4 Cette anxiété entraîne-t-elle une souffrance importante ?", {
    display_if: { 'and': [{ '==': [{ var: 'minin1a' }, 1] }, { '==': [{ var: 'minin1b' }, 1] }] }
  }),
  boolQ('mininanxgenact', "ANXIÉTÉ GÉNÉRALISÉE ACTUELLE"),
];

// ============================================================================
// Section O: Causes Medicales
// ============================================================================

const SECTION_O: Question[] = [
  { id: 'section_o', text: 'O. CAUSES MÉDICALES', type: 'section', required: false },
  { id: 'minio1a', text: "O1a Preniez-vous un médicament ou des remèdes ?", type: 'single_choice', required: false, options: OUI_NON_INCERTAIN },
  { id: 'minio1b', text: "O1b Aviez-vous une maladie physique ?", type: 'single_choice', required: false, options: OUI_NON_INCERTAIN },
  { id: 'minio2', text: "O2 UNE CAUSE ORGANIQUE A-T-ELLE ÉTÉ ÉCARTÉE ?", type: 'single_choice', required: false, options: OUI_NON_INCERTAIN },
];

// ============================================================================
// Section P: Trouble Personnalite Antisociale
// ============================================================================

const SECTION_P: Question[] = [
  { id: 'section_p', text: 'P. TROUBLE PERSONNALITÉ ANTISOCIALE', type: 'section', required: false },

  ...[
    ['minip1a', "P1 a) Fait l'école buissonnière ou passé la nuit dehors ?"],
    ['minip1b', "P1 b) Fréquemment menti, triché, volé ?"],
    ['minip1c', "P1 c) Brutalisé, menacé ou intimidé les autres ?"],
    ['minip1d', "P1 d) Volontairement détruit ou mis le feu ?"],
    ['minip1e', "P1 e) Volontairement fait souffrir des animaux ou des gens ?"],
    ['minip1f', "P1 f) Contraint quelqu'un à avoir des relations sexuelles ?"],
  ].map(([id, text]) => boolQ(id, `${text} (Avant l'âge de 15 ans)`)),

  ...[
    ['minip2a', "P2 a) Comportements irresponsables ?"],
    ['minip2b', "P2 b) Choses illégales ?"],
    ['minip2c', "P2 c) Souvent violent physiquement ?"],
    ['minip2d', "P2 d) Souvent menti ou arnaqué les autres ?"],
    ['minip2e', "P2 e) Exposé des gens à des dangers ?"],
    ['minip2f', "P2 f) Aucune culpabilité après avoir blessé/maltraité/volé ?"],
  ].map(([id, text]) => boolQ(id, `${text} (Depuis l'âge de 15 ans)`)),

  boolQ('miniptroperantisoc', "TROUBLE DE LA PERSONNALITÉ ANTISOCIALE VIE ENTIÈRE"),
];

// ============================================================================
// Section Diagnostique
// ============================================================================

const SECTION_DIAG: Question[] = [
  { id: 'section_diag', text: 'DIAGNOSTIQUE', type: 'section', required: false },

  { id: 'tdm', text: 'TROUBLE DÉPRESSIF MAJEUR', type: 'multiple_choice', required: false, options: [{ code: 1, label: 'Actuel', score: 1 }, { code: 2, label: 'Passé', score: 2 }] },
  { id: 'tdm_caract_psy', text: 'TROUBLE DÉPRESSIF MAJEUR avec caractéristiques psychotiques', type: 'multiple_choice', required: false, options: [{ code: 1, label: 'Actuel', score: 1 }, { code: 2, label: 'Passé', score: 2 }] },
  { id: 'tbi', text: 'TROUBLE BIPOLAIRE I', type: 'multiple_choice', required: false, options: [{ code: 1, label: 'Actuel', score: 1 }, { code: 2, label: 'Passé', score: 2 }] },
  { id: 'epi_mania_iso', text: 'Épisode maniaque isolé', type: 'multiple_choice', required: false, options: [{ code: 1, label: 'Actuel', score: 1 }, { code: 2, label: 'Passé', score: 2 }] },
  { id: 'tbi_caract_psy', text: 'TROUBLE BIPOLAIRE I avec caractéristiques psychotiques', type: 'multiple_choice', required: false, options: [{ code: 1, label: 'Actuel', score: 1 }, { code: 2, label: 'Passé', score: 2 }] },
  { id: 'tbi_epi_rec', text: 'Épisode le plus récent (TB I)', type: 'single_choice', required: false, options: [{ code: -1, label: '', score: -1 }, { code: 1, label: 'Maniaque', score: 1 }, { code: 2, label: 'Dépressif', score: 2 }, { code: 3, label: 'Mixte', score: 3 }, { code: 4, label: 'Hypomaniaque', score: 4 }, { code: 5, label: 'Non spécifié', score: 5 }] },
  { id: 'tbii', text: 'TROUBLE BIPOLAIRE II', type: 'multiple_choice', required: false, options: [{ code: 1, label: 'Actuel', score: 1 }, { code: 2, label: 'Passé', score: 2 }] },
  { id: 'tbii_epi_rec', text: 'Épisode le plus récent (TB II)', type: 'single_choice', required: false, options: [{ code: 1, label: 'Hypomaniaque', score: 1 }, { code: 2, label: 'Dépressif', score: 2 }] },
  { id: 'minitb2_hypo', text: 'Hypomaniaque (TB II)', type: 'multiple_choice', required: false, options: [{ code: 1, label: 'Actuel', score: 1 }, { code: 2, label: 'Passé', score: 2 }] },
  { id: 'minitb2_depress', text: 'Dépressif (TB II)', type: 'multiple_choice', required: false, options: [{ code: 1, label: 'Actuel', score: 1 }, { code: 2, label: 'Passé', score: 2 }] },
  { id: 'tbns', text: 'TROUBLE BIPOLAIRE NON SPÉCIFIÉ', type: 'multiple_choice', required: false, options: [{ code: 1, label: 'Actuel', score: 1 }, { code: 2, label: 'Passé', score: 2 }] },
];

// ============================================================================
// Combined Questions
// ============================================================================

export const DEPRESSION_MINI_QUESTIONS: Question[] = [
  ...SECTION_A,
  ...SECTION_B,
  ...SECTION_C,
  ...SECTION_D,
  ...SECTION_E,
  ...SECTION_F,
  ...SECTION_G,
  ...SECTION_H,
  ...SECTION_I,
  ...SECTION_J,
  ...SECTION_K,
  ...SECTION_L,
  ...SECTION_M,
  ...SECTION_N,
  ...SECTION_O,
  ...SECTION_P,
  ...SECTION_DIAG,
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

export const DEPRESSION_MINI_DEFINITION: QuestionnaireDefinition = {
  id: 'depression_mini',
  code: 'MINI',
  title: 'MINI - Mini International Neuropsychiatric Interview',
  description: "Entretien neuropsychiatrique structuré (MINI 5.0.0 / DSM-IV) couvrant les principaux troubles de l'Axe I.",
  instructions: "L'entretien doit être administré par un clinicien formé. Les questions doivent être lues telles quelles au patient.",
  questions: DEPRESSION_MINI_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['depression'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Score Computation: Section B Suicide Risk
// ============================================================================

export interface DepressionMiniScoreInput {
  minib2?: number;
  minib3?: number;
  minib4?: number;
  minib5?: number;
  minib6?: number;
  minib7?: number;
  minib8?: number;
  minib9?: number;
  minib10?: number;
  minib11?: number;
  [key: string]: any;
}

const SUICIDE_RISK_WEIGHTS: Record<string, number> = {
  minib2: 1,
  minib3: 1,
  minib4: 2,
  minib5: 6,
  minib6: 8,
  minib7: 8,
  minib8: 9,
  minib9: 4,
  minib10: 9,
  minib11: 4,
};

export function computeMiniSuicideRiskScore(responses: DepressionMiniScoreInput): number {
  let score = 0;
  for (const [field, weight] of Object.entries(SUICIDE_RISK_WEIGHTS)) {
    if (responses[field] === 1) {
      score += weight;
    }
  }
  return score;
}

export function getMiniSuicideRiskFlag(responses: DepressionMiniScoreInput): number {
  const riskItems = ['minib2', 'minib3', 'minib4', 'minib5', 'minib6', 'minib7', 'minib8', 'minib9', 'minib10', 'minib11'];
  return riskItems.some(k => responses[k] === 1) ? 1 : 0;
}

export function getMiniSuicideRiskLevel(score: number): number {
  if (score <= 0) return 0;
  if (score < 9) return 1;
  if (score < 17) return 2;
  return 3;
}

export function interpretMiniSuicideRisk(score: number): string {
  if (score <= 0) return "Pas de risque suicidaire identifié.";
  if (score < 9) return `Score ${score}/52. Risque suicidaire faible.`;
  if (score < 17) return `Score ${score}/52. Risque suicidaire modéré. Surveillance recommandée.`;
  return `Score ${score}/52. Risque suicidaire élevé. Intervention urgente nécessaire.`;
}

export interface DepressionMiniScoringResult {
  total_score: number;
  interpretation: string;
  minib_score: number;
  minib_risque: number;
  minib_risque_cot: number;
}

export function scoreDepressionMini(responses: DepressionMiniScoreInput): DepressionMiniScoringResult {
  const minib_score = computeMiniSuicideRiskScore(responses);
  const minib_risque = getMiniSuicideRiskFlag(responses);
  const minib_risque_cot = getMiniSuicideRiskLevel(minib_score);
  const interpretation = interpretMiniSuicideRisk(minib_score);

  return {
    total_score: minib_score,
    interpretation,
    minib_score,
    minib_risque,
    minib_risque_cot
  };
}

// ============================================================================
// Multiple-choice field mappings (question id -> DB column suffixes)
// ============================================================================

export const MINI_MULTI_CHOICE_FIELDS: Record<string, number[]> = {
  miniedm: [1, 2, 3],
  minictypepmania: [1, 2],
  minictypephmania: [1, 2],
  minictypsymania: [1, 2],
  minib10bis: [1, 2],
  minijprodcons: Array.from({ length: 39 }, (_, i) => i + 1),
  tdm: [1, 2],
  tdm_caract_psy: [1, 2],
  tbi: [1, 2],
  epi_mania_iso: [1, 2],
  tbi_caract_psy: [1, 2],
  tbii: [1, 2],
  minitb2_hypo: [1, 2],
  minitb2_depress: [1, 2],
  tbns: [1, 2],
};

export function expandMultiChoiceToColumns(responses: Record<string, any>): Record<string, any> {
  const expanded = { ...responses };
  for (const [fieldId, suffixes] of Object.entries(MINI_MULTI_CHOICE_FIELDS)) {
    const value = expanded[fieldId];
    if (Array.isArray(value)) {
      for (const suffix of suffixes) {
        expanded[`${fieldId}_${suffix}`] = value.includes(suffix) ? 1 : 0;
      }
      delete expanded[fieldId];
    }
  }
  return expanded;
}

export function collapseColumnsToMultiChoice(data: Record<string, any>): Record<string, any> {
  const collapsed = { ...data };
  for (const [fieldId, suffixes] of Object.entries(MINI_MULTI_CHOICE_FIELDS)) {
    const selected: number[] = [];
    for (const suffix of suffixes) {
      const colKey = `${fieldId}_${suffix}`;
      if (collapsed[colKey] === 1) {
        selected.push(suffix);
      }
    }
    if (selected.length > 0) {
      collapsed[fieldId] = selected;
    }
  }
  return collapsed;
}
