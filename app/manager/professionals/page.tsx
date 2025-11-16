import { getUserContext } from "@/lib/rbac/middleware";
import { getProfessionalsByCenter } from "@/lib/services/user.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { ProfessionalsTable } from "./components/professionals-table";

export default async function ProfessionalsPage() {
  const context = await getUserContext();

  if (!context?.profile.center_id) {
    redirect("/auth/error?message=No center assigned");
  }

  const professionals = await getProfessionalsByCenter(context.profile.center_id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Healthcare Professionals</h2>
          <p className="text-slate-600">Manage professionals in your center</p>
        </div>
        <Link href="/manager/professionals/new">
          <Button>Invite Professional</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <ProfessionalsTable professionals={professionals} />
      </div>
    </div>
  );
}

