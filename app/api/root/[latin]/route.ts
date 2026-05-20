import { NextRequest, NextResponse } from 'next/server';
import {
  fetchRootConcordance,
  fetchRootDetail,
  DEFAULT_TR_AUTHOR,
} from '@/lib/acikkuran';
import type { ApiError } from '@/types/acikkuran';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ latin: string }> }
) {
  const { latin } = await params;

  if (!latin || latin.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: 'Root latin code is required' },
      { status: 400 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const authorParam = searchParams.get('author');
  const pageParam = searchParams.get('page');

  const authorId = authorParam ? Number.parseInt(authorParam, 10) : DEFAULT_TR_AUTHOR;
  const page = pageParam ? Number.parseInt(pageParam, 10) : 1;

  if (Number.isNaN(authorId) || authorId <= 0) {
    return NextResponse.json(
      { success: false, error: 'Author must be a positive integer' },
      { status: 400 }
    );
  }

  if (Number.isNaN(page) || page <= 0) {
    return NextResponse.json(
      { success: false, error: 'Page must be a positive integer' },
      { status: 400 }
    );
  }

  try {
    const [concordance, rootDetail] = await Promise.all([
      fetchRootConcordance(latin, authorId, page),
      fetchRootDetail(latin).catch(() => null),
    ]);

    return NextResponse.json({
      success: true,
      data: concordance.data,
      links: concordance.links,
      meta: concordance.meta,
      root: rootDetail?.data ?? null,
    });
  } catch (err) {
    const error = err as ApiError;
    const status = error.status ?? 500;

    return NextResponse.json(
      { success: false, error: error.message ?? 'Internal server error' },
      { status }
    );
  }
}
