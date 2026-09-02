"use client";

import { MapPin, Clock, Users, AlertTriangle, CheckCircle, ArrowUpCircle } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { RiskBadge } from "./risk-badge";
import type { Alert } from "@/types";

const levelConfig = {
  CRITICAL: { border:"rgba(239,68,68,0.2)",  bg:"rgba(239,68,68,0.05)",  accent:"#ef4444", glow:"0 0 20px rgba(239,68,68,0.08)", text:"#fca5a5" },
  HIGH:     { border:"rgba(249,115,22,0.2)", bg:"rgba(249,115,22,0.05)", accent:"#f97316", glow:"0 0 20px rgba(249,115,22,0.06)", text:"#fdba74" },
  MODERATE: { border:"rgba(245,158,11,0.18)",bg:"rgba(245,158,11,0.04)", accent:"#f59e0b", glow:"none",                          text:"#fcd34d" },
  LOW:      { border:"rgba(16,185,129,0.18)",bg:"rgba(16,185,129,0.04)", accent:"#10b981", glow:"none",                          text:"#6ee7b7" },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  ACTIVE:       { label:"Active",       color:"#f87171" },
  ACKNOWLEDGED: { label:"Acknowledged", color:"#fbbf24" },
  RESOLVED:     { label:"Resolved",     color:"#34d399" },
  ESCALATED:    { label:"Escalated",    color:"#c084fc" },
};

interface AlertCardProps {
  alert: Alert;
  onAcknowledge?: (id: string) => void;
  onEscalate?: (id: string) => void;
  onViewLocation?: (locationId: string) => void;
  compact?: boolean;
  className?: string;
}

export function AlertCard({ alert, onAcknowledge, onEscalate, onViewLocation, compact = false, className }: AlertCardProps) {
  const cfg = levelConfig[alert.riskLevel];
  const statusInfo = statusLabels[alert.status];

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all", className)}
        style={{ background: cfg.bg, border:`1px solid ${cfg.border}` }}>
        <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: cfg.accent }} />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-slate-200 truncate">{alert.locationName}</p>
          <p className="text-[11px] text-slate-600 truncate">{alert.trigger}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <RiskBadge level={alert.riskLevel} size="sm" />
          <p className="text-[10px] text-slate-600 mt-0.5">{formatRelativeTime(alert.issuedAt)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl p-5 transition-all", className)}
      style={{ background: cfg.bg, border:`1px solid ${cfg.border}`, boxShadow: cfg.glow }}
      role="article" aria-label={`${alert.riskLevel} alert for ${alert.locationName}`}>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex-shrink-0">
            <AlertTriangle className={cn("w-5 h-5", alert.riskLevel==="CRITICAL" && "animate-pulse")} style={{ color: cfg.accent }} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <RiskBadge level={alert.riskLevel} size="sm" pulse={alert.status==="ACTIVE"} />
              <span className="text-[10px] font-mono text-slate-600 px-1.5 py-0.5 rounded" style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)" }}>{alert.zone}</span>
            </div>
            <h3 className="text-[15px] font-bold text-white">{alert.locationName}</h3>
            <p className="text-[11px] text-slate-600">{alert.state}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-[28px] font-black tabular-nums leading-none" style={{ color: cfg.accent }}>{alert.riskScore}</span>
          <span className="text-[11px] text-slate-600">/100</span>
          <p className="text-[10px] text-slate-600 mt-0.5">Risk Score</p>
        </div>
      </div>

      {/* Trigger */}
      <div className="rounded-xl px-3 py-2.5 mb-3" style={{ background:"rgba(0,0,0,0.2)", border:"1px solid rgba(255,255,255,0.04)" }}>
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mb-1">Trigger</p>
        <p className="text-[12px] text-slate-300 leading-snug">{alert.trigger}</p>
      </div>

      {/* Action */}
      <div className="rounded-xl px-3 py-2.5 mb-4" style={{ background:"rgba(0,0,0,0.15)", border:"1px solid rgba(255,255,255,0.03)" }}>
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 mb-1">Recommended Action</p>
        <p className="text-[12px] text-slate-200 leading-snug">{alert.recommendedAction}</p>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 mb-4 text-[11px] text-slate-600">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{formatRelativeTime(alert.issuedAt)}</span>
        <span className="flex items-center gap-1"><Users className="w-3 h-3"/>{alert.affectedPopulation.toLocaleString("en-IN")} affected</span>
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/>{alert.state}</span>
        <span className="font-semibold" style={{ color: statusInfo.color }}>● {statusInfo.label}</span>
      </div>

      {/* Actions */}
      {alert.status === "ACTIVE" && (
        <div className="flex flex-wrap gap-2">
          {onAcknowledge && (
            <button onClick={() => onAcknowledge(alert.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-300 transition-all hover:-translate-y-px"
              style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
              <CheckCircle className="w-3.5 h-3.5"/>Acknowledge
            </button>
          )}
          {onViewLocation && (
            <button onClick={() => onViewLocation(alert.locationId)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-indigo-300 transition-all hover:-translate-y-px"
              style={{ background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.2)" }}>
              <MapPin className="w-3.5 h-3.5"/>View Location
            </button>
          )}
          {onEscalate && (
            <button onClick={() => onEscalate(alert.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-purple-300 transition-all hover:-translate-y-px"
              style={{ background:"rgba(168,85,247,0.12)", border:"1px solid rgba(168,85,247,0.2)" }}>
              <ArrowUpCircle className="w-3.5 h-3.5"/>Escalate
            </button>
          )}
        </div>
      )}
      {alert.escalatedTo && (
        <p className="text-[11px] text-purple-400 mt-2 flex items-center gap-1">
          <ArrowUpCircle className="w-3 h-3"/>Escalated to: {alert.escalatedTo}
        </p>
      )}
    </div>
  );
}
