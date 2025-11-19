import { requireUserContext } from "@/lib/rbac/middleware";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { 
  ASRM_DEFINITION, 
  QIDS_DEFINITION, 
  MDQ_DEFINITION,
  QuestionnaireDefinition 
} from "@/lib/constants/questionnaires";
import { QuestionnairePageClient } from "./page-client";

export default async function QuestionnairePage({
  params
}: {
  params: { id: string }
}) {
  const context = await requireUserContext();
  const supabase = await createClient();

  // Parse ID: visitId_CODE
  // UUID is 36 chars.
  const visitId = params.id.substring(0, 36);
  const code = params.id.substring(37); // Skip _

  // Validate UUID format roughly
  if (!visitId || visitId.length !== 36) {
    notFound();
  }

  // Find definition
  let questionnaire: QuestionnaireDefinition | undefined;
  if (code === ASRM_DEFINITION.code) questionnaire = ASRM_DEFINITION;
  else if (code === QIDS_DEFINITION.code) questionnaire = QIDS_DEFINITION;
  else if (code === MDQ_DEFINITION.code) questionnaire = MDQ_DEFINITION;

  if (!questionnaire) {
    notFound();
  }

  // Get patient record
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
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

  return (
    <QuestionnairePageClient
      questionnaire={questionnaire}
      visitId={visitId}
      patientId={patient.id}
    />
  );
}
