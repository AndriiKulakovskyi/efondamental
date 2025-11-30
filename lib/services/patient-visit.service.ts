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

export interface PatientQuestionnaire {
  id: string;
  code: string;
  title: string;
  description: string;
  estimatedTime: number;
  isCompleted: boolean;
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
  'ASRM_FR': getAsrmResponse,
  'QIDS_SR16_FR': getQidsResponse,
  'MDQ_FR': getMdqResponse,
  'EQ5D5L_FR': getEq5d5lResponse,
  'PRISE_M_FR': getPriseMResponse,
  'STAI_YA_FR': getStaiYaResponse,
  'MARS_FR': getMarsResponse,
  'MATHYS_FR': getMathysResponse,
  'PSQI_FR': getPsqiResponse,
  'EPWORTH_FR': getEpworthResponse,
  'ASRS_FR': getAsrsResponse,
  'CTQ_FR': getCtqResponse,
  'BIS10_FR': getBis10Response,
  'ALS18_FR': getAls18Response,
  'AIM_FR': getAimResponse,
  'WURS25_FR': getWurs25Response,
  'AQ12_FR': getAq12Response,
  'CSM_FR': getCsmResponse,
  'CTI_FR': getCtiResponse
};

async function checkQuestionnaireCompletion(
  visitId: string,
  code: string
): Promise<boolean> {
  const getter = QUESTIONNAIRE_GETTERS[code];
  if (!getter) return false;
  
  try {
    const response = await getter(visitId);
    return response !== null;
  } catch {
    return false;
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
 * Get completion status for all auto-questionnaires in a visit
 */
export async function getQuestionnaireCompletionForVisit(
  visitId: string,
  visitType: string
): Promise<Map<string, boolean>> {
  const questionnaires = getVisitAutoQuestionnaires(visitType);
  const completionMap = new Map<string, boolean>();
  
  const completionChecks = await Promise.all(
    questionnaires.map(async (q) => ({
      code: q.definition.code,
      isCompleted: await checkQuestionnaireCompletion(visitId, q.definition.code)
    }))
  );
  
  completionChecks.forEach(({ code, isCompleted }) => {
    completionMap.set(code, isCompleted);
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
  
  // Fetch visits that are scheduled or in progress
  const { data: visits, error } = await supabase
    .from('v_visits_full')
    .select('*')
    .eq('patient_id', patientId)
    .in('status', [VisitStatus.SCHEDULED, VisitStatus.IN_PROGRESS])
    .order('scheduled_date', { ascending: true });
  
  if (error) {
    throw new Error(`Failed to fetch patient visits: ${error.message}`);
  }
  
  if (!visits || visits.length === 0) {
    return [];
  }
  
  // Process each visit to include questionnaire details
  const visitsWithQuestionnaires = await Promise.all(
    visits.map(async (visit) => {
      const autoQuestionnaires = getVisitAutoQuestionnaires(visit.visit_type);
      const completionMap = await getQuestionnaireCompletionForVisit(
        visit.id,
        visit.visit_type
      );
      
      const questionnaires: PatientQuestionnaire[] = autoQuestionnaires.map((q) => ({
        id: `${visit.id}_${q.definition.code}`,
        code: q.definition.code,
        title: q.definition.title,
        description: q.definition.description,
        estimatedTime: q.estimatedTime,
        isCompleted: completionMap.get(q.definition.code) || false,
        category: q.category
      }));
      
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
      
      return {
        visit: visit as VisitFull,
        questionnaires,
        completedCount,
        totalCount,
        completionPercentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
        requiresAction: completedCount < totalCount,
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
  
  // Get pending questionnaires count
  const visitsWithQuestionnaires = await getPatientVisitsWithQuestionnaires(patientId);
  const pendingQuestionnaires = visitsWithQuestionnaires.reduce(
    (sum, v) => sum + (v.totalCount - v.completedCount),
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

