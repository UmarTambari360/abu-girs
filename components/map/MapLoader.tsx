"use client";

import dynamic from "next/dynamic";
import { Layers } from "lucide-react";

const MapClient = dynamic(() => import("@/components/map/MapClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <Layers className="w-8 h-8 animate-pulse" />
        <p className="text-sm font-medium">Loading map…</p>
      </div>
    </div>
  ),
});

export default function MapLoader() {
  return <MapClient />;
}
