import { requireUserContext } from "@/lib/rbac/middleware";
import { getPendingQuestionnaires } from "@/lib/services/questionnaire.service";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertBanner } from "@/components/ui/alert-banner";
import { FileText, CheckCircle } from "lucide-react";

export default async function QuestionnairesPage() {
  const context = await requireUserContext();
  const supabase = await createClient();

  // Get patient record
  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('user_id', context.user.id)
    .single();

  if (!patient) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Questionnaires</h2>
          <p className="text-slate-600">Complétez vos autoquestionnaires</p>
        </div>
        <AlertBanner
          type="warning"
          message="Aucun dossier patient trouvé. Veuillez contacter votre équipe soignante."
        />
      </div>
    );
  }

  const pendingQuestionnaires = await getPendingQuestionnaires(patient.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Questionnaires</h2>
        <p className="text-slate-600">Complétez vos autoquestionnaires d'évaluation</p>
      </div>

      {pendingQuestionnaires.length > 0 ? (
        <>
          <AlertBanner
            type="info"
            message={`Vous avez ${pendingQuestionnaires.length} questionnaire${pendingQuestionnaires.length !== 1 ? 's' : ''} à compléter.`}
          />

          <div className="grid grid-cols-1 gap-4">
            {pendingQuestionnaires.map((questionnaire) => (
              <div
                key={questionnaire.id}
                className="bg-white rounded-lg border border-slate-200 p-6 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-slate-900">
                        {questionnaire.title}
                      </h3>
                    </div>
                    {questionnaire.description && (
                      <p className="text-sm text-slate-600 mb-3">
                        {questionnaire.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>~{questionnaire.estimatedTime} min</span>
                      {questionnaire.id && (
                        <span className="px-2 py-1 bg-slate-100 rounded-md">
                          {questionnaire.id}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link href={`/patient/questionnaires/${questionnaire.id}`}>
                    <Button className="ml-4">
                      Commencer
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-slate-600 text-lg font-medium">
            Vous n'avez pas de questionnaires en attente
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Les nouveaux questionnaires apparaîtront ici lorsqu'ils seront assignés par votre équipe soignante.
          </p>
        </div>
      )}
    </div>
  );
}
