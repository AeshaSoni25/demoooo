"use client";

import { useState } from "react";
import {
  Bell,
  Filter,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  ArrowUpCircle,
  Clock,
} from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { AlertCard } from "@/components/ui/alert-card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { DemoBadge } from "@/components/ui/demo-badge";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { Alert, AlertStatus, RiskLevel } from "@/types";

const ESCALATION_STEPS = [
  { icon: "🌧️", label: "Environmental Monitoring", desc: "Continuous sensor data collection from rain gauges, soil moisture probes, tilt sensors" },
  { icon: "⚠️", label: "Anomaly Detection", desc: "Threshold exceeded — abnormal conditions detected" },
  { icon: "🧠", label: "AI Risk Analysis", desc: "Weighted scoring engine computes multi-factor risk score" },
  { icon: "📊", label: "Risk Threshold Exceeded", desc: "Risk score crosses alert threshold (≥60 HIGH, ≥80 CRITICAL)" },
  { icon: "🚨", label: "Early Warning Generated", desc: "Alert created with risk level, score, and recommended action" },
  { icon: "📢", label: "Authority Notification", desc: "District administration, SDMA, NDRF/SDRF alerted" },
  { icon: "🔍", label: "Field Verification", desc: "On-ground teams dispatched to verify and assess conditions" },
  { icon: "🚌", label: "Evacuation Recommendation", desc: "Evacuation orders issued for high-risk populations" },
  { icon: "🚁", label: "Emergency Response", desc: "Full NDRF deployment, medical resources, shelters activated" },
];

type FilterStatus = "ALL" | AlertStatus;
type FilterLevel = "ALL" | RiskLevel;

export default function AlertsPage() {
  const searchParams = useSearchParams();
  const region = searchParams.get("region") || "";

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [filterLevel, setFilterLevel] = useState<FilterLevel>("ALL");
  const [showEscalation, setShowEscalation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      setIsLoading(true);
      try {
        const q = region && region !== "All Regions" ? `?region=${encodeURIComponent(region)}` : "";
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/alerts${q}`);
        const data = await res.json();
        setAlerts(data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAlerts();
  }, [region]);

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "ACKNOWLEDGED", acknowledgedAt: new Date().toISOString() }
          : a
      )
    );
  };

  const handleEscalate = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "ESCALATED",
              escalatedTo: "District Collector / NDRF Regional Command",
            }
          : a
      )
    );
  };

  const filtered = alerts.filter((a) => {
    if (filterStatus !== "ALL" && a.status !== filterStatus) return false;
    if (filterLevel !== "ALL" && a.riskLevel !== filterLevel) return false;
    return true;
  });

  const counts = {
    ACTIVE: alerts.filter((a) => a.status === "ACTIVE").length,
    ESCALATED: alerts.filter((a) => a.status === "ESCALATED").length,
    ACKNOWLEDGED: alerts.filter((a) => a.status === "ACKNOWLEDGED").length,
    RESOLVED: alerts.filter((a) => a.status === "RESOLVED").length,
  };

  return (
    <AppShell title="Alerts">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white">Early Warning Alerts</h1>
            <DemoBadge />
          </div>
          <p className="text-sm text-slate-400">
            Active alerts, escalations, and resolved warnings
          </p>
        </div>
        <button
          onClick={() => setShowEscalation((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-colors"
        >
          {showEscalation ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          Alert Escalation Workflow
        </button>
      </div>

      {/* Escalation workflow */}
      {showEscalation && (
        <div className="mb-5 rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <ArrowUpCircle className="w-4 h-4 text-purple-400" />
            Alert Escalation Workflow
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-700/60" aria-hidden="true" />
            <div className="space-y-3">
              {ESCALATION_STEPS.map((step, i) => (
                <div key={step.label} className="flex items-start gap-4 relative">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-base z-10">
                    {step.icon}
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] text-slate-600 font-mono">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm font-semibold text-white">{step.label}</p>
                      {i <= 4 && (
                        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full border border-blue-500/20">
                          Automated
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { key: "ACTIVE" as FilterStatus, label: "Active", count: counts.ACTIVE, icon: <AlertTriangle className="w-3.5 h-3.5" />, color: "text-red-400 border-red-500/30 bg-red-500/10" },
          { key: "ESCALATED" as FilterStatus, label: "Escalated", count: counts.ESCALATED, icon: <ArrowUpCircle className="w-3.5 h-3.5" />, color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
          { key: "ACKNOWLEDGED" as FilterStatus, label: "Acknowledged", count: counts.ACKNOWLEDGED, icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" },
          { key: "RESOLVED" as FilterStatus, label: "Resolved", count: counts.RESOLVED, icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "text-green-400 border-green-500/30 bg-green-500/10" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilterStatus(filterStatus === item.key ? "ALL" : item.key)}
            className={`rounded-xl border p-3 text-left transition-all hover:scale-[1.01] ${item.color} ${filterStatus === item.key ? "ring-1 ring-current" : ""}`}
            aria-pressed={filterStatus === item.key}
          >
            <div className="flex items-center gap-1.5 mb-1 opacity-70">
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </div>
            <p className="text-2xl font-bold tabular-nums">{item.count}</p>
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Filter className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-xs text-slate-500">Risk Level:</span>
        {(["ALL", "CRITICAL", "HIGH", "MODERATE", "LOW"] as const).map((level) => (
          <button
            key={level}
            onClick={() => setFilterLevel(level)}
            className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
              filterLevel === level
                ? "bg-blue-600/30 text-blue-300 border border-blue-500/30"
                : "bg-slate-800/60 text-slate-400 border border-slate-700 hover:text-slate-200"
            }`}
          >
            {level === "ALL" ? (
              "All Levels"
            ) : (
              <RiskBadge level={level} size="sm" />
            )}
          </button>
        ))}

        <span className="ml-auto text-xs text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {filtered.length} alerts shown
        </span>
      </div>

      {/* Alert cards */}
      {isLoading ? (
        <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 p-12 text-center">
          <p className="text-sm text-slate-500">Loading alerts...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 p-12 text-center">
          <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No alerts match the current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAcknowledge}
              onEscalate={handleEscalate}
              onViewLocation={(locId) => {
                window.location.href = `/locations/${locId}?region=${encodeURIComponent(region)}`;
              }}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
