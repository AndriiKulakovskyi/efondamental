// eFondaMental Platform - TEA/TAP Types
// Schizophrenia Initial Evaluation - Neuropsy Module
// Test of Attentional Performance (Zimmermann & Fimm)

export interface TapTestMetadata {
  examinateur: string | null;
  date_passation: string | null;
  age: number | null;
  normes: string | null;
}

export interface AttentionSoutenueRow {
  condition: string;
  moyenne: number | null;
  mediane: number | null;
  percentile_mediane: number | null;
  ecart_type: number | null;
  percentile_et: number | null;
  correctes: number | null;
  fausses: number | null;
  percentile_fausses: number | null;
  omises: number | null;
  percentile_omises: number | null;
  aberrantes: number | null;
}

export interface FlexibiliteRow {
  condition: string;
  moyenne: number | null;
  mediane: number | null;
  percentile_mediane: number | null;
  ecart_type: number | null;
  percentile_et: number | null;
  correctes: number | null;
  fausses: number | null;
  percentile_fausses: number | null;
  aberrantes: number | null;
}

export interface FlexibiliteGlobalIndices {
  index_prestation_valeur: number | null;
  index_prestation_percentile: number | null;
  index_speed_accuracy_valeur: number | null;
  index_speed_accuracy_percentile: number | null;
}

export interface SchizophreniaTapResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  age: number | null;
  attention_examinateur: string | null;
  attention_date_passation: string | null;
  attention_normes: string | null;
  attention_type_test: string | null;
  attention_results: AttentionSoutenueRow[];
  flexibilite_examinateur: string | null;
  flexibilite_date_passation: string | null;
  flexibilite_normes: string | null;
  flexibilite_type_test: string | null;
  flexibilite_results: FlexibiliteRow[];
  flexibilite_index_prestation_valeur: number | null;
  flexibilite_index_prestation_percentile: number | null;
  flexibilite_index_speed_accuracy_valeur: number | null;
  flexibilite_index_speed_accuracy_percentile: number | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaTapResponseInsert = Omit<
  SchizophreniaTapResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

export const ATTENTION_SOUTENUE_CONDITIONS = [
  '0-5 min.',
  '5-10 min.',
  '10-15 min.',
  'total',
] as const;

export const FLEXIBILITE_CONDITIONS = [
  'Avec changement de main',
  'Sans changement de main',
  'Lettres',
  'Chiffres',
  'Total',
] as const;

export const ATTENTION_SOUTENUE_COLUMNS = [
  { key: 'condition', label: 'Condition', type: 'string' },
  { key: 'moyenne', label: 'Moyenne', type: 'number', unit: 'ms' },
  { key: 'mediane', label: 'Médiane', type: 'number', unit: 'ms' },
  { key: 'percentile_mediane', label: '%', type: 'number' },
  { key: 'ecart_type', label: 'Écart-type', type: 'number' },
  { key: 'percentile_et', label: '%', type: 'number' },
  { key: 'correctes', label: 'Correctes', type: 'number' },
  { key: 'fausses', label: 'Fausses', type: 'number' },
  { key: 'percentile_fausses', label: '%', type: 'number' },
  { key: 'omises', label: 'Omises', type: 'number' },
  { key: 'percentile_omises', label: '%', type: 'number' },
  { key: 'aberrantes', label: 'Aberrantes', type: 'number' },
] as const;

export const FLEXIBILITE_COLUMNS = [
  { key: 'condition', label: 'Condition', type: 'string' },
  { key: 'moyenne', label: 'Moyenne', type: 'number', unit: 'ms' },
  { key: 'mediane', label: 'Médiane', type: 'number', unit: 'ms' },
  { key: 'percentile_mediane', label: '%', type: 'number' },
  { key: 'ecart_type', label: 'Écart-type', type: 'number' },
  { key: 'percentile_et', label: '%', type: 'number' },
  { key: 'correctes', label: 'Correctes', type: 'number' },
  { key: 'fausses', label: 'Fausses', type: 'number' },
  { key: 'percentile_fausses', label: '%', type: 'number' },
  { key: 'aberrantes', label: 'Aberrantes', type: 'number' },
] as const;

export function createEmptyAttentionRow(condition: string): AttentionSoutenueRow {
  return {
    condition,
    moyenne: null, mediane: null, percentile_mediane: null,
    ecart_type: null, percentile_et: null,
    correctes: null, fausses: null, percentile_fausses: null,
    omises: null, percentile_omises: null, aberrantes: null,
  };
}

export function createEmptyFlexibiliteRow(condition: string): FlexibiliteRow {
  return {
    condition,
    moyenne: null, mediane: null, percentile_mediane: null,
    ecart_type: null, percentile_et: null,
    correctes: null, fausses: null, percentile_fausses: null,
    aberrantes: null,
  };
}
