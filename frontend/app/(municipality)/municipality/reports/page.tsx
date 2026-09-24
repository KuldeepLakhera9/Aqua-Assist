"use client";

import * as React from "react";
import {
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Search,
  Filter,
  Layers,
  MapPin,
  Send,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface MunicipalIncident {
  id: string;
  location: string;
  ward: string;
  severity: "critical" | "high" | "advisory";
  waterLevel: string;
  description: string;
  reportedAt: string;
  assignedTeam?: string;
  status: "pending" | "in_progress" | "resolved";
}

const MUNICIPAL_INCIDENTS_ROSTER: MunicipalIncident[] = [
  {
    id: "MCGM-INC-01",
    location: "Kranti Nagar, LBS Marg Low Dip",
    ward: "Ward L (Kurla)",
    severity: "critical",
    waterLevel: "1.8 meters",
    description: "Mithi River overtopping embankment. 4 dewatering submersibles needed urgently.",
    reportedAt: "15 mins ago",
    assignedTeam: "Ward L Rapid Dewatering Team #2",
    status: "in_progress",
  },
  {
    id: "MCGM-INC-02",
    location: "Hindmata Flyover Junction Subway",
    ward: "Ward F-North (Sion)",
    severity: "high",
    waterLevel: "1.2 meters",
    description: "Conduits overflowing onto carriage-way. 2x 2,000 GPM diesel pumps engaged.",
    reportedAt: "32 mins ago",
    assignedTeam: "Central Drainage Emergency Squad",
    status: "in_progress",
  },
  {
    id: "MCGM-INC-03",
    location: "Gandhi Market Kings Circle",
    ward: "Ward F-North (Matunga)",
    severity: "advisory",
    waterLevel: "0.5 meters",
    description: "Plastic bottle choking in stormwater chamber. Vacuum suction tanker dispatched.",
    reportedAt: "50 mins ago",
    assignedTeam: "Desilting Squad #8",
    status: "in_progress",
  },
  {
    id: "MCGM-INC-04",
    location: "Milan Subway Road Corridor",
    ward: "Ward K-West (Andheri)",
    severity: "high",
    waterLevel: "1.5 meters",
    description: "Water cleared by electric pump station. Residual mud being washed away.",
    reportedAt: "2 hours ago",
    assignedTeam: "K-West Maintenance",
    status: "resolved",
  },
];

export default function MunicipalityReportsPage() {
  const [incidents, setIncidents] = React.useState<MunicipalIncident[]>(MUNICIPAL_INCIDENTS_ROSTER);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedWard, setSelectedWard] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const filteredIncidents = incidents.filter((i) => {
    const matchesWard = selectedWard === "all" || i.ward.includes(selectedWard);
    const matchesStatus = selectedStatus === "all" || i.status === selectedStatus;
    const matchesSearch =
      i.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWard && matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (id: string, newStatus: MunicipalIncident["status"]) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
    setToastMessage(`Incident ${id} triage status updated to ${newStatus.toUpperCase()}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              MUNICIPAL INCIDENT TRIAGE & REMEDIATION DISPATCH
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Ward Flood Incident Dispatch & Clearance
          </h1>
          <p className="text-sm text-slate-600">
            Civic engineer console for assigning dewatering crews, clearing storm culvert chokes, and certifying roadway traffic restoration.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-900 font-mono text-xs py-1 px-2.5">
            JURISDICTION: MUMBAI (MCGM)
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
            <span>Critical Hotspots</span>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-red-700 mt-1">
            {incidents.filter((i) => i.severity === "critical" && i.status !== "resolved").length} Sites
          </div>
          <div className="text-[11px] text-red-700">Immediate pump intervention</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>In Remediation</span>
            <Wrench className="h-4 w-4 text-sky-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-sky-700 mt-1">
            {incidents.filter((i) => i.status === "in_progress").length} Locations
          </div>
          <div className="text-[11px] text-sky-700">Pumping & desilting active</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Roadways Cleared</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-700 mt-1">
            {incidents.filter((i) => i.status === "resolved").length} Restored
          </div>
          <div className="text-[11px] text-emerald-700">Traffic normal</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Average Clearance</span>
            <Clock className="h-4 w-4 text-slate-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">1.6 Hours</div>
          <div className="text-[11px] text-slate-500">Standard SLA: 3.0 Hours</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: "All Wards" },
            { id: "Ward L", label: "Ward L (Kurla)" },
            { id: "Ward F-North", label: "Ward F-N (Sion)" },
            { id: "Ward K-West", label: "Ward K-W (Andheri)" },
          ].map((w) => (
            <Button
              key={w.id}
              variant={selectedWard === w.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedWard(w.id)}
              className="text-xs h-7 shrink-0"
            >
              {w.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Search incident location or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* Incidents Master Table */}
      <Card className="border-slate-200">
        <CardHeader className="p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">
              Active Municipal Inundation Triage Docket
            </CardTitle>
            <p className="text-xs text-slate-500">
              Assigned to MCGM Stormwater Drainage (SWD) Department
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {filteredIncidents.length} INCIDENTS
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Docket ID & Location</th>
                <th className="py-2.5 px-4">Ward</th>
                <th className="py-2.5 px-4">Severity</th>
                <th className="py-2.5 px-4">Water Depth</th>
                <th className="py-2.5 px-4">Remediation Description</th>
                <th className="py-2.5 px-4">Assigned Crew</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredIncidents.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.location}</div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {item.id} • {item.reportedAt}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-bold">{item.ward}</td>
                  <td className="py-3 px-4">
                    <SeverityBadge severity={item.severity} />
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-red-700">{item.waterLevel}</td>
                  <td className="py-3 px-4 text-slate-700 text-[11px] max-w-xs">{item.description}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-800">
                    {item.assignedTeam || "UNASSIGNED"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        item.status === "in_progress"
                          ? "bg-blue-50 text-blue-800 border border-blue-200"
                          : item.status === "resolved"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.status === "pending" ? (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleUpdateStatus(item.id, "in_progress")}
                        className="text-xs h-7 px-2 font-semibold bg-slate-900"
                      >
                        Deploy Crew
                      </Button>
                    ) : item.status === "in_progress" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(item.id, "resolved")}
                        className="text-xs h-7 px-2 font-semibold border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        Certify Cleared
                      </Button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-mono font-bold">Cleared ✓</span>
                    )}
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
