// eFondaMental Platform - Hetero Questionnaire Definitions
// Clinician-rated questionnaires for bipolar disorder evaluation

import { Question, QuestionOption } from '@/lib/types/database.types';
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
  instructions: "La cotation doit se fonder sur l'entretien clinique allant de questions générales sur les symptômes à des questions plus précises qui permettent une cotation exacte de la sévérité. Le cotateur doit décider si la note est à un point nettement défini de l'échelle (0, 2, 4, 6) ou à un point intermédiaire (1, 3, 5). Il est rare qu'un patient déprimé ne puisse pas être coté sur les items de l'échelle. Si des réponses précises ne peuvent être obtenues du malade, toutes les indications pertinentes et les informations d'autres sources doivent être utilisées comme base de la cotation en accord avec la clinique. Cocher pour chaque item la case qui correspond au chiffre le plus adéquat.",
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
  instructions: "Guide pour attribuer des points aux items : le but de chaque item est d'estimer la sévérité de cette anomalie chez le patient. Lorsque plusieurs descriptions sont données pour un degré particulier de sévérité, une seule description est suffisante pour pouvoir attribuer ce degré. Les descriptions données sont des guides. On peut les ignorer si c'est nécessaire pour évaluer la sévérité, mais ceci doit plutôt être l'exception que la règle.",
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
  // CGI - 1ère partie
  {
    id: 'section_cgi_1',
    text: 'CGI - 1ère partie',
    help: 'Compléter l\'item (gravité de la maladie) lors de l\'évaluation initiale et des évaluations suivantes. Les items 2 et 3 seront omis lors de l\'évaluation initiale en cochant 0 (non évalué).',
    type: 'section',
    required: false
  },
  {
    id: 'cgi_s',
    text: 'Gravité de la maladie',
    help: 'En fonction de votre expérience clinique totale avec ce type de patient, quel est le niveau de gravité des troubles mentaux actuels du patient',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Non évalué', score: 0 },
      { code: 1, label: 'Normal, pas du tout malade', score: 1 },
      { code: 2, label: 'A la limite', score: 2 },
      { code: 3, label: 'Légèrement malade', score: 3 },
      { code: 4, label: 'Modérément malade', score: 4 },
      { code: 5, label: 'Manifestement malade', score: 5 },
      { code: 6, label: 'Gravement malade', score: 6 },
      { code: 7, label: 'Parmi les patients les plus malades', score: 7 }
    ]
  },
  
  // CGI - 2ème partie
  {
    id: 'section_cgi_2',
    text: 'CGI - 2ème partie',
    help: 'Partie à ne compléter que dans les visites de suivi',
    type: 'section',
    required: false
  },
  {
    id: 'cgi_i',
    text: 'Amélioration globale',
    help: 'Évaluer l\'amélioration totale qu\'elle soit ou non, selon votre opinion, due entièrement au traitement médicamenteux. Comparé à son état au début du traitement, de quelle façon le patient a-t-il changé',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Non évalué', score: 0 },
      { code: 1, label: 'Très fortement amélioré', score: 1 },
      { code: 2, label: 'Fortement amélioré', score: 2 },
      { code: 3, label: 'Légèrement amélioré', score: 3 },
      { code: 4, label: 'Pas de changement', score: 4 },
      { code: 5, label: 'Légèrement aggravé', score: 5 },
      { code: 6, label: 'Fortement aggravé', score: 6 },
      { code: 7, label: 'Très fortement aggravé', score: 7 }
    ]
  },
  
  // CGI - 3ème partie (Index thérapeutique)
  {
    id: 'section_cgi_3',
    text: 'CGI - 3ème partie : Index thérapeutique',
    help: 'Evaluer cet item uniquement en fonction de l\'effet du médicament. Choisissez les termes qui décrivent le mieux les degrés d\'efficacité thérapeutique et d\'effets secondaires.',
    type: 'section',
    required: false
  },
  {
    id: 'therapeutic_effect',
    text: 'Effet thérapeutique',
    help: 'Important = amélioration marquée : disparition complète ou presque complète de tous les symptômes. Modéré = amélioration nette : disparition partielle des symptômes. Minime = très légère amélioration qui ne modifie pas le fonctionnement du patient.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Non évalué', score: 0 },
      { code: 1, label: 'Important', score: 1 },
      { code: 2, label: 'Modéré', score: 2 },
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
      { code: 1, label: 'N\'interfèrent pas significativement avec le fonctionnement du patient', score: 1 },
      { code: 2, label: 'Interfèrent significativement avec le fonctionnement du patient', score: 2 },
      { code: 3, label: 'Dépassent l\'effet thérapeutique', score: 3 }
    ]
  }
];

export const CGI_DEFINITION: QuestionnaireDefinition = {
  id: 'cgi',
  code: 'CGI',
  title: 'Clinical Global Impression (CGI)',
  description: 'Clinical Global Impression - Échelle d\'évaluation de la gravité de la maladie et de l\'amélioration globale.',
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
    display_if: { 
      'and': [
        { '==': [{ 'var': 'answers.q1' }, 1] },
        { '!=': [{ 'var': 'answers.q1b' }, 1] }
      ]
    },
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
    display_if: { 
      'and': [
        { '==': [{ 'var': 'answers.q1' }, 1] },
        { '!=': [{ 'var': 'answers.q1a' }, 1] }
      ]
    },
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
    display_if: { 
      'and': [
        { '==': [{ 'var': 'answers.q3' }, 1] },
        { '!=': [{ 'var': 'answers.q3b' }, 1] }
      ]
    },
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
    display_if: { 
      'and': [
        { '==': [{ 'var': 'answers.q3' }, 1] },
        { '!=': [{ 'var': 'answers.q3a' }, 1] }
      ]
    },
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
// Returns TWO questions: main symptom with adult question, then indented childhood question
const createADHDSymptom = (id: string, text: string): Question[] => [
  {
    id: `${id}_adult`,
    text: `${text}\nPrésent à l'âge adulte`,
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: `${id}_childhood`,
    text: 'Présent dans l\'enfance',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  }
];

export const DIVA_QUESTIONS: Question[] = [
  // Criterion A - Inattention
  {
    id: 'section_inattention',
    text: 'Critère A - Déficit de l\'Attention',
    type: 'section',
    required: false
  },
  ...createADHDSymptom('a1a', 'A1. Souvent, ne parvient pas à prêter attention aux détails, ou fait des fautes d\'étourderie dans les devoirs scolaires, le travail ou d\'autres activités'),
  ...createADHDSymptom('a1b', 'A2. A souvent du mal à soutenir son attention au travail ou dans les jeux'),
  ...createADHDSymptom('a1c', 'A3. Semble souvent ne pas écouter quand on lui parle personnellement'),
  ...createADHDSymptom('a1d', 'A4. Souvent, ne se conforme pas aux consignes et ne parvient pas à mener à terme ses devoirs scolaires, ses tâches domestiques ou ses obligations professionnelles'),
  ...createADHDSymptom('a1e', 'A5. A souvent du mal à organiser ses travaux ou ses activités'),
  ...createADHDSymptom('a1f', 'A6. Souvent, évite, a en aversion, ou fait à contrecoeur les tâches qui nécessitent un effort mental soutenu'),
  ...createADHDSymptom('a1g', 'A7. Perd souvent les objets nécessaires à son travail ou à ses activités'),
  ...createADHDSymptom('a1h', 'A8. Souvent, se laisse facilement distraire par des stimuli externes'),
  ...createADHDSymptom('a1i', 'A9. A des oublis fréquents dans la vie quotidienne'),
  
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
  ...createADHDSymptom('a2a', 'H/I 1. Remue souvent les mains ou les pieds, ou se tortille sur son siège'),
  ...createADHDSymptom('a2b', 'H/I 2. Se lève souvent en classe ou dans d\'autres situations où il est supposé rester assis'),
  ...createADHDSymptom('a2c', 'H/I 3. Souvent, court ou grimpe partout, dans des situations où cela est inapproprié (sentiment subjectif d\'impatience chez l\'adulte)'),
  ...createADHDSymptom('a2d', 'H/I 4. A souvent du mal à se tenir tranquille dans les jeux ou les activités de loisir'),
  ...createADHDSymptom('a2e', 'H/I 5. Est souvent « sur la brèche » ou agit souvent comme s\'il était « monté sur ressorts »'),
  ...createADHDSymptom('a2f', 'H/I 6. Parle souvent trop'),
  ...createADHDSymptom('a2g', 'H/I 7. Laisse souvent échapper la réponse à une question qui n\'est pas encore entièrement posée'),
  ...createADHDSymptom('a2h', 'H/I 8. A souvent du mal à attendre son tour'),
  ...createADHDSymptom('a2i', 'H/I 9. Interrompt souvent les autres ou impose sa présence'),
  
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
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'criteria_hi_hyperactivity_child_gte6',
    text: 'Enfance: Le nombre de symptômes du critère H/I (hyperactivité/impulsivité) est-il >= 6 ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
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
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'criteria_hi_hyperactivity_adult_gte6',
    text: 'Age Adulte: Le nombre de symptômes du critère H/I (hyperactivité/impulsivité) est-il >= 6 (ou >= 4 selon recherches) ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
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
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'criteria_cd_impairment_childhood',
    text: 'Critères C et D: Présence de symptômes et d\'une altération du fonctionnement dans au moins deux types différents d\'environnement dans l\'enfance ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'criteria_cd_impairment_adult',
    text: 'Critères C et D: Présence de symptômes et d\'une altération du fonctionnement dans au moins deux types différents d\'environnement à l\'âge adulte ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
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
// FAMILY HISTORY (Antécédents Familiaux)
// Section 1 - Enfants (Children Only)
// ============================================================================

export const FAMILY_HISTORY_QUESTIONS: Question[] = [
  // ========================================================================
  // SECTION 1 - CHILDREN (Enfants)
  // ========================================================================
  
  {
    id: 'section_children',
    text: 'Section 1 - Enfants',
    type: 'section',
    required: false
  },
  
  // ========================================================================
  // DAUGHTERS (Filles)
  // ========================================================================
  
  {
    id: 'num_daughters',
    text: 'Q1. Nombre de filles',
    type: 'single_choice',
    required: true,
    options: [
      { code: '0', label: 'Aucune' },
      { code: '1', label: '1' },
      { code: '2', label: '2' },
      { code: '3', label: '3' },
      { code: '4', label: '4' },
      { code: '5', label: '5' },
      { code: '>5', label: '>5' }
    ]
  },
  
  {
    id: 'num_daughters_with_issues',
    text: 'Q1.1. Parmi elles, veuillez indiquer combien présentent un trouble psychiatrique, un abus ou une dépendance à une substance, un antécédent de tentative de suicide ou un facteur de risque cardio-vasculaire',
    type: 'single_choice',
    required: false,
    display_if: {
      and: [
        { '!=': [{ var: 'num_daughters' }, null] },
        { '!=': [{ var: 'num_daughters' }, '0'] }
      ]
    },
    options: [
      { code: 0, label: 'Aucune', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4', score: 4 },
      { code: 5, label: '5', score: 5 }
    ]
  },
  
  // Daughter 1
  {
    id: 'daughter1_dob',
    text: 'Fille 1 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 1] }
  },
  {
    id: 'daughter1_deceased',
    text: 'Fille 1 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 1] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'daughter1_death_date',
    text: 'Fille 1 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_daughters_with_issues' }, 1] },
        { '==': [{ var: 'daughter1_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'daughter1_death_cause',
    text: 'Fille 1 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_daughters_with_issues' }, 1] },
        { '==': [{ var: 'daughter1_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'daughter1_psychiatric',
    text: 'Fille 1 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 1] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter1_suicide',
    text: 'Fille 1 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 1] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter1_substance',
    text: 'Fille 1 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 1] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'daughter1_anxiety',
    text: 'Fille 1 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 1] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter1_dementia',
    text: 'Fille 1 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 1] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter1_cardio',
    text: 'Fille 1 - Votre fille a-t-elle des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 1] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // Daughter 2
  {
    id: 'daughter2_dob',
    text: 'Fille 2 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 2] }
  },
  {
    id: 'daughter2_deceased',
    text: 'Fille 2 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 2] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'daughter2_death_date',
    text: 'Fille 2 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_daughters_with_issues' }, 2] },
        { '==': [{ var: 'daughter2_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'daughter2_death_cause',
    text: 'Fille 2 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_daughters_with_issues' }, 2] },
        { '==': [{ var: 'daughter2_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'daughter2_psychiatric',
    text: 'Fille 2 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 2] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter2_suicide',
    text: 'Fille 2 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 2] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter2_substance',
    text: 'Fille 2 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 2] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'daughter2_anxiety',
    text: 'Fille 2 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 2] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter2_dementia',
    text: 'Fille 2 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 2] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter2_cardio',
    text: 'Fille 2 - Votre fille a-t-elle des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 2] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // Daughter 3
  {
    id: 'daughter3_dob',
    text: 'Fille 3 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 3] }
  },
  {
    id: 'daughter3_deceased',
    text: 'Fille 3 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 3] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'daughter3_death_date',
    text: 'Fille 3 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_daughters_with_issues' }, 3] },
        { '==': [{ var: 'daughter3_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'daughter3_death_cause',
    text: 'Fille 3 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_daughters_with_issues' }, 3] },
        { '==': [{ var: 'daughter3_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'daughter3_psychiatric',
    text: 'Fille 3 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 3] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter3_suicide',
    text: 'Fille 3 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 3] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter3_substance',
    text: 'Fille 3 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 3] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'daughter3_anxiety',
    text: 'Fille 3 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 3] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter3_dementia',
    text: 'Fille 3 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 3] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter3_cardio',
    text: 'Fille 3 - Votre fille a-t-elle des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 3] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // Daughter 4
  {
    id: 'daughter4_dob',
    text: 'Fille 4 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 4] }
  },
  {
    id: 'daughter4_deceased',
    text: 'Fille 4 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 4] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'daughter4_death_date',
    text: 'Fille 4 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_daughters_with_issues' }, 4] },
        { '==': [{ var: 'daughter4_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'daughter4_death_cause',
    text: 'Fille 4 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_daughters_with_issues' }, 4] },
        { '==': [{ var: 'daughter4_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'daughter4_psychiatric',
    text: 'Fille 4 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 4] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter4_suicide',
    text: 'Fille 4 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 4] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter4_substance',
    text: 'Fille 4 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 4] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'daughter4_anxiety',
    text: 'Fille 4 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 4] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter4_dementia',
    text: 'Fille 4 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 4] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter4_cardio',
    text: 'Fille 4 - Votre fille a-t-elle des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 4] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // Daughter 5
  {
    id: 'daughter5_dob',
    text: 'Fille 5 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 5] }
  },
  {
    id: 'daughter5_deceased',
    text: 'Fille 5 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 5] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'daughter5_death_date',
    text: 'Fille 5 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_daughters_with_issues' }, 5] },
        { '==': [{ var: 'daughter5_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'daughter5_death_cause',
    text: 'Fille 5 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_daughters_with_issues' }, 5] },
        { '==': [{ var: 'daughter5_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'daughter5_psychiatric',
    text: 'Fille 5 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 5] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter5_suicide',
    text: 'Fille 5 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 5] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter5_substance',
    text: 'Fille 5 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 5] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'daughter5_anxiety',
    text: 'Fille 5 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 5] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter5_dementia',
    text: 'Fille 5 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 5] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'daughter5_cardio',
    text: 'Fille 5 - Votre fille a-t-elle des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_daughters_with_issues' }, 5] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // ========================================================================
  // SONS (Fils)
  // ========================================================================
  
  {
    id: 'num_sons',
    text: 'Q2. Nombre de fils',
    type: 'single_choice',
    required: true,
    options: [
      { code: '0', label: 'Aucun' },
      { code: '1', label: '1' },
      { code: '2', label: '2' },
      { code: '3', label: '3' },
      { code: '4', label: '4' },
      { code: '5', label: '5' },
      { code: '>5', label: '>5' }
    ]
  },
  
  {
    id: 'num_sons_with_issues',
    text: 'Q2.1. Parmi eux, veuillez indiquer combien présentent un trouble psychiatrique, un abus ou une dépendance à une substance, un antécédent de tentative de suicide ou un facteur de risque cardio-vasculaire',
    type: 'single_choice',
    required: false,
    display_if: {
      and: [
        { '!=': [{ var: 'num_sons' }, null] },
        { '!=': [{ var: 'num_sons' }, '0'] }
      ]
    },
    options: [
      { code: 0, label: 'Aucun', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4', score: 4 },
      { code: 5, label: '5', score: 5 }
    ]
  },
  
  // Son 1
  {
    id: 'son1_dob',
    text: 'Fils 1 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 1] }
  },
  {
    id: 'son1_deceased',
    text: 'Fils 1 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 1] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'son1_death_date',
    text: 'Fils 1 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sons_with_issues' }, 1] },
        { '==': [{ var: 'son1_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'son1_death_cause',
    text: 'Fils 1 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sons_with_issues' }, 1] },
        { '==': [{ var: 'son1_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'son1_psychiatric',
    text: 'Fils 1 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 1] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son1_suicide',
    text: 'Fils 1 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 1] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son1_substance',
    text: 'Fils 1 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 1] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'son1_anxiety',
    text: 'Fils 1 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 1] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son1_dementia',
    text: 'Fils 1 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 1] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son1_cardio',
    text: 'Fils 1 - Votre fils a-t-il des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 1] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // Son 2
  {
    id: 'son2_dob',
    text: 'Fils 2 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 2] }
  },
  {
    id: 'son2_deceased',
    text: 'Fils 2 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 2] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'son2_death_date',
    text: 'Fils 2 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sons_with_issues' }, 2] },
        { '==': [{ var: 'son2_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'son2_death_cause',
    text: 'Fils 2 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sons_with_issues' }, 2] },
        { '==': [{ var: 'son2_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'son2_psychiatric',
    text: 'Fils 2 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 2] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son2_suicide',
    text: 'Fils 2 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 2] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son2_substance',
    text: 'Fils 2 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 2] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'son2_anxiety',
    text: 'Fils 2 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 2] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son2_dementia',
    text: 'Fils 2 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 2] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son2_cardio',
    text: 'Fils 2 - Votre fils a-t-il des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 2] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // Son 3
  {
    id: 'son3_dob',
    text: 'Fils 3 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 3] }
  },
  {
    id: 'son3_deceased',
    text: 'Fils 3 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 3] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'son3_death_date',
    text: 'Fils 3 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sons_with_issues' }, 3] },
        { '==': [{ var: 'son3_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'son3_death_cause',
    text: 'Fils 3 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sons_with_issues' }, 3] },
        { '==': [{ var: 'son3_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'son3_psychiatric',
    text: 'Fils 3 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 3] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son3_suicide',
    text: 'Fils 3 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 3] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son3_substance',
    text: 'Fils 3 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 3] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'son3_anxiety',
    text: 'Fils 3 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 3] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son3_dementia',
    text: 'Fils 3 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 3] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son3_cardio',
    text: 'Fils 3 - Votre fils a-t-il des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 3] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // Son 4
  {
    id: 'son4_dob',
    text: 'Fils 4 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 4] }
  },
  {
    id: 'son4_deceased',
    text: 'Fils 4 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 4] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'son4_death_date',
    text: 'Fils 4 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sons_with_issues' }, 4] },
        { '==': [{ var: 'son4_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'son4_death_cause',
    text: 'Fils 4 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sons_with_issues' }, 4] },
        { '==': [{ var: 'son4_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'son4_psychiatric',
    text: 'Fils 4 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 4] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son4_suicide',
    text: 'Fils 4 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 4] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son4_substance',
    text: 'Fils 4 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 4] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'son4_anxiety',
    text: 'Fils 4 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 4] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son4_dementia',
    text: 'Fils 4 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 4] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son4_cardio',
    text: 'Fils 4 - Votre fils a-t-il des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 4] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // Son 5
  {
    id: 'son5_dob',
    text: 'Fils 5 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 5] }
  },
  {
    id: 'son5_deceased',
    text: 'Fils 5 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 5] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'son5_death_date',
    text: 'Fils 5 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sons_with_issues' }, 5] },
        { '==': [{ var: 'son5_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'son5_death_cause',
    text: 'Fils 5 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sons_with_issues' }, 5] },
        { '==': [{ var: 'son5_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'son5_psychiatric',
    text: 'Fils 5 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 5] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son5_suicide',
    text: 'Fils 5 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 5] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son5_substance',
    text: 'Fils 5 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 5] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'son5_anxiety',
    text: 'Fils 5 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 5] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son5_dementia',
    text: 'Fils 5 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 5] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'son5_cardio',
    text: 'Fils 5 - Votre fils a-t-il des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sons_with_issues' }, 5] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // ========================================================================
  // SECTION 2 - SIBLINGS (Frères et Soeurs)
  // ========================================================================
  
  {
    id: 'section_siblings',
    text: 'Section 2 - Frères et Soeurs',
    type: 'section',
    required: false
  },
  
  // ========================================================================
  // SISTERS (Soeurs)
  // ========================================================================
  
  {
    id: 'num_sisters',
    text: 'Q3. Nombre de soeurs',
    type: 'single_choice',
    required: true,
    options: [
      { code: '0', label: 'Aucune' },
      { code: '1', label: '1' },
      { code: '2', label: '2' },
      { code: '3', label: '3' },
      { code: '4', label: '4' },
      { code: '5', label: '5' },
      { code: '>5', label: '>5' }
    ]
  },
  
  {
    id: 'num_sisters_with_issues',
    text: 'Q3.1. Parmi elles, veuillez indiquer combien présentent un trouble psychiatrique, un abus ou une dépendance à une substance, un antécédent de tentative de suicide ou un facteur de risque cardio-vasculaire',
    type: 'single_choice',
    required: false,
    display_if: {
      and: [
        { '!=': [{ var: 'num_sisters' }, null] },
        { '!=': [{ var: 'num_sisters' }, '0'] }
      ]
    },
    options: [
      { code: 0, label: 'Aucune', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4', score: 4 },
      { code: 5, label: '5', score: 5 }
    ]
  },
  
  // Sister 1
  {
    id: 'sister1_dob',
    text: 'Soeur 1 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 1] }
  },
  {
    id: 'sister1_deceased',
    text: 'Soeur 1 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 1] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'sister1_death_date',
    text: 'Soeur 1 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sisters_with_issues' }, 1] },
        { '==': [{ var: 'sister1_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'sister1_death_cause',
    text: 'Soeur 1 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sisters_with_issues' }, 1] },
        { '==': [{ var: 'sister1_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'sister1_psychiatric',
    text: 'Soeur 1 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 1] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister1_suicide',
    text: 'Soeur 1 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 1] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister1_substance',
    text: 'Soeur 1 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 1] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'sister1_anxiety',
    text: 'Soeur 1 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 1] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister1_dementia',
    text: 'Soeur 1 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 1] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister1_cardio',
    text: 'Soeur 1 - Votre soeur a-t-elle des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 1] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // Sister 2
  {
    id: 'sister2_dob',
    text: 'Soeur 2 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 2] }
  },
  {
    id: 'sister2_deceased',
    text: 'Soeur 2 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 2] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'sister2_death_date',
    text: 'Soeur 2 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sisters_with_issues' }, 2] },
        { '==': [{ var: 'sister2_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'sister2_death_cause',
    text: 'Soeur 2 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sisters_with_issues' }, 2] },
        { '==': [{ var: 'sister2_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'sister2_psychiatric',
    text: 'Soeur 2 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 2] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister2_suicide',
    text: 'Soeur 2 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 2] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister2_substance',
    text: 'Soeur 2 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 2] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'sister2_anxiety',
    text: 'Soeur 2 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 2] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister2_dementia',
    text: 'Soeur 2 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 2] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister2_cardio',
    text: 'Soeur 2 - Votre soeur a-t-elle des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 2] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // Sister 3
  {
    id: 'sister3_dob',
    text: 'Soeur 3 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 3] }
  },
  {
    id: 'sister3_deceased',
    text: 'Soeur 3 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 3] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'sister3_death_date',
    text: 'Soeur 3 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sisters_with_issues' }, 3] },
        { '==': [{ var: 'sister3_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'sister3_death_cause',
    text: 'Soeur 3 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sisters_with_issues' }, 3] },
        { '==': [{ var: 'sister3_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'sister3_psychiatric',
    text: 'Soeur 3 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 3] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister3_suicide',
    text: 'Soeur 3 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 3] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister3_substance',
    text: 'Soeur 3 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 3] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'sister3_anxiety',
    text: 'Soeur 3 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 3] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister3_dementia',
    text: 'Soeur 3 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 3] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister3_cardio',
    text: 'Soeur 3 - Votre soeur a-t-elle des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 3] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // Sister 4
  {
    id: 'sister4_dob',
    text: 'Soeur 4 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 4] }
  },
  {
    id: 'sister4_deceased',
    text: 'Soeur 4 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 4] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'sister4_death_date',
    text: 'Soeur 4 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sisters_with_issues' }, 4] },
        { '==': [{ var: 'sister4_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'sister4_death_cause',
    text: 'Soeur 4 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sisters_with_issues' }, 4] },
        { '==': [{ var: 'sister4_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'sister4_psychiatric',
    text: 'Soeur 4 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 4] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister4_suicide',
    text: 'Soeur 4 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 4] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister4_substance',
    text: 'Soeur 4 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 4] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'sister4_anxiety',
    text: 'Soeur 4 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 4] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister4_dementia',
    text: 'Soeur 4 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 4] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister4_cardio',
    text: 'Soeur 4 - Votre soeur a-t-elle des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 4] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // Sister 5
  {
    id: 'sister5_dob',
    text: 'Soeur 5 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 5] }
  },
  {
    id: 'sister5_deceased',
    text: 'Soeur 5 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 5] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'sister5_death_date',
    text: 'Soeur 5 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sisters_with_issues' }, 5] },
        { '==': [{ var: 'sister5_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'sister5_death_cause',
    text: 'Soeur 5 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_sisters_with_issues' }, 5] },
        { '==': [{ var: 'sister5_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'sister5_psychiatric',
    text: 'Soeur 5 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 5] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister5_suicide',
    text: 'Soeur 5 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 5] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister5_substance',
    text: 'Soeur 5 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 5] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'sister5_anxiety',
    text: 'Soeur 5 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 5] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister5_dementia',
    text: 'Soeur 5 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 5] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'sister5_cardio',
    text: 'Soeur 5 - Votre soeur a-t-elle des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_sisters_with_issues' }, 5] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // ========================================================================
  // BROTHERS (Frères)
  // ========================================================================
  
  {
    id: 'num_brothers',
    text: 'Q4. Nombre de frères',
    type: 'single_choice',
    required: true,
    options: [
      { code: '0', label: 'Aucun' },
      { code: '1', label: '1' },
      { code: '2', label: '2' },
      { code: '3', label: '3' },
      { code: '4', label: '4' },
      { code: '5', label: '5' },
      { code: '>5', label: '>5' }
    ]
  },
  
  {
    id: 'num_brothers_with_issues',
    text: 'Q4.1. Parmi eux, veuillez indiquer combien présentent un trouble psychiatrique, un abus ou une dépendance à une substance, un antécédent de tentative de suicide ou un facteur de risque cardio-vasculaire',
    type: 'single_choice',
    required: false,
    display_if: {
      and: [
        { '!=': [{ var: 'num_brothers' }, null] },
        { '!=': [{ var: 'num_brothers' }, '0'] }
      ]
    },
    options: [
      { code: 0, label: 'Aucun', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4', score: 4 },
      { code: 5, label: '5', score: 5 }
    ]
  },
  
  // Brother 1
  {
    id: 'brother1_dob',
    text: 'Frère 1 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 1] }
  },
  {
    id: 'brother1_deceased',
    text: 'Frère 1 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 1] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'brother1_death_date',
    text: 'Frère 1 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_brothers_with_issues' }, 1] },
        { '==': [{ var: 'brother1_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'brother1_death_cause',
    text: 'Frère 1 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_brothers_with_issues' }, 1] },
        { '==': [{ var: 'brother1_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'brother1_psychiatric',
    text: 'Frère 1 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 1] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother1_suicide',
    text: 'Frère 1 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 1] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother1_substance',
    text: 'Frère 1 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 1] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'brother1_anxiety',
    text: 'Frère 1 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 1] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother1_dementia',
    text: 'Frère 1 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 1] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother1_cardio',
    text: 'Frère 1 - Votre frère a-t-il des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 1] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // Brother 2
  {
    id: 'brother2_dob',
    text: 'Frère 2 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 2] }
  },
  {
    id: 'brother2_deceased',
    text: 'Frère 2 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 2] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'brother2_death_date',
    text: 'Frère 2 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_brothers_with_issues' }, 2] },
        { '==': [{ var: 'brother2_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'brother2_death_cause',
    text: 'Frère 2 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_brothers_with_issues' }, 2] },
        { '==': [{ var: 'brother2_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'brother2_psychiatric',
    text: 'Frère 2 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 2] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother2_suicide',
    text: 'Frère 2 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 2] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother2_substance',
    text: 'Frère 2 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 2] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'brother2_anxiety',
    text: 'Frère 2 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 2] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother2_dementia',
    text: 'Frère 2 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 2] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother2_cardio',
    text: 'Frère 2 - Votre frère a-t-il des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 2] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // Brother 3
  {
    id: 'brother3_dob',
    text: 'Frère 3 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 3] }
  },
  {
    id: 'brother3_deceased',
    text: 'Frère 3 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 3] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'brother3_death_date',
    text: 'Frère 3 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_brothers_with_issues' }, 3] },
        { '==': [{ var: 'brother3_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'brother3_death_cause',
    text: 'Frère 3 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_brothers_with_issues' }, 3] },
        { '==': [{ var: 'brother3_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'brother3_psychiatric',
    text: 'Frère 3 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 3] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother3_suicide',
    text: 'Frère 3 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 3] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother3_substance',
    text: 'Frère 3 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 3] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'brother3_anxiety',
    text: 'Frère 3 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 3] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother3_dementia',
    text: 'Frère 3 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 3] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother3_cardio',
    text: 'Frère 3 - Votre frère a-t-il des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 3] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // Brother 4
  {
    id: 'brother4_dob',
    text: 'Frère 4 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 4] }
  },
  {
    id: 'brother4_deceased',
    text: 'Frère 4 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 4] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'brother4_death_date',
    text: 'Frère 4 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_brothers_with_issues' }, 4] },
        { '==': [{ var: 'brother4_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'brother4_death_cause',
    text: 'Frère 4 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_brothers_with_issues' }, 4] },
        { '==': [{ var: 'brother4_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'brother4_psychiatric',
    text: 'Frère 4 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 4] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother4_suicide',
    text: 'Frère 4 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 4] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother4_substance',
    text: 'Frère 4 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 4] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'brother4_anxiety',
    text: 'Frère 4 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 4] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother4_dementia',
    text: 'Frère 4 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 4] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother4_cardio',
    text: 'Frère 4 - Votre frère a-t-il des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 4] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // Brother 5
  {
    id: 'brother5_dob',
    text: 'Frère 5 - Date de naissance',
    type: 'date',
    required: false,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 5] }
  },
  {
    id: 'brother5_deceased',
    text: 'Frère 5 - Décès',
    type: 'single_choice',
    required: false,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 5] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'brother5_death_date',
    text: 'Frère 5 - Date du décès',
    type: 'date',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_brothers_with_issues' }, 5] },
        { '==': [{ var: 'brother5_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'brother5_death_cause',
    text: 'Frère 5 - Cause du décès',
    type: 'text',
    required: false,
    display_if: {
      and: [
        { '>=': [{ var: 'num_brothers_with_issues' }, 5] },
        { '==': [{ var: 'brother5_deceased' }, 'oui'] }
      ]
    }
  },
  {
    id: 'brother5_psychiatric',
    text: 'Frère 5 - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 5] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother5_suicide',
    text: 'Frère 5 - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 5] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother5_substance',
    text: 'Frère 5 - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 5] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'brother5_anxiety',
    text: 'Frère 5 - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 5] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother5_dementia',
    text: 'Frère 5 - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 5] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'brother5_cardio',
    text: 'Frère 5 - Votre frère a-t-il des facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '>=': [{ var: 'num_brothers_with_issues' }, 5] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // ========================================================================
  // SECTION 3 - PARENTS (Mère et Père)
  // ========================================================================
  
  {
    id: 'section_parents',
    text: 'Section 3 - Parents',
    type: 'section',
    required: false
  },
  
  // ========================================================================
  // MOTHER (Mère)
  // ========================================================================
  
  {
    id: 'mother_history',
    text: 'Q5. Mère',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  {
    id: 'mother_deceased',
    text: 'Q6. Mère - Décès',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  {
    id: 'mother_death_cause',
    text: 'Q6.1. Mère - Cause du décès',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'mother_deceased' }, 'oui'] }
  },
  {
    id: 'mother_psychiatric',
    text: 'Mère - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'mother_history' }, 'oui'] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'mother_suicide',
    text: 'Mère - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'mother_history' }, 'oui'] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'mother_substance',
    text: 'Mère - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'mother_history' }, 'oui'] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'mother_anxiety',
    text: 'Mère - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'mother_history' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'mother_dementia',
    text: 'Mère - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'mother_history' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'mother_cardio',
    text: 'Mère - Facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'mother_history' }, 'oui'] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // ========================================================================
  // FATHER (Père)
  // ========================================================================
  
  {
    id: 'father_history',
    text: 'Q7. Père',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  {
    id: 'father_deceased',
    text: 'Q8. Père - Décès',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  {
    id: 'father_death_cause',
    text: 'Q8.1. Père - Cause du décès',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'father_deceased' }, 'oui'] }
  },
  {
    id: 'father_psychiatric',
    text: 'Père - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'father_history' }, 'oui'] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'father_suicide',
    text: 'Père - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'father_history' }, 'oui'] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'father_substance',
    text: 'Père - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'father_history' }, 'oui'] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'father_anxiety',
    text: 'Père - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'father_history' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'father_dementia',
    text: 'Père - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'father_history' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'father_cardio',
    text: 'Père - Facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'father_history' }, 'oui'] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // ========================================================================
  // SECTION 4 - GRANDPARENTS (Grands-Parents)
  // ========================================================================
  
  {
    id: 'section_grandparents',
    text: 'Section 4 - Grands-Parents',
    type: 'section',
    required: false
  },
  
  // ========================================================================
  // MATERNAL GRANDMOTHER (Grand-mère maternelle)
  // ========================================================================
  
  {
    id: 'grandmother_maternal_history',
    text: 'Q9. Grand-mère maternelle',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  {
    id: 'grandmother_maternal_deceased',
    text: 'Q10. Grand-mère maternelle - Décès',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  {
    id: 'grandmother_maternal_death_cause',
    text: 'Q10.1. Grand-mère maternelle - Cause du décès',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'grandmother_maternal_deceased' }, 'oui'] }
  },
  {
    id: 'grandmother_maternal_psychiatric',
    text: 'Grand-mère maternelle - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandmother_maternal_history' }, 'oui'] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'grandmother_maternal_suicide',
    text: 'Grand-mère maternelle - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandmother_maternal_history' }, 'oui'] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'grandmother_maternal_substance',
    text: 'Grand-mère maternelle - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandmother_maternal_history' }, 'oui'] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'grandmother_maternal_anxiety',
    text: 'Grand-mère maternelle - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandmother_maternal_history' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'grandmother_maternal_dementia',
    text: 'Grand-mère maternelle - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandmother_maternal_history' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'grandmother_maternal_cardio',
    text: 'Grand-mère maternelle - Facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandmother_maternal_history' }, 'oui'] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // ========================================================================
  // MATERNAL GRANDFATHER (Grand-père maternel)
  // ========================================================================
  
  {
    id: 'grandfather_maternal_history',
    text: 'Q11. Grand-père maternel',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  {
    id: 'grandfather_maternal_deceased',
    text: 'Q12. Grand-père maternel - Décès',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  {
    id: 'grandfather_maternal_death_cause',
    text: 'Q12.1. Grand-père maternel - Cause du décès',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'grandfather_maternal_deceased' }, 'oui'] }
  },
  {
    id: 'grandfather_maternal_psychiatric',
    text: 'Grand-père maternel - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandfather_maternal_history' }, 'oui'] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'grandfather_maternal_suicide',
    text: 'Grand-père maternel - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandfather_maternal_history' }, 'oui'] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'grandfather_maternal_substance',
    text: 'Grand-père maternel - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandfather_maternal_history' }, 'oui'] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'grandfather_maternal_anxiety',
    text: 'Grand-père maternel - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandfather_maternal_history' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'grandfather_maternal_dementia',
    text: 'Grand-père maternel - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandfather_maternal_history' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'grandfather_maternal_cardio',
    text: 'Grand-père maternel - Facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandfather_maternal_history' }, 'oui'] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // ========================================================================
  // PATERNAL GRANDMOTHER (Grand-mère paternelle)
  // ========================================================================
  
  {
    id: 'grandmother_paternal_history',
    text: 'Q13. Grand-mère paternelle',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  {
    id: 'grandmother_paternal_deceased',
    text: 'Q14. Grand-mère paternelle - Décès',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  {
    id: 'grandmother_paternal_death_cause',
    text: 'Q14.1. Grand-mère paternelle - Cause du décès',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'grandmother_paternal_deceased' }, 'oui'] }
  },
  {
    id: 'grandmother_paternal_psychiatric',
    text: 'Grand-mère paternelle - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandmother_paternal_history' }, 'oui'] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'grandmother_paternal_suicide',
    text: 'Grand-mère paternelle - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandmother_paternal_history' }, 'oui'] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'grandmother_paternal_substance',
    text: 'Grand-mère paternelle - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandmother_paternal_history' }, 'oui'] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'grandmother_paternal_anxiety',
    text: 'Grand-mère paternelle - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandmother_paternal_history' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'grandmother_paternal_dementia',
    text: 'Grand-mère paternelle - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandmother_paternal_history' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'grandmother_paternal_cardio',
    text: 'Grand-mère paternelle - Facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandmother_paternal_history' }, 'oui'] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  },
  
  // ========================================================================
  // PATERNAL GRANDFATHER (Grand-père paternel)
  // ========================================================================
  
  {
    id: 'grandfather_paternal_history',
    text: 'Q15. Grand-père paternel',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  {
    id: 'grandfather_paternal_deceased',
    text: 'Q16. Grand-père paternel - Décès',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  {
    id: 'grandfather_paternal_death_cause',
    text: 'Q16.1. Grand-père paternel - Cause du décès',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'grandfather_paternal_deceased' }, 'oui'] }
  },
  {
    id: 'grandfather_paternal_psychiatric',
    text: 'Grand-père paternel - Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandfather_paternal_history' }, 'oui'] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
      { code: 'bipolaire', label: 'Bipolaire' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'grandfather_paternal_suicide',
    text: 'Grand-père paternel - Suicide',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandfather_paternal_history' }, 'oui'] },
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'tentative', label: 'Tentative de suicide' },
      { code: 'abouti', label: 'Suicide abouti' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'grandfather_paternal_substance',
    text: 'Grand-père paternel - Dépendance ou abus de substances',
    type: 'multiple_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandfather_paternal_history' }, 'oui'] },
    options: ['Aucun', 'Alcool', 'Cannabis', 'Autre substance', 'Ne sais pas']
  },
  {
    id: 'grandfather_paternal_anxiety',
    text: 'Grand-père paternel - Troubles anxieux',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandfather_paternal_history' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'grandfather_paternal_dementia',
    text: 'Grand-père paternel - Démence',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandfather_paternal_history' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'grandfather_paternal_cardio',
    text: 'Grand-père paternel - Facteurs de risques cardio-vasculaires',
    type: 'multiple_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'grandfather_paternal_history' }, 'oui'] },
    options: ['Aucun', 'Diabète', 'Obésité', 'Hyperlipidémie', 'Hypertension', 'Ne sais pas']
  }
];

export const FAMILY_HISTORY_DEFINITION: QuestionnaireDefinition = {
  id: 'family_history',
  code: 'FAMILY_HISTORY_FR',
  title: 'Antécédents Familiaux',
  description: 'Évaluation des antécédents familiaux. Section 1: Enfants. Section 2: Frères et Soeurs. Section 3: Parents. Section 4: Grands-Parents.',
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
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q2_non_specific',
    text: '2. Pensées suicidaires actives non spécifiques : Avez-vous réellement pensé à vous suicider ?',
    help: 'Si la réponse est "oui", posez les questions 3, 4 et 5.',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q3_method_no_intent',
    text: '3. Idéation suicidaire active avec la définition des méthodes (sans scénario), sans intention de passage à l\'acte : Avez-vous pensé à la manière dont vous vous y prendriez ?',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'q2_non_specific' }, 1] },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q4_intent_no_plan',
    text: '4. Idéation suicidaire active avec intention de passage à l\'acte, sans scénario précis : Avez-vous eu des pensées de ce genre et l\'intention de passer à l\'acte ?',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'q2_non_specific' }, 1] },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q5_plan_intent',
    text: '5. Idéation suicidaire active avec scénario précis et intention de passer à l\'acte : Avez-vous commencé ou fini d\'élaborer un scénario détaillé sur la manière dont vous voulez vous suicider ? Et avez-vous l\'intention de mettre ce scénario à exécution ?',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'q2_non_specific' }, 1] },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  
  // Intensity of Ideation
  {
    id: 'section_intensity',
    text: 'Intensité de l\'idéation',
    type: 'section',
    required: false,
    display_if: {
      or: [
        { '==': [{ var: 'q1_wish_dead' }, 1] },
        { '==': [{ var: 'q2_non_specific' }, 1] }
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
        { '==': [{ var: 'q1_wish_dead' }, 1] },
        { '==': [{ var: 'q2_non_specific' }, 1] }
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
        { '==': [{ var: 'q1_wish_dead' }, 1] },
        { '==': [{ var: 'q2_non_specific' }, 1] }
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
        { '==': [{ var: 'q1_wish_dead' }, 1] },
        { '==': [{ var: 'q2_non_specific' }, 1] }
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
        { '==': [{ var: 'q1_wish_dead' }, 1] },
        { '==': [{ var: 'q2_non_specific' }, 1] }
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
        { '==': [{ var: 'q1_wish_dead' }, 1] },
        { '==': [{ var: 'q2_non_specific' }, 1] }
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
        { '==': [{ var: 'q1_wish_dead' }, 1] },
        { '==': [{ var: 'q2_non_specific' }, 1] }
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
  description: 'Cette échelle doit toujours être administrée, même en cas d\'absence de tentative de suicide avérée.\n\nÉchelle évaluant les pensées, désirs et tentatives de suicide, ainsi que leur temporalité récente ou passée.',
  questions: ISA_QUESTIONS,
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
// Suicide History (Histoire des conduites suicidaires)
// ============================================================================

const SEVERITY_OPTIONS = [
  { code: 0, label: '0 - Aucune atteinte physique ou atteinte physique très légère (par ex. égratignures)', score: 0 },
  { code: 1, label: '1 - Atteinte physique légère (par ex. élocution ralentie, brûlures au premier degré, légers saignements, entorses)', score: 1 },
  { code: 2, label: '2 - Atteinte physique modérée nécessitant une prise en charge médicale (par ex. personne consciente mais somnolente, altération de la réactivité, brûlures au deuxième degré, saignement d\'un vaisseau important)', score: 2 },
  { code: 3, label: '3 - Atteinte physique grave, hospitalisation nécessaire et soins intensifs probablement nécessaires (par ex. état comateux avec réflexes intacts, brûlures au troisième degré sur moins de 20% de la surface corporelle, hémorragie importante mais sans risque vital, fractures importantes)', score: 3 },
  { code: 4, label: '4 - Atteinte physique très grave, hospitalisation et soins intensifs nécessaires (par ex. état comateux avec absence de réflexes, brûlures au troisième degré sur plus de 20% de la surface corporelle, hémorragie importante associée à une instabilité des signes vitaux, atteinte majeure d\'un organe vital)', score: 4 },
  { code: 5, label: '5 - Décès', score: 5 }
];

export const SUICIDE_HISTORY_QUESTIONS: Question[] = [
  {
    id: 'q1_first_attempt_date',
    text: 'Q1. Date de la première tentative de suicide',
    type: 'date',
    required: false
  },
  {
    id: 'q2_attempt_count',
    text: 'Q2. Combien de fois avez-vous tenté de vous suicider ?',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'q3_violent_attempts',
    text: 'Q3. Existe-t-il des TS violentes (arme à feu, immolation, noyade, saut, pendaison, autre) ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui', score: 1 },
      { code: 'no', label: 'Non', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q3_1_violent_count',
    text: 'Q3.1. Nombre de tentatives de suicide violentes',
    type: 'number',
    required: false,
    min: 0,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_violent_attempts' }, 'yes'] }
  },
  {
    id: 'q4_serious_attempts',
    text: 'Q4. Existe-t-il des tentatives de suicide graves (passage en réanimation) non violentes (médicamenteuses, phlébotomie) ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui', score: 1 },
      { code: 'no', label: 'Non', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q4_1_serious_count',
    text: 'Q4.1. Nombre de tentatives de suicide graves',
    type: 'number',
    required: false,
    min: 0,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q4_serious_attempts' }, 'yes'] }
  },
  {
    id: 'q5_self_harm',
    text: 'Q5. Le sujet a-t-il eu un comportement auto-agressif non suicidaire ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q6_interrupted',
    text: 'Q6. Tentative interrompue : Interruption (par des facteurs extérieurs) de la mise en oeuvre par la personne d\'un acte potentiellement auto-agressif (sinon, une tentative avérée aurait eu lieu). Surdosage : la personne a des comprimés dans la main, mais quelqu\'un l\'empêche de les avaler. Si elle ingère un ou plusieurs comprimés, il s\'agit d\'une tentative avérée plutôt que d\'une tentative interrompue. Arme à feu : la personne pointe une arme vers elle, mais l\'arme lui est reprise par quelqu\'un ou quelque chose l\'empêche d\'appuyer sur la gâchette. Si elle appuie sur la gâchette et même si le coup ne part pas, il s\'agit d\'une tentative avérée. Saut dans le vide : la personne s\'apprête à sauter, mais quelqu\'un la retient et l\'éloigne du bord. Pendaison : la personne a une corde autour du cou mais ne s\'est pas encore pendue car quelqu\'un l\'en empêche.\n\nVous est-il arrivé de commencer à faire quelque chose pour tenter de mettre fin à vos jours, mais d\'en être empêché(e) par quelqu\'un ou quelque chose avant de véritablement passer à l\'acte ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q6_1_interrupted_count',
    text: 'Q6.1. Nombre total de tentatives interrompues',
    type: 'number',
    required: false,
    min: 0,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q6_interrupted' }, 1] }
  },
  {
    id: 'q7_aborted',
    text: 'Q7. Tentative avortée : La personne se prépare à se suicider, mais s\'interrompt d\'elle-même avant d\'avoir réellement eu un comportement autodestructeur. Les exemples sont similaires à ceux illustrant une tentative interrompue, si ce n\'est qu\'ici la personne interrompt d\'elle-même sa tentative au lieu d\'être interrompue par un facteur extérieur.\n\nVous est-il arrivé de commencer à faire quelque chose pour tenter de mettre fin à vos jours, mais de vous arrêter de vous-même avant de véritablement passer à l\'acte ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q7_1_aborted_count',
    text: 'Q7.1. Nombre total de tentatives avortées',
    type: 'number',
    required: false,
    min: 0,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q7_aborted' }, 1] }
  },
  {
    id: 'q8_preparations',
    text: 'Q8. Préparatifs : Actes ou préparatifs en vue d\'une tentative de suicide imminente. Il peut s\'agir de tout ce qui dépasse le stade de la verbalisation ou de la pensée, comme l\'élaboration d\'une méthode spécifique (par ex. se procurer des comprimés ou une arme à feu) ou la prise de dispositions en vue de son suicide (par ex. dons d\'objets, rédaction d\'une lettre d\'adieu).\n\nAvez-vous pris certaines mesures pour faire une tentative de suicide ou pour préparer votre suicide (par ex. rassembler des comprimés, vous procurer une arme à feu, donner vos objets de valeur ou écrire une lettre d\'adieu) ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q9_recent_severity',
    text: 'Q9. Tentative la plus récente',
    type: 'single_choice',
    required: false,
    options: SEVERITY_OPTIONS
  },
  {
    id: 'q10_recent_date',
    text: 'Q10. Date de la tentative la plus récente',
    type: 'date',
    required: false
  },
  {
    id: 'q11_lethal_severity',
    text: 'Q11. Tentative la plus létale',
    type: 'single_choice',
    required: false,
    options: SEVERITY_OPTIONS
  },
  {
    id: 'q12_lethal_date',
    text: 'Q12. Date de la tentative la plus létale',
    type: 'date',
    required: false
  },
  {
    id: 'q13_first_severity',
    text: 'Q13. Première tentative',
    type: 'single_choice',
    required: false,
    options: SEVERITY_OPTIONS
  },
  {
    id: 'q13_1_first_lethality',
    text: 'Q13.1. La Première tentative',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q13_first_severity' }, 0] },
    options: [
      { code: 0, label: '0 - Comportement peu enclin à engendrer des blessures', score: 0 },
      { code: 1, label: '1 - Comportement susceptible d\'engendrer des blessures mais ne pouvant causer la mort', score: 1 },
      { code: 2, label: '2 - Comportement susceptible de causer la mort malgré des soins médicaux disponibles', score: 2 }
    ]
  }
];

export const SUICIDE_HISTORY_DEFINITION: QuestionnaireDefinition = {
  id: 'suicide_history',
  code: 'SUICIDE_HISTORY_FR',
  title: 'Histoire des conduites suicidaires',
  description: 'Évaluation de l\'historique des tentatives de suicide, incluant les dates, le nombre de tentatives, les types de tentatives (violentes, graves, interrompues, avortées) et leur gravité.',
  questions: SUICIDE_HISTORY_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Périnatalité (Perinatal History)
// ============================================================================

export const PERINATALITE_QUESTIONS: Question[] = [
  {
    id: 'q1_mother_age',
    text: 'Âge de la mère à la naissance (en années)',
    type: 'number',
    required: false,
    min: 10,
    max: 60
  },
  {
    id: 'q2_father_age',
    text: 'Âge du père à la naissance (en années)',
    type: 'number',
    required: false,
    min: 10,
    max: 80
  },
  {
    id: 'q3_birth_condition',
    text: 'Naissance',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'premature', label: 'Prématurité', score: 0 },
      { code: 'term', label: 'Né à terme', score: 0 },
      { code: 'post_mature', label: 'Post-maturité', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q4_gestational_age',
    text: 'Âge gestationnel (en semaines d\'aménorrhée révolues)',
    type: 'number',
    required: false,
    min: 22,
    max: 45
  },
  {
    id: 'q5_birth_type',
    text: 'Type de naissance',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'vaginal', label: 'Voie basse', score: 0 },
      { code: 'cesarean', label: 'Césarienne', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q6_birth_weight',
    text: 'Poids de naissance (en grammes)',
    type: 'number',
    required: false,
    min: 300,
    max: 6000
  },
  {
    id: 'q7_birth_length',
    text: 'Taille de naissance (cm)',
    type: 'number',
    required: false,
    min: 30,
    max: 65
  },
  {
    id: 'q8_head_circumference',
    text: 'Périmètre crânien (cm)',
    type: 'number',
    required: false,
    min: 25,
    max: 45
  },
  {
    id: 'q9_apgar_1min',
    text: 'Score d\'Apgar à 1 minute',
    type: 'number',
    required: false,
    min: 0,
    max: 10
  },
  {
    id: 'q10_apgar_5min',
    text: 'Score d\'Apgar à 5 minutes',
    type: 'number',
    required: false,
    min: 0,
    max: 10
  },
  {
    id: 'q11_neonatal_hospitalization',
    text: 'Hospitalisation en néonatologie',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui', score: 1 },
      { code: 'no', label: 'Non', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  }
];

export const PERINATALITE_DEFINITION: QuestionnaireDefinition = {
  id: 'perinatalite',
  code: 'PERINATALITE_FR',
  title: 'Périnatalité',
  description: 'Recueil des informations périnatales et des conditions de naissance du patient.',
  questions: PERINATALITE_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Pathologies Neurologiques (Neurological Conditions)
// ============================================================================

const YES_NO_UNKNOWN_OPTIONS = [
  { code: 'yes', label: 'Oui', score: 1 },
  { code: 'no', label: 'Non', score: 0 },
  { code: 'unknown', label: 'Ne sais pas', score: 0 }
];

const YES_NO_OPTIONS = [
  { code: 'yes', label: 'Oui', score: 1 },
  { code: 'no', label: 'Non', score: 0 }
];

export const PATHO_NEURO_QUESTIONS: Question[] = [
  // 1. Migraine
  {
    id: 'q1_migraine',
    text: 'Migraine',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q1_1_migraine_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_migraine' }, 'yes'] }
  },
  {
    id: 'q1_2_migraine_treated',
    text: 'Traitée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_migraine' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q1_3_migraine_balanced',
    text: 'Équilibrée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_migraine' }, 'yes'] },
    options: YES_NO_OPTIONS
  },

  // 2. Sclérose en plaques
  {
    id: 'q2_sclerose',
    text: 'Sclérose en plaques',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q2_1_sclerose_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_sclerose' }, 'yes'] }
  },
  {
    id: 'q2_2_sclerose_treated',
    text: 'Traitée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_sclerose' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q2_3_sclerose_balanced',
    text: 'Équilibrée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_sclerose' }, 'yes'] },
    options: YES_NO_OPTIONS
  },

  // 3. Épilepsie
  {
    id: 'q3_epilepsie',
    text: 'Épilepsie',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q3_1_epilepsie_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_epilepsie' }, 'yes'] }
  },
  {
    id: 'q3_2_epilepsie_treated',
    text: 'Traitée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_epilepsie' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q3_3_epilepsie_balanced',
    text: 'Équilibrée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_epilepsie' }, 'yes'] },
    options: YES_NO_OPTIONS
  },

  // 4. Méningite
  {
    id: 'q4_meningite',
    text: 'Méningite',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q4_1_meningite_date',
    text: 'Date de survenue',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q4_meningite' }, 'yes'] }
  },

  // 5. Traumatisme crânien
  {
    id: 'q5_trauma_cranien',
    text: 'Traumatisme crânien',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q5_1_trauma_cranien_date',
    text: 'Date de survenue',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q5_trauma_cranien' }, 'yes'] }
  },

  // 6. Accident Vasculaire Cérébral (AVC)
  {
    id: 'q6_avc',
    text: 'Accident Vasculaire Cérébral',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q6_1_avc_date',
    text: 'Date de survenue',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q6_avc' }, 'yes'] }
  },

  // 7. Autre maladie neurologique
  {
    id: 'q7_autre',
    text: 'Autre maladie neurologique',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q7_1_autre_date',
    text: 'Date de survenue',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q7_autre' }, 'yes'] }
  },
  {
    id: 'q7_2_autre_specify',
    text: 'Spécifier',
    type: 'text',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q7_autre' }, 'yes'] }
  }
];

export const PATHO_NEURO_DEFINITION: QuestionnaireDefinition = {
  id: 'patho_neuro',
  code: 'PATHO_NEURO_FR',
  title: 'Pathologies neurologiques',
  description: 'Recueil des antécédents de pathologies neurologiques du patient (migraine, sclérose en plaques, épilepsie, méningite, traumatisme crânien, AVC, autres).',
  questions: PATHO_NEURO_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Pathologies Cardio-vasculaires (Cardiovascular Conditions)
// ============================================================================

export const PATHO_CARDIO_QUESTIONS: Question[] = [
  // 1. Hypertension artérielle
  {
    id: 'q1_hypertension',
    text: 'Hypertension artérielle',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q1_1_hypertension_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_hypertension' }, 'yes'] }
  },
  {
    id: 'q1_2_hypertension_treated',
    text: 'Traitée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_hypertension' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q1_3_hypertension_balanced',
    text: 'Équilibrée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_hypertension' }, 'yes'] },
    options: YES_NO_OPTIONS
  },

  // 2. Maladie coronarienne
  {
    id: 'q2_coronary',
    text: 'Maladie coronarienne',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q2_1_coronary_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_coronary' }, 'yes'] }
  },
  {
    id: 'q2_2_coronary_treated',
    text: 'Traitée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_coronary' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q2_3_coronary_balanced',
    text: 'Équilibrée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_coronary' }, 'yes'] },
    options: YES_NO_OPTIONS
  },

  // 3. Infarctus du myocarde
  {
    id: 'q3_infarctus',
    text: 'Infarctus du myocarde',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q3_1_infarctus_date',
    text: 'Date de survenue',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_infarctus' }, 'yes'] }
  },

  // 4. Trouble du rythme cardiaque
  {
    id: 'q4_rythme',
    text: 'Trouble du rythme cardiaque',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q4_1_rythme_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q4_rythme' }, 'yes'] }
  },
  {
    id: 'q4_2_rythme_treated',
    text: 'Traité',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q4_rythme' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q4_3_rythme_balanced',
    text: 'Équilibré',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q4_rythme' }, 'yes'] },
    options: YES_NO_OPTIONS
  },

  // 5. Autre maladie cardio-vasculaire
  {
    id: 'q5_autre',
    text: 'Autre maladie cardio-vasculaire',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q5_1_autre_specify',
    text: 'Spécifier la maladie',
    type: 'text',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q5_autre' }, 'yes'] }
  },
  {
    id: 'q5_2_autre_date',
    text: 'Date de survenue',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q5_autre' }, 'yes'] }
  }
];

export const PATHO_CARDIO_DEFINITION: QuestionnaireDefinition = {
  id: 'patho_cardio',
  code: 'PATHO_CARDIO_FR',
  title: 'Pathologies cardio-vasculaires',
  description: 'Recueil des antécédents de pathologies cardio-vasculaires du patient (hypertension artérielle, maladie coronarienne, infarctus du myocarde, trouble du rythme cardiaque, autres).',
  questions: PATHO_CARDIO_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Pathologies Endocriniennes et Métaboliques (Endocrine and Metabolic Conditions)
// ============================================================================

const DIABETE_TYPE_OPTIONS = [
  { code: 'type1', label: 'Type I', score: 0 },
  { code: 'type2', label: 'Type II', score: 0 },
  { code: 'unknown', label: 'Ne sais pas', score: 0 }
];

const DYSTHYROIDIE_TYPE_OPTIONS = [
  { code: 'hypo', label: 'Hypo-thyroïdie', score: 0 },
  { code: 'hyper', label: 'Hyper-thyroïdie', score: 0 },
  { code: 'unknown', label: 'Ne sais pas', score: 0 }
];

const DYSTHYROIDIE_ORIGIN_OPTIONS = [
  { code: 'lithium', label: 'Induite par le Lithium', score: 0 },
  { code: 'other_treatment', label: 'Induite par un autre traitement', score: 0 }
];

const DYSLIPIDEMIE_TYPE_OPTIONS = [
  { code: 'hypercholesterolemia', label: 'Hypercholestérolémie', score: 0 },
  { code: 'hypertriglyceridemia', label: 'Hypertriglycéridémie', score: 0 },
  { code: 'both', label: 'Les deux', score: 0 },
  { code: 'unknown', label: 'Ne sais pas', score: 0 }
];

export const PATHO_ENDOC_QUESTIONS: Question[] = [
  // 1. Diabète
  {
    id: 'q1_diabete',
    text: 'Diabète',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q1_1_diabete_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_diabete' }, 'yes'] }
  },
  {
    id: 'q1_2_diabete_treated',
    text: 'Traité',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_diabete' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q1_3_diabete_balanced',
    text: 'Équilibré',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_diabete' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q1_4_diabete_type',
    text: 'Type de diabète',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_diabete' }, 'yes'] },
    options: DIABETE_TYPE_OPTIONS
  },

  // 2. Dysthyroïdie
  {
    id: 'q2_dysthyroidie',
    text: 'Dysthyroïdie',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q2_1_dysthyroidie_type',
    text: 'Type de dysthyroïdie',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_dysthyroidie' }, 'yes'] },
    options: DYSTHYROIDIE_TYPE_OPTIONS
  },
  {
    id: 'q2_2_dysthyroidie_origin',
    text: 'Préciser',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_dysthyroidie' }, 'yes'] },
    options: DYSTHYROIDIE_ORIGIN_OPTIONS
  },
  {
    id: 'q2_3_dysthyroidie_treated',
    text: 'Traitée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_dysthyroidie' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q2_4_dysthyroidie_balanced',
    text: 'Équilibrée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_dysthyroidie' }, 'yes'] },
    options: YES_NO_OPTIONS
  },

  // 3. Dyslipidémie
  {
    id: 'q3_dyslipidemie',
    text: 'Dyslipidémie',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q3_1_dyslipidemie_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_dyslipidemie' }, 'yes'] }
  },
  {
    id: 'q3_2_dyslipidemie_treated',
    text: 'Traitée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_dyslipidemie' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q3_3_dyslipidemie_balanced',
    text: 'Équilibrée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_dyslipidemie' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q3_4_dyslipidemie_type',
    text: 'Type de dyslipidémie',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_dyslipidemie' }, 'yes'] },
    options: DYSLIPIDEMIE_TYPE_OPTIONS
  },

  // 4. Autres endocrinopathies
  {
    id: 'q4_autres',
    text: 'Autres endocrinopathies',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q4_1_autres_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q4_autres' }, 'yes'] }
  },
  {
    id: 'q4_2_autres_specify',
    text: 'Spécifier l\'endocrinopathie',
    type: 'text',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q4_autres' }, 'yes'] }
  }
];

export const PATHO_ENDOC_DEFINITION: QuestionnaireDefinition = {
  id: 'patho_endoc',
  code: 'PATHO_ENDOC_FR',
  title: 'Pathologies endocriniennes et métaboliques',
  description: 'Recueil des antécédents de pathologies endocriniennes et métaboliques du patient (diabète, dysthyroïdie, dyslipidémie, autres endocrinopathies).',
  questions: PATHO_ENDOC_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Pathologies Dermatologiques (Dermatological Conditions)
// ============================================================================

const TOXIDERMIE_TYPE_OPTIONS = [
  { code: 'simple_eruption', label: 'Éruption cutanée simple', score: 0 },
  { code: 'lyell', label: 'Syndrome de Lyell', score: 0 },
  { code: 'stevens_johnson', label: 'Syndrome de Stevens-Johnson', score: 0 }
];

const TOXIDERMIE_MEDICATION_OPTIONS = [
  { code: 'antibiotics', label: 'Antibiotiques', score: 0 },
  { code: 'nsaid', label: 'AINS', score: 0 },
  { code: 'anticonvulsants', label: 'Anticonvulsivants', score: 0 },
  { code: 'other', label: 'Autres médicaments', score: 0 }
];

export const PATHO_DERMATO_QUESTIONS: Question[] = [
  // 1. Psoriasis
  {
    id: 'q1_psoriasis',
    text: 'Psoriasis',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q1_1_psoriasis_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_psoriasis' }, 'yes'] }
  },
  {
    id: 'q1_2_psoriasis_treated',
    text: 'Traité',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_psoriasis' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q1_3_psoriasis_balanced',
    text: 'Équilibré',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_psoriasis' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q1_4_psoriasis_lithium_effect',
    text: 'Votre psoriasis a-t-il été déclenché ou aggravé par le lithium',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_psoriasis' }, 'yes'] },
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q1_5_psoriasis_triggered_lithium',
    text: 'Déclenché par le lithium',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_psoriasis' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q1_6_psoriasis_aggravated_lithium',
    text: 'Aggravé par le lithium',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_psoriasis' }, 'yes'] },
    options: YES_NO_OPTIONS
  },

  // 2. Acné
  {
    id: 'q2_acne',
    text: 'Acné',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q2_1_acne_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_acne' }, 'yes'] }
  },
  {
    id: 'q2_2_acne_treated',
    text: 'Traitée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_acne' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q2_3_acne_balanced',
    text: 'Équilibrée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_acne' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q2_4_acne_lithium_effect',
    text: 'Votre acné a-t-elle été déclenchée ou aggravée par le lithium',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_acne' }, 'yes'] },
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q2_5_acne_triggered_lithium',
    text: 'Déclenchée par le lithium',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_acne' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q2_6_acne_aggravated_lithium',
    text: 'Aggravée par le lithium',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_acne' }, 'yes'] },
    options: YES_NO_OPTIONS
  },

  // 3. Eczéma
  {
    id: 'q3_eczema',
    text: 'Eczéma',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q3_1_eczema_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_eczema' }, 'yes'] }
  },
  {
    id: 'q3_2_eczema_treated',
    text: 'Traité',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_eczema' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q3_3_eczema_balanced',
    text: 'Équilibré',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_eczema' }, 'yes'] },
    options: YES_NO_OPTIONS
  },

  // 4. Toxidermie médicamenteuse
  {
    id: 'q4_toxidermie',
    text: 'Toxidermie médicamenteuse',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q4_1_toxidermie_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q4_toxidermie' }, 'yes'] }
  },
  {
    id: 'q4_2_toxidermie_type',
    text: 'Type de toxidermie',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q4_toxidermie' }, 'yes'] },
    options: TOXIDERMIE_TYPE_OPTIONS
  },
  {
    id: 'q4_3_toxidermie_medication',
    text: 'Médicament en cause',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q4_toxidermie' }, 'yes'] },
    options: TOXIDERMIE_MEDICATION_OPTIONS
  },

  // 5. Perte importante de cheveux
  {
    id: 'q5_hair_loss',
    text: 'Perte importante de cheveux',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q5_1_hair_loss_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q5_hair_loss' }, 'yes'] }
  },
  {
    id: 'q5_2_hair_loss_treated',
    text: 'Traitée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q5_hair_loss' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q5_3_hair_loss_balanced',
    text: 'Équilibrée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q5_hair_loss' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q5_4_hair_loss_depakine',
    text: 'Votre perte de cheveux a-t-elle été déclenchée ou aggravée par le traitement Depakine, Depamide ou Depakote',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q5_hair_loss' }, 'yes'] },
    options: YES_NO_UNKNOWN_OPTIONS
  }
];

export const PATHO_DERMATO_DEFINITION: QuestionnaireDefinition = {
  id: 'patho_dermato',
  code: 'PATHO_DERMATO_FR',
  title: 'Pathologies dermatologiques',
  description: 'Recueil des antécédents de pathologies dermatologiques du patient (psoriasis, acné, eczéma, toxidermie médicamenteuse, perte de cheveux).',
  questions: PATHO_DERMATO_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Pathologies des voies urinaires (Urinary Tract Conditions)
// ============================================================================

const URINARY_TREATMENT_OPTIONS = [
  { code: 'neuroleptics', label: 'Neuroleptiques', score: 0 },
  { code: 'antidepressants', label: 'Antidépresseurs', score: 0 },
  { code: 'other', label: 'Autres traitements', score: 0 }
];

export const PATHO_URINAIRE_QUESTIONS: Question[] = [
  // 1. Néphropathie
  {
    id: 'q1_nephropathy',
    text: 'Néphropathie',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q1_1_nephropathy_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_nephropathy' }, 'yes'] }
  },
  {
    id: 'q1_2_nephropathy_treated',
    text: 'Traitée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_nephropathy' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q1_3_nephropathy_balanced',
    text: 'Équilibrée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_nephropathy' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q1_4_nephropathy_lithium_link',
    text: 'Néphropathie en lien probable avec un traitement passé ou actuel par le lithium',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_nephropathy' }, 'yes'] },
    options: YES_NO_UNKNOWN_OPTIONS
  },

  // 2. Adénome prostatique
  {
    id: 'q2_prostatic_adenoma',
    text: 'Adénome prostatique',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q2_1_prostatic_adenoma_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_prostatic_adenoma' }, 'yes'] }
  },
  {
    id: 'q2_2_prostatic_adenoma_treated',
    text: 'Traité',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_prostatic_adenoma' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q2_3_prostatic_adenoma_balanced',
    text: 'Équilibré',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_prostatic_adenoma' }, 'yes'] },
    options: YES_NO_OPTIONS
  },

  // 3. Rétention aiguë d'urine
  {
    id: 'q3_urinary_retention',
    text: 'Rétention aiguë d\'urine',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q3_1_urinary_retention_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_urinary_retention' }, 'yes'] }
  },
  {
    id: 'q3_2_urinary_retention_treatment_triggered',
    text: 'Déclenchée sous traitement',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_urinary_retention' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q3_3_urinary_retention_treatment_type',
    text: 'Nature du traitement',
    type: 'multiple_choice',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'q3_2_urinary_retention_treatment_triggered' }, 'yes'] },
    options: URINARY_TREATMENT_OPTIONS
  }
];

export const PATHO_URINAIRE_DEFINITION: QuestionnaireDefinition = {
  id: 'patho_urinaire',
  code: 'PATHO_URINAIRE_FR',
  title: 'Pathologies des voies urinaires',
  description: 'Recueil des antécédents de pathologies des voies urinaires du patient (néphropathie, adénome prostatique, rétention urinaire).',
  questions: PATHO_URINAIRE_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Antécédents gynécologiques (Gynecological History)
// ============================================================================

const COUNT_OPTIONS_0_15 = [
  { code: 0, label: '0', score: 0 },
  { code: 1, label: '1', score: 0 },
  { code: 2, label: '2', score: 0 },
  { code: 3, label: '3', score: 0 },
  { code: 4, label: '4', score: 0 },
  { code: 5, label: '5', score: 0 },
  { code: 6, label: '6', score: 0 },
  { code: 7, label: '7', score: 0 },
  { code: 8, label: '8', score: 0 },
  { code: 9, label: '9', score: 0 },
  { code: 10, label: '10', score: 0 },
  { code: 11, label: '11', score: 0 },
  { code: 12, label: '12', score: 0 },
  { code: 13, label: '13', score: 0 },
  { code: 14, label: '14', score: 0 },
  { code: 15, label: '>15', score: 0 }
];

export const ANTECEDENTS_GYNECO_QUESTIONS: Question[] = [
  // 1. Nombre de grossesses
  {
    id: 'q1_pregnancy_count',
    text: 'Nombre de grossesses',
    type: 'single_choice',
    required: false,
    options: COUNT_OPTIONS_0_15
  },
  // 2. Nombre d'enfants nés vivants
  {
    id: 'q2_live_birth_count',
    text: 'Nombre d\'enfants nés vivants',
    type: 'single_choice',
    required: false,
    options: COUNT_OPTIONS_0_15
  },
  // 3. Nombre de fausses couches spontanées
  {
    id: 'q3_miscarriage_count',
    text: 'Nombre de fausses couches spontanées',
    type: 'single_choice',
    required: false,
    options: COUNT_OPTIONS_0_15
  },
  // 4. Nombre d'interruptions volontaires de grossesse (IVG)
  {
    id: 'q4_ivg_count',
    text: 'Nombre d\'interruptions volontaires de grossesse (IVG)',
    type: 'single_choice',
    required: false,
    options: COUNT_OPTIONS_0_15
  },
  // 5. Nombre d'interruptions thérapeutiques de grossesse (ITG)
  {
    id: 'q5_itg_count',
    text: 'Nombre d\'interruptions thérapeutiques de grossesse (ITG)',
    type: 'single_choice',
    required: false,
    options: COUNT_OPTIONS_0_15
  },

  // 6. Ménopause
  {
    id: 'q6_menopause',
    text: 'Ménopause',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q6_1_menopause_date',
    text: 'Date de survenue de la ménopause',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q6_menopause' }, 'yes'] }
  },
  {
    id: 'q6_2_hormonal_treatment',
    text: 'Traitement hormonal',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q6_menopause' }, 'yes'] },
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q6_3_hormonal_treatment_start_date',
    text: 'Date de début du traitement',
    type: 'date',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'q6_2_hormonal_treatment' }, 'yes'] }
  },

  // 7. Pathologie gynécologique (hors cancer)
  {
    id: 'q7_gyneco_pathology',
    text: 'Pathologie gynécologique (hors cancer)',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q7_1_gyneco_pathology_specify',
    text: 'Spécifier',
    type: 'text',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q7_gyneco_pathology' }, 'yes'] }
  }
];

export const ANTECEDENTS_GYNECO_DEFINITION: QuestionnaireDefinition = {
  id: 'antecedents_gyneco',
  code: 'ANTECEDENTS_GYNECO_FR',
  title: 'Antécédents gynécologiques',
  description: 'Recueil des antécédents gynécologiques de la patiente (grossesses, ménopause, pathologies gynécologiques).',
  questions: ANTECEDENTS_GYNECO_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Pathologies hépato-gastro-entérologiques (Hepato-gastro-enterological Pathologies)
// ============================================================================

export const PATHO_HEPATO_GASTRO_QUESTIONS: Question[] = [
  // 1. Maladies inflammatoires chroniques de l'intestin (MICI)
  {
    id: 'q1_1_mici_presence',
    text: 'Maladies inflammatoires chroniques de l\'intestin',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q1_2_mici_start_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_1_mici_presence' }, 'yes'] }
  },
  {
    id: 'q1_3_mici_treated',
    text: 'Traitées',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_1_mici_presence' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q1_4_mici_balanced',
    text: 'Équilibrées',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_1_mici_presence' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q1_5_mici_type',
    text: 'Type de maladie',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q1_1_mici_presence' }, 'yes'] },
    options: [
      { code: 'crohn', label: 'Maladie de Crohn', score: 0 },
      { code: 'rch', label: 'Rectocolite hémorragique', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },

  // 2. Cirrhose
  {
    id: 'q2_1_cirrhosis_presence',
    text: 'Cirrhose',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q2_2_cirrhosis_start_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_1_cirrhosis_presence' }, 'yes'] }
  },
  {
    id: 'q2_3_cirrhosis_treated',
    text: 'Traitée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_1_cirrhosis_presence' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q2_4_cirrhosis_balanced',
    text: 'Équilibrée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_1_cirrhosis_presence' }, 'yes'] },
    options: YES_NO_OPTIONS
  },

  // 3. Ulcère gastro-duodénal
  {
    id: 'q3_1_ulcer_presence',
    text: 'Ulcère gastro-duodénal',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q3_2_ulcer_start_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_1_ulcer_presence' }, 'yes'] }
  },
  {
    id: 'q3_3_ulcer_treated',
    text: 'Traité',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_1_ulcer_presence' }, 'yes'] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q3_4_ulcer_balanced',
    text: 'Équilibré',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_1_ulcer_presence' }, 'yes'] },
    options: YES_NO_OPTIONS
  },

  // 4. Hépatites médicamenteuses
  {
    id: 'q4_1_hepatitis_presence',
    text: 'Hépatites médicamenteuses',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q4_2_hepatitis_start_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q4_1_hepatitis_presence' }, 'yes'] }
  },
  {
    id: 'q4_3_hepatitis_treatment_type',
    text: 'Nature du traitement',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q4_1_hepatitis_presence' }, 'yes'] },
    options: [
      { code: 'neuroleptiques', label: 'Neuroleptiques', score: 0 },
      { code: 'antidepresseurs', label: 'Antidépresseurs', score: 0 },
      { code: 'anticonvulsivants', label: 'Anticonvulsivants', score: 0 },
      { code: 'autres', label: 'Autres traitements', score: 0 }
    ]
  }
];

export const PATHO_HEPATO_GASTRO_DEFINITION: QuestionnaireDefinition = {
  id: 'patho_hepato_gastro',
  code: 'PATHO_HEPATO_GASTRO_FR',
  title: 'Pathologies hépato-gastro-entérologiques',
  description: 'Recueil des antécédents de pathologies hépato-gastro-entérologiques du patient (MICI, cirrhose, ulcère, hépatites médicamenteuses).',
  questions: PATHO_HEPATO_GASTRO_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Pathologies allergiques et inflammatoires (Allergic and Inflammatory Pathologies)
// ============================================================================

export const PATHO_ALLERGIQUE_QUESTIONS: Question[] = [
  // 0. Main presence question
  {
    id: 'q0_presence',
    text: 'Pathologies allergiques et inflammatoires',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS
  },

  // 1. Selection of pathologies (multi-select, conditional on presence = yes)
  {
    id: 'q1_pathologies_selection',
    text: 'Spécifier les pathologies concernées',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q0_presence' }, 'yes'] },
    options: [
      { code: 'asthme', label: 'Asthme (allergique ou non)', score: 0 },
      { code: 'allergies', label: 'Allergies hors asthme', score: 0 },
      { code: 'lupus', label: 'Lupus', score: 0 },
      { code: 'polyarthrite', label: 'Polyarthrite rhumatoïde', score: 0 },
      { code: 'autres_autoimmunes', label: 'Autres maladies auto-immunes', score: 0 }
    ]
  },

  // 2. Asthme (conditional on 'asthme' in selection)
  {
    id: 'q2_1_asthme_treated',
    text: 'Asthme traité',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { 'in': ['asthme', { var: 'q1_pathologies_selection' }] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q2_2_asthme_balanced',
    text: 'Asthme équilibré',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { 'in': ['asthme', { var: 'q1_pathologies_selection' }] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q2_3_asthme_start_date',
    text: 'Date de début de l\'asthme',
    type: 'date',
    required: false,
    indentLevel: 2,
    display_if: { 'in': ['asthme', { var: 'q1_pathologies_selection' }] }
  },

  // 3. Allergies hors asthme (conditional on 'allergies' in selection)
  {
    id: 'q3_1_allergie_treated',
    text: 'Allergie traitée',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { 'in': ['allergies', { var: 'q1_pathologies_selection' }] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q3_2_allergie_balanced',
    text: 'Allergie équilibrée',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { 'in': ['allergies', { var: 'q1_pathologies_selection' }] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q3_3_allergie_start_date',
    text: 'Date de début de l\'allergie',
    type: 'date',
    required: false,
    indentLevel: 2,
    display_if: { 'in': ['allergies', { var: 'q1_pathologies_selection' }] }
  },

  // 4. Lupus (conditional on 'lupus' in selection)
  {
    id: 'q4_1_lupus_treated',
    text: 'Lupus traité',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { 'in': ['lupus', { var: 'q1_pathologies_selection' }] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q4_2_lupus_balanced',
    text: 'Lupus équilibré',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { 'in': ['lupus', { var: 'q1_pathologies_selection' }] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q4_3_lupus_start_date',
    text: 'Date de début du lupus',
    type: 'date',
    required: false,
    indentLevel: 2,
    display_if: { 'in': ['lupus', { var: 'q1_pathologies_selection' }] }
  },

  // 5. Polyarthrite rhumatoïde (conditional on 'polyarthrite' in selection)
  {
    id: 'q5_1_polyarthrite_treated',
    text: 'Polyarthrite traitée',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { 'in': ['polyarthrite', { var: 'q1_pathologies_selection' }] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q5_2_polyarthrite_balanced',
    text: 'Polyarthrite équilibrée',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { 'in': ['polyarthrite', { var: 'q1_pathologies_selection' }] },
    options: YES_NO_OPTIONS
  },
  {
    id: 'q5_3_polyarthrite_start_date',
    text: 'Date de début de la polyarthrite',
    type: 'date',
    required: false,
    indentLevel: 2,
    display_if: { 'in': ['polyarthrite', { var: 'q1_pathologies_selection' }] }
  },

  // 6. Autres maladies auto-immunes (conditional on 'autres_autoimmunes' in selection)
  {
    id: 'q6_1_autoimmune_start_date',
    text: 'Date de début de la maladie auto-immune',
    type: 'date',
    required: false,
    indentLevel: 2,
    display_if: { 'in': ['autres_autoimmunes', { var: 'q1_pathologies_selection' }] }
  },
  {
    id: 'q6_2_autoimmune_type',
    text: 'Type de la maladie auto-immune',
    type: 'text',
    required: false,
    indentLevel: 2,
    display_if: { 'in': ['autres_autoimmunes', { var: 'q1_pathologies_selection' }] },
    help: 'Nom du diagnostic, système organique impliqué, qualificatifs optionnels (systémique / organe-spécifique)'
  }
];

export const PATHO_ALLERGIQUE_DEFINITION: QuestionnaireDefinition = {
  id: 'patho_allergique',
  code: 'PATHO_ALLERGIQUE_FR',
  title: 'Pathologies allergiques et inflammatoires',
  description: 'Recueil des antécédents de pathologies allergiques et inflammatoires du patient (asthme, allergies, lupus, polyarthrite rhumatoïde, maladies auto-immunes).',
  questions: PATHO_ALLERGIQUE_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// AUTRES PATHOLOGIES (Other Pathologies - Histoire Somatique)
// ============================================================================

const CANCER_TYPE_OPTIONS: QuestionOption[] = [
  { code: 'digestifs', label: 'Cancers digestifs', score: 0 },
  { code: 'orl', label: 'Cancers ORL', score: 0 },
  { code: 'pulmonaires', label: 'Cancers pulmonaires', score: 0 },
  { code: 'gynecologiques', label: 'Cancers gynécologiques', score: 0 },
  { code: 'autres', label: 'Autres cancers', score: 0 }
];

const HEPATITIS_TYPE_OPTIONS: QuestionOption[] = [
  { code: 'hepatite_b', label: 'Hépatite B', score: 0 },
  { code: 'hepatite_c', label: 'Hépatite C', score: 0 },
  { code: 'hepatite_d', label: 'Hépatite D', score: 0 },
  { code: 'non_classee', label: 'Hépatite non classée', score: 0 },
  { code: 'unknown', label: 'Ne sais pas', score: 0 }
];

const GLOBAL_RESPONSE_OPTIONS: QuestionOption[] = [
  { code: 'non_pour_tous', label: 'Non pour tous', score: 0 },
  { code: 'ne_sais_pas_pour_tous', label: 'Ne sais pas pour tous', score: 0 },
  { code: 'detailed', label: 'Réponse détaillée', score: 0 }
];

const TREATMENT_TYPE_OPHTALMO_OPTIONS: QuestionOption[] = [
  { code: 'neuroleptiques', label: 'Neuroleptiques', score: 0 },
  { code: 'antidepresseurs', label: 'Antidépresseurs', score: 0 },
  { code: 'autres', label: 'Autres traitements', score: 0 }
];

export const AUTRES_PATHO_QUESTIONS: Question[] = [
  // 0. Global response
  {
    id: 'q0_global_response',
    text: 'Autres pathologies',
    type: 'single_choice',
    required: false,
    options: GLOBAL_RESPONSE_OPTIONS,
    help: 'Sélectionnez "Réponse détaillée" pour renseigner chaque pathologie individuellement.'
  },

  // ============================================================================
  // I. PATHOLOGIES CANCEREUSES
  // ============================================================================
  {
    id: 'section_cancer',
    text: 'I. Pathologies cancéreuses',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'q0_global_response' }, 'detailed'] }
  },

  // 1. Pathologies néoplasiques
  {
    id: 'q1_1_neoplasique_presence',
    text: 'Pathologies néoplasiques',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'q0_global_response' }, 'detailed'] },
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q1_2_neoplasique_date',
    text: 'Date du premier diagnostic de cancer',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q1_1_neoplasique_presence' }, 'yes'] }
    ]}
  },
  {
    id: 'q1_3_cancer_types',
    text: 'Type de cancer',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q1_1_neoplasique_presence' }, 'yes'] }
    ]},
    options: CANCER_TYPE_OPTIONS
  },
  {
    id: 'q1_4_cancer_specify',
    text: 'Spécifier le type de cancer',
    type: 'text',
    required: false,
    indentLevel: 2,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q1_1_neoplasique_presence' }, 'yes'] },
      { 'in': ['autres', { var: 'q1_3_cancer_types' }] }
    ]}
  },

  // ============================================================================
  // II. PATHOLOGIES INFECTIEUSES
  // ============================================================================
  {
    id: 'section_infectieuses',
    text: 'II. Pathologies infectieuses',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'q0_global_response' }, 'detailed'] },
    help: 'Si le patient ne sait pas, proposer un dépistage sérologique pour le VIH et l\'hépatite.'
  },

  // 2. Infection à VIH
  {
    id: 'q2_1_vih_presence',
    text: 'Infection à VIH',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'q0_global_response' }, 'detailed'] },
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q2_2_vih_date',
    text: 'Date de diagnostic',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q2_1_vih_presence' }, 'yes'] }
    ]}
  },
  {
    id: 'q2_3_vih_treated',
    text: 'Traitée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q2_1_vih_presence' }, 'yes'] }
    ]},
    options: YES_NO_OPTIONS
  },
  {
    id: 'q2_4_vih_balanced',
    text: 'Équilibrée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q2_1_vih_presence' }, 'yes'] }
    ]},
    options: YES_NO_OPTIONS
  },

  // 3. Hépatite virale chronique
  {
    id: 'q3_1_hepatite_presence',
    text: 'Hépatite virale chronique',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'q0_global_response' }, 'detailed'] },
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q3_2_hepatite_date',
    text: 'Date de diagnostic',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q3_1_hepatite_presence' }, 'yes'] }
    ]}
  },
  {
    id: 'q3_3_hepatite_type',
    text: 'Nature du virus',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q3_1_hepatite_presence' }, 'yes'] }
    ]},
    options: HEPATITIS_TYPE_OPTIONS
  },
  {
    id: 'q3_4_hepatite_treated',
    text: 'Traitée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q3_1_hepatite_presence' }, 'yes'] }
    ]},
    options: YES_NO_OPTIONS
  },
  {
    id: 'q3_5_hepatite_balanced',
    text: 'Équilibrée',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q3_1_hepatite_presence' }, 'yes'] }
    ]},
    options: YES_NO_OPTIONS
  },

  // ============================================================================
  // III. ANTECEDENTS CHIRURGICAUX GRAVES
  // ============================================================================
  {
    id: 'section_chirurgicaux',
    text: 'III. Antécédents chirurgicaux graves',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'q0_global_response' }, 'detailed'] }
  },

  // 4. Antécédents chirurgicaux graves
  {
    id: 'q4_1_chirurgicaux_presence',
    text: 'Antécédents chirurgicaux graves',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'q0_global_response' }, 'detailed'] },
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q4_2_chirurgicaux_specify',
    text: 'Spécifier',
    type: 'text',
    required: false,
    indentLevel: 1,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q4_1_chirurgicaux_presence' }, 'yes'] }
    ]}
  },

  // ============================================================================
  // IV. MALADIE GENETIQUE
  // ============================================================================
  {
    id: 'section_genetique',
    text: 'IV. Maladie génétique',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'q0_global_response' }, 'detailed'] }
  },

  // 5. Maladie génétique
  {
    id: 'q5_1_genetique_presence',
    text: 'Maladie génétique',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'q0_global_response' }, 'detailed'] },
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q5_2_genetique_specify',
    text: 'Spécifier la maladie génétique',
    type: 'text',
    required: false,
    indentLevel: 1,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q5_1_genetique_presence' }, 'yes'] }
    ]}
  },

  // ============================================================================
  // V. PATHOLOGIES OPHTALMOLOGIQUES
  // ============================================================================
  {
    id: 'section_ophtalmo',
    text: 'V. Pathologies ophtalmologiques',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'q0_global_response' }, 'detailed'] }
  },

  // 6. Pathologies ophtalmologiques - Présence globale
  {
    id: 'q6_0_ophtalmo_presence',
    text: 'Pathologies ophtalmologiques',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'q0_global_response' }, 'detailed'] },
    options: YES_NO_UNKNOWN_OPTIONS
  },

  // 6.1 Glaucome par fermeture de l'angle
  {
    id: 'q6_1_1_glaucome_fermeture_presence',
    text: 'Glaucome par fermeture de l\'angle',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q6_0_ophtalmo_presence' }, 'yes'] }
    ]},
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q6_1_2_glaucome_fermeture_date',
    text: 'Date de diagnostic',
    type: 'date',
    required: false,
    indentLevel: 2,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q6_0_ophtalmo_presence' }, 'yes'] },
      { '==': [{ var: 'q6_1_1_glaucome_fermeture_presence' }, 'yes'] }
    ]}
  },
  {
    id: 'q6_1_3_glaucome_fermeture_treatment_triggered',
    text: 'Survenue sous traitement',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q6_0_ophtalmo_presence' }, 'yes'] },
      { '==': [{ var: 'q6_1_1_glaucome_fermeture_presence' }, 'yes'] }
    ]},
    options: YES_NO_OPTIONS
  },
  {
    id: 'q6_1_4_glaucome_fermeture_treatment_type',
    text: 'Nature du traitement',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q6_0_ophtalmo_presence' }, 'yes'] },
      { '==': [{ var: 'q6_1_1_glaucome_fermeture_presence' }, 'yes'] },
      { '==': [{ var: 'q6_1_3_glaucome_fermeture_treatment_triggered' }, 'yes'] }
    ]},
    options: TREATMENT_TYPE_OPHTALMO_OPTIONS
  },

  // 6.2 Glaucome chronique à angle ouvert
  {
    id: 'q6_2_1_glaucome_ouvert_presence',
    text: 'Glaucome chronique à angle ouvert',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q6_0_ophtalmo_presence' }, 'yes'] }
    ]},
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q6_2_2_glaucome_ouvert_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 2,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q6_0_ophtalmo_presence' }, 'yes'] },
      { '==': [{ var: 'q6_2_1_glaucome_ouvert_presence' }, 'yes'] }
    ]}
  },
  {
    id: 'q6_2_3_glaucome_ouvert_treated',
    text: 'Traité',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q6_0_ophtalmo_presence' }, 'yes'] },
      { '==': [{ var: 'q6_2_1_glaucome_ouvert_presence' }, 'yes'] }
    ]},
    options: YES_NO_OPTIONS
  },
  {
    id: 'q6_2_4_glaucome_ouvert_balanced',
    text: 'Équilibré',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q6_0_ophtalmo_presence' }, 'yes'] },
      { '==': [{ var: 'q6_2_1_glaucome_ouvert_presence' }, 'yes'] }
    ]},
    options: YES_NO_OPTIONS
  },

  // 6.3 Cataracte
  {
    id: 'q6_3_1_cataracte_presence',
    text: 'Cataracte',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q6_0_ophtalmo_presence' }, 'yes'] }
    ]},
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q6_3_2_cataracte_date',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 2,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q6_0_ophtalmo_presence' }, 'yes'] },
      { '==': [{ var: 'q6_3_1_cataracte_presence' }, 'yes'] }
    ]}
  },
  {
    id: 'q6_3_3_cataracte_treated',
    text: 'Traitée',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q6_0_ophtalmo_presence' }, 'yes'] },
      { '==': [{ var: 'q6_3_1_cataracte_presence' }, 'yes'] }
    ]},
    options: YES_NO_OPTIONS
  },
  {
    id: 'q6_3_4_cataracte_balanced',
    text: 'Équilibrée',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q6_0_ophtalmo_presence' }, 'yes'] },
      { '==': [{ var: 'q6_3_1_cataracte_presence' }, 'yes'] }
    ]},
    options: YES_NO_OPTIONS
  },

  // ============================================================================
  // VI. AUTRE PATHOLOGIE SOMATIQUE
  // ============================================================================
  {
    id: 'section_autre',
    text: 'VI. Autre pathologie somatique',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'q0_global_response' }, 'detailed'] }
  },

  // 7. Autre pathologie somatique
  {
    id: 'q7_1_autre_presence',
    text: 'Autre pathologie somatique',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'q0_global_response' }, 'detailed'] },
    options: YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'q7_2_autre_specify',
    text: 'Spécifier',
    type: 'text',
    required: false,
    indentLevel: 1,
    display_if: { 'and': [
      { '==': [{ var: 'q0_global_response' }, 'detailed'] },
      { '==': [{ var: 'q7_1_autre_presence' }, 'yes'] }
    ]}
  }
];

export const AUTRES_PATHO_DEFINITION: QuestionnaireDefinition = {
  id: 'autres_patho',
  code: 'AUTRES_PATHO_FR',
  title: 'Autres pathologies',
  description: 'Recueil des antécédents de pathologies diverses du patient: cancers, infections (VIH, hépatites), antécédents chirurgicaux, maladies génétiques, pathologies ophtalmologiques, et autres pathologies somatiques.',
  questions: AUTRES_PATHO_QUESTIONS,
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
    text: 'Age du patient (calculé automatiquement)',
    type: 'number',
    required: true,
    readonly: true,
    min: 16,
    max: 90,
    help: 'Calculé automatiquement à partir de la date de naissance et de la date de visite'
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
    readonly: true,
    min: 0,
    help: 'Calculé automatiquement depuis le profil du patient'
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
  },
  {
    id: 'accepted_for_neuropsy_evaluation',
    section: 'Acceptation pour Évaluation',
    text: 'Patient accepté pour l\'évaluation Neuropsychologique',
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

// ============================================================================
// WAIS-IV Learning Disorders (Troubles des acquisitions et des apprentissages)
// ============================================================================

export const WAIS4_LEARNING_QUESTIONS: Question[] = [
  {
    id: 'dyslexia',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Dyslexie',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sait pas', score: 0 }
    ]
  },
  {
    id: 'dysorthographia',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Dysorthographie',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sait pas', score: 0 }
    ]
  },
  {
    id: 'dyscalculia',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Dyscalculie',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sait pas', score: 0 }
    ]
  },
  {
    id: 'dysphasia',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Dysphasie',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sait pas', score: 0 }
    ]
  },
  {
    id: 'dyspraxia',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Dyspraxie',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sait pas', score: 0 }
    ]
  },
  {
    id: 'speech_delay',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Retard à l\'acquisition de la parole',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sait pas', score: 0 }
    ]
  },
  {
    id: 'stuttering',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Bégaiement',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sait pas', score: 0 }
    ]
  },
  {
    id: 'walking_delay',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Retard à l\'acquisition de la marche',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sait pas', score: 0 }
    ]
  },
  {
    id: 'febrile_seizures',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Convulsions fébriles dans la petite enfance',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sait pas', score: 0 }
    ]
  },
  {
    id: 'precocity',
    section: 'Troubles des acquisitions et des apprentissages',
    text: 'Précocité',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sait pas', score: 0 }
    ]
  }
];

export const WAIS4_LEARNING_DEFINITION: QuestionnaireDefinition = {
  id: 'wais4_learning',
  code: 'WAIS4_LEARNING_FR',
  title: 'WAIS-IV Troubles des acquisitions et des apprentissages',
  description: 'Liste de contrôle des antécédents de troubles des acquisitions et des apprentissages.',
  questions: WAIS4_LEARNING_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// WAIS-IV Matrices (Raisonnement fluide et intelligence visuo-spatiale)
// ============================================================================

// Helper function to generate matrix items
const generateMatrixItems = (): Question[] => {
  const items: Question[] = [];
  
  // Add age question first
  items.push({
    id: 'patient_age',
    section: 'Données Démographiques',
    text: 'Age du patient (calculé automatiquement)',
    type: 'number',
    required: true,
    readonly: true,
    min: 16,
    max: 90,
    help: 'Calculé automatiquement à partir de la date de naissance et de la date de visite'
  });
  
  // Generate 26 items
  for (let i = 1; i <= 26; i++) {
    const itemNum = String(i).padStart(2, '0');
    items.push({
      id: `item_${itemNum}`,
      section: 'Items Matrices',
      text: `Note pour l'item ${i}`,
      type: 'single_choice',
      required: true,
      options: [
        { code: 0, label: '0', score: 0 },
        { code: 1, label: '1', score: 1 }
      ]
    });
  }
  
  return items;
};

export const WAIS4_MATRICES_QUESTIONS: Question[] = generateMatrixItems();

export const WAIS4_MATRICES_DEFINITION: QuestionnaireDefinition = {
  id: 'wais4_matrices',
  code: 'WAIS4_MATRICES_FR',
  title: 'WAIS-IV Subtest Matrices',
  description: 'Évaluation du raisonnement fluide et de l\'intelligence visuo-spatiale (Items 1-26).',
  questions: WAIS4_MATRICES_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// CVLT - California Verbal Learning Test (French Adaptation)
// ============================================================================

export const CVLT_QUESTIONS: Question[] = [
  // Section: Donnees Demographiques
  {
    id: 'section_demo',
    text: 'Donnees Demographiques',
    type: 'section',
    required: false
  },
  {
    id: 'patient_age',
    section: 'Donnees Demographiques',
    text: 'Age du patient',
    type: 'number',
    required: true,
    readonly: true,
    min: 16,
    max: 100,
    help: 'Calcule automatiquement a partir de la date de naissance et de la date de visite'
  },
  {
    id: 'years_of_education',
    section: 'Donnees Demographiques',
    text: 'Annees d\'etudes',
    type: 'number',
    required: true,
    readonly: true,
    min: 0,
    max: 30,
    help: 'Calcule automatiquement depuis le profil du patient'
  },
  {
    id: 'patient_sex',
    section: 'Donnees Demographiques',
    text: 'Sexe',
    type: 'single_choice',
    required: true,
    readonly: true,
    options: [
      { code: 'F', label: 'Femme', score: 1 },
      { code: 'M', label: 'Homme', score: 2 }
    ],
    help: 'Renseigne automatiquement depuis le profil du patient'
  },
  
  // Section: Liste A (Lundi) - Apprentissage
  {
    id: 'section_list_a',
    text: 'Rappel Liste A',
    type: 'section',
    required: false
  },
  {
    id: 'trial_1',
    section: 'Rappel Liste A',
    text: 'Rappel 1 (Liste A Essai 1)',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'trial_2',
    section: 'Rappel Liste A',
    text: 'Rappel 2',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'trial_3',
    section: 'Rappel Liste A',
    text: 'Rappel 3',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'trial_4',
    section: 'Rappel Liste A',
    text: 'Rappel 4',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'trial_5',
    section: 'Rappel Liste A',
    text: 'Rappel 5 (Liste A Essai 5)',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'trials_1_5_total',
    section: 'Rappel Liste A',
    text: 'Lundi Total (Somme Rappels 1-5)',
    type: 'number',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement (somme des essais 1 a 5)'
  },
  {
    id: 'trial_1_std',
    section: 'Rappel Liste A',
    text: 'Note Standard Rappel 1',
    type: 'number',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement selon les normes'
  },
  {
    id: 'trial_5_std',
    section: 'Rappel Liste A',
    text: 'Note Standard Rappel 5',
    type: 'text',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement selon les normes (z-score ou percentile selon age)'
  },
  {
    id: 'trials_1_5_total_std',
    section: 'Rappel Liste A',
    text: 'Note Standard Lundi Total (1-5)',
    type: 'number',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement selon les normes'
  },
  
  // Section: Liste B (Mardi) - Interference
  {
    id: 'section_list_b',
    text: 'Liste B',
    type: 'section',
    required: false
  },
  {
    id: 'list_b',
    section: 'Liste B',
    text: 'Mardi (Liste B)',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'list_b_std',
    section: 'Liste B',
    text: 'Note Standard Liste B',
    type: 'number',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement selon les normes'
  },
  
  // Section: Rappel a Court Terme
  {
    id: 'section_short_term',
    text: 'Rappels Court Terme (Short Delay)',
    type: 'section',
    required: false
  },
  {
    id: 'sdfr',
    section: 'Rappels Court Terme (Short Delay)',
    text: 'Rappel libre a court terme',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'sdcr',
    section: 'Rappels Court Terme (Short Delay)',
    text: 'Rappel indice a court terme',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'sdfr_std',
    section: 'Rappels Court Terme (Short Delay)',
    text: 'Note Standard Rappel Libre Court Terme',
    type: 'text',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement selon les normes (z-score ou percentile selon age)'
  },
  {
    id: 'sdcr_std',
    section: 'Rappels Court Terme (Short Delay)',
    text: 'Note Standard Rappel Indice Court Terme',
    type: 'text',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement selon les normes (z-score ou percentile selon age)'
  },
  
  // Section: Rappel a Long Terme (20 min)
  {
    id: 'section_long_term',
    text: 'Rappels Long Terme (Long Delay)',
    type: 'section',
    required: false
  },
  {
    id: 'ldfr',
    section: 'Rappels Long Terme (Long Delay)',
    text: 'Rappel libre a long terme',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'ldcr',
    section: 'Rappels Long Terme (Long Delay)',
    text: 'Rappel indice a long terme',
    type: 'number',
    required: true,
    min: 0,
    max: 16
  },
  {
    id: 'ldfr_std',
    section: 'Rappels Long Terme (Long Delay)',
    text: 'Note Standard Rappel Libre Long Terme',
    type: 'text',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement selon les normes (z-score ou percentile selon age)'
  },
  {
    id: 'ldcr_std',
    section: 'Rappels Long Terme (Long Delay)',
    text: 'Note Standard Rappel Indice Long Terme',
    type: 'text',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement selon les normes (z-score ou percentile selon age)'
  },
  
  // Section: Indices de Strategie
  {
    id: 'section_strategy',
    text: 'Indices de Regroupement',
    type: 'section',
    required: false
  },
  {
    id: 'semantic_clustering',
    section: 'Indices de Regroupement',
    text: 'Indice de regroupement semantique',
    type: 'number',
    required: false,
    min: 0,
    max: 10
  },
  {
    id: 'serial_clustering',
    section: 'Indices de Regroupement',
    text: 'Indice de regroupement serial',
    type: 'number',
    required: false,
    min: 0,
    max: 30
  },
  {
    id: 'semantic_std',
    section: 'Indices de Regroupement',
    text: 'Note Standard Indice Semantique',
    type: 'text',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement selon les normes'
  },
  {
    id: 'serial_std',
    section: 'Indices de Regroupement',
    text: 'Note Standard Indice Serial (Centiles)',
    type: 'text',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement (percentile)'
  },
  
  // Section: Erreurs
  {
    id: 'section_errors',
    text: 'Erreurs',
    type: 'section',
    required: false
  },
  {
    id: 'perseverations',
    section: 'Erreurs',
    text: 'Total perseverations',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'intrusions',
    section: 'Erreurs',
    text: 'Total intrusions',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'persev_std',
    section: 'Erreurs',
    text: 'Note Standard Perseverations (Centiles)',
    type: 'text',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement (percentile)'
  },
  {
    id: 'intru_std',
    section: 'Erreurs',
    text: 'Note Standard Intrusions (Centiles)',
    type: 'text',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement (percentile)'
  },
  
  // Section: Reconnaissance (optionnel)
  {
    id: 'section_recognition',
    text: 'Reconnaissance',
    type: 'section',
    required: false
  },
  {
    id: 'recognition_hits',
    section: 'Reconnaissance',
    text: 'Reconnaissances correctes',
    type: 'number',
    required: false,
    min: 0,
    max: 16
  },
  {
    id: 'false_positives',
    section: 'Reconnaissance',
    text: 'Fausses reconnaissances',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'discriminability',
    section: 'Reconnaissance',
    text: 'Discriminabilite',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },
  {
    id: 'recog_std',
    section: 'Reconnaissance',
    text: 'Note Standard Reconnaissances (Centiles)',
    type: 'text',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement (percentile)'
  },
  {
    id: 'false_recog_std',
    section: 'Reconnaissance',
    text: 'Note Standard Fausses Reconnaissances (Centiles)',
    type: 'text',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement (percentile)'
  },
  {
    id: 'discrim_std',
    section: 'Reconnaissance',
    text: 'Note Standard Discriminabilite (Centiles)',
    type: 'text',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement (percentile)'
  },
  
  // Section: Effets de Region (optionnel)
  {
    id: 'section_region',
    text: 'Effets de Position & Biais',
    type: 'section',
    required: false
  },
  {
    id: 'primacy',
    section: 'Effets de Position & Biais',
    text: 'Primaute',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },
  {
    id: 'recency',
    section: 'Effets de Position & Biais',
    text: 'Recence',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },
  {
    id: 'response_bias',
    section: 'Effets de Position & Biais',
    text: 'Biais',
    type: 'number',
    required: false,
    min: -1,
    max: 1
  },
  {
    id: 'primacy_std',
    section: 'Effets de Position & Biais',
    text: 'Note Standard Primaute',
    type: 'number',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement selon les normes'
  },
  {
    id: 'recency_std',
    section: 'Effets de Position & Biais',
    text: 'Note Standard Recence',
    type: 'number',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement selon les normes'
  },
  {
    id: 'bias_std',
    section: 'Effets de Position & Biais',
    text: 'Note Standard Biais',
    type: 'number',
    required: false,
    readonly: true,
    help: 'Calcule automatiquement selon les normes'
  },
  
  // Section: Delai
  {
    id: 'section_delai',
    text: 'Delai',
    type: 'section',
    required: false
  },
  {
    id: 'cvlt_delai',
    section: 'Delai',
    text: 'Delai entre 1er rappels et rappels differes (en minutes)',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    help: 'Delai en minutes entre les premiers rappels et les rappels differes (typiquement 20 minutes)'
  }
];

export const CVLT_DEFINITION: QuestionnaireDefinition = {
  id: 'cvlt',
  code: 'CVLT_FR',
  title: 'WAIS-IV California Verbal Learning Test (CVLT)',
  description: 'Test d\'apprentissage verbal evaluant les strategies d\'encodage, de recuperation, et la memoire a court et long terme. Version francaise (Deweer et al., 2008).',
  questions: CVLT_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// WAIS-IV - Subtest Code (Processing Speed)
// ============================================================================

export const WAIS4_CODE_QUESTIONS: Question[] = [
  // Section: Donnees Demographiques
  {
    id: 'section_demo',
    text: 'Donnees Demographiques',
    type: 'section',
    required: false
  },
  {
    id: 'patient_age',
    section: 'Donnees Demographiques',
    text: 'Age du patient (calcule automatiquement)',
    type: 'number',
    required: true,
    readonly: true,
    min: 16,
    max: 90,
    help: 'Calcule automatiquement a partir de la date de naissance et de la date de visite'
  },
  
  // Section: Cotation
  {
    id: 'section_cotation',
    text: 'Cotation',
    type: 'section',
    required: false
  },
  {
    id: 'total_correct',
    section: 'Cotation',
    text: 'Nombre total de cases remplies de facon correctes',
    type: 'number',
    required: true,
    min: 0,
    max: 135
  },
  {
    id: 'total_errors',
    section: 'Cotation',
    text: 'Nombre de cases remplies de facon incorrecte',
    type: 'number',
    required: true,
    min: 0,
    max: 135
  }
];

export const WAIS4_CODE_DEFINITION: QuestionnaireDefinition = {
  id: 'wais4_code',
  code: 'WAIS4_CODE_FR',
  title: 'WAIS-IV Subtest Code',
  description: 'Subtest Code de l\'echelle d\'intelligence de Wechsler pour adultes (WAIS-IV). Evalue la vitesse de traitement graphique.',
  questions: WAIS4_CODE_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// WAIS-IV - Subtest Memoire des Chiffres (Digit Span)
// ============================================================================

export const WAIS4_DIGIT_SPAN_QUESTIONS: Question[] = [
  // Demographic section
  {
    id: 'section_demo',
    text: 'Donnees Demographiques',
    type: 'section',
    required: false,
    section: 'Donnees Demographiques'
  },
  {
    id: 'patient_age',
    section: 'Donnees Demographiques',
    text: 'Age du patient (calcule automatiquement)',
    type: 'number',
    required: true,
    readonly: true,
    min: 16,
    max: 90,
    help: 'Calcule automatiquement a partir de la date de naissance et de la date de visite'
  },
  
  // Section: Ordre Direct (Forward)
  {
    id: 'section_direct',
    text: 'Memoire des chiffres - Ordre Direct',
    type: 'section',
    required: false,
    section: 'Ordre Direct',
    help: 'Repetition de sequences de chiffres dans le meme ordre.'
  },
  {
    id: 'mcod_1a',
    section: 'Ordre Direct',
    text: 'Item 1 - Essai 1',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcod_1b',
    section: 'Ordre Direct',
    text: 'Item 1 - Essai 2',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcod_2a',
    section: 'Ordre Direct',
    text: 'Item 2 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcod_2b',
    section: 'Ordre Direct',
    text: 'Item 2 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcod_3a',
    section: 'Ordre Direct',
    text: 'Item 3 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcod_3b',
    section: 'Ordre Direct',
    text: 'Item 3 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcod_4a',
    section: 'Ordre Direct',
    text: 'Item 4 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcod_4b',
    section: 'Ordre Direct',
    text: 'Item 4 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcod_5a',
    section: 'Ordre Direct',
    text: 'Item 5 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcod_5b',
    section: 'Ordre Direct',
    text: 'Item 5 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcod_6a',
    section: 'Ordre Direct',
    text: 'Item 6 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcod_6b',
    section: 'Ordre Direct',
    text: 'Item 6 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcod_7a',
    section: 'Ordre Direct',
    text: 'Item 7 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcod_7b',
    section: 'Ordre Direct',
    text: 'Item 7 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcod_8a',
    section: 'Ordre Direct',
    text: 'Item 8 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcod_8b',
    section: 'Ordre Direct',
    text: 'Item 8 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  
  // Section: Ordre Inverse (Backward)
  {
    id: 'section_inverse',
    text: 'Memoire des chiffres - Ordre Inverse',
    type: 'section',
    required: false,
    section: 'Ordre Inverse',
    help: 'Repetition de sequences de chiffres dans l\'ordre inverse.'
  },
  {
    id: 'mcoi_1a',
    section: 'Ordre Inverse',
    text: 'Item 1 - Essai 1',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoi_1b',
    section: 'Ordre Inverse',
    text: 'Item 1 - Essai 2',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoi_2a',
    section: 'Ordre Inverse',
    text: 'Item 2 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoi_2b',
    section: 'Ordre Inverse',
    text: 'Item 2 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoi_3a',
    section: 'Ordre Inverse',
    text: 'Item 3 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoi_3b',
    section: 'Ordre Inverse',
    text: 'Item 3 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoi_4a',
    section: 'Ordre Inverse',
    text: 'Item 4 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoi_4b',
    section: 'Ordre Inverse',
    text: 'Item 4 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoi_5a',
    section: 'Ordre Inverse',
    text: 'Item 5 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoi_5b',
    section: 'Ordre Inverse',
    text: 'Item 5 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoi_6a',
    section: 'Ordre Inverse',
    text: 'Item 6 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoi_6b',
    section: 'Ordre Inverse',
    text: 'Item 6 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoi_7a',
    section: 'Ordre Inverse',
    text: 'Item 7 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoi_7b',
    section: 'Ordre Inverse',
    text: 'Item 7 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoi_8a',
    section: 'Ordre Inverse',
    text: 'Item 8 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoi_8b',
    section: 'Ordre Inverse',
    text: 'Item 8 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  
  // Section: Ordre Croissant (Sequencing)
  {
    id: 'section_croissant',
    text: 'Memoire des chiffres - Ordre Croissant',
    type: 'section',
    required: false,
    section: 'Ordre Croissant',
    help: 'Repetition de sequences de chiffres dans l\'ordre croissant.'
  },
  {
    id: 'mcoc_1a',
    section: 'Ordre Croissant',
    text: 'Item 1 - Essai 1',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoc_1b',
    section: 'Ordre Croissant',
    text: 'Item 1 - Essai 2',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoc_2a',
    section: 'Ordre Croissant',
    text: 'Item 2 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoc_2b',
    section: 'Ordre Croissant',
    text: 'Item 2 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoc_3a',
    section: 'Ordre Croissant',
    text: 'Item 3 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoc_3b',
    section: 'Ordre Croissant',
    text: 'Item 3 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoc_4a',
    section: 'Ordre Croissant',
    text: 'Item 4 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoc_4b',
    section: 'Ordre Croissant',
    text: 'Item 4 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoc_5a',
    section: 'Ordre Croissant',
    text: 'Item 5 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoc_5b',
    section: 'Ordre Croissant',
    text: 'Item 5 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoc_6a',
    section: 'Ordre Croissant',
    text: 'Item 6 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoc_6b',
    section: 'Ordre Croissant',
    text: 'Item 6 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoc_7a',
    section: 'Ordre Croissant',
    text: 'Item 7 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoc_7b',
    section: 'Ordre Croissant',
    text: 'Item 7 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoc_8a',
    section: 'Ordre Croissant',
    text: 'Item 8 - Essai 1',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  },
  {
    id: 'mcoc_8b',
    section: 'Ordre Croissant',
    text: 'Item 8 - Essai 2',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Incorrect', score: 0 },
      { code: 1, label: 'Correct', score: 1 }
    ]
  }
];

export const WAIS4_DIGIT_SPAN_DEFINITION: QuestionnaireDefinition = {
  id: 'wais4_digit_span',
  code: 'WAIS4_DIGIT_SPAN_FR',
  title: 'WAIS-IV Subtest Memoire des chiffres (Digit Span)',
  description: 'Subtest evaluant la memoire de travail auditive via trois taches : ordre direct, ordre inverse et ordre croissant.',
  questions: WAIS4_DIGIT_SPAN_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Trail Making Test (TMT) - Reitan 1955
// ============================================================================

export const TMT_QUESTIONS: Question[] = [
  // Section: Informations demographiques
  {
    id: 'section_demo',
    text: 'Informations demographiques',
    type: 'section',
    required: false
  },
  {
    id: 'patient_age',
    text: 'Age du patient (calcule automatiquement)',
    type: 'number',
    required: true,
    readonly: true,
    min: 16,
    max: 100,
    help: 'Calcule automatiquement a partir de la date de naissance et de la date de visite'
  },
  {
    id: 'years_of_education',
    text: 'Annees de scolarisation (calculees automatiquement)',
    type: 'number',
    required: true,
    readonly: true,
    min: 0,
    max: 30,
    help: 'Calcule automatiquement depuis le profil du patient'
  },
  // Section: Partie A
  {
    id: 'section_partie_a',
    text: 'Partie A',
    type: 'section',
    required: false
  },
  {
    id: 'tmta_tps',
    text: 'Temps de realisation (en secondes)',
    type: 'number',
    required: true,
    min: 0,
    max: 600
  },
  {
    id: 'tmta_err',
    text: "Nombre d'erreurs non corrigees a la partie A du TMT",
    type: 'number',
    required: true,
    min: 0,
    max: 50
  },
  {
    id: 'tmta_cor',
    text: "Nombre d'erreurs corrigees a la partie A du TMT",
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  // Section: Partie B
  {
    id: 'section_partie_b',
    text: 'Partie B',
    type: 'section',
    required: false
  },
  {
    id: 'tmtb_tps',
    text: 'Temps pour effectuer la partie B en secondes',
    type: 'number',
    required: true,
    min: 0,
    max: 600
  },
  {
    id: 'tmtb_err',
    text: "Nombre d'erreurs non corrigees a la partie B du TMT",
    type: 'number',
    required: true,
    min: 0,
    max: 50
  },
  {
    id: 'tmtb_cor',
    text: "Nombre d'erreurs corrigees a la partie B du TMT",
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'tmtb_err_persev',
    text: "Nombre d'erreurs perseveratives",
    type: 'number',
    required: true,
    min: 0,
    max: 50
  },
  // Section: Scores calcules
  {
    id: 'section_scores',
    text: 'Scores calcules',
    type: 'section',
    required: false
  },
  // Part A scores
  {
    id: 'tmta_errtot',
    text: 'Partie A - Nombre total d\'erreurs',
    help: 'Somme des erreurs non corrigees et corrigees',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'tmta_tps_z',
    text: 'Partie A - Z-score Temps',
    help: 'Score Z normalise pour le temps de realisation (norme selon age et education)',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'tmta_tps_pc',
    text: 'Partie A - Percentile Temps',
    help: 'Rang percentile pour le temps de realisation',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'tmta_errtot_z',
    text: 'Partie A - Z-score Erreurs',
    help: 'Score Z normalise pour le nombre total d\'erreurs',
    type: 'number',
    required: false,
    readonly: true
  },
  // Part B scores
  {
    id: 'tmtb_errtot',
    text: 'Partie B - Nombre total d\'erreurs',
    help: 'Somme des erreurs non corrigees et corrigees',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'tmtb_tps_z',
    text: 'Partie B - Z-score Temps',
    help: 'Score Z normalise pour le temps de realisation (norme selon age et education)',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'tmtb_tps_pc',
    text: 'Partie B - Percentile Temps',
    help: 'Rang percentile pour le temps de realisation',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'tmtb_errtot_z',
    text: 'Partie B - Z-score Erreurs',
    help: 'Score Z normalise pour le nombre total d\'erreurs',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'tmtb_err_persev_z',
    text: 'Partie B - Z-score Erreurs perseveratives',
    help: 'Score Z normalise pour le nombre d\'erreurs perseveratives',
    type: 'number',
    required: false,
    readonly: true
  },
  // B-A difference scores
  {
    id: 'tmt_b_a_tps',
    text: 'Difference B-A - Temps (secondes)',
    help: 'Difference de temps entre Partie B et Partie A',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'tmt_b_a_tps_z',
    text: 'Difference B-A - Z-score Temps',
    help: 'Score Z normalise pour la difference de temps B-A',
    type: 'number',
    required: false,
    readonly: true
  }
];

export const TMT_DEFINITION: QuestionnaireDefinition = {
  id: 'tmt',
  code: 'TMT_FR',
  title: 'Trail Making Test (Reitan, 1955)',
  description: 'Test neuropsychologique evaluant l\'attention visuelle et la flexibilite cognitive.',
  questions: TMT_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Stroop Test (Golden 1978)
// ============================================================================

export const STROOP_QUESTIONS: Question[] = [
  // Section: Informations demographiques
  {
    id: 'section_demo',
    text: 'Informations demographiques',
    type: 'section',
    required: false
  },
  {
    id: 'patient_age',
    text: 'Age du patient (calcule automatiquement)',
    type: 'number',
    required: true,
    readonly: true,
    min: 16,
    max: 100,
    help: 'Calcule automatiquement a partir de la date de naissance et de la date de visite'
  },
  // Section: Planche A - Mots
  {
    id: 'section_planche_a',
    text: 'Planche A - Mots',
    type: 'section',
    required: false
  },
  {
    id: 'stroop_w_tot',
    text: 'Nombre total de mots lus en 45 secondes',
    type: 'number',
    required: true,
    min: 0,
    max: 200
  },
  {
    id: 'stroop_w_tot_c',
    text: 'Valeur corrigee suivant l\'age',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'stroop_w_cor',
    text: 'Nombre d\'erreurs corrigees',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'stroop_w_err',
    text: 'Nombre d\'erreurs non corrigees',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'stroop_w_note_t',
    text: 'Note T',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'stroop_w_note_t_corrigee',
    text: 'Note Z',
    type: 'number',
    required: false,
    readonly: true
  },
  // Section: Planche B - Couleurs
  {
    id: 'section_planche_b',
    text: 'Planche B - Couleurs',
    type: 'section',
    required: false
  },
  {
    id: 'stroop_c_tot',
    text: 'Nombre total de couleurs nommees en 45 secondes',
    type: 'number',
    required: true,
    min: 0,
    max: 150
  },
  {
    id: 'stroop_c_tot_c',
    text: 'Valeur corrigee suivant l\'age',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'stroop_c_cor',
    text: 'Nombre d\'erreurs corrigees',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'stroop_c_err',
    text: 'Nombre d\'erreurs non corrigees',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'stroop_c_note_t',
    text: 'Note T',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'stroop_c_note_t_corrigee',
    text: 'Note Z',
    type: 'number',
    required: false,
    readonly: true
  },
  // Section: Planche C - Mots/Couleurs
  {
    id: 'section_planche_c',
    text: 'Planche C - Mots/Couleurs',
    type: 'section',
    required: false
  },
  {
    id: 'stroop_cw_tot',
    text: 'Nombre total de couleur de l\'encre nommee en 45 secondes',
    help: 'Le sujet doit nommer la couleur de l\'encre et non lire le mot',
    type: 'number',
    required: true,
    min: 0,
    max: 100
  },
  {
    id: 'stroop_cw_tot_c',
    text: 'Valeur corrigee suivant l\'age',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'stroop_cw_cor',
    text: 'Nombre d\'erreurs corrigees',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'stroop_cw_err',
    text: 'Nombre d\'erreurs non corrigees',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'stroop_cw_note_t',
    text: 'Note T',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'stroop_cw_note_t_corrigee',
    text: 'Note Z',
    type: 'number',
    required: false,
    readonly: true
  },
  // Section: Interference
  {
    id: 'section_interf',
    text: 'Interference',
    type: 'section',
    required: false
  },
  {
    id: 'stroop_interf',
    text: 'Interference',
    help: 'Mesure la capacite d\'inhibition cognitive',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'stroop_interf_note_t',
    text: 'Note T',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'stroop_interf_note_tz',
    text: 'Note Z',
    type: 'number',
    required: false,
    readonly: true
  }
];

export const STROOP_DEFINITION: QuestionnaireDefinition = {
  id: 'stroop',
  code: 'STROOP_FR',
  title: 'Test de Stroop (version Golden, 1978)',
  description: 'Test neuropsychologique evaluant les fonctions executives et l\'inhibition.',
  questions: STROOP_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Fluences Verbales (Cardebat et al., 1990)
// ============================================================================

export const FLUENCES_VERBALES_QUESTIONS: Question[] = [
  // Section: Informations demographiques
  {
    id: 'section_demo',
    text: 'Informations demographiques',
    type: 'section',
    required: false
  },
  {
    id: 'patient_age',
    text: 'Age du patient (calcule automatiquement)',
    type: 'number',
    required: true,
    readonly: true,
    min: 16,
    max: 100,
    help: 'Calcule automatiquement a partir de la date de naissance et de la date de visite'
  },
  {
    id: 'years_of_education',
    text: 'Annees de scolarisation',
    type: 'number',
    required: true,
    min: 0,
    max: 30
  },
  // Section: Lettre P (Phonemique)
  {
    id: 'section_lettre_p',
    text: 'Lettre P (Phonemique)',
    type: 'section',
    required: false
  },
  {
    id: 'fv_p_tot_correct',
    text: 'Nombre total de mots corrects lettre P',
    type: 'number',
    required: true,
    min: 0,
    max: 100
  },
  {
    id: 'fv_p_deriv',
    text: 'Mots derives lettre P (MD)',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'fv_p_intrus',
    text: 'Intrusions lettre P (I)',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'fv_p_propres',
    text: 'Noms propres lettre P (NP)',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'fv_p_tot_rupregle',
    text: 'Total ruptures de regle (MD + I + NP)',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'fv_p_tot_correct_z',
    text: 'Z-score lettre P',
    help: 'Score Z normalise selon age et education',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'fv_p_tot_correct_pc',
    text: 'Percentile lettre P',
    help: 'Rang percentile selon age et education',
    type: 'number',
    required: false,
    readonly: true
  },
  // Section: Categorie Animaux (Semantique)
  {
    id: 'section_animaux',
    text: 'Categorie Animaux (Semantique)',
    type: 'section',
    required: false
  },
  {
    id: 'fv_anim_tot_correct',
    text: 'Nombre total de mots corrects categorie animaux',
    type: 'number',
    required: true,
    min: 0,
    max: 100
  },
  {
    id: 'fv_anim_deriv',
    text: 'Mots derives categorie animaux (MD)',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'fv_anim_intrus',
    text: 'Intrusions categorie animaux (I)',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'fv_anim_propres',
    text: 'Noms propres categorie animaux (NP)',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'fv_anim_tot_rupregle',
    text: 'Total ruptures de regle (MD + I + NP)',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'fv_anim_tot_correct_z',
    text: 'Z-score categorie animaux',
    help: 'Score Z normalise selon age et education',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'fv_anim_tot_correct_pc',
    text: 'Percentile categorie animaux',
    help: 'Rang percentile selon age et education',
    type: 'number',
    required: false,
    readonly: true
  }
];

export const FLUENCES_VERBALES_DEFINITION: QuestionnaireDefinition = {
  id: 'fluences_verbales',
  code: 'FLUENCES_VERBALES_FR',
  title: 'Fluences verbales (Cardebat et al., 1990)',
  description: 'Test neuropsychologique evaluant la fluence verbale (phonemique et semantique).',
  questions: FLUENCES_VERBALES_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// COBRA - Cognitive Complaints in Bipolar Disorder Rating Assessment
// ============================================================================

const COBRA_OPTIONS = [
  { code: 0, label: "Jamais", score: 0 },
  { code: 1, label: "Parfois", score: 1 },
  { code: 2, label: "Frequemment", score: 2 },
  { code: 3, label: "Toujours", score: 3 }
];

export const COBRA_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: '1. Vous est-il difficile de vous souvenir de nom de personnes ?',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q2',
    text: '2. Vous est-il difficile de retrouver des objets du quotidien (cles, lunettes, montre, ...) ?',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q3',
    text: '3. Eprouvez-vous des difficultes a vous souvenir d\'evenements qui ont ete importants pour vous ?',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q4',
    text: '4. Vous est-il difficile de situer dans le temps ces memes evenements ?',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q5',
    text: '5. Faites-vous un effort pour vous concentrer en lisant un livre, un journal, ... ?',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q6',
    text: '6. Vous est-il difficile de vous souvenir de ce que vous avez lu ou ce qu\'on vous a dit recemment ?',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q7',
    text: '7. Avez-vous le sentiment de ne pas terminer ce que vous commencez ?',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q8',
    text: '8. Avez-vous besoin de plus de temps pour realiser les taches quotidiennes ?',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q9',
    text: '9. Vous est-il arrive d\'etre desoriente dans la rue ?',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q10',
    text: '10. Lorsque l\'on vous rappelle une conversation ou une remarque, avez-vous l\'impression que c\'est la premiere fois que vous entendez cette information ?',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q11',
    text: '11. Vous est-il difficile de trouver les mots adequats pour exprimer vos idees ?',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q12',
    text: '12. Vous deconcentrez-vous facilement ?',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q13',
    text: '13. Les calculs mentaux simples vous semblent-ils compliques ?',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q14',
    text: '14. Avez-vous l\'impression de perdre le fil de la conversation ?',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q15',
    text: '15. Avez-vous remarque s\'il vous est difficile d\'apprendre de nouvelles informations ?',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'q16',
    text: '16. Vous est-il difficile de maintenir votre attention sur une tache de longue duree ?',
    type: 'single_choice',
    required: true,
    options: COBRA_OPTIONS
  },
  {
    id: 'total_score',
    text: 'Score COBRA Total',
    help: 'Score total (0-48). Score eleve = plaintes cognitives importantes.',
    type: 'number',
    required: false,
    readonly: true
  }
];

export const COBRA_DEFINITION: QuestionnaireDefinition = {
  id: 'cobra',
  code: 'COBRA_FR',
  title: 'COBRA - Cognitive Complaints in Bipolar Disorder Rating Assessment',
  description: 'Auto-questionnaire evaluant les plaintes cognitives dans le trouble bipolaire.',
  questions: COBRA_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// CPT-III - Conners' Continuous Performance Test III
// ============================================================================

const CPT3_DETECTABILITY_INTERP_OPTIONS = [
  { code: 'Very elevated', label: "Very elevated" },
  { code: 'Elevated', label: "Elevated" },
  { code: 'High average', label: "High average" },
  { code: 'Average', label: "Average" },
  { code: 'Low', label: "Low" }
];

const CPT3_REACTION_TIME_INTERP_OPTIONS = [
  { code: 'Atypically slow', label: "Atypically slow" },
  { code: 'A little slow', label: "A little slow" },
  { code: 'Slow', label: "Slow" },
  { code: 'Average', label: "Average" },
  { code: 'A little fast', label: "A little fast" },
  { code: 'Fast', label: "Fast" }
];

export const CPT3_QUESTIONS: Question[] = [
  // Section: Detectability
  {
    id: 'section_detectability',
    text: 'Detectability',
    type: 'section',
    required: false
  },
  {
    id: 'd_prime',
    text: "d' (Detectabilite)",
    type: 'number',
    required: false
  },
  {
    id: 'd_prime_interp',
    text: "d' (Interpretation)",
    type: 'single_choice',
    required: false,
    options: CPT3_DETECTABILITY_INTERP_OPTIONS
  },
  // Section: Errors
  {
    id: 'section_errors',
    text: 'Erreurs',
    type: 'section',
    required: false
  },
  {
    id: 'omissions',
    text: 'Omissions',
    type: 'number',
    required: false
  },
  {
    id: 'omissions_interp',
    text: 'Omissions (Interpretation)',
    type: 'single_choice',
    required: false,
    options: CPT3_DETECTABILITY_INTERP_OPTIONS
  },
  {
    id: 'commissions',
    text: 'Commissions',
    type: 'number',
    required: false
  },
  {
    id: 'commissions_interp',
    text: 'Commissions (Interpretation)',
    type: 'single_choice',
    required: false,
    options: CPT3_DETECTABILITY_INTERP_OPTIONS
  },
  {
    id: 'perseverations',
    text: 'Perseverations',
    type: 'number',
    required: false
  },
  {
    id: 'perseverations_interp',
    text: 'Perseverations (Interpretation)',
    type: 'single_choice',
    required: false,
    options: CPT3_DETECTABILITY_INTERP_OPTIONS
  },
  // Section: Reaction Time Statistics
  {
    id: 'section_reaction_time',
    text: 'Statistiques de temps de reaction',
    type: 'section',
    required: false
  },
  {
    id: 'hrt',
    text: 'HRT (Hit Reaction Time)',
    type: 'number',
    required: false
  },
  {
    id: 'hrt_interp',
    text: 'HRT (Interpretation)',
    type: 'single_choice',
    required: false,
    options: CPT3_REACTION_TIME_INTERP_OPTIONS
  },
  {
    id: 'hrt_sd',
    text: 'HRT SD (Ecart-type)',
    type: 'number',
    required: false
  },
  {
    id: 'hrt_sd_interp',
    text: 'HRT SD (Interpretation)',
    type: 'single_choice',
    required: false,
    options: CPT3_REACTION_TIME_INTERP_OPTIONS
  },
  {
    id: 'variability',
    text: 'Variabilite',
    type: 'number',
    required: false
  },
  {
    id: 'variability_interp',
    text: 'Variabilite (Interpretation)',
    type: 'single_choice',
    required: false,
    options: CPT3_REACTION_TIME_INTERP_OPTIONS
  },
  {
    id: 'hrt_block_change',
    text: 'HRT Block Change',
    type: 'number',
    required: false
  },
  {
    id: 'hrt_block_change_interp',
    text: 'HRT Block Change (Interpretation)',
    type: 'single_choice',
    required: false,
    options: CPT3_REACTION_TIME_INTERP_OPTIONS
  },
  {
    id: 'hrt_isi_change',
    text: 'HRT ISI Change',
    type: 'number',
    required: false
  },
  {
    id: 'hrt_isi_change_interp',
    text: 'HRT ISI Change (Interpretation)',
    type: 'single_choice',
    required: false,
    options: CPT3_REACTION_TIME_INTERP_OPTIONS
  }
];

export const CPT3_DEFINITION: QuestionnaireDefinition = {
  id: 'cpt3',
  code: 'CPT3_FR',
  title: 'CPT-III - Conners\' Continuous Performance Test III',
  description: 'Evaluation informatisee des problemes d\'attention. Les resultats sont saisis depuis le rapport du logiciel.',
  questions: CPT3_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// WAIS-IV Similitudes
// ============================================================================

const WAIS4_SIMI_OPTIONS = [
  { code: 0, label: "0", score: 0 },
  { code: 1, label: "1", score: 1 },
  { code: 2, label: "2", score: 2 }
];

export const WAIS4_SIMILITUDES_QUESTIONS: Question[] = [
  // Patient age for scoring
  {
    id: 'section_info',
    text: 'Informations',
    type: 'section',
    required: false
  },
  {
    id: 'patient_age',
    text: 'Age du patient (calcule automatiquement)',
    type: 'number',
    required: true,
    readonly: true,
    min: 16,
    max: 90,
    help: 'Calcule automatiquement a partir de la date de naissance et de la date de visite'
  },
  // Items section
  {
    id: 'section_items',
    text: 'Items',
    type: 'section',
    required: false
  },
  {
    id: 'item1',
    text: '1. Framboise-Groseille',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  {
    id: 'item2',
    text: '2. Cheval-Tigre',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  {
    id: 'item3',
    text: '3. Carottes-Epinards',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  {
    id: 'item4',
    text: '4. Jaune-Bleu',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  {
    id: 'item5',
    text: '5. Piano-Tambour',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  {
    id: 'item6',
    text: '6. Poeme-Statue',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  {
    id: 'item7',
    text: '7. Bourgeon-Bebe',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  {
    id: 'item8',
    text: '8. Miel-Lait',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  {
    id: 'item9',
    text: '9. Nourriture-Carburant',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  {
    id: 'item10',
    text: '10. Cube-Cylindre',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  {
    id: 'item11',
    text: '11. Nez-Langue',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  {
    id: 'item12',
    text: '12. Soie-Laine',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  {
    id: 'item13',
    text: '13. Eolienne-Barrage',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  {
    id: 'item14',
    text: '14. Ephemere-Permanent',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  {
    id: 'item15',
    text: '15. Inondation-Secheresse',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  {
    id: 'item16',
    text: '16. Sedentaire-Nomade',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  {
    id: 'item17',
    text: '17. Autoriser-Interdire',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  {
    id: 'item18',
    text: '18. Realite-Reve',
    type: 'single_choice',
    required: true,
    options: WAIS4_SIMI_OPTIONS
  },
  // Scores section
  {
    id: 'section_scores',
    text: 'Scores',
    type: 'section',
    required: false
  },
  {
    id: 'total_raw_score',
    text: 'Total - Note brute',
    help: 'Somme des 18 items (0-36)',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'standard_score',
    text: 'Note standard',
    help: 'Score standard selon l\'age (1-19)',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'standardized_value',
    text: 'Valeur standardisee',
    help: '(Note standard - 10) / 3',
    type: 'number',
    required: false,
    readonly: true
  }
];

export const WAIS4_SIMILITUDES_DEFINITION: QuestionnaireDefinition = {
  id: 'wais4_similitudes',
  code: 'WAIS4_SIMILITUDES_FR',
  title: 'Similitudes (WAIS-IV)',
  description: 'Sous-test de la WAIS-IV evaluant le raisonnement verbal et la formation de concepts.',
  questions: WAIS4_SIMILITUDES_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Test des Commissions
// ============================================================================

export const TEST_COMMISSIONS_QUESTIONS: Question[] = [
  // Clinical Criteria Section
  {
    id: 'section_criteria',
    text: 'Criteres cliniques',
    type: 'section',
    required: false
  },
  {
    id: 'patient_age',
    text: 'Age du patient (calcule automatiquement)',
    type: 'number',
    required: true,
    readonly: true,
    min: 20,
    max: 60,
    help: 'Calcule automatiquement a partir de la date de naissance et de la date de visite'
  },
  {
    id: 'nsc',
    text: 'Niveau etude',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "< baccalaureat", score: 0 },
      { code: 1, label: ">= baccalaureat", score: 1 }
    ]
  },
  // Time Section
  {
    id: 'section_temps',
    text: 'Temps',
    type: 'section',
    required: false
  },
  {
    id: 'com01',
    text: 'Temps de realisation (en minutes)',
    type: 'number',
    required: true,
    min: 0
  },
  {
    id: 'com01s1',
    text: 'Temps de realisation (Percentile)',
    type: 'text',
    required: false,
    readonly: true
  },
  {
    id: 'com01s2',
    text: 'Temps de realisation (Note z)',
    type: 'number',
    required: false,
    readonly: true
  },
  // Errors Section
  {
    id: 'section_erreurs',
    text: 'Erreurs',
    type: 'section',
    required: false
  },
  {
    id: 'com02',
    text: 'Nombre de detours inutiles',
    type: 'number',
    required: true,
    min: 0
  },
  {
    id: 'com02s1',
    text: 'Nombre de detours inutiles (Percentile)',
    type: 'text',
    required: false,
    readonly: true
  },
  {
    id: 'com02s2',
    text: 'Nombre de detours inutiles (Note z)',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'com03',
    text: 'Nombre de trajets avec non respect des horaires',
    type: 'number',
    required: true,
    min: 0
  },
  {
    id: 'com03s1',
    text: 'Nombre de trajets avec non respect des horaires (Percentile)',
    type: 'text',
    required: false,
    readonly: true
  },
  {
    id: 'com03s2',
    text: 'Nombre de trajets avec non respect des horaires (Note z)',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'com04',
    text: 'Nombre d\'erreurs logiques',
    type: 'number',
    required: true,
    min: 0
  },
  {
    id: 'com04s1',
    text: 'Nombre d\'erreurs logiques (Percentile)',
    type: 'text',
    required: false,
    readonly: true
  },
  {
    id: 'com04s2',
    text: 'Nombre d\'erreurs logiques (Note z)',
    type: 'number',
    required: false,
    readonly: true
  },
  // Total Section
  {
    id: 'section_total',
    text: 'Total',
    type: 'section',
    required: false
  },
  {
    id: 'com04s3',
    text: 'Nombre d\'erreurs total',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'com04s4',
    text: 'Nombre d\'erreurs total (Percentile)',
    type: 'text',
    required: false,
    readonly: true
  },
  {
    id: 'com04s5',
    text: 'Nombre d\'erreurs total (Note z)',
    type: 'number',
    required: false,
    readonly: true
  },
  // Sequence Section
  {
    id: 'section_sequence',
    text: 'Sequence',
    type: 'section',
    required: false
  },
  {
    id: 'com05',
    text: 'Sequence des commissions realisees par le patient',
    type: 'text',
    required: false
  }
];

export const TEST_COMMISSIONS_DEFINITION: QuestionnaireDefinition = {
  id: 'test_commissions',
  code: 'TEST_COMMISSIONS_FR',
  title: 'Test des Commissions',
  description: 'Test neuropsychologique evaluant les fonctions executives et la memoire.',
  questions: TEST_COMMISSIONS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// SCIP - Screening Assessment for Cognitive Impairment in Psychiatry
// ============================================================================

export const SCIP_QUESTIONS: Question[] = [
  // Apprentissage Verbal Immediat
  {
    id: 'section_scipv01',
    text: 'Apprentissage Verbal Immediat',
    type: 'section',
    required: false
  },
  {
    id: 'scipv01a',
    text: 'Score saisi (sum/24)',
    type: 'number',
    required: true,
    min: 0,
    max: 24
  },
  {
    id: 'scipv01b',
    text: 'Score Z',
    help: '(score - 23.59) / 2.87',
    type: 'number',
    required: false,
    readonly: true
  },
  // Memoire de Travail
  {
    id: 'section_scipv02',
    text: 'Memoire de Travail',
    type: 'section',
    required: false
  },
  {
    id: 'scipv02a',
    text: 'Score saisi (sum/24)',
    type: 'number',
    required: true,
    min: 0,
    max: 24
  },
  {
    id: 'scipv02b',
    text: 'Score Z',
    help: '(score - 20.66) / 2.45',
    type: 'number',
    required: false,
    readonly: true
  },
  // Fluence Verbale
  {
    id: 'section_scipv03',
    text: 'Fluence Verbale',
    type: 'section',
    required: false
  },
  {
    id: 'scipv03a',
    text: 'Score saisi (sum/24)',
    type: 'number',
    required: true,
    min: 0,
    max: 24
  },
  {
    id: 'scipv03b',
    text: 'Score Z',
    help: '(score - 17.44) / 4.74',
    type: 'number',
    required: false,
    readonly: true
  },
  // Rappel Verbal Differe
  {
    id: 'section_scipv04',
    text: 'Rappel Verbal Differe',
    type: 'section',
    required: false
  },
  {
    id: 'scipv04a',
    text: 'Score saisi (sum/24)',
    type: 'number',
    required: true,
    min: 0,
    max: 24
  },
  {
    id: 'scipv04b',
    text: 'Score Z',
    help: '(score - 7.65) / 1.90',
    type: 'number',
    required: false,
    readonly: true
  },
  // Capacites Visuomotrices
  {
    id: 'section_scipv05',
    text: 'Capacites Visuomotrices',
    type: 'section',
    required: false
  },
  {
    id: 'scipv05a',
    text: 'Score saisi (sum/24)',
    type: 'number',
    required: true,
    min: 0,
    max: 24
  },
  {
    id: 'scipv05b',
    text: 'Score Z',
    help: '(score - 14.26) / 2.25',
    type: 'number',
    required: false,
    readonly: true
  }
];

export const SCIP_DEFINITION: QuestionnaireDefinition = {
  id: 'scip',
  code: 'SCIP_FR',
  title: 'SCIP - Screening Assessment for Cognitive Impairment in Psychiatry',
  description: 'Outil de depistage rapide des troubles cognitifs en psychiatrie.',
  questions: SCIP_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// WAIS-III Questionnaires (Separate storage from WAIS-IV, same questions)
// ============================================================================

export const WAIS3_CVLT_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_cvlt',
  code: 'WAIS3_CVLT_FR',
  title: 'WAIS-III - California Verbal Learning Test (CVLT)',
  description: 'Test d\'apprentissage verbal - Version WAIS-III',
  questions: CVLT_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

export const WAIS3_TMT_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_tmt',
  code: 'WAIS3_TMT_FR',
  title: 'WAIS-III - Trail Making Test (TMT)',
  description: 'Test de piste - Version WAIS-III',
  questions: TMT_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

export const WAIS3_STROOP_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_stroop',
  code: 'WAIS3_STROOP_FR',
  title: 'WAIS-III - Test de Stroop',
  description: 'Test d\'interference couleur-mot - Version WAIS-III',
  questions: STROOP_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

export const WAIS3_FLUENCES_VERBALES_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_fluences_verbales',
  code: 'WAIS3_FLUENCES_VERBALES_FR',
  title: 'WAIS-III - Fluences Verbales',
  description: 'Fluences verbales phonemique et semantique - Version WAIS-III',
  questions: FLUENCES_VERBALES_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// WAIS-III Clinical Criteria (Critères cliniques) - Reuses WAIS-IV questions
// ============================================================================

export const WAIS3_CRITERIA_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_criteria',
  code: 'WAIS3_CRITERIA_FR',
  title: 'WAIS-III - Critères cliniques',
  description: 'Fiche de recueil des critères cliniques et démographiques pour la passation de la WAIS-III.',
  questions: WAIS4_CRITERIA_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// WAIS-III Learning Disorders - Reuses WAIS-IV questions
// ============================================================================

export const WAIS3_LEARNING_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_learning',
  code: 'WAIS3_LEARNING_FR',
  title: 'WAIS-III - Troubles des acquisitions et des apprentissages',
  description: 'Liste de contrôle des antécédents de troubles des acquisitions et des apprentissages.',
  questions: WAIS4_LEARNING_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// WAIS-III Vocabulaire (Wechsler, 1997)
// ============================================================================

const WAIS3_VOCABULAIRE_OPTIONS: QuestionOption[] = [
  { code: 0, label: '0 - Réponse incorrecte', score: 0 },
  { code: 1, label: '1 - Réponse partielle', score: 1 },
  { code: 2, label: '2 - Réponse correcte', score: 2 }
];

export const WAIS3_VOCABULAIRE_QUESTIONS: Question[] = [
  { id: 'item1', text: '1. Bateau', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item2', text: '2. Fauteuil', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item3', text: '3. Bol', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item4', text: '4. Instruire', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item5', text: '5. Hier', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item6', text: '6. Arracher', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item7', text: '7. Sanction', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item8', text: '8. Refuge', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item9', text: '9. Calendrier', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item10', text: '10. Baleine', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item11', text: '11. Mime', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item12', text: '12. Persévérer', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item13', text: '13. Sauvage', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item14', text: '14. Héréditaire', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item15', text: '15. Connivence', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item16', text: '16. Grandiose', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item17', text: '17. Confier', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item18', text: '18. Vigoureux', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item19', text: '19. Contracter', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item20', text: '20. Initiative', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item21', text: '21. Esquisse', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item22', text: '22. Irritable', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item23', text: '23. Invectiver', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item24', text: '24. Hétérogène', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item25', text: '25. Assimiler', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item26', text: '26. Concertation', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item27', text: '27. Emulation', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item28', text: '28. Pittoresque', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item29', text: '29. Evasif', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item30', text: '30. Elaborer', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item31', text: '31. Prosaïque', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item32', text: '32. Apologie', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  { id: 'item33', text: '33. Conjecture', type: 'single_choice', required: true, options: WAIS3_VOCABULAIRE_OPTIONS },
  // Score section
  {
    id: 'section_scores',
    text: 'Score',
    type: 'section',
    required: false
  },
  {
    id: 'total_raw_score',
    text: 'Note brute totale (0-66)',
    type: 'number',
    required: false,
    readonly: true,
    help: 'Somme des scores des 33 items (calculé automatiquement)'
  }
];

export const WAIS3_VOCABULAIRE_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_vocabulaire',
  code: 'WAIS3_VOCABULAIRE_FR',
  title: 'WAIS-III - Subtest Vocabulaire',
  description: 'Subtest Vocabulaire de la WAIS-III (Wechsler, 1997) - Évaluation des connaissances lexicales.',
  questions: WAIS3_VOCABULAIRE_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// WAIS-III - Subtest Matrices
// ============================================================================
export const WAIS3_MATRICES_QUESTIONS: Question[] = [
  // Demographics section
  {
    id: 'patient_age',
    text: 'Âge du patient (calculé automatiquement)',
    type: 'number',
    required: true,
    readonly: true,
    section: 'Données démographiques',
    min: 16,
    max: 90,
    help: 'Calculé automatiquement à partir de la date de naissance et de la date de visite'
  },
  // Item scores section
  {
    id: 'item_01',
    text: 'Note pour l\'item 1',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_02',
    text: 'Note pour l\'item 2',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_03',
    text: 'Note pour l\'item 3',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_04',
    text: 'Note pour l\'item 4',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_05',
    text: 'Note pour l\'item 5',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_06',
    text: 'Note pour l\'item 6',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_07',
    text: 'Note pour l\'item 7',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_08',
    text: 'Note pour l\'item 8',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_09',
    text: 'Note pour l\'item 9',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_10',
    text: 'Note pour l\'item 10',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_11',
    text: 'Note pour l\'item 11',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_12',
    text: 'Note pour l\'item 12',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_13',
    text: 'Note pour l\'item 13',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_14',
    text: 'Note pour l\'item 14',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_15',
    text: 'Note pour l\'item 15',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_16',
    text: 'Note pour l\'item 16',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_17',
    text: 'Note pour l\'item 17',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_18',
    text: 'Note pour l\'item 18',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_19',
    text: 'Note pour l\'item 19',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_20',
    text: 'Note pour l\'item 20',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_21',
    text: 'Note pour l\'item 21',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_22',
    text: 'Note pour l\'item 22',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_23',
    text: 'Note pour l\'item 23',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_24',
    text: 'Note pour l\'item 24',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_25',
    text: 'Note pour l\'item 25',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  {
    id: 'item_26',
    text: 'Note pour l\'item 26',
    type: 'single_choice',
    required: true,
    section: 'Notes par item (0 ou 1)',
    options: [
      { code: 0, label: '0', score: 0 },
      { code: 1, label: '1', score: 1 }
    ]
  },
  // Computed scores section
  {
    id: 'total_raw_score',
    text: 'Note brute totale',
    type: 'number',
    required: false,
    section: 'Scores calculés',
    readonly: true,
    help: 'Somme des notes des 26 items (calculée automatiquement)'
  },
  {
    id: 'standard_score',
    text: 'Note standard',
    type: 'number',
    required: false,
    section: 'Scores calculés',
    readonly: true,
    help: 'Note standard selon les normes WAIS-III (calculée automatiquement)'
  },
  {
    id: 'standardized_value',
    text: 'Déviation par rapport à la moyenne et l\'écart type',
    type: 'number',
    required: false,
    section: 'Scores calculés',
    readonly: true,
    help: 'Valeur Z-score équivalente (calculée automatiquement)'
  }
];

export const WAIS3_MATRICES_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_matrices',
  code: 'WAIS3_MATRICES_FR',
  title: 'WAIS-III - Subtest Matrices',
  description: 'Subtest Matrices de la WAIS-III (Wechsler, 1997) - Évaluation du raisonnement perceptif. Utilise les tables de normes WAIS-III.',
  questions: WAIS3_MATRICES_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// WAIS-III - Code, Symboles & IVT (Indice de Vitesse de Traitement)
// ============================================================================
export const WAIS3_CODE_SYMBOLES_QUESTIONS: Question[] = [
  // Demographics section
  {
    id: 'patient_age',
    text: 'Âge du patient (calculé automatiquement)',
    type: 'number',
    required: true,
    readonly: true,
    section: 'Données démographiques',
    min: 16,
    max: 90,
    help: 'Calculé automatiquement à partir de la date de naissance et de la date de visite'
  },
  
  // SECTION 1: Code Subtest
  {
    id: 'section_code',
    text: 'WAIS-III (Wechsler, 1997) - Subtest Code',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'wais_cod_tot',
    text: 'Nombre total de cases remplies de façon correcte',
    type: 'number',
    required: true,
    section: 'WAIS-III (Wechsler, 1997) – Subtest Code',
    min: 0
  },
  {
    id: 'wais_cod_err',
    text: 'Nombre de cases remplies de façon incorrecte',
    type: 'number',
    required: true,
    section: 'WAIS-III (Wechsler, 1997) – Subtest Code',
    min: 0
  },
  {
    id: 'wais_cod_brut',
    text: 'Note brute totale',
    type: 'number',
    required: false,
    section: 'WAIS-III (Wechsler, 1997) – Subtest Code',
    readonly: true,
    visibleWhen: {
      field: 'wais_cod_tot',
      condition: 'isNotEmpty'
    },
    help: 'Note brute = Nombre total de cases correctement remplies (les erreurs sont ignorées dans cette implémentation)'
  },
  {
    id: 'wais_cod_std',
    text: 'Note standard - Code',
    type: 'number',
    required: false,
    section: 'WAIS-III (Wechsler, 1997) – Subtest Code',
    readonly: true,
    visibleWhen: {
      field: 'wais_cod_brut',
      condition: 'isNotEmpty'
    },
    help: 'Note standard selon les normes WAIS-III basée sur l\'âge'
  },
  {
    id: 'wais_cod_cr',
    text: 'Valeur standardisée (Code)',
    type: 'number',
    required: false,
    section: 'WAIS-III (Wechsler, 1997) – Subtest Code',
    readonly: true,
    visibleWhen: {
      field: 'wais_cod_std',
      condition: 'isNotEmpty'
    },
    help: 'Valeur standardisée par rapport à une moyenne de 10 et un écart type de 3'
  },
  
  // SECTION 2: Symboles Subtest
  {
    id: 'section_symboles',
    text: 'WAIS-III (Wechsler, 1997) - Subtest Symboles',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'wais_symb_tot',
    text: 'Nombre total de cases remplies de façon correcte',
    type: 'number',
    required: true,
    section: 'WAIS-III (Wechsler, 1997) – Subtest Symboles',
    min: 0
  },
  {
    id: 'wais_symb_err',
    text: 'Nombre de cases remplies de façon incorrecte',
    type: 'number',
    required: true,
    section: 'WAIS-III (Wechsler, 1997) – Subtest Symboles',
    min: 0
  },
  {
    id: 'wais_symb_brut',
    text: 'Note brute totale',
    type: 'number',
    required: false,
    section: 'WAIS-III (Wechsler, 1997) – Subtest Symboles',
    readonly: true,
    visibleWhen: {
      field: 'wais_symb_tot',
      condition: 'isNotEmpty'
    },
    help: 'Note brute = Total correct - Nombre incorrect'
  },
  {
    id: 'wais_symb_std',
    text: 'Note standard - Symboles',
    type: 'number',
    required: false,
    section: 'WAIS-III (Wechsler, 1997) – Subtest Symboles',
    readonly: true,
    visibleWhen: {
      field: 'wais_symb_brut',
      condition: 'isNotEmpty'
    },
    help: 'Note standard selon les normes WAIS-III basée sur l\'âge'
  },
  {
    id: 'wais_symb_cr',
    text: 'Valeur standardisée (Symboles)',
    type: 'number',
    required: false,
    section: 'WAIS-III (Wechsler, 1997) – Subtest Symboles',
    readonly: true,
    visibleWhen: {
      field: 'wais_symb_std',
      condition: 'isNotEmpty'
    },
    help: 'Valeur standardisée par rapport à une moyenne de 10 et un écart type de 3'
  },
  
  // SECTION 3: IVT
  {
    id: 'section_ivt',
    text: 'WAIS-III (Wechsler, 1997) - Indice de Vitesse de Traitement (IVT)',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'wais_somme_ivt',
    text: 'Somme des notes standard',
    type: 'number',
    required: false,
    section: 'WAIS-III (Wechsler, 1997) – Indice de Vitesse de Traitement (IVT)',
    readonly: true,
    visibleWhen: {
      operator: 'and',
      conditions: [
        { field: 'wais_cod_std', condition: 'isNotEmpty' },
        { field: 'wais_symb_std', condition: 'isNotEmpty' }
      ]
    },
    help: 'Note standard Code + Note standard Symboles (calculée automatiquement)'
  },
  {
    id: 'wais_ivt',
    text: 'Indice de Vitesse de Traitement (IVT)',
    type: 'number',
    required: false,
    section: 'WAIS-III (Wechsler, 1997) – Indice de Vitesse de Traitement (IVT)',
    readonly: true,
    visibleWhen: {
      field: 'wais_somme_ivt',
      condition: 'isNotEmpty'
    },
    help: 'Indice composite dérivé de la table de conversion (calculé automatiquement)'
  },
  {
    id: 'wais_ivt_rang',
    text: 'Rang percentile de l\'IVT',
    type: 'text',
    required: false,
    section: 'WAIS-III (Wechsler, 1997) – Indice de Vitesse de Traitement (IVT)',
    readonly: true,
    visibleWhen: {
      field: 'wais_ivt',
      condition: 'isNotEmpty'
    },
    help: 'Rang percentile de l\'Indice de Vitesse de Traitement (calculé automatiquement)'
  },
  {
    id: 'wais_ivt_95',
    text: 'Intervalle de confiance à 95%',
    type: 'text',
    required: false,
    section: 'WAIS-III (Wechsler, 1997) – Indice de Vitesse de Traitement (IVT)',
    readonly: true,
    visibleWhen: {
      field: 'wais_ivt',
      condition: 'isNotEmpty'
    },
    help: 'Intervalle de confiance à 95% de l\'IVT (calculé automatiquement)'
  }
];

export const WAIS3_CODE_SYMBOLES_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_code_symboles',
  code: 'WAIS3_CODE_SYMBOLES_FR',
  title: 'WAIS-III - Code, Symboles & IVT',
  description: 'Subtests Code et Symboles de la WAIS-III (Wechsler, 1997) avec l\'Indice de Vitesse de Traitement (IVT). ATTENTION: Cette version utilise les normes WAIS-III. Une version plus récente avec les normes WAIS-IV est disponible dans la section WAIS-IV.',
  questions: WAIS3_CODE_SYMBOLES_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// WAIS-III - Mémoire des chiffres (Digit Span)
// ============================================================================
export const WAIS3_DIGIT_SPAN_QUESTIONS: Question[] = [
  // Demographics section
  {
      id: 'section_demo',
      text: 'Données démographiques',
      type: 'section',
      required: false
  },
  {
    id: 'patient_age',
    text: 'Âge du patient (calculé automatiquement)',
    type: 'number',
    required: true,
    readonly: true,
    section: 'Données démographiques',
    min: 16,
    max: 90,
    help: 'Calculé automatiquement à partir de la date de naissance et de la date de visite'
  },
  {
    id: 'education_level',
    text: 'Niveau d\'études',
    type: 'single_choice',
    required: false,
    readonly: true,
    section: 'Données démographiques',
    options: [
      { code: 0, label: '< 2 ans', score: 0 },
      { code: 1, label: '2-11 ans', score: 1 },
      { code: 2, label: '12 ans', score: 2 },
      { code: 3, label: '13-14 ans', score: 3 },
      { code: 4, label: '>= 15 ans', score: 4 }
    ],
    help: 'Calculé automatiquement depuis le profil du patient'
  },
  
  // Section header for Forward Digit Span
  {
    id: 'section_direct',
    text: 'Empan de chiffres en ordre direct',
    type: 'section',
    required: false
  },
  
  // Forward (Ordre Direct) items
  {
    id: 'mcod_1a',
    text: 'ITEM 1 - Note à l\'essai 1',
    type: 'single_choice',
    required: true,
    section: 'Ordre Direct (2 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcod_1b',
    text: 'ITEM 1 - Note à l\'essai 2',
    type: 'single_choice',
    required: true,
    section: 'Ordre Direct (2 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcod_2a',
    text: 'ITEM 2 - Note à l\'essai 1',
    type: 'single_choice',
    required: true,
    section: 'Ordre Direct (3 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcod_2b',
    text: 'ITEM 2 - Note à l\'essai 2',
    type: 'single_choice',
    required: true,
    section: 'Ordre Direct (3 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcod_3a',
    text: 'ITEM 3 - Note à l\'essai 1',
    type: 'single_choice',
    required: true,
    section: 'Ordre Direct (4 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcod_3b',
    text: 'ITEM 3 - Note à l\'essai 2',
    type: 'single_choice',
    required: true,
    section: 'Ordre Direct (4 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcod_4a',
    text: 'ITEM 4 - Note à l\'essai 1',
    type: 'single_choice',
    required: true,
    section: 'Ordre Direct (5 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcod_4b',
    text: 'ITEM 4 - Note à l\'essai 2',
    type: 'single_choice',
    required: true,
    section: 'Ordre Direct (5 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcod_5a',
    text: 'ITEM 5 - Note à l\'essai 1',
    type: 'single_choice',
    required: true,
    section: 'Ordre Direct (6 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcod_5b',
    text: 'ITEM 5 - Note à l\'essai 2',
    type: 'single_choice',
    required: true,
    section: 'Ordre Direct (6 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcod_6a',
    text: 'ITEM 6 - Note à l\'essai 1',
    type: 'single_choice',
    required: true,
    section: 'Ordre Direct (7 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcod_6b',
    text: 'ITEM 6 - Note à l\'essai 2',
    type: 'single_choice',
    required: true,
    section: 'Ordre Direct (7 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcod_7a',
    text: 'ITEM 7 - Note à l\'essai 1',
    type: 'single_choice',
    required: true,
    section: 'Ordre Direct (8 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcod_7b',
    text: 'ITEM 7 - Note à l\'essai 2',
    type: 'single_choice',
    required: true,
    section: 'Ordre Direct (8 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcod_8a',
    text: 'ITEM 8 - Note à l\'essai 1',
    type: 'single_choice',
    required: true,
    section: 'Ordre Direct (9 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcod_8b',
    text: 'ITEM 8 - Note à l\'essai 2',
    type: 'single_choice',
    required: true,
    section: 'Ordre Direct (9 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  
  // Forward computed score
  {
    id: 'wais_mcod_tot',
    text: 'Note brute - Ordre Direct',
    type: 'number',
    required: false,
    section: 'Scores - Ordre Direct',
    readonly: true,
    help: 'Somme de tous les essais en ordre direct'
  },
  {
    id: 'wais_mc_end',
    text: 'Empan endroit (nombre maximum de chiffres rappelés)',
    type: 'number',
    required: false,
    section: 'Scores - Ordre Direct',
    readonly: true
  },
  {
    id: 'wais_mc_end_z',
    text: 'Empan endroit - Note Z',
    type: 'number',
    required: false,
    section: 'Scores - Ordre Direct',
    readonly: true,
    help: 'Z-score basé sur l\'âge et le niveau d\'études (normes GREFEX)'
  },
  
  // Section header for Backward Digit Span
  {
    id: 'section_inverse',
    text: 'Empan de chiffres en ordre inverse',
    type: 'section',
    required: false
  },
  
  // Backward (Ordre Inverse) items
  {
    id: 'mcoi_1a',
    text: 'ITEM 1 - Note à l\'essai 1',
    type: 'single_choice',
    required: true,
    section: 'Ordre Inverse (2 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcoi_1b',
    text: 'ITEM 1 - Note à l\'essai 2',
    type: 'single_choice',
    required: true,
    section: 'Ordre Inverse (2 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcoi_2a',
    text: 'ITEM 2 - Note à l\'essai 1',
    type: 'single_choice',
    required: true,
    section: 'Ordre Inverse (3 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcoi_2b',
    text: 'ITEM 2 - Note à l\'essai 2',
    type: 'single_choice',
    required: true,
    section: 'Ordre Inverse (3 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcoi_3a',
    text: 'ITEM 3 - Note à l\'essai 1',
    type: 'single_choice',
    required: true,
    section: 'Ordre Inverse (4 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcoi_3b',
    text: 'ITEM 3 - Note à l\'essai 2',
    type: 'single_choice',
    required: true,
    section: 'Ordre Inverse (4 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcoi_4a',
    text: 'ITEM 4 - Note à l\'essai 1',
    type: 'single_choice',
    required: true,
    section: 'Ordre Inverse (5 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcoi_4b',
    text: 'ITEM 4 - Note à l\'essai 2',
    type: 'single_choice',
    required: true,
    section: 'Ordre Inverse (5 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcoi_5a',
    text: 'ITEM 5 - Note à l\'essai 1',
    type: 'single_choice',
    required: true,
    section: 'Ordre Inverse (6 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcoi_5b',
    text: 'ITEM 5 - Note à l\'essai 2',
    type: 'single_choice',
    required: true,
    section: 'Ordre Inverse (6 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcoi_6a',
    text: 'ITEM 6 - Note à l\'essai 1',
    type: 'single_choice',
    required: true,
    section: 'Ordre Inverse (7 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcoi_6b',
    text: 'ITEM 6 - Note à l\'essai 2',
    type: 'single_choice',
    required: true,
    section: 'Ordre Inverse (7 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcoi_7a',
    text: 'ITEM 7 - Note à l\'essai 1',
    type: 'single_choice',
    required: true,
    section: 'Ordre Inverse (8 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  {
    id: 'mcoi_7b',
    text: 'ITEM 7 - Note à l\'essai 2',
    type: 'single_choice',
    required: true,
    section: 'Ordre Inverse (8 chiffres)',
    options: [
      { code: 0, label: 'Échec (0)', score: 0 },
      { code: 1, label: 'Réussite (1)', score: 1 }
    ]
  },
  
  // Backward computed scores
  {
    id: 'wais_mcoi_tot',
    text: 'Note brute - Ordre Inverse',
    type: 'number',
    required: false,
    section: 'Scores - Ordre Inverse',
    readonly: true,
    help: 'Somme de tous les essais en ordre inverse'
  },
  {
    id: 'wais_mc_env',
    text: 'Empan envers (nombre maximum de chiffres rappelés)',
    type: 'number',
    required: false,
    section: 'Scores - Ordre Inverse',
    readonly: true
  },
  {
    id: 'wais_mc_env_z',
    text: 'Empan envers - Note Z',
    type: 'number',
    required: false,
    section: 'Scores - Ordre Inverse',
    readonly: true,
    help: 'Z-score basé sur l\'âge et le niveau d\'études (normes GREFEX)'
  },
  
  // Total scores
  {
    id: 'wais_mc_tot',
    text: 'Note brute totale - Mémoire des chiffres',
    type: 'number',
    required: false,
    section: 'Scores totaux',
    readonly: true,
    help: 'Somme des notes brutes Ordre Direct et Ordre Inverse'
  },
  {
    id: 'wais_mc_emp',
    text: 'Différence empan endroit - empan envers',
    type: 'number',
    required: false,
    section: 'Scores totaux',
    readonly: true
  },
  {
    id: 'wais_mc_std',
    text: 'Note standard - Mémoire des chiffres',
    type: 'number',
    required: false,
    section: 'Scores totaux',
    readonly: true,
    help: 'Note standard basée sur l\'âge selon les normes WAIS-III'
  },
  {
    id: 'wais_mc_cr',
    text: 'Valeur standardisée (moyenne=10, écart-type=3)',
    type: 'number',
    required: false,
    section: 'Scores totaux',
    readonly: true,
    help: '(Note standard - 10) / 3'
  }
];

export const WAIS3_DIGIT_SPAN_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_digit_span',
  code: 'WAIS3_DIGIT_SPAN_FR',
  title: 'WAIS-III - Mémoire des chiffres',
  description: 'Subtest Mémoire des chiffres de la WAIS-III (Wechsler, 1997) incluant l\'Ordre Direct et l\'Ordre Inverse. ATTENTION: Cette version utilise les normes WAIS-III. Une version plus récente avec les normes WAIS-IV est disponible dans la section WAIS-IV.',
  questions: WAIS3_DIGIT_SPAN_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// WAIS-III - CPT II V.5 (Conners' Continuous Performance Test II)
// ============================================================================

const CPT2_GUIDELINE_OPTIONS: QuestionOption[] = [
  { code: 1, label: 'Markedly atypical', score: 1 },
  { code: 2, label: 'Mildly atypical', score: 2 },
  { code: 3, label: 'A little slow', score: 3 },
  { code: 4, label: 'Within average range', score: 4 },
  { code: 5, label: 'Good performance', score: 5 },
  { code: 6, label: 'Very good performance', score: 6 },
  { code: 7, label: 'A little fast', score: 7 },
  { code: 8, label: 'Atypically fast', score: 8 }
];

export const WAIS3_CPT2_QUESTIONS: Question[] = [
  // Section: Omissions %
  {
    id: 'section_omissions',
    text: 'Omissions %',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_omissions_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Omissions %',
    help: 'Missed targets'
  },
  {
    id: 'cpt2_omissions_pourcentage',
    text: 'Pourcentage',
    type: 'number',
    required: false,
    section: 'Omissions %'
  },
  {
    id: 'cpt2_omissions_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Omissions %'
  },
  {
    id: 'cpt2_omissions_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Omissions %'
  },
  {
    id: 'cpt2_omissions_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Omissions %',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Commissions %
  {
    id: 'section_comissions',
    text: 'Commissions %',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_comissions_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Commissions %',
    help: 'Incorrect responses to non-targets'
  },
  {
    id: 'cpt2_comissions_pourcentage',
    text: 'Pourcentage',
    type: 'number',
    required: false,
    section: 'Commissions %'
  },
  {
    id: 'cpt2_comissions_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Commissions %'
  },
  {
    id: 'cpt2_comissions_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Commissions %'
  },
  {
    id: 'cpt2_comissions_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Commissions %',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Hit RT
  {
    id: 'section_hitrt',
    text: 'Hit RT',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_hitrt_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Hit RT',
    help: 'Reaction time for correct responses'
  },
  {
    id: 'cpt2_hitrt_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Hit RT'
  },
  {
    id: 'cpt2_hitrt_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Hit RT'
  },
  {
    id: 'cpt2_hitrt_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Hit RT',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Hit RT Std. Error
  {
    id: 'section_hitrtstder',
    text: 'Hit RT Std. Error',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_hitrtstder_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Hit RT Std. Error',
    help: 'Standard error of reaction time'
  },
  {
    id: 'cpt2_hitrtstder_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Hit RT Std. Error'
  },
  {
    id: 'cpt2_hitrtstder_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Hit RT Std. Error'
  },
  {
    id: 'cpt2_hitrtstder_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Hit RT Std. Error',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Variability
  {
    id: 'section_variability',
    text: 'Variability',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_variability_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Variability',
    help: 'Variability of reaction time'
  },
  {
    id: 'cpt2_variability_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Variability'
  },
  {
    id: 'cpt2_variability_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Variability'
  },
  {
    id: 'cpt2_variability_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Variability',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Detectability (d')
  {
    id: 'section_detectability',
    text: 'Detectability (d\')',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_detectability_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Detectability (d\')',
    help: 'Ability to discriminate targets from non-targets'
  },
  {
    id: 'cpt2_detectability_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Detectability (d\')'
  },
  {
    id: 'cpt2_detectability_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Detectability (d\')'
  },
  {
    id: 'cpt2_detectability_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Detectability (d\')',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Response style (Beta)
  {
    id: 'section_responsestyle',
    text: 'Response style (Beta)',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_responsestyle_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Response style (Beta)',
    help: 'Response bias (conservative vs. risky)'
  },
  {
    id: 'cpt2_responsestyle_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Response style (Beta)'
  },
  {
    id: 'cpt2_responsestyle_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Response style (Beta)'
  },
  {
    id: 'cpt2_responsestyle_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Response style (Beta)',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Perseverations %
  {
    id: 'section_perseverations',
    text: 'Perseverations %',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_perseverations_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Perseverations %',
    help: 'Repetitive responding'
  },
  {
    id: 'cpt2_perseverations_pourcentage',
    text: 'Pourcentage',
    type: 'number',
    required: false,
    section: 'Perseverations %'
  },
  {
    id: 'cpt2_perseverations_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Perseverations %'
  },
  {
    id: 'cpt2_perseverations_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Perseverations %'
  },
  {
    id: 'cpt2_perseverations_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Perseverations %',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Hit RT Block Change
  {
    id: 'section_hitrtblockchange',
    text: 'Hit RT Block Change',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_hitrtblockchange_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Hit RT Block Change',
    help: 'Change in reaction time over blocks'
  },
  {
    id: 'cpt2_hitrtblockchange_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Hit RT Block Change'
  },
  {
    id: 'cpt2_hitrtblockchange_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Hit RT Block Change'
  },
  {
    id: 'cpt2_hitrtblockchange_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Hit RT Block Change',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Hit SE Block Change
  {
    id: 'section_hitseblockchange',
    text: 'Hit SE Block Change',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_hitseblockchange_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Hit SE Block Change',
    help: 'Change in standard error over blocks'
  },
  {
    id: 'cpt2_hitseblockchange_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Hit SE Block Change'
  },
  {
    id: 'cpt2_hitseblockchange_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Hit SE Block Change'
  },
  {
    id: 'cpt2_hitseblockchange_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Hit SE Block Change',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Hit RT ISI Change
  {
    id: 'section_hitrtisichange',
    text: 'Hit RT ISI Change',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_hitrtisichange_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Hit RT ISI Change',
    help: 'Change in reaction time over Inter-Stimulus Intervals'
  },
  {
    id: 'cpt2_hitrtisichange_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Hit RT ISI Change'
  },
  {
    id: 'cpt2_hitrtisichange_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Hit RT ISI Change'
  },
  {
    id: 'cpt2_hitrtisichange_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Hit RT ISI Change',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Hit SE ISI Change
  {
    id: 'section_hitseisichange',
    text: 'Hit SE ISI Change',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_hitseisichange_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Hit SE ISI Change',
    help: 'Change in standard error over Inter-Stimulus Intervals'
  },
  {
    id: 'cpt2_hitseisichange_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Hit SE ISI Change'
  },
  {
    id: 'cpt2_hitseisichange_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Hit SE ISI Change'
  },
  {
    id: 'cpt2_hitseisichange_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Hit SE ISI Change',
    options: CPT2_GUIDELINE_OPTIONS
  }
];

export const WAIS3_CPT2_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_cpt2',
  code: 'WAIS3_CPT2_FR',
  title: 'WAIS-III - CPT II V.5',
  description: 'Conners\' Continuous Performance Test II (CPT II V.5) by C. Keith Conners, Ph.D. and MHS Staff. Ce formulaire permet la saisie des resultats calcules par le logiciel CPT II externe. Instructions: « Appuyez sur la barre d’espace ou sur le bouton gauche de la souris pour toutes les lettres EXCEPTÉ pour le X. S’il vous plaît répondez aussi vite que possible mais aussi correctement que possible. Quand vous appuierez sur le bouton OK l’exercice commencera. » Si le patient pose des questions pendant le test, dire : « je pourrai vous répondre dès que vous aurez terminé. S’il vous plaît continuez. »',
  questions: WAIS3_CPT2_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// MEM-III (Wechsler, 2001) - Memoire Spatiale
// ============================================================================

const MEM3_SPATIAL_SCORE_OPTIONS: QuestionOption[] = [
  { code: 0, label: '0', score: 0 },
  { code: 1, label: '1', score: 1 }
];

export const MEM3_SPATIAL_QUESTIONS: Question[] = [
  {
    id: 'section_general',
    text: 'Informations generales',
    type: 'section',
    required: false
  },

  // Patient age
  {
    id: 'patient_age',
    text: 'Age du patient (calcule automatiquement)',
    type: 'number',
    required: true,
    readonly: true,
    section: 'Informations generales',
    min: 16,
    max: 90,
    help: 'Calcule automatiquement a partir de la date de naissance et de la date de visite'
  },

  // Stopping rule instructions (bold text with description)
  {
    id: 'regle_arret_info',
    text: '',
    type: 'text',
    required: false,
    readonly: true,
    section: 'Informations generales',
    metadata: { displayOnly: true },
    help: '**REGLE D\'ARRET**\n\nOrdre direct et Ordre inverse.\n\nEchec a 2 essais d\'un meme item.\n\nPour Ordre direct et Ordre inverse, administrer les 2 essais d\'un meme item, meme si l\'essai 1 est reussi. Administrer Ordre inverse, meme si le sujet a echoue a Ordre direct.'
  },

  // Scoring rule instructions (bold text with description)
  {
    id: 'regle_cotation_info',
    text: '',
    type: 'text',
    required: false,
    readonly: true,
    section: 'Informations generales',
    metadata: { displayOnly: true },
    help: '**REGLE DE COTATION**\n\nChaque essai : 0 ou 1 point.\n\nNote a l\'item : Essai 1 + Essai 2'
  },
  
  // Forward (Ordre Direct) items
  {
    id: 'section_odirect',
    text: 'Ordre Direct (Forward)',
    type: 'section',
    required: false
  },
  { id: 'odirect_1a', text: 'ITEM 1 - Note a l\'essai 1', type: 'single_choice', required: true, section: 'Ordre Direct', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'odirect_1b', text: 'ITEM 1 - Note a l\'essai 2', type: 'single_choice', required: true, section: 'Ordre Direct', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'odirect_2a', text: 'ITEM 2 - Note a l\'essai 1', type: 'single_choice', required: true, section: 'Ordre Direct', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'odirect_2b', text: 'ITEM 2 - Note a l\'essai 2', type: 'single_choice', required: true, section: 'Ordre Direct', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'odirect_3a', text: 'ITEM 3 - Note a l\'essai 1', type: 'single_choice', required: true, section: 'Ordre Direct', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'odirect_3b', text: 'ITEM 3 - Note a l\'essai 2', type: 'single_choice', required: true, section: 'Ordre Direct', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'odirect_4a', text: 'ITEM 4 - Note a l\'essai 1', type: 'single_choice', required: true, section: 'Ordre Direct', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'odirect_4b', text: 'ITEM 4 - Note a l\'essai 2', type: 'single_choice', required: true, section: 'Ordre Direct', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'odirect_5a', text: 'ITEM 5 - Note a l\'essai 1', type: 'single_choice', required: true, section: 'Ordre Direct', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'odirect_5b', text: 'ITEM 5 - Note a l\'essai 2', type: 'single_choice', required: true, section: 'Ordre Direct', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'odirect_6a', text: 'ITEM 6 - Note a l\'essai 1', type: 'single_choice', required: true, section: 'Ordre Direct', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'odirect_6b', text: 'ITEM 6 - Note a l\'essai 2', type: 'single_choice', required: true, section: 'Ordre Direct', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'odirect_7a', text: 'ITEM 7 - Note a l\'essai 1', type: 'single_choice', required: true, section: 'Ordre Direct', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'odirect_7b', text: 'ITEM 7 - Note a l\'essai 2', type: 'single_choice', required: true, section: 'Ordre Direct', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'odirect_8a', text: 'ITEM 8 - Note a l\'essai 1', type: 'single_choice', required: true, section: 'Ordre Direct', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'odirect_8b', text: 'ITEM 8 - Note a l\'essai 2', type: 'single_choice', required: true, section: 'Ordre Direct', options: MEM3_SPATIAL_SCORE_OPTIONS },
  
  // Forward computed scores
  { id: 'mspatiale_odirect_tot', text: 'Note brute - Ordre Direct (0-16)', type: 'number', required: false, section: 'Ordre Direct', readonly: true, help: 'Somme des scores Ordre Direct (calcule automatiquement)' },
  { id: 'mspatiale_odirect_std', text: 'Note standard - Ordre Direct', type: 'number', required: false, section: 'Ordre Direct', readonly: true, help: 'Score standard selon l\'age' },
  { id: 'mspatiale_odirect_cr', text: 'Deviation standard - Ordre Direct', type: 'number', required: false, section: 'Ordre Direct', readonly: true, help: '(Note standard - 10) / 3' },
  
  // Backward (Ordre Inverse) items
  {
    id: 'section_inverse',
    text: 'Ordre Inverse (Backward)',
    type: 'section',
    required: false
  },
  { id: 'inverse_1a', text: 'ITEM 1 - Note a l\'essai 1', type: 'single_choice', required: true, section: 'Ordre Inverse', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'inverse_1b', text: 'ITEM 1 - Note a l\'essai 2', type: 'single_choice', required: true, section: 'Ordre Inverse', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'inverse_2a', text: 'ITEM 2 - Note a l\'essai 1', type: 'single_choice', required: true, section: 'Ordre Inverse', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'inverse_2b', text: 'ITEM 2 - Note a l\'essai 2', type: 'single_choice', required: true, section: 'Ordre Inverse', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'inverse_3a', text: 'ITEM 3 - Note a l\'essai 1', type: 'single_choice', required: true, section: 'Ordre Inverse', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'inverse_3b', text: 'ITEM 3 - Note a l\'essai 2', type: 'single_choice', required: true, section: 'Ordre Inverse', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'inverse_4a', text: 'ITEM 4 - Note a l\'essai 1', type: 'single_choice', required: true, section: 'Ordre Inverse', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'inverse_4b', text: 'ITEM 4 - Note a l\'essai 2', type: 'single_choice', required: true, section: 'Ordre Inverse', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'inverse_5a', text: 'ITEM 5 - Note a l\'essai 1', type: 'single_choice', required: true, section: 'Ordre Inverse', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'inverse_5b', text: 'ITEM 5 - Note a l\'essai 2', type: 'single_choice', required: true, section: 'Ordre Inverse', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'inverse_6a', text: 'ITEM 6 - Note a l\'essai 1', type: 'single_choice', required: true, section: 'Ordre Inverse', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'inverse_6b', text: 'ITEM 6 - Note a l\'essai 2', type: 'single_choice', required: true, section: 'Ordre Inverse', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'inverse_7a', text: 'ITEM 7 - Note a l\'essai 1', type: 'single_choice', required: true, section: 'Ordre Inverse', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'inverse_7b', text: 'ITEM 7 - Note a l\'essai 2', type: 'single_choice', required: true, section: 'Ordre Inverse', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'inverse_8a', text: 'ITEM 8 - Note a l\'essai 1', type: 'single_choice', required: true, section: 'Ordre Inverse', options: MEM3_SPATIAL_SCORE_OPTIONS },
  { id: 'inverse_8b', text: 'ITEM 8 - Note a l\'essai 2', type: 'single_choice', required: true, section: 'Ordre Inverse', options: MEM3_SPATIAL_SCORE_OPTIONS },
  
  // Backward computed scores
  { id: 'mspatiale_inverse_tot', text: 'Note brute - Ordre Inverse (0-16)', type: 'number', required: false, section: 'Ordre Inverse', readonly: true, help: 'Somme des scores Ordre Inverse (calcule automatiquement)' },
  { id: 'mspatiale_inverse_std', text: 'Note standard - Ordre Inverse', type: 'number', required: false, section: 'Ordre Inverse', readonly: true, help: 'Score standard selon l\'age' },
  { id: 'mspatiale_inverse_cr', text: 'Deviation standard - Ordre Inverse', type: 'number', required: false, section: 'Ordre Inverse', readonly: true, help: '(Note standard - 10) / 3' },
  
  // Total scores
  {
    id: 'section_total',
    text: 'Scores Totaux',
    type: 'section',
    required: false
  },
  { id: 'mspatiale_total_brut', text: 'Note totale brute (0-32)', type: 'number', required: false, section: 'Scores Totaux', readonly: true, help: 'Ordre Direct + Ordre Inverse' },
  { id: 'mspatiale_total_std', text: 'Note standard totale', type: 'number', required: false, section: 'Scores Totaux', readonly: true, help: 'Score standard selon l\'age' },
  { id: 'mspatiale_total_cr', text: 'Deviation standard - Total', type: 'number', required: false, section: 'Scores Totaux', readonly: true, help: '(Note standard - 10) / 3' }
];

export const WAIS3_MEM3_SPATIAL_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_mem3_spatial',
  code: 'WAIS3_MEM3_SPATIAL_FR',
  title: 'MEM-III - Memoire Spatiale',
  description: 'MEM-III (Wechsler Memory Scale - 3rd Edition) - Subtest Memoire Spatiale (Spatial Span). Adaptation francaise: Gregoire, J., Penhouet C. (2001). Ce subtest comprend les composantes Ordre Direct (Forward) et Ordre Inverse (Backward). Version WAIS-III avec les normes correspondantes.',
  questions: MEM3_SPATIAL_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
