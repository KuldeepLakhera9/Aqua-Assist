import Link from "next/link";
import {
  ShieldAlert,
  AlertTriangle,
  Building2,
  Users,
  Compass,
  FileText,
  PhoneCall,
  Activity,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SeverityBadge } from "@/components/ui/badge";
import { StatMetric } from "@/components/ui/stat-metric";

export default function HomePage() {
  return (
    <div className="flex-1 bg-slate-50 py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-8 w-full">
      {/* ------------------------------------------------------------- */}
      {/* EXECUTIVE MANDATE & EMERGENCY ALERT BANNER */}
      {/* ------------------------------------------------------------- */}
      <div className="border border-slate-300 bg-white p-6 rounded-md shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="inline-block px-2 py-0.5 rounded-xs bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
              National Disaster Management System
            </span>
            <span className="text-xs text-slate-500 font-mono">PORTAL REF: NDMS-IN-2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Integrated Flood Incident & Crisis Command Center
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Centralized platform for live river basin telemetry, emergency SOS dispatch,
            multi-city municipal resource tracking, and ministerial crisis coordination.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link href="/styleguide">
            <Button variant="default" size="lg" className="w-full sm:w-auto">
              <Layers className="h-4 w-4 mr-2" />
              Review Phase 1 Style Guide
            </Button>
          </Link>
          <a href="tel:1078">
            <Button variant="emergency" size="lg" className="w-full sm:w-auto">
              <PhoneCall className="h-4 w-4 mr-2" />
              National Hotline (1078)
            </Button>
          </a>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* LIVE SITUATION ROOM TELEMETRY */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
            National Operational Readiness & Active Inundation Status
          </h2>
          <span className="text-xs font-mono text-slate-400">Timestamp: 2026-09-24 05:00 UTC</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatMetric
            label="Monitored River Basins"
            value="48"
            unit="Basins"
            helperText="Telemetry active across 12 states"
            trend={{ direction: "neutral", value: "Flow normal" }}
            icon={Activity}
          />
          <StatMetric
            label="Active Inundation Warnings"
            value="3"
            unit="Districts"
            badge={<SeverityBadge level="critical" label="3 Red Zones" />}
            trend={{ direction: "up", value: "+2 in last 6h", isAdverse: true }}
            icon={ShieldAlert}
          />
          <StatMetric
            label="Active Field Rescue Corps"
            value="142"
            unit="Teams"
            helperText="NDRF, SDRF & Municipalities"
            trend={{ direction: "up", value: "94% Mobilized" }}
            icon={Users}
          />
          <StatMetric
            label="Relief Aid Disbursed"
            value="₹4.85"
            unit="Crore"
            helperText="Direct citizen transfers verified"
            trend={{ direction: "up", value: "Audit Cleared" }}
            icon={FileText}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MIGRATION PROGRESSION & PHASE REVIEW GATE */}
      {/* ------------------------------------------------------------- */}
      <Card className="border-slate-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
              Phase 1 Deliverable: Design System & Shared Primitives
            </CardTitle>
            <span className="text-xs font-mono font-semibold uppercase px-2 py-0.5 rounded-xs bg-slate-100 text-slate-700">
              Next.js App Router (TypeScript)
            </span>
          </div>
          <CardDescription>
            The UI has been consolidated into a single authoritative component library (Tailwind CSS + shadcn/ui).
            All legacy Chakra UI, Material UI, and Radix UI fragments are being eliminated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 border border-slate-200 rounded-md bg-slate-50 space-y-1">
              <div className="font-bold text-slate-900 uppercase">Restrained Color Rules</div>
              <p className="text-slate-600">
                Emerald, Amber, Orange, and Red are strictly isolated to actual operational hazard levels.
                No decorative accents distract from live data.
              </p>
            </div>
            <div className="p-3 border border-slate-200 rounded-md bg-slate-50 space-y-1">
              <div className="font-bold text-slate-900 uppercase">WCAG 2.1 AA Compliance</div>
              <p className="text-slate-600">
                Minimum 4.5:1 text contrast ratios, clear keyboard focus indicators, and non-color-only
                status indicators (icon + text).
              </p>
            </div>
            <div className="p-3 border border-slate-200 rounded-md bg-slate-50 space-y-1">
              <div className="font-bold text-slate-900 uppercase">Data-First Layouts</div>
              <p className="text-slate-600">
                High-density metrics, tabular numerical figures (<code className="font-mono">font-mono</code>),
                and unmistakable emergency SOS triggers.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs text-slate-500 font-mono">
              Ready for Phase 1 user review and sign-off
            </span>
            <Link href="/styleguide">
              <Button variant="default" size="sm">
                Explore Component Style Guide &rarr;
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------- */}
      {/* FOUR COMMAND PORTALS PREVIEW (PHASES 2–5 BLUEPRINT) */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Integrated Portal Architecture (All Sharing the Same Design System)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200 hover:border-slate-400 transition-colors">
            <CardHeader className="p-4 pb-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Citizen Portal
              </div>
              <CardTitle className="text-sm">Public Safety & Reporting</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-xs text-slate-600 space-y-2">
              <p>
                Flood reporting with geolocation + dropzone, geofenced alerts, water issues list, and multi-language support.
              </p>
              <div className="font-mono text-[11px] text-slate-400">Routes: /report-flood, /alerts</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:border-slate-400 transition-colors">
            <CardHeader className="p-4 pb-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Municipality Portal
              </div>
              <CardTitle className="text-sm">Multi-City Administration</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-xs text-slate-600 space-y-2">
              <p>
                Field report triage, municipal water pump/boat tracking, localized rainfall analytics, and civic repair responses.
              </p>
              <div className="font-mono text-[11px] text-slate-400">Routes: /municipality/*</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:border-slate-400 transition-colors">
            <CardHeader className="p-4 pb-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Rescuer Command
              </div>
              <CardTitle className="text-sm">First Responder Dispatch</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-xs text-slate-600 space-y-2">
              <p>
                High-contrast mobile interface: active SOS emergency queue, rescue team readiness, field inventory, live telemetry.
              </p>
              <div className="font-mono text-[11px] text-slate-400">Routes: /rescuer/*</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:border-slate-400 transition-colors">
            <CardHeader className="p-4 pb-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                National Command
              </div>
              <CardTitle className="text-sm">Executive Situation Room</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-xs text-slate-600 space-y-2">
              <p>
                AI verification dashboard, national resource stockpile tracking, financial relief audit, and predictive risk models.
              </p>
              <div className="font-mono text-[11px] text-slate-400">Routes: /admin/*</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
