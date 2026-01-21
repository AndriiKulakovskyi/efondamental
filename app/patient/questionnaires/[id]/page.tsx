import { requireUserContext } from "@/lib/rbac/middleware";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { 
  ASRM_DEFINITION, 
  QIDS_DEFINITION, 
  MDQ_DEFINITION,
  // TRAITS (to be migrated)
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
import { QuestionnairePageClient } from "./page-client";
import { 
  isQuestionnaireLockedByProfessional, 
  getQuestionnaireResponseForView 
} from "@/lib/services/patient-visit.service";

// Map of all questionnaire codes to their definitions
const QUESTIONNAIRE_MAP: Record<string, QuestionnaireDefinition> = {
  [ASRM_DEFINITION.code]: ASRM_DEFINITION,
  [QIDS_DEFINITION.code]: QIDS_DEFINITION,
  [MDQ_DEFINITION.code]: MDQ_DEFINITION,
  [EQ5D5L_DEFINITION.code]: EQ5D5L_DEFINITION,
  [PRISE_M_DEFINITION.code]: PRISE_M_DEFINITION,
  [STAI_YA_DEFINITION.code]: STAI_YA_DEFINITION,
  [MARS_DEFINITION.code]: MARS_DEFINITION,
  [MATHYS_DEFINITION.code]: MATHYS_DEFINITION,
  [PSQI_DEFINITION.code]: PSQI_DEFINITION,
  [EPWORTH_DEFINITION.code]: EPWORTH_DEFINITION,
  [ASRS_DEFINITION.code]: ASRS_DEFINITION,
  [CTQ_DEFINITION.code]: CTQ_DEFINITION,
  [BIS10_DEFINITION.code]: BIS10_DEFINITION,
  [ALS18_DEFINITION.code]: ALS18_DEFINITION,
  [AIM_DEFINITION.code]: AIM_DEFINITION,
  [WURS25_DEFINITION.code]: WURS25_DEFINITION,
  [AQ12_DEFINITION.code]: AQ12_DEFINITION,
  [CSM_DEFINITION.code]: CSM_DEFINITION,
  [CTI_DEFINITION.code]: CTI_DEFINITION,
};

export default async function QuestionnairePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const context = await requireUserContext();
  const supabase = await createClient();
  
  // Await params in Next.js 15+
  const { id } = await params;

  // Parse ID: visitId_CODE
  // UUID is 36 chars.
  const visitId = id.substring(0, 36);
  const code = id.substring(37); // Skip _

  // Validate UUID format roughly
  if (!visitId || visitId.length !== 36) {
    notFound();
  }

  // Find definition
  const questionnaire = QUESTIONNAIRE_MAP[code];

  if (!questionnaire) {
    notFound();
  }

  // Get patient record
  const { data: patient } = await supabase
    .from('patients')
    .select('id, user_id')
    .eq('user_id', context.user.id)
    .single();

  if (!patient) {
    redirect('/patient/questionnaires');
  }

  // Verify visit exists and belongs to patient
  const { data: visit } = await supabase
    .from('visits')
    .select('id')
    .eq('id', visitId)
    .eq('patient_id', patient.id)
    .single();

  if (!visit) {
    notFound();
  }

  // Check if questionnaire is locked by professional
  const isLocked = await isQuestionnaireLockedByProfessional(
    visitId,
    code,
    patient.user_id
  );

  // If locked or completed, get the response for read-only view
  let existingResponse: Record<string, any> | null = null;
  if (isLocked) {
    existingResponse = await getQuestionnaireResponseForView(visitId, code);
  }

  return (
    <QuestionnairePageClient
      questionnaire={questionnaire}
      visitId={visitId}
      patientId={patient.id}
      isLockedByProfessional={isLocked}
      existingResponse={existingResponse}
    />
  );
}
