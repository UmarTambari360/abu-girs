import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Layers } from "lucide-react";
import MapLoader from "@/components/map/MapLoader";

export const metadata: Metadata = {
  title: "Campus Map — GIRS",
  description:
    "Interactive map of all Ahmadu Bello University campus locations.",
};

export default function MapPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Floating top bar */}
      <header className="absolute top-0 left-0 right-0 z-[1000] pointer-events-none">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: back button */}
          <Link
            href="/search"
            className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md shadow-lg border border-gray-200/60 text-gray-700 hover:text-green-700 hover:border-green-300 transition-all duration-200 px-3.5 py-2 rounded-xl text-sm font-medium"
          >
            <Layers className="w-4 h-4" />
            <span>Back to Search</span>
          </Link>

          {/* Centre: brand */}
          <Link
            href="/"
            className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md shadow-lg border border-gray-200/60 px-4 py-2 rounded-xl"
          >
            <div className="w-6 h-6 bg-green-700 rounded-lg flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-800 tracking-tight">
              GIRS
            </span>
            <span className="hidden sm:inline text-xs text-gray-400 font-normal">
              ABU Zaria Campus
            </span>
          </Link>

          {/* Right: live indicator */}
          <div className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md shadow-lg border border-gray-200/60 px-3.5 py-2 rounded-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-gray-600">Live Map</span>
          </div>
        </div>
      </header>

      {/* Full-bleed map — MapLoader owns the ssr:false dynamic import */}
      <div className="w-full h-full">
        <MapLoader />
      </div>
    </div>
  );
}
