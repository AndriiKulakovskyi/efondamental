// eFondaMental Platform - Questionnaire Alimentaire
// Schizophrenia Initial Evaluation - Autoquestionnaire Module

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaAlimentaireResponse {
    id: string;
    visit_id: string;
    patient_id: string;
    questionnaire_done?: string;

    // Questions générales
    jeune_therapeutique_12m: boolean | null;
    jeune_intermittent_actuel: boolean | null;
    jeune_religieux_12m: boolean | null;

    // Préparation et Connaissances
    temps_preparation_repas_heures: number | null;
    temps_preparation_repas_minutes: number | null;
    temps_preparation_repas_time?: string; // For form input HH:MM
    fait_courses: boolean | null;
    prepare_repas: boolean | null;
    connaissances_nutrition: number | null;
    remboursement_complements: boolean | null;

    // Pourcentages
    pourcentage_bio: number | null;
    pourcentage_cru: number | null;

    // Régimes
    regimes_alimentaires: string[] | null;
    raisons_regime: string[] | null;

    // Fréquences - Glucides rapides
    freq_pain_blanc: number | null;
    freq_pomme_de_terre_riz_blanc: number | null;
    freq_pates_blanches: number | null;
    freq_confiture_nutella: number | null;
    freq_soda_sucre: number | null;
    freq_soda_light: number | null;
    freq_jus_fruits: number | null;
    freq_dessert_sucre: number | null;
    freq_yaourt_fruits: number | null;

    // Fréquences - Protéines
    freq_viande_rouge: number | null;
    freq_viande_blanche: number | null;
    freq_legumineuses: number | null;
    freq_blanc_oeuf: number | null;
    freq_jaune_oeuf: number | null;
    freq_verre_lait: number | null;
    freq_yaourt_nature: number | null;
    freq_fromage: number | null;
    freq_complements_proteines: number | null;

    // Fréquences - Fibres
    freq_salade_endives: number | null;
    freq_legumes_verts: number | null;
    freq_quinoa_boulgour: number | null;
    freq_riz_complet: number | null;
    freq_pates_completes: number | null;
    freq_flocon_avoine: number | null;
    freq_fruit: number | null;
    freq_pain_complet: number | null;

    // Fréquences - Oméga 3
    freq_huile_olive_colza_soja: number | null;
    freq_poisson_gras_cru: number | null;
    freq_autres_poissons_fruits_mer: number | null;
    freq_noix_amandes_noisettes: number | null;
    freq_graines_chia: number | null;
    freq_omega3_gelules: number | null;
    freq_beurre: number | null;

    // Fréquences - Transformés
    freq_junk_food: number | null;
    freq_viande_transformee: number | null;
    freq_plats_pre_cuisines: number | null;
    freq_aliments_frits: number | null;
    freq_graines_aperitives: number | null;
    freq_patisserie_gateaux: number | null;
    freq_chips_biscuits_sales: number | null;
    freq_margarine: number | null;
    freq_conserves_non_cuisines: number | null;
    freq_surgeles_non_cuisines: number | null;

    // Fréquences - En général
    freq_cafe: number | null;
    freq_the: number | null;
    freq_cafe_deca: number | null;
    freq_vin_rouge: number | null;
    freq_vin_blanc_rose: number | null;
    freq_biere: number | null;
    freq_alcool_fort: number | null;

    // Compléments
    nutraceutiques: string[] | null;
    phytoceutiques: string[] | null;

    // Metadata
    completed_by: string | null;
    completed_at: string;
    created_at: string;
    updated_at: string;
}

export type SchizophreniaAlimentaireResponseInsert = Omit<
    SchizophreniaAlimentaireResponse,
    'id' | 'created_at' | 'updated_at' | 'completed_at' | 'temps_preparation_repas_time'
> & {
    completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

const FREQUENCY_OPTIONS = [
    { code: 0, label: "Moins d'1 fois par semaine", score: 0 },
    { code: 1, label: "1 à 2 fois par semaine", score: 1 },
    { code: 2, label: "3 à 4 fois par semaine", score: 2 },
    { code: 3, label: "5 à 6 fois par semaine", score: 3 },
    { code: 4, label: "1 fois par jour", score: 4 },
    { code: 5, label: "2 à 3 fois par jour", score: 5 },
    { code: 6, label: "4 fois par jour et plus", score: 6 }
];

const PERCENTAGE_OPTIONS = [
    { code: 0, label: "0-10 %", score: 0 },
    { code: 1, label: "11-25 %", score: 1 },
    { code: 2, label: "26-50 %", score: 2 },
    { code: 3, label: "51-75 %", score: 3 },
    { code: 4, label: "76-90 %", score: 4 },
    { code: 5, label: "92-100 %", score: 5 }
];

export const ALIMENTAIRE_SZ_QUESTIONS: Question[] = [
    {
        id: 'questionnaire_done',
        text: 'Passation du questionnaire',
        type: 'single_choice',
        required: true,
        options: [
            { code: 'Fait', label: 'Fait', score: 1 },
            { code: 'Non fait', label: 'Non fait', score: 0 }
        ]
    },
    {
        id: 'section_generale',
        text: 'Questions générales',
        type: 'section',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
    },
    {
        id: 'jeune_therapeutique_12m',
        text: '20) Avez-vous suivi un jeûne thérapeutique (moins de 500kCal/j pendant 1 à 3 semaines) au cours des 12 derniers mois ?',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: [
            { code: 1, label: 'Oui', score: 1 },
            { code: 0, label: 'Non', score: 0 }
        ]
    },
    {
        id: 'jeune_intermittent_actuel',
        text: '21) Suivez-vous actuellement un jeûne intermittent (absence de prise alimentaire pendant plus de 12 à 16h par jour ou au moins un jour entier par semaine pendant au moins deux semaines) ?',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: [
            { code: 1, label: 'Oui', score: 1 },
            { code: 0, label: 'Non', score: 0 }
        ]
    },
    {
        id: 'jeune_religieux_12m',
        text: '22) Avez-vous suivi un jeûne religieux (exemple : Ramadan) au cours des 12 derniers mois ?',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: [
            { code: 1, label: 'Oui', score: 1 },
            { code: 0, label: 'Non', score: 0 }
        ]
    },
    {
        id: 'temps_preparation_repas_time',
        text: '23) Combien de temps par repas (déjeuners et diners à la maison, temps moyen) consacrez-vous en moyenne à la préparation du repas ?',
        type: 'text',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        help: 'Format HH:MM',
        metadata: { placeholder: 'HH:MM' }
    },
    {
        id: 'fait_courses',
        text: '24) Faites-vous vos courses vous-même ?',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: [
            { code: 1, label: 'Oui', score: 1 },
            { code: 0, label: 'Non', score: 0 }
        ]
    },
    {
        id: 'prepare_repas',
        text: '25) Préparez-vous vous-même vos repas quand vous êtes chez vous ?',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: [
            { code: 1, label: 'Oui', score: 1 },
            { code: 0, label: 'Non', score: 0 }
        ]
    },
    {
        id: 'connaissances_nutrition',
        text: '26) Estimez-vous avoir de bonnes connaissances en nutrition (par exemple pour repérer les aliments riches en protéines, en sucres rapides, en graisses saturées, en fibres) ?',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: [
            { code: 3, label: 'Oui', score: 3 },
            { code: 2, label: 'Plutôt oui', score: 2 },
            { code: 1, label: 'Plutôt non', score: 1 },
            { code: 0, label: 'Non', score: 0 }
        ]
    },
    {
        id: 'remboursement_complements',
        text: '28) Pensez-vous que les compléments alimentaires qui ont montré une efficacité dans les troubles mentaux devraient être remboursés ?',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: [
            { code: 1, label: 'Oui', score: 1 },
            { code: 0, label: 'Non', score: 0 }
        ]
    },
    {
        id: 'pourcentage_bio',
        text: '29) A combien évaluez-vous le pourcentage de vos aliments qui sont « bio » ?',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: PERCENTAGE_OPTIONS
    },
    {
        id: 'pourcentage_cru',
        text: '30) A combien évaluez-vous le pourcentage de votre alimentation qui est « crue » ?',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: PERCENTAGE_OPTIONS
    },
    {
        id: 'regimes_alimentaires',
        text: '31) Actuellement, suivez-vous l’un de ces régimes alimentaires ? (Plusieurs réponses possibles)',
        type: 'multiple_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: [
            { code: 'Méditerranéen', label: 'Méditerranéen (régime crétois)' },
            { code: 'Hyper-protéiné', label: 'Hyper-protéiné ou riche en protéines' },
            { code: 'Végétarien', label: 'Végétarien' },
            { code: 'Végétalien', label: 'Végétalien/végane' },
            { code: 'Flexitarien', label: 'Flexitarien/flexitarisme' },
            { code: 'Sans caséine', label: 'Sans caséine' },
            { code: 'Sans gluten', label: 'Sans gluten' },
            { code: 'Sans soja', label: 'Sans soja' },
            { code: 'Paléo', label: 'Régime paléo' },
            { code: 'Cétogène', label: 'Régime cétogène ou « lowcarb »' },
            { code: 'FODMAP', label: 'Régime pauvre en FODMAP' },
            { code: 'Weight Watchers', label: 'Weight Watchers®' },
            { code: 'DASH', label: 'Régime DASH' },
            { code: 'Jeûne intermittent', label: 'Jeûne intermittent' },
            { code: 'Dukan', label: 'Régime Dukan' },
            { code: 'Autre', label: 'Autre' },
            { code: 'Aucun', label: 'Je ne suis aucun régime alimentaire' }
        ]
    },
    {
        id: 'raisons_regime',
        text: '32) Pour quelle raison suivez-vous ce mode d’alimentation ? (Plusieurs réponses possibles)',
        type: 'multiple_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: [
            { code: 'Médicale', label: 'Pour une raison médicale sans lien avec un problème de surpoids' },
            { code: 'Maigrir', label: 'Pour maigrir' },
            { code: 'Maintenir poids', label: 'Pour ne pas prendre de poids' },
            { code: 'Santé', label: 'Pour rester en forme/maintenir sa santé' },
            { code: 'Apparence', label: 'Pour maintenir une apparence jeune' },
            { code: 'Morale', label: 'Par conviction morale' },
            { code: 'Environnementale', label: 'Par conviction environnementale/écologique' },
            { code: 'Aucune', label: 'Aucune des raisons ci-dessus' }
        ]
    },
    {
        id: 'section_glucides',
        text: '33) Glucides rapides ou cachés : au cours du dernier mois',
        type: 'section',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
    },
    {
        id: 'freq_pain_blanc',
        text: 'Pain blanc, biscottes céréales (hormis flocon d’avoine)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_pomme_de_terre_riz_blanc',
        text: 'Pomme de terre (au four, à l’eau) ou riz blanc',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_pates_blanches',
        text: 'Pâtes fraiches ou blanches (= non complète et non semi-complète)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_confiture_nutella',
        text: 'Confiture, pâte à tartiner (type Nutella®) (cuillère à café)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_soda_sucre',
        text: 'Soda sucrés (inclure Redbull® et apparentés)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_soda_light',
        text: 'Soda « light » ou « zero »',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_jus_fruits',
        text: 'Jus de fruits (pressé, industriel)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_dessert_sucre',
        text: 'Crème dessert, mousse, dessert sucré, glaces',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_yaourt_fruits',
        text: 'Yaourt aux fruits ou aromatisés ou fromage blanc aux fruits ou aromatisés',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'section_proteines',
        text: '34) Protéines : au cours du dernier mois',
        type: 'section',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
    },
    {
        id: 'freq_viande_rouge',
        text: 'Viande rouge (boeuf, veau, porc, agneau, mouton, cheval, chèvre, canard)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_viande_blanche',
        text: 'Viande blanche non transformée (poulet, dinde, lapin)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_legumineuses',
        text: 'Légumineuses (lentilles, pois chiches, haricots blancs, haricots rouges)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_blanc_oeuf',
        text: 'Blanc d’oeuf',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_jaune_oeuf',
        text: 'Jaune d’oeuf',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_verre_lait',
        text: 'Verre de lait (entier, écrémé ou demi-écrémé)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_yaourt_nature',
        text: 'Yaourt nature (Activia®, Danonino®) ou fromage blanc nature',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_fromage',
        text: 'Fromage (portion)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_complements_proteines',
        text: 'Compléments alimentaires protéinés (poudres, comprimés, barres protéinées)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'section_fibres',
        text: '35) Fibres : au cours du dernier mois',
        type: 'section',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
    },
    {
        id: 'freq_salade_endives',
        text: 'Salade verte ou endives',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_legumes_verts',
        text: 'Légumes verts (haricots verts, brocolis, asperges etc.)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_quinoa_boulgour',
        text: 'Quinoa, boulgour, semoule',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_riz_complet',
        text: 'Riz complet ou semi-complet',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_pates_completes',
        text: 'Pâtes complètes ou semi-complètes',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_flocon_avoine',
        text: 'Flocon d’avoine',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_fruit',
        text: 'Fruit',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_pain_complet',
        text: 'Pain complet',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'section_omega3',
        text: '36) Oméga 3 et graisses saturées : au cours du dernier mois',
        type: 'section',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
    },
    {
        id: 'freq_huile_olive_colza_soja',
        text: 'Cuillère à soupe d’huile d’olive, de colza ou de soja',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_poisson_gras_cru',
        text: 'Poisson gras consommés CRUS (sardines, saumon, maquereau, thon)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_autres_poissons_fruits_mer',
        text: 'Autres poissons et fruits de mer',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_noix_amandes_noisettes',
        text: 'Noix, amandes ou noisettes (poignée d’environ 6 unités)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_graines_chia',
        text: 'Graines de chia',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_omega3_gelules',
        text: 'Omega 3 (en gélules ou sirop)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_beurre',
        text: 'Beurre (incluant la cuisson)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'section_transforme',
        text: '37) Nourriture transformée : au cours du dernier mois',
        type: 'section',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
    },
    {
        id: 'freq_junk_food',
        text: '“Junk-food” (Burger, kebab, quiches etc.)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_viande_transformee',
        text: 'Viande transformée industriellement (jambon, saucisses, etc.)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_plats_pre_cuisines',
        text: 'Plats pré-cuisinés (conserves, barquettes, surgelés)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_aliments_frits',
        text: 'Aliments frits (frites, poisson pané, nuggets)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_graines_aperitives',
        text: 'Graines apéritives grillées (cacahuètes, amandes grillées)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_patisserie_gateaux',
        text: 'Pâtisserie, gâteaux, viennoiseries, biscuits sucrés',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_chips_biscuits_sales',
        text: 'Chips, biscuits salés',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_margarine',
        text: 'Margarine (incluant la cuisson)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_conserves_non_cuisines',
        text: 'Aliments en conserve non cuisinés (ex : maïs, haricots blancs…)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_surgeles_non_cuisines',
        text: 'Aliments surgelés non cuisinés (ex : petit pois, haricots verts…)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'section_general_freq',
        text: '38) En général : au cours du dernier mois',
        type: 'section',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
    },
    {
        id: 'freq_cafe',
        text: 'Café (tasse)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_the',
        text: 'Thé (tasse)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_cafe_deca',
        text: 'Café décaféiné (tasse)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_vin_rouge',
        text: 'Vin rouge (verre)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_vin_blanc_rose',
        text: 'Vin blanc ou rosé (verre)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_biere',
        text: 'Bière (demi ou 25cl)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'freq_alcool_fort',
        text: 'Alcool fort (1 verre ou 3cl)',
        type: 'single_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: FREQUENCY_OPTIONS
    },
    {
        id: 'nutraceutiques',
        text: '39) Prenez-vous l’un des nutraceutiques suivants ?',
        type: 'multiple_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: [
            { code: 'Multivitamine', label: 'Micronutriments à large spectre' },
            { code: 'Probiotiques', label: 'Probiotiques' },
            { code: 'Zinc', label: 'Zinc' },
            { code: 'Methylfolate', label: 'Methylfolate (vitamine B9 active)' },
            { code: 'Acide folique', label: 'Acide folique' },
            { code: 'Vitamine D', label: 'Vitamine D' },
            { code: 'SAMe', label: 'S-adénosyl-méthionine (SAMe)' },
            { code: 'NAC', label: 'N-acétyl-cystéine (NAC)' },
            { code: 'Vitamine C', label: 'Vitamine C' },
            { code: 'Tryptophane', label: 'Tryptophane' },
            { code: 'HTP', label: 'HTP' },
            { code: 'Créatine', label: 'Créatine' },
            { code: 'Inositol', label: 'Inositol' },
            { code: 'Magnésium', label: 'Magnésium' },
            { code: 'Sarcosine', label: 'Sarcosine' },
            { code: 'Acétyl-L-carnitine', label: 'Acétyl-L-carnitine' },
            { code: 'Benzoate de sodium', label: 'Benzoate de sodium' },
            { code: 'L-théanine', label: 'L-théanine' }
        ]
    },
    {
        id: 'phytoceutiques',
        text: '40) Prenez-vous l’un des phytoceutiques suivants ?',
        type: 'multiple_choice',
        required: false,
        display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
        options: [
            { code: 'Millepertuis', label: 'Millepertuis' },
            { code: 'Safran', label: 'Safran' },
            { code: 'Curcumine', label: 'Curcumine' },
            { code: 'Lavande', label: 'Lavande' },
            { code: 'Rhodiole', label: 'Rhodiole' },
            { code: 'Ashwagandha', label: 'Ashwagandha' },
            { code: 'Galphimia', label: 'Galphimia' },
            { code: 'Camomille', label: 'Camomille' },
            { code: 'Kava', label: 'Kava' },
            { code: 'Ginkgo', label: 'Ginkgo' }
        ]
    }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const ALIMENTAIRE_SZ_DEFINITION: QuestionnaireDefinition = {
    id: 'alimentaire_sz',
    code: 'ALIMENTAIRE_SZ',
    title: 'AUTO-QUESTIONNAIRE ALIMENTAIRE',
    description: 'Ce questionnaire évalue vos habitudes alimentaires au cours des 12 derniers mois et du dernier mois.',
    questions: ALIMENTAIRE_SZ_QUESTIONS,
    metadata: {
        pathologies: ['schizophrenia'],
        target_role: 'patient',
        version: '1.0',
        language: 'fr-FR',
        singleColumn: true
    }
};
