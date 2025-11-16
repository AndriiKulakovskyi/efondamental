import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/rbac/middleware";
import { getCenterById } from "@/lib/services/center.service";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const center = await getCenterById(id);

    if (!center) {
      return NextResponse.json(
        { error: "Center not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ center });
  } catch (error) {
    console.error("Failed to fetch center:", error);
    return NextResponse.json(
      { error: "Failed to fetch center" },
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

    const { name, code, city, address, phone, email, active, pathologies } = body;

    const supabase = await createClient();

    // Update center basic information
    const { error: centerError } = await supabase
      .from("centers")
      .update({
        name,
        code,
        city,
        address,
        phone,
        email,
        active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (centerError) {
      return NextResponse.json(
        { error: centerError.message },
        { status: 400 }
      );
    }

    // Update pathologies if provided
    if (pathologies && Array.isArray(pathologies)) {
      // First, delete all existing pathology assignments
      await supabase
        .from("center_pathologies")
        .delete()
        .eq("center_id", id);

      // Then, add new pathology assignments
      if (pathologies.length > 0) {
        // Get pathology IDs from types
        const { data: pathologyData } = await supabase
          .from("pathologies")
          .select("id, type")
          .in("type", pathologies);

        if (pathologyData) {
          const centerPathologies = pathologyData.map((p) => ({
            center_id: id,
            pathology_id: p.id,
          }));

          await supabase.from("center_pathologies").insert(centerPathologies);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Center updated successfully",
    });
  } catch (error: any) {
    console.error("Failed to update center:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update center" },
      { status: 500 }
    );
  }
}

