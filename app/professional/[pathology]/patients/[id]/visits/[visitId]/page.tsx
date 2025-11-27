import { getVisitDetailData } from "@/lib/services/visit-detail.service";
import { getVisitModules, VirtualModule } from "@/lib/services/visit.service";
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
  CSSRS_HISTORY_DEFINITION,
  SIS_DEFINITION,
  WAIS4_CRITERIA_DEFINITION,
  WAIS4_LEARNING_DEFINITION,
  WAIS4_MATRICES_DEFINITION,
  CVLT_DEFINITION,
  WAIS4_CODE_DEFINITION,
  WAIS4_DIGIT_SPAN_DEFINITION,
  TMT_DEFINITION
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

  // Transform completion status to match component expectations (snake_case -> camelCase)
  const completionStatus = {
    totalQuestionnaires: rawCompletionStatus.total_questionnaires,
    completedQuestionnaires: rawCompletionStatus.completed_questionnaires,
    completionPercentage: rawCompletionStatus.completion_percentage,
  };

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
    modulesWithQuestionnaires = [
      {
        id: 'mod_nurse',
        name: 'Infirmier',
        description: 'Évaluation par l\'infirmier',
        questionnaires: [
          {
            ...TOBACCO_DEFINITION,
            id: TOBACCO_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['TOBACCO_FR']?.completed || false,
            completedAt: questionnaireStatuses['TOBACCO_FR']?.completed_at,
          },
          {
            ...FAGERSTROM_DEFINITION,
            id: FAGERSTROM_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['FAGERSTROM_FR']?.completed || false,
            completedAt: questionnaireStatuses['FAGERSTROM_FR']?.completed_at,
          },
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
        ]
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
      {
        id: 'mod_medical_eval',
        name: 'Evaluation Médicale',
        description: 'Évaluation médicale complète',
        questionnaires: [
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
          {
            ...DIVA_DEFINITION,
            id: DIVA_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['DIVA_FR']?.completed || false,
            completedAt: questionnaireStatuses['DIVA_FR']?.completed_at,
          },
          {
            ...FAMILY_HISTORY_DEFINITION,
            id: FAMILY_HISTORY_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['FAMILY_HISTORY_FR']?.completed || false,
            completedAt: questionnaireStatuses['FAMILY_HISTORY_FR']?.completed_at,
          },
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
            ...CSSRS_HISTORY_DEFINITION,
            id: CSSRS_HISTORY_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['CSSRS_HISTORY_FR']?.completed || false,
            completedAt: questionnaireStatuses['CSSRS_HISTORY_FR']?.completed_at,
          },
          {
            ...SIS_DEFINITION,
            id: SIS_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['SIS_FR']?.completed || false,
            completedAt: questionnaireStatuses['SIS_FR']?.completed_at,
          },
        ]
      },
      {
        id: 'mod_neuropsy',
        name: 'Evaluation Neuropsychologique',
        description: 'Évaluation neuropsychologique (WAIS-IV)',
        questionnaires: [
          {
            ...WAIS4_CRITERIA_DEFINITION,
            id: WAIS4_CRITERIA_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['WAIS4_CRITERIA_FR']?.completed || false,
            completedAt: questionnaireStatuses['WAIS4_CRITERIA_FR']?.completed_at,
          },
          {
            ...WAIS4_LEARNING_DEFINITION,
            id: WAIS4_LEARNING_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['WAIS4_LEARNING_FR']?.completed || false,
            completedAt: questionnaireStatuses['WAIS4_LEARNING_FR']?.completed_at,
          },
          {
            ...WAIS4_MATRICES_DEFINITION,
            id: WAIS4_MATRICES_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['WAIS4_MATRICES_FR']?.completed || false,
            completedAt: questionnaireStatuses['WAIS4_MATRICES_FR']?.completed_at,
          },
          {
            ...CVLT_DEFINITION,
            id: CVLT_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['CVLT_FR']?.completed || false,
            completedAt: questionnaireStatuses['CVLT_FR']?.completed_at,
          },
          {
            ...WAIS4_CODE_DEFINITION,
            id: WAIS4_CODE_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['WAIS4_CODE_FR']?.completed || false,
            completedAt: questionnaireStatuses['WAIS4_CODE_FR']?.completed_at,
          },
          {
            ...WAIS4_DIGIT_SPAN_DEFINITION,
            id: WAIS4_DIGIT_SPAN_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['WAIS4_DIGIT_SPAN_FR']?.completed || false,
            completedAt: questionnaireStatuses['WAIS4_DIGIT_SPAN_FR']?.completed_at,
          },
          {
            ...TMT_DEFINITION,
            id: TMT_DEFINITION.code,
            target_role: 'healthcare_professional',
            completed: questionnaireStatuses['TMT_FR']?.completed || false,
            completedAt: questionnaireStatuses['TMT_FR']?.completed_at,
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
        {modulesWithQuestionnaires.map((module, index) => (
          <ExpandableModuleCard
            key={module.id}
            module={module}
            index={index}
            pathology={pathology}
            patientId={patientId}
            visitId={visitId}
              totalModules={modulesWithQuestionnaires.length}
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
