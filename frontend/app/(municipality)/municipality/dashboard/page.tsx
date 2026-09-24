"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  AlertTriangle,
  Truck,
  Droplet,
  FileCheck,
  Activity,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SeverityBadge } from "@/components/ui/badge";
import { StatMetric } from "@/components/ui/stat-metric";
import { DataTable, type Column } from "@/components/ui/data-table";

interface TriageReport {
  id: string;
  zone: string;
  waterLevel: string;
  severity: "critical" | "high" | "advisory" | "normal";
  reportedBy: string;
  time: string;
  status: "pending" | "dispatched" | "resolved";
}

const mockTriageQueue: TriageReport[] = [
  {
    id: "MUM-FL-088",
    zone: "Dadar Hindmata Underpass",
    waterLevel: "1.4m (Waist-deep)",
    severity: "critical",
    reportedBy: "Field Officer K. Patil",
    time: "12m ago",
    status: "pending",
  },
  {
    id: "MUM-FL-085",
    zone: "Kurla West LBS Marg",
    waterLevel: "0.9m (Knee-deep)",
    severity: "high",
    reportedBy: "Citizen S. Merchant",
    time: "28m ago",
    status: "pending",
  },
  {
    id: "MUM-FL-081",
    zone: "Bandra SV Road Junction",
    waterLevel: "0.4m (Ankle-deep)",
    severity: "advisory",
    reportedBy: "Ward Inspector V. More",
    time: "55m ago",
    status: "dispatched",
  },
];

export default function MunicipalityDashboardPage() {
  const [triageData, setTriageData] = React.useState(mockTriageQueue);
  const [notice, setNotice] = React.useState<string | null>(null);

  const handleAction = (id: string, action: "dispatch" | "resolve") => {
    setTriageData((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: action === "dispatch" ? "dispatched" : "resolved" }
          : r
      )
    );
    setNotice(
      `Incident ${id} updated to ${action === "dispatch" ? "DISPATCHED" : "RESOLVED"}`
    );
  };

  const columns: Column<TriageReport>[] = [
    {
      header: "Incident ID",
      accessorKey: "id",
      className: "font-mono font-bold text-xs",
    },
    {
      header: "Ward / Inundation Zone",
      cell: (item) => (
        <div>
          <div className="font-semibold text-slate-900">{item.zone}</div>
          <div className="text-[11px] text-slate-500">{item.reportedBy}</div>
        </div>
      ),
    },
    {
      header: "Severity",
      cell: (item) => <SeverityBadge level={item.severity} />,
    },
    {
      header: "Water Level",
      accessorKey: "waterLevel",
      className: "font-mono text-xs tabular-nums font-medium",
    },
    {
      header: "Logged",
      accessorKey: "time",
      className: "font-mono text-xs text-slate-500",
    },
    {
      header: "Triage Decision",
      align: "right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          {item.status === "pending" ? (
            <>
              <Button
                size="sm"
                variant="default"
                className="h-7 text-xs"
                onClick={() => handleAction(item.id, "dispatch")}
              >
                Deploy Pump
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => handleAction(item.id, "resolve")}
              >
                Mark Cleared
              </Button>
            </>
          ) : (
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs ${
                item.status === "dispatched"
                  ? "bg-amber-100 text-amber-900"
                  : "bg-emerald-100 text-emerald-900"
              }`}
            >
              {item.status}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Executive Command Header */}
      <div className="border border-slate-300 bg-white p-5 rounded-md shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Municipal Disaster Response Cell
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200">
              MDRC-SEC-HQ
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950">
            Municipal Operational Situation Room
          </h1>
          <p className="text-xs text-slate-600">
            Live municipal drainage status, high-capacity pump deployments, and field incident triage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/municipality/resources">
            <Button variant="outline" size="sm">
              <Truck className="h-4 w-4 mr-1.5" />
              Manage Stockpiles
            </Button>
          </Link>
          <Link href="/municipality/reports">
            <Button variant="default" size="sm">
              <FileCheck className="h-4 w-4 mr-1.5" />
              Field Queue (12)
            </Button>
          </Link>
        </div>
      </div>

      {notice && (
        <div className="bg-slate-900 text-white text-xs px-4 py-2.5 rounded-sm flex items-center justify-between">
          <span>{notice}</span>
          <button
            onClick={() => setNotice(null)}
            className="text-slate-400 hover:text-white font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Municipal KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatMetric
          label="Unresolved Inundations"
          value="4"
          badge={<SeverityBadge level="critical" label="4 Actionable" />}
          trend={{ direction: "down", value: "8 cleared past 12h" }}
          icon={AlertTriangle}
        />
        <StatMetric
          label="High-Capacity Pumps Active"
          value="18/24"
          unit="Deployed"
          helperText="6 standby units at Central Depot"
          trend={{ direction: "neutral", value: "75% Utilization" }}
          icon={Droplet}
        />
        <StatMetric
          label="Rescue Boats Pre-Positioned"
          value="6"
          unit="Boats"
          helperText="Manned by Municipal Lifeguard Corps"
          trend={{ direction: "neutral", value: "100% Operational" }}
          icon={Truck}
        />
        <StatMetric
          label="Shelter Bed Availability"
          value="1,450"
          unit="Beds"
          helperText="Across 8 designated municipal schools"
          trend={{ direction: "up", value: "82% Capacity Free" }}
          icon={Building2}
        />
      </div>

      {/* Urgent Field Triage Queue */}
      <Card className="border-slate-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-600" />
                Urgent Incident Triage & Pump Deployment Queue
              </CardTitle>
              <CardDescription className="text-xs">
                Verified citizen reports and ward officer telemetry requiring immediate municipal resource allocation.
              </CardDescription>
            </div>
            <Link
              href="/municipality/reports"
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline"
            >
              Full Incident Register &rarr;
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <DataTable
            data={triageData}
            columns={columns}
            searchKey="zone"
            searchPlaceholder="Filter by road or underpass zone..."
            pageSize={5}
          />
        </CardContent>
      </Card>
    </div>
  );
}
