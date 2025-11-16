import { getUserContext } from "@/lib/rbac/middleware";
import { PATHOLOGY_NAMES, PathologyType } from "@/lib/types/enums";
import { redirect } from "next/navigation";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";
import PathologyNav from "./components/pathology-nav";

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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">eFondaMental</h1>
              <p className="text-sm text-slate-600">{pathologyName}</p>
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <PathologyNav pathology={pathology} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

