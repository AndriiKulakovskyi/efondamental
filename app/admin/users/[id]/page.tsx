import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { UserEditForm } from "./components/user-edit-form";
import { getAllCenters, getAllPathologies, getAllCenterPathologies } from "@/lib/services/center.service";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch user profile
  const { data: user } = await supabase
    .from("user_profiles")
    .select(`
      *,
      centers (
        id,
        name,
        code
      ),
      user_pathologies (
        pathology_id
      )
    `)
    .eq("id", id)
    .single();

  if (!user) {
    notFound();
  }

  // Fetch auth user email
  const { data: authUser } = await supabase.auth.admin.getUserById(id);

  // Fetch all centers for the dropdown
  const centers = await getAllCenters();
  
  // Fetch all pathologies for selection
  const pathologies = await getAllPathologies();

  // Fetch all center-pathology mappings for filtering
  const centerPathologyMappings = await getAllCenterPathologies();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Edit User</h2>
        <p className="text-slate-600">Manage user profile and permissions</p>
      </div>

      <UserEditForm
        user={user}
        email={authUser?.user?.email || user.email}
        centers={centers}
        pathologies={pathologies.map(p => ({
          id: p.id,
          name: p.name,
          type: p.type
        }))}
        centerPathologyMappings={centerPathologyMappings}
      />
    </div>
  );
}

