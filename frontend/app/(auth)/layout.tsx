import * as React from "react";
import Link from "next/link";
import { ShieldCheck, PhoneCall, ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-h-[calc(100vh-33px)] bg-slate-100 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Return Link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between text-xs text-slate-500">
        <Link
          href="/"
          className="inline-flex items-center gap-1 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Public Situation Room
        </Link>
        <span className="font-mono">SECURE SSL 256-BIT</span>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-md w-full mx-auto my-auto space-y-4">
        {/* Government Authority Seal Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-slate-900 text-white shadow-xs">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-950 uppercase">
            National Disaster Management System
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Ministry of Home Affairs & State Disaster Management Authorities
          </p>
        </div>

        {/* Auth Body Card */}
        {children}

        {/* Institutional Statutory Warning */}
        <div className="bg-slate-200/80 border border-slate-300 rounded-sm p-3 text-[11px] text-slate-600 leading-relaxed text-center">
          <strong className="text-slate-800">OFFICIAL USE WARNING:</strong> This system is reserved for authorized disaster management personnel and registered citizens. Unauthorized intrusion attempts are logged and punishable under the Disaster Management Act.
        </div>
      </div>

      {/* Emergency Hotlines Footer */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-slate-500 space-y-1 pt-4 border-t border-slate-200">
        <p className="font-medium">
          Emergency Distress Helpline:{" "}
          <a href="tel:1078" className="font-bold text-red-700 hover:underline">
            1078 (Toll Free)
          </a>{" "}
          | Disaster Control Room:{" "}
          <a href="tel:112" className="font-bold text-slate-800 hover:underline">
            112
          </a>
        </p>
        <p className="text-[10px] text-slate-400">
          © 2026 National Disaster Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
