import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, runAgent } from '@/lib/agent';
import type { ApiError } from '@/types/acikkuran';

type AskRequestBody = {
  question?: unknown;
  language?: unknown;
};

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please wait before trying again.' },
      { status: 429 }
    );
  }

  let body: AskRequestBody;

  try {
    body = (await request.json()) as AskRequestBody;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { question, language = 'tr' } = body;

  if (typeof question !== 'string' || question.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: 'Question is required' },
      { status: 400 }
    );
  }

  if (language !== 'tr' && language !== 'en') {
    return NextResponse.json(
      { success: false, error: 'Language must be "tr" or "en"' },
      { status: 400 }
    );
  }

  try {
    const result = await runAgent(question.trim(), language);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const error = err as Partial<ApiError>;
    const status = error.status ?? 500;

    return NextResponse.json(
      { success: false, error: error.message ?? 'Internal server error' },
      { status }
    );
  }
}
