import { getCenterById, getCenterPathologies } from "@/lib/services/center.service";
import { notFound, redirect } from "next/navigation";
import { CenterEditForm } from "./components/center-edit-form";

export default async function EditCenterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const center = await getCenterById(id);
  
  if (!center) {
    notFound();
  }

  const pathologies = await getCenterPathologies(id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Edit Center</h2>
        <p className="text-slate-600">Update center information and settings</p>
      </div>

      <CenterEditForm
        center={center}
        assignedPathologies={pathologies.map((p) => p.type)}
      />
    </div>
  );
}

