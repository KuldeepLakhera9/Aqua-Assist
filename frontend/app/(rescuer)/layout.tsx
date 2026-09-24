"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LifeBuoy,
  Radio,
  Users,
  MapPin,
  ClipboardList,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { GovHeader } from "@/components/layout/GovHeader";
import { Badge } from "@/components/ui/badge";

const RESCUER_NAV = [
  { name: "Emergency Dispatch Triage", href: "/rescuer/dashboard", icon: Radio },
  { name: "Field Teams & Units", href: "/rescuer/teams", icon: Users },
  { name: "Distress Logs & Requests", href: "/rescuer/requests", icon: ClipboardList },
  { name: "Tactical Response Map", href: "/rescuer/map", icon: MapPin },
];

export default function RescuerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <GovHeader
        portalName="Emergency Response & Field Operations (NDRF / SDRF)"
        portalRole="rescuer"
      />

      {/* Responder Tactical Sub-Nav Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-14 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-2 gap-4">
            <nav className="flex items-center space-x-1 sm:space-x-2">
              {RESCUER_NAV.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Tactical Unit Readiness Status */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-800 uppercase tracking-wider">
                DEFENSE READINESS: ALPHA
              </span>
              <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800 text-[10px] uppercase font-mono">
                14 Boats Active
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Viewport Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
