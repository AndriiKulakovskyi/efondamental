import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/rbac/middleware";
import {
  createCenter,
  setCenterPathologies,
  getAllPathologies,
} from "@/lib/services/center.service";
import { logAuditEvent } from "@/lib/services/audit.service";

export async function POST(request: NextRequest) {
  try {
    const profile = await requireAdmin();

    const body = await request.json();
    const { pathologies, ...centerData } = body;

    // Create center
    const center = await createCenter({
      ...centerData,
      active: true,
    });

    // Get pathology IDs
    const allPathologies = await getAllPathologies();
    const pathologyIds = pathologies
      .map((type: string) => {
        const pathology = allPathologies.find((p) => p.type === type);
        return pathology?.id;
      })
      .filter(Boolean);

    // Assign pathologies to center
    if (pathologyIds.length > 0) {
      await setCenterPathologies(center.id, pathologyIds);
    }

    // Log audit event
    await logAuditEvent({
      userId: profile.id,
      action: "create_center",
      entityType: "centers",
      entityId: center.id,
      metadata: { centerData, pathologies },
    });

    return NextResponse.json({ center }, { status: 201 });
  } catch (error) {
    console.error("Failed to create center:", error);
    return NextResponse.json(
      { error: "Failed to create center" },
      { status: 500 }
    );
  }
}

