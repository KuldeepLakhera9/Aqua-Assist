"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters in length");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Invalid or expired token. Please request a new link."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-slate-300 bg-white shadow-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg font-bold text-slate-900">
          Set New Official Password
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Create a strong password with letters, numbers, and special characters.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {isSuccess ? (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-sm text-xs text-emerald-950 space-y-3">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              Password Successfully Updated
            </div>
            <p className="leading-relaxed">
              Your credentials have been securely updated. You can now authenticate into your assigned portal.
            </p>
            <Link href="/login" className="block">
              <Button className="w-full" size="sm">
                Proceed to Login &rarr;
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-300 rounded-sm text-xs text-red-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="new-pass">New Password (min 6 chars)</Label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="new-pass"
                  type="password"
                  placeholder="••••••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-new-pass">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="confirm-new-pass"
                  type="password"
                  placeholder="••••••••••••"
                  className="pl-9"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !password || !confirmPassword}
            >
              {isSubmitting ? "Updating Password..." : "Update Password"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="border-t border-slate-100 p-4 text-center justify-center text-xs text-slate-600">
        <Link
          href="/login"
          className="font-semibold text-slate-900 hover:underline"
        >
          &larr; Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
