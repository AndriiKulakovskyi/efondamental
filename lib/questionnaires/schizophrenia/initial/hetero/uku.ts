// eFondaMental Platform - UKU (Udvalg for Kliniske Undersøgelser)
// EFFETS INDESIRABLES DU TRAITEMENT (UKU)
// Clinician-rated scale for assessing side effects of treatment in schizophrenia

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaUkuResponse {
    id: string;
    visit_id: string;
    patient_id: string;
    test_done?: number | boolean | null;
    // Section 1 - Symptômes psychiques (items 1.1, 1.2, 1.3, 1.9)
    q1_1?: number | null;
    q1_2?: number | null;
    q1_3?: number | null;
    q1_9?: number | null;
    // Section 3 - Symptômes autonomes (items 3.3-3.11)
    q3_3?: number | null;
    q3_4?: number | null;
    q3_5?: number | null;
    q3_6?: number | null;
    q3_7?: number | null;
    q3_8?: number | null;
    q3_9?: number | null;
    q3_10?: number | null;
    q3_11?: number | null;
    // Section 4 - Autres effets (items 4.3, 4.5, 4.8-4.15, 4.17)
    q4_3?: number | null;
    q4_5?: number | null;
    q4_8?: number | null;
    q4_9?: number | null;
    q4_10?: number | null;
    q4_12?: number | null;
    q4_13?: number | null;
    q4_14?: number | null;
    q4_14_type?: string | null; // a) prématurée or b) retardée
    q4_15?: number | null;
    q4_17?: number | null;
    q4_17_type?: string | null; // a) tension, b) migraine, c) autres
    // Scores
    psychic_subscore?: number | null;
    autonomic_subscore?: number | null;
    other_subscore?: number | null;
    total_score?: number | null;
    completed_by?: string | null;
    completed_at?: string | null;
    created_at?: string;
    updated_at?: string;
}

export type SchizophreniaUkuResponseInsert = Omit<
    SchizophreniaUkuResponse,
    'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Questions
// ============================================================================

const SHOW_WHEN_TEST_DONE = { '==': [{ 'var': 'test_done' }, 1] };

export const UKU_QUESTIONS: Question[] = [
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
    // SECTION 1 - SYMPTOMES PSYCHIQUES
    // ============================================================================
    {
        id: 'section_psychic',
        text: 'SYMPTÔMES PSYCHIQUES',
        type: 'section',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE
    },
    {
        id: 'q1_1',
        text: '1.1 - Asthénie, lassitude et augmentation de la fatigue',
        help: "Le patient ressent de la lassitude et un manque d'endurance. Les évaluations se basent sur les affirmations du patient.",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Lassitude nulle ou douteuse', score: 0 },
            { code: 1, label: "1 - Le patient se fatigue plus facilement que d'habitude mais ne doit pas se reposer plus que d'habitude au cours de la journée", score: 1 },
            { code: 2, label: '2 - Le patient doit se reposer de temps en temps au cours de la journée à cause de sa lassitude', score: 2 },
            { code: 3, label: '3 - Il doit se reposer pendant la plus grande partie de la journée à cause de sa lassitude', score: 3 }
        ]
    },
    {
        id: 'q1_2',
        text: '1.2 - Somnolence, sédation',
        help: "Diminution de la capacité de demeurer éveillé au cours de la journée. L'évaluation s'appuie sur les signes cliniques relevés au cours de l'entretien.",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Somnolence absente ou douteuse', score: 0 },
            { code: 1, label: "1 - Légèrement somnolent/assoupi en ce qui concerne l'expression du visage et l'élocution", score: 1 },
            { code: 2, label: '2 - Somnolent/assoupi de façon plus marquée. Le patient baille et tend à s\'assoupir lorsque la conversation marque une pause', score: 2 },
            { code: 3, label: '3 - Difficultés à maintenir le patient éveillé ou à le réveiller', score: 3 }
        ]
    },
    {
        id: 'q1_3',
        text: '1.3 - Tension, agitation interne',
        help: "Impossibilité de se détendre, impatience nerveuse. Cet item doit être évalué en fonction des antécédents du patient et doit être distingué de l'akathisie (item 2.6).",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Tension/impatience nerveuse absente ou douteuse', score: 0 },
            { code: 1, label: "1 - Le patient indique qu'il est légèrement tendu et impatient mais sans être gêné", score: 1 },
            { code: 2, label: '2 - Tension intérieure considérable sans qu\'elle soit suffisamment intense ou constante pour influencer de façon marquée la vie quotidienne du patient', score: 2 },
            { code: 3, label: '3 - Le patient ressent une tension ou une impatience tellement importante que sa vie de tous les jours s\'en ressent nettement', score: 3 }
        ]
    },
    {
        id: 'q1_9',
        text: '1.9 - Indifférence émotionnelle',
        help: "Appauvrissement de l'empathie du patient, amenant à une attitude apathique à l'égard de ses proches.",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Indifférence émotionnelle nulle ou douteuse', score: 0 },
            { code: 1, label: "1 - Léger appauvrissement de l'empathie du patient", score: 1 },
            { code: 2, label: '2 - Indifférence émotionnelle plus marquée', score: 2 },
            { code: 3, label: '3 - Indifférence prononcée au point que le patient réagisse de façon indifférente par rapport à son entourage', score: 3 }
        ]
    },

    // ============================================================================
    // SECTION 3 - SYMPTOMES AUTONOMES
    // ============================================================================
    {
        id: 'section_autonomic',
        text: 'SYMPTÔMES AUTONOMES',
        type: 'section',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE
    },
    {
        id: 'q3_3',
        text: '3.3 - Hyposialorrhée (bouche sèche)',
        help: "Sécheresse buccale par manque de salive. Elle peut amener le malade à boire davantage mais doit être distinguée de la soif.",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Sécheresse buccale absente ou douteuse', score: 0 },
            { code: 1, label: '1 - Légère sécheresse buccale mais non gênante', score: 1 },
            { code: 2, label: '2 - Sécheresse gênante qui ne perturbe cependant pas la vie quotidienne du malade', score: 2 },
            { code: 3, label: '3 - Sécheresse très prononcée qui perturbe la vie quotidienne du malade', score: 3 }
        ]
    },
    {
        id: 'q3_4',
        text: '3.4 - Nausées, vomissements',
        help: 'Doivent être évalués à partir des dernières 72 heures.',
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Nausée absente ou douteuse', score: 0 },
            { code: 1, label: '1 - Nausée légère, non gênante', score: 1 },
            { code: 2, label: '2 - Nausée gênante, mais sans vomissements', score: 2 },
            { code: 3, label: '3 - Nausée avec vomissements', score: 3 }
        ]
    },
    {
        id: 'q3_5',
        text: '3.5 - Diarrhée',
        help: "Augmentation de la fréquence des défécations et/ou consistance plus fluide des selles.",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Diarrhée absente ou douteuse', score: 0 },
            { code: 1, label: '1 - Diarrhée nette mais non gênante, ne perturbe ni le travail ni les autres occupations', score: 1 },
            { code: 2, label: '2 - Diarrhée gênante, le patient doit aller plusieurs fois par jour à la selle et les défécations sont pénibles', score: 2 },
            { code: 3, label: '3 - Besoin marqué et impérieux de défécation, incontinence menaçante ou réelle, provoque de fréquentes interruptions du travail', score: 3 }
        ]
    },
    {
        id: 'q3_6',
        text: '3.6 - Constipation',
        help: "Diminution de la fréquence de défécation et/ou consistance des selles.",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Constipation absente ou douteuse', score: 0 },
            { code: 1, label: '1 - Constipation légère, supportable', score: 1 },
            { code: 2, label: '2 - Constipation plus marquée qui gêne le patient', score: 2 },
            { code: 3, label: '3 - Constipation très importante', score: 3 }
        ]
    },
    {
        id: 'q3_7',
        text: '3.7 - Troubles de la miction',
        help: "Impressions de difficulté de commencer à uriner ou résistance à la miction, miction plus faible et/ou de durée plus longue. Sont évaluées par rapport aux 72 dernières heures.",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Troubles de la miction absents ou douteux', score: 0 },
            { code: 1, label: '1 - Nettement présents, mais supportables', score: 1 },
            { code: 2, label: '2 - Gênants à cause de la faiblesse de la miction et de sa durée nettement prolongée, sensation de vidange incomplète de la vessie', score: 2 },
            { code: 3, label: '3 - Rétention urinaire avec volume important d\'urines résiduelles et/ou rétention aigüe menaçante ou réelle', score: 3 }
        ]
    },
    {
        id: 'q3_8',
        text: '3.8 - Polyurie/Polydipsie',
        help: "Augmentation de la production d'urines provenant d'une fréquence accrue de la miction et de l'émission d'une quantité abondante d'urine à chaque miction. Ce phénomène est secondairement favorisé par une consommation accrue de liquides.",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Augmentation nulle ou douteuse', score: 0 },
            { code: 1, label: '1 - Nettement présente mais non gênante, le patient urine au maximum une fois par nuit (jeunes patients)', score: 1 },
            { code: 2, label: '2 - Légèrement gênante par suite d\'une soif fréquente. Le patient urine deux à trois fois par nuit ou plus d\'une fois toutes les deux heures', score: 2 },
            { code: 3, label: '3 - Très gênante, soif pratiquement constante, le patient urine au moins quatre fois par nuit ou plus souvent qu\'une fois par heure', score: 3 }
        ]
    },
    {
        id: 'q3_9',
        text: '3.9 - Vertiges orthostatiques',
        help: "Sensation de faiblesse, tout va mal, tintement dans les oreilles, tendance accrue à l'évanouissement lorsque le patient couché ou assis se lève.",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Vertiges absents ou douteux', score: 0 },
            { code: 1, label: '1 - Présence nette mais supportable, ne nécessite pas de prendre des mesures précises', score: 1 },
            { code: 2, label: '2 - Gênant mais le symptôme peut être neutralisé en se levant lentement et/ou par étapes successives', score: 2 },
            { code: 3, label: '3 - Episodes menaçants ou réels évanouissements malgré les précautions prises au cours du changement de position', score: 3 }
        ]
    },
    {
        id: 'q3_10',
        text: '3.10 - Palpitations/Tachycardie',
        help: "Palpitations, sensation de pulsations cardiaques rapides, marquées et/ou irrégulières dans la poitrine.",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Symptôme absent ou douteux', score: 0 },
            { code: 1, label: '1 - Nettement présent sans être gênant, crises occasionnelles de courte durée ou plus constantes sans palpitations marquées', score: 1 },
            { code: 2, label: '2 - Palpitations gênantes fréquentes ou constantes qui inquiètent le patient ou troublent son sommeil nocturne, sans symptômes concomitants', score: 2 },
            { code: 3, label: "3 - On craint une véritable tachycardie, par exemple parce que le patient éprouve en même temps une sensation de faiblesse et ressent le besoin de s'étendre, dyspnée, tendance à l'évanouissement ou précordialgie", score: 3 }
        ]
    },
    {
        id: 'q3_11',
        text: "3.11 - Augmentation de la tendance à l'hyperhidrose",
        help: "Concerne l'ensemble du corps et n'est pas localisée aux paumes de la main ou à la plante du pied.",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Absente ou douteuse', score: 0 },
            { code: 1, label: '1 - Nettement présente mais supportable', score: 1 },
            { code: 2, label: '2 - Gênante, entraîne de fréquents changements de vêtements, sueur profuse après des efforts physiques modérés', score: 2 },
            { code: 3, label: '3 - Crises profuses de transpiration après des efforts physiques légers ou au repos, le patient est constamment mouillé', score: 3 }
        ]
    },

    // ============================================================================
    // SECTION 4 - AUTRES EFFETS INDESIRABLES
    // ============================================================================
    {
        id: 'section_other',
        text: 'AUTRES EFFETS INDÉSIRABLES',
        type: 'section',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE
    },
    {
        id: 'q4_3',
        text: '4.3 - Photosensibilité',
        help: 'Augmentation de la sensibilité aux rayons solaires.',
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Absente ou douteuse', score: 0 },
            { code: 1, label: '1 - Légère sans être gênante', score: 1 },
            { code: 2, label: '2 - Plus prononcée et gênante pour le patient', score: 2 },
            { code: 3, label: "3 - Tellement prononcée qu'on envisage d'arrêter l'administration du produit", score: 3 }
        ]
    },
    {
        id: 'q4_5',
        text: '4.5 - Augmentation du poids',
        help: "L'évaluation se fait sur la base du mois précédent.",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Augmentation de poids nulle ou douteuse au cours du mois précédent', score: 0 },
            { code: 1, label: '1 - Augmentation de poids de 1 à 2 kg au cours du mois précédent', score: 1 },
            { code: 2, label: '2 - Augmentation de poids de 3 à 4 kg au cours du mois précédent', score: 2 },
            { code: 3, label: '3 - Augmentation de poids de plus de 4 kg au cours du mois précédent', score: 3 }
        ]
    },
    {
        id: 'q4_8',
        text: '4.8 - Troubles de la menstruation, aménorrhée',
        help: "Aussi bien hyperménorrhée et oligoménorrhée qu'aménorrhée au cours des trois derniers mois.",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Diminution nulle ou douteuse de la fréquence et de l\'intensité du flux menstruel', score: 0 },
            { code: 1, label: "1 - Hypoménorrhée, c'est-à-dire hémorragie utérine de moindre quantité que d'habitude mais les cycles sont normaux", score: 1 },
            { code: 2, label: "2 - Oligoménorrhée, c'est-à-dire cycles plus longs que d'habitude, l'intensité peut parfois être moindre que d'habitude", score: 2 },
            { code: 3, label: "3 - Aménorrhée, c'est-à-dire absence de menstruation depuis plus de trois mois", score: 3 }
        ]
    },
    {
        id: 'q4_9',
        text: '4.9 - Galactorrhée',
        help: "Augmentation de la sécrétion de lait en dehors des périodes d'allaitement.",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Absence de galactorrhée', score: 0 },
            { code: 1, label: "1 - Présence d'une galactorrhée très faible et non gênante", score: 1 },
            { code: 2, label: "2 - Présence d'une galactorrhée modérée ressentie comme gênante", score: 2 },
            { code: 3, label: "3 - Présence d'une galactorrhée très prononcée et très gênante", score: 3 }
        ]
    },
    {
        id: 'q4_10',
        text: '4.10 - Gynécomastie',
        help: "Développement excessif des glandes mammaires de l'homme.",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Absence de gynécomastie', score: 0 },
            { code: 1, label: "1 - Présence de gynécomastie peu importante par rapport à l'état habituel, sans être gênante", score: 1 },
            { code: 2, label: "2 - Présence nette de gynécomastie qui n'est gênante que lorsque le patient est déshabillé", score: 2 },
            { code: 3, label: "3 - Gynécomastie grave au point de gêner le patient du point de vue de son aspect car elle peut être observée même lorsqu'il est habillé", score: 3 }
        ]
    },
    {
        id: 'q4_12',
        text: '4.12 - Diminution de la libido',
        help: 'Diminution du désir de relations sexuelles.',
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Absente ou douteuse', score: 0 },
            { code: 1, label: '1 - Le désir de relations sexuelles est légèrement diminué mais ne gêne pas le patient', score: 1 },
            { code: 2, label: "2 - La nette diminution du désir et de l'intérêt des relations sexuelles est telle qu'elle gêne le patient", score: 2 },
            { code: 3, label: "3 - Le désir et l'intérêt diminuent à un point tel que les rapports sexuels deviennent extrêmement rares ou cessent", score: 3 }
        ]
    },
    {
        id: 'q4_13',
        text: "4.13 - Troubles de l'érection",
        help: "Difficultés pour le patient d'obtenir ou de maintenir une érection.",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 0, label: '0 - Absent ou douteux', score: 0 },
            { code: 1, label: "1 - Diminution légère de la possibilité d'obtenir ou de maintenir une érection sans que cela gêne le patient", score: 1 },
            { code: 2, label: "2 - Modification réelle dans la possibilité d'obtenir ou de maintenir une érection qui est gênante", score: 2 },
            { code: 3, label: '3 - Le patient obtient ou maintient rarement (ou jamais) une érection', score: 3 }
        ]
    },
    {
        id: 'q4_14_type',
        text: "4.14 - Troubles de l'éjaculation (Type)",
        type: 'single_choice',
        required: false,
        display_if: { 'and': [SHOW_WHEN_TEST_DONE, { 'in': [{ 'var': 'patient_gender' }, ['Homme', 'm']] }] },
        options: [
            { code: 'a', label: 'a) Prématurée', score: 0 },
            { code: 'b', label: 'b) Retardée', score: 0 }
        ]
    },
    {
        id: 'q4_14',
        text: "Intensité des troubles de l'éjaculation",
        help: "Dans l’échelle il y a lieu d’indiquer qu’il s’agit de a) ou de b). Les deux possibilités concernent la possibilité pour le patient de contrôler l’éjaculation ; elles sont évaluées selon les directives suivantes :",
        type: 'single_choice',
        required: false,
        display_if: {
            'and': [
                SHOW_WHEN_TEST_DONE,
                { 'in': [{ 'var': 'patient_gender' }, ['Homme', 'm']] },
                { 'in': [{ 'var': 'q4_14_type' }, ['a', 'b']] }
            ]
        },
        options: [
            { code: 0, label: "0 - Modification absente ou douteuse de la possibilité de contrôler l'éjaculation", score: 0 },
            { code: 1, label: "1 - Le patient éprouve plus de difficultés que d'habitude à contrôler l'éjaculation mais il n'en est pas gêné", score: 1 },
            { code: 2, label: "2 - Le contrôle de l'éjaculation devient un problème pour le patient", score: 2 },
            { code: 3, label: "3 - Le contrôle de l'éjaculation est influencé au point de devenir un problème prédominant lors des rapports sexuels et influence donc fortement la sensation d'orgasme", score: 3 }
        ]
    },
    {
        id: 'q4_15',
        text: "4.15 - Troubles de l'orgasme",
        help: "Troubles dans l'obtention et la sensation d'orgasme.",
        type: 'single_choice',
        required: false,
        display_if: { 'and': [SHOW_WHEN_TEST_DONE, { 'in': [{ 'var': 'patient_gender' }, ['Femme', 'f']] }] },
        options: [
            { code: 0, label: '0 - Absent ou douteux', score: 0 },
            { code: 1, label: "1 - Il est plus difficile que d'habitude pour le patient d'atteindre l'orgasme et/ou sa sensation d'orgasme est légèrement influencée, sans qu'il en subisse une gêne", score: 1 },
            { code: 2, label: "2 - Le patient indique qu'il existe une réelle modification dans la possibilité d'atteindre l'orgasme et/ou de le ressentir. Cette modification est d'un degré tel qu'elle gêne le patient", score: 2 },
            { code: 3, label: "3 - Le patient atteint rarement ou jamais l'orgasme et sa sensation d'orgasme est fortement diminuée", score: 3 }
        ]
    },
    {
        id: 'q4_17_type',
        text: '4.17 - Maux de tête (Type)',
        help: "Les maux de tête sont répartis en différentes formes : a) maux de tête liés à une tension nerveuse excessive, b) migraine, c) autres formes de maux de tête.",
        type: 'single_choice',
        required: false,
        display_if: SHOW_WHEN_TEST_DONE,
        options: [
            { code: 'a', label: 'a) Maux de tête liés à une tension nerveuse excessive', score: 0 },
            { code: 'b', label: 'b) Migraine', score: 0 },
            { code: 'c', label: 'c) Autres formes de maux de tête', score: 0 }
        ]
    },
    {
        id: 'q4_17',
        text: 'Intensité des maux de tête',
        type: 'single_choice',
        required: false,
        display_if: { 'and': [SHOW_WHEN_TEST_DONE, { '==': [{ 'var': 'q4_17_type' }, 'c'] }] },
        options: [
            { code: 0, label: '0 - Mal de tête absent ou douteux', score: 0 },
            { code: 1, label: '1 - Léger mal de tête, sans être particulièrement gênant', score: 1 },
            { code: 2, label: '2 - Mal de tête très gênant qui n\'influence pas la vie de tous les jours du patient', score: 2 },
            { code: 3, label: '3 - Mal de tête prononcé qui influence la vie de tous les jours du patient', score: 3 }
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

export const UKU_DEFINITION: QuestionnaireDefinition = {
    id: 'uku',
    code: 'UKU',
    title: "UKU - Effets indésirables du traitement",
    description: "EFFETS INDESIRABLES DU TRAITEMENT (UKU). Échelle d'évaluation des effets indésirables du traitement (Udvalg for Kliniske Undersøgelser Side Effect Rating Scale).",
    questions: UKU_QUESTIONS,
    metadata: {
        singleColumn: true,
        pathologies: ['schizophrenia'],
        target_role: 'healthcare_professional',
        language: 'fr-FR'
    }
};

// ============================================================================
// Scoring Functions
// ============================================================================

export function computeUkuScores(response: Partial<SchizophreniaUkuResponse>): {
    psychic_subscore: number | null;
    autonomic_subscore: number | null;
    other_subscore: number | null;
    total_score: number | null;
} {
    // Helper function to sum values, returns null if any value is null/undefined
    const sumIfComplete = (values: (number | null | undefined)[]): number | null => {
        const validValues = values.filter((v): v is number => v !== null && v !== undefined);
        if (validValues.length !== values.length) return null;
        return validValues.reduce((sum, v) => sum + v, 0);
    };

    // Psychic subscore: items 1.1, 1.2, 1.3, 1.9
    const psychic_subscore = sumIfComplete([
        response.q1_1, response.q1_2, response.q1_3, response.q1_9
    ]);

    // Autonomic subscore: items 3.3-3.11
    const autonomic_subscore = sumIfComplete([
        response.q3_3, response.q3_4, response.q3_5, response.q3_6, response.q3_7,
        response.q3_8, response.q3_9, response.q3_10, response.q3_11
    ]);

    // Other effects subscore: items 4.3, 4.5, 4.8-4.10, 4.12-4.15, 4.17
    const other_subscore = sumIfComplete([
        response.q4_3, response.q4_5, response.q4_8, response.q4_9, response.q4_10,
        response.q4_12, response.q4_13, response.q4_14, response.q4_15, response.q4_17
    ]);

    // Total score
    const total_score =
        psychic_subscore !== null &&
            autonomic_subscore !== null &&
            other_subscore !== null
            ? psychic_subscore + autonomic_subscore + other_subscore
            : null;

    return {
        psychic_subscore,
        autonomic_subscore,
        other_subscore,
        total_score
    };
}
