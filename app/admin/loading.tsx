export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
        <div className="h-8 w-8 rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-4 w-40 rounded bg-gray-200 animate-pulse ml-3" />
        <div className="ml-auto h-7 w-24 rounded-lg bg-gray-200 animate-pulse" />
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-4">
        {/* Title */}
        <div className="h-7 w-64 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 px-4 py-3 animate-pulse bg-white"
            >
              <div className="h-7 w-8 bg-gray-200 rounded mb-1" />
              <div className="h-3 w-16 bg-gray-100 rounded" />
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
          <div className="flex gap-3">
            <div className="flex-1 h-9 bg-gray-100 rounded-lg" />
            <div className="w-36 h-9 bg-gray-100 rounded-lg" />
            <div className="w-32 h-9 bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50 px-5 py-3 flex gap-4">
            {["Name", "Category", "Description", "Coordinates"].map((h) => (
              <div
                key={h}
                className="h-3 bg-gray-200 rounded w-20 animate-pulse"
              />
            ))}
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-4 border-b border-gray-50"
            >
              <div className="w-7 h-7 rounded-lg bg-gray-100 animate-pulse shrink-0" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-40" />
              <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse ml-2" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-48 hidden md:block ml-2" />
              <div className="ml-auto flex gap-1">
                <div className="w-7 h-7 rounded-lg bg-gray-100 animate-pulse" />
                <div className="w-7 h-7 rounded-lg bg-gray-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
