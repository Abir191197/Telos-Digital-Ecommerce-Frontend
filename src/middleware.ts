// ── Next.js Edge Middleware ─────────────────────────────
// Handles authentication redirects at the edge.
// Runs before every route — checks for auth token in cookies/headers.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedPaths = [
  "/cart",
  "/checkout",
  "/dashboard",
  "/clients",
  "/payments",
  "/reports",
  "/notifications",
  "/profile",
  "/settings",
];

const adminOnlyPaths = ["/dashboard", "/clients", "/payments", "/reports"];

// Routes only for unauthenticated users
const authPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // TODO: Replace with actual token check (cookie-based or header-based)
  // For now, this is a placeholder that allows all requests through.
  const token = request.cookies.get("accessToken")?.value;
  const authRole = request.cookies.get("authRole")?.value;

  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );
  const isAdminOnlyRoute = adminOnlyPaths.some((path) =>
    pathname.startsWith(path),
  );
  const isAuthRoute = authPaths.some((path) => pathname.startsWith(path));

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminOnlyRoute && token && authRole !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && token) {
    const redirectPath = authRole === "SUPER_ADMIN" ? "/dashboard" : "/account";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
