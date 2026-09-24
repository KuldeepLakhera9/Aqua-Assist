"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  Droplet,
  Truck,
  Activity,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Wrench,
  Fuel,
  Building,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";

// Ward-level stormwater drainage choke reports
const WARD_CHOKE_DATA = [
  { ward: "Ward L (Kurla)", reported: 28, resolved: 21 },
  { ward: "Ward F-N (Sion)", reported: 24, resolved: 18 },
  { ward: "Ward G-N (Dadar)", reported: 19, resolved: 16 },
  { ward: "Ward K-W (Andheri)", reported: 14, resolved: 11 },
  { ward: "Ward H-E (Santacruz)", reported: 11, resolved: 9 },
  { ward: "Ward C (Marine Lines)", reported: 6, resolved: 6 },
];

// Pump operating hours vs diesel stockpile consumption
const PUMP_RUN_DATA = [
  { day: "Mon", hours: 140, dieselLiters: 1120 },
  { day: "Tue", hours: 210, dieselLiters: 1680 },
  { day: "Wed", hours: 380, dieselLiters: 3040 },
  { day: "Thu", hours: 520, dieselLiters: 4160 },
  { day: "Fri", hours: 640, dieselLiters: 5120 },
  { day: "Sat", hours: 480, dieselLiters: 3840 },
  { day: "Sun", hours: 410, dieselLiters: 3280 },
];

// Status breakdown
const TICKET_STATUS_DATA = [
  { name: "Resolved & Desilted", value: 58, color: "#059669" },
  { name: "Jetting Crew Active", value: 22, color: "#0284c7" },
  { name: "Inspection Dispatched", value: 12, color: "#d97706" },
  { name: "Severely Obstructed", value: 8, color: "#dc2626" },
];

// High Tide Tidal Gate Outflow Telemetry
const SLUICE_OUTFLOW_DATA = [
  { time: "02:00", seaTideMeters: 1.8, dischargeCumecs: 85 },
  { time: "06:00", seaTideMeters: 2.9, dischargeCumecs: 62 },
  { time: "10:00", seaTideMeters: 4.4, dischargeCumecs: 18 }, // High tide shuts flapper gates
  { time: "14:00", seaTideMeters: 3.1, dischargeCumecs: 54 },
  { time: "18:00", seaTideMeters: 2.0, dischargeCumecs: 92 },
  { time: "22:00", seaTideMeters: 1.4, dischargeCumecs: 110 },
];

// Ward Action Roster
const WARD_REMEDIAL_ACTION_ROSTER = [
  {
    culvert: "Kurla West LBS Road Culvert #4",
    ward: "Ward L",
    cause: "Severe Plastic Waste & Silt",
    pumpAssigned: "1,500 GPM High-Flow Submersible (Unit-04)",
    engineer: "Er. A. Kulkarni (Executive Eng)",
    status: "critical",
    clearanceETA: "45 Mins",
  },
  {
    culvert: "Hindmata Underpass Sump Drain",
    ward: "Ward F-North",
    cause: "Storm Surcharging (Backflow)",
    pumpAssigned: "2x 2,000 GPM Heavy Diesel Dewatering Rigs",
    engineer: "Er. S. Mehta (Ward Officer)",
    status: "high",
    clearanceETA: "Continuous Dewatering",
  },
  {
    culvert: "Gandhi Market Kings Circle Culvert",
    ward: "Ward F-North",
    cause: "Macro Debris & Fallen Tree Branch",
    pumpAssigned: "JCB Excavator + Vacuum Suction Tanker",
    engineer: "Er. R. Deshmukh (Sub-Eng)",
    status: "high",
    clearanceETA: "1.2 Hours",
  },
  {
    culvert: "Milan Subway Sump & Discharge Duct",
    ward: "Ward K-West",
    cause: "Drainage Valve Jammed",
    pumpAssigned: "3x 800 GPM Electric Submersible",
    engineer: "Er. N. Patil (Maintenance)",
    status: "normal",
    clearanceETA: "Cleared / Pumping Steady",
  },
];

export default function MunicipalityAnalyticsPage() {
  const [isMounted, setIsMounted] = React.useState(false);
  const [selectedWard, setSelectedWard] = React.useState("all");
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportNotice, setExportNotice] = React.useState<string | null>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleExportWardReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportNotice("Municipal Dewatering & Culvert Clearance Audit Report generated successfully.");
      setTimeout(() => setExportNotice(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Municipal Operations Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-600 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
              MUNICIPAL STORMWATER & REMEDIATION TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Ward Inundation & Dewatering Pump Fleet Analytics
          </h1>
          <p className="text-sm text-slate-600">
            Real-time drainage choke ticket triage, high-capacity diesel pump runtime telemetry, and tidal sluice discharge efficiency.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportWardReport}
            disabled={isExporting}
            className="text-xs font-semibold border-slate-300"
          >
            {isExporting ? (
              <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5 mr-1.5" />
            )}
            {isExporting ? "Exporting..." : "Export Ward SitRep"}
          </Button>
        </div>
      </div>

      {exportNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {exportNotice}
        </div>
      )}

      {/* Municipal Telemetry KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Dewatering Fleet</span>
              <Wrench className="h-4 w-4 text-sky-600" />
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 mt-2">
              48 / 52 Active
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              92.3% Fleet Operational Rate
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Culvert Choke Tickets</span>
              <Droplet className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 mt-2">
              100 Total
            </div>
            <div className="text-[11px] text-slate-600 font-medium mt-1">
              58 Resolved • 22 In Desilting
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Diesel Stockpile Reserve</span>
              <Fuel className="h-4 w-4 text-teal-600" />
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 mt-2">
              24,500 L
            </div>
            <div className="text-[11px] text-teal-800 font-semibold mt-1">
              ~42 Hours Continuous Run Reserve
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Mean Desilting Velocity</span>
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 mt-2">
              1.6 Hours
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              -25% faster than monsoon SLA
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ward-level choke reports */}
        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-0 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Stormwater Drainage Choke Reports by Municipal Ward
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Complaints logged vs culverts cleared and certified desilted
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">MONSOON 2026</span>
          </CardHeader>
          <CardContent className="p-4">
            {isMounted && (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={WARD_CHOKE_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="ward" tick={{ fontSize: 10, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 4 }} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                    <Bar dataKey="reported" name="Logged Chokes" fill="#dc2626" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="resolved" name="Cleared & Desilted" fill="#059669" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pump Operating Hours vs Fuel Consumption */}
        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-0 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Dewatering Pump Run Hours vs Diesel Consumption
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Aggregate operating hours and diesel burn rate across municipal mobile pumps
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              7-DAY CYCLE
            </Badge>
          </CardHeader>
          <CardContent className="p-4">
            {isMounted && (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PUMP_RUN_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748b" }} unit="h" />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#64748b" }} unit="L" />
                    <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 4 }} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                    <Bar yAxisId="left" dataKey="hours" name="Run Hours (Total)" fill="#0f172a" radius={[3, 3, 0, 0]} />
                    <Bar yAxisId="right" dataKey="dieselLiters" name="Diesel (Liters)" fill="#0284c7" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ticket Remediation Status Donut */}
        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-0 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Drainage Remediation Ticket Status Breakdown
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                100 Total Citizen & Patrol Logged Drainage Tickets
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-semibold">58% COMPLETED</span>
          </CardHeader>
          <CardContent className="p-4 flex flex-col md:flex-row items-center justify-around gap-4">
            {isMounted && (
              <div className="h-[240px] w-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={TICKET_STATUS_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {TICKET_STATUS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 4, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="space-y-2 text-xs w-full max-w-[240px]">
              {TICKET_STATUS_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-xs shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 text-[11px]">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* High Tide vs Sluice Gate Discharge */}
        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-0 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Tidal Sea Level vs Mahim Bay Sluice Gate Outflow
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Gravitational discharge rate (cumecs) throttled during astronomical high tide
              </p>
            </div>
            <Badge variant="outline" className="border-amber-300 text-amber-800 bg-amber-50 text-[10px] font-mono">
              HIGH TIDE PEAK: 4.4M
            </Badge>
          </CardHeader>
          <CardContent className="p-4">
            {isMounted && (
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SLUICE_OUTFLOW_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dischargeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748b" }} unit=" cumecs" />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#64748b" }} unit="m" />
                    <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 4 }} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                    <Area yAxisId="left" type="monotone" dataKey="dischargeCumecs" name="Discharge Rate (cumecs)" stroke="#0d9488" fillOpacity={1} fill="url(#dischargeGrad)" />
                    <Line yAxisId="right" type="monotone" dataKey="seaTideMeters" name="Sea Tide (Meters)" stroke="#dc2626" strokeWidth={2} strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ward Action & Culvert Telemetry Roster */}
      <Card className="border-slate-200">
        <CardHeader className="p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">
              Active Municipal Culvert Desilting & Pump Assignment Roster
            </CardTitle>
            <p className="text-xs text-slate-500">
              Real-time dispatch status logged by Assistant Municipal Commissioners (AMC)
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            4 CRITICAL SITES
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Culvert / Channel Location</th>
                <th className="py-2.5 px-4">Ward</th>
                <th className="py-2.5 px-4">Obstruction Cause</th>
                <th className="py-2.5 px-4">Pump Equipment Assigned</th>
                <th className="py-2.5 px-4">Officer in Charge</th>
                <th className="py-2.5 px-4">Severity</th>
                <th className="py-2.5 px-4">Clearance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {WARD_REMEDIAL_ACTION_ROSTER.map((item) => (
                <tr key={item.culvert} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.culvert}</td>
                  <td className="py-3 px-4 text-slate-600 font-bold">{item.ward}</td>
                  <td className="py-3 px-4 text-slate-700">{item.cause}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-800">{item.pumpAssigned}</td>
                  <td className="py-3 px-4 text-slate-600">{item.engineer}</td>
                  <td className="py-3 px-4">
                    <SeverityBadge severity={item.status as any} />
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] font-bold text-slate-800">
                    {item.clearanceETA}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
