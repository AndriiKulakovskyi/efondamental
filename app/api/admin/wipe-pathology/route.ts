import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/rbac/middleware';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { logAuditEvent } from '@/lib/services/audit.service';

type WipeResult = {
  pathology_id: string;
  patients_deleted: number;
  visits_deleted: number;
  patient_user_ids: string[];
};

export async function POST(request: NextRequest) {
  try {
    const profile = await requireAdmin();
    const supabase = await createClient();

    const body = await request.json().catch(() => ({}));
    const pathologyId = body?.pathologyId as string | undefined;
    const confirmText = body?.confirmText as string | undefined;

    if (!pathologyId) {
      return NextResponse.json({ error: 'Missing pathologyId' }, { status: 400 });
    }

    if (confirmText !== 'WIPE') {
      return NextResponse.json(
        { error: 'Confirmation required. Type WIPE to proceed.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc('admin_wipe_pathology', {
      p_pathology_id: pathologyId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const wipe = data as unknown as WipeResult;
    const userIds = Array.isArray(wipe?.patient_user_ids) ? wipe.patient_user_ids : [];

    // Delete linked auth users, but ONLY if they are patient accounts.
    const admin = createAdminClient();

    let deletedAuthUsers = 0;
    const skippedAuthUsers: { id: string; reason: string }[] = [];

    if (userIds.length > 0) {
      const { data: profiles, error: profilesError } = await admin
        .from('user_profiles')
        .select('id, role')
        .in('id', userIds);

      if (profilesError) {
        return NextResponse.json(
          { error: `Wipe succeeded but failed to fetch user roles: ${profilesError.message}` },
          { status: 500 }
        );
      }

      const roleById = new Map<string, string>();
      for (const p of profiles || []) {
        roleById.set(p.id, (p as any).role);
      }

      for (const id of userIds) {
        const role = roleById.get(id);

        if (role !== 'patient') {
          skippedAuthUsers.push({ id, reason: `role=${role ?? 'unknown'}` });
          continue;
        }

        const { error: deleteError } = await admin.auth.admin.deleteUser(id);
        if (deleteError) {
          skippedAuthUsers.push({ id, reason: deleteError.message });
          continue;
        }
        deletedAuthUsers++;
      }
    }

    await logAuditEvent({
      userId: profile.id,
      action: 'admin_wipe_pathology',
      entityType: 'pathologies',
      entityId: pathologyId,
      metadata: {
        patients_deleted: wipe?.patients_deleted ?? null,
        visits_deleted: wipe?.visits_deleted ?? null,
        patient_user_ids_count: userIds.length,
        auth_users_deleted: deletedAuthUsers,
        auth_users_skipped: skippedAuthUsers.length,
      },
    });

    return NextResponse.json({
      success: true,
      wipe,
      auth: {
        deleted: deletedAuthUsers,
        skipped: skippedAuthUsers,
      },
    });
  } catch (error) {
    console.error('Failed to wipe pathology:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to wipe pathology' },
      { status: 500 }
    );
  }
}

