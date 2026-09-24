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
  Radio,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GovHeaderProps {
  portalName: string;
  portalRole?: "admin" | "municipality" | "rescuer" | "citizen";
}

export function GovHeader({ portalName, portalRole = "citizen" }: GovHeaderProps) {
  const { user, logout, loginWithDemoRole } = useAuth();
  const { isConnected, liveAlerts, simulateAlert } = useSocket();
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const [language, setLanguage] = React.useState<"EN" | "HI" | "MR">("EN");
  const [simMenuOpen, setSimMenuOpen] = React.useState(false);
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

          {/* Right: Telemetry, Role Switcher, Alerts Popover, User Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Live Socket Status */}
            <div
              className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 border border-slate-200 font-mono text-[10px]"
              title={isConnected ? "WebSocket Connected to Port 5003" : "Connecting to Emergency Telemetry Hub..."}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400 animate-ping"
                }`}
              />
              <span className="text-slate-700 font-semibold">
                {isConnected ? "TELEMETRY LIVE" : "CONNECTING"}
              </span>
            </div>

            {/* Simulation Menu (Crisis Demo Mode) */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSimMenuOpen(!simMenuOpen)}
                className="h-8 text-xs font-mono font-semibold border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 hidden sm:inline-flex items-center gap-1"
                title="Trigger simulated emergency broadcast across all portals"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>Simulate Alert</span>
              </Button>

              {simMenuOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white rounded border border-slate-300 shadow-xl p-2 z-50 text-xs space-y-1">
                  <div className="font-bold text-slate-800 text-[10px] uppercase font-mono px-2 py-1 border-b border-slate-100">
                    Live Broadcast Simulation
                  </div>
                  <button
                    onClick={() => {
                      simulateAlert("SOS");
                      setSimMenuOpen(false);
                    }}
                    className="w-full text-left p-2 rounded hover:bg-red-50 text-red-900 font-medium text-xs flex items-center justify-between"
                  >
                    <span>🔴 Flash Citizen SOS (Kurla)</span>
                  </button>
                  <button
                    onClick={() => {
                      simulateAlert("GAUGE");
                      setSimMenuOpen(false);
                    }}
                    className="w-full text-left p-2 rounded hover:bg-amber-50 text-amber-900 font-medium text-xs flex items-center justify-between"
                  >
                    <span>⚠️ CWC River Gauge Breach (4.82m)</span>
                  </button>
                  <button
                    onClick={() => {
                      simulateAlert("WEATHER");
                      setSimMenuOpen(false);
                    }}
                    className="w-full text-left p-2 rounded hover:bg-blue-50 text-blue-900 font-medium text-xs flex items-center justify-between"
                  >
                    <span>🌧️ IMD Cloudburst Warning</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Role Switcher */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-sm border border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase px-1">Role:</span>
              <button
                onClick={() => loginWithDemoRole("admin")}
                className={`px-1.5 py-0.5 rounded-xs text-[11px] font-medium transition-colors ${
                  user?.role === "admin" ? "bg-slate-900 text-white font-bold" : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => loginWithDemoRole("municipality")}
                className={`px-1.5 py-0.5 rounded-xs text-[11px] font-medium transition-colors ${
                  user?.role === "municipality" ? "bg-slate-900 text-white font-bold" : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                Muni
              </button>
              <button
                onClick={() => loginWithDemoRole("rescuer")}
                className={`px-1.5 py-0.5 rounded-xs text-[11px] font-medium transition-colors ${
                  user?.role === "rescuer" ? "bg-slate-900 text-white font-bold" : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                Rescuer
              </button>
              <button
                onClick={() => loginWithDemoRole("citizen")}
                className={`px-1.5 py-0.5 rounded-xs text-[11px] font-medium transition-colors ${
                  user?.role === "citizen" || user?.role === "user" ? "bg-slate-900 text-white font-bold" : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                Citizen
              </button>
            </div>

            {/* Language Switcher */}
            <div className="hidden md:flex items-center border border-slate-200 rounded text-[11px] font-semibold bg-white p-0.5 font-mono">
              {(["EN", "HI", "MR"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    language === lang ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="h-4 w-4" />
                {liveAlerts.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600 animate-ping" />
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded border border-slate-300 shadow-xl p-3 z-50 text-xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 font-mono text-[11px] uppercase">
                      Emergency Alert Center ({liveAlerts.length})
                    </span>
                    <Link
                      href="/notifications"
                      onClick={() => setNotificationOpen(false)}
                      className="text-blue-700 hover:underline text-[10px]"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {liveAlerts.length === 0 ? (
                      <div className="text-center py-4 text-slate-500 text-[11px]">
                        No active distress broadcasts. System normal.
                      </div>
                    ) : (
                      liveAlerts.map((alert, i) => (
                        <div key={alert.id || i} className="p-2 rounded bg-red-50/70 border border-red-200 text-slate-800">
                          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-red-800">
                            <span>{alert.type}</span>
                            <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <div className="font-semibold text-[11px] mt-0.5 text-slate-900">{alert.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated User pill */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
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
