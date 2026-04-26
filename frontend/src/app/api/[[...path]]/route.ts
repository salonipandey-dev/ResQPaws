import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { path?: string[] } }) {
  const route = params.path?.join("/") || "";
  if (route === "" || route === "health") return NextResponse.json({ ok: true, service: "ResQPaws API", time: new Date().toISOString() });
  if (route === "stats") return NextResponse.json({ rescued: 48230, rescuers: 12500, partners: 540, avgResponseMin: 8 });
  return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
}

export async function POST(req: Request, { params }: { params: { path?: string[] } }) {
  const route = params.path?.join("/") || "";
  const body = await req.json().catch(() => ({}));
  if (route === "reports") return NextResponse.json({ ok: true, id: `RPT-${Math.floor(Math.random()*9000+1000)}`, received: body });
  if (route === "chat") return NextResponse.json({ ok: true, reply: `You said: ${body?.message || ""}. (Connect an LLM to enable real responses.)` });
  return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
}
