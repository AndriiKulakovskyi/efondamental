// eFondaMental Platform - Comportements Violents Assessment
// Annual follow-up section evaluating violent behaviors over the past 12 months.
// Covers four categories: verbal, physical, sexual, and property destruction.
// Each follows a gate-question branching pattern with type, police, and conviction sub-fields.

import { Question, QuestionOption } from "@/lib/types/database.types";

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaComportementsViolentsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Violence verbale
  rad_compviolent_verbale: string | null;
  chk_compviolent_verbale_type: string[] | null;
  rad_compviolent_verbale_police: string | null;
  rad_compviolent_verbale_condamnation: string | null;
  chk_compviolent_verbale_condamnation_preciser: string[] | null;
  // Violence physique
  rad_compviolent_physique: string | null;
  rad_compviolent_physique_coup: string | null;
  chk_compviolent_physique_coup_arme: string[] | null;
  rad_compviolent_physique_coup_soin: string | null;
  chk_compviolent_physique_type: string[] | null;
  rad_compviolent_physique_police: string | null;
  rad_compviolent_physique_condamnation: string | null;
  chk_compviolent_physique_condamnation_preciser: string[] | null;
  // Violence sexuelle
  rad_compviolent_sexuelle: string | null;
  chk_compviolent_sexuelle_preciser: string[] | null;
  chk_compviolent_sexuelle_type: string[] | null;
  rad_compviolent_sexuelle_police: string | null;
  rad_compviolent_sexuelle_condamnation: string | null;
  chk_compviolent_sexuelle_condamnation_preciser: string[] | null;
  // Bris d'objet
  rad_compviolent_bris: string | null;
  chk_compviolent_bris_type: string[] | null;
  rad_compviolent_bris_police: string | null;
  rad_compviolent_bris_condamnation: string | null;
  chk_compviolent_bris_condamnation_preciser: string[] | null;
  // Metadata
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaComportementsViolentsResponseInsert = Omit<
  SchizophreniaComportementsViolentsResponse,
  "id" | "created_at" | "updated_at" | "completed_at"
>;

// ============================================================================
// Shared Option Sets
// ============================================================================

const YES_NO_OPTIONS: QuestionOption[] = [
  { code: "Oui", label: "Oui" },
  { code: "Non", label: "Non" },
];

const VIOLENCE_TYPE_OPTIONS: QuestionOption[] = [
  { code: "Intrafamiliale", label: "Intrafamiliale" },
  { code: "Extrafamiliale", label: "Extrafamiliale" },
];

const CONDAMNATION_PRECISER_OPTIONS: QuestionOption[] = [
  { code: "Amende", label: "Amende" },
  { code: "Sursis", label: "Sursis" },
  { code: "Prison", label: "Prison" },
];

const ARME_OPTIONS: QuestionOption[] = [
  { code: "Sans arme", label: "Sans arme" },
  { code: "Arme blanche", label: "Arme blanche" },
  { code: "Arme à feu", label: "Arme à feu" },
];

const VIOLENCE_SEXUELLE_PRECISER_OPTIONS: QuestionOption[] = [
  { code: "Viol", label: "Viol" },
  { code: "Attouchements", label: "Attouchements" },
];

// ============================================================================
// Questions
// ============================================================================

export const COMPORTEMENTS_VIOLENTS_SZ_QUESTIONS: Question[] = [
  // ── 1. Violence verbale ─────────────────────────────────────────────────
  {
    id: "section_violence_verbale",
    text: "Violence verbale",
    type: "section",
    required: false,
  },
  {
    id: "rad_compviolent_verbale",
    text: "Violence verbale",
    type: "single_choice",
    required: false,
    options: YES_NO_OPTIONS,
  },
  {
    id: "chk_compviolent_verbale_type",
    text: "Type",
    type: "multiple_choice",
    required: false,
    options: VIOLENCE_TYPE_OPTIONS,
    display_if: { "==": [{ var: "rad_compviolent_verbale" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_compviolent_verbale_police",
    text: "Intervention de la police",
    type: "single_choice",
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { "==": [{ var: "rad_compviolent_verbale" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_compviolent_verbale_condamnation",
    text: "Condamnation",
    type: "single_choice",
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { "==": [{ var: "rad_compviolent_verbale" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "chk_compviolent_verbale_condamnation_preciser",
    text: "Préciser",
    type: "multiple_choice",
    required: false,
    options: CONDAMNATION_PRECISER_OPTIONS,
    display_if: {
      "==": [{ var: "rad_compviolent_verbale_condamnation" }, "Oui"],
    },
    indentLevel: 2,
  },

  // ── 2. Violence physique ────────────────────────────────────────────────
  {
    id: "section_violence_physique",
    text: "Violence physique",
    type: "section",
    required: false,
  },
  {
    id: "rad_compviolent_physique",
    text: "Violence physique",
    type: "single_choice",
    required: false,
    options: YES_NO_OPTIONS,
  },
  {
    id: "rad_compviolent_physique_coup",
    text: "Coups et blessures",
    type: "single_choice",
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { "==": [{ var: "rad_compviolent_physique" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "chk_compviolent_physique_coup_arme",
    text: "Arme",
    type: "multiple_choice",
    required: false,
    options: ARME_OPTIONS,
    display_if: {
      "==": [{ var: "rad_compviolent_physique_coup" }, "Oui"],
    },
    indentLevel: 2,
  },
  {
    id: "rad_compviolent_physique_coup_soin",
    text: "Ayant entraîné des soins chez le tiers",
    type: "single_choice",
    required: false,
    options: YES_NO_OPTIONS,
    display_if: {
      "==": [{ var: "rad_compviolent_physique_coup" }, "Oui"],
    },
    indentLevel: 2,
  },
  {
    id: "chk_compviolent_physique_type",
    text: "Type",
    type: "multiple_choice",
    required: false,
    options: VIOLENCE_TYPE_OPTIONS,
    display_if: { "==": [{ var: "rad_compviolent_physique" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_compviolent_physique_police",
    text: "Intervention de la police",
    type: "single_choice",
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { "==": [{ var: "rad_compviolent_physique" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_compviolent_physique_condamnation",
    text: "Condamnation",
    type: "single_choice",
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { "==": [{ var: "rad_compviolent_physique" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "chk_compviolent_physique_condamnation_preciser",
    text: "Préciser",
    type: "multiple_choice",
    required: false,
    options: CONDAMNATION_PRECISER_OPTIONS,
    display_if: {
      "==": [{ var: "rad_compviolent_physique_condamnation" }, "Oui"],
    },
    indentLevel: 2,
  },

  // ── 3. Violence sexuelle ────────────────────────────────────────────────
  {
    id: "section_violence_sexuelle",
    text: "Violence sexuelle",
    type: "section",
    required: false,
  },
  {
    id: "rad_compviolent_sexuelle",
    text: "Violence sexuelle",
    type: "single_choice",
    required: false,
    options: YES_NO_OPTIONS,
  },
  {
    id: "chk_compviolent_sexuelle_preciser",
    text: "Préciser",
    type: "multiple_choice",
    required: false,
    options: VIOLENCE_SEXUELLE_PRECISER_OPTIONS,
    display_if: { "==": [{ var: "rad_compviolent_sexuelle" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "chk_compviolent_sexuelle_type",
    text: "Type",
    type: "multiple_choice",
    required: false,
    options: VIOLENCE_TYPE_OPTIONS,
    display_if: { "==": [{ var: "rad_compviolent_sexuelle" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_compviolent_sexuelle_police",
    text: "Intervention de la police",
    type: "single_choice",
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { "==": [{ var: "rad_compviolent_sexuelle" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_compviolent_sexuelle_condamnation",
    text: "Condamnation",
    type: "single_choice",
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { "==": [{ var: "rad_compviolent_sexuelle" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "chk_compviolent_sexuelle_condamnation_preciser",
    text: "Préciser",
    type: "multiple_choice",
    required: false,
    options: CONDAMNATION_PRECISER_OPTIONS,
    display_if: {
      "==": [{ var: "rad_compviolent_sexuelle_condamnation" }, "Oui"],
    },
    indentLevel: 2,
  },

  // ── 4. Bris d'objet ────────────────────────────────────────────────────
  {
    id: "section_bris_objet",
    text: "Bris d'objet",
    type: "section",
    required: false,
  },
  {
    id: "rad_compviolent_bris",
    text: "Bris d'objet",
    type: "single_choice",
    required: false,
    options: YES_NO_OPTIONS,
  },
  {
    id: "chk_compviolent_bris_type",
    text: "Type",
    type: "multiple_choice",
    required: false,
    options: VIOLENCE_TYPE_OPTIONS,
    display_if: { "==": [{ var: "rad_compviolent_bris" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_compviolent_bris_police",
    text: "Intervention de la police",
    type: "single_choice",
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { "==": [{ var: "rad_compviolent_bris" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "rad_compviolent_bris_condamnation",
    text: "Condamnation",
    type: "single_choice",
    required: false,
    options: YES_NO_OPTIONS,
    display_if: { "==": [{ var: "rad_compviolent_bris" }, "Oui"] },
    indentLevel: 1,
  },
  {
    id: "chk_compviolent_bris_condamnation_preciser",
    text: "Préciser",
    type: "multiple_choice",
    required: false,
    options: CONDAMNATION_PRECISER_OPTIONS,
    display_if: {
      "==": [{ var: "rad_compviolent_bris_condamnation" }, "Oui"],
    },
    indentLevel: 2,
  },
];

// ============================================================================
// Definition
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

export const COMPORTEMENTS_VIOLENTS_SZ_DEFINITION: QuestionnaireDefinition = {
  id: "comportements_violents_sz",
  code: "COMPORTEMENTS_VIOLENTS_SZ",
  title: "Comportements violents",
  description:
    "Evaluation des comportements violents au cours des 12 derniers mois: violence verbale, physique, sexuelle et bris d'objet. Chaque categorie evalue le type (intrafamiliale/extrafamiliale), l'intervention policiere et les condamnations.",
  instructions:
    "Ce questionnaire doit etre administre par un clinicien forme. Periode de reference: 12 derniers mois.",
  questions: COMPORTEMENTS_VIOLENTS_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ["schizophrenia"],
    target_role: "healthcare_professional",
    version: "1.0",
    language: "fr-FR",
  },
};
