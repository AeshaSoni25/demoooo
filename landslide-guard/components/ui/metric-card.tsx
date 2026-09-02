"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: number; label: string };
  variant?: "default" | "critical" | "high" | "moderate" | "low";
  className?: string;
  children?: ReactNode;
}

const variantConfig: Record<string, { border: string; bg: string; valueColor: string; glow?: string }> = {
  default:  { border:"rgba(255,255,255,0.07)", bg:"rgba(8,15,42,0.6)",       valueColor:"#f1f5f9" },
  critical: { border:"rgba(239,68,68,0.25)",   bg:"rgba(239,68,68,0.06)",    valueColor:"#fca5a5", glow:"0 0 20px rgba(239,68,68,0.08)" },
  high:     { border:"rgba(249,115,22,0.25)",  bg:"rgba(249,115,22,0.06)",   valueColor:"#fdba74", glow:"0 0 20px rgba(249,115,22,0.08)" },
  moderate: { border:"rgba(245,158,11,0.25)",  bg:"rgba(245,158,11,0.06)",   valueColor:"#fcd34d" },
  low:      { border:"rgba(16,185,129,0.25)",  bg:"rgba(16,185,129,0.06)",   valueColor:"#6ee7b7" },
};

export function MetricCard({ title, value, unit, subtitle, icon, trend, variant = "default", className, children }: MetricCardProps) {
  const cfg = variantConfig[variant];
  return (
    <div
      className={cn("rounded-2xl p-4 transition-all hover:-translate-y-0.5", className)}
      style={{ background: cfg.bg, border:`1px solid ${cfg.border}`, boxShadow: cfg.glow ?? "0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)" }}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">{title}</p>
        {icon && <span className="text-slate-600">{icon}</span>}
      </div>
      <div className="flex items-end gap-1.5 mb-1">
        <span className="text-[26px] font-black leading-none tabular-nums" style={{ color: cfg.valueColor }}>{value}</span>
        {unit && <span className="text-[12px] text-slate-600 mb-0.5 font-medium">{unit}</span>}
      </div>
      {subtitle && <p className="text-[11px] text-slate-600 mt-1">{subtitle}</p>}
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <span className={cn("text-[11px] font-semibold", trend.value > 0 ? "text-red-400" : "text-emerald-400")}>
            {trend.value > 0 ? "▲" : "▼"} {Math.abs(trend.value)}
          </span>
          <span className="text-[11px] text-slate-600">{trend.label}</span>
        </div>
      )}
      {children}
    </div>
  );
}
