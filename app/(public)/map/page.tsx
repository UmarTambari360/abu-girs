import { SiteHeader } from "@/components/ui/SiteHeader";
import MapWrapper from "@/components/map/MapWrapper";

export const metadata = {
  title: "Campus Map — GIRS · ABU Zaria",
  description: "Interactive map of Ahmadu Bello University campus locations.",
};

export default function MapPage() {
  return (
    <div className="h-screen flex flex-col">
      <SiteHeader breadcrumbs={[{ label: "Campus Map" }]} />
      <div className="flex-1 relative">
        <MapWrapper />
      </div>
    </div>
  );
}
