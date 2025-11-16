import { NextRequest, NextResponse } from "next/server";
import { getUserContext } from "@/lib/rbac/middleware";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const context = await getUserContext();
    
    if (!context || context.profile.role === "patient") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const supabase = await createClient();

    // Fetch settings from user metadata
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("metadata")
      .eq("id", context.profile.id)
      .single();

    const settings = profile?.metadata?.settings || {
      emailNotifications: true,
      smsNotifications: false,
      visitReminders: true,
      newPatientAlerts: true,
      reportFrequency: "weekly",
    };

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await getUserContext();
    
    if (!context || context.profile.role === "patient") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { settings } = body;

    const supabase = await createClient();

    // Get current metadata
    const { data: currentProfile } = await supabase
      .from("user_profiles")
      .select("metadata")
      .eq("id", context.profile.id)
      .single();

    // Merge new settings with existing metadata
    const updatedMetadata = {
      ...(currentProfile?.metadata || {}),
      settings,
    };

    // Update user metadata with new settings
    const { error } = await supabase
      .from("user_profiles")
      .update({
        metadata: updatedMetadata,
        updated_at: new Date().toISOString(),
      })
      .eq("id", context.profile.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
    });
  } catch (error: any) {
    console.error("Failed to save settings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save settings" },
      { status: 500 }
    );
  }
}

