'use server';

import { createClient } from '@/lib/supabase/server';
import { parseTapRtfContent, type TapParseResult } from '@/lib/utils/tap-rtf-parser';
import type {
  AttentionSoutenueRow,
  FlexibiliteRow,
  SchizophreniaTapResponse,
} from '@/lib/questionnaires/schizophrenia/initial/neuropsy/tap/types';

export async function parseTapRtfAction(fileContent: string): Promise<{
  success: boolean;
  data?: TapParseResult;
  error?: string;
}> {
  try {
    const result = parseTapRtfContent(fileContent);
    if (!result) {
      return { success: false, error: 'Impossible de détecter le type de test TAP dans le fichier.' };
    }
    return { success: true, data: result };
  } catch (err) {
    console.error('[TAP RTF Parse Error]', err);
    return { success: false, error: 'Erreur lors de l\'analyse du fichier RTF.' };
  }
}

export async function saveTapResponse(params: {
  visitId: string;
  patientId: string;
  age?: number | null;
  attention_examinateur?: string | null;
  attention_date_passation?: string | null;
  attention_normes?: string | null;
  attention_type_test?: string | null;
  attention_results: AttentionSoutenueRow[];
  flexibilite_examinateur?: string | null;
  flexibilite_date_passation?: string | null;
  flexibilite_normes?: string | null;
  flexibilite_type_test?: string | null;
  flexibilite_results: FlexibiliteRow[];
  flexibilite_index_prestation_valeur?: number | null;
  flexibilite_index_prestation_percentile?: number | null;
  flexibilite_index_speed_accuracy_valeur?: number | null;
  flexibilite_index_speed_accuracy_percentile?: number | null;
}): Promise<{ success: boolean; data?: SchizophreniaTapResponse; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('schizophrenia_tap')
      .upsert({
        visit_id: params.visitId,
        patient_id: params.patientId,
        age: params.age ?? null,
        attention_examinateur: params.attention_examinateur ?? null,
        attention_date_passation: params.attention_date_passation ?? null,
        attention_normes: params.attention_normes ?? null,
        attention_type_test: params.attention_type_test ?? 'Couleur ou forme',
        attention_results: params.attention_results,
        flexibilite_examinateur: params.flexibilite_examinateur ?? null,
        flexibilite_date_passation: params.flexibilite_date_passation ?? null,
        flexibilite_normes: params.flexibilite_normes ?? null,
        flexibilite_type_test: params.flexibilite_type_test ?? 'Alternance lettres et chiffres',
        flexibilite_results: params.flexibilite_results,
        flexibilite_index_prestation_valeur: params.flexibilite_index_prestation_valeur ?? null,
        flexibilite_index_prestation_percentile: params.flexibilite_index_prestation_percentile ?? null,
        flexibilite_index_speed_accuracy_valeur: params.flexibilite_index_speed_accuracy_valeur ?? null,
        flexibilite_index_speed_accuracy_percentile: params.flexibilite_index_speed_accuracy_percentile ?? null,
        completed_by: user?.id,
      }, { onConflict: 'visit_id' })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: data as SchizophreniaTapResponse };
  } catch (err) {
    console.error('[TAP Save Error]', err);
    return { success: false, error: 'Erreur lors de la sauvegarde des données TAP.' };
  }
}
