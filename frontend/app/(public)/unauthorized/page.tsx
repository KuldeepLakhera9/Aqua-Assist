import * as React from "react";
import Link from "next/link";
import { ShieldX, ArrowLeft, Home, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex-1 bg-slate-100 flex items-center justify-center p-4 min-h-[calc(100vh-33px)]">
      <div className="max-w-md w-full bg-white border border-slate-300 rounded-md p-6 sm:p-8 shadow-sm text-center space-y-4">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-red-100 text-red-700 mx-auto">
          <ShieldX className="h-7 w-7" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-xs">
            HTTP 403 — Access Restricted
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight pt-2">
            Restricted Ministerial Directive
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your current account credentials do not possess the required clearance level to access this command portal.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 text-xs text-slate-500 font-mono text-left space-y-1">
          <div>INCIDENT CODE: AUTH-ROLE-MISMATCH</div>
          <div>PROTOCOL: ZERO-TRUST DISASTER CLEARANCE</div>
          <div>STATUS: INCIDENT LOGGED</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Link href="/dashboard" className="flex-1">
            <Button variant="default" className="w-full" size="sm">
              <Home className="h-4 w-4 mr-1.5" />
              My Assigned Portal
            </Button>
          </Link>
          <Link href="/login" className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              <KeyRound className="h-4 w-4 mr-1.5" />
              Switch Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
