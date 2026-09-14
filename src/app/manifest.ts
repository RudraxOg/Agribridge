import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AgriBridge — trusted farm trade",
    short_name: "AgriBridge",
    description: "Bulk trade for farmer producer organizations and verified buyers.",
    start_url: "/en",
    display: "standalone",
    background_color: "#F8F7F1",
    theme_color: "#174A2E",
    orientation: "portrait-primary",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
