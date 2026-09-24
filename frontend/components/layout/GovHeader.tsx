"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Building2,
  LifeBuoy,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  PhoneCall,
  Activity,
  Layers,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GovHeaderProps {
  portalName: string;
  portalRole?: "admin" | "municipality" | "rescuer" | "citizen";
}

export function GovHeader({ portalName, portalRole = "citizen" }: GovHeaderProps) {
  const { user, logout, loginWithDemoRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const roleConfigs = {
    admin: {
      badge: "National Command",
      badgeClass: "bg-slate-900 text-white border-slate-700",
      icon: Shield,
    },
    municipality: {
      badge: "Municipal Officer",
      badgeClass: "bg-blue-900 text-white border-blue-700",
      icon: Building2,
    },
    rescuer: {
      badge: "NDRF First Responder",
      badgeClass: "bg-amber-900 text-white border-amber-700",
      icon: LifeBuoy,
    },
    citizen: {
      badge: "Citizen Reporter",
      badgeClass: "bg-slate-800 text-white border-slate-600",
      icon: User,
    },
  };

  const config = roleConfigs[portalRole] || roleConfigs.citizen;
  const RoleIcon = config.icon;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Left: Branding & Portal Name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group select-none">
              <div className="h-8 w-8 rounded-sm bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-slate-800 transition-colors">
                ND
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-950">
                  National Disaster Portal
                </div>
                <div className="text-[10px] text-slate-500 font-mono leading-none">
                  CRISIS RESPONSE SYSTEM
                </div>
              </div>
            </Link>

            <span className="text-slate-300 hidden sm:inline">|</span>

            {/* Current Active Portal Identity */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wide text-slate-900">
                {portalName}
              </span>
              <span
                className={`hidden md:inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs border ${config.badgeClass}`}
              >
                {config.badge}
              </span>
            </div>
          </div>

          {/* Right: Quick Role Switcher, Telemetry status, User Profile, Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Role Switcher for Executive Review */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-sm border border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5">
                Switch Role:
              </span>
              <button
                onClick={() => loginWithDemoRole("admin")}
                className={`px-2 py-0.5 rounded-xs text-[11px] font-medium transition-colors ${
                  user?.role === "admin"
                    ? "bg-slate-900 text-white font-bold"
                    : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => loginWithDemoRole("municipality")}
                className={`px-2 py-0.5 rounded-xs text-[11px] font-medium transition-colors ${
                  user?.role === "municipality"
                    ? "bg-slate-900 text-white font-bold"
                    : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                Municipality
              </button>
              <button
                onClick={() => loginWithDemoRole("rescuer")}
                className={`px-2 py-0.5 rounded-xs text-[11px] font-medium transition-colors ${
                  user?.role === "rescuer"
                    ? "bg-slate-900 text-white font-bold"
                    : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                Rescuer
              </button>
              <button
                onClick={() => loginWithDemoRole("citizen")}
                className={`px-2 py-0.5 rounded-xs text-[11px] font-medium transition-colors ${
                  user?.role === "citizen" || user?.role === "user"
                    ? "bg-slate-900 text-white font-bold"
                    : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                Citizen
              </button>
            </div>

            <Link href="/styleguide" className="hidden sm:inline-block">
              <Button variant="ghost" size="sm" className="text-xs text-slate-600">
                <Layers className="h-3.5 w-3.5 mr-1" />
                Style Guide
              </Button>
            </Link>

            {/* Authenticated User pill */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[140px]">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">
                    {user.location?.district || user.role}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="h-8 text-xs text-slate-700 hover:text-red-700 hover:border-red-300"
                  title="Logout Session"
                >
                  <LogOut className="h-3.5 w-3.5 sm:mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
