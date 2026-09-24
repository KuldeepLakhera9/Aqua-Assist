"use client";

import * as React from "react";
import {
  Truck,
  Package,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  Search,
  Filter,
  LifeBuoy,
  Wrench,
  Droplets,
  Shield,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ResourceItem {
  id: string;
  name: string;
  category: "vessels" | "pumps" | "shelter" | "medical" | "rations";
  depotLocation: string;
  totalQuantity: number;
  availableQuantity: number;
  deployedQuantity: number;
  status: "available" | "deployed" | "maintenance";
  unit: string;
  allocatedTo?: string;
}

const STOCKPILE_INVENTORY: ResourceItem[] = [
  {
    id: "RES-BST-01",
    name: "Zodiac Inflatable Rescue Boats (40HP OBM)",
    category: "vessels",
    depotLocation: "NDRF 05 Battalion Base - Pune",
    totalQuantity: 36,
    availableQuantity: 14,
    deployedQuantity: 22,
    status: "deployed",
    unit: "craft",
    allocatedTo: "Kurla, Hindmata & Thane Flood Sectors",
  },
  {
    id: "RES-PMP-02",
    name: "High-Capacity Dewatering Pumps (2,000 GPM)",
    category: "pumps",
    depotLocation: "BMC Central Engineering Depot - Dadar",
    totalQuantity: 48,
    availableQuantity: 8,
    deployedQuantity: 40,
    status: "deployed",
    unit: "pump units",
    allocatedTo: "Milan Subway, King's Circle, Chunabhatti",
  },
  {
    id: "RES-SHT-03",
    name: "Modular Disaster Shelter Tents (10-Person)",
    category: "shelter",
    depotLocation: "State Relief Reserve Depot - Vashi",
    totalQuantity: 500,
    availableQuantity: 280,
    deployedQuantity: 220,
    status: "available",
    unit: "tents",
    allocatedTo: "Kurla High School Camp, Dadar Stadium",
  },
  {
    id: "RES-MED-04",
    name: "Trauma & Waterborne Disease Medical Kits",
    category: "medical",
    depotLocation: "Red Cross Central Medical Store - Mumbai",
    totalQuantity: 1200,
    availableQuantity: 650,
    deployedQuantity: 550,
    status: "available",
    unit: "kits",
    allocatedTo: "Camp Medical Desks #1-#14",
  },
  {
    id: "RES-WTR-05",
    name: "Mobile RO Water Filtration Trailers",
    category: "rations",
    depotLocation: "Civil Defense Depot - Chembur",
    totalQuantity: 18,
    availableQuantity: 6,
    deployedQuantity: 12,
    status: "deployed",
    unit: "mobile units",
    allocatedTo: "Evacuation Camps Kurla & Kalina",
  },
  {
    id: "RES-AMF-06",
    name: "Amphibious All-Terrain Rescue Craft (8x8)",
    category: "vessels",
    depotLocation: "SDRF Operational Hub - Alandi",
    totalQuantity: 12,
    availableQuantity: 4,
    deployedQuantity: 8,
    status: "deployed",
    unit: "vehicles",
    allocatedTo: "SDRF Rapid Reaction Squad 2",
  },
];

export default function AdminResourcesPage() {
  const [resources, setResources] = React.useState<ResourceItem[]>(STOCKPILE_INVENTORY);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dispatchModalItem, setDispatchModalItem] = React.useState<ResourceItem | null>(null);
  const [dispatchCount, setDispatchCount] = React.useState(1);
  const [dispatchTarget, setDispatchTarget] = React.useState("Kurla Rapid Response Hub");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const filteredResources = resources.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.depotLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalAssets = resources.reduce((acc, curr) => acc + curr.totalQuantity, 0);
  const deployedAssets = resources.reduce((acc, curr) => acc + curr.deployedQuantity, 0);
  const availableAssets = resources.reduce((acc, curr) => acc + curr.availableQuantity, 0);

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchModalItem) return;

    if (dispatchCount > dispatchModalItem.availableQuantity) {
      alert("Requested dispatch count exceeds available inventory.");
      return;
    }

    setResources((prev) =>
      prev.map((r) =>
        r.id === dispatchModalItem.id
          ? {
              ...r,
              availableQuantity: r.availableQuantity - dispatchCount,
              deployedQuantity: r.deployedQuantity + dispatchCount,
            }
          : r
      )
    );

    setToastMessage(
      `Dispatched ${dispatchCount} ${dispatchModalItem.unit} of "${dispatchModalItem.name}" to ${dispatchTarget}. Logistics order signed.`
    );
    setDispatchModalItem(null);
    setDispatchCount(1);
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Stockpile Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              NATIONAL DISASTER RESOURCE NETWORK (NDRN)
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Strategic Equipment & Emergency Relief Stockpile
          </h1>
          <p className="text-sm text-slate-600">
            Real-time logistical visibility into amphibious rescue craft, dewatering pump assets, medical trauma supplies, and modular shelters.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="border-slate-300 font-mono text-xs py-1 px-2.5">
            DEPOTS MONITORED: 12
          </Badge>
          <Button
            variant="default"
            size="sm"
            onClick={() => setDispatchModalItem(resources[0])}
            className="text-xs font-semibold bg-slate-900 text-white"
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Issue Transfer Order
          </Button>
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
            <span>Total Registered Stockpile</span>
            <Package className="h-4 w-4 text-slate-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">
            {totalAssets.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">Certified NDRN Inventory</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>In Active Field Deployment</span>
            <Truck className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-blue-700 mt-1">
            {deployedAssets.toLocaleString()}
          </div>
          <div className="text-[11px] text-blue-700 font-medium">62.8% Capacity Active</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Reserve Available</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-700 mt-1">
            {availableAssets.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">Ready for immediate dispatch</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Logistics Fulfillment</span>
            <Activity className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">98.4%</div>
          <div className="text-[11px] text-slate-500">Average ETA: 45 Minutes</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: "All Categories" },
            { id: "vessels", label: "Rescue Boats & ARV" },
            { id: "pumps", label: "Dewatering Pumps" },
            { id: "shelter", label: "Modular Tents" },
            { id: "medical", label: "Medical Kits" },
            { id: "rations", label: "Water / Rations" },
          ].map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="text-xs h-7 shrink-0"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Search equipment or depot..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* Inventory Master Table */}
      <Card className="border-slate-200">
        <CardHeader className="p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">
              National Strategic Inventory Directory
            </CardTitle>
            <p className="text-xs text-slate-500">
              Live status confirmed by base logistics commanders
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {filteredResources.length} ASSET CLASSES
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Asset ID & Nomenclature</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Depot Location</th>
                <th className="py-2.5 px-4 text-right">Available</th>
                <th className="py-2.5 px-4 text-right">Deployed</th>
                <th className="py-2.5 px-4 text-right">Total Units</th>
                <th className="py-2.5 px-4">Active Deployment Zone</th>
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
                  <td className="py-3 px-4 uppercase text-[10px] font-mono text-slate-600">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 text-slate-700">{item.depotLocation}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                    {item.availableQuantity}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-blue-700">
                    {item.deployedQuantity}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {item.totalQuantity} {item.unit}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px] max-w-xs truncate">
                    {item.allocatedTo || "Reserve Depot Stock"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDispatchModalItem(item)}
                      disabled={item.availableQuantity === 0}
                      className="text-xs h-7 px-2 font-semibold border-slate-300"
                    >
                      Dispatch
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Dispatch Modal / Drawer */}
      {dispatchModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded border border-slate-300 max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700">
                  INTER-DEPOT LOGISTICS ORDER
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Dispatch: {dispatchModalItem.name}
                </h3>
              </div>
              <button
                onClick={() => setDispatchModalItem(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Source Depot:</span>
                  <span className="font-bold text-slate-800">{dispatchModalItem.depotLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Available in Reserve:</span>
                  <span className="font-bold text-emerald-700">
                    {dispatchModalItem.availableQuantity} {dispatchModalItem.unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dispatch Quantity ({dispatchModalItem.unit}):
                </label>
                <Input
                  type="number"
                  min={1}
                  max={dispatchModalItem.availableQuantity}
                  value={dispatchCount}
                  onChange={(e) => setDispatchCount(parseInt(e.target.value) || 1)}
                  className="h-8 text-xs font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination Sector / Emergency Forward Staging Hub:
                </label>
                <Input
                  value={dispatchTarget}
                  onChange={(e) => setDispatchTarget(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDispatchModalItem(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  className="text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white"
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Sign & Execute Logistics Order
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
