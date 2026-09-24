"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  AlertTriangle,
  Droplet,
  ShieldCheck,
  MapPin,
  Clock,
  PhoneCall,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SeverityBadge } from "@/components/ui/badge";
import { StatMetric } from "@/components/ui/stat-metric";

export default function CitizenDashboardPage() {
  const { user } = useAuth();
  const district = user?.location?.district || "Mumbai";
  const state = user?.location?.state || "Maharashtra";

  return (
    <div className="space-y-6">
      {/* Citizen Welcome & Status Banner */}
      <div className="border border-slate-300 bg-white p-5 rounded-md shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Citizen Emergency Dashboard
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-xs bg-emerald-100 text-emerald-900 border border-emerald-300">
              <ShieldCheck className="h-3 w-3" />
              Verified Citizen Profile
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950">
            Welcome, {user?.name || "Citizen"}
          </h1>
          <p className="text-xs text-slate-600 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            Registered Location: <strong>{district}, {state}</strong>
            <span className="text-slate-400">|</span>
            Trust Score: <strong className="font-mono text-emerald-800">{user?.trustScore || 750}/1000</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/report-flood">
            <Button variant="default" size="sm">
              <FileText className="h-4 w-4 mr-1.5" />
              Report Flood Incident
            </Button>
          </Link>
          <Link href="/report-water-issue">
            <Button variant="secondary" size="sm">
              <Droplet className="h-4 w-4 mr-1.5" />
              Report Drainage Fault
            </Button>
          </Link>
        </div>
      </div>

      {/* Local District Telemetry KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatMetric
          label={`District Flood Risk (${district})`}
          value="Advisory"
          badge={<SeverityBadge level="advisory" label="Watch Declared" />}
          helperText="Water flow rising in localized lowlands"
          trend={{ direction: "up", value: "Rainfall: 42mm/h", isAdverse: true }}
        />
        <StatMetric
          label="Active Verified Local Alerts"
          value="2"
          unit="Active"
          helperText="Broadcasted by Municipal Disaster Cell"
          trend={{ direction: "neutral", value: "Last update 20m ago" }}
        />
        <StatMetric
          label="Nearest Emergency Shelter"
          value="1.2"
          unit="KM"
          helperText="Municipal High School Shelter, Sector 4"
          trend={{ direction: "down", value: "320 Beds Available" }}
        />
      </div>

      {/* Active Broadcasts for District */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Active Directives for {district}
              </CardTitle>
              <Link href="/alerts" className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline">
                View All Alerts &rarr;
              </Link>
            </div>
            <CardDescription className="text-xs">
              Official alerts issued by Municipal Disaster Management Authority.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="p-3.5 rounded-sm border border-amber-300 bg-amber-50/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <SeverityBadge level="advisory" label="Water Accumulation Advisory" />
                <span className="font-mono text-[10px] text-slate-500">Today, 04:30 UTC</span>
              </div>
              <h4 className="text-xs font-bold text-amber-950">
                Heavy precipitation alert for low-lying coastal roads
              </h4>
              <p className="text-xs text-amber-900 leading-relaxed">
                Municipal pumps deployed at SV Road and Sector 4 underpass. Commuters advised to avoid waterlogged corridors.
              </p>
            </div>

            <div className="p-3.5 rounded-sm border border-slate-200 bg-slate-50 space-y-1.5">
              <div className="flex items-center justify-between">
                <SeverityBadge level="normal" label="Canal Discharge Verified" />
                <span className="font-mono text-[10px] text-slate-500">Today, 02:15 UTC</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Sluice gates opened at North Weir
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Excess reservoir run-off safely diverted to sea. Normal safety perimeter maintained.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Rapid Actions & Emergency Assistance */}
        <Card className="border-slate-300 flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-950">
              <PhoneCall className="h-4 w-4 text-red-600" />
              Emergency Response Assistance
            </CardTitle>
            <CardDescription className="text-xs">
              Direct dispatch access in life-threatening flood situations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="p-3.5 rounded-sm border border-red-200 bg-red-50 text-xs text-red-950 space-y-2">
              <div className="font-bold">TRAINED RESCUERS ON STANDBY</div>
              <p className="leading-relaxed">
                If floodwater is entering your residence or water level exceeds waist depth (1.2m), trigger an immediate SOS signal.
              </p>
              <Link href="/emergency">
                <Button variant="emergency" size="sm" className="w-full mt-1">
                  Trigger Emergency SOS (Broadcast Location)
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="border border-slate-200 rounded-sm p-2 bg-slate-50">
                <div className="text-slate-500 text-[10px] uppercase font-semibold">Disaster Control</div>
                <div className="font-bold text-slate-900 font-mono text-sm">1078 (Toll Free)</div>
              </div>
              <div className="border border-slate-200 rounded-sm p-2 bg-slate-50">
                <div className="text-slate-500 text-[10px] uppercase font-semibold">National Emergency</div>
                <div className="font-bold text-slate-900 font-mono text-sm">112</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
