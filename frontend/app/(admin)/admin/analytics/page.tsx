"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  Activity,
  Droplets,
  AlertTriangle,
  Clock,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";

// Hydrometric River Gauging Telemetry (Mithi River Basin)
const RIVER_GAUGE_DATA = [
  { time: "00:00", level: 2.8, warning: 3.8, danger: 4.5 },
  { time: "03:00", level: 3.1, warning: 3.8, danger: 4.5 },
  { time: "06:00", level: 3.6, warning: 3.8, danger: 4.5 },
  { time: "09:00", level: 4.1, warning: 3.8, danger: 4.5 },
  { time: "12:00", level: 4.6, warning: 3.8, danger: 4.5 },
  { time: "15:00", level: 4.82, warning: 3.8, danger: 4.5 },
  { time: "18:00 (Est)", level: 4.65, warning: 3.8, danger: 4.5 },
  { time: "21:00 (Est)", level: 4.2, warning: 3.8, danger: 4.5 },
];

// Basin Precipitation (24h)
const RAINFALL_BASIN_DATA = [
  { basin: "Mithi Catchment", rainfall: 184.6, normal: 85.0 },
  { basin: "Ulhas Basin", rainfall: 142.0, normal: 78.0 },
  { basin: "Powai Catchment", rainfall: 165.4, normal: 90.0 },
  { basin: "Vaitarna Valley", rainfall: 98.2, normal: 65.0 },
  { basin: "Oshiwara Reach", rainfall: 128.5, normal: 70.0 },
];

// Severity Distribution
const SEVERITY_PIE_DATA = [
  { name: "Critical (Breach)", value: 14, color: "#dc2626" },
  { name: "High (Severe Inundation)", value: 28, color: "#ea580c" },
  { name: "Advisory (Waterlogging)", value: 45, color: "#d97706" },
  { name: "Normal (Under Control)", value: 63, color: "#059669" },
];

// Rescue Response Velocity (7-Day Trend)
const RESCUE_TREND_DATA = [
  { day: "Mon", calls: 18, rescues: 18, avgTime: 18.5 },
  { day: "Tue", calls: 24, rescues: 23, avgTime: 16.2 },
  { day: "Wed", calls: 35, rescues: 34, avgTime: 15.0 },
  { day: "Thu", calls: 52, rescues: 51, avgTime: 14.2 },
  { day: "Fri", calls: 68, rescues: 66, avgTime: 13.8 },
  { day: "Sat", calls: 49, rescues: 48, avgTime: 14.1 },
  { day: "Sun (Today)", calls: 42, rescues: 42, avgTime: 12.9 },
];

// Basin Monitoring Dossier
const BASIN_STATION_DOSSIER = [
  {
    station: "Kranti Nagar Embankment (STN-01)",
    river: "Mithi River",
    currentLevel: "4.82m",
    dangerLevel: "4.50m",
    trend: "Peaking",
    status: "critical",
    alert: "EMBANKMENT BREACHED",
  },
  {
    station: "Bandra-Kurla Complex Weirs (STN-02)",
    river: "Mithi Estuary",
    currentLevel: "3.95m",
    dangerLevel: "4.20m",
    trend: "Rising",
    status: "high",
    alert: "HIGH TIDE RETARDATION",
  },
  {
    station: "Powai Lake Spillway (STN-03)",
    river: "Powai Catchment",
    currentLevel: "112.4m RL",
    dangerLevel: "111.0m RL",
    trend: "Overflowing",
    status: "high",
    alert: "CONTROLLED DISCHARGE",
  },
  {
    station: "Thane Creek Tidal Sluice (STN-04)",
    river: "Thane Estuary",
    currentLevel: "2.80m",
    dangerLevel: "3.50m",
    trend: "Stable",
    status: "normal",
    alert: "PUMPS OPERATIONAL",
  },
];

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState<"6h" | "24h" | "7d" | "30d">("24h");
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportMessage, setExportMessage] = React.useState<string | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleExportSitRep = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportMessage("Executive SitRep Brief (PDF / Telemetry CSV) compiled and queued for NDOC archive.");
      setTimeout(() => setExportMessage(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Executive Command Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              NATIONAL DISASTER OPERATIONS CENTER • TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Predictive Hydrometric & Rescue Operations Analytics
          </h1>
          <p className="text-sm text-slate-600">
            Automated sensor stream aggregation: Central Water Commission gauges, IMD precipitation models, and tactical rescue deployment logs.
          </p>
        </div>

        {/* Time Selector & Export */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex rounded border border-slate-300 bg-white p-0.5 text-xs font-medium">
            {(["6h", "24h", "7d", "30d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  timeRange === range
                    ? "bg-slate-900 text-white font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportSitRep}
            disabled={isExporting}
            className="text-xs font-semibold border-slate-300"
          >
            {isExporting ? (
              <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5 mr-1.5" />
            )}
            {isExporting ? "Generating..." : "Export SitRep"}
          </Button>
        </div>
      </div>

      {exportMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {exportMessage}
        </div>
      )}

      {/* KPI Hydro-Meteorological Metric Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-red-900">
              <span>Peak Gauge Inundation</span>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-2xl font-mono font-bold text-red-900 mt-2">
              4.82 m
            </div>
            <div className="flex items-center text-[11px] text-red-700 font-semibold mt-1">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              +0.32m above Danger Level (4.50m)
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>24h Catchment Rainfall</span>
              <Droplets className="h-4 w-4 text-sky-600" />
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 mt-2">
              184.6 mm
            </div>
            <div className="flex items-center text-[11px] text-amber-700 font-semibold mt-1">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
              +117% vs Seasonal 24h Normal
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Median Extraction Speed</span>
              <Clock className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 mt-2">
              12.9 min
            </div>
            <div className="flex items-center text-[11px] text-emerald-700 font-semibold mt-1">
              <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
              -5.6 min improvement vs 48h ago
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Relief Camp Utilization</span>
              <Layers className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 mt-2">
              68.4%
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              1,368 of 2,000 Verified Beds Occupied
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* River Water Level vs Danger Gauge Line */}
        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-0 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Mithi River Basin Hydro-Gauging Telemetry
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Observed river stage (meters) vs statutory Danger Mark (4.50m)
              </p>
            </div>
            <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50 text-[10px] font-mono">
              BREACH ACTIVE
            </Badge>
          </CardHeader>
          <CardContent className="p-4">
            {isMounted && (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={RIVER_GAUGE_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="waterLevelGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis domain={[2.0, 5.2]} tick={{ fontSize: 11, fill: "#64748b" }} unit="m" />
                    <Tooltip
                      formatter={(val: any) => [`${val} meters`, "Level"]}
                      labelStyle={{ fontWeight: "bold", color: "#0f172a" }}
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 4 }}
                    />
                    <ReferenceLine y={4.5} stroke="#dc2626" strokeDasharray="4 4" label={{ value: "Danger 4.5m", fill: "#dc2626", fontSize: 10 }} />
                    <ReferenceLine y={3.8} stroke="#d97706" strokeDasharray="3 3" label={{ value: "Warning 3.8m", fill: "#d97706", fontSize: 10 }} />
                    <Area type="monotone" dataKey="level" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#waterLevelGrad)" name="River Stage" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 24h Basin Precipitation */}
        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-0 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                24-Hour Precipitation Volume by Drainage Basin
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Telemetry from IMD automatic rain gauges vs climatological normals
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">UNIT: MM</span>
          </CardHeader>
          <CardContent className="p-4">
            {isMounted && (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={RAINFALL_BASIN_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="basin" tick={{ fontSize: 10, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit="mm" />
                    <Tooltip
                      formatter={(val: any) => [`${val} mm`, "Rainfall"]}
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 4 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                    <Bar dataKey="rainfall" name="Recorded 24h Rain" fill="#1e3a8a" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="normal" name="Seasonal Benchmark" fill="#94a3b8" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Severity Classification Donut */}
        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-0 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Incident Severity Classification & Risk Profile
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Active municipal reports audited by Central AI triage (150 Total)
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              150 REPORTS
            </Badge>
          </CardHeader>
          <CardContent className="p-4 flex flex-col md:flex-row items-center justify-around gap-4">
            {isMounted && (
              <div className="h-[240px] w-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SEVERITY_PIE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {SEVERITY_PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 4, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="space-y-2 text-xs w-full max-w-[240px]">
              {SEVERITY_PIE_DATA.map((item) => (
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

        {/* 7-Day Rescue Velocity & Volume Trend */}
        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-0 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Tactical Dispatch & Citizen Extraction Velocity
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Distress alerts resolved vs average deployment velocity in minutes
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-semibold">98.5% RESOLVED</span>
          </CardHeader>
          <CardContent className="p-4">
            {isMounted && (
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={RESCUE_TREND_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#64748b" }} unit="m" />
                    <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 4 }} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                    <Line yAxisId="left" type="monotone" dataKey="calls" name="Distress Calls" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} />
                    <Line yAxisId="left" type="monotone" dataKey="rescues" name="Successful Extractions" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
                    <Line yAxisId="right" type="monotone" dataKey="avgTime" name="Avg Velocity (Mins)" stroke="#0284c7" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statutory River Basin Station Dossier */}
      <Card className="border-slate-200">
        <CardHeader className="p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">
              Statutory River Basin & Tidal Gauge Telemetry Dossier
            </CardTitle>
            <p className="text-xs text-slate-500">
              Live telemetry certified by Central Water Commission (CWC) telemetry transponders
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            4 OF 4 GAUGES CONNECTED
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Station & Telemetry ID</th>
                <th className="py-2.5 px-4">River System</th>
                <th className="py-2.5 px-4">Current Gauge</th>
                <th className="py-2.5 px-4">Statutory Danger Mark</th>
                <th className="py-2.5 px-4">Hydrologic Trend</th>
                <th className="py-2.5 px-4">Operational Status</th>
                <th className="py-2.5 px-4">Watch Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {BASIN_STATION_DOSSIER.map((item) => (
                <tr key={item.station} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.station}</td>
                  <td className="py-3 px-4 text-slate-600">{item.river}</td>
                  <td className="py-3 px-4 font-mono font-bold text-red-700">{item.currentLevel}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{item.dangerLevel}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{item.trend}</td>
                  <td className="py-3 px-4">
                    <SeverityBadge severity={item.status as any} />
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] font-bold text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      {item.alert}
                    </span>
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
