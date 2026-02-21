// eFondaMental Platform - SANS (Scale for the Assessment of Negative Symptoms)
// ECHELLE D'APPRECIATION DES SYMPTOMES NEGATIFS (DEFICITAIRES)
// Clinician-rated scale for assessing negative symptoms in schizophrenia
// Original author: N.C. Andreasen
// French translation: P. Boyer and Y. Lecrubier

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaSansResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  test_done?: number | boolean | null;
  // Retrait ou pauvreté affective (items 1-8)
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
  q5?: number | null;
  q6?: number | null;
  q7?: number | null;
  q8?: number | null;
  // Alogie (items 9-13)
  q9?: number | null;
  q10?: number | null;
  q11?: number | null;
  q12?: number | null;
  q13?: number | null;
  // Avolition - Apathie (items 14-17)
  q14?: number | null;
  q15?: number | null;
  q16?: number | null;
  q17?: number | null;
  // Anhédonie - Retrait social (items 18-22)
  q18?: number | null;
  q19?: number | null;
  q20?: number | null;
  q21?: number | null;
  q22?: number | null;
  // Attention (items 23-25)
  q23?: number | null;
  q24?: number | null;
  q25?: number | null;
  // Scores
  affective_flattening_subscore?: number | null;
  alogia_subscore?: number | null;
  avolition_subscore?: number | null;
  anhedonia_subscore?: number | null;
  attention_subscore?: number | null;
  subscores_sum?: number | null;
  global_evaluations_score?: number | null;
  total_score?: number | null;
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaSansResponseInsert = Omit<
  SchizophreniaSansResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Questions
// ============================================================================

const SHOW_WHEN_TEST_DONE = { '==': [{ 'var': 'test_done' }, 1] };

export const SANS_QUESTIONS: Question[] = [
  {
    id: 'test_done',
    text: 'Passation du questionnaire',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Fait', score: 1 },
      { code: 0, label: 'Non fait', score: 0 }
    ]
  },

  // ============================================================================
  // RETRAIT OU PAUVRETE AFFECTIVE
  // ============================================================================
  {
    id: 'section_affective_flattening',
    text: 'RETRAIT OU PAUVRETÉ AFFECTIVE',
    help: "Le retrait ou l'émoussement affectif se manifeste par un appauvrissement caractéristique de l'expression de la réactivité et de la sensibilité émotionnelle. L'émoussement émotionnel peut être évalué par l'observation du comportement du malade et de sa réactivité lors d'un entretien de routine. L'évaluation de certains items peut être affectée par les médicaments. Ainsi les effets secondaires pseudo-parkinsoniens des neuroleptiques peuvent réduire des troubles de la mimique et de la posture. D'autres éléments de l'affect, par contre, ne seront cependant pas modifiés, telle la réactivité ou le caractère approprié des réponses affectives.",
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'q1',
    text: '1 - Expression figée du visage',
    help: "L'expression faciale apparaît rigide, figée, mécanique. On note une absence ou une diminution des changements d'expression attendus, eu égard au contenu émotionnel du discours. Les neuroleptiques pouvant mimer ces effets, l'observateur doit prendre soin de noter si le malade est sous traitement, mais ne doit pas essayer de \"corriger\" sa notation.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - absente - la mimique est normale et adaptée', score: 0 },
      { code: 1, label: '1 - doute sur une diminution', score: 1 },
      { code: 2, label: '2 - légère - expressivité faciale un peu diminuée', score: 2 },
      { code: 3, label: "3 - moyenne - l'expressivité faciale est nettement diminuée", score: 3 },
      { code: 4, label: "4 - importante - l'expressivité faciale est diminuée de façon importante", score: 4 }
    ]
  },
  {
    id: 'q2',
    text: '2 - Diminution des mouvements spontanés',
    help: "Le patient est assis immobile durant l'entretien et présente, peu ou pas, de mouvements spontanés. Il ne change pas de position, ne bouge pas ses jambes ou ses mains, ou le fait moins qu'on ne pourrait normalement s'y attendre.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - aucune - le malade bouge normalement ou hyperactivité', score: 0 },
      { code: 1, label: '1 - doute sur une diminution', score: 1 },
      { code: 2, label: '2 - légère - mouvements spontanés, un peu diminués', score: 2 },
      { code: 3, label: '3 - moyenne - nette diminution des mouvements spontanés', score: 3 },
      { code: 4, label: '4 - importante - diminution importante de la mobilité', score: 4 },
      { code: 5, label: "5 - sévère - le malade reste assis et figé durant l'examen", score: 5 }
    ]
  },
  {
    id: 'q3',
    text: "3 - Pauvreté de l'expression gestuelle",
    help: "Le malade n'utilise pas les mouvements de son corps pour aider à l'expression de ses idées, tels que gestes des mains, posture penchée en avant sur sa chaise lorsqu'il est attentif, ou appuyé au dossier lorsqu'il est détendu. Ceci peut survenir en plus de la diminution des mouvements spontanés.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: "0 - aucune - le malade utilise des expressions gestuelles normales ou excessives", score: 0 },
      { code: 1, label: '1 - doute sur une diminution', score: 1 },
      { code: 2, label: "2 - légère - l'expression gestuelle est un peu diminuée", score: 2 },
      { code: 3, label: '3 - moyenne - nette diminution de l\'expression gestuelle', score: 3 },
      { code: 4, label: "4 - importante - diminution importante de l'expression gestuelle", score: 4 },
      { code: 5, label: "5 - sévère - le malade ne s'aide jamais de son corps pour s'exprimer", score: 5 }
    ]
  },
  {
    id: 'q4',
    text: '4 - Pauvreté du contact visuel',
    help: "Le malade évite de regarder l'autre, ou d'utiliser ses yeux pour s'exprimer. Son regard semble perdu dans le vide même lorsqu'il parle.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - aucunement - expression et contact du regard normaux', score: 0 },
      { code: 1, label: '1 - doute sur une diminution', score: 1 },
      { code: 2, label: '2 - léger - contact et expression du regard un peu diminués', score: 2 },
      { code: 3, label: '3 - moyenne - nette diminution du contact et de l\'expression du regard', score: 3 },
      { code: 4, label: '4 - importante - les contacts à travers le regard sont rares', score: 4 },
      { code: 5, label: "5 - sévère - le malade ne regarde jamais l'observateur", score: 5 }
    ]
  },
  {
    id: 'q5',
    text: '5 - Absence de réponses affectives',
    help: "Ne rit ou ne sourit pas, lorsqu'il y est incité. On peut tester cet item en plaisantant ou en souriant d'une manière qui, habituellement, provoque un sourire chez un sujet normal. L'observateur peut aussi demander en souriant \"avez-vous oublié comment sourire ?\"",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - aucune', score: 0 },
      { code: 1, label: "1 - doute sur l'existence", score: 1 },
      { code: 2, label: '2 - légère - l\'absence de réponse est légère mais certaine', score: 2 },
      { code: 3, label: '3 - moyenne - diminution modérée des réponses', score: 3 },
      { code: 4, label: '4 - importante - diminution importante des réponses', score: 4 },
      { code: 5, label: "5 - sévère - absence de réponse, même après incitation", score: 5 }
    ]
  },
  {
    id: 'q6',
    text: '6 - Affect inapproprié',
    help: "L'affect exprimé est inapproprié ou incongru, et non simplement pauvre et émoussé. Le plus souvent ces manifestations du trouble de l'affect sont exprimées sous la forme de sourires ou d'une expression faciale \"bête\" lors de conversations sérieuses ou tristes. (Parfois les malades peuvent rire ou sourire alors qu'ils parlent de sujets sérieux mais gênants ou embarrassants. Bien que ces sourires puissent sembler incongrus, ils sont dus à l'anxiété et ne doivent pas être cotés comme affect inapproprié). Ne pas coter la pauvreté ou l'absence d'affect dans ce cadre.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: "0 - inexistant - l'affect n'est pas inapproprié", score: 0 },
      { code: 1, label: '1 - douteux', score: 1 },
      { code: 2, label: "2 - léger - au moins une manifestation de sourire ou d'un autre affect inapproprié", score: 2 },
      { code: 3, label: "3 - moyenne - manifestations occasionnelles d'un affect inapproprié", score: 3 },
      { code: 4, label: "4 - importante - fréquentes manifestations d'un affect inapproprié", score: 4 },
      { code: 5, label: "5 - sévère - expressions affectives inappropriées, la plupart du temps", score: 5 }
    ]
  },
  {
    id: 'q7',
    text: '7 - Monotonie de la voix',
    help: "Lorsqu'il parle, le malade ne présente pas les modulations vocales normales. Le discours est monotone, des modifications du ton ou du volume ne font pas ressortir les mots importants. Le malade peut ne pas adapter son volume vocal lorsqu'il change de sujet, ainsi, il ne baisse pas d'un ton pour discuter de problèmes intimes ou ne monte pas d'un ton lorsqu'il passe à des sujets stimulants, pour lesquels une voix plus forte est habituellement attendue.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - absence - modulation du discours normale', score: 0 },
      { code: 1, label: '1 - doute sur une diminution', score: 1 },
      { code: 2, label: '2 - légère - modulation vocale un peu diminuée', score: 2 },
      { code: 3, label: '3 - moyenne - nette diminution de la modulation vocale', score: 3 },
      { code: 4, label: '4 - importante - diminution importante', score: 4 },
      { code: 5, label: '5 - sévère - discours complètement monotone', score: 5 }
    ]
  },
  {
    id: 'q8',
    text: '8 - Évaluation globale de la pauvreté affective',
    help: "L'évaluation globale prend en compte la gravité de l'ensemble de l'émoussement affectif. Une importance particulière doit être donnée au noyau représenté par l'absence de réactivité, une diminution globale du vécu émotionnel et son caractère inapproprié.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - pas de pauvreté - affect normal', score: 0 },
      { code: 1, label: '1 - doute sur l\'émoussement émotionnel', score: 1 },
      { code: 2, label: '2 - émoussement émotionnel léger', score: 2 },
      { code: 3, label: '3 - émoussement émotionnel moyen', score: 3 },
      { code: 4, label: '4 - émoussement émotionnel important', score: 4 },
      { code: 5, label: '5 - émoussement émotionnel sévère', score: 5 }
    ]
  },

  // ============================================================================
  // ALOGIE
  // ============================================================================
  {
    id: 'section_alogia',
    text: 'ALOGIE',
    help: "L'alogie reflète une pensée et une capacité cognitives appauvries, souvent rencontrées chez les schizophrènes. Les processus de pensée semblent vides, ampoulés ou lents. Tout ceci est déduit du discours du sujet. Les deux manifestations majeures sont la \"pauvreté du discours\" : restriction quantitative et la \"pauvreté du contenu du discours\", restriction qualitative. Les barrages et l'augmentation de la latence des réponses peuvent aussi refléter l'alogie.",
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'q9',
    text: '9 - Pauvreté du discours',
    help: "C'est la réduction de la quantité de propos spontanés, aboutissant à des réponses brèves, concrètes et non élaborées aux questions. Un complément d'information non explicitement demandé est rarement fourni. Par exemple, à la question \"combien d'enfants avez-vous ?\", le sujet répond \"deux, une fille et un garçon. La fille a douze ans et le garçon dix\". \"Deux\" est tout ce qui est demandé en réponse à la question, le reste de la réponse est une information supplémentaire. Les réponses peuvent être monosyllabiques, et certaines questions peuvent être laissées sans réponse. Confronté à ce type de discours, l'examinateur doit donner au sujet le temps nécessaire pour élaborer sa réponse et répondre.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - pas de pauvreté du discours - les réponses sont substantielles et appropriées', score: 0 },
      { code: 1, label: '1 - doute - le discours comporte des informations supplémentaires', score: 1 },
      { code: 2, label: '2 - pauvreté du discours légère - les réponses, bien que faites à propos, ne comportent pas une information élaborée', score: 2 },
      { code: 3, label: '3 - pauvreté du discours moyenne - certaines réponses ne comportent pas une information élaborée de façon appropriée, et de nombreuses répliques sont monosyllabiques ou très brèves ("oui", "non", "peut-être", "je ne sais pas", "la semaine dernière")', score: 3 },
      { code: 4, label: '4 - pauvreté du discours importante - les réponses font rarement plus de quelques mots', score: 4 },
      { code: 5, label: "5 - pauvreté du discours sévère - le sujet s'exprime très peu et ne répond parfois pas aux questions", score: 5 }
    ]
  },
  {
    id: 'q10',
    text: '10 - Pauvreté du contenu du discours (idéique)',
    help: "Bien que les réponses soient suffisamment longues pour que le discours soit normal en quantité, il comporte peu d'informations. Le langage tend à être vague, souvent trop abstrait ou concret, répétitif, stéréotypé. L'examinateur peut remarquer, à ce propos, que le sujet a parlé un certain temps sans avoir fourni d'information pertinente qui réponde à la question. Inversement, le sujet peut fournir une information suffisante mais à travers un long discours. Ainsi, une longue réponse peut être résumée en une phrase ou deux. Quelquefois, l'examinateur aura l'impression d'un discours \"philosophant dans le vide\". Ceci exclut les discours discursifs qui comportent une foule de détails.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - absence', score: 0 },
      { code: 1, label: '1 - doute', score: 1 },
      { code: 2, label: '2 - légère pauvreté du contenu du discours - certaines réponses sont trop vagues pour être claires ou pourraient être largement réduites', score: 2 },
      { code: 3, label: '3 - pauvreté moyenne du contenu du discours - réponses vagues, fréquentes, ou qui pourraient être réduites au moins au quart', score: 3 },
      { code: 4, label: '4 - pauvreté importante du discours. La moitié au moins du discours est composée de réponses vagues ou incompréhensibles', score: 4 },
      { code: 5, label: "5 - pauvreté extrême du contenu du discours - l'ensemble du discours est vague, incompréhensible ou pourrait être considérablement réduit", score: 5 }
    ]
  },
  {
    id: 'q11',
    text: '11 - Barrages',
    help: "Suspension du discours avant qu'une pensée ou une idée n'ait été menée à son terme. Après un silence, qui peut durer quelques secondes à quelques minutes, le sujet indique qu'il ne peut se souvenir de ce qu'il disait ou voulait dire. On ne peut affirmer l'existence de barrages, que si le sujet décrit avoir perdu le fil de la pensée, ou précise, sur question de l'observateur, que telle était la raison de la pause.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - pas de barrage', score: 0 },
      { code: 1, label: '1 - doute', score: 1 },
      { code: 2, label: '2 - léger - survient une seule fois au cours d\'une période de 15 minutes', score: 2 },
      { code: 3, label: '3 - moyens - surviennent deux fois en 15 minutes', score: 3 },
      { code: 4, label: '4 - importants - surviennent trois fois en 15 minutes', score: 4 },
      { code: 5, label: '5 - sévères - surviennent plus de trois fois en 15 minutes', score: 5 }
    ]
  },
  {
    id: 'q12',
    text: '12 - Augmentation de la latence des réponses',
    help: "La durée qui s'écoule avant que le malade ne réponde aux questions est plus longue que normalement. Il peut sembler \"ailleurs\" et l'examinateur peut se demander s'il a seulement entendu la question. Le sujet a compris la question, mais a du mal à ordonner sa pensée pour formuler une réponse adéquate.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - absence - les réponses surviennent rapidement', score: 0 },
      { code: 1, label: '1 - doute', score: 1 },
      { code: 2, label: "2 - légère - quelques réponses sont précédées d'un bref temps de pause", score: 2 },
      { code: 3, label: '3 - moyenne - augmentation nette de la latence des réponses', score: 3 },
      { code: 4, label: '4 - importante - augmentation importante de la latence des réponses', score: 4 },
      { code: 5, label: '5 - sévère - existence de longues pauses avant toute réponse', score: 5 }
    ]
  },
  {
    id: 'q13',
    text: "13 - Évaluation globale de l'alogie",
    help: "Les signes nucléaires de l'alogie étant la pauvreté du discours et celle de son contenu, l'évaluation globale doit particulièrement en tenir compte.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - absence', score: 0 },
      { code: 1, label: '1 - doute', score: 1 },
      { code: 2, label: "2 - légère - appauvrissement léger mais certain de la pensée", score: 2 },
      { code: 3, label: "3 - moyenne - l'appauvrissement de la pensée est évident", score: 3 },
      { code: 4, label: "4 - importante - la pensée semble appauvrie la plupart du temps", score: 4 },
      { code: 5, label: "5 - sévère - l'appauvrissement de la pensée semble pratiquement permanent", score: 5 }
    ]
  },

  // ============================================================================
  // AVOLITION - APATHIE
  // ============================================================================
  {
    id: 'section_avolition',
    text: 'AVOLITION - APATHIE',
    help: "L'avolition se caractérise par un manque d'énergie, d'allant, d'intérêts. Les malades sont incapables de se mobiliser pour débuter ou mener à bien toutes sortes de tâches. Au contraire de la diminution d'énergie, ou des intérêts observés dans la dépression, l'ensemble symptomatique \"avolition\" tend à évoluer de façon chronique, sans être connoté de tristesse ou d'affect dépressif. Le retentissement économique et social de cet ensemble symptomatique est souvent important.",
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'q14',
    text: '14 - Toilette – hygiène',
    help: "Le malade accorde moins d'attention à sa toilette et son hygiène que normalement. L'habillement est négligé, vieillot ou sale. Il se baigne rarement, ne soigne ni ses cheveux, ni ses ongles, ou ses dents... Les cheveux peuvent être gras et mal peignés, les mains et les dents sales, l'haleine ou l'odeur corporelle désagréable. Globalement, l'allure est négligée, échevelée. Dans les cas extrêmes, les vêtements sont en haillons et tachés.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: "0 - absence de troubles dans la toilette ou l'hygiène", score: 0 },
      { code: 1, label: '1 - doute', score: 1 },
      { code: 2, label: "2 - léger - le manque de soin de l'apparence est léger mais net", score: 2 },
      { code: 3, label: '3 - moyenne - apparence négligée', score: 3 },
      { code: 4, label: '4 - importante - apparence très négligée', score: 4 },
      { code: 5, label: '5 - sévère - extrêmement négligée', score: 5 }
    ]
  },
  {
    id: 'q15',
    text: "15 - Manque d'assiduité au travail ou à l'école",
    help: "Le malade a des difficultés à trouver ou garder un emploi (ou une insertion scolaire) en rapport avec son âge et son sexe. S'il est élève, il ne fait pas ses devoirs à domicile et peut même manquer en classe. Son niveau reflétera ces difficultés. S'il est étudiant, il peut s'être inscrit à différents cours, mais les abandonne en partie, ou tous en cours d'année. Lorsqu'il est en âge de travailler, le malade peut avoir eu des difficultés à garder son travail à cause de son incapacité à mener un travail à bien et de son apparente irresponsabilité. Ses présences peuvent avoir été irrégulières, il peut être parti trop tôt, ne pas avoir terminé les tâches confiées ou les avoir accomplies de façon désordonnée. Il peut aussi être resté à la maison sans rechercher d'emploi ou en avoir cherché sporadiquement et de façon décousue. Les femmes au foyer, les retraités, peuvent ne plus accomplir ou bâcler les tâches quotidiennes : courses, ménage.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: "0 - absence - assiduité normale au travail ou à l'école", score: 0 },
      { code: 1, label: '1 - doute', score: 1 },
      { code: 2, label: "2 - léger - léger manque d'assiduité", score: 2 },
      { code: 3, label: "3 - moyen - manque d'assiduité net", score: 3 },
      { code: 4, label: "4 - important - manque d'assiduité évident", score: 4 },
      { code: 5, label: "5 - sévère - le niveau scolaire ou celui du travail n'a pu être maintenu", score: 5 }
    ]
  },
  {
    id: 'q16',
    text: '16 - Anergie physique',
    help: "L'inertie est physique : le sujet peut rester des heures assis sur une chaise sans entreprendre spontanément une activité. Si on l'encourage à s'engager dans une activité, il peut y participer brièvement puis s'éloigner ou se retirer et retourner s'asseoir seul. Il peut passer une grande partie de son temps à des tâches ne demandant pas d'effort intellectuel ou physique, comme regarder la télévision, ou jouer seul. Sa famille peut décrire qu'il \"passe son temps à ne rien faire\" chez lui. A la maison, ou en milieu hospitalier, il peut passer la majeure partie de son temps assis dans sa chambre.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: "0 - absence d'anergie physique", score: 0 },
      { code: 1, label: '1 - doute', score: 1 },
      { code: 2, label: '2 - anergie légère', score: 2 },
      { code: 3, label: '3 - anergie moyenne', score: 3 },
      { code: 4, label: '4 - anergie importante', score: 4 },
      { code: 5, label: '5 - anergie sévère', score: 5 }
    ]
  },
  {
    id: 'q17',
    text: "17 - Évaluation globale de l'avolition-apathie",
    help: "Cette évaluation doit rendre compte de la sévérité globale des symptômes d'avolition en tenant compte des normes attendues selon l'âge et le statut social. Un poids important peut être accordé à un ou deux symptômes prédominants dans l'évaluation globale, s'ils sont particulièrement frappants.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - absence', score: 0 },
      { code: 1, label: '1 - doute', score: 1 },
      { code: 2, label: '2 - légère mais nette', score: 2 },
      { code: 3, label: '3 - moyenne', score: 3 },
      { code: 4, label: '4 - importante', score: 4 },
      { code: 5, label: '5 - sévère', score: 5 }
    ]
  },

  // ============================================================================
  // ANHEDONIE - RETRAIT SOCIAL
  // ============================================================================
  {
    id: 'section_anhedonia',
    text: 'ANHÉDONIE - RETRAIT SOCIAL',
    help: "Cet ensemble de symptômes regroupe les difficultés du schizophrène à éprouver de l'intérêt ou du plaisir. Cela peut se traduire par une perte d'intérêt pour les activités agréables, une incapacité à éprouver du plaisir au cours d'activités habituellement considérées comme agréables, ou par une absence de participation à différentes sortes de relations sociales.",
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'q18',
    text: '18 - Intérêts et activités de loisirs',
    help: "Le malade présente peu de centres d'intérêts, peu d'activités ou de \"hobbies\". Bien que ce symptôme puisse débuter lentement, insidieusement, on retrouvera facilement l'existence d'un déclin par rapport au niveau antérieur des intérêts et activités. Les sujets dont le trouble est léger entretiendront des activités passives, peu relationnelles, telles que regarder la télévision, et ces manifestations d'intérêt seront occasionnelles ou sporadiques. A l'extrême, ils apparaîtront au contraire comme totalement incapables d'apprécier une activité ou de s'y engager. L'évaluation doit prendre en compte les aspects qualitatifs et quantitatifs des intérêts et activités de loisirs.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - absence de difficultés à prendre plaisir aux loisirs', score: 0 },
      { code: 1, label: '1 - doute', score: 1 },
      { code: 2, label: '2 - légères difficultés à prendre plaisir aux loisirs', score: 2 },
      { code: 3, label: '3 - difficultés moyennes à prendre plaisir aux loisirs', score: 3 },
      { code: 4, label: '4 - difficultés importantes à prendre plaisir aux loisirs', score: 4 },
      { code: 5, label: '5 - impossibilité de prendre plaisir aux loisirs', score: 5 }
    ]
  },
  {
    id: 'q19',
    text: '19 - Intérêts et activités sexuels',
    help: "Les malades peuvent présenter une diminution des intérêts et activités sexuels : l'évaluation doit tenir compte de leur âge et de leur statut matrimonial. Les sujets mariés peuvent ne plus manifester d'intérêt pour les activités sexuelles ou n'engager de relations sexuelles qu'à la demande de leur partenaire. A l'extrême, le malade ne s'engage dans aucune activité sexuelle. Les célibataires peuvent passer de longues périodes sans relations sexuelles, sans essayer de satisfaire ce besoin. Mariés ou célibataires ils peuvent rapporter avoir des besoins sexuels minimes ou prendre peu de plaisir dans les relations sexuelles ou la masturbation, même lorsqu'ils les pratiquent.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: "0 - absence d'incapacité à jouir des activités sexuelles", score: 0 },
      { code: 1, label: '1 - doute', score: 1 },
      { code: 2, label: '2 - diminution légère mais certaine de la capacité à éprouver un plaisir sexuel', score: 2 },
      { code: 3, label: '3 - diminution moyenne de la capacité à éprouver un plaisir sexuel', score: 3 },
      { code: 4, label: '4 - diminution importante de la capacité à éprouver un plaisir sexuel', score: 4 },
      { code: 5, label: '5 - impossibilité à éprouver un plaisir sexuel', score: 5 }
    ]
  },
  {
    id: 'q20',
    text: '20 - Incapacité à vivre des relations étroites ou intimes',
    help: "Le malade peut présenter une incapacité à développer des relations étroites ou intimes, en rapport avec son âge, son sexe, son statut familial. Chez les jeunes, ce domaine doit être évalué en tenant compte des relations avec le sexe opposé, les parents, et les frères et sœurs. Chez des adultes plus âgés, s'ils sont mariés, on évaluera les relations avec l'épouse et les enfants, si non, celles avec le sexe opposé et la famille la plus proche. Les malades peuvent ne montrer que peu, ou pas, de sentiments et d'affection pour les membres de leur famille. Ils peuvent avoir organisé leur vie de façon à éviter toute relation intime, vivant seuls, sans essayer d'établir un contact avec la famille ou une personne du sexe opposé.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - absence', score: 0 },
      { code: 1, label: '1 - doute', score: 1 },
      { code: 2, label: '2 - incapacité légère, mais certaine, à développer des relations étroites ou intimes', score: 2 },
      { code: 3, label: '3 - incapacité moyenne a développer des relations étroites ou intimes', score: 3 },
      { code: 4, label: '4 - incapacité importante à développer des relations étroites ou intimes', score: 4 },
      { code: 5, label: '5 - incapacité complète à développer des relations étroites ou intimes', score: 5 }
    ]
  },
  {
    id: 'q21',
    text: '21 - Relations avec les amis et collègues',
    help: "Les relations avec les amis et collègues, quel que soit leur sexe, peuvent aussi être appauvries. Ils peuvent avoir peu, ou pas d'amis, et faire peu d'efforts pour y remédier, choisissant d'être pratiquement tout le temps seuls.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - absence', score: 0 },
      { code: 1, label: '1 - doute', score: 1 },
      { code: 2, label: '2 - difficulté légère, mais indiscutable, à nouer des relations amicales', score: 2 },
      { code: 3, label: '3 - difficulté moyenne à nouer des relations amicales', score: 3 },
      { code: 4, label: '4 - difficulté importante à nouer des relations amicales', score: 4 },
      { code: 5, label: '5 - difficulté extrême à nouer des relations amicales', score: 5 }
    ]
  },
  {
    id: 'q22',
    text: "22 - Évaluation globale de l'anhédonie et du retrait social",
    help: "L'évaluation globale doit rendre compte de la sévérité de l'ensemble symptomatique, anhédonie-retrait social, en tenant compte des normes attendues selon l'âge, le sexe, le statut familial.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - absence', score: 0 },
      { code: 1, label: '1 - doute', score: 1 },
      { code: 2, label: "2 - signes légers, mais nets, d'anhédonie-retrait social", score: 2 },
      { code: 3, label: "3 - signes moyens d'anhédonie-retrait social", score: 3 },
      { code: 4, label: "4 - signes importants d'anhédonie-retrait social", score: 4 },
      { code: 5, label: "5 - signes sévères d'anhédonie-retrait social", score: 5 }
    ]
  },

  // ============================================================================
  // ATTENTION
  // ============================================================================
  {
    id: 'section_attention',
    text: 'ATTENTION',
    help: "Les troubles de l'attention sont fréquents dans la schizophrénie. Le malade peut avoir du mal à fixer son attention, ou ne peut le faire que de façon sporadique ou aléatoire. Il peut ignorer les essais de conversation, ou paraître inattentif en situation de test ou d'entretien. Il peut avoir, ou pas, conscience de sa difficulté à fixer son attention.",
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'q23',
    text: '23 - Inattention dans les activités sociales',
    help: "Au cours de ses activités ou relations sociales, le malade paraît inattentif. Dans une conversation, il paraît ailleurs, ne saisit pas le sujet d'une discussion, ne paraît pas être partie prenante, ni concerné. Il peut cesser une discussion ou une activité, \"ex abrupto\", sans raison apparente. Il peut sembler lointain, \"pas dans le coup\" ou présenter des difficultés de concentration dans les jeux, la lecture ou devant la télévision.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - absence', score: 0 },
      { code: 1, label: '1 - doute', score: 1 },
      { code: 2, label: "2 - signes d'inattention légers, mais nets", score: 2 },
      { code: 3, label: "3 - signes d'inattention moyens", score: 3 },
      { code: 4, label: "4 - signes d'inattention importants", score: 4 },
      { code: 5, label: "5 - signes d'inattention sévères", score: 5 }
    ]
  },
  {
    id: 'q24',
    text: '24 - Inattention durant la cotation',
    help: "Les performances à des tests simples, explorant les fonctions intellectuelles, peuvent être modestes malgré le niveau d'éducation et des capacités intellectuelles. Pour l'évaluer, on peut demander d'épeler le mot MONDE à l'envers ou de proposer des épreuves arithmétiques simples tenant compte du niveau scolaire (séries de soustractions tous les trois chiffres, selon le niveau scolaire).",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: "0 - pas d'erreur", score: 0 },
      { code: 1, label: "1 - doute (pas d'erreurs, mais le sujet hésite ou commet une erreur qu'il corrige)", score: 1 },
      { code: 2, label: '2 - légère mais certaine (une erreur)', score: 2 },
      { code: 3, label: '3 - moyenne (deux erreurs)', score: 3 },
      { code: 4, label: '4 - importante (3 erreurs)', score: 4 },
      { code: 5, label: '5 - sévère (plus de trois erreurs)', score: 5 }
    ]
  },
  {
    id: 'q25',
    text: "25 - Évaluation globale de l'attention",
    help: "L'évaluation globale des possibilités d'attention, ou de concentration, doit tenir compte des éléments cliniques et des performances aux tests.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0 - absence', score: 0 },
      { code: 1, label: '1 - doute', score: 1 },
      { code: 2, label: "2 - trouble de l'attention léger mais certain", score: 2 },
      { code: 3, label: "3 - trouble de l'attention moyen", score: 3 },
      { code: 4, label: "4 - trouble de l'attention important", score: 4 },
      { code: 5, label: "5 - trouble de l'attention extrême", score: 5 }
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

export const SANS_DEFINITION: QuestionnaireDefinition = {
  id: 'sans',
  code: 'SANS',
  title: "SANS - Échelle d'appréciation des symptômes négatifs (déficitaires)",
  description: "ECHELLE D'APPRECIATION DES SYMPTOMES NEGATIFS (DEFICITAIRES) (SCALE FOR THE ASSESSMENT OF NEGATIVE SYMPTOMS). Auteur original : N.C. ANDREASEN. Traduction française : P. BOYER et Y. LECRUBIER.",
  questions: SANS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'French Translation (P. Boyer & Y. Lecrubier)',
    language: 'fr-FR'
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

export function computeSansScores(response: Partial<SchizophreniaSansResponse>): {
  affective_flattening_subscore: number | null;
  alogia_subscore: number | null;
  avolition_subscore: number | null;
  anhedonia_subscore: number | null;
  attention_subscore: number | null;
  subscores_sum: number | null;
  global_evaluations_score: number | null;
  total_score: number | null;
} {
  // Helper function to sum values, returns null if any value is null
  const sumIfComplete = (values: (number | null | undefined)[]): number | null => {
    const validValues = values.filter((v): v is number => v !== null && v !== undefined);
    if (validValues.length !== values.length) return null;
    return validValues.reduce((sum, v) => sum + v, 0);
  };

  // Affective flattening subscore: sum of items 1-7 (excluding global assessment item 8)
  const affective_flattening_subscore = sumIfComplete([
    response.q1, response.q2, response.q3, response.q4, response.q5, response.q6, response.q7
  ]);

  // Alogia subscore: sum of items 9-12 (excluding global assessment item 13)
  const alogia_subscore = sumIfComplete([
    response.q9, response.q10, response.q11, response.q12
  ]);

  // Avolition subscore: sum of items 14-16 (excluding global assessment item 17)
  const avolition_subscore = sumIfComplete([
    response.q14, response.q15, response.q16
  ]);

  // Anhedonia subscore: sum of items 18-21 (excluding global assessment item 22)
  const anhedonia_subscore = sumIfComplete([
    response.q18, response.q19, response.q20, response.q21
  ]);

  // Attention subscore: sum of items 23-24 (excluding global assessment item 25)
  const attention_subscore = sumIfComplete([
    response.q23, response.q24
  ]);

  // Sum of sub-scores
  const subscores_sum =
    affective_flattening_subscore !== null &&
      alogia_subscore !== null &&
      avolition_subscore !== null &&
      anhedonia_subscore !== null &&
      attention_subscore !== null
      ? affective_flattening_subscore + alogia_subscore + avolition_subscore + anhedonia_subscore + attention_subscore
      : null;

  // Global evaluations score: sum of items 8, 13, 17, 22, 25
  const global_evaluations_score = sumIfComplete([
    response.q8, response.q13, response.q17, response.q22, response.q25
  ]);

  // Total score: sum of all items 1-25
  const total_score = sumIfComplete([
    response.q1, response.q2, response.q3, response.q4, response.q5, response.q6, response.q7, response.q8,
    response.q9, response.q10, response.q11, response.q12, response.q13,
    response.q14, response.q15, response.q16, response.q17,
    response.q18, response.q19, response.q20, response.q21, response.q22,
    response.q23, response.q24, response.q25
  ]);

  return {
    affective_flattening_subscore,
    alogia_subscore,
    avolition_subscore,
    anhedonia_subscore,
    attention_subscore,
    subscores_sum,
    global_evaluations_score,
    total_score
  };
}
