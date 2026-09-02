"use client";

import { useEffect, useState } from "react";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { RiskBadge } from "@/components/ui/risk-badge";
import type { RiskLevel } from "@/types";

interface RiskScoreCardProps {
  score: number; level: RiskLevel; confidence: number;
  subtitle?: string; location?: string;
  animate?: boolean; size?: "sm" | "md" | "lg"; className?: string;
}

const levelConfig: Record<RiskLevel, { stroke: string; glow: string; bg: string; border: string }> = {
  CRITICAL: { stroke:"#ef4444", glow:"rgba(239,68,68,0.35)",  bg:"rgba(239,68,68,0.06)",  border:"rgba(239,68,68,0.2)" },
  HIGH:     { stroke:"#f97316", glow:"rgba(249,115,22,0.3)",  bg:"rgba(249,115,22,0.06)",  border:"rgba(249,115,22,0.2)" },
  MODERATE: { stroke:"#f59e0b", glow:"rgba(245,158,11,0.25)", bg:"rgba(245,158,11,0.05)",  border:"rgba(245,158,11,0.18)" },
  LOW:      { stroke:"#10b981", glow:"rgba(16,185,129,0.25)", bg:"rgba(16,185,129,0.05)",  border:"rgba(16,185,129,0.18)" },
};

const sizeConfig = {
  sm: { wrap:"p-4", svg:80, r:32, cx:40, cy:40, sw:5, fs:18, textY:17 },
  md: { wrap:"p-5", svg:96, r:38, cx:48, cy:48, sw:6, fs:22, textY:18 },
  lg: { wrap:"p-6", svg:112, r:44, cx:56, cy:56, sw:7, fs:28, textY:20 },
};

export function RiskScoreCard({ score, level, confidence, subtitle, location, animate = true, size = "md", className }: RiskScoreCardProps) {
  const [disp, setDisp] = useState(animate ? 0 : score);

  useEffect(() => {
    if (!animate) { setDisp(score); return; }
    let cur = 0;
    const inc = score / 40;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= score) { setDisp(score); clearInterval(t); }
      else setDisp(Math.floor(cur));
    }, 30);
    return () => clearInterval(t);
  }, [score, animate]);

  const cfg = levelConfig[level];
  const sc = sizeConfig[size];
  const circ = 2 * Math.PI * sc.r;
  const offset = circ - (disp / 100) * circ;

  return (
    <div className={cn("rounded-2xl transition-all", sc.wrap, className)}
      style={{ background: cfg.bg, border:`1px solid ${cfg.border}`, boxShadow:`0 0 24px ${cfg.glow}, inset 0 1px 0 rgba(255,255,255,0.04)` }}>

      {location && <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-3">{location}</p>}

      <div className="flex items-center gap-4">
        {/* Circular gauge */}
        <div className="flex-shrink-0 relative">
          <svg width={sc.svg} height={sc.svg} viewBox={`0 0 ${sc.svg} ${sc.svg}`} role="img" aria-label={`Risk score ${score}/100`}>
            {/* Track */}
            <circle cx={sc.cx} cy={sc.cy} r={sc.r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sc.sw} />
            {/* Glow ring */}
            <circle cx={sc.cx} cy={sc.cy} r={sc.r} fill="none" stroke={cfg.stroke} strokeWidth={sc.sw + 4} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={offset} transform={`rotate(-90 ${sc.cx} ${sc.cy})`}
              opacity="0.15" style={{ transition:"stroke-dashoffset 0.04s linear" }} />
            {/* Main arc */}
            <circle cx={sc.cx} cy={sc.cy} r={sc.r} fill="none" stroke={cfg.stroke} strokeWidth={sc.sw} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={offset} transform={`rotate(-90 ${sc.cx} ${sc.cy})`}
              style={{ transition:"stroke-dashoffset 0.04s linear", filter:`drop-shadow(0 0 4px ${cfg.stroke})` }} />
            {/* Score */}
            <text x={sc.cx} y={sc.cy + 4} textAnchor="middle" dominantBaseline="middle" fill={cfg.stroke}
              fontSize={sc.fs} fontWeight="900" fontFamily="Inter,system-ui,sans-serif">{disp}</text>
            <text x={sc.cx} y={sc.cy + sc.textY} textAnchor="middle" fill="#475569" fontSize={9} fontWeight="500">/100</text>
          </svg>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <RiskBadge level={level} size={size === "lg" ? "md" : "sm"} pulse={level === "CRITICAL"} />
          <div className="flex items-center gap-1.5 mt-2">
            <Brain className="w-3 h-3 text-indigo-400 flex-shrink-0" />
            <span className="text-[11px] text-slate-600">AI Confidence</span>
            <span className="text-[12px] font-bold text-indigo-300">{confidence}%</span>
          </div>
          {subtitle && <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">{subtitle}</p>}
          {/* Mini bar */}
          <div className="mt-2.5 h-1 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.05)" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width:`${score}%`, background:`linear-gradient(90deg,${cfg.stroke}99,${cfg.stroke})` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
