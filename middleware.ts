import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth/server";

export async function middleware(request: NextRequest) {
  if (!auth) {
    return NextResponse.redirect(new URL("/setup", request.url));
  }
  const result = await auth.middleware({ loginUrl: "/auth/sign-in" })(request);
  return result;
}

export const config = {
  matcher: ["/dashboard/:path*", "/beneficiarios/:path*", "/acompanhamentos/:path*"]
};
