// eFondaMental Platform - Dashboard Service

import { createClient } from '../supabase/server';
import { PatientFull } from '../types/database.types';
import { PathologyType } from '../types/enums';
import { PatientVisitCompletion } from './visit.service';

// ============================================================================
// TYPES
// ============================================================================

export interface PatientDemographics {
  total: number;
  gender: {
    male: number;
    female: number;
    other: number;
    unspecified: number;
  };
  age: {
    '0-18': number;
    '19-30': number;
    '31-50': number;
    '51-70': number;
    '70+': number;
  };
}

export interface ProfessionalDashboardData {
  myPatients: PatientFull[];
  centerPatients: PatientFull[];
  patientsRequiringFollowup: PatientFull[];
  demographics: PatientDemographics;
  visitCompletions: Map<string, PatientVisitCompletion>;
  visitsThisMonth: number;
}

// ============================================================================
// RPC CALL
// ============================================================================

/**
 * Fetches all professional dashboard data in a single RPC call
 * 
 * This function replaces multiple sequential queries with one optimized
 * database call, significantly improving dashboard load performance.
 * 
 * Performance: Reduces 150-250+ queries to just 1 query
 * 
 * @param professionalId - ID of the healthcare professional
 * @param centerId - ID of the center
 * @param pathology - Pathology type to filter by
 * @returns Complete dashboard data including patients, statistics, and demographics
 */
export async function getProfessionalDashboardData(
  professionalId: string,
  centerId: string,
  pathology: PathologyType
): Promise<ProfessionalDashboardData> {
  const supabase = await createClient();

  try {
    // Call the RPC function
    const { data, error } = await supabase.rpc('get_professional_dashboard_data', {
      p_professional_id: professionalId,
      p_center_id: centerId,
      p_pathology_type: pathology
    });

    if (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error(`Failed to fetch dashboard data: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from dashboard RPC');
    }

    // Transform the response
    const myPatients = (data.my_patients || []) as PatientFull[];
    const centerPatients = (data.center_patients || []) as PatientFull[];
    const patientsRequiringFollowup = (data.patients_requiring_followup || []) as PatientFull[];
    
    const demographics: PatientDemographics = data.demographics || {
      total: 0,
      gender: { male: 0, female: 0, other: 0, unspecified: 0 },
      age: { '0-18': 0, '19-30': 0, '31-50': 0, '51-70': 0, '70+': 0 }
    };

    // Convert visit_completions object to Map
    const visitCompletionsMap = new Map<string, PatientVisitCompletion>();
    const visitCompletionsObj = data.visit_completions || {};
    
    Object.entries(visitCompletionsObj).forEach(([patientId, completion]: [string, any]) => {
      visitCompletionsMap.set(patientId, {
        patientId: completion.patientId,
        visitId: completion.visitId,
        visitType: completion.visitType,
        scheduledDate: completion.scheduledDate,
        completionPercentage: completion.completionPercentage,
        conductedBy: completion.conductedBy,
      });
    });

    const visitsThisMonth = data.visits_this_month || 0;

    return {
      myPatients,
      centerPatients,
      patientsRequiringFollowup,
      demographics,
      visitCompletions: visitCompletionsMap,
      visitsThisMonth
    };
  } catch (error) {
    console.error('Error in getProfessionalDashboardData:', error);
    throw error;
  }
}

