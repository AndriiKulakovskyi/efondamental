// eFondaMental Platform - Social Questionnaire Service
// Service functions for social evaluation questionnaire

import { createClient } from '@/lib/supabase/server';
import {
  SocialResponse,
  SocialResponseInsert
} from '@/lib/types/database.types';

// ============================================================================
// Social Questionnaire
// ============================================================================

export async function getSocialResponse(
  visitId: string
): Promise<SocialResponse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bipolar_social')
    .select('*')
    .eq('visit_id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No data found
    if (error.code === 'PGRST205') {
      // Table doesn't exist yet - migration not applied
      console.warn(`Table bipolar_social not found. Please run migrations.`);
      return null;
    }
    throw error;
  }
  return data;
}

export async function saveSocialResponse(
  response: SocialResponseInsert
): Promise<SocialResponse> {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  // No scoring for social questionnaire - it's purely informational
  const { data, error } = await supabase
    .from('bipolar_social')
    .upsert({
      ...response,
      completed_by: user.data.user?.id
    }, { onConflict: 'visit_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}
