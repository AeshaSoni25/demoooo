"use client";

import { useState } from "react";
import { Brain, Play, RotateCcw, Info, Sliders } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { RiskScoreCard } from "@/components/risk/risk-score-card";
import { AIExplanation } from "@/components/risk/ai-explanation";
import { DemoBadge } from "@/components/ui/demo-badge";
import { LoadingState } from "@/components/ui/loading-state";
import { predictLandslideRisk, PREDICTION_WEIGHTS } from "@/lib/ai/prediction-engine";
import type { PredictionInput, PredictionResult } from "@/types";

const PRESETS = [
  {
    label: "Low Risk",
    input: {
      rainfall24h: 30,
      rainfall7d: 90,
      soilMoisture: 40,
      soilSaturation: 35,
      slopeAngle: 18,
      groundDisplacement: 0.5,
      elevation: 800,
      temperature: 22,
      vegetationIndex: 0.78,
      historicalLandslides: 1,
    },
  },
  {
    label: "Moderate Risk",
    input: {
      rainfall24h: 95,
      rainfall7d: 260,
      soilMoisture: 65,
      soilSaturation: 62,
      slopeAngle: 30,
      groundDisplacement: 2.2,
      elevation: 1200,
      temperature: 18,
      vegetationIndex: 0.55,
      historicalLandslides: 5,
    },
  },
  {
    label: "High Risk",
    input: {
      rainfall24h: 165,
      rainfall7d: 420,
      soilMoisture: 82,
      soilSaturation: 85,
      slopeAngle: 40,
      groundDisplacement: 5.1,
      elevation: 2000,
      temperature: 12,
      vegetationIndex: 0.38,
      historicalLandslides: 12,
    },
  },
  {
    label: "Critical Risk",
    input: {
      rainfall24h: 240,
      rainfall7d: 600,
      soilMoisture: 93,
      soilSaturation: 96,
      slopeAngle: 45,
      groundDisplacement: 9.0,
      elevation: 2500,
      temperature: 8,
      vegetationIndex: 0.18,
      historicalLandslides: 25,
    },
  },
];

const FIELDS: {
  key: keyof PredictionInput;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  weight?: number;
}[] = [
  { key: "rainfall24h", label: "Rainfall (24h)", unit: "mm", min: 0, max: 400, step: 1, weight: PREDICTION_WEIGHTS.rainfall },
  { key: "rainfall7d", label: "Rainfall (7 days)", unit: "mm", min: 0, max: 1200, step: 5 },
  { key: "soilMoisture", label: "Soil Moisture", unit: "%", min: 0, max: 100, step: 1, weight: PREDICTION_WEIGHTS.soilMoisture },
  { key: "soilSaturation", label: "Soil Saturation", unit: "%", min: 0, max: 100, step: 1 },
  { key: "slopeAngle", label: "Slope Angle", unit: "°", min: 0, max: 90, step: 1, weight: PREDICTION_WEIGHTS.slope },
  { key: "groundDisplacement", label: "Ground Displacement", unit: "mm/day", min: 0, max: 30, step: 0.1, weight: PREDICTION_WEIGHTS.groundMovement },
  { key: "elevation", label: "Elevation", unit: "m", min: 0, max: 5000, step: 50 },
  { key: "temperature", label: "Temperature", unit: "°C", min: -10, max: 45, step: 0.5 },
  { key: "vegetationIndex", label: "Vegetation Index (NDVI)", unit: "", min: 0, max: 1, step: 0.01, weight: PREDICTION_WEIGHTS.vegetation },
  { key: "historicalLandslides", label: "Historical Landslide Events", unit: "", min: 0, max: 50, step: 1, weight: PREDICTION_WEIGHTS.historical },
];

const DEFAULT_INPUT: PredictionInput = {
  rainfall24h: 120,
  rainfall7d: 320,
  soilMoisture: 72,
  soilSaturation: 68,
  slopeAngle: 35,
  groundDisplacement: 3.0,
  elevation: 1500,
  temperature: 15,
  vegetationIndex: 0.5,
  historicalLandslides: 7,
};

export default function PredictionsPage() {
  const [input, setInput] = useState<PredictionInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePreset = (preset: (typeof PRESETS)[0]) => {
    setInput(preset.input);
    setResult(null);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    // Simulate async call (ready for ML backend)
    await new Promise((r) => setTimeout(r, 800));
    const res = predictLandslideRisk(input);
    setResult(res);
    setLoading(false);
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setResult(null);
  };

  const handleChange = (key: keyof PredictionInput, value: number) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AppShell title="AI Predictions">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-white">AI Landslide Risk Prediction</h1>
            <DemoBadge />
          </div>
          <p className="text-sm text-slate-400">
            Enter environmental parameters to compute AI-assisted risk assessment
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
          <Info className="w-3.5 h-3.5" />
          Rule-based weighted scoring engine — not a trained ML model
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Input form ─────────────────────────────────── */}
        <div>
          {/* Presets */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Quick Presets
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handlePreset(p)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/60 border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fields */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-400" />
              Environmental Parameters
            </h2>

            {FIELDS.map((field) => {
              const val = input[field.key] as number;
              const pct = ((val - field.min) / (field.max - field.min)) * 100;
              return (
                <div key={field.key}>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor={field.key}
                      className="text-xs font-medium text-slate-300"
                    >
                      {field.label}
                      {field.unit && (
                        <span className="text-slate-500 ml-1">({field.unit})</span>
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      {field.weight !== undefined && (
                        <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-full border border-blue-500/20">
                          weight {field.weight}%
                        </span>
                      )}
                      <span className="text-xs font-bold text-white tabular-nums w-16 text-right">
                        {field.step < 1 ? val.toFixed(2) : val}
                        {field.unit && <span className="text-slate-500 font-normal"> {field.unit}</span>}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-600 w-6">{field.min}</span>
                    <input
                      id={field.key}
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={val}
                      onChange={(e) => handleChange(field.key, parseFloat(e.target.value))}
                      className="flex-1 h-1.5 rounded-full appearance-none bg-slate-700 cursor-pointer accent-blue-500"
                      aria-valuemin={field.min}
                      aria-valuemax={field.max}
                      aria-valuenow={val}
                    />
                    <span className="text-[10px] text-slate-600 w-8 text-right">{field.max}</span>
                  </div>
                  <div
                    className="mt-0.5 h-0.5 bg-slate-700 rounded-full overflow-hidden"
                    aria-hidden="true"
                  >
                    <div
                      className="h-full bg-blue-500/50 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Analyze Risk
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                aria-label="Reset to defaults"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Results panel ───────────────────────────────── */}
        <div>
          {loading && (
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
              <LoadingState message="Running AI risk analysis..." />
            </div>
          )}

          {!loading && !result && (
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-8 flex flex-col items-center justify-center text-center gap-4 h-full min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Brain className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-300 mb-1">
                  Ready to Analyze
                </p>
                <p className="text-xs text-slate-500 max-w-xs">
                  Adjust the environmental parameters on the left and click{" "}
                  <span className="text-blue-400 font-semibold">Analyze Risk</span>{" "}
                  to get an AI-assisted risk prediction with factor breakdown.
                </p>
              </div>
              <p className="text-xs text-slate-600 italic">
                Or select a quick preset to load a sample scenario.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4">
              {/* Score card */}
              <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
                <h2 className="text-sm font-bold text-white mb-3">Prediction Result</h2>
                <RiskScoreCard
                  score={result.riskScore}
                  level={result.riskLevel}
                  confidence={result.confidence}
                  size="lg"
                  animate
                />
              </div>

              {/* Recommendation */}
              <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Recommended Action
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {result.recommendation}
                </p>
              </div>

              {/* Explainable AI */}
              <AIExplanation
                factors={result.factors}
                confidence={result.confidence}
                riskLevel={result.riskLevel}
              />

              <p className="text-[10px] text-slate-600 text-center">
                Analysis timestamp: {new Date(result.timestamp).toLocaleString("en-IN")}
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
