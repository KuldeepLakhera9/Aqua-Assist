"use client";

import * as React from "react";
import {
  Bot,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Camera,
  MapPin,
  Clock,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface VerificationQueueItem {
  id: string;
  location: string;
  reportedAt: string;
  severity: "critical" | "high" | "advisory";
  waterLevel: string;
  aiConfidence: number;
  visionScore: number;
  geospatialAlignment: boolean;
  status: "pending" | "verified" | "rejected";
  summary: string;
  imageUrl?: string;
}

const INITIAL_QUEUE: VerificationQueueItem[] = [
  {
    id: "REP-981",
    location: "Kranti Nagar, Kurla West (19.0688, 72.8826)",
    reportedAt: "12 mins ago",
    severity: "critical",
    waterLevel: "1.8 meters (Chest-deep)",
    aiConfidence: 96,
    visionScore: 98,
    geospatialAlignment: true,
    status: "pending",
    summary: "High-turbidity standing floodwater detected. Optical analysis confirms inundation breaching residential thresholds. CWC sensor STN-01 reports coincident river rise.",
  },
  {
    id: "REP-982",
    location: "Hindmata Flyover Subway (19.0178, 72.8428)",
    reportedAt: "24 mins ago",
    severity: "high",
    waterLevel: "1.2 meters (Waist-deep)",
    aiConfidence: 91,
    visionScore: 92,
    geospatialAlignment: true,
    status: "pending",
    summary: "Vehicle partially submerged up to hubcaps. Roadway depression confirmed by GIS elevation model. Storm runoff overload.",
  },
  {
    id: "REP-983",
    location: "Sion Circle Gandhi Market (19.0354, 72.8596)",
    reportedAt: "45 mins ago",
    severity: "advisory",
    waterLevel: "0.45 meters (Knee-deep)",
    aiConfidence: 84,
    visionScore: 86,
    geospatialAlignment: true,
    status: "pending",
    summary: "Surface pooling adjacent to commercial storefronts. Drain backflow identified by hydraulic sensor network.",
  },
  {
    id: "REP-984",
    location: "Bandra Reclamation Promenade (19.0432, 72.8198)",
    reportedAt: "1 hour ago",
    severity: "advisory",
    waterLevel: "0.15 meters (Ankle-deep)",
    aiConfidence: 42,
    visionScore: 38,
    geospatialAlignment: false,
    status: "pending",
    summary: "Flagged: Low water level with non-inundation imagery (sea spray). Model detected ocean wave splashes rather than stormwater flood pooling.",
  },
];

export default function AdminVerificationPage() {
  const [queue, setQueue] = React.useState<VerificationQueueItem[]>(INITIAL_QUEUE);
  const [selectedItem, setSelectedItem] = React.useState<VerificationQueueItem>(INITIAL_QUEUE[0]);
  const [isBulkProcessing, setIsBulkProcessing] = React.useState(false);
  const [auditMessage, setAuditMessage] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleAction = (id: string, action: "verified" | "rejected") => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
    if (selectedItem?.id === id) {
      setSelectedItem((prev) => ({ ...prev, status: action }));
    }
    setAuditMessage(
      `Report ${id} marked as ${action.toUpperCase()} and logged to NDOC statutory record.`
    );
    setTimeout(() => setAuditMessage(null), 4000);
  };

  const handleBulkVerify = () => {
    setIsBulkProcessing(true);
    setTimeout(() => {
      setQueue((prev) =>
        prev.map((item) =>
          item.aiConfidence >= 85 ? { ...item, status: "verified" } : item
        )
      );
      setIsBulkProcessing(false);
      setAuditMessage("Batch AI verification executed. All reports with confidence ≥85% automatically certified.");
      setTimeout(() => setAuditMessage(null), 5000);
    }, 1500);
  };

  const filteredQueue = queue.filter(
    (item) =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = queue.filter((i) => i.status === "pending").length;
  const verifiedCount = queue.filter((i) => i.status === "verified").length;

  return (
    <div className="space-y-6">
      {/* Verification Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
              AI COMPUTER VISION & CROSS-SENSOR CORROBORATION ENGINE
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Automated AI Incident Verification & Triage
          </h1>
          <p className="text-sm text-slate-600">
            Multi-modal verification analyzing uploaded citizen imagery, water depth estimation, CWC river transponder alignment, and hoax detection.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="border-slate-300 font-mono text-xs py-1 px-2.5">
            MODEL: AquaVision-v2.4
          </Badge>
          <Button
            variant="default"
            size="sm"
            onClick={handleBulkVerify}
            disabled={isBulkProcessing || pendingCount === 0}
            className="text-xs font-semibold bg-slate-900 text-white"
          >
            {isBulkProcessing ? (
              <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
            )}
            {isBulkProcessing ? "Batch Verifying..." : `Batch Verify (≥85% Confidence)`}
          </Button>
        </div>
      </div>

      {auditMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {auditMessage}
        </div>
      )}

      {/* KPI Ticker Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Awaiting Verification</span>
            <Bot className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">{pendingCount} Reports</div>
          <div className="text-[11px] text-slate-500">Requires auditor sign-off</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Verified & Published</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">{verifiedCount} Reports</div>
          <div className="text-[11px] text-emerald-700">Live on citizen maps</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Mean Model Confidence</span>
            <Sparkles className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">89.4%</div>
          <div className="text-[11px] text-slate-500">Dual-pass validation</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Hoax Prevention</span>
            <ShieldCheck className="h-4 w-4 text-sky-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">99.8%</div>
          <div className="text-[11px] text-sky-700">EXIF & GPS tamper checks</div>
        </div>
      </div>

      {/* Main Verification Triage Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Queue List (1 col) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              INCOMING INCIDENT AUDIT QUEUE
            </span>
            <Badge variant="outline" className="font-mono text-xs">
              {filteredQueue.length}
            </Badge>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search report ID or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredQueue.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              const isVerified = item.status === "verified";
              const isRejected = item.status === "rejected";

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-indigo-50/70 border-indigo-300 shadow-2xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-900">{item.id}</span>
                    {isVerified ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-800 text-[10px] font-mono">
                        VERIFIED
                      </Badge>
                    ) : isRejected ? (
                      <Badge variant="outline" className="bg-red-50 text-red-800 text-[10px] font-mono">
                        REJECTED
                      </Badge>
                    ) : (
                      <SeverityBadge severity={item.severity} />
                    )}
                  </div>

                  <div className="font-semibold text-xs text-slate-800 mt-1 line-clamp-1">{item.location}</div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px] font-mono">
                    <span className="text-slate-500">{item.reportedAt}</span>
                    <span
                      className={`font-bold ${
                        item.aiConfidence >= 85
                          ? "text-emerald-700"
                          : item.aiConfidence >= 60
                          ? "text-amber-700"
                          : "text-red-700"
                      }`}
                    >
                      AI: {item.aiConfidence}% Match
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Model Forensic Inspection Dossier (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {selectedItem ? (
            <Card className="border-slate-200">
              <CardHeader className="p-4 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">AUDIT DOSSIER</span>
                    <SeverityBadge severity={selectedItem.severity} />
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 mt-1">
                    {selectedItem.id} — {selectedItem.location}
                  </CardTitle>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(selectedItem.id, "rejected")}
                    disabled={selectedItem.status === "rejected"}
                    className="text-xs font-semibold text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    Reject / Hoax
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAction(selectedItem.id, "verified")}
                    disabled={selectedItem.status === "verified"}
                    className="text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Verify & Broadcast
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-5">
                {/* AI Confidence Metric Gauge Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Overall AI Confidence
                    </span>
                    <div className="text-2xl font-mono font-bold text-indigo-700 mt-1">
                      {selectedItem.aiConfidence}%
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Ensemble Score</span>
                  </div>

                  <div className="p-3 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Optical Segmentation
                    </span>
                    <div className="text-2xl font-mono font-bold text-slate-900 mt-1">
                      {selectedItem.visionScore}%
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Water Pixel Surface</span>
                  </div>

                  <div className="p-3 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Hydro Sensor Match
                    </span>
                    <div className="text-2xl font-mono font-bold text-emerald-700 mt-1">
                      {selectedItem.geospatialAlignment ? "MATCH" : "DEVIATION"}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">CWC Telemetry Alignment</span>
                  </div>
                </div>

                {/* Algorithmic Assessment Summary */}
                <div className="p-4 rounded bg-indigo-50/50 border border-indigo-100 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-indigo-950 font-mono">
                    <Bot className="h-4 w-4 text-indigo-700" />
                    AUTOMATED FORENSIC REASONING
                  </div>
                  <p className="text-slate-700 leading-relaxed">{selectedItem.summary}</p>
                </div>

                {/* Telemetry Detail Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-2 p-3 rounded bg-slate-50 border border-slate-200">
                    <div className="text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Geographic & Hydrologic Data
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Estimated Depth:</span>
                      <span className="font-bold text-red-700">{selectedItem.waterLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Drainage Catchment:</span>
                      <span className="font-bold text-slate-900">Mithi River Basin</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Elevation Datum:</span>
                      <span className="font-bold text-slate-900">3.2m above MSL</span>
                    </div>
                  </div>

                  <div className="space-y-2 p-3 rounded bg-slate-50 border border-slate-200">
                    <div className="text-[11px] font-bold uppercase text-slate-600 mb-1">
                      Image EXIF & Integrity Checks
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Camera Model:</span>
                      <span className="font-bold text-slate-900">Pixel 8 Pro</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">GPS Timestamp:</span>
                      <span className="font-bold text-slate-900">Synchronized</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tamper Status:</span>
                      <span className="font-bold text-emerald-700">UNALTERED (Hash Verified)</span>
                    </div>
                  </div>
                </div>

                {/* Audit Signature Footnote */}
                <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3 flex items-center justify-between font-mono">
                  <span>DISASTER MANAGEMENT ACT 2005 • SECTION 38 CERTIFICATION</span>
                  <span>CURRENT STATUS: {selectedItem.status.toUpperCase()}</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">
              Select an incident from the audit queue to inspect neural verification telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
