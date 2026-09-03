"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Activity,
  RefreshCw,
  Filter,
  Wifi,
  WifiOff,
  Clock,
} from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { SensorCard } from "@/components/ui/sensor-card";
import { DemoBadge } from "@/components/ui/demo-badge";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { useSearchParams } from "next/navigation";
import type { Sensor, SensorStatus } from "@/types";

type FilterType = "ALL" | "ALERT" | "WARNING" | "NORMAL" | "OFFLINE";

function simulateSensorUpdate(sensor: Sensor, demoRainfall: number): Sensor {
  const rainfallFactor = demoRainfall / 100;
  const jitter = (Math.random() - 0.5) * 0.08;
  let newVal = sensor.currentValue;

  if (sensor.type === "RAIN_GAUGE") {
    newVal = demoRainfall + (Math.random() - 0.5) * 10;
  } else if (sensor.type === "SOIL_MOISTURE") {
    const base = Math.min(98, 45 + rainfallFactor * 50);
    newVal = base + jitter * 10;
  } else if (sensor.type === "GROUND_MOVEMENT") {
    const base = 0.5 + rainfallFactor * 8;
    newVal = Math.max(0, base + jitter * 2);
  } else if (sensor.type === "TILT_SENSOR") {
    const base = 0.5 + rainfallFactor * 10;
    newVal = Math.max(0, base + jitter * 3);
  } else {
    newVal = sensor.currentValue + jitter * sensor.currentValue;
  }

  newVal = parseFloat(Math.max(0, newVal).toFixed(1));

  let status: SensorStatus = "NORMAL";
  if (newVal > sensor.maxNormal * 1.4) status = "ALERT";
  else if (newVal > sensor.maxNormal) status = "WARNING";

  return {
    ...sensor,
    currentValue: newVal,
    status,
    lastUpdated: new Date().toISOString(),
  };
}

export default function MonitoringPage() {
  const { isDemo, currentStep } = useDemoMode();
  const searchParams = useSearchParams();
  const region = searchParams.get("region") || "";
  
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [locationFilter, setLocationFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const fetchSensors = useCallback(async () => {
    setIsLoading(true);
    try {
      const q = region && region !== "All Regions" ? `?region=${encodeURIComponent(region)}` : "";
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/sensors${q}`);
      const data = await res.json();
      setSensors(data.data || []);
      setLastUpdate(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [region]);

  useEffect(() => {
    fetchSensors();
  }, [fetchSensors]);

  const updateSensors = useCallback(() => {
    if (!isDemo) return;
    setSensors((prev) =>
      prev.map((s) => simulateSensorUpdate(s, currentStep.rainfall))
    );
    setLastUpdate(new Date());
  }, [isDemo, currentStep.rainfall]);

  // Auto-update every 5s in demo, else refetch every 30s
  useEffect(() => {
    if (isDemo) {
      const t = setInterval(updateSensors, 5000);
      return () => clearInterval(t);
    } else {
      const t = setInterval(fetchSensors, 30000);
      return () => clearInterval(t);
    }
  }, [isDemo, updateSensors, fetchSensors]);

  const filteredSensors = sensors.filter((s) => {
    if (filter !== "ALL" && s.status !== filter) return false;
    if (locationFilter !== "All" && s.locationName !== locationFilter) return false;
    return true;
  });

  const locations = ["All", ...Array.from(new Set(sensors.map((s) => s.locationName)))];

  const statusCounts = {
    ALERT: sensors.filter((s) => s.status === "ALERT").length,
    WARNING: sensors.filter((s) => s.status === "WARNING").length,
    NORMAL: sensors.filter((s) => s.status === "NORMAL").length,
    OFFLINE: sensors.filter((s) => s.status === "OFFLINE").length,
  };

  return (
    <AppShell title="Live Monitoring">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white">Live Sensor Monitoring</h1>
            <DemoBadge label="Simulated Sensor Data" />
          </div>
          <p className="text-sm text-slate-400">
            Real-time environmental sensor feeds from monitoring stations
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDemo && (
            <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1.5 rounded-lg">
              <Wifi className="w-3.5 h-3.5 animate-pulse" />
              Live Simulation Active
            </div>
          )}
          <button
            onClick={fetchSensors}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label="Refresh sensors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lastUpdate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
          </span>
        </div>
      </div>

      {/* Status summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { key: "ALERT" as FilterType, label: "Alert", count: statusCounts.ALERT, color: "border-red-500/40 bg-red-500/10 text-red-300" },
          { key: "WARNING" as FilterType, label: "Warning", count: statusCounts.WARNING, color: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300" },
          { key: "NORMAL" as FilterType, label: "Normal", count: statusCounts.NORMAL, color: "border-green-500/40 bg-green-500/10 text-green-300" },
          { key: "OFFLINE" as FilterType, label: "Offline", count: statusCounts.OFFLINE, color: "border-slate-600/40 bg-slate-700/30 text-slate-400" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(filter === item.key ? "ALL" : item.key)}
            className={`rounded-xl border p-3 text-center transition-all hover:scale-[1.02] ${item.color} ${filter === item.key ? "ring-1 ring-current" : ""}`}
            aria-pressed={filter === item.key}
          >
            <p className="text-2xl font-bold tabular-nums">{item.count}</p>
            <p className="text-xs mt-0.5 opacity-80">{item.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Filter className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-xs text-slate-500">Location:</span>
        <div className="flex flex-wrap gap-1.5">
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => setLocationFilter(loc)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                locationFilter === loc
                  ? "bg-blue-600/30 text-blue-300 border border-blue-500/30"
                  : "bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-slate-200"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Sensors grid */}
      {filteredSensors.length === 0 ? (
        <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 p-12 text-center">
          <WifiOff className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No sensors match the current filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSensors.map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      )}

      {/* Demo note */}
      {isDemo && (
        <div className="mt-6 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-300/70">
          <strong>Demo Mode:</strong> Sensor values are simulated and update every 5 seconds based on the current demo rainfall level ({currentStep.rainfall} mm/24h). In production, these would be real IoT sensor readings.
        </div>
      )}
    </AppShell>
  );
}
