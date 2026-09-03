"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, X, Brain, Droplets, Activity, TrendingUp, Clock } from "lucide-react";
import { RiskBadge } from "@/components/ui/risk-badge";
import { RiskScoreCard } from "@/components/risk/risk-score-card";
import { formatRelativeTime, getRiskHex } from "@/lib/utils";
import type { Location } from "@/types";

interface RiskMapClientProps {
  locations: Location[];
}

export function RiskMapClient({ locations }: RiskMapClientProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const [selected, setSelected] = useState<Location | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamic import Leaflet (browser-only)
    import("leaflet").then((L) => {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Fix default icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [23.5, 80.0],
        zoom: 5,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Add markers for each location
      locations.forEach((loc) => {
        const color = getRiskHex(loc.riskLevel);
        const size = loc.riskLevel === "CRITICAL" ? 18 : loc.riskLevel === "HIGH" ? 15 : 12;

        const icon = L.divIcon({
          className: "custom-risk-marker",
          html: `
            <div style="
              width: ${size}px;
              height: ${size}px;
              border-radius: 50%;
              background: ${color};
              border: 2px solid white;
              box-shadow: 0 0 8px ${color}80, 0 2px 4px rgba(0,0,0,0.4);
              ${loc.riskLevel === "CRITICAL" ? "animation: pulse 1.5s infinite;" : ""}
            "></div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const marker = L.marker([loc.lat, loc.lng], { icon });

        marker.bindTooltip(
          `<div style="font-family:system-ui;font-size:12px;font-weight:600;color:white;background:#0f1f3d;padding:4px 8px;border-radius:6px;border:1px solid ${color}40;">
            ${loc.name} — ${loc.riskLevel}
          </div>`,
          { permanent: false, direction: "top", className: "custom-tooltip" }
        );

        marker.on("click", () => {
          setSelected(loc);
        });

        marker.addTo(map);
      });

      mapInstanceRef.current = map;
      setMapReady(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations]);

  return (
    <div className="relative w-full h-full">
      {/* Map container */}
      <div
        ref={mapRef}
        className="w-full h-full rounded-xl overflow-hidden"
        role="application"
        aria-label="Landslide risk map of India"
      />

      {/* Loading overlay */}
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a1628] rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400">Loading map...</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-6 left-4 bg-[#0a1628]/95 border border-slate-700/60 rounded-xl p-3 shadow-xl backdrop-blur-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Risk Level
        </p>
        {[
          { level: "CRITICAL", color: "#ef4444", label: "Critical ≥ 80" },
          { level: "HIGH", color: "#f97316", label: "High 60–79" },
          { level: "MODERATE", color: "#eab308", label: "Moderate 40–59" },
          { level: "LOW", color: "#22c55e", label: "Low < 40" },
        ].map((item) => (
          <div key={item.level} className="flex items-center gap-2 mb-1 last:mb-0">
            <div
              className="w-2.5 h-2.5 rounded-full border border-white/30 flex-shrink-0"
              style={{ background: item.color }}
            />
            <span className="text-[10px] text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Location count */}
      <div className="absolute top-4 left-4 bg-[#0a1628]/90 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-400 backdrop-blur-sm">
        {locations.length} monitoring stations
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="absolute top-4 right-4 w-72 max-h-[90%] overflow-y-auto bg-[#0a1628]/98 border border-slate-700/60 rounded-xl shadow-2xl backdrop-blur-sm">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">
                  {selected.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{selected.state}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors ml-2 flex-shrink-0"
                aria-label="Close location details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <RiskScoreCard
              score={selected.riskScore}
              level={selected.riskLevel}
              confidence={selected.aiConfidence}
              size="sm"
              animate
            />

            {/* Env data */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                {
                  icon: <Droplets className="w-3.5 h-3.5 text-blue-400" />,
                  label: "Rainfall",
                  value: `${selected.rainfall24h} mm`,
                  sub: "24h",
                },
                {
                  icon: <Activity className="w-3.5 h-3.5 text-cyan-400" />,
                  label: "Soil Moisture",
                  value: `${selected.soilMoisture}%`,
                  sub: "current",
                },
                {
                  icon: <TrendingUp className="w-3.5 h-3.5 text-orange-400" />,
                  label: "Movement",
                  value: `${selected.groundMovement} mm/d`,
                  sub: "ground",
                },
                {
                  icon: <MapPin className="w-3.5 h-3.5 text-purple-400" />,
                  label: "Slope",
                  value: `${selected.slopeAngle}°`,
                  sub: "angle",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/40"
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {item.icon}
                    <span className="text-[10px] text-slate-500">{item.label}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-200 tabular-nums">
                    {item.value}
                  </p>
                  <p className="text-[10px] text-slate-600">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div className="mt-3 bg-slate-800/40 rounded-lg p-3 border border-slate-700/30">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">
                Recommended Action
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selected.recommendedAction}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-600">
              <span className="flex items-center gap-1">
                <Brain className="w-3 h-3 text-blue-400" />
                AI Conf: {selected.aiConfidence}%
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatRelativeTime(selected.lastUpdated)}
              </span>
            </div>

            <a
              href={`/locations/${selected.id}`}
              className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-semibold bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/30 transition-colors"
            >
              View Full Details
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
