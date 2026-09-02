import { NextResponse } from "next/server";
import { DEMO_ALERTS } from "@/data/demo/alerts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const riskLevel = searchParams.get("riskLevel");

  let alerts = DEMO_ALERTS;

  if (status) {
    alerts = alerts.filter((a) => a.status === status.toUpperCase());
  }

  if (riskLevel) {
    alerts = alerts.filter((a) => a.riskLevel === riskLevel.toUpperCase());
  }

  return NextResponse.json({
    success: true,
    count: alerts.length,
    data: alerts,
    meta: {
      source: "demo",
      timestamp: new Date().toISOString(),
    },
  });
}
