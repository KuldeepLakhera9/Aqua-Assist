"use client";

import * as React from "react";
import {
  Radio,
  Navigation,
  LifeBuoy,
  Users,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  PhoneCall,
  Activity,
  Layers,
  Send,
} from "lucide-react";
import DynamicFloodMap, { MapMarkerItem } from "@/components/maps/DynamicFloodMap";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";

const RESCUE_TACTICAL_MARKERS: MapMarkerItem[] = [
  {
    id: "sos-901",
    type: "incident",
    title: "DISTRESS SOS: 4 Citizens Stranded on Rooftop",
    description: "Kranti Nagar Block C. Water rising rapidly at 2.1m. Elderly citizen requires oxygen support.",
    coordinates: [19.0694, 72.8835],
    severity: "critical",
    waterLevel: "2.1m (Rapid Rising)",
  },
  {
    id: "sos-902",
    type: "incident",
    title: "DISTRESS SOS: Submerged Van with 2 Trapped Occupants",
    description: "Hindmata Junction low point. Vehicle stalled, water reaching window level.",
    coordinates: [19.0185, 72.8435],
    severity: "critical",
    waterLevel: "1.4m",
  },
  {
    id: "sos-903",
    type: "incident",
    title: "Evacuation Request: Maternity Patient",
    description: "Sion Koliwada Lane 4. Ground floor flooded. Requires safe transfer to Sion Hospital.",
    coordinates: [19.037, 72.861],
    severity: "high",
    waterLevel: "0.9m",
  },
  {
    id: "craft-01",
    type: "rescuer",
    title: "NDRF Zodiac-Alpha (3 Rescuers)",
    description: "Equipped with outboard motor, thermal imaging, ropes, trauma pack. En route to SOS-901.",
    coordinates: [19.066, 72.881],
    assignedTeam: "Alpha-1",
  },
  {
    id: "craft-02",
    type: "rescuer",
    title: "SDRF Amphibious ARV-Bravo",
    description: "8-wheel high-clearance rescue vehicle. Active near Dadar TT circle.",
    coordinates: [19.021, 72.844],
    assignedTeam: "Bravo-2",
  },
  {
    id: "hlz-01",
    type: "shelter",
    title: "HLZ & Extraction Pier: Kurla Station Yard",
    description: "Designated Air Force / Navy Chetak helicopter winch extraction area & medical triage point.",
    coordinates: [19.0645, 72.878],
    capacity: 450,
  },
];

const TACTICAL_HAZARD_ZONES = [
  {
    center: [19.0694, 72.8835] as [number, number],
    radiusMeters: 750,
    color: "#dc2626",
    label: "SOS Flash Inundation Zone (Current: 2.1m)",
  },
  {
    center: [19.0185, 72.8435] as [number, number],
    radiusMeters: 550,
    color: "#dc2626",
    label: "Hindmata Depression Submersion",
  },
];

export default function RescuerMapPage() {
  const [selectedBeacon, setSelectedBeacon] = React.useState<MapMarkerItem | null>(RESCUE_TACTICAL_MARKERS[0]);
  const [dispatchedUnits, setDispatchedUnits] = React.useState<Record<string, string>>({
    "sos-901": "NDRF Zodiac-Alpha (En Route)",
  });
  const [actionSuccess, setActionSuccess] = React.useState<string | null>(null);

  const handleDispatch = (beaconId: string, teamName: string) => {
    setDispatchedUnits((prev) => ({ ...prev, [beaconId]: `${teamName} (Dispatched)` }));
    setActionSuccess(`Order dispatched: ${teamName} assigned to coordinates.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Rescuer Tactical Command Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              DEFENSE & RAPID EXTRACTION GIS GRID
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Tactical Flood Response & Field Unit Dispatch
          </h1>
          <p className="text-sm text-slate-600">
            Real-time GPS tracking of active distress signals, amphibious craft, inflatable boats, and safe landing zones.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="border-sky-300 bg-sky-50 text-sky-900 font-mono text-xs py-1 px-2.5">
            SATELLITE FREQ: 148.525 MHz
          </Badge>
          <Button variant="default" size="sm" className="font-semibold text-xs bg-slate-900 text-white">
            <Radio className="h-3.5 w-3.5 mr-1.5" />
            Ping Fleet GPS
          </Button>
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {actionSuccess}
        </div>
      )}

      {/* Responder Tactical Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-red-50/80 rounded border border-red-300">
          <div className="flex items-center justify-between text-xs font-semibold text-red-900">
            <span>Critical SOS Beacons</span>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-xl font-mono font-bold text-red-900 mt-1">2 Urgent</div>
          <div className="text-[11px] text-red-700">6 Citizens at immediate risk</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Boats on Water</span>
            <LifeBuoy className="h-4 w-4 text-sky-600" />
          </div>
          <div className="text-xl font-mono font-bold text-slate-900 mt-1">6 Inflatable / ARV</div>
          <div className="text-[11px] text-slate-500">100% telemetry online</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Extracted Today</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-xl font-mono font-bold text-slate-900 mt-1">42 Civilians</div>
          <div className="text-[11px] text-emerald-700">Zero casualties reported</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Response Velocity</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-xl font-mono font-bold text-slate-900 mt-1">11.4 Mins</div>
          <div className="text-[11px] text-slate-500">Average time to reach target</div>
        </div>
      </div>

      {/* Main Tactical Map & Dispatch Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left GIS Screen (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between bg-slate-900 text-slate-200 px-3 py-2 rounded text-xs font-mono">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE TACTICAL DISPATCH SCREEN • SECTOR 4 MUMBAI METRO
            </span>
            <span className="text-slate-400 text-[11px]">ZOOM: 12.5 • DATUM: WGS84</span>
          </div>

          <div className="relative">
            <DynamicFloodMap
              markers={RESCUE_TACTICAL_MARKERS}
              hazardZones={TACTICAL_HAZARD_ZONES}
              height="600px"
              onMarkerClick={(marker) => setSelectedBeacon(marker)}
            />
          </div>

          {/* Tactical Action Bar */}
          <div className="bg-white border border-slate-200 rounded p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 text-slate-600 font-mono text-[11px]">
              <span>🔴 Live SOS Pin</span>
              <span>🚤 Rescue Craft Unit</span>
              <span>🏛️ Extraction HLZ Staging</span>
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              Coordinated by NDRF 4th Battalion Command Desk
            </div>
          </div>
        </div>

        {/* Right Tactical Mission Dossier (1 col) */}
        <div className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="p-4 pb-2 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Selected Mission Target</span>
                {selectedBeacon && (
                  <Badge variant="outline" className="font-mono text-[10px] uppercase">
                    {selectedBeacon.id}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {selectedBeacon ? (
                <>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                        TYPE: {selectedBeacon.type}
                      </span>
                      {selectedBeacon.severity && <SeverityBadge severity={selectedBeacon.severity} />}
                    </div>
                    <div className="font-bold text-sm text-slate-900 mt-1">{selectedBeacon.title}</div>
                    {selectedBeacon.description && (
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedBeacon.description}</p>
                    )}
                  </div>

                  {/* Telemetry data grid */}
                  <div className="bg-slate-50 border border-slate-200 rounded p-2.5 space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Coordinates:</span>
                      <span className="text-slate-900 font-bold">
                        {selectedBeacon.coordinates[0].toFixed(5)}, {selectedBeacon.coordinates[1].toFixed(5)}
                      </span>
                    </div>
                    {selectedBeacon.waterLevel && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Water Depth:</span>
                        <span className="text-red-700 font-bold">{selectedBeacon.waterLevel}</span>
                      </div>
                    )}
                    {selectedBeacon.capacity && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Shelter Capacity:</span>
                        <span className="text-blue-700 font-bold">{selectedBeacon.capacity} civilians</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dispatch Status:</span>
                      <span className="text-emerald-700 font-bold">
                        {dispatchedUnits[selectedBeacon.id] || "Pending Assignment"}
                      </span>
                    </div>
                  </div>

                  {/* Unit Dispatch Actions */}
                  {selectedBeacon.type === "incident" && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                        Direct Field Unit Assignment:
                      </label>
                      <div className="space-y-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-between text-xs font-mono h-8 border-slate-300"
                          onClick={() => handleDispatch(selectedBeacon.id, "Team Alpha (Zodiac-1)")}
                        >
                          <span>Deploy Team Alpha (Zodiac)</span>
                          <Send className="h-3 w-3 text-slate-500" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-between text-xs font-mono h-8 border-slate-300"
                          onClick={() => handleDispatch(selectedBeacon.id, "Team Bravo (Amphibious ARV)")}
                        >
                          <span>Deploy Team Bravo (ARV)</span>
                          <Send className="h-3 w-3 text-slate-500" />
                        </Button>
                        <Button
                          variant="emergency"
                          size="sm"
                          className="w-full text-xs font-bold h-8"
                          onClick={() => handleDispatch(selectedBeacon.id, "Emergency Heli Winch 01")}
                        >
                          Request Helicopter Winch Extraction
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs text-slate-500 text-center py-6">
                  Select any marker on the map to inspect telemetry and dispatch tactical units.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Fleet Radio Roster */}
          <Card className="border-slate-200">
            <CardHeader className="p-4 pb-2 border-b border-slate-100">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Active Tactical Fleet Roster
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-800 font-mono">ZODIAC-ALPHA-1</div>
                  <div className="text-[11px] text-slate-500">Mithi River Basin • 3 Crew</div>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-800 text-[10px] font-mono">
                  EN ROUTE
                </Badge>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-800 font-mono">ARV-BRAVO-2</div>
                  <div className="text-[11px] text-slate-500">Dadar TT Circle • 4 Crew</div>
                </div>
                <Badge variant="outline" className="bg-sky-50 text-sky-800 text-[10px] font-mono">
                  STANDBY
                </Badge>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-800 font-mono">CHETAK-AIR-03</div>
                  <div className="text-[11px] text-slate-500">Helipad Juhu • 2 Pilots</div>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-800 text-[10px] font-mono">
                  FUELING
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
