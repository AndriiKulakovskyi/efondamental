// eFondaMental Platform - Troubles Psychotiques Annual Assessment
// Annual follow-up section focused on psychotic disorder characteristics
// over the past 12 months: mode evolutif, episodes, hospitalizations,
// treatment changes, medication adherence, suicide attempts, substance use, OCD

import { Question, QuestionOption } from "@/lib/types/database.types";

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaTroublesPsychotiquesAnnuelResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Mode evolutif
  rad_symptomeevo_mode: string | null;
  // Psychotic episodes
  rad_tbpsychoan: string | null;
  // Hospitalisation temps complet
  rad_tbpsychoan_hospi_tpscomplet: string | null;
  rad_tbpsychoan_hospi_tpscomplet_nb: string | null;
  rad_tbpsychoan_hospi_tpscomplet_duree: string | null;
  rad_tbpsychoan_hospi_tpscomplet_motif: string | null;
  tbpsychoan_hospi_tpscomplet_motifautre: string | null;
  // Hospitalisation de jour
  rad_tbpsychoan_hospi_jour: string | null;
  rad_tbpsychoan_hospi_jour_nb: string | null;
  rad_tbpsychoan_hospi_jour_duree: string | null;
  rad_tbpsychoan_hospi_jour_motif: string | null;
  tbpsychoan_hospi_jour_motifautre: string | null;
  // Changement de prise en charge
  rad_tbpsychoan_modpec: string | null;
  chk_tbpsychoan_modpec_cmp: string[] | null;
  chk_tbpsychoan_modpec_rythme: string[] | null;
  chk_tbpsychoan_modpec_hp: string[] | null;
  chk_tbpsychoan_modpec_cattp: string[] | null;
  tbpsychoan_modpec_autre: string | null;
  rad_tbpsychoan_modpec_med: string | null;
  rad_tbpsychoan_modpec_nonmed: string | null;
  chk_tbpsychoan_modpec_nonmed_tcc: string[] | null;
  chk_tbpsychoan_modpec_nonmed_remed: string[] | null;
  chk_tbpsychoan_modpec_nonmed_psychody: string[] | null;
  chk_tbpsychoan_modpec_nonmed_fam: string[] | null;
  tbpsychoan_modpec_nonmed_autre: string | null;
  // Aide prise traitement
  chk_aide_prise_tt: string[] | null;
  rad_aide_prise_tt_hospi: string | null;
  // Tentatives de suicide
  rad_tbpsychoan_ts: string | null;
  rad_tbpsychoan_ts_nb: string | null;
  // Prise de toxiques
  rad_tbpsychoan_substance: string | null;
  chk_tbpsychoan_substance_type: string[] | null;
  rad_tbpsychoan_substance_alcoolconso: string | null;
  date_tbpsychoan_substance_alcooldern: string | null;
  rad_tbpsychoan_substance_canaconso: string | null;
  date_tbpsychoan_substance_canadern: string | null;
  rad_tbpsychoan_substance_opiaceconso: string | null;
  date_tbpsychoan_substance_opiacedern: string | null;
  rad_tbpsychoan_substance_cacaineconso: string | null;
  date_tbpsychoan_substance_cocainedern: string | null;
  rad_tbpsychoan_substance_hallucinoconso: string | null;
  date_tbpsychoan_substance_hallucinodern: string | null;
  tbpsychoan_substance_autre: string | null;
  // OCD
  rad_trouble_compulsif: string | null;
  // Metadata
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaTroublesPsychotiquesAnnuelResponseInsert = Omit<
  SchizophreniaTroublesPsychotiquesAnnuelResponse,
  "id" | "created_at" | "updated_at" | "completed_at"
>;

// ============================================================================
// Shared Option Sets
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

const COUNT_0_TO_20_OPTIONS: QuestionOption[] = [
  { code: "Ne sais pas", label: "Ne sais pas" },
  ...Array.from({ length: 21 }, (_, i) => ({
    code: String(i),
    label: String(i),
  })),
  { code: ">20", label: ">20" },
];

const WEEKS_0_TO_52_OPTIONS: QuestionOption[] = [
  { code: "Ne sais pas", label: "Ne sais pas" },
  ...Array.from({ length: 53 }, (_, i) => ({
    code: String(i),
    label: String(i),
  })),
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

const CARE_CHANGE_OPTIONS: QuestionOption[] = [
  { code: "Debut", label: "Debut" },
  { code: "Augmente", label: "Augmente" },
  { code: "Diminue", label: "Diminue" },
  { code: "Fin", label: "Fin" },
];

const START_END_OPTIONS: QuestionOption[] = [
  { code: "Debut", label: "Debut" },
  { code: "Fin", label: "Fin" },
];

const AIDE_PRISE_TRAITEMENT_OPTIONS: QuestionOption[] = [
  { code: "Autonome", label: "Autonome" },
  { code: "Aide familiale", label: "Aide familiale" },
  { code: "Aide au CMP ou a l'hopital", label: "Aide au CMP ou a l'hopital" },
  { code: "IDE au domicile", label: "IDE au domicile" },
];

const PERIODICITE_OPTIONS: QuestionOption[] = [
  { code: "Quotidienne", label: "Quotidienne" },
  { code: "Hebdomadaire", label: "Hebdomadaire" },
  { code: "Bimensuelle", label: "Bimensuelle" },
  { code: "Mensuelle", label: "Mensuelle" },
];

const SUBSTANCE_TYPE_OPTIONS: QuestionOption[] = [
  { code: "Alcool", label: "Alcool" },
  { code: "Cannabis", label: "Cannabis" },
  { code: "Opiaces", label: "Opiacés" },
  { code: "Cocaine", label: "Cocaïne" },
  { code: "Hallucinogene", label: "Hallucinogène" },
  { code: "Autres", label: "Autres" },
];

// ============================================================================
// Questions
// ============================================================================

export const TROUBLES_PSYCHOTIQUES_ANNUEL_QUESTIONS: Question[] = [
  // ── 1. Mode evolutif ──────────────────────────────────────────────────
  {
    id: "section_mode_evolutif",
    text: "Mode evolutif",
    type: "section",
    required: false,
  },
  {
    id: "rad_symptomeevo_mode",
    text: "Mode evolutif",
    type: "single_choice",
    required: false,
    options: EVOLUTIONARY_MODE_OPTIONS,
    help: "Specifications pour l'evolution de la schizophrenie: choisir le mode qui correspond le mieux au parcours du patient.",
  },

  // ── 2. Caracteristiques du trouble au cours des 12 derniers mois ──────
  {
    id: "section_caracteristiques_12mois",
    text: "Caracteristiques du trouble au cours des 12 derniers mois",
    type: "section",
    required: false,
  },
  {
    id: "rad_tbpsychoan",
    text: "Presence d'au moins un episode psychotique au cours de l'annee",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },

  // ── 3. Hospitalisations ───────────────────────────────────────────────
  {
    id: "section_hospitalisations",
    text: "Hospitalisation au cours de l'annee ecoulee",
    type: "section",
    required: false,
  },

  // 3a. Full-time hospitalisations
  {
    id: "rad_tbpsychoan_hospi_tpscomplet",
    text: "Hospitalisations a temps complet au cours de l'annee ecoulee",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_tbpsychoan_hospi_tpscomplet_nb",
    text: "Nombre d'hospitalisations au cours de l'annee ecoulee",
    type: "single_choice",
    required: false,
    options: COUNT_0_TO_20_OPTIONS,
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
  {
    id: "tbpsychoan_hospi_tpscomplet_motifautre",
    text: "Autre motif d'hospitalisation a temps complet (preciser)",
    type: "text",
    required: false,
    display_if: {
      "==": [{ var: "rad_tbpsychoan_hospi_tpscomplet_motif" }, "Autres"],
    },
    indentLevel: 2,
  },

  // 3b. Day hospitalisations
  {
    id: "rad_tbpsychoan_hospi_jour",
    text: "Hospitalisations de jour au cours de l'annee ecoulee",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_tbpsychoan_hospi_jour_nb",
    text: "Nombre d'hospitalisations de jour",
    type: "single_choice",
    required: false,
    options: COUNT_0_TO_20_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_hospi_jour" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_tbpsychoan_hospi_jour_duree",
    text: "Duree totale des hospitalisations de jour (en semaines)",
    type: "single_choice",
    required: false,
    options: WEEKS_0_TO_52_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_hospi_jour" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_tbpsychoan_hospi_jour_motif",
    text: "Motif d'hospitalisation de jour",
    type: "single_choice",
    required: false,
    options: HOSPITALISATION_MOTIF_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_hospi_jour" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "tbpsychoan_hospi_jour_motifautre",
    text: "Autre motif d'hospitalisation de jour (preciser)",
    type: "text",
    required: false,
    display_if: {
      "==": [{ var: "rad_tbpsychoan_hospi_jour_motif" }, "Autres"],
    },
    indentLevel: 2,
  },

  // ── 4. Changement de prise en charge ──────────────────────────────────
  {
    id: "section_changement_pec",
    text: "Changement de prise en charge",
    type: "section",
    required: false,
  },
  {
    id: "rad_tbpsychoan_modpec",
    text: "Changement de prise en charge au cours de l'annee ecoulee",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },

  // 4a. Care type changes
  {
    id: "section_changement_type_pec",
    text: "Changement du type de prise en charge",
    type: "section",
    required: false,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec" }, "Oui"] },
  },
  {
    id: "chk_tbpsychoan_modpec_cmp",
    text: "CMP",
    type: "multiple_choice",
    required: false,
    options: CARE_CHANGE_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "chk_tbpsychoan_modpec_rythme",
    text: "Rythme de consultations",
    type: "multiple_choice",
    required: false,
    options: CARE_CHANGE_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "chk_tbpsychoan_modpec_hp",
    text: "Hospitalisation partielle",
    type: "multiple_choice",
    required: false,
    options: CARE_CHANGE_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "chk_tbpsychoan_modpec_cattp",
    text: "CATTP (Centre d'Activite Therapeutique a Temps Partiel)",
    type: "multiple_choice",
    required: false,
    options: CARE_CHANGE_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "tbpsychoan_modpec_autre",
    text: "Autre type de prise en charge (preciser)",
    type: "text",
    required: false,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec" }, "Oui"] },
    indentLevel: 1,
  },

  // 4b. Pharmacological treatment change
  {
    id: "rad_tbpsychoan_modpec_med",
    text: "Changement de traitement medicamenteux",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec" }, "Oui"] },
    indentLevel: 1,
  },

  // 4c. Non-pharmacological treatment change
  {
    id: "rad_tbpsychoan_modpec_nonmed",
    text: "Changement de prise en charge non medicamenteuse",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "chk_tbpsychoan_modpec_nonmed_tcc",
    text: "Approche TCC",
    type: "multiple_choice",
    required: false,
    options: START_END_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec_nonmed" }, "Oui"] },
    indentLevel: 2,
  },
  {
    id: "chk_tbpsychoan_modpec_nonmed_remed",
    text: "Remediation des fonctions cognitives",
    type: "multiple_choice",
    required: false,
    options: START_END_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec_nonmed" }, "Oui"] },
    indentLevel: 2,
  },
  {
    id: "chk_tbpsychoan_modpec_nonmed_psychody",
    text: "Approche psychodynamique",
    type: "multiple_choice",
    required: false,
    options: START_END_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec_nonmed" }, "Oui"] },
    indentLevel: 2,
  },
  {
    id: "chk_tbpsychoan_modpec_nonmed_fam",
    text: "Approche familiale",
    type: "multiple_choice",
    required: false,
    options: START_END_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec_nonmed" }, "Oui"] },
    indentLevel: 2,
  },
  {
    id: "tbpsychoan_modpec_nonmed_autre",
    text: "Autres (preciser)",
    type: "text",
    required: false,
    display_if: { "==": [{ var: "rad_tbpsychoan_modpec_nonmed" }, "Oui"] },
    indentLevel: 2,
  },

  // ── 5. Aide a la prise de traitement ──────────────────────────────────
  {
    id: "section_aide_prise_tt",
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
    id: "rad_aide_prise_tt_hospi",
    text: "Periodicite",
    type: "single_choice",
    required: false,
    options: PERIODICITE_OPTIONS,
    display_if: { in: ["Aide au CMP ou a l'hopital", { var: "chk_aide_prise_tt" }] },
    indentLevel: 1,
  },

  // ── 6. Tentatives de suicide ──────────────────────────────────────────
  {
    id: "section_tentatives_suicide",
    text: "Tentatives de suicide au cours de l'annee ecoulee",
    type: "section",
    required: false,
  },
  {
    id: "rad_tbpsychoan_ts",
    text: "Presence de tentatives de suicide au cours de l'annee ecoulee",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "rad_tbpsychoan_ts_nb",
    text: "Nombre de tentatives de suicide au cours de l'annee ecoulee",
    type: "single_choice",
    required: false,
    options: COUNT_0_TO_20_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_ts" }, "Oui"] },
    indentLevel: 1,
  },

  // ── 7. Prise de toxiques ──────────────────────────────────────────────
  {
    id: "section_prise_toxiques",
    text: "Prise de toxiques au cours de l'annee ecoulee",
    type: "section",
    required: false,
  },
  {
    id: "rad_tbpsychoan_substance",
    text: "Prise des toxiques au cours de l'annee ecoulee",
    type: "single_choice",
    required: false,
    options: YES_NO_UNKNOWN_OPTIONS,
  },
  {
    id: "chk_tbpsychoan_substance_type",
    text: "Type de substance",
    type: "multiple_choice",
    required: false,
    options: SUBSTANCE_TYPE_OPTIONS,
    display_if: { "==": [{ var: "rad_tbpsychoan_substance" }, "Oui"] },
    indentLevel: 1,
  },

  // 7a. Alcohol
  {
    id: "section_substance_alcool",
    text: "Alcool",
    type: "section",
    required: false,
    display_if: { in: ["Alcool", { var: "chk_tbpsychoan_substance_type" }] },
  },
  {
    id: "rad_tbpsychoan_substance_alcoolconso",
    text: "Evaluation de la consommation moyenne par jour (en verre)",
    type: "single_choice",
    required: false,
    options: COUNT_0_TO_20_OPTIONS,
    display_if: { in: ["Alcool", { var: "chk_tbpsychoan_substance_type" }] },
    indentLevel: 1,
    help: "Equivalents: 1 petit verre whisky = 1 verre; 1 bouteille vin = 6 verres; 1 bouteille biere = 1 verre; 1 carton (six pack) = 6 verres.",
  },
  {
    id: "date_tbpsychoan_substance_alcooldern",
    text: "Date de la derniere prise",
    type: "date",
    required: false,
    display_if: { in: ["Alcool", { var: "chk_tbpsychoan_substance_type" }] },
    indentLevel: 1,
  },

  // 7b. Cannabis
  {
    id: "section_substance_cannabis",
    text: "Cannabis",
    type: "section",
    required: false,
    display_if: { in: ["Cannabis", { var: "chk_tbpsychoan_substance_type" }] },
  },
  {
    id: "rad_tbpsychoan_substance_canaconso",
    text: "Evaluation de la consommation moyenne par jour (en joint)",
    type: "single_choice",
    required: false,
    options: COUNT_0_TO_20_OPTIONS,
    display_if: { in: ["Cannabis", { var: "chk_tbpsychoan_substance_type" }] },
    indentLevel: 1,
  },
  {
    id: "date_tbpsychoan_substance_canadern",
    text: "Date de la derniere prise",
    type: "date",
    required: false,
    display_if: { in: ["Cannabis", { var: "chk_tbpsychoan_substance_type" }] },
    indentLevel: 1,
  },

  // 7c. Opioids
  {
    id: "section_substance_opiaces",
    text: "Opiaces",
    type: "section",
    required: false,
    display_if: { in: ["Opiaces", { var: "chk_tbpsychoan_substance_type" }] },
  },
  {
    id: "rad_tbpsychoan_substance_opiaceconso",
    text: "Evaluation de la consommation moyenne par jour (nombre de prises)",
    type: "single_choice",
    required: false,
    options: COUNT_0_TO_20_OPTIONS,
    display_if: { in: ["Opiaces", { var: "chk_tbpsychoan_substance_type" }] },
    indentLevel: 1,
  },
  {
    id: "date_tbpsychoan_substance_opiacedern",
    text: "Date de la derniere prise",
    type: "date",
    required: false,
    display_if: { in: ["Opiaces", { var: "chk_tbpsychoan_substance_type" }] },
    indentLevel: 1,
  },

  // 7d. Cocaine
  {
    id: "section_substance_cocaine",
    text: "Cocaine",
    type: "section",
    required: false,
    display_if: { in: ["Cocaine", { var: "chk_tbpsychoan_substance_type" }] },
  },
  {
    id: "rad_tbpsychoan_substance_cacaineconso",
    text: "Evaluation de la consommation moyenne par jour (nombre de prises)",
    type: "single_choice",
    required: false,
    options: COUNT_0_TO_20_OPTIONS,
    display_if: { in: ["Cocaine", { var: "chk_tbpsychoan_substance_type" }] },
    indentLevel: 1,
  },
  {
    id: "date_tbpsychoan_substance_cocainedern",
    text: "Date de la derniere prise",
    type: "date",
    required: false,
    display_if: { in: ["Cocaine", { var: "chk_tbpsychoan_substance_type" }] },
    indentLevel: 1,
  },

  // 7e. Hallucinogens
  {
    id: "section_substance_hallucinogene",
    text: "Hallucinogene",
    type: "section",
    required: false,
    display_if: {
      in: ["Hallucinogene", { var: "chk_tbpsychoan_substance_type" }],
    },
  },
  {
    id: "rad_tbpsychoan_substance_hallucinoconso",
    text: "Evaluation de la consommation moyenne par jour (nombre de prises)",
    type: "single_choice",
    required: false,
    options: COUNT_0_TO_20_OPTIONS,
    display_if: {
      in: ["Hallucinogene", { var: "chk_tbpsychoan_substance_type" }],
    },
    indentLevel: 1,
  },
  {
    id: "date_tbpsychoan_substance_hallucinodern",
    text: "Date de la derniere prise",
    type: "date",
    required: false,
    display_if: {
      in: ["Hallucinogene", { var: "chk_tbpsychoan_substance_type" }],
    },
    indentLevel: 1,
  },

  // 7f. Other substances
  {
    id: "tbpsychoan_substance_autre",
    text: "Autres (specifier)",
    type: "text",
    required: false,
    display_if: { in: ["Autres", { var: "chk_tbpsychoan_substance_type" }] },
    indentLevel: 1,
  },

  // ── 8. Symptomes obsessionnels compulsifs ─────────────────────────────
  {
    id: "section_ocd",
    text: "Symptomes obsessionnels compulsifs",
    type: "section",
    required: false,
  },
  {
    id: "rad_trouble_compulsif",
    text: "Le patient presente-t-il des symptomes obsessionnels compulsifs ?",
    type: "single_choice",
    required: false,
    options: YES_NO_OPTIONS,
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

export const TROUBLES_PSYCHOTIQUES_ANNUEL_DEFINITION: QuestionnaireDefinition = {
  id: "troubles_psychotiques_annuel",
  code: "TROUBLES_PSYCHOTIQUES_ANNUEL",
  title: "Troubles psychotiques (annuel)",
  description:
    "Suivi annuel des troubles psychotiques: mode evolutif, episodes, hospitalisations, changements de prise en charge, aide a la prise de traitement, tentatives de suicide, prise de toxiques et symptomes obsessionnels compulsifs au cours des 12 derniers mois.",
  instructions:
    "Ce questionnaire doit etre administre par un clinicien forme. Periode de reference: 12 derniers mois.",
  questions: TROUBLES_PSYCHOTIQUES_ANNUEL_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ["schizophrenia"],
    target_role: "healthcare_professional",
    version: "1.0",
    language: "fr-FR",
  },
};
