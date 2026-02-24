// eFondaMental Platform - Visit Service

import { createClient } from '../supabase/server';
import {
  Visit,
  VisitInsert,
  VisitUpdate,
  VisitFull,
} from '../types/database.types';
import { VisitType, VisitStatus } from '../types/enums';
// Bipolar Screening - New module definitions
import {
  ASRM_DEFINITION,
  QIDS_DEFINITION,
  MDQ_DEFINITION,
  DIAGNOSTIC_DEFINITION,
  ORIENTATION_DEFINITION
} from '../questionnaires/bipolar/screening';
import {
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
import {
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
  DSM5_COMORBID_DEFINITION,
  DIAG_PSY_SEM_HUMEUR_ACTUELS_DEFINITION,
  DIAG_PSY_SEM_HUMEUR_DEPUIS_VISITE_DEFINITION,
  DIAG_PSY_SEM_PSYCHOTIQUES_DEFINITION,
} from '../constants/questionnaires-dsm5';
import { ConditionalDescriptor } from './visit-modules.service';
import { getVisitDetailData } from './visit-detail.service';
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
  SAPS_DEFINITION,
  SANS_DEFINITION,
  UKU_DEFINITION,
  ECV_DEFINITION,
  ISA_SZ_DEFINITION,
  ISA_SUIVI_SZ_DEFINITION,
  SUICIDE_HISTORY_SUIVI_SZ_DEFINITION,
  TROUBLES_PSYCHOTIQUES_INITIAL_DEFINITION,
  TROUBLES_PSYCHOTIQUES_ANNUEL_DEFINITION,
  COMPORTEMENTS_VIOLENTS_SZ_DEFINITION,
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
  ONAPS_SZ_DEFINITION,
  EPHP_SZ_DEFINITION,
  SZ_CVLT_DEFINITION,
  TMT_SZ_DEFINITION,
  COMMISSIONS_SZ_DEFINITION,
  LIS_SZ_DEFINITION,
  STROOP_SZ_DEFINITION,
  FLUENCES_VERBALES_SZ_DEFINITION,
  WAIS4_CRITERIA_SZ_DEFINITION,
  WAIS4_EFFICIENCE_SZ_DEFINITION,
  WAIS4_SIMILITUDES_SZ_DEFINITION,
  WAIS4_MEMOIRE_CHIFFRES_SZ_DEFINITION,
  WAIS4_MATRICES_SZ_DEFINITION,
  SSTICS_SZ_DEFINITION,
  CBQ_SZ_DEFINITION,
  DACOBS_SZ_DEFINITION,
  TAP_SZ_DEFINITION
} from '../questionnaires/schizophrenia';
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


// ============================================================================
// Conditional descriptors for questionnaires that depend on other responses
// ============================================================================

const COND_FAGERSTROM: ConditionalDescriptor = {
  dependsOn: 'TOBACCO',
  field: 'smoking_status',
  requiredValue: 'current_smoker',
  notAnsweredMessage: "Complétez d'abord l'évaluation du tabagisme",
  notMetMessage: "Non applicable - le patient n'est pas fumeur",
};

const COND_DIVA: ConditionalDescriptor = {
  dependsOn: 'DSM5_COMORBID',
  field: 'diva_evaluated',
  requiredValue: 'oui',
  notAnsweredMessage: "Complétez d'abord l'évaluation DSM5 - Troubles comorbides",
  notMetMessage: "Non applicable - le patient n'a pas été évalué avec la DIVA",
};

const COND_WAIS3: ConditionalDescriptor = {
  dependsOn: 'WAIS3_CRITERIA',
  field: 'accepted_for_neuropsy_evaluation',
  requiredValue: true,
  notAnsweredMessage: "Complétez d'abord les Critères cliniques",
  notMetMessage: "Patient non accepté pour l'évaluation neuropsychologique",
};

const COND_WAIS4: ConditionalDescriptor = {
  dependsOn: 'WAIS4_CRITERIA',
  field: 'accepted_for_neuropsy_evaluation',
  requiredValue: true,
  notAnsweredMessage: "Complétez d'abord les Critères cliniques",
  notMetMessage: "Patient non accepté pour l'évaluation neuropsychologique",
};

const COND_NEUROPSY_ROOT: ConditionalDescriptor = {
  dependsOnAny: ['WAIS3_CRITERIA', 'WAIS4_CRITERIA'],
  field: 'accepted_for_neuropsy_evaluation',
  requiredValue: true,
  notAnsweredMessage: "Complétez d'abord les Critères cliniques (WAIS-III ou WAIS-IV)",
  notMetMessage: "Patient non accepté pour l'évaluation neuropsychologique",
};

// Helper: extract only serializable fields from a questionnaire definition
function q(def: any, targetRole: string, conditional?: ConditionalDescriptor): any {
  return {
    id: def.code || def.id,
    code: def.code,
    title: def.title,
    description: def.description,
    questions: def.questions || [],
    instructions: def.instructions,
    target_role: targetRole,
    ...(conditional ? { conditional } : {}),
  };
}

// ============================================================================
// Shared module builders (reused across visit types)
// ============================================================================

function bipolarNurseModule(): VirtualModule {
  return {
    id: 'mod_nurse',
    name: 'Infirmier',
    description: 'Évaluation par l\'infirmier',
    questionnaires: [
      q(TOBACCO_DEFINITION, 'healthcare_professional'),
      q(FAGERSTROM_DEFINITION, 'healthcare_professional', COND_FAGERSTROM),
      q(PHYSICAL_PARAMS_DEFINITION, 'healthcare_professional'),
      q(BLOOD_PRESSURE_DEFINITION, 'healthcare_professional'),
      q(ECG_DEFINITION, 'healthcare_professional'),
      q(SLEEP_APNEA_DEFINITION, 'healthcare_professional'),
      q(BIOLOGICAL_ASSESSMENT_DEFINITION, 'healthcare_professional'),
    ],
  };
}

function bipolarThymicModule(): VirtualModule {
  return {
    id: 'mod_thymic_eval',
    name: 'Evaluation état thymique et fonctionnement',
    description: 'Évaluation de l\'état thymique et du fonctionnement',
    questionnaires: [
      q(MADRS_DEFINITION, 'healthcare_professional'),
      q(YMRS_DEFINITION, 'healthcare_professional'),
      q(CGI_DEFINITION, 'healthcare_professional'),
      q(EGF_DEFINITION, 'healthcare_professional'),
      q(ALDA_DEFINITION, 'healthcare_professional'),
      q(ETAT_PATIENT_DEFINITION, 'healthcare_professional'),
      q(FAST_DEFINITION, 'healthcare_professional'),
    ],
  };
}

function bipolarNeuropsyModule(): VirtualModule {
  return {
    id: 'mod_neuropsy',
    name: 'Evaluation Neuropsychologique',
    description: 'Évaluation neuropsychologique (Tests indépendants, WAIS-III, WAIS-IV)',
    questionnaires: [
      q(CVLT_DEFINITION, 'healthcare_professional', COND_NEUROPSY_ROOT),
      q(TMT_DEFINITION, 'healthcare_professional', COND_NEUROPSY_ROOT),
      q(STROOP_DEFINITION, 'healthcare_professional', COND_NEUROPSY_ROOT),
      q(FLUENCES_VERBALES_DEFINITION, 'healthcare_professional', COND_NEUROPSY_ROOT),
      q(MEM3_SPATIAL_DEFINITION, 'healthcare_professional', COND_NEUROPSY_ROOT),
    ],
    sections: [
      {
        id: 'wais3',
        name: 'WAIS-III',
        questionnaires: [
          q(WAIS3_CRITERIA_DEFINITION, 'healthcare_professional'),
          q(WAIS3_LEARNING_DEFINITION, 'healthcare_professional', COND_WAIS3),
          q(WAIS3_VOCABULAIRE_DEFINITION, 'healthcare_professional', COND_WAIS3),
          q(WAIS3_MATRICES_DEFINITION, 'healthcare_professional', COND_WAIS3),
          q(WAIS3_CODE_SYMBOLES_DEFINITION, 'healthcare_professional', COND_WAIS3),
          q(WAIS3_DIGIT_SPAN_DEFINITION, 'healthcare_professional', COND_WAIS3),
          q(WAIS3_CPT2_DEFINITION, 'healthcare_professional', COND_WAIS3),
        ],
      },
      {
        id: 'wais4',
        name: 'WAIS-IV',
        questionnaires: [
          q(WAIS4_CRITERIA_DEFINITION, 'healthcare_professional'),
          q(COBRA_DEFINITION, 'healthcare_professional'),
          q(CPT3_DEFINITION, 'healthcare_professional'),
          q(TEST_COMMISSIONS_DEFINITION, 'healthcare_professional'),
          q(SCIP_DEFINITION, 'healthcare_professional'),
          q(WAIS4_SIMILITUDES_DEFINITION, 'healthcare_professional'),
          q(WAIS4_LEARNING_DEFINITION, 'healthcare_professional', COND_WAIS4),
          q(WAIS4_MATRICES_DEFINITION, 'healthcare_professional', COND_WAIS4),
          q(WAIS4_CODE_DEFINITION, 'healthcare_professional', COND_WAIS4),
          q(WAIS4_DIGIT_SPAN_DEFINITION, 'healthcare_professional', COND_WAIS4),
        ],
      },
    ],
  };
}

function bipolarAutoEtatModule(): VirtualModule {
  return {
    id: 'mod_auto_etat',
    name: 'Autoquestionnaires - ETAT',
    description: 'Questionnaires sur l\'état actuel du patient',
    questionnaires: [
      q(EQ5D5L_DEFINITION, 'patient'),
      q(PRISE_M_DEFINITION, 'patient'),
      q(STAI_YA_DEFINITION, 'patient'),
      q(MARS_DEFINITION, 'patient'),
      q(MATHYS_DEFINITION, 'patient'),
      q(ASRM_DEFINITION, 'patient'),
      q(QIDS_DEFINITION, 'patient'),
      q(PSQI_DEFINITION, 'patient'),
      q(EPWORTH_DEFINITION, 'patient'),
    ],
  };
}

function schizophreniaModules(isAnnual: boolean = false): VirtualModule[] {
  const autoQuestionnaires = [
    q(CBQ_SZ_DEFINITION, 'patient'),
    q(DACOBS_SZ_DEFINITION, 'patient'),
    q(SQOL_SZ_DEFINITION, 'patient'),
    ...(!isAnnual ? [q(CTQ_SZ_DEFINITION, 'patient')] : []),
    q(MARS_SZ_DEFINITION, 'patient'),
    q(BIS_SZ_DEFINITION, 'patient'),
    q(EQ5D5L_SZ_DEFINITION, 'patient'),
    q(IPAQ_SZ_DEFINITION, 'patient'),
    q(YBOCS_SZ_DEFINITION, 'patient'),
    ...(!isAnnual ? [q(WURS25_SZ_DEFINITION, 'patient')] : []),
    q(STORI_SZ_DEFINITION, 'patient'),
    q(SOGS_SZ_DEFINITION, 'patient'),
    q(PSQI_SZ_DEFINITION, 'patient'),
    q(PRESENTEISME_SZ_DEFINITION, 'patient'),
    q(FAGERSTROM_SZ_DEFINITION, 'patient'),
    q(BRIEF_A_AUTO_SZ_DEFINITION, 'patient'),
    q(ONAPS_SZ_DEFINITION, 'patient'),
  ];

  return [
    {
      id: 'mod_nurse',
      name: 'Infirmier',
      description: 'Évaluation par l\'infirmier',
      questionnaires: [
        q(SZ_DOSSIER_INFIRMIER_DEFINITION, 'healthcare_professional'),
        q(SZ_BILAN_BIOLOGIQUE_DEFINITION, 'healthcare_professional'),
      ],
    },
    {
      id: 'mod_hetero',
      name: 'Hétéro-questionnaires',
      description: 'Questionnaires d\'évaluation clinique',
      questionnaires: [
        q(PANSS_DEFINITION, 'healthcare_professional'),
        q(CDSS_DEFINITION, 'healthcare_professional'),
        q(YMRS_SZ_DEFINITION, 'healthcare_professional'),
        q(CGI_SZ_DEFINITION, 'healthcare_professional'),
        q(EGF_SZ_DEFINITION, 'healthcare_professional'),
        q(BARS_DEFINITION, 'healthcare_professional'),
        q(SUMD_DEFINITION, 'healthcare_professional'),
        q(SAPS_DEFINITION, 'healthcare_professional'),
        q(SANS_DEFINITION, 'healthcare_professional'),
        q(UKU_DEFINITION, 'healthcare_professional'),
        q(AIMS_DEFINITION, 'healthcare_professional'),
        q(BARNES_DEFINITION, 'healthcare_professional'),
        q(SAS_DEFINITION, 'healthcare_professional'),
        q(PSP_DEFINITION, 'healthcare_professional'),
        q(BRIEF_A_SZ_DEFINITION, 'healthcare_professional'),
      ],
    },
    {
      id: 'mod_medical_eval',
      name: 'Evaluation Médicale',
      description: 'Évaluation médicale',
      questionnaires: [
        q(ECV_DEFINITION, 'healthcare_professional'),
      ],
      sections: [
        {
          id: 'dsm5',
          name: 'DSM5',
          questionnaires: [
            q(isAnnual ? TROUBLES_PSYCHOTIQUES_ANNUEL_DEFINITION : TROUBLES_PSYCHOTIQUES_INITIAL_DEFINITION, 'healthcare_professional'),
            ...(!isAnnual ? [q(TROUBLES_COMORBIDES_SZ_DEFINITION, 'healthcare_professional')] : []),
            ...(isAnnual ? [q(COMPORTEMENTS_VIOLENTS_SZ_DEFINITION, 'healthcare_professional')] : []),
          ],
        },
        {
          id: 'suicide',
          name: 'Suicide',
          questionnaires: [
            isAnnual
              ? q(ISA_SUIVI_SZ_DEFINITION, 'healthcare_professional')
              : q(ISA_SZ_DEFINITION, 'healthcare_professional'),
            isAnnual
              ? q(SUICIDE_HISTORY_SUIVI_SZ_DEFINITION, 'healthcare_professional')
              : q(SUICIDE_HISTORY_SZ_DEFINITION, 'healthcare_professional'),
          ],
        },
        {
          id: 'histoire_somatique',
          name: 'Histoire somatique',
          questionnaires: [
            q(SZ_PERINATALITE_DEFINITION, 'healthcare_professional'),
            q(PATHO_NEURO_DEFINITION, 'healthcare_professional'),
            q(PATHO_CARDIO_DEFINITION, 'healthcare_professional'),
            q(PATHO_ENDOC_DEFINITION, 'healthcare_professional'),
            q(PATHO_DERMATO_DEFINITION, 'healthcare_professional'),
            q(PATHO_URINAIRE_DEFINITION, 'healthcare_professional'),
            q(ANTECEDENTS_GYNECO_DEFINITION, 'healthcare_professional'),
            q(PATHO_HEPATO_GASTRO_DEFINITION, 'healthcare_professional'),
            q(PATHO_ALLERGIQUE_DEFINITION, 'healthcare_professional'),
            q(AUTRES_PATHO_DEFINITION, 'healthcare_professional'),
          ],
        },
        ...(!isAnnual ? [{
          id: 'antecedents_familiaux',
          name: 'Antécédents familiaux',
          questionnaires: [
            q(ANTECEDENTS_FAMILIAUX_PSY_SZ_DEFINITION, 'healthcare_professional'),
          ],
        }] : []),
        {
          id: 'addictologie',
          name: 'Addictologie',
          questionnaires: [
            q(EVAL_ADDICTOLOGIQUE_SZ_DEFINITION, 'healthcare_professional'),
            q(TEA_COFFEE_SZ_DEFINITION, 'healthcare_professional'),
          ],
        },
      ],
    },
    {
      id: 'mod_neuropsy_sz',
      name: 'Evaluation Neuropsychologique',
      description: 'Évaluation neuropsychologique',
      questionnaires: [
        q(STROOP_SZ_DEFINITION, 'healthcare_professional'),
        q(FLUENCES_VERBALES_SZ_DEFINITION, 'healthcare_professional'),
        q(TAP_SZ_DEFINITION, 'healthcare_professional'),
      ],
      sections: [
        {
          id: 'bloc2',
          name: 'Bloc 2',
          questionnaires: [
            q(SZ_CVLT_DEFINITION, 'healthcare_professional'),
            q(TMT_SZ_DEFINITION, 'healthcare_professional'),
            q(COMMISSIONS_SZ_DEFINITION, 'healthcare_professional'),
            q(LIS_SZ_DEFINITION, 'healthcare_professional'),
          ],
        },
        {
          id: 'wais4_sz',
          name: 'WAIS-IV',
          questionnaires: [
            q(WAIS4_CRITERIA_SZ_DEFINITION, 'healthcare_professional'),
            q(WAIS4_EFFICIENCE_SZ_DEFINITION, 'healthcare_professional'),
            q(WAIS4_SIMILITUDES_SZ_DEFINITION, 'healthcare_professional'),
            q(WAIS4_MEMOIRE_CHIFFRES_SZ_DEFINITION, 'healthcare_professional'),
            q(WAIS4_MATRICES_SZ_DEFINITION, 'healthcare_professional'),
            q(SSTICS_SZ_DEFINITION, 'patient'),
          ],
        },
      ],
    },
    ...(!isAnnual ? [{
      id: 'mod_social_sz',
      name: 'Social',
      description: 'Évaluation sociale',
      questionnaires: [
        q(BILAN_SOCIAL_SZ_DEFINITION, 'healthcare_professional'),
      ],
    }] : []),
    {
      id: 'mod_auto_sz',
      name: 'Autoquestionnaires',
      description: 'Questionnaires remplis par le patient',
      questionnaires: autoQuestionnaires,
    },
    {
      id: 'mod_auto_entourage_sz',
      name: 'Autoquestionnaires entourage',
      description: 'Questionnaires remplis par l\'entourage du patient',
      questionnaires: [
        q(EPHP_SZ_DEFINITION, 'entourage'),
      ],
    },
  ];
}

// ============================================================================
// MAIN: getVisitModules — pure synchronous function
// ============================================================================

export function getVisitModules(visitType: string, pathologyType: string): VirtualModule[] {
  // ─── SCREENING ───────────────────────────────────────────────────────
  if (visitType === 'screening') {
    if (pathologyType === 'schizophrenia') {
      return [
        {
          id: 'mod_medical',
          name: 'Partie médicale',
          description: 'Évaluation clinique par le professionnel de santé',
          questionnaires: [
            q(SZ_DIAGNOSTIC_DEFINITION, 'healthcare_professional'),
            q(SZ_ORIENTATION_DEFINITION, 'healthcare_professional'),
          ],
        },
      ];
    }
    return [
      {
        id: 'mod_auto',
        name: 'Autoquestionnaires',
        description: 'Questionnaires à remplir par le patient',
        questionnaires: [
          q(ASRM_DEFINITION, 'patient'),
          q(QIDS_DEFINITION, 'patient'),
          q(MDQ_DEFINITION, 'patient'),
        ],
      },
      {
        id: 'mod_medical',
        name: 'Partie médicale',
        description: 'Évaluation clinique par le professionnel de santé',
        questionnaires: [
          q(DIAGNOSTIC_DEFINITION, 'healthcare_professional'),
          q(ORIENTATION_DEFINITION, 'healthcare_professional'),
        ],
      },
    ];
  }

  // ─── INITIAL EVALUATION ──────────────────────────────────────────────
  if (visitType === 'initial_evaluation') {
    if (pathologyType === 'schizophrenia') {
      return schizophreniaModules();
    }
    return [
      bipolarNurseModule(),
      bipolarThymicModule(),
      {
        id: 'mod_medical_eval',
        name: 'Evaluation Médicale',
        description: 'Évaluation médicale complète',
        questionnaires: [
          q(FAMILY_HISTORY_DEFINITION, 'healthcare_professional'),
        ],
        sections: [
          {
            id: 'dsm5',
            name: 'DSM5',
            questionnaires: [
              q(DSM5_HUMEUR_DEFINITION, 'healthcare_professional'),
              q(DSM5_PSYCHOTIC_DEFINITION, 'healthcare_professional'),
              q(DSM5_COMORBID_DEFINITION, 'healthcare_professional'),
              q(DIVA_DEFINITION, 'healthcare_professional', COND_DIVA),
            ],
          },
          {
            id: 'suicide',
            name: 'Suicide',
            questionnaires: [
              q(CSSRS_DEFINITION, 'healthcare_professional'),
              q(ISA_DEFINITION, 'healthcare_professional'),
              q(SIS_DEFINITION, 'healthcare_professional'),
              q(SUICIDE_HISTORY_DEFINITION, 'healthcare_professional'),
            ],
          },
          {
            id: 'histoire_somatique',
            name: 'Histoire somatique',
            questionnaires: [
              q(PERINATALITE_DEFINITION, 'healthcare_professional'),
              q(PATHO_NEURO_DEFINITION, 'healthcare_professional'),
              q(PATHO_CARDIO_DEFINITION, 'healthcare_professional'),
              q(PATHO_ENDOC_DEFINITION, 'healthcare_professional'),
              q(PATHO_DERMATO_DEFINITION, 'healthcare_professional'),
              q(PATHO_URINAIRE_DEFINITION, 'healthcare_professional'),
              q(ANTECEDENTS_GYNECO_DEFINITION, 'healthcare_professional'),
              q(PATHO_HEPATO_GASTRO_DEFINITION, 'healthcare_professional'),
              q(PATHO_ALLERGIQUE_DEFINITION, 'healthcare_professional'),
              q(AUTRES_PATHO_DEFINITION, 'healthcare_professional'),
            ],
          },
        ],
      },
      bipolarNeuropsyModule(),
      bipolarAutoEtatModule(),
      {
        id: 'mod_social',
        name: 'Social',
        description: 'Évaluation sociale',
        questionnaires: [
          q(SOCIAL_DEFINITION, 'healthcare_professional'),
        ],
      },
      {
        id: 'mod_auto_traits',
        name: 'Autoquestionnaires - TRAITS',
        description: 'Questionnaires sur les traits du patient',
        questionnaires: [
          q(ASRS_DEFINITION, 'patient'),
          q(CTQ_DEFINITION, 'patient'),
          q(BIS10_DEFINITION, 'patient'),
          q(ALS18_DEFINITION, 'patient'),
          q(AIM_DEFINITION, 'patient'),
          q(WURS25_DEFINITION, 'patient'),
          q(AQ12_DEFINITION, 'patient'),
          q(CSM_DEFINITION, 'patient'),
          q(CTI_DEFINITION, 'patient'),
        ],
      },
    ];
  }

  // ─── BIANNUAL FOLLOWUP ───────────────────────────────────────────────
  if (visitType === 'biannual_followup') {
    return [
      bipolarNurseModule(),
      {
        id: 'mod_medical_eval',
        name: 'Evaluation Médicale',
        description: 'Évaluation médicale complète',
        sections: [
          {
            id: 'dsm5',
            name: 'DSM5',
            questionnaires: [
              q(DIAG_PSY_SEM_HUMEUR_ACTUELS_DEFINITION, 'healthcare_professional'),
              q(DIAG_PSY_SEM_HUMEUR_DEPUIS_VISITE_DEFINITION, 'healthcare_professional'),
              q(DIAG_PSY_SEM_PSYCHOTIQUES_DEFINITION, 'healthcare_professional'),
            ],
          },
          {
            id: 'suicide',
            name: 'Suicide',
            questionnaires: [
              q(ISA_FOLLOWUP_DEFINITION, 'healthcare_professional'),
              q(SUICIDE_BEHAVIOR_FOLLOWUP_DEFINITION, 'healthcare_professional'),
              q(CSSRS_DEFINITION, 'healthcare_professional'),
            ],
          },
          {
            id: 'soin_suivi',
            name: 'Soin, suivi et arrêt de travail',
            questionnaires: [
              q(SUIVI_RECOMMANDATIONS_DEFINITION_NEW, 'healthcare_professional'),
              q(RECOURS_AUX_SOINS_DEFINITION_NEW, 'healthcare_professional'),
              q(TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION_NEW, 'healthcare_professional'),
              q(ARRETS_DE_TRAVAIL_DEFINITION_NEW, 'healthcare_professional'),
              q(SOMATIQUE_CONTRACEPTIF_DEFINITION_NEW, 'healthcare_professional'),
              q(STATUT_PROFESSIONNEL_DEFINITION_NEW, 'healthcare_professional'),
            ],
          },
        ],
      },
      bipolarThymicModule(),
    ];
  }

  // ─── ANNUAL EVALUATION ───────────────────────────────────────────────
  if (visitType === 'annual_evaluation') {
    if (pathologyType === 'schizophrenia') {
      return schizophreniaModules(true);
    }
    return [
      bipolarNurseModule(),
      {
        id: 'mod_thymic_eval',
        name: 'Evaluation état thymique et fonctionnement',
        description: 'Évaluation de l\'état thymique et du fonctionnement',
        questionnaires: [
          q(MADRS_DEFINITION, 'healthcare_professional'),
          q(ALDA_DEFINITION, 'healthcare_professional'),
          q(YMRS_DEFINITION, 'healthcare_professional'),
          q(FAST_DEFINITION, 'healthcare_professional'),
          q(CGI_DEFINITION, 'healthcare_professional'),
          q(EGF_DEFINITION, 'healthcare_professional'),
          q(ETAT_PATIENT_DEFINITION, 'healthcare_professional'),
        ],
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
              q(DSM5_HUMEUR_DEFINITION, 'healthcare_professional'),
              q(DSM5_PSYCHOTIC_DEFINITION, 'healthcare_professional'),
              q(DSM5_COMORBID_DEFINITION, 'healthcare_professional'),
              q(DIVA_DEFINITION, 'healthcare_professional', COND_DIVA),
            ],
          },
          {
            id: 'antecedents',
            name: 'Antécédents',
            questionnaires: [
              q(FAMILY_HISTORY_DEFINITION, 'healthcare_professional'),
            ],
          },
          {
            id: 'suicide',
            name: 'Suicide',
            questionnaires: [
              q(CSSRS_DEFINITION, 'healthcare_professional'),
              q(ISA_FOLLOWUP_DEFINITION, 'healthcare_professional'),
              q(SIS_DEFINITION, 'healthcare_professional'),
              q(SUICIDE_HISTORY_DEFINITION, 'healthcare_professional'),
            ],
          },
          {
            id: 'histoire_somatique',
            name: 'Histoire somatique',
            questionnaires: [
              q(PERINATALITE_DEFINITION, 'healthcare_professional'),
              q(PATHO_NEURO_DEFINITION, 'healthcare_professional'),
              q(PATHO_CARDIO_DEFINITION, 'healthcare_professional'),
              q(PATHO_ENDOC_DEFINITION, 'healthcare_professional'),
              q(PATHO_DERMATO_DEFINITION, 'healthcare_professional'),
              q(PATHO_URINAIRE_DEFINITION, 'healthcare_professional'),
              q(ANTECEDENTS_GYNECO_DEFINITION, 'healthcare_professional'),
              q(PATHO_HEPATO_GASTRO_DEFINITION, 'healthcare_professional'),
              q(PATHO_ALLERGIQUE_DEFINITION, 'healthcare_professional'),
              q(AUTRES_PATHO_DEFINITION, 'healthcare_professional'),
            ],
          },
          {
            id: 'soin_suivi',
            name: 'Soin, suivi et arrêt de travail',
            questionnaires: [
              q(SUIVI_RECOMMANDATIONS_DEFINITION_NEW, 'healthcare_professional'),
              q(RECOURS_AUX_SOINS_DEFINITION_NEW, 'healthcare_professional'),
              q(TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION_NEW, 'healthcare_professional'),
              q(ARRETS_DE_TRAVAIL_DEFINITION_NEW, 'healthcare_professional'),
              q(SOMATIQUE_CONTRACEPTIF_DEFINITION_NEW, 'healthcare_professional'),
              q(STATUT_PROFESSIONNEL_DEFINITION_NEW, 'healthcare_professional'),
            ],
          },
        ],
      },
      bipolarNeuropsyModule(),
      bipolarAutoEtatModule(),
    ];
  }

  return [];
}

export async function getVisitCompletionStatus(visitId: string) {
  const { visit, questionnaireStatuses } = await getVisitDetailData(visitId);
  if (!visit) throw new Error('Visit not found');

  const patient = await getPatientById(visit.patient_id);
  const pathologyType = patient?.pathology_type || 'bipolar';

  const modules = getVisitModules(visit.visit_type, pathologyType);

  let total = 0;
  let completed = 0;

  const countQ = (questionnaire: any) => {
    if (questionnaire.conditional) return;
    total++;
    if (questionnaireStatuses[questionnaire.code]?.completed) completed++;
  };

  for (const mod of modules) {
    for (const item of (mod.questionnaires || [])) countQ(item);
    for (const sec of (mod.sections || [])) {
      for (const item of sec.questionnaires) countQ(item);
    }
  }

  return {
    totalModules: modules.length,
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
