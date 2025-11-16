import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPathologyByType } from "@/lib/services/center.service";
import { PathologyType } from "@/lib/types/enums";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const pathologyParam = searchParams.get("pathology");

    if (!pathologyParam) {
      return NextResponse.json(
        { error: "Pathology parameter required" },
        { status: 400 }
      );
    }

    const pathologyData = await getPathologyByType(pathologyParam as PathologyType);
    
    if (!pathologyData) {
      return NextResponse.json(
        { error: "Invalid pathology" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: templates, error } = await supabase
      .from("visit_templates")
      .select("*")
      .eq("pathology_id", pathologyData.id)
      .eq("active", true)
      .order("order_index");

    if (error) {
      throw error;
    }

    return NextResponse.json({ templates: templates || [] });
  } catch (error) {
    console.error("Failed to fetch visit templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch visit templates" },
      { status: 500 }
    );
  }
}

