// ============================================================
// CORE TYPES — LandslideGuard AI
// ============================================================

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export type AlertStatus = "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED" | "ESCALATED";

export type SensorType =
  | "RAIN_GAUGE"
  | "SOIL_MOISTURE"
  | "TILT_SENSOR"
  | "GROUND_MOVEMENT"
  | "TEMPERATURE"
  | "HUMIDITY";

export type SensorStatus = "NORMAL" | "WARNING" | "ALERT" | "OFFLINE";

// ── Location ─────────────────────────────────────────────────
export interface Location {
  id: string;
  name: string;
  state: string;
  district: string;
  lat: number;
  lng: number;
  elevation: number; // metres
  slopeAngle: number; // degrees
  terrain: string;
  population: number;
  riskLevel: RiskLevel;
  riskScore: number; // 0–100
  aiConfidence: number; // 0–100
  rainfall24h: number; // mm
  rainfall7d: number; // mm
  soilMoisture: number; // %
  soilSaturation: number; // %
  groundMovement: number; // mm/day
  vegetationIndex: number; // 0–1
  lastUpdated: string; // ISO date
  historicalLandslides: number;
  recommendedAction: string;
  description: string;
}

// ── Sensor ───────────────────────────────────────────────────
export interface Sensor {
  id: string;
  locationId: string;
  locationName: string;
  type: SensorType;
  label: string;
  unit: string;
  currentValue: number;
  minNormal: number;
  maxNormal: number;
  status: SensorStatus;
  batteryLevel: number; // %
  lastUpdated: string;
  lat: number;
  lng: number;
}

export interface SensorReading {
  id: string;
  sensorId: string;
  value: number;
  timestamp: string;
  status: SensorStatus;
}

// ── AI Prediction ────────────────────────────────────────────
export interface PredictionInput {
  rainfall24h: number;
  rainfall7d: number;
  soilMoisture: number;
  soilSaturation: number;
  slopeAngle: number;
  groundDisplacement: number;
  elevation: number;
  temperature: number;
  vegetationIndex: number;
  historicalLandslides: number;
}

export interface FactorContribution {
  factor: string;
  contribution: number; // %
  value: string;
  description: string;
}

export interface PredictionResult {
  riskScore: number;
  riskLevel: RiskLevel;
  confidence: number;
  factors: FactorContribution[];
  recommendation: string;
  timestamp: string;
}

export interface RiskPrediction {
  id: string;
  locationId: string;
  locationName: string;
  input: PredictionInput;
  result: PredictionResult;
  createdAt: string;
}

// ── Alert ────────────────────────────────────────────────────
export interface Alert {
  id: string;
  locationId: string;
  locationName: string;
  state: string;
  zone: string;
  riskLevel: RiskLevel;
  riskScore: number;
  trigger: string;
  description: string;
  recommendedAction: string;
  status: AlertStatus;
  issuedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  escalatedTo?: string;
  affectedPopulation: number;
}

// ── Historical Event ─────────────────────────────────────────
export interface HistoricalEvent {
  id: string;
  locationId: string;
  locationName: string;
  state: string;
  date: string;
  description: string;
  casualties: number;
  displaced: number;
  area: number; // sq km
  magnitude: "MINOR" | "MODERATE" | "MAJOR" | "CATASTROPHIC";
  trigger: string;
  rainfall24h: number;
}

// ── Emergency Resource ────────────────────────────────────────
export interface EmergencyResource {
  id: string;
  name: string;
  type:
    | "HOSPITAL"
    | "SHELTER"
    | "RESCUE_CENTER"
    | "POLICE"
    | "FIRE_EMERGENCY"
    | "DISTRICT_AUTHORITY";
  locationName: string;
  state: string;
  address: string;
  contactDemo: string; // Demo placeholder
  capacity?: number;
  lat: number;
  lng: number;
  isOperational: boolean;
}

// ── Analytics ────────────────────────────────────────────────
export interface TimeSeriesPoint {
  timestamp: string;
  label: string;
  value: number;
  secondary?: number;
}

export interface RegionalRiskData {
  region: string;
  critical: number;
  high: number;
  moderate: number;
  low: number;
}

// ── Dashboard Summary ─────────────────────────────────────────
export interface DashboardSummary {
  totalLocations: number;
  activeSensors: number;
  highRiskZones: number;
  totalAlerts: number;
  predictionAccuracy: number;
  overallRiskScore: number;
  overallRiskLevel: RiskLevel;
  aiConfidence: number;
  lastUpdated: string;
}

// ── Demo Mode ────────────────────────────────────────────────
export interface DemoStep {
  step: number;
  label: string;
  rainfall: number;
  riskScore: number;
  riskLevel: RiskLevel;
  soilMoisture: number;
  groundMovement: number;
  alertGenerated: boolean;
}
