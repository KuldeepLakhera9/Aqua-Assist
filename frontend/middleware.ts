import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE_KEY = "ndms_auth_token";
const ROLE_COOKIE_KEY = "ndms_user_role";

// Public routes that never require authentication
const PUBLIC_PATHS = [
  "/",
  "/about",
  "/emergency",
  "/emergency-services",
  "/weather",
  "/login",
  "/register",
  "/forgot-password",
  "/styleguide",
  "/unauthorized",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore static assets, next internal routes, and API endpoints
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files like favicon.ico, images
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(TOKEN_COOKIE_KEY)?.value;
  const role = request.cookies.get(ROLE_COOKIE_KEY)?.value;
  const isAuthenticated = !!token;

  // Handle password reset token path (e.g. /reset-password/abc123)
  if (pathname.startsWith("/reset-password")) {
    return NextResponse.next();
  }


  // Handle smart /dashboard redirector
  if (pathname === "/dashboard") {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", "/dashboard");
      return NextResponse.redirect(loginUrl);
    }

    if (role === "admin" || role === "official") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (role === "municipality") {
      return NextResponse.redirect(new URL("/municipality/dashboard", request.url));
    }
    if (role === "rescuer") {
      return NextResponse.redirect(new URL("/rescuer/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/citizen-dashboard", request.url));
  }

  // Allow access to explicitly public paths
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path);
  if (isPublic) {
    return NextResponse.next();
  }

  // If not authenticated, redirect to /login with redirect parameter
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based route authorization guards
  if (pathname.startsWith("/admin")) {
    if (role !== "admin" && role !== "official") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (pathname.startsWith("/municipality")) {
    if (role !== "municipality" && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (pathname.startsWith("/rescuer")) {
    if (role !== "rescuer" && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
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
