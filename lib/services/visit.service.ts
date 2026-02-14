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
  // Initial Evaluation - TRAITS (legacy, to be migrated)
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
  // Bipolar screening questionnaires - new tables
  getBipolarAsrmResponse,
  getBipolarQidsResponse,
  getBipolarMdqResponse,
  getBipolarDiagnosticResponse,
  getBipolarOrientationResponse
} from './bipolar-screening.service';
import {
  getBipolarInitialCompletionStatus as checkBipolarInitialCompletion,
  BIPOLAR_INITIAL_TABLES,
  // Auto ETAT questionnaires
  getEq5d5lResponse,
  getPriseMResponse,
  getStaiYaResponse,
  getMarsResponse,
  getMathysResponse,
  getPsqiResponse,
  getEpworthResponse
} from './bipolar-initial.service';
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
  getIsaSuiviResponse,
  getSisResponse,
  getSuicideHistoryResponse,
  getSuicideBehaviorFollowupResponse,
  getPerinataliteResponse,
  getPathoNeuroResponse,
  getPathoCardioResponse,
  getPathoEndocResponse,
  getPathoDermatoResponse,
  getPathoUrinaireResponse,
  getAntecedentsGynecoResponse,
  getPathoHepatoGastroResponse,
  getPathoAllergiqueResponse,
  getAutresPathoResponse,
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
  getEcgResponse,
  getSleepApneaResponse,
  getBiologicalAssessmentResponse
} from './bipolar-nurse.service';
import {
  getDsm5HumeurResponse,
  getDsm5PsychoticResponse,
  getDsm5ComorbidResponse,
  getDiagPsySemHumeurActuelsResponse,
  getDiagPsySemHumeurDepuisVisiteResponse,
  getDiagPsySemPsychotiquesResponse
} from './questionnaire-dsm5.service';
// Bipolar Screening - New module definitions
import {
  ASRM_DEFINITION,
  QIDS_DEFINITION,
  MDQ_DEFINITION,
  DIAGNOSTIC_DEFINITION,
  ORIENTATION_DEFINITION
} from '../questionnaires/bipolar/screening';
// Legacy imports for non-bipolar-screening usage
import {
  ASRM_DEFINITION as ASRM_DEFINITION_LEGACY,
  QIDS_DEFINITION as QIDS_DEFINITION_LEGACY,
  // Initial Evaluation - TRAITS (to be migrated)
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
// Bipolar Initial - Auto ETAT module (refactored)
import {
  EQ5D5L_DEFINITION,
  PRISE_M_DEFINITION,
  STAI_YA_DEFINITION,
  MARS_DEFINITION,
  MATHYS_DEFINITION,
  PSQI_DEFINITION,
  EPWORTH_DEFINITION
} from '../questionnaires/bipolar/initial/auto/etat';
// Bipolar Initial - Thymic module
import {
  MADRS_DEFINITION,
  YMRS_DEFINITION,
  CGI_DEFINITION,
  EGF_DEFINITION,
  ALDA_DEFINITION,
  ETAT_PATIENT_DEFINITION,
  FAST_DEFINITION
} from '../questionnaires/bipolar/initial/thymic';
// Bipolar Initial - Medical module
import {
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
  PATHO_DERMATO_DEFINITION,
  PATHO_URINAIRE_DEFINITION,
  ANTECEDENTS_GYNECO_DEFINITION,
  PATHO_HEPATO_GASTRO_DEFINITION,
  PATHO_ALLERGIQUE_DEFINITION,
  AUTRES_PATHO_DEFINITION
} from '../questionnaires/bipolar/initial/medical';
// Bipolar Initial - Neuropsy module
import {
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
  MEM3_SPATIAL_DEFINITION,
  WAIS3_CRITERIA_DEFINITION,
  WAIS3_LEARNING_DEFINITION,
  WAIS3_VOCABULAIRE_DEFINITION,
  WAIS3_MATRICES_DEFINITION,
  WAIS3_CODE_SYMBOLES_DEFINITION,
  WAIS3_DIGIT_SPAN_DEFINITION,
  WAIS3_CPT2_DEFINITION
} from '../questionnaires/bipolar/initial/neuropsy';
// Bipolar Followup - New module definitions
import {
  HUMEUR_ACTUELS_DEFINITION,
  HUMEUR_DEPUIS_VISITE_DEFINITION,
  PSYCHOTIQUES_DEFINITION,
  ISA_FOLLOWUP_DEFINITION,
  SUICIDE_BEHAVIOR_FOLLOWUP_DEFINITION,
  SUIVI_RECOMMANDATIONS_DEFINITION as SUIVI_RECOMMANDATIONS_DEFINITION_NEW,
  RECOURS_AUX_SOINS_DEFINITION as RECOURS_AUX_SOINS_DEFINITION_NEW,
  TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION as TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION_NEW,
  ARRETS_DE_TRAVAIL_DEFINITION as ARRETS_DE_TRAVAIL_DEFINITION_NEW,
  SOMATIQUE_CONTRACEPTIF_DEFINITION as SOMATIQUE_CONTRACEPTIF_DEFINITION_NEW,
  STATUT_PROFESSIONNEL_DEFINITION as STATUT_PROFESSIONNEL_DEFINITION_NEW
} from '../questionnaires/bipolar/followup';
import {
  SOCIAL_DEFINITION
} from '../constants/questionnaires-social';
// Bipolar Nurse module
import {
  TOBACCO_DEFINITION,
  FAGERSTROM_DEFINITION,
  PHYSICAL_PARAMS_DEFINITION,
  BLOOD_PRESSURE_DEFINITION,
  SLEEP_APNEA_DEFINITION,
  BIOLOGICAL_ASSESSMENT_DEFINITION,
  ECG_DEFINITION
} from '../questionnaires/bipolar/nurse';
import {
  DSM5_HUMEUR_DEFINITION,
  DSM5_PSYCHOTIC_DEFINITION,
  DSM5_COMORBID_DEFINITION
} from '../constants/questionnaires-dsm5';
import {
  SZ_DIAGNOSTIC_DEFINITION,
  SZ_ORIENTATION_DEFINITION,
  SZ_DOSSIER_INFIRMIER_DEFINITION,
  SZ_BILAN_BIOLOGIQUE_DEFINITION,
  PANSS_DEFINITION,
  CDSS_DEFINITION,
  BARS_DEFINITION,
  SUMD_DEFINITION,
  AIMS_DEFINITION,
  BARNES_DEFINITION,
  SAS_DEFINITION,
  PSP_DEFINITION,
  BRIEF_A_SZ_DEFINITION,
  YMRS_SZ_DEFINITION,
  CGI_SZ_DEFINITION,
  EGF_SZ_DEFINITION,
  TROUBLES_PSYCHOTIQUES_DEFINITION,
  SUICIDE_HISTORY_SZ_DEFINITION,
  TEA_COFFEE_SZ_DEFINITION,
  ANTECEDENTS_FAMILIAUX_PSY_SZ_DEFINITION,
  SZ_PERINATALITE_DEFINITION,
  EVAL_ADDICTOLOGIQUE_SZ_DEFINITION,
  TROUBLES_COMORBIDES_SZ_DEFINITION,
  BILAN_SOCIAL_SZ_DEFINITION,
  SQOL_SZ_DEFINITION,
  CTQ_SZ_DEFINITION,
  MARS_SZ_DEFINITION,
  BIS_SZ_DEFINITION,
  EQ5D5L_SZ_DEFINITION,
  IPAQ_SZ_DEFINITION,
  YBOCS_SZ_DEFINITION,
  WURS25_SZ_DEFINITION,
  STORI_SZ_DEFINITION,
  SOGS_SZ_DEFINITION,
  PSQI_SZ_DEFINITION,
  PRESENTEISME_SZ_DEFINITION,
  FAGERSTROM_SZ_DEFINITION,
  BRIEF_A_AUTO_SZ_DEFINITION,
  EPHP_SZ_DEFINITION,
  SZ_CVLT_DEFINITION,
  TMT_SZ_DEFINITION,
  COMMISSIONS_SZ_DEFINITION,
  LIS_SZ_DEFINITION,
  WAIS4_CRITERIA_SZ_DEFINITION,
  WAIS4_EFFICIENCE_SZ_DEFINITION,
  WAIS4_SIMILITUDES_SZ_DEFINITION,
  WAIS4_MEMOIRE_CHIFFRES_SZ_DEFINITION,
  WAIS4_MATRICES_SZ_DEFINITION,
  SSTICS_SZ_DEFINITION,
  CBQ_SZ_DEFINITION,
  DACOBS_SZ_DEFINITION
} from '../questionnaires/schizophrenia';
import {
  getHumeurActuelsResponse,
  getHumeurDepuisVisiteResponse,
  getPsychotiquesResponse,
  getIsaFollowupResponse,
  getSuicideBehaviorFollowupResponse as getSuicideBehaviorFollowupResponseNew,
  getSuiviRecommandationsResponse,
  getRecoursAuxSoinsResponse,
  getTraitementNonPharmaResponse,
  getArretsTravailResponse,
  getSomatiqueContraceptifResponse,
  getStatutProfessionnelResponse
} from './bipolar-followup.service';
import {
  getScreeningSzDiagnosticResponse,
  getScreeningSzOrientationResponse
} from './questionnaire-schizophrenia.service';
import {
  getSchizophreniaInitialCompletionStatus as checkSchizophreniaInitialCompletion,
  SCHIZOPHRENIA_INITIAL_TABLES,
  getDossierInfirmierSzResponse,
  getBilanBiologiqueSzResponse,
  getSapsResponse,
  getPanssResponse,
  getCdssResponse,
  getBarsResponse,
  getSumdResponse,
  getAimsResponse,
  getBarnesResponse,
  getSasResponse,
  getPspResponse
} from './schizophrenia-initial.service';
import { getPatientById } from './patient.service';

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

/**
 * Update the visit completion status (percentage, completed/total counts)
 * This is called from the visit detail page after calculating accurate progress
 * from the constructed modules, ensuring the stored value matches what's displayed.
 */
export async function updateVisitCompletionStatus(
  visitId: string,
  completionStatus: {
    completionPercentage: number;
    completedQuestionnaires: number;
    totalQuestionnaires: number;
  }
): Promise<void> {
  const supabase = await createClient();

  console.log('[updateVisitCompletionStatus] Updating visit:', visitId, 'with:', completionStatus);

  // First verify the visit exists and check current value
  const { data: currentVisit, error: fetchError } = await supabase
    .from('visits')
    .select('id, completion_percentage, completed_questionnaires, total_questionnaires')
    .eq('id', visitId)
    .single();

  if (fetchError) {
    console.error('[updateVisitCompletionStatus] Failed to fetch visit:', fetchError);
    return;
  }
  console.log('[updateVisitCompletionStatus] Current visit data:', currentVisit);

  // Now update
  const { data, error } = await supabase
    .from('visits')
    .update({
      completion_percentage: completionStatus.completionPercentage,
      completed_questionnaires: completionStatus.completedQuestionnaires,
      total_questionnaires: completionStatus.totalQuestionnaires,
      completion_updated_at: new Date().toISOString()
    })
    .eq('id', visitId)
    .select('id, completion_percentage, completed_questionnaires, total_questionnaires')
    .single();

  if (error) {
    console.error('[updateVisitCompletionStatus] Update failed:', error);
  } else {
    console.log('[updateVisitCompletionStatus] Update success:', data);
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
    // Get patient to determine pathology-specific modules
    const patient = await getPatientById(visit.patient_id);
    const pathologyType = patient?.pathology_type;
    
    // Schizophrenia screening - only medical questionnaires (no autoquestionnaires)
    if (pathologyType === 'schizophrenia') {
      return [
        {
          id: 'mod_medical',
          name: 'Partie medicale',
          description: 'Evaluation clinique par le professionnel de sante',
          questionnaires: [SZ_DIAGNOSTIC_DEFINITION, SZ_ORIENTATION_DEFINITION]
        }
      ];
    }
    
    // Default (bipolar and others) screening
    return [
      {
        id: 'mod_auto',
        name: 'Autoquestionnaires',
        description: 'Questionnaires a remplir par le patient',
        questionnaires: [ASRM_DEFINITION, QIDS_DEFINITION, MDQ_DEFINITION]
      },
      {
        id: 'mod_medical',
        name: 'Partie medicale',
        description: 'Evaluation clinique par le professionnel de sante',
        questionnaires: [DIAGNOSTIC_DEFINITION, ORIENTATION_DEFINITION]
      }
    ];
  }

  if (visit.visit_type === 'initial_evaluation') {
    // Get patient to determine pathology-specific modules
    const patient = await getPatientById(visit.patient_id);
    const pathologyType = patient?.pathology_type;
    
    // Schizophrenia initial evaluation - uses Dossier Infirmier questionnaire in nurse module
    // and PANSS in hetero-questionnaires module
    if (pathologyType === 'schizophrenia') {
      return [
        {
          id: 'mod_nurse',
          name: 'Infirmier',
          description: 'Evaluation par l\'infirmier',
          questionnaires: [SZ_DOSSIER_INFIRMIER_DEFINITION, SZ_BILAN_BIOLOGIQUE_DEFINITION]
        },
        {
          id: 'mod_hetero',
          name: 'Hetero-questionnaires',
          description: 'Questionnaires d\'evaluation clinique',
          questionnaires: [
            PANSS_DEFINITION, 
            CDSS_DEFINITION, 
            BARS_DEFINITION, 
            SUMD_DEFINITION, 
            AIMS_DEFINITION, 
            BARNES_DEFINITION, 
            SAS_DEFINITION, 
            PSP_DEFINITION, 
            BRIEF_A_SZ_DEFINITION,
            YMRS_SZ_DEFINITION,
            CGI_SZ_DEFINITION,
            EGF_SZ_DEFINITION
          ]
        },
        {
          id: 'mod_medical_eval',
          name: 'Evaluation Médicale',
          description: 'Évaluation médicale complète',
          sections: [
            {
              id: 'dsm5',
              name: 'DSM5',
              questionnaires: [TROUBLES_PSYCHOTIQUES_DEFINITION, TROUBLES_COMORBIDES_SZ_DEFINITION]
            },
            {
              id: 'suicide',
              name: 'Suicide',
              questionnaires: [ISA_DEFINITION, SUICIDE_HISTORY_SZ_DEFINITION]
            },
            {
              id: 'antecedents_familiaux',
              name: 'Antecedents familiaux',
              questionnaires: [ANTECEDENTS_FAMILIAUX_PSY_SZ_DEFINITION]
            },
            {
              id: 'histoire_somatique',
              name: 'Histoire somatique',
              questionnaires: [SZ_PERINATALITE_DEFINITION]
            },
            {
              id: 'addictologie',
              name: 'Addictologie',
              questionnaires: [EVAL_ADDICTOLOGIQUE_SZ_DEFINITION, TEA_COFFEE_SZ_DEFINITION]
            }
          ]
        },
        {
          id: 'mod_neuropsy_sz',
          name: 'Evaluation Neuropsychologique',
          description: 'Évaluation neuropsychologique',
          sections: [
            {
              id: 'bloc2',
              name: 'Bloc 2',
              questionnaires: [
                {
                  id: SZ_CVLT_DEFINITION.id,
                  code: SZ_CVLT_DEFINITION.code,
                  title: SZ_CVLT_DEFINITION.title,
                  description: SZ_CVLT_DEFINITION.description,
                  questions: SZ_CVLT_DEFINITION.questions
                },
                {
                  id: TMT_SZ_DEFINITION.id,
                  code: TMT_SZ_DEFINITION.code,
                  title: TMT_SZ_DEFINITION.title,
                  description: TMT_SZ_DEFINITION.description,
                  questions: TMT_SZ_DEFINITION.questions
                },
                {
                  id: COMMISSIONS_SZ_DEFINITION.id,
                  code: COMMISSIONS_SZ_DEFINITION.code,
                  title: COMMISSIONS_SZ_DEFINITION.title,
                  description: COMMISSIONS_SZ_DEFINITION.description,
                  questions: COMMISSIONS_SZ_DEFINITION.questions
                },
                {
                  id: LIS_SZ_DEFINITION.id,
                  code: LIS_SZ_DEFINITION.code,
                  title: LIS_SZ_DEFINITION.title,
                  description: LIS_SZ_DEFINITION.description,
                  questions: LIS_SZ_DEFINITION.questions
                }
              ]
            },
            {
              id: 'wais4_sz',
              name: 'WAIS-IV',
              questionnaires: [
                {
                  id: WAIS4_CRITERIA_SZ_DEFINITION.id,
                  code: WAIS4_CRITERIA_SZ_DEFINITION.code,
                  title: WAIS4_CRITERIA_SZ_DEFINITION.title,
                  description: WAIS4_CRITERIA_SZ_DEFINITION.description,
                  questions: WAIS4_CRITERIA_SZ_DEFINITION.questions
                },
                {
                  id: WAIS4_EFFICIENCE_SZ_DEFINITION.id,
                  code: WAIS4_EFFICIENCE_SZ_DEFINITION.code,
                  title: WAIS4_EFFICIENCE_SZ_DEFINITION.title,
                  description: WAIS4_EFFICIENCE_SZ_DEFINITION.description,
                  questions: WAIS4_EFFICIENCE_SZ_DEFINITION.questions
                },
                {
                  id: WAIS4_SIMILITUDES_SZ_DEFINITION.id,
                  code: WAIS4_SIMILITUDES_SZ_DEFINITION.code,
                  title: WAIS4_SIMILITUDES_SZ_DEFINITION.title,
                  description: WAIS4_SIMILITUDES_SZ_DEFINITION.description,
                  questions: WAIS4_SIMILITUDES_SZ_DEFINITION.questions
                },
                {
                  id: WAIS4_MEMOIRE_CHIFFRES_SZ_DEFINITION.id,
                  code: WAIS4_MEMOIRE_CHIFFRES_SZ_DEFINITION.code,
                  title: WAIS4_MEMOIRE_CHIFFRES_SZ_DEFINITION.title,
                  description: WAIS4_MEMOIRE_CHIFFRES_SZ_DEFINITION.description,
                  questions: WAIS4_MEMOIRE_CHIFFRES_SZ_DEFINITION.questions
                },
                {
                  id: WAIS4_MATRICES_SZ_DEFINITION.id,
                  code: WAIS4_MATRICES_SZ_DEFINITION.code,
                  title: WAIS4_MATRICES_SZ_DEFINITION.title,
                  description: WAIS4_MATRICES_SZ_DEFINITION.description,
                  questions: WAIS4_MATRICES_SZ_DEFINITION.questions
                },
                {
                  id: SSTICS_SZ_DEFINITION.id,
                  code: SSTICS_SZ_DEFINITION.code,
                  title: SSTICS_SZ_DEFINITION.title,
                  description: SSTICS_SZ_DEFINITION.description,
                  questions: SSTICS_SZ_DEFINITION.questions
                }
              ]
            }
          ]
        },
        {
          id: 'mod_social_sz',
          name: 'Social',
          description: 'Évaluation sociale',
          questionnaires: [BILAN_SOCIAL_SZ_DEFINITION]
        },
        {
          id: 'mod_auto_sz',
          name: 'Autoquestionnaires',
          description: 'Questionnaires remplis par le patient',
          questionnaires: [
            {
              id: CBQ_SZ_DEFINITION.id,
              code: CBQ_SZ_DEFINITION.code,
              title: CBQ_SZ_DEFINITION.title,
              description: CBQ_SZ_DEFINITION.description,
              questions: CBQ_SZ_DEFINITION.questions
            },
            {
              id: DACOBS_SZ_DEFINITION.id,
              code: DACOBS_SZ_DEFINITION.code,
              title: DACOBS_SZ_DEFINITION.title,
              description: DACOBS_SZ_DEFINITION.description,
              questions: DACOBS_SZ_DEFINITION.questions
            },
            {
              // Exclude scoring functions for client serialization
              id: SQOL_SZ_DEFINITION.id,
              code: SQOL_SZ_DEFINITION.code,
              title: SQOL_SZ_DEFINITION.title,
              description: SQOL_SZ_DEFINITION.description,
              questions: SQOL_SZ_DEFINITION.questions,
            },
            {
              id: CTQ_SZ_DEFINITION.id,
              code: CTQ_SZ_DEFINITION.code,
              title: CTQ_SZ_DEFINITION.title,
              description: CTQ_SZ_DEFINITION.description,
              questions: CTQ_SZ_DEFINITION.questions,
            },
            {
              id: MARS_SZ_DEFINITION.id,
              code: MARS_SZ_DEFINITION.code,
              title: MARS_SZ_DEFINITION.title,
              description: MARS_SZ_DEFINITION.description,
              questions: MARS_SZ_DEFINITION.questions,
            },
            {
              id: BIS_SZ_DEFINITION.id,
              code: BIS_SZ_DEFINITION.code,
              title: BIS_SZ_DEFINITION.title,
              description: BIS_SZ_DEFINITION.description,
              questions: BIS_SZ_DEFINITION.questions,
            },
            {
              id: EQ5D5L_SZ_DEFINITION.id,
              code: EQ5D5L_SZ_DEFINITION.code,
              title: EQ5D5L_SZ_DEFINITION.title,
              description: EQ5D5L_SZ_DEFINITION.description,
              questions: EQ5D5L_SZ_DEFINITION.questions,
            },
            {
              id: IPAQ_SZ_DEFINITION.id,
              code: IPAQ_SZ_DEFINITION.code,
              title: IPAQ_SZ_DEFINITION.title,
              description: IPAQ_SZ_DEFINITION.description,
              questions: IPAQ_SZ_DEFINITION.questions,
            },
            {
              id: YBOCS_SZ_DEFINITION.id,
              code: YBOCS_SZ_DEFINITION.code,
              title: YBOCS_SZ_DEFINITION.title,
              description: YBOCS_SZ_DEFINITION.description,
              questions: YBOCS_SZ_DEFINITION.questions,
            },
            {
              id: WURS25_SZ_DEFINITION.id,
              code: WURS25_SZ_DEFINITION.code,
              title: WURS25_SZ_DEFINITION.title,
              description: WURS25_SZ_DEFINITION.description,
              questions: WURS25_SZ_DEFINITION.questions,
            },
            {
              id: STORI_SZ_DEFINITION.id,
              code: STORI_SZ_DEFINITION.code,
              title: STORI_SZ_DEFINITION.title,
              description: STORI_SZ_DEFINITION.description,
              questions: STORI_SZ_DEFINITION.questions,
            },
            {
              id: SOGS_SZ_DEFINITION.id,
              code: SOGS_SZ_DEFINITION.code,
              title: SOGS_SZ_DEFINITION.title,
              description: SOGS_SZ_DEFINITION.description,
              questions: SOGS_SZ_DEFINITION.questions,
            },
            {
              id: PSQI_SZ_DEFINITION.id,
              code: PSQI_SZ_DEFINITION.code,
              title: PSQI_SZ_DEFINITION.title,
              description: PSQI_SZ_DEFINITION.description,
              questions: PSQI_SZ_DEFINITION.questions,
            },
            {
              id: PRESENTEISME_SZ_DEFINITION.id,
              code: PRESENTEISME_SZ_DEFINITION.code,
              title: PRESENTEISME_SZ_DEFINITION.title,
              description: PRESENTEISME_SZ_DEFINITION.description,
              questions: PRESENTEISME_SZ_DEFINITION.questions,
            },
            {
              id: FAGERSTROM_SZ_DEFINITION.id,
              code: FAGERSTROM_SZ_DEFINITION.code,
              title: FAGERSTROM_SZ_DEFINITION.title,
              description: FAGERSTROM_SZ_DEFINITION.description,
              questions: FAGERSTROM_SZ_DEFINITION.questions,
            },
            {
              id: BRIEF_A_AUTO_SZ_DEFINITION.id,
              code: BRIEF_A_AUTO_SZ_DEFINITION.code,
              title: BRIEF_A_AUTO_SZ_DEFINITION.title,
              description: BRIEF_A_AUTO_SZ_DEFINITION.description,
              questions: BRIEF_A_AUTO_SZ_DEFINITION.questions,
            }
          ]
        },
        {
          id: 'mod_auto_entourage_sz',
          name: 'Autoquestionnaires entourage',
          description: 'Questionnaires remplis par l\'entourage du patient',
          questionnaires: [
            {
              id: EPHP_SZ_DEFINITION.id,
              code: EPHP_SZ_DEFINITION.code,
              title: EPHP_SZ_DEFINITION.title,
              description: EPHP_SZ_DEFINITION.description,
              questions: EPHP_SZ_DEFINITION.questions,
            }
          ]
        }
      ];
    }

    // Default (bipolar and others) initial evaluation
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
        questionnaires: [
          DSM5_HUMEUR_DEFINITION,
          DSM5_PSYCHOTIC_DEFINITION,
          DSM5_COMORBID_DEFINITION,
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
          PATHO_DERMATO_DEFINITION,
          PATHO_URINAIRE_DEFINITION,
          ANTECEDENTS_GYNECO_DEFINITION,
          PATHO_HEPATO_GASTRO_DEFINITION,
          PATHO_ALLERGIQUE_DEFINITION,
          AUTRES_PATHO_DEFINITION
        ]
      },
      {
        id: 'mod_neuropsy',
        name: 'Evaluation Neuropsychologique',
        description: 'Évaluation neuropsychologique',
        // Root level: Independent tests shared by WAIS-III and WAIS-IV protocols
        questionnaires: [
          CVLT_DEFINITION,
          TMT_DEFINITION,
          STROOP_DEFINITION,
          FLUENCES_VERBALES_DEFINITION,
          MEM3_SPATIAL_DEFINITION
        ],
        sections: [
          {
            id: 'wais3',
            name: 'WAIS-III',
            questionnaires: [WAIS3_CRITERIA_DEFINITION, WAIS3_LEARNING_DEFINITION, WAIS3_VOCABULAIRE_DEFINITION, WAIS3_MATRICES_DEFINITION, WAIS3_CODE_SYMBOLES_DEFINITION, WAIS3_DIGIT_SPAN_DEFINITION, WAIS3_CPT2_DEFINITION]
          },
          {
            id: 'wais4',
            name: 'WAIS-IV',
            questionnaires: [WAIS4_CRITERIA_DEFINITION, WAIS4_LEARNING_DEFINITION, WAIS4_MATRICES_DEFINITION, WAIS4_CODE_DEFINITION, WAIS4_DIGIT_SPAN_DEFINITION, WAIS4_SIMILITUDES_DEFINITION, COBRA_DEFINITION, CPT3_DEFINITION, TEST_COMMISSIONS_DEFINITION, SCIP_DEFINITION]
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

  if (visit.visit_type === 'biannual_followup') {
    return [
      {
        id: 'mod_nurse',
        name: 'Infirmier',
        description: 'Évaluation par l\'infirmier',
        questionnaires: [TOBACCO_DEFINITION, FAGERSTROM_DEFINITION, PHYSICAL_PARAMS_DEFINITION, BLOOD_PRESSURE_DEFINITION, SLEEP_APNEA_DEFINITION, BIOLOGICAL_ASSESSMENT_DEFINITION]
      },
      {
        id: 'mod_medical_eval',
        name: 'Evaluation Médicale',
        description: 'Évaluation médicale complète',
        sections: [
          {
            id: 'dsm5',
            name: 'DSM5',
            questionnaires: [
              HUMEUR_ACTUELS_DEFINITION,
              HUMEUR_DEPUIS_VISITE_DEFINITION,
              PSYCHOTIQUES_DEFINITION
            ]
          },
          {
            id: 'suicide',
            name: 'Suicide',
            questionnaires: [
              ISA_FOLLOWUP_DEFINITION,
              SUICIDE_BEHAVIOR_FOLLOWUP_DEFINITION,
              CSSRS_DEFINITION
            ]
          },
          {
            id: 'soin_suivi',
            name: 'Soin, suivi et arrêt de travail',
            questionnaires: [
              SUIVI_RECOMMANDATIONS_DEFINITION_NEW,
              RECOURS_AUX_SOINS_DEFINITION_NEW,
              TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION_NEW,
              ARRETS_DE_TRAVAIL_DEFINITION_NEW,
              SOMATIQUE_CONTRACEPTIF_DEFINITION_NEW,
              STATUT_PROFESSIONNEL_DEFINITION_NEW
            ]
          }
        ]
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
    ];
  }

  if (visit.visit_type === 'annual_evaluation') {
    // Get patient to determine pathology-specific modules
    const patient = await getPatientById(visit.patient_id);
    const pathologyType = patient?.pathology_type;
    
    // Schizophrenia annual evaluation - uses same nurse module as initial visit
    if (pathologyType === 'schizophrenia') {
      return [
        {
          id: 'mod_nurse',
          name: 'Infirmier',
          description: 'Évaluation par l\'infirmier',
          questionnaires: [SZ_DOSSIER_INFIRMIER_DEFINITION, SZ_BILAN_BIOLOGIQUE_DEFINITION]
        }
      ];
    }
    
    // Bipolar annual evaluation modules
    return [
      {
        id: 'mod_nurse',
        name: 'Infirmier',
        description: 'Évaluation par l\'infirmier',
        questionnaires: [TOBACCO_DEFINITION, FAGERSTROM_DEFINITION, PHYSICAL_PARAMS_DEFINITION, BLOOD_PRESSURE_DEFINITION, ECG_DEFINITION, SLEEP_APNEA_DEFINITION, BIOLOGICAL_ASSESSMENT_DEFINITION]
      },
      {
        id: 'mod_thymic_eval',
        name: 'Evaluation état thymique et fonctionnement',
        description: 'Évaluation de l\'état thymique et du fonctionnement',
        questionnaires: [
          MADRS_DEFINITION,
          ALDA_DEFINITION,
          YMRS_DEFINITION,
          FAST_DEFINITION,
          CGI_DEFINITION,
          EGF_DEFINITION,
          ETAT_PATIENT_DEFINITION
        ]
      },
      {
        id: 'mod_medical_eval',
        name: 'Evaluation Médicale',
        description: 'Évaluation médicale complète',
        sections: [
          {
            id: 'dsm5',
            name: 'DSM5',
            questionnaires: [
              DSM5_HUMEUR_DEFINITION,
              DSM5_PSYCHOTIC_DEFINITION,
              DSM5_COMORBID_DEFINITION,
              DIVA_DEFINITION
            ]
          },
          {
            id: 'antecedents',
            name: 'Antécédents',
            questionnaires: [
              FAMILY_HISTORY_DEFINITION
            ]
          },
          {
            id: 'suicide',
            name: 'Suicide',
            questionnaires: [
              CSSRS_DEFINITION,
              ISA_FOLLOWUP_DEFINITION,
              SIS_DEFINITION,
              SUICIDE_HISTORY_DEFINITION
            ]
          },
          {
            id: 'histoire_somatique',
            name: 'Histoire somatique',
            questionnaires: [
              PERINATALITE_DEFINITION,
              PATHO_NEURO_DEFINITION,
              PATHO_CARDIO_DEFINITION,
              PATHO_ENDOC_DEFINITION,
              PATHO_DERMATO_DEFINITION,
              PATHO_URINAIRE_DEFINITION,
              ANTECEDENTS_GYNECO_DEFINITION,
              PATHO_HEPATO_GASTRO_DEFINITION,
              PATHO_ALLERGIQUE_DEFINITION,
              AUTRES_PATHO_DEFINITION
            ]
          },
          {
            id: 'soin_suivi',
            name: 'Soin, suivi et arrêt de travail',
            questionnaires: [
              SUIVI_RECOMMANDATIONS_DEFINITION_NEW,
              RECOURS_AUX_SOINS_DEFINITION_NEW,
              TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION_NEW,
              ARRETS_DE_TRAVAIL_DEFINITION_NEW,
              SOMATIQUE_CONTRACEPTIF_DEFINITION_NEW,
              STATUT_PROFESSIONNEL_DEFINITION_NEW
            ]
          }
        ]
      },
      {
        id: 'mod_neuropsy',
        name: 'Evaluation Neuropsychologique',
        description: 'Évaluation neuropsychologique',
        // Root level: Independent tests shared by WAIS-III and WAIS-IV protocols
        questionnaires: [
          CVLT_DEFINITION,
          TMT_DEFINITION,
          STROOP_DEFINITION,
          FLUENCES_VERBALES_DEFINITION,
          MEM3_SPATIAL_DEFINITION
        ],
        sections: [
          {
            id: 'wais3',
            name: 'WAIS-III',
            questionnaires: [WAIS3_CRITERIA_DEFINITION, WAIS3_LEARNING_DEFINITION, WAIS3_VOCABULAIRE_DEFINITION, WAIS3_MATRICES_DEFINITION, WAIS3_CODE_SYMBOLES_DEFINITION, WAIS3_DIGIT_SPAN_DEFINITION, WAIS3_CPT2_DEFINITION]
          },
          {
            id: 'wais4',
            name: 'WAIS-IV',
            questionnaires: [WAIS4_CRITERIA_DEFINITION, WAIS4_LEARNING_DEFINITION, WAIS4_MATRICES_DEFINITION, WAIS4_CODE_DEFINITION, WAIS4_DIGIT_SPAN_DEFINITION, WAIS4_SIMILITUDES_DEFINITION, COBRA_DEFINITION, CPT3_DEFINITION, TEST_COMMISSIONS_DEFINITION, SCIP_DEFINITION]
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
    // Get patient to determine pathology-specific completion tracking
    const patient = await getPatientById(visit.patient_id);
    const pathologyType = patient?.pathology_type;
    
    if (pathologyType === 'schizophrenia') {
      // Schizophrenia screening: 2 questionnaires (Diagnostic, Orientation)
      total = 2;
      totalModules = 1;
      
      const [szDiag, szOrient] = await Promise.all([
        getScreeningSzDiagnosticResponse(visitId),
        getScreeningSzOrientationResponse(visitId)
      ]);
      
      if (szDiag) completed++;
      if (szOrient) completed++;
    } else {
      // Bipolar and others: 5 questionnaires (ASRM, QIDS, MDQ, Diag, Orient)
      // Use new bipolar_* tables in public schema
      total = 5;
      totalModules = 2;

      const [asrm, qids, mdq, diag, orient] = await Promise.all([
        getBipolarAsrmResponse(visitId),
        getBipolarQidsResponse(visitId),
        getBipolarMdqResponse(visitId),
        getBipolarDiagnosticResponse(visitId),
        getBipolarOrientationResponse(visitId)
      ]);

      if (asrm) completed++;
      if (qids) completed++;
      if (mdq) completed++;
      if (diag) completed++;
      if (orient) completed++;
    }
  } else if (visit.visit_type === 'initial_evaluation') {
    // Get patient to determine pathology-specific completion tracking
    const patient = await getPatientById(visit.patient_id);
    const pathologyType = patient?.pathology_type;
    
    // For bipolar initial evaluation, use bipolar_* tables
    if (pathologyType === 'bipolar') {
      // Use the bipolar-initial.service to check completion status against bipolar_* tables
      const bipolarCompletion = await checkBipolarInitialCompletion(visitId);
      total = Object.keys(BIPOLAR_INITIAL_TABLES).length;
      totalModules = 7;
      completed = Object.values(bipolarCompletion).filter(Boolean).length;
    } else if (pathologyType === 'schizophrenia') {
      // Use the schizophrenia-initial.service to check completion status against schizophrenia_* tables
      const szCompletion = await checkSchizophreniaInitialCompletion(visitId);
      total = Object.keys(SCHIZOPHRENIA_INITIAL_TABLES).length;
      totalModules = 4; // Nurse, Hetero, Medical, Addictologique
      completed = Object.values(szCompletion).filter(Boolean).length;
    } else {
      // Other pathologies - use legacy tables
      // 9 ETAT + 9 TRAITS + 7 HETERO + 1 SOCIAL + 6 INFIRMIER + 4 DSM5 + 1 Family + 4 Suicide + 10 Histoire Somatique + 4 WAIS-4 = 55
      total = 55;
      totalModules = 7;

    const [
        eq5d5l, priseM, staiYa, mars, mathys, asrm, qids, psqi, epworth,
        asrs, ctq, bis10, als18, aim, wurs25, aq12, csm, cti,
        madrs, ymrs, cgi, egf, alda, etatPatient, fast, social,
        tobacco, fagerstrom, physicalParams, bloodPressure, sleepApnea, biologicalAssessment,
        dsm5Humeur, dsm5Psychotic, dsm5Comorbid, diva, familyHistory, cssrs, isa, sis, suicideHistory, perinatalite, pathoNeuro, pathoCardio, pathoEndoc, pathoDermato, pathoUrinaire, antecedentsGyneco, pathoHepatoGastro, pathoAllergique, autresPatho,
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
      // Pathologies Dermatologiques
      getPathoDermatoResponse(visitId),
      // Pathologies des voies urinaires
      getPathoUrinaireResponse(visitId),
      // Antécédents gynécologiques
      getAntecedentsGynecoResponse(visitId),
      // Pathologies hépato-gastro-entérologiques
      getPathoHepatoGastroResponse(visitId),
      // Pathologies allergiques et inflammatoires
      getPathoAllergiqueResponse(visitId),
      // Autres pathologies
      getAutresPathoResponse(visitId),
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
    if (pathoDermato) completed++;
    if (pathoUrinaire) completed++;
    if (antecedentsGyneco) completed++;
    if (pathoHepatoGastro) completed++;
    if (pathoAllergique) completed++;
    if (autresPatho) completed++;
    if (wais4Criteria) completed++;
    if (wais4Learning) completed++;
    if (wais4Matrices) completed++;
    if (wais4DigitSpan) completed++;
    }
  } else if (visit.visit_type === 'biannual_followup') {
    // Biannual follow-up: 6 infirmier + 7 thymic + 12 medical (6 original + 6 soin_suivi) = 25 total
    total = 25;
    totalModules = 3;

    const [
      // Infirmier questionnaires
      tobacco, fagerstrom, physicalParams, bloodPressure, sleepApnea, biologicalAssessment,
      // Thymic evaluation questionnaires
      madrs, ymrs, cgi, egf, alda, etatPatient, fast,
      // Medical evaluation questionnaires - DSM5
      humeurActuels, humeurDepuisVisite, psychotiques,
      // Suicide
      cssrs, isaFollowup, suicideBehaviorFollowup,
      // Soin, suivi et arret de travail questionnaires (separate tables now)
      suiviRecommandations, recoursAuxSoins, traitementNonPharma, arretsTravail, somatiqueContraceptif, statutProfessionnel
    ] = await Promise.all([
      // Infirmier questionnaires
      getTobaccoResponse(visitId),
      getFagerstromResponse(visitId),
      getPhysicalParamsResponse(visitId),
      getBloodPressureResponse(visitId),
      getSleepApneaResponse(visitId),
      getBiologicalAssessmentResponse(visitId),
      // Thymic evaluation questionnaires
      getMadrsResponse(visitId),
      getYmrsResponse(visitId),
      getCgiResponse(visitId),
      getEgfResponse(visitId),
      getAldaResponse(visitId),
      getEtatPatientResponse(visitId),
      getFastResponse(visitId),
      // Medical evaluation questionnaires - DSM5
      getHumeurActuelsResponse(visitId),
      getHumeurDepuisVisiteResponse(visitId),
      getPsychotiquesResponse(visitId),
      // Suicide
      getCssrsResponse(visitId),
      getIsaFollowupResponse(visitId),
      getSuicideBehaviorFollowupResponseNew(visitId),
      // Soin, suivi et arret de travail (separate tables)
      getSuiviRecommandationsResponse(visitId),
      getRecoursAuxSoinsResponse(visitId),
      getTraitementNonPharmaResponse(visitId),
      getArretsTravailResponse(visitId),
      getSomatiqueContraceptifResponse(visitId),
      getStatutProfessionnelResponse(visitId)
    ]);

    // Count infirmier questionnaires
    if (tobacco) completed++;
    if (fagerstrom) completed++;
    if (physicalParams) completed++;
    if (bloodPressure) completed++;
    if (sleepApnea) completed++;
    if (biologicalAssessment) completed++;

    // Count thymic evaluation
    if (madrs) completed++;
    if (ymrs) completed++;
    if (cgi) completed++;
    if (egf) completed++;
    if (alda) completed++;
    if (etatPatient) completed++;
    if (fast) completed++;
    
    // Count medical evaluation - DSM5
    if (humeurActuels) completed++;
    if (humeurDepuisVisite) completed++;
    if (psychotiques) completed++;
    // Suicide
    if (cssrs) completed++;
    if (isaFollowup) completed++;
    if (suicideBehaviorFollowup) completed++;
    
    // Count soin, suivi et arret de travail (6 separate tables now)
    if (suiviRecommandations) completed++;
    if (recoursAuxSoins) completed++;
    if (traitementNonPharma) completed++;
    if (arretsTravail) completed++;
    if (somatiqueContraceptif) completed++;
    if (statutProfessionnel) completed++;
  } else if (visit.visit_type === 'annual_evaluation') {
    // Get patient to determine pathology-specific completion tracking
    const patient = await getPatientById(visit.patient_id);
    const pathologyType = patient?.pathology_type;
    
    if (pathologyType === 'schizophrenia') {
      // Schizophrenia annual evaluation: 2 nurse questionnaires + 12 hetero-questionnaires = 14 total
      total = 14;
      totalModules = 2; // Nurse, Hetero
      
      const [
        dossierInfirmier, bilanBiologique,
        panss, cdss, ymrs, cgi, egf, bars, sumd, saps, aims, barnes, sas, psp
      ] = await Promise.all([
        getDossierInfirmierSzResponse(visitId),
        getBilanBiologiqueSzResponse(visitId),
        getPanssResponse(visitId),
        getCdssResponse(visitId),
        getYmrsResponse(visitId),
        getCgiResponse(visitId),
        getEgfResponse(visitId),
        getBarsResponse(visitId),
        getSumdResponse(visitId),
        getSapsResponse(visitId),
        getAimsResponse(visitId),
        getBarnesResponse(visitId),
        getSasResponse(visitId),
        getPspResponse(visitId)
      ]);
      
      if (dossierInfirmier) completed++;
      if (bilanBiologique) completed++;
      if (panss) completed++;
      if (cdss) completed++;
      if (ymrs) completed++;
      if (cgi) completed++;
      if (egf) completed++;
      if (bars) completed++;
      if (sumd) completed++;
      if (saps) completed++;
      if (aims) completed++;
      if (barnes) completed++;
      if (sas) completed++;
      if (psp) completed++;
    } else {
      // Bipolar annual evaluation: 7 infirmier + 7 thymic + 19 medical + 9 auto etat + 6 soin_suivi = 48 total
      total = 48;
      totalModules = 5;

      const [
        // Infirmier questionnaires (7)
        tobacco, fagerstrom, physicalParams, bloodPressure, ecg, sleepApnea, biologicalAssessment,
        // Thymic evaluation questionnaires (7)
        madrs, alda, ymrs, fast, cgi, egf, etatPatient,
        // Medical evaluation questionnaires (19)
        dsm5Humeur, dsm5Psychotic, dsm5Comorbid, diva, familyHistory, cssrs, isaFollowup, sis, suicideHistory,
        perinatalite, pathoNeuro, pathoCardio, pathoEndoc, pathoDermato, pathoUrinaire, antecedentsGyneco, pathoHepatoGastro, pathoAllergique, autresPatho,
        // Auto-questionnaires ETAT (9)
        eq5d5l, priseM, staiYa, mars, mathys, asrm, qids, psqi, epworth,
        // Soin, suivi et arret de travail questionnaires (separate tables now)
        suiviRecommandations, recoursAuxSoins, traitementNonPharma, arretsTravail, somatiqueContraceptif, statutProfessionnel
      ] = await Promise.all([
        // Infirmier questionnaires
        getTobaccoResponse(visitId),
        getFagerstromResponse(visitId),
        getPhysicalParamsResponse(visitId),
        getBloodPressureResponse(visitId),
        getEcgResponse(visitId),
        getSleepApneaResponse(visitId),
        getBiologicalAssessmentResponse(visitId),
        // Thymic evaluation questionnaires
        getMadrsResponse(visitId),
        getAldaResponse(visitId),
        getYmrsResponse(visitId),
        getFastResponse(visitId),
        getCgiResponse(visitId),
        getEgfResponse(visitId),
        getEtatPatientResponse(visitId),
        // Medical evaluation questionnaires
        getDsm5HumeurResponse(visitId),
        getDsm5PsychoticResponse(visitId),
        getDsm5ComorbidResponse(visitId),
        getDivaResponse(visitId),
        getFamilyHistoryResponse(visitId),
        getCssrsResponse(visitId),
        getIsaFollowupResponse(visitId),
        getSisResponse(visitId),
        getSuicideHistoryResponse(visitId),
        getPerinataliteResponse(visitId),
        getPathoNeuroResponse(visitId),
        getPathoCardioResponse(visitId),
        getPathoEndocResponse(visitId),
        getPathoDermatoResponse(visitId),
        getPathoUrinaireResponse(visitId),
        getAntecedentsGynecoResponse(visitId),
        getPathoHepatoGastroResponse(visitId),
        getPathoAllergiqueResponse(visitId),
        getAutresPathoResponse(visitId),
        // Auto-questionnaires ETAT
        getEq5d5lResponse(visitId),
        getPriseMResponse(visitId),
        getStaiYaResponse(visitId),
        getMarsResponse(visitId),
        getMathysResponse(visitId),
        getAsrmResponse(visitId),
        getQidsResponse(visitId),
        getPsqiResponse(visitId),
        getEpworthResponse(visitId),
        // Soin, suivi et arret de travail (separate tables now)
        getSuiviRecommandationsResponse(visitId),
        getRecoursAuxSoinsResponse(visitId),
        getTraitementNonPharmaResponse(visitId),
        getArretsTravailResponse(visitId),
        getSomatiqueContraceptifResponse(visitId),
        getStatutProfessionnelResponse(visitId)
      ]);

      // Count infirmier questionnaires
      if (tobacco) completed++;
      if (fagerstrom) completed++;
      if (physicalParams) completed++;
      if (bloodPressure) completed++;
      if (ecg) completed++;
      if (sleepApnea) completed++;
      if (biologicalAssessment) completed++;

      // Count thymic evaluation
      if (madrs) completed++;
      if (alda) completed++;
      if (ymrs) completed++;
      if (fast) completed++;
      if (cgi) completed++;
      if (egf) completed++;
      if (etatPatient) completed++;
      
      // Count medical evaluation
      if (dsm5Humeur) completed++;
      if (dsm5Psychotic) completed++;
      if (dsm5Comorbid) completed++;
      if (diva) completed++;
      if (familyHistory) completed++;
      if (cssrs) completed++;
      if (isaFollowup) completed++;
      if (sis) completed++;
      if (suicideHistory) completed++;
      if (perinatalite) completed++;
      if (pathoNeuro) completed++;
      if (pathoCardio) completed++;
      if (pathoEndoc) completed++;
      if (pathoDermato) completed++;
      if (pathoUrinaire) completed++;
      if (antecedentsGyneco) completed++;
      if (pathoHepatoGastro) completed++;
      if (pathoAllergique) completed++;
      if (autresPatho) completed++;
      
      // Count auto-questionnaires ETAT
      if (eq5d5l) completed++;
      if (priseM) completed++;
      if (staiYa) completed++;
      if (mars) completed++;
      if (mathys) completed++;
      if (asrm) completed++;
      if (qids) completed++;
      if (psqi) completed++;
      if (epworth) completed++;
      
      // Count soin, suivi et arret de travail (6 separate tables now)
      if (suiviRecommandations) completed++;
      if (recoursAuxSoins) completed++;
      if (traitementNonPharma) completed++;
      if (arretsTravail) completed++;
      if (somatiqueContraceptif) completed++;
      if (statutProfessionnel) completed++;
    }
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

  // Process screening visits - need to separate by pathology
  if (screeningVisits.length > 0) {
    const screeningIds = screeningVisits.map(v => v.id);
    
    // Fetch patient pathology for each screening visit
    const { data: visitPatients } = await supabase
      .from('visits')
      .select('id, patients!inner(pathology_type)')
      .in('id', screeningIds);
    
    const visitPathologyMap = new Map<string, string>();
    visitPatients?.forEach((vp: any) => {
      visitPathologyMap.set(vp.id, vp.patients?.pathology_type || 'bipolar');
    });
    
    const bipolarScreeningIds = screeningIds.filter(id => visitPathologyMap.get(id) !== 'schizophrenia');
    const szScreeningIds = screeningIds.filter(id => visitPathologyMap.get(id) === 'schizophrenia');
    
    // Process bipolar screening visits (5 questionnaires: ASRM, QIDS, MDQ, Diag, Orient)
    if (bipolarScreeningIds.length > 0) {
      const [asrmResults, qidsResults, mdqResults, diagResults, orientResults] = await Promise.all([
        supabase.from('bipolar_asrm').select('visit_id').in('visit_id', bipolarScreeningIds),
        supabase.from('bipolar_qids_sr16').select('visit_id').in('visit_id', bipolarScreeningIds),
        supabase.from('bipolar_mdq').select('visit_id').in('visit_id', bipolarScreeningIds),
        supabase.from('bipolar_diagnostic').select('visit_id').in('visit_id', bipolarScreeningIds),
        supabase.from('bipolar_orientation').select('visit_id').in('visit_id', bipolarScreeningIds)
      ]);

      const asrmSet = new Set(asrmResults.data?.map(r => r.visit_id) || []);
      const qidsSet = new Set(qidsResults.data?.map(r => r.visit_id) || []);
      const mdqSet = new Set(mdqResults.data?.map(r => r.visit_id) || []);
      const diagSet = new Set(diagResults.data?.map(r => r.visit_id) || []);
      const orientSet = new Set(orientResults.data?.map(r => r.visit_id) || []);

      for (const visitId of bipolarScreeningIds) {
        const completed = [asrmSet, qidsSet, mdqSet, diagSet, orientSet].filter(set => set.has(visitId)).length;
        const total = 5;
        completionMap.set(visitId, {
          completedQuestionnaires: completed,
          totalQuestionnaires: total,
          completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
        });
      }
    }
    
    // Process schizophrenia screening visits (2 questionnaires: Diagnostic, Orientation)
    if (szScreeningIds.length > 0) {
      const [szDiagResults, szOrientResults] = await Promise.all([
        supabase.from('schizophrenia_screening_diagnostic').select('visit_id').in('visit_id', szScreeningIds),
        supabase.from('schizophrenia_screening_orientation').select('visit_id').in('visit_id', szScreeningIds)
      ]);

      const szDiagSet = new Set(szDiagResults.data?.map(r => r.visit_id) || []);
      const szOrientSet = new Set(szOrientResults.data?.map(r => r.visit_id) || []);

      for (const visitId of szScreeningIds) {
        const completed = [szDiagSet, szOrientSet].filter(set => set.has(visitId)).length;
        const total = 2;
        completionMap.set(visitId, {
          completedQuestionnaires: completed,
          totalQuestionnaires: total,
          completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
        });
      }
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
      supabase.from('bipolar_eq5d5l').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_prise_m').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_stai_ya').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_mars').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_mathys').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_asrm').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_qids_sr16').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_psqi').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_epworth').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_asrs').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_ctq').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_bis10').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_als18').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_aim').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_wurs25').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_aq12').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_csm').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_cti').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_madrs').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_ymrs').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_cgi').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_egf').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_alda').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_etat_patient').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_fast').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_social').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_nurse_tobacco').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_nurse_fagerstrom').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_nurse_physical_params').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_nurse_blood_pressure').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_nurse_sleep_apnea').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_nurse_biological_assessment').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_dsm5_humeur').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_dsm5_psychotic').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_dsm5_comorbid').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_diva').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_family_history').select('visit_id').in('visit_id', evalIds),
      supabase.from('bipolar_cssrs').select('visit_id').in('visit_id', evalIds)
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
