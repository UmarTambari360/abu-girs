"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  X,
  Navigation,
  Tag,
  FileText,
  MapPinned,
  Layers,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// ─── Types

type Category =
  | "academic"
  | "administrative"
  | "health"
  | "accommodation"
  | "recreation"
  | "worship"
  | "transport"
  | "food"
  | "security"
  | "other";

type Location = {
  id: number;
  name: string;
  category: Category;
  description: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
};

// ─── Category colours (matched to Leaflet marker hue) ─────────────────────────

const CATEGORY_CONFIG: Record<
  Category,
  { label: string; color: string; bg: string; dot: string }
> = {
  academic: {
    label: "Academic",
    color: "text-blue-700",
    bg: "bg-blue-50",
    dot: "#1d4ed8",
  },
  administrative: {
    label: "Administrative",
    color: "text-purple-700",
    bg: "bg-purple-50",
    dot: "#7e22ce",
  },
  health: {
    label: "Health",
    color: "text-red-700",
    bg: "bg-red-50",
    dot: "#b91c1c",
  },
  accommodation: {
    label: "Accommodation",
    color: "text-orange-700",
    bg: "bg-orange-50",
    dot: "#c2410c",
  },
  recreation: {
    label: "Recreation",
    color: "text-teal-700",
    bg: "bg-teal-50",
    dot: "#0f766e",
  },
  worship: {
    label: "Worship",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    dot: "#a16207",
  },
  transport: {
    label: "Transport",
    color: "text-cyan-700",
    bg: "bg-cyan-50",
    dot: "#0e7490",
  },
  food: {
    label: "Food & Dining",
    color: "text-lime-700",
    bg: "bg-lime-50",
    dot: "#4d7c0f",
  },
  security: {
    label: "Security",
    color: "text-gray-700",
    bg: "bg-gray-100",
    dot: "#374151",
  },
  other: {
    label: "Other",
    color: "text-green-700",
    bg: "bg-green-50",
    dot: "#15803d",
  },
};

// ─── ABU Senate Building — default map centre ─────────────────────────────────

const ABU_CENTER: [number, number] = [11.150642, 7.654551];
const DEFAULT_ZOOM = 15;

// ─── Component ────────────────────────────────────────────────────────────────

export default function MapClient() {
  const searchParams = useSearchParams();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<number, any>>(new Map());
  const isInitializedRef = useRef(false);

  const [locations, setLocations] = useState<Location[]>([]);
  const [selected, setSelected] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationCount, setLocationCount] = useState(0);

  // ── Fetch locations ──────────────────────────────────────────────────────────

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/locations");
      if (!res.ok) throw new Error("Failed to load locations");
      const json = (await res.json()) as { data: Location[] };
      setLocations(json.data);
      setLocationCount(json.data.length);
    } catch {
      setError("Could not load campus locations. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLocations();
  }, [fetchLocations]);

  // ── Initialise Leaflet map ───────────────────────────────────────────────────

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current) return;
    if (mapRef.current !== null) return;
    if (mapContainerRef.current === null) return;

    let isMounted = true;

    // Dynamic import — runs only in the browser
    import("leaflet").then((L) => {
      if (!isMounted) return;
      if (mapContainerRef.current === null) return;

      // Fix webpack/Leaflet broken default icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Check if container still exists and map hasn't been initialized
      if (!mapContainerRef.current || mapRef.current !== null) return;

      // Initialise map
      const map = L.map(mapContainerRef.current, {
        center: ABU_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
      });

      // OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Custom zoom control — bottom right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapRef.current = map;
      isInitializedRef.current = true;

      // Invalidate size after a short delay to ensure container is rendered
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 200);
    });

    // Cleanup on unmount
    return () => {
      isMounted = false;
      if (mapRef.current !== null) {
        try {
          // Remove all markers first
          markersRef.current.forEach((marker) => {
            try {
              marker.remove();
            } catch (e) {
              // Ignore removal errors
            }
          });
          markersRef.current.clear();

          // Remove the map
          mapRef.current.remove();
        } catch (e) {
          // Ignore cleanup errors
        }
        mapRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, []);

  // ── Add / update markers when locations load ─────────────────────────────────

  useEffect(() => {
    if (mapRef.current === null || locations.length === 0) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted) return;
      const map = mapRef.current;
      if (map === null) return;

      // Clear existing markers
      markersRef.current.forEach((marker) => {
        try {
          marker.remove();
        } catch (e) {
          // Ignore removal errors
        }
      });
      markersRef.current.clear();

      locations.forEach((loc) => {
        const cfg = CATEGORY_CONFIG[loc.category] ?? CATEGORY_CONFIG.other;

        // Custom SVG div-icon — coloured dot with a white ring
        const icon = L.divIcon({
          className: "",
          html: `
            <div class="girs-marker-dot" style="
              width: 28px;
              height: 28px;
              background: ${cfg.dot};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.35);
              cursor: pointer;
              transition: transform 0.15s;
            "></div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([loc.latitude, loc.longitude], { icon })
          .addTo(map)
          .on("click", () => {
            setSelected(loc);
          });

        // Hover tooltip — reveals the location name above the pill
        marker.bindTooltip(loc.name, {
          direction: "top",
          offset: L.point(0, -16),
          opacity: 1,
          className: "girs-marker-tooltip",
        });

        markersRef.current.set(loc.id, marker);
      });

      // If URL has ?lat, ?lng, ?id — centre and open that location
      const urlLat = searchParams.get("lat");
      const urlLng = searchParams.get("lng");
      const urlId = searchParams.get("id");

      if (urlLat !== null && urlLng !== null) {
        const lat = parseFloat(urlLat);
        const lng = parseFloat(urlLng);
        if (!isNaN(lat) && !isNaN(lng)) {
          map.setView([lat, lng], 17, { animate: true });
        }
      }

      if (urlId !== null) {
        const id = parseInt(urlId, 10);
        const target = locations.find((l) => l.id === id);
        if (target !== undefined) {
          setSelected(target);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [locations, searchParams]);

  // ── Pan map when selected location changes ───────────────────────────────────

  useEffect(() => {
    if (selected === null || mapRef.current === null) return;

    import("leaflet").then(() => {
      const map = mapRef.current;
      if (map === null) return;
      // Offset centre slightly upward so the panel doesn't cover the marker
      map.setView([selected.latitude - 0.0005, selected.longitude], 17, {
        animate: true,
        duration: 0.5,
      });
    });
  }, [selected]);

  // ─── Render ──────────────────────────────────────────────────────────────────

  const selectedCfg = selected
    ? (CATEGORY_CONFIG[selected.category] ?? CATEGORY_CONFIG.other)
    : null;

  return (
    <div className="relative w-full h-full">
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />

      {/* Hover-pill tooltip styling — matches GIRS brand identity */}
      <style>{`
        .girs-marker-dot:hover {
          transform: scale(1.15);
        }

        .leaflet-tooltip.girs-marker-tooltip {
          background: #15803d;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          padding: 4px 12px;
          font-family: var(--font-inter), sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 12px rgba(21, 128, 61, 0.35);
          white-space: nowrap;
          pointer-events: none;
        }

        .leaflet-tooltip.girs-marker-tooltip::before {
          border-top-color: #15803d;
        }
      `}</style>

      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* ── Loading overlay ──────────────────────────────────────────────────── */}
      {loading && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-white/70 backdrop-blur-sm pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-green-200 border-t-green-700 animate-spin" />
            <p className="text-sm font-medium text-gray-600">
              Loading campus locations…
            </p>
          </div>
        </div>
      )}

      {/* ── Error overlay ────────────────────────────────────────────────────── */}
      {error !== null && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[1001]">
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => void fetchLocations()}
              className="ml-2 flex items-center gap-1 text-red-700 hover:text-red-900 font-medium underline underline-offset-2"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* ── Location count pill ──────────────────────────────────────────────── */}
      {!loading && locationCount > 0 && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1001] pointer-events-none">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md shadow border border-gray-200/60 px-3 py-1.5 rounded-full">
            <Layers className="w-3.5 h-3.5 text-green-700" />
            <span className="text-xs font-semibold text-gray-700">
              {locationCount} locations plotted
            </span>
          </div>
        </div>
      )}

      {/* ── Legend pill — bottom left ────────────────────────────────────────── */}
      {!loading && (
        <div className="absolute bottom-6 left-4 z-[1001] hidden lg:block">
          <div className="bg-white/95 backdrop-blur-md shadow-lg border border-gray-200/60 rounded-xl p-3 w-44">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Categories
            </p>
            <div className="flex flex-col gap-1.5">
              {(
                Object.entries(CATEGORY_CONFIG) as [
                  Category,
                  (typeof CATEGORY_CONFIG)[Category],
                ][]
              ).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0 border-2 border-white shadow-sm"
                    style={{ background: cfg.dot }}
                  />
                  <span className="text-xs text-gray-600">{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Selected location panel ──────────────────────────────────────────── */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 z-[1002]
          transition-transform duration-300 ease-out
          ${selected !== null ? "translate-y-0" : "translate-y-full"}
        `}
      >
        {selected !== null && selectedCfg !== null && (
          <div className="bg-white/97 backdrop-blur-xl border-t border-gray-200 shadow-2xl rounded-t-2xl overflow-hidden">
            {/* Drag handle */}
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            <div className="px-5 pb-6 pt-2">
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  {/* Colour dot */}
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: selectedCfg.dot + "20" }}
                  >
                    <MapPin
                      className="w-5 h-5"
                      style={{ color: selectedCfg.dot }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-gray-900 leading-tight truncate">
                      {selected.name}
                    </h2>
                    {/* Category badge */}
                    <span
                      className={`inline-flex items-center gap-1 mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${selectedCfg.bg} ${selectedCfg.color}`}
                    >
                      <Tag className="w-3 h-3" />
                      {selectedCfg.label}
                    </span>
                  </div>
                </div>

                {/* Close */}
                <button
                  onClick={() => setSelected(null)}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                  aria-label="Close panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="mt-4 space-y-3">
                {selected.description !== null && (
                  <div className="flex items-start gap-2.5 text-sm text-gray-600">
                    <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="leading-relaxed">{selected.description}</p>
                  </div>
                )}

                {selected.address !== null && (
                  <div className="flex items-start gap-2.5 text-sm text-gray-600">
                    <MapPinned className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p>{selected.address}</p>
                  </div>
                )}

                {/* Coordinates */}
                <div className="flex items-center gap-2.5 text-xs text-gray-400 font-mono">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>
                    {selected.latitude.toFixed(5)},{" "}
                    {selected.longitude.toFixed(5)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-3">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selected.latitude},${selected.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
                <Link
                  href={`/search?q=${encodeURIComponent(selected.name)}`}
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Details
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
