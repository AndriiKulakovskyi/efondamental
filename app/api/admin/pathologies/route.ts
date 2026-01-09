import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/rbac/middleware";
import { getAllPathologies } from "@/lib/services/center.service";

export async function GET() {
  try {
    await requireAdmin();
    const pathologies = await getAllPathologies();
    return NextResponse.json({ pathologies });
  } catch (error) {
    console.error("Failed to fetch pathologies:", error);
    return NextResponse.json(
      { error: "Failed to fetch pathologies" },
      { status: 500 }
    );
  }
}
