import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth/server";

export async function proxy(request: NextRequest) {
  if (!auth) {
    return NextResponse.redirect(new URL("/setup", request.url));
  }
  return auth.middleware({ loginUrl: "/auth/sign-in" })(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/beneficiarios/:path*", "/acompanhamentos/:path*"]
};
