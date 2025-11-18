import { getUserContext } from "@/lib/rbac/middleware";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PatientForm } from "./components/patient-form";

export default async function NewPatientPage({
  params,
}: {
  params: Promise<{ pathology: string }>;
}) {
  const { pathology } = await params;
  const context = await getUserContext();

  if (!context?.profile.center_id) {
    redirect("/auth/error?message=No center assigned");
  }

  // Fetch all doctors (professionals) from the same center
  const supabase = await createClient();
  const { data: doctors } = await supabase
    .from('user_profiles')
    .select('id, first_name, last_name')
    .eq('center_id', context.profile.center_id)
    .eq('role', 'healthcare_professional')
    .order('last_name, first_name');

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900">New Patient</h2>
        <p className="text-slate-600">Create a new patient profile</p>
      </div>

      <PatientForm
        pathology={pathology}
        doctors={doctors || []}
        currentUserId={context.user.id}
      />
    </div>
  );
}
