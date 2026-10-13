import { auth } from "@/lib/auth/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function unavailable() {
  return NextResponse.json(
    { error: "Neon Auth ainda não foi configurado neste ambiente." },
    { status: 503 }
  );
}

export async function GET(request: Request) {
  if (!auth) return unavailable();
  return auth.handler().GET(request);
}

export async function POST(request: Request) {
  if (!auth) return unavailable();
  return auth.handler().POST(request);
}
