import { getUserContext } from "@/lib/rbac/middleware";
import { PATHOLOGY_NAMES, PathologyType } from "@/lib/types/enums";
import { redirect } from "next/navigation";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";
import PathologyNav from "./components/pathology-nav";
import { Bell } from "lucide-react";

export default async function PathologyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ pathology: string }>;
}) {
  const { pathology } = await params;
  const context = await getUserContext();

  if (!context) {
    redirect("/auth/login");
  }

  const pathologyName = PATHOLOGY_NAMES[pathology as PathologyType] || pathology;

  return (
    <div className="h-screen bg-[#FDFBFA] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center z-30 shrink-0">
        <div className="flex items-center">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-slate-900">Fondation</span>{" "}
            <span className="text-brand">FondaMental</span>
          </h1>
            </div>

            <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 transition relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full"></span>
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
              <UserProfileDropdown
                firstName={context.profile.first_name || ""}
                lastName={context.profile.last_name || ""}
                email={context.profile.email}
                role={context.profile.role}
              />
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 overflow-hidden relative">
        <PathologyNav pathology={pathology} pathologyName={pathologyName} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

