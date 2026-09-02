"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart2, TrendingUp, Bell, Activity } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { ChartCard } from "@/components/ui/chart-card";
import { DemoBadge } from "@/components/ui/demo-badge";
import {
  generateRainfallRiskData,
  generateRiskTrend,
  generateAlertsOverTime,
  REGIONAL_RISK_DATA,
  SENSOR_HEALTH_DATA,
} from "@/data/demo/analytics";
import { DEMO_HISTORICAL_EVENTS } from "@/data/demo/historical";

type Range = "24h" | "7d" | "30d";

const TOOLTIP_STYLE = {
  backgroundColor: "#0f1f3d",
  border: "1px solid #1e3a5f",
  borderRadius: "8px",
  color: "#e2e8f0",
  fontSize: "11px",
};

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("30d");

  const days = range === "24h" ? 1 : range === "7d" ? 7 : 30;
  const rainfallRiskData = useMemo(() => generateRainfallRiskData(days), [days]);
  const riskTrend = useMemo(() => generateRiskTrend(days), [days]);
  const alertsData = useMemo(() => generateAlertsOverTime(days), [days]);

  const historicalByYear = useMemo(() => {
    const byYear: Record<string, number> = {};
    DEMO_HISTORICAL_EVENTS.forEach((e) => {
      const year = e.date.slice(0, 4);
      byYear[year] = (byYear[year] || 0) + 1;
    });
    return Object.entries(byYear)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, count]) => ({ year, count }));
  }, []);

  return (
    <AppShell title="Analytics">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white">Risk Analytics</h1>
            <DemoBadge />
          </div>
          <p className="text-sm text-slate-400">
            Historical trends, regional distribution, and sensor health metrics
          </p>
        </div>

        {/* Time range */}
        <div className="flex gap-1.5 p-1 rounded-lg bg-slate-800/60 border border-slate-700/60">
          {(["24h", "7d", "30d"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                range === r
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              aria-pressed={range === r}
            >
              {r === "24h" ? "24 Hours" : r === "7d" ? "7 Days" : "30 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Charts grid */}
      <div className="space-y-4">
        {/* Rainfall vs Risk Score */}
        <ChartCard
          title="Rainfall vs Risk Score"
          subtitle={`Last ${range === "24h" ? "24 hours" : range === "7d" ? "7 days" : "30 days"} — dual axis`}
          action={<TrendingUp className="w-4 h-4 text-slate-500" />}
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={rainfallRiskData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rainfallGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickLine={false}
                interval={Math.floor(rainfallRiskData.length / 6)}
              />
              <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend
                wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }}
                iconSize={8}
              />
              <Area
                type="monotone"
                dataKey="value"
                name="Rainfall (mm)"
                stroke="#3b82f6"
                fill="url(#rainfallGrad)"
                strokeWidth={2}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="secondary"
                name="Risk Score"
                stroke="#f97316"
                fill="url(#riskGrad)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Risk Score Trend */}
          <ChartCard
            title="Risk Score Trend"
            subtitle="Composite risk across all regions"
            action={<BarChart2 className="w-4 h-4 text-slate-500" />}
          >
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={riskTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  tickLine={false}
                  interval={Math.floor(riskTrend.length / 5)}
                />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Risk Score"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#ef4444" }}
                />
                {/* Reference lines at 60 (HIGH) and 80 (CRITICAL) */}
                <Line
                  type="monotone"
                  dataKey={() => 60}
                  stroke="#eab308"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  dot={false}
                  name="HIGH threshold"
                />
                <Line
                  type="monotone"
                  dataKey={() => 80}
                  stroke="#ef4444"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  dot={false}
                  name="CRITICAL threshold"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Alerts over time */}
          <ChartCard
            title="Alerts Issued Over Time"
            subtitle="Daily alert frequency"
            action={<Bell className="w-4 h-4 text-slate-500" />}
          >
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={alertsData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#64748b", fontSize: 10 }}
                  tickLine={false}
                  interval={Math.floor(alertsData.length / 5)}
                />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="value" name="Alerts" fill="#f97316" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Regional risk distribution */}
          <ChartCard
            title="Regional Risk Distribution"
            subtitle="Risk zones by state"
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={REGIONAL_RISK_DATA}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis
                  dataKey="region"
                  type="category"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  tickLine={false}
                  width={100}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} iconSize={8} />
                <Bar dataKey="critical" name="Critical" stackId="a" fill="#ef4444" />
                <Bar dataKey="high" name="High" stackId="a" fill="#f97316" />
                <Bar dataKey="moderate" name="Moderate" stackId="a" fill="#eab308" />
                <Bar dataKey="low" name="Low" stackId="a" fill="#22c55e" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="grid grid-cols-1 gap-4">
            {/* Sensor health */}
            <ChartCard
              title="Sensor Network Health"
              subtitle="Status distribution across 342 sensors"
              action={<Activity className="w-4 h-4 text-slate-500" />}
            >
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie
                      data={SENSOR_HEALTH_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {SENSOR_HEALTH_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 flex-1">
                  {SENSOR_HEALTH_DATA.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-slate-400">{item.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-200 tabular-nums">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ChartCard>

            {/* Historical events */}
            <ChartCard
              title="Historical Landslide Events"
              subtitle="Recorded events by year (demo data)"
            >
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={historicalByYear} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="count" name="Events" fill="#6366f1" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
