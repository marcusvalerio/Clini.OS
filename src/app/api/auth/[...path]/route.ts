import { auth } from "@/lib/auth/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function unavailable() {
  return NextResponse.json(
    { error: "Neon Auth ainda não foi configurado neste ambiente." },
    { status: 503 }
  );
}

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  if (!auth) return unavailable();
  const handlers = auth.handler();
  return handlers.GET(request, context);
}

export async function POST(request: Request, context: { params: Promise<{ path: string[] }> }) {
  if (!auth) return unavailable();
  const handlers = auth.handler();
  return handlers.POST(request, context);
}
