"use client";

import { useState } from "react";
import {
  Users,
  MapPin,
  ChevronDown,
  Phone,
  AlertTriangle,
  CheckCircle,
  Home,
  Navigation,
  Megaphone,
} from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { RiskBadge } from "@/components/ui/risk-badge";
import { RiskScoreCard } from "@/components/risk/risk-score-card";
import { DemoBadge } from "@/components/ui/demo-badge";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { RiskLevel, Location } from "@/types";

const SAFETY_INSTRUCTIONS: Record<RiskLevel, { title: string; items: string[]; color: string }> = {
  LOW: {
    title: "Stay Informed",
    color: "border-green-500/30 bg-green-500/5",
    items: [
      "Monitor weather forecasts and local news.",
      "Know your nearest emergency shelter location.",
      "Keep emergency contacts saved.",
      "Check local authority announcements regularly.",
      "Routine precautions apply — no immediate action needed.",
    ],
  },
  MODERATE: {
    title: "Be Prepared",
    color: "border-yellow-500/30 bg-yellow-500/5",
    items: [
      "Monitor local weather warnings closely.",
      "Identify safe evacuation routes from your area.",
      "Prepare an emergency kit (water, food, medicines, documents).",
      "Avoid unnecessary travel during heavy rainfall.",
      "Report unusual ground cracks or slope changes to authorities.",
      "Check on elderly neighbours and vulnerable community members.",
    ],
  },
  HIGH: {
    title: "Take Action",
    color: "border-orange-500/30 bg-orange-500/5",
    items: [
      "Avoid unstable slopes and low-lying areas near hills.",
      "Avoid unnecessary travel during extreme rainfall.",
      "Listen for official evacuation instructions.",
      "Keep emergency supplies ready (72-hour kit).",
      "Report cracks or unusual ground movement immediately.",
      "Move vehicles and valuables away from vulnerable areas.",
      "Keep mobile phones charged and emergency numbers ready.",
      "Stay indoors unless evacuating.",
    ],
  },
  CRITICAL: {
    title: "Evacuate if Ordered",
    color: "border-red-500/30 bg-red-500/5",
    items: [
      "FOLLOW OFFICIAL EVACUATION ORDERS IMMEDIATELY.",
      "Move to higher ground or designated safe zones.",
      "Do NOT return home until authorities declare it safe.",
      "Carry only essential items — move quickly.",
      "Do NOT cross flooded roads or streams.",
      "Assist neighbours who need help moving.",
      "Call 112 (National Emergency) for immediate help.",
      "Stay tuned to official broadcasts and SMS alerts.",
    ],
  },
};

export default function CommunityPage() {
  const searchParams = useSearchParams();
  const region = searchParams.get("region") || "";

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLocations() {
      setIsLoading(true);
      try {
        const q = region && region !== "All Regions" ? `?region=${encodeURIComponent(region)}` : "";
        const res = await fetch(`http://localhost:3001/api/locations${q}`);
        const data = await res.json();
        const locs = data.data || [];
        setLocations(locs);
        if (locs.length > 0) {
          setSelectedLocationId(locs[0].id);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLocations();
  }, [region]);

  const location = locations.find((l) => l.id === selectedLocationId);
  const instructions = location ? SAFETY_INSTRUCTIONS[location.riskLevel] : null;

  return (
    <AppShell title="Community View">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white">Community Safety View</h1>
            <DemoBadge />
          </div>
          <p className="text-sm text-slate-400">
            Simple, clear safety information for citizens and communities
          </p>
        </div>
      </div>

      {/* Location selector */}
      <div className="mb-5">
        <label
          htmlFor="community-location"
          className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"
        >
          <MapPin className="w-3.5 h-3.5" />
          Select Your Location
        </label>
        <div className="relative max-w-sm">
          <select
            id="community-location"
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className="w-full appearance-none bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 cursor-pointer pr-10"
            aria-label="Select your location"
            disabled={isLoading || locations.length === 0}
          >
            {locations.length === 0 ? (
              <option value="">{isLoading ? "Loading..." : "No locations found"}</option>
            ) : (
              locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} — {loc.state}
                </option>
              ))
            )}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Main content — mobile-first layout */}
      {location && instructions ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Risk status card — prominent */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-5 h-full">
              <div className="flex items-center gap-2 mb-3">
                <Home className="w-4 h-4 text-slate-400" />
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Your Area
                </p>
              </div>
  
              <h2 className="text-xl font-bold text-white mb-1">{location.name}</h2>
              <p className="text-sm text-slate-400 mb-4">{location.district}, {location.state}</p>
  
              <RiskScoreCard
                score={location.riskScore}
                level={location.riskLevel}
                confidence={location.aiConfidence}
                size="lg"
                animate
              />
  
              {/* Key numbers */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="bg-slate-900/40 rounded-lg p-2.5 border border-slate-700/40 text-center">
                  <p className="text-lg font-bold text-blue-300 tabular-nums">
                    {location.rainfall24h}
                  </p>
                  <p className="text-[10px] text-slate-500">mm Rainfall (24h)</p>
                </div>
                <div className="bg-slate-900/40 rounded-lg p-2.5 border border-slate-700/40 text-center">
                  <p className="text-lg font-bold text-cyan-300 tabular-nums">
                    {location.soilMoisture}%
                  </p>
                  <p className="text-[10px] text-slate-500">Soil Moisture</p>
                </div>
              </div>
            </div>
          </div>

        {/* Safety instructions */}
        <div className="md:col-span-2">
          <div
            className={`rounded-2xl border p-5 h-full ${instructions.color}`}
            role="region"
            aria-labelledby="safety-heading"
          >
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className={`w-5 h-5 ${
                location.riskLevel === "CRITICAL" ? "text-red-400" :
                location.riskLevel === "HIGH" ? "text-orange-400" :
                location.riskLevel === "MODERATE" ? "text-yellow-400" : "text-green-400"
              }`} />
              <div>
                <h3 id="safety-heading" className="text-base font-bold text-white">
                  {instructions.title}
                </h3>
                <RiskBadge level={location.riskLevel} size="sm" pulse={location.riskLevel === "CRITICAL"} />
              </div>
            </div>

            <p className="text-sm text-slate-300 font-semibold mb-3">
              What you should do:
            </p>

            <ul className="space-y-2.5" role="list">
              {instructions.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      location.riskLevel === "CRITICAL" ? "text-red-400" :
                      location.riskLevel === "HIGH" ? "text-orange-400" :
                      location.riskLevel === "MODERATE" ? "text-yellow-400" : "text-green-400"
                    }`}
                  />
                  <span
                    className={`text-sm leading-relaxed ${
                      i === 0 && location.riskLevel === "CRITICAL"
                        ? "font-bold text-red-200"
                        : "text-slate-200"
                    }`}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Emergency contacts */}
        <div className="md:col-span-2 lg:col-span-3">
          <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-400" />
              Emergency Numbers
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Emergency", number: "112", color: "text-red-400 bg-red-500/10 border-red-500/20" },
                { label: "NDRF Helpline", number: "011-24363260", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
                { label: "Disaster Mgmt", number: "1078", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
                { label: "Medical (AIIMS)", number: "See local hospital", color: "text-green-400 bg-green-500/10 border-green-500/20" },
              ].map((contact) => (
                <div
                  key={contact.label}
                  className={`rounded-xl border p-3 ${contact.color}`}
                >
                  <p className="text-[10px] opacity-70 mb-1">{contact.label}</p>
                  <p className="text-sm font-bold font-mono">{contact.number}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

          {/* Navigation to full details */}
          <div className="md:col-span-2 lg:col-span-3">
            <div className="flex flex-wrap gap-3 items-center justify-center py-2">
              <a
                href={`/locations/${location.id}?region=${encodeURIComponent(region)}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/30 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Full Location Details
              </a>
              <a
                href={`/alerts?region=${encodeURIComponent(region)}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/20 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                View Active Alerts
              </a>
              <a
                href={`/emergency?region=${encodeURIComponent(region)}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Emergency Resources
              </a>
            </div>
          </div>
        </div>
      ) : null}

      {/* Disclaimer */}
      <div className="mt-5 p-3 rounded-xl border border-slate-700/40 bg-slate-800/30 text-center">
        <p className="text-xs text-slate-500">
          ⚠️ This is a prototype with simulated data. Always follow instructions from official
          government authorities and local disaster management teams.
        </p>
      </div>
    </AppShell>
  );
}
