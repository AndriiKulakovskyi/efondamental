import { requirePatient } from "@/lib/rbac/middleware";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requirePatient();

  if (!profile) {
    redirect("/auth/login");
  }

  const initials = `${(profile.first_name || "P")[0]}${(profile.last_name || "")[0] || ""}`.toUpperCase();

  return (
    <div className="bg-[#FDFBFA] text-slate-800 h-screen flex flex-col overflow-hidden">
      {/* TOP HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center z-30 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-sm">
            eF
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-slate-900">Portail</span>
            <span className="text-brand">Patient</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="p-2 text-slate-400 hover:text-brand transition relative">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          <div className="h-6 w-px bg-slate-200" />

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">
                {profile.first_name} {profile.last_name}
              </p>
              <p className="text-xs text-slate-500">Patient</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-sm">
              {initials}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 bg-[#F8F7F5] border-r border-slate-200 text-slate-600 flex-col z-20 hidden md:flex">
          <div className="p-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Mon Suivi
            </p>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            <NavLink href="/patient" label="Tableau de bord" isDefault>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </NavLink>

            <NavLink href="/patient/appointments" label="Rendez-vous">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </NavLink>

            <NavLink href="/patient/questionnaires" label="Questionnaires">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </NavLink>

            <NavLink href="/patient/messages" label="Messages">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </NavLink>
          </nav>

          {/* Help Card */}
          <div className="p-4 mt-auto">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-blue-800 mb-1">
                Besoin d'aide ?
              </p>
              <p className="text-[10px] text-blue-600 mb-3">
                Contactez votre equipe soignante pour toute question medicale.
              </p>
              <Link
                href="/patient/messages"
                className="block w-full py-1.5 bg-white border border-blue-200 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-50 transition text-center"
              >
                Contacter le support
              </Link>
            </div>

            {/* Logout */}
            <div className="mt-4">
              <LogoutButton />
            </div>
          </div>
          </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex justify-around z-30">
        <MobileNavLink href="/patient" label="Accueil">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </MobileNavLink>

        <MobileNavLink href="/patient/appointments" label="RDV">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </MobileNavLink>

        <MobileNavLink href="/patient/questionnaires" label="Tests">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </MobileNavLink>

        <MobileNavLink href="/patient/messages" label="Msg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </MobileNavLink>
      </nav>
    </div>
  );
}

// Navigation Link Component
function NavLink({
  href,
  label,
  children,
  isDefault = false,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  isDefault?: boolean;
}) {
  // Note: For proper active state, you'd need to use usePathname() in a client component
  // For now, we use a simple styling that works for SSR
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-200 hover:text-slate-900 transition text-slate-600"
    >
      <span className="text-slate-400">{children}</span>
      {label}
    </Link>
  );
}

// Mobile Navigation Link Component
function MobileNavLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 px-3 py-1 text-slate-500 hover:text-brand transition"
    >
      {children}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
