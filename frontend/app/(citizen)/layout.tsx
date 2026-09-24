"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  AlertTriangle,
  Phone,
  Droplet,
  Bell,
  User,
  AlertOctagon,
  Map,
} from "lucide-react";
import { GovHeader } from "@/components/layout/GovHeader";
import { Button } from "@/components/ui/button";

const CITIZEN_NAV = [
  { name: "My Dashboard", href: "/citizen-dashboard", icon: Home },
  { name: "Flood Map", href: "/map", icon: Map },
  { name: "Report Flood", href: "/report-flood", icon: FileText },
  { name: "View Reports", href: "/reports", icon: AlertTriangle },
  { name: "Water Issues", href: "/water-issues", icon: Droplet },
  { name: "Emergency Alerts", href: "/alerts", icon: Bell },
  { name: "My Profile", href: "/profile", icon: User },
];

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <GovHeader portalName="Citizen Safety Portal" portalRole="citizen" />

      {/* Sub-Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-14 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-2 gap-4">
            <nav className="flex items-center space-x-1 sm:space-x-2">
              {CITIZEN_NAV.map((item) => {
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

            <Link href="/emergency">
              <Button
                variant="emergency"
                size="sm"
                className="h-8 text-xs font-bold shrink-0"
              >
                <AlertOctagon className="h-3.5 w-3.5 mr-1" />
                EMERGENCY SOS
              </Button>
            </Link>
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
