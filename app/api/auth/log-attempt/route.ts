import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// API route for logging login attempts
// Uses admin client to bypass RLS since this may be called before user is authenticated
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, success, method, failureReason, userId } = body;

    if (typeof success !== 'boolean' || !method) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Get user agent from request headers
    const userAgent = request.headers.get('user-agent');

    await adminClient.from('login_history').insert({
      user_id: userId || null,
      success,
      method,
      user_agent: userAgent,
      failure_reason: failureReason || null,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Silent fail - don't interrupt login flow
    console.error('Failed to log login attempt:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
