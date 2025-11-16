import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/rbac/middleware";
import { getCenterById } from "@/lib/services/center.service";

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

