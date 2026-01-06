// eFondaMental Platform - Analytics Service

import { createClient } from '../supabase/server';
import { PathologyType } from '../types/enums';

// ============================================================================
// GLOBAL STATISTICS
// ============================================================================

export async function getGlobalStatistics() {
  const supabase = await createClient();

  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);
  const firstDayISO = firstDayOfMonth.toISOString();

  const [
    totalCentersResult,
    activeCentersResult,
    totalPatientsResult,
    activePatientsResult,
    visitsThisMonthResult,
    completedVisitsThisMonthResult,
    totalProfessionalsResult,
    activeProfessionalsResult
  ] = await Promise.all([
    // Total centers
    supabase
      .from('centers')
      .select('*', { count: 'exact', head: true }),

    // Active centers
    supabase
      .from('centers')
      .select('*', { count: 'exact', head: true })
      .eq('active', true),

    // Total patients
    supabase
      .from('patients')
      .select('*', { count: 'exact', head: true }),

    // Active patients
    supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('active', true),

    // Visits this month
    supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .gte('scheduled_date', firstDayISO),

    // Completed visits this month
    supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .gte('scheduled_date', firstDayISO)
      .eq('status', 'completed'),

    // Total professionals
    supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .in('role', ['healthcare_professional', 'manager']),

    // Active professionals
    supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .in('role', ['healthcare_professional', 'manager'])
      .eq('active', true)
  ]);

  return {
    totalCenters: totalCentersResult.count || 0,
    activeCenters: activeCentersResult.count || 0,
    totalPatients: totalPatientsResult.count || 0,
    activePatients: activePatientsResult.count || 0,
    visitsThisMonth: visitsThisMonthResult.count || 0,
    completedVisitsThisMonth: completedVisitsThisMonthResult.count || 0,
    totalProfessionals: totalProfessionalsResult.count || 0,
    activeProfessionals: activeProfessionalsResult.count || 0,
  };
}

// ============================================================================
// CENTER ANALYTICS
// ============================================================================

export async function getCenterAnalytics(centerId: string) {
  const supabase = await createClient();

  const [patientsByPathologyResult, totalVisitsResult, completedVisitsResult] = await Promise.all([
    // Patient count by pathology
    supabase
      .from('patients')
      .select('pathology_id, pathologies(type, name)')
      .eq('center_id', centerId)
      .eq('active', true),

    // Total visits
    supabase
      .from('visits')
      .select('*, patient:patients!inner(center_id)', {
        count: 'exact',
        head: true,
      })
      .eq('patient.center_id', centerId),

    // Completed visits
    supabase
      .from('visits')
      .select('*, patient:patients!inner(center_id)', {
        count: 'exact',
        head: true,
      })
      .eq('patient.center_id', centerId)
      .eq('status', 'completed')
  ]);

  const pathologyBreakdown = patientsByPathologyResult.data?.reduce((acc, p: any) => {
    const type = p.pathologies?.type;
    if (type) {
      acc[type] = (acc[type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalVisits = totalVisitsResult.count || 0;
  const completedVisits = completedVisitsResult.count || 0;
  const completionRate =
    totalVisits > 0
      ? Math.round((completedVisits / totalVisits) * 100)
      : 0;

  return {
    pathologyBreakdown,
    totalVisits,
    completedVisits,
    completionRate,
  };
}

// ============================================================================
// PATIENT ANALYTICS
// ============================================================================

export async function getPatientTimeline(patientId: string) {
  const supabase = await createClient();

  const { data: visits } = await supabase
    .from('v_visits_full')
    .select('*')
    .eq('patient_id', patientId)
    .order('scheduled_date', { ascending: true });

  return visits || [];
}

export async function getPatientMoodTrend(patientId: string) {
  // Mood trend analysis disabled in current version due to schema refactor
  return [];
}

export async function getPatientRiskHistory(patientId: string) {
  const supabase = await createClient();

  const { data: evaluations } = await supabase
    .from('evaluations')
    .select('evaluation_date, risk_assessment')
    .eq('patient_id', patientId)
    .order('evaluation_date', { ascending: true });

  return (
    evaluations?.map((e) => ({
      date: e.evaluation_date,
      suicideRisk: e.risk_assessment?.suicide_risk || 'none',
      relapseRisk: e.risk_assessment?.relapse_risk || 'none',
    })) || []
  );
}

// ============================================================================
// PROFESSIONAL ANALYTICS
// ============================================================================

export async function getProfessionalWorkload(
  professionalId: string,
  fromDate?: string,
  toDate?: string
) {
  const supabase = await createClient();

  let query = supabase
    .from('visits')
    .select('*')
    .eq('conducted_by', professionalId);

  if (fromDate) {
    query = query.gte('scheduled_date', fromDate);
  }

  if (toDate) {
    query = query.lte('scheduled_date', toDate);
  }

  const { data: visits } = await query;

  const stats = {
    totalVisits: visits?.length || 0,
    completedVisits: visits?.filter((v) => v.status === 'completed').length || 0,
    scheduledVisits: visits?.filter((v) => v.status === 'scheduled').length || 0,
    cancelledVisits: visits?.filter((v) => v.status === 'cancelled').length || 0,
  };

  return stats;
}

export async function getProfessionalPatientCount(professionalId: string) {
  const supabase = await createClient();

  const { count } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })
    .eq('created_by', professionalId)
    .eq('active', true);

  return count || 0;
}

// ============================================================================
// PATHOLOGY LANDING PAGE STATISTICS
// ============================================================================

export interface PathologyLandingStats {
  pathologyType: PathologyType;
  activePatients: number;
  newPatientsThisMonth: number;
}

/**
 * Fetches statistics for all pathologies in a center for the landing page.
 * Returns active patient count and new patient enrollments this month per pathology.
 */
export async function getPathologyLandingStats(
  centerId: string
): Promise<PathologyLandingStats[]> {
  const supabase = await createClient();

  // Calculate first day of current month
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);
  const firstDayISO = firstDayOfMonth.toISOString();

  // Fetch all active patients with their pathology info in a single query
  const { data: patients, error } = await supabase
    .from('patients')
    .select('pathology_id, created_at, pathologies(type)')
    .eq('center_id', centerId)
    .eq('active', true);

  if (error) {
    console.error('Error fetching pathology landing stats:', error);
    return [];
  }

  // Group patients by pathology type
  const statsMap = new Map<PathologyType, { active: number; newThisMonth: number }>();

  patients?.forEach((patient: any) => {
    const pathologyType = patient.pathologies?.type as PathologyType;
    if (!pathologyType) return;

    if (!statsMap.has(pathologyType)) {
      statsMap.set(pathologyType, { active: 0, newThisMonth: 0 });
    }

    const stats = statsMap.get(pathologyType)!;
    stats.active++;

    // Check if patient was created this month
    if (patient.created_at && patient.created_at >= firstDayISO) {
      stats.newThisMonth++;
    }
  });

  // Convert map to array
  return Array.from(statsMap.entries()).map(([pathologyType, stats]) => ({
    pathologyType,
    activePatients: stats.active,
    newPatientsThisMonth: stats.newThisMonth,
  }));
}

// ============================================================================
// PATHOLOGY-SPECIFIC ANALYTICS
// ============================================================================

export async function getPathologyStatistics(
  centerId: string,
  pathology: PathologyType
) {
  const supabase = await createClient();

  // Get pathology ID
  const { data: pathologyData } = await supabase
    .from('pathologies')
    .select('id')
    .eq('type', pathology)
    .single();

  if (!pathologyData) return null;

  // Patient count
  const { count: patientCount } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })
    .eq('center_id', centerId)
    .eq('pathology_id', pathologyData.id)
    .eq('active', true);

  // Visit statistics
  const { data: visits } = await supabase
    .from('visits')
    .select('*, patient:patients!inner(*)')
    .eq('patient.center_id', centerId)
    .eq('patient.pathology_id', pathologyData.id);

  const visitStats = {
    total: visits?.length || 0,
    screening: visits?.filter((v) => v.visit_type === 'screening').length || 0,
    initial: visits?.filter((v) => v.visit_type === 'initial_evaluation').length || 0,
    biannual: visits?.filter((v) => v.visit_type === 'biannual_followup').length || 0,
    annual: visits?.filter((v) => v.visit_type === 'annual_evaluation').length || 0,
    offSchedule: visits?.filter((v) => v.visit_type === 'off_schedule').length || 0,
  };

  return {
    patientCount: patientCount || 0,
    visitStats,
  };
}

// ============================================================================
// TREND ANALYSIS
// ============================================================================

export async function getVisitTrends(
  centerId: string,
  months: number = 6
) {
  const supabase = await createClient();

  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const { data: visits } = await supabase
    .from('visits')
    .select('scheduled_date, status, patient:patients!inner(center_id)')
    .eq('patient.center_id', centerId)
    .gte('scheduled_date', startDate.toISOString())
    .lte('scheduled_date', endDate.toISOString());

  // Group by month
  const monthlyData: Record<string, { total: number; completed: number }> = {};

  visits?.forEach((visit) => {
    const date = new Date(visit.scheduled_date!);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { total: 0, completed: 0 };
    }

    monthlyData[monthKey].total++;
    if (visit.status === 'completed') {
      monthlyData[monthKey].completed++;
    }
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    ...data,
    completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
  }));
}
