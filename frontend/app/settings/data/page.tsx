"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";

export default function DataManagementPage() {
  const [formData, setFormData] = useState({
    name: "",
    district: "",
    state: "",
    region: "",
    riskLevel: "LOW",
    riskScore: 20,
    rainfall24h: 0,
    waterLevel: 0,
    soilMoisture: 0,
    aiConfidence: 80,
    lat: 0,
    lng: 0,
    population: 10000,
    vulnerabilityIndex: 0.5,
    evacuationRoutes: 2,
    lastUpdated: new Date().toISOString(),
  });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;
    if (type === "number") {
      parsedValue = Number(value);
    }
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Submitting...");
    try {
      const res = await fetch("http://localhost:3001/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, lastUpdated: new Date().toISOString() }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(`Successfully added location: ${data.data.name}`);
        setFormData({ ...formData, name: "", district: "" }); // Reset some fields
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <AppShell title="Data Management">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Data</h1>
          <p className="text-slate-400">Add custom locations to your real database.</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Add New Location</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">District</label>
                <input required type="text" name="district" value={formData.district} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">State</label>
                <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Region</label>
                <input required type="text" name="region" value={formData.region} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" placeholder="e.g. California" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Risk Level</label>
                <select name="riskLevel" value={formData.riskLevel} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white">
                  <option value="LOW">LOW</option>
                  <option value="MODERATE">MODERATE</option>
                  <option value="HIGH">HIGH</option>
                  <option value="SEVERE">SEVERE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Risk Score (0-100)</label>
                <input required type="number" name="riskScore" value={formData.riskScore} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Latitude</label>
                <input required type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Longitude</label>
                <input required type="number" step="any" name="lng" value={formData.lng} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white" />
              </div>
            </div>

            <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors">
              Save Location
            </button>
            
            {status && (
              <p className="mt-4 text-sm font-medium text-blue-400">{status}</p>
            )}
          </form>
        </div>
      </div>
    </AppShell>
  );
}
