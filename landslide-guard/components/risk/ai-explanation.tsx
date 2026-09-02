"use client";

import { Brain, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FactorContribution, RiskLevel } from "@/types";

interface AIExplanationProps {
  factors: FactorContribution[];
  confidence: number;
  riskLevel: RiskLevel;
  summary?: string;
  className?: string;
}

const barPalette = ["#6366f1","#06b6d4","#f97316","#a78bfa","#ef4444","#10b981"];

const levelConfig = {
  CRITICAL: { text:"#fca5a5", label:"CRITICAL" },
  HIGH:     { text:"#fdba74", label:"HIGH" },
  MODERATE: { text:"#fcd34d", label:"MODERATE" },
  LOW:      { text:"#6ee7b7", label:"LOW" },
};

export function AIExplanation({ factors, confidence, riskLevel, summary, className }: AIExplanationProps) {
  const cfg = levelConfig[riskLevel];
  const defaultSummary = `The model identifies ${factors[0]?.factor.toLowerCase() ?? "rainfall"} and ${factors[1]?.factor.toLowerCase() ?? "soil saturation"} as the primary risk drivers. ${riskLevel === "CRITICAL" || riskLevel === "HIGH" ? "Multiple high-severity factors converging indicates unstable slope conditions." : "Conditions are within moderate parameters but require continued monitoring."}`;

  return (
    <div className={cn("rounded-2xl p-5", className)}
      style={{ background:"rgba(99,102,241,0.04)", border:"1px solid rgba(99,102,241,0.15)", boxShadow:"0 0 24px rgba(99,102,241,0.06), inset 0 1px 0 rgba(255,255,255,0.04)" }}
      role="region" aria-label="AI Explainability Panel">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.2)" }}>
            <Brain className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-white">
              Why is this area at{" "}
              <span style={{ color: cfg.text }}>{cfg.label}</span> risk?
            </h3>
            <p className="text-[10px] text-slate-600">AI-Assisted Explainability</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-600">Confidence</p>
          <p className="text-[18px] font-black text-indigo-300">{confidence}%</p>
        </div>
      </div>

      {/* Factor bars */}
      <div className="space-y-3.5 mb-5">
        {factors.map((f, i) => (
          <div key={f.factor}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: barPalette[i % barPalette.length] }} />
                <span className="text-[12px] font-semibold text-slate-200 truncate">{f.factor}</span>
                <span className="text-[10px] text-slate-600 hidden sm:inline truncate">— {f.value}</span>
              </div>
              <span className="text-[13px] font-black text-white flex-shrink-0 ml-2">{f.contribution}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.05)" }}
              role="progressbar" aria-valuenow={f.contribution} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width:`${f.contribution}%`, background:`linear-gradient(90deg,${barPalette[i % barPalette.length]}88,${barPalette[i % barPalette.length]})`, boxShadow:`0 0 8px ${barPalette[i % barPalette.length]}50` }} />
            </div>
            <p className="text-[10px] text-slate-700 mt-0.5">{f.description}</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="flex items-start gap-2.5 rounded-xl p-3" style={{ background:"rgba(0,0,0,0.2)", border:"1px solid rgba(99,102,241,0.12)" }}>
        <Info className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
        <p className="text-[12px] text-slate-400 leading-relaxed">{summary ?? defaultSummary}</p>
      </div>

      <p className="text-[10px] text-slate-700 mt-3 italic">
        * Rule-based weighted scoring engine (prototype). Not a certified ML model.
      </p>
    </div>
  );
}
