import Link from "next/link";
import { MapPin, Search, ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(#15803d 1px, transparent 1px),
            linear-gradient(90deg, #15803d 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Illustrated map pin cluster */}
        <div
          className="flex items-end justify-center gap-2 mb-8"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-1 opacity-30 translate-y-2">
            <MapPin className="w-6 h-6 text-green-700" strokeWidth={1.5} />
            <div className="w-px h-8 bg-green-700" />
            <div className="w-2 h-2 rounded-full bg-green-700 opacity-50" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="relative">
              <MapPin
                className="w-16 h-16 text-green-700"
                strokeWidth={1.5}
                fill="currentColor"
                style={{ color: "#15803d" }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg pb-3">
                ?
              </span>
            </div>
            <div className="w-px h-12 bg-green-700 opacity-40" />
            <div className="w-3 h-3 rounded-full bg-green-700 opacity-30" />
          </div>
          <div className="flex flex-col items-center gap-1 opacity-20 translate-y-3">
            <MapPin className="w-5 h-5 text-green-700" strokeWidth={1.5} />
            <div className="w-px h-6 bg-green-700" />
            <div className="w-2 h-2 rounded-full bg-green-700 opacity-50" />
          </div>
        </div>

        {/* 404 label */}
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-4">
          <Compass className="w-3.5 h-3.5 text-green-700" />
          <span className="text-xs font-semibold text-green-700 tracking-widest uppercase">
            404 — Location Not Found
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Off the map</h1>
        <p className="text-gray-500 text-base leading-relaxed mb-8">
          This page doesn&apos;t exist in our campus directory. It may have been
          moved, removed, or the coordinates were entered incorrectly.
        </p>

        {/* Action cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link
            href="/search"
            className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Search className="w-5 h-5 text-green-700" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Search Locations
            </span>
          </Link>

          <Link
            href="/map"
            className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <MapPin className="w-5 h-5 text-green-700" />
            </div>
            <span className="text-sm font-medium text-gray-700">View Map</span>
          </Link>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>

      {/* Subtle coordinate watermark */}
      <p
        className="absolute bottom-6 text-xs text-gray-300 font-mono"
        aria-hidden="true"
      >
        11.1572° N, 7.6369° E
      </p>
    </div>
  );
}
