import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/rbac/middleware";
import { getCenterById, setCenterPathologies, getPathologyByType } from "@/lib/services/center.service";
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
      try {
        // Get pathology IDs for the requested types
        const pathologyIds: string[] = [];
        for (const type of pathologies) {
          const pathology = await getPathologyByType(type);
          if (pathology) {
            pathologyIds.push(pathology.id);
          }
        }

        // Set the pathologies for the center
        await setCenterPathologies(id, pathologyIds);
      } catch (pathologyError) {
        console.error("Failed to update center pathologies:", pathologyError);
        // We continue because base center info was already updated, 
        // but we should probably inform the client or rollback.
        // For now, let's include it in the response.
        return NextResponse.json(
          { error: "Basic info updated, but failed to update pathologies" },
          { status: 200 } // Or 207 Multi-Status
        );
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

