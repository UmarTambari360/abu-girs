import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center space-y-4 max-w-xl">
        <h1 className="text-4xl font-bold text-green-800">GIRS</h1>
        <p className="text-gray-600 text-lg">
          Geographical Information Retriever System — ABU Zaria
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/search"
            className="px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors"
          >
            Search Locations
          </Link>
          <Link
            href="/map"
            className="px-6 py-3 border border-green-700 text-green-700 rounded-lg font-medium hover:bg-green-50 transition-colors"
          >
            View Map
          </Link>
          <Link
            href="/admin"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </main>
  );
}
