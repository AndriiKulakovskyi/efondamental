import { getUserContext } from "@/lib/rbac/middleware";
import { getCenterPathologies } from "@/lib/services/center.service";
import { getPathologyLandingStats } from "@/lib/services/analytics.service";
import { PATHOLOGY_NAMES, PathologyType } from "@/lib/types/enums";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";
import { Activity, ArrowRight, UserPlus } from "lucide-react";

export default async function ProfessionalLandingPage() {
  const context = await getUserContext();

  if (!context?.profile.center_id) {
    redirect("/auth/error?message=No center assigned");
  }

  // Fetch center pathologies and their statistics in parallel
  const [centerPathologies, pathologyStats] = await Promise.all([
    getCenterPathologies(context.profile.center_id),
    getPathologyLandingStats(context.profile.center_id),
  ]);

  // Determine which pathologies to display
  // 1. For Healthcare Professionals: Show ONLY their assigned pathologies from context
  // 2. For Managers/Admins: Show ALL pathologies assigned to their center
  let pathologies: { id: string; name: string; type: string; description?: string | null }[] = [];
  
  if (context.profile.role === 'healthcare_professional') {
    pathologies = context.pathologies || [];
  } else {
    // Managers/Admins see everything in the center
    pathologies = centerPathologies.map(p => ({
      id: p.id,
      name: p.name,
      type: p.type,
      description: p.description
    }));
  }

  // Create a lookup map for quick access to stats by pathology type
  const statsMap = new Map(
    pathologyStats.map((stat) => [stat.pathologyType, stat])
  );

  const getPathologyConfig = (index: number) => {
    const configs = [
      { 
        color: '#FF4A3F', 
        lightBg: '#FFF0EF', 
        mediumBg: '#FEF2F2',
        hoverShadow: 'hover:shadow-brand/10',
        hoverBorder: 'hover:border-brand',
        hoverText: 'group-hover:text-brand',
        hoverBg: 'group-hover:bg-brand'
      },
      { 
        color: '#10B981', 
        lightBg: '#F0FDF4', 
        mediumBg: '#DCFCE7',
        hoverShadow: 'hover:shadow-emerald-500/10',
        hoverBorder: 'hover:border-emerald-500',
        hoverText: 'group-hover:text-emerald-600',
        hoverBg: 'group-hover:bg-emerald-500'
      },
      { 
        color: '#8B5CF6', 
        lightBg: '#FAF5FF', 
        mediumBg: '#F3E8FF',
        hoverShadow: 'hover:shadow-violet-500/10',
        hoverBorder: 'hover:border-violet-500',
        hoverText: 'group-hover:text-violet-600',
        hoverBg: 'group-hover:bg-violet-500'
      },
      { 
        color: '#F59E0B', 
        lightBg: '#FFF7ED', 
        mediumBg: '#FFEDD5',
        hoverShadow: 'hover:shadow-amber-500/10',
        hoverBorder: 'hover:border-amber-400',
        hoverText: 'group-hover:text-amber-500',
        hoverBg: 'group-hover:bg-amber-500'
      }
    ];
    return configs[index % configs.length];
  };

  return (
    <div className="min-h-screen bg-[#FDFBFA] flex flex-col relative overflow-x-hidden">
      {/* Subtle background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <header className="px-8 py-5 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-sm">
            eF
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-slate-900">Fondation</span>{" "}
            <span className="text-brand">FondaMental</span>
          </h1>
            </div>

        <div className="flex items-center gap-4">
            <UserProfileDropdown
              firstName={context.profile.first_name || ""}
              lastName={context.profile.last_name || ""}
              email={context.profile.email}
              role={context.profile.role}
            />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="max-w-5xl w-full">
          
          {/* Title Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                  Sélectionnez votre application
                </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Bienvenue, {context.profile.first_name}. Choisissez une pathologie pour accéder à votre tableau de bord clinique et gérer vos patients.
              </p>
          </div>

          {/* Pathology Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pathologies.map((pathology, index) => {
                const config = getPathologyConfig(index);
                const stats = statsMap.get(pathology.type as PathologyType);
                const activePatients = stats?.activePatients ?? 0;
                const newPatientsThisMonth = stats?.newPatientsThisMonth ?? 0;
                
                return (
                  <Link
                    key={pathology.id}
                    href={`/professional/${pathology.type}`}
                  className={`group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl ${config.hoverShadow} ${config.hoverBorder} transition-all duration-300 hover:-translate-y-1 overflow-hidden block`}
                >
                  {/* Decorative background element */}
                      <div
                    className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`}
                    style={{ backgroundColor: config.mediumBg }}
                      />
                      
                  {/* Header with Icon and Version */}
                  <div className="flex items-start justify-between mb-6 relative z-10">
                              <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}
                      style={{ backgroundColor: config.lightBg, color: config.color }}
                              >
                      <Activity className="w-7 h-7" />
                    </div>
                    <span className={`px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-xs font-medium border border-slate-100 transition`}>
                      v4.0
                    </span>
                              </div>

                  {/* Title and Description */}
                  <div className="relative z-10">
                    <h3 className={`text-2xl font-bold text-slate-900 mb-2 ${config.hoverText} transition-colors`}>
                                  {PATHOLOGY_NAMES[pathology.type as PathologyType]}
                                </h3>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                                  {pathology.description || `Plateforme de suivi ${PATHOLOGY_NAMES[pathology.type as PathologyType].toLowerCase()}`}
                                </p>
                          </div>

                  {/* Stats Footer */}
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100 relative z-10">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                        Patients actifs
                      </span>
                      <span className="text-lg font-bold text-slate-900">
                        {activePatients}
                      </span>
                              </div>
                    <div className="w-px h-8 bg-slate-100"></div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wider flex items-center gap-1">
                        <UserPlus className="w-3 h-3" />
                        Nouvelles inclusions
                      </span>
                      <span className="text-lg font-bold text-slate-900">
                        {newPatientsThisMonth}
                      </span>
                              </div>
                    <div className="ml-auto">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-300 ${config.hoverBg} group-hover:text-white transition-all`}>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>

          {/* Empty State */}
          {pathologies.length === 0 && (
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-lg font-semibold text-slate-900 mb-2">
                Aucune application disponible
              </p>
              <p className="text-sm text-slate-600">
                Aucune pathologie n'est assignée à votre centre. Veuillez contacter votre administrateur.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400">
        <p>&copy; 2026 Fondation FondaMental • Réseau de Centres Experts • v2.1.0</p>
      </footer>
    </div>
  );
}
