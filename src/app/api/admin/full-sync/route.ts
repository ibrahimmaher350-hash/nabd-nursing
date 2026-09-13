import { NextResponse } from 'next/server';
import { syncAllTabsFromSupabase } from '@/lib/google/sheets';

/**
 * POST /api/admin/full-sync
 * Reads all records from Supabase and populates all 5 Google Sheets tabs.
 * Creates sheets and formats headers if missing.
 */
export async function POST(request: Request) {
  try {
    const result = await syncAllTabsFromSupabase();

    return NextResponse.json({
      success: true,
      message: 'تمت المزامنة الكاملة مع كافة أوراق جدول جوجل بنجاح ✅',
      stats: result,
    });
  } catch (err: any) {
    console.error('[Full Sync Error]', err);
    return NextResponse.json(
      { error: err?.message || 'تعذر إتمام المزامنة الكاملة مع جدول جوجل' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/full-sync
 * Same for easy browser access
 */
export async function GET(request: Request) {
  return POST(request);
}
