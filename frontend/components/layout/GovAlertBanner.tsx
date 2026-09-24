"use client";

import * as React from "react";
import Link from "next/link";
import { AlertOctagon, PhoneCall, MapPin, X, Radio, ArrowRight } from "lucide-react";
import { useSocket } from "@/contexts/SocketContext";
import { Button } from "@/components/ui/button";

export function GovAlertBanner() {
  const { activeBroadcast, dismissBroadcast, isConnected } = useSocket();

  if (!activeBroadcast) {
    return null;
  }

  const isCritical = activeBroadcast.severity === "critical";

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`relative border-b z-50 text-xs px-4 py-2.5 transition-all shadow-md ${
        isCritical
          ? "bg-red-950 text-red-50 border-red-800"
          : "bg-amber-950 text-amber-50 border-amber-800"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Emergency Alert Content */}
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-600 animate-pulse text-white">
            <AlertOctagon className="h-3.5 w-3.5" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono font-bold tracking-wider uppercase text-[10px] px-1.5 py-0.5 rounded bg-red-600 text-white">
              {activeBroadcast.type || "NATIONAL EMERGENCY"}
            </span>

            <span className="font-bold text-white tracking-wide">
              {activeBroadcast.message}
            </span>

            {activeBroadcast.location?.address && (
              <span className="text-red-200 text-[11px] flex items-center gap-1 font-mono">
                <MapPin className="h-3 w-3 inline text-red-400" />
                {activeBroadcast.location.address}
              </span>
            )}
          </div>
        </div>

        {/* Right: Quick Response Actions */}
        <div className="flex items-center gap-2 shrink-0 ml-7 md:ml-0">
          <Link href="/map">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] font-bold bg-red-900 hover:bg-red-800 text-white border-red-700"
            >
              Open Tactical Map
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>

          <a href="tel:1078">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] font-bold bg-white text-red-950 hover:bg-red-50 border-white"
            >
              <PhoneCall className="h-3 w-3 mr-1 text-red-700" />
              1078
            </Button>
          </a>

          <button
            onClick={dismissBroadcast}
            aria-label="Dismiss alert broadcast"
            className="p-1 rounded text-red-300 hover:text-white hover:bg-red-900/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
