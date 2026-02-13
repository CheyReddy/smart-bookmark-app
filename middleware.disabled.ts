import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🚨 Allow Supabase auth routes
  if (
    pathname.startsWith("/auth") ||
    pathname.includes("supabase") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
