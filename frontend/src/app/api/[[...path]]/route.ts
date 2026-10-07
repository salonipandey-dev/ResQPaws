import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function forward(req: Request, params: { path?: string[] }) {
  const route = params.path?.join("/") || "";
  const target = `${BACKEND_API_URL.replace(/\/$/, "")}/${route}${new URL(req.url).search}`;
  const contentType = req.headers.get("content-type") || "";

  const init: RequestInit = {
    method: req.method,
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
    headers: {
      Authorization: req.headers.get("authorization") || "",
    },
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    if (contentType.includes("application/json")) {
      init.headers = { ...init.headers, "Content-Type": "application/json" };
      init.body = JSON.stringify(await req.json().catch(() => ({})));
    } else {
      init.body = await req.arrayBuffer();
      if (contentType) {
        init.headers = { ...init.headers, "Content-Type": contentType };
      }
    }
  }

  let response: Response;
  try {
    response = await fetch(target, init);
  } catch {
    return NextResponse.json({ success: false, message: "Rescue service is temporarily unavailable. Please try again shortly." }, { status: 502 });
  }
  const body = await response.text();

  return new NextResponse(response.status === 204 || response.status === 304 ? null : body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") || "application/json",
    },
  });
}

export async function GET(req: Request, context: { params: { path?: string[] } }) {
  return forward(req, context.params);
}

export async function POST(req: Request, context: { params: { path?: string[] } }) {
  return forward(req, context.params);
}

export async function PUT(req: Request, context: { params: { path?: string[] } }) {
  return forward(req, context.params);
}

export async function PATCH(req: Request, context: { params: { path?: string[] } }) {
  return forward(req, context.params);
}

export async function DELETE(req: Request, context: { params: { path?: string[] } }) {
  return forward(req, context.params);
}
