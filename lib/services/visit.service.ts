// eFondaMental Platform - Visit Service

import { createClient } from '../supabase/server';
import {
  Visit,
  VisitInsert,
  VisitUpdate,
  VisitFull,
} from '../types/database.types';
import { VisitType, VisitStatus } from '../types/enums';

// ============================================================================
// VISIT CRUD
// ============================================================================

export async function getVisitById(visitId: string): Promise<VisitFull | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('v_visits_full')
    .select('*')
    .eq('id', visitId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to fetch visit: ${error.message}`);
  }

  return data;
}

export async function createVisit(visit: VisitInsert): Promise<Visit> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('visits')
    .insert(visit)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create visit: ${error.message}`);
  }

  return data;
}

export async function updateVisit(
  visitId: string,
  updates: VisitUpdate
): Promise<Visit> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('visits')
    .update(updates)
    .eq('id', visitId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update visit: ${error.message}`);
  }

  return data;
}

export async function deleteVisit(visitId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('visits')
    .delete()
    .eq('id', visitId);

  if (error) {
    throw new Error(`Failed to delete visit: ${error.message}`);
  }
}

// ============================================================================
// VISIT STATUS MANAGEMENT
// ============================================================================

export async function startVisit(visitId: string, conductedBy: string): Promise<Visit> {
  return updateVisit(visitId, {
    status: VisitStatus.IN_PROGRESS,
    conducted_by: conductedBy,
  });
}

export async function completeVisit(visitId: string): Promise<Visit> {
  return updateVisit(visitId, {
    status: VisitStatus.COMPLETED,
    completed_date: new Date().toISOString(),
  });
}

export async function cancelVisit(visitId: string): Promise<Visit> {
  return updateVisit(visitId, {
    status: VisitStatus.CANCELLED,
  });
}

export async function rescheduleVisit(
  visitId: string,
  newDate: string
): Promise<Visit> {
  return updateVisit(visitId, {
    scheduled_date: newDate,
    status: VisitStatus.SCHEDULED,
  });
}

// ============================================================================
// VISIT QUERIES
// ============================================================================

export async function getVisitsByPatient(patientId: string): Promise<VisitFull[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('v_visits_full')
    .select('*')
    .eq('patient_id', patientId)
    .order('scheduled_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch visits by patient: ${error.message}`);
  }

  return data || [];
}

export async function getUpcomingVisitsByPatient(
  patientId: string
): Promise<VisitFull[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('v_visits_full')
    .select('*')
    .eq('patient_id', patientId)
    .eq('status', VisitStatus.SCHEDULED)
    .gte('scheduled_date', new Date().toISOString())
    .order('scheduled_date', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch upcoming visits: ${error.message}`);
  }

  return data || [];
}

export async function getVisitsByProfessional(
  professionalId: string,
  status?: VisitStatus
): Promise<VisitFull[]> {
  const supabase = await createClient();

  let query = supabase
    .from('v_visits_full')
    .select('*')
    .eq('conducted_by', professionalId);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('scheduled_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch visits by professional: ${error.message}`);
  }

  return data || [];
}

export async function getUpcomingVisitsByCenter(
  centerId: string,
  limit?: number
): Promise<VisitFull[]> {
  const supabase = await createClient();

  // Query visits and join with patients to filter by center
  let query = supabase
    .from('visits')
    .select('*, patient:patients!inner(center_id, first_name, last_name, medical_record_number), visit_template:visit_templates(name, pathology:pathologies(name))')
    .eq('patient.center_id', centerId)
    .eq('status', VisitStatus.SCHEDULED)
    .gte('scheduled_date', new Date().toISOString())
    .order('scheduled_date', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch upcoming visits: ${error.message}`);
  }

  // Map to VisitFull format
  return (data || []).map((v: any) => ({
    ...v,
    patient_first_name: v.patient?.first_name,
    patient_last_name: v.patient?.last_name,
    medical_record_number: v.patient?.medical_record_number,
    template_name: v.visit_template?.name,
    pathology_name: v.visit_template?.pathology?.name,
  })) as VisitFull[];
}

// ============================================================================
// VISIT MODULES
// ============================================================================

export async function getVisitModules(visitId: string) {
  const supabase = await createClient();

  // Get visit details
  const { data: visit } = await supabase
    .from('visits')
    .select('visit_template_id')
    .eq('id', visitId)
    .single();

  if (!visit) {
    throw new Error('Visit not found');
  }

  // Get modules for this visit template
  const { data: modules, error } = await supabase
    .from('modules')
    .select('*')
    .eq('visit_template_id', visit.visit_template_id)
    .eq('active', true)
    .order('order_index');

  if (error) {
    throw new Error(`Failed to fetch visit modules: ${error.message}`);
  }

  return modules || [];
}

export async function getVisitModuleQuestionnaires(moduleId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('questionnaires')
    .select('*')
    .eq('module_id', moduleId)
    .eq('active', true)
    .order('created_at');

  if (error) {
    throw new Error(`Failed to fetch module questionnaires: ${error.message}`);
  }

  return data || [];
}

// ============================================================================
// VISIT COMPLETION STATUS
// ============================================================================

export async function getVisitCompletionStatus(visitId: string) {
  const supabase = await createClient();

  const modules = await getVisitModules(visitId);
  let totalQuestionnaires = 0;
  let completedQuestionnaires = 0;

  for (const module of modules) {
    const questionnaires = await getVisitModuleQuestionnaires(module.id);
    totalQuestionnaires += questionnaires.length;

    for (const questionnaire of questionnaires) {
      const { data: response } = await supabase
        .from('questionnaire_responses')
        .select('id')
        .eq('visit_id', visitId)
        .eq('questionnaire_id', questionnaire.id)
        .eq('status', 'completed')
        .single();

      if (response) {
        completedQuestionnaires++;
      }
    }
  }

  return {
    totalModules: modules.length,
    totalQuestionnaires,
    completedQuestionnaires,
    completionPercentage:
      totalQuestionnaires > 0
        ? Math.round((completedQuestionnaires / totalQuestionnaires) * 100)
        : 0,
  };
}

// ============================================================================
// VISIT STATISTICS
// ============================================================================

export async function getVisitStats(centerId: string, fromDate?: string, toDate?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('visits')
    .select('*, patient:patients!inner(center_id)')
    .eq('patient.center_id', centerId);

  if (fromDate) {
    query = query.gte('scheduled_date', fromDate);
  }

  if (toDate) {
    query = query.lte('scheduled_date', toDate);
  }

  const { data: visits, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch visit stats: ${error.message}`);
  }

  const stats = {
    total: visits?.length || 0,
    scheduled: visits?.filter((v) => v.status === VisitStatus.SCHEDULED).length || 0,
    inProgress: visits?.filter((v) => v.status === VisitStatus.IN_PROGRESS).length || 0,
    completed: visits?.filter((v) => v.status === VisitStatus.COMPLETED).length || 0,
    cancelled: visits?.filter((v) => v.status === VisitStatus.CANCELLED).length || 0,
    byType: {} as Record<VisitType, number>,
  };

  // Count by visit type
  for (const visitType of Object.values(VisitType)) {
    stats.byType[visitType] =
      visits?.filter((v) => v.visit_type === visitType).length || 0;
  }

  return stats;
}

