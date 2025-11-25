// eFondaMental Platform - Hetero Questionnaire Definitions
// Clinician-rated questionnaires for bipolar disorder evaluation

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from './questionnaires';

// ============================================================================
// MADRS (Montgomery-Åsberg Depression Rating Scale)
// ============================================================================

export const MADRS_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: '1 - Tristesse apparente',
    help: "Correspond au découragement, à la dépression et au désespoir (plus qu'un simple cafard passager) reflétés par la parole, la mimique et la posture. Coter selon la profondeur et l'incapacité à se dérider.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Pas de tristesse', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Semble découragé mais peut se dérider sans difficulté', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Paraît triste et malheureux la plupart du temps', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Semble malheureux tout le temps. Extrêmement découragé', score: 6 }
    ]
  },
  {
    id: 'q2',
    text: '2 - Tristesse exprimée',
    help: "Correspond à l'expression d'une humeur dépressive, que celle-ci soit apparente ou non. Inclut le cafard, le découragement ou le sentiment de détresse sans espoir. Coter selon l'intensité, la durée à laquelle l'humeur est dite être influencée par les événements.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Tristesse occasionnelle en rapport avec les circonstances', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Triste ou cafardeux, mais se déride sans difficulté', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: "4 - Sentiment envahissant de tristesse ou de dépression ; l'humeur est encore influencée par les circonstances extérieures", score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Tristesse, désespoir ou découragement permanents ou sans fluctuations', score: 6 }
    ]
  },
  {
    id: 'q3',
    text: '3 - Tension intérieure',
    help: "Correspond aux sentiments de malaise mal défini, d'irritabilité, d'agitation intérieure, de tension nerveuse allant jusqu'à la panique, l'effroi ou l'angoisse. Coter selon l'intensité, la fréquence, la durée, le degré de réassurance nécessaire.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Calme. Tension intérieure seulement passagère', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: "2 - Sentiments occasionnels d'irritabilité et de malaise mal défini", score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: "4 - Sentiments continuels de tension intérieure ou panique intermittente que le malade ne peut maîtriser qu'avec difficulté", score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Effroi ou angoisse sans relâche. Panique envahissante', score: 6 }
    ]
  },
  {
    id: 'q4',
    text: '4 - Réduction du sommeil',
    help: "Correspond à une réduction de la durée ou de la profondeur du sommeil par comparaison avec le sommeil du patient lorsqu'il n'est pas malade.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "0 - Dort comme d'habitude", score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: "2 - Légère difficulté à s'endormir ou sommeil légèrement réduit, léger ou agité", score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Sommeil réduit ou interrompu au moins deux heures', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Moins de deux ou trois heures de sommeil', score: 6 }
    ]
  },
  {
    id: 'q5',
    text: "5 - Réduction de l'appétit",
    help: "Correspond au sentiment d'une perte de l'appétit comparé à l'appétit habituel. Coter l'absence de désir de nourriture ou le besoin de se forcer pour manger.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Appétit normal ou augmenté', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Appétit légèrement réduit', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: "4 - Pas d'appétit. Nourriture sans goût", score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Ne mange que si on le persuade', score: 6 }
    ]
  },
  {
    id: 'q6',
    text: '6 - Difficultés de concentration',
    help: "Correspond aux difficultés à rassembler ses pensées allant jusqu'à l'incapacité à se concentrer. Coter l'intensité, la fréquence et le degré d'incapacité.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Pas de difficultés de concentration', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Difficultés occasionnelles à rassembler ses pensées', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Difficultés à se concentrer et à maintenir son attention, ce qui réduit la capacité à lire ou à soutenir une conversation', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Incapable de lire ou de converser sans grande difficulté', score: 6 }
    ]
  },
  {
    id: 'q7',
    text: '7 - Lassitude',
    help: 'Correspond à une difficulté à se mettre en train ou une lenteur à commencer et à accomplir les activités quotidiennes.',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Guère de difficultés à se mettre en route. Pas de lenteur', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Difficultés à commencer des activités', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Difficultés à commencer des activités routinières qui sont poursuivies avec effort', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Grande lassitude. Incapable de faire quoi que ce soit sans aide', score: 6 }
    ]
  },
  {
    id: 'q8',
    text: '8 - Incapacité à ressentir',
    help: "Correspond à l'expérience subjective d'une réduction d'intérêt pour le monde environnant, ou les activités qui donnent normalement du plaisir. La capacité à réagir avec une émotion appropriée aux circonstances ou aux gens est réduite.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Intérêt normal pour le monde environnant et pour les gens', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Capacité réduite à prendre du plaisir à ses intérêts habituels', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: "4 - Perte d'intérêt pour le monde environnant. Perte de sentiment pour les amis et les connaissances", score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: "6 - Sentiment d'être paralysé émotionnellement, incapacité à ressentir de la colère, du chagrin ou du plaisir et impossibilité complète ou même douloureuse de ressentir quelque chose pour les proches parents et amis", score: 6 }
    ]
  },
  {
    id: 'q9',
    text: '9 - Pensées pessimistes',
    help: "Correspond aux idées de culpabilité, d'infériorité, d'auto-accusation, de pêché, de remords ou de ruine.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Pas de pensée pessimiste', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: "2 - Idées intermittentes d'échec, d'auto-accusation ou d'autodépréciation", score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Auto-accusations persistantes ou idées de culpabilité ou péché précises mais encore rationnelles. Pessimisme croissant à propos du futur', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Idées délirantes de ruine, de remords ou péché inexpiable. Auto-accusations absurdes ou inébranlables', score: 6 }
    ]
  },
  {
    id: 'q10',
    text: '10 - Idées de suicide',
    help: "Correspond au sentiment que la vie ne vaut pas le peine d'être vécue, qu'une mort naturelle serait la bienvenue, idées de suicide et préparatifs au suicide. Les tentatives de suicide ne doivent pas, en elles-mêmes, influencer la cotation.",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Jouit de la vie ou la prend comme elle vient', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Fatigué de la vie, idées de suicide seulement passagères', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: "4 - Il vaudrait mieux être mort. Les idées de suicide sont courantes et le suicide est considéré comme une solution possible mais sans projet ou intention précis", score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: "6 - Projets explicites de suicide si l'occasion se présente. Préparatifs de suicide", score: 6 }
    ]
  }
];

export const MADRS_DEFINITION: QuestionnaireDefinition = {
  id: 'madrs',
  code: 'MADRS',
  title: 'Échelle de Dépression de Montgomery-Åsberg (MADRS)',
  description: 'Échelle clinique pour évaluer la sévérité des symptômes dépressifs. 10 items cotés 0-6.',
  questions: MADRS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// YMRS (Young Mania Rating Scale)
// ============================================================================

export const YMRS_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: "1. Elévation de l'humeur",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Absente', score: 0 },
      { code: 1, label: "Légèrement ou possiblement élevée lorsqu'on l'interroge", score: 1 },
      { code: 2, label: "Elévation subjective nette; optimiste, plein d'assurance; gai; contenu approprié", score: 2 },
      { code: 3, label: "Elevée, au contenu approprié, plaisantin", score: 3 },
      { code: 4, label: 'Euphorique; rires inappropriés; chante', score: 4 }
    ]
  },
  {
    id: 'q2',
    text: "2. Activité motrice et énergie augmentées",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Absentes', score: 0 },
      { code: 1, label: 'Subjectivement élevées', score: 1 },
      { code: 2, label: 'Animé; expression gestuelle plus élevée', score: 2 },
      { code: 3, label: 'Energie excessive; parfois hyperactif; agité (peut être calmé)', score: 3 },
      { code: 4, label: 'Excitation motrice; hyperactivité continuelle (ne peut être calmé)', score: 4 }
    ]
  },
  {
    id: 'q3',
    text: '3. Intérêt sexuel',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Normal, non augmenté', score: 0 },
      { code: 1, label: 'Augmentation légère ou possible', score: 1 },
      { code: 2, label: "Clairement augmenté lorsqu'on l'interroge", score: 2 },
      { code: 3, label: "Parle spontanément de la sexualité; élabore sur des thèmes sexuels; se décrit comme étant hyper sexuel", score: 3 },
      { code: 4, label: "Agissements sexuels manifestes (envers les patients, les membres de l'équipe, ou l'évaluateur)", score: 4 }
    ]
  },
  {
    id: 'q4',
    text: '4. Sommeil',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Ne rapporte pas de diminution de sommeil', score: 0 },
      { code: 1, label: "Dort jusqu'à une heure de moins que d'habitude", score: 1 },
      { code: 2, label: "Sommeil réduit de plus d'une heure par rapport à d'habitude", score: 2 },
      { code: 3, label: 'Rapporte un moins grand besoin de sommeil', score: 3 },
      { code: 4, label: 'Nie le besoin de sommeil', score: 4 }
    ]
  },
  {
    id: 'q5',
    text: '5. Irritabilité',
    help: 'Cet item est coté sur une échelle de 0 à 8.',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Absente', score: 0 },
      { code: 2, label: 'Subjectivement augmentée', score: 2 },
      { code: 4, label: "Irritable par moment durant l'entretien; épisodes récents d'énervement ou de colère dans le service", score: 4 },
      { code: 6, label: "Fréquemment irritable durant l'entretien; brusque; abrupt", score: 6 },
      { code: 8, label: 'Hostile, non coopératif; évaluation impossible', score: 8 }
    ]
  },
  {
    id: 'q6',
    text: '6. Discours (débit et quantité)',
    help: 'Cet item est coté sur une échelle de 0 à 8.',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Pas augmenté', score: 0 },
      { code: 2, label: 'Se sent bavard', score: 2 },
      { code: 4, label: 'Augmentation du débit et de la quantité par moment; prolixe par moment', score: 4 },
      { code: 6, label: 'Soutenu; augmentation consistante du débit ou de la quantité; difficile à interrompre', score: 6 },
      { code: 8, label: 'Sous pression; impossible à interrompre; discours continu', score: 8 }
    ]
  },
  {
    id: 'q7',
    text: '7. Langage - troubles de la pensée',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Absent', score: 0 },
      { code: 1, label: 'Circonstanciel; légère distractivité; pensées rapides', score: 1 },
      { code: 2, label: 'Distractivité; perd le fil de ses idées; change fréquemment de sujet; pensées accélérées', score: 2 },
      { code: 3, label: "Fuite des idées; réponses hors sujet; difficile à suivre; fait des rimes; écholalie", score: 3 },
      { code: 4, label: 'Incohérent; communication impossible', score: 4 }
    ]
  },
  {
    id: 'q8',
    text: '8. Contenu',
    help: 'Cet item est coté sur une échelle de 0 à 8.',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Normal', score: 0 },
      { code: 2, label: 'Projets discutables; intérêts nouveaux', score: 2 },
      { code: 4, label: 'Projet(s) particulier(s); hyper religieux', score: 4 },
      { code: 6, label: 'Idées de grandeur ou de persécution; idées de référence', score: 6 },
      { code: 8, label: 'Délires; hallucinations', score: 8 }
    ]
  },
  {
    id: 'q9',
    text: '9. Comportement agressif et perturbateur',
    help: 'Cet item est coté sur une échelle de 0 à 8.',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Absent, coopératif', score: 0 },
      { code: 2, label: 'Sarcastique; parle fort par moment, sur la défensive', score: 2 },
      { code: 4, label: 'Exigeant; fait des menaces dans le service', score: 4 },
      { code: 6, label: "Menace l'évaluateur; crie; évaluation difficile", score: 6 },
      { code: 8, label: 'Agressif physiquement; destructeur; évaluation impossible', score: 8 }
    ]
  },
  {
    id: 'q10',
    text: '10. Apparence',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Soignée et habillement adéquat', score: 0 },
      { code: 1, label: 'Légèrement négligé', score: 1 },
      { code: 2, label: 'Peu soigné; modérément débraillé; trop habillé', score: 2 },
      { code: 3, label: 'Débraillé; à moitié nu; maquillage criard', score: 3 },
      { code: 4, label: 'Complètement négligé; orné; accoutrement bizarre', score: 4 }
    ]
  },
  {
    id: 'q11',
    text: '11. Introspection',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Présente; admet être malade; reconnaît le besoin de traitement', score: 0 },
      { code: 1, label: 'Eventuellement malade', score: 1 },
      { code: 2, label: 'Admet des changements de comportement, mais nie la maladie', score: 2 },
      { code: 3, label: 'Admet de possibles changements de comportement, mais nie la maladie', score: 3 },
      { code: 4, label: 'Nie tout changement de comportement', score: 4 }
    ]
  }
];

export const YMRS_DEFINITION: QuestionnaireDefinition = {
  id: 'ymrs',
  code: 'YMRS',
  title: 'Young Mania Rating Scale (YMRS)',
  description: 'Echelle d\'évaluation de la manie hétéro-administrée comportant 11 items. Version française (Favre, Aubry, McQuillan, Bertschy, 2003).',
  questions: YMRS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional',
    version: 'French Version (Favre, Aubry, McQuillan, Bertschy, 2003)',
    language: 'fr-FR'
  }
};

// ============================================================================
// CGI (Clinical Global Impressions)
// ============================================================================

export const CGI_QUESTIONS: Question[] = [
  {
    id: 'visit_type',
    text: 'Type de visite',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'baseline', label: 'Visite initiale (baseline)' },
      { code: 'followup', label: 'Visite de suivi' }
    ]
  },
  {
    id: 'cgi_s',
    text: 'CGI-S : Gravité de la maladie',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Non évalué', score: 0 },
      { code: 1, label: '1 - Pas malade', score: 1 },
      { code: 2, label: '2 - État limite', score: 2 },
      { code: 3, label: '3 - Légèrement malade', score: 3 },
      { code: 4, label: '4 - Modérément malade', score: 4 },
      { code: 5, label: '5 - Manifestement malade', score: 5 },
      { code: 6, label: '6 - Gravement malade', score: 6 },
      { code: 7, label: '7 - Parmi les patients les plus malades', score: 7 }
    ]
  },
  {
    id: 'cgi_i',
    text: 'CGI-I : Amélioration globale',
    type: 'single_choice',
    required: false,
    display_if: { "==": [{ "var": "answers.visit_type" }, "followup"] },
    required_if: { "==": [{ "var": "answers.visit_type" }, "followup"] },
    options: [
      { code: 0, label: '0 - Non évalué', score: 0 },
      { code: 1, label: '1 - Très fortement amélioré', score: 1 },
      { code: 2, label: '2 - Fortement amélioré', score: 2 },
      { code: 3, label: '3 - Légèrement amélioré', score: 3 },
      { code: 4, label: '4 - Pas de changement', score: 4 },
      { code: 5, label: '5 - Légèrement aggravé', score: 5 },
      { code: 6, label: '6 - Fortement aggravé', score: 6 },
      { code: 7, label: '7 - Très fortement aggravé', score: 7 }
    ]
  },
  {
    id: 'therapeutic_effect',
    text: 'Index thérapeutique - Effet thérapeutique',
    type: 'single_choice',
    required: false,
    display_if: { "==": [{ "var": "answers.visit_type" }, "followup"] },
    required_if: { "==": [{ "var": "answers.visit_type" }, "followup"] },
    options: [
      { code: 0, label: '0 - Non évalué', score: 0 },
      { code: 1, label: '1 - Important', score: 1 },
      { code: 2, label: '2 - Modéré', score: 2 },
      { code: 3, label: '3 - Minime', score: 3 },
      { code: 4, label: '4 - Nul ou aggravation', score: 4 }
    ]
  },
  {
    id: 'side_effects',
    text: 'Index thérapeutique - Effets secondaires',
    type: 'single_choice',
    required: false,
    display_if: { "==": [{ "var": "answers.visit_type" }, "followup"] },
    required_if: { "==": [{ "var": "answers.visit_type" }, "followup"] },
    options: [
      { code: 0, label: '0 - Non évalué', score: 0 },
      { code: 1, label: '1 - Aucun', score: 1 },
      { code: 2, label: "2 - N'interfèrent pas significativement avec le fonctionnement du patient", score: 2 },
      { code: 3, label: '3 - Interfèrent significativement avec le fonctionnement du patient', score: 3 },
      { code: 4, label: "4 - Dépassent l'effet thérapeutique", score: 4 }
    ]
  }
];

export const CGI_DEFINITION: QuestionnaireDefinition = {
  id: 'cgi',
  code: 'CGI',
  title: 'Impressions Cliniques Globales (CGI)',
  description: 'Échelle brève pour évaluer la gravité, l\'amélioration et l\'efficacité thérapeutique.',
  questions: CGI_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// EGF (Échelle de Fonctionnement Global)
// ============================================================================

export const EGF_QUESTIONS: Question[] = [
  {
    id: 'egf_score',
    text: 'Score à l\'échelle EGF',
    help: `Consignes : Evaluer le fonctionnement psychologique, social et professionnel. Ne pas tenir compte d'un handicap dû à des facteurs physiques ou environnementaux. Utiliser des codes intermédiaires lorsque cela est justifié (p. ex. 45, 68, 72).

GUIDE DE COTATION :
100-91 : Niveau supérieur de fonctionnement dans une grande variété d'activité. N'êtes jamais débordé par les problèmes rencontrés. Êtes recherché par autrui en raison de ses nombreuses qualités. Absence de symptômes.
90-81 : Symptômes absents ou minimes (p. ex. anxiété légère avant un examen), fonctionnement satisfaisant dans tous les domaines, intéressé et impliqué dans une grande variété d'activités, socialement efficace, en général satisfait de la vie, pas plus de problèmes ou de préoccupations que les soucis de tous les jours (p.ex conflit occassionnel avec des membres de la famille).
80-71 : Si des symptômes sont présents, ils sont transitoires et il s'agit de réactions prévisibles à des facteurs de stress (p. ex. des difficultés de concentration après une dispute familiale) ; pas plus qu'un handicap léger du fonctionnement social, professionnel ou scolaire (p. ex. fléchissement temporaire du travail scolaire).
70-61 : Quelques symptômes légers (p. ex. humeur dépressive et insomnie légère) ou une certaine difficulté dans le fonctionnement social, professionnel ou scolaire (p. ex. école buissonnière épisodique ou vol en famille) mais fonctionne assez bien de façon générale et entretient plusieurs relations interpersonnelles positives.
60-51 : Symptômes d'intensité moyenne (p. ex. émoussement affectif, prolixité circonlocutoire, attaques de panique épisodiques) ou difficultés d'intensité moyenne dans le fonctionnement social, professionnel ou scolaire (p. ex. peu d'amis, conflits avec les collègues de travail).
50-41 : Symptômes importants (p. ex. idéation suicidaire, rituels obsessionnels sévères, vols répétés dans les grands magasins) ou handicap important dans le fonctionnement social, professionnel ou scolaire (p. ex. absence d'amis, incapacité à garder un emploi).
40-31 : Existence d'une certaine altération du sens de la réalité ou de la communication (p. ex. discours par moments illogique, obscur ou inadapté) ou handicap majeur dans plusieurs domaines, p. ex. le travail, l'école, les relations familiales, le jugement, la pensée ou l'humeur (p. ex. un homme déprimé évite ses amis, néglige sa famille et est incapable de travailler ; un enfant bat fréquemment des enfants plus jeunes que lui, se montre provoquant à la maison et échoue à l'école).
30-21 : Le comportement est notablement influencé par des idées délirantes ou des hallucinations ou trouble grave de la communication ou de jugement (par ex. parfois incohérent, actes grossièrement inadaptés, préoccupation suicidaire) ou incapable de fonctionner dans tous les domaines (par ex. reste au lit toute la journée, absence de travail, de foyer ou d'amis).
21-11 : Existence d'un certain danger d'auto ou d'hétéro-agression (p. ex. tentative de suicide sans attente précise de la mort, violence fréquente, excitation maniaque).
Ou incapacité temporaire à maintenir une hygiène corporelle minimum (p. ex. se barbouille d'excréments).
Ou altération massive de la communication (p. ex. incohérence indiscutable ou mutisme).
10-1 : Danger persistant d'hétéro-agression grave (p. ex. accès répétés de violence)
Ou incapacité durable à maintenir une hygiène corporelle minimum ou geste suicidaire avec attente précise de la mort.`,
    type: 'number',
    required: true,
    min: 1,
    max: 100
  }
];

export const EGF_DEFINITION: QuestionnaireDefinition = {
  id: 'egf',
  code: 'EGF',
  title: 'Échelle Globale de Fonctionnement (EGF)',
  description: 'Évaluation du fonctionnement psychologique, social et professionnel sur un continuum hypothétique allant de la santé mentale à la maladie.',
  questions: EGF_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional',
    version: 'Standard',
    language: 'fr-FR'
  }
};

// ============================================================================
// ALDA (Lithium Response Scale)
// ============================================================================

export const ALDA_QUESTIONS: Question[] = [
  // Dépistage Section
  {
    id: 'section_screening',
    text: 'Dépistage',
    type: 'section',
    required: false
  },
  {
    id: 'q0',
    text: 'Le patient est-il actuellement traité par lithium ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },

  // Critère A Section
  {
    id: 'section_a',
    text: 'Critère A',
    type: 'section',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q0' }, 1] }
  },
  {
    id: 'qa',
    text: 'Veuillez coter le degré d\'amélioration clinique globale observée sous traitement.',
    help: 'Si le Score A est inférieur à 7, le Score Total sera automatiquement de 0.',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ 'var': 'answers.q0' }, 1] },
    options: [
      { code: 0, label: '0 - Aucun changement, ni péjoration', score: 0 },
      { code: 1, label: '1 - Amélioration minime. Réduction de l\'activité de maladie de 0-10%', score: 1 },
      { code: 2, label: '2 - Amélioration légère. Réduction de l\'activité de maladie de 10-20%', score: 2 },
      { code: 3, label: '3 - Amélioration légère. Réduction de l\'activité de maladie de 20-35%', score: 3 },
      { code: 4, label: '4 - Amélioration modérée. Réduction de l\'activité de maladie de 35-50%', score: 4 },
      { code: 5, label: '5 - Bonne modérée. Réduction de l\'activité de maladie de 50-56%', score: 5 },
      { code: 6, label: '6 - Bonne réponse. Réduction de l\'activité de maladie de 65-80%', score: 6 },
      { code: 7, label: '7 - Bonne réponse. Réduction de l\'activité de maladie de 80-90%', score: 7 },
      { code: 8, label: '8 - Très bonne réponse. l\'activité de la maladie réduite de plus de 90%', score: 8 },
      { code: 9, label: '9 - Très bonnes réponse, aucune récurrence mais le patient peut encore avoir des symptômes résiduels minimes (anxiété passagère, perturbation du sommeil, dysphorie, irritabilité) n\'exigeant aucune intervention', score: 9 },
      { code: 10, label: '10 - Réponse complète, aucune récurrence mais le patient peut encore avoir des symptômes résiduels et récupération fonctionnelle totale', score: 10 }
    ]
  },

  // Critère B Section
  {
    id: 'section_b',
    text: 'Critère B',
    type: 'section',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q0' }, 1] }
  },
  {
    id: 'qb_intro',
    text: 'Critère B : Facteurs de confusion. Veuillez répondre aux questions suivantes pour établir le score B.',
    type: 'text',
    required: false,
    readonly: true,
    display_if: { '==': [{ 'var': 'answers.q0' }, 1] }
  },
  {
    id: 'qb1',
    text: 'B1: nombre d\'épisodes avant le traitement',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ 'var': 'answers.q0' }, 1] },
    options: [
      { code: 0, label: '4 épisodes ou plus', score: 0 },
      { code: 1, label: '2 ou 3 épisodes', score: 1 },
      { code: 2, label: '1 épisode', score: 2 }
    ]
  },
  {
    id: 'qb2',
    text: 'B2: Fréquence des épisodes avant le traitement.',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ 'var': 'answers.q0' }, 1] },
    options: [
      { code: 0, label: 'Moyenne à élevée, incluant les cycles rapides', score: 0 },
      { code: 1, label: 'Faible, rémissions spontanées de 3 ans ou plus en moyenne', score: 1 },
      { code: 2, label: '1 seul épisode, risque de récurrence ne peut être établi', score: 2 }
    ]
  },
  {
    id: 'qb3',
    text: 'B3: Durée du traitement;',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ 'var': 'answers.q0' }, 1] },
    options: [
      { code: 0, label: '2 ans ou plus', score: 0 },
      { code: 1, label: '1-2 ans', score: 1 },
      { code: 2, label: 'moins d\'un an', score: 2 }
    ]
  },
  {
    id: 'qb4',
    text: 'B4: Compliance durant la/les période(s) de stabilité',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ 'var': 'answers.q0' }, 1] },
    options: [
      { code: 0, label: 'Excellente, documentée par des taux dans les limites thérapeutiques', score: 0 },
      { code: 1, label: 'Bonne, plus de 80% des taux dans les limites thérapeutiques', score: 1 },
      { code: 2, label: 'Pauvre, répétitivement hors traitements, moins de 80% des taux dans les limites thérapeutiques', score: 2 }
    ]
  },
  {
    id: 'qb5',
    text: 'B5 Usage de médication additionnelle durant la phase de stabilité',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ 'var': 'answers.q0' }, 1] },
    options: [
      { code: 0, label: 'Aucun hormis de rares somnifères (1 par semaine ou moins); pas d\'autres stabilisateurs pour contrôler les symptômes thymiques', score: 0 },
      { code: 1, label: 'Antidépresseurs ou antipsychotiques à faible dose comme une sécurité, ou recours prolongé à des somnifères', score: 1 },
      { code: 2, label: 'Usage prolongé ou systématique d\'un antidépresseur ou antipsychotique', score: 2 }
    ]
  }
];

export const ALDA_DEFINITION: QuestionnaireDefinition = {
  id: 'alda',
  code: 'ALDA',
  title: 'Echelle d\'Alda (Alda Scale) - Modified',
  description: 'Échelle d\'évaluation rétrospective de la réponse prophylactique au lithium, incluant un dépistage et des critères spécifiques de cotation.',
  questions: ALDA_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional',
    version: 'French Version (User Provided Text)',
    language: 'fr-FR'
  }
};

// ============================================================================
// État du patient (DSM-IV Symptoms)
// ============================================================================

export const ETAT_PATIENT_QUESTIONS: Question[] = [
  // Section: Depressive Symptoms
  {
    id: 'section_dep',
    text: 'SYMPTOMES DEPRESSIFS ACTUELS',
    type: 'section',
    required: false
  },
  {
    id: 'q1',
    text: 'Humeur dépressive la majeure partie de la journée',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q1a',
    text: 'Impression subjective d\'hyper-réactivité émotionnelle',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q1' }, 1] },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q1b',
    text: 'Impression subjective d\'hypo-réactivité ou d\'anesthésie',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q1' }, 1] },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q2',
    text: 'Diminution marquée d\'intérêt ou de plaisir dans toutes ou presque les activités habituelles, presque toute la journée',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q3',
    text: 'Perte ou gain de poids significatif, ou diminution ou augmentation de l\'appétit',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q3a',
    text: 'Perte de poids',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q3' }, 1] },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q3b',
    text: 'Gain de poids',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q3' }, 1] },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q4',
    text: 'Insomnie ou hypersomnie',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q4a',
    text: 'Insomnie',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q4' }, 1] },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q4b',
    text: 'Hypersomnie',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q4' }, 1] },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q5',
    text: 'Agitation ou ralentissement psychomoteur',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q5a',
    text: 'Agitation',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q5' }, 1] },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q5b',
    text: 'Ralentissement',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q5' }, 1] },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q6',
    text: 'Fatigue ou perte d\'énergie',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q7',
    text: 'Sentiment de dévalorisation ou de culpabilité excessive ou inappropriée',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q8',
    text: 'Diminution de l\'aptitude à penser ou se concentrer ou indécision chaque jour',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q8a',
    text: 'Impression d\'accélération idéïque',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q8' }, 1] },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q8b',
    text: 'Impression de ralentissement idéïque',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q8' }, 1] },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q9',
    text: 'Pensées récurrentes de mort, idéation suicidaire récurrente sans plan spécifique, ou tentative de suicide ou plan précis pour se suicider',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  // Section: Manic Symptoms
  {
    id: 'section_man',
    text: 'SYMPTOMES MANIAQUES ACTUELS',
    type: 'section',
    required: false
  },
  {
    id: 'q10',
    text: 'Humeur élevée, expansive',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q11',
    text: 'Humeur irritable',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q12',
    text: 'Augmentation de l\'estime de soi ou idées de grandeur',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q13',
    text: 'Réduction du besoin de sommeil',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q14',
    text: 'Plus grande communicabilité que d\'habitude ou désir de parler constamment',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q15',
    text: 'Fuite des idées ou sensation subjective que les pensées défilent',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q16',
    text: 'Distractibilité : l\'attention du sujet étant trop facilement attirée par des stimuli extérieurs sans pertinence',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q17',
    text: 'Activité dirigée vers un but : augmentation de l\'activité ou agitation psychomotrice',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q18',
    text: 'Engagement excessif dans des activités agréables mais à potentiel élevé de conséquences dommageables',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  }
];

export const ETAT_PATIENT_DEFINITION: QuestionnaireDefinition = {
  id: 'etat_patient',
  code: 'ETAT_PATIENT',
  title: 'ETAT DU PATIENT (DSM-IV Symptoms)',
  description: 'Liste de contrôle des symptômes dépressifs et maniaques selon le DSM-IV, à remplir quel que soit l\'état thymique du patient.',
  questions: ETAT_PATIENT_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional',
    version: '1.0',
    language: 'fr-FR'
  }
};

// ============================================================================
// FAST (Functioning Assessment Short Test)
// ============================================================================

export const FAST_QUESTIONS: Question[] = [
  // AUTONOMIE Section
  {
    id: 'section_autonomie',
    text: 'AUTONOMIE',
    type: 'section',
    required: false
  },
  {
    id: 'q1',
    text: 'Prendre des responsabilités au sein de la maison',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q2',
    text: 'Vivre seul(e)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q3',
    text: 'Faire les courses',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q4',
    text: 'Prendre soin de soi (aspect physique, hygiène...)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },

  // ACTIVITE PROFESSIONNELLE Section
  {
    id: 'section_travail',
    text: 'ACTIVITE PROFESSIONNELLE',
    type: 'section',
    required: false
  },
  {
    id: 'q5',
    text: 'Avoir un emploi rémunéré',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q6',
    text: 'Terminer les tâches le plus rapidement possible',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q7',
    text: 'Travailler dans le champ correspondant à votre formation',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q8',
    text: 'Recevoir le salaire que vous méritez',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q9',
    text: 'Gérer correctement la somme de travail',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },

  // FONCTIONNEMENT COGNITIF Section
  {
    id: 'section_cognitif',
    text: 'FONCTIONNEMENT COGNITIF',
    type: 'section',
    required: false
  },
  {
    id: 'q10',
    text: 'Capacité à se concentrer devant un film, un livre..',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q11',
    text: 'Capacité au calcul mental',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q12',
    text: 'Capacité à résoudre des problèmes correctement',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q13',
    text: 'Capacité à se souvenir des noms récemment appris',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q14',
    text: 'Capacité à apprendre de nouvelles informations',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },

  // FINANCES Section
  {
    id: 'section_finances',
    text: 'FINANCES',
    type: 'section',
    required: false
  },
  {
    id: 'q15',
    text: 'Gérer votre propre argent',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q16',
    text: 'Dépenser façon équilibrée',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },

  // RELATIONS INTERPERSONNELLES Section
  {
    id: 'section_relations',
    text: 'RELATIONS INTERPERSONNELLES',
    type: 'section',
    required: false
  },
  {
    id: 'q17',
    text: 'Conserver des amitiés',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q18',
    text: 'Participer à des activités sociales',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q19',
    text: 'Avoir de bonnes relations avec vos proches',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q20',
    text: 'Habiter avec votre famille',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q21',
    text: 'Avoir des relations sexuelles satisfaisantes',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q22',
    text: 'Être capable de défendre vos intérêts',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },

  // LOISIRS Section
  {
    id: 'section_loisirs',
    text: 'LOISIRS',
    type: 'section',
    required: false
  },
  {
    id: 'q23',
    text: 'Faire de l\'exercice ou pratiquer un sport',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  },
  {
    id: 'q24',
    text: 'Avoir des loisirs',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune difficulté', score: 0 },
      { code: 1, label: 'Difficulté légère', score: 1 },
      { code: 2, label: 'Difficulté modérée', score: 2 },
      { code: 3, label: 'Difficulté sévère', score: 3 }
    ]
  }
];

export const FAST_DEFINITION: QuestionnaireDefinition = {
  id: 'fast',
  code: 'FAST',
  title: 'Echelle Brève d\'évaluation du Fonctionnement du Patient (FAST)',
  description: 'Questionnaire évaluant le degré de difficulté rencontré par le patient dans différents aspects de son fonctionnement (Autonomie, Travail, Cognition, Finances, Relations, Loisirs).',
  questions: FAST_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional',
    version: 'French',
    language: 'fr-FR'
  }
};

// ============================================================================
// DIVA 2.0 (Diagnostic Interview for ADHD in Adults)
// ============================================================================

// Helper function to create ADHD symptom questions (adult + childhood)
const createADHDSymptom = (id: string, text: string): Question => ({
  id,
  text,
  type: 'multiple_choice',
  required: false,
  options: [
    'Présent à l\'âge adulte',
    'Présent dans l\'enfance'
  ]
});

export const DIVA_QUESTIONS: Question[] = [
  {
    id: 'evaluated',
    text: 'Le patient a-t-il été évalué avec la DIVA pour le TDAH ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Criterion A - Inattention
  {
    id: 'section_inattention',
    text: 'Critère A - Déficit de l\'Attention',
    type: 'section',
    required: false
  },
  createADHDSymptom('a1a', 'A1. Souvent, ne parvient pas à prêter attention aux détails, ou fait des fautes d\'étourderie dans les devoirs scolaires, le travail ou d\'autres activités'),
  createADHDSymptom('a1b', 'A2. A souvent du mal à soutenir son attention au travail ou dans les jeux'),
  createADHDSymptom('a1c', 'A3. Semble souvent ne pas écouter quand on lui parle personnellement'),
  createADHDSymptom('a1d', 'A4. Souvent, ne se conforme pas aux consignes et ne parvient pas à mener à terme ses devoirs scolaires, ses tâches domestiques ou ses obligations professionnelles'),
  createADHDSymptom('a1e', 'A5. A souvent du mal à organiser ses travaux ou ses activités'),
  createADHDSymptom('a1f', 'A6. Souvent, évite, a en aversion, ou fait à contrecoeur les tâches qui nécessitent un effort mental soutenu'),
  createADHDSymptom('a1g', 'A7. Perd souvent les objets nécessaires à son travail ou à ses activités'),
  createADHDSymptom('a1h', 'A8. Souvent, se laisse facilement distraire par des stimuli externes'),
  createADHDSymptom('a1i', 'A9. A des oublis fréquents dans la vie quotidienne'),
  
  {
    id: 'total_inattention_adult',
    text: 'Nombre total de critères de Déficit Attentionnel à l\'âge adulte (/9)',
    type: 'number',
    required: false,
    min: 0,
    max: 9
  },
  {
    id: 'total_inattention_childhood',
    text: 'Nombre total de critères de Déficit Attentionnel dans l\'enfance (/9)',
    type: 'number',
    required: false,
    min: 0,
    max: 9
  },
  
  // Criterion A - Hyperactivity/Impulsivity
  {
    id: 'section_hyperactivity',
    text: 'Critère H/I - Hyperactivité/Impulsivité',
    type: 'section',
    required: false
  },
  createADHDSymptom('a2a', 'H/I 1. Remue souvent les mains ou les pieds, ou se tortille sur son siège'),
  createADHDSymptom('a2b', 'H/I 2. Se lève souvent en classe ou dans d\'autres situations où il est supposé rester assis'),
  createADHDSymptom('a2c', 'H/I 3. Souvent, court ou grimpe partout, dans des situations où cela est inapproprié (sentiment subjectif d\'impatience chez l\'adulte)'),
  createADHDSymptom('a2d', 'H/I 4. A souvent du mal à se tenir tranquille dans les jeux ou les activités de loisir'),
  createADHDSymptom('a2e', 'H/I 5. Est souvent « sur la brèche » ou agit souvent comme s\'il était « monté sur ressorts »'),
  createADHDSymptom('a2f', 'H/I 6. Parle souvent trop'),
  createADHDSymptom('a2g', 'H/I 7. Laisse souvent échapper la réponse à une question qui n\'est pas encore entièrement posée'),
  createADHDSymptom('a2h', 'H/I 8. A souvent du mal à attendre son tour'),
  createADHDSymptom('a2i', 'H/I 9. Interrompt souvent les autres ou impose sa présence'),
  
  {
    id: 'total_hyperactivity_adult',
    text: 'Nombre total de critères d\'Hyperactivité et d\'Impulsivité à l\'âge adulte (/9)',
    type: 'number',
    required: false,
    min: 0,
    max: 9
  },
  {
    id: 'total_hyperactivity_childhood',
    text: 'Nombre total de critères d\'Hyperactivité et d\'Impulsivité dans l\'enfance (/9)',
    type: 'number',
    required: false,
    min: 0,
    max: 9
  },
  
  // Scoring - Childhood
  {
    id: 'section_scoring_child',
    text: 'Cotation - Enfance',
    type: 'section',
    required: false
  },
  {
    id: 'criteria_a_inattention_child_gte6',
    text: 'Enfance: Le nombre de symptômes du critère A (inattention) est-il >= 6 ?',
    type: 'boolean',
    required: false
  },
  {
    id: 'criteria_hi_hyperactivity_child_gte6',
    text: 'Enfance: Le nombre de symptômes du critère H/I (hyperactivité/impulsivité) est-il >= 6 ?',
    type: 'boolean',
    required: false
  },
  
  // Scoring - Adult
  {
    id: 'section_scoring_adult',
    text: 'Cotation - Age Adulte',
    type: 'section',
    required: false
  },
  {
    id: 'criteria_a_inattention_adult_gte6',
    text: 'Age Adulte: Le nombre de symptômes du critère A (inattention) est-il >= 6 (ou >= 4 selon recherches) ?',
    type: 'boolean',
    required: false
  },
  {
    id: 'criteria_hi_hyperactivity_adult_gte6',
    text: 'Age Adulte: Le nombre de symptômes du critère H/I (hyperactivité/impulsivité) est-il >= 6 (ou >= 4 selon recherches) ?',
    type: 'boolean',
    required: false
  },
  
  // General Criteria
  {
    id: 'section_general_criteria',
    text: 'Cotation - Critères Généraux',
    type: 'section',
    required: false
  },
  {
    id: 'criteria_b_lifetime_persistence',
    text: 'Critère B: Y a-t-il des indications en faveur de la persistance sur la vie entière d\'un ensemble de symptômes et d\'une altération du fonctionnement ?',
    type: 'boolean',
    required: false
  },
  {
    id: 'criteria_cd_impairment_childhood',
    text: 'Critères C et D: Présence de symptômes et d\'une altération du fonctionnement dans au moins deux types différents d\'environnement dans l\'enfance ?',
    type: 'boolean',
    required: false
  },
  {
    id: 'criteria_cd_impairment_adult',
    text: 'Critères C et D: Présence de symptômes et d\'une altération du fonctionnement dans au moins deux types différents d\'environnement à l\'âge adulte ?',
    type: 'boolean',
    required: false
  },
  {
    id: 'criteria_e_better_explained',
    text: 'Critère E: Les symptômes peuvent-ils être (mieux) expliqués par la présence d\'un autre diagnostic de trouble psychiatrique ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'non', label: 'Non (Pas d\'autre diagnostic expliquant mieux)' },
      { code: 'oui', label: 'Oui (Expliqué par un autre trouble)' }
    ]
  },
  {
    id: 'criteria_e_explanation',
    text: 'Si Oui (expliqué par un autre trouble), préciser lequel :',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'criteria_e_better_explained' }, 'oui'] }
  },
  
  // Collateral Information
  {
    id: 'section_collateral',
    text: 'Informations Collatérales',
    type: 'section',
    required: false
  },
  {
    id: 'collateral_parents',
    text: 'Le diagnostic est-il conforté par: Parent(s)/frère/soeur/autre',
    type: 'single_choice',
    required: false,
    options: [
      { code: -1, label: 'N/A', score: -1 },
      { code: 0, label: '0 (Aucun/faible support)', score: 0 },
      { code: 1, label: '1 (Quelque support)', score: 1 },
      { code: 2, label: '2 (Support net)', score: 2 }
    ]
  },
  {
    id: 'collateral_partner',
    text: 'Le diagnostic est-il conforté par: Partenaire/ami proche/autre',
    type: 'single_choice',
    required: false,
    options: [
      { code: -1, label: 'N/A', score: -1 },
      { code: 0, label: '0 (Aucun/faible support)', score: 0 },
      { code: 1, label: '1 (Quelque support)', score: 1 },
      { code: 2, label: '2 (Support net)', score: 2 }
    ]
  },
  {
    id: 'collateral_school_reports',
    text: 'Le diagnostic est-il conforté par: Livrets scolaires',
    type: 'single_choice',
    required: false,
    options: [
      { code: -1, label: 'N/A', score: -1 },
      { code: 0, label: '0 (Aucun/faible support)', score: 0 },
      { code: 1, label: '1 (Quelque support)', score: 1 },
      { code: 2, label: '2 (Support net)', score: 2 }
    ]
  },
  
  // Final Diagnosis
  {
    id: 'section_diagnosis',
    text: 'Diagnostic Final',
    type: 'section',
    required: false
  },
  {
    id: 'final_diagnosis',
    text: 'Diagnostic TDAH',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'non', label: 'Non' },
      { code: 'combine', label: 'Oui, Type combiné (314.01)' },
      { code: 'inattentif', label: 'Oui, Type inattentif prédominant (314.00)' },
      { code: 'hyperactif', label: 'Oui, Type hyperactif/impulsif prédominant (314.01)' }
    ]
  }
];

export const DIVA_DEFINITION: QuestionnaireDefinition = {
  id: 'diva',
  code: 'DIVA_2_FR',
  title: 'DIVA 2.0 - Entretien Diagnostique pour le TDAH chez l\'adulte',
  description: 'Évaluation clinique structurée des critères du TDAH (DSM-IV) à l\'âge adulte et dans l\'enfance.',
  questions: DIVA_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// FAMILY HISTORY (Antécédents Familiaux / Anamnesis)
// ============================================================================

// Helper function to create family member psychiatric assessment
const createPsyAssessment = (member: string, prefix: string): Question[] => [
  {
    id: `${prefix}_psy_thymic`,
    text: `${member} - Troubles Thymiques`,
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: `${prefix}_psy_thymic_type`,
    text: `${member} - Si Troubles Thymiques, spécifier`,
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: `${prefix}_psy_thymic` }, 'oui'] },
    options: [
      { code: 'unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'nsp', label: 'Ne sais pas' }
    ]
  },
  {
    id: `${prefix}_psy_schizo`,
    text: `${member} - Troubles Schizophréniques`,
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: `${prefix}_psy_suicide`,
    text: `${member} - Suicide`,
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Aucun', score: 0 },
      { code: 1, label: 'Tentative de suicide', score: 1 },
      { code: 2, label: 'Suicide abouti', score: 2 },
      { code: 99, label: 'Ne sais pas', score: 99 }
    ]
  },
  {
    id: `${prefix}_psy_substance`,
    text: `${member} - Dépendance ou abus de substances`,
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: `${prefix}_psy_substance_types`,
    text: `${member} - Si substances, spécifier (sélection multiple)`,
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: `${prefix}_psy_substance` }, 'oui'] },
    options: ['Alcool', 'Cannabis', 'Autre']
  },
  {
    id: `${prefix}_psy_anxiety`,
    text: `${member} - Troubles anxieux`,
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  }
];

export const FAMILY_HISTORY_QUESTIONS: Question[] = [
  // ========================================================================
  // MOTHER (Mère)
  // ========================================================================
  {
    id: 'section_mother',
    text: 'Mère',
    type: 'section',
    required: false
  },
  {
    id: 'mother_deceased',
    text: 'Est-elle décédée ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'mother_death_cause',
    text: 'Cause du décès',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'mother_deceased' }, 'oui'] }
  },
  {
    id: 'mother_psy_history',
    text: 'Votre mère a-t-elle des antécédents de maladie psychiatrique ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'section_mother_psy',
    text: 'Mère - Détails Psychiatriques',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'mother_psy_history' }, 'oui'] }
  },
  ...createPsyAssessment('Mère', 'mother'),
  {
    id: 'mother_psy_dementia',
    text: 'Mère - Démence',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'mother_psy_history' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'section_mother_cardio',
    text: 'Mère - Facteurs Cardiovasculaires',
    type: 'section',
    required: false
  },
  {
    id: 'mother_cardio_history',
    text: 'Votre mère a-t-elle des facteurs de risques cardio-vasculaires ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'mother_cardio_types',
    text: 'Si risques cardio, spécifier (sélection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'mother_cardio_history' }, 'oui'] },
    options: ['Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension']
  },
  {
    id: 'mother_diabetes_type',
    text: 'Pour le diabète, spécifier le type',
    type: 'single_choice',
    required: false,
    display_if: { 'in': ['Diabète', { var: 'mother_cardio_types' }] },
    options: [
      { code: 1, label: 'Type I', score: 1 },
      { code: 2, label: 'Type II', score: 2 },
      { code: 99, label: 'Ne sais pas', score: 99 }
    ]
  },
  
  // ========================================================================
  // FATHER (Père)
  // ========================================================================
  {
    id: 'section_father',
    text: 'Père',
    type: 'section',
    required: false
  },
  {
    id: 'father_deceased',
    text: 'Est-il décédé ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'father_death_cause',
    text: 'Cause du décès',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'father_deceased' }, 'oui'] }
  },
  {
    id: 'father_psy_history',
    text: 'Votre père a-t-il des antécédents de maladie psychiatrique ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'section_father_psy',
    text: 'Père - Détails Psychiatriques',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'father_psy_history' }, 'oui'] }
  },
  ...createPsyAssessment('Père', 'father'),
  {
    id: 'father_psy_dementia',
    text: 'Père - Démence',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'father_psy_history' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'section_father_cardio',
    text: 'Père - Facteurs Cardiovasculaires',
    type: 'section',
    required: false
  },
  {
    id: 'father_cardio_history',
    text: 'Votre père a-t-il des facteurs de risques cardio-vasculaires ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'father_cardio_types',
    text: 'Si risques cardio, spécifier (sélection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'father_cardio_history' }, 'oui'] },
    options: ['Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension']
  },
  {
    id: 'father_diabetes_type',
    text: 'Pour le diabète, spécifier le type',
    type: 'single_choice',
    required: false,
    display_if: { 'in': ['Diabète', { var: 'father_cardio_types' }] },
    options: [
      { code: 1, label: 'Type I', score: 1 },
      { code: 2, label: 'Type II', score: 2 },
      { code: 99, label: 'Ne sais pas', score: 99 }
    ]
  },
  
  // ========================================================================
  // GRANDPARENTS (Grands-Parents)
  // ========================================================================
  {
    id: 'section_grandparents',
    text: 'Grands-Parents',
    type: 'section',
    required: false
  },
  {
    id: 'gp_maternal_grandmother_notes',
    text: 'Grand-mère maternelle - Antécédents (notes libres)',
    type: 'text',
    required: false
  },
  {
    id: 'gp_maternal_grandfather_notes',
    text: 'Grand-père maternel - Antécédents (notes libres)',
    type: 'text',
    required: false
  },
  {
    id: 'gp_paternal_grandmother_notes',
    text: 'Grand-mère paternelle - Antécédents (notes libres)',
    type: 'text',
    required: false
  },
  {
    id: 'gp_paternal_grandfather_notes',
    text: 'Grand-père paternel - Antécédents (notes libres)',
    type: 'text',
    required: false
  },
  
  // ========================================================================
  // CHILDREN (Enfants)
  // ========================================================================
  {
    id: 'section_children',
    text: 'Enfants',
    type: 'section',
    required: false
  },
  {
    id: 'has_children',
    text: 'Avez-vous des enfants ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'children_psy_count',
    text: 'Parmi eux, combien ont des antécédents de maladie psychiatrique ?',
    type: 'number',
    required: false,
    min: 0,
    max: 20,
    display_if: { '==': [{ var: 'has_children' }, 'oui'] }
  },
  {
    id: 'children_cardio_count',
    text: 'Parmi eux, combien ont des facteurs de risque cardio-vasculaires ?',
    type: 'number',
    required: false,
    min: 0,
    max: 20,
    display_if: { '==': [{ var: 'has_children' }, 'oui'] }
  },
  
  // Child 1 - 4 (simplified, can be expanded)
  {
    id: 'section_child1',
    text: 'Enfant 1 (optionnel)',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'has_children' }, 'oui'] }
  },
  {
    id: 'child1_gender',
    text: 'Sexe',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'M', label: 'Fils' },
      { code: 'F', label: 'Fille' }
    ]
  },
  {
    id: 'child1_dob',
    text: 'Date de naissance (format libre)',
    type: 'text',
    required: false
  },
  {
    id: 'child1_psy_history',
    text: 'Antécédents psychiatriques',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'child1_psy_details',
    text: 'Détails Psy (sélection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'child1_psy_history' }, 'oui'] },
    options: ['Troubles Thymiques', 'Schizophrénie', 'Suicide (tentative/abouti)', 'Substances', 'Anxiété', 'Démence']
  },
  {
    id: 'child1_cardio',
    text: 'Facteurs de risques cardio-vasculaires',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Repeat for Child 2, 3, 4 (abbreviated for brevity)
  { id: 'section_child2', text: 'Enfant 2 (optionnel)', type: 'section', required: false, display_if: { '==': [{ var: 'has_children' }, 'oui'] } },
  { id: 'child2_gender', text: 'Sexe', type: 'single_choice', required: false, options: [{ code: 'M', label: 'Fils' }, { code: 'F', label: 'Fille' }] },
  { id: 'child2_dob', text: 'Date de naissance', type: 'text', required: false },
  { id: 'child2_psy_history', text: 'Antécédents psychiatriques', type: 'single_choice', required: false, options: [{ code: 'oui', label: 'Oui' }, { code: 'non', label: 'Non' }, { code: 'ne_sais_pas', label: 'Ne sais pas' }] },
  { id: 'child2_psy_details', text: 'Détails Psy', type: 'multiple_choice', required: false, display_if: { '==': [{ var: 'child2_psy_history' }, 'oui'] }, options: ['Troubles Thymiques', 'Schizophrénie', 'Suicide (tentative/abouti)', 'Substances', 'Anxiété', 'Démence'] },
  { id: 'child2_cardio', text: 'Facteurs cardio', type: 'single_choice', required: false, options: [{ code: 'oui', label: 'Oui' }, { code: 'non', label: 'Non' }, { code: 'ne_sais_pas', label: 'Ne sais pas' }] },
  
  { id: 'section_child3', text: 'Enfant 3 (optionnel)', type: 'section', required: false, display_if: { '==': [{ var: 'has_children' }, 'oui'] } },
  { id: 'child3_gender', text: 'Sexe', type: 'single_choice', required: false, options: [{ code: 'M', label: 'Fils' }, { code: 'F', label: 'Fille' }] },
  { id: 'child3_dob', text: 'Date de naissance', type: 'text', required: false },
  { id: 'child3_psy_history', text: 'Antécédents psychiatriques', type: 'single_choice', required: false, options: [{ code: 'oui', label: 'Oui' }, { code: 'non', label: 'Non' }, { code: 'ne_sais_pas', label: 'Ne sais pas' }] },
  { id: 'child3_psy_details', text: 'Détails Psy', type: 'multiple_choice', required: false, display_if: { '==': [{ var: 'child3_psy_history' }, 'oui'] }, options: ['Troubles Thymiques', 'Schizophrénie', 'Suicide (tentative/abouti)', 'Substances', 'Anxiété', 'Démence'] },
  { id: 'child3_cardio', text: 'Facteurs cardio', type: 'single_choice', required: false, options: [{ code: 'oui', label: 'Oui' }, { code: 'non', label: 'Non' }, { code: 'ne_sais_pas', label: 'Ne sais pas' }] },
  
  { id: 'section_child4', text: 'Enfant 4 (optionnel)', type: 'section', required: false, display_if: { '==': [{ var: 'has_children' }, 'oui'] } },
  { id: 'child4_gender', text: 'Sexe', type: 'single_choice', required: false, options: [{ code: 'M', label: 'Fils' }, { code: 'F', label: 'Fille' }] },
  { id: 'child4_dob', text: 'Date de naissance', type: 'text', required: false },
  { id: 'child4_psy_history', text: 'Antécédents psychiatriques', type: 'single_choice', required: false, options: [{ code: 'oui', label: 'Oui' }, { code: 'non', label: 'Non' }, { code: 'ne_sais_pas', label: 'Ne sais pas' }] },
  { id: 'child4_psy_details', text: 'Détails Psy', type: 'multiple_choice', required: false, display_if: { '==': [{ var: 'child4_psy_history' }, 'oui'] }, options: ['Troubles Thymiques', 'Schizophrénie', 'Suicide (tentative/abouti)', 'Substances', 'Anxiété', 'Démence'] },
  { id: 'child4_cardio', text: 'Facteurs cardio', type: 'single_choice', required: false, options: [{ code: 'oui', label: 'Oui' }, { code: 'non', label: 'Non' }, { code: 'ne_sais_pas', label: 'Ne sais pas' }] },
  
  // ========================================================================
  // SIBLINGS (Frères et Soeurs)
  // ========================================================================
  {
    id: 'section_siblings',
    text: 'Frères et Soeurs',
    type: 'section',
    required: false
  },
  {
    id: 'has_siblings',
    text: 'Avez-vous des frères/soeurs ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // Sibling 1 - 4 (detailed for first, abbreviated for others)
  {
    id: 'section_sibling1',
    text: 'Frère/Soeur 1 (optionnel)',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'has_siblings' }, 'oui'] }
  },
  {
    id: 'sibling1_gender',
    text: 'Sexe',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'M', label: 'Frère' },
      { code: 'F', label: 'Soeur' }
    ]
  },
  {
    id: 'sibling1_deceased',
    text: 'Est-il/elle décédé(e) ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sibling1_death_cause',
    text: 'Cause du décès',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'sibling1_deceased' }, 'oui'] }
  },
  {
    id: 'sibling1_psy_history',
    text: 'Antécédents psychiatriques',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  ...createPsyAssessment('Frère/Soeur 1', 'sibling1').filter(q => q.id !== 'sibling1_psy_dementia'), // No dementia for siblings
  {
    id: 'sibling1_cardio_history',
    text: 'Facteurs de risques cardio-vasculaires',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sibling1_cardio_types',
    text: 'Si risques cardio, spécifier',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'sibling1_cardio_history' }, 'oui'] },
    options: ['Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension']
  },
  
  // Siblings 2-4 (abbreviated)
  { id: 'section_sibling2', text: 'Frère/Soeur 2 (optionnel)', type: 'section', required: false, display_if: { '==': [{ var: 'has_siblings' }, 'oui'] } },
  { id: 'sibling2_gender', text: 'Sexe', type: 'single_choice', required: false, options: [{ code: 'M', label: 'Frère' }, { code: 'F', label: 'Soeur' }] },
  { id: 'sibling2_deceased', text: 'Décédé(e) ?', type: 'single_choice', required: false, options: [{ code: 'oui', label: 'Oui' }, { code: 'non', label: 'Non' }, { code: 'ne_sais_pas', label: 'Ne sais pas' }] },
  { id: 'sibling2_death_cause', text: 'Cause du décès', type: 'text', required: false, display_if: { '==': [{ var: 'sibling2_deceased' }, 'oui'] } },
  { id: 'sibling2_psy_history', text: 'Antécédents psychiatriques', type: 'single_choice', required: false, options: [{ code: 'oui', label: 'Oui' }, { code: 'non', label: 'Non' }, { code: 'ne_sais_pas', label: 'Ne sais pas' }] },
  ...createPsyAssessment('Frère/Soeur 2', 'sibling2').filter(q => q.id !== 'sibling2_psy_dementia'),
  { id: 'sibling2_cardio_history', text: 'Facteurs cardio', type: 'single_choice', required: false, options: [{ code: 'oui', label: 'Oui' }, { code: 'non', label: 'Non' }, { code: 'ne_sais_pas', label: 'Ne sais pas' }] },
  { id: 'sibling2_cardio_types', text: 'Types de risques cardio', type: 'multiple_choice', required: false, display_if: { '==': [{ var: 'sibling2_cardio_history' }, 'oui'] }, options: ['Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension'] },
  
  { id: 'section_sibling3', text: 'Frère/Soeur 3 (optionnel)', type: 'section', required: false, display_if: { '==': [{ var: 'has_siblings' }, 'oui'] } },
  { id: 'sibling3_gender', text: 'Sexe', type: 'single_choice', required: false, options: [{ code: 'M', label: 'Frère' }, { code: 'F', label: 'Soeur' }] },
  { id: 'sibling3_deceased', text: 'Décédé(e) ?', type: 'single_choice', required: false, options: [{ code: 'oui', label: 'Oui' }, { code: 'non', label: 'Non' }, { code: 'ne_sais_pas', label: 'Ne sais pas' }] },
  { id: 'sibling3_death_cause', text: 'Cause du décès', type: 'text', required: false, display_if: { '==': [{ var: 'sibling3_deceased' }, 'oui'] } },
  { id: 'sibling3_psy_history', text: 'Antécédents psychiatriques', type: 'single_choice', required: false, options: [{ code: 'oui', label: 'Oui' }, { code: 'non', label: 'Non' }, { code: 'ne_sais_pas', label: 'Ne sais pas' }] },
  ...createPsyAssessment('Frère/Soeur 3', 'sibling3').filter(q => q.id !== 'sibling3_psy_dementia'),
  { id: 'sibling3_cardio_history', text: 'Facteurs cardio', type: 'single_choice', required: false, options: [{ code: 'oui', label: 'Oui' }, { code: 'non', label: 'Non' }, { code: 'ne_sais_pas', label: 'Ne sais pas' }] },
  { id: 'sibling3_cardio_types', text: 'Types de risques cardio', type: 'multiple_choice', required: false, display_if: { '==': [{ var: 'sibling3_cardio_history' }, 'oui'] }, options: ['Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension'] },
  
  { id: 'section_sibling4', text: 'Frère/Soeur 4 (optionnel)', type: 'section', required: false, display_if: { '==': [{ var: 'has_siblings' }, 'oui'] } },
  { id: 'sibling4_gender', text: 'Sexe', type: 'single_choice', required: false, options: [{ code: 'M', label: 'Frère' }, { code: 'F', label: 'Soeur' }] },
  { id: 'sibling4_deceased', text: 'Décédé(e) ?', type: 'single_choice', required: false, options: [{ code: 'oui', label: 'Oui' }, { code: 'non', label: 'Non' }, { code: 'ne_sais_pas', label: 'Ne sais pas' }] },
  { id: 'sibling4_death_cause', text: 'Cause du décès', type: 'text', required: false, display_if: { '==': [{ var: 'sibling4_deceased' }, 'oui'] } },
  { id: 'sibling4_psy_history', text: 'Antécédents psychiatriques', type: 'single_choice', required: false, options: [{ code: 'oui', label: 'Oui' }, { code: 'non', label: 'Non' }, { code: 'ne_sais_pas', label: 'Ne sais pas' }] },
  ...createPsyAssessment('Frère/Soeur 4', 'sibling4').filter(q => q.id !== 'sibling4_psy_dementia'),
  { id: 'sibling4_cardio_history', text: 'Facteurs cardio', type: 'single_choice', required: false, options: [{ code: 'oui', label: 'Oui' }, { code: 'non', label: 'Non' }, { code: 'ne_sais_pas', label: 'Ne sais pas' }] },
  { id: 'sibling4_cardio_types', text: 'Types de risques cardio', type: 'multiple_choice', required: false, display_if: { '==': [{ var: 'sibling4_cardio_history' }, 'oui'] }, options: ['Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension'] }
];

export const FAMILY_HISTORY_DEFINITION: QuestionnaireDefinition = {
  id: 'family_history',
  code: 'FAMILY_HISTORY_FR',
  title: 'Antécédents Familiaux (Anamnèse)',
  description: 'Évaluation systématique des antécédents psychiatriques et cardiovasculaires chez les ascendants, descendants et collatéraux.',
  questions: FAMILY_HISTORY_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// C-SSRS (Columbia-Suicide Severity Rating Scale)
// ============================================================================

export const CSSRS_QUESTIONS: Question[] = [
  {
    id: 'section_ideation',
    text: 'Idéation Suicidaire',
    type: 'section',
    required: false
  },
  {
    id: 'q1_wish_dead',
    text: '1. Désir d\'être mort(e) : Avez-vous souhaité être mort(e) ou de vous endormir et de ne jamais vous réveiller ?',
    help: 'Si la réponse aux questions 1 et 2 est "non", passez à la fin du questionnaire.',
    type: 'boolean',
    required: true
  },
  {
    id: 'q2_non_specific',
    text: '2. Pensées suicidaires actives non spécifiques : Avez-vous réellement pensé à vous suicider ?',
    help: 'Si la réponse est "oui", posez les questions 3, 4 et 5.',
    type: 'boolean',
    required: true
  },
  {
    id: 'q3_method_no_intent',
    text: '3. Idéation suicidaire active avec la définition des méthodes (sans scénario), sans intention de passage à l\'acte : Avez-vous pensé à la manière dont vous vous y prendriez ?',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'q2_non_specific' }, true] }
  },
  {
    id: 'q4_intent_no_plan',
    text: '4. Idéation suicidaire active avec intention de passage à l\'acte, sans scénario précis : Avez-vous eu des pensées de ce genre et l\'intention de passer à l\'acte ?',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'q2_non_specific' }, true] }
  },
  {
    id: 'q5_plan_intent',
    text: '5. Idéation suicidaire active avec scénario précis et intention de passer à l\'acte : Avez-vous commencé ou fini d\'élaborer un scénario détaillé sur la manière dont vous voulez vous suicider ? Et avez-vous l\'intention de mettre ce scénario à exécution ?',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'q2_non_specific' }, true] }
  },
  
  // Intensity of Ideation
  {
    id: 'section_intensity',
    text: 'Intensité de l\'idéation',
    type: 'section',
    required: false,
    display_if: {
      or: [
        { '==': [{ var: 'q1_wish_dead' }, true] },
        { '==': [{ var: 'q2_non_specific' }, true] }
      ]
    }
  },
  {
    id: 'int_most_severe',
    text: 'Idéation la plus grave (1 à 5) : Indiquez le numéro du type d\'idéation le plus grave',
    help: 'Ne compléter que si Q1 et/ou Q2 est "oui".',
    type: 'single_choice',
    required: false,
    display_if: {
      or: [
        { '==': [{ var: 'q1_wish_dead' }, true] },
        { '==': [{ var: 'q2_non_specific' }, true] }
      ]
    },
    options: [
      { code: 1, label: 'Type 1 (Désir d\'être mort)', score: 1 },
      { code: 2, label: 'Type 2 (Pensées non spécifiques)', score: 2 },
      { code: 3, label: 'Type 3 (Méthodes sans intention)', score: 3 },
      { code: 4, label: 'Type 4 (Intention sans scénario)', score: 4 },
      { code: 5, label: 'Type 5 (Scénario et intention)', score: 5 }
    ]
  },
  {
    id: 'int_frequency',
    text: 'Fréquence : Combien de fois avez-vous eu ces pensées ?',
    type: 'single_choice',
    required: false,
    display_if: {
      or: [
        { '==': [{ var: 'q1_wish_dead' }, true] },
        { '==': [{ var: 'q2_non_specific' }, true] }
      ]
    },
    options: [
      { code: 1, label: '1 - Moins d\'une fois par semaine', score: 1 },
      { code: 2, label: '2 - Une fois par semaine', score: 2 },
      { code: 3, label: '3 - 2 à 5 fois par semaine', score: 3 },
      { code: 4, label: '4 - Tous les jours ou presque', score: 4 },
      { code: 5, label: '5 - Plusieurs fois par jour', score: 5 }
    ]
  },
  {
    id: 'int_duration',
    text: 'Durée : Lorsque vous avez ces pensées, combien de temps durent-elles ?',
    type: 'single_choice',
    required: false,
    display_if: {
      or: [
        { '==': [{ var: 'q1_wish_dead' }, true] },
        { '==': [{ var: 'q2_non_specific' }, true] }
      ]
    },
    options: [
      { code: 1, label: '1 - Quelques instants (quelques secondes ou quelques minutes)', score: 1 },
      { code: 2, label: '2 - Moins d\'une heure/un certain temps', score: 2 },
      { code: 3, label: '3 - 1 à 4h/longtemps', score: 3 },
      { code: 4, label: '4 - 4 à 8h/une grande partie de la journée', score: 4 },
      { code: 5, label: '5 - Plus de 8h/en permanence ou tout le temps', score: 5 }
    ]
  },
  {
    id: 'int_control',
    text: 'Maîtrise des pensées suicidaires : Pourriez-vous/pouvez-vous arrêter de penser au suicide ou à votre envie de mourir si vous le voul(i)ez ?',
    type: 'single_choice',
    required: false,
    display_if: {
      or: [
        { '==': [{ var: 'q1_wish_dead' }, true] },
        { '==': [{ var: 'q2_non_specific' }, true] }
      ]
    },
    options: [
      { code: 1, label: '1 - Maîtrise facilement ses pensées', score: 1 },
      { code: 2, label: '2 - Capable de maîtriser ses pensées avec de légères difficultés', score: 2 },
      { code: 3, label: '3 - Capable de maîtriser ses pensées avec quelques difficultés', score: 3 },
      { code: 4, label: '4 - Capable de maîtriser ses pensées avec de grandes difficultés', score: 4 },
      { code: 5, label: '5 - Incapable de maîtriser ses pensées', score: 5 },
      { code: 0, label: '0 - N\'essaie pas de maîtriser ses pensées', score: 0 }
    ]
  },
  {
    id: 'int_deterrents',
    text: 'Éléments dissuasifs : Y a-t-il quelque chose ou quelqu\'un qui vous a dissuadé de vouloir mourir ou de mettre à exécution vos pensées suicidaires ?',
    type: 'single_choice',
    required: false,
    display_if: {
      or: [
        { '==': [{ var: 'q1_wish_dead' }, true] },
        { '==': [{ var: 'q2_non_specific' }, true] }
      ]
    },
    options: [
      { code: 1, label: '1 - Des éléments dissuasifs vous ont véritablement empêché(e) de tenter de vous suicider', score: 1 },
      { code: 2, label: '2 - Des éléments dissuasifs vous ont probablement arrêté(e)', score: 2 },
      { code: 3, label: '3 - Vous ne savez pas si des éléments dissuasifs vous ont arrêté(e)', score: 3 },
      { code: 4, label: '4 - Vous n\'avez très probablement été arrêté(e) par aucun élément dissuasif', score: 4 },
      { code: 5, label: '5 - Les éléments dissuasifs ne vous ont pas du tout arrêté(e)', score: 5 }
    ]
  },
  {
    id: 'int_causes',
    text: 'Causes de l\'idéation : Quelles sont les raisons pour lesquelles vous avez souhaité mourir ou vous suicider ?',
    type: 'single_choice',
    required: false,
    display_if: {
      or: [
        { '==': [{ var: 'q1_wish_dead' }, true] },
        { '==': [{ var: 'q2_non_specific' }, true] }
      ]
    },
    options: [
      { code: 0, label: '0 - Sans objet', score: 0 },
      { code: 1, label: '1 - Uniquement pour attirer l\'attention, vous venger ou faire réagir les autres', score: 1 },
      { code: 2, label: '2 - Principalement pour attirer l\'attention, vous venger ou faire réagir les autres', score: 2 },
      { code: 3, label: '3 - Autant pour attirer l\'attention... que pour faire cesser la douleur', score: 3 },
      { code: 4, label: '4 - Principalement pour faire cesser la douleur', score: 4 },
      { code: 5, label: '5 - Uniquement pour faire cesser la douleur', score: 5 }
    ]
  }
];

export const CSSRS_DEFINITION: QuestionnaireDefinition = {
  id: 'cssrs',
  code: 'CSSRS_FR',
  title: 'C-SSRS - Échelle d\'évaluation de Colombia sur la gravité du risque suicidaire',
  description: 'Évaluation standardisée de l\'idéation et du comportement suicidaire (depuis la semaine dernière).',
  questions: CSSRS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// ISA (Intentionnalité Suicidaire Actuelle)
// ============================================================================

export const ISA_QUESTIONS: Question[] = [
  {
    id: 'intro',
    text: 'Cette échelle doit toujours être administrée, même en cas d\'absence de tentative de suicide avérée.',
    type: 'text',
    required: false
  },
  {
    id: 'q1_life_worth',
    text: '1. Avez-vous déjà eu l\'impression que la vie ne vaut pas la peine d\'être vécue ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q1_time',
    text: 'Quand cela est-il arrivé pour la dernière fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q1_life_worth' }, 1]
    },
    options: [
      { code: 'last_week', label: 'La semaine dernière', score: 0 },
      { code: '2w_12m', label: 'Il y a entre deux semaines et douze mois', score: 0 },
      { code: 'more_1y', label: 'Il y a plus d\'un an', score: 0 }
    ]
  },
  {
    id: 'q2_wish_death',
    text: '2. Avez-vous déjà souhaité mourir, par exemple, de vous coucher et de ne pas vous réveiller ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q2_time',
    text: 'Quand cela est-il arrivé pour la dernière fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q2_wish_death' }, 1]
    },
    options: [
      { code: 'last_week', label: 'La semaine dernière', score: 0 },
      { code: '2w_12m', label: 'Il y a entre deux semaines et douze mois', score: 0 },
      { code: 'more_1y', label: 'Il y a plus d\'un an', score: 0 }
    ]
  },
  {
    id: 'q3_thoughts',
    text: '3. Avez-vous déjà pensé à vous donner la mort, même si vous ne le feriez jamais ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q3_time',
    text: 'Quand cela est-il arrivé pour la dernière fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q3_thoughts' }, 1]
    },
    options: [
      { code: 'last_week', label: 'La semaine dernière', score: 0 },
      { code: '2w_12m', label: 'Il y a entre deux semaines et douze mois', score: 0 },
      { code: 'more_1y', label: 'Il y a plus d\'un an', score: 0 }
    ]
  },
  {
    id: 'q4_plan',
    text: '4. Avez-vous déjà sérieusement envisagé de vous donner la mort ou planifié la façon de vous y prendre ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q4_time',
    text: 'Quand cela est-il arrivé pour la dernière fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q4_plan' }, 1]
    },
    options: [
      { code: 'last_week', label: 'La semaine dernière', score: 0 },
      { code: '2w_12m', label: 'Il y a entre deux semaines et douze mois', score: 0 },
      { code: 'more_1y', label: 'Il y a plus d\'un an', score: 0 }
    ]
  },
  {
    id: 'q5_attempt',
    text: '5. Avez-vous déjà essayé de vous donner la mort ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q5_time',
    text: 'Quand cela est-il arrivé pour la dernière fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q5_attempt' }, 1]
    },
    options: [
      { code: 'last_week', label: 'La semaine dernière', score: 0 },
      { code: '2w_12m', label: 'Il y a entre deux semaines et douze mois', score: 0 },
      { code: 'more_1y', label: 'Il y a plus d\'un an', score: 0 }
    ]
  }
];

export const ISA_DEFINITION: QuestionnaireDefinition = {
  id: 'isa',
  code: 'ISA_FR',
  title: 'Intentionnalité Suicidaire Actuelle',
  description: 'Échelle évaluant les pensées, désirs et tentatives de suicide, ainsi que leur temporalité récente ou passée.',
  questions: ISA_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// C-SSRS History (Histoire des Conduites Suicidaires)
// ============================================================================

export const CSSRS_HISTORY_QUESTIONS: Question[] = [
  {
    id: 'ts_first_date',
    text: '1. Date de la première Tentative de Suicide (TS)',
    type: 'text',
    required: true
  },
  {
    id: 'ts_total_count',
    text: '2. Combien de fois avez-vous tenté de vous suicider ?',
    type: 'number',
    required: true
  },
  {
    id: 'ts_violent_presence',
    text: '3. Existe-t-il des TS violentes (arme à feu, immolation, noyade, saut, pendaison, autre) ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 99, label: 'Ne sais pas', score: 99 }
    ]
  },
  {
    id: 'ts_violent_count',
    text: 'Si oui, nombre de TS violentes :',
    type: 'number',
    required: false,
    display_if: {
      '==': [{ var: 'ts_violent_presence' }, 1]
    }
  },
  {
    id: 'ts_serious_presence',
    text: '4. Existe-t-il des TS graves (passage en réanimation) non violentes (médicamenteuses, phlébotomie) ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 99, label: 'Ne sais pas', score: 99 }
    ]
  },
  {
    id: 'ts_serious_count',
    text: 'Si oui, nombre de TS graves :',
    type: 'number',
    required: false,
    display_if: {
      '==': [{ var: 'ts_serious_presence' }, 1]
    }
  },
  {
    id: 'ts_interrupted_presence',
    text: 'Tentative interrompue : Vous est-il arrivé de commencer à faire quelque chose pour mettre fin à vos jours, mais d\'en être empêché(e) par quelqu\'un ou quelque chose ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'ts_interrupted_count',
    text: 'Nombre total des tentatives interrompues :',
    type: 'number',
    required: false,
    display_if: {
      '==': [{ var: 'ts_interrupted_presence' }, 1]
    }
  },
  {
    id: 'ts_aborted_presence',
    text: 'Tentative avortée : Vous est-il arrivé de commencer à faire quelque chose... mais de vous arrêter de vous-même ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'ts_aborted_count',
    text: 'Nombre total des tentatives avortées :',
    type: 'number',
    required: false,
    display_if: {
      '==': [{ var: 'ts_aborted_presence' }, 1]
    }
  },
  {
    id: 'ts_preparations',
    text: 'Préparatifs : Avez-vous pris certaines mesures pour faire une tentative de suicide ou pour préparer votre suicide ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'lethality_recent',
    text: 'Létalité/lésions médicales observées (Tentative la plus récente)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Aucune atteinte physique ou très légère', score: 0 },
      { code: 1, label: '1 - Atteinte physique légère', score: 1 },
      { code: 2, label: '2 - Atteinte physique modérée (soins médicaux)', score: 2 },
      { code: 3, label: '3 - Atteinte physique grave (soins intensifs probables)', score: 3 },
      { code: 4, label: '4 - Atteinte physique très grave (soins intensifs nécessaires)', score: 4 },
      { code: 5, label: '5 - Décès', score: 5 }
    ]
  },
  {
    id: 'date_recent',
    text: 'Date de la tentative la plus récente :',
    type: 'text',
    required: false
  },
  {
    id: 'lethality_most_lethal',
    text: 'Létalité/lésions médicales observées (Tentative la plus létale)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Aucune atteinte physique ou très légère', score: 0 },
      { code: 1, label: '1 - Atteinte physique légère', score: 1 },
      { code: 2, label: '2 - Atteinte physique modérée (soins médicaux)', score: 2 },
      { code: 3, label: '3 - Atteinte physique grave (soins intensifs probables)', score: 3 },
      { code: 4, label: '4 - Atteinte physique très grave (soins intensifs nécessaires)', score: 4 },
      { code: 5, label: '5 - Décès', score: 5 }
    ]
  },
  {
    id: 'date_most_lethal',
    text: 'Date de la tentative la plus létale :',
    type: 'text',
    required: false
  },
  {
    id: 'lethality_first',
    text: 'Létalité/lésions médicales observées (Première tentative)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Aucune atteinte physique ou très légère', score: 0 },
      { code: 1, label: '1 - Atteinte physique légère', score: 1 },
      { code: 2, label: '2 - Atteinte physique modérée (soins médicaux)', score: 2 },
      { code: 3, label: '3 - Atteinte physique grave (soins intensifs probables)', score: 3 },
      { code: 4, label: '4 - Atteinte physique très grave (soins intensifs nécessaires)', score: 4 },
      { code: 5, label: '5 - Décès', score: 5 }
    ]
  },
  {
    id: 'date_first_confirm',
    text: 'Date de la première tentative :',
    type: 'text',
    required: false
  },
  {
    id: 'potential_lethality',
    text: 'Létalité probable d\'une tentative avérée en l\'absence de lésions médicales (si létalité observée = 0)',
    type: 'text',
    required: false
  }
];

export const CSSRS_HISTORY_DEFINITION: QuestionnaireDefinition = {
  id: 'cssrs_history',
  code: 'CSSRS_HISTORY_FR',
  title: 'Histoire des Conduites Suicidaires (C-SSRS Supplement)',
  description: 'Recueil détaillé de l\'historique des tentatives de suicide, incluant la violence, la gravité médicale (létalité) et les comportements interrompus/avortés.',
  questions: CSSRS_HISTORY_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// SIS (Suicide Intent Scale) - Beck
// ============================================================================

export const SIS_QUESTIONS: Question[] = [
  {
    id: 'sis_01',
    text: '1) Isolement',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Quelqu\'un était présent', score: 0 },
      { code: 1, label: 'Quelqu\'un était à proximité ou en contact (par exemple au téléphone)', score: 1 },
      { code: 2, label: 'Personne n\'était à proximité', score: 2 }
    ]
  },
  {
    id: 'sis_02',
    text: '2) « Timing »',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Geste organisé, de sorte qu\'une intervention est probable', score: 0 },
      { code: 1, label: 'L\'intervention d\'un tiers n\'est pas probable', score: 1 },
      { code: 2, label: 'L\'intervention d\'un tiers est hautement improbable', score: 2 }
    ]
  },
  {
    id: 'sis_03',
    text: '3) Précautions contre la découverte',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune précaution', score: 0 },
      { code: 1, label: 'Précautions passives (comme se soustraire aux autres sans rien faire pour éviter leur intervention: être seul dans la pièce, porte non verrouillée)', score: 1 },
      { code: 2, label: 'Précautions actives (porte verrouillée)', score: 2 }
    ]
  },
  {
    id: 'sis_04',
    text: '4) Recherche de secours pendant ou après la TS',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'En a parlé à un sauveteur potentiel', score: 0 },
      { code: 1, label: 'A contacté un sauveteur potentiel, mais sans mentionner son geste', score: 1 },
      { code: 2, label: 'N\'a contacté ou avisé personne', score: 2 }
    ]
  },
  {
    id: 'sis_05',
    text: '5) « Derniers actes » anticipant la mort (dernières volontés, dons, assurances...)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucun', score: 0 },
      { code: 1, label: 'Préparation partielle (y a pensé ou a fait quelques arrangements)', score: 1 },
      { code: 2, label: 'Plans définis et réalisés (changement dans les dernières volontés, assurance...)', score: 2 }
    ]
  },
  {
    id: 'sis_06',
    text: '6) Préparation active de la tentative de suicide',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune', score: 0 },
      { code: 1, label: 'Minime à modérée', score: 1 },
      { code: 2, label: 'Etendue', score: 2 }
    ]
  },
  {
    id: 'sis_07',
    text: '7) Notes ou lettres laissées',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Pas de message', score: 0 },
      { code: 1, label: 'Message écrit puis déchiré, a pensé à laisser un message', score: 1 },
      { code: 2, label: 'Présence d\'un message', score: 2 }
    ]
  },
  {
    id: 'sis_08',
    text: '8) Communication claire de l\'intention avant la tentative de suicide',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucune', score: 0 },
      { code: 1, label: 'Communication équivoque', score: 1 },
      { code: 2, label: 'Communication non équivoque', score: 2 }
    ]
  },
  {
    id: 'sis_09',
    text: '9) But allégué de la tentative',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Attirer l\'attention, manipuler l\'environnement, se venger...', score: 0 },
      { code: 1, label: 'Entre 0 et 2', score: 1 },
      { code: 2, label: 'Pour s\'enfuir, disparaître, résoudre ses problèmes', score: 2 }
    ]
  },
  {
    id: 'sis_10',
    text: '10) Opinion sur l\'issue du geste',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Pensait que la mort était improbable', score: 0 },
      { code: 1, label: 'Pensait que la mort était possible', score: 1 },
      { code: 2, label: 'Pensait que la mort était probable, voire certaine', score: 2 }
    ]
  },
  {
    id: 'sis_11',
    text: '11) Conception sur la létalité de la méthode',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Le sujet n\'était pas sûr que ce qu\'il faisait était mortel', score: 0 },
      { code: 1, label: 'Le sujet a fait moins que ce qu\'il pensait être mortel', score: 1 },
      { code: 2, label: 'Le sujet a égalé ou dépassé ce qu\'il pensait être mortel', score: 2 }
    ]
  },
  {
    id: 'sis_12',
    text: '12) Gravité de la tentative',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Pense ne pas sérieusement avoir tenté de mettre fin à ses jours', score: 0 },
      { code: 1, label: 'N\'est pas sûr d\'avoir sérieusement tenté de mettre fin à ses jours', score: 1 },
      { code: 2, label: 'Pense avoir sérieusement tenté de mettre fin à ses jours', score: 2 }
    ]
  },
  {
    id: 'sis_13',
    text: '13) Attitude à l\'égard de vivre ou de mourir',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Ne voulait pas mourir', score: 0 },
      { code: 1, label: 'Entre 0 et 2', score: 1 },
      { code: 2, label: 'Voulait mourir', score: 2 }
    ]
  },
  {
    id: 'sis_14',
    text: '14) Opinion sur l\'efficacité des soins éventuels',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Pensait que la mort était improbable s\'il recevait une aide médicale', score: 0 },
      { code: 1, label: 'Ne savait pas clairement si la mort pouvait être prévenue par une intervention médicale', score: 1 },
      { code: 2, label: 'Était certain de mourir même s\'il recevait une aide médicale', score: 2 }
    ]
  },
  {
    id: 'sis_15',
    text: '15) Degré de préméditation',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'T.S. impulsive, sans préméditation', score: 0 },
      { code: 1, label: 'Acte envisagé moins de 3 heures avant la T.S.', score: 1 },
      { code: 2, label: 'Acte envisagé plus de 3 heures avant la T.S.', score: 2 }
    ]
  }
];

export const SIS_DEFINITION: QuestionnaireDefinition = {
  id: 'sis',
  code: 'SIS_FR',
  title: 'SIS (Suicide Intent Scale) - Tentative la plus récente',
  description: 'Évaluation de l\'intentionnalité suicidaire basée sur les circonstances du geste et la conception du sujet lors de la tentative la plus récente (Beck).',
  questions: SIS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// WAIS-IV Clinical Criteria (Neuropsychological Evaluation)
// ============================================================================

export const WAIS4_CRITERIA_QUESTIONS: Question[] = [
  {
    id: 'collection_date',
    section: 'Informations Générales',
    text: 'Date de recueil des informations',
    type: 'date',
    required: true
  },
  {
    id: 'age',
    section: 'Informations Générales',
    text: 'Age du patient',
    type: 'number',
    required: true,
    min: 16,
    max: 90,
    help: 'L\'âge doit être compris entre 16 et 90 ans'
  },
  {
    id: 'laterality',
    section: 'Informations Générales',
    text: 'Latéralité',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'gaucher', label: 'Gaucher', score: 0 },
      { code: 'droitier', label: 'Droitier', score: 0 },
      { code: 'ambidextre', label: 'Ambidextre', score: 0 }
    ]
  },
  {
    id: 'native_french_speaker',
    section: 'Informations Générales',
    text: 'Langue maternelle française',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'time_since_last_eval',
    section: 'État Clinique',
    text: 'Temps écoulé depuis la dernière évaluation de l\'état du patient',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'moins_semaine', label: 'Moins d\'une semaine', score: 0 },
      { code: 'plus_semaine', label: 'Plus d\'une semaine', score: 0 }
    ]
  },
  {
    id: 'patient_euthymic',
    section: 'État Clinique',
    text: 'Patient Normothymique',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'no_episode_3months',
    section: 'État Clinique',
    text: 'Absence d\'épisode dans les 3 mois précédents',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'socio_prof_data_present',
    section: 'Données Socio-démographiques',
    text: 'Présence des données socio-professionnelles',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'years_of_education',
    section: 'Données Socio-démographiques',
    text: 'Nombre d\'années d\'études (depuis les cours préparatoires)',
    type: 'number',
    required: true,
    min: 0,
    help: 'Nombre total d\'années de scolarité'
  },
  {
    id: 'no_visual_impairment',
    section: 'Critères d\'Exclusion / Santé',
    text: 'Absence de daltonisme ou de trouble visuel invalidant',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'no_hearing_impairment',
    section: 'Critères d\'Exclusion / Santé',
    text: 'Absence de troubles auditifs non appareillés',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'no_ect_past_year',
    section: 'Critères d\'Exclusion / Santé',
    text: 'Pas de traitement par sismothérapie dans l\'année écoulée',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  }
];

export const WAIS4_CRITERIA_DEFINITION: QuestionnaireDefinition = {
  id: 'wais4_criteria',
  code: 'WAIS4_CRITERIA_FR',
  title: 'WAIS-IV Critères cliniques',
  description: 'Fiche de recueil des critères cliniques et démographiques pour la passation de la WAIS-IV.',
  questions: WAIS4_CRITERIA_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
