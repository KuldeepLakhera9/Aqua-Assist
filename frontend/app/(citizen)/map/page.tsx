"use client";

import * as React from "react";
import Link from "next/link";
import {
  MapPin,
  ShieldAlert,
  Home,
  Navigation,
  Layers,
  AlertTriangle,
  LifeBuoy,
  PhoneCall,
  Search,
  Filter,
  ExternalLink,
  Info,
} from "lucide-react";
import DynamicFloodMap, { MapMarkerItem } from "@/components/maps/DynamicFloodMap";
import { DEFAULT_MAP_MARKERS, DEFAULT_HAZARD_ZONES } from "@/components/maps/map-constants";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function CitizenMapPage() {
  const [selectedFilter, setSelectedFilter] = React.useState<"all" | "incident" | "shelter" | "rescuer">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeMarker, setActiveMarker] = React.useState<MapMarkerItem | null>(null);

  const filteredMarkers = React.useMemo(() => {
    return DEFAULT_MAP_MARKERS.filter((m) => {
      const matchesType = selectedFilter === "all" || m.type === selectedFilter;
      const matchesSearch =
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [selectedFilter, searchQuery]);

  const incidentCount = DEFAULT_MAP_MARKERS.filter((m) => m.type === "incident").length;
  const shelterCount = DEFAULT_MAP_MARKERS.filter((m) => m.type === "shelter").length;
  const rescuerCount = DEFAULT_MAP_MARKERS.filter((m) => m.type === "rescuer").length;

  return (
    <div className="space-y-6">
      {/* Institutional Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
              LIVE GEOSPATIAL INTELLIGENCE GRID
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Interactive Flood Hazard & Shelter Map
          </h1>
          <p className="text-sm text-slate-600">
            Real-time geospatial plotting of active inundation breaches, relief camps, and rapid extraction corridors.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/report-flood">
            <Button variant="destructive" size="sm" className="font-semibold text-xs">
              <AlertTriangle className="h-4 w-4 mr-1.5" />
              Report Flood Here
            </Button>
          </Link>
          <a href="tel:1078">
            <Button variant="outline" size="sm" className="font-semibold text-xs border-slate-300">
              <PhoneCall className="h-4 w-4 mr-1.5 text-red-600" />
              NDRF (1078)
            </Button>
          </a>
        </div>
      </div>

      {/* KPI Ticker Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          onClick={() => setSelectedFilter("incident")}
          className={`cursor-pointer p-3 rounded border transition-all ${
            selectedFilter === "incident"
              ? "bg-red-50/80 border-red-300 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Breach Points</span>
            <span className="h-2 w-2 rounded-full bg-red-600" />
          </div>
          <div className="text-xl font-mono font-bold text-slate-900 mt-1">{incidentCount} Active</div>
          <span className="text-[11px] text-red-700 font-medium">3 Critical Breaches</span>
        </div>

        <div
          onClick={() => setSelectedFilter("shelter")}
          className={`cursor-pointer p-3 rounded border transition-all ${
            selectedFilter === "shelter"
              ? "bg-blue-50/80 border-blue-300 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Relief Shelters</span>
            <span className="h-2 w-2 rounded-full bg-blue-600" />
          </div>
          <div className="text-xl font-mono font-bold text-slate-900 mt-1">{shelterCount} Verified</div>
          <span className="text-[11px] text-blue-700 font-medium">2,000 Bed Capacity</span>
        </div>

        <div
          onClick={() => setSelectedFilter("rescuer")}
          className={`cursor-pointer p-3 rounded border transition-all ${
            selectedFilter === "rescuer"
              ? "bg-slate-100 border-slate-400 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Tactical Rescuers</span>
            <span className="h-2 w-2 rounded-full bg-slate-900" />
          </div>
          <div className="text-xl font-mono font-bold text-slate-900 mt-1">{rescuerCount} Units</div>
          <span className="text-[11px] text-emerald-700 font-medium">Zodiac Boats Deployed</span>
        </div>

        <div
          onClick={() => setSelectedFilter("all")}
          className={`cursor-pointer p-3 rounded border transition-all ${
            selectedFilter === "all"
              ? "bg-amber-50/80 border-amber-300 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Hazard Buffers</span>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-xl font-mono font-bold text-slate-900 mt-1">3 Danger Radii</div>
          <span className="text-[11px] text-amber-700 font-medium">Strictly Prohibited</span>
        </div>
      </div>

      {/* Main Map + Spatial Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Map Display (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between bg-white px-3 py-2 rounded border border-slate-200">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
                BASEMAP: OPENSTREETMAP CARTOGRAPHIC TILESET
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-red-600 inline-block" /> Critical Flood
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-700 inline-block" /> Shelter Camp
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-900 inline-block" /> Rescue Team
              </span>
            </div>
          </div>

          <div className="relative">
            <DynamicFloodMap
              markers={filteredMarkers}
              hazardZones={DEFAULT_HAZARD_ZONES}
              height="620px"
              onMarkerClick={(marker) => setActiveMarker(marker)}
            />
          </div>

          {/* Alert Notice Strip */}
          <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Navigation Safety Advisory:</strong> Road underpasses marked with red pulsing beacons have water
              depths exceeding 1.2 meters. Do not attempt crossing on motorbikes or light passenger vehicles. Follow safe
              radial routes to designated blue shelter hubs.
            </div>
          </div>
        </div>

        {/* Right Tactical Directory Sidebar (1 col) */}
        <div className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="p-4 pb-2 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center justify-between text-slate-900">
                <span>Spatial Directory</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {filteredMarkers.length} Points
                </Badge>
              </CardTitle>

              {/* Filter controls */}
              <div className="mt-3 space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <Button
                    variant={selectedFilter === "all" ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-[11px]"
                    onClick={() => setSelectedFilter("all")}
                  >
                    All Types
                  </Button>
                  <Button
                    variant={selectedFilter === "incident" ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-[11px]"
                    onClick={() => setSelectedFilter("incident")}
                  >
                    Breaches
                  </Button>
                  <Button
                    variant={selectedFilter === "shelter" ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-[11px]"
                    onClick={() => setSelectedFilter("shelter")}
                  >
                    Shelters
                  </Button>
                  <Button
                    variant={selectedFilter === "rescuer" ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-[11px]"
                    onClick={() => setSelectedFilter("rescuer")}
                  >
                    Rescue Units
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-3 max-h-[500px] overflow-y-auto space-y-2.5 divide-y divide-slate-100">
              {filteredMarkers.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No spatial coordinates match the active search filter.
                </div>
              ) : (
                filteredMarkers.map((marker) => {
                  const isSelected = activeMarker?.id === marker.id;
                  return (
                    <div
                      key={marker.id}
                      onClick={() => setActiveMarker(marker)}
                      className={`pt-2.5 first:pt-0 cursor-pointer rounded p-2 transition-colors ${
                        isSelected ? "bg-slate-100 border border-slate-300" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                          {marker.type}
                        </span>
                        {marker.severity && <SeverityBadge severity={marker.severity} />}
                        {marker.capacity && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-800 text-[10px] font-mono">
                            {marker.capacity} beds
                          </Badge>
                        )}
                        {marker.assignedTeam && (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 text-[10px] font-mono">
                            Active
                          </Badge>
                        )}
                      </div>

                      <div className="font-semibold text-xs text-slate-900 mt-1 leading-tight">{marker.title}</div>
                      {marker.description && (
                        <div className="text-[11px] text-slate-600 mt-1 line-clamp-2">{marker.description}</div>
                      )}

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-[10px] font-mono text-slate-500">
                        <span>
                          {marker.coordinates[0].toFixed(4)}, {marker.coordinates[1].toFixed(4)}
                        </span>
                        {marker.waterLevel && <span className="font-bold text-red-600">{marker.waterLevel}</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
