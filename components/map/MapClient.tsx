"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Location } from "@/types";

// Leaflet must be imported dynamically in Next.js (no SSR)
let L: typeof import("leaflet") | null = null;

export default function MapClient() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const searchParams = useSearchParams();

  const focusLat = searchParams.get("lat");
  const focusLng = searchParams.get("lng");
  const focusId = searchParams.get("id");

  useEffect(() => {
    fetch("/api/locations")
      .then((r) => r.json())
      .then((j) => setLocations(j.data ?? []));
  }, []);

  useEffect(() => {
    if (!mapRef.current || locations.length === 0) return;
    if (mapInstanceRef.current) return; // already initialised

    import("leaflet").then((leaflet) => {
      L = leaflet.default ?? leaflet;

      // Fix default icon paths broken by webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const defaultCenter: [number, number] =
        focusLat && focusLng
          ? [Number(focusLat), Number(focusLng)]
          : [11.1572, 7.6369]; // ABU Senate Building

      const map = L.map(mapRef.current!, { zoomControl: true }).setView(
        defaultCenter,
        focusLat ? 17 : 15
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      locations.forEach((loc) => {
        const marker = L!.marker([loc.latitude, loc.longitude]).addTo(map);
        marker.bindPopup(`
          <div style="min-width:180px">
            <strong style="font-size:14px">${loc.name}</strong><br/>
            <span style="font-size:12px;color:#555;text-transform:capitalize">${loc.category}</span><br/>
            ${loc.description ? `<p style="font-size:12px;margin:6px 0 4px">${loc.description}</p>` : ""}
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}"
              target="_blank"
              rel="noopener noreferrer"
              style="font-size:12px;color:#15803d"
            >Get directions →</a>
          </div>
        `);

        // Auto-open popup for the focused location
        if (focusId && String(loc.id) === focusId) {
          marker.openPopup();
        }
      });

      mapInstanceRef.current = map;
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [locations, focusLat, focusLng, focusId]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </>
  );
}
