import { NextRequest, NextResponse } from "next/server";
import { getUserContext } from "@/lib/rbac/middleware";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await getUserContext();
    
    if (!context || context.profile.role !== "manager") {
      return NextResponse.json(
        { error: "Unauthorized - Manager access required" },
        { status: 403 }
      );
    }

    if (!context.profile.center_id) {
      return NextResponse.json(
        { error: "Manager must be assigned to a center" },
        { status: 400 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { first_name, last_name, email, phone, username, active, pathologies } = body;

    const supabase = await createClient();

    // Verify the professional belongs to the same center
    const { data: professional, error: fetchError } = await supabase
      .from("user_profiles")
      .select("center_id, role")
      .eq("id", id)
      .single();

    if (fetchError || !professional) {
      return NextResponse.json(
        { error: "Professional not found" },
        { status: 404 }
      );
    }

    if (professional.center_id !== context.profile.center_id) {
      return NextResponse.json(
        { error: "Cannot edit professionals from other centers" },
        { status: 403 }
      );
    }

    if (professional.role !== "healthcare_professional") {
      return NextResponse.json(
        { error: "Can only edit healthcare professionals" },
        { status: 400 }
      );
    }

    // Update professional profile (cannot change role or center)
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        first_name,
        last_name,
        email,
        phone,
        username,
        active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
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
      }
    }

    return NextResponse.json({
      success: true,
      message: "Professional updated successfully",
    });
  } catch (error: any) {
    console.error("Failed to update professional:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update professional" },
      { status: 500 }
    );
  }
}

