import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/rbac/middleware";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = await createClient();

    const { data: user, error } = await supabase
      .from("user_profiles")
      .select(`
        *,
        centers (
          id,
          name,
          code
        )
      `)
      .eq("id", id)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const { first_name, last_name, email, phone, username, role, center_id, active, pathologies } = body;

    const supabase = await createClient();

    // Update user profile
    const { error: profileError } = await supabase
      .from("user_profiles")
      .update({
        first_name,
        last_name,
        email,
        phone,
        username,
        role,
        center_id,
        active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    // Update pathologies if provided
    if (pathologies && Array.isArray(pathologies)) {
      const { setUserPathologies } = await import("@/lib/services/user.service");
      await setUserPathologies(id, pathologies);
    }

    // Update auth email if changed
    const { data: currentUser } = await supabase.auth.admin.getUserById(id);
    
    if (currentUser?.user && email !== currentUser.user.email) {
      const { error: emailError } = await supabase.auth.admin.updateUserById(id, {
        email,
      });

      if (emailError) {
        console.error("Failed to update auth email:", emailError);
        // Don't fail the whole request if just email update fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error: any) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supabase = await createClient();

    // Instead of deleting, we deactivate the user
    const { error } = await supabase
      .from("user_profiles")
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error: any) {
    console.error("Failed to deactivate user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to deactivate user" },
      { status: 500 }
    );
  }
}

