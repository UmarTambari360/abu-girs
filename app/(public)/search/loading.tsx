export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="h-14 bg-white border-b border-gray-100" />

      {/* Search panel skeleton */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="h-7 w-56 bg-gray-100 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-80 bg-gray-100 rounded animate-pulse mb-6" />
          <div className="flex gap-2 mb-3">
            <div className="flex-1 h-12 bg-gray-100 rounded-xl animate-pulse" />
            <div className="w-20 h-12 bg-gray-100 rounded-xl animate-pulse" />
          </div>
          <div className="flex gap-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-7 w-20 bg-gray-100 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Results skeleton */}
      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-36 rounded-2xl bg-white border border-gray-100 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
