// eFondaMental Platform - Analytics Service

import { createClient } from '../supabase/server';
import { PathologyType } from '../types/enums';

// ============================================================================
// GLOBAL STATISTICS
// ============================================================================

export async function getGlobalStatistics() {
  const supabase = await createClient();

  // Total centers
  const { count: totalCenters } = await supabase
    .from('centers')
    .select('*', { count: 'exact', head: true });

  // Active centers
  const { count: activeCenters } = await supabase
    .from('centers')
    .select('*', { count: 'exact', head: true })
    .eq('active', true);

  // Total patients
  const { count: totalPatients } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true });

  // Active patients
  const { count: activePatients } = await supabase
    .from('patients')
    .select('*', { count: 'exact', head: true })
    .eq('active', true);

  // Visits this month
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const { count: visitsThisMonth } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .gte('scheduled_date', firstDayOfMonth.toISOString());

  // Completed visits this month
  const { count: completedVisitsThisMonth } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .gte('scheduled_date', firstDayOfMonth.toISOString())
    .eq('status', 'completed');

  // Total professionals
  const { count: totalProfessionals } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .in('role', ['healthcare_professional', 'manager']);

  // Active professionals
  const { count: activeProfessionals } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .in('role', ['healthcare_professional', 'manager'])
    .eq('active', true);

  return {
    totalCenters: totalCenters || 0,
    activeCenters: activeCenters || 0,
    totalPatients: totalPatients || 0,
    activePatients: activePatients || 0,
    visitsThisMonth: visitsThisMonth || 0,
    completedVisitsThisMonth: completedVisitsThisMonth || 0,
    totalProfessionals: totalProfessionals || 0,
    activeProfessionals: activeProfessionals || 0,
  };
}

// ============================================================================
// CENTER ANALYTICS
// ============================================================================

export async function getCenterAnalytics(centerId: string) {
  const supabase = await createClient();

  // Patient count by pathology
  const { data: patientsByPathology } = await supabase
    .from('patients')
    .select('pathology_id, pathologies(type, name)')
    .eq('center_id', centerId)
    .eq('active', true);

  const pathologyBreakdown = patientsByPathology?.reduce((acc, p: any) => {
    const type = p.pathologies?.type;
    if (type) {
      acc[type] = (acc[type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Visit completion rate
  const { count: totalVisits } = await supabase
    .from('visits')
    .select('*, patient:patients!inner(center_id)', {
      count: 'exact',
      head: true,
    })
    .eq('patient.center_id', centerId);

  const { count: completedVisits } = await supabase
    .from('visits')
    .select('*, patient:patients!inner(center_id)', {
      count: 'exact',
      head: true,
    })
    .eq('patient.center_id', centerId)
    .eq('status', 'completed');

  const completionRate =
    totalVisits && totalVisits > 0
      ? Math.round((completedVisits || 0 / totalVisits) * 100)
      : 0;

  return {
    pathologyBreakdown,
    totalVisits: totalVisits || 0,
    completedVisits: completedVisits || 0,
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
