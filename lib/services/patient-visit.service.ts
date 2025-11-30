// eFondaMental Platform - Patient Visit Service
// Service functions for patient-facing visit and questionnaire operations

import { createClient } from '../supabase/server';
import { VisitFull } from '../types/database.types';
import { VisitStatus } from '../types/enums';
import {
  getAsrmResponse,
  getQidsResponse,
  getMdqResponse,
  getEq5d5lResponse,
  getPriseMResponse,
  getStaiYaResponse,
  getMarsResponse,
  getMathysResponse,
  getPsqiResponse,
  getEpworthResponse,
  getAsrsResponse,
  getCtqResponse,
  getBis10Response,
  getAls18Response,
  getAimResponse,
  getWurs25Response,
  getAq12Response,
  getCsmResponse,
  getCtiResponse
} from './questionnaire.service';
import {
  ASRM_DEFINITION,
  QIDS_DEFINITION,
  MDQ_DEFINITION,
  EQ5D5L_DEFINITION,
  PRISE_M_DEFINITION,
  STAI_YA_DEFINITION,
  MARS_DEFINITION,
  MATHYS_DEFINITION,
  PSQI_DEFINITION,
  EPWORTH_DEFINITION,
  ASRS_DEFINITION,
  CTQ_DEFINITION,
  BIS10_DEFINITION,
  ALS18_DEFINITION,
  AIM_DEFINITION,
  WURS25_DEFINITION,
  AQ12_DEFINITION,
  CSM_DEFINITION,
  CTI_DEFINITION,
  QuestionnaireDefinition
} from '../constants/questionnaires';

// ============================================================================
// TYPES
// ============================================================================

export type CompletedByRole = 'patient' | 'professional' | null;

export interface QuestionnaireCompletionInfo {
  isCompleted: boolean;
  completedBy: string | null;
  completedByRole: CompletedByRole;
  isLockedByProfessional: boolean;
}

export interface PatientQuestionnaire {
  id: string;
  code: string;
  title: string;
  description: string;
  estimatedTime: number;
  isCompleted: boolean;
  completedByRole: CompletedByRole;
  isLockedByProfessional: boolean;
  category: 'etat' | 'traits' | 'screening';
}

export interface PatientVisitWithQuestionnaires {
  visit: VisitFull;
  questionnaires: PatientQuestionnaire[];
  completedCount: number;
  totalCount: number;
  completionPercentage: number;
  requiresAction: boolean;
  conductedByName?: string;
}

// ============================================================================
// AUTO-QUESTIONNAIRE DEFINITIONS BY VISIT TYPE
// ============================================================================

// Questionnaires that patients can fill out themselves (auto-questionnaires)
const SCREENING_AUTO_QUESTIONNAIRES = [
  { definition: ASRM_DEFINITION, estimatedTime: 5, category: 'screening' as const },
  { definition: QIDS_DEFINITION, estimatedTime: 10, category: 'screening' as const },
  { definition: MDQ_DEFINITION, estimatedTime: 5, category: 'screening' as const }
];

const INITIAL_EVAL_ETAT_QUESTIONNAIRES = [
  { definition: EQ5D5L_DEFINITION, estimatedTime: 5, category: 'etat' as const },
  { definition: PRISE_M_DEFINITION, estimatedTime: 10, category: 'etat' as const },
  { definition: STAI_YA_DEFINITION, estimatedTime: 10, category: 'etat' as const },
  { definition: MARS_DEFINITION, estimatedTime: 5, category: 'etat' as const },
  { definition: MATHYS_DEFINITION, estimatedTime: 10, category: 'etat' as const },
  { definition: ASRM_DEFINITION, estimatedTime: 5, category: 'etat' as const },
  { definition: QIDS_DEFINITION, estimatedTime: 10, category: 'etat' as const },
  { definition: PSQI_DEFINITION, estimatedTime: 10, category: 'etat' as const },
  { definition: EPWORTH_DEFINITION, estimatedTime: 5, category: 'etat' as const }
];

const INITIAL_EVAL_TRAITS_QUESTIONNAIRES = [
  { definition: ASRS_DEFINITION, estimatedTime: 10, category: 'traits' as const },
  { definition: CTQ_DEFINITION, estimatedTime: 15, category: 'traits' as const },
  { definition: BIS10_DEFINITION, estimatedTime: 10, category: 'traits' as const },
  { definition: ALS18_DEFINITION, estimatedTime: 10, category: 'traits' as const },
  { definition: AIM_DEFINITION, estimatedTime: 10, category: 'traits' as const },
  { definition: WURS25_DEFINITION, estimatedTime: 15, category: 'traits' as const },
  { definition: AQ12_DEFINITION, estimatedTime: 10, category: 'traits' as const },
  { definition: CSM_DEFINITION, estimatedTime: 10, category: 'traits' as const },
  { definition: CTI_DEFINITION, estimatedTime: 10, category: 'traits' as const }
];

// ============================================================================
// QUESTIONNAIRE COMPLETION CHECKING
// ============================================================================

type QuestionnaireGetter = (visitId: string) => Promise<any>;

const QUESTIONNAIRE_GETTERS: Record<string, QuestionnaireGetter> = {
  // Screening questionnaires
  'ASRM_FR': getAsrmResponse,
  'QIDS_SR16_FR': getQidsResponse,
  'MDQ_FR': getMdqResponse,
  // Initial Evaluation - ETAT questionnaires (codes without _FR suffix)
  'EQ5D5L': getEq5d5lResponse,
  'PRISE_M': getPriseMResponse,
  'STAI_YA': getStaiYaResponse,
  'MARS': getMarsResponse,
  'MATHYS': getMathysResponse,
  'PSQI': getPsqiResponse,
  'EPWORTH': getEpworthResponse,
  // Initial Evaluation - TRAITS questionnaires (codes without _FR suffix)
  'ASRS': getAsrsResponse,
  'CTQ': getCtqResponse,
  'BIS10': getBis10Response,
  'ALS18': getAls18Response,
  'AIM': getAimResponse,
  'WURS25': getWurs25Response,
  'AQ12': getAq12Response,
  'CSM': getCsmResponse,
  'CTI': getCtiResponse
};

// Professional roles that lock questionnaires for patients
const PROFESSIONAL_ROLES = ['healthcare_professional', 'manager', 'administrator'];

/**
 * Check questionnaire completion and determine who completed it
 */
async function checkQuestionnaireCompletionWithRole(
  visitId: string,
  code: string,
  patientUserId: string
): Promise<QuestionnaireCompletionInfo> {
  const getter = QUESTIONNAIRE_GETTERS[code];
  if (!getter) {
    console.warn(`[Patient Visit Service] No getter found for questionnaire code: ${code}`);
    return {
      isCompleted: false,
      completedBy: null,
      completedByRole: null,
      isLockedByProfessional: false
    };
  }
  
  try {
    const response = await getter(visitId);
    
    console.log(`[Patient Visit Service] Checking ${code} for visit ${visitId}: response=${response ? 'found' : 'null'}`);
    
    if (!response) {
      return {
        isCompleted: false,
        completedBy: null,
        completedByRole: null,
        isLockedByProfessional: false
      };
    }
    
    // Response exists - check who completed it
    const completedBy = response.completed_by || null;
    
    console.log(`[Patient Visit Service] ${code} completed_by: ${completedBy || 'null'}`);
    
    // If no completed_by field, assume it was completed (legacy data)
    // We can't determine who completed it, so default to patient (unlocked)
    if (!completedBy) {
      return {
        isCompleted: true,
        completedBy: null,
        completedByRole: 'patient',
        isLockedByProfessional: false
      };
    }
    
    // Check the role of the person who completed it
    const supabase = await createClient();
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', completedBy)
      .single();
    
    const isProfessional = userProfile && PROFESSIONAL_ROLES.includes(userProfile.role);
    
    // Check if this is the patient themselves
    const isPatient = completedBy === patientUserId;
    
    let completedByRole: CompletedByRole = null;
    if (isPatient) {
      completedByRole = 'patient';
    } else if (isProfessional) {
      completedByRole = 'professional';
    } else {
      // Default to patient if we can't determine (e.g., completed via patient form)
      completedByRole = 'patient';
    }
    
    return {
      isCompleted: true,
      completedBy,
      completedByRole,
      isLockedByProfessional: completedByRole === 'professional'
    };
  } catch (error) {
    console.error(`[Patient Visit Service] Error checking ${code} for visit ${visitId}:`, error);
    return {
      isCompleted: false,
      completedBy: null,
      completedByRole: null,
      isLockedByProfessional: false
    };
  }
}

// ============================================================================
// SERVICE FUNCTIONS
// ============================================================================

/**
 * Get auto-questionnaires for a specific visit type
 */
export function getVisitAutoQuestionnaires(
  visitType: string
): Array<{ definition: QuestionnaireDefinition; estimatedTime: number; category: 'etat' | 'traits' | 'screening' }> {
  switch (visitType) {
    case 'screening':
      return SCREENING_AUTO_QUESTIONNAIRES;
    case 'initial_evaluation':
      return [
        ...INITIAL_EVAL_ETAT_QUESTIONNAIRES,
        ...INITIAL_EVAL_TRAITS_QUESTIONNAIRES
      ];
    default:
      return [];
  }
}

/**
 * Get completion status for all auto-questionnaires in a visit with role info
 */
export async function getQuestionnaireCompletionForVisit(
  visitId: string,
  visitType: string,
  patientUserId: string
): Promise<Map<string, QuestionnaireCompletionInfo>> {
  const questionnaires = getVisitAutoQuestionnaires(visitType);
  const completionMap = new Map<string, QuestionnaireCompletionInfo>();
  
  console.log(`[Patient Visit Service] Checking completion for visit ${visitId} (type: ${visitType}), ${questionnaires.length} questionnaires`);
  
  const completionChecks = await Promise.all(
    questionnaires.map(async (q) => ({
      code: q.definition.code,
      info: await checkQuestionnaireCompletionWithRole(visitId, q.definition.code, patientUserId)
    }))
  );
  
  completionChecks.forEach(({ code, info }) => {
    completionMap.set(code, info);
    console.log(`[Patient Visit Service] ${code}: isCompleted=${info.isCompleted}, isLocked=${info.isLockedByProfessional}`);
  });
  
  return completionMap;
}

/**
 * Get patient visits with their auto-questionnaires and completion status
 */
export async function getPatientVisitsWithQuestionnaires(
  patientId: string
): Promise<PatientVisitWithQuestionnaires[]> {
  const supabase = await createClient();
  
  // Get the patient's user_id for role checking
  const { data: patient } = await supabase
    .from('patients')
    .select('user_id')
    .eq('id', patientId)
    .single();
  
  const patientUserId = patient?.user_id || '';
  
  // Fetch all active visits (scheduled, in_progress, or completed)
  // Patients should be able to see and review all their visits
  const { data: visits, error } = await supabase
    .from('v_visits_full')
    .select('*')
    .eq('patient_id', patientId)
    .in('status', [VisitStatus.SCHEDULED, VisitStatus.IN_PROGRESS, VisitStatus.COMPLETED])
    .neq('status', VisitStatus.CANCELLED)
    .order('scheduled_date', { ascending: true });
  
  if (error) {
    throw new Error(`Failed to fetch patient visits: ${error.message}`);
  }
  
  if (!visits || visits.length === 0) {
    console.log(`[Patient Visit Service] No scheduled/in_progress visits found for patient ${patientId}`);
    return [];
  }
  
  console.log(`[Patient Visit Service] Found ${visits.length} visits for patient ${patientId}:`);
  visits.forEach(v => {
    console.log(`  - Visit ${v.id}: type=${v.visit_type}, status=${v.status}, date=${v.scheduled_date}`);
  });
  
  // Process each visit to include questionnaire details
  const visitsWithQuestionnaires = await Promise.all(
    visits.map(async (visit) => {
      const autoQuestionnaires = getVisitAutoQuestionnaires(visit.visit_type);
      const completionMap = await getQuestionnaireCompletionForVisit(
        visit.id,
        visit.visit_type,
        patientUserId
      );
      
      const questionnaires: PatientQuestionnaire[] = autoQuestionnaires.map((q) => {
        const completionInfo = completionMap.get(q.definition.code) || {
          isCompleted: false,
          completedBy: null,
          completedByRole: null,
          isLockedByProfessional: false
        };
        
        return {
          id: `${visit.id}_${q.definition.code}`,
          code: q.definition.code,
          title: q.definition.title,
          description: q.definition.description,
          estimatedTime: q.estimatedTime,
          isCompleted: completionInfo.isCompleted,
          completedByRole: completionInfo.completedByRole,
          isLockedByProfessional: completionInfo.isLockedByProfessional,
          category: q.category
        };
      });
      
      const completedCount = questionnaires.filter((q) => q.isCompleted).length;
      const totalCount = questionnaires.length;
      
      // Get conductor name if available
      let conductedByName: string | undefined;
      if (visit.conducted_by) {
        const { data: conductor } = await supabase
          .from('user_profiles')
          .select('first_name, last_name')
          .eq('id', visit.conducted_by)
          .single();
        
        if (conductor) {
          conductedByName = `Dr. ${conductor.first_name} ${conductor.last_name}`;
        }
      }
      
      // requiresAction only if there are incomplete questionnaires that are NOT locked
      const incompleteAndUnlocked = questionnaires.filter(
        (q) => !q.isCompleted && !q.isLockedByProfessional
      );
      
      return {
        visit: visit as VisitFull,
        questionnaires,
        completedCount,
        totalCount,
        completionPercentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
        requiresAction: incompleteAndUnlocked.length > 0,
        conductedByName
      };
    })
  );
  
  return visitsWithQuestionnaires;
}

/**
 * Get patient statistics for dashboard
 */
export async function getPatientDashboardStats(patientId: string): Promise<{
  pendingQuestionnaires: number;
  nextVisit: { date: string; templateName: string } | null;
  completedVisits: number;
}> {
  const supabase = await createClient();
  
  // Get pending questionnaires count (only those not locked by professionals)
  const visitsWithQuestionnaires = await getPatientVisitsWithQuestionnaires(patientId);
  const pendingQuestionnaires = visitsWithQuestionnaires.reduce(
    (sum, v) => sum + v.questionnaires.filter(q => !q.isCompleted && !q.isLockedByProfessional).length,
    0
  );
  
  // Get next upcoming visit
  const { data: upcomingVisit } = await supabase
    .from('v_visits_full')
    .select('scheduled_date, template_name')
    .eq('patient_id', patientId)
    .eq('status', VisitStatus.SCHEDULED)
    .gte('scheduled_date', new Date().toISOString())
    .order('scheduled_date', { ascending: true })
    .limit(1)
    .single();
  
  // Get completed visits count
  const { count: completedVisits } = await supabase
    .from('visits')
    .select('id', { count: 'exact', head: true })
    .eq('patient_id', patientId)
    .eq('status', VisitStatus.COMPLETED);
  
  return {
    pendingQuestionnaires,
    nextVisit: upcomingVisit ? {
      date: upcomingVisit.scheduled_date,
      templateName: upcomingVisit.template_name
    } : null,
    completedVisits: completedVisits || 0
  };
}

/**
 * Get all visits for a patient (including completed ones) for the appointments page
 */
export async function getPatientAllVisits(patientId: string): Promise<{
  upcoming: VisitFull[];
  past: VisitFull[];
}> {
  const supabase = await createClient();
  
  const now = new Date().toISOString();
  
  // Fetch all visits
  const { data: visits, error } = await supabase
    .from('v_visits_full')
    .select('*')
    .eq('patient_id', patientId)
    .neq('status', VisitStatus.CANCELLED)
    .order('scheduled_date', { ascending: true });
  
  if (error) {
    throw new Error(`Failed to fetch patient visits: ${error.message}`);
  }
  
  const allVisits = (visits || []) as VisitFull[];
  
  // Separate into upcoming and past
  const upcoming = allVisits.filter(
    (v) => v.scheduled_date && v.scheduled_date >= now && v.status !== VisitStatus.COMPLETED
  );
  
  const past = allVisits.filter(
    (v) => (v.scheduled_date && v.scheduled_date < now) || v.status === VisitStatus.COMPLETED
  );
  
  return { upcoming, past };
}

/**
 * Check if a specific questionnaire is locked by a professional
 */
export async function isQuestionnaireLockedByProfessional(
  visitId: string,
  questionnaireCode: string,
  patientUserId: string
): Promise<boolean> {
  const info = await checkQuestionnaireCompletionWithRole(visitId, questionnaireCode, patientUserId);
  return info.isLockedByProfessional;
}

/**
 * Get questionnaire response data for read-only view
 */
export async function getQuestionnaireResponseForView(
  visitId: string,
  questionnaireCode: string
): Promise<Record<string, any> | null> {
  const getter = QUESTIONNAIRE_GETTERS[questionnaireCode];
  if (!getter) return null;
  
  try {
    const response = await getter(visitId);
    return response;
  } catch {
    return null;
  }
}
