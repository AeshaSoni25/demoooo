import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RiskLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Risk color helpers ──────────────────────────────────────
export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case "CRITICAL":
      return "text-red-400";
    case "HIGH":
      return "text-orange-400";
    case "MODERATE":
      return "text-yellow-400";
    case "LOW":
      return "text-green-400";
    default:
      return "text-slate-400";
  }
}

export function getRiskBgColor(level: RiskLevel): string {
  switch (level) {
    case "CRITICAL":
      return "bg-red-500/20 border-red-500/40";
    case "HIGH":
      return "bg-orange-500/20 border-orange-500/40";
    case "MODERATE":
      return "bg-yellow-500/20 border-yellow-500/40";
    case "LOW":
      return "bg-green-500/20 border-green-500/40";
    default:
      return "bg-slate-500/20 border-slate-500/40";
  }
}

export function getRiskBarColor(level: RiskLevel): string {
  switch (level) {
    case "CRITICAL":
      return "bg-red-500";
    case "HIGH":
      return "bg-orange-500";
    case "MODERATE":
      return "bg-yellow-500";
    case "LOW":
      return "bg-green-500";
    default:
      return "bg-slate-500";
  }
}

export function getRiskHex(level: RiskLevel): string {
  switch (level) {
    case "CRITICAL":
      return "#ef4444";
    case "HIGH":
      return "#f97316";
    case "MODERATE":
      return "#eab308";
    case "LOW":
      return "#22c55e";
    default:
      return "#64748b";
  }
}

// ── Sensor status helpers ───────────────────────────────────
export function getSensorStatusColor(status: string): string {
  switch (status) {
    case "ALERT":
      return "text-red-400";
    case "WARNING":
      return "text-yellow-400";
    case "NORMAL":
      return "text-green-400";
    case "OFFLINE":
      return "text-slate-400";
    default:
      return "text-slate-400";
  }
}

export function getSensorStatusBg(status: string): string {
  switch (status) {
    case "ALERT":
      return "bg-red-500/20 border-red-500/30";
    case "WARNING":
      return "bg-yellow-500/20 border-yellow-500/30";
    case "NORMAL":
      return "bg-green-500/20 border-green-500/30";
    case "OFFLINE":
      return "bg-slate-500/20 border-slate-500/30";
    default:
      return "bg-slate-500/20 border-slate-500/30";
  }
}

// ── Time formatting ─────────────────────────────────────────
export function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── Score label ─────────────────────────────────────────────
export function getRiskScoreLabel(score: number): string {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Moderate";
  return "Low";
}

// ── Number formatting ────────────────────────────────────────
export function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

// ── Sensor type label ─────────────────────────────────────────
export function getSensorTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    RAIN_GAUGE: "Rain Gauge",
    SOIL_MOISTURE: "Soil Moisture",
    TILT_SENSOR: "Tilt Sensor",
    GROUND_MOVEMENT: "Ground Movement",
    TEMPERATURE: "Temperature",
    HUMIDITY: "Humidity",
  };
  return labels[type] || type;
}
