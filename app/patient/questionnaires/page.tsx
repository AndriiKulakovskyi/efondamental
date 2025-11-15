import { requireUserContext } from "@/lib/rbac/middleware";
import { getPendingQuestionnaires } from "@/lib/services/questionnaire.service";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertBanner } from "@/components/ui/alert-banner";

export default async function QuestionnairesPage() {
  const context = await requireUserContext();
  const supabase = await createClient();

  // Get patient record
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('id', context.user.id)
    .single();

  const pendingQuestionnaires = await getPendingQuestionnaires(
    patient?.id || context.user.id
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Questionnaires</h2>
        <p className="text-slate-600">Complete your self-assessment questionnaires</p>
      </div>

      {pendingQuestionnaires.length > 0 ? (
        <>
          <AlertBanner
            type="info"
            message={`You have ${pendingQuestionnaires.length} questionnaire${pendingQuestionnaires.length !== 1 ? 's' : ''} to complete.`}
          />

          <div className="grid grid-cols-1 gap-4">
            {pendingQuestionnaires.map((questionnaire) => (
              <div
                key={questionnaire.id}
                className="bg-white rounded-lg border border-slate-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {questionnaire.title}
                    </h3>
                    {questionnaire.description && (
                      <p className="text-sm text-slate-600 mb-4">
                        {questionnaire.description}
                      </p>
                    )}
                    <p className="text-xs text-slate-500">
                      {questionnaire.questions.length} questions
                    </p>
                  </div>
                  <Link href={`/patient/questionnaires/${questionnaire.id}`}>
                    <Button>Start</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-600">
            You have no pending questionnaires at this time.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            New questionnaires will appear here when assigned by your care team.
          </p>
        </div>
      )}
    </div>
  );
}

