import { Suspense } from "react";
import { SiteHeader } from "@/components/ui/SiteHeader";
import SearchClient from "@/components/search/SearchClient";

export const metadata = {
  title: "Search Locations — GIRS · ABU Zaria",
  description:
    "Search campus locations at Ahmadu Bello University by name, category, or proximity.",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader breadcrumbs={[{ label: "Search" }]} />
      <Suspense>
        <SearchClient />
      </Suspense>
    </div>
  );
}
