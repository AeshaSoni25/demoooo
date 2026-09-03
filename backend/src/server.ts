import express from "express";
import cors from "cors";
import "tsconfig-paths/register";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// GET /api/locations
app.get("/api/locations", async (req, res) => {
  try {
    const region = req.query.region as string;
    const locations = await prisma.location.findMany({
      where: region && region !== "All Regions" ? { region } : undefined,
    });
    res.json({ success: true, count: locations.length, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// POST /api/locations
app.post("/api/locations", async (req, res) => {
  try {
    const data = req.body;
    const newLocation = await prisma.location.create({ data });
    res.json({ success: true, data: newLocation });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

// GET /api/sensors
app.get("/api/sensors", async (req, res) => {
  try {
    const locationId = req.query.locationId as string;
    const region = req.query.region as string;
    const sensors = await prisma.sensor.findMany({
      where: {
        ...(locationId ? { locationId } : {}),
        ...(region && region !== "All Regions" ? { location: { region } } : {}),
      },
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
    const alerts = await prisma.alert.findMany({
      where: region && region !== "All Regions" ? { location: { region } } : undefined,
    });
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
    const resources = await prisma.emergencyResource.findMany({
      where: region && region !== "All Regions" ? { location: { region } } : undefined,
    });
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
