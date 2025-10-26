// File: middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "./src/lib/auth";

const ADMIN_PREFIX = "/admin";
const PUBLIC_ROUTES = [
  `${ADMIN_PREFIX}/auth/login`, // ✅ gerçek login path'in
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public rotalar
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Sadece /admin altını koru
  if (pathname.startsWith(ADMIN_PREFIX)) {
    const token = req.cookies.get("admin_session")?.value;

    if (!token) {
      const url = new URL(`${ADMIN_PREFIX}/auth/login`, req.url); // ✅ doğru path
      return NextResponse.redirect(url);
    }

    try {
      await verifySession(token);
      return NextResponse.next();
    } catch {
      const url = new URL(`${ADMIN_PREFIX}/auth/login`, req.url); // ✅ doğru path
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
