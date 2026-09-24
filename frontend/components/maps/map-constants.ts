export interface MapMarkerItem {
  id: string;
  type: "incident" | "shelter" | "rescuer";
  title: string;
  description?: string;
  coordinates: [number, number]; // [lat, lng]
  severity?: "critical" | "high" | "advisory" | "normal";
  waterLevel?: string;
  capacity?: number;
  assignedTeam?: string;
}

export interface HazardZoneItem {
  center: [number, number];
  radiusMeters: number;
  color: string;
  label: string;
}

// Preset verified disaster features for GIS cartographic presentation
export const DEFAULT_MAP_MARKERS: MapMarkerItem[] = [
  {
    id: "rep-001",
    type: "incident",
    title: "Mithi River Overtopping - Kranti Nagar",
    description: "Water level breached danger embankment by 1.2m. Severe inundation in Kurla West.",
    coordinates: [19.0688, 72.8826],
    severity: "critical",
    waterLevel: "chest-deep (1.8m)",
  },
  {
    id: "rep-002",
    type: "incident",
    title: "Hindmata Flyover Junction Submerged",
    description: "Water depth 3.5 ft. Public transit halted; dewatering pumps active.",
    coordinates: [19.0178, 72.8428],
    severity: "high",
    waterLevel: "waist-deep (1.1m)",
  },
  {
    id: "rep-003",
    type: "incident",
    title: "Milan Subway Traffic Closure",
    description: "Conduits inundated with 5 ft of standing floodwater.",
    coordinates: [19.0812, 72.8397],
    severity: "critical",
    waterLevel: "above-head (1.7m)",
  },
  {
    id: "rep-004",
    type: "incident",
    title: "Sion Gandhi Market Water Logging",
    description: "Recurrent drainage backflow causing 1.5 ft water accumulation.",
    coordinates: [19.0354, 72.8596],
    severity: "advisory",
    waterLevel: "knee-deep (0.5m)",
  },
  {
    id: "sh-001",
    type: "shelter",
    title: "Evacuation Camp 08 — Kurla High School",
    description: "Capacity: 800 citizens • In-House Medical Unit & Potable Water Sump",
    coordinates: [19.0652, 72.8791],
    capacity: 800,
  },
  {
    id: "sh-002",
    type: "shelter",
    title: "Evacuation Camp 14 — Dadar Municipal Stadium",
    description: "Capacity: 1,200 citizens • Dry Rations & Red Cross Trauma Desk",
    coordinates: [19.0221, 72.8415],
    capacity: 1200,
  },
  {
    id: "res-001",
    type: "rescuer",
    title: "NDRF Battalion 04 - Unit Alpha",
    description: "3x Inflatable Zodiac Boats, Diving Gear, Satellite Uplink",
    coordinates: [19.0715, 72.8872],
    assignedTeam: "Team Alpha (Zodiac-2)",
  },
  {
    id: "res-002",
    type: "rescuer",
    title: "SDRF Rapid Extraction - Bravo Unit",
    description: "Amphibious Vehicle (ARV-1) & Winch Stretcher Rig",
    coordinates: [19.0845, 72.8441],
    assignedTeam: "Team Bravo (Rapid Ex)",
  },
];

export const DEFAULT_HAZARD_ZONES: HazardZoneItem[] = [
  {
    center: [19.0688, 72.8826],
    radiusMeters: 900,
    color: "#dc2626",
    label: "Mithi River Basin Hazard Zone (Critical Red)",
  },
  {
    center: [19.0178, 72.8428],
    radiusMeters: 650,
    color: "#f97316",
    label: "Hindmata Low-Lying Catchment (Orange Watch)",
  },
  {
    center: [19.0812, 72.8397],
    radiusMeters: 500,
    color: "#dc2626",
    label: "Milan Underpass Danger Buffer",
  },
];
