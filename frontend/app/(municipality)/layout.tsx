"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileSpreadsheet,
  Truck,
  Droplet,
  BarChart3,
  Building,
  Settings,
  ShieldAlert,
} from "lucide-react";
import { GovHeader } from "@/components/layout/GovHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MUNICIPAL_NAV = [
  { name: "Situation Room", href: "/municipality/dashboard", icon: LayoutDashboard },
  { name: "Incident Triage", href: "/municipality/reports", icon: FileSpreadsheet },
  { name: "Resource Stockpile", href: "/municipality/resources", icon: Truck },
  { name: "Drainage Remediation", href: "/municipality/water-issues", icon: Droplet },
  { name: "Flood Analytics", href: "/municipality/analytics", icon: BarChart3 },
  { name: "Office Settings", href: "/municipality/settings", icon: Settings },
];

export default function MunicipalityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeCity, setActiveCity] = React.useState("Mumbai");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <GovHeader
        portalName={`Municipal Command — ${activeCity} Office`}
        portalRole="municipality"
      />

      {/* Sub-Navigation & Jurisdiction Selector Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-14 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-2 gap-4">
            <nav className="flex items-center space-x-1 sm:space-x-2">
              {MUNICIPAL_NAV.map((item) => {
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

            {/* Multi-City Jurisdiction Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-500 hidden sm:inline">
                Jurisdiction:
              </span>
              <div className="w-36">
                <Select value={activeCity} onValueChange={setActiveCity}>
                  <SelectTrigger className="h-8 text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Delhi">New Delhi</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Kolkata">Kolkata</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
