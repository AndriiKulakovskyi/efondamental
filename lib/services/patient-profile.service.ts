// eFondaMental Platform - Patient Profile Service

import { createClient } from '../supabase/server';
import { PatientFull, VisitFull } from '../types/database.types';

// ============================================================================
// TYPES
// ============================================================================

export interface PatientStats {
  total_visits: number;
  completed_visits: number;
  upcoming_visits: number;
  last_visit_date: string | null;
  next_visit_date: string | null;
}

export interface VisitWithCompletion extends VisitFull {
  completionPercentage: number;
}

export interface EvaluationSummary {
  id: string;
  patient_id: string;
  visit_id: string | null;
  evaluation_date: string;
  evaluator_id: string;
  evaluator_name: string;
  visit_type: string | null;
  diagnosis: string | null;
  clinical_notes: string | null;
  risk_assessment: {
    suicide_risk?: 'none' | 'low' | 'moderate' | 'high';
    relapse_risk?: 'none' | 'low' | 'moderate' | 'high';
  } | null;
  treatment_plan: string | null;
  mood_score: number | null;
  medication_adherence: number | null;
  notes: string | null;
}

export interface MoodTrendData {
  date: string;
  mood_score: number;
  source: 'clinical' | 'self_reported';
}

export interface RiskHistoryData {
  date: string;
  suicide_risk: 'none' | 'low' | 'moderate' | 'high';
  relapse_risk: 'none' | 'low' | 'moderate' | 'high';
}

export interface AdherenceTrendData {
  date: string;
  adherence: number;
}

export interface PatientInvitationStatus {
  hasUserAccount: boolean;
  userId: string | null;
  pendingInvitation: {
    id: string;
    sent_at: string;
    expires_at: string;
    email: string;
  } | null;
}

export interface DoctorInfo {
  id: string;
  first_name: string;
  last_name: string;
}

export interface PatientProfileData {
  patient: PatientFull;
  stats: PatientStats;
  visits: VisitWithCompletion[];
  riskLevel: 'none' | 'low' | 'moderate' | 'high';
  evaluations: EvaluationSummary[];
  moodTrend: MoodTrendData[];
  riskHistory: RiskHistoryData[];
  adherenceTrend: AdherenceTrendData[];
  invitationStatus: PatientInvitationStatus;
  availableDoctors: DoctorInfo[];
}

// ============================================================================
// RPC CALL
// ============================================================================

/**
 * Fetches all patient profile data in a single RPC call
 * 
 * This function replaces 10-15 separate queries with one optimized
 * database call, significantly improving patient profile page load performance.
 * 
 * Performance: Reduces 50-100+ queries to just 1 query
 * 
 * @param patientId - ID of the patient
 * @param centerId - ID of the center (for fetching available doctors)
 * @param fromDate - Optional start date for trend data (defaults to 12 months ago)
 * @returns Complete patient profile data
 */
export async function getPatientProfileData(
  patientId: string,
  centerId: string,
  fromDate?: string
): Promise<PatientProfileData> {
  const supabase = await createClient();

  try {
    // Call the RPC function
    const { data, error } = await supabase.rpc('get_patient_profile_data', {
      p_patient_id: patientId,
      p_center_id: centerId,
      p_from_date: fromDate || null
    });

    if (error) {
      console.error('Error fetching patient profile data:', error);
      throw new Error(`Failed to fetch patient profile data: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from patient profile RPC');
    }

    // Transform the response
    const patient = data.patient as PatientFull;
    const stats = data.stats as PatientStats;
    const visits = (data.visits || []) as VisitWithCompletion[];
    
    // Debug: Log visit completion percentages from RPC
    console.log('[getPatientProfileData] Visits from RPC:', visits.map(v => ({
      id: v.id,
      template_name: v.template_name,
      completionPercentage: v.completionPercentage
    })));
    
    // Debug: Also fetch directly from visits table to compare
    const { data: directVisits } = await supabase
      .from('visits')
      .select('id, completion_percentage')
      .eq('patient_id', patientId);
    console.log('[getPatientProfileData] Direct visits table query:', directVisits);
    const riskLevel = (data.risk_level || 'none') as 'none' | 'low' | 'moderate' | 'high';
    const evaluations = (data.evaluations || []) as EvaluationSummary[];
    const moodTrend = (data.mood_trend || []) as MoodTrendData[];
    const riskHistory = (data.risk_history || []) as RiskHistoryData[];
    const adherenceTrend = (data.adherence_trend || []) as AdherenceTrendData[];
    const invitationStatus = data.invitation_status as PatientInvitationStatus;
    const availableDoctors = (data.available_doctors || []) as DoctorInfo[];

    return {
      patient,
      stats,
      visits,
      riskLevel,
      evaluations,
      moodTrend,
      riskHistory,
      adherenceTrend,
      invitationStatus,
      availableDoctors
    };
  } catch (error) {
    console.error('Error in getPatientProfileData:', error);
    throw error;
  }
}

