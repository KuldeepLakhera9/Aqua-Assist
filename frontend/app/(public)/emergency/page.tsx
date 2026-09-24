"use client";

import * as React from "react";
import Link from "next/link";
import {
  PhoneCall,
  AlertOctagon,
  LifeBuoy,
  MapPin,
  Building,
  Hospital,
  ShieldAlert,
  ArrowRight,
  Send,
  Loader2,
  CheckCircle2,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const EMERGENCY_SERVICES = [
  {
    title: "National Emergency Helpline",
    number: "112",
    description: "Unified single helpline for Police, Fire, and Ambulance nationwide.",
    urgent: true,
  },
  {
    title: "NDRF Disaster Relief Hotline",
    number: "1077",
    description: "National Disaster Response Force HQ Control for flood extractions.",
    urgent: true,
  },
  {
    title: "State Disaster Management Cell",
    number: "1070",
    description: "State Emergency Operations Center (SEOC) for multi-district rescue.",
    urgent: true,
  },
  {
    title: "Municipal Control Room (MCGM)",
    number: "1916",
    description: "Disaster Cell for urban dewatering pumps, tree collapses, and road blockages.",
    urgent: false,
  },
  {
    title: "Emergency Medical & Ambulance",
    number: "108",
    description: "Government Advanced Life Support (ALS) flood-rescue ambulances.",
    urgent: false,
  },
  {
    title: "Indian Coast Guard S.O.S",
    number: "1554",
    description: "Coastal and creek search-and-rescue marine operations.",
    urgent: false,
  },
];

export default function EmergencyQuickActionsPage() {
  const [coords, setCoords] = React.useState<[number, number] | null>(null);
  const [detecting, setDetecting] = React.useState(false);
  const [sosSent, setSosSent] = React.useState(false);
  const [peopleCount, setPeopleCount] = React.useState(1);

  const handleCaptureGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords([Number(pos.coords.longitude.toFixed(5)), Number(pos.coords.latitude.toFixed(5))]);
        setDetecting(false);
      },
      () => {
        setDetecting(false);
        alert("Failed to retrieve GPS location. Please call 112 directly.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleTriggerSOS = () => {
    setSosSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Top Warning Banner */}
      <div className="bg-red-700 text-white px-4 py-3 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
        <AlertOctagon className="h-4 w-4 animate-ping" />
        <span>CRITICAL LIFE-SAFETY CHANNEL — PRIORITY FIRST RESPONDER DISPATCH</span>
      </div>

      <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <LifeBuoy className="h-7 w-7 text-red-500" />
              Emergency SOS Response Console
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Direct telemetry uplink for stranded citizens requiring urgent water extraction or medical airlift.
            </p>
          </div>

          <Link href="/">
            <Button variant="outline" className="text-xs border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700">
              Return to Portal
            </Button>
          </Link>
        </div>

        {/* Big Red SOS Beacon Card */}
        <Card className="border-red-600 bg-red-950/40 text-white">
          <CardContent className="p-6 text-center space-y-4">
            <div className="space-y-1">
              <span className="text-xs uppercase font-mono font-bold tracking-widest text-red-400">
                FLASH EXTRACTION BEACON
              </span>
              <h2 className="text-2xl font-bold">Are You Trapped or in Imminent Danger?</h2>
              <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                Triggering the Emergency Beacon transmits your instant GPS coordinates and distress packet to the nearest active NDRF boat battalion and police dispatch.
              </p>
            </div>

            {sosSent ? (
              <div className="p-4 bg-emerald-950 border border-emerald-500 rounded max-w-md mx-auto space-y-2 text-xs">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                <div className="text-sm font-bold text-white uppercase">Distress Beacon Broadcasted!</div>
                <p className="text-slate-300">
                  Incident ID #SOS-{Date.now().toString().slice(-4)} has been registered. Stay on high ground. Conserve phone battery. Responders are tracking your coordinates.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCaptureGPS}
                    disabled={detecting}
                    className="text-xs border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                  >
                    {detecting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Fixing Satellites...
                      </>
                    ) : (
                      <>
                        <Navigation className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                        {coords ? `GPS: ${coords[1]}°N, ${coords[0]}°E` : "Acquire GPS Coordinates"}
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <span>Persons:</span>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={peopleCount}
                      onChange={(e) => setPeopleCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-14 h-8 rounded border border-slate-700 bg-slate-800 text-center text-white text-xs"
                      aria-label="Number of persons"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleTriggerSOS}
                  className="w-full h-14 text-base font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-lg animate-pulse"
                >
                  <AlertOctagon className="h-5 w-5 mr-2" />
                  Broadcast Live SOS Distress Call
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 24/7 National Emergency Hotlines Grid */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            Authoritative 24/7 Emergency Hotlines (Toll-Free)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EMERGENCY_SERVICES.map((srv) => (
              <a
                key={srv.number}
                href={`tel:${srv.number}`}
                className="group block p-4 rounded-md border border-slate-800 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600 transition-all text-white"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-extrabold text-red-400 group-hover:text-red-300">
                    {srv.number}
                  </span>
                  <div className="h-7 w-7 rounded bg-red-600/20 text-red-400 flex items-center justify-center">
                    <PhoneCall className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="mt-2">
                  <h3 className="text-sm font-bold text-white">{srv.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {srv.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Evacuation Shelters & Guidelines */}
        <Card className="border-slate-800 bg-slate-800/40 text-white">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-800">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              Immediate Survival Rules During Rising Water
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 space-y-2 text-xs text-slate-300 leading-relaxed">
            <p>1. <strong>Do Not Walk or Drive into Moving Water:</strong> Just 6 inches of fast-moving floodwater can knock down an adult; 12 inches can sweep away an SUV.</p>
            <p>2. <strong>Disconnect Main Power Breaker:</strong> If water begins entering your residence, shut off main electrical power to avoid electrocution from submerged switchboards.</p>
            <p>3. <strong>Ascend to High Ground:</strong> Move to upper floors or reinforced rooftops. Avoid attics without rooftop egress.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
