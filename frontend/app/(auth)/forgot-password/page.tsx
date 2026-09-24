"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await apiClient.post("/auth/forgot-password", { email });
      setIsSubmitted(true);
    } catch (err: any) {
      // In security compliance, always show success or safe message to avoid user enumeration
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-slate-300 bg-white shadow-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg font-bold text-slate-900">
          Official Credential Recovery
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Enter your verified email to receive cryptographically signed reset instructions.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {isSubmitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-sm text-xs text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              Recovery Instructions Dispatched
            </div>
            <p className="leading-relaxed">
              If an official account exists for <strong>{email}</strong>, a secure one-time password reset link has been dispatched. The link expires in 1 hour.
            </p>
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
              <Label htmlFor="recovery-email">Registered Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="recovery-email"
                  type="email"
                  placeholder="officer@disaster.gov.in"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !email}>
              {isSubmitting ? "Dispatching Security Token..." : "Send Reset Link"}
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
          &larr; Return to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
