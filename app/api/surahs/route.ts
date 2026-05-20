import { NextResponse } from 'next/server';
import { fetchSurahs } from '@/lib/acikkuran';
import type { ApiError } from '@/types/acikkuran';

export async function GET() {
  try {
    const response = await fetchSurahs();
    return NextResponse.json({ success: true, data: response.data });
  } catch (err) {
    const error = err as ApiError;
    const status = error.status ?? 500;
    return NextResponse.json(
      { success: false, error: error.message ?? 'Internal server error' },
      { status }
    );
  }
}
