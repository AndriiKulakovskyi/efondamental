// eFondaMental Platform - Import Service
// Service for importing patient data from JSON files

import { createAdminClient } from '@/lib/supabase/admin';
import { VisitType, VisitStatus } from '@/lib/types/enums';
import {
  normalizeQuestionnaireCode,
  extractRawResponses,
  computeScores,
  mapScoringResultToDbColumns,
  hasScoringFunction,
} from './import-scoring.service';

// ============================================================================
// TYPES
// ============================================================================

export interface ImportQuestionnaireResponse {
  code: string;
  responses: Record<string, any>;
}

export interface ImportVisit {
  visit_type: string;
  visit_number?: number;  // Optional - auto-assigned by DB trigger if not provided
  scheduled_date: string;
  completed_date?: string;
  status: string;
  notes?: string;
  questionnaires?: ImportQuestionnaireResponse[];
}

export interface ImportPatient {
  medical_record_number: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  place_of_birth?: string;
  years_of_education?: number;
  emergency_contact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  metadata?: Record<string, any>;
  visits?: ImportVisit[];
  assigned_to?: string;  // Optional: UUID of the doctor to assign this patient to (overrides default)
}

export interface ImportOptions {
  centerId: string;              // Required: Center to assign patients to
  pathologyId: string;           // Required: Pathology for these patients
  importedBy: string;            // Required: User performing the import
  defaultAssignedTo?: string;    // Optional: Default doctor to assign patients to (if not specified per-patient)
}

export interface ImportResult {
  importedPatients: number;
  importedVisits: number;
  importedResponses: number;
  errors: string[];
  warnings: string[];
}

function normalizeIdentityPart(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v).trim().toLowerCase();
}

function patientIdentityKey(p: {
  first_name?: unknown;
  last_name?: unknown;
  date_of_birth?: unknown;
  place_of_birth?: unknown;
}): string {
  return [
    normalizeIdentityPart(p.first_name),
    normalizeIdentityPart(p.last_name),
    String(p.date_of_birth ?? ''),
    normalizeIdentityPart(p.place_of_birth),
  ].join('|');
}

// Map questionnaire codes to their database table names
// Uses normalized codes (without _FR suffix) as the canonical key
const QUESTIONNAIRE_TABLE_MAP: Record<string, string> = {
  // Screening Auto
  'ASRM': 'bipolar_asrm',
  'QIDS_SR16': 'bipolar_qids_sr16',
  'MDQ': 'bipolar_mdq',
  
  // Auto ETAT
  'EQ5D5L': 'bipolar_eq5d5l',
  'PRISE_M': 'bipolar_prise_m',
  'STAI_YA': 'bipolar_stai_ya',
  'MARS': 'bipolar_mars',
  'MATHYS': 'bipolar_mathys',
  'PSQI': 'bipolar_psqi',
  'EPWORTH': 'bipolar_epworth',
  
  // Auto TRAITS
  'ASRS': 'bipolar_asrs',
  'CTQ': 'bipolar_ctq',
  'BIS10': 'bipolar_bis10',
  'ALS18': 'bipolar_als18',
  'AIM': 'bipolar_aim',
  'WURS25': 'bipolar_wurs25',
  'AQ12': 'bipolar_aq12',
  'CSM': 'bipolar_csm',
  'CTI': 'bipolar_cti',
  
  // Thymic
  'MADRS': 'bipolar_madrs',
  'YMRS': 'bipolar_ymrs',
  'CGI': 'bipolar_cgi',
  'EGF': 'bipolar_egf',
  'FAST': 'bipolar_fast',
  'ALDA': 'bipolar_alda',
  'ETAT_PATIENT': 'bipolar_etat_patient',
  
  // Nurse
  'TOBACCO': 'bipolar_nurse_tobacco',
  'FAGERSTROM': 'bipolar_nurse_fagerstrom',
  'PHYSICAL_PARAMS': 'bipolar_nurse_physical_params',
  'BLOOD_PRESSURE': 'bipolar_nurse_blood_pressure',
  'SLEEP_APNEA': 'bipolar_nurse_sleep_apnea',
  'BIOLOGICAL_ASSESSMENT': 'bipolar_nurse_biological_assessment',
  'ECG': 'bipolar_nurse_ecg',
  
  // Medical
  'DSM5_HUMEUR': 'bipolar_dsm5_humeur',
  'DSM5_PSYCHOTIC': 'bipolar_dsm5_psychotic',
  'DSM5_COMORBID': 'bipolar_dsm5_comorbid',
  'DIVA': 'bipolar_diva',
  'FAMILY_HISTORY': 'bipolar_family_history',
  'CSSRS': 'bipolar_cssrs',
  'ISA': 'bipolar_isa',
  'SIS': 'bipolar_sis',
  'SUICIDE_HISTORY': 'bipolar_suicide_history',
  'PERINATALITE': 'bipolar_perinatalite',
  'PATHO_NEURO': 'bipolar_patho_neuro',
  'PATHO_CARDIO': 'bipolar_patho_cardio',
  'PATHO_ENDOC': 'bipolar_patho_endoc',
  'PATHO_DERMATO': 'bipolar_patho_dermato',
  'PATHO_URINAIRE': 'bipolar_patho_urinaire',
  'ANTECEDENTS_GYNECO': 'bipolar_antecedents_gyneco',
  'PATHO_HEPATO_GASTRO': 'bipolar_patho_hepato_gastro',
  'PATHO_ALLERGIQUE': 'bipolar_patho_allergique',
  'AUTRES_PATHO': 'bipolar_autres_patho',
  
  // Neuropsy
  'CVLT': 'bipolar_cvlt',
  'TMT': 'bipolar_tmt',
  'STROOP': 'bipolar_stroop',
  'FLUENCES_VERBALES': 'bipolar_fluences_verbales',
  'COBRA': 'bipolar_cobra',
  'MEM3_SPATIAL': 'bipolar_mem3_spatial',
  'CPT3': 'bipolar_cpt3',
  'SCIP': 'bipolar_scip',
  'TEST_COMMISSIONS': 'bipolar_test_commissions',
  'WAIS4_CRITERIA': 'bipolar_wais4_criteria',
  'WAIS4_LEARNING': 'bipolar_wais4_learning',
  'WAIS4_SIMILITUDES': 'bipolar_wais4_similitudes',
  'WAIS4_MATRICES': 'bipolar_wais4_matrices',
  'WAIS4_CODE': 'bipolar_wais4_code',
  'WAIS4_DIGIT_SPAN': 'bipolar_wais4_digit_span',
  'WAIS3_CRITERIA': 'bipolar_wais3_criteria',
  'WAIS3_LEARNING': 'bipolar_wais3_learning',
  'WAIS3_VOCABULAIRE': 'bipolar_wais3_vocabulaire',
  'WAIS3_MATRICES': 'bipolar_wais3_matrices',
  'WAIS3_CODE_SYMBOLES': 'bipolar_wais3_code_symboles',
  'WAIS3_DIGIT_SPAN': 'bipolar_wais3_digit_span',
  'WAIS3_CPT2': 'bipolar_wais3_cpt2',
  
  // Social
  'SOCIAL': 'bipolar_social',
  
  // Screening Medical
  'BIPOLAR_DIAGNOSTIC': 'bipolar_diagnostic',
  'BIPOLAR_ORIENTATION': 'bipolar_orientation',
  'MEDICAL_DIAGNOSTIC': 'bipolar_diagnostic',
  
  // Follow-up
  'NON_PHARMACOLOGIC': 'bipolar_non_pharmacologic',
  'DSM5_HUMEUR_ACTUELS': 'bipolar_diag_psy_sem_humeur_actuels',
  'DSM5_HUMEUR_DEPUIS_VISITE': 'bipolar_diag_psy_sem_humeur_depuis_visite',
  'DSM5_PSYCHOTIQUES': 'bipolar_diag_psy_sem_psychotiques',

  // Semestrial/Follow-up (biannual_followup) - live DB tables are bipolar_followup_*
  'HUMEUR_ACTUELS': 'bipolar_followup_humeur_actuels',
  'HUMEUR_DEPUIS_VISITE': 'bipolar_followup_humeur_depuis_visite',
  'PSYCHOTIQUES': 'bipolar_followup_psychotiques',

  // Suicide follow-up (keep legacy alias ISA_SUIVI)
  'ISA_FOLLOWUP': 'bipolar_followup_isa',
  'ISA_SUIVI': 'bipolar_followup_isa',
  'SUICIDE_BEHAVIOR_FOLLOWUP': 'bipolar_followup_suicide_behavior',

  // Soin / suivi / arrêt de travail (separate follow-up tables)
  'SUIVI_RECOMMANDATIONS': 'bipolar_followup_suivi_recommandations',
  'RECOURS_AUX_SOINS': 'bipolar_followup_recours_aux_soins',
  'TRAITEMENT_NON_PHARMACOLOGIQUE': 'bipolar_followup_traitement_non_pharma',
  'ARRETS_DE_TRAVAIL': 'bipolar_followup_arrets_travail',
  'SOMATIQUE_CONTRACEPTIF': 'bipolar_followup_somatique_contraceptif',
  'STATUT_PROFESSIONNEL': 'bipolar_followup_statut_professionnel',
};

/**
 * Get table name for a questionnaire code.
 * Handles both normalized codes (ASRM) and legacy _FR suffix codes (ASRM_FR).
 */
function getTableName(code: string): string | undefined {
  const normalizedCode = normalizeQuestionnaireCode(code);
  return QUESTIONNAIRE_TABLE_MAP[normalizedCode];
}

// ============================================================================
// IMPORT FUNCTIONS
// ============================================================================

/**
 * Import patient data from JSON
 * @param patients Array of patient data to import
 * @param options Import options including center, pathology, and optional doctor assignment
 */
export async function importPatientData(
  patients: ImportPatient[],
  options: ImportOptions
): Promise<ImportResult> {
  const { centerId, pathologyId, importedBy, defaultAssignedTo } = options;
  const supabase = createAdminClient();
  
  const result: ImportResult = {
    importedPatients: 0,
    importedVisits: 0,
    importedResponses: 0,
    errors: [],
    warnings: [],
  };

  // Get the visit templates for this pathology
  const { data: visitTemplates, error: templatesError } = await supabase
    .from('visit_templates')
    .select('id, visit_type')
    .eq('pathology_id', pathologyId);

  if (templatesError) {
    result.errors.push(`Failed to fetch visit templates: ${templatesError.message}`);
    return result;
  }

  const templateMap = new Map<string, string>();
  for (const template of visitTemplates || []) {
    templateMap.set(template.visit_type, template.id);
  }

  // Process each patient
  for (let i = 0; i < patients.length; i++) {
    const patientData = patients[i];
    
    try {
      // Check if patient with same MRN already exists in this center
      const { data: existingPatientByMrn, error: checkError } = await supabase
        .from('patients')
        .select('id')
        .eq('center_id', centerId)
        .eq('medical_record_number', patientData.medical_record_number)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        result.errors.push(`Patient ${i + 1}: Error checking for duplicate: ${checkError.message}`);
        continue;
      }

      // Try to reuse an existing patient by identity (matches DB unique index semantics)
      // Unique identity = center + normalized(first/last/DOB/place_of_birth)
      let patientId: string | null = existingPatientByMrn?.id ?? null;

      if (patientId) {
        result.warnings.push(
          `Patient ${i + 1}: Patient with MRN ${patientData.medical_record_number} already exists; importing visits into existing patient`
        );
      }

      if (!patientId) {
        const firstName = patientData.first_name?.trim();
        const lastName = patientData.last_name?.trim();

        // Fetch candidates and compare normalized identity client-side (handles trimming like the DB index).
        const { data: identityCandidates, error: identityError } = await supabase
          .from('patients')
          .select('id, first_name, last_name, date_of_birth, place_of_birth')
          .eq('center_id', centerId)
          .eq('active', true)
          .is('deleted_at', null)
          .eq('date_of_birth', patientData.date_of_birth)
          .ilike('first_name', `%${firstName}%`)
          .ilike('last_name', `%${lastName}%`);

        if (identityError) {
          result.errors.push(`Patient ${i + 1}: Error checking identity duplicate: ${identityError.message}`);
          continue;
        }

        const targetKey = patientIdentityKey(patientData);
        const existingByIdentity = (identityCandidates || []).find((p) => patientIdentityKey(p) === targetKey);

        if (existingByIdentity?.id) {
          patientId = existingByIdentity.id;
          result.warnings.push(
            `Patient ${i + 1}: Patient identity already exists (unique identity index); importing visits into existing patient`
          );
        }
      }

      // Create the patient if not found by MRN nor identity
      if (!patientId) {
        // Determine doctor assignment: per-patient takes precedence over default
        const assignedTo = patientData.assigned_to || defaultAssignedTo || null;

        const { data: newPatient, error: patientError } = await supabase
          .from('patients')
          .insert({
            center_id: centerId,
            pathology_id: pathologyId,
            medical_record_number: patientData.medical_record_number,
            first_name: patientData.first_name,
            last_name: patientData.last_name,
            date_of_birth: patientData.date_of_birth,
            gender: patientData.gender,
            email: patientData.email,
            phone: patientData.phone,
            address: patientData.address,
            place_of_birth: patientData.place_of_birth,
            years_of_education: patientData.years_of_education,
            emergency_contact: patientData.emergency_contact,
            assigned_to: assignedTo, // Optional doctor assignment
            metadata: {
              ...patientData.metadata,
              imported: true,
              imported_at: new Date().toISOString(),
              imported_by: importedBy,
            },
            created_by: importedBy,
            active: true,
          })
          .select('id')
          .single();

        if (patientError || !newPatient) {
          result.errors.push(`Patient ${i + 1}: Failed to create patient: ${patientError?.message}`);
          continue;
        }

        patientId = newPatient.id;
        result.importedPatients++;
      }

      if (!patientId) {
        result.errors.push(`Patient ${i + 1}: Failed to resolve patient id`);
        continue;
      }

      // Process visits for this patient
      if (patientData.visits && patientData.visits.length > 0) {
        for (let j = 0; j < patientData.visits.length; j++) {
          const visitData = patientData.visits[j];
          
          try {
            const visitTemplateId = templateMap.get(visitData.visit_type);
            if (!visitTemplateId) {
              result.warnings.push(`Patient ${i + 1}, Visit ${j + 1}: No template found for visit type ${visitData.visit_type}`);
              continue;
            }

            // Idempotent visit creation:
            // If a visit already exists for the same patient + type (+ number when provided), reuse it.
            const visitNumber = visitData.visit_number || null;
            let existingVisitId: string | null = null;

            const baseVisitQuery = supabase
              .from('visits')
              .select('id')
              .eq('patient_id', patientId)
              .eq('visit_type', visitData.visit_type as VisitType);

            const { data: existingVisit, error: existingVisitError } = visitNumber
              ? await baseVisitQuery.eq('visit_number', visitNumber).single()
              : await baseVisitQuery.eq('scheduled_date', visitData.scheduled_date).single();

            if (existingVisitError && existingVisitError.code !== 'PGRST116') {
              result.errors.push(`Patient ${i + 1}, Visit ${j + 1}: Error checking existing visit: ${existingVisitError.message}`);
              continue;
            }

            if (existingVisit?.id) {
              existingVisitId = existingVisit.id;
              result.warnings.push(`Patient ${i + 1}, Visit ${j + 1}: Visit already exists; importing responses into existing visit`);
            }

            // Insert visit if missing (visit_number is optional - DB trigger auto-assigns if not provided)
            const { data: newVisit, error: visitError } = existingVisitId
              ? { data: { id: existingVisitId }, error: null }
              : await supabase
                  .from('visits')
                  .insert({
                    patient_id: patientId,
                    visit_template_id: visitTemplateId,
                    visit_type: visitData.visit_type as VisitType,
                    visit_number: visitNumber,
                    scheduled_date: visitData.scheduled_date,
                    completed_date: visitData.completed_date,
                    status: visitData.status || VisitStatus.COMPLETED,
                    notes: visitData.notes,
                    conducted_by: importedBy,
                    created_by: importedBy,
                    metadata: {
                      imported: true,
                      imported_at: new Date().toISOString(),
                    },
                  })
                  .select('id')
                  .single();

            if (visitError || !newVisit) {
              result.errors.push(`Patient ${i + 1}, Visit ${j + 1}: Failed to create visit: ${visitError?.message}`);
              continue;
            }

            if (!existingVisitId) result.importedVisits++;

            // Process questionnaire responses for this visit
            if (visitData.questionnaires && visitData.questionnaires.length > 0) {
              for (const questionnaireData of visitData.questionnaires) {
                try {
                  // Normalize the questionnaire code (strip _FR suffix)
                  const normalizedCode = normalizeQuestionnaireCode(questionnaireData.code);
                  const tableName = getTableName(questionnaireData.code);
                  
                  if (!tableName) {
                    result.warnings.push(`Patient ${i + 1}, Visit ${j + 1}: Unknown questionnaire code ${questionnaireData.code}`);
                    continue;
                  }

                  // Extract only raw response data (exclude any pre-computed scores)
                  const rawResponses = extractRawResponses(normalizedCode, questionnaireData.responses);

                  // Upsert raw questionnaire response (idempotent on visit_id)
                  const { data: insertedResponse, error: responseError } = await supabase
                    .from(tableName)
                    .upsert({
                      visit_id: newVisit.id,
                      patient_id: patientId,
                      ...rawResponses,
                      completed_at: visitData.completed_date || new Date().toISOString(),
                      completed_by: importedBy,
                    }, { onConflict: 'visit_id' })
                    .select('id')
                    .single();

                  if (responseError) {
                    result.warnings.push(`Patient ${i + 1}, Visit ${j + 1}, Questionnaire ${questionnaireData.code}: ${responseError.message}`);
                    continue;
                  }

                  // Compute scores using the scoring function if available
                  if (hasScoringFunction(normalizedCode)) {
                    const scoringResult = computeScores(normalizedCode, rawResponses);
                    
                    if (scoringResult) {
                      // Map scoring result fields to database column names
                      const dbFields = mapScoringResultToDbColumns(normalizedCode, scoringResult);
                      
                      // Update the record with computed scores
                      const { error: updateError } = await supabase
                        .from(tableName)
                        .update(dbFields)
                        .eq('id', insertedResponse.id);
                      
                      if (updateError) {
                        result.warnings.push(`Patient ${i + 1}, Visit ${j + 1}, Questionnaire ${questionnaireData.code}: Score computation saved but update failed: ${updateError.message}`);
                      }
                    }
                  }

                  result.importedResponses++;
                } catch (qErr: any) {
                  result.warnings.push(`Patient ${i + 1}, Visit ${j + 1}, Questionnaire ${questionnaireData.code}: ${qErr.message}`);
                }
              }
            }

            // Update visit completion status after importing responses
            const totalQuestionnaires = visitData.questionnaires?.length || 0;
            if (totalQuestionnaires > 0) {
              await supabase
                .from('visits')
                .update({
                  completion_percentage: 100,
                  completed_questionnaires: totalQuestionnaires,
                  total_questionnaires: totalQuestionnaires,
                  completion_updated_at: new Date().toISOString(),
                })
                .eq('id', newVisit.id);
            }

          } catch (visitErr: any) {
            result.errors.push(`Patient ${i + 1}, Visit ${j + 1}: ${visitErr.message}`);
          }
        }
      }

    } catch (patientErr: any) {
      result.errors.push(`Patient ${i + 1}: ${patientErr.message}`);
    }
  }

  return result;
}

/**
 * Validate patient data before import
 * @param patients Array of patient data to validate
 */
export function validateImportData(patients: ImportPatient[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(patients)) {
    return { valid: false, errors: ['Data must be an array of patient objects'] };
  }

  patients.forEach((patient, index) => {
    const prefix = `Patient ${index + 1}:`;

    if (!patient.medical_record_number) {
      errors.push(`${prefix} Missing required field 'medical_record_number'`);
    }
    if (!patient.first_name) {
      errors.push(`${prefix} Missing required field 'first_name'`);
    }
    if (!patient.last_name) {
      errors.push(`${prefix} Missing required field 'last_name'`);
    }
    if (!patient.date_of_birth) {
      errors.push(`${prefix} Missing required field 'date_of_birth'`);
    }

    // Validate date format
    if (patient.date_of_birth && isNaN(Date.parse(patient.date_of_birth))) {
      errors.push(`${prefix} Invalid date format for 'date_of_birth'`);
    }

    // Validate visits if present
    if (patient.visits) {
      if (!Array.isArray(patient.visits)) {
        errors.push(`${prefix} 'visits' must be an array`);
      } else {
        patient.visits.forEach((visit, vIndex) => {
          const vPrefix = `${prefix} Visit ${vIndex + 1}:`;
          
          if (!visit.visit_type) {
            errors.push(`${vPrefix} Missing required field 'visit_type'`);
          }
          if (!visit.scheduled_date) {
            errors.push(`${vPrefix} Missing required field 'scheduled_date'`);
          }
          if (visit.scheduled_date && isNaN(Date.parse(visit.scheduled_date))) {
            errors.push(`${vPrefix} Invalid date format for 'scheduled_date'`);
          }

          const validVisitTypes = ['screening', 'initial_evaluation', 'biannual_followup', 'annual_evaluation', 'off_schedule'];
          if (visit.visit_type && !validVisitTypes.includes(visit.visit_type)) {
            errors.push(`${vPrefix} Invalid visit_type '${visit.visit_type}'. Must be one of: ${validVisitTypes.join(', ')}`);
          }
        });
      }
    }
  });

  return { valid: errors.length === 0, errors };
}
