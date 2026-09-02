/**
 * LandslideGuard AI — Transparent Weighted Scoring Prediction Engine
 *
 * NOTE: This is a rule-based weighted scoring engine used for the prototype.
 * It is NOT a trained machine learning model. Weights and thresholds are based
 * on publicly available landslide research literature and are configurable.
 *
 * Architecture is designed so this service can be replaced by a real
 * Python/FastAPI ML endpoint without changes to the frontend.
 */

import type {
  PredictionInput,
  PredictionResult,
  RiskLevel,
  FactorContribution,
} from "@/types";

// ── Configurable Weights (must sum to 100) ─────────────────
export const PREDICTION_WEIGHTS = {
  rainfall: 30,       // 24h & 7d rainfall combined
  soilMoisture: 20,   // soil moisture + saturation combined
  groundMovement: 20, // ground displacement rate
  slope: 15,          // slope angle
  historical: 10,     // historical landslide frequency
  vegetation: 5,      // vegetation index (inverse — less veg = more risk)
} as const;

// ── Thresholds ──────────────────────────────────────────────
const THRESHOLDS = {
  rainfall24h: { low: 50, moderate: 100, high: 150, critical: 200 },
  rainfall7d: { low: 150, moderate: 300, high: 450, critical: 600 },
  soilMoisture: { low: 40, moderate: 60, high: 75, critical: 85 },
  soilSaturation: { low: 40, moderate: 60, high: 80, critical: 90 },
  groundDisplacement: { low: 1, moderate: 3, high: 5, critical: 8 },
  slopeAngle: { low: 20, moderate: 30, high: 40, critical: 50 },
  historicalLandslides: { low: 2, moderate: 5, high: 10, critical: 20 },
  vegetationIndex: { good: 0.7, moderate: 0.5, poor: 0.3, bare: 0.1 },
};

// ── Scoring helpers ─────────────────────────────────────────
function scoreValue(
  value: number,
  low: number,
  moderate: number,
  high: number,
  critical: number
): number {
  if (value <= low) return (value / low) * 25;
  if (value <= moderate) return 25 + ((value - low) / (moderate - low)) * 25;
  if (value <= high) return 50 + ((value - moderate) / (high - moderate)) * 25;
  if (value <= critical) return 75 + ((value - high) / (critical - high)) * 20;
  return Math.min(100, 95 + ((value - critical) / critical) * 5);
}

function scoreVegetation(vi: number): number {
  // Inverse: less vegetation = higher risk score
  if (vi >= THRESHOLDS.vegetationIndex.good) return 5;
  if (vi >= THRESHOLDS.vegetationIndex.moderate) return 25;
  if (vi >= THRESHOLDS.vegetationIndex.poor) return 60;
  if (vi >= THRESHOLDS.vegetationIndex.bare) return 85;
  return 100;
}

// ── Risk level from score ───────────────────────────────────
export function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 40) return "MODERATE";
  return "LOW";
}

// ── Confidence calculation ──────────────────────────────────
function calculateConfidence(input: PredictionInput, scores: Record<string, number>): number {
  // Higher confidence when multiple factors align
  const alignedFactors = Object.values(scores).filter((s) => s > 60).length;
  const baseConfidence = 65;
  const alignmentBonus = alignedFactors * 5;
  const dataQualityBonus = input.historicalLandslides > 5 ? 8 : 3;
  return Math.min(98, Math.round(baseConfidence + alignmentBonus + dataQualityBonus));
}

// ── Recommendation ─────────────────────────────────────────
function getRecommendation(riskLevel: RiskLevel, score: number): string {
  if (riskLevel === "CRITICAL") {
    return `CRITICAL RISK (${score}/100): Immediate evacuation advisory recommended. Deploy NDRF/SDRF teams. Close vulnerable roads. Notify district administration and state SDMA immediately.`;
  }
  if (riskLevel === "HIGH") {
    return `HIGH RISK (${score}/100): Activate local warning protocol. Increase monitoring frequency. Notify district administration. Alert communities near vulnerable slopes. Pre-position rescue equipment.`;
  }
  if (riskLevel === "MODERATE") {
    return `MODERATE RISK (${score}/100): Issue precautionary advisory. Monitor conditions closely. Inform local authorities. Restrict access to highly vulnerable slopes.`;
  }
  return `LOW RISK (${score}/100): Continue standard monitoring. Conditions are within normal parameters. Routine precautions apply.`;
}

// ── Main prediction function ───────────────────────────────
export function predictLandslideRisk(input: PredictionInput): PredictionResult {
  // 1. Score each factor (0–100)
  const rainfallScore = Math.max(
    scoreValue(
      input.rainfall24h,
      THRESHOLDS.rainfall24h.low,
      THRESHOLDS.rainfall24h.moderate,
      THRESHOLDS.rainfall24h.high,
      THRESHOLDS.rainfall24h.critical
    ),
    scoreValue(
      input.rainfall7d,
      THRESHOLDS.rainfall7d.low,
      THRESHOLDS.rainfall7d.moderate,
      THRESHOLDS.rainfall7d.high,
      THRESHOLDS.rainfall7d.critical
    ) * 0.7
  );

  const soilScore = Math.max(
    scoreValue(
      input.soilMoisture,
      THRESHOLDS.soilMoisture.low,
      THRESHOLDS.soilMoisture.moderate,
      THRESHOLDS.soilMoisture.high,
      THRESHOLDS.soilMoisture.critical
    ),
    scoreValue(
      input.soilSaturation,
      THRESHOLDS.soilSaturation.low,
      THRESHOLDS.soilSaturation.moderate,
      THRESHOLDS.soilSaturation.high,
      THRESHOLDS.soilSaturation.critical
    )
  );

  const groundScore = scoreValue(
    input.groundDisplacement,
    THRESHOLDS.groundDisplacement.low,
    THRESHOLDS.groundDisplacement.moderate,
    THRESHOLDS.groundDisplacement.high,
    THRESHOLDS.groundDisplacement.critical
  );

  const slopeScore = scoreValue(
    input.slopeAngle,
    THRESHOLDS.slopeAngle.low,
    THRESHOLDS.slopeAngle.moderate,
    THRESHOLDS.slopeAngle.high,
    THRESHOLDS.slopeAngle.critical
  );

  const historicalScore = scoreValue(
    input.historicalLandslides,
    THRESHOLDS.historicalLandslides.low,
    THRESHOLDS.historicalLandslides.moderate,
    THRESHOLDS.historicalLandslides.high,
    THRESHOLDS.historicalLandslides.critical
  );

  const vegetationScore = scoreVegetation(input.vegetationIndex);

  const scores = {
    rainfall: rainfallScore,
    soil: soilScore,
    ground: groundScore,
    slope: slopeScore,
    historical: historicalScore,
    vegetation: vegetationScore,
  };

  // 2. Weighted aggregate
  const riskScore = Math.round(
    (rainfallScore * PREDICTION_WEIGHTS.rainfall +
      soilScore * PREDICTION_WEIGHTS.soilMoisture +
      groundScore * PREDICTION_WEIGHTS.groundMovement +
      slopeScore * PREDICTION_WEIGHTS.slope +
      historicalScore * PREDICTION_WEIGHTS.historical +
      vegetationScore * PREDICTION_WEIGHTS.vegetation) /
      100
  );

  const riskLevel = getRiskLevel(riskScore);
  const confidence = calculateConfidence(input, scores);

  // 3. Factor contributions (percentages from weighted contribution)
  const totalWeightedScore =
    rainfallScore * PREDICTION_WEIGHTS.rainfall +
    soilScore * PREDICTION_WEIGHTS.soilMoisture +
    groundScore * PREDICTION_WEIGHTS.groundMovement +
    slopeScore * PREDICTION_WEIGHTS.slope +
    historicalScore * PREDICTION_WEIGHTS.historical +
    vegetationScore * PREDICTION_WEIGHTS.vegetation;

  const factors: FactorContribution[] = [
    {
      factor: "Rainfall Intensity",
      contribution: Math.round(
        (rainfallScore * PREDICTION_WEIGHTS.rainfall) / totalWeightedScore * 100
      ),
      value: `${input.rainfall24h} mm/24h, ${input.rainfall7d} mm/7d`,
      description: "24-hour and 7-day cumulative rainfall pressure on slopes",
    },
    {
      factor: "Soil Saturation",
      contribution: Math.round(
        (soilScore * PREDICTION_WEIGHTS.soilMoisture) / totalWeightedScore * 100
      ),
      value: `Moisture: ${input.soilMoisture}%, Saturation: ${input.soilSaturation}%`,
      description: "Soil moisture and saturation level reducing slope stability",
    },
    {
      factor: "Ground Movement",
      contribution: Math.round(
        (groundScore * PREDICTION_WEIGHTS.groundMovement) / totalWeightedScore * 100
      ),
      value: `${input.groundDisplacement} mm/day`,
      description: "Rate of ground displacement indicating slope instability",
    },
    {
      factor: "Slope Angle",
      contribution: Math.round(
        (slopeScore * PREDICTION_WEIGHTS.slope) / totalWeightedScore * 100
      ),
      value: `${input.slopeAngle}°`,
      description: "Terrain steepness — steeper slopes have lower stability thresholds",
    },
    {
      factor: "Historical Susceptibility",
      contribution: Math.round(
        (historicalScore * PREDICTION_WEIGHTS.historical) / totalWeightedScore * 100
      ),
      value: `${input.historicalLandslides} recorded events`,
      description: "Number of recorded landslide events in this area",
    },
    {
      factor: "Vegetation Cover",
      contribution: Math.round(
        (vegetationScore * PREDICTION_WEIGHTS.vegetation) / totalWeightedScore * 100
      ),
      value: `NDVI: ${input.vegetationIndex.toFixed(2)}`,
      description: "Vegetation density affects root stabilization of slopes",
    },
  ]
    .sort((a, b) => b.contribution - a.contribution)
    // Normalize to 100%
    .map((f, _, arr) => {
      const total = arr.reduce((sum, x) => sum + x.contribution, 0);
      return { ...f, contribution: Math.round((f.contribution / total) * 100) };
    });

  return {
    riskScore: Math.min(100, Math.max(0, riskScore)),
    riskLevel,
    confidence,
    factors,
    recommendation: getRecommendation(riskLevel, riskScore),
    timestamp: new Date().toISOString(),
  };
}

// ── ML Integration Stub ─────────────────────────────────────
/**
 * Future integration point: replace this function body with a call to
 * the Python/FastAPI ML service endpoint.
 *
 * Example:
 *   const response = await fetch(process.env.ML_SERVICE_URL + '/predict', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(input),
 *   });
 *   return await response.json();
 */
export async function predictLandslideRiskML(
  input: PredictionInput
): Promise<PredictionResult> {
  const mlServiceUrl = process.env.ML_SERVICE_URL;

  if (mlServiceUrl) {
    try {
      const response = await fetch(`${mlServiceUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      console.warn(
        "ML service unavailable, falling back to rule-based engine."
      );
    }
  }

  // Fallback to rule-based engine
  return predictLandslideRisk(input);
}
