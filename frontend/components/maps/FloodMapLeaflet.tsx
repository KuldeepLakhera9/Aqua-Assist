"use client";

import * as React from "react";
import "leaflet/dist/leaflet.css";
import {
  MapMarkerItem,
  HazardZoneItem,
  DEFAULT_MAP_MARKERS,
  DEFAULT_HAZARD_ZONES,
} from "./map-constants";

export type { MapMarkerItem, HazardZoneItem };
export { DEFAULT_MAP_MARKERS, DEFAULT_HAZARD_ZONES };

interface FloodMapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  markers?: MapMarkerItem[];
  hazardZones?: HazardZoneItem[];
  height?: string;
  onMarkerClick?: (marker: MapMarkerItem) => void;
  showLayersControl?: boolean;
}

export default function FloodMapLeaflet({
  initialCenter = [19.055, 72.86],
  initialZoom = 12,
  markers = DEFAULT_MAP_MARKERS,
  hazardZones = DEFAULT_HAZARD_ZONES,
  height = "600px",
  onMarkerClick,
  showLayersControl = true,
}: FloodMapProps) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<any>(null);

  React.useEffect(() => {
    let isMounted = true;
    let localMap: any = null;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      const L = (await import("leaflet")).default;
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: true,
      });

      localMap = map;
      mapInstanceRef.current = map;

      // Add Tile Layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Aqua-Assist GIS',
        maxZoom: 19,
      }).addTo(map);

      // Layer Groups
      const incidentLayer = L.layerGroup().addTo(map);
      const shelterLayer = L.layerGroup().addTo(map);
      const rescuerLayer = L.layerGroup().addTo(map);
      const hazardLayer = L.layerGroup().addTo(map);

      // Helper for icons
      const createMarkerIcon = (marker: MapMarkerItem) => {
        if (marker.type === "shelter") {
          return L.divIcon({
            className: "custom-gis-pin",
            html: `
              <div style="
                background: #1e3a8a;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.35);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
              " title="${marker.title}">
                🏛️
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });
        }

        if (marker.type === "rescuer") {
          return L.divIcon({
            className: "custom-gis-pin",
            html: `
              <div style="
                background: #0f172a;
                color: #38bdf8;
                width: 32px;
                height: 32px;
                border-radius: 6px;
                border: 2px solid #38bdf8;
                box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
              " title="${marker.title}">
                🚤
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });
        }

        const isCritical = marker.severity === "critical";
        const isHigh = marker.severity === "high";
        const bg = isCritical ? "#dc2626" : isHigh ? "#ea580c" : "#d97706";

        return L.divIcon({
          className: "custom-gis-pin",
          html: `
            <div style="position: relative; width: 30px; height: 30px;">
              ${
                isCritical
                  ? `<div style="
                      position: absolute;
                      width: 30px;
                      height: 30px;
                      border-radius: 50%;
                      background: rgba(220, 38, 38, 0.4);
                      animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                    "></div>`
                  : ""
              }
              <div style="
                position: relative;
                background: ${bg};
                color: white;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                border: 2.5px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.35);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
              ">
                ⚠️
              </div>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });
      };

      // Add hazard circles
      hazardZones.forEach((zone) => {
        const circle = L.circle(zone.center, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.18,
          radius: zone.radiusMeters,
          weight: 2,
          dashArray: "4, 6",
        });
        circle.bindTooltip(`<strong>${zone.label}</strong><br/>Radius: ${zone.radiusMeters}m`, {
          sticky: true,
        });
        circle.addTo(hazardLayer);
      });

      // Add markers
      markers.forEach((item) => {
        const icon = createMarkerIcon(item);
        const marker = L.marker(item.coordinates, { icon });

        const popupHtml = `
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4; padding: 2px;">
            <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-bottom: 2px;">
              ${item.type.toUpperCase()} • ${item.id}
            </div>
            <div style="font-size: 13px; font-weight: bold; color: #0f172a; margin-bottom: 4px;">
              ${item.title}
            </div>
            ${
              item.description
                ? `<div style="color: #475569; font-size: 11px; margin-bottom: 6px;">${item.description}</div>`
                : ""
            }
            ${
              item.waterLevel
                ? `<div style="background: #f1f5f9; padding: 4px 6px; border-radius: 4px; font-size: 11px; font-family: monospace;">
                    Depth: <strong>${item.waterLevel}</strong>
                  </div>`
                : ""
            }
            ${
              item.capacity
                ? `<div style="background: #eff6ff; color: #1e3a8a; padding: 4px 6px; border-radius: 4px; font-size: 11px; font-family: monospace;">
                    Camp Capacity: <strong>${item.capacity} Citizens</strong>
                  </div>`
                : ""
            }
            ${
              item.assignedTeam
                ? `<div style="background: #f0fdf4; color: #14532d; padding: 4px 6px; border-radius: 4px; font-size: 11px; font-family: monospace;">
                    Assigned Unit: <strong>${item.assignedTeam}</strong>
                  </div>`
                : ""
            }
          </div>
        `;

        marker.bindPopup(popupHtml);

        marker.on("click", () => {
          if (onMarkerClick) onMarkerClick(item);
        });

        if (item.type === "shelter") marker.addTo(shelterLayer);
        else if (item.type === "rescuer") marker.addTo(rescuerLayer);
        else marker.addTo(incidentLayer);
      });

      // Layer controls
      if (showLayersControl) {
        const overlays = {
          "Flood Incidents (Live)": incidentLayer,
          "Evacuation Shelters": shelterLayer,
          "Tactical Rescue Units": rescuerLayer,
          "Inundation Hazard Buffers": hazardLayer,
        };
        L.control.layers(undefined, overlays, { position: "topright" }).addTo(map);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (localMap) {
        localMap.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initialCenter, initialZoom, markers, hazardZones, onMarkerClick, showLayersControl]);

  return (
    <div className="relative w-full rounded border border-slate-200 overflow-hidden shadow-2xs">
      <div ref={mapContainerRef} style={{ height, width: "100%" }} />
    </div>
  );
}
