"use client";

import * as React from "react";
import {
  Truck,
  Wrench,
  Fuel,
  Package,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Send,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface MunicipalResource {
  id: string;
  name: string;
  depot: string;
  totalQuantity: number;
  availableQuantity: number;
  deployedQuantity: number;
  unit: string;
  condition: "ready" | "in_use" | "servicing";
  operatorAssigned: string;
}

const MUNICIPAL_RESOURCES: MunicipalResource[] = [
  {
    id: "MCGM-PMP-101",
    name: "Heavy Diesel Dewatering Rig (2,000 GPM)",
    depot: "Dadar Central SWD Depot",
    totalQuantity: 16,
    availableQuantity: 3,
    deployedQuantity: 13,
    unit: "pumps",
    condition: "in_use",
    operatorAssigned: "BMC Mechanized Drainage Squad",
  },
  {
    id: "MCGM-JET-102",
    name: "Super-Sucker Vacuum Jetting Tanker",
    depot: "Kurla West Drainage Yard",
    totalQuantity: 8,
    availableQuantity: 2,
    deployedQuantity: 6,
    unit: "tankers",
    condition: "in_use",
    operatorAssigned: "Ward L Desilting Contractors",
  },
  {
    id: "MCGM-SND-103",
    name: "Heavy Sandbags (Reinforced Burlap)",
    depot: "Bandra Reclamation Stockpile",
    totalQuantity: 15000,
    availableQuantity: 6500,
    deployedQuantity: 8500,
    unit: "bags",
    condition: "ready",
    operatorAssigned: "MCGM Embankment Crew",
  },
  {
    id: "MCGM-GEN-104",
    name: "Mobile Diesel Generators (45 kVA)",
    depot: "Andheri SWD Engineering Hub",
    totalQuantity: 12,
    availableQuantity: 5,
    deployedQuantity: 7,
    unit: "generators",
    condition: "ready",
    operatorAssigned: "Electrical Wing Crew #4",
  },
  {
    id: "MCGM-SUB-105",
    name: "High-Head Submersible Sludge Pumps (800 GPM)",
    depot: "Sion Matunga Depot",
    totalQuantity: 20,
    availableQuantity: 4,
    deployedQuantity: 16,
    unit: "submersibles",
    condition: "in_use",
    operatorAssigned: "Ward F-North Rapid Dewatering",
  },
];

export default function MunicipalityResourcesPage() {
  const [resources, setResources] = React.useState<MunicipalResource[]>(MUNICIPAL_RESOURCES);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const filteredResources = resources.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.depot.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuickDeploy = (id: string) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === id && r.availableQuantity > 0
          ? {
              ...r,
              availableQuantity: r.availableQuantity - 1,
              deployedQuantity: r.deployedQuantity + 1,
            }
          : r
      )
    );
    const item = resources.find((r) => r.id === id);
    setToastMessage(`Deployed 1 unit of ${item?.name} to active ward emergency.`);
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
              MUNICIPAL DRAINAGE EQUIPMENT & DEPOT INVENTORY
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Dewatering Machinery & Ward Stockpiles
          </h1>
          <p className="text-sm text-slate-600">
            Real-time readiness of municipal dewatering rigs, vacuum jetting suction units, sandbag reserves, and backup generators.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="border-teal-300 bg-teal-50 text-teal-900 font-mono text-xs py-1 px-2.5">
            5 WARD DEPOTS CONNECTED
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
            <span>Dewatering Pumps</span>
            <Wrench className="h-4 w-4 text-sky-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">48 Total</div>
          <div className="text-[11px] text-sky-700">33 Pumps active in field</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Sandbag Stockpile</span>
            <Package className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-700 mt-1">15,000 Bags</div>
          <div className="text-[11px] text-amber-700">6,500 Available for bunding</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Vacuum Jetting Tankers</span>
            <Truck className="h-4 w-4 text-slate-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">8 Units</div>
          <div className="text-[11px] text-slate-500">Continuous desilting shifts</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Emergency Generators</span>
            <Fuel className="h-4 w-4 text-teal-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-teal-800 mt-1">12 Rigs</div>
          <div className="text-[11px] text-teal-800">Powering subway pump sumps</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
        <Input
          placeholder="Search equipment name or depot..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-8 text-xs bg-white"
        />
      </div>

      {/* Master Table */}
      <Card className="border-slate-200">
        <CardHeader className="p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">
              Ward Mechanical Stockpile Register
            </CardTitle>
            <p className="text-xs text-slate-500">
              Logistics verified by Municipal Ward Engineers
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {filteredResources.length} ASSETS
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Equipment ID & Nomenclature</th>
                <th className="py-2.5 px-4">Depot Location</th>
                <th className="py-2.5 px-4 text-right">Available</th>
                <th className="py-2.5 px-4 text-right">In Field</th>
                <th className="py-2.5 px-4 text-right">Total</th>
                <th className="py-2.5 px-4">Operating Crew</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredResources.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[10px] font-mono text-slate-500">{item.id}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{item.depot}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                    {item.availableQuantity.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-sky-700">
                    {item.deployedQuantity.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {item.totalQuantity.toLocaleString()} {item.unit}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">{item.operatorAssigned}</td>
                  <td className="py-3 px-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickDeploy(item.id)}
                      disabled={item.availableQuantity === 0}
                      className="text-xs h-7 px-2 font-semibold border-slate-300"
                    >
                      Deploy Unit
                    </Button>
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
