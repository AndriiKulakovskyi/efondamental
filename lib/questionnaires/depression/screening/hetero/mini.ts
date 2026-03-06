// eFondaMental Platform - MINI (Mini International Neuropsychiatric Interview)
// Depression Screening - Hetero-questionnaire (clinician-administered)
// MINI 6.0.0 / DSM-IV - French version

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
  minic3_symptomes_ok: number | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type DepressionMiniResponseInsert = Omit<
  DepressionMiniResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'interpretation' | 'minib_score' | 'minib_risque' | 'minib_risque_cot' | 'minic3_symptomes_ok'
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
// JSONLogic helpers (used by display_if)
// ============================================================================

const yes = (field: string) => ({ '==': [{ var: field }, 1] });
const no = (field: string) => ({ '==': [{ var: field }, 0] });
const and = (...conds: any[]) => ({ and: conds });
const or = (...conds: any[]) => ({ or: conds });
const not = (cond: any) => ({ '!': cond });
const sum = (fields: string[]) => ({ '+': fields.map((f) => ({ var: f })) });
const gte = (left: any, right: number) => ({ '>=': [left, right] });
const gt = (left: any, right: number) => ({ '>': [left, right] });

// ============================================================================
// Section A: Episode Depressif Majeur
// ============================================================================

const SECTION_A: Question[] = [
  { id: 'section_a', text: 'A. ÉPISODE DÉPRESSIF MAJEUR', type: 'section', required: false },

  boolQ('minia1a', "A1 a) Vous est-il déjà arrivé de vous sentir particulièrement triste ou déprimé(e), la plupart du temps au cours de la journée, et ce, presque tous les jours, pendant une période de 2 semaines ?", { required: true }),

  boolQ('minia1b', "A1 b) Au cours des deux dernières semaines, vous êtes-vous senti(e) particulièrement triste, cafardeux(se), déprimé(e), la plupart du temps au cours de la journée et ce, presque tous les jours ?", {
  }),

  boolQ('minia2a', "A2 a) Vous êtes-vous déjà senti(e), pendant une période de deux semaines, nettement moins intéressé(e) par la plupart des choses, ou nettement moins capable de prendre plaisir aux choses auxquelles vous preniez plaisir habituellement ?", { required: true }),

  boolQ('minia2b', "A2 b) Au cours des deux dernières semaines, aviez-vous presque tout le temps le sentiment de n'avoir plus goût à rien, d'avoir perdu l'intérêt ou le plaisir pour les choses qui vous plaisent habituellement ?", {
  }),

  { id: 'minia_gate_info', text: "Au cours de cette période de deux semaines pendant laquelle vous vous sentiez  déprimé(e) et/ou sans intérêt pour la plupart des choses : ", type: 'instruction', required: false, display_if: or(yes('minia1a'), yes('minia2a')) },

  // A3 items — affichage : si A1b OU A2b = OUI → épisode actuel (2 dern. sem.) + épisode passé ; si A1b ET A2b = NON → seulement épisode passé
  boolQ('minia3ads', "A3 a) Votre appétit a-t-il notablement changé ? Avez-vous pris ou perdu du poids sans en avoir l'intention (variation au cours du mois de ±5%, c.à.d. ± 8lbs., pour une personne de 65 kg/120 lbs.) — 2 dernières semaines?", {
    display_if: or(yes('minia1b'), yes('minia2b')),
    metadata: { miniEpisodePairKey: 'minia3a', miniEpisodePeriod: 'current' },
  }),
  boolQ('minia3aep', "A3 a) Episode passé", {
    display_if: or(yes('minia1a'), yes('minia2a')),
    metadata: { miniEpisodePairKey: 'minia3a', miniEpisodePeriod: 'past' },
  }),
  boolQ('minia3bds', "A3 b) Aviez-vous des problèmes de sommeil presque toutes les nuits (difficultés d’endormissements, réveils nocturnes ou précoces, dormir trop) — 2 dernières semaines?", {
    display_if: or(yes('minia1b'), yes('minia2b')),
    metadata: { miniEpisodePairKey: 'minia3b', miniEpisodePeriod: 'current' },
  }),
  boolQ('minia3bep', "A3 b) Episode passé", {
    display_if: or(yes('minia1a'), yes('minia2a')),
    metadata: { miniEpisodePairKey: 'minia3b', miniEpisodePeriod: 'past' },
  }),
  boolQ('minia3cds', "A3 c) Parliez-vous ou vous déplacez-vous plus lentement que d’habitude ou, au contraire, vous sentiez-vous agité(e) et aviez-vous du mal à rester en place, presque tous les jours— 2 dernières semaines?", {
    display_if: or(yes('minia1b'), yes('minia2b')),
    metadata: { miniEpisodePairKey: 'minia3c', miniEpisodePeriod: 'current' },
  }),
  boolQ('minia3cep', "A3 c) Episode passé", {
    display_if: or(yes('minia1a'), yes('minia2a')),
    metadata: { miniEpisodePairKey: 'minia3c', miniEpisodePeriod: 'past' },
  }),
  boolQ('minia3dsd', "A3 d) Vous sentiez-vous fatigué(e), sans énergie, et ce presque tous les jours — 2 dernières semaines?", {
    display_if: or(yes('minia1b'), yes('minia2b')),
    metadata: { miniEpisodePairKey: 'minia3d', miniEpisodePeriod: 'current' },
  }),
  boolQ('minia3dep', "A3 d) Episode passé", {
    display_if: or(yes('minia1a'), yes('minia2a')),
    metadata: { miniEpisodePairKey: 'minia3d', miniEpisodePeriod: 'past' },
  }),
  boolQ('minia3esd', "A3 e) Vous sentiez-vous sans valeur ou coupable, et ce presque tous les jours — 2 dernières semaines?", {
    display_if: or(yes('minia1b'), yes('minia2b')),
    metadata: { miniEpisodePairKey: 'minia3e', miniEpisodePeriod: 'current' },
  }),
  boolQ('minia3eep', "A3 e) Episode passé", {
    display_if: or(yes('minia1a'), yes('minia2a')),
    metadata: { miniEpisodePairKey: 'minia3e', miniEpisodePeriod: 'past' },
  }),
  boolQ('minia3fsd', "A3 f) Aviez-vous du mal à vous concentrer ou à prendre des décisions, et ce presque tous les jours — 2 dernières semaines?", {
    display_if: or(yes('minia1b'), yes('minia2b')),
    metadata: { miniEpisodePairKey: 'minia3f', miniEpisodePeriod: 'current' },
  }),
  boolQ('minia3fep', "A3 f) Episode passé", {
    display_if: or(yes('minia1a'), yes('minia2a')),
    metadata: { miniEpisodePairKey: 'minia3f', miniEpisodePeriod: 'past' },
  }),
  boolQ('minia3gsd', "A3 g) Avez-vous, à plusieurs reprises, pensé qu’il vaudrait mieux que vous soyez mort(e), pensé au suicide ou à vous faire du mal ? Avez-vous tenté ou planifié un suicide ? — 2 dernières semaines?", {
    display_if: or(yes('minia1b'), yes('minia2b')),
    metadata: { miniEpisodePairKey: 'minia3g', miniEpisodePeriod: 'current' },
  }),
  boolQ('minia3gep', "A3 g) Episode passé", {
    display_if: or(yes('minia1a'), yes('minia2a')),
    metadata: { miniEpisodePairKey: 'minia3g', miniEpisodePeriod: 'past' },
  }),
  boolQ('minia3eeac', "Les exemples concordent avec une idée délirante (Episode actuel)", {
    display_if: or(yes('minia3esd'), yes('minia3eep')),
    help: "DEMANDEZ DES EXEMPLES."
  }),
  boolQ('minia3eepbis', "Les exemples concordent avec une idée délirante (Episode passé)", {
    display_if: yes('minia3eep')
  }),
  boolQ('minia4sd', "A4) Les problèmes ont-ils entraîné des difficultés significatives — 2 dernières semaines?", {
    required: true,
    display_if: or(yes('minia1b'), yes('minia2b')),
    metadata: { miniEpisodePairKey: 'minia4', miniEpisodePeriod: 'current' },
  }),
  boolQ('minia4ep', "A4) (Episode passé)", {
    required: true,
    display_if: or(yes('minia1a'), yes('minia2a')),
    metadata: { miniEpisodePairKey: 'minia4', miniEpisodePeriod: 'past' },
  }),
  boolQ('minia5ep', "A5) Entre 2 épisodes, vous êtes-vous senti(e) bien pendant au moins deux mois ?", {
    display_if: or(yes('minia1a'), yes('minia2a'))
  }),
  boolQ('minia5bis', "Évaluation diagnostique A : Y a-t-il au moins 5 OUI entre A1b/A2b et A3, et A4 est-elle cotée OUI pour la période concernée ?", {
    required: true,
    readonly: true,
    display_if: or(yes('minia1a'), yes('minia2a')),
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
    text: "A6) a Combien d'épisodes de dépression avez-vous eus dans votre vie (Les épisodes doivent être entrecoupés de périodes d’au moins 2 mois sans dépression significative) ?",
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
  { id: 'minib_gate_info', text: "Au cours du mois écoulé : ", type: 'instruction', required: false},

  boolQ('minib1', "B1 Avez-vous eu un accident ?", { required: true }),
  boolQ('minib1a', "B1 a) Avez-vous prévu ou eu l'intention de vous faire du mal dans cet accident ?", {
    indentLevel: 1,
    display_if: yes('minib1')
  }),
  boolQ('minib1b', "B1 b) Avez-vous eu l'intention de mourir dans cet accident ?", {
    indentLevel: 1,
    display_if: yes('minib1a')
  }),

  boolQ('minib2', "B2 Vous est-il arrivé de vous sentir désespéré ?", { required: true }),
  boolQ('minib3', "B3 Avez-vous pensé qu'il vaudrait mieux que vous soyez mort(e), ou souhaité être mort(e) ?", { required: true }),
  boolQ('minib4', "B4 Avez-vous eu envie de vous faire du mal ou de vous blesser ?", { required: true }),
  boolQ('minib5', "B5 Avez-vous pensé à vous suicider ?", { required: true }),

  {
    id: 'minib5bis1',
    text: 'Fréquence',
    type: 'single_choice',
    indentLevel: 1,
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
    indentLevel: 1,
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
    display_if: yes('minib5')
  }),
  boolQ('minib7', "B7 Avez-vous planifié un suicide ?", { required: true }),
  boolQ('minib8', "B8 Avez-vous commencé à agir pour vous préparer à une tentative de suicide ?", { required: true }),
  boolQ('minib9', "B9 Vous êtes-vous délibérément blessé(e) sans avoir l'intention de mourir ?", { required: true }),
  boolQ('minib10', "B10 Avez-vous tenté de vous suicider ?", { required: true }),

  {
    id: 'minib10bis',
    text: 'Précision B10',
    type: 'multiple_choice',
    indentLevel: 1,
    required: false,
    options: [
      { code: 1, label: 'Espériez-vous être secouru(e)/survivre ?', score: 1 },
      { code: 2, label: 'Avez-vous cru/eu l\'intention de mourir ?', score: 2 }
    ],
    display_if: { '==': [{ var: 'minib10' }, 1] }
  },

  boolQ('minib11', "B11 Avez-vous déjà fait une tentative de suicide ?", {
    required: true,
  }),

  {
    id: 'minib_risque_instruction',
    text: "Y a-t-il au moins une des réponses (hormis B1) cotée oui ? Si oui, additionnez le total de points pour les réponses (B1-B11) cochées « oui » et précisez le score de risque suicidaire comme indiqué dans la case diagnostique :",
    type: 'instruction',
    required: false,
  },
  boolQ('minib_risque', "Risque suicidaire actuel (au moins une réponse OUI parmi B2-B11 ?)",
    { readonly: true, metadata: { displayOnly: true } }
  ),
  {
    id: 'minib_score',
    text: 'Score risque suicidaire actuel (auto calculé)',
    type: 'number',
    required: false,
    min: 0,
    max: 53,
    readonly: true,
    metadata: { displayOnly: true },
  },
  {
    id: 'minib_risque_cot',
    text: 'Risque suicidaire actuel (auto calculé)',
    type: 'single_choice',
    required: false,
    readonly: true,
    metadata: { displayOnly: true },
    options: [
      { code: 1, label: 'Faible (1-8 points)', score: 1 },
      { code: 2, label: 'Modéré (9-16 points)', score: 2 },
      { code: 3, label: 'Élevé (≥ 17 points)', score: 3 },
    ],
    display_if: { '==': [{ var: 'minib_risque' }, 1] },
  },
  {
    id: 'minib_com',
    text: 'Commentaire supplémentaire sur le risque suicidaire : ',
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
    help: "Cette question n'est pas un critère mais accroît la vigilance du clinicien."
  }),
  { id: 'minic0prec', text: 'Veuillez préciser qui : ', type: 'text', required: false, display_if: { '==': [{ var: 'minic0' }, 1] } },

  boolQ('minic1a', "C1 a Avez-vous déjà eu une période où vous vous sentiez tellement exalté(e) ou plein(e) d’énergie que cela vous a posé des problèmes ou que certaines personnes, notamment dans votre entourage,  ont pensé que vous n’étiez pas dans votre état habituel ? (Ne prenez pas en compte les périodes pendant lesquelles vous étiez sous l’effet de drogues ou d’alcool.)", { required: true }),
  boolQ('minic1b', "C1 b Vous sentez-vous, en ce moment, exalté(e) ou plein(e) d'énergie ?", {
    required: true }),

  boolQ('minic2a', "C2 a Avez-vous déjà eu une période de plusieurs jours où vous étiez tellement irritable que vous en arriviez à insulter les gens, à hurler, voire à vous battre avec des personnes extérieures à votre famille? Aviez-vous vous-même remarqué ou les autres, avaient-ils remarqué que vous étiez  plus irritable ou que vous réagissiez plus vivement que les autres, même dans des situations  où vous trouviez cela justifié ?", { required: true }),
  boolQ('minic2b', "C2 b Vous sentez-vous excessivement irritable en ce moment ?", {
    required: true }),

  { id: 'minic_gate_info', text: "Lorsque vous vous sentiez exalté(e), plein(e) d’énergie/irritable :", type: 'instruction', required: false, display_if: or(yes('minic1a'), yes('minic2a')) },

  // C3 — si C1b ou C2b = OUI → épisode actuel + passé ; si C1b et C2b = NON → seulement épisode passé
  ...[
    ['minic3aea', 'minic3aep', "C3 a) Aviez-vous le sentiment que vous auriez pu faire des choses dont les autres seraient incapables ou que vous étiez quelqu’un de particulièrement important "],
    ['minic3bea', 'minic3bep', "C3 b) Aviez-vous moins besoin de sommeil que d’habitude (vous sentiez-vous reposé(e) après seulement quelques heures de sommeil) "],
    ['minic3cea', 'minic3cep', "C3 c) Parliez-vous sans arrêt ou si vite que les gens avaient du mal à vous comprendre "],
    ['minic3dea', 'minic3dep', "C3 d) Vos pensées défilaient-elles si vite que vous ne pouviez pas bien les suivre "],
    ['minic3eea', 'minic3eep', "C3 e) Etiez-vous facilement distrait(e) que la moindre interruption vous faisait perdre le fil de ce que vous faisiez ou pensiez "],
    ['minic3fea', 'minic3fep', "C3 f) Etiez-vous nettement plus actif(e) et entreprenant(e), au travail, à l’école, socialement, sexuellement ou vous sentiez-vous incapable de tenir en place ou particulièrement nerveux(se) en permanence "],
    ['minic3gea', 'minic3gep', "C3 g) Aviez-vous tellement envie de faire des choses qui vous paraissaient agréables ou tentantes que vous aviez tendance à en oublier les risques ou les difficultés qu’elles auraient pu entraîner (faire des achats inconsidérés, conduire  imprudemment, avoir une activité sexuelle excessive et irréfléchie) "],
  ].flatMap(([ea, ep, text], idx) => {
    const pairKey = typeof ea === 'string' ? ea.replace(/ea$/, '') : '';
    const actuel = boolQ(ea, `${text} - Episode actuel ?`, {
      display_if: or(yes('minic1b'), yes('minic2b')),
      metadata: { miniEpisodePairKey: pairKey, miniEpisodePeriod: 'current' },
    });
    const passe = boolQ(ep, `${text} - Episode passé ?`, {
      display_if: or(yes('minic1a'), yes('minic2a')),
      metadata: { miniEpisodePairKey: pairKey, miniEpisodePeriod: 'past' },
    });
    if (idx === 0) {
      return [
        actuel,
        passe,
        boolQ('minic3aeac', "Demandez des examples. Les exemples concordent avec une idée délirante - Episode actuel ?", {
          indentLevel: 1,
          display_if: yes('minic3aea'),
          metadata: { miniEpisodePairKey: 'minic3adelirant', miniEpisodePeriod: 'current' },
          help: "DEMANDEZ DES EXEMPLES.",
        }),
        boolQ('minic3aepbis', "Demandez des examples. Les exemples concordent avec une idée délirante - Episode passé ?", {
          indentLevel: 1,
          display_if: yes('minic3aep'),
          metadata: { miniEpisodePairKey: 'minic3adelirant', miniEpisodePeriod: 'past' },
        }),
      ];
    }
    return [actuel, passe];
  }).flat(),

  {
    id: 'minic3_recap_info',
    text: 'RECAPITULATIF C3 :',
    type: 'instruction',
    required: false,
    display_if: or(yes('minic1a'), yes('minic2a')),
  },

  boolQ('minic3_symptomes_ok', "Est-ce qu'au moins 3 réponses sont cotées « oui » en C3 (ou au moins 4 si C1a est cotée « non » (pour épisode passé) et C1b est cotée Non (pour réponse actuel)) ? Règle : élation/exaltation nécessite seulement trois symptômes C3 tandis que humeur irritable nécessite 4 symptômes C3.", {
    readonly: true,
    display_if: or(yes('minic1a'), yes('minic2a')),
  }),

  ...[
    ['minic4ea', 'minic4ep', "C4 Qu’elle a été la durée maximale pendant laquelle ces symptômes ont persisté "],
  ].flatMap(([ea, ep, text]) => {
    const pairKey = typeof ea === 'string' ? ea.replace(/ea$/, '') : '';
    return [
    {
      id: ea,
      text: `${text} - Episode actuel ?`,
      type: 'single_choice' as const,
      required: false,
      options: [{ code: 1, label: 'a) 3 jours au moins', score: 1 }, { code: 2, label: 'b) 4 à 6 jours', score: 2 }, { code: 3, label: 'c) 7 jours ou plus', score: 3 }],
      metadata: { miniEpisodePairKey: pairKey, miniEpisodePeriod: 'current' },
      display_if: or(
        and(or(yes('minic1a'), yes('minic1b')), gte(sum(['minic3aea', 'minic3bea', 'minic3cea', 'minic3dea', 'minic3eea', 'minic3fea', 'minic3gea']), 3), or(yes('minic1b'), yes('minic2b'))),
        and(and(no('minic1a'), no('minic1b')), gte(sum(['minic3aea', 'minic3bea', 'minic3cea', 'minic3dea', 'minic3eea', 'minic3fea', 'minic3gea']), 4), or(yes('minic1b'), yes('minic2b')))
      ),
    },
    {
      id: ep,
      text: `${text} - Episode passé ?`,
      type: 'single_choice' as const,
      required: false,
      options: [{ code: 1, label: 'a) 3 jours au moins', score: 1 }, { code: 2, label: 'b) 4 à 6 jours', score: 2 }, { code: 3, label: 'c) 7 jours ou plus', score: 3 }],
      metadata: { miniEpisodePairKey: pairKey, miniEpisodePeriod: 'past' },
      display_if: or(
        and(yes('minic1a'), gte(sum(['minic3aep', 'minic3bep', 'minic3cep', 'minic3dep', 'minic3eep', 'minic3fep', 'minic3gep']), 3), or(yes('minic1a'), yes('minic2a'))),
        and(no('minic1a'), gte(sum(['minic3aep', 'minic3bep', 'minic3cep', 'minic3dep', 'minic3eep', 'minic3fep', 'minic3gep']), 4), or(yes('minic1a'), yes('minic2a')))
      ),
    },
  ];
  }),

  boolQ('minic5ea', "C5 Avez-vous été hospitalisé(e) à cause de ces problèmes - Episode actuel ?", {
    display_if: or(
      and(or(yes('minic1a'), yes('minic1b')), gte(sum(['minic3aea', 'minic3bea', 'minic3cea', 'minic3dea', 'minic3eea', 'minic3fea', 'minic3gea']), 3), or(yes('minic1b'), yes('minic2b'))),
      and(and(no('minic1a'), no('minic1b')), gte(sum(['minic3aea', 'minic3bea', 'minic3cea', 'minic3dea', 'minic3eea', 'minic3fea', 'minic3gea']), 4), or(yes('minic1b'), yes('minic2b')))
    ),
    metadata: { miniEpisodePairKey: 'minic5', miniEpisodePeriod: 'current' },
  }),
  boolQ('minic5ep', "C5 - Episode passé", {
    display_if: or(
      and(yes('minic1a'), gte(sum(['minic3aep', 'minic3bep', 'minic3cep', 'minic3dep', 'minic3eep', 'minic3fep', 'minic3gep']), 3), or(yes('minic1a'), yes('minic2a'))),
      and(no('minic1a'), gte(sum(['minic3aep', 'minic3bep', 'minic3cep', 'minic3dep', 'minic3eep', 'minic3fep', 'minic3gep']), 4), or(yes('minic1a'), yes('minic2a')))
    ),
    metadata: { miniEpisodePairKey: 'minic5', miniEpisodePeriod: 'past' },
  }),
  boolQ('minic6ea', "C6 Les problèmes dont nous venons de parler ont-ils entraîné des difficultés significatives à la maison, au travail/à l’école, dans vos relations avec les autres ou dans d’autres domaines importants pour vous - Episode actuel ?", {
    display_if: and(
      no('minic5ea'),
      or(
        and(or(yes('minic1a'), yes('minic1b')), gte(sum(['minic3aea', 'minic3bea', 'minic3cea', 'minic3dea', 'minic3eea', 'minic3fea', 'minic3gea']), 3), or(yes('minic1b'), yes('minic2b'))),
        and(and(no('minic1a'), no('minic1b')), gte(sum(['minic3aea', 'minic3bea', 'minic3cea', 'minic3dea', 'minic3eea', 'minic3fea', 'minic3gea']), 4), or(yes('minic1b'), yes('minic2b')))
      )
    ),
    metadata: { miniEpisodePairKey: 'minic6', miniEpisodePeriod: 'current' },
  }),
  boolQ('minic6ep', "C6 - Episode passé", {
    display_if: and(
      no('minic5ep'),
      or(
        and(yes('minic1a'), gte(sum(['minic3aep', 'minic3bep', 'minic3cep', 'minic3dep', 'minic3eep', 'minic3fep', 'minic3gep']), 3), or(yes('minic1a'), yes('minic2a'))),
        and(no('minic1a'), gte(sum(['minic3aep', 'minic3bep', 'minic3cep', 'minic3dep', 'minic3eep', 'minic3fep', 'minic3gep']), 4), or(yes('minic1a'), yes('minic2a')))
      )
    ),
    metadata: { miniEpisodePairKey: 'minic6', miniEpisodePeriod: 'past' },
  }),

  boolQ('minicepmania', "ÉPISODE MANIAQUE"),
  { id: 'minictypepmania', text: 'ÉPISODE MANIAQUE - Type', type: 'multiple_choice', required: false, options: [{ code: 1, label: 'ACTUEL', score: 1 }, { code: 2, label: 'PASSÉ', score: 2 }] },
  boolQ('minicephmania', "ÉPISODE HYPOMANIAQUE"),
  { id: 'minictypephmania', text: 'ÉPISODE HYPOMANIAQUE - Type', type: 'multiple_choice', required: false, options: [{ code: 1, label: 'ACTUEL', score: 1 }, { code: 2, label: 'PASSÉ', score: 2 }] },
  boolQ('minicsymania', "SYMPTOMES HYPOMANIAQUES"),
  { id: 'minictypsymania', text: 'SYMPTOMES HYPOMANIAQUES - Type', type: 'multiple_choice', required: false, options: [{ code: 1, label: 'ACTUEL', score: 1 }, { code: 2, label: 'PASSÉ', score: 2 }] },

  boolQ('minic7a', "C7 a) Au moins 2 épisodes maniaques durant votre vie ?"),
  boolQ('minic7b', "C7 b) Au moins 2 épisodes hypomaniaques durant votre vie ?"),
  boolQ('minic7c', "C7 c) Au moins 2 symptômes hypomaniaques durant votre vie ?"),
];

// ============================================================================
// Section D: Trouble Panique
// ============================================================================

const SECTION_D: Question[] = [
  { id: 'section_d', text: 'D. TROUBLE PANIQUE', type: 'section', required: false },

  boolQ('minid1a', "D1 a) Avez-vous, à plus d’une occasion, eu des périodes ou des crises durant lesquelles vous vous êtes senti(e) subitement très anxieux(se), très mal à l’aise ou effrayé(e), même dans des situations où la plupart des gens ne le seraient pas ?", { required: true }),
  boolQ('minid1b', "D1 b) Ces crises atteignaient-elles leur intensité maximale en moins de 10 minutes ?", {
    required: true,
    // indentLevel: 1,
    // display_if: yes('minid1a')
  }),
  boolQ('minid2', "D2 Certaines de ces crises, même il y a longtemps, ont-elles été imprévisibles, ou sont-elles survenues sans que rien ne les provoque ?", {
    required: true,
    // indentLevel: 1,
    // display_if: and(yes('minid1a'), yes('minid1b'))
  }),
  boolQ('minid3', "D3 A la suite de l'une ou plusieurs de ces crises, avez-vous déjà eu une période d'au moins un mois durant laquelle vous redoutiez d'avoir d'autres crises où étiez préoccupé(e) par leurs conséquences éventuelles, ou avez-vous radicalement changé votre comportement du fait de ces crises (par ex. vous ne faites plus vos courses sans être accompagné(e), vous refusez de quitter votre domicile, vous vous rendez très fréquemment aux urgences ou vous allez plus souvent chez le médecin en raison de vos symptômes) ?", {
    required: true,
    // indentLevel: 1,
    // display_if: and(yes('minid1a'), yes('minid1b'), yes('minid2'))
  }),
  {
    id: 'minid_recap_info',
    text: 'Au cours de la crise où vous êtes vous senti(e) le plus mal :',
    type: 'instruction',
    required: false,
  },

  ...[
    ['minid4a', 'Aviez-vous des palpitations votre coeur battait-il très fort ou de façon irrégulière ?'],
    ['minid4b', 'Transpiriez-vous ou aviez-vous les mains moites ?'],
    ['minid4c', 'Aviez-vous des tremblements ou des secousses musculaires ?'],
    ['minid4d', "Aviez-vous du mal à respirer ou l'impression d'étouffer ?"],
    ['minid4e', "Aviez-vous l'impression de suffoquer ou d'avoir une boule dans la gorge ?"],
    ['minid4f', "Ressentiez-vous une douleur, une pression ou une gêne au niveau du thorax ?"],
    ['minid4g', "Aviez-vous la nausée, une gêne au niveau de l'estomac ou une diarrhée soudaine ?"],
    ['minid4h', "Vous sentiez-vous étourdi(e), pris(e) de vertige, ou sur le point de vous évanouir ?"],
    ['minid4i', "Aviez-vous l'impression que les choses qui vous entouraient étaient étranges ou irréelles où vous sentiez-vous détaché(e) de tout ou d'une partie de votre corps ?"],
    ['minid4j', "Aviez-vous peur de perdre le contrôle ou de devenir fou (folle) ?"],
    ['minid4k', "Aviez-vous peur de mourir ?"],
    ['minid4l', "Aviez-vous des engourdissements des picotements ?"],
    ['minid4m', "Aviez-vous des bouffées de chaleur ou des frissons ?"],
  ].map(([id, text]) => boolQ(id, `D4 ${text}`, {
  })),

  {
    id: 'minid5',
    text: 'D5 D3 et au moins 4 des questions ci-dessus (section D4) sont-elles cotées oui ? Trouble panique. Si oui à D5, passez directement à D7.',
    type: 'single_choice',
    required: false,
    readonly: true,
    options: OUI_NON,
    display_if: yes('minid2'),
    metadata: { displayOnly: true },
  },

  boolQ('minid7', "D7 Au cours du mois écoulé, avez-vous eu de telles crises à plusieurs reprises avec peur constante ?", {
    required: true,
  }),
  {
    id: 'minid_diag_lifetime',
    text: 'Diagnostic (D) : TROUBLE PANIQUE VIE ENTIÈRE (si D3 = OUI et ≥ 4 symptômes D4 = OUI).',
    type: 'instruction',
    required: false,
    display_if: and(
      yes('minid2'),
      yes('minid3'),
      gte(sum(['minid4a', 'minid4b', 'minid4c', 'minid4d', 'minid4e', 'minid4f', 'minid4g', 'minid4h', 'minid4i', 'minid4j', 'minid4k', 'minid4l', 'minid4m']), 4)
    )
  },
  {
    id: 'minid_diag_limited',
    text: 'Diagnostic (D) : SYMPTÔMES ANXIEUX PAROXYSTIQUES LIMITÉS VIE ENTIÈRE (si ≥ 1 symptôme D4 = OUI mais D5 = NON).',
    type: 'instruction',
    required: false,
    display_if: and(
      yes('minid2'),
      not(and(yes('minid3'), gte(sum(['minid4a', 'minid4b', 'minid4c', 'minid4d', 'minid4e', 'minid4f', 'minid4g', 'minid4h', 'minid4i', 'minid4j', 'minid4k', 'minid4l', 'minid4m']), 4))),
      gt(sum(['minid4a', 'minid4b', 'minid4c', 'minid4d', 'minid4e', 'minid4f', 'minid4g', 'minid4h', 'minid4i', 'minid4j', 'minid4k', 'minid4l', 'minid4m']), 0)
    )
  },
  {
    id: 'minid_diag_current',
    text: 'Diagnostic (D) : TROUBLE PANIQUE ACTUEL (si D7 = OUI).',
    type: 'instruction',
    required: false,
    display_if: and(
      yes('minid2'),
      yes('minid3'),
      gte(sum(['minid4a', 'minid4b', 'minid4c', 'minid4d', 'minid4e', 'minid4f', 'minid4g', 'minid4h', 'minid4i', 'minid4j', 'minid4k', 'minid4l', 'minid4m']), 4),
      yes('minid7')
    )
  },
];

// ============================================================================
// Section E: Agoraphobie
// ============================================================================

const SECTION_E: Question[] = [
  { id: 'section_e', text: 'E. AGORAPHOBIE', type: 'section', required: false },
  boolQ('minie1', "E1 Êtes-vous anxieux(se) dans les endroits ou situations dont il est difficile de s'échapper ?", { required: true }),
  boolQ('minie2', "E2 Redoutez-vous tellement ces situations que vous les évitez ?", {
    required: true,
    display_if: yes('minie1')
  }),
  {
    id: 'minie_diag_tp_avec_agora',
    text: 'Diagnostic (E) : TROUBLE PANIQUE avec AGORAPHOBIE ACTUEL (si D7 = OUI et E2 = OUI).',
    type: 'instruction',
    required: false,
    display_if: and(
      yes('minie2'),
      yes('minid7'),
      yes('minid2'),
      yes('minid3'),
      gte(sum(['minid4a', 'minid4b', 'minid4c', 'minid4d', 'minid4e', 'minid4f', 'minid4g', 'minid4h', 'minid4i', 'minid4j', 'minid4k', 'minid4l', 'minid4m']), 4)
    ),
  },
  {
    id: 'minie_diag_tp_sans_agora',
    text: 'Diagnostic (E) : TROUBLE PANIQUE sans AGORAPHOBIE ACTUEL (si D7 = OUI et E2 = NON).',
    type: 'instruction',
    required: false,
    display_if: and(
      no('minie2'),
      yes('minid7'),
      yes('minid2'),
      yes('minid3'),
      gte(sum(['minid4a', 'minid4b', 'minid4c', 'minid4d', 'minid4e', 'minid4f', 'minid4g', 'minid4h', 'minid4i', 'minid4j', 'minid4k', 'minid4l', 'minid4m']), 4)
    ),
  },
  {
    id: 'minie_diag_agora_sans_tp',
    text: "Diagnostic (E) : AGORAPHOBIE ACTUELLE sans antécédents de trouble panique (si E2 = OUI et D5 = NON).",
    type: 'instruction',
    required: false,
    display_if: and(
      yes('minie2'),
      not(and(
        yes('minid2'),
        yes('minid3'),
        gte(sum(['minid4a', 'minid4b', 'minid4c', 'minid4d', 'minid4e', 'minid4f', 'minid4g', 'minid4h', 'minid4i', 'minid4j', 'minid4k', 'minid4l', 'minid4m']), 4)
      ))
    ),
  },
];

// ============================================================================
// Section F: Phobie Sociale
// ============================================================================

const SECTION_F: Question[] = [
  { id: 'section_f', text: 'F. PHOBIE SOCIALE', type: 'section', required: false },
  boolQ('minif1', "F1 Avez-vous redouté d'être le centre de l'attention ou d'être humilié(e) dans des situations sociales ? (Au cours du mois écoulé)", { required: true }),
  boolQ('minif2', "F2 Cette peur est-elle excessive ou déraisonnable ?", {
    required: true,
    indentLevel: 1,
    display_if: yes('minif1')
  }),
  boolQ('minif3', "F3 Redoutez-vous tellement ces situations que vous les évitez ?", {
    required: true,
    indentLevel: 1,
    display_if: and(yes('minif1'), yes('minif2'))
  }),
  boolQ('minif4', "F4 Cette peur entraîne-t-elle une souffrance significative ?", {
    required: true,
    indentLevel: 1,
    display_if: and(yes('minif1'), yes('minif2'), yes('minif3'))
  }),
  boolQ('minifphosoc', "PHOBIE SOCIALE (Trouble anxiété sociale) ACTUELLE", {
    display_if: and(yes('minif1'), yes('minif2'), yes('minif3'))
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
    indentLevel: 1,
    display_if: yes('minig1')
  }),
  boolQ('minig3', "G3 Pensez-vous que ces idées sont le produit de votre propre pensée ?", {
    required: true,
    indentLevel: 1,
    display_if: and(yes('minig1'), yes('minig2'))
  }),
  boolQ('minig4', "G4 Besoin de faire certaines choses sans cesse (laver, compter, vérifier) ? (Au cours du mois écoulé)", { required: true }),
  boolQ('minig5', "G5 Avez-vous, à un moment donné, réalisé que ces idées envahissantes et/ou ces comportements répétitifs étaient irrationnels ou hors de proportion ?", {
    required: true,
    display_if: or(yes('minig3'), yes('minig4')),
  }),
  boolQ('minig6', "G6 Ces pensées/comportements vous ont-ils gêné(e) ou pris plus d'1h/jour ?", {
    required: true,
    display_if: yes('minig5')
  }),
  {
    id: 'minig_diag_toc',
    text: 'Diagnostic (G) : TROUBLE OBSESSIONNEL COMPULSIF ACTUEL (si G6 = OUI).',
    type: 'instruction',
    required: false,
    display_if: yes('minig6'),
  },
];

// ============================================================================
// Section H: ESPT
// ============================================================================

const SECTION_H: Question[] = [
  { id: 'section_h', text: 'H. ÉTAT DE STRESS POST-TRAUMATIQUE', type: 'section', required: false },
  boolQ('minih1', "H1 Avez-vous déjà vécu ou été témoin d'un événement extrêmement traumatique ?", { required: true }),
  boolQ('minih2', "H2 Avez-vous réagi avec peur intense, impuissance ou horreur ?", {
    required: true,
    indentLevel: 1,
    display_if: yes('minih1')
  }),
  boolQ('minih3', "H3 Pensées pénibles récurrentes, flashbacks ? (Au cours du mois écoulé)", {
    required: true,
    indentLevel: 1,
    display_if: and(yes('minih1'), yes('minih2'))
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
    indentLevel: 1,
    display_if: yes('minih3')
  })),

  {
    id: 'minih_gate_h4',
    text: 'Filtre H4 : si moins de 3 réponses OUI en H4, passez au module suivant.',
    type: 'instruction',
    required: false,
    display_if: yes('minih3'),
  },

  ...[
    ['minih5a', "H5 a) Difficultés à dormir ?"],
    ['minih5b', "H5 b) Particulièrement irritable ?"],
    ['minih5c', "H5 c) Difficultés à vous concentrer ?"],
    ['minih5d', "H5 d) Nerveux(se)/sur vos gardes ?"],
    ['minih5e', "H5 e) Un rien vous faisait sursauter ?"],
  ].map(([id, text]) => boolQ(id, text, {
    indentLevel: 1,
    display_if: and(
      yes('minih3'),
      gte(sum(['minih4a', 'minih4b', 'minih4c', 'minih4d', 'minih4e', 'minih4f', 'minih4g']), 3)
    )
  })),

  boolQ('minih6', "H6 Ces problèmes vous ont-ils causé une souffrance ou gêné dans vos activités ?", {
    indentLevel: 1,
    display_if: and(
      yes('minih3'),
      gte(sum(['minih4a', 'minih4b', 'minih4c', 'minih4d', 'minih4e', 'minih4f', 'minih4g']), 3),
      gte(sum(['minih5a', 'minih5b', 'minih5c', 'minih5d', 'minih5e']), 2)
    )
  }),
  {
    id: 'minih_diag_espt',
    text: 'Diagnostic (H) : ÉTAT DE STRESS POST-TRAUMATIQUE ACTUEL (si H6 = OUI).',
    type: 'instruction',
    required: false,
    display_if: yes('minih6')
  },
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
  ].map(([id, text]) => boolQ(id, text, { indentLevel: 1, display_if: yes('minii1') })),

  {
    id: 'minii_diag_dependance',
    text: 'Diagnostic (I) : DÉPENDANCE ALCOOLIQUE ACTUELLE (si ≥ 3 réponses OUI en I2).',
    type: 'instruction',
    required: false,
    display_if: and(
      yes('minii1'),
      gte(sum(['minii2a', 'minii2b', 'minii2c', 'minii2d', 'minii2e', 'minii2f', 'minii2g']), 3)
    ),
  },

  ...[
    ['minii3a', "I3 a) Grisé alors que vous aviez des choses à faire ? Problèmes ?"],
    ['minii3b', "I3 b) Sous l'effet de l'alcool en situation risquée ?"],
    ['minii3c', "I3 c) Problèmes légaux ?"],
    ['minii3d', "I3 d) Continué malgré problèmes familiaux ?"],
  ].map(([id, text]) => boolQ(id, text, {
    indentLevel: 1,
    display_if: and(
      yes('minii1'),
      not(gte(sum(['minii2a', 'minii2b', 'minii2c', 'minii2d', 'minii2e', 'minii2f', 'minii2g']), 3))
    )
  })),

  {
    id: 'minii_diag_abus',
    text: "Diagnostic (I) : ABUS D'ALCOOL ACTUEL (si ≥ 1 réponse OUI en I3 et dépendance non retenue).",
    type: 'instruction',
    required: false,
    display_if: and(
      yes('minii1'),
      not(gte(sum(['minii2a', 'minii2b', 'minii2c', 'minii2d', 'minii2e', 'minii2f', 'minii2g']), 3)),
      gt(sum(['minii3a', 'minii3b', 'minii3c', 'minii3d']), 0)
    )
  },
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
    indentLevel: 1,
    display_if: yes('minij1a')
  },

  boolQ('minijmedoc', "Prenez-vous des médicaments contre la toux ou d'autres substances ?", {
    indentLevel: 1,
    display_if: yes('minij1a')
  }),
  { id: 'minijsubcons', text: 'Spécifier la/les substances les plus consommées', type: 'text', required: false, indentLevel: 1, display_if: yes('minij1a') },
  { id: 'minijsubconprob', text: 'Quelle(s) substance(s) a(ont) occasionné le plus de problèmes ?', type: 'text', required: false, indentLevel: 1, display_if: yes('minij1a') },

  ...[
    ['minij2a', "J2 a) Augmenté les quantités pour même effet ?"],
    ['minij2b', "J2 b) Symptômes de sevrage ?"],
    ['minij2c', "J2 c) En preniez plus que prévu ?"],
    ['minij2d', "J2 d) Essayé sans succès de réduire ?"],
    ['minij2e', "J2 e) Beaucoup de temps à procurer/consommer/récupérer ?"],
    ['minij2f', "J2 f) Réduit vos activités ?"],
    ['minij2g', "J2 g) Continué malgré problèmes de santé ?"],
  ].map(([id, text]) => boolQ(id, text, { indentLevel: 1, display_if: yes('minij1a') })),

  { id: 'minijspecsub', text: 'Spécifier la(les) substance(s)', type: 'text', required: false, indentLevel: 1, display_if: yes('minij1a') },
  {
    id: 'minij_diag_dependance',
    text: "Diagnostic (J) : DÉPENDANCE À UNE SUBSTANCE ACTUELLE (si ≥ 3 réponses OUI en J2).",
    type: 'instruction',
    required: false,
    display_if: and(
      yes('minij1a'),
      gte(sum(['minij2a', 'minij2b', 'minij2c', 'minij2d', 'minij2e', 'minij2f', 'minij2g']), 3)
    )
  },

  ...[
    ['minij3a', "J3 a) Intoxiqué(e) avec obligations ? Problèmes ?"],
    ['minij3b', "J3 b) Sous l'effet en situation risquée ?"],
    ['minij3c', "J3 c) Avez-vous plus d'une fois eu des problèmes légaux parce que vous en aviez pris, par exemple une interpellation ou une condamnation ?"],
    ['minij3d', "J3 d) Continué malgré problèmes familiaux ?"],
  ].map(([id, text]) => boolQ(id, text, {
    indentLevel: 1,
    display_if: and(
      yes('minij1a'),
      not(gte(sum(['minij2a', 'minij2b', 'minij2c', 'minij2d', 'minij2e', 'minij2f', 'minij2g']), 3))
    )
  })),

  {
    id: 'minij_diag_abus',
    text: "Diagnostic (J) : ABUS DE SUBSTANCE(S) ACTUEL (si ≥ 1 réponse OUI en J3 et dépendance non retenue).",
    type: 'instruction',
    required: false,
    display_if: and(
      yes('minij1a'),
      not(gte(sum(['minij2a', 'minij2b', 'minij2c', 'minij2d', 'minij2e', 'minij2f', 'minij2g']), 3)),
      gt(sum(['minij3a', 'minij3b', 'minij3c', 'minij3d']), 0)
    )
  },
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
  boolQ('minik10b', "K10 b) DES SYMPTOMES NEGATIFS TYPIQUEMENT SCHIZOPHRENIQUES (AFFECT ABRASÉ, PAUVRETE DU DISCOURS/ALOGIE, MANQUE D'ENERGIE OU D'INTERET POUR DEBUTER OU MENER À BIEN DES ACTIVITES/AVOLITION) SONT-ILS AU PREMIER PLAN AU COURS DE L'ENTRETIEN? (OBSERVATION DU CLINICIEN)"),

  {
    id: 'minik11a_filter',
    text: "Filtre K11a : Y a-t-il 1 ou plusieurs questions « a » (K1a à K7a) cotées OUI/OUI BIZARRE ET le patient est-il coté OUI à un trouble thymique (EDM, maniaque ou hypomaniaque) ?",
    type: 'instruction',
    required: false,
  },
  boolQ('minik12a', "K12a Les idées ou impressions dont nous venons de parler sont-elles survenues uniquement pendant cette (ces) période(s) où vous étiez déprimé(e)/exalté(e)/irritable?", {
    indentLevel: 1,
    display_if: and(
      or(
        gt({ var: 'minik1a' }, 0),
        gt({ var: 'minik2a' }, 0),
        gt({ var: 'minik3a' }, 0),
        gt({ var: 'minik4a' }, 0),
        gt({ var: 'minik5a' }, 0),
        gt({ var: 'minik6a' }, 0),
        gt({ var: 'minik7a' }, 0),
      ),
      or(
        yes('minia5bis'), // EDM évalué OUI (clinicien)
        yes('minicepmania'),
        yes('minicephmania'),
      )
    )
  }),
  {
    id: 'minik_diag_humeur_psy',
    text: "Diagnostic (K) : TROUBLE DE L'HUMEUR AVEC CARACTÉRISTIQUES PSYCHOTIQUES (si K12a = OUI).",
    type: 'instruction',
    required: false,
    display_if: yes('minik12a'),
  },

  boolQ('minik13', "K13 Y-A-T-IL 1 OU PLUSIEURS QUESTIONS « b », DE K1b A K6b, COTÉE(S) OUI BIZARRE ? OU Y A T-IL 2 OU PLUSIEURS QUESTIONS « b », DE K1b A K10b, COTÉES OUI ? ET Y A-T-IL AU MOINS 2 SYMPTÔMES PSYCHOTIQUES QUI ONT ÉTÉ PRÉSENTS PENDANT LA MÊME PÉRIODE D'UN MOIS?", {
    help: "Évaluation clinique (logic gate)."
  }),
  {
    id: 'minik_diag_psy_actuel',
    text: "Diagnostic (K) : SYNDROME PSYCHOTIQUE ACTUEL (si K13 = OUI).",
    type: 'instruction',
    required: false,
    display_if: yes('minik13')
  },
  boolQ('minik14', "K14 K13 EST-ELLE COTÉE OUI OU Y A-T-IL 1 OU PLUSIEURS QUESTIONS « a » COTÉES OUI BIZARRE ? OU 2 OU PLUSIEURS QUESTIONS « a » COTÉES OUI ET AU MOINS 2 SYMPTOMES PENDANT 1 MOIS?", {
    help: "Évaluation clinique (logic gate)."
  }),
  {
    id: 'minik_diag_psy_vie',
    text: "Diagnostic (K) : SYNDROME PSYCHOTIQUE VIE ENTIÈRE (si K14 = OUI).",
    type: 'instruction',
    required: false,
    display_if: yes('minik14')
  },
];

// ============================================================================
// Section L: Anorexie Mentale
// ============================================================================

const SECTION_L: Question[] = [
  { id: 'section_l', text: 'L. ANOREXIE MENTALE', type: 'section', required: false },
  { id: 'minil1a', text: 'Combien mesurez-vous ?', type: 'number', required: false, min: 50, max: 250 },
  { id: 'minil1b', text: 'Au cours des 3 derniers mois, quel a été votre poids le plus faible ?', type: 'number', required: false, min: 20, max: 300 },
  boolQ('minil1c', "Le poids du patient est-il inférieur au seuil critique pour sa taille ?"),
  boolQ('minil2', "L2 Au cours des trois derniers mois : Avez-vous essayé de ne pas prendre de poids malgré le fait que vous pesiez peu ?", { display_if: yes('minil1c'), indentLevel: 1 }),
  boolQ('minil3', "L3 Aviez-vous peur de prendre du poids ou redoutiez-vous de devenir trop gro(s) bien que votre poids soit inférieur à la moyenne ?", { display_if: yes('minil1c'), indentLevel: 1 }),
  boolQ('minil4a', "L4 a) Vous trouviez-vous encore trop gro(s), ou pensiez-vous qu'une partie de votre corps était trop grosse ?", { display_if: yes('minil1c'), indentLevel: 1 }),
  boolQ('minil4b', "L4 b) L'opinion ou l'estime que vous aviez de vous-même étaient-elles largement influencées par votre poids ou vos formes corporelles ?", { display_if: yes('minil1c'), indentLevel: 1 }),
  boolQ('minil4c', "L4 c) Pensiez-vous que ce poids était normal, voire excessif ?", { display_if: yes('minil1c'), indentLevel: 1 }),
  { id: 'minil_gate_l5', text: 'Filtre L5 : Y a-t-il au moins 1 OUI en L4 ? Si NON, passez au module suivant.', type: 'instruction', required: false, display_if: yes('minil1c') },
  boolQ('minil6', "L6 (Femmes) Ces trois derniers mois, avez-vous eu un arrêt de vos règles alors que vous auriez dû les avoir (en l'absence d'une éventuelle grossesse) ?", {
    display_if: and(yes('minil1c'), gte(sum(['minil4a', 'minil4b', 'minil4c']), 1)),
    indentLevel: 1
  }),
  boolQ('minilanomenact', "ANOREXIE MENTALE ACTUELLE", {
    display_if: and(yes('minil1c'), gte(sum(['minil4a', 'minil4b', 'minil4c']), 1)),
  }),
];

// ============================================================================
// Section M: Boulimie
// ============================================================================

const SECTION_M: Question[] = [
  { id: 'section_m', text: 'M. BOULIMIE', type: 'section', required: false },
  boolQ('minim1', "M1 Au cours de ces trois derniers mois, vous est-il arrivé d'avoir des crises de boulimie durant lesquelles vous mangiez de très grandes quantités de nourriture en moins de 2 heures ?", { required: true }),
  boolQ('minim2', "M2 Avez-vous eu de telles crises de boulimie au moins deux fois par semaine au cours de ces 3 derniers mois ?", { required: true, indentLevel: 1, display_if: yes('minim1') }),
  boolQ('minim3', "M3 Durant ces crises de boulimie, aviez-vous l'impression de ne pas pouvoir vous arrêter de manger ou de ne pas pouvoir contrôler la quantité de nourriture que vous preniez ?", { required: true, indentLevel: 1, display_if: yes('minim2') }),
  boolQ('minim4', "M4 De façon à éviter une prise de poids après ces crises de boulimie, faisiez-vous certaines choses comme vous faire vomir, vous astreindre à des régimes draconiens, faire de l'exercice, prendre des laxatifs/diurétiques/coupe-faim ou autres ?", { required: true, indentLevel: 1, display_if: yes('minim3') }),
  boolQ('minim5', "M5 L'opinion ou l'estime que vous avez de vous-même sont-elles largement influencées par votre poids ou vos formes corporelles ?", { required: false, indentLevel: 1, display_if: yes('minim4') }),
  boolQ('minim6', "M6 LE PATIENT PRÉSENTE-T-IL UNE ANOREXIE MENTALE ?", { required: false, indentLevel: 1, display_if: yes('minim5') }),
  boolQ('minim7', "M7 Ces crises de boulimie surviennent-elles toujours lorsque votre poids est en dessous du seuil du patient ?", { required: false, indentLevel: 1, display_if: yes('minim6') }),
  {
    id: 'minim_diag_bulimie',
    text: 'Diagnostic (M) : BOULIMIE ACTUELLE (si M5 = OUI et (M6 = NON ou M7 = NON)).',
    type: 'instruction',
    required: false,
    display_if: and(yes('minim5'), or(no('minim6'), and(yes('minim6'), no('minim7'))))
  },
  {
    id: 'minim_diag_anorex_bulimie',
    text: 'Diagnostic (M) : ANOREXIE MENTALE, type boulimie/vomissements ou prise de purgatifs ACTUELLE (si M7 = OUI).',
    type: 'instruction',
    required: false,
    display_if: yes('minim7')
  },
];

// ============================================================================
// Section N: Anxiete Generalisee
// ============================================================================

const SECTION_N: Question[] = [
  { id: 'section_n', text: 'N. ANXIÉTÉ GÉNÉRALISÉE', type: 'section', required: false },
  boolQ('minin1a', "N1 a) Excessivement préoccupé(e)/inquiet(e)/anxieux(se) ces 6 derniers mois ?"),
  boolQ('minin1b', "N1 b) Préoccupations presque tous les jours ?", {
    indentLevel: 1,
    display_if: yes('minin1a')
  }),
  boolQ('minin1c', "N2 EST-CE QUE L'ANXIETE ET LES INQUIETUDES DU PATIENT SONT UNIQUEMENT RESTREINTES A, OU MIEUX EXPLIQUEES PAR, UN DES TROUBLES EXPLORES PRECEDEMMENT?", {
    indentLevel: 1,
    display_if: and(yes('minin1a'), yes('minin1b'))
  }),
  boolQ('minin2', "N2 bis Vous-est-il difficile de contrôler ces préoccupations?", {
    indentLevel: 1,
    display_if: and(yes('minin1a'), yes('minin1b'), no('minin1c'))
  }),
  ...[
    ['minin3a', "N3 a) Agité(e), tendu(e) ?"],
    ['minin3b', "N3 b) Muscles tendus ?"],
    ['minin3c', "N3 c) Fatigué(e), faible ?"],
    ['minin3d', "N3 d) Difficultés de concentration ?"],
    ['minin3e', "N3 e) Particulièrement irritable ?"],
    ['minin3f', "N3 f) Problèmes de sommeil ?"],
  ].map(([id, text]) => boolQ(id, text, {
    indentLevel: 1,
    display_if: and(yes('minin1a'), yes('minin1b'), no('minin1c'))
  })),
  boolQ('minin4', "N4 Cette anxiété entraîne-t-elle une souffrance importante ?", {
    indentLevel: 1,
    display_if: and(
      yes('minin1a'),
      yes('minin1b'),
      no('minin1c'),
      gte(sum(['minin3a', 'minin3b', 'minin3c', 'minin3d', 'minin3e', 'minin3f']), 3)
    )
  }),
  {
    id: 'minin_diag_tag',
    text: 'Diagnostic (N) : ANXIÉTÉ GÉNÉRALISÉE ACTUELLE (si N4 = OUI).',
    type: 'instruction',
    required: false,
    display_if: yes('minin4')
  },
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
  ].map(([id, text]) => boolQ(id, `${text} (Depuis l'âge de 15 ans)`, {
    indentLevel: 1,
    display_if: gte(sum(['minip1a', 'minip1b', 'minip1c', 'minip1d', 'minip1e', 'minip1f']), 2)
  })),

  {
    id: 'minip_diag_antisociale',
    text: 'Diagnostic (P) : TROUBLE DE LA PERSONNALITÉ ANTISOCIALE VIE ENTIÈRE (si ≥ 2 OUI en P1 et ≥ 3 OUI en P2).',
    type: 'instruction',
    required: false,
    display_if: and(
      gte(sum(['minip1a', 'minip1b', 'minip1c', 'minip1d', 'minip1e', 'minip1f']), 2),
      gte(sum(['minip2a', 'minip2b', 'minip2c', 'minip2d', 'minip2e', 'minip2f']), 3)
    )
  },
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
  title: "M.I.N.I. - Mini-Entretien Neuropsychiatrique International",
  description: "MINI International Neuropsychiatric Interview (version française 6.0.0, compatible DSM-IV). Entretien structuré couvrant les principaux troubles psychiatriques.",
  instructions: "Entretien hétéro-administré par un clinicien formé. Lire les questions au patient telles quelles et appliquer les règles de filtrage/branching.",
  questions: DEPRESSION_MINI_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['depression'],
    target_role: 'healthcare_professional',
    version: '6.0.0',
  }
};

// ============================================================================
// Score Computation: Section B Suicide Risk
// ============================================================================

export interface DepressionMiniScoreInput {
  minib1?: number;
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

// Points pour chaque item B1-B11 coché OUI (hors B1 : au moins un OUI parmi B2-B11 déclenche le calcul)
const SUICIDE_RISK_WEIGHTS: Record<string, number> = {
  minib1: 1,
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

/** Somme des points pour les réponses B1-B11 cochées OUI. */
export function computeMiniSuicideRiskScore(responses: DepressionMiniScoreInput): number {
  let score = 0;
  for (const [field, weight] of Object.entries(SUICIDE_RISK_WEIGHTS)) {
    if (responses[field] === 1) {
      score += weight;
    }
  }
  return score;
}

/** Oui si au moins une des réponses B2-B11 (hormis B1) est cotée OUI. */
export function getMiniSuicideRiskFlag(responses: DepressionMiniScoreInput): number {
  const riskItems = ['minib2', 'minib3', 'minib4', 'minib5', 'minib6', 'minib7', 'minib8', 'minib9', 'minib10', 'minib11'];
  return riskItems.some(k => responses[k] === 1) ? 1 : 0;
}

/** 0 = non évalué, 1 = Faible (1-8), 2 = Modéré (9-16), 3 = Élevé (≥17). */
export function getMiniSuicideRiskLevel(score: number): number {
  if (score <= 0) return 0;
  if (score <= 8) return 1;
  if (score <= 16) return 2;
  return 3;
}

export function interpretMiniSuicideRisk(score: number): string {
  if (score <= 0) return "Pas de risque suicidaire identifié.";
  if (score <= 8) return `Score ${score}. Risque suicidaire faible (1-8 points).`;
  if (score <= 16) return `Score ${score}. Risque suicidaire modéré (9-16 points). Surveillance recommandée.`;
  return `Score ${score}. Risque suicidaire élevé (≥ 17 points). Intervention urgente nécessaire.`;
}

const D4_IDS = ['minid4a', 'minid4b', 'minid4c', 'minid4d', 'minid4e', 'minid4f', 'minid4g', 'minid4h', 'minid4i', 'minid4j', 'minid4k', 'minid4l', 'minid4m'];

/** OUI (1) if D3 = OUI and at least 4 D4 items are OUI. NON (0) otherwise. */
export function computeMiniD5(responses: Record<string, any>): 0 | 1 {
  const oui = (v: any) => v === 1 || v === '1';
  if (!oui(responses.minid3)) return 0;
  const d4Count = D4_IDS.filter((id) => oui(responses[id])).length;
  return d4Count >= 4 ? 1 : 0;
}

const C3_ACTUEL_IDS = ['minic3aea', 'minic3bea', 'minic3cea', 'minic3dea', 'minic3eea', 'minic3fea', 'minic3gea'];
const C3_PASSE_IDS = ['minic3aep', 'minic3bep', 'minic3cep', 'minic3dep', 'minic3eep', 'minic3fep', 'minic3gep'];

/** OUI (1) if at least 3 C3 items are OUI (or 4 when C1a/C1b are NON for the relevant period). */
export function computeMinic3SymptomesOk(responses: Record<string, any>): 0 | 1 {
  const oui = (v: any) => v === 1 || v === '1';
  const countActuel = C3_ACTUEL_IDS.filter((id) => oui(responses[id])).length;
  const countPasse = C3_PASSE_IDS.filter((id) => oui(responses[id])).length;
  const c1a = responses.minic1a;
  const c1b = responses.minic1b;
  const c2a = responses.minic2a;
  const c2b = responses.minic2b;

  const actuelOk =
    (oui(c1b) || oui(c2b)) &&
    ((oui(c1a) || oui(c1b)) ? countActuel >= 3 : countActuel >= 4);
  const passeOk =
    (oui(c1a) || oui(c2a)) &&
    (oui(c1a) ? countPasse >= 3 : countPasse >= 4);

  return actuelOk || passeOk ? 1 : 0;
}

export interface DepressionMiniScoringResult {
  total_score: number;
  interpretation: string;
  minib_score: number;
  minib_risque: number;
  minib_risque_cot: number;
  minic3_symptomes_ok: number;
}

export function scoreDepressionMini(responses: DepressionMiniScoreInput): DepressionMiniScoringResult {
  const minib_score = computeMiniSuicideRiskScore(responses);
  const minib_risque = getMiniSuicideRiskFlag(responses);
  const minib_risque_cot = getMiniSuicideRiskLevel(minib_score);
  const interpretation = interpretMiniSuicideRisk(minib_score);
  const minic3_symptomes_ok = computeMinic3SymptomesOk(responses);

  return {
    total_score: minib_score,
    interpretation,
    minib_score,
    minib_risque,
    minib_risque_cot,
    minic3_symptomes_ok
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
