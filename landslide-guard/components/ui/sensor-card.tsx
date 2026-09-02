"use client";

import { Droplets, Thermometer, Activity, Wind, TrendingUp, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Sensor } from "@/types";

const icons: Record<string, React.ReactNode> = {
  RAIN_GAUGE:     <Droplets className="w-4 h-4" />,
  SOIL_MOISTURE:  <Activity className="w-4 h-4" />,
  TILT_SENSOR:    <TrendingUp className="w-4 h-4" />,
  GROUND_MOVEMENT:<Gauge className="w-4 h-4" />,
  TEMPERATURE:    <Thermometer className="w-4 h-4" />,
  HUMIDITY:       <Wind className="w-4 h-4" />,
};

const statusConfig = {
  ALERT:   { border:"rgba(239,68,68,0.25)",  bg:"rgba(239,68,68,0.07)",    text:"#fca5a5", accent:"#ef4444", label:"Alert",   bar:"#ef4444" },
  WARNING: { border:"rgba(245,158,11,0.25)", bg:"rgba(245,158,11,0.06)",   text:"#fcd34d", accent:"#f59e0b", label:"Warning", bar:"#f59e0b" },
  NORMAL:  { border:"rgba(16,185,129,0.2)",  bg:"rgba(16,185,129,0.05)",   text:"#6ee7b7", accent:"#10b981", label:"Normal",  bar:"#10b981" },
  OFFLINE: { border:"rgba(100,116,139,0.2)", bg:"rgba(100,116,139,0.05)",  text:"#94a3b8", accent:"#64748b", label:"Offline", bar:"#475569" },
};

interface SensorCardProps { sensor: Sensor; compact?: boolean; className?: string; }

export function SensorCard({ sensor, compact = false, className }: SensorCardProps) {
  const cfg = statusConfig[sensor.status] ?? statusConfig.OFFLINE;
  const rawPct = ((sensor.currentValue - sensor.minNormal) / (sensor.maxNormal - sensor.minNormal + 0.001)) * 100;
  const pct = Math.min(100, Math.max(0, rawPct));

  if (compact) {
    return (
      <div className={cn("flex items-center justify-between rounded-xl px-3 py-2.5", className)}
        style={{ background: cfg.bg, border:`1px solid ${cfg.border}` }}>
        <div className="flex items-center gap-2">
          <span style={{ color: cfg.accent }}>{icons[sensor.type]}</span>
          <span className="text-[12px] font-semibold text-slate-200">{sensor.label}</span>
        </div>
        <div className="text-right">
          <span className="text-[13px] font-bold tabular-nums" style={{ color: cfg.text }}>{sensor.currentValue}</span>
          <span className="text-[10px] text-slate-600 ml-0.5">{sensor.unit}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl p-4 transition-all hover:-translate-y-0.5", className)}
      style={{ background: cfg.bg, border:`1px solid ${cfg.border}`, boxShadow:`0 0 16px ${cfg.accent}10` }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background:`${cfg.accent}18`, border:`1px solid ${cfg.accent}25`, color: cfg.accent }}>
            {icons[sensor.type]}
          </div>
          <div>
            <p className="text-[13px] font-bold text-slate-200">{sensor.label}</p>
            <p className="text-[10px] text-slate-600">{sensor.locationName}</p>
          </div>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background:`${cfg.accent}15`, color: cfg.text, border:`1px solid ${cfg.accent}25` }}>
          {cfg.label}
        </span>
      </div>

      {/* Value */}
      <div className="mb-3">
        <span className="text-[32px] font-black tabular-nums leading-none" style={{ color: cfg.text }}>{sensor.currentValue}</span>
        <span className="text-[13px] text-slate-600 ml-1 font-medium">{sensor.unit}</span>
      </div>

      {/* Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] text-slate-700 mb-1">
          <span>Normal: {sensor.minNormal}–{sensor.maxNormal} {sensor.unit}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.05)" }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width:`${pct}%`, background:`linear-gradient(90deg,${cfg.bar}88,${cfg.bar})`, boxShadow:`0 0 6px ${cfg.bar}60` }} />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between text-[10px] text-slate-700">
        <span>Battery: <span className={sensor.batteryLevel < 30 ? "text-red-400" : "text-emerald-400"} style={{ fontWeight:600 }}>{sensor.batteryLevel}%</span></span>
        <span>{new Date(sensor.lastUpdated).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:false})}</span>
      </div>
    </div>
  );
}
