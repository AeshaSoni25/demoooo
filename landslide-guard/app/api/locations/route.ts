import { NextResponse } from "next/server";
import { DEMO_LOCATIONS } from "@/data/demo/locations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");
  const riskLevel = searchParams.get("riskLevel");

  let locations = DEMO_LOCATIONS;

  if (state) {
    locations = locations.filter(
      (l) => l.state.toLowerCase() === state.toLowerCase()
    );
  }

  if (riskLevel) {
    locations = locations.filter(
      (l) => l.riskLevel === riskLevel.toUpperCase()
    );
  }

  return NextResponse.json({
    success: true,
    count: locations.length,
    data: locations,
    meta: {
      source: "demo",
      note: "Simulated data for prototype demonstration",
      timestamp: new Date().toISOString(),
    },
  });
}
