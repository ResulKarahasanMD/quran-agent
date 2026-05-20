import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_TR_AUTHOR, fetchVerse } from '@/lib/acikkuran';
import type { ApiError } from '@/types/acikkuran';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ surah: string; verse: string }> }
) {
  const { surah: surahStr, verse: verseStr } = await params;
  const surah = parseInt(surahStr, 10);
  const verse = parseInt(verseStr, 10);

  if (isNaN(surah) || isNaN(verse) || surah < 1 || surah > 114 || verse < 1) {
    return NextResponse.json(
      { success: false, error: 'Invalid surah or verse number' },
      { status: 400 }
    );
  }

  const authorParam = request.nextUrl.searchParams.get('author');
  const authorId = authorParam ? parseInt(authorParam, 10) : DEFAULT_TR_AUTHOR;

  try {
    const response = await fetchVerse(surah, verse, authorId);
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
