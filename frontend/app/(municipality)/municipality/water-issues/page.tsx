"use client";

import * as React from "react";
import {
  Droplet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Wrench,
  Building,
  Send,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface WaterIssueItem {
  id: string;
  category: "drainage_overflow" | "manhole_open" | "pipe_burst" | "water_contamination";
  location: string;
  ward: string;
  priority: "critical" | "high" | "advisory";
  description: string;
  contractor: string;
  status: "reported" | "crew_assigned" | "remediated";
  reportedAt: string;
}

const MUNICIPAL_WATER_ISSUES: WaterIssueItem[] = [
  {
    id: "WI-2026-101",
    category: "drainage_overflow",
    location: "LBS Marg, Near Kurla Railway Station",
    ward: "Ward L (Kurla)",
    priority: "critical",
    description: "Stormwater drain surcharging. Effluent spilling into pedestrian walkway.",
    contractor: "M/s Apex Desilting & Infrastructure",
    status: "crew_assigned",
    reportedAt: "20 mins ago",
  },
  {
    id: "WI-2026-102",
    category: "manhole_open",
    location: "Sion Circle Near Bus Depot",
    ward: "Ward F-North (Sion)",
    priority: "critical",
    description: "Cast iron manhole cover dislodged due to hydraulic surge. Danger barricade required.",
    contractor: "MCGM Emergency Roads Ward F-N",
    status: "crew_assigned",
    reportedAt: "35 mins ago",
  },
  {
    id: "WI-2026-103",
    category: "water_contamination",
    location: "Matunga Labour Camp Colony",
    ward: "Ward F-North",
    priority: "high",
    description: "Flood runoff ingress into underground municipal drinking water cistern.",
    contractor: "Hydraulic Engineer Department (Water Works)",
    status: "reported",
    reportedAt: "1 hour ago",
  },
  {
    id: "WI-2026-104",
    category: "drainage_overflow",
    location: "Dadar Portuguese Church Road",
    ward: "Ward G-North (Dadar)",
    priority: "advisory",
    description: "Gutter grating choked with leaf litter. Slow drainage.",
    contractor: "Ward G-North Sanitary Gang",
    status: "remediated",
    reportedAt: "3 hours ago",
  },
];

export default function MunicipalityWaterIssuesPage() {
  const [issues, setIssues] = React.useState<WaterIssueItem[]>(MUNICIPAL_WATER_ISSUES);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const filteredIssues = issues.filter((item) => {
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    const matchesSearch =
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ward.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (id: string, newStatus: WaterIssueItem["status"]) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
    setToastMessage(`Water grievance ${id} status updated to ${newStatus.replace("_", " ").toUpperCase()}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-600 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
              STORMWATER DRAINAGE & WATER QUALITY REMEDIATION
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Drainage Chokes & Water Grievance Triage
          </h1>
          <p className="text-sm text-slate-600">
            Municipal engineering console for managing citizen water complaints, manhole safety covers, and drainage desilting contractors.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="border-teal-300 bg-teal-50 text-teal-900 font-mono text-xs py-1 px-2.5">
            CHIEF HYDRAULIC ENGINEER DESK
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
            <span>Critical Chokes</span>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-red-900 mt-1">
            {issues.filter((i) => i.priority === "critical" && i.status !== "remediated").length} Active
          </div>
          <div className="text-[11px] text-red-700">Immediate hazard to pedestrians</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Crews On Site</span>
            <Wrench className="h-4 w-4 text-sky-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-sky-700 mt-1">
            {issues.filter((i) => i.status === "crew_assigned").length} Teams
          </div>
          <div className="text-[11px] text-sky-700">Jetting & clearing active</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Remediated Today</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-700 mt-1">
            {issues.filter((i) => i.status === "remediated").length} Tickets
          </div>
          <div className="text-[11px] text-emerald-700">Desilted & inspected</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Average Turnaround</span>
            <Clock className="h-4 w-4 text-slate-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">2.1 Hours</div>
          <div className="text-[11px] text-slate-500">Under municipal SLA</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: "All Tickets" },
            { id: "reported", label: "Pending Assignment" },
            { id: "crew_assigned", label: "Crew Engaged" },
            { id: "remediated", label: "Remediated & Closed" },
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
            placeholder="Search grievance location or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* Issues Master Table */}
      <Card className="border-slate-200">
        <CardHeader className="p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">
              Drainage & Public Health Remediation Ledger
            </CardTitle>
            <p className="text-xs text-slate-500">
              Assigned across Municipal Ward Drainage Circles
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {filteredIssues.length} TICKETS
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Ticket ID & Category</th>
                <th className="py-2.5 px-4">Location & Ward</th>
                <th className="py-2.5 px-4">Priority</th>
                <th className="py-2.5 px-4">Engineering Description</th>
                <th className="py-2.5 px-4">Remediation Contractor</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredIssues.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 capitalize">
                      {item.category.replace("_", " ")}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {item.id} • {item.reportedAt}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-800">{item.location}</div>
                    <div className="text-[10px] font-mono text-slate-500">{item.ward}</div>
                  </td>
                  <td className="py-3 px-4">
                    <SeverityBadge severity={item.priority} />
                  </td>
                  <td className="py-3 px-4 text-slate-700 text-[11px] max-w-xs">{item.description}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-800">{item.contractor}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        item.status === "crew_assigned"
                          ? "bg-blue-50 text-blue-800 border border-blue-200"
                          : item.status === "remediated"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {item.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.status === "reported" ? (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleUpdateStatus(item.id, "crew_assigned")}
                        className="text-xs h-7 px-2 font-semibold bg-slate-900"
                      >
                        Assign Crew
                      </Button>
                    ) : item.status === "crew_assigned" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(item.id, "remediated")}
                        className="text-xs h-7 px-2 font-semibold border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      >
                        Certify Safe
                      </Button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-mono font-bold">Closed ✓</span>
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
