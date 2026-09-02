import { NextResponse } from "next/server";
import { DEMO_SENSORS } from "@/data/demo/sensors";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get("locationId");
  const status = searchParams.get("status");

  let sensors = DEMO_SENSORS;

  if (locationId) {
    sensors = sensors.filter((s) => s.locationId === locationId);
  }

  if (status) {
    sensors = sensors.filter(
      (s) => s.status === status.toUpperCase()
    );
  }

  return NextResponse.json({
    success: true,
    count: sensors.length,
    data: sensors,
    meta: {
      source: "demo",
      note: "Simulated sensor data",
      timestamp: new Date().toISOString(),
    },
  });
}
