import { getCenterById } from "@/lib/services/center.service";
import { getManagersByCenter } from "@/lib/services/user.service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default async function CenterManagersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const center = await getCenterById(id);
  
  if (!center) {
    notFound();
  }

  const managers = await getManagersByCenter(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/admin/centers/${id}`}>
            <Button variant="outline" size="sm" className="mb-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Center
            </Button>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900">Managers</h2>
          <p className="text-slate-600">{center.name}</p>
        </div>
        <Link href={`/admin/centers/${id}/managers/new`}>
          <Button>Add Manager</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        {managers.length > 0 ? (
          <div className="space-y-3">
            {managers.map((manager) => (
              <div
                key={manager.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-slate-900">
                        {manager.first_name} {manager.last_name}
                      </p>
                      <p className="text-sm text-slate-500">{manager.email}</p>
                      {manager.phone && (
                        <p className="text-sm text-slate-500">{manager.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      manager.active
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {manager.active ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs text-slate-500">
                    {manager.username ? `@${manager.username}` : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">No managers assigned to this center yet</p>
            <Link href={`/admin/centers/${id}/managers/new`}>
              <Button>Add First Manager</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

