"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Activity,
  Bell,
  Brain,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  Droplets,
  Thermometer,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/dashboard/app-shell";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { RiskScoreCard } from "@/components/risk/risk-score-card";
import { MetricCard } from "@/components/ui/metric-card";
import { AlertCard } from "@/components/ui/alert-card";
import { SensorCard } from "@/components/ui/sensor-card";
import { DemoBadge } from "@/components/ui/demo-badge";
import { RiskBadge } from "@/components/ui/risk-badge";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { formatRelativeTime, getRiskColor } from "@/lib/utils";
import { DEMO_LOCATIONS } from "@/data/demo/locations";
import { DEMO_ALERTS } from "@/data/demo/alerts";
import { DEMO_SENSORS } from "@/data/demo/sensors";
import { DASHBOARD_STATS } from "@/data/demo/analytics";
import { DemoModeToggle } from "@/components/ui/demo-mode-toggle";

export default function DashboardPage() {
  const { isDemo, currentStep } = useDemoMode();
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Live refresh every 30s in demo mode
  useEffect(() => {
    if (!isDemo) return;
    const t = setInterval(() => setLastRefresh(new Date()), 30000);
    return () => clearInterval(t);
  }, [isDemo]);

  const stats = isDemo
    ? {
        ...DASHBOARD_STATS,
        overallRiskScore: currentStep.riskScore,
        overallRiskLevel: currentStep.riskLevel,
        aiConfidence: DASHBOARD_STATS.aiConfidence,
      }
    : DASHBOARD_STATS;

  const activeAlerts = DEMO_ALERTS.filter(
    (a) => a.status === "ACTIVE" || a.status === "ESCALATED"
  ).slice(0, 3);

  const criticalLocations = DEMO_LOCATIONS.filter(
    (l) => l.riskLevel === "CRITICAL" || l.riskLevel === "HIGH"
  )
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  const featuredSensors = DEMO_SENSORS.filter(
    (s) => s.status === "ALERT" || s.status === "WARNING"
  ).slice(0, 4);

  return (
    <ProtectedRoute>
      <AppShell title="Dashboard">
        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-white">
                Operations Dashboard
              </h1>
              {isDemo && <DemoBadge />}
            </div>
            <p className="text-sm text-slate-400">
              AI-assisted landslide risk overview — all monitored regions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLastRefresh(new Date())}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Refresh data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <span className="text-xs text-slate-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(lastRefresh.toISOString())}
            </span>
          </div>
        </div>

      {/* ── Demo simulation panel ─────────────────────────── */}
      {isDemo && (
        <div className="mb-6">
          <DemoModeToggle showControls className="max-w-sm" />
        </div>
      )}

      {/* ── Top metrics ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <MetricCard
          title="Locations Monitored"
          value={stats.totalLocations}
          icon={<MapPin className="w-4 h-4" />}
          subtitle="Across 7 states"
        />
        <MetricCard
          title="Active Sensors"
          value={stats.activeSensors}
          icon={<Activity className="w-4 h-4" />}
          subtitle="IoT sensor network"
        />
        <MetricCard
          title="High-Risk Zones"
          value={stats.highRiskZones}
          icon={<AlertTriangle className="w-4 h-4" />}
          variant="high"
          subtitle="Requires monitoring"
        />
        <MetricCard
          title="Active Alerts"
          value={stats.totalAlerts}
          icon={<Bell className="w-4 h-4" />}
          variant={stats.totalAlerts > 10 ? "critical" : "high"}
          subtitle="Pending response"
        />
        <MetricCard
          title="Prediction Accuracy"
          value={`${stats.predictionAccuracy}%`}
          icon={<Brain className="w-4 h-4" />}
          variant="low"
          subtitle="Prototype estimate"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {/* ── Main grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Overall Risk Score */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white">Overall Risk Status</h2>
              <Brain className="w-4 h-4 text-blue-400" />
            </div>
            <RiskScoreCard
              score={stats.overallRiskScore}
              level={stats.overallRiskLevel}
              confidence={stats.aiConfidence}
              subtitle="Aggregate across all monitored regions"
              size="lg"
              animate
            />
            <div className="mt-4 pt-4 border-t border-slate-700/40 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Status</span>
                <span className="text-orange-300 font-semibold">Monitoring Required</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Updated</span>
                <span className="text-slate-300">{formatRelativeTime(lastRefresh.toISOString())}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Data Source</span>
                <DemoBadge />
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-4">
            <h2 className="text-sm font-bold text-white mb-3">Quick Actions</h2>
            <div className="space-y-1.5">
              {[
                { href: "/risk-map", label: "Open Risk Map", color: "text-green-400" },
                { href: "/predictions", label: "Run AI Prediction", color: "text-blue-400" },
                { href: "/alerts", label: "View All Alerts", color: "text-orange-400" },
                { href: "/emergency", label: "Emergency Response", color: "text-red-400" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-700/40 transition-colors group"
                >
                  <span className={`text-xs font-medium ${item.color}`}>
                    {item.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-orange-400" />
                Active Alerts
              </h2>
              <Link
                href="/alerts"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  compact={false}
                  onViewLocation={(id) => {
                    window.location.href = `/locations/${id}`;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Regional risk + sensors row ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* High-risk locations */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-400" />
              Critical & High Risk Zones
            </h2>
            <Link
              href="/risk-map"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Map view <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {criticalLocations.map((loc) => (
              <Link
                key={loc.id}
                href={`/locations/${loc.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/40 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-200 truncate">
                      {loc.name}
                    </p>
                    <RiskBadge level={loc.riskLevel} size="sm" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{loc.state}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span
                    className={`text-lg font-bold tabular-nums ${getRiskColor(loc.riskLevel)}`}
                  >
                    {loc.riskScore}
                  </span>
                  <span className="text-xs text-slate-600">/100</span>
                </div>
                <div className="w-20 hidden sm:block">
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        loc.riskLevel === "CRITICAL"
                          ? "bg-red-500"
                          : loc.riskLevel === "HIGH"
                          ? "bg-orange-500"
                          : "bg-yellow-500"
                      }`}
                      style={{ width: `${loc.riskScore}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-600 mt-0.5 text-right">
                    {loc.rainfall24h} mm/24h
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Sensor alerts */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Sensors in Alert/Warning
            </h2>
            <Link
              href="/monitoring"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              All sensors <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featuredSensors.map((sensor) => (
              <SensorCard key={sensor.id} sensor={sensor} compact />
            ))}
          </div>

          {/* Mini summary */}
          <div className="mt-4 pt-4 border-t border-slate-700/40 grid grid-cols-3 gap-2 text-center">
            {[
              {
                label: "Alert",
                count: DEMO_SENSORS.filter((s) => s.status === "ALERT").length,
                color: "text-red-400",
              },
              {
                label: "Warning",
                count: DEMO_SENSORS.filter((s) => s.status === "WARNING").length,
                color: "text-yellow-400",
              },
              {
                label: "Normal",
                count: DEMO_SENSORS.filter((s) => s.status === "NORMAL").length,
                color: "text-green-400",
              },
            ].map((item) => (
              <div key={item.label}>
                <p className={`text-lg font-bold tabular-nums ${item.color}`}>
                  {item.count}
                </p>
                <p className="text-xs text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Environmental overview ────────────────────────── */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-400" />
          Environmental Conditions — Key Locations
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[640px]" role="table">
            <thead>
              <tr className="border-b border-slate-700/60">
                <th className="text-left pb-2 text-slate-500 font-semibold">Location</th>
                <th className="text-right pb-2 text-slate-500 font-semibold">Risk</th>
                <th className="text-right pb-2 text-slate-500 font-semibold">
                  <span className="flex items-center justify-end gap-1">
                    <Droplets className="w-3 h-3" /> Rainfall 24h
                  </span>
                </th>
                <th className="text-right pb-2 text-slate-500 font-semibold">Soil Moisture</th>
                <th className="text-right pb-2 text-slate-500 font-semibold">
                  <span className="flex items-center justify-end gap-1">
                    <Activity className="w-3 h-3" /> Movement
                  </span>
                </th>
                <th className="text-right pb-2 text-slate-500 font-semibold">AI Conf.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {DEMO_LOCATIONS.sort((a, b) => b.riskScore - a.riskScore)
                .slice(0, 8)
                .map((loc) => (
                  <tr
                    key={loc.id}
                    className="hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="py-2.5">
                      <Link
                        href={`/locations/${loc.id}`}
                        className="text-slate-200 hover:text-blue-400 font-medium transition-colors"
                      >
                        {loc.name}
                      </Link>
                      <span className="text-slate-600 ml-1.5">{loc.state}</span>
                    </td>
                    <td className="py-2.5 text-right">
                      <RiskBadge level={loc.riskLevel} size="sm" />
                    </td>
                    <td className="py-2.5 text-right">
                      <span
                        className={
                          loc.rainfall24h > 150
                            ? "text-red-400 font-semibold"
                            : loc.rainfall24h > 100
                            ? "text-yellow-400"
                            : "text-slate-300"
                        }
                      >
                        {loc.rainfall24h} mm
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <span
                        className={
                          loc.soilMoisture > 85
                            ? "text-red-400 font-semibold"
                            : loc.soilMoisture > 70
                            ? "text-yellow-400"
                            : "text-slate-300"
                        }
                      >
                        {loc.soilMoisture}%
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <span
                        className={
                          loc.groundMovement > 5
                            ? "text-red-400 font-semibold"
                            : loc.groundMovement > 2
                            ? "text-yellow-400"
                            : "text-slate-300"
                        }
                      >
                        {loc.groundMovement} mm/d
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-blue-300 font-medium">
                      {loc.aiConfidence}%
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      </AppShell>
    </ProtectedRoute>
  );
}
