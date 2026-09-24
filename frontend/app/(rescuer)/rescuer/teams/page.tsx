"use client";

import * as React from "react";
import {
  Users,
  Radio,
  LifeBuoy,
  MapPin,
  CheckCircle2,
  Clock,
  Send,
  Shield,
  Activity,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface RescueTeam {
  id: string;
  callsign: string;
  agency: "NDRF" | "SDRF" | "Navy" | "Civil Defense";
  commander: string;
  crewCount: number;
  craftAssigned: string;
  currentSector: string;
  coordinates: string;
  status: "deployed" | "patrol" | "standby";
  radioFreq: string;
  rescuedToday: number;
}

const RESCUE_TEAMS_DATA: RescueTeam[] = [
  {
    id: "UNIT-ALPHA-01",
    callsign: "ZODIAC-ALPHA-1",
    agency: "NDRF",
    commander: "Inspector V. K. Rathore (NDRF)",
    crewCount: 4,
    craftAssigned: "Zodiac Inflatable Heavy Boat (40HP)",
    currentSector: "Sector 4 — Kranti Nagar / Mithi Embankment",
    coordinates: "19.0694° N, 72.8835° E",
    status: "deployed",
    radioFreq: "148.525 MHz (VHF Ch 1)",
    rescuedToday: 18,
  },
  {
    id: "UNIT-BRAVO-02",
    callsign: "ARV-BRAVO-2",
    agency: "SDRF",
    commander: "Sub-Inspector Prashant Salunke",
    crewCount: 5,
    craftAssigned: "8x8 High-Clearance Amphibious Vehicle",
    currentSector: "Sector 2 — Hindmata Flyover Depression",
    coordinates: "19.0185° N, 72.8435° E",
    status: "deployed",
    radioFreq: "148.650 MHz (VHF Ch 2)",
    rescuedToday: 14,
  },
  {
    id: "UNIT-CHARLIE-03",
    callsign: "CHETAK-AIR-03",
    agency: "Navy",
    commander: "Lt. Cdr. Ananya Sharma (Indian Navy)",
    crewCount: 3,
    craftAssigned: "Chetak Winch Extraction Helicopter",
    currentSector: "Sector 1 — Juhu / Versova Coastal Buffer",
    coordinates: "19.0988° N, 72.8267° E",
    status: "standby",
    radioFreq: "123.100 MHz (Aero SAR)",
    rescuedToday: 6,
  },
  {
    id: "UNIT-DELTA-04",
    callsign: "RESCUE-PATROL-04",
    agency: "Civil Defense",
    commander: "Chief Warden Sunil Kadam",
    crewCount: 6,
    craftAssigned: "2x Rigid Inflatable Craft (RIB)",
    currentSector: "Sector 3 — Sion Koliwada Waterway",
    coordinates: "19.0370° N, 72.8610° E",
    status: "patrol",
    radioFreq: "148.775 MHz (VHF Ch 3)",
    rescuedToday: 4,
  },
];

export default function RescuerTeamsPage() {
  const [teams, setTeams] = React.useState<RescueTeam[]>(RESCUE_TEAMS_DATA);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedAgency, setSelectedAgency] = React.useState<string>("all");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const filteredTeams = teams.filter((t) => {
    const matchesAgency = selectedAgency === "all" || t.agency === selectedAgency;
    const matchesSearch =
      t.callsign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.commander.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.currentSector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAgency && matchesSearch;
  });

  const toggleStatus = (id: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === "deployed" ? "standby" : "deployed";
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
    const updated = teams.find((t) => t.id === id);
    setToastMessage(`Team ${updated?.callsign} operational status updated.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Rescuer Teams Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              TACTICAL FIELD TEAMS & FLEET ROSTER
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Rescue Battalions & Amphibious Units
          </h1>
          <p className="text-sm text-slate-600">
            Real-time status of multi-agency flood rescue units: NDRF boat teams, SDRF amphibious squads, and Naval air extraction crews.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-900 font-mono text-xs py-1 px-2.5">
            4 OF 4 TEAMS ACTIVE
          </Badge>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {toastMessage}
        </div>
      )}

      {/* KPI Ticker Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Rescue Responders</span>
            <Users className="h-4 w-4 text-slate-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">
            {teams.reduce((acc, curr) => acc + curr.crewCount, 0)} Personnel
          </div>
          <div className="text-[11px] text-slate-500">Diving & Medics certified</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Boats & Craft Active</span>
            <LifeBuoy className="h-4 w-4 text-sky-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-sky-700 mt-1">
            {teams.filter((t) => t.status === "deployed" || t.status === "patrol").length} Vessels
          </div>
          <div className="text-[11px] text-sky-700">On water right now</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Civilians Saved Today</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-700 mt-1">
            {teams.reduce((acc, curr) => acc + curr.rescuedToday, 0)} Citizens
          </div>
          <div className="text-[11px] text-emerald-700">Safely transferred to camps</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Radio Telemetry</span>
            <Radio className="h-4 w-4 text-teal-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">100%</div>
          <div className="text-[11px] text-teal-700">Zero packet drop</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: "All Agencies" },
            { id: "NDRF", label: "NDRF" },
            { id: "SDRF", label: "SDRF" },
            { id: "Navy", label: "Navy Air" },
            { id: "Civil Defense", label: "Civil Defense" },
          ].map((cat) => (
            <Button
              key={cat.id}
              variant={selectedAgency === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedAgency(cat.id)}
              className="text-xs h-7 shrink-0"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Search callsign, commander, sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* Teams Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="border-slate-200">
            <CardHeader className="p-4 pb-2 border-b border-slate-100 flex flex-row items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-900">{team.callsign}</span>
                  <Badge variant="outline" className="font-mono text-[10px] uppercase">
                    {team.agency}
                  </Badge>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">{team.commander}</div>
              </div>

              <span
                className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  team.status === "deployed"
                    ? "bg-red-50 text-red-800 border border-red-200"
                    : team.status === "patrol"
                    ? "bg-blue-50 text-blue-800 border border-blue-200"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                }`}
              >
                {team.status}
              </span>
            </CardHeader>

            <CardContent className="p-4 space-y-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded p-2.5 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Craft / Equipment:</span>
                  <span className="font-bold text-slate-900">{team.craftAssigned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Sector:</span>
                  <span className="font-bold text-slate-900">{team.currentSector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GPS Coordinates:</span>
                  <span className="font-bold text-slate-700">{team.coordinates}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tactical Radio VHF:</span>
                  <span className="font-bold text-teal-700">{team.radioFreq}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-slate-600">
                <span className="font-mono text-[11px]">
                  Crew: <strong>{team.crewCount} Specialists</strong>
                </span>
                <span className="font-mono text-[11px] text-emerald-800 font-bold">
                  {team.rescuedToday} Citizens Rescued Today
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleStatus(team.id)}
                  className="text-xs h-7 font-semibold border-slate-300"
                >
                  {team.status === "deployed" ? "Recall to Standby" : "Deploy to Hotspot"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
