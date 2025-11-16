import { NextRequest, NextResponse } from "next/server";
import { requireProfessional, getUserContext } from "@/lib/rbac/middleware";
import { searchPatients } from "@/lib/services/patient.service";
import { PathologyType } from "@/lib/types/enums";

export async function GET(request: NextRequest) {
  try {
    await requireProfessional();
    const context = await getUserContext();

    if (!context?.profile.center_id) {
      return NextResponse.json(
        { error: "No center assigned" },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get("q") || "";
    const pathology = searchParams.get("pathology") as PathologyType | null;

    const patients = await searchPatients(
      searchTerm,
      context.profile.center_id,
      pathology || undefined
    );

    return NextResponse.json({ patients }, { status: 200 });
  } catch (error) {
    console.error("Failed to search patients:", error);
    return NextResponse.json(
      { error: "Failed to search patients" },
      { status: 500 }
    );
  }
}

