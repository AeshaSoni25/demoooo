"use client";

import { FlaskConical, Play, Square, RotateCcw, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { RiskBadge } from "./risk-badge";

interface DemoModeToggleProps { showControls?: boolean; className?: string; }

export function DemoModeToggle({ showControls = false, className }: DemoModeToggleProps) {
  const { isDemo, toggleDemo, currentStep, stepIndex, nextStep, resetDemo, isRunning, startSimulation, stopSimulation } = useDemoMode();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <button
        onClick={toggleDemo}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all"
        style={isDemo
          ? { background:"rgba(245,158,11,0.12)", color:"#fbbf24", border:"1px solid rgba(245,158,11,0.25)" }
          : { background:"rgba(255,255,255,0.04)", color:"#64748b", border:"1px solid rgba(255,255,255,0.06)" }}
        aria-pressed={isDemo}
      >
        <FlaskConical className="w-3.5 h-3.5" />
        {isDemo ? "Demo Mode ON" : "Demo Mode"}
      </button>

      {isDemo && showControls && (
        <div className="rounded-xl p-3 space-y-3" style={{ background:"rgba(245,158,11,0.05)", border:"1px solid rgba(245,158,11,0.12)" }}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-300 truncate">{currentStep.label}</span>
            <RiskBadge level={currentStep.riskLevel} size="sm" />
          </div>

          {/* Progress */}
          <div className="flex gap-1">
            {[0,1,2,3].map(i => (
              <div key={i} className="flex-1 h-1 rounded-full transition-all"
                style={{ background: i <= stepIndex ? "#f59e0b" : "rgba(255,255,255,0.08)" }} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-500">
            <span>Rain: <span className="text-blue-300 font-bold">{currentStep.rainfall}mm</span></span>
            <span>Risk: <span className="text-orange-300 font-bold">{currentStep.riskScore}/100</span></span>
            <span>Soil: <span className="text-cyan-300 font-bold">{currentStep.soilMoisture}%</span></span>
            <span>Move: <span className="text-purple-300 font-bold">{currentStep.groundMovement}mm/d</span></span>
          </div>

          {currentStep.alertGenerated && (
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg" style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.2)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[10px] font-bold text-red-300">CRITICAL ALERT Generated</span>
            </div>
          )}

          <div className="flex gap-1.5 flex-wrap">
            {!isRunning
              ? <button onClick={startSimulation} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-emerald-300 transition-colors" style={{ background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.2)" }}><Play className="w-3 h-3"/>Auto</button>
              : <button onClick={stopSimulation} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-red-300 transition-colors" style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.2)" }}><Square className="w-3 h-3"/>Stop</button>
            }
            <button onClick={nextStep} disabled={stepIndex >= 3 || isRunning}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-indigo-300 disabled:opacity-40 transition-colors"
              style={{ background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.2)" }}>
              <ChevronRight className="w-3 h-3"/>Next
            </button>
            <button onClick={resetDemo}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-400 transition-colors"
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
              <RotateCcw className="w-3 h-3"/>Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
