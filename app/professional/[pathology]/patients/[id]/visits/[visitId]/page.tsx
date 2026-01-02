import { getVisitDetailData } from "@/lib/services/visit-detail.service";
import { getVisitModules, VirtualModule } from "@/lib/services/visit.service";
import { getTobaccoResponse } from "@/lib/services/questionnaire-infirmier.service";
import { getDsm5ComorbidResponse } from "@/lib/services/questionnaire-dsm5.service";
import { getWais4CriteriaResponse, getWais3CriteriaResponse } from "@/lib/services/questionnaire-hetero.service";
import { getUserContext } from "@/lib/rbac/middleware";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils/date";
import { notFound, redirect } from "next/navigation";
import { Calendar, User } from "lucide-react";
import VisitActions from "./components/visit-actions";
import { ExpandableModuleCard } from "./components/expandable-module-card";
import { VisitQuickStats } from "./components/visit-quick-stats";
import { CircularProgress } from "./components/circular-progress";
import { cn } from "@/lib/utils";
import { 
  ASRM_DEFINITION, 
  QIDS_DEFINITION, 
  MDQ_DEFINITION, 
  DIAGNOSTIC_DEFINITION, 
  ORIENTATION_DEFINITION,
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
  CTI_DEFINITION
} from "@/lib/constants/questionnaires";
import {
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
  PATHO_DERMATO_DEFINITION,
  PATHO_URINAIRE_DEFINITION,
  ANTECEDENTS_GYNECO_DEFINITION,
  PATHO_HEPATO_GASTRO_DEFINITION,
  PATHO_ALLERGIQUE_DEFINITION,
  AUTRES_PATHO_DEFINITION,
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
  // Independent neuropsychological tests (shared by WAIS-III and WAIS-IV)
  MEM3_SPATIAL_DEFINITION,
  // WAIS-III definitions
  WAIS3_CRITERIA_DEFINITION,
  WAIS3_LEARNING_DEFINITION,
  WAIS3_VOCABULAIRE_DEFINITION,
  WAIS3_MATRICES_DEFINITION,
  WAIS3_CODE_SYMBOLES_DEFINITION,
  WAIS3_DIGIT_SPAN_DEFINITION,
  WAIS3_CPT2_DEFINITION
} from "@/lib/constants/questionnaires-hetero";
import {
  SOCIAL_DEFINITION
} from "@/lib/constants/questionnaires-social";
import {
  TOBACCO_DEFINITION,
  FAGERSTROM_DEFINITION,
  PHYSICAL_PARAMS_DEFINITION,
  BLOOD_PRESSURE_DEFINITION,
  SLEEP_APNEA_DEFINITION,
  BIOLOGICAL_ASSESSMENT_DEFINITION,
  ECG_DEFINITION
} from "@/lib/constants/questionnaires-infirmier";
import {
  DSM5_HUMEUR_DEFINITION,
  DSM5_PSYCHOTIC_DEFINITION,
  DSM5_COMORBID_DEFINITION
} from "@/lib/constants/questionnaires-dsm5";

export default async function VisitDetailPage({
  params,
}: {
  params: { pathology: string; id: string; visitId: string };
}) {
  const { pathology, id: patientId, visitId } = await params;
  const context = await getUserContext();

  if (!context) {
    redirect("/auth/login");
  }

  // Fetch all visit data with questionnaire statuses in a single RPC call
  const { visit, questionnaireStatuses, completionStatus: rawCompletionStatus } = await getVisitDetailData(visitId);

  if (!visit) {
    notFound();
  }

  // Fetch tobacco response to determine if Fagerstrom should be shown
  const tobaccoResponse = await getTobaccoResponse(visitId);
  
  // Determine Fagerstrom visibility based on tobacco smoking_status
  // Show Fagerstrom only if patient is current_smoker or ex_smoker
  const tobaccoAnswered = !!tobaccoResponse;
  const smokingStatus = tobaccoResponse?.smoking_status;
  const isFagerstromRequired = smokingStatus === 'current_smoker' || smokingStatus === 'ex_smoker';
  
  // Fetch DSM5 Comorbidities response to determine if DIVA should be shown
  const dsm5ComorbidResponse = await getDsm5ComorbidResponse(visitId);
  
  // Determine DIVA visibility based on diva_evaluated
  // Show DIVA only if professional answered "Oui" to diva_evaluated question
  const dsm5ComorbidAnswered = !!dsm5ComorbidResponse;
  const divaEvaluated = dsm5ComorbidResponse?.diva_evaluated;
  const isDivaRequired = divaEvaluated === 'oui';
  
  // Fetch WAIS criteria responses to determine neuropsychological questionnaire visibility
  const wais4CriteriaResponse = await getWais4CriteriaResponse(visitId);
  const wais3CriteriaResponse = await getWais3CriteriaResponse(visitId);
  
  // Determine neuropsychological questionnaire visibility based on acceptance
  const wais4CriteriaAnswered = !!wais4CriteriaResponse;
  const wais3CriteriaAnswered = !!wais3CriteriaResponse;
  const wais4Accepted = wais4CriteriaResponse?.accepted_for_neuropsy_evaluation === 1;
  const wais3Accepted = wais3CriteriaResponse?.accepted_for_neuropsy_evaluation === 1;
  
  // Adjust total questionnaires based on whether Fagerstrom and DIVA are required
  // If tobacco not answered yet, exclude Fagerstrom from total (will be dynamic)
  // If tobacco answered with non-smoker/unknown, exclude Fagerstrom
  // If tobacco answered with smoker/ex-smoker, include Fagerstrom
  const fagerstromAdjustment = (!tobaccoAnswered || !isFagerstromRequired) ? 1 : 0;
  
  // If DSM5 not answered yet, exclude DIVA from total (will be dynamic)
  // If DSM5 answered with non/ne_sais_pas, exclude DIVA
  // If DSM5 answered with oui, include DIVA
  const divaAdjustment = (!dsm5ComorbidAnswered || !isDivaRequired) ? 1 : 0;
  
  // Transform completion status to match component expectations (snake_case -> camelCase)
  // Adjust totals to exclude Fagerstrom and DIVA when not applicable
  const completionStatus = {
    totalQuestionnaires: rawCompletionStatus.total_questionnaires - fagerstromAdjustment - divaAdjustment,
    completedQuestionnaires: (() => {
      let adjusted = rawCompletionStatus.completed_questionnaires;
      // Subtract Fagerstrom if completed but not required
      if (!isFagerstromRequired && questionnaireStatuses['FAGERSTROM_FR']?.completed) {
        adjusted -= 1;
      }
      // Subtract DIVA if completed but not required
      if (!isDivaRequired && questionnaireStatuses['DIVA_FR']?.completed) {
        adjusted -= 1;
      }
      return adjusted;
    })(),
    completionPercentage: 0, // Will recalculate below
  };
  
  // Recalculate completion percentage with adjusted totals
  completionStatus.completionPercentage = completionStatus.totalQuestionnaires > 0 
    ? Math.round((completionStatus.completedQuestionnaires / completionStatus.totalQuestionnaires) * 100) 
    : 0;

  // Build modules with questionnaires based on visit type and RPC data
  let modulesWithQuestionnaires: VirtualModule[] = [];

  if (visit.visit_type === 'screening') {
    modulesWithQuestionnaires = [
      {
        id: 'mod_auto',
        name: 'Autoquestionnaires',
        description: 'Questionnaires à remplir par le patient',
        questionnaires: [
          {
            ...ASRM_DEFINITION,
            id: ASRM_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['ASRM_FR']?.completed || false,
            completedAt: questionnaireStatuses['ASRM_FR']?.completed_at,
          },
          {
            ...QIDS_DEFINITION,
            id: QIDS_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['QIDS_SR16_FR']?.completed || false,
            completedAt: questionnaireStatuses['QIDS_SR16_FR']?.completed_at,
          },
          {
            ...MDQ_DEFINITION,
            id: MDQ_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['MDQ_FR']?.completed || false,
            completedAt: questionnaireStatuses['MDQ_FR']?.completed_at,
          }
        ]
      },
      {
        id: 'mod_medical',
        name: 'Partie médicale',
        description: 'Évaluation clinique par le professionnel de santé',
        questionnaires: [
          {
            ...DIAGNOSTIC_DEFINITION,
            id: DIAGNOSTIC_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['MEDICAL_DIAGNOSTIC_FR']?.completed || false,
            completedAt: questionnaireStatuses['MEDICAL_DIAGNOSTIC_FR']?.completed_at,
          },
          {
            ...ORIENTATION_DEFINITION,
            id: ORIENTATION_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['BIPOLAR_ORIENTATION_FR']?.completed || false,
            completedAt: questionnaireStatuses['BIPOLAR_ORIENTATION_FR']?.completed_at,
          }
        ]
      }
    ];
  } else if (visit.visit_type === 'initial_evaluation') {
    // Build nurse module questionnaires with conditional Fagerstrom
    const nurseQuestionnaires: any[] = [
      {
        ...TOBACCO_DEFINITION,
        id: TOBACCO_DEFINITION.code,
        target_role: 'healthcare_professional',
        completed: questionnaireStatuses['TOBACCO_FR']?.completed || false,
        completedAt: questionnaireStatuses['TOBACCO_FR']?.completed_at,
      },
    ];
    
    // Add Fagerstrom with conditional display properties (ALWAYS visible)
    // - If tobacco not answered: show as locked (waiting for tobacco)
    // - If tobacco answered with smoker/ex-smoker: show enabled
    // - If tobacco answered with non-smoker/unknown: show as locked/grayed (not applicable)
    if (!tobaccoAnswered) {
      // Tobacco not yet completed - show Fagerstrom as conditional/locked
      nurseQuestionnaires.push({
        ...FAGERSTROM_DEFINITION,
        id: FAGERSTROM_DEFINITION.code,
        target_role: 'healthcare_professional',
        completed: false,
        completedAt: null,
        isConditional: true,
        conditionMet: false,
        conditionMessage: 'Complétez d\'abord l\'évaluation du tabagisme',
      });
    } else if (isFagerstromRequired) {
      // Tobacco answered with smoker/ex-smoker - show Fagerstrom enabled
      nurseQuestionnaires.push({
        ...FAGERSTROM_DEFINITION,
        id: FAGERSTROM_DEFINITION.code,
        target_role: 'healthcare_professional',
        completed: questionnaireStatuses['FAGERSTROM_FR']?.completed || false,
        completedAt: questionnaireStatuses['FAGERSTROM_FR']?.completed_at,
        isConditional: true,
        conditionMet: true,
      });
    } else {
      // Tobacco answered with non_smoker or unknown - show Fagerstrom as locked/grayed (not applicable)
      nurseQuestionnaires.push({
        ...FAGERSTROM_DEFINITION,
        id: FAGERSTROM_DEFINITION.code,
        target_role: 'healthcare_professional',
        completed: false,
        completedAt: null,
        isConditional: true,
        conditionMet: false,
        conditionMessage: 'Non applicable - le patient n\'est pas fumeur',
      });
    }
    
    // Add remaining nurse questionnaires
    nurseQuestionnaires.push(
      {
        ...PHYSICAL_PARAMS_DEFINITION,
        id: PHYSICAL_PARAMS_DEFINITION.code,
        target_role: 'healthcare_professional',
        completed: questionnaireStatuses['PHYSICAL_PARAMS_FR']?.completed || false,
        completedAt: questionnaireStatuses['PHYSICAL_PARAMS_FR']?.completed_at,
      },
      {
        ...BLOOD_PRESSURE_DEFINITION,
        id: BLOOD_PRESSURE_DEFINITION.code,
        target_role: 'healthcare_professional',
        completed: questionnaireStatuses['BLOOD_PRESSURE_FR']?.completed || false,
        completedAt: questionnaireStatuses['BLOOD_PRESSURE_FR']?.completed_at,
      },
      {
        ...ECG_DEFINITION,
        id: ECG_DEFINITION.code,
        target_role: 'healthcare_professional',
        completed: questionnaireStatuses['ECG_FR']?.completed || false,
        completedAt: questionnaireStatuses['ECG_FR']?.completed_at,
      },
      {
        ...SLEEP_APNEA_DEFINITION,
        id: SLEEP_APNEA_DEFINITION.code,
        target_role: 'healthcare_professional',
        completed: questionnaireStatuses['SLEEP_APNEA_FR']?.completed || false,
        completedAt: questionnaireStatuses['SLEEP_APNEA_FR']?.completed_at,
      },
      {
        ...BIOLOGICAL_ASSESSMENT_DEFINITION,
        id: BIOLOGICAL_ASSESSMENT_DEFINITION.code,
        target_role: 'healthcare_professional',
        completed: questionnaireStatuses['BIOLOGICAL_ASSESSMENT_FR']?.completed || false,
        completedAt: questionnaireStatuses['BIOLOGICAL_ASSESSMENT_FR']?.completed_at,
      }
    );

    modulesWithQuestionnaires = [
      {
        id: 'mod_nurse',
        name: 'Infirmier',
        description: 'Évaluation par l\'infirmier',
        questionnaires: nurseQuestionnaires
      },
      {
        id: 'mod_thymic_eval',
        name: 'Evaluation état thymique et fonctionnement',
        description: 'Évaluation de l\'état thymique et du fonctionnement',
        questionnaires: [
          {
            ...MADRS_DEFINITION,
            id: MADRS_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['MADRS_FR']?.completed || false,
            completedAt: questionnaireStatuses['MADRS_FR']?.completed_at,
          },
          {
            ...YMRS_DEFINITION,
            id: YMRS_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['YMRS_FR']?.completed || false,
            completedAt: questionnaireStatuses['YMRS_FR']?.completed_at,
          },
          {
            ...CGI_DEFINITION,
            id: CGI_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['CGI_FR']?.completed || false,
            completedAt: questionnaireStatuses['CGI_FR']?.completed_at,
          },
          {
            ...EGF_DEFINITION,
            id: EGF_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['EGF_FR']?.completed || false,
            completedAt: questionnaireStatuses['EGF_FR']?.completed_at,
          },
          {
            ...ALDA_DEFINITION,
            id: ALDA_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['ALDA_FR']?.completed || false,
            completedAt: questionnaireStatuses['ALDA_FR']?.completed_at,
          },
          {
            ...ETAT_PATIENT_DEFINITION,
            id: ETAT_PATIENT_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['ETAT_PATIENT_FR']?.completed || false,
            completedAt: questionnaireStatuses['ETAT_PATIENT_FR']?.completed_at,
          },
          {
            ...FAST_DEFINITION,
            id: FAST_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['FAST_FR']?.completed || false,
            completedAt: questionnaireStatuses['FAST_FR']?.completed_at,
          }
        ]
      },
      // Build medical evaluation module with sections
      (() => {
        // Build DSM5 section questionnaires with conditional DIVA
        const dsm5Questionnaires: any[] = [
          {
            ...DSM5_HUMEUR_DEFINITION,
            id: DSM5_HUMEUR_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['DSM5_HUMEUR_FR']?.completed || false,
            completedAt: questionnaireStatuses['DSM5_HUMEUR_FR']?.completed_at,
          },
          {
            ...DSM5_PSYCHOTIC_DEFINITION,
            id: DSM5_PSYCHOTIC_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['DSM5_PSYCHOTIC_FR']?.completed || false,
            completedAt: questionnaireStatuses['DSM5_PSYCHOTIC_FR']?.completed_at,
          },
          {
            ...DSM5_COMORBID_DEFINITION,
            id: DSM5_COMORBID_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['DSM5_COMORBID_FR']?.completed || false,
            completedAt: questionnaireStatuses['DSM5_COMORBID_FR']?.completed_at,
          },
        ];
        
        // Add DIVA with conditional display properties (ALWAYS visible)
        // - If DSM5 Comorbidities not answered: show as locked (waiting for DSM5)
        // - If DSM5 answered with "Oui" to diva_evaluated: show DIVA enabled
        // - If DSM5 answered with "Non" or "Ne sais pas": show as locked/grayed (not applicable)
        if (!dsm5ComorbidAnswered) {
          // DSM5 not yet completed - show DIVA as conditional/locked
          dsm5Questionnaires.push({
            ...DIVA_DEFINITION,
            id: DIVA_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: false,
            completedAt: null,
            isConditional: true,
            conditionMet: false,
            conditionMessage: 'Complétez d\'abord l\'évaluation DSM5 - Troubles comorbides (Section 5)',
          });
        } else if (isDivaRequired) {
          // DSM5 answered with "Oui" - show DIVA enabled
          dsm5Questionnaires.push({
            ...DIVA_DEFINITION,
            id: DIVA_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['DIVA_FR']?.completed || false,
            completedAt: questionnaireStatuses['DIVA_FR']?.completed_at,
            isConditional: true,
            conditionMet: true,
          });
        } else {
          // DSM5 answered with "Non" or "Ne sais pas" - show DIVA as locked/grayed (not applicable)
          dsm5Questionnaires.push({
            ...DIVA_DEFINITION,
            id: DIVA_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: false,
            completedAt: null,
            isConditional: true,
            conditionMet: false,
            conditionMessage: 'Non applicable - le patient n\'a pas été évalué avec la DIVA',
          });
        }

        // Build Suicide section questionnaires
        const suicideQuestionnaires = [
          {
            ...CSSRS_DEFINITION,
            id: CSSRS_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['CSSRS_FR']?.completed || false,
            completedAt: questionnaireStatuses['CSSRS_FR']?.completed_at,
          },
          {
            ...ISA_DEFINITION,
            id: ISA_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['ISA_FR']?.completed || false,
            completedAt: questionnaireStatuses['ISA_FR']?.completed_at,
          },
          {
            ...SIS_DEFINITION,
            id: SIS_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['SIS_FR']?.completed || false,
            completedAt: questionnaireStatuses['SIS_FR']?.completed_at,
          },
          {
            ...SUICIDE_HISTORY_DEFINITION,
            id: SUICIDE_HISTORY_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['SUICIDE_HISTORY_FR']?.completed || false,
            completedAt: questionnaireStatuses['SUICIDE_HISTORY_FR']?.completed_at,
          }
        ];
        
        return {
          id: 'mod_medical_eval',
          name: 'Evaluation Médicale',
          description: 'Évaluation médicale complète',
          questionnaires: [
            {
              ...FAMILY_HISTORY_DEFINITION,
              id: FAMILY_HISTORY_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['FAMILY_HISTORY_FR']?.completed || false,
              completedAt: questionnaireStatuses['FAMILY_HISTORY_FR']?.completed_at,
            }
          ],
          sections: [
            {
              id: 'dsm5',
              name: 'DSM5',
              questionnaires: dsm5Questionnaires
            },
            {
              id: 'suicide',
              name: 'Suicide',
              questionnaires: suicideQuestionnaires
            },
            {
              id: 'histoire_somatique',
              name: 'Histoire somatique',
              questionnaires: [
                {
                  ...PERINATALITE_DEFINITION,
                  id: PERINATALITE_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['PERINATALITE_FR']?.completed || false,
                  completedAt: questionnaireStatuses['PERINATALITE_FR']?.completed_at,
                },
                {
                  ...PATHO_NEURO_DEFINITION,
                  id: PATHO_NEURO_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['PATHO_NEURO_FR']?.completed || false,
                  completedAt: questionnaireStatuses['PATHO_NEURO_FR']?.completed_at,
                },
                {
                  ...PATHO_CARDIO_DEFINITION,
                  id: PATHO_CARDIO_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['PATHO_CARDIO_FR']?.completed || false,
                  completedAt: questionnaireStatuses['PATHO_CARDIO_FR']?.completed_at,
                },
                {
                  ...PATHO_ENDOC_DEFINITION,
                  id: PATHO_ENDOC_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['PATHO_ENDOC_FR']?.completed || false,
                  completedAt: questionnaireStatuses['PATHO_ENDOC_FR']?.completed_at,
                },
                {
                  ...PATHO_DERMATO_DEFINITION,
                  id: PATHO_DERMATO_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['PATHO_DERMATO_FR']?.completed || false,
                  completedAt: questionnaireStatuses['PATHO_DERMATO_FR']?.completed_at,
                },
                {
                  ...PATHO_URINAIRE_DEFINITION,
                  id: PATHO_URINAIRE_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['PATHO_URINAIRE_FR']?.completed || false,
                  completedAt: questionnaireStatuses['PATHO_URINAIRE_FR']?.completed_at,
                },
                {
                  ...ANTECEDENTS_GYNECO_DEFINITION,
                  id: ANTECEDENTS_GYNECO_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['ANTECEDENTS_GYNECO_FR']?.completed || false,
                  completedAt: questionnaireStatuses['ANTECEDENTS_GYNECO_FR']?.completed_at,
                },
                {
                  ...PATHO_HEPATO_GASTRO_DEFINITION,
                  id: PATHO_HEPATO_GASTRO_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['PATHO_HEPATO_GASTRO_FR']?.completed || false,
                  completedAt: questionnaireStatuses['PATHO_HEPATO_GASTRO_FR']?.completed_at,
                },
                {
                  ...PATHO_ALLERGIQUE_DEFINITION,
                  id: PATHO_ALLERGIQUE_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['PATHO_ALLERGIQUE_FR']?.completed || false,
                  completedAt: questionnaireStatuses['PATHO_ALLERGIQUE_FR']?.completed_at,
                },
                {
                  ...AUTRES_PATHO_DEFINITION,
                  id: AUTRES_PATHO_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['AUTRES_PATHO_FR']?.completed || false,
                  completedAt: questionnaireStatuses['AUTRES_PATHO_FR']?.completed_at,
                }
              ]
            }
          ]
        };
      })(),
      {
        id: 'mod_neuropsy',
        name: 'Evaluation Neuropsychologique',
        description: 'Évaluation neuropsychologique (Tests indépendants, WAIS-III, WAIS-IV)',
        // Root level: Independent tests shared by WAIS-III and WAIS-IV protocols
        questionnaires: [
          {
            ...CVLT_DEFINITION,
            id: CVLT_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['CVLT_FR']?.completed || false,
            completedAt: questionnaireStatuses['CVLT_FR']?.completed_at,
          },
          {
            ...TMT_DEFINITION,
            id: TMT_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['TMT_FR']?.completed || false,
            completedAt: questionnaireStatuses['TMT_FR']?.completed_at,
          },
          {
            ...STROOP_DEFINITION,
            id: STROOP_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['STROOP_FR']?.completed || false,
            completedAt: questionnaireStatuses['STROOP_FR']?.completed_at,
          },
          {
            ...FLUENCES_VERBALES_DEFINITION,
            id: FLUENCES_VERBALES_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['FLUENCES_VERBALES_FR']?.completed || false,
            completedAt: questionnaireStatuses['FLUENCES_VERBALES_FR']?.completed_at,
          },
          {
            ...MEM3_SPATIAL_DEFINITION,
            id: MEM3_SPATIAL_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['MEM3_SPATIAL_FR']?.completed || false,
            completedAt: questionnaireStatuses['MEM3_SPATIAL_FR']?.completed_at,
          }
        ],
        sections: [
          {
            id: 'wais3',
            name: 'WAIS-III',
            questionnaires: (() => {
              const wais3Questionnaires: any[] = [
                // Criteria questionnaire - always enabled
                {
                  ...WAIS3_CRITERIA_DEFINITION,
                  id: WAIS3_CRITERIA_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['WAIS3_CRITERIA_FR']?.completed || false,
                  completedAt: questionnaireStatuses['WAIS3_CRITERIA_FR']?.completed_at,
                }
              ];
              
              // Helper function to add conditional questionnaire
              const addConditionalQuestionnaire = (definition: any, code: string) => {
                if (!wais3CriteriaAnswered) {
                  // Criteria not yet completed - show as conditional/locked
                  wais3Questionnaires.push({
                    ...definition,
                    id: definition.code,
                    target_role: 'healthcare_professional',
                    completed: false,
                    completedAt: null,
                    isConditional: true,
                    conditionMet: false,
                    conditionMessage: 'Complétez d\'abord les Critères cliniques',
                  });
                } else if (wais3Accepted) {
                  // Patient accepted - show enabled
                  wais3Questionnaires.push({
                    ...definition,
                    id: definition.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses[code]?.completed || false,
                    completedAt: questionnaireStatuses[code]?.completed_at,
                    isConditional: true,
                    conditionMet: true,
                  });
                } else {
                  // Patient not accepted - show as locked/not applicable
                  wais3Questionnaires.push({
                    ...definition,
                    id: definition.code,
                    target_role: 'healthcare_professional',
                    completed: false,
                    completedAt: null,
                    isConditional: true,
                    conditionMet: false,
                    conditionMessage: 'Patient non accepté pour l\'évaluation neuropsychologique',
                  });
                }
              };
              
              // Add conditional questionnaires (WAIS-III specific tests only)
              addConditionalQuestionnaire(WAIS3_LEARNING_DEFINITION, 'WAIS3_LEARNING_FR');
              
              // Vocabulaire - not in the conditional list (always enabled)
              wais3Questionnaires.push({
                ...WAIS3_VOCABULAIRE_DEFINITION,
                id: WAIS3_VOCABULAIRE_DEFINITION.code,
                target_role: 'healthcare_professional',
                completed: questionnaireStatuses['WAIS3_VOCABULAIRE_FR']?.completed || false,
                completedAt: questionnaireStatuses['WAIS3_VOCABULAIRE_FR']?.completed_at,
              });
              
              addConditionalQuestionnaire(WAIS3_MATRICES_DEFINITION, 'WAIS3_MATRICES_FR');
              addConditionalQuestionnaire(WAIS3_CODE_SYMBOLES_DEFINITION, 'WAIS3_CODE_SYMBOLES_FR');
              addConditionalQuestionnaire(WAIS3_DIGIT_SPAN_DEFINITION, 'WAIS3_DIGIT_SPAN_FR');
              
              // CPT2 - not in the conditional list (always enabled)
              wais3Questionnaires.push({
                ...WAIS3_CPT2_DEFINITION,
                id: WAIS3_CPT2_DEFINITION.code,
                target_role: 'healthcare_professional',
                completed: questionnaireStatuses['WAIS3_CPT2_FR']?.completed || false,
                completedAt: questionnaireStatuses['WAIS3_CPT2_FR']?.completed_at,
              });
              
              return wais3Questionnaires;
            })()
          },
          {
            id: 'wais4',
            name: 'WAIS-IV',
            questionnaires: (() => {
              const wais4Questionnaires: any[] = [
                // Criteria questionnaire - always enabled
                {
                  ...WAIS4_CRITERIA_DEFINITION,
                  id: WAIS4_CRITERIA_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['WAIS4_CRITERIA_FR']?.completed || false,
                  completedAt: questionnaireStatuses['WAIS4_CRITERIA_FR']?.completed_at,
                }
              ];
              
              // Helper function to add conditional questionnaire
              const addConditionalQuestionnaire = (definition: any, code: string) => {
                if (!wais4CriteriaAnswered) {
                  // Criteria not yet completed - show as conditional/locked
                  wais4Questionnaires.push({
                    ...definition,
                    id: definition.code,
                    target_role: 'healthcare_professional',
                    completed: false,
                    completedAt: null,
                    isConditional: true,
                    conditionMet: false,
                    conditionMessage: 'Complétez d\'abord les Critères cliniques',
                  });
                } else if (wais4Accepted) {
                  // Patient accepted - show enabled
                  wais4Questionnaires.push({
                    ...definition,
                    id: definition.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses[code]?.completed || false,
                    completedAt: questionnaireStatuses[code]?.completed_at,
                    isConditional: true,
                    conditionMet: true,
                  });
                } else {
                  // Patient not accepted - show as locked/not applicable
                  wais4Questionnaires.push({
                    ...definition,
                    id: definition.code,
                    target_role: 'healthcare_professional',
                    completed: false,
                    completedAt: null,
                    isConditional: true,
                    conditionMet: false,
                    conditionMessage: 'Patient non accepté pour l\'évaluation neuropsychologique',
                  });
                }
              };
              
              // Add conditional questionnaires (WAIS-IV specific tests only)
              addConditionalQuestionnaire(WAIS4_LEARNING_DEFINITION, 'WAIS4_LEARNING_FR');
              addConditionalQuestionnaire(WAIS4_MATRICES_DEFINITION, 'WAIS4_MATRICES_FR');
              addConditionalQuestionnaire(WAIS4_CODE_DEFINITION, 'WAIS_IV_CODE_SYMBOLES_IVT');
              addConditionalQuestionnaire(WAIS4_DIGIT_SPAN_DEFINITION, 'WAIS4_DIGIT_SPAN_FR');
              addConditionalQuestionnaire(WAIS4_SIMILITUDES_DEFINITION, 'WAIS4_SIMILITUDES_FR');
              
              // COBRA, CPT3, TEST_COMMISSIONS, SCIP - not in the conditional list (always enabled)
              wais4Questionnaires.push(
                {
                  ...COBRA_DEFINITION,
                  id: COBRA_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['COBRA_FR']?.completed || false,
                  completedAt: questionnaireStatuses['COBRA_FR']?.completed_at,
                },
                {
                  ...CPT3_DEFINITION,
                  id: CPT3_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['CPT3_FR']?.completed || false,
                  completedAt: questionnaireStatuses['CPT3_FR']?.completed_at,
                },
                {
                  ...TEST_COMMISSIONS_DEFINITION,
                  id: TEST_COMMISSIONS_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['TEST_COMMISSIONS_FR']?.completed || false,
                  completedAt: questionnaireStatuses['TEST_COMMISSIONS_FR']?.completed_at,
                },
                {
                  ...SCIP_DEFINITION,
                  id: SCIP_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['SCIP_FR']?.completed || false,
                  completedAt: questionnaireStatuses['SCIP_FR']?.completed_at,
                }
              );
              
              return wais4Questionnaires;
            })()
          }
        ]
      },
      {
        id: 'mod_auto_etat',
        name: 'Autoquestionnaires - ETAT',
        description: 'Questionnaires sur l\'état actuel du patient',
        questionnaires: [
          {
            ...EQ5D5L_DEFINITION,
            id: EQ5D5L_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['EQ5D5L_FR']?.completed || false,
            completedAt: questionnaireStatuses['EQ5D5L_FR']?.completed_at,
          },
          {
            ...PRISE_M_DEFINITION,
            id: PRISE_M_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['PRISE_M_FR']?.completed || false,
            completedAt: questionnaireStatuses['PRISE_M_FR']?.completed_at,
          },
          {
            ...STAI_YA_DEFINITION,
            id: STAI_YA_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['STAI_YA_FR']?.completed || false,
            completedAt: questionnaireStatuses['STAI_YA_FR']?.completed_at,
          },
          {
            ...MARS_DEFINITION,
            id: MARS_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['MARS_FR']?.completed || false,
            completedAt: questionnaireStatuses['MARS_FR']?.completed_at,
          },
          {
            ...MATHYS_DEFINITION,
            id: MATHYS_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['MATHYS_FR']?.completed || false,
            completedAt: questionnaireStatuses['MATHYS_FR']?.completed_at,
          },
          {
            ...ASRM_DEFINITION,
            id: ASRM_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['ASRM_FR']?.completed || false,
            completedAt: questionnaireStatuses['ASRM_FR']?.completed_at,
          },
          {
            ...QIDS_DEFINITION,
            id: QIDS_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['QIDS_SR16_FR']?.completed || false,
            completedAt: questionnaireStatuses['QIDS_SR16_FR']?.completed_at,
          },
          {
            ...PSQI_DEFINITION,
            id: PSQI_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['PSQI_FR']?.completed || false,
            completedAt: questionnaireStatuses['PSQI_FR']?.completed_at,
          },
          {
            ...EPWORTH_DEFINITION,
            id: EPWORTH_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['EPWORTH_FR']?.completed || false,
            completedAt: questionnaireStatuses['EPWORTH_FR']?.completed_at,
          }
        ]
      },
      {
        id: 'mod_social',
        name: 'Social',
        description: 'Évaluation sociale',
        questionnaires: [
          {
            ...SOCIAL_DEFINITION,
            id: SOCIAL_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['SOCIAL_FR']?.completed || false,
            completedAt: questionnaireStatuses['SOCIAL_FR']?.completed_at,
          }
        ]
      },
      {
        id: 'mod_auto_traits',
        name: 'Autoquestionnaires - TRAITS',
        description: 'Questionnaires sur les traits du patient',
        questionnaires: [
          {
            ...ASRS_DEFINITION,
            id: ASRS_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['ASRS_FR']?.completed || false,
            completedAt: questionnaireStatuses['ASRS_FR']?.completed_at,
          },
          {
            ...CTQ_DEFINITION,
            id: CTQ_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['CTQ_FR']?.completed || false,
            completedAt: questionnaireStatuses['CTQ_FR']?.completed_at,
          },
          {
            ...BIS10_DEFINITION,
            id: BIS10_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['BIS10_FR']?.completed || false,
            completedAt: questionnaireStatuses['BIS10_FR']?.completed_at,
          },
          {
            ...ALS18_DEFINITION,
            id: ALS18_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['ALS18_FR']?.completed || false,
            completedAt: questionnaireStatuses['ALS18_FR']?.completed_at,
          },
          {
            ...AIM_DEFINITION,
            id: AIM_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['AIM_FR']?.completed || false,
            completedAt: questionnaireStatuses['AIM_FR']?.completed_at,
          },
          {
            ...WURS25_DEFINITION,
            id: WURS25_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['WURS25_FR']?.completed || false,
            completedAt: questionnaireStatuses['WURS25_FR']?.completed_at,
          },
          {
            ...AQ12_DEFINITION,
            id: AQ12_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['AQ12_FR']?.completed || false,
            completedAt: questionnaireStatuses['AQ12_FR']?.completed_at,
          },
          {
            ...CSM_DEFINITION,
            id: CSM_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['CSM_FR']?.completed || false,
            completedAt: questionnaireStatuses['CSM_FR']?.completed_at,
          },
          {
            ...CTI_DEFINITION,
            id: CTI_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['CTI_FR']?.completed || false,
            completedAt: questionnaireStatuses['CTI_FR']?.completed_at,
          }
        ]
      }
    ];
  } else if (visit.visit_type === 'biannual_followup' || visit.visit_type === 'annual_evaluation') {
    // Build follow-up visit modules with conditional DIVA
    modulesWithQuestionnaires = [
      {
        id: 'mod_thymic_eval',
        name: 'Evaluation état thymique et fonctionnement',
        description: 'Évaluation de l\'état thymique et du fonctionnement',
        questionnaires: [
          {
            ...MADRS_DEFINITION,
            id: MADRS_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['MADRS_FR']?.completed || false,
            completedAt: questionnaireStatuses['MADRS_FR']?.completed_at,
          },
          {
            ...YMRS_DEFINITION,
            id: YMRS_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['YMRS_FR']?.completed || false,
            completedAt: questionnaireStatuses['YMRS_FR']?.completed_at,
          },
          {
            ...CGI_DEFINITION,
            id: CGI_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['CGI_FR']?.completed || false,
            completedAt: questionnaireStatuses['CGI_FR']?.completed_at,
          },
          {
            ...EGF_DEFINITION,
            id: EGF_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['EGF_FR']?.completed || false,
            completedAt: questionnaireStatuses['EGF_FR']?.completed_at,
          },
          {
            ...FAST_DEFINITION,
            id: FAST_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['FAST_FR']?.completed || false,
            completedAt: questionnaireStatuses['FAST_FR']?.completed_at,
          }
        ]
      },
      // Build medical evaluation module with sections for follow-up visits
      (() => {
        // Build DSM5 section questionnaires with conditional DIVA
        const dsm5Questionnaires: any[] = [
          {
            ...DSM5_COMORBID_DEFINITION,
            id: DSM5_COMORBID_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['DSM5_COMORBID_FR']?.completed || false,
            completedAt: questionnaireStatuses['DSM5_COMORBID_FR']?.completed_at,
          },
        ];
        
        // Add DIVA with conditional display properties (ALWAYS visible, same logic as initial_evaluation)
        if (!dsm5ComorbidAnswered) {
          // DSM5 not yet completed - show DIVA as conditional/locked
          dsm5Questionnaires.push({
            ...DIVA_DEFINITION,
            id: DIVA_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: false,
            completedAt: null,
            isConditional: true,
            conditionMet: false,
            conditionMessage: 'Complétez d\'abord l\'évaluation DSM5 - Troubles comorbides (Section 5)',
          });
        } else if (isDivaRequired) {
          // DSM5 answered with "Oui" - show DIVA enabled
          dsm5Questionnaires.push({
            ...DIVA_DEFINITION,
            id: DIVA_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['DIVA_FR']?.completed || false,
            completedAt: questionnaireStatuses['DIVA_FR']?.completed_at,
            isConditional: true,
            conditionMet: true,
          });
        } else {
          // DSM5 answered with "Non" or "Ne sais pas" - show DIVA as locked/grayed (not applicable)
          dsm5Questionnaires.push({
            ...DIVA_DEFINITION,
            id: DIVA_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: false,
            completedAt: null,
            isConditional: true,
            conditionMet: false,
            conditionMessage: 'Non applicable - le patient n\'a pas été évalué avec la DIVA',
          });
        }

        // Build Suicide section questionnaires
        const suicideQuestionnaires = [
          {
            ...CSSRS_DEFINITION,
            id: CSSRS_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['CSSRS_FR']?.completed || false,
            completedAt: questionnaireStatuses['CSSRS_FR']?.completed_at,
          },
          {
            ...ISA_DEFINITION,
            id: ISA_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['ISA_FR']?.completed || false,
            completedAt: questionnaireStatuses['ISA_FR']?.completed_at,
          }
        ];

        // Build Histoire somatique section questionnaires
        const histoireSomatiqueQuestionnaires = [
          {
            ...PERINATALITE_DEFINITION,
            id: PERINATALITE_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['PERINATALITE_FR']?.completed || false,
            completedAt: questionnaireStatuses['PERINATALITE_FR']?.completed_at,
          },
          {
            ...PATHO_NEURO_DEFINITION,
            id: PATHO_NEURO_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['PATHO_NEURO_FR']?.completed || false,
            completedAt: questionnaireStatuses['PATHO_NEURO_FR']?.completed_at,
          },
          {
            ...PATHO_CARDIO_DEFINITION,
            id: PATHO_CARDIO_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['PATHO_CARDIO_FR']?.completed || false,
            completedAt: questionnaireStatuses['PATHO_CARDIO_FR']?.completed_at,
          },
          {
            ...PATHO_ENDOC_DEFINITION,
            id: PATHO_ENDOC_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['PATHO_ENDOC_FR']?.completed || false,
            completedAt: questionnaireStatuses['PATHO_ENDOC_FR']?.completed_at,
          },
          {
            ...PATHO_DERMATO_DEFINITION,
            id: PATHO_DERMATO_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['PATHO_DERMATO_FR']?.completed || false,
            completedAt: questionnaireStatuses['PATHO_DERMATO_FR']?.completed_at,
          },
          {
            ...PATHO_URINAIRE_DEFINITION,
            id: PATHO_URINAIRE_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['PATHO_URINAIRE_FR']?.completed || false,
            completedAt: questionnaireStatuses['PATHO_URINAIRE_FR']?.completed_at,
          },
          {
            ...ANTECEDENTS_GYNECO_DEFINITION,
            id: ANTECEDENTS_GYNECO_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['ANTECEDENTS_GYNECO_FR']?.completed || false,
            completedAt: questionnaireStatuses['ANTECEDENTS_GYNECO_FR']?.completed_at,
          },
          {
            ...PATHO_HEPATO_GASTRO_DEFINITION,
            id: PATHO_HEPATO_GASTRO_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['PATHO_HEPATO_GASTRO_FR']?.completed || false,
            completedAt: questionnaireStatuses['PATHO_HEPATO_GASTRO_FR']?.completed_at,
          },
          {
            ...PATHO_ALLERGIQUE_DEFINITION,
            id: PATHO_ALLERGIQUE_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['PATHO_ALLERGIQUE_FR']?.completed || false,
            completedAt: questionnaireStatuses['PATHO_ALLERGIQUE_FR']?.completed_at,
          },
          {
            ...AUTRES_PATHO_DEFINITION,
            id: AUTRES_PATHO_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['AUTRES_PATHO_FR']?.completed || false,
            completedAt: questionnaireStatuses['AUTRES_PATHO_FR']?.completed_at,
          }
        ];
        
        return {
          id: 'mod_medical_eval',
          name: 'Evaluation Médicale',
          description: 'Évaluation médicale complète',
          sections: [
            {
              id: 'dsm5',
              name: 'DSM5',
              questionnaires: dsm5Questionnaires
            },
            {
              id: 'suicide',
              name: 'Suicide',
              questionnaires: suicideQuestionnaires
            },
            {
              id: 'histoire_somatique',
              name: 'Histoire somatique',
              questionnaires: histoireSomatiqueQuestionnaires
            }
          ]
        };
      })(),
      {
        id: 'mod_auto_etat',
        name: 'Autoquestionnaires - ETAT',
        description: 'Questionnaires sur l\'état actuel du patient',
        questionnaires: [
          {
            ...EQ5D5L_DEFINITION,
            id: EQ5D5L_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['EQ5D5L_FR']?.completed || false,
            completedAt: questionnaireStatuses['EQ5D5L_FR']?.completed_at,
          },
          {
            ...ASRM_DEFINITION,
            id: ASRM_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['ASRM_FR']?.completed || false,
            completedAt: questionnaireStatuses['ASRM_FR']?.completed_at,
          },
          {
            ...QIDS_DEFINITION,
            id: QIDS_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['QIDS_SR16_FR']?.completed || false,
            completedAt: questionnaireStatuses['QIDS_SR16_FR']?.completed_at,
          },
          {
            ...PSQI_DEFINITION,
            id: PSQI_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['PSQI_FR']?.completed || false,
            completedAt: questionnaireStatuses['PSQI_FR']?.completed_at,
          },
          {
            ...EPWORTH_DEFINITION,
            id: EPWORTH_DEFINITION.code,
            target_role: 'patient',
            completed: questionnaireStatuses['EPWORTH_FR']?.completed || false,
            completedAt: questionnaireStatuses['EPWORTH_FR']?.completed_at,
          }
        ]
      }
    ];
  }

  return (
    <div className="max-w-7xl mx-auto px-8 space-y-8">
      {/* Enhanced Header with Sticky Navigation */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-8 sticky top-0 z-50 mb-2">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-6 flex-1">
            {/* Circular Progress */}
            <CircularProgress percentage={completionStatus.completionPercentage} />
            
            {/* Visit Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {visit.template_name}
              </h2>
              <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                <span className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {visit.patient_first_name} {visit.patient_last_name}
                </span>
                <span className="text-slate-400">•</span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {visit.scheduled_date && formatDateTime(visit.scheduled_date)}
                </span>
              </div>

              {/* Progress Summary */}
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Progression globale</span>
                    <span>{completionStatus.completedQuestionnaires}/{completionStatus.totalQuestionnaires} formulaires</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div
                      className={cn(
                        "h-2.5 rounded-full transition-all duration-500",
                        completionStatus.completionPercentage === 100 ? "bg-emerald-600" : "bg-brand"
                      )}
                      style={{ width: `${completionStatus.completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <VisitActions 
            visitId={visitId}
            patientId={patientId}
            pathology={pathology}
            status={visit.status}
            completionStatus={completionStatus}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <VisitQuickStats
        totalModules={modulesWithQuestionnaires.length}
        totalQuestionnaires={completionStatus.totalQuestionnaires}
        completedQuestionnaires={completionStatus.completedQuestionnaires}
        completionPercentage={completionStatus.completionPercentage}
      />

      {/* Clinical Modules */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
          Parcours de Soin
          <span className="h-px flex-1 bg-slate-200 ml-4"></span>
        </h3>

        <div className="relative space-y-6 pl-2">
        {(Array.isArray(modulesWithQuestionnaires) ? modulesWithQuestionnaires : [])
          .filter((m): m is NonNullable<typeof m> => m != null && typeof m === 'object' && 'id' in m)
          .map((module, index) => (
            <ExpandableModuleCard
              key={module.id}
              module={module}
              index={index}
              pathology={pathology}
              patientId={patientId}
              visitId={visitId}
              totalModules={(Array.isArray(modulesWithQuestionnaires) ? modulesWithQuestionnaires : []).length}
            />
          ))}
        </div>
      </div>

      {/* Visit Notes */}
      {visit.notes && (
        <Card className="hover:shadow-md transition-shadow duration-200 rounded-2xl">
          <CardHeader>
            <CardTitle>Notes de visite</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{visit.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
