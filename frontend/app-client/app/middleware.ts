import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCookie } from 'cookies-next/client';

export function middleware(request: NextRequest) {
  const accessToken = getCookie("accesssToken");

  if (!accessToken && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|auth|_next/static|_next/image|.*\\.png$).*)"],
};