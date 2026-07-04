export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-200 animate-pulse" />
            <div className="flex flex-col gap-1">
              <div className="w-10 h-3.5 bg-gray-200 rounded animate-pulse" />
              <div className="w-16 h-2.5 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 h-3.5 bg-gray-200 rounded animate-pulse" />
            <div className="w-20 h-8 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-20 h-3 bg-gray-100 rounded animate-pulse"
                  style={{ animationDelay: `${i * 60}ms` }}
                />
                <div
                  className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse"
                  style={{ animationDelay: `${i * 60}ms` }}
                />
              </div>
              <div
                className="w-10 h-7 bg-gray-200 rounded animate-pulse"
                style={{ animationDelay: `${i * 60}ms` }}
              />
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Table toolbar */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="flex-1 h-9 bg-gray-100 rounded-lg animate-pulse" />
            <div className="w-36 h-9 bg-gray-100 rounded-lg animate-pulse" />
            <div className="w-32 h-9 bg-green-100 rounded-lg animate-pulse" />
          </div>

          {/* Table header */}
          <div className="px-6 py-3 border-b border-gray-100 grid grid-cols-12 gap-4 bg-gray-50">
            {[3, 2, 3, 2, 2].map((cols, i) => (
              <div
                key={i}
                className={`col-span-${cols} h-3 bg-gray-200 rounded animate-pulse`}
                style={{ animationDelay: `${i * 40}ms` }}
              />
            ))}
          </div>

          {/* Table rows */}
          {Array.from({ length: 8 }).map((_, row) => (
            <div
              key={row}
              className="px-6 py-4 border-b border-gray-50 grid grid-cols-12 gap-4 items-center"
            >
              {/* Name */}
              <div className="col-span-3 flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg bg-gray-100 shrink-0 animate-pulse"
                  style={{ animationDelay: `${row * 30}ms` }}
                />
                <div className="space-y-1.5 flex-1">
                  <div
                    className="h-3.5 bg-gray-200 rounded animate-pulse"
                    style={{
                      width: `${60 + (row % 4) * 15}%`,
                      animationDelay: `${row * 30}ms`,
                    }}
                  />
                  <div
                    className="h-2.5 bg-gray-100 rounded animate-pulse"
                    style={{
                      width: `${40 + (row % 3) * 10}%`,
                      animationDelay: `${row * 30 + 20}ms`,
                    }}
                  />
                </div>
              </div>

              {/* Category badge */}
              <div className="col-span-2">
                <div
                  className="h-6 w-20 rounded-full bg-gray-100 animate-pulse"
                  style={{ animationDelay: `${row * 30 + 10}ms` }}
                />
              </div>

              {/* Description */}
              <div className="col-span-3 space-y-1.5">
                <div
                  className="h-2.5 bg-gray-100 rounded animate-pulse"
                  style={{ animationDelay: `${row * 30 + 15}ms` }}
                />
                <div
                  className="h-2.5 bg-gray-100 rounded animate-pulse w-4/5"
                  style={{ animationDelay: `${row * 30 + 25}ms` }}
                />
              </div>

              {/* Coordinates */}
              <div className="col-span-2 space-y-1">
                <div
                  className="h-2.5 w-24 bg-gray-100 rounded animate-pulse font-mono"
                  style={{ animationDelay: `${row * 30 + 20}ms` }}
                />
                <div
                  className="h-2.5 w-20 bg-gray-100 rounded animate-pulse"
                  style={{ animationDelay: `${row * 30 + 30}ms` }}
                />
              </div>

              {/* Actions */}
              <div className="col-span-2 flex items-center justify-end gap-2">
                <div
                  className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse"
                  style={{ animationDelay: `${row * 30 + 35}ms` }}
                />
                <div
                  className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse"
                  style={{ animationDelay: `${row * 30 + 45}ms` }}
                />
              </div>
            </div>
          ))}

          {/* Table footer */}
          <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
            <div className="w-28 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="w-20 h-3 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  );
}
