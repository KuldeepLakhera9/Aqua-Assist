"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Bot,
  Truck,
  Banknote,
  Users,
  LineChart,
  Building,
  FileCheck2,
  Download,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { StatMetric } from "@/components/ui/stat-metric";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";

const COMMAND_MODULES = [
  {
    title: "AI Report Verification",
    description: "Multimodal computer vision pipeline validating crowd-sourced flood photos against satellite SAR imagery.",
    icon: Bot,
    href: "/admin/verification",
    tag: "38 Pending Review",
    tagVariant: "warning",
  },
  {
    title: "Financial Relief Grants",
    description: "Disaster ex-gratia compensation and direct benefit transfer (DBT) verification & audit ledger.",
    icon: Banknote,
    href: "/admin/financial-aid",
    tag: "₹ 14.8 Cr In Triage",
    tagVariant: "info",
  },
  {
    title: "Inter-Agency Resources",
    description: "Real-time heavy machinery, de-watering pumps, inflatable boats, and medical cache inventory tracking.",
    icon: Truck,
    href: "/admin/resources",
    tag: "94% Asset Readiness",
    tagVariant: "success",
  },
  {
    title: "Personnel & Access Control",
    description: "RBAC privilege delegation for NDRF commanders, municipal engineers, and certified volunteers.",
    icon: Users,
    href: "/admin/users",
    tag: "2,410 Operators",
    tagVariant: "neutral",
  },
  {
    title: "Predictive Inundation Analytics",
    description: "Hydrological basin models, river discharge telemetry, and IMD Doppler weather radar projections.",
    icon: LineChart,
    href: "/admin/analytics",
    tag: "48h Forecast Active",
    tagVariant: "info",
  },
  {
    title: "Municipal Command Network",
    description: "Centralized overview of municipal ward situation rooms across major urban centers.",
    icon: Building,
    href: "/municipality/dashboard",
    tag: "6 Municipalities Live",
    tagVariant: "success",
  },
];

const RECENT_INCIDENTS = [
  {
    id: "INC-2026-0811",
    district: "Mumbai Suburban",
    location: "Mithi River - Kranti Nagar",
    hazard: "River Overtopping (Danger Mark +1.4m)",
    severity: "critical" as const,
    deployedUnits: "NDRF Bn 04 (3 Teams)",
    status: "Active Containment",
    time: "14 mins ago",
  },
  {
    id: "INC-2026-0810",
    district: "Thane",
    location: "Ghodbunder Road Arterial",
    hazard: "Submerged Highway & Landslip Risk",
    severity: "high" as const,
    deployedUnits: "Traffic Police & PWD Engineers",
    status: "Traffic Diverted",
    time: "42 mins ago",
  },
  {
    id: "INC-2026-0809",
    district: "Raigad",
    location: "Mahad Savitri Basin",
    hazard: "Flash Inundation Warning",
    severity: "critical" as const,
    deployedUnits: "SDRF Alpha Unit",
    status: "Evacuation Underway",
    time: "1h 12m ago",
  },
  {
    id: "INC-2026-0808",
    district: "Pune",
    location: "Khadakwasla Dam Spillway",
    hazard: "Controlled Discharge (42,000 cusecs)",
    severity: "advisory" as const,
    deployedUnits: "Irrigation Dept & Local Police",
    status: "Downstream Sirens Sounded",
    time: "2h 30m ago",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner / Executive Briefing Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              National Situation Room & Crisis Command
            </h1>
            <Badge variant="outline" className="border-slate-300 bg-white text-slate-700 text-xs font-mono">
              NDMA HQ / OPS-ROOM
            </Badge>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Ministerial-level situational intelligence, inter-agency resource mobilization, and disaster relief oversight.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-xs h-9 border-slate-300"
            onClick={() => alert("Generating NDMA National SitRep (Situation Report) PDF summary...")}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export National SitRep
          </Button>
          <Button
            variant="destructive"
            className="text-xs h-9 font-semibold"
            onClick={() => alert("Opening Multi-Channel National Public Warning System broadcast console...")}
          >
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
            Issue National Broadcast
          </Button>
        </div>
      </div>

      {/* Top National Strategic KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatMetric
          label="Verified Flood Incidents"
          value="1,428"
          unit="sites"
          icon={ShieldAlert}
          trend={{ direction: "up", value: "+8.4% (24h)", isAdverse: true }}
          helperText="312 high-hazard zones mapped"
        />
        <StatMetric
          label="Evacuated Citizens Sheltered"
          value="48,290"
          unit="citizens"
          icon={Users}
          trend={{ direction: "up", value: "+4,120 today" }}
          helperText="142 relief camps active"
        />
        <StatMetric
          label="Relief Funds Disbursed"
          value="₹ 42.6"
          unit="Crore"
          icon={Banknote}
          trend={{ direction: "up", value: "91% verified DBT" }}
          helperText="Aadhaar-linked ex-gratia"
        />
        <StatMetric
          label="Battalions Mobilized"
          value="36"
          unit="units"
          icon={Truck}
          trend={{ direction: "neutral", value: "NDRF / SDRF / Army" }}
          helperText="100% operational readiness"
        />
      </div>

      {/* Ministerial Command Modules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Executive Command Modules
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Direct Access to Core Disaster Pipelines
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMMAND_MODULES.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.title}
                href={module.href}
                className="group block rounded-md border border-slate-200 bg-white p-5 hover:border-slate-400 hover:shadow-xs transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="h-9 w-9 rounded bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-[11px] font-mono">
                    {module.tag}
                  </Badge>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1 group-hover:text-blue-700">
                    {module.title}
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                    {module.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Multi-Agency Incident Command Triage Table */}
      <Card className="border-slate-200">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Active National Critical Incidents
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-agency triage requiring state or national level intervention.
            </p>
          </div>
          <Link
            href="/admin/verification"
            className="text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
          >
            Review all verified reports <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Incident ID</th>
                  <th className="px-4 py-3">District / Sector</th>
                  <th className="px-4 py-3">Hazard Description</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Forces Mobilized</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RECENT_INCIDENTS.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {inc.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{inc.location}</div>
                      <div className="text-slate-500 text-[11px]">{inc.district}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                      {inc.hazard}
                    </td>
                    <td className="px-4 py-3">
                      <SeverityBadge level={inc.severity} />
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-800">
                      {inc.deployedUnits}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-900 text-[10px] font-mono">
                        {inc.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-500">
                      {inc.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
