import Link from "next/link";
import { MapPin } from "lucide-react";

type Crumb = { label: string; href?: string };

interface SiteHeaderProps {
  breadcrumbs?: Crumb[];
}

export function SiteHeader({ breadcrumbs }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-7 h-7 bg-green-700 rounded-lg flex items-center justify-center group-hover:bg-green-800 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-sm tracking-tight">
            GIRS
          </span>
        </Link>

        {/* Breadcrumb */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-sm text-gray-400 min-w-0">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1 min-w-0">
                <span className="text-gray-300">/</span>
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-green-700 transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-700 font-medium truncate">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Nav links */}
        <nav className="flex items-center gap-1 shrink-0">
          <Link
            href="/search"
            className="text-sm text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Search
          </Link>
          <Link
            href="/map"
            className="text-sm text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Map
          </Link>
        </nav>
      </div>
    </header>
  );
}
