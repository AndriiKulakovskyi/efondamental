import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile, email: user.email });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { first_name, last_name, phone, username, email, current_password, new_password } = body;

    // Update profile fields in user_profiles table
    if (first_name || last_name || phone !== undefined || username) {
      const updateData: any = {};
      if (first_name) updateData.first_name = first_name;
      if (last_name) updateData.last_name = last_name;
      if (phone !== undefined) updateData.phone = phone;
      if (username) updateData.username = username;

      const { error: profileError } = await supabase
        .from("user_profiles")
        .update(updateData)
        .eq("id", user.id);

      if (profileError) {
        return NextResponse.json(
          { error: `Profile update failed: ${profileError.message}` },
          { status: 400 }
        );
      }
    }

    // Update email if provided and different from current
    if (email && email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email,
      });

      if (emailError) {
        return NextResponse.json(
          { error: `Email update failed: ${emailError.message}` },
          { status: 400 }
        );
      }

      // Also update email in user_profiles
      await supabase
        .from("user_profiles")
        .update({ email })
        .eq("id", user.id);
    }

    // Update password if provided
    if (new_password) {
      const { error: passwordError } = await supabase.auth.updateUser({
        password: new_password,
      });

      if (passwordError) {
        return NextResponse.json(
          { error: `Password update failed: ${passwordError.message}` },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}

