// eFondaMental Platform - ONAPS (Activité Physique - Onaps)
// Schizophrenia Initial Evaluation - Autoquestionnaire Module
// Reference: Observatoire national de l'activité physique et de la sédentarité

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaOnapsResponse {
    id: string;
    visit_id: string;
    patient_id: string;
    questionnaire_done?: string;

    // Partie A : activités au travail
    work_vigorous_days: number | null;
    work_vigorous_hours: number | null;
    work_vigorous_minutes: number | null;
    work_moderate_days: number | null;
    work_moderate_hours: number | null;
    work_moderate_minutes: number | null;
    work_sitting_hours: number | null;
    work_sitting_minutes: number | null;

    // Partie B : Déplacements à but utilitaire
    transport_walking_days: number | null;
    transport_walking_hours: number | null;
    transport_walking_minutes: number | null;
    transport_bicycle_days: number | null;
    transport_bicycle_hours: number | null;
    transport_bicycle_minutes: number | null;
    transport_motorized_days: number | null;
    transport_motorized_hours: number | null;
    transport_motorized_minutes: number | null;

    // Partie C : Activités de loisirs ou au domicile
    leisure_vigorous_days: number | null;
    leisure_vigorous_hours: number | null;
    leisure_vigorous_minutes: number | null;
    leisure_moderate_days: number | null;
    leisure_moderate_hours: number | null;
    leisure_moderate_minutes: number | null;
    leisure_screen_days: number | null;
    leisure_screen_hours: number | null;
    leisure_screen_minutes: number | null;
    leisure_other_days: number | null;
    leisure_other_hours: number | null;
    leisure_other_minutes: number | null;

    // Computed scores (Durées - min/semaine)
    vpa_duration: number | null;
    mpa_duration: number | null;
    mvpa_duration: number | null;

    // Computed scores (METs.min/semaine)
    vpamet: number | null;
    mpamet: number | null;
    aptot: number | null;

    // Computed scores (Sédentarité - min/jour)
    sb_duration: number | null;

    // Interpretations
    mvpa_interpretation: string | null;
    aptot_interpretation: string | null;
    sedentarity_interpretation: string | null;

    // Metadata
    completed_by: string | null;
    completed_at: string;
    created_at: string;
    updated_at: string;
}

export type SchizophreniaOnapsResponseInsert = Omit<
    SchizophreniaOnapsResponse,
    'id' | 'created_at' | 'updated_at' | 'completed_at' |
    'vpa_duration' | 'mpa_duration' | 'mvpa_duration' |
    'vpamet' | 'mpamet' | 'aptot' | 'sb_duration' |
    'mvpa_interpretation' | 'aptot_interpretation' | 'sedentarity_interpretation'
> & {
    completed_by?: string | null;
};

// ============================================================================
// Score Result Type
// ============================================================================

export interface OnapsSzScoreResult {
    vpa_duration: number;
    mpa_duration: number;
    mvpa_duration: number;
    vpamet: number;
    mpamet: number;
    aptot: number;
    sb_duration: number;
    mvpa_interpretation: string;
    aptot_interpretation: string;
    sedentarity_interpretation: string;
}

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Calculer les minutes (total) à partir des heures et minutes.
 * Gère une division en heures/minutes par jour en les convertissant en minutes.
 */
function minutesPerDay(hours: number | null | undefined, minutes: number | null | undefined): number {
    return ((hours || 0) * 60) + (minutes || 0);
}

/**
 * Calcul des scores de l'ONAPS
 */
export function computeOnapsScores(responses: {
    work_vigorous_days: number | null;
    work_vigorous_hours: number | null;
    work_vigorous_minutes: number | null;
    work_moderate_days: number | null;
    work_moderate_hours: number | null;
    work_moderate_minutes: number | null;
    work_sitting_hours: number | null;
    work_sitting_minutes: number | null;

    transport_walking_days: number | null;
    transport_walking_hours: number | null;
    transport_walking_minutes: number | null;
    transport_bicycle_days: number | null;
    transport_bicycle_hours: number | null;
    transport_bicycle_minutes: number | null;
    transport_motorized_days: number | null;
    transport_motorized_hours: number | null;
    transport_motorized_minutes: number | null;

    leisure_vigorous_days: number | null;
    leisure_vigorous_hours: number | null;
    leisure_vigorous_minutes: number | null;
    leisure_moderate_days: number | null;
    leisure_moderate_hours: number | null;
    leisure_moderate_minutes: number | null;
    leisure_screen_days: number | null;
    leisure_screen_hours: number | null;
    leisure_screen_minutes: number | null;
    leisure_other_days: number | null;
    leisure_other_hours: number | null;
    leisure_other_minutes: number | null;
}): OnapsSzScoreResult {

    // === VPA Duration (Intense) ===
    const workVigorousMin = minutesPerDay(responses.work_vigorous_hours, responses.work_vigorous_minutes);
    const workVigorousDays = responses.work_vigorous_days || 0;

    const leisureVigorousMin = minutesPerDay(responses.leisure_vigorous_hours, responses.leisure_vigorous_minutes);
    const leisureVigorousDays = responses.leisure_vigorous_days || 0;

    const vpa_duration = (workVigorousDays * workVigorousMin) + (leisureVigorousDays * leisureVigorousMin);


    // === MPA Duration (Modérée + Marche + Vélo) ===
    // Marche et vélo sont considérés comme des activités modérées (3.3 et 6.0 METs respectivement, 
    // mais en termes de durée, on les ajoute à MPA selon recommandations).
    const workModerateMin = minutesPerDay(responses.work_moderate_hours, responses.work_moderate_minutes);
    const workModerateDays = responses.work_moderate_days || 0;

    const walkingMin = minutesPerDay(responses.transport_walking_hours, responses.transport_walking_minutes);
    const walkingDays = responses.transport_walking_days || 0;

    const bicycleMin = minutesPerDay(responses.transport_bicycle_hours, responses.transport_bicycle_minutes);
    const bicycleDays = responses.transport_bicycle_days || 0;

    const leisureModerateMin = minutesPerDay(responses.leisure_moderate_hours, responses.leisure_moderate_minutes);
    const leisureModerateDays = responses.leisure_moderate_days || 0;

    const mpa_duration = (workModerateDays * workModerateMin) +
        (walkingDays * walkingMin) +
        (bicycleDays * bicycleMin) +
        (leisureModerateDays * leisureModerateMin);

    // === MVPA Duration ===
    const mvpa_duration = vpa_duration + mpa_duration;


    // === MET Computations ===
    // Intense (VPA)
    const vpamet = vpa_duration * 8.0;

    // Modéré (MPA): Marche (3.3 Mets), Vélo Transport (6.0 Mets), Travail/Loisir Modéré (4.0 Mets)
    const walkingMets = (walkingDays * walkingMin) * 3.3;
    const bicycleMets = (bicycleDays * bicycleMin) * 6.0;
    const otherModerateMets = ((workModerateDays * workModerateMin) + (leisureModerateDays * leisureModerateMin)) * 4.0;

    const mpamet = walkingMets + bicycleMets + otherModerateMets;

    // Total AP METs
    const aptot = vpamet + mpamet;


    // === Sitting Behavior (Sédentarité) ===
    // Total sitting per day = work sitting per day + motorized transport per day + leisure screen per day + leisure other sitting per day
    // Since we assume the user reported typical per-day duration when these occur
    const workSittingMin = minutesPerDay(responses.work_sitting_hours, responses.work_sitting_minutes);

    const motorizedMin = minutesPerDay(responses.transport_motorized_hours, responses.transport_motorized_minutes);
    // (Note: motorized_days max is 10 in UI, but we calculate per day average or consider it as average day)

    const leisureScreenMin = minutesPerDay(responses.leisure_screen_hours, responses.leisure_screen_minutes);
    const leisureOtherMin = minutesPerDay(responses.leisure_other_hours, responses.leisure_other_minutes);

    // To get a simple average min/jour of sedentary time (SB duration), one standard way is adding the usual times:
    // Usually sitting measures the typical day:
    let sb_duration = workSittingMin + motorizedMin + leisureScreenMin + leisureOtherMin;

    // Interpretations
    const mvpa_interpretation = mvpa_duration < 150 ? 'INACTIF' : 'ACTIF';
    const aptot_interpretation = aptot < 600 ? 'INACTIF' : 'ACTIF';
    const sedentarity_interpretation = mvpa_duration < 180 ? 'Sédentarité faible' : 'Sédentarité normale/élevée';

    return {
        vpa_duration,
        mpa_duration,
        mvpa_duration,
        vpamet: Math.round(vpamet),
        mpamet: Math.round(mpamet),
        aptot: Math.round(aptot),
        sb_duration,
        mvpa_interpretation,
        aptot_interpretation,
        sedentarity_interpretation
    };
}

export function interpretOnapsScore(results: OnapsSzScoreResult): string {
    let interpretation = `Durée hebdomadaire: Intense ${results.vpa_duration}min, Modérée ${results.mpa_duration}min, Totale (MVPA) ${results.mvpa_duration}min. (${results.mvpa_interpretation}) \n`;
    interpretation += `Scores MET: Intense ${results.vpamet}, Modéré ${results.mpamet}, Total ${results.aptot} MET-min/semaine. (${results.aptot_interpretation}) \n`;
    interpretation += `Temps sédentaire: ${results.sb_duration} min/jour. (${results.sedentarity_interpretation})`;
    return interpretation;
}

// ============================================================================
// Questions Dictionary
// ============================================================================

export const ONAPS_SZ_QUESTIONS: Question[] = [
    // Administration status
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
    // Instructions
    {
        id: 'instruction_consigne',
        text: 'Ce questionnaire, inspiré de l’ONAPS a été conçu pour évaluer votre activité physique au quotidien lors des 7 derniers jours.\n\nLes activités physiques de forte intensité sont des activités nécessitant un effort physique important et causant une augmentation conséquente de la respiration ou du rythme cardiaque.\n\nLes activités physiques d\'intensité modérée sont des activités qui demandent un effort physique modéré et causant une petite augmentation de la respiration ou du rythme cardiaque.\n\nEn répondant aux questions suivantes, pensez uniquement aux exercices physiques que vous avez réalisé pendant au moins 10 minutes consécutives.',
        type: 'instruction',
        required: false
    },

    // ========== PARTIE A : ACTIVITÉS AU TRAVAIL ==========
    {
        id: 'section_work',
        text: 'Partie A : activités au travail',
        type: 'section',
        required: false
    },
    {
        id: 'work_vigorous_days',
        text: '1) Habituellement, combien de jours par semaine effectuez-vous des tâches de forte intensité physique dans le cadre de votre travail ? (Mettre 0 si pas d\'activité de forte intensité)',
        type: 'single_choice',
        required: true,
        options: [
            { code: 0, label: '0', score: 0 },
            { code: 1, label: '1', score: 1 },
            { code: 2, label: '2', score: 2 },
            { code: 3, label: '3', score: 3 },
            { code: 4, label: '4', score: 4 },
            { code: 5, label: '5', score: 5 },
            { code: 6, label: '6', score: 6 },
            { code: 7, label: '7', score: 7 }
        ]
    },
    {
        id: 'work_vigorous_time',
        text: '2) Lorsque vous effectuez ces tâches de forte intensité au travail, combien de temps par jour en moyenne y consacrez-vous ?',
        type: 'text',
        required: false,
        help: 'Format HH:MM (ex: 01:30 pour 1h30)',
        metadata: { placeholder: 'HH:MM' }
    },
    {
        id: 'work_moderate_days',
        text: '3) Habituellement, combien de jours par semaine effectuez-vous des tâches d\'intensité modérée dans le cadre de votre travail ? (Mettre 0 si pas d\'activité modérée)',
        type: 'single_choice',
        required: true,
        options: [
            { code: 0, label: '0', score: 0 },
            { code: 1, label: '1', score: 1 },
            { code: 2, label: '2', score: 2 },
            { code: 3, label: '3', score: 3 },
            { code: 4, label: '4', score: 4 },
            { code: 5, label: '5', score: 5 },
            { code: 6, label: '6', score: 6 },
            { code: 7, label: '7', score: 7 }
        ]
    },
    {
        id: 'work_moderate_time',
        text: '4) Lorsque vous effectuez ces tâches d\'intensité modérée au travail, combien de temps en moyenne par jour y consacrez-vous ?',
        type: 'text',
        required: false,
        help: 'Format HH:MM (ex: 01:30 pour 1h30)',
        metadata: { placeholder: 'HH:MM' }
    },
    {
        id: 'work_sitting_time',
        text: '5) Habituellement, combien de temps par jour en moyenne passez-vous assis pour votre travail ? (Mettre 0 si vous ne travaillez pas, ne pas compter les temps de repas)',
        type: 'text',
        required: false,
        help: 'Format HH:MM (ex: 02:00 pour 2h00)',
        metadata: { placeholder: 'HH:MM' }
    },

    // ========== PARTIE B : DÉPLACEMENTS À BUT UTILITAIRE ==========
    {
        id: 'section_transport',
        text: 'Partie B : Déplacements à but utilitaire',
        help: 'Les questions suivantes concernent la façon habituelle de vous déplacer d\'un endroit à un autre, par exemple aller au travail, faire des courses, aller au marché, aller chez un ami...',
        type: 'section',
        required: false
    },
    {
        id: 'transport_walking_days',
        text: '6) Habituellement combien de jours par semaine en moyenne effectuez-vous des trajets à pied de plus de 10 minutes ? (mettre 0 si pas de trajets effectués à pied)',
        type: 'single_choice',
        required: true,
        options: [
            { code: 0, label: '0', score: 0 },
            { code: 1, label: '1', score: 1 },
            { code: 2, label: '2', score: 2 },
            { code: 3, label: '3', score: 3 },
            { code: 4, label: '4', score: 4 },
            { code: 5, label: '5', score: 5 },
            { code: 6, label: '6', score: 6 },
            { code: 7, label: '7', score: 7 }
        ]
    },
    {
        id: 'transport_walking_time',
        text: '7) Lors d\'une journée durant laquelle vous effectuez des trajets à pied, combien de temps en moyenne y consacrez-vous ?',
        type: 'text',
        required: false,
        help: 'Format HH:MM (ex: 00:45 pour 45min)',
        metadata: { placeholder: 'HH:MM' }
    },
    {
        id: 'transport_bicycle_days',
        text: '8) Habituellement combien de jours par semaine en moyenne effectuez-vous des trajets à vélo ou vélo à assistance électrique (VAE) ? (mettre 0 si pas de trajets)',
        type: 'single_choice',
        required: true,
        options: [
            { code: 0, label: '0', score: 0 },
            { code: 1, label: '1', score: 1 },
            { code: 2, label: '2', score: 2 },
            { code: 3, label: '3', score: 3 },
            { code: 4, label: '4', score: 4 },
            { code: 5, label: '5', score: 5 },
            { code: 6, label: '6', score: 6 },
            { code: 7, label: '7', score: 7 }
        ]
    },
    {
        id: 'transport_bicycle_time',
        text: '9) Lors d\'une journée durant laquelle vous effectuez des trajets à vélo ou VAE, combien de temps en moyenne y consacrez-vous ?',
        type: 'text',
        required: false,
        help: 'Format HH:MM (ex: 00:30 pour 30min)',
        metadata: { placeholder: 'HH:MM' }
    },
    {
        id: 'transport_motorized_days',
        text: '10) Habituellement, combien de jours par semaine effectuez-vous des trajets avec des moyens de transport motorisés',
        type: 'single_choice',
        required: true,
        options: [
            { code: 0, label: '0', score: 0 },
            { code: 1, label: '1', score: 1 },
            { code: 2, label: '2', score: 2 },
            { code: 3, label: '3', score: 3 },
            { code: 4, label: '4', score: 4 },
            { code: 5, label: '5', score: 5 },
            { code: 6, label: '6', score: 6 },
            { code: 7, label: '7', score: 7 },
            { code: 8, label: '8', score: 8 },
            { code: 9, label: '9', score: 9 },
            { code: 10, label: '10', score: 10 }
        ]
    },
    {
        id: 'transport_motorized_time',
        text: '11) Lors d\'une journée durant laquelle vous effectuez des trajets motorisés, combien de temps en moyenne durent l\'ensemble de ces trajets ?',
        type: 'text',
        required: false,
        help: 'Format HH:MM (ex: 01:00 pour 1h)',
        metadata: { placeholder: 'HH:MM' }
    },

    // ========== PARTIE C : ACTIVITÉS DE LOISIRS OU AU DOMICILE ==========
    {
        id: 'section_leisure',
        text: 'Partie C : Activités de loisirs ou au domicile',
        help: 'Les questions suivantes excluent les activités liées au travail et aux déplacements que vous avez déjà mentionnées.',
        type: 'section',
        required: false
    },
    {
        id: 'leisure_vigorous_days',
        text: '12) Habituellement, combien de jours par semaine pratiquez-vous des activités sportives ou des activités de loisirs de forte intensité',
        type: 'single_choice',
        required: true,
        options: [
            { code: 0, label: '0', score: 0 },
            { code: 1, label: '1', score: 1 },
            { code: 2, label: '2', score: 2 },
            { code: 3, label: '3', score: 3 },
            { code: 4, label: '4', score: 4 },
            { code: 5, label: '5', score: 5 },
            { code: 6, label: '6', score: 6 },
            { code: 7, label: '7', score: 7 }
        ]
    },
    {
        id: 'leisure_vigorous_time',
        text: '13) Lors d\'une journée durant laquelle vous pratiquez des activités sportives ou des activités de loisirs de forte intensité, combien de temps en moyenne y consacrez-vous ?',
        type: 'text',
        required: false,
        help: 'Format HH:MM (ex: 01:30 pour 1h30)',
        metadata: { placeholder: 'HH:MM' }
    },
    {
        id: 'leisure_moderate_days',
        text: '14) Habituellement, combien de jours par semaine pratiquez-vous des activités sportives ou des activités de loisirs d\'intensité modérée ?',
        type: 'single_choice',
        required: true,
        options: [
            { code: 0, label: '0', score: 0 },
            { code: 1, label: '1', score: 1 },
            { code: 2, label: '2', score: 2 },
            { code: 3, label: '3', score: 3 },
            { code: 4, label: '4', score: 4 },
            { code: 5, label: '5', score: 5 },
            { code: 6, label: '6', score: 6 },
            { code: 7, label: '7', score: 7 }
        ]
    },
    {
        id: 'leisure_moderate_time',
        text: '15) Lors d\'une journée durant laquelle vous pratiquez des activités sportives ou des activités de loisirs d\'intensité modérée, combien de temps en moyenne y consacrez-vous ?',
        type: 'text',
        required: false,
        help: 'Format HH:MM (ex: 00:45 pour 45min)',
        metadata: { placeholder: 'HH:MM' }
    },
    {
        id: 'leisure_screen_days',
        text: '16) Habituellement, lors de combien de jours par semaine passez-vous du temps devant un écran, chez vous ou lors de vos loisirs',
        type: 'single_choice',
        required: true,
        options: [
            { code: 0, label: '0', score: 0 },
            { code: 1, label: '1', score: 1 },
            { code: 2, label: '2', score: 2 },
            { code: 3, label: '3', score: 3 },
            { code: 4, label: '4', score: 4 },
            { code: 5, label: '5', score: 5 },
            { code: 6, label: '6', score: 6 },
            { code: 7, label: '7', score: 7 }
        ]
    },
    {
        id: 'leisure_screen_time',
        text: '17) Lors d\'une journée durant laquelle vous passez du temps devant l\'écran, combien de temps en moyenne y passez-vous, chez vous ou lors de vos loisirs ?',
        type: 'text',
        required: false,
        help: 'Format HH:MM (ex: 03:00 pour 3h)',
        metadata: { placeholder: 'HH:MM' }
    },
    {
        id: 'leisure_other_days',
        text: '18) Habituellement, lors de combien de jours par semaine passez-vous du temps autre que devant un écran, chez vous ou lors de vos loisirs ?',
        type: 'single_choice',
        required: true,
        options: [
            { code: 0, label: '0', score: 0 },
            { code: 1, label: '1', score: 1 },
            { code: 2, label: '2', score: 2 },
            { code: 3, label: '3', score: 3 },
            { code: 4, label: '4', score: 4 },
            { code: 5, label: '5', score: 5 },
            { code: 6, label: '6', score: 6 },
            { code: 7, label: '7', score: 7 }
        ]
    },
    {
        id: 'leisure_other_time',
        text: '19) Lors d\'une journée durant laquelle vous passez du temps autre que devant l\'écran, combien de temps en moyenne y passez-vous, chez vous ou lors de vos loisirs ?',
        type: 'text',
        required: false,
        help: 'Format HH:MM (ex: 02:00 pour 2h)',
        metadata: { placeholder: 'HH:MM' }
    },

    // ========== RÉSULTATS / SCORES ==========
    {
        id: 'section_scores',
        text: 'Résultats',
        type: 'section',
        required: false
    },
    {
        id: 'vpa_duration',
        text: 'Durée hebdomadaire d\'activité physique de forte intensité (VPA) :',
        type: 'number',
        required: false,
        help: 'En minutes par semaine',
        metadata: { placeholder: 'min/semaine' }
    },
    {
        id: 'mpa_duration',
        text: 'Durée hebdomadaire d\'activité physique d\'intensité modérée (MPA) :',
        type: 'number',
        required: false,
        help: 'En minutes par semaine',
        metadata: { placeholder: 'min/semaine' }
    },
    {
        id: 'mvpa_duration',
        text: 'Durée hebdomadaire d\'activité physique d\'intensité modérée et de forte intensité (MVPA) :',
        type: 'number',
        required: false,
        help: '(MVPA) < 150 min/semaine => INACTIF',
        metadata: { placeholder: 'min/semaine' }
    },
    {
        id: 'vpamet',
        text: 'Activité physique de forte intensité (VPAMET) :',
        type: 'number',
        required: false,
        metadata: { placeholder: 'METs.min/semaine' }
    },
    {
        id: 'mpamet',
        text: 'Activité physique d\'intensité modérée (MPAMET) :',
        type: 'number',
        required: false,
        metadata: { placeholder: 'METs.min/semaine' }
    },
    {
        id: 'aptot',
        text: 'Activité totale en METs.min/semaine (APtot) :',
        type: 'number',
        required: false,
        help: 'Inférieur à 600 METs.min par semaine => Inactif',
        metadata: { placeholder: 'METs.min/semaine' }
    },
    {
        id: 'sb_duration',
        text: 'Comportement sédentaire (SB) :',
        type: 'number',
        required: false,
        help: 'Si activité faible inférieur à 180 min/j => Sédentarité faible',
        metadata: { placeholder: 'min/jour' }
    }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const ONAPS_SZ_DEFINITION: QuestionnaireDefinition = {
    id: 'onaps_sz',
    code: 'ONAPS_SZ',
    title: 'QUESTIONNAIRE ACTIVITE PHYSIQUE - ONAPS',
    description: 'Ce questionnaire évalue votre activité physique au quotidien lors des 7 derniers jours (au travail, en déplacement, lors des loisirs).',
    questions: ONAPS_SZ_QUESTIONS,
    metadata: {
        pathologies: ['schizophrenia'],
        target_role: 'patient',
        version: '1.0',
        language: 'fr-FR',
        singleColumn: true,
        reference: 'Observatoire national de l\'activité physique et de la sédentarité'
    }
};
