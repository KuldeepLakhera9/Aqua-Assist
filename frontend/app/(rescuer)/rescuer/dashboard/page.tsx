"use client";

import * as React from "react";
import {
  Radio,
  Users,
  LifeBuoy,
  Clock,
  MapPin,
  PhoneCall,
  CheckCircle2,
  AlertOctagon,
  ShieldAlert,
  ArrowUpRight,
  Send,
} from "lucide-react";
import { StatMetric } from "@/components/ui/stat-metric";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";

interface DistressCall {
  id: string;
  location: string;
  landmark: string;
  peopleCount: number;
  waterLevel: string;
  severity: "critical" | "high" | "advisory";
  timestamp: string;
  contactNumber: string;
  assignedTeam?: string;
  status: "pending" | "dispatched" | "rescued";
}

const INITIAL_DISTRESS_CALLS: DistressCall[] = [
  {
    id: "SOS-8921",
    location: "Kurla West, Ward L",
    landmark: "Near Sheetal Cinema, Ground Floor Residence",
    peopleCount: 6,
    waterLevel: "4.8 ft (Rising)",
    severity: "critical",
    timestamp: "6 mins ago",
    contactNumber: "+91 98201 44321",
    status: "pending",
  },
  {
    id: "SOS-8919",
    location: "Hindmata Junction, Dadar",
    landmark: "Bus Depot Shelter, Senior Citizens Stranded",
    peopleCount: 12,
    waterLevel: "3.5 ft",
    severity: "high",
    timestamp: "18 mins ago",
    contactNumber: "+91 98204 88712",
    assignedTeam: "Team Alpha (Zodiac-2)",
    status: "dispatched",
  },
  {
    id: "SOS-8915",
    location: "Milan Subway, Santacruz",
    landmark: "Commercial Truck Submerged in Underpass",
    peopleCount: 2,
    waterLevel: "6.0 ft",
    severity: "critical",
    timestamp: "24 mins ago",
    contactNumber: "+91 97110 55431",
    assignedTeam: "Team Bravo (Rapid Ex)",
    status: "dispatched",
  },
  {
    id: "SOS-8908",
    location: "Sion Circle",
    landmark: "Residential Society Ground Floor",
    peopleCount: 4,
    waterLevel: "2.8 ft",
    severity: "advisory",
    timestamp: "42 mins ago",
    contactNumber: "+91 98199 00122",
    status: "pending",
  },
];

const TEAMS_STATUS = [
  {
    name: "NDRF Battalion 04 - Alpha",
    equipment: "3x Inflatable Zodiacs, Medical Kit, Satellite Comms",
    zone: "Ward L (Kurla - Chunabhatti)",
    personnel: 12,
    status: "Dispatched (SOS-8919)",
    readiness: "engaged",
  },
  {
    name: "SDRF Rapid Extraction - Bravo",
    equipment: "Amphibious Vehicle (ARV-1), Winch Rig, Diver Unit",
    zone: "Western Corridor (Santacruz - Bandra)",
    personnel: 8,
    status: "Dispatched (SOS-8915)",
    readiness: "engaged",
  },
  {
    name: "Civil Defense Rescuers - Charlie",
    equipment: "2x High-Clearance TATS, Lifejackets (50), Floatation Ropes",
    zone: "Central Staging Base (Dadar)",
    personnel: 15,
    status: "Standby Ready",
    readiness: "available",
  },
  {
    name: "Coast Guard Helo Recon - Delta",
    equipment: "Air Rescue ALH Dhruv, Thermal Cam, Winch Stretcher",
    zone: "Coastal & Estuary Overflight",
    personnel: 5,
    status: "On Flight Patrol",
    readiness: "airborne",
  },
];

export default function RescuerDashboardPage() {
  const [distressCalls, setDistressCalls] = React.useState<DistressCall[]>(INITIAL_DISTRESS_CALLS);
  const [selectedCall, setSelectedCall] = React.useState<DistressCall | null>(null);

  const handleDispatch = (id: string) => {
    setDistressCalls((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: "dispatched", assignedTeam: "Civil Defense Charlie" }
          : c
      )
    );
  };

  const handleResolve = (id: string) => {
    setDistressCalls((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "rescued" } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Field Operations & Emergency Triage Command
            </h1>
            <Badge variant="outline" className="border-red-300 bg-red-50 text-red-800 text-xs font-mono uppercase">
              LIVE RADAR
            </Badge>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Real-time emergency SOS distress triage, tactical boat assignment, and field unit telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-xs h-9 border-slate-300">
            <Radio className="h-3.5 w-3.5 mr-1.5 text-blue-600 animate-pulse" />
            Tactical Freq: 156.800 MHz
          </Button>
          <Button variant="destructive" className="text-xs h-9 font-semibold">
            <AlertOctagon className="h-3.5 w-3.5 mr-1.5" />
            Issue Flash Extraction Order
          </Button>
        </div>
      </div>

      {/* Responder Tactical Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatMetric
          label="Active SOS Distress Calls"
          value="4"
          unit="calls"
          icon={PhoneCall}
          trend={{ direction: "up", value: "+2 in last 30m", isAdverse: true }}
          helperText="2 awaiting unit dispatch"
        />
        <StatMetric
          label="Field Responders Deployed"
          value="40"
          unit="personnel"
          icon={Users}
          trend={{ direction: "neutral", value: "4 battalions" }}
          helperText="12 boats in active water"
        />
        <StatMetric
          label="Citizens Evacuated (24h)"
          value="184"
          unit="persons"
          icon={LifeBuoy}
          trend={{ direction: "up", value: "+34 since 06:00" }}
          helperText="Zero casualties recorded"
        />
        <StatMetric
          label="Median Response Time"
          value="11.4"
          unit="minutes"
          icon={Clock}
          trend={{ direction: "down", value: "-1.8m improved" }}
          helperText="Target: < 15.0 mins"
        />
      </div>

      {/* Main Grid: SOS Distress Queue (Left 2 cols) & Field Teams Readiness (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Live SOS Distress Calls Triage */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-600" />
                  Priority SOS Distress Dispatch Queue
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ordered by severity score and estimated water hazard velocity.
                </p>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {distressCalls.filter((c) => c.status !== "rescued").length} Active Calls
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {distressCalls.map((call) => (
                  <div
                    key={call.id}
                    className={`p-4 sm:p-5 transition-colors ${
                      call.status === "rescued"
                        ? "bg-slate-50/60 opacity-60"
                        : call.severity === "critical"
                        ? "bg-red-50/30 hover:bg-red-50/50"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {call.id}
                          </span>
                          <SeverityBadge level={call.severity} />
                          <span className="text-xs text-slate-500 font-mono">
                            • {call.timestamp}
                          </span>
                          {call.status === "rescued" && (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 text-[10px] font-semibold">
                              ✓ Extraction Complete
                            </Badge>
                          )}
                          {call.status === "dispatched" && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300 text-[10px] font-semibold">
                              Unit In Transit
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-start gap-1.5">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {call.location}
                            </p>
                            <p className="text-xs text-slate-600">
                              {call.landmark}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                          <div>
                            <span className="text-slate-500">Water Depth: </span>
                            <span className="font-semibold font-mono text-slate-900">
                              {call.waterLevel}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Stranded Citizens: </span>
                            <span className="font-semibold font-mono text-slate-900">
                              {call.peopleCount} individuals
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Caller: </span>
                            <a
                              href={`tel:${call.contactNumber}`}
                              className="font-mono font-medium text-blue-700 hover:underline inline-flex items-center gap-1"
                            >
                              <PhoneCall className="h-3 w-3" />
                              {call.contactNumber}
                            </a>
                          </div>
                        </div>

                        {call.assignedTeam && (
                          <div className="text-xs bg-white border border-slate-200 rounded p-2 text-slate-700 font-mono mt-2">
                            Assigned Unit: <strong className="text-slate-900">{call.assignedTeam}</strong>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex sm:flex-col items-center gap-2 shrink-0 pt-2 sm:pt-0">
                        {call.status === "pending" && (
                          <Button
                            size="sm"
                            className="w-full text-xs font-semibold bg-red-700 hover:bg-red-800 text-white"
                            onClick={() => handleDispatch(call.id)}
                          >
                            <Send className="h-3 w-3 mr-1.5" />
                            Dispatch Unit
                          </Button>
                        )}
                        {call.status === "dispatched" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs font-semibold border-emerald-600 text-emerald-800 hover:bg-emerald-50"
                            onClick={() => handleResolve(call.id)}
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1.5" />
                            Mark Rescued
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Field Teams & Units Status */}
        <div className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-700" />
                Active Tactical Units
              </CardTitle>
              <p className="text-xs text-slate-500">
                NDRF, SDRF & Municipal Rescue asset readiness.
              </p>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {TEAMS_STATUS.map((team, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-xs">
                      {team.name}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase font-mono ${
                        team.readiness === "available"
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                          : team.readiness === "airborne"
                          ? "border-blue-300 bg-blue-50 text-blue-800"
                          : "border-amber-300 bg-amber-50 text-amber-800"
                      }`}
                    >
                      {team.status}
                    </Badge>
                  </div>

                  <p className="text-slate-600 leading-relaxed">
                    <strong className="text-slate-700">Gear:</strong> {team.equipment}
                  </p>

                  <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/60 font-mono">
                    <span>Sector: {team.zone}</span>
                    <span>{team.personnel} Responders</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Shelter & Resource Link Card */}
          <Card className="border-slate-200 bg-slate-900 text-white">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Tactical Comm Bridge
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <p className="text-sm font-semibold">
                Direct Line to State Emergency Operations Center (SEOC)
              </p>
              <p className="text-xs text-slate-300">
                Toll-free Hotline: 1070 / 1077 (Disaster Helpline)
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold bg-transparent text-white border-slate-700 hover:bg-slate-800"
                onClick={() => alert("Initiating secure tactical voice patch...")}
              >
                Open Frequency Channel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
