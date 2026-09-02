import { NextResponse } from "next/server";
import { predictLandslideRiskML } from "@/lib/ai/prediction-engine";
import type { PredictionInput } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const required: (keyof PredictionInput)[] = [
      "rainfall24h",
      "rainfall7d",
      "soilMoisture",
      "soilSaturation",
      "slopeAngle",
      "groundDisplacement",
      "elevation",
      "temperature",
      "vegetationIndex",
      "historicalLandslides",
    ];

    for (const field of required) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
      if (typeof body[field] !== "number" || isNaN(body[field])) {
        return NextResponse.json(
          {
            success: false,
            error: `Field ${field} must be a valid number`,
          },
          { status: 400 }
        );
      }
    }

    const input: PredictionInput = {
      rainfall24h: Math.max(0, body.rainfall24h),
      rainfall7d: Math.max(0, body.rainfall7d),
      soilMoisture: Math.min(100, Math.max(0, body.soilMoisture)),
      soilSaturation: Math.min(100, Math.max(0, body.soilSaturation)),
      slopeAngle: Math.min(90, Math.max(0, body.slopeAngle)),
      groundDisplacement: Math.max(0, body.groundDisplacement),
      elevation: Math.max(0, body.elevation),
      temperature: body.temperature,
      vegetationIndex: Math.min(1, Math.max(0, body.vegetationIndex)),
      historicalLandslides: Math.max(0, Math.round(body.historicalLandslides)),
    };

    // Calls ML service if ML_SERVICE_URL env is set, otherwise uses rule-based engine
    const result = await predictLandslideRiskML(input);

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        engine: process.env.ML_SERVICE_URL ? "ml_service" : "rule_based",
        note: "Rule-based weighted scoring engine (prototype). Not a trained ML model.",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
