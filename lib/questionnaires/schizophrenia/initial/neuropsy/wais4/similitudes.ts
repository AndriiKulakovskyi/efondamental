// ============================================================================
// eFondaMental Platform - WAIS-IV Similitudes Subtest
// Schizophrenia Initial Evaluation - Neuropsy Module - WAIS-IV Subgroup
// Verbal comprehension subtest assessing abstract verbal reasoning
// ============================================================================

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaWais4SimilitudesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Demographics for scoring (silently injected from patient profile)
  patient_age?: number | null;
  
  // Test status
  test_done: boolean;
  
  // 18 item scores (0-2 each)
  item_1: number | null;   // Framboise-Groseille
  item_2: number | null;   // Cheval-Tigre
  item_3: number | null;   // Carottes-Epinards
  item_4: number | null;   // Jaune-Bleu
  item_5: number | null;   // Piano-Tambour
  item_6: number | null;   // Poème-Statue
  item_7: number | null;   // Bourgeon-Bébé
  item_8: number | null;   // Miel-Lait
  item_9: number | null;   // Nourriture-Carburant
  item_10: number | null;  // Cube-Cylindre
  item_11: number | null;  // Nez-Langue
  item_12: number | null;  // Soie-Laine
  item_13: number | null;  // Éolienne-Barrage
  item_14: number | null;  // Éphémère-Permanent
  item_15: number | null;  // Inondation-Sécheresse
  item_16: number | null;  // Sédentaire-Nomade
  item_17: number | null;  // Autoriser-Interdire
  item_18: number | null;  // Réalité-Rêve
  
  // Computed scores
  total_raw_score: number | null;     // Sum of all items (0-36)
  standard_score: number | null;       // Age-adjusted standard score (1-19)
  standardized_value: number | null;   // Z-score: (standard_score - 10) / 3
  
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaWais4SimilitudesResponseInsert = Omit<
  SchizophreniaWais4SimilitudesResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  'total_raw_score' | 'standard_score' | 'standardized_value'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Conditions
// ============================================================================

// Show item questions only when test is done
const SHOW_WHEN_TEST_DONE = { '==': [{ 'var': 'test_done' }, 'oui'] };

// ============================================================================
// Response Options (0-2 scoring)
// ============================================================================

const SIMILITUDES_OPTIONS = [
  { code: 0, label: '0 - Réponse incorrecte ou sans rapport', score: 0 },
  { code: 1, label: '1 - Réponse partiellement correcte', score: 1 },
  { code: 2, label: '2 - Réponse correcte (catégorie abstraite)', score: 2 },
];

// ============================================================================
// Item Definitions
// ============================================================================

const SIMILITUDES_ITEMS = [
  { id: 'item_1', label: '1. Framboise - Groseille', category: 'Fruits/Berries' },
  { id: 'item_2', label: '2. Cheval - Tigre', category: 'Animals' },
  { id: 'item_3', label: '3. Carottes - Épinards', category: 'Vegetables' },
  { id: 'item_4', label: '4. Jaune - Bleu', category: 'Colors' },
  { id: 'item_5', label: '5. Piano - Tambour', category: 'Musical instruments' },
  { id: 'item_6', label: '6. Poème - Statue', category: 'Art forms' },
  { id: 'item_7', label: '7. Bourgeon - Bébé', category: 'Beginnings/Growth' },
  { id: 'item_8', label: '8. Miel - Lait', category: 'Foods/Fluids' },
  { id: 'item_9', label: '9. Nourriture - Carburant', category: 'Energy sources' },
  { id: 'item_10', label: '10. Cube - Cylindre', category: 'Geometric shapes' },
  { id: 'item_11', label: '11. Nez - Langue', category: 'Sensory organs' },
  { id: 'item_12', label: '12. Soie - Laine', category: 'Fabrics/Textiles' },
  { id: 'item_13', label: '13. Éolienne - Barrage', category: 'Energy production' },
  { id: 'item_14', label: '14. Éphémère - Permanent', category: 'Abstract concepts - Time' },
  { id: 'item_15', label: '15. Inondation - Sécheresse', category: 'Natural phenomena' },
  { id: 'item_16', label: '16. Sédentaire - Nomade', category: 'Lifestyle/Living patterns' },
  { id: 'item_17', label: '17. Autoriser - Interdire', category: 'Abstract concepts - Permission' },
  { id: 'item_18', label: '18. Réalité - Rêve', category: 'Abstract concepts - States of mind' },
];

// ============================================================================
// Questions Dictionary
// ============================================================================

export const WAIS4_SIMILITUDES_SZ_QUESTIONS: Question[] = [
  // Note: patient_age is silently injected from patient profile
  // and used for age-based normative scoring. It is not displayed in the form.
  
  // Test done toggle
  {
    id: 'test_done',
    text: 'Test fait',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui', score: 0 },
      { code: 'non', label: 'Non', score: 0 },
    ],
  },
  
  // Instructions
  {
    id: 'instructions_header',
    section: 'Instructions',
    text: 'Le patient doit identifier ce que deux mots/concepts ont en commun. Cotation : 0 = réponse incorrecte, 1 = réponse concrète ou partielle, 2 = catégorie abstraite correcte.',
    type: 'instruction',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
  },
  
  // Example item (not scored)
  {
    id: 'example_header',
    section: 'Exemple',
    text: 'Exemple : Deux - Sept (Réponse attendue : Ce sont des chiffres/nombres)',
    type: 'instruction',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
  },
  
  // Generate all 18 item questions
  ...SIMILITUDES_ITEMS.map((item) => ({
    id: item.id,
    section: 'Items',
    text: item.label,
    type: 'single_choice' as const,
    required: true,
    options: SIMILITUDES_OPTIONS,
    display_if: SHOW_WHEN_TEST_DONE,
    help: `Catégorie abstraite : ${item.category}`,
  })),
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
    reference?: string;
    [key: string]: unknown;
  };
}

export const WAIS4_SIMILITUDES_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'wais4_similitudes_sz',
  code: 'WAIS4_SIMILITUDES_SZ',
  title: 'WAIS-IV Subtest Similitudes',
  description: 'Subtest de compréhension verbale évaluant le raisonnement verbal abstrait par la pensée analogique. Le patient identifie les similitudes conceptuelles entre deux mots/concepts.',
  instructions: 'Pour chaque paire de mots, demandez au patient : "En quoi [mot 1] et [mot 2] se ressemblent-ils ?" ou "Qu\'ont-ils en commun ?". Cotez la réponse selon le niveau d\'abstraction : 0 pour une réponse incorrecte, 1 pour une réponse concrète ou partielle, 2 pour une catégorie abstraite correcte.',
  questions: WAIS4_SIMILITUDES_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    reference: 'WAIS-IV (Wechsler, 2008)',
    scoringNote: 'Score brut total (0-36) → Note standard (1-19) via table normative selon l\'âge → Valeur standardisée (z-score) = (Note standard - 10) / 3',
    contributes_to: ['ICV', 'QI'],
    interpretation: {
      standard_score_ranges: {
        very_superior: '≥16',
        superior: '14-15',
        high_average: '12-13',
        average: '8-11',
        low_average: '6-7',
        borderline: '4-5',
        extremely_low: '1-3',
      },
      clinical_significance: 'Les scores bas peuvent indiquer des difficultés de raisonnement abstrait, de formation de concepts verbaux ou d\'intelligence cristallisée. Souvent affectés dans la schizophrénie.',
    },
  },
};
