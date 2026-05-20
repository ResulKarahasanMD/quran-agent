import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error:
        'Search is disabled because MeiliSearch is not configured. Use direct verse references such as 2:255, Bakara 255, or Fatiha 1.',
    },
    { status: 501 }
  );
}
