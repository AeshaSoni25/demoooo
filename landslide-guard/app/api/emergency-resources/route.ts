import { NextResponse } from "next/server";
import { DEMO_EMERGENCY_RESOURCES } from "@/data/demo/emergency";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const state = searchParams.get("state");

  let resources = DEMO_EMERGENCY_RESOURCES;

  if (type) {
    resources = resources.filter((r) => r.type === type.toUpperCase());
  }
  if (state) {
    resources = resources.filter(
      (r) => r.state.toLowerCase() === state.toLowerCase()
    );
  }

  return NextResponse.json({
    success: true,
    count: resources.length,
    data: resources,
    meta: {
      source: "demo",
      note: "Contact details are placeholders — demo only",
      timestamp: new Date().toISOString(),
    },
  });
}
