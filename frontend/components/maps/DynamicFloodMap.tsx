"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { MapMarkerItem } from "./map-constants";

const FloodMapClient = dynamic(() => import("./FloodMapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-slate-900 rounded border border-slate-800 flex flex-col items-center justify-center text-slate-400 p-6 animate-pulse">
      <div className="h-10 w-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
      <div className="text-sm font-semibold tracking-wide text-slate-200">
        INITIALIZING GIS CARTOGRAPHIC TELEMETRY
      </div>
      <div className="text-xs text-slate-500 font-mono mt-1">
        Calibrating OpenStreetMap basemap & tactical coordinates...
      </div>
    </div>
  ),
});

export interface DynamicFloodMapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  markers?: MapMarkerItem[];
  hazardZones?: Array<{
    center: [number, number];
    radiusMeters: number;
    color: string;
    label: string;
  }>;
  routePolyline?: Array<[number, number]>;
  height?: string;
  onMarkerClick?: (marker: MapMarkerItem) => void;
  showLayersControl?: boolean;
}

export default function DynamicFloodMap(props: DynamicFloodMapProps) {
  return <FloodMapClient {...props} />;
}

export type { MapMarkerItem };
