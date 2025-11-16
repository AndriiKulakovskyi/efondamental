import { getUserById } from "@/lib/services/user.service";
import { getUserContext } from "@/lib/rbac/middleware";
import { notFound, redirect } from "next/navigation";
import { EditProfessionalForm } from "./components/edit-form";

export default async function EditProfessionalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await getUserContext();

  if (!context?.profile.center_id) {
    redirect("/auth/error?message=No center assigned");
  }

  const professional = await getUserById(id);

  if (!professional) {
    notFound();
  }

  // Ensure the professional is in the same center
  if (professional.center_id !== context.profile.center_id) {
    redirect("/auth/error?message=Access denied");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Edit Professional</h2>
        <p className="text-slate-600">Update healthcare professional information</p>
      </div>

      <EditProfessionalForm professional={professional} />
    </div>
  );
}

