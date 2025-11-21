// eFondaMental Platform - Center Service

import { createClient } from '../supabase/server';
import { Center, CenterInsert, CenterUpdate, Pathology } from '../types/database.types';
import { PathologyType } from '../types/enums';

// ============================================================================
// CENTER CRUD
// ============================================================================

export async function getAllCenters(): Promise<Center[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('centers')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch centers: ${error.message}`);
  }

  return data || [];
}

export async function getActiveCenters(): Promise<Center[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('centers')
    .select('*')
    .eq('active', true)
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch active centers: ${error.message}`);
  }

  return data || [];
}

export async function getCenterById(centerId: string): Promise<Center | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('centers')
    .select('*')
    .eq('id', centerId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch center: ${error.message}`);
  }

  return data;
}

export async function createCenter(center: CenterInsert): Promise<Center> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('centers')
    .insert(center)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create center: ${error.message}`);
  }

  return data;
}

export async function updateCenter(
  centerId: string,
  updates: CenterUpdate
): Promise<Center> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('centers')
    .update(updates)
    .eq('id', centerId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update center: ${error.message}`);
  }

  return data;
}

export async function deleteCenter(centerId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('centers')
    .delete()
    .eq('id', centerId);

  if (error) {
    throw new Error(`Failed to delete center: ${error.message}`);
  }
}

export async function deactivateCenter(centerId: string): Promise<void> {
  await updateCenter(centerId, { active: false });
}

export async function activateCenter(centerId: string): Promise<void> {
  await updateCenter(centerId, { active: true });
}

// ============================================================================
// PATHOLOGY MANAGEMENT
// ============================================================================

export async function getCenterPathologies(centerId: string): Promise<Pathology[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('center_pathologies')
    .select('pathology:pathologies(*)')
    .eq('center_id', centerId);

  if (error) {
    throw new Error(`Failed to fetch center pathologies: ${error.message}`);
  }

  return data?.map((cp: any) => cp.pathology).filter(Boolean) || [];
}

export async function addPathologyToCenter(
  centerId: string,
  pathologyId: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('center_pathologies')
    .insert({
      center_id: centerId,
      pathology_id: pathologyId,
    });

  if (error) {
    throw new Error(`Failed to add pathology to center: ${error.message}`);
  }
}

export async function removePathologyFromCenter(
  centerId: string,
  pathologyId: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('center_pathologies')
    .delete()
    .eq('center_id', centerId)
    .eq('pathology_id', pathologyId);

  if (error) {
    throw new Error(`Failed to remove pathology from center: ${error.message}`);
  }
}

export async function setCenterPathologies(
  centerId: string,
  pathologyIds: string[]
): Promise<void> {
  const supabase = await createClient();

  // Remove all existing pathologies
  await supabase
    .from('center_pathologies')
    .delete()
    .eq('center_id', centerId);

  // Add new pathologies
  if (pathologyIds.length > 0) {
    const { error } = await supabase
      .from('center_pathologies')
      .insert(
        pathologyIds.map((pathologyId) => ({
          center_id: centerId,
          pathology_id: pathologyId,
        }))
      );

    if (error) {
      throw new Error(`Failed to set center pathologies: ${error.message}`);
    }
  }
}

// ============================================================================
// PATHOLOGY QUERIES
// ============================================================================

export async function getAllPathologies(): Promise<Pathology[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pathologies')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch pathologies: ${error.message}`);
  }

  return data || [];
}

export async function getPathologyByType(type: PathologyType): Promise<Pathology | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('pathologies')
    .select('*')
    .eq('type', type)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch pathology: ${error.message}`);
  }

  return data;
}

// ============================================================================
// CENTER STATISTICS
// ============================================================================

export async function getCenterStats(centerId: string) {
  const supabase = await createClient();

  const [
    patientCountResult,
    userCountResult,
    totalVisitsResult,
    completedVisitsResult,
    scheduledVisitsResult
  ] = await Promise.all([
    // Get patient count
    supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('center_id', centerId)
      .eq('active', true),

    // Get user count
    supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('center_id', centerId)
      .eq('active', true),

    // Get total visit counts
    supabase
      .from('visits')
      .select('*, patient:patients!inner(center_id)', {
        count: 'exact',
        head: true,
      })
      .eq('patient.center_id', centerId),

    // Get completed visits
    supabase
      .from('visits')
      .select('*, patient:patients!inner(center_id)', {
        count: 'exact',
        head: true,
      })
      .eq('patient.center_id', centerId)
      .eq('status', 'completed'),

    // Get scheduled visits (upcoming)
    supabase
      .from('visits')
      .select('*, patient:patients!inner(center_id)', {
        count: 'exact',
        head: true,
      })
      .eq('patient.center_id', centerId)
      .eq('status', 'scheduled')
      .gte('scheduled_date', new Date().toISOString())
  ]);

  return {
    patientCount: patientCountResult.count || 0,
    userCount: userCountResult.count || 0,
    totalVisits: totalVisitsResult.count || 0,
    completedVisits: completedVisitsResult.count || 0,
    scheduledVisits: scheduledVisitsResult.count || 0,
  };
}

