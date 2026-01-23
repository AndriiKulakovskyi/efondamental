// eFondaMental Platform - WAIS-III Vocabulaire (Vocabulary)
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarWais3VocabulaireResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Items 1-33 (each scored 0, 1, or 2)
  item1: number | null;
  item2: number | null;
  item3: number | null;
  item4: number | null;
  item5: number | null;
  item6: number | null;
  item7: number | null;
  item8: number | null;
  item9: number | null;
  item10: number | null;
  item11: number | null;
  item12: number | null;
  item13: number | null;
  item14: number | null;
  item15: number | null;
  item16: number | null;
  item17: number | null;
  item18: number | null;
  item19: number | null;
  item20: number | null;
  item21: number | null;
  item22: number | null;
  item23: number | null;
  item24: number | null;
  item25: number | null;
  item26: number | null;
  item27: number | null;
  item28: number | null;
  item29: number | null;
  item30: number | null;
  item31: number | null;
  item32: number | null;
  item33: number | null;
  // Scores
  raw_score: number | null;
  scaled_score: number | null;
  percentile: number | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarWais3VocabulaireResponseInsert = Omit<
  BipolarWais3VocabulaireResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'raw_score' | 'scaled_score' | 'percentile'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

const ITEM_OPTIONS = [
  { code: 0, label: '0', score: 0 },
  { code: 1, label: '1', score: 1 },
  { code: 2, label: '2', score: 2 }
];

const VOCABULARY_WORDS = [
  'Bateau', 'Fauteuil', 'Bol', 'Instruire', 'Hier', 'Arracher', 'Sanction', 'Refuge',
  'Calendrier', 'Baleine', 'Mime', 'Persévérer', 'Sauvage', 'Héréditaire', 'Connivence',
  'Grandiose', 'Confier', 'Vigoureux', 'Contracter', 'Initiative', 'Esquisse', 'Irritable',
  'Invectiver', 'Hétérogène', 'Assimiler', 'Concertation', 'Emulation', 'Pittoresque',
  'Evasif', 'Elaborer', 'Prosaïque', 'Apologie', 'Conjecture'
];

function createVocabularyItem(num: number): Question {
  return {
    id: `item${num}`,
    text: `Note pour l'item ${num} - ${VOCABULARY_WORDS[num - 1]}`,
    type: 'single_choice',
    required: true,
    options: ITEM_OPTIONS
  };
}

export const WAIS3_VOCABULAIRE_QUESTIONS: Question[] = [
  // Patient demographics section
  {
    id: 'patient_age',
    text: 'Âge du patient (calculé automatiquement)',
    type: 'number',
    required: true,
    readonly: true,
    section: 'Données démographiques',
    min: 16,
    max: 120,
    help: 'Calculé automatiquement à partir de la date de naissance et de la date de visite'
  },
  // Vocabulary items section
  {
    id: 'section_items',
    text: 'Items de vocabulaire',
    type: 'section',
    required: false
  },
  ...Array.from({ length: 33 }, (_, i) => createVocabularyItem(i + 1))
];

// ============================================================================
// Scoring
// ============================================================================

export function computeWais3VocabulaireRawScore(responses: Record<string, number>): number {
  let total = 0;
  for (let i = 1; i <= 33; i++) {
    total += responses[`item${i}`] || 0;
  }
  return total;
}

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

export const WAIS3_VOCABULAIRE_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_vocabulaire',
  code: 'WAIS3_VOCABULAIRE',
  title: 'WAIS-III - Subtest Vocabulaire',
  description: 'Subtest Vocabulaire de la WAIS-III (Wechsler, 1997) - Évaluation des connaissances lexicales.\n\n**Règles d\'administration WAIS-III:**\n• Pour les 16 ans et plus : Commencer à l\'item 4 (Instruire)\n• **Règle de retour :** Si les items 4-7 ne sont pas tous parfaits (2 points), administrer les items 1-3 en ordre inverse\n• **Crédit automatique :** Les items avant le point de départ non administrés reçoivent 2 points chacun\n• **Arrêt :** Discontinuer après 6 scores consécutifs de 0\n• Entrer manuellement les scores selon ces règles (le système calcule la somme)',
  questions: WAIS3_VOCABULAIRE_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
