import { getUserContext } from "@/lib/rbac/middleware";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PatientForm } from "./components/patient-form";
import Link from "next/link";

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
    <div className="max-w-4xl mx-auto">
      {/* HEADER & BREADCRUMBS */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-400 font-medium mb-3">
          <Link 
            href={`/professional/${pathology}/patients`} 
            className="hover:text-brand transition"
          >
            Patients
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-800">Nouveau Patient</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Nouveau Patient</h2>
        <p className="text-slate-500 mt-1">Creer un nouveau profil patient pour ce centre.</p>
      </div>

      <PatientForm
        pathology={pathology}
        doctors={doctors || []}
        currentUserId={context.user.id}
      />
    </div>
  );
}
