"use client";

import * as React from "react";
import Link from "next/link";
import {
  PhoneCall,
  Shield,
  LifeBuoy,
  Hospital,
  Building,
  Flame,
  Radio,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import { GovHeader } from "@/components/layout/GovHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SERVICES_DIRECTORY = [
  {
    category: "Search & Rescue Units",
    services: [
      { name: "National Disaster Response Force (NDRF)", number: "1077", contact: "011-24363260", location: "HQ New Delhi & Regional Battalions" },
      { name: "State Disaster Response Force (SDRF)", number: "1070", contact: "SEOC Emergency Desk", location: "State Operations Center" },
      { name: "Indian Coast Guard SAR", number: "1554", contact: "Maritime Rescue Coordination", location: "Coastal Zones" },
      { name: "Indian Army Disaster Relief Column", number: "112", contact: "Integrated Command", location: "Assigned Garrison" },
    ],
  },
  {
    category: "Medical & Trauma Care",
    services: [
      { name: "National Emergency Ambulance", number: "108", contact: "24/7 ALS/BLS Fleet", location: "Nationwide" },
      { name: "Red Cross Disaster Medical Corps", number: "011-23716441", contact: "Mobile First Aid Clinics", location: "Zonal Relief Camps" },
      { name: "National Poison Information Center", number: "1800-116-117", contact: "AIIMS Toxicological Desk", location: "New Delhi" },
    ],
  },
  {
    category: "Municipal & Civil Defense",
    services: [
      { name: "Municipal Disaster Control (MCGM)", number: "1916", contact: "Direct Command", location: "Mumbai City & Suburbs" },
      { name: "Fire & Rapid Hazard Response", number: "101", contact: "Emergency Fire Services", location: "All Urban Wards" },
      { name: "Police Emergency Network", number: "100 / 112", contact: "City Police Control", location: "All Jurisdictions" },
    ],
  },
];

export default function EmergencyServicesDirectoryPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <GovHeader portalName="Emergency Services Directory" />

      <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Official Emergency Services & Rescue Agency Directory
              </h1>
              <Badge variant="outline" className="border-slate-300 bg-white text-slate-700 text-xs font-mono">
                DIRECTORY
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Direct hotlines to first responders, naval rescue groups, emergency triage hospitals, and municipal drainage cells.
            </p>
          </div>

          <Link href="/emergency">
            <Button variant="emergency" size="sm" className="text-xs h-9">
              <LifeBuoy className="h-4 w-4 mr-1.5" />
              Flash SOS Console
            </Button>
          </Link>
        </div>

        {/* Directory Categorized Cards */}
        <div className="space-y-6">
          {SERVICES_DIRECTORY.map((cat, idx) => (
            <Card key={idx} className="border-slate-200">
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60">
                <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {cat.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-slate-100">
                {cat.services.map((srv, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{srv.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {srv.contact} • Sector: {srv.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-base font-extrabold text-blue-700">
                        {srv.number}
                      </span>
                      <a
                        href={`tel:${srv.number}`}
                        className="inline-flex items-center px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-900 shadow-2xs"
                      >
                        <PhoneCall className="h-3 w-3 mr-1 text-emerald-700" />
                        Call
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
