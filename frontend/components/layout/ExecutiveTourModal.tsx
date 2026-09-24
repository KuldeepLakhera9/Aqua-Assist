"use client";

import * as React from "react";
import Link from "next/link";
import {
  Compass,
  Shield,
  Building2,
  LifeBuoy,
  User,
  Bot,
  MapPin,
  CheckCircle2,
  Layers,
  ArrowRight,
  ExternalLink,
  Sparkles,
  X,
  CreditCard,
  CloudRain,
  PhoneCall,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TourScenario {
  id: string;
  number: string;
  role: "citizen" | "admin" | "rescuer" | "municipality";
  title: string;
  subtitle: string;
  description: string;
  targetUrl: string;
  highlights: string[];
  roleCredentials: { roleName: string; email: string; pass: string };
}

const TOUR_SCENARIOS: TourScenario[] = [
  {
    id: "sc-1",
    number: "01",
    role: "citizen",
    title: "Incident Inundation & Flash SOS Dispatch",
    subtitle: "Public Safety & Community Ground Truth",
    description:
      "Witness how citizens submit geolocated flood reports with water depth cards and trigger instantaneous SOS alerts directly to the regional disaster command.",
    targetUrl: "/report-flood",
    highlights: [
      "HTML5 Drag & Drop incident media dropzone",
      "Instant GPS reverse geocoding with datum coords",
      "One-click Emergency SOS distress broadcasting",
    ],
    roleCredentials: {
      roleName: "Citizen",
      email: "citizen@floodmanagement.com",
      pass: "citizen123",
    },
  },
  {
    id: "sc-2",
    number: "02",
    role: "citizen",
    title: "GIS Spatial Intelligence & Evacuation Routing",
    subtitle: "Cartographic Hazards & High-Ground Pathfinding",
    description:
      "Interactive Leaflet maps displaying critical breach zones, safe shelter camps, and automated elevated corridor navigation avoiding submerged subways.",
    targetUrl: "/map",
    highlights: [
      "Custom pulsing SVG pins & danger buffer zones",
      "Turn-by-turn elevated corridor pathfinding (/evacuation)",
      "Real-time shelter camp capacity & amenities audit",
    ],
    roleCredentials: {
      roleName: "Citizen",
      email: "citizen@floodmanagement.com",
      pass: "citizen123",
    },
  },
  {
    id: "sc-3",
    number: "03",
    role: "admin",
    title: "AI Computer Vision Forensic Verification",
    subtitle: "Automated Hoax Detection & Cross-Sensor Corroboration",
    description:
      "Neural segmentation analyzing citizen flood imagery against Central Water Commission river transponders, featuring single-click batch verification.",
    targetUrl: "/admin/verification",
    highlights: [
      "Optical water pixel segmentation percentage",
      "EXIF timestamp & GPS tamper-proof certification",
      "Batch AI verification threshold (≥85% match)",
    ],
    roleCredentials: {
      roleName: "Admin",
      email: "admin@floodmanagement.com",
      pass: "admin123",
    },
  },
  {
    id: "sc-4",
    number: "04",
    role: "rescuer",
    title: "Tactical Amphibious Fleet & Distress Triage",
    subtitle: "First Responder Operations (NDRF / SDRF)",
    description:
      "Live operational board tracking Zodiac inflatable craft, stranded citizen rooftop distress queues, and emergency medical triage priorities.",
    targetUrl: "/rescuer/dashboard",
    highlights: [
      "Tactical dispatch queue with trapped civilian headcounts",
      "VHF radio callsign tracking & boat telemetry",
      "Rapid helicopter winch extraction coordination",
    ],
    roleCredentials: {
      roleName: "Rescuer",
      email: "rescuer@floodmanagement.com",
      pass: "rescuer123",
    },
  },
  {
    id: "sc-5",
    number: "05",
    role: "municipality",
    title: "Municipal Dewatering & Sluice Gate Control",
    subtitle: "Civic Stormwater Infrastructure (MCGM Mumbai)",
    description:
      "Ward-level culvert choking triage, mobile 2,000 GPM dewatering rig deployment, diesel stockpiles, and tidal sluice gate outflow monitoring.",
    targetUrl: "/municipality/dashboard",
    highlights: [
      "Ward-by-ward drainage complaints & contractor dispatch",
      "Diesel pump runtime telemetry & fuel reserves",
      "Tidal gate outflow throttled during astronomical high tide",
    ],
    roleCredentials: {
      roleName: "Municipality",
      email: "mumbai.municipality@floodmanagement.com",
      pass: "mumbai123",
    },
  },
  {
    id: "sc-6",
    number: "06",
    role: "admin",
    title: "Direct Benefit Transfer (DBT) Relief Grants",
    subtitle: "Statutory Financial Relief Ledger",
    description:
      "Aadhaar-authenticated direct disaster relief disbursements certified by Revenue Assessors and processed via NPCI / NACH banking gateways.",
    targetUrl: "/admin/financial-aid",
    highlights: [
      "Verified damage tiers (Ex-Gratia, Structural, Business)",
      "Aadhaar DBT linkage check against UIDAI registry",
      "Batch NACH electronic clearance triggers",
    ],
    roleCredentials: {
      roleName: "Admin",
      email: "admin@floodmanagement.com",
      pass: "admin123",
    },
  },
];

interface ExecutiveTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExecutiveTourModal({ isOpen, onClose }: ExecutiveTourModalProps) {
  const [activeScenario, setActiveScenario] = React.useState<TourScenario>(TOUR_SCENARIOS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded border border-slate-300 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <h2 className="text-sm font-bold tracking-wide uppercase font-mono">
                Executive Demonstration & Disaster Lifecycle Tour
              </h2>
              <p className="text-[11px] text-slate-400">
                Institutional presentation mode for ministerial, civic, and operational evaluation.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            aria-label="Close walkthrough"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: Scenarios Sidebar + Dossier View */}
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
          {/* Left Column: Scenarios List */}
          <div className="p-3 bg-slate-50 border-r border-slate-200 overflow-y-auto space-y-1.5">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
              Select Lifecycle Phase:
            </div>
            {TOUR_SCENARIOS.map((sc) => {
              const isSelected = activeScenario.id === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => setActiveScenario(sc)}
                  className={`w-full text-left p-2.5 rounded border transition-all text-xs ${
                    isSelected
                      ? "bg-white border-slate-400 shadow-xs font-semibold text-slate-900"
                      : "border-transparent hover:bg-slate-200/60 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400">PHASE {sc.number}</span>
                    <Badge variant="outline" className="text-[9px] uppercase font-mono">
                      {sc.role}
                    </Badge>
                  </div>
                  <div className="font-bold text-xs mt-0.5 truncate">{sc.title}</div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Scenario Details & Live Launch Action */}
          <div className="md:col-span-2 p-6 overflow-y-auto space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    LIFECYCLE PHASE {activeScenario.number} • {activeScenario.subtitle}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {activeScenario.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {activeScenario.description}
                </p>
              </div>

              {/* Architectural Highlights */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono block">
                  Key Institutional Capabilities:
                </span>
                <div className="space-y-1.5">
                  {activeScenario.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Credentials Box */}
              <div className="p-3 rounded bg-slate-50 border border-slate-200 text-xs font-mono space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-bold">
                  Recommended Portal Role for this Phase:
                </div>
                <div className="flex justify-between text-slate-800">
                  <span>Role: <strong>{activeScenario.roleCredentials.roleName}</strong></span>
                  <span>Email: <strong>{activeScenario.roleCredentials.email}</strong></span>
                  <span>Password: <strong>{activeScenario.roleCredentials.pass}</strong></span>
                </div>
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-slate-500">
                Route: <code className="bg-slate-100 px-1 py-0.5 rounded">{activeScenario.targetUrl}</code>
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                  Close Tour
                </Button>
                <Link href={activeScenario.targetUrl} onClick={onClose}>
                  <Button variant="default" size="sm" className="text-xs font-semibold bg-slate-900 text-white">
                    Launch Scenario Live
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
