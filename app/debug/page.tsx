import { createClient } from "@/lib/supabase/server";

export default async function DebugPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  let profile = null;
  let profileError = null;

  if (user) {
    const result = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    profile = result.data;
    profileError = result.error;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>

      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-6">
          <h2 className="font-semibold text-lg mb-3">Auth User Status</h2>
          {userError && (
            <div className="bg-red-50 border border-red-200 p-3 rounded mb-3">
              <p className="text-red-800 text-sm">Error: {userError.message}</p>
            </div>
          )}
          {user ? (
            <div className="space-y-2">
              <p className="text-green-600 font-semibold">✓ User is authenticated</p>
              <pre className="bg-slate-50 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(
                  {
                    id: user.id,
                    email: user.email,
                    created_at: user.created_at,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          ) : (
            <p className="text-red-600">✗ No authenticated user</p>
          )}
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h2 className="font-semibold text-lg mb-3">User Profile Status</h2>
          {profileError && (
            <div className="bg-red-50 border border-red-200 p-3 rounded mb-3">
              <p className="text-red-800 text-sm">
                Error: {profileError.message}
                <br />
                Code: {profileError.code}
              </p>
            </div>
          )}
          {profile ? (
            <div className="space-y-2">
              <p className="text-green-600 font-semibold">✓ Profile found</p>
              <pre className="bg-slate-50 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          ) : user ? (
            <p className="text-red-600">✗ Profile not found for this user</p>
          ) : (
            <p className="text-slate-500">Waiting for authentication...</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold mb-2">What to do:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-900">
            <li>If Auth User is ✗: Login at /auth/login</li>
            <li>If Auth User is ✓ but Profile is ✗: Run scripts/init-users.sql in Supabase</li>
            <li>If both are ✓: You should be able to access the dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

