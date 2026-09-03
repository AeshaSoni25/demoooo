import { Location, Alert, Sensor, EmergencyResource, RiskLevel } from "./types";
import crypto from "crypto";

function seedRandom(seedStr: string) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  let s = hash;
  return function() {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
}

export function generateDynamicData(region: string) {
  const random = seedRandom(region.toLowerCase());
  
  const numLocations = Math.floor(random() * 5) + 3; // 3 to 7 locations
  const locations: Location[] = [];
  const sensors: Sensor[] = [];
  const alerts: Alert[] = [];
  const resources: EmergencyResource[] = [];

  const baseLat = (random() * 100) - 50;
  const baseLng = (random() * 200) - 100;

  for (let i = 0; i < numLocations; i++) {
    const riskScore = Math.floor(random() * 100);
    const riskLevel: RiskLevel = riskScore > 80 ? "CRITICAL" : riskScore > 60 ? "HIGH" : riskScore > 30 ? "MODERATE" : "LOW";
    
    const loc: Location = {
      id: `loc-${region}-${i}`,
      name: `${region} Sector ${i+1}`,
      state: region,
      district: `${region} District`,
      lat: baseLat + (random() * 0.1 - 0.05),
      lng: baseLng + (random() * 0.1 - 0.05),
      elevation: Math.floor(random() * 3000),
      slopeAngle: Math.floor(random() * 60),
      terrain: "Mountainous",
      population: Math.floor(random() * 50000),
      riskLevel,
      riskScore,
      aiConfidence: Math.floor(random() * 30) + 70,
      rainfall24h: Math.floor(random() * 200),
      rainfall7d: Math.floor(random() * 500),
      soilMoisture: Math.floor(random() * 100),
      soilSaturation: Math.floor(random() * 100),
      groundMovement: random() * 5,
      vegetationIndex: random(),
      lastUpdated: new Date().toISOString(),
      historicalLandslides: Math.floor(random() * 5),
      recommendedAction: riskScore > 60 ? "Evacuate immediately" : "Monitor situation",
      description: `Dynamic monitoring station in ${region}.`
    };
    locations.push(loc);

    // Generate Sensors for location
    const numSensors = Math.floor(random() * 3) + 2;
    for(let j=0; j<numSensors; j++) {
      sensors.push({
        id: `sen-${loc.id}-${j}`,
        locationId: loc.id,
        locationName: loc.name,
        type: j % 2 === 0 ? "RAIN_GAUGE" : "SOIL_MOISTURE",
        label: `Sensor ${j}`,
        unit: j % 2 === 0 ? "mm" : "%",
        currentValue: Math.floor(random() * 100),
        minNormal: 0,
        maxNormal: 80,
        status: riskLevel === "CRITICAL" ? "ALERT" : "NORMAL",
        batteryLevel: Math.floor(random() * 50) + 50,
        lastUpdated: new Date().toISOString(),
        lat: loc.lat + 0.01,
        lng: loc.lng + 0.01
      });
    }

    // Generate Alert if risk is high
    if (riskLevel === "CRITICAL" || riskLevel === "HIGH") {
      alerts.push({
        id: `alt-${loc.id}`,
        locationId: loc.id,
        locationName: loc.name,
        state: loc.state,
        zone: `${region} Zone`,
        riskLevel: loc.riskLevel,
        riskScore: loc.riskScore,
        trigger: "High Rainfall",
        description: `High risk detected in ${loc.name}`,
        recommendedAction: loc.recommendedAction,
        status: "ACTIVE",
        issuedAt: new Date().toISOString(),
        affectedPopulation: loc.population
      });
    }

    // Generate Resources
    resources.push({
      id: `res-${loc.id}`,
      name: `${loc.name} Relief Camp`,
      type: "SHELTER",
      locationName: loc.name,
      state: loc.state,
      address: `123 ${region} St`,
      contactDemo: "555-0100",
      capacity: 500,
      lat: loc.lat - 0.01,
      lng: loc.lng - 0.01,
      isOperational: true
    });
  }

  return { locations, sensors, alerts, resources };
}
