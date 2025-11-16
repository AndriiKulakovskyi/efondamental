import { createClient } from "@/lib/supabase/server";
import { UsersTable } from "./components/users-table";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // Fetch all users with their profiles and centers
  const { data: users } = await supabase
    .from("user_profiles")
    .select(`
      *,
      centers (
        id,
        name,
        code
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Users</h2>
          <p className="text-slate-600">Manage all platform users and their access</p>
        </div>
      </div>

      <UsersTable users={users || []} />
    </div>
  );
}

