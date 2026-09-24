import Cookies from "js-cookie";
import { UserProfile, UserRole } from "@/types/auth";
import {
  TOKEN_COOKIE_KEY,
  ROLE_COOKIE_KEY,
  USER_COOKIE_KEY,
} from "./api-client";

/**
 * Decodes the payload from a standard JWT without external binary dependencies.
 */
export function decodeJwtPayload(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Persists user session in secure cookies accessible to both client and middleware.
 */
export function setAuthSession(
  token: string,
  user: UserProfile,
  rememberMe: boolean = true
): void {
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const cookieOptions: Cookies.CookieAttributes = {
    path: "/",
    sameSite: "lax",
    secure: isHttps,
    ...(rememberMe ? { expires: 7 } : {}), // 7 days or session
  };

  Cookies.set(TOKEN_COOKIE_KEY, token, cookieOptions);
  Cookies.set(ROLE_COOKIE_KEY, user.role, cookieOptions);
  Cookies.set(USER_COOKIE_KEY, JSON.stringify(user), cookieOptions);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("ndms_auth_token", token);
      localStorage.setItem("ndms_user_role", user.role);
      localStorage.setItem("ndms_user_profile", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch {
      // ignore
    }
  }
}

/**
 * Retrieves the current JWT auth token.
 */
export function getAuthToken(): string | undefined {
  const token = Cookies.get(TOKEN_COOKIE_KEY);
  if (token) return token;
  if (typeof window !== "undefined") {
    return localStorage.getItem("ndms_auth_token") || localStorage.getItem("token") || undefined;
  }
  return undefined;
}

/**
 * Retrieves the stored user profile from cookies or localStorage.
 */
export function getStoredUser(): UserProfile | null {
  const userJson = Cookies.get(USER_COOKIE_KEY);
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch {
      // ignore
    }
  }
  if (typeof window !== "undefined") {
    const local = localStorage.getItem("ndms_user_profile");
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // ignore
      }
    }
  }
  return null;
}

/**
 * Clears all auth session cookies on logout.
 */
export function clearAuthSession(): void {
  Cookies.remove(TOKEN_COOKIE_KEY, { path: "/" });
  Cookies.remove(ROLE_COOKIE_KEY, { path: "/" });
  Cookies.remove(USER_COOKIE_KEY, { path: "/" });
  if (typeof window !== "undefined") {
    localStorage.removeItem("ndms_auth_token");
    localStorage.removeItem("ndms_user_role");
    localStorage.removeItem("ndms_user_profile");
    localStorage.removeItem("token");
  }
}

/**
 * Checks whether user has permission for a specific required role.
 */
export function hasRequiredRole(
  userRole: UserRole | undefined,
  allowedRoles: UserRole[]
): boolean {
  if (!userRole) return false;
  // If user has 'admin', they have access across admin and municipality
  if (userRole === "admin") return true;
  return allowedRoles.includes(userRole);
}
