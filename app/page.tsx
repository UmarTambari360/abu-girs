import Link from "next/link";
import {
  MapPin,
  Search,
  Map,
  ShieldCheck,
  BookOpen,
  Users,
} from "lucide-react";

export const metadata = {
  title: "GIRS — ABU Zaria Campus Navigator",
  description:
    "Find any location on the Ahmadu Bello University campus. Search by name, category, or proximity.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-green-700">
        {/* Topographic SVG background */}
        <TopographicBackground />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 md:py-28 text-white">
          {/* Wordmark */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-widest uppercase opacity-80">
              GIRS · ABU Zaria
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-5 max-w-3xl">
            Every building.
            <br />
            Every landmark.
            <br />
            <span className="text-green-200">Found instantly.</span>
          </h1>

          <p className="text-green-100 text-lg md:text-xl max-w-xl leading-relaxed mb-10">
            The Geographical Information Retriever System for Ahmadu Bello
            University — search over 40&nbsp;campus locations, explore the
            interactive map, and navigate with confidence.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-800 font-semibold px-7 py-3.5 rounded-xl hover:bg-green-50 transition-colors shadow-lg shadow-green-900/20"
            >
              <Search className="w-4 h-4" />
              Search Locations
            </Link>
            <Link
              href="/map"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-green-500 transition-colors border border-green-500"
            >
              <Map className="w-4 h-4" />
              Open Campus Map
            </Link>
          </div>
        </div>
      </header>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-3 gap-6 text-center">
          <Stat value="10" label="Categories" />
          <Stat value="40+" label="Campus Locations" />
          <Stat value="2" label="Campuses Covered" />
        </div>
      </div>

      {/* ── Feature grid ──────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24 flex-1">
        <p className="text-xs font-bold tracking-widest uppercase text-green-700 mb-3">
          What you can do
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 max-w-lg">
          Built for students, staff, and first-time visitors
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <FeatureCard
            icon={<Search className="w-5 h-5" />}
            title="Search by name or category"
            body="Type a building name or filter by academic, health, accommodation, food, and more to find any campus facility."
            href="/search"
            cta="Try search"
          />
          <FeatureCard
            icon={<Map className="w-5 h-5" />}
            title="Interactive campus map"
            body="Browse every location on a live OpenStreetMap-powered campus map with colour-coded markers and popup details."
            href="/map"
            cta="Open map"
          />
          <FeatureCard
            icon={<MapPin className="w-5 h-5" />}
            title="Proximity search"
            body="Enter your current coordinates and find all facilities within a given radius — useful for emergencies and quick navigation."
            href="/search"
            cta="Find nearby"
          />
        </div>

        {/* Category grid */}
        <p className="text-xs font-bold tracking-widest uppercase text-green-700 mb-4">
          Location categories
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-20">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={`/search?category=${cat.value}`}
              className="flex flex-col items-center gap-2 py-5 px-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-colors group text-center"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs font-medium text-gray-600 group-hover:text-green-800 capitalize">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>

        {/* About ABU strip */}
        <div className="rounded-2xl bg-green-700 text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-green-300" />
              <span className="text-xs font-bold tracking-widest uppercase text-green-300">
                About this project
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">
              Ahmadu Bello University, Zaria
            </h3>
            <p className="text-green-100 text-sm leading-relaxed max-w-md">
              GIRS was developed as a final-year Computer Science project to
              solve real navigation challenges across one of Nigeria&apos;s
              largest university campuses — covering the Main Campus and Kongo
              Campus in Zaria, Kaduna State.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-800 font-semibold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors text-sm"
            >
              <Search className="w-4 h-4" />
              Search now
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 bg-green-600/60 text-white font-medium px-6 py-3 rounded-xl hover:bg-green-600 transition-colors text-sm border border-green-500/50"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin portal
            </Link>
          </div>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-700" />
            <span className="font-semibold text-gray-700">GIRS</span>
            <span>· ABU Zaria Campus Navigator</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>
              Department of Computer Science &mdash; Ahmadu Bello University
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-green-700">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
  href,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col p-6 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all">
      <div className="w-9 h-9 rounded-lg bg-green-50 text-green-700 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed flex-1">{body}</p>
      <Link
        href={href}
        className="mt-4 text-sm font-semibold text-green-700 hover:text-green-800 inline-flex items-center gap-1 group"
      >
        {cta}
        <span className="group-hover:translate-x-0.5 transition-transform">
          →
        </span>
      </Link>
    </div>
  );
}

function TopographicBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="topo"
          x="0"
          y="0"
          width="200"
          height="200"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 100 Q50 60 100 100 Q150 140 200 100"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <path
            d="M0 70 Q50 30 100 70 Q150 110 200 70"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <path
            d="M0 130 Q50 90 100 130 Q150 170 200 130"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <path
            d="M0 40 Q50 0 100 40 Q150 80 200 40"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
          <path
            d="M0 160 Q50 120 100 160 Q150 200 200 160"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#topo)" />
    </svg>
  );
}

const CATEGORIES = [
  { value: "academic", label: "Academic", emoji: "🏛️" },
  { value: "administrative", label: "Admin", emoji: "🏢" },
  { value: "health", label: "Health", emoji: "🏥" },
  { value: "accommodation", label: "Housing", emoji: "🏠" },
  { value: "recreation", label: "Recreation", emoji: "⛳" },
  { value: "worship", label: "Worship", emoji: "🕌" },
  { value: "transport", label: "Transport", emoji: "🚌" },
  { value: "food", label: "Food", emoji: "🍽️" },
  { value: "security", label: "Security", emoji: "🚔" },
  { value: "other", label: "Other", emoji: "📍" },
];
