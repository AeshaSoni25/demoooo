# LandslideGuard AI

### Predict. Prevent. Protect.

> **SIH Prototype — Smart India Hackathon**  
> Problem Statement: AI-Based Early Warning & Landslide Risk Monitoring

---

## ⚠️ Important Disclaimer

This is a **prototype** built for demonstration purposes. All sensor data, risk predictions, alerts, and emergency contact details are **simulated**. This system is **not certified for operational use** and does not integrate with real government data, live IoT sensors, or satellite imagery.

---

## Project Overview

LandslideGuard AI is an AI-powered disaster-management and early-warning platform designed to:

- Monitor landslide-prone regions across India
- Analyze environmental and geological conditions
- Predict landslide risk using an AI-assisted scoring engine
- Provide actionable early warnings to authorities and communities
- Coordinate emergency response with structured escalation workflows

---

## Problem Statement

India experiences approximately **800–1000 landslides annually**, causing hundreds of deaths and massive economic losses. The Himalayas, Western Ghats, and Northeast hill regions are particularly vulnerable. Existing warning systems are often reactive, fragmented, and inaccessible to ground-level responders.

**Key gaps addressed:**
- No unified multi-sensor monitoring dashboard
- Lack of explainable AI predictions for non-technical users
- No structured alert escalation workflow
- Limited community-facing safety information tools

---

## Solution

LandslideGuard AI provides a **unified web platform** that connects:

```
IoT Sensors → AI Risk Engine → Early Warning → Authority Notification → Emergency Response
```

The complete disaster management cycle: **MONITOR → DETECT → PREDICT → WARN → RESPOND**

---

## Key Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Interactive Risk Map** | Leaflet + OpenStreetMap showing 12 Indian landslide-prone zones with color-coded risk |
| 🧠 **AI Risk Prediction** | Transparent weighted scoring engine with 6 environmental factors |
| 🔍 **Explainable AI** | Full factor breakdown showing WHY an area is at risk, not just the score |
| 📡 **Live Sensor Monitoring** | Simulated IoT feeds for rain gauges, soil moisture, tilt sensors, ground movement |
| 🚨 **Early Warning Alerts** | Multi-tier alert system (LOW/MODERATE/HIGH/CRITICAL) with 8 active demo alerts |
| 📈 **Alert Escalation** | 9-step visual workflow from detection to emergency response |
| 📊 **Risk Analytics** | Recharts-powered time-series, regional distribution, sensor health dashboards |
| 🚁 **Emergency Response** | Directory of hospitals, shelters, NDRF centers, police, evacuation routes |
| 👥 **Community View** | Mobile-first citizen safety interface with clear action instructions |
| 🎮 **Demo Mode** | 4-step simulation showing rainfall increase → risk escalation → alert generation |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js 14 App Router                   │
├──────────────┬──────────────────────┬────────────────────┤
│  Server      │  Client Components   │   API Routes       │
│  Components  │  (Maps, Charts,      │  /api/locations    │
│  (Pages,     │   Forms, Sensors)    │  /api/sensors      │
│   Layouts)   │                      │  /api/predict      │
│              │                      │  /api/alerts       │
│              │                      │  /api/analytics    │
└──────────────┴──────────────────────┴────────────────────┘
        │                                      │
        ▼                                      ▼
┌──────────────┐                    ┌──────────────────────┐
│  Mock Data   │                    │  AI Prediction       │
│  Layer       │  ←── or ──→        │  Engine              │
│  (Demo)      │                    │  (Rule-based /       │
└──────────────┘                    │   ML Service stub)   │
                                    └──────────────────────┘
                                              │
                                              ▼
                                    ┌──────────────────────┐
                                    │  Python/FastAPI ML   │
                                    │  Service (future)    │
                                    └──────────────────────┘
```

---

## AI Approach

The current prediction engine is a **transparent rule-based weighted scoring system** — not a trained ML model. It was designed this way intentionally for the prototype so every decision is auditable.

### Prediction Weights

| Factor | Weight |
|--------|--------|
| Rainfall (24h + 7d) | 30% |
| Soil Moisture + Saturation | 20% |
| Ground Displacement | 20% |
| Slope Angle | 15% |
| Historical Landslide Frequency | 10% |
| Vegetation Cover (NDVI) | 5% |

### Risk Thresholds

| Score | Level |
|-------|-------|
| 0–39 | LOW |
| 40–59 | MODERATE |
| 60–79 | HIGH |
| 80–100 | CRITICAL |

---

## Explainable AI

Every prediction includes a full breakdown of contributing factors with percentage contributions. This is a key differentiator — authorities can see **why** an area is flagged, not just a number.

Example output:
```json
{
  "riskScore": 78,
  "riskLevel": "HIGH",
  "confidence": 91,
  "factors": [
    { "factor": "Rainfall Intensity", "contribution": 35, "value": "182 mm/24h" },
    { "factor": "Soil Saturation",    "contribution": 25, "value": "87%" },
    { "factor": "Ground Movement",    "contribution": 20, "value": "6.4 mm/day" },
    { "factor": "Slope Angle",        "contribution": 12, "value": "38°" },
    { "factor": "Historical",         "contribution": 8,  "value": "14 events" }
  ]
}
```

---

## Data Flow

```
Sensor Reading → Threshold Check → AI Scoring Engine
      ↓                                    ↓
 Anomaly Flag                        Risk Score + Level
      ↓                                    ↓
  Alert Generated ←──────────────────────←┘
      ↓
  Authority Notified
      ↓
  Field Verification
      ↓
  Evacuation / Emergency Response
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | Radix UI primitives |
| Icons | Lucide React |
| Charts | Recharts |
| Maps | Leaflet + OpenStreetMap |
| State | React Context (DemoMode) |
| Database (ready) | PostgreSQL via DATABASE_URL |
| ML Service (ready) | Python FastAPI via ML_SERVICE_URL |

---

## Project Structure

```
landslide-guard/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout with DemoModeProvider
│   ├── globals.css              # Global styles + Leaflet CSS
│   ├── dashboard/page.tsx       # Operations dashboard
│   ├── risk-map/page.tsx        # Interactive Leaflet map
│   ├── predictions/page.tsx     # AI prediction form + results
│   ├── monitoring/page.tsx      # Live sensor monitoring
│   ├── alerts/page.tsx          # Alert management + escalation
│   ├── analytics/page.tsx       # Recharts analytics dashboard
│   ├── emergency/page.tsx       # Emergency response directory
│   ├── community/page.tsx       # Citizen-facing safety view
│   ├── settings/page.tsx        # System settings
│   ├── locations/[id]/page.tsx  # Dynamic location detail
│   └── api/
│       ├── locations/route.ts
│       ├── sensors/route.ts
│       ├── alerts/route.ts
│       ├── predict/route.ts
│       ├── analytics/route.ts
│       └── emergency-resources/route.ts
├── components/
│   ├── dashboard/               # AppShell, Sidebar, TopNavbar
│   ├── maps/                    # RiskMapClient (Leaflet)
│   ├── risk/                    # RiskScoreCard, AIExplanation
│   ├── sensors/                 # SensorCard
│   ├── alerts/                  # AlertCard
│   ├── emergency/               # EmergencyResourceCard
│   └── ui/                      # RiskBadge, MetricCard, DemoBadge, etc.
├── lib/
│   ├── ai/prediction-engine.ts  # Weighted scoring engine + ML stub
│   └── utils/index.ts           # Helper functions
├── data/demo/                   # All mock data files
├── types/index.ts               # TypeScript type definitions
└── hooks/use-demo-mode.tsx      # Demo simulation context
```

---

## Installation

```bash
# Clone or extract the project
cd landslide-guard

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The app runs on **http://localhost:3000** (or 3001 if 3000 is in use).

---

## Environment Variables

Create a `.env.local` file (optional — the app works fully without it using demo data):

```env
# PostgreSQL database (optional — falls back to demo data if not set)
DATABASE_URL=postgresql://user:password@localhost:5432/landslide_guard

# Python ML service URL (optional — falls back to rule-based engine if not set)
ML_SERVICE_URL=http://localhost:8000

# Next.js
NEXTAUTH_SECRET=your-secret-here
```

---

## Running the Application

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Type check
npx tsc --noEmit
```

---

## Demo Mode

The **Demo Mode toggle** (bottom of sidebar) enables a 4-step simulation:

| Step | Rainfall | Risk Score | Level |
|------|----------|-----------|-------|
| 0 — Baseline | 80 mm | 42 | MODERATE |
| 1 — Increasing | 120 mm | 58 | MODERATE |
| 2 — Heavy | 160 mm | 72 | HIGH |
| 3 — Critical | 210 mm | 87 | CRITICAL + Alert |

Controls: **Auto Run** (3s per step), **Next Step** (manual), **Reset**

---

## SIH Demo Flow (3–5 minutes)

1. **Landing Page** — Show problem context, statistics, XAI preview
2. **Dashboard** — Overall risk status (72/100 HIGH), active alerts, regional table
3. **Risk Map** — Click Shimla Foothills (CRITICAL, 91/100), show drawer with conditions
4. **AI Predictions** — Load "Critical Risk" preset → Analyze → Show score + Explainable AI
5. **Demo Mode** — Start simulation on Dashboard: 80mm → 210mm rainfall, watch risk climb
6. **Alerts Page** — Show escalation workflow, acknowledge/escalate an alert
7. **Emergency Response** — Show NDRF centers, evacuation routes, safe zones
8. **Community View** — Switch to Shimla, show citizen safety instructions
9. **Analytics** — Rainfall vs risk chart, regional distribution

---

## Future ML Integration

The prediction service is structured for drop-in ML replacement:

```typescript
// lib/ai/prediction-engine.ts
export async function predictLandslideRiskML(input: PredictionInput) {
  if (process.env.ML_SERVICE_URL) {
    // Calls Python FastAPI endpoint
    const res = await fetch(`${process.env.ML_SERVICE_URL}/predict`, {
      method: 'POST', body: JSON.stringify(input)
    });
    return await res.json(); // Returns same PredictionResult shape
  }
  return predictLandslideRisk(input); // Fallback to rule-based
}
```

Python service would implement:
- **Random Forest / XGBoost** trained on historical landslide data (e.g., BHUVAN, GSI datasets)
- **SHAP values** for explainability (replacing current weighted contribution)
- **Time-series LSTM** for 72-hour ahead prediction

---

## Future IoT Integration

API routes are ready to receive real sensor data:

```
POST /api/sensors/reading   — ingest sensor reading
GET  /api/sensors?locationId=loc-001  — get sensors for location
```

Integration pathway: **LoRaWAN / NB-IoT sensors → MQTT broker → Next.js API → PostgreSQL → Dashboard**

---

## Limitations

- All data is simulated — no real sensor feeds
- Prediction engine is rule-based, not a trained model
- No real-time satellite or weather API integration
- Emergency contacts are placeholder demo values
- PostgreSQL schema is designed but not implemented in this prototype

---

## Future Scope

- [ ] Train ML model on GSI/BHUVAN historical landslide datasets
- [ ] Real IoT sensor integration via MQTT/LoRaWAN
- [ ] SMS/WhatsApp alert dispatch via Twilio/MSG91
- [ ] Satellite imagery analysis (Sentinel-2 via Google Earth Engine)
- [ ] Mobile app (React Native) for field officers
- [ ] Multi-language support (Hindi, regional languages)
- [ ] Integration with IMD weather API
- [ ] NDRF/SDRF dispatch coordination module
- [ ] Offline-first PWA for low-connectivity field use

---

*Built with ❤️ for Smart India Hackathon | LandslideGuard AI Team*
