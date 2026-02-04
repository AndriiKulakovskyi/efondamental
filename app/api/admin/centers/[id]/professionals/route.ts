import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/rbac/middleware";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/admin/centers/[id]/professionals
 * Fetches all professionals (healthcare professionals) assigned to a specific center
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: centerId } = await params;

    const supabase = await createClient();

    // Fetch professionals belonging to this center
    const { data: professionals, error } = await supabase
      .from("user_profiles")
      .select("id, first_name, last_name, email, role")
      .eq("center_id", centerId)
      .in("role", ["healthcare_professional", "manager"])
      .order("last_name", { ascending: true })
      .order("first_name", { ascending: true });

    if (error) {
      console.error("Failed to fetch professionals:", error);
      return NextResponse.json(
        { error: "Failed to fetch professionals" },
        { status: 500 }
      );
    }

    return NextResponse.json({ professionals: professionals || [] });
  } catch (error) {
    console.error("Failed to fetch professionals:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch professionals" },
      { status: 500 }
    );
  }
}
