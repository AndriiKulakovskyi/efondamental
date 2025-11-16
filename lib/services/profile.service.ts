import { createClient } from "@/lib/supabase/server";

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  username?: string;
}

export interface AccountUpdateData {
  email?: string;
  password?: string;
}

export async function getCurrentUserProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  return { profile, email: user.email };
}

export async function updateUserProfile(data: ProfileUpdateData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("user_profiles")
    .update(data)
    .eq("id", user.id);

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return { success: true };
}

export async function updateUserEmail(email: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // Update auth email
  const { error: authError } = await supabase.auth.updateUser({ email });

  if (authError) {
    throw new Error(`Failed to update email: ${authError.message}`);
  }

  // Update profile email
  await supabase.from("user_profiles").update({ email }).eq("id", user.id);

  return { success: true };
}

export async function updateUserPassword(newPassword: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    throw new Error(`Failed to update password: ${error.message}`);
  }

  return { success: true };
}

