"use client";

import * as React from "react";
import {
  AlertTriangle,
  LifeBuoy,
  Clock,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Send,
  Search,
  Filter,
  Users,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface DistressRequest {
  id: string;
  citizenName: string;
  phone: string;
  location: string;
  coordinates: string;
  peopleTrapped: number;
  waterDepth: string;
  medicalPriority: string;
  severity: "critical" | "high" | "advisory";
  status: "queued" | "dispatched" | "on_scene" | "extracted";
  assignedUnit?: string;
  reportedAt: string;
}

const DISTRESS_REQUESTS_LOG: DistressRequest[] = [
  {
    id: "SOS-881",
    citizenName: "Ramesh Pawar",
    phone: "+91 98201 XXXXX",
    location: "Kranti Nagar, Building 4, Rooftop",
    coordinates: "19.0694° N, 72.8835° E",
    peopleTrapped: 4,
    waterDepth: "2.1m (Rapid Rising)",
    medicalPriority: "Elderly citizen requires oxygen support",
    severity: "critical",
    status: "dispatched",
    assignedUnit: "ZODIAC-ALPHA-1",
    reportedAt: "8 mins ago",
  },
  {
    id: "SOS-882",
    citizenName: "Deepak Sharma",
    phone: "+91 97690 XXXXX",
    location: "Hindmata Flyover Subway, Trapped in Van",
    coordinates: "19.0185° N, 72.8435° E",
    peopleTrapped: 2,
    waterDepth: "1.4m",
    medicalPriority: "Hypothermia risk, water at window level",
    severity: "critical",
    status: "dispatched",
    assignedUnit: "ARV-BRAVO-2",
    reportedAt: "16 mins ago",
  },
  {
    id: "SOS-883",
    citizenName: "Pooja Patil",
    phone: "+91 99203 XXXXX",
    location: "Sion Koliwada Lane 4, Ground Floor",
    coordinates: "19.0370° N, 72.8610° E",
    peopleTrapped: 3,
    waterDepth: "0.9m",
    medicalPriority: "Pregnant woman (8th month), safe transfer to Sion Hospital",
    severity: "high",
    status: "queued",
    reportedAt: "25 mins ago",
  },
  {
    id: "SOS-884",
    citizenName: "Vikram Malhotra",
    phone: "+91 98199 XXXXX",
    location: "Milan Subway Underpass",
    coordinates: "19.0812° N, 72.8397° E",
    peopleTrapped: 1,
    waterDepth: "1.7m",
    medicalPriority: "None (Climbed on top of SUV)",
    severity: "high",
    status: "extracted",
    assignedUnit: "ZODIAC-ALPHA-1",
    reportedAt: "45 mins ago",
  },
];

export default function RescuerRequestsPage() {
  const [requests, setRequests] = React.useState<DistressRequest[]>(DISTRESS_REQUESTS_LOG);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const filteredRequests = requests.filter((r) => {
    const matchesStatus = selectedStatus === "all" || r.status === selectedStatus;
    const matchesSearch =
      r.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updateRequestStatus = (id: string, newStatus: DistressRequest["status"]) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    const req = requests.find((r) => r.id === id);
    setToastMessage(`Distress signal ${id} updated to status: ${newStatus.toUpperCase()}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const criticalCount = requests.filter((r) => r.severity === "critical" && r.status !== "extracted").length;
  const activeDispatches = requests.filter((r) => r.status === "dispatched" || r.status === "on_scene").length;

  return (
    <div className="space-y-6">
      {/* Rescuer Requests Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
              EMERGENCY SOS DISPATCH & TRIAGE QUEUE
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Distress Logs & Citizen Extraction Requests
          </h1>
          <p className="text-sm text-slate-600">
            Real-time feed of urgent SOS signals transmitted from citizen mobile devices, emergency helpline 1078, and police control rooms.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="border-red-300 bg-red-50 text-red-900 font-mono text-xs py-1 px-2.5">
            {criticalCount} CRITICAL DISTRESS ACTIVE
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
        <div className="p-3 bg-red-50/80 rounded border border-red-300">
          <div className="flex items-center justify-between text-xs font-semibold text-red-900">
            <span>Critical Distress Active</span>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-red-900 mt-1">{criticalCount} Signals</div>
          <div className="text-[11px] text-red-700">Immediate threat to life</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Boats En Route</span>
            <LifeBuoy className="h-4 w-4 text-sky-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-sky-700 mt-1">{activeDispatches} Active</div>
          <div className="text-[11px] text-sky-700">Navigating to coordinates</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Citizens Trapped</span>
            <Users className="h-4 w-4 text-slate-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">
            {requests.filter((r) => r.status !== "extracted").reduce((acc, curr) => acc + curr.peopleTrapped, 0)} Persons
          </div>
          <div className="text-[11px] text-slate-500">Awaiting extraction completion</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Median Transit Time</span>
            <Clock className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">11.4 min</div>
          <div className="text-[11px] text-emerald-700">Under 15 min NDRF SLA</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: "All Requests" },
            { id: "queued", label: "Awaiting Dispatch" },
            { id: "dispatched", label: "In Route" },
            { id: "extracted", label: "Safely Extracted" },
          ].map((cat) => (
            <Button
              key={cat.id}
              variant={selectedStatus === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(cat.id)}
              className="text-xs h-7 shrink-0"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Search citizen, location, SOS ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* Distress Master Table */}
      <Card className="border-slate-200">
        <CardHeader className="p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">
              Live SOS Distress Queue
            </CardTitle>
            <p className="text-xs text-slate-500">
              Ordered by urgency level & proximity to operational rescue craft
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {filteredRequests.length} INCIDENTS
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-4">SOS ID & Citizen</th>
                <th className="py-2.5 px-4">Location & Coordinates</th>
                <th className="py-2.5 px-4 text-center">Trapped</th>
                <th className="py-2.5 px-4">Water Depth</th>
                <th className="py-2.5 px-4">Medical / Urgency Note</th>
                <th className="py-2.5 px-4">Assigned Unit</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-center">Tactical Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRequests.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.citizenName}</div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {item.id} • {item.phone}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-800">{item.location}</div>
                    <div className="text-[10px] font-mono text-slate-500">{item.coordinates}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                    {item.peopleTrapped}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-red-700">{item.waterDepth}</td>
                  <td className="py-3 px-4 text-slate-700 text-[11px] max-w-xs">{item.medicalPriority}</td>
                  <td className="py-3 px-4 font-mono text-[11px] font-bold text-slate-800">
                    {item.assignedUnit || "UNASSIGNED"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        item.status === "dispatched"
                          ? "bg-blue-50 text-blue-800 border border-blue-200"
                          : item.status === "on_scene"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : item.status === "extracted"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.status === "queued" ? (
                      <Button
                        variant="emergency"
                        size="sm"
                        onClick={() => updateRequestStatus(item.id, "dispatched")}
                        className="text-xs h-7 px-2 font-semibold"
                      >
                        Dispatch Zodiac
                      </Button>
                    ) : item.status === "dispatched" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateRequestStatus(item.id, "extracted")}
                        className="text-xs h-7 px-2 font-semibold border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        Mark Extracted
                      </Button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-mono font-bold">Rescued ✓</span>
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
