"use client";

import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

const styles: Record<RiskLevel, { bg: string; text: string; border: string; dot: string; glow: string }> = {
  CRITICAL: { bg:"rgba(239,68,68,0.12)",    text:"#fca5a5", border:"rgba(239,68,68,0.3)",    dot:"#ef4444", glow:"0 0 8px rgba(239,68,68,0.4)" },
  HIGH:     { bg:"rgba(249,115,22,0.12)",   text:"#fdba74", border:"rgba(249,115,22,0.3)",   dot:"#f97316", glow:"0 0 8px rgba(249,115,22,0.35)" },
  MODERATE: { bg:"rgba(245,158,11,0.12)",   text:"#fcd34d", border:"rgba(245,158,11,0.3)",   dot:"#f59e0b", glow:"none" },
  LOW:      { bg:"rgba(16,185,129,0.12)",   text:"#6ee7b7", border:"rgba(16,185,129,0.3)",   dot:"#10b981", glow:"none" },
};

const sizes = {
  sm: { wrap:"px-2 py-0.5 text-[10px] gap-1",   dot:"w-1.5 h-1.5" },
  md: { wrap:"px-2.5 py-1 text-[11px] gap-1.5", dot:"w-2 h-2" },
  lg: { wrap:"px-3 py-1.5 text-[12px] gap-2",   dot:"w-2.5 h-2.5" },
};

export function RiskBadge({ level, size = "md", pulse = false, className }: RiskBadgeProps) {
  const s = styles[level];
  const z = sizes[size];
  return (
    <span
      className={cn("inline-flex items-center rounded-full font-bold uppercase tracking-wide flex-shrink-0", z.wrap, className)}
      style={{ background: s.bg, color: s.text, border:`1px solid ${s.border}`, boxShadow: s.glow }}
      aria-label={`Risk level: ${level}`}
    >
      <span
        className={cn("rounded-full flex-shrink-0", z.dot, pulse && (level === "CRITICAL" || level === "HIGH") && "animate-pulse")}
        style={{ background: s.dot, boxShadow: s.glow }}
      />
      {level}
    </span>
  );
}
