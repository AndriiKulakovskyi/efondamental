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
    text: "1 - Élévation de l'humeur",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Absent', score: 0 },
      { code: 1, label: '1 - Légère ou possible quand on le fait remarquer', score: 1 },
      { code: 2, label: "2 - Subjective nette ou élévation modérée de l'humeur, optimiste, confiant en soi ; enjoué, approprié au contexte", score: 2 },
      { code: 3, label: "3 - Élévation marquée de l'humeur, exubérant ; sentiment de bien-être ; enjouement inapproprié", score: 3 },
      { code: 4, label: '4 - Euphorique ; rires inappropriés ; chantonne', score: 4 }
    ]
  },
  {
    id: 'q2',
    text: "2 - Augmentation de l'activité motrice et de l'énergie",
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Absente', score: 0 },
      { code: 1, label: '1 - Subjective', score: 1 },
      { code: 2, label: '2 - Animé ; augmentation de la gestuelle', score: 2 },
      { code: 3, label: '3 - Énergie excessive ; hyperactif par moments ; agité (peut être calmé)', score: 3 },
      { code: 4, label: '4 - Excitation motrice ; hyperactivité continuelle (ne peut être calmé)', score: 4 }
    ]
  },
  {
    id: 'q3',
    text: '3 - Intérêt sexuel',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Normal ; pas d\'augmentation', score: 0 },
      { code: 1, label: '1 - Légère ou possible augmentation', score: 1 },
      { code: 2, label: '2 - Augmentation subjective nette quand on l\'interroge', score: 2 },
      { code: 3, label: '3 - Discours à contenu sexuel spontané ; se vante de ses prouesses ; augmentation marquée quand on l\'interroge', score: 3 },
      { code: 4, label: '4 - Actes sexuels manifestes (envers des patients, le personnel ou l\'interviewer)', score: 4 }
    ]
  },
  {
    id: 'q4',
    text: '4 - Sommeil',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Pas de diminution de sommeil', score: 0 },
      { code: 1, label: '1 - Dort moins que d\'habitude (jusqu\'à 1 heure de moins)', score: 1 },
      { code: 2, label: '2 - Dort moins que d\'habitude (plus d\'1 heure de moins)', score: 2 },
      { code: 3, label: '3 - Diminution du besoin de sommeil', score: 3 },
      { code: 4, label: '4 - Nie avoir besoin de sommeil', score: 4 }
    ]
  },
  {
    id: 'q5',
    text: '5 - Irritabilité',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Absente', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Subjective', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Irritable par moments durant l\'entretien ; épisodes récents d\'emportement ou de contrariété dans le service', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Souvent irritable durant l\'entretien ; bref et sec', score: 6 },
      { code: 7, label: '7', score: 7 },
      { code: 8, label: '8 - Hostile ; peu coopératif ; entretien impossible', score: 8 }
    ]
  },
  {
    id: 'q6',
    text: '6 - Débit verbal (débit et quantité)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Pas d\'augmentation', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Se sent bavard', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Augmentation du débit ou de la quantité par moments ; prolixe', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Poussée ; constamment augmenté ; difficile à interrompre', score: 6 },
      { code: 7, label: '7', score: 7 },
      { code: 8, label: '8 - Sous pression ; impossible à interrompre ; discours continu', score: 8 }
    ]
  },
  {
    id: 'q7',
    text: '7 - Troubles du cours de la pensée',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Absents', score: 0 },
      { code: 1, label: '1 - Circonstanciels ; légère distractibilité ; pensées rapides', score: 1 },
      { code: 2, label: '2 - Distractible ; perd le fil ; change de sujet fréquemment ; pensées accélérées', score: 2 },
      { code: 3, label: '3 - Fuite des idées ; tangentialité ; difficultés à suivre ; rime, écholalie', score: 3 },
      { code: 4, label: '4 - Incohérent ; communication impossible', score: 4 }
    ]
  },
  {
    id: 'q8',
    text: '8 - Contenu de la pensée',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Normal', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Projets discutables ; nouveaux intérêts', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Projets spéciaux ; hyperreligiosité', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Idées de grandeur ou idées paranoides ; idées de référence', score: 6 },
      { code: 7, label: '7', score: 7 },
      { code: 8, label: '8 - Idées délirantes ; hallucinations', score: 8 }
    ]
  },
  {
    id: 'q9',
    text: '9 - Comportement agressif',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Absent', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Sarcastique ; voix forte par moments ; sur la défensive', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Revendicateur ; menaces dans le service', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Menace l\'interviewer ; crie ; entretien difficile', score: 6 },
      { code: 7, label: '7', score: 7 },
      { code: 8, label: '8 - Agressif ; destructeur ; entretien impossible', score: 8 }
    ]
  },
  {
    id: 'q10',
    text: '10 - Apparence',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Tenue et toilette appropriées', score: 0 },
      { code: 1, label: '1 - Négligé au minimum', score: 1 },
      { code: 2, label: '2 - Mal tenu ; modérément ébouriffé ; trop habillé', score: 2 },
      { code: 3, label: '3 - Ébouriffé ; à moitié nu ; maquillage criard', score: 3 },
      { code: 4, label: '4 - Complètement négligé ; parure excessive ; vêtements bizarres', score: 4 }
    ]
  },
  {
    id: 'q11',
    text: '11 - Insight',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Conscience d\'être malade ; admet un changement de comportement', score: 0 },
      { code: 1, label: '1 - Admet un changement de comportement possible', score: 1 },
      { code: 2, label: '2 - Admet un changement de comportement mais nie être malade', score: 2 },
      { code: 3, label: '3 - Admet un changement de comportement possible mais nie être malade', score: 3 },
      { code: 4, label: '4 - Nie tout changement de comportement', score: 4 }
    ]
  }
];

export const YMRS_DEFINITION: QuestionnaireDefinition = {
  id: 'ymrs',
  code: 'YMRS',
  title: 'Échelle de Manie de Young (YMRS)',
  description: 'Échelle clinique pour évaluer la sévérité des symptômes maniaques. 11 items avec cotation hétérogène.',
  questions: YMRS_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
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
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// EGF (Échelle de Fonctionnement Global)
// ============================================================================

export const EGF_QUESTIONS: Question[] = [
  {
    id: 'current_functioning',
    text: 'Fonctionnement actuel',
    help: 'Évaluer le fonctionnement global actuel du patient sur une échelle de 1 à 100',
    type: 'number',
    required: true,
    min: 1,
    max: 100
  },
  {
    id: 'worst_past_year',
    text: 'Pire fonctionnement de l\'année écoulée',
    help: 'Évaluer le pire niveau de fonctionnement au cours de l\'année écoulée',
    type: 'number',
    required: true,
    min: 1,
    max: 100
  },
  {
    id: 'best_past_year',
    text: 'Meilleur fonctionnement de l\'année écoulée',
    help: 'Évaluer le meilleur niveau de fonctionnement au cours de l\'année écoulée',
    type: 'number',
    required: true,
    min: 1,
    max: 100
  }
];

export const EGF_DEFINITION: QuestionnaireDefinition = {
  id: 'egf',
  code: 'EGF',
  title: 'Échelle de Fonctionnement Global (EGF)',
  description: 'Évaluation du fonctionnement psychologique, social et professionnel sur un continuum de 1 à 100.',
  questions: EGF_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// ALDA (Lithium Response Scale)
// ============================================================================

export const ALDA_QUESTIONS: Question[] = [
  {
    id: 'a_score',
    text: 'A - Score de réponse',
    help: 'Évaluer l\'amélioration globale attribuable au traitement au lithium (0 = pas de changement, 10 = excellente réponse)',
    type: 'scale',
    required: true,
    min: 0,
    max: 10
  },
  {
    id: 'b1',
    text: 'B1 - Nombre d\'épisodes avant traitement',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - 5 épisodes ou plus', score: 0 },
      { code: 1, label: '1 - 3-4 épisodes', score: 1 },
      { code: 2, label: '2 - 2 épisodes ou moins', score: 2 }
    ]
  },
  {
    id: 'b2',
    text: 'B2 - Fréquence des épisodes avant traitement',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Au moins 2 épisodes par an', score: 0 },
      { code: 1, label: '1 - 1 épisode par an', score: 1 },
      { code: 2, label: '2 - Moins d\'1 épisode par an', score: 2 }
    ]
  },
  {
    id: 'b3',
    text: 'B3 - Durée du traitement',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - 2 ans ou plus', score: 0 },
      { code: 1, label: '1 - 1-2 ans', score: 1 },
      { code: 2, label: '2 - Moins d\'1 an', score: 2 }
    ]
  },
  {
    id: 'b4',
    text: 'B4 - Observance',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Excellente (lithémie adéquate documentée)', score: 0 },
      { code: 1, label: '1 - Bonne (lithémie probablement adéquate)', score: 1 },
      { code: 2, label: '2 - Mauvaise (lithémie inadéquate ou inconnue)', score: 2 }
    ]
  },
  {
    id: 'b5',
    text: 'B5 - Utilisation de traitements additionnels',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Aucun traitement additionnel', score: 0 },
      { code: 1, label: '1 - Traitement additionnel occasionnel', score: 1 },
      { code: 2, label: '2 - Traitement additionnel continu', score: 2 }
    ]
  }
];

export const ALDA_DEFINITION: QuestionnaireDefinition = {
  id: 'alda',
  code: 'ALDA',
  title: 'Échelle de Réponse au Lithium d\'Alda',
  description: 'Évaluation de la réponse au traitement par lithium dans le trouble bipolaire.',
  questions: ALDA_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// État du patient (Patient State)
// ============================================================================

export const ETAT_PATIENT_QUESTIONS: Question[] = [
  {
    id: 'euthymia_severity',
    text: 'Euthymie - Sévérité',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Absent', score: 0 },
      { code: 1, label: '1 - Léger', score: 1 },
      { code: 2, label: '2 - Modéré', score: 2 },
      { code: 3, label: '3 - Sévère', score: 3 }
    ]
  },
  {
    id: 'euthymia_duration',
    text: 'Euthymie - Durée (jours)',
    type: 'number',
    required: false,
    display_if: { ">": [{ "var": "answers.euthymia_severity" }, 0] },
    required_if: { ">": [{ "var": "answers.euthymia_severity" }, 0] },
    min: 0
  },
  {
    id: 'mania_severity',
    text: 'Manie - Sévérité',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Absent', score: 0 },
      { code: 1, label: '1 - Léger', score: 1 },
      { code: 2, label: '2 - Modéré', score: 2 },
      { code: 3, label: '3 - Sévère', score: 3 }
    ]
  },
  {
    id: 'mania_duration',
    text: 'Manie - Durée (jours)',
    type: 'number',
    required: false,
    display_if: { ">": [{ "var": "answers.mania_severity" }, 0] },
    required_if: { ">": [{ "var": "answers.mania_severity" }, 0] },
    min: 0
  },
  {
    id: 'depression_severity',
    text: 'Dépression - Sévérité',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Absent', score: 0 },
      { code: 1, label: '1 - Léger', score: 1 },
      { code: 2, label: '2 - Modéré', score: 2 },
      { code: 3, label: '3 - Sévère', score: 3 }
    ]
  },
  {
    id: 'depression_duration',
    text: 'Dépression - Durée (jours)',
    type: 'number',
    required: false,
    display_if: { ">": [{ "var": "answers.depression_severity" }, 0] },
    required_if: { ">": [{ "var": "answers.depression_severity" }, 0] },
    min: 0
  },
  {
    id: 'mixed_severity',
    text: 'État mixte - Sévérité',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Absent', score: 0 },
      { code: 1, label: '1 - Léger', score: 1 },
      { code: 2, label: '2 - Modéré', score: 2 },
      { code: 3, label: '3 - Sévère', score: 3 }
    ]
  },
  {
    id: 'mixed_duration',
    text: 'État mixte - Durée (jours)',
    type: 'number',
    required: false,
    display_if: { ">": [{ "var": "answers.mixed_severity" }, 0] },
    required_if: { ">": [{ "var": "answers.mixed_severity" }, 0] },
    min: 0
  }
];

export const ETAT_PATIENT_DEFINITION: QuestionnaireDefinition = {
  id: 'etat_patient',
  code: 'ETAT_PATIENT',
  title: 'État du patient',
  description: 'Évaluation de l\'état thymique actuel du patient (euthymie, manie, dépression, mixte).',
  questions: ETAT_PATIENT_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// FAST (Functioning Assessment Short Test)
// ============================================================================

export const FAST_QUESTIONS: Question[] = [
  // Autonomy (q1-q4)
  { id: 'q1', text: '1. Faire les tâches ménagères', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q2', text: '2. Vivre seul', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q3', text: '3. Faire les courses', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q4', text: '4. Prendre soin de soi (hygiène, alimentation, vêtements)', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  // Occupational (q5-q9)
  { id: 'q5', text: '5. Avoir un travail rémunéré', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q6', text: '6. Accomplir les tâches aussi vite qu\'il le faudrait', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q7', text: '7. Travailler dans le domaine pour lequel j\'ai été formé', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q8', text: '8. Gagner de l\'argent conformément au poste occupé', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q9', text: '9. Terminer les tâches entreprises', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  // Cognitive (q10-q14)
  { id: 'q10', text: '10. Se concentrer sur un livre, un film', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q11', text: '11. Faire des calculs mentaux', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q12', text: '12. Résoudre un problème de façon adéquate', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q13', text: '13. Se souvenir de nouvelles personnes', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q14', text: '14. Apprendre une nouvelle information', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  // Financial (q15-q16)
  { id: 'q15', text: '15. Gérer son propre argent', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q16', text: '16. Dépenser de l\'argent de façon équilibrée', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  // Interpersonal (q17-q22)
  { id: 'q17', text: '17. Garder des amitiés', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q18', text: '18. Participer à des activités sociales', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q19', text: '19. S\'entendre avec les gens proches', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q20', text: '20. Relations familiales', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q21', text: '21. Avoir des relations sexuelles satisfaisantes', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q22', text: '22. Pouvoir défendre ses intérêts', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  // Leisure (q23-q24)
  { id: 'q23', text: '23. Pratiquer un sport ou participer à des jeux', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] },
  { id: 'q24', text: '24. Avoir un passe-temps', type: 'single_choice', required: true, options: [{ code: 0, label: '0 - Aucune difficulté', score: 0 }, { code: 1, label: '1 - Difficulté légère', score: 1 }, { code: 2, label: '2 - Difficulté modérée', score: 2 }, { code: 3, label: '3 - Difficulté sévère', score: 3 }] }
];

export const FAST_DEFINITION: QuestionnaireDefinition = {
  id: 'fast',
  code: 'FAST',
  title: 'Test Bref d\'Évaluation du Fonctionnement (FAST)',
  description: 'Évaluation du fonctionnement dans 6 domaines : autonomie, professionnel, cognitif, financier, interpersonnel, loisirs.',
  questions: FAST_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
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
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
