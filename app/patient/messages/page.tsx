import { requireUserContext } from "@/lib/rbac/middleware";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Button } from "@/components/ui/button";

export default async function MessagesPage() {
  const context = await requireUserContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Messages</h2>
        <p className="text-slate-600">Communicate with your care team</p>
      </div>

      <AlertBanner
        type="info"
        message="Secure messaging functionality will be available in the next release."
      />

      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <p className="text-slate-600 mb-4">
          Use this secure messaging system to communicate with your healthcare team.
        </p>
        <Button disabled>Compose Message</Button>
      </div>
    </div>
  );
}

