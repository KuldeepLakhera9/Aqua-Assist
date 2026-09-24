"use client";

import * as React from "react";
import Link from "next/link";
import {
  CloudRain,
  Wind,
  Droplets,
  Gauge,
  Thermometer,
  Compass,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  RefreshCw,
  Layers,
  MapPin,
  Calendar,
  Radar,
  Activity,
  ShieldAlert,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";

// 24-Hour Doppler Rain & Inundation Prediction Forecast
const PREDICTIVE_HOURLY_FORECAST = [
  { time: "06:00", rainfall: 8.2, soilSaturation: 72, riskIndex: 35 },
  { time: "09:00", rainfall: 14.5, soilSaturation: 80, riskIndex: 52 },
  { time: "12:00", rainfall: 28.0, soilSaturation: 89, riskIndex: 74 },
  { time: "15:00", rainfall: 38.6, soilSaturation: 96, riskIndex: 88 },
  { time: "18:00 (Peak)", rainfall: 44.2, soilSaturation: 99, riskIndex: 94 },
  { time: "21:00", rainfall: 22.0, soilSaturation: 97, riskIndex: 82 },
  { time: "00:00", rainfall: 12.4, soilSaturation: 92, riskIndex: 65 },
  { time: "03:00", rainfall: 6.8, soilSaturation: 88, riskIndex: 48 },
];

// Inundation Risk Index by Basin
const BASIN_RISK_INDEX = [
  {
    name: "Mithi River Low-Lying Catchment",
    location: "Kurla / BKC / Kalina",
    riskScore: 94,
    status: "critical",
    prediction: "Severe surface inundation (1.5m - 2.2m) during high tide peak",
    saturation: "99% Saturated",
  },
  {
    name: "Hindmata Flyover Catchment",
    location: "Dadar / Parel",
    riskScore: 84,
    status: "high",
    prediction: "Roadway inundation up to 1.1m; dewatering pumps engaged",
    saturation: "92% Saturated",
  },
  {
    name: "Sion Gandhi Market Depression",
    location: "Sion Circle / GTB Nagar",
    riskScore: 78,
    status: "high",
    prediction: "Drainage backflow expected if rainfall exceeds 30mm/hr",
    saturation: "88% Saturated",
  },
  {
    name: "Milan Subway Corridor",
    location: "Santacruz / Vile Parle",
    riskScore: 65,
    status: "advisory",
    prediction: "Vehicular underpass closure likely if rainfall accelerates",
    saturation: "80% Saturated",
  },
];

export default function WeatherPredictionPage() {
  const [isMounted, setIsMounted] = React.useState(false);
  const [selectedCity, setSelectedCity] = React.useState("Mumbai");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              IMD DOPPLER RADAR & HYDROLOGIC PREDICTION TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Real-Time Weather Doppler & Flood Inundation Prediction Hub
          </h1>
          <p className="text-sm text-slate-600">
            India Meteorological Department (IMD) doppler telemetry combined with hydrological runoff modeling and satellite soil saturation indexes.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshTelemetry}
            disabled={isRefreshing}
            className="text-xs font-semibold border-slate-300"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Polling Radar..." : "Sync Radar"}
          </Button>

          <Link href="/emergency">
            <Button variant="emergency" size="sm" className="text-xs font-bold">
              Emergency SOS
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Meteorological Sensor Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="border-blue-200 bg-blue-50/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
              <span>Rainfall Rate</span>
              <CloudRain className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-mono font-bold text-blue-900 mt-2">
              18.4 mm/h
            </div>
            <div className="text-[11px] text-blue-700 font-semibold mt-1">
              Torrential Downpour Alert
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>24h Catchment Total</span>
              <Droplets className="h-4 w-4 text-sky-600" />
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 mt-2">
              184.6 mm
            </div>
            <div className="text-[11px] text-amber-700 font-semibold mt-1">
              +117% above daily baseline
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Barometric Pressure</span>
              <Gauge className="h-4 w-4 text-slate-500" />
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 mt-2">
              1004.2 hPa
            </div>
            <div className="text-[11px] text-red-700 font-semibold mt-1">
              Depression trough active
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Wind Gust Velocity</span>
              <Wind className="h-4 w-4 text-teal-600" />
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 mt-2">
              42 km/h
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              Direction: WSW (245°)
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Relative Humidity</span>
              <Thermometer className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 mt-2">
              94%
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">
              Temp: 26.4°C (Dew: 25.1°C)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts & Radar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Predictive Precipitation Curve (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="p-4 pb-0 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  24-Hour Hourly Predictive Precipitation & Soil Saturation
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated numerical weather prediction (NWP) model with flash-flood threshold (35mm/h)
                </p>
              </div>
              <Badge variant="outline" className="border-red-300 text-red-800 bg-red-50 text-[10px] font-mono">
                PEAK RISK: 18:00 HRS
              </Badge>
            </CardHeader>

            <CardContent className="p-4">
              {isMounted && (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PREDICTIVE_HOURLY_FORECAST} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284c7" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#0284c7" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#64748b" }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748b" }} unit=" mm" />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
                      <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 4 }} />
                      <ReferenceLine
                        yAxisId="left"
                        y={35}
                        stroke="#dc2626"
                        strokeDasharray="4 4"
                        label={{ value: "Flash Flood Threshold 35mm/h", fill: "#dc2626", fontSize: 10 }}
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="rainfall"
                        name="Precipitation (mm/h)"
                        stroke="#0284c7"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#rainGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Meteorological Warning Banner */}
          <div className="bg-amber-50 border border-amber-300 text-amber-950 p-3.5 rounded text-xs flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>IMD Special Warning Bulletin (Monsoon 2026):</strong> Cyclonic circulation over North Konkan coast is feeding intense rain bands into Mumbai Metropolitan Region. High tide of 4.42 meters expected at 14:15 IST will impede gravitational drainage discharge into the Arabian Sea.
            </div>
          </div>
        </div>

        {/* Right: Doppler Radar Simulation & Telemetry Station (1 col) */}
        <div className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                IMD Colaba Doppler Radar Sweep
              </CardTitle>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Radar Graphical Display Box */}
              <div className="relative w-full h-56 bg-slate-950 rounded border border-slate-800 flex items-center justify-center overflow-hidden">
                {/* Concentric radar range circles */}
                <div className="absolute h-48 w-48 rounded-full border border-slate-800" />
                <div className="absolute h-32 w-32 rounded-full border border-slate-700" />
                <div className="absolute h-16 w-16 rounded-full border border-slate-600" />
                {/* Radar sweep beam */}
                <div className="absolute h-48 w-48 rounded-full border-t-2 border-r-2 border-emerald-500/60 animate-spin" style={{ animationDuration: "4s" }} />

                {/* Simulated storm echo blobs */}
                <div className="absolute top-12 left-16 h-12 w-16 bg-red-600/40 rounded-full blur-xs" />
                <div className="absolute top-16 left-20 h-8 w-10 bg-amber-500/50 rounded-full blur-xs" />
                <div className="absolute bottom-14 right-16 h-10 w-14 bg-blue-500/40 rounded-full blur-xs" />

                <div className="relative z-10 text-center font-mono text-[10px] text-emerald-400 bg-slate-900/80 px-2 py-1 rounded border border-emerald-800">
                  DOPPLER 250KM SWEEP • ECHO INTENSITY: 52 dBZ
                </div>
              </div>

              {/* Echo Intensity Legend */}
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center">
                <div className="bg-sky-950 text-sky-300 py-0.5 rounded border border-sky-800">Light</div>
                <div className="bg-emerald-950 text-emerald-300 py-0.5 rounded border border-emerald-800">Moderate</div>
                <div className="bg-amber-950 text-amber-300 py-0.5 rounded border border-amber-800">Heavy</div>
                <div className="bg-red-950 text-red-300 py-0.5 rounded border border-red-800">Extreme</div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Telemetry Details */}
          <Card className="border-slate-200">
            <CardHeader className="p-4 pb-2 border-b border-slate-100">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Astronomical Tide Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Next High Tide:</span>
                <span className="font-bold text-red-700">14:15 IST (4.42 m)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Next Low Tide:</span>
                <span className="font-bold text-slate-800">20:30 IST (1.18 m)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Flapper Sluice Status:</span>
                <span className="font-bold text-amber-700">Throttled (High Tide)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Machine Learning Inundation Risk Forecast Table */}
      <Card className="border-slate-200">
        <CardHeader className="p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">
              Predictive Inundation Risk Index by River Basin & Catchment
            </CardTitle>
            <p className="text-xs text-slate-500">
              Hydrological simulation predicting standing water accumulation over the next 12 hours
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            4 CATCHMENTS
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Catchment / Basin Name</th>
                <th className="py-2.5 px-4">Municipal Location</th>
                <th className="py-2.5 px-4 text-center">Risk Score</th>
                <th className="py-2.5 px-4">Severity Tier</th>
                <th className="py-2.5 px-4">Soil Saturation</th>
                <th className="py-2.5 px-4">Algorithmic Forecast Prediction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {BASIN_RISK_INDEX.map((basin) => (
                <tr key={basin.name} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-slate-900">{basin.name}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono">{basin.location}</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        basin.riskScore >= 85
                          ? "bg-red-50 text-red-800 border border-red-200 font-bold"
                          : basin.riskScore >= 70
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-blue-50 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {basin.riskScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <SeverityBadge severity={basin.status as any} />
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-700">{basin.saturation}</td>
                  <td className="py-3 px-4 text-slate-800 text-[11px] max-w-sm">{basin.prediction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
