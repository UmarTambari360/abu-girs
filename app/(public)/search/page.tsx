import type { Metadata } from "next";
import SearchClient from "@/components/search/SearchClient";

export const metadata: Metadata = {
  title: "Search Locations — GIRS",
  description:
    "Search for buildings, facilities, and landmarks on the ABU Zaria campus.",
};

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <SearchClient />
    </div>
  );
}
