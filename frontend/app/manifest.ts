import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "National Flood Disaster Management System (NDMS)",
    short_name: "Aqua-Assist NDMS",
    description:
      "Integrated Crisis Command, Citizen Alerting, Evacuation Tracking, and Relief Administration System.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
