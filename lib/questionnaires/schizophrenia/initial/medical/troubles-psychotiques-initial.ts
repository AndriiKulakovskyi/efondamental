// eFondaMental Platform - Troubles Psychotiques Initial Assessment
// Comprehensive psychotic disorders evaluation including disorder classification,
// symptoms inventory, episode history, hospitalizations, and treatment
// Used for initial evaluation visits only

import { Question, QuestionOption } from "@/lib/types/database.types";

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaTroublesPsychotiquesInitialResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  [key: string]: any; // Dynamic fields from questionnaire
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaTroublesPsychotiquesInitialResponseInsert = Omit<
  SchizophreniaTroublesPsychotiquesInitialResponse,
  "id" | "created_at" | "updated_at" | "completed_at"
>;

// ============================================================================
// Response Options
// ============================================================================

const YES_NO_OPTIONS: QuestionOption[] = [
  { code: "Oui", label: "Oui" },
  { code: "Non", label: "Non" },
];

const YES_NO_UNKNOWN_OPTIONS: QuestionOption[] = [
  { code: "Oui", label: "Oui" },
  { code: "Non", label: "Non" },
  { code: "Ne sais pas", label: "Ne sais pas" },
];

const DISORDER_TYPE_OPTIONS: QuestionOption[] = [
  {
    code: "1",
    label:
      "Schizophrenie (incluant psychose hallucinatoire chronique et paraphrenie tardive)",
  },
  { code: "2", label: "Trouble schizo-affectif" },
  { code: "3", label: "Personnalite schizoide (selon le DSM-IV)" },
  { code: "4", label: "Personnalite schizotypique (selon le DSM-IV)" },
  { code: "5", label: "Trouble psychotique bref (/aigu et transitoire)" },
  { code: "6", label: "Trouble schizophreniforme (entre 1 et 6 mois)" },
  {
    code: "7",
    label: "Trouble psychotique induit par une substance (pharmacopsychose)",
  },
  { code: "8", label: "Trouble delirant persistant non schizophrenique" },
  {
    code: "9",
    label: "Trouble psychotique du a une affection medicale generale",
  },
  { code: "10", label: "Autre" },
];

const EVOLUTIONARY_MODE_OPTIONS: QuestionOption[] = [
  {
    code: "Episodique avec symptomes residuels entre les episodes et avec presence de symptomes negatifs",
    label: "Episodique avec symptomes residuels + symptomes negatifs",
  },
  {
    code: "Episodique avec symptomes residuels entre les episodes et sans symptomes negatifs",
    label: "Episodique avec symptomes residuels sans symptomes negatifs",
  },
  {
    code: "Episodique sans symptomes residuels entre les episodes",
    label: "Episodique sans symptomes residuels",
  },
  {
    code: "Continu avec symptomes negatifs prononces",
    label: "Continu avec symptomes negatifs prononces",
  },
  { code: "Continu", label: "Continu" },
  {
    code: "Episode isole avec symptomes negatifs prononces",
    label: "Episode isole avec symptomes negatifs prononces",
  },
  {
    code: "Episode isole en remission partielle",
    label: "Episode isole en remission partielle",
  },
  {
    code: "Episode isole en remission complete",
    label: "Episode isole en remission complete",
  },
  { code: "Autre cours evolutif", label: "Autre cours evolutif" },
];

const AGE_LT5_TO_GT89_OPTIONS: QuestionOption[] = [
  { code: "Ne sais pas", label: "Ne sais pas" },
  { code: "<5", label: "<5" },
  ...Array.from({ length: 85 }, (_, i) => {
    const age = i + 5;
    return { code: String(age), label: String(age) };
  }),
  { code: ">89", label: ">89" },
];

const AGE_HOSPITALISATION_OPTIONS: QuestionOption[] = [
  { code: "Pas d'hospitalisations", label: "Pas d'hospitalisations" },
  ...AGE_LT5_TO_GT89_OPTIONS,
];

const EPISODES_OPTIONS: QuestionOption[] = [
  { code: "aucun", label: "aucun" },
  ...Array.from({ length: 21 }, (_, i) => ({
    code: String(i),
    label: String(i),
  })),
  { code: ">20", label: ">20" },
];

const HOSPITALISATIONS_NB_OPTIONS: QuestionOption[] = [
  { code: "Ne sais pas", label: "Ne sais pas" },
  ...Array.from({ length: 21 }, (_, i) => ({
    code: String(i),
    label: String(i),
  })),
  { code: ">20", label: ">20" },
];

const HOSPITALISATIONS_DUREE_MOIS_OPTIONS: QuestionOption[] = [
  { code: "Ne sais pas", label: "Ne sais pas" },
  ...Array.from({ length: 21 }, (_, i) => ({
    code: String(i),
    label: String(i),
  })),
  { code: ">30", label: ">30" },
];

const WEEKS_0_TO_52_OPTIONS: QuestionOption[] = [
  { code: "Ne sais pas", label: "Ne sais pas" },
  ...Array.from({ length: 53 }, (_, i) => ({
    code: String(i),
    label: String(i),
  })),
];

const YES_NO_UNKNOWN_OPTIONS_LOWER: QuestionOption[] = [
  { code: "Oui", label: "Oui" },
  { code: "Non", label: "Non" },
  { code: "Ne sais pas", label: "Ne sais pas" },
];

const START_END_OPTIONS: QuestionOption[] = [
  { code: "Debut", label: "Debut" },
  { code: "Fin", label: "Fin" },
];

const HOSPITALISATION_MOTIF_OPTIONS: QuestionOption[] = [
  { code: "Episode psychotique", label: "Episode psychotique" },
  { code: "Episode thymique", label: "Episode thymique" },
  { code: "Tentative de suicide", label: "Tentative de suicide" },
  {
    code: "Destabilisation de l environnement",
    label: "Destabilisation de l environnement",
  },
  { code: "Recrudescence anxieuse", label: "Recrudescence anxieuse" },
  { code: "Autres", label: "Autres" },
];

const AIDE_PRISE_TRAITEMENT_OPTIONS: QuestionOption[] = [
  { code: "Autonome", label: "Autonome" },
  { code: "Aide familiale", label: "Aide familiale" },
  { code: "Aide au CMP ou a l'hopital", label: "Aide au CMP ou a l'hopital" },
  { code: "IDE au domicile", label: "IDE au domicile" },
];

// ============================================================================
// Questions
// ============================================================================

export const TROUBLES_PSYCHOTIQUES_INITIAL_QUESTIONS: Question[] = [
  // Classification section
  {
    id: "section_classification",
    text: "Classification du trouble",
    type: "section",
    required: false,
  },
  {
    id: "rad_tbpsycho_spectre",
    text: "Le patient presente-t-il un trouble du spectre schizophrenique (DSM5 - F20 a F29) ?",
    type: "single_choice",
    required: false,
    options: YES_NO_OPTIONS,
  },
  {
    id: "rad_tbpsycho_type",
    text: "Si oui, quel est le type de trouble ?",
    type: "single_choice",
    required: false,
    options: DISORDER_TYPE_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsycho_spectre" }, "Oui"] },
    indentLevel: 1,
  },

  // Lifetime characteristics
  {
    id: "section_vie_entiere",
    text: "Caracteristiques vie entiere",
    type: "section",
    required: false,
  },
  {
    id: "rad_tbpsychovie_premierep_age",
    text: "Age du 1er episode psychotique",
    type: "single_choice",
    required: false,
    options: AGE_LT5_TO_GT89_OPTIONS,
  },
  {
    id: "rad_tbpsychovie_premiertrait_age",
    text: "Age du 1er traitement antipsychotique",
    type: "single_choice",
    required: false,
    options: AGE_LT5_TO_GT89_OPTIONS,
  },
  {
    id: "tbpsychovie_premiertrait_duree",
    text: "Duree de psychose non traitee",
    type: "number",
    required: false,
    min: 0,
  },
  {
    id: "rad_tbpsychovie_premierhosp_age",
    text: "Age de la 1ere hospitalisation en psychiatrie pour trouble psychotique",
    type: "single_choice",
    required: false,
    options: AGE_HOSPITALISATION_OPTIONS,
  },
  {
    id: "tbduree",
    text: "Duree en semaines",
    type: "number",
    required: false,
    min: 0,
    display_if: {
      "!=": [
        { var: "rad_tbpsychovie_premierhosp_age" },
        "Pas d'hospitalisations",
      ],
    },
    indentLevel: 1,
  },
  {
    id: "tbdureetot",
    text: "Duree totale des hospitalisations pour le 1er episode psychotique (semaines)",
    type: "number",
    required: false,
    min: 0,
    help: "Additionner la duree totale des hospitalisations liees au 1er episode psychotique.",
    display_if: {
      "!=": [
        { var: "rad_tbpsychovie_premierhosp_age" },
        "Pas d'hospitalisations",
      ],
    },
    indentLevel: 1,
  },
  {
    id: "rad_tbpsychovie_hospit_nb",
    text: "Nbre d'hospitalisations en psychiatrie sur la vie entiere",
    type: "single_choice",
    required: false,
    options: HOSPITALISATIONS_NB_OPTIONS,
    display_if: {
      "!=": [
        { var: "rad_tbpsychovie_premierhosp_age" },
        "Pas d'hospitalisations",
      ],
    },
    indentLevel: 1,
  },
  {
    id: "rad_tbpsychovie_hospit_dureetot",
    text: "Duree totale des hospitalisations en psychiatrie sur la vie entiere (en mois)",
    type: "single_choice",
    required: false,
    options: HOSPITALISATIONS_DUREE_MOIS_OPTIONS,
    display_if: {
      "!=": [
        { var: "rad_tbpsychovie_premierhosp_age" },
        "Pas d'hospitalisations",
      ],
    },
    indentLevel: 1,
  },
  {
    id: "rad_tbpsychovie_nb",
    text: "Nombre d'episodes psychotiques",
    type: "single_choice",
    required: false,
    options: EPISODES_OPTIONS,
    display_if: { "!=": [{ var: "rad_tbpsychovie_premierhosp_age" }, null] },
    indentLevel: 1,
  },

  // Symptoms (lifetime + last month)
  {
    id: "section_symptomes_vie_entiere",
    text: "Symptomes vie entiere",
    type: "section",
    required: false,
  },
  {
    id: "rad_symptomesvie_persecution",
    text: "Delire de persecution",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_persecution_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_persecution" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_grandeur",
    text: "Delire de grandeur",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_grandeur_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_grandeur" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_somatique",
    text: "Delire somatique",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_somatique_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_somatique" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_mystique",
    text: "Delire mystique",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_mystique_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_mystique" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_culpabilite",
    text: "Delire de culpabilite",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_culpabilite_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_culpabilite" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_jalousie",
    text: "Delire de jalousie",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_jalousie_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_jalousie" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_erotomaniaque",
    text: "Delire erotomaniaque",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_erotomaniaque_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_erotomaniaque" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_etrecontrole",
    text: "Delire d'etre controle",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_etrecontrole_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_etrecontrole" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_volpensee",
    text: "Delire de vol de la pensee",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_volpensee_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_volpensee" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_bizarre",
    text: "Delire bizarre",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_bizarre_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_bizarre" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_idreferences",
    text: "Idees de references",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_idreferences_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_idreferences" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_halluintrapsy",
    text: "Hallucinations auditives intrapsychiques",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_halluintrapsy_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_halluintrapsy" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_hallusenso",
    text: "Hallucination auditives sensorielles",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_hallusenso_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_hallusenso" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_halluvisu",
    text: "Hallucinations visuelles",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_halluvisu_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_halluvisu" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_hallucenesthe",
    text: "Hallucinations cenesthesiques",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_hallucenesthe_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_hallucenesthe" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_catatonie",
    text: "Catatonie",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_catatonie_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_catatonie" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_compodesorg",
    text: "Comportement desorganise",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_compodesorg_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_compodesorg" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_gestdiscord",
    text: "Gestuelle discordante",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_gestdiscord_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_gestdiscord" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_discdesorg",
    text: "Discours desorganise",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_discdesorg_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_discdesorg" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_avolition",
    text: "Avolition",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_avolition_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_avolition" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_alogie",
    text: "Alogie",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_alogie_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_alogie" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_symptomesvie_emousaffec",
    text: "Emoussement affectif",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_symptomesvie_emousaffec_mois",
    text: "Presence lors du dernier mois",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_symptomesvie_emousaffec" }, "Oui"] },
    indentLevel: 1,
  },

  // Evolutionary mode
  {
    id: "section_mode_evolutif",
    text: "Mode evolutif de la symptomatologie",
    type: "section",
    required: false,
  },
  {
    id: "rad_tbpsychovie_mode_evolutif",
    text: "Mode evolutif",
    type: "single_choice",
    required: false,
    options: EVOLUTIONARY_MODE_OPTIONS,
  },

  // Annual follow-up (12 derniers mois)
  {
    id: "section_suivi_annuel",
    text: "Caracteristiques du trouble au cours des 12 derniers mois",
    type: "section",
    required: false,
  },
  {
    id: "rad_tbpsychoan",
    text: "Presence d’au moins un episode psychotique au cours de l’annee",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS_LOWER,
  },

  // Hospitalisations
  {
    id: "section_hospitalisations_12mois",
    text: "Hospitalisation au cours de l'annee ecoulee",
    type: "section",
    required: false,
  },
  {
    id: "rad_tbpsychoan_hospi_tpscomplet",
    text: "Hospitalisations a temps complet au cours de l'annee ecoulee",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS_LOWER,
  },
  {
    id: "rad_tbpsychoan_hospi_tpscomplet_nb",
    text: "Nombre d'hospitalisations au cours de l'annee ecoulee",
    type: "single_choice",
    required: false,
    options: HOSPITALISATIONS_NB_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_hospi_tpscomplet" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_tbpsychoan_hospi_tpscomplet_duree",
    text: "Duree totale des hospitalisations sur l'annee ecoulee (en semaines)",
    type: "single_choice",
    required: false,
    options: WEEKS_0_TO_52_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_hospi_tpscomplet" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_tbpsychoan_hospi_tpscomplet_motif",
    text: "Motif d'hospitalisation",
    type: "single_choice",
    required: false,
    options: HOSPITALISATION_MOTIF_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_hospi_tpscomplet" }, "Oui"] },
    indentLevel: 1,
  },

  // Prise en charge non medicamenteuse
  {
    id: "section_non_medicamenteux_12mois",
    text: "Prise en charge non medicamenteuse",
    type: "section",
    required: false,
  },
  {
    id: "rad_tbpsychoan_modpec_nonmed",
    text: "Changement de prise en charge non medicamenteuse",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS_LOWER,
  },
  {
    id: "chk_tbpsychoan_modpec_nonmed_tcc",
    text: "Approche TCC",
    type: "multiple_choice",
    required: false,
    options: START_END_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec_nonmed" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "chk_tbpsychoan_modpec_nonmed_remed",
    text: "Remediation des fonctions cognitives",
    type: "multiple_choice",
    required: false,
    options: START_END_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec_nonmed" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "chk_tbpsychoan_modpec_nonmed_psychody",
    text: "Approche psychodynamique",
    type: "multiple_choice",
    required: false,
    options: START_END_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec_nonmed" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "chk_tbpsychoan_modpec_nonmed_fam",
    text: "Approche familiale",
    type: "multiple_choice",
    required: false,
    options: START_END_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec_nonmed" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "tbpsychoan_modpec_nonmed_autre",
    text: "Autres (preciser)",
    type: "text",
    required: false,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec_nonmed" }, "Oui"] },
    indentLevel: 1,
  },

  // Aide a la prise de traitement
  {
    id: "section_aide_prise_traitement_12mois",
    text: "Aide a la prise de traitement",
    type: "section",
    required: false,
  },
  {
    id: "chk_aide_prise_tt",
    text: "Aide a la prise de traitement",
    type: "multiple_choice",
    required: false,
    options: AIDE_PRISE_TRAITEMENT_OPTIONS,
  },

  {
    id: "rad_tbpsychoan_ts",
    text: "Presence de tentatives de suicide au cours de l'annee ecoulee",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS_LOWER,
  },
  {
    id: "rad_tbpsychoan_ts_nb",
    text: "Nombre de tentatives de suicide au cours de l'annee ecoulee",
    type: "single_choice",
    required: false,
    options: HOSPITALISATIONS_NB_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_ts" }, "Oui"] },
    indentLevel: 1,
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
    target_role?: "patient" | "healthcare_professional";
    [key: string]: any;
  };
}

export const TROUBLES_PSYCHOTIQUES_INITIAL_DEFINITION: QuestionnaireDefinition = {
  id: "troubles_psychotiques_initial",
  code: "TROUBLES_PSYCHOTIQUES_INITIAL",
  title: "Troubles psychotiques (initial)",
  description:
    "Evaluation complete des troubles psychotiques incluant la classification des troubles, les caracteristiques vie entiere, l'inventaire des symptomes (positifs et negatifs), l'historique des episodes, les hospitalisations, le mode evolutif et le suivi annuel.",
  instructions:
    "Ce questionnaire doit etre administre par un clinicien forme. Evaluer systematiquement chaque section. Periode de reference: Vie entiere et 12 derniers mois.",
  questions: TROUBLES_PSYCHOTIQUES_INITIAL_QUESTIONS,
  metadata: {
    singleColumn: false,
    pathologies: ["schizophrenia"],
    target_role: "healthcare_professional",
    version: "1.0",
    language: "fr-FR",
  },
};
