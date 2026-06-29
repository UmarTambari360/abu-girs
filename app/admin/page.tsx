import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { locations } from "@/db/schema";
import AdminLocationsClient from "@/components/admin/AdminLocationsClient";
import { SignOutButton } from "@/components/admin/SignOutButton";
import type { Location } from "@/db/schema";

export const metadata = {
  title: "Admin Dashboard — GIRS",
};

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const rows: Location[] = await db
    .select()
    .from(locations)
    .orderBy(locations.name);

  const categoryCounts = rows.reduce<Record<string, number>>((acc, loc) => {
    acc[loc.category] = (acc[loc.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <circle cx="12" cy="10" r="3" />
                <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7.2 12.5 7.9 13.1a.5.5 0 0 0 .2.1.5.5 0 0 0 .2-.1C12.8 22.5 20 15.4 20 10a8 8 0 0 0-8-8z" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-gray-900 text-sm">GIRS</span>
              <span className="text-gray-400 text-sm mx-2">/</span>
              <span className="text-gray-500 text-sm">Admin Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 text-xs font-semibold uppercase">
                  {session.user?.email?.charAt(0) ?? "A"}
                </span>
              </div>
              <span className="text-sm text-gray-600 hidden sm:block">
                {session.user?.email}
              </span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-screen-xl mx-auto w-full px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="col-span-2 sm:col-span-3 lg:col-span-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Location Management
            </h1>
            <p className="text-sm text-gray-500">
              {rows.length} campus location{rows.length !== 1 ? "s" : ""} across
              Ahmadu Bello University
            </p>
          </div>

          {/* Total card */}
          <StatCard
            label="Total"
            value={rows.length}
            color="bg-green-700"
            textColor="text-white"
          />
          {Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([cat, count]) => (
              <StatCard key={cat} label={cat} value={count} />
            ))}
        </div>

        {/* Main table / CRUD */}
        <AdminLocationsClient initialLocations={rows} />
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "bg-white",
  textColor = "text-gray-900",
}: {
  label: string;
  value: number;
  color?: string;
  textColor?: string;
}) {
  return (
    <div
      className={`rounded-xl px-4 py-3 border border-gray-200 shadow-sm ${color}`}
    >
      <p
        className={`text-2xl font-bold ${textColor === "text-white" ? "text-white" : "text-gray-900"}`}
      >
        {value}
      </p>
      <p
        className={`text-xs capitalize mt-0.5 ${textColor === "text-white" ? "text-green-100" : "text-gray-500"}`}
      >
        {label}
      </p>
    </div>
  );
}
