import { NextRequest, NextResponse } from "next/server";
import { acceptInvitation } from "@/lib/services/user-provisioning.service";

export async function POST(request: NextRequest) {
  try {
    console.log('[ACCEPT INVITATION API] Starting invitation acceptance...');
    
    const body = await request.json();
    const { token, password, username } = body;

    console.log('[ACCEPT INVITATION API] Token:', token?.substring(0, 10) + '...');
    console.log('[ACCEPT INVITATION API] Username:', username || 'none');

    if (!token || !password) {
      console.error('[ACCEPT INVITATION API] Missing token or password');
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      console.error('[ACCEPT INVITATION API] Password too short');
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    console.log('[ACCEPT INVITATION API] Calling acceptInvitation service...');
    
    const result = await acceptInvitation({
      token,
      password,
      username,
    });

    console.log('[ACCEPT INVITATION API] Result:', { success: result.success, error: result.error });

    if (!result.success) {
      console.error('[ACCEPT INVITATION API] Failed:', result.error);
      return NextResponse.json(
        { error: result.error || "Failed to accept invitation" },
        { status: 400 }
      );
    }

    console.log('[ACCEPT INVITATION API] ✅ Invitation accepted successfully. User ID:', result.userId);

    return NextResponse.json({
      success: true,
      userId: result.userId,
    }, { status: 200 });
  } catch (error) {
    console.error("[ACCEPT INVITATION API] ❌ Exception:", error);
    if (error instanceof Error) {
      console.error("[ACCEPT INVITATION API] Error message:", error.message);
      console.error("[ACCEPT INVITATION API] Error stack:", error.stack);
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to accept invitation" },
      { status: 500 }
    );
  }
}

