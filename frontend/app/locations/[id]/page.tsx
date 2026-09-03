import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  ArrowLeft,
  Brain,
  Droplets,
  Activity,
  TrendingUp,
  Thermometer,
  Mountain,
  Clock,
  Users,
  History,
  Bell,
} from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { RiskScoreCard } from "@/components/risk/risk-score-card";
import { AIExplanation } from "@/components/risk/ai-explanation";
import { AlertCard } from "@/components/ui/alert-card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { MetricCard } from "@/components/ui/metric-card";
import { DemoBadge } from "@/components/ui/demo-badge";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { predictLandslideRisk } from "@/lib/ai/prediction-engine";
import { DEMO_HISTORICAL_EVENTS } from "@/data/demo/historical";
import { Location, Alert, Sensor } from "@/types";

interface PageProps {
  params: { id: string };
  searchParams: { region?: string };
}

export default async function LocationPage({ params, searchParams }: PageProps) {
  const region = searchParams.region || "";
  const query = region && region !== "All Regions" ? `?region=${encodeURIComponent(region)}` : "";

  let locations: Location[] = [];
  let alerts: Alert[] = [];
  let sensors: Sensor[] = [];

  try {
    const [locRes, alertRes, sensorRes] = await Promise.all([
      fetch(`http://localhost:3001/api/locations${query}`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`http://localhost:3001/api/alerts${query}`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`http://localhost:3001/api/sensors${query}`, { cache: "no-store" }).then((r) => r.json()),
    ]);
    locations = locRes.data || [];
    alerts = alertRes.data || [];
    sensors = sensorRes.data || [];
  } catch (e) {
    console.error("Failed to fetch location data:", e);
  }

  const location = locations.find((l) => l.id === params.id);
  if (!location) notFound();

  const locationAlerts = alerts.filter(
    (a) => a.locationId === location.id
  );
  // We can keep historical events as demo data for now
  const locationEvents = DEMO_HISTORICAL_EVENTS.filter(
    (e) => e.locationId === location.id
  );
  const locationSensors = sensors.filter(
    (s) => s.locationId === location.id
  );

  type MetricVariant = "default" | "critical" | "high" | "moderate" | "low";

  const rainfallVariant: MetricVariant =
    location.rainfall24h > 150 ? "critical" : location.rainfall24h > 100 ? "high" : "default";
  const soilMoistureVariant: MetricVariant =
    location.soilMoisture > 85 ? "critical" : location.soilMoisture > 70 ? "high" : "default";
  const soilSatVariant: MetricVariant =
    location.soilSaturation > 90 ? "critical" : location.soilSaturation > 75 ? "high" : "default";
  const groundVariant: MetricVariant =
    location.groundMovement > 5 ? "critical" : location.groundMovement > 2 ? "high" : "default";

  // Run AI prediction for this location
  const prediction = predictLandslideRisk({
    rainfall24h: location.rainfall24h,
    rainfall7d: location.rainfall7d,
    soilMoisture: location.soilMoisture,
    soilSaturation: location.soilSaturation,
    slopeAngle: location.slopeAngle,
    groundDisplacement: location.groundMovement,
    elevation: location.elevation,
    temperature: 15,
    vegetationIndex: location.vegetationIndex,
    historicalLandslides: location.historicalLandslides,
  });

  return (
    <AppShell title={location.name}>
      {/* Back */}
      <div className="mb-5">
        <Link
          href="/risk-map"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Risk Map
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{location.name}</h1>
            <RiskBadge level={location.riskLevel} size="md" pulse />
            <DemoBadge />
          </div>
          <p className="text-sm text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {location.district}, {location.state} &nbsp;·&nbsp;
            <span className="font-mono text-slate-500">
              {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E
            </span>
          </p>
          <p className="text-sm text-slate-500 mt-1">{location.description}</p>
        </div>
        <div className="text-right text-xs text-slate-500 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          Updated {formatRelativeTime(location.lastUpdated)}
        </div>
      </div>

      {/* ── Key metrics ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        {[
          { label: "Rainfall 24h", value: `${location.rainfall24h}`, unit: "mm", variant: rainfallVariant },
          { label: "Soil Moisture", value: `${location.soilMoisture}`, unit: "%", variant: soilMoistureVariant },
          { label: "Soil Saturation", value: `${location.soilSaturation}`, unit: "%", variant: soilSatVariant },
          { label: "Slope Angle", value: `${location.slopeAngle}`, unit: "°", variant: "default" as MetricVariant },
          { label: "Ground Movement", value: `${location.groundMovement}`, unit: "mm/d", variant: groundVariant },
          { label: "Elevation", value: `${location.elevation.toLocaleString("en-IN")}`, unit: "m", variant: "default" as MetricVariant },
        ].map((m) => (
          <MetricCard
            key={m.label}
            title={m.label}
            value={m.value}
            unit={m.unit}
            variant={m.variant}
          />
        ))}
      </div>

      {/* ── Main grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Risk score + terrain */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-400" />
              AI Risk Assessment
            </h2>
            <RiskScoreCard
              score={location.riskScore}
              level={location.riskLevel}
              confidence={location.aiConfidence}
              size="lg"
              animate
            />
            <div className="mt-4 pt-4 border-t border-slate-700/40">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Recommended Action
              </p>
              <p className="text-sm text-slate-200 leading-relaxed">
                {location.recommendedAction}
              </p>
            </div>
          </div>

          {/* Terrain info */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Mountain className="w-4 h-4 text-slate-400" />
              Terrain Information
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Terrain Type", value: location.terrain },
                { label: "Population", value: location.population.toLocaleString("en-IN") },
                { label: "Vegetation (NDVI)", value: location.vegetationIndex.toFixed(2) },
                { label: "Historical Events", value: `${location.historicalLandslides} recorded` },
                { label: "Rainfall 7 Days", value: `${location.rainfall7d} mm` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-slate-900/40 rounded-lg p-2.5 border border-slate-700/30"
                >
                  <p className="text-[10px] text-slate-500 mb-0.5">{item.label}</p>
                  <p className="text-xs font-semibold text-slate-200">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Explainable AI */}
        <div>
          <AIExplanation
            factors={prediction.factors}
            confidence={prediction.confidence}
            riskLevel={prediction.riskLevel}
            className="h-full"
          />
        </div>
      </div>

      {/* ── Sensors ───────────────────────────────────── */}
      {locationSensors.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Monitoring Stations ({locationSensors.length} sensors)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {locationSensors.map((sensor) => (
              <div
                key={sensor.id}
                className="rounded-xl border border-slate-700/40 bg-slate-800/40 p-3"
              >
                <p className="text-xs font-semibold text-slate-300 mb-1">{sensor.label}</p>
                <p className={`text-xl font-bold tabular-nums ${
                  sensor.status === "ALERT" ? "text-red-400" :
                  sensor.status === "WARNING" ? "text-yellow-400" : "text-green-400"
                }`}>
                  {sensor.currentValue}
                  <span className="text-xs text-slate-500 font-normal ml-0.5">{sensor.unit}</span>
                </p>
                <p className={`text-[10px] font-semibold uppercase mt-0.5 ${
                  sensor.status === "ALERT" ? "text-red-400" :
                  sensor.status === "WARNING" ? "text-yellow-400" : "text-green-400"
                }`}>
                  {sensor.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Alerts + History row ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent alerts */}
        <div>
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-400" />
            Recent Alerts
          </h2>
          {locationAlerts.length > 0 ? (
            <div className="space-y-3">
              {locationAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} compact />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 p-6 text-center">
              <p className="text-sm text-slate-500">No recent alerts for this location.</p>
            </div>
          )}
        </div>

        {/* Historical events */}
        <div>
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <History className="w-4 h-4 text-purple-400" />
            Historical Landslide Events
          </h2>
          {locationEvents.length > 0 ? (
            <div className="space-y-3">
              {locationEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4"
                >
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <p className="text-sm font-bold text-white">
                      {formatDate(event.date)}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        event.magnitude === "CATASTROPHIC"
                          ? "text-red-400 bg-red-500/15"
                          : event.magnitude === "MAJOR"
                          ? "text-orange-400 bg-orange-500/15"
                          : "text-yellow-400 bg-yellow-500/15"
                      }`}
                    >
                      {event.magnitude}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                    {event.description}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-sm font-bold text-red-400 tabular-nums">
                        {event.casualties.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[10px] text-slate-500">Casualties</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-orange-400 tabular-nums">
                        {event.displaced.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[10px] text-slate-500">Displaced</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-yellow-400 tabular-nums">
                        {event.rainfall24h} mm
                      </p>
                      <p className="text-[10px] text-slate-500">Rainfall 24h</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 p-6 text-center">
              <p className="text-sm text-slate-500">
                No major events recorded in the dataset for this location.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
