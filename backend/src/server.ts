import express from "express";
import cors from "cors";
import "tsconfig-paths/register";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// GET /health
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// GET /api/locations
app.get("/api/locations", async (req, res) => {
  try {
    const region = req.query.region as string;
    
    if (region && region !== "All Regions") {
      let dbLocations = await prisma.location.findMany({
        where: {
          OR: [
            { state: { equals: region, mode: "insensitive" } },
            { region: { equals: region, mode: "insensitive" } },
            { name: { contains: region, mode: "insensitive" } }
          ]
        },
      });

      const locations = dbLocations.map(loc => ({
        ...loc,
        rainfall7d: loc.rainfall24h * 3, // Approximation
        soilSaturation: Math.min(100, loc.soilMoisture + 10), // Approximation
        groundMovement: 0.5, // Default safe value
        vegetationIndex: 0.65, // Default safe value
        recommendedAction: "Continue monitoring weather conditions.",
        description: `Monitoring station in ${loc.district}, ${loc.state}.`
      }));

      return res.json({ success: true, count: locations.length, data: locations });
    }

    const dbLocations = await prisma.location.findMany();
    const locations = dbLocations.map(loc => ({
      ...loc,
      rainfall7d: loc.rainfall24h * 3,
      soilSaturation: Math.min(100, loc.soilMoisture + 10),
      groundMovement: 0.5,
      vegetationIndex: 0.65,
      recommendedAction: "Continue monitoring weather conditions.",
      description: `Monitoring station in ${loc.district}, ${loc.state}.`
    }));
    res.json({ success: true, count: locations.length, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.post("/api/locations", async (req, res) => {
  try {
    const data = req.body;
    const newLocation = await prisma.location.create({ data });
    res.json({ success: true, data: newLocation });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// GET /api/locations/:id/live-data
app.get("/api/locations/:id/live-data", async (req, res) => {
  try {
    const location = await prisma.location.findUnique({ where: { id: req.params.id } });
    if (!location) return res.status(404).json({ error: "Location not found" });

    // Open-Meteo Weather API
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);
    
    if (!response.ok) throw new Error("Failed to fetch weather data");
    
    const data = await response.json();
    
    const liveData = await prisma.liveData.create({
      data: {
        locationId: location.id,
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        source: "Open-Meteo"
      }
    });

    res.json({ success: true, data: liveData });
  } catch (error) {
    console.error("Live data error:", error);
    res.status(503).json({ success: false, error: "Live data unavailable" });
  }
});

// GET /api/locations/:id/earthquakes
app.get("/api/locations/:id/earthquakes", async (req, res) => {
  try {
    const location = await prisma.location.findUnique({ where: { id: req.params.id } });
    if (!location) return res.status(404).json({ error: "Location not found" });

    // USGS Earthquake API (last 30 days, within ~200km maxradiuskm=2)
    const response = await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${location.lat}&longitude=${location.lng}&maxradiuskm=200&limit=5`);
    
    if (!response.ok) throw new Error("Failed to fetch earthquake data");
    
    const data = await response.json();
    
    let earthquakes = [];
    if (data.features && data.features.length > 0) {
      for (const feature of data.features) {
        const eq = await prisma.earthquake.create({
          data: {
            locationId: location.id,
            magnitude: feature.properties.mag,
            place: feature.properties.place,
            depth: feature.geometry.coordinates[2],
            time: new Date(feature.properties.time),
            source: "USGS"
          }
        });
        earthquakes.push(eq);
      }
    }

    res.json({ success: true, data: earthquakes });
  } catch (error) {
    console.error("Earthquake data error:", error);
    res.status(503).json({ success: false, error: "Live data unavailable" });
  }
});

// GET /api/locations/:id/precipitation
app.get("/api/locations/:id/precipitation", async (req, res) => {
  try {
    const location = await prisma.location.findUnique({ where: { id: req.params.id } });
    if (!location) return res.status(404).json({ error: "Location not found" });

    // NASA POWER API for precipitation (Requires YYYYMMDD string for start and end)
    const today = new Date();
    const dateStr = today.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD
    
    const response = await fetch(`https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR&community=RE&longitude=${location.lng}&latitude=${location.lat}&start=${dateStr}&end=${dateStr}&format=JSON`);
    
    if (!response.ok) throw new Error("Failed to fetch NASA GPM data");
    
    const data = await response.json();
    
    // The data comes as a map of date -> value
    const precipMap = data.properties?.parameter?.PRECTOTCORR;
    const amount = precipMap ? Object.values(precipMap)[0] as number : 0;
    
    // Ignore -999 which NASA POWER uses for null/missing
    const actualAmount = amount === -999 ? 0 : amount;

    const precip = await prisma.precipitation.create({
      data: {
        locationId: location.id,
        amount: actualAmount,
        source: "NASA GPM",
        timestamp: new Date()
      }
    });

    res.json({ success: true, data: precip });
  } catch (error) {
    console.error("Precipitation data error:", error);
    res.status(503).json({ success: false, error: "Live data unavailable" });
  }
});


// GET /api/sensors
app.get("/api/sensors", async (req, res) => {
  try {
    const locationId = req.query.locationId as string;
    const region = req.query.region as string;
    
    if (region && region !== "All Regions") {
      let sensors = await prisma.sensor.findMany({
        where: {
          ...(locationId ? { locationId } : {}),
          location: {
            OR: [
              { state: { equals: region, mode: "insensitive" } },
              { region: { equals: region, mode: "insensitive" } },
              { name: { contains: region, mode: "insensitive" } }
            ]
          }
        },
      });
      return res.json({ success: true, count: sensors.length, data: sensors });
    }

    const sensors = await prisma.sensor.findMany({
      where: locationId ? { locationId } : undefined,
    });
    res.json({ success: true, count: sensors.length, data: sensors });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// POST /api/sensors
app.post("/api/sensors", async (req, res) => {
  try {
    const data = req.body;
    const newSensor = await prisma.sensor.create({ data });
    res.json({ success: true, data: newSensor });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// GET /api/alerts
app.get("/api/alerts", async (req, res) => {
  try {
    const region = req.query.region as string;
    
    if (region && region !== "All Regions") {
      let alerts = await prisma.alert.findMany({
        where: {
          location: {
            OR: [
              { state: { equals: region, mode: "insensitive" } },
              { region: { equals: region, mode: "insensitive" } },
              { name: { contains: region, mode: "insensitive" } }
            ]
          }
        }
      });
      return res.json({ success: true, count: alerts.length, data: alerts });
    }

    const alerts = await prisma.alert.findMany();
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// POST /api/alerts
app.post("/api/alerts", async (req, res) => {
  try {
    const data = req.body;
    const newAlert = await prisma.alert.create({ data });
    res.json({ success: true, data: newAlert });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// GET /api/emergency-resources
app.get("/api/emergency-resources", async (req, res) => {
  try {
    const region = req.query.region as string;
    
    if (region && region !== "All Regions") {
      let resources = await prisma.emergencyResource.findMany({
        where: {
          location: {
            OR: [
              { state: { equals: region, mode: "insensitive" } },
              { region: { equals: region, mode: "insensitive" } },
              { name: { contains: region, mode: "insensitive" } }
            ]
          }
        }
      });
      return res.json({ success: true, count: resources.length, data: resources });
    }

    const resources = await prisma.emergencyResource.findMany();
    res.json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// POST /api/emergency-resources
app.post("/api/emergency-resources", async (req, res) => {
  try {
    const data = req.body;
    const newResource = await prisma.emergencyResource.create({ data });
    res.json({ success: true, data: newResource });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// DELETE fallback
app.delete("/api/locations/:id", async (req, res) => {
  try {
    await prisma.location.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
