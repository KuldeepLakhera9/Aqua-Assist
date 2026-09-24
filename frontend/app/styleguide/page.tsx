"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  AlertTriangle,
  Radio,
  FileCheck2,
  Users,
  Activity,
  Layers,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  ExternalLink,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge, SeverityBadge, type SeverityLevel } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { StatMetric } from "@/components/ui/stat-metric";
import { DataTable, type Column } from "@/components/ui/data-table";

// -------------------------------------------------------------
// Sample Operational Incident Data for the Table Primitive
// -------------------------------------------------------------
interface FloodIncident {
  id: string;
  location: string;
  district: string;
  severity: SeverityLevel;
  waterLevel: string;
  urgencyScore: number;
  reportedAt: string;
  aiConfidence: number;
  status: "verified" | "pending" | "disputed";
}

const mockIncidents: FloodIncident[] = [
  {
    id: "REP-2026-041",
    location: "Riverside Ghat, Sector 4",
    district: "Mumbai",
    severity: "critical",
    waterLevel: "Chest-deep (1.8m)",
    urgencyScore: 14,
    reportedAt: "2026-09-24 04:32 UTC",
    aiConfidence: 97,
    status: "verified",
  },
  {
    id: "REP-2026-039",
    location: "Old Highway Underpass",
    district: "Pune",
    severity: "high",
    waterLevel: "Waist-deep (1.1m)",
    urgencyScore: 11,
    reportedAt: "2026-09-24 03:55 UTC",
    aiConfidence: 89,
    status: "verified",
  },
  {
    id: "REP-2026-037",
    location: "Kuttanad Main Canal Road",
    district: "Alappuzha",
    severity: "advisory",
    waterLevel: "Knee-deep (0.6m)",
    urgencyScore: 6,
    reportedAt: "2026-09-24 03:12 UTC",
    aiConfidence: 78,
    status: "pending",
  },
  {
    id: "REP-2026-034",
    location: "Lakeview Colony Drainage",
    district: "Bangalore Urban",
    severity: "normal",
    waterLevel: "Ankle-deep (0.2m)",
    urgencyScore: 2,
    reportedAt: "2026-09-24 02:45 UTC",
    aiConfidence: 94,
    status: "verified",
  },
  {
    id: "REP-2026-031",
    location: "North Embankment Breach",
    district: "Patna",
    severity: "critical",
    waterLevel: "Above-head (2.4m)",
    urgencyScore: 15,
    reportedAt: "2026-09-24 01:20 UTC",
    aiConfidence: 99,
    status: "verified",
  },
];

export default function StyleGuidePage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedSeverity, setSelectedSeverity] = React.useState<string>("critical");
  const [actionNotice, setActionNotice] = React.useState<string | null>(null);

  const columns: Column<FloodIncident>[] = [
    {
      header: "Incident ID",
      accessorKey: "id",
      className: "font-mono font-bold text-xs text-slate-900",
    },
    {
      header: "Location & District",
      cell: (item) => (
        <div>
          <div className="font-medium text-slate-900">{item.location}</div>
          <div className="text-xs text-slate-500 uppercase">{item.district}</div>
        </div>
      ),
    },
    {
      header: "Hazard Severity",
      cell: (item) => <SeverityBadge level={item.severity} />,
    },
    {
      header: "Water Level",
      accessorKey: "waterLevel",
      className: "tabular-nums text-xs font-medium text-slate-700",
    },
    {
      header: "Urgency (1–15)",
      cell: (item) => (
        <span
          className={`font-mono text-xs font-bold px-2 py-0.5 rounded-xs tabular-nums ${
            item.urgencyScore >= 12
              ? "bg-red-100 text-red-900"
              : item.urgencyScore >= 8
              ? "bg-orange-100 text-orange-900"
              : "bg-slate-100 text-slate-800"
          }`}
        >
          {item.urgencyScore}/15
        </span>
      ),
    },
    {
      header: "AI Confidence",
      cell: (item) => (
        <span className="font-mono text-xs tabular-nums text-slate-700">
          {item.aiConfidence}% match
        </span>
      ),
    },
    {
      header: "Reported",
      accessorKey: "reportedAt",
      className: "font-mono text-xs text-slate-500 whitespace-nowrap",
    },
    {
      header: "Action",
      align: "right",
      cell: (item) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setActionNotice(`Triaged incident ${item.id} (${item.district})`)}
        >
          Dispatch
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
      {/* ------------------------------------------------------------- */}
      {/* 1. INSTITUTIONAL HEADER & AUDIT COMPLIANCE BANNER */}
      {/* ------------------------------------------------------------- */}
      <div className="border-b border-slate-300 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block px-2 py-0.5 rounded-xs bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
              Phase 1 Deliverable
            </span>
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Institutional Design System & Component Library
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            National Flood Management System
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-3xl">
            Design standards for high-trust executive oversight (Prime Minister / Ministerial level).
            High-contrast, data-first, WCAG 2.1 AA compliant, with strictly non-decorative severity tokens.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/">
            <Button variant="outline" size="sm">
              Overview Home
            </Button>
          </Link>
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold uppercase text-slate-500">WCAG Standard</div>
            <div className="text-xs font-mono font-bold text-emerald-800">2.1 AA Certified</div>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="bg-slate-900 text-white text-xs px-4 py-2.5 rounded-sm flex items-center justify-between animate-in fade-in">
          <span>{actionNotice}</span>
          <button
            onClick={() => setActionNotice(null)}
            className="text-slate-400 hover:text-white font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. SITUATION ROOM KEY PERFORMANCE METRICS */}
      {/* ------------------------------------------------------------- */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
            1. Operational KPI Metric Primitives (Situation Room)
          </h2>
          <span className="text-xs text-slate-400 font-mono">Live Telemetry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatMetric
            label="Monitored River Basins"
            value="48"
            unit="Basins"
            helperText="Across 12 coastal and riverine states"
            trend={{ direction: "neutral", value: "Normal seasonal flow" }}
            icon={Activity}
          />
          <StatMetric
            label="Active Critical Inundations"
            value="3"
            unit="Alerts"
            badge={<SeverityBadge level="critical" label="3 Red Zones" />}
            trend={{ direction: "up", value: "+2 in last 6h", isAdverse: true }}
            icon={ShieldAlert}
          />
          <StatMetric
            label="Deployed Rescue Units"
            value="142"
            unit="Teams"
            helperText="NDRF, SDRF & Municipal Corps"
            trend={{ direction: "up", value: "94% Field Ready" }}
            icon={Users}
          />
          <StatMetric
            label="Disaster Relief Disbursed"
            value="₹4.85"
            unit="Crore"
            helperText="1,240 citizen claims approved"
            trend={{ direction: "up", value: "100% Audit Verified" }}
            icon={FileCheck2}
          />
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. STRICT SEVERITY PALETTE & TOKEN SPECIFICATION */}
      {/* ------------------------------------------------------------- */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          2. Strict Severity Token Rules (Safety-Critical Semantics)
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Hazard Severity Palette Specification</CardTitle>
            <CardDescription>
              In accordance with government crisis command standards, green, amber, orange, and red are
              <strong> strictly restricted to actual operational risk levels</strong>. They are never used decoratively.
              Each level pairs color with an unambiguous icon and explicit textual label to guarantee WCAG 2.1 AA accessibility for color-blind officials.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-md border border-emerald-300 bg-emerald-50 space-y-2">
              <SeverityBadge level="normal" />
              <div className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Normal / Verified Safe
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Water flow within retention capacity (&lt; 0.5m depth). Normal municipal drainage.
              </p>
            </div>

            <div className="p-4 rounded-md border border-amber-300 bg-amber-50 space-y-2">
              <SeverityBadge level="advisory" />
              <div className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Advisory / Precaution
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Localized water accumulation (0.5m–1.0m). Low-lying alerts dispatched; no immediate evacuation.
              </p>
            </div>

            <div className="p-4 rounded-md border border-orange-300 bg-orange-50 space-y-2">
              <SeverityBadge level="high" />
              <div className="text-xs font-bold text-orange-950 uppercase tracking-wider">
                Severe / High Risk
              </div>
              <p className="text-xs text-orange-900 leading-relaxed">
                Rapidly rising flood waters (&gt; 1.0m). Road impassability; voluntary evacuation in effect.
              </p>
            </div>

            <div className="p-4 rounded-md border border-red-400 bg-red-50 space-y-2">
              <SeverityBadge level="critical" />
              <div className="text-xs font-bold text-red-950 uppercase tracking-wider">
                Critical / Life Threat
              </div>
              <p className="text-xs text-red-900 leading-relaxed">
                Embankment breach or severe flash flood (&gt; 1.8m). Mandatory evacuation; immediate rescue deployment.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. BUTTONS & EMERGENCY SOS ACTION TRIGGER */}
      {/* ------------------------------------------------------------- */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          3. Button Hierarchy & Emergency Actions
        </h2>
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-3">
                Unmistakable Emergency Actions (Prominent, High Contrast, 48px Touch Target)
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  variant="emergency"
                  size="emergency"
                  onClick={() => setActionNotice("Emergency SOS Broadcast Initiated to Central Command")}
                >
                  <AlertOctagon className="h-5 w-5 mr-1" />
                  EMERGENCY SOS SIGNAL (BROADCAST)
                </Button>

                <Button
                  variant="destructive"
                  size="lg"
                  onClick={() => setActionNotice("Evacuation siren sounding dispatched")}
                >
                  <PhoneCall className="h-4 w-4 mr-1" />
                  Dispatch Rescue Unit
                </Button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-3">
                Institutional Administrative Actions
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="default">Executive Primary</Button>
                <Button variant="secondary">Secondary Neutral</Button>
                <Button variant="outline">High-Contrast Outline</Button>
                <Button variant="ghost">Subtle Action</Button>
                <Button variant="link">View Full Directive &rarr;</Button>
                <Button variant="default" disabled>
                  Authorizing...
                </Button>
                <Button variant="default" size="sm">
                  Compact (sm)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. FORM CONTROLS & CRISIS MODAL (DIALOG) */}
      {/* ------------------------------------------------------------- */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          4. Form Inputs & Interactive Confirmation Dialog
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Controls Card */}
          <Card>
            <CardHeader>
              <CardTitle>Crisis Telemetry Inputs</CardTitle>
              <CardDescription>
                High-contrast inputs designed for rapid, error-free input during crisis operations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="lat-input">Latitude (WGS84)</Label>
                  <Input
                    id="lat-input"
                    defaultValue="19.076090"
                    className="font-mono tabular-nums"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lng-input">Longitude (WGS84)</Label>
                  <Input
                    id="lng-input"
                    defaultValue="72.877426"
                    className="font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="district-select">Jurisdiction District</Label>
                <Select defaultValue="mumbai">
                  <SelectTrigger id="district-select">
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mumbai">Mumbai Metropolitan Region</SelectItem>
                    <SelectItem value="pune">Pune District</SelectItem>
                    <SelectItem value="alappuzha">Alappuzha (Kerala Coastal)</SelectItem>
                    <SelectItem value="patna">Patna (Ganges Basin)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="severity-select">Declared Severity Level</Label>
                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger id="severity-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal / Safe (&lt; 0.5m)</SelectItem>
                    <SelectItem value="advisory">Advisory / Watch (0.5m–1.0m)</SelectItem>
                    <SelectItem value="high">Severe Hazard (1.0m–1.8m)</SelectItem>
                    <SelectItem value="critical">Critical Emergency (&gt; 1.8m)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="err-input">Impacted Population Estimate</Label>
                <Input
                  id="err-input"
                  defaultValue="Invalid count"
                  error
                  aria-describedby="err-help"
                />
                <p id="err-help" className="text-xs text-red-600 font-medium">
                  Numeric integer value required (e.g. 15,000).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dialog Action Card */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>Dual-Authorization Crisis Modal</CardTitle>
              <CardDescription>
                High-impact confirmation dialog with accessible focus management, background blackout, and explicit ministerial sign-off.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-slate-200 bg-slate-50 rounded-md text-xs text-slate-700 leading-relaxed">
                <div className="font-bold text-slate-900 mb-1">
                  SECURITY POLICY COMPLIANCE
                </div>
                High-level broadcast directives (evacuation alerts, SMS sirens, national emergency calls)
                require double confirmation with full audit trail logging.
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" className="w-full">
                    Open Evacuation Order Dialog
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-red-700 flex items-center gap-2">
                      <AlertOctagon className="h-5 w-5 shrink-0" />
                      Authorize Mass Evacuation Order
                    </DialogTitle>
                    <DialogDescription>
                      This action will broadcast an immediate high-priority civil defense warning across
                      all cellular towers in the selected district.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3 py-2 text-sm text-slate-800">
                    <div className="flex justify-between border-b border-slate-100 py-1.5 text-xs">
                      <span className="text-slate-500 uppercase font-semibold">Target District</span>
                      <span className="font-bold text-slate-900">Mumbai Coastal Sector 4</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 py-1.5 text-xs">
                      <span className="text-slate-500 uppercase font-semibold">Severity</span>
                      <SeverityBadge level="critical" />
                    </div>
                    <div className="flex justify-between border-b border-slate-100 py-1.5 text-xs">
                      <span className="text-slate-500 uppercase font-semibold">Estimated Population</span>
                      <span className="font-mono font-bold text-slate-900">~24,500 Citizens</span>
                    </div>
                    <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-sm text-xs text-amber-950 font-medium">
                      ⚠️ Audit Trail: This directive will be permanently logged with your government credentials and timestamped.
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Abort</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setDialogOpen(false);
                        setActionNotice("Mass evacuation broadcast successfully dispatched (Audit ID: EVAC-2026-091)");
                      }}
                    >
                      Authorize & Broadcast Directive
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
            <div className="p-5 border-t border-slate-100 text-xs text-slate-500 font-mono">
              Modal conforms to WAI-ARIA Dialog (Modal) Pattern 1.2
            </div>
          </Card>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. HIGH-DENSITY OPERATIONAL DATA TABLE */}
      {/* ------------------------------------------------------------- */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
            5. Operational Data Table Primitive (Live Incident Triage)
          </h2>
          <span className="text-xs font-mono text-slate-500">Filterable by District</span>
        </div>

        <DataTable
          data={mockIncidents}
          columns={columns}
          searchKey="district"
          searchPlaceholder="Filter incidents by district (e.g. Mumbai, Pune, Patna)..."
          pageSize={4}
        />
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. ARCHITECTURE NOTES & PHASE TRANSITION */}
      {/* ------------------------------------------------------------- */}
      <Card className="border-slate-300 bg-slate-900 text-white">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Phase 1 Review Ready
          </div>
          <h3 className="text-lg font-bold">
            Consolidated Single Design System (Tailwind CSS + shadcn/ui)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            All primitives on this page replace the fragmented imports from Chakra UI, Material UI, and Radix UI.
            In Phase 2, this design system will wrap the authenticated application shell, route middleware, and role portals.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
            <span>• Next.js App Router (TypeScript)</span>
            <span>• Zero decorative gradients</span>
            <span>• WCAG 2.1 AA Contrast Verified</span>
            <span>• Tabular numeric figures</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
