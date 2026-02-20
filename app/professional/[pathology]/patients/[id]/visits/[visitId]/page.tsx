import { getVisitDetailData } from "@/lib/services/visit-detail.service";
import { getVisitModules, VirtualModule, updateVisitCompletionStatus } from "@/lib/services/visit.service";
import { getTobaccoResponse } from "@/lib/services/bipolar-nurse.service";
import { getDsm5ComorbidResponse } from "@/lib/services/questionnaire-dsm5.service";
import { getWais4CriteriaResponse, getWais3CriteriaResponse } from "@/lib/services/questionnaire-hetero.service";
import { getUserContext } from "@/lib/rbac/middleware";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils/date";
import { notFound, redirect } from "next/navigation";
import { Calendar } from "lucide-react";
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
  // TRAITS (to be migrated)
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
// Auto ETAT definitions (refactored)
import {
  EQ5D5L_DEFINITION,
  PRISE_M_DEFINITION,
  STAI_YA_DEFINITION,
  MARS_DEFINITION,
  MATHYS_DEFINITION,
  PSQI_DEFINITION,
  EPWORTH_DEFINITION
} from "@/lib/questionnaires/bipolar/initial/auto/etat";
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
  ISA_DEFINITION,
  ISA_FOLLOWUP_DEFINITION,
  SIS_DEFINITION,
  SUICIDE_HISTORY_DEFINITION,
  SUICIDE_BEHAVIOR_FOLLOWUP_DEFINITION,
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
  WAIS3_CODE_SYMBOLES_DEFINITION,
  WAIS3_DIGIT_SPAN_DEFINITION,
  WAIS3_CPT2_DEFINITION
} from "@/lib/constants/questionnaires-hetero";
// WAIS-III Vocabulaire from new location
import { WAIS3_VOCABULAIRE_DEFINITION } from "@/lib/questionnaires/bipolar/initial/neuropsy/wais3-vocabulaire";
// WAIS-III Matrices from new location
import { WAIS3_MATRICES_DEFINITION } from "@/lib/questionnaires/bipolar/initial/neuropsy/wais3-matrices";
// C-SSRS from medical module
import { CSSRS_DEFINITION } from "@/lib/questionnaires/bipolar/initial/medical";
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
  DSM5_COMORBID_DEFINITION,
  DIAG_PSY_SEM_HUMEUR_ACTUELS_DEFINITION,
  DIAG_PSY_SEM_HUMEUR_DEPUIS_VISITE_DEFINITION,
  DIAG_PSY_SEM_PSYCHOTIQUES_DEFINITION
} from "@/lib/constants/questionnaires-dsm5";
import {
  SUIVI_RECOMMANDATIONS_DEFINITION,
  RECOURS_AUX_SOINS_DEFINITION,
  TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION,
  ARRETS_DE_TRAVAIL_DEFINITION,
  SOMATIQUE_CONTRACEPTIF_DEFINITION,
  STATUT_PROFESSIONNEL_DEFINITION
} from "@/lib/constants/questionnaires-followup";
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
  SAPS_DEFINITION,
  SANS_DEFINITION,
  UKU_DEFINITION,
  BRIEF_A_SZ_DEFINITION,
  YMRS_SZ_DEFINITION,
  CGI_SZ_DEFINITION,
  EGF_SZ_DEFINITION,
  ECV_DEFINITION,
  TROUBLES_PSYCHOTIQUES_DEFINITION,
  ISA_SZ_DEFINITION,
  SUICIDE_HISTORY_SZ_DEFINITION,
  ANTECEDENTS_FAMILIAUX_PSY_SZ_DEFINITION,
  SZ_PERINATALITE_DEFINITION,
  TEA_COFFEE_SZ_DEFINITION,
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
  STROOP_SZ_DEFINITION,
  FLUENCES_VERBALES_SZ_DEFINITION,
  WAIS4_CRITERIA_SZ_DEFINITION,
  WAIS4_EFFICIENCE_SZ_DEFINITION,
  WAIS4_SIMILITUDES_SZ_DEFINITION,
  WAIS4_MEMOIRE_CHIFFRES_SZ_DEFINITION,
  WAIS4_MATRICES_SZ_DEFINITION,
  SSTICS_SZ_DEFINITION,
  CBQ_SZ_DEFINITION,
  DACOBS_SZ_DEFINITION
} from "@/lib/questionnaires/schizophrenia";
import { VISIT_TYPE_NAMES, VisitType } from "@/lib/types/enums";

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function VisitDetailPage({
  params,
}: {
  params: Promise<{ pathology: string; id: string; visitId: string }>;
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
  // Fagerstrom is only required for current smokers (Fumeur actuel), not ex-smokers
  const isFagerstromRequired = smokingStatus === 'current_smoker';

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
  // Handle both boolean true and integer 1 (database stores boolean, but UI uses number)
  // Use type assertion to handle the type mismatch
  const wais4Accepted = !!(wais4CriteriaResponse?.accepted_for_neuropsy_evaluation);
  const wais3Accepted = !!(wais3CriteriaResponse?.accepted_for_neuropsy_evaluation);

  // NOTE: We will calculate actual completion status from constructed modules AFTER building them
  // This ensures accuracy by using the same logic as individual module cards
  // The RPC data is still used for questionnaire statuses, but progress is calculated from modules

  // Build modules with questionnaires based on visit type and RPC data
  let modulesWithQuestionnaires: VirtualModule[] = [];

  if (visit.visit_type === 'screening') {
    // Check if this is a schizophrenia screening (no autoquestionnaires)
    if (pathology === 'schizophrenia') {
      modulesWithQuestionnaires = [
        {
          id: 'mod_medical',
          name: 'Partie medicale',
          description: 'Evaluation clinique par le professionnel de sante',
          questionnaires: [
            {
              ...SZ_DIAGNOSTIC_DEFINITION,
              id: SZ_DIAGNOSTIC_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['SCREENING_DIAGNOSTIC_SZ']?.completed || false,
              completedAt: questionnaireStatuses['SCREENING_DIAGNOSTIC_SZ']?.completed_at,
            },
            {
              ...SZ_ORIENTATION_DEFINITION,
              id: SZ_ORIENTATION_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['SCREENING_ORIENTATION_SZ']?.completed || false,
              completedAt: questionnaireStatuses['SCREENING_ORIENTATION_SZ']?.completed_at,
            }
          ]
        }
      ];
    } else {
      // Bipolar and other pathologies - include autoquestionnaires
      modulesWithQuestionnaires = [
        {
          id: 'mod_auto',
          name: 'Autoquestionnaires',
          description: 'Questionnaires a remplir par le patient',
          questionnaires: [
            {
              ...ASRM_DEFINITION,
              id: ASRM_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['ASRM']?.completed || false,
              completedAt: questionnaireStatuses['ASRM']?.completed_at,
            },
            {
              ...QIDS_DEFINITION,
              id: QIDS_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['QIDS_SR16']?.completed || false,
              completedAt: questionnaireStatuses['QIDS_SR16']?.completed_at,
            },
            {
              ...MDQ_DEFINITION,
              id: MDQ_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['MDQ']?.completed || false,
              completedAt: questionnaireStatuses['MDQ']?.completed_at,
            }
          ]
        },
        {
          id: 'mod_medical',
          name: 'Partie medicale',
          description: 'Evaluation clinique par le professionnel de sante',
          questionnaires: [
            {
              ...DIAGNOSTIC_DEFINITION,
              id: DIAGNOSTIC_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['MEDICAL_DIAGNOSTIC']?.completed || false,
              completedAt: questionnaireStatuses['MEDICAL_DIAGNOSTIC']?.completed_at,
            },
            {
              ...ORIENTATION_DEFINITION,
              id: ORIENTATION_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['BIPOLAR_ORIENTATION']?.completed || false,
              completedAt: questionnaireStatuses['BIPOLAR_ORIENTATION']?.completed_at,
            }
          ]
        }
      ];
    }
  } else if (visit.visit_type === 'initial_evaluation') {
    // Check if this is a schizophrenia initial evaluation
    if (pathology === 'schizophrenia') {
      // Schizophrenia initial evaluation - Dossier Infirmier, Bilan Biologique, and PANSS questionnaires
      modulesWithQuestionnaires = [
        {
          id: 'mod_nurse',
          name: 'Infirmier',
          description: 'Evaluation par l\'infirmier',
          questionnaires: [
            {
              ...SZ_DOSSIER_INFIRMIER_DEFINITION,
              id: SZ_DOSSIER_INFIRMIER_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['DOSSIER_INFIRMIER_SZ']?.completed || false,
              completedAt: questionnaireStatuses['DOSSIER_INFIRMIER_SZ']?.completed_at,
            },
            {
              ...SZ_BILAN_BIOLOGIQUE_DEFINITION,
              id: SZ_BILAN_BIOLOGIQUE_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['BILAN_BIOLOGIQUE_SZ']?.completed || false,
              completedAt: questionnaireStatuses['BILAN_BIOLOGIQUE_SZ']?.completed_at,
            }
          ]
        },
        {
          id: 'mod_hetero',
          name: 'Hetero-questionnaires',
          description: 'Questionnaires d\'evaluation clinique',
          questionnaires: [
            {
              ...PANSS_DEFINITION,
              id: PANSS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['PANSS']?.completed || false,
              completedAt: questionnaireStatuses['PANSS']?.completed_at,
            },
            {
              ...CDSS_DEFINITION,
              id: CDSS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['CDSS']?.completed || false,
              completedAt: questionnaireStatuses['CDSS']?.completed_at,
            },
            {
              ...YMRS_SZ_DEFINITION,
              id: YMRS_SZ_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['YMRS_SZ']?.completed || false,
              completedAt: questionnaireStatuses['YMRS_SZ']?.completed_at,
            },
            {
              ...CGI_SZ_DEFINITION,
              id: CGI_SZ_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['CGI_SZ']?.completed || false,
              completedAt: questionnaireStatuses['CGI_SZ']?.completed_at,
            },
            {
              ...EGF_SZ_DEFINITION,
              id: EGF_SZ_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['EGF_SZ']?.completed || false,
              completedAt: questionnaireStatuses['EGF_SZ']?.completed_at,
            },
            {
              ...BARS_DEFINITION,
              id: BARS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['BARS']?.completed || false,
              completedAt: questionnaireStatuses['BARS']?.completed_at,
            },
            {
              ...SUMD_DEFINITION,
              id: SUMD_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['SUMD']?.completed || false,
              completedAt: questionnaireStatuses['SUMD']?.completed_at,
            },
            {
              ...SAPS_DEFINITION,
              id: SAPS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['SAPS']?.completed || false,
              completedAt: questionnaireStatuses['SAPS']?.completed_at,
            },
            {
              ...SANS_DEFINITION,
              id: SANS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['SANS']?.completed || false,
              completedAt: questionnaireStatuses['SANS']?.completed_at,
            },
            {
              ...UKU_DEFINITION,
              id: UKU_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['UKU']?.completed || false,
              completedAt: questionnaireStatuses['UKU']?.completed_at,
            },
            {
              ...AIMS_DEFINITION,
              id: AIMS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['AIMS']?.completed || false,
              completedAt: questionnaireStatuses['AIMS']?.completed_at,
            },
            {
              ...BARNES_DEFINITION,
              id: BARNES_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['BARNES']?.completed || false,
              completedAt: questionnaireStatuses['BARNES']?.completed_at,
            },
            {
              ...SAS_DEFINITION,
              id: SAS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['SAS']?.completed || false,
              completedAt: questionnaireStatuses['SAS']?.completed_at,
            },
            {
              ...PSP_DEFINITION,
              id: PSP_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['PSP']?.completed || false,
              completedAt: questionnaireStatuses['PSP']?.completed_at,
            },
            {
              ...BRIEF_A_SZ_DEFINITION,
              id: BRIEF_A_SZ_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['BRIEF_A_SZ']?.completed || false,
              completedAt: questionnaireStatuses['BRIEF_A_SZ']?.completed_at,
            }
          ]
        },
        {
          id: 'mod_medical_eval',
          name: 'Evaluation Medicale',
          description: 'Evaluation medicale',
          questionnaires: [
            {
              ...ECV_DEFINITION,
              id: ECV_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['ECV']?.completed || false,
              completedAt: questionnaireStatuses['ECV']?.completed_at,
            }
          ],
          sections: [
            {
              id: 'dsm5',
              name: 'DSM5',
              questionnaires: [
                {
                  ...TROUBLES_PSYCHOTIQUES_DEFINITION,
                  id: TROUBLES_PSYCHOTIQUES_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['TROUBLES_PSYCHOTIQUES']?.completed || false,
                  completedAt: questionnaireStatuses['TROUBLES_PSYCHOTIQUES']?.completed_at,
                },
                {
                  ...TROUBLES_COMORBIDES_SZ_DEFINITION,
                  id: TROUBLES_COMORBIDES_SZ_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['TROUBLES_COMORBIDES_SZ']?.completed || false,
                  completedAt: questionnaireStatuses['TROUBLES_COMORBIDES_SZ']?.completed_at,
                }
              ]
            },
            {
              id: 'suicide',
              name: 'Suicide',
              questionnaires: [
                {
                  ...ISA_SZ_DEFINITION,
                  id: ISA_SZ_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['ISA_SZ']?.completed || false,
                  completedAt: questionnaireStatuses['ISA_SZ']?.completed_at,
                },
                {
                  ...SUICIDE_HISTORY_SZ_DEFINITION,
                  id: SUICIDE_HISTORY_SZ_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['SUICIDE_HISTORY_SZ']?.completed || false,
                  completedAt: questionnaireStatuses['SUICIDE_HISTORY_SZ']?.completed_at,
                }
              ]
            },
            {
              id: 'histoire_somatique',
              name: 'Histoire somatique',
              questionnaires: [
                {
                  ...SZ_PERINATALITE_DEFINITION,
                  id: SZ_PERINATALITE_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['PERINATALITE_SZ']?.completed || false,
                  completedAt: questionnaireStatuses['PERINATALITE_SZ']?.completed_at,
                },
                {
                  ...PATHO_NEURO_DEFINITION,
                  id: PATHO_NEURO_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['PATHO_NEURO']?.completed || false,
                  completedAt: questionnaireStatuses['PATHO_NEURO']?.completed_at,
                },
                {
                  ...PATHO_CARDIO_DEFINITION,
                  id: PATHO_CARDIO_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['PATHO_CARDIO']?.completed || false,
                  completedAt: questionnaireStatuses['PATHO_CARDIO']?.completed_at,
                },
                {
                  ...PATHO_ENDOC_DEFINITION,
                  id: PATHO_ENDOC_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['PATHO_ENDOC']?.completed || false,
                  completedAt: questionnaireStatuses['PATHO_ENDOC']?.completed_at,
                },
                {
                  ...PATHO_DERMATO_DEFINITION,
                  id: PATHO_DERMATO_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['PATHO_DERMATO']?.completed || false,
                  completedAt: questionnaireStatuses['PATHO_DERMATO']?.completed_at,
                },
                {
                  ...PATHO_URINAIRE_DEFINITION,
                  id: PATHO_URINAIRE_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['PATHO_URINAIRE']?.completed || false,
                  completedAt: questionnaireStatuses['PATHO_URINAIRE']?.completed_at,
                },
                {
                  ...ANTECEDENTS_GYNECO_DEFINITION,
                  id: ANTECEDENTS_GYNECO_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['ANTECEDENTS_GYNECO']?.completed || false,
                  completedAt: questionnaireStatuses['ANTECEDENTS_GYNECO']?.completed_at,
                },
                {
                  ...PATHO_HEPATO_GASTRO_DEFINITION,
                  id: PATHO_HEPATO_GASTRO_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['PATHO_HEPATO_GASTRO']?.completed || false,
                  completedAt: questionnaireStatuses['PATHO_HEPATO_GASTRO']?.completed_at,
                },
                {
                  ...PATHO_ALLERGIQUE_DEFINITION,
                  id: PATHO_ALLERGIQUE_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['PATHO_ALLERGIQUE']?.completed || false,
                  completedAt: questionnaireStatuses['PATHO_ALLERGIQUE']?.completed_at,
                },
                {
                  ...AUTRES_PATHO_DEFINITION,
                  id: AUTRES_PATHO_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['AUTRES_PATHO']?.completed || false,
                  completedAt: questionnaireStatuses['AUTRES_PATHO']?.completed_at,
                }
              ]
            },
            {
              id: 'antecedents_familiaux',
              name: 'Antecedents familiaux',
              questionnaires: [
                {
                  ...ANTECEDENTS_FAMILIAUX_PSY_SZ_DEFINITION,
                  id: ANTECEDENTS_FAMILIAUX_PSY_SZ_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['ANTECEDENTS_FAMILIAUX_PSY_SZ']?.completed || false,
                  completedAt: questionnaireStatuses['ANTECEDENTS_FAMILIAUX_PSY_SZ']?.completed_at,
                }
              ]
            },
            {
              id: 'addictologie',
              name: 'Addictologie',
              questionnaires: [
                {
                  ...EVAL_ADDICTOLOGIQUE_SZ_DEFINITION,
                  id: EVAL_ADDICTOLOGIQUE_SZ_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['EVAL_ADDICTOLOGIQUE_SZ']?.completed || false,
                  completedAt: questionnaireStatuses['EVAL_ADDICTOLOGIQUE_SZ']?.completed_at,
                },
                {
                  ...TEA_COFFEE_SZ_DEFINITION,
                  id: TEA_COFFEE_SZ_DEFINITION.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['TEA_COFFEE_SZ']?.completed || false,
                  completedAt: questionnaireStatuses['TEA_COFFEE_SZ']?.completed_at,
                }
              ]
            }
          ]
        },
        {
          id: 'mod_neuropsy_sz',
          name: 'Evaluation Neuropsychologique',
          description: 'Évaluation neuropsychologique',
          questionnaires: [
            {
              id: STROOP_SZ_DEFINITION.code,
              code: STROOP_SZ_DEFINITION.code,
              title: STROOP_SZ_DEFINITION.title,
              description: STROOP_SZ_DEFINITION.description,
              questions: STROOP_SZ_DEFINITION.questions,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['STROOP_SZ']?.completed || false,
              completedAt: questionnaireStatuses['STROOP_SZ']?.completed_at,
            },
            {
              id: FLUENCES_VERBALES_SZ_DEFINITION.code,
              code: FLUENCES_VERBALES_SZ_DEFINITION.code,
              title: FLUENCES_VERBALES_SZ_DEFINITION.title,
              description: FLUENCES_VERBALES_SZ_DEFINITION.description,
              questions: FLUENCES_VERBALES_SZ_DEFINITION.questions,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['FLUENCES_VERBALES_SZ']?.completed || false,
              completedAt: questionnaireStatuses['FLUENCES_VERBALES_SZ']?.completed_at,
            }
          ],
          sections: [
            {
              id: 'bloc2',
              name: 'Bloc 2',
              questionnaires: [
                {
                  id: SZ_CVLT_DEFINITION.code,
                  code: SZ_CVLT_DEFINITION.code,
                  title: SZ_CVLT_DEFINITION.title,
                  description: SZ_CVLT_DEFINITION.description,
                  questions: SZ_CVLT_DEFINITION.questions,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['CVLT_SZ']?.completed || false,
                  completedAt: questionnaireStatuses['CVLT_SZ']?.completed_at,
                },
                {
                  id: TMT_SZ_DEFINITION.code,
                  code: TMT_SZ_DEFINITION.code,
                  title: TMT_SZ_DEFINITION.title,
                  description: TMT_SZ_DEFINITION.description,
                  questions: TMT_SZ_DEFINITION.questions,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['TMT_SZ']?.completed || false,
                  completedAt: questionnaireStatuses['TMT_SZ']?.completed_at,
                },
                {
                  id: COMMISSIONS_SZ_DEFINITION.code,
                  code: COMMISSIONS_SZ_DEFINITION.code,
                  title: COMMISSIONS_SZ_DEFINITION.title,
                  description: COMMISSIONS_SZ_DEFINITION.description,
                  questions: COMMISSIONS_SZ_DEFINITION.questions,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['COMMISSIONS_SZ']?.completed || false,
                  completedAt: questionnaireStatuses['COMMISSIONS_SZ']?.completed_at,
                },
                {
                  id: LIS_SZ_DEFINITION.code,
                  code: LIS_SZ_DEFINITION.code,
                  title: LIS_SZ_DEFINITION.title,
                  description: LIS_SZ_DEFINITION.description,
                  questions: LIS_SZ_DEFINITION.questions,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['LIS_SZ']?.completed || false,
                  completedAt: questionnaireStatuses['LIS_SZ']?.completed_at,
                }
              ]
            },
            {
              id: 'wais4_sz',
              name: 'WAIS-IV',
              questionnaires: [
                {
                  id: WAIS4_CRITERIA_SZ_DEFINITION.code,
                  code: WAIS4_CRITERIA_SZ_DEFINITION.code,
                  title: WAIS4_CRITERIA_SZ_DEFINITION.title,
                  description: WAIS4_CRITERIA_SZ_DEFINITION.description,
                  questions: WAIS4_CRITERIA_SZ_DEFINITION.questions,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['WAIS4_CRITERIA_SZ']?.completed || false,
                  completedAt: questionnaireStatuses['WAIS4_CRITERIA_SZ']?.completed_at,
                },
                {
                  id: WAIS4_EFFICIENCE_SZ_DEFINITION.code,
                  code: WAIS4_EFFICIENCE_SZ_DEFINITION.code,
                  title: WAIS4_EFFICIENCE_SZ_DEFINITION.title,
                  description: WAIS4_EFFICIENCE_SZ_DEFINITION.description,
                  questions: WAIS4_EFFICIENCE_SZ_DEFINITION.questions,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['WAIS4_EFFICIENCE_SZ']?.completed || false,
                  completedAt: questionnaireStatuses['WAIS4_EFFICIENCE_SZ']?.completed_at,
                },
                {
                  id: WAIS4_SIMILITUDES_SZ_DEFINITION.code,
                  code: WAIS4_SIMILITUDES_SZ_DEFINITION.code,
                  title: WAIS4_SIMILITUDES_SZ_DEFINITION.title,
                  description: WAIS4_SIMILITUDES_SZ_DEFINITION.description,
                  questions: WAIS4_SIMILITUDES_SZ_DEFINITION.questions,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['WAIS4_SIMILITUDES_SZ']?.completed || false,
                  completedAt: questionnaireStatuses['WAIS4_SIMILITUDES_SZ']?.completed_at,
                },
                {
                  id: WAIS4_MEMOIRE_CHIFFRES_SZ_DEFINITION.code,
                  code: WAIS4_MEMOIRE_CHIFFRES_SZ_DEFINITION.code,
                  title: WAIS4_MEMOIRE_CHIFFRES_SZ_DEFINITION.title,
                  description: WAIS4_MEMOIRE_CHIFFRES_SZ_DEFINITION.description,
                  questions: WAIS4_MEMOIRE_CHIFFRES_SZ_DEFINITION.questions,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['WAIS4_MEMOIRE_CHIFFRES_SZ']?.completed || false,
                  completedAt: questionnaireStatuses['WAIS4_MEMOIRE_CHIFFRES_SZ']?.completed_at,
                },
                {
                  id: WAIS4_MATRICES_SZ_DEFINITION.code,
                  code: WAIS4_MATRICES_SZ_DEFINITION.code,
                  title: WAIS4_MATRICES_SZ_DEFINITION.title,
                  description: WAIS4_MATRICES_SZ_DEFINITION.description,
                  questions: WAIS4_MATRICES_SZ_DEFINITION.questions,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses['WAIS4_MATRICES_SZ']?.completed || false,
                  completedAt: questionnaireStatuses['WAIS4_MATRICES_SZ']?.completed_at,
                },
                {
                  id: SSTICS_SZ_DEFINITION.code,
                  code: SSTICS_SZ_DEFINITION.code,
                  title: SSTICS_SZ_DEFINITION.title,
                  description: SSTICS_SZ_DEFINITION.description,
                  questions: SSTICS_SZ_DEFINITION.questions,
                  target_role: 'patient',
                  completed: questionnaireStatuses['SSTICS_SZ']?.completed || false,
                  completedAt: questionnaireStatuses['SSTICS_SZ']?.completed_at,
                }
              ]
            }
          ]
        },
        {
          id: 'mod_social_sz',
          name: 'Social',
          description: 'Évaluation sociale',
          questionnaires: [
            {
              ...BILAN_SOCIAL_SZ_DEFINITION,
              id: BILAN_SOCIAL_SZ_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['BILAN_SOCIAL_SZ']?.completed || false,
              completedAt: questionnaireStatuses['BILAN_SOCIAL_SZ']?.completed_at,
            }
          ]
        },
        {
          id: 'mod_auto_sz',
          name: 'Autoquestionnaires',
          description: 'Questionnaires remplis par le patient',
          questionnaires: [
            {
              id: CBQ_SZ_DEFINITION.code,
              code: CBQ_SZ_DEFINITION.code,
              title: CBQ_SZ_DEFINITION.title,
              description: CBQ_SZ_DEFINITION.description,
              questions: CBQ_SZ_DEFINITION.questions,
              target_role: 'patient',
              completed: questionnaireStatuses['CBQ_SZ']?.completed || false,
              completedAt: questionnaireStatuses['CBQ_SZ']?.completed_at,
            },
            {
              id: DACOBS_SZ_DEFINITION.code,
              code: DACOBS_SZ_DEFINITION.code,
              title: DACOBS_SZ_DEFINITION.title,
              description: DACOBS_SZ_DEFINITION.description,
              questions: DACOBS_SZ_DEFINITION.questions,
              target_role: 'patient',
              completed: questionnaireStatuses['DACOBS_SZ']?.completed || false,
              completedAt: questionnaireStatuses['DACOBS_SZ']?.completed_at,
            },
            {
              // Exclude scoring functions - they cannot be serialized to client components
              id: SQOL_SZ_DEFINITION.code,
              code: SQOL_SZ_DEFINITION.code,
              title: SQOL_SZ_DEFINITION.title,
              description: SQOL_SZ_DEFINITION.description,
              questions: SQOL_SZ_DEFINITION.questions,
              target_role: 'patient',
              completed: questionnaireStatuses['SQOL_SZ']?.completed || false,
              completedAt: questionnaireStatuses['SQOL_SZ']?.completed_at,
            },
            {
              id: CTQ_SZ_DEFINITION.code,
              code: CTQ_SZ_DEFINITION.code,
              title: CTQ_SZ_DEFINITION.title,
              description: CTQ_SZ_DEFINITION.description,
              questions: CTQ_SZ_DEFINITION.questions,
              target_role: 'patient',
              completed: questionnaireStatuses['CTQ_SZ']?.completed || false,
              completedAt: questionnaireStatuses['CTQ_SZ']?.completed_at,
            },
            {
              id: MARS_SZ_DEFINITION.code,
              code: MARS_SZ_DEFINITION.code,
              title: MARS_SZ_DEFINITION.title,
              description: MARS_SZ_DEFINITION.description,
              questions: MARS_SZ_DEFINITION.questions,
              target_role: 'patient',
              completed: questionnaireStatuses['MARS_SZ']?.completed || false,
              completedAt: questionnaireStatuses['MARS_SZ']?.completed_at,
            },
            {
              id: BIS_SZ_DEFINITION.code,
              code: BIS_SZ_DEFINITION.code,
              title: BIS_SZ_DEFINITION.title,
              description: BIS_SZ_DEFINITION.description,
              questions: BIS_SZ_DEFINITION.questions,
              target_role: 'patient',
              completed: questionnaireStatuses['BIS_SZ']?.completed || false,
              completedAt: questionnaireStatuses['BIS_SZ']?.completed_at,
            },
            {
              id: EQ5D5L_SZ_DEFINITION.code,
              code: EQ5D5L_SZ_DEFINITION.code,
              title: EQ5D5L_SZ_DEFINITION.title,
              description: EQ5D5L_SZ_DEFINITION.description,
              questions: EQ5D5L_SZ_DEFINITION.questions,
              target_role: 'patient',
              completed: questionnaireStatuses['EQ5D5L_SZ']?.completed || false,
              completedAt: questionnaireStatuses['EQ5D5L_SZ']?.completed_at,
            },
            {
              id: IPAQ_SZ_DEFINITION.code,
              code: IPAQ_SZ_DEFINITION.code,
              title: IPAQ_SZ_DEFINITION.title,
              description: IPAQ_SZ_DEFINITION.description,
              questions: IPAQ_SZ_DEFINITION.questions,
              target_role: 'patient',
              completed: questionnaireStatuses['IPAQ_SZ']?.completed || false,
              completedAt: questionnaireStatuses['IPAQ_SZ']?.completed_at,
            },
            {
              id: YBOCS_SZ_DEFINITION.code,
              code: YBOCS_SZ_DEFINITION.code,
              title: YBOCS_SZ_DEFINITION.title,
              description: YBOCS_SZ_DEFINITION.description,
              questions: YBOCS_SZ_DEFINITION.questions,
              target_role: 'patient',
              completed: questionnaireStatuses['YBOCS_SZ']?.completed || false,
              completedAt: questionnaireStatuses['YBOCS_SZ']?.completed_at,
            },
            {
              id: WURS25_SZ_DEFINITION.code,
              code: WURS25_SZ_DEFINITION.code,
              title: WURS25_SZ_DEFINITION.title,
              description: WURS25_SZ_DEFINITION.description,
              questions: WURS25_SZ_DEFINITION.questions,
              target_role: 'patient',
              completed: questionnaireStatuses['WURS25_SZ']?.completed || false,
              completedAt: questionnaireStatuses['WURS25_SZ']?.completed_at,
            },
            {
              id: STORI_SZ_DEFINITION.code,
              code: STORI_SZ_DEFINITION.code,
              title: STORI_SZ_DEFINITION.title,
              description: STORI_SZ_DEFINITION.description,
              questions: STORI_SZ_DEFINITION.questions,
              target_role: 'patient',
              completed: questionnaireStatuses['STORI_SZ']?.completed || false,
              completedAt: questionnaireStatuses['STORI_SZ']?.completed_at,
            },
            {
              id: SOGS_SZ_DEFINITION.code,
              code: SOGS_SZ_DEFINITION.code,
              title: SOGS_SZ_DEFINITION.title,
              description: SOGS_SZ_DEFINITION.description,
              questions: SOGS_SZ_DEFINITION.questions,
              target_role: 'patient',
              completed: questionnaireStatuses['SOGS_SZ']?.completed || false,
              completedAt: questionnaireStatuses['SOGS_SZ']?.completed_at,
            },
            {
              id: PSQI_SZ_DEFINITION.code,
              code: PSQI_SZ_DEFINITION.code,
              title: PSQI_SZ_DEFINITION.title,
              description: PSQI_SZ_DEFINITION.description,
              questions: PSQI_SZ_DEFINITION.questions,
              target_role: 'patient',
              completed: questionnaireStatuses['PSQI_SZ']?.completed || false,
              completedAt: questionnaireStatuses['PSQI_SZ']?.completed_at,
            },
            {
              id: PRESENTEISME_SZ_DEFINITION.code,
              code: PRESENTEISME_SZ_DEFINITION.code,
              title: PRESENTEISME_SZ_DEFINITION.title,
              description: PRESENTEISME_SZ_DEFINITION.description,
              questions: PRESENTEISME_SZ_DEFINITION.questions,
              target_role: 'patient',
              completed: questionnaireStatuses['PRESENTEISME_SZ']?.completed || false,
              completedAt: questionnaireStatuses['PRESENTEISME_SZ']?.completed_at,
            },
            {
              id: FAGERSTROM_SZ_DEFINITION.code,
              code: FAGERSTROM_SZ_DEFINITION.code,
              title: FAGERSTROM_SZ_DEFINITION.title,
              description: FAGERSTROM_SZ_DEFINITION.description,
              questions: FAGERSTROM_SZ_DEFINITION.questions,
              target_role: 'patient',
              completed: questionnaireStatuses['FAGERSTROM_SZ']?.completed || false,
              completedAt: questionnaireStatuses['FAGERSTROM_SZ']?.completed_at,
            },
            {
              id: BRIEF_A_AUTO_SZ_DEFINITION.code,
              code: BRIEF_A_AUTO_SZ_DEFINITION.code,
              title: BRIEF_A_AUTO_SZ_DEFINITION.title,
              description: BRIEF_A_AUTO_SZ_DEFINITION.description,
              questions: BRIEF_A_AUTO_SZ_DEFINITION.questions,
              target_role: 'patient',
              completed: questionnaireStatuses['BRIEF_A_AUTO_SZ']?.completed || false,
              completedAt: questionnaireStatuses['BRIEF_A_AUTO_SZ']?.completed_at,
            }
          ]
        },
        {
          id: 'mod_auto_entourage_sz',
          name: 'Autoquestionnaires entourage',
          description: 'Questionnaires remplis par l\'entourage du patient',
          questionnaires: [
            {
              id: EPHP_SZ_DEFINITION.code,
              code: EPHP_SZ_DEFINITION.code,
              title: EPHP_SZ_DEFINITION.title,
              description: EPHP_SZ_DEFINITION.description,
              questions: EPHP_SZ_DEFINITION.questions,
              target_role: 'entourage',
              completed: questionnaireStatuses['EPHP_SZ']?.completed || false,
              completedAt: questionnaireStatuses['EPHP_SZ']?.completed_at,
            }
          ]
        }
      ];
    } else {
      // Bipolar and other pathologies - full initial evaluation
      // Build nurse module questionnaires with conditional Fagerstrom
      const nurseQuestionnaires: any[] = [
        {
          ...TOBACCO_DEFINITION,
          id: TOBACCO_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: questionnaireStatuses['TOBACCO']?.completed || false,
          completedAt: questionnaireStatuses['TOBACCO']?.completed_at,
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
          completed: questionnaireStatuses['FAGERSTROM']?.completed || false,
          completedAt: questionnaireStatuses['FAGERSTROM']?.completed_at,
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
          completed: questionnaireStatuses['PHYSICAL_PARAMS']?.completed || false,
          completedAt: questionnaireStatuses['PHYSICAL_PARAMS']?.completed_at,
        },
        {
          ...BLOOD_PRESSURE_DEFINITION,
          id: BLOOD_PRESSURE_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: questionnaireStatuses['BLOOD_PRESSURE']?.completed || false,
          completedAt: questionnaireStatuses['BLOOD_PRESSURE']?.completed_at,
        },
        {
          ...ECG_DEFINITION,
          id: ECG_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: questionnaireStatuses['ECG']?.completed || false,
          completedAt: questionnaireStatuses['ECG']?.completed_at,
        },
        {
          ...SLEEP_APNEA_DEFINITION,
          id: SLEEP_APNEA_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: questionnaireStatuses['SLEEP_APNEA']?.completed || false,
          completedAt: questionnaireStatuses['SLEEP_APNEA']?.completed_at,
        },
        {
          ...BIOLOGICAL_ASSESSMENT_DEFINITION,
          id: BIOLOGICAL_ASSESSMENT_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: questionnaireStatuses['BIOLOGICAL_ASSESSMENT']?.completed || false,
          completedAt: questionnaireStatuses['BIOLOGICAL_ASSESSMENT']?.completed_at,
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
              completed: questionnaireStatuses['MADRS']?.completed || false,
              completedAt: questionnaireStatuses['MADRS']?.completed_at,
            },
            {
              ...YMRS_DEFINITION,
              id: YMRS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['YMRS']?.completed || false,
              completedAt: questionnaireStatuses['YMRS']?.completed_at,
            },
            {
              ...CGI_DEFINITION,
              id: CGI_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['CGI']?.completed || false,
              completedAt: questionnaireStatuses['CGI']?.completed_at,
            },
            {
              ...EGF_DEFINITION,
              id: EGF_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['EGF']?.completed || false,
              completedAt: questionnaireStatuses['EGF']?.completed_at,
            },
            {
              ...ALDA_DEFINITION,
              id: ALDA_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['ALDA']?.completed || false,
              completedAt: questionnaireStatuses['ALDA']?.completed_at,
            },
            {
              ...ETAT_PATIENT_DEFINITION,
              id: ETAT_PATIENT_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['ETAT_PATIENT']?.completed || false,
              completedAt: questionnaireStatuses['ETAT_PATIENT']?.completed_at,
            },
            {
              ...FAST_DEFINITION,
              id: FAST_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['FAST']?.completed || false,
              completedAt: questionnaireStatuses['FAST']?.completed_at,
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
              completed: questionnaireStatuses['DSM5_HUMEUR']?.completed || false,
              completedAt: questionnaireStatuses['DSM5_HUMEUR']?.completed_at,
            },
            {
              ...DSM5_PSYCHOTIC_DEFINITION,
              id: DSM5_PSYCHOTIC_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['DSM5_PSYCHOTIC']?.completed || false,
              completedAt: questionnaireStatuses['DSM5_PSYCHOTIC']?.completed_at,
            },
            {
              ...DSM5_COMORBID_DEFINITION,
              id: DSM5_COMORBID_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['DSM5_COMORBID']?.completed || false,
              completedAt: questionnaireStatuses['DSM5_COMORBID']?.completed_at,
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
              completed: questionnaireStatuses['DIVA']?.completed || false,
              completedAt: questionnaireStatuses['DIVA']?.completed_at,
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
              completed: questionnaireStatuses['CSSRS']?.completed || false,
              completedAt: questionnaireStatuses['CSSRS']?.completed_at,
            },
            {
              ...ISA_DEFINITION,
              id: ISA_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['ISA']?.completed || false,
              completedAt: questionnaireStatuses['ISA']?.completed_at,
            },
            {
              ...SIS_DEFINITION,
              id: SIS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['SIS']?.completed || false,
              completedAt: questionnaireStatuses['SIS']?.completed_at,
            },
            {
              ...SUICIDE_HISTORY_DEFINITION,
              id: SUICIDE_HISTORY_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['SUICIDE_HISTORY']?.completed || false,
              completedAt: questionnaireStatuses['SUICIDE_HISTORY']?.completed_at,
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
                completed: questionnaireStatuses['FAMILY_HISTORY']?.completed || false,
                completedAt: questionnaireStatuses['FAMILY_HISTORY']?.completed_at,
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
                    completed: questionnaireStatuses['PERINATALITE']?.completed || false,
                    completedAt: questionnaireStatuses['PERINATALITE']?.completed_at,
                  },
                  {
                    ...PATHO_NEURO_DEFINITION,
                    id: PATHO_NEURO_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['PATHO_NEURO']?.completed || false,
                    completedAt: questionnaireStatuses['PATHO_NEURO']?.completed_at,
                  },
                  {
                    ...PATHO_CARDIO_DEFINITION,
                    id: PATHO_CARDIO_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['PATHO_CARDIO']?.completed || false,
                    completedAt: questionnaireStatuses['PATHO_CARDIO']?.completed_at,
                  },
                  {
                    ...PATHO_ENDOC_DEFINITION,
                    id: PATHO_ENDOC_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['PATHO_ENDOC']?.completed || false,
                    completedAt: questionnaireStatuses['PATHO_ENDOC']?.completed_at,
                  },
                  {
                    ...PATHO_DERMATO_DEFINITION,
                    id: PATHO_DERMATO_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['PATHO_DERMATO']?.completed || false,
                    completedAt: questionnaireStatuses['PATHO_DERMATO']?.completed_at,
                  },
                  {
                    ...PATHO_URINAIRE_DEFINITION,
                    id: PATHO_URINAIRE_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['PATHO_URINAIRE']?.completed || false,
                    completedAt: questionnaireStatuses['PATHO_URINAIRE']?.completed_at,
                  },
                  {
                    ...ANTECEDENTS_GYNECO_DEFINITION,
                    id: ANTECEDENTS_GYNECO_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['ANTECEDENTS_GYNECO']?.completed || false,
                    completedAt: questionnaireStatuses['ANTECEDENTS_GYNECO']?.completed_at,
                  },
                  {
                    ...PATHO_HEPATO_GASTRO_DEFINITION,
                    id: PATHO_HEPATO_GASTRO_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['PATHO_HEPATO_GASTRO']?.completed || false,
                    completedAt: questionnaireStatuses['PATHO_HEPATO_GASTRO']?.completed_at,
                  },
                  {
                    ...PATHO_ALLERGIQUE_DEFINITION,
                    id: PATHO_ALLERGIQUE_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['PATHO_ALLERGIQUE']?.completed || false,
                    completedAt: questionnaireStatuses['PATHO_ALLERGIQUE']?.completed_at,
                  },
                  {
                    ...AUTRES_PATHO_DEFINITION,
                    id: AUTRES_PATHO_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['AUTRES_PATHO']?.completed || false,
                    completedAt: questionnaireStatuses['AUTRES_PATHO']?.completed_at,
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
          questionnaires: (() => {
            const independentTests = [
              { def: CVLT_DEFINITION, code: 'CVLT' },
              { def: TMT_DEFINITION, code: 'TMT' },
              { def: STROOP_DEFINITION, code: 'STROOP' },
              { def: FLUENCES_VERBALES_DEFINITION, code: 'FLUENCES_VERBALES' },
              { def: MEM3_SPATIAL_DEFINITION, code: 'MEM3_SPATIAL' }
            ];

            return independentTests.map(({ def, code }) => {
              const isAnswered = wais3CriteriaAnswered || wais4CriteriaAnswered;
              const isAccepted = wais3Accepted || wais4Accepted;

              if (!isAnswered) {
                return {
                  ...def,
                  id: def.code,
                  target_role: 'healthcare_professional',
                  completed: false,
                  completedAt: null,
                  isConditional: true,
                  conditionMet: false,
                  conditionMessage: 'Complétez d\'abord les Critères cliniques (WAIS-III ou WAIS-IV)',
                };
              } else if (isAccepted) {
                return {
                  ...def,
                  id: def.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses[code]?.completed || false,
                  completedAt: questionnaireStatuses[code]?.completed_at,
                  isConditional: true,
                  conditionMet: true,
                };
              } else {
                return {
                  ...def,
                  id: def.code,
                  target_role: 'healthcare_professional',
                  completed: false,
                  completedAt: null,
                  isConditional: true,
                  conditionMet: false,
                  conditionMessage: 'Patient non accepté pour l\'évaluation neuropsychologique',
                };
              }
            });
          })(),
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
                    completed: questionnaireStatuses['WAIS3_CRITERIA']?.completed || false,
                    completedAt: questionnaireStatuses['WAIS3_CRITERIA']?.completed_at,
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

                // Add conditional questionnaires (WAIS-III specific tests)
                addConditionalQuestionnaire(WAIS3_LEARNING_DEFINITION, 'WAIS3_LEARNING');
                addConditionalQuestionnaire(WAIS3_VOCABULAIRE_DEFINITION, 'WAIS3_VOCABULAIRE');
                addConditionalQuestionnaire(WAIS3_MATRICES_DEFINITION, 'WAIS3_MATRICES');
                addConditionalQuestionnaire(WAIS3_CODE_SYMBOLES_DEFINITION, 'WAIS3_CODE_SYMBOLES');
                addConditionalQuestionnaire(WAIS3_DIGIT_SPAN_DEFINITION, 'WAIS3_DIGIT_SPAN');
                addConditionalQuestionnaire(WAIS3_CPT2_DEFINITION, 'WAIS3_CPT2');

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
                    completed: questionnaireStatuses['WAIS4_CRITERIA']?.completed || false,
                    completedAt: questionnaireStatuses['WAIS4_CRITERIA']?.completed_at,
                  },
                  {
                    ...COBRA_DEFINITION,
                    id: COBRA_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['COBRA']?.completed || false,
                    completedAt: questionnaireStatuses['COBRA']?.completed_at,
                  },
                  {
                    ...CPT3_DEFINITION,
                    id: CPT3_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['CPT3']?.completed || false,
                    completedAt: questionnaireStatuses['CPT3']?.completed_at,
                  },
                  {
                    ...TEST_COMMISSIONS_DEFINITION,
                    id: TEST_COMMISSIONS_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['TEST_COMMISSIONS']?.completed || false,
                    completedAt: questionnaireStatuses['TEST_COMMISSIONS']?.completed_at,
                  },
                  {
                    ...SCIP_DEFINITION,
                    id: SCIP_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['SCIP']?.completed || false,
                    completedAt: questionnaireStatuses['SCIP']?.completed_at,
                  },
                  {
                    ...WAIS4_SIMILITUDES_DEFINITION,
                    id: WAIS4_SIMILITUDES_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['WAIS4_SIMILITUDES']?.completed || false,
                    completedAt: questionnaireStatuses['WAIS4_SIMILITUDES']?.completed_at,
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
                addConditionalQuestionnaire(WAIS4_LEARNING_DEFINITION, 'WAIS4_LEARNING');
                addConditionalQuestionnaire(WAIS4_MATRICES_DEFINITION, 'WAIS4_MATRICES');
                addConditionalQuestionnaire(WAIS4_CODE_DEFINITION, 'WAIS_IV_CODE_SYMBOLES_IVT');
                addConditionalQuestionnaire(WAIS4_DIGIT_SPAN_DEFINITION, 'WAIS4_DIGIT_SPAN');

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
              completed: questionnaireStatuses['EQ5D5L']?.completed || false,
              completedAt: questionnaireStatuses['EQ5D5L']?.completed_at,
            },
            {
              ...PRISE_M_DEFINITION,
              id: PRISE_M_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['PRISE_M']?.completed || false,
              completedAt: questionnaireStatuses['PRISE_M']?.completed_at,
            },
            {
              ...STAI_YA_DEFINITION,
              id: STAI_YA_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['STAI_YA']?.completed || false,
              completedAt: questionnaireStatuses['STAI_YA']?.completed_at,
            },
            {
              ...MARS_DEFINITION,
              id: MARS_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['MARS']?.completed || false,
              completedAt: questionnaireStatuses['MARS']?.completed_at,
            },
            {
              ...MATHYS_DEFINITION,
              id: MATHYS_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['MATHYS']?.completed || false,
              completedAt: questionnaireStatuses['MATHYS']?.completed_at,
            },
            {
              ...ASRM_DEFINITION,
              id: ASRM_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['ASRM']?.completed || false,
              completedAt: questionnaireStatuses['ASRM']?.completed_at,
            },
            {
              ...QIDS_DEFINITION,
              id: QIDS_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['QIDS_SR16']?.completed || false,
              completedAt: questionnaireStatuses['QIDS_SR16']?.completed_at,
            },
            {
              ...PSQI_DEFINITION,
              id: PSQI_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['PSQI']?.completed || false,
              completedAt: questionnaireStatuses['PSQI']?.completed_at,
            },
            {
              ...EPWORTH_DEFINITION,
              id: EPWORTH_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['EPWORTH']?.completed || false,
              completedAt: questionnaireStatuses['EPWORTH']?.completed_at,
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
              completed: questionnaireStatuses['SOCIAL']?.completed || false,
              completedAt: questionnaireStatuses['SOCIAL']?.completed_at,
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
              completed: questionnaireStatuses['ASRS']?.completed || false,
              completedAt: questionnaireStatuses['ASRS']?.completed_at,
            },
            {
              ...CTQ_DEFINITION,
              id: CTQ_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['CTQ']?.completed || false,
              completedAt: questionnaireStatuses['CTQ']?.completed_at,
            },
            {
              ...BIS10_DEFINITION,
              id: BIS10_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['BIS10']?.completed || false,
              completedAt: questionnaireStatuses['BIS10']?.completed_at,
            },
            {
              ...ALS18_DEFINITION,
              id: ALS18_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['ALS18']?.completed || false,
              completedAt: questionnaireStatuses['ALS18']?.completed_at,
            },
            {
              ...AIM_DEFINITION,
              id: AIM_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['AIM']?.completed || false,
              completedAt: questionnaireStatuses['AIM']?.completed_at,
            },
            {
              ...WURS25_DEFINITION,
              id: WURS25_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['WURS25']?.completed || false,
              completedAt: questionnaireStatuses['WURS25']?.completed_at,
            },
            {
              ...AQ12_DEFINITION,
              id: AQ12_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['AQ12']?.completed || false,
              completedAt: questionnaireStatuses['AQ12']?.completed_at,
            },
            {
              ...CSM_DEFINITION,
              id: CSM_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['CSM']?.completed || false,
              completedAt: questionnaireStatuses['CSM']?.completed_at,
            },
            {
              ...CTI_DEFINITION,
              id: CTI_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['CTI']?.completed || false,
              completedAt: questionnaireStatuses['CTI']?.completed_at,
            }
          ]
        }
      ];
    }
  } else if (visit.visit_type === 'biannual_followup') {
    // Build nurse module questionnaires with conditional Fagerstrom for biannual follow-up
    const biannualNurseQuestionnaires: any[] = [
      {
        ...TOBACCO_DEFINITION,
        id: TOBACCO_DEFINITION.code,
        target_role: 'healthcare_professional',
        completed: questionnaireStatuses['TOBACCO']?.completed || false,
        completedAt: questionnaireStatuses['TOBACCO']?.completed_at,
      },
    ];

    // Add Fagerstrom with conditional display properties (ALWAYS visible)
    if (!tobaccoAnswered) {
      biannualNurseQuestionnaires.push({
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
      biannualNurseQuestionnaires.push({
        ...FAGERSTROM_DEFINITION,
        id: FAGERSTROM_DEFINITION.code,
        target_role: 'healthcare_professional',
        completed: questionnaireStatuses['FAGERSTROM']?.completed || false,
        completedAt: questionnaireStatuses['FAGERSTROM']?.completed_at,
        isConditional: true,
        conditionMet: true,
      });
    } else {
      biannualNurseQuestionnaires.push({
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

    // Add remaining nurse questionnaires for biannual
    biannualNurseQuestionnaires.push(
      {
        ...PHYSICAL_PARAMS_DEFINITION,
        id: PHYSICAL_PARAMS_DEFINITION.code,
        target_role: 'healthcare_professional',
        completed: questionnaireStatuses['PHYSICAL_PARAMS']?.completed || false,
        completedAt: questionnaireStatuses['PHYSICAL_PARAMS']?.completed_at,
      },
      {
        ...BLOOD_PRESSURE_DEFINITION,
        id: BLOOD_PRESSURE_DEFINITION.code,
        target_role: 'healthcare_professional',
        completed: questionnaireStatuses['BLOOD_PRESSURE']?.completed || false,
        completedAt: questionnaireStatuses['BLOOD_PRESSURE']?.completed_at,
      },
      {
        ...ECG_DEFINITION,
        id: ECG_DEFINITION.code,
        target_role: 'healthcare_professional',
        completed: questionnaireStatuses['ECG']?.completed || false,
        completedAt: questionnaireStatuses['ECG']?.completed_at,
      },
      {
        ...SLEEP_APNEA_DEFINITION,
        id: SLEEP_APNEA_DEFINITION.code,
        target_role: 'healthcare_professional',
        completed: questionnaireStatuses['SLEEP_APNEA']?.completed || false,
        completedAt: questionnaireStatuses['SLEEP_APNEA']?.completed_at,
      },
      {
        ...BIOLOGICAL_ASSESSMENT_DEFINITION,
        id: BIOLOGICAL_ASSESSMENT_DEFINITION.code,
        target_role: 'healthcare_professional',
        completed: questionnaireStatuses['BIOLOGICAL_ASSESSMENT']?.completed || false,
        completedAt: questionnaireStatuses['BIOLOGICAL_ASSESSMENT']?.completed_at,
      }
    );

    // Build biannual follow-up visit modules with conditional DIVA
    modulesWithQuestionnaires = [
      {
        id: 'mod_nurse',
        name: 'Infirmier',
        description: 'Évaluation par l\'infirmier',
        questionnaires: biannualNurseQuestionnaires
      },
      // Build medical evaluation module with sections for biannual follow-up
      (() => {
        // Build DSM5 section questionnaires with conditional DIVA
        const dsm5Questionnaires: any[] = [
          {
            ...DIAG_PSY_SEM_HUMEUR_ACTUELS_DEFINITION,
            id: DIAG_PSY_SEM_HUMEUR_ACTUELS_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['DIAG_PSY_SEM_HUMEUR_ACTUELS']?.completed || false,
            completedAt: questionnaireStatuses['DIAG_PSY_SEM_HUMEUR_ACTUELS']?.completed_at,
          },
          {
            ...DIAG_PSY_SEM_HUMEUR_DEPUIS_VISITE_DEFINITION,
            id: DIAG_PSY_SEM_HUMEUR_DEPUIS_VISITE_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['DIAG_PSY_SEM_HUMEUR_DEPUIS_VISITE']?.completed || false,
            completedAt: questionnaireStatuses['DIAG_PSY_SEM_HUMEUR_DEPUIS_VISITE']?.completed_at,
          },
          {
            ...DIAG_PSY_SEM_PSYCHOTIQUES_DEFINITION,
            id: DIAG_PSY_SEM_PSYCHOTIQUES_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['DIAG_PSY_SEM_PSYCHOTIQUES']?.completed || false,
            completedAt: questionnaireStatuses['DIAG_PSY_SEM_PSYCHOTIQUES']?.completed_at,
          },
        ];

        // Build Suicide section questionnaires
        const suicideQuestionnaires = [
          {
            ...ISA_FOLLOWUP_DEFINITION,
            id: ISA_FOLLOWUP_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['ISA_FOLLOWUP']?.completed || false,
            completedAt: questionnaireStatuses['ISA_FOLLOWUP']?.completed_at,
          },
          {
            ...SUICIDE_BEHAVIOR_FOLLOWUP_DEFINITION,
            id: SUICIDE_BEHAVIOR_FOLLOWUP_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['SUICIDE_BEHAVIOR_FOLLOWUP']?.completed || false,
            completedAt: questionnaireStatuses['SUICIDE_BEHAVIOR_FOLLOWUP']?.completed_at,
          },
          {
            ...CSSRS_DEFINITION,
            id: CSSRS_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['CSSRS']?.completed || false,
            completedAt: questionnaireStatuses['CSSRS']?.completed_at,
          }
        ];

        // Build Soin, suivi et arrêt de travail section questionnaires
        const soinSuiviQuestionnaires = [
          {
            ...SUIVI_RECOMMANDATIONS_DEFINITION,
            id: SUIVI_RECOMMANDATIONS_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['SUIVI_RECOMMANDATIONS']?.completed || false,
            completedAt: questionnaireStatuses['SUIVI_RECOMMANDATIONS']?.completed_at,
          },
          {
            ...RECOURS_AUX_SOINS_DEFINITION,
            id: RECOURS_AUX_SOINS_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['RECOURS_AUX_SOINS']?.completed || false,
            completedAt: questionnaireStatuses['RECOURS_AUX_SOINS']?.completed_at,
          },
          {
            ...TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION,
            id: TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['TRAITEMENT_NON_PHARMACOLOGIQUE']?.completed || false,
            completedAt: questionnaireStatuses['TRAITEMENT_NON_PHARMACOLOGIQUE']?.completed_at,
          },
          {
            ...ARRETS_DE_TRAVAIL_DEFINITION,
            id: ARRETS_DE_TRAVAIL_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['ARRETS_DE_TRAVAIL']?.completed || false,
            completedAt: questionnaireStatuses['ARRETS_DE_TRAVAIL']?.completed_at,
          },
          {
            ...SOMATIQUE_CONTRACEPTIF_DEFINITION,
            id: SOMATIQUE_CONTRACEPTIF_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['SOMATIQUE_ET_CONTRACEPTIF']?.completed || false,
            completedAt: questionnaireStatuses['SOMATIQUE_ET_CONTRACEPTIF']?.completed_at,
          },
          {
            ...STATUT_PROFESSIONNEL_DEFINITION,
            id: STATUT_PROFESSIONNEL_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['STATUT_PROFESSIONNEL']?.completed || false,
            completedAt: questionnaireStatuses['STATUT_PROFESSIONNEL']?.completed_at,
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
              id: 'soin_suivi',
              name: 'Soin, suivi et arrêt de travail',
              questionnaires: soinSuiviQuestionnaires
            }
          ]
        };
      })(),
      {
        id: 'mod_thymic_eval',
        name: 'Evaluation état thymique et fonctionnement',
        description: 'Évaluation de l\'état thymique et du fonctionnement',
        questionnaires: [
          {
            ...MADRS_DEFINITION,
            id: MADRS_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['MADRS']?.completed || false,
            completedAt: questionnaireStatuses['MADRS']?.completed_at,
          },
          {
            ...YMRS_DEFINITION,
            id: YMRS_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['YMRS']?.completed || false,
            completedAt: questionnaireStatuses['YMRS']?.completed_at,
          },
          {
            ...CGI_DEFINITION,
            id: CGI_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['CGI']?.completed || false,
            completedAt: questionnaireStatuses['CGI']?.completed_at,
          },
          {
            ...EGF_DEFINITION,
            id: EGF_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['EGF']?.completed || false,
            completedAt: questionnaireStatuses['EGF']?.completed_at,
          },
          {
            ...ALDA_DEFINITION,
            id: ALDA_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['ALDA']?.completed || false,
            completedAt: questionnaireStatuses['ALDA']?.completed_at,
          },
          {
            ...ETAT_PATIENT_DEFINITION,
            id: ETAT_PATIENT_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['ETAT_PATIENT']?.completed || false,
            completedAt: questionnaireStatuses['ETAT_PATIENT']?.completed_at,
          },
          {
            ...FAST_DEFINITION,
            id: FAST_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['FAST']?.completed || false,
            completedAt: questionnaireStatuses['FAST']?.completed_at,
          }
        ]
      }
    ];
  } else if (visit.visit_type === 'annual_evaluation') {
    // =====================================================================
    // ANNUAL EVALUATION - Full evaluation
    // =====================================================================

    // Check if this is a schizophrenia annual evaluation
    if (pathology === 'schizophrenia') {
      // Schizophrenia annual evaluation - uses same nurse module as initial visit
      modulesWithQuestionnaires = [
        {
          id: 'mod_nurse',
          name: 'Infirmier',
          description: 'Évaluation par l\'infirmier',
          questionnaires: [
            {
              ...SZ_DOSSIER_INFIRMIER_DEFINITION,
              id: SZ_DOSSIER_INFIRMIER_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['DOSSIER_INFIRMIER_SZ']?.completed || false,
              completedAt: questionnaireStatuses['DOSSIER_INFIRMIER_SZ']?.completed_at,
            },
            {
              ...SZ_BILAN_BIOLOGIQUE_DEFINITION,
              id: SZ_BILAN_BIOLOGIQUE_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['BILAN_BIOLOGIQUE_SZ']?.completed || false,
              completedAt: questionnaireStatuses['BILAN_BIOLOGIQUE_SZ']?.completed_at,
            }
          ]
        },
        {
          id: 'mod_hetero',
          name: 'Hétéro-questionnaires',
          description: 'Échelles cliniques d\'hétéro-évaluation',
          questionnaires: [
            {
              ...PANSS_DEFINITION,
              id: PANSS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['PANSS']?.completed || false,
              completedAt: questionnaireStatuses['PANSS']?.completed_at,
            },
            {
              ...CDSS_DEFINITION,
              id: CDSS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['CDSS']?.completed || false,
              completedAt: questionnaireStatuses['CDSS']?.completed_at,
            },
            {
              ...YMRS_SZ_DEFINITION,
              id: YMRS_SZ_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['YMRS_SZ']?.completed || false,
              completedAt: questionnaireStatuses['YMRS_SZ']?.completed_at,
            },
            {
              ...CGI_SZ_DEFINITION,
              id: CGI_SZ_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['CGI_SZ']?.completed || false,
              completedAt: questionnaireStatuses['CGI_SZ']?.completed_at,
            },
            {
              ...EGF_SZ_DEFINITION,
              id: EGF_SZ_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['EGF_SZ']?.completed || false,
              completedAt: questionnaireStatuses['EGF_SZ']?.completed_at,
            },
            {
              ...BARS_DEFINITION,
              id: BARS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['BARS']?.completed || false,
              completedAt: questionnaireStatuses['BARS']?.completed_at,
            },
            {
              ...SUMD_DEFINITION,
              id: SUMD_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['SUMD']?.completed || false,
              completedAt: questionnaireStatuses['SUMD']?.completed_at,
            },
            {
              ...SAPS_DEFINITION,
              id: SAPS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['SAPS']?.completed || false,
              completedAt: questionnaireStatuses['SAPS']?.completed_at,
            },
            {
              ...SANS_DEFINITION,
              id: SANS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['SANS']?.completed || false,
              completedAt: questionnaireStatuses['SANS']?.completed_at,
            },
            {
              ...UKU_DEFINITION,
              id: UKU_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['UKU']?.completed || false,
              completedAt: questionnaireStatuses['UKU']?.completed_at,
            },
            {
              ...AIMS_DEFINITION,
              id: AIMS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['AIMS']?.completed || false,
              completedAt: questionnaireStatuses['AIMS']?.completed_at,
            },
            {
              ...BARNES_DEFINITION,
              id: BARNES_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['BARNES']?.completed || false,
              completedAt: questionnaireStatuses['BARNES']?.completed_at,
            },
            {
              ...SAS_DEFINITION,
              id: SAS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['SAS']?.completed || false,
              completedAt: questionnaireStatuses['SAS']?.completed_at,
            },
            {
              ...PSP_DEFINITION,
              id: PSP_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['PSP']?.completed || false,
              completedAt: questionnaireStatuses['PSP']?.completed_at,
            }
          ]
        }
      ];
    } else {
      // =====================================================================
      // BIPOLAR ANNUAL EVALUATION - Full evaluation with 4 modules
      // =====================================================================

      // Build nurse module questionnaires with conditional Fagerstrom
      const annualNurseQuestionnaires: any[] = [
        {
          ...TOBACCO_DEFINITION,
          id: TOBACCO_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: questionnaireStatuses['TOBACCO']?.completed || false,
          completedAt: questionnaireStatuses['TOBACCO']?.completed_at,
        },
      ];

      // Add Fagerstrom with conditional display properties
      if (!tobaccoAnswered) {
        annualNurseQuestionnaires.push({
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
        annualNurseQuestionnaires.push({
          ...FAGERSTROM_DEFINITION,
          id: FAGERSTROM_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: questionnaireStatuses['FAGERSTROM']?.completed || false,
          completedAt: questionnaireStatuses['FAGERSTROM']?.completed_at,
          isConditional: true,
          conditionMet: true,
        });
      } else {
        annualNurseQuestionnaires.push({
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

      // Add remaining nurse questionnaires for annual
      annualNurseQuestionnaires.push(
        {
          ...PHYSICAL_PARAMS_DEFINITION,
          id: PHYSICAL_PARAMS_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: questionnaireStatuses['PHYSICAL_PARAMS']?.completed || false,
          completedAt: questionnaireStatuses['PHYSICAL_PARAMS']?.completed_at,
        },
        {
          ...BLOOD_PRESSURE_DEFINITION,
          id: BLOOD_PRESSURE_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: questionnaireStatuses['BLOOD_PRESSURE']?.completed || false,
          completedAt: questionnaireStatuses['BLOOD_PRESSURE']?.completed_at,
        },
        {
          ...ECG_DEFINITION,
          id: ECG_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: questionnaireStatuses['ECG']?.completed || false,
          completedAt: questionnaireStatuses['ECG']?.completed_at,
        },
        {
          ...SLEEP_APNEA_DEFINITION,
          id: SLEEP_APNEA_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: questionnaireStatuses['SLEEP_APNEA']?.completed || false,
          completedAt: questionnaireStatuses['SLEEP_APNEA']?.completed_at,
        },
        {
          ...BIOLOGICAL_ASSESSMENT_DEFINITION,
          id: BIOLOGICAL_ASSESSMENT_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: questionnaireStatuses['BIOLOGICAL_ASSESSMENT']?.completed || false,
          completedAt: questionnaireStatuses['BIOLOGICAL_ASSESSMENT']?.completed_at,
        }
      );

      // Build annual visit modules
      modulesWithQuestionnaires = [
        {
          id: 'mod_nurse',
          name: 'Infirmier',
          description: 'Évaluation par l\'infirmier',
          questionnaires: annualNurseQuestionnaires
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
              completed: questionnaireStatuses['MADRS']?.completed || false,
              completedAt: questionnaireStatuses['MADRS']?.completed_at,
            },
            {
              ...ALDA_DEFINITION,
              id: ALDA_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['ALDA']?.completed || false,
              completedAt: questionnaireStatuses['ALDA']?.completed_at,
            },
            {
              ...YMRS_DEFINITION,
              id: YMRS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['YMRS']?.completed || false,
              completedAt: questionnaireStatuses['YMRS']?.completed_at,
            },
            {
              ...FAST_DEFINITION,
              id: FAST_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['FAST']?.completed || false,
              completedAt: questionnaireStatuses['FAST']?.completed_at,
            },
            {
              ...CGI_DEFINITION,
              id: CGI_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['CGI']?.completed || false,
              completedAt: questionnaireStatuses['CGI']?.completed_at,
            },
            {
              ...EGF_DEFINITION,
              id: EGF_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['EGF']?.completed || false,
              completedAt: questionnaireStatuses['EGF']?.completed_at,
            },
            {
              ...ETAT_PATIENT_DEFINITION,
              id: ETAT_PATIENT_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['ETAT_PATIENT']?.completed || false,
              completedAt: questionnaireStatuses['ETAT_PATIENT']?.completed_at,
            }
          ]
        },
        // Full Medical evaluation module (same as initial_evaluation)
        (() => {
          // Build DSM5 section questionnaires with conditional DIVA
          const dsm5Questionnaires: any[] = [
            {
              ...DSM5_HUMEUR_DEFINITION,
              id: DSM5_HUMEUR_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['DSM5_HUMEUR']?.completed || false,
              completedAt: questionnaireStatuses['DSM5_HUMEUR']?.completed_at,
            },
            {
              ...DSM5_PSYCHOTIC_DEFINITION,
              id: DSM5_PSYCHOTIC_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['DSM5_PSYCHOTIC']?.completed || false,
              completedAt: questionnaireStatuses['DSM5_PSYCHOTIC']?.completed_at,
            },
            {
              ...DSM5_COMORBID_DEFINITION,
              id: DSM5_COMORBID_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['DSM5_COMORBID']?.completed || false,
              completedAt: questionnaireStatuses['DSM5_COMORBID']?.completed_at,
            },
          ];

          // Add DIVA with conditional display properties
          if (!dsm5ComorbidAnswered) {
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
            dsm5Questionnaires.push({
              ...DIVA_DEFINITION,
              id: DIVA_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['DIVA']?.completed || false,
              completedAt: questionnaireStatuses['DIVA']?.completed_at,
              isConditional: true,
              conditionMet: true,
            });
          } else {
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

          // Build Antécédents section questionnaires
          const antecedentsQuestionnaires = [
            {
              ...FAMILY_HISTORY_DEFINITION,
              id: FAMILY_HISTORY_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['FAMILY_HISTORY']?.completed || false,
              completedAt: questionnaireStatuses['FAMILY_HISTORY']?.completed_at,
            }
          ];

          // Build Suicide section questionnaires
          const suicideQuestionnaires = [
            {
              ...CSSRS_DEFINITION,
              id: CSSRS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['CSSRS']?.completed || false,
              completedAt: questionnaireStatuses['CSSRS']?.completed_at,
            },
            {
              ...ISA_FOLLOWUP_DEFINITION,
              id: ISA_FOLLOWUP_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['ISA_FOLLOWUP']?.completed || false,
              completedAt: questionnaireStatuses['ISA_FOLLOWUP']?.completed_at,
            },
            {
              ...SIS_DEFINITION,
              id: SIS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['SIS']?.completed || false,
              completedAt: questionnaireStatuses['SIS']?.completed_at,
            },
            {
              ...SUICIDE_HISTORY_DEFINITION,
              id: SUICIDE_HISTORY_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['SUICIDE_HISTORY']?.completed || false,
              completedAt: questionnaireStatuses['SUICIDE_HISTORY']?.completed_at,
            }
          ];

          // Build Histoire somatique section questionnaires
          const histoireSomatiqueQuestionnaires = [
            {
              ...PERINATALITE_DEFINITION,
              id: PERINATALITE_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['PERINATALITE']?.completed || false,
              completedAt: questionnaireStatuses['PERINATALITE']?.completed_at,
            },
            {
              ...PATHO_NEURO_DEFINITION,
              id: PATHO_NEURO_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['PATHO_NEURO']?.completed || false,
              completedAt: questionnaireStatuses['PATHO_NEURO']?.completed_at,
            },
            {
              ...PATHO_CARDIO_DEFINITION,
              id: PATHO_CARDIO_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['PATHO_CARDIO']?.completed || false,
              completedAt: questionnaireStatuses['PATHO_CARDIO']?.completed_at,
            },
            {
              ...PATHO_ENDOC_DEFINITION,
              id: PATHO_ENDOC_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['PATHO_ENDOC']?.completed || false,
              completedAt: questionnaireStatuses['PATHO_ENDOC']?.completed_at,
            },
            {
              ...PATHO_DERMATO_DEFINITION,
              id: PATHO_DERMATO_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['PATHO_DERMATO']?.completed || false,
              completedAt: questionnaireStatuses['PATHO_DERMATO']?.completed_at,
            },
            {
              ...PATHO_URINAIRE_DEFINITION,
              id: PATHO_URINAIRE_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['PATHO_URINAIRE']?.completed || false,
              completedAt: questionnaireStatuses['PATHO_URINAIRE']?.completed_at,
            },
            {
              ...ANTECEDENTS_GYNECO_DEFINITION,
              id: ANTECEDENTS_GYNECO_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['ANTECEDENTS_GYNECO']?.completed || false,
              completedAt: questionnaireStatuses['ANTECEDENTS_GYNECO']?.completed_at,
            },
            {
              ...PATHO_HEPATO_GASTRO_DEFINITION,
              id: PATHO_HEPATO_GASTRO_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['PATHO_HEPATO_GASTRO']?.completed || false,
              completedAt: questionnaireStatuses['PATHO_HEPATO_GASTRO']?.completed_at,
            },
            {
              ...PATHO_ALLERGIQUE_DEFINITION,
              id: PATHO_ALLERGIQUE_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['PATHO_ALLERGIQUE']?.completed || false,
              completedAt: questionnaireStatuses['PATHO_ALLERGIQUE']?.completed_at,
            },
            {
              ...AUTRES_PATHO_DEFINITION,
              id: AUTRES_PATHO_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['AUTRES_PATHO']?.completed || false,
              completedAt: questionnaireStatuses['AUTRES_PATHO']?.completed_at,
            }
          ];

          // Build Soin, suivi et arrêt de travail section questionnaires
          const soinSuiviQuestionnaires = [
            {
              ...SUIVI_RECOMMANDATIONS_DEFINITION,
              id: SUIVI_RECOMMANDATIONS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['SUIVI_RECOMMANDATIONS']?.completed || false,
              completedAt: questionnaireStatuses['SUIVI_RECOMMANDATIONS']?.completed_at,
            },
            {
              ...RECOURS_AUX_SOINS_DEFINITION,
              id: RECOURS_AUX_SOINS_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['RECOURS_AUX_SOINS']?.completed || false,
              completedAt: questionnaireStatuses['RECOURS_AUX_SOINS']?.completed_at,
            },
            {
              ...TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION,
              id: TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['TRAITEMENT_NON_PHARMACOLOGIQUE']?.completed || false,
              completedAt: questionnaireStatuses['TRAITEMENT_NON_PHARMACOLOGIQUE']?.completed_at,
            },
            {
              ...ARRETS_DE_TRAVAIL_DEFINITION,
              id: ARRETS_DE_TRAVAIL_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['ARRETS_DE_TRAVAIL']?.completed || false,
              completedAt: questionnaireStatuses['ARRETS_DE_TRAVAIL']?.completed_at,
            },
            {
              ...SOMATIQUE_CONTRACEPTIF_DEFINITION,
              id: SOMATIQUE_CONTRACEPTIF_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['SOMATIQUE_ET_CONTRACEPTIF']?.completed || false,
              completedAt: questionnaireStatuses['SOMATIQUE_ET_CONTRACEPTIF']?.completed_at,
            },
            {
              ...STATUT_PROFESSIONNEL_DEFINITION,
              id: STATUT_PROFESSIONNEL_DEFINITION.code,
              target_role: 'healthcare_professional',
              completed: questionnaireStatuses['STATUT_PROFESSIONNEL']?.completed || false,
              completedAt: questionnaireStatuses['STATUT_PROFESSIONNEL']?.completed_at,
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
                id: 'antecedents',
                name: 'Antécédents',
                questionnaires: antecedentsQuestionnaires
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
              },
              {
                id: 'soin_suivi',
                name: 'Soin, suivi et arrêt de travail',
                questionnaires: soinSuiviQuestionnaires
              }
            ]
          };
        })(),
        // Neuropsychological evaluation module (same structure as initial_evaluation)
        {
          id: 'mod_neuropsy',
          name: 'Evaluation Neuropsychologique',
          description: 'Évaluation neuropsychologique (Tests indépendants, WAIS-III, WAIS-IV)',
          questionnaires: (() => {
            const independentTests = [
              { def: CVLT_DEFINITION, code: 'CVLT' },
              { def: TMT_DEFINITION, code: 'TMT' },
              { def: STROOP_DEFINITION, code: 'STROOP' },
              { def: FLUENCES_VERBALES_DEFINITION, code: 'FLUENCES_VERBALES' },
              { def: MEM3_SPATIAL_DEFINITION, code: 'MEM3_SPATIAL' }
            ];

            return independentTests.map(({ def, code }) => {
              const isAnswered = wais3CriteriaAnswered || wais4CriteriaAnswered;
              const isAccepted = wais3Accepted || wais4Accepted;

              if (!isAnswered) {
                return {
                  ...def,
                  id: def.code,
                  target_role: 'healthcare_professional',
                  completed: false,
                  completedAt: null,
                  isConditional: true,
                  conditionMet: false,
                  conditionMessage: 'Complétez d\'abord les Critères cliniques (WAIS-III ou WAIS-IV)',
                };
              } else if (isAccepted) {
                return {
                  ...def,
                  id: def.code,
                  target_role: 'healthcare_professional',
                  completed: questionnaireStatuses[code]?.completed || false,
                  completedAt: questionnaireStatuses[code]?.completed_at,
                  isConditional: true,
                  conditionMet: true,
                };
              } else {
                return {
                  ...def,
                  id: def.code,
                  target_role: 'healthcare_professional',
                  completed: false,
                  completedAt: null,
                  isConditional: true,
                  conditionMet: false,
                  conditionMessage: 'Patient non accepté pour l\'évaluation neuropsychologique',
                };
              }
            });
          })(),
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
                    completed: questionnaireStatuses['WAIS3_CRITERIA']?.completed || false,
                    completedAt: questionnaireStatuses['WAIS3_CRITERIA']?.completed_at,
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

                // Add conditional questionnaires (WAIS-III specific tests)
                addConditionalQuestionnaire(WAIS3_LEARNING_DEFINITION, 'WAIS3_LEARNING');
                addConditionalQuestionnaire(WAIS3_VOCABULAIRE_DEFINITION, 'WAIS3_VOCABULAIRE');
                addConditionalQuestionnaire(WAIS3_MATRICES_DEFINITION, 'WAIS3_MATRICES');
                addConditionalQuestionnaire(WAIS3_CODE_SYMBOLES_DEFINITION, 'WAIS3_CODE_SYMBOLES');
                addConditionalQuestionnaire(WAIS3_DIGIT_SPAN_DEFINITION, 'WAIS3_DIGIT_SPAN');
                addConditionalQuestionnaire(WAIS3_CPT2_DEFINITION, 'WAIS3_CPT2');

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
                    completed: questionnaireStatuses['WAIS4_CRITERIA']?.completed || false,
                    completedAt: questionnaireStatuses['WAIS4_CRITERIA']?.completed_at,
                  },
                  {
                    ...COBRA_DEFINITION,
                    id: COBRA_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['COBRA']?.completed || false,
                    completedAt: questionnaireStatuses['COBRA']?.completed_at,
                  },
                  {
                    ...CPT3_DEFINITION,
                    id: CPT3_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['CPT3']?.completed || false,
                    completedAt: questionnaireStatuses['CPT3']?.completed_at,
                  },
                  {
                    ...TEST_COMMISSIONS_DEFINITION,
                    id: TEST_COMMISSIONS_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['TEST_COMMISSIONS']?.completed || false,
                    completedAt: questionnaireStatuses['TEST_COMMISSIONS']?.completed_at,
                  },
                  {
                    ...SCIP_DEFINITION,
                    id: SCIP_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['SCIP']?.completed || false,
                    completedAt: questionnaireStatuses['SCIP']?.completed_at,
                  },
                  {
                    ...WAIS4_SIMILITUDES_DEFINITION,
                    id: WAIS4_SIMILITUDES_DEFINITION.code,
                    target_role: 'healthcare_professional',
                    completed: questionnaireStatuses['WAIS4_SIMILITUDES']?.completed || false,
                    completedAt: questionnaireStatuses['WAIS4_SIMILITUDES']?.completed_at,
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
                addConditionalQuestionnaire(WAIS4_LEARNING_DEFINITION, 'WAIS4_LEARNING');
                addConditionalQuestionnaire(WAIS4_MATRICES_DEFINITION, 'WAIS4_MATRICES');
                addConditionalQuestionnaire(WAIS4_CODE_DEFINITION, 'WAIS_IV_CODE_SYMBOLES_IVT');
                addConditionalQuestionnaire(WAIS4_DIGIT_SPAN_DEFINITION, 'WAIS4_DIGIT_SPAN');

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
              completed: questionnaireStatuses['EQ5D5L']?.completed || false,
              completedAt: questionnaireStatuses['EQ5D5L']?.completed_at,
            },
            {
              ...PRISE_M_DEFINITION,
              id: PRISE_M_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['PRISE_M']?.completed || false,
              completedAt: questionnaireStatuses['PRISE_M']?.completed_at,
            },
            {
              ...STAI_YA_DEFINITION,
              id: STAI_YA_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['STAI_YA']?.completed || false,
              completedAt: questionnaireStatuses['STAI_YA']?.completed_at,
            },
            {
              ...MARS_DEFINITION,
              id: MARS_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['MARS']?.completed || false,
              completedAt: questionnaireStatuses['MARS']?.completed_at,
            },
            {
              ...MATHYS_DEFINITION,
              id: MATHYS_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['MATHYS']?.completed || false,
              completedAt: questionnaireStatuses['MATHYS']?.completed_at,
            },
            {
              ...ASRM_DEFINITION,
              id: ASRM_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['ASRM']?.completed || false,
              completedAt: questionnaireStatuses['ASRM']?.completed_at,
            },
            {
              ...QIDS_DEFINITION,
              id: QIDS_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['QIDS_SR16']?.completed || false,
              completedAt: questionnaireStatuses['QIDS_SR16']?.completed_at,
            },
            {
              ...PSQI_DEFINITION,
              id: PSQI_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['PSQI']?.completed || false,
              completedAt: questionnaireStatuses['PSQI']?.completed_at,
            },
            {
              ...EPWORTH_DEFINITION,
              id: EPWORTH_DEFINITION.code,
              target_role: 'patient',
              completed: questionnaireStatuses['EPWORTH']?.completed || false,
              completedAt: questionnaireStatuses['EPWORTH']?.completed_at,
            }
          ]
        }
      ];
    }
  }

  // Calculate accurate completion status from constructed modules
  // This ensures consistency with individual module progress displays
  // Uses same filtering logic: exclude conditional questionnaires where conditionMet is false
  // Includes both root-level questionnaires AND questionnaires inside sections
  const completionStatus = (() => {
    let totalQuestionnaires = 0;
    let completedQuestionnaires = 0;

    // Helper function to count a questionnaire
    const countQuestionnaire = (q: any) => {
      if (!q) return;

      // Skip conditional questionnaires where condition is not met
      // These are not required/visible, so don't count them
      if (q.isConditional && q.conditionMet !== true) {
        return;
      }

      totalQuestionnaires++;
      if (q.completed) {
        completedQuestionnaires++;
      }
    };

    for (const module of modulesWithQuestionnaires) {
      // Count root-level questionnaires
      const questionnaires = module.questionnaires || [];
      for (const q of questionnaires) {
        countQuestionnaire(q);
      }

      // Count questionnaires inside sections (e.g., mod_medical_eval, mod_neuropsy)
      const sections = (module as any).sections || [];
      for (const section of sections) {
        const sectionQuestionnaires = section?.questionnaires || [];
        for (const q of sectionQuestionnaires) {
          countQuestionnaire(q);
        }
      }
    }

    const completionPercentage = totalQuestionnaires > 0
      ? Math.round((completedQuestionnaires / totalQuestionnaires) * 100)
      : 0;

    return {
      totalQuestionnaires,
      completedQuestionnaires,
      completionPercentage
    };
  })();

  // Store the calculated completion status in the database
  // This ensures the patient profile page shows the same accurate progress
  // Await the update to ensure it completes before the page renders
  console.log('[VisitPage] Saving completion status for visit:', visitId, completionStatus);
  await updateVisitCompletionStatus(visitId, completionStatus);
  console.log('[VisitPage] Completion status saved');

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
                <span className="font-medium text-slate-700">
                  {VISIT_TYPE_NAMES[visit.visit_type as VisitType] || visit.visit_type}
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
