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
