import { requireUserContext } from "@/lib/rbac/middleware";
import Link from "next/link";

export default async function MessagesPage() {
  const context = await requireUserContext();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Messages</h2>
        <p className="text-slate-500 mt-1">
          Communiquez avec votre equipe soignante
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-blue-900">
            Messagerie securisee bientot disponible
          </p>
          <p className="text-sm text-blue-700 mt-1">
            La fonctionnalite de messagerie securisee sera disponible dans la
            prochaine version de l'application.
          </p>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Messagerie Securisee
        </h3>
        <p className="text-slate-600 max-w-md mx-auto mb-6">
          Utilisez ce systeme de messagerie securisee pour communiquer avec
          votre equipe soignante. Vous pourrez poser des questions, demander des
          precisions ou signaler tout changement dans votre etat de sante.
        </p>

        <button
          disabled
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-400 text-sm font-bold rounded-xl cursor-not-allowed"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          Nouveau Message
        </button>
      </div>

      {/* Alternative Contact */}
      <div className="bg-brand/5 border border-brand/20 rounded-2xl p-6">
        <h4 className="font-bold text-slate-900 mb-2">
          Besoin d'aide urgente ?
        </h4>
        <p className="text-sm text-slate-600 mb-4">
          En cas d'urgence medicale, veuillez contacter directement votre centre
          de soins ou les services d'urgence.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="tel:15"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-bold rounded-lg hover:bg-brand-dark transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Appeler le SAMU (15)
          </a>
          <Link
            href="/patient"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
