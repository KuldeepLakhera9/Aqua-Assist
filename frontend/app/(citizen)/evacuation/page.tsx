"use client";

import * as React from "react";
import Link from "next/link";
import {
  Navigation,
  Compass,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  Home,
  Footprints,
  Info,
  Layers,
} from "lucide-react";
import DynamicFloodMap from "@/components/maps/DynamicFloodMap";
import { MapMarkerItem, HazardZoneItem } from "@/components/maps/map-constants";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";

// Evacuation Waypoints (Avoiding flooded low spots)
const EVACUATION_ROUTE_COORDINATES: Array<[number, number]> = [
  [19.0688, 72.8826], // Start: Kranti Nagar Ridge (Current Location)
  [19.0681, 72.8812], // Elevated flyover approach
  [19.0669, 72.8801], // CST Road Upper Ridge
  [19.0658, 72.8795], // S.G. Barve Marg Turn
  [19.0652, 72.8791], // End: Kurla High School Relief Shelter
];

const EVACUATION_MARKERS: MapMarkerItem[] = [
  {
    id: "origin-gps",
    type: "rescuer",
    title: "YOUR CURRENT LOCATION",
    description: "Kranti Nagar Upper Elevation. Begin evacuation immediately.",
    coordinates: [19.0688, 72.8826],
  },
  {
    id: "sh-001",
    type: "shelter",
    title: "DESIGNATED DESTINATION: Camp 08 — Kurla High School",
    description: "Capacity: 800 citizens • Medical Trauma Desk • Potable Water Sump",
    coordinates: [19.0652, 72.8791],
    capacity: 800,
  },
  {
    id: "hazard-subway",
    type: "incident",
    title: "BLOCKED HAZARD: LBS Marg Subway Submerged",
    description: "Water depth 1.8m. Bypassed by evacuation algorithm.",
    coordinates: [19.0675, 72.8818],
    severity: "critical",
    waterLevel: "1.8m",
  },
];

const EVACUATION_HAZARDS: HazardZoneItem[] = [
  {
    center: [19.0675, 72.8818],
    radiusMeters: 400,
    color: "#dc2626",
    label: "Inundated Subway Underpass (Strictly Bypassed)",
  },
];

export default function EvacuationPage() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isNavigating, setIsNavigating] = React.useState(false);

  const waypoints = [
    {
      title: "Step 1: Depart Kranti Nagar Ridge",
      instructions: "Head South-West along elevated footpath toward CST Road connector. Stay clear of the Mithi River bank retaining wall.",
      distance: "350 meters",
      time: "4 mins",
      caution: "Carry emergency pouch with Aadhaar, medications, and dry rations.",
      safe: true,
    },
    {
      title: "Step 2: Ascend Elevated Flyover Ramp",
      instructions: "DO NOT enter the low-level LBS Road subway underpass (Flooded to 1.8m). Take the pedestrian ramp onto the elevated flyover.",
      distance: "400 meters",
      time: "5 mins",
      caution: "Underpass is submerged. Follow green municipal evacuation signage.",
      safe: true,
    },
    {
      title: "Step 3: Proceed along S.G. Barve Marg",
      instructions: "Follow high-ground ridge road toward Kurla West junction. NDRF civil defense wardens stationed at the intersection.",
      distance: "650 meters",
      time: "8 mins",
      caution: "Watch for emergency vehicle movement (Zodiac boat trailers).",
      safe: true,
    },
    {
      title: "Step 4: Arrive at Evacuation Shelter 08",
      instructions: "Enter Kurla High School compound via Gate 2 (Disaster Relief Desk). Complete rapid Aadhaar check-in for ration & bedding allocation.",
      distance: "400 meters",
      time: "5 mins",
      caution: "Report any family members requiring immediate medical attention.",
      safe: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              TOPOGRAPHIC EVACUATION PATHFINDER
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Safe Evacuation Corridor & Shelter Navigator
          </h1>
          <p className="text-sm text-slate-600">
            Real-time high-ground pedestrian corridor automatically calculated to bypass submerged subways and breached riverbanks.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsNavigating(!isNavigating)}
            className="text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            <Compass className="h-4 w-4 mr-1.5" />
            {isNavigating ? "Active Navigation On" : "Start Live Navigation"}
          </Button>

          <a href="tel:1078">
            <Button variant="outline" size="sm" className="font-semibold text-xs border-slate-300">
              <PhoneCall className="h-3.5 w-3.5 mr-1 text-red-600" />
              NDRF (1078)
            </Button>
          </a>
        </div>
      </div>

      {/* KPI Ticker Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Destination Camp</span>
            <Home className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-base font-bold text-slate-900 mt-1 truncate">Camp 08 (High School)</div>
          <div className="text-[11px] text-blue-700 font-medium">240 beds currently available</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Total Walking Distance</span>
            <Footprints className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">1.8 km</div>
          <div className="text-[11px] text-emerald-700">100% on elevated terrain</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Estimated Walk Time</span>
            <Clock className="h-4 w-4 text-slate-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">22 min</div>
          <div className="text-[11px] text-slate-500">At standard evacuation pace</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Hazard Bypass Status</span>
            <ShieldCheck className="h-4 w-4 text-teal-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-teal-700 mt-1">SECURE</div>
          <div className="text-[11px] text-teal-700">1 Danger zone avoided</div>
        </div>
      </div>

      {/* Main Grid: Map & Turn-by-Turn Waypoints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Map View (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between bg-slate-900 text-white px-3 py-2 rounded text-xs font-mono">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              HIGH-GROUND CORRIDOR: GREEN GLOWING TRACE • SPEED: 4.8 KM/H
            </span>
            <span className="text-slate-400">WAYPOINTS: 4</span>
          </div>

          <div className="relative">
            <DynamicFloodMap
              markers={EVACUATION_MARKERS}
              hazardZones={EVACUATION_HAZARDS}
              routePolyline={EVACUATION_ROUTE_COORDINATES}
              height="580px"
            />
          </div>

          {/* Navigation Warning Notice */}
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-3 rounded text-xs flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong>Government Evacuation Clearance:</strong> This route is continuously monitored by MCGM CCTV cameras and NDRF boat teams. Water level along this green corridor is zero. Follow instructions of NDRF wardens stationed at S.G. Barve junction.
            </div>
          </div>
        </div>

        {/* Right Waypoint Instructions (1 col) */}
        <div className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="p-4 pb-2 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Turn-by-Turn Waypoints</span>
                <Badge variant="outline" className="font-mono text-xs">
                  4 STAGES
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-3 space-y-3 max-h-[580px] overflow-y-auto divide-y divide-slate-100">
              {waypoints.map((step, idx) => (
                <div
                  key={step.title}
                  onClick={() => setActiveStep(idx)}
                  className={`pt-3 first:pt-0 cursor-pointer p-2.5 rounded transition-all ${
                    activeStep === idx
                      ? "bg-emerald-50 border border-emerald-200"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      {step.title}
                    </span>
                    <Badge variant="outline" className="bg-white text-[10px] font-mono">
                      {step.time}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                    {step.instructions}
                  </p>

                  <div className="bg-amber-50/70 border border-amber-200 rounded p-2 text-[11px] text-amber-900 mt-2 flex items-start gap-1.5">
                    <AlertTriangle className="h-3 w-3 text-amber-700 shrink-0 mt-0.5" />
                    <span>{step.caution}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-[10px] font-mono text-slate-500">
                    <span>Segment Distance: {step.distance}</span>
                    <span className="text-emerald-700 font-bold">Terrain: Elevated ✓</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shelter Amenities Snapshot */}
          <Card className="border-slate-200">
            <CardHeader className="p-4 pb-2 border-b border-slate-100">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Shelter Camp 08 Facilities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Free Food & Water:</span>
                <span className="font-bold text-emerald-700">Akshaya Patra Rations</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Medical Desk:</span>
                <span className="font-bold text-blue-700">Red Cross Trauma Team</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Power & Phone Charging:</span>
                <span className="font-bold text-slate-800">Solar Backup Gen 40kVA</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
