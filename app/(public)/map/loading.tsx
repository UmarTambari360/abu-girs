"use client";

export default function MapLoading() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
      {/* Header skeleton */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 shrink-0 z-10">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-green-200 animate-pulse" />
          <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        {/* Breadcrumb */}
        <div className="w-20 h-3.5 bg-gray-200 rounded animate-pulse" />

        <div className="ml-auto flex items-center gap-3">
          <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Map area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Fake map tiles — grid of slightly varying grey blocks */}
        <div
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: "#e8eaed" }}
          aria-hidden="true"
        >
          {/* Horizontal road-like lines */}
          <div className="absolute top-[28%] left-0 right-0 h-px bg-white opacity-60" />
          <div className="absolute top-[55%] left-0 right-0 h-px bg-white opacity-40" />
          <div className="absolute top-[72%] left-0 right-0 h-px bg-white opacity-50" />
          {/* Vertical road-like lines */}
          <div className="absolute left-[35%] top-0 bottom-0 w-px bg-white opacity-50" />
          <div className="absolute left-[62%] top-0 bottom-0 w-px bg-white opacity-40" />
          {/* Block rectangles suggesting buildings */}
          <div className="absolute top-[20%] left-[15%] w-20 h-12 rounded bg-gray-300 opacity-50" />
          <div className="absolute top-[38%] left-[42%] w-28 h-16 rounded bg-gray-300 opacity-40" />
          <div className="absolute top-[60%] left-[20%] w-16 h-10 rounded bg-gray-300 opacity-50" />
          <div className="absolute top-[25%] left-[65%] w-24 h-14 rounded bg-gray-300 opacity-40" />
          <div className="absolute top-[65%] left-[55%] w-20 h-12 rounded bg-gray-300 opacity-45" />
          <div className="absolute top-[15%] left-[75%] w-14 h-8 rounded bg-gray-300 opacity-35" />
        </div>

        {/* Placeholder markers */}
        {[
          { top: "22%", left: "18%" },
          { top: "40%", left: "45%" },
          { top: "58%", left: "23%" },
          { top: "28%", left: "67%" },
          { top: "62%", left: "58%" },
          { top: "18%", left: "77%" },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute flex flex-col items-center"
            style={{ top: pos.top, left: pos.left }}
            aria-hidden="true"
          >
            <div
              className="w-6 h-6 rounded-full bg-green-300 animate-pulse border-2 border-white shadow-sm"
              style={{ animationDelay: `${i * 150}ms` }}
            />
            <div className="w-px h-3 bg-green-300 opacity-70" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-300 opacity-40" />
          </div>
        ))}

        {/* Floating control panel skeleton — top left (zoom controls) */}
        <div
          className="absolute top-4 left-4 flex flex-col gap-px"
          aria-hidden="true"
        >
          <div className="w-8 h-8 bg-white rounded-t-md shadow animate-pulse border border-gray-200" />
          <div className="w-8 h-8 bg-white rounded-b-md shadow animate-pulse border border-gray-200" />
        </div>

        {/* Attribution skeleton — bottom left */}
        <div
          className="absolute bottom-4 left-4 h-4 w-40 bg-white opacity-70 rounded animate-pulse"
          aria-hidden="true"
        />

        {/* Category filter panel skeleton — top right */}
        <div
          className="absolute top-4 right-4 bg-white rounded-xl shadow-md border border-gray-100 p-3 w-48 space-y-2"
          aria-hidden="true"
        >
          <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-6 rounded-full bg-gray-100 animate-pulse"
                style={{
                  width: `${48 + (i % 3) * 16}px`,
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Loading indicator — centred */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-4 flex items-center gap-3">
            {/* Spinner */}
            <div className="w-5 h-5 border-2 border-green-200 border-t-green-700 rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-600">
              Loading campus map…
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
