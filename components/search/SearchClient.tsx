"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  MapPin,
  Search,
  Navigation,
  ChevronRight,
  Layers,
  X,
  Loader2,
  AlertCircle,
  Map,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

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

type SearchResult = {
  id: number;
  name: string;
  category: Category;
  description: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
  distance?: number;
};

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES: { value: Category | ""; label: string }[] = [
  { value: "", label: "All categories" },
  { value: "academic", label: "Academic" },
  { value: "administrative", label: "Administrative" },
  { value: "health", label: "Health" },
  { value: "accommodation", label: "Accommodation" },
  { value: "recreation", label: "Recreation" },
  { value: "worship", label: "Worship" },
  { value: "transport", label: "Transport" },
  { value: "food", label: "Food & Dining" },
  { value: "security", label: "Security" },
  { value: "other", label: "Other" },
];

const CATEGORY_COLORS: Record<
  Category,
  { bg: string; text: string; dot: string }
> = {
  academic: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  administrative: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
  health: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  accommodation: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  recreation: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  worship: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
  },
  transport: { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-500" },
  food: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  security: { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-500" },
  other: { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" },
};

// ─── Subcomponents ───────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: Category }) {
  const colors = CATEGORY_COLORS[category];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-wide uppercase ${colors.bg} ${colors.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {category}
    </span>
  );
}

function ResultCard({ location }: { location: SearchResult }) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
  const mapPageUrl = `/map?lat=${location.latitude}&lng=${location.longitude}&id=${location.id}`;

  return (
    <article className="group relative bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-900/5 transition-all duration-200 overflow-hidden">
      {/* Left accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${CATEGORY_COLORS[location.category].dot} opacity-60 group-hover:opacity-100 transition-opacity`}
      />

      <div className="pl-5 pr-5 pt-5 pb-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 leading-snug group-hover:text-green-700 transition-colors truncate">
              {location.name}
            </h3>
            {location.address && (
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500 truncate">
                  {location.address}
                </span>
              </div>
            )}
          </div>
          <CategoryBadge category={location.category} />
        </div>

        {/* Description */}
        {location.description && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
            {location.description}
          </p>
        )}

        {/* Distance pill (proximity search) */}
        {location.distance !== undefined && (
          <div className="flex items-center gap-1.5 mb-3">
            <Navigation className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs font-medium text-green-700">
              {location.distance < 1000
                ? `${Math.round(location.distance)} m away`
                : `${(location.distance / 1000).toFixed(1)} km away`}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
          <Link
            href={mapPageUrl}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
          >
            <Map className="w-4 h-4" />
            View on map
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-gray-200">|</span>
          <Link
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Navigation className="w-4 h-4" />
            Get directions
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="pl-5 pr-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/5 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-2/5" />
          </div>
          <div className="h-6 w-20 bg-gray-100 rounded-full" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-4/5" />
        </div>
        <div className="pt-3 border-t border-gray-50 flex gap-2">
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="h-4 w-28 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ query, category }: { query: string; category: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <MapPin className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">
        No locations found
      </h3>
      <p className="text-sm text-gray-500 max-w-xs">
        {query || category
          ? `No results for "${query}"${category ? ` in ${category}` : ""}. Try a different search.`
          : "Enter a location name or select a category to begin."}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim() && !category) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (category) params.set("category", category);

      const res = await fetch(`/api/search?${params.toString()}`);
      if (!res.ok) throw new Error("Search failed. Please try again.");

      const json = (await res.json()) as { data: SearchResult[] };
      setResults(json.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, category]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") void handleSearch();
  };

  const handleClear = () => {
    setQuery("");
    setCategory("");
    setResults([]);
    setHasSearched(false);
    setError(null);
  };

  return (
    <div className="min-h-screen">
      {/* ── Header / Nav ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-green-700 rounded-lg flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
              GIRS
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <Link
              href="/"
              className="hover:text-gray-900 transition-colors px-2 py-1 rounded-md hover:bg-gray-50"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-gray-900 font-medium px-2 py-1">Search</span>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="relative bg-green-800 overflow-hidden">
        {/* Topographic contour SVG background */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.07]"
          viewBox="0 0 800 260"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {[40, 65, 90, 115, 140, 165, 190, 215].map((y, i) => (
            <ellipse
              key={i}
              cx="400"
              cy={y + 40}
              rx={80 + i * 55}
              ry={22 + i * 14}
              fill="none"
              stroke="white"
              strokeWidth="1.5"
            />
          ))}
          {[40, 65, 90, 115, 140, 165, 190, 215].map((y, i) => (
            <ellipse
              key={`b-${i}`}
              cx="680"
              cy={y + 20}
              rx={60 + i * 42}
              ry={16 + i * 11}
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
          ))}
        </svg>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-10">
          <div className="max-w-2xl">
            <p className="text-green-300 text-xs font-semibold uppercase tracking-widest mb-3">
              ABU Zaria Campus
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
              Find any location
              <br />
              on campus.
            </h1>
            <p className="text-green-200 text-base">
              Search by name, filter by category, or explore the interactive
              map.
            </p>
          </div>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="bg-green-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-0">
          <div className="bg-white rounded-t-2xl shadow-xl shadow-green-900/20 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Text input */}
              <div className="relative flex-1">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Faculty of Science, Senate Building…"
                  className="w-full pl-10 pr-9 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400 text-gray-900"
                  aria-label="Search location name"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category select */}
              <div className="relative sm:w-52">
                <Layers
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  aria-hidden="true"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category | "")}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none text-gray-700 cursor-pointer"
                  aria-label="Filter by category"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search button */}
              <button
                onClick={() => void handleSearch()}
                disabled={isLoading || (!query.trim() && !category)}
                className="sm:w-auto px-6 py-3 bg-green-700 hover:bg-green-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2 shrink-0"
                aria-label="Run search"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
              </button>
            </div>

            {/* Active filters */}
            {(query || category) && !isLoading && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">Filtering by:</span>
                {query && (
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    "{query}"
                    <button
                      onClick={() => setQuery("")}
                      className="hover:text-green-900 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {category && (
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                    {category}
                    <button
                      onClick={() => setCategory("")}
                      className="hover:text-green-900 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleClear}
                  className="ml-auto text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Results area ── */}
      <div className="bg-gray-50 min-h-[60vh]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Error state */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {/* Loading skeletons */}
          {isLoading && (
            <div>
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-5" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {!isLoading && hasSearched && !error && (
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-medium text-gray-600">
                  <span className="text-gray-900 font-bold">
                    {results.length}
                  </span>{" "}
                  {results.length === 1 ? "result" : "results"} found
                </p>
                {results.length > 0 && (
                  <Link
                    href={`/map?q=${encodeURIComponent(query)}`}
                    className="text-sm text-green-700 hover:text-green-800 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Map className="w-4 h-4" />
                    View all on map
                  </Link>
                )}
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.map((loc) => (
                    <ResultCard key={loc.id} location={loc} />
                  ))}
                </div>
              ) : (
                <EmptyState query={query} category={category} />
              )}
            </>
          )}

          {/* Pre-search prompt */}
          {!isLoading && !hasSearched && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Search className="w-7 h-7 text-green-700" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Search the campus
              </h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Type a building, faculty, or landmark name — or pick a category
                to browse.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {(
                  ["academic", "health", "food", "transport"] as Category[]
                ).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      void (async () => {
                        setIsLoading(true);
                        setError(null);
                        setHasSearched(true);
                        try {
                          const res = await fetch(
                            `/api/search?category=${cat}`,
                          );
                          if (!res.ok) throw new Error("Search failed.");
                          const json = (await res.json()) as {
                            data: SearchResult[];
                          };
                          setResults(json.data);
                        } catch (err) {
                          setError(
                            err instanceof Error ? err.message : "Error",
                          );
                        } finally {
                          setIsLoading(false);
                        }
                      })();
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors hover:border-green-300 hover:bg-green-50 ${CATEGORY_COLORS[cat].bg} ${CATEGORY_COLORS[cat].text} border-transparent`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${CATEGORY_COLORS[cat].dot}`}
                    />
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            GIRS — Ahmadu Bello University, Zaria
          </p>
          <Link
            href="/map"
            className="text-xs text-green-700 hover:text-green-800 font-medium flex items-center gap-1 transition-colors"
          >
            <Map className="w-3.5 h-3.5" />
            Open map
          </Link>
        </div>
      </footer>
    </div>
  );
}
