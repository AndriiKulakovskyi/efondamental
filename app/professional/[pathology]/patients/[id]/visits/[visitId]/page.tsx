import { getVisitById, getVisitCompletionStatus, VirtualModule } from "@/lib/services/visit.service";
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
} from "@/lib/services/questionnaire.service";
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
  getCssrsHistoryResponse,
  getSisResponse
} from "@/lib/services/questionnaire-hetero.service";
import {
  getSocialResponse
} from "@/lib/services/questionnaire-social.service";
import {
  getTobaccoResponse,
  getFagerstromResponse,
  getPhysicalParamsResponse,
  getBloodPressureResponse,
  getSleepApneaResponse,
  getBiologicalAssessmentResponse
} from "@/lib/services/questionnaire-infirmier.service";
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
} from "@/lib/constants/questionnaires";
import {
  // Hetero questionnaires
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
  SIS_DEFINITION
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
  BIOLOGICAL_ASSESSMENT_DEFINITION
} from "@/lib/constants/questionnaires-infirmier";
import {
  DSM5_HUMEUR_DEFINITION,
  DSM5_PSYCHOTIC_DEFINITION,
  DSM5_COMORBID_DEFINITION
} from "@/lib/constants/questionnaires-dsm5";
import {
  getDsm5HumeurResponse,
  getDsm5PsychoticResponse,
  getDsm5ComorbidResponse
} from "@/lib/services/questionnaire-dsm5.service";

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

  const visit = await getVisitById(visitId);

  if (!visit) {
    notFound();
  }

  // Construct modules and check status based on visit type
  let modulesWithQuestionnaires: VirtualModule[] = [];
  let completionStatus = {
    completedQuestionnaires: 0,
    totalQuestionnaires: 0,
    completionPercentage: 0
  };

  if (visit.visit_type === 'screening') {
    // Module 1: Autoquestionnaires
    const asrmResponse = await getAsrmResponse(visitId);
    const qidsResponse = await getQidsResponse(visitId);
    const mdqResponse = await getMdqResponse(visitId);

    const autoModule = {
      id: 'mod_auto',
      name: 'Autoquestionnaires',
      description: 'Questionnaires à remplir par le patient',
      questionnaires: [
        {
          ...ASRM_DEFINITION,
          id: ASRM_DEFINITION.code, // Use code as ID for routing
          target_role: 'patient',
          completed: !!asrmResponse,
          completedAt: asrmResponse?.completed_at,
        },
        {
          ...QIDS_DEFINITION,
          id: QIDS_DEFINITION.code,
          target_role: 'patient',
          completed: !!qidsResponse,
          completedAt: qidsResponse?.completed_at,
        },
        {
          ...MDQ_DEFINITION,
          id: MDQ_DEFINITION.code,
          target_role: 'patient',
          completed: !!mdqResponse,
          completedAt: mdqResponse?.completed_at,
        }
      ]
    };

    // Module 2: Partie Médicale
    const diagResponse = await getDiagnosticResponse(visitId);
    const orientResponse = await getOrientationResponse(visitId);

    const medicalModule = {
      id: 'mod_medical',
      name: 'Partie médicale',
      description: 'Évaluation clinique par le professionnel de santé',
      questionnaires: [
        {
          ...DIAGNOSTIC_DEFINITION,
          id: DIAGNOSTIC_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!diagResponse,
          completedAt: diagResponse?.completed_at,
          completedBy: diagResponse?.completed_by
        },
        {
          ...ORIENTATION_DEFINITION,
          id: ORIENTATION_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!orientResponse,
          completedAt: orientResponse?.completed_at,
          completedBy: orientResponse?.completed_by
        }
      ]
    };

    modulesWithQuestionnaires = [autoModule, medicalModule];

    // Calculate stats
    const total = autoModule.questionnaires.length + medicalModule.questionnaires.length;
    const completed = 
      autoModule.questionnaires.filter(q => q.completed).length + 
      medicalModule.questionnaires.filter(q => q.completed).length;
    
    completionStatus = {
      totalQuestionnaires: total,
      completedQuestionnaires: completed,
      completionPercentage: total > 0 ? (completed / total) * 100 : 0
    };
  } else if (visit.visit_type === 'initial_evaluation') {
    // Fetch all questionnaire responses for initial evaluation
    const [
      // ETAT responses
      eq5d5lResponse, priseMResponse, staiYaResponse, marsResponse, mathysResponse,
      asrmResponse, qidsResponse, psqiResponse, epworthResponse,
      // TRAITS responses
      asrsResponse, ctqResponse, bis10Response, als18Response, aimResponse,
      wurs25Response, aq12Response, csmResponse, ctiResponse,
      // HETERO responses
      madrsResponse, ymrsResponse, cgiResponse, egfResponse, aldaResponse,
      etatPatientResponse, fastResponse,
      // SOCIAL response
      socialResponse,
      // INFIRMIER responses
      tobaccoResponse, fagerstromResponse, physicalParamsResponse, bloodPressureResponse, sleepApneaResponse, biologicalAssessmentResponse,
      // DSM5 responses
      dsm5HumeurResponse, dsm5PsychoticResponse, dsm5ComorbidResponse,
      // DIVA response
      divaResponse,
      // Family History response
      familyHistoryResponse,
      // C-SSRS response
      cssrsResponse,
      // ISA response
      isaResponse,
      // C-SSRS History response
      cssrsHistoryResponse,
      // SIS response
      sisResponse
    ] = await Promise.all([
      // ETAT
      getEq5d5lResponse(visitId),
      getPriseMResponse(visitId),
      getStaiYaResponse(visitId),
      getMarsResponse(visitId),
      getMathysResponse(visitId),
      getAsrmResponse(visitId),
      getQidsResponse(visitId),
      getPsqiResponse(visitId),
      getEpworthResponse(visitId),
      // TRAITS
      getAsrsResponse(visitId),
      getCtqResponse(visitId),
      getBis10Response(visitId),
      getAls18Response(visitId),
      getAimResponse(visitId),
      getWurs25Response(visitId),
      getAq12Response(visitId),
      getCsmResponse(visitId),
      getCtiResponse(visitId),
      // HETERO
      getMadrsResponse(visitId),
      getYmrsResponse(visitId),
      getCgiResponse(visitId),
      getEgfResponse(visitId),
      getAldaResponse(visitId),
      getEtatPatientResponse(visitId),
      getFastResponse(visitId),
      // SOCIAL
      getSocialResponse(visitId),
      // INFIRMIER
      getTobaccoResponse(visitId),
      getFagerstromResponse(visitId),
      getPhysicalParamsResponse(visitId),
      getBloodPressureResponse(visitId),
      getSleepApneaResponse(visitId),
      getBiologicalAssessmentResponse(visitId),
      // DSM5
      getDsm5HumeurResponse(visitId),
      getDsm5PsychoticResponse(visitId),
      getDsm5ComorbidResponse(visitId),
      // DIVA
      getDivaResponse(visitId),
      // Family History
      getFamilyHistoryResponse(visitId),
      // C-SSRS
      getCssrsResponse(visitId),
      // ISA
      getIsaResponse(visitId),
      // C-SSRS History
      getCssrsHistoryResponse(visitId),
      // SIS
      getSisResponse(visitId)
    ]);

    // Module 1: Infirmier
    const nurseModule = {
      id: 'mod_nurse',
      name: 'Infirmier',
      description: 'Évaluation par l\'infirmier',
      questionnaires: [
        {
          ...TOBACCO_DEFINITION,
          id: TOBACCO_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!tobaccoResponse,
          completedAt: tobaccoResponse?.completed_at,
        },
        {
          ...FAGERSTROM_DEFINITION,
          id: FAGERSTROM_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!fagerstromResponse,
          completedAt: fagerstromResponse?.completed_at,
        },
        {
          ...PHYSICAL_PARAMS_DEFINITION,
          id: PHYSICAL_PARAMS_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!physicalParamsResponse,
          completedAt: physicalParamsResponse?.completed_at,
        },
        {
          ...BLOOD_PRESSURE_DEFINITION,
          id: BLOOD_PRESSURE_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!bloodPressureResponse,
          completedAt: bloodPressureResponse?.completed_at,
        },
        {
          ...SLEEP_APNEA_DEFINITION,
          id: SLEEP_APNEA_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!sleepApneaResponse,
          completedAt: sleepApneaResponse?.completed_at,
        },
        {
          ...BIOLOGICAL_ASSESSMENT_DEFINITION,
          id: BIOLOGICAL_ASSESSMENT_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!biologicalAssessmentResponse,
          completedAt: biologicalAssessmentResponse?.completed_at,
        }
      ]
    };

    // Module 2: Evaluation état thymique et fonctionnement
    const thymicModule = {
      id: 'mod_thymic_eval',
      name: 'Evaluation état thymique et fonctionnement',
      description: 'Évaluation de l\'état thymique et du fonctionnement',
      questionnaires: [
        {
          ...MADRS_DEFINITION,
          id: MADRS_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!madrsResponse,
          completedAt: madrsResponse?.completed_at,
        },
        {
          ...YMRS_DEFINITION,
          id: YMRS_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!ymrsResponse,
          completedAt: ymrsResponse?.completed_at,
        },
        {
          ...CGI_DEFINITION,
          id: CGI_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!cgiResponse,
          completedAt: cgiResponse?.completed_at,
        },
        {
          ...EGF_DEFINITION,
          id: EGF_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!egfResponse,
          completedAt: egfResponse?.completed_at,
        },
        {
          ...ALDA_DEFINITION,
          id: ALDA_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!aldaResponse,
          completedAt: aldaResponse?.completed_at,
        },
        {
          ...ETAT_PATIENT_DEFINITION,
          id: ETAT_PATIENT_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!etatPatientResponse,
          completedAt: etatPatientResponse?.completed_at,
        },
        {
          ...FAST_DEFINITION,
          id: FAST_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!fastResponse,
          completedAt: fastResponse?.completed_at,
        }
      ]
    };

    // Module 3: Evaluation Médicale
    const medicalEvalModule = {
      id: 'mod_medical_eval',
      name: 'Evaluation Médicale',
      description: 'Évaluation médicale complète',
      questionnaires: [
        {
          ...DSM5_HUMEUR_DEFINITION,
          id: DSM5_HUMEUR_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!dsm5HumeurResponse,
          completedAt: dsm5HumeurResponse?.completed_at,
        },
        {
          ...DSM5_PSYCHOTIC_DEFINITION,
          id: DSM5_PSYCHOTIC_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!dsm5PsychoticResponse,
          completedAt: dsm5PsychoticResponse?.completed_at,
        },
        {
          ...DSM5_COMORBID_DEFINITION,
          id: DSM5_COMORBID_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!dsm5ComorbidResponse,
          completedAt: dsm5ComorbidResponse?.completed_at,
        },
        {
          ...DIVA_DEFINITION,
          id: DIVA_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!divaResponse,
          completedAt: divaResponse?.completed_at,
        },
        {
          ...FAMILY_HISTORY_DEFINITION,
          id: FAMILY_HISTORY_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!familyHistoryResponse,
          completedAt: familyHistoryResponse?.completed_at,
        },
        {
          ...CSSRS_DEFINITION,
          id: CSSRS_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!cssrsResponse,
          completedAt: cssrsResponse?.completed_at,
        },
        {
          ...ISA_DEFINITION,
          id: ISA_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!isaResponse,
          completedAt: isaResponse?.completed_at,
        },
        {
          ...CSSRS_HISTORY_DEFINITION,
          id: CSSRS_HISTORY_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!cssrsHistoryResponse,
          completedAt: cssrsHistoryResponse?.completed_at,
        },
        {
          ...SIS_DEFINITION,
          id: SIS_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!sisResponse,
          completedAt: sisResponse?.completed_at,
        }
      ]
    };

    // Module 4: Autoquestionnaires - ETAT
    const etatModule = {
      id: 'mod_auto_etat',
      name: 'Autoquestionnaires - ETAT',
      description: 'Questionnaires sur l\'état actuel du patient',
      questionnaires: [
        {
          ...EQ5D5L_DEFINITION,
          id: EQ5D5L_DEFINITION.code,
          target_role: 'patient',
          completed: !!eq5d5lResponse,
          completedAt: eq5d5lResponse?.completed_at,
        },
        {
          ...PRISE_M_DEFINITION,
          id: PRISE_M_DEFINITION.code,
          target_role: 'patient',
          completed: !!priseMResponse,
          completedAt: priseMResponse?.completed_at,
        },
        {
          ...STAI_YA_DEFINITION,
          id: STAI_YA_DEFINITION.code,
          target_role: 'patient',
          completed: !!staiYaResponse,
          completedAt: staiYaResponse?.completed_at,
        },
        {
          ...MARS_DEFINITION,
          id: MARS_DEFINITION.code,
          target_role: 'patient',
          completed: !!marsResponse,
          completedAt: marsResponse?.completed_at,
        },
        {
          ...MATHYS_DEFINITION,
          id: MATHYS_DEFINITION.code,
          target_role: 'patient',
          completed: !!mathysResponse,
          completedAt: mathysResponse?.completed_at,
        },
        {
          ...ASRM_DEFINITION,
          id: ASRM_DEFINITION.code,
          target_role: 'patient',
          completed: !!asrmResponse,
          completedAt: asrmResponse?.completed_at,
        },
        {
          ...QIDS_DEFINITION,
          id: QIDS_DEFINITION.code,
          target_role: 'patient',
          completed: !!qidsResponse,
          completedAt: qidsResponse?.completed_at,
        },
        {
          ...PSQI_DEFINITION,
          id: PSQI_DEFINITION.code,
          target_role: 'patient',
          completed: !!psqiResponse,
          completedAt: psqiResponse?.completed_at,
        },
        {
          ...EPWORTH_DEFINITION,
          id: EPWORTH_DEFINITION.code,
          target_role: 'patient',
          completed: !!epworthResponse,
          completedAt: epworthResponse?.completed_at,
        }
      ]
    };

    // Module 5: Social
    const socialModule = {
      id: 'mod_social',
      name: 'Social',
      description: 'Évaluation sociale',
      questionnaires: [
        {
          ...SOCIAL_DEFINITION,
          id: SOCIAL_DEFINITION.code,
          target_role: 'healthcare_professional',
          completed: !!socialResponse,
          completedAt: socialResponse?.completed_at,
        }
      ]
    };

    // Module 6: Autoquestionnaires - TRAITS
    const traitsModule = {
      id: 'mod_auto_traits',
      name: 'Autoquestionnaires - TRAITS',
      description: 'Questionnaires sur les traits du patient',
      questionnaires: [
        {
          ...ASRS_DEFINITION,
          id: ASRS_DEFINITION.code,
          target_role: 'patient',
          completed: !!asrsResponse,
          completedAt: asrsResponse?.completed_at,
        },
        {
          ...CTQ_DEFINITION,
          id: CTQ_DEFINITION.code,
          target_role: 'patient',
          completed: !!ctqResponse,
          completedAt: ctqResponse?.completed_at,
        },
        {
          ...BIS10_DEFINITION,
          id: BIS10_DEFINITION.code,
          target_role: 'patient',
          completed: !!bis10Response,
          completedAt: bis10Response?.completed_at,
        },
        {
          ...ALS18_DEFINITION,
          id: ALS18_DEFINITION.code,
          target_role: 'patient',
          completed: !!als18Response,
          completedAt: als18Response?.completed_at,
        },
        {
          ...AIM_DEFINITION,
          id: AIM_DEFINITION.code,
          target_role: 'patient',
          completed: !!aimResponse,
          completedAt: aimResponse?.completed_at,
        },
        {
          ...WURS25_DEFINITION,
          id: WURS25_DEFINITION.code,
          target_role: 'patient',
          completed: !!wurs25Response,
          completedAt: wurs25Response?.completed_at,
        },
        {
          ...AQ12_DEFINITION,
          id: AQ12_DEFINITION.code,
          target_role: 'patient',
          completed: !!aq12Response,
          completedAt: aq12Response?.completed_at,
        },
        {
          ...CSM_DEFINITION,
          id: CSM_DEFINITION.code,
          target_role: 'patient',
          completed: !!csmResponse,
          completedAt: csmResponse?.completed_at,
        },
        {
          ...CTI_DEFINITION,
          id: CTI_DEFINITION.code,
          target_role: 'patient',
          completed: !!ctiResponse,
          completedAt: ctiResponse?.completed_at,
        }
      ]
    };

    modulesWithQuestionnaires = [
      nurseModule,
      thymicModule,
      medicalEvalModule,
      etatModule,
      socialModule,
      traitsModule
    ];

    // Calculate stats
    const total = nurseModule.questionnaires.length + thymicModule.questionnaires.length + medicalEvalModule.questionnaires.length + etatModule.questionnaires.length + socialModule.questionnaires.length + traitsModule.questionnaires.length;
    const completed = 
      nurseModule.questionnaires.filter(q => q.completed).length +
      thymicModule.questionnaires.filter(q => q.completed).length +
      medicalEvalModule.questionnaires.filter(q => q.completed).length +
      etatModule.questionnaires.filter(q => q.completed).length + 
      socialModule.questionnaires.filter(q => q.completed).length +
      traitsModule.questionnaires.filter(q => q.completed).length;
    
    completionStatus = {
      totalQuestionnaires: total,
      completedQuestionnaires: completed,
      completionPercentage: total > 0 ? (completed / total) * 100 : 0
    };
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Progress Visualization */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
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
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {visit.patient_first_name} {visit.patient_last_name}
                </span>
                <span className="text-slate-400">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {visit.scheduled_date && formatDateTime(visit.scheduled_date)}
                </span>
              </div>
              
              {/* Status Badge */}
              <div>
                <span
                  className={cn(
                    "inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border",
                    visit.status === 'completed'
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : visit.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800 border-blue-200'
                      : visit.status === 'scheduled'
                      ? 'bg-slate-100 text-slate-800 border-slate-200'
                      : 'bg-red-100 text-red-800 border-red-200'
                  )}
                >
                  {visit.status === 'completed' ? 'Terminée' : 
                   visit.status === 'in_progress' ? 'En cours' : 
                   visit.status === 'scheduled' ? 'Planifiée' :
                   visit.status === 'cancelled' ? 'Annulée' : visit.status}
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
                        completionStatus.completionPercentage === 100 ? "bg-green-600" : "bg-blue-600"
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
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-900">Modules cliniques</h3>

        {modulesWithQuestionnaires.map((module, index) => (
          <ExpandableModuleCard
            key={module.id}
            module={module}
            index={index}
            pathology={pathology}
            patientId={patientId}
            visitId={visitId}
          />
        ))}
      </div>

      {/* Visit Notes */}
      {visit.notes && (
        <Card className="hover:shadow-md transition-shadow duration-200">
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
