export async function generateDynamicData(region: string) {
  try {
    // 1. Get Coordinates for the Region via Open-Meteo Geocoding API
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(region)}&count=1`
    );
    const geoData = await geoResponse.json();

    let lat = 20.5937; // Default to India center
    let lng = 78.9629;
    let locationName = region;

    if (geoData.results && geoData.results.length > 0) {
      lat = geoData.results[0].latitude;
      lng = geoData.results[0].longitude;
      locationName = geoData.results[0].name;
    }

    // 2. Fetch Weather Data (Precipitation & Soil Moisture) via Open-Meteo Weather API
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=precipitation,soil_moisture_0_to_1cm`
    );
    const weatherData = await weatherResponse.json();

    const rainfall = weatherData.current?.precipitation || Math.floor(Math.random() * 200) + 50;
    const soilMoisture = (weatherData.current?.soil_moisture_0_to_1cm * 100) || Math.floor(Math.random() * 40) + 40;
    const slopeAngle = Math.floor(Math.random() * 30) + 10;
    const riskScore = Math.floor(Math.random() * 100);

    const location = {
      id: `loc-${Date.now()}`,
      name: `${locationName} Risk Zone`,
      region: region,
      coordinates: [lat, lng],
      riskScore: riskScore,
      rainfall: rainfall,
      soilMoisture: soilMoisture,
      slopeAngle: slopeAngle,
      status: riskScore > 75 ? "High Risk" : riskScore > 50 ? "Moderate" : "Safe",
      lastUpdated: new Date().toISOString(),
    };

    const sensors = [
      {
        id: `sens-r-${Date.now()}`,
        locationId: location.id,
        type: "Rainfall",
        status: "Active",
        value: `${rainfall} mm`,
        lastReading: new Date().toISOString(),
      },
      {
        id: `sens-s-${Date.now()}`,
        locationId: location.id,
        type: "Soil Moisture",
        status: "Active",
        value: `${soilMoisture}%`,
        lastReading: new Date().toISOString(),
      }
    ];

    const alerts = [];
    if (riskScore > 75) {
      alerts.push({
        id: `alert-${Date.now()}`,
        locationId: location.id,
        type: "Evacuation",
        severity: "Critical",
        message: `Immediate evacuation recommended for ${locationName} area.`,
        timestamp: new Date().toISOString(),
        isActive: true,
      });
    }

    const resources = [
      {
        id: `res-${Date.now()}`,
        locationId: location.id,
        type: "Shelter",
        capacity: Math.floor(Math.random() * 500) + 100,
        available: Math.floor(Math.random() * 200) + 50,
        status: "Available",
      }
    ];

    return {
      locations: [location],
      sensors: sensors,
      alerts: alerts,
      resources: resources,
    };
  } catch (error) {
    console.error("Error generating dynamic data:", error);
    return { locations: [], sensors: [], alerts: [], resources: [] };
  }
}
