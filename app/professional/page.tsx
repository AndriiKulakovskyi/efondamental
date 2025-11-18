import { getUserContext } from "@/lib/rbac/middleware";
import { getCenterPathologies } from "@/lib/services/center.service";
import { PATHOLOGY_NAMES } from "@/lib/types/enums";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";
import { AppFooter } from "@/components/ui/app-footer";
import { Activity, ArrowRight, Users, Calendar } from "lucide-react";

export default async function ProfessionalLandingPage() {
  const context = await getUserContext();

  if (!context?.profile.center_id) {
    redirect("/auth/error?message=No center assigned");
  }

  const pathologies = await getCenterPathologies(context.profile.center_id);

  const getPathologyConfig = (index: number) => {
    const configs = [
      { color: '#E7000B', lightBg: '#FEF2F2', borderColor: '#FEE2E2' },
      { color: '#009966', lightBg: '#F0FDF4', borderColor: '#DCFCE7' },
      { color: '#9810FA', lightBg: '#FAF5FF', borderColor: '#F3E8FF' },
      { color: '#F54900', lightBg: '#FFF7ED', borderColor: '#FFEDD5' }
    ];
    return configs[index % configs.length];
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-12 py-5 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E7000B] to-[#F54900] flex items-center justify-center">
              <span className="text-white font-bold text-lg">eF</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">eFondaMental</h1>
              <p className="text-xs text-slate-500">{context.centerName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <UserProfileDropdown
              firstName={context.profile.first_name || ""}
              lastName={context.profile.last_name || ""}
              email={context.profile.email}
              role={context.profile.role}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 px-12 py-6 flex flex-col min-h-0 relative overflow-hidden">
        {/* Background gradient circle */}
        <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-[#FF6B6B] to-[#FF8C42] rounded-full blur-[100px] opacity-50 pointer-events-none" />
        
        <div className="max-w-[1200px] mx-auto flex flex-col flex-1 min-h-0 relative z-10">
          <div className="flex-shrink-0 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-900">
                  Sélectionnez votre application
                </h2>
                <span className="px-2.5 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
                  {pathologies.length} {pathologies.length === 1 ? 'application' : 'applications'}
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Bienvenue, {context.profile.first_name}. Choisissez une application pour accéder au tableau de bord clinique.
              </p>
            </div>
          </div>

          <div className="flex-1 mb-4 min-h-0">
            <div className="grid grid-cols-2 gap-5 h-full">
              {pathologies.map((pathology, index) => {
                const config = getPathologyConfig(index);
                
                return (
                  <Link
                    key={pathology.id}
                    href={`/professional/${pathology.type}`}
                    className="block group h-full"
                  >
                    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 h-full flex flex-col">
                      {/* Accent bar */}
                      <div
                        className="h-1 flex-shrink-0"
                        style={{ backgroundColor: config.color }}
                      />
                      
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                          {/* Header with icon and title */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                                style={{ backgroundColor: config.lightBg }}
                              >
                                <Activity className="w-5 h-5" style={{ color: config.color }} />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors">
                                  {PATHOLOGY_NAMES[pathology.type]}
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                                  {pathology.description || `Plateforme de suivi ${PATHOLOGY_NAMES[pathology.type].toLowerCase()}`}
                                </p>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                          </div>

                          {/* Quick stats */}
                          <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
                                <Users className="w-3.5 h-3.5 text-slate-500" />
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-500">Patients actifs</p>
                                <p className="text-xs font-semibold text-slate-900">{Math.floor(Math.random() * 50 + 20)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-500">Dernière MAJ</p>
                                <p className="text-xs font-semibold text-slate-900">Il y a {Math.floor(Math.random() * 5 + 1)}h</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Access badge */}
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <div className="inline-flex items-center gap-2 text-xs font-medium" style={{ color: config.color }}>
                            <span>Accéder à l'application</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {pathologies.length === 0 && (
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 text-center mb-4 shadow-sm">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-base font-semibold text-slate-900 mb-1">
                Aucune application disponible
              </p>
              <p className="text-sm text-slate-600">
                Aucune pathologie n'est assignée à votre centre. Veuillez contacter votre administrateur.
              </p>
            </div>
          )}
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
