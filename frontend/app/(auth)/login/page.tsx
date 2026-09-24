"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Building2,
  Shield,
  LifeBuoy,
  User,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { type UserRole } from "@/types/auth";
import { getStoredUser } from "@/lib/auth";

function LoginFormContent() {
  const { login, loginWithDemoRole, error, clearError, isLoading } = useAuth();
  const [loginIdentifier, setLoginIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  React.useEffect(() => {
    clearError();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier || !password) return;

    const success = await login({
      login: loginIdentifier,
      password,
      rememberMe,
    });

    if (success) {
      const user = getStoredUser();
      let target = redirectTarget !== "/dashboard" ? redirectTarget : null;

      if (!target && user) {
        if (user.role === "admin" || user.role === "official") {
          target = "/admin/dashboard";
        } else if (user.role === "municipality") {
          target = "/municipality/dashboard";
        } else if (user.role === "rescuer") {
          target = "/rescuer/dashboard";
        } else {
          target = "/citizen-dashboard";
        }
      }

      const destination = target || "/citizen-dashboard";
      if (typeof window !== "undefined") {
        window.location.href = destination;
      } else {
        router.push(destination);
      }
    }
  };

  const handleQuickDemo = (role: UserRole, email: string, pass: string) => {
    setLoginIdentifier(email);
    setPassword(pass);
    loginWithDemoRole(role);
  };

  return (
    <Card className="border border-slate-300 bg-white shadow-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg font-bold text-slate-900">
          Official Portal Sign-In
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Enter your registered disaster response or citizen credentials.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div
            className="p-3 bg-red-50 border border-red-300 rounded-sm text-xs text-red-900 flex items-start gap-2 animate-in fade-in"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="login-field">Email or Mobile Number</Label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="login-field"
                type="text"
                placeholder="officer@disaster.gov.in or 9876543210"
                className="pl-9"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password-field">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-slate-600 hover:text-slate-900 underline underline-offset-2"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="password-field"
                type="password"
                placeholder="••••••••••••"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <Label htmlFor="remember-me" className="text-xs text-slate-600 font-normal">
              Remember this session on this official terminal
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={isLoading || !loginIdentifier || !password}
          >
            {isLoading ? "Verifying Credentials..." : "Authenticate Session"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>

        {/* ------------------------------------------------------------- */}
        {/* EXECUTIVE 1-CLICK DEMO LOGIN PROFILES */}
        {/* ------------------------------------------------------------- */}
        <div className="border-t border-slate-200 pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Quick Role Switch (Ministerial Demo)
            </span>
            <span className="text-[10px] font-mono text-emerald-800 font-semibold">1-Click Access</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() =>
                handleQuickDemo(
                  "municipality",
                  "mumbai.municipality@floodmanagement.com",
                  "mumbai123"
                )
              }
              className="flex items-center gap-2 p-2 border border-slate-200 rounded-sm bg-slate-50 hover:bg-slate-100 text-slate-800 text-left transition-colors cursor-pointer"
            >
              <Building2 className="h-4 w-4 text-slate-600 shrink-0" />
              <div className="truncate">
                <div className="font-semibold text-slate-900 truncate">Municipality</div>
                <div className="text-[10px] text-slate-500 font-mono">mumbai123</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickDemo(
                  "admin",
                  "admin@floodmanagement.com",
                  "admin123"
                )
              }
              className="flex items-center gap-2 p-2 border border-slate-200 rounded-sm bg-slate-50 hover:bg-slate-100 text-slate-800 text-left transition-colors cursor-pointer"
            >
              <Shield className="h-4 w-4 text-slate-600 shrink-0" />
              <div className="truncate">
                <div className="font-semibold text-slate-900 truncate">Central Admin</div>
                <div className="text-[10px] text-slate-500 font-mono">admin123</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickDemo(
                  "rescuer",
                  "rescuer@floodmanagement.com",
                  "rescuer123"
                )
              }
              className="flex items-center gap-2 p-2 border border-slate-200 rounded-sm bg-slate-50 hover:bg-slate-100 text-slate-800 text-left transition-colors cursor-pointer"
            >
              <LifeBuoy className="h-4 w-4 text-slate-600 shrink-0" />
              <div className="truncate">
                <div className="font-semibold text-slate-900 truncate">Rescuer Corps</div>
                <div className="text-[10px] text-slate-500 font-mono">rescuer123</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickDemo(
                  "citizen",
                  "testuser@example.com",
                  "password123"
                )
              }
              className="flex items-center gap-2 p-2 border border-slate-200 rounded-sm bg-slate-50 hover:bg-slate-100 text-slate-800 text-left transition-colors cursor-pointer"
            >
              <User className="h-4 w-4 text-slate-600 shrink-0" />
              <div className="truncate">
                <div className="font-semibold text-slate-900 truncate">Citizen User</div>
                <div className="text-[10px] text-slate-500 font-mono">password123</div>
              </div>
            </button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-slate-100 p-4 text-center justify-center text-xs text-slate-600">
        <span>Need a citizen account? </span>
        <Link
          href="/register"
          className="font-semibold text-slate-900 hover:underline ml-1"
        >
          Register for Crisis Alerts &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-500 font-mono">
          Loading authentication gateway...
        </div>
      }
    >
      <LoginFormContent />
    </React.Suspense>
  );
}

