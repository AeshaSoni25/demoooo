import type { TimeSeriesPoint, RegionalRiskData } from "@/types";

// Generate rainfall vs risk score for last 30 days
export function generateRainfallRiskData(days: number = 30): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = [];
  const now = Date.now();
  let rainfall = 40;
  let risk = 32;

  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    const label = date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });

    // Simulate monsoon pattern with increasing then decreasing rain
    const dayProgress = (days - i) / days;
    const rainfallBase = 40 + Math.sin(dayProgress * Math.PI) * 160;
    rainfall = Math.max(
      10,
      rainfallBase + (Math.random() - 0.5) * 40
    );
    risk = Math.min(
      100,
      Math.max(20, 20 + (rainfall / 300) * 75 + (Math.random() - 0.5) * 10)
    );

    data.push({
      timestamp: date.toISOString(),
      label,
      value: parseFloat(rainfall.toFixed(1)),
      secondary: parseFloat(risk.toFixed(1)),
    });
  }
  return data;
}

// Generate risk score trend
export function generateRiskTrend(days: number = 30): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = [];
  const now = Date.now();
  let score = 38;

  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    const label = date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });

    const dayProgress = (days - i) / days;
    const peak = Math.sin(dayProgress * Math.PI);
    score = Math.min(
      100,
      Math.max(20, 30 + peak * 55 + (Math.random() - 0.5) * 12)
    );

    data.push({
      timestamp: date.toISOString(),
      label,
      value: parseFloat(score.toFixed(1)),
    });
  }
  return data;
}

// Alerts issued over time
export function generateAlertsOverTime(days: number = 30): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = [];
  const now = Date.now();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    const label = date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
    const dayProgress = (days - i) / days;
    const alertCount = Math.floor(
      Math.max(0, Math.sin(dayProgress * Math.PI) * 6 + Math.random() * 3)
    );

    data.push({
      timestamp: date.toISOString(),
      label,
      value: alertCount,
    });
  }
  return data;
}

// Regional risk distribution
export const REGIONAL_RISK_DATA: RegionalRiskData[] = [
  {
    region: "Himachal Pradesh",
    critical: 2,
    high: 5,
    moderate: 8,
    low: 12,
  },
  {
    region: "Uttarakhand",
    critical: 3,
    high: 7,
    moderate: 10,
    low: 15,
  },
  {
    region: "West Bengal",
    critical: 1,
    high: 4,
    moderate: 9,
    low: 18,
  },
  {
    region: "Kerala",
    critical: 1,
    high: 3,
    moderate: 7,
    low: 22,
  },
  {
    region: "Sikkim",
    critical: 0,
    high: 2,
    moderate: 5,
    low: 8,
  },
  {
    region: "Arunachal Pradesh",
    critical: 1,
    high: 2,
    moderate: 6,
    low: 14,
  },
  {
    region: "J&K",
    critical: 0,
    high: 3,
    moderate: 7,
    low: 16,
  },
];

// Sensor health data
export const SENSOR_HEALTH_DATA = [
  { name: "Normal", value: 248, color: "#22c55e" },
  { name: "Warning", value: 64, color: "#eab308" },
  { name: "Alert", value: 22, color: "#ef4444" },
  { name: "Offline", value: 8, color: "#64748b" },
];

// Dashboard stats
export const DASHBOARD_STATS = {
  totalLocations: 128,
  activeSensors: 342,
  highRiskZones: 17,
  totalAlerts: 24,
  predictionAccuracy: 91.6,
  overallRiskScore: 72,
  overallRiskLevel: "HIGH" as const,
  aiConfidence: 91.4,
  lastUpdated: new Date().toISOString(),
};
