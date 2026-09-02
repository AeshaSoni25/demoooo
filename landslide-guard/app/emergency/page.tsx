import {
  Siren,
  MapPin,
  Phone,
  AlertTriangle,
  Navigation,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { EmergencyResourceCard } from "@/components/emergency/emergency-resource-card";
import { DemoBadge } from "@/components/ui/demo-badge";
import { DEMO_EMERGENCY_RESOURCES } from "@/data/demo/emergency";
import type { EmergencyResource } from "@/types";

const typeOrder = [
  "HOSPITAL",
  "RESCUE_CENTER",
  "SHELTER",
  "POLICE",
  "FIRE_EMERGENCY",
  "DISTRICT_AUTHORITY",
];

const typeLabels: Record<string, string> = {
  HOSPITAL: "Hospitals & Medical",
  RESCUE_CENTER: "Rescue Centers (NDRF/SDRF)",
  SHELTER: "Emergency Shelters",
  POLICE: "Police Stations",
  FIRE_EMERGENCY: "Fire & Emergency Services",
  DISTRICT_AUTHORITY: "District Authorities",
};

const grouped = typeOrder.reduce<Record<string, EmergencyResource[]>>((acc, type) => {
  acc[type] = DEMO_EMERGENCY_RESOURCES.filter((r) => r.type === type);
  return acc;
}, {});

const SAFE_ZONES = [
  "Dehradun Valley (Uttarakhand) — Government designated safe zone",
  "Srinagar (Garhwal) — District emergency shelter complex",
  "Shimla city centre — Pre-identified assembly points",
  "Kalpetta town (Wayanad) — District collectorate grounds",
  "Siliguri plains (West Bengal) — Evacuation reception point",
];

const EVACUATION_ROUTES = [
  { from: "Shimla Foothills", route: "NH-5 → Kalka → Chandigarh", status: "Open" },
  { from: "Kedarnath Valley", route: "NH-107 → Rudraprayag → Rishikesh", status: "Restricted" },
  { from: "Darjeeling Hills", route: "NH-10 → Siliguri plains", status: "Open" },
  { from: "Chamoli District", route: "NH-7 → Karanprayag → Haridwar", status: "Closed" },
  { from: "Wayanad", route: "NH-766 → Kozhikode coastal", status: "Open" },
];

export default function EmergencyPage() {
  return (
    <AppShell title="Emergency Response">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white">Emergency Response</h1>
            <DemoBadge label="Demo — Contact details are placeholders" />
          </div>
          <p className="text-sm text-slate-400">
            Emergency resources, evacuation routes, and safe zone directory
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">
          <AlertTriangle className="w-3.5 h-3.5" />
          Contact information shown is for demonstration only
        </div>
      </div>

      {/* Emergency hotlines banner */}
      <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Phone className="w-4 h-4 text-orange-400" />
          <h2 className="text-sm font-bold text-white">National Emergency Numbers</h2>
          <span className="text-xs text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/20">
            Real Numbers — Always Valid
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "National Emergency", number: "112" },
            { label: "NDRF Helpline", number: "011-24363260" },
            { label: "Disaster Management", number: "1078" },
            { label: "Police", number: "100" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-slate-900/40 rounded-lg p-2.5 border border-slate-700/40"
            >
              <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
              <p className="text-base font-bold text-orange-300 font-mono">{item.number}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Resources */}
        <div className="lg:col-span-2 space-y-5">
          {typeOrder.map((type) => {
            const resources = grouped[type];
            if (!resources || resources.length === 0) return null;
            return (
              <section key={type} aria-labelledby={`section-${type}`}>
                <h2
                  id={`section-${type}`}
                  className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"
                >
                  <Siren className="w-3.5 h-3.5" />
                  {typeLabels[type]}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {resources.map((resource) => (
                    <EmergencyResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Evacuation + Safe zones sidebar */}
        <div className="space-y-4">
          {/* Evacuation routes */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-4">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-400" />
              Evacuation Routes
            </h2>
            <div className="space-y-2.5">
              {EVACUATION_ROUTES.map((route) => (
                <div
                  key={route.from}
                  className="p-3 rounded-lg bg-slate-900/40 border border-slate-700/40"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-slate-200">{route.from}</p>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        route.status === "Open"
                          ? "text-green-400 bg-green-500/15"
                          : route.status === "Restricted"
                          ? "text-yellow-400 bg-yellow-500/15"
                          : "text-red-400 bg-red-500/15"
                      }`}
                    >
                      {route.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {route.route}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 mt-2 italic">
              Route status is simulated for demonstration
            </p>
          </div>

          {/* Safe zones */}
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              Designated Safe Zones
            </h2>
            <ul className="space-y-2" role="list">
              {SAFE_ZONES.map((zone, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-slate-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                  {zone}
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-slate-600 mt-3 italic">
              Safe zone designations are illustrative
            </p>
          </div>

          {/* High risk zones */}
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Active High-Risk Zones
            </h2>
            <ul className="space-y-2" role="list">
              {[
                "Shimla Foothills — Zone HP-042 (CRITICAL)",
                "Chamoli District — Zone UK-007 (CRITICAL)",
                "Darjeeling Hills — Zone WB-DRJ-03 (HIGH)",
                "Uttarkashi — Zone UK-UTK-02 (HIGH)",
                "Kedarnath Valley — Zone UK-KED-01 (HIGH)",
              ].map((zone, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-red-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0 animate-pulse" />
                  {zone}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
