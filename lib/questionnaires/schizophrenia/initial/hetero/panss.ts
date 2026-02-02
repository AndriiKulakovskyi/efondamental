// eFondaMental Platform - PANSS (Positive and Negative Syndrome Scale)
// 30-item clinician-rated scale for measuring symptom severity of schizophrenia
// Original authors: Kay SR, Fiszbein A, Opler LA (1986)
// French translation: Lepine JP (1989)

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaPanssResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Positive subscale (P1-P7)
  p1?: number | null;
  p2?: number | null;
  p3?: number | null;
  p4?: number | null;
  p5?: number | null;
  p6?: number | null;
  p7?: number | null;
  
  // Negative subscale (N1-N7)
  n1?: number | null;
  n2?: number | null;
  n3?: number | null;
  n4?: number | null;
  n5?: number | null;
  n6?: number | null;
  n7?: number | null;
  
  // General psychopathology subscale (G1-G16)
  g1?: number | null;
  g2?: number | null;
  g3?: number | null;
  g4?: number | null;
  g5?: number | null;
  g6?: number | null;
  g7?: number | null;
  g8?: number | null;
  g9?: number | null;
  g10?: number | null;
  g11?: number | null;
  g12?: number | null;
  g13?: number | null;
  g14?: number | null;
  g15?: number | null;
  g16?: number | null;
  
  // Computed scores
  positive_score?: number | null;
  negative_score?: number | null;
  general_score?: number | null;
  total_score?: number | null;
  
  questionnaire_done?: string | null;
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaPanssResponseInsert = Omit<
  SchizophreniaPanssResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'positive_score' | 'negative_score' | 'general_score' | 'total_score'
>;

// ============================================================================
// Response Options
// ============================================================================

const PANSS_RESPONSE_OPTIONS = [
  { code: 1, label: 'ABSENT', score: 1 },
  { code: 2, label: 'MINIME', score: 2 },
  { code: 3, label: 'LEGER', score: 3 },
  { code: 4, label: 'MOYEN', score: 4 },
  { code: 5, label: 'MODEREMENT SEVERE', score: 5 },
  { code: 6, label: 'SEVERE', score: 6 },
  { code: 7, label: 'EXTREME', score: 7 }
];

// ============================================================================
// Questions
// ============================================================================

export const PANSS_QUESTIONS: Question[] = [
  // Status
  {
    id: 'questionnaire_done',
    text: 'Passation du questionnaire',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'fait', label: 'Fait' },
      { code: 'non_fait', label: 'Non fait' }
    ]
  },
  // Positive Subscale (P1-P7)
  { id: 'section_positive', text: 'Sous-score positif', type: 'section', required: false },
  {
    id: 'p1', text: 'P1. DÉLIRE',
    help: 'Croyances qui sont non fondées, irréalistes et idiosyncratiques. Base de la notation : contenu de la pensée exprimée lors de l’interview et son influence sur les relations sociales et le comportement.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - NÉANT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie discutable ; éventuellement à l’extrême limite de la norme.", score: 2 },
      { code: 3, label: "3 - FAIBLE – Présence d’une ou deux idées délirantes assez vagues, ni rigides, ni tenaces. Ces idées n’interfèrent ni dans la pensée, ni dans les relations sociales, ni dans le comportement.", score: 3 },
      { code: 4, label: "4 - MODÉRÉ – Présence d’un éventail kaléidoscopique d’idées délirantes peu formées ou instables, ou de quelques idées plus développées qui interfèrent occasionnellement dans la pensée, les relations sociales ou le comportement.", score: 4 },
      { code: 5, label: "5 - MODÉRÉ, PRONONCÉ – Présence de nombreuses idées délirantes très développées et très tenaces qui interfèrent occasionnellement dans la pensée, les relations sociales ou le comportement.", score: 5 },
      { code: 6, label: "6 - PRONONCÉ – Présence d’un ensemble stable d’idées délirantes qui sont cristallisées, éventuellement systématisées, très tenaces, et qui interfèrent de manière non dissimulée dans la pensée, les relations sociales et le comportement.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Présence d’un ensemble stable d’idées délirantes qui sont, soit très systématisées, soit très nombreuses et qui dominent les aspects principaux de la vie du patient, ce qui entraîne très fréquemment des actions inadéquates et irresponsables qui peuvent mettre en danger la sécurité du patient ou celle des autres.", score: 7 }
    ]
  },
  {
    id: 'p2', text: 'P2. TROUBLES DE LA PENSÉE',
    help: 'Processus désorganisé de la pensée, caractérisé par un dérèglement du cheminement finalisé, par exemple, circonstancialité, tangentialité, associations vagues, incohérences, illogisme grossier ou blocage de la pensée. Base de la notation : processus cognitif et verbal examiné lors de l’interview.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - NÉANT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie discutable ; éventuellement à l’extrême limite de la norme.", score: 2 },
      { code: 3, label: "3 - FAIBLE – La pensée est circonstancielle, tangentielle ou paralogique. Présence de problèmes pour diriger la pensée vers un but, et une certaine perte de la précision dans les associations peut apparaître lors de tensions psychiques.", score: 3 },
      { code: 4, label: "4 - MODÉRÉ – Capable de concentrer ses pensées lorsque les échanges sont brefs et structurés, mais perd sa précision ou le sens de la relation lorsque la communication se fait plus complexe ou lorsque apparaît la moindre tension.", score: 4 },
      { code: 5, label: "5 - MODÉRÉ, PRONONCÉ – En général, le patient connaît des difficultés pour organiser ses pensées, ce qui se traduit par des actes insensés ou incohérents fréquents, un manque de lien dans ses associations, même lorsqu’il n’est pas soumis à une tension.", score: 5 },
      { code: 6, label: "6 - PRONONCÉ – La pensée est sérieusement perturbée et intrinsèquement inconséquente ce qui entraîne des pertes grossières du sens de l’à propos et un dérèglement presque constant des processus de pensée.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Les pensées sont déréglées au point que le patient devient tout à fait incohérent. Il y a une réelle perte de la cohérence dans les associations, ce qui entraîne un échec total de la communication comme, par exemple, des « salades de mots » ou le mutisme.", score: 7 }
    ]
  },
  {
    id: 'p3', text: 'P3. COMPORTEMENT HALLUCINATOIRE',
    help: 'Rapport verbal ou perceptions comportementales qui ne sont pas provoquées par des stimuli externes. Peut se produire dans les champs auditif, visuel, olfactif ou somatique. Base de la notation : rapport verbal et manifestations physiques pendant l’interview et rapports sur le comportement provenant du personnel hospitalier ou de membres de la famille du patient.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - NÉANT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie discutable ; éventuellement à l’extrême limite de la norme.", score: 2 },
      { code: 3, label: "3 - FAIBLE – Une ou deux hallucinations clairement développées mais peu fréquentes, ou un certain nombre de perceptions vagues anormales qui ne provoquent pas de dérangement de la pensée ni du comportement.", score: 3 },
      { code: 4, label: "4 - MODÉRÉ – Les hallucinations se font fréquemment, mais ne sont pas continues, et les pensées ainsi que le comportement du patient, sont affectés dans une faible mesure.", score: 4 },
      { code: 5, label: "5 - MODÉRÉ, PRONONCÉ – Hallucinations fréquentes qui peuvent impliquer plusieurs modalités sensorielles et ont tendance à dérégler la pensée et/ou à troubler le comportement. Le patient peut avoir une interprétation délirante de ces expériences et leur répondre de manière émotionnelle et parfois aussi sous forme verbale.", score: 5 },
      { code: 6, label: "6 - PRONONCÉ – Les hallucinations sont presque constamment présentes, provoquant un dérèglement important de la pensée et du comportement. Le patient les traite comme de véritables perceptions et le fonctionnement normal est empêché par de fréquentes réponses émotionnelles et verbales à ces hallucinations.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Le patient est presque totalement préoccupé par ses hallucinations qui dominent presque complètement sa pensée et son comportement. Il donne à ces hallucinations une interprétation délirante rigide, et elles provoquent des réponses verbales et comportementales qui peuvent aller jusqu’à l’obéissance à des hallucinations de type impératif.", score: 7 }
    ]
  },
  {
    id: 'p4', text: 'P4. EXCITATION',
    help: 'Hyperactivité qui se traduit par un comportement moteur accéléré, un taux de réponse aux stimulis plus élevé, une hypervigilance ou une labilité d\'humeur excessive. Base de la notation : Manifestations comportementales lors de l\'interview et rapports sur le comportement provenant du personnel hospitalier ou de membres de la famille.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - NÉANT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie discutable ; éventuellement à l’extrême limite de la norme.", score: 2 },
      { code: 3, label: "3 - FAIBLE – Tendance à se montrer légèrement agité, hypervigilant ou légèrement énervé au cours de l'interview, mais sans qu'il n'existe de période précise d'énervement ou de labilité d'humeur. Une certaine tension peut se traduire dans l'expression orale.", score: 3 },
      { code: 4, label: "4 - MODÉRÉ – Agitation ou excitation évidente au cours de l'interview, qui trouble l'expression ou la mobilité générale, ou énervements épisodiques.", score: 4 },
      { code: 5, label: "5 - MODÉRÉ, PRONONCÉ – Hyperactivité évidente ou nombreuses augmentations de l'activité motrice, qui entraînent des difficultés à rester assis plus de quelques minutes, et ce, à n'importe quel moment.", score: 5 },
      { code: 6, label: "6 - PRONONCÉ – Une excitation évidente domine toute l'interview, limite l'attention du patient, et, dans une certaine mesure, va agir sur ses fonctions personnelles (dormir ou manger).", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Excitation évidente qui interfère sérieusement dans l'alimentation et le sommeil et qui rend les interactions interpersonnelles quasiment impossibles. L'accélération du discours et de l'activité motrice peuvent amener l'incohérence et l'épuisement.", score: 7 }
    ]
  },
  {
    id: 'p5', text: 'P5. MÉGALOMANIE',
    help: 'Opinion de soi exagérée et convictions de supériorité irréalistes, qui peuvent aller jusqu’au délire et se croire des capacités, une richesse, une connaissance, une réputation, une puissance et une droiture morale extraordinaires. Base de la notation : contenu de la pensée exprimé lors de l’interview et ses influences sur le comportement.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - NÉANT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie discutable : éventuellement à l’extrême limite de la norme.", score: 2 },
      { code: 3, label: "3 - FAIBLE – Vantardise et excès d’orgueil évidents, mais pas vraiment de délire mégalomaniaque.", score: 3 },
      { code: 4, label: "4 - MODÉRÉ – Se sent de manière claire et irréaliste supérieur aux autres. Quelques idées délirantes peu développées à propos d’un statut spécial ou de facultés particulières peuvent se manifester, mais celles-ci ne déterminent pas vraiment ses actes.", score: 4 },
      { code: 5, label: "5 - MODÉRÉ, PRONONCÉ – Idées délirantes très précises à propos de facultés extraordinaires, d’un statut ou d’une puissance remarquables, qui vont influencer son attitude mais pas son comportement.", score: 5 },
      { code: 6, label: "6 - PRONONCÉ – Idées délirantes très précises à propos d’une supériorité très nette sur plusieurs paramètres (richesse, connaissance, réputation… etc.) qui influencent les interactions de manière notable et peuvent déterminer ses actes.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – La pensée, les relations interpersonnelles et le comportement sont dominés par de nombreuses idées délirantes de facultés, de richesse, de connaissance, de réputation, de puissance et/ou de droiture morale surprenantes, qui peuvent revêtir une forme très bizarre.", score: 7 }
    ]
  },
  {
    id: 'p6', text: 'P6. MÉFIANCE/COMPLEXE DE PERSÉCUTION',
    help: 'Impressions irréalistes ou exagérées de persécution qui se reflètent dans une certaine circonspection, une attitude méfiante, une hypervigilance soupçonneuse ou de véritables idées délirantes qui persuadent le patient que les autres lui veulent du mal. Base de la notation : contenu de la pensée exprimé lors de l’interview et ses influences sur le comportement.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - NÉANT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie discutable ; éventuellement à l’extrême limite de la norme.", score: 2 },
      { code: 3, label: "3 - FAIBLE – Attitude réservée, voire franchement méfiante, mais les pensées, interactions et comportement ne sont que très peu affectés.", score: 3 },
      { code: 4, label: "4 - MODÉRÉ – Méfiance évidente et interfère sur le comportement lors de l’interview, mais il n’y a pas de preuve de l’existence d’un délire de persécution. Eventuellement on pourra trouver des traces d’un délire persécuteur très vague, mais il ne semble pas avoir d’influence sur l’attitude du patient ou sur ses relations interpersonnelles.", score: 4 },
      { code: 5, label: "5 - MODÉRÉ, PRONONCÉ – Le patient fait preuve d’une méfiance très marquée, qui peut conduire à un dérèglement majeur des relations interpersonnelles, où il existe un délire persécuteur très net qui a un impact limité sur les relations interpersonnelles et sur le comportement.", score: 5 },
      { code: 6, label: "6 - PRONONCÉ – Délire de persécution profond qui peut être systématisé et qui interfère de manière notable dans les relations interpersonnelles.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – La pensée, les relations sociales et le comportement du patient sont dominés par un réseau d’idées délirantes persécutrices prononcées et systématisées.", score: 7 }
    ]
  },
  {
    id: 'p7', text: 'P7. HOSTILITÉ',
    help: 'Expression verbale et non verbale de colère et de ressentiment, voire même de sarcasme, comportement passif-agressif, insultes et violence. Base de la notation : comportement interpersonnel observé lors de l\'interview et rapports sur le comportement provenant du personnel hospitalier ou de membres de la famille.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - NÉANT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie discutable ; éventuellement à l’extrême limite de la norme.", score: 2 },
      { code: 3, label: "3 - FAIBLE – Expression indirecte ou retenue de colère : sarcasme, manque de respect, expressions hostiles et irritabilité occasionnelle.", score: 3 },
      { code: 4, label: "4 - MODÉRÉ – Fait montre d'une attitude clairement hostile, d'irritabilité fréquente ; expression directe de colère ou de ressentiment.", score: 4 },
      { code: 5, label: "5 - MODÉRÉ, PRONONCÉ – Le patient est très irritable et peut se montrer injurieux voire menaçant.", score: 5 },
      { code: 6, label: "6 - PRONONCÉ – Manque de coopération et insultes ou menaces qui ont une influence notable sur le déroulement de l'interview et un impact sérieux sur les relations sociales. Le patient peut se montrer violent et destructeur mais pas agressif physiquement vis-à-vis des autres.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Colère prononcée qui débouche sur un manque total de coopération excluant toute interaction, ou sur une agressivité physique épisodique vis-à-vis des autres.", score: 7 }
    ]
  },
  
  // Negative Subscale (N1-N7)
  { id: 'section_negative', text: 'Sous-score négatif', type: 'section', required: false },
  {
    id: 'n1', text: 'N1. AFFECT ÉMOUSSÉ',
    help: 'Réponse émotionnelle diminuée qui se caractérise par une réduction de la mimique faciale, de la modulation des sentiments et des gestes de communication. Base de la notation : observation des manifestations physiques du ton affectif et de la réponse émotionnelle lors de l’interview.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - NÉANT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie discutable : éventuellement à l’extrême limite de la norme.", score: 2 },
      { code: 3, label: "3 - FAIBLE – Les changements d’expression faciale et les gestes communicatifs semblent artificiels, forcés, guindés, ou manquent de modulation.", score: 3 },
      { code: 4, label: "4 - MODÉRÉ – Une gamme d’expressions faciales réduite et un nombre restreint de gestes expressif donnent au patient un air déprimé.", score: 4 },
      { code: 5, label: "5 - MODÉRÉ, PRONONCÉ – L’affect est généralement « plat », avec quelques changements occasionnels de l’expression faciale et une absence de gestes de communication.", score: 5 },
      { code: 6, label: "6 - PRONONCÉ – Manque de relief et déficience des émotions prononcées la plupart du temps. Possibilité d’épanchements affectifs extrêmes non modulés (excitation rage ou rire incontrôlé sans raison).", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Absence presque totale de changement dans l’expression faciale et de trace de gestes de communication. Le patient semble montrer une expression neutre ou « de glace ».", score: 7 }
    ]
  },
  {
    id: 'n2', text: 'N2. RETRAIT ÉMOTIONNEL',
    help: 'Manque d’intérêt, d’implication et d’engagement affectif vis-à-vis des événements de la vie quotidienne. Base de la notation : rapports sur le fonctionnement provenant du personnel hospitalier ou de la famille et observation du comportement interpersonnel lors de l’interview.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - NÉANT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie discutable : éventuellement à l’extrême limite de la norme.", score: 2 },
      { code: 3, label: "3 - FAIBLE – Manque habituellement d’initiative et peut éventuellement faire preuve d’un intérêt déficient envers les événements qui l’entourent.", score: 3 },
      { code: 4, label: "4 - MODÉRÉ – Le patient est en général émotionnellement éloigné de son milieu et de ses problèmes mais peut s’y intéresser s’il y est encourage.", score: 4 },
      { code: 5, label: "5 - MODÉRÉ, PRONONCÉ – Le patient est tout à fait détaché, sur le plan émotionnel, des personnes et événements de son milieu et se ferme à tout effort d’intégration. Il semble distant, docile et sans but, mais peut s’intégrer à une conversation, au moins pendant un temps assez bref, et semble éprouver des besoins personnels qui peuvent exiger de l’aide.", score: 5 },
      { code: 6, label: "6 - PRONONCÉ – Un manque d’intérêt et d’engagement émotionnel prononcé entraîne une conversation limitée et une négligence fréquente des fonctions personnelles pour lesquelles le patient a besoin d’assistance.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Le patient est presque totalement retiré, ne communique presque plus et néglige ses besoins personnels. Ceci provient d’un manque évident d’intérêt et d’engagement sur le plan émotionnel.", score: 7 }
    ]
  },
  {
    id: 'n3', text: 'N3. CONTACT FAIBLE',
    help: 'Manque d’ouverture interpersonnelle dans la conversation, manque de contact, d’intérêt ou d’implication vis-à-vis de l’intervieweur, ce qui se traduit par une distanciation sur le plan interpersonnel et une communication verbale et non verbale très réduite. Base de la notation : comportement interpersonnel pendant l’interview.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - NÉANT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie discutable : éventuellement à l’extrême limite de la norme.", score: 2 },
      { code: 3, label: "3 - FAIBLE – La conversation est caractérisée par un ton emprunté, contraint ou artificiel. Elle peut manquer de profondeur émotionnelle ou avoir tendance à rester sur un plan strictement impersonnel ou intellectuel.", score: 3 },
      { code: 4, label: "4 - MODÉRÉ – Le patient est très réservé et montre une distance interpersonnelle très marquée. Il peut répondre aux questions de manière mécanique, donner l’impression de s’embêter ou exprimer son désintérêt.", score: 4 },
      { code: 5, label: "5 - MODÉRÉ, PRONONCÉ – Le désintérêt est évident au point d’empêcher l’interview d’être productive. Il peut avoir tendance à éviter le contact visuel ou du visage.", score: 5 },
      { code: 6, label: "6 - PRONONCÉ – Le patient apparaît excessivement indifférent et montre une distance interpersonnelle très marquée. Les réponses sont superficielles et il n’y a que peu de marques non verbales d’un quelconque engagement. Les contacts du regard ou du visage sont souvent évités.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Le patient reste tout à fait hermétique face à l’intervieweur. Il se montre complètement indifférent et évite constamment toute interaction verbale et non verbale durant l’interview.", score: 7 }
    ]
  },
  {
    id: 'n4', text: 'N4. RETRAIT SOCIAL PASSIF/APATHIQUE',
    help: 'Amoindrissement de l’intérêt et de l’initiative dans les interactions sociales dû à la passivité, à l’apathie, l’anergie ou la perte de la volonté. Ce qui conduit à une diminution des engagements interpersonnels et à une certaine négligence des activités de la vie quotidienne. Base de la notation : rapports concernant le comportement social qui proviennent du personnel hospitalier ou de la famille.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - NÉANT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie discutable ; éventuellement à l’extrême limite de la norme.", score: 2 },
      { code: 3, label: "3 - FAIBLE – Le patient manifeste un intérêt occasionnel pour des activités sociales mais ne fait preuve que de peu d’initiatives. N’a généralement de réels contacts avec les autres que si ceux-ci font le premier pas.", score: 3 },
      { code: 4, label: "4 - MODÉRÉ – Suit de manière passive la plupart des activités sociales, mais d’une manière désintéressée ou mécanique. A tendance à rester à l’arrière plan.", score: 4 },
      { code: 5, label: "5 - MODÉRÉ, PRONONCÉ – Participe de manière passive à un minimum d’activités et ne montre quasi aucun intérêt ni initiative. Ne passe en général que très peu de temps avec les autres.", score: 5 },
      { code: 6, label: "6 - PRONONCÉ – Tendance à l’apathie et à l’isolement, ne participe que rarement à des activités sociales et néglige, à l’occasion, ses besoins personnels. Le patient n’a que très peu de contacts sociaux spontanés.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Profondément apathique, isolé sur le plan social, et très négligeant vis-à-vis de lui-même.", score: 7 }
    ]
  },
  {
    id: 'n5', text: 'N5. DIFFICULTÉ DE RAISONNER DANS L\'ABSTRAIT',
    help: 'Détérioration du mode de pensée abstrait-symbolique, qui se traduit par des difficultés pour établir un classement, une généralisation ou pour dépasser la pensée concrète ou égocentrique, dans la résolution de problèmes. Base de la notation : réponses aux questions sur les similitudes et l’interprétation de proverbes, et utilisation de la dichotomie « abstrait-concret » lors de l’interview.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - NÉANT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie discutable ; éventuellement à l’extrême limite de la norme.", score: 2 },
      { code: 3, label: "3 - FAIBLE – Le patient a tendance à donner une interprétation littérale ou personnelle aux proverbes les plus difficiles et peut éprouver certains problèmes face à des concepts relativement abstraits ou entre lesquels les liens ne sont pas toujours évidents.", score: 3 },
      { code: 4, label: "4 - MODÉRÉ – Le patient a souvent recours au mode concret. Il éprouve des difficultés avec la plupart des proverbes et avec certaines catégories. Il a tendance à sa laisser distraire par les aspects fonctionnels et par des caractéristiques exceptionnelles.", score: 4 },
      { code: 5, label: "5 - MODÉRÉ, PRONONCÉ – Travaille essentiellement en mode concret et éprouve des problèmes avec la plupart des proverbes et avec de nombreuses catégories.", score: 5 },
      { code: 6, label: "6 - PRONONCÉ – Incapable de saisir le sens abstrait du moindre proverbe ou expression métaphorique ; il ne peut déterminer de classification que pour les similitudes les plus élémentaires. La pensée est soit vide, soit limitée aux aspects fonctionnels, aux caractéristiques les plus notoires et à des interprétations idiosyncratiques.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Le patient ne peut utiliser que les modes concrets de pensée. Il ne démontre aucune compréhension des proverbes, des métaphores ou comparaisons les plus courantes, ni des catégories les plus simples. Il n’est pas capable d’établir une classification même au départ des attributs les plus évidents ou les plus fonctionnels. Cette notation peut être appliquée aux patients qui sont incapables de la moindre interaction avec l’examinateur à cause d’un amoindrissement très marqué de la connaissance.", score: 7 }
    ]
  },
  {
    id: 'n6', text: 'N6. MANQUE DE SPONTANÉITÉ ET FLOT DE CONVERSATION',
    help: 'Réduction du flot normal de communication combinée à une certaine apathie, perte de la volonté, méfiance, ou à un déficit de la connaissance. Ce qui se traduit par une fluidité et une productivité du processus verbal-interactionnel amoindries. Base de la notion : processus verbal et de la connaissance observé lors de l’interview.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - NÉANT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie discutable ; éventuellement à l’extrême limite de la norme.", score: 2 },
      { code: 3, label: "3 - FAIBLE – La conversation ne relève que peu d’initiatives. Les réponses du patient ont tendance à être brèves et enrobées, ce qui demande de la part de l’intervieweur des questions directes et orientées.", score: 3 },
      { code: 4, label: "4 - MODÉRÉ – La conversation manque de fluidité et semble inégale, voire chaotique. Des questions orientées sont souvent nécessaires pour obtenir des réponses sensées et pouvoir poursuivre la conversation.", score: 4 },
      { code: 5, label: "5 - MODÉRÉ, PRONONCÉ – Le patient fait preuve d’une manque de spontanéité et d’ouverture évident ; il ne répond à l’intervieweur qu’au moyen d’une ou deux phrases très courtes.", score: 5 },
      { code: 6, label: "6 - PRONONCÉ – Les réponses du patient sont essentiellement limitées à quelques mots ou à de courtes phrases dont le but est d’éviter ou de couper court à la communication (ex. « je ne sais pas » ; « je ne peux pas vous dire »). La conversation s’en trouve fortement diminuée et l’interview s’avère peu productive.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – L’expression verbale est limitée tout au pus à quelques mots épisodiques, rendant toute conversation impossible.", score: 7 }
    ]
  },
  {
    id: 'n7', text: 'N7. PENSÉE STÉRÉOTYPÉE',
    help: 'Diminution de la fluidité, spontanéité et flexibilité de la pensée, qui se traduit par un contenu de la pensée rigide, répétitif, voire stérile. Base de la notation : processus verbal et de la connaissance observé lors de l’interview.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - NÉANT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie discutable ; éventuellement à l’extrême limite de la norme.", score: 2 },
      { code: 3, label: "3 - FAIBLE – Une certaine rigidité dans les attitudes ou les croyances. Le patient peut refuser d’envisager des positions alternatives ou éprouver des difficultés à passer d’une idée à l’autre.", score: 3 },
      { code: 4, label: "4 - MODÉRÉ – La conversation tourne autour d’un thème récurrent, ce qui entraîne des difficultés pour passer à un nouveau sujet.", score: 4 },
      { code: 5, label: "5 - MODÉRÉ, PRONONCÉ – La pensée est rigide et répétitive à un point tel que la conversation est limitée à deux ou trois sujets, malgré les efforts de l’intervieweur.", score: 5 },
      { code: 6, label: "6 - PRONONCÉ – Répétition non contrôlée de demandes, d’affirmations, d’idées ou de questions qui entravent sérieusement la conversation.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – La pensée, le comportement et la conversation sont dominés par une répétition constante d’idées fixes ou de phrases limitées, ce qui entraîne une très grande rigidité, un manque d’à-propos et une restriction dans la communication du patient.", score: 7 }
    ]
  },
  
  // General Psychopathology Subscale (G1-G16)
  { id: 'section_general', text: 'Sous-score général', type: 'section', required: false },
  {
    id: 'g1', text: 'G1. PRÉOCCUPATIONS SOMATIQUES',
    help: 'Plaintes physiques ou conviction d’être atteint d’une maladie ou de troubles fonctionnels pouvant aller d’un sentiment vague de maladie à l’idée délirante précise d’être atteint d’une maladie physique gravissime. Eléments de cotation : contenu de la pensée exprimé au cours de l’entretien.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - ABSENT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Sujet pouvant être dans les limites de la normale.", score: 2 },
      { code: 3, label: "3 - LÉGER – Nettement concerné par la santé ou les problèmes somatiques tel qu’il ressort de questions occasionnelles et d'un désir d'être rassuré.", score: 3 },
      { code: 4, label: "4 - MOYEN – Se plaint de mauvaise santé ou de troubles physiques mais sans conviction délirante : ce souci peut être dissipé par la réassurance.", score: 4 },
      { code: 5, label: "5 - MODÉRÉMENT SÉVÈRE – Le patient exprime de nombreuses ou de fréquentes plaintes concernant une maladie physique ou un trouble fonctionnel, ou bien révèle une ou deux idées délirantes précises concernant ces thèmes, mais n’en est pas préoccupé.", score: 5 },
      { code: 6, label: "6 - SÉVÈRE – Le patient est préoccupé par une ou plusieurs idées délirantes précises concernant une maladie physique ou un dysfonctionnement organique, mais l’affect n’est pas complètement envahi par ces thèmes et les pensées peuvent être distraites par l'enquêteur au prix de quelques efforts.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Idées délirantes somatiques nombreuses et fréquentes, ou uniquement quelques idées délirantes somatiques de nature catastrophique dominant totalement l’affect et la pensée du patient.", score: 7 }
    ]
  },
  {
    id: 'g2', text: 'G2. ANXIÉTÉ',
    help: 'Expérience subjective de nervosité, d’inquiétude, d’appréhension ou d’impatience, pouvant aller d’une préoccupation excessive concernant le présent ou le futur, à des sensations de panique. Eléments de cotation : éléments verbaux rapportés durant la conduite de l’entretien et manifestations physiques correspondantes.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - ABSENT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie douteuse, sujet pouvant être dans les limites de la normale.", score: 2 },
      { code: 3, label: "3 - LÉGER – Le patient exprime une certaine inquiétude, une préoccupation excessive ou un sentiment subjectif d’agitation, mais il ne relate pas ou ne met pas en évidence de conséquences somatiques ou comportementales.", score: 3 },
      { code: 4, label: "4 - MOYEN – Le patient relate des symptômes nets de nervosité dont témoignent des manifestations physiques discrètes, telles qu’un tremblement fin des mains et une transpiration excessive.", score: 4 },
      { code: 5, label: "5 - MODÉRÉMENT-SÉVÈRE – Le patient relate des problèmes graves d’anxiété qui ont des conséquences physiques et comportementales significatives, telles qu’une tension marquée, des difficultés de concentration, des palpitations ou des troubles du sommeil.", score: 5 },
      { code: 6, label: "6 - SÉVÈRE – État subjectif de peur presque constante associée à des phobies, une agitation marquée ou de nombreuses manifestations somatiques.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – La vie du patient est sérieusement perturbée par l’anxiété qui est présente de manière presque constante et qui va parfois jusqu’à la panique ou qui se manifeste par de véritables attaques de panique.", score: 7 }
    ]
  },
  {
    id: 'g3', text: 'G3. SENTIMENTS DE CULPABILITE',
    help: 'Sentiments de remords ou de reproche, adressés à soi-même, pour de mauvaises actions réelles ou imaginaires perpétrées dans le passé. Éléments de cotation : sentiments de culpabilité rapportés verbalement durant la conduite de l’entretien et influence sur les attitudes et les pensées.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - ABSENT – Définition non applicable", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie douteuse, sujet pouvant être dans les limites de la normale.", score: 2 },
      { code: 3, label: "3 - LÉGER – Les questions mettent à jour un sentiment vague de culpabilité ou de reproche à propos d’un incident mineur, mais le patient ne s’en inquiète manifestement pas outre mesure.", score: 3 },
      { code: 4, label: "4 - MOYEN – Le patient exprime une inquiétude nette concernant sa responsabilité à propos d’un incident réel, mais n’en est pas préoccupé et son attitude et son comportement n’en sont pas fondamentalement affectés.", score: 4 },
      { code: 5, label: "5 - MODÉRÉMENT-SÉVÈRE – Le patient exprime un sentiment vif de culpabilité associé à une autodépréciation ou à la conviction qu’il mérite une punition. Les sentiments de culpabilité peuvent avoir une base délirante, peuvent être révélés spontanément où entraîner", score: 5 },
      { code: 6, label: "6 - SÉVÈRE – Les idées de culpabilité prennent un aspect délirant et conduisent à une attitude de désespoir et à un sentiment d’inutilité. Le patient est convaincu qu’il doit recevoir une sanction sévère pour ses méfaits et peut même considérer que sa situation de vie actuelle représente la punition.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – La vie du patient est dominée par des idées délirantes inébranlables de culpabilité pour lesquelles il pense mériter une punition radicale telle l’emprisonnement ou la mort.", score: 7 }
    ]
  },
  {
    id: 'g4', text: 'G4. TENSION',
    help: 'Manifestations physiques patentes de peur, d’anxiété et d’agitation telles raideur, tremblements, sueurs profuses et impatiences. Éléments de cotation : éléments verbaux témoignant de l’anxiété et sévérité des manifestations physiques de tensions observées durant l’entretien.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - ABSENT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie douteuse, sujet pouvant être dans les limites de la normale.", score: 2 },
      { code: 3, label: "3 - LÉGER – Le maintien et les mouvements indiquent une légère appréhension telle une raideur minime, une impatience occasionnelle, des changements de position ou un tremblement des mains fin et rapide.", score: 3 },
      { code: 4, label: "4 - MOYEN – Un aspect nettement nerveux ressort de différentes manifestations, tel un comportement fébrile, un tremblement des mains évident, une transpiration excessive ou un maniérisme inquiet.", score: 4 },
      { code: 5, label: "5 - MODÉRÉMENT-SÉVÈRE – Une tension manifeste est évidente au vu de nombreuses manifestations telles un tremblement nerveux, des sueurs profuses et une impatience, mais la conduite de l’entretien n’est pas perturbée de manière significative.", score: 5 },
      { code: 6, label: "6 - SÉVÈRE – La tension est telle que les échanges interpersonnels sont perturbés. Le patient est, par exemple, constamment fébrile, incapable de rester assez longtemps ou en proie à une hyperventilation.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Tension marquée se manifestant par des signes de panique ou une accélération motrice importante, telle le fait de marcher rapidement de long en large et une incapacité à rester assis plus d'une minute.", score: 7 }
    ]
  },
  {
    id: 'g5', text: 'G5. MANIÉRISME ET TROUBLES DE LA POSTURE',
    help: 'Mouvements ou maintien affectés caractérisés par un aspect maladroit, guindé, désorganisé ou étrange. Eléments de cotation : observation de manifestations physiques durant la conduite de l’entretien ainsi qu’éléments rapportés par l’équipe soignante ou la famille.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - ABSENT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie douteuse, sujet pouvant être dans les limites de la normale.", score: 2 },
      { code: 3, label: "3 - LÉGER – Légère maladresse dans les mouvements ou rigidité minime du maintien.", score: 3 },
      { code: 4, label: "4 - MOYEN – Les mouvements sont notablement maladroits ou décousus, ou la position est affectée durant es périodes brèves.", score: 4 },
      { code: 5, label: "5 - MODÉRÉMENT-SÉVÈRE – On observe, soit des rituels bizarres occasionnels ou des contorsions, soit le maintien d’une position normale sur des périodes prolongées.", score: 5 },
      { code: 6, label: "6 - SÉVÈRE – Répétition fréquente de rituels bizarres, d’une maniérisme ou de mouvements stéréotypés, ou maintien de contorsions sur des périodes de temps prolongées.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Le fonctionnement est sévèrement altéré par la mise en jeu presque constante de mouvements ritualisés, maniérés ou stéréotypes, ou par une posture raide et inappropriée.", score: 7 }
    ]
  },
  {
    id: 'g6', text: 'G6. DÉPRESSION',
    help: 'Sentiment de tristesse, de découragement, d’impuissance et de pessimisme. Éléments de cotation : relation verbale d’humeur dépressive durant le déroulement de l’entretien et son influence observée sur l’attitude et le comportement.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - ABSENT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie douteuse, sujet pouvant être dans les limites de la normale.", score: 2 },
      { code: 3, label: "3 - LÉGER – Le sujet exprime un certain degré de tristesse ou de découragement uniquement lorsqu’il est interrogé, mais il n’y a pas d’éléments en faveur d’une dépression dans l’attitude générale ou les comportements.", score: 3 },
      { code: 4, label: "4 - MOYEN – Sentiment net de tristesse ou de désespoir qui peut être révélé spontanément, mais l’humeur dépressive n’a pas d’impact majeur sur le comportement ou le fonctionnement social et le patient peut en principe se dérider s’il est stimulé.", score: 4 },
      { code: 5, label: "5 - MODÉRÉMENT-SÉVÈRE – Humeur dépressive nette associée à une tristesse, un pessimisme, une perte des intérêts sociaux, un ralentissement psychomoteur évidents, avec un certain retentissement sur l’appétit et le sommeil. Le patient ne se déride pas facilement même s’il est stimulé.", score: 5 },
      { code: 6, label: "6 - SÉVÈRE – Humeur dépressive marquée associée à une impression soutenue de détresse, des pleurs occasionnels, du désespoir et un sentiment d’inutilité. De plus il existe un retentissement majeur sur l’appétit et/ou le sommeil ainsi que sur les fonctions sociales et le fonctionnement moteur avec, éventuellement, des signes de laisser-aller.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Les sentiments dépressifs retentissent gravement sur la plupart des fonctions majeures. Les manifestations comprennent des pleurs fréquents, des symptômes somatiques marqués, des difficultés de concentration, un ralentissement psychomoteur, un désintérêt social, un laisser-aller, éventuellement des idées délirantes dépressives ou nihilistes et/ou des idées ou comportements suicidaires.", score: 7 }
    ]
  },
  {
    id: 'g7', text: 'G7. RALENTISSEMENT PSYCHOMOTEUR',
    help: 'Réduction de l’activité motrice dont témoignent le ralentissement ou la diminution des mouvements et de la parole, une diminution des réponses aux stimuli et une réduction du tonus corporel. Éléments de cotation : manifestations durant le déroulement de l’entretien ainsi que relations verbales faites par l’équipe soignante ou la famille.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - ABSENT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie douteuse, sujet pouvant être dans les limites de la normale.", score: 2 },
      { code: 3, label: "3 - LÉGER – Diminution légère mais notable dans la fréquence des mouvements et de la parole. Le patient peut être quelque peu improductif dans la conversation et les gestes.", score: 3 },
      { code: 4, label: "4 - MOYEN – Le patient est nettement ralenti dans ses mouvements et son discours peut être caractérisé, mais une productivité pauvre incluant des temps de latence entre les questions et les réponses, des pauses prolongées ou débit lent.", score: 4 },
      { code: 5, label: "5 - MODÉRÉMENT SÉVÈRE – Une réduction marquée des activités motrices rend la communication hautement improductive, ou limite le fonctionnement dans les activités sociales et professionnelles. Le patient est presque toujours assis ou couché.", score: 5 },
      { code: 6, label: "6 - SÉVÈRE – Les mouvements sont extrêmement lents, ce qui entraîne un minimum d’activité et de parole. Le sujet passe la plus grande partie de la journée assis à ne rien faire, ou couché.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Le patient est presque complètement immobile et ne répond pas aux stimuli externes.", score: 7 }
    ]
  },
  {
    id: 'g8', text: 'G8. MANQUE DE COOPÉRATION',
    help: 'Refus de se conformer à la volonté des autres tel l’enquêteur, le personnel hospitalier ou la famille, ce qui peut être associé à de la méfiance, des attitudes défensives, un entêtement, un négativisme, un rejet de l’autorité, une hostilité ou des attitudes belliqueuses. Eléments de cotation : comportement interpersonnel observé durant le déroulement de l’entretien ainsi qu’éléments relatés par l’équipe soignante ou la famille.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - ABSENT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie douteuse, sujet pouvant être dans les limites de la normale.", score: 2 },
      { code: 3, label: "3 - LÉGER – Se conforme avec ressentiment, impatience ou sarcasme. Peut s’opposer de manière non offensive s’il se sent testé par l’enquêteur.", score: 3 },
      { code: 4, label: "4 - MOYEN – Refuse parfois catégoriquement de se conformer aux exigences sociales normales (faire son lit, respecter des horaires…etc.). Peut présenter une attitude hostile, défensive ou négative, mais on parvient habituellement à la convaincre.", score: 4 },
      { code: 5, label: "5 - MODÉRÉMENT-SÉVÈRE – Le patient refuse fréquemment de se soumettre aux exigences de son milieu et peut être considéré par les autres comme un « marginal » ou quelqu’un qui a « de sérieux problèmes de comportement ». Le manque de coopération se traduit par des attitudes défensives ou une irritabilité évidentes à l’égard de l’enquêteur et un éventuel refus de répondre à de nombreuses questions.", score: 5 },
      { code: 6, label: "6 - SÉVÈRE – Le patient refuse totalement de coopérer, se montre négativiste et éventuellement belliqueux. Il refuse de se conformer à la plupart des exigences sociales ou peut refuser de commencer ou de terminer l’entretien.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – La résistance active retentit sévèrement sur à peu près tous les grands domaines de fonctionnement. Le patient peut refuser de participer à quelque activité sociale que ce soit, de s’occuper de son hygiène personnelle, de parler avec sa famille ou le personnel et de participer, même brièvement, à un entretien.", score: 7 }
    ]
  },
  {
    id: 'g9', text: 'G9. CONTENU INHABITUEL DE LA PENSÉE',
    help: 'Pensée caractérisée par des idées étranges, fantastiques ou bizarres, pouvant aller d’idées lointaines ou atypiques à des idées fausses, illogiques ou de toute évidence absurdes. Eléments de cotation : contenu de la pensée exprimé durant le déroulement de l’entretien.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - ABSENT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie douteuse, sujet pouvant être dans les limites de la normale.", score: 2 },
      { code: 3, label: "3 - LÉGER – Le contenu de la pensée est assez particulier ou idiosyncratique ou bien des idées familières sont formulées dans un contexte étrange.", score: 3 },
      { code: 4, label: "4 - MOYEN – Les idées sont fréquemment faussées et paraissent parfois plutôt bizarres.", score: 4 },
      { code: 5, label: "5 - MODÉRÉMENT SÉVÈRE – Le patient exprime de nombreuses pensées étranges et fantastiques (par exemple être le fils adoptif d’un roi ou avoir échappé à une condamnation à mort) ou certaines idées de toute évidence absurdes (par exemple avoir des centaines d’enfants ou recevoir des messages radio du cosmos captés par une dent plombée).", score: 5 },
      { code: 6, label: "6 - SÉVÈRE – Le patient exprime de nombreuses idées illogiques ou absurdes ou bien certaines idées de nature particulièrement bizarre (par exemple avoir trois têtes ou venir d’une autre planète).", score: 6 },
      { code: 7, label: "7 - EXTRÊME – La pensée est pleine d’idées absurdes, bizarres et grotesques.", score: 7 }
    ]
  },
  {
    id: 'g10', text: 'G10. DÉSORIENTATION',
    help: 'Manque de conscience de ses propres relations avec le milieu, ce qui inclut les personnes, les lieux et le temps et peut être dû à une confusion ou à un repli. Eléments de cotation : réponses aux questions de l’entretien concernant l’orientation.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - ABSENT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie douteuse, sujet pouvant être dans les limites de la normale.", score: 2 },
      { code: 3, label: "3 - LÉGER – L’orientation générale est bonne, mais il existe certaines difficultés pour des points spécifiques. Par exemple, le patient sait où il est mais ne connaît pas son adresse, connaît les noms des membres de l’équipe hospitalière mais non leurs fonctions, connaît le mois mais confond le jour de la semaine avec le jour précédent ou suivant, ou bien se trompe de plus de deux jours. Il peut exister une limitation des intérêts mise en évidence par une familiarité avec le milieu proche mais non l’environnement plus large (capacité d’identifier l’équipe hospitalière mais non le maire, les ministres ou le président par exemple).", score: 3 },
      { code: 4, label: "4 - MOYEN – Le patient ne réussit pas toujours à reconnaître les personnes ou les lieux et n’a que des repères temporels partiels. Il sait, par exemple, qu’il est dans un hôpital mais n’en connaît pas le nom, connaît le nom de la ville mais pas celui du département ou de la région, connaît le nom de son principal thérapeute, mais non ceux de nombreux autres membres du personnel qui s’occupent de lui, connaît l’année et la saison mais n’est pas certain du mois.", score: 4 },
      { code: 5, label: "5 - MODÉRÉMENT SÉVÈRE – Reconnaît très mal les personnes ou les lieux et se situe très mal dans le temps. N’a qu’une vague notion de l’endroit où il se trouve et la plupart des gens de son environnement ne lui semblent pas familiers. Il peut identifier l’année correctement ou presque, mais ne pas connaître le mois, le jour de la semaine ou même la saison.", score: 5 },
      { code: 6, label: "6 - SÉVÈRE – Ne reconnaît pas les personnes ou les lieux et n’a pas la notion du temps. Par exemple, n’a aucune idée de l’endroit où il se trouve, se trompe de plus d’un an sur la date, ne peut nommer qu’une ou deux personnes de son entourage.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Le patient semble complètement désorienté par rapport aux personnes, aux lieux et au temps. Il présente une très grande confusion ou une ignorance absolue de l’endroit où il se trouve, de l’année en cours et même des personnes les plus familières comme les parents, le conjoint, les amis et le principal thérapeute.", score: 7 }
    ]
  },
  {
    id: 'g11', text: 'G11. MANQUE D\'ATTENTION',
    help: 'Echec de la vigilance focalisée, comme en témoignent des difficultés de concentration, une distractibilité par les stimuli internes et externes et des difficultés à se fixer sur un stimulus ou à se focaliser sur un autre. Eléments de cotation : manifestations durant la conduite de l’entretien.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - ABSENT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie douteuse, sujet pouvant être dans les limites de la normale.", score: 2 },
      { code: 3, label: "3 - LÉGER – Concentration limitée mise en évidence par une facilité de distraction occasionnelle ou une diminution de l’attention vers la fin de l’entretien.", score: 3 },
      { code: 4, label: "4 - MOYEN – La conversation est perturbée par une tendance à la distraction, une difficulté de concentration prolongée sur un thème donné ou des problèmes pour changer de sujet.", score: 4 },
      { code: 5, label: "5 - MODÉRÉMENT-SÉVÈRE – La conversation est sévèrementment perturbée par une mauvaise concentration, u ne distractibilité et des difficultés à changer de sujet de manière appropriée.", score: 5 },
      { code: 6, label: "6 - SÉVÈRE – L’attention ne peut être retenue que durant de brefs instants ou au prix de grands efforts car le patient se laisse constamment distraire par les stimuli internes ou externes.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – L’attention est si désorganisée qu’une conversation, même brève, est impossible.", score: 7 }
    ]
  },
  {
    id: 'g12', text: 'G12. MANQUE DE JUGEMENT ET DE PRISE DE CONSCIENCE',
    help: 'Altération de la conscience ou de la compréhension de ses propres troubles psychiatriques ou de sa situation de vie. Cela est mis en évidence par un refus de la maladie ou des symptômes psychiatriques anciens ou actuels, un déni du besoin d’hospitalisation ou de traitement psychiatrique, des décisions caractérisées par une mauvaise anticipation des conséquences et des objectifs à court ou long terme irréalistes. Eléments de cotation : contenu de la pensée exprimé durant l’entretien.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - ABSENT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie douteuse, sujet pouvant être dans les limites de la normale.", score: 2 },
      { code: 3, label: "3 - LÉGER – Reconnaît avoir un trouble psychiatrique, mais en sous-estime manifestement la gravité et les conséquences thérapeutiques ou mésestime l’importance des mesures visant à éviter la rechute. Des projets futurs peuvent être mal conçus.", score: 3 },
      { code: 4, label: "4 - MOYEN – Le patient n’admet sa maladie que de manière vague et superficielle. Il peut exister des fluctuations dans l’acceptation de la maladie, peu de conscience des symptômes majeurs qui se présentent tels les idées délirantes, la désorganisation de la pensée, la méfiance et le repli social. Le patient peut rationaliser le besoin de traitement afin d’améliorer les symptômes moins importants, tels l’anxiété, la tension et les troubles du sommeil.", score: 4 },
      { code: 5, label: "5 - MODÉRÉMENT SÉVÈRE – Accepte une maladie psychiatrique ancienne mais non actuelle. S’il est poussé dans ses retranchements, le patient peut admettre la présence de certains symptômes secondaires ou insignifiants qu’il minimise en leur donnant une explication grossièrement erronée ou délirante. De même, le besoin de traitement psychiatrique n’est pas reconnu.", score: 5 },
      { code: 6, label: "6 - SÉVÈRE – Le patient nie avoir eu une maladie psychiatrique. Il conteste la présence de quelques symptômes psychiatriques, anciens ou actuels et, bien que docile, il refuse de reconnaître le besoin de traitement et d’hospitalisation.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Négation énergique d’une maladie psychiatrique ancienne ou actuelle. L’hospitalisation et le traitement en cours sont l’objet d’une interprétation délirante (punition pour méfaits, persécution par des bourreaux, etc.…) et le patient peut ainsi refuser de coopérer avec les thérapeutes, d’accepter les médicaments ou d’autres aspects du traitement.", score: 7 }
    ]
  },
  {
    id: 'g13', text: 'G13. TROUBLES DE LA VOLITION',
    help: 'Perturbation dans la mise en œuvre, la poursuite et le contrôle de ses propres pensées, comportements, mouvements et langage. Eléments de cotation : contenu de la pensée et comportement manifestés au cours de l’entretien.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - ABSENT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie douteuse, sujet pouvant être dans les limites de la normale.", score: 2 },
      { code: 3, label: "3 - LÉGER – Il existe des éléments en faveur d’une certaine indécision dans la conversation et la pensée, qui peut altérer à un degré mineur les processus verbaux et cognitifs.", score: 3 },
      { code: 4, label: "4 - MOYEN – Le patient est souvent ambivalent et montre de réelles difficultés à prendre des décisions. La conversation peut être troublée par des alternances de pensées et le fonctionnement verbal et cognitif en est nettement perturbé.", score: 4 },
      { code: 5, label: "5 - MODÉRÉMENT SÉVÈRE – Les troubles de la volition entravent la pensée ainsi que le comportement. Le patient manifeste une indécision avérée qui perturbe l’initiation et la poursuite des activités motrices et sociales et qui peut également être mise en évidence par des interruptions du discours.", score: 5 },
      { code: 6, label: "6 - SÉVÈRE – Les troubles de la volition entravent l’exécution des fonctions motrices automatiques simples, comme l’habillage et la toilette et perturbent de façon marquée le langage.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – L’absence presque complète de volition se manifeste par une inhibition majeure du mouvement et du langage qui entraîne une immobilité et/ou un mutisme.", score: 7 }
    ]
  },
  {
    id: 'g14', text: 'G14. MAUVAIS CONTRÔLE PULSIONNEL',
    help: 'Régulation et contrôle défectueux des impulsions internes, entraînant des décharges tensionnelles et émotionnelles subites, non modulées, arbitraires ou mal dirigées et sans souci de conséquences. Eléments de cotation : comportement durant la conduite de l’entretien et rapporté par l’équipe soignante et la famille.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - ABSENT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie douteuse, sujet pouvant être dans les limites de la normale.", score: 2 },
      { code: 3, label: "3 - LÉGER – Le patient a tendance à se mettre facilement en colère et à être frustré quand il est confronté à des stress ou à un refus de gratification, mais il agit rarement de manière impulsive.", score: 3 },
      { code: 4, label: "4 - MOYEN – Le patient se met en colère et profère des injures mais reste peu provocant. Occasionnellement il peut être menaçant, destructeur, ou présenter un ou deux épisodes de confrontation physique ou de bagarre mineure.", score: 4 },
      { code: 5, label: "5 - MODÉRÉMENT SÉVÈRE – Le patient manifeste des épisodes impulsifs répétés incluant des injures verbales, la destruction des biens ou des menaces physiques. Il peut exister un ou deux épisodes d’agression grave pour lesquels le patient doit être isolé, contenu physiquement ou recevoir un traitement sédatif.", score: 5 },
      { code: 6, label: "6 - SÉVÈRE – Le patient est fréquemment, et de manière impulsive, agressif, menaçant, revendicatif et destructeur, sans aucune considération apparente des conséquences. Il présente un comportement agressif et peut également se livrer à des agressions sexuelles et éventuellement répondre par son comportement à des injonctions hallucinatoires.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Le patient se livre à des attaques homicides, des violences sexuelles, des accès de brutalité répétés ou des comportements autodestructeurs. Son état nécessite une surveillance directe constante ou des mesures de contrainte physique du fait de son incapacité à contrôler de dangereuses impulsions.", score: 7 }
    ]
  },
  {
    id: 'g15', text: 'G15. PRÉOCCUPATION EXCESSIVE DE SOI - TENDANCE AUTISTIQUE',
    help: 'Le patient est absorbé par ses propres pensées et sentiments et par des expériences autistiques au détriment de l’orientation par rapport à la réalité et du comportement adaptatif. Éléments de cotation : comportement interpersonnel observé durant le déroulement de l’entretien.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - ABSENT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie douteuse, sujet pouvant être dans les limites de la normale.", score: 2 },
      { code: 3, label: "3 - LÉGER – Implication excessive par rapport aux besoins ou problèmes personnels, tels que la conversation dévie sur des thèmes égocentriques et qu’il n’existe qu’une préoccupation limitée d’autrui.", score: 3 },
      { code: 4, label: "4 - MOYEN – De manière occasionnelle, le patient semble absorbé comme s’il rêvait tout éveillé ou s’il était impliqué dans des expériences internes, ce qui perturbe à un degré mineur la conversation.", score: 4 },
      { code: 5, label: "5 - MODÉRÉMENT SÉVÈRE – Le patient semble souvent engagé dans des expériences autistiques, comme en témoignent des comportements qui font intrusion dans les fonctions sociales et de communication (a le regard vide, marmonne, se parle à lui-même, ou s’adonne à des activités motrices stéréotypées).", score: 5 },
      { code: 6, label: "6 - SÉVÈRE – Implication marquée dans des expériences autistiques qui limitent sévèrement la concentration, la capacité à dialoguer et l’orientation vis-à-vis de l’environnement. Le patient est souvent en train de sourire, de rite, de marmonner, de parler ou de crier tout seul.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Le patient est absorbé dans des expériences autistiques qui affectent profondément tous les domaines majeurs du comportement. Il peut répondre de façon verbale et comportementale à des hallucinations incessantes et ne se préoccuper ni des autres ni du milieu extérieur.", score: 7 }
    ]
  },
  {
    id: 'g16', text: 'G16. ÉVITEMENT SOCIAL ACTIF',
    help: 'Implication sociale diminuée associée à une peur, une hostilité, une méfiance injustifiées. Éléments de cotation : fonctionnement social rapporté par l’équipe soignante et la famille.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: "1 - ABSENT – Définition non applicable.", score: 1 },
      { code: 2, label: "2 - MINIME – Pathologie douteuse, sujet pouvant être dans les limites de la normale.", score: 2 },
      { code: 3, label: "3 - LÉGER – Le patient semble mal à l’aise en présence des autres et préfère passer son temps tout seul mais, au besoin, il participe aux fonctions sociales.", score: 3 },
      { code: 4, label: "4 - MOYEN – Le patient participe à contrecoeur à toutes ou presque toutes les activités sociales mais il peut avoir besoin d’y être encourage ou il peut y couper court prématurément par anxiété, méfiance ou hostilité.", score: 4 },
      { code: 5, label: "5 - MODÉRÉMENT SÉVÈRE – Avec peur ou colère, le patient reste à l’écart de nombreuses relations sociales en dépit des efforts des autres. Il a tendance à passer seul son temps libre.", score: 5 },
      { code: 6, label: "6 - SÉVÈRE – Le patient participe à très peu d’activités sociales par peur, hostilité ou méfiance. Lorsqu’on s’approche de lui, le patient manifeste une forte tendance à interrompre les relations et tend généralement à s’isoler.", score: 6 },
      { code: 7, label: "7 - EXTRÊME – Le patient ne peut s’engager dans les activités sociales du fait de craintes marquées, d’hostilité ou d’idées délirantes de persécution. Autant que possible, il évite toute relation et reste isolé.", score: 7 }
    ]
  },
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

export const PANSS_DEFINITION: QuestionnaireDefinition = {
  id: 'panss',
  code: 'PANSS',
  title: 'PANSS - Echelle des syndromes positifs et negatifs',
  description: 'Echelle d\'evaluation de la severite des symptomes de la schizophrenie a 30 items. Auteurs originaux: Kay SR, Fiszbein A, Opler LA (1986). Traduction francaise: Lepine JP (1989).',
  questions: PANSS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'French Version (Lepine, 1989)',
    language: 'fr-FR'
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

export function computePanssScores(response: Partial<SchizophreniaPanssResponse>): {
  positive_score: number;
  negative_score: number;
  general_score: number;
  total_score: number;
} {
  const positive = [response.p1, response.p2, response.p3, response.p4, response.p5, response.p6, response.p7]
    .filter((v): v is number => v !== null && v !== undefined)
    .reduce((sum, v) => sum + v, 0);
  
  const negative = [response.n1, response.n2, response.n3, response.n4, response.n5, response.n6, response.n7]
    .filter((v): v is number => v !== null && v !== undefined)
    .reduce((sum, v) => sum + v, 0);
  
  const general = [
    response.g1, response.g2, response.g3, response.g4, response.g5, response.g6,
    response.g7, response.g8, response.g9, response.g10, response.g11, response.g12,
    response.g13, response.g14, response.g15, response.g16
  ].filter((v): v is number => v !== null && v !== undefined)
    .reduce((sum, v) => sum + v, 0);
  
  return {
    positive_score: positive,
    negative_score: negative,
    general_score: general,
    total_score: positive + negative + general
  };
}

export function interpretPanssTotal(total: number): string {
  if (total <= 58) return 'Mildly ill';
  if (total <= 75) return 'Moderately ill';
  if (total <= 95) return 'Markedly ill';
  if (total <= 116) return 'Severely ill';
  return 'Extremely ill';
}
