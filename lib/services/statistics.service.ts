// eFondaMental Platform - Statistics Service

import { createClient } from '../supabase/server';
import { PathologyType } from '../types/enums';

// ============================================================================
// PROFESSIONAL STATISTICS
// ============================================================================

export interface ProfessionalStats {
  totalPatients: number;
  activePatientsThisMonth: number;
  visitsThisMonth: number;
  completedVisitsThisMonth: number;
  pendingQuestionnaires: number;
  averageVisitDuration: number | null;
  visitCompletionRate: number;
}

export async function getProfessionalStatistics(
  professionalId: string,
  centerId: string,
  pathology?: PathologyType,
  fromDate?: string,
  toDate?: string
): Promise<ProfessionalStats> {
  const supabase = await createClient();

  // Default to current month if no dates provided
  const now = new Date();
  const startOfMonth = fromDate || new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = toDate || new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

  // Total patients assigned to this professional
  let patientQuery = supabase
    .from('patients')
    .select('id', { count: 'exact', head: true })
    .eq('center_id', centerId)
    .eq('created_by', professionalId)
    .eq('active', true);

  if (pathology) {
    const { data: pathologyData } = await supabase
      .from('pathologies')
      .select('id')
      .eq('type', pathology)
      .single();
    
    if (pathologyData) {
      patientQuery = patientQuery.eq('pathology_id', pathologyData.id);
    }
  }

  const { count: totalPatients } = await patientQuery;

  // Patients with visits this month
  const { data: patientsWithVisits } = await supabase
    .from('visits')
    .select('patient_id', { count: 'exact' })
    .eq('conducted_by', professionalId)
    .gte('scheduled_date', startOfMonth)
    .lte('scheduled_date', endOfMonth);

  const activePatientsThisMonth = new Set(patientsWithVisits?.map(v => v.patient_id) || []).size;

  // Visits this month
  const { count: visitsThisMonth } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .eq('conducted_by', professionalId)
    .gte('scheduled_date', startOfMonth)
    .lte('scheduled_date', endOfMonth);

  // Completed visits this month
  const { count: completedVisitsThisMonth } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .eq('conducted_by', professionalId)
    .eq('status', 'completed')
    .gte('scheduled_date', startOfMonth)
    .lte('scheduled_date', endOfMonth);

  // Pending questionnaires
  // NOTE: With the new schema, calculating pending questionnaires globally is expensive.
  // For now, we return 0 to avoid breaking the dashboard.
  // Future improvement: Implement a cached counter or efficient query view.
  const pendingQuestionnaires = 0;

  // Visit completion rate
  const visitCompletionRate = visitsThisMonth 
    ? ((completedVisitsThisMonth || 0) / visitsThisMonth) * 100 
    : 0;

  return {
    totalPatients: totalPatients || 0,
    activePatientsThisMonth,
    visitsThisMonth: visitsThisMonth || 0,
    completedVisitsThisMonth: completedVisitsThisMonth || 0,
    pendingQuestionnaires,
    averageVisitDuration: null, // Would need visit duration tracking
    visitCompletionRate: Math.round(visitCompletionRate),
  };
}

// ============================================================================
// CENTER STATISTICS
// ============================================================================

export interface CenterStats {
  totalPatients: number;
  activePatients: number;
  totalProfessionals: number;
  activeProfessionals: number;
  visitsThisMonth: number;
  completedVisitsThisMonth: number;
  visitCompletionRate: number;
  pathologyBreakdown: {
    pathology: PathologyType;
    patientCount: number;
    visitCount: number;
  }[];
}

export async function getCenterStatistics(
  centerId: string,
  fromDate?: string,
  toDate?: string
): Promise<CenterStats> {
  const supabase = await createClient();

  const now = new Date();
  const startOfMonth = fromDate || new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = toDate || new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

  // Total and active patients
  const { count: totalPatients } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })
    .eq('center_id', centerId);

  const { count: activePatients } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })
    .eq('center_id', centerId)
    .eq('active', true);

  // Total and active professionals
  const { count: totalProfessionals } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('center_id', centerId)
    .eq('role', 'healthcare_professional');

  const { count: activeProfessionals } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('center_id', centerId)
    .eq('role', 'healthcare_professional')
    .eq('active', true);

  // Visits this month
  const { data: visits } = await supabase
    .from('visits')
    .select('*, patient:patients!inner(center_id)')
    .eq('patient.center_id', centerId)
    .gte('scheduled_date', startOfMonth)
    .lte('scheduled_date', endOfMonth);

  const visitsThisMonth = visits?.length || 0;
  const completedVisitsThisMonth = visits?.filter(v => v.status === 'completed').length || 0;
  const visitCompletionRate = visitsThisMonth 
    ? Math.round((completedVisitsThisMonth / visitsThisMonth) * 100)
    : 0;

  // Pathology breakdown
  const { data: pathologies } = await supabase
    .from('pathologies')
    .select('*');

  const pathologyBreakdown = await Promise.all(
    (pathologies || []).map(async (pathology) => {
      const { count: patientCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .eq('center_id', centerId)
        .eq('pathology_id', pathology.id)
        .eq('active', true);

      const { data: pathologyVisits } = await supabase
        .from('visits')
        .select('*, patient:patients!inner(center_id, pathology_id)')
        .eq('patient.center_id', centerId)
        .eq('patient.pathology_id', pathology.id)
        .gte('scheduled_date', startOfMonth)
        .lte('scheduled_date', endOfMonth);

      return {
        pathology: pathology.type as PathologyType,
        patientCount: patientCount || 0,
        visitCount: pathologyVisits?.length || 0,
      };
    })
  );

  return {
    totalPatients: totalPatients || 0,
    activePatients: activePatients || 0,
    totalProfessionals: totalProfessionals || 0,
    activeProfessionals: activeProfessionals || 0,
    visitsThisMonth,
    completedVisitsThisMonth,
    visitCompletionRate,
    pathologyBreakdown: pathologyBreakdown.filter(p => p.patientCount > 0 || p.visitCount > 0),
  };
}

// ============================================================================
// VISIT TYPE STATISTICS
// ============================================================================

export interface VisitTypeStats {
  visitType: string;
  count: number;
  completedCount: number;
  averageDuration: number | null;
}

export async function getVisitTypeStatistics(
  centerId: string,
  professionalId?: string,
  fromDate?: string,
  toDate?: string
): Promise<VisitTypeStats[]> {
  const supabase = await createClient();

  const now = new Date();
  const startOfMonth = fromDate || new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const endOfMonth = toDate || new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

  let query = supabase
    .from('visits')
    .select('visit_type, status, patient:patients!inner(center_id)')
    .eq('patient.center_id', centerId)
    .gte('scheduled_date', startOfMonth)
    .lte('scheduled_date', endOfMonth);

  if (professionalId) {
    query = query.eq('conducted_by', professionalId);
  }

  const { data: visits } = await query;

  // Group by visit type
  const groupedByType = (visits || []).reduce((acc: Record<string, any>, visit) => {
    if (!acc[visit.visit_type]) {
      acc[visit.visit_type] = {
        count: 0,
        completedCount: 0,
      };
    }
    acc[visit.visit_type].count++;
    if (visit.status === 'completed') {
      acc[visit.visit_type].completedCount++;
    }
    return acc;
  }, {});

  return Object.entries(groupedByType).map(([visitType, stats]: [string, any]) => ({
    visitType,
    count: stats.count,
    completedCount: stats.completedCount,
    averageDuration: null,
  }));
}
