// eFondaMental Platform - Visit Service

import { createClient } from '../supabase/server';
import {
  Visit,
  VisitInsert,
  VisitUpdate,
  VisitFull,
} from '../types/database.types';
import { VisitType, VisitStatus } from '../types/enums';
import {
  getAsrmResponse,
  getQidsResponse,
  getMdqResponse,
  getDiagnosticResponse,
  getOrientationResponse,
  // Initial Evaluation - ETAT
  getEq5d5lResponse,
  getPriseMResponse,
  getStaiYaResponse,
  getMarsResponse,
  getMathysResponse,
  getPsqiResponse,
  getEpworthResponse,
  // Initial Evaluation - TRAITS
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
  // Hetero questionnaires
  getMadrsResponse,
  getYmrsResponse,
  getCgiResponse,
  getEgfResponse,
  getAldaResponse,
  getEtatPatientResponse,
  getFastResponse,
  getDivaResponse,
  getFamilyHistoryResponse,
  getCssrsResponse,
  getIsaResponse,
  getSisResponse,
  getSuicideHistoryResponse,
  getPerinataliteResponse,
  getPathoNeuroResponse,
  getPathoCardioResponse,
  getPathoEndocResponse,
  getWais4CriteriaResponse,
  getWais4LearningResponse,
  getWais4MatricesResponse,
  getWais4DigitSpanResponse
} from './questionnaire-hetero.service';
import {
  getSocialResponse
} from './questionnaire-social.service';
import {
  getTobaccoResponse,
  getFagerstromResponse,
  getPhysicalParamsResponse,
  getBloodPressureResponse,
  getSleepApneaResponse,
  getBiologicalAssessmentResponse
} from './questionnaire-infirmier.service';
import {
  getDsm5HumeurResponse,
  getDsm5PsychoticResponse,
  getDsm5ComorbidResponse
} from './questionnaire-dsm5.service';
import {
  ASRM_DEFINITION,
  QIDS_DEFINITION,
  MDQ_DEFINITION,
  DIAGNOSTIC_DEFINITION,
  ORIENTATION_DEFINITION,
  // Initial Evaluation - ETAT
  EQ5D5L_DEFINITION,
  PRISE_M_DEFINITION,
  STAI_YA_DEFINITION,
  MARS_DEFINITION,
  MATHYS_DEFINITION,
  PSQI_DEFINITION,
  EPWORTH_DEFINITION,
  // Initial Evaluation - TRAITS
  ASRS_DEFINITION,
  CTQ_DEFINITION,
  BIS10_DEFINITION,
  ALS18_DEFINITION,
  AIM_DEFINITION,
  WURS25_DEFINITION,
  AQ12_DEFINITION,
  CSM_DEFINITION,
  CTI_DEFINITION
} from '../constants/questionnaires';
import {
  // Hetero questionnaire definitions
  MADRS_DEFINITION,
  YMRS_DEFINITION,
  CGI_DEFINITION,
  EGF_DEFINITION,
  ALDA_DEFINITION,
  ETAT_PATIENT_DEFINITION,
  FAST_DEFINITION,
  DIVA_DEFINITION,
  FAMILY_HISTORY_DEFINITION,
  CSSRS_DEFINITION,
  ISA_DEFINITION,
  SIS_DEFINITION,
  SUICIDE_HISTORY_DEFINITION,
  PERINATALITE_DEFINITION,
  PATHO_NEURO_DEFINITION,
  PATHO_CARDIO_DEFINITION,
  PATHO_ENDOC_DEFINITION,
  WAIS4_CRITERIA_DEFINITION,
  WAIS4_LEARNING_DEFINITION,
  WAIS4_MATRICES_DEFINITION,
  CVLT_DEFINITION,
  WAIS4_CODE_DEFINITION,
  WAIS4_DIGIT_SPAN_DEFINITION,
  TMT_DEFINITION,
  STROOP_DEFINITION,
  FLUENCES_VERBALES_DEFINITION,
  COBRA_DEFINITION,
  CPT3_DEFINITION,
  WAIS4_SIMILITUDES_DEFINITION,
  TEST_COMMISSIONS_DEFINITION,
  SCIP_DEFINITION,
  // WAIS-III definitions
  WAIS3_CVLT_DEFINITION,
  WAIS3_TMT_DEFINITION,
  WAIS3_STROOP_DEFINITION,
  WAIS3_FLUENCES_VERBALES_DEFINITION,
  WAIS3_CRITERIA_DEFINITION,
  WAIS3_LEARNING_DEFINITION,
  WAIS3_VOCABULAIRE_DEFINITION,
  WAIS3_MATRICES_DEFINITION,
  WAIS3_CODE_SYMBOLES_DEFINITION,
  WAIS3_DIGIT_SPAN_DEFINITION,
  WAIS3_CPT2_DEFINITION,
  WAIS3_MEM3_SPATIAL_DEFINITION
} from '../constants/questionnaires-hetero';
import {
  SOCIAL_DEFINITION
} from '../constants/questionnaires-social';
import {
  TOBACCO_DEFINITION,
  FAGERSTROM_DEFINITION,
  PHYSICAL_PARAMS_DEFINITION,
  BLOOD_PRESSURE_DEFINITION,
  SLEEP_APNEA_DEFINITION,
  BIOLOGICAL_ASSESSMENT_DEFINITION
} from '../constants/questionnaires-infirmier';
import {
  DSM5_HUMEUR_DEFINITION,
  DSM5_PSYCHOTIC_DEFINITION,
  DSM5_COMORBID_DEFINITION
} from '../constants/questionnaires-dsm5';

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

/**
 * Visit types that can only exist once per patient (non-repeatable).
 * A patient can only have one active (non-cancelled) visit of these types.
 */
const UNIQUE_VISIT_TYPES: VisitType[] = [
  VisitType.SCREENING,
  VisitType.INITIAL_EVALUATION,
];

/**
 * Custom error class for duplicate visit attempts.
 */
export class DuplicateVisitError extends Error {
  constructor(visitType: string) {
    super(`A ${visitType} visit already exists for this patient. Only one ${visitType} visit is allowed per patient.`);
    this.name = 'DuplicateVisitError';
  }
}

/**
 * Check if a unique visit type already exists for a patient.
 * Only checks for non-cancelled visits.
 */
async function checkDuplicateVisit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  patientId: string,
  visitType: VisitType
): Promise<boolean> {
  // Only check for unique visit types
  if (!UNIQUE_VISIT_TYPES.includes(visitType)) {
    return false;
  }

  const { data, error } = await supabase
    .from('visits')
    .select('id')
    .eq('patient_id', patientId)
    .eq('visit_type', visitType)
    .neq('status', VisitStatus.CANCELLED)
    .limit(1);

  if (error) {
    console.error('Error checking for duplicate visit:', error);
    return false; // Don't block on error, let the insert handle it
  }

  return data && data.length > 0;
}

export async function createVisit(visit: VisitInsert): Promise<Visit> {
  const supabase = await createClient();

  // Check for duplicate unique visit types
  const visitType = visit.visit_type as VisitType;
  const isDuplicate = await checkDuplicateVisit(supabase, visit.patient_id, visitType);
  
  if (isDuplicate) {
    const visitTypeName = visitType === VisitType.SCREENING ? 'screening' : 'initial evaluation';
    throw new DuplicateVisitError(visitTypeName);
  }

  // If conducted_by not specified, use patient's assigned_to
  if (!visit.conducted_by) {
    const { data: patient } = await supabase
      .from('patients')
      .select('assigned_to')
      .eq('id', visit.patient_id)
      .single();
    
    if (patient?.assigned_to) {
      visit.conducted_by = patient.assigned_to;
    }
  }

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
    .order('scheduled_date', { ascending: true});

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
// VISIT MODULES & COMPLETION (Refactored)
// ============================================================================

export type VirtualModuleSection = {
  id: string;
  name: string;
  questionnaires: any[];
};

export type VirtualModule = {
  id: string;
  name: string;
  description: string;
  questionnaires?: any[];
  sections?: VirtualModuleSection[];
};

export async function getVisitModules(visitId: string): Promise<VirtualModule[]> {
  // Fetch visit to check type
  const visit = await getVisitById(visitId);
  if (!visit) throw new Error('Visit not found');

  if (visit.visit_type === 'screening') {
    return [
      {
        id: 'mod_auto',
        name: 'Autoquestionnaires',
        description: 'Questionnaires à remplir par le patient',
        questionnaires: [ASRM_DEFINITION, QIDS_DEFINITION, MDQ_DEFINITION]
      },
      {
        id: 'mod_medical',
        name: 'Partie médicale',
        description: 'Évaluation clinique par le professionnel de santé',
        questionnaires: [DIAGNOSTIC_DEFINITION, ORIENTATION_DEFINITION]
      }
    ];
  }

  if (visit.visit_type === 'initial_evaluation') {
    return [
      {
        id: 'mod_nurse',
        name: 'Infirmier',
        description: 'Évaluation par l\'infirmier',
        questionnaires: [TOBACCO_DEFINITION, FAGERSTROM_DEFINITION, PHYSICAL_PARAMS_DEFINITION, BLOOD_PRESSURE_DEFINITION, SLEEP_APNEA_DEFINITION, BIOLOGICAL_ASSESSMENT_DEFINITION]
      },
      {
        id: 'mod_thymic_eval',
        name: 'Evaluation état thymique et fonctionnement',
        description: 'Évaluation de l\'état thymique et du fonctionnement',
        questionnaires: [
          MADRS_DEFINITION,
          YMRS_DEFINITION,
          CGI_DEFINITION,
          EGF_DEFINITION,
          ALDA_DEFINITION,
          ETAT_PATIENT_DEFINITION,
          FAST_DEFINITION
        ]
      },
      {
        id: 'mod_medical_eval',
        name: 'Evaluation Médicale',
        description: 'Évaluation médicale complète',
        questionnaires: [DSM5_HUMEUR_DEFINITION, DSM5_PSYCHOTIC_DEFINITION, DSM5_COMORBID_DEFINITION, DIVA_DEFINITION, FAMILY_HISTORY_DEFINITION, CSSRS_DEFINITION, ISA_DEFINITION, SIS_DEFINITION, SUICIDE_HISTORY_DEFINITION, PERINATALITE_DEFINITION, PATHO_NEURO_DEFINITION, PATHO_CARDIO_DEFINITION, PATHO_ENDOC_DEFINITION]
      },
      {
        id: 'mod_neuropsy',
        name: 'Evaluation Neuropsychologique',
        description: 'Évaluation neuropsychologique (WAIS-III, WAIS-IV)',
        sections: [
          {
            id: 'wais3',
            name: 'WAIS-III',
            questionnaires: [WAIS3_CRITERIA_DEFINITION, WAIS3_LEARNING_DEFINITION, WAIS3_VOCABULAIRE_DEFINITION, WAIS3_MATRICES_DEFINITION, WAIS3_CODE_SYMBOLES_DEFINITION, WAIS3_DIGIT_SPAN_DEFINITION, WAIS3_CPT2_DEFINITION, WAIS3_MEM3_SPATIAL_DEFINITION, WAIS3_CVLT_DEFINITION, WAIS3_TMT_DEFINITION, WAIS3_STROOP_DEFINITION, WAIS3_FLUENCES_VERBALES_DEFINITION]
          },
          {
            id: 'wais4',
            name: 'WAIS-IV',
            questionnaires: [WAIS4_CRITERIA_DEFINITION, WAIS4_LEARNING_DEFINITION, WAIS4_MATRICES_DEFINITION, CVLT_DEFINITION, WAIS4_CODE_DEFINITION, WAIS4_DIGIT_SPAN_DEFINITION, WAIS4_SIMILITUDES_DEFINITION, TMT_DEFINITION, STROOP_DEFINITION, FLUENCES_VERBALES_DEFINITION, COBRA_DEFINITION, CPT3_DEFINITION, TEST_COMMISSIONS_DEFINITION, SCIP_DEFINITION]
          }
        ]
      },
      {
        id: 'mod_auto_etat',
        name: 'Autoquestionnaires - ETAT',
        description: 'Questionnaires sur l\'état actuel du patient',
        questionnaires: [
          EQ5D5L_DEFINITION,
          PRISE_M_DEFINITION,
          STAI_YA_DEFINITION,
          MARS_DEFINITION,
          MATHYS_DEFINITION,
          ASRM_DEFINITION, // Reusing from screening
          QIDS_DEFINITION, // Reusing from screening
          PSQI_DEFINITION,
          EPWORTH_DEFINITION
        ]
      },
      {
        id: 'mod_social',
        name: 'Social',
        description: 'Évaluation sociale',
        questionnaires: [SOCIAL_DEFINITION]
      },
      {
        id: 'mod_auto_traits',
        name: 'Autoquestionnaires - TRAITS',
        description: 'Questionnaires sur les traits du patient',
        questionnaires: [
          ASRS_DEFINITION,
          CTQ_DEFINITION,
          BIS10_DEFINITION,
          ALS18_DEFINITION,
          AIM_DEFINITION,
          WURS25_DEFINITION,
          AQ12_DEFINITION,
          CSM_DEFINITION,
          CTI_DEFINITION
        ]
      }
    ];
  }

  if (visit.visit_type === 'biannual_followup' || visit.visit_type === 'annual_evaluation') {
    return [
      {
        id: 'mod_thymic_eval',
        name: 'Evaluation état thymique et fonctionnement',
        description: 'Évaluation de l\'état thymique et du fonctionnement',
        questionnaires: [
          MADRS_DEFINITION,
          YMRS_DEFINITION,
          CGI_DEFINITION,
          EGF_DEFINITION,
          FAST_DEFINITION
        ]
      },
      {
        id: 'mod_medical_eval',
        name: 'Evaluation Médicale',
        description: 'Évaluation médicale complète',
        questionnaires: [
          DSM5_COMORBID_DEFINITION,
          DIVA_DEFINITION,
          CSSRS_DEFINITION,
          ISA_DEFINITION
        ]
      },
      {
        id: 'mod_auto_etat',
        name: 'Autoquestionnaires - ETAT',
        description: 'Questionnaires sur l\'état actuel du patient',
        questionnaires: [
          EQ5D5L_DEFINITION,
          ASRM_DEFINITION,
          QIDS_DEFINITION,
          PSQI_DEFINITION,
          EPWORTH_DEFINITION
        ]
      }
    ];
  }

  // Default/Fallback (e.g. other visit types not fully implemented yet)
  return [];
}

export async function getVisitCompletionStatus(visitId: string) {
  const visit = await getVisitById(visitId);
  if (!visit) throw new Error('Visit not found');

  let total = 0;
  let completed = 0;
  let totalModules = 0;

  if (visit.visit_type === 'screening') {
    total = 5; // ASRM, QIDS, MDQ, Diag, Orient
    totalModules = 2;

    const [asrm, qids, mdq, diag, orient] = await Promise.all([
      getAsrmResponse(visitId),
      getQidsResponse(visitId),
      getMdqResponse(visitId),
      getDiagnosticResponse(visitId),
      getOrientationResponse(visitId)
    ]);

    if (asrm) completed++;
    if (qids) completed++;
    if (mdq) completed++;
    if (diag) completed++;
    if (orient) completed++;
  } else if (visit.visit_type === 'initial_evaluation') {
    total = 58; // 9 ETAT + 9 TRAITS + 7 HETERO + 1 SOCIAL + 7 INFIRMIER + 9 Medical + 18 Neuropsy (14 WAIS-IV + 4 WAIS-III)
    totalModules = 7;

    const [
      eq5d5l, priseM, staiYa, mars, mathys, asrm, qids, psqi, epworth,
      asrs, ctq, bis10, als18, aim, wurs25, aq12, csm, cti,
      madrs, ymrs, cgi, egf, alda, etatPatient, fast, social,
      tobacco, fagerstrom, physicalParams, bloodPressure, sleepApnea, biologicalAssessment,
      dsm5Humeur, dsm5Psychotic, dsm5Comorbid, diva, familyHistory, cssrs, isa, sis, suicideHistory, perinatalite, pathoNeuro, pathoCardio, pathoEndoc,
      wais4Criteria, wais4Learning, wais4Matrices, wais4DigitSpan
    ] = await Promise.all([
      // ETAT questionnaires
      getEq5d5lResponse(visitId),
      getPriseMResponse(visitId),
      getStaiYaResponse(visitId),
      getMarsResponse(visitId),
      getMathysResponse(visitId),
      getAsrmResponse(visitId), // Reused
      getQidsResponse(visitId), // Reused
      getPsqiResponse(visitId),
      getEpworthResponse(visitId),
      // TRAITS questionnaires
      getAsrsResponse(visitId),
      getCtqResponse(visitId),
      getBis10Response(visitId),
      getAls18Response(visitId),
      getAimResponse(visitId),
      getWurs25Response(visitId),
      getAq12Response(visitId),
      getCsmResponse(visitId),
      getCtiResponse(visitId),
      // HETERO questionnaires
      getMadrsResponse(visitId),
      getYmrsResponse(visitId),
      getCgiResponse(visitId),
      getEgfResponse(visitId),
      getAldaResponse(visitId),
      getEtatPatientResponse(visitId),
      getFastResponse(visitId),
      // SOCIAL questionnaire
      getSocialResponse(visitId),
      // INFIRMIER questionnaires
      getTobaccoResponse(visitId),
      getFagerstromResponse(visitId),
      getPhysicalParamsResponse(visitId),
      getBloodPressureResponse(visitId),
      getSleepApneaResponse(visitId),
      getBiologicalAssessmentResponse(visitId),
      // DSM5 questionnaires
      getDsm5HumeurResponse(visitId),
      getDsm5PsychoticResponse(visitId),
      getDsm5ComorbidResponse(visitId),
      // DIVA questionnaire
      getDivaResponse(visitId),
      // Family History
      getFamilyHistoryResponse(visitId),
      // C-SSRS
      getCssrsResponse(visitId),
      // ISA
      getIsaResponse(visitId),
      // SIS
      getSisResponse(visitId),
      // Suicide History
      getSuicideHistoryResponse(visitId),
      // Perinatalite
      getPerinataliteResponse(visitId),
      // Pathologies Neurologiques
      getPathoNeuroResponse(visitId),
      // Pathologies Cardio-vasculaires
      getPathoCardioResponse(visitId),
      // Pathologies Endocriniennes et Métaboliques
      getPathoEndocResponse(visitId),
      // WAIS-4 Criteria
      getWais4CriteriaResponse(visitId),
      // WAIS-4 Learning
      getWais4LearningResponse(visitId),
      // WAIS-4 Matrices
      getWais4MatricesResponse(visitId),
      // WAIS-4 Digit Span
      getWais4DigitSpanResponse(visitId)
    ]);

    if (eq5d5l) completed++;
    if (priseM) completed++;
    if (staiYa) completed++;
    if (mars) completed++;
    if (mathys) completed++;
    if (asrm) completed++;
    if (qids) completed++;
    if (psqi) completed++;
    if (epworth) completed++;
    if (asrs) completed++;
    if (ctq) completed++;
    if (bis10) completed++;
    if (als18) completed++;
    if (aim) completed++;
    if (wurs25) completed++;
    if (aq12) completed++;
    if (csm) completed++;
    if (cti) completed++;
    if (madrs) completed++;
    if (ymrs) completed++;
    if (cgi) completed++;
    if (egf) completed++;
    if (alda) completed++;
    if (etatPatient) completed++;
    if (fast) completed++;
    if (social) completed++;
    if (tobacco) completed++;
    if (fagerstrom) completed++;
    if (physicalParams) completed++;
    if (bloodPressure) completed++;
    if (sleepApnea) completed++;
    if (biologicalAssessment) completed++;
    if (dsm5Humeur) completed++;
    if (dsm5Psychotic) completed++;
    if (dsm5Comorbid) completed++;
    if (diva) completed++;
    if (familyHistory) completed++;
    if (cssrs) completed++;
    if (isa) completed++;
    if (sis) completed++;
    if (suicideHistory) completed++;
    if (perinatalite) completed++;
    if (pathoNeuro) completed++;
    if (pathoCardio) completed++;
    if (pathoEndoc) completed++;
    if (wais4Criteria) completed++;
    if (wais4Learning) completed++;
    if (wais4Matrices) completed++;
    if (wais4DigitSpan) completed++;
  } else if (visit.visit_type === 'biannual_followup' || visit.visit_type === 'annual_evaluation') {
    // Follow-up visits: 5 thymic + 4 medical (DSM5 Comorbid, DIVA, CSSRS, ISA) + 5 auto etat = 14 total
    // Note: DIVA is conditionally included based on DSM5 Comorbid response
    total = 14;
    totalModules = 3;

    const [
      madrs, ymrs, cgi, egf, fast,
      dsm5Comorbid, diva, cssrs, isa,
      eq5d5l, asrm, qids, psqi, epworth
    ] = await Promise.all([
      // Thymic evaluation questionnaires
      getMadrsResponse(visitId),
      getYmrsResponse(visitId),
      getCgiResponse(visitId),
      getEgfResponse(visitId),
      getFastResponse(visitId),
      // Medical evaluation questionnaires
      getDsm5ComorbidResponse(visitId),
      getDivaResponse(visitId),
      getCssrsResponse(visitId),
      getIsaResponse(visitId),
      // Auto-questionnaires ETAT
      getEq5d5lResponse(visitId),
      getAsrmResponse(visitId),
      getQidsResponse(visitId),
      getPsqiResponse(visitId),
      getEpworthResponse(visitId)
    ]);

    // Count thymic evaluation
    if (madrs) completed++;
    if (ymrs) completed++;
    if (cgi) completed++;
    if (egf) completed++;
    if (fast) completed++;
    
    // Count medical evaluation
    if (dsm5Comorbid) completed++;
    if (diva) completed++;
    if (cssrs) completed++;
    if (isa) completed++;
    
    // Count auto-questionnaires
    if (eq5d5l) completed++;
    if (asrm) completed++;
    if (qids) completed++;
    if (psqi) completed++;
    if (epworth) completed++;
  }

  return {
    totalModules,
    totalQuestionnaires: total,
    completedQuestionnaires: completed,
    completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

// Bulk version for fetching multiple visit completions efficiently
export async function getBulkVisitCompletionStatus(visitIds: string[]): Promise<Map<string, { completionPercentage: number; completedQuestionnaires: number; totalQuestionnaires: number }>> {
  if (visitIds.length === 0) {
    return new Map();
  }

  const supabase = await createClient();
  
  // Fetch all visits at once
  const { data: visits, error } = await supabase
    .from('visits')
    .select('id, visit_type')
    .in('id', visitIds);

  if (error || !visits) {
    return new Map();
  }

  // Group visits by type for batch processing
  const screeningVisits = visits.filter(v => v.visit_type === 'screening');
  const initialEvalVisits = visits.filter(v => v.visit_type === 'initial_evaluation');

  const completionMap = new Map<string, { completionPercentage: number; completedQuestionnaires: number; totalQuestionnaires: number }>();

  // Process screening visits
  if (screeningVisits.length > 0) {
    const screeningIds = screeningVisits.map(v => v.id);
    
    const [asrmResults, qidsResults, mdqResults, diagResults, orientResults] = await Promise.all([
      supabase.from('responses_asrm').select('visit_id').in('visit_id', screeningIds),
      supabase.from('responses_qids_sr16').select('visit_id').in('visit_id', screeningIds),
      supabase.from('responses_mdq').select('visit_id').in('visit_id', screeningIds),
      supabase.from('responses_medical_diagnostic').select('visit_id').in('visit_id', screeningIds),
      supabase.from('responses_bipolar_orientation').select('visit_id').in('visit_id', screeningIds)
    ]);

    const asrmSet = new Set(asrmResults.data?.map(r => r.visit_id) || []);
    const qidsSet = new Set(qidsResults.data?.map(r => r.visit_id) || []);
    const mdqSet = new Set(mdqResults.data?.map(r => r.visit_id) || []);
    const diagSet = new Set(diagResults.data?.map(r => r.visit_id) || []);
    const orientSet = new Set(orientResults.data?.map(r => r.visit_id) || []);

    for (const visit of screeningVisits) {
      const completed = [asrmSet, qidsSet, mdqSet, diagSet, orientSet].filter(set => set.has(visit.id)).length;
      const total = 5;
      completionMap.set(visit.id, {
        completedQuestionnaires: completed,
        totalQuestionnaires: total,
        completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    }
  }

  // Process initial evaluation visits
  if (initialEvalVisits.length > 0) {
    const evalIds = initialEvalVisits.map(v => v.id);
    
    const [
      eq5d5lResults, priseMResults, staiYaResults, marsResults, mathysResults,
      asrmResults, qidsResults, psqiResults, epworthResults,
      asrsResults, ctqResults, bis10Results, als18Results, aimResults,
      wurs25Results, aq12Results, csmResults, ctiResults,
      madrsResults, ymrsResults, cgiResults, egfResults, aldaResults,
      etatPatientResults, fastResults, socialResults,
      tobaccoResults, fagerstromResults, physicalParamsResults, bloodPressureResults,
      sleepApneaResults, biologicalAssessmentResults,
      dsm5HumeurResults, dsm5PsychoticResults, dsm5ComorbidResults,
      divaResults, familyHistoryResults, cssrsResults
    ] = await Promise.all([
      supabase.from('responses_eq5d5l').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_prise_m').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_stai_ya').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_mars').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_mathys').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_asrm').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_qids_sr16').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_psqi').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_epworth').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_asrs').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_ctq').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_bis10').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_als18').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_aim').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_wurs25').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_aq12').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_csm').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_cti').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_madrs').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_ymrs').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_cgi').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_egf').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_alda').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_etat_patient').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_fast').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_social').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_tobacco').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_fagerstrom').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_physical_params').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_blood_pressure').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_sleep_apnea').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_biological_assessment').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_dsm5_humeur').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_dsm5_psychotic').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_dsm5_comorbid').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_diva').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_family_history').select('visit_id').in('visit_id', evalIds),
      supabase.from('responses_cssrs').select('visit_id').in('visit_id', evalIds)
    ]);

    const responseSets = [
      new Set(eq5d5lResults.data?.map(r => r.visit_id) || []),
      new Set(priseMResults.data?.map(r => r.visit_id) || []),
      new Set(staiYaResults.data?.map(r => r.visit_id) || []),
      new Set(marsResults.data?.map(r => r.visit_id) || []),
      new Set(mathysResults.data?.map(r => r.visit_id) || []),
      new Set(asrmResults.data?.map(r => r.visit_id) || []),
      new Set(qidsResults.data?.map(r => r.visit_id) || []),
      new Set(psqiResults.data?.map(r => r.visit_id) || []),
      new Set(epworthResults.data?.map(r => r.visit_id) || []),
      new Set(asrsResults.data?.map(r => r.visit_id) || []),
      new Set(ctqResults.data?.map(r => r.visit_id) || []),
      new Set(bis10Results.data?.map(r => r.visit_id) || []),
      new Set(als18Results.data?.map(r => r.visit_id) || []),
      new Set(aimResults.data?.map(r => r.visit_id) || []),
      new Set(wurs25Results.data?.map(r => r.visit_id) || []),
      new Set(aq12Results.data?.map(r => r.visit_id) || []),
      new Set(csmResults.data?.map(r => r.visit_id) || []),
      new Set(ctiResults.data?.map(r => r.visit_id) || []),
      new Set(madrsResults.data?.map(r => r.visit_id) || []),
      new Set(ymrsResults.data?.map(r => r.visit_id) || []),
      new Set(cgiResults.data?.map(r => r.visit_id) || []),
      new Set(egfResults.data?.map(r => r.visit_id) || []),
      new Set(aldaResults.data?.map(r => r.visit_id) || []),
      new Set(etatPatientResults.data?.map(r => r.visit_id) || []),
      new Set(fastResults.data?.map(r => r.visit_id) || []),
      new Set(socialResults.data?.map(r => r.visit_id) || []),
      new Set(tobaccoResults.data?.map(r => r.visit_id) || []),
      new Set(fagerstromResults.data?.map(r => r.visit_id) || []),
      new Set(physicalParamsResults.data?.map(r => r.visit_id) || []),
      new Set(bloodPressureResults.data?.map(r => r.visit_id) || []),
      new Set(sleepApneaResults.data?.map(r => r.visit_id) || []),
      new Set(biologicalAssessmentResults.data?.map(r => r.visit_id) || []),
      new Set(dsm5HumeurResults.data?.map(r => r.visit_id) || []),
      new Set(dsm5PsychoticResults.data?.map(r => r.visit_id) || []),
      new Set(dsm5ComorbidResults.data?.map(r => r.visit_id) || []),
      new Set(divaResults.data?.map(r => r.visit_id) || []),
      new Set(familyHistoryResults.data?.map(r => r.visit_id) || []),
      new Set(cssrsResults.data?.map(r => r.visit_id) || [])
    ];

    for (const visit of initialEvalVisits) {
      const completed = responseSets.filter(set => set.has(visit.id)).length;
      const total = 38;
      completionMap.set(visit.id, {
        completedQuestionnaires: completed,
        totalQuestionnaires: total,
        completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    }
  }

  return completionMap;
}

// ============================================================================
// PATIENT VISIT COMPLETION
// ============================================================================

export interface PatientVisitCompletion {
  patientId: string;
  visitId: string | null;
  visitType: string | null;
  scheduledDate: string | null;
  completionPercentage: number;
  conductedBy: string | null;
}

export async function getLatestVisitWithCompletion(
  patientId: string
): Promise<PatientVisitCompletion> {
  const supabase = await createClient();

  // Get the most recent visit
  const { data: visit } = await supabase
    .from('visits')
    .select('*')
    .eq('patient_id', patientId)
    .in('status', [VisitStatus.SCHEDULED, VisitStatus.IN_PROGRESS, VisitStatus.COMPLETED])
    .order('scheduled_date', { ascending: false })
    .limit(1)
    .single();

  if (!visit) {
    return {
      patientId,
      visitId: null,
      visitType: null,
      scheduledDate: null,
      completionPercentage: 0,
      conductedBy: null,
    };
  }

  const completion = await getVisitCompletionStatus(visit.id);

  return {
    patientId,
    visitId: visit.id,
    visitType: visit.visit_type,
    scheduledDate: visit.scheduled_date,
    completionPercentage: completion.completionPercentage,
    conductedBy: visit.conducted_by,
  };
}

export async function getMultiplePatientVisitCompletions(
  patientIds: string[]
): Promise<Map<string, PatientVisitCompletion>> {
  const completions = new Map<string, PatientVisitCompletion>();

  // Process in batches
  const batchSize = 10;
  for (let i = 0; i < patientIds.length; i += batchSize) {
    const batch = patientIds.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(id => getLatestVisitWithCompletion(id))
    );
    batchResults.forEach(result => {
      completions.set(result.patientId, result);
    });
  }

  return completions;
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
