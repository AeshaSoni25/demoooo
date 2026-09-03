import { Settings, Info, Database, Cpu, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { DemoBadge } from "@/components/ui/demo-badge";
import { PREDICTION_WEIGHTS } from "@/lib/ai/prediction-engine";

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white">Settings</h1>
            <DemoBadge />
          </div>
          <p className="text-sm text-slate-400">
            System configuration, AI model weights, and integration settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* AI Weights */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            AI Prediction Weights
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Current weights used by the rule-based scoring engine. In production, these would be learned by a trained ML model.
          </p>
          <div className="space-y-3">
            {Object.entries(PREDICTION_WEIGHTS).map(([key, weight]) => (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-slate-300 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-xs font-bold text-blue-300">{weight}%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500/70 rounded-full"
                    style={{ width: `${weight}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-slate-900/40 border border-slate-700/40">
            <p className="text-xs text-amber-300 flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              Weights are read-only in the prototype. Editing requires code changes to{" "}
              <code className="font-mono text-[10px] bg-slate-800 px-1 rounded">lib/ai/prediction-engine.ts</code>
            </p>
          </div>
        </div>

        {/* Data source */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-green-400" />
            Data Source Configuration
          </h2>
          <div className="space-y-3">
            {[
              { label: "DATABASE_URL", value: "Not configured — using demo data", status: "demo" },
              { label: "ML_SERVICE_URL", value: "Not configured — using rule-based engine", status: "demo" },
              { label: "Data Mode", value: "Demo / Simulated", status: "demo" },
              { label: "Sensor Feed", value: "Simulated (client-side)", status: "demo" },
              { label: "Map Provider", value: "OpenStreetMap (free)", status: "ok" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-900/40 border border-slate-700/40"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-300 font-mono">{item.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.value}</p>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    item.status === "ok"
                      ? "text-green-400 bg-green-500/15"
                      : "text-amber-400 bg-amber-500/15"
                  }`}
                >
                  {item.status === "ok" ? "● Active" : "● Demo"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="lg:col-span-2 rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400" />
            About LandslideGuard AI
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { label: "Version", value: "1.0.0-prototype" },
              { label: "Framework", value: "Next.js 14.2" },
              { label: "Built For", value: "SIH 2024" },
              { label: "Data", value: "Simulated" },
            ].map((item) => (
              <div key={item.label} className="bg-slate-800/40 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                <p className="text-sm font-bold text-slate-200">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            LandslideGuard AI is a prototype built for Smart India Hackathon. It demonstrates an AI-powered
            landslide early warning system architecture. All sensor data, risk predictions, and alerts are
            simulated for demonstration purposes. This system is not certified for operational use.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
