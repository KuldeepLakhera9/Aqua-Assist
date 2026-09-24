"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  Bot,
  Truck,
  Banknote,
  Users,
  LineChart,
  Building2,
  FileCheck2,
  Layers,
  Activity,
} from "lucide-react";
import { GovHeader } from "@/components/layout/GovHeader";
import { Badge } from "@/components/ui/badge";

const ADMIN_NAV = [
  { name: "National Situation Room", href: "/admin/dashboard", icon: Layers },
  { name: "AI Report Verification", href: "/admin/verification", icon: Bot },
  { name: "Resource Stockpile", href: "/admin/resources", icon: Truck },
  { name: "Financial Relief Grants", href: "/admin/financial-aid", icon: Banknote },
  { name: "Access & Personnel", href: "/admin/users", icon: Users },
  { name: "Predictive Analytics", href: "/admin/analytics", icon: LineChart },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <GovHeader
        portalName="National Disaster Operations Center (NDOC)"
        portalRole="admin"
      />

      {/* Ministerial Sub-Nav & Strategic Alert Status */}
      <div className="bg-white border-b border-slate-200 sticky top-14 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-2 gap-4">
            <nav className="flex items-center space-x-1 sm:space-x-2">
              {ADMIN_NAV.map((item) => {
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

            {/* Strategic Watch Status */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-800 uppercase tracking-wider hidden sm:inline">
                NATIONAL WATCH LEVEL:
              </span>
              <Badge variant="outline" className="border-amber-400 bg-amber-50 text-amber-900 text-[10px] font-mono font-bold uppercase">
                TIER 2 (HEIGHTENED ALERT)
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
