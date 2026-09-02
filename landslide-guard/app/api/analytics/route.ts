import { NextResponse } from "next/server";
import {
  generateRainfallRiskData,
  generateRiskTrend,
  generateAlertsOverTime,
  REGIONAL_RISK_DATA,
  SENSOR_HEALTH_DATA,
  DASHBOARD_STATS,
} from "@/data/demo/analytics";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") ?? "30");

  return NextResponse.json({
    success: true,
    data: {
      rainfallRisk: generateRainfallRiskData(days),
      riskTrend: generateRiskTrend(days),
      alertsOverTime: generateAlertsOverTime(days),
      regionalDistribution: REGIONAL_RISK_DATA,
      sensorHealth: SENSOR_HEALTH_DATA,
      summary: DASHBOARD_STATS,
    },
    meta: {
      source: "demo",
      days,
      timestamp: new Date().toISOString(),
    },
  });
}
