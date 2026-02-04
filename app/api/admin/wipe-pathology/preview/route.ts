import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/rbac/middleware';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const pathologyId = searchParams.get('pathologyId');

    if (!pathologyId) {
      return NextResponse.json({ error: 'Missing pathologyId' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('admin_wipe_pathology_preview', {
      p_pathology_id: pathologyId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ preview: data });
  } catch (error) {
    console.error('Failed to preview pathology wipe:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to preview wipe' },
      { status: 500 }
    );
  }
}

