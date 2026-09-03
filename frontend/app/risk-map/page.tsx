import dynamic from "next/dynamic";
import { AppShell } from "@/components/dashboard/app-shell";
import { DemoBadge } from "@/components/ui/demo-badge";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Location } from "@/types";
// Dynamically import the map client — it uses browser APIs (no SSR)
const RiskMapClient = dynamic(
  () =>
    import("@/components/maps/risk-map-client").then((m) => ({
      default: m.RiskMapClient,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#0a1628] rounded-xl">
        <div className="text-sm text-slate-400">Loading map...</div>
      </div>
    ),
  }
);

export default async function RiskMapPage({
  searchParams,
}: {
  searchParams: { region?: string };
}) {
  const region = searchParams.region || "";
  const query = region && region !== "All Regions" ? `?region=${encodeURIComponent(region)}` : "";
  
  let locations: Location[] = [];
  try {
    const res = await fetch(`http://localhost:3001/api/locations${query}`, { cache: "no-store" });
    const data = await res.json();
    locations = data.data || [];
  } catch (error) {
    console.error("Failed to fetch locations", error);
  }

  const riskCounts = {
    CRITICAL: locations.filter((l) => l.riskLevel === "CRITICAL").length,
    HIGH: locations.filter((l) => l.riskLevel === "HIGH").length,
    MODERATE: locations.filter((l) => l.riskLevel === "MODERATE").length,
    LOW: locations.filter((l) => l.riskLevel === "LOW").length,
  };

  return (
    <AppShell title="Risk Map">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white">Interactive Risk Map</h1>
            <DemoBadge />
          </div>
          <p className="text-sm text-slate-400">
            Landslide-prone regions across India — click any marker for details
          </p>
        </div>

        {/* Risk count summary */}
        <div className="flex flex-wrap gap-2">
          {(["CRITICAL", "HIGH", "MODERATE", "LOW"] as const).map((level) => (
            <div
              key={level}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40"
            >
              <RiskBadge level={level} size="sm" />
              <span className="text-xs font-bold text-slate-300">
                {riskCounts[level]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="rounded-xl border border-slate-700/60 overflow-hidden" style={{ height: "calc(100vh - 220px)", minHeight: "500px" }}>
        <RiskMapClient locations={locations} />
      </div>

      {/* Note */}
      <p className="mt-3 text-xs text-slate-600 text-center">
        Map data © OpenStreetMap contributors. Risk zones and sensor data are simulated for demonstration purposes.
      </p>
    </AppShell>
  );
}
