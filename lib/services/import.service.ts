// eFondaMental Platform - Import Service
// Service for importing patient data from JSON files

import { createAdminClient } from '@/lib/supabase/admin';
import { VisitType, VisitStatus } from '@/lib/types/enums';

// ============================================================================
// TYPES
// ============================================================================

export interface ImportQuestionnaireResponse {
  code: string;
  responses: Record<string, any>;
}

export interface ImportVisit {
  visit_type: string;
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
}

export interface ImportResult {
  importedPatients: number;
  importedVisits: number;
  importedResponses: number;
  errors: string[];
  warnings: string[];
}

// Map questionnaire codes to their database table names
const QUESTIONNAIRE_TABLE_MAP: Record<string, string> = {
  'ASRM_FR': 'bipolar_asrm',
  'QIDS_SR16_FR': 'bipolar_qids_sr16',
  'MDQ_FR': 'bipolar_mdq',
  'EQ5D5L_FR': 'bipolar_eq5d5l',
  'PRISE_M_FR': 'bipolar_prise_m',
  'STAI_YA_FR': 'bipolar_stai_ya',
  'MARS_FR': 'bipolar_mars',
  'MATHYS_FR': 'bipolar_mathys',
  'PSQI_FR': 'bipolar_psqi',
  'EPWORTH_FR': 'bipolar_epworth',
  'ASRS_FR': 'bipolar_asrs',
  'CTQ_FR': 'bipolar_ctq',
  'BIS10_FR': 'bipolar_bis10',
  'ALS18_FR': 'bipolar_als18',
  'AIM_FR': 'bipolar_aim',
  'WURS25_FR': 'bipolar_wurs25',
  'AQ12_FR': 'bipolar_aq12',
  'CSM_FR': 'bipolar_csm',
  'CTI_FR': 'bipolar_cti',
  'MADRS_FR': 'bipolar_madrs',
  'YMRS_FR': 'bipolar_ymrs',
  'CGI_FR': 'bipolar_cgi',
  'EGF_FR': 'bipolar_egf',
  'FAST_FR': 'bipolar_fast',
  'COBRA_FR': 'bipolar_cobra',
  'ALDA_FR': 'bipolar_alda',
  'TOBACCO_FR': 'bipolar_nurse_tobacco',
  'FAGERSTROM_FR': 'bipolar_nurse_fagerstrom',
  'PHYSICAL_PARAMS_FR': 'bipolar_nurse_physical_params',
  'BLOOD_PRESSURE_FR': 'bipolar_nurse_blood_pressure',
  'SLEEP_APNEA_FR': 'bipolar_nurse_sleep_apnea',
  'BIOLOGICAL_FR': 'bipolar_nurse_biological_assessment',
  'ETAT_PATIENT_FR': 'bipolar_etat_patient',
  'DSM5_HUMEUR_FR': 'bipolar_dsm5_humeur',
  'DSM5_PSYCHOTIC_FR': 'bipolar_dsm5_psychotic',
  'DSM5_COMORBID_FR': 'bipolar_dsm5_comorbid',
  'DIVA_FR': 'bipolar_diva',
  'FAMILY_HISTORY_FR': 'bipolar_family_history',
  'CSSRS_FR': 'bipolar_cssrs',
  'ISA_FR': 'bipolar_isa',
  'SIS_FR': 'bipolar_sis',
  'SUICIDE_HISTORY_FR': 'bipolar_suicide_history',
  'CVLT_FR': 'bipolar_cvlt',
  'TMT_FR': 'bipolar_tmt',
  'STROOP_FR': 'bipolar_stroop',
  'FLUENCES_VERBALES_FR': 'bipolar_fluences_verbales',
  'SOCIAL_FR': 'bipolar_social',
  'BIPOLAR_DIAGNOSTIC': 'bipolar_diagnostic',
  'BIPOLAR_ORIENTATION': 'bipolar_orientation',
  'NON_PHARMACOLOGIC_FR': 'bipolar_non_pharmacologic',
  'MEDICAL_DIAGNOSTIC_FR': 'bipolar_diagnostic',
  'ECG_FR': 'bipolar_nurse_ecg',
};

// ============================================================================
// IMPORT FUNCTIONS
// ============================================================================

/**
 * Import patient data from JSON
 * @param patients Array of patient data to import
 * @param centerId Target center ID
 * @param pathologyId Target pathology ID
 * @param importedBy User ID of the admin performing the import
 */
export async function importPatientData(
  patients: ImportPatient[],
  centerId: string,
  pathologyId: string,
  importedBy: string
): Promise<ImportResult> {
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
      const { data: existingPatient, error: checkError } = await supabase
        .from('patients')
        .select('id')
        .eq('center_id', centerId)
        .eq('medical_record_number', patientData.medical_record_number)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        result.errors.push(`Patient ${i + 1}: Error checking for duplicate: ${checkError.message}`);
        continue;
      }

      if (existingPatient) {
        result.warnings.push(`Patient ${i + 1}: Patient with MRN ${patientData.medical_record_number} already exists, skipping`);
        continue;
      }

      // Insert the patient
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
          metadata: {
            ...patientData.metadata,
            imported: true,
            imported_at: new Date().toISOString(),
            imported_by: importedBy,
          },
          created_by: importedBy,
          active: true,
        })
        .select()
        .single();

      if (patientError || !newPatient) {
        result.errors.push(`Patient ${i + 1}: Failed to create patient: ${patientError?.message}`);
        continue;
      }

      result.importedPatients++;

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

            // Insert the visit
            const { data: newVisit, error: visitError } = await supabase
              .from('visits')
              .insert({
                patient_id: newPatient.id,
                visit_template_id: visitTemplateId,
                visit_type: visitData.visit_type as VisitType,
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
              .select()
              .single();

            if (visitError || !newVisit) {
              result.errors.push(`Patient ${i + 1}, Visit ${j + 1}: Failed to create visit: ${visitError?.message}`);
              continue;
            }

            result.importedVisits++;

            // Process questionnaire responses for this visit
            if (visitData.questionnaires && visitData.questionnaires.length > 0) {
              for (const questionnaireData of visitData.questionnaires) {
                try {
                  const tableName = QUESTIONNAIRE_TABLE_MAP[questionnaireData.code];
                  if (!tableName) {
                    result.warnings.push(`Patient ${i + 1}, Visit ${j + 1}: Unknown questionnaire code ${questionnaireData.code}`);
                    continue;
                  }

                  // Insert the questionnaire response
                  const { error: responseError } = await supabase
                    .from(tableName)
                    .insert({
                      visit_id: newVisit.id,
                      patient_id: newPatient.id,
                      ...questionnaireData.responses,
                      completed_at: visitData.completed_date || new Date().toISOString(),
                      completed_by: importedBy,
                    });

                  if (responseError) {
                    result.warnings.push(`Patient ${i + 1}, Visit ${j + 1}, Questionnaire ${questionnaireData.code}: ${responseError.message}`);
                  } else {
                    result.importedResponses++;
                  }
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
