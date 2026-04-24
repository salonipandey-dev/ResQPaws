import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, service: 'ResQPaws', time: new Date().toISOString() });
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ ok: true, received: body });
}
