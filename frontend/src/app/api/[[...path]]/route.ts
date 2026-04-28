import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { path?: string[] } }) {
  const route = params.path?.join("/") || "";
  if (route === "" || route === "health") {
    return NextResponse.json({ ok: true, service: "ResQPaws API", time: new Date().toISOString() });
  }
  if (route === "stats") {
    return NextResponse.json({
      reportsSubmitted: 0,
      casesInProgress: 0,
      casesResolved: 0,
      rewardPointsEarned: 0,
    });
  }
  return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
}

export async function POST(req: Request, { params }: { params: { path?: string[] } }) {
  const route = params.path?.join("/") || "";
  const body = await req.json().catch(() => ({}));
  if (route === "reports") return NextResponse.json({ ok: true, message: "Report payload received", received: body });
  if (route === "chat") return NextResponse.json({ ok: true, reply: "Thank you. Use Rescue Guide for emergency-safe instructions and report tracking." });
  return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
}
